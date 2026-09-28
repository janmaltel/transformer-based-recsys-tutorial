(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "denserec-pdense",
    type: "sasrec",
    eyebrow: "Block 2 · DenseRec training",
    title: "DenseRec routing probability",
    subtitle: "One path choice per token occurrence during training.",
    sasrecVisual: "denserec-pdense",
    buildSteps: 3,
    scaling: {
      points: [
        {
          label: "ID-only",
          body: "Only ID vectors are used. The projection stays untrained."
        },
        {
          label: "Mixed routing",
          body: "Both paths learn through the same encoder and next-item objective."
        },
        {
          label: "Content-only",
          body: "Same as “SASRec with content embeddings”. ID rows stay untrained."
        }
      ],
      formula: "\\(z\\sim\\operatorname{Bernoulli}(p_{\\mathrm{dense}}),\\qquad e_i=\\begin{cases}E^{\\mathrm{ID}}[i]&z=0\\\\P(c_i)&z=1\\end{cases}\\)",
      note: "Blue: ID path. Amber: content path. The middle sequence is one illustrative draw, not an expected proportion."
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
