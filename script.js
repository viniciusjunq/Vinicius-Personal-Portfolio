const STORAGE = { lang: "vc_lang", theme: "vc_theme" };
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

function applyLang(lang){
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = (lang === "en") ? "en" : "pt-BR";
  $$("[data-pt][data-en]").forEach(el => {
    el.textContent = (lang === "en") ? el.dataset.en : el.dataset.pt;
  });
  const btn = $("#langToggle");
  if(btn){
    btn.textContent = (lang === "en") ? "PT" : "EN";
    btn.setAttribute("aria-label", (lang === "en") ? "Switch language to Portuguese" : "Mudar idioma para inglês");
  }
  try{ localStorage.setItem(STORAGE.lang, lang); }catch{}
}

function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  const btn = $("#themeToggle");
  if(btn){
    btn.textContent = (theme === "dark") ? "☀︎" : "☾";
    btn.setAttribute("aria-label", (theme === "dark") ? "Switch to light mode" : "Switch to dark mode");
  }
  try{ localStorage.setItem(STORAGE.theme, theme); }catch{}
}

function init(){
  const savedLang = (()=>{ try{return localStorage.getItem(STORAGE.lang);}catch{return null;} })();
  const savedTheme = (()=>{ try{return localStorage.getItem(STORAGE.theme);}catch{return null;} })();

  applyLang(savedLang || "pt");
  applyTheme(savedTheme || "light");

  $("#langToggle")?.addEventListener("click", () => {
    const next = (document.documentElement.dataset.lang === "en") ? "pt" : "en";
    applyLang(next);
  });

  $("#themeToggle")?.addEventListener("click", () => {
    const next = (document.documentElement.dataset.theme === "dark") ? "light" : "dark";
    applyTheme(next);
  });

  const modal = $("#projectModal");
  const title = $("#modalTitle");
  const text = $("#modalText");
  const stackBox = $("#modalStack");
  const liveBtn = $("#modalLive");
  const codeBtn = $("#modalCode");

  function openProject(id){
    const el = document.querySelector(`[data-project="${id}"]`);
    if(!el || !modal) return;
    const lang = document.documentElement.dataset.lang || "pt";

    title.textContent = (lang === "en") ? el.dataset.titleEn : el.dataset.titlePt;
    text.textContent  = (lang === "en") ? el.dataset.longEn : el.dataset.longPt;

    const stack = (el.dataset.stack || "").split(",").map(s=>s.trim()).filter(Boolean);
    stackBox.innerHTML = stack.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("");

    const live = el.dataset.live || "";
    const code = el.dataset.code || "";

    if(live){
      liveBtn.style.display = "inline-flex";
      liveBtn.href = live;
    }else{
      liveBtn.style.display = "none";
      liveBtn.removeAttribute("href");
    }

    if(code){
      codeBtn.style.display = "inline-flex";
      codeBtn.href = code;
    }else{
      codeBtn.style.display = "none";
      codeBtn.removeAttribute("href");
    }

    modal.showModal();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if(!b) return;
    e.preventDefault();
    openProject(b.getAttribute("data-open"));
  });

  $$(".modal-close").forEach(b => b.addEventListener("click", () => modal?.close()));

  modal?.addEventListener("click", (e) => {
    const box = modal.querySelector(".modal");
    const r = box.getBoundingClientRect();
    const inside = r.left <= e.clientX && e.clientX <= r.right && r.top <= e.clientY && e.clientY <= r.bottom;
    if(!inside) modal.close();
  });
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

document.addEventListener("DOMContentLoaded", init);
