(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-dynamic-pruning",type:"sasrec",eyebrow:"Block 2 · RecJPQ · Efficient inference",
    title:"Yes: dynamic pruning",
    subtitle:"Scan from more promising to less promising items, guided by their sub-item scores.",
    sasrecVisual:"scaling-slide",buildSteps:3,citationKeys:["petrov2025recjpqprune"],
    scaling:{layout:"compression-calculator",diagram:"recjpq-pruning",points:[],
      diagramLabel:"Illustrative scan order, guided by high-scoring sub-items rather than known final item scores. First score promising candidates and keep the current top-k. Stop when the best possible remaining score falls below the current kth score; remaining items need not be scored.",
      note:"Same trained RecJPQ model · The stopping criterion preserves exact top-k."
    }
  });
})();
