(function (root) {
  "use strict";

  var ui = root.SASRecPlayground.movieUI;
  var nextViewId = 1;

  function headingIcon(kind) {
    var shape = kind === "search"
      ? '<circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m16 16 5 5"></path>'
      : '<circle cx="12" cy="7" r="4"></circle><path d="M4 21v-2a8 8 0 0 1 16 0v2"></path>';
    return '<svg class="sasrec-heading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + shape + '</svg>';
  }

  function withDefaults(config) {
    var source = config || {};
    var autoRecommend = source.autoRecommend !== false;
    return {
      allowedModels: source.allowedModels || ["gsasrec-ml1m"],
      modelPresentation: source.modelPresentation || {},
      autoRecommend: autoRecommend,
      allowRecommendationAppend: source.allowRecommendationAppend !== false,
      maxVisibleHistory: Number(source.maxVisibleHistory) || 8,
      searchLimit: Number(source.searchLimit) || 6,
      searchOnlyWhenEmpty: Boolean(source.searchOnlyWhenEmpty),
      showClear: source.showClear !== false,
      showColdStart: Boolean(source.showColdStart),
      showFilterHistoryControl: source.showFilterHistoryControl !== false,
      showModelControl: Boolean(source.showModelControl),
      showRecommend: source.showRecommend == null
        ? !autoRecommend
        : Boolean(source.showRecommend),
      showTopKControl: source.showTopKControl !== false
    };
  }

  function template(viewId) {
    return '<div class="sasrec-toolbar">' +
      '<div data-field="model"><label id="' + viewId + '-model-label" for="' + viewId + '-model">Model</label>' +
      '<select id="' + viewId + '-model" data-control="model"></select></div>' +
      '<button class="sasrec-quiet-button" data-playground-action="recommend" type="button">Recommend</button>' +
      '<span class="sasrec-run-summary">' +
      '<span class="sasrec-runtime-status" data-output="status" aria-live="polite">Ready</span>' +
      '<span class="sasrec-summary-separator" aria-hidden="true">·</span>' +
      '<span class="sasrec-history-count" data-output="history-count">0 events</span>' +
      '<button class="sasrec-summary-clear" data-playground-action="clear" type="button">Clear</button>' +
      '</span>' +
      '</div>' +
      '<div class="sasrec-search">' +
      '<label for="' + viewId + '-search">' + headingIcon("search") + 'Find a movie</label>' +
      '<input id="' + viewId + '-search" data-control="search" type="search" role="combobox" autocomplete="off" ' +
      'placeholder="Try “toy stroy”, “the matrix”, or “animation 1995”…" aria-autocomplete="list" ' +
      'aria-controls="' + viewId + '-results" aria-expanded="false">' +
      '<span data-output="search-status" class="sasrec-search-status"></span>' +
      '<div id="' + viewId + '-results" class="sasrec-search-results" data-output="search-results" role="listbox"></div>' +
      '<div class="sasrec-metadata-prompt" data-output="metadata-prompt" hidden>' +
      '<span>Movie catalog unavailable. Select <code>movies.dat</code> to enable search.</span>' +
      '<label class="sasrec-file-button">Choose file<input data-control="movies-file" type="file" accept=".dat,text/plain"></label>' +
      '</div></div>' +
      '<section class="sasrec-lane sasrec-history"><div class="sasrec-lane-heading"><strong>' + headingIcon("user") + 'User sequence</strong>' +
      '</div><div class="sasrec-strip" data-output="history"></div></section>' +
      '<section class="sasrec-lane sasrec-recommendations"><div class="sasrec-lane-heading"><strong>Top recommendations</strong>' +
      '<span>Click one to make it the next event</span></div><div class="sasrec-strip" data-output="recommendations"></div></section>' +
      '<footer class="sasrec-playground-footer">' +
      '<div class="sasrec-settings-menu" data-field="settings">' +
      '<button class="sasrec-settings-toggle" data-playground-action="toggle-settings" type="button" ' +
      'aria-expanded="false" aria-haspopup="dialog" aria-controls="' + viewId + '-settings">Settings</button>' +
      '<div class="sasrec-settings-popover" id="' + viewId + '-settings" data-output="settings-panel" ' +
      'role="dialog" aria-labelledby="' + viewId + '-settings-title" hidden>' +
      '<span class="sasrec-settings-title" id="' + viewId + '-settings-title">Recommendation settings</span>' +
      '<label data-field="top-k"><span>Top K</span><select data-control="top-k"></select></label>' +
      '<label class="sasrec-switch" data-field="filter"><input data-control="filter" type="checkbox"><span>Filter seen</span></label>' +
      '</div></div></footer>';
  }

  function mountSequenceBuilder(host, session, rawConfig) {
    var config = withDefaults(rawConfig);
    var viewId = "sasrec-view-" + nextViewId++;
    var searchResults = [];
    var activeResult = -1;
    var searchTimer = null;
    var searchCloseTimer = null;
    var latestState = session.getState();

    host.classList.add("sasrec-playground");
    host.innerHTML = template(viewId);

    function find(selector) { return host.querySelector(selector); }
    var debugging = Boolean(host.closest(".denserec-debug-page"));
    if (debugging) find(".sasrec-history .sasrec-lane-heading strong").textContent = "Input sequence";
    if (!debugging && host.closest(".slide-playground")) {
      find(".sasrec-playground-footer").prepend(find(".sasrec-toolbar"));
    }
    var searchInput = find('[data-control="search"]');
    var searchNode = find(".sasrec-search");
    var resultsNode = find('[data-output="search-results"]');
    var settingsMenu = find('[data-field="settings"]');
    var settingsToggle = find('[data-playground-action="toggle-settings"]');
    var settingsPanel = find('[data-output="settings-panel"]');
    var coldControls = config.showColdStart
      ? root.SASRecPlayground.mountDenseRecControls(host, session, renderSearch) : null;

    find('[data-field="model"]').hidden = !config.showModelControl;
    find('[data-field="top-k"]').hidden = !config.showTopKControl;
    find('[data-field="filter"]').hidden = !config.showFilterHistoryControl;
    settingsMenu.hidden = !config.showTopKControl && !config.showFilterHistoryControl;
    find('[data-playground-action="recommend"]').hidden = !config.showRecommend;
    find('[data-playground-action="clear"]').hidden = !config.showClear;

    function populateControls() {
      var model = find('[data-control="model"]');
      model.innerHTML = "";
      config.allowedModels.forEach(function (modelId) {
        var manifest = root.GSASRecModels[modelId];
        if (!manifest) return;
        var presentation = config.modelPresentation[modelId] || {};
        var option = ui.element("option", "", presentation.label || manifest.label);
        option.value = modelId;
        model.appendChild(option);
      });
      var topK = find('[data-control="top-k"]');
      var values = [3, 5, 10];
      if (values.indexOf(latestState.topK) < 0) values.push(latestState.topK);
      values.sort(function (left, right) { return left - right; });
      values.forEach(function (value) {
        var option = ui.element("option", "", String(value));
        option.value = String(value);
        topK.appendChild(option);
      });
    }

    function renderHistory(state) {
      host.classList.toggle("sasrec-has-empty-output", state.allowEmptyHistory && !state.history.length);
      var container = find('[data-output="history"]');
      container.innerHTML = "";
      var hiddenCount = Math.max(0, state.history.length - config.maxVisibleHistory);
      if (hiddenCount) container.appendChild(ui.element("span", "sasrec-earlier", "+" + hiddenCount + " earlier"));
      state.history.slice(-config.maxVisibleHistory).forEach(function (sasId, index) {
        var absoluteIndex = hiddenCount + index;
        var item = ui.details(sasId, root.GSASRecModels[state.modelId]);
        var card = ui.element("article", "sasrec-history-card");
        card.appendChild(ui.poster(item, "sasrec-history-poster"));
        card.appendChild(ui.element("span", "sasrec-position", String(absoluteIndex + 1)));
        var copy = ui.copy(item);
        copy.classList.add("sasrec-card-overlay");
        card.appendChild(copy);
        var remove = ui.element("button", "sasrec-remove", "×");
        remove.type = "button";
        remove.dataset.removePosition = String(absoluteIndex);
        remove.setAttribute("aria-label", "Remove " + item.title + " from sequence");
        card.appendChild(remove);
        if (coldControls) coldControls.decorate(card, sasId);
        container.appendChild(card);
      });
      if (!state.history.length) {
        var presentation = config.modelPresentation[state.modelId] || {};
        container.appendChild(ui.element("p", "sasrec-empty", state.allowEmptyHistory
          ? (root.GSASRecModels[state.modelId].architecture === "content-knn" ? "Add an input to query content neighbors" : "Empty history · all positions are PAD")
          : "Search and add a movie to begin."));
        if (state.allowEmptyHistory) container.appendChild(ui.element("p", "sasrec-empty-provenance",
          presentation.emptyHistoryDescription || root.GSASRecModels[state.modelId].emptyHistoryDescription ||
          "Actual checkpoint output. PAD → first item was excluded from training; this ranking is not a learned first-item prior."));
      }
      find('[data-output="history-count"]').textContent = state.history.length + (state.history.length === 1 ? " event" : " events");
    }

    function movieButton(item, className, label) {
      var button = ui.element("button", className);
      button.type = "button";
      button.dataset.addSas = String(item.sasId);
      button.setAttribute("aria-label", label + " " + item.title);
      button.appendChild(ui.poster(item, className + "-poster"));
      var copy = ui.copy(item);
      if (className === "sasrec-recommendation-card") {
        copy.classList.add("sasrec-card-overlay");
      }
      button.appendChild(copy);
      if (coldControls) coldControls.decorate(button, item.sasId);
      return button;
    }

    function renderRecommendations(state) {
      var container = find('[data-output="recommendations"]');
      container.innerHTML = "";
      if (!state.result) {
        container.appendChild(ui.element("p", "sasrec-empty", state.history.length ? "Updating recommendations…" : "Recommendations appear after the first event."));
        return;
      }
      state.result.recommendations.forEach(function (recommendation, index) {
        var item = ui.details(recommendation.itemId, root.GSASRecModels[state.modelId]);
        var button = movieButton(item, "sasrec-recommendation-card", "Add recommendation");
        button.disabled = !config.allowRecommendationAppend;
        button.prepend(ui.element("span", "sasrec-rank", "#" + (index + 1)));
        if (debugging) {
          var cosine = root.GSASRecModels[state.modelId].architecture === "content-knn";
          var score = ui.element("span", "sasrec-debug-score", (cosine ? "cos " : "score ") + recommendation.score.toFixed(4));
          score.title = cosine ? "Content cosine similarity" : "Raw model score; scales differ between checkpoints";
          button.appendChild(score);
        }
        container.appendChild(button);
      });
    }

    function renderStatus(state) {
      var searchOnly = config.searchOnlyWhenEmpty && !state.history.length;
      [".sasrec-toolbar", ".sasrec-history", ".sasrec-recommendations", ".sasrec-playground-footer"].forEach(function (selector) {
        var node = find(selector);
        if (searchOnly && node.contains(document.activeElement)) searchInput.focus();
        node.hidden = searchOnly;
      });
      if (searchOnly) setSettingsOpen(false);
      var text = "local";
      if (state.status === "ready") text += " · " + state.elapsedMs.toFixed(1) + " ms";
      if (state.status === "running") text += " · ranking…";
      if (state.status === "error") text = state.error.message;
      find('[data-output="status"]').textContent = text;
      find('[data-output="status"]').classList.toggle("sasrec-status-error", state.status === "error");
      find('[data-control="model"]').value = state.modelId;
      if (modelPicker) modelPicker.sync();
      find('[data-control="top-k"]').value = String(state.topK);
      find('[data-control="filter"]').checked = state.filterHistory;
      find('[data-playground-action="recommend"]').disabled =
        (!state.history.length && !state.allowEmptyHistory) || state.status === "running";
      find('[data-playground-action="clear"]').disabled = !state.history.length;
    }

    function setSettingsOpen(open) {
      if (settingsMenu.hidden) return;
      settingsPanel.hidden = !open;
      settingsToggle.setAttribute("aria-expanded", String(open));
    }

    function closeSearchResults() {
      activeResult = -1;
      resultsNode.hidden = true;
      searchInput.setAttribute("aria-expanded", "false");
      searchInput.removeAttribute("aria-activedescendant");
    }

    function renderSearch() {
      var metadataStatus = root.GSASRecBrowser.movieMetadata.status();
      var query = searchInput.value;
      find('[data-output="metadata-prompt"]').hidden = metadataStatus.available;
      searchResults = coldControls ? coldControls.search(query, config.searchLimit) : metadataStatus.available
        ? root.GSASRecBrowser.movieMetadata.search(query, metadataStatus.count).filter(function (item) {
          return root.GSASRecBrowser.supportsItem(root.GSASRecModels[latestState.modelId], item.sasId);
        }).slice(0, config.searchLimit)
        : [];
      activeResult = searchResults.length ? 0 : -1;
      resultsNode.classList.remove("is-keyboard-navigation");
      resultsNode.innerHTML = "";
      searchResults.forEach(function (result, index) {
        var item = ui.resultDetails(result);
        var button = movieButton(item, "sasrec-search-result", "Add");
        button.id = viewId + "-result-" + index;
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", String(index === activeResult));
        resultsNode.appendChild(button);
      });
      resultsNode.hidden = !searchResults.length;
      searchInput.setAttribute("aria-expanded", String(Boolean(searchResults.length)));
      if (activeResult >= 0) {
        searchInput.setAttribute("aria-activedescendant", viewId + "-result-" + activeResult);
      } else {
        searchInput.removeAttribute("aria-activedescendant");
      }
      find('[data-output="search-status"]').textContent = coldControls
        ? coldControls.searchStatus(query, searchResults.length) : !metadataStatus.available
        ? "Metadata required"
        : "";
    }

    function runAfterChange() {
      var state = session.getState();
      if (config.autoRecommend && (state.history.length || state.allowEmptyHistory)) session.run();
    }

    function add(sasId) {
      session.append(Number(sasId));
      searchInput.value = "";
      renderSearch();
      runAfterChange();
      searchInput.focus();
    }

    function moveActive(delta) {
      if (!searchResults.length) return;
      resultsNode.classList.add("is-keyboard-navigation");
      activeResult = (activeResult + delta + searchResults.length) % searchResults.length;
      Array.prototype.forEach.call(resultsNode.children, function (node, index) {
        node.setAttribute("aria-selected", String(index === activeResult));
      });
      searchInput.setAttribute("aria-activedescendant", viewId + "-result-" + activeResult);
      var activeNode = resultsNode.children[activeResult];
      if (activeNode && activeNode.scrollIntoView) {
        activeNode.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }

    function onClick(event) {
      var settingsButton = event.target.closest('[data-playground-action="toggle-settings"]');
      if (settingsButton) {
        setSettingsOpen(settingsPanel.hidden);
      } else if (!settingsPanel.hidden && !event.target.closest(".sasrec-settings-popover")) {
        setSettingsOpen(false);
      }
      var addButton = event.target.closest("[data-add-sas]");
      var removeButton = event.target.closest("[data-remove-position]");
      if (addButton && !addButton.disabled) add(addButton.dataset.addSas);
      if (removeButton) {
        session.removeAt(removeButton.dataset.removePosition);
        runAfterChange();
      }
      var recommendButton = event.target.closest('[data-playground-action="recommend"]');
      if (recommendButton && !recommendButton.disabled) session.run();
      if (event.target.closest('[data-playground-action="clear"]')) { session.clear(); runAfterChange(); }
    }

    function onChange(event) {
      var control = event.target.dataset.control;
      if (control === "model") {
        try {
          var nextOptions = { modelId: event.target.value };
          var nextManifest = root.GSASRecModels[event.target.value];
          if (coldControls && !(nextManifest.serving && nextManifest.serving.coldCount)) nextOptions.candidateScope = "all";
          session.setOptions(nextOptions);
        } catch (error) {
          event.target.value = session.getState().modelId;
          find('[data-output="status"]').textContent = "Sequence input unsupported by this model. Remove it or Clear to switch.";
          find('[data-output="status"]').classList.add("sasrec-status-error");
          return;
        }
        renderSearch();
      }
      if (control === "top-k") session.setOptions({ topK: Number(event.target.value) });
      if (control === "filter") session.setOptions({ filterHistory: event.target.checked });
      if (["model", "top-k", "filter"].indexOf(control) >= 0) runAfterChange();
      if (control === "movies-file" && event.target.files[0]) {
        root.GSASRecBrowser.movieMetadata.importFile(event.target.files[0]).catch(function (error) {
          find('[data-output="search-status"]').textContent = error.message;
        });
      }
    }

    function onKeydown(event) {
      if (event.key === "Escape" && !settingsPanel.hidden) {
        event.preventDefault();
        event.stopPropagation();
        setSettingsOpen(false);
        settingsToggle.focus();
        return;
      }
      if (event.target !== searchInput) return;
      if (event.key === "ArrowDown") { event.preventDefault(); moveActive(1); }
      if (event.key === "ArrowUp") { event.preventDefault(); moveActive(-1); }
      if (event.key === "Enter" && activeResult >= 0) { event.preventDefault(); add(searchResults[activeResult].sasId); }
      if (event.key === "Escape" && (searchInput.value || !resultsNode.hidden)) {
        event.preventDefault();
        event.stopPropagation();
        searchInput.value = "";
        renderSearch();
      }
    }

    function onInput(event) {
      if (event.target !== searchInput) return;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(renderSearch, 70);
    }

    function onSearchFocusIn(event) {
      clearTimeout(searchCloseTimer);
      if (event.target === searchInput && searchInput.value.trim()) renderSearch();
    }

    function onSearchFocusOut() {
      clearTimeout(searchCloseTimer);
      searchCloseTimer = setTimeout(function () {
        if (!searchNode.contains(document.activeElement)) closeSearchResults();
      }, 0);
    }

    function onMetadataChange() {
      renderSearch();
      renderHistory(latestState);
      renderRecommendations(latestState);
    }

    populateControls();
    var modelPicker = config.showModelControl && root.SASRecPlayground.mountModelPicker
      ? root.SASRecPlayground.mountModelPicker(find('[data-control="model"]')) : null;
    host.addEventListener("click", onClick);
    host.addEventListener("change", onChange);
    host.addEventListener("keydown", onKeydown);
    host.addEventListener("input", onInput);
    searchNode.addEventListener("focusin", onSearchFocusIn);
    searchNode.addEventListener("focusout", onSearchFocusOut);
    var unsubscribe = session.subscribe(function (state) {
      latestState = state;
      if (coldControls) coldControls.update(state);
      renderHistory(state);
      renderRecommendations(state);
      renderStatus(state);
    });
    root.addEventListener("gsasrec-metadatachange", onMetadataChange);
    renderSearch();
    if (
      config.autoRecommend &&
      (latestState.history.length || latestState.allowEmptyHistory) &&
      latestState.status !== "ready"
    ) {
      root.requestAnimationFrame(function () { session.run(); });
    }

    return {
      destroy: function () {
        clearTimeout(searchTimer);
        clearTimeout(searchCloseTimer);
        unsubscribe();
        if (coldControls) coldControls.destroy();
        if (modelPicker) modelPicker.destroy();
        root.removeEventListener("gsasrec-metadatachange", onMetadataChange);
        host.replaceChildren();
      },
      focusSearch: function () { searchInput.focus(); },
      session: session
    };
  }

  root.SASRecPlayground.mountSequenceBuilder = mountSequenceBuilder;
})(globalThis);
