(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "guiding-question",
    type: "guiding",
    eyebrow: "Sequential recommendation · Motivation",
    title: "When and why (not) sequential recommendation?",
    guiding: {
      reasons: [
        {
          icon: "user",
          label: "The hypothesis",
          body: "Intent and preferences change over time. Ordered histories may improve next-item prediction beyond aggregate user–item counts."
        },
        {
          icon: "sequence",
          label: "Order may add little",
          body: "Movie A → B or B → A over two weeks may imply similar preferences. Studies report weak order effects for some public data sets used in academic research (Woolridge et al., 2021; Klenitskiy et al., 2024)."
        },
        {
          icon: "context",
          label: "The relevant time scale",
          body: "In industry settings, clicks and dwell time on genre C within the current session may reveal intent. Sequential information can matter at a different time scale."
        }
      ]
    },
    citationKeys: ["woolridge2021pseudosequence", "klenitskiy2024sequential"],
    buildSteps: 3
  });
})();
