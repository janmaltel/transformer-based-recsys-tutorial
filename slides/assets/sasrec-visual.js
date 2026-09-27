(function (root) {
  "use strict";

  function fallback(content, message) {
    var node = document.createElement("div");
    node.className = "sasrec-diagram-fallback";
    node.textContent = message;
    content.appendChild(node);
  }

  function render(slide, content) {
    var parts = root.SASRecVisualParts || {};
    var renderer = parts[slide.sasrecVisual];
    if (!root.SVG || !root.DiagramKit) {
      fallback(content, "The model diagram could not be loaded. The slide text remains available.");
      return;
    }
    if (typeof renderer !== "function") {
      fallback(content, "No diagram is registered for this slide.");
      return;
    }
    renderer(content, slide);
  }

  root.SASRecVisual = { render: render };
})(typeof globalThis !== "undefined" ? globalThis : window);
