(function (root) {
  "use strict";
  root.ScalingDiagrams["pctm-benchmarks"] = function (host, slide) {
    var p = root.PCTMDiagramKit(host, slide), svg = p.canvas(p.panel, 1100, 315);
    svg.removeAttribute("aria-hidden"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", p.data.diagramLabel);
    var classes = ["pctm-transformer-bar", "pctm-prior-bar"];
    p.data.series.forEach(function (_, i) {
      var x = 290 + i * 390;
      p.k.node("rect", { x: x, y: 2, width: 19, height: 14, "class": classes[i] }, svg);
      var label = p.svgCopy(svg, x + 28, 15, "series/" + i, "pctm-chart-legend"); label.setAttribute("text-anchor", "start");
    });
    var top = 46, bottom = 253, left = 62, right = 1078, max = .22;
    for (var tick = 0; tick <= .20001; tick += .05) {
      var y = bottom - tick / max * (bottom - top);
      p.k.node("line", { x1: left, x2: right, y1: y, y2: y, "class": "pctm-chart-grid" }, svg);
      p.text(svg, 30, y + 4, tick.toFixed(2), "pctm-chart-axis");
    }
    p.data.datasets.forEach(function (dataset, i) {
      var group = p.k.group(svg, dataset.step), center = 165 + i * 200;
      dataset.scores.forEach(function (score, model) {
        var x = center - 48 + model * 56, height = score / max * (bottom - top);
        var label = dataset.label + ": " + p.data.series[model] + " NDCG@10 = " + score.toFixed(4);
        var bar = p.k.node("rect", { x: x, y: bottom - height, width: 40, height: height, "class": classes[model], role: "img", "aria-label": label }, group);
        p.k.node("title", {}, bar, label);
        p.text(group, x + 20, bottom - height - 9, score.toFixed(4), "pctm-chart-value");
      });
      p.svgCopy(group, center, 286, "datasets/" + i + "/label", "pctm-chart-dataset");
    });
    var findings = p.stage(p.el(p.panel, "div", "pctm-findings"), 2);
    p.data.findings.forEach(function (_, i) {
      var row = p.el(findings, "div", "pctm-finding");
      p.copy(row, "strong", "", "findings/" + i + "/label"); p.copy(row, "span", "", "findings/" + i + "/body");
    });
    p.copy(p.panel, "p", "pctm-result-takeaway", "takeaway", 2);
  };
})(window);
