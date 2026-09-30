(function () {
  "use strict";

  var host = document.createElement("div");
  host.className = "presentation-fullscreen";
  var button = document.createElement("button");
  button.type = "button";
  button.className = "deck-fullscreen-toggle";
  button.setAttribute("aria-keyshortcuts", "f");
  button.title = "Toggle fullscreen (F)";
  var message = document.createElement("p");
  message.className = "deck-fullscreen-message";
  message.setAttribute("role", "status");
  message.hidden = true;
  host.appendChild(button);
  host.appendChild(message);
  document.body.appendChild(host);

  function activeElement() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }

  function standalone() {
    return navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  }

  function unavailable() {
    if (standalone()) return "The presentation is already open without browser toolbars. Rotate your device for a larger slide view.";
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return "For a view without browser toolbars, open these slides in Safari, tap Share → Add to Home Screen, then open the saved app. Rotate to landscape for larger slides.";
    }
    return "Fullscreen is unavailable in this view. Open this page in a regular browser and try Fullscreen there. Rotate your phone to landscape for larger slides.";
  }

  function report(text) {
    message.textContent = text;
    message.hidden = !text;
    host.classList.toggle("has-message", Boolean(text));
  }

  function sync() {
    var active = Boolean(activeElement());
    button.textContent = active ? "Exit fullscreen" : standalone() ? "App view" : "Fullscreen";
    button.setAttribute("aria-pressed", String(active));
  }

  async function toggle() {
    if (button.disabled) return;
    report("");
    var root = document.documentElement;
    var request = root.requestFullscreen || root.webkitRequestFullscreen;
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    var enabled = root.requestFullscreen ? document.fullscreenEnabled : document.webkitFullscreenEnabled;
    if ((!activeElement() && (!request || enabled === false)) || (activeElement() && !exit)) {
      report(unavailable());
      return;
    }
    button.disabled = true;
    try {
      if (activeElement()) await exit.call(document);
      else await request.call(root);
      document.querySelector("#deck").focus({ preventScroll: true });
    } catch (error) {
      report("The browser could not switch fullscreen. " + unavailable());
    } finally {
      button.disabled = false;
      sync();
    }
  }

  button.addEventListener("click", toggle);
  ["fullscreenchange", "webkitfullscreenchange"].forEach(function (name) {
    document.addEventListener(name, function () {
      report("");
      sync();
    });
  });
  document.addEventListener("pointerdown", function (event) {
    if (!host.contains(event.target)) report("");
  });
  document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) return;
    if (event.key === "Escape" && !message.hidden) { report(""); return; }
    if (event.key.toLowerCase() !== "f" || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    var path = event.composedPath ? event.composedPath() : [event.target];
    if (path.some(function (node) {
      return node && node.matches && node.matches("input, textarea, select, [contenteditable], [data-editor-ui], [role='textbox']");
    })) return;
    event.preventDefault();
    toggle();
  });
  sync();
})();
