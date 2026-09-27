(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-pruning-benchmarks",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Efficient inference",
    title:"Dynamic pruning: scoring latency",
    subtitle:"Paper-reported CPU timings · Exact top-10 · Same trained RecJPQ model.",
    sasrecVisual:"scaling-slide",buildSteps:1,citationKeys:["petrov2025recjpqprune"],
    scaling:{layout:"compression-calculator",diagram:"recjpq-pruning-benchmarks",points:[],
      diagramLabel:"Compare full-catalogue shared-score reuse and dynamic pruning. Select Gowalla or Tmall, SASRec, gSASRec or gBERT4Rec, and median or 95th-percentile CPU scoring latency. Pruning has variable latency and can be slower in the tail.",
      note:"AMD Ryzen 5950X · 128 GB RAM · No GPU. 512D, 8 codes, 256 rows/codebook. Pruning batch size 8; Transformer time excluded."
    }
  });
})();
