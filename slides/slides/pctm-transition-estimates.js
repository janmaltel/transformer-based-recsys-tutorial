(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "pctm-transition-estimates", type: "sasrec",
    eyebrow: "Block 2 · PCTM",
    title: "PCTM: estimating what follows an item",
    subtitle: "Probabilistic Collaborative Transition Model · Directional counts with Bayesian smoothing.",
    sasrecVisual: "scaling-slide", buildSteps: 3,
    citationKeys: ["petrov2026pctm"],
    scaling: {
      diagram: "pctm-transitions", points: [],
      stages: ["Count later items", "Weighted counts after B", "Smooth sparse evidence"],
      histories: ["2 ×  B → A → C", "2 ×  B → A"],
      source: "Source item B · Four-item toy catalogue",
      decay: "Count × weight · 1 step: 1 · 2 steps: ½",
      candidates: ["A", "B", "C", "D"], counts: [4, 0, 1, 0],
      countCalculations: ["4 × 1 = 4", "0", "2 × ½ = 1", "0"],
      countLabel: "Weighted counts, not probabilities",
      priorPerItem: 1,
      priorLabel: "+ 1 prior count per item",
      probabilityLabel: "Estimated P(next item | B)",
      takeaway: "Rare source items stay closer to the uniform prior; more evidence makes observed transitions dominate.",
      diagramLabel: "Illustrative PCTM construction. Two B-A-C histories and two B-A histories give weighted counts A=4, B=0, C=1, D=0 under inverse-distance weighting. Adding one prior count per item yields probabilities 5/9, 1/9, 2/9 and 1/9. Nearby events carry greater weight; smoothing gives nonzero probability to unobserved transitions.",
      note: "Illustrative counts and prior · PCTM estimates come from training events; no embeddings or sequence encoder are learned."
    }
  });
})();
