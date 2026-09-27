(function (root) {
  "use strict";
  var state=root.RecJPQMemoryState, nextId=0;
  var presets=[[3416,"Small · MovieLens","MovieLens-1M",128],[1280969,"Medium · Gowalla","Gowalla",256],[200000000,"Industry · 200M","Illustrative industry catalogue",512]];
  function el(parent,tag,cls,value) {
    var node=document.createElement(tag);node.className=cls||"";
    if(value!==undefined)node.textContent=value;
    if(parent)parent.appendChild(node);return node;
  }
  function button(parent,label,action) {
    var node=el(parent,"button","recjpq-calc-button",label);node.type="button";node.addEventListener("click",action);return node;
  }
  function mount(panel) {
    var row=el(panel,"div","recjpq-calc-presets");row.setAttribute("aria-label","Catalogue presets");
    var catalogueButtons=presets.map(function (preset) {
      return {value:preset[0],node:button(row,preset[1],function () {state.set({items:preset[0],dimensions:preset[3],codeLength:8,vectorsPerCodebook:256});})};
    });
    var field=el(panel,"label","recjpq-calc-field");el(field,"span","","Number of items");
    var input=el(field,"input");input.type="number";input.min="1";input.max="1000000000";input.step="1";
    input.setAttribute("aria-label","Number of catalogue items");
    var detail=el(panel,"p","recjpq-calc-detail");detail.id="recjpq-catalogue-detail-"+(++nextId);input.setAttribute("aria-describedby",detail.id);
    input.addEventListener("input",function () {
      if(!input.validity.valid||!Number.isSafeInteger(input.valueAsNumber)) {
        input.setAttribute("aria-invalid","true");detail.textContent="Enter a whole number from 1 to 1 billion items.";return;
      }
      state.set({items:input.valueAsNumber});input.removeAttribute("aria-invalid");
    });
    var dims=el(panel,"div","recjpq-calc-dimensions");el(dims,"span","","Embedding size");
    var dimensionButtons=[128,256,512].map(function (dimension) {
      return {value:dimension,node:button(dims,String(dimension),function () {state.set({dimensions:dimension});})};
    });
    state.subscribe(function (value) {
      input.value=value.items;input.removeAttribute("aria-invalid");
      var preset=presets.find(function (entry) {return entry[0]===value.items;});
      detail.textContent=(preset?preset[2]+" · ":value.items===34742?"Booking.com · ":"")+value.items.toLocaleString("en-US")+" items";
      catalogueButtons.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry.value===value.items));});
      dimensionButtons.forEach(function (entry) {entry.node.setAttribute("aria-pressed",String(entry.value===value.dimensions));});
    });
  }
  root.RecJPQMemoryControls={mount:mount,el:el,button:button};
})(window);
