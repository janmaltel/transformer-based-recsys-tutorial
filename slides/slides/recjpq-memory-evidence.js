(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-memory-evidence",type:"sasrec",eyebrow:"Block 2 · RecJPQ",
    title:"RecJPQ can retain SASRec quality",
    subtitle:"Reported NDCG@10 · SVD item-code assignment.",
    sasrecVisual:"scaling-slide",buildSteps:1,citationKeys:["petrov2024recjpq"],
    scaling:{layout:"quality-evidence",
      table:{headings:["Dataset","SASRec","RecJPQ-SVD","Quality retained"],rows:[
        ["MovieLens-1M","0.131","0.129","98.5%"],
        ["Booking.com","0.137","0.185","135.0%"],
        ["Gowalla","0.110","0.122","110.9%"]
      ]},
      points:[{label:"What about compression?",body:"Can we keep good quality while using much smaller item representations?",bridge:"question",step:0}],
      note:"Tables 4–5 · 8 codes, 512D; Gowalla’s dense SASRec baseline uses 128D. MovieLens difference is not statistically significant; Booking.com and Gowalla gains are significant."
    }
  });
})();
