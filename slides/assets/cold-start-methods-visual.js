(function (root) {
  "use strict";
  var k = root.DenseRecKit;
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};

  function flow(parent, slide, formulas) {
    var row = k.el(parent, "div", "cold-method-flow");
    slide.scaling.points.slice(4).forEach(function (point, i) {
      if (i) k.arrow(row);
      var node = k.el(row, "div", "cold-method-node");
      k.copy(node, "span", "dr-label", slide, "/scaling/points/" + (i + 4) + "/label", point.label);
      k.math(node, formulas[i]);
    });
  }

  function tradeoffs(parent, slide) {
    var row = k.stage(k.el(parent, "section", "cold-method-tradeoffs dr-two-columns"), 2);
    k.point(k.el(row, "section"), slide, 2);
    k.point(k.el(row, "section"), slide, 3);
  }

  function contentOnly(content, slide) {
    var frame = k.frame(content, slide);
    frame.host.classList.add("cold-method");
    var input = k.stage(k.el(frame.body, "section"), 0);
    k.point(input, slide, 0);
    flow(input, slide, ["x_{i_1},\\ldots,x_{i_t}", "c_{i_1},\\ldots,c_{i_t}", "e_{i_1},\\ldots,e_{i_t}", "h_t"]);
    var score = k.stage(k.el(frame.body, "section", "cold-method-scoring"), 1);
    k.point(score, slide, 1);
    k.formula(score, slide);
    tradeoffs(frame.body, slide);
  }

  function nearestWarm(content, slide) {
    var frame = k.frame(content, slide);
    frame.host.classList.add("cold-method");
    var search = k.stage(k.el(frame.body, "section", "cold-method-search"), 0);
    k.point(search, slide, 0);
    k.formula(search, slide);
    var reuse = k.stage(k.el(frame.body, "section"), 1);
    k.point(reuse, slide, 1);
    flow(reuse, slide, ["c_i", "n(i)", "E^{\\mathrm{ID}}[n(i)]", "h_t"]);
    tradeoffs(frame.body, slide);
  }

  parts["content-only-sasrec"] = contentOnly;
  parts["nearest-warm-sasrec"] = nearestWarm;
})(globalThis);
