(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-scoring",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Efficient inference",
    title:"Reconstruct then compute—or precompute then sum",
    subtitle:"Two ways to score the same compressed item embedding. The result is identical.",
    sasrecVisual:"scaling-slide",buildSteps:3,citationKeys:["petrov2024pqtopk"],
    scaling:{layout:"compression-calculator",diagram:"pq-score-lookup",points:[],
      diagramLabel:"A sequence vector splits into three parts. Each part scores shared sub-item rows. Codes are integer row IDs, not binary vectors. Selecting an item's three codes looks up the corresponding scores and adds them without reconstructing a full item vector.",
      note:"Toy vectors, 3 shown rows per codebook. Real 8-code / 256-row setup: 2,048 shared scores per sequence, then 8 lookups and a sum per item. Figure 1 / Section 3."
    }
  });
})();
