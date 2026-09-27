(function (root) {
  "use strict";

  function mount(host, session, examples) {
    var ui = root.SASRecPlayground.movieUI;
    host.classList.add("pctm-playground");
    host.querySelector(".sasrec-history .sasrec-lane-heading").appendChild(
      ui.element("span", "pctm-history-order", "Oldest → newest"));
    var search = host.querySelector(".sasrec-search");
    var presets = ui.element("div", "pctm-example-controls");
    presets.setAttribute("role", "group");
    presets.setAttribute("aria-label", "Example histories");
    presets.appendChild(ui.element("span", "pctm-examples-label", "Example histories"));
    examples.forEach(function (example) {
      var button = ui.element("button", "pctm-example-button", example.label);
      button.type = "button";
      button.addEventListener("click", function () {
        session.setHistory(example.ids, "original");
        session.run();
      });
      presets.appendChild(button);
    });
    presets.appendChild(ui.element("p", "pctm-example-caption",
      "Illustrative histories; recommendations come from the fitted model."));
    search.querySelector('[data-control="search"]').insertAdjacentElement("afterend", presets);
    var footer = host.querySelector(".sasrec-playground-footer");
    var provenance = ui.element("a", "pctm-model-source", "PCTM · fitted on the running example’s training split");
    provenance.href = "https://github.com/spotify-research/sequential-capacity-probes";
    provenance.target = "_blank";
    provenance.rel = "noopener noreferrer";
    footer.appendChild(provenance);
    var modelHeading = host.closest(".slide").querySelector(".slide-header-folio");

    session.subscribe(function (state) {
      var manifest = root.GSASRecModels[state.modelId];
      var isPCTM = manifest.architecture === "pctm";
      modelHeading.textContent = (isPCTM ? "PCTM" : "SASRec") + " · MovieLens-1M";
      provenance.textContent = isPCTM
        ? "PCTM · fitted on the running example’s training split"
        : "SASRec · same gBCE checkpoint as the earlier playground";
      provenance.href = manifest.source.repository;
      var ids = state.history.map(function (id) {
        return root.GSASRecBrowser.idMapping.itemPair(id, manifest).original;
      });
      presets.querySelectorAll("button").forEach(function (button, index) {
        button.setAttribute("aria-pressed", String(
          JSON.stringify(examples[index].ids) === JSON.stringify(ids)));
      });
      if (!isPCTM || !state.result) return;
      var weights = state.result.historyWeights;
      var cards = host.querySelectorAll(".sasrec-history-card");
      var hidden = state.history.length - cards.length;
      cards.forEach(function (card, index) {
        var weight = weights[hidden + index];
        var label = ui.element("span", "pctm-evidence-weight",
          "Weight " + (100 * weight).toFixed(1) + "%");
        label.title = "Fixed recency weight in PCTM’s log-probability pooling; not attention.";
        card.appendChild(label);
      });
    });
  }

  root.PCTMPlayground = { mount: mount };
})(globalThis);
