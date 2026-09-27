(function (root) {
  "use strict";
  root.ScalingDiagrams["code-geometries"]=function (host,slide) {
    var k=root.GenerativeDiagramKit(host,slide),lanes=k.el(k.panel,"div","code-geometry-lanes");
    k.panel.classList.add("code-geometries");
    var left=k.stage(lanes,"code-geometry-lane",0);
    k.copy(left,"h3","","leftTitle");k.copy(left,"p","code-geometry-analogy","leftAnalogy");
    var parts=k.el(left,"div","code-geometry-parts");
    k.data.parts.forEach(function (_,i) {
      var part=k.el(parts,"div","code-geometry-part code-part-"+i);
      k.copy(part,"span","gen-code","codes/"+i);k.el(part,"span","code-down","↓");
      var vector=k.el(part,"div","code-mini-vector");
      for(var j=0;j<4;j++)k.el(vector,"span","");
      k.copy(part,"span","code-part-label","parts/"+i);
    });
    k.copy(left,"p","code-geometry-result","leftResult");
    var full=k.el(left,"div","code-full-vector");
    for(var i=0;i<3;i++)for(var j=0;j<4;j++)k.el(full,"span","code-part-"+i);
    k.copy(left,"p","code-geometry-meaning","leftMeaning");
    var right=k.stage(lanes,"code-geometry-lane",1);
    k.copy(right,"h3","","rightTitle");k.copy(right,"p","code-geometry-analogy","rightAnalogy");
    var ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");
    svg.setAttribute("viewBox","0 0 480 220");svg.classList.add("code-correction-map");svg.setAttribute("aria-hidden","true");right.appendChild(svg);
    function shape(tag,attrs) {var n=document.createElementNS(ns,tag);Object.keys(attrs).forEach(function (key) {n.setAttribute(key,attrs[key]);});svg.appendChild(n);return n;}
    var defs=document.createElementNS(ns,"defs"),marker=document.createElementNS(ns,"marker"),tip=document.createElementNS(ns,"path");
    marker.id="code-correction-arrow";marker.setAttribute("viewBox","0 0 10 10");marker.setAttribute("refX","9");marker.setAttribute("refY","5");marker.setAttribute("markerWidth","5");marker.setAttribute("markerHeight","5");marker.setAttribute("orient","auto-start-reverse");tip.setAttribute("d","M0 0 L10 5 L0 10 Z");tip.setAttribute("fill","#00518a");marker.appendChild(tip);defs.appendChild(marker);svg.appendChild(defs);
    ["M45 180 L245 45","M245 45 L310 135","M310 135 L355 108"].forEach(function(d) {shape("path",{d:d,class:"code-map-path","marker-end":"url(#code-correction-arrow)"});});
    shape("circle",{cx:45,cy:180,r:3,class:"code-map-point"});
    [[245,45],[310,135]].forEach(function(p,i) {
      shape("circle",{cx:p[0],cy:p[1],r:11,class:"code-map-stop"});
      var number=shape("text",{x:p[0],y:p[1]+5,class:"code-map-number"});number.textContent=i+1;
    });
    shape("circle",{cx:360,cy:105,r:11,class:"code-map-target"});
    var last=shape("text",{x:360,y:110,class:"code-map-number"});last.textContent="3";
    function label(path,x,y) {var node=shape("text",{x:x,y:y,class:"code-map-label"});node.textContent=path.split("/").reduce(function(v,key){return v[key];},k.data);if(root.PresentationEditorRefs)root.PresentationEditorRefs.annotate(node,slide,"/scaling/"+path);}
    label("origin",25,207);label("target",379,110);
    var legend=k.el(right,"div","code-map-legend");k.data.moves.forEach(function(_,i) {var entry=k.el(legend,"div","");k.el(entry,"strong","",String(i+1));k.copy(entry,"span","","moves/"+i);});
    k.copy(right,"p","code-geometry-meaning","rightMeaning");
    k.copy(k.panel,"p","gen-takeaway","takeaway",2);
  };
})(window);
