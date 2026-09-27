(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "gsasrec-overconfidence",
  "type": "sasrec",
  "eyebrow": "Block 2 · gSASRec",
  "title": "Saturated scores hide differences at the top",
  "subtitle": "Sampled BCE can flatten top-item probabilities; scores vary further down.",
  "sasrecVisual": "scaling-slide",
  "buildSteps": 3,
  "citationKeys": [
    "petrov2023gsasrec"
  ],
  "scaling": {
    "diagram": "overconfidence",
    "diagramLabel": "Digitized SASRec sigmoid score versus log item rank for MovieLens-1M user 963. Most top-ranked movies receive scores close to 1.0. A purple band highlights the top ranks. Values are raster-tracing estimates, not exact original predictions.",
    "points": [
      {
        "label": "Top probabilities saturate",
        "body": "Most top-ranked movies receive scores close to 1.0.",
        "step": 0
      },
      {
        "label": "As if all were next",
        "bridge": "idea",
        "body": "As if the user would watch all these movies simultaneously.",
        "step": 1
      },
      {
        "label": "Most variance outside top ranks",
        "body": "The largest visible score changes appear lower in the ranking. We need a training signal that distinguishes the top.",
        "step": 2
      }
    ],
    "note": "MovieLens-1M user 963. Shading highlights the top ranks; trace values are approximate."
  }
});
})();
