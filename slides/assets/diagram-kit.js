(function (root) {
  "use strict";

  var ns = "http://www.w3.org/2000/svg";
  var xlinkNamespace = "http://www.w3.org/1999/xlink";
  var posterRecords = [];
  var nextPosterClipId = 1;
  var posterCaptions = [];
  // Keep SVG colours aligned with the presentation design-system tokens. The
  // semantic names are the contract for new renderers; the legacy names remain
  // as aliases so older slide scripts keep working while they migrate.
  var colors = {
    white: "#ffffff",
    inkStrong: "#0e1114",
    ink: "#16191d",
    secondary: "#3f464e",
    muted: "#78808a",
    faint: "#a9aeb4",
    line: "#d7d3c9",
    lineFaint: "#ebe7de",
    paper: "#f8f6f1",
    panel: "#f1eee6",
    accentDark: "#083c68",
    accent: "#0b4f87",
    accentMid: "#2e6c9e",
    accentSoft: "#dce7f0",
    highlightDark: "#8a5715",
    highlight: "#b47320",
    highlightMid: "#dfbe86",
    highlightSoft: "#f5e9d5",
    success: "#1b6b5a",
    successSoft: "#e5efec",
    seq1: "#eaeff5",
    seq3: "#9bbad5",
    divNeg3: "#9a5b18",
    divNeg2: "#c08a45",
    divNeg1: "#e3c79b",
    divZero: "#f1eee6",
    divPos1: "#a8c0d6",
    divPos2: "#4e7fac",
    divPos3: "#0b4f87"
  };
  Object.assign(colors, {
    teal: colors.accent,
    tealSoft: colors.accentSoft,
    coral: colors.highlight,
    coralDark: colors.highlightDark,
    coralSoft: colors.highlightSoft,
    blue: colors.accentMid,
    blueSoft: colors.seq1,
    yellow: colors.highlight,
    yellowSoft: colors.highlightSoft,
    green: colors.success,
    greenSoft: colors.successSoft
  });

  function svgText(parent, value, x, y, options) {
    options = options || {};
    var node = parent.text(String(value));
    node.move(x, y).font({
      family: options.family || '"IBM Plex Sans", system-ui, sans-serif',
      size: options.size || 18,
      weight: options.weight || 650
    });
    node.fill(options.color || colors.ink);
    if (options.anchor) node.attr({ "text-anchor": options.anchor });
    if (options.letterSpacing) node.attr({ "letter-spacing": options.letterSpacing });
    if (options.opacity !== undefined) node.opacity(options.opacity);
    return node;
  }

  function multiline(parent, lines, x, y, options) {
    options = options || {};
    var gap = options.gap || (options.size || 18) * 1.28;
    return lines.map(function (line, index) {
      return svgText(parent, line, x, y + index * gap, options);
    });
  }

  function stage(parent, step, className) {
    var group = parent.group().addClass("sasrec-stage");
    group.attr({ "data-build-step": step });
    if (className) group.addClass(className);
    return group;
  }

  function panel(parent, x, y, width, height, options) {
    options = options || {};
    var radius = options.radius === undefined ? 0 : options.radius;
    var node = parent.rect(width, height).move(x, y).radius(radius);
    node.fill(options.fill || colors.paper).stroke({
      color: options.stroke || colors.line,
      width: options.strokeWidth || 1
    });
    if (options.opacity !== undefined) node.opacity(options.opacity);
    return node;
  }

  function pill(parent, value, x, y, options) {
    options = options || {};
    var width = options.width || Math.max(58, String(value).length * 9 + 24);
    var height = options.height || 30;
    parent.rect(width, height).move(x, y).radius(2)
      .fill(options.fill || colors.accentSoft)
      .stroke({ color: options.stroke || colors.line, width: 1 });
    svgText(parent, value, x + width / 2, y + 5, {
      size: options.size || 13,
      weight: options.weight || 800,
      color: options.color || colors.accent,
      anchor: "middle",
      letterSpacing: options.letterSpacing,
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });
    return width;
  }

  function arrowMarker(draw, color) {
    var marker = draw.marker(9, 10, function (add) {
      add.path("M0 0 L9 5 L0 10 Z").fill(color || colors.accent);
    });
    marker.attr({ markerUnits: "userSpaceOnUse" });
    marker.ref(9, 5).orient("auto");
    return marker;
  }

  function arrow(parent, path, options) {
    options = options || {};
    var color = options.color || colors.accent;
    var straight = /^M\s*([\d.-]+)[ ,]+([\d.-]+)\s*([HV])\s*([\d.-]+)$/.exec(path);
    if (straight && !options.dasharray && !options.marker) {
      var x = Number(straight[1]), y = Number(straight[2]);
      var delta = Number(straight[4]) - (straight[3] === "H" ? x : y);
      return flowArrow(parent, x, y, Math.abs(delta), {
        direction: straight[3] === "H" ? (delta > 0 ? "right" : "left") : (delta > 0 ? "down" : "up"),
        shaftWidth: 2, headLength: Math.min(8, Math.abs(delta) / 2), headWidth: 10, color: color
      });
    }
    var node = parent.path(path).fill("none").stroke({
      color: color,
      width: Math.min(options.width || 2, 2.5),
      linecap: "butt",
      linejoin: "miter",
      dasharray: options.dasharray
    });
    node.marker("end", options.marker || arrowMarker(parent.root(), color));
    return node;
  }

  function flowArrowOptions(x, y, length, options) {
    if (x && typeof x === "object") {
      options = x;
      x = options.x;
      y = options.y;
      length = options.length;
    } else {
      options = options || {};
    }
    return {
      x: Number(x),
      y: Number(y),
      length: Number(length),
      direction: options.direction || options.orientation || "right",
      weight: options.weight || "block",
      shaftWidth: options.shaftWidth,
      headLength: options.headLength,
      headWidth: options.headWidth,
      color: options.color,
      opacity: options.opacity,
      className: options.className
    };
  }

  function flowArrowNumber(value) {
    var rounded = Math.round(value * 10000) / 10000;
    return String(Object.is(rounded, -0) ? 0 : rounded);
  }

  /*
   * Build one closed, filled arrow path without SVG markers. `x` and `y` are
   * the centreline start, and `length` runs in `direction`. The object form is
   * intentionally DOM-free so raw SVG renderers can reuse the same geometry:
   *
   *   flowArrowPath({ x: 20, y: 40, length: 64, direction: "right" })
   *
   * Positional calls are also supported:
   *
   *   flowArrowPath(20, 40, 64, { direction: "down", weight: "hairline" })
   */
  function flowArrowPath(x, y, length, options) {
    var config = flowArrowOptions(x, y, length, options);
    var direction = config.direction;
    var units = {
      right: [1, 0],
      left: [-1, 0],
      down: [0, 1],
      up: [0, -1],
      horizontal: [1, 0],
      vertical: [0, 1]
    };
    var unit = units[direction];
    var isHairline = config.weight === "hairline";
    var shaftWidth = config.shaftWidth === undefined
      ? (isHairline ? 1 : 2)
      : Number(config.shaftWidth);
    var headLength = config.headLength === undefined
      ? (isHairline ? 5 : 8)
      : Number(config.headLength);
    var headWidth = config.headWidth === undefined
      ? (isHairline ? 6 : 12)
      : Number(config.headWidth);

    if (!Number.isFinite(config.x) || !Number.isFinite(config.y) ||
      !Number.isFinite(config.length) || config.length <= 0) {
      throw new TypeError("flowArrowPath requires finite x/y and a positive length");
    }
    if (!unit) {
      throw new TypeError(
        "flowArrowPath direction must be right, left, down, up, horizontal, or vertical"
      );
    }
    if (!Number.isFinite(shaftWidth) || shaftWidth <= 0 ||
      !Number.isFinite(headLength) || headLength <= 0 ||
      !Number.isFinite(headWidth) || headWidth <= 0) {
      throw new TypeError("flowArrowPath dimensions must be positive finite numbers");
    }
    if (headLength >= config.length) {
      throw new RangeError("flowArrowPath length must be greater than headLength");
    }

    headWidth = Math.max(headWidth, shaftWidth);
    var ux = unit[0];
    var uy = unit[1];
    var px = -uy;
    var py = ux;
    var tipX = config.x + ux * config.length;
    var tipY = config.y + uy * config.length;
    var baseX = tipX - ux * headLength;
    var baseY = tipY - uy * headLength;
    var shaftHalf = shaftWidth / 2;
    var headHalf = headWidth / 2;
    var points = [
      [config.x + px * shaftHalf, config.y + py * shaftHalf],
      [baseX + px * shaftHalf, baseY + py * shaftHalf],
      [baseX + px * headHalf, baseY + py * headHalf],
      [tipX, tipY],
      [baseX - px * headHalf, baseY - py * headHalf],
      [baseX - px * shaftHalf, baseY - py * shaftHalf],
      [config.x - px * shaftHalf, config.y - py * shaftHalf]
    ];
    return points.map(function (point, index) {
      return (index ? "L" : "M") + flowArrowNumber(point[0]) + " " +
        flowArrowNumber(point[1]);
    }).join(" ") + " Z";
  }

  function flowArrow(parent, x, y, length, options) {
    var config = flowArrowOptions(x, y, length, options);
    var node = parent.path(flowArrowPath(config)).fill(config.color || colors.accent);
    if (config.className) node.addClass(config.className);
    if (config.opacity !== undefined) node.opacity(config.opacity);
    return node;
  }

  function vector(parent, values, x, y, options) {
    options = options || {};
    var cellWidth = options.cellWidth || 27;
    var height = options.height || 25;
    var fill = options.fill || colors.accentSoft;
    var textColor = options.color || colors.accent;
    values.forEach(function (value, index) {
      parent.rect(cellWidth, height).move(x + index * cellWidth, y)
        .fill(fill).stroke({ color: colors.lineFaint, width: 1 });
      svgText(parent, value, x + index * cellWidth + cellWidth / 2, y + 4, {
        size: options.size || 10,
        weight: 750,
        color: textColor,
        anchor: "middle",
        family: '"IBM Plex Mono", ui-monospace, monospace'
      });
    });
    return values.length * cellWidth;
  }

  var embeddingScale = [
    colors.divNeg3,
    colors.divNeg2,
    colors.divNeg1,
    colors.divZero,
    colors.divPos1,
    colors.divPos2,
    colors.divPos3
  ];

  function embeddingColorIndex(value, domainMax) {
    var limit = Number(domainMax === undefined ? 1 : domainMax);
    var coordinate = Number(value);
    if (!Number.isFinite(limit) || limit <= 0) {
      throw new TypeError("embeddingColorIndex domainMax must be positive and finite");
    }
    if (!Number.isFinite(coordinate)) {
      throw new TypeError("embeddingColorIndex value must be finite");
    }
    var normalized = Math.max(-1, Math.min(1, coordinate / limit));
    return Math.max(0, Math.min(6, Math.round(((normalized + 1) / 2) * 6)));
  }

  function sumEmbeddingVectors(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      throw new TypeError("sumEmbeddingVectors requires arrays with matching lengths");
    }
    return left.map(function (value, index) {
      var a = Number(value);
      var b = Number(right[index]);
      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        throw new TypeError("sumEmbeddingVectors coordinates must be finite");
      }
      return a + b;
    });
  }

  /* Signed embedding coordinates use the design system's diverging data
     scale: amber is negative, paper is near zero, and blue is positive. */
  function embeddingVector(parent, values, x, y, options) {
    options = options || {};
    var cellWidth = options.cellWidth || 16;
    var height = options.height || 22;
    var gap = options.gap === undefined ? 1 : options.gap;
    var group = parent.group().addClass("embedding-vector");
    var label = options.label || "Embedding coordinates";
    group.attr({
      role: "img",
      "aria-label": label + ": " + values.map(function (value) {
        return String(Math.round(Number(value) * 1000) / 1000);
      }).join(", ")
    });
    values.forEach(function (value, index) {
      var color = embeddingScale[embeddingColorIndex(value, options.domainMax)];
      group.rect(cellWidth, height)
        .move(x + index * (cellWidth + gap), y)
        .fill(color)
        .stroke({ color: options.stroke || colors.white, width: options.strokeWidth || 0.7 });
    });
    return values.length * cellWidth + Math.max(0, values.length - 1) * gap;
  }

  function token(parent, value, x, y, options) {
    options = options || {};
    var width = options.width || 60;
    var height = options.height || 52;
    var radius = options.radius === undefined ? 1 : options.radius;
    parent.rect(width, height).move(x, y).radius(radius)
      .fill(options.fill || colors.accent)
      .stroke({ color: options.stroke || colors.line, width: 1 });
    svgText(parent, value, x + width / 2, y + (height - (options.size || 18)) / 2 - 2, {
      size: options.size || 18,
      weight: 850,
      color: options.color || colors.white,
      anchor: "middle",
      family: '"IBM Plex Mono", ui-monospace, monospace'
    });
    if (options.meta) {
      svgText(parent, options.meta, x + width / 2, y + height + 5, {
        size: 11,
        weight: 750,
        color: colors.muted,
        anchor: "middle",
        family: '"IBM Plex Mono", ui-monospace, monospace'
      });
    }
    return width;
  }

  function posterSources(originalId) {
    var assets = root.GSASRecPosterAssets;
    if (!assets || !assets.sourcesForOriginalId) return [];
    var metadata = root.GSASRecMovieMetadata;
    var movie = metadata && metadata.items
      ? metadata.items[originalId]
      : null;
    var sources = assets.sourcesForOriginalId(
      originalId,
      movie && movie.posterUrl
    );
    return [sources.primaryUrl, sources.fallbackUrl].filter(Boolean);
  }

  function showPosterSource(record) {
    var source = record.sources[record.sourceIndex];
    if (!source) {
      record.image.removeAttribute("href");
      record.image.removeAttributeNS(xlinkNamespace, "href");
      record.image.style.opacity = "0";
      record.group.removeClass("has-poster");
      record.fallbackArt.opacity(1);
      return;
    }
    record.image.style.opacity = "0";
    record.image.setAttribute("href", source);
    record.image.setAttributeNS(xlinkNamespace, "xlink:href", source);
  }

  function hydratePoster(record) {
    var sources = posterSources(record.originalId);
    var signature = sources.join("\n");
    if (signature === record.signature) return;
    record.signature = signature;
    record.sources = sources;
    record.sourceIndex = 0;
    showPosterSource(record);
  }

  function hydratePosters() {
    posterRecords = posterRecords.filter(function (record) {
      return record.image.isConnected;
    });
    posterRecords.forEach(hydratePoster);
  }

  function clippedPosterImage(parent, group, fallbackArt, width, height, radius, originalId) {
    var rootNode = parent.root().node;
    var defs = rootNode.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(ns, "defs");
      rootNode.insertBefore(defs, rootNode.firstChild);
    }
    var clipId = "sasrec-poster-clip-" + nextPosterClipId++;
    var clipPath = document.createElementNS(ns, "clipPath");
    var clipRect = document.createElementNS(ns, "rect");
    clipPath.id = clipId;
    clipRect.setAttribute("width", width);
    clipRect.setAttribute("height", height);
    clipRect.setAttribute("rx", radius);
    clipRect.setAttribute("ry", radius);
    clipPath.appendChild(clipRect);
    defs.appendChild(clipPath);

    var image = document.createElementNS(ns, "image");
    image.setAttribute("width", width);
    image.setAttribute("height", height);
    image.setAttribute("preserveAspectRatio", "xMidYMid slice");
    image.setAttribute("clip-path", "url(#" + clipId + ")");
    image.setAttribute("referrerpolicy", "no-referrer");
    image.style.opacity = "0";
    group.node.appendChild(image);

    var record = {
      group: group,
      fallbackArt: fallbackArt,
      image: image,
      originalId: Number(originalId),
      signature: null,
      sources: [],
      sourceIndex: 0
    };
    image.addEventListener("load", function () {
      image.style.opacity = "1";
      group.addClass("has-poster");
      fallbackArt.opacity(0);
    });
    image.addEventListener("error", function () {
      record.sourceIndex += 1;
      showPosterSource(record);
    });
    posterRecords.push(record);
    hydratePoster(record);
  }

  function poster(parent, title, x, y, options) {
    options = options || {};
    var width = options.width || 74;
    var height = options.height || 108;
    var fill = options.fill || colors.accentMid;
    var accent = options.accent || colors.highlight;
    var radius = options.radius === undefined ? 0 : options.radius;
    var group = parent.group().translate(x, y);
    var fallbackArt = group.group();
    fallbackArt.rect(width, height).radius(radius).fill(fill);
    fallbackArt.circle(width * 0.74).move(width * 0.42, -height * 0.13)
      .fill(accent).opacity(0.55);
    fallbackArt.path("M0 " + (height * 0.62) + " L" + (width * 0.62) + " " + (height * 0.24) +
      " L" + width + " " + (height * 0.48) + " L" + width + " " + height + " L0 " + height + " Z")
      .fill(colors.ink).opacity(0.42);
    if (options.movieId) {
      clippedPosterImage(
        parent,
        group,
        fallbackArt,
        width,
        height,
        radius,
        options.movieId
      );
    }
    var caption = svgText(group, title, 0, height + 5, {
      size: Math.max(options.fontSize || 12, 11),
      weight: 650,
      color: colors.ink
    });
    posterCaptions.push({ node: caption.node, title: title, width: options.captionWidth || width });
    group.attr({ "aria-label": title });
    if (options.badge) {
      pill(group, options.badge, 5, 5, {
        width: 29,
        height: 20,
        size: 10,
        fill: colors.highlight,
        color: colors.white,
        stroke: colors.highlight
      });
    }
    group.rect(width, height).radius(radius).fill("none")
      .stroke({ color: colors.line, width: 1 });
    return group;
  }

  function fitPosterCaptions() {
    root.requestAnimationFrame(function () {
      posterCaptions.forEach(function (caption) {
        if (!caption.node.isConnected || !caption.node.getBoundingClientRect().width) return;
        caption.node.textContent = caption.title;
        var value = caption.title;
        while (value.length > 2 && caption.node.getComputedTextLength() > caption.width) {
          value = value.slice(0, -1);
          caption.node.textContent = value + "…";
        }
      });
    });
  }

  function create(content, title, description, options) {
    options = options || {};
    var wrap = document.createElement("div");
    var host = document.createElement("div");
    wrap.className = "sasrec-canvas" + (options.className ? " " + options.className : "");
    host.className = "sasrec-svg-host";
    wrap.appendChild(host);
    content.appendChild(wrap);

    var draw = root.SVG().addTo(host).size("100%", "100%")
      .viewbox(0, 0, options.width || 1200, options.height || 420);
    draw.attr({ role: "img", "aria-label": title, preserveAspectRatio: "xMidYMid meet" });
    var titleNode = document.createElementNS(ns, "title");
    var descNode = document.createElementNS(ns, "desc");
    titleNode.textContent = title;
    descNode.textContent = description;
    draw.node.insertBefore(descNode, draw.node.firstChild);
    draw.node.insertBefore(titleNode, draw.node.firstChild);
    return { wrap: wrap, host: host, draw: draw };
  }

  function equation(canvas, tex, step, className) {
    var node = document.createElement("div");
    node.className = "sasrec-equation sasrec-stage" + (className ? " " + className : "");
    node.dataset.buildStep = step;
    node.textContent = tex;
    canvas.wrap.appendChild(node);
    return node;
  }

  root.DiagramKit = {
    colors: colors,
    create: create,
    equation: equation,
    stage: stage,
    text: svgText,
    multiline: multiline,
    panel: panel,
    pill: pill,
    arrow: arrow,
    flowArrowPath: flowArrowPath,
    flowArrow: flowArrow,
    vector: vector,
    embeddingColorIndex: embeddingColorIndex,
    embeddingVector: embeddingVector,
    sumEmbeddingVectors: sumEmbeddingVectors,
    token: token,
    poster: poster
  };

  root.addEventListener("gsasrec-metadatachange", hydratePosters);
  root.addEventListener("presentation:slidechange", function () {
    fitPosterCaptions();
    hydratePosters();
    if (posterRecords.length && root.SASRecPlaygroundLoader) {
      root.SASRecPlaygroundLoader.loadMetadata().then(hydratePosters);
    }
  });
  if (root.document && root.document.fonts) root.document.fonts.ready.then(fitPosterCaptions);
  root.addEventListener("resize", fitPosterCaptions);
})(typeof globalThis !== "undefined" ? globalThis : window);
