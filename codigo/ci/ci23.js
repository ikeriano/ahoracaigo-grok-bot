/* ¡Ahora caigo! 1.38 · Piezas compartidas por las cabeceras de inicio 2 (2014) y 3 (2021):
   trampilla que se abre, túnel rojo de bloques, plató virtual con el logo que cae y rebota, plataforma en el espacio (3)
   y planos de plató reutilizables (grúa, público, concursantes, Adrián bajando la escalera). Se carga solo con la 2 o la 3. */
(function () {
  var CI = window.CI, K = CI.k23 = {};
  function fondoGrad(CI, a, b) { return CI.lienzo(256, 256, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * .7); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); }
  // tapa de trampilla partida en dos mitades (la textura de huellas se reparte entre ellas)
  K.tapa = function (T, CI, r, col, fondo) {
    var tx = CI.huellas(col || '#ffd21a', fondo || '#0b0f1a'), g = new T.Group(), m = new T.MeshBasicMaterial({ map: tx }), mitades = [];
    [-1, 1].forEach(function (s) { var h = new T.Mesh(new T.CircleGeometry(r, 40, s < 0 ? Math.PI / 2 : -Math.PI / 2, Math.PI), m); h.rotation.x = -Math.PI / 2; h.userData.s = s; g.add(h); mitades.push(h); });
    g.userData.abre = function (k) { mitades.forEach(function (h) { h.position.x = h.userData.s * r * 1.05 * k; }); };
    return g;
  };
  K.aro = function (T, CI, r, col, grosor, glow) { var g = new T.Group(), m = new T.Mesh(new T.TorusGeometry(r, grosor || .05, 6, 72), new T.MeshBasicMaterial({ color: col })); m.rotation.x = Math.PI / 2; g.add(m); if (glow !== false) { var h = new T.Mesh(new T.TorusGeometry(r, (grosor || .05) * 3.4, 6, 72), CI.ad(null, col, .3)); h.rotation.x = Math.PI / 2; g.add(h); } return g; };
  // ---------- 1) trampilla metálica vista desde arriba ----------
  K.trampilla = function (T, CI, op) {
    op = op || {}; var S = new T.Scene(); S.background = new T.Color(op.bg || 0x081430);
    var fo = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshBasicMaterial({ map: fondoGrad(CI, op.bg1 || '#1f3f8a', op.bg2 || '#050b1c') })); fo.rotation.x = -Math.PI / 2; fo.position.y = -2; S.add(fo);
    S.add(new T.HemisphereLight(0xffffff, 0x203050, 1.3)); var dl = new T.DirectionalLight(0xffffff, 2.2); dl.position.set(-3, 8, 2); S.add(dl);
    var plata = new T.MeshPhongMaterial({ color: op.disco || 0xc7ccd6, shininess: 140, specular: 0xffffff });
    var d = new T.Mesh(new T.RingGeometry(1.72, 4.2, 72), plata); d.rotation.x = -Math.PI / 2; S.add(d); var bd = new T.Mesh(new T.CylinderGeometry(4.2, 4.3, .4, 72, 1, true), plata); bd.position.y = -.2; S.add(bd);
    var anillo = new T.Mesh(new T.RingGeometry(1.75, 2.35, 64), new T.MeshPhongMaterial({ color: 0x2a3140, shininess: 80 })); anillo.rotation.x = -Math.PI / 2; anillo.position.y = .01; S.add(anillo);
    S.add(K.aro(T, CI, 2.4, op.aro || 0x22e6ff, .07)); var a2 = K.aro(T, CI, 4.25, op.aro2 || 0x29d8ff, .06); a2.position.y = .02; S.add(a2);
    var a3 = K.aro(T, CI, 1.8, op.aro3 || 0x7dff9a, .04); a3.position.y = .02; S.add(a3);
    var tapa = K.tapa(T, CI, 1.72, op.huella || '#ffd21a'); tapa.position.y = .03; S.add(tapa);
    var rojo = new T.Mesh(new T.CircleGeometry(1.7, 40), new T.MeshBasicMaterial({ color: 0xc8101a })); rojo.rotation.x = -Math.PI / 2; rojo.position.y = -.6; S.add(rojo);
    return { scene: S, update: function (t, u) { tapa.userData.abre(CI.suave((t - (op.abre || 1.5)) / .45)); a2.rotation.y = t * .3; } };
  };
  // ---------- 2) túnel rojo de bloques (2: bloques plateados · 3: letras blancas gordas) ----------
  K.tunel = function (T, CI, op) {
    op = op || {}; var S = new T.Scene(); S.background = new T.Color(0x3a0004); S.fog = new T.Fog(0x7a0008, 18, 70);
    var tx = CI.lienzo(512, 512, function (g, w, h) { g.fillStyle = '#b10f12'; g.fillRect(0, 0, w, h); for (var i = 0; i < 150; i++) { var x = Math.random() * w, y = Math.random() * h, ww = 14 + Math.random() * 40, hh = 8 + Math.random() * 20; g.fillStyle = ['#ff6a2a', '#e8341c', '#ff9a3a', '#7a0008', '#ffd27a'][i % 5]; g.globalAlpha = .45 + Math.random() * .5; g.fillRect(x, y, ww, hh); } g.globalAlpha = 1; });
    tx.wrapS = tx.wrapT = T.RepeatWrapping; tx.repeat.set(5, 9);
    var tubo = new T.Mesh(new T.CylinderGeometry(3.4, 3.4, 90, 36, 1, true), new T.MeshBasicMaterial({ map: tx, side: T.BackSide })); tubo.rotation.x = Math.PI / 2; tubo.position.z = -40; S.add(tubo);
    var luz = new T.Mesh(new T.PlaneGeometry(14, 14), CI.ad(CI.lienzo(256, 256, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,240,220,.85)'); gr.addColorStop(1, 'rgba(255,120,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), 0xffffff, 1));
    luz.position.z = -48; S.add(luz);
    S.add(new T.HemisphereLight(0xffffff, 0x501010, 1.5)); var dl = new T.DirectionalLight(0xffffff, 2); dl.position.set(2, 3, 4); S.add(dl);
    var cosas = [], plata = new T.MeshPhongMaterial({ color: 0xd4d8de, shininess: 150, specular: 0xffffff });
    var letras = op.letras ? '¡AHORACAIGO!'.split('') : null, N = op.letras ? 12 : 14;
    for (var i = 0; i < N; i++) {
      var o; if (letras) { o = CI.texto3D(letras[i], { alto: 1.7, capas: 5, fondo: .45 }); }
      else { o = new T.Mesh(new T.BoxGeometry(1.1, .5, .8), plata); }
      o.userData = { ph: i * 3.7, x: (Math.random() - .5) * 3.6, y: (Math.random() - .5) * 3.0, v: 9 + Math.random() * 7, rx: 1 + Math.random() * 3, ry: 1 + Math.random() * 3, s: .7 + Math.random() * .7 };
      S.add(o); cosas.push(o);
    }
    var cuad = []; if (op.letras) for (var j = 0; j < 26; j++) { var q = new T.Mesh(new T.PlaneGeometry(.5, .5), new T.MeshBasicMaterial({ color: [0xff2a20, 0xd10f14, 0xff7a3a][j % 3], side: T.DoubleSide })); q.userData = { ph: j * 2.3, x: (Math.random() - .5) * 5, y: (Math.random() - .5) * 4, v: 7 + Math.random() * 5 }; S.add(q); cuad.push(q); }
    var t0 = op.t0 || 0;
    return { scene: S, update: function (t) {
      var tt = t - t0; tx.offset.y = -tt * 1.4; tubo.rotation.y = tt * .5;
      cosas.forEach(function (o) { var d = o.userData, z = -46 + ((tt * d.v + d.ph) % 50); o.position.set(d.x * (.4 + (z + 46) / 40), d.y * (.4 + (z + 46) / 40), z); o.rotation.set(tt * d.rx, tt * d.ry, tt * .6); o.scale.setScalar(d.s); });
      cuad.forEach(function (q) { var d = q.userData, z = -40 + ((tt * d.v + d.ph) % 44); q.position.set(d.x, d.y, z); q.rotation.set(tt * 2, tt * 1.3, 0); });
      luz.scale.setScalar(1 + Math.max(0, tt - (op.flash || 1.4)) * 4);
    } };
  };
  // ---------- 3) plató virtual con el logo que cae y rebota, y el centro que se abre ----------
  K.estudio = function (T, CI, op) {
    op = op || {}; var claro = !!op.claro, S = new T.Scene(); S.background = new T.Color(claro ? 0x3a4a66 : 0x141824); S.fog = new T.Fog(claro ? 0x3a4a66 : 0x141824, 30, 60);
    S.add(new T.HemisphereLight(0xffffff, claro ? 0x6070a0 : 0x303040, claro ? 1.6 : 1.2)); var dl = new T.DirectionalLight(0xffffff, 2); dl.position.set(3, 10, 6); S.add(dl);
    var muroTx = CI.lienzo(1024, 512, function (g, w, h) {
      g.fillStyle = claro ? '#3c78e0' : '#16224a'; g.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 128) { g.fillStyle = claro ? '#ffd65a' : '#ffb21a'; for (var y = 300; y < h; y += 16) g.fillRect(x + 6, y, 74, 9); g.fillStyle = claro ? '#7fd2ff' : '#1f8fe8'; g.fillRect(x + 86, 120, 36, 160); g.fillStyle = claro ? '#e9f6ff' : '#5fd0ff'; g.fillRect(x + 6, 120, 74, 150); g.fillStyle = claro ? '#ffffff' : '#c8d8ff'; g.fillRect(x + 6, 290, 74, 4); }
      g.fillStyle = claro ? '#e8ecf2' : '#596070'; g.fillRect(0, 0, w, 40); g.fillRect(0, h - 22, w, 22);
    });
    muroTx.wrapS = T.RepeatWrapping; muroTx.repeat.set(4, 1);
    var muro = new T.Mesh(new T.CylinderGeometry(15, 15, 9, 48, 1, true), new T.MeshBasicMaterial({ map: muroTx, side: T.BackSide })); muro.position.y = 3.5; S.add(muro);
    var suelo = new T.Mesh(new T.CircleGeometry(15, 64), new T.MeshPhongMaterial({ color: claro ? 0xd8dde6 : 0x262a34, shininess: 90, specular: 0x555555 })); suelo.rotation.x = -Math.PI / 2; S.add(suelo);
    var anilloS = new T.Mesh(new T.RingGeometry(5.6, 8.6, 64), new T.MeshPhongMaterial({ color: claro ? 0x2a58c8 : 0x1c2a5a, shininess: 60 })); anilloS.rotation.x = -Math.PI / 2; anilloS.position.y = .01; S.add(anilloS);
    var plat = new T.Mesh(new T.CylinderGeometry(3.2, 3.4, .55, 64), new T.MeshPhongMaterial({ color: claro ? 0xeef1f5 : 0x17181e, shininess: 120 })); plat.position.y = .27; S.add(plat);
    var aO = K.aro(T, CI, 3.25, 0xffa800, .1); aO.position.y = .45; S.add(aO);
    var gris = new T.Mesh(new T.RingGeometry(1.5, 2.5, 64), new T.MeshPhongMaterial({ color: claro ? 0xb8c0cc : 0x7a808c, shininess: 90 })); gris.rotation.x = -Math.PI / 2; gris.position.y = .56; S.add(gris);
    var aC = K.aro(T, CI, 1.52, claro ? 0x2be6ff : 0xffb000, .05); aC.position.y = .57; S.add(aC);
    var tapa = K.tapa(T, CI, 1.48, '#ffd21a', '#05070c'); tapa.position.y = .58; S.add(tapa);
    var negro = new T.Mesh(new T.CircleGeometry(1.48, 40), new T.MeshBasicMaterial({ color: 0x000000 })); negro.rotation.x = -Math.PI / 2; negro.position.y = .5; S.add(negro);
    for (var i = 0; i < 10; i++) { var a = (i + .5) / 10 * Math.PI * 2, tp = new T.Group(); tp.position.set(Math.sin(a) * 7.1, .02, Math.cos(a) * 7.1);
      var bd = new T.Mesh(new T.CircleGeometry(.95, 32), new T.MeshPhongMaterial({ color: claro ? 0xf2f4f8 : 0x2b2f38 })); bd.rotation.x = -Math.PI / 2; tp.add(bd);
      var hu = new T.Mesh(new T.CircleGeometry(.62, 32), new T.MeshBasicMaterial({ map: CI.huellas('#ffd21a', '#0a0d14') })); hu.rotation.x = -Math.PI / 2; hu.position.y = .01; tp.add(hu);
      var ar = K.aro(T, CI, .78, claro ? 0x29d8ff : 0xff9d00, .045); ar.position.y = .02; tp.add(ar); S.add(tp); }
    var haces = []; for (var j = 0; j < 7; j++) { var hz = new T.Mesh(new T.ConeGeometry(1.4, 16, 20, 1, true), CI.ad(null, 0xffffff, claro ? .13 : .1)); hz.geometry.translate(0, -8, 0); var b = j / 7 * Math.PI * 2; hz.position.set(Math.sin(b) * 13, 9, Math.cos(b) * 13); hz.userData.b = b; S.add(hz); haces.push(hz); }
    var logo = new T.Group(), l1 = CI.texto3D('¡AHORA', { alto: 1.7, capas: 9, fondo: .32 }), l2 = CI.texto3D('CAIGO!', { alto: 1.7, capas: 9, fondo: .32 });
    l1.position.set(-.3, 1.0, 0); l2.position.set(.35, -.65, 0); logo.add(l1, l2); logo.position.set(0, 2.4, 0); S.add(logo);
    var td = op.cae || 1, ta = op.abre || 3;
    return { scene: S, logo: logo, update: function (t) {
      logo.position.y = 2.4 + Math.pow(Math.max(0, t - ta + .7), 2) * 9; [l1, l2].forEach(function (p, k) { var uu = (t - td - k * .12) / .9; p.visible = uu > -.05; p.position.y = (k ? -.65 : 1.0) + (1 - CI.rebote(uu)) * 9; p.rotation.z = (1 - CI.suave(uu)) * (k ? .4 : -.4); });
      haces.forEach(function (h, k) { h.rotation.z = Math.sin(t * 1.3 + k) * .45; h.rotation.x = .35 + Math.cos(t * 1.1 + k * 2) * .25; });
      tapa.userData.abre(CI.suave((t - ta) / .5)); muroTx.offset.x = t * .004;
    } };
  };
  // ---------- 4) plataforma futurista flotando en el espacio (cabecera 3) ----------
  K.espacio = function (T, CI) {
    var S = new T.Scene(); S.background = new T.Color(0x01030c);
    var n = 700, pos = new Float32Array(n * 3); for (var i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 160; pos[i * 3 + 1] = -20 - Math.random() * 60; pos[i * 3 + 2] = (Math.random() - .5) * 160; }
    var gg = new T.BufferGeometry(); gg.setAttribute('position', new T.BufferAttribute(pos, 3)); S.add(new T.Points(gg, new T.PointsMaterial({ color: 0xbfd8ff, size: .35, sizeAttenuation: true })));
    var neb = new T.Mesh(new T.PlaneGeometry(200, 200), new T.MeshBasicMaterial({ map: fondoGrad(CI, '#1d3a8a', '#01030c'), transparent: true, opacity: .8 })); neb.rotation.x = -Math.PI / 2; neb.position.y = -50; S.add(neb);
    S.add(new T.HemisphereLight(0xdfe8ff, 0x101830, 1.4)); var dl = new T.DirectionalLight(0xffffff, 2.2); dl.position.set(-4, 10, 3); S.add(dl);
    var azul = new T.MeshPhongMaterial({ color: 0x2f6ff0, shininess: 120, specular: 0xaaccff }), plata = new T.MeshPhongMaterial({ color: 0xd2d8e2, shininess: 150, specular: 0xffffff });
    var base = new T.Mesh(new T.CylinderGeometry(9, 7.5, 1.4, 72), plata); base.position.y = -.7; S.add(base);
    var top = new T.Mesh(new T.CylinderGeometry(8.6, 8.6, .12, 72), azul); top.position.y = .06; S.add(top);
    var cen = new T.Mesh(new T.CircleGeometry(3.6, 64), new T.MeshBasicMaterial({ map: fondoGrad(CI, '#e8f4ff', '#3f8cff') })); cen.rotation.x = -Math.PI / 2; cen.position.y = .13; S.add(cen);
    [[8.62, 0xdfe7f2, .1], [3.62, 0xffffff, .06], [6.0, 0x5fc8ff, .04], [1.25, 0xff3ad6, .05]].forEach(function (a) { var r = K.aro(T, CI, a[0], a[1], a[2]); r.position.y = .14; S.add(r); });
    var tapa = K.tapa(T, CI, 1.15, '#ffd21a', '#05070c'); tapa.position.y = .15; S.add(tapa);
    var lin = new T.MeshBasicMaterial({ color: 0xff2bd6, transparent: true, opacity: .95, blending: T.AdditiveBlending, depthWrite: false });
    for (var k = 0; k < 10; k++) { var a = (k + .5) / 10 * Math.PI * 2, L = new T.Mesh(new T.PlaneGeometry(.12, 5.6), lin); L.rotation.x = -Math.PI / 2; L.rotation.z = -a; L.position.set(Math.sin(a) * 4.2, .16, Math.cos(a) * 4.2); S.add(L);
      var pod = new T.Mesh(new T.CylinderGeometry(.6, .7, .5, 32), plata); pod.position.set(Math.sin(a) * 7.3, .3, Math.cos(a) * 7.3); S.add(pod);
      var pt = new T.Mesh(new T.CircleGeometry(.45, 24), new T.MeshBasicMaterial({ map: CI.huellas('#ffd21a', '#0a0d18') })); pt.rotation.x = -Math.PI / 2; pt.position.set(pod.position.x, .56, pod.position.z); S.add(pt);
      var pa = K.aro(T, CI, .62, 0xff2bd6, .03); pa.position.set(pod.position.x, .57, pod.position.z); S.add(pa); }
    return { scene: S, update: function (t, u) { lin.opacity = .75 + .25 * Math.sin(t * 8); } };
  };
  // ---------- planos de plató reutilizables ----------
  var P = CI.p23 = {};
  P.grua = function (t0, t1, a0, a1, r0, r1, y0, y1, ly, alabeo) { return { t0: t0, t1: t1, cam: function (c, u, t, E, CI) { var k = CI.suave(u), a = CI.lerp(a0, a1, k), r = CI.lerp(r0, r1, k); c.fov = 52; c.updateProjectionMatrix(); c.position.set(Math.sin(a) * r, CI.lerp(y0, y1, k), Math.cos(a) * r); c.lookAt(0, ly == null ? .8 : ly, 0); if (alabeo) c.rotateZ(Math.sin(u * Math.PI) * alabeo); } }; };
  P.publico = function (t0, t1, y0, y1, aplaude) { return { t0: t0, t1: t1, entra: aplaude ? function (E, eng) { eng.opps.forEach(function (o) { o.gestureType = 'aplaude'; o.gesture = t1 - t0; o.gDur = t1 - t0; }); } : null,
    cam: function (c, u, t, E, CI) { var yaw = CI.lerp(y0, y1, u); c.fov = 46; c.updateProjectionMatrix(); c.position.set(Math.sin(yaw) * 6.2, 3.3, Math.cos(yaw) * 6.2); c.lookAt(Math.sin(yaw + .2) * 10, 3.5, Math.cos(yaw + .2) * 10); } }; };
  P.concursante = function (t0, t1, i) { return { t0: t0, t1: t1, entra: function (E, eng) { var o = eng.opps[i]; if (o) { o.gestureType = 'saluda'; o.gesture = 1.6; o.gDur = 1.6; } },
    cam: function (c, u, t, E, CI) { var o = window.__eng.opps[i]; if (!o) return; var q = o.root.position, l = Math.hypot(q.x, q.z) || 1, dx = -q.x / l, dz = -q.z / l, sx = -dz, sz = dx, s = CI.lerp(.9, -.5, u);
      c.fov = 42; c.updateProjectionMatrix(); c.position.set(q.x + dx * 3.0 + sx * s, q.y + 1.3, q.z + dz * 3.0 + sz * s); c.lookAt(q.x, q.y + .95, q.z); } }; };
  // Adrián baja corriendo la escalera del fondo (la posición va con el reloj; walkTo solo anima las piernas) · contrapicado desde el pie
  P.bajaHost = function (t0, t1) { return { t0: t0, t1: t1, entra: function (E, eng) { var h = eng.host; h && eng.walkTo(h, E.hostPos.clone(), 3.4); },
    cam: function (c, u, t, E, CI) {
      var eng = window.__eng, h = eng.host; if (!h) return; var p = h.root.position, d = E.hostPos, x, z;
      if (u < .55) { var k = u / .55; x = 0; z = CI.lerp(-9.8, -6.7, k); } else { var k2 = CI.sale((u - .55) / .45); x = CI.lerp(0, d.x, k2); z = CI.lerp(-6.7, d.z, k2); }
      var y = eng.studio.heightAt ? eng.studio.heightAt(x, z) : null; p.set(x, y == null ? d.y : y, z); eng.face(h, new window.THREE.Vector3(d.x, 0, d.z + 6));
      c.fov = 50; c.updateProjectionMatrix();
      if (u < .55) { c.position.set(.7, 1.35, -4.6); c.lookAt(p.x, p.y + 1.3, p.z); }
      else { c.position.set(p.x * .4 - 1.6, p.y + 1.1, p.z + 3.6); c.lookAt(p.x, p.y + 1.1, p.z); }
      c.rotateZ(-.05);
    } }; };
  P.hostCentro = function (t0, t1, gesto) { return { t0: t0, t1: t1, entra: function (E, eng) { var h = eng.host; if (!h) return; eng.movers = eng.movers.filter(function (m) { return m.p !== h; }); h.root.position.copy(E.hostPos); eng.face(h, new window.THREE.Vector3(h.root.position.x, 0, 9)); h.gestureType = gesto || 'arriba'; h.gesture = t1 - t0; h.gDur = t1 - t0; },
    cam: function (c, u, t, E, CI) { var h = window.__eng.host.root.position, a = CI.lerp(.7, -.5, CI.suave(u)); c.fov = 48; c.updateProjectionMatrix(); c.position.set(h.x + Math.sin(a) * 3.6, h.y + .4, h.z + Math.cos(a) * 3.6); c.lookAt(h.x, h.y + 1.35, h.z); } }; };
  P.general = function (t0, t1, gesto) { return { t0: t0, t1: t1, entra: function (E, eng) { var h = eng.host; if (h) { h.root.position.copy(E.hostPos); eng.face(h, new window.THREE.Vector3(h.root.position.x, 0, 9)); h.gestureType = gesto || 'baila'; h.gesture = t1 - t0; h.gDur = t1 - t0; } eng.opps.forEach(function (o) { o.gestureType = 'aplaude'; o.gesture = t1 - t0; o.gDur = t1 - t0; }); },
    cam: function (c, u, t) { var h = window.__eng.host.root.position; c.fov = 50; c.updateProjectionMatrix(); c.position.set(h.x * .3, 3.0, 9.2 - u * .6); c.lookAt(h.x * .5, 2.1, -3); } }; };
})();
