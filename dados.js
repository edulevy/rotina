/* Dados do app: o Plano Pedal + Força (12 semanas) e a Grade Estudo e Treino.
   Copiados dos dois artifacts; pra mudar um treino ou um horário, é aqui. */

/* ================= PLANO PEDAL + FORÇA ================= */
window.PLANO = (function(){
"use strict";
const START = new Date(2026, 9, 12); // segunda 12/10/2026
const FERIADOS = {"2026-10-12":"Feriado","2026-11-02":"Finados","2026-11-15":"Feriado","2026-11-20":"Feriado","2026-12-24":"Véspera de Natal","2026-12-25":"Natal","2026-12-31":"Réveillon","2027-01-01":"Ano Novo"};
const BLOCOS = ["Base e adaptação","Força e limiar","Potência e VO2máx"];

/* segmentos: [minutos, zona]. reps(n, tiro, recuperação) */
const reps = (n, a, b) => { const o = []; for (let i = 0; i < n; i++) { o.push(a); if (b) o.push(b); } return o; };
const P = (...xs) => xs.flatMap(x => Array.isArray(x[0]) ? x : [x]);
const SPR = 10/60, SPR12 = 12/60;

const B = (nome, seg, passos, obs) => ({tipo:"bike", nome, seg, passos, obs});
const R = (nome, seg, passos, obs) => ({tipo:"run", nome, seg, passos, obs});

const testeSubida = (re) => B(re ? "Reteste de subida" : "Teste de subida",
  P([20,2],[20,4],[15,1]),
  ["20' Z2 até a base da subida, com 3× 30\" fortes no caminho",
   "Subida inteira no máximo que dá pra sustentar até o topo (ritmo constante, sem estourar no começo)",
   "Anota: tempo, FC média, FC máx e condições (vento, chão molhado, calor)",
   "Desce e solta 10–15' em Z1"],
  re ? "Mesma subida, mesmo horário da semana 2. Compara tempo e FC média." : "Escolhe uma subida que dê pra repetir na semana 12 (ex.: Vista Chinesa ou Canoa). Esta é a régua do ciclo.");

const longo = (h, seg, extra, obs) => B("Longo " + h, seg,
  ["Começa 15' bem leve (Z1)"].concat(extra, ["Comer a partir de 1h: 30–60 g de carboidrato por hora"]), obs);

function parseMin(s){ const m = s.match(/(\d+)'(\d+)?/); return m ? (+m[1] + (m[2] ? +m[2]/60 : 0)) : 1; }
const corridaRW = (n, t, c) => R(`Trote/caminhada ${n}×(${t}/${c})`,
  P([5,1], reps(n,[parseMin(t),2],[parseMin(c),1])),
  ["5' caminhando rápido", `${n}× (${t} trote bem leve + ${c} caminhada)`, "Critério: conversar o tempo todo. Se não der, caminha mais"]);

const brick = (min) => R(`Transição ${min}'`, P([min,2]),
  ["Logo que descer da bike: troca o tênis e sai trotando", `${min}' em Z2 leve, passada curta`, "A perna vai estranhar nos primeiros minutos; é exatamente o estímulo"],
  "3ª corrida da semana. Pouca duração, muito aprendizado (é o que o pessoal do triathlon chama de brick).");

const SEM = [
 { bloco:1, foco:"Volta e base",
   nota:"Semana de volta depois do ralado: teto de intensidade em Z3 e nada de saltos até cicatrizar. Seg 12/10 é feriado, dá pra fazer a corrida com calma.",
   ter: B("Tempo controlado 3×8'", P([15,2], reps(3,[8,3],[3,1]), [12,2], [8,1]),
     ["15' aquecendo Z1 → Z2","3× 8' em Z3 alto (145–155 bpm), 3' Z1 entre","12' Z2 com 6× 10\" de giro rápido (110+ rpm, sem força)","8' soltando Z1"]),
   sex: B("Z2 contínuo 60'", P([10,1],[45,2],[5,1]),
     ["10' Z1","45' em Z2 (118–137). Na subida: marcha leve, aceita ir devagar","5' Z1"]),
   sab: longo("2h Z2", P([15,1],[100,2],[5,1]), ["1h45 em Z2","Pode parar pro café; não acelera pra acompanhar o grupo"]),
   r1: corridaRW(8,"1'","2'"), r2: corridaRW(8,"1'","2'") },

 { bloco:1, foco:"Teste e base",
   nota:"Terça é o teste de subida. Ele define se o plano está no nível certo e vira tua régua pra semana 12.",
   ter: testeSubida(false),
   sex: B("Z2 + sprints 6×10\"", P([10,1],[20,2], reps(6,[SPR,5],[3,1]), [10,2],[5,1]),
     ["10' Z1, 20' Z2","6× 10\" sprint sentado, forte de verdade; 3' bem leve entre","10' Z2, 5' Z1"],
     "Sprint curto treina o recrutamento das fibras rápidas sem gerar cansaço: pode fazer com a FC ainda baixa."),
   sab: longo("2h15 Z2", P([15,1],[115,2],[5,1]), ["2h em Z2"]),
   r1: corridaRW(8,"1'30","1'30"), r2: corridaRW(8,"1'30","1'30") },

 { bloco:1, foco:"Limiar curto",
   nota:"Primeiro intervalado em Z4. Os primeiros 1–2 minutos de cada tiro a FC ainda está subindo: começa pela sensação, não pelo número.",
   ter: B("Limiar 4×6'", P([15,2], reps(4,[6,4],[3,1]), [12,1]),
     ["15' aquecendo Z1 → Z2","4× 6' em Z4 (160–172 bpm), 3' Z1 entre","12' soltando"]),
   sex: B("Z2 + sprints 6×10\"", P([10,1],[25,2], reps(6,[SPR,5],[3,1]), [10,2],[5,1]),
     ["10' Z1, 25' Z2","6× 10\" sprint sentado; 3' leve entre","10' Z2, 5' Z1"]),
   sab: longo("2h30 Z2", P([15,1],[130,2],[5,1]), ["2h15 em Z2"]),
   r1: corridaRW(8,"2'","1'"), r2: corridaRW(8,"2'","1'") },

 { bloco:1, foco:"Descarga", deload:true,
   nota:"Descarga: mesmos dias, menos volume. Academia com metade das séries e a mesma carga. Seg 02/11 é Finados.",
   ter: B("Limiar curto 3×5'", P([15,2], reps(3,[5,4],[3,1]), [15,2],[6,1]),
     ["15' aquecendo","3× 5' em Z4, 3' Z1 entre","15' Z2, 6' Z1"]),
   sex: B("Z2 solto 50'", P([10,1],[35,2],[5,1]), ["50' entre Z1 e Z2, sem olhar velocidade"]),
   sab: longo("1h45 leve", P([15,1],[85,2],[5,1]), ["1h30 em Z2 baixo"]),
   r1: corridaRW(6,"2'","1'"), r2: corridaRW(6,"2'","1'") },

 { bloco:2, foco:"Limiar + força",
   nota:"Começa o bloco de força: academia pesada (4–6 repetições). Na quinta entra a força-resistência, que é musculação em cima da bike.",
   ter: B("Limiar 3×10'", P([15,2], reps(3,[10,4],[4,1]), [8,1]),
     ["15' aquecendo","3× 10' em Z4 (160–172), 4' Z1 entre","8' soltando"]),
   sex: B("Força-resistência 4×5'", P([10,1],[10,2], reps(4,[5,3],[5,2]), [5,1]),
     ["10' Z1, 10' Z2","4× 5' em subida, marcha pesada, 55–65 rpm, sentado, tronco parado","5' Z2 entre","5' Z1"],
     "A perna faz força e o coração fica no máximo em Z3. Se passar de 156, alivia a marcha."),
   sab: longo("2h30 + final Z3", P([15,1],[105,2],[20,3],[10,1]), ["1h45 em Z2","20' em Z3 controlado (138–150)","10' Z1"]),
   r1: corridaRW(5,"4'","1'"), r2: corridaRW(5,"4'","1'") },

 { bloco:2, foco:"Limiar + força",
   nota:"Corrida com blocos de 7'. Se a canela ou o joelho reclamarem, repete a semana 5 na corrida.",
   ter: B("Limiar 3×12'", P([15,2], reps(3,[12,4],[4,1]), [7,1]),
     ["15' aquecendo","3× 12' em Z4, 4' Z1 entre","7' soltando"]),
   sex: B("Força-resistência 5×5'", P([10,1],[5,2], reps(5,[5,3],[5,2]), [5,1]),
     ["10' Z1, 5' Z2","5× 5' em subida, 55–65 rpm, sentado; 5' Z2 entre","5' Z1"]),
   sab: longo("2h45 + 2×15' Z3", P([15,1],[75,2],[15,3],[10,2],[15,3],[25,2],[10,1]),
     ["1h15 em Z2","2× 15' em Z3 (138–150), 10' Z2 entre","25' Z2, 10' Z1"]),
   r1: corridaRW(3,"7'","1'"), r2: corridaRW(3,"7'","1'") },

 { bloco:2, foco:"Limiar longo + 3ª corrida",
   nota:"Semana-chave do bloco: 2×20' de limiar. Entra a 3ª corrida (transição logo depois do longo). Segunda é a referência de corrida: anota a distância.",
   ter: B("Limiar 2×20'", P([15,2],[20,4],[5,1],[20,4],[8,1]),
     ["15' aquecendo","2× 20' em Z4 baixo (157–166), 5' Z1 entre","8' soltando"],
     "Tiro longo: ritmo constante. Melhor terminar o 2º tiro forte do que estourar no 1º."),
   sex: B("Z2 + sprints em pé 6×12\"", P([10,1],[20,2], reps(6,[SPR12,5],[3,1]), [20,2],[5,1]),
     ["10' Z1, 20' Z2","6× 12\" sprint em pé, marcha média; 3' leve entre","20' Z2, 5' Z1"]),
   sab: longo("3h + 2×15' Z3", P([15,1],[90,2],[15,3],[10,2],[15,3],[25,2],[10,1]),
     ["1h30 em Z2","2× 15' em Z3, 10' Z2 entre","25' Z2, 10' Z1"]),
   r1: R("Referência: 20' contínuo", P([5,1],[20,2],[5,1]),
     ["5' caminhando","20' trote contínuo em Z2 (conversa fluida)","Anota distância e FC média: vai comparar na semana 12","5' caminhando"]),
   r2: R("20' leve + 4 acelerações", P([5,1],[20,2], reps(4,[0.25,3],[1,1]), [3,1]),
     ["5' caminhando, 20' trote Z2","4× 15\" acelerando progressivo (sem sprint), 1' caminhando entre","3' caminhando"]),
   r3: brick(10) },

 { bloco:2, foco:"Descarga", deload:true,
   nota:"Descarga. Academia: carga mantida, metade das séries. Sem corrida de transição esta semana.",
   ter: B("Z2 + 4×1' Z4", P([15,2],[30,2], reps(4,[1,4],[1,1]), [8,1]),
     ["45' Z2","4× 1' em Z4, 1' leve entre","8' Z1"],"Só pra lembrar o corpo do ritmo, sem cansar."),
   sex: B("Z2 60'", P([10,1],[45,2],[5,1]), ["60' entre Z1 e Z2"]),
   sab: longo("2h Z2", P([15,1],[100,2],[5,1]), ["1h45 em Z2"]),
   r1: R("Trote 20' contínuo", P([5,1],[20,2]), ["5' caminhando","20' Z2"]),
   r2: R("Trote 20' contínuo", P([5,1],[20,2]), ["5' caminhando","20' Z2"]) },

 { bloco:3, foco:"VO2máx",
   nota:"Bloco de potência: tiros curtos e muito fortes. A FC só chega em Z5 no fim de cada tiro de 3'; guia pela sensação (RPE 9/10).",
   ter: B("VO2máx 5×3'", P([15,2], reps(5,[3,5],[3,1]), [12,2],[8,1]),
     ["15' aquecendo, com 2× 30\" fortes no fim","5× 3' em Z5 (só palavras soltas), 3' bem leve entre","12' Z2, 8' Z1"]),
   sex: B("Z2 + sprints 8×12\"", P([10,1],[20,2], reps(8,[SPR12,5],[3,1]), [10,2],[5,1]),
     ["10' Z1, 20' Z2","8× 12\" sprint (alterna sentado e em pé), 3' leve entre","10' Z2, 5' Z1"]),
   sab: longo("3h + 3×10' Z3 alto", P([15,1],[85,2], reps(3,[10,3],[10,2]), [10,2],[10,1]),
     ["1h25 em Z2","3× 10' em Z3 alto (148–156), 10' Z2 entre","10' Z2, 10' Z1"]),
   r1: R("Intervalado 6×1'", P([10,2], reps(6,[1,4],[2,1]), [5,1]),
     ["10' trote Z2","6× 1' forte (frases curtas), 2' caminhando entre","5' caminhando"]),
   r2: R("Trote 25' Z2", P([5,1],[25,2]), ["5' caminhando","25' trote Z2"]),
   r3: brick(15) },

 { bloco:3, foco:"VO2máx",
   nota:"Pico de carga do ciclo junto com a semana 11. Durma bem: é o treino invisível.",
   ter: B("VO2máx 6×3'", P([15,2], reps(6,[3,5],[3,1]), [10,1]),
     ["15' aquecendo, com 2× 30\" fortes","6× 3' em Z5, 3' bem leve entre","10' Z1"]),
   sex: B("Força-resistência + sprints", P([10,1], reps(4,[5,3],[4,2]), [5,2], reps(4,[SPR,5],[2,1]), [5,1]),
     ["10' Z1","4× 5' em subida 55–65 rpm, 4' Z2 entre","5' Z2","4× 10\" sprint, 2' leve entre","5' Z1"]),
   sab: longo("3h15 + 20' Z3", P([15,1],[110,2],[20,3],[40,2],[10,1]),
     ["1h50 em Z2","20' Z3 (138–150)","40' Z2, 10' Z1"]),
   r1: R("Intervalado 6×2'", P([10,2], reps(6,[2,4],[2,1]), [5,1]),
     ["10' trote Z2","6× 2' forte, 2' caminhando entre","5' caminhando"]),
   r2: R("Trote 30' Z2", P([5,1],[30,2]), ["5' caminhando","30' trote Z2"]),
   r3: brick(15) },

 { bloco:3, foco:"30/30 e volume",
   nota:"Semana de Natal: o pedal de quinta (24/12, véspera) é opcional. Se for perder um treino, que seja ele.",
   ter: B("30/30 2 séries de 8", P([15,2], reps(8,[0.5,5],[0.5,1]), [5,1], reps(8,[0.5,5],[0.5,1]), [15,2],[8,1]),
     ["15' aquecendo","8× (30\" muito forte + 30\" leve)","5' Z1","Repete as 8×","15' Z2, 8' Z1"]),
   sex: B("Natal: Z2 opcional", P([10,1],[45,2],[5,1]), ["60' em Z2 se der vontade. Senão, folga."]),
   sab: longo("3h30 Z2", P([15,1],[185,2],[10,1]), ["3h05 em Z2","O mais longo do ciclo: capricha na comida"]),
   r1: R("Tempo 4×4'", P([10,2], reps(4,[4,3],[2,1]), [5,1]),
     ["10' trote Z2","4× 4' em ritmo firme (Z3, frases curtas), 2' caminhando entre","5' caminhando"]),
   r2: R("Trote 30' Z2", P([5,1],[30,2]), ["5' caminhando","30' trote Z2"]),
   r3: brick(15) },

 { bloco:3, foco:"Reteste e descarga", deload:true,
   nota:"Hora de medir: reteste de subida na terça e 20' de corrida na segunda. Compara com as semanas 2 e 7. O pedal de quinta cai no Réveillon (31/12): opcional.",
   ter: testeSubida(true),
   sex: B("Ano Novo: Z2 opcional", P([10,1],[45,2],[5,1]), ["60' leve, se quiser"]),
   sab: longo("2h Z2", P([15,1],[100,2],[5,1]), ["1h45 em Z2, sem pressa"]),
   r1: R("Reteste: 20' contínuo", P([5,1],[20,2],[5,1]),
     ["5' caminhando","20' trote em Z2, mesma FC da semana 7","Anota a distância: mais longe com a mesma FC = evoluiu","5' caminhando"]),
   r2: R("Trote 25' leve", P([5,1],[25,2]), ["5' caminhando","25' trote Z2"]) },
];

/* pedal Z2 de sábado (desde 08/10/2026): minutos de Z2 por semana, o treino tem +15 (10' Z1 + 5' soltando).
   Véspera do longo: Z2 de verdade, sem tiro. Mesma conta do plano_treino.py que vai pro Garmin. */
const SAB_Z2 = [45,45,60,30,60,75,75,45,75,75,60,45];
SEM.forEach((w,i)=>{ const z = SAB_Z2[i];
  w.sz2 = B(`Z2 de sábado ${z+15}'`, P([10,1],[z,2],[5,1]),
    ["10' Z1", `${z}' em Z2${w.deload?" baixo":""}, sem tiro. Na subida: marcha leve`, "5' Z1"],
    "Véspera do longo: Z2 de verdade. Cansado? Corta pra 45'. Se for perder um pedal na semana, é este."); });

/* ---------- academia ---------- */
const GYM_META = {
  A:{nome:"Inferiores · Força", dur:"~55 min", quando:"Terça à noite (12 h depois do pedal)"},
  B:{nome:"Superiores · Empurrar e puxar", dur:"~50 min", quando:"Segunda"},
  C:{nome:"Inferiores · Potência", dur:"~45 min", quando:"Quinta"},
  D:{nome:"Superiores 2 + core", dur:"~45 min", quando:"Quarta (dia sem corrida)"},
  E:{nome:"Mobilidade + core (opcional)", dur:"~25 min", quando:"Sexta, depois da corrida (se quiser)"}
};
const E_FIXO = [
  ["Quadril 90/90 (troca de lado)","2×6","—","Devagar, tronco alto"],
  ["Abertura torácica deitado de lado","2×8/lado","—","Ajuda a postura na bike"],
  ["Alongamento do flexor do quadril (meio ajoelhado)","2×45\"/lado","—","Glúteo contraído"],
  ["Gato-camelo","1×10","—",""],
  ["Prancha frontal","3×40\"","30\"",""],
  ["Ponte de glúteo","2×15","30\"",""],
  ["Panturrilha excêntrica no degrau","2×12","45\"","Desce em 3 s. Protege o Aquiles pra corrida"]
];
const GYM = {
 1:{ nota:"Bloco 1, adaptação: carga em que sobram 3–4 repetições (RPE 6–7), foco na técnica, 60–90\" de descanso. Semana 1: sem saltos no treino C até o ralado cicatrizar (troca por step-up). Semana 4: metade das séries.",
   A:[["Agachamento goblet","3×12","90\"","Desce até coxa paralela"],["Leg press","3×12","90\""],["Levantamento terra romeno (halteres)","3×10","90\"","Coluna neutra, quadril vai pra trás"],["Afundo búlgaro","2×10/perna","60\""],["Panturrilha em pé","3×15","45\""],["Prancha frontal","3×40\"","45\""]],
   B:[["Supino com halteres","3×12","90\""],["Remada curvada com halteres","3×12","90\""],["Desenvolvimento com halteres sentado","3×10","60\""],["Puxada frente","3×12","60\""],["Face pull (cabo)","3×15","45\"","Ombro saudável pra posição na bike"],["Dead bug","3×10/lado","45\""]],
   C:[["Salto na caixa baixa (sobe saltando, desce caminhando)","3×5","90\"","Aterrissa macio"],["Kettlebell swing","3×12","60\"","Força vem do quadril, não do braço"],["Step-up no banco","3×10/perna","60\""],["Ponte de glúteo unilateral","3×10/perna","45\""],["Prancha Copenhagen (adutor)","2×20\"/lado","45\""],["Panturrilha sentado","3×15","45\""]],
   D:[["Remada unilateral com halter","3×12/lado","60\""],["Flexão de braço","3× (máx − 2)","60\""],["Rotação externa com elástico","2×15","30\""],["Farmer walk (caminhada com halteres)","3×30 m","60\""],["Pallof press","3×10/lado","45\"","Anti-rotação: estabilidade no sprint"],["Bird dog","3×8/lado","30\""]],
   E:E_FIXO },
 2:{ nota:"Bloco 2, força: carga pesada com 2 repetições sobrando (RPE 8), descanso de 2–3'. Sobe a carga quando completar todas as séries com folga. Semana 8: mesma carga, metade das séries.",
   A:[["Agachamento livre (ou Smith)","4×5","3'","Exercício principal: capricha"],["Levantamento terra romeno (barra)","4×6","2'30"],["Afundo búlgaro com halteres","3×6/perna","2'"],["Elevação pélvica (hip thrust)","3×8","2'"],["Panturrilha unilateral","3×10","60\""],["Pallof press","3×10/lado","45\""]],
   B:[["Supino reto (barra)","4×6","2'30"],["Remada curvada (barra)","4×6","2'30"],["Desenvolvimento","3×6","2'"],["Barra fixa (assistida se precisar)","4×5","2'"],["Face pull","3×12","45\""],["Prancha lateral","3×30\"/lado","45\""]],
   C:[["Salto na caixa (altura média)","4×4","2'","Qualidade, não altura"],["Salto horizontal parado","3×4","2'"],["Kettlebell swing pesado","4×10","90\""],["Step-up com halteres","3×6/perna","90\""],["Nordic curl (só a descida)","3×4","2'","Posterior de coxa: protege na corrida"],["Prancha Copenhagen","3×25\"/lado","45\""]],
   D:[["Barra fixa ou puxada","3×8","90\""],["Paralelas ou flexão com carga","3×8","90\""],["Remada invertida","3×10","60\""],["Farmer walk pesado","4×30 m","90\""],["Suitcase carry (um braço só)","3×20 m/lado","60\""],["Roda abdominal","3×8","60\""]],
   E:E_FIXO },
 3:{ nota:"Bloco 3, potência: carga moderada e velocidade máxima em cada repetição, descanso completo (2–3'). Contraste = série pesada e, logo depois, o salto: o músculo \"acordado\" pela carga salta mais. Semana 12: 2 séries de cada.",
   A:[["Agachamento + salto vertical (contraste)","3×3 + 3×5","3'","3 reps pesadas (RPE 8), 30\" depois 5 saltos máximos"],["Agachamento com salto (halteres leves)","4×4","2'","~20–30% da carga do agachamento"],["Levantamento terra romeno","3×5","2'"],["Step-up explosivo","3×5/perna","90\"","Sobe rápido, desce controlado"],["Pogo (saltitos de tornozelo)","3×20\"","60\""],["Roda abdominal","3×8","60\""]],
   B:[["Supino + arremesso de medicine ball no peito (contraste)","3×4 + 3×5","2'30"],["Remada curvada explosiva","4×5","2'","Puxa rápido, desce em 2 s"],["Push press","4×4","2'"],["Barra fixa","3×5","2'"],["Face pull","2×15","45\""],["Medicine ball slam","3×6","60\""]],
   C:[["Salto em profundidade (cai de 30 cm e salta)","3×4","2'","Contato com o chão o mais curto possível"],["Salto unilateral na caixa baixa","3×3/perna","90\""],["Saltos alternados à frente (bounding)","3×6","2'"],["Salto com trap bar (carga leve)","4×3","2'"],["Kettlebell swing explosivo","3×8","90\""],["Nordic curl","2×5","2'"]],
   D:[["Arremesso rotacional de medicine ball na parede","4×5/lado","60\""],["Flexão pliométrica (mãos saem do chão)","3×5","90\""],["Remada unilateral","3×6/lado","90\""],["Farmer walk","3×30 m","60\""],["Hollow hold","3×25\"","45\""]],
   E:E_FIXO }
};

return {START, FERIADOS, BLOCOS, SEM, GYM, GYM_META};
})();


/* ================= GRADE ESTUDO E TREINO ================= */
window.GRADE = (function(){
"use strict";
const CAT = {
  foco:{nome:"Estudo · TCC (Foco)", cls:"c-foco"},
  estudo:{nome:"Estudo · disciplinas", cls:"c-estudo"},
  leve:{nome:"Tarefas leves", cls:"c-leve"},
  trab:{nome:"Trabalho", cls:"c-trab"},
  treino:{nome:"Treino", cls:"c-treino"},
  plano:{nome:"Revisão e planejamento", cls:"c-plano"},
  rotina:{nome:"Refeições e rotina", cls:"c-rotina"},
  livre:{nome:"Livre", cls:"c-livre"},
  sono:{nome:"Sono", cls:"c-sono"}
};
const ORDEM = ["foco","estudo","leve","trab","treino","plano","rotina","livre","sono"];

const T = s => { const [h,m] = s.split(":"); return +h*60 + +m; };
/* bloco: [início, fim, categoria, título, nota, opcional] */
const b = (i,f,k,t,n,opt) => ({i:typeof i==="number"?i:T(i), f:typeof f==="number"?f:T(f), k, t, n:n||"", opt:!!opt});

/* pedal sempre 05h15 (acorda 4h30): ter e qui aqui; sáb (Z2) e dom (longo) no sabado() e domingo().
   Corrida (seg e sex) e academia à noite. */
const PEDAL = {1:["Pedal intervalado","Dia duro. Inclui ida e volta"], 3:["Pedal Z2 + sprints","Z2 de verdade, tiros curtos. Inclui ida e volta"]};
/* treino da noite de seg–sex: [duração em min, nome, nota] */
const NOITE = [
  [90,"Corrida 1 + Academia B","Corrida principal e superiores"],
  [60,"Academia A · perna força","12 h depois do intervalado da manhã"],
  [60,"Academia D · superiores + core","Sem corrida hoje: só a academia"],
  [60,"Academia C · potência","Pouco volume, saltos rápidos. 12 h depois do pedal da manhã"],
  [60,"Corrida 2 + mobilidade","Corrida leve; a mobilidade (academia E) é opcional. Amanhã tem pedal às 05h15"]
];
/* véspera de pedal (seg, qua, sex; sábado fica no sabado()): deita cedo pra acordar 4h30 */
const VESPERA = {0:true, 2:true, 4:true};

function noite(fim, deitar){
  const jantar = Math.min(fim+60, deitar-30), o = [
    b(fim, jantar, "rotina", "Banho e jantar", "Proteína e carboidrato: é a recuperação do treino")];
  if (deitar-30 > jantar) o.push(b(jantar, deitar-30, "livre", "Livre", "Série, amigos, família. Estudo pesado aqui atrapalha o sono"));
  o.push(b(deitar-30, deitar, "rotina", "Desacelerar", "Sem tela, luz baixa"), b(deitar, 1440, "sono", "Sono"));
  return o;
}

function manha(d, focoIni){
  if (PEDAL[d]) return [
    b("00:00","04:30","sono","Sono"),
    b("04:30","05:15","rotina","Acordar e café leve","Banana, pão. Água"),
    b("05:15","07:00","treino",PEDAL[d][0],PEDAL[d][1]),
    b("07:00",focoIni,"rotina","Banho e café da manhã","O café da manhã de verdade vem depois do pedal")
  ];
  return [
    b("00:00","06:00","sono","Sono"),
    b("06:00","06:45","rotina","Acordar e café","Sem celular na primeira meia hora"),
    b("06:45",focoIni,"leve","Leitura leve · artigos do TCC","No dia de pedal esse horário é a bike")
  ];
}

function diaUtil(modo, d){
  const sexta = d === 4, tr = NOITE[d];
  const deitar = VESPERA[d] ? (modo==="B" && d===0 ? T("21:30") : T("21:00")) : T("22:00");
  const almoco = PEDAL[d] ? "Cochilo de 20 min depois do almoço: hoje acordou 4h30" : "";
  let o, iniNoite;
  if (modo === "A"){
    const tarde = sexta
      ? [b("13:30","15:30","estudo","Bloco da tarde · disciplinas","Matérias, listas, leituras do curso"),
         b("15:30","16:30","plano","Revisão da semana","Entrada no diário do TCC: o que andou, o que travou")]
      : [b("13:30","16:30","estudo","Bloco da tarde · disciplinas","Matérias, listas, leituras do curso. Vira trabalho quando aparecer")];
    o = manha(d,"08:00").concat([
      b("08:00","10:00","foco","Foco 1 · TCC","A tarefa mais difícil: escrever, modelar, interpretar"),
      b("10:00","10:20","rotina","Pausa"),
      b("10:20","12:00","foco","Foco 2 · TCC","Dados, código, leitura de artigos"),
      b("12:00","13:30","rotina","Almoço e descanso",almoco),
      ...tarde]);
    if (tr){
      o.push(b("16:30","17:00","leve","Tarefas leves","E-mails, organização, revisar o dia"),
             b("17:00","18:00","rotina","Lanche e deslocamento","Lanche com carboidrato 1 h antes do treino"));
      iniNoite = T("18:00");
    } else {
      o.push(b("16:30","19:00","livre","Livre","Sem treino à noite"));
      return o.concat(noite(T("19:00"), deitar));
    }
  } else {
    o = manha(d,"07:30").concat([
      b("07:30","09:30","foco","Foco 1 · TCC","A tarefa mais difícil: escrever, modelar, interpretar"),
      b("09:30","09:45","rotina","Pausa"),
      b("09:45","11:15","foco", sexta ? "Foco 2 · TCC + diário" : "Foco 2 · TCC", sexta ? "Últimos 20 minutos: revisão da semana no diário" : "Dados, código, leitura de artigos"),
      b("11:15","12:00","rotina","Almoço e deslocamento"),
      b("12:00","18:00","trab","Trabalho / estágio","6 h. Disciplinas passam pro fim de semana")]);
    if (tr){
      o.push(b("18:00","18:45","rotina","Deslocamento e lanche","Lanche no caminho pro treino"));
      iniNoite = T("18:45");
    } else {
      o.push(b("18:00","19:00","livre","Volta pra casa","Sem treino à noite"));
      return o.concat(noite(T("19:00"), deitar));
    }
  }
  const nota = (modo==="B" && d===0) ? tr[2] + ". Se apertar o sono, encurta a academia B" : tr[2];
  o.push(b(iniNoite, iniNoite+tr[0], "treino", tr[1], nota));
  return o.concat(noite(iniNoite+tr[0], deitar));
}

/* sábado: pedal Z2 de manhã e véspera do longo (cama às 21h) */
function sabado(modo){
  const o = [
    b("00:00","04:30","sono","Sono"),
    b("04:30","05:15","rotina","Acordar e café leve","Banana, pão. Água"),
    b("05:15","07:30","treino","Pedal Z2","1h a 1h30 em Z2, sem tiro. Inclui ida e volta. Amanhã tem longo"),
    b("07:30","09:00","rotina","Banho e café da manhã")
  ];
  if (modo === "B") o.push(
    b("09:00","14:00","livre","Livre e almoço"),
    b("14:00","16:00","foco","Foco extra · TCC","Repõe parte das horas que o trabalho tirou da semana"),
    b("16:00","20:30","livre","Livre","Jantar com carboidrato, pouca fibra"));
  else o.push(b("09:00","20:30","livre","Livre","Descansa as pernas. Jantar com carboidrato, pouca fibra"));
  o.push(b("20:30","21:00","rotina","Desacelerar","Sem tela, luz baixa"), b("21:00",1440,"sono","Sono","Amanhã: longo às 05h15"));
  return o;
}

/* domingo: o longo */
function domingo(modo){
  return [
    b("00:00","04:30","sono","Sono"),
    b("04:30","05:15","rotina","Acordar e café pré-longo","Carboidrato: pão, tapioca, banana"),
    b("05:15","09:00","treino","Pedal longo","2h a 3h30 conforme a semana. Transição de corrida a partir da sem. 7"),
    b("09:00","10:30","rotina","Banho e café da manhã reforçado"),
    b("10:30","14:00","livre","Livre e almoço","Cochilo depois do almoço vale"),
    b("14:00","16:00","estudo","Reserva · pendências", modo==="B" ? "Disciplinas da semana. Se estiver em dia, é livre" : "Só se a semana atrasou. Senão, é livre",true),
    b("16:00","18:00","livre","Livre"),
    b("18:00","18:45","plano","Planejamento da semana", modo==="B" ? "Escolhe as 3 entregas do TCC, revisa disciplinas e confere os treinos" : "Escolhe as 3 entregas do TCC e confere os treinos"),
    b("18:45","21:30","livre","Livre e jantar"),
    b("21:30","22:00","rotina","Desacelerar","Sem tela, luz baixa"),
    b("22:00",1440,"sono","Sono")
  ];
}

const semana = modo => [0,1,2,3,4].map(d=>diaUtil(modo,d)).concat([sabado(modo), domingo(modo)]);

return {CAT, ORDEM, semana};
})();


/* ================= NUTRIÇÃO ================= */
/* Como a conta funciona (app.js, metasDoDia):
   gasto do dia = TMB × fator do dia a dia + o que os treinos daquele dia gastam (minutos por zona)
   meta = gasto − déficit do tipo de dia (+ ATUAL.ajuste)
   proteína e gordura fixas por kg; o carboidrato é o que sobra, então ele sobe e desce com o treino. */
window.NUTRI = (function(){
"use strict";
/* Base das contas: estimativa do Levy (out/26). Com um InBody novo, troca peso e pgc.
   ajuste: depois de 2 semanas pesando, soma ou tira kcal de todos os dias (ver "Como ajustar"). */
const ATUAL = {peso:75, pgc:20, fonte:"estimativa, out/26", ajuste:0};

/* histórico do InBody (gordura e massa magra em kg, calculadas de peso × %) */
const HIST = [
  {quando:"2022–24", peso:"70,5–75,2", pgc:"11–14%", gord:"8–10,5", magra:"62,5–64,7"},
  {quando:"ago/25",  peso:"74,8", pgc:"17,3%", gord:"12,9", magra:"61,9"}
];

const GASTO = {
  fator: 1.35,              // dia a dia sem treino: estudo sentado, algumas caminhadas
  bike: {1:4.5, 2:7, 3:9, 4:11, 5:12.5},   // kcal por minuto além do repouso, 75 kg
  run:  {1:3.5, 2:8.5, 3:10, 4:11.5, 5:13},// zona 1 da corrida = caminhada
  gym: 4,                   // musculação com descanso entre séries
  idaVolta: 20,             // minutos de Z1 indo e voltando do pedal de terça, quinta e sábado
  piso: 1800                // nunca abaixo disso, nem no dia mais leve
};

/* tipo de dia: pelo dia da semana dentro do plano. O déficit muda com o tipo;
   o tamanho do treino (e com ele o carboidrato) vem dos minutos daquela semana. */
const TIPOS = {
  leve:    {nome:"Dia leve", curto:"Leve", deficit:450, cls:"n-leve",
            nota:"Sem treino. É o dia de maior déficit: o carboidrato cai, a proteína fica igual."},
  moderado:{nome:"Dia moderado", curto:"Moderado", deficit:350, cls:"n-mod",
            nota:"Corrida + academia à noite. O lanche das 17h segura o treino; o jantar recupera."},
  duro:    {nome:"Dia duro", curto:"Duro", deficit:250, cls:"n-duro",
            nota:"Pedal de manhã e academia à noite. Dois treinos: carboidrato antes e depois de cada um."},
  vespera: {nome:"Véspera do longo", curto:"Véspera", deficit:150, cls:"n-vesp",
            nota:"Pedal Z2 de manhã e longo amanhã às 05h15. Quase sem déficit, com o carboidrato pesando no jantar."},
  longo:   {nome:"Dia do longo", curto:"Longo", deficit:150, cls:"n-longo",
            nota:"O carboidrato do pedal vem por fora da meta. Depois de chegar, recuperação de verdade."}
};
const DIA_TIPO = ["moderado","duro","moderado","duro","moderado","vespera","longo"]; // seg → dom (sáb = Z2 + véspera do longo)
const PROT = 2.0, GORD = 0.8;   // g por kg de peso

/* refeições: [hora, nome, o que comer, proteína g, parte do carboidrato do dia].
   "Na bike" tem parte 0: o carboidrato do pedal é calculado à parte. */
const REFEICOES = {
  duro: [
    ["04:30","Café leve","Pão branco ou tapioca com mel + banana. Pouca fibra e pouca gordura, pra não pesar no pedal.",0,0.10],
    ["Na bike","Durante o pedal","",0,0],
    ["07:00","Café da manhã de verdade","Ovos mexidos + pão ou tapioca + fruta + café com leite. É a recuperação do pedal.",35,0.25],
    ["10:00","Lanche","Iogurte natural ou skyr + aveia ou granola + fruta.",15,0.10],
    ["12:00","Almoço","Arroz e feijão, carne, frango ou peixe, salada e legume.",40,0.25],
    ["17:00","Lanche pré-treino","Sanduíche de pão com frango ou queijo + banana. 1 h antes da academia.",20,0.15],
    ["19:00","Jantar","Proteína + arroz, batata ou macarrão + legumes.",40,0.15]
  ],
  moderado: [
    ["06:00","Café da manhã","Ovos + pão ou tapioca + fruta + café com leite.",30,0.20],
    ["12:00","Almoço","Arroz e feijão, carne, frango ou peixe, salada e legume.",40,0.30],
    ["17:00","Lanche pré-treino","Pão com queijo ou pasta de amendoim + banana, 1 h antes do treino.",20,0.20],
    ["19:30","Jantar","Proteína + arroz, batata ou macarrão + legumes. Depois de corrida + academia, não pula.",45,0.25],
    ["20:30","Ceia","Iogurte, skyr ou um copo de leite. Proteína antes de dormir ajuda a recuperar o músculo.",15,0.05]
  ],
  leve: [
    ["07:00","Café da manhã","Ovos + pão ou tapioca + fruta + café.",35,0.25],
    ["12:00","Almoço","Metade do prato de salada e legume, proteína, arroz e feijão.",45,0.35],
    ["16:00","Lanche","Iogurte natural ou skyr + fruta.",25,0.15],
    ["19:30","Jantar","Proteína + legumes à vontade + o carboidrato que sobrou.",45,0.25]
  ],
  vespera: [
    ["04:30","Café leve","Pão branco ou tapioca com mel + banana.",0,0.10],
    ["Na bike","Durante o pedal","",0,0],
    ["07:30","Café da manhã","Ovos + pão ou tapioca + fruta + café com leite.",35,0.25],
    ["12:30","Almoço","Arroz e feijão, proteína, salada e legume.",45,0.25],
    ["16:00","Lanche","Iogurte + fruta + aveia.",25,0.10],
    ["19:00","Jantar","Macarrão ou arroz branco + frango ou peixe + pouco legume. Pouca fibra e pouca gordura: amanhã é o longo às 05h15.",45,0.30]
  ],
  longo: [
    ["04:30","Café pré-longo","Pão branco ou tapioca com mel + banana + água.",10,0.12],
    ["Na bike","Durante o longo","",0,0],
    ["09:00","Café reforçado","Ovos, pão, fruta, iogurte com granola. Até 1 h depois de chegar.",35,0.25],
    ["13:00","Almoço","Prato cheio: arroz, feijão, proteína, salada.",45,0.30],
    ["16:30","Lanche","Sanduíche, ou açaí com granola + iogurte.",20,0.13],
    ["20:00","Jantar","Proteína + carboidrato + legumes. É a recuperação do fim de semana.",40,0.20]
  ]
};
/* fora das 12 semanas não tem pedal de manhã: dia leve com o café às 7h */

/* carboidrato durante o pedal, em g por hora, pela duração da sessão */
const NA_BIKE = [[75,0],[120,45],[Infinity,70]]; // até 75' nada; até 2h 45 g/h; acima 70 g/h

/* trocas: quanto de cada alimento dá ~30 g de carboidrato ou ~25 g de proteína.
   Valores aproximados (tabela TACO e rótulos comuns). */
const TROCAS_CARB = [
  ["Arroz branco cozido","110 g · 4 colheres de sopa cheias"],
  ["Macarrão cozido","100 g · 1 pegador cheio"],
  ["Pão francês","1 unidade (50 g)"],
  ["Tapioca","3 colheres de sopa de goma (35 g)"],
  ["Batata ou aipim cozido","Batata: 160 g (1 grande) · aipim: 100 g"],
  ["Banana prata","2 pequenas (~120 g sem casca)"],
  ["Aveia","50 g · 5 colheres de sopa (+ 7 g de proteína)"],
  ["Feijão cozido","2 conchas (200 g) (+ 10 g de proteína)"],
  ["Mel","2 colheres de sopa (40 g)"]
];
const TROCAS_PROT = [
  ["Peito de frango grelhado","80 g"],
  ["Patinho ou alcatra grelhado","75 g"],
  ["Peixe branco grelhado","100 g"],
  ["Atum em lata (drenado)","1 lata (110 g)"],
  ["Ovos","4 unidades (+ 20 g de gordura: conta como gordura do dia)"],
  ["Skyr ou iogurte proteico","250 g"],
  ["Whey protein","1 dose (30 g)"],
  ["Queijo minas frescal","150 g (+ 25 g de gordura)"]
];

return {ATUAL, HIST, GASTO, TIPOS, DIA_TIPO, PROT, GORD, REFEICOES, NA_BIKE, TROCAS_CARB, TROCAS_PROT};
})();
