(function () {
  "use strict";
  window.PresentationSlides = window.PresentationSlides || [];
  window.PresentationSlides.push({
  "id": "user-cold-start-playground",
  "type": "playground",
  "eyebrow": "Playground · Empty history and first interaction",
  "title": "Empty-history recommendations",
  "playground": {
    "composition": "teaching",
    "view": "sequence-builder",
    "sessionKey": "empty-history-sequence",
    "scenario": {
      "modelId": "gsasrec-ml1m",
      "history": {
        "ids": [],
        "idSpace": "original"
      },
      "topK": 5,
      "filterHistory": true,
      "allowEmptyHistory": true
    },
    "controls": {
      "model": true,
      "allowedModels": [
        "gsasrec-ml1m",
        "pad-first-ml1m"
      ],
      "modelPresentation": {
        "gsasrec-ml1m": {
          "label": "SASRec",
          "emptyHistoryDescription": "Same model as the earlier playground. PAD states and their loss weights are zero; the empty ranking comes from the final normalization bias."
        },
        "pad-first-ml1m": {
          "label": "SASRec + first-item supervision",
          "emptyHistoryDescription": "Learned PAD embedding and active PAD states. An empty-history example predicts each user’s first training item with loss weight 1."
        }
      },
      "topK": true,
      "filterHistory": true,
      "clear": true
    },
    "behavior": {
      "autoRecommend": true,
      "recommendationClick": "append",
      "searchLimit": 6,
      "maxVisibleHistory": 8
    }
  }
});
})();
