(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "denserec-debug",
    type: "playground",
    eyebrow: "Playground · DenseRec · MovieLens-1M",
    title: "DenseRec debugging playground",
    playground: {
      composition: "instrument", view: "sequence-builder", sessionKey: "denserec-debug-sequence",
      modelLabel: "DenseRec debug · MovieLens-1M",
      scenario: {
        modelId: "pred-denserec-p05-e5-masked-1000-ml1m", history: { ids: [3820], idSpace: "original" },
        topK: 5, filterHistory: true, allowEmptyHistory: true, candidateScope: "all"
      },
      controls: {
        model: true, allowedModels: ["pred-denserec-p05-e5-masked-1000-ml1m", "pred-denserec-p05-e5-masked-500-ml1m", "pred-denserec-p1-e5-masked-1000-ml1m", "pred-denserec-p1-e5-masked-500-ml1m", "pred-denserec-p05-e5-500-ml1m", "pred-denserec-p1-e5-500-ml1m", "pred-denserec-p05-e5-long-ml1m", "pred-denserec-p1-e5-long-ml1m", "pred-denserec-p05-e5-ml1m", "pred-denserec-p1-e5-ml1m", "pred-nearest-warm-e5-ml1m", "content-knn-e5-ml1m", "pred-denserec-p0-ml1m", "pred-denserec-p05-ml1m", "pred-denserec-p05-long-ml1m", "pred-denserec-p1-ml1m", "pred-nearest-warm-ml1m", "content-knn-ml1m"],
        topK: true, filterHistory: true, clear: true, coldStart: true
      },
      behavior: { autoRecommend: true, recommendationClick: "append", searchLimit: 6, maxVisibleHistory: 8 }
    }
  });
})();
