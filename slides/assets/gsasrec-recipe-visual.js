(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams["gsasrec-recipe"] = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel);
    svg.setAttribute("viewBox", "0 0 1100 270");
    var architecture = k.group(svg, 0);
    k.text(architecture, 245, 30, "Same SASRec architecture", "sc-catalogue-title");
    ["i₁", "i₂", "i₃", "i₄"].forEach(function (item, index) { k.box(architecture, 100 + index * 75, 65, 58, 36, item); });
    k.arrow(architecture, 245, 106, 245, 130);
    k.box(architecture, 100, 138, 290, 64, "Causal SASRec encoder");
    k.arrow(architecture, 400, 170, 465, 170); k.box(architecture, 475, 148, 60, 44, "h");
    k.arrow(architecture, 545, 159, 655, 93); k.arrow(architecture, 545, 180, 655, 201);
    k.box(architecture, 670, 70, 215, 42, "Positive score s₊", "sc-positive");
    var single = k.group(svg, 0); single.classList.add("recipe-single-negative");
    k.box(single, 670, 180, 215, 42, "One sampled negative", "sc-negative");
    var negatives = k.group(svg, 1); negatives.classList.add("recipe-negative-stack");
    k.text(negatives, 800, 145, "More negatives", "sc-catalogue-title");
    for (var card = 3; card >= 0; card--) k.box(negatives, 670 + card * 10, 170 + card * 16, 215, 42, "", "sc-negative");
    k.text(negatives, 778, 197, "k sampled negatives");
    var loss = k.group(svg, 2);
    k.text(loss, 998, 30, "Adjusted loss", "sc-catalogue-title");
    k.arrow(loss, 898, 91, 946, 140); k.arrow(loss, 928, 203, 946, 165);
    k.box(loss, 952, 132, 100, 48, "gBCE");
    k.text(architecture, 245, 246, "Encoder + item embeddings", "sc-diagram-text");
  };
})(window);
