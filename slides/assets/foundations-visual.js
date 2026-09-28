(function () {
  "use strict";

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function stage(className, step) {
    var node = element("section", "foundation-stage " + className);
    node.dataset.buildStep = step;
    return node;
  }

  function label(text) {
    return element("span", "foundation-label", text);
  }

  function authorText(tag, className, text, slide, pointer) {
    var node = element(tag, className, text);
    if (typeof text === "string" && window.PresentationEditorRefs) {
      window.PresentationEditorRefs.annotate(node, slide, pointer);
    }
    return node;
  }

  function movieCard(movie) {
    var card = element("figure", "foundation-movie-card");
    card.dataset.movieId = movie.id;
    var artwork = element("div", "foundation-movie-artwork");
    artwork.setAttribute("aria-hidden", "true");
    artwork.appendChild(element("span", "foundation-movie-fallback", movie.title));
    var url = window.GSASRecPosterAssets.urlForOriginalId(movie.id);
    if (url) {
      var image = element("img", "");
      image.src = url;
      image.alt = "";
      image.addEventListener("error", function () { image.remove(); });
      artwork.appendChild(image);
    }
    card.appendChild(artwork);
    card.appendChild(element("figcaption", "", movie.title));
    return card;
  }

  function renderMatrixTimeline(slide, content) {
    var history = window.CanonicalMoviePredictionExample.history;
    // Columns identify items; their placement does not encode event order.
    var columns = [{ id: 6, title: "Heat" }, history[1],
      { id: 588, title: "Aladdin" }, history[0], history[2]];
    var events = history.concat(history[0]);
    var users = [
      { id: "u17", items: events.map(function (movie) { return movie.id; }) },
      { id: "u18", items: [6, 6, 2] },
      { id: "u19", items: [6, 588, 1] }
    ];
    var canvas = element("div", "foundation-canvas matrix-timeline");
    var matrix = stage("matrix-view", 0);
    var timeline = stage("timeline-view", 1);
    var takeaway = stage("foundation-takeaway", 2);
    var grid = element("table", "interaction-matrix");
    grid.setAttribute("aria-label", "Interaction count matrix; u17 has two interactions with Babe and one each with Jumanji and Toy Story. Movie columns are in arbitrary order.");

    matrix.appendChild(label("Aggregated view"));
    matrix.appendChild(element("h3", "", "Interaction count matrix"));
    var head = element("thead", "");
    var header = element("tr", "");
    header.appendChild(element("td", ""));
    columns.forEach(function (movie) {
      var cell = element("th", "matrix-movie-column");
      cell.setAttribute("scope", "col");
      cell.appendChild(movieCard(movie));
      header.appendChild(cell);
    });
    head.appendChild(header);
    grid.appendChild(head);
    var body = element("tbody", "");
    users.forEach(function (user, index) {
      var line = element("tr", index === 0 ? "is-example-user" : "");
      var rowLabel = element("th", "", user.id);
      rowLabel.setAttribute("scope", "row");
      line.appendChild(rowLabel);
      columns.forEach(function (movie) {
        var value = user.items.filter(function (itemId) {
          return itemId === movie.id;
        }).length;
        var cell = element("td", "matrix-cell" + (value ? " is-hit" : ""), String(value));
        cell.dataset.movieId = movie.id;
        line.appendChild(cell);
      });
      body.appendChild(line);
    });
    grid.appendChild(body);
    matrix.appendChild(grid);
    matrix.appendChild(element("p", "foundation-caption", "Column order is arbitrary"));

    timeline.appendChild(label("Event view"));
    timeline.appendChild(element("h3", "", "User u17: ordered events"));
    var track = element("ol", "movie-event-track");
    events.forEach(function (movie, itemIndex) {
      var event = element("li", "movie-event");
      event.appendChild(element("span", "movie-event-time", "t" + (itemIndex + 1)));
      event.appendChild(movieCard(movie));
      track.appendChild(event);
    });
    timeline.appendChild(track);
    timeline.appendChild(element("p", "foundation-caption", "Babe occurs twice, at t1 and t4"));

    takeaway.appendChild(element("span", "foundation-takeaway-label", "Information lost"));
    takeaway.appendChild(element("strong", "", "A count matrix preserves frequency, but loses event order, recency, and repeat positions."));
    canvas.appendChild(matrix);
    var bridgeCopy = slide.foundationCopy && slide.foundationCopy.bridge;
    var bridge = element("div", "foundation-bridge", bridgeCopy || "same events →");
    if (typeof bridgeCopy === "string" && window.PresentationEditorRefs) {
      window.PresentationEditorRefs.annotate(bridge, slide, "/foundationCopy/bridge");
    }
    canvas.appendChild(bridge);
    canvas.appendChild(timeline);
    canvas.appendChild(takeaway);
    content.appendChild(canvas);
  }


  function point(text) {
    var item = element("li", "foundation-point");
    item.appendChild(element("span", "foundation-point-dot", ""));
    item.appendChild(element("span", "", text));
    return item;
  }

  function rationaleCard(className, step, title, points) {
    var card = stage("rationale-card " + className, step);
    card.appendChild(element("h3", "", title));
    var list = element("ul", "foundation-points");
    points.forEach(function (text) { list.appendChild(point(text)); });
    card.appendChild(list);
    return card;
  }

  function renderMovieLensRationale(slide, content) {
    var copy = slide.foundationCopy || {};
    var canvas = element("div", "foundation-canvas movielens-rationale");
    var catalog = stage("movielens-catalog", 0);
    catalog.appendChild(label("Illustrative rating events"));
    var posters = element("div", "movielens-poster-row");
    var movies = window.CanonicalMoviePredictionExample.history.concat(
      window.CanonicalMoviePredictionExample.recommendations
    );
    movies.forEach(function (movie, index) {
      var event = slide.exampleEvents[index];
      var card = element("figure", "movielens-example-card");
      var eventLabel = element("div", "movielens-event-label");
      eventLabel.appendChild(element("span", "movielens-event-user", event.user));
      var rating = element("span", "movielens-event-rating", "★".repeat(event.rating) + "☆".repeat(5 - event.rating));
      rating.setAttribute("role", "img");
      rating.setAttribute("aria-label", event.rating + " out of 5 stars");
      eventLabel.appendChild(rating);
      card.appendChild(eventLabel);
      var image = element("img", "");
      var posterUrl = window.GSASRecPosterAssets.urlForOriginalId(movie.id);
      if (posterUrl) image.src = posterUrl;
      image.alt = movie.title;
      card.appendChild(image);
      card.appendChild(element("figcaption", "", movie.title));
      posters.appendChild(card);
    });
    catalog.appendChild(posters);
    canvas.appendChild(catalog);

    var dataset = stage("movielens-dataset", 1);
    dataset.appendChild(label("MovieLens 1M release"));
    var stats = element("dl", "movielens-stats");
    [
      ["ratings", "ratingsLabel"],
      ["users", "usersLabel"],
      ["ratedMovies", "ratedMoviesLabel"]
    ].forEach(function (fields) {
      var stat = element("div", "movielens-stat");
      stat.appendChild(authorText("dd", "", copy[fields[0]], slide, "/foundationCopy/" + fields[0]));
      stat.appendChild(authorText("dt", "", copy[fields[1]], slide, "/foundationCopy/" + fields[1]));
      stats.appendChild(stat);
    });
    dataset.appendChild(stats);
    var context = element("div", "movielens-context");
    context.appendChild(authorText("span", "", copy.period, slide, "/foundationCopy/period"));
    context.appendChild(authorText("span", "", copy.release, slide, "/foundationCopy/release"));
    context.appendChild(authorText("span", "", copy.ratingFormat, slide, "/foundationCopy/ratingFormat"));
    dataset.appendChild(context);
    var link = authorText("a", "movielens-link", copy.datasetLink, slide, "/foundationCopy/datasetLink");
    link.href = "https://grouplens.org/datasets/movielens/1m/";
    dataset.appendChild(link);
    canvas.appendChild(dataset);

    var rationale = element("div", "movielens-considerations");
    [
      ["teachingTitle", "teachingPoints"],
      ["limitationsTitle", "limitationsPoints"]
    ].forEach(function (fields, index) {
      var section = stage("movielens-consideration", 2 + index);
      section.appendChild(authorText("h3", "", copy[fields[0]], slide, "/foundationCopy/" + fields[0]));
      var points = element("ul", "movielens-consideration-points");
      (copy[fields[1]] || []).forEach(function (text, index) {
        var item = element("li", "");
        item.appendChild(authorText("span", "", text, slide, "/foundationCopy/" + fields[1] + "/" + index));
        points.appendChild(item);
      });
      section.appendChild(points);
      rationale.appendChild(section);
    });
    canvas.appendChild(rationale);
    content.appendChild(canvas);
  }

  function render(slide, content) {
    if (slide.foundationVisual === "matrix-timeline") renderMatrixTimeline(slide, content);
    if (slide.foundationVisual === "movielens-rationale") renderMovieLensRationale(slide, content);
  }

  window.FoundationsVisual = { render: render };
})();
