(function (root) {
  "use strict";
  var k = root.ScalingSlideKit, diagrams = root.ScalingDiagrams;
  diagrams.memory = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), a = k.group(svg, 0);
    k.text(a, 155, 36, "Dense item table"); k.grid(a, 70, 55, 10, 8, -1);
    k.text(a, 155, 305, "N × d float values");
    var b = k.group(svg, 1); k.arrow(b, 270, 160, 340, 160);
    k.text(b, 510, 36, "Shared codebooks + codes");
    k.text(b, 510, 195, "First 4 of 8 codebooks shown");
    for (var index = 0; index < 4; index++) k.grid(b, 370 + index*77, 65, 5, 3, index);
    k.box(b, 390, 212, 250, 40, "8 bytes per item", "sc-positive");
    k.text(b, 515, 305, "Kd float values + Nm byte codes");
  };
  diagrams.codes = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), a = k.group(svg, 0);
    k.box(a, 55, 55, 150, 60, "Item A"); k.arrow(a, 220, 85, 320, 85);
    [12, 7, 203].forEach(function (value, n) { k.box(a, 350+n*100, 55, 85, 60, String(value), n ? "sc-box" : "sc-positive"); });
    var b = k.group(svg, 1); k.box(b, 55, 165, 150, 60, "Item B"); k.arrow(b, 220, 195, 320, 195);
    [12, 91, 4].forEach(function (value, n) { k.box(b, 350+n*100, 165, 85, 60, String(value), n ? "sc-box" : "sc-positive"); });
    k.text(b, 480, 285, "Shared part ≠ identical item", "sc-diagram-emphasis");
  };
  diagrams.joint = function (host, slide) {
    var svg=k.canvas(host,slide.scaling.diagramLabel),g=k.group(svg,0);
    svg.setAttribute("viewBox","0 0 700 360");
    k.box(g,180,35,240,55,"Dense item table");
    k.arrow(g,300,96,300,139);
    k.text(g,380,120,"replace", "sc-diagram-text");
    k.box(g,20,150,110,55,"Item IDs");k.arrow(g,135,177,174,177);
    k.box(g,180,145,240,65,"RecJPQ","sc-positive");
    k.text(g,300,235,"Codes + shared sub-vectors", "sc-diagram-emphasis");
    k.arrow(g,425,177,469,177);
    k.box(g,475,150,200,55,"Embedding vectors");
    k.text(g,575,130,"Same vector size");
    k.arrow(g,575,211,575,260);
    k.box(g,475,265,200,55,"Existing recommender");
    k.text(g,575,347,"SASRec / BERT4Rec / …", "sc-diagram-emphasis");
  };
})(window);
