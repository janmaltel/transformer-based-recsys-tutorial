(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "content-embedding-challenge",
    type: "sasrec",
    eyebrow: "Block 2 · Item representations",
    title: "Content and collaborative embeddings",
    subtitle: "The representation reflects the objective used to learn it.",
    sasrecVisual: "content-embedding-challenge",
    buildSteps: 3,
    scaling: {
      points: [
        {
          label: "Interaction-trained ID vectors",
          body: "Item identity, co-occurrence and popularity can shape the learned representation."
        },
        {
          label: "Pretrained content vectors",
          body: "Text or images provide a representation for new items, but semantic similarity need not match user response."
        },
        {
          label: "Compatibility with the sequence model",
          body: "Learn the projection through the recommendation objective. Matching dimensions alone is insufficient."
        }
      ],
      formula: "\\(P:\\mathbb{R}^{d_c}\\rightarrow\\mathbb{R}^{d},\\qquad P(c_i)=W_pc_i+b_p\\)"
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
