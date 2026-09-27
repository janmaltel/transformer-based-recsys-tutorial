(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-model",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "gSASRec: the same causal encoder",
  "subtitle": "More negatives + generalized BCE.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Sequence model",
        "body": "Use the SASRec representation h at each training position.",
        "step": 0
      },
      {
        "label": "Scoring",
        "body": "Dot-product scores for the next observed item and k sampled negatives.",
        "step": 1
      },
      {
        "label": "Optimization",
        "body": "Backpropagate gBCE through the encoder and item embeddings; the loss changes the training signal, not the SASRec architecture.",
        "step": 2
      }
    ],
    "diagram": "model",
    "diagramLabel": "History items enter a causal SASRec encoder, whose output scores one positive and multiple negatives before gBCE."
  }
});
})();
