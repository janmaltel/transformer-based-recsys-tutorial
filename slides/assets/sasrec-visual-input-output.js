(function (root) {
  "use strict";

  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  var example = root.CanonicalMoviePredictionExample;
  var vectors = root.SASRecDiagramData.itemVectors;

  function label(kit, group, value, x, y) {
    kit.text(group, value, x, y, {
      size: 15, weight: 600, color: kit.colors.accent,
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });
  }

  function arrow(kit, group, x, y, length, direction) {
    kit.flowArrow(group, x, y, length, {
      direction: direction || "up", shaftWidth: 2,
      headLength: 7, headWidth: 9, color: kit.colors.accent
    });
  }

  function render(content) {
    var kit = root.DiagramKit;
    var canvas = kit.create(content, "Sequence model inputs and outputs",
      "Babe, Jumanji, and Toy Story select nonadjacent rows of an item embedding table. Their embeddings enter a black-box sequential model in history order. Its final-position output represents the sequence. A schematic nearest-neighbor view places Toy Story 2 closest, followed by A Bug's Life and South Park.",
      { className: "sequence-input-output", height: 560 });
    var draw = canvas.draw;
    var inputs = kit.stage(draw, 0, "blackbox-inputs");
    var table = kit.stage(draw, 1, "blackbox-table");
    var lookup = kit.stage(draw, 2, "blackbox-lookup");
    var model = kit.stage(draw, 3, "blackbox-model");
    var retrieval = kit.stage(draw, 4, "blackbox-retrieval");

    label(kit, table, "ITEM EMBEDDING TABLE", 18, 38);
    var rows = [example.recommendations[3], example.history[2],
      example.recommendations[0], example.recommendations[4],
      example.history[0], example.recommendations[1],
      example.history[1], example.recommendations[2]];
    kit.text(table, "Movie", 26, 74, { size: 15, color: kit.colors.muted });
    kit.text(table, "Embedding", 178, 74, { size: 15, color: kit.colors.muted });
    rows.forEach(function (movie, index) {
      var y = 105 + index * 44;
      var selected = example.history.some(function (item) { return item.id === movie.id; });
      kit.panel(table, 18, y, 312, 44, {
        fill: selected ? kit.colors.accentSoft : kit.colors.paper,
        stroke: kit.colors.line
      });
      kit.text(table, movie.title, 26, y + 12, { size: 16, weight: selected ? 750 : 500 });
      kit.embeddingVector(table, vectors[movie.id], 178, y + 12, {
        cellWidth: 16, height: 21, label: movie.title + " table embedding"
      });
    });
    kit.text(table, "One learned vector per movie", 18, 476, {
      size: 16, color: kit.colors.muted, weight: 500
    });
    root.SASRecDetailKit.colorScale(table, 18, 516);

    label(kit, inputs, "SEQUENCE ENCODING", 418, 38);
    kit.text(inputs, "input sequence", 590, 532, {
      size: 14, color: kit.colors.muted, anchor: "middle"
    });
    example.history.forEach(function (movie, index) {
      var x = 418 + index * 136;
      kit.poster(inputs, movie.title, x, 391, {
        width: 72, height: 108, movieId: movie.id, fontSize: 15, captionWidth: 112
      });
      // The same tiles as the selected table row, now in chronological order.
      kit.embeddingVector(lookup, vectors[movie.id], x - 11, 344, {
        cellWidth: 11, height: 22, label: movie.title + " retrieved embedding"
      });
      arrow(kit, lookup, x + 36, 382, 12);
      arrow(kit, lookup, x + 36, 335, 22);
    });
    arrow(kit, lookup, 340, 355, 62, "right");
    kit.text(lookup, "lookup", 345, 331, { size: 14, color: kit.colors.muted });

    kit.panel(model, 400, 253, 412, 60, {
      fill: kit.colors.ink, stroke: kit.colors.ink
    });
    model.plain("Sequential model")
      .font({ family: '"IBM Plex Sans", system-ui, sans-serif', size: 25, weight: 600 })
      .fill(kit.colors.white)
      .attr({ x: 606, y: 283, "text-anchor": "middle", "dominant-baseline": "central" });
    // Only the last input position supplies the sequence representation here.
    arrow(kit, model, 726, 244, 36);
    kit.embeddingVector(model, root.SASRecDiagramData.contextualVectors[2], 678, 181, {
      cellWidth: 11, height: 23, label: "Sequence representation"
    });
    kit.text(model, "sequence representation", 726, 156, {
      size: 14, color: kit.colors.muted, anchor: "middle"
    });

    label(kit, retrieval, "NEAREST NEIGHBORS (KNN)", 866, 38);
    arrow(kit, retrieval, 788, 193, 110, "right");
    retrieval.circle(16).center(918, 193).fill(kit.colors.accent);
    kit.text(retrieval, "sequence", 875, 213, { size: 15, color: kit.colors.accent });
    var neighbors = [
      { movie: example.recommendations[0], x: 968, y: 181, px: 985, py: 122 },
      { movie: example.recommendations[1], x: 970, y: 303, px: 987, py: 256 },
      { movie: example.recommendations[2], x: 1102, y: 107, px: 1119, py: 72 }
    ];
    neighbors.forEach(function (neighbor, index) {
      var candidate = kit.stage(draw, 4 + index, "blackbox-neighbor");
      candidate.line(918, 193, neighbor.x, neighbor.y).stroke({
        color: index === 0 ? kit.colors.highlight : kit.colors.line,
        width: index === 0 ? 2 : 1, dasharray: index === 0 ? undefined : "3 4"
      });
      candidate.circle(index === 0 ? 11 : 8).center(neighbor.x, neighbor.y)
        .fill(index === 0 ? kit.colors.highlight : kit.colors.muted);
      kit.poster(candidate, neighbor.movie.title, neighbor.px, neighbor.py, {
        width: 72, height: 108, movieId: neighbor.movie.id, fontSize: 14, captionWidth: 100
      });
    });
    [[1116, 365], [1160, 280], [1133, 445], [889, 420]].forEach(function (point) {
      retrieval.circle(6).center(point[0], point[1]).fill(kit.colors.faint);
    });
  }

  parts["input-output"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
