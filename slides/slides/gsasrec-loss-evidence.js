(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-loss-evidence",
  "type": "sasrec",
  "eyebrow": "Block 2 · Training objectives",
  "title": "The literature’s answer: softmax is far better",
  "subtitle": "Same SASRec encoder · +24–36% NDCG@10 over one-negative BCE.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec",
    "klenitskiy2023dross",
    "mezentsev2024scalable"
  ],
  "scaling": {
    "layout": "loss-evidence",
    "diagram": "loss-evidence",
    "diagramLabel": "Relative NDCG@10 improvement of full softmax over one-negative BCE in two studies, grouped by dataset. MovieLens-1M: 29.0% and 35.8%. Steam: 24.1% and 26.7%.",
    "datasets": [
      {
        "label": "MovieLens-1M",
        "step": 0,
        "results": [
          {
            "citationKey": "petrov2023gsasrec",
            "delta": 29.0
          },
          {
            "citationKey": "klenitskiy2023dross",
            "delta": 35.8
          }
        ]
      },
      {
        "label": "Steam",
        "step": 1,
        "results": [
          {
            "citationKey": "petrov2023gsasrec",
            "delta": 24.1
          },
          {
            "citationKey": "klenitskiy2023dross",
            "delta": 26.7
          }
        ]
      }
    ],
    "points": [
      {
        "label": "…but FAR more expensive on large catalogues",
        "bridge": "idea",
        "body": "Compute all item logits for every position in every sequence in the batch. The dense batch × sequence length × catalogue tensor is infeasible at large-catalogue scale.",
        "citationKey": "mezentsev2024scalable",
        "step": 2
      }
    ],
    "note": "Relative gains within each study (Table 2); training protocols differ. Loss and negative count both change."
  }
});
})();
