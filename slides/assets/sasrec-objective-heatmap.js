(function (root) {
  "use strict";
  var columns = 60, rows = 40;
  var colors = [[222, 237, 245], [248, 244, 231], [222, 175, 111]];
  function color(value) {
    var scaled = Math.max(0, Math.min(1, value)) * 2;
    var index = Math.min(1, Math.floor(scaled)), t = scaled - index;
    return "rgb(" + colors[index].map(function (v, channel) {
      return Math.round(v + t * (colors[index + 1][channel] - v));
    }).join(",") + ")";
  }
  function sample(vectors, mode) {
    var space = root.SASRecObjectiveSpace, bounds = space.bounds;
    var cells = [], min = Infinity, max = -Infinity;
    for (var row = 0; row < rows; row++) {
      for (var column = 0; column < columns; column++) {
        var position = [bounds[0][0] + (column + .5) / columns * (bounds[0][1] - bounds[0][0]),
          bounds[1][1] - (row + .5) / rows * (bounds[1][1] - bounds[1][0])];
        var loss = root.SASRecObjectiveMath.evaluate(space.scores(position, vectors), vectors, mode).total;
        cells.push(loss); min = Math.min(min, loss); max = Math.max(max, loss);
      }
    }
    return { cells: cells, min: min, max: max, columns: columns, rows: rows };
  }
  function create(svg, legend) {
    var ns = "http://www.w3.org/2000/svg", space = root.SASRecObjectiveSpace;
    function node(parent, tag, attrs) {
      var element = document.createElementNS(ns, tag);
      Object.keys(attrs).forEach(function (name) { element.setAttribute(name, attrs[name]); });
      parent.appendChild(element); return element;
    }
    var layer = node(svg, "g", { class: "sasrec-stage objective-heatmap", "data-build-step": 2,
      role: "img", "aria-label": "Loss over possible sequence representations, with current movie embeddings fixed" });
    layer.style.display = "none";
    var title = node(layer, "title", {}), rects = [], key = null;
    var corner = space.toPlot([space.bounds[0][0], space.bounds[1][1]]);
    var opposite = space.toPlot([space.bounds[0][1], space.bounds[1][0]]);
    var width = (opposite[0] - corner[0]) / columns, height = (opposite[1] - corner[1]) / rows;
    function label(text, className) {
      var element = document.createElement("span"); element.className = className || "";
      element.textContent = text; legend.appendChild(element); return element;
    }
    label("Loss over hₜ");
    var low = label("", "objective-heatmap-limit");
    var ramp = label("", "objective-heatmap-ramp");
    ramp.setAttribute("aria-hidden", "true");
    ramp.style.background = "linear-gradient(to right," + [0, .5, 1].map(color).join(",") + ")";
    var high = label("", "objective-heatmap-limit");
    label("linear · sampled range", "objective-heatmap-scope");
    function update(vectors, mode, visible) {
      layer.style.display = visible ? "" : "none";
      legend.hidden = !visible;
      svg.classList.toggle("has-heatmap", visible);
      if (!visible) return;
      // h_t selects a point on this surface; only the movie vectors or objective change it.
      var nextKey = JSON.stringify([mode, vectors]);
      if (nextKey === key) return;
      var grid = sample(vectors, mode), span = grid.max - grid.min;
      grid.cells.forEach(function (loss, index) {
        if (!rects[index]) rects[index] = node(layer, "rect", {
          x: corner[0] + index % columns * width, y: corner[1] + Math.floor(index / columns) * height,
          width: width, height: height
        });
        rects[index].setAttribute("fill", color(span > 1e-12 ? (loss - grid.min) / span : 0));
      });
      low.textContent = grid.min.toFixed(3); high.textContent = grid.max.toFixed(3);
      title.textContent = (mode === "bce" ? "BCE" : "Three-candidate softmax") +
        " loss at each hₜ position. Current movie embeddings held fixed. Blue is lower, amber higher. " +
        "Linear color scale over sampled losses " + low.textContent + " to " + high.textContent + ".";
      legend.setAttribute("aria-label", title.textContent);
      key = nextKey;
    }
    return { update: update };
  }
  root.SASRecObjectiveHeatmap = { sample: sample, create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
