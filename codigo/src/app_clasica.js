// ===== v1.16 (mejorada en v1.17) · «App clásica»: pantallas 2D de móvil (tablero con los 10 oponentes en aro, barra del banco, duelo con pista,
// casillas de letras y relojes, caída por la trampilla). Mecánica Antena 3 2011-2021 (ETAPAS_DATOS['2011']): 10 duelos, cada
// trampilla esconde una cifra, 2 PASAR, plantarse tras cada duelo ganado y bote de 100.000 € si caen los 10. =====
const AppClasica = (() => {
  const E = (typeof ETAPAS_DATOS !== 'undefined' && ETAPAS_DATOS['2011']) || { cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 10000, 20000], comodines: 2, bote: 100000 };
  const ORO = '#ffd23a', AZ = '#0a1a5a', AZ2 = '#3a6aff', CIAN = '#5fe6ff';
  const NOMBRES = ['Marta', 'Javi', 'Carmen', 'Rubén', 'Lucía', 'Paco', 'Elena', 'Sergio', 'Nuria', 'Toño', 'Rosa', 'Iván', 'Pilar', 'Diego', 'Sonia', 'Álvaro', 'Bea', 'Óscar', 'Inés', 'Raúl'];
  const eur = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  const $ = (t, css, h) => { const d = document.createElement(t); if (css) d.style.cssText = css; if (h != null) d.innerHTML = h; return d; };
  let A = null; // audio
  const tono = (f, d = .15, ti = 'sine', v = .25) => { try { A = A || new (window.AudioContext || window.webkitAudioContext)(); const o = A.createOscillator(), g = A.createGain(); o.type = ti; o.frequency.value = f; g.gain.setValueAtTime(v, A.currentTime); g.gain.exponentialRampToValueAtTime(.001, A.currentTime + d); o.connect(g); g.connect(A.destination); o.start(); o.stop(A.currentTime + d + .05); } catch (e) { } };
  // v1.17: sonidos ORIGINALES del programa (sb3/snd.js, uso personal); si no están, los tonos sintetizados de siempre
  const SND = { intro: '6d2d6295a4185b18026968489f17dbc7', duelo: '3289c542e3b32b77f27b189e346fd11d', susp: 'db60bf3a97631196a852f2f0aedcd558', reloj: '02f8910759f7cb5a286856c9258ab9cf', bien: '360db421387a1e0fffb00dee0090a57b', mal: 'dab62773027a935d5ed1776426bbf2e9', cae: '62cdc6cc25a8c1075f97de51b1af6c9c', moneda: '943268f29bb3eb5245cc6f69521d6618', decision: '7fb35710fcd9d5caf03ac8deb9be008f', fin: '61a303750c7438ba03e0c69017b5eede', letra: 'a99a5b7b088aafb038a3e0a1501fe39a', pop: '6c7856e5e41e29a6f53807bd036b5b11', tema: '5f54bfc725082e30d7ae50bc094bb791',
    rounds: ['166b477a9c352e64ada846b3ec88e54b', '6ec195b8f2120998b2551a373cd6b7fc', 'b5095ebcb41fb5c2eb99348ba2cc3caf', '2b06c84d84b6e4a9b848964613b91ea0', '60c42218d7fa71d244c9ae837720e492', '57f2e73b5f9243443b30911c88dd63ff', '2db6d2fcf14dff99a0c79c34319158cd', 'a4724c1819de820150af06e470f81d9f'] };
  const urls = {}; let musica = null;
  function sndUrl(h) { if (urls[h] !== undefined) return urls[h]; let u = null; try { const e = window.__SND_EMB && window.__SND_EMB[h]; if (e) { const b = atob(e), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); u = URL.createObjectURL(new Blob([a], { type: 'audio/mpeg' })); } } catch (e) { } return (urls[h] = u); }
  function sfx(h, vol = 1, alt) { const u = h && sndUrl(h); if (!u) { alt && alt(); return null; } try { const a = new Audio(u); a.volume = vol; a.play().catch(() => alt && alt()); return a; } catch (e) { alt && alt(); return null; } }
  function fondoMus(h, loop = true, vol = .55) { paraMus(); const u = h && sndUrl(h); if (!u) return; try { musica = new Audio(u); musica.loop = loop; musica.volume = vol; musica.play().catch(() => { }); } catch (e) { } }
  function paraMus() { if (musica) { try { musica.pause(); } catch (e) { } musica = null; } }
  const caidaSnd0 = () => { try { A = A || new (window.AudioContext || window.webkitAudioContext)(); const o = A.createOscillator(), g = A.createGain(); o.frequency.setValueAtTime(700, A.currentTime); o.frequency.exponentialRampToValueAtTime(50, A.currentTime + 1.2); g.gain.setValueAtTime(.3, A.currentTime); g.gain.exponentialRampToValueAtTime(.001, A.currentTime + 1.3); o.connect(g); g.connect(A.destination); o.start(); o.stop(A.currentTime + 1.4); } catch (e) { } };
  const caidaSnd = () => sfx(SND.cae, 1, caidaSnd0);
  const bienSnd = () => sfx(SND.bien, .9, () => tono(880, .2)), malSnd = () => sfx(SND.mal, .9, () => tono(160, .35, 'sawtooth'));
  function avatar(nombre, i, tam, central) { // retrato dibujado (sin fotos): silueta con pelo y color propio
    const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'); const hue = (i * 37) % 360;
    const gr = g.createRadialGradient(80, 60, 10, 80, 80, 80); gr.addColorStop(0, central ? '#4a5a8a' : `hsl(${hue},45%,72%)`); gr.addColorStop(1, central ? '#1a1f3a' : `hsl(${hue},50%,38%)`); g.fillStyle = gr; g.fillRect(0, 0, 160, 160);
    const piel = central ? '#f5a654' : ['#f1c7a0', '#d9a37a', '#b07850', '#f5d2b5', '#8a5a3a'][i % 5];
    g.fillStyle = central ? '#f5a654' : `hsl(${(hue + 180) % 360},55%,45%)`; g.beginPath(); g.ellipse(80, 168, 62, 52, 0, Math.PI, 0); g.fill();
    g.fillStyle = piel; g.fillRect(68, 100, 24, 20); g.beginPath(); g.ellipse(80, 76, 30, 37, 0, 0, 7); g.fill();
    g.fillStyle = central ? '#222' : ['#2a1a10', '#5a3a1a', '#d8b860', '#111', '#8a2a1a', '#ccc'][i % 6]; g.beginPath();
    if (i % 2 && !central) { g.ellipse(80, 62, 36, 32, 0, Math.PI, 0); g.fill(); g.fillRect(44, 60, 14, 50); g.fillRect(102, 60, 14, 50); } else { g.ellipse(80, 56, 33, 22, 0, Math.PI, 0); g.fill(); }
    if (!central) { g.fillStyle = '#222'; g.beginPath(); g.arc(69, 78, 3.5, 0, 7); g.arc(91, 78, 3.5, 0, 7); g.fill(); g.strokeStyle = '#7a2a2a'; g.lineWidth = 3; g.beginPath(); g.arc(80, 90, 10, .3, Math.PI - .3); g.stroke(); }
    const im = $('div', `width:${tam}px;height:${tam}px;border-radius:50%;border:${central ? 6 : 4}px solid ${central ? '#e3262b' : ORO};box-shadow:0 0 14px #000a${central ? ',0 0 30px #e3262b88' : ''};overflow:hidden;background:url(${c.toDataURL()}) center/cover;box-sizing:border-box`);
    return im;
  }
  function logo(alto) { const d = $('div', `height:${alto}px;display:flex;align-items:center;justify-content:center`); try { if (window.__LOGO_LOCAL) { const i = $('img', `height:${alto}px`); i.src = window.__LOGO_LOCAL; d.appendChild(i); return d; } const cv = acLogoVariante(256, { tipo: 'actual' }); Promise.resolve(cv).then(c => { const i = $('img', `height:${alto}px`); i.src = c.toDataURL(); d.appendChild(i); }); } catch (e) { d.innerHTML = `<b style="font:900 ${alto * .4}px Arial;color:${ORO};text-shadow:0 2px 0 #000">¡AHORA CAIGO!</b>`; } return d; }
  const fondo = `background:radial-gradient(ellipse at 50% 35%,#1d3fa8 0%,${AZ} 55%,#030820 100%);`;
  const huella = (h, col = ORO) => `<svg width="${h * .55}" height="${h}" viewBox="0 0 22 40"><ellipse cx="11" cy="12" rx="8" ry="11" fill="${col}"/><ellipse cx="11" cy="32" rx="6" ry="7" fill="${col}"/></svg>`;
  const barraBanco = (txt) => `<div style="display:flex;align-items:center;justify-content:center;margin:6px 0"><div style="width:52px;height:64px;border-radius:32px 0 0 32px;background:linear-gradient(#5fe6ff,#0a3a8a);display:flex;align-items:center;justify-content:center;border:3px solid #111">${huella(36)}</div><div style="min-width:52%;height:58px;background:linear-gradient(#183a5a,#06121e);border-top:3px solid ${CIAN};border-bottom:3px solid ${CIAN};display:flex;align-items:center;justify-content:center;font:600 clamp(24px,7vw,36px) system-ui;color:#fff">${txt}</div><div style="width:52px;height:64px;border-radius:0 32px 32px 0;background:linear-gradient(#5fe6ff,#0a3a8a);display:flex;align-items:center;justify-content:center;border:3px solid #111">${huella(36)}</div></div>`;
  let raiz = null, st = null;
  function nuevo() {
    const ns = NOMBRES.slice().sort(() => Math.random() - .5).slice(0, 10), cf = E.cifras.slice(0, 10).sort(() => Math.random() - .5);
    const Q = [...(typeof Fv !== 'undefined' ? Fv : []), ...(typeof kv !== 'undefined' ? kv : []), ...(typeof PREGUNTAS_EXTRA !== 'undefined' ? PREGUNTAS_EXTRA : [])].filter(x => typeof x === 'string' && x.includes('|') && x.includes('['));
    st = { rivales: ns.map((n, i) => ({ n, i, cifra: cf[i], fuera: false })), banco: 0, pasar: E.comodines || 2, ganados: 0, preg: Q.sort(() => Math.random() - .5), qi: 0, nombre: (localStorage.getItem('ac_clasica_nombre') || 'Tú') };
  }
  function pantalla(html) { raiz.innerHTML = ''; const p = $('div', `position:absolute;inset:0;${fondo}display:flex;flex-direction:column;align-items:center;overflow:hidden`); if (html) p.innerHTML = html; raiz.appendChild(p); if (st) { st.pant = (st.pant || 0) + 1; if (st.ia && !st.fin) ia2Barra(); } return p; }
  const boton = (t, fn, prim, css = '') => { const b = $('button', `margin:5px;padding:12px 18px;border-radius:30px;border:3px solid ${ORO};background:${prim ? `linear-gradient(#ffe680,${ORO} 55%,#c89a10)` : '#0008'};color:${prim ? '#2a1a00' : '#fff'};font:900 16px system-ui;cursor:pointer;box-shadow:0 4px 0 #0008;${css}`, t); b.onclick = e => { e.stopPropagation(); tono(660, .08); fn(); }; return b; };
  function lateral(p) { const l = $('div', 'position:absolute;right:8px;top:70px;display:flex;flex-direction:column;gap:10px');
    const ic = (h, t, fn) => { const b = $('div', `width:56px;height:56px;border-radius:50%;border:3px solid ${ORO};background:radial-gradient(#2a4aa8,#081030);display:flex;align-items:center;justify-content:center;font:900 22px system-ui;color:#fff;cursor:pointer;box-shadow:0 0 10px #000`, h); b.title = t; b.onclick = e => { e.stopPropagation(); fn && fn(); }; l.appendChild(b); };
    ic(huella(26, '#7cff6a') + `<span style="font-size:15px;color:${ORO};margin-left:2px">${st.pasar}</span>`, 'PASAR que te quedan'); ic('🏆', 'Premios', () => premios()); ic('🏠', 'Salir', () => cerrar()); p.appendChild(l); }
  function cabecera(p) { const c = $('div', 'width:100%;display:flex;flex-direction:column;align-items:center;margin-top:10px'); c.appendChild(logo(64));
    c.appendChild($('div', `font:700 16px system-ui;color:${ORO};margin-top:4px`, `Te quedan <b style="display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;vertical-align:middle;font-size:17px;width:34px;height:34px;border-radius:50%;background:#000;border:2px solid ${ORO};color:${ORO}">${st.ia ? quedan2().length : 10 - st.ganados}</b> para el bote`));
    c.appendChild($('div', 'font:900 clamp(38px,11vw,62px) Arial Black,system-ui;color:#fff;text-shadow:0 3px 0 #a00,0 6px 10px #000;letter-spacing:1px', eur(E.bote || 100000))); p.appendChild(c); }
  function tablero(msg) {
    const p = pantalla(); cabecera(p); lateral(p); p.insertAdjacentHTML('beforeend', barraBanco(eur(st.banco)));
    p.appendChild($('div', `font:600 18px system-ui;color:${ORO};margin-top:2px;text-shadow:0 2px 3px #000`, msg || 'Elige a tu oponente'));
    const aro = $('div', 'position:relative;width:min(96vw,520px);aspect-ratio:1;margin-top:4px'); p.appendChild(aro);
    const W = Math.min(innerWidth * .96, 520), av = Math.round(W * .17);
    st.rivales.forEach((r, k) => { if (r.centro) return; const a = -Math.PI / 2 + Math.PI / 10 + k * Math.PI / 5; const x = 50 + 40 * Math.cos(a), y = 50 + 40 * Math.sin(a);
      const cel = $('div', `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);text-align:center;cursor:${r.fuera ? 'default' : 'pointer'}`);
      if (r.fuera) { cel.appendChild($('div', `width:${av}px;height:${av}px;border-radius:50%;border:4px solid ${ORO};background:radial-gradient(#3a2a00,#000);display:flex;align-items:center;justify-content:center;box-sizing:border-box`, huella(av * .5) + huella(av * .5))); cel.appendChild($('div', `font:800 12px system-ui;color:${ORO}`, eur(r.cifra))); }
      else { cel.appendChild(avatar(r.n, k, av)); cel.appendChild($('div', 'font:700 12px system-ui;color:#fff;text-shadow:0 1px 2px #000', r.n)); cel.onclick = () => { if (!st.bloqueo) previa(r); }; }
      r.el = cel; aro.appendChild(cel); });
    const c = $('div', 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center');
    const halo = $('div', `position:absolute;left:50%;top:50%;width:${av * 2.1}px;height:${av * 2.1}px;transform:translate(-50%,-50%);border-radius:50%;border:2px dashed #e3262b88;animation:acgira 12s linear infinite`);
    const yo = avatar(st.nombre, st.ci || 0, Math.round(av * 1.6), true); st.centro = c; st.centroAv = yo; c.append(halo, yo, $('div', 'font:700 14px system-ui;color:#fff', st.nombre)); aro.appendChild(c);
    if (st.ia) { ia2Elige(); return; } if (st.ganados && st.ganados < 10) p.appendChild(boton('✋ Plantarme con ' + eur(st.banco), () => final(true), false));
  }
  function premios() { const p = pantalla(); cabecera(p); lateral(p);
    const g = $('div', 'display:grid;grid-template-columns:1fr 1fr;gap:8px;width:min(92vw,460px);margin:10px 0'); const L = st.rivales.slice().sort((a, b) => b.cifra - a.cifra);
    for (const r of L) g.appendChild($('div', `padding:8px;border-radius:30px;text-align:center;font:900 22px Arial Black,system-ui;${r.fuera ? 'background:#222;color:#666;border:3px solid #444' : `background:linear-gradient(#ffe680,${ORO} 55%,#c89a10);color:#7a1a00;border:3px solid #7a4a00`}`, eur(r.cifra)));
    p.appendChild(g); p.insertAdjacentHTML('beforeend', barraBanco(eur(st.banco))); p.appendChild($('div', 'color:#fff;opacity:.8;font:14px system-ui;margin:4px 16px;text-align:center', 'Cada trampilla esconde una de estas cifras. Las grises ya son tuyas. Si tiras a los 10, te llevas el bote.')); p.appendChild(boton('◀ Volver al tablero', () => tablero(), true)); }
  // v1.17: antes del duelo, cortinilla «DUELO N» con su sintonía (Round1-8 originales) y «¡Comienza el duelo!»
  function previa(r) { if (st.bloqueo) return; st.bloqueo = true; const n = st.ganados + 1 + (st.relevos || 0); const p = pantalla(); p.appendChild($('div', 'height:10vh')); p.appendChild(logo(90));
    p.appendChild($('div', `font:900 clamp(40px,12vw,72px) Arial Black,system-ui;color:#fff;text-shadow:0 4px 0 #a00,0 8px 14px #000;margin-top:14px`, 'DUELO ' + n));
    const vs = $('div', 'display:flex;align-items:center;gap:18px;margin-top:18px;font:800 18px system-ui;color:#fff;text-align:center'); const a = $('div'); a.append(avatar(st.nombre, st.ci || 0, 110, true), $('div', '', esc0(st.nombre))); const b = $('div'); b.append(avatar(r.n, r.i, 110), $('div', '', esc0(r.n)));
    vs.append(a, $('div', `font:900 34px Arial Black;color:${ORO}`, 'VS'), b); p.appendChild(vs);
    p.appendChild($('div', `font:700 16px system-ui;color:${ORO};margin-top:16px;text-align:center;padding:0 20px`, 'Se van destapando letras mientras corre tu reloj. Si fallas, sigue intentándolo. PASAR le da la misma pregunta a ' + esc0(r.n) + '.'));
    paraMus(); sfx(SND.rounds[(n - 1) % SND.rounds.length], 1);
    const go = () => { if (!raiz || st.enDuelo) return; st.bloqueo = false; st.enDuelo = true; sfx(SND.duelo, 1); duelo(r); };
    p.appendChild(boton('▶ ¡Comienza el duelo!', go, true, 'margin-top:18px;font-size:20px')); st.tmPrevia = setTimeout(go, 3800); }
  function duelo(r) {
    clearTimeout(st.tmPrevia); const T0 = E.reloj || 30; const p = pantalla(); lateral(p); Object.assign(p.lastChild.style, { top: 'auto', bottom: '14px', right: '50%', transform: 'translateX(50%)', flexDirection: 'row' }); let tu = T0, el = T0, turno = 0, vivo = true, q = null, tmB = null, last = performance.now(), ultTic = 0, tRev = 0;
    fondoMus(SND.susp, true, .35);
    const top = $('div', 'display:flex;justify-content:center;gap:16vw;margin-top:16px;font:600 16px system-ui;color:#fff;text-align:center');
    const a1 = $('div', '', ''); a1.append($('div', '', esc0(st.nombre)), avatar(st.nombre, st.ci || 0, 96, true)); const a2 = $('div'); a2.append($('div', '', esc0(r.n)), avatar(r.n, r.i, 96)); top.append(a1, a2); p.appendChild(top);
    const rel = $('div', 'display:flex;align-items:center;justify-content:center;gap:8px;margin:10px 0'); const r1 = $('div', `min-width:96px;padding:6px 10px;border-radius:12px;background:#06121e;border:3px solid ${CIAN};font:900 30px system-ui;color:${ORO};text-align:center;transition:box-shadow .2s`), r2 = r1.cloneNode(); rel.append(r1, $('div', '', huella(30)), r2); p.appendChild(rel);
    const banda = $('div', `width:100%;box-sizing:border-box;background:linear-gradient(#0c1e5a,#071034);border-top:4px solid ${CIAN};border-bottom:4px solid ${CIAN};padding:12px 0 16px;margin-top:6px;box-shadow:0 0 18px ${CIAN}66`);
    const pista = $('div', 'font:700 clamp(16px,4.6vw,22px) system-ui;color:#fff;text-align:center;padding:0 72px 0 14px;min-height:54px;width:100%;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere'); const fichas = $('div', 'display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-top:14px;padding:0 6px');
    banda.append(pista, fichas); p.appendChild(banda);
    const estado = $('div', `font:700 20px system-ui;color:${CIAN};margin:12px 0 4px;text-align:center;min-height:26px`); p.appendChild(estado);
    const entrada = $('input', 'width:min(80vw,380px);padding:10px;border-radius:12px;border:3px solid ' + ORO + ';background:#000a;color:#fff;font:800 20px system-ui;text-align:center;text-transform:uppercase'); entrada.placeholder = 'Escribe la respuesta'; entrada.setAttribute('autocomplete', 'off'); entrada.setAttribute('autocorrect', 'off'); entrada.setAttribute('spellcheck', 'false'); entrada.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') responde(); });
    const fila = $('div', 'display:flex;flex-wrap:wrap;justify-content:center;align-items:center'); const bP = boton(huella(18, '#7cff6a') + ' PASAR (' + st.pasar + ')', () => pasar(), false); fila.append(entrada, boton('✔ Responder', () => responde(), true), bP); p.appendChild(fila);
    const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    function pinta() { r1.textContent = Math.ceil(tu); r2.textContent = Math.ceil(el); r1.style.boxShadow = turno === 0 ? `0 0 18px ${ORO}` : ''; r2.style.boxShadow = turno === 1 ? `0 0 18px ${ORO}` : ''; r1.style.color = tu <= 5 ? '#ff4a4a' : ORO; r2.style.color = el <= 5 ? '#ff4a4a' : ORO; }
    // casillas: las letras «[ocultas]» se van destapando (q.vis) como en la tele
    function casillas(todo) { fichas.innerHTML = ''; q.slots.forEach(sl => { if (sl === ' ') { fichas.appendChild($('div', 'width:16px')); return; }
        const v = todo || !sl.oc || sl.vis; fichas.appendChild($('div', `width:clamp(26px,8vw,40px);height:clamp(36px,10vw,52px);display:flex;align-items:center;justify-content:center;background:${sl.oc && sl.vis && !todo ? 'linear-gradient(#fff6c0,#ffd23a)' : 'linear-gradient(#fff,#cfd4dc)'};border-radius:4px;box-shadow:0 2px 0 #0006;font:900 clamp(20px,6vw,30px) system-ui;color:${todo && sl.oc && !sl.vis ? '#c01818' : '#1838a8'}`, v ? sl.ch : '')); }); }
    function ocultas() { return q.slots.filter(sl => sl !== ' ' && sl.oc && !sl.vis); }
    function destapa() { const o = ocultas(); if (o.length <= 1) return; o[Math.floor(Math.random() * o.length)].vis = true; sfx(SND.letra, .5); casillas(); }
    function siguiente() { if (!vivo) return; const l = st.preg[st.qi++ % st.preg.length]; const [t, resp] = l.split('|'); const slots = []; let oc = false;
      for (const ch of resp) { if (ch === '[') { oc = true; continue; } if (ch === ']') { oc = false; continue; } slots.push(ch === ' ' ? ' ' : { ch, oc, vis: false }); }
      q = { t, resp, sol: resp.replace(/[\[\]]/g, ''), slots }; tRev = 0; pista.textContent = t; casillas(); entrada.value = ''; turnoUI(); }
    function turnoUI() { if (turno === 0) { if (st.ia) { estado.textContent = riaF('suTurno2', { n: st.nombre }); entrada.disabled = true; iaTurno(); return; } estado.textContent = 'Tu turno'; entrada.disabled = false; bP.style.opacity = st.pasar ? 1 : .4; setTimeout(() => entrada.focus(), 50); } else { estado.textContent = 'Turno de ' + r.n; entrada.disabled = true; bot(); } }
    function acierto(quien) { casillas(true); bienSnd(); estado.textContent = quien === 0 ? '¡Correcto!' : r.n + ': «' + q.sol + '». ¡Correcto!'; turno = quien === 0 ? 1 : 0; entrada.disabled = true; const t = turno; turno = -1; setTimeout(() => { if (!vivo) return; turno = t; siguiente(); }, 1200); }
    function bot() { clearTimeout(tmB); tmB = setTimeout(() => { if (!vivo || turno !== 1) return; const pct = 1 - ocultas().length / Math.max(1, q.slots.filter(s => s !== ' ' && s.oc).length);
        if (Math.random() < .25 + pct * .7) acierto(1); else { malSnd(); estado.textContent = r.n + ' falla… sigue pensando'; bot(); } }, 1800 + Math.random() * 3500); }
    function iaTurno() { /*RIA2*/ clearTimeout(tmB); tmB = setTimeout(() => { if (!vivo || turno !== 0) return; const tot = Math.max(1, q.slots.filter(s => s !== ' ' && s.oc).length), pct = 1 - ocultas().length / tot;
        if (Math.random() < .3 + pct * .65) { entrada.value = q.sol; setTimeout(responde, 450); } else if (st.pasar && Math.random() < .3) pasar(); else { malSnd(); estado.textContent = riaF('falla2', { n: st.nombre }); iaTurno(); } }, 1800 + Math.random() * 3500); }
    function responde() { if (turno !== 0 || !vivo) return; const v = norm(entrada.value); if (!v) return; if (v === norm(q.sol)) acierto(0);
      else { malSnd(); estado.textContent = 'No es correcto. ¡Sigue intentándolo, tu reloj corre!'; entrada.value = ''; entrada.style.borderColor = '#e3262b'; setTimeout(() => entrada.style.borderColor = ORO, 500); entrada.focus(); } }
    function pasar() { if (turno !== 0 || !vivo || !st.pasar) return; st.pasar--; bP.innerHTML = huella(18, '#7cff6a') + ' PASAR (' + st.pasar + ')'; sfx(SND.pop, 1); estado.textContent = '¡PASAS! La misma pregunta es para ' + r.n; turno = 1; entrada.disabled = true; bot(); }
    function bucle(t) { if (!vivo) return; const dt = Math.min(.25, (t - last) / 1000); last = t;
      if (turno === 0 || turno === 1) { if (turno === 0) tu = Math.max(0, tu - dt); else el = Math.max(0, el - dt); tRev += dt; if (tRev >= 5) { tRev = 0; destapa(); }
        const rest = turno === 0 ? tu : el; if (rest <= 5 && Math.ceil(rest) !== ultTic) { ultTic = Math.ceil(rest); sfx(SND.reloj, .7, () => tono(1200, .05)); } }
      pinta(); if (tu <= 0 || el <= 0) { vivo = false; st.enDuelo = false; clearTimeout(tmB); paraMus(); entrada.blur(); const ganas = el <= 0; casillas(true); estado.textContent = ganas ? '¡Se le acaba el tiempo a ' + r.n + '!' : '¡Se te acaba el tiempo!'; const tkD = st.pant; setTimeout(() => { if (st.pant === tkD) caida(r, ganas); }, 1100); return; } requestAnimationFrame(bucle); }
    pinta(); siguiente(); requestAnimationFrame(t => { last = t; bucle(t); }); st.salirDuelo = () => { vivo = false; st.enDuelo = false; clearTimeout(tmB); paraMus(); };
  }
  const esc0 = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function caida(r, ganas) { // animación: el aro rojo, la trampilla se abre y cae el que pierde
    tablero(ganas ? '¡' + r.n + ' cae!' : '¡Caes tú!'); st.bloqueo = true; const cel = ganas ? r.el : st.centro; caidaSnd();
    const hueco = $('div', `position:absolute;left:50%;top:42%;width:0;height:0;border-radius:50%;background:radial-gradient(#000 60%,#e3262b);transform:translate(-50%,-50%);transition:all .35s;box-shadow:0 0 20px #e3262b`); cel.appendChild(hueco);
    const av = ganas ? cel.querySelector('div') : st.centroAv; av.style.transition = 'transform 1.1s cubic-bezier(.6,0,.9,.4),opacity 1.1s'; av.style.borderColor = '#e3262b';
    setTimeout(() => { hueco.style.width = hueco.style.height = '120%'; }, 50); setTimeout(() => { av.style.transform = 'translateY(30px) scale(.1) rotate(200deg)'; av.style.opacity = '0'; }, 380);
    const tkC = st.pant; setTimeout(() => { if (st.pant !== tkC) return; st.bloqueo = false; if (ganas) { r.fuera = true; st.ganados++; st.banco += r.cifra; moneda(r); } else if (!relevo2d(r)) final(false, false, r); }, 1900);
  }
  // v1.17: la cifra que escondía la trampilla (moneda) y la DECISIÓN de plantarse o seguir, con sus músicas originales
  function moneda(r) { const p = pantalla(); cabecera(p); sfx(SND.moneda, 1, () => { tono(660, .15); tono(990, .3); });
    p.appendChild($('div', 'font:700 20px system-ui;color:#fff;margin-top:18px;text-align:center', 'La trampilla de ' + esc0(r.n) + ' escondía…'));
    const m = $('div', `margin:18px;width:200px;height:200px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#fff6c0,${ORO} 45%,#9a6a00);border:8px solid #7a4a00;box-shadow:0 0 40px ${ORO};font:900 34px Arial Black,system-ui;color:#5a1a00;transform:rotateY(90deg) scale(.4);transition:transform .9s cubic-bezier(.2,1.6,.4,1)`, eur(r.cifra)); p.appendChild(m); setTimeout(() => m.style.transform = 'none', 60);
    p.insertAdjacentHTML('beforeend', barraBanco(eur(st.banco)));
    const tkM = st.pant; setTimeout(() => { if (!raiz || st.pant !== tkM) return; if (st.ganados >= 10 || quedan2().length === 0) return final(false, true); decision(); }, 2600); }
  function decision() { const p = pantalla(); cabecera(p); lateral(p); fondoMus(SND.decision, false, .8);
    p.insertAdjacentHTML('beforeend', barraBanco(eur(st.banco)));
    p.appendChild($('div', 'font:900 26px system-ui;color:#fff;margin:14px 20px 4px;text-align:center;text-shadow:0 2px 4px #000', '¿Te plantas o sigues?'));
    p.appendChild($('div', `font:600 16px system-ui;color:${ORO};margin:0 24px 14px;text-align:center`, `Llevas ${eur(st.banco)} y ${st.ganados} de 10 rivales. Si sigues y caes, te vas sin nada. Si los tiras a todos, ¡el bote de ${eur(E.bote || 100000)}!`));
    p.append(boton('💪 Sigo jugando', () => { paraMus(); tablero('Elige a tu siguiente oponente'); }, true, 'font-size:20px;padding:14px 30px'), boton('✋ Me planto con ' + eur(st.banco), () => final(true), false, 'font-size:18px')); if (st.ia) { const tk = st.pant; setTimeout(() => { if (st.pant !== tk || !raiz) return; if (Math.random() < (st.banco < 60000 ? .85 : .6)) { paraMus(); tablero(riaF('sigue2', { n: st.nombre })); } else final(true); }, 2800); } }
  function final(plantado, bote, r) { if (st) st.fin = true; paraMus(); sfx(bote || plantado ? SND.fin : SND.tema, 1); const p = pantalla(); cabecera(p); lateral(p);
    const t = bote ? `¡Has tirado a los 10! Te llevas el bote de ${eur(E.bote || 100000)} y ${eur(st.banco)} del banco.` : plantado ? `Te plantas con ${eur(st.banco)}. ¡Enhorabuena!` : `Has caído ante ${esc0(r.n)}. ${st.ganados ? 'Habías ganado ' + st.ganados + (st.ganados === 1 ? ' duelo.' : ' duelos.') : ''} ¡Buen intento! La próxima vez seguro que llegas más lejos.`;
    p.insertAdjacentHTML('beforeend', barraBanco(eur(bote ? st.banco + (E.bote || 100000) : plantado ? st.banco : 0)));
    p.appendChild($('div', 'font:800 22px system-ui;color:#fff;text-align:center;margin:18px 20px;text-shadow:0 2px 4px #000', st.ia ? ia2Final(plantado, bote, r) : t)); p.appendChild(boton('↻ Jugar otra vez', () => { nuevo(); tablero(); }, true)); p.appendChild(boton('🏠 Salir', () => cerrar())); }
  // v1.38 · RELEVO IA: si caes, el oponente que te ha ganado pasa al centro con todo tu banco y juega la máquina; tú lo ves (Saltar / Menú)
  function quedan2() { return st.rivales.filter(x => !x.fuera && !x.centro); }
  function voz2(t) { try { if (typeof yn !== 'undefined' && yn && yn.say) yn.say([t]); } catch (_) {} }
  function relevo2d(r, mudo) {
    try { if (localStorage.getItem('ac_relevoIA') === '0') return false; } catch (_) {}
    if (!quedan2().filter(x => x !== r).length) return false;
    if (!st.ia) { st.ia = true; st.hNombre = st.nombre; st.hGanados = st.ganados; }
    st.relevos = (st.relevos || 0) + 1; r.centro = true; st.nombre = r.n; st.ci = r.i;
    if (mudo) return true;
    const L = (typeof RIA_L !== 'undefined' ? RIA_L : {}), p = pantalla(); cabecera(p);
    p.appendChild($('div', `font:900 clamp(24px,7vw,40px) Arial Black,system-ui;color:#fff;text-shadow:0 3px 0 #a00,0 6px 12px #000;margin-top:16px;text-align:center`, riaF('titulo2')));
    const vs = $('div', 'display:flex;align-items:center;gap:18px;margin-top:14px;font:800 18px system-ui;color:#fff;text-align:center');
    const b = $('div'); b.append(avatar(r.n, r.i, 120, true), $('div', '', '🤖 ' + esc0(r.n))); vs.append(b); p.appendChild(vs);
    p.insertAdjacentHTML('beforeend', barraBanco(eur(st.banco)));
    const sub = $('div', `font:700 18px system-ui;color:${ORO};margin:12px 22px;text-align:center;min-height:52px;text-shadow:0 2px 3px #000`); p.appendChild(sub);
    const fr = st.relevos > 1 ? [L.caeOtra, L.relevo, L.bienvenido] : [L.cae, L.relevo, L.mira, L.bienvenido]; const tk = st.pant; let i = 0;
    const sig = () => { if (st.pant !== tk || !raiz) return; const f = fr.filter(Boolean)[i++]; if (!f) { tablero(riaF('elige2', { n: st.nombre })); return; } sub.textContent = '🎙️ ' + f; voz2(f); setTimeout(sig, 1200 + f.length * 55); };
    p.appendChild(boton('▶ ' + riaF('continuar2'), () => { if (st.pant === tk) tablero(riaF('elige2', { n: st.nombre })); }, true));
    sig(); return true;
  }
  function ia2Elige() { const tk = st.pant; setTimeout(() => { if (st.pant !== tk || !raiz || st.bloqueo || st.enDuelo) return; const L = quedan2(); if (!L.length) return final(false, true); previa(L[Math.floor(Math.random() * L.length)]); }, 1600 + Math.random() * 1600); }
  function ia2Barra() { if (!raiz) return; let b = raiz.querySelector('.ria2'); if (b) b.remove(); b = $('div', `position:absolute;left:8px;top:8px;z-index:5;background:#000c;border:2px solid ${ORO};border-radius:14px;padding:6px 8px;font:700 13px system-ui;color:#fff;text-align:center;max-width:46vw`);
    b.className = 'ria2'; b.innerHTML = `<div>${riaF('barra')}</div><div>🤖 ${esc0(st.nombre)} · 💰 ${eur(st.banco)}</div>`;
    const bs = (t, fn) => { const x = $('button', `margin:4px 2px 0;padding:6px 10px;border-radius:16px;border:2px solid ${ORO};background:#1b2a5a;color:#fff;font:700 12px system-ui;cursor:pointer`, t); x.onclick = fn; return x; };
    b.append(bs(riaF('saltar'), () => ia2Salta()), bs(riaF('menu'), () => cerrar())); raiz.appendChild(b); }
  function ia2Salta() { if (st.salirDuelo) st.salirDuelo(); clearTimeout(st.tmPrevia); st.bloqueo = false; st.enDuelo = false;
    for (let g = 0; g < 40; g++) { const L = quedan2(); if (!L.length) return final(false, true); const r = L[Math.floor(Math.random() * L.length)];
      if (Math.random() < .7) { r.fuera = true; st.ganados++; st.banco += r.cifra; if (!quedan2().length) return final(false, true); if (Math.random() < (st.banco < 60000 ? .1 : .3)) return final(true); }
      else if (!relevo2d(r, true)) return final(false, false, r); }
    final(true); }
  function ia2Final(plantado, bote, r) { const t = bote ? riaF('bote2', { n: st.nombre, a: eur(st.banco + (E.bote || 100000)) }) : plantado ? riaF('planta2', { n: st.nombre, a: eur(st.banco) }) : riaF('cae2', { n: st.nombre, r: r ? r.n : '' });
    return t + ' ' + riaF('resumen2', { k: st.hGanados || 0, g: st.relevos || 0 }); }
  function inicio() { const p = pantalla(); p.appendChild($('div', 'height:8vh')); p.appendChild(logo(150));
    p.appendChild($('div', `font:900 22px system-ui;color:${ORO};margin:10px;text-shadow:0 2px 4px #000`, 'App clásica'));
    p.appendChild($('div', 'color:#fff;opacity:.85;text-align:center;margin:0 22px 14px;font:15px system-ui;max-width:460px', 'Como en Antena 3 (2011-2021): elige a tus 10 oponentes uno a uno. Cada duelo tiene pista, casillas que se van destapando y un reloj para cada uno: si se te acaba el tiempo, ¡caes! Tras cada duelo ganado ves la cifra de su trampilla. Tienes 2 PASAR. Tras cada duelo ganado puedes plantarte. Tira a los 10 y te llevas el bote.'));
    const n = $('input', `padding:10px;border-radius:12px;border:3px solid ${ORO};background:#000a;color:#fff;font:800 18px system-ui;text-align:center;width:220px`); n.value = localStorage.getItem('ac_clasica_nombre') || ''; n.placeholder = 'Tu nombre'; n.addEventListener('keydown', e => e.stopPropagation());
    p.append(n, boton('▶ JUGAR', () => { paraMus(); localStorage.setItem('ac_clasica_nombre', n.value.trim() || 'Tú'); nuevo(); tablero(); }, true, 'font-size:22px;padding:14px 40px'), boton('🏠 Volver al menú', () => cerrar())); }
  function cerrar() { if (st && st.salirDuelo) st.salirDuelo(); if (st) clearTimeout(st.tmPrevia); paraMus(); if (raiz) raiz.remove(); raiz = null; }
  function abrir() { if (raiz) return; raiz = $('div', 'position:fixed;inset:0;z-index:99980;font-family:system-ui'); ['pointerdown', 'pointerup', 'click', 'keydown', 'wheel', 'touchstart'].forEach(ev => raiz.addEventListener(ev, e => e.stopPropagation()));
    if (!document.getElementById('acgira-css')) { const s = $('style'); s.id = 'acgira-css'; s.textContent = '@keyframes acgira{to{transform:translate(-50%,-50%) rotate(360deg)}}'; document.head.appendChild(s); }
    document.body.appendChild(raiz); inicio(); fondoMus(SND.intro, false, .8); }
  return { abrir, _st: () => st, _caida: caida, _previa: previa, _moneda: moneda, _decision: decision };
})();
window.AppClasica = AppClasica;
