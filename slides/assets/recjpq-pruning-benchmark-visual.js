(function (root) {
  "use strict";
  var ui=root.RecJPQMemoryControls,el=ui.el,button=ui.button,k=root.ScalingSlideKit,data=root.RecJPQPruningData.benchmarks;
  root.ScalingDiagrams["recjpq-pruning-benchmarks"]=function (host) {
    var panel=el(host,"div","prune-benchmark-panel"),dataset="tmall",model="sasrec",metric="median",buttons=[];
    var controls=el(panel,"div","pq-benchmark-controls");
    function choices(label,options,set,get) {
      var group=el(controls,"div","pq-controls");group.setAttribute("role","group");group.setAttribute("aria-label",label);
      options.forEach(function (option) {var node=button(group,option[1],function () {set(option[0]);update();});buttons.push({node:node,value:option[0],get:get});});
    }
    choices("Dataset",[["gowalla","Gowalla · 1.27M"],["tmall","Tmall · 2.19M"]],function (v) {dataset=v;},function () {return dataset;});
    choices("Model",[["sasrec","SASRec"],["gsasrec","gSASRec"],["gbert","gBERT4Rec"]],function (v) {model=v;},function () {return model;});
    choices("Latency statistic",[["median","Median"],["tail","95th percentile"]],function (v) {metric=v;},function () {return metric;});
    var chart=el(panel,"div","pq-benchmark-chart"),summary=el(panel,"div","prune-benchmark-summary");summary.setAttribute("aria-live","polite");
    var factor=el(summary,"strong"),scope=el(summary,"span"),detail=el(panel,"p","prune-benchmark-detail");
    function update() {
      var values=data[dataset][model][metric],ratio=values[0]/values[1];chart.replaceChildren();
      var svg=k.canvas(chart,"CPU scoring milliseconds, "+metric);svg.setAttribute("viewBox","0 0 900 230");
      ["RecJPQ · full scan","RecJPQ · pruning"].forEach(function (name,i) {
        var y=65+i*100,label=k.text(svg,190,y+7,name);label.setAttribute("text-anchor","end");
        k.node("rect",{x:210,y:y-18,width:540*values[i]/Math.max.apply(null,values),height:35,"class":"prune-benchmark-bar prune-bar-"+i},svg);
        var number=k.text(svg,770,y+7,values[i].toFixed(2)+" ms","pq-benchmark-number");number.setAttribute("text-anchor","start");
      });
      factor.textContent=ratio>=1?ratio.toFixed(2)+"× faster":(1/ratio).toFixed(2)+"× slower";
      summary.classList.toggle("is-slower",ratio<1);
      scope.textContent="Pruning vs full scan · "+(metric==="median"?"median":"95th percentile")+" CPU scoring time";
      detail.textContent=ratio<1?"This model/dataset has slower tail latency with pruning. Top-10 results remain exact.":"Same exact top-10. Pruning reduces scoring work; latency depends on the user.";
      buttons.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry.value===entry.get()));});
      panel.dataset.values=values.join(",");panel.dataset.dataset=dataset;panel.dataset.model=model;panel.dataset.metric=metric;
    }
    update();
  };
})(window);
