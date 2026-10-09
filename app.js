(function(){
"use strict";
const {START, FERIADOS, BLOCOS, SEM, GYM, GYM_META} = window.PLANO;
const {CAT, ORDEM, semana} = window.GRADE;

/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k,v){ try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k,v); } catch(e){} }
};
const DIAS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const DIAS_LONGO = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const ddmm = d => `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}`;
const hhmm = n => `${String(Math.floor(n/60)%24).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;
const horas = n => { const h = Math.floor(n/60), m = Math.round(n%60); return m ? `${h}h${String(m).padStart(2,"0")}` : `${h}h`; };
const totMin = seg => seg.reduce((a,s)=>a+s[0],0);
const fmtDur = m => { m = Math.round(m/5)*5; const h = Math.floor(m/60), r = m%60; return h ? `${h}h${r ? String(r).padStart(2,"0") : ""}` : `${r}'`; };
const hoje0 = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const minAgora = () => { const n = new Date(); return n.getHours()*60 + n.getMinutes(); };
const dow = d => (d.getDay()+6)%7; // seg = 0

/* semana do plano (0–11) de uma data, ou null fora do ciclo */
function semanaDoPlano(d){
  const w = Math.floor((d - START) / (7*864e5));
  return w >= 0 && w < SEM.length ? w : null;
}

/* ---------- sessões de um dia do plano ---------- */
function sessoesDoDia(wk, d){
  const w = SEM[wk], bl = w.bloco;
  /* seg corrida 1 · ter pedal · qua só academia · qui pedal · sex corrida 2 · sáb Z2 · dom longo (w.sex = pedal de quinta) */
  const plan = [
    [[w.r1,"run","Corrida 1 · 18h"],[{letra:"B",bloco:bl},"gym"]],
    [[w.ter,"bike","Pedal 05h15"],[{letra:"A",bloco:bl},"gym"]],
    [[{letra:"D",bloco:bl},"gym"]],
    [[w.sex,"bike","Pedal 05h15"],[{letra:"C",bloco:bl},"gym"]],
    [[w.r2,"run","Corrida 2 · 18h"],[{letra:"E",bloco:bl},"gym"]],
    [[w.sz2,"bike","Pedal Z2 05h15"]],
    [[w.sab,"bike","Pedal longo 05h15"]].concat(w.r3?[[w.r3,"run","Corrida 3 · transição"]]:[])
  ];
  return plan[d].map(([s,k,lbl],j)=>({s, k, lbl, key:`plano26:s${wk}d${d}i${j}`}));
}

const ZH = {1:22,2:42,3:62,4:82,5:100};
const profileHTML = seg => `<div class="profile" aria-hidden="true">${seg.map(s=>`<span class="z${s[1]}" style="flex:${s[0]} 0 0;height:${ZH[s[1]]}%"></span>`).join("")}</div>`;
const gymTable = rows => `<div class="tbl"><table><thead><tr><th>Exercício</th><th>Séries</th><th>Desc.</th><th>Dica</th></tr></thead><tbody>${
  rows.map(r=>`<tr><td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td><td class="num">${esc(r[2])}</td><td class="muted">${esc(r[3]||"")}</td></tr>`).join("")}</tbody></table></div>`;
const nomeGarmin = (wk, s) => `S${String(wk+1).padStart(2,"0")} ${s.nome.replace(/×/g,"x")}`;

/* cards que abrem e fecham: lembra o que o Levy abriu/fechou enquanto o app está aberto
   (o "Hoje" redesenha a cada minuto e não pode fechar o card na cara dele) */
const abertos = new Map();
document.addEventListener("toggle", e=>{ const f = e.target.dataset && e.target.dataset.fold; if (f) abertos.set(f, e.target.open); }, true);
const estaAberto = (id, padrao) => abertos.has(id) ? abertos.get(id) : padrao;
const fold = (id, padrao, resumo, corpo) =>
  `<details class="fold" data-fold="${id}"${estaAberto(id,padrao)?" open":""}><summary>${resumo}</summary><div class="fb">${corpo}</div></details>`;

function card({s,k,lbl,key}, wk, aba, abrir){
  const done = store.get(key) === "1";
  const head = (label, title, dur) => `<span class="ch"><span class="t"><span class="kind">${esc(label)}</span><h3>${esc(title)}</h3></span><span class="dur">${dur}</span></span>`;
  const check = `<label class="chk"><input type="checkbox" data-k="${key}"${done?" checked":""}> Feito</label>`;
  if (k === "rest") return `<div class="card rest">${head("Descanso","Folga total","—")}<p class="obs">${esc(lbl || "Dormir bem e comer direito também é treino.")}</p></div>`;
  const id = `${aba}:${key}`;
  if (k === "gym") {
    const g = GYM_META[s.letra];
    return `<div class="card gym${done?" done":""}">${fold(id, abrir, head("Academia "+s.letra+" · 18h", g.nome, g.dur),
      `<p class="obs">Bloco ${s.bloco}: ${esc(BLOCOS[s.bloco-1])}</p>${gymTable(GYM[s.bloco][s.letra])}`)}${check}</div>`;
  }
  return `<div class="card ${k}${done?" done":""}">${fold(id, abrir, head(lbl, s.nome, fmtDur(totMin(s.seg))),
    `${profileHTML(s.seg)}
    <ol class="steps">${s.passos.map(p=>`<li>${esc(p)}</li>`).join("")}</ol>
    ${s.obs?`<p class="obs">${esc(s.obs)}</p>`:""}
    <span class="garmin">No relógio: ${esc(nomeGarmin(wk,s))}</span>`)}${check}</div>`;
}

/* marcar "feito" em qualquer aba */
document.addEventListener("change", e=>{
  const k = e.target.dataset && e.target.dataset.k; if (!k) return;
  store.set(k, e.target.checked ? "1" : null);
  document.querySelectorAll(`input[data-k="${k}"]`).forEach(i=>{ i.checked = e.target.checked; i.closest(".card").classList.toggle("done", e.target.checked); });
  const p = $("prog"); if (p) { const bx = $("days").querySelectorAll("input[data-k]"); p.textContent = `${[...bx].filter(b=>b.checked).length}/${bx.length} feitos`; }
});

/* ================= HOJE ================= */
let offset = 0;
function renderHoje(){
  const dia = addDays(hoje0(), offset), d = dow(dia), ehHoje = offset === 0;
  const rel = {"-1":"Ontem","0":"Hoje","1":"Amanhã"}[offset];
  $("top-sub").textContent = `${DIAS_LONGO[d]}, ${ddmm(dia)}`;
  $("top-tit").textContent = rel || DIAS_LONGO[d];
  $("dia-hoje").disabled = ehHoje;

  const modo = store.get("grade26:modo") === "B" ? "B" : "A";
  const blocos = semana(modo)[d], m = minAgora();
  /* agora / primeiro compromisso */
  if (ehHoje){
    const at = blocos.find(x=>m>=x.i && m<x.f) || blocos[0];
    const prox = blocos.find(x=>x.i>=at.f && !x.opt);
    $("agora").innerHTML = `<span class="eyebrow">Agora · ${hhmm(m)}</span><b>${esc(at.t)}</b><span class="mono muted">até ${hhmm(at.f)}</span>${prox?`<span class="nx">Depois: ${esc(prox.t)} às ${hhmm(prox.i)}</span>`:""}`;
    $("agora").hidden = false;
  } else $("agora").hidden = true;

  /* contexto do plano */
  const wk = semanaDoPlano(dia), fer = FERIADOS[iso(dia)];
  let ctx = "";
  if (wk === null) ctx = dia < START ? `O plano de treino começa <b>segunda, 12/10</b>. Até lá, a grade já vale.` : `Ciclo de 12 semanas concluído.`;
  else { const w = SEM[wk]; ctx = `<span class="eyebrow">Semana ${wk+1} · ${esc(w.foco)}${w.deload?" · descarga":""}</span><br>${esc(w.nota)}`; }
  if (fer) ctx = `<span class="conferir">${esc(fer)}</span> ` + ctx;
  $("hoje-ctx").innerHTML = ctx ? `<div class="wknote">${ctx}</div>` : "";

  const n = nutriDia(dia);
  $("hoje-nutri").className = `fold ncomer ${TIPOS[n.tipo].cls}`;
  $("hoje-nutri-res").innerHTML = `<span class="eyebrow">Comer ${rel ? rel.toLowerCase() : "no dia"} · ${TIPOS[n.tipo].nome}</span><span><b class="mono">${milhar(n.kcal)} kcal</b> · ${n.prot} g proteína · ${n.carb} g carbo</span>`;
  $("hoje-refs").innerHTML = refeicoesHTML(n);
  $("hoje-nutri-ir").onclick = ()=>{ nwk = wk === null ? (dia < START ? -1 : SEM.length-1) : wk; nd = d; ntipo = null; abrir("nutri"); };

  $("hoje-treinos").innerHTML = wk === null
    ? `<p class="empty">Sem treino do plano neste dia.</p>`
    : sessoesDoDia(wk, d).map(x=>card(x, wk, "hoje", true)).join("");

  /* agenda: só os treinos do dia; fechada mostra só o resumo */
  const itens = blocos.filter(x=>x.k==="treino");
  const atual = ehHoje && itens.find(x=>m>=x.i && m<x.f);
  $("agenda-resumo").textContent = !itens.length ? "Sem treino na agenda" : atual ? `Agora: ${atual.t}` : `${itens.length} ${itens.length>1?"treinos":"treino"} · ${itens.map(x=>hhmm(x.i)).join(" e ")}`;
  $("hoje-agenda").innerHTML = itens.map(x=>{
    const cls = [CAT[x.k].cls, x.opt?"opt":"", ehHoje && m>=x.f ? "past":"", ehHoje && m>=x.i && m<x.f ? "cur":""].join(" ");
    return `<li class="${cls}"><span class="h">${hhmm(x.i)}–${hhmm(x.f)}</span><div><div class="t">${esc(x.t)}</div>${x.n?`<div class="n">${esc(x.n)}</div>`:""}</div></li>`;
  }).join("");
}
$("dia-ant").onclick = ()=>{ offset--; renderHoje(); };
$("dia-prox").onclick = ()=>{ offset++; renderHoje(); };
$("dia-hoje").onclick = ()=>{ offset = 0; renderHoje(); };

/* ================= TREINOS ================= */
const wkAtual = () => { const w = semanaDoPlano(hoje0()); return w === null ? (hoje0() < START ? 0 : SEM.length-1) : w; };
let wk = wkAtual();
$("weeknav").innerHTML = [1,2,3].map(b=>`<div class="wkg"><span class="eyebrow">Bloco ${b} · ${BLOCOS[b-1]}</span><div class="wkbtns">${
  SEM.map((w,i)=>w.bloco===b?`<button type="button" data-w="${i}" class="${w.deload?"deload":""}${i===semanaDoPlano(hoje0())?" now":""}" aria-pressed="false" aria-label="Semana ${i+1}${w.deload?" (descarga)":""}">S${i+1}</button>`:"").join("")}</div></div>`).join("");
$("weeknav").addEventListener("click", e=>{ const b = e.target.closest("button[data-w]"); if(!b) return; wk = +b.dataset.w; renderTreinos(); });

function zoneMins(w){ const m = {1:0,2:0,3:0,4:0,5:0}; [w.ter,w.sex,w.sz2,w.sab,w.r1,w.r2,w.r3].forEach(s=>{ if(s) s.seg.forEach(([t,z])=>m[z]+=t); }); return m; }
function renderTreinos(){
  const w = SEM[wk], ini = addDays(START, wk*7), hj = hoje0();
  document.querySelectorAll("#weeknav button").forEach(b=>b.setAttribute("aria-pressed", String(+b.dataset.w===wk)));
  let total = 0, feitos = 0;
  $("days").innerHTML = DIAS.map((dn,d)=>{
    const dt = addDays(ini,d), fer = FERIADOS[iso(dt)], ss = sessoesDoDia(wk,d);
    ss.forEach(x=>{ if (x.k!=="rest"){ total++; if (store.get(x.key)==="1") feitos++; } });
    return `<div><div class="dayh${+dt===+hj?" today":""}"><b>${dn}</b><span>${ddmm(dt)}</span>${fer?`<em>${esc(fer)}</em>`:""}</div><div class="cards">${ss.map(x=>card(x,wk,"treinos",false)).join("")}</div></div>`;
  }).join("");
  $("wkhead").innerHTML = `<div><span class="eyebrow">Bloco ${w.bloco} · ${BLOCOS[w.bloco-1]}${w.deload?" · descarga":""}</span><h2>Semana ${wk+1} · ${esc(w.foco)}</h2><span class="mono muted small">${ddmm(ini)} → ${ddmm(addDays(ini,6))}</span></div><span class="mono muted small" id="prog">${feitos}/${total} feitos</span>`;
  $("wknote").textContent = w.nota;
  const m = zoneMins(w), tot = Object.values(m).reduce((a,b)=>a+b,0);
  $("wkdist").innerHTML = `<div class="distlbl"><span>Bike + corrida: ${fmtDur(tot)}</span><span class="mono">${Math.round((m[1]+m[2])/tot*100)}% em Z1–Z2</span></div><div class="stack">${
    [1,2,3,4,5].map(z=>{const p=m[z]/tot*100; return p>0?`<div class="z${z}" style="width:${p}%">${p>=8?Math.round(p)+"%":""}</div>`:"";}).join("")}</div>`;
}

/* ================= ACADEMIA ================= */
let gb = SEM[wkAtual()].bloco;
$("gtabs").innerHTML = [1,2,3].map(b=>`<button type="button" data-b="${b}" aria-pressed="false">Bloco ${b}</button>`).join("");
$("gtabs").addEventListener("click", e=>{ const b = e.target.closest("button[data-b]"); if(!b) return; gb = +b.dataset.b; renderAcademia(); });
function renderAcademia(){
  document.querySelectorAll("#gtabs button").forEach(b=>b.setAttribute("aria-pressed", String(+b.dataset.b===gb)));
  $("gnote").textContent = `${BLOCOS[gb-1]}. ${GYM[gb].nota}`;
  const letraHoje = ["B","A","D","C","E",null,null][dow(hoje0())];
  $("glist").innerHTML = ["A","B","C","D","E"].map(L=>{ const g = GYM_META[L], hj = L===letraHoje;
    return `<div class="card gym gw${hj?" hoje":""}">${fold(`academia:${gb}${L}`, hj,
      `<span class="ch"><span class="t"><span class="kind">${esc(g.quando)}${hj?" · hoje":""}</span><h3>${L} · ${esc(g.nome)}</h3></span><span class="dur">${g.dur}</span></span>`,
      gymTable(GYM[gb][L]))}</div>`; }).join("");
}

/* ================= NUTRIÇÃO ================= */
const {ATUAL, HIST, GASTO, TIPOS, DIA_TIPO, PROT, GORD, REFEICOES, NA_BIKE, TROCAS_CARB, TROCAS_PROT} = window.NUTRI;
const r50 = n => Math.round(n/50)*50, r5 = n => Math.round(n/5)*5;
const milhar = n => String(n).replace(/\B(?=(\d{3})+$)/g, ".");
const virg = (n, c=1) => String(+n.toFixed(c)).replace(".", ",");
const MAGRA = ATUAL.peso*(1-ATUAL.pgc/100);
const TMB = 370 + 21.6*MAGRA; // fórmula da própria InBody (dá 1.706 com a massa magra de ago/25, igual ao exame)

/* gasto e metas de uma data: o treino vem das sessões daquela semana do plano */
function nutriDia(dt, semTreino){
  /* antes de 12/10 a grade já vale: estima com os treinos da semana 1. Depois do ciclo, dia leve.
     semTreino: o modelo do dia leve (nenhum dia do plano é leve, então sai sem treino). */
  const pre = dt < START, w = pre ? 0 : semanaDoPlano(dt), d = dow(dt), tipo = w === null || semTreino ? "leve" : DIA_TIPO[d];
  let treino = 0, bikeMin = 0;
  if (w !== null && !semTreino){
    sessoesDoDia(w, d).forEach(({s,k})=>{
      if (k === "bike" || k === "run"){ s.seg.forEach(([t,z])=>{ treino += t*GASTO[k][z]; }); if (k === "bike") bikeMin = totMin(s.seg); }
      else if (k === "gym" && s.letra !== "E") treino += parseInt(GYM_META[s.letra].dur.replace(/\D/g,""),10)*GASTO.gym*(SEM[w].deload ? 0.6 : 1);
    });
    if (d === 1 || d === 3 || d === 5) treino += GASTO.idaVolta*GASTO.bike[1];
  }
  const base = TMB*GASTO.fator, gasto = base + treino;
  const kcal = r50(Math.max(GASTO.piso, gasto - TIPOS[tipo].deficit + ATUAL.ajuste));
  const prot = Math.round(PROT*ATUAL.peso), gord = Math.round(GORD*ATUAL.peso);
  const carb = Math.round((kcal - prot*4 - gord*9)/4);
  const taxa = bikeMin ? NA_BIKE.find(r=>bikeMin<=r[0])[1] : 0;
  const pedal = taxa ? r5(taxa*(bikeMin - 30)/60) : 0;
  return {pre, tipo, refs: REFEICOES[tipo], base:r50(base), treino:r50(treino), gasto:r50(gasto), kcal, prot, carb, gord, bikeMin, taxa, pedal};
}

/* lista de refeições com gramas de proteína e carboidrato de cada uma */
function refeicoesHTML(n){
  return n.refs.map(([h,nome,txt,p,parte])=>{
    if (h === "Na bike"){
      const t = n.bikeMin ? fmtDur(n.bikeMin) : "";
      txt = n.pedal ? `${t} de pedal: ~${n.pedal} g de carboidrato (${n.taxa} g por hora depois dos primeiros 30'), 500–750 ml de água por hora. Vai por fora da meta do dia.`
                    : `${t} de pedal: só água.`;
      return `<li class="pre"><span class="h">${h}</span><div><div class="t">${esc(nome)}</div><div class="n">${esc(txt)}</div></div></li>`;
    }
    const pg = r5(p*n.prot/150), cg = r5(n.carb*parte);
    return `<li><span class="h">${h}</span><div><div class="t">${esc(nome)}</div><div class="g mono">${pg?`${pg} g prot`:""}${pg&&cg?" · ":""}${cg?`${cg} g carbo`:""}</div><div class="n">${esc(txt)}</div></div></li>`;
  }).join("");
}

/* semana mostrada na aba: -1 = a semana antes do plano começar */
const nwkMin = hoje0() < START ? -1 : 0;
let nwk = semanaDoPlano(hoje0()), nd = dow(hoje0()), ntipo = null; // ntipo: tipo escolhido nos cards de cima (null = o do dia)
if (nwk === null) nwk = hoje0() < START ? -1 : SEM.length-1;
$("ndias").innerHTML = DIAS.map((d,i)=>`<button type="button" data-d="${i}"><span>${d}</span><small></small></button>`).join("");
$("ntipos").innerHTML = Object.entries(TIPOS).map(([k,t])=>`<button type="button" class="${t.cls}" data-t="${k}">${t.curto}</button>`).join("");
$("ndias").addEventListener("click", e=>{ const x = e.target.closest("button[data-d]"); if(!x) return; nd = +x.dataset.d; ntipo = null; renderNutri(); });
$("ntipos").addEventListener("click", e=>{ const x = e.target.closest("button[data-t]"); if(!x) return; ntipo = x.dataset.t; renderNutri(); });
$("nsemana").addEventListener("click", e=>{ const x = e.target.closest("tr[data-d]"); if(!x) return; nd = +x.dataset.d; ntipo = null; renderNutri(); document.querySelector("main").scrollTop = 0; });
$("nwk-ant").onclick = ()=>{ if (nwk > nwkMin){ nwk--; renderNutri(); } };
$("nwk-prox").onclick = ()=>{ if (nwk < SEM.length-1){ nwk++; renderNutri(); } };
$("ntrocac").innerHTML = TROCAS_CARB.map(r=>`<tr><td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td></tr>`).join("");
$("ntrocap").innerHTML = TROCAS_PROT.map(r=>`<tr><td>${esc(r[0])}</td><td class="num">${esc(r[1])}</td></tr>`).join("");
{
  const gord = ATUAL.peso - MAGRA, g12 = gord - 3.5, m12 = MAGRA + 1.5, p12 = g12 + m12;
  $("ninbody").innerHTML = `<div class="tbl"><table>
    <thead><tr><th></th><th>Peso</th><th>Gordura</th><th>Massa magra</th></tr></thead><tbody>
    ${HIST.map(h=>`<tr><td>InBody ${h.quando}</td><td class="num">${h.peso} kg</td><td class="num">${h.pgc} · ${h.gord} kg</td><td class="num">${h.magra} kg</td></tr>`).join("")}
    <tr><td><b>Hoje</b> <span class="muted small">(${esc(ATUAL.fonte)})</span></td><td class="num">${virg(ATUAL.peso)} kg</td><td class="num">~${ATUAL.pgc}% · ${virg(gord)} kg</td><td class="num">~${virg(MAGRA)} kg</td></tr>
    <tr><td><b>Meta da semana 12</b></td><td class="num">~${virg(p12)} kg</td><td class="num">~${Math.round(g12/p12*100)}% · ${virg(g12)} kg</td><td class="num">~${virg(m12)} kg</td></tr>
    <tr><td><b>Depois: a melhor fase</b></td><td class="num">~72,5 kg</td><td class="num">~13% · 9,5 kg</td><td class="num">~63 kg</td></tr>
    </tbody></table></div>
    <p>Com 1,75 m e 75 kg o IMC dá 24,5, normal; o que mudou foi a composição. O peso é o de 2023, mas hoje tem <b>uns 5 kg a mais de gordura e 3–4 kg a menos de massa magra</b>. Por isso a meta não é emagrecer: é <b>recompor</b>, perder gordura e recuperar músculo ao mesmo tempo.</p>
    <p>Massa magra de ~${virg(MAGRA,0)} kg dá um metabolismo de repouso de <b>~${milhar(r50(TMB))} kcal</b> (a mesma fórmula do InBody, que deu 1.706 em ago/25). As metas da aba partem daí, mais o gasto de cada treino.</p>
    <p>Meta das 12 semanas: <b>−3,5 kg de gordura e +1,5 kg de massa magra</b>, com déficit médio de ~300 kcal por dia e 2 g de proteína por kg. Músculo que já existiu volta mais rápido: a balança cai pouco, a cintura cai mais.</p>
    <p class="muted">Faz um InBody na semana 1 <span class="conferir">[CONFERIR]</span> e troca peso e % no dados.js: tudo se recalcula. Outro na semana 12 pra medir o ciclo.</p>`;
}

function metasHTML(n){
  return [["Energia", milhar(n.kcal), "kcal"],["Proteína", n.prot, "g"],["Carboidrato", n.carb, "g"],["Gordura", n.gord, "g"]]
    .map(([t,v,u])=>`<div><span class="eyebrow">${t}</span><b class="mono">${v}<small> ${u}</small></b></div>`).join("");
}
function renderNutri(){
  const ini = addDays(START, nwk*7), hj = hoje0();
  /* tipo escolhido no card: mostra o primeiro dia desta semana com esse tipo (o leve sai sem treino) */
  const dm = ntipo && ntipo !== "leve" ? DIA_TIPO.indexOf(ntipo) : nd;
  if (ntipo && ntipo !== "leve" && dm === nd) ntipo = null;
  const dt = addDays(ini, dm), n = nutriDia(dt, ntipo === "leve"), x = TIPOS[n.tipo];
  $("nwk").innerHTML = `<b>${nwk < 0 ? "Antes do plano" : `Semana ${nwk+1}${SEM[nwk].deload?" · descarga":""}`}</b><span class="mono muted small">${ddmm(ini)} → ${ddmm(addDays(ini,6))}</span>`;
  $("nwk-ant").disabled = nwk <= nwkMin; $("nwk-prox").disabled = nwk >= SEM.length-1;
  document.querySelectorAll("#ndias button").forEach(b=>{ const i = +b.dataset.d, t = TIPOS[nutriDia(addDays(ini,i)).tipo];
    b.className = t.cls + (+addDays(ini,i)===+hj ? " today" : ""); b.querySelector("small").textContent = t.curto;
    b.setAttribute("aria-pressed", String(!ntipo && i===nd)); });
  document.querySelectorAll("#ntipos button").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.t===n.tipo)));
  $("ndia").innerHTML = ntipo
    ? `<span class="eyebrow">Modelo · ${ntipo === "leve" ? "dia sem treino" : `como ${DIAS_LONGO[dm].toLowerCase()}, ${ddmm(dt)}`}</span><b>${x.nome}</b>`
    : `<span class="eyebrow">${DIAS_LONGO[nd]}, ${ddmm(dt)}${+dt===+hj?" · hoje":""}</span><b>${x.nome}</b>`;
  $("nmetas").className = `metas ${x.cls}`;
  $("nmetas").innerHTML = metasHTML(n);
  $("ngasto").textContent = `Gasto estimado ${milhar(n.gasto)} kcal = ${milhar(n.base)} do dia a dia + ${milhar(n.treino)} de treino${n.pre ? " (treinos da semana 1)" : ""}. Meta: ${milhar(n.gasto - n.kcal)} abaixo.`;
  $("nnota").textContent = x.nota;
  $("nrefs").innerHTML = refeicoesHTML(n);
  let sg = 0, sk = 0;
  $("nsemana").innerHTML = DIAS.map((dn,i)=>{ const d2 = addDays(ini,i), m = nutriDia(d2); sg += m.gasto; sk += m.kcal;
    return `<tr data-d="${i}" class="${TIPOS[m.tipo].cls}${!ntipo&&i===nd?" sel":""}${+d2===+hj?" hj":""}"><td><b>${dn}</b></td><td><i class="nd"></i>${TIPOS[m.tipo].nome.replace("Dia do ","").replace("Dia ","").replace("Véspera do longo","véspera")}</td><td class="num">${milhar(m.gasto)}</td><td class="num">${milhar(m.kcal)}</td><td class="num">${m.carb} g</td></tr>`; }).join("");
  const def = Math.round((sg - sk)/7);
  $("nsemres").textContent = `Média da semana: ~${def} kcal abaixo do gasto por dia, uns ${virg(def*7/7700,2)} kg de gordura. Toque num dia pra ver as refeições dele.`;
}

/* ================= GRADE ================= */
let modo = store.get("grade26:modo") === "B" ? "B" : "A";
let diaAtivo = dow(new Date());
const H0 = 4*60, H1 = 24*60, S = 1.1, altura = (H1-H0)*S;
$("daytabs").innerHTML = DIAS.map((d,i)=>`<button type="button" data-d="${i}">${d}</button>`).join("");
$("daytabs").addEventListener("click", e=>{ const x = e.target.closest("button[data-d]"); if(!x) return; diaAtivo = +x.dataset.d; renderGrade(); });
$("modo").addEventListener("click", e=>{ const x = e.target.closest("button[data-m]"); if(!x) return; modo = x.dataset.m; store.set("grade26:modo", modo); renderGrade(); });

function blocoHTML(x, cur){
  const top = (Math.max(x.i,H0)-H0)*S, h = (Math.min(x.f,H1)-Math.max(x.i,H0))*S - 2;
  if (h <= 0) return "";
  const rot = `${hhmm(x.i)}–${hhmm(x.f)}`, partes = [];
  if (h >= 15) partes.push(`<span class="bt">${esc(x.t)}</span>`);
  if (h >= 34) partes.push(`<span class="bh">${rot}${x.opt?" · opcional":""}</span>`);
  if (x.n && h >= 70) partes.push(`<span class="bn">${esc(x.n)}</span>`);
  return `<div class="blk ${CAT[x.k].cls}${x.k==="sono"?" sono":""}${x.opt?" opt":""}${cur?" cur":""}" style="top:${top}px;height:${h}px" title="${esc(x.t+", "+rot)}">${partes.join("")}</div>`;
}
function renderGrade(){
  const sem = semana(modo), hj = dow(new Date()), m = minAgora();
  document.querySelectorAll("#modo button").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.m===modo)));
  document.querySelectorAll("#daytabs button").forEach(b=>b.setAttribute("aria-pressed", String(+b.dataset.d===diaAtivo)));
  let html = `<div></div>` + DIAS.map((d,i)=>`<div class="colh day${i===hj?" today":""}${i===diaAtivo?" on":""}">${DIAS_LONGO[i]}</div>`).join("");
  let ax = ""; for (let hr = 4; hr <= 23; hr++) ax += `<span style="top:${(hr*60-H0)*S}px">${String(hr).padStart(2,"0")}h</span>`;
  html += `<div class="axis" style="height:${altura}px">${ax}</div>`;
  html += sem.map((dia,i)=>{
    const now = i===hj && m>=H0 ? `<div class="nowline" style="top:${(m-H0)*S}px"></div>` : "";
    return `<div class="dbody day${i===diaAtivo?" on":""}" style="height:${altura}px;--hr:${60*S}px">${dia.map(x=>blocoHTML(x, i===hj && m>=x.i && m<x.f)).join("")}${now}</div>`;
  }).join("");
  $("grid").innerHTML = html;

  const tot = {}; ORDEM.forEach(k=>tot[k]=0);
  sem.forEach(dia=>dia.forEach(x=>{ tot[x.opt?"livre":x.k] += x.f-x.i; }));
  $("bar").innerHTML = ORDEM.map(k=>`<div class="${CAT[k].cls}" style="width:${tot[k]/(7*1440)*100}%;background:var(--c)"></div>`).join("");
  $("legend").innerHTML = ORDEM.filter(k=>tot[k]>0).map(k=>`<div class="${CAT[k].cls}"><i></i><span>${CAT[k].nome}</span><span class="h">${horas(tot[k])}</span></div>`).join("");
  $("destaque").innerHTML = modo==="A"
    ? `<b>${horas(tot.foco+tot.estudo+tot.leve)} de estudo por semana</b>, sendo <b>${horas(tot.foco)} só de TCC</b>. Treino: ${horas(tot.treino)}. Sono: média de ${horas(tot.sono/7)} por noite.`
    : `Com trabalho, o TCC continua com <b>${horas(tot.foco)} por semana</b> (inclui 2h no sábado). Trabalho: ${horas(tot.trab)}. Sono: média de ${horas(tot.sono/7)} por noite.`;
}

/* ================= navegação ================= */
const RENDER = {hoje:renderHoje, treinos:renderTreinos, academia:renderAcademia, nutri:renderNutri, grade:renderGrade};
let atual = "hoje";
function abrir(v){
  atual = v;
  document.querySelectorAll(".view").forEach(s=>s.hidden = s.id !== "v-"+v);
  document.querySelectorAll("#tabbar button").forEach(b=>b.toggleAttribute("aria-current", b.dataset.v===v));
  document.querySelectorAll("#tabbar button[aria-current]").forEach(b=>b.setAttribute("aria-current","page"));
  if (v !== "hoje"){ $("top-tit").textContent = $("v-"+v).dataset.tit; $("top-sub").textContent = v==="grade" ? "Semana-padrão" : v==="nutri" ? "Plano alimentar" : "Plano Pedal + Força"; }
  RENDER[v]();
  document.querySelector("main").scrollTop = 0;
}
/* o Safari do iPhone ignora user-scalable=no: bloqueia a pinça na mão */
["gesturestart","gesturechange"].forEach(ev=>document.addEventListener(ev, e=>e.preventDefault(), {passive:false}));
$("tabbar").addEventListener("click", e=>{ const b = e.target.closest("button[data-v]"); if (b) abrir(b.dataset.v); });
abrir(RENDER[location.hash.slice(1)] ? location.hash.slice(1) : "hoje"); // link com #treinos abre direto na aba

/* atualiza "agora" a cada minuto e quando o app volta pra frente */
setInterval(()=>{ if (atual==="hoje" || atual==="grade") RENDER[atual](); }, 60000);
document.addEventListener("visibilitychange", ()=>{ if (!document.hidden && (atual==="hoje" || atual==="grade")) RENDER[atual](); });

/* offline */
if ("serviceWorker" in navigator) window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
})();
