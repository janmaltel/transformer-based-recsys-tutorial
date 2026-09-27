(function (root) {
  "use strict";
  function node(parent, tag, className, text) {
    var element = document.createElement(tag);
    element.className = className || "";
    if (text) element.textContent = text;
    parent.appendChild(element);
    return element;
  }
  function stage(parent, tag, className, step, text) {
    var element = node(parent, tag, "sasrec-stage " + className, text);
    element.dataset.buildStep = step;
    return element;
  }
  function tex(target, value) { root.katex.render(value, target, { throwOnError: false, trust: false }); }
  function render(content) {
    var space = root.SASRecObjectiveSpace, mode = "bce", position = space.initial.slice(), plot;
    var vectors = space.items.map(function (item) { return item.vector.slice(); });
    var lab = node(content, "div", "objective-loss-lab");
    var toolbar = node(lab, "div", "objective-toolbar");
    node(toolbar, "span", "objective-prefix", "Babe → Jumanji → Toy Story");
    var controls = node(toolbar, "div", "objective-controls");
    var switcher = node(controls, "div", "objective-mode-switch");
    switcher.setAttribute("role", "group"); switcher.setAttribute("aria-label", "Loss function");
    var buttons = ["bce", "softmax"].map(function (value) {
      var button = node(switcher, "button", "objective-mode", value === "bce" ? "BCE" : "Softmax");
      button.type = "button"; button.dataset.mode = value;
      button.addEventListener("click", function () { mode = value; update(position); });
      return button;
    });
    var toggle = node(controls, "label", "objective-gradient-toggle");
    var checkbox = node(toggle, "input"); checkbox.type = "checkbox"; checkbox.checked = false;
    node(toggle, "span", "", "Gradient");
    checkbox.addEventListener("change", function () { update(position); });
    var heatmapToggle = node(controls, "label", "objective-gradient-toggle objective-heatmap-toggle");
    var heatmapCheckbox = node(heatmapToggle, "input");
    heatmapCheckbox.type = "checkbox"; heatmapCheckbox.checked = false;
    node(heatmapToggle, "span", "", "Loss heatmap");
    heatmapCheckbox.addEventListener("change", function () { update(position); });
    var reset = node(controls, "button", "objective-reset", "Reset"); reset.type = "button";
    reset.addEventListener("click", function () { plot.reset(); });
    var body = node(lab, "div", "objective-space-body");
    var plotSide = node(body, "div", "objective-plot-side");
    var plotHost = node(plotSide, "div", "objective-plot-host");
    var caption = node(plotSide, "div", "objective-plot-caption");
    var coordinates = node(caption, "output", "objective-coordinates");
    var legend = stage(caption, "span", "objective-gradient-legend", 2, "Arrows: −∇L · hₜ and item embeddings");
    var heatmapLegend = stage(plotSide, "div", "objective-heatmap-legend", 2);
    heatmapLegend.hidden = true;
    var details = node(body, "div", "objective-space-details");
    var scope = node(details, "p", "objective-scope");
    var table = node(details, "table", "objective-score-table");
    table.setAttribute("aria-label", "Item scores, probabilities and loss derivatives");
    var head = node(node(table, "thead"), "tr");
    ["Item", "Score", "", "∂L/∂s"].forEach(function (label) { node(head, "th", "", label); });
    var probabilityHeading = head.children[2];
    var rows = node(table, "tbody"), outputs = [];
    space.items.forEach(function (item) {
      var row = stage(rows, "tr", "objective-score-row " + item.sign, item.step);
      node(row, "th", "", item.title);
      outputs.push([node(node(row, "td"), "output"), node(node(row, "td"), "output"),
        node(stage(row, "td", "objective-derivative", 2), "output")]);
    });
    var readout = stage(details, "div", "objective-loss-readout", 2);
    node(readout, "span", "objective-readout-label", "Loss");
    var total = node(readout, "output", "objective-total"); total.setAttribute("aria-live", "polite");
    var formula = stage(details, "div", "objective-loss-formula", 2);
    var gradient = stage(details, "div", "objective-gradient-readout", 2);
    var gradientMath = node(gradient, "span", "objective-gradient-value");
    node(gradient, "span", "objective-gradient-hint", "∇ₑⱼL = (∂L/∂sⱼ)hₜ");
    node(lab, "div", "objective-loss-footnote", "Toy 2D vectors · scores are dot products, not distances · drag points or posters · arrows show local descent");
    function update(next, nextVectors) {
      position = next.slice();
      if (nextVectors) vectors = nextVectors.map(function (vector) { return vector.slice(); });
      var scores = space.scores(position, vectors);
      var result = root.SASRecObjectiveMath.evaluate(scores, vectors, mode, position);
      buttons.forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.mode === mode)); });
      lab.dataset.mode = mode;
      scope.textContent = mode === "bce" ? "BCE · independent sigmoid scores" : "Softmax · normalized over these 3 items only";
      probabilityHeading.textContent = mode === "bce" ? "σ(s)" : "p(item)";
      outputs.forEach(function (cells, index) {
        cells[0].textContent = scores[index].toFixed(2);
        cells[1].textContent = result.probabilities[index].toFixed(3);
        cells[2].textContent = result.derivatives[index].toFixed(3);
      });
      coordinates.textContent = "hₜ = (" + position.map(function (value) { return value.toFixed(2); }).join(", ") + ")";
      total.textContent = result.total.toFixed(3); total.setAttribute("aria-label", "Total loss: " + result.total.toFixed(3));
      tex(formula, mode === "bce" ? "\\mathcal L=-\\log\\sigma(s^+)-\\sum_j\\log\\sigma(-s_j)" :
        "\\mathcal L=-\\log\\frac{e^{s^+}}{\\sum_{j\\in C}e^{s_j}},\\quad |C|=3");
      tex(gradientMath, "\\nabla_h\\mathcal L=(" + result.gradient.map(function (value) { return value.toFixed(3); }).join(",") + ")");
      gradient.hidden = !checkbox.checked; legend.hidden = !checkbox.checked;
      if (plot) {
        plot.setGradient(result.gradient, checkbox.checked, result.itemGradients);
        plot.setHeatmap(mode, heatmapCheckbox.checked);
      }
    }
    plot = root.SASRecObjectivePlot.create(plotHost, update, function () {}, heatmapLegend);
    update(position);
  }
  (root.SASRecVisualParts = root.SASRecVisualParts || {})["bce-loss"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
