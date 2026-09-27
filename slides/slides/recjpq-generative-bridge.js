(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
  "id": "recjpq-generative-bridge",
  "type": "sasrec",
  "eyebrow": "Block 2 · Generative retrieval",
  "title": "TIGER: generate the next item",
  "subtitle": "History of semantic IDs → next-item semantic ID → item lookup.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "rajput2023tiger"
  ],
  "scaling": {
    "historyTitle": "User history",
    "history": [
      {
        "item": "Trail shoe · X",
        "codes": [
          "5",
          "23",
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
    "model": "TIGER encoder–decoder",
    "prediction": "Generate the next ID",
    "target": [
      "5",
      "25",
      "55",
      "0"
    ],
    "lookup": "ID → catalogue item",
    "item": "Running shoe · Z",
    "takeaway": "Retrieval generates an item-code sequence without full-catalogue vector scoring.",
    "note": "Illustrative products and IDs · The trained semantic-ID tokenizer and ID-to-item lookup are retained.",
    "layout": "compression-calculator",
    "diagram": "tiger-overview",
    "points": [],
    "diagramLabel": "TIGER: generate the next item. History of semantic IDs → next-item semantic ID → item lookup. All codes, products and decoding paths in schematic examples are illustrative."
  }
});
})();
