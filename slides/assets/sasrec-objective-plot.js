(function (root) {
  "use strict";
  var ns = "http://www.w3.org/2000/svg", nextGradientId = 1;
  function svgNode(parent, tag, attrs, text) {
    var el = document.createElementNS(ns, tag);
    Object.keys(attrs || {}).forEach(function (name) { el.setAttribute(name, attrs[name]); });
    if (text) el.textContent = text;
    parent.appendChild(el); return el;
  }
  function create(parent, onChange, onHighlight, heatmapLegend) {
    var space = root.SASRecObjectiveSpace;
    var position = space.initial.slice(), dragging = null;
    var vectors = space.items.map(function (item) { return item.vector.slice(); });
    var svg = svgNode(parent, "svg", { viewBox: "0 0 760 490", class: "objective-embedding-plot", "aria-label": "Toy 2D embedding space, centered origin, movable movie embeddings and sequence representation" });
    svgNode(svg, "title", {}, "Drag the blue sequence representation, movie points or posters");
    var heatmap = root.SASRecObjectiveHeatmap.create(svg, heatmapLegend);
    var origin = space.toPlot([0, 0]);
    for (var tick = -3; tick <= 3; tick++) {
      var p = space.toPlot([tick, tick]);
      if (tick !== 0) {
        svgNode(svg, "text", { x: p[0], y: origin[1] + 20, "text-anchor": "middle", class: "objective-axis-label" }, String(tick));
        if (Math.abs(tick) <= 2) svgNode(svg, "text", { x: origin[0] - 12, y: p[1] + 5, "text-anchor": "end", class: "objective-axis-label" }, String(tick));
      }
    }
    svgNode(svg, "path", { d: "M40 245H727 M380 14V475", class: "objective-axes" });
    svgNode(svg, "circle", { cx: origin[0], cy: origin[1], r: 3, class: "objective-origin" });
    svgNode(svg, "text", { x: origin[0] - 14, y: origin[1] + 20, class: "objective-axis-label" }, "0");
    svgNode(svg, "text", { x: 737, y: origin[1] + 6, class: "objective-axis-label" }, "x");
    svgNode(svg, "text", { x: origin[0] + 11, y: 24, class: "objective-axis-label" }, "y");
    var itemViews = space.items.map(function (item, index) {
      var group = svgNode(svg, "g", { class: "sasrec-stage objective-item-handle " + item.sign,
        "data-build-step": item.step, tabindex: 0, role: "button" });
      var ray = svgNode(group, "line", { x1: origin[0], y1: origin[1], class: "objective-item-ray" });
      var point = svgNode(group, "g");
      svgNode(point, "circle", { r: 20, class: "objective-item-hit" });
      svgNode(point, "circle", { r: 8, class: "objective-item-point" });
      svgNode(point, "text", { y: 5, "text-anchor": "middle", class: "objective-item-sign" }, index === 0 ? "+" : "−");
      var link = svgNode(group, "line", { class: "objective-poster-link" });
      var posterGroup = svgNode(group, "g");
      svgNode(posterGroup, "rect", { width: 80, height: 120, class: "objective-poster-fallback" });
      svgNode(posterGroup, "text", { x: 40, y: 67, "text-anchor": "middle",
        class: "objective-poster-fallback-label" }, index === 0 ? "+" : "−");
      var posterUrl = root.GSASRecPosterAssets && root.GSASRecPosterAssets.urlForOriginalId(item.id);
      if (posterUrl) {
        var poster = svgNode(posterGroup, "image", { width: 80, height: 120,
          href: posterUrl, preserveAspectRatio: "xMidYMid slice", class: "objective-item-poster" });
        poster.addEventListener("error", function () { poster.style.display = "none"; });
      }
      svgNode(posterGroup, "text", { y: -14, class: "objective-item-role" },
        item.sign === "positive" ? "Positive" : "Negative");
      svgNode(posterGroup, "text", { y: 145, class: "objective-item-name" }, item.title);
      group.addEventListener("pointerenter", function () { onHighlight(item.sign); });
      group.addEventListener("pointerleave", function () { onHighlight(null); });
      group.addEventListener("focusin", function () { onHighlight(item.sign); });
      group.addEventListener("focusout", function () { onHighlight(null); });
      function setItemPosition(next) {
        vectors[index] = space.clamp(next);
        var p = space.toPlot(vectors[index]);
        point.setAttribute("transform", "translate(" + p.join(" ") + ")");
        ray.setAttribute("x2", p[0]); ray.setAttribute("y2", p[1]);
        // Keep the poster and its labels inside the plot at the drag boundaries.
        var posterX = Math.max(20, Math.min(620, item.sign === "positive" ? p[0] + 22 : p[0] - 110));
        var posterY = Math.max(40, Math.min(330, p[1] - 60));
        posterGroup.setAttribute("transform", "translate(" + posterX + " " + posterY + ")");
        link.setAttribute("x1", p[0]); link.setAttribute("y1", p[1]);
        link.setAttribute("x2", p[0] < posterX ? posterX : posterX + 80);
        link.setAttribute("y2", posterY + 60);
        group.setAttribute("aria-label", item.title + ", " + item.sign + " embedding at x " +
          vectors[index][0].toFixed(2) + ", y " + vectors[index][1].toFixed(2) +
          ". Drag or use arrow keys; Home restores its starting position.");
        onChange(position.slice(), vectors);
      }
      bindDrag(group, function () { return vectors[index]; }, setItemPosition, item.vector);
      return { setPosition: setItemPosition };
    });
    var defs = svgNode(svg, "defs");
    var markerId = "objective-gradient-" + nextGradientId++;
    var marker = svgNode(defs, "marker", { id: markerId, viewBox: "0 0 10 10", refX: 9, refY: 5,
      markerWidth: 10, markerHeight: 10, orient: "auto", markerUnits: "userSpaceOnUse" });
    svgNode(marker, "path", { d: "M0 0L10 5L0 10Z", class: "objective-gradient-head" });
    var gradientGroup = svgNode(svg, "g", { class: "sasrec-stage objective-gradient-arrow", "data-build-step": 2 });
    var gradientLine = svgNode(gradientGroup, "line", { class: "objective-descent-line", "marker-end": "url(#" + markerId + ")" });
    var gradientTitle = svgNode(gradientGroup, "title");
    var itemArrows = space.items.map(function (item) {
      var itemMarkerId = "objective-item-gradient-" + nextGradientId++;
      var itemMarker = svgNode(defs, "marker", { id: itemMarkerId, viewBox: "0 0 10 10", refX: 9, refY: 5,
        markerWidth: 9, markerHeight: 9, orient: "auto", markerUnits: "userSpaceOnUse" });
      svgNode(itemMarker, "path", { d: "M0 0L10 5L0 10Z", class: "objective-item-gradient-head " + item.sign });
      var group = svgNode(svg, "g", { class: "sasrec-stage objective-item-gradient " + item.sign,
        "data-build-step": 2 });
      svg.insertBefore(group, svg.querySelector(".objective-item-handle"));
      return { group: group, line: svgNode(group, "line", { class: "objective-item-descent-line",
        "marker-end": "url(#" + itemMarkerId + ")" }), title: svgNode(group, "title") };
    });
    function setGradient(gradient, visible, itemGradients) {
      var start = space.toPlot(position);
      // Fixed display factor: arrow length preserves relative gradient magnitudes.
      var end = space.toPlot(position.map(function (v, axis) { return v - .8 * gradient[axis]; }));
      gradientGroup.style.display = visible ? "" : "none";
      gradientLine.setAttribute("x1", start[0]); gradientLine.setAttribute("y1", start[1]);
      gradientLine.setAttribute("x2", end[0]); gradientLine.setAttribute("y2", end[1]);
      itemArrows.forEach(function (arrow, index) {
        arrow.group.style.display = visible && itemGradients ? "" : "none";
        if (!itemGradients) return;
        var item = space.items[index], g = itemGradients[index];
        if (Math.hypot(g[0], g[1]) < 1e-12) { arrow.group.style.display = "none"; return; }
        var from = space.toPlot(vectors[index]), to = space.toPlot(vectors[index].map(function (v, axis) { return v - .8 * g[axis]; }));
        arrow.line.setAttribute("x1", from[0]); arrow.line.setAttribute("y1", from[1]);
        arrow.line.setAttribute("x2", to[0]); arrow.line.setAttribute("y2", to[1]);
        arrow.title.textContent = item.title + " embedding gradient: (" + g.map(function (v) { return v.toFixed(3); }).join(", ") + "); arrow is the negative gradient, scale 0.8";
      });
      gradientTitle.textContent = "Negative loss gradient; fixed arrow scale 0.8. Gradient: (" + gradient.join(", ") + ")";
    }
    var handle = svgNode(svg, "g", { tabindex: 0, role: "button", class: "objective-query-handle", "aria-label": "Move sequence representation: drag or use arrow keys; Home returns to the origin" });
    svgNode(handle, "circle", { r: 20, class: "objective-query-hit" });
    svgNode(handle, "circle", { r: 10, class: "objective-query-point" });
    var label = svgNode(handle, "text", { x: 16, y: 26, class: "objective-query-label" }, "hₜ");
    function setPosition(next) {
      position = space.clamp(next);
      var p = space.toPlot(position);
      handle.setAttribute("transform", "translate(" + p.join(" ") + ")");
      label.setAttribute("x", p[0] > 690 ? -18 : 16);
      label.setAttribute("text-anchor", p[0] > 690 ? "end" : "start");
      label.setAttribute("y", p[1] > 450 ? -14 : 26);
      handle.setAttribute("aria-label", "Sequence representation at x " + position[0].toFixed(2) + ", y " + position[1].toFixed(2) + ". Drag or use arrow keys; Home returns to the origin.");
      onChange(position.slice(), vectors);
    }
    function pointerPosition(event) {
      var matrix = svg.getScreenCTM();
      if (!matrix) return null;
      var point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
      point = point.matrixTransform(matrix.inverse());
      return [point.x, point.y];
    }
    function bindDrag(target, getPosition, setPoint, home) {
      var startPointer, startPosition;
      target.addEventListener("pointerdown", function (event) {
        if (event.button !== 0 || dragging !== null || event.isPrimary === false) return;
        startPointer = pointerPosition(event);
        if (!startPointer) return;
        startPosition = space.toPlot(getPosition());
        event.preventDefault(); target.focus(); dragging = event.pointerId;
        target.setPointerCapture(dragging);
      });
      target.addEventListener("pointermove", function (event) {
        if (event.pointerId !== dragging || !startPointer) return;
        var pointer = pointerPosition(event);
        if (pointer) setPoint(space.fromPlot(pointer.map(function (v, axis) {
          return startPosition[axis] + v - startPointer[axis];
        })));
      });
      function stop(event) {
        if (event.pointerId === dragging && startPointer) {
          dragging = null; startPointer = null;
          if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
        }
      }
      target.addEventListener("pointerup", stop);
      target.addEventListener("pointercancel", stop);
      target.addEventListener("lostpointercapture", stop);
      target.addEventListener("keydown", function (event) {
        var changes = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
        if (!changes[event.key] && event.key !== "Home") return;
        event.preventDefault(); event.stopPropagation();
        var delta = changes[event.key], step = event.shiftKey ? .25 : .05, current = getPosition();
        setPoint(event.key === "Home" ? home : [current[0] + delta[0] * step, current[1] + delta[1] * step]);
      });
    }
    bindDrag(handle, function () { return position; }, setPosition, [0, 0]);
    function reset() {
      itemViews.forEach(function (view, index) { view.setPosition(space.items[index].vector); });
      setPosition(space.initial);
    }
    reset();
    return { setPosition: setPosition, setGradient: setGradient, reset: reset,
      setHeatmap: function (mode, visible) { heatmap.update(vectors, mode, visible); } };
  }
  root.SASRecObjectivePlot = { create: create };
})(typeof globalThis !== "undefined" ? globalThis : window);
