(function (root) {
  "use strict";
  var data=root.PQTopKData,ui=root.RecJPQMemoryControls,el=ui.el,button=ui.button;
  function fmt(x) {return x.toLocaleString("en-US",{maximumFractionDigits:2});}
  function stage(parent,tag,cls,n,text) {var node=el(parent,tag,cls,text);node.dataset.buildStep=n;return node;}
  root.ScalingDiagrams["pq-score-lookup"]=function (host) {
    var panel=el(host,"div","pq-score-panel"),queryIndex=0,itemIndex=0;
    var top=stage(panel,"div","pq-query",0);el(top,"strong","pq-query-label","Transformer output h · real-valued");var query=el(top,"div","pq-query-parts");
    var qControls=el(top,"div","pq-controls");
    var qButtons=data.queries.map(function (q,i) {return button(qControls,"Sequence vector "+(i===0?"A":"B"),function () {queryIndex=i;update();});});
    var selection=stage(panel,"div","pq-item-selection",0),iControls=el(selection,"div","pq-controls");
    var iButtons=data.items.map(function (item,i) {return button(iControls,item.name,function () {itemIndex=i;update();});});
    var selectedCodes=el(selection,"p","pq-code-explanation");
    var paths=el(panel,"div","pq-scoring-paths"),reconstruct=stage(paths,"div","pq-reconstruct-path",0);
    el(reconstruct,"h3","pq-path-title","Reconstruct → compute");
    el(reconstruct,"p","pq-path-caption","Look up the three sub-vectors and concatenate them.");
    var vectorRows=el(reconstruct,"div","pq-reconstruct-rows");
    el(reconstruct,"div","pq-reconstruct-arrow","↓ concatenate");
    var assembled=el(reconstruct,"div","pq-assembled-vector");
    el(reconstruct,"p","pq-path-caption","Compute a full dot product with h for this item.");
    var denseEquation=el(reconstruct,"div","pq-dense-equation");
    el(denseEquation,"span","","h · reconstructed embedding");var denseTotal=el(denseEquation,"output","pq-dense-score");
    el(reconstruct,"p","pq-path-cost","Repeat the full dot product for every item.");

    var reuse=el(paths,"div","pq-reuse-path");stage(reuse,"h3","pq-path-title",1,"Precompute → sum");
    stage(reuse,"p","pq-path-caption",1,"Compute each part of h · each shared row once per sequence.");
    var books=stage(reuse,"div","pq-score-books",1),rows=[];
    data.codebooks.forEach(function (book,r) {
      var block=el(books,"div","pq-book pq-part-"+r);el(block,"h3","","Part "+(r+1));
      var table=el(block,"table","pq-score-table"),head=el(table,"thead"),tr=el(head,"tr");
      ["Row ID","Score"].forEach(function (label) {el(tr,"th","",label);});
      var body=el(table,"tbody");rows[r]=book.map(function (entry) {
        var row=el(body,"tr");row.dataset.code=entry.code;el(row,"th","",entry.code);
        row.title="Shared sub-vector: "+entry.vector.map(fmt).join(", ");return {node:row,output:el(row,"td","pq-subscore")};
      });
    });
    var lookup=stage(reuse,"div","pq-score-lookup",2);
    el(lookup,"p","pq-path-caption","Select the precomputed scores using the same row IDs.");
    var equation=el(lookup,"div","pq-lookup-equation"),contributions=el(equation,"div","pq-lookup-parts"),total=el(equation,"output","pq-final-score");
    el(lookup,"p","pq-same-score","Same score. Reuse these shared scores across all items.");
    function update() {
      query.replaceChildren();data.queries[queryIndex].reduce(function (parts,x,i) {if(i%4===0)parts.push([]);parts[parts.length-1].push(x);return parts;},[]).forEach(function (part,r) {
        var block=el(query,"div","pq-query-part pq-part-"+r);el(block,"span","","h"+(r+1));el(block,"strong","",part.map(fmt).join("  "));
      });
      var tables=data.table(data.queries[queryIndex]),item=data.items[itemIndex],value=data.score(tables,item);
      rows.forEach(function (book,r) {book.forEach(function (row,j) {row.output.textContent=fmt(tables[r][j].score);row.node.classList.toggle("is-selected",tables[r][j].code===item.codes[r]);});});
      selectedCodes.textContent=item.name+" codes: ("+item.codes.join(", ")+") — one row ID per shared table.";
      vectorRows.replaceChildren();assembled.replaceChildren();contributions.replaceChildren();
      var fullVector=[];
      item.codes.forEach(function (code,r) {
        var vector=data.codebooks[r].find(function (entry) {return entry.code===code;}).vector;
        var row=el(vectorRows,"div","pq-reconstruct-row pq-part-"+r);el(row,"span","","Row "+code+" →");el(row,"strong","",vector.map(fmt).join("  "));
        var part=el(assembled,"div","pq-assembled-part pq-part-"+r);vector.forEach(function (x) {el(part,"span","",fmt(x));fullVector.push(x);});
        if(r)el(contributions,"span","pq-plus","+");el(contributions,"strong","pq-score-chip pq-part-"+r,fmt(value.parts[r]));
      });
      total.textContent="= "+fmt(value.total);
      denseTotal.textContent="= "+fmt(fullVector.reduce(function (sum,x,j) {return sum+x*data.queries[queryIndex][j];},0));
      qButtons.forEach(function (node,i) {node.setAttribute("aria-pressed",String(i===queryIndex));});
      iButtons.forEach(function (node,i) {node.setAttribute("aria-pressed",String(i===itemIndex));});
    }
    update();
  };
  root.ScalingDiagrams["pq-parallel"]=function (host) {
    var panel=el(host,"div","pq-parallel-panel"),tables=data.table(data.queries[0]);
    var equivalence=stage(panel,"div","pq-score-equivalence",0);
    el(equivalence,"strong","","RecJPQ item score = sum of its sub-item scores");
    el(equivalence,"p","","Mathematically identical to the dot product with the full item embedding.");
    var shared=stage(panel,"div","pq-shared-bank",1);
    el(shared,"h3","pq-path-title","Precompute once for this sequence");
    var parts=el(shared,"div","pq-shared-parts");
    tables.forEach(function (book,r) {
      var part=el(parts,"div","pq-shared-part pq-part-"+r);el(part,"strong","","Part "+(r+1));
      book.forEach(function (entry) {var row=el(part,"div","pq-shared-entry");row.dataset.usedBy=data.items.map(function (item,i) {return item.codes[r]===entry.code?String(i):"";}).filter(Boolean).join(" ");el(row,"span","","Row "+entry.code);el(row,"strong","",fmt(entry.score));});
    });
    var items=el(panel,"div","pq-item-fanout");
    stage(items,"div","pq-fanout-arrow",1,"↓ reuse the same score tables for every item ↓");
    var cards=el(items,"div","pq-item-cards");
    data.items.forEach(function (item,i) {
      var card=stage(cards,"div","pq-item-card",i+2),value=data.score(tables,item);card.dataset.itemIndex=i;el(card,"h3","",item.name);
      var codes=el(card,"div","pq-item-codes");item.codes.forEach(function (code,r) {el(codes,"span","pq-code-chip pq-part-"+r,"Row "+code);});
      var sum=el(card,"div","pq-item-sum");value.parts.forEach(function (x,r) {if(r)el(sum,"span","","+");el(sum,"strong","pq-part-"+r,fmt(x));});
      el(card,"output","pq-item-result","= "+fmt(value.total));
    });
    stage(items,"p","pq-parallel-takeaway",2,"No full item dot product: just look up the shared scores and add them.");
  };
  root.ScalingDiagrams["pq-scale"]=function (host) {
    var panel=el(host,"div","pq-scale-panel");
    stage(panel,"p","pq-scale-legend",0,"Common scale: one square = 10 million items");
    var cards=stage(panel,"div","pq-scale-cards",0);
    [["10 million","146 ms",10],["100 million","≈ 1 second",100],["1 billion","> 10 seconds",1000]].forEach(function (entry) {
      var card=el(cards,"div","pq-scale-card");el(card,"h3","",entry[0]+" items");
      var dots=el(card,"div","pq-scale-dots");dots.setAttribute("role","img");dots.setAttribute("aria-label",entry[0]+" items: "+entry[2]/10+" squares, each representing 10 million items");
      for(var i=0;i<entry[2]/10;i++)el(dots,"span","","");
      el(card,"strong","pq-scale-time",entry[1]);el(card,"p","","Reported CPU scoring + top-k time");
    });
    var conclusion=stage(panel,"div","pq-scale-conclusion",1);
    el(conclusion,"h3","","Can we avoid a full scan?");
    el(conclusion,"p","","Score reuse makes each item cheaper, but we still process the whole catalogue.");
  };
})(window);
