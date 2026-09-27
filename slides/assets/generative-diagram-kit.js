(function (root) {
  "use strict";
  var el=root.RecJPQMemoryControls.el;
  function kit(host,slide) {
    var panel=el(host,"div","gen-panel"),data=slide.scaling;
    function copy(parent,tag,cls,path,step) {
      var value=path.split("/").reduce(function (v,key) {return v[key];},data),node=el(parent,tag,cls,value);
      if(step!==undefined)node.dataset.buildStep=step;
      if(root.PresentationEditorRefs)root.PresentationEditorRefs.annotate(node,slide,"/scaling/"+path);
      return node;
    }
    function stage(parent,cls,step) {var node=el(parent,"div",cls);node.dataset.buildStep=step;return node;}
    function codes(parent,path,shared) {
      var row=el(parent,"div","gen-codes"),values=path.split("/").reduce(function (v,key) {return v[key];},data);
      values.forEach(function (_,i) {copy(row,"span","gen-code"+(i<shared?" gen-code-shared":""),path+"/"+i);});return row;
    }
    function arrow(parent,step) {var node=el(parent,"span","gen-arrow","→");if(step!==undefined)node.dataset.buildStep=step;node.setAttribute("aria-hidden","true");return node;}
    function flow(parent,path,step) {
      var lane=stage(parent,"gen-linear",step),values=path.split("/").reduce(function (v,key) {return v[key];},data);
      values.forEach(function (_,i) {if(i)arrow(lane);copy(lane,"div","gen-block",path+"/"+i);});return lane;
    }
    function shoe(parent) {
      var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 100 42");svg.classList.add("gen-shoe");svg.setAttribute("aria-hidden","true");
      var path=document.createElementNS(svg.namespaceURI,"path");path.setAttribute("d","M8 24 L15 8 L32 17 L50 14 L62 24 L86 27 Q94 28 94 34 L7 34 Z M8 38 L94 38 M38 19 L35 24 M47 18 L44 23 M56 23 L53 27");svg.appendChild(path);parent.appendChild(svg);
    }
    return {panel:panel,data:data,el:el,copy:copy,stage:stage,codes:codes,arrow:arrow,flow:flow,shoe:shoe};
  }
  root.GenerativeDiagramKit=kit;
})(window);
