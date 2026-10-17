/* Cabecera de inicio 1 (cabecera_inicio_1.mp4, 32,8 s) recreada en 3D.
   0-2,6 vórtice carmesí con bloques de letras · 2,6-5,3 logo sobre el podio con muro de luces · 5,3-6,2 huellas verdes
   6,2-13 plató: cenital de la trampilla, espiral y barrido con alabeo · 13-16,8 barrido del público · 16,8-21 Adrián baja corriendo la escalera
   21-28 órbita rápida y baja con balanceo · 28-30,3 público · 30,3-32,8 plano general frontal, Adrián baila, concursantes 5 y 6 aplauden. */
(function () {
  var CI = window.CI;
  CI.def[1] = {
    dur: 32.8,
    creditos: [ // [segundo, cargo, nombre inventado]
      [8.0, 'Presenta', 'Adrián Vega'], [11.0, 'Dirección', 'Lucía Marín Toledo'], [12.6, 'Realización', 'Óscar Benavides Ruiz'],
      [14.2, 'Producción ejecutiva', 'Nerea Castell Ibáñez'], [16.2, 'Guion', 'Marcos Lledó y Ana Prieto'],
      [18.2, 'Dirección de fotografía', 'Iván Salcedo'], [20.2, 'Música', 'Estudio Trampilla']],
    velos: [[5.95, 6.45, '#fff']],
    prepara: function (T, eng, CI) {
      var V = CI.V, E = {};
      // ----- vórtice -----
      var S = new T.Scene(); S.background = new T.Color(0x3a0008);
      var fondo = new T.Mesh(new T.PlaneGeometry(120, 120), new T.MeshBasicMaterial({ map: CI.lienzo(512, 512, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, '#ffb347'); gr.addColorStop(.08, '#e8301f'); gr.addColorStop(.35, '#a3001a'); gr.addColorStop(1, '#2a0006'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) }));
      fondo.position.z = -60; S.add(fondo);
      var aroTx = CI.lienzo(512, 512, function (g, w, h) { g.strokeStyle = '#ff5a4a'; g.shadowColor = '#ff2a20'; g.shadowBlur = 14; g.lineWidth = 7; g.setLineDash([18, 14]); g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 20, 0, Math.PI * 2); g.stroke(); });
      var aros = [];
      for (var i = 0; i < 14; i++) { var r = new T.Mesh(new T.PlaneGeometry(9, 9), CI.ad(aroTx, 0xffffff, .85)); r.position.z = -i * 4; r.rotation.z = i * .6; S.add(r); aros.push(r); }
      var flare = new T.Mesh(new T.PlaneGeometry(10, 10), CI.ad(CI.lienzo(256, 256, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,220,1)'); gr.addColorStop(.2, 'rgba(255,190,60,.9)'); gr.addColorStop(1, 'rgba(255,80,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), 0xffffff, 1));
      flare.position.set(-1.2, .3, -12); S.add(flare);
      S.add(new T.HemisphereLight(0xffe0e0, 0x401010, 1.6)); var dl = new T.DirectionalLight(0xffffff, 1.6); dl.position.set(2, 3, 5); S.add(dl);
      var letras = 'AHORACAIGO!'.split(''), bloques = [];
      for (var j = 0; j < 16; j++) { var b = CI.bloque(j < letras.length ? letras[j] : ''); b.userData = { ph: j * 1.37, x: (Math.random() - .5) * 3, y: (Math.random() - .5) * 2.4, v: 6 + Math.random() * 6, s: .5 + Math.random() * .7, rx: Math.random() * 4, ry: Math.random() * 4 }; S.add(b); bloques.push(b); }
      E.vortice = { scene: S, update: function (t) {
        aros.forEach(function (r, k) { var z = ((t * 9 + k * 4) % 56); r.position.z = -56 + z; r.material.opacity = Math.min(.9, z / 20); r.rotation.z += .004; });
        bloques.forEach(function (b, k) { var d = b.userData, z = -40 + ((t * d.v + d.ph * 5) % 44); b.position.set(d.x * (1 + (z + 40) / 18), d.y * (1 + (z + 40) / 18), z); b.rotation.set(t * d.rx, t * d.ry, t * .7); b.scale.setScalar(d.s); });
        flare.scale.setScalar(1 + Math.sin(t * 9) * .08 + (t > 1.3 && t < 1.9 ? 1.2 : 0));
      } };
      // ----- podio con el logo y el muro de luces -----
      var P = new T.Scene(); P.background = new T.Color(0x14060a); P.fog = new T.Fog(0x14060a, 30, 70);
      P.add(new T.HemisphereLight(0xfff0e0, 0x2a1020, 1.25)); var k1 = new T.DirectionalLight(0xffd9a8, 2.2); k1.position.set(0, 12, 4); P.add(k1);
      var muroTx = CI.lienzo(1024, 256, function (g, w, h) { g.fillStyle = '#1a0805'; g.fillRect(0, 0, w, h); for (var y = 12; y < h; y += 22) for (var x = 8; x < w; x += 20) { var gr = g.createRadialGradient(x, y, 0, x, y, 9); gr.addColorStop(0, '#fff6c8'); gr.addColorStop(.35, '#ffb53a'); gr.addColorStop(1, 'rgba(255,90,0,0)'); g.fillStyle = gr; g.fillRect(x - 9, y - 9, 18, 18); } });
      muroTx.wrapS = T.RepeatWrapping; muroTx.repeat.set(3, 1);
      var muro = new T.Mesh(new T.CylinderGeometry(22, 22, 18, 48, 1, true), new T.MeshBasicMaterial({ map: muroTx, side: T.BackSide })); muro.position.y = 6; P.add(muro);
      var blanco = new T.MeshPhongMaterial({ color: 0xf4f2f6, shininess: 90, specular: 0x666666 });
      var piso = new T.Mesh(new T.CylinderGeometry(9, 9, .3, 64), new T.MeshPhongMaterial({ color: 0xd9d4e6, shininess: 60 })); piso.position.y = -.15; P.add(piso);
      var t1 = new T.Mesh(new T.CylinderGeometry(3.4, 3.6, .5, 64), blanco); t1.position.y = .25; P.add(t1);
      var t2 = new T.Mesh(new T.CylinderGeometry(2.4, 2.6, .45, 64), blanco); t2.position.y = .72; P.add(t2);
      var t3 = new T.Mesh(new T.CylinderGeometry(1.5, 1.6, .3, 64), new T.MeshPhongMaterial({ color: 0x1b2433, shininess: 120 })); t3.position.y = 1.08; P.add(t3);
      [[3.62, .32, 0x00e5ff], [2.62, .78, 0xff2bd6], [1.62, 1.12, 0x00e5ff], [3.4, .02, 0xff2bd6]].forEach(function (a) { var m = new T.Mesh(new T.TorusGeometry(a[0], .045, 6, 80), new T.MeshBasicMaterial({ color: a[2] })); m.rotation.x = Math.PI / 2; m.position.y = a[1]; P.add(m); var h = new T.Mesh(new T.TorusGeometry(a[0], .16, 6, 80), CI.ad(null, a[2], .35)); h.rotation.x = Math.PI / 2; h.position.y = a[1]; P.add(h); });
      var hu = new T.Mesh(new T.CircleGeometry(1.35, 48), new T.MeshBasicMaterial({ map: CI.huellas('#7dff3a', '#0d1420') })); hu.scale.setScalar(.62); hu.rotation.x = -Math.PI / 2; hu.position.y = 1.235; P.add(hu);
      var haz = new T.Mesh(new T.ConeGeometry(3.4, 14, 32, 1, true), CI.ad(null, 0xffb050, .12)); haz.position.y = 8; P.add(haz);
      var logo = new T.Group(), l1 = CI.texto3D('¡AHORA', { alto: 1.9 }), l2 = CI.texto3D('CAIGO!', { alto: 1.9 });
      l1.position.set(-.45, 1.0, 0); l2.position.set(.45, -.85, 0); logo.add(l1, l2); logo.rotation.z = .1; P.add(logo);
      var pieza = [l1, l2];
      E.podio = { scene: P, update: function (t) {
        var u = CI.sale((t - 3.15) / .9);   // las letras llegan dando vueltas y encajan
        pieza.forEach(function (p, k) { var uu = CI.sale((t - 3.15 - k * .18) / .85); p.position.z = CI.lerp(9, 0, uu); p.rotation.y = (1 - uu) * (k ? -5 : 5); p.rotation.x = (1 - uu) * 2.5; p.visible = t > 3.05; });
        logo.position.set(0, 3.0 + Math.max(0, t - 4.7) * 2.6, .6); logo.scale.setScalar(1 + Math.max(0, t - 4.7) * .3);
        haz.material.opacity = .1 + .04 * Math.sin(t * 7); muroTx.offset.x = t * .01;
      } };
      return E;
    },
    planos: [
      { t0: 0, t1: 2.6, cg: 'vortice', cam: function (c, u) { c.fov = 55; c.updateProjectionMatrix(); c.position.set(0, 0, 4); c.lookAt(0, 0, -10); } },
      { t0: 2.6, t1: 5.35, cg: 'podio', cam: function (c, u, t, E, CI) {   // baja volando desde arriba y se inclina hasta el contrapicado
        c.fov = 50; c.updateProjectionMatrix();
        var a = CI.suave((t - 2.6) / 1.2), b = CI.suave((t - 4.75) / .6);
        var y = CI.lerp(16, 1.6, a), z = CI.lerp(.6, 7.2, a), ly = CI.lerp(0, 2.3, a);
        y = CI.lerp(y, 3.4, b); z = CI.lerp(z, 1.2, b); ly = CI.lerp(ly, 1.1, b);
        c.position.set(0, y, z); c.lookAt(0, ly, CI.lerp(0, 0, a));
      } },
      { t0: 5.35, t1: 6.2, cg: 'podio', cam: function (c, u, t, E, CI) { c.fov = 50; c.updateProjectionMatrix(); var a = CI.suave(u); c.up.set(0, 0, -1); c.position.set(0, CI.lerp(3.4, 4.6, a), CI.lerp(1.2, .02, a)); c.lookAt(0, 1.23, 0); c.rotateZ(u * .6); } },
      // plató del juego
      { t0: 6.2, t1: 8.6, entra: function (E, eng) { var o = eng.opps[0]; if (o) { E.oculto = o; E.ocVis = o.root.visible; o.root.visible = false; } },   // cenital de una trampilla vacía
        cam: function (c, u, t, E, CI) { var eng = window.__eng, o = eng.opps[0], q = o ? o.root.position : CI.V(0, 0, 5), y0 = q.y, h = CI.lerp(1.5, 6.5, CI.suave(u) * CI.suave(u)), a = u * 2.4, r = u * u * 3;
          c.up.set(Math.sin(a), 0, -Math.cos(a)); c.position.set(q.x + Math.sin(a) * r, y0 + h, q.z + Math.cos(a) * r + .01); var w = CI.suave((u - .5) / .5) * .6; c.lookAt(q.x * (1 - w), y0, q.z * (1 - w)); } },
      { t0: 8.6, t1: 13.0, entra: function (E) { if (E.oculto) { E.oculto.root.visible = E.ocVis; E.oculto = null; } }, cam: function (c, u, t, E, CI) { var a = CI.lerp(-.9, 1.5, u), r = CI.lerp(8.5, 6.2, u); c.position.set(Math.sin(a) * r, CI.lerp(6.5, 3.2, u), Math.cos(a) * r); c.lookAt(0, .8, 0); c.rotateZ(Math.sin(u * Math.PI * 1.3) * .22); } },
      { t0: 13.0, t1: 16.8, cam: function (c, u, t, E, CI) { var yaw = CI.lerp(2.35, .75, u); c.position.set(Math.sin(yaw + Math.PI) * 2, 2.8, Math.cos(yaw + Math.PI) * 2); c.lookAt(Math.sin(yaw) * 9.5, 3.4, Math.cos(yaw) * 9.5); c.rotateZ(-.05); } },
      { t0: 16.8, t1: 21.0, entra: function (E, eng) { var h = eng.host; h && eng.walkTo(h, E.hostPos.clone(), 3.4); },   // (la velocidad solo anima las piernas)
        cam: function (c, u, t, E, CI) {   // Adrián baja corriendo la escalera del fondo y llega al centro (posición ligada al reloj)
          var eng = window.__eng, h = eng.host; if (!h) return; var p = h.root.position, d = E.hostPos;
          var x, z; if (u < .45) { var k = u / .45; x = 0; z = CI.lerp(-9.8, -6.7, k); } else { var k2 = CI.sale((u - .45) / .55); x = CI.lerp(0, d.x, k2); z = CI.lerp(-6.7, d.z, k2); }
          var y = eng.studio.heightAt ? eng.studio.heightAt(x, z) : null; p.set(x, y == null ? d.y : y, z); eng.face(h, new window.THREE.Vector3(d.x, 0, d.z + (u < .9 ? 0 : 6)));
          c.fov = 46; c.updateProjectionMatrix(); c.position.set(1.5 - u * .7, 1.0 + (u < .45 ? 0 : (u - .45) * .8), p.z + 4.4); c.lookAt(p.x, p.y + 1.4, p.z); c.rotateZ(.06);
        } },
      { t0: 21.0, t1: 28.0, entra: function (E, eng) { var h = eng.host; if (!h) return; eng.movers = eng.movers.filter(function (m) { return m.p !== h; }); h.root.position.copy(E.hostPos); h.gestureType = 'saluda'; h.gesture = 2.2; h.gDur = 2.2; },
        cam: function (c, u, t, E, CI) { var h = window.__eng.host.root.position, a = -Math.PI * 2 * CI.suave(u) * 1.05 + .6; c.fov = 52; c.updateProjectionMatrix(); c.position.set(h.x + Math.sin(a) * 3.4, h.y + .75, h.z + Math.cos(a) * 3.4); c.lookAt(h.x, h.y + 1.25, h.z); c.rotateZ(Math.sin(t * 2.1) * .2); } },
      { t0: 28.0, t1: 30.3, entra: function (E, eng) { eng.opps.forEach(function (o) { o.gestureType = 'aplaude'; o.gesture = 2.4; o.gDur = 2.4; }); },
        cam: function (c, u) { c.fov = 40; c.updateProjectionMatrix(); c.position.set(3.2, 2.6, 3.2); c.lookAt(7.6, 3.6, 7.0); } },
      { t0: 30.3, t1: 33, entra: function (E, eng) { var h = eng.host; if (h) { h.root.position.copy(E.hostPos); eng.face(h, new window.THREE.Vector3(h.root.position.x, 0, 9)); h.gestureType = 'baila'; h.gesture = 2.6; h.gDur = 2.6; } [4, 5].forEach(function (i) { var o = eng.opps[i]; if (o) { o.gestureType = 'aplaude'; o.gesture = 2.6; o.gDur = 2.6; } }); },
        cam: function (c, u, t) { var h = window.__eng.host.root.position; c.fov = 50; c.updateProjectionMatrix(); c.position.set(h.x * .3, 3.0, 9.2 - u * .4); c.lookAt(h.x * .5, 2.1, -3); } }
    ],
    limpia: function (E) { if (E.oculto) { E.oculto.root.visible = E.ocVis; E.oculto = null; } }
  };
})();
