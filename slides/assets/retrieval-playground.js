(function (root) {
  "use strict";
  var kit = root.DiagramKit;
  var items = [
    { key: "A", id: 1, x: 0.91, y: 0.14 },
    { key: "B", id: 2, x: 0.55, y: 0.81 },
    { key: "C", id: 34, x: -0.28, y: 0.94 },
    { key: "D", id: 45, x: -0.88, y: 0.43 },
    { key: "E", id: 65, x: -0.90, y: -0.20 },
    { key: "F", id: 71, x: -0.40, y: -0.88 },
    { key: "G", id: 94, x: 0.45, y: -0.82 },
    { key: "H", id: 108, x: 0.88, y: -0.42 }
  ];
  var origin = { x: 560, y: 220 }, scale = { x: 175, y: 150 };

  function text(draw, value, x, y, options) {
    return kit.text(draw, value, x, y, options || {});
  }
  function mount(canvas) {
    var draw = canvas.draw, svg = draw.node;
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Schematic two-dimensional movie-item embedding space with a movable sequence query.");
    var k = 2, query = { x: 0.15, y: -0.10 };
    var field = draw.group().addClass("retrieval-space-field");
    field.rect(670, 370).move(225, 35).fill("#fbfaf6").stroke({ color: "#d8dedb", width: 1 });
    for (var gx = 275; gx <= 845; gx += 50) {
      field.line(gx, 36, gx, 404).stroke({ color: "#e8ebe7", width: 1 });
    }
    for (var gy = 70; gy <= 370; gy += 50) {
      field.line(226, gy, 894, gy).stroke({ color: "#e8ebe7", width: 1 });
    }
    field.line(226, origin.y, 894, origin.y).stroke({ color: "#aab5b1", width: 1.2 });
    field.line(origin.x, 36, origin.x, 404).stroke({ color: "#aab5b1", width: 1.2 });
    text(draw, "e₁", 900, origin.y - 6, { size: 12, weight: 650, color: "#63716e" });
    text(draw, "e₂", origin.x + 8, 44, { size: 12, weight: 650, color: "#63716e" });
    text(draw, "SCHEMATIC 2D VIEW", 242, 58, {
      size: 10, weight: 650, color: "#6f7b78", letterSpacing: "1px",
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });

    var rays = draw.group().addClass("retrieval-space-rays");
    items.forEach(function (item) {
      item.px = origin.x + item.x * scale.x;
      item.py = origin.y - item.y * scale.y;
      item.ray = rays.line(origin.x, origin.y, item.px, item.py)
        .stroke({ color: "#91a5a0", width: 1.15 });
    });

    items.forEach(function (item) {
      var card = draw.group().translate(item.px, item.py).addClass("retrieval-movie");
      kit.poster(card, "Item " + item.key, -26, -35, {
        width: 52, height: 70, movieId: item.id, captionWidth: 52,
        fill: "#dce7e2", accent: "#78918b", fontSize: 8
      });
      item.outline = card.rect(56, 74).move(-28, -37).fill("none")
        .stroke({ color: "#ffffff", width: 1.5 });
      item.card = card;
      card.attr({ role: "img", "aria-label": "Movie poster item " + item.key });
    });

    var queryVector = draw.line(origin.x, origin.y, origin.x, origin.y)
      .addClass("retrieval-query-vector");
    var queryMark = draw.group().addClass("retrieval-query-mark");
    queryMark.circle(26).center(0, 0).fill("#fffdf9").stroke({ color: "#8a5715", width: 2.2 });
    queryMark.circle(10).center(0, 0).fill("#8a5715");
    text(queryMark, "hₜ", 17, -13, { size: 17, weight: 750, color: "#68400f" });
    queryMark.attr({ role: "group", tabindex: 0,
      "aria-label": "Sequence representation h sub T. Drag to move; use arrow keys when focused." });
    queryMark.node.style.cursor = "grab";

    var controls = document.createElement("div");
    controls.className = "retrieval-space-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Number of top dot-product matches to highlight");
    var controlsLabel = document.createElement("span");
    controlsLabel.className = "retrieval-space-controls-label";
    controlsLabel.textContent = "Highlight top";
    controls.appendChild(controlsLabel);
    var kButtons = [2, 3].map(function (value) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "retrieval-space-k";
      button.textContent = String(value);
      button.setAttribute("aria-label", "Highlight top " + value + " items");
      button.addEventListener("click", function () { k = value; update(); });
      controls.appendChild(button);
      return { value: value, node: button };
    });
    canvas.wrap.appendChild(controls);

    text(draw, "Drag hₜ · arrow keys also move it", 242, 426, {
      size: 12, weight: 600, color: "#52615e"
    });
    draw.rect(14, 14).move(842, 413).fill("none").stroke({ color: "#087f73", width: 2.4 });
    text(draw, "highest hₜᵀeⱼ", 864, 411, { size: 12, weight: 650, color: "#52615e" });

    var dragging = false;
    queryMark.node.addEventListener("pointerdown", function (event) {
      dragging = true;
      queryMark.node.style.cursor = "grabbing";
      svg.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    svg.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      setQueryFromPointer(event);
    });
    svg.addEventListener("pointerup", function (event) {
      if (!dragging) return;
      dragging = false;
      queryMark.node.style.cursor = "grab";
      if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    });
    svg.addEventListener("pointercancel", function () {
      dragging = false;
      queryMark.node.style.cursor = "grab";
    });
    queryMark.node.addEventListener("keydown", function (event) {
      var step = event.shiftKey ? 0.1 : 0.04;
      var handled = true;
      if (event.key === "ArrowLeft") query.x -= step;
      else if (event.key === "ArrowRight") query.x += step;
      else if (event.key === "ArrowDown") query.y -= step;
      else if (event.key === "ArrowUp") query.y += step;
      else handled = false;
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
        clampQuery();
        update();
      }
    });

    function clampQuery() {
      query.x = Math.max(-1, Math.min(1, query.x));
      query.y = Math.max(-1, Math.min(1, query.y));
    }
    function setQueryFromPointer(event) {
      var point = svg.createSVGPoint();
      point.x = event.clientX; point.y = event.clientY;
      var local = point.matrixTransform(svg.getScreenCTM().inverse());
      query.x = (local.x - origin.x) / scale.x;
      query.y = (origin.y - local.y) / scale.y;
      clampQuery();
      update();
    }
    function update() {
      var ranked = items.map(function (item) {
        return { item: item, score: query.x * item.x + query.y * item.y };
      }).sort(function (a, b) { return b.score - a.score; });
      var selected = new Set(ranked.slice(0, k).map(function (entry) { return entry.item.key; }));
      items.forEach(function (item) {
        var isSelected = selected.has(item.key);
        item.card.opacity(isSelected ? 1 : 0.52);
        item.outline.stroke({ color: isSelected ? "#087f73" : "#ffffff", width: isSelected ? 3 : 1.5 });
        item.ray.stroke({ color: isSelected ? "#087f73" : "#b8c3bf", width: isSelected ? 2 : 1.05 });
        item.card.attr({ "aria-label": "Movie poster item " + item.key +
          (isSelected ? ", among the top " + k + " by dot product" : ", not in the top " + k) });
      });
      var qx = origin.x + query.x * scale.x, qy = origin.y - query.y * scale.y;
      queryVector.plot(origin.x, origin.y, qx, qy);
      queryMark.attr("transform", "translate(" + qx + " " + qy + ")");
      queryMark.attr("aria-valuetext", "h t coordinates " + query.x.toFixed(2) + ", " + query.y.toFixed(2));
      kButtons.forEach(function (entry) {
        entry.node.setAttribute("aria-pressed", String(entry.value === k));
      });
    }
    update();
  }

  root.RetrievalPlayground = { mount: mount };
})(window);
