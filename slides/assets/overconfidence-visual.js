(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams.overconfidence = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), points = root.SASRecOverconfidenceTrace.points;
    svg.setAttribute("viewBox", "0 0 700 400");
    var left = 85, bottom = 315, width = 565, height = 260;
    function x(rank) { return left + Math.log(rank) / Math.log(3416) * width; }
    function y(score) { return bottom - score * height; }
    function path(values) { return values.map(function (p, i) { return (i ? "L" : "M") + x(p[0]).toFixed(2) + " " + y(p[1]).toFixed(2); }).join(" "); }
    k.text(svg, 365, 25, "SASRec · MovieLens-1M user 963", "sc-diagram-text");
    var shade = k.group(svg, 1);
    k.node("rect", { x: left, y: 55, width: x(125)-left, height: bottom-55, "class": "overconfidence-shade" }, shade);
    for (var tick = 0; tick <= 5; tick++) {
      var py = y(tick / 5);
      k.node("line", { x1: left, y1: py, x2: left + width, y2: py, "class": "sc-evidence-grid" }, svg);
      var label = k.text(svg, left - 15, py + 5, (tick / 5).toFixed(1), "sc-evidence-axis"); label.setAttribute("text-anchor", "end");
    }
    [1, 5, 25, 125, 625, 3125].forEach(function (rank) {
      k.node("line", { x1: x(rank), y1: 55, x2: x(rank), y2: bottom, "class": "sc-evidence-grid" }, svg);
      k.text(svg, x(rank), 338, rank, "sc-evidence-axis");
    });
    svg.appendChild(shade); // Shade above the grid; keep the curve above the shade.
    k.node("path", { d: path(points), "class": "overconfidence-curve" }, svg);
    k.node("line", { x1: x(125), y1: 55, x2: x(125), y2: bottom, "class": "overconfidence-boundary", "data-build-step": 1 }, svg);
    var annotation = k.group(svg, 1); k.text(annotation, x(Math.sqrt(125)), 205, "Top ranks", "overconfidence-label");
    var difference = k.group(svg, 2);
    k.text(difference, 570, 120, "Most variance", "overconfidence-label");
    k.text(difference, 570, 142, "outside top ranks", "overconfidence-label");
    k.arrow(difference, 540, 150, x(280), y(points[279][1]));
    var axis = k.text(svg, 25, 190, "Predicted sigmoid score", "sc-evidence-axis"); axis.setAttribute("transform", "rotate(-90 25 190)");
    k.text(svg, 365, 370, "Item rank (log scale)", "sc-diagram-text");
  };
})(window);
