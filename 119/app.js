
(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const state = {
    patientMeds: [],
    plannedDrug: null,
    version: "0.1.0"
  };

  const normalize = (s) => (s||"")
    .toString()
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)) // zenkaku->hankaku
    .replace(/[ﾞ゛]/g,"")
    .replace(/\s+/g,"")
    ;

  const DRUGS = window.EMS_DATA.drugs.map(d => ({
    ...d,
    _search: normalize([d.generic, d.english, ...(d.brands||[]), ...(d.synonyms||[])].join("|"))
  }));
  const PLANNED = window.EMS_DATA.planned;

  function renderQuickAdd(){
    const el = $("#categoryQuickAdd");
    el.innerHTML = "";
    window.EMS_DATA.categories_for_quickadd.forEach(group => {
      const btn = document.createElement("button");
      btn.textContent = group.label;
      btn.addEventListener("click", () => {
        group.ids.forEach(id => {
          const d = DRUGS.find(x=>x.id===id);
          if(d && !state.patientMeds.some(m=>m.id===d.id)){
            state.patientMeds.push(d);
          }
        });
        renderPatientChips();
        compute();
      });
      el.appendChild(btn);
    });
  }

  function searchHints(term){
    const q = normalize(term);
    if(!q) return [];
    const res = DRUGS.filter(d => d._search.includes(q)).slice(0, 8);
    return res;
  }

  function renderHints(term){
    const el = $("#searchHints");
    el.innerHTML = "";
    const items = searchHints(term);
    items.forEach(d => {
      const div = document.createElement("div");
      div.className = "hint-item";
      div.innerHTML = `<div><strong>${d.generic}</strong> <small>${(d.brands||[]).join(" / ")}</small></div><small>${d.english||""}</small>`;
      div.addEventListener("click", () => {
        addPatientMedById(d.id);
      });
      el.appendChild(div);
    });
  }

  function addPatientMedById(id){
    const d = DRUGS.find(x=>x.id===id);
    if(!d) return;
    if(!state.patientMeds.some(m=>m.id===id)){
      state.patientMeds.push(d);
      renderPatientChips();
      compute();
    }
    $("#searchInput").value = "";
    $("#searchHints").innerHTML = "";
  }

  function renderPatientChips(){
    const el = $("#patientChips");
    el.innerHTML = "";
    state.patientMeds.forEach(d => {
      const div = document.createElement("div");
      div.className = "chip";
      const classes = (d.classes||[]).slice(0,2).join(", ");
      div.innerHTML = `<span><strong>${d.generic}</strong> <small>${(d.brands||[])[0]||""}</small></span> <span class="tag">${classes}</span> <button class="x" aria-label="remove">×</button>`;
      div.querySelector(".x").addEventListener("click", () => {
        state.patientMeds = state.patientMeds.filter(x=>x.id!==d.id);
        renderPatientChips();
        compute();
      });
      el.appendChild(div);
    });
  }

  function renderPlanned(){
    const el = $("#plannedDrugs");
    el.innerHTML = "";
    PLANNED.forEach(p => {
      const div = document.createElement("div");
      div.className = "item" + (state.plannedDrug===p.id ? " active" : "");
      div.textContent = p.label;
      div.addEventListener("click", () => {
        state.plannedDrug = p.id;
        renderPlanned();
        compute();
      });
      el.appendChild(div);
    });
  }

  function compute(){
    const resultsEl = $("#results");
    const okEl = $("#noResults");
    resultsEl.innerHTML = "";

    const planned = state.plannedDrug;
    if(!planned){
      okEl.hidden = true;
      return;
    }
    const classesPresent = new Set();
    const flagsPresent = new Set();
    state.patientMeds.forEach(d => {
      (d.classes||[]).forEach(c => classesPresent.add(c));
      (d.flags||[]).forEach(f => flagsPresent.add(f));
    });

    const rules = window.EMS_RULES.rules.filter(r => r.planned_any_of.includes(planned));
    const hits = rules.filter(r => {
      let hit = false;
      if(r.patient_classes_any_of){
        hit = r.patient_classes_any_of.some(c => classesPresent.has(c));
      }
      if(!hit && r.patient_flags_any_of){
        hit = r.patient_flags_any_of.some(f => flagsPresent.has(f));
      }
      return hit;
    });

    if(hits.length===0){
      okEl.hidden = false;
      return;
    } else {
      okEl.hidden = true;
    }

    // Sort by severity
    const order = { red:0, orange:1, yellow:2, green:3 };
    hits.sort((a,b)=> order[a.severity]-order[b.severity]);

    hits.forEach(h => {
      const div = document.createElement("div");
      div.className = "res " + h.severity;
      const refsHtml = (h.refs||[]).map(r => `<a target="_blank" rel="noopener" href="${r.url}">${r.label}</a>`).join(" / ");
      div.innerHTML = `<div class="tag">${planned}</div><div><strong>${h.title}</strong></div><div>${h.message}</div><div class="tag">${refsHtml}</div>`;
      resultsEl.appendChild(div);
    });
  }

  function wire(){
    $("#searchInput").addEventListener("input", (e) => {
      renderHints(e.target.value);
    });
    $("#addBtn").addEventListener("click", () => {
      const term = $("#searchInput").value;
      const hint = searchHints(term)[0];
      if(hint) addPatientMedById(hint.id);
    });
    $("#lastUpdated").textContent = window.EMS_DATA.version;
    $("#appVersion").textContent = state.version;

    renderQuickAdd();
    renderPatientChips();
    renderPlanned();
    compute();
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
