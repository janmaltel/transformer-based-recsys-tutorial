(function (root) {
  "use strict";

  var config = normalize(root.PresentationElementOverrides);

  function normalize(value) {
    var hidden = {};
    var source = value && value.hidden && typeof value.hidden === "object"
      ? value.hidden
      : {};
    Object.keys(source).forEach(function (slideId) {
      if (!Array.isArray(source[slideId])) return;
      hidden[slideId] = source[slideId].filter(function (nodeId, index, list) {
        return typeof nodeId === "string" && list.indexOf(nodeId) === index;
      });
    });
    return { version: 1, hidden: hidden };
  }

  function listFor(slideId) {
    return config.hidden[slideId] || [];
  }

  function isHidden(slideId, nodeId) {
    return listFor(slideId).indexOf(nodeId) >= 0;
  }

  function setNodeState(node, hidden) {
    node.toggleAttribute("hidden", hidden);
    if (hidden) node.dataset.presentationHidden = "true";
    else delete node.dataset.presentationHidden;
  }

  function prepare(scope) {
    var rootNode = scope || document;
    Array.prototype.forEach.call(rootNode.querySelectorAll(".slide"), function (slide) {
      var occurrences = {};
      Array.prototype.forEach.call(slide.querySelectorAll("[data-author-node]"), function (node) {
        var base = node.dataset.authorNodeBase || node.dataset.authorNode;
        node.dataset.authorNodeBase = base;
        occurrences[base] = (occurrences[base] || 0) + 1;
        node.dataset.authorNode = occurrences[base] === 1
          ? base
          : base + ".occurrence-" + occurrences[base];
      });
    });
  }

  function apply(scope) {
    var rootNode = scope || document;
    prepare(rootNode);
    Array.prototype.forEach.call(rootNode.querySelectorAll("[data-author-node]"), function (node) {
      var slide = node.closest(".slide");
      if (!slide) return;
      setNodeState(node, isHidden(slide.id, node.dataset.authorNode));
    });
  }

  function update(slideId, nodeId, hidden) {
    var values = listFor(slideId).slice();
    var index = values.indexOf(nodeId);
    if (hidden && index < 0) values.push(nodeId);
    if (!hidden && index >= 0) values.splice(index, 1);
    if (values.length) config.hidden[slideId] = values;
    else delete config.hidden[slideId];
    apply(document);
  }

  function replace(value) {
    config = normalize(value);
    root.PresentationElementOverrides = config;
    apply(document);
  }

  root.PresentationElementOverrides = config;
  root.PresentationElementOverridesRuntime = Object.freeze({
    apply: apply,
    hide: function (slideId, nodeId) { update(slideId, nodeId, true); },
    isHidden: isHidden,
    replace: replace,
    restore: function (slideId, nodeId) { update(slideId, nodeId, false); }
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
