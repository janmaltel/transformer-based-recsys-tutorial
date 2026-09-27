(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-loss-choices",
  "type": "sasrec",
  "eyebrow": "Block 2 · Training objectives",
  "title": "Training against a large catalogue",
  "subtitle": "Keep SASRec: score a tiny sample, or score the entire catalogue?",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "kang2018sasrec",
    "sun2019bert4rec"
  ],
  "scaling": {
    "layout": "catalog-comparison",
    "diagram": "loss-choices",
    "diagramLabel": "Original SASRec uses an independent binary loss for one positive and one sampled negative. Full softmax cross-entropy combines the positive score and many individual candidate scores, continued by an ellipsis, into one distribution over the entire catalogue.",
    "points": [
      {
        "label": "BCE + negative sampling",
        "body": "Original SASRec scores only the positive and one sampled negative per training position.",
        "step": 0
      },
      {
        "label": "Softmax cross-entropy",
        "body": "Used by BERT4Rec: score every catalogue item to make one multiclass prediction.",
        "step": 1
      },
      {
        "label": "Quality at what cost?",
        "bridge": "question",
        "body": "Can a tiny sample rank well? What does scoring millions of items cost?",
        "step": 2
      }
    ],
    "note": "Loss and candidate set both change in this comparison. BERT4Rec uses masked-item training; here we compare the two losses with the same SASRec encoder."
  }
});
})();
