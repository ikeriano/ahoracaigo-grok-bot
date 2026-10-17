// ===================================================================================================
// v1.36 · MI PROGRAMA (Opciones › «📺 Mi programa»): una sola pantalla. Elige un programa (o crea el tuyo):
// su imagen sale en las pantallas grandes del plató (y, si quieres, como logo de la cabecera «La de siempre»)
// y el presentador dice su nombre en sus frases y subtítulos («¡Bienvenidos a ¡Ahora Caigo! Niños!»).
// Por defecto: «Programa normal» (nada cambia). Imágenes propias: se reducen a 1024 px y se guardan en IndexedDB.
// ===================================================================================================
const MP_PRE = [
  { id: 'ninos', n: '¡Ahora Caigo! Niños', img: 'assets/miprog/ninos.jpg' },
  { id: 'campionnisimi', n: '¡Ahora Caigo! Campionnisimi', img: 'assets/miprog/campionnisimi.jpg' },
  { id: '10anos', n: '¡Ahora Caigo! 10 Años', img: 'assets/miprog/10anos.jpg' },
  { id: 'adivina', n: '¡Adivina o te caes!', img: 'assets/miprog/adivina.jpg' },
  { id: 'campeon', n: '¡Ahora Caigo! Campeón Edition', img: 'assets/miprog/campeon.jpg' },
  { id: 'campeonia', n: '¡Ahora Caigo! Campeón Edition by Ikériano & ChatGPT', img: 'assets/miprog/campeonia.jpg', img3d: 'assets/miprog/campeonia_3d.jpg' },
  { id: '300sub', n: '¡Ahora Caigo! 300 Suscriptores', img: 'assets/miprog/300sub.jpg' },
  { id: 'cazador', n: '¡Ahora Caigo! Especial El Cazador', img: 'assets/miprog/cazador.jpg' },
  { id: 'nuevo', n: '¡Ahora Caigo! Nuevo', img: 'assets/miprog/nuevo.jpg' },
];
const MP = { urls: {}, imgs: {}, orig: new WeakMap(), studio: null, act: undefined };
const mpCfg = () => { try { return Object.assign({ act: '', propios: [], cab: {} }, JSON.parse(localStorage.getItem('ac_miprog') || '{}')); } catch (e) { return { act: '', propios: [], cab: {} }; } };
const mpCfgPon = c => { try { localStorage.setItem('ac_miprog', JSON.stringify(c)); } catch (e) { } };
const mpTodos = () => [...MP_PRE.map(p => ({ ...p, pre: true })), ...mpCfg().propios.map(p => ({ ...p, img: 'idb:' + p.id }))];
function mpAct() { const c = mpCfg(); if (!c.act) return null; const p = mpTodos().find(x => x.id === c.act); if (!p) return null; return { ...p, cab: c.cab[p.id] !== false }; }
function mpCambia(t, N) { if (!N || typeof t !== 'string') return t; const full = /[!?]$/.test(N) ? N : N + '!', bare = N.replace(/[¡!]/g, '').trim();
  return t.replace(/¡\s*ahora\s+ca[ií]go\s*!|\bahora\s+ca[ií]go\b/gi, m => m.startsWith('¡') ? full : bare); }
function mpDB() { return MP.db || (MP.db = new Promise((res, rej) => { const r = indexedDB.open('ac_miprog', 1); r.onupgradeneeded = () => r.result.createObjectStore('img'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })); }
async function mpTx(modo, fn) { const db = await mpDB(); return new Promise((res, rej) => { const tx = db.transaction('img', modo), q = fn(tx.objectStore('img')); tx.oncomplete = () => res(q && q.result); tx.onerror = () => rej(tx.error); }); }
async function mpSrc(src) { if (!src) return null; if (!src.startsWith('idb:')) return src; const id = src.slice(4); if (MP.urls[id]) return MP.urls[id]; const b = await mpTx('readonly', s => s.get(id)).catch(() => null); return b ? (MP.urls[id] = URL.createObjectURL(b)) : null; }
function mpImg(src) { if (MP.imgs[src]) return MP.imgs[src]; return MP.imgs[src] = mpSrc(src).then(u => new Promise(r => { if (!u) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = u; })); }
async function mpImporta(file) { // reduce a 1024 px (suave en móviles modestos como el Redmi A2) y guarda en IndexedDB
  const u = URL.createObjectURL(file); const i = await new Promise((r, j) => { const x = new Image(); x.onload = () => r(x); x.onerror = j; x.src = u; });
  const k = Math.min(1, 1024 / Math.max(i.naturalWidth, i.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(i.naturalWidth * k); c.height = Math.round(i.naturalHeight * k); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
  return new Promise(r => c.toBlob(r, 'image/jpeg', 0.86)); }
// ---- pantallas del plató ----
async function mpPantallas() {
  const st = Xe && Xe.studio; if (!st || !st.screenMats) return; try { if (Ke.__AR) return; } catch (e) { }
  const p = mpAct(), O = MP.orig.get(st);
  if (!p) { if (O) { st.screenMats.forEach((m, k) => { if (O.pant[k]) { m.map = O.pant[k]; m.needsUpdate = true; } }); try { if (O.logo) PANT.logoMap = O.logo; } catch (e) { } MP.orig.delete(st); } return; }
  const img = await mpImg(p.img); if (!img || Xe.studio !== st) return;
  if (!MP.orig.has(st)) { let lg = null; try { lg = PANT.logoMap; } catch (e) { } MP.orig.set(st, { pant: st.screenMats.map(m => m.map), logo: lg }); }
  const tex = Vt(1024, 576, g => { g.fillStyle = '#000'; g.fillRect(0, 0, 1024, 576); const k = Math.max(1024 / img.naturalWidth, 576 / img.naturalHeight), w = img.naturalWidth * k, h = img.naturalHeight * k; g.drawImage(img, (1024 - w) / 2, (576 - h) / 2, w, h); });
  st.screenMats.forEach(m => { m.map = tex; m.needsUpdate = true; }); try { PANT.logoMap = tex; } catch (e) { } window.__mpPant = p.id; }
{ const ii0 = ii; ii = async function (...a) { mpPantallas(); setTimeout(mpPantallas, 700); setTimeout(mpPantallas, 2500); return ii0.apply(this, a); }; }
{ let ultimo = null; setInterval(() => { try { const st = Xe && Xe.studio, a = (mpCfg().act || '') + '|' + (st ? st.uuid || '' : ''); if (st && (st !== ultimo || a !== MP.ult)) { ultimo = st; MP.ult = a; mpPantallas(); } } catch (e) { } }, 1500); }
// ---- el presentador dice el nombre del programa (subtítulo y voz: clip Piper del nombre si existe; si no, su clip de siempre) ----
{ const sy0 = S2.prototype.say; S2.prototype.say = function (e, t, n, i, s = {}) {
  try { const p = typeof e === 'string' && mpAct(); if (p && /ahora\s+ca[ií]go/i.test(e)) { const e2 = mpCambia(e, p.n); if (e2 !== e) { s = { ...s, audio: s.audio ? [...s.audio.map(x => mpCambia(x, p.n)), ...s.audio] : [e2, e] }; e = e2; } } } catch (x) { }
  return sy0.call(this, e, t, n, i, s); }; }
{ const t0 = tituloAC; tituloAC = function () { const p = mpAct(); if (!p) return t0(); const s = p.n.replace(/^¡\s*/, '').replace(/[¡!]/g, '').trim().toUpperCase(), w = s.split(/\s+/).filter(Boolean);
  if (w.length <= 1) return [s, '', true]; let mejor = 1, dif = 1e9; for (let k = 1; k < w.length; k++) { const a = w.slice(0, k).join(' ').length, b = w.slice(k).join(' ').length; if (Math.abs(a - b) < dif) { dif = Math.abs(a - b); mejor = k; } } return [w.slice(0, mejor).join(' '), w.slice(mejor).join(' '), true]; }; }
// ---- logo de la cabecera «La de siempre» con la imagen del programa ----
async function mpLogoCab(T) { const p = mpAct(); if (!p || !p.cab) return null; const img = await mpImg(p.img3d || p.img); if (!img) return null;
  const G = new T.Group(), tirar = [], tx = new T.Texture(img); tx.colorSpace = T.SRGBColorSpace; tx.needsUpdate = true; tirar.push(tx);
  const asp = img.naturalWidth / img.naturalHeight, h = 2.6, w = h * asp, W = Math.min(w, 5.4), H = W / asp;
  const pg = new T.PlaneGeometry(W, H), pm = new T.MeshBasicMaterial({ map: tx, toneMapped: false }); tirar.push(pg, pm); const pl = new T.Mesh(pg, pm); pl.position.z = 0.09;
  const bg = new T.BoxGeometry(W + 0.16, H + 0.16, 0.16), bm = new T.MeshPhongMaterial({ color: 0x1a2a6a, specular: 0x8ab8ff, shininess: 80 }); tirar.push(bg, bm); const bx = new T.Mesh(bg, bm);
  const marco = new T.Group(); marco.add(bx, pl); marco.position.y = -0.45; G.add(marco); return { G, tirar, id: p.id }; }
// ---- Opciones › Mi programa ----
function filaMiProg136() { const r = document.createElement('div'); r.className = 'orow'; r.id = 'rowMiProg'; r.style.cssText = 'border:2px solid #ffc21a;border-radius:14px;padding:8px 10px;margin:6px 0';
  const p = mpAct(); const lb = document.createElement('label'); lb.innerHTML = '📺 <b>Mi programa</b><br><small style="opacity:.8">' + (p ? 'Ahora: ' + maEsc(p.n) : 'Programa normal (por defecto)') + '</small>'; r.appendChild(lb);
  const b = document.createElement('button'); b.className = 'tbtn sel'; b.textContent = 'Abrir'; b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } mpPanel(); }; r.appendChild(b); return r; }
{ const cm = cabMover136; cabMover136 = function () { cm(); const m = document.getElementById('menu'); if (!m || m.querySelector('#rowMiProg')) return; const a = m.querySelector('#rowMisAudios'); if (a) a.after(filaMiProg136()); }; }
function mpPanel() {
  document.getElementById('mpPanel')?.remove(); const w = document.createElement('div'); w.id = 'mpPanel';
  w.style.cssText = 'position:fixed;inset:0;z-index:99990;background:#050b2ef5;color:#fff;overflow:auto;font:15px system-ui;-webkit-overflow-scrolling:touch';
  const st = document.createElement('style'); st.textContent = `#mpPanel .in{max-width:900px;margin:0 auto;padding:12px 14px 40px}#mpPanel h2{margin:4px 0 4px;color:#ffc21a;font:900 24px Montserrat,system-ui}
#mpPanel .it{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:2px solid #3a5ad0;background:#0b1f70;color:#fff;border-radius:12px;padding:6px 10px;margin:5px 0;cursor:pointer;font:700 16px system-ui}
#mpPanel .it img,#mpPanel .it .ph{width:96px;height:54px;object-fit:cover;border-radius:8px;background:#000;flex:none}#mpPanel .it .ph{display:flex;align-items:center;justify-content:center;font-size:26px}
#mpPanel .it.sel{border-color:#ffc21a;background:#1a3aa8;box-shadow:0 0 0 3px #ffc21a55}#mpPanel .it.sel:after{content:'✔ en uso';margin-left:auto;color:#ffc21a;font-size:14px}#mpPanel .it small{display:block;font-weight:500;opacity:.7;font-size:12px}
#mpPanel .b{border:2px solid #ffc21a;background:#0b2fa8;color:#fff;border-radius:12px;padding:8px 14px;font:700 15px system-ui;margin:3px;cursor:pointer}#mpPanel .b.gr{display:block;width:100%;padding:12px;font-size:19px;background:linear-gradient(#ffd23a,#e89a00);color:#1a1000;margin:10px 0}
#mpPanel .ed{border:1px solid #fff3;border-radius:12px;padding:10px;margin:8px 0;background:#0b1a5a}#mpPanel input[type=text]{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:10px;border:2px solid #3a6aff;font:700 16px system-ui;margin:4px 0}`;
  w.appendChild(st); const c = document.createElement('div'); c.className = 'in'; w.appendChild(c); document.body.appendChild(w);
  const E = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const B = (t, fn, cls = '') => { const b = E('button', 'b ' + cls, t); b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } fn(b); }; return b; };
  const usa = id => { const k = mpCfg(); k.act = id; mpCfgPon(k); mpPantallas(); pinta(); };
  const pinta = () => { c.innerHTML = ''; const k = mpCfg(), act = k.act || '';
    c.appendChild(E('h2', '', '📺 Mi programa'));
    c.appendChild(E('p', '', 'Elige tu programa: su logo sale en las pantallas del plató y el presentador dice su nombre. «Programa normal» lo deja todo como siempre.')).style.cssText = 'opacity:.85;margin:0 0 6px';
    const fila = (id, nombre, sub, src) => { const b = E('button', 'it' + (act === id ? ' sel' : '')); b.dataset.mp = id;
      if (src) { const im = E('img'); im.alt = ''; im.loading = 'lazy'; mpSrc(src).then(u => u && (im.src = u)); b.appendChild(im); } else b.appendChild(E('span', 'ph', '📺'));
      const t = E('span', '', nombre); if (sub) t.appendChild(E('small', '', sub)); b.appendChild(t); b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } usa(id); }; return b; };
    c.appendChild(fila('', 'Programa normal', 'Por defecto: ¡Ahora Caigo! de siempre', null));
    for (const p of MP_PRE) c.appendChild(fila(p.id, p.n, 'Ya preparado', p.img));
    for (const p of k.propios) c.appendChild(fila(p.id, p.n, 'Mi programa', 'idb:' + p.id));
    c.appendChild(B('➕ Crear mi programa (nombre + imagen del móvil)', () => { const id = 'p' + Date.now().toString(36); const k = mpCfg(); k.propios.push({ id, n: '¡Ahora Caigo! Mi programa' }); k.act = id; mpCfgPon(k); pinta(); }));
    const p = mpAct();
    if (p) { const ed = E('div', 'ed'); ed.appendChild(E('b', '', p.pre ? '⚙️ ' + p.n : '✏️ Editar mi programa'));
      if (!p.pre) { const inp = E('input'); inp.type = 'text'; inp.maxLength = 60; inp.value = p.n; inp.placeholder = '¡Ahora Caigo! Mi programa'; inp.onclick = ev => ev.stopPropagation(); inp.onkeydown = ev => ev.stopPropagation();
        inp.onchange = () => { const k = mpCfg(), q = k.propios.find(x => x.id === p.id); if (q) { q.n = inp.value.trim() || '¡Ahora Caigo!'; mpCfgPon(k); } };
        ed.append(E('div', '', 'Nombre del programa (el presentador lo dice tal cual):'), inp);
        const fi = E('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none'; fi.onchange = async () => { const f = fi.files && fi.files[0]; if (!f) return; try { const bl = await mpImporta(f); await mpTx('readwrite', s => s.put(bl, p.id)); delete MP.urls[p.id]; delete MP.imgs['idb:' + p.id]; mpPantallas(); try { yn.toast('Imagen guardada', 1600); } catch (e) { } } catch (e) { try { yn.toast('No se pudo abrir esa imagen', 2200); } catch (x) { } } pinta(); };
        ed.append(fi, B('🖼️ Elegir imagen del móvil', () => fi.click(), 'on'), B('🗑 Borrar este programa', async () => { const k = mpCfg(); k.propios = k.propios.filter(x => x.id !== p.id); if (k.act === p.id) k.act = ''; mpCfgPon(k); await mpTx('readwrite', s => s.delete(p.id)).catch(() => 0); mpPantallas(); pinta(); })); }
      const cl = E('label'); cl.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:8px'; const ck = E('input'); ck.type = 'checkbox'; ck.checked = p.cab; ck.onchange = () => { const k = mpCfg(); k.cab[p.id] = ck.checked; mpCfgPon(k); }; cl.append(ck, document.createTextNode('Usar esta imagen como logo de la cabecera («La de siempre»)')); ed.appendChild(cl);
      c.appendChild(ed); }
    c.appendChild(B('✔ Listo', () => { w.remove(); try { Lt('options'); } catch (e) { } }, 'gr')); };
  pinta(); return w; }
window.__mp = { act: mpAct, cambia: mpCambia, panel: mpPanel, pon: id => { const k = mpCfg(); k.act = id; mpCfgPon(k); mpPantallas(); }, pantallas: mpPantallas, zn: () => zn };
