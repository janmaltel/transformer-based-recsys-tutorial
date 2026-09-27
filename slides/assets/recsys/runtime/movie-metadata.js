(function (root) {
  "use strict";

  var storageKey = "gsasrec-ml1m-movie-metadata-v1";
  var state = root.GSASRecMovieMetadata || null;
  var bundledCatalog = root.GSASRecMovieCatalog || null;

  function storage() {
    try {
      return typeof window !== "undefined" ? window.localStorage : null;
    } catch (_error) {
      return null;
    }
  }

  function parseTitle(value) {
    var match = value.match(/^(.*) \((\d{4})\)$/);
    return {
      title: match ? match[1] : value,
      year: match ? Number(match[2]) : null
    };
  }

  function parseMoviesText(text) {
    var mapped = root.GSASRecMappings.originalItemToSas;
    var items = {};
    text.split(/\r?\n/).forEach(function (line) {
      if (!line) {
        return;
      }
      var fields = line.split("::");
      var originalId = Number(fields[0]);
      if (!mapped[originalId] || fields.length < 3) {
        return;
      }
      var parsedTitle = parseTitle(fields.slice(1, -1).join("::"));
      items[originalId] = {
        title: parsedTitle.title,
        year: parsedTitle.year,
        genres: fields[fields.length - 1].split("|")
      };
    });
    return items;
  }

  function parsePostersText(text) {
    var lines = text.split(/\r?\n/).filter(Boolean);
    var headers = (lines.shift() || "").split("\t");
    var idIndex = headers.indexOf("movie_id");
    var urlIndex = headers.indexOf("poster_link");
    if (idIndex < 0 || urlIndex < 0) {
      throw new Error("Poster TSV needs movie_id and poster_link columns");
    }
    var posters = {};
    lines.forEach(function (line) {
      var fields = line.split("\t");
      var originalId = Number(fields[idIndex]);
      var url = (fields[urlIndex] || "").trim();
      if (Number.isInteger(originalId) &&
        root.GSASRecMappings.originalItemToSas[originalId] &&
        safePosterUrl(url)) {
        posters[originalId] = url;
      }
    });
    return posters;
  }

  function safePosterUrl(value) {
    var url = String(value || "");
    if (!url || /[\s\u0000-\u001f]/.test(url)) {
      return false;
    }
    try {
      var parsed = new URL(url);
      return parsed.protocol === "https:" &&
        parsed.hostname === "image.tmdb.org" &&
        !parsed.username && !parsed.password;
    } catch (_error) {
      return false;
    }
  }

  function searchItems(items, query, limit) {
    return root.GSASRecBrowser.fuzzySearch.searchItems(
      items,
      query,
      limit,
      function (originalId) {
        return root.GSASRecMappings.originalItemToSas[originalId];
      }
    );
  }

  function restore() {
    var local = storage();
    if (!state && local) {
      try {
        var stored = local.getItem(storageKey);
        state = stored ? JSON.parse(stored) : null;
      } catch (_error) {
        state = null;
      }
    }
    if (!state && bundledCatalog) {
      state = bundledCatalog;
    }
    if (state) {
      root.GSASRecMovieMetadata = state;
    }
  }

  function set(items, source, persist) {
    if (Object.keys(items).length !== 3416) {
      throw new Error("Expected metadata for all 3,416 mapped movies");
    }
    state = { items: items, source: source };
    root.GSASRecMovieMetadata = state;
    var local = storage();
    if (persist && local) {
      try {
        local.setItem(storageKey, JSON.stringify(state));
      } catch (_error) {
        // The page can continue with the in-memory copy.
      }
    }
    root.dispatchEvent(new CustomEvent("gsasrec-metadatachange"));
  }

  async function importFile(file) {
    var bytes = await file.arrayBuffer();
    var text = new TextDecoder("iso-8859-1").decode(bytes);
    set(
      parseMoviesText(text),
      { kind: "browser-import", name: file.name },
      true
    );
  }

  async function importPostersFile(file) {
    if (!state || !state.items) {
      throw new Error("Load movies.dat before importing poster links");
    }
    var posters = parsePostersText(await file.text());
    var items = {};
    Object.keys(state.items).forEach(function (originalId) {
      var movie = state.items[originalId];
      items[originalId] = Object.assign({}, movie);
      if (posters[originalId]) {
        items[originalId].posterUrl = posters[originalId];
      }
    });
    var count = Object.keys(posters).filter(function (originalId) {
      return Boolean(items[originalId]);
    }).length;
    if (!count) {
      throw new Error("No poster links matched the 3,416 model movies");
    }
    set(
      items,
      {
        kind: "browser-import",
        name: state.source.name + " + " + file.name
      },
      true
    );
  }

  function getByOriginal(originalId) {
    return state && state.items ? state.items[originalId] || null : null;
  }

  function getBySas(sasId) {
    var originalId = root.GSASRecBrowser.idMapping.mapId(
      "item", "sas-to-original", sasId
    );
    return getByOriginal(originalId);
  }

  function status() {
    var items = state && state.items ? state.items : {};
    return {
      available: Boolean(state && state.items),
      count: Object.keys(items).length,
      posterCount: Object.keys(items).filter(function (originalId) {
        return Boolean(items[originalId].posterUrl);
      }).length,
      source: state ? state.source : null
    };
  }

  function search(query, limit) {
    return searchItems(state && state.items ? state.items : {}, query, limit);
  }

  function posterDisplayUrl(url) {
    if (!safePosterUrl(url)) {
      return null;
    }
    return String(url).replace(
      "https://image.tmdb.org/t/p/original/",
      "https://image.tmdb.org/t/p/w342/"
    );
  }

  function posterAssetUrl(originalId) {
    var assets = root.GSASRecPosterAssets;
    return assets && assets.urlForOriginalId
      ? assets.urlForOriginalId(originalId)
      : null;
  }

  function posterSources(originalId, tmdbUrl) {
    var assets = root.GSASRecPosterAssets;
    if (assets && assets.sourcesForOriginalId) {
      return assets.sourcesForOriginalId(originalId, tmdbUrl);
    }
    return { primaryUrl: posterDisplayUrl(tmdbUrl), fallbackUrl: null };
  }

  restore();
  root.GSASRecBrowser.movieMetadata = {
    getByOriginal: getByOriginal,
    getBySas: getBySas,
    importFile: importFile,
    importPostersFile: importPostersFile,
    parseMoviesText: parseMoviesText,
    parsePostersText: parsePostersText,
    posterAssetUrl: posterAssetUrl,
    posterDisplayUrl: posterDisplayUrl,
    posterSources: posterSources,
    search: search,
    searchItems: searchItems,
    status: status
  };
})(globalThis);
