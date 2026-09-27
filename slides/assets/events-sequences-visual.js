(function (root) {
  "use strict";
  var parts = root.SASRecVisualParts = root.SASRecVisualParts || {};
  function render(content) {
    var kit = root.DiagramKit, d = root.SASRecDetailKit, data = root.SequenceSplitExample;
    var canvas = kit.create(content, "Grouping an interleaved click log into user sequences",
      "Nine timestamp-sorted clicks interleave u17 and u23. Grouping by user preserves time order: u17 has A, B, C, D at 09:12, 09:18, 09:24, 09:31; u23 has E, A, F, B, G at 09:14, 09:20, 09:27, 09:34, 09:39. The sequences have four and five clicks, respectively.",
      { className: "events-sequences", height: 520 });
    var draw = canvas.draw;
    var raw = kit.stage(draw, 0, "interleaved-log");
    d.text(raw, "Timestamp-sorted click log", 28, 28, { size: 24, weight: 600 });
    d.label(raw, data.day + " · UTC", 28, 67, { size: 15, color: kit.colors.muted });
    var columns = [48, 170, 275, 375];
    raw.rect(450, 36).move(28, 109).fill(kit.colors.ink);
    ["time", "user", "item", "action"].forEach(function (value, index) {
      d.label(raw, value, columns[index], 117, { size: 17, color: kit.colors.white });
    });
    data.events.forEach(function (event, index) {
      var y = 145 + index * 36;
      var row = raw.group().attr({ "data-log-user": event.user, "data-log-time": event.time });
      row.rect(450, 36).move(28, y).fill(event.user === "u17" ? kit.colors.accentSoft : kit.colors.paper);
      row.line(28, y + 36, 478, y + 36).stroke({ color: kit.colors.lineFaint, width: 1 });
      [event.time, event.user, event.item, event.action].forEach(function (value, column) {
        d.label(row, value, columns[column], y + 9, {
          size: 17, color: column === 1 ? kit.colors.accent : kit.colors.ink, weight: column === 1 ? 600 : 400
        });
      });
    });
    d.arrow(raw, 503, 147, 503, 469, { color: kit.colors.muted });
    d.label(raw, "time", 481, 481, { size: 14, color: kit.colors.muted });

    data.sequences(data.events).forEach(function (sequence, index) {
      var group = kit.stage(draw, index + 1, "grouped-user-sequence");
      group.attr({ "data-sequence-user": sequence.user });
      if (index === 0) {
        d.text(group, "Group by user · preserve time order", 609, 28, { size: 22, weight: 600 });
        d.arrow(group, 534, 280, 584, 280);
      }
      var y = 169 + index * 192;
      d.label(group, sequence.user, 609, y - 45, { size: 21 });
      d.text(group, sequence.events.length + " clicks", 1115, y - 43, {
        size: 18, color: kit.colors.muted, anchor: "end"
      });
      sequence.events.forEach(function (event, position) {
        var x = 609 + position * 107;
        group.rect(64, 54).move(x, y).fill(kit.colors.accent);
        d.centered(group, event.item, x + 32, y + 27, { size: 25, color: kit.colors.white });
        d.text(group, event.time, x + 32, y + 66, {
          size: 16, color: kit.colors.muted, anchor: "middle"
        });
        if (position < sequence.events.length - 1) d.arrow(group, x + 73, y + 27, x + 96, y + 27);
      });
    });
  }
  parts["events-sequences"] = render;
})(typeof globalThis !== "undefined" ? globalThis : window);
