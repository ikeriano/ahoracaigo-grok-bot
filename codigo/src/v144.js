// ===================================================================================================
// v1.44 · NOVEDADES: 8 pruebas nuevas, 8 especiales nuevos, PREGUNTA ESPECIAL antes del Duelo Final en cada especial,
// cabeceras de la 1.38 (inicio 1-3 y Duelo Final) con versión temática para cada especial, Duelo Final clásico o largo,
// comodín del público, racha, ruleta del especial, salón de la fama, repetición de la caída y logros.
// Todo ligero (DOM + CSS, sin texturas nuevas) para que vaya fino en un Redmi A2.
// ===================================================================================================
const R144 = { prog: false, pubUsado: false, racha: 0, rachaMas: 0, peOk: null };
const op144 = (k, def = true) => { try { const v = localStorage.getItem(k); return v == null ? def : v === '1'; } catch (e) { return def; } };
const ls144 = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
const ss144 = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
const tecla144 = () => { try { F.play('Tecla'); } catch (e) { } };
function css144() { if (document.getElementById('css144')) return; const s = document.createElement('style'); s.id = 'css144'; s.textContent = `
.t144{position:fixed;left:50%;top:12%;transform:translateX(-50%);z-index:10050;background:linear-gradient(#1b52e6,#0b2fa8);color:#fff;border:2px solid #ffd23a;border-radius:14px;padding:8px 18px;font:800 clamp(13px,2.4vw,20px) Montserrat,system-ui,sans-serif;box-shadow:0 6px 18px #0008;pointer-events:none;transition:opacity .4s}
#m144{position:fixed;inset:0;z-index:10040;background:#000a;display:flex;align-items:center;justify-content:center;font-family:Montserrat,system-ui,sans-serif}
#m144 .c{width:min(92vw,720px);max-height:88vh;overflow:auto;background:linear-gradient(160deg,#0b2fa8,#06145a);border:3px solid #ffd23a;border-radius:18px;color:#fff;padding:14px 18px;box-shadow:0 10px 30px #000c}
#m144 h2{margin:0 0 8px;font-size:clamp(18px,3.4vw,28px);color:#ffd23a;text-align:center}
#m144 table{width:100%;border-collapse:collapse;font-size:clamp(12px,2.2vw,17px)}#m144 td{padding:4px 6px;border-bottom:1px solid #fff2}
#m144 .lg{display:flex;align-items:center;gap:10px;padding:6px 4px;border-bottom:1px solid #fff2;font-size:clamp(12px,2.2vw,17px)}#m144 .lg.no{opacity:.45;filter:grayscale(1)}#m144 .lg b{font-size:1.6em}
#m144 .bt{display:block;margin:12px auto 0;padding:8px 26px;border:2px solid #fff;border-radius:12px;background:#ffd23a;color:#06145a;font:900 clamp(14px,2.6vw,20px) Montserrat,system-ui}
#m144 .rul{font:900 clamp(26px,6vw,54px) Montserrat,system-ui;text-align:center;padding:22px 0;min-height:1.4em}
#pe144{position:fixed;inset:0;z-index:10030;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 40%,var(--a,#1b52e6) 0%,var(--b,#06145a) 75%);font-family:Montserrat,system-ui,sans-serif;color:#fff;overflow:hidden}
#pe144 .in{width:min(94vw,860px);text-align:center;position:relative;z-index:2}
#pe144 .tt{display:inline-block;padding:6px 22px;border-radius:30px;background:var(--c,#ffd23a);color:#06145a;font:900 clamp(15px,3vw,26px) Montserrat,system-ui;box-shadow:0 0 22px var(--c,#ffd23a)}
#pe144 .es{margin:8px 0 4px;font:800 clamp(13px,2.4vw,20px) Montserrat,system-ui;opacity:.92}
#pe144 .q{margin:14px 0 16px;font:800 clamp(17px,3.6vw,32px) Montserrat,system-ui;text-shadow:0 3px 8px #000a}
#pe144 .ops{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
#pe144 .op{flex:1 1 28%;max-width:32%;min-width:150px;padding:12px 6px;border:3px solid #fff;border-radius:10px;background:linear-gradient(#3b8cff,#0b3fc4);color:#fff;font:900 clamp(13px,2.4vw,20px) Montserrat,system-ui;transform:skewX(-8deg)}
#pe144 .op.v{background:linear-gradient(#8ef03a,#2f9a0c)}#pe144 .op.r{background:linear-gradient(#ff5a4a,#b00d0d)}
#pe144 .rl{margin-top:14px;font:900 clamp(20px,4vw,34px) Montserrat,system-ui;color:var(--c,#ffd23a)}
#pe144 .fx,.th144 .fx{position:absolute;font-size:clamp(20px,5vw,46px);animation:sube144 linear infinite;opacity:.8;pointer-events:none}
@keyframes sube144{from{transform:translateY(110vh) rotate(0)}to{transform:translateY(-20vh) rotate(360deg)}}
#pub144{position:fixed;right:1.5vw;top:40%;z-index:70;padding:10px 12px;border:3px solid #fff;border-radius:50%;background:radial-gradient(#ffd23a,#e08a00);font:900 clamp(18px,3vw,28px) system-ui;box-shadow:0 0 16px #ffd23a;display:none}
#pubb144{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:71;width:min(80vw,520px);background:#06145aee;border:3px solid #ffd23a;border-radius:16px;padding:10px 16px;color:#fff;font:800 clamp(12px,2.2vw,18px) Montserrat,system-ui}
#pubb144 .r{display:flex;align-items:center;gap:8px;margin:5px 0}#pubb144 .r span{width:34%;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#pubb144 .r i{display:block;height:18px;background:linear-gradient(90deg,#ffd23a,#ff8a1a);border-radius:9px;transition:width 1.2s}
#rep144{position:fixed;inset:0;z-index:39;pointer-events:none;box-shadow:inset 0 9vh 0 #000,inset 0 -9vh 0 #000}
#rep144 b{position:absolute;left:3vw;top:1.6vh;color:#fff;font:900 clamp(15px,3vw,26px) Montserrat,system-ui;letter-spacing:.06em}#rep144 b i{color:#ff3a3a;font-style:normal;animation:parp144 1s infinite}
#rep144 small{position:absolute;right:3vw;bottom:2.2vh;color:#fffa;font:700 clamp(11px,1.8vw,15px) Montserrat,system-ui}
@keyframes parp144{50%{opacity:.2}}
.th144{position:fixed;inset:0;z-index:58;pointer-events:none;overflow:hidden}
.th144 .tinte{position:absolute;inset:0;mix-blend-mode:soft-light;opacity:.55}
.th144 .vin{position:absolute;inset:0;box-shadow:inset 0 0 12vh var(--c)}
.th144 .ban{position:absolute;left:50%;bottom:6vh;transform:translateX(-50%);padding:.6vh 3vw;border-radius:4vh;background:linear-gradient(90deg,var(--a),var(--b));border:.4vh solid var(--c);color:#fff;font:900 clamp(15px,3.4vw,32px) Montserrat,system-ui;letter-spacing:.05em;white-space:nowrap;text-shadow:0 .3vh .6vh #000a;box-shadow:0 0 3vh var(--c);animation:ban144 .6s ease-out both}
.th144.df .ban{bottom:auto;top:5vh}
@keyframes ban144{from{transform:translateX(-50%) scale(.3);opacity:0}to{transform:translateX(-50%) scale(1);opacity:1}}
.th144 .marco{position:absolute;left:50%;top:50%;width:44vmin;height:44vmin;transform:translate(-50%,-50%);border-radius:50%;animation:gira144 9s linear infinite}
.th144 .marco span{position:absolute;left:50%;top:50%;font-size:clamp(18px,4.4vmin,40px)}
@keyframes gira144{to{transform:translate(-50%,-50%) rotate(360deg)}}
`; document.head.appendChild(s); }
function toast144(txt, ms = 2600) { css144(); const d = document.createElement('div'); d.className = 't144'; d.textContent = txt; document.body.appendChild(d); setTimeout(() => d.style.opacity = '0', ms); setTimeout(() => d.remove(), ms + 500); }
function modal144(titulo, html, extra) { css144(); document.getElementById('m144')?.remove(); const m = document.createElement('div'); m.id = 'm144'; m.innerHTML = `<div class="c"><h2>${titulo}</h2><div class="b">${html}</div><button class="bt">Cerrar</button></div>`; m.querySelector('.bt').onclick = ev => { ev.stopPropagation(); tecla144(); m.remove(); }; m.onclick = ev => { if (ev.target === m) m.remove(); }; m.addEventListener('pointerdown', ev => ev.stopPropagation()); document.body.appendChild(m); extra && extra(m); return m; }
const tema144 = id => Do.find(d => d.id === id) || null;
const esc144 = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------------- (1) 8 PRUEBAS NUEVAS ----------------
const P144 = Object.keys(V144.titulos);
Object.assign(V128.titulos, V144.titulos); Object.assign(V128.dichos, V144.dichos); Object.assign(V131.desc, V144.desc);
const lista144 = k => V144[k].map(([q, o, c]) => ({ q, o: o.slice(), c: c ? V144.titulos[k] + ' · ' + c : V144.titulos[k] }));
function e2Reloj(lista, seg) { const f = e2Con(lista); return async (a, e, t = {}) => { const W = Ke, b = W.__e3Clock; if (seg && !b) W.__e3Clock = seg; try { return await f(a, e, t); } finally { W.__e3Clock = b; } }; }
{ const add = {}; for (const k of P144) add[k] = { ar: true, titulo: V144.titulos[k], lista: true, dicho: V144.dichos[k], jugar: e2Reloj(lista144(k), k === 'relojloco' ? 3 : 0) };
  Object.assign(cu, add); AR_IDS.push(...P144); P128.push(...P144); cmdEnvuelve(); }

// ---------------- (2) 8 ESPECIALES NUEVOS ----------------
for (const t of ESP144) {
  const { logo, cab, fx, ...th } = t; th.fx144 = fx;
  if (!Do.find(d => d.id === th.id)) Do.push(th);
  Eo[th.id] = logo;
  CAB_TEMAS[th.id] = { obj: cab.obj, wall: th.wallA, wall2: th.wallB, chev: th.chevA, ring: th.glow, tunel: cab.tunel, f2d: [th.wallA, th.wallB, th.chevA], ex: th.banner };
  Pv[th.id] = PV144[th.id];
}
// emojis de ambiente de los especiales que ya existían (para las cabeceras temáticas y la pregunta especial)
const FX144 = { halloween: ['🎃', '🦇', '👻', '🕸️'], navidad: ['🎄', '🎁', '❄️', '⭐'], nochebuena: ['⭐', '🕯️', '❄️', '🎁'], findeano: ['🥂', '🍇', '🎆', '🕛'], carnaval: ['🎭', '🎉', '🪅', '🎊'], verano: ['☀️', '🏖️', '🍉', '🌊'], ninos: ['🎈', '🧸', '🍭', '⭐'], especial300: ['🎉', '3️⃣', '⭐', '🏆'], primetime: ['🌟', '🎬', '✨', '🏆'], mayores: ['👵', '🎄', '🍬', '❤️'], profesiones: ['👷', '👩‍⚕️', '👨‍🍳', '🧑‍🚒'], sanvalentin: ['💘', '❤️', '🌹', '💌'], famosos: ['🌟', '🎬', '📸', '✨'], abuelos: ['👴', '👵', '🎂', '❤️'], fantasticos: ['⚽', '🏆', '🥅', '⭐'], mil: ['🎉', '🏆', '💯', '✨'], sub400ikeriano: ['🎉', '▶️', '🏆', '⭐'], sub400marchelitos: ['🎉', '▶️', '🏆', '⭐'], aniversario: ['🎂', '🎉', '🎈', '⭐'], youtube: ['▶️', '👍', '🔔', '❤️'], eligehuella: ['👣', '💰', '⭐', '🏆'], argentina: ['🇦🇷', '🧉', '⚽', '⭐'] };
const fxDe144 = id => (tema144(id) && tema144(id).fx144) || FX144[id] || ['⭐', '✨'];
const PE_TEMA144 = { nochevieja2020: { name: 'Nochevieja · Lo mejor del 2020', wallA: '#3a3326', wallB: '#080808', chevA: '#ffe08a', fx: ['🥂', '🍇', '🎆'] }, eugeni2021: { name: 'Con Eugeni Alemany', wallA: '#0b2fa8', wallB: '#06145a', chevA: '#ffd23a', fx: ['🎙️', '⭐'] }, a3_30anos: { name: 'Especial 30 años de Antena 3', wallA: '#2a1d00', wallB: '#080808', chevA: '#ffd23a', fx: ['🎂', '3️⃣', '0️⃣'] }, tcms2020: { name: 'Especial Tu cara me suena', wallA: '#4b0f8a', wallB: '#12041f', chevA: '#ff4fd8', fx: ['🎤', '🎶', '⭐'] }, ninos2019: { name: 'Especial niños', wallA: '#0f8fd1', wallB: '#063a6a', chevA: '#ff5fb0', fx: ['🎈', '🧸', '⭐'] } };

// ---------------- (3) PREGUNTA ESPECIAL ----------------
// Se hace justo antes del Duelo Final en todos los especiales. Si aciertas: +10 segundos en el Duelo Final.
async function pe144(id, op = {}) {
  const P = V144.pe[id]; if (!P || !op144('ac_pe144')) return null;
  css144(); const th = tema144(id) || PE_TEMA144[id] || {}, fx = th.fx || fxDe144(id);
  const d = document.createElement('div'); d.id = 'pe144';
  d.style.setProperty('--a', th.wallB || '#1b52e6'); d.style.setProperty('--b', th.wallA || '#06145a'); d.style.setProperty('--c', th.chevA || '#ffd23a');
  let fxs = ''; for (let k = 0; k < 12; k++) fxs += `<span class="fx" style="left:${(k * 8.3 + 2) % 98}%;animation-duration:${7 + (k * 1.7) % 6}s;animation-delay:-${(k * 1.3) % 7}s">${fx[k % fx.length]}</span>`;
  const [q, ops, ok] = P;
  d.innerHTML = fxs + `<div class="in"><div class="tt">⭐ PREGUNTA ESPECIAL ⭐</div><div class="es">${esc144(th.name || '')}${op.premio ? ' · ' + esc144(op.premio) : ' · si aciertas, +10 segundos en el Duelo Final'}</div><div class="q">${esc144(q)}</div><div class="ops">${ops.map((o, k) => `<button class="op" data-k="${k}">${esc144(o)}</button>`).join('')}</div><div class="rl">15</div></div>`;
  d.addEventListener('pointerdown', ev => ev.stopPropagation()); document.body.appendChild(d);
  try { op.hud && op.hud.say && op.hud.say(`Pregunta especial: ${q}`, 3600); } catch (e) { }
  try { F.play('SomPalavra@Gcpgt1'); } catch (e) { }
  const rl = d.querySelector('.rl'); let ele = -1, t0 = performance.now();
  d.querySelectorAll('.op').forEach(b => b.onclick = ev => { ev.stopPropagation(); if (ele < 0) { ele = +b.dataset.k; tecla144(); } });
  if (window.__pe144Auto != null) setTimeout(() => { if (ele < 0) ele = window.__pe144Auto === 'ok' ? ok : (ok + 1) % ops.length; }, 1200);
  await new Promise(res => { const iv = setInterval(() => { const q2 = Math.max(0, 15 - Math.floor((performance.now() - t0) / 1000)); rl.textContent = q2; if (ele >= 0 || q2 <= 0) { clearInterval(iv); res(); } }, 100); });
  const w = ele === ok; d.querySelectorAll('.op').forEach((b, k) => { b.disabled = true; if (k === ok) b.classList.add('v'); else if (k === ele) b.classList.add('r'); });
  rl.textContent = w ? '✔ ¡CORRECTO!' : ele < 0 ? '⏱ ¡SE ACABÓ EL TIEMPO!' : '✘ ¡OH, NO!';
  try { F.play(w ? 'QuemFicaEmPé-Acerto' : 'Erro'); w ? ze.aplauso(2, 0.7) : ze.ooh(0.8); } catch (e) { }
  if (w) { const n = (ls144('ac_pe144n', 0) || 0) + 1; ss144('ac_pe144n', n); logro144('pe1'); n >= 10 && logro144('pe10'); }
  await new Promise(r => setTimeout(r, window.__pe144Rapido ? 300 : 2600));
  if (!window.__pe144Queda) d.remove();
  return w;
}
const temaActual144 = eng => { try { if (Ke.__AR) return 'argentina'; } catch (e) { } return (eng && eng.theme && eng.theme.id) || Ms; };
async function peFinal144(sess) {
  const { eng, hud } = sess.c, id = temaActual144(eng); if (!id || id === 'normal' || !V144.pe[id]) return;
  const w = await pe144(id, { hud }); if (w == null) return;
  if (w) { sess.finalMas = (sess.finalMas || 0) + 10; try { hud.say('¡Muy bien! Te llevas diez segundos más para el Duelo Final.', 3000); } catch (e) { } }
}

// ---------------- (4) DUELO FINAL: CLÁSICO (10 en 2 min) o LARGO (30 en 4 min) ----------------
const FIN144 = {
  largo: () => { try { return localStorage.getItem('ac_final144') === 'largo'; } catch (e) { return false; } },
  meta() { const m = self.NSAC ? NSAC.meta() : 10; return this.largo() ? 30 - (10 - m) : m; },
  t() { return this.largo() ? 240 : 120; },
  extra() { return (R144.rachaMas || 0); },
};
window.FIN144 = FIN144;

// ---------------- (5) CABECERAS TEMÁTICAS (inicio 1-3 y Duelo Final de la 1.38) ----------------
// Misma pista de audio original. En un programa normal salen tal cual; en un especial se visten con sus colores,
// su rótulo («ESPECIAL HALLOWEEN»), sus objetos y un marco temático alrededor del logo.
function capaTema144(kind) {
  const eng = window.__eng, th = eng && eng.theme; if (!th || th.id === 'normal' || !op144('ac_cabtema144')) return () => { };
  css144(); const fx = fxDe144(th.id), d = document.createElement('div'); d.className = 'th144 ' + kind;
  d.style.setProperty('--a', th.wallA || '#0b2fa8'); d.style.setProperty('--b', th.wallB || '#1b52e6'); d.style.setProperty('--c', th.chevA || '#ffd23a');
  let fxs = ''; for (let k = 0; k < 10; k++) fxs += `<span class="fx" style="left:${(k * 10.7 + 3) % 97}%;animation-duration:${5 + (k * 1.9) % 5}s;animation-delay:-${(k * 1.1) % 5}s">${fx[k % fx.length]}</span>`;
  let marco = ''; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; marco += `<span style="transform:translate(-50%,-50%) translate(${(Math.cos(a) * 24).toFixed(1)}vmin,${(Math.sin(a) * 24).toFixed(1)}vmin)">${fx[k % fx.length]}</span>`; }
  const tit = (th.banner || ('ESPECIAL ' + (th.name || '').toUpperCase())).replace(/^ESPECIAL ESPECIAL/, 'ESPECIAL');
  d.innerHTML = `<div class="tinte" style="background:linear-gradient(160deg,${th.wallA},${th.wallB})"></div><div class="vin"></div>${fxs}<div class="marco">${marco}</div><div class="ban">${th.emoji || ''} ${esc144(kind === 'df' ? 'DUELO FINAL · ' + tit : tit)} ${th.emoji || ''}</div>`;
  const st = document.createElement('style'); st.textContent = `#ciBarre b{color:${th.chevA}!important;text-shadow:0 0 2vh ${th.wallB},0 .4vh 0 ${th.wallA}!important}#ciBarre b::after{content:' ${fx[0]}'}#ciBarre b::before{content:'${fx[1] || fx[0]} '}#ciCred .t{border-color:${th.chevA}!important;background:linear-gradient(90deg,${th.wallA},${th.wallB})!important}`;
  document.head.appendChild(st); document.body.appendChild(d);
  return () => { d.remove(); st.remove(); };
}
if (self.CI && CI.juega) { const j = CI.juega; CI.juega = async function (...a) { const q = capaTema144('ci'); try { return await j.apply(this, a); } finally { q(); } }; }
if (self.DF && DF.cabecera) { const c = DF.cabecera; DF.cabecera = async function (...a) { const q = capaTema144('df'); try { return await c.apply(this, a); } finally { q(); } }; }

// ---------------- LOGROS ----------------
const LOGROS144 = [['final1', '🏆', 'Primer Duelo Final ganado'], ['largo30', '💯', '30 de 30 en el Duelo Final largo'], ['especiales', '🌍', 'Todos los especiales jugados'], ['racha5', '🔥', 'Racha de 5 aciertos seguidos'], ['publico', '👥', 'Has usado el comodín del público'], ['pe1', '⭐', 'Primera pregunta especial acertada'], ['pe10', '🌟', '10 preguntas especiales acertadas'], ['bote100', '💰', 'Un bote de 100.000 € o más'], ['repe', '🔁', 'Has visto una repetición de la caída'], ['ruleta', '🎰', 'Has girado la ruleta del especial'], ['fama', '🏛️', 'Has entrado en el Salón de la fama'], ['pruebas144', '🆕', 'Has jugado una prueba nueva de la 1.44']];
function logro144(id) { const L = ls144('ac_logros144', {}); if (L[id]) return; L[id] = new Date().toLocaleDateString('es-ES'); ss144('ac_logros144', L); const x = LOGROS144.find(l => l[0] === id); x && toast144(`🏅 ¡Logro conseguido! ${x[1]} ${x[2]}`, 3200); }
function verLogros144() { const L = ls144('ac_logros144', {}), jug = ls144('ac_espjug144', []), tot = Do.filter(d => d.id !== 'normal').length;
  modal144('🏅 Logros y medallas', LOGROS144.map(([id, e, t]) => `<div class="lg${L[id] ? '' : ' no'}"><b>${e}</b><span>${t}${id === 'especiales' ? ` (${Math.min(jug.length, tot)}/${tot})` : ''}${L[id] ? ` · <small>${L[id]}</small>` : ''}</span></div>`).join('')); }

// ---------------- SALÓN DE LA FAMA (top 10 local) ----------------
const nombre144 = () => { try { return localStorage.getItem('ac_nombre144') || (qt && qt.central) || 'Concursante'; } catch (e) { return 'Concursante'; } };
function fama144(bote) { if (!(bote > 0)) return; const L = ls144('ac_fama144', []), th = tema144(Ms); L.push({ n: nombre144(), b: Math.round(bote), f: new Date().toLocaleDateString('es-ES'), e: th && th.id !== 'normal' ? th.emoji + ' ' + th.name : '' });
  L.sort((a, b) => b.b - a.b); const top = L.slice(0, 10); ss144('ac_fama144', top); if (top.some(x => x.b === Math.round(bote))) logro144('fama'); }
function verFama144() { const L = ls144('ac_fama144', []);
  modal144('🏛️ Salón de la fama', (L.length ? `<table>${L.map((x, i) => `<tr><td>${['🥇', '🥈', '🥉'][i] || (i + 1) + '.'}</td><td><b>${esc144(x.n)}</b>${x.e ? `<br><small>${esc144(x.e)}</small>` : ''}</td><td style="text-align:right;color:#ffd23a"><b>${x.b.toLocaleString('es-ES')} €</b></td><td style="text-align:right"><small>${x.f}</small></td></tr>`).join('')}</table>` : '<p style="text-align:center">Todavía no hay botes. ¡Gana un Duelo Final para estrenar el salón!</p>')
    + `<p style="text-align:center;margin-top:10px">Tu nombre: <input id="nom144" maxlength="18" value="${esc144(nombre144())}" style="font:700 16px system-ui;padding:4px 8px;border-radius:8px;border:2px solid #ffd23a"></p>`,
  m => { const i = m.querySelector('#nom144'); i.addEventListener('keydown', e => e.stopPropagation()); i.onchange = () => { try { localStorage.setItem('ac_nombre144', i.value.trim() || 'Concursante'); } catch (e) { } }; }); }

// ---------------- RULETA DEL ESPECIAL ----------------
function ruleta144() { const L = Do.filter(d => d.id !== 'normal'); let k = Math.floor(Math.random() * L.length), paso = 40, fin = false;
  const m = modal144('🎰 Ruleta del especial', '<div class="rul">…</div><p style="text-align:center;opacity:.8">¡Que la suerte elija el especial de hoy!</p>'); const r = m.querySelector('.rul');
  const gira = () => { if (!document.body.contains(m)) return; k = (k + 1) % L.length; r.textContent = L[k].emoji + ' ' + L[k].name; tecla144(); paso *= 1.12; if (paso < 520) setTimeout(gira, paso); else fija(); };
  const fija = () => { if (fin) return; fin = true; const h = L[k]; r.style.color = '#ffd23a'; try { F.play('QuemFicaEmPé-Acerto'); } catch (e) { } logro144('ruleta');
    setTimeout(() => { m.remove(); Ms = h.id; try { localStorage.setItem('ac_theme', h.id); } catch (e) { } Xe.setTheme(h); Ii(); Xe.resetPositions(); Lt('play'); toast144(`🎰 Hoy toca: ${h.emoji} ${h.name}`); }, 1400); };
  gira(); }

// ---------------- MENÚ «Jugar»: ruleta, salón de la fama y logros ----------------
{ const lt = Lt; Lt = function (a = 'main', ...r) { const x = lt.call(this, a, ...r); try { if (a === 'play') { const m = document.getElementById('menu'), th = m && m.querySelector('.themes'); if (th && !m.querySelector('#menu144')) { const f = document.createElement('div'); f.id = 'menu144'; f.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0';
    [['🎰 Ruleta del especial', ruleta144], ['🏛️ Salón de la fama', verFama144], ['🏅 Logros', verLogros144]].forEach(([t, fn]) => { const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = t; b.onclick = ev => { ev.stopPropagation(); tecla144(); fn(); }; f.appendChild(b); });
    th.before(f); } } } catch (e) { console.warn('menu144', e); } return x; }; }

// ---------------- inicio de programa: reinicia comodín, racha y apunta el especial jugado ----------------
{ const i0 = ii; ii = async function (a, ...r) { if (a === 'programa' || a === 'oponente') { R144.prog = true; R144.pubUsado = false; R144.racha = 0; R144.rachaMas = 0; if (Ms && Ms !== 'normal') { const j = ls144('ac_espjug144', []); if (!j.includes(Ms)) { j.push(Ms); ss144('ac_espjug144', j); } if (Do.filter(d => d.id !== 'normal').every(d => j.includes(d.id))) logro144('especiales'); } }
  else R144.prog = a === 'entrenamiento' ? 'ent' : false;
  if (a === 'entrenamiento' && P144.includes(r[0])) logro144('pruebas144');
  try { return await i0.call(this, a, ...r); } finally { R144.prog = false; pubOculta144(); } }; }

// ---------------- RACHA: 5 aciertos seguidos = +5 s en el Duelo Final ----------------
function racha144(ok) { if (R144.prog !== true || !op144('ac_racha144')) return; if (!ok) { R144.racha = 0; return; } R144.racha++;
  if (R144.racha % 5 === 0) { R144.rachaMas += 5; logro144('racha5'); toast144(`🔥 ¡RACHA DE ${R144.racha}! +5 segundos para el Duelo Final (llevas +${R144.rachaMas} s)`, 3000); } }
{ const pq = sy.prototype.pregunta; sy.prototype.pregunta = async function (e, ...r) { const x = await pq.call(this, e, ...r); if (e !== 'FINAL' && x !== 'pasa') racha144(x === 'ok'); return x; }; }
function fplay144() { if (!F || F.__p144) return; F.__p144 = 1; const fp = F.play; F.play = function (n, ...r) { try { const ar = Ke.__ar; if (ar && ar.turno === 'me' && R144.prog === true) { if (n === 'QuemFicaEmPé-Acerto') racha144(true); else if (n === 'Erro' || n === 'DropM.mp3') racha144(false); } } catch (e) { } return fp.call(this, n, ...r); }; }
setTimeout(function w144() { try { fplay144(); } catch (e) { } if (!F || !F.__p144) setTimeout(w144, 1000); }, 500);

// ---------------- COMODÍN DEL PÚBLICO (una vez por programa, en los duelos con opciones) ----------------
let pubQ144 = null;
function pubOculta144() { const b = document.getElementById('pub144'); b && (b.style.display = 'none'); }
setInterval(() => { try { const ar = Ke.__ar, b0 = document.getElementById('pub144');
  const vis = R144.prog === true && !R144.pubUsado && op144('ac_pub144') && ar && ar.q && ar.q.ops && ar.q.ops.length > 1 && ar.turno === 'me' && document.querySelector('#arHud, .arHud, [class*="arOp"], .arClock');
  if (!vis) { b0 && (b0.style.display = 'none'); return; }
  css144(); let b = b0; if (!b) { b = document.createElement('button'); b.id = 'pub144'; b.textContent = '👥'; b.title = 'Comodín del público'; b.addEventListener('pointerdown', e => e.stopPropagation()); b.onclick = e => { e.stopPropagation(); publico144(); }; document.body.appendChild(b); }
  b.style.display = 'block'; } catch (e) { } }, 300);
function publico144() { const ar = Ke.__ar; if (!ar || !ar.q || R144.pubUsado) return; R144.pubUsado = true; pubOculta144(); logro144('publico'); css144();
  const q = ar.q, n = q.ops.length, bien = q.bien; let p = q.ops.map(() => 5 + Math.random() * 20); p[bien] = 45 + Math.random() * 30; const s = p.reduce((a, b) => a + b, 0); p = p.map(x => Math.round(x / s * 100));
  const d = document.createElement('div'); d.id = 'pubb144'; d.innerHTML = '<div style="text-align:center;color:#ffd23a">👥 EL PÚBLICO OPINA…</div>' + q.ops.map((o, k) => `<div class="r"><span>${esc144(o)}</span><i style="width:0"></i><b>${p[k]}%</b></div>`).join('');
  document.body.appendChild(d); try { ze.aplauso(1.4, 0.5); } catch (e) { } requestAnimationFrame(() => requestAnimationFrame(() => d.querySelectorAll('i').forEach((i, k) => i.style.width = (p[k] * 0.5) + '%')));
  setTimeout(() => d.remove(), 4200); }

// ---------------- REPETICIÓN DE LA CAÍDA (cámara lenta y grúa; se salta tocando la pantalla) ----------------
{ const f1 = y2.prototype.fall;
  y2.prototype.fall = function (fig, idx) { const y0 = fig.root.position.y, pr = f1.call(this, fig, idx);
    if (this.__rep144 || R144.prog !== true || !op144('ac_repe144')) return pr;
    const eng = this; return pr.then(async v => { try { await repe144(eng, fig, idx, y0, f1); } catch (e) { console.warn('repe144', e); } return v; }); }; }
async function repe144(eng, fig, idx, y0, f1) {
  const h = eng.studio && eng.studio.holes[idx]; if (!h) return; css144(); eng.__rep144 = 1;
  const d = document.createElement('div'); d.id = 'rep144'; d.innerHTML = '<b><i>●</i> REPETICIÓN</b><small>Toca para saltar</small>'; document.body.appendChild(d);
  let salta = false; const sk = e => { salta = true; SLOW.k = 1; e.stopPropagation(); }; setTimeout(() => document.addEventListener('pointerdown', sk, true), 200);
  try { await new Promise(r => setTimeout(r, 500)); if (salta) return;
    const p = h.pos.clone(); fig.root.position.y = y0; fig.root.visible = true;
    eng.cut($t(p.x + 3.2, p.y + 5.5, p.z + 4.2), $t(p.x, p.y + 0.8, p.z)); eng.glide($t(p.x + 1.4, p.y + 1.2, p.z + 2.6), $t(p.x, p.y + 0.2, p.z), 1.1);
    SLOW.k = 0.3; SLOW.hasta = performance.now() + 6000; logro144('repe');
    const fin = f1.call(eng, fig, idx); await Promise.race([fin, new Promise(r => { const iv = setInterval(() => { if (salta) { clearInterval(iv); r(); } }, 50); })]); await fin;
    if (!salta) await new Promise(r => setTimeout(r, 600));
  } finally { SLOW.k = 1; SLOW.hasta = 0; eng.__rep144 = 0; d.remove(); document.removeEventListener('pointerdown', sk, true); }
}

// ---------------- fin del Duelo Final: logros y salón de la fama ----------------
function finFinal144(sess, gana) { if (!gana) return; logro144('final1'); FIN144.largo() && sess.acertos >= 30 && logro144('largo30'); sess.placar >= 100000 && logro144('bote100'); fama144(sess.placar); }

// ---------------- OPCIONES › 🆕 Novedades 1.44 ----------------
function fila144() {
  const box = document.createElement('div'); box.className = 'ocustom'; box.id = 'opt144';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🆕 Novedades de la 1.44'; box.appendChild(lb);
  const fila = (k, txt, ops, cur) => { const r = document.createElement('div'); r.className = 'orow'; r.id = 'o_' + k; const l = document.createElement('label'); l.textContent = txt; r.appendChild(l);
    for (const [v, t] of ops) { const b = document.createElement('button'); b.className = 'tbtn' + (cur === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); tecla144(); try { localStorage.setItem(k, v); } catch (e) { } r.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; r.appendChild(b); }
    box.appendChild(r); };
  const sn = (k, txt, def = true) => fila(k, txt, [['1', 'Sí'], ['0', 'No']], op144(k, def) ? '1' : '0');
  fila('ac_final144', '🏁 Duelo final', [['clasico', 'Clásico: 10 preguntas en 2 minutos'], ['largo', 'Largo: 30 preguntas en 4 minutos']], FIN144.largo() ? 'largo' : 'clasico');
  sn('ac_pe144', '⭐ Pregunta especial antes del Duelo Final (en los especiales)');
  fila('ac_verde144', '🎬 Cabecera oficial del programa y del Duelo Final', [['1', '«¡Ahora Caigo! Nuevo» (la de Iker)'], ['0', 'La original (1.38)']], verdeOn144() ? '1' : '0');
  sn('ac_dfcab137', '🎬 Cabecera del Duelo Final (la de la 1.38)');
  if (self.CI && CI.fila) box.appendChild(CI.fila());
  sn('ac_cabtema144', '🎨 Cabeceras temáticas en los especiales');
  sn('ac_pub144', '👥 Comodín del público (una vez por programa)');
  sn('ac_racha144', '🔥 Racha: 5 aciertos seguidos = +5 s en el Duelo Final');
  sn('ac_repe144', '🔁 Repetición de la caída a cámara lenta');
  const n = document.createElement('p'); n.className = 'onote small'; n.textContent = 'Pruebas nuevas: El reloj loco, Letra prohibida, Antes o después, El eco, Mitad y mitad, El semáforo, ¿Quién lo dijo? y Mayor o menor (arriba, en «Pruebas nuevas»). En «Jugar» tienes la Ruleta del especial, el Salón de la fama y los Logros.'; box.appendChild(n);
  return box;
}
{ const fc = filaCopro; filaCopro = function () { const d = fc(); d.prepend(fila144()); return d; }; }
window.__v144 = { jugar: (...a) => ii(...a), menu: a => Lt(a), tema: id => { const h = tema144(id) || Do[0]; Ms = h.id; try { localStorage.setItem('ac_theme', h.id); } catch (e) { } Xe.setTheme(h); Ii(); Xe.resetPositions(); return h.id; }, R144, P144, pe144, FIN144, ruleta144, verFama144, verLogros144, publico144, fama144, logro144, capaTema144 };

// ---------------- CABECERA «¡AHORA CAIGO! NUEVO» (pantalla verde de Iker) ----------------
// El vídeo de Iker (verde/intro_verde.mp4, con su audio sin tocar) se pinta encima del plató 3D con un shader WebGL
// que quita el verde (chroma key): donde hay verde se ve el plató del juego en directo, con su tema y su logo 3D.
// Sirve para la cabecera de inicio (kind 'inicio'), la del Duelo Final ('df') y la del especial «Lo mejor» ('lomejor').
const verdeOn144 = () => op144('ac_verde144');
function verdeGL144(cv, video) {
  const gl = cv.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: false }); if (!gl) return null;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;varying vec2 u;void main(){u=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, 'precision mediump float;varying vec2 u;uniform sampler2D t;uniform vec4 m;void main(){vec4 c=texture2D(t,u);float k=c.g-max(c.r,c.b);float a=1.-smoothstep(.12,.26,k);if(u.x>m.x&&u.x<m.z&&u.y>m.y&&u.y<m.w)a=0.;vec3 col=c.rgb;if(k>0.){col.g=min(col.g,max(col.r,col.b)+.04);}gl_FragColor=vec4(col*a,a);}'));
  gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const l = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  const um = gl.getUniformLocation(pr, 'm');
  return (rect) => { if (video.readyState < 2) return; gl.uniform4fv(um, rect || [2, 2, 2, 2]); gl.viewport(0, 0, cv.width, cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video); } catch (e) { } gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
}
// «Nuevo» del vídeo → placa cromada con el nombre del especial (como la de «300 SUSCRIPTORES»), con reflejo en el suelo.
// Tiempos y sitio medidos en el vídeo (1280x720): aparece a los 4,75 s, quieto de 5,0 a 6,2 s y gira hasta 7,0 s.
const NUEVO144 = { t0: 4.75, t1: 5.0, t2: 6.2, t3: 7.0, x0: 440, y0: 470, x1: 920, y1: 640 };
function nombrePlaca144(th) { if (th.placa) return th.placa; const n = (th.placa || th.name || '').replace(/^Especial\s+/i, '').replace(/^¡Ahora caigo!\s*/i, '').split('·')[0].trim(); return (n || th.id || '').toUpperCase(); }
function placa144(txt) {
  const N = NUEVO144, c = document.createElement('canvas'); c.id = 'placa144'; c.width = 1280; c.height = 720; c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:57;pointer-events:none;object-fit:cover'; document.body.appendChild(c);
  const g = c.getContext('2d');
  // la placa se dibuja una vez en un lienzo aparte
  const P = document.createElement('canvas'); P.width = 560; P.height = 180; const q = P.getContext('2d');
  const rr = (x, y, w, h, r) => { q.beginPath(); q.moveTo(x + r, y); q.arcTo(x + w, y, x + w, y + h, r); q.arcTo(x + w, y + h, x, y + h, r); q.arcTo(x, y + h, x, y, r); q.arcTo(x, y, x + w, y, r); q.closePath(); };
  let fs = 104; q.font = `900 ${fs}px "Arial Black","Montserrat",Arial,sans-serif`; while (q.measureText(txt).width > 470 && fs > 30) { fs -= 4; q.font = `900 ${fs}px "Arial Black","Montserrat",Arial,sans-serif`; }
  const w = 552, x = 4, y = 6, h = 160;
  q.save(); q.translate(0, 8); rr(x, y, w, h, 26); q.fillStyle = '#2a2e34'; q.fill(); q.restore();   // canto (3D)
  rr(x, y, w, h, 26); const cr = q.createLinearGradient(0, y, 0, y + h); cr.addColorStop(0, '#ffffff'); cr.addColorStop(.18, '#c9ced6'); cr.addColorStop(.45, '#7d848e'); cr.addColorStop(.55, '#a9b0ba'); cr.addColorStop(.8, '#e9edf2'); cr.addColorStop(1, '#6a717b'); q.fillStyle = cr; q.fill(); q.lineWidth = 4; q.strokeStyle = '#3a3f46'; q.stroke();
  rr(x + 9, y + 9, w - 18, h - 18, 18); const ins = q.createLinearGradient(0, y, 0, y + h); ins.addColorStop(0, '#5b626c'); ins.addColorStop(.5, '#3a4048'); ins.addColorStop(1, '#646b75'); q.fillStyle = ins; q.fill();
  q.textAlign = 'center'; q.textBaseline = 'middle'; const cy = y + h / 2 + 4;
  for (let k = 6; k > 0; k--) { q.fillStyle = k > 3 ? '#20242a' : '#8a919b'; q.fillText(txt, 280 + k * 0.6, cy + k); }   // relieve de las letras
  const tg = q.createLinearGradient(0, cy - fs / 2, 0, cy + fs / 2); tg.addColorStop(0, '#ffffff'); tg.addColorStop(.6, '#f2f4f7'); tg.addColorStop(1, '#c8cdd4'); q.fillStyle = tg; q.fillText(txt, 280, cy);
  q.lineWidth = 2; q.strokeStyle = '#1a1d22'; q.strokeText(txt, 280, cy);
  const sh = q.createLinearGradient(0, y, 0, y + h * .5); sh.addColorStop(0, 'rgba(255,255,255,.35)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); rr(x + 9, y + 9, w - 18, h * .42, 18); q.fillStyle = sh; q.fill();
  const W0 = N.x1 - N.x0, H0 = W0 * 180 / 560, cx = (N.x0 + N.x1) / 2, cyb = (N.y0 + N.y1) / 2 - 6;
  let ult = -1;
  return t => {
    if (t < N.t0 || t > N.t3) { if (ult !== 0) { g.clearRect(0, 0, 1280, 720); ult = 0; } return null; }
    ult = 1; g.clearRect(0, 0, 1280, 720);
    let dy = 0, sx = 1, al = 1; if (t < N.t1) { const u = (t - N.t0) / (N.t1 - N.t0); dy = -(1 - u) * 260; al = u; } if (t > N.t2) { const u = (t - N.t2) / (N.t3 - N.t2); sx = Math.cos(u * Math.PI / 2); al = 1 - u * .3; }
    g.save(); g.globalAlpha = al; g.translate(cx, cyb + dy); g.scale(sx, 1); g.drawImage(P, -W0 / 2, -H0 / 2, W0, H0);
    // reflejo en el suelo brillante del plató
    g.save(); g.scale(1, -1); g.translate(0, -H0 * 1.02); g.globalAlpha = al * .28; g.drawImage(P, -W0 / 2, -H0 / 2, W0, H0); g.restore();
    const fd = g.createLinearGradient(0, H0 * .5, 0, H0 * 1.55); fd.addColorStop(0, 'rgba(0,0,0,0)'); fd.addColorStop(1, 'rgba(0,0,0,0)'); g.restore();
    return [(cx - W0 / 2 + 10) / 1280, (cyb + dy - H0 / 2 + 10) / 720, (cx + W0 / 2 - 10) / 1280, (cyb + dy + H0 / 2 - 14) / 720];   // tapa el «Nuevo» original en el shader
  };
}
async function verde144(kind, eng, hud, op = {}) {
  eng = eng || Xe; css144();
  const video = document.createElement('video'); video.src = 'verde/intro_verde.mp4'; video.playsInline = true; video.preload = 'auto'; video.setAttribute('playsinline', '');
  video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:0;top:0'; document.body.appendChild(video);
  const cv = document.createElement('canvas'); cv.id = 'verde144'; cv.width = 640; cv.height = 360; cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:57;pointer-events:none;object-fit:cover';
  document.body.appendChild(cv); const dibuja = verdeGL144(cv, video);
  const th0 = (eng || Xe).theme || { id: 'normal' }; const placa = th0.id !== 'normal' || op.placa ? placa144(op.placa || nombrePlaca144(th0)) : null;
  const ocultos = ['hashtag', 'bubble', 'topbar', 'vidas', 'lower3', 'hint', 'actions'].map(id => { const el = document.getElementById(id); if (!el) return null; const v = el.style.visibility; el.style.visibility = 'hidden'; return [el, v]; });
  const th = eng.theme || { id: 'normal' };
  const rot = document.createElement('div'); rot.className = 'th144 verdeRot'; rot.style.setProperty('--a', th.wallA || '#0b2fa8'); rot.style.setProperty('--b', th.wallB || '#1b52e6'); rot.style.setProperty('--c', th.chevA || '#ffd23a');
  const tit = op.titulo || (kind === 'df' ? 'DUELO FINAL' : kind === 'lomejor' ? (op.it ? 'IL MEGLIO DI CADUTA LIBERA' : 'LO MEJOR DE ¡AHORA CAIGO!') : (th.id !== 'normal' ? (th.banner || 'ESPECIAL ' + (th.name || '').toUpperCase()) : '¡AHORA CAIGO! NUEVO'));
  rot.innerHTML = `<div class="ban" style="display:none">${th.id !== 'normal' && th.emoji ? th.emoji + ' ' : ''}${esc144(tit)}${op.cifra ? ' · ' + esc144(op.cifra) : ''}${th.id !== 'normal' && th.emoji ? ' ' + th.emoji : ''}</div>`;
  document.body.appendChild(rot); const quitaTema = th.id !== 'normal' ? capaTema144(kind === 'df' ? 'df' : 'ci') : () => { }; if (th.id !== 'normal' && kind === 'inicio') rot.style.display = 'none';
  // el plató del juego, en directo debajo del verde: grúa alrededor de las trampillas
  try { eng.resetPositions && kind === 'inicio' && eng.resetPositions(); eng.startOrbit($t(0, 0, 0), kind === 'df' ? 9 : 12, kind === 'df' ? 4.2 : 5.5, 0, 0.09, 1); } catch (e) { }
  let salta = false; const sk = e => { if (op.fija) return; salta = true; e.stopPropagation(); };
  setTimeout(() => document.addEventListener('pointerdown', sk, true), 500);
  try { video.muted = false; await video.play(); } catch (e) { try { video.muted = true; await video.play(); } catch (x) { } }
  await new Promise(res => { let raf = 0; const paso = () => { if (salta || video.ended || (op.max && video.currentTime >= op.max)) { window.__verdeLog = [salta, video.ended, video.currentTime]; cancelAnimationFrame(raf); return res(); }
      const t = video.currentTime; const pl = placa && placa(t); dibuja && dibuja(pl); const b = rot.querySelector('.ban'); b.style.display = t > 9.2 ? 'block' : 'none'; op.cada && op.cada(t); raf = requestAnimationFrame(paso); };
    video.onerror = () => { window.__verdeLog = 'error'; res(); }; setTimeout(() => { if (video.readyState < 1) { window.__verdeLog = 'timeout'; res(); } }, 8000); paso(); });
  try { video.pause(); } catch (e) { } video.remove(); cv.remove(); document.getElementById('placa144')?.remove(); rot.remove(); quitaTema(); document.removeEventListener('pointerdown', sk, true);
  ocultos.forEach(o => o && (o[0].style.visibility = o[1]));
  return true;
}

// ---------------- LO MEJOR DE ¡AHORA CAIGO! (Il meglio di Caduta Libera) ----------------
const it144 = () => { try { return localStorage.getItem('ac_lang') === 'it' || /^it/i.test(navigator.language || ''); } catch (e) { return false; } };
// Vídeos de Iker («Recreaciones e historias»). Los cortos van dentro de la app (videos/); los largos se ven por internet
// desde la web de GitHub Pages del juego (para que el APK no crezca demasiado).
const PAGES144 = 'https://ikeriano.github.io/ahoracaigo-grok-bot/videos/';
const VID144 = [
  ['sintonia', 'Nueva sintonía de ¡Ahora Caigo! (en recuerdo de la versión virtual de SHOWTIME TV)', '3:44', 0],
  ['acierta', 'Acierta o Abismo · Intro extendida', '0:55', 0],
  ['invideo1', '¡El regreso de ¡Ahora caigo! a Antena 3! · INVIDEO AI (20-09-2026)', '7:14', 0],
  ['invideo2', '¡El regreso de ¡Ahora caigo! a Antena 3! · INVIDEO AI · Versión extendida (21-09-2026)', '15:12', 1],
  ['arturo_grok', 'Arturo Valls recreado con Grok · con la despedida del décimo aniversario', '12:40', 1],
  ['caduta_heygen', 'Caduta Libera 2015 · vídeo original traducido al español con HeyGen AI', '27:23', 1],
  ['mejores_arturo', 'Mejores momentos de Arturo Valls en ¡Ahora Caigo!', '29:01', 1],
  ['programa_1', '¡Ahora Caigo! · Programa completo con nueva intro (1.ª parte)', '32:00', 1],
  ['programa_2', '¡Ahora Caigo! · Programa completo con nueva intro (2.ª parte)', '32:00', 1],
];
const urlVid144 = v => (v[3] ? PAGES144 : 'videos/') + v[0] + '.mp4';
function verVideo144(k) { css144(); const it = it144(); let i = k;
  const m = modal144('🎞️ <span class="vt"></span>', `<video controls autoplay playsinline style="width:100%;max-height:58vh;background:#000;border-radius:10px"></video><div style="display:flex;justify-content:space-between;gap:8px;margin-top:8px"><button class="tbtn pv">⏮ ${it ? 'Precedente' : 'Anterior'}</button><span class="nf" style="align-self:center;opacity:.8;font-size:13px"></span><button class="tbtn nx">${it ? 'Successivo' : 'Siguiente'} ⏭</button></div>`);
  const v = m.querySelector('video'), pon = n => { i = (n + VID144.length) % VID144.length; const x = VID144[i]; m.querySelector('.vt').textContent = x[1]; v.poster = 'videos/' + x[0] + '.jpg'; v.src = urlVid144(x); v.play().catch(() => { });
    m.querySelector('.nf').textContent = `${i + 1}/${VID144.length} · ${x[2]}${x[3] ? (it ? ' · in streaming' : ' · por internet') : ''}`; };
  v.onerror = () => { m.querySelector('.nf').textContent = it ? 'Serve internet per questo video.' : 'Este vídeo necesita conexión a internet.'; };
  v.onended = () => pon(i + 1);
  m.querySelector('.pv').onclick = ev => { ev.stopPropagation(); tecla144(); pon(i - 1); }; m.querySelector('.nx').onclick = ev => { ev.stopPropagation(); tecla144(); pon(i + 1); };
  m.querySelector('.bt').addEventListener('click', () => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) { } }); pon(k); }
function galeria144() { const it = it144();
  modal144(it ? '🎞️ Ricostruzioni e storie · video di Ikeriano' : '🎞️ Recreaciones e historias · vídeos de Ikeriano', `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">${VID144.map((x, k) => `<button class="tbtn" data-k="${k}" style="padding:0;overflow:hidden;border-radius:10px;text-align:left;background:#06145a;color:#fff;border:2px solid #ffd23a"><img src="videos/${x[0]}.jpg" loading="lazy" style="width:100%;display:block;aspect-ratio:16/9;object-fit:cover" onerror="this.style.display='none'"><div style="padding:6px 8px;font:700 13px Montserrat,system-ui">▶ ${esc144(x[1])}<br><small style="opacity:.75">${x[2]}${x[3] ? (it ? ' · streaming' : ' · por internet') : (it ? ' · nell\'app' : ' · en la app')}</small></div></button>`).join('')}</div><p style="text-align:center;opacity:.8;font-size:13px">${it ? 'Video del canale di Ikeriano. Quelli lunghi si vedono in streaming.' : 'Los vídeos del canal de Ikeriano. Los cortos están dentro de la app; los largos se ven por internet.'}</p>`,
    m => m.querySelectorAll('[data-k]').forEach(b => b.onclick = ev => { ev.stopPropagation(); tecla144(); m.remove(); verVideo144(+b.dataset.k); })); }
function menuOculto144(on) { const m = document.getElementById('menu'); if (m) m.classList.toggle('hidden', on); }
async function lomejorTop144(tipo) {
  const eng = Xe, it = it144(); menuOculto144(true); document.getElementById('m144')?.remove(); R144.prog = true; const sw = R144.prog;
  try {
    eng.resetPositions(); eng.opps.forEach(o => o.root.visible = true);
    if (tipo === 'todo' || tipo === 'intro') await verde144('lomejor', eng, yn, { it, max: tipo === 'todo' ? 16 : 0 });
    if (tipo === 'todo' || tipo === 'caidas') {
      const N = [5, 3, 8]; for (let k = 0; k < N.length; k++) { const i = N[k], fig = eng.opps[i - 1]; if (!fig) continue;
        toast144((it ? '💥 LE MIGLIORI CADUTE · Nº ' : '💥 LAS MEJORES CAÍDAS · Nº ') + (N.length - k), 2600);
        const p = eng.studio.holes[i].pos; eng.cut($t(p.x + 2.4, p.y + 3, p.z + 3.4), $t(p.x, p.y + 1, p.z)); await new Promise(r => setTimeout(r, 900));
        try { F.play('DropM.mp3'); ze.ooh(0.9); } catch (e) { } await eng.fall(fig, i); }
      eng.resetPositions(); eng.opps.forEach(o => o.root.visible = true);
    }
    if (tipo === 'todo' || tipo === 'finales') {
      const L = ls144('ac_fama144', []); const top = L.slice(0, 3);
      toast144(it ? '🏆 LE MIGLIORI FINALI' : '🏆 LOS MEJORES DUELOS FINALES', 2600);
      try { eng.setGoldSet(true); eng.lights && eng.lights.event('ganador'); } catch (e) { }
      eng.startOrbit($t(0, 0, 0), 10.5, 4.8, 0, 0.12, 1);
      for (const [k, x] of (top.length ? top : [{ n: nombre144(), b: 20000, f: '' }]).entries()) { try { ea(eng.studio, $t(0, Ae + 1, 0)); ze.ovacion(3); self.DF && DF.pantalla(x.b); } catch (e) { }
        toast144(`${['🥇', '🥈', '🥉'][k]} ${x.n} · ${x.b.toLocaleString('es-ES')} €${x.f ? ' · ' + x.f : ''}`, 3000); await new Promise(r => setTimeout(r, 3400)); }
      try { self.DF && DF.quitaPantalla(); eng.setGoldSet(false); } catch (e) { }
    }
  } catch (e) { console.warn('lomejor144', e); }
  finally { R144.prog = false; menuOculto144(false); Lt('main'); }
}
function lomejor144() { const it = it144();
  modal144(it ? '⭐ Il meglio di Caduta Libera' : '⭐ Lo mejor de ¡Ahora Caigo!', [
    ['todo', it ? '▶ Guarda lo speciale completo' : '▶ Ver el especial completo', it ? 'Sigla, cadute al rallentatore e finali' : 'Cabecera, las mejores caídas a cámara lenta y los mejores finales'],
    ['caidas', it ? '💥 Le migliori cadute' : '💥 Las mejores caídas', it ? 'Replay al rallentatore con la gru' : 'Repetición a cámara lenta con la grúa'],
    ['duelos', it ? '⚔️ I migliori duelli' : '⚔️ Los mejores duelos', it ? 'Gioca una prova famosa' : 'Juega una de las pruebas más famosas'],
    ['finales', it ? '🏆 Le migliori finali' : '🏆 Los mejores duelos finales', it ? 'I montepremi della Hall of Fame' : 'Los botes del Salón de la fama, en el plató'],
    ['videos', it ? '🎞️ Video di Ikeriano' : '🎞️ Vídeos de Ikeriano', it ? 'Galleria dei video del canale' : 'Galería con los vídeos del canal de Ikeriano'],
  ].map(([k, t, d]) => `<button class="tbtn" data-k="${k}" style="display:block;width:100%;margin:6px 0;text-align:left;padding:10px 14px"><b>${t}</b><br><small>${d}</small></button>`).join(''),
  m => m.querySelectorAll('[data-k]').forEach(b => b.onclick = ev => { ev.stopPropagation(); tecla144(); const k = b.dataset.k;
    if (k === 'videos') return galeria144();
    m.remove(); if (k === 'duelos') { const L = ['clasico', 'gallina', 'bomba', 'rosco', ...P144]; return ii('entrenamiento', L[Math.floor(Math.random() * L.length)]); }
    lomejorTop144(k); })); }
{ const lt = Lt; Lt = function (a = 'main', ...r) { const x = lt.call(this, a, ...r); try { if (a === 'main') { const m = document.getElementById('menu'), col = m && m.querySelector('.col'); if (col && !m.querySelector('#lm144')) { const b = ei(it144() ? '⭐ Il meglio di Caduta Libera' : '⭐ Lo mejor de ¡Ahora Caigo!', it144() ? 'Momenti top, duelli, cadute, finali e video di Ikeriano' : 'Mejores momentos, duelos, caídas, finales y los vídeos de Ikeriano', 'gold', () => lomejor144()); b.id = 'lm144'; col.children[0] ? col.children[0].after(b) : col.appendChild(b); const g = ei(it144() ? '🎞️ Ricostruzioni e storie' : '🎞️ Recreaciones e historias', it144() ? 'I video di Ikeriano: programmi, sigle e ricostruzioni' : 'Los vídeos de Ikeriano: programas, sintonías y recreaciones', '', () => galeria144()); g.id = 'rh144'; b.after(g); } } } catch (e) { console.warn('lm144', e); } return x; }; }
Object.assign(window.__v144, { verde144, lomejor144, lomejorTop144, galeria144 });

// ---------------- ESPECIAL «AHORA CAGO»: en vez de caer por la trampilla, ¡lluvia de cacas de dibujos! ----------------
// Cacas emoji de dibujos animados, «¡splat!» sintetizado, el concursante se va cabizbajo y el presentador le pone un mote
// cariñoso (sin insultos ni palabrotas). La frase la dice la voz sintetizada del juego (TTS) y así se indica en pantalla.
const MOTES144 = ['Don Chapoteo', 'el Rey del Desatascador', 'Señor Cisterna', 'Capitán Pañal', 'la Duquesa del Papel Higiénico', 'Sir Pedorreta', 'el Marqués del Patito de Goma', 'Superchurro'];
const PULLAS144 = ['¡Ay, {m}! Te ha caído encima todo el especial. ¡A la ducha, campeón!', 'Tranquilo, {m}: en este programa lo importante es participar… y tirar de la cadena.', '¡{m}, te vas como llegaste: oliendo a lavanda… más o menos!', '¡Uy, {m}! Hoy no era tu día, pero sí el de la fregona.', '¡Qué lluvia más rica, {m}! Mañana, paraguas.'];
function splat144() { try { const a = window.__audio || null, ctx = (a && a.ctx) || (window.__ctx144 = window.__ctx144 || new (window.AudioContext || window.webkitAudioContext)()); const n = ctx.sampleRate * 0.35, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); const s = ctx.createBufferSource(); s.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(900, ctx.currentTime); f.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);
  const g = ctx.createGain(); g.gain.value = 0.9; s.connect(f); f.connect(g); g.connect((a && (a.sfx || a.master)) || ctx.destination); s.start(); } catch (e) { } }
async function lluviaCaca144(eng, fig) {
  css144(); const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;z-index:45;pointer-events:none;overflow:hidden';
  const st = document.createElement('style'); st.textContent = '@keyframes caca144{0%{transform:translateY(-15vh) rotate(0)}85%{transform:translateY(var(--y)) rotate(200deg) scale(1)}100%{transform:translateY(var(--y)) rotate(220deg) scale(1.5,.5)}}';
  document.head.appendChild(st);
  // la figura en pantalla
  let sx = 50, sy = 60; try { const v = fig.root.position.clone(); v.y += 1.4; v.project(eng.camera); sx = (v.x * 0.5 + 0.5) * 100; sy = (-v.y * 0.5 + 0.5) * 100; } catch (e) { }
  for (let k = 0; k < 22; k++) { const e = document.createElement('span'); e.textContent = k % 7 === 3 ? '💦' : '💩'; const del = (k * 0.09).toFixed(2);
    e.style.cssText = `position:absolute;left:${(sx - 9 + Math.random() * 18).toFixed(1)}%;top:0;font-size:${(4 + Math.random() * 3).toFixed(1)}vmin;--y:${(sy - 4 + Math.random() * 14).toFixed(1)}vh;animation:caca144 ${(0.8 + Math.random() * 0.4).toFixed(2)}s ${del}s ease-in both`;
    d.appendChild(e); setTimeout(splat144, (+del + 0.75) * 1000); }
  document.body.appendChild(d); try { ze.risas(); He(fig, 'lamenta', 3); } catch (e) { }
  await new Promise(r => setTimeout(r, 2400));
  // se marcha cabizbajo
  const p0 = fig.root.position.clone(), dir = p0.x >= 0 ? 1 : -1; let t = 0;
  try { fig.root.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2; } catch (e) { }
  await new Promise(r => { const iv = setInterval(() => { t += 0.05; try { fig.root.position.x = p0.x + dir * t * 2.2; fig.root.rotation.x = 0.35; (fig.head || fig.root).rotation && fig.head && (fig.head.rotation.x = 0.6); } catch (e) { } if (t >= 1.6) { clearInterval(iv); r(); } }, 50); });
  try { fig.root.visible = false; fig.root.position.copy(p0); fig.root.rotation.x = 0; fig.head && (fig.head.rotation.x = 0); } catch (e) { }
  d.remove(); st.remove();
}
{ const f2 = y2.prototype.fall;
  y2.prototype.fall = function (fig, idx) { if (!(this.theme && this.theme.id === 'ahoracago')) return f2.call(this, fig, idx);
    const eng = this, mote = MOTES144[Math.floor(Math.random() * MOTES144.length)], frase = PULLAS144[Math.floor(Math.random() * PULLAS144.length)].replace('{m}', mote);
    return (async () => { const hab = (async () => { await new Promise(r => setTimeout(r, 1200)); try { toast144('🔊 Voz sintetizada (TTS) · ' + mote, 4000); yn && yn.say && yn.say(frase, 4200); } catch (e) { } })();
      await lluviaCaca144(eng, fig); await hab; })(); }; }
window.__v144.eng = () => Xe;
// (para pruebas automáticas) window.__soloFinal144 = true: el programa va directo a la pregunta especial y al Duelo Final
{ const r0 = sy.prototype.run; sy.prototype.run = async function (...a) { if (!window.__soloFinal144) return r0.apply(this, a); this.placar = 12000; const o = await this.juegoFinal(); return this.fin(o ? 'ganado' : 'perdido'); }; }
