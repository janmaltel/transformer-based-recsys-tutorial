(function (root) {
  "use strict";
  var canonical = root.CanonicalMoviePredictionExample;
  var movies = canonical.history.concat(canonical.recommendations[0]);
  var scienceFiction = root.ScienceFictionMoviePredictionExample;
  function pairs(sequence) {
    return sequence.slice(1).map(function (target, index) {
      return { history: sequence.slice(0, index + 1), target: target };
    });
  }
  function paddedRow(sequence, length) {
    if (!Number.isInteger(length) || length < 1) throw new Error("Window length must be a positive integer");
    // Match the bundled gSASRec implementation: pad L+1 events, then shift.
    // A PAD -> first-movie pair exists, but its INPUT-derived loss mask is 0.
    var window = sequence.slice(-(length + 1));
    var padded = Array(length + 1 - window.length).fill(null).concat(window);
    var input = padded.slice(0, -1), target = padded.slice(1);
    return {
      input: input, target: target,
      mask: input.map(function (movie) { return movie ? 1 : 0; })
    };
  }
  function supervisionRow(sequence, length) {
    var row = paddedRow(sequence, length);
    // Teaching view: omit ignored labels rather than expose sampler details.
    return { input: row.input, target: row.target.map(function (movie, index) {
      return row.mask[index] ? movie : null;
    }), mask: row.mask };
  }
  root.SASRecTrainingData = {
    movies: movies, pairs: pairs, paddedRow: paddedRow, supervisionRow: supervisionRow,
    batch: [movies, scienceFiction.history.concat(scienceFiction.recommendations[0])],
    users: ["u17", "u23"], windowLength: 3
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
