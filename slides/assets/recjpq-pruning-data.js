(function (root) {
  "use strict";
  // Table 2, Petrov et al., SIGIR 2025: https://arxiv.org/html/2505.00560v1.
  // Each pair is [RecJPQ exhaustive score reuse (PQTopK), RecJPQPrune].
  var benchmarks={
    gowalla:{label:"Gowalla",items:1271638,
      sasrec:{median:[10.19,3.50],tail:[10.88,8.51]},
      gsasrec:{median:[10.11,4.59],tail:[10.81,7.99]},
      gbert:{median:[9.57,6.42],tail:[10.61,19.79]}},
    tmall:{label:"Tmall",items:2194464,
      sasrec:{median:[16.72,3.18],tail:[18.26,4.59]},
      gsasrec:{median:[16.75,5.20],tail:[19.68,6.39]},
      gbert:{median:[16.66,5.11],tail:[17.76,6.53]}}
  };
  function afterProcessing(tables,items,processed,k) {
    function used(r,code) {return processed.some(function (p) {return p.part===r&&p.code===code;});}
    var maxima=tables.map(function (book,r) {return Math.max.apply(null,book.filter(function (row) {return !used(r,row.code);}).map(function (row) {return row.score;}));});
    var scored=items.filter(function (item) {return item.codes.some(function (code,r) {return used(r,code);});}).map(function (item) {
      return {name:item.name,score:root.PQTopKData.score(tables,item).total};
    }).sort(function (a,b) {return b.score-a.score;});
    var bound=maxima.reduce(function (sum,x) {return sum+x;},0),threshold=scored.length>=k?scored[k-1].score:-Infinity;
    return {maxima:maxima,bound:bound,scored:scored,threshold:threshold,canStop:scored.length>=k&&bound<threshold};
  }
  root.RecJPQPruningData={benchmarks:benchmarks,afterProcessing:afterProcessing};
})(window);
