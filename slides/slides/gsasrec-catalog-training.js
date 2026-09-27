(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-catalog-training",
  "type": "sasrec",
  "eyebrow": "Block 2 · Large catalogue training",
  "title": "Small catalogue, large catalogue",
  "subtitle": "One observed positive. How do we train against the entire catalogue?",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec",
    "covington2016youtube",
    "amazon2025selection",
    "spotify2026catalogue"
  ],
  "scaling": {
    "layout": "catalog-comparison",
    "diagram": "catalog",
    "diagramLabel": "Small academic catalogue with one positive among thousands of alternatives; a larger flat catalogue then becomes a three-dimensional volume illustrating one barely visible positive among hundreds of millions of competing items.",
    "catalogues": [
      {
        "label": "Small catalogue",
        "example": "Filtered academic benchmarks · MovieLens-1M",
        "items": 3416,
        "countLabel": "≈ 3,400 items in our SASRec example",
        "step": 0
      },
      {
        "label": "Large catalogue",
        "example": "Production · YouTube / Amazon / Spotify",
        "countLabel": "Millions of items",
        "step": 1,
        "realityLabel": "Reality: hundreds of millions of alternatives",
        "realityRatioLabel": "1 positive vs hundreds of millions of negatives"
      }
    ],
    "points": [
      {
        "label": "Small benchmarks",
        "body": "One observed next item competes with a few thousand alternatives.",
        "step": 0
      },
      {
        "label": "At production scale",
        "body": "One observed next item competes with millions of alternatives.",
        "step": 1
      },
      {
        "label": "What issues will we have?",
        "bridge": "question",
        "body": "How much time and memory will it take to score every item at every training position?",
        "step": 2
      }
    ],
    "note": "Catalogue sizes and geometry are illustrative. Green: observed positive. Amber: competing items."
  }
});
})();
