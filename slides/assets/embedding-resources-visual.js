(function (root) {
  "use strict";
  var k = root.DenseRecKit;
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};

  parts["embedding-resource"] = function (content, slide) {
    var frame = k.frame(content, slide);
    frame.host.classList.add("embedding-resource");
    var layout = k.el(frame.body, "div", "embedding-resource-layout");
    var figure = k.el(layout, "figure", "embedding-resource-figure");
    var imageLink = k.el(figure, "a", "embedding-resource-image-link");
    imageLink.href = slide.scaling.urls[0];
    imageLink.target = "_blank"; imageLink.rel = "noopener noreferrer";
    var img = k.el(imageLink, "img");
    img.src = slide.scaling.figure; img.alt = slide.scaling.figureAlt;
    k.copy(figure, "figcaption", "dr-label", slide, "/scaling/formula", slide.scaling.formula);
    var links = k.el(layout, "div", "embedding-resource-links");
    slide.scaling.points.forEach(function (point, i) {
      var section = k.el(links, "section");
      var heading = k.el(section, "h3");
      var link = k.copy(heading, "a", "", slide, "/scaling/points/" + i + "/label", point.label);
      link.href = slide.scaling.urls[i];
      link.target = "_blank"; link.rel = "noopener noreferrer";
      k.copy(section, "p", "", slide, "/scaling/points/" + i + "/body", point.body);
    });
  };

  parts["movie-content-encoding"] = function (content, slide) {
    var frame = k.frame(content, slide);
    frame.host.classList.add("movie-content-encoding");
    var flow = k.el(frame.body, "div", "movie-content-flow");
    var movie = slide.scaling.movie;

    var record = k.el(flow, "section", "movie-content-record");
    k.el(record, "p", "movie-content-kicker", "Toy Story · movie record");
    var recordBody = k.el(record, "div", "movie-content-record-body");
    var posterFigure = k.el(recordBody, "figure", "movie-content-poster");
    var posterFrame = k.el(posterFigure, "div", "movie-content-poster-frame");
    var posterFallback = k.el(posterFrame, "span", "movie-content-poster-fallback", "Toy Story");
    var poster = k.el(posterFrame, "img");
    poster.src = movie.poster;
    poster.alt = "Toy Story (1995) movie poster; shown for identification, not encoded as image input.";
    poster.addEventListener("error", function () {
      poster.hidden = true;
      posterFallback.hidden = false;
    });
    posterFallback.hidden = true;

    var fields = k.el(recordBody, "dl", "movie-content-fields");
    [
      ["Title", movie.title, "title"],
      ["Genres", movie.genres, "genres"],
      ["Description", movie.description, "description"]
    ].forEach(function (field) {
      var row = k.el(fields, "div", "movie-content-field");
      k.el(row, "dt", "", field[0]);
      k.copy(row, "dd", "", slide, "/scaling/movie/" + field[2], field[1]);
    });

    var textArrow = k.el(flow, "div", "movie-content-arrow");
    k.arrow(textArrow, false);
    k.el(textArrow, "span", "", "text fields");

    var encoder = k.el(flow, "section", "movie-content-encoder");
    k.el(encoder, "p", "movie-content-kicker", "Frozen encoder");
    k.el(encoder, "h3", "", "Multilingual E5-small");
    k.el(encoder, "code", "movie-content-prefix", "query:");
    k.el(encoder, "p", "movie-content-processing", "Masked mean pooling\nL2 normalization");

    var outputArrow = k.el(flow, "div", "movie-content-arrow movie-content-output-arrow");
    k.arrow(outputArrow, false);

    var output = k.el(flow, "section", "movie-content-output");
    k.el(output, "p", "movie-content-kicker", "Content vector");
    var values = ["b1", "b3", "a1", "b2", "b1", "a2", "b3", "b2"];
    k.vector(output, values, "Schematic normalized 384-dimensional content embedding c sub i");
    var vectorLabel = k.el(output, "p", "movie-content-vector-label");
    k.el(vectorLabel, "span", "movie-content-ci", "c");
    k.el(vectorLabel, "sub", "", "i");
    k.el(output, "p", "movie-content-vector-dimensions", "384 dimensions · normalized");
  };
})(globalThis);
