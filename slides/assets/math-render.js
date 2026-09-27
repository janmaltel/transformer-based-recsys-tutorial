(function () {
  "use strict";

  function render() {
    var deck = document.querySelector("#deck");
    if (!deck || typeof window.renderMathInElement !== "function") return false;

    window.renderMathInElement(deck, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false,
      trust: false
    });
    return true;
  }

  window.PresentationMath = window.PresentationMath || {};
  window.PresentationMath.render = render;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
