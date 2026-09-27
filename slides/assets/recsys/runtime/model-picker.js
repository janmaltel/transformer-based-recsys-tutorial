(function (root) {
  "use strict";

  // Keep the native select as the session's value/change bridge and fallback.
  function mountModelPicker(select) {
    var field = select.parentElement;
    var label = field.querySelector("label");
    var picker = document.createElement("div");
    picker.className = "sasrec-model-picker";
    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "sasrec-model-trigger";
    trigger.id = select.id + "-trigger";
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-labelledby", label.id);
    var value = document.createElement("span");
    trigger.appendChild(value);
    var list = document.createElement("div");
    list.className = "sasrec-model-options";
    list.id = select.id + "-options";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-labelledby", label.id);
    list.hidden = true;
    trigger.setAttribute("aria-controls", list.id);
    var options = Array.from(select.options);
    var items = options.map(function (option, index) {
      var item = document.createElement("div");
      item.className = "sasrec-model-option";
      item.id = list.id + "-" + index;
      item.dataset.index = index;
      item.setAttribute("role", "option");
      item.textContent = option.textContent;
      list.appendChild(item);
      return item;
    });
    picker.append(trigger, list);
    field.appendChild(picker);
    select.hidden = true;
    label.htmlFor = trigger.id;
    var active = 0, typed = "", typedAt = 0;

    function highlight(index) {
      active = Math.max(0, Math.min(options.length - 1, index));
      items.forEach(function (item, i) { item.classList.toggle("is-active", i === active); });
      if (!list.hidden && items[active]) {
        trigger.setAttribute("aria-activedescendant", items[active].id);
        items[active].scrollIntoView({ block: "nearest" });
      }
    }

    function close() {
      list.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      trigger.removeAttribute("aria-activedescendant");
      typed = "";
    }

    function sync() {
      value.textContent = options[select.selectedIndex] ? options[select.selectedIndex].textContent : "";
      trigger.disabled = select.disabled;
      items.forEach(function (item, i) {
        item.setAttribute("aria-selected", String(i === select.selectedIndex));
      });
      if (list.hidden) active = Math.max(0, select.selectedIndex);
    }

    function open() {
      sync();
      list.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      highlight(select.selectedIndex);
    }

    function choose(index) {
      close();
      if (index !== select.selectedIndex && options[index]) {
        select.selectedIndex = index;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      // A rejected model switch may have restored the native value.
      sync();
      trigger.focus();
    }

    function onKeydown(event) {
      var key = event.key;
      if (key === "Tab") { close(); return; }
      if (key === "Escape") {
        if (list.hidden) return;
        close();
      } else if (key === "Enter" || key === " ") {
        if (list.hidden) open(); else choose(active);
      } else if (key === "ArrowDown" || key === "ArrowUp") {
        if (list.hidden) open(); else highlight(active + (key === "ArrowDown" ? 1 : -1));
      } else if (key === "Home" || key === "End") {
        if (list.hidden) open();
        highlight(key === "Home" ? 0 : options.length - 1);
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (list.hidden) open();
        typed = Date.now() - typedAt < 700 ? typed + key.toLowerCase() : key.toLowerCase();
        typedAt = Date.now();
        var match = options.findIndex(function (option) {
          return option.textContent.toLowerCase().startsWith(typed);
        });
        if (match >= 0) highlight(match);
      } else { return; }
      event.preventDefault();
      event.stopPropagation();
    }

    function outside(event) { if (!field.contains(event.target)) close(); }
    function blur(event) { if (!field.contains(event.relatedTarget)) close(); }
    trigger.addEventListener("click", function () { if (list.hidden) open(); else close(); });
    trigger.addEventListener("keydown", onKeydown);
    field.addEventListener("focusout", blur);
    list.addEventListener("pointerdown", function (event) { event.preventDefault(); });
    list.addEventListener("click", function (event) {
      var item = event.target.closest("[data-index]");
      if (item) choose(Number(item.dataset.index));
    });
    list.addEventListener("pointermove", function (event) {
      var item = event.target.closest("[data-index]");
      if (item) highlight(Number(item.dataset.index));
    });
    document.addEventListener("pointerdown", outside);
    root.addEventListener("hashchange", close);
    root.addEventListener("blur", close);
    sync();
    return {
      sync: sync,
      destroy: function () {
        document.removeEventListener("pointerdown", outside);
        root.removeEventListener("hashchange", close);
        root.removeEventListener("blur", close);
        field.removeEventListener("focusout", blur);
        picker.remove();
        select.hidden = false;
        label.htmlFor = select.id;
      }
    };
  }

  root.SASRecPlayground.mountModelPicker = mountModelPicker;
})(globalThis);
