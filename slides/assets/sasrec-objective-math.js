(function (root) {
  "use strict";
  function softplus(x) {
    return Math.max(x, 0) + Math.log1p(Math.exp(-Math.abs(x)));
  }
  function sigmoid(x) { return Math.exp(-softplus(-x)); }
  function validate(scores) {
    if (!scores.length || !scores.every(Number.isFinite)) throw new Error("Scores must be finite numbers");
  }
  function contributions(positiveScore, negativeScores) {
    validate([positiveScore].concat(negativeScores));
    var positive = softplus(-positiveScore);
    var negatives = negativeScores.map(softplus);
    var negative = negatives.reduce(function (sum, value) { return sum + value; }, 0);
    return { positive: positive, negatives: negatives, negative: negative, total: positive + negative };
  }
  function evaluate(scores, vectors, mode, position) {
    validate(scores);
    if (mode !== "bce" && mode !== "softmax") throw new Error("Unknown objective");
    if (vectors.length !== scores.length || !vectors.every(function (v) {
      return Array.isArray(v) && v.length === 2 && v.every(Number.isFinite);
    })) throw new Error("One finite 2D vector per score is required");
    var probabilities, loss;
    if (mode === "bce") {
      probabilities = scores.map(sigmoid);
      loss = contributions(scores[0], scores.slice(1)).total;
    } else {
      var max = Math.max.apply(null, scores);
      var exps = scores.map(function (s) { return Math.exp(s - max); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      probabilities = exps.map(function (value) { return value / sum; });
      loss = (max - scores[0]) + Math.log(sum);
    }
    var derivatives = probabilities.map(function (p, index) { return p - (index === 0 ? 1 : 0); });
    var gradient = [0, 0];
    vectors.forEach(function (vector, index) {
      vector.forEach(function (value, axis) { gradient[axis] += derivatives[index] * value; });
    });
    var itemGradients;
    if (position !== undefined) {
      if (!Array.isArray(position) || position.length !== 2 || !position.every(Number.isFinite)) {
        throw new Error("A finite 2D sequence representation is required");
      }
      itemGradients = derivatives.map(function (value) {
        return position.map(function (coordinate) { return value * coordinate; });
      });
    }
    return { total: loss, probabilities: probabilities, derivatives: derivatives, gradient: gradient,
      itemGradients: itemGradients };
  }
  root.SASRecObjectiveMath = { softplus: softplus, sigmoid: sigmoid, contributions: contributions, evaluate: evaluate };
})(typeof globalThis !== "undefined" ? globalThis : window);
