(function (root) {
  "use strict";

  var sharedSessions = {};
  var sharedDefinitions = {};

  function sessionDescriptor(config) {
    var scenario = config.scenario || {};
    var history = scenario.history || {};
    return JSON.stringify({
      modelId: scenario.modelId || "gsasrec-ml1m",
      history: history.ids ? {
        ids: history.ids.map(Number),
        idSpace: history.idSpace || "sas"
      } : {
        exampleIndex: Number(scenario.exampleIndex) || 0,
        historyTail: Number(scenario.historyTail) || null
      },
      topK: Number(scenario.topK) || 5,
      candidateScope: scenario.candidateScope || "all",
      filterHistory: scenario.filterHistory !== false,
      allowEmptyHistory: scenario.allowEmptyHistory === true
    });
  }

  function registerSession(config) {
    if (!config.sessionKey) return null;
    var existing = sharedDefinitions[config.sessionKey];
    var descriptor = sessionDescriptor(config);
    if (!existing) {
      sharedDefinitions[config.sessionKey] = {
        config: config,
        descriptor: descriptor
      };
      return null;
    }
    if (existing.descriptor !== descriptor) {
      return "Playground views sharing sessionKey \"" + config.sessionKey +
        "\" must use the same initial scenario.";
    }
    return null;
  }

  function historyFor(scenario) {
    var configured = scenario.history || {};
    if (configured.ids) {
      return { ids: configured.ids, idSpace: configured.idSpace || "sas" };
    }
    var example = root.GSASRecExamples &&
      root.GSASRecExamples[Number(scenario.exampleIndex) || 0];
    var ids = example ? example.history.slice() : [];
    if (scenario.historyTail) ids = ids.slice(-Number(scenario.historyTail));
    return { ids: ids, idSpace: "sas" };
  }

  function createSession(config) {
    var scenario = config.scenario || {};
    return root.SASRecPlayground.createSession({
      modelId: scenario.modelId || "gsasrec-ml1m",
      history: historyFor(scenario),
      topK: scenario.topK || 5,
      candidateScope: scenario.candidateScope || "all",
      filterHistory: scenario.filterHistory !== false,
      allowEmptyHistory: scenario.allowEmptyHistory === true
    });
  }

  function sessionFor(config) {
    if (!config.sessionKey) return createSession(config);
    var canonical = sharedDefinitions[config.sessionKey];
    if (!sharedSessions[config.sessionKey]) {
      sharedSessions[config.sessionKey] = createSession(canonical.config);
    }
    return sharedSessions[config.sessionKey];
  }

  function viewConfig(config) {
    var controls = config.controls || {};
    var behavior = config.behavior || {};
    return {
      allowedModels: controls.allowedModels || [
        (config.scenario && config.scenario.modelId) || "gsasrec-ml1m"
      ],
      modelPresentation: controls.modelPresentation || {},
      showModelControl: Boolean(controls.model),
      showTopKControl: controls.topK !== false,
      showFilterHistoryControl: controls.filterHistory !== false,
      showClear: controls.clear !== false,
      showRecommend: behavior.showRecommend,
      autoRecommend: behavior.autoRecommend !== false,
      searchOnlyWhenEmpty: Boolean(behavior.searchOnlyWhenEmpty),
      allowRecommendationAppend: behavior.recommendationClick !== "disabled",
      searchLimit: behavior.searchLimit || 6,
      maxVisibleHistory: behavior.maxVisibleHistory || 8,
      showColdStart: Boolean(controls.coldStart)
    };
  }

  function mountExamples(host, session, examples) {
    if (!examples || !examples.length) return;
    var ui = root.SASRecPlayground.movieUI;
    var presets = ui.element("div", "sasrec-example-controls");
    presets.setAttribute("role", "group");
    presets.setAttribute("aria-label", "Example histories");
    presets.appendChild(ui.element("span", "sasrec-examples-label", "Example histories"));
    examples.forEach(function (example) {
      var button = ui.element("button", "sasrec-example-button", example.label);
      button.type = "button";
      button.addEventListener("click", function () {
        session.setHistory(example.ids, "original");
        session.run();
      });
      presets.appendChild(button);
    });
    presets.appendChild(ui.element("p", "sasrec-example-caption",
      "Oldest → newest. Illustrative histories; recommendations use the same fitted model as the first playground."));
    host.querySelector('[data-control="search"]').insertAdjacentElement("afterend", presets);
    session.subscribe(function (state) {
      var manifest = root.GSASRecModels[state.modelId];
      var ids = state.history.map(function (id) {
        return root.GSASRecBrowser.idMapping.itemPair(id, manifest).original;
      });
      presets.querySelectorAll("button").forEach(function (button, index) {
        button.setAttribute("aria-pressed", String(
          JSON.stringify(examples[index].ids) === JSON.stringify(ids)));
      });
    });
  }

  function modelIdsFor(config) {
    var view = viewConfig(config);
    var ids = view.allowedModels.slice();
    var scenarioModel = (config.scenario && config.scenario.modelId) ||
      "gsasrec-ml1m";
    if (ids.indexOf(scenarioModel) < 0) ids.push(scenarioModel);
    return ids;
  }

  function render(slide, content) {
    var registrationError = registerSession(slide.playground);
    content.classList.add("playground-slide-content");
    content.classList.add(
      "playground-composition-" +
      (slide.playground.composition === "instrument" ? "instrument" : "teaching")
    );
    var host = document.createElement("div");
    host.className = "playground-host";
    host.innerHTML = '<p class="playground-loading">Preparing the local recommender…</p>';
    content.appendChild(host);
    var mounted = false;
    var mounting = false;

    function showError(error) {
      var message = error && error.message ? error.message : String(error);
      host.innerHTML = '<p class="playground-error">The optional model playground is unavailable. ' +
        '<span></span></p>';
      host.querySelector("span").textContent = message;
      mounting = false;
    }

    function mount() {
      if (mounted || mounting) return;
      if (registrationError) {
        showError(new Error(registrationError));
        return;
      }
      if (!root.SASRecPlaygroundLoader) {
        showError(new Error("The local asset loader did not start."));
        return;
      }
      mounting = true;
      root.SASRecPlaygroundLoader.load({
        modelIds: modelIdsFor(slide.playground)
      }).then(function () {
        if (!root.SASRecPlayground || !root.SASRecPlayground.mountSequenceBuilder) {
          throw new Error("The local playground runtime did not initialize.");
        }
        host.innerHTML = "";
        var session = sessionFor(slide.playground);
        root.SASRecPlayground.mountSequenceBuilder(
          host,
          session,
          viewConfig(slide.playground)
        );
        if ((slide.playground.scenario || {}).modelId === "pctm-ml1m" && root.PCTMPlayground) {
          root.PCTMPlayground.mount(host, session, slide.playground.examples || []);
        } else {
          mountExamples(host, session, slide.playground.examples);
        }
        mounted = true;
        mounting = false;
      }).catch(showError);
    }

    root.addEventListener("presentation:slidechange", function (event) {
      if (event.detail && event.detail.slideId === slide.id) mount();
    });
    root.addEventListener("beforeprint", mount);
  }

  root.PlaygroundVisual = { render: render };
})(globalThis);
