(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "recjpq-codebooks",
  "type": "sasrec",
  "eyebrow": "Block 2 · RecJPQ",
  "title": "Look up parts, then concatenate",
  "subtitle": "RecJPQ reconstructs an embedding from shared learnable rows.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 7,
  "citationKeys": [
    "petrov2024recjpq"
  ],
  "scaling": {
    "layout": "codebook-detail",
    "points": [],
    "diagram": "codebooks",
    "diagramLabel": "Item 4 has codes 25, 7 and 2. Each code is selected in turn, highlighting its matching sub-item row. A separate reveal copies the four row values into the corresponding segment of the item embedding.",
    "note": "Toy values. Item codes stay fixed; the shared sub-item embeddings are learned with the recommender."
  }
});
})();
