(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
  "id": "item-code-geometries",
  "type": "sasrec",
  "eyebrow": "Block 2 · Item codes",
  "title": "Item codes: parts or refinements",
  "subtitle": "RecJPQ partitions the embedding; TIGER progressively refines a latent representation.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2024recjpq",
    "rajput2023tiger"
  ],
  "scaling": {
    "layout": "compression-calculator",
    "diagram": "code-geometries",
    "points": [],
    "leftTitle": "RecJPQ · different parts",
    "leftAnalogy": "Like coordinates in separate subspaces",
    "codes": [
      "25",
      "7",
      "2"
    ],
    "parts": [
      "Part 1",
      "Part 2",
      "Part 3"
    ],
    "leftResult": "Concatenate the selected vectors",
    "leftMeaning": "All parts contribute together. Code order identifies the subspace; it does not mean coarse → fine.",
    "rightTitle": "TIGER · successive corrections",
    "rightAnalogy": "Like moving toward a target, then correcting",
    "moves": [
      "Coarse match",
      "Refine",
      "Refine again"
    ],
    "origin": "Start",
    "target": "Target",
    "rightMeaning": "Each code approximates the residual left by earlier codes. The prefix gives a progressively finer approximation.",
    "takeaway": "RecJPQ scores the parts independently. TIGER generates codes one at a time.",
    "note": "Illustrative geometry · Learned codes need not be named attributes. Sequential construction does not prevent parallel additive scoring.",
    "diagramLabel": "Comparison of product quantisation and residual quantisation: separate embedding parts versus successive vector corrections toward a target."
  }
});
})();
