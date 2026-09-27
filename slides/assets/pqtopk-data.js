(function (root) {
  "use strict";
  // Published medians (milliseconds), Table 3, https://arxiv.org/pdf/2408.09992.
  // Order: matrix multiplication, original RecJPQ scoring, PQTopK.
  var benchmarks={
    booking:{label:"Booking.com",items:34742,
      sasrec:{ndcg:"0.188",backbone:23.75,scoring:[6.27,3.77,2.93],total:[30.03,27.53,26.69]},
      gbert4rec:{ndcg:"0.328",backbone:37.16,scoring:[6.22,3.90,3.09],total:[43.37,41.08,40.23]}},
    gowalla:{label:"Gowalla",items:1271638,
      sasrec:{ndcg:"0.120",backbone:24.67,scoring:[131.35,29.65,10.03],total:[156.07,54.32,34.72]},
      gbert4rec:{ndcg:"0.168",backbone:37.52,scoring:[133.40,33.87,13.79],total:[171.04,71.42,51.33]}}
  };
  // Toy vectors reuse the embedding-construction example, not measured data.
  var codebooks=[
    [{code:24,vector:[.7,.3,.1,.4]},{code:25,vector:[.1,.8,.2,.6]},{code:26,vector:[.4,.1,.8,.2]}],
    [{code:6,vector:[.6,.3,.5,.1]},{code:7,vector:[.2,.4,.7,.1]},{code:8,vector:[.2,.2,.3,.5]}],
    [{code:1,vector:[.1,.7,-1,2.1]},{code:2,vector:[1.3,-1.5,.4,2.7]},{code:3,vector:[.3,-.4,3.1,.7]}]
  ];
  var items=[{name:"Item A",codes:[25,7,2]},{name:"Item B",codes:[24,7,1]},{name:"Item C",codes:[25,8,3]}];
  var queries=[[.8,.1,-.1,.6,.8,.1,-.1,.6,.8,.1,-.1,.6],[.1,.8,.6,-.1,.1,.8,.6,-.1,.1,.8,.6,-.1]];
  function table(query) {
    return codebooks.map(function (book,r) {return book.map(function (entry) {
      return {code:entry.code,vector:entry.vector,score:entry.vector.reduce(function (sum,x,j) {return sum+x*query[r*4+j];},0)};
    });});
  }
  function score(tables,item) {
    var parts=item.codes.map(function (code,r) {return tables[r].find(function (entry) {return entry.code===code;}).score;});
    return {parts:parts,total:parts.reduce(function (a,b) {return a+b;},0)};
  }
  root.PQTopKData={benchmarks:benchmarks,codebooks:codebooks,items:items,queries:queries,table:table,score:score};
})(window);
