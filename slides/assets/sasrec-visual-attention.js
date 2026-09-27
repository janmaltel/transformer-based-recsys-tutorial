(function (root) {
  "use strict";

  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SASRecDiagramData;
    var canvas = kit.create(content, "Causal self-attention in SASRec",
      "Three item-plus-position embeddings enter one self-attention layer. Arrows connect each available input position to its output; their heads stop at separate points along each output vector. The causal mask shows the same connections as a lower-triangular grid. The mask encodes allowed information flow, not learned attention weights.",
      { className: "sasrec-detail sasrec-attention-detail", height: 560 });
    var draw = canvas.draw;
    var colors = kit.colors;
    var inputs = kit.stage(draw, 0, "attention-inputs");

    // The mask is the connectivity diagram: using cells instead of wires keeps
    // the triangular causal pattern legible without crossing arrows.
    d.label(inputs, "CAUSAL MASK", 28, 34);
    d.text(inputs, "Output i reads inputs 1 through i.", 28, 76, {
      size: 17, color: colors.ink
    });
    d.text(inputs, "Later inputs are masked.", 28, 107, {
      size: 15, color: colors.muted
    });
    d.text(inputs, "input position", 209, 164, {
      size: 14, color: colors.muted, anchor: "middle"
    });
    d.text(inputs, "output", 75, 191, {
      size: 14, color: colors.muted, anchor: "middle"
    });
    [1, 2, 3].forEach(function (position, index) {
      d.label(inputs, String(position), 151 + index * 58, 194, {
        anchor: "middle", size: 14
      });
    });
    [1, 2, 3].forEach(function (position, row) {
      var y = 214 + row * 48;
      d.centered(inputs, String(position), 75, y + 19, {
        size: 15, color: colors.accent
      });
      [0, 1, 2].forEach(function (source) {
        var x = 126 + source * 58;
        kit.panel(inputs, x, y, 50, 38, {
          fill: colors.paper, stroke: colors.lineFaint
        });
      });
    });
    d.text(inputs, "✓ allowed", 28, 380, { size: 15, color: colors.accent });
    d.text(inputs, "× masked", 155, 380, { size: 15, color: colors.muted });

    // Three outputs share one layer, aligned with their input positions.
    kit.panel(inputs, 400, 58, 770, 258, { fill: colors.paper });
    d.centered(inputs, "One self-attention layer", 785, 84, { size: 22 });
    d.text(inputs, "Contextual output", 785, 116, {
      size: 15, color: colors.muted, anchor: "middle"
    });
    d.centers.forEach(function (x, index) {
      var center = x;
      d.text(inputs, "Position " + (index + 1), center, 151, {
        size: 15, anchor: "middle", color: colors.secondary
      });
    });
    d.inputs(inputs, true);
    d.text(inputs, "item + position", 1050, 350, { size: 15, color: colors.muted });
    d.centers.forEach(function (x, position) {
      var center = x;
      var step = kit.stage(draw, position + 1, "sasrec-detail-reveal attention-position");
      step.attr({ "data-attention-position": position + 1 });

      // Reveal the exact mask row alongside its corresponding output.
      var rowY = 214 + position * 48;
      [0, 1, 2].forEach(function (source) {
        var allowed = source <= position;
        var cellX = 126 + source * 58;
        kit.panel(step, cellX, rowY, 50, 38, {
          fill: allowed ? colors.accent : colors.paper,
          stroke: allowed ? colors.accent : colors.lineFaint
        });
        d.centered(step, allowed ? "✓" : "×", cellX + 25, rowY + 19, {
          size: 18, color: allowed ? colors.white : colors.muted
        });
      });

      // Spread arrowheads across the output vector instead of converging on
      // its center. Source and target order stays monotonic, so the arrows do
      // not cross one another.
      var sources = data.visibleSources(position);
      sources.forEach(function (source, sourceIndex) {
        var targetX = center + (sourceIndex - (sources.length - 1) / 2) * 28;
        var edge = d.arrow(step, d.centers[source], 344, targetX, 233, {
          shaftWidth: 1.6, headLength: 8, headWidth: 8
        });
        edge.attr({
          "data-source-position": source + 1,
          "data-output-position": position + 1
        });
      });

      d.label(step, position === 0 ? "reads 1" : position === 1 ? "reads 1–2" : "reads 1–3",
        center, 178, { anchor: "middle", size: 15 });
      d.vector(step, data.contextualVectors[position], center, 198,
        "Contextual output at position " + (position + 1));
    });
  }
  parts["causal-block"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
