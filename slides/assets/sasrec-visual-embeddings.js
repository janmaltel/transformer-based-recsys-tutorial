(function (root) {
  "use strict";

  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SASRecDiagramData;
    var canvas = kit.create(content, "Learned position embeddings in SASRec",
      "Babe, Jumanji, and Toy Story retain their item embeddings. A learned position table has one row for each slot up to the maximum sequence length. The selected positional vectors are added element by element to the item vectors before sequence encoding.",
      { className: "sasrec-detail sasrec-position-detail", height: 560 });
    var draw = canvas.draw;
    var inputs = kit.stage(draw, 0, "position-inputs");
    d.inputs(inputs, false);
    d.label(inputs, "SEQUENCE ENCODING", 420, 32);

    var table = kit.stage(draw, 1, "position-table");
    d.label(table, "POSITION EMBEDDING TABLE", 22, 32);
    d.text(table, "One learned row per slot", 22, 61, { color: kit.colors.muted });
    [0, 1, 2, 3, 4].forEach(function (row) {
      var y = 113 + row * 48;
      kit.panel(table, 22, y, 272, 48, {
        fill: row < 3 ? kit.colors.accentSoft : kit.colors.paper
      });
      d.centered(table, row === 3 ? "…" : row === 4 ? "max" : String(row + 1),
        53, y + 24, { size: 16 });
      if (row !== 3) {
        kit.embeddingVector(table, data.positionVectors[row === 4 ? 3 : row], 88, y + 12, {
          cellWidth: 21, height: 23, label: "Position table row " + (row === 4 ? "maximum" : row + 1)
        });
      }
    });
    d.text(table, "maximum sequence length", 22, 373, { size: 16, color: kit.colors.muted });
    d.text(table, "Position in the input window", 22, 417, { size: 17 });
    d.text(table, "not elapsed time", 22, 444, { size: 17, color: kit.colors.muted });

    var positions = kit.stage(draw, 2, "position-lookup");
    d.arrow(positions, 308, 303, 406, 303);
    d.label(positions, "lookup", 329, 276, { size: 13 });
    d.centers.forEach(function (x, index) {
      d.vector(positions, data.positionVectors[index], x, 292, "Looked-up position " + (index + 1));
      d.label(positions, String(index + 1), x - 77, 295);
    });
    d.text(positions, "position", 1050, 296, { color: kit.colors.muted });
    d.text(inputs, "item", 1050, 350, { color: kit.colors.muted });

    var sums = kit.stage(draw, 3, "position-sums");
    d.centers.forEach(function (x, index) {
      d.centered(sums, "+", x, 330, { size: 24 });
      d.arrow(sums, x, 283, x, 266);
      d.vector(sums, data.combined(index), x, 239, "Item plus position at slot " + (index + 1));
    });
    d.text(sums, "element-wise sum", 1050, 242, { size: 15, color: kit.colors.muted });
    d.colorScale(sums, 22, 496);

    var model = kit.stage(draw, 4, "position-model");
    kit.panel(model, 420, 136, 620, 62, { fill: kit.colors.ink, stroke: kit.colors.ink });
    d.centered(model, "Sequential model", 730, 167, { color: kit.colors.white, size: 25 });
    d.centers.forEach(function (x) { d.arrow(model, x, 230, x, 205); });
  }
  parts.embeddings = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
