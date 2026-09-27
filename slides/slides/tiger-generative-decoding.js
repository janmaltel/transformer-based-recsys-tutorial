(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
  "id": "tiger-generative-decoding",
  "type": "sasrec",
  "eyebrow": "Block 2 · Generative retrieval",
  "title": "TIGER: decoding candidate IDs",
  "subtitle": "The model predicts next-token probabilities; beam search keeps the most probable prefixes.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "rajput2023tiger"
  ],
  "scaling": {
    "columns": [
      {
        "title": "Most probable first tokens",
        "step": 0,
        "paths": [
          "5",
          "8"
        ]
      },
      {
        "title": "Most probable prefixes",
        "step": 1,
        "paths": [
          "5 · 25",
          "5 · 23"
        ]
      },
      {
        "title": "Complete candidate IDs",
        "step": 2,
        "paths": [
          "5 · 25 · 55 · 0",
          "5 · 23 · 78 · 0"
        ]
      }
    ],
    "discarded": "Other prefixes are discarded",
    "lookup": "Valid IDs → item lookup → candidate list",
    "takeaway": "Beam search generates likely IDs without scoring the full catalogue. It can miss high-scoring items.",
    "note": "Illustrative beam of width 2 · TIGER filters invalid IDs. Wider beams can improve coverage, with more decoding work.",
    "layout": "compression-calculator",
    "diagram": "tiger-beam",
    "points": [],
    "diagramLabel": "TIGER: decoding candidate IDs. The model predicts next-token probabilities; beam search keeps the most probable prefixes. All codes, products and decoding paths in schematic examples are illustrative."
  }
});
})();
