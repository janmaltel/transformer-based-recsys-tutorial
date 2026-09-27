(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-beyond-sequences",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "The objective idea can transfer",
  "subtitle": "A separate retrieval study applies gBCE to shallow cross-encoders.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 2,
  "citationKeys": [
    "petrov2024shallow"
  ],
  "scaling": {
    "points": [
      {
        "label": "Different model",
        "body": "The source compares document re-ranking models, not sequential recommenders.",
        "step": 0
      },
      {
        "label": "Same design question",
        "bridge": "question",
        "body": "What accuracy can a smaller model reach with a better training objective?",
        "step": 1
      }
    ],
    "figure": "gbce-cross-encoder",
    "figureAlt": "Original NDCG@10 versus response time plot comparing gBCE-trained shallow cross-encoders and retrieval baselines.",
    "note": "Latency depends on the reported model, hardware and workload; it is not a recommender serving benchmark."
  }
});
})();
