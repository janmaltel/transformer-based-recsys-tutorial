(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "why-movielens-here",
    type: "foundation",
    eyebrow: "Running example",
    title: "MovieLens 1M",
    foundationVisual: "movielens-rationale",
    exampleEvents: [
      { user: "u17", rating: 5 },
      { user: "u23", rating: 3 },
      { user: "u17", rating: 4 },
      { user: "u42", rating: 5 },
      { user: "u23", rating: 4 },
      { user: "u58", rating: 1 },
      { user: "u42", rating: 2 },
      { user: "u58", rating: 5 }
    ],
    foundationCopy: {
      ratings: "1,000,209",
      ratingsLabel: "rating events",
      users: "6,040",
      usersLabel: "users",
      ratedMovies: "3,706",
      ratedMoviesLabel: "rated movies",
      period: "Ratings from April 2000 to February 2003",
      release: "Released February 2003",
      ratingFormat: "Whole-star ratings · at least 20 ratings per user",
      datasetLink: "grouplens.org/datasets/movielens/1m/",
      teachingTitle: "Why use it in this tutorial?",
      teachingPoints: [
        "Recognizable items make recommendations interpretable",
        "Timestamped histories support compact sequential examples",
        "Small enough for interactive, browser-side inference"
      ],
      limitationsTitle: "Limitations for sequential recommendation",
      limitationsPoints: [
        "Small, historically dated benchmark",
        "Rating-entry order is not viewing order",
        "Exposure reflects the MovieLens interface and recommender"
      ]
    },
    citation: "Harper & Konstan (2015, TiiS)",
    buildSteps: 4
  });
})();
