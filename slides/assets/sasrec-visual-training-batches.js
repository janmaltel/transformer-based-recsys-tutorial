(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function poster(group, movie, x, y, width, captionWidth) {
    return root.DiagramKit.poster(group, movie.title, x, y, {
      width: width, height: width * 1.5, movieId: movie.id,
      fontSize: 17, captionWidth: captionWidth
    });
  }
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SASRecTrainingData;
    var canvas = kit.create(content, "Shifting a four-event sequence into three next-item training pairs",
      "Left: Babe, Jumanji, Toy Story, Toy Story 2 shown twice, with the upper copy shifted one position left. The three aligned pairs are Babe to Jumanji, Jumanji to Toy Story, and Toy Story to Toy Story 2. Right: the three inputs enter a causal sequence model. Each position predicts its next target using all preceding input items and itself. Toy Story 2 is a target only within this window.",
      { className: "poster-training-supervision", height: 540 });
    var draw = canvas.draw;
    var source = kit.stage(draw, 0, "training-source-sequence");
    d.label(source, "SHIFT THE OBSERVED SEQUENCE", 28, 24);
    d.text(source, "Source sequence · 4 events", 28, 325, { size: 19 });
    data.movies.forEach(function (movie, index) {
      poster(source, movie, 136 + index * 100, 366, 60, 97);
    });
    var shifted = kit.stage(draw, 1, "shifted-copy");
    d.text(shifted, "Same sequence · shifted one position", 28, 64, { size: 19 });
    data.movies.forEach(function (movie, index) {
      var node = poster(shifted, movie, 36 + index * 100, 105, 60, 97);
      if (index === 0) node.opacity(0.3);
    });
    [166, 266, 366].forEach(function (x) {
      d.arrow(shifted, x, 310, x, 234);
    });
    d.text(shifted, "3 aligned input–target pairs", 28, 496, { size: 20, weight: 600 });
    shifted.line(555, 22, 555, 522).stroke({ color: kit.colors.line, width: 1 });

    var model = kit.stage(draw, 2, "training-shared-model");
    d.label(model, "CAUSAL NEXT-ITEM SUPERVISION", 620, 24);
    d.text(model, "Targets", 620, 54, { size: 19 });
    kit.panel(model, 620, 265, 555, 69, { fill: kit.colors.ink, stroke: kit.colors.ink });
    d.centered(model, "Causal sequence model", 897, 299, { size: 27, color: kit.colors.white });
    d.text(model, "Input sequence · 3 positions", 897, 507, { size: 19, anchor: "middle" });
    data.pairs(data.movies).forEach(function (pair, index) {
      var x = 687 + index * 190;
      var group = kit.stage(draw, index + 2, "training-prediction-column");
      group.attr({ "data-target-movie": pair.target.id, "data-history-length": pair.history.length });
      poster(group, pair.target, x - 38, 105, 76, 177);
      d.arrow(group, x, 259, x, 247);
      d.arrow(group, x, 358, x, 341);
      poster(group, data.movies[index], x - 38, 366, 76, 177);
      d.text(group, "context: " + (index + 1) + (index ? " items" : " item"),
        x, 81, { size: 15, color: kit.colors.muted, anchor: "middle" });
    });
  }
  parts["training-batches"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
