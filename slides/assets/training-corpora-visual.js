(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit;
    var canvas = kit.create(content, "Training corpora for language and recommendation",
      "Language models learn from large text corpora, including web documents and books. Sequential recommenders learn from historical interaction logs grouped by user and ordered by time. Both produce many sequences for next-token training. Words and movies shown here are illustrative examples.",
      { className: "training-corpora", height: 520 });
    var draw = canvas.draw;
    var language = kit.stage(draw, 0, "corpora-language");
    d.label(language, "LANGUAGE MODELING", 28, 28);
    d.text(language, "Text corpora", 28, 67, { size: 27, weight: 600 });
    d.text(language, "Web pages · books · articles", 28, 106, { size: 19, color: kit.colors.muted });
    d.arrow(language, 283, 151, 283, 189);
    d.label(language, "TEXT SEQUENCES", 28, 206);
    [
      ["the", "story", "continues", "…"],
      ["a", "new", "chapter", "…"],
      ["they", "arrived", "early", "…"]
    ].forEach(function (words, row) {
      d.text(language, "text " + (row + 1), 28, 258 + row * 58, {
        size: 15, color: kit.colors.muted
      });
      words.forEach(function (word, index) {
        kit.token(language, word, 113 + index * 105, 248 + row * 58, {
          width: 95, height: 42, size: 16, fill: index === 3 ? kit.colors.paper : kit.colors.accentSoft,
          color: index === 3 ? kit.colors.muted : kit.colors.accent
        });
      });
    });

    var logs = kit.stage(draw, 1, "corpora-interactions");
    logs.line(600, 26, 600, 427).stroke({ color: kit.colors.line, width: 1 });
    d.label(logs, "SEQUENTIAL RECOMMENDATION", 660, 28);
    d.text(logs, "Historical interaction logs", 660, 67, { size: 27, weight: 600 });
    d.text(logs, "Group by user · order by timestamp", 660, 106, {
      size: 19, color: kit.colors.muted
    });
    d.arrow(logs, 915, 151, 915, 189);
    d.label(logs, "USER SEQUENCES", 660, 206);
    var example = root.CanonicalMoviePredictionExample;
    [example.history, [example.recommendations[3], example.recommendations[4], example.history[0]]]
      .forEach(function (movies, row) {
        var y = 248 + row * 96;
        d.label(logs, row === 0 ? "u17" : "u23", 660, y + 20);
        movies.forEach(function (movie, index) {
          var x = 750 + index * 126;
          kit.poster(logs, movie.title, x, y, {
            width: 42, height: 63, movieId: movie.id, fontSize: 13, captionWidth: 108
          });
          if (index < 2) d.arrow(logs, x + 57, y + 31, x + 106, y + 31);
        });
        d.text(logs, "…", 1130, y + 16, { size: 28, color: kit.colors.muted });
      });
    var objective = kit.stage(draw, 2, "corpora-objective");
    objective.line(28, 462, 1172, 462).stroke({ color: kit.colors.line, width: 1 });
    d.text(objective, "Text prefix → next word", 28, 483, { size: 21 });
    d.text(objective, "Item history → next interaction", 660, 483, { size: 21 });
  }
  parts["training-corpora"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
