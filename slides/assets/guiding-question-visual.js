(function () {
  "use strict";

  var namespace = "http://www.w3.org/2000/svg";

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function authorText(node, slide, pointer) {
    var refs = window.PresentationEditorRefs;
    return refs ? refs.annotate(node, slide, pointer) : node;
  }

  function svgElement(tag, attributes) {
    var node = document.createElementNS(namespace, tag);
    Object.keys(attributes).forEach(function (name) {
      node.setAttribute(name, attributes[name]);
    });
    return node;
  }

  function icon(name) {
    var svg = svgElement("svg", { viewBox: "0 0 48 48", "aria-hidden": "true" });
    if (name === "user") {
      svg.appendChild(svgElement("circle", { cx: 24, cy: 15, r: 8 }));
      svg.appendChild(svgElement("path", { d: "M10 39c2-10 8-14 14-14s12 4 14 14" }));
    } else if (name === "catalog") {
      svg.appendChild(svgElement("rect", { x: 7, y: 9, width: 14, height: 14, rx: 0 }));
      svg.appendChild(svgElement("rect", { x: 27, y: 9, width: 14, height: 14, rx: 0 }));
      svg.appendChild(svgElement("rect", { x: 7, y: 29, width: 14, height: 12, rx: 0 }));
      svg.appendChild(svgElement("path", { d: "M27 35h14m-7-7v14" }));
    } else if (name === "sequence") {
      svg.appendChild(svgElement("circle", { cx: 9, cy: 24, r: 4 }));
      svg.appendChild(svgElement("circle", { cx: 24, cy: 24, r: 4 }));
      svg.appendChild(svgElement("circle", { cx: 39, cy: 24, r: 4 }));
      svg.appendChild(svgElement("path", { d: "M13 24h7m8 0h7" }));
    } else {
      svg.appendChild(svgElement("circle", { cx: 24, cy: 24, r: 17 }));
      svg.appendChild(svgElement("path", { d: "M24 13v12l8 5M8 24h5m22 0h5" }));
    }
    return svg;
  }

  function decorateEmphasis(node, value, pattern, className, tagName) {
    var match = pattern.exec(value);
    node.textContent = "";
    if (!match) {
      node.textContent = value;
      return;
    }
    if (match.index) node.appendChild(document.createTextNode(value.slice(0, match.index)));
    node.appendChild(element(tagName || "span", className, match[0]));
    if (match.index + match[0].length < value.length) {
      node.appendChild(document.createTextNode(value.slice(match.index + match[0].length)));
    }
  }

  function decorateTitle(slide, content) {
    var title = content.querySelector("h2");
    decorateEmphasis(title, slide.title, /\bnot\b/i, "question-not");
    authorText(title, slide, "/title");
  }

  function render(slide, content) {
    var layout = element("div", "guiding-layout");
    var reasons = element("div", "guiding-reasons");

    decorateTitle(slide, content);
    if (slide.guiding.reasons.length === 4) reasons.classList.add("is-four");

    slide.guiding.reasons.forEach(function (reason, index) {
      var card = element("article", "guiding-reason guiding-stage");
      card.dataset.buildStep = index;
      var marker = element("div", "guiding-reason-icon");
      var copy = element("div", "guiding-reason-copy");
      marker.appendChild(icon(reason.icon));
      var pointer = "/guiding/reasons/" + index;
      copy.appendChild(authorText(element("strong", "", reason.label), slide, pointer + "/label"));
      copy.appendChild(authorText(element("span", "", reason.body), slide, pointer + "/body"));
      card.appendChild(marker);
      card.appendChild(copy);
      reasons.appendChild(card);
    });

    layout.appendChild(reasons);
    content.appendChild(layout);
  }

  window.GuidingQuestionVisual = { render: render };
})();
