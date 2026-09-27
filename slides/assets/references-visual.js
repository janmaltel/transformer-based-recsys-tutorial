(function () {
  "use strict";

  function node(tag, className, text) {
    var element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function render(slide, main) {
    var list = node("ol", "paper-references");
    (slide.paperKeys || []).forEach(function (key) {
      var entry = window.PresentationCitations[key];
      if (!entry) throw new Error("Unknown reference key: " + key);
      var row = node("li", "paper-reference");
      row.dataset.citationKey = key;
      row.appendChild(node("p", "paper-reference-authors", entry.label));
      var title = node("a", "paper-reference-title", entry.title);
      title.href = entry.url;
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      row.appendChild(title);
      list.appendChild(row);
    });
    main.appendChild(list);
  }

  window.ReferencesVisual = { render: render };
})();
