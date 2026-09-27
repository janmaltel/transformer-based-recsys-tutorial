(function (root) {
  "use strict";
  var items = [
    { title: "Toy Story 2", id: 3114, sign: "positive", step: 1, symbol: "s^+", vector: [2, -.4] },
    { title: "Heat", id: 6, sign: "negative", step: 2, symbol: "s_1", vector: [-1.6, 1.2] },
    { title: "Jaws", id: 1387, sign: "negative", step: 2, symbol: "s_2", vector: [-1.6, -1.2] }
  ];
  items.forEach(function (item) { Object.freeze(item.vector); Object.freeze(item); });
  var bounds = Object.freeze([Object.freeze([-3, 3]), Object.freeze([-2, 2])]);
  var sampledRange;
  function clamp(position) {
    if (!Array.isArray(position) || position.length !== 2 || !position.every(Number.isFinite)) {
      throw new Error("A finite two-dimensional position is required");
    }
    return position.map(function (value, index) { return Math.max(bounds[index][0], Math.min(bounds[index][1], value)); });
  }
  function scores(position, vectors) {
    clamp(position);
    return (vectors || items.map(function (item) { return item.vector; })).map(function (vector) {
      return position[0] * vector[0] + position[1] * vector[1];
    });
  }
  function lossRange() {
    if (sampledRange) return sampledRange;
    var result = { min: Infinity, max: -Infinity }, steps = 200;
    // Sample the interior and all four edges once, using the same bounds as dragging.
    for (var x = 0; x <= steps; x++) {
      for (var y = 0; y <= steps; y++) {
        var position = [x, y].map(function (step, axis) {
          return bounds[axis][0] + (bounds[axis][1] - bounds[axis][0]) * step / steps;
        });
        var values = scores(position);
        var loss = root.SASRecObjectiveMath.contributions(values[0], values.slice(1)).total;
        if (loss < result.min) { result.min = loss; result.minPosition = Object.freeze(position); }
        if (loss > result.max) { result.max = loss; result.maxPosition = Object.freeze(position); }
      }
    }
    sampledRange = Object.freeze(result);
    return sampledRange;
  }
  root.SASRecObjectiveSpace = {
    items: Object.freeze(items), initial: Object.freeze([0, .5]), bounds: bounds,
    clamp: clamp, scores: scores, lossRange: lossRange,
    toPlot: function (p) { return [380 + 110 * p[0], 245 - 110 * p[1]]; },
    fromPlot: function (p) { return clamp([(p[0] - 380) / 110, (245 - p[1]) / 110]); }
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
