(function (root) {
  "use strict";

  var script = typeof document === "undefined" ? null :
    document.currentScript ||
      document.querySelector('script[src*="assets/recsys/data/poster-assets.js"]');
  var baseUrl = new URL(
    "../posters/ml1m/avif-w192-q45-v1/",
    script ? script.src : root.location ? root.location.href :
      "file:///presentation/assets/recsys/data/poster-assets.js"
  ).href;
  var missingOriginalIds = [
    570, 571, 649, 669, 720, 769, 771, 811, 863, 876, 978, 1205, 1294,
    1349, 1362, 1406, 1421, 1423, 1450, 1494, 1514, 1664, 1692, 1720,
    1741, 1743, 1758, 1759, 1901, 2031, 2129, 2156, 2219, 2317, 2645,
    2705, 2776, 2851, 2923, 3027, 3092, 3118, 3158, 3241, 3366, 3416,
    3514, 3532, 3533, 3817, 3883, 3935
  ];
  var missing = {};
  var search = root.location && root.location.search
    ? new URLSearchParams(root.location.search)
    : null;
  var posterMode = search ? search.get("posters") : null;
  var enabled = posterMode !== "off" && posterMode !== "none";

  missingOriginalIds.forEach(function (originalId) {
    missing[originalId] = true;
  });

  function urlForOriginalId(originalId) {
    var id = Number(originalId);
    if (!enabled || !Number.isInteger(id) || id < 1 || id > 3952 ||
      missing[id]) {
      return null;
    }
    if (root.GSASRecMappings &&
      !root.GSASRecMappings.originalItemToSas[id]) {
      return null;
    }
    var padded = String(id).padStart(4, "0");
    return baseUrl + padded.slice(0, 2) + "/" + padded + ".avif";
  }

  function tmdbDisplayUrl(value) {
    try {
      var parsed = new URL(String(value || ""));
      if (parsed.protocol !== "https:" || parsed.hostname !== "image.tmdb.org" ||
        parsed.username || parsed.password) {
        return null;
      }
      return parsed.href.replace("/t/p/original/", "/t/p/w342/");
    } catch (_error) {
      return null;
    }
  }

  function sourcesForOriginalId(originalId, tmdbUrl) {
    var primaryUrl = urlForOriginalId(originalId);
    var fallbackUrl = tmdbDisplayUrl(tmdbUrl);
    return {
      primaryUrl: primaryUrl || fallbackUrl,
      fallbackUrl: primaryUrl ? fallbackUrl : null
    };
  }

  root.GSASRecPosterAssets = {
    version: "avif-w192-q45-v1",
    catalog: "movielens-1m",
    bundled: true,
    format: "avif",
    width: 192,
    quality: 45,
    expectedPosterCount: 3364,
    expectedPayloadBytes: 16833076,
    mappingSha256: "d5b6775d9fba1d542d9b9dc4f85d6a098d5800691d608bedc47522f369764b35",
    manifestSha256: "a234c05ac8bd130ce811caa40b78efa5e65c67615322c13d78fbd28ddd086e83",
    missingOriginalIds: missingOriginalIds,
    baseUrl: baseUrl,
    enabled: enabled,
    sourcesForOriginalId: sourcesForOriginalId,
    tmdbDisplayUrl: tmdbDisplayUrl,
    urlForOriginalId: urlForOriginalId
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
