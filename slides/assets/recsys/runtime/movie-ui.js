(function (root) {
  "use strict";

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function details(sasId, manifest) {
    var input = manifest && manifest.textInputs && manifest.textInputs[sasId];
    if (input) return { sasId: Number(sasId), title: input.text, kind: 'text', year: '', genres: ['Text input'] };
    var ids = root.GSASRecBrowser.idMapping.itemPair(Number(sasId), manifest);
    var movie = root.GSASRecBrowser.movieMetadata.getByOriginal(ids.original);
    if (!movie && manifest && manifest.catalog) movie = manifest.catalog.items[ids.original];
    var posters = root.GSASRecBrowser.movieMetadata.posterSources(
      ids.original,
      movie && movie.posterUrl
    );
    return {
      sasId: ids.sas,
      originalId: ids.original,
      namespace: movie && movie.namespace,
      title: movie ? movie.title : "Movie " + ids.original,
      year: movie && movie.year ? String(movie.year) : "",
      genres: movie ? movie.genres || [] : [],
      posterUrl: posters.primaryUrl,
      posterFallbackUrl: posters.fallbackUrl
    };
  }

  function resultDetails(result) {
    var posters = root.GSASRecBrowser.movieMetadata.posterSources(
      result.originalId,
      result.posterUrl
    );
    return {
      sasId: Number(result.sasId),
      originalId: Number(result.originalId),
      namespace: result.namespace,
      title: result.title,
      year: result.year ? String(result.year) : "",
      genres: result.genres || [],
      posterUrl: posters.primaryUrl,
      posterFallbackUrl: posters.fallbackUrl
    };
  }

  function poster(item, className) {
    var shell = element("span", "sasrec-poster " + (className || ""));
    if (item.kind === 'text') {
      shell.classList.add('sasrec-text-poster');
      shell.setAttribute('aria-hidden', 'true');
      shell.appendChild(element('span', 'sasrec-text-quote', '“'));
      shell.appendChild(element('span', 'sasrec-text-phrase', item.title));
      return shell;
    }
    var fallback = element("span", "sasrec-poster-fallback", item.year || "Movie");
    fallback.setAttribute("aria-hidden", "true");
    shell.appendChild(fallback);
    if (item.posterUrl) {
      var image = element("img");
      image.src = item.posterUrl;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", function () {
        if (item.posterFallbackUrl) {
          image.src = item.posterFallbackUrl;
          item.posterFallbackUrl = null;
          return;
        }
        shell.classList.add("is-missing");
      });
      shell.appendChild(image);
    } else {
      shell.classList.add("is-missing");
    }
    return shell;
  }

  function measureInlineYear(title) {
    var name = title.querySelector(".sasrec-movie-name");
    var year = title.querySelector(".sasrec-year");
    if (!name || !year || !title.isConnected || !title.clientWidth) return;
    year.hidden = false;
    if (title.classList.contains("sasrec-external-title")) return;
    year.style.visibility = "hidden";
    var style = root.getComputedStyle(title);
    var gap = parseFloat(style.columnGap || style.gap) || 0;
    var fits = name.scrollWidth + year.offsetWidth + gap <= title.clientWidth + 0.5;
    year.style.visibility = "";
    year.hidden = !fits;
  }

  function measureInlineYears() {
    Array.prototype.forEach.call(
      root.document.querySelectorAll(".sasrec-movie-title"),
      measureInlineYear
    );
  }

  function fitInlineYear(title, year) {
    if (!year) return;
    root.requestAnimationFrame(function () {
      root.requestAnimationFrame(function () { measureInlineYear(title); });
    });
  }

  function copy(item) {
    var shell = element("span", "sasrec-movie-copy");
    var title = element("strong", "sasrec-movie-title" +
      (item.namespace === "tutorial-external" ? " sasrec-external-title" : ""));
    var name = element("span", "sasrec-movie-name", item.title);
    var year = item.year
      ? element("span", "sasrec-year", "(" + item.year + ")")
      : null;
    title.appendChild(name);
    if (year) title.appendChild(year);
    shell.appendChild(title);
    shell.appendChild(element("small", "sasrec-genres", item.genres.join(" · ") || "MovieLens 1M"));
    fitInlineYear(title, year);
    return shell;
  }

  root.addEventListener("resize", measureInlineYears);
  if (root.document.fonts && root.document.fonts.ready) {
    root.document.fonts.ready.then(measureInlineYears);
  }

  root.SASRecPlayground = root.SASRecPlayground || {};
  root.SASRecPlayground.movieUI = {
    copy: copy,
    details: details,
    element: element,
    poster: poster,
    resultDetails: resultDetails
  };
})(globalThis);
