(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "pctm-benchmark-evidence", type: "sasrec",
    eyebrow: "Block 2 · Simple sequential models",
    title: "How strong are the simple models?",
    subtitle: "Full-catalogue NDCG@10 · Same data splits and evaluation protocol.",
    sasrecVisual: "scaling-slide", buildSteps: 3,
    citationKeys: ["petrov2026pctm"],
    scaling: {
      diagram: "pctm-benchmarks", points: [],
      series: ["SASRec + sampled softmax", "PCTM"],
      datasets: [
        { label: "Amazon Beauty", scores: [0.0537, 0.0635], step: 0 },
        { label: "Amazon Sports", scores: [0.0315, 0.0368], step: 0 },
        { label: "Amazon Toys", scores: [0.0575, 0.0738], step: 0 },
        { label: "MovieLens-1M", scores: [0.1662, 0.1815], step: 1 },
        { label: "MovieLens-20M", scores: [0.1806, 0.1431], step: 1 }
      ],
      findings: [
        { label: "Four benchmarks", body: "PCTM exceeds SASRec without attention or learned embeddings." },
        { label: "MovieLens-20M", body: "SASRec leads: PCTM is 20.8% below it." }
      ],
      takeaway: "A Transformer’s additional capacity does not automatically improve next-item ranking.",
      diagramLabel: "Paper-reported full-catalogue NDCG at 10 for SASRec trained with sampled softmax and PCTM on five datasets, with shared splits and evaluation. PCTM exceeds SASRec on the three Amazon datasets and MovieLens-1M. SASRec outperforms PCTM on MovieLens-20M. All exact scores are labelled above the bars and available in their accessible labels and hover descriptions.",
      note: "Paper-reported runs · Point estimates; no confidence intervals · RecSys 2026 Research and Practice Notes."
    }
  });
})();
