(function (root) {
  "use strict";

  var mappings = root.GSASRecMappings;

  function table(entity, direction) {
    var prefix = direction === "sas-to-original" ? "sas" : "original";
    var suffix = direction === "sas-to-original" ? "ToOriginal" : "ToSas";
    var entityName = entity === "user" ? "User" : "Item";
    return mappings[prefix + entityName + suffix];
  }

  function mapId(entity, direction, rawId) {
    var id = Number(rawId);
    var values = table(entity, direction);
    if (!Number.isInteger(id) || id < 1 || id >= values.length || !values[id]) {
      return null;
    }
    return values[id];
  }

  function historyToSas(history, idSpace, manifest) {
    if (idSpace === "sas") {
      return history;
    }
    return history.map(function (originalId) {
      var modelMap = manifest && manifest.itemIds && manifest.itemIds.originalToCanonical;
      var mapped = modelMap ? modelMap[originalId] : mapId("item", "original-to-sas", originalId);
      if (!mapped) {
        throw new Error(
          "Original MovieLens item " + originalId + " is not in the SASRec split"
        );
      }
      return mapped;
    });
  }

  function itemPair(sasItemId, manifest) {
    var modelMap = manifest && manifest.itemIds && manifest.itemIds.canonicalToOriginal;
    return {
      sas: sasItemId,
      original: modelMap ? modelMap[sasItemId] : mapId("item", "sas-to-original", sasItemId)
    };
  }

  root.GSASRecBrowser = root.GSASRecBrowser || {};
  root.GSASRecBrowser.idMapping = {
    historyToSas: historyToSas,
    itemPair: itemPair,
    mapId: mapId
  };
})(globalThis);
