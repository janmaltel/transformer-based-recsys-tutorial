(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "user-cold-start-empty-history",
  "type": "sasrec",
  "eyebrow": "Block 2 · User cold-start",
  "title": "Learning from an empty prefix",
  "subtitle": "The loss mask determines whether the first item is a training target.",
  "sasrecVisual": "empty-prefix-training",
  "buildSteps": 3,
  "scaling": {
    "points": [
      {
        "label": "SASRec",
        "body": "PAD states are zeroed. The PAD → first-item target has zero loss weight.",
        "step": 0
      },
      {
        "label": "SASRec + first-item supervision",
        "body": "A learned PAD embedding and loss weight 1 at the final position train the first item. PAD states remain active.",
        "step": 1
      },
      {
        "label": "One shared context",
        "body": "Every empty history has the same representation, so it receives the same ranking. Histories with events can still be personalized.",
        "step": 2
      }
    ],
    "note": "Illustrative movies · the pilot uses 40 PAD inputs and one first-item target per training user, alongside ordinary next-item training."
  },
  "citation": "Kang & McAuley (2018, ICDM) · Petrov & Macdonald (2023, RecSys)"
});
})();
