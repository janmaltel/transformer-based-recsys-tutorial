(function (root) {
  "use strict";
  var el=root.RecJPQMemoryControls.el;
  root.ScalingDiagrams["recjpq-ann"]=function (host,slide) {
    var data=slide.scaling,panel=el(host,"div","recjpq-ann-panel");
    function copy(parent,tag,cls,key,step) {
      var node=el(parent,tag,cls,data[key]);
      if(step!==undefined)node.dataset.buildStep=step;
      if(root.PresentationEditorRefs)root.PresentationEditorRefs.annotate(node,slide,"/scaling/"+key);
      return node;
    }
    copy(panel,"p","ann-recommendation","recommendation",0);
    copy(panel,"p","ann-tradeoff","tradeoff",0);
    var flow=el(panel,"div","ann-pq-flow");
    copy(flow,"div","ann-pq-block","training",1);
    var arrow=el(flow,"span","ann-pq-arrow","→");arrow.dataset.buildStep=1;arrow.setAttribute("aria-hidden","true");
    var representation=el(flow,"div","ann-pq-block ann-pq-representation");representation.dataset.buildStep=1;
    copy(representation,"strong","","representation");
    var codes=el(representation,"div","ann-pq-codes");["25","7","2"].forEach(function (code) {el(codes,"span","",code);});
    codes.setAttribute("aria-label","Illustrative item code tuple:25,7,2");
    var proposed=el(flow,"span","ann-pq-proposed-arrow","⇢");proposed.dataset.buildStep=2;proposed.setAttribute("aria-hidden","true");
    copy(flow,"div","ann-pq-block ann-pq-proposed","destination",2);
    copy(panel,"p","ann-pq-explanation","pqExplanation",1);
    var research=el(panel,"div","ann-research");research.dataset.buildStep=2;
    copy(research,"p","ann-hypothesis","hypothesis");
    copy(research,"p","ann-qualification","qualification");
  };
})(window);
