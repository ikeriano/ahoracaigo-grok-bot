// ===== Extras comunes 1.15 / 1.2: Mis hashtags · Creador de promos · Guardar logo PNG · Voz Piper sin conexión =====
// Sin speechSynthesis: la voz en off sale de Piper (sherpa-onnx WebAssembly, es_ES-davefx-medium) dentro de la app;
// si el dispositivo no puede con WebAssembly, se concatenan piezas de palabras pregrabadas del presentador.
function crearExtras(cfg) {
  const P = cfg.pref, $ = (t, css, html) => { const d = document.createElement(t); if (css) d.style.cssText = css; if (html != null) d.innerHTML = html; return d; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = m => { try { cfg.toast(m); } catch (e) { } };
  const LSJ = (k, d) => { try { return JSON.parse(localStorage.getItem(P + '_' + k)) || d; } catch (e) { return d; } };
  const LSG = (k, v) => { try { localStorage.setItem(P + '_' + k, JSON.stringify(v)); } catch (e) { } };
  const C1 = cfg.color || '#f5c542', C2 = cfg.color2 || '#0a1a5a';
  const sinTeclas = z => { z.addEventListener('keydown', e => e.stopPropagation()); z.addEventListener('pointerup', e => e.stopPropagation()); return z; };
  const inp = (v, ph, max = 60) => sinTeclas(Object.assign($('input', 'width:100%;box-sizing:border-box;padding:8px;border-radius:8px;border:1px solid #888;background:#111a;color:#fff;font:15px system-ui'), { type: 'text', value: v || '', placeholder: ph, maxLength: max }));
  const sel = (ops, v) => { const s = sinTeclas($('select', 'width:100%;padding:8px;border-radius:8px;background:#111;color:#fff;font:15px system-ui')); for (const [k, t] of ops) { const o = $('option'); o.value = k; o.textContent = t; if (k === v) o.selected = true; s.appendChild(o); } return s; };
  const btn = (t, fn, prim) => { const b = $('button', `margin:4px;padding:9px 14px;border-radius:10px;border:2px solid ${C1};background:${prim ? C1 : 'transparent'};color:${prim ? '#111' : '#fff'};font:bold 14px system-ui;cursor:pointer`); b.innerHTML = t; b.onclick = e => { e.stopPropagation(); fn(b); }; return b; };
  function capa(titulo) { // ventana a pantalla completa propia
    const o = $('div', `position:fixed;inset:0;z-index:99990;background:#000d;display:flex;align-items:center;justify-content:center;font:15px system-ui;color:#fff`);
    const v = $('div', `width:min(760px,94vw);max-height:92vh;overflow:auto;background:linear-gradient(${C2},#05081a);border:2px solid ${C1};border-radius:16px;padding:14px 16px;box-sizing:border-box`);
    v.appendChild($('div', `font:bold 20px system-ui;color:${C1};margin-bottom:8px`, esc(titulo))); o.appendChild(v); document.body.appendChild(o);
    ['pointerdown', 'pointerup', 'click', 'keydown', 'wheel', 'touchstart'].forEach(ev => o.addEventListener(ev, e => e.stopPropagation()));
    return { o, v, cierra: () => o.remove() };
  }

  // ---------- Guardar archivos (Android: puente MediaStore; web: enlace de descarga) ----------
  async function guardar(nombre, blob, carpeta) {
    const N = window.AppNativo;
    if (N && N.guardarArchivo) {
      const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result).split(',')[1]); fr.readAsDataURL(blob); });
      const res = N.guardarArchivo(nombre, blob.type || 'application/octet-stream', b64, carpeta || 'Download');
      toast(String(res).startsWith('ok') ? 'Guardado en ' + String(res).slice(3) : 'No se pudo guardar: ' + res); return res;
    }
    const a = $('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast('Descargando ' + nombre); return 'ok:' + nombre;
  }

  // ---------- Guardar logo (PNG transparente, 2048 px) ----------
  const limpio = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'logo';
  async function logoPNG(v) { const c = await cfg.logoCanvas(2048, v); return await new Promise(r => c.toBlob(r, 'image/png')); }
  async function guardarLogo(v) { const b = await logoPNG(v); return guardar(`logo-${P}-${limpio(v.nombre)}.png`, b, 'Pictures'); }
  function zip(archivos) { // ZIP sin compresión (store) para descargar todas las variantes de una vez en la web
    const crcT = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
    const crc = d => { let c = 0xFFFFFFFF; for (let i = 0; i < d.length; i++) c = crcT[(c ^ d[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
    const partes = [], central = []; let off = 0; const te = new TextEncoder();
    for (const [nombre, d] of archivos) { const n = te.encode(nombre), c = crc(d), h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint32(14, c, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, n.length, true); partes.push(h.buffer, n, d);
      const e = new DataView(new ArrayBuffer(46)); e.setUint32(0, 0x02014b50, true); e.setUint16(4, 20, true); e.setUint16(6, 20, true); e.setUint16(8, 0x0800, true); e.setUint32(16, c, true); e.setUint32(20, d.length, true); e.setUint32(24, d.length, true); e.setUint16(28, n.length, true); e.setUint32(42, off, true); central.push(e.buffer, n); off += 30 + n.length + d.length; }
    const tam = central.reduce((s, x) => s + (x.byteLength || x.length), 0), f = new DataView(new ArrayBuffer(22)); f.setUint32(0, 0x06054b50, true); f.setUint16(8, archivos.length, true); f.setUint16(10, archivos.length, true); f.setUint32(12, tam, true); f.setUint32(16, off, true);
    return new Blob([...partes, ...central, f.buffer], { type: 'application/zip' });
  }
  async function guardarTodos() { const L = cfg.variantesLogo(); let n = 0;
    if (!(window.AppNativo && window.AppNativo.guardarArchivo)) { const A = []; for (const v of L) toast(`Preparando logo ${A.length + 1} de ${L.length}…`), A.push([`logo-${P}-${limpio(v.nombre)}.png`, new Uint8Array(await (await logoPNG(v)).arrayBuffer())]); await guardar(`logos-${P}.zip`, zip(A), 'Download'); toast(A.length + ' logos en un ZIP'); return A.length; } for (const v of L) { await guardarLogo(v); n++; await new Promise(r => setTimeout(r, 350)); } toast(n + ' logos guardados'); return n; }
  function panelLogo() {
    const w = capa('🖼 Guardar logo (PNG transparente)'); const L = cfg.variantesLogo();
    w.v.appendChild($('p', 'opacity:.8;margin:4px 0 10px', 'Exporta el logo a 2048×2048 px con fondo transparente. En Android se guarda en Imágenes; en la web se descarga.'));
    const g = $('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px');
    for (const v of L) { const c = $('div', 'background:repeating-conic-gradient(#333 0 25%,#222 0 50%) 0/16px 16px;border-radius:10px;padding:6px;text-align:center'); const im = $('img', 'width:100%;aspect-ratio:1'); cfg.logoCanvas(256, v).then(cv => im.src = cv.toDataURL()); c.append(im, $('div', 'font-size:12px;margin:4px 0', esc(v.nombre)), btn('💾 Guardar', () => guardarLogo(v))); g.appendChild(c); }
    w.v.append(g, $('div', 'margin-top:10px', ''), btn('💾 Guardar TODAS las variantes', () => guardarTodos(), true), btn('Cerrar', w.cierra));
    return w;
  }

  // ---------- Mis hashtags ----------
  const HT = () => LSJ('hashtags', { on: true, pos: 'sd', general: [cfg.hashtagDef || '#' + limpio(cfg.titulo()).replace(/-/g, '')], esp: {} });
  const htLista = (esp) => { const h = HT(); const e = (esp && h.esp[esp]) || []; const L = [...e, ...h.general].filter(Boolean); return L.length ? L : []; };
  const htActual = (t = performance.now()) => { const h = HT(); if (!h.on) return ''; const L = htLista(cfg.especial()); return L.length ? L[Math.floor(t / 6000) % L.length] : ''; };
  let bug = null, bugTimer = 0;
  function bugMostrar(on = true) {
    const h = HT(); if (!on || !h.on || !htLista(cfg.especial()).length) { if (bug) bug.style.display = 'none'; return; }
    if (!bug) { bug = $('div', 'position:fixed;z-index:9000;pointer-events:none;padding:5px 12px;border-radius:8px;font:bold clamp(12px,2.2vw,20px) system-ui;color:#fff;background:#0008;border-left:4px solid ' + C1 + ';transition:opacity .5s;text-shadow:0 1px 3px #000'); document.body.appendChild(bug); }
    const pos = { si: 'top:10px;left:10px', sd: 'top:10px;right:10px', ii: 'bottom:12px;left:10px', id: 'bottom:12px;right:10px' }[h.pos] || 'top:10px;right:10px';
    bug.style.top = bug.style.bottom = bug.style.left = bug.style.right = ''; pos.split(';').forEach(p => { const [k, v] = p.split(':'); bug.style[k] = v; });
    bug.style.display = ''; const pon = () => { const t = htActual(); if (bug.textContent !== t) { bug.style.opacity = 0; setTimeout(() => { bug.textContent = t; bug.style.opacity = 1; }, 450); } };
    pon(); clearInterval(bugTimer); bugTimer = setInterval(pon, 1000);
  }
  function bugOcultar() { clearInterval(bugTimer); if (bug) bug.style.display = 'none'; }
  function htDibuja(g, w, h, t) { // para pantallas LED / canvas de promos y cabeceras
    const s = htActual(t); if (!s) return; const H = HT(); const fs = Math.round(h * .06); g.save(); g.font = `bold ${fs}px system-ui`; const tw = g.measureText(s).width + fs;
    const x = H.pos[1] === 'i' ? fs * .6 : w - tw - fs * .6, y = H.pos[0] === 's' ? fs * .6 : h - fs * 2;
    g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(x, y, tw, fs * 1.5); g.fillStyle = C1; g.fillRect(x, y, fs * .2, fs * 1.5); g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText(s, x + fs * .5, y + fs * .75); g.restore();
  }
  function panelHashtags() {
    const w = capa('# Mis hashtags'); let h = HT(); const guarda = () => { LSG('hashtags', h); bugOcultar(); };
    const pinta = () => {
      w.v.querySelectorAll('.htc').forEach(x => x.remove()); const c = $('div'); c.className = 'htc'; w.v.appendChild(c);
      const t1 = btn(h.on ? '✅ Rótulo de hashtags ACTIVADO' : '⬜ Rótulo de hashtags DESACTIVADO', () => { h.on = !h.on; guarda(); pinta(); }, h.on);
      const ps = sel([['si', '↖ Arriba izquierda'], ['sd', '↗ Arriba derecha'], ['ii', '↙ Abajo izquierda'], ['id', '↘ Abajo derecha']], h.pos); ps.onchange = () => { h.pos = ps.value; guarda(); };
      c.append(t1, $('div', 'margin:6px 0 2px', 'Posición en pantalla:'), ps);
      const bloque = (tit, arr, fijar) => {
        const b = $('div', 'margin-top:12px;padding:8px;border:1px solid #fff3;border-radius:10px'); b.appendChild($('div', `font-weight:bold;color:${C1}`, esc(tit)));
        arr.forEach((x, i) => { const r = $('div', 'display:flex;gap:6px;align-items:center;margin:4px 0'); const z = inp(x, '#hashtag', 40); z.onchange = () => { let v = z.value.trim().replace(/\s+/g, ''); if (v && v[0] !== '#') v = '#' + v; arr[i] = v; fijar(arr.filter(Boolean)); guarda(); pinta(); }; r.append(z, btn('🗑', () => { arr.splice(i, 1); fijar(arr); guarda(); pinta(); })); b.appendChild(r); });
        const nz = inp('', 'Nuevo hashtag…', 40); b.append(nz, btn('➕ Añadir', () => { let v = nz.value.trim().replace(/\s+/g, ''); if (!v) return; if (v[0] !== '#') v = '#' + v; arr.push(v); fijar(arr); guarda(); pinta(); })); return b;
      };
      c.appendChild(bloque('Generales (siempre)', h.general.slice(), a => h.general = a));
      for (const e of cfg.especiales()) if (e.id && e.id !== 'normal') c.appendChild(bloque('Especial ' + e.nombre, (h.esp[e.id] || []).slice(), a => { h.esp[e.id] = a; }));
      c.append($('p', 'opacity:.75;font-size:13px', 'Aparecen rotando en una esquina durante el Programa completo, en las promos, en las cabeceras y en las pantallas LED del plató. En un especial se muestran sus hashtags y los generales.'), btn('Cerrar', w.cierra, true));
    }; pinta(); return w;
  }

  // ---------- Voz Piper sin conexión (sherpa-onnx wasm) + piezas pregrabadas ----------
  let wk = null, wkListo = null, wkId = 0; const pend = {};
  function piper() {
    if (wkListo) return wkListo;
    wkListo = new Promise((res, rej) => {
      try { wk = new Worker((cfg.piperBase || 'piper/') + 'piper-worker.js'); } catch (e) { return rej(e); }
      const to = setTimeout(() => rej(new Error('Piper tarda demasiado')), 90000);
      wk.onmessage = e => { const d = e.data; if (d.type === 'listo') { clearTimeout(to); res(d.sampleRate); } else if (d.type === 'error' && d.id == null) { clearTimeout(to); rej(new Error(d.msg)); } else if (d.id && pend[d.id]) { const p = pend[d.id]; delete pend[d.id]; d.type === 'audio' ? p.res(d) : p.rej(new Error(d.msg)); } };
      wk.onerror = e => { clearTimeout(to); rej(new Error(e.message || 'worker')); };
    }); wkListo.catch(() => { wkListo = null; }); return wkListo;
  }
  async function vozPiper(texto, vel) { await piper(); const id = ++wkId; const d = await new Promise((res, rej) => { pend[id] = { res, rej }; wk.postMessage({ id, texto, velocidad: vel || 1 }); }); const ac = cfg.audioCtx(); const b = ac.createBuffer(1, d.samples.length, d.sampleRate); b.copyToChannel(d.samples, 0); return b; }
  let PIEZAS = null; const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16).padStart(8, '0'); };
  const normPal = w => w.toLowerCase().normalize('NFC').replace(/[^a-zñáéíóúü0-9]/g, '');
  async function vozPiezas(texto) {
    const base = cfg.piezasBase || 'voz/pal/'; if (!PIEZAS) PIEZAS = await (await fetch(base + 'index.json')).json();
    const ac = cfg.audioCtx(), bufs = [];
    for (const tok of texto.split(/(\s+|[,.;:!?¡¿])/)) {
      if (/^[,.;:!?]$/.test(tok)) { bufs.push(ac.createBuffer(1, Math.round(ac.sampleRate * .22), ac.sampleRate)); continue; }
      const w = normPal(tok); if (!w) continue; const f = PIEZAS[w]; if (!f) continue;
      try { bufs.push(await ac.decodeAudioData(await (await fetch(base + f)).arrayBuffer())); bufs.push(ac.createBuffer(1, Math.round(ac.sampleRate * .03), ac.sampleRate)); } catch (e) { }
    }
    const n = bufs.reduce((s, b) => s + b.length, 0); if (!n) return null; const out = ac.createBuffer(1, n, ac.sampleRate); let o = 0; for (const b of bufs) { out.getChannelData(0).set(b.getChannelData(0), o); o += b.length; } return out;
  }
  async function voz(texto) { if (!texto || !texto.trim()) return null; try { return await vozPiper(texto); } catch (e) { console.warn('Piper wasm no disponible, uso piezas', e); try { return await vozPiezas(texto); } catch (x) { return null; } } }

  // ---------- IndexedDB de promos ----------
  let dbp = null; const DB = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open(P + '_promos', 1); r.onupgradeneeded = () => { r.result.createObjectStore('promos', { keyPath: 'id' }); r.result.createObjectStore('blobs'); }; r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const tx = async (st, modo, fn) => { const d = await DB(); return new Promise((res, rej) => { const t = d.transaction(st, modo), s = t.objectStore(st); const q = fn(s); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  const promosLista = async () => ((await tx('promos', 'readonly', s => s.getAll())) || []).sort((a, b) => b.creada - a.creada);
  const promoGuarda = p => tx('promos', 'readwrite', s => s.put(p));
  const promoBorra = async p => { await tx('promos', 'readwrite', s => s.delete(p.id)); if (p.fondo && p.fondo.blob) await tx('blobs', 'readwrite', s => s.delete(p.fondo.blob)); };
  const blobGuarda = (k, b) => tx('blobs', 'readwrite', s => s.put(b, k)); const blobLee = k => tx('blobs', 'readonly', s => s.get(k));
  const tomasLibres = () => LSJ('tomas_camlibre', []);
  async function guardarTomaCamLibre(blob) { const k = 'cl' + Date.now(); await blobGuarda(k, blob); const L = tomasLibres(); L.unshift({ k, t: new Date().toLocaleString('es-ES') }); LSG('tomas_camlibre', L.slice(0, 12)); toast('Toma guardada para el Creador de promos'); return k; }

  // ---------- Reproductor / exportador de promos ----------
  async function fondoVideo(p) {
    const f = p.fondo || { tipo: 'plato' }; const v = $('video'); v.muted = true; v.playsInline = true; v.loop = true; v.crossOrigin = 'anonymous';
    if (f.tipo === 'video' || f.tipo === 'camlibre') { const b = await blobLee(f.blob); if (!b) return null; v.src = URL.createObjectURL(b); }
    else if (f.tipo === 'cabecera') { const u = await cfg.cabeceraUrl(f.cab); if (!u) return null; v.src = u; }
    else { const cv = await cfg.platoCanvas(); if (!cv) return null; v.srcObject = cv.captureStream(30); }
    try { await v.play(); } catch (e) { } return v;
  }
  const easeOut = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  async function reproducir(p, opt = {}) {
    const W = 1280, H = 720, ac = cfg.audioCtx(); try { await ac.resume(); } catch (e) { }
    const cont = $('div', 'position:fixed;inset:0;z-index:99995;background:#000;display:flex;align-items:center;justify-content:center');
    const cv = $('canvas', 'max-width:100vw;max-height:100vh;width:100%;aspect-ratio:16/9;object-fit:contain'); cv.width = W; cv.height = H; cont.appendChild(cv);
    let parar = false; const salir = btn('✕ Salir', () => parar = true); salir.style.cssText += ';position:absolute;top:10px;left:10px'; if (!opt.sinBoton) cont.appendChild(salir);
    document.body.appendChild(cont); const g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.fillStyle = C1; g.font = 'bold 36px system-ui'; g.textAlign = 'center'; g.fillText('Preparando la promo y la voz en off…', W / 2, H / 2); g.textAlign = 'left';
    cfg.alEmpezar && cfg.alEmpezar(p);
    const vid = await fondoVideo(p); const logo = await cfg.logoCanvas(512, p.logo === 'titulo' ? { tipo: 'titulo' } : p.logo && p.logo !== 'actual' ? { tipo: 'especial', id: p.logo } : { tipo: 'actual' });
    // audio: música + voz con ducking, hacia la salida y la grabación
    const mezcla = ac.createGain(); mezcla.connect(ac.destination); let destRec = null; if (opt.grabar) { destRec = ac.createMediaStreamDestination(); mezcla.connect(destRec); }
    const gM = ac.createGain(); gM.gain.value = .55; gM.connect(mezcla); let mus = null; const MU = cfg.musica;
    const sal = cfg.salida && cfg.salida(); if (destRec && sal && sal !== mezcla) { try { sal.connect(destRec); } catch (e) { } }
    if (p.musica && p.musica !== 'ninguna') { if (MU && MU.play) { try { MU.play(p.musica); } catch (e) { } } else if (cfg.musicaUrl) { try { const ab = await ac.decodeAudioData(await (await fetch(cfg.musicaUrl(p.musica))).arrayBuffer()); mus = ac.createBufferSource(); mus.buffer = ab; mus.loop = true; mus.connect(gM); mus.start(); } catch (e) { } } }
    const textoVoz = p.voz === false ? '' : (p.textoVoz || [p.titulo, ...(p.lineas || []), [p.dia, p.hora].filter(Boolean).join(', a las ')].filter(Boolean).join('. '));
    const vb = textoVoz ? await voz(textoVoz) : null;
    const lineas = (p.lineas || []).filter(Boolean); const durTxt = 2.2 + lineas.length * 2.6 + 3.2; const dur = Math.max(durTxt, vb ? vb.duration + 1.6 : 0, 6);
    let rec = null, trozos = [];
    if (opt.grabar) { const st = cv.captureStream(30); destRec.stream.getAudioTracks().forEach(t => st.addTrack(t)); const mt = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || ''; rec = new MediaRecorder(st, mt ? { mimeType: mt, videoBitsPerSecond: 5e6 } : {}); rec.ondataavailable = e => e.data.size && trozos.push(e.data); rec.start(250); }
    const t0 = ac.currentTime + .15;
    if (vb) { const s = ac.createBufferSource(); s.buffer = vb; const gv = ac.createGain(); gv.gain.value = .85; s.connect(gv); gv.connect(mezcla); s.start(t0 + .8); gM.gain.setValueAtTime(.55, t0 + .5); gM.gain.linearRampToValueAtTime(.16, t0 + .8); gM.gain.setValueAtTime(.16, t0 + .8 + vb.duration); gM.gain.linearRampToValueAtTime(.55, t0 + 1.2 + vb.duration); if (MU && MU.vol) { setTimeout(() => MU.vol(.3), 800); setTimeout(() => MU.vol(1), 1000 + vb.duration * 1000); } }
    const tr = p.transicion || 'fundido', fin = performance.now() + dur * 1000, ini = performance.now();
    await new Promise(done => {
      const fr = () => {
        const t = (performance.now() - ini) / 1000; if (parar || performance.now() > fin) return done();
        g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
        if (vid && vid.readyState >= 2) { const vw = vid.videoWidth || W, vh = vid.videoHeight || H, k = Math.max(W / vw, H / vh); g.drawImage(vid, (W - vw * k) / 2, (H - vh * k) / 2, vw * k, vh * k); }
        else { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, C2); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
        const vi = g.createLinearGradient(0, H * .35, 0, H); vi.addColorStop(0, 'rgba(0,0,0,0)'); vi.addColorStop(1, 'rgba(0,0,0,.75)'); g.fillStyle = vi; g.fillRect(0, 0, W, H);
        const ent = (k0) => { const x = easeOut((t - k0) / .6); if (tr === 'barrido') return { a: x, dx: (1 - x) * -W * .5, s: 1 }; if (tr === 'zoom') return { a: x, dx: 0, s: .6 + .4 * x }; return { a: x, dx: 0, s: 1 }; };
        const L = ent(.2); g.save(); g.globalAlpha = L.a; g.translate(W * .16 + L.dx, H * .3); g.scale(L.s, L.s); { const lh = 300 * logo.height / logo.width; g.drawImage(logo, -150, -lh / 2, 300, lh); } g.restore();
        const T = ent(.6); g.save(); g.globalAlpha = T.a; g.translate(T.dx, 0); g.fillStyle = '#fff'; g.font = 'bold 64px system-ui'; g.textAlign = 'left'; g.shadowColor = '#000'; g.shadowBlur = 12; g.fillText(p.titulo || cfg.titulo(), W * .34, H * .28, W * .62); g.restore();
        lineas.forEach((ln, i) => { const k0 = 1.6 + i * 2.6, k1 = k0 + 2.6; if (t < k0) return; const e = ent(k0); const sal = i < lineas.length - 1 ? 1 - easeOut((t - k1 + .3) / .3) : 1; g.save(); g.globalAlpha = e.a * Math.max(0, sal); g.translate(e.dx, 0); g.fillStyle = C1; g.font = 'bold 44px system-ui'; g.shadowColor = '#000'; g.shadowBlur = 10; g.fillText(ln, W * .34, H * .44, W * .62); g.restore(); });
        if (p.dia || p.hora) { const e = ent(1.2); g.save(); g.globalAlpha = e.a; g.fillStyle = C1; g.fillRect(W * .06, H * .78, W * .88, 86); g.fillStyle = '#111'; g.font = 'bold 50px system-ui'; g.textAlign = 'center'; g.fillText([p.dia, p.hora].filter(Boolean).join(' · ').toUpperCase(), W / 2, H * .78 + 60, W * .84); g.restore(); }
        htDibuja(g, W, H, performance.now());
        const fo = Math.min(1, t / .5, (fin - performance.now()) / 500); if (fo < 1) { g.fillStyle = `rgba(0,0,0,${1 - Math.max(0, fo)})`; g.fillRect(0, 0, W, H); }
        requestAnimationFrame(fr);
      }; fr();
    });
    try { mus && mus.stop(); } catch (e) { } try { MU && MU.stop && p.musica !== 'ninguna' && MU.stop(); MU && MU.vol && MU.vol(1); } catch (e) { } if (destRec && sal) { try { sal.disconnect(destRec); } catch (e) { } } mezcla.disconnect(); if (vid) { vid.pause(); if (vid.srcObject) vid.srcObject = null; }
    cfg.alTerminar && cfg.alTerminar(p);
    let blob = null; if (rec) { await new Promise(r => { rec.onstop = r; rec.stop(); }); blob = new Blob(trozos, { type: rec.mimeType || 'video/webm' }); }
    cont.remove(); return blob;
  }
  async function exportar(p) { toast('Grabando la promo en vídeo…'); const b = await reproducir(p, { grabar: true }); if (b && b.size) await guardar(`promo-${limpio(p.titulo || 'promo')}.${/mp4/.test(b.type) ? 'mp4' : 'webm'}`, b, 'Movies'); return b; }
  async function aleatoria() { const L = await promosLista().catch(() => []); return L.length ? L[Math.floor(Math.random() * L.length)] : null; }
  async function aleatoriaReproduce(prob = 1) { if (Math.random() > prob) return false; const p = await aleatoria(); if (!p) return false; await reproducir(p); return true; }
  let ocioT = 0; function ocioMenu(activo) { clearTimeout(ocioT); if (!activo) return; ocioT = setTimeout(async () => { if (cfg.enMenu && !cfg.enMenu()) return; if (await aleatoriaReproduce(1)) ocioMenu(true); }, cfg.ocioMs || 60000); }
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { if (ocioT) ocioMenu(true); }, true));

  // ---------- Editor ----------
  async function editor(p0, alGuardar) {
    const p = Object.assign({ id: 'p' + Date.now(), creada: Date.now(), titulo: cfg.titulo(), lineas: ['', '', ''], dia: 'Esta noche', hora: '22:00', logo: 'actual', musica: (cfg.musicas()[0] || [''])[0], transicion: 'fundido', fondo: { tipo: 'plato' }, voz: true, textoVoz: '' }, JSON.parse(JSON.stringify(p0 || {})));
    const w = capa(p0 ? '✏️ Editar promo' : '➕ Nueva promo'); const f = $('div', 'display:grid;gap:6px');
    const zT = inp(p.titulo, 'Título', 60); const zL = p.lineas.map((l, i) => inp(l, 'Línea ' + (i + 1), 70)); const zD = inp(p.dia, 'Día (p. ej. Este viernes)', 30); const zH = inp(p.hora, 'Hora (p. ej. 22:00)', 12);
    const lg = sel([['actual', 'Logo actual'], ['titulo', 'Logo con título propio'], ...cfg.especiales().filter(e => e.id !== 'normal').map(e => [e.id, 'Logo especial ' + e.nombre])], p.logo);
    const mu = sel([['ninguna', 'Sin música'], ...cfg.musicas()], p.musica); const tr = sel([['fundido', 'Fundido'], ['barrido', 'Barrido'], ['zoom', 'Zoom']], p.transicion);
    const fo = sel([['plato', 'Toma del plató 3D'], ['video', 'Vídeo propio'], ['camlibre', 'Grabación de Cámara libre'], ...cfg.cabeceras().map(c => ['cab:' + c.id, 'Cabecera: ' + c.nombre])], p.fondo.tipo === 'cabecera' ? 'cab:' + p.fondo.cab : p.fondo.tipo);
    const extra = $('div'); let blobNuevo = null;
    const pintaFondo = () => { extra.innerHTML = ''; if (fo.value === 'video') extra.append(btn(p.fondo.tipo === 'video' && p.fondo.blob ? '🎞 Vídeo guardado (cambiar…)' : '🎞 Elegir vídeo…', async b => { const fl = await cfg.pideArchivo('video/*'); if (fl) { blobNuevo = fl; b.innerHTML = '🎞 ' + esc(fl.name || 'vídeo'); } }));
      if (fo.value === 'camlibre') { const L = tomasLibres(); if (!L.length) extra.append($('div', 'opacity:.8', 'Aún no hay tomas. Graba una en Cámara libre (botón «Guardar para promos»).')); else { const s = sel(L.map(x => [x.k, 'Toma ' + x.t]), p.fondo.blob); s.onchange = () => p.fondo.blob = s.value; if (!L.some(x => x.k === p.fondo.blob)) p.fondo.blob = L[0].k; extra.append(s); } } };
    fo.onchange = pintaFondo; pintaFondo();
    const vz = btn(p.voz ? '🎙 Voz en off: SÍ (Piper, sin conexión)' : '🎙 Voz en off: NO', b => { p.voz = !p.voz; b.innerHTML = p.voz ? '🎙 Voz en off: SÍ (Piper, sin conexión)' : '🎙 Voz en off: NO'; }); const zV = inp(p.textoVoz, 'Texto de la voz (vacío = título + líneas + día y hora)', 300);
    const lab = t => $('div', `color:${C1};font-weight:bold;margin-top:4px`, t);
    f.append(lab('Título'), zT, lab('Líneas'), ...zL, lab('Día y hora'), zD, zH, lab('Logo'), lg, lab('Música del juego'), mu, lab('Transición'), tr, lab('Fondo'), fo, extra, lab('Voz en off'), vz, zV); w.v.appendChild(f);
    const recoge = async () => { Object.assign(p, { titulo: zT.value.trim(), lineas: zL.map(z => z.value.trim()), dia: zD.value.trim(), hora: zH.value.trim(), logo: lg.value, musica: mu.value, transicion: tr.value, textoVoz: zV.value.trim() });
      if (fo.value.startsWith('cab:')) p.fondo = { tipo: 'cabecera', cab: fo.value.slice(4) }; else if (fo.value === 'video') { if (blobNuevo) { const k = 'v' + p.id; await blobGuarda(k, blobNuevo); p.fondo = { tipo: 'video', blob: k }; } else if (p.fondo.tipo !== 'video') p.fondo = { tipo: 'plato' }; } else if (fo.value === 'camlibre') p.fondo = { tipo: 'camlibre', blob: p.fondo.blob || (tomasLibres()[0] || {}).k }; else p.fondo = { tipo: 'plato' }; return p; };
    w.v.append($('div', 'margin-top:10px'), btn('💾 Guardar', async () => { await promoGuarda(await recoge()); toast('Promo guardada'); w.cierra(); alGuardar && alGuardar(); }, true), btn('▶ Vista previa', async () => { const q = await recoge(); w.o.style.display = 'none'; await reproducir(q); w.o.style.display = 'flex'; }), btn('Cancelar', w.cierra));
  }
  async function panelPromos() {
    const w = capa('🎬 Creador de promos'); const c = $('div'); w.v.appendChild(c);
    const pinta = async () => { c.innerHTML = ''; c.append($('p', 'opacity:.8;margin:2px 0 8px', 'Crea tus propias promos: aparecen en PROMOS, en las pausas de publicidad y al azar (menú en reposo y entre secciones). Voz en off con Piper dentro de la app, sin conexión.'), btn('➕ Nueva promo', () => editor(null, pinta), true));
      const L = await promosLista(); if (!L.length) c.append($('p', 'opacity:.7', 'Todavía no has creado ninguna promo.'));
      for (const p of L) { const r = $('div', 'display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:6px 0;padding:6px;border:1px solid #fff3;border-radius:10px'); r.append($('div', 'flex:1;min-width:160px', `<b>${esc(p.titulo)}</b><br><span style="opacity:.75;font-size:13px">${esc([p.dia, p.hora].filter(Boolean).join(' · '))} · ${esc({ plato: 'plató 3D', video: 'vídeo propio', camlibre: 'cámara libre', cabecera: 'cabecera' }[p.fondo.tipo] || '')}</span>`), btn('▶', async () => { w.o.style.display = 'none'; await reproducir(p); w.o.style.display = 'flex'; }), btn('✏️', () => editor(p, pinta)), btn('⬇ Vídeo', async () => { w.o.style.display = 'none'; await exportar(p); w.o.style.display = 'flex'; }), btn('🗑', async () => { if (confirm('¿Borrar la promo «' + p.titulo + '»?')) { await promoBorra(p); pinta(); } })); c.appendChild(r); }
      c.append(btn('Cerrar', w.cierra)); };
    await pinta(); return w;
  }
  return { guardar, guardarLogo, guardarTodos, logoPNG, panelLogo, panelHashtags, htActual, htDibuja, bugMostrar, bugOcultar, voz, vozPiper, vozPiezas, promosLista, promoGuarda, promoBorra, reproducir, exportar, aleatoria, aleatoriaReproduce, ocioMenu, panelPromos, editor, guardarTomaCamLibre, tomasLibres };
}
if (typeof window !== 'undefined') window.crearExtras = crearExtras;
