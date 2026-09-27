(function (root) {
  "use strict";
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SASRecTrainingData;
    var canvas = kit.create(content, "Parallel sequence training and a shared parameter update",
      "Two user rows enter one shared causal encoder. Each valid position produces a representation and a sampled BCE loss. The three valid positions for u17 and two for u23 contribute five losses. Padding contributes none. Average the five losses, backpropagate, then update the shared encoder and item embeddings.",
      { className: "batch-optimization-figure", height: 560 });
    var draw = canvas.draw;
    var inputs = kit.stage(draw, 0, "optimization-inputs");
    var forward = kit.stage(draw, 1, "optimization-forward");
    var losses = kit.stage(draw, 2, "optimization-losses");
    var backward = kit.stage(draw, 3, "optimization-backward");
    d.label(inputs, "INPUT BATCH", 30, 22);
    d.text(inputs, "2 users × 3 positions", 30, 49, { size: 19 });
    d.label(forward, "SHARED CAUSAL ENCODER", 400, 22);
    d.label(losses, "LOSS AT EACH VALID POSITION", 830, 22);
    d.text(losses, "Positive + sampled negatives", 830, 49, { size: 19 });
    kit.panel(forward, 405, 100, 338, 270, { fill: kit.colors.ink, stroke: kit.colors.ink });
    d.centered(forward, "One forward pass", 574, 125, { size: 23, color: kit.colors.white });
    d.centered(forward, "Batched GPU operations", 574, 340, { size: 18, color: kit.colors.white });
    var count = 0;
    data.batch.forEach(function (sequence, row) {
      var y = 102 + row * 152, formatted = data.supervisionRow(sequence, data.windowLength);
      d.label(inputs, data.users[row], 30, y + 25, { size: 17 });
      formatted.input.forEach(function (movie, column) {
        var x = 104 + column * 80;
        var cell = inputs.group().attr({ "data-optimization-user": data.users[row],
          "data-optimization-column": column, "data-input-movie": movie ? movie.id : 0 });
        if (movie) {
          kit.poster(cell, "", x, y, { width: 52, height: 78, movieId: movie.id });
          cell.attr({ "aria-label": movie.title });
        } else {
          cell.rect(52, 78).move(x, y).fill(kit.colors.paper)
            .stroke({ color: kit.colors.line, width: 1, dasharray: "4 3" });
          d.centered(cell, "PAD", x + 26, y + 39, { size: 14, color: kit.colors.muted });
        }
        d.text(inputs, String(column + 1), x + 26, y + 91,
          { size: 14, anchor: "middle", color: kit.colors.muted });
        var mask = formatted.mask[column];
        var vector = forward.group().attr({ "data-representation-valid": mask });
        if (mask) {
          var values = root.SASRecDiagramData.contextualVectors[column];
          if (row) values = values.map(function (value) { return -value; });
          kit.embeddingVector(vector, values,
            437 + column * 97, y + 45, { cellWidth: 9, height: 22,
              label: "Representation for " + data.users[row] + ", position " + (column + 1) });
        } else {
          d.centered(vector, "—", 474 + column * 97, y + 56, { size: 20, color: kit.colors.muted });
        }
        var loss = losses.group().attr({ "data-optimization-mask": mask,
          "data-loss-user": data.users[row], "data-loss-position": column + 1 });
        var lx = 847 + column * 100;
        loss.rect(82, 60).move(lx, y + 12).fill(mask ? kit.colors.accentSoft : kit.colors.paper)
          .stroke({ color: mask ? kit.colors.accent : kit.colors.line, width: 1 });
        d.centered(loss, mask ? "ℓ" + (++count) : "—", lx + 41, y + 42,
          { size: 25, color: mask ? kit.colors.accent : kit.colors.muted });
      });
      d.arrow(forward, 345, y + 41, 390, y + 41);
      d.arrow(losses, 758, y + 41, 818, y + 41);
    });
    d.text(forward, "One representation per position", 574, 391,
      { size: 17, anchor: "middle", color: kit.colors.muted });
    d.text(losses, "Padding excluded", 847, 363, { size: 17, color: kit.colors.muted });
    d.arrow(losses, 988, 393, 988, 425);
    kit.panel(losses, 830, 438, 318, 74, { fill: kit.colors.paper });
    d.centered(losses, "Mean of 5 valid losses", 989, 475, { size: 23 });
    var updates = kit.panel(backward, 405, 438, 338, 74, { fill: kit.colors.accentSoft });
    updates.attr({ "data-shared-parameter-update": "encoder-and-item-embeddings" });
    d.centered(backward, "Encoder + item embeddings", 574, 475, { size: 22 });
    d.arrow(backward, 816, 475, 758, 475, { color: kit.colors.accent });
    d.label(backward, "BACKPROPAGATE", 790, 529, { size: 13, anchor: "middle" });
    d.label(backward, "OPTIMIZER UPDATE", 574, 529, { size: 13, anchor: "middle" });
    d.text(backward, "Shared parameters across users", 30, 458, { size: 19 });
    d.text(backward, "and sequence positions", 30, 486, { size: 19 });
  }
  (root.SASRecVisualParts = root.SASRecVisualParts || {})["batch-optimization"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
