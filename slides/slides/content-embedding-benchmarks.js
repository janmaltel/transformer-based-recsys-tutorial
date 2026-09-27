(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "content-embedding-benchmarks",
    type: "sasrec",
    eyebrow: "Block 2 · Content embeddings",
    title: "Content embedding benchmarks",
    subtitle: "MTEB compares embeddings across tasks and languages.",
    sasrecVisual: "embedding-resource",
    scaling: {
      figure: "assets/images/content-embeddings/mteb-leaderboard.png",
      figureAlt: "MTEB multilingual leaderboard with model rankings, task scores and model filters. Rankings are a snapshot.",
      points: [
        { label: "MTEB leaderboard", body: "Task and language scores, model size and openness." }
      ],
      urls: ["https://huggingface.co/spaces/mteb/leaderboard"],
      formula: "MTEB Multilingual",
      note: "Embedding benchmarks help shortlist encoders. Recommendation quality requires evaluation on the target data."
    }
  });
})();
