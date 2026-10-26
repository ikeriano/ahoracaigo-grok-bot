/* ¡Ahora Caigo! 1.59 · extras: efectos 3D, cámaras, lugares, menús y escenas nuevas.
   Todo lo nuevo es INVENTADO / RECREACIÓN (personajes y sucesos ficticios). Sin opciones nuevas: no hay nada que activar. */
(function () {
  'use strict';
  if (typeof window.__ac159 !== 'function') return;
  const I = () => window.__ac159();
  const D = window.__D159 || { escenas: {}, personajes: {} };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hudEl = () => document.getElementById('hud') || document.body;
  /* ---------- audio sintético (sin ficheros) ---------- */
  const A = {
    ctx() { try { return I().K.ctx; } catch (e) { return null; } },
    out() { try { return I().K.sfx; } catch (e) { return null; } },
    tone(f0, f1, dur, type = 'sine', vol = 0.25, t0 = 0) {
      const c = this.ctx(), o = this.out(); if (!c || !o) return;
      const t = c.currentTime + t0, os = c.createOscillator(), g = c.createGain();
      os.type = type; os.frequency.setValueAtTime(f0, t); if (f1 !== f0) os.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      os.connect(g); g.connect(o); os.start(t); os.stop(t + dur + 0.05);
    },
    noise(dur, vol = 0.3, lp = 4000, t0 = 0) {
      const c = this.ctx(), o = this.out(); if (!c || !o) return;
      const n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
      const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = lp; g.gain.value = vol; s.buffer = b; s.connect(f); f.connect(g); g.connect(o); s.start(c.currentTime + t0);
    },
    pitido() { this.tone(1000, 1000, 0.7, 'sine', 0.22); },
    bocina() { this.tone(180, 140, 0.35, 'sawtooth', 0.25); this.tone(240, 190, 0.35, 'sawtooth', 0.2); },
    sirena() { for (let i = 0; i < 4; i++) this.tone(600, 900, 0.3, 'triangle', 0.18, i * 0.3); },
    redoble() { for (let i = 0; i < 22; i++) this.noise(0.07, 0.28 + i * 0.01, 2500, i * 0.055); },
    tada() { [523, 659, 784].forEach((f, i) => this.tone(f, f, 0.18, 'square', 0.16, i * 0.12)); this.tone(1047, 1047, 0.7, 'square', 0.2, 0.4); },
    trueno() { this.noise(1.8, 0.7, 500); },
    boing() { this.tone(500, 120, 0.5, 'sine', 0.3); this.tone(900, 200, 0.5, 'triangle', 0.1); },
    squeak() { this.tone(900, 1700, 0.12, 'square', 0.14); this.tone(1100, 2000, 0.1, 'square', 0.12, 0.18); },
    splat() { this.noise(0.5, 0.6, 1400); this.tone(200, 60, 0.25, 'sine', 0.3); },
    campana() { this.tone(880, 880, 1.2, 'sine', 0.25); this.tone(1760, 1760, 0.8, 'sine', 0.1); },
    telefono() { for (let i = 0; i < 6; i++) this.tone(1400, 1400, 0.07, 'square', 0.08, i * 0.1 + (i > 2 ? 0.25 : 0)); },
    grillos() { for (let i = 0; i < 8; i++) this.tone(4200, 4300, 0.05, 'square', 0.04, i * 0.13); },
    zumbido() { this.tone(110, 120, 1.4, 'sawtooth', 0.07); },
    whoosh() { this.noise(0.45, 0.35, 1800); },
    ding() { this.tone(1320, 1320, 0.5, 'sine', 0.2); },
    trompeta() { [392, 392, 392, 523].forEach((f, i) => this.tone(f, f, 0.14, 'square', 0.14, i * 0.17)); },
    ufo() { this.tone(300, 900, 0.6, 'sine', 0.15); this.tone(900, 300, 0.6, 'sine', 0.15, 0.6); },
  };
  /* ---------- superposiciones 2D ---------- */
  const overlays = new Set();
  function ov(css, html, ms) {
    const e = document.createElement('div'); e.className = 'fx159'; e.style.cssText = 'position:absolute;pointer-events:none;z-index:14;' + css; if (html != null) e.innerHTML = html;
    hudEl().appendChild(e); overlays.add(e); if (ms) setTimeout(() => { e.remove(); overlays.delete(e); }, ms); return e;
  }
  function canvasEl() { try { return I().Oe.renderer.domElement; } catch (e) { return null; } }
  let filtroOn = false;
  function filtro(f) { const c = canvasEl(); if (c) { c.style.filter = f || ''; filtroOn = !!f; } }
  /* ---------- 3D ---------- */
  const live = new Set(); // elementos 3D vivos { g, fn, until }
  function addProp(g, fn, ms) {
    const X = I(); X.Oe.scene.add(g); const o = { g, t0: performance.now(), fn, until: performance.now() + ms };
    o.cb = (dt) => { const t = (performance.now() - o.t0) / 1000; if (performance.now() > o.until) { quita(o); return; } try { fn(t, dt, g); } catch (e) { quita(o); } };
    X.Oe.onFrame.push(o.cb); live.add(o); return o;
  }
  function quita(o) {
    if (!live.has(o)) return; live.delete(o);
    try { const X = I(); const i = X.Oe.onFrame.indexOf(o.cb); if (i >= 0) X.Oe.onFrame.splice(i, 1); X.Oe.scene.remove(o.g); o.g.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } }); } catch (e) { }
  }
  function limpia() { [...live].forEach(quita); [...overlays].forEach(e => { e.remove(); }); overlays.clear(); filtro(''); const c = canvasEl(); if (c) c.style.transform = ''; }
  const mat = (c, em = 0) => new (I().T.MeshLambertMaterial)({ color: c, emissive: em });
  const bas = (c, o = {}) => new (I().T.MeshBasicMaterial)({ color: c, ...o });
  const mesh = (geo, m, x = 0, y = 0, z = 0) => { const q = new (I().T.Mesh)(geo, m); q.position.set(x, y, z); return q; };
  const G = () => new (I().T.Group)();
  const T = () => I().T;
  function textTex(txt, w = 512, h = 256, bg = '#0a2a9a', fg = '#fff', fs = 70) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffd23a'; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = fg; g.font = `900 ${fs}px Arial Black, Arial`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const words = String(txt).split(' '); const lines = []; let cur = '';
    for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (g.measureText(t).width > w - 60 && cur) { lines.push(cur); cur = wd; } else cur = t; } lines.push(cur);
    lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * fs * 1.1));
    const tx = new (T().CanvasTexture)(c); tx.colorSpace = T().SRGBColorSpace; return tx;
  }
  const hp = () => I().Oe.host.root.position;
  /* partículas (confeti / nieve / monedas) */
  function particulas(cols, n, dur, size = 0.09, grav = 2.2, spread = 5) {
    const X = I(), p0 = hp(); const g = G(); const items = [];
    for (let i = 0; i < n; i++) {
      const m = mesh(new (T().PlaneGeometry)(size, size * 1.5), bas(cols[i % cols.length], { side: T().DoubleSide }), 0, 0, 0);
      m.position.set(p0.x + rnd(-spread / 2, spread / 2), p0.y + rnd(5, 9), p0.z + rnd(-2, 3));
      g.add(m); items.push({ m, v: rnd(0.8, 2.2), rx: rnd(1, 6), rz: rnd(1, 6), sw: rnd(0, 6), sa: rnd(0.3, 1.2) });
    }
    addProp(g, (t, dt) => { items.forEach(o => { o.m.position.y -= o.v * dt * grav * 0.6; o.m.position.x += Math.sin(t * 2 + o.sw) * o.sa * dt; o.m.rotation.x += o.rx * dt; o.m.rotation.z += o.rz * dt; if (o.m.position.y < p0.y) o.m.position.y = p0.y + rnd(5, 8); }); }, dur);
  }
  const FX = {
    flash() { const e = ov('inset:0;background:#fff;opacity:1;transition:opacity .45s', null, 700); requestAnimationFrame(() => requestAnimationFrame(() => e.style.opacity = '0')); },
    rayo() { FX.flash(); setTimeout(FX.flash, 220); A.trueno(); },
    shake() { const c = canvasEl(); if (!c) return; const t0 = performance.now(); const f = () => { const t = performance.now() - t0; if (t > 900) { c.style.transform = ''; return; } c.style.transform = `translate(${rnd(-9, 9)}px,${rnd(-7, 7)}px)`; requestAnimationFrame(f); }; f(); A.noise(0.8, 0.5, 300); },
    apagon() { const e = ov('inset:0;background:#000;opacity:0;transition:opacity .25s', null, 2600); requestAnimationFrame(() => requestAnimationFrame(() => e.style.opacity = '.93')); setTimeout(() => e.style.opacity = '0', 1500); A.tone(400, 40, 0.8, 'sawtooth', 0.15); },
    estatica() { const e = ov('inset:0;opacity:.8', '<canvas style="width:100%;height:100%"></canvas>', 800); const c = e.firstChild; c.width = 160; c.height = 90; const g = c.getContext('2d'); const f = () => { if (!e.isConnected) return; const im = g.createImageData(160, 90); for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); requestAnimationFrame(f); }; f(); A.noise(0.7, 0.3, 6000); },
    rebobina() { FX.estatica(); ov('left:50%;top:12%;transform:translateX(-50%);font:900 clamp(18px,4.4vw,44px) Arial;color:#fff;text-shadow:0 0 10px #000,2px 2px 0 #e01010;letter-spacing:2px', '◀◀ REBOBINANDO', 1400); A.tone(1800, 300, 0.7, 'sawtooth', 0.08); },
    lenta() { ov('left:4%;top:16%;font:900 clamp(14px,3.2vw,30px) Arial;color:#fff;background:rgba(224,16,16,.9);padding:.25em .7em;border-radius:6px;animation:pp159 1s infinite', '● REPETICIÓN · CÁMARA LENTA', 5200); ov('inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(0,0,0,.55) 100%)', null, 5200); filtro('saturate(1.25) contrast(1.08)'); setTimeout(() => { if (filtroOn) filtro(''); }, 5200); A.whoosh(); },
    bn() { filtro('grayscale(1) contrast(1.15)'); }, sepia() { filtro('sepia(.9) contrast(1.05)'); }, color() { filtro(''); },
    rotulo(M) { const t = String(M || '').replace(/_/g, ' '); ov('left:6%;right:6%;bottom:21%;text-align:center;font:900 clamp(20px,5vw,52px) "Arial Black",Arial;color:#fff;text-shadow:0 3px 0 #0a1a7a,0 0 18px #000;animation:in159 .3s', t, 2800); },
    sello(M, x) { x.c.sello = String(M || '').replace(/_/g, ' '); x.c.selloCol = '#e01010'; x.c.selloT = performance.now(); },
    confeti() { particulas([0xffd23a, 0xff3a6a, 0x3a8aff, 0x3aff8a, 0xffffff], 160, 5200); A.tada(); },
    nieve() { particulas([0xffffff, 0xdfeaff], 140, 5200, 0.07, 1.2); },
    monedas() { particulas([0xffd23a, 0xffc21a, 0xf0a010], 90, 4800, 0.12, 2.6); A.tone(1500, 2400, 0.4, 'square', 0.08); },
    luces() { const X = I(), p = hp(), g = G(); const L = [0xff2a6a, 0x2a8aff, 0xffd23a].map((c, i) => { const l = new (T().PointLight)(c, 30, 14, 1.4); l.position.set(p.x + (i - 1) * 3, p.y + 3, p.z + 2); g.add(l); return l; }); addProp(g, (t) => L.forEach((l, i) => l.intensity = 20 + 25 * Math.abs(Math.sin(t * 6 + i * 2))), 3600); },
    tarta() {
      const p = hp(), g = G(); const cake = G();
      cake.add(mesh(new (T().CylinderGeometry)(.34, .34, .2, 18), mat(0xff9ac0)), mesh(new (T().CylinderGeometry)(.24, .24, .17, 18), mat(0xfff0f0), 0, .18, 0), mesh(new (T().SphereGeometry)(.07, 10, 8), mat(0xd01030), 0, .32, 0));
      g.add(cake); g.position.set(p.x + .1, p.y + 7, p.z + .05); let hit = 0, blobs = [];
      addProp(g, (t, dt) => { if (!hit) { g.position.y -= (3 + t * 14) * dt; if (g.position.y <= p.y + 1.85) { hit = t; A.splat(); cake.scale.y = .45; cake.scale.x = cake.scale.z = 1.7; for (let i = 0; i < 12; i++) { const b = mesh(new (T().SphereGeometry)(.06, 6, 5), mat(0xfff0f0), 0, 0, 0); b.position.set(0, 1.85, 0); b.userData = { vx: rnd(-1.4, 1.4), vy: rnd(.5, 2), vz: rnd(-1, 1.4) }; g.add(b); blobs.push(b); } } } else { g.position.y = Math.max(p.y + .6, g.position.y - (t - hit) * .35 * dt * 9); blobs.forEach(b => { b.userData.vy -= 6 * dt; b.position.x += b.userData.vx * dt; b.position.y += b.userData.vy * dt; b.position.z += b.userData.vz * dt; }); } }, 5200);
      A.whoosh();
    },
    micro() {
      const p = hp(), g = G(); g.add(mesh(new (T().CylinderGeometry)(.025, .025, 4.2, 6), mat(0x222222), 0, 0, 0), mesh(new (T().CylinderGeometry)(.11, .11, .55, 10), mat(0x555555), 0, -2.2, 0), mesh(new (T().CylinderGeometry)(.125, .125, .4, 10), mat(0xeeeeee, 0x222222), 0, -2.2, 0));
      g.rotation.z = Math.PI / 2.6; addProp(g, (t) => { const k = Math.min(1, t / 0.9), out = Math.max(0, (t - 3.2) / 0.9); g.position.set(p.x - 1.9 + 1.2 * (k - out), p.y + 3.6 - 1.5 * (k - out) + Math.sin(t * 2) * .05, p.z + .2); g.rotation.z = Math.PI / 2.6 + Math.sin(t * 1.5) * .05; }, 4300); A.whoosh();
    },
    pato() {
      const p = hp(), g = G(); const y = 0xffd21a; g.add(mesh(new (T().SphereGeometry)(.2, 12, 10), mat(y), 0, .2, 0), mesh(new (T().SphereGeometry)(.12, 10, 8), mat(y), .12, .42, 0), mesh(new (T().BoxGeometry)(.1, .03, .08), mat(0xff7a10), .24, .4, 0), mesh(new (T().SphereGeometry)(.015, 6, 6), mat(0), .2, .46, .06), mesh(new (T().SphereGeometry)(.015, 6, 6), mat(0), .2, .46, -.06));
      g.scale.setScalar(1.6); addProp(g, (t) => { g.position.set(p.x - 4 + t * 1.5, p.y + Math.abs(Math.sin(t * 7)) * .07, p.z + 1.3); g.rotation.z = Math.sin(t * 7) * .12; if (((t * 3) | 0) !== (((t - .02) * 3) | 0)) A.squeak(); }, 5400);
    },
    robot() {
      const p = hp(), g = G(); g.add(mesh(new (T().CylinderGeometry)(.38, .4, .12, 20), mat(0x2a2a30)), mesh(new (T().CylinderGeometry)(.16, .16, .05, 16), mat(0x3aa060), 0, .09, 0)); const led = mesh(new (T().SphereGeometry)(.025, 6, 6), bas(0x30ff60), .25, .1, 0); g.add(led);
      addProp(g, (t) => { const a = t * .9; g.position.set(p.x + Math.sin(a) * 2.6, p.y + .07, p.z + 1.2 + Math.cos(a * 1.3) * .8); g.rotation.y = t * 1.2; led.material.color.setHex(((t * 4) | 0) % 2 ? 0x30ff60 : 0xff3030); }, 6200); A.zumbido();
    },
    globos() {
      const p = hp(), g = G(), cols = [0xff3a5a, 0x3a8aff, 0xffd23a, 0x3aff8a, 0xff8a1a, 0xb04aff]; const it = [];
      for (let i = 0; i < 14; i++) { const b = G(); const s = mesh(new (T().SphereGeometry)(.24, 12, 10), mat(cols[i % 6], 0x111111)); s.scale.y = 1.25; b.add(s, mesh(new (T().CylinderGeometry)(.004, .004, 1.1, 3), bas(0xffffff), 0, -.75, 0)); b.position.set(p.x + rnd(-3.5, 3.5), p.y - .5, p.z + rnd(-1.5, 3)); g.add(b); it.push({ b, v: rnd(.7, 1.5), s: rnd(0, 6) }); }
      addProp(g, (t, dt) => it.forEach(o => { o.b.position.y += o.v * dt; o.b.position.x += Math.sin(t + o.s) * .3 * dt; }), 6200);
    },
    ovni() {
      const p = hp(), g = G(); g.add(mesh(new (T().SphereGeometry)(.7, 18, 10), mat(0x9aa4b4, 0x202830), 0, 0, 0), mesh(new (T().SphereGeometry)(.38, 14, 10), new (T().MeshBasicMaterial)({ color: 0x6af0ff, transparent: true, opacity: .75 }), 0, .2, 0));
      g.children[0].scale.y = .28; const beam = mesh(new (T().ConeGeometry)(1.2, 3.4, 20, 1, true), new (T().MeshBasicMaterial)({ color: 0xfff08a, transparent: true, opacity: .22, side: T().DoubleSide, depthWrite: false }), 0, -1.8, 0); g.add(beam);
      addProp(g, (t) => { const k = Math.min(1, t / 1.2), out = Math.max(0, (t - 4.6) / 1.2); g.position.set(p.x - 1.2 + (k - 1) * 5 + out * 6, p.y + 5.2 + Math.sin(t * 2) * .2, p.z + 1); g.rotation.y = t * 2; beam.visible = t > 1.3 && t < 4.6; beam.rotation.y = -t * 2; }, 6200); A.ufo();
    },
    humo() { const p = hp(), g = G(), it = []; for (let i = 0; i < 12; i++) { const s = mesh(new (T().SphereGeometry)(.3, 8, 7), new (T().MeshBasicMaterial)({ color: 0xbfbfc8, transparent: true, opacity: .6, depthWrite: false })); s.position.set(p.x + rnd(-.6, .6), p.y + .2, p.z + rnd(.2, 1)); g.add(s); it.push({ s, v: rnd(.4, 1) }); } addProp(g, (t, dt) => it.forEach(o => { o.s.position.y += o.v * dt; o.s.scale.addScalar(dt * .9); o.s.material.opacity = Math.max(0, .6 - t * .13); }), 4600); A.noise(.9, .3, 900); },
    gato() {
      const p = hp(), g = G(), bk = 0x151515; g.add(mesh(new (T().SphereGeometry)(.2, 10, 8), mat(bk), 0, .26, 0), mesh(new (T().SphereGeometry)(.12, 10, 8), mat(bk), .26, .36, 0), mesh(new (T().ConeGeometry)(.04, .09, 4), mat(bk), .27, .5, .06), mesh(new (T().ConeGeometry)(.04, .09, 4), mat(bk), .27, .5, -.06), mesh(new (T().SphereGeometry)(.018, 6, 6), bas(0xffe030), .36, .39, .05), mesh(new (T().SphereGeometry)(.018, 6, 6), bas(0xffe030), .36, .39, -.05));
      g.children[0].scale.x = 1.6; const tail = mesh(new (T().CylinderGeometry)(.03, .02, .5, 6), mat(bk), -.38, .45, 0); tail.rotation.z = .5; g.add(tail); for (const [x, z] of [[.15, .08], [.15, -.08], [-.15, .08], [-.15, -.08]]) g.add(mesh(new (T().CylinderGeometry)(.03, .03, .22, 5), mat(bk), x, .1, z));
      g.scale.setScalar(1.4); addProp(g, (t) => { g.position.set(p.x - 4.2 + t * 1.3, p.y, p.z + 1.6); tail.rotation.z = .5 + Math.sin(t * 4) * .3; }, 6500); A.tone(700, 500, .5, 'triangle', .1);
    },
    pelota() {
      const p = hp(), g = G(), cols = [0xff3a3a, 0xffffff, 0x3a8aff, 0xffd23a, 0xffffff, 0x3aff8a]; for (let i = 0; i < 6; i++) g.add(mesh(new (T().SphereGeometry)(.42, 12, 10, i * Math.PI / 3, Math.PI / 3), new (T().MeshLambertMaterial)({ color: cols[i], side: T().DoubleSide })));
      addProp(g, (t) => { g.position.set(p.x - 3 + t * 1.4, p.y + .45 + Math.abs(Math.sin(t * 3.2)) * 1.6, p.z + 1.5); g.rotation.y = t * 3; g.rotation.z = t * 2; if (((t * 3.2 / Math.PI) | 0) !== (((t - .03) * 3.2 / Math.PI) | 0)) A.boing(); }, 6500);
    },
    dron() {
      const p = hp(), g = G(); g.add(mesh(new (T().BoxGeometry)(.35, .1, .35), mat(0x202428))); const rot = []; for (const [x, z] of [[.28, .28], [-.28, .28], [.28, -.28], [-.28, -.28]]) { const r = mesh(new (T().CylinderGeometry)(.17, .17, .01, 14), new (T().MeshBasicMaterial)({ color: 0xaab4c4, transparent: true, opacity: .55 }), x, .07, z); g.add(r); rot.push(r); } g.add(mesh(new (T().SphereGeometry)(.04, 6, 6), bas(0xff2020), 0, .06, .2));
      addProp(g, (t) => { const a = t * .9; g.position.set(p.x + Math.cos(a) * 2.4, p.y + 2.4 + Math.sin(t * 2) * .2, p.z + 1 + Math.sin(a) * 2); g.rotation.y = -a; g.rotation.z = .15; rot.forEach((r, i) => r.rotation.y = t * 40); }, 6200); A.zumbido();
    },
    cartel(M, x) {
      const p = hp(), g = G(); const tx = textTex(String(M || 'APLAUSOS').replace(/_/g, ' '), 512, 256, '#0a2a9a', '#fff', 78); g.add(mesh(new (T().PlaneGeometry)(2.2, 1.1), new (T().MeshBasicMaterial)({ map: tx, side: T().DoubleSide })), mesh(new (T().CylinderGeometry)(.012, .012, 3, 4), bas(0x222222), -.9, 1.5, 0), mesh(new (T().CylinderGeometry)(.012, .012, 3, 4), bas(0x222222), .9, 1.5, 0));
      addProp(g, (t) => { const k = Math.min(1, t / .8), out = Math.max(0, (t - 3.6) / .7); g.position.set(p.x - 2.1, p.y + 5.6 - 3.2 * Math.max(0, k - out) + (k - out < 0 ? 0 : 0), p.z + 1.4); g.rotation.z = Math.sin(t * 2) * .04; }, 4600); A.whoosh();
    },
    moneda() {
      const p = hp(), g = G(); const c = document.createElement('canvas'); c.width = c.height = 128; const cx = c.getContext('2d'); cx.fillStyle = '#ffcf2a'; cx.fillRect(0, 0, 128, 128); cx.fillStyle = '#b07a00'; cx.font = '900 90px Arial'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('€', 64, 68); const tx = new (T().CanvasTexture)(c);
      const m = mesh(new (T().CylinderGeometry)(.8, .8, .12, 28), [mat(0xe0a810, 0x302000), new (T().MeshLambertMaterial)({ map: tx }), new (T().MeshLambertMaterial)({ map: tx })]); m.rotation.x = Math.PI / 2; g.add(m);
      addProp(g, (t) => { const k = Math.min(1, t / .9); g.position.set(p.x + 1.7, p.y + 6 - 5.3 * k * k + (t > .9 ? Math.abs(Math.sin((t - .9) * 5)) * Math.max(0, .6 - (t - .9) * .3) : 0), p.z + 1.1); g.rotation.z = t > 1.2 ? 0 : t * 3; if (t > .9 && !g.userData.d) { g.userData.d = 1; A.campana(); } }, 5400);
    },
    trofeo() {
      const p = hp(), g = G(), au = mat(0xffcc22, 0x604000); g.add(mesh(new (T().CylinderGeometry)(.35, .4, .1, 12), mat(0x333333)), mesh(new (T().CylinderGeometry)(.06, .06, .5, 8), au, 0, .3, 0), mesh(new (T().CylinderGeometry)(.3, .12, .45, 14, 1, true), new (T().MeshLambertMaterial)({ color: 0xffcc22, emissive: 0x604000, side: T().DoubleSide }), 0, .78, 0), mesh(new (T().TorusGeometry)(.16, .025, 6, 12), au, .32, .8, 0), mesh(new (T().TorusGeometry)(.16, .025, 6, 12), au, -.32, .8, 0));
      addProp(g, (t) => { const k = Math.min(1, t / 1.2); g.position.set(p.x - 1.4, p.y - 1 + 1.1 * k, p.z + 1.2); g.rotation.y = t * 1.5; g.scale.setScalar(1.6); }, 5000); A.tada();
    },
    rueda() { // noria de feria pequeña de fondo
      const p = hp(), g = G(); const r = G(); r.add(mesh(new (T().TorusGeometry)(1.4, .04, 6, 28), mat(0xdd2244))); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; r.add(mesh(new (T().CylinderGeometry)(.015, .015, 2.8, 4), mat(0xdddddd), 0, 0, 0)).rotation.z = a; const cab = mesh(new (T().BoxGeometry)(.3, .25, .2), mat([0xffd23a, 0x3a8aff, 0xff3a6a, 0x3aff8a][i % 4]), Math.cos(a) * 1.4, Math.sin(a) * 1.4, 0); r.add(cab); } g.add(r); g.position.set(p.x + 3, p.y + 2.2, p.z - 2.2);
      addProp(g, (t) => { r.rotation.z = t * .5; r.children.forEach(c => { if (c.geometry && c.geometry.type === 'BoxGeometry') c.rotation.z = -r.rotation.z; }); }, 6000);
    },
  };
  ['pitido', 'bocina', 'sirena', 'redoble', 'tada', 'trueno', 'boing', 'campana', 'telefono', 'grillos', 'ding', 'trompeta', 'squeak', 'zumbido', 'whoosh'].forEach(n => { FX[n] = () => A[n](); });
  FX.tos = () => A.noise ? A.noise(0.25, 0.12, 900) : A.whoosh();
  FX.aplausos = () => { try { I().ze.aplauso(2.5, .7); } catch (e) {} };
  FX.risa = () => { try { I().ze.risas(); } catch (e) {} };
  const partes = y => String(y || '').split('+');
  window.__fx159 = {
    has: y => !!y && partes(y).every(n => Object.prototype.hasOwnProperty.call(FX, n)),
    async run(y, M, x) { const ps = partes(y); for (const n of ps) { try { FX[n](M, x); } catch (e) { console.warn('fx159', n, e); } } await x.u.w(ps.some(n => ['redoble', 'tarta', 'trofeo'].includes(n)) ? 900 : 350); },
  };
  /* ---------- cámaras ---------- */
  const CAM = {
    grua(n, r) { const p = r.root.position; n.cut(vec(p.x + 1.2, p.y + 6.4, p.z + 7), vec(p.x, p.y + .5, p.z)); n.glide(vec(p.x + .4, p.y + 5.2, p.z + 5.6), vec(p.x, p.y + 1, p.z), 3); },
    suelo(n, r) { const p = r.root.position; n.cut(vec(p.x + .5, p.y + .3, p.z + 3.1), vec(p.x, p.y + 1.7, p.z)); },
    cenital(n, r) { const p = r.root.position; n.cut(vec(p.x, p.y + 9, p.z + .8), vec(p.x, p.y, p.z)); },
    lado(n, r) { const p = r.root.position; n.cut(vec(p.x + 4.2, p.y + 1.5, p.z + 1.2), vec(p.x, p.y + 1.4, p.z)); },
    espalda(n, r) { const p = r.root.position; n.cut(vec(p.x - .5, p.y + 1.9, p.z - 3.2), vec(p.x, p.y + 1.3, p.z + 9)); },
    publico(n, r) { const p = r.root.position; n.cut(vec(p.x + 6, p.y + 2.8, p.z + 9), vec(p.x, p.y + 1.4, p.z)); },
    gloria(n, r) { const p = r.root.position; n.cut(vec(p.x + .9, p.y + 1.7, p.z + 6), vec(p.x, p.y + 1.35, p.z)); n.glide(vec(p.x + .55, p.y + 1.65, p.z + 2.3), vec(p.x, p.y + 1.45, p.z), 3.2); },
    orbita(n, r) { const p = r.root.position; n.startOrbit(vec(p.x, p.y, p.z), 4.4, 2.3, 0, .38, 1.35); },
    lugar(n, r, pl) { if (!pl) return CAM.gloria(n, r); const c = pl.centro; n.cut(vec(c.x, c.y + 2.9, c.z + 6.6), vec(c.x, c.y + 1.15, c.z)); },
    detalle(n, r, pl) { const c = pl ? pl.centro : r.root.position; n.cut(vec(c.x + 1.3, c.y + 1.1, c.z + 2.2), vec(c.x - .2, c.y + .8, c.z)); },
  };
  const vec = (x, y, z) => new (I().V)(x, y, z);
  window.__cam159 = { has: m => Object.prototype.hasOwnProperty.call(CAM, m), run: (m, n, r, p) => CAM[m](n, r, p) };
  /* ---------- lugares nuevos ---------- */
  function fondo(g, txt, c1, c2, w = 7, h = 3.6, z = -1.4, deco) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d'); const gr = x.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, c1); gr.addColorStop(1, c2); x.fillStyle = gr; x.fillRect(0, 0, 512, 256);
    if (deco) deco(x); x.fillStyle = 'rgba(255,255,255,.9)'; x.font = '900 34px Arial'; x.textAlign = 'center'; x.fillText(txt, 256, 40);
    const tx = new (T().CanvasTexture)(c); tx.colorSpace = T().SRGBColorSpace; const m = mesh(new (T().PlaneGeometry)(w, h), new (T().MeshBasicMaterial)({ map: tx }), 0, h / 2, z); g.add(m); return m;
  }
  const suelo = (g, col, r = 3) => g.add(mesh(new (T().CylinderGeometry)(r, r, .04, 28), mat(col), 0, .02, .8));
  const box = (g, w, h, d, c, x, y, z, em = 0) => { const b = mesh(new (T().BoxGeometry)(w, h, d), mat(c, em), x, y, z); g.add(b); return b; };
  const LUG = {
    camerino(g) { fondo(g, 'CAMERINO', '#3a1a4a', '#1a0a2a', 7, 3.6, -1.4, x => { for (let i = 0; i < 9; i++) { x.fillStyle = '#ffe9a0'; x.beginPath(); x.arc(110 + i * 36, 120, 9, 0, 7); x.fill(); } x.strokeStyle = '#d8dce4'; x.lineWidth = 6; x.strokeRect(90, 100, 340, 120); }); suelo(g, 0x4a2a5a); box(g, 2.4, .08, .5, 0xd8c8b0, 0, .85, -.8); box(g, 2.2, .85, .4, 0x5a3a2a, 0, .42, -.8); box(g, .5, .5, .5, 0xaa2244, -1.9, .25, .2); for (let i = 0; i < 5; i++) box(g, .06, 1.2, .06, 0x888888, 1.7 + i * .2, .6, -.6); const bar = box(g, 1.2, .04, .04, 0x888888, 1.9, 1.8, -.6); for (let i = 0; i < 5; i++) box(g, .5, .9, .06, [0xff3a5a, 0x3a8aff, 0xffd23a, 0x3aff8a, 0xff8a1a][i], 1.5 + i * .2, 1.25, -.6); },
    cafeteria(g) { fondo(g, 'CAFETERÍA', '#3a2a1a', '#1a1208', 7, 3.6, -1.4, x => { x.fillStyle = '#8a5a30'; x.fillRect(60, 120, 390, 14); x.fillStyle = '#e8e0d0'; for (let i = 0; i < 6; i++) { x.fillRect(80 + i * 62, 90, 28, 30); } }); suelo(g, 0x6a5a40); box(g, .9, 1.7, .6, 0xcc2233, -2, .85, -.7, 0x300000); box(g, .5, .35, .45, 0x333333, 1.8, 1.1, -.8); box(g, 1.2, .9, .8, 0x7a5a3a, 1.8, .45, -.8); for (const [x, z] of [[-.7, .6], [.9, .9]]) { g.add(mesh(new (T().CylinderGeometry)(.5, .5, .05, 18), mat(0xd8d0c0), x, .78, z), mesh(new (T().CylinderGeometry)(.05, .05, .78, 6), mat(0x555555), x, .39, z)); } g.add(mesh(new (T().CylinderGeometry)(.07, .06, .1, 10), mat(0xffffff), -.7, .86, .6)); },
    pasillo(g) { fondo(g, 'PASILLO · EN ANTENA', '#2a2a30', '#101014', 7, 3.6, -1.4, x => { for (let i = 0; i < 4; i++) { x.fillStyle = '#3a3a48'; x.fillRect(40 + i * 120, 70, 70, 150); x.fillStyle = '#c0c0c8'; x.fillRect(95 + i * 120, 140, 6, 12); } x.fillStyle = '#e01010'; x.fillRect(220, 52, 70, 12); }); suelo(g, 0x303038); box(g, .3, .5, .2, 0xdd2222, -2.3, 1.2, -1.2); g.add(mesh(new (T().SphereGeometry)(.2, 10, 8), bas(0xff2020), 0, 3, -1.3)); box(g, .9, 1.9, .1, 0x4a4a58, 2.3, .95, -1.3); box(g, 1.4, .5, .7, 0x555a66, -1.5, .25, .4); },
    azotea(g) { fondo(g, 'AZOTEA · NOCHE', '#07102a', '#1a2a5a', 7, 3.6, -1.6, x => { x.fillStyle = '#fff'; for (let i = 0; i < 60; i++) x.fillRect(Math.random() * 512, Math.random() * 130, 2, 2); x.fillStyle = '#05080f'; for (let i = 0; i < 12; i++) { const h = 40 + Math.random() * 80; x.fillRect(i * 44, 256 - h, 38, h); x.fillStyle = '#ffe08a'; for (let k = 0; k < 4; k++) x.fillRect(i * 44 + 6 + (k % 2) * 16, 256 - h + 10 + ((k / 2) | 0) * 22, 8, 10); x.fillStyle = '#05080f'; } }); suelo(g, 0x4a4a52); const dish = mesh(new (T().SphereGeometry)(.9, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), mat(0xdddddd), -2.2, 1.4, -.5); dish.rotation.x = -2.2; g.add(dish); box(g, .08, 1.3, .08, 0x888888, -2.2, .65, -.5); box(g, 5.6, .5, .08, 0x666a74, 0, .25, -1.3); box(g, .9, .9, .9, 0x3a6a8a, 2.2, .45, -.5); },
    almacen(g) { fondo(g, 'ALMACÉN DE UTILERÍA', '#4a3a24', '#1c1408', 7, 3.6, -1.5, x => { x.fillStyle = '#6a4a28'; for (let i = 0; i < 7; i++) x.fillRect(30 + i * 68, 90 + (i % 2) * 50, 56, 56); x.strokeStyle = '#2a1a08'; x.lineWidth = 4; for (let i = 0; i < 7; i++) x.strokeRect(30 + i * 68, 90 + (i % 2) * 50, 56, 56); }); suelo(g, 0x5a4a30); box(g, .8, .8, .8, 0x8a6a3a, -2, .4, -.6); box(g, .7, .7, .7, 0x7a5a2a, -2.1, 1.15, -.6); box(g, .8, .8, .8, 0x9a7a4a, -1.1, .4, -.9); g.add(mesh(new (T().CylinderGeometry)(.55, .55, .09, 22), mat(0xe0a810, 0x302000), 1.9, .55, -.4)); g.children[g.children.length - 1].rotation.x = 1.3; box(g, 1.2, .05, 1.2, 0x2a5aaa, 1.2, .03, .9, 0x0a1a3a); },
    parking(g) { fondo(g, 'PARKING DE LA CADENA', '#1a2a3a', '#0a121a', 7, 3.6, -1.6, x => { x.fillStyle = '#fff'; for (let i = 0; i < 7; i++) x.fillRect(30 + i * 70, 200, 8, 50); x.fillStyle = '#ffd23a'; x.fillRect(0, 110, 512, 6); }); suelo(g, 0x2a2e36); const car = G(); car.add(mesh(new (T().BoxGeometry)(1.9, .45, .9), mat(0xcc3322)), mesh(new (T().BoxGeometry)(1, .4, .8), mat(0x99c4dd), -.1, .4, 0)); for (const [x, z] of [[.6, .45], [-.6, .45], [.6, -.45], [-.6, -.45]]) car.add(mesh(new (T().CylinderGeometry)(.17, .17, .1, 12), mat(0x111111), x, -.18, z)).rotation.x = Math.PI / 2; car.position.set(2, .45, -.5); g.add(car); box(g, .08, 2.4, .08, 0x555555, -2.4, 1.2, -.8); g.add(mesh(new (T().SphereGeometry)(.15, 8, 6), bas(0xfff0b0), -2.4, 2.45, -.8)); box(g, 2.2, .08, .08, 0xff6a1a, -1.4, .9, 1.2); },
  };
  const LUGARES = { camerino: ['0x3a7a5a'], cafeteria: ['0xaa3355'], pasillo: ['0x2a6aaa'], azotea: ['0xcc7722'], almacen: ['0x777733'], parking: ['0x555588'] };
  window.__lug159 = {
    has: d => Object.prototype.hasOwnProperty.call(LUG, d),
    build(n, d) {
      const X = I(), px = -4.6, pz = 4.4, py = (n.studio.heightAt && n.studio.heightAt(px, pz)) ?? 0;
      const g = G(); g.position.set(px, py, pz); LUG[d](g); n.scene.add(g);
      const who = {}, chars = []; const defs = (D.lugares && D.lugares[d]) || [];
      defs.forEach(([rol, camisa, seed, genero, dx, dz]) => {
        const ch = X.Gi({ shirt: camisa, p3d: { seed: 'n159-' + seed, g: genero } }); ch.root.position.set(px + dx, py, pz + dz); n.scene.add(ch.root); chars.push(ch);
        who[rol] = { get head() { try { X.ke(ch, 'habla', 2.6); } catch (e) { } return ch.head; } };
      });
      n.host.root.position.set(px + 0.2, py, pz + .9); n.face(n.host, vec(px, py, pz + 6)); chars.forEach(c => n.face(c, n.host.root.position));
      return { G: g, who, centro: vec(px, py, pz), quitar() { n.scene.remove(g); chars.forEach(c => n.scene.remove(c.root)); g.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) { if (m.material.map) m.material.map.dispose(); } }); } };
    }
  };
  /* ---------- ganchos de escena ---------- */
  let badge = null;
  window.__ini159 = function (modo, l) { if (!l.inv159) return; if (badge) badge.remove(); badge = document.createElement('div'); badge.id = 'inv159'; badge.style.cssText = 'position:absolute;left:2.2%;bottom:3%;z-index:15;pointer-events:none;font:800 clamp(10px,1.7vw,16px) system-ui,Arial;color:#fff;background:rgba(10,20,90,.82);border:2px solid #ffd23a;border-radius:10px;padding:.35em .7em;text-align:right;line-height:1.25'; badge.innerHTML = '🆕 1.59 · INVENTADO<br><span style="font-weight:600;opacity:.9">recreación con personajes ficticios</span>'; hudEl().appendChild(badge); };
  window.__fin159 = function () { if (badge) { badge.remove(); badge = null; } limpia(); };
  /* estilos */
  const st = document.createElement('style'); st.textContent = '@keyframes pp159{50%{opacity:.35}}@keyframes in159{from{transform:scale(1.6);opacity:0}to{transform:none;opacity:1}}'; document.head.appendChild(st);
  /* ---------- datos nuevos ---------- */
  function datos() {
    const X = I(), so = X.so;
    Object.assign(so.personajes, D.personajes || {});
    so.mejor = so.mejor || [];
    X.zx.mejor = ['🏆', 'Mejores momentos', 'Recreaciones 3D inventadas de los grandes momentos del programa. Ningún suceso ni persona es real'];
    const E = D.escenas || {};
    for (const k of ['oculta', 'tomas', 'fuera', 'mejor']) for (const s of (E[k] || [])) { if (so[k].some(o => o.id === s.id)) continue; s.inv159 = true; if (!/^🆕/.test(s.titulo)) s.titulo = '🆕 ' + s.titulo; so[k].push(s); }
  }
  /* ---------- menús ---------- */
  function menus() {
    const X = I(); if (X.ss && X.ss()) return;
    const Je0 = X.Je; X.setJe(function (e = 'main', ...t) {
      const o = Je0.call(this, e, ...t);
      try {
        const m = document.getElementById('menu'), col = m && m.querySelector('.col');
        if (e === 'main' && col && !m.querySelector('#mj159')) {
          const b = X._t('🏆 Mejores momentos · 🆕', 'Recreaciones 3D inventadas: caídas a cámara lenta, botes, duelos y despedidas (no son sucesos reales)', 'gold', () => X.Je('mejor')); b.id = 'mj159';
          const ref = m.querySelector('#rh144') || m.querySelector('#lm144'); ref ? ref.after(b) : col.appendChild(b);
        }
      } catch (er) { console.warn('mj159', er); }
      return o;
    });
  }
  function lomejor() {
    const X = I(); if (X.ss && X.ss()) return;
    const mo = new MutationObserver(() => {
      const m = document.getElementById('m144'); if (!m || m.querySelector('#nv159')) return;
      const h = m.querySelector('h2'); if (!h || !/Lo mejor de/.test(h.textContent)) return;
      const b = m.querySelector('.b'); if (!b) return;
      const mk = (id, t, s, fn) => { const x = document.createElement('button'); x.className = 'tbtn'; x.style.cssText = 'display:block;width:100%;margin:6px 0;text-align:left;padding:10px 14px'; x.innerHTML = `<b>${t}</b><br><small>${s}</small>`; x.onclick = (ev) => { ev.stopPropagation(); m.remove(); fn(); }; return x; };
      const w = document.createElement('div'); w.id = 'nv159'; w.innerHTML = '<div style="margin:10px 0 2px;font:800 13px system-ui;color:#ffd23a;letter-spacing:1px">🆕 NOVEDADES 1.59 · TODO INVENTADO</div>';
      w.append(
        mk('m', '🏆 Más mejores momentos', 'Recreaciones 3D con cámara lenta y repetición (sucesos ficticios)', () => X.Je('mejor')),
        mk('c', '📹 Cámaras ocultas nuevas', 'Bromas a Adrián en el plató', () => X.Je('oculta')),
        mk('t', '🎬 Tomas falsas nuevas', 'Lapsus, objetos voladores y «¡Corten!»', () => X.Je('tomas')),
        mk('f', '🎥 Fuera de cámaras nuevas', 'Camerino, cafetería, azotea, almacén y parking', () => X.Je('fuera')),
        mk('p', '🧪 Pruebas inventadas nuevas', 'Juega una al azar: refranes, capitales, mito o verdad…', () => { const ids = (D.pruebaIds || []); if (ids.length) X.Rt('entrenamiento', ids[Math.floor(Math.random() * ids.length)]); else X.Je('train'); }));
      b.appendChild(w);
    });
    mo.observe(document.body, { childList: true });
  }
  function boot() { try { datos(); menus(); lomejor(); } catch (e) { console.error('extras159', e); } }
  // esperar a que el motor esté listo
  const iv = setInterval(() => { try { const X = I(); if (X && X.so && X.so.oculta && X.zx && X.Oe) { clearInterval(iv); boot(); } } catch (e) { } }, 200);
  window.__x159 = { FX, A, CAM, LUG, limpia, datos: () => D };
})();
