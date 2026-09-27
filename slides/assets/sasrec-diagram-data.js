(function (root) {
  "use strict";

  // Illustrative values, not checkpoint activations. Shared with the black-box
  // interface so an item retains the same colored vector across the sequence.
  var itemVectors = {
    34: [0.7, -0.3, 0.1, -0.7, 0.4, 0.8, -0.1, 0.3],
    2: [-0.5, 0.2, 0.8, 0.4, -0.2, -0.7, 0.5, 0.1],
    1: [0.3, 0.8, -0.4, 0.1, 0.6, -0.2, -0.6, 0.5],
    3114: [0.4, 0.7, -0.3, 0.2, 0.8, -0.1, -0.5, 0.4],
    2355: [0.3, 0.6, -0.5, 0.1, 0.5, 0.2, -0.4, 0.6],
    2700: [-0.2, 0.5, -0.6, 0.7, 0.2, -0.3, 0.4, 0.8],
    1265: [0.8, -0.6, 0.2, -0.1, 0.5, 0.1, -0.8, 0.4],
    588: [-0.4, 0.1, 0.6, -0.5, 0.8, 0.2, 0.3, -0.7]
  };
  var positionVectors = [
    [-0.3, 0.4, 0.3, 0.2, -0.4, -0.2, 0.5, -0.3],
    [0.4, -0.4, -0.2, 0.2, 0.5, 0.3, -0.4, 0.2],
    [0.3, -0.4, 0.2, -0.3, 0.2, 0.4, 0.4, -0.2],
    [-0.2, 0.4, -0.5, 0.2, -0.1, 0.3, -0.2, 0.5]
  ];
  var contextualVectors = [
    [0.6, -0.2, 0.5, -0.3, 0.2, 0.7, -0.4, 0.1],
    [0.2, 0.5, -0.4, 0.7, 0.3, -0.2, 0.4, -0.3],
    [0.4, 0.7, -0.3, 0.2, 0.6, -0.1, -0.5, 0.5]
  ];
  function combined(index) {
    var id = root.CanonicalMoviePredictionExample.history[index].id;
    return root.DiagramKit.sumEmbeddingVectors(itemVectors[id], positionVectors[index]);
  }
  function visibleSources(position) {
    return Array.from({ length: position + 1 }, function (_, index) { return index; });
  }
  root.SASRecDiagramData = {
    itemVectors: itemVectors, positionVectors: positionVectors,
    contextualVectors: contextualVectors, combined: combined,
    visibleSources: visibleSources
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
