(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  function el(parent, tag, cls, text) {
    var node = document.createElement(tag); node.className = cls || "";
    if (text !== undefined) node.textContent = text;
    if (parent) parent.appendChild(node); return node;
  }
  function button(parent, text, action) {
    var node = el(parent, "button", "gbce-lab-button", text); node.type = "button";
    node.addEventListener("click", action); return node;
  }
  function mount(host, slide) {
    var open = button(host, "Explore gBCE’s impact on gradients", function () { dialog.showModal(); });
    open.classList.add("gbce-lab-open"); open.setAttribute("aria-haspopup", "dialog");
    var dialog = el(host, "dialog", "gbce-gradient-lab");
    dialog.setAttribute("aria-labelledby", "gbce-gradient-lab-title");
    var scores = [-0.4, -2.2, -2.9], beta = 1, minimumBeta = 2 / 3415, outputs = [], sliders = [];
    var heading = el(dialog, "div", "gbce-lab-heading");
    var title = el(heading, "h3", "", "gBCE’s impact on gradients"); title.id = "gbce-gradient-lab-title";
    button(heading, "Back to the recipe", function () { dialog.close(); });
    el(dialog, "p", "gbce-lab-intro", "β weights the positive term in the slide’s loss. Up raises a score; down lowers it.");
    var modes = el(dialog, "div", "gbce-lab-modes"); modes.setAttribute("role", "group"); modes.setAttribute("aria-label", "Correction presets");
    var presets = [[1, "BCE · β = 1"], [0.25, "gBCE · β = 0.25"], [minimumBeta, "Full correction · β ≈ " + minimumBeta.toFixed(5)]].map(function (preset) {
      var node = button(modes, preset[1], function () { beta = preset[0]; update(); });
      return {node: node, value: preset[0]};
    });
    button(modes, "Reset example", function () { scores = [-0.4, -2.2, -2.9]; beta = 1; update(); });
    var control = el(dialog, "label", "gbce-lab-correction");
    el(control, "span", "", "Positive-term weight β");
    var betaInput = el(control, "input"); betaInput.type = "range";
    betaInput.min = String(minimumBeta); betaInput.max = "1"; betaInput.step = "any";
    betaInput.setAttribute("aria-label", "Positive-term weight β");
    var betaValue = el(control, "output");
    betaInput.addEventListener("input", function () { beta = Number(betaInput.value); update(); });
    var context = el(dialog, "p", "gbce-lab-context");
    el(dialog, "p", "gbce-lab-scale", "Y-axis rescales automatically; all three arrows share the same scale.");
    var svg = k.canvas(dialog, "Score descent directions for one positive and two sampled negatives on a shared automatic scale");
    svg.classList.add("gbce-lab-plot"); svg.setAttribute("viewBox", "0 0 900 260");
    var zero = 128, scale, positions = [240, 500, 760];
    var gridHost = k.node("g", {"class": "gbce-lab-axis"}, svg);
    var axis = k.text(svg, 25, 130, "Score update (−∂L/∂s)", "sc-evidence-axis"); axis.setAttribute("transform", "rotate(-90 25 130)");
    var arrowHost = k.node("g", {"class": "gbce-lab-arrows"}, svg);
    ["Positive", "Negative 1", "Negative 2"].forEach(function (label, i) {
      k.text(svg, positions[i], 248, label, i === 0 ? "gbce-lab-positive-text" : "gbce-lab-negative-text");
    });
    var cards = el(dialog, "div", "gbce-lab-score-controls");
    ["Positive score", "Negative 1 score", "Negative 2 score"].forEach(function (label, index) {
      var card = el(cards, "label", "gbce-lab-score"); el(card, "span", "", label);
      outputs.push(el(card, "output"));
      var input = el(card, "input"); input.type = "range"; input.min = "-5"; input.max = "3"; input.step = "0.1";
      input.setAttribute("aria-label", label); sliders.push(input);
      input.addEventListener("input", function () { scores[index] = Number(input.value); update(); });
    });
    var summary = el(dialog, "p", "gbce-lab-summary"); summary.setAttribute("aria-live", "polite");
    el(dialog, "p", "gbce-lab-footnote", "Arrows show −∂L/∂s, not a training trajectory. Values include the loss’s mean factor. These signals backpropagate through the encoder and item embeddings.");
    var source = root.PresentationCitations[slide.citationKeys[0]];
    var citation = el(dialog, "a", "gbce-lab-source", source.label);
    citation.href = source.url; citation.target = "_blank"; citation.rel = "noopener noreferrer";
    dialog.addEventListener("keydown", function (event) {
      event.stopPropagation();
      if (event.key === "Escape") { event.preventDefault(); dialog.close(); }
      if (event.key === "Tab") {
        var focusable = Array.from(dialog.querySelectorAll("button, input, a[href]"));
        var current = focusable.indexOf(document.activeElement);
        var next = (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        event.preventDefault(); focusable[next].focus();
      }
    });
    dialog.addEventListener("close", function () {
      if (host.closest(".slide").classList.contains("is-active")) open.focus();
    });
    root.addEventListener("presentation:slidechange", function (event) {
      if (dialog.open && event.detail.slideId !== slide.id) dialog.close();
    });
    function update() {
      var result = root.GBCEGradientMath.evaluate(scores, beta);
      betaInput.value = beta; betaValue.textContent = beta.toFixed(5);
      betaInput.setAttribute("aria-valuetext", "β = " + beta.toFixed(5));
      presets.forEach(function (preset) { preset.node.setAttribute("aria-pressed", String(Math.abs(preset.value-beta) < 0.00001)); });
      context.textContent = "2 sampled negatives from 3,415 other movies. Lower β reduces upward pressure on the positive; negative terms stay unchanged.";
      outputs.forEach(function (output, i) { output.textContent = scores[i].toFixed(1); sliders[i].value = scores[i]; });
      var largest = Math.max.apply(null, result.updates.map(Math.abs));
      var required = Math.max(0.000001, largest * 1.1);
      var decade = Math.pow(10, Math.floor(Math.log10(required)));
      var limit = [1, 2, 2.5, 5, 7.5, 10].find(function (factor) { return factor * decade >= required; }) * decade;
      scale = 96 / limit; svg.dataset.yLimit = limit;
      gridHost.replaceChildren();
      [-1, -0.5, 0, 0.5, 1].forEach(function (factor) {
        var tick = factor * limit, y = zero - tick * scale;
        k.node("line", {x1:100, x2:860, y1:y, y2:y,
          "class":factor === 0 ? "gbce-lab-zero" : "sc-evidence-grid"}, gridHost);
        var label = k.text(gridHost, 85, y+5, tick.toFixed(6).replace(/0+$/, "").replace(/\.$/, ""), "sc-evidence-axis");
        label.setAttribute("text-anchor", "end");
      });
      arrowHost.replaceChildren();
      result.updates.forEach(function (value, i) {
        var px = positions[i], tip = zero-value*scale, cls = i === 0 ? "gbce-lab-positive" : "gbce-lab-negative";
        // A tiny update remains a dot, rather than an artificially long arrow.
        if (Math.abs(value * scale) < 2) k.node("circle", {cx:px, cy:tip, r:2, "class":cls}, arrowHost);
        else {
          var sign = value > 0 ? -1 : 1, cap = Math.min(9, Math.abs(value*scale)*0.45);
          var d = "M"+(px-12)+" "+zero+" L"+(px+12)+" "+zero+" L"+(px+12)+" "+(tip-sign*cap)+
            " L"+(px+23)+" "+(tip-sign*cap)+" L"+px+" "+tip+" L"+(px-23)+" "+(tip-sign*cap)+" L"+(px-12)+" "+(tip-sign*cap)+" Z";
          k.node("path", {d:d, "class":cls}, arrowHost);
        }
        var numeric = (value >= 0 ? "+" : "") + value.toFixed(5);
        k.text(arrowHost, px+64, zero-8, numeric, i === 0 ? "gbce-lab-positive-text" : "gbce-lab-negative-text");
      });
      var positive = Math.abs(result.updates[0]), negatives = Math.abs(result.updates[1])+Math.abs(result.updates[2]);
      var strongPositive = positive > negatives*1.25, strongNegative = positive < negatives*0.75;
      summary.classList.toggle("gbce-lab-unbalanced", strongPositive || strongNegative);
      summary.classList.toggle("gbce-lab-balanced", !strongPositive && !strongNegative);
      summary.textContent = strongPositive ? "Too strong positive pull · too weak negative pull" :
        strongNegative ? "Too strong negative pull · too weak positive pull" : "Balanced";
    }
    update();
  }
  root.GBCEGradientLab = {mount: mount};
})(window);
