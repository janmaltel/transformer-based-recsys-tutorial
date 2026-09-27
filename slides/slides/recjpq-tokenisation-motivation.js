(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "recjpq-tokenisation-motivation",
    type: "sasrec",
    eyebrow: "Block 2 · RecJPQ",
    title: "Language faced a similar problem",
    subtitle: "English has a huge vocabulary, with new words appearing all the time.",
    sasrecVisual: "scaling-slide",
    buildSteps: 3,
    citationKeys: ["radford2019gpt2"],
    scaling: {
      diagram: "tokenisation-motivation",
      diagramLabel: "Many possible English words are represented using a smaller vocabulary of reusable tokens. Toy examples split replaying into re, play and ing, and playing into play and ing.",
      points: [
        {label: "The same scaling problem", body: "An embedding for every possible word would require a huge vocabulary.", step: 0},
        {label: "LLMs use tokenisation", body: "Represent words with sequences of reusable tokens, using a much smaller embedding vocabulary.", step: 1},
        {label: "Can we do the same?", body: "Could a small vocabulary represent our hundreds of millions of items?", step: 2, bridge: "question"}
      ],
      note: "Illustrative word pieces; actual splits depend on the tokeniser."
    }
  });
})();
