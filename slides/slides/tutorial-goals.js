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
        title: "SASRec, basic variants & cold-start",
        body: "Architecture · objectives · user and item cold-start"
      },
      {
        icon: "scale",
        phase: "Systems",
        title: "Deployment & catalog scale",
        body: "RecJPQ · semantic IDs · retrieval and serving"
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
