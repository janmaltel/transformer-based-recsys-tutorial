(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "recjpq-sub-item-codes",
  "type": "sasrec",
  "eyebrow": "Block 2 · RecJPQ",
  "title": "Represent an item with several codes",
  "subtitle": "We want shared parts to capture similarities between items.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2024recjpq"
  ],
  "scaling": {
    "points": [
      {
        "label": "Toy item",
        "body": "Item A → (12, 7, 203). Each coordinate selects a row in a different codebook.",
        "step": 0
      },
      {
        "label": "Sharing",
        "body": "Items can share some subcodes while using different complete tuples.",
        "step": 1
      },
      {
        "label": "Our goal: meaningful parts",
        "bridge": "idea",
        "body": "Items with similar interaction patterns should share useful parts of their representation.",
        "step": 2
      }
    ],
    "diagram": "codes",
    "diagramLabel": "Two toy item IDs use code tuples with a shared first coordinate and different remaining coordinates.",
    "note": "Toy codes. These are catalogue-specific addresses, not natural-language tokens."
  }
});
})();
