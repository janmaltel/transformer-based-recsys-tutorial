(function (root) {
  "use strict";
  function sigmoid(value) {
    if (value >= 0) return 1 / (1 + Math.exp(-value));
    var exp = Math.exp(value); return exp / (1 + exp);
  }
  function negativeLogSigmoid(value) {
    return value >= 0 ? Math.log1p(Math.exp(-value)) : -value + Math.log1p(Math.exp(value));
  }
  function evaluate(scores, beta, population) {
    population = population === undefined ? 3415 : population;
    var k = scores.length - 1;
    if (k < 1 || population < k || !Number.isFinite(population) ||
        beta < 0 || beta > 1 || !Number.isFinite(beta) ||
        scores.some(function (s) { return !Number.isFinite(s); })) throw new Error("Invalid gBCE scenario");
    var alpha = k / population;
    var probabilities = scores.map(sigmoid);
    var derivatives = probabilities.map(function (p, index) {
      return (index === 0 ? beta * (p - 1) : p) / (k + 1);
    });
    var loss = beta * negativeLogSigmoid(scores[0]);
    scores.slice(1).forEach(function (score) { loss += negativeLogSigmoid(-score); });
    return {alpha: alpha, beta: beta, probabilities: probabilities, derivatives: derivatives,
      updates: derivatives.map(function (g) { return -g; }), loss: loss / (k + 1)};
  }
  root.GBCEGradientMath = {evaluate: evaluate};
})(typeof globalThis !== "undefined" ? globalThis : window);
