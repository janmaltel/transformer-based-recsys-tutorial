(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-scoring-parallel",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Efficient inference",
    title:"Inference speedup",
    subtitle:"Turn a full item dot product into a few lookups and a sum.",
    sasrecVisual:"scaling-slide",buildSteps:5,citationKeys:["petrov2024pqtopk"],
    scaling:{layout:"compression-calculator",diagram:"pq-parallel",points:[],
      diagramLabel:"The item dot product is exactly the sum of sub-item dot products. Reveal precomputed shared scores, then each item separately selecting its scores and summing them.",
      note:"Toy example · Same item scores. Repeat for the whole catalogue, then select top-k."
    }
  });
})();
