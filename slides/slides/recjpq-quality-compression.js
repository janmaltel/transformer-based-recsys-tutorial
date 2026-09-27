(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-quality-compression",type:"sasrec",eyebrow:"Block 2 · RecJPQ",
    title:"Good quality with strong compression",
    subtitle:"Click a configuration: compare with a dense item table at the same embedding size.",
    sasrecVisual:"scaling-slide",buildSteps:1,citationKeys:["petrov2024recjpq","pytorchAdamMemory"],
    scaling:{layout:"compression-calculator",diagram:"recjpq-quality-heatmaps",points:[],
      diagramLabel:"Clickable redraws of the paper’s MovieLens and Gowalla quality heatmaps. Rows select embedding dimension and columns select code length. The selected cell shows reported NDCG@10 and estimated dense versus RecJPQ GPU training memory.",
      note:"Quality: Figures 3–4, Tables 4–5. Memory: FP32 item-table estimate including gradients, Adam and workspace; excludes the rest of the model."
    }
  });
})();
