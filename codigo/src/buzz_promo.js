// v1.34 · PROMO DE BUZZ (~50 s, al estilo de un tráiler de la tele, con frases y música originales):
// 1 plató a oscuras y una silla que gira y descubre a Buzz · 2 cartela «Modo Fiesta con Buzz» · 3 la bomba explota a un concursante
// 4 Buzz lanza una tarta: ¡tartazo! · 5 trampilla y «ELIMINADO» · 6 montaje de las pruebas nuevas · 7 clímax «¡fantástico!» con la cámara
// alejándose · 8 silencio y el logo con un susurro solemne. Música sintetizada original que se para en la cartela final.
// En «Poner voz a Buzz (mis audios)» › «Audio de la promo» el jugador puede cambiar TODA la banda sonora por un archivo suyo (con retraso).
const BP = { dur: 50, musFin: 42,
  frases: [[0.8, 0], [11.3, 1], [14.8, 2], [20.6, 3], [24.8, 4], [30.3, 5], [37.4, 6], [43.6, 7]],
  rotulos: [[11, 14.5, 'titulo'], [18.8, 20.4, 'boom'], [21.4, 24, 'tartazo'], [27.4, 29.8, 'eliminado'], [43.2, 50, 'final']],
  pruebas: [['🎡', 'EL ROSCO'], ['🧠', 'LA MEMORIA'], ['🕵️', 'LA INTRUSA'], ['🧮', 'CUENTAS'], ['💶', 'EL PRECIO'], ['💣', 'PASA LA BOMBA']] };
async function promoBuzz(op = {}) {
  const T = _E; if (document.getElementById('promoBuzz')) return; let vivo = true;
  const div = document.createElement('div'); div.id = 'promoBuzz'; div.style.cssText = 'position:fixed;inset:0;z-index:99980;background:#000;cursor:pointer';
  const cv = document.createElement('canvas'), c2 = document.createElement('canvas'); cv.style.cssText = c2.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; c2.style.pointerEvents = 'none';
  const sal = document.createElement('button'); sal.textContent = '✕ Salir'; sal.style.cssText = 'position:absolute;left:12px;top:10px;z-index:2;padding:6px 14px;border-radius:12px;border:2px solid #ffc21a;background:#000a;color:#fff;font:700 15px system-ui';
  div.append(cv, c2, sal); document.body.appendChild(div);
  let ren; try { ren = new T.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: 'low-power' }); } catch (e) { div.remove(); return false; }
  const pr = Math.min(1.5, devicePixelRatio || 1); ren.setPixelRatio(pr); ren.outputColorSpace = T.SRGBColorSpace;
  const sc = new T.Scene(); sc.background = new T.Color(0x05020e); sc.fog = new T.Fog(0x05020e, 9, 24);
  const cam = new T.PerspectiveCamera(45, 16 / 9, 0.05, 80); const g2 = c2.getContext('2d');
  const resize = () => { const w = innerWidth, h = innerHeight; ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); c2.width = w * pr; c2.height = h * pr; }; resize(); addEventListener('resize', resize);
  const hemi = new T.HemisphereLight(0x9a7cff, 0x100820, 0.25), luz = new T.DirectionalLight(0xffffff, 0.2); luz.position.set(2, 6, 5); sc.add(hemi, luz);
  // plató: suelo, aro de neón, pared con pantalla del logo, focos
  const suelo = new T.Mesh(new T.CircleGeometry(9, 40), new T.MeshLambertMaterial({ color: 0x1a0f3a })); suelo.rotation.x = -Math.PI / 2; sc.add(suelo);
  const aro = new T.Mesh(new T.TorusGeometry(2.2, 0.05, 6, 48), new T.MeshBasicMaterial({ color: 0xff3ad0 })); aro.rotation.x = Math.PI / 2; aro.position.y = 0.02; sc.add(aro);
  const aro2 = new T.Mesh(new T.TorusGeometry(3.4, 0.04, 6, 56), new T.MeshBasicMaterial({ color: 0x3ad0ff })); aro2.rotation.x = Math.PI / 2; aro2.position.y = 0.02; sc.add(aro2);
  let texLogo = null; try { texLogo = new T.CanvasTexture(promoLogoCanvas()); texLogo.colorSpace = T.SRGBColorSpace; } catch (e) { }
  const pared = new T.Mesh(new T.PlaneGeometry(5.2, 4.5), new T.MeshBasicMaterial(texLogo ? { map: texLogo, transparent: true } : { color: 0x2040a0 })); pared.position.set(0, 3, -5.5); sc.add(pared);
  const focos = []; for (let k = 0; k < 5; k++) { const f = new T.Mesh(new T.ConeGeometry(0.9, 7, 16, 1, true), new T.MeshBasicMaterial({ color: [0xff3ad0, 0x3ad0ff, 0xffd23a, 0x3ad0ff, 0xff3ad0][k], transparent: true, opacity: 0.12, depthWrite: false, blending: T.AdditiveBlending, side: 2 })); f.position.set(-4 + k * 2, 3.5, -2.5); sc.add(f); focos.push(f); }
  // silla giratoria (respaldo alto) con Buzz delante: al empezar, el respaldo mira a cámara
  const silla = new T.Group(); const terc = new T.MeshLambertMaterial({ color: 0x8a0a2a, emissive: 0x200008 });
  const resp = new T.Mesh(new T.BoxGeometry(1.25, 2.5, 0.16), terc); resp.position.set(0, 1.45, -0.3); const asi = new T.Mesh(new T.BoxGeometry(1.1, 0.16, 0.8), terc); asi.position.set(0, 0.5, -0.05); const oro = new T.Mesh(new T.BoxGeometry(1.35, 0.12, 0.2), new T.MeshLambertMaterial({ color: 0xffc21a, emissive: 0x402a00 })); oro.position.set(0, 2.72, -0.3); silla.add(oro);
  const pata = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.5, 8), new T.MeshLambertMaterial({ color: 0x888888 })); pata.position.y = 0.25; silla.add(resp, asi, pata); sc.add(silla);
  const buzz = buzzFig(); buzz.root.scale.setScalar(0.92); buzz.root.position.set(0, 0, 0.6); silla.add(buzz.root);
  // concursantes maniquí en sus trampillas
  const mani = [], posM = [[-3.6, -1.2], [-2.3, 1.0], [2.3, 1.0], [3.6, -1.2]], colM = [0xffb21a, 0x3aa0ff, 0x6ad04a, 0xff5a8a];
  posM.forEach(([x, z], k) => { const g = new T.Group(); g.position.set(x, 0, z); const pod = new T.Mesh(new T.CylinderGeometry(0.5, 0.55, 0.12, 20), new T.MeshLambertMaterial({ color: 0x2a2a4a })); pod.position.y = 0.06;
    const hueco = new T.Mesh(new T.CircleGeometry(0.4, 20), new T.MeshBasicMaterial({ color: 0x000000 })); hueco.rotation.x = -Math.PI / 2; hueco.position.y = 0.125; hueco.visible = false;
    const fig = new T.Group(); const mat = new T.MeshLambertMaterial({ color: colM[k], emissive: 0x111111 }); const cu = new T.Mesh(new T.CylinderGeometry(0.2, 0.26, 0.9, 12), mat); cu.position.y = 0.6; const ca = new T.Mesh(new T.SphereGeometry(0.19, 14, 10), new T.MeshLambertMaterial({ color: 0xf0f0f4, emissive: 0x222222 })); ca.position.y = 1.25; fig.add(cu, ca); fig.position.y = 0.12;
    g.add(pod, hueco, fig); sc.add(g); mani.push({ g, fig, hueco, mat, ca, y0: 0.12 }); });
  const bomba = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.font = '100px system-ui'; x.textAlign = 'center'; x.fillText('💣', 64, 104); const s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true })); s.scale.setScalar(0.55); s.visible = false; sc.add(s); return s; })();
  const tarta = tartaMesh(); tarta.visible = false; sc.add(tarta); const nata = nataSplat(); nata.visible = false; nata.position.set(0, 1.25, 0.17); mani[2].fig.add(nata);
  const conf = []; for (let k = 0; k < 90; k++) { const m = new T.Mesh(new T.PlaneGeometry(0.06, 0.1), new T.MeshBasicMaterial({ color: [0xffd23a, 0xff3ad0, 0x3ad0ff, 0x6ad04a][k % 4], side: 2 })); m.visible = false; m.userData = { x: (Math.random() - 0.5) * 8, z: (Math.random() - 0.5) * 6, v: 0.6 + Math.random(), r: Math.random() * 6 }; sc.add(m); conf.push(m); }
  // audio: banda sonora del jugador (si la ha puesto) o voz de Buzz + música original
  const ctx = F.ctx; try { ctx.state === 'suspended' && await Promise.race([ctx.resume(), new Promise(r => setTimeout(r, 1500))]); } catch (e) { }
  const mio = !op.sinMio && bzaTiene('promo'), ret = Math.max(0, +((bzaSlots().promo || {}).ret) || 0); let pista = null, synth = null, gm = null;
  const t0 = performance.now() / 1000 + 0.1; const ahora = () => window.__promoT != null ? window.__promoT : performance.now() / 1000 - t0;
  if (!mio && zn.enabled) { try { gm = ctx.createGain(); gm.gain.value = 0.38; gm.connect(F.master || ctx.destination); synth = promoSynth(ctx, gm, BP.musFin + 4, { bpm: 128, fin: BP.musFin, golpes: [7.4, 18.8, 27.4], aplausos: [38] }); } catch (e) { synth = null; } }
  if (mio) setTimeout(() => { if (vivo) bzaPlay('promo').then(r => pista = r); }, ret * 1000);
  const idx = await stIndice().catch(() => ({})), clips = BUZZ_L.promo.map(t => { const k = _f('p_buzz|' + buzzTexto(t)); return idx[k] != null ? `${Us}voz/st/${k}.mp3` : null; });
  const dichas = new Set(); let habla = 0;
  const txt = (t, x, y, tam, col = '#fff', op2 = {}) => { const W = c2.width; g2.save(); g2.font = `${op2.peso || 900} ${tam * W / 1280}px Montserrat,system-ui`; g2.textAlign = 'center'; g2.textBaseline = 'middle'; if (op2.sombra !== false) { g2.shadowColor = op2.brillo || '#000'; g2.shadowBlur = (op2.blur || 16) * W / 1280; } g2.fillStyle = col; g2.globalAlpha = op2.a ?? 1; g2.fillText(t, x * W, y * c2.height); g2.restore(); };
  const ease = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3), V = (x, y, z) => new T.Vector3(x, y, z);
  const camA = (p, m) => { cam.position.copy(p); cam.lookAt(m); };
  const fin = () => { if (!vivo) return; vivo = false; try { synth && synth.stop(); gm && gm.disconnect(); } catch (e) { } try { pista && pista.stop(); bzaPara(); } catch (e) { } removeEventListener('resize', resize); try { buzz.dispose(); ren.dispose(); ren.forceContextLoss && ren.forceContextLoss(); } catch (e) { } div.remove(); window.__promoBuzzFase = 'fin'; };
  sal.onclick = ev => { ev.stopPropagation(); fin(); }; div.onclick = () => fin();
  window.__promoBuzzFase = 'play';
  await new Promise(done => {
    const fr = () => { if (!vivo) return done(); const t = ahora(); if (t > BP.dur) { fin(); return done(); }
      // frases de Buzz
      if (!mio) for (const [tt, k] of BP.frases) if (t >= tt && !dichas.has(k)) { dichas.add(k); if (clips[k] && zn.enabled) F.playUrl(clips[k], 1, 'voz').then(r => { if (r && r.done) { habla++; r.done.then(() => habla--); } }).catch(() => 0); }
      buzz.modo = (mio ? (t > 0.8 && t < 42 && Math.sin(t * 3) > -0.3) : habla > 0) ? (t > 37 && t < 42 ? 'risa' : 'habla') : 'senala';
      buzz.anim(t, cam);
      const luzOn = t > 7.4 ? 1 : 0.15 + 0.1 * Math.sin(t * 2); hemi.intensity = 0.25 + 0.75 * luzOn; luz.intensity = 0.2 + 0.9 * luzOn; focos.forEach((f, k) => { f.material.opacity = t > 7.4 && t < 43 ? 0.1 + 0.08 * Math.sin(t * 3 + k) : 0.02; f.rotation.z = Math.sin(t * 0.8 + k) * 0.35; }); aro.material.color.setHSL((t * 0.05) % 1, 1, t > 7.4 ? 0.6 : 0.15);
      silla.rotation.y = Math.PI * (1 - ease((t - 6.6) / 1.6)); bomba.visible = false; tarta.visible = false; mani.forEach(m => m.g.visible = true);
      if (t < 11) { const u = t / 11; camA(V(Math.sin(u * 0.6) * 1.2, 1.5, 6.5 - u * 2.6), V(0, 1.3, 0)); }
      else if (t < 14.5) { const u = (t - 11) / 3.5; camA(V(-3 + u * 6, 2.2, 7), V(0, 1.4, 0)); }
      else if (t < 20.5) { const m = mani[0], u = (t - 14.5) / 6; const hp = m.g.position; camA(V(hp.x + 2.2 - u * 0.6, 1.7, hp.z + 3.6 - u * 0.8), V(hp.x, 1.1, hp.z)); bomba.visible = t < 18.8; bomba.position.set(hp.x, 1.75 + Math.abs(Math.sin(t * 8)) * 0.06, hp.z); bomba.scale.setScalar(0.5 + Math.abs(Math.sin(t * (4 + u * 10))) * 0.08);
        if (t >= 18.8) { m.mat.color.setHex(0x1a1a1a); m.ca.material.color.setHex(0x222222); const b = Math.min(1, (t - 18.8) / 0.25); g2 && (cam.position.x += (Math.random() - 0.5) * 0.12 * (1 - b)); } }
      else if (t < 24.5) { const m = mani[2], hp = m.g.position, u = (t - 21) / 0.6; camA(V(hp.x - 1.6, 1.6, hp.z + 2.4), V(hp.x - 0.5, 1.2, hp.z)); if (u > 0 && u < 1) { tarta.visible = true; tarta.position.lerpVectors(V(0, 1.6, 0.6), V(hp.x, 1.25, hp.z + 0.2), u); tarta.position.y += Math.sin(u * Math.PI) * 0.6; tarta.rotation.x = u * 7; } nata.visible = t >= 21.6; }
      else if (t < 30) { const m = mani[1], hp = m.g.position, u = (t - 27.4) / 0.8; camA(V(hp.x + 0.4, 2.2, hp.z + 2.6), V(hp.x, 0.7, hp.z)); m.hueco.visible = t >= 27.3; m.fig.position.y = t < 27.4 ? m.y0 : m.y0 - Math.min(1, u) * Math.min(1, u) * 3; m.fig.visible = u < 1; }
      else if (t < 37) { const k = Math.floor((t - 30) / 1.15), u = ((t - 30) % 1.15) / 1.15; const a = k * 1.1 + u * 0.5; camA(V(Math.sin(a) * 5, 1.6 + Math.sin(k) * 0.6, Math.cos(a) * 5), V(0, 1.1, 0)); }
      else if (t < 42.5) { const u = ease((t - 37) / 5); camA(V(0, 1.5 + u * 3.5, 2.2 + u * 9), V(0, 1.2, 0)); conf.forEach(m => { m.visible = true; const d = m.userData, tt = (t - 37) * d.v; m.position.set(d.x, 5 - (tt * 1.4) % 5.2, d.z); m.rotation.set(tt * 3 + d.r, tt * 2, 0); }); }
      else { camA(V(0, 5, 11.2), V(0, 1.2, 0)); conf.forEach(m => m.visible = false); }
      if (t >= 30 && mani[1].fig.visible === false) { /* sigue eliminado */ }
      ren.render(sc, cam);
      // capa 2D: bandas de cine, rótulos y cartela final
      const W = c2.width, H = c2.height; g2.clearRect(0, 0, W, H); const bh = H * 0.09; g2.fillStyle = '#000'; g2.fillRect(0, 0, W, bh); g2.fillRect(0, H - bh, W, bh);
      if (t < 1.2 || (t > 42 && t < 43.2)) { g2.fillStyle = `rgba(0,0,0,${t < 1.2 ? 1 - t / 1.2 : 1})`; g2.fillRect(0, 0, W, H); }
      for (const [a, b, id] of BP.rotulos) { if (t < a || t > b) continue; const u = (t - a) / (b - a), e = ease((t - a) / 0.4);
        if (id === 'titulo') { txt('MODO FIESTA', 0.5, 0.42, 120 * (1.4 - 0.4 * e), '#ffd23a', { brillo: '#ff3ad0', blur: 30, a: e }); txt('con BUZZ', 0.5, 0.6, 70, '#fff', { a: e, brillo: '#3ad0ff', blur: 24 }); }
        if (id === 'boom') { g2.fillStyle = `rgba(255,${180 - u * 120},40,${Math.max(0, 0.75 - u * 1.4)})`; g2.fillRect(0, 0, W, H); txt('💥 ¡BOOM!', 0.5, 0.5, 130 * (0.8 + e * 0.3), '#fff', { brillo: '#ff6a00', blur: 30 }); }
        if (id === 'tartazo') txt('¡TARTAZO!', 0.5, 0.3, 120 * (0.6 + e * 0.5), '#fff', { brillo: '#ff3ad0', blur: 26 });
        if (id === 'eliminado') { const fl = Math.floor(u * 10) % 2; g2.fillStyle = `rgba(200,0,20,${fl ? 0.35 : 0.15})`; g2.fillRect(0, 0, W, H); txt('ELIMINADO', 0.5, 0.5, 140, fl ? '#fff' : '#ff3a3a', { brillo: '#f00', blur: 30 }); }
        if (id === 'final') { g2.fillStyle = '#05020e'; g2.fillRect(0, 0, W, H); const lg = (() => { try { return promoLogoCanvas(); } catch (e) { return null; } })(); const e2 = ease((t - a) / 1.5);
          if (lg) { const s = H * 0.42 / lg.height; g2.globalAlpha = e2; g2.drawImage(lg, W / 2 - lg.width * s / 2, H * 0.08, lg.width * s, lg.height * s); g2.globalAlpha = 1; }
          txt('MODO FIESTA CON BUZZ', 0.5, 0.64, 72, '#ffd23a', { a: e2, brillo: '#ff3ad0', blur: 22 }); txt('— Solo en Ahora Caigo —', 0.5, 0.76, 44, '#fff', { a: ease((t - a - 1.2) / 1.5), peso: 700 }); } }
      if (t >= 30 && t < 37) { const k = Math.min(BP.pruebas.length - 1, Math.floor((t - 30) / 1.15)), u = ((t - 30) % 1.15) / 1.15, [em, nom] = BP.pruebas[k]; const x = 0.5 + (u < 0.15 ? (0.15 - u) * 4 : u > 0.88 ? -(u - 0.88) * 5 : 0);
        g2.save(); g2.fillStyle = 'rgba(10,20,80,.78)'; g2.strokeStyle = '#ffd23a'; g2.lineWidth = 6 * W / 1280; const bw = W * 0.5, bhh = H * 0.32; g2.beginPath(); g2.roundRect ? g2.roundRect(x * W - bw / 2, H * 0.34, bw, bhh, 30 * W / 1280) : g2.rect(x * W - bw / 2, H * 0.34, bw, bhh); g2.fill(); g2.stroke(); g2.restore();
        txt(em, x - 0.15, 0.5, 110, '#fff', { sombra: false }); txt(nom, x + 0.06, 0.5, 60, '#ffd23a'); }
      if (t > 37 && t < 42) txt('¡FANTÁSTICO!', 0.5, 0.2, 90 * (1 + 0.05 * Math.sin(t * 12)), '#fff', { brillo: '#ffd23a', blur: 30, a: ease((t - 37.8) / 0.4) });
      if (mio) txt('🎵 Banda sonora: tu audio', 0.86, 0.95, 22, '#fff', { peso: 600, a: 0.7 });
      requestAnimationFrame(fr); }; fr(); });
  return true;
}
// acceso: menú Promos (al principio) y panel «mis audios» (junto al hueco «Audio de la promo»)
{ const lt = Lt; Lt = function (a = 'main', ...r) { const x = lt.call(this, a, ...r); try { if (a === 'promos') { const m = document.getElementById('menu'); const pa = m && m.querySelector('.ptitle, h2, .mtitle'); if (m && !m.querySelector('#promoBuzzBtn')) { const b = ei('🕺 Promo de Buzz: Modo Fiesta', '≈50 s · tráiler con Buzz, tartazos, bomba, trampilla y pruebas nuevas · puedes poner tu propio audio', 'gold', () => promoBuzz()); b.id = 'promoBuzzBtn'; const pri = m.querySelector('.mbtn'); pri ? pri.before(b) : m.appendChild(b); } } } catch (e) { console.warn('promoBuzz menú', e); } return x; }; }
window.__promoBuzz = { promoBuzz, BP };
