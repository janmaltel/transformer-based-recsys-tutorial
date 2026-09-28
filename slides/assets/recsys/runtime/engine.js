(function (root) {
  "use strict";

  var math = root.GSASRecBrowser.math;

  function blockWeights(model, index) {
    var prefix = "transformer_blocks." + index + ".";
    function tensor(name) {
      return model.tensor(prefix + name);
    }
    return {
      firstWeight: tensor("first_norm.weight"),
      firstBias: tensor("first_norm.bias"),
      secondWeight: tensor("second_norm.weight"),
      secondBias: tensor("second_norm.bias"),
      queryWeight: tensor("multihead_attention.query_proj.weight"),
      queryBias: tensor("multihead_attention.query_proj.bias"),
      keyWeight: tensor("multihead_attention.key_proj.weight"),
      keyBias: tensor("multihead_attention.key_proj.bias"),
      valueWeight: tensor("multihead_attention.val_proj.weight"),
      valueBias: tensor("multihead_attention.val_proj.bias"),
      dense1Weight: tensor("dense1.weight"),
      dense1Bias: tensor("dense1.bias"),
      dense2Weight: tensor("dense2.weight"),
      dense2Bias: tensor("dense2.bias")
    };
  }

  function add(left, right) {
    var output = new Float32Array(left.length);
    for (var index = 0; index < left.length; index += 1) {
      output[index] = left[index] + right[index];
    }
    return output;
  }

  function relu(values) {
    for (var index = 0; index < values.length; index += 1) {
      values[index] = Math.max(0, values[index]);
    }
    return values;
  }

  function fullBlock(sequence, rows, dimension, weights) {
    var queries = math.layerNormSequence(
      sequence,
      rows,
      dimension,
      weights.firstWeight,
      weights.firstBias
    );
    var q = math.linearSequence(
      queries, rows, weights.queryWeight, weights.queryBias, dimension
    );
    var k = math.linearSequence(
      sequence, rows, weights.keyWeight, weights.keyBias, dimension
    );
    var v = math.linearSequence(
      sequence, rows, weights.valueWeight, weights.valueBias, dimension
    );
    var attended = math.causalAttentionAll(q, k, v, rows, dimension);
    var normalized = math.layerNormSequence(
      add(attended, queries),
      rows,
      dimension,
      weights.secondWeight,
      weights.secondBias
    );
    var hidden = relu(
      math.linearSequence(
        normalized, rows, weights.dense1Weight, weights.dense1Bias, dimension
      )
    );
    var projected = math.linearSequence(
      hidden, rows, weights.dense2Weight, weights.dense2Bias, dimension
    );
    return add(projected, normalized);
  }

  function lastBlock(sequence, rows, dimension, weights) {
    var last = sequence.subarray((rows - 1) * dimension, rows * dimension);
    var query = math.layerNormVector(
      last, weights.firstWeight, weights.firstBias, dimension
    );
    var q = math.linearVector(
      query, weights.queryWeight, weights.queryBias, dimension, dimension
    );
    var k = math.linearSequence(
      sequence, rows, weights.keyWeight, weights.keyBias, dimension
    );
    var v = math.linearSequence(
      sequence, rows, weights.valueWeight, weights.valueBias, dimension
    );
    var attention = math.attentionLast(q, k, v, rows, dimension);
    var normalized = math.layerNormVector(
      add(attention.output, query),
      weights.secondWeight,
      weights.secondBias,
      dimension
    );
    var hidden = relu(
      math.linearVector(
        normalized, weights.dense1Weight, weights.dense1Bias, dimension, dimension
      )
    );
    var projected = math.linearVector(
      hidden, weights.dense2Weight, weights.dense2Bias, dimension, dimension
    );
    return { vector: add(projected, normalized), attention: attention.weights };
  }

  function embed(model, history) {
    var config = model.manifest.config;
    var dimension = config.embeddingDim;
    var itemEmbedding = model.tensor("item_embedding.weight");
    var positionEmbedding = model.tensor("position_embedding.weight");
    var start = config.maxSequenceLength - history.length;
    var sequence = new Float32Array(history.length * dimension);
    history.forEach(function (itemId, row) {
      var itemOffset = itemId * dimension;
      var positionOffset = (start + row) * dimension;
      for (var column = 0; column < dimension; column += 1) {
        sequence[row * dimension + column] =
          itemEmbedding[itemOffset + column] +
          positionEmbedding[positionOffset + column];
      }
    });
    return sequence;
  }

  function rank(model, vector, history, topK, filterRated, targetItemId) {
    var config = model.manifest.config;
    var dimension = config.embeddingDim;
    var outputEmbedding = model.tensor(
      model.manifest.tensors["output_embedding.weight"]
        ? "output_embedding.weight"
        : "item_embedding.weight"
    );
    var rated = new Set(filterRated ? history : []);
    var candidates = [];
    for (var itemId = 1; itemId <= config.numItems; itemId += 1) {
      if (rated.has(itemId)) {
        continue;
      }
      var score = 0;
      var offset = itemId * dimension;
      for (var column = 0; column < dimension; column += 1) {
        score += vector[column] * outputEmbedding[offset + column];
      }
      candidates.push({ itemId: itemId, score: score });
    }
    candidates.sort(function (left, right) {
      return right.score - left.score || left.itemId - right.itemId;
    });
    var targetIndex = candidates.findIndex(function (candidate) {
      return candidate.itemId === targetItemId;
    });
    return {
      recommendations: candidates.slice(0, topK),
      targetRank: targetIndex >= 0 ? targetIndex + 1 : null,
      targetScore: targetIndex >= 0 ? candidates[targetIndex].score : null
    };
  }

  function infer(modelId, rawHistory, options) {
    options = options || {};
    var manifest = root.GSASRecModels && root.GSASRecModels[modelId];
    var model = manifest && manifest.architecture === "nearest-warm-wrapper"
      ? { manifest: manifest } : root.GSASRecBrowser.loadWeights(modelId);
    if (options.candidateScope && ["all", "cold", "known"].indexOf(options.candidateScope) < 0) {
      throw new Error("Unknown candidate scope");
    }
    if (options.candidateScope === "cold" &&
      (!model.manifest.serving || !model.manifest.serving.coldNativeIds || !model.manifest.serving.coldNativeIds.length)) {
      throw new Error("This model has no cold-item catalog");
    }
    if (options.candidateScope === "known" &&
      (!model.manifest.serving || !model.manifest.serving.knownNativeIds)) {
      throw new Error("This model has no training-item catalog");
    }
    if (model.manifest.architecture === "nearest-warm-wrapper") {
      return root.GSASRecBrowser.inferNearestWarm(model.manifest, rawHistory, options);
    }
    if (model.manifest.architecture === "content-knn") {
      return root.GSASRecBrowser.inferKNN(model, rawHistory, options);
    }
    if (model.manifest.architecture === "pctm") {
      return root.GSASRecBrowser.inferPCTM(model, rawHistory, options);
    }
    if (["pred-sasrec", "pred-denserec", "pred-nearest-warm"].indexOf(model.manifest.architecture) >= 0) {
      return root.GSASRecBrowser.inferPred(model, rawHistory, options);
    }
    var config = model.manifest.config;
    if (config.numHeads !== 1) {
      throw new Error("This prototype currently supports one attention head");
    }
    var history = rawHistory
      .map(Number)
      .slice(-config.maxSequenceLength);
    if ((!history.length && !options.allowEmptyHistory) || history.some(function (id) {
      return !Number.isInteger(id) || id < 1 || id > config.numItems;
    })) {
      throw new Error("Use integer item IDs between 1 and " + config.numItems);
    }

    var dimension = config.embeddingDim;
    // In the bundled source, PAD positions are zeroed after every block.
    // For an all-PAD input the final LayerNorm therefore returns its bias.
    // This is a shared checkpoint output, not a trained START-token prior.
    if (!history.length) {
      var emptyRanking = rank(model, model.tensor("seq_norm.bias"), [],
        options.topK || 10, false, Number(options.targetItemId));
      return {
        manifest: model.manifest, history: [], emptyHistory: true,
        recommendations: emptyRanking.recommendations,
        targetItemId: Number(options.targetItemId) || null,
        targetRank: emptyRanking.targetRank, targetScore: emptyRanking.targetScore,
        attention: []
      };
    }
    var sequence = embed(model, history);
    for (var index = 0; index < config.numBlocks - 1; index += 1) {
      sequence = fullBlock(
        sequence, history.length, dimension, blockWeights(model, index)
      );
    }
    var last = lastBlock(
      sequence,
      history.length,
      dimension,
      blockWeights(model, config.numBlocks - 1)
    );
    var vector = math.layerNormVector(
      last.vector,
      model.tensor("seq_norm.weight"),
      model.tensor("seq_norm.bias"),
      dimension
    );
    var ranking = rank(
      model,
      vector,
      history,
      options.topK || 10,
      options.filterRated !== false,
      Number(options.targetItemId)
    );
    return {
      manifest: model.manifest,
      history: history,
      recommendations: ranking.recommendations,
      targetItemId: Number(options.targetItemId) || null,
      targetRank: ranking.targetRank,
      targetScore: ranking.targetScore,
      attention: Array.from(last.attention)
    };
  }

  root.GSASRecBrowser.infer = infer;
})(globalThis);
