(function (root) {
  "use strict";
  // Synthetic click log: all timestamps belong to the same illustrative day.
  var day = "2025-01-01";
  var events = [
    { user: "u17", item: "A", time: "09:12" },
    { user: "u23", item: "E", time: "09:14" },
    { user: "u17", item: "B", time: "09:18" },
    { user: "u23", item: "A", time: "09:20" },
    { user: "u17", item: "C", time: "09:24" },
    { user: "u23", item: "F", time: "09:27" },
    { user: "u17", item: "D", time: "09:31" },
    { user: "u23", item: "B", time: "09:34" },
    { user: "u23", item: "G", time: "09:39" }
  ].map(function (event) {
    return Object.freeze(Object.assign({ action: "click", timestamp: day + "T" + event.time + ":00Z" }, event));
  });
  var validationStart = day + "T09:23:00Z", testStart = day + "T09:30:00Z";
  function sequences(log) {
    var grouped = new Map();
    log.slice().sort(function (a, b) { return a.timestamp.localeCompare(b.timestamp); }).forEach(function (event) {
      if (!grouped.has(event.user)) grouped.set(event.user, []);
      grouped.get(event.user).push(event);
    });
    return Array.from(grouped, function (pair) { return { user: pair[0], events: pair[1] }; });
  }
  function perUserSplit(sequence, index) {
    if (index === sequence.length - 1) return "test";
    if (index === sequence.length - 2) return "validation";
    return "train";
  }
  function globalSplit(event) {
    if (event.timestamp >= testStart) return "test";
    if (event.timestamp >= validationStart) return "validation";
    return "train";
  }
  function examples(sequence, method) {
    if (method !== "per-user" && method !== "global") throw new Error("Unknown split method");
    // One prediction per retained event with a nonempty observed prefix.
    // Later test targets may use earlier, now-observed test clicks as context.
    return sequence.slice(1).map(function (event, offset) {
      var index = offset + 1;
      return {
        history: sequence.slice(0, index), target: event,
        split: method === "per-user" ? perUserSplit(sequence, index) : globalSplit(event)
      };
    });
  }
  root.SequenceSplitExample = Object.freeze({
    day: day, events: Object.freeze(events), validationStart: validationStart, testStart: testStart,
    sequences: sequences, perUserSplit: perUserSplit, globalSplit: globalSplit, examples: examples
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
