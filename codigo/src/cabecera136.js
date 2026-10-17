// v1.36 · CABECERA: un solo ajuste claro en Opciones con dos opciones grandes:
//  · «La de siempre (primeras versiones)» (POR DEFECTO): la cabecera 3D en el plató de las primeras versiones: letras doradas de
//    ¡AHORA CAIGO! que vuelan y forman el logo con la carita, barridos de cámara por los 10 oponentes y el público, el hashtag y los
//    rótulos «Presentado por…», «Juego creado por Iker», «Basado en el minijuego de Scratch», «Formato original…» (función nA, intacta).
//  · «La nueva»: las cabeceras posteriores (Cabecera 3D del vídeo, Gran estreno, apertura larga, vídeo propio, Mi cabecera 3D y los logos
//    animados de la 1.27). Sus ajustes avanzados quedan plegados en «Más opciones de la cabecera nueva».
function cabV136() { try { return localStorage.getItem('ac_cabecera136') === 'nueva' ? 'nueva' : 'siempre'; } catch (e) { return 'siempre'; } }
function filaCabecera136() {
  const w = document.createElement('div'); w.className = 'ocustom'; w.id = 'optCabecera136';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🎬 Cabecera'; w.appendChild(lb);
  const st = document.createElement('style'); st.textContent = `#optCabecera136 .cab2{display:flex;gap:12px;flex-wrap:nowrap;margin:6px 0}#optCabecera136 .cabc{flex:1 1 0;min-width:0;border:3px solid #ffffff44;border-radius:16px;background:#0b1f70;color:#fff;padding:8px;cursor:pointer;text-align:center;font:800 15px system-ui}
#optCabecera136 .cabc img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:10px;margin-bottom:6px;background:#000}#optCabecera136 .cabc small{display:block;font:500 13px system-ui;opacity:.8;margin-top:2px}
#optCabecera136 .cabc.sel{border-color:#ffc21a;box-shadow:0 0 0 3px #ffc21a66;background:#1a3aa8}#optCabecera136 .cabc.sel:before{content:'✔ ';color:#ffc21a}
#optCabecera136 details{margin-top:8px;border:1px solid #fff3;border-radius:12px;padding:6px 10px;background:#0006}#optCabecera136 summary{cursor:pointer;font:700 15px system-ui;color:#9fd0ff}`; w.appendChild(st);
  const g = document.createElement('div'); g.className = 'cab2';
  for (const [v, t, s, img] of [['siempre', 'La de siempre', 'Logo 3D ¡AHORA CAIGO! / ¡ACIERTA O ABISMO! en el plató y, después, el plató con los rótulos', 'assets/cab136/cab_siempre.jpg'], ['nueva', 'La nueva', 'Cabecera 3D del vídeo, Gran estreno y logos animados', 'assets/cab136/cab_nueva.jpg']]) {
    const b = document.createElement('button'); b.className = 'cabc' + (cabV136() === v ? ' sel' : ''); b.dataset.cab = v; b.innerHTML = `<img src="${img}" alt="">${t}${v === 'siempre' ? ' <span style="color:#ffc21a">(primeras versiones)</span>' : ''}<small>${s}</small>`;
    b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } localStorage.setItem('ac_cabecera136', v); if (v === 'nueva' && it.cabecera !== 'cab3d' && it.cabecera !== 'iker') { it.cabecera = 'cab3d'; try { Ii(); } catch (e) { } } g.querySelectorAll('.cabc').forEach(x => x.classList.toggle('sel', x === b)); };
    g.appendChild(b); }
  w.appendChild(g);
  const d = document.createElement('details'); d.id = 'cabMas136'; const su = document.createElement('summary'); su.textContent = '⚙️ Más opciones (música, tipo de «La nueva», apertura, logos, vídeos…)'; d.appendChild(su); w.appendChild(d);
  return w; }
function cabMover136() { const m = document.getElementById('menu'); if (!m || !m.querySelector('h2') || m.querySelector('#optCabecera136')) return;
  const ref = m.querySelector('#rowCabecera'); if (!ref) return; const w = filaCabecera136(); ref.parentNode.insertBefore(w, ref); const d = w.querySelector('#cabMas136');
  for (const id of ['rowCabecera', 'optCustom', 'rowApertura', 'optLogo126', 'rowVideoCab', 'rowMiCabecera3D']) { const e = m.querySelector('#' + id); if (e) d.appendChild(e); }
  const lc = d.querySelector('#rowCabecera label, #rowCabecera .olabel'); if (lc) lc.textContent = '🎬 Tipo de «La nueva»'; }
{ const lt0 = Lt; Lt = function (a, ...r) { const x = lt0.call(this, a, ...r); if (a === 'options') try { cabMover136(); } catch (e) { console.warn('cab136', e); } return x; }; }
window.__cab136 = { modo: cabV136, set: v => localStorage.setItem('ac_cabecera136', v) };
// ---------------------------------------------------------------------------------------------------------------
// «La de siempre» (v1.36, versión final): SOLO la intro del logo y, en corte seco, el plató 3D normal del juego
// (anillo rosa, concursantes y público) con los rótulos encima. Sin el decorado oscuro intermedio, sin fondos negros.
// El logo es 3D de verdad dentro del plató, sobre la trampilla central: letras blancas con contorno oscuro
// (como las imágenes de Iker). Alterna ¡AHORA CAIGO! y ¡ACIERTA O ABISMO! (con su fondo de cheurones azul y naranja).
// ---------------------------------------------------------------------------------------------------------------
function cabLogoBlanco136(T, cfg, baja) {
  const r = l3Logo(T, cfg, baja), extra = [];
  const borde = new T.MeshPhongMaterial({ color: 0x14182a, specular: 0x333a55, shininess: 40 }); extra.push(borde);
  const blanca = new T.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 120, emissive: 0x8a8c96 }); extra.push(blanca);
  const lado = new T.MeshPhongMaterial({ color: 0xa8b4d0, specular: 0xffffff, shininess: 90, emissive: 0x2a3044 }); extra.push(lado);
  const mallas = []; r.G.traverse(o => { if (o.isMesh) mallas.push(o); });
  for (const m of mallas) {
    const pr = m.geometry.parameters || {};
    if (m.geometry.type === 'ExtrudeGeometry' && pr.shapes) {
      m.material = [blanca, lado];
      const op = Object.assign({}, pr.options, { depth: (pr.options.depth || 0.3) * 0.6, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.05, bevelOffset: 0.075, bevelSegments: 1 });
      const g = new T.ExtrudeGeometry(pr.shapes, op); extra.push(g);
      const o = new T.Mesh(g, borde); o.position.copy(m.position); o.position.z -= 0.06; o.rotation.copy(m.rotation); m.parent.add(o);
    } else if (m.geometry.type === 'BoxGeometry') {
      m.material = blanca; const o = new T.Mesh(m.geometry, borde); o.position.copy(m.position); o.position.z -= 0.05; o.scale.set(1.08, 2.2, 0.8); m.parent.add(o);
    }
  }
  r.tirar.push(...extra); return r;
}
async function cabSiempre136(eng, hud, sess) {
  if (!eng || !eng.scene || !eng.studio) return false; const festivo = !!(eng.theme && eng.theme.festivo);
  const T = _E, baja = it.quality === 'baja';
  let n = 0; try { n = +(localStorage.getItem('ac_cab136_n') || 0); localStorage.setItem('ac_cab136_n', String(n + 1)); } catch (e) { }
  const id = window.__cab136Logo || (n % 2 ? 'abismo' : 'plato'), cfg = LOGO3D.find(x => x.id === id); mec('cabecera de siempre · logo ' + id);
  ps = await wf() ? Fi : Tf; await Promise.race([F.load(ps), new Promise(f => setTimeout(f, 3e3))]); F.playMusic(ps);
  const t0 = performance.now(), mt = () => { if (window.__cabT != null) return window.__cabT; const f = F.musicTime(ps); return f >= 0 ? f : (performance.now() - t0) / 1e3; };
  const host = eng.host.root.visible, jug = eng.player.root.visible; eng.host.root.visible = false; eng.player.root.visible = false;
  try { eng.lights && eng.lights.event('intro'); } catch (e) { }
  const raiz = new T.Group(); raiz.name = 'cabSiempre136';
  const mpl = await mpLogoCab(T).catch(() => null), { G, tirar } = mpl || cabLogoBlanco136(T, cfg, baja); if (mpl) window.__cabMp = mpl.id; const esc = 0.9; G.scale.setScalar(esc);
  const Y0 = Ae + 1.55; raiz.position.set(0, Y0, 0); raiz.add(G);
  const luz = new T.PointLight(0xffffff, 30, 16, 2); luz.position.set(0, 2.5, 5); raiz.add(luz);
  const luz2 = new T.DirectionalLight(0xffffff, 1.1); luz2.position.set(1, 3, 6); luz2.target = G; raiz.add(luz2);
  const barrido = new T.PointLight(0xfff0c8, 22, 9, 2); raiz.add(barrido);
  let fondo = null; if (!mpl && cfg.fondo === 'chevron') { const tx = l3Fondo(T, 'chevron'), pg = new T.PlaneGeometry(14, 7.9), pm = new T.MeshBasicMaterial({ map: tx, side: 2 }); fondo = new T.Mesh(pg, pm); fondo.position.set(0, 1.4, -4.2); raiz.add(fondo); tirar.push(tx, pg, pm); }
  eng.scene.add(raiz);
  const piezas = G.children.map((c, i) => ({ c, p: c.position.clone(), r: c.rotation.clone(), d: new P(i % 2 ? 9 : -9, 3 + (i % 3) * 2.2, -3 + (i % 4)), dl: 0.25 + i * 0.18 }));
  const ease = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3), suave = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x), rebote = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -8 * x) * Math.cos(x * 10);
  const L = (a, b, k) => new P(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
  const y = Y0;
  // planos de cámara: [t inicio, t fin, posición desde, posición hasta, mirar desde, mirar hasta] (todos dentro del plató normal)
  const PL = [
    [0, 3.4, [0, y + 0.7, 12.5], [0, y + 0.15, 6.9], [0, y + 0.1, 0], [0, y, 0]],
    [3.4, Ra.corte, [0, y + 0.15, 6.9], [1.7, y + 0.75, 6.3], [0, y, 0], [0, y - 0.05, 0]],
    [Ra.corte, 8, [0, 7.6, 8.2], [0, 6.2, 9.6], [0, 0.4, 0], [0, 0.6, 0]],
    [8, 11.2, [-6.6, 2.7, 6.6], [-2.2, 2.7, 7.8], [-3, 1.5, 0], [0, 1.5, 0]],
    [11.2, 14.4, [-4.2, 2.8, 0.5], [-4.2, 2.8, -2.5], [-6.8, 1.6, 3], [-6.5, 1.6, -3]],
    [14.4, 17.6, [4.2, 2.8, -2.5], [4.2, 2.8, 0.5], [6.5, 1.6, -3], [6.8, 1.6, 3]],
    [17.6, 20.8, 'orb', 0.55, -0.55, 10.8, 5.6],
    [20.8, 24, [0, 2.3, 10.2], [0, 4.6, 10.6], [0, 1.4, 0], [0, 1.3, 0]],
    [24, Ra.fin + 0.5, [0, 8.2, 6.4], [0, 7.2, 8.6], [0, 0.5, 0], [0, 0.6, 0]],
  ];
  const camara = t => { const pl = PL.find(q => t >= q[0] && t < q[1]) || PL[PL.length - 1]; const k = suave((t - pl[0]) / (pl[1] - pl[0]));
    if (pl[2] === 'orb') { const a = pl[3] + (pl[4] - pl[3]) * k; eng.cut(new P(Math.sin(a) * pl[5], pl[6], Math.cos(a) * pl[5]), new P(0, 1.1, 0)); }
    else eng.cut(L(pl[2], pl[3], pl === PL[0] ? ease((t - pl[0]) / (pl[1] - pl[0])) : k), L(pl[4], pl[5], k)); };
  let vivo = true, golpe = false; window.__cabSiempre = { id, fase: 'logo', t: 0 };
  const anima = () => { if (!vivo) return; const t = mt(); window.__cabSiempre.t = t; camara(t);
    if (t < Ra.corte) {
      for (const q of piezas) { const k = rebote((t - q.dl) / 1.3); q.c.position.set(q.p.x + q.d.x * (1 - k), q.p.y + q.d.y * (1 - k), q.p.z + q.d.z * (1 - k)); q.c.rotation.set(q.r.x + (1 - k) * 2.2, q.r.y + (1 - k) * -3.1, q.r.z); q.c.visible = t > q.dl - 0.05; }
      if (!golpe && t > 2.2) { golpe = true; try { ze.vitores(2.8, 0.7); eng.lights && eng.lights.event('acierto'); } catch (e) { } }
      G.rotation.y = Math.sin(t * 0.6) * 0.16; raiz.position.y = Y0 + Math.sin(t * 1.3) * 0.04; barrido.position.set(-6 + ((t * 3.4) % 12), 1.2, 2.6);
    } else if (raiz.parent) { eng.scene.remove(raiz); window.__cabSiempre.fase = 'plato'; try { eng.lights && eng.lights.event('ganador'); } catch (e) { } }
    requestAnimationFrame(anima); };
  try {
    await Af(sess, hud, async f => {
      const p = R => f.until(() => mt() >= R);
      anima();
      const rot = J2(), tiempos = [8, 11.2, 14.4, 17.6];
      await p(Ra.corte);
      for (let R = 0; R < tiempos.length; R++) { await p(tiempos[R]); window.__cabSiempre.toma = R + 1;
        if (R < rot.length) hud.lowerThird(rot[R], 2700, f).catch(() => { });
        if (festivo) try { ea(eng.studio, pt((Math.random() - 0.5) * 8, 1.5, (Math.random() - 0.5) * 6)); } catch (e) { } }
      await p(Ra.fin);
    });
  } finally {
    vivo = false; eng.scene.remove(raiz); for (const x of tirar) try { x.dispose(); } catch (e) { }
    eng.override = null; hud.clearLowerThirds(); try { Tn.stopBeat(); } catch (e) { } try { eng.audience && eng.audience.react('idle'); } catch (e) { }
    eng.host.root.visible = host; eng.player.root.visible = jug; window.__cabSiempre = null;
  }
  return true;
}
