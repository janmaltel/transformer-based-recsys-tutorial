(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-inference-benchmarks",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Efficient inference",
    title:"Faster scoring matters at catalogue scale",
    subtitle:"Published CPU benchmarks · compare the scoring heads on the same trained model.",
    sasrecVisual:"scaling-slide",buildSteps:1,citationKeys:["petrov2024pqtopk"],
    scaling:{layout:"compression-calculator",diagram:"pq-benchmarks",points:[],
      diagramLabel:"An interactive two-bar comparison of published CPU median response times for standard dot products and RecJPQ. Switch dataset, model and whole-model versus scoring latency.",
      note:"Table 3 · AMD Ryzen 5950X, 128 GB DDR4, TensorFlow 2.11; no GPU. 512D, 8 codes. Medians per user; whole-model and scoring times measured separately."
    }
  });
})();
