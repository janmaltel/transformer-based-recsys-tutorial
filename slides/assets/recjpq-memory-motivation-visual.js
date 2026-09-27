(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams["catalogue-embedding-memory"] = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel);
    svg.setAttribute("viewBox", "0 0 700 390");
    var architecture = k.group(svg, 0); architecture.classList.add("recjpq-memory-architecture");
    var table = k.group(svg, 1); table.classList.add("recjpq-memory-table");
    k.text(table, 162, 35, "Item embedding table", "sc-catalogue-title");
    for (var row = 0; row < 10; row++) {
      for (var col = 0; col < 8; col++) {
        k.box(table, 55 + col*26, 65 + row*24, 22, 20, "", row === 7 ? "sc-positive" : "sc-box");
      }
    }
    k.text(table, 162, 332, "12.8B parameters", "recjpq-memory-size");
    k.text(table, 162, 359, "d = 128 · one vector per item", "recjpq-memory-caption recjpq-memory-dimension");
    k.node("path", {d:"M44 65 H33 V301 H44", "class":"sc-arrow"}, table);
    var n = k.text(table, 15, 185, "100M items", "recjpq-memory-caption recjpq-memory-items");
    n.setAttribute("transform", "rotate(-90 15 185)");
    k.arrow(table, 270, 280, 336, 280);
    k.text(table, 305, 259, "lookup", "recjpq-memory-caption");
    ["i₁", "i₂", "i₃"].forEach(function (item, index) {
      var x = 365 + index*105;
      k.box(architecture, x, 330, 62, 30, item);
      for (var c = 0; c < 5; c++) k.box(architecture, x-9+c*17, 279, 14, 17, "", "sc-positive");
      k.arrow(architecture, x+31, 320, x+31, 303);
      k.arrow(architecture, x+31, 270, x+31, 235);
    });
    k.text(architecture, 506, 383, "History in sequence order", "recjpq-memory-caption");
    k.text(architecture, 653, 260, "+ positions", "recjpq-memory-caption");
    k.text(architecture, 507, 134, "Same SASRec transformer", "sc-catalogue-title");
    k.box(architecture, 352, 150, 310, 36, "Position-wise feed-forward");
    k.box(architecture, 352, 189, 310, 36, "Causal self-attention");
    k.node("path", {d:"M352 168 H337 V92 H438", "class":"sc-arrow"}, architecture);
    k.arrow(architecture, 430, 92, 440, 92);
    k.box(architecture, 448, 76, 52, 31, "h");
    k.arrow(architecture, 507, 92, 533, 92);
    k.box(architecture, 542, 73, 123, 38, "Item scores");
    k.node("path", {d:"M270 90 H302 V45 H603 V64", "class":"sc-arrow"}, table);
    k.arrow(table, 603, 54, 603, 66);
    k.text(table, 453, 29, "Candidate lookup", "recjpq-memory-caption");
    var emphasis = table;
    k.node("rect", {x:49,y:59,width:215,height:246,rx:4,"class":"recjpq-memory-focus"}, emphasis);
  };
})(window);
