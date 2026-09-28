(function () {
  "use strict";

  // Keep the authored geometry in every window, including the notes editor.
  // Native browser fullscreen is simply another resize of the same canvas.
  var deck = document.querySelector("#deck");
  var tokens = getComputedStyle(document.documentElement);
  var width = parseFloat(tokens.getPropertyValue("--slide-w")) || 1280;
  var height = parseFloat(tokens.getPropertyValue("--slide-h")) || 720;

  function fit(availableWidth, availableHeight) {
    if (availableWidth <= 0 || availableHeight <= 0) return;
    deck.style.setProperty("--slide-scale", Math.min(availableWidth / width, availableHeight / height));
  }

  var style = getComputedStyle(deck);
  fit(deck.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    deck.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
  new ResizeObserver(function (entries) {
    var box = entries[0].contentRect;
    fit(box.width, box.height);
  }).observe(deck);
})();
