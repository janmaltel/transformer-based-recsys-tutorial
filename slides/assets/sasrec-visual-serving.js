(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};

  function renderTopK(content) {
    var canvas = root.DiagramKit.create(content, "Illustrative movie-item embedding space",
      "Movie posters mark candidate item vectors in an illustrative two-dimensional embedding field. The sequence representation h sub T is a movable query vector. The outlined candidates are the two or three items with the largest dot products h sub T transpose e sub j.",
      { className: "sasrec-serving retrieval-space", width: 1120, height: 440 });
    if (root.RetrievalPlayground) root.RetrievalPlayground.mount(canvas);
  }

  parts["top-k"] = renderTopK;
})(typeof globalThis !== "undefined" ? globalThis : window);
