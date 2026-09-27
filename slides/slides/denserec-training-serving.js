(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "denserec-training-serving",
    type: "sasrec",
    eyebrow: "Block 2 · DenseRec integration",
    title: "DenseRec training and serving",
    subtitle: "History and output items use the same representation rule.",
    sasrecVisual: "denserec-training-serving",
    buildSteps: 2,
    scaling: {
      points: [
        {
          label: "Training: sample the path",
          body: "Route each history token, positive target and negative sample independently."
        },
        {
          label: "Serving: use item status",
          body: "Known items use learned ID vectors. Cold items use projected content."
        }
      ],
      formula: "\\(h_t=f_{\\theta}(e_{1:t}),\\qquad s_j=h_t^{\\top}e_j\\)",
      note: "For a new candidate, encode its content, apply the learned projection, and add its vector to the retrieval index."
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
