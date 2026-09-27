(function (root) {
  "use strict";

  function rank(items, query) {
    return items.map(function (item) {
      return { item: item, score: query.x * item.x + query.y * item.y };
    }).sort(function (a, b) { return b.score - a.score || a.item.id - b.item.id; });
  }

  function mount(host, p) {
    var items = p.data.schematicItems, initial = p.data.defaultQuery;
    var query = { x: initial.x, y: initial.y }, dragging = false;
    var controls = p.el(host, "div", "interest-controls");
    p.copy(controls, "span", "", "dragHint");
    var reset = p.copy(controls, "button", "interest-reset", "resetLabel");
    reset.type = "button";
    var svg = p.canvas(host, 500, 220);
    svg.classList.add("interest-space");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Movie covers in a schematic embedding space, with draggable query h. Amber frames and rank badges identify the five highest dot-product scores.");
    svg.removeAttribute("aria-hidden");
    var x = function (v) { return 250 + 180 * v; };
    var y = function (v) { return 200 - 110 * v; };
    var defs = p.k.node("defs", {}, svg);
    var marker = p.k.node("marker", { id: "interest-query-arrow", viewBox: "0 0 10 10",
      refX: 9, refY: 5, markerWidth: 5, markerHeight: 5, orient: "auto" }, defs);
    p.k.node("path", { d: "M0 0 L10 5 L0 10 Z", "class": "interest-query-arrow" }, marker);
    [36, 118, 200].forEach(function (value) {
      p.k.node("line", { x1: 38, y1: value, x2: 462, y2: value, "class": "interest-grid" }, svg);
    });
    [70, 250, 430].forEach(function (value) {
      p.k.node("line", { x1: value, y1: 36, x2: value, y2: 200, "class": "interest-grid" }, svg);
    });
    [
      { group: "scifi", cx: 128, cy: 122, rx: 100, ry: 55 },
      { group: "family", cx: 400, cy: 151, rx: 65, ry: 68 },
      { group: "other", cx: 259, cy: 52, rx: 110, ry: 37 }
    ].forEach(function (area) {
      p.k.node("ellipse", { cx: area.cx, cy: area.cy, rx: area.rx, ry: area.ry,
        "class": "interest-cluster interest-" + area.group }, svg);
    });
    var marks = items.map(function (item) {
      return movieCover(svg, item, x(item.x), y(item.y), p);
    });
    var line = p.k.node("line", { x1: x(0), y1: y(0), x2: x(query.x), y2: y(query.y),
      "class": "interest-query-vector", "marker-end": "url(#interest-query-arrow)" }, svg);
    p.k.node("circle", { cx: x(0), cy: y(0), r: 3, "class": "interest-origin" }, svg);
    p.svgCopy(svg, 250, 218, "scoreRule", "interest-score-rule");
    var handle = p.k.node("g", { "class": "interest-query-handle", role: "button", tabindex: 0 }, svg);
    p.k.node("circle", { r: 18, "class": "interest-query-hit" }, handle);
    p.k.node("circle", { r: 10, "class": "interest-query-tip" }, handle);
    p.k.node("text", { x: 17, y: 7, "class": "interest-query-label" }, handle, "h");
    p.copy(host, "p", "interest-caption", "schematicCaption");
    var ranks = p.el(host, "ol", "interest-ranking");
    ranks.setAttribute("aria-label", "Top five by dot-product score");
    var observation = p.el(host, "p", "interest-observation");
    observation.setAttribute("aria-live", "polite");

    function update() {
      var top = rank(items, query).slice(0, 5), positions = {}, counts = { family: 0, scifi: 0, other: 0 };
      top.forEach(function (result, index) { positions[result.item.id] = index + 1; counts[result.item.group]++; });
      marks.forEach(function (mark) {
        var position = positions[mark.item.id];
        mark.frame.setAttribute("class", "interest-film-frame" + (position ? " interest-selected" : ""));
        mark.plate.setAttribute("visibility", position ? "visible" : "hidden");
        mark.badge.textContent = position || "";
        mark.group.dataset.rank = position || "";
        mark.title.textContent = mark.item.title + " · h · item = " +
          (query.x * mark.item.x + query.y * mark.item.y).toFixed(3) + (position ? " · Rank " + position : "");
      });
      var dx = x(query.x) - x(0), dy = y(query.y) - y(0);
      var length = Math.hypot(dx, dy), gap = Math.min(13, length * .35);
      line.setAttribute("x2", x(query.x) - (length ? gap * dx / length : 0));
      line.setAttribute("y2", y(query.y) - (length ? gap * dy / length : 0));
      handle.setAttribute("transform", "translate(" + x(query.x) + " " + y(query.y) + ")");
      handle.setAttribute("aria-label", "Query h. Drag or use arrow keys; Home or Enter resets. Current coordinates " + query.x.toFixed(2) + ", " + query.y.toFixed(2));
      svg.dataset.queryX = query.x; svg.dataset.queryY = query.y;
      svg.dataset.topFive = top.map(function (result) { return result.item.id; }).join(",");
      ranks.replaceChildren();
      top.forEach(function (result, index) {
        p.el(ranks, "li", "interest-" + result.item.group, (index + 1) + ". " + result.item.title);
      });
      var isInitial = Math.abs(query.x - initial.x) + Math.abs(query.y - initial.y) < .000001;
      var key = isInitial ? "defaultObservation" : counts.family >= 3 ? "familyObservation" :
        counts.scifi >= 3 ? "scifiObservation" : counts.family && counts.scifi ? "mixedObservation" : "compromiseObservation";
      observation.textContent = p.data[key];
    }

    function move(xValue, yValue) {
      query.x = Math.max(-1.12, Math.min(1.12, xValue));
      query.y = Math.max(0, Math.min(1.4, yValue));
      update();
    }
    function resetQuery() { query.x = initial.x; query.y = initial.y; update(); }
    reset.addEventListener("click", resetQuery);
    handle.addEventListener("pointerdown", function (event) {
      dragging = true; handle.focus(); svg.setPointerCapture(event.pointerId);
      handle.classList.add("is-dragging"); event.preventDefault();
    });
    svg.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
      var local = point.matrixTransform(svg.getScreenCTM().inverse());
      move((local.x - 250) / 180, (200 - local.y) / 110);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (name) {
      svg.addEventListener(name, function (event) {
        dragging = false; handle.classList.remove("is-dragging");
        if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
      });
    });
    handle.addEventListener("keydown", function (event) {
      var step = event.shiftKey ? .2 : .08, dx = 0, dy = 0;
      if (event.key === "Home" || event.key === "Enter" || event.key === " ") resetQuery();
      else if (event.key === "ArrowLeft") dx = -step;
      else if (event.key === "ArrowRight") dx = step;
      else if (event.key === "ArrowUp") dy = step;
      else if (event.key === "ArrowDown") dy = -step;
      else return;
      event.preventDefault(); event.stopPropagation();
      if (dx || dy) move(query.x + dx, query.y + dy);
    });
    update();
  }

  function movieCover(svg, item, cx, cy, p) {
    var x = cx - 19, y = cy - 28.5;
    var group = p.k.node("g", { "data-movie-id": item.id, "class": "interest-film-mark interest-" + item.group }, svg);
    var title = p.k.node("title", {}, group, item.title);
    p.k.node("rect", { x: x, y: y, width: 38, height: 57, "class": "interest-film-fallback" }, group);
    p.k.node("text", { x: cx, y: y + 17, "text-anchor": "middle", "class": "interest-film-symbol" }, group, "▣");
    item.title.split(" ").slice(0, 4).forEach(function (word, index) {
      p.k.node("text", { x: cx, y: y + 26 + index * 7, "text-anchor": "middle", "class": "interest-film-fallback-title" }, group, word);
    });
    var url = root.GSASRecPosterAssets && root.GSASRecPosterAssets.urlForOriginalId(item.id);
    if (url) {
      var image = p.k.node("image", { x: x, y: y, width: 38, height: 57, href: url,
        preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true" }, group);
      image.addEventListener("error", function () { image.style.display = "none"; });
    }
    var frame = p.k.node("rect", { x: x, y: y, width: 38, height: 57, "class": "interest-film-frame" }, group);
    var plate = p.k.node("rect", { x: x, y: y, width: 14, height: 15, "class": "interest-film-rank-plate" }, group);
    var badge = p.k.node("text", { x: x + 7, y: y + 12,
      "text-anchor": "middle", "class": "interest-rank-badge" }, group);
    return { item: item, group: group, frame: frame, plate: plate, badge: badge, title: title };
  }
  root.MultipleInterestPlot = { mount: mount, rank: rank };
})(window);
