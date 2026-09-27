(function () {
  "use strict";
  window.PresentationSlides.push({
    id: "sampled-softmax-alternative",
    type: "sasrec",
    eyebrow: "Block 2 · Training objectives",
    title: "gBCE is not the only choice",
    subtitle: "Sampled softmax can also work well—with enough negatives.",
    sasrecVisual: "scaling-slide",
    buildSteps: 3,
    citationKeys: ["klenitskiy2023dross", "petrov2023gsasrec", "khrylchenko2025logq"],
    scaling: {
      points: [
        {
          label: "Sampled softmax works, too",
          body: "With many negatives, sampled softmax can approach full-softmax ranking quality.",
          citationKey: "klenitskiy2023dross",
          step: 0
        },
        {
          label: "The negative count matters",
          body: "With a substantial negative sample, sampled softmax and gBCE achieve similar ranking quality in the reported comparison.",
          citationKey: "petrov2023gsasrec",
          step: 1
        },
        {
          label: "A similar role to β in gBCE",
          body: "Log-Q correction plays a similar role to β in gBCE: accounting for bias introduced by negative sampling. Recent work refines how the always-present positive is handled.",
          citationKey: "khrylchenko2025logq",
          bridge: "idea",
          step: 2
        }
      ],
      note: "β corrects class-balance distortion in sampled BCE; log-Q accounts for the sampling distribution in sampled softmax. Same motivation, different mechanisms."
    }
  });
})();
