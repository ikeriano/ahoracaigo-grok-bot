// ===================================================================================================
// v1.23 · ¡AHORA CAIGO! ARGENTINA (versión de eltrece): 6 pruebas nuevas con los gráficos del programa argentino
//   ABC · ¿QUÉ VES? · ¡CANTALA BIEN! · LA ESCONDIDA · ENTRE DOS · ASOCIADAS
// Barra inferior azul-violeta redondeada, reloj en píldora amarilla (izquierda = central, derecha = oponente),
// etiqueta dorada de categoría, texto blanco condensado, casillas blancas con letras oscuras y botones azules.
// Se mezclan en el Programa completo (junto a TODAS las pruebas españolas, Clásico incluido) y forman el
// modo «AHORA CAIGO ARGENTINA» (presentador inventado con voseo y concursantes argentinos).
// Preguntas: src/argentina_datos.js. Tipografías libres (OFL): Barlow Condensed y Orbitron (assets/fonts).
// ===================================================================================================
const AR_IDS = ['abc', 'queves', 'cantala', 'escondida', 'entredos', 'asociadas'];
const arNorm = s => String(s).toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0001/g, 'Ñ');
const arLetras = s => arNorm(s).replace(/[^A-ZÑ]/g, '');
const arMezcla = a => { const b = a.slice(); for (let k = 0; k < 30; k++) { mA(b); if (b.join('|') !== a.join('|') || a.length < 2) break; } return b; };
const arUsadas = {};
function arSaca(lista, k) { const u = arUsadas[k] || (arUsadas[k] = new Set()); u.size >= lista.length && u.clear(); let i; do i = Math.floor(Math.random() * lista.length); while (u.has(i)); u.add(i); return lista[i]; }
function arCss() {
  if (document.getElementById('arCss')) return;
  const st = document.createElement('style'); st.id = 'arCss';
  st.textContent = `
@font-face{font-family:'ARBarlow';src:url(assets/fonts/BarlowCondensed-SemiBold.ttf);font-weight:600}
@font-face{font-family:'ARBarlow';src:url(assets/fonts/BarlowCondensed-Bold.ttf);font-weight:700}
@font-face{font-family:'AROrbi';src:url(assets/fonts/Orbitron-VariableFont_wght.ttf);font-weight:400 900}
@keyframes arZoom{from{transform:scale(1.15);opacity:0}to{transform:scale(1);opacity:1}}
.arMbtn .arMlogo{width:84px;height:48px;object-fit:cover;border-radius:8px;margin-right:10px;flex:none}
.arMenu .arMcab{display:block;width:min(360px,80%);margin:0 auto 6px;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.5)}
.arMenu h2{color:#ffe14a}
.logo .arBig{width:min(560px,90%);height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:22px;box-shadow:0 10px 30px rgba(0,0,0,.55);-webkit-mask-image:radial-gradient(ellipse 72% 78% at 50% 50%,#000 70%,transparent 100%);mask-image:radial-gradient(ellipse 72% 78% at 50% 50%,#000 70%,transparent 100%)}
#arP{position:absolute;inset:0;z-index:12;pointer-events:none;font-family:'ARBarlow','Barlow Condensed','Roboto Condensed','Arial Narrow',sans-serif}
#arP *{box-sizing:border-box}
#arP .arBar{position:absolute;left:.3%;right:.3%;top:68%;bottom:-4%;border-radius:3.4vw 3.4vw 0 0;
 background:linear-gradient(90deg,rgba(40,170,255,.28) 0%,rgba(0,0,0,0) 9%,rgba(0,0,0,0) 86%,rgba(60,180,255,.5) 100%),
 linear-gradient(180deg,#3d2fc0 0%,#3233bd 6%,#2a5ad2 20%,#1f80e6 36%,#1268de 46%,#0844d0 62%,#1534c0 80%,#2b22a6 100%);
 box-shadow:inset 0 .25vh 0 rgba(190,185,255,.75),inset 0 -.2vh 0 rgba(120,110,255,.4),0 -.3vh 1.2vh rgba(0,0,40,.45);transform:translateY(110%);transition:transform .45s cubic-bezier(.2,1,.3,1)}
#arP.in .arBar{transform:none}
#arP .arClock{position:absolute;top:60.7%;height:8.5%;width:22.9%;left:4.9%;border-radius:999px;display:flex;align-items:center;justify-content:center;
 background:linear-gradient(180deg,#fff7a8 0%,#ffe95a 22%,#ffd51a 52%,#f2b800 80%,#ffd84a 100%);box-shadow:inset 0 -.5vh .6vh rgba(170,100,0,.55),inset 0 .4vh .4vh rgba(255,255,255,.7),0 .3vh .8vh rgba(0,0,0,.5);
 font-family:'AROrbi','Orbitron',sans-serif;font-weight:900;font-size:6.2vh;letter-spacing:.25vw;color:#050505;opacity:0;transition:opacity .25s,left .35s}
#arP.in .arClock{opacity:1}
#arP .arClock.der{left:72.4%}
#arP .arClock.low{color:#7a0000}
#arP .arLabel{position:absolute;left:50%;top:68.3%;height:5.6%;min-width:22%;padding:0 1.6vw;transform:translateX(-50%);border-radius:999px;display:none;align-items:center;justify-content:center;
 background:linear-gradient(180deg,#ffe79a 0%,#f8cf52 30%,#eeb52e 62%,#d99a1a 100%);box-shadow:inset 0 .3vh .3vh rgba(255,255,255,.6),inset 0 -.3vh .4vh rgba(140,80,0,.5);
 color:#2a1a06;font-weight:700;font-size:3.7vh;letter-spacing:.05vw;white-space:nowrap;text-transform:uppercase}
#arP .arLabel.on{display:flex}
#arP .arQ{position:absolute;left:4%;right:4%;top:74.5%;text-align:center;color:#fff;font-weight:600;font-size:4.9vh;line-height:1.08;text-shadow:0 .2vh .3vh rgba(0,0,60,.55)}
#arP.lab .arQ{top:76.6%}
#arP .arTiles{position:absolute;left:2%;right:2%;top:85.6%;display:flex;flex-wrap:wrap;justify-content:center;gap:.9vh .5vw}
#arP.notxt .arTiles{top:82%}
#arP .arT{width:3.25vw;height:8.4vh;background:linear-gradient(180deg,#ffffff 0%,#f6f9ff 70%,#dfe8f6 100%);display:flex;align-items:center;justify-content:center;color:#1b3550;font-weight:700;font-size:7vh;line-height:1;box-shadow:0 .15vh .2vh rgba(0,0,40,.35);transition:background .2s}
#arP .arT.sp{background:none;box-shadow:none;width:1.6vw}
#arP .arT.y{background:linear-gradient(180deg,#ffe95a 0%,#f5d81c 60%,#e2c000 100%)}
#arP .arT.cur{box-shadow:inset 0 -.6vh 0 #f5d81c,0 .15vh .2vh rgba(0,0,40,.35)}
#arP .arT.ok{background:linear-gradient(180deg,#d8ffd8,#8ef08e)}
#arP .arT.bad{background:linear-gradient(180deg,#ffd0d0,#ff7a7a)}
#arP .arT.puesta{background:linear-gradient(180deg,#fffbe0,#ffe98a)}
#arP .arW{display:flex;gap:.12vw;pointer-events:auto;cursor:pointer}
#arP .arW .arT{width:2.75vw;height:7.8vh;font-size:6.4vh}
#arP.cant .arTiles{top:76.5%;gap:1.6vh 1.3vw;left:6%;right:6%}
#arP.cant.lab .arTiles{top:78.5%}
#arP .esc .arT,#arP .arT.tap{pointer-events:auto;cursor:pointer}
#arP .arOpts{position:absolute;left:50%;top:83%;transform:translateX(-50%);display:flex;gap:.35vw}
#arP .arO{pointer-events:auto;width:28.6vw;height:7.4vh;border:.22vh solid #a6c4ff;background:linear-gradient(180deg,#0a52f0 0%,#0a3ed8 55%,#0832b8 100%);color:#fff;font-family:inherit;font-weight:600;font-size:5vh;letter-spacing:.03vw;text-transform:uppercase;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0 .6vw;white-space:nowrap;overflow:hidden}
#arP .arOpts.tres{top:80%}#arP .arOpts.tres .arO{width:26.4vw;height:11.6vh}
#arP .arO.ok{background:linear-gradient(180deg,#2ad04a,#0a8a2a)}#arP .arO.bad{background:linear-gradient(180deg,#ff4a3a,#b01010)}#arP .arO.right{border-color:#7aff8a}
#arP .arImg{position:absolute;left:33.2%;width:33.5%;top:30%;height:46%;border:.45vh solid #e8b84a;border-radius:1vh;overflow:visible;display:none;box-shadow:0 0 0 .2vh #8a5a10,0 .6vh 1.6vh rgba(0,0,0,.55);background:#000;z-index:2}
#arP .arImg canvas{width:100%;height:100%;display:block;border-radius:.6vh}
#arP .arImg .arLabel{top:-3.3vh;display:flex;min-width:68%}
#arP.ves .arImg{display:block}
#arP .arFloat{position:absolute;left:0;right:0;top:4%;height:52%;pointer-events:none}
#arP .arFloat span{position:absolute;color:#fff;font-weight:700;font-size:5.6vh;letter-spacing:.1vw;text-transform:uppercase;text-shadow:0 0 1.2vh #2a6aff,0 .3vh .4vh #000;animation:arFlota 6s ease-in-out infinite alternate;opacity:.95}
@keyframes arFlota{0%{transform:translate(0,0) rotate(-2deg)}50%{transform:translate(1.5vw,-2.5vh) rotate(1.5deg)}100%{transform:translate(-1.2vw,1.8vh) rotate(-1deg)}}
#arP .arKb{position:absolute;left:50%;top:1.2%;transform:translateX(-50%);display:none;flex-wrap:wrap;justify-content:center;gap:.5vh .3vw;width:62vw;pointer-events:auto;background:rgba(5,10,40,.55);padding:.6vh .5vw;border-radius:1vh}
#arP.kb .arKb{display:flex}
#arP .arKb button{width:3.6vw;height:5.4vh;border:0;border-radius:.6vh;background:#f4f6ff;color:#1b3550;font-family:inherit;font-weight:700;font-size:3.8vh;cursor:pointer;padding:0}
#arP .arKb button.w{width:9vw;background:#f5d81c}
#arP .arKb button.p{width:10vw;background:#0a3ed8;color:#fff}
`;
  document.head.appendChild(st);
}
// ---------- imágenes de «¿Qué ves?» (dibujadas en el momento: emojis del sistema sobre una escena; sin fotos de terceros)
function arDibujaImagen(it, w = 640, h = 480) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const [a, b] = it.bg || ['#5a7a9a', '#1a2a3a'];
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  // fondo desenfocado tipo foto (bokeh)
  let sd = 0; for (const ch of it.r) sd = (sd * 31 + ch.charCodeAt(0)) % 9973; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < 22; k++) { g.fillStyle = `rgba(255,255,255,${0.04 + rnd() * 0.08})`; g.beginPath(); g.arc(rnd() * w, rnd() * h * 0.7, 20 + rnd() * 70, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, h * 0.72, w, h * 0.28);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const em = it.e || ['❓'];
  g.font = `${Math.round(h * 0.5)}px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif`; { const sh = g.createRadialGradient(w * 0.5, h * 0.8, 10, w * 0.5, h * 0.8, w * 0.3); sh.addColorStop(0, 'rgba(0,0,0,.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, h * 0.6, w, h * 0.4); } g.fillStyle = '#000'; g.fillText(em[0], w * 0.5, h * 0.5);
  g.font = `${Math.round(h * 0.2)}px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif`;
  const pos = [[0.18, 0.26], [0.82, 0.3], [0.2, 0.78], [0.8, 0.78]];
  em.slice(1, 5).forEach((x, k) => g.fillText(x, w * pos[k][0], h * pos[k][1]));
  const v = g.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  return c;
}
// ---------- HUD
function arHud(id) {
  arCss(); document.getElementById('arP')?.remove();
  const d = document.createElement('div'); d.id = 'arP'; d.className = 'ui ' + id;
  d.innerHTML = '<div class="arFloat"></div><div class="arBar"></div><div class="arClock">30:00</div><div class="arLabel"></div><div class="arQ"></div><div class="arTiles"></div><div class="arOpts"></div><div class="arImg"><canvas></canvas><div class="arLabel"></div></div><div class="arKb"></div>';
  document.getElementById('hud').appendChild(d); requestAnimationFrame(() => d.classList.add('in'));
  const q = s => d.querySelector(s);
  const H = {
    d, q,
    reloj(t, lado) { const c = q('.arClock'); c.textContent = zi(t); c.classList.toggle('der', lado === 'bot'); c.classList.toggle('low', t < (H.bajo ?? 5)); },
    etiqueta(t) { const l = q(':scope>.arLabel'); l.textContent = t || ''; l.classList.toggle('on', !!t); d.classList.toggle('lab', !!t); },
    texto(t) { q('.arQ').textContent = t || ''; d.classList.toggle('notxt', !t); },
    limpia() { q('.arTiles').innerHTML = ''; q('.arOpts').innerHTML = ''; q('.arOpts').className = 'arOpts'; },
    casillas(celdas, cur = -1) { q('.arTiles').className = 'arTiles'; q('.arTiles').innerHTML = celdas.map((c, k) => `<div class="arT${c.y ? ' y' : ''}${c.p ? ' puesta' : ''}${k === cur ? ' cur' : ''}${c.cls ? ' ' + c.cls : ''}${c.sp ? ' sp' : ''}" data-k="${k}">${c.l ? za(c.l) : ''}</div>`).join(''); },
    palabras(ws) { q('.arTiles').className = 'arTiles'; q('.arTiles').innerHTML = ws.map((w, k) => `<div class="arW${w.p ? ' puesta' : ''}" data-k="${k}">${[...w.t].map(ch => `<div class="arT${w.p ? ' puesta' : ''}${w.cls ? ' ' + w.cls : ''}">${za(ch)}</div>`).join('')}</div>`).join(''); },
    opciones(ops) { const o = q('.arOpts'); o.className = 'arOpts' + (ops.length > 2 ? ' tres' : ''); o.innerHTML = ops.map((x, k) => `<button class="arO" data-i="${k}">${za(x)}</button>`).join(''); return [...o.querySelectorAll('.arO')]; },
    imagen(it) { const cv = q('.arImg canvas'); const src = arDibujaImagen(it); cv.width = src.width; cv.height = src.height; cv.getContext('2d').drawImage(src, 0, 0); q('.arImg .arLabel').textContent = it.l; return src; },
    flotan(ts) { const f = q('.arFloat'); f.innerHTML = (ts || []).map((t, k) => `<span style="left:${[8, 60, 30, 72, 14, 46][k % 6]}%;top:${[8, 14, 46, 52, 70, 78][k % 6]}%;animation-delay:-${k * 1.3}s">${za(t)}</span>`).join(''); },
    teclado(on, fn) { d.classList.toggle('kb', !!on); const k = q('.arKb'); if (!on) { k.innerHTML = ''; return; } k.innerHTML = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('').map(x => `<button data-k="${x}">${x}</button>`).join('') + '<button class="w" data-k="⌫">⌫</button><button class="p" data-k="PASO">PASO</button>'; k.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); fn(b.dataset.k); }); },
    quita() { d.classList.remove('in'); setTimeout(() => d.remove(), 450); },
  };
  return H;
}
// ---------- preguntas de cada prueba en forma común: { texto, etiqueta, celdas, resp, modo:'huecos'|'orden', fichas }
function arHuecos(word, par) { // muestra letras alternas (A_T_R_ = ALTURA)
  const L = [...arNorm(word)]; let k = 0; return L.map(ch => { if (!/[A-ZÑ]/.test(ch)) return { l: ch, fija: true, sp: true }; const ver = (k++ % 2) === par; return { l: ver ? ch : '', fija: ver, sol: ch }; });
}
const AR_GEN = {
  abc() { const p = arSaca(AR_DATOS.abc, 'abc'); const c = arHuecos(p.r, 0); c[0].y = true; return { texto: p.q, etiqueta: p.c, celdas: c, resp: p.r, modo: 'huecos' }; },
  queves() { const p = arSaca(AR_DATOS.queves, 'qv'); return { texto: '', etiqueta: '', img: p, celdas: arHuecos(p.r, 0), resp: p.r, modo: 'huecos', lee: '¿Qué ves? ' + p.l }; },
  asociadas(G) { const p = G.preg[G.i++ % G.preg.length]; return { texto: p[0], etiqueta: G.concepto, celdas: arHuecos(p[1], Math.random() < 0.5 ? 0 : 1), resp: p[1], modo: 'huecos' }; },
  escondida() { const p = arSaca(AR_DATOS.escondida, 'esc'); const L = [...arLetras(p.r)]; return { texto: p.q, etiqueta: '', fichas: arMezcla(L), resp: p.r, modo: 'orden', unidad: 'letra' }; },
  cantala() { const p = arSaca(AR_DATOS.cantala, 'can'); const W = arNorm(p.v).replace(/[^A-ZÑ ]/g, '').split(/\s+/).filter(Boolean); return { texto: '', etiqueta: p.a, fichas: arMezcla(W), resp: W.join(' '), modo: 'orden', unidad: 'palabra', lee: 'Cantala bien: ' + p.a.toLowerCase() }; },
};
// ---------- duelo de relojes (ABC, ¿Qué ves?, La escondida, Asociadas, ¡Cantala bien!): 30 segundos cada uno
async function arDuelo(a, e, t = {}, id) {
  const n = a.c, { eng: i, hud: s, s: r } = n, l = i.opps[e - 1], W = Ke, sk = W.__botSkill ?? Kr(e, a.rodadas || 4);
  try { n.panel.hideAll(0); } catch (x) { }
  nl(n, e); (!t.training || a.vidas > 0) && Pn(a.vidas, !!a.vidaExtra);
  const H = arHud(id === 'cantala' ? 'cant' : id === 'queves' ? 'ves' : id), T0 = W.__duelClock || 30, clk = { me: T0, bot: W.__botClock || T0 };
  let turno = W.__meFirst === false ? 'bot' : W.__meFirst ? 'me' : (Math.random() < 0.5 ? 'me' : 'bot'), corre = false, ult = performance.now();
  const log = []; W.__ar = { id, log, clocks: clk, get turno() { return turno; }, q: null, escribe: null, pasa: null };
  const G = id === 'asociadas' ? (() => { const g = arSaca(AR_DATOS.asociadas, 'aso'); return { concepto: g.c, terminos: g.t, preg: mA(g.p.slice()), i: 0 }; })() : null;
  const pant = i.studio && i.studio.screenMats, pantOrig = pant ? pant.map(m => m.map) : null; let texPant = null;
  const tick = setInterval(() => { const ahora = performance.now(), dt = Math.min(0.25, (ahora - ult) / 1000); ult = ahora; if (corre) { const a0 = clk[turno]; clk[turno] = Math.max(0, clk[turno] - dt * cmdRate(turno)); if (a0 > 10 && clk[turno] <= 10) F.play('10', 1, 'clock'); if (a0 > 5 && clk[turno] <= 5) F.play('5', 1, 'clock'); } H.reloj(clk[turno], turno); }, 40);
  if (G) { H.flotan(G.terminos); H.etiqueta(''); H.texto(''); s.say('¿Qué tienen en común?', 2200, i.host.head, me.presentador, { voice: false }); F.play('saltar', 0.6); await r.w(2600); }
  const nueva = () => { const q = id === 'asociadas' ? AR_GEN.asociadas(G) : AR_GEN[id](); W.__ar.q = q; return q; };
  const pinta = (q, st) => {
    H.etiqueta(q.etiqueta); H.texto(q.texto); H.limpia();
    if (q.img) { const cv = H.imagen(q.img); if (pant) { texPant && texPant.dispose(); texPant = Vt(640, 480, g => g.drawImage(cv, 0, 0)); pant.forEach(m => { m.map = texPant; m.needsUpdate = true; }); } }
    if (q.modo === 'huecos') { const cur = q.celdas.findIndex(c => !c.fija && !c.l); H.casillas(q.celdas, st && st.on ? cur : -1); }
    else if (q.unidad === 'palabra') H.palabras(q.orden.map(w => ({ t: w.t, p: w.p })).concat(q.resto.map(w => ({ t: w }))));
    else H.casillas(q.orden.map(c => ({ l: c, p: true })).concat(q.resto.map(c => ({ l: c }))));
    if (q.modo === 'orden') H.q('.arTiles').querySelectorAll(q.unidad === 'palabra' ? '.arW' : '.arT').forEach(el => { el.classList.add('tap'); el.onclick = ev => { ev.stopPropagation(); W.__ar.escribe && W.__ar.escribe({ tap: +el.dataset.k }); }; });
  };
  const prep = q => { if (q.modo === 'orden') { q.orden = []; q.resto = q.fichas.slice(); } else q.celdas.forEach(c => { if (!c.fija) c.l = ''; }); };
  const completa = q => q.modo === 'huecos' ? q.celdas.every(c => c.fija || c.l) : q.resto.length === 0;
  const correcta = q => q.modo === 'huecos' ? q.celdas.every(c => c.fija || c.l === c.sol) : arLetras((q.unidad === 'palabra' ? q.orden.map(w => w.t) : q.orden).join(' ')) === arLetras(q.resp);
  const pon = (q, x) => { // x = letra o {tap:k}
    if (q.modo === 'huecos') { if (typeof x !== 'string') return; const k = q.celdas.findIndex(c => !c.fija && !c.l); if (k >= 0) q.celdas[k].l = x; return; }
    if (q.unidad === 'palabra') { const k = typeof x === 'object' ? x.tap - q.orden.length : -1; if (k >= 0 && k < q.resto.length) q.orden.push({ t: q.resto.splice(k, 1)[0], p: true }); return; }
    const k = typeof x === 'object' ? x.tap - q.orden.length : q.resto.indexOf(x); if (k >= 0 && k < q.resto.length) q.orden.push(q.resto.splice(k, 1)[0]);
  };
  const borra = q => { if (q.modo === 'huecos') { const f = q.celdas.map((c, k) => !c.fija && c.l ? k : -1).filter(k => k >= 0).pop(); f >= 0 && (q.celdas[f].l = ''); } else if (q.orden.length) { const u = q.orden.pop(); q.resto.unshift(q.unidad === 'palabra' ? u.t : u); } };
  const revela = (q, cls) => { if (q.modo === 'huecos') { q.celdas.forEach(c => { c.fija || (c.l = c.sol); c.sp || (c.cls = cls); }); H.casillas(q.celdas); } else if (q.unidad === 'palabra') H.palabras(arNorm(q.resp).split(' ').map(w => ({ t: w, cls }))); else H.casillas([...arLetras(q.resp)].map(c => ({ l: c, cls }))); };
  const leer = q => { const txt = q.lee || q.texto; try { return Zt.leer(txt, { delay: 250 }); } catch (x) { return null; } };
  const turnoMe = async q => {
    let fin = null; const st = { on: true };
    const escribe = x => { if (fin) return; if (x === '⌫') borra(q); else if (x === 'PASO') { fin = 'pasa'; return; } else { pon(q, x); F.play('saltar', 0.5); } pinta(q, st);
      if (completa(q)) { if (correcta(q)) fin = 'ok'; else { F.play('Erro'); ze.oohSuave && ze.oohSuave(); log.push('me-error'); revela(q, 'bad'); setTimeout(() => { prep(q); pinta(q, st); }, 450); } } };
    W.__ar.escribe = escribe; W.__ar.pasa = () => escribe('PASO');
    const kd = ev => { if (ev.key === 'Backspace') escribe('⌫'); else if (ev.key === 'Escape') escribe('PASO'); else if (/^[a-zñA-ZÑ]$/.test(ev.key)) escribe(arNorm(ev.key)); };
    addEventListener('keydown', kd); H.teclado(true, escribe); pinta(q, st);
    try { await r.until(() => !!fin || clk.me <= 0); } finally { removeEventListener('keydown', kd); H.teclado(false); W.__ar.escribe = null; }
    return fin || 'tiempo';
  };
  const turnoBot = async q => {
    pinta(q); He(l, 'habla', 1.6); s.say(Ua(Ke.__AR ? ['Mmm… a ver, che…', 'Uh, esta la tengo…', '¡Ya sé, ya sé!', 'Pará, pará…'] : ['Mmm…', 'A ver, a ver…', '¡Esta me la sé!']), 1600, l.head, me.rival(e), { voice: false });
    const atasco = Math.random() < (W.__botForce === 'fail' ? 1 : W.__botForce === 'win' ? 0 : ai(0.3, 0.08, sk)), D = ai(7, 2.6, sk) * Ui(0.7, 1.3) * (W.__botForce === 'win' ? 0.4 : 1);
    const espera = async sg => { const t0 = performance.now(); await r.until(() => clk.bot <= 0 || performance.now() - t0 >= sg * 1000); return clk.bot > 0; };
    if (atasco) { if (!await espera(ai(9, 5, sk) * Ui(0.8, 1.2))) return 'tiempo'; if (W.__botForce !== 'fail' && Math.random() < 0.7) { s.say('¡Paso!', 1200, l.head, me.rival(e), { voice: false }); log.push('bot-pasa'); return 'pasa'; } await espera(9999); return 'tiempo'; }
    if (!await espera(D)) return 'tiempo';
    const pasos = q.modo === 'huecos' ? q.celdas.filter(c => !c.fija).map(c => c.sol) : q.unidad === 'palabra' ? arNorm(q.resp).split(' ') : [...arLetras(q.resp)];
    for (const x of pasos) { if (!await espera(ai(0.6, 0.28, sk) * Ui(0.7, 1.3))) return 'tiempo'; if (q.modo === 'huecos') pon(q, x); else { const k = q.unidad === 'palabra' ? q.resto.indexOf(x) : q.resto.indexOf(x); pon(q, { tap: q.orden.length + k }); } F.play('saltar', 0.5); pinta(q); }
    return 'ok';
  };
  try {
    if (Ke.__AR && !t.training && Math.random() < 0.6) { s.say(arCharla(), 3000, i.host.head, me.presentador, { voice: false }); await r.w(3100); }
    s.say(turno === 'bot' ? `Empieza ${me.rival(e)}. ¡Cada uno con su reloj!` : (Ke.__AR ? '¡Arrancás vos! Cada uno con su reloj.' : '¡Empiezas tú! Cada uno tiene su reloj.'), 2000, i.host.head, me.presentador, { voice: false });
    await r.w(1100);
    for (let vuelta = 0; vuelta < 80; vuelta++) {
      const q = nueva(); prep(q); pinta(q); F.play('SomPalavra@Gcpgt1');
      if (q.img && i.studio.screenFocus) { // plano de la pantalla grande del plató, como en la tele (sin pantalla partida)
        const f = i.studio.screenFocus; il(n); H.d.style.visibility = 'hidden'; W.__arPlano = true;
        i.cut(Mo(0, f.y + 0.25, f.z + 2.9), Mo(0, f.y + 0.1, f.z)); i.glide(Mo(0, f.y + 0.2, f.z + 2.5), Mo(0, f.y + 0.1, f.z), 1.8);
        await r.w(1800); W.__arPlano = false; H.d.style.visibility = ''; nl(n, e); Ot.duel(i, e, 0.01);
      }
      const lec = leer(q); { const t0 = performance.now(); await r.until(() => (!lec || !lec.leyendo) || performance.now() - t0 > 4500); }
      corre = true; ult = performance.now();
      const res = turno === 'me' ? await turnoMe(q) : await turnoBot(q);
      try { Zt.stop(); } catch (x) { }
      if (res === 'ok') { corre = false; log.push(turno + '-ok'); revela(q, 'ok'); F.play('QuemFicaEmPé-Acerto'); ze.aplauso(turno === 'me' ? 2.2 : 1.5, turno === 'me' ? 0.7 : 0.45); He(turno === 'me' ? i.player : l, 'arriba', 1.2); s.toast(turno === 'me' ? '¡CORRECTO!' : `${za(me.rival(e))} acierta`, 1000); await r.w(1200); turno = turno === 'me' ? 'bot' : 'me'; continue; }
      if (res === 'pasa') { log.push(turno + '-pasa'); F.play('SomPalavra@Teclado27'); revela(q, ''); await r.w(700); continue; }
      // se acabó el reloj
      corre = false; F.stopTag('clock'); log.push(turno + '-tiempo'); revela(q, 'bad'); F.play('DropM.mp3'); ze.ooh(0.8); He(turno === 'me' ? i.player : l, 'lamenta', 1.5); s.toast('⏱ ¡Se acabó el tiempo!', 1400); await r.w(1600);
      return turno === 'bot' ? 'win' : 'lose';
    }
    return 'win';
  } finally {
    corre = false; clearInterval(tick); F.stopTag('clock'); try { Zt.stop(); } catch (x) { } H.quita(); il(n); Ot.duel(i, e);
    if (pant && texPant) { pant.forEach((m, k) => { m.map = pantOrig[k]; m.needsUpdate = true; }); texPant.dispose(); }
  }
}
// ---------- ENTRE DOS: premisa rápida y dos (o tres) opciones, 5 segundos; por turnos, el que falla cae
async function arEntreDos(a, e, t = {}) {
  const n = a.c, { eng: i, hud: s, s: r } = n, l = i.opps[e - 1], W = Ke, sk = W.__botSkill ?? Kr(e, a.rodadas || 4);
  try { n.panel.hideAll(0); } catch (x) { }
  nl(n, e); (!t.training || a.vidas > 0) && Pn(a.vidas, !!a.vidaExtra);
  const H = arHud('e2'), log = []; H.bajo = 1.5; let turno = W.__meFirst === false ? 'bot' : 'me';
  W.__ar = { id: 'entredos', log, get turno() { return turno; }, q: null, elige: null };
  try {
    for (let v = 0; v < 40; v++) {
      const p = arSaca(AR_DATOS.entredos, 'e2'), ops = p.o.slice(), ok = 0, orden = mA(ops.map((_, k) => k)), bien = orden.indexOf(ok);
      W.__ar.q = { texto: p.q, ops: orden.map(k => ops[k]), bien };
      H.etiqueta(p.c || ''); H.texto(p.q); H.limpia(); const bs = H.opciones(orden.map(k => ops[k])); H.reloj(5, turno); F.play('SomPalavra@Gcpgt1');
      let ele = -1; const elige = k => { if (ele < 0 && turno === 'me') { ele = k; F.play('Tecla'); } }; W.__ar.elige = elige;
      bs.forEach((b, k) => b.onclick = ev => { ev.stopPropagation(); elige(k); });
      const kd = ev => { const k = '123'.indexOf(ev.key); k >= 0 && k < bs.length && elige(k); }; addEventListener('keydown', kd);
      let lec = null; try { lec = Zt.leer(p.q + '. ' + orden.map(k => ops[k]).join(', o ') + '.', { delay: 200 }); } catch (x) { }
      { const t0 = cmdNow(); await r.until(() => ele >= 0 || ((!lec || !lec.leyendo) && cmdNow() - t0 > 600) || cmdNow() - t0 > 6000); }
      const T = W.__e3Clock || 5, t0 = cmdNow(), bt = Ui(ai(3.4, 1.2, sk), ai(4.4, 2.4, sk)), acierta = W.__botForce === 'fail' ? false : W.__botForce === 'win' ? true : Math.random() < ai(0.62, 0.93, sk);
      turno === 'bot' && He(l, 'habla', 2);
      let b10 = false;
      try { await r.until(() => { const sg = (cmdNow() - t0) / 1000, q = Math.max(0, T - sg); H.reloj(q, turno); if (!b10 && q <= 5 && sg > 0.2) { b10 = true; F.play('5', 1, 'clock'); } if (turno === 'bot' && ele < 0 && sg >= bt) ele = acierta ? bien : (bien + 1 + Math.floor(Math.random() * (bs.length - 1))) % bs.length; return ele >= 0 || sg >= T; }); }
      finally { removeEventListener('keydown', kd); try { Zt.stop(); } catch (x) { } F.stopTag('clock'); }
      const w = ele === bien; bs.forEach((b, k) => { b.disabled = true; k === ele && b.classList.add(w ? 'ok' : 'bad'); k === bien && b.classList.add('right'); }); log.push(`${turno}:${ele < 0 ? 'tiempo' : w ? 'ok' : 'mal'}`);
      if (w) { F.play('QuemFicaEmPé-Acerto'); ze.aplauso(turno === 'me' ? 2.2 : 1.4, turno === 'me' ? 0.7 : 0.45); He(turno === 'me' ? i.player : l, 'arriba', 1.2); await r.w(1300); turno = turno === 'me' ? 'bot' : 'me'; continue; }
      F.play(ele < 0 ? 'DropM.mp3' : 'Erro'); ze.ooh(0.8); He(turno === 'me' ? i.player : l, 'lamenta', 1.5); s.toast(ele < 0 ? '⏱ ¡Se acabó el tiempo!' : '✘ ¡Respuesta incorrecta!', 1400); await r.w(1500);
      if (turno === 'bot') return 'win';
      if (wh(a, n, t)) { await r.w(1200); turno = 'bot'; continue; }
      return 'lose';
    }
    return 'win';
  } finally { H.quita(); il(n); Ot.duel(i, e); }
}
// ---------- registro de las pruebas (mismo flujo que las españolas: cartel en la pantalla grande + duelo)
Object.assign(cu, {
  abc: { titulo: 'ABC', lista: true, ar: true, dicho: '¡ABC! Completá la palabra: la primera letra ya la tenés. ¡Cada uno con su reloj!', jugar: (a, e, t) => arDuelo(a, e, t, 'abc') },
  queves: { titulo: '¿QUÉ VES?', lista: true, ar: true, dicho: '¿Qué ves? Mirá bien la imagen y completá la palabra que le faltan letras.', jugar: (a, e, t) => arDuelo(a, e, t, 'queves') },
  cantala: { titulo: '¡CANTALA BIEN!', lista: true, ar: true, dicho: '¡Cantala bien! Las palabras de la canción están mezcladas: tocalas en orden.', jugar: (a, e, t) => arDuelo(a, e, t, 'cantala') },
  escondida: { titulo: 'LA ESCONDIDA', lista: true, ar: true, dicho: 'La escondida: la respuesta está escondida en esas letras. ¡Ordenalas!', jugar: (a, e, t) => arDuelo(a, e, t, 'escondida') },
  entredos: { titulo: 'ENTRE DOS', lista: true, ar: true, dicho: '¡Entre dos! Una premisa, dos opciones y cinco segundos para elegir.', jugar: (a, e, t) => arEntreDos(a, e, t) },
  asociadas: { titulo: 'ASOCIADAS', lista: true, ar: true, dicho: 'Asociadas: todas las palabras tienen algo en común. Descubrilo y completá las respuestas.', jugar: (a, e, t) => arDuelo(a, e, t, 'asociadas') },
});
const AR_DICHOS = { clasico: 'Duelo clásico: completá la palabra antes de que se te termine el reloj.', gallina: '¡Atención, palabra gallina! Escuchen bien la canción.', entretres: '¡Les toca Entre tres! Tres respuestas y cinco segundos para elegir.', adivina: '¡Adiviná! Las pistas salen de a una: el primero que lo sepa, que toque.', dameletra: '¡Dame letra! Pidan una letra por turnos y, si saben la frase, díganla entera en diez segundos.', sino: '¿Sí o no? Una pregunta cada uno, cinco segundos y solo dos botones.', vayalio: '¡Qué lío! Las letras están mezcladas: leé la definición y escribí la palabra bien ordenada.' };
for (const k in AR_DICHOS) if (cu[k]) { const d0 = cu[k].dicho; Object.defineProperty(cu[k], 'dicho', { configurable: true, get() { return Ke.__AR ? AR_DICHOS[k] : d0; } }); }
// Programa completo: TODAS las pruebas (las españolas, Clásico incluido, y las 6 argentinas, ABC incluido)
const AR_ES = ['clasico', 'entretres', 'adivina', 'dameletra', 'sino', 'vayalio'];
function planTodas(gallina, N = 8) {
  // siempre un Clásico y un ABC; el resto, sin repetir, entre las otras 10 pruebas (5 españolas + 5 argentinas)
  for (let k = 0; k < 80; k++) {
    const resto = mA(AR_ES.filter(x => x !== 'clasico').concat(AR_IDS.filter(x => x !== 'abc')));
    const n = mA(['clasico', 'abc'].concat(resto.slice(0, N - 2)));
    while (n.length < N) n.push(mA(AR_ES.concat(AR_IDS).slice())[0]);
    if (gallina) { if (n[4] === 'clasico' || n[4] === 'abc') continue; n[4] = 'gallina'; }
    return n;
  }
  return ['clasico', 'abc', 'entretres', 'queves', gallina ? 'gallina' : 'escondida', 'adivina', 'entredos', 'cantala'];
}
// ---------- modo AHORA CAIGO ARGENTINA
const AR_HOST = { nombre: 'Tano Ferreyra' };
const AR_RIVALES = ['Ceci', 'Nacho', 'Flor', 'Lauti', 'Romi', 'Pablito', 'Mili', 'Gonza', 'Belu', 'Chino'];
const AR_NT = {
  sube: ['¡Dale, subite a la trampilla del medio, che!', '¡Vení, vení! Parate en el centro, arriba de la trampilla.'],
  equipo: '¡Acá están los diez oponentes! Tenés que bajar a ocho para llegar al final. ¿Te animás?',
  elige: ['¡Elegí una huella! Atrás de cada una hay un oponente.', 'Bueno… ¿a quién vas a desafiar ahora? ¡Elegí, elegí!'],
  elegidoT: ['¡Elegiste al oponente número {n}!', '¡El {n}! A ver qué tiene para decir…', 'Oponente {n}, ¡vení que se arma!'],
  ok: ['¡Correcto!', '¡Bien ahí!', '¡La rompiste!', '¡Qué bárbaro!'],
  pasa: ['¡Pasá! Le toca a tu oponente…', 'Usás un comodín: ¡pasás la pregunta!'],
  tiempo: ['¡Se terminó el tiempo…!', '¡Uh, no! ¡Tiempo!'],
  turnoBot: ['Arranca contestando el oponente {n}. ¡Cada uno con su reloj!', 'Primero contesta el {n}. ¡Ojo con el reloj, eh!'],
  turnoTu: ['¡Arrancás vos! Cada uno tiene su reloj.'],
  pasaSin: ['¡Pasás! Otra pregunta… ¡y tu reloj sigue corriendo, eh!'],
  botTiempo: ['¡Al oponente {n} se le terminó el tiempo! ¡Chau, chau!', '¡Tiempo para el {n}! ¡Se nos va!'],
  cero: 'Bajaste a los ocho… pero tu marcador está en cero. ¡Qué mala leche, che!',
  plantas: '¡Te plantás! Te llevás la mitad de tus puntos.',
  final: '¡Juego final! Diez preguntas en dos minutos. Si lo sacás, ¡duplicás el marcador!',
  ganado: '¡¡Ganaste!! ¡Duplicás tu marcador! ¡Qué lo parió, qué partido!',
};
const AR_SALUDO = ['¡Buenas noches, buenas noches! ¿Cómo andan? ¡Bienvenidos a Ahora Caigo Argentina!', 'Hoy tenemos diez oponentes con unas ganas bárbaras de bajarte por la trampilla, ¿eh?', '¡Así que ponete cómodo, agarrá el mate y arrancamos!'];
const AR_CHARLAS = ['¿Y vos de dónde sos? ¿De Quilmes? ¡Qué lindo! Yo tengo un primo en Quilmes… bueno, en realidad tengo primos en todos lados.', 'Che, no te pongas nervioso, que acá nadie muerde. Bueno, la trampilla un poquito sí.', '¡Mirá la cara que tiene! Esa es cara de que sabe todo, eh. O de que no durmió nada.', 'Fijate que el reloj no perdona, ¿eh? Treinta segundos y ni uno más.'];
const AR_CONC = [
  { def: 'Ceci', g: 'f', job: 'Profe de zumba en Lanús', intro: ['Soy profe de zumba en Lanús. ¡Las señoras del grupo tienen más pilas que yo, eh!'], chistes: ['Una alumna de ochenta años me dijo «nena, poné algo con más ritmo». ¡Me retó!', 'Si me ves bailando en la trampilla, no te asustes: es la costumbre.'] },
  { def: 'Nacho', g: 'm', job: 'Parrillero de un club de barrio', intro: ['Soy parrillero en un club de barrio de Morón. Los domingos hago asado para cien.'], chistes: ['Me dicen «el maestro del vacío». Bueno, también porque nunca tengo plata en la billetera.', 'Si pierdo hoy, igual me quedo a hacer el asado del equipo, ¿eh?'] },
  { def: 'Flor', g: 'f', job: 'Kiosquera de Caballito', intro: ['Tengo un kiosco en Caballito. Sé el precio de cada alfajor de memoria.'], chistes: ['Un nene me pagó con un dibujo. ¡Y se lo acepté, era muy lindo!', 'Mi récord: vender cuarenta alfajores en un recreo.'] },
  { def: 'Lauti', g: 'm', job: 'Repartidor en bici', intro: ['Soy repartidor en bici. Me conozco todas las calles de Palermo… y todos los pozos.'], chistes: ['Una vez entregué una pizza tan rápido que todavía estaba en el horno.', 'Mi bici se llama «La Rayo». No es rápida, pero es leal.'] },
  { def: 'Romi', g: 'f', job: 'Peluquera de Quilmes', intro: ['Soy peluquera en Quilmes. En mi local se sabe todo del barrio antes que en el noticiero.'], chistes: ['Una clienta me pidió «un cambio de look» y le corté el flequillo. ¡Lloró de la emoción!', 'Yo no chusmeo, yo «me informo».'] },
  { def: 'Pablito', g: 'm', job: 'Chofer de colectivo', intro: ['Manejo el 60 hace quince años. ¡Si no lo agarrás en la parada, chau!'], chistes: ['Los pasajeros me dicen «¡dale, maestro!» y yo le doy… pero en la parada, eh.', 'Mi récord: de Constitución a Tigre sin un solo semáforo en rojo. ¡Un milagro!'] },
  { def: 'Mili', g: 'f', job: 'Estudiante de medicina en Córdoba', intro: ['Estudio medicina en Córdoba, la Docta. ¡Vengo con todo el cuarteto encima!'], chistes: ['Estudio tanto que soñé con el hueso fémur. Y me retaba.', 'En Córdoba todo se dice cantando. ¡Hasta los exámenes!'] },
  { def: 'Gonza', g: 'm', job: 'Hincha profesional y vendedor de choripanes', intro: ['Vendo choripanes en la puerta de la cancha. Y después entro a alentar, obvio.'], chistes: ['El chori más rápido del oeste: te lo hago antes de que pidas la gaseosa.', 'Si mi equipo pierde, regalo el chimichurri. ¡Es mi forma de llorar!'] },
  { def: 'Belu', g: 'f', job: 'Guía de turismo en Ushuaia', intro: ['Soy guía en Ushuaia, el fin del mundo. ¡Y vine hasta acá para que me bajen por una trampilla!'], chistes: ['Los turistas me preguntan si hace frío. ¡Estamos al lado de un glaciar, chicos!', 'Allá le decimos «verano» a cuando hacen ocho grados.'] },
  { def: 'Chino', g: 'm', job: 'Bandoneonista de San Telmo', intro: ['Toco el bandoneón en San Telmo los domingos. ¡Los turistas me tiran monedas y besos!'], chistes: ['El bandoneón pesa como diez kilos. Por eso siempre llego cansado a todos lados.', 'Una vez toqué tan fuerte que se despertó todo el conventillo.'] },
];
const AR_PRES = { iv: [['¡Hola, {nombre}! ¡Qué alegría tenerte acá! Contanos, ¿de qué laburás?', '¡Hola! ¡Qué alegría tenerte acá! Contanos, ¿de qué laburás?'], ['Vamos a conocer al rival. {nombre}, ¿vos a qué te dedicás?', 'Vamos a conocer al rival. ¿Vos a qué te dedicás?'], ['¡Un aplauso para {nombre}! Decime, ¿cuál es tu profesión?', '¡Un aplauso para nuestro rival! Decime, ¿cuál es tu profesión?']],
  av: ['¡Ja, ja! ¡Qué bárbaro!', '¡Mirá vos, qué nivel!', '¡Me lo anoto, eh!', '¡Ja, ja, ja! ¡Sos un genio!', '¡Lo que hay que escuchar, che!', '¡Qué personaje! Me encanta.'],
  sv: ['¡Muy bien! A ver si sabés tanto como contás.', 'Suerte… ¡pero no tanta, eh!', '¡Bueno, ahora a demostrarlo en el duelo!'] };
const AR_TX = { uh: '¿No nos querés contar? ¡Un poquito de misterio! Me encanta, eh.', dh: 'Y como dicen en mi barrio: ¡esto se pone bueno, che!' };
const arTx = (k, def) => Ke.__AR && AR_TX[k] ? AR_TX[k] : def;
const AR_LISTAS = {
  ov: [[['h', 'Y en la cocina, ¿cómo te defendés?'], ['o', '¡Hago unas milanesas a la napolitana que te morís! Y los domingos, el asado.']], [['o', 'Antes de venir me tomé unos mates con mi vieja. ¡Vengo con toda la energía!'], ['h', '¡Así se viene a un programa! Con la pancita llena y la cabeza fresca.']], [['h', 'Pregunta muy seria: ¿mate dulce o amargo?'], ['o', '¡Amargo, obvio! El dulce es para las visitas.']], [['o', 'Para los nervios hago como mi abuela: respiro, me como un alfajor y sonrío.'], ['h', '¡Sabia la abuela! Un alfajor arregla todo.']]],
  ur: ['Como dicen en el barrio: ¡con fe y con un mate, al duelo!', '¡Hoy acá se juega con todo, che! Que nadie se achique.'],
  rv: [['¡Y ahora vamos a conocer a quien juega hoy desde la trampilla central! ¡Un aplauso bien fuerte para {nombre}!', '¡Y ahora vamos a conocer a quien juega hoy desde la trampilla central! ¡Un aplauso bien fuerte!'], ['¡Y acá llega quien juega hoy en la trampilla central! ¡Bienvenido, {nombre}!', '¡Y acá llega quien juega hoy en la trampilla central! ¡Bienvenido!']],
  lv: [['{nombre}, contanos: ¿a qué te dedicás?', 'Contanos: ¿a qué te dedicás?'], ['Antes de arrancar, {nombre}: ¿de qué laburás?', 'Antes de arrancar: ¿de qué laburás?']],
  cv: ['¡Qué interesante! Seguro que eso te ayuda con las preguntas… o por lo menos con los nervios.', '¡Mirá vos! Con ese laburo, las trampillas no te van a dar ningún miedo… espero.', '¡Me encanta! Yo de chico quería ser eso mismo… o astronauta, o heladero. Al final terminé acá.', '¡Qué bárbaro! Bueno, hoy tu laburo es bajar a ocho oponentes. ¡Sin presión, eh!'],
};
const AR_HH = { elegidoT: ['¡Elegiste al oponente número {n}: {nombre}!', '¡El {n}! A ver qué sabe {nombre}…', '{nombre}, oponente {n}, ¡vení que se arma!'], turnoBot: ['Arranca contestando {nombre}. ¡Cada uno con su reloj!', 'Primero contesta {nombre}. ¡Ojo con el reloj!'], botTiempo: ['¡A {nombre} se le terminó el tiempo!', '¡Tiempo para {nombre}! ¡Chau, chau!'] };
// locuciones del minijuego original (voz en castellano): en el modo se silencian y se muestran con voseo
const AR_W2 = {
  'AhoraCaigo - Intro.mp3': ['¡Hola! Bienvenido al juego de Ahora Caigo Argentina.', '¿Listo para acertar todas y bajar a todos tus oponentes?', '¡Entonces preparate y acordate: no te vengas abajo!'],
  'AhoraCaigo - ComeceDuelo.mp3': ['¡Que arranque el duelo!'],
  'AhoraCaigo - Decisão.mp3': ['¡Felicitaciones! Bajaste a los 8 oponentes y llegó el momento de una decisión importante.', '¿Te plantás con la mitad de lo que juntaste o te animás al juego final para duplicar todo?'],
  'AhoraCaigo - Fim.mp3': ['Fue un placer jugar con vos. ¡Te espero en la próxima de Ahora Caigo Argentina!'],
  'AhoraCaigo - Moeda.mp3': ['Elegí un lado de la moneda y vemos qué le sumamos a tu marcador.'],
  'AhoraCaigo - Queda.mp3': ['¡Chau, chau, chau!'],
  'AhoraCaigo - Round1.mp3': ['¡Arrancamos! Quedan 8 oponentes para el juego final.', 'Elegí tu primer oponente.'],
  'AhoraCaigo - Round2.mp3': ['¡Vamos con la ronda 2! Quedan 7 oponentes para el juego final.'],
  'AhoraCaigo - Round3.mp3': ['¡Que sigamos por el buen camino en la ronda 3! Te quedan 6 oponentes para el juego final.'],
  'AhoraCaigo - Round4.mp3': ['Llegamos a la mitad con la ronda 4. Nos quedan 5 oponentes para el juego final.'],
  'AhoraCaigo - Round5.mp3': ['Nos vamos a la ronda 5. Quedan 4 oponentes para el juego final.'],
  'AhoraCaigo - Round6.mp3': ['¿Cómo andan esos nervios? Arranca la sexta ronda y quedan 3 oponentes para el juego final.'],
  'AhoraCaigo - Round7.mp3': ['Estamos llegando al final. Llega la ronda 7 y nos quedan dos oponentes.'],
  'AhoraCaigo - Round8.mp3': ['Llegaste al último duelo: te queda un oponente para el juego final. ¡Dale que se puede!'],
};
{ const sp = SE.prototype.play; SE.prototype.play = function (nom, vol, ...r) { return sp.call(this, nom, Ke.__AR && AR_W2[nom] ? 0 : vol, ...r); }; }
let arGuardado = null;
function arActivar(on) {
  if (on && !arGuardado) {
    arGuardado = { nt: {}, jn: jn.map(x => ({ ...x })), iv: iv.slice(), av: av.slice(), sv: sv.slice(), cop: Ke.__copreForce, cop2: Ke.__coproForce, reg: Ke.__regidorForce };
    for (const k in AR_NT) { arGuardado.nt[k] = Nt[k]; Nt[k] = AR_NT[k]; }
    jn.forEach((x, k) => Object.assign(x, AR_CONC[k % AR_CONC.length]));
    iv.splice(0, iv.length, ...AR_PRES.iv); av.splice(0, av.length, ...AR_PRES.av); sv.splice(0, sv.length, ...AR_PRES.sv);
    arGuardado.w2 = {}; for (const k in AR_W2) if (w2[k]) { arGuardado.w2[k] = w2[k].map(x => x.slice()); w2[k].forEach((x, j) => { x[2] = AR_W2[k][j] ?? x[2]; }); }
    G0: { arGuardado.listas = {}; const L = { ov, ur, rv, lv, cv }; for (const k in AR_LISTAS) { arGuardado.listas[k] = L[k].slice(); L[k].splice(0, L[k].length, ...AR_LISTAS[k]); } arGuardado.hh = { ...hh }; Object.assign(hh, AR_HH); }
    Ke.__copreForce = false; Ke.__coproForce = false; Ke.__regidorForce = false; // el copresentador y el regidor hablan en castellano: fuera del modo
  }
  if (!on && arGuardado) {
    const G = arGuardado; for (const k in G.nt) Nt[k] = G.nt[k]; for (const k in G.w2) G.w2[k].forEach((x, j) => { w2[k][j][2] = x[2]; }); { const L = { ov, ur, rv, lv, cv }; for (const k in G.listas) L[k].splice(0, L[k].length, ...G.listas[k]); Object.assign(hh, G.hh); } jn.forEach((x, k) => { for (const p of Object.keys(x)) delete x[p]; Object.assign(x, G.jn[k]); });
    iv.splice(0, iv.length, ...G.iv); av.splice(0, av.length, ...G.av); sv.splice(0, sv.length, ...G.sv); Ke.__copreForce = G.cop; Ke.__coproForce = G.cop2; Ke.__regidorForce = G.reg; arGuardado = null;
  }
  Ke.__AR = !!on; document.body.classList.toggle('modoAR', !!on);
}
{ // presentador y concursantes argentinos solo dentro del modo
  const dp = Object.getOwnPropertyDescriptor(me, 'presentador'); Object.defineProperty(me, 'presentador', { configurable: true, enumerable: true, get() { return Ke.__AR ? AR_HOST.nombre : dp.get.call(me); } });
  const rv = me.rival; me.rival = function (n) { return Ke.__AR ? AR_RIVALES[(n - 1) % 10] : rv.call(this, n); };
}
function planArgentina(gallina, N = 8) {
  const n = ['abc'].concat(mA(['queves', 'cantala', 'escondida', 'entredos', 'asociadas']), mA(['abc', 'entredos', 'queves', 'asociadas'])).slice(0, N);
  return n;
}
/** logo provisional del modo (hasta tener el del vídeo de Iker): texto «AHORA CAIGO ARGENTINA» dibujado */
function arLogoCanvas(w = 1024, h = 576) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  const fg = g.createLinearGradient(0, 0, 0, h); fg.addColorStop(0, '#1a1aa8'); fg.addColorStop(1, '#0a5ae0'); g.fillStyle = fg; g.fillRect(0, 0, w, h);
  g.fillStyle = '#74acdf'; g.fillRect(0, h * 0.78, w, h * 0.07); g.fillStyle = '#ffffff'; g.fillRect(0, h * 0.85, w, h * 0.07); g.fillStyle = '#74acdf'; g.fillRect(0, h * 0.92, w, h * 0.08);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 150px ARBarlow, "Barlow Condensed", "Arial Narrow", sans-serif'; g.lineWidth = 14; g.strokeStyle = '#1a0a5a'; g.strokeText('AHORA CAIGO', w / 2, h * 0.36); g.fillStyle = '#ffd21a'; g.fillText('AHORA CAIGO', w / 2, h * 0.36);
  g.font = '700 90px ARBarlow, "Barlow Condensed", "Arial Narrow", sans-serif'; g.strokeText('ARGENTINA', w / 2, h * 0.6); g.fillStyle = '#ffffff'; g.fillText('ARGENTINA', w / 2, h * 0.6);
  return c;
}
const AR_TEMA = { ...Do[0], id: 'argentina', name: 'Ahora Caigo Argentina', emoji: '🇦🇷', wallA: '#1a1aa8', wallB: '#2a6ae8', chevA: '#74acdf', chevB: '#ffffff', hashtag: '#AhoraCaigo', banner: 'AHORA CAIGO ARGENTINA', festivo: true,
  host: { suit: 0x1a1d24, shirt: 0x101010, tie: 0x101010 }, saludo: AR_SALUDO[0], extra: AR_SALUDO.slice(1),
  despedida: '¡Y esto fue todo por hoy! Gracias por bancarnos, ¡nos vemos mañana en Ahora Caigo Argentina! ¡Chau, chau, chau!' };
// logo del modo (recreado: assets/ar/logo_ar.png; si falta, p. ej. en la web pública, se dibuja uno de texto)
let arLogoImg = null;
function arLogo() { if (!arLogoImg) { arLogoImg = new Image(); arLogoImg.onerror = () => { arLogoImg.src = arLogoCanvas().toDataURL('image/png'); arLogoImg.onerror = null; }; arLogoImg.src = 'assets/ar/logo_ar.png'; } return arLogoImg; }
function arBotonMenu() {
  arCss(); const b = ei('AHORA CAIGO ARGENTINA', 'El programa de eltrece con ' + AR_HOST.nombre + ': ABC, ¿Qué ves?, ¡Cantala bien!, La escondida, Entre dos y Asociadas', 'gold arMbtn', () => Lt('ar'));
  const im = arLogo().cloneNode(); im.className = 'arMlogo'; b.prepend(im); return b;
}
function arPantallaLogo() { // logo en las pantallas grandes del plató
  const st = Xe.studio, L = st && st.screenMats; if (!L) return; const img = arLogo();
  const pon = () => { const t = Vt(1024, 576, g => g.drawImage(img, 0, 0, 1024, 576)); arGuardado && !arGuardado.pant && (arGuardado.pant = L.map(m => m.map)); L.forEach(m => { m.map = t; m.needsUpdate = true; }); try { arGuardado && !('logo' in arGuardado) && (arGuardado.logo = PANT.logoMap); PANT.logoMap = t; } catch (x) { } };
  img.complete && img.naturalWidth ? pon() : img.addEventListener('load', pon, { once: true });
}
async function arCortinilla(ms = 2600) { // «carga» del modo: logo a pantalla completa
  const d = document.createElement('div'); d.id = 'arIntro'; d.style.cssText = 'position:fixed;inset:0;z-index:99;background:#1a7ae8;display:flex;align-items:center;justify-content:center;transition:opacity .5s;pointer-events:none';
  const im = arLogo().cloneNode(); im.style.cssText = 'width:100%;height:100%;object-fit:cover;animation:arZoom 2.6s ease-out both'; d.appendChild(im); document.body.appendChild(d);
  await new Promise(r => setTimeout(r, ms)); d.style.opacity = '0'; setTimeout(() => d.remove(), 600);
}
function arEntrar(tema) {
  arCss(); const nuevo = !Ke.__AR; arActivar(true);
  try { Xe.setTheme(tema ? { ...tema, ...AR_TEMA, id: tema.id, decor: tema.decor, wallA: tema.wallA, wallB: tema.wallB, banner: (tema.banner || tema.name).toUpperCase() + ' · ARGENTINA' } : AR_TEMA); Ii(); Xe.resetPositions(); } catch (x) { }
  arPantallaLogo(); nuevo && arCortinilla(2200);
}
async function modoArgentina(tema) {
  arEntrar(tema); await arCortinilla(2400);
  yn.toast('🇦🇷 <b>AHORA CAIGO ARGENTINA</b> · conduce ' + AR_HOST.nombre, 2600);
  await ii('programa');
}
// menú del modo: misma estructura que «Jugar» del programa español, con el aspecto y las pruebas argentinas
function menuArgentina(a, r) {
  arEntrar(); r.classList.add('arMenu');
  
  if (a === 'ar') {
    r.appendChild(Pa('🇦🇷 Ahora Caigo Argentina'));
    r.append(ei('Programa completo', 'Cabecera, 8 duelos con las pruebas argentinas, moneda, juego final y despedida', 'gold', () => modoArgentina()),
      ei('Entrenamiento', 'Practicá las pruebas argentinas, la elección y las huellas', '', () => Lt('artrain')),
      ei('Explorar el plató', 'Paseá libremente por el plató 3D', '', () => ii('explorar')));
    r.appendChild(Pa('Programa especial'));
    const u = document.createElement('div'); u.className = 'themes';
    for (const h of Do) { const d = document.createElement('button'); d.className = 'tbtn'; d.innerHTML = `<span>${h.emoji}</span>${h.name}`; d.onclick = f => { f.stopPropagation(); F.play('Tecla'); modoArgentina(h); }; u.appendChild(d); }
    r.append(u, Ia('main'));
  } else {
    r.appendChild(Pa('Entrenamiento argentino (sin caídas)'));
    const u = (p, v, g, m = '') => ei(v, g, m, () => ii('entrenamiento', p));
    r.append(u('abc', 'ABC', 'Completá la palabra: la primera letra en amarillo', 'gold'), u('queves', '¿Qué ves?', 'Una imagen con su pista: completá la palabra'), u('cantala', '¡Cantala bien!', 'Ordená las palabras de la canción'),
      u('escondida', 'La escondida', 'La respuesta, con las letras mezcladas'), u('entredos', 'Entre dos', 'Dos opciones (a veces tres) y 5 segundos'), u('asociadas', 'Asociadas', 'Palabras flotantes con algo en común'),
      u('eleccion', 'Elección del central', 'El más rápido con la tableta'), u('final', 'Juego final', '10 preguntas en 2 minutos'), u('huellas', 'Huellas y moneda', 'Elegí huellas y probá la moneda'));
    r.appendChild(Ia('ar'));
  }
}
function arSalir() { if (!Ke.__AR) return; const pa = arGuardado && arGuardado.pant, lg = arGuardado && arGuardado.logo; arActivar(false); try { lg && (PANT.logoMap = lg); } catch (x) { } if (pa && Xe.studio && Xe.studio.screenMats) Xe.studio.screenMats.forEach((m, k) => { m.map = pa[k] || m.map; m.needsUpdate = true; }); try { Xe.setTheme(xf(Ms)); Ii(); Xe.resetPositions(); } catch (x) { } }
// charla del presentador entre duelo y duelo (solo en el modo): bocadillo con voseo
const arCharla = () => Ua(AR_CHARLAS);
