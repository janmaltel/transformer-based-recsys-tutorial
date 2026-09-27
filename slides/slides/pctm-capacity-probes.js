(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "pctm-capacity-probes", type: "sasrec",
    eyebrow: "Block 2 · Simple sequential models",
    title: "How much do we need a Transformer?",
    subtitle: "Item transitions, recency and popularity can already provide strong next-item signals.",
    sasrecVisual: "scaling-slide", buildSteps: 3,
    citationKeys: ["petrov2026pctm"],
    scaling: {
      diagram: "pctm-capacity", points: [],
      historyLabel: "Same history: h₁ → h₂ → h₃ · Oldest → newest",
      levels: [
        { title: "Last item", models: "MC · FMC · FMC+", stage: "Last-item transition", score: "Candidate score", explanation: "Only h₃ contributes." },
        { title: "Separate history evidence", models: "Sequential Rules · PCTM", stage: "Recency-weighted combination", score: "Candidate score", explanation: "Each item contributes independently." },
        { title: "Joint history modelling", models: "SASRec · eSASRec", stage: "Causal self-attention", score: "Candidate score", explanation: "An item’s contribution can depend on context." }
      ],
      diagramLabel: "Three modelling capacities, using the same three-item history. Last-item models use only the final item. Pairwise models combine separate item-to-item contributions with fixed recency weights. Transformers learn contextual history representations.",
      note: "All three predict the next item · Using an interaction history does not require a Transformer."
    }
  });
})();
