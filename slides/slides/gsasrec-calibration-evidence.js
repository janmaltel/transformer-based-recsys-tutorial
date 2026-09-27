(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-calibration-evidence",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "Calibration in the reported experiment",
  "subtitle": "Steam · original paper’s offline diagnostic.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 2,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Scores",
        "body": "Increasing calibration strength changes the predicted probability scale.",
        "step": 0
      },
      {
        "label": "Diagnostic",
        "body": "Compare average predicted scores with held-out precision at a rank cutoff.",
        "step": 1
      }
    ],
    "figure": "gsasrec-steam-calibration",
    "figureAlt": "Original Steam plots of predicted score by item rank and calibration control.",
    "note": "Held-out precision is an offline relevance proxy. This plot does not establish calibrated live-user click probabilities."
  }
});
})();
