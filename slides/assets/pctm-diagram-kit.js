(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  function kit(host, slide) {
    var data = slide.scaling;
    function el(parent, tag, cls, value) {
      var node = document.createElement(tag); node.className = cls || "";
      if (value !== undefined) node.textContent = value;
      parent.appendChild(node); return node;
    }
    var panel = el(host, "div", "pctm-panel");
    function value(path) { return path.split("/").reduce(function (v, key) { return v[key]; }, data); }
    function annotate(node, path) {
      if (root.PresentationEditorRefs) root.PresentationEditorRefs.annotate(node, slide, "/scaling/" + path);
      return node;
    }
    function stage(node, step) { node.dataset.buildStep = step; return node; }
    function copy(parent, tag, cls, path, step) {
      var node = annotate(el(parent, tag, cls, value(path)), path);
      if (step !== undefined) stage(node, step);
      return node;
    }
    function canvas(parent, width, height) {
      return k.node("svg", { viewBox: "0 0 " + width + " " + height, "aria-hidden": "true", "class": "pctm-svg" }, parent);
    }
    function text(parent, x, y, label, cls) { return k.text(parent, x, y, label, cls || "pctm-svg-text"); }
    function svgCopy(parent, x, y, path, cls) { return annotate(text(parent, x, y, value(path), cls), path); }
    function box(parent, x, y, width, height, label, cls) {
      k.node("rect", { x: x, y: y, width: width, height: height, "class": cls || "pctm-box" }, parent);
      if (label) return text(parent, x + width / 2, y + height / 2 + 5, label);
    }
    function arrow(parent, x1, y1, x2, y2, cls) { k.arrow(parent, x1, y1, x2, y2, cls || "pctm-arrow"); }
    panel.setAttribute("role", "group"); panel.setAttribute("aria-label", data.diagramLabel);
    return { panel: panel, data: data, el: el, copy: copy, stage: stage, canvas: canvas,
      text: text, svgCopy: svgCopy, box: box, arrow: arrow, k: k };
  }
  root.PCTMDiagramKit = kit;
})(window);
