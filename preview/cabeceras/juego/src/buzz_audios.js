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
const bzaSlots = () => { try { return JSON.parse(localStorage.getItem('ac_buzzslots') || '{}'); } catch (e) { return {}; } };
const bzaSlotsPon = S => localStorage.setItem('ac_buzzslots', JSON.stringify(S));
const bzaDur = blob => new Promise(res => { const a = new Audio(), u = URL.createObjectURL(blob); let ok = false; const fin = v => { if (ok) return; ok = true; URL.revokeObjectURL(u); res(v); }; a.preload = 'metadata'; a.onloadedmetadata = () => fin(isFinite(a.duration) ? Math.round(a.duration * 10) / 10 : 0); a.onerror = () => fin(0); setTimeout(() => fin(0), 6000); a.src = u; });
async function bzaImporta(files) { const L = bzaLista(); let n = 0;
  for (const f of files) { if (!/^(audio|video)\//.test(f.type) && !/\.(mp3|m4a|aac|ogg|opus|wav|flac|mp4|webm|3gp|mkv|mov)$/i.test(f.name)) continue;
    if (f.size > 120e6) { try { yn.toast('«' + f.name + '» es muy grande (máx. 120 MB)', 2600); } catch (e) { } continue; }
    const id = 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), blob = f.slice(0, f.size, f.type || 'audio/mpeg');
    try { await bzaTx('readwrite', s => s.put({ id, nombre: f.name, tipo: f.type, blob })); } catch (e) { try { yn.toast('No hay espacio para «' + f.name + '»', 2600); } catch (x) { } continue; }
    L.push({ id, nombre: f.name, video: /^video\//.test(f.type), dur: await bzaDur(blob), kb: Math.round(f.size / 1024) }); n++; }
  bzaListaPon(L); return n; }
async function bzaBorra(id) { await bzaTx('readwrite', s => s.delete(id)).catch(() => 0); bzaListaPon(bzaLista().filter(x => x.id !== id)); if (BZA.urls[id]) { URL.revokeObjectURL(BZA.urls[id]); delete BZA.urls[id]; }
  const S = bzaSlots(); for (const k in S) S[k].f = (S[k].f || []).filter(x => x !== id); bzaSlotsPon(S); }
async function bzaUrl(id) { if (BZA.urls[id]) return BZA.urls[id]; const r = await bzaTx('readonly', s => s.get(id)).catch(() => null); if (!r || !r.blob) return null; return BZA.urls[id] = URL.createObjectURL(r.blob); }
function bzaElige(mom) { const s = bzaSlots()[mom]; if (!s || !s.f || !s.f.length) return null; const L = bzaLista(); if (!L.length) return null;
  const ops = s.f.flatMap(x => x === 'rnd' ? L.map(y => y.id) : L.some(y => y.id === x) ? [x] : []); return ops.length ? { id: ops[Math.floor(Math.random() * ops.length)], ini: +s.ini || 0, fin: +s.fin || 0 } : null; }
const bzaTiene = mom => !!bzaElige(mom);
// reproduce un audio del jugador; devuelve { done: Promise, stop() } o null
async function bzaPlay(mom, vol = 1) { const e = bzaElige(mom); if (!e) return null; const u = await bzaUrl(e.id); if (!u) return null;
  bzaPara(); const a = new Audio(); BZA.el = a; a.preload = 'auto'; a.volume = Math.max(0, Math.min(1, vol * (zn && zn.enabled === false ? 0 : 1)));
  let fin = null; const done = new Promise(r => fin = r); const acaba = () => { clearInterval(iv); clearTimeout(tope); try { a.pause(); } catch (x) { } if (BZA.el === a) BZA.el = null; fin(); };
  a.onended = acaba; a.onerror = acaba; const iv = setInterval(() => { if (e.fin > e.ini && a.currentTime >= e.fin) acaba(); }, 100);
  const L = bzaLista().find(x => x.id === e.id), largo = (e.fin > e.ini ? e.fin - e.ini : (L && L.dur ? L.dur - e.ini : 30)); const tope = setTimeout(acaba, Math.min(90, Math.max(2, largo + 1.5)) * 1000);
  a.src = u; const arranca = () => { try { if (e.ini > 0) a.currentTime = e.ini; } catch (x) { } a.play().catch(acaba); };
  if (e.ini > 0) { a.onloadedmetadata = arranca; setTimeout(() => a.paused && arranca(), 1500); } else arranca();
  return { done, stop: acaba }; }
function bzaPara() { if (BZA.el) { try { BZA.el.pause(); BZA.el.onended && BZA.el.onended(); } catch (e) { } BZA.el = null; } }
// Modo Fiesta: momento con bocadillo (el texto se sigue viendo); true si sonó un audio del jugador
async function buzzAudToca(mom, ses) { try { const r = await bzaPlay(mom); if (!r) return false; let ya = false; r.done.then(() => ya = true); try { await ses.until(() => ya); } catch (e) { r.stop(); throw e; } return true; } catch (e) { if (e === _o) throw e; return false; } }
function buzzAudSuelto(mom, bur, txt) { if (!bzaTiene(mom)) return; bzaPlay(mom).then(r => { if (!r || !bur) return; const ant = bur.innerHTML, vis = bur.style.display; bur.innerHTML = `<b>Buzz:</b> ${txt}`; bur.style.display = 'block'; r.done.then(() => { if (bur.innerHTML.includes(txt)) { bur.innerHTML = ant; bur.style.display = vis; } }); }).catch(() => 0); }
// ---------- panel en Opciones ----------
function bzaPanel() {
  document.getElementById('bzaPanel')?.remove(); const w = document.createElement('div'); w.id = 'bzaPanel';
  w.style.cssText = 'position:fixed;inset:0;z-index:99990;background:#050b2ef2;color:#fff;overflow:auto;font:15px system-ui;-webkit-overflow-scrolling:touch';
  const st = document.createElement('style'); st.textContent = `#bzaPanel .in{max-width:900px;margin:0 auto;padding:14px 14px 40px}#bzaPanel h2{margin:4px 0 6px;color:#ffc21a;font:900 22px Montserrat,system-ui}
#bzaPanel .b{border:2px solid #ffc21a;background:#0b2fa8;color:#fff;border-radius:12px;padding:8px 14px;font:700 15px system-ui;margin:3px}#bzaPanel .b.gr{display:block;width:100%;padding:16px;font-size:20px;background:linear-gradient(#ffd23a,#e89a00);color:#1a1000;margin:10px 0}
#bzaPanel .sl{border:1px solid #fff3;border-radius:12px;padding:8px 10px;margin:8px 0;background:#0b1a5a}#bzaPanel .sl h3{margin:0 0 6px;font:800 17px system-ui;color:#ffe07a}
#bzaPanel select,#bzaPanel input[type=number]{background:#111a;color:#fff;border:1px solid #888;border-radius:8px;padding:6px;font:15px system-ui;max-width:100%}#bzaPanel input[type=number]{width:5.5em}
#bzaPanel .chip{display:inline-flex;align-items:center;gap:6px;background:#1e3c9a;border:1px solid #6a8cff;border-radius:16px;padding:3px 4px 3px 10px;margin:2px;font-size:14px}#bzaPanel .chip button{border:0;background:#0006;color:#fff;border-radius:50%;width:24px;height:24px}
#bzaPanel .fila{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:6px}#bzaPanel .mis{font-size:14px;opacity:.9}#bzaPanel .mis div{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #fff2;padding:3px 0}`;
  w.appendChild(st); const c = document.createElement('div'); c.className = 'in'; w.appendChild(c); document.body.appendChild(w);
  const B = (t, fn, cls = '') => { const b = document.createElement('button'); b.className = 'b ' + cls; b.textContent = t; b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } fn(b); }; return b; };
  const fmt = s => s ? (s >= 60 ? Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0') : s.toFixed(1) + ' s') : '';
  const pinta = () => { bzaPara(); c.innerHTML = ''; const L = bzaLista(), S = bzaSlots();
    const h = document.createElement('h2'); h.textContent = '🎤 Poner voz a Buzz (mis audios)'; c.appendChild(h);
    const p = document.createElement('p'); p.style.cssText = 'opacity:.85;margin:0 0 4px'; p.textContent = 'Elige audios o vídeos de tu móvil (se usa su sonido). Se copian dentro de la app para que no se pierdan. Si un momento no tiene audio, Buzz habla con su voz de siempre. El bocadillo con el texto se sigue viendo.'; c.appendChild(p);
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'audio/*,video/*'; fi.multiple = true; fi.style.display = 'none'; c.appendChild(fi);
    fi.onchange = async () => { const fs = [...(fi.files || [])]; if (!fs.length) return; ad.textContent = '⏳ Copiando ' + fs.length + ' archivo(s)…'; const n = await bzaImporta(fs); try { yn.toast(n + ' audio(s) añadidos', 2000); } catch (e) { } pinta(); };
    const ad = B('➕ Añadir audios', () => fi.click(), 'gr'); c.appendChild(ad);
    if (L.length) { const m = document.createElement('div'); m.className = 'mis'; m.innerHTML = '<b style="color:#ffc21a">Mis audios (' + L.length + ')</b>'; for (const x of L) { const r = document.createElement('div'); const t = document.createElement('span'); t.textContent = (x.video ? '🎞️ ' : '🎵 ') + x.nombre + (x.dur ? ' · ' + fmt(x.dur) : ''); r.append(t, B('🗑', async () => { await bzaBorra(x.id); pinta(); })); m.appendChild(r); } c.appendChild(m); }
    for (const [k, nom] of BZA_MOM) { const s = S[k] || { f: [], ini: '', fin: '' }; const d = document.createElement('div'); d.className = 'sl'; d.dataset.mom = k;
      const t = document.createElement('h3'); t.textContent = nom; d.appendChild(t);
      const ch = document.createElement('div'); if (!s.f.length) { ch.innerHTML = '<span style="opacity:.7">🗣️ Voz de Buzz (Piper)</span>'; }
      for (const id of s.f) { const x = L.find(y => y.id === id); const cp = document.createElement('span'); cp.className = 'chip'; cp.textContent = id === 'rnd' ? '🎲 Aleatorio (todos mis audios)' : x ? x.nombre : '?'; cp.appendChild(B('×', () => { s.f = s.f.filter(y => y !== id); S[k] = s; bzaSlotsPon(S); pinta(); })); ch.appendChild(cp); }
      d.appendChild(ch);
      const f1 = document.createElement('div'); f1.className = 'fila'; const se = document.createElement('select'); se.innerHTML = '<option value="">' + (L.length ? '➕ Elegir audio para este momento…' : '(primero pulsa «Añadir audios»)') + '</option>' + (L.length ? '<option value="rnd">🎲 Aleatorio (todos mis audios)</option>' : '') + L.map(x => `<option value="${x.id}">${x.nombre.replace(/</g, '&lt;')}</option>`).join('');
      se.onchange = () => { if (!se.value) return; if (!s.f.includes(se.value)) s.f.push(se.value); S[k] = s; bzaSlotsPon(S); pinta(); }; f1.appendChild(se); d.appendChild(f1);
      const f2 = document.createElement('div'); f2.className = 'fila'; const num = (v, ph) => { const i = document.createElement('input'); i.type = 'number'; i.min = '0'; i.step = '0.5'; i.placeholder = ph; i.value = v || ''; i.onclick = ev => ev.stopPropagation(); return i; };
      const a1 = num(s.ini, 'inicio'), a2 = num(s.fin, 'final'); const guarda = () => { s.ini = a1.value; s.fin = a2.value; S[k] = s; bzaSlotsPon(S); }; a1.onchange = a2.onchange = guarda;
      const l1 = document.createElement('span'); l1.textContent = 'Usar desde el segundo'; const l2 = document.createElement('span'); l2.textContent = 'hasta el'; f2.append(l1, a1, l2, a2);
      f2.append(B('▶ Probar', async b => { guarda(); const r = await bzaPlay(k); if (!r) { try { yn.toast('Este momento usa la voz de Buzz (elige un audio)', 2200); } catch (e) { } return; } b.textContent = '⏹ Parar'; b.onclick = ev => { ev.stopPropagation(); r.stop(); }; r.done.then(() => { b.textContent = '▶ Probar'; b.onclick = ev => { ev.stopPropagation(); pinta(); }; }); }),
        B('✖ Quitar', () => { delete S[k]; bzaSlotsPon(S); pinta(); }));
      if (k === 'promo') { d.style.cssText = 'border:2px solid #ffc21a;background:#2a1a5a'; const f3 = document.createElement('div'); f3.className = 'fila'; const l3 = document.createElement('span'); l3.textContent = 'Sincronizar: empezar mi audio a los'; const a3 = num(s.ret, '0'); const l4 = document.createElement('span'); l4.textContent = 's de la promo';
        a3.onchange = () => { s.ret = a3.value; S[k] = s; bzaSlotsPon(S); }; f3.append(l3, a3, l4, B('🎬 Ver la promo', () => { guarda(); s.ret = a3.value; S[k] = s; bzaSlotsPon(S); bzaPara(); w.style.display = 'none'; promoBuzz().finally(() => { w.style.display = ''; }); })); d.appendChild(f3);
        const nt = document.createElement('div'); nt.style.cssText = 'font-size:13px;opacity:.8;margin-top:4px'; nt.textContent = 'Con un audio aquí, la promo suena SOLO con tu archivo (sin música ni voz de Buzz). «Usar desde el segundo» recorta el principio de tu audio y «Sincronizar» lo retrasa.'; d.appendChild(nt); }
      d.appendChild(f2); c.appendChild(d); }
    c.appendChild(B('✔ Listo', () => { bzaPara(); w.remove(); }, 'gr')); };
  pinta(); return w; }
{ const ff = filaFiesta; filaFiesta = function () { const box = ff(); const r = document.createElement('div'); r.className = 'orow'; r.id = 'rowBza'; const l = document.createElement('label'); l.textContent = '🎤 Poner voz a Buzz (mis audios)'; const n = Object.values(bzaSlots()).filter(s => s.f && s.f.length).length;
  const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = n ? `Abrir (${n} momentos)` : 'Abrir'; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); bzaPanel(); }; r.append(l, b); box.insertBefore(r, box.querySelector('#jugarFiesta')); return box; }; }
window.__bza = { BZA, bzaPanel, bzaLista, bzaSlots, bzaImporta, bzaPlay, bzaTiene, bzaPara };
