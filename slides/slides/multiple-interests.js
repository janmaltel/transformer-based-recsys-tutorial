(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
    id: "multiple-interests", type: "sasrec",
    eyebrow: "Block 2 · Simple sequential models",
    title: "Where can a simpler model help?",
    subtitle: "Multiple interests in one history: The Matrix → The Terminator → Toy Story.",
    sasrecVisual: "scaling-slide", buildSteps: 2,
    citationKeys: ["kang2018sasrec", "petrov2026pctm"],
    scaling: {
      diagram: "multiple-interests", points: [],
      sasrecHeading: "SASRec: one direction for both interests",
      pctmHeading: "PCTM: evidence from each recent film",
      familyLabel: "Children’s films", scifiLabel: "Sci-fi / action",
      otherLabel: "Other films",
      dragHint: "Drag h · Arrow keys also move it",
      resetLabel: "Reset vector",
      scoreRule: "Score = h · item vector",
      schematicCaption: "Schematic coordinates · Initial top 5 match the SASRec checkpoint.",
      defaultObservation: "Initial SASRec top 5: Terminator 2 is absent.",
      familyObservation: "This direction favors the children’s-film cluster.",
      scifiObservation: "This direction favors the sci-fi cluster.",
      compromiseObservation: "Between the interests, other genres rise.",
      mixedObservation: "Both interests appear, alongside other genres.",
      defaultQuery: { x: 0.9, y: 0.35 },
      schematicItems: [
        { id: 589, title: "Terminator 2", group: "scifi", x: -1, y: 0.65 },
        { id: 2916, title: "Total Recall", group: "scifi", x: -0.72, y: 0.82 },
        { id: 32, title: "Twelve Monkeys", group: "scifi", x: -0.36, y: 0.72 },
        { id: 3114, title: "Toy Story 2", group: "family", x: 1, y: 0.64 },
        { id: 2355, title: "A Bug’s Life", group: "family", x: 0.66, y: 0.82 },
        { id: 595, title: "Beauty and the Beast", group: "family", x: 0.76, y: 0.15 },
        { id: 2700, title: "South Park", group: "other", x: 0.42, y: 1.4 },
        { id: 1265, title: "Groundhog Day", group: "other", x: 0.19, y: 1.35 },
        { id: 2028, title: "Saving Private Ryan", group: "other", x: -0.04, y: 1.4 },
        { id: 356, title: "Forrest Gump", group: "other", x: -0.28, y: 1.32 },
        { id: 318, title: "The Shawshank Redemption", group: "other", x: -0.51, y: 1.29 }
      ],
      pctmCaption: "Line width: PCTM pairwise probability · One shared scale.",
      pctmCombination: "Weighted evidence + popularity → one ranking",
      pctmObservation: "Terminator 2 (#3) and Toy Story 2 (#5) both appear.",
      diagramLabel: "A possible advantage of a simpler model, illustrated with movie covers. In a schematic dot-product space, the draggable query h initially returns SASRec’s real top five for The Matrix followed by The Terminator and Toy Story. Later rankings use the illustrated coordinates. Moving h favors either interest, while a compromise also retrieves other genres. The second build shows PCTM’s real source-specific transition evidence and recommendations for this history. This illustration does not identify the cause of the preceding benchmark differences.",
      note: "Schematic geometry · Initial SASRec and PCTM rankings: fitted MovieLens-1M models."
    }
  });
})();
