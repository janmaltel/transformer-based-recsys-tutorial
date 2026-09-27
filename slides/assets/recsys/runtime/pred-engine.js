(function (root) {
  "use strict";
  var math = root.GSASRecBrowser.math;

  function add(a, b) {
    return Float32Array.from(a, function (value, i) { return value + b[i]; });
  }

  function affine(input, rows, model, prefix, inputSize, outputSize) {
    var out = new Float32Array(rows * outputSize);
    var weight = model.tensor(prefix + ".weight"), bias = model.tensor(prefix + ".bias");
    for (var row = 0; row < rows; row++) {
      out.set(math.linearVector(input.subarray(row * inputSize, (row + 1) * inputSize),
        weight, bias, outputSize, inputSize), row * outputSize);
    }
    return out;
  }

  function norm(input, rows, dimension, model, prefix) {
    return math.layerNormSequence(input, rows, dimension,
      model.tensor(prefix + ".weight"), model.tensor(prefix + ".bias"));
  }

  // erf approximation with absolute error < 1.5e-7 (A&S 7.1.26).
  // pred uses exact GELU, x * (1 + erf(x / sqrt(2))) / 2, not tanh GELU.
  function gelu(x) {
    var z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.3275911 * z);
    var polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t
      - 0.284496736) * t + 0.254829592) * t;
    var tail = polynomial * Math.exp(-z * z);
    return x * (x < 0 ? tail : 2 - tail) / 2;
  }

  function attention(input, rows, dimension, heads, model, prefix, padding) {
    var fused = affine(input, rows, model, prefix + ".qkv_proj", dimension, 3 * dimension);
    var output = new Float32Array(rows * dimension), width = dimension / heads;
    var lastWeights = [];
    for (var head = 0; head < heads; head++) {
      var qkv = [0, 1, 2].map(function (part) {
        var values = new Float32Array(rows * width);
        for (var row = 0; row < rows; row++) {
          var start = row * 3 * dimension + part * dimension + head * width;
          values.set(fused.subarray(start, start + width), row * width);
        }
        return values;
      });
      // Positions were already added at their original indices. Compact only
      // the attention operands so real queries cannot read padding keys.
      var validRows = rows - padding, attended = new Float32Array(rows * width);
      var weights = new Float32Array(rows);
      if (validRows) {
        var valid = qkv.map(function (values) { return values.subarray(padding * width); });
        attended.set(math.causalAttentionAll(valid[0], valid[1], valid[2], validRows, width), padding * width);
        weights.set(math.attentionLast(valid[0].subarray((validRows - 1) * width),
          valid[1], valid[2], validRows, width).weights, padding);
      }
      lastWeights.push(Array.from(weights));
      for (var r = 0; r < rows; r++) {
        output.set(attended.subarray(r * width, (r + 1) * width), r * dimension + head * width);
      }
    }
    return { output: affine(output, rows, model, prefix + ".out_proj", dimension, dimension),
      weights: lastWeights };
  }

  function infer(model, rawHistory, options) {
    var manifest = model.manifest, config = manifest.config;
    var history = rawHistory.map(Number).slice(-config.maxSequenceLength);
    if ((!history.length && !options.allowEmptyHistory) || history.some(function (id) {
      return !root.GSASRecBrowser.supportsInput(manifest, id);
    })) throw new Error("Use items from this model's catalog; empty history requires opt-in");
    var nativeHistory = history.map(function (id) { return id < 0 ? id : manifest.itemIds.canonicalToNative[id]; });
    var rows = config.maxSequenceLength, dimension = config.embeddingDim;
    var embedding = model.tensor("item_encoder.embedding.weight");
    var positions = model.tensor("position_embedding.weight");
    var sequence = new Float32Array(rows * dimension), start = rows - history.length;
    var padding = config.maskPaddingKeys ? start : 0;
    // Legacy checkpoints keep PAD positions active; masked checkpoints zero them.
    for (var row = 0; row < rows; row++) {
      if (row < padding) continue;
      var id = row < start ? 0 : nativeHistory[row - start];
      var textVector = id < 0 ? manifest.textInputs[id].embedding : null;
      for (var axis = 0; axis < dimension; axis++) {
        sequence[row * dimension + axis] = (textVector ? textVector[axis] : embedding[id * dimension + axis]) + positions[row * dimension + axis];
      }
    }
    var attended;
    for (var block = 0; block < config.numBlocks; block++) {
      var prefix = "blocks." + block;
      attended = attention(norm(sequence, rows, dimension, model, prefix + ".ln1"),
        rows, dimension, config.numHeads, model, prefix + ".attn", padding);
      sequence = add(sequence, attended.output);
      var normalized = norm(sequence, rows, dimension, model, prefix + ".ln2");
      var hidden = affine(normalized, rows, model, prefix + ".ffn.0", dimension, 4 * dimension);
      for (var i = 0; i < hidden.length; i++) hidden[i] = gelu(hidden[i]);
      sequence = add(sequence, affine(hidden, rows, model, prefix + ".ffn.3", 4 * dimension, dimension));
      if (padding) sequence.fill(0, 0, padding * dimension);
    }
    var vector = math.layerNormVector(sequence.subarray((rows - 1) * dimension),
      model.tensor("final_norm.weight"), model.tensor("final_norm.bias"), dimension);
    if (padding === rows) vector.fill(0);
    var seen = new Set(options.filterRated !== false ? nativeHistory : []), candidates = [];
    var eligible = options.candidateScope === "cold" && manifest.serving
      ? new Set(manifest.serving.coldNativeIds) : options.candidateScope === "known" && manifest.serving
        ? new Set(manifest.serving.knownNativeIds) : null;
    for (var native = 1; native <= config.numItems; native++) {
      if (seen.has(native) || (eligible && !eligible.has(native))) continue;
      var score = 0;
      for (var column = 0; column < dimension; column++) {
        score += vector[column] * embedding[native * dimension + column];
      }
      candidates.push({ itemId: manifest.itemIds.nativeToCanonical[native], score: score, nativeId: native });
    }
    candidates.sort(function (a, b) { return b.score - a.score || a.nativeId - b.nativeId; });
    var target = Number(options.targetItemId) || null;
    var targetIndex = candidates.findIndex(function (item) { return item.itemId === target; });
    return {
      manifest: manifest, history: history, emptyHistory: !history.length,
      recommendations: candidates.slice(0, options.topK || 10).map(function (item) {
        return { itemId: item.itemId, score: item.score };
      }),
      targetItemId: target, targetRank: targetIndex < 0 ? null : targetIndex + 1,
      targetScore: targetIndex < 0 ? null : candidates[targetIndex].score,
      // Preserve heads and PAD positions explicitly; these are not Sasha's one-head weights.
      attention: [], attentionHeads: attended.weights, attentionPadding: start
    };
  }
  root.GSASRecBrowser.inferPred = infer;
})(globalThis);
