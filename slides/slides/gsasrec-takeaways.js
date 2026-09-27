(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-takeaways",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "What we learned from gSASRec",
  "subtitle": "Large catalogue → negative sampling → overconfidence → corrected training.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Large catalogue",
        "body": "Scoring every item at every training position is expensive. We train with sampled negatives.",
        "step": 0
      },
      {
        "label": "Overconfident top scores",
        "body": "Sampling changes class balance: many top movies score close to 1.0, as if the user would watch them all simultaneously.",
        "step": 1
      },
      {
        "label": "Same encoder, corrected loss",
        "body": "Keep SASRec. Add more negatives and adjust the positive term with gBCE, restoring probability differences among top items.",
        "step": 2
      }
    ],
    "note": "In our example, gSASRec also brings total predicted probability close to one next movie."
  }
});
})();
