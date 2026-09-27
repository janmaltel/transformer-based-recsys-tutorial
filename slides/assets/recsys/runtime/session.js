(function (root) {
  "use strict";

  var nextId = 1;

  function now() {
    return root.performance && root.performance.now
      ? root.performance.now()
      : Date.now();
  }

  function positiveInteger(value, fallback) {
    var parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  function createSession(options) {
    var source = options || {};
    var listeners = new Set();
    var initial = {
      modelId: source.modelId || "gsasrec-ml1m",
      history: source.history || { ids: [], idSpace: "sas" },
      topK: positiveInteger(source.topK, 5),
      candidateScope: source.candidateScope || "all",
      filterHistory: source.filterHistory !== false
    };
    var allowEmptyHistory = source.allowEmptyHistory === true;
    var state = {
      id: "sasrec-session-" + nextId++,
      modelId: initial.modelId,
      history: [],
      topK: initial.topK,
      candidateScope: initial.candidateScope,
      filterHistory: initial.filterHistory,
      status: "idle",
      result: null,
      elapsedMs: null,
      error: null
    };

    function manifest() {
      var model = root.GSASRecModels && root.GSASRecModels[state.modelId];
      if (!model) throw new Error("Unknown browser model: " + state.modelId);
      return model;
    }

    function validateScope(scope, model) {
      if (["all", "cold", "known"].indexOf(scope) < 0) throw new Error("Unknown candidate scope");
      if (scope === "cold" && (!model || !model.serving || !model.serving.coldNativeIds || !model.serving.coldNativeIds.length)) {
        throw new Error("This model has no cold-item catalog");
      }
      if (scope === "known" && (!model || !model.serving || !model.serving.knownNativeIds)) {
        throw new Error("This model has no training-item catalog");
      }
    }

    function normalizeHistory(history, idSpace, nextManifest) {
      var catalog = nextManifest || manifest();
      var ids = (history || []).map(Number);
      if (idSpace && idSpace !== "sas") {
        ids = root.GSASRecBrowser.idMapping.historyToSas(ids, idSpace, catalog);
      }
      var maximum = catalog.config.maxSequenceLength;
      ids = ids.slice(-maximum);
      if (ids.some(function (id) {
        return !root.GSASRecBrowser.supportsInput(catalog, id);
      })) {
        throw new Error("History contains an item outside this model's catalog");
      }
      return ids;
    }

    function snapshot() {
      return {
        id: state.id,
        modelId: state.modelId,
        history: state.history.slice(),
        topK: state.topK,
        candidateScope: state.candidateScope,
        filterHistory: state.filterHistory,
        allowEmptyHistory: allowEmptyHistory,
        status: state.status,
        result: state.result,
        elapsedMs: state.elapsedMs,
        error: state.error
      };
    }

    function emit() {
      var value = snapshot();
      listeners.forEach(function (listener) { listener(value); });
      return value;
    }

    function clearResult() {
      state.result = null;
      state.elapsedMs = null;
      state.error = null;
      state.status = state.history.length ? "stale" : "empty";
    }

    function setHistory(ids, idSpace) {
      state.history = normalizeHistory(ids, idSpace || "sas");
      clearResult();
      return emit();
    }

    function append(sasId) {
      return setHistory(state.history.concat(Number(sasId)), "sas");
    }

    function removeAt(position) {
      var index = Number(position);
      if (!Number.isInteger(index) || index < 0 || index >= state.history.length) {
        return snapshot();
      }
      var history = state.history.slice();
      history.splice(index, 1);
      return setHistory(history, "sas");
    }

    function setOptions(patch) {
      var updates = patch || {};
      var scope = updates.candidateScope == null ? state.candidateScope : updates.candidateScope;
      var nextModel = root.GSASRecModels[updates.modelId || state.modelId];
      validateScope(scope, nextModel);
      if (updates.modelId && updates.modelId !== state.modelId) {
        if (!root.GSASRecModels || !root.GSASRecModels[updates.modelId]) {
          throw new Error("Unknown browser model: " + updates.modelId);
        }
        // Validate before changing state so a smaller catalog cannot corrupt the session.
        var nextHistory = normalizeHistory(state.history, "sas", root.GSASRecModels[updates.modelId]);
        state.modelId = updates.modelId;
        state.history = nextHistory;
      }
      if (updates.topK != null) state.topK = positiveInteger(updates.topK, state.topK);
      state.candidateScope = scope;
      if (updates.filterHistory != null) {
        state.filterHistory = Boolean(updates.filterHistory);
      }
      clearResult();
      return emit();
    }

    function run() {
      if (!state.history.length && !allowEmptyHistory) {
        clearResult();
        return emit();
      }
      state.status = "running";
      state.error = null;
      emit();
      try {
        var started = now();
        state.result = root.GSASRecBrowser.infer(
          state.modelId,
          state.history,
          {
            topK: state.topK,
            candidateScope: state.candidateScope,
            filterRated: state.filterHistory,
            allowEmptyHistory: allowEmptyHistory,
            targetItemId: null
          }
        );
        state.elapsedMs = now() - started;
        state.status = "ready";
      } catch (error) {
        state.error = error;
        state.result = null;
        state.elapsedMs = null;
        state.status = "error";
      }
      return emit();
    }

    function reset() {
      state.modelId = initial.modelId;
      state.topK = initial.topK;
      state.candidateScope = initial.candidateScope;
      state.filterHistory = initial.filterHistory;
      state.history = normalizeHistory(initial.history.ids || [], initial.history.idSpace);
      clearResult();
      return emit();
    }

    validateScope(initial.candidateScope, manifest());
    state.history = normalizeHistory(initial.history.ids || [], initial.history.idSpace);
    clearResult();

    return {
      append: append,
      clear: function () { return setHistory([], "sas"); },
      destroy: function () { listeners.clear(); },
      getState: snapshot,
      removeAt: removeAt,
      reset: reset,
      run: run,
      setHistory: setHistory,
      setOptions: setOptions,
      subscribe: function (listener) {
        listeners.add(listener);
        listener(snapshot());
        return function () { listeners.delete(listener); };
      }
    };
  }

  root.SASRecPlayground = root.SASRecPlayground || {};
  root.SASRecPlayground.createSession = createSession;
})(globalThis);
