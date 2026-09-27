(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "hands-on-playground",
    type: "playground",
    eyebrow: "Running example · Interactive",
    title: "Next-item recommendations",
    playground: {
      composition: "teaching",
      view: "sequence-builder",
      sessionKey: "hands-on-sequence",
      scenario: {
        modelId: "gsasrec-ml1m",
        history: {
          ids: [],
          idSpace: "original"
        },
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
      }
    }
  });
})();
