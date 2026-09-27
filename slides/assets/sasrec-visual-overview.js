(function (root) {
  "use strict";

  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  var movieExample = root.CanonicalMoviePredictionExample;

  function sectionLabel(kit, group, value, x, y, color) {
    return kit.text(group, value, x, y, {
      size: 12,
      weight: 600,
      color: color || kit.colors.accent,
      letterSpacing: "1.5px",
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });
  }

  function predictionArrow(kit, group, x, y, length) {
    return kit.flowArrow(group, x, y, length, {
      direction: "right",
      shaftWidth: 2,
      headLength: 7,
      headWidth: 9,
      color: kit.colors.accent,
      className: "motivation-flow-arrow"
    });
  }

  function sequenceModel(kit, group, x, y) {
    group.rect(126, 72).move(x, y)
      .fill(kit.colors.accentSoft)
      .stroke({ color: kit.colors.accent, width: 1 });
    kit.text(group, "CAUSAL", x + 63, y + 13, {
      size: 10,
      weight: 720,
      color: kit.colors.accent,
      anchor: "middle",
      letterSpacing: "1.2px",
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });
    kit.text(group, "SEQUENCE MODEL", x + 63, y + 37, {
      size: 13,
      weight: 820,
      color: kit.colors.ink,
      anchor: "middle"
    });
  }

  function localPosterUrl(movieId) {
    var assets = root.GSASRecPosterAssets;
    return assets && assets.urlForOriginalId
      ? assets.urlForOriginalId(movieId)
      : null;
  }

  function fitInlineMovieYears(scope) {
    root.requestAnimationFrame(function () {
      Array.prototype.forEach.call(
        scope.querySelectorAll(".motivation-movie-title[data-label-width]"),
        function (label) {
          var year = label.querySelector(".motivation-movie-year");
          if (!year || !label.getComputedTextLength) return;
          year.removeAttribute("display");
          if (label.getComputedTextLength() > Number(label.dataset.labelWidth)) {
            year.setAttribute("display", "none");
          }
        }
      );
    });
  }

  /* Match the playground/slide-02 card grammar: a plain 2:3 poster frame,
     followed by a one-line title and optional inline year. Recommendation state
     only adds a rank badge. */
  function movieCard(kit, group, movie, x, y, options) {
    options = options || {};
    var width = options.width || 64;
    var height = width * 1.5;
    var card = group.group().translate(x, y).addClass("motivation-movie-card");
    var source = localPosterUrl(movie.id);

    card.rect(width, height).fill(kit.colors.panel);
    kit.text(card, movie.year, width / 2, height / 2 - 7, {
      size: 10,
      weight: 700,
      color: kit.colors.muted,
      anchor: "middle",
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });
    if (source) {
      card.image(source).size(width, height).attr({
        preserveAspectRatio: "xMidYMid slice",
        "aria-hidden": "true",
        focusable: "false"
      });
    }
    card.rect(width, height).fill("none").stroke({
      color: options.recommended ? kit.colors.highlight : kit.colors.secondary,
      width: options.recommended ? 2 : 1
    });
    if (options.badge) {
      card.rect(24, 20).fill(kit.colors.highlight);
      kit.text(card, options.badge, 12, 3, {
        size: 10,
        weight: 750,
        color: kit.colors.white,
        anchor: "middle",
        family: '"IBM Plex Mono", ui-monospace, monospace'
      });
    }
    var label = kit.text(card, movie.title, 0, height + 7, {
      size: 14,
      weight: 720,
      color: kit.colors.ink
    });
    label.addClass("motivation-movie-title").attr({
      "data-label-width": width
    });
    var year = root.document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    year.setAttribute("class", "motivation-movie-year");
    year.setAttribute("fill", kit.colors.muted);
    year.setAttribute("font-family", '"IBM Plex Mono", ui-monospace, monospace');
    year.setAttribute("font-size", "9.5");
    year.setAttribute("font-weight", "400");
    year.textContent = " (" + movie.year + ")";
    label.node.appendChild(year);
    return card;
  }

  function panelProbability(group, tex, x, y) {
    var frame = root.document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    frame.setAttribute("x", x);
    frame.setAttribute("y", y);
    frame.setAttribute("width", 500);
    frame.setAttribute("height", 42);
    var formula = root.document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    formula.setAttribute("class", "motivation-probability");
    formula.textContent = tex;
    frame.appendChild(formula);
    group.node.appendChild(frame);
  }

  function renderMotivation(content) {
    var kit = root.DiagramKit;
    var canvas = kit.create(
      content,
      "Comparison of next-word and next-item prediction",
      "Two parallel pipelines use the same causal sequence-model pattern with different vocabularies: catalog items for recommendation on the left, then words for language on the right.",
      { className: "sasrec-motivation" }
    );
    var draw = canvas.draw;

    var items = kit.stage(draw, 0, "motivation-items");
    kit.panel(items, 16, 26, 560, 316, { fill: kit.colors.paper });
    sectionLabel(kit, items, "SEQUENTIAL RECOMMENDATION", 46, 49, kit.colors.highlightDark);
    kit.text(items, "Input item history", 46, 76, { size: 22, weight: 820 });
    sectionLabel(kit, items, "ITEM CATALOG", 546, 87, kit.colors.muted)
      .attr({ "text-anchor": "end" });
    movieExample.history.forEach(function (movie, index) {
      movieCard(kit, items, movie, 46 + index * 74, 126);
    });
    predictionArrow(kit, items, 268, 174, 22);
    sequenceModel(kit, items, 298, 138);
    predictionArrow(kit, items, 432, 174, 22);
    movieCard(kit, items, movieExample.recommendations[0], 462, 126, {
      recommended: true,
      badge: "#1"
    });
    kit.text(items, "predict the next item", 46, 258, {
      size: 17,
      weight: 750,
      color: kit.colors.muted
    });
    panelProbability(items, "\\(p(i_{t+1} \\mid i_{1:t})\\)", 46, 287);

    var language = kit.stage(draw, 1, "motivation-language");
    kit.panel(language, 624, 26, 560, 316, { fill: kit.colors.paper });
    sectionLabel(kit, language, "LANGUAGE MODELING", 654, 49);
    kit.text(language, "Input word prefix", 654, 76, { size: 22, weight: 820 });
    sectionLabel(kit, language, "WORD VOCABULARY", 1154, 50, kit.colors.muted)
      .attr({ "text-anchor": "end" });
    ["the", "story", "turns", "into"].forEach(function (word, index) {
      kit.token(language, word, 654 + index * 62, 143, {
        width: 54,
        height: 56,
        fill: index % 2 ? kit.colors.accentMid : kit.colors.accent,
        size: 13
      });
    });
    predictionArrow(kit, language, 906, 171, 26);
    sequenceModel(kit, language, 942, 135);
    predictionArrow(kit, language, 1078, 171, 24);
    kit.token(language, "adventure", 1112, 137, {
      width: 60,
      height: 68,
      fill: kit.colors.highlight,
      size: 9.5
    });
    kit.text(language, "predict the next word", 654, 258, {
      size: 17,
      weight: 750,
      color: kit.colors.muted
    });
    panelProbability(language, "\\(p(w_{t+1} \\mid w_{1:t})\\)", 654, 287);

    var bridge = kit.stage(draw, 2, "motivation-bridge");
    bridge.line(230, 375, 970, 375).stroke({ color: kit.colors.line, width: 1 });
    bridge.rect(632, 34).move(284, 358).fill(kit.colors.paper);
    kit.text(bridge, "Same model structure · different vocabularies and parameters", 600, 364, {
      size: 14,
      weight: 720,
      color: kit.colors.secondary,
      anchor: "middle",
      letterSpacing: "0.2px"
    });
    fitInlineMovieYears(content);
  }


  parts.motivation = renderMotivation;

  root.addEventListener("resize", function () {
    fitInlineMovieYears(root.document);
  });
  root.addEventListener("presentation:slidechange", function () {
    fitInlineMovieYears(root.document);
  });
  if (root.document.fonts && root.document.fonts.ready) {
    root.document.fonts.ready.then(function () {
      fitInlineMovieYears(root.document);
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
