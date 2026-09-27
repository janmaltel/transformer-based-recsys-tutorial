(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function xAt(time) {
    var minutes = Number(time.slice(3));
    return 190 + (minutes - 10) * 830 / 30;
  }
  function splitColor(kit, split) {
    return { train: kit.colors.accent, validation: kit.colors.seq3, test: kit.colors.highlight }[split];
  }
  function axis(group, y) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit;
    d.arrow(group, 190, y, 1050, y, { color: kit.colors.muted });
    ["09:10", "09:20", "09:30", "09:40"].forEach(function (time) {
      var x = xAt(time);
      group.line(x, y - 4, x, y + 4).stroke({ color: kit.colors.muted, width: 1 });
      d.text(group, time, x, y + 11, { size: 16, color: kit.colors.muted, anchor: "middle" });
    });
    d.text(group, "time (UTC)", 1070, y - 7, { size: 15, color: kit.colors.muted });
  }
  function lanes(group, method, y) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SequenceSplitExample;
    data.sequences(data.events).forEach(function (sequence, row) {
      var center = y + row * 64;
      d.label(group, sequence.user, 28, center - 12, { size: 20 });
      group.line(190, center, 1038, center).stroke({ color: kit.colors.line, width: 1 });
      sequence.events.forEach(function (event, index) {
        var split = method === "per-user" ? data.perUserSplit(sequence.events, index) : data.globalSplit(event);
        var token = group.group().attr({
          "data-split-method": method, "data-split-user": event.user,
          "data-split-item": event.item, "data-split": split, "data-event-time": event.time
        });
        token.node.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "title"))
          .textContent = event.user + " · " + event.item + " · " + event.time + " · " + split;
        token.rect(42, 36).center(xAt(event.time), center).fill(splitColor(kit, split));
        d.centered(token, event.item, xAt(event.time), center, {
          size: 21, color: split === "validation" ? kit.colors.ink : kit.colors.white
        });
      });
      var count = data.examples(sequence.events, method).filter(function (example) { return example.split === "test"; }).length;
      d.text(group, count + (count === 1 ? " test target" : " test targets"), 1070, center - 9, { size: 17 });
    });
  }
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SequenceSplitExample;
    var canvas = kit.create(content, "Per-user and global temporal splits of the same click log",
      "Both methods use the same absolute time axis on January 1, 2025. Per-user last-two holdout assigns C and B to validation, D and G to test, one test target per user. Global cutoffs at 09:23 for validation and 09:30 for test assign C and F to validation, D to u17's test set, and B and G to u23's test set. Thus u23 has two test targets under the global protocol.",
      { className: "temporal-split-comparison", height: 550 });
    var draw = canvas.draw;
    var perUser = kit.stage(draw, 0, "per-user-split");
    d.text(perUser, "Per-user last-two holdout", 28, 24, { size: 24, weight: 600 });
    d.text(perUser, "Second-to-last: validation · last: test", 28, 62, { size: 18, color: kit.colors.muted });
    ["train", "validation", "test"].forEach(function (split, index) {
      var x = 735 + index * 148;
      perUser.rect(19, 19).move(x, 31).fill(splitColor(kit, split));
      d.text(perUser, split, x + 29, 29, { size: 17 });
    });
    lanes(perUser, "per-user", 130);
    axis(perUser, 243);

    var global = kit.stage(draw, 1, "global-time-split");
    global.line(28, 291, 1172, 291).stroke({ color: kit.colors.line, width: 1 });
    d.text(global, "Global timestamp cutoffs", 28, 310, { size: 24, weight: 600 });
    d.label(global, data.day + " · same log, same time axis", 680, 320, {
      size: 14, color: kit.colors.muted
    });
    [["09:23", "validation"], ["09:30", "test"]].forEach(function (cutoff) {
      var x = xAt(cutoff[0]);
      global.line(x, 381, x, 486).stroke({ color: kit.colors.secondary, width: 1.5, dasharray: "5 4" });
      d.text(global, cutoff[1] + " starts " + cutoff[0], x, 354, {
        size: 16, anchor: "middle", color: kit.colors.secondary
      });
    });
    lanes(global, "global", 409);
    axis(global, 515);
  }
  parts["temporal-splits"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
