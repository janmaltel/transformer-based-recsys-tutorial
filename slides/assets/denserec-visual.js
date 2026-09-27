(function (root) {
  "use strict";
  var k = root.DenseRecKit;
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  var example = root.CanonicalMoviePredictionExample;
  var vectors = [["b2", "a1", "n", "b3", "a1", "b1"],
    ["a1", "b3", "n", "a2", "b1", "b1"], ["b1", "n", "b3", "b1", "a2", "n"]];

  function coldStart(content, slide) {
    var frame = k.frame(content, slide), columns = k.el(frame.body, "div", "dr-cold-columns");
    var known = k.stage(k.el(columns, "section", "dr-known"), 0);
    k.point(known, slide, 0);
    var catalog = k.el(known, "div", "dr-known-catalog");
    example.history.forEach(function (movie, i) {
      var item = k.el(catalog, "div", "dr-known-item");
      k.poster(item, movie);
      k.vector(item, vectors[i], "Schematic ID embedding for " + movie.title);
      k.math(item, "E^{\\mathrm{ID}}[" + movie.id + "]");
    });
    var cold = k.stage(k.el(columns, "section", "dr-new-item"), 1);
    k.point(cold, slide, 1);
    var arrival = k.el(cold, "div", "dr-arrival");
    k.poster(arrival, example.recommendations[0]);
    var missing = k.el(arrival, "div", "dr-missing");
    k.math(missing, "E^{\\mathrm{ID}}[i_{\\mathrm{new}}]");
    k.el(missing, "span", "dr-missing-row", "unavailable");
    k.formula(cold, slide);
    k.vector(cold, ["a1", "b1", "b3", "n", "b2", "a2"], "Schematic content embedding for the unseen item");
    var gaps = k.stage(k.el(columns, "section", "dr-gaps"), 2);
    k.point(gaps, slide, 2);
    k.math(gaps, "s_j=h_t^{\\top}e_j");
    k.point(gaps, slide, 3);
    k.math(gaps, "h_t=f_{\\theta}(e_1,\\ldots,e_t)");
  }

  function contentChallenge(content, slide) {
    var frame = k.frame(content, slide), columns = k.el(frame.body, "div", "dr-two-columns");
    var id = k.stage(k.el(columns, "section", "dr-representation"), 0);
    k.point(id, slide, 0);
    var idFlow = k.el(id, "div", "dr-representation-flow");
    k.el(idFlow, "span", "dr-label", "Interaction sequences");
    var idChain = k.el(idFlow, "div", "dr-representation-chain");
    k.el(idChain, "strong", "dr-operation", "Next-item objective"); k.arrow(idChain);
    var idOutput = k.el(idChain, "div", "dr-representation-output");
    k.math(idOutput, "E^{\\mathrm{ID}}[i]\\in\\mathbb{R}^{d}");
    k.vector(idOutput, vectors[0], "Illustrative interaction-trained ID vector");
    var dense = k.stage(k.el(columns, "section", "dr-representation dr-content-representation"), 1);
    k.point(dense, slide, 1);
    var denseFlow = k.el(dense, "div", "dr-representation-flow");
    k.el(denseFlow, "span", "dr-label", "Item text or images");
    var denseChain = k.el(denseFlow, "div", "dr-representation-chain");
    k.el(denseChain, "strong", "dr-operation", "Content encoder"); k.arrow(denseChain);
    var denseOutput = k.el(denseChain, "div", "dr-representation-output");
    k.math(denseOutput, "c_i\\in\\mathbb{R}^{d_c}");
    k.vector(denseOutput, ["a1", "a2", "b3", "n", "a1", "b1", "b2", "n"], "Illustrative content vector in a different space");
    var bridge = k.stage(k.el(frame.body, "section", "dr-alignment"), 2);
    k.formula(bridge, slide); k.point(bridge, slide, 2);
  }

  function dualPath(content, slide) {
    var frame = k.frame(content, slide);
    var routes = k.el(frame.body, "div", "dr-paths");
    var id = k.stage(k.el(routes, "section", "dr-path dr-id-path"), 0);
    k.point(id, slide, 0);
    var idFlow = k.el(id, "div", "dr-path-flow");
    k.math(idFlow, "i"); k.arrow(idFlow);
    k.el(idFlow, "strong", "dr-operation", "ID lookup"); k.arrow(idFlow);
    k.math(idFlow, "E^{\\mathrm{ID}}[i]");
    var dense = k.stage(k.el(routes, "section", "dr-path dr-content-path"), 1);
    k.point(dense, slide, 1);
    var denseFlow = k.el(dense, "div", "dr-path-flow");
    k.math(denseFlow, "c_i"); k.arrow(denseFlow);
    k.el(denseFlow, "strong", "dr-operation", "Learned projection"); k.arrow(denseFlow);
    k.math(denseFlow, "P(c_i)");
    k.formula(dense, slide);
    var shared = k.stage(k.el(frame.body, "section", "dr-shared-encoder"), 2);
    k.point(shared, slide, 2);
    var flow = k.el(shared, "div", "dr-encoder-flow");
    k.math(flow, "e_i\\in\\{E^{\\mathrm{ID}}[i],P(c_i)\\}"); k.arrow(flow);
    k.el(flow, "strong", "dr-operation", "SASRec encoder"); k.arrow(flow);
    k.math(flow, "h_t\\in\\mathbb{R}^{d}");
  }
  parts["item-cold-start"] = coldStart;
  parts["content-embedding-challenge"] = contentChallenge;
  parts["denserec-dual-path"] = dualPath;
})(globalThis);
