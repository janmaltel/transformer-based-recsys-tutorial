(function (root) {
  "use strict";

  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function block(group, top, name) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit;
    kit.panel(group, 420, top, 620, 88, { fill: kit.colors.accentSoft, stroke: kit.colors.accent });
    group.line(435, top + 43, 1025, top + 43).stroke({ color: kit.colors.white, width: 1.5 });
    d.centered(group, "Position-wise feed-forward", 730, top + 22, { size: 20 });
    d.centered(group, "Causal self-attention", 730, top + 66, { size: 20 });
    d.label(group, name, 316, top + 37);
  }
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit;
    var canvas = kit.create(content, "Stacked SASRec blocks",
      "The same item-plus-position embeddings pass upward through repeated blocks. Each block combines causal self-attention across positions with a feed-forward transformation applied independently to each position. Two blocks are shown. The final-position output becomes the sequence representation.",
      { className: "sasrec-detail sasrec-stack-detail", height: 560 });
    var draw = canvas.draw;
    var inputs = kit.stage(draw, 0, "stack-inputs");
    d.inputs(inputs, true);
    d.label(inputs, "SASRec SEQUENCE ENCODER", 420, 32);
    d.text(inputs, "item + position", 1050, 350, { size: 15, color: kit.colors.muted });

    var first = kit.stage(draw, 1, "stack-first");
    block(first, 241, "block 1");
    d.centers.forEach(function (x) { d.arrow(first, x, 340, x, 331); });
    d.label(first, "ATTENTION", 22, 127);
    kit.multiline(first, ["Combines information", "across visible positions"], 22, 159, {
      size: 18, weight: 500, gap: 27
    });
    d.label(first, "FEED-FORWARD", 22, 241);
    kit.multiline(first, ["Transforms each position", "with shared parameters"], 22, 273, {
      size: 18, weight: 500, gap: 27
    });

    var repeated = kit.stage(draw, 2, "stack-repeated");
    block(repeated, 123, "block 2");
    d.centers.forEach(function (x) { d.arrow(repeated, x, 233, x, 214); });
    repeated.path("M1055 123 H1069 V329 H1055").fill("none")
      .stroke({ color: kit.colors.line, width: 1.5 });
    d.text(repeated, "repeat", 1082, 199, { size: 18 });
    d.text(repeated, "2 shown", 1082, 228, { size: 15, color: kit.colors.muted });
    d.text(repeated, "The causal rule is unchanged", 22, 385, {
      size: 17, color: kit.colors.muted
    });

    var output = kit.stage(draw, 3, "stack-output");
    d.output(output, 70);
    d.arrow(output, 960, 116, 960, 99);
  }
  parts.stack = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
