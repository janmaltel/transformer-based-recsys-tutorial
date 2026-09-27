(function (root) {
  "use strict";
  var k = root.ScalingSlideKit, diagrams = root.ScalingDiagrams;
  diagrams.sampling = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), a = k.group(svg, 0);
    k.text(a, 185, 42, "Catalog");
    k.box(a, 80, 68, 210, 40, "Observed positive", "sc-positive");
    k.box(a, 80, 118, 210, 135, "N − 1 other items", "sc-box");
    var b = k.group(svg, 1); k.arrow(b, 310, 160, 380, 160);
    k.text(b, 515, 42, "Sampled example");
    k.box(b, 410, 68, 210, 40, "Observed positive", "sc-positive");
    k.box(b, 410, 118, 210, 40, "k sampled negatives", "sc-negative");
    k.text(b, 515, 215, "Positive retained: 100%");
    k.text(b, 515, 248, "Most negatives are hidden");
    var c = k.group(svg, 2); k.text(c, 350, 310, "Positives look more common → scores inflate", "sc-diagram-emphasis");
  };
  diagrams.model = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), a = k.group(svg, 0);
    ["i₁", "i₂", "i₃", "i₄"].forEach(function (item, index) { k.box(a, 40 + index * 75, 42, 58, 40, item); });
    k.arrow(a, 180, 90, 180, 122); k.box(a, 35, 130, 295, 65, "Causal SASRec encoder");
    k.arrow(a, 330, 162, 395, 162); k.box(a, 405, 137, 65, 50, "h");
    var b = k.group(svg, 1); k.arrow(b, 475, 157, 535, 87); k.arrow(b, 475, 167, 535, 205);
    k.box(b, 545, 65, 130, 45, "s₊ = hᵀe₊", "sc-positive");
    k.box(b, 545, 187, 130, 45, "s₁⁻ … sₖ⁻", "sc-negative");
    var c = k.group(svg, 2); k.arrow(c, 610, 115, 610, 140); k.arrow(c, 610, 185, 610, 165);
    k.box(c, 555, 140, 110, 30, "gBCE");
    k.text(c, 345, 288, "Loss → gradients in encoder and item representations", "sc-diagram-emphasis");
  };
})(window);
