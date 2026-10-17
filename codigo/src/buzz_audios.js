// v1.34 · «Poner voz a Buzz (mis audios)»: el jugador importa SUS PROPIOS audios o vídeos (la app no trae audio de terceros),
// se copian dentro de la app (IndexedDB, almacenamiento privado) y se asignan a cada momento de Buzz en el Modo Fiesta
// y al «Audio de la promo» de Buzz. Si un momento no tiene audio, Buzz sigue con su voz Piper. Ligero: se reproduce con un
// <audio> (sin decodificar el archivo entero), así que vale también para vídeos largos en el Redmi A2.
const BZA_MOM = [['promo', '🎬 Audio de la promo de Buzz (toda la banda sonora)'], ['saludo', '👋 Saludo'], ['acierto', '✅ Acierto'], ['fallo', '❌ Fallo'], ['tartazo', '🥧 Tartazo'], ['trampillazo', '🕳️ Trampillazo'], ['victoria', '🏆 Victoria'], ['despedida', '👋 Despedida']];
const BZA = { db: null, urls: {}, el: null };
const bzaDB = () => BZA.db || (BZA.db = new Promise((res, rej) => { const r = indexedDB.open('ac_misaudios', 1); r.onupgradeneeded = () => r.result.createObjectStore('f', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
const bzaTx = async (modo, fn) => { const d = await bzaDB(); return new Promise((res, rej) => { const t = d.transaction('f', modo), q = fn(t.objectStore('f')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); };
const bzaLista = () => { try { return JSON.parse(localStorage.getItem('ac_misaudios_lista') || '[]'); } catch (e) { return []; } };
const bzaListaPon = L => localStorage.setItem('ac_misaudios_lista', JSON.stringify(L));
const maSlots = () => { let S = null; try { S = JSON.parse(localStorage.getItem('ac_ma_slots') || 'null'); } catch (e) { }
  if (!S || typeof S !== 'object') { S = {}; try { const B = JSON.parse(localStorage.getItem('ac_buzzslots') || '{}'); for (const k in B) S['buzz.' + k] = B[k]; } catch (e) { } try { localStorage.setItem('ac_ma_slots', JSON.stringify(S)); } catch (e) { } } return S; };
const maSlotsPon = S => { try { localStorage.setItem('ac_ma_slots', JSON.stringify(S)); } catch (e) { } };
const bzaSlots = () => { const S = maSlots(), o = {}; for (const k in S) if (k.startsWith('buzz.')) o[k.slice(5)] = S[k]; return o; };
const bzaSlotsPon = B => { const S = maSlots(); for (const k of Object.keys(S)) if (k.startsWith('buzz.')) delete S[k]; for (const k in B) S['buzz.' + k] = B[k]; maSlotsPon(S); };
const maOn = () => { try { return localStorage.getItem('ac_ma_on') !== '0'; } catch (e) { return true; } };
const bzaDur = blob => new Promise(res => { const a = new Audio(), u = URL.createObjectURL(blob); let ok = false; const fin = v => { if (ok) return; ok = true; URL.revokeObjectURL(u); res(v); }; a.preload = 'metadata'; a.onloadedmetadata = () => fin(isFinite(a.duration) ? Math.round(a.duration * 10) / 10 : 0); a.onerror = () => fin(0); setTimeout(() => fin(0), 6000); a.src = u; });
async function bzaImporta(files) { const L = bzaLista(); let n = 0;
  for (const f of files) { if (!/^(audio|video)\//.test(f.type) && !/\.(mp3|m4a|aac|ogg|opus|wav|flac|mp4|webm|3gp|mkv|mov)$/i.test(f.name)) continue;
    if (f.size > 120e6) { try { yn.toast('«' + f.name + '» es muy grande (máx. 120 MB)', 2600); } catch (e) { } continue; }
    const id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), blob = f.slice(0, f.size, f.type || 'audio/mpeg');
    try { await bzaTx('readwrite', s => s.put({ id, nombre: f.name, tipo: f.type, blob })); } catch (e) { try { yn.toast('No hay espacio para «' + f.name + '»', 2600); } catch (x) { } continue; }
    L.push({ id, nombre: f.name, video: /^video\//.test(f.type), dur: await bzaDur(blob), kb: Math.round(f.size / 1024) }); n++; }
  bzaListaPon(L); return n; }
async function bzaBorra(id) { await bzaTx('readwrite', s => s.delete(id)).catch(() => 0); bzaListaPon(bzaLista().filter(x => x.id !== id)); if (BZA.urls[id]) { URL.revokeObjectURL(BZA.urls[id]); delete BZA.urls[id]; }
  const S = maSlots(); for (const k in S) S[k].f = (S[k].f || []).filter(x => x !== id); maSlotsPon(S); }
async function bzaUrl(id) { if (BZA.urls[id]) return BZA.urls[id]; const r = await bzaTx('readonly', s => s.get(id)).catch(() => null); if (!r || !r.blob) return null; return BZA.urls[id] = URL.createObjectURL(r.blob); }
function maEligeK(k) { const s = maSlots()[k]; if (!s || !s.f || !s.f.length) return null; const L = bzaLista(); if (!L.length) return null;
  const ops = s.f.flatMap(x => x === 'rnd' ? L.map(y => y.id) : L.some(y => y.id === x) ? [x] : []); return ops.length ? { id: ops[Math.floor(Math.random() * ops.length)], ini: +s.ini || 0, fin: +s.fin || 0, k, sub: (s.sub || '').trim() } : null; }
function maElige(pj, mom) { if (!maOn() || !pj) return null; const k = pj + '.' + (mom || 'cualquiera'); return maEligeK(k) || (k !== 'buzz.promo' && mom !== 'cualquiera' ? maEligeK(pj + '.cualquiera') : null); }
const bzaElige = mom => maElige('buzz', mom);
const bzaTiene = mom => !!bzaElige(mom);
// reproduce un audio del jugador; devuelve { done: Promise, stop() } o null
async function bzaPlay(mom, vol = 1) { return maPlayE(bzaElige(mom), vol); }
async function maPlayE(e, vol = 1) { if (!e) return null; const u = await bzaUrl(e.id); if (!u) return null;
  bzaPara(); const a = new Audio(); BZA.el = a; a.preload = 'auto'; a.volume = Math.max(0, Math.min(1, vol * (zn && zn.enabled === false ? 0 : 1)));
  let fin = null; const done = new Promise(r => fin = r); const acaba = () => { clearInterval(iv); clearTimeout(tope); try { a.pause(); } catch (x) { } if (BZA.el === a) BZA.el = null; fin(); };
  a.onended = acaba; a.onerror = acaba; const iv = setInterval(() => { if (e.fin > e.ini && a.currentTime >= e.fin) acaba(); }, 100);
  const L = bzaLista().find(x => x.id === e.id), largo = (e.fin > e.ini ? e.fin - e.ini : (L && L.dur ? L.dur - e.ini : 30)); const tope = setTimeout(acaba, Math.min(90, Math.max(2, largo + 1.5)) * 1000);
  a.src = u; const arranca = () => { try { if (e.ini > 0) a.currentTime = e.ini; } catch (x) { } a.play().catch(acaba); };
  if (e.ini > 0) { a.onloadedmetadata = arranca; setTimeout(() => a.paused && arranca(), 1500); } else arranca();
  return { done, stop: acaba, a }; }
function bzaPara() { if (BZA.el) { try { BZA.el.pause(); BZA.el.onended && BZA.el.onended(); } catch (e) { } BZA.el = null; } }
// Modo Fiesta: momento con bocadillo (el texto se sigue viendo); true si sonó un audio del jugador
async function buzzAudToca(mom, ses, pj = 'buzz') { try { const el = maElige(pj, mom); if (el) maLog(pj, mom, el.k); const r = await maPlayE(el); if (!r) return false; let ya = false; r.done.then(() => ya = true); try { await ses.until(() => ya); } catch (e) { r.stop(); throw e; } return true; } catch (e) { if (e === _o) throw e; return false; } }
function buzzAudSuelto(mom, bur, txt) { if (!bzaTiene(mom)) return; bzaPlay(mom).then(r => { if (!r || !bur) return; const ant = bur.innerHTML, vis = bur.style.display; bur.innerHTML = `<b>Buzz:</b> ${txt}`; bur.style.display = 'block'; r.done.then(() => { if (bur.innerHTML.includes(txt)) { bur.innerHTML = ant; bur.style.display = vis; } }); }).catch(() => 0); }
// =====================================================================================================
// v1.36 · «🎤 Mis audios» para TODOS los personajes: Adrián Vega y los demás presentadores (Marga, Bruno, Rita, Quique y Tano en
// el modo Argentina), el concursante central, los diez oponentes, Buzz, Don Arturo, copresentadores/equipo y la voz en off de
// las promos. Se elige personaje → momento (se ve la frase del juego) → audio(s), recorte con barra (Marcar inicio / Marcar fin),
// subtítulo editable, Probar y Quitar. Un audio del jugador sustituye SOLO la voz de ese personaje en ese momento.
// =====================================================================================================
const MA6 = { cache: {}, ultimo: null };
const maEsc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MA_NT0 = (() => { const o = {}; try { for (const k in Nt) o[k] = Nt[k]; if (PRES.ntBase) for (const k in PRES.ntBase) o[k] = PRES.ntBase[k]; } catch (e) { } return o; })();
const MA_MOM_HOST = [['saludo', '👋 Saludo / bienvenida'], ['presenta', '🙋 Presenta a los concursantes'], ['pregunta', '❓ Presenta la pregunta o el duelo'], ['acierto', '✅ Acierto'], ['fallo', '❌ Fallo / se acaba el tiempo'], ['trampilla', '🕳️ Se abre la trampilla'], ['victoria', '🏆 Victoria'], ['derrota', '😢 Derrota'], ['despedida', '👋 Despedida'], ['cualquiera', '💬 Cualquier otra frase']];
const MA_MOM_CONC = [['saludo', '👋 Se presenta'], ['acierto', '✅ «¡Lo sé!» / acierta'], ['fallo', '❌ «¡Paso!» / falla'], ['trampilla', '🕳️ Cae por la trampilla'], ['cualquiera', '💬 Cualquier otra frase']];
const maHost = () => { try { return Ke.__AR ? 'tano' : ((presActivo() || {}).id || 'adrian'); } catch (e) { return 'adrian'; } };
const MA_HOSTS = () => [['adrian', '🎙️', 'Adrián Vega', 'Presentador principal'], ...PRES_DATOS.map(p => [p.id, '🎤', p.nombre, 'Presentador · ' + p.estilo]), ['tano', '🇦🇷', (typeof AR_HOST !== 'undefined' && AR_HOST.nombre) || 'Tano Ferreyra', 'Presentador del modo Argentina']];
function maPersonajes() {
  const G = [];
  G.push(['Presentadores', MA_HOSTS().map(([id, ic, n, r]) => ({ id, ic, n, r, mom: MA_MOM_HOST }))]);
  const C = [{ id: 'central', ic: '🧑', n: (me.central || 'Tú') + ' (concursante central)', r: 'Quien juega en la trampilla central', mom: MA_MOM_CONC }];
  for (let k = 1; k <= 10; k++) C.push({ id: 'rival' + k, ic: '🕴️', n: me.rival(k), r: 'Oponente ' + k, mom: MA_MOM_CONC });
  G.push(['Concursantes', C]);
  G.push(['Fiesta, sketches y equipo', [
    { id: 'buzz', ic: '🕺', n: 'Buzz', r: 'Presentador del Modo Fiesta', mom: [...BZA_MOM, ['cualquiera', '💬 Cualquier otra frase']] },
    { id: 'arturo', ic: '👴', n: 'Don Arturo', r: 'Sketch «El regreso de Don Arturo»', mom: [['saludo', '👋 Su entrada'], ['despedida', '👋 Su última frase'], ['cualquiera', '💬 Cualquier frase']] },
    { id: 'otros', ic: '🎭', n: 'Copresentadores, equipo y público', r: 'Toni, Lola, Rober, Nuria, Luis, Carmen, Manolo, «El jefe»…', mom: [['cualquiera', '💬 Cualquier frase']] }]]);
  let P = []; try { P = Object.values(PROMOS).filter(p => p && p.id && p.nombre).map(p => [p.id, '🎬 Promo «' + p.nombre + '» (toda la banda sonora)']); } catch (e) { }
  G.push(['Voz en off', [{ id: 'off', ic: '📢', n: 'Voz en off / promos', r: 'Sustituye el audio de las promos', mom: [...P, ['cualquiera', '🎬 Cualquier promo']] }]]);
  return G;
}
const maPjInfo = id => { for (const [, L] of maPersonajes()) for (const p of L) if (p.id === id) return p; return null; };
// frases del juego de cada personaje y momento (para clasificar y para enseñarlas en el panel)
const maArr = x => (Array.isArray(x) ? x : x == null ? [] : [x]).filter(t => typeof t === 'string');
function maPools(pj) {
  if (MA6.cache[pj]) return MA6.cache[pj];
  const P = {}; const pon = (m, x) => { (P[m] = P[m] || []).push(...maArr(x)); };
  if (['adrian', 'tano'].includes(pj) || PRES_DATOS.some(p => p.id === pj)) {
    const g = PRES_DATOS.find(p => p.id === pj); const nt = pj === 'tano' && typeof AR_NT !== 'undefined' ? { ...MA_NT0, ...AR_NT } : g ? { ...MA_NT0, ...g.nt } : MA_NT0;
    if (pj === 'tano' && typeof AR_SALUDO !== 'undefined') pon('saludo', AR_SALUDO[0]);
    if (g) { pon('saludo', Object.values(g.saludo)); pon('saludo', g.intro); pon('pregunta', g.duelo); pon('pregunta', g.moneda); pon('pregunta', g.decision); pon('pregunta', g.final); pon('victoria', g.gana); pon('victoria', g.planta); pon('derrota', g.pierde); pon('despedida', g.adios); }
    if (pj === 'adrian') try { for (const t of Do) { pon('saludo', t.saludo); pon('despedida', Wv(t)); } } catch (e) { }
    pon('presenta', nt.sube); pon('presenta', nt.equipo); try { pon('presenta', rv.map(x => x[1])); pon('presenta', iv.map(x => x[1])); } catch (e) { }
    pon('pregunta', nt.elige); pon('pregunta', nt.elegidoT); pon('pregunta', nt.turnoTu); pon('pregunta', nt.turnoBot); pon('pregunta', nt.final);
    pon('acierto', nt.ok); pon('fallo', nt.tiempo); pon('fallo', nt.botTiempo); pon('fallo', nt.pasa); pon('fallo', nt.pasaSin);
    try { pon('trampilla', w2['AhoraCaigo - Queda.mp3'].map(x => x[2])); } catch (e) { }
    pon('victoria', nt.ganado); pon('victoria', nt.plantas); pon('derrota', nt.cero);
    if (pj === 'adrian') try { pon('despedida', Wv({ id: 'normal' })); } catch (e) { }
  } else if (pj === 'buzz') { const K = { promo: 'promo', saludo: 'hola', acierto: 'bien', fallo: 'mal', tartazo: 'tarta', victoria: 'gana', despedida: 'adios', cualquiera: 'ronda' };
    for (const m in K) try { pon(m, maArr(BUZZ_L[K[m]]).map(t => buzzTexto(t))); } catch (e) { } pon('trampillazo', '¡Trampillazo!');
  } else if (pj === 'arturo') { const R = ARTURO_GUION.filter(l => l[1] === 'r').map(l => l[2]); pon('saludo', R[0]); pon('despedida', R[R.length - 1]); pon('cualquiera', R.slice(1, -1));
  } else if (pj === 'central' || /^rival\d+$/.test(pj)) { pon('acierto', ['¡Lo sé!', '¡Voy a arriesgar!']); pon('fallo', ['¡Paso!', 'Paso…']); pon('saludo', '(su presentación: profesión y saludo)'); pon('trampilla', '(cuando cae por la trampilla)'); }
  const M = new Map(); for (const m in P) for (const t of P[m]) if (!M.has(t)) M.set(t, m);
  return MA6.cache[pj] = { P, M };
}
const MA_RX_HOST = [['despedida', /hasta la próxima|hasta mañana|nos vemos|chau|hasta aquí el programa|gracias por jugar/i], ['victoria', /has ganado|lo has conseguido|doblas|te llevas el bote|te plantas|ganaste/i], ['derrota', /ocupa tu sitio|está a cero|qué mala suerte|se queda con tu dinero/i],
  ['acierto', /^¡?(correct|muy bien|sí|toma ya|eso es|exacto|perfecto|bien)/i], ['fallo', /tiempo|incorrect|no es correct|lástima|qué pena|^¡?pasa/i], ['presenta', /a qué te dedicas|profesión|un aplauso para|vamos a conocer|trampilla central/i],
  ['pregunta', /pregunta|duelo|huella|elige|empieza|contesta|oponente número|moneda/i], ['saludo', /bienvenid|buenas noches|buenas tardes|^¡hola/i]];
const MA_RX_CONC = [['acierto', /lo sé|lo tengo|voy a arriesgar|ya sé/i], ['fallo', /^¡?paso|no sé|ni idea/i], ['saludo', /hola|me dedico|soy |trabajo|profesión|vengo/i]];
function maMomento(pj, txt) {
  const t = String(txt || '').trim(); const { M } = maPools(pj); if (M.has(t)) return M.get(t);
  if (['adrian', 'tano'].includes(pj) || PRES_DATOS.some(p => p.id === pj)) { for (const [m, r] of MA_RX_HOST) if (r.test(t) && (m !== 'acierto' || t.length < 45)) return m; }
  else if (pj === 'central' || /^rival\d+$/.test(pj)) { for (const [m, r] of MA_RX_CONC) if (r.test(t)) return m; }
  return 'cualquiera';
}
function maPj(nombre) {
  try { if (nombre === undefined || nombre === me.presentador) return maHost();
    if (typeof AR_HOST !== 'undefined' && nombre === AR_HOST.nombre) return 'tano'; if (nombre === 'Adrián Vega' || nombre === 'Adrián') return 'adrian';
    const g = PRES_DATOS.find(p => p.nombre === nombre); if (g) return g.id;
    if (nombre === me.central || nombre === me.tu || nombre === 'Tú') return 'central';
    for (let k = 1; k <= 10; k++) if (nombre === me.rival(k)) return 'rival' + k;
    if (/^Buzz/i.test(nombre)) return 'buzz'; if (/Arturo/i.test(nombre)) return 'arturo';
  } catch (e) { } return 'otros';
}
const maDur = e => { const L = bzaLista().find(x => x.id === e.id); return Math.max(0.5, e.fin > e.ini ? e.fin - e.ini : (L && L.dur ? L.dur - e.ini : 3)); };
const maSubDe = (pj, mom) => { const S = maSlots(); const s = S[pj + '.' + mom]; return s && s.sub && s.sub.trim() ? s.sub.trim() : ''; };
const maLog = (pj, mom, k) => { (window.__maLog = window.__maLog || []).push(pj + '.' + mom + (k && k !== pj + '.' + mom ? '→' + k.split('.')[1] : '')); };
// la voz del juego: bocadillos de hud.say (presentadores, concursantes, equipo)
{ const sy1 = S2.prototype.say;
  S2.prototype.say = function (e, t, n, i, s = {}) {
    try { if (!s.__ma && typeof e === 'string') { const pj = maPj(i), host = pj === maHost();
      if (!(host && s.voice === false)) { if (/^(rival\d+|central)$/.test(pj)) MA6.ultimo = pj;
        const mom = maMomento(pj, e), el = maElige(pj, mom), sub = el ? el.sub || maSubDe(pj, mom) : maSubDe(pj, mom);
        if (sub) e = sub;
        if (el) { try { zn.stop(); } catch (x) { } maLog(pj, mom, el.k); const ms = maDur(el) * 1000; bzaPara(); maPlayE(el).then(r => { MA6.say = r; }); return sy1.call(this, e, Math.max(t || 3200, ms + 450), n, i, { ...s, voice: false }); } } } } catch (x) { }
    return sy1.call(this, e, t, n, i, s);
  }; }
// trampilla: el presentador (en vez de su «¡Ahí te va!») y quien cae
function maCaida(hud, quien) { let host = false; try { const h = maHost(), el = maElige(h, 'trampilla'); if (el) { host = true; maLog(h, 'trampilla', el.k); maPlayE(el); const sub = el.sub || maSubDe(h, 'trampilla') || ((w2['AhoraCaigo - Queda.mp3'] || [])[0] || [])[2] || ''; if (sub && hud) hud.say(sub, maDur(el) * 1000 + 300, undefined, me.presentador, { voice: false, __ma: 1 }); } } catch (e) { } return host; }
function maCaidaQuien(quien) { try { const el = maElige(quien, 'trampilla'); if (el) { maLog(quien, 'trampilla', el.k); return maPlayE(el); } } catch (e) { } return null; }
// sketch de Don Arturo, Apertura y promos
window.__maDecir = (pj, txt) => { try { const mom = maMomento(pj, txt), el = maElige(pj, mom); if (!el) return false; maLog(pj, mom, el.k); bzaPara(); maPlayE(el); return true; } catch (e) { return false; } };
window.__maSubTxt = (pj, txt) => { try { const mom = maMomento(pj, txt), el = maElige(pj, mom); return (el && el.sub) || maSubDe(pj, mom) || txt; } catch (e) { return txt; } };
window.__maPromo = async (id, vol) => { try { const el = maElige('off', id); if (!el) return null; maLog('off', id, el.k); const r = await maPlayE(el, vol == null ? 1 : vol); return r; } catch (e) { return null; } };
// ---------- panel «🎤 Mis audios»: personajes → momentos ----------
function maPanel(pjIni) {
  document.getElementById('bzaPanel')?.remove(); const w = document.createElement('div'); w.id = 'bzaPanel';
  w.style.cssText = 'position:fixed;inset:0;z-index:99990;background:#050b2ef5;color:#fff;overflow:auto;font:15px system-ui;-webkit-overflow-scrolling:touch';
  const st = document.createElement('style'); st.textContent = `#bzaPanel .in{max-width:940px;margin:0 auto;padding:12px 14px 40px}#bzaPanel h2{margin:4px 0 6px;color:#ffc21a;font:900 24px Montserrat,system-ui}
#bzaPanel .b{border:2px solid #ffc21a;background:#0b2fa8;color:#fff;border-radius:12px;padding:8px 14px;font:700 15px system-ui;margin:3px;cursor:pointer}#bzaPanel .b.gr{display:block;width:100%;padding:14px;font-size:20px;background:linear-gradient(#ffd23a,#e89a00);color:#1a1000;margin:10px 0}
#bzaPanel .b.ch{background:#173a9a}#bzaPanel .b.on{background:#ffc21a;color:#1a1000}
#bzaPanel .sl{border:1px solid #fff3;border-radius:12px;padding:8px 10px;margin:10px 0;background:#0b1a5a}#bzaPanel .sl h3{margin:0 0 4px;font:800 17px system-ui;color:#ffe07a}
#bzaPanel .fr{font-style:italic;opacity:.92;margin:2px 0 6px;font-size:14px;line-height:1.35}#bzaPanel .fr b{font-style:normal;color:#9fd0ff}
#bzaPanel select,#bzaPanel input{background:#111a;color:#fff;border:1px solid #888;border-radius:8px;padding:6px;font:15px system-ui;max-width:100%}#bzaPanel input[type=number]{width:5em}#bzaPanel input.sub{flex:1;min-width:220px}
#bzaPanel .chip{display:inline-flex;align-items:center;gap:6px;background:#1e3c9a;border:1px solid #6a8cff;border-radius:16px;padding:3px 4px 3px 10px;margin:2px;font-size:14px}#bzaPanel .chip button{border:0;background:#0006;color:#fff;border-radius:50%;width:24px;height:24px}
#bzaPanel .fila{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}#bzaPanel .mis{font-size:14px;opacity:.9}#bzaPanel .mis div{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #fff2;padding:3px 0}
#bzaPanel .gr2{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:8px;margin:6px 0 12px}#bzaPanel .pjc{text-align:left;border:2px solid #4a6aff;background:#0b1f70;color:#fff;border-radius:14px;padding:9px 10px;cursor:pointer;font:700 15px system-ui}
#bzaPanel .pjc small{display:block;font-weight:500;opacity:.75;font-size:12px;margin-top:2px}#bzaPanel .pjc i{font-style:normal;color:#ffc21a;font-size:12px;display:block;margin-top:3px}#bzaPanel .pjc.act{border-color:#ffc21a}
#bzaPanel .grp{font:800 15px system-ui;color:#9fd0ff;margin:10px 0 0;text-transform:uppercase;letter-spacing:.06em}
#bzaPanel .bar{position:relative;height:26px;border-radius:13px;background:#000a;border:1px solid #6a8cff;cursor:pointer;flex:1;min-width:230px;overflow:hidden}#bzaPanel .bar .zo{position:absolute;top:0;bottom:0;background:#ffc21a55}#bzaPanel .bar .pos{position:absolute;top:0;bottom:0;width:3px;background:#fff}
#bzaPanel .bar .mi,#bzaPanel .bar .mf{position:absolute;top:0;bottom:0;width:4px}#bzaPanel .bar .mi{background:#3aff6a}#bzaPanel .bar .mf{background:#ff4a4a}#bzaPanel .tl{font:600 13px ui-monospace,monospace;min-width:110px}`;
  w.appendChild(st); const c = document.createElement('div'); c.className = 'in'; w.appendChild(c); document.body.appendChild(w);
  const B = (t, fn, cls = '') => { const b = document.createElement('button'); b.className = 'b ' + cls; b.textContent = t; b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } fn(b); }; return b; };
  const fmt = s => s ? (s >= 60 ? Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0') : s.toFixed(1) + ' s') : '';
  const fmt2 = s => (Math.floor(s / 60)) + ':' + (s % 60).toFixed(1).padStart(4, '0');
  const E = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  let vista = pjIni || null, prev = null;
  const paraPrev = () => { if (prev) { try { prev.a.pause(); } catch (e) { } clearInterval(prev.iv); prev.fin && prev.fin(); prev = null; } bzaPara(); };
  const cuenta = id => { const S = maSlots(); return Object.keys(S).filter(k => k.startsWith(id + '.') && S[k] && ((S[k].f || []).length || (S[k].sub || '').trim())).length; };
  const cabecera = () => { const L = bzaLista();
    c.appendChild(E('h2', '', '🎤 Mis audios'));
    c.appendChild(E('p', '', 'Pon tus propios audios (o el sonido de tus vídeos) a cualquier personaje. Elige personaje, luego el momento, y asígnale uno o varios audios. Solo cambia la voz de ese personaje en ese momento; todo lo demás suena como siempre. Los archivos se copian dentro de la app.')).style.cssText = 'opacity:.85;margin:0 0 4px';
    const on = E('label'); on.style.cssText = 'display:flex;gap:8px;align-items:center;font-weight:700;margin:4px 0'; const ck = document.createElement('input'); ck.type = 'checkbox'; ck.checked = maOn(); ck.onchange = () => { localStorage.setItem('ac_ma_on', ck.checked ? '1' : '0'); }; on.append(ck, document.createTextNode('Usar mis audios durante el juego')); c.appendChild(on);
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'audio/*,video/*'; fi.multiple = true; fi.style.display = 'none'; fi.id = 'maFile'; c.appendChild(fi);
    const ad = B('➕ Añadir audios', () => fi.click(), 'gr'); ad.id = 'maAdd'; c.appendChild(ad);
    fi.onchange = async () => { const fs = [...(fi.files || [])]; if (!fs.length) return; ad.textContent = '⏳ Copiando ' + fs.length + ' archivo(s)…'; const n = await bzaImporta(fs); try { yn.toast(n + ' audio(s) añadidos', 2000); } catch (e) { } pinta(); };
    if (L.length) { const m = E('div', 'mis'); m.id = 'maLista'; m.innerHTML = '<b style="color:#ffc21a">Mis audios (' + L.length + ')</b>'; for (const x of L) { const r = E('div'); r.append(E('span', '', (x.video ? '🎞️ ' : '🎵 ') + x.nombre + (x.dur ? ' · ' + fmt(x.dur) : '')), B('🗑', async () => { await bzaBorra(x.id); pinta(); })); m.appendChild(r); } c.appendChild(m); } };
  const pintaPersonajes = () => { const h = maHost();
    c.appendChild(E('h3', '', '1️⃣ Elige un personaje')).style.cssText = 'margin:12px 0 0;color:#ffe07a';
    for (const [g, L] of maPersonajes()) { c.appendChild(E('div', 'grp', g)); const gr = E('div', 'gr2'); for (const p of L) { const b = E('button', 'pjc' + (p.id === h ? ' act' : '')); b.dataset.pj = p.id; b.innerHTML = `${p.ic} ${maEsc(p.n)}<small>${maEsc(p.r)}${p.id === h ? ' · ⭐ presenta ahora' : ''}</small>`; const n = cuenta(p.id); if (n) b.appendChild(E('i', '', '🎵 ' + n + ' momento' + (n > 1 ? 's' : '') + ' con audio mío')); b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } vista = p.id; pinta(); w.scrollTop = 0; }; gr.appendChild(b); } c.appendChild(gr); } };
  const pintaPj = () => { const p = maPjInfo(vista); if (!p) { vista = null; return pinta(); } const L = bzaLista(), S = maSlots(), { P } = maPools(p.id);
    const top = E('div', 'fila'); top.append(B('⟵ Personajes', () => { vista = null; pinta(); w.scrollTop = 0; }, 'ch')); const t = E('h3', '', `${p.ic} ${p.n}`); t.style.cssText = 'margin:0;color:#ffe07a;font:900 20px system-ui'; top.appendChild(t); c.appendChild(top);
    c.appendChild(E('div', '', '2️⃣ Elige el momento y ponle tus audios. Si un momento no tiene audio, ' + p.n + ' habla con su voz de siempre' + (p.mom.some(m => m[0] === 'cualquiera') ? ' (o con tu audio de «Cualquier otra frase», si lo hay).' : '.'))).style.cssText = 'opacity:.8;font-size:14px;margin:6px 0';
    for (const [k, nom] of p.mom) { const key = p.id + '.' + k, s = S[key] || { f: [], ini: '', fin: '', sub: '' }; const d = E('div', 'sl'); d.dataset.mom = k; d.appendChild(E('h3', '', nom));
      const ej = (P[k] || []).filter(Boolean); const fr = E('div', 'fr');
      fr.innerHTML = k === 'cualquiera' && !ej.length ? '<b>Frase del juego:</b> cualquier frase de ' + maEsc(p.n) + ' que no tenga audio propio' : ej.length ? '<b>Frase del juego:</b> «' + maEsc(ej[0]) + '»' + (ej[1] ? ' · «' + maEsc(ej[1]) + '»' : '') + (ej.length > 2 ? ` <span style="opacity:.7">(+${ej.length - 2} más)</span>` : '') : '<b>Frase del juego:</b> (música/voz de la promo completa)';
      d.appendChild(fr);
      const ch = E('div'); if (!s.f.length) ch.innerHTML = '<span style="opacity:.7">🗣️ Voz de siempre</span>';
      for (const id of s.f) { const x = L.find(y => y.id === id); const cp = E('span', 'chip', id === 'rnd' ? '🎲 Aleatorio (todos mis audios)' : x ? x.nombre : '?'); cp.appendChild(B('×', () => { s.f = s.f.filter(y => y !== id); S[key] = s; maSlotsPon(S); pinta(); })); ch.appendChild(cp); }
      d.appendChild(ch);
      const f1 = E('div', 'fila'); const se = document.createElement('select'); se.innerHTML = '<option value="">' + (L.length ? '➕ Elegir audio para este momento…' : '(primero pulsa «Añadir audios»)') + '</option>' + (L.length ? '<option value="rnd">🎲 Aleatorio (todos mis audios)</option>' : '') + L.map(x => `<option value="${x.id}">${maEsc(x.nombre)}</option>`).join('');
      se.onchange = () => { if (!se.value) return; if (!s.f.includes(se.value)) s.f.push(se.value); S[key] = s; maSlotsPon(S); pinta(); }; f1.appendChild(se); d.appendChild(f1);
      // subtítulo
      const f4 = E('div', 'fila'); f4.appendChild(E('span', '', '💬 Subtítulo:')); const su = document.createElement('input'); su.className = 'sub'; su.type = 'text'; su.placeholder = ej[0] && k !== 'promo' ? 'Vacío = el del juego («' + ej[0].slice(0, 40) + (ej[0].length > 40 ? '…' : '') + '»)' : 'Vacío = el del juego'; su.value = s.sub || ''; su.onclick = ev => ev.stopPropagation();
      su.onchange = () => { s.sub = su.value; S[key] = s; maSlotsPon(S); }; f4.append(su, B('↺ El del juego', () => { su.value = ''; s.sub = ''; S[key] = s; maSlotsPon(S); })); d.appendChild(f4);
      // recorte con barra
      const fid = s.f.find(x => x !== 'rnd') || (s.f.includes('rnd') && L[0] ? L[0].id : null), fx = L.find(y => y.id === fid);
      const f2 = E('div', 'fila'); const num = (v, ph) => { const i = document.createElement('input'); i.type = 'number'; i.min = '0'; i.step = '0.1'; i.placeholder = ph; i.value = v || ''; i.onclick = ev => ev.stopPropagation(); return i; };
      const a1 = num(s.ini, 'inicio'), a2 = num(s.fin, 'final'); const guarda = () => { s.ini = a1.value; s.fin = a2.value; S[key] = s; maSlotsPon(S); dibuja(); }; a1.onchange = a2.onchange = guarda;
      const bar = E('div', 'bar'), zo = E('div', 'zo'), mi = E('div', 'mi'), mf = E('div', 'mf'), po = E('div', 'pos'); bar.append(zo, mi, mf, po); const tl = E('span', 'tl', '0:00.0 / ' + (fx && fx.dur ? fmt2(fx.dur) : '–'));
      let cur = 0; const D = () => (fx && fx.dur) || 0;
      const dibuja = () => { const d0 = D() || 1, i0 = Math.min(d0, +a1.value || 0), f0 = Math.min(d0, +a2.value > i0 ? +a2.value : d0); zo.style.left = (i0 / d0 * 100) + '%'; zo.style.width = ((f0 - i0) / d0 * 100) + '%'; mi.style.left = (i0 / d0 * 100) + '%'; mf.style.left = 'calc(' + (f0 / d0 * 100) + '% - 4px)'; po.style.left = (cur / d0 * 100) + '%'; tl.textContent = fmt2(cur) + ' / ' + (D() ? fmt2(D()) : '–'); };
      const oye = E('button', 'b', '▶ Escuchar'); 
      const escucha = async (desde) => { paraPrev(); if (!fid) { try { yn.toast('Primero elige un audio para este momento', 2000); } catch (e) { } return; } const u = await bzaUrl(fid); if (!u) return; const a = new Audio(u); a.preload = 'auto';
        prev = { a, key, iv: setInterval(() => { cur = a.currentTime || cur; dibuja(); }, 80), fin: () => { oye.textContent = '▶ Escuchar'; } }; oye.textContent = '⏸ Pausa'; a.onended = () => paraPrev();
        const go = () => { try { a.currentTime = desde; } catch (e) { } a.play().catch(() => paraPrev()); }; if (desde > 0) { a.onloadedmetadata = go; setTimeout(() => a.paused && go(), 1200); } else go(); };
      oye.onclick = ev => { ev.stopPropagation(); if (prev && prev.key === key) { paraPrev(); return; } escucha(cur >= D() - 0.05 ? 0 : cur); };
      bar.onclick = ev => { ev.stopPropagation(); const r = bar.getBoundingClientRect(); cur = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * D(); if (prev && prev.key === key) { try { prev.a.currentTime = cur; } catch (e) { } } dibuja(); };
      const f3 = E('div', 'fila'); f3.append(oye, bar, tl); d.appendChild(f3);
      const l1 = E('span', '', 'Usar desde el segundo'), l2 = E('span', '', 'hasta el');
      f2.append(B('⏮ Marcar inicio', () => { a1.value = cur.toFixed(1); guarda(); }, 'ch'), B('Marcar fin ⏭', () => { a2.value = cur.toFixed(1); guarda(); }, 'ch'), l1, a1, l2, a2);
      const pr = B('▶ Probar', async b => { guarda(); paraPrev(); const el = maEligeK(key); if (!el) { try { yn.toast('Este momento usa la voz de siempre (elige un audio)', 2200); } catch (e) { } return; } const r = await maPlayE(el); if (!r) return; prev = { a: r.a, key, iv: setInterval(() => { cur = r.a.currentTime || cur; dibuja(); }, 80), fin: () => { r.stop(); b.textContent = '▶ Probar'; prova.style.display = 'none'; } };
        b.textContent = '⏹ Parar'; prova.textContent = '💬 ' + (el.sub || (ej[0] && k !== 'promo' ? ej[0] : p.n)); prova.style.display = 'block'; r.done.then(() => { if (prev && prev.a === r.a) paraPrev(); }); }, 'on');
      pr.onclick = (o => ev => { ev.stopPropagation(); if (prev && prev.key === key && pr.textContent.startsWith('⏹')) { paraPrev(); return; } o(ev); })(pr.onclick);
      f2.append(pr, B('✖ Quitar', () => { paraPrev(); delete S[key]; maSlotsPon(S); pinta(); }));
      const prova = E('div', ''); prova.className = 'prova'; prova.style.cssText = 'display:none;margin-top:6px;background:#fff;color:#18204a;border-radius:12px;padding:8px 12px;font:700 16px system-ui'; 
      if (key === 'buzz.promo') { const f5 = E('div', 'fila'); const a3 = num(s.ret, '0'); a3.onchange = () => { s.ret = a3.value; S[key] = s; maSlotsPon(S); }; f5.append(E('span', '', 'Sincronizar: empezar mi audio a los'), a3, E('span', '', 's de la promo'), B('🎬 Ver la promo', () => { guarda(); paraPrev(); w.style.display = 'none'; promoBuzz().finally(() => { w.style.display = ''; }); })); d.appendChild(f5); }
      d.append(f2, prova); c.appendChild(d); dibuja(); } };
  const pinta = () => { paraPrev(); c.innerHTML = ''; cabecera(); vista ? pintaPj() : pintaPersonajes(); c.appendChild(B('✔ Listo', () => { paraPrev(); w.remove(); try { Lt('options'); } catch (e) { } }, 'gr')); };
  pinta(); return w; }
const bzaPanel = () => maPanel('buzz');
// botón principal en Opciones (arriba del todo) y acceso directo en el Modo Fiesta
function filaMisAudios() { const r = document.createElement('div'); r.className = 'orow'; r.id = 'rowMisAudios'; r.style.cssText = 'border:2px solid #ffc21a;border-radius:14px;padding:8px 10px;margin:6px 0 10px;background:#ffc21a1a';
  const l = document.createElement('label'); l.innerHTML = '<b style="font-size:1.15em">🎤 Mis audios</b><br><small style="opacity:.85">Pon tus audios a cualquier personaje: presentadores, concursantes, Buzz, Don Arturo, voz en off…</small>';
  const S = maSlots(), n = Object.values(S).filter(s => s && s.f && s.f.length).length; const b = document.createElement('button'); b.className = 'tbtn sel'; b.id = 'btnMisAudios'; b.style.cssText = 'font-size:1.1em;padding:.5em 1.1em'; b.textContent = n ? `Abrir (${n})` : 'Abrir';
  b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); maPanel(); }; r.append(l, b); return r; }
{ const fe = filaEtapa; filaEtapa = function () { const d = document.createElement('div'); d.append(filaMisAudios(), fe()); return d; }; }
{ const ff = filaFiesta; filaFiesta = function () { const box = ff(); const r = document.createElement('div'); r.className = 'orow'; r.id = 'rowBza'; const l = document.createElement('label'); l.textContent = '🎤 Mis audios de Buzz'; const n = Object.values(bzaSlots()).filter(s => s.f && s.f.length).length;
  const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = n ? `Abrir (${n} momentos)` : 'Abrir'; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); bzaPanel(); }; r.append(l, b); box.insertBefore(r, box.querySelector('#jugarFiesta')); return box; }; }
window.__bza = { BZA, bzaPanel, bzaLista, bzaSlots, bzaImporta, bzaPlay, bzaTiene, bzaPara };
window.__ma = { panel: maPanel, slots: maSlots, slotsPon: maSlotsPon, lista: bzaLista, importa: bzaImporta, momento: maMomento, pj: maPj, host: maHost, personajes: maPersonajes, pools: maPools, elige: maElige };
