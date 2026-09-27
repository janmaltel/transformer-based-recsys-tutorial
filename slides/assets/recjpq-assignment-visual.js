(function (root) {
  "use strict";
  var k = root.ScalingSlideKit;
  var interactions = [
    [0,1,0,0,0,0,1,1], [0,0,0,0,1,0,0,1],
    [0,1,0,0,0,1,0,0], [0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,1,0], [0,0,1,0,0,1,0,0],
    [0,0,0,0,1,0,0,1], [1,1,0,0,0,1,0,0]
  ];
  var users = [
    ["1.3","-0.2","0.9"], ["0.9","-0.9","-0.4"],
    ["0.9","0.9","0.0"], ["0.0","0.0","0.0"],
    ["0.7","-0.7","0.0"], ["0.5","0.7","-0.9"],
    ["0.9","-0.9","-0.4"], ["1.1","1.1","0.0"]
  ];
  var items = [
    ["0.2","0.2","0.0"], ["0.5","0.5","0.4"],
    ["0.1","0.1","-0.4"], ["0.0","0.0","0.0"],
    ["0.4","-0.5","-0.4"], ["0.4","0.5","-0.4"],
    ["0.3","-0.2","0.4"], ["0.5","0.4","0"]
  ];
  var codes = [[0,2,2],[2,2,2],[0,1,0],[0,1,1],[2,0,0],[1,2,0],[1,0,2],[2,0,1]];
  function text(parent, x, y, value, cls) {
    return k.text(parent, x, y, value, "recjpq-assignment-label " + (cls || ""));
  }
  function matrix(parent, x, y, values, width, height, binary) {
    values.forEach(function (row, r) {
      row.forEach(function (value, c) {
        k.node("rect", {x:x+c*width,y:y+r*height,width:width,height:height,
          "class":"recjpq-assignment-cell"+(binary && value===1 ? " is-event" : "")}, parent);
        text(parent,x+(c+.5)*width,y+(r+.5)*height+6,String(value),"recjpq-assignment-value");
      });
    });
  }
  function flow(parent, path) {
    k.node("path", {d:path,"class":"recjpq-assignment-flow","marker-end":"url(#recjpq-assignment-arrow)"},parent);
  }
  function step(parent, x, y, width, title, lines) {
    k.node("rect", {x:x,y:y,width:width,height:98,rx:2,"class":"recjpq-assignment-step"},parent);
    text(parent,x+width/2,y+28,title,"recjpq-assignment-heading");
    lines.forEach(function (line,index) {text(parent,x+width/2,y+56+index*26,line);});
  }
  root.ScalingDiagrams["assignment"] = function (host, slide) {
    var svg=k.canvas(host,slide.scaling.diagramLabel);svg.setAttribute("viewBox","0 0 1460 640");
    var defs=k.node("defs",{},svg),marker=k.node("marker",{id:"recjpq-assignment-arrow",viewBox:"0 0 10 10",refX:9,refY:5,markerWidth:8,markerHeight:8,orient:"auto-start-reverse"},defs);
    k.node("path",{d:"M0 0 L10 5 L0 10 Z","class":"recjpq-assignment-arrowhead"},marker);
    var input=k.group(svg,0);
    text(input,165,38,"Items","recjpq-assignment-heading");
    matrix(input,61,60,interactions,26,26,true);
    var userLabel=text(input,34,164,"Users","recjpq-assignment-heading");userLabel.setAttribute("transform","rotate(-90 34 164)");
    text(input,165,302,"User–item interactions");text(input,165,328,"matrix");
    flow(input,"M269 177 H308");step(input,320,128,142,"Step 1",["Truncated","SVD"]);
    var factors=k.group(svg,1);
    flow(factors,"M462 177 H516");
    text(factors,630,38,"User embeddings","recjpq-assignment-heading");matrix(factors,534,94,users,64,26);
    text(factors,770,192,"×","recjpq-assignment-symbol");
    text(factors,894,49,"Largest singular","recjpq-assignment-heading");text(factors,894,76,"values","recjpq-assignment-heading");
    matrix(factors,798,149,[["2.5",0,0],[0,"2.2",0],[0,0,"1.4"]],64,26);
    text(factors,1044,192,"×","recjpq-assignment-symbol");
    text(factors,1238,38,"Item embeddings","recjpq-assignment-heading");matrix(factors,1142,80,items,64,26);
    k.node("path",{d:"M1120 60 Q1062 184 1120 306 M1358 60 Q1416 184 1358 306","class":"recjpq-assignment-bracket"},factors);
    text(factors,1386,69,"T","recjpq-assignment-symbol");
    var assignment=k.group(svg,2);
    flow(assignment,"M1244 290 C1280 404 1180 472 1072 475");
    step(assignment,794,426,278,"Step 2",["Normalise, add noise","and quantise"]);
    flow(assignment,"M794 459 C640 440 532 443 416 466");
    matrix(assignment,320,370,codes,32,26,false);
    text(assignment,368,620,"Sub-item ID assignments","recjpq-assignment-heading");
  };
})(window);
