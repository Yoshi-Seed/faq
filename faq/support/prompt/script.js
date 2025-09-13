
(()=>{
const container=document.getElementById('prompt-container');
const indexNav=document.getElementById('tech-index');
const hamburger=document.getElementById('hamburger');
const overlay=document.getElementById('overlay');
const original={};
let data=null;

const toFull=n=>String(n).replace(/[0-9]/g,d=>String.fromCharCode(d.charCodeAt(0)+0xFEE0));
const nl2br=s=>s.replace(/\n/g,'<br>');

// <赤文字> プレースホルダーを生成
function placeholderHTML(txt) {
  const esc = txt
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  /* ① インライン 1 行 (改行･空白なし)
     ② ラッパーごと contenteditable="false" — 括弧は削除不可
     ③ プレースホルダー部分だけ contenteditable="true"
  */
  return `<span class="placeholder-wrapper" contenteditable="false"><span class="brkt">&lt;</span><span class="prompt-placeholder" contenteditable="true" data-bs-toggle="tooltip" title="〈 ${esc} 〉">${esc}</span><span class="brkt">&gt;</span></span>`;
}

async function loadJSON(){
  if(window.aiPromptData) return window.aiPromptData;
  try{
    const r=await fetch('ai_all_techniques.json');
    if(r.ok) return await r.json();
  }catch{}
  return null;
}

function toggleSidebar(show){document.body.classList.toggle('sidebar-open',show);}

function buildIndex(){
  const list=document.createElement('div');
  list.className='list-group list-group-flush';
  data.parts.forEach((part,pi)=>{
    const partH=document.createElement('div');
    partH.className='list-group-item list-group-item-secondary fw-bold';
    partH.textContent=part.title||`部${pi+1}`;
    list.appendChild(partH);
    part.chapters.forEach((chap,ci)=>{
      const chapH=document.createElement('div');
      chapH.className='list-group-item list-group-item-light ps-3 fw-semibold';
      chapH.textContent=chap.title||`章${ci+1}`;
      list.appendChild(chapH);
      chap.techniques.forEach(tech=>{
        const a=document.createElement('a');
        a.className='list-group-item list-group-item-action ps-5';
        a.href='#tech-'+tech.id;
        a.textContent=`${tech.id}. ${tech.name}`;
        a.addEventListener('click',()=>toggleSidebar(false));
        list.appendChild(a);
      });
    });
  });
  indexNav.appendChild(list);
}

function buildContent(){
  data.parts.forEach((part,pi)=>{
    const p=document.createElement('h2');
    p.className='part-title'; p.textContent=part.title||`${toFull(pi+1)}部`;
    container.appendChild(p);

    part.chapters.forEach((chap,ci)=>{
      const c=document.createElement('h3');
      c.className='chapter-title mt-3';
      c.textContent=chap.title||`第${toFull(ci+1)}章`;
      container.appendChild(c);

      chap.techniques.forEach(tech=>{
        const id='prompt-'+tech.id;
        original[id]=tech.prompt;
        const tNum=String(tech.id).padStart(2,'0');
        const processed = nl2br(tech.prompt).replace(
          /〈\s*([^〉]+?)\s*〉/g,
          (_, p1) => placeholderHTML(p1)
        );
        const card=document.createElement('div');
        card.className='accordion mb-3';
        card.innerHTML=`
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#col-${id}" aria-expanded="true">
              <span class="tech-number">技法 ${tNum}</span><span class="tech-name" id="tech-${tech.id}">${tech.name}</span>
            </button>
          </h2>
          <div id="col-${id}" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <p class="text-muted">${nl2br(tech.description||'')}</p>
              <div id="${id}" class="prompt-text border p-3 mb-3" contenteditable="true">${processed}</div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary copy-btn" data-target="${id}">コピー</button>
                <button class="btn btn-sm btn-outline-secondary reset-btn" data-target="${id}">リセット</button>
              </div>
            </div>
          </div>
        </div>`;
        container.appendChild(card);
      });
    });
  });
  buildIndex();
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el=>new bootstrap.Tooltip(el));
}

function initEvents(){
  hamburger.addEventListener('click',()=>toggleSidebar(!document.body.classList.contains('sidebar-open')));
  overlay.addEventListener('click',()=>toggleSidebar(false));
  container.addEventListener('click',async e=>{
    const copy=e.target.closest('.copy-btn');
    const reset=e.target.closest('.reset-btn');
    if(copy){
      const id=copy.dataset.target;
      
      const raw = document.getElementById(id).innerText.trim();
      const noBreak = raw.replace(/\r?\n/g, "");   // ← 改行をすべて空文字に
      await navigator.clipboard.writeText(noBreak);
            
      copy.textContent='コピー済み!';
      setTimeout(()=>copy.textContent='コピー',1500);
    }
    if(reset){
      const id=reset.dataset.target;
      const el=document.getElementById(id);
      let html = nl2br(original[id]).replace(
        /〈\s*([^〉]+?)\s*〉/g,
        (_, p1) => placeholderHTML(p1)
      );
      el.innerHTML=html;
      el.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(t=>new bootstrap.Tooltip(t));
    }
  });
}

loadJSON().then(d=>{
  data=d;
  if(!data){container.innerHTML='<div class="alert alert-danger">データを読み込めませんでした。</div>';return;}
  buildContent();
  initEvents();
});
})();
