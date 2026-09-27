(function () {
  "use strict";

  function copy(tag, className, text, slide, pointer) {
    var node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    var refs = window.PresentationEditorRefs;
    return refs ? refs.annotate(node, slide, pointer) : node;
  }

  function render(slide, main) {
    var layout = document.createElement("div");
    layout.className = "section-divider-layout";
    var heading = document.createElement("div");
    heading.className = "section-divider-heading";
    var kicker = document.createElement("p");
    kicker.className = "section-divider-kicker";
    kicker.appendChild(copy("span", "section-divider-block", slide.eyebrow, slide, "/eyebrow"));
    if (slide.sectionNumber) {
      var number = document.createElement("span");
      number.className = "section-divider-number";
      number.textContent = " · " + slide.sectionNumber;
      kicker.appendChild(number);
    }
    heading.appendChild(kicker);
    heading.appendChild(copy("h2", "section-divider-title", slide.title, slide, "/title"));
    layout.appendChild(heading);

    var topics = document.createElement("ul");
    topics.className = "section-divider-topics";
    (slide.topics || []).forEach(function (topic, index) {
      topics.appendChild(copy("li", "section-divider-topic", topic, slide, "/topics/" + index));
    });
    layout.appendChild(topics);
    main.appendChild(layout);
  }

  window.SectionDividerVisual = { render: render };
})();
