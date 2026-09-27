(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-bce-gradients",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "BCE loss and logit gradients differ",
  "subtitle": "A confident false positive drives log(1 − σ(s)) towards −∞.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Wrong high score",
        "body": "For a negative item, log(1 − σ(s)) → −∞ as σ(s) → 1; its contribution to the loss grows.",
        "step": 0
      },
      {
        "label": "Bounded derivative",
        "body": "For its loss term L₋ = −log(1 − σ(s)), ∂L₋/∂s = σ(s), between 0 and 1.",
        "step": 1
      },
      {
        "label": "Back to embeddings",
        "bridge": "idea",
        "body": "For s = hᵀe, ∂L/∂h = (∂L/∂s)e and ∂L/∂e = (∂L/∂s)h.",
        "step": 2
      }
    ],
    "formula": "\\[L_{\\mathrm{BCE}}=-\\frac{1}{k+1}\\left[\\log\\sigma(s_+)+\\sum_{j=1}^{k}\\log\\left(1-\\sigma(s_j^-)\\right)\\right]\\]",
    "note": "Original BCE notation. An unbounded loss term does not imply an unbounded derivative with respect to its logit."
  }
});
})();
