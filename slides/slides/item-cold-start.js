(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "item-cold-start",
    type: "sasrec",
    eyebrow: "Block 2 · Item cold-start",
    title: "Item cold-start in ID-based models",
    subtitle: "An item absent from training has no learned ID embedding.",
    sasrecVisual: "item-cold-start",
    buildSteps: 3,
    scaling: {
      points: [
        {
          label: "Observed during training",
          body: "Each known item has a learned ID vector."
        },
        {
          label: "An unseen item",
          body: "Content is available, but no ID vector has been trained."
        },
        {
          label: "As a candidate",
          body: "No trained candidate vector for scoring."
        },
        {
          label: "In the history",
          body: "No item-specific vector for this event."
        }
      ],
      formula: "\\(c_{\\mathrm{new}}\\) can be computed from content.",
      note: "Illustrative holdout: Toy Story 2 is known to the bundled checkpoint. Vector cells are schematic."
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
