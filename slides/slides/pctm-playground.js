(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "pctm-playground",
    type: "playground",
    eyebrow: "PCTM and SASRec · Live recommendations · MovieLens-1M",
    title: "PCTM and SASRec recommendations",
    playground: {
      composition: "instrument",
      modelLabel: "PCTM · MovieLens-1M",
      view: "sequence-builder",
      sessionKey: "pctm-sequence",
      scenario: {
        modelId: "pctm-ml1m",
        history: { ids: [2571, 1240, 1], idSpace: "original" },
        topK: 5,
        filterHistory: true
      },
      controls: {
        model: true,
        allowedModels: ["pctm-ml1m", "gsasrec-ml1m"],
        modelPresentation: {
          "pctm-ml1m": { label: "PCTM" },
          "gsasrec-ml1m": { label: "SASRec" }
        },
        topK: true,
        filterHistory: true,
        clear: true
      },
      behavior: {
        autoRecommend: true,
        recommendationClick: "append",
        searchLimit: 6,
        maxVisibleHistory: 8
      },
      examples: [
        { label: "Family films", ids: [34, 2, 1] },
        { label: "Matrix → Terminator → Toy Story", ids: [2571, 1240, 1] },
        { label: "Reverse order", ids: [1, 1240, 2571] }
      ]
    }
  });
})();
