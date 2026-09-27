(function (root) {
  "use strict";

  root.ScalingDiagrams["multiple-interests"] = function (host, slide) {
    var p = root.PCTMDiagramKit(host, slide);
    p.panel.classList.add("interest-panel");
    if (!root.MultipleInterestPlot) {
      p.el(p.panel, "p", "interest-caption", "The optional interactive figure is unavailable in this copy.");
      return;
    }
    var lanes = p.el(p.panel, "div", "interest-lanes");
    var left = p.stage(p.el(lanes, "section", "interest-lane"), 0);
    p.copy(left, "h3", "", "sasrecHeading");
    var legend = p.el(left, "div", "interest-legend");
    ["family", "scifi", "other"].forEach(function (group) {
      p.copy(legend, "span", "interest-key interest-" + group, group + "Label");
    });
    root.MultipleInterestPlot.mount(left, p);

    var right = p.stage(p.el(lanes, "section", "interest-lane"), 1);
    p.copy(right, "h3", "", "pctmHeading");
    p.copy(right, "p", "interest-caption", "pctmCaption");
    if (!root.MultipleInterestSpaceData) {
      p.el(right, "p", "interest-caption", "The optional PCTM evidence is unavailable in this copy.");
      return;
    }
    transitionLinks(right, p);
    p.copy(right, "p", "interest-combination", "pctmCombination");
    p.copy(right, "p", "interest-observation", "pctmObservation");
  };

  function transitionLinks(host, p) {
    var data = root.MultipleInterestSpaceData;
    var svg = p.canvas(host, 500, 285);
    svg.classList.add("interest-links");
    var lookup = {};
    data.movies.forEach(function (movie) { lookup[movie.id] = movie; });
    var sourcesY = [86, 217];
    data.pctm.candidates.forEach(function (candidate, index) {
      var targetY = 36 + index * 52;
      candidate.contributions.forEach(function (value, source) {
        var maximum = Math.max.apply(null, data.pctm.candidates.map(function (c) { return c.contributions[source]; }));
        var line = p.k.node("path", {
          d: "M88 " + sourcesY[source] + " C180 " + sourcesY[source] + " 204 " + targetY + " 280 " + targetY,
          "class": "interest-link interest-link-" + source,
          "stroke-width": 1 + 2 * value / maximum
        }, svg);
        p.k.node("title", {}, line, "Weighted log evidence: " + value.toFixed(3));
      });
    });
    data.pctm.sources.forEach(function (id, index) {
      var y = sourcesY[index];
      var title = index ? "The Matrix" : "Toy Story 2";
      poster(svg, id, 23, y - 47, 51, 77, title, p);
      p.text(svg, 49, y - 58, title, "interest-source-title");
      p.text(svg, 49, y + 48, "Weight " + (data.pctm.weights[index] * 100).toFixed(1) + "%", "interest-source-weight");
    });
    data.pctm.candidates.forEach(function (candidate, index) {
      var y = 36 + index * 52;
      var movie = lookup[candidate.id];
      p.k.node("circle", { cx: 281, cy: y, r: 5, "class": "interest-dot interest-" + movie.group }, svg);
      poster(svg, candidate.id, 296, y - 22, 29, 44, movie.title, p);
      p.k.node("text", { x: 340, y: y + 4, "class": "interest-target-title" }, svg,
        "#" + (index + 1) + "  " + shortTitle(movie.title));
    });
  }

  function shortTitle(title) {
    return title.replace("Twelve Monkeys (a.k.a. 12 Monkeys)", "Twelve Monkeys")
      .replace("Terminator 2: Judgment Day", "Terminator 2")
      .replace("Fugitive, The", "The Fugitive");
  }

  function poster(svg, id, x, y, width, height, label, p) {
    p.k.node("rect", { x: x, y: y, width: width, height: height, "class": "interest-poster-fallback" }, svg);
    var url = root.GSASRecPosterAssets && root.GSASRecPosterAssets.urlForOriginalId(id);
    if (!url) return;
    var image = p.k.node("image", { x: x, y: y, width: width, height: height, href: url, "aria-label": label,
      preserveAspectRatio: "xMidYMid slice" }, svg);
    image.addEventListener("error", function () { image.style.display = "none"; });
  }
})(window);
