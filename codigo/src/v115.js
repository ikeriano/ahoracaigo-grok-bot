// ===== ¡Ahora caigo! 1.15: Cámara libre, Creador de promos, Mis hashtags, Guardar logo (PNG transparente) =====
let EXAC = null;
function acLogoVariante(size, v) { // dibuja el logo (2D) con la variante pedida y restaura el estado
  const esp0 = Ms, t0 = localStorage.getItem('ac_titulo'); v = v || { tipo: 'actual' };
  try { if (v.tipo === 'especial') Ms = v.id; if (v.tipo === 'original') { Ms = 'normal'; localStorage.removeItem('ac_titulo'); } return ph(size, Math.round(size * .875), { variant: Eo[Ms] ? Ms : 'normal' }); }
  finally { Ms = esp0; if (t0 != null) localStorage.setItem('ac_titulo', t0); }
}
function acVariantes() { const L = [{ tipo: 'actual', nombre: 'Actual' }, { tipo: 'original', nombre: 'Original' }]; if ((localStorage.getItem('ac_titulo') || '').trim()) L.push({ tipo: 'titulo', nombre: 'Título propio' }); for (const e of Do) if (e.id !== 'normal' && Eo[e.id]) L.push({ tipo: 'especial', id: e.id, nombre: /^especial/i.test(e.name) ? e.name : 'Especial ' + e.name }); return L; }
function acEnMenu() { return Mi && Gr === 'main' && !en('menu').classList.contains('hidden'); }
function instalaV115() {
  if (EXAC) return EXAC;
  EXAC = crearExtras({ pref: 'ac', color: '#ffc21a', color2: '#0b2fa8', titulo: () => tituloTexto(), hashtagDef: '#AhoraCaigo', toast: t => yn.toast(t, 2600),
    especial: () => Ms, especiales: () => Do.filter(e => Eo[e.id]).map(e => ({ id: e.id, nombre: e.name })),
    logoCanvas: async (size, v) => acLogoVariante(size, v), variantesLogo: acVariantes,
    audioCtx: () => F.ctx, salida: () => F.master, piperBase: 'piper/', piezasBase: 'voz/pal/', pideArchivo: (acc) => new Promise(res => { const i = document.createElement('input'); i.type = 'file'; i.accept = acc || '*/*'; i.onchange = () => res(i.files[0] || null); i.click(); }),
    musicas: () => [['Trilha', 'Tema principal'], ['TemaCurto', 'Tema corto'], ['SuspenseDuelo', 'Suspense del duelo'], ['TrilhaCurta@Stage', 'Cortinilla']],
    musica: { play: id => F.playMusic(id, true, .8), stop: () => F.stopMusic(), vol: f => { const m = F.musicSrc; if (m) m.gain.gain.setTargetAtTime(.8 * f, F.ctx.currentTime, .15); } },
    cabeceras: () => (VCAB.lista || []).map(x => ({ id: x.k, nombre: x.nombre })),
    cabeceraUrl: async (k) => { const L = await vcabLista(); const e = L.find(x => x.k === k); if (!e) return null; return e.fijo ? e.fijo : URL.createObjectURL(await vcabLee(e.k)); },
    platoCanvas: async () => { try { Xe.startOrbit(new _E.Vector3(0, 0, 0), 10.8, 4.8, 0.5, 0.06, 1.2); } catch (e) { } return Xe.renderer.domElement; },
    alEmpezar: () => { try { F.stopMusic(); } catch (e) { } }, enMenu: acEnMenu });
  vcabLista().catch(() => { }); try { acLucesInstala(); } catch (e) { console.warn(e); } window.__EX = EXAC; acLedHashtags(); return EXAC;
}
let acLed = null;
function acLedHashtags() { // tira LED con el hashtag que rota, sobre el fondo del plató
  if (acLed) return; const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 128; const T = _E, tx = new T.CanvasTexture(cv); tx.colorSpace = T.SRGBColorSpace;
  acLed = new T.Mesh(new T.PlaneGeometry(6.4, .8), new T.MeshBasicMaterial({ map: tx, transparent: true, toneMapped: false })); acLed.position.set(0, 6.6, -8.6); Xe.scene.add(acLed);
  setInterval(() => { const s = EXAC.htActual(); acLed.visible = !!s && !Xe.override; if (!s) return; const g = cv.getContext('2d'); g.clearRect(0, 0, 1024, 128); g.fillStyle = 'rgba(0,0,0,.75)'; g.fillRect(0, 0, 1024, 128); g.fillStyle = '#ffc21a'; g.fillRect(0, 0, 14, 128); g.fillRect(0, 120, 1024, 8); g.font = 'bold 76px system-ui'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 512, 64, 980); tx.needsUpdate = true; }, 1000);
}
// ---- Cámara libre en ¡Ahora caigo! (usa Xe.override: la escena del plató con una cámara propia) ----
function camaraLibreAC() {
  const cam = Xe.camera.clone(); const mira = new _E.Vector3(0, 1.2, 0); cam.position.set(0, 3.2, 9); cam.lookAt(mira);
  Xe.override = { scene: Xe.scene, camera: cam, update: () => { } }; try { F.playMusic('Trilha', true, .6); } catch (e) { }
  let luces = true, led = true; const panelL = acPanelLuces();
  return new Promise(res => abrirCamaraLibre({ canvas: Xe.renderer.domElement, camera: cam, mira, audio: { ctx: F.ctx, nodo: F.master }, toast: t => yn.toast(t, 2200),
    aplicar: (p, m) => { cam.position.set(p.x, p.y, p.z); mira.set(m.x, m.y, m.z); cam.lookAt(mira); },
    toggles: { '💡 Luces': on => { Xe.scene.traverse(o => { if (o.isLight && !o.isAmbientLight && !o.isHemisphereLight) o.visible = on; }); luces = on; },
      '📺 LEDs': on => { led = on; Xe.scene.traverse(o => { if (o.isMesh && o.material && o.material.map && o.material.map.isVideoTexture) o.visible = on; }); if (acLed) acLed.visible = on; },
      '🖼 Logo': on => Xe.scene.traverse(o => { if (o.isMesh && o.material && o.material.map && o.material.map.image && o.material.map.image.width >= 400 && o.material.map.image.height >= 350 && o.material.map.image.height < o.material.map.image.width) o.visible = on; }),
      '👥 Público': on => { try { Xe.setAudience ? Xe.setAudience(on) : (Xe.audience && (Xe.audience.visible = on)); } catch (e) { } },
      '🎵 Música': on => on ? F.playMusic('Trilha', true, .6) : F.stopMusic() },
    guardarCabecera: async blob => { await vcabGuarda(new File([blob], 'Grabación cámara libre.webm', { type: blob.type }), 'r' + Date.now()); VCAB.lista = null; },
    guardarPromo: b => EXAC.guardarTomaCamLibre(b), guardarArchivo: (n, b) => EXAC.guardar(n, b, 'Movies'),
    soltar: () => { panelL.remove(); LUCES115.hasta = 0; acLucesModo('charla'); Xe.override = null; Xe.scene.traverse(o => { if (o.isLight) o.visible = true; }); try { F.stopMusic(); } catch (e) { } res(); } }));
}
function filasV115() {
  const fila = (txt, sub, fn) => { const d = document.createElement('div'); d.className = 'ocustom'; const l = document.createElement('div'); l.className = 'olabel'; l.textContent = txt; const r = document.createElement('div'); r.className = 'orow'; const b = document.createElement('button'); b.className = 'tbtn'; b.textContent = sub; b.onclick = e => { e.stopPropagation(); try { F.play('Tecla'); } catch (x) { } fn(); }; r.appendChild(b); d.append(l, r); return d; };
  instalaV115();
  return [fila('# Mis hashtags', 'Editar hashtags', () => EXAC.panelHashtags()), fila('🎬 Creador de promos', 'Abrir el creador', () => EXAC.panelPromos()), fila('🖼 Guardar logo (PNG transparente)', 'Guardar logos', () => EXAC.panelLogo()), fila('🎥 Cámara libre', 'Abrir la cámara libre', () => ii('camlibre'))];
}
function promosV115(r) { instalaV115(); const z = document.createElement('div'); z.className = 'col'; r.appendChild(z); z.appendChild(ei('🎬 Creador de promos', 'Crea, edita, borra y exporta tus promos en vídeo', 'gold', () => EXAC.panelPromos())); EXAC.promosLista().then(L => { for (const p of L) z.appendChild(ei('⭐ ' + p.titulo, [p.dia, p.hora].filter(Boolean).join(' · ') + ' · promo propia', '', () => EXAC.reproducir(p))); }).catch(() => { }); }
window.__v115 = { instalaV115, camaraLibreAC, acLogoVariante };
// ---- Coreografía de cabezas móviles (como el programa original) ----
// Aro semicircular de cabezas móviles detrás de la grada alta + aro circular sobre el centro del escenario.
// Dos estados que cambian AL INSTANTE: «energía» (haces blancos estrechos, barridos rápidos y erráticos, vecinos en
// sentidos opuestos = abanico cruzado) y «charla» (los haces se paran, se fijan y se abren a un baño suave azul/morado).
const LUCES115 = { modo: 'charla', heads: [], hasta: 0, grupo: null, puertas: null, abre: 0 };
function acLucesInstala() {
  if (LUCES115.grupo || !Xe || !Xe.scene) return; const T = _E, G = new T.Group(); G.name = 'CoreografiaLuces'; LUCES115.grupo = G;
  const haz = () => { const g = new T.ConeGeometry(.5, 14, 18, 1, true); g.translate(0, -7, 0); const m = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .16, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }); return new T.Mesh(g, m); };
  const cabeza = (x, y, z, i, aro) => { const pivote = new T.Group(); pivote.position.set(x, y, z); const caja = new T.Mesh(new T.BoxGeometry(.35, .35, .35), new T.MeshStandardMaterial({ color: 0x111111, metalness: .6 })); const h = haz(); pivote.add(caja, h); G.add(pivote);
    LUCES115.heads.push({ p: pivote, h, i, aro, pan: 0, tilt: .5, pan0: 0, tilt0: .5, panT: 0, tiltT: .5, t0: 0, dur: 1.5, dir: i % 2 ? 1 : -1 }); };
  for (let i = 0; i < 16; i++) { const a = Math.PI * (i / 15) ; cabeza(Math.cos(a) * 15, 9.5, -Math.sin(a) * 15 + 1, i, 'semi'); }
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; cabeza(Math.cos(a) * 3.6, 10.5, Math.sin(a) * 3.6, i, 'centro'); }
  for (const [r, w] of [[3.3, .07], [4.4, .07]]) { const a = new T.Mesh(new T.TorusGeometry(r, w, 8, 96), new T.MeshBasicMaterial({ color: 0xff1ad9, toneMapped: false })); a.rotation.x = -Math.PI / 2; a.position.y = .06; G.add(a); }
  for (let k = 0; k < 4; k++) { const e = new T.Mesh(new T.BoxGeometry(3.4 - k * .2, .03, .03), new T.MeshBasicMaterial({ color: k % 2 ? 0xffffff : 0x9fd8ff, toneMapped: false })); e.position.set(0, .25 + k * .25, 6.2 - k * .45); G.add(e); }
  const pared = new T.Mesh(new T.CylinderGeometry(19, 19, 9, 64, 1, true, Math.PI * .6, Math.PI * .8), new T.MeshBasicMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 1024, 0); gr.addColorStop(0, '#1a1a8a'); gr.addColorStop(.5, '#4a1a9a'); gr.addColorStop(1, '#1a1a8a'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 256); g.fillStyle = 'rgba(160,200,255,.55)'; for (let y = 16; y < 256; y += 22) g.fillRect(0, y, 1024, 3); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; })(), side: T.BackSide, transparent: true, opacity: .55, depthWrite: false }));
  pared.position.set(0, 4.5, 2); G.add(pared); LUCES115.pared = pared; LUCES115.texAzul = pared.material.map;
  { const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const g = c.getContext('2d'); for (let y = 0; y < 256; y += 32) { g.fillStyle = (y / 32) % 2 ? '#1a3aff' : '#ff1a9a'; g.fillRect(0, y, 1024, 32); } LUCES115.texRosa = new T.CanvasTexture(c); LUCES115.texRosa.colorSpace = T.SRGBColorSpace; }
  const puerta = (s) => { const m = new T.Mesh(new T.PlaneGeometry(1.6, 3.2), new T.MeshBasicMaterial({ color: 0x2a6aff, toneMapped: false })); m.position.set(s * .8, 1.7, -8.5); m.userData.s = s; G.add(m); return m; };
  LUCES115.puertas = [puerta(-1), puerta(1)];
  const llave = new T.SpotLight(0xffd9a8, 0, 30, .45, .5, 1); llave.position.set(0, 9, 8); llave.target.position.set(0, 1, 0); G.add(llave, llave.target); LUCES115.llave = llave;
  Xe.scene.add(G); acLucesModo('charla');
  let ult = performance.now(); const bucle = (t) => { const dt = Math.min(.1, (t - ult) / 1000); ult = t; acLucesFrame(dt, t / 1000); requestAnimationFrame(bucle); }; requestAnimationFrame(bucle);
  try { const pm = F.playMusic.bind(F); F.playMusic = (...a) => { acLucesEnergia(3); return pm(...a); }; const pl = F.play.bind(F); F.play = (n, ...a) => { if (/Caida|Cae|Trampilla|Queda|Grito|Moeda|Vitoria|Fanfarr/i.test(String(n))) acLucesEnergia(2.5); return pl(n, ...a); }; } catch (e) { }
}
const NEON = [0x22ff44, 0x22e6ff, 0xff22d4, 0xff8a1a, 0xffee22];
const MANUAL = { pan: 0, tilt: .6, vel: 1, color: 0xffffff, activo: false };
function acLucesModo(m) {
  LUCES115.modo = m; const T = _E; const G = LUCES115.grupo;
  if (G) { if (!LUCES115.suelo) { LUCES115.suelo = []; for (let i = 0; i < 6; i++) { const g = new T.ConeGeometry(.6, 12, 16, 1, true); g.translate(0, 6, 0); const b = new T.Mesh(g, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .12, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); const a = Math.PI * (.15 + i * .14); b.position.set(Math.cos(a) * 9, 0, -Math.sin(a) * 9 + 2); G.add(b); LUCES115.suelo.push(b); } }
    for (const b of LUCES115.suelo) b.visible = m === 'fiesta'; }
  if (LUCES115.pared) LUCES115.pared.material.map = m === 'presentacion' ? LUCES115.texRosa : LUCES115.texAzul;
  if (m === 'fiesta' || m === 'presentacion' || m === 'manual') { for (const h of LUCES115.heads) { const on = m !== 'presentacion' || h.i === 3 && h.aro === 'centro'; h.p.visible = on && (m !== 'fiesta' || h.aro === 'centro' || h.i % 2 === 0); h.h.scale.set(m === 'manual' ? 1 : 2.2, 1.3, m === 'manual' ? 1 : 2.2); h.h.material.opacity = m === 'presentacion' ? .28 : m === 'fiesta' ? .38 : .12; if (m === 'presentacion') h.h.material.color.set(0x9a2aff); } if (LUCES115.llave) LUCES115.llave.intensity = m === 'presentacion' ? 0 : .6; return; }
  for (const h of LUCES115.heads) h.p.visible = true;
  for (const h of LUCES115.heads) { const e = m === 'energia'; h.h.scale.set(e ? 1 : 4.2, 1, e ? 1 : 4.2); h.h.material.color.set(e ? 0xffffff : (h.i % 2 ? 0x3a2aff : 0x8a2aff)); h.h.material.opacity = e ? .2 : .07; h.t0 = -1; }
  if (LUCES115.llave) LUCES115.llave.intensity = m === 'energia' ? .3 : 2.2;
}
function acLucesEnergia(seg) { LUCES115.hasta = Math.max(LUCES115.hasta, performance.now() + seg * 1000); if (LUCES115.modo !== 'energia') acLucesModo('energia'); }
function acPuertas(seg = 4) { LUCES115.abre = performance.now() + seg * 1000; acLucesEnergia(seg + 1); }
function acLucesFrame(dt, t) {
  if (!LUCES115.grupo) return; if (LUCES115.modo === 'energia' && performance.now() > LUCES115.hasta) acLucesModo('charla');
  const e = LUCES115.modo === 'energia', M = LUCES115.modo;
  if (M === 'fiesta' || M === 'presentacion' || M === 'manual') { for (const h of LUCES115.heads) { if (!h.p.visible) continue;
      if (M === 'manual') { h.pan = MANUAL.pan + (h.i % 2 ? 1 : -1) * Math.sin(t * MANUAL.vel + h.i) * .6; h.tilt = MANUAL.tilt; h.h.material.color.set(MANUAL.color); }
      else { const v = (.35 + (h.i % 4) * .12) * (M === 'presentacion' ? .6 : 1), f = h.i * 1.7; h.pan = Math.sin(t * v + f) * 1.4; h.tilt = .35 + .4 * (1 + Math.cos(t * v * .8 + f)) / 2 * 2;
        if (M === 'fiesta') { const c = (t * .25 + h.i * .37) % NEON.length, a = Math.floor(c), k = c - a; h.h.material.color.set(NEON[a]).lerp(new _E.Color(NEON[(a + 1) % NEON.length]), k); } }
      h.p.rotation.set(h.tilt, h.pan, 0, 'YXZ'); } return; }
  for (const h of LUCES115.heads) {
    if (e) { if (h.t0 < 0 || t - h.t0 > h.dur) { h.pan0 = h.pan; h.tilt0 = h.tilt; h.dur = 1 + Math.random(); h.dir = -h.dir; h.panT = h.pan + h.dir * (Math.PI / 2 + Math.random() * Math.PI / 2); h.tiltT = .25 + Math.random() * .9; h.t0 = t; }
      const k = Math.min(1, (t - h.t0) / h.dur), s = k * k * (3 - 2 * k); h.pan = h.pan0 + (h.panT - h.pan0) * s; h.tilt = h.tilt0 + (h.tiltT - h.tilt0) * s; }
    h.p.rotation.set(h.tilt * (h.aro === 'semi' ? -1 : 1), h.pan, 0, 'YXZ');
  }
  const ab = performance.now() < LUCES115.abre ? 1 : 0; for (const d of LUCES115.puertas || []) { d.position.x += ((d.userData.s * (.8 + ab * 1.7)) - d.position.x) * Math.min(1, dt * 4); }
}
// panel de control de luces (Cámara libre): modo, pan, tilt, velocidad y color
function acPanelLuces() {
  const d = document.createElement('div'); d.style.cssText = 'position:fixed;right:10px;bottom:90px;z-index:99980;background:#000b;border:2px solid #ffc21a;border-radius:12px;padding:8px;color:#fff;font:13px system-ui;width:220px';
  ['pointerdown', 'pointerup', 'keydown', 'wheel', 'touchstart'].forEach(ev => d.addEventListener(ev, e => e.stopPropagation()));
  d.innerHTML = '<b style="color:#ffc21a">💡 Control de luces</b>'; const sel = document.createElement('select'); sel.style.cssText = 'width:100%;margin:4px 0';
  for (const [k, t] of [['charla', 'Charla (baño azul)'], ['energia', 'Energía (barridos)'], ['fiesta', 'Cabecera / Fiesta'], ['presentacion', 'Presentación'], ['manual', 'Manual']]) { const o = document.createElement('option'); o.value = k; o.textContent = t; sel.appendChild(o); }
  sel.value = LUCES115.modo; sel.onchange = () => { if (sel.value === 'energia') acLucesEnergia(3600); else { LUCES115.hasta = 0; acLucesModo(sel.value); } }; d.appendChild(sel);
  const rng = (et, min, max, v, fn) => { const l = document.createElement('label'); l.style.display = 'block'; l.textContent = et; const r = document.createElement('input'); r.type = 'range'; r.min = min; r.max = max; r.step = (max - min) / 100; r.value = v; r.style.width = '100%'; r.oninput = () => { if (sel.value !== 'manual') { sel.value = 'manual'; LUCES115.hasta = 0; acLucesModo('manual'); } fn(+r.value); }; l.appendChild(r); d.appendChild(l); };
  rng('Pan', -3.14, 3.14, MANUAL.pan, v => MANUAL.pan = v); rng('Tilt', 0, 1.3, MANUAL.tilt, v => MANUAL.tilt = v); rng('Velocidad', 0, 4, MANUAL.vel, v => MANUAL.vel = v);
  const c = document.createElement('input'); c.type = 'color'; c.value = '#ffffff'; c.oninput = () => { MANUAL.color = parseInt(c.value.slice(1), 16); if (sel.value !== 'manual') { sel.value = 'manual'; acLucesModo('manual'); } }; d.append('Color ', c);
  document.body.appendChild(d); return d;
}
window.__luces115 = { acPanelLuces, acLucesInstala, acLucesEnergia, acPuertas, acLucesModo, LUCES115 };
