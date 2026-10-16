// ===================================================================================================
// v1.26 · LOGO DE LAS CABECERAS: Opciones › «🏷️ Logo de las cabeceras». «Logo actual» (el de siempre, sin tocar)
// o uno de los 6 logos de Iker recreados en 3D de verdad (letras extruidas con bisel cromado, brillo especular,
// giro lento y barrido de luz). Siempre dos exclamaciones altas: ¡ a la izquierda y ! a la derecha.
// Letra: Montserrat ExtraBold (OFL), solo los glifos necesarios (src/logos3d_font.js).
// ===================================================================================================
const LOGO3D = [
  { id: 'abismo', nombre: '¡Acierta o abismo!', l: ['ACIERTA', 'ABISMO'], o: true, fondo: 'chevron', ring: 0x3ad0ff },
  { id: 'ninos', nombre: '¡Ahora caigo! Niños', l: ['AHORA', 'CAIGO'], ninos: true, fondo: 'neon', ring: 0xff4fd8 },
  { id: 'plato', nombre: '¡Ahora caigo! (plató)', l: ['AHORA', 'CAIGO'], fondo: 'plato', ring: 0xffa21a },
  { id: 's300', nombre: '¡Ahora caigo! 300 suscriptores', l: ['AHORA', 'CAIGO'], sub: '300 suscriptores', fondo: 'azul', ring: 0xff8a1a },
  { id: 's300plato', nombre: '¡Ahora caigo! 300 SUSCRIPTORES (placa)', l: ['AHORA', 'CAIGO'], placa: '300 SUSCRIPTORES', fondo: 'plato', ring: 0xffa21a },
  { id: 'azul', nombre: '¡Ahora caigo! (azul y naranja)', l: ['AHORA', 'CAIGO'], fondo: 'chevron', ring: 0x3ad0ff },
];
const logoSel = () => { try { return localStorage.getItem('ac_logo_cab') || 'actual'; } catch (e) { return 'actual'; } };
function l3Shapes(T, txt, size) { // texto → formas (como FontLoader, sin dependencias extra)
  const F = LOGO3D_FONT, s = size / F.upm, shapes = []; let x = 0;
  for (const ch of txt) {
    const g = F.g[ch] || F.g[' ']; if (!g) { x += size * 0.3; continue; }
    if (g.o) { const o = g.o.split(' '), p = new T.ShapePath(); let i = 0; const X = () => +o[i++] * s + x, Y = () => +o[i++] * s;
      while (i < o.length) { const a = o[i++]; if (a === 'm') p.moveTo(X(), Y()); else if (a === 'l') p.lineTo(X(), Y()); else if (a === 'q') { const ex = X(), ey = Y(), cx = X(), cy = Y(); p.quadraticCurveTo(cx, cy, ex, ey); } else if (a === 'b') { const ex = X(), ey = Y(), ax = X(), ay = Y(), bx = X(), by = Y(); p.bezierCurveTo(ax, ay, bx, by, ex, ey); } }
      shapes.push(...p.toShapes()); }
    x += g.ha * s;
  }
  return { shapes, w: x };
}
function l3Env(T) { // reflejo cromado: cielo azul, horizonte naranja, suelo oscuro
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 128);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.3, '#8ab8ff'); gr.addColorStop(0.48, '#ffd28a'); gr.addColorStop(0.52, '#20283a'); gr.addColorStop(1, '#05070c'); g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
  const t = new T.CanvasTexture(c); t.mapping = T.EquirectangularReflectionMapping; t.colorSpace = T.SRGBColorSpace; return t;
}
function l3Fondo(T, tipo) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 576; const g = c.getContext('2d'), W = 1024, H = 576;
  const lin = (a, b) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  if (tipo === 'chevron') { lin('#0b2fa8', '#061a5a'); g.fillStyle = '#f39a12'; for (let k = 0; k < 6; k++) { const x = k * 190 - 40; g.beginPath(); g.moveTo(x, 40); g.lineTo(x + 70, 40); g.lineTo(x + 150, 190); g.lineTo(x + 70, 340); g.lineTo(x, 340); g.lineTo(x + 80, 190); g.fill(); } g.fillStyle = '#0a1a4ab0'; g.fillRect(0, 360, W, H); }
  else if (tipo === 'neon') { lin('#2a0820', '#0a0208'); g.lineWidth = 9; for (let k = 0; k < 16; k++) { g.strokeStyle = k % 2 ? '#ff8a2a' : '#ffd23a'; g.globalAlpha = 0.55; g.beginPath(); g.arc(W / 2, H * 0.55, 60 + k * 34, 0, 7); g.stroke(); } g.globalAlpha = 1; }
  else if (tipo === 'azul') { lin('#0a6ad0', '#02123a'); g.lineWidth = 26; for (let k = 0; k < 4; k++) { g.strokeStyle = ['#ffb02e', '#ff6a1a', '#ffd23a', '#ff8a1a'][k]; g.globalAlpha = 0.7; g.beginPath(); g.ellipse(W / 2, H * 0.86, 260 + k * 90, 70 + k * 26, 0, 0, 7); g.stroke(); } g.globalAlpha = 1; }
  else { lin('#1a1440', '#05030f'); const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#ff8a1a'); gr.addColorStop(1, '#ffc23a'); g.fillStyle = gr; g.fillRect(W * 0.18, 0, W * 0.44, H * 0.22); g.fillStyle = '#3a4a8a'; for (let k = 0; k < 14; k++) g.fillRect(W * 0.66, 20 + k * 22, W * 0.3, 10); g.strokeStyle = '#ff9a1a'; g.lineWidth = 10; g.beginPath(); g.ellipse(W / 2, H * 0.84, 380, 80, 0, 0, 7); g.stroke(); }
  const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t;
}
/** construye el logo 3D (Group) · devuelve también lo que hay que liberar */
function l3Logo(T, cfg, baja) {
  const env = l3Env(T), G = new T.Group(), tirar = [env];
  const cara = new T.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 150, envMap: env, reflectivity: 0.32, emissive: 0x44464e });
  const lado = new T.MeshPhongMaterial({ color: 0x7c88a6, specular: 0xffffff, shininess: 110, envMap: env, reflectivity: 0.7 });
  const ext = (shapes, prof = 0.34, bev = 0.06) => { const geo = new T.ExtrudeGeometry(shapes, { depth: prof, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.7, bevelSegments: baja ? 1 : 3, curveSegments: baja ? 4 : 7 }); tirar.push(geo); return new T.Mesh(geo, [cara, lado]); };
  const texto = (t, size, prof, bev) => { const r = l3Shapes(T, t, size), m = ext(r.shapes, prof, bev); m.position.x = -r.w / 2; const g = new T.Group(); g.add(m); g.userData.w = r.w; return g; };
  const L1 = texto(cfg.l[0], 1.0, 0.36, 0.06), L2 = texto(cfg.l[1], 1.0, 0.36, 0.06); L1.position.y = 0.14; L2.position.y = -1.1; G.add(L1, L2);
  if (cfg.o) { L1.position.y = 0.28; L2.position.y = -1.24; const o = texto('O', 0.42, 0.2, 0.03); o.position.y = -0.37; G.add(o); const bm = new T.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 120, envMap: env, reflectivity: 0.4 }); for (const sx of [-1, 1]) { const bg = new T.BoxGeometry(1.6, 0.08, 0.2); tirar.push(bg); const b = new T.Mesh(bg, bm); b.position.set(sx * 1.25, -0.2, 0.1); G.add(b); } tirar.push(bm); }
  const w = Math.max(L1.userData.w, L2.userData.w), top = L1.position.y + 0.75, bot = L2.position.y - 0.05, alto = top - bot;
  const excl = (inv) => { // exclamación alta: barra que se estrecha + punto redondeado
    const sh = new T.Shape(), b0 = bot + alto * 0.26, ww = 0.36, wn = 0.2;
    if (!inv) { sh.moveTo(-ww / 2, top); sh.lineTo(ww / 2, top); sh.lineTo(wn / 2, b0); sh.lineTo(-wn / 2, b0); }
    else { sh.moveTo(-ww / 2, bot); sh.lineTo(ww / 2, bot); sh.lineTo(wn / 2, top - alto * 0.26); sh.lineTo(-wn / 2, top - alto * 0.26); }
    const d = new T.Shape(), cy = inv ? top - 0.17 : bot + 0.17; d.absarc(0, cy, 0.17, 0, Math.PI * 2, false);
    return ext([sh, d], 0.4, 0.06);
  };
  const iz = excl(true), de = excl(false); iz.position.x = -w / 2 - 0.42; de.position.x = w / 2 + 0.42; G.add(iz, de);
  if (cfg.ninos) { const n = texto('NIÑOS', 0.82, 0.46, 0.05); n.position.set(w * 0.28, bot - 0.55, 0.25); n.rotation.y = -0.28; G.add(n); }
  if (cfg.sub) { const s = texto(cfg.sub, 0.56, 0.18, 0.03); s.position.set(0, bot - 0.75, 0.1); G.add(s); }
  if (cfg.placa) { const pg = new T.BoxGeometry(w * 0.95, 0.6, 0.18); tirar.push(pg); const pm = new T.MeshPhongMaterial({ color: 0x2a3550, specular: 0xaab4ff, shininess: 90, envMap: env, reflectivity: 0.35 }); tirar.push(pm); const p = new T.Mesh(pg, pm); p.position.set(0, bot - 0.42, 0.2); G.add(p); const s = texto(cfg.placa, 0.36, 0.08, 0.015); s.position.set(0, bot - 0.55, 0.32); G.add(s); }
  tirar.push(cara, lado); G.position.y = -(top + bot) / 2 + (cfg.sub || cfg.placa || cfg.ninos ? 0.35 : 0);
  return { G, tirar };
}
let LOGO_ULT = 0;
/** cortinilla con el logo 3D elegido (unos 5 s; toca para saltar) */
async function logo3dCard(sess, id = logoSel(), dur = 5200) {
  const cfg = LOGO3D.find(x => x.id === id); if (!cfg) return false; LOGO_ULT = performance.now(); mec('logo 3D ' + id);
  const T = _E, baja = it.quality === 'baja' || (navigator.hardwareConcurrency || 8) <= 4;
  const div = document.createElement('div'); div.id = 'logo3d'; div.style.cssText = 'position:fixed;inset:0;z-index:61;background:#000;cursor:pointer';
  const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; div.appendChild(cv); document.body.appendChild(div);
  let ren; try { ren = new T.WebGLRenderer({ canvas: cv, antialias: !baja }); } catch (e) { div.remove(); return false; }
  ren.setPixelRatio(Math.min(baja ? 1 : 1.5, devicePixelRatio || 1)); ren.outputColorSpace = T.SRGBColorSpace;
  const sc = new T.Scene(), cam = new T.PerspectiveCamera(42, 16 / 9, 0.1, 100);
  const resize = () => { const w = innerWidth, h = innerHeight; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; resize(); addEventListener('resize', resize);
  const fondo = l3Fondo(T, cfg.fondo), fg = new T.PlaneGeometry(32, 18), fm = new T.MeshBasicMaterial({ map: fondo }), fp = new T.Mesh(fg, fm); fp.position.z = -6; sc.add(fp);
  const rg = new T.TorusGeometry(4.2, 0.09, 6, baja ? 40 : 72), rm = new T.MeshBasicMaterial({ color: cfg.ring }), ring = new T.Mesh(rg, rm); ring.rotation.x = Math.PI / 2; ring.position.y = -2.6; ring.scale.set(1, 1, 1); sc.add(ring);
  const { G, tirar } = l3Logo(T, cfg, baja); sc.add(G);
  sc.add(new T.AmbientLight(0xffffff, 0.55)); const key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(2, 4, 6); sc.add(key);
  const sweep = new T.PointLight(0xfff4d0, 40, 14, 2); sc.add(sweep); const rim = new T.DirectionalLight(cfg.ring, 0.9); rim.position.set(-4, -1, -3); sc.add(rim);
  let vivo = true; div.onclick = () => vivo = false; const t0 = performance.now(); window.__logo3d = { id, t: 0 };
  const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3), rebote = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -9 * x) * Math.cos(x * 12);
  const marco = () => {
    const t = (performance.now() - t0) / 1000; window.__logo3d.t = t; const k = rebote(t / 1.1);
    G.scale.setScalar(0.2 + 0.8 * k); G.rotation.y = (1 - ease(t / 1.1)) * -1.6 + Math.sin(t * 0.7) * 0.22; G.rotation.x = Math.sin(t * 0.5) * 0.05;
    sweep.position.set(-7 + ((t * 3.2) % 14), 1.5, 3.2); ring.rotation.z = t * 0.4; ring.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
    cam.position.set(Math.sin(t * 0.25) * 0.5, 0.3, 7.6 - ease(t / 4) * 1.0); cam.lookAt(0, -0.1, 0); ren.render(sc, cam);
  };
  try { await sess.until(() => { if (vivo) marco(); return !vivo || performance.now() - t0 > dur || sess.alive === false; }); }
  finally {
    removeEventListener('resize', resize); div.remove(); window.__logo3d = null;
    for (const x of tirar) try { x.dispose(); } catch (e) { } [fondo, fg, fm, rg, rm].forEach(x => x.dispose()); try { ren.dispose(); ren.forceContextLoss(); } catch (e) { }
  }
  return true;
}
const logoSes = () => ({ alive: true, w: ms => new Promise(r => setTimeout(r, ms)), until(f) { return new Promise(r => { const p = () => f() ? r() : requestAnimationFrame(p); p(); }); } });
{ // enganche: tras las cabeceras (cabecera 3D, apertura, vídeo propio) y al salir «al aire» en el Programa completo
  const conLogo = fn => async function (hud, sess, ...r) { const v = await fn.call(this, hud, sess, ...r); if (v !== false && logoSel() !== 'actual') try { await logo3dCard(sess); } catch (x) { if (x === _o) throw x; console.warn('logo3d', x); } return v; };
  cab3D = conLogo(cab3D); aperturaPrograma = conLogo(aperturaPrograma); cabVideoPrograma = conLogo(cabVideoPrograma);
  const rm0 = regidorMomento; regidorMomento = async function (c, k, ...r) { if (k === 'aire' && logoSel() !== 'actual' && performance.now() - LOGO_ULT > 25000) try { await logo3dCard(c.s); } catch (x) { if (x === _o) throw x; } return rm0.call(this, c, k, ...r); };
}
function filaLogoCab() {
  const box = document.createElement('div'); box.className = 'ocustom'; box.id = 'optLogo126';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🏷️ Logo de las cabeceras'; box.appendChild(lb);
  const row = document.createElement('div'); row.className = 'orow obtns'; row.style.cssText = 'flex-wrap:wrap;gap:8px';
  for (const o of [{ id: 'actual', nombre: 'Logo actual' }, ...LOGO3D]) {
    const b = document.createElement('button'); b.className = 'tbtn' + (logoSel() === o.id ? ' sel' : ''); b.dataset.logo = o.id; b.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;max-width:150px;font-size:12px';
    if (o.id !== 'actual') { const im = document.createElement('img'); im.src = 'assets/logos126/' + o.id + '.jpg'; im.style.cssText = 'width:120px;height:68px;object-fit:cover;border-radius:6px'; b.appendChild(im); }
    b.appendChild(document.createTextNode(o.nombre + (o.id === 'actual' ? '' : ' · 3D')));
    b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem('ac_logo_cab', o.id); row.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); };
    row.appendChild(b);
  }
  const ver = document.createElement('button'); ver.className = 'tbtn'; ver.id = 'btnVerLogo3d'; ver.textContent = '👁 Ver el logo 3D'; ver.onclick = ev => { ev.stopPropagation(); logoSel() !== 'actual' && logo3dCard(logoSes()); };
  const nota = document.createElement('p'); nota.className = 'onote small'; nota.textContent = 'Sale al final de las cabeceras del Programa completo. «Logo actual» deja el logo de siempre tal cual. Los 3D son los logos de Iker con letras en relieve, bisel cromado y brillo.';
  box.append(row, ver, nota); return box;
}
window.__logo3dApi = { card: (id, ms) => logo3dCard(logoSes(), id, ms), lista: LOGO3D };
