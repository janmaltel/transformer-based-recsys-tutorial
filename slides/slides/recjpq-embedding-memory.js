(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "recjpq-embedding-memory",
  "type": "sasrec",
  "eyebrow": "Block 2 · RecJPQ",
  "title": "The item table can dominate memory",
  "subtitle": "Compression targets the catalog representation.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2024recjpq"
  ],
  "scaling": {
    "points": [
      {
        "label": "Dense table",
        "body": "N = 1,000,000 items, d = 128, float32: 4Nd = 512 MB.",
        "step": 0
      },
      {
        "label": "Shared representation",
        "body": "With K = 256 codes and m = 8 subspaces: 4Kd + Nm ≈ 8.13 MB.",
        "step": 1
      },
      {
        "label": "Scope",
        "body": "About 63× smaller in this toy calculation; includes byte codes, excludes encoder and optimizer state.",
        "step": 2
      }
    ],
    "diagram": "memory",
    "diagramLabel": "A million dense item vectors are replaced by eight shared codebooks and an eight-byte code per item."
  }
});
})();
