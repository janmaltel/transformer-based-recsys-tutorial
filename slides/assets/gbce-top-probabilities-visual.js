(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams["gbce-top-probabilities"] = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), data = root.GSASRecFigureOneTrace;
    svg.setAttribute("viewBox", "0 0 1100 340");
    var left = 110, right = 990, top = 50, bottom = 265;
    function x(rank) { return left + Math.log(rank) / Math.log(3416) * (right-left); }
    function y(p, max) { return bottom - p / max * (bottom-top); }
    function path(points, max) {
      return points.map(function (p, i) {
        return (i ? "L" : "M") + x(p[0]).toFixed(3) + " " + y(p[1], max).toFixed(3);
      }).join(" ");
    }
    k.text(svg, 320, 25, "SASRec · BCE · left axis (0–1)", "gbce-sasrec-label");
    var corrected = k.group(svg, 1);
    k.text(corrected, 780, 25, "gSASRec · gBCE · right axis (0–0.03)", "gbce-corrected-label");
    var focus = k.group(svg, 2);
    k.node("rect", {x:left, y:top, width:x(125)-left, height:bottom-top, "class":"overconfidence-shade"}, focus);
    k.node("line", {x1:x(125), x2:x(125), y1:top, y2:bottom, "class":"overconfidence-boundary"}, focus);
    k.text(focus, (left+x(125))/2, 230, "Top ranks", "overconfidence-label");
    [0, .25, .5, .75, 1].forEach(function (p) {
      k.node("line", {x1:left, x2:right, y1:y(p,1), y2:y(p,1), "class":"sc-evidence-grid"}, svg);
      var label = k.text(svg, left-12, y(p,1)+5, p.toFixed(2), "gbce-sasrec-label");
      label.setAttribute("text-anchor", "end");
    });
    [0, .01, .02, .03].forEach(function (p) {
      k.node("line", {x1:right, x2:right+7, y1:y(p,.03), y2:y(p,.03), "class":"gbce-right-axis"}, corrected);
      var label = k.text(corrected, right+12, y(p,.03)+5, p.toFixed(3), "gbce-corrected-label");
      label.setAttribute("text-anchor", "start");
    });
    [1, 5, 25, 125, 625, 3125].forEach(function (rank) {
      k.node("line", {x1:x(rank), x2:x(rank), y1:top, y2:bottom, "class":"sc-evidence-grid"}, svg);
      k.text(svg, x(rank), 286, rank, "sc-evidence-axis");
    });
    k.node("line", {x1:left, x2:left, y1:top, y2:bottom, "class":"gbce-left-axis"}, svg);
    k.node("line", {x1:right, x2:right, y1:top, y2:bottom, "class":"gbce-right-axis"}, corrected);
    svg.appendChild(focus); // Shading and labels sit above every grid line.
    k.node("path", {d:path(data.sasrec,1), "class":"gbce-probability-curve gbce-sasrec"}, svg);
    k.node("path", {d:path(data.gsasrec,.03), "class":"gbce-probability-curve gbce-corrected"}, corrected);
    // Keep the revealed curve above the shading and grid without changing builds.
    svg.appendChild(corrected);
    k.text(svg, 550, 316, "Item rank (log scale)", "sc-diagram-text");
    var outside = k.node("g", {"class":"gbce-variation-outside"}, focus);
    k.text(outside, 830, 87, "Most variance", "gbce-variation-label gbce-sasrec-label");
    k.text(outside, 830, 109, "outside top ranks", "gbce-variation-label gbce-sasrec-label");
    var sample = data.sasrec.reduce(function (best, p) {
      return Math.abs(p[0]-280) < Math.abs(best[0]-280) ? p : best;
    }, data.sasrec[0]);
    k.arrow(outside, 800, 119, x(sample[0]), y(sample[1],1), "gbce-variation-arrow gbce-left-axis");
    var inside = k.node("g", {"class":"gbce-variation-inside"}, focus);
    k.text(inside, 365, 86, "Most variance", "gbce-variation-label gbce-corrected-label");
    k.text(inside, 365, 108, "inside top ranks", "gbce-variation-label gbce-corrected-label");
    var leading = data.gsasrec.filter(function (p) { return p[0] === 12; })[0];
    k.arrow(inside, 365, 118, x(leading[0]), y(leading[1],.03), "gbce-variation-arrow gbce-right-axis");
    // Put both annotations above the grid, shading and curves.
    svg.appendChild(outside); outside.setAttribute("data-build-step", 2);
    svg.appendChild(inside); inside.setAttribute("data-build-step", 2);
    var lhs = k.text(svg, 32, 160, "SASRec probability", "gbce-sasrec-label");
    lhs.setAttribute("transform", "rotate(-90 32 160)");
    var rhs = k.text(corrected, 1072, 160, "gSASRec probability", "gbce-corrected-label");
    rhs.setAttribute("transform", "rotate(90 1072 160)");
  };
})(window);
