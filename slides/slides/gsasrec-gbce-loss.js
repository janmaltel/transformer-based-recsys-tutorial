(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-gbce-loss",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "gSASRec: same architecture, corrected training",
  "subtitle": "Keep SASRec. Add negatives. Adjust the loss.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "layout": "recipe",
    "diagram": "gsasrec-recipe",
    "diagramLabel": "Three-stage gSASRec schematic: the same causal SASRec encoder and item embeddings first score a positive and one negative; more negatives appear as a stack of sampled items; then gBCE adjusts the positive term to compensate for sampling-induced class imbalance.",
    "formula": "\\[L_{\\mathrm{gBCE}}=-\\frac{1}{k+1}\\left[\\textcolor{#087f73}{\\log\\left(\\sigma^{\\beta}(s_+)\\right)}+\\sum_{j=1}^{k}\\log\\left(1-\\sigma(s_j^-)\\right)\\right]\\]",
    "formulaStep": 2,
    "points": [
      {
        "label": "Designed to undo the sampling distortion",
        "bridge": "idea",
        "body": "β adjusts the positive term to undo the class-balance distortion from sampling; the negative terms remain BCE.",
        "step": 2
      }
    ],
    "note": "Theoretical calibration assumes uniform sampling and an expected-loss optimum. Finite data and optimization still affect calibration."
  }
});
})();
