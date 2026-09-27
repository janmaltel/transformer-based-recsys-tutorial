(function (root) {
  "use strict";
  var ns = "http://www.w3.org/2000/svg";
  function node(tag, attrs, parent, text) {
    var el = document.createElementNS(ns, tag);
    Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    if (text !== undefined) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  }
  function canvas(host, label) {
    return node("svg", { viewBox: "0 0 700 330", role: "img", "aria-label": label }, host);
  }
  function group(svg, step) { return node("g", { "data-build-step": step }, svg); }
  function text(svg, x, y, value, cls) {
    return node("text", { x: x, y: y, "class": cls || "sc-diagram-text", "text-anchor": "middle" }, svg, value);
  }
  function box(svg, x, y, width, height, label, cls) {
    node("rect", { x: x, y: y, width: width, height: height, rx: 3, "class": cls || "sc-box" }, svg);
    if (label) text(svg, x + width / 2, y + height / 2 + 6, label);
  }
  function arrow(svg, x1, y1, x2, y2, cls) {
    node("path", { d: "M" + x1 + " " + y1 + " L" + x2 + " " + y2, "class": cls || "sc-arrow" }, svg);
    var angle = Math.atan2(y2-y1, x2-x1), size = 9;
    node("path", { d: "M" + (x2-size*Math.cos(angle-0.45)) + " " + (y2-size*Math.sin(angle-0.45)) + " L" + x2 + " " + y2 + " L" + (x2-size*Math.cos(angle+0.45)) + " " + (y2-size*Math.sin(angle+0.45)), "class": cls || "sc-arrow" }, svg);
  }
  function grid(svg, x, y, rows, columns, selected) {
    for (var r = 0; r < rows; r++) for (var c = 0; c < columns; c++) {
      box(svg, x + c * 21, y + r * 22, 17, 18, "", r === selected ? "sc-positive" : "sc-box");
    }
  }
  root.ScalingSlideKit = { node: node, canvas: canvas, group: group, text: text, box: box, arrow: arrow, grid: grid };
  root.ScalingDiagrams = root.ScalingDiagrams || {};
})(window);
