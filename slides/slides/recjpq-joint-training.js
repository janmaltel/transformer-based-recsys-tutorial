(function () {
  "use strict";
  window.PresentationSlides=window.PresentationSlides||[];
  window.PresentationSlides.push({
    id:"recjpq-joint-training",type:"sasrec",eyebrow:"Block 2 · RecJPQ",
    title:"RecJPQ replaces the item embedding layer",
    subtitle:"A drop-in replacement for embedding-based recommenders.",
    sasrecVisual:"scaling-slide",buildSteps:1,citationKeys:["petrov2024recjpq"],
    scaling:{
      diagram:"joint",
      diagramLabel:"RecJPQ replaces a dense item embedding table. Item IDs still produce embedding vectors of the same size, which feed the existing recommender.",
      points:[
        {label:"Compatible with the model",body:"SASRec, BERT4Rec, GRU4Rec—or another method that uses item embeddings.",step:0},
        {label:"Keep the training recipe",body:"Same training data, task and loss function. Train the shared embeddings with the model’s existing objective.",step:0}
      ]
    }
  });
})();
