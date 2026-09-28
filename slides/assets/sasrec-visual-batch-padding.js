(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function cells(group, movies, x, y, kind, row) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit;
    movies.forEach(function (movie, column) {
      var cell = group.group().attr({
        "data-batch-kind": kind, "data-batch-row": row,
        "data-batch-column": column, "data-movie-id": movie ? movie.id : 0
      });
      var left = x + column * 105;
      if (movie) {
        var longTitle = movie.id === 924;
        kit.poster(cell, longTitle ? "" : movie.title, left, y, {
          width: 60, height: 90, movieId: movie.id, fontSize: 14, captionWidth: 103
        });
        if (longTitle) {
          cell.attr({ "aria-label": movie.title });
          kit.multiline(cell, ["2001: A Space", "Odyssey"], left, y + 95, { size: 14, gap: 17 });
        }
      } else {
        cell.rect(60, 90).move(left, y).fill(kit.colors.paper)
          .stroke({ color: kit.colors.line, width: 1.3, dasharray: "4 3" });
        d.centered(cell, kind === "target" ? "—" : "PAD", left + 30, y + 45, { size: 16, color: kit.colors.muted });
      }
    });
  }
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SASRecTrainingData;
    var canvas = kit.create(content, "Two users with different-length training sequences",
      "Three-position batch. User u17: inputs Babe, Jumanji, Toy Story; targets Jumanji, Toy Story, Toy Story 2; mask 1,1,1. User u23: inputs PAD, 2001: A Space Odyssey, Metropolis; supervised targets dash, Metropolis, Blade Runner; mask 0,1,1. Ignored target values are omitted. The causal mask separately blocks future positions.",
      { className: "poster-batch-padding", height: 500 });
    var draw = canvas.draw;
    var inputs = kit.stage(draw, 0, "batch-inputs");
    d.label(inputs, "BATCH SIZE 2 · WINDOW LENGTH 3", 28, 24);
    d.text(inputs, "Inputs", 190, 74, { size: 25, weight: 600 });
    var targets = kit.stage(draw, 1, "batch-targets");
    d.text(targets, "Next-item targets", 565, 74, { size: 25, weight: 600 });
    var masks = kit.stage(draw, 2, "batch-loss-mask");
    d.text(masks, "Loss mask", 970, 74, { size: 25, weight: 600 });
    [inputs, targets, masks].forEach(function (group, index) {
      var x = [190, 565, 970][index], pitch = index === 2 ? 55 : 105;
      [1, 2, 3].forEach(function (position, column) {
        d.text(group, String(position), x + column * pitch + (index === 2 ? 18 : 30), 122, {
          size: 14, anchor: "middle", color: kit.colors.muted
        });
      });
    });
    data.batch.forEach(function (sequence, row) {
      var y = 150 + row * 163, formatted = data.supervisionRow(sequence, data.windowLength);
      d.label(inputs, "USER " + data.users[row], 28, y + 12, { size: 16 });
      d.text(inputs, sequence.length + " events", 28, y + 45, { size: 18, color: kit.colors.muted });
      if (data.users[row] === "u23") {
        var history = inputs.group().attr({
          "data-source-history": "u23",
          "aria-label": "Full u23 sequence: 2001: A Space Odyssey, Metropolis, Blade Runner"
        });
        sequence.forEach(function (movie, index) {
          kit.poster(history, "", 28 + index * 42, y + 77, {
            width: 28, height: 42, movieId: movie.id
          }).attr({ "aria-label": movie.title, "data-source-movie-id": movie.id });
        });
      }
      cells(inputs, formatted.input, 190, y, "input", row);
      cells(targets, formatted.target, 565, y, "target", row);
      d.arrow(targets, 520, y + 39, 550, y + 39);
      formatted.mask.forEach(function (value, column) {
        var x = 970 + column * 55;
        var cell = masks.group().attr({ "data-mask-row": row, "data-mask-column": column, "data-loss-mask": value });
        cell.rect(36, 36).move(x, y + 21).fill(value ? kit.colors.accent : kit.colors.paper)
          .stroke({ color: value ? kit.colors.accent : kit.colors.line, width: 1 });
        d.centered(cell, String(value), x + 18, y + 39, { size: 20, color: value ? kit.colors.white : kit.colors.muted });
      });
      var count = formatted.mask.reduce(function (sum, value) { return sum + value; }, 0);
      d.text(masks, count + (count === 1 ? " valid target" : " valid targets"),
        970, y + 86, { size: 17, color: kit.colors.muted });
    });
    masks.line(28, 449, 1172, 449).stroke({ color: kit.colors.line, width: 1 });
    d.text(masks, "Loss is averaged over 5 valid positions", 28, 467, { size: 19 });
    d.text(masks, "≠ Causal mask: no future items", 765, 467, { size: 18, color: kit.colors.muted });
  }
  parts["batch-padding"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
