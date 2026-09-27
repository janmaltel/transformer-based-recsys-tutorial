(function (root) {
  "use strict";

  var cache = typeof WeakMap === "function" ? new WeakMap() : null;

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function articleAlias(title) {
    var match = String(title || "").match(/^(.*),\s*(the|a|an)$/i);
    return match ? normalize(match[2] + " " + match[1]) : "";
  }

  function distanceWithin(left, right, maximum) {
    if (Math.abs(left.length - right.length) > maximum) return maximum + 1;
    var previousPrevious = null;
    var previous = Array.from({ length: right.length + 1 }, function (_, index) {
      return index;
    });

    for (var row = 1; row <= left.length; row += 1) {
      var current = [row];
      var rowMinimum = row;
      for (var column = 1; column <= right.length; column += 1) {
        var substitution = previous[column - 1] +
          (left[row - 1] === right[column - 1] ? 0 : 1);
        var value = Math.min(
          previous[column] + 1,
          current[column - 1] + 1,
          substitution
        );
        if (
          previousPrevious && row > 1 && column > 1 &&
          left[row - 1] === right[column - 2] &&
          left[row - 2] === right[column - 1]
        ) {
          value = Math.min(value, previousPrevious[column - 2] + 1);
        }
        current[column] = value;
        rowMinimum = Math.min(rowMinimum, value);
      }
      if (rowMinimum > maximum) return maximum + 1;
      previousPrevious = previous;
      previous = current;
    }
    return previous[right.length];
  }

  function fuzzyLimit(token) {
    if (token.length < 4) return 0;
    return token.length < 8 ? 1 : 2;
  }

  function tokenCost(token, candidates) {
    var best = Infinity;
    candidates.forEach(function (candidate) {
      if (candidate === token) {
        best = 0;
      } else if (candidate.indexOf(token) === 0) {
        best = Math.min(best, 0.2 + (candidate.length - token.length) * 0.01);
      } else if (token.length >= 3 && candidate.indexOf(token) >= 0) {
        best = Math.min(best, 0.45 + candidate.indexOf(token) * 0.01);
      } else {
        var maximum = fuzzyLimit(token);
        if (maximum) {
          var distance = distanceWithin(token, candidate, maximum);
          if (distance <= maximum) best = Math.min(best, 1 + distance * 0.5);
        }
      }
    });
    return best;
  }

  function makeIndex(items) {
    if (cache && cache.has(items)) return cache.get(items);
    var index = Object.keys(items).map(function (originalIdText) {
      var originalId = Number(originalIdText);
      var movie = items[originalId];
      var title = normalize(movie.title);
      var alias = articleAlias(movie.title);
      var titlePhrases = alias ? [title, alias] : [title];
      return {
        originalId: originalId,
        movie: movie,
        title: title,
        titlePhrases: titlePhrases,
        titleTokens: Array.from(new Set(titlePhrases.join(" ").split(/\s+/))),
        genreTokens: normalize((movie.genres || []).join(" ")).split(/\s+/).filter(Boolean),
        year: String(movie.year || "")
      };
    });
    if (cache) cache.set(items, index);
    return index;
  }

  function rank(entry, needle, tokens) {
    var exactPhrase = entry.titlePhrases.indexOf(needle) >= 0;
    var prefixPhrase = entry.titlePhrases.some(function (phrase) {
      return phrase.indexOf(needle) === 0;
    });
    var substringPhrase = entry.titlePhrases.some(function (phrase) {
      return phrase.indexOf(needle) >= 0;
    });
    var totalCost = 0;
    var allTitle = true;
    var allExactTitle = true;

    for (var index = 0; index < tokens.length; index += 1) {
      var token = tokens[index];
      var titleCost = tokenCost(token, entry.titleTokens);
      if (titleCost < Infinity) {
        totalCost += titleCost;
        allExactTitle = allExactTitle && titleCost === 0;
        continue;
      }
      allTitle = false;
      allExactTitle = false;
      if (token === entry.year) {
        totalCost += 0.6;
        continue;
      }
      var genreCost = tokenCost(token, entry.genreTokens);
      if (genreCost < Infinity) {
        totalCost += 2 + genreCost;
        continue;
      }
      return null;
    }

    var tier = exactPhrase ? 0 : prefixPhrase ? 1 : substringPhrase ? 2 :
      allExactTitle ? 3 : allTitle ? 4 : 5;
    return {
      tier: tier,
      cost: totalCost,
      tokenDelta: Math.abs(entry.titleTokens.length - tokens.length)
    };
  }

  function searchItems(items, query, limit, mapOriginalToSas) {
    var needle = normalize(query);
    if (!needle) return [];
    var tokens = needle.split(/\s+/);
    return makeIndex(items)
      .map(function (entry) {
        var ranking = rank(entry, needle, tokens);
        if (!ranking) return null;
        var movie = entry.movie;
        return {
          originalId: entry.originalId,
          sasId: mapOriginalToSas(entry.originalId),
          title: movie.title,
          year: movie.year,
          genres: movie.genres || [],
          posterUrl: movie.posterUrl || null,
          score: ranking.tier * 100 + ranking.cost,
          matchType: ["exact", "prefix", "phrase", "tokens", "fuzzy", "metadata"][ranking.tier],
          _ranking: ranking
        };
      })
      .filter(Boolean)
      .sort(function (left, right) {
        return left._ranking.tier - right._ranking.tier ||
          left._ranking.cost - right._ranking.cost ||
          left._ranking.tokenDelta - right._ranking.tokenDelta ||
          left.title.length - right.title.length ||
          left.title.localeCompare(right.title) ||
          left.originalId - right.originalId;
      })
      .slice(0, Math.max(1, Number(limit) || 12))
      .map(function (result) {
        delete result._ranking;
        return result;
      });
  }

  root.GSASRecBrowser = root.GSASRecBrowser || {};
  root.GSASRecBrowser.fuzzySearch = {
    distanceWithin: distanceWithin,
    normalize: normalize,
    searchItems: searchItems
  };
})(globalThis);
