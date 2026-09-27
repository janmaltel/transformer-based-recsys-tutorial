(function (root) {
  "use strict";
  var value={items:100000000,dimensions:128,codeLength:8,vectorsPerCodebook:256}, listeners=[];
  function get() {return {items:value.items,dimensions:value.dimensions,codeLength:value.codeLength,vectorsPerCodebook:value.vectorsPerCodebook};}
  function set(patch) {
    var next=Object.assign(get(),patch);
    root.RecJPQMemoryMath.compressed(next.items,next.dimensions,next.codeLength,next.vectorsPerCodebook);
    if(next.items>1000000000)throw new Error("Catalogue exceeds calculator range");
    value=next;listeners.forEach(function (listener) {listener(get());});
  }
  function subscribe(listener) {listeners.push(listener);listener(get());}
  root.RecJPQMemoryState={get:get,set:set,subscribe:subscribe};
})(window);
