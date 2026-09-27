(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "recjpq-catalogue-memory",
    type: "sasrec",
    eyebrow: "Block 2 · RecJPQ",
    title: "How much GPU memory do we need?",
    subtitle: "Revisit our SASRec model at catalogue scale.",
    sasrecVisual: "scaling-slide",
    buildSteps: 3,
    citationKeys: ["petrov2024recjpq", "pytorchAdamMemory"],
    scaling: {
      layout: "embedding-motivation",
      diagram: "catalogue-embedding-memory",
      diagramLabel: "First revisit the SASRec transformer. Reveal its shared catalogue-sized embedding table, then explore item count, embedding parameters and FP32 Adam training memory with catalogue and embedding-size presets.",
      points: [
        {label: "Same SASRec transformer", body: "Our history still passes through causal attention and feed-forward blocks.", step: 0},
        {label: "How can we shrink this table?", body: "Keep the transformer; change the item representations.", bridge: "question", step: 2}
      ],
      noteStep: 1,
      note: "FP32 Adam estimate: weights + gradients + two moments + optimizer workspace ≈ 20 bytes per parameter. Embedding table only; transformer parameters and batch activations need additional memory."

    }
  });
})();
