(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit;
    var example = root.CanonicalMoviePredictionExample, data = root.SASRecDiagramData;
    var canvas = kit.create(content, "SASRec objective: one sequence and contrasting item embeddings",
      "Babe, Jumanji and Toy Story enter a causal sequence model. The last-position output is the sequence representation. Training raises its inner product with the observed next item, Toy Story 2, and lowers inner products with sampled negatives Heat and Jaws. These negatives are illustrative unobserved items, not explicit dislikes. Closeness means inner-product compatibility, not Euclidean distance.",
      { className: "objective-intuition", height: 500 });
    var draw = canvas.draw;
    var input = kit.stage(draw, 0, "objective-prefix");
    d.label(input, "ONE TRAINING PREFIX", 28, 24);
    example.history.forEach(function (movie, index) {
      var x = 58 + index * 168;
      kit.poster(input, movie.title, x, 339, {
        width: 78, height: 117, movieId: movie.id, fontSize: 18, captionWidth: 155
      });
      d.arrow(input, x + 39, 329, x + 39, 303);
    });
    kit.panel(input, 28, 231, 494, 64, { fill: kit.colors.ink, stroke: kit.colors.ink });
    d.centered(input, "Causal sequence model", 275, 263, { size: 27, color: kit.colors.white });

    var output = kit.stage(draw, 1, "objective-representation");
    d.arrow(output, 433, 223, 433, 185);
    d.vector(output, data.contextualVectors[2], 433, 152, "Sequence representation h_t");
    d.text(output, "sequence representation", 433, 119, { size: 18, anchor: "middle" });
    d.text(output, "hₜ", 433, 82, { size: 27, anchor: "middle", weight: 650 });

    var positive = kit.stage(draw, 2, "objective-positive");
    d.arrow(positive, 510, 163, 635, 163);
    d.label(positive, "OBSERVED NEXT ITEM · POSITIVE", 680, 24, { color: kit.colors.success });
    kit.poster(positive, example.recommendations[0].title, 680, 63, {
      width: 66, height: 99, movieId: 3114, fontSize: 17, captionWidth: 120
    });
    d.text(positive, "item embedding", 814, 68, { size: 18 });
    d.vector(positive, data.itemVectors[3114], 870, 104, "Positive item embedding");
    d.text(positive, "higher similarity ↑", 814, 145, { size: 22, color: kit.colors.success, weight: 650 });

    var negatives = kit.stage(draw, 3, "objective-negatives");
    d.label(negatives, "SAMPLED ITEMS · NEGATIVES", 680, 225, { color: kit.colors.highlightDark });
    [{ id: 6, title: "Heat", vector: [-.3,.2,.1,-.5,-.4,.6,.2,-.2] },
      { id: 1387, title: "Jaws", vector: [.1,-.3,.5,.2,-.6,.2,.4,.1] }].forEach(function (movie, index) {
      var x = 680 + index * 240;
      kit.poster(negatives, movie.title, x, 265, {
        width: 56, height: 84, movieId: movie.id, fontSize: 17, captionWidth: 130
      });
      d.vector(negatives, movie.vector, x + 56, 385, movie.title + " illustrative embedding");
      d.text(negatives, "lower similarity ↓", x, 422, { size: 20, color: kit.colors.highlightDark, weight: 650 });
    });
    d.text(negatives, "Unobserved does not mean disliked", 680, 463, { size: 17, color: kit.colors.muted });
    kit.equation(canvas, "\\(\\text{Similarity score: }s_{t,j}=h_t^\\top e_j\\quad\\text{(inner product)}\\)", 4);
  }
  parts["training-objective"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
