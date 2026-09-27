(function (root) {
  "use strict";

  root.CanonicalMoviePredictionExample = Object.freeze({
    model: "gSASRec ML-1M",
    history: Object.freeze([
      Object.freeze({ id: 34, title: "Babe", year: 1995 }),
      Object.freeze({ id: 2, title: "Jumanji", year: 1995 }),
      Object.freeze({ id: 1, title: "Toy Story", year: 1995 })
    ]),
    recommendations: Object.freeze([
      Object.freeze({ id: 3114, title: "Toy Story 2", year: 1999 }),
      Object.freeze({ id: 2355, title: "A Bug's Life", year: 1998 }),
      Object.freeze({ id: 2700, title: "South Park", year: 1999 }),
      Object.freeze({ id: 1265, title: "Groundhog Day", year: 1993 }),
      Object.freeze({ id: 588, title: "Aladdin", year: 1992 })
    ])
  });
  // Second running example. Preserve the full ranking from the supplied screenshot.
  root.ScienceFictionMoviePredictionExample = Object.freeze({
    model: "gSASRec ML-1M",
    history: Object.freeze([
      Object.freeze({ id: 924, title: "2001: A Space Odyssey", year: 1968 }),
      Object.freeze({ id: 2010, title: "Metropolis", year: 1927 })
    ]),
    recommendations: Object.freeze([
      Object.freeze({ id: 541, title: "Blade Runner", year: 1982 }),
      Object.freeze({ id: 1214, title: "Alien", year: 1979 }),
      Object.freeze({ id: 1253, title: "The Day the Earth Stood Still", year: 1951 }),
      Object.freeze({ id: 1206, title: "A Clockwork Orange", year: 1971 }),
      Object.freeze({ id: 1240, title: "The Terminator", year: 1984 })
    ])
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
