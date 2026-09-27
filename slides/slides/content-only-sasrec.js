(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "content-only-sasrec",
    type: "sasrec",
    eyebrow: "Block 2 · Content embeddings",
    title: "SASRec with content embeddings",
    subtitle: "Every item uses projected content, in the history and in the candidate set.",
    sasrecVisual: "content-only-sasrec",
    buildSteps: 3,
    scaling: {
      points: [
        {
          label: "Recommendation training",
          body: "The content encoder stays frozen. Next-item prediction trains the projection and SASRec."
        },
        {
          label: "Candidate scoring",
          body: "Warm and cold items share the projection."
        },
        {
          label: "New items",
          body: "Available content provides a vector before the first interaction."
        },
        {
          label: "Representation limit",
          body: "Identical content vectors remain indistinguishable, even when item popularity differs."
        },
        {
          label: "Item content"
        },
        {
          label: "Frozen encoder"
        },
        {
          label: "Learned projection"
        },
        {
          label: "SASRec + positions"
        }
      ],
      formula: "\\(e_i=P(c_i),\\qquad s_j=h_t^{\\top}P(c_j)\\)",
      note: "New items need content encoding and projection. Their ranking quality still requires evaluation."
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
