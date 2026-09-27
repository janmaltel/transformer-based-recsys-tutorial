(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  root.ScalingDiagrams["tokenisation-motivation"] = function (host, slide) {
    var svg = k.canvas(host, slide.scaling.diagramLabel), words = k.group(svg, 0);
    k.text(words, 155, 35, "Many possible words", "sc-diagram-emphasis");
    ["play", "plays", "playing", "replaying", "playfulness", "unplayable", "new words…"].forEach(function (word, index) {
      k.text(words, 155, 78+index*31, word);
    });
    var tokens = k.group(svg, 1);
    k.arrow(tokens, 270, 162, 340, 162);
    k.text(tokens, 510, 35, "Reusable tokens", "sc-diagram-emphasis");
    function example(top, label, values) {
      k.text(tokens, 510, top, label);
      k.arrow(tokens, 510, top+12, 510, top+35);
      var width=80, gap=10, left=510-(values.length*width+(values.length-1)*gap)/2;
      values.forEach(function (value, index) {
        k.box(tokens, left+index*(width+gap), top+44, width, 42, value, value==="play" ? "sc-positive" : "sc-box");
      });
    }
    example(77, "replaying", ["re", "play", "ing"]);
    example(194, "playing", ["play", "ing"]);
    k.text(tokens, 510, 316, "Small token vocabulary", "sc-diagram-emphasis");
  };
})(window);
