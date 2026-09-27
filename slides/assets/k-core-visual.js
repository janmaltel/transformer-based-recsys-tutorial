(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function matrix(kit, d, group, edges, x) {
    var users = ["u17", "u23", "u31", "u42"];
    var example = root.CanonicalMoviePredictionExample;
    var movies = example.history.concat(example.recommendations[0]);
    movies.forEach(function (movie, index) {
      kit.poster(group, movie.title, x + 72 + index * 53, 163, {
        width: 32, height: 48, movieId: movie.id, fontSize: 11, captionWidth: 65
      });
    });
    users.forEach(function (user, row) {
      var active = edges.some(function (edge) { return edge[0] === user; });
      d.label(group, user, x, 259 + row * 41, {
        size: 14, color: active ? kit.colors.accent : kit.colors.muted
      });
      movies.forEach(function (movie, column) {
        var found = edges.some(function (edge) { return edge[0] === user && edge[1] === movie.id; });
        var cell = group.rect(35, 30).move(x + 71 + column * 53, 254 + row * 41)
          .fill(found ? kit.colors.accent : kit.colors.paper)
          .stroke({ color: kit.colors.line, width: 1 });
        cell.attr({ "data-user": user, "data-movie-id": movie.id, "data-edge": String(found) });
        d.centered(group, found ? "1" : "·", x + 88.5 + column * 53, 269 + row * 41, {
          size: 15, color: found ? kit.colors.white : kit.colors.faint
        });
      });
    });
  }
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.TrainingDataExample;
    var canvas = kit.create(content, "Iterative bipartite k-core filtering",
      "A worked two-core example. Start with four users and four movies. Remove users and items with fewer than two distinct neighbors. Removing Toy Story and Toy Story 2 leaves u31 with only one movie, so another round removes u31. The stable core contains u17, u23, Babe, and Jumanji, each with two neighbors.",
      { className: "k-core-example", height: 540 });
    var draw = canvas.draw;
    var rounds = data.coreRounds(data.coreEdges, 2);
    var labels = ["Original interactions", "First pruning round", "Stable 2-core"];
    var descriptions = [
      ["Some users/items have", "fewer than 2 neighbors"],
      ["Remove sparse users/items", "u31 now has only 1 movie"],
      ["Remove u31", "All remaining degrees ≥ 2"]
    ];
    rounds.forEach(function (edges, index) {
      var x = 28 + index * 402;
      var group = kit.stage(draw, index, "k-core-round");
      group.attr({ "data-core-round": index });
      d.label(group, index === 0 ? "EXAMPLE: k = 2" : "RECOMPUTE DEGREES", x, 26);
      d.text(group, labels[index], x, 62, { size: 23, weight: 600 });
      kit.multiline(group, descriptions[index], x, 101, { size: 16, gap: 23, color: kit.colors.muted });
      matrix(kit, d, group, edges, x);
      if (index > 0) d.arrow(group, x - 66, 300, x - 14, 300);
    });
    var rule = kit.stage(draw, 3, "k-core-rule");
    rule.line(28, 452, 1172, 452).stroke({ color: kit.colors.line, width: 1 });
    d.text(rule, "Users: at least k distinct items", 28, 477, { size: 19 });
    d.text(rule, "Items: at least k distinct users", 610, 477, { size: 19 });
    d.text(rule, "Repeat until no further removals", 28, 516, { size: 18, color: kit.colors.accent });
    d.text(rule, "This excludes sparse users and items", 610, 516, { size: 18, color: kit.colors.muted });
  }
  parts["k-core"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
