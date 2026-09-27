(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "pctm-history-pooling", type: "sasrec",
    eyebrow: "Block 2 · PCTM",
    title: "PCTM: combining separate history evidence",
    subtitle: "Multiply per-item probabilities with recency weights; add a separate popularity adjustment.",
    sasrecVisual: "scaling-slide", buildSteps: 3,
    citationKeys: ["petrov2026pctm"],
    scaling: {
      diagram: "pctm-pooling", points: [],
      historyLabel: "Illustrative history · Oldest → newest",
      distributionLabel: "Next-item probabilities from this item",
      weights: ["Lower weight", "More weight", "Highest weight"],
      scoreFormula: "\\[s(a\\mid h)=\\sum_j w_j\\log\\hat P(a\\mid h_j)+\\lambda\\log p_{\\mathrm{pop}}(a)\\]",
      formulaLabel: "Weighted product of experts, expressed as a sum of log-probabilities",
      recencyTitle: "For longer histories: a selected 80/20 weighting pattern",
      recentLabel: "80%: latest 7–10 items", olderLabel: "20%: older context",
      independence: "Changing another history item does not change this item’s transition distribution.",
      diagramLabel: "PCTM combines separate next-item probability distributions from Babe, Jumanji and Toy Story, an illustrative history rather than an observed user log. Fixed recency weights give recent evidence more influence. A popularity term adjusts candidate scores. Four paper-selected configurations allocate 80 percent of history weight to the newest 7 to 10 items, with 20 percent for older interactions when present.",
      note: "Illustrative history and weight bars · Four selected configurations use the 80/20 head–tail pattern when older context is present."
    }
  });
})();
