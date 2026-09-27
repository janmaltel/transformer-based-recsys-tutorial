(function (root) {
  "use strict";

  var f32 = Math.fround;

  function infer(model, rawHistory, options) {
    var manifest = model.manifest;
    var count = manifest.config.numItems;
    var history = rawHistory.map(Number).slice(-manifest.config.maxSequenceLength);
    if ((!history.length && !options.allowEmptyHistory) || history.some(function (id) {
      return !root.GSASRecBrowser.supportsItem(manifest, id);
    })) {
      throw new Error("Use items from the PCTM catalog and a nonempty history.");
    }
    // The reference kernels are fixed positional weights, not attention.
    // Packed by supported length: 1, then 2, …, then 200 entries.
    var offset = history.length * (history.length - 1) / 2;
    var weights = model.tensor("history_kernels").subarray(offset, offset + history.length);
    var evidence = model.tensor("transition_evidence");
    var popularity = model.tensor("log_popularity");
    var ties = model.tensor("tie_ranks");
    var scores = new Float32Array(count);
    // Preserve the reference recent-first CSR accumulation, including repeats.
    for (var age = 0; age < history.length; age += 1) {
      var id = history[history.length - 1 - age];
      var row = (manifest.itemIds.canonicalToNative[id] - 1) * count;
      for (var candidate = 0; candidate < count; candidate += 1) {
        scores[candidate] += weights[age] * evidence[row + candidate];
      }
    }
    var boost = f32(manifest.config.popBoost);
    var seen = new Set(history);
    var ranking = [];
    for (var native = 0; native < count; native += 1) {
      scores[native] += f32(boost * popularity[native]);
      var canonical = manifest.itemIds.nativeToCanonical[native + 1];
      if (options.filterRated !== false && seen.has(canonical)) continue;
      ranking.push({ itemId: canonical, score: scores[native], tie: ties[native] });
    }
    ranking.sort(function (a, b) { return b.score - a.score || a.tie - b.tie; });
    var targetIndex = ranking.findIndex(function (item) {
      return item.itemId === Number(options.targetItemId);
    });
    return {
      manifest: manifest, history: history, emptyHistory: !history.length,
      recommendations: ranking.slice(0, options.topK || 10).map(function (item) {
        return { itemId: item.itemId, score: item.score };
      }),
      historyWeights: Array.from(weights).reverse(), attention: [],
      targetItemId: Number(options.targetItemId) || null,
      targetRank: targetIndex >= 0 ? targetIndex + 1 : null,
      targetScore: targetIndex >= 0 ? ranking[targetIndex].score : null,
      scoresInNativeOrder: options.returnAllScores ? scores : null
    };
  }

  root.GSASRecBrowser.inferPCTM = infer;
})(globalThis);
