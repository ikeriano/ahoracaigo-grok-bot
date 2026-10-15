// v1.25 · (1) comodines verdes (huellas) hasta 33 · (2) comodines especiales (33 tipos con efecto)
const CMD_MAX = 33;
function cmdIni(def) { const v = it && it.comodines; return v && v !== 'normal' ? Math.max(1, Math.min(CMD_MAX, +v)) : def; }
// --- (1) contador de huellas verdes: compacto en columnas cuando hay más de 3
Pn = function (a, e) {
  const t = document.getElementById('vidas'); if (!t) return;
  if (a < 0) { t.innerHTML = ''; return; }
  if (a <= 3) { const n = String(Math.min(3, a)) + (e && a < 3 ? 'b' : ''), i = bf('Vidas', n); t.innerHTML = `<img src="${xr(i.f)}" style="width:${i.w * 0.5}px;filter:drop-shadow(0 2px 4px #000)">`; t.className = ''; return; }
  const n = Math.min(CMD_MAX, a), filas = 11, col = Math.ceil(n / filas), d = Math.max(20, Math.min(40, Math.floor((innerHeight * 0.6) / Math.min(filas, n))));
  if (!Pn.__uno) { if (!Pn.__cargando) { Pn.__cargando = 1; const im = new Image(); im.onload = () => { const w = im.naturalWidth, h = im.naturalHeight / 3, cv = document.createElement('canvas'); cv.width = w; cv.height = Math.round(h); cv.getContext('2d').drawImage(im, 0, 0, w, h, 0, 0, w, h); Pn.__uno = cv.toDataURL(); Pn(a, e); }; im.src = xr(bf('Vidas', '3').f); } }
  const src = Pn.__uno || xr(bf('Vidas', '3').f);
  t.className = 'vMuchas'; t.style.setProperty('--vd', d + 'px');
  t.innerHTML = `<div class="vGrid" style="grid-template-rows:repeat(${Math.min(filas, n)},${d}px);grid-auto-columns:${d}px">` + Array.from({ length: n }, () => `<img src="${src}">`).join('') + `</div><div class="vNum">×${n}</div>`;
};
// --- (2) comodines especiales
const CMD_CSS = `#vidas.vMuchas .vGrid{display:grid;grid-auto-flow:column;gap:3px}#vidas.vMuchas img{width:var(--vd);height:var(--vd);object-fit:contain;filter:drop-shadow(0 1px 2px #000)}#vidas.vMuchas .vNum{font:800 15px Barlow Condensed,sans-serif;color:#b8ff9a;text-shadow:0 1px 3px #000;margin-top:2px}
#cmdBtn{position:fixed;left:12px;bottom:14px;z-index:60;display:none;align-items:center;gap:6px;padding:7px 12px 7px 8px;border-radius:30px;border:3px solid #ffd23a;background:linear-gradient(#6a2bd8,#2a0f7a);color:#fff;font:800 16px Barlow Condensed,sans-serif;box-shadow:0 3px 10px #000a;cursor:pointer}
#cmdBtn b{background:#ffd23a;color:#2a0f7a;border-radius:12px;padding:0 7px}#cmdBtn.on{display:flex}
#cmdTray{position:fixed;left:10px;bottom:66px;z-index:61;display:none;gap:8px;flex-wrap:wrap;max-width:min(92vw,720px)}#cmdTray.on{display:flex}
.cmdC{width:118px;padding:8px 6px;border-radius:14px;border:2px solid #ffd23a;background:linear-gradient(#3b1aa0,#160650);color:#fff;text-align:center;font:600 12px Barlow Condensed,sans-serif;box-shadow:0 3px 8px #000a;cursor:pointer}
.cmdC i{display:flex;margin:0 auto 4px;width:46px;height:46px;border-radius:50%;align-items:center;justify-content:center;font-style:normal;font-size:25px;background:radial-gradient(circle at 35% 30%,#ffe98a,#f39a12 60%,#a85a00);border:2px solid #fff6;box-shadow:inset 0 -3px 6px #0006}
.cmdC b{display:block;font-size:15px;color:#ffd23a}.cmdC.off{opacity:.38;filter:grayscale(.7);cursor:default}
#cmdSel{position:fixed;inset:0;z-index:70;background:#020a2ccc;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#fff;font:700 22px Barlow Condensed,sans-serif}
#cmdSel .cmdRow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:860px}#cmdSel .cmdC.sel{border-color:#7dff6a;box-shadow:0 0 14px #7dff6a}
#cmdCat{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px;margin-top:8px}#cmdCat .cmdC{width:auto;cursor:default}`;
const CMD = [
  // [id, icono, nombre, tipo, desc tú, desc vos]
  ['mas5', '⏱️', 'Más tiempo', 'any', 'Sumas 5 segundos a tu reloj.', 'Sumás 5 segundos a tu reloj.'],
  ['mas10', '⏰', 'Diez de regalo', 'any', 'Sumas 10 segundos a tu reloj.', 'Sumás 10 segundos a tu reloj.'],
  ['prorroga', '🕐', 'Prórroga', 'any', 'Sumas 15 segundos a tu reloj.', 'Sumás 15 segundos a tu reloj.'],
  ['arena', '⌛', 'Reloj de arena', 'any', 'Tu reloj se para 8 segundos.', 'Tu reloj se para 8 segundos.'],
  ['lenta', '🐢', 'Cámara lenta', 'any', 'Tu reloj va a mitad de velocidad 15 segundos.', 'Tu reloj va a mitad de velocidad 15 segundos.'],
  ['reinicio', '🔄', 'Reloj nuevo', 'chess', 'Tu reloj vuelve al tiempo inicial.', 'Tu reloj vuelve al tiempo inicial.'],
  ['congelar', '🧊', 'Congelar', 'any', 'Congelas el reloj del rival 10 segundos.', 'Congelás el reloj del rival 10 segundos.'],
  ['siesta', '😴', 'Siesta del rival', 'any', 'El reloj del rival se duerme 5 segundos.', 'El reloj del rival se duerme 5 segundos.'],
  ['turbo', '🚀', 'Turbo al rival', 'any', 'El reloj del rival corre al doble 12 segundos.', 'El reloj del rival corre al doble 12 segundos.'],
  ['roba1', '🤏', 'Robar un segundo', 'chess', 'Le quitas 1 segundo al rival y te lo quedas.', 'Le sacás 1 segundo al rival y te lo quedás.'],
  ['ladron', '🦹', 'Ladrón de tiempo', 'chess', 'Le robas 5 segundos al rival.', 'Le robás 5 segundos al rival.'],
  ['bomba', '💣', 'Bomba de relojería', 'chess', 'El rival pierde 8 segundos.', 'El rival pierde 8 segundos.'],
  ['tijera', '✂️', 'Medio reloj', 'chess', 'El reloj del rival se queda en la mitad.', 'El reloj del rival queda en la mitad.'],
  ['igualador', '⚖️', 'Igualador', 'chess', 'Tu reloj se iguala al del que más tiempo tiene.', 'Tu reloj se empareja con el que más tiempo tiene.'],
  ['rayo', '⚡', 'Rayo', 'chess', 'El rival pierde 3 segundos y se congela 3 más.', 'El rival pierde 3 segundos y se congela 3 más.'],
  ['respiro', '🫁', 'Respiro', 'any', 'Todos los relojes se paran 6 segundos.', 'Todos los relojes se paran 6 segundos.'],
  ['letra', '🔤', 'Letra regalo', 'text', 'Te escribimos la siguiente letra.', 'Te escribimos la letra que sigue.'],
  ['dosletras', '🔡', 'Doble letra', 'text', 'Te escribimos dos letras.', 'Te escribimos dos letras.'],
  ['ultima', '🔚', 'Última letra', 'text', 'Te chivamos la última letra.', 'Te soplamos la última letra.'],
  ['cuantas', '🔢', 'Cuenta letras', 'text', 'Sabrás cuántas faltan y por cuál empieza.', 'Vas a saber cuántas faltan y con cuál empieza.'],
  ['sabio', '🦉', 'El sabio', 'answer', 'El sabio responde por ti.', 'El sabio responde por vos.'],
  ['salto', '⏭️', 'Salto', 'skip', 'Saltas la pregunta sin gastar huella.', 'Saltás la pregunta sin gastar huella.'],
  ['cincuenta', '🌗', '50/50', 'opts', 'Quita una respuesta incorrecta.', 'Saca una respuesta incorrecta.'],
  ['publico', '👥', 'Pregunta al público', 'help', 'El público vota (casi siempre acierta).', 'La tribuna vota (casi siempre la pega).'],
  ['llamada', '📞', 'Llamada a un amigo', 'help', 'Un amigo te da una pista.', 'Un amigo te tira una pista.'],
  ['espejo', '🪞', 'Espejo mágico', 'opts', 'Brilla la respuesta correcta.', 'Brilla la respuesta correcta.'],
  ['vida', '🦶', 'Huella extra', 'prog', 'Ganas un comodín verde.', 'Ganás un comodín verde.'],
  ['lluvia', '👣', 'Lluvia de huellas', 'prog', 'Ganas tres comodines verdes.', 'Ganás tres comodines verdes.'],
  ['escudo', '🛡️', 'Escudo', 'prog', 'Si pierdes este duelo, se repite.', 'Si perdés este duelo, se repite.'],
  ['cambio', '🎲', 'Cambio de prueba', 'progP', 'El próximo duelo será de otra prueba.', 'El próximo duelo va a ser de otra prueba.'],
  ['trampilla', '🔀', 'Cambio de trampillas', 'progP', 'Se barajan los premios de las trampillas.', 'Se mezclan los premios de las trampillas.'],
  ['doble', '✖️', 'Bote doble', 'progP', 'Si ganas este duelo, doblas tu bote.', 'Si ganás este duelo, duplicás tu bote.'],
  ['saque', '🎯', 'Saque', 'prog', 'En el próximo duelo empiezas tú.', 'En el próximo duelo arrancás vos.']
];
const CMDI = Object.fromEntries(CMD.map(c => [c[0], c]));
const cmdS = { ctx: null, mods: [], vt: 0, last: 0 };
function cmdTurn() { const W = window; return (W.__e3 && W.__e3.turn) || (W.__ar && W.__ar.turno) || (W.__duel && W.__duel.turn) || 'me'; }
function cmdRate(who) { const n = performance.now(); let r = 1; cmdS.mods = cmdS.mods.filter(m => m.hasta > n); for (const m of cmdS.mods) if (m.who === who || m.who === 'all') r *= m.f; return r; }
function cmdNow() { const r = performance.now(); if (!cmdS.last) { cmdS.last = r; cmdS.vt = r; } cmdS.vt += (r - cmdS.last) * cmdRate(cmdTurn()); cmdS.last = r; return cmdS.vt; }
function cmdClocks() { const W = window, c = cmdS.ctx; if (!c) return null; if (W.__ar && W.__ar.clocks && W.__ar.id !== 'entredos') return W.__ar.clocks; if (W.__duel && W.__duel.clocks && (c.id === 'clasico' || c.id === 'gallina')) return W.__duel.clocks; return null; }
function cmdAdd(who, s) { const k = cmdClocks(); if (k) { k[who] = Math.max(0.5, k[who] + s); return true; } if (cmdTurn() === who) { cmdNow(); cmdS.vt -= s * 1000; return true; } return false; }
function cmdTexto() { // pregunta de escribir activa en tu turno
  const W = window, A = W.__ar; if (A && A.id !== 'entredos' && A.turno === 'me' && A.q && A.escribe) {
    const q = A.q; if (q.modo === 'huecos') { const k = q.celdas.findIndex(c => !c.fija && !c.l); const falt = q.celdas.filter(c => !c.fija).map(c => c.sol); return { falt, ya: q.celdas.filter(c => !c.fija && c.l).length, pon: () => { const c = q.celdas.find(c => !c.fija && !c.l); c && A.escribe(c.sol); } }; }
    const obj = q.unidad === 'palabra' ? arNorm(q.resp).split(' ') : [...arLetras(q.resp)];
    return { falt: obj, ya: q.orden.length, pon: () => { const x = obj[q.orden.length]; const j = q.resto.indexOf(x); j >= 0 && A.escribe({ tap: q.orden.length + j }); } };
  }
  const pn = typeof hu !== 'undefined' ? hu : W.__panel; if (pn && pn.active && pn.q && pn.q.missing && pn.input) {
    const m = pn.q.missing; return { falt: m, ya: Math.min(pn.input.value.length, m.length), pon: () => { pn.input.value = m.slice(0, pn.input.value.length + 1).join(''); pn.onInput(); }, pn };
  }
  return null;
}
function cmdOpts() { const W = window; if (W.__e3 && W.__e3.turn === 'me' && W.__e3.q && document.getElementById('e3')) return { bien: W.__e3.q[2], bs: [...document.querySelectorAll('#e3 .e3b')], elige: W.__e3.choose }; const A = W.__ar; if (A && A.id === 'entredos' && A.turno === 'me' && A.q && A.elige) return { bien: A.q.bien, bs: [...document.querySelectorAll('#arP .arO')], elige: A.elige }; return null; }
function cmdSkip() { const A = window.__ar; if (A && A.id !== 'entredos' && A.turno === 'me' && A.pasa) return () => A.pasa(); const pn = typeof hu !== 'undefined' ? hu : null, c = cmdS.ctx; if (pn && pn.active && pn.pasaCb && c && c.a) return () => { c.a.vidas++; pn.pasaCb(); }; return null; }
function cmdPuede(id) {
  const c = cmdS.ctx; if (!c) return false; const tipo = CMDI[id][3];
  if (tipo === 'any') return true; if (tipo === 'chess') return !!cmdClocks(); if (tipo === 'text') return !!cmdTexto(); if (tipo === 'opts') return !!cmdOpts();
  if (tipo === 'answer' || tipo === 'help') return !!(cmdTexto() || cmdOpts()); if (tipo === 'skip') return !!cmdSkip();
  if (tipo === 'prog') return true; if (tipo === 'progP') return !c.t.training; return false;
}
function cmdDi(txt) { try { yn.say(txt, 2600, undefined, me.presentador, { voice: false }); } catch (x) { } }
function cmdUsa(id) {
  const c = cmdS.ctx; if (!c || !cmdPuede(id)) return false; const mano = c.mano, k = mano.indexOf(id); if (k < 0) return false;
  const [, ico, nom, , dTu, dVos] = CMDI[id], AR = !!window.__AR, n = performance.now(), M = (who, f, s) => cmdS.mods.push({ who, f, hasta: n + s * 1000 });
  const K = cmdClocks(); let extra = '';
  switch (id) {
    case 'mas5': cmdAdd('me', 5); break; case 'mas10': cmdAdd('me', 10); break; case 'prorroga': cmdAdd('me', 15); break;
    case 'arena': M('me', 0, 8); break; case 'lenta': M('me', 0.5, 15); break; case 'reinicio': K.me = Math.max(K.me, c.T0 || 30); break;
    case 'congelar': M('bot', 0, 10); break; case 'siesta': M('bot', 0, 5); break; case 'turbo': M('bot', 2, 12); break;
    case 'roba1': { const q = Math.min(1, K.bot - 0.5); K.bot -= q; K.me += q; break; } case 'ladron': { const q = Math.min(5, K.bot - 0.5); K.bot -= q; K.me += q; break; }
    case 'bomba': K.bot = Math.max(0.5, K.bot - 8); break; case 'tijera': K.bot = Math.max(0.5, K.bot / 2); break; case 'igualador': K.me = Math.max(K.me, K.bot); break;
    case 'rayo': K.bot = Math.max(0.5, K.bot - 3); M('bot', 0, 3); break; case 'respiro': M('all', 0, 6); break;
    case 'letra': cmdTexto().pon(); break; case 'dosletras': { const T = cmdTexto(); T.pon(); setTimeout(() => { const U = cmdTexto(); U && U.pon(); }, 120); break; }
    case 'ultima': { const T = cmdTexto(); extra = (AR ? ' Termina con «' : ' Acaba en «') + T.falt[T.falt.length - 1] + '».'; break; }
    case 'cuantas': { const T = cmdTexto(); extra = ` ${AR ? 'Te faltan' : 'Te faltan'} ${T.falt.length - T.ya} y empieza por «${T.falt[0]}».`; break; }
    case 'sabio': { const T = cmdTexto(); if (T) { if (T.pn) { T.pn.input.value = T.falt.join(''); T.pn.onInput(); } else { const go = () => { const U = cmdTexto(); if (U && U.ya < U.falt.length) { U.pon(); setTimeout(go, 140); } }; go(); } } else { const O = cmdOpts(); O.elige(O.bien); } break; }
    case 'salto': cmdSkip()(); break;
    case 'cincuenta': { const O = cmdOpts(); const mal = O.bs.map((_, i) => i).filter(i => i !== O.bien && !O.bs[i].disabled); if (mal.length) { const b = O.bs[mal[Math.floor(Math.random() * mal.length)]]; b.disabled = true; b.style.opacity = '.25'; } break; }
    case 'espejo': { const O = cmdOpts(); O.bs[O.bien] && (O.bs[O.bien].style.boxShadow = '0 0 22px 6px #7dff6a'); break; }
    case 'publico': { const O = cmdOpts(); if (O) { const ok = Math.random() < 0.85 ? O.bien : (O.bien + 1) % O.bs.length, pr = O.bs.map((_, i) => i === ok ? 0 : Math.random()); const rest = 100 - (55 + Math.floor(Math.random() * 30)); const s = pr.reduce((x, y) => x + y, 0) || 1; extra = ' ' + O.bs.map((b, i) => `${i + 1}: ${i === ok ? 100 - rest : Math.round(rest * pr[i] / s)}%`).join(' · '); } else { const T = cmdTexto(); extra = (AR ? ' La tribuna grita: «¡' : ' El público grita: «¡') + T.falt[0] + '!»'; } break; }
    case 'llamada': { const O = cmdOpts(); if (O) { const ok = Math.random() < 0.8 ? O.bien : (O.bien + 1) % O.bs.length; extra = (AR ? ' «Che, yo diría la ' : ' «Yo diría la ') + (ok + 1) + '»'; } else { const T = cmdTexto(); extra = (AR ? ' «Che, arranca así: ' : ' «Empieza así: ') + T.falt.slice(0, Math.ceil(T.falt.length / 2)).join(T.falt[0].length > 1 ? ' ' : '') + '…»'; } break; }
    case 'vida': c.a.vidas = Math.min(CMD_MAX, c.a.vidas + 1); Pn(c.a.vidas, !!c.a.vidaExtra); break;
    case 'lluvia': c.a.vidas = Math.min(CMD_MAX, c.a.vidas + 3); Pn(c.a.vidas, !!c.a.vidaExtra); break;
    case 'escudo': c.escudo = true; break; case 'doble': c.doble = true; break; case 'cambio': c.a.__cmdCambio = true; break; case 'saque': c.a.__cmdSaque = true; break;
    case 'trampilla': { const v = c.a.cifrasT; if (Array.isArray(v)) for (let i = v.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [v[i], v[j]] = [v[j], v[i]]; } break; }
  }
  mano.splice(k, 1); (c.usados = c.usados || []).push(id); F.play('SomPalavra@Teclado27');
  cmdDi(`${AR ? '¡Usás' : '¡Usas'} el comodín «${nom}» ${ico}! ${AR ? dVos : dTu}${extra}`); cmdPinta(); return true;
}
function cmdCarta(id, extra = '') { const [, ico, nom, , dTu, dVos] = CMDI[id]; return `<div class="cmdC ${extra}" data-id="${id}"><i>${ico}</i><b>${nom}</b>${window.__AR ? dVos : dTu}</div>`; }
function cmdUI() {
  if (document.getElementById('cmdBtn')) return; const st = document.createElement('style'); st.textContent = CMD_CSS; document.head.appendChild(st);
  const b = document.createElement('button'); b.id = 'cmdBtn'; b.className = 'ui'; b.innerHTML = '🃏 <span>COMODINES ESPECIALES</span> <b>0</b>'; document.body.appendChild(b);
  const t = document.createElement('div'); t.id = 'cmdTray'; t.className = 'ui'; document.body.appendChild(t);
  b.onclick = ev => { ev.stopPropagation(); t.classList.toggle('on'); cmdPinta(); F.play('Tecla'); };
  t.onclick = ev => { ev.stopPropagation(); const el = ev.target.closest('.cmdC'); if (el && !el.classList.contains('off')) { cmdUsa(el.dataset.id); t.classList.remove('on'); } };
}
function cmdPinta() { const b = document.getElementById('cmdBtn'), t = document.getElementById('cmdTray'), c = cmdS.ctx; if (!b) return; const on = !!(c && c.mano && c.mano.length); b.classList.toggle('on', on); if (!on) t.classList.remove('on'); if (!c) return; b.querySelector('b').textContent = c.mano.length; t.innerHTML = c.mano.map(id => cmdCarta(id, cmdPuede(id) ? '' : 'off')).join(''); }
setInterval(() => { const t = document.getElementById('cmdTray'); t && t.classList.contains('on') && cmdPinta(); }, 500);
const cmdAzar = (n, ex = []) => { const p = CMD.map(c => c[0]).filter(x => !ex.includes(x)); for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p.slice(0, n); };
async function cmdElige(oferta) { // selección al empezar el programa: elige 3 de 6
  cmdUI(); const AR = !!window.__AR, d = document.createElement('div'); d.id = 'cmdSel'; d.className = 'ui';
  d.innerHTML = `<div>🃏 ${AR ? 'Elegí 3 comodines especiales' : 'Elige 3 comodines especiales'}</div><div class="cmdRow">${oferta.map(id => cmdCarta(id)).join('')}</div><div style="font-size:15px;opacity:.8">${AR ? 'Los usás en los duelos con el botón 🃏 (aparte de tus huellas verdes)' : 'Se usan en los duelos con el botón 🃏 (aparte de tus huellas verdes)'}</div>`;
  document.body.appendChild(d); const sel = [];
  return await new Promise(res => { const fin = () => { clearTimeout(to); d.remove(); res(sel.length ? sel : oferta.slice(0, 3)); };
    d.onclick = ev => { ev.stopPropagation(); const el = ev.target.closest('.cmdC'); if (!el || el.classList.contains('sel')) return; el.classList.add('sel'); sel.push(el.dataset.id); F.play('Tecla'); sel.length >= 3 && setTimeout(fin, 350); };
    const to = setTimeout(() => { while (sel.length < 3) sel.push(oferta.find(x => !sel.includes(x))); fin(); }, window.__cmdAuto ? 600 : 15000); });
}
const CMD_ORIG = {};
function cmdEnvuelve() {
  for (const k in cu) { if (CMD_ORIG[k] || !cu[k].jugar) continue; CMD_ORIG[k] = cu[k].jugar;
    cu[k].jugar = async (a, e, t = {}) => {
      const W = window; cmdUI();
      if (!it.especiales && it.especiales !== undefined) return CMD_ORIG[k](a, e, t);
      let id = k; if (a.__cmdCambio && !t.training) { a.__cmdCambio = false; const otras = Object.keys(CMD_ORIG).filter(x => x !== k && cu[x].lista && (!!cu[x].ar === !!W.__AR || !W.__AR)); otras.length && (id = otras[Math.floor(Math.random() * otras.length)]); }
      if (!a.__cmdMano) a.__cmdMano = t.training ? cmdAzar(4) : await cmdElige(cmdAzar(6));
      if (W.__cmdMano) a.__cmdMano = W.__cmdMano.slice(); // tests
      const saque = a.__cmdSaque, mf = W.__meFirst; if (saque) { a.__cmdSaque = false; W.__meFirst = true; }
      W.__ar = null; W.__e3 = null; W.__duel = null; cmdS.mods = []; cmdS.last = 0;
      const ctx = cmdS.ctx = { id, a, e, t, mano: a.__cmdMano, T0: W.__duelClock || 30 }; W.__cmd = ctx; cmdPinta();
      try {
        let r = await CMD_ORIG[id](a, e, t);
        if (r === 'lose' && ctx.escudo) { cmdDi(W.__AR ? '🛡️ ¡El escudo te salva! Repetimos el duelo, dale.' : '🛡️ ¡El escudo te salva! Repetimos el duelo.'); ctx.escudo = false; r = await CMD_ORIG[id](a, e, t); }
        if (r === 'win') { if (ctx.doble && a.placar > 0) { a.placar *= 2; cmdDi(W.__AR ? '✖️ ¡Bote doble! Duplicaste tu bote.' : '✖️ ¡Bote doble! Doblas tu bote.'); } if (!t.training && ctx.mano.length < 6) ctx.mano.push(cmdAzar(1, ctx.mano)[0]); }
        ctx.res = r; return r;
      } finally { if (saque) W.__meFirst = mf; cmdS.ctx = null; cmdS.mods = []; cmdPinta(); W.__cmdUltimo = ctx; }
    };
  }
}
cmdEnvuelve();
window.__cmdApi = { elige: cmdElige, azar: cmdAzar, lista: CMD, usa: cmdUsa, puede: cmdPuede, get ctx() { return cmdS.ctx; }, Pn: (n) => Pn(n, false) };
// opciones: número de comodines verdes + activar especiales + catálogo
function cmdOpcion() {
  const a = document.createElement('div'); a.className = 'ocustom'; a.id = 'optComodines';
  const AR = !!window.__AR, l = document.createElement('div'); l.className = 'olabel'; l.textContent = '🦶 Comodines verdes (huellas)'; a.appendChild(l);
  const r = document.createElement('div'); r.className = 'orow obtns';
  const vals = ['normal', 3, 5, 8, 10, 15, 20, 25, 30, 33]; const pinta = () => r.querySelectorAll('button').forEach(b => b.className = 'tbtn' + (String(it.comodines || 'normal') === b.dataset.v ? ' sel' : ''));
  vals.forEach(v => { const b = document.createElement('button'); b.dataset.v = String(v); b.textContent = v === 'normal' ? 'Normal' : v; b.onclick = ev => { ev.stopPropagation(); it.comodines = v === 'normal' ? 'normal' : v; Ii(); pinta(); F.play('Tecla'); }; r.appendChild(b); });
  pinta(); a.appendChild(r);
  const p = document.createElement('p'); p.className = 'onote'; p.textContent = 'Cuántos comodines verdes (PASAR) tienes al empezar: «Normal» usa los de la etapa; puedes ganar más en las trampillas, hasta un máximo de 33.'; a.appendChild(p);
  const l2 = document.createElement('div'); l2.className = 'olabel'; l2.textContent = '🃏 Comodines especiales'; a.appendChild(l2);
  const r2 = document.createElement('div'); r2.className = 'orow'; const lb = document.createElement('label'); lb.textContent = `${CMD.length} tipos con efecto (aparte de las huellas)`; const bt = document.createElement('button'); bt.id = 'btnEspeciales';
  const o = () => { const on = it.especiales !== false; bt.className = 'tbtn' + (on ? ' sel' : ''); bt.textContent = on ? 'Sí' : 'No'; };
  bt.onclick = ev => { ev.stopPropagation(); it.especiales = it.especiales === false; Ii(); o(); F.play('Tecla'); }; o(); r2.append(lb, bt); a.appendChild(r2);
  const cat = document.createElement('div'); cat.id = 'cmdCat'; cat.innerHTML = CMD.map(c => cmdCarta(c[0])).join(''); cmdUI(); a.appendChild(cat);
  return a;
}
