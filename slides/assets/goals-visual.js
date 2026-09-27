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
    var svg = svgElement("svg", {
      viewBox: "0 0 48 48",
      role: "img",
      "aria-hidden": "true"
    });

    if (name === "introduction") {
      svg.appendChild(svgElement("path", { d: "M8 24h29m-5-5 6 5-6 5" }));
      [10, 21, 32].forEach(function (x) {
        svg.appendChild(svgElement("circle", { cx: x, cy: 24, r: 3.5 }));
      });
    } else if (name === "model") {
      [9, 20, 31].forEach(function (x, index) {
        svg.appendChild(svgElement("rect", { x: x, y: 10 + index * 4, width: 8, height: 20, rx: 0 }));
      });
      svg.appendChild(svgElement("path", { d: "M17 24h3m8 0h3m8 0h4m-4-4 4 4-4 4" }));
    } else if (name === "scale") {
      [9, 17, 25].forEach(function (x) {
        [13, 21, 29].forEach(function (y) {
          svg.appendChild(svgElement("rect", { x: x, y: y, width: 4, height: 4, rx: 0 }));
        });
      });
      svg.appendChild(svgElement("path", { d: "M31 24h5m-3-3 3 3-3 3" }));
      svg.appendChild(svgElement("rect", { x: 38, y: 15, width: 3, height: 18, rx: 0 }));
    } else {
      svg.appendChild(svgElement("path", { d: "M8 34c9-1 13-7 18-14 4-5 8-7 14-7m-6-4 6 4-4 6" }));
      svg.appendChild(svgElement("path", { d: "m15 12 1.8 4.2L21 18l-4.2 1.8L15 24l-1.8-4.2L9 18l4.2-1.8z" }));
    }

    return svg;
  }

  function render(slide, content) {
    var layout = element("div", "outline-layout");
    var header = element("header", "outline-header");
    var list = element("ol", "outline-list");
    var title = content.querySelector("h2");
    var eyebrow = content.querySelector(".eyebrow");

    if (eyebrow) {
      eyebrow.className = "outline-eyebrow";
      header.appendChild(eyebrow);
    }
    title.className = "outline-title";
    header.appendChild(title);
    layout.appendChild(header);

    slide.goals.forEach(function (section, index) {
      var pointer = "/goals/" + index;
      var row = element("li", "outline-row");
      var marker = element("div", "outline-marker");
      var heading = element("div", "outline-heading");
      var scope = authorText(element("p", "outline-scope", section.body), slide, pointer + "/body");
      row.dataset.buildStep = index;
      marker.appendChild(element("span", "outline-number", "0" + (index + 1)));
      marker.appendChild(icon(section.icon));
      heading.appendChild(authorText(element("p", "outline-phase", section.phase), slide, pointer + "/phase"));
      heading.appendChild(authorText(element("h3", "outline-topic", section.title), slide, pointer + "/title"));
      row.appendChild(marker);
      row.appendChild(heading);
      row.appendChild(scope);
      list.appendChild(row);
    });
    layout.appendChild(list);
    content.appendChild(layout);
  }

  window.GoalsVisual = { render: render };
})();
