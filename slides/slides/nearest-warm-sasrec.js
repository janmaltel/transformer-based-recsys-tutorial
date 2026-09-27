(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "nearest-warm-sasrec",
    type: "sasrec",
    eyebrow: "Block 2 · Nearest-warm substitution",
    title: "SASRec with a nearest-warm neighbor",
    subtitle: "Warm items have training interactions. A cold item borrows a warm item’s learned ID vector.",
    sasrecVisual: "nearest-warm-sasrec",
    buildSteps: 3,
    scaling: {
      points: [
        {
          label: "Proxy selection by content",
          body: "The proxy is the warm item with greatest content cosine."
        },
        {
          label: "ID-based sequence model",
          body: "Warm items keep their own vectors. Cold history items and cold candidates use proxy vectors."
        },
        {
          label: "No additional SASRec training",
          body: "The existing sequence encoder processes the substituted history."
        },
        {
          label: "Shared proxy, shared score",
          body: "Items assigned to the same warm proxy have identical vectors and tied candidate scores."
        },
        {
          label: "Cold item content"
        },
        {
          label: "Nearest warm item"
        },
        {
          label: "Learned ID vector"
        },
        {
          label: "Existing SASRec"
        }
      ],
      formula: "\\(n(i)=\\arg\\max_{k\\in\\mathcal{I}_{\\mathrm{warm}}}\\cos(c_i,c_k),\\qquad e_i=E^{\\mathrm{ID}}[n(i)]\\)",
      note: "Inference-only baseline shown here. SwapRec by Moscati et al. (2026, DaQuaMRec) also introduces swaps during training to improve robustness."
    },
    citationKeys: ["moscati2026swaprec"]
  });
})();
