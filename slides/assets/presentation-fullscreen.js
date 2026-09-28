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

  function report(text) {
    message.textContent = text;
    message.hidden = !text;
    host.classList.toggle("has-message", Boolean(text));
  }

  function sync() {
    var active = Boolean(document.fullscreenElement);
    button.textContent = active ? "Exit fullscreen" : "Fullscreen";
    button.setAttribute("aria-pressed", String(active));
  }

  async function toggle() {
    if (button.disabled) return;
    report("");
    if (!document.documentElement.requestFullscreen || document.fullscreenEnabled === false) {
      report("Fullscreen is unavailable in this view. Open this page in a regular browser and try Fullscreen there.");
      return;
    }
    button.disabled = true;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      document.querySelector("#deck").focus({ preventScroll: true });
    } catch (error) {
      report("The browser could not switch fullscreen. Try again, or open this page in a regular browser.");
    } finally {
      button.disabled = false;
      sync();
    }
  }

  button.addEventListener("click", toggle);
  document.addEventListener("fullscreenchange", function () {
    report("");
    sync();
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
