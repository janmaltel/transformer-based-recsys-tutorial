(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "content-embedding-model",
    type: "sasrec",
    eyebrow: "Block 2 · Content embeddings",
    title: "Content encoder in the playground",
    subtitle: "Movie text → frozen E5 → a 384-dimensional content vector",
    sasrecVisual: "movie-content-encoding",
    scaling: {
      movie: {
        poster: "assets/recsys/posters/ml1m/avif-w192-q45-v1/00/0001.avif",
        title: "Toy Story (1995)",
        genres: "Adventure · Animation · Children · Comedy · Fantasy",
        description: "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. …"
      }
    },
    footerReference: {
      label: "Model card",
      detail: "intfloat/multilingual-e5-small",
      url: "https://huggingface.co/intfloat/multilingual-e5-small"
    }
  });
})();
