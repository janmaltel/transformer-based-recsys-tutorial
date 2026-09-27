(function (root) {
  "use strict";
  var math=root.RecJPQMemoryMath,state=root.RecJPQMemoryState,ui=root.RecJPQMemoryControls;
  var el=ui.el,button=ui.button;
  root.ScalingDiagrams["recjpq-compression"]=function (host) {
    var panel=el(host,"div","recjpq-compression-panel"),controls=el(panel,"div","recjpq-compression-controls");
    controls.setAttribute("role","group");controls.setAttribute("aria-label","RecJPQ compression calculator");
    ui.mount(controls);
    var length=el(controls,"div","recjpq-calc-dimensions recjpq-compression-length");el(length,"span","","Code length");
    var lengths=[2,8,32].map(function (m) {return {value:m,node:button(length,String(m),function () {state.set({codeLength:m});})};});
    var size=el(controls,"div","recjpq-calc-dimensions recjpq-compression-length");el(size,"span","","Vectors per codebook");
    var sizes=[256,4096,8192].map(function (k) {return {value:k,node:button(size,k.toLocaleString("en-US"),function () {state.set({vectorsPerCodebook:k});})};});
    var overkill=button(controls,"MovieLens · overkill",function () {state.set({items:3416,dimensions:512,codeLength:32,vectorsPerCodebook:8192});});
    overkill.classList.add("recjpq-overkill-preset");
    var structure=el(controls,"p","recjpq-compression-help"),capacity=el(controls,"p","recjpq-compression-capacity");
    var comparison=el(panel,"div","recjpq-compression-comparison");comparison.setAttribute("aria-live","polite");
    function metric(label) {var row=el(comparison,"div","recjpq-compression-metric");el(row,"span","",label);return row;}
    function pair(row) {
      var values=el(row,"div","recjpq-compression-pair"),before=el(values,"output","recjpq-compression-before");
      var after=el(values,"span","recjpq-compression-after");after.dataset.buildStep="0";
      el(after,"span","recjpq-compression-arrow","→");var result=el(after,"output");
      return {before:before,after:result};
    }
    var parameters=pair(metric("Learned embedding parameters")),memory=pair(metric("FP32 GPU training memory"));
    var savings=el(comparison,"div","recjpq-compression-savings");savings.dataset.buildStep="0";
    var ratio=el(savings,"strong"),remaining=el(savings,"span");
    var bars=el(comparison,"div","recjpq-compression-bars");
    function bar(label,cls,step) {
      var row=el(bars,"div","recjpq-compression-bar-row");if(step!==undefined)row.dataset.buildStep=step;
      el(row,"span","",label);var track=el(row,"div","recjpq-compression-track");
      return el(track,"div","recjpq-compression-bar "+cls);
    }
    var denseBar=bar("Dense","is-dense"),compressedBar=bar("RecJPQ","is-compressed",0);
    el(bars,"p","recjpq-compression-scale","Same linear scale; the dot marks the RecJPQ bar’s end.");
    var parts=el(comparison,"dl","recjpq-compression-parts");parts.dataset.buildStep="0";
    el(parts,"dt","","Fixed item codes");var codes=el(parts,"dd");
    el(parts,"dt","","Shared codebooks + gradients + Adam + workspace");var learned=el(parts,"dd");
    state.subscribe(function (value) {
      var dense=math.estimate(value.items,value.dimensions),pq=math.compressed(value.items,value.dimensions,value.codeLength,value.vectorsPerCodebook);
      parameters.before.textContent=math.count(dense.parameters);parameters.after.textContent=math.count(pq.parameters);
      memory.before.textContent="≈ "+math.bytes(dense.total);memory.after.textContent="≈ "+math.bytes(pq.total);
      var smaller=pq.trainingRatio>=1,factor=smaller?pq.trainingRatio:1/pq.trainingRatio;
      ratio.textContent=factor.toLocaleString("en-US",{maximumFractionDigits:factor<10?2:0})+"× "+(smaller?"smaller":"larger");
      remaining.textContent=(pq.total/dense.total*100).toLocaleString("en-US",{maximumFractionDigits:2})+"% of the original training memory";
      var maximum=Math.max(dense.total,pq.total);denseBar.style.width=dense.total/maximum*100+"%";compressedBar.style.width=pq.total/maximum*100+"%";
      codes.textContent=math.bytes(pq.codes)+" · "+(value.codeLength*pq.bytesPerCode)+" bytes/item";learned.textContent="≈ "+math.bytes(pq.total-pq.codes);
      lengths.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry.value===value.codeLength));});
      sizes.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry.value===value.vectorsPerCodebook));});
      overkill.setAttribute("aria-pressed",String(value.items===3416&&value.dimensions===512&&value.codeLength===32&&value.vectorsPerCodebook===8192));
      structure.textContent=value.codeLength+" codebooks × "+value.vectorsPerCodebook.toLocaleString("en-US")+" vectors × "+pq.vectorSize+" values = "+math.count(pq.parameters)+" learned parameters.";
      capacity.textContent=!smaller?"Overkill: shared tables hold "+value.vectorsPerCodebook.toLocaleString("en-US")+" full-vector equivalents for just "+value.items.toLocaleString("en-US")+" items.":value.items>pq.uniqueCodes?"Some items must share the same code tuple.":"More codes → shorter sub-vectors; vectors per codebook control the learned table size.";
      comparison.classList.toggle("is-overkill",!smaller);
      panel.dataset.denseBytes=dense.total;panel.dataset.compressedBytes=pq.total;panel.dataset.codeLength=value.codeLength;
    });
  };
})(window);
