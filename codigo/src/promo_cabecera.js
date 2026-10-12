// ===================================================================================================
// v1.13 · PROMO «Cabecera de estreno»: cabecera NUEVA de animación original, inspirada en el estilo de las
// cabeceras del programa pero hecha solo con piezas del juego (plató cabEstudio, trampillas promoPuerta,
// huellas _pies, logo pv, rótulos cabFrase, cortinilla Show Time). Sin metraje ni música de la TV.
// Audio: hueco «cabecera_nueva» (cabecera/cabecera_nueva.mp3 o «Cargar músicas»); si no está, usa la
// música de cabecera que ya tenga el juego (cabecera3d); y si tampoco, la música sintetizada de las promos.
// ===================================================================================================
PROMOS.cabnueva = { id: 'cabnueva', nombre: 'Cabecera de estreno', dur: 17, emoji: '🌀', sub: 'Cabecera nueva animada: huellas, trampillas y logo', soloMusica: true,
  musica: { bpm: 128, golpes: [3.0, 7.2, 9.6, 12.4], fin: 14.6 },
  montar(C) {
    const T = C.T, cfg = cabTema({ id: 'normal' });
    const E = cabEstudio(cfg, { id: 'normal' }, { sinObjetos: true }); C.escenas = [E.scene]; E.tc.visible = false; E.tcr.visible = false;
    const S = E.scene;
    // 10 trampillas en semicírculo delante de la tarima + la central
    const N = 10, R = 5.2, puertas = [];
    for (let i = 0; i < N; i++) { const a = -Math.PI * 0.42 + i * (Math.PI * 0.84 / (N - 1)); puertas.push(promoPuerta(S, new T.Vector3(Math.sin(a) * R, 0.03, Math.cos(a) * R), 0.55, i % 2 ? 0x2ad8ff : 0xffd23a)); }
    const central = promoPuerta(S, new T.Vector3(0, 0.456, 0), 1.1, 0xff7a1a);
    // camino de huellas que avanza hacia la trampilla central
    const texH = cabTex(256, 256, (g, w) => { g.clearRect(0, 0, w, w); _pies(g, w / 2, w / 2, w * 0.42, '#ffd21a'); });
    const huellas = []; for (let k = 0; k < 9; k++) { const m = new T.Mesh(new T.PlaneGeometry(0.9, 0.9), new T.MeshBasicMaterial({ map: texH, transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.rotation.z = Math.PI; m.position.set((k % 2 ? 0.28 : -0.28), 0.05, 9 - k * 1.0); S.add(m); huellas.push(m); }
    // logo del juego que sale de la trampilla central
    const logoTx = new T.CanvasTexture(promoLogoCanvas()); logoTx.colorSpace = T.SRGBColorSpace;
    const logo = new T.Mesh(new T.PlaneGeometry(4.6, 4.0), new T.MeshBasicMaterial({ map: logoTx, transparent: true, depthWrite: false })); logo.visible = false; S.add(logo);
    // chispas
    const NP = 220, pg = new T.BufferGeometry(), pp = new Float32Array(NP * 3), pv0 = []; for (let i = 0; i < NP; i++) { pv0.push([(Math.random() - 0.5) * 6, 2 + Math.random() * 6, (Math.random() - 0.5) * 6]); }
    pg.setAttribute('position', new T.BufferAttribute(pp, 3)); const chispas = new T.Points(pg, new T.PointsMaterial({ color: 0xffe08a, size: 0.09, transparent: true, opacity: 0 })); S.add(chispas);
    const r1 = C.rotulo('10 RIVALES', 1.0, { y: 0.3 }), r1b = C.rotulo('10 TRAMPILLAS', 0.8, { y: -0.7, cara: 'amarillo' }), r2 = C.rotulo('UNA SOLA PREGUNTA', 0.75), r3 = C.rotulo('¿QUIÉN CAERÁ?', 1.2, { cara: 'amarillo' }), r4 = C.rotulo('CON ADRIÁN VEGA', 0.65, { y: -2.3 });
    return t => {
      E.update(t);
      // 0-3 s: huellas que se encienden una a una, cámara rasante
      huellas.forEach((m, k) => { m.material.opacity = t < 0.2 + k * 0.3 ? 0 : t < 13 ? 1 : 0; m.scale.setScalar(1 + Math.max(0, 0.6 - (t - 0.2 - k * 0.3)) * 1.2); });
      // 3-7,2 s: las 10 trampillas se abren en cadena (izquierda a derecha y vuelta)
      puertas.forEach((p, i) => { const t0 = 3 + i * 0.32, k = t < t0 ? 0 : t < t0 + 0.25 ? (t - t0) / 0.25 : t < t0 + 1.1 ? 1 : t < t0 + 1.4 ? 1 - (t - t0 - 1.1) / 0.3 : 0; p.abre(C.ease(k)); p.aro.material.color.setHex((Math.floor(t * 6) + i) % 2 ? 0xffd23a : 0x2ad8ff); });
      // 7,2-9,6 s: se abre la central y sale el logo con rebote
      central.abre(C.ease((t - 7.2) / 0.5) * (t < 14.6 ? 1 : 0));
      logo.visible = t >= 7.6 && t < 14.6; if (logo.visible) { const k = C.rebote((t - 7.6) / 1.1); logo.position.set(0, C.lerp(-2.5, 3.1, k), 0.2); logo.lookAt(C.cam.position); logo.scale.setScalar(Math.max(0.05, k)); }
      chispas.material.opacity = t > 7.8 && t < 12.5 ? 1 : 0; if (chispas.material.opacity) { const d = t - 7.8; pv0.forEach(([x, y, z], i) => { pp[i * 3] = x * Math.min(1, d); pp[i * 3 + 1] = 0.5 + (y - d * 1.5 + 20) % 7; pp[i * 3 + 2] = z * Math.min(1, d); }); pg.attributes.position.needsUpdate = true; }
      // cámara
      promoTramo(C, t, [
        [0, 3, [0, 0.6, 12], [0, 1.2, 4.2], [0, 0, 2], [0, 0.4, 0]],
        [3, 7.2, [-7, 4.5, 6], [7, 4.5, 6], [0, 0.3, 2.5], [0, 0.3, 2.5], x => x],
        [7.2, 9.6, [0, 6.5, 3.2], [0, 3.6, 9], [0, 0.4, 0], [0, 2.6, 0]],
        [9.6, 14.6, [0, 3.6, 9], [0, 3.3, 7.6], [0, 2.6, 0], [0, 2.8, 0]],
        [14.6, 99, [0, 3.3, 7.6], [0, 3.3, 7.6], [0, 2.8, 0], [0, 2.8, 0]]]);
      if (t < 14.6) C.render(S);
      C.anima(r1, t, 3.6, 5.4, 'golpe'); C.anima(r1b, t, 4.0, 5.4, 'vuela'); C.anima(r2, t, 5.5, 7.1, 'sube'); C.anima(r3, t, 9.7, 12.2, 'golpe'); C.anima(r4, t, 12.3, 14.6, 'sube');
      if (t >= 12.3 && t < 14.6) r3.visible = false;
      // destello blanco al abrirse la central
      if (t > 7.2 && t < 7.7) { const g = C.g2; g.fillStyle = `rgba(255,255,255,${0.8 * (1 - (t - 7.2) / 0.5)})`; g.fillRect(0, 0, C.c2.width, C.c2.height); }
      if (t < 14.6) promoMarcas(C.g2, C.c2.width, C.c2.height, { showtime: true, alfa: 0.55 });
      if (t >= 14.6) promoShowTime2D(C.g2, C.c2.width, C.c2.height, (t - 14.6) / 2.4, C.cfg);
    };
  } };
function promoCabNueva() { const d = PROMOS.cabnueva; d.audio = RC.audioExtra && RC.audioExtra('cabecera_nueva') ? 'cabecera_nueva' : 'cabecera3d'; return promoCorre(d); }
