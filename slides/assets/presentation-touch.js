(function () {
  "use strict";

  var interactive = "a, button, input, textarea, select, label, summary, iframe, " +
    "[contenteditable], [draggable='true'], [tabindex]:not([tabindex='-1']), " +
    "[data-editor-ui], [data-deck-swipe='ignore'], .playground-host";

  window.PresentationTouch = {
    mount: function (deck, move, state) {
      var gesture = null;
      var navigation = document.createElement("nav");
      navigation.className = "presentation-touch-navigation";
      navigation.setAttribute("aria-label", "Slide and build navigation");

      function control(label, symbol, delta) {
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = symbol;
        button.title = label;
        button.setAttribute("aria-label", label);
        button.addEventListener("click", function () { move(delta); });
        navigation.appendChild(button);
        return button;
      }

      var previous = control("Previous slide or build (swipe right)", "←", -1);
      var next = control("Next slide or build (swipe left)", "→", 1);
      document.body.appendChild(navigation);

      function sync() {
        var current = state();
        previous.disabled = !current.canPrevious;
        next.disabled = !current.canNext;
      }

      function zoomed() {
        return window.visualViewport && window.visualViewport.scale > 1.05;
      }

      function capturesTouch(target) {
        for (var node = target; node && node !== deck; node = node.parentElement) {
          if (!node.matches) continue;
          if (node.matches(interactive)) return true;
          var style = getComputedStyle(node);
          if ((/(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth) ||
              (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight)) return true;
        }
        return false;
      }

      deck.addEventListener("touchstart", function (event) {
        gesture = null;
        if (event.defaultPrevented || event.touches.length !== 1 || zoomed() || capturesTouch(event.target)) return;
        var touch = event.touches[0];
        // Leave browser back/forward gestures at the screen edges alone.
        if (touch.clientX < 24 || touch.clientX > window.innerWidth - 24) return;
        gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY, time: event.timeStamp };
      }, { passive: true });

      deck.addEventListener("touchmove", function (event) {
        if (!gesture) return;
        if (event.touches.length !== 1 || zoomed() || event.defaultPrevented) { gesture = null; return; }
        var touch = event.touches[0];
        var dx = Math.abs(touch.clientX - gesture.x);
        var dy = Math.abs(touch.clientY - gesture.y);
        // Once a gesture becomes vertical, it cannot turn into slide navigation.
        if (dy > 12 && dy > dx) { gesture = null; return; }
        if (dx > 12 && dx > dy * 1.5 && event.cancelable) event.preventDefault();
      }, { passive: false });

      deck.addEventListener("touchend", function (event) {
        var start = gesture;
        gesture = null;
        if (!start || event.defaultPrevented || event.touches.length || zoomed()) return;
        var touch = Array.prototype.find.call(event.changedTouches, function (item) {
          return item.identifier === start.id;
        });
        if (!touch) return;
        var dx = touch.clientX - start.x;
        var dy = touch.clientY - start.y;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5 || event.timeStamp - start.time > 1000) return;
        if (window.getSelection && String(window.getSelection())) return;
        move(dx < 0 ? 1 : -1);
      }, { passive: true });

      function cancel() { gesture = null; }
      deck.addEventListener("touchcancel", cancel, { passive: true });
      window.addEventListener("blur", cancel);
      window.addEventListener("resize", cancel);
      window.addEventListener("presentation:statechange", function () { cancel(); sync(); });
      sync();
    }
  };
})();
