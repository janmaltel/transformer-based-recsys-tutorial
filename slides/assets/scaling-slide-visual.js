(function (root) {
  "use strict";
  function el(tag, cls, text) {
    var node = document.createElement(tag); node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function copy(node, slide, pointer) {
    if (root.PresentationEditorRefs) root.PresentationEditorRefs.annotate(node, slide, pointer);
    return node;
  }
  function render(content, slide) {
    var data = slide.scaling, section = el("div", "scaling-layout"), main = el("div", "scaling-main");
    var hasVisual = data.diagram || data.figure || data.table;
    section.classList.toggle("scaling-copy-only", !hasVisual);
    if (data.layout === "catalog-comparison") section.classList.add("scaling-catalog-comparison");
    if (data.layout === "quality-evidence") section.classList.add("scaling-loss-evidence", "scaling-quality-evidence");
    if (data.layout === "loss-evidence") section.classList.add("scaling-loss-evidence");
    if (data.layout === "top-probabilities") section.classList.add("scaling-top-probabilities");
    if (data.layout === "recipe") section.classList.add("scaling-recipe");
    if (data.layout === "embedding-motivation") section.classList.add("scaling-embedding-motivation");
    if (data.layout === "assignment-detail") section.classList.add("scaling-assignment-detail");
    if (data.layout === "codebook-detail") section.classList.add("scaling-codebook-detail");
    if (data.layout === "compression-calculator") section.classList.add("scaling-compression-calculator");
    if (data.diagram) {
      main.classList.add("scaling-diagram");
      root.ScalingDiagrams[data.diagram](main, slide);
    }
    if (data.figure) {
      var figure = el("figure", "scaling-figure"), image = el("img", "");
      image.src = "assets/images/ecir-2024/" + data.figure + ".png";
      image.alt = data.figureAlt; copy(image, slide, "/scaling/figureAlt");
      figure.appendChild(image);
      figure.appendChild(el("figcaption", "", "Original figure"));
      main.appendChild(figure);
    }
    if (data.table) {
      var table = el("table", "scaling-table"), head = document.createElement("thead"), row = document.createElement("tr");
      table.setAttribute("aria-label", slide.title + ". " + slide.subtitle);
      data.table.headings.forEach(function (value, index) {
        var cell = copy(el("th", "", value), slide, "/scaling/table/headings/" + index); cell.scope = "col"; row.appendChild(cell);
      }); head.appendChild(row); table.appendChild(head);
      var body = document.createElement("tbody");
      data.table.rows.forEach(function (values, r) {
        var tr = document.createElement("tr");
        if (data.table.rowSteps) tr.dataset.buildStep = data.table.rowSteps[r];
        values.forEach(function (value, c) {
          var cell = copy(el(c ? "td" : "th", "", value), slide, "/scaling/table/rows/" + r + "/" + c);
          if (!c) cell.scope = "row"; tr.appendChild(cell);
        }); body.appendChild(tr);
      }); table.appendChild(body); main.appendChild(table);
    }
    var prose = el("div", "scaling-prose");
    if (data.formula) {
      var formula = copy(el("div", "scaling-formula", data.formula), slide, "/scaling/formula");
      if (typeof data.formulaStep === "number") formula.dataset.buildStep = data.formulaStep;
      prose.appendChild(formula);
    }
    data.points.forEach(function (point, index) {
      var p = el("div", "scaling-point"); p.dataset.buildStep = point.step;
      if (point.bridge === "question" || point.bridge === "idea") {
        p.classList.add("scaling-bridge", "scaling-bridge-" + point.bridge);
      }
      p.appendChild(copy(el("h3", "", point.label), slide, "/scaling/points/" + index + "/label"));
      p.appendChild(copy(el("p", "", point.body), slide, "/scaling/points/" + index + "/body"));
      var source = root.PresentationCitations[point.citationKey];
      if (source) {
        var link = el("a", "scaling-point-source", source.label);
        link.href = source.url; link.target = "_blank"; link.rel = "noopener noreferrer";
        p.appendChild(link);
      }
      prose.appendChild(p);
    });
    if (data.diagram === "gsasrec-recipe" && root.GBCEGradientLab) {
      root.GBCEGradientLab.mount(prose.lastElementChild, slide);
    }
    if (data.diagram === "catalogue-embedding-memory" && root.RecJPQMemoryCalculator) {
      root.RecJPQMemoryCalculator.mount(prose, main);
    }
    if (hasVisual) section.appendChild(main);
    if (data.points.length || data.formula) section.appendChild(prose);
    section.classList.toggle("scaling-wide-table", Boolean(data.table && !data.points.length));
    content.appendChild(section);
    if (data.note) {
      var note = copy(el("p", "scaling-note", data.note), slide, "/scaling/note");
      if (typeof data.noteStep === "number") note.dataset.buildStep = data.noteStep;
      content.appendChild(note);
    }
  }
  root.ECIRFigureSources = {
    "sasrec-overconfidence": { page: 68 }, "gbce-gradient-balance": { page: 75 },
    "gsasrec-steam-calibration": { page: 82 }, "gbce-cross-encoder": { page: 87 },
    "recjpq-gowalla-tradeoff": { page: 95 }, "tiger-semantic-id-retrieval": { page: 97 }
  };
  root.SASRecVisualParts = root.SASRecVisualParts || {};
  root.SASRecVisualParts["scaling-slide"] = render;
})(window);
