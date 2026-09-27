(function () {
  "use strict";

  function element(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function render(slide, content) {
    var repository = slide.repository;
    var layout = element("div", "materials-layout");
    var copy = element("div", "materials-copy");
    var description = content.querySelector(".statement-body");
    if (description) copy.appendChild(description);
    var link = element(repository.url ? "a" : "span", "materials-url", repository.label);
    if (repository.url) link.href = repository.url;
    if (window.PresentationEditorRefs) {
      window.PresentationEditorRefs.annotate(link, slide, "/repository/label");
    }
    copy.appendChild(link);
    if (!repository.url) {
      copy.appendChild(element("p", "materials-pending", "Final attendee link pending"));
    }

    var figure = element("figure", "materials-qr");
    if (repository.qrImage) {
      var image = element("img", "materials-qr-image");
      image.src = repository.qrImage;
      image.alt = "QR code for the tutorial materials";
      figure.appendChild(image);
    } else {
      var placeholder = element("div", "materials-qr-placeholder");
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", "QR code placeholder; final code not yet available");
      placeholder.appendChild(element("span", "materials-qr-label", "QR code"));
      placeholder.appendChild(element("span", "materials-qr-note", "Placeholder"));
      figure.appendChild(placeholder);
    }
    layout.appendChild(copy);
    layout.appendChild(figure);
    content.appendChild(layout);
  }

  window.MaterialsVisual = { render: render };
})();
