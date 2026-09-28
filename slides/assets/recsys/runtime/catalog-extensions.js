(function (root) {
  "use strict";

  // A serving-only addition. Frozen checkpoint tensors and MovieLens identities
  // remain intact; the generated vector supplies one appended input/output row.
  function apply(modelId) {
    var manifest = root.GSASRecModels[modelId];
    var payload = root.GSASRecExternalMovieVectors;
    var entry = payload && payload.models[modelId];
    if (!entry || manifest.catalogExtension) return;
    var movie = root.GSASRecExternalMovies.items.find(function (item) { return item.key === payload.movieKey; });
    var canonical = movie.canonicalId, catalogId = movie.catalogId;
    if (manifest.config.numItems !== entry.baseNumItems ||
        (manifest.weightsSha256 || null) !== entry.baseWeightsSha256 ||
        (manifest.source.checkpointSha256 || null) !== entry.checkpointSha256) {
      throw new Error("External movie belongs to a different model release: " + modelId);
    }
    if (manifest.itemIds.canonicalToNative[canonical] || manifest.itemIds.originalToCanonical[catalogId]) {
      throw new Error("External movie identity collides with the model catalog");
    }
    var native = entry.baseNumItems + 1;
    if (entry.embedding && (entry.embedding.length !== manifest.config.embeddingDim ||
        !entry.embedding.every(Number.isFinite))) throw new Error("Invalid external movie embedding");
    var mapping = {};
    Object.keys(manifest.itemIds).forEach(function (name) {
      // External catalog IDs have their own namespace, not a sparse ML-1M array.
      mapping[name] = name === "originalToCanonical"
        ? Object.assign({}, manifest.itemIds[name]) : manifest.itemIds[name].slice();
    });
    mapping.nativeToCanonical[native] = canonical;
    mapping.canonicalToNative[canonical] = native;
    mapping.canonicalToOriginal[canonical] = catalogId;
    mapping.originalToCanonical[catalogId] = canonical;
    var catalog = Object.assign({}, manifest.catalog.items);
    catalog[catalogId] = { title: movie.title, year: movie.year, genres: movie.genres.slice(),
      namespace: movie.namespace, sourceUrl: movie.sourceUrl };
    var serving = Object.assign({}, manifest.serving, {
      coldCount: manifest.serving.coldCount + 1,
      coldNativeIds: manifest.serving.coldNativeIds.concat(native),
      demoColdItemIds: [canonical].concat(manifest.serving.demoColdItemIds)
    });
    if (entry.proxyCanonicalId) {
      serving.warmProxyIds = Object.assign({}, serving.warmProxyIds);
      serving.warmProxyIds[canonical] = entry.proxyCanonicalId;
    }
    manifest.config = Object.assign({}, manifest.config, { numItems: native });
    manifest.itemIds = mapping;
    manifest.catalog = Object.assign({}, manifest.catalog, { items: catalog });
    manifest.serving = serving;
    manifest.catalogExtension = { key: movie.key, canonicalId: canonical, nativeId: native,
      catalogId: catalogId, namespace: movie.namespace, tensorName: entry.tensorName,
      embedding: entry.embedding, baseNumItems: entry.baseNumItems };
  }

  root.GSASRecBrowser = root.GSASRecBrowser || {};
  root.GSASRecBrowser.applyCatalogExtension = apply;
})(globalThis);
