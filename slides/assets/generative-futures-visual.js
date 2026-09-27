(function (root) {
  "use strict";
  root.ScalingDiagrams["plum-backbone"]=function (host,slide) {
    var k=root.GenerativeDiagramKit(host,slide),flow=k.el(k.panel,"div","plum-flow");
    k.panel.classList.add("plum-panel");
    var input=k.stage(flow,"plum-history",0);k.copy(input,"h3","","inputTitle");k.copy(input,"p","plum-input-label","inputLabel");
    k.data.history.forEach(function(_,i) {
      var event=k.el(input,"div","plum-event");k.copy(event,"strong","plum-item-codes","history/"+i+"/codes");
      k.copy(event,"span","plum-text","history/"+i+"/text");k.copy(event,"span","plum-feature","history/"+i+"/feature");
    });
    k.arrow(flow,1);var middle=k.stage(flow,"plum-model-lane",1);k.copy(middle,"p","plum-adaptation","adaptation");
    var model=k.el(middle,"div","plum-model");k.copy(model,"h3","","model");k.copy(model,"p","","vocabulary");
    k.arrow(flow,2);var output=k.stage(flow,"plum-output",2);k.copy(output,"h3","","outputTitle");
    var codes=k.el(output,"div","plum-output-codes");k.data.candidateCodes.forEach(function(_,i) {k.copy(codes,"div","plum-item-codes","candidateCodes/"+i);});
    var lookup=k.el(output,"div","plum-lookup");k.el(lookup,"span","plum-down","↓");k.copy(lookup,"span","","lookup");
    var videos=k.el(output,"div","plum-videos");
    for(var i=0;i<2;i++) {
      var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 64 42");svg.setAttribute("aria-hidden","true");
      var path=document.createElementNS(svg.namespaceURI,"path");path.setAttribute("d","M2 2 H62 V40 H2 Z M26 12 L43 21 L26 30 Z");svg.appendChild(path);videos.appendChild(svg);
    }
    k.copy(output,"p","plum-ranking","ranking");k.copy(k.panel,"p","gen-takeaway","takeaway",2);k.copy(k.panel,"p","plum-limitation","limitation",2);
  };
  root.ScalingDiagrams["generative-tradeoffs"]=function (host,slide) {
    var k=root.GenerativeDiagramKit(host,slide),comparison=k.el(k.panel,"div","gen-tradeoffs");
    var pros=k.stage(comparison,"gen-benefits",0);k.el(pros,"h3","","Benefits");
    k.data.benefits.forEach(function (_,i) {var row=k.el(pros,"div","gen-tradeoff-row");k.copy(row,"strong","","benefits/"+i+"/label");k.copy(row,"p","","benefits/"+i+"/body");});
    var cons=k.el(comparison,"div","gen-costs");k.el(cons,"h3","","Costs");
    k.data.costs.forEach(function (cost,i) {var row=k.stage(cons,"gen-tradeoff-row",cost.step);k.copy(row,"strong","","costs/"+i+"/label");k.copy(row,"p","","costs/"+i+"/body");});
    k.copy(k.panel,"p","gen-takeaway","takeaway",2);
  };
})(window);
