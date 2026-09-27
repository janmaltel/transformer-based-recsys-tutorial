(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams["loss-evidence"] = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel);
    svg.setAttribute("viewBox", "0 0 1100 340");
    var top = 65, bottom = 255, left = 140, right = 1040;
    slide.scaling.datasets[0].results.forEach(function (result, index) {
      var source = root.PresentationCitations[result.citationKey], x = index ? 620 : 210;
      k.node("rect", { x: x, y: 13, width: 18, height: 18, rx: 2, "class": index ? "sc-evidence-bar-secondary" : "sc-evidence-bar" }, svg);
      var link = k.node("a", { href: source.url, target: "_blank", rel: "noopener noreferrer", "class": "sc-evidence-study-link" }, svg);
      var label = k.text(link, x + 28, 29, source.label.replace(", " + source.venue, ""), "sc-evidence-study");
      label.setAttribute("text-anchor", "start");
    });
    for (var tick = 0; tick <= 40; tick += 10) {
      var y = bottom - tick / 40 * (bottom - top);
      k.node("line", { x1: left, y1: y, x2: right, y2: y, "class": "sc-evidence-grid" }, svg);
      var value = k.text(svg, left - 15, y + 5, tick + "%", "sc-evidence-axis");
      value.setAttribute("text-anchor", "end");
    }
    slide.scaling.datasets.forEach(function (dataset, index) {
      var group = k.group(svg, dataset.step), center = index ? 815 : 365;
      dataset.results.forEach(function (result, paper) {
        var height = result.delta / 40 * (bottom - top), x = center + (paper ? 12 : -112);
        var bar = k.node("rect", { x: x, y: bottom - height, width: 100, height: height, rx: 2, "class": paper ? "sc-evidence-bar-secondary" : "sc-evidence-bar" }, group);
        k.node("title", {}, bar, root.PresentationCitations[result.citationKey].label + ": +" + result.delta.toFixed(1) + "% NDCG@10");
        k.text(group, x + 50, bottom - height - 12, "+" + result.delta.toFixed(1) + "%", "sc-evidence-delta");
      });
      var heading = k.text(group, center, 287, dataset.label, "sc-catalogue-title");
      if (root.PresentationEditorRefs) root.PresentationEditorRefs.annotate(heading, slide, "/scaling/datasets/" + index + "/label");
    });
    k.text(svg, 590, 328, "Relative NDCG@10 gain: full softmax vs BCE with 1 negative", "sc-evidence-axis");
  };
})(window);
