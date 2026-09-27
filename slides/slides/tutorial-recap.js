(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "tutorial-recap",
    type: "sasrec",
    eyebrow: "Summary",
    title: "What we learned",
    sasrecVisual: "scaling-slide",
    buildSteps: 1,
    scaling: {
      points: [
        {
          label: "SASRec",
          body: "A history becomes a user vector. Dot products score candidate items.",
          step: 0
        },
        {
          label: "Loss and sampling",
          body: "More negatives and a corrected loss can improve ranking with the same encoder.",
          step: 0
        },
        {
          label: "RecJPQ",
          body: "Shared embedding parts can cut memory and enable score reuse and exact pruning.",
          step: 0
        },
        {
          label: "Semantic IDs",
          body: "Compact IDs support generative retrieval. Beam search can miss high-scoring items.",
          step: 0
        },
        {
          label: "Cold-start",
          body: "Empty histories need an initial policy. Unseen items need content or other features.",
          step: 0
        },
        {
          label: "Model capacity",
          body: "PCTM rivals SASRec on several benchmarks. More capacity does not guarantee better ranking.",
          step: 0
        }
      ]
    }
  });
})();
