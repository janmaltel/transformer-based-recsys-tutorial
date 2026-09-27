(function (root) {
  "use strict";
  var k=root.ScalingSlideKit, colors=["part-one","part-two","part-three"], codes=[25,7,2];
  var books=[
    [[24,"0.7","0.3","0.1","0.4"],[25,"0.1","0.8","0.2","0.6"],[26,"0.4","0.1","0.8","0.2"]],
    [[6,"0.6","0.3","0.5","0.1"],[7,"0.2","0.4","0.7","0.1"],[8,"0.2","0.2","0.3","0.5"]],
    [[1,"0.1","0.7","-1.0","2.1"],[2,"1.3","-1.5","0.4","2.7"],[3,"0.3","-0.4","3.1","0.7"]]
  ];
  function text(parent,x,y,value,cls) {
    return k.text(parent,x,y,value,"recjpq-codebooks-label "+(cls||""));
  }
  function rect(parent,x,y,width,height,cls) {
    return k.node("rect",{x:x,y:y,width:width,height:height,rx:3,"class":cls},parent);
  }
  function cell(parent,x,y,width,value,cls) {
    rect(parent,x,y,width,45,"recjpq-codebooks-cell "+(cls||""));
    if(value!==undefined)text(parent,x+width/2,y+31,String(value),"recjpq-codebooks-value");
  }
  function arrow(parent,d,cls) {
    k.node("path",{d:d,"class":"recjpq-codebooks-arrow "+(cls||""),"marker-end":"url(#recjpq-codebooks-arrow)"},parent);
  }
  root.ScalingDiagrams.codebooks=function (host,slide) {
    var svg=k.canvas(host,slide.scaling.diagramLabel);svg.setAttribute("viewBox","0 0 1400 600");
    var defs=k.node("defs",{},svg),marker=k.node("marker",{id:"recjpq-codebooks-arrow",viewBox:"0 0 10 10",refX:9,refY:5,markerWidth:7,markerHeight:7,orient:"auto"},defs);
    k.node("path",{d:"M0 0 L10 5 L0 10 Z","class":"recjpq-codebooks-arrowhead"},marker);
    var base=k.group(svg,0);
    text(base,75,43,"Item ID");cell(base,30,63,90,4);
    arrow(base,"M120 85 H178");
    rect(base,180,50,1080,72,"recjpq-codebooks-tuple");
    text(base,720,32,"Fixed sub-item IDs for item 4");
    text(base,160,488,"Item embedding","recjpq-codebooks-heading");
    text(base,160,518,"Three joined parts");
    books.forEach(function (book,index) {
      var tableX=80+index*450,center=tableX+170,embeddingX=310+index*260;
      cell(base,center-50,63,100,codes[index],colors[index]);
      var source=k.node("g",{"class":"recjpq-codebooks-source","data-code":codes[index]},base);
      text(source,center,192,"Sub-item embeddings C"+["₁","₂","₃"][index]);
      book.forEach(function (row,r) {
        cell(source,tableX,215+r*45,80,row[0]);
        row.slice(1).forEach(function (value,c) {cell(source,tableX+80+c*65,215+r*45,65,value,colors[index]);});
      });
      for(var c=0;c<4;c++)cell(base,embeddingX+c*65,465,65,undefined,"recjpq-codebooks-empty");
      var selected=k.group(svg,index*2+1);selected.classList.add("recjpq-codebooks-select");selected.dataset.code=codes[index];
      rect(selected,center-50,63,100,45,"recjpq-codebooks-selection");
      arrow(selected,"M"+center+" 127 V172 H"+(tableX-25)+" V282 H"+(tableX-7),"recjpq-codebooks-select-arrow");
      rect(selected,tableX,260,340,45,"recjpq-codebooks-selection");
      text(selected,700,158,"Select code "+codes[index]+" → row "+codes[index]+" in C"+["₁","₂","₃"][index],"recjpq-codebooks-step-label");
      var copy=k.group(svg,index*2+2);copy.classList.add("recjpq-codebooks-copy");copy.dataset.code=codes[index];
      var destination=embeddingX+130;
      arrow(copy,"M"+(tableX+346)+" 282 H"+(tableX+370)+" V365 C"+(tableX+370)+" 405 "+destination+" 405 "+destination+" 454","recjpq-codebooks-copy-arrow");
      text(copy,700,158,"Copy these four values into embedding part "+(index+1),"recjpq-codebooks-step-label");
      var vector=k.node("g",{"class":"recjpq-codebooks-copy-vector"},copy);
      vector.style.setProperty("--copy-x",(tableX+80-embeddingX)+"px");vector.style.setProperty("--copy-y","-205px");
      book[1].slice(1).forEach(function (value,c) {cell(vector,embeddingX+c*65,465,65,value,colors[index]);});
      text(copy,destination,543,"From row "+codes[index]+" in C"+["₁","₂","₃"][index]);
      if(index===2)text(copy,700,588,"One 12-dimensional vector → same SASRec transformer","recjpq-codebooks-heading");
    });
  };
})(window);
