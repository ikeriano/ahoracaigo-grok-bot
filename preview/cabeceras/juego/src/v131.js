// v1.31 · CINCO PRUEBAS NUEVAS con el panel de las pruebas del programa y las trampillas de siempre:
// EL ROSCO DE LA TRAMPILLA (rueda A-Z; cada fallo abre la trampilla un instante), LA MEMORIA, LA INTRUSA,
// CUENTAS DE TRAMPILLA y EL PRECIO DE LA TRAMPILLA (euros). Entran en el Programa completo, Entrenamiento y Opciones.
const P131 = ['rosco', 'memoria', 'intrusa', 'cuentas', 'precio'];
Object.assign(V128.titulos, V131.titulos); Object.assign(V128.dichos, V131.dichos);
// ---- EL ROSCO (v1.32, a lo Pasapalabra): cada uno con su rosco y su reloj. Acierto = verde y sigues;
// fallo = rojo, la trampilla se enciende y pasa el turno; PASAR = la letra sigue azul y vuelve en la siguiente vuelta.
// Termina cuando los dos han contestado todas las letras o se quedan sin tiempo. Gana quien tiene más aciertos (luego, menos fallos).
// Cinco diseños a elegir en Opciones › Diseño del Rosco (por defecto el 2: bolas brillantes con Contestar / Pasar).
const ROS = { el: null, pausa: false, d: 2 };
const PASA131 = { adr: ['¡Pasapalabra! Esa letra vuelve en la siguiente vuelta.', '¡Pasapalabra! Luego volvemos a ella.'], tano: TANO131.pasa };
const ROSCO_DIS = [[1, 'Rueda la letra'], [2, 'Contestar / Pasar'], [3, 'Rosco verde'], [4, 'Rosco verde · marcador'], [5, 'Presentadora 3D']];
const roscoDis = () => { const v = +localStorage.getItem('ac_rosco'); return v >= 1 && v <= 5 ? v : 2; };
function roscoCss() { if (document.getElementById('rosco132css')) return; const st = document.createElement('style'); st.id = 'rosco132css'; st.textContent = `
#rosco132{position:fixed;inset:0;z-index:60;overflow:hidden;font-family:Montserrat,system-ui,sans-serif;color:#fff;user-select:none;transition:opacity .25s}
#rosco132.flash{opacity:0;pointer-events:none}
#rosco132 .fondo{position:absolute;inset:0}
#rosco132 .fl{position:absolute;font-weight:900;color:#fff;pointer-events:none}
#rosco132 .ring{position:absolute;left:50%;top:47%;width:0;height:0;transition:transform .3s}
#rosco132.kbon .ring{transform:translateY(-9vh) scale(.78)}
#rosco132.kbon:not(.d2) .ring{transform:translateY(-14vh) scale(.68)}#rosco132.kbon:not(.d2) .fig{transform:translateX(-50%) translateY(-12vh) scale(.7)!important}
#rosco132.kbon:not(.d2) .ring{transform:translateY(-14vh) scale(.68)}#rosco132.kbon:not(.d2) .fig{transform:translateX(-50%) translateY(-12vh) scale(.7)!important}
#rosco132 .b{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;transition:transform .25s,box-shadow .25s,filter .25s}
#rosco132 .b.cur{transform:scale(1.28);filter:brightness(1.45);box-shadow:0 0 1.6vh 0.5vh #fff8,0 0 3vh 1vh #7fd0ff}
#rosco132 .def{position:absolute;text-align:center;font-weight:800;text-transform:uppercase;text-shadow:0 .2vh .5vh #0009}
#rosco132 .etq{display:block;font-size:.72em;color:#ffe25a;margin-bottom:.6vh;letter-spacing:.05em}
#rosco132 .resp{display:flex;gap:.6vh;justify-content:center;margin-top:1.4vh}
#rosco132 .resp i{width:3.6vh;height:4.6vh;border-radius:.6vh;background:#fff;color:#103080;font:900 3vh/4.6vh Montserrat,system-ui;font-style:normal}
#rosco132 .resp i.cur{outline:.4vh solid #ffd23a}#rosco132 .resp i.ok{background:#3ad15a;color:#fff}#rosco132 .resp i.bad{background:#e8343a;color:#fff}
#rosco132 .kb{position:absolute;left:18%;right:18%;bottom:1vh;display:none;flex-wrap:wrap;justify-content:center;gap:.7vh}
#rosco132.kbon .kb{display:flex}
#rosco132.kbon:not(.d2) .def{bottom:22vh!important;font-size:2.3vh!important;width:52vw!important;z-index:2}
#rosco132.d2 .kb{left:28%;right:28%;gap:.5vh}#rosco132.d2 .kb button{min-width:8.6%;height:5vh;font-size:2.5vh}
#rosco132 .kb button{min-width:6.6%;height:5.6vh;border:0;border-radius:.8vh;background:#fff;color:#0d2a80;font:900 2.8vh Montserrat,system-ui;box-shadow:0 .4vh 0 #0006}
#rosco132 .btn{position:absolute;bottom:5vh;width:20vw;height:6.6vh;border:.45vh solid #fff;font:700 3.2vh Montserrat,system-ui;color:#fff;box-shadow:0 0 0 .3vh #0003,0 .6vh 1.2vh #0005}
#rosco132 .naran{position:absolute;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffd08a,#ff8a1a 45%,#d45a00);border:.4vh solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:900;box-shadow:0 .5vh 1vh #0006}
#rosco132 .quien{position:absolute;right:2vw;bottom:24vh;max-width:30vw;padding:.4vh 2vh;border-radius:3vh;background:#0008;font:800 2.4vh Montserrat,system-ui}
`; document.head.appendChild(st); }
// bola de letra según el diseño y el estado (0 pendiente / 3 pasada: azul · 1 acierto: verde · 2 fallo: rojo)
const ROS_BOLA = { glossy: ['radial-gradient(circle at 35% 28%,#d6e6ff 0,#5c8ef0 18%,#1846b8 52%,#071a5c 100%)', 'radial-gradient(circle at 35% 28%,#e6ffe6 0,#5ee06a 18%,#14a02a 52%,#06520f 100%)', 'radial-gradient(circle at 35% 28%,#ffe2e2 0,#ff6a6a 18%,#d01818 52%,#6a0505 100%)'],
  plano: ['#0d3c96', '#22b14c', '#e0262e'] };
function roscoBola(dis, e) { const s = e === 3 ? 0 : e; if (dis === 1) return `background:${ROS_BOLA.plano[s]};border:.35vh solid #5fb4ff;box-shadow:0 0 .8vh #0a2a7a`;
  if (dis === 3 || dis === 4) return `background:${s === 0 ? ROS_BOLA.glossy[0] : ROS_BOLA.glossy[s]};border:.35vh solid #fff;box-shadow:0 0 0 .3vh ${s === 0 ? '#0d3a9a' : s === 1 ? '#0b6e1c' : '#7a0a0a'},0 .3vh .6vh #0007`;
  return `background:${ROS_BOLA.glossy[s]};border:.4vh solid #dfe8ff;box-shadow:0 0 0 .25vh #0a2266,0 .4vh .8vh #0008`; }
// figuras inventadas (sin caras reales): concursante maniquí del juego y presentadora 3D inventada
const SVG_CONC = '<svg viewBox="0 0 200 260" style="width:100%;height:100%"><defs><radialGradient id="rcA" cx=".38" cy=".3"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c2d6"/></radialGradient><linearGradient id="rcB" x1="0" x2="1"><stop offset="0" stop-color="#ffb21a"/><stop offset="1" stop-color="#d07a00"/></linearGradient></defs><ellipse cx="100" cy="62" rx="38" ry="44" fill="url(#rcA)"/><path d="M28 260 C30 170 52 128 100 124 C148 128 170 170 172 260 Z" fill="url(#rcB)"/><path d="M78 124 L100 160 L122 124" fill="#fff" opacity=".85"/><circle cx="132" cy="200" r="16" fill="#ff8a1a" stroke="#fff" stroke-width="3"/></svg>';
const SVG_PRES = '<svg viewBox="0 0 220 300" style="width:100%;height:100%"><defs><radialGradient id="rpS" cx=".4" cy=".35"><stop offset="0" stop-color="#ffe0c8"/><stop offset="1" stop-color="#d9a283"/></radialGradient><linearGradient id="rpH" x1="0" x2="1"><stop offset="0" stop-color="#7a3d1c"/><stop offset=".5" stop-color="#a65a2a"/><stop offset="1" stop-color="#6a3216"/></linearGradient><linearGradient id="rpC" x1="0" x2="1"><stop offset="0" stop-color="#e9edf2"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#d5dbe3"/></linearGradient></defs>'
  + '<path d="M62 70 C60 20 160 20 158 70 L164 128 C150 136 140 120 138 104 L82 104 C80 120 70 136 56 128 Z" fill="url(#rpH)"/><rect x="98" y="118" width="24" height="26" fill="#e8b494"/><ellipse cx="110" cy="80" rx="34" ry="42" fill="url(#rpS)"/><path d="M76 66 C84 40 132 34 146 70 C130 52 100 50 76 66 Z" fill="url(#rpH)"/>'
  + '<ellipse cx="97" cy="80" rx="5" ry="3.4" fill="#4a2a1a"/><ellipse cx="123" cy="80" rx="5" ry="3.4" fill="#4a2a1a"/><path d="M90 71 q7 -4 14 0 M116 71 q7 -4 14 0" stroke="#5a3218" stroke-width="2.4" fill="none"/><path d="M110 84 l-3 12 h6" stroke="#c4886a" stroke-width="2" fill="none"/><path d="M100 104 q10 6 20 0 q-10 3 -20 0" fill="#c8484e"/>'
  + '<path d="M30 300 C34 190 60 150 110 142 C160 150 186 190 190 300 Z" fill="url(#rpC)"/><path d="M96 142 L110 176 L124 142" fill="#e8b494"/><path d="M92 146 Q110 186 128 146" stroke="#5a3a28" stroke-width="3" fill="none" stroke-dasharray="3 3"/><path d="M110 176 V300" stroke="#c9cfd8" stroke-width="2"/><circle cx="110" cy="200" r="3" fill="#c9cfd8"/><circle cx="110" cy="232" r="3" fill="#c9cfd8"/><circle cx="110" cy="264" r="3" fill="#c9cfd8"/></svg>';
function roscoPon(dis = roscoDis()) { roscoQuita(); roscoCss(); ROS.d = dis; const d = document.createElement('div'); d.id = 'rosco132'; d.className = 'd' + dis; const L = V131.rosco;
  const fondo = { 1: 'radial-gradient(ellipse at 50% 40%,#3aa8ff 0,#0d6ee8 45%,#0646b0 100%)', 2: 'radial-gradient(ellipse at 50% 45%,#3fd0ff 0,#12a8ee 40%,#0a7ed4 100%)', 3: 'linear-gradient(160deg,#1a6af0,#0a3fb4 60%,#0a2f8a)', 4: 'linear-gradient(160deg,#1a6af0,#0a3fb4 60%,#0a2f8a)', 5: 'linear-gradient(170deg,#2a64c8,#123a8a 70%,#0c2a66)' }[dis];
  const rnd = (k, m) => { const x = Math.sin(k * 12.9898 + m * 78.233) * 43758.5453; return x - Math.floor(x); };
  let fl = ''; const nfl = dis === 2 ? 22 : dis === 1 ? 0 : 46, ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let k = 0; k < nfl; k++) fl += `<span class="fl" style="left:${rnd(k, 1) * 96}%;top:${rnd(k, 2) * 94}%;font-size:${dis === 2 ? 3 + rnd(k, 3) * 7 : 3 + rnd(k, 3) * 6}vh;opacity:${dis === 2 ? 0.05 + rnd(k, 4) * 0.1 : 0.12 + rnd(k, 4) * 0.3};${dis >= 3 ? 'color:' + (k % 3 ? '#cfe0ff' : '#0a2a7a') + ';' : ''}">${ABC[Math.floor(rnd(k, 5) * 26)]}</span>`;
  if (dis === 5) fl += '<span class="fl" style="left:1%;top:4%;font-size:15vh;letter-spacing:-.04em;color:#e8eef8;opacity:.85;text-shadow:0 .6vh 1vh #0005;font-family:system-ui;font-weight:800">apalabra</span>';
  if (dis === 3 || dis === 4) fl += '<span class="fl" style="left:-2%;top:6%;font-size:18vh;color:#fff;opacity:.9;text-shadow:0 0 0 #000,.6vh .6vh 0 #2a62d0;font-family:system-ui">ra</span>';
  // geometría del anillo
  const G = { 1: { rx: 46, ry: 42, sz: 5.6, fs: 3 }, 2: { rx: 36, ry: 36, sz: 6.6, fs: 3.8 }, 3: { rx: 34, ry: 38, sz: 6, fs: 3.3 }, 4: { rx: 34, ry: 38, sz: 6, fs: 3.3 }, 5: { rx: 41, ry: 44, sz: 8, fs: 4 } }[dis];
  const bolas = L.map(([l], k) => { const a = (k + 0.5) / L.length * Math.PI * 2 - Math.PI / 2;
    return `<div class="b" data-k="${k}" style="left:${Math.cos(a) * G.rx - G.sz / 2}vh;top:${Math.sin(a) * G.ry - G.sz / 2}vh;width:${G.sz}vh;height:${G.sz}vh;font-size:${G.fs}vh;${dis === 1 ? 'color:#d8ecff' : 'text-shadow:0 .2vh .3vh #0008'}">${l}</div>`; }).join('');
  let cen = '', extra = '';
  if (dis === 2) cen = `<div class="def" style="left:50%;top:47%;transform:translate(-50%,-50%);width:44vh;font-size:2.9vh;line-height:1.25"></div>`;
  else cen = `<div class="fig" style="position:absolute;left:50%;top:${dis === 5 ? 10 : 14}vh;transform:translateX(-50%);width:${dis === 5 ? 44 : 40}vh;height:${dis === 5 ? 90 : 72}vh;opacity:.96">${dis === 5 ? SVG_PRES : SVG_CONC}</div><div class="def" style="left:50%;bottom:${dis === 5 ? 2 : 3}vh;transform:translateX(-50%);width:62vw;padding:1vh 2vh;border-radius:1.4vh;background:#06205cd0;border:.3vh solid #8fc4ff;font-size:2.6vh;line-height:1.2"></div>`;
  if (dis === 1) extra = '<div style="position:absolute;left:2vw;top:3vh;font:800 3.6vh Montserrat,system-ui;text-shadow:0 .2vh .4vh #0007">#RuedaLaLetra</div>'
    + '<div style="position:absolute;right:2vw;top:2vh;text-align:center;width:22vh"><div style="margin:0 auto;width:10vh;height:5vh;border-radius:5vh 5vh 0 0;background:radial-gradient(circle at 50% 100%,#2a1a00 0 38%,#ffb01a 40% 62%,#3a1a5a 64%)"></div><div style="font:900 4.4vh/0.95 Montserrat,system-ui;color:#fff;text-shadow:0 .3vh 0 #2a1a5a,0 0 1vh #0008">¡AHORA<br>CAIGO!</div></div>'
    + '<div style="position:absolute;left:3vw;bottom:5vh;display:flex;align-items:center"><div class="cOk" style="padding:.6vh 2.4vh;border-radius:1.2vh;background:linear-gradient(#c070ff,#7a2ad0);border:.3vh solid #e8c8ff;font:900 4.4vh Montserrat,system-ui;margin-right:-1vh">0</div><div class="cT" style="width:14vh;height:14vh;border-radius:50%;background:radial-gradient(circle at 40% 35%,#6ad0ff,#1a78d8 60%,#0a4aa0);border:1.2vh solid #2ad04a;box-shadow:0 0 0 .4vh #0a6a20,0 .6vh 1.2vh #0007;display:flex;align-items:center;justify-content:center;font:900 5.4vh Montserrat,system-ui">0</div></div>';
  if (dis === 2) extra = '<button class="btn bC" style="left:7vw;background:linear-gradient(#2a9a3a,#0c6a1a)">Contestar</button><button class="btn bP" style="right:7vw;background:linear-gradient(#e83030,#a80c0c)">Pasar</button>'
    + '<div class="naran cT" style="left:3vw;bottom:15vh;width:11vh;height:11vh;font-size:4.2vh"></div><div class="naran cOk" style="left:calc(3vw + 12vh);bottom:15vh;width:9vh;height:9vh;font-size:3.6vh"></div>';
  if (dis === 3) extra = '<div style="position:absolute;left:3vw;bottom:9vh;display:flex;flex-direction:column;align-items:center"><div class="cT" style="padding:.2vh 1.4vh;border-radius:1vh 1vh 50% 50%;background:linear-gradient(#ffb04a,#f07a10);border:.35vh solid #fff;font:900 3.6vh Montserrat,system-ui;margin-bottom:-1vh;z-index:1">0</div><div class="naran cOk" style="position:relative;width:12vh;height:12vh;font-size:4.6vh"></div></div>';
  if (dis === 4) extra = '<div style="position:absolute;left:3vw;bottom:5vh;display:flex;flex-direction:column;align-items:center;gap:1vh"><div class="naran cOk" style="position:relative;width:13vh;height:13vh;font-size:5vh"></div><div class="cT" style="width:14vh;padding:.4vh 0;text-align:center;border-radius:.8vh;background:linear-gradient(#ffa040,#e06a00);border:.4vh solid #fff;font:900 4vh Montserrat,system-ui;box-shadow:0 .4vh .8vh #0006">0</div></div>';
  if (dis === 5) extra = '<button class="bPausa" style="position:absolute;right:2vw;top:2vh;width:12vh;height:12vh;border-radius:1.4vh;border:.4vh solid #c8d8ff;background:linear-gradient(#3a7af0,#0c2a9a);color:#fff;font:800 2.4vh Montserrat,system-ui;box-shadow:0 .5vh 1vh #0007">Pausa<br><b style="font-size:4.6vh;letter-spacing:.3vh">II</b></button>'
    + '<button class="naran bP" style="right:2vw;top:22vh;width:16vh;height:16vh;font-size:2.7vh;line-height:1.1;color:#fff;text-shadow:0 .2vh .3vh #0007">PASA<br>PALABRA</button>'
    + '<div class="naran cT" style="left:3vw;bottom:14vh;width:11vh;height:11vh;font-size:4.2vh"></div><div class="naran cOk" style="left:3vw;bottom:2vh;width:10vh;height:10vh;font-size:3.8vh"></div>';
  d.innerHTML = `<div class="fondo" style="background:${fondo}">${fl}</div>${dis !== 2 ? cen : ''}<div class="ring">${bolas}</div>${dis === 2 ? cen : ''}${extra}<div class="quien"></div><div class="kb"></div>`;
  document.body.appendChild(d); ROS.el = d; ROS.pausa = false;
  const bp = d.querySelector('.bP'); bp && (bp.onclick = ev => { ev.stopPropagation(); Ke.__ar && Ke.__ar.pasa && Ke.__ar.pasa(); });
  const bc = d.querySelector('.bC'); bc && (bc.onclick = ev => { ev.stopPropagation(); Ke.__ar && Ke.__ar.escribe && d.classList.add('kbon'); });
  const pz = d.querySelector('.bPausa'); pz && (pz.onclick = ev => { ev.stopPropagation(); ROS.pausa = !ROS.pausa; pz.style.filter = ROS.pausa ? 'brightness(1.5)' : ''; });
  return d; }
function roscoQuita() { ROS.el && ROS.el.remove(); ROS.el = null; }
function roscoPinta(P, quien, cur, q) { const d = ROS.el; if (!d) return; const p = P[quien];
  d.querySelectorAll('.b').forEach((b, k) => { b.style.cssText = b.style.cssText.replace(/background:[^;]*;?|border:[^;]*;?|box-shadow:[^;]*;?/g, '') + roscoBola(ROS.d, p.e[k]); b.classList.toggle('cur', k === cur); });
  d.querySelector('.quien').textContent = `🎡 ${za(p.nom)} · ✔ ${p.ok} ✘ ${p.mal}   ·   ${za(P[quien === 'me' ? 'bot' : 'me'].nom)} ✔ ${P[quien === 'me' ? 'bot' : 'me'].ok}`;
  d.querySelectorAll('.cOk').forEach(x => x.textContent = p.ok);
  if (q !== undefined) { const df = d.querySelector('.def'); df.innerHTML = q ? `<span class="etq">${q.etiqueta}</span>${q.texto}<div class="resp">${q.celdas.map((c, k) => `<i class="${c.cls || ''}${k === q.celdas.findIndex(x => !x.l) && !c.cls ? ' cur' : ''}">${c.l ? za(c.l) : ''}</i>`).join('')}</div>` : ''; } }
function roscoReloj(t) { ROS.el && ROS.el.querySelectorAll('.cT').forEach(x => { x.textContent = Math.ceil(t); x.style.color = t < 10 ? '#ffe04a' : '#fff'; }); }
function roscoTrampilla() { try { const st = Xe.studio; ROS.el && ROS.el.classList.add('flash'); st.setHoleColor(0, 16719904); sfx128('boom'); Xe.shake = Math.max(Xe.shake || 0, 0.3); setTimeout(() => { st.setHoleColor(0, 16777215); ROS.el && ROS.el.classList.remove('flash'); }, 900); } catch (e) { } }
function pasa131() { // frase corta del presentador al decir «Pasapalabra» (con su voz original si está activada)
  let vk, nom = me.presentador; if (Ke.__AR) vk = 'tano'; else { const p = presActivo(); vk = p && PRES130[p.vk] && PRES130[p.vk].pasa ? p.vk : 'adr'; }
  const L = vk === 'tano' || vk === 'adr' ? PASA131[vk] : PRES130[vk].pasa, t = L[Math.floor(Math.random() * L.length)];
  try { if (zn.enabled && VOZ130_ON()) stIndice().then(idx => { const h = _f(vk + '|' + t); if (idx[h] != null) { V130.log.push(nom + ': ' + t); F.playUrl(`${Us}voz/st/${h}.mp3`, 1, 'conc'); } }); } catch (e) { }
  return t; }
const roscoEtiq = l => (l === 'Ñ' || l === 'X' ? 'CONTIENE LA ' : 'EMPIEZA POR LA ') + l;
const roscoDef = d => d.replace(/^(Contiene la|Con la) [A-ZÑ]: */, '');
async function roscoDuelo(a, e, t = {}) {
  const n = a.c, { eng: i, hud: s, s: r } = n, l = i.opps[e - 1], W = Ke, sk = W.__botSkill ?? Kr(e, a.rodadas || 4), L = V131.rosco, N = L.length;
  try { n.panel.hideAll(0); } catch (x) { }
  nl(n, e); (!t.training || a.vidas > 0) && Pn(a.vidas, !!a.vidaExtra);
  const T0 = W.__duelClock || 100;
  const P = { me: { nom: Ke.__AR ? 'Vos' : 'Tú', e: Array(N).fill(0), k: 0, ok: 0, mal: 0, clk: T0 }, bot: { nom: me.rival(e), e: Array(N).fill(0), k: 0, ok: 0, mal: 0, clk: W.__botClock || T0 } };
  let turno = W.__meFirst === false ? 'bot' : W.__meFirst ? 'me' : (Math.random() < 0.5 ? 'me' : 'bot'), corre = false, ult = performance.now();
  const log = []; W.__ar = { id: 'rosco', log, P, clocks: { get me() { return P.me.clk; }, get bot() { return P.bot.clk; } }, get turno() { return turno; }, q: null, escribe: null, pasa: null };
  const vivo = w => P[w].clk > 0 && P[w].e.some(x => x === 0 || x === 3);
  const sig = w => { const p = P[w]; for (let j = 0; j < N; j++) { const k = (p.k + j) % N; if (p.e[k] === 0 || p.e[k] === 3) return k; } return -1; };
  const tick = setInterval(() => { const ahora = performance.now(), dt = Math.min(0.25, (ahora - ult) / 1000); ult = ahora; const p = P[turno]; if (corre && !(ROS.pausa && turno === 'me')) { const a0 = p.clk; p.clk = Math.max(0, p.clk - dt * cmdRate(turno)); if (a0 > 10 && p.clk <= 10) F.play('10', 1, 'clock'); if (a0 > 5 && p.clk <= 5) F.play('5', 1, 'clock'); } roscoReloj(p.clk); }, 100);
  const D = roscoPon(); let cur = -1;
  const pinta = q => roscoPinta(P, turno, cur, q);
  const turnoMe = async q => {
    let fin = null; const hueco = () => q.celdas.findIndex(c => !c.fija && !c.l);
    const escribe = x => { if (fin) return; if (x === '⌫') { const f = q.celdas.map((c, k) => !c.fija && c.l ? k : -1).filter(k => k >= 0).pop(); f >= 0 && (q.celdas[f].l = ''); } else if (x === 'PASO') { fin = 'pasa'; return; } else { D.classList.add('kbon'); const k = hueco(); if (k >= 0) q.celdas[k].l = x; F.play('saltar', 0.5); }
      pinta(q); if (q.celdas.every(c => c.fija || c.l)) fin = q.celdas.every(c => c.fija || c.l === c.sol) ? 'ok' : 'mal'; };
    W.__ar.escribe = escribe; W.__ar.pasa = () => escribe('PASO');
    const kd = ev => { if (ev.key === 'Backspace') escribe('⌫'); else if (ev.key === 'Escape') escribe('PASO'); else if (/^[a-zñA-ZÑ]$/.test(ev.key)) escribe(arNorm(ev.key)); };
    addEventListener('keydown', kd);
    const kb = D.querySelector('.kb'); kb.innerHTML = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('').map(x => `<button data-k="${x}">${x}</button>`).join('') + '<button data-k="⌫" style="min-width:12%">⌫</button>' + (ROS.d === 2 || ROS.d === 5 ? '' : '<button data-k="PASO" style="min-width:22%;background:#1e7bff;color:#fff">PASAPALABRA</button>');
    kb.querySelectorAll('button').forEach(b => b.onclick = ev => { ev.stopPropagation(); escribe(b.dataset.k); });
    if (ROS.d !== 2) D.classList.add('kbon'); pinta(q);
    try { await r.until(() => !!fin || P.me.clk <= 0); } finally { removeEventListener('keydown', kd); kb.innerHTML = ''; D.classList.remove('kbon'); W.__ar.escribe = null; W.__ar.pasa = null; }
    return fin || 'tiempo';
  };
  const turnoBot = async q => {
    pinta(q); He(l, 'habla', 1.2);
    const f = W.__botForce, pOk = f === 'win' ? 1 : f === 'fail' ? 0 : ai(0.55, 0.88, sk), res = Math.random() < pOk ? 'ok' : (f === 'fail' || Math.random() < 0.45 ? 'mal' : 'pasa');
    const Dd = (res === 'pasa' ? ai(3, 1.5, sk) : ai(5, 2.2, sk)) * Ui(0.7, 1.3) * (f === 'win' ? 0.5 : 1); const t0 = performance.now();
    await r.until(() => P.bot.clk <= 0 || performance.now() - t0 >= Dd * 1000); if (P.bot.clk <= 0) return 'tiempo';
    if (res === 'pasa') return 'pasa';
    const hs = q.celdas.filter(c => !c.fija), malo = res === 'mal' ? Math.floor(Math.random() * hs.length) : -1;
    for (let j = 0; j < hs.length; j++) { const t1 = performance.now(), dd = ai(0.5, 0.22, sk) * 1000; await r.until(() => P.bot.clk <= 0 || performance.now() - t1 >= dd); if (P.bot.clk <= 0) return 'tiempo';
      hs[j].l = j === malo ? (hs[j].sol === 'A' ? 'E' : 'A') : hs[j].sol; F.play('saltar', 0.5); pinta(q); }
    return res;
  };
  try {
    s.say(turno === 'bot' ? `Empieza ${me.rival(e)}. ¡Cada uno con su rosco y su reloj!` : (Ke.__AR ? '¡Arrancás vos! Cada uno con su rosco y su reloj.' : '¡Empiezas tú! Cada uno con su rosco y su reloj.'), 2200, i.host.head, me.presentador, { voice: false });
    pinta(null); await r.w(1300);
    for (let paso = 0; paso < 400 && (vivo('me') || vivo('bot')); paso++) {
      if (!vivo(turno)) turno = turno === 'me' ? 'bot' : 'me';
      const p = P[turno], k = sig(turno); p.k = k; cur = k;
      const [letra, def, sol] = L[k], c = [...arNorm(sol)].map(ch => /[A-ZÑ]/.test(ch) ? { l: '', fija: false, sol: ch } : { l: ch, fija: true, sp: true });
      const q = { texto: roscoDef(def), etiqueta: roscoEtiq(letra), celdas: c, resp: sol }; W.__ar.q = q; W.__ar.letra = letra;
      pinta(q); F.play('SomPalavra@Gcpgt1');
      let lec = null; try { lec = Zt.leer(def, { delay: 150 }); } catch (x) { }
      { const t0 = performance.now(); await r.until(() => (!lec || !lec.leyendo) || performance.now() - t0 > 4000); }
      corre = true; ult = performance.now();
      const res = turno === 'me' ? await turnoMe(q) : await turnoBot(q);
      corre = false; try { Zt.stop(); } catch (x) { }
      const fig = turno === 'me' ? i.player : l, otro = turno === 'me' ? 'bot' : 'me';
      if (res === 'ok') { p.e[k] = 1; p.ok++; log.push(turno + '-ok'); c.forEach(x => x.cls = 'ok'); cur = -1; pinta(q); F.play('QuemFicaEmPé-Acerto'); sfx128('ding'); ze.aplauso(turno === 'me' ? 1.6 : 1.1, 0.5); He(fig, 'arriba', 1.2); await r.w(900); p.k = (k + 1) % N; continue; }
      if (res === 'mal') { p.e[k] = 2; p.mal++; log.push(turno + '-error'); c.forEach(x => { x.l = x.sol; x.cls = 'bad'; }); cur = -1; pinta(q); F.play('Erro'); await r.w(700); roscoTrampilla(); He(fig, 'lamenta', 1.4); s.toast(`✘ Era ${za(sol)}`, 1300); await r.w(1300); }
      else if (res === 'pasa') { p.e[k] = 3; log.push(turno + '-pasa'); cur = -1; pinta(q); F.play('SomPalavra@Teclado27'); s.say(pasa131(), 1700, i.host.head, me.presentador, { voice: false }); await r.w(1500); }
      else { F.stopTag('clock'); log.push(turno + '-tiempo'); F.play('DropM.mp3'); ze.ooh(0.6); s.toast('⏱ ¡Se acabó el tiempo!', 1300); await r.w(1400); }
      p.k = (k + 1) % N; if (vivo(otro)) turno = otro;
    }
    const { me: A, bot: B } = P; cur = -1; turno = 'me'; pinta(null);
    s.toast(`🎡 ${za(A.nom)} ${A.ok} · ${za(B.nom)} ${B.ok}`, 2200); await r.w(2300);
    return A.ok > B.ok || (A.ok === B.ok && A.mal <= B.mal) ? 'win' : 'lose';
  } finally {
    corre = false; clearInterval(tick); F.stopTag('clock'); try { Zt.stop(); } catch (x) { } il(n); Ot.duel(i, e); roscoQuita();
  }
}
// Opciones › Diseño del Rosco
function filaRosco132() { const r = document.createElement('div'); r.className = 'orow'; r.id = 'rowRosco132'; r.style.cssText = 'flex-wrap:wrap;gap:6px'; const lb = document.createElement('label'); lb.textContent = '🎡 Diseño del Rosco'; lb.style.cssText = 'flex:1 1 100%'; r.appendChild(lb);
  for (const [v, tx] of ROSCO_DIS) { const b = document.createElement('button'); b.className = 'tbtn' + (roscoDis() === v ? ' sel' : ''); b.textContent = v + ' · ' + tx; b.style.cssText = 'flex:1 1 30%;font-size:13px;padding:6px 4px'; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem('ac_rosco', v); r.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; r.appendChild(b); }
  return r; }
{ const fc = filaCopro; filaCopro = function () { const d = fc(); const o = d.querySelector('#opt128'); (o || d).appendChild(filaRosco132()); return d; }; }
// ---- LA MEMORIA: 4 dibujos se ven 2,5 s en grande y luego se pregunta por uno
function memoriaMuestra(items, pos) { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;right:0;top:18%;z-index:46;text-align:center;pointer-events:none;transition:opacity .4s';
  d.innerHTML = '<div style="display:inline-flex;gap:14px;padding:12px 18px;border-radius:18px;background:#0a1a4aee;border:3px solid #ffd23a;box-shadow:0 0 24px #ffd23a88">' + items.map((x, k) => `<div style="font-size:min(14vw,72px);line-height:1.1">${x[0]}<div style="font:900 18px Montserrat,system-ui;color:#ffd23a">${k + 1}</div></div>`).join('') + '</div>';
  document.body.appendChild(d); sfx128('ding'); setTimeout(() => d.style.opacity = '0', 2500); setTimeout(() => d.remove(), 3000); }
AR_GEN.memoria = () => { const it = mA(V131.memoria.slice()).slice(0, 4), pos = Math.floor(Math.random() * 4), p = it[pos]; memoriaMuestra(it, pos);
  return { texto: '¿Qué dibujo estaba en la posición ' + (pos + 1) + '?', etiqueta: 'LA MEMORIA · MIRA BIEN', celdas: arHuecos(p[1], Math.random() < 0.5 ? 0 : 1), resp: p[1], modo: 'huecos', lee: 'Memoria. ¿Qué dibujo estaba en la posición ' + (pos + 1) + '?' }; };
// ---- CUENTAS DE TRAMPILLA: cuenta aleatoria; el resultado se escribe en letras
const NUM131 = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE'];
const DEC131 = { 30: 'TREINTA', 40: 'CUARENTA', 50: 'CINCUENTA', 60: 'SESENTA', 70: 'SETENTA', 80: 'OCHENTA', 90: 'NOVENTA' };
const numLetras = n => n <= 20 ? NUM131[n] : n < 30 ? 'VEINTI' + NUM131[n - 20].replace('DOS', 'DOS').replace('TRES', 'TRES').replace('SEIS', 'SEIS') : DEC131[n - n % 10] + (n % 10 ? ' Y ' + NUM131[n % 10] : '');
AR_GEN.cuentas = () => { let a, b, op, r; do { const t = Math.floor(Math.random() * 3); if (t === 0) { a = 2 + Math.floor(Math.random() * 8); b = 2 + Math.floor(Math.random() * 8); op = '×'; r = a * b; } else if (t === 1) { a = 10 + Math.floor(Math.random() * 50); b = 5 + Math.floor(Math.random() * 30); op = '+'; r = a + b; } else { a = 30 + Math.floor(Math.random() * 60); b = 5 + Math.floor(Math.random() * 25); op = '−'; r = a - b; } } while (r > 99 || r < 0);
  const w = numLetras(r); return { texto: `${a} ${op} ${b} = ?`, etiqueta: 'CUENTAS DE TRAMPILLA · EN LETRAS', celdas: arHuecos(w, 0), resp: w, modo: 'huecos', lee: `${a} ${op === '×' ? 'por' : op === '+' ? 'más' : 'menos'} ${b}` }; };
// ---- LA INTRUSA y EL PRECIO: motor de «Entre dos» con sus propias listas (3 y 2 opciones)
function e2Con(lista) { return async (a, e, t = {}) => { const bak = AR_DATOS.entredos; AR_DATOS.entredos = lista; arUsadas.e2 = new Set(); try { return await arEntreDos(a, e, t); } finally { AR_DATOS.entredos = bak; arUsadas.e2 = new Set(); } }; }
const LISTA_INTRUSA = V131.intrusa.map(([x, y, z, c]) => ({ q: '¿Cuál es la intrusa?', o: [x, y, z], c: 'LA INTRUSA · ' + c.toUpperCase() }));
const LISTA_PRECIO = V131.precio.map(([q, si, no]) => ({ q: q + ': ¿cuánto cuesta?', o: [si, no], c: 'EL PRECIO DE LA TRAMPILLA' }));
Object.assign(cu, {
  rosco: { ar: true, titulo: V131.titulos.rosco, lista: true, dicho: V131.dichos.rosco, jugar: (a, e, t) => roscoDuelo(a, e, t) },
  memoria: { ar: true, titulo: V131.titulos.memoria, lista: true, dicho: V131.dichos.memoria, jugar: (a, e, t) => arDuelo(a, e, t, 'memoria') },
  cuentas: { ar: true, titulo: V131.titulos.cuentas, lista: true, dicho: V131.dichos.cuentas, jugar: (a, e, t) => arDuelo(a, e, t, 'cuentas') },
  intrusa: { ar: true, titulo: V131.titulos.intrusa, lista: true, dicho: V131.dichos.intrusa, jugar: e2Con(LISTA_INTRUSA) },
  precio: { ar: true, titulo: V131.titulos.precio, lista: true, dicho: V131.dichos.precio, jugar: e2Con(LISTA_PRECIO) },
});
AR_IDS.push(...P131); P128.push(...P131); cmdEnvuelve();
window.__v131 = { P131, ROS, roscoPon, roscoQuita, pasa131, numLetras, arActivar: on => arActivar(on) };
