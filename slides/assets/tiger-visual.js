(function (root) {
  "use strict";
  root.ScalingDiagrams["tiger-overview"]=function (host,slide) {
    var k=root.GenerativeDiagramKit(host,slide),lane=k.el(k.panel,"div","gen-overview");
    var history=k.stage(lane,"gen-history",0);k.copy(history,"h3","","historyTitle");
    k.data.history.forEach(function (_,i) {var row=k.el(history,"div","gen-history-item"),item=k.el(row,"div","gen-product");k.shoe(item);k.copy(item,"span","","history/"+i+"/item");k.codes(row,"history/"+i+"/codes",1);});
    k.arrow(lane,1);var model=k.stage(lane,"gen-model",1);k.copy(model,"h3","","model");k.copy(model,"p","","prediction");k.codes(model,"target",1);
    k.arrow(lane,2);var lookup=k.stage(lane,"gen-lookup",2);k.copy(lookup,"h3","","lookup");k.shoe(lookup);k.copy(lookup,"strong","","item");
    k.copy(k.panel,"p","gen-takeaway","takeaway",2);
  };
  root.ScalingDiagrams["tiger-semantic"]=function (host,slide) {
    var k=root.GenerativeDiagramKit(host,slide),pipeline=k.stage(k.panel,"gen-semantic-pipeline",0);
    k.copy(pipeline,"div","gen-block","pipeline/0");k.arrow(pipeline);
    k.copy(pipeline,"div","gen-block","pipeline/1");k.arrow(pipeline);
    var quantizer=k.el(pipeline,"div","gen-quantizer");k.copy(quantizer,"h3","","pipeline/2");
    var levels=k.el(quantizer,"div","gen-quantizer-levels");
    k.data.levels.forEach(function (_,i) {if(i)k.arrow(levels);var level=k.el(levels,"div","gen-quantizer-level");k.copy(level,"span","","levels/"+i);k.copy(level,"strong","gen-code","codes/"+i);});
    var related=k.stage(k.panel,"gen-related",1);
    k.data.neighbors.forEach(function (_,i) {var row=k.el(related,"div","gen-related-item");k.copy(row,"span","","neighbors/"+i+"/item");k.codes(row,"neighbors/"+i+"/codes",2);});
    k.copy(related,"p","gen-explanation","sharing");
    var collision=k.stage(k.panel,"gen-collision",2);k.copy(collision,"strong","","collision");
    var ids=k.el(collision,"div","gen-collision-ids");k.codes(ids,"collisionCodes/0",3);k.codes(ids,"collisionCodes/1",3);k.copy(collision,"p","","resolution");
  };
  root.ScalingDiagrams["tiger-beam"]=function (host,slide) {
    var k=root.GenerativeDiagramKit(host,slide),beam=k.el(k.panel,"div","gen-beam");
    k.data.columns.forEach(function (column,i) {
      if(i)k.arrow(beam,column.step);
      var col=k.stage(beam,"gen-beam-column",column.step);k.copy(col,"h3","","columns/"+i+"/title");
      column.paths.forEach(function (_,j) {k.copy(col,"div","gen-prefix","columns/"+i+"/paths/"+j);});
      if(i<2)k.copy(col,"p","gen-pruned","discarded");
    });
    k.copy(k.panel,"p","gen-lookup-label","lookup",2);k.copy(k.panel,"p","gen-takeaway","takeaway",2);
  };
})(window);
