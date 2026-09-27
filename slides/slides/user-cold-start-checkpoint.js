(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "user-cold-start-checkpoint",
  "type": "sasrec",
  "eyebrow": "Block 2 · User cold-start",
  "title": "Empty-history rankings and popularity",
  "subtitle": "MovieLens-1M · top-20 set overlap, ignoring rank",
  "sasrecVisual": "empty-prefix-checkpoint",
  "buildSteps": 3,
  "scaling": {
    "columns": [
      "Empty-history model",
      "First-item top 20",
      "All-event top 20"
    ],
    "rows": [
      {
        "label": "SASRec",
        "first": "0 / 20",
        "all": "0 / 20",
        "step": 0
      },
      {
        "label": "SASRec + first-item supervision",
        "first": "16 / 20",
        "all": "9 / 20",
        "step": 1
      }
    ],
    "points": [
      {
        "label": "Closer to first-item popularity",
        "body": "The two frequency baselines already share 12 of 20 movies. These overlaps describe training fit, not held-out recommendation quality.",
        "step": 2
      }
    ],
    "note": "500-epoch supervised model · first retained event per user (6,034 training users). The checkpoints have different training setups."
  },
  "citation": "Local MovieLens-1M checkpoint audit (2026)"
});
})();
