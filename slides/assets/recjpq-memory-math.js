(function (root) {
  "use strict";
  function estimate(items, dimensions) {
    if (!Number.isSafeInteger(items) || items < 1 ||
        !Number.isSafeInteger(dimensions) || dimensions < 1 ||
        !Number.isSafeInteger(items * dimensions * 20)) throw new Error("Invalid embedding table size");
    var parameters = items * dimensions, buffer = parameters * 4;
    return {parameters:parameters, weights:buffer, gradients:buffer, moments:buffer*2,
      workspace:buffer, total:buffer*5};
  }
  function number(value) { return value.toLocaleString("en-US", {maximumFractionDigits:2}); }
  function compressed(items, dimensions, codeLength, vectorsPerCodebook) {
    var vectors=vectorsPerCodebook===undefined?256:vectorsPerCodebook;
    var dense=estimate(items,dimensions);
    if (!Number.isSafeInteger(codeLength) || codeLength<1 || dimensions%codeLength!==0) throw new Error("Invalid code length");
    if (!Number.isSafeInteger(vectors) || vectors<2 || vectors>65536) throw new Error("Invalid codebook size");
    var bytesPerCode=vectors<=256?1:2;
    var learned=estimate(vectors,dimensions), codes=items*codeLength*bytesPerCode;
    if (!Number.isSafeInteger(codes+learned.total)) throw new Error("Unsafe compressed table size");
    return {parameters:learned.parameters, weights:learned.weights, gradients:learned.gradients,
      moments:learned.moments, workspace:learned.workspace, codes:codes, total:codes+learned.total,
      trainingRatio:dense.total/(codes+learned.total), parameterRatio:dense.parameters/learned.parameters, bytesPerCode:bytesPerCode,
      vectorsPerCodebook:vectors, vectorSize:dimensions/codeLength,
      uniqueCodes:Math.pow(vectors,codeLength)};
  }
  function count(value) {
    for (var scale of [[1e9,"B"],[1e6,"M"],[1e3,"K"]]) {
      if (value >= scale[0]) return number(value/scale[0])+scale[1];
    }
    return number(value);
  }
  function bytes(value) {
    for (var scale of [[1e12,"TB"],[1e9,"GB"],[1e6,"MB"],[1e3,"KB"]]) {
      if (value >= scale[0]) return number(value/scale[0])+" "+scale[1];
    }
    return number(value)+" B";
  }
  root.RecJPQMemoryMath = {estimate:estimate, compressed:compressed, count:count, bytes:bytes};
})(typeof globalThis !== "undefined" ? globalThis : window);
