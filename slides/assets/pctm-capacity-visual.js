(function (root) {
  "use strict";
  root.ScalingDiagrams["pctm-capacity"] = function (host, slide) {
    var p = root.PCTMDiagramKit(host, slide);
    p.copy(p.panel, "p", "pctm-history-label", "historyLabel", 0);
    var lanes = p.el(p.panel, "div", "pctm-capacity-lanes");
    p.data.levels.forEach(function (_, i) {
      var lane = p.stage(p.el(lanes, "div", "pctm-capacity-lane"), i), base = "levels/" + i + "/";
      p.copy(lane, "h3", "", base + "title"); p.copy(lane, "p", "pctm-model-label", base + "models");
      var svg = p.canvas(lane, 300, 260), xs = [25, 123, 221];
      xs.forEach(function (x, j) { p.box(svg, x, 8, 54, 34, "h" + ["₁", "₂", "₃"][j], i === 0 && j < 2 ? "pctm-box-unused" : "pctm-box"); });
      if (i === 0) {
        p.text(svg, 102, 69, "Unused for scoring", "pctm-svg-muted");
        p.arrow(svg, 248, 42, 248, 91);
        p.box(svg, 25, 91, 250, 52, ""); p.svgCopy(svg, 150, 122, base + "stage");
        p.arrow(svg, 150, 143, 150, 217);
      } else if (i === 1) {
        xs.forEach(function (x, j) {
          p.arrow(svg, x + 27, 42, x + 27, 77);
          p.box(svg, x - 11, 77, 76, 37, "s" + ["₁", "₂", "₃"][j] + "(a)");
          p.text(svg, x + 27, 140, "× w" + ["₁", "₂", "₃"][j]);
          p.arrow(svg, x + 27, 145, x + 27, 166);
        });
        p.box(svg, 12, 166, 276, 34, "");
        p.svgCopy(svg, 150, 187, base + "stage", "pctm-svg-muted");
        p.arrow(svg, 150, 200, 150, 217);
      } else {
        xs.forEach(function (x) { p.arrow(svg, x + 27, 42, x + 27, 83); });
        p.box(svg, 12, 83, 276, 65, "", "pctm-box-context"); p.svgCopy(svg, 150, 108, base + "stage");
        p.text(svg, 150, 133, "Contextual history representations", "pctm-svg-muted");
        p.arrow(svg, 248, 148, 248, 173); p.box(svg, 221, 173, 54, 29, "z₃");
        p.arrow(svg, 248, 202, 248, 217);
      }
      p.box(svg, 25, 217, 250, 34, "");
      p.svgCopy(svg, 150, 239, base + "score");
      p.copy(lane, "p", "pctm-capacity-explanation", base + "explanation");
    });
  };
})(window);
