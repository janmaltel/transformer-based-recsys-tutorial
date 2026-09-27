(function (root) {
  "use strict";
  var ui=root.RecJPQMemoryControls,el=ui.el,button=ui.button,k=root.ScalingSlideKit,data=root.PQTopKData.benchmarks;
  root.ScalingDiagrams["pq-benchmarks"]=function (host) {
    var panel=el(host,"div","pq-benchmark-panel"),dataset="gowalla",model="sasrec",metric="total";
    var controls=el(panel,"div","pq-benchmark-controls"),buttons=[];
    function choices(label,options,change,current) {
      var group=el(controls,"div","pq-controls");group.setAttribute("role","group");group.setAttribute("aria-label",label);
      options.forEach(function (option) {var node=button(group,option[1],function () {change(option[0]);update();});buttons.push({node:node,value:option[0],current:current});});
    }
    choices("Dataset",[["booking","Booking · 35K"],["gowalla","Gowalla · 1.27M"]],function (v) {dataset=v;},function () {return dataset;});
    choices("Model",[["sasrec","SASRec"],["gbert4rec","gBERT4Rec"]],function (v) {model=v;},function () {return model;});
    choices("Latency measure",[["total","Whole model"],["scoring","Scoring only"]],function (v) {metric=v;},function () {return metric;});
    var chart=el(panel,"div","pq-benchmark-chart");
    var results=el(panel,"div","pq-benchmark-results");results.setAttribute("aria-live","polite");
    var dense=el(results,"div"),denseFactor=el(dense,"strong"),denseLabel=el(dense,"span");
    var detail=el(panel,"p","pq-benchmark-detail");
    function update() {
      var entry=data[dataset][model],values=entry[metric],svg;
      chart.replaceChildren();svg=k.canvas(chart,"Published median "+metric+" latency in milliseconds");svg.setAttribute("viewBox","0 0 900 230");
      [{name:"Standard dot product",index:0},{name:"RecJPQ",index:2}].forEach(function (head,i) {
        var y=65+i*100,label=k.text(svg,180,y+7,head.name);label.setAttribute("text-anchor","end");
        k.node("rect",{x:205,y:y-18,width:550*values[head.index]/Math.max(values[0],values[2]),height:35,rx:3,"class":"pq-benchmark-bar pq-bar-"+head.index},svg);
        var number=k.text(svg,775,y+7,values[head.index].toFixed(2)+" ms","pq-benchmark-number");number.setAttribute("text-anchor","start");
      });
      denseFactor.textContent=(values[0]/values[2]).toFixed(2)+"× faster";
      denseLabel.textContent="RecJPQ vs standard dot product · "+(metric==="total"?"whole model":"scoring only");
      detail.textContent="NDCG@10 = "+entry.ndcg+" for both scoring heads. Transformer backbone alone: "+entry.backbone.toFixed(2)+" ms. "+data[dataset].items.toLocaleString("en-US")+" catalogue items.";
      buttons.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry.value===entry.current()));});
      panel.dataset.dataset=dataset;panel.dataset.model=model;panel.dataset.metric=metric;panel.dataset.values=[values[0],values[2]].join(",");
    }
    update();
  };
})(window);
