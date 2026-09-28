(function () {
  "use strict";

  function element(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function mount(slides, navigate) {
    var host = document.querySelector(".presentation-outline");
    if (!host || !slides.length) return;
    var trigger = host.querySelector(".deck-outline-trigger");
    var panel = host.querySelector(".deck-outline-panel");
    var tree = host.querySelector(".deck-outline-tree");
    var links = [];
    var activeLink = null;
    var pinned = false;
    var leaveTimer;
    var branchCount = 0;

    function expand(item, open) {
      item.querySelector(".deck-outline-toggle").setAttribute("aria-expanded", String(open));
      item.querySelector(".deck-outline-children").hidden = !open;
    }

    function render(nodes, parent) {
      nodes.forEach(function (node) {
        var item = element("li", "deck-outline-item");
        var row = element("div", "deck-outline-row");
        item.appendChild(row);
        if (node.children.length) {
          var toggle = element("button", "deck-outline-toggle", "›");
          toggle.type = "button";
          toggle.setAttribute("aria-label", "Toggle " + node.title);
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-controls", "deck-outline-branch-" + (++branchCount));
          row.appendChild(toggle);
        }
        var label = element(node.id ? "a" : "span", "deck-outline-link");
        if (node.id) {
          label.href = "#" + encodeURIComponent(node.id);
          label.dataset.slideIndex = node.index;
          label.dataset.slideId = node.id;
          label.appendChild(element("span", "deck-outline-number", String(node.index + 1).padStart(2, "0")));
          links.push(label);
        }
        label.appendChild(element("span", "deck-outline-label", node.title));
        row.appendChild(label);
        if (node.children.length) {
          item.classList.add("deck-outline-branch");
          var children = element("ol", "deck-outline-children");
          children.id = toggle.getAttribute("aria-controls");
          children.hidden = true;
          render(node.children, children);
          item.appendChild(children);
        }
        parent.appendChild(item);
      });
    }

    function revealCurrent() {
      if (!activeLink) return;
      var parent = activeLink.closest(".deck-outline-item").parentElement;
      while (parent && parent !== tree) {
        if (parent.classList.contains("deck-outline-children")) expand(parent.parentElement, true);
        parent = parent.parentElement;
      }
      if (!panel.hidden) activeLink.scrollIntoView({ block: "nearest" });
    }

    function setOpen(open, restoreFocus) {
      clearTimeout(leaveTimer);
      var opening = open && panel.hidden;
      panel.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      if (opening) revealCurrent();
      if (!open) pinned = false;
      if (restoreFocus) trigger.focus({ preventScroll: true });
    }

    function closeLater() {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(function () {
        var autoHide = window.matchMedia("(hover: hover)").matches;
        var keepOpen = autoHide ? host.querySelector(":focus-visible") :
          pinned || host.contains(document.activeElement);
        if (!keepOpen) {
          setOpen(false);
          // A mouse-focused, now invisible control must not capture slide keys.
          if (autoHide && host.contains(document.activeElement)) document.activeElement.blur();
        }
      }, 220);
    }

    render(window.PresentationOutlineModel.build(slides), tree);
    host.hidden = false;
    host.addEventListener("pointerenter", function (event) {
      clearTimeout(leaveTimer);
      if (event.pointerType === "mouse" && window.matchMedia("(hover: hover)").matches) setOpen(true);
    });
    host.addEventListener("pointerleave", closeLater);
    host.addEventListener("focusout", function (event) {
      if (!host.contains(event.relatedTarget)) setOpen(false);
    });
    trigger.addEventListener("click", function () {
      if (!panel.hidden && pinned) setOpen(false);
      else { pinned = true; setOpen(true); }
    });
    panel.addEventListener("click", function (event) {
      var toggle = event.target.closest(".deck-outline-toggle");
      var link = event.target.closest("a[data-slide-index]");
      if (toggle) expand(toggle.closest(".deck-outline-item"), toggle.getAttribute("aria-expanded") !== "true");
      else if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        setOpen(false);
        navigate(Number(link.dataset.slideIndex));
      }
    });
    host.querySelector(".deck-outline-close").addEventListener("click", function () { setOpen(false, true); });
    document.addEventListener("pointerdown", function (event) {
      if (!panel.hidden && !host.contains(event.target)) setOpen(false);
    });
    // Keep outline keyboard handling separate from slide navigation.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false, true);
      }
    }, true);
    host.addEventListener("keydown", function (event) {
      var keys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End", "PageDown", "PageUp", " "];
      if (keys.indexOf(event.key) < 0) return;
      event.stopPropagation();
      if (event.key === " " || event.key === "PageDown" || event.key === "PageUp") return;
      event.preventDefault();
      if (event.target === trigger) {
        pinned = true;
        setOpen(true);
        revealCurrent();
        (activeLink || links[0]).focus();
        return;
      }
      var focusable = Array.prototype.filter.call(tree.querySelectorAll("button, a"), function (node) {
        return !node.closest("[hidden]");
      });
      var index = focusable.indexOf(document.activeElement);
      var item = event.target.closest(".deck-outline-item");
      var toggle = item && item.querySelector(".deck-outline-toggle");
      if (event.key === "ArrowRight") {
        if (toggle && toggle.getAttribute("aria-expanded") === "false") expand(item, true);
        else if (focusable[index + 1]) focusable[index + 1].focus();
      } else if (event.key === "ArrowLeft") {
        if (toggle && toggle.getAttribute("aria-expanded") === "true") expand(item, false);
        else if (item && item.parentElement !== tree) item.parentElement.parentElement.querySelector(".deck-outline-toggle").focus();
      } else {
        var next = event.key === "Home" ? 0 : event.key === "End" ? focusable.length - 1 :
          index + (event.key === "ArrowUp" ? -1 : 1);
        if (focusable[next]) focusable[next].focus();
      }
    });
    window.addEventListener("presentation:slidechange", function (event) {
      links.forEach(function (link) {
        var active = link.dataset.slideId === event.detail.slideId;
        if (active) { link.setAttribute("aria-current", "page"); activeLink = link; }
        else link.removeAttribute("aria-current");
      });
      if (!panel.hidden) revealCurrent();
    });
  }

  window.PresentationOutline = Object.freeze({ mount: mount });
})();
