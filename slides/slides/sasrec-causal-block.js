(function () {
  "use strict";

  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "sasrec-causal-block",
    type: "sasrec",
    eyebrow: "SASRec · Combining sequence information",
    title: "Causal self-attention in SASRec",
    sasrecVisual: "causal-block",
    buildSteps: 4,
    citation: "Vaswani et al. (2017, NeurIPS) · Kang & McAuley (2018, ICDM)",
    footerResources: {
      label: "3Blue1Brown YouTube explanations on Transformers and attention mechanisms",
      links: [
        {
          title: "Transformers, the tech behind LLMs | Deep Learning Chapter 5",
          url: "https://www.youtube.com/watch?v=wjZofJX0v4M"
        },
        {
          title: "Attention in transformers, step-by-step | Deep Learning Chapter 6",
          url: "https://www.youtube.com/watch?v=eMlx5fFNoYc"
        },
        {
          title: "How might LLMs store facts | Deep Learning Chapter 7",
          url: "https://www.youtube.com/watch?v=9-Jl0dxWQs8"
        }
      ]
    }
  });
})();
