(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-inference-scale",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Efficient inference",
    title:"Catalogue scan cost",
    subtitle:"CPU scoring + top-k · RecJPQ without pruning · Simulated catalogues, 512D, 8 codes.",
    sasrecVisual:"scaling-slide",buildSteps:2,citationKeys:["petrov2024pqtopk"],
    scaling:{layout:"compression-calculator",diagram:"pq-scale",points:[],
      diagramLabel:"Each square represents 10 million items on a shared scale. Reported RecJPQ simulated scoring plus top-k times rise from 146 milliseconds at 10 million items to approximately 1 second at 100 million and more than 10 seconds at 1 billion. Full matrix multiplication runs out of the paper's 128 GB system memory beyond 10 million items.",
      note:"AMD Ryzen 5950X · 128 GB RAM · No GPU. Random sequence and sub-item vectors; excludes Transformer."
    }
  });
})();
