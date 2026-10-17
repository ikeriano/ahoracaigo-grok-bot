/* Cabecera de inicio 3 (cabecera_inicio_3.mp4, 34,4 s, estilo 2021) recreada en 3D, con el plató blanco de 2021.
   0-1 trampilla · 1-3,7 túnel rojo con letras blancas gordas · 3,7-7 plató virtual claro (cenital, logo que rebota, picado a la trampilla)
   7-11 plataforma futurista flotando en el espacio, caída a las huellas · 10,7-11,9 barrido del logo · 11,3-33 plató blanco
   (grúa, público con distancia, concursantes, Adrián baja la escalera con LED azules y morados) · 33-34,4 plano general. */
(function () {
  var CI = window.CI, P = CI.p23, K = CI.k23;
  // aspecto 2021: suelo y aros blancos, pantallas circulares con la huella detrás de cada puesto, luz fría y público con distancia
  function aspecto2021(T, eng, CI, E) {
    var st = eng.studio; E.lookPrev = st.look; try { st.setLook('blanco'); } catch (e) { }
    var g = new T.Group(); g.name = 'ci2021'; var tx = CI.lienzo(256, 256, function (c, w, h) { var gr = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.85, '#eef3fb'); gr.addColorStop(.93, '#c7d4ea'); gr.addColorStop(1, 'rgba(200,215,235,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = '#9aa3b2'; [[104, -1], [152, 1]].forEach(function (p) { c.save(); c.translate(p[0], 128); c.rotate(p[1] * .08); c.beginPath(); c.ellipse(0, -16, 16, 34, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(0, 38, 12, 17, 0, 0, Math.PI * 2); c.fill(); c.restore(); }); });
    var pm = new T.MeshBasicMaterial({ map: tx, transparent: true, side: T.DoubleSide }), aro = new T.MeshBasicMaterial({ color: 0xffffff }), halo = CI.ad(null, 0xbfe0ff, .45), lila = CI.ad(null, 0x9a5cff, .5);
    eng.opps.forEach(function (o) { var q = o.root.position, l = Math.hypot(q.x, q.z) || 1, ux = q.x / l, uz = q.z / l;
      var p = new T.Mesh(new T.CircleGeometry(1.25, 40), pm); p.position.set(q.x + ux * 1.9, q.y + 1.9, q.z + uz * 1.9); p.lookAt(0, q.y + 1.9, 0); g.add(p);
      var r = new T.Mesh(new T.TorusGeometry(1.3, .05, 6, 48), lila); r.position.copy(p.position); r.lookAt(0, q.y + 1.9, 0); g.add(r);
      var a = new T.Mesh(new T.TorusGeometry(.78, .04, 6, 48), aro); a.rotation.x = Math.PI / 2; a.position.set(q.x, q.y + .045, q.z); g.add(a);
      var h = new T.Mesh(new T.TorusGeometry(.78, .14, 6, 48), halo); h.rotation.x = Math.PI / 2; h.position.copy(a.position); g.add(h); });
    eng.scene.add(g); E.g2021 = g;
    // público con distancia: se esconde una de cada dos personas (matriz de escala cero en sus instancias; se restaura al terminar)
    E.ocAud = []; try { var au = eng.audience; (au.halves || []).forEach(function (hv) { Object.keys(hv.meshes || {}).forEach(function (k) { var m = hv.meshes[k]; if (!m || !m.isInstancedMesh) return; var n = m.count, z = new T.Matrix4().makeScale(0, 0, 0), mm = new T.Matrix4(), guard = [];
      for (var i = 0; i < n; i++) if (((i / 3) | 0) % 2 === 1) { m.getMatrixAt(i, mm); guard.push([i, mm.clone()]); m.setMatrixAt(i, z); }
      m.instanceMatrix.needsUpdate = true; E.ocAud.push([m, guard]); }); }); } catch (e) { }
  }
  CI.def[3] = {
    dur: 34.4, estiloCred: 'v2',
    creditos: [[16.6, 'Presenta', 'Adrián Vega'], [18.3, 'Dirección', 'Lucía Marín Toledo'], [20.0, 'Realización', 'Óscar Benavides Ruiz'],
      [22.6, 'Producción ejecutiva', 'Nerea Castell Ibáñez'], [24.4, 'Guion', 'Marcos Lledó y Ana Prieto'], [26.4, 'Dirección de fotografía', 'Iván Salcedo'], [28.4, 'Música', 'Estudio Trampilla']],
    velos: [[-.6, .6, '#000'], [3.35, 4.05, '#fff'], [6.75, 7.25, '#fff']],
    barridos: [[10.7, 11.9]],
    prepara: function (T, eng, CI) {
      var E = { trampilla: K.trampilla(T, CI, { abre: .65, bg1: '#2a5ad8', bg2: '#06102a', aro: 0x2ee8d8, aro3: 0x2ee8d8 }), tunel: K.tunel(T, CI, { t0: 1.0, letras: true, flash: 2.1 }),
        estudio: K.estudio(T, CI, { claro: true, cae: 4.5, abre: 6.45 }), espacio: K.espacio(T, CI) };
      aspecto2021(T, eng, CI, E); return E;
    },
    planos: [
      { t0: 0, t1: 1.0, cg: 'trampilla', cam: function (c, u, t, E, CI) { c.fov = 50; c.updateProjectionMatrix(); c.up.set(Math.sin(u), 0, -Math.cos(u)); c.position.set(0, CI.lerp(9, -.3, Math.pow(u, 2.2)), .001); c.lookAt(0, -1, 0); } },
      { t0: 1.0, t1: 3.7, cg: 'tunel', cam: function (c, u, t) { c.fov = 62; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.position.set(Math.sin(t * 1.3) * .3, Math.cos(t) * .25, 3); c.lookAt(0, 0, -20); c.rotateZ(-t * .7); } },
      { t0: 3.7, t1: 4.6, cg: 'estudio', cam: function (c, u, t, E, CI) { c.fov = 58; c.updateProjectionMatrix(); c.up.set(0, 1, 0); var a = u * .6; c.position.set(Math.sin(a) * 4, CI.lerp(13, 11, u), Math.cos(a) * 4 + 6); c.lookAt(0, 0, 0); } },
      { t0: 4.6, t1: 6.1, cg: 'estudio', cam: function (c, u, t, E, CI) { c.fov = 50; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.position.set(CI.lerp(-.3, .2, u), 2.3, CI.lerp(8.4, 7.8, u)); c.lookAt(0, 2.0, 0); } },
      { t0: 6.1, t1: 7.0, cg: 'estudio', cam: function (c, u, t, E, CI) { var k = CI.suave(u); c.fov = 54; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.position.set(0, CI.lerp(4.5, 1.0, k), CI.lerp(5.5, .5, k)); c.lookAt(0, .5, 0); } },
      { t0: 7.0, t1: 11.3, cg: 'espacio', cam: function (c, u, t, E, CI) { var k = Math.pow(u, 1.25), a = u * 2.2; c.fov = 55; c.updateProjectionMatrix(); c.up.set(Math.sin(a), 0, -Math.cos(a)); c.position.set(0, CI.lerp(34, .9, k), .001); c.lookAt(0, 0, 0); } },
      P.grua(11.3, 14.5, -.7, .5, 11.5, 10.5, 7.5, 6.5, .5),
      P.publico(14.5, 16.6, .9, 1.45, true),
      P.concursante(16.6, 18.3, 0), P.concursante(18.3, 20.0, 2), P.concursante(20.0, 21.2, 4), P.concursante(21.2, 22.4, 7),
      P.bajaHost(22.4, 27.0),
      P.hostCentro(27.0, 29.0, 'saluda'),
      P.publico(29.0, 33.0, -1.0, -1.45, true),
      P.general(33.0, 34.5, 'baila')
    ],
    limpia: function (E, eng) {
      try { E.lookPrev && eng.studio.setLook(E.lookPrev); } catch (e) { }
      if (E.g2021) { eng.scene.remove(E.g2021); E.g2021.traverse(function (o) { o.geometry && o.geometry.dispose(); }); }
      (E.ocAud || []).forEach(function (x) { x[1].forEach(function (p) { x[0].setMatrixAt(p[0], p[1]); }); x[0].instanceMatrix.needsUpdate = true; });
    }
  };
})();
