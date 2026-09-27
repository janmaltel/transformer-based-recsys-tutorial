(function (root) {
  "use strict";
  var el=root.RecJPQMemoryControls.el;
  function stage(parent,tag,cls,n,text) {var node=el(parent,tag,cls,text);node.dataset.buildStep=n;return node;}
  root.ScalingDiagrams["recjpq-pruning"]=function (host) {
    var panel=el(host,"div","recjpq-pruning-panel");
    var order=stage(panel,"div","prune-order",0);
    el(order,"span","","More promising");el(order,"span","prune-order-arrow","→ scan order →");el(order,"span","","Less promising");
    var lane=stage(panel,"div","prune-scan-lane",0);
    for(var i=0;i<10;i++) {
      var item=el(lane,"div","prune-scan-item");
      item.setAttribute("aria-label","Illustrative candidate "+(i+1));
      el(item,"span","","Item");
    }
    var progress=stage(panel,"div","prune-progress",1);
    el(progress,"strong","","Score promising candidates");
    el(progress,"span","","Keep the best k items found so far");
    var stop=stage(panel,"div","prune-stop",2);
    el(stop,"strong","","Stop");
    el(stop,"p","","When even the best possible remaining score is below the current kth score.");
    el(stop,"p","prune-stop-intuition","The remaining shared scores give a ceiling on what an unseen item can score.");
    stage(lane,"div","prune-stop-marker",2,"STOP");
    stage(panel,"p","prune-unscored",2,"Remaining items need no score computation");
  };
})(window);
