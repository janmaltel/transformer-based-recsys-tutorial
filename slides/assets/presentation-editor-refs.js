(function (root) {
  "use strict";

  function slideId(slide) {
    return typeof slide === "string" ? slide : slide && slide.id;
  }

  function sourceFor(slide) {
    var id = slideId(slide);
    return id ? "presentation/slides/" + id + ".js" : "";
  }

  function referenceFor(slide, pointer) {
    var id = slideId(slide);
    return id && pointer ? "slide:" + id + "#" + pointer : "";
  }

  function nodeIdForReference(reference) {
    return "copy." + reference.replace(/[^a-zA-Z0-9._:-]+/g, ".").replace(/\.+$/g, "");
  }

  function decodeSegment(value) {
    return value.replace(/~1/g, "/").replace(/~0/g, "~");
  }

  function valueAt(source, pointer) {
    if (!source || !pointer || pointer.charAt(0) !== "/") return undefined;
    return pointer.slice(1).split("/").reduce(function (value, segment) {
      if (value == null) return undefined;
      return value[decodeSegment(segment)];
    }, source);
  }

  function kindFor(value) {
    return typeof value === "string" && /\\\([\s\S]*\\\)|\\\[[\s\S]*\\\]/.test(value)
      ? "tex"
      : "text";
  }

  function slideRoot(node, slide) {
    var id = slideId(slide);
    if (!node || !id) return node;
    node.setAttribute("data-author-slide", id);
    node.setAttribute("data-author-source", sourceFor(slide));
    return node;
  }

  function annotate(node, slide, pointer, options) {
    options = options || {};
    var id = slideId(slide);
    var reference = referenceFor(slide, pointer);
    if (!node || !id || !reference) return node;

    var value = options.value;
    if (value === undefined && typeof slide === "object") value = valueAt(slide, pointer);
    var kind = options.kind || kindFor(value);
    if (kind !== "tex") kind = "text";

    node.setAttribute("data-author-slide", id);
    node.setAttribute("data-author-pointer", pointer);
    node.setAttribute("data-author-ref", reference);
    node.setAttribute("data-author-source", sourceFor(slide));
    node.setAttribute("data-author-kind", kind);
    node.setAttribute("data-author-node", nodeIdForReference(reference));
    if (value !== undefined && value !== null) {
      node.setAttribute("data-author-value", String(value));
    }
    return node;
  }

  root.PresentationEditorRefs = Object.freeze({
    annotate: annotate,
    kindFor: kindFor,
    refFor: referenceFor,
    slideRoot: slideRoot,
    sourceFor: sourceFor,
    valueAt: valueAt
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
