(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
  "id": "tiger-semantic-ids",
  "type": "sasrec",
  "eyebrow": "Block 2 · Generative retrieval",
  "title": "Semantic IDs: content to codes",
  "subtitle": "TIGER uses residual quantisation: a coarse representation, then successive refinements.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "rajput2023tiger"
  ],
  "scaling": {
    "pipeline": [
      "Item metadata",
      "Content encoder",
      "RQ-VAE"
    ],
    "levels": [
      "Coarse match",
      "Residual detail",
      "Finer residual detail"
    ],
    "codes": [
      "5",
      "25",
      "55"
    ],
    "neighbors": [
      {
        "item": "Running shoe · Z",
        "codes": [
          "5",
          "25",
          "55",
          "0"
        ]
      },
      {
        "item": "Running shoe · Y",
        "codes": [
          "5",
          "25",
          "78",
          "0"
        ]
      }
    ],
    "sharing": "Related items can share a prefix; these codes are learned, not manually named categories.",
    "collision": "Same semantic triple, different items?",
    "collisionCodes": [
      [
        "5",
        "25",
        "55",
        "0"
      ],
      [
        "5",
        "25",
        "55",
        "1"
      ]
    ],
    "resolution": "TIGER adds a final token to distinguish colliding items.",
    "note": "Illustrative codes · RQ-VAE produces the full tuple. TIGER refines residuals; RecJPQ combines separate subspaces.",
    "layout": "compression-calculator",
    "diagram": "tiger-semantic",
    "points": [],
    "diagramLabel": "Semantic IDs: content to codes. TIGER uses residual quantisation: a coarse representation, then successive refinements. All codes, products and decoding paths in schematic examples are illustrative."
  }
});
})();
