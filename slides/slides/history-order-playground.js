(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "history-order-playground",
    type: "playground",
    eyebrow: "History order · Interactive",
    title: "Recommendations and history order",
    playground: {
      composition: "teaching",
      view: "sequence-builder",
      sessionKey: "history-order-sequence",
      scenario: {
        modelId: "gsasrec-ml1m",
        history: { ids: [34, 2355, 1], idSpace: "original" },
        topK: 5,
        filterHistory: true
      },
      controls: {
        model: false,
        topK: true,
        filterHistory: true,
        clear: true
      },
      behavior: {
        searchOnlyWhenEmpty: true,
        autoRecommend: true,
        recommendationClick: "append",
        searchLimit: 6,
        maxVisibleHistory: 8
      },
      examples: [
        { label: "Babe → A Bug’s Life → Toy Story", ids: [34, 2355, 1] },
        { label: "Toy Story → A Bug’s Life → Babe", ids: [1, 2355, 34] }
      ]
    }
  });
})();
