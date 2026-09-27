(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "denserec-dual-path",
    type: "sasrec",
    eyebrow: "Block 2 · DenseRec",
    title: "DenseRec: ID and content paths",
    subtitle: "Both paths produce a vector in the same recommendation space.",
    sasrecVisual: "denserec-dual-path",
    buildSteps: 3,
    scaling: {
      points: [
        {
          label: "ID path",
          body: "Learned item row: \\(E^{\\mathrm{ID}}[i]\\in\\mathbb{R}^{d}\\)."
        },
        {
          label: "Content path",
          body: "Frozen content vector: \\(c_i\\in\\mathbb{R}^{d_c}\\)."
        },
        {
          label: "Shared sequence encoder",
          body: "Select one path for each token occurrence, then add position information."
        }
      ],
      formula: "\\(P(c_i)=W_pc_i+b_p\\in\\mathbb{R}^{d}\\)",
      note: "Train the ID table, projection and sequence encoder jointly. The pretrained content encoder stays frozen."
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
