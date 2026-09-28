(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "denserec-playground",
    type: "playground",
    eyebrow: "Playground · Item cold-start · MovieLens-1M",
    title: "DenseRec recommendations",
    playground: {
      composition: "instrument", view: "sequence-builder", sessionKey: "denserec-sequence",
      modelLabel: "DenseRec · MovieLens-1M",
      scenario: {
        modelId: "pred-denserec-p05-e5-masked-1000-ml1m", history: { ids: [], idSpace: "original" },
        topK: 5, filterHistory: true, allowEmptyHistory: true, candidateScope: "all"
      },
      controls: {
        model: true,
        allowedModels: ["gsasrec-ml1m", "gsasrec-nearest-warm-e5-ml1m", "pred-denserec-p05-e5-masked-1000-ml1m", "pred-denserec-p1-e5-masked-1000-ml1m"],
        modelPresentation: {
          "gsasrec-ml1m": { label: "SASRec" },
          "gsasrec-nearest-warm-e5-ml1m": { label: "Nearest-warm SASRec" },
          "pred-denserec-p05-e5-masked-1000-ml1m": { label: "DenseRec p=0.5" },
          "pred-denserec-p1-e5-masked-1000-ml1m": { label: "Content-only SASRec" }
        },
        topK: true, filterHistory: true, clear: true, coldStart: true
      },
      behavior: { autoRecommend: true, recommendationClick: "append", searchLimit: 6, maxVisibleHistory: 8 }
    }
  });
})();
