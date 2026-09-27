(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-sampling-bias",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "Sampling changes the class balance",
  "subtitle": "Fewer negatives → more positives in the training mix → inflated scores.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Thin out the negatives",
        "body": "Keep the observed next item; sample only a few of the many alternatives.",
        "step": 0
      },
      {
        "label": "Change what the model sees",
        "body": "The training examples now contain a much larger share of positives than the catalogue.",
        "step": 1
      },
      {
        "label": "Scores inflate",
        "bridge": "idea",
        "body": "The model learns that positives are far more common, so many top-ranked items receive sigmoid scores near 1.0.",
        "step": 2
      }
    ],
    "diagram": "sampling",
    "diagramLabel": "Catalog versus sampled training: one observed positive is retained while only k negatives are used."
  }
});
})();
