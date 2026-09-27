(function (root) {
  "use strict";
  root.ScalingDiagrams["pctm-transitions"] = function (host, slide) {
    var p = root.PCTMDiagramKit(host, slide), lanes = p.el(p.panel, "div", "pctm-transition-lanes");
    var histories = p.stage(p.el(lanes, "div", "pctm-transition-lane"), 0);
    p.copy(histories, "h3", "", "stages/0");
    p.data.histories.forEach(function (_, i) { p.copy(histories, "div", "pctm-training-sequence", "histories/" + i); });
    p.copy(histories, "p", "pctm-source-label", "source");
    var counts = p.stage(p.el(lanes, "div", "pctm-transition-lane"), 1);
    p.copy(counts, "h3", "", "stages/1"); p.copy(counts, "p", "pctm-decay-label", "decay");
    var svg = p.canvas(counts, 300, 190);
    p.data.counts.forEach(function (count, i) {
      var y = 24 + i * 42;
      p.svgCopy(svg, 18, y + 14, "candidates/" + i);
      p.k.node("rect", { x: 42, y: y, width: 140, height: 21, "class": "pctm-bar-track" }, svg);
      p.k.node("rect", { x: 42, y: y, width: count / 4 * 140, height: 21, "class": "pctm-count-bar" }, svg);
      p.svgCopy(svg, 238, y + 16, "countCalculations/" + i, "pctm-count-calculation");
    });
    p.copy(counts, "p", "pctm-count-label", "countLabel");
    var smooth = p.stage(p.el(lanes, "div", "pctm-transition-lane"), 2);
    p.copy(smooth, "h3", "", "stages/2"); p.copy(smooth, "p", "pctm-prior-label", "priorLabel");
    var total = p.data.counts.reduce(function (sum, n) { return sum + n; }, 0) + p.data.priorPerItem * p.data.candidates.length;
    var probabilities = p.canvas(smooth, 300, 190);
    p.data.counts.forEach(function (count, i) {
      var y = 24 + i * 42, numerator = count + p.data.priorPerItem;
      p.svgCopy(probabilities, 18, y + 14, "candidates/" + i);
      p.k.node("rect", { x: 42, y: y, width: 180, height: 21, "class": "pctm-bar-track" }, probabilities);
      p.k.node("rect", { x: 42, y: y, width: count / total * 180, height: 21, "class": "pctm-count-bar" }, probabilities);
      p.k.node("rect", { x: 42 + count / total * 180, y: y, width: p.data.priorPerItem / total * 180, height: 21, "class": "pctm-prior-bar" }, probabilities);
      p.text(probabilities, 263, y + 16, numerator + "/" + total);
    });
    p.copy(smooth, "p", "pctm-probability-label", "probabilityLabel");
    p.copy(p.panel, "p", "pctm-takeaway", "takeaway", 2);
  };
  root.ScalingDiagrams["pctm-pooling"] = function (host, slide) {
    var p = root.PCTMDiagramKit(host, slide), history = root.CanonicalMoviePredictionExample.history;
    p.copy(p.panel, "p", "pctm-history-label", "historyLabel", 0);
    var experts = p.el(p.panel, "div", "pctm-experts");
    history.forEach(function (movie, i) {
      var expert = p.el(experts, "div", "pctm-expert"), item = p.stage(p.el(expert, "div", "pctm-history-item"), 0);
      var posterUrl = root.GSASRecPosterAssets && root.GSASRecPosterAssets.urlForOriginalId(movie.id);
      var art = p.el(item, "div", "pctm-poster");
      p.el(art, "span", "pctm-poster-fallback", movie.title);
      if (posterUrl) {
        var image = p.el(art, "img", ""); image.src = posterUrl; image.alt = movie.title + " poster";
        image.addEventListener("error", function () { image.hidden = true; });
      }
      p.el(item, "strong", "", movie.title);
      p.el(item, "span", "pctm-transition-expression", "P(next | " + movie.title + ")");
      var weight = p.stage(p.el(expert, "div", "pctm-history-weight"), 1);
      p.copy(weight, "span", "", "weights/" + i);
      var track = p.el(weight, "div", "pctm-weight-track"); p.el(track, "span", "pctm-weight-fill pctm-weight-" + i);
      p.el(weight, "span", "pctm-weight-expression", "× w" + ["₁", "₂", "₃"][i]);
    });
    p.copy(p.panel, "p", "pctm-independence", "independence", 0);
    var formula = p.copy(p.panel, "div", "pctm-pooling-formula", "scoreFormula", 2);
    formula.setAttribute("aria-label", "Candidate score is the recency-weighted sum of log transition probabilities plus a popularity term.");
    p.copy(p.panel, "p", "pctm-formula-label", "formulaLabel", 2);
    var recency = p.stage(p.el(p.panel, "div", "pctm-head-tail"), 2);
    p.copy(recency, "span", "pctm-recency-title", "recencyTitle");
    var split = p.el(recency, "div", "pctm-head-tail-split");
    p.copy(split, "div", "pctm-tail-mass", "olderLabel"); p.copy(split, "div", "pctm-head-mass", "recentLabel");
  };
})(window);
