(function () {
  "use strict";
  window.PresentationSlides.push({
    id: "gsasrec-top-item-probabilities",
    type: "sasrec",
    eyebrow: "Block 2 · gSASRec",
    title: "gBCE restores differences among top items",
    subtitle: "Same user, same catalogue: differentiated top scores, with total probability close to one.",
    sasrecVisual: "scaling-slide",
    buildSteps: 3,
    citationKeys: ["petrov2023gsasrec"],
    scaling: {
      layout: "top-probabilities",
      diagram: "gbce-top-probabilities",
      diagramLabel: "Vector trace of Petrov and Macdonald Figure 1 for MovieLens-1M user 963. One plot with shared log item rank: SASRec uses the maroon left probability axis from 0 to 1; gSASRec uses the teal right probability axis from 0 to 0.03. Purple shading highlights the top ranks. Two arrows mark most variance outside top ranks for SASRec and inside top ranks for gSASRec.",
      points: [
        {label: "Most variance outside top ranks", body: "Most top-ranked movies score close to 1.0—as if the user would watch them all simultaneously.", step: 0},
        {label: "Most variance inside top ranks", body: "gSASRec removes the near-1 plateau; probability differences occur among the leading items.", step: 1},
        {label: "Far less overconfident", body: "Total predicted probability: 338.03 → 1.06 (SASRec → gSASRec). About one next movie in total.", bridge: "idea", step: 2}
      ],
      note: "MovieLens-1M user 963 · original paper, Fig. 1. Purple shading: top ranks. Each curve uses its own colour-matched y-axis; heights use different scales."
    }
  });
})();
