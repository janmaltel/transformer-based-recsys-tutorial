(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-results",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "gSASRec: reported ranking results",
  "subtitle": "Original comparison · NDCG@10 / Recall@1.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 1,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "points": [],
    "table": {
      "headings": [
        "Model",
        "ML-1M",
        "Steam",
        "Gowalla"
      ],
      "rows": [
        [
          "Popularity",
          "0.017 / 0.005",
          "0.0268 / 0.0077",
          "0.0041 / 0.0011"
        ],
        [
          "MF-BPR",
          "0.037 / 0.010",
          "0.0206 / 0.0071",
          "0.0170 / 0.0083"
        ],
        [
          "BERT4Rec",
          "0.161 / 0.058",
          "0.0746 / 0.0281",
          "—"
        ],
        [
          "SASRec-softmax",
          "0.169 / 0.073",
          "0.0721 / 0.0280",
          "—"
        ],
        [
          "SASRec",
          "0.131 / 0.046",
          "0.0581 / 0.0193",
          "0.1097 / 0.0505"
        ],
        [
          "gSASRec",
          "0.176 / 0.082",
          "0.0735 / 0.0283",
          "0.1616 / 0.0782"
        ]
      ]
    },
    "note": "Paper-reported results, not browser measurements. “—” means infeasible in the reported setup. Significance markers are omitted; compare within each dataset and protocol."
  }
});
})();
