(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams["loss-choices"] = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel);
    svg.setAttribute("viewBox", "0 0 1100 280");
    var bce = k.group(svg, 0), softmax = k.group(svg, 1);
    k.text(bce, 260, 26, "Original SASRec", "sc-catalogue-title");
    k.text(bce, 260, 53, "1 positive + 1 sampled negative");
    k.box(bce, 70, 80, 150, 42, "Positive s₊", "sc-positive");
    k.box(bce, 70, 148, 150, 42, "Negative s⁻", "sc-negative");
    k.arrow(bce, 230, 102, 305, 102); k.arrow(bce, 230, 170, 305, 170);
    k.box(bce, 320, 80, 150, 42, "Sigmoid → 1", "sc-positive");
    k.box(bce, 320, 148, 150, 42, "Sigmoid → 0", "sc-negative");
    k.text(bce, 260, 240, "Independent binary predictions", "sc-diagram-emphasis");
    k.text(bce, 260, 266, "2 item scores per training position");
    k.text(softmax, 820, 26, "Alternative: full-catalogue softmax", "sc-catalogue-title");
    k.text(softmax, 820, 53, "Another popular choice · e.g. BERT4Rec");
    k.box(softmax, 580, 70, 185, 26, "Positive score s₊", "sc-positive");
    k.box(softmax, 580, 104, 185, 26, "Candidate 1 score", "sc-negative");
    k.box(softmax, 580, 138, 185, 26, "Candidate 2 score", "sc-negative");
    k.text(softmax, 672, 180, "⋮", "sc-catalogue-title");
    k.box(softmax, 580, 190, 185, 26, "Last candidate score", "sc-negative");
    [83, 117, 151, 203].forEach(function (y) {
      k.node("path", { d: "M775 " + y + " H795", "class": "sc-arrow" }, softmax);
    });
    k.node("path", { d: "M795 83 V203", "class": "sc-arrow" }, softmax);
    k.arrow(softmax, 795, 143, 820, 143);
    k.box(softmax, 830, 107, 240, 72, "Softmax over all items");
    k.text(softmax, 820, 240, "One distribution; choose the positive", "sc-diagram-emphasis");
    k.text(softmax, 820, 266, "One score per catalogue item");
    k.node("line", { x1: 550, y1: 10, x2: 550, y2: 265, "class": "sc-catalogue-divider" }, svg);
  };
})(window);
