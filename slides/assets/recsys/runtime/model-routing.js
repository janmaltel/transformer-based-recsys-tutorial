(function (root) {
  "use strict";
  var ui = root.SASRecPlayground.movieUI;

  function description(manifest) {
    var serving = manifest.serving;
    if (!serving) return {
      summary: manifest.config.numItems.toLocaleString() + " catalog items · ID embeddings",
      print: "SASRec · original playground checkpoint",
      note: "ID embeddings only. Inputs must belong to this checkpoint’s catalog; its training split differs from the content models."
    };
    var epochs = serving.epochs == null ? 20 : serving.epochs;
    var result = { summary: epochs + " epochs · " + serving.knownCount.toLocaleString() + " trained · " + serving.coldCount + " unseen",
      print: "DenseRec p=" + serving.pDense + " · " + epochs + " epochs",
      note: !serving.coldCount ? "ID only: the content path is untrained; unseen items are unsupported."
        : (serving.kind === "content-only" ? "Content path for every movie. " : "Unseen = no training interactions; content path. ") + "Cold-start accuracy unmeasured." };
    if (serving.kind === "nearest-warm") {
      result.summary = "SASRec · " + epochs + " epochs · " + serving.coldCount + " unseen";
      result.print = "NearestWarmRecommender · SASRec · " + epochs + " epochs";
      if (serving.baseModelId === "gsasrec-ml1m") {
        result.summary = "gSASRec · first playground · " + serving.coldCount + " outside catalog";
        result.print = "Nearest-warm · original playground gSASRec";
      }
      result.note = "Cold/text → nearest warm ID; SASRec uses the sequence. Cold candidates share their proxy’s vector and score.";
    }
    if (serving.baseModelId) {
      result.note = "Cold/text → nearest warm ID; gSASRec uses the sequence. Cold candidates share proxy scores. Cold = outside the base catalog.";
    }
    if (serving.kind === "content-knn") {
      result.summary = "Cosine · last input · " + manifest.config.embeddingDim + "D";
      result.print = "KNNRecommender · last input · cosine";
      result.note = "Last input’s content → content cosine. No transformer. Warm/unseen refer to the SASRec training split.";
    }
    var encoder = (manifest.source && manifest.source.contentEncoder || {}).model_name ||
      (manifest.textInputSource || {}).encoder || "";
    var encoderLabel = encoder.indexOf("multilingual-e5-small") >= 0 ? "E5-small" : "MiniLM";
    result.summary = encoderLabel + " · " + result.summary;
    result.print = encoderLabel + " · " + result.print;
    if (encoderLabel === "E5-small") result.note += " E5: title, genres, descriptions.";
    if (manifest.config.maskPaddingKeys) {
      result.print += " · padding masked";
      result.note += " Padding keys excluded from attention.";
    }
    return result;
  }

  function decorate(card, id, manifest, isCold) {
    var serving = manifest.serving || {};
    var kind = serving.kind;
    var isText = id < 0;
    var contentOnly = kind === "content-only" || kind === "content-knn";
    var proxyId = (serving.warmProxyIds || {})[id];
    var nearestWarmCold = kind === "nearest-warm" && (isCold || Boolean(proxyId));
    var route = nearestWarmCold ? "❄️" : proxyId ? "Warm proxy"
      : isText ? "Text" : isCold ? "Unseen" : contentOnly ? "Content" : "ID";
    card.classList.toggle("sasrec-is-cold", isCold || Boolean(proxyId));
    var routeClass = "sasrec-item-route" + (nearestWarmCold ? " sasrec-route-cold" : "");
    var marker = ui.element("span", routeClass, route);
    if (nearestWarmCold) {
      marker.setAttribute("role", "img");
      marker.setAttribute("aria-label", "Cold item");
      marker.title = "Cold item";
      card.querySelector(".sasrec-poster").appendChild(marker);
    } else {
      card.appendChild(marker);
    }
    var detail = isText ? " · text, content path" : isCold ? " · unseen, content path"
      : contentOnly ? " · trained content path" : " · trained ID path";
    if (kind === "content-knn") detail = isCold ? " · unseen, content cosine" : " · content cosine";
    if (proxyId) {
      var proxy = ui.details(proxyId, manifest);
      var label = ui.element("span", "sasrec-warm-proxy");
      label.appendChild(ui.poster(proxy, "sasrec-warm-proxy-poster"));
      label.appendChild(ui.element("span", "sasrec-warm-proxy-title", "→ " + proxy.title));
      label.title = "Uses the learned ID embedding of " + proxy.title;
      card.appendChild(label);
      detail = " · cold item, uses nearest warm neighbor: " + proxy.title;
    }
    var text = card.getAttribute("aria-label");
    if (text) card.setAttribute("aria-label", text + detail);
  }

  root.SASRecPlayground.modelRouting = { description: description, decorate: decorate };
})(globalThis);
