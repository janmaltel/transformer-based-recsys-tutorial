(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-compression-calculator", type:"sasrec", eyebrow:"Block 2 · RecJPQ",
    title:"How much does RecJPQ save?",
    subtitle:"The same catalogue and embedding size, with shared item representations.",
    sasrecVisual:"scaling-slide", buildSteps:1,
    citationKeys:["petrov2024recjpq","pytorchAdamMemory"],
    scaling:{layout:"compression-calculator",diagram:"recjpq-compression",points:[],
      diagramLabel:"A synchronised calculator compares dense item embeddings with RecJPQ's shared codebooks and fixed item codes, including configurations where shared codebooks exceed the dense table size, showing trainable parameters, GPU training memory and a common-scale size comparison.",
      note:"FP32 Adam ≈20 bytes/learned parameter; packed codes: 1–2 bytes/sub-item ID. Table only; excludes transformer, batch activations and lookup temporaries."}
  });
})();
