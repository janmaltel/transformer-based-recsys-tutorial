(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function sequence(kit, d, group, events, x, y, pitch) {
    events.forEach(function (event, index) {
      var target = index === events.length - 1;
      kit.poster(group, event.movie.title, x + index * pitch, y, {
        width: 55, height: 82.5, movieId: event.movie.id, fontSize: 14, captionWidth: pitch - 10
      });
      d.text(group, target ? "target" : "history", x + index * pitch, y - 25, {
        size: 13, color: target ? kit.colors.highlightDark : kit.colors.muted
      });
      if (index < events.length - 1) {
        d.arrow(group, x + index * pitch + 64, y + 41,
          x + (index + 1) * pitch - 10, y + 41);
      }
    });
  }
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, example = root.TrainingDataExample;
    var canvas = kit.create(content, "MovieLens rating inclusion and training sequences",
      "An illustrative user's ratings include a two-star rating for Heat. Keeping all rating events defines a recommender for the next reviewed movie. Keeping ratings of at least four stars excludes Heat and defines a recommender for the next liked movie. Each sequence shows a history and its next retained-item target.",
      { className: "movielens-training", height: 580 });
    var draw = canvas.draw;
    var raw = kit.stage(draw, 0, "rating-events");
    d.label(raw, "ILLUSTRATIVE RATING EVENTS · USER u17", 28, 26);
    example.events.forEach(function (event, index) {
      var x = 210 + index * 175;
      d.text(raw, event.time, x, 60, { size: 15, color: kit.colors.muted });
      kit.poster(raw, event.movie.title, x, 88, {
        width: 60, height: 90, movieId: event.movie.id, fontSize: 15, captionWidth: 153
      });
      d.text(raw, "★".repeat(event.rating) + "☆".repeat(5 - event.rating), x, 207, {
        size: 17, color: kit.colors.highlightDark
      });
    });
    var all = kit.stage(draw, 1, "rating-all");
    d.text(all, "All rating events", 28, 282, { size: 22, weight: 600 });
    d.text(all, "→ “What is the next reviewed movie?” recommender", 28, 316, { size: 18 });
    sequence(kit, d, all, example.retainRatings(1), 28, 378, 105);

    var positive = kit.stage(draw, 2, "rating-positive");
    positive.line(600, 282, 600, 493).stroke({ color: kit.colors.line, width: 1 });
    d.text(positive, "Keep ratings ≥ 4", 655, 282, { size: 22, weight: 600 });
    d.text(positive, "→ “What is the next liked movie?” recommender", 655, 316, { size: 18 });
    sequence(kit, d, positive, example.retainRatings(4), 655, 378, 130);
  }
  parts["movielens-training"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
