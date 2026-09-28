(function (root) {
  "use strict";

  var loaderScript = document.currentScript ||
    document.querySelector('script[src*="assets/recsys/loader.js"]');
  var baseUrl = new URL(".", loaderScript ? loaderScript.src : root.location.href);
  var scriptLoads = {};
  var modelLoads = {};
  var commonLoad = null;
  var metadataLoad = null;
  var modelChunkCounts = {
    "pctm-ml1m": 15,
    "pred-denserec-p05-e5-masked-1000-ml1m": 2,
    "pred-denserec-p05-e5-masked-500-ml1m": 2,
    "pred-denserec-p1-e5-masked-1000-ml1m": 2,
    "pred-denserec-p1-e5-masked-500-ml1m": 2,
    "pred-denserec-p05-e5-500-ml1m": 2,
    "pred-denserec-p1-e5-500-ml1m": 2,
    "sasrec-ml1m": 6,
    "gsasrec-ml1m": 6,
    "gsasrec-nearest-warm-e5-ml1m": 0,
    "pred-sasrec-ml1m": 2,
    "pad-first-ml1m": 2,
    "pred-denserec-ml1m": 2,
    "pred-denserec-p0-ml1m": 2,
    "pred-denserec-p05-ml1m": 2,
    "pred-denserec-p05-long-ml1m": 2,
    "pred-denserec-p1-ml1m": 2,
    "pred-nearest-warm-ml1m": 2,
    "content-knn-ml1m": 7,
    "pred-denserec-p05-e5-long-ml1m": 2,
    "pred-denserec-p1-e5-long-ml1m": 2,
    "pred-denserec-p05-e5-ml1m": 2,
    "pred-denserec-p1-e5-ml1m": 2,
    "pred-nearest-warm-e5-ml1m": 2,
    "content-knn-e5-ml1m": 7
  };

  function loadScript(path, optional) {
    var url = new URL(path, baseUrl).href;
    if (scriptLoads[url]) return scriptLoads[url];

    scriptLoads[url] = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.async = false;
      script.onload = function () { resolve(true); };
      script.onerror = function () {
        if (optional) {
          resolve(false);
          return;
        }
        reject(new Error("Could not load browser playground asset: " + path));
      };
      document.head.appendChild(script);
    });
    return scriptLoads[url];
  }

  function inOrder(paths) {
    return paths.reduce(function (promise, path) {
      return promise.then(function () { return loadScript(path); });
    }, Promise.resolve());
  }

  function restoreStoredMetadata() {
    if (root.GSASRecMovieMetadata) return true;
    try {
      var stored = root.localStorage.getItem("gsasrec-ml1m-movie-metadata-v1");
      if (!stored) return false;
      var parsed = JSON.parse(stored);
      if (!parsed || !parsed.items) return false;
      root.GSASRecMovieMetadata = parsed;
      return true;
    } catch (_error) {
      return false;
    }
  }

  function loadMetadata() {
    if (root.GSASRecMovieMetadata || restoreStoredMetadata()) {
      return Promise.resolve(true);
    }
    if (metadataLoad) return metadataLoad;
    if (new URLSearchParams(root.location.search).get("metadata") !== "local") {
      return Promise.resolve(false);
    }
    metadataLoad = loadScript("data/movie-metadata.local.js", true).then(function () {
      return Boolean(root.GSASRecMovieMetadata && root.GSASRecMovieMetadata.items);
    });
    return metadataLoad;
  }

  function loadCommon() {
    if (commonLoad) return commonLoad;
    commonLoad = inOrder([
      "data/mappings.js",
      "data/examples.js",
      "data/movie-catalog.js?v=1",
      "data/cold-poster-assets.js",
      "data/external-movies.js",
      "data/external-movie-vectors.js",
      "data/poster-assets.js?v=5"
    ]).then(loadMetadata).then(function () {
      return inOrder([
        "runtime/weight-loader.js?v=5",
        "runtime/catalog-extensions.js",
        "runtime/id-mapping.js?v=2",
        "runtime/fuzzy-search.js",
        "runtime/movie-metadata.js?v=2",
        "runtime/math.js",
        "runtime/pred-engine.js?v=5",
        "runtime/knn-engine.js",
        "runtime/pctm-engine.js?v=1",
        "runtime/nearest-warm-engine.js",
        "runtime/engine.js?v=8",
        "runtime/session.js?v=6",
        "runtime/movie-ui.js?v=5",
        "runtime/model-routing.js?v=6",
        "runtime/denserec-controls.js?v=11",
        "runtime/model-picker.js?v=1",
        "runtime/sequence-builder.js?v=12"
      ]);
    });
    return commonLoad;
  }

  function loadModel(modelId) {
    if (modelLoads[modelId]) return modelLoads[modelId];
    var chunkCount = modelChunkCounts[modelId];
    if (chunkCount == null) {
      return Promise.reject(new Error("Unknown bundled browser model: " + modelId));
    }
    var revision = modelId === "pad-first-ml1m" ? "?v=500-epochs-20260925" : "";
    var paths = ["models/" + modelId + "/manifest.js" + (revision || "?v=20260924")];
    for (var index = 0; index < chunkCount; index += 1) {
      paths.push(
        "models/" + modelId + "/weights-" + String(index).padStart(2, "0") + ".js" + revision
      );
    }
    modelLoads[modelId] = inOrder(paths).then(function () {
      var base = root.GSASRecModels[modelId].baseModelId;
      return base ? loadModel(base) : null;
    });
    return modelLoads[modelId];
  }

  function load(options) {
    var source = options || {};
    var modelIds = source.modelIds || ["gsasrec-ml1m"];
    return Promise.all([loadCommon()].concat(modelIds.map(loadModel))).then(function () {
      modelIds.forEach(root.GSASRecBrowser.applyCatalogExtension);
      return Promise.all(modelIds.map(function (id) {
        return root.GSASRecModels[id].compression
          ? root.GSASRecBrowser.prepareWeights(id) : null;
      }));
    });
  }

  root.SASRecPlaygroundLoader = {
    load: load,
    loadMetadata: loadMetadata
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
