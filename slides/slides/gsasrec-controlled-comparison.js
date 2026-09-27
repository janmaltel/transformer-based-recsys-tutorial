(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-controlled-comparison",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "Separate the training choices",
  "subtitle": "MovieLens-1M · NDCG@10 · paper-reported comparison.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 2,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [
      {
        "label": "Read across",
        "body": "Changing the bundled sampling/loss regime improves both model/task configurations.",
        "step": 0
      },
      {
        "label": "Causal caution",
        "body": "Rows also change attention direction and task. Columns change sampling and loss together.",
        "step": 1
      }
    ],
    "table": {
      "headings": [
        "Architecture / task",
        "One-negative BCE",
        "Full-catalog softmax"
      ],
      "rows": [
        [
          "Causal / next item",
          "0.131",
          "0.169"
        ],
        [
          "Bidirectional / masked item",
          "0.123",
          "0.161"
        ]
      ]
    },
    "note": "This table cannot isolate attention, objective, sampling, or loss one at a time. The conclusion applies to this reported protocol."
  }
});
})();
