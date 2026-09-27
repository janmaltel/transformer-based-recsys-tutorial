(function (root) {
  "use strict";

  var visuals = [];
  var definitionIsActive = false;
  var xlinkNamespace = "http://www.w3.org/1999/xlink";

  function arrowMarkup(x, y, length, direction, className, nodeId) {
    var path = root.DiagramKit.flowArrowPath({
      x: x,
      y: y,
      length: length,
      direction: direction,
      shaftWidth: 2,
      headLength: 10,
      headWidth: 12
    });
    return '<path class="definition-flow-arrow' +
      (className ? " " + className : "") + '" data-author-node="' + nodeId + '" d="' + path + '"/>';
  }

  var markup =
    '<svg viewBox="0 0 1100 470" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="definition-title definition-desc">' +
    '<title id="definition-title">Sequential recommendation in three stages</title>' +
    '<desc id="definition-desc">A viewer watches Babe, Jumanji, and Toy Story in order. A sequence encoder model turns that ordered history into item scores. The actual gSASRec ranking begins with Toy Story 2, A Bug\'s Life, South Park, and Groundhog Day, followed by an ellipsis to show that more items continue.</desc>' +
    '<defs>' +
    '<clipPath id="history-poster-one"><rect width="80" height="120" rx="0"/></clipPath>' +
    '<clipPath id="history-poster-two"><rect width="80" height="120" rx="0"/></clipPath>' +
    '<clipPath id="history-poster-three"><rect width="80" height="120" rx="0"/></clipPath>' +
    '<clipPath id="rank-poster-one"><rect width="80" height="120" rx="0"/></clipPath>' +
    '<clipPath id="rank-poster-two"><rect width="80" height="120" rx="0"/></clipPath>' +
    '<clipPath id="rank-poster-three"><rect width="80" height="120" rx="0"/></clipPath>' +
    '<clipPath id="rank-poster-four"><rect width="80" height="120" rx="0"/></clipPath>' +
    '</defs>' +
    '<path class="definition-stage-rail" data-author-node="definition.stage-rail" d="M230 12 V458"/>' +
    '<path class="definition-stage-rule" data-author-node="definition.stage-rules" d="M22 170 H1078 M22 304 H1078"/>' +

    '<g class="definition-stage definition-history" data-author-node="definition.stage.observe" data-build-step="0" transform="translate(0 10)">' +
    '<text class="definition-stage-number" x="22" y="20">01</text>' +
    '<text class="pipeline-label" x="58" y="17">OBSERVE</text>' +
    '<text class="definition-stage-subtitle" x="58" y="37">ordered history</text>' +
    '<g class="definition-row-figure" transform="translate(167 0)">' +
    '<g class="definition-user-glyph" data-author-node="definition.viewer" transform="translate(236 35)">' +
    '<circle class="definition-user-head" cx="24" cy="18" r="12"/>' +
    '<path class="definition-user-body" d="M4 62 C7 38 41 38 44 62"/>' +
    '<text class="definition-user-label" x="24" y="82">VIEWER</text>' +
    '</g>' +

    '<g class="definition-movie-card movie-poster-card" data-author-node="definition.history.babe" transform="translate(318 0)">' +
    '<g clip-path="url(#history-poster-one)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1995</text>' +
    '<image class="definition-poster-image" data-movie-id="34" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">Babe<tspan class="poster-card-year"> (1995)</tspan></text></g>' +
    arrowMarkup(408, 60, 70, "right", "definition-history-arrow", "definition.history.babe-to-jumanji") +

    '<g class="definition-movie-card movie-poster-card" data-author-node="definition.history.jumanji" transform="translate(488 0)">' +
    '<g clip-path="url(#history-poster-two)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1995</text>' +
    '<image class="definition-poster-image" data-movie-id="2" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">Jumanji<tspan class="poster-card-year"> (1995)</tspan></text></g>' +
    arrowMarkup(578, 60, 70, "right", "definition-history-arrow", "definition.history.jumanji-to-toy-story") +

    '<g class="definition-movie-card movie-poster-card" data-author-node="definition.history.toy-story" transform="translate(658 0)">' +
    '<g clip-path="url(#history-poster-three)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1995</text>' +
    '<image class="definition-poster-image" data-movie-id="1" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">Toy Story<tspan class="poster-card-year"> (1995)</tspan></text></g>' +
    '</g></g>' +

    '<g class="definition-stage definition-model" data-author-node="definition.stage.encode" data-build-step="1" transform="translate(0 184)">' +
    '<text class="definition-stage-number" x="22" y="20">02</text>' +
    '<text class="pipeline-label" x="58" y="17">ENCODE</text>' +
    '<text class="definition-stage-subtitle" x="58" y="37">history → item scores</text>' +
    arrowMarkup(654, -20, 24, "down", "definition-stage-arrow", "definition.observe-to-encode") +
    '<g class="definition-row-figure" transform="translate(42 0)">' +
    '<g class="definition-model-input" data-author-node="definition.encoder.input" transform="translate(344 30)">' +
    '<rect class="encoder-token encoder-token-one" x="0" y="0" width="24" height="38"/><rect class="encoder-token encoder-token-two" x="34" y="0" width="24" height="38"/><rect class="encoder-token encoder-token-three" x="68" y="0" width="24" height="38"/>' +
    '<text class="encoder-token-text" x="12" y="24">1</text><text class="encoder-token-text" x="46" y="24">2</text><text class="encoder-token-text" x="80" y="24">3</text>' +
    '<text class="model-apparatus-label" x="46" y="62">ordered items</text></g>' +
    arrowMarkup(452, 56, 40, "right", "definition-model-arrow", "definition.encoder.input-to-model") +
    '<g data-author-node="definition.encoder.model"><rect class="encoder-model-block" x="508" y="24" width="236" height="64" rx="0"/>' +
    '<text class="model-title" x="626" y="61">Sequence Encoder Model</text></g>' +
    arrowMarkup(760, 56, 40, "right", "definition-model-arrow", "definition.encoder.model-to-scores") +
    '<g class="definition-score-vector" data-author-node="definition.encoder.scores" transform="translate(824 25)">' +
    '<rect class="score-bar score-bar-one" x="0" y="0" width="54" height="7"/><rect class="score-bar score-bar-two" x="0" y="12" width="38" height="7"/><rect class="score-bar score-bar-three" x="0" y="24" width="46" height="7"/><rect class="score-bar score-bar-four" x="0" y="36" width="27" height="7"/><rect class="score-bar score-bar-five" x="0" y="48" width="34" height="7"/>' +
    '<text class="model-apparatus-label" x="27" y="76">item scores</text></g>' +
    '</g></g>' +

    '<g class="definition-stage definition-rank" data-author-node="definition.stage.rank" data-build-step="2" transform="translate(0 320)">' +
    '<text class="definition-stage-number" x="22" y="20">03</text>' +
    '<text class="pipeline-label" x="58" y="17">RANK</text>' +
    '<text class="definition-stage-subtitle" x="58" y="37">Example top-k</text>' +
    arrowMarkup(654, -28, 24, "down", "definition-stage-arrow", "definition.encode-to-rank") +
    '<g class="definition-row-figure" transform="translate(5 0)">' +

    '<g class="definition-movie-card recommendation-card movie-rank-poster-card rank-one" data-author-node="definition.rank.toy-story-2" transform="translate(318 0)">' +
    '<g clip-path="url(#rank-poster-one)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1999</text>' +
    '<image class="definition-poster-image" data-movie-id="3114" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/><rect class="rank-badge" width="20" height="20" rx="0"/><text class="rank-badge-text" x="10" y="14">1</text>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">Toy Story 2<tspan class="poster-card-year"> (1999)</tspan></text></g>' +

    '<g class="definition-movie-card recommendation-card movie-rank-poster-card rank-two" data-author-node="definition.rank.a-bugs-life" transform="translate(488 0)">' +
    '<g clip-path="url(#rank-poster-two)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1998</text>' +
    '<image class="definition-poster-image" data-movie-id="2355" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/><rect class="rank-badge" width="20" height="20" rx="0"/><text class="rank-badge-text" x="10" y="14">2</text>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">A Bug\'s Life<tspan class="poster-card-year"> (1998)</tspan></text></g>' +

    '<g class="definition-movie-card recommendation-card movie-rank-poster-card rank-three" data-author-node="definition.rank.south-park" transform="translate(658 0)">' +
    '<g clip-path="url(#rank-poster-three)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1999</text>' +
    '<image class="definition-poster-image" data-movie-id="2700" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/><rect class="rank-badge" width="20" height="20" rx="0"/><text class="rank-badge-text" x="10" y="14">3</text>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">South Park<tspan class="poster-card-year"> (1999)</tspan></text></g>' +

    '<g class="definition-movie-card recommendation-card movie-rank-poster-card rank-four" data-author-node="definition.rank.groundhog-day" transform="translate(828 0)">' +
    '<g clip-path="url(#rank-poster-four)"><rect class="poster-fallback" width="80" height="120"/><text class="poster-fallback-label" x="40" y="64">1993</text>' +
    '<image class="definition-poster-image" data-movie-id="1265" width="80" height="120" preserveAspectRatio="xMidYMid slice" referrerpolicy="no-referrer" aria-hidden="true" focusable="false"/></g>' +
    '<rect class="movie-poster-frame" width="80" height="120" rx="0"/><rect class="rank-badge" width="20" height="20" rx="0"/><text class="rank-badge-text" x="10" y="14">4</text>' +
    '<text class="poster-card-title" data-label-width="80" x="0" y="138">Groundhog Day<tspan class="poster-card-year"> (1993)</tspan></text></g>' +

    '<g class="definition-more-items" data-author-node="definition.rank.more" transform="translate(968 42)" aria-hidden="true"><text class="definition-more-mark" x="0" y="30">…</text><text class="model-apparatus-label" x="0" y="53">more</text></g>' +
    '</g></g>' +
    '</svg>';

  function displayPosterUrl(value) {
    var assets = root.GSASRecPosterAssets;
    return assets && assets.tmdbDisplayUrl
      ? assets.tmdbDisplayUrl(value)
      : null;
  }

  function posterSources(originalId) {
    var metadata = root.GSASRecMovieMetadata;
    var item = metadata && metadata.items ? metadata.items[originalId] : null;
    var assets = root.GSASRecPosterAssets;
    var localUrl = assets && assets.urlForOriginalId
      ? assets.urlForOriginalId(originalId)
      : null;
    return [localUrl, displayPosterUrl(item && item.posterUrl)].filter(Boolean);
  }

  function showPosterSource(image) {
    var sources = image._definitionPosterSources || [];
    var source = sources[image._definitionPosterSourceIndex || 0];
    var card = image.closest(".movie-poster-card, .movie-rank-poster-card");
    if (!source) {
      image.removeAttribute("href");
      image.removeAttributeNS(xlinkNamespace, "href");
      if (card) card.classList.remove("has-poster");
      return;
    }
    image.setAttribute("href", source);
    image.setAttributeNS(xlinkNamespace, "xlink:href", source);
  }

  function hydratePosters(visual) {
    Array.prototype.forEach.call(
      visual.querySelectorAll(".definition-poster-image[data-movie-id]"),
      function (image) {
        var sources = posterSources(image.dataset.movieId);
        var signature = sources.join("\n");
        if (image.dataset.posterSignature === signature) return;
        var card = image.closest(".movie-poster-card, .movie-rank-poster-card");
        if (!image.dataset.posterEventsBound) {
          image.addEventListener("load", function () {
            if (card) card.classList.add("has-poster");
          });
          image.addEventListener("error", function () {
            image._definitionPosterSourceIndex += 1;
            showPosterSource(image);
          });
          image.dataset.posterEventsBound = "true";
        }
        image.dataset.posterSignature = signature;
        image._definitionPosterSources = sources;
        image._definitionPosterSourceIndex = 0;
        showPosterSource(image);
      }
    );
  }

  function fitInlinePosterYears(visual) {
    root.requestAnimationFrame(function () {
      Array.prototype.forEach.call(
        visual.querySelectorAll(".poster-card-title[data-label-width]"),
        function (label) {
          var year = label.querySelector(".poster-card-year");
          if (!year || !label.getComputedTextLength) return;
          year.removeAttribute("display");
          if (label.getComputedTextLength() > Number(label.dataset.labelWidth)) {
            year.setAttribute("display", "none");
          }
        }
      );
    });
  }

  function hydrateActiveVisuals() {
    if (!definitionIsActive || !root.SASRecPlaygroundLoader) return;
    root.SASRecPlaygroundLoader.loadMetadata().then(function () {
      visuals.forEach(hydratePosters);
    });
  }

  root.addEventListener("presentation:slidechange", function (event) {
    definitionIsActive = event.detail.slideId === "working-definition";
    if (definitionIsActive) visuals.forEach(fitInlinePosterYears);
    hydrateActiveVisuals();
  });
  root.addEventListener("gsasrec-metadatachange", hydrateActiveVisuals);

  root.DefinitionVisual = {
    render: function (content) {
      var visual = document.createElement("div");
      visual.className = "definition-visual";
      visual.innerHTML = markup;
      visuals.push(visual);
      content.appendChild(visual);
      fitInlinePosterYears(visual);
      hydratePosters(visual);
    }
  };

  root.addEventListener("resize", function () {
    visuals.forEach(fitInlinePosterYears);
  });
  if (root.document.fonts && root.document.fonts.ready) {
    root.document.fonts.ready.then(function () {
      visuals.forEach(fitInlinePosterYears);
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
