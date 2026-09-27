(function (root) {
  "use strict";

  var centers = [500, 730, 960];
  function text(group, value, x, y, options) {
    var kit = root.DiagramKit;
    return kit.text(group, value, x, y, Object.assign({ size: 16, weight: 500 }, options));
  }
  function label(group, value, x, y, options) {
    return text(group, value, x, y, Object.assign({
      size: 14, weight: 600, color: root.DiagramKit.colors.accent,
      family: '"IBM Plex Mono", ui-monospace, monospace'
    }, options));
  }
  function arrow(group, x1, y1, x2, y2, options) {
    var dx = x2 - x1, dy = y2 - y1;
    var node = root.DiagramKit.flowArrow(group, x1, y1, Math.hypot(dx, dy),
      Object.assign({ direction: "right", shaftWidth: 2, headLength: 7, headWidth: 9 }, options));
    return node.rotate(Math.atan2(dy, dx) * 180 / Math.PI, x1, y1);
  }
  function vector(group, values, center, y, name) {
    root.DiagramKit.embeddingVector(group, values, center - 55.5, y, {
      cellWidth: 13, height: 23, label: name
    });
  }
  function centered(group, value, x, y, options) {
    options = options || {};
    return group.plain(value).font({
      family: '"IBM Plex Sans", system-ui, sans-serif',
      size: options.size || 23, weight: options.weight || 600
    }).fill(options.color || root.DiagramKit.colors.ink)
      .attr({ x: x, y: y, "text-anchor": "middle", "dominant-baseline": "central" });
  }
  function inputs(group, combined) {
    var kit = root.DiagramKit, data = root.SASRecDiagramData;
    root.CanonicalMoviePredictionExample.history.forEach(function (movie, index) {
      var x = centers[index];
      kit.poster(group, movie.title, x - 40, 390, {
        width: 80, height: 120, movieId: movie.id, fontSize: 17, captionWidth: 150
      });
      arrow(group, x, 383, x, 375);
      vector(group, combined ? data.combined(index) : data.itemVectors[movie.id], x, 346,
        movie.title + (combined ? " item plus position embedding" : " item embedding"));
    });
    text(group, "input sequence", 730, 542, {
      size: 14, anchor: "middle", color: kit.colors.muted
    });
  }
  function output(group, y) {
    var kit = root.DiagramKit;
    vector(group, root.SASRecDiagramData.contextualVectors[2], centers[2], y,
      "Sequence representation from the final position");
    text(group, "sequence representation", centers[2], y - 29, {
      size: 15, anchor: "middle", color: kit.colors.muted
    });
  }
  function colorScale(group, x, y) {
    var kit = root.DiagramKit;
    kit.embeddingVector(group, [-1, -0.66, -0.33, 0, 0.33, 0.66, 1], x, y, {
      cellWidth: 18, height: 15, label: "Shared signed color scale: negative, zero, positive"
    });
    ["−", "0", "+"].forEach(function (value, index) {
      text(group, value, x + index * 63, y + 20, { size: 14 });
    });
    text(group, "illustrative values", x + 158, y + 2, { size: 13, color: kit.colors.muted });
  }
  root.SASRecDetailKit = {
    centers: centers, text: text, label: label, arrow: arrow, vector: vector,
    centered: centered, inputs: inputs, output: output, colorScale: colorScale
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
