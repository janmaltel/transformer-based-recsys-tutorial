(function (root) {
  "use strict";

  // Movie rows are unit-normalized offline. There are no learned sequence weights.
  class KNNRecommender {
    constructor(model) {
      this.model = model;
    }

    recommend(rawHistory, options) {
      options = options || {};
      var model = this.model, manifest = model.manifest, config = manifest.config;
      var history = rawHistory.map(Number).slice(-config.maxSequenceLength);
      if ((!history.length && !options.allowEmptyHistory) || history.some(function (id) {
        return !root.GSASRecBrowser.supportsInput(manifest, id);
      })) throw new Error("Use items from this model's catalog; empty history requires opt-in");
      var target = Number(options.targetItemId) || null;
      var result = { manifest: manifest, history: history, emptyHistory: !history.length,
        recommendations: [], targetItemId: target, targetRank: null, targetScore: null,
        attention: [], queryPolicy: "last-input" };
      if (!history.length) return result;
      var queryId = history[history.length - 1], dimension = config.embeddingDim;
      var embedding = model.tensor("content.embedding");
      var native = manifest.itemIds.canonicalToNative[queryId];
      var query = queryId < 0 ? manifest.textInputs[queryId].embedding
        : embedding.subarray(native * dimension, (native + 1) * dimension);
      var norm = Math.sqrt(query.reduce(function (sum, v) { return sum + v * v; }, 0));
      if (!Number.isFinite(norm) || !norm) throw new Error("KNN query must be finite and nonzero");
      var seen = new Set(options.filterRated !== false ? history : []);
      var scope = options.candidateScope || "all";
      if (["all", "cold", "known"].indexOf(scope) < 0) throw new Error("Unknown candidate scope");
      var eligible = scope === "cold" ? new Set(manifest.serving.coldNativeIds)
        : scope === "known" ? new Set(manifest.serving.knownNativeIds) : null;
      var candidates = [];
      for (var id = 1; id <= config.numItems; id++) {
        var canonical = manifest.itemIds.nativeToCanonical[id];
        if (seen.has(canonical) || (eligible && !eligible.has(id))) continue;
        var score = 0, candidateNorm = 0;
        for (var axis = 0; axis < dimension; axis++) {
          var value = embedding[id * dimension + axis];
          score += query[axis] * value;
          candidateNorm += value * value;
        }
        candidates.push({ itemId: canonical, nativeId: id, score: score / (norm * Math.sqrt(candidateNorm)) });
      }
      candidates.sort(function (a, b) { return b.score - a.score || a.nativeId - b.nativeId; });
      var targetIndex = candidates.findIndex(function (item) { return item.itemId === target; });
      result.recommendations = candidates.slice(0, options.topK || 10).map(function (item) {
        return { itemId: item.itemId, score: item.score };
      });
      result.targetRank = targetIndex < 0 ? null : targetIndex + 1;
      result.targetScore = targetIndex < 0 ? null : candidates[targetIndex].score;
      result.queryItemId = queryId;
      return result;
    }
  }
  root.GSASRecBrowser.KNNRecommender = KNNRecommender;
  root.GSASRecBrowser.inferKNN = function (model, history, options) {
    return new KNNRecommender(model).recommend(history, options);
  };
})(globalThis);
