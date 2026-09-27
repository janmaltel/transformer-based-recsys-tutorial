(function (root) {
  "use strict";
  var ui = root.SASRecPlayground.movieUI;

  function servingFor(manifest) {
    return manifest.serving || { knownCount: manifest.config.numItems, coldCount: 0,
      coldNativeIds: [], demoColdItemIds: [] };
  }

  function mount(host, session, refreshSearch) {
    var manifest = root.GSASRecModels[session.getState().modelId];
    var serving = servingFor(manifest);
    var cold = new Set(), coldSearch = true, currentModel = null;
    host.classList.add("sasrec-denserec");
    var search = host.querySelector(".sasrec-search");
    var label = ui.element("label", "sasrec-cold-search");
    var checkbox = ui.element("input");
    checkbox.type = "checkbox"; checkbox.checked = true;
    label.append(checkbox, ui.element("span", "", "Search cold (❄️) movies only"));
    search.querySelector("input").insertAdjacentElement("afterend", label);
    search.querySelector('input[type="search"]').placeholder = "Movie title, year, or genre…";
    function onSearchScope() { coldSearch = checkbox.checked; refreshSearch(); }
    checkbox.addEventListener("change", onSearchScope);
    var textInputs = ui.element('div', 'sasrec-text-inputs');
    textInputs.setAttribute('role', 'group');
    textInputs.setAttribute('aria-label', 'Precomputed text inputs');
    search.appendChild(textInputs);

    function renderTextInputs() {
      textInputs.replaceChildren(ui.element('span', 'sasrec-text-inputs-label', 'Or add a text input'));
      Object.keys(manifest.textInputs || {}).forEach(function (id) {
        var button = ui.element('button', 'sasrec-text-input-button', manifest.textInputs[id].text);
        button.type = 'button'; button.dataset.addSas = id;
        button.setAttribute('aria-label', 'Add text input ' + manifest.textInputs[id].text);
        textInputs.appendChild(button);
      });
      textInputs.hidden = !Object.keys(manifest.textInputs || {}).length;
    }

    var heading = host.querySelector(".sasrec-recommendations .sasrec-lane-heading");
    heading.querySelector("span").remove();
    var candidates = ui.element("label", "sasrec-candidate-scope", "Candidates ");
    var select = ui.element("select");
    [["all", "All " + manifest.config.numItems.toLocaleString()],
      ["cold", serving.coldCount + " unseen"],
      ["known", serving.knownCount.toLocaleString() + " trained"]].forEach(function (pair) {
      var option = ui.element("option", "", pair[1]); option.value = pair[0]; select.appendChild(option);
    });
    candidates.appendChild(select); heading.appendChild(candidates);
    select.addEventListener("change", function () {
      session.setOptions({ candidateScope: select.value }); session.run();
    });
    var summary = ui.element("span", "sasrec-denserec-summary");
    host.querySelector('[data-field="model"]').insertAdjacentElement("afterend", summary);
    var note = ui.element("span", "sasrec-denserec-note");
    host.querySelector(".sasrec-playground-footer").prepend(note);
    var printModel = ui.element("span", "sasrec-denserec-print-model");
    host.querySelector(".sasrec-playground-footer").prepend(printModel);

    function result(id) {
      var original = manifest.itemIds.canonicalToOriginal[id];
      return Object.assign({ sasId: id, originalId: original }, manifest.catalog.items[original]);
    }

    function searchCatalog(query, limit) {
      if (!query.trim()) return checkbox.checked ? serving.demoColdItemIds.map(result) : [];
      if (!manifest.catalog) return root.GSASRecBrowser.movieMetadata.search(query, manifest.config.numItems)
        .filter(function (item) { return root.GSASRecBrowser.supportsItem(manifest, item.sasId); }).slice(0, limit);
      return root.GSASRecBrowser.fuzzySearch.searchItems(manifest.catalog.items, query,
        manifest.config.numItems, function (original) { return manifest.itemIds.originalToCanonical[original]; })
        .filter(function (item) { return !checkbox.checked || cold.has(item.sasId); }).slice(0, limit);
    }

    return {
      search: searchCatalog,
      searchStatus: function () { return ""; },
      decorate: function (card, id) {
        root.SASRecPlayground.modelRouting.decorate(card, id, manifest, cold.has(id));
      },
      update: function (state) {
        if (currentModel !== state.modelId) {
          currentModel = state.modelId;
          manifest = root.GSASRecModels[currentModel];
          serving = servingFor(manifest);
          renderTextInputs();
          cold = new Set(serving.coldNativeIds.map(function (id) { return manifest.itemIds.nativeToCanonical[id]; }));
          checkbox.disabled = !cold.size;
          checkbox.checked = cold.size > 0 && coldSearch;
          select.options[0].textContent = "All " + manifest.config.numItems.toLocaleString();
          select.options[1].textContent = cold.size + " unseen";
          select.options[1].disabled = !cold.size;
          select.options[2].textContent = serving.knownCount.toLocaleString() + (manifest.serving ? " trained" : " in catalog");
          select.disabled = !cold.size;
          var copy = root.SASRecPlayground.modelRouting.description(manifest);
          summary.textContent = copy.summary;
          printModel.textContent = copy.print;
          note.textContent = copy.note;
          if (serving.kind === "content-knn") select.options[2].textContent = serving.knownCount.toLocaleString() + " warm (SASRec)";
        }
        select.value = state.candidateScope;
        heading.querySelector("strong").textContent = state.candidateScope === "cold"
          ? "Top unseen recommendations" : state.candidateScope === "known"
            ? "Top known recommendations" : "Top recommendations";
      },
      destroy: function () { checkbox.removeEventListener("change", onSearchScope); }
    };
  }
  root.SASRecPlayground.mountDenseRecControls = mount;
})(globalThis);
