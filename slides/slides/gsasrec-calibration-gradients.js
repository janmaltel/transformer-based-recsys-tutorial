(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-calibration-gradients",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "What changes in the gradient?",
  "subtitle": "The positive term is downweighted relative to the sampled negatives.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 2,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Positive logit",
        "body": "∂L/∂s₊ = β(σ(s₊) − 1)/(k + 1).",
        "step": 0
      },
      {
        "label": "Negative logits",
        "body": "∂L/∂sⱼ⁻ = σ(sⱼ⁻)/(k + 1). The negative terms keep their weights.",
        "step": 1
      }
    ],
    "figure": "gbce-gradient-balance",
    "figureAlt": "Original three-panel illustration of score updates for calibration t equal to 0, 0.75 and 1.",
    "note": "Source illustration uses different vertical scales and omits the common mean factor. Read the arrows as update directions, not comparable absolute lengths."
  }
});
})();
