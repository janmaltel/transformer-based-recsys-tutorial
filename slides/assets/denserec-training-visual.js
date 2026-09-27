(function (root) {
  "use strict";
  var k = root.DenseRecKit;
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};

  function routing(content, slide) {
    var frame = k.frame(content, slide);
    var spectrum = k.el(frame.body, "div", "dr-routing-spectrum");
    [[0, [false, false, false, false, false]],
      [0.5, [false, true, false, true, true]],
      [1, [true, true, true, true, true]]].forEach(function (state, i) {
      var column = k.stage(k.el(spectrum, "section", "dr-routing-state"), i);
      k.math(column, "p_{\\mathrm{dense}}=" + state[0], "dr-probability");
      k.point(column, slide, i);
      k.tokens(column, state[1]);
    });
    var rule = k.stage(k.el(frame.body, "div", "dr-routing-rule"), 1);
    k.formula(rule, slide);
  }

  function sequenceLane(parent, title, pattern, labels, target) {
    var lane = k.el(parent, "div", "dr-sequence-lane");
    k.el(lane, "span", "dr-label", title);
    var flow = k.el(lane, "div", "dr-mini-flow");
    k.tokens(flow, pattern, labels);
    k.arrow(flow);
    k.math(flow, target);
  }

  function trainingServing(content, slide) {
    var frame = k.frame(content, slide);
    var columns = k.el(frame.body, "div", "dr-two-columns dr-lifecycle");
    var train = k.stage(k.el(columns, "section", "dr-training"), 0);
    k.point(train, slide, 0);
    sequenceLane(train, "History · then SASRec", [false, true, false], ["i₁", "i₂", "i₃"], "h_t");
    sequenceLane(train, "Output items · positive / negatives", [true, false, true], ["+", "−", "−"], "e_j");
    var serve = k.stage(k.el(columns, "section", "dr-serving"), 1);
    k.point(serve, slide, 1);
    var routes = k.el(serve, "div", "dr-serving-routes");
    [["Known", "E^{\\mathrm{ID}}[i]"], ["Cold", "P(c_i)"]].forEach(function (row) {
      var line = k.el(routes, "div", "dr-serving-route");
      k.el(line, "span", "dr-label", row[0]); k.arrow(line); k.math(line, row[1]);
    });
    var use = k.el(serve, "div", "dr-serving-use");
    k.el(use, "span", "", "History vectors → SASRec → query");
    k.el(use, "span", "", "Candidate vectors → retrieval index");
    var score = k.el(frame.body, "div", "dr-scoring-rule");
    k.formula(score, slide);
  }

  function evidence(content, slide) {
    var frame = k.frame(content, slide);
    var layout = k.el(frame.body, "div", "dr-evidence-layout");
    var results = k.stage(k.el(layout, "section", "dr-results"), 0);
    var table = k.el(results, "table", "dr-results-table");
    k.el(table, "caption", "dr-label", "Paper-reported HR@100 (%)");
    var header = k.el(k.el(table, "thead"), "tr");
    slide.scaling.table.headings.forEach(function (text, i) {
      var cell = k.copy(header, "th", "", slide, "/scaling/table/headings/" + i, text);
      cell.scope = "col";
    });
    var body = k.el(table, "tbody");
    slide.scaling.table.rows.forEach(function (row, r) {
      var line = k.el(body, "tr");
      row.forEach(function (text, c) {
        var cell = k.copy(line, c ? "td" : "th", "", slide, "/scaling/table/rows/" + r + "/" + c, text);
        if (!c) cell.scope = "row";
      });
    });
    k.formula(results, slide);
    var reading = k.el(layout, "div", "dr-evidence-reading");
    k.point(reading, slide, 0);
    k.stage(k.point(reading, slide, 1, "dr-cold-hit-share"), 1);
  }
  parts["denserec-pdense"] = routing;
  parts["denserec-training-serving"] = trainingServing;
  parts["denserec-evidence"] = evidence;
})(globalThis);
