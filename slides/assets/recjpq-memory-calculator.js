(function (root) {
  "use strict";
  var math = root.RecJPQMemoryMath;
  function el(parent, tag, cls, text) {
    var node = document.createElement(tag); node.className = cls || "";
    if (text !== undefined) node.textContent = text;
    if (parent) parent.appendChild(node); return node;
  }
  function mount(host, main) {
    var panel = el(null, "div", "recjpq-memory-calculator"); panel.dataset.buildStep = "1";
    panel.setAttribute("role", "group"); panel.setAttribute("aria-label", "Embedding training memory calculator");
    host.insertBefore(panel, host.lastElementChild);
    root.RecJPQMemoryControls.mount(panel);
    var results = el(panel, "div", "recjpq-calc-results"); results.setAttribute("aria-live", "polite");
    function result(label) {
      var group = el(results,"div"); el(group,"span","recjpq-calc-result-label",label);
      return el(group,"output","recjpq-calc-value");
    }
    var parameterValue=result("Embedding parameters"), memoryValue=result("FP32 GPU training memory");
    var breakdown = el(panel,"dl","recjpq-calc-breakdown");
    var parts = [["weights","Weights"],["gradients","Gradients"],["moments","Adam moments (m + v)"],["workspace","Optimizer workspace (est.)"]].map(function (part) {
      el(breakdown,"dt","",part[1]); return {key:part[0],value:el(breakdown,"dd")};
    });
    root.RecJPQMemoryState.subscribe(function (value) {
      var items=value.items, dimensions=value.dimensions, estimate=math.estimate(items,dimensions);
      parameterValue.textContent=math.count(estimate.parameters); memoryValue.textContent="≈ "+math.bytes(estimate.total);
      parts.forEach(function (part) {part.value.textContent=(part.key==="workspace"?"≈ ":"")+math.bytes(estimate[part.key]);});
      var svg=main.querySelector("svg");
      svg.querySelector(".recjpq-memory-size").textContent=math.count(estimate.parameters)+" parameters";
      svg.querySelector(".recjpq-memory-items").textContent=math.count(items)+" items";
      svg.querySelector(".recjpq-memory-dimension").textContent="d = "+dimensions+" · one vector per item";
      panel.dataset.parameters=estimate.parameters;panel.dataset.trainingBytes=estimate.total;
    });
  }
  root.RecJPQMemoryCalculator = {mount:mount};
})(window);
