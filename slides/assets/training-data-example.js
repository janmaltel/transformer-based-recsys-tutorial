(function (root) {
  "use strict";
  var movies = root.CanonicalMoviePredictionExample;
  // Synthetic teaching events, not a real MovieLens user's recorded ratings.
  var events = [
    { movie: movies.history[0], rating: 5, time: "09:12" },
    { movie: { id: 6, title: "Heat" }, rating: 2, time: "09:15" },
    { movie: movies.history[1], rating: 4, time: "09:18" },
    { movie: movies.history[2], rating: 5, time: "09:24" },
    { movie: movies.recommendations[0], rating: 4, time: "09:31" }
  ];
  function retainRatings(minimum) {
    return events.filter(function (event) { return event.rating >= minimum; });
  }
  // Bipartite graph degree counts distinct neighbors, not repeated events.
  function coreRounds(edges, k) {
    if (!Number.isInteger(k) || k < 1) throw new Error("k must be a positive integer");
    var unique = new Map();
    edges.forEach(function (edge) { unique.set(JSON.stringify(edge), edge.slice()); });
    var remaining = Array.from(unique.values()), rounds = [remaining];
    while (remaining.length) {
      var users = new Map(), items = new Map();
      remaining.forEach(function (edge) {
        users.set(edge[0], (users.get(edge[0]) || 0) + 1);
        items.set(edge[1], (items.get(edge[1]) || 0) + 1);
      });
      var next = remaining.filter(function (edge) {
        return users.get(edge[0]) >= k && items.get(edge[1]) >= k;
      });
      if (next.length === remaining.length) break;
      rounds.push(next);
      remaining = next;
    }
    return rounds;
  }
  root.TrainingDataExample = {
    events: events, retainRatings: retainRatings, coreRounds: coreRounds,
    coreEdges: [["u17", 34], ["u17", 2], ["u23", 34], ["u23", 2],
      ["u31", 2], ["u31", 1], ["u42", 3114]]
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
