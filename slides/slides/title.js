(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "title",
    type: "title",
    eyebrow: "RecSys 2026",
    title: "Transformer-based Sequential Recommender Systems",
    titleLines: ["Transformer-based", "Sequential Recommender Systems"],
    presenters: [
      {
        name: "Jan Malte Lichtenberg",
        role: "",
        affiliation: "",
        email: "maltelichtenberg@gmail.com",
        image: "assets/images/jan-malte-lichtenberg.jpg"
      },
      {
        name: "Aleksandr V. Petrov",
        role: "",
        affiliation: "Spotify,",
        email: "aleksandrv@spotify.com",
        emailInline: true,
        image: "assets/images/aleksandr-petrov.jpg"
      }
    ],
    attribution: {
      text: "Some slides ported from",
      label: "Petrov & Macdonald’s ECIR 2024 tutorial",
      url: "https://github.com/asash/transformers-for-recsys-tutorial"
    },
    repository: {
      label: "janmaltel.github.io/transformer-based-recsys-tutorial/",
      url: "https://janmaltel.github.io/transformer-based-recsys-tutorial/",
      qrImage: "assets/images/tutorial-repository-qr.png"
    }
  });
})();
