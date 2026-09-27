(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
  "id": "plum-joint-backbone",
  "type": "sasrec",
  "eyebrow": "Block 2 · Generative retrieval",
  "title": "PLUM: language-model candidate generation",
  "subtitle": "A pretrained language model reads watch history as text and item codes, then generates candidate codes.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "he2025plum"
  ],
  "scaling": {
    "inputTitle": "Watch history",
    "inputLabel": "Text + item codes",
    "history": [
      {
        "codes": "5 · 25 · 55",
        "text": "Channel: Trail running",
        "feature": "Watched: 90%"
      },
      {
        "codes": "5 · 23 · 78",
        "text": "Channel: Race training",
        "feature": "Watched: 75%"
      }
    ],
    "model": "Adapted language model",
    "vocabulary": "Text tokens + item-code tokens",
    "adaptation": "Pretrained LLM, adapted to watch histories",
    "outputTitle": "Generated candidate codes",
    "candidateCodes": [
      "5 · 25 · 78",
      "8 · 14 · 32"
    ],
    "lookup": "Code-to-video lookup",
    "ranking": "Candidate videos → existing rankers",
    "takeaway": "PLUM generates candidates; existing models perform the final ranking.",
    "limitation": "Beam search can miss high-scoring items. Exact catalogue top-k retrieval is not guaranteed.",
    "note": "Illustrative history and codes · YouTube deployment reported in the paper. The item tokenizer is trained separately; downstream ranking remains.",
    "layout": "compression-calculator",
    "diagram": "plum-backbone",
    "points": [],
    "diagramLabel": "Watch histories containing text, item codes and watch features feed an adapted pretrained language model, which generates candidate code sequences mapped to videos for downstream ranking."
  }
});
})();
