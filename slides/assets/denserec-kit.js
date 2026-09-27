(function (root) {
  "use strict";
  function el(parent, tag, cls, text) {
    var node = document.createElement(tag);
    node.className = cls || "";
    if (text !== undefined) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }
  function stage(node, step) { node.dataset.buildStep = step; return node; }
  function copy(parent, tag, cls, slide, pointer, text) {
    var node = el(parent, tag, cls, text);
    if (root.PresentationEditorRefs) root.PresentationEditorRefs.annotate(node, slide, pointer);
    return node;
  }
  function point(parent, slide, index, cls) {
    var data = slide.scaling.points[index], group = el(parent, "div", "dr-point " + (cls || ""));
    copy(group, "h3", "", slide, "/scaling/points/" + index + "/label", data.label);
    copy(group, "p", "", slide, "/scaling/points/" + index + "/body", data.body);
    return group;
  }
  function frame(content, slide) {
    var host = el(content, "div", "denserec dr-" + slide.id);
    var body = el(host, "div", "dr-body");
    copy(host, "p", "dr-note", slide, "/scaling/note", slide.scaling.note);
    return { host: host, body: body };
  }
  function formula(parent, slide) {
    return copy(parent, "div", "dr-equation", slide, "/scaling/formula", slide.scaling.formula);
  }
  function math(parent, text, cls) { return el(parent, "div", "dr-math " + (cls || ""), "\\(" + text + "\\)"); }
  function arrow(parent, down) {
    var node = el(parent, "span", "dr-arrow" + (down ? " dr-arrow-down" : ""), down ? "↓" : "→");
    node.setAttribute("aria-hidden", "true");
    return node;
  }
  function poster(parent, movie) {
    var figure = el(parent, "figure", "dr-poster");
    var frame = el(figure, "div", "dr-poster-frame");
    frame.setAttribute("aria-hidden", "true");
    el(frame, "span", "dr-poster-fallback", movie.title);
    var url = root.GSASRecPosterAssets && root.GSASRecPosterAssets.urlForOriginalId(movie.id);
    if (url) {
      var img = el(frame, "img");
      img.alt = ""; img.src = url; img.dataset.movieId = movie.id;
      img.addEventListener("error", function () { img.hidden = true; });
    }
    el(figure, "figcaption", "", movie.title);
    return figure;
  }
  function vector(parent, values, label) {
    var row = el(parent, "div", "dr-vector");
    row.setAttribute("role", "img"); row.setAttribute("aria-label", label || "Schematic embedding vector");
    values.forEach(function (v) { el(row, "span", "dr-cell dr-cell-" + v); });
    return row;
  }
  function tokens(parent, pattern, labels) {
    var row = el(parent, "div", "dr-tokens");
    pattern.forEach(function (dense, index) {
      var token = el(row, "div", "dr-token" + (dense ? " dr-content-token" : ""));
      var item = el(token, "span", "dr-token-item", labels ? labels[index] : "i");
      if (!labels) el(item, "sub", "", String(index + 1));
      el(token, "span", "dr-token-route", dense ? "content" : "ID");
    });
    return row;
  }
  root.DenseRecKit = { el: el, stage: stage, copy: copy, point: point, frame: frame,
    formula: formula, math: math, arrow: arrow, poster: poster, vector: vector, tokens: tokens };
})(globalThis);
