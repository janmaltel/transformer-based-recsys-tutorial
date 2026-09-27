(function (root) {
  "use strict";

  function layerNormVector(input, weight, bias, dimension) {
    var output = new Float32Array(dimension);
    var mean = 0;
    var index;
    for (index = 0; index < dimension; index += 1) {
      mean += input[index];
    }
    mean /= dimension;
    var variance = 0;
    for (index = 0; index < dimension; index += 1) {
      var centered = input[index] - mean;
      variance += centered * centered;
    }
    var scale = 1 / Math.sqrt(variance / dimension + 1e-5);
    for (index = 0; index < dimension; index += 1) {
      output[index] = (input[index] - mean) * scale * weight[index] + bias[index];
    }
    return output;
  }

  function layerNormSequence(input, rows, dimension, weight, bias) {
    var output = new Float32Array(input.length);
    for (var row = 0; row < rows; row += 1) {
      var normalized = layerNormVector(
        input.subarray(row * dimension, (row + 1) * dimension),
        weight,
        bias,
        dimension
      );
      output.set(normalized, row * dimension);
    }
    return output;
  }

  function linearVector(input, weight, bias, outputSize, inputSize) {
    var output = new Float32Array(outputSize);
    for (var row = 0; row < outputSize; row += 1) {
      var sum = bias[row];
      var weightOffset = row * inputSize;
      for (var column = 0; column < inputSize; column += 1) {
        sum += input[column] * weight[weightOffset + column];
      }
      output[row] = sum;
    }
    return output;
  }

  function linearSequence(input, rows, weight, bias, dimension) {
    var output = new Float32Array(rows * dimension);
    for (var row = 0; row < rows; row += 1) {
      output.set(
        linearVector(
          input.subarray(row * dimension, (row + 1) * dimension),
          weight,
          bias,
          dimension,
          dimension
        ),
        row * dimension
      );
    }
    return output;
  }

  function causalAttentionAll(q, k, v, rows, dimension) {
    var output = new Float32Array(rows * dimension);
    var logits = new Float64Array(rows);
    var scale = 1 / Math.sqrt(dimension);
    for (var queryRow = 0; queryRow < rows; queryRow += 1) {
      var maxLogit = -Infinity;
      for (var keyRow = 0; keyRow <= queryRow; keyRow += 1) {
        var dot = 0;
        for (var inner = 0; inner < dimension; inner += 1) {
          dot +=
            q[queryRow * dimension + inner] *
            k[keyRow * dimension + inner];
        }
        logits[keyRow] = dot * scale;
        maxLogit = Math.max(maxLogit, logits[keyRow]);
      }
      var denominator = 0;
      for (keyRow = 0; keyRow <= queryRow; keyRow += 1) {
        logits[keyRow] = Math.exp(logits[keyRow] - maxLogit);
        denominator += logits[keyRow];
      }
      for (keyRow = 0; keyRow <= queryRow; keyRow += 1) {
        var probability = logits[keyRow] / denominator;
        for (inner = 0; inner < dimension; inner += 1) {
          output[queryRow * dimension + inner] +=
            probability * v[keyRow * dimension + inner];
        }
      }
    }
    return output;
  }

  function attentionLast(q, k, v, rows, dimension) {
    var output = new Float32Array(dimension);
    var weights = new Float32Array(rows);
    var scale = 1 / Math.sqrt(dimension);
    var maxLogit = -Infinity;
    var row;
    for (row = 0; row < rows; row += 1) {
      var dot = 0;
      for (var inner = 0; inner < dimension; inner += 1) {
        dot += q[inner] * k[row * dimension + inner];
      }
      weights[row] = dot * scale;
      maxLogit = Math.max(maxLogit, weights[row]);
    }
    var denominator = 0;
    for (row = 0; row < rows; row += 1) {
      weights[row] = Math.exp(weights[row] - maxLogit);
      denominator += weights[row];
    }
    for (row = 0; row < rows; row += 1) {
      weights[row] /= denominator;
      for (inner = 0; inner < dimension; inner += 1) {
        output[inner] += weights[row] * v[row * dimension + inner];
      }
    }
    return { output: output, weights: weights };
  }

  root.GSASRecBrowser = root.GSASRecBrowser || {};
  root.GSASRecBrowser.math = {
    attentionLast: attentionLast,
    causalAttentionAll: causalAttentionAll,
    layerNormSequence: layerNormSequence,
    layerNormVector: layerNormVector,
    linearSequence: linearSequence,
    linearVector: linearVector
  };
})(globalThis);
