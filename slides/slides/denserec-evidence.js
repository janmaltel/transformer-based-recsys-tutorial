(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "denserec-evidence",
    type: "sasrec",
    eyebrow: "Block 2 · Evidence and limits",
    title: "DenseRec: reported results",
    subtitle: "Amazon Reviews 2023 · full-catalog HR@100 (%)",
    sasrecVisual: "denserec-evidence",
    buildSteps: 2,
    scaling: {
      table: {
        headings: [
          "Category",
          "ID-only SASRec",
          "DenseRec",
          "Relative gain"
        ],
        rows: [
          [
            "Toys & Games",
            "2.42",
            "3.25",
            "+34.3%"
          ],
          [
            "Sports & Outdoors",
            "4.75",
            "5.35",
            "+12.6%"
          ],
          [
            "Video Games",
            "8.41",
            "9.37",
            "+11.4%"
          ]
        ]
      },
      points: [
        {
          label: "Routing ablation",
          body: "\\(p_{\\mathrm{dense}}=0.2\\)–\\(0.8\\) matched or exceeded the ID baseline in all three categories."
        },
        {
          label: "0.4–2.4% of successful hits",
          body: "Only this fraction had cold targets. The authors suggest much of the gain comes from representing cold items in histories."
        }
      ],
      formula: "Main comparison: \\(p_{\\mathrm{dense}}=0.5\\). Baseline hyperparameters transferred to DenseRec.",
      note: "Paper-reported results, not a MovieLens reproduction. Scope: three categories, text content and one SASRec backbone."
    },
    citation: "Lichtenberg et al. (2025) · arXiv:2508.18442"
  });
})();
