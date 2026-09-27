(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "recjpq-code-assignment",
  "type": "sasrec",
  "eyebrow": "Block 2 · RecJPQ",
  "title": "Build fixed codes from interactions",
  "subtitle": "One RecJPQ strategy: SVD-based assignment.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2024recjpq"
  ],
  "scaling": {
    "layout": "assignment-detail",
    "points": [],
    "diagram": "assignment",
    "diagramLabel": "An eight-by-eight binary user–item matrix undergoes truncated SVD into user embeddings, three singular values and transposed item embeddings. Normalising, adding noise and quantising the item embeddings produces an eight-by-three table of sub-item IDs.",
    "note": "Toy values. Codes stay fixed during training. SVD, BPR and random assignment are studied; use training interactions only."
  }
});
})();
