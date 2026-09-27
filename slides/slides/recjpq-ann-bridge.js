(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-ann-bridge",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Retrieval",
    title:"Returning to ANN indexes",
    subtitle:"RecJPQ learns a product-quantised representation during recommendation training.",
    sasrecVisual:"scaling-slide",buildSteps:3,citationKeys:["petrov2024recjpq","douze2024faiss"],
    scaling:{layout:"compression-calculator",diagram:"recjpq-ann",points:[],
      recommendation:"If exact retrieval is still too slow, evaluate approximate nearest-neighbour (ANN) indexes.",
      tradeoff:"Retrieval recall ↔ latency: faster search can miss high-scoring items. Measure recommendation quality too.",
      training:"RecJPQ training",representation:"PQ codebooks + item codes",destination:"PQ-based ANN in Faiss?",
      pqExplanation:"The shared sub-item vectors and code tuples already have the structure of product quantisation.",
      hypothesis:"Potential reuse of the learned codebooks and item codes, rather than compressing a full embedding table again.",
      qualification:"Research direction: index routing, scoring compatibility and recall–latency need validation.",
      diagramLabel:"If exact retrieval is still too slow, evaluate ANN and its retrieval recall–latency trade-off. RecJPQ training already produces PQ codebooks and item codes. A dashed arrow to PQ-based ANN in Faiss denotes a potential integration, not an implemented or benchmarked automatic export.",
      note:"PQ provides the representation; an ANN index also needs a search structure. Faiss integration is a hypothesis, not a result of the cited RecJPQ study."
    }
  });
})();
