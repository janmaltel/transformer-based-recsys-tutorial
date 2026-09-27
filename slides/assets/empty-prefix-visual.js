(function (root) {
  "use strict";
  var sequences = [
    ["A", "C", "D"], ["A", "D", "C"], ["A", "B", "D"],
    ["B", "C", "D"], ["B", "D", "C"], ["C", "D", "A"]
  ];
  function el(parent, tag, cls, text) {
    var node = document.createElement(tag); node.className = cls || "";
    if (text !== undefined) node.textContent = text;
    if (parent) parent.appendChild(node);
    return node;
  }
  function stage(node, step) { node.dataset.buildStep = step; return node; }
  function copy(node, slide, pointer) {
    if (root.PresentationEditorRefs) root.PresentationEditorRefs.annotate(node, slide, pointer);
    return node;
  }
  function point(parent, slide, index) {
    var data = slide.scaling.points[index], group = stage(el(parent, "div", "ep-point"), data.step);
    copy(el(group, "h3", "", data.label), slide, "/scaling/points/" + index + "/label");
    copy(el(group, "p", "", data.body), slide, "/scaling/points/" + index + "/body");
    return group;
  }
  function frame(content, slide) {
    var host = el(content, "div", "empty-prefix ep-" + slide.sasrecVisual);
    var body = el(host, "div", "ep-body");
    var note = stage(copy(el(host, "p", "ep-note", slide.scaling.note), slide, "/scaling/note"), 2);
    return { host: host, body: body, note: note };
  }
  function token(parent, value, first) {
    return el(parent, "span", "ep-token" + (first ? " ep-first" : ""), value);
  }
  function movieSequence(parent) {
    var kit = root.DiagramKit, example = root.CanonicalMoviePredictionExample;
    var movies = example.history.concat(example.recommendations.slice(0, 1));
    var row = el(parent, "div", "ep-sequence");
    el(row, "p", "ep-sequence-label", "Illustrative sequence");
    var draw = root.SVG().addTo(row).size(490, 120).viewbox(0, 0, 490, 120);
    draw.addClass("ep-sequence-posters").attr({
      role: "img", "aria-label": "Illustrative training sequence: Babe → Jumanji → Toy Story → Toy Story 2"
    });
    movies.forEach(function (movie, index) {
      var x = 8 + index * 126;
      kit.poster(draw, movie.title, x, 8, {
        width: 56, height: 84, movieId: movie.id, fontSize: 14, captionWidth: 100
      });
      if (index < movies.length - 1) kit.flowArrow(draw, x + 79, 50, 28, { color: kit.colors.muted });
    });
  }
  function supervisionTable(parent, start, weights, emptyPrefix) {
    var table = el(parent, "table", "ep-supervision");
    table.setAttribute("aria-label", (emptyPrefix ? "Supervised empty history" : start + " input") + ", next-item targets, and loss weights");
    var focusColumn = emptyPrefix ? 4 : 1;
    var rows = [
      emptyPrefix ? ["Input", "PAD", "PAD", "PAD", "PAD"] : ["Input", start, "Babe", "Jumanji", "Toy Story"],
      emptyPrefix ? ["Target", "—", "—", "—", "Babe"] : ["Target", "Babe", "Jumanji", "Toy Story", "Toy Story 2"],
      ["Loss weight"].concat(weights)
    ];
    rows.forEach(function (values, rowIndex) {
      var tr = el(table, "tr");
      values.forEach(function (value, index) {
        var cell = el(tr, index ? "td" : "th", index === focusColumn ? "ep-first-column" : "", value);
        if (!index) cell.setAttribute("scope", "row");
        if (rowIndex === 2 && index === focusColumn) cell.classList.add(value === "0" ? "ep-zero" : "ep-active");
      });
    });
  }
  function training(content, slide) {
    var layout = frame(content, slide);
    movieSequence(layout.body);
    var comparisons = el(layout.body, "div", "ep-comparisons");
    var current = stage(el(comparisons, "section", "ep-recipe"), 0);
    point(current, slide, 0);
    supervisionTable(current, "PAD", ["0", "1", "1", "1"]);
    var supervised = stage(el(comparisons, "section", "ep-recipe"), 1);
    point(supervised, slide, 1);
    supervisionTable(supervised, "PAD", ["0", "0", "0", "1"], true);
    var conclusion = stage(el(layout.body, "div", "ep-conclusion"), 2);
    el(conclusion, "div", "ep-context-flow", "Shared PAD state → first-item targets → shared ranking");
    point(conclusion, slide, 2);
  }
  function counts() {
    return ["A", "B", "C", "D"].map(function (item) {
      return { item: item,
        first: sequences.filter(function (row) { return row[0] === item; }).length,
        all: sequences.reduce(function (sum, row) { return sum + row.filter(function (v) { return v === item; }).length; }, 0)
      };
    });
  }
  function prior(content, slide) {
    var layout = frame(content, slide);
    var example = el(layout.body, "div", "ep-frequency-layout");
    var histories = el(example, "section", "ep-histories");
    el(histories, "h3", "ep-label", "Six illustrative training sequences");
    sequences.forEach(function (sequence, index) {
      var row = el(histories, "div", "ep-history-row");
      el(row, "span", "ep-user", "u" + (index + 1)); token(row, "START", false);
      sequence.forEach(function (item, i) {
        el(row, "span", "ep-arrow", "→"); token(row, item, !i);
      });
    });
    var chart = stage(el(example, "section", "ep-count-chart"), 1);
    el(chart, "h3", "ep-label", "Counts in the same training set");
    var legend = el(chart, "div", "ep-legend");
    el(legend, "span", "ep-first-key", "First items");
    stage(el(legend, "span", "ep-all-key", "All events"), 2);
    counts().forEach(function (data) {
      var row = el(chart, "div", "ep-count-row");
      el(row, "strong", "", data.item);
      var tracks = el(row, "div", "ep-tracks");
      ["first", "all"].forEach(function (kind) {
        var track = stage(el(tracks, "div", "ep-bar-track"), kind === "all" ? 2 : 1);
        track.setAttribute("aria-label", data.item + ": " + data[kind] + " " + (kind === "first" ? "first items" : "events"));
        var bar = el(track, "span", "ep-bar ep-bar-" + kind);
        bar.style.width = (data[kind] / 6 * 100) + "%";
        el(track, "span", "ep-bar-value", data[kind]);
      });
    });
    var explanation = stage(el(layout.body, "div", "ep-prior-summary"), 1);
    copy(el(explanation, "div", "ep-equation", slide.scaling.formula), slide, "/scaling/formula");
    el(explanation, "div", "ep-probabilities", "A: ½    B: ⅓    C: ⅙    D: 0");
    var points = el(layout.body, "div", "ep-prior-points");
    point(points, slide, 0); point(points, slide, 1);
  }
  function checkpoint(content, slide) {
    var layout = frame(content, slide);
    var table = el(layout.body, "table", "ep-overlap");
    table.setAttribute("aria-label", "Empty-history top-20 overlap with training popularity");
    var headings = el(el(table, "thead"), "tr");
    slide.scaling.columns.forEach(function (label, index) {
      var heading = copy(el(headings, "th", "", label), slide, "/scaling/columns/" + index);
      heading.setAttribute("scope", "col");
    });
    var body = el(table, "tbody");
    slide.scaling.rows.forEach(function (data, index) {
      var row = stage(el(body, "tr"), data.step);
      ["label", "first", "all"].forEach(function (key, column) {
        var cell = copy(el(row, column ? "td" : "th", "", data[key]),
          slide, "/scaling/rows/" + index + "/" + key);
        if (!column) cell.setAttribute("scope", "row");
      });
    });
    point(layout.body, slide, 0);
  }
  root.EmptyPrefixExample = { counts: counts };
  root.SASRecVisualParts = root.SASRecVisualParts || {};
  root.SASRecVisualParts["empty-prefix-training"] = training;
  root.SASRecVisualParts["empty-prefix-prior"] = prior;
  root.SASRecVisualParts["empty-prefix-checkpoint"] = checkpoint;
})(globalThis);
