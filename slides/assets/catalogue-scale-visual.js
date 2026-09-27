(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  function copy(parent, x, y, value, slide, pointer, cls) {
    var node = k.text(parent, x, y, value, cls);
    if (root.PresentationEditorRefs) root.PresentationEditorRefs.annotate(node, slide, pointer);
  }
  function grid(parent, center, rows, columns, size) {
    var pitch = size + 3, left = center - columns * pitch / 2;
    for (var r = 0; r < rows; r++) for (var c = 0; c < columns; c++) {
      var positive = r === Math.floor(rows / 2) && c === Math.floor(columns / 2);
      k.box(parent, left + c * pitch, 76 + r * pitch, size, size, "", positive ? "sc-positive" : "sc-negative");
    }
  }
  function polygon(parent, points, cls) {
    return k.node("polygon", { points: points.map(function (p) { return p.join(","); }).join(" "), "class": cls }, parent);
  }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function line(parent, a, b) {
    k.node("path", { d: "M" + a.join(" ") + " L" + b.join(" "), "class": "catalogue-voxel-line" }, parent);
  }
  function faceGrid(parent, a, b, c, d, divisions) {
    for (var i = 1; i < divisions; i++) {
      var t = i / divisions;
      line(parent, lerp(a, b, t), lerp(d, c, t));
      line(parent, lerp(a, d, t), lerp(b, c, t));
    }
  }
  function volume(parent, svg) {
    var defs = k.node("defs", {}, svg);
    var pattern = k.node("pattern", { id: "catalogue-volume-voxels", width: 3, height: 3, patternUnits: "userSpaceOnUse" }, defs);
    k.node("rect", { width: 3, height: 3, fill: "#f0d9be" }, pattern);
    k.node("path", { d: "M0 3 V0 H3", "class": "catalogue-voxel-line" }, pattern);
    var a = [675, 139], b = [895, 139], c = [895, 259], d = [675, 259];
    var backA = [792, 77], backB = [1012, 77], backC = [1012, 197];
    polygon(parent, [a, backA, backB, b], "catalogue-volume-top");
    faceGrid(parent, a, backA, backB, b, 35);
    polygon(parent, [b, backB, backC, c], "catalogue-volume-side");
    faceGrid(parent, b, backB, backC, c, 35);
    var front = polygon(parent, [a, b, c, d], "catalogue-volume-front");
    front.setAttribute("fill", "url(#catalogue-volume-voxels)");
    // One deliberately tiny positive; the volume is an illustration, not a literal item-per-voxel plot.
    k.node("rect", { x: 778, y: 199, width: 1.4, height: 1.4, fill: "#087f73", "class": "catalogue-volume-positive" }, parent);
  }
  root.ScalingDiagrams.catalog = function (host, slide) {
    var data = slide.scaling, svg = k.canvas(host, data.diagramLabel);
    svg.setAttribute("viewBox", "0 0 1100 335");
    data.catalogues.forEach(function (catalogue, index) {
      var g = k.group(svg, catalogue.step), center = index ? 825 : 265;
      copy(g, center, 24, catalogue.label, slide, "/scaling/catalogues/" + index + "/label", "sc-catalogue-title");
      copy(g, center, 50, catalogue.example, slide, "/scaling/catalogues/" + index + "/example");
      var flat = k.group(g, catalogue.step);
      if (index) flat.classList.add("catalogue-flat");
      grid(flat, center, index ? 12 : 6, index ? 28 : 8, index ? 9 : 17);
      copy(flat, center, 289, catalogue.countLabel, slide, "/scaling/catalogues/" + index + "/countLabel");
      if (!index) k.text(flat, center, 321, "1 positive among thousands of alternatives", "sc-diagram-emphasis");
      if (index) {
        var reality = k.group(g, 2); reality.classList.add("catalogue-volume");
        volume(reality, svg);
        copy(reality, center, 289, catalogue.realityLabel, slide, "/scaling/catalogues/1/realityLabel");
        copy(reality, center, 321, catalogue.realityRatioLabel, slide, "/scaling/catalogues/1/realityRatioLabel", "sc-diagram-emphasis");
      }
    });
    k.node("line", { x1: 550, y1: 10, x2: 550, y2: 326, "class": "sc-catalogue-divider" }, svg);
  };
})(window);
