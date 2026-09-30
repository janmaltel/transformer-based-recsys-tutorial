(function () {
  "use strict";

  var slides = window.PresentationSlides || [];
  var deck = document.querySelector("#deck");
  var current = 0;
  var buildStage = 0;
  var editorRefs = window.PresentationEditorRefs;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function authorText(node, slide, pointer, kind) {
    return editorRefs
      ? editorRefs.annotate(node, slide, pointer, { kind: kind })
      : node;
  }

  function renderColumns(slide, content) {
    var columns = element("div", "columns");
    slide.columns.forEach(function (column, index) {
      var card = element("article", "column");
      card.style.setProperty("--delay", index * 80 + "ms");
      var pointer = "/columns/" + index;
      card.appendChild(authorText(element("span", "column-label", column.label), slide, pointer + "/label"));
      card.appendChild(authorText(element("h3", "", column.title), slide, pointer + "/title"));
      card.appendChild(authorText(element("p", "", column.body), slide, pointer + "/body"));
      columns.appendChild(card);
    });
    content.appendChild(columns);
  }

  function renderPresenters(slide, content) {
    var list = element("div", "presenter-list");
    slide.presenters.forEach(function (presenter, index) {
      var card = element("article", "presenter");
      var details = element("div", "presenter-details");
      var pointer = "/presenters/" + index;
      details.appendChild(authorText(element("strong", "presenter-name", presenter.name), slide, pointer + "/name"));
      details.appendChild(authorText(element("span", "presenter-role", presenter.role), slide, pointer + "/role"));
      var contact = presenter.emailInline ? element("span", "presenter-contact") : details;
      contact.appendChild(authorText(element("span", "presenter-affiliation", presenter.affiliation), slide, pointer + "/affiliation"));
      if (presenter.email) {
        var email = element("a", "presenter-email", presenter.email);
        email.href = "mailto:" + presenter.email;
        contact.appendChild(authorText(email, slide, pointer + "/email"));
      }
      if (presenter.emailInline) details.appendChild(contact);
      card.appendChild(details);
      list.appendChild(card);
    });
    content.appendChild(list);
  }

  function renderRepository(slide, content) {
    var repository = slide.repository;
    var resource = element("div", "title-repository");
    resource.appendChild(element("span", "title-repository-label", "Tutorial site"));
    var link = element("a", "title-repository-link", repository.label || repository.url);
    link.href = repository.url;
    if (repository.label) authorText(link, slide, "/repository/label");
    resource.appendChild(link);
    if (repository.qrImage) {
      resource.classList.add("title-repository-with-qr");
      var image = element("img", "title-repository-qr");
      image.src = repository.qrImage;
      image.alt = "QR code for the tutorial site";
      resource.appendChild(image);
    }
    content.appendChild(resource);
  }

  function folio(index) {
    return String(index + 1).padStart(2, "0") + " / " +
      String(slides.length).padStart(2, "0");
  }

  function playgroundComposition(slide) {
    var value = slide.playground && slide.playground.composition;
    return value === "instrument" ? "instrument" : "teaching";
  }

  function renderFocusTitle(slide, main) {
    if (slide.blockDivider) {
      main.appendChild(authorText(element("p", "focus-block-label", slide.eyebrow), slide, "/eyebrow"));
    }
    var heading = element("h2", "focus-title");
    var value = slide.title;
    var term = slide.focusTerm || "";
    var index = term ? value.toLowerCase().indexOf(term.toLowerCase()) : -1;
    if (index < 0) {
      heading.textContent = value;
    } else {
      if (index) heading.appendChild(document.createTextNode(value.slice(0, index)));
      heading.appendChild(element("mark", "focus-term", value.slice(index, index + term.length)));
      if (index + term.length < value.length) {
        heading.appendChild(document.createTextNode(value.slice(index + term.length)));
      }
    }
    main.appendChild(authorText(heading, slide, "/title"));
  }

  function renderSlideHeader(slide, index, content) {
    if (slide.type === "title" || slide.type === "section-placeholder" || slide.type === "focus") return;
    var header = element("header", "slide-header");
    var instrumentPlayground = slide.type === "playground" &&
      playgroundComposition(slide) === "instrument";
    var eyebrow = instrumentPlayground
      ? "Playground · sequence builder"
      : slide.eyebrow;
    var right = instrumentPlayground
      ? slide.playground.modelLabel || "gSASRec · MovieLens-1M"
      : folio(index);
    var eyebrowNode = element("span", "slide-header-eyebrow", eyebrow);
    if (!instrumentPlayground) authorText(eyebrowNode, slide, "/eyebrow");
    header.appendChild(eyebrowNode);
    header.appendChild(element("span", "slide-header-folio", right));
    content.appendChild(header);
  }

  function renderSlideFooter(slide, content) {
    var citation = slide.citation || slide.reference;
    if (slide.footerReference) {
      var reference = slide.footerReference;
      var linkedFooter = element("footer", "slide-footer");
      var linkedSource = element("cite", "slide-footer-citation");
      var modelCard = authorText(element("a", "", reference.label), slide, "/footerReference/label");
      modelCard.href = reference.url;
      modelCard.title = reference.detail || reference.label;
      modelCard.target = "_blank";
      modelCard.rel = "noopener noreferrer";
      linkedSource.appendChild(modelCard);
      if (reference.detail) {
        linkedSource.appendChild(document.createTextNode(" · "));
        linkedSource.appendChild(authorText(element("span", "", reference.detail), slide, "/footerReference/detail"));
      }
      linkedFooter.appendChild(linkedSource);
      renderFooterResources(slide, linkedFooter);
      content.appendChild(linkedFooter);
      return;
    }
    if (slide.citationKeys && slide.citationKeys.length) {
      var registry = window.PresentationCitations || {};
      var sources = element("cite", "slide-footer-citation");
      slide.citationKeys.forEach(function (key, index) {
        var entry = registry[key];
        if (!entry) throw new Error("Unknown bibliography key: " + key);
        if (index) sources.appendChild(document.createTextNode(" · "));
        var link = element("a", "", entry.label);
        link.href = entry.url; link.title = entry.title;
        link.target = "_blank"; link.rel = "noopener";
        sources.appendChild(link);
      });
      var sourceFooter = element("footer", "slide-footer");
      sourceFooter.appendChild(sources);
      renderFooterResources(slide, sourceFooter);
      content.appendChild(sourceFooter);
      return;
    }
    if (slide.type === "playground" || (!citation && !slide.footerResources)) return;
    var footer = element("footer", "slide-footer");
    var pointer = slide.citation ? "/citation" : "/reference";
    if (citation) footer.appendChild(authorText(element("cite", "slide-footer-citation", citation), slide, pointer));
    renderFooterResources(slide, footer);
    content.appendChild(footer);
  }

  function renderFooterResources(slide, footer) {
    var resources = slide.footerResources;
    if (!resources || !resources.links || !resources.links.length) return;
    footer.classList.add("slide-footer-with-resources");
    var row = element("span", "slide-footer-citation");
    row.appendChild(authorText(element("span", "", resources.label), slide, "/footerResources/label"));
    row.appendChild(document.createTextNode(" ("));
    resources.links.forEach(function (resource, index) {
      if (index) row.appendChild(document.createTextNode(", "));
      var link = element("a", "", String(index + 1));
      link.href = resource.url;
      link.title = resource.title;
      link.setAttribute("aria-label", resource.title);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      row.appendChild(link);
    });
    row.appendChild(document.createTextNode(")"));
    footer.appendChild(row);
  }

  function renderSectionDivider(slide, index, content) {
    var sectionSlides = slides.filter(function (candidate) {
      return candidate.type === "section-placeholder";
    });
    var sectionIndex = sectionSlides.indexOf(slide);
    var layout = element("div", "section-layout");
    var copy = element("div", "section-copy");
    var number = String(sectionIndex + 1).padStart(2, "0");
    copy.appendChild(authorText(element("p", "section-kicker", slide.eyebrow), slide, "/eyebrow"));
    var heading = element("div", "section-heading");
    heading.appendChild(element("span", "section-number", number));
    heading.appendChild(authorText(element("h2", "", slide.title), slide, "/title"));
    copy.appendChild(heading);
    layout.appendChild(copy);

    var agenda = element("div", "section-agenda");
    (slide.topics || []).forEach(function (topic, topicIndex) {
      var row = element(
        "div",
        "section-agenda-row is-current"
      );
      row.appendChild(element(
        "span",
        "section-agenda-number",
        "—"
      ));
      row.appendChild(authorText(
        element("span", "section-agenda-title", topic),
        slide,
        "/topics/" + topicIndex
      ));
      agenda.appendChild(row);
    });
    layout.appendChild(agenda);
    content.appendChild(layout);
  }

  function buildSlide(slide, index) {
    var section = element("section", "slide slide-" + slide.type);
    if (slide.sectionDivider) {
      section.classList.add("slide-section-divider", "section-kind-" + slide.sectionKind);
    }
    if (slide.type === "playground") {
      section.classList.add("playground-composition-" + playgroundComposition(slide));
    }
    if (slide.scaling) section.classList.add("slide-scaling");
    section.id = slide.id;
    section.dataset.index = index;
    section.setAttribute("aria-hidden", "true");
    if (editorRefs) editorRefs.slideRoot(section, slide);

    var content = element("div", "slide-content");
    var main = element("div", "slide-main");
    renderSlideHeader(slide, index, content);

    if (slide.sectionDivider && window.SectionDividerVisual) {
      window.SectionDividerVisual.render(slide, main);
    } else if (slide.type === "section-placeholder") {
      renderSectionDivider(slide, index, main);
    } else if (slide.type === "focus") {
      renderFocusTitle(slide, main);
    } else if (slide.type === "title") {
      var titleCopy = element("div", "title-copy");
      titleCopy.appendChild(authorText(element("p", "eyebrow", slide.eyebrow), slide, "/eyebrow"));
      var titleHeading = element("h1", "");
      if (slide.titleLines) {
        slide.titleLines.forEach(function (line, lineIndex) {
          titleHeading.appendChild(authorText(
            element("span", "", line),
            slide,
            "/titleLines/" + lineIndex
          ));
        });
      } else {
        titleHeading.textContent = slide.title;
        authorText(titleHeading, slide, "/title");
      }
      titleCopy.appendChild(titleHeading);
      main.appendChild(titleCopy);
      if (slide.presenters) renderPresenters(slide, main);
      if (slide.attribution) {
        var credit = element("p", "title-attribution");
        credit.appendChild(authorText(element("span", "", slide.attribution.text), slide, "/attribution/text"));
        credit.appendChild(document.createTextNode(" "));
        var creditLink = authorText(element("a", "", slide.attribution.label), slide, "/attribution/label");
        creditLink.href = slide.attribution.url;
        creditLink.target = "_blank";
        creditLink.rel = "noopener noreferrer";
        credit.appendChild(creditLink);
        credit.appendChild(document.createTextNode("."));
        main.appendChild(credit);
      }
      if (slide.repository) renderRepository(slide, main);
    } else {
      if (slide.type !== "playground" || playgroundComposition(slide) === "teaching") {
        var title = element("h2", "");
        title.textContent = slide.title;
        authorText(title, slide, "/title");
        main.appendChild(title);
      }
      if (slide.type !== "playground") {
        if (slide.subtitle) {
          main.appendChild(authorText(
            element("p", "subtitle", slide.subtitle),
            slide,
            "/subtitle",
            editorRefs && editorRefs.kindFor(slide.subtitle)
          ));
        }
        if (slide.body) {
          var body = element(slide.type === "citation" ? "pre" : "p", "statement-body");
          if (slide.bodyLead) {
            body.appendChild(authorText(element("strong", "", slide.bodyLead), slide, "/bodyLead"));
            body.appendChild(document.createTextNode(" "));
          }
          body.appendChild(authorText(element(slide.type === "citation" ? "code" : "span", "statement-body-copy", slide.body), slide, "/body"));
          main.appendChild(body);
        }
      }
      if (slide.columns) renderColumns(slide, main);
      if (slide.type === "references" && window.ReferencesVisual) window.ReferencesVisual.render(slide, main);
      if (slide.type === "materials" && window.MaterialsVisual) window.MaterialsVisual.render(slide, main);
      if (slide.visual && window.DefinitionVisual) window.DefinitionVisual.render(main);
      if (slide.goals && window.GoalsVisual) window.GoalsVisual.render(slide, main);
      if (slide.guiding && window.GuidingQuestionVisual) window.GuidingQuestionVisual.render(slide, main);
      if (slide.foundationVisual && window.FoundationsVisual) window.FoundationsVisual.render(slide, main);
      if (slide.sasrecVisual && window.SASRecVisual) window.SASRecVisual.render(slide, main);
      if (slide.playground && window.PlaygroundVisual) window.PlaygroundVisual.render(slide, main);
    }

    content.appendChild(main);
    renderSlideFooter(slide, content);

    section.appendChild(content);
    return section;
  }

  function indexFromHash() {
    var id = decodeURIComponent(window.location.hash.slice(1));
    var index = slides.findIndex(function (slide) { return slide.id === id; });
    return index < 0 ? 0 : index;
  }

  function applyBuildState() {
    var active = deck.querySelector(".slide.is-active");
    if (!active) return;
    Array.prototype.forEach.call(active.querySelectorAll("[data-build-step]"), function (step) {
      var index = Number(step.dataset.buildStep);
      step.classList.toggle("is-revealed", index <= buildStage);
      step.classList.toggle("is-current", index === buildStage);
      step.setAttribute("aria-hidden", String(index > buildStage));
    });
    window.dispatchEvent(new CustomEvent("presentation:statechange"));
  }

  function show(index, updateHash) {
    if (!slides.length) return;
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index !== current) buildStage = 0;
    current = index;
    Array.prototype.forEach.call(deck.children, function (slide, slideIndex) {
      var active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (updateHash) history.replaceState(null, "", "#" + slides[current].id);
    document.title = slides[current].title + " — RecSys 2026";
    applyBuildState();
    window.dispatchEvent(new CustomEvent("presentation:slidechange", {
      detail: { slideId: slides[current].id, slideIndex: current }
    }));
  }

  function move(delta) {
    var buildSteps = slides[current].buildSteps || (slides[current].goals ? slides[current].goals.length : 0);
    if (delta > 0 && buildStage < buildSteps - 1) {
      buildStage += 1;
      applyBuildState();
      return;
    }
    if (delta < 0 && buildStage > 0) {
      buildStage -= 1;
      applyBuildState();
      return;
    }
    show(current + delta, true);
  }

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function slideById(id) {
    return slides.find(function (slide) { return slide.id === id; });
  }

  window.PresentationRuntime = Object.freeze({
    getSlide: function (id) { return clone(slideById(id)); },
    getState: function () {
      return {
        buildStage: buildStage,
        slideCount: slides.length,
        slideId: slides[current] ? slides[current].id : null,
        slideIndex: current
      };
    },
    getValue: function (id, pointer) {
      var slide = slideById(id);
      var value = editorRefs ? editorRefs.valueAt(slide, pointer) : undefined;
      return clone(value);
    }
  });

  slides.forEach(function (slide, index) { deck.appendChild(buildSlide(slide, index)); });
  if (window.PresentationElementOverridesRuntime) {
    window.PresentationElementOverridesRuntime.apply(deck);
  }
  if (window.PresentationOutline) {
    window.PresentationOutline.mount(slides, function (index) {
      buildStage = 0;
      show(index, true);
      deck.focus({ preventScroll: true });
    });
  }
  show(indexFromHash(), !window.location.hash);
  if (window.PresentationTouch) {
    window.PresentationTouch.mount(deck, move, function () {
      var count = slides[current].buildSteps || (slides[current].goals ? slides[current].goals.length : 0);
      return {
        canPrevious: current > 0 || buildStage > 0,
        canNext: current < slides.length - 1 || buildStage < count - 1
      };
    });
  }

  function capturesDeckKeyboard(event) {
    var path = event.composedPath ? event.composedPath() : [event.target];
    if (path.some(function (node) {
      return node && node.matches && node.matches("[data-editor-ui]");
    })) return true;
    if (["PageDown", "PageUp"].indexOf(event.key) >= 0) return false;
    return path.some(function (node) {
      return node && node.matches && node.matches(
        "input, textarea, select, button, a, [contenteditable]"
      );
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) return;
    if (capturesDeckKeyboard(event)) return;
    if (event.key === "ArrowRight" && event.shiftKey) {
      event.preventDefault();
      if (current < slides.length - 1) show(current + 1, true);
    } else if (["ArrowRight", "PageDown", " "].indexOf(event.key) >= 0) {
      event.preventDefault();
      move(1);
    } else if (["ArrowLeft", "PageUp"].indexOf(event.key) >= 0) {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Home") {
      show(0, true);
    } else if (event.key === "End") {
      show(slides.length - 1, true);
    }
  });

  window.addEventListener("hashchange", function () { show(indexFromHash(), false); });
})();
