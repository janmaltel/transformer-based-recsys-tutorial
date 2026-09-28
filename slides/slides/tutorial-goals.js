(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "tutorial-goals",
    type: "goals",
    eyebrow: "Tutorial overview",
    title: "Outline",
    goals: [
      {
        icon: "introduction",
        phase: "Introduction",
        title: "Sequential recommendation",
        body: "MovieLens example · problem formulation · temporal information"
      },
      {
        icon: "model",
        phase: "Model",
        title: "SASRec, training & basic variants",
        body: "Architecture · training objectives · negative sampling"
      },
      {
        icon: "scale",
        phase: "Systems",
        title: "Catalog scale, serving & cold-start",
        body: "RecJPQ · semantic IDs · user and item cold-start"
      },
      {
        icon: "frontier",
        phase: "Research",
        title: "Recent directions",
        body: "Generative retrieval · content models · open questions"
      }
    ]
  });
})();
