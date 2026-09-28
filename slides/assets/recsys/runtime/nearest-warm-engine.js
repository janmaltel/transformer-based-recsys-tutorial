(function (root) {
  "use strict";

  // Reuse the exact base model for sequence encoding and scores. Only identity
  // routing and candidate expansion belong to this inference-only adapter.
  function infer(manifest, rawHistory, options) {
    var runtime = root.GSASRecBrowser;
    var base = root.GSASRecModels[manifest.baseModelId];
    if (!base || base.source.checkpointSha256 !== manifest.source.checkpointSha256) {
      throw new Error("Nearest-warm base checkpoint is missing or mismatched");
    }
    var history = rawHistory.map(Number).slice(-base.config.maxSequenceLength);
    if ((!history.length && !options.allowEmptyHistory) || history.some(function (id) {
      return !runtime.supportsInput(manifest, id);
    })) throw new Error("Use items from this model's catalog; empty history requires opt-in");
    var proxies = manifest.serving.warmProxyIds;
    var routedHistory = history.map(function (id) { return proxies[id] || id; });
    var result = runtime.infer(base.id, routedHistory, {
      topK: base.config.numItems, filterRated: false,
      allowEmptyHistory: options.allowEmptyHistory
    });
    var scores = new Map(result.recommendations.map(function (item) { return [item.itemId, item.score]; }));
    var seen = new Set(options.filterRated !== false ? history : []);
    var scope = options.candidateScope || "all";
    var nativeIds = scope === "cold" ? manifest.serving.coldNativeIds
      : scope === "known" ? manifest.serving.knownNativeIds
        : manifest.itemIds.nativeToCanonical.slice(1).map(function (_id, index) { return index + 1; });
    var candidates = nativeIds.map(function (native) {
      var id = manifest.itemIds.nativeToCanonical[native];
      return { itemId: id, score: scores.get(proxies[id] || id) };
    }).filter(function (item) { return !seen.has(item.itemId); });
    candidates.sort(function (a, b) { return b.score - a.score || a.itemId - b.itemId; });
    var target = Number(options.targetItemId) || null;
    var targetIndex = candidates.findIndex(function (item) { return item.itemId === target; });
    return {
      manifest: manifest, history: history, routedHistory: routedHistory,
      emptyHistory: !history.length, attention: result.attention,
      recommendations: candidates.slice(0, options.topK || 10), targetItemId: target,
      targetRank: targetIndex < 0 ? null : targetIndex + 1,
      targetScore: targetIndex < 0 ? null : candidates[targetIndex].score
    };
  }

  root.GSASRecBrowser.inferNearestWarm = infer;
})(globalThis);
