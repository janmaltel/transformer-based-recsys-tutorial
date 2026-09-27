(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
  "id": "generative-retrieval-tradeoffs",
  "type": "sasrec",
  "eyebrow": "Block 2 · Generative retrieval",
  "title": "Generative retrieval: benefits and costs",
  "subtitle": "A compact formulation; candidate search and decoding still determine serving behaviour.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "rajput2023tiger",
    "petrov2023gptrec",
    "he2025plum"
  ],
  "scaling": {
    "benefits": [
      {
        "label": "Elegant formulation",
        "body": "Context in → item-code sequences out."
      },
      {
        "label": "Shared vocabulary",
        "body": "Compact item tokens; decoding avoids a dense-vector ANN index."
      }
    ],
    "costs": [
      {
        "label": "Beam-search coverage",
        "body": "Only retained paths are explored; high-scoring items can be missed.",
        "step": 0
      },
      {
        "label": "Semantic collisions",
        "body": "Different items can share codes. TIGER adds a suffix; PLUM reports remaining collisions.",
        "step": 1
      },
      {
        "label": "Autoregressive latency",
        "body": "Several sequential decoder steps per ID; wider beams add work.",
        "step": 2
      }
    ],
    "takeaway": "Evaluation: recommendation quality, catalogue coverage and latency.",
    "note": "Decoding cost depends on ID length, beam width, backbone and caching. PLUM reports deployment but no serving-latency comparison.",
    "layout": "compression-calculator",
    "diagram": "generative-tradeoffs",
    "points": [],
    "diagramLabel": "Generative retrieval: benefits and costs. A compact formulation; candidate search and decoding still determine serving behaviour. All codes, products and decoding paths in schematic examples are illustrative."
  }
});
})();
