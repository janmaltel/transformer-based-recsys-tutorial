(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "multiple-interests", type: "sasrec",
    eyebrow: "Block 2 · Simple sequential models",
    title: "Where can a simpler model help?",
    subtitle: "Multiple interests in one history: Toy Story 2 → The Matrix.",
    sasrecVisual: "scaling-slide", buildSteps: 2,
    citationKeys: ["kang2018sasrec", "petrov2026pctm"],
    scaling: {
      diagram: "multiple-interests", points: [],
      sasrecHeading: "SASRec: one direction for both interests",
      pctmHeading: "PCTM: evidence from each recent film",
      familyLabel: "Children’s films", scifiLabel: "Dark / philosophical sci-fi",
      otherLabel: "Other genres",
      dragHint: "Drag h · Arrow keys also move it",
      resetLabel: "Reset vector",
      scoreRule: "Score = h · item vector",
      schematicCaption: "Schematic coordinates · Initial top 5 match the SASRec checkpoint.",
      defaultObservation: "Initial SASRec top 5: no children’s films.",
      familyObservation: "This direction favors the children’s-film cluster.",
      scifiObservation: "This direction favors the sci-fi cluster.",
      compromiseObservation: "Between the interests, other genres rise.",
      mixedObservation: "Both interests appear, alongside other genres.",
      defaultQuery: { x: -0.9, y: 0.35 },
      schematicItems: [
        { id: 2916, title: "Total Recall", group: "scifi", x: -1, y: 0.65 },
        { id: 32, title: "Twelve Monkeys", group: "scifi", x: -0.72, y: 0.82 },
        { id: 1653, title: "Gattaca", group: "scifi", x: -0.36, y: 0.72 },
        { id: 1, title: "Toy Story", group: "family", x: 1, y: 0.64 },
        { id: 34, title: "Babe", group: "family", x: 0.66, y: 0.82 },
        { id: 2, title: "Jumanji", group: "family", x: 0.76, y: 0.15 },
        { id: 480, title: "Jurassic Park", group: "other", x: -0.42, y: 1.4 },
        { id: 2028, title: "Saving Private Ryan", group: "other", x: -0.19, y: 1.35 },
        { id: 3175, title: "Galaxy Quest", group: "other", x: 0.04, y: 1.4 },
        { id: 356, title: "Forrest Gump", group: "other", x: 0.28, y: 1.32 },
        { id: 1580, title: "Men in Black", group: "other", x: 0.51, y: 1.29 }
      ],
      pctmCaption: "Evidence stays separate until candidate scoring.",
      pctmCombination: "Weighted evidence + popularity → one ranking",
      pctmObservation: "Toy Story remains in this fitted model’s top 5.",
      diagramLabel: "A possible advantage of a simpler model, illustrated with movie covers. In a schematic dot-product space, the draggable query h initially returns SASRec’s real top five for Toy Story 2 followed by The Matrix. Later rankings use the illustrated coordinates. Moving h favors either interest, while a compromise also retrieves other genres. The second build shows PCTM’s real source-specific transition evidence and recommendations for this history. This illustration does not identify the cause of the preceding benchmark differences.",
      note: "Schematic geometry · Initial SASRec and PCTM rankings: fitted MovieLens-1M models."
    }
  });
})();
