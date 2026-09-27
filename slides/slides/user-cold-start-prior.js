(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "user-cold-start-prior",
  "type": "sasrec",
  "eyebrow": "Block 2 · User cold-start",
  "title": "A popularity prior over sequence starts",
  "subtitle": "A shared empty context learns which targets most often follow it.",
  "sasrecVisual": "empty-prefix-prior",
  "buildSteps": 3,
  "scaling": {
    "formula": "\\(p^*(j\\mid\\mathrm{START})=c_{\\mathrm{first}}(j)/N\\)",
    "points": [
      {
        "label": "First-item supervision",
        "body": "Full-softmax cross-entropy fits the first-item frequencies in this toy example.",
        "step": 1
      },
      {
        "label": "Which popularity?",
        "body": "A starts most sequences; D occurs most often overall. These are different target distributions.",
        "step": 2
      }
    ],
    "note": "Illustrative data · unconstrained full-softmax optimum. With sampled losses, the negative-sampling distribution also affects the learned scores."
  }
});
})();
