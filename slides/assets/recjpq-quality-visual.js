(function (root) {
  "use strict";
  var data=root.RecJPQQualityData,math=root.RecJPQMemoryMath,ui=root.RecJPQMemoryControls,el=ui.el;
  function colour(value) {
    var stops=[[11,5,27],[94,30,82],[184,48,83],[241,108,73],[250,235,221]],v=Math.min(value/.14,1)*4;
    var a=Math.min(Math.floor(v),3),t=v-a;
    return "rgb("+stops[a].map(function (c,i) {return Math.round(c+(stops[a+1][i]-c)*t);}).join(",")+")";
  }
  root.ScalingDiagrams["recjpq-quality-heatmaps"]=function (host) {
    var panel=el(host,"div","recjpq-quality-panel"),charts=el(panel,"div","recjpq-quality-charts"),cells=[];
    var results=el(panel,"div","recjpq-quality-results");results.setAttribute("aria-live","polite");
    function metric(label) {var item=el(results,"div");el(item,"span","recjpq-quality-label",label);return el(item,"output");}
    var configuration=metric("Selected configuration"),quality=metric("RecJPQ NDCG@10 (% of baseline)"),baseline=metric("Best dense SASRec · NDCG@10"),memory=metric("FP32 GPU training memory · Dense → RecJPQ"),saving=metric("Item-table memory savings");
    var retained=el(quality.parentNode,"span","recjpq-quality-retained");
    var explanation=el(panel,"p","recjpq-quality-explanation");
    function select(cell,focus) {
      cells.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry===cell));});
      cell.chart.forEach(function (entry) {entry.node.tabIndex=entry===cell?0:-1;});
      var d=data.dimensions[cell.row],m=data.codeLengths[cell.col],dense=math.estimate(cell.dataset.items,d),pq=math.compressed(cell.dataset.items,d,m);
      configuration.textContent=cell.dataset.label+" · d="+d+", m="+m;
      quality.textContent=cell.value;
      baseline.textContent=cell.dataset.denseBaseline.ndcg+" ("+cell.dataset.denseBaseline.dimensions+"D)";
      retained.textContent=" ("+(Number(cell.value)/Number(cell.dataset.denseBaseline.ndcg)*100).toLocaleString("en-US",{maximumFractionDigits:1})+"%)";
      memory.textContent=math.bytes(dense.total)+" → "+math.bytes(pq.total);
      var smaller=pq.trainingRatio>=1,factor=smaller?pq.trainingRatio:1/pq.trainingRatio;
      saving.textContent=factor.toLocaleString("en-US",{maximumFractionDigits:factor<10?2:0})+"× "+(smaller?"smaller":"larger");
      saving.classList.toggle("is-overkill",!smaller);
      explanation.textContent="Quality benchmark: "+cell.dataset.denseBaseline.dimensions+"D. Memory: same "+d+"D tables · "+math.count(dense.parameters)+" → "+math.count(pq.parameters)+" learned parameters; fixed codes included.";
      if(focus)cell.node.focus();
    }
    data.datasets.forEach(function (dataset) {
      var figure=el(charts,"div","recjpq-quality-chart"),chart=[];
      var heading=el(figure,"div","recjpq-quality-heading");el(heading,"h3","",dataset.label);
      el(heading,"span","recjpq-quality-baseline-caption","Best dense SASRec: "+dataset.denseBaseline.ndcg+" · "+dataset.denseBaseline.dimensions+"D");el(figure,"p","recjpq-quality-axes","Rows: embedding size d · Columns: code length m");
      var grid=el(figure,"div","recjpq-quality-grid");grid.setAttribute("role","group");grid.setAttribute("aria-label",dataset.label+" reported NDCG@10 heatmap");
      el(grid,"span","recjpq-quality-axis","d / m");data.codeLengths.forEach(function (m) {el(grid,"span","recjpq-quality-axis",String(m));});
      dataset.values.forEach(function (row,r) {
        el(grid,"span","recjpq-quality-axis",String(data.dimensions[r]));
        data.codeLengths.forEach(function (m,c) {
          if(c>=row.length) {el(grid,"span","recjpq-quality-empty");return;}
          var node=el(grid,"button","recjpq-quality-cell",row[c]);node.type="button";node.tabIndex=-1;
          node.style.backgroundColor=colour(Number(row[c]));node.style.color=Number(row[c])>=.08?"#17201f":"#fff";
          node.setAttribute("aria-label",dataset.label+", dimension "+data.dimensions[r]+", "+m+" codes, NDCG at 10 "+row[c]);
          var cell={node:node,dataset:dataset,row:r,col:c,value:row[c],chart:chart};chart.push(cell);cells.push(cell);
          node.addEventListener("click",function () {select(cell,false);});
          node.addEventListener("keydown",function (event) {
            var nr=r,nc=c;
            if(event.key==="ArrowUp")nr--;else if(event.key==="ArrowDown")nr++;
            else if(event.key==="ArrowLeft")nc--;else if(event.key==="ArrowRight")nc++;
            else if(event.key==="Home")nc=0;else if(event.key==="End")nc=row.length-1;else return;
            event.preventDefault();var next=chart.find(function (entry) {return entry.row===nr&&entry.col===nc;});if(next)select(next,true);
          });
        });
      });
      chart.find(function (cell) {return cell.row===9&&cell.col===(dataset.id==="gowalla"?3:7);}).node.tabIndex=0;
    });
    var legend=el(panel,"p","recjpq-quality-legend");el(legend,"span","","Colour = reported NDCG@10 · ");
    [0,.035,.07,.105,.14].forEach(function (v) {var swatch=el(legend,"span","recjpq-quality-swatch");swatch.style.backgroundColor=colour(v);});el(legend,"span",""," 0 → 0.14 · Blank: code length exceeds dimension");
    el(panel,"p","recjpq-quality-paper-result","Paper’s full-model sweeps: similar baseline quality with 4.90× smaller checkpoints on MovieLens and 47.94× on Gowalla (Figure 4).");
    select(cells.find(function (cell) {return cell.dataset.id==="gowalla"&&cell.row===9&&cell.col===3;}),false);
  };
})(window);
