(function () {
  "use strict";

  // Use the loaded slide order, so omitted slides never become dead links.
  function build(slides) {
    var roots = [];
    var block = null;
    var chapter = null;
    var introduction = null;
    slides.forEach(function (slide, index) {
      var title = slide.navigationTitle || slide.title || slide.id.replace(/-/g, " ");
      var node = { id: slide.id, index: index, title: title, children: [] };
      if (slide.sectionDivider || slide.type === "section-placeholder") {
        if (slide.sectionKind === "block" || slide.blockDivider) {
          node.title = slide.eyebrow ? slide.eyebrow + " · " + title : title;
          roots.push(node);
          block = node;
          chapter = null;
        } else if (slide.sectionKind === "closing") {
          roots.push(node);
          block = null;
          chapter = node;
        } else {
          node.title = slide.sectionNumber ? slide.sectionNumber + " · " + title : title;
          (block ? block.children : roots).push(node);
          chapter = node;
        }
      } else if (chapter || block) {
        (chapter || block).children.push(node);
      } else {
        if (!introduction) {
          introduction = { title: "Introduction", children: [] };
          roots.push(introduction);
        }
        introduction.children.push(node);
      }
    });
    return roots;
  }

  window.PresentationOutlineModel = Object.freeze({ build: build });
})();
