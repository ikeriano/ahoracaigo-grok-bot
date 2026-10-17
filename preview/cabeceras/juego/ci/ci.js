/* ¡Ahora caigo! 1.38 · Cabeceras de inicio en 3D (1, 2 y 3), recreadas plano a plano de los vídeos de Iker.
   Núcleo: opción, carga perezosa (ci/ciN.js + ci/cab_inicio_N.ogg solo cuando toca), reloj sincronizado con el audio original,
   rótulos de créditos (nombres inventados), y utilidades 3D compartidas. Las partes de plató usan el plató real del juego. */
(function () {
  'use strict';
  var CI = window.CI = { def: {} }, D = document, T = null, KEY = 'ac_cabini138';
  CI.modo = function () { var v = 'aleatoria'; try { v = localStorage.getItem(KEY) || 'aleatoria'; var q = /[?&]cab=([123])/.exec(location.search); if (q) v = q[1]; } catch (e) { } return /^(aleatoria|1|2|3|no)$/.test(v) ? v : 'aleatoria'; };
  CI.elige = function () {
    var m = CI.modo(); if (m === 'no') return 0; if (m !== 'aleatoria') return +m;
    var ult = 0; try { ult = +localStorage.getItem('ac_cabini_ult') || 0; } catch (e) { }
    var op = [1, 2, 3].filter(function (n) { return n !== ult; }), n = op[Math.floor(Math.random() * op.length)];
    try { localStorage.setItem('ac_cabini_ult', String(n)); } catch (e) { } return n;
  };
  // ---------- opción en «Más opciones del programa» ----------
  CI.fila = function () {
    var c = D.createElement('div'); c.className = 'orow'; c.id = 'cabini138';
    var l = D.createElement('label'); l.textContent = '🎥 Cabecera de inicio del programa'; c.appendChild(l);
    var w = D.createElement('div'); w.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end';
    [['aleatoria', 'Aleatoria'], ['1', '1'], ['2', '2'], ['3', '3'], ['no', 'La de siempre']].forEach(function (o) {
      var b = D.createElement('button'); b.className = 'tbtn' + (CI.modo() === o[0] ? ' sel' : ''); b.textContent = o[1]; b.dataset.v = o[0];
      b.onclick = function (e) { e.stopPropagation(); try { window.__audio && __audio.play('Tecla'); } catch (x) { } try { localStorage.setItem(KEY, o[0]); } catch (x) { } w.querySelectorAll('button').forEach(function (m) { m.classList.toggle('sel', m === b); }); };
      w.appendChild(b);
    });
    c.appendChild(w); return c;
  };
  // ---------- carga perezosa ----------
  function script(src) { return new Promise(function (res) { var s = D.createElement('script'); s.src = src; s.onload = function () { res(true); }; s.onerror = function () { res(false); }; D.head.appendChild(s); }); }
  function audioBuf(n) {
    var a = window.__audio; if (!a || !a.ctx) return Promise.resolve(null);
    var urls = ['ci/cab_inicio_' + n + '.ogg', 'ci/cab_inicio_' + n + '.m4a'];
    return (function intenta(u) {
      if (!u.length) return Promise.resolve(null);
      return fetch(u[0]).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (ab) { return new Promise(function (res, rej) { a.ctx.decodeAudioData(ab, res, rej); }); }).catch(function () { return intenta(u.slice(1)); });
    })(urls);
  }
  CI.carga = function (n) { return (CI.def[n] ? Promise.resolve(true) : script('ci/ci' + n + '.js')).then(function () { return Promise.all([CI.def[n] || null, audioBuf(n)]); }); };
  // ---------- utilidades 3D ----------
  CI.V = function (x, y, z) { return new T.Vector3(x, y, z); };
  CI.lienzo = function (w, h, f) { var c = D.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 2; return t; };
  CI.ad = function (map, color, op) { return new T.MeshBasicMaterial({ map: map, color: color == null ? 0xffffff : color, transparent: true, opacity: op == null ? 1 : op, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }); };
  CI.suave = function (u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };
  CI.sale = function (u) { u = Math.max(0, Math.min(1, u)); return 1 - Math.pow(1 - u, 3); };
  CI.rebote = function (u) { u = Math.max(0, Math.min(1, u)); var n = 7.5625, d = 2.75; if (u < 1 / d) return n * u * u; if (u < 2 / d) return n * (u -= 1.5 / d) * u + .75; if (u < 2.5 / d) return n * (u -= 2.25 / d) * u + .9375; return n * (u -= 2.625 / d) * u + .984375; };
  CI.lerp = function (a, b, u) { return a + (b - a) * u; };
  // texto 3D barato: capas de un mismo lienzo (cara blanca, laterales plateados) — ligero para el Redmi A2
  CI.texto3D = function (txt, op) {
    op = op || {}; var alto = op.alto || 1, fuente = op.fuente || '900 italic 200px "Arial Black", Arial, Roboto, sans-serif';
    var med = D.createElement('canvas').getContext('2d'); med.font = fuente; var w = Math.ceil(med.measureText(txt).width + 60), h = 260;
    var tx = function (cara) {
      return CI.lienzo(w, h, function (g) {
        g.font = fuente; g.textAlign = 'center'; g.textBaseline = 'middle';
        if (cara) { var gr = g.createLinearGradient(0, 30, 0, 230); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.6, op.cara2 || '#f1f4f8'); gr.addColorStop(1, op.cara3 || '#cfd6de'); g.fillStyle = gr; g.lineWidth = 5; g.strokeStyle = op.borde || 'rgba(120,130,140,.8)'; g.strokeText(txt, w / 2, h / 2); g.fillText(txt, w / 2, h / 2); }
        else { g.fillStyle = '#ffffff'; g.fillText(txt, w / 2, h / 2); }
      });
    };
    var ancho = alto * w / h * .78, geo = new T.PlaneGeometry(ancho, alto * 1.0), grp = new T.Group(), N = op.capas || 8, tl = tx(false);
    for (var i = N; i >= 1; i--) { var k = i / N, m = new T.MeshBasicMaterial({ map: tl, transparent: true, alphaTest: .35, side: T.DoubleSide, color: new T.Color(op.lado || 0xa9b0b8).multiplyScalar(1 - k * .55) }); var q = new T.Mesh(geo, m); q.position.set(k * .05 * alto, -k * .06 * alto, -k * (op.fondo || .28) * alto); grp.add(q); }
    var fr = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tx(true), transparent: true, alphaTest: .35, side: T.DoubleSide })); grp.add(fr);
    grp.userData.ancho = ancho; return grp;
  };
  CI.huellas = function (color, fondo) {   // dos huellas (izq/der) en un lienzo
    return CI.lienzo(256, 256, function (g, w, h) {
      if (fondo) { g.fillStyle = fondo; g.fillRect(0, 0, w, h); }
      g.fillStyle = color; g.shadowColor = color; g.shadowBlur = 18;
      [[92, -1], [164, 1]].forEach(function (p) { g.save(); g.translate(p[0], 128); g.rotate(p[1] * .08); g.beginPath(); g.ellipse(0, -22, 22, 46, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(0, 50, 17, 24, 0, 0, Math.PI * 2); g.fill(); g.restore(); });
    });
  };
  CI.bloque = function (letra, col) {   // bloque de letra que vuela (cabeceras 1-3)
    var c = col || '#eef0f3';
    var t = CI.lienzo(128, 128, function (g, w, h) { var gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, c); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6); if (letra) { g.fillStyle = '#b8bec6'; g.font = '900 92px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(letra, w / 2, h / 2 + 4); } });
    return new T.Mesh(new T.BoxGeometry(1, 1, .55), new T.MeshLambertMaterial({ map: t }));
  };
  // ---------- rótulos de créditos (píldoras brillantes, nombres inventados) ----------
  function cssCreditos() {
    if (D.getElementById('ci138css')) return; var s = D.createElement('style'); s.id = 'ci138css';
    s.textContent = '#ciCred{position:fixed;left:max(3vw,env(safe-area-inset-left));bottom:7vh;z-index:66;pointer-events:none;font-family:Arial,Roboto,sans-serif}' +
      '#ciCred .p{position:relative;display:flex;align-items:center;height:clamp(30px,7.4vh,56px);padding:0 clamp(22px,4.6vh,36px);border-radius:999px;background:linear-gradient(#5fb6ff 0%,#1f6fe0 45%,#0b3fa8 55%,#1d63cf 100%);box-shadow:inset 0 0 0 2px #e9eef5,inset 0 0 0 4px #8d98a6,0 3px 10px #0009;transform-origin:left center;animation:ciAbre .45s cubic-bezier(.2,1.3,.4,1) both;overflow:visible}' +
      '#ciCred.v2 .p{background:linear-gradient(rgba(120,190,255,.72),rgba(30,90,200,.62));box-shadow:inset 0 0 0 2px #fff,0 0 14px #bfe3ff,0 3px 10px #0008}' +
      '#ciCred .p:before,#ciCred .p:after{content:"";position:absolute;top:50%;width:clamp(30px,7.8vh,60px);height:clamp(30px,7.8vh,60px);margin-top:calc(clamp(30px,7.8vh,60px)/-2);border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,#dfe5ec 22%,#8e98a5 60%,#4b525c 100%);box-shadow:0 2px 6px #0008}' +
      '#ciCred .p:before{left:calc(clamp(30px,7.8vh,60px)/-2)}#ciCred .p:after{right:calc(clamp(30px,7.8vh,60px)/-2)}' +
      '#ciCred .t{display:flex;flex-direction:column;line-height:1.1;white-space:nowrap;animation:ciTxt .5s .18s both}' +
      '#ciCred .r{font:700 clamp(8px,1.9vh,13px) Arial,Roboto,sans-serif;color:#ffe066;text-transform:uppercase;letter-spacing:.04em}#ciCred .n{font:700 clamp(11px,2.9vh,21px) Arial,Roboto,sans-serif;color:#fff;text-shadow:0 1px 2px #0008}' +
      '#ciCred .p.fuera{animation:ciCierra .35s ease-in both}' +
      '@keyframes ciAbre{0%{transform:scaleX(.05);opacity:0}100%{transform:scaleX(1);opacity:1}}@keyframes ciCierra{to{transform:scaleX(.05);opacity:0}}@keyframes ciTxt{from{opacity:0}to{opacity:1}}' +
      '#ciVelo{position:fixed;inset:0;z-index:64;pointer-events:none;opacity:0;background:#fff}';
    D.head.appendChild(s);
  }
  // ---------- reproductor ----------
  var ACT = null;
  CI.parar = function () { ACT && ACT.fin(); };
  CI.juega = function (c, forzar, op) {
    op = op || {}; var eng = c.eng || window.__eng; T = window.THREE;
    var n = forzar || CI.elige(); if (!n || !eng || !T) return Promise.resolve(false);
    return CI.carga(n).then(function (r) {
      var def = r[0], buf = r[1]; if (!def) return false;
      return corre(eng, def, buf, op);
    }).catch(function (e) { console.warn('CI', e); return false; });
  };
  function corre(eng, def, buf, op) {
    cssCreditos();
    var a = window.__audio, ctx = a && a.ctx, src = null, dur = buf ? buf.duration : def.dur, t0r = performance.now(), t0a = 0;
    var E = def.prepara(T, eng, CI);   // escenas CG del clip
    E.hostPos = eng.host ? eng.host.root.position.clone() : CI.V(.9, 0, -1.2);
    var cam = new T.PerspectiveCamera(50, 1.78, .05, 400);
    var host = eng.host, hp = host && host.root.position.clone(), hr = host && host.root.rotation.y;
    var ocultos = ['hashtag', 'bubble', 'topbar', 'vidas', 'lower3', 'hint', 'actions'].map(function (id) { var el = D.getElementById(id); if (!el) return null; var v = el.style.visibility; el.style.visibility = 'hidden'; return [el, v]; });
    var cred = D.createElement('div'); cred.id = 'ciCred'; if (def.estiloCred) cred.className = def.estiloCred; D.body.appendChild(cred);
    var velo = D.createElement('div'); velo.id = 'ciVelo'; D.body.appendChild(velo);
    var credVis = {}, plano = null, extraPrev = eng.extraUpdate, hecho = false, fija = op.fija;
    if (buf && ctx && fija == null) { try { if (ctx.state === 'suspended') ctx.resume(); src = ctx.createBufferSource(); src.buffer = buf; var g = ctx.createGain(); g.gain.value = 1; src.connect(g); g.connect(a.music || a.master); t0a = ctx.currentTime + .05; src.start(t0a); a.playing && a.playing.add(src); } catch (e) { src = null; } }
    var reloj = function () { if (fija != null) return fija; if (src) return Math.max(0, ctx.currentTime - t0a); return (performance.now() - t0r) / 1000; };
    var aspecto = function (cm) { var cv = eng.renderer.domElement, as = cv.clientWidth / Math.max(1, cv.clientHeight); if (Math.abs(cm.aspect - as) > .001) { cm.aspect = as; cm.updateProjectionMatrix(); } };
    return new Promise(function (res) {
      var fin = function () {
        if (hecho) return; hecho = true; ACT = null;
        try { src && src.stop(); } catch (e) { }
        eng.override = null; eng.extraUpdate = extraPrev;
        ocultos.forEach(function (o) { o && (o[0].style.visibility = o[1]); }); cred.remove(); velo.remove();
        D.removeEventListener('pointerdown', salta, true);
        if (host) { eng.movers = eng.movers.filter(function (m) { return m.p !== host; }); host.root.position.copy(hp); host.root.rotation.y = hr; }
        try { def.limpia && def.limpia(E, eng); } catch (e) { }
        clearInterval(iv); res(true);
      };
      var salta = function (e) { if (fija != null) return; e.stopPropagation(); fin(); };
      if (fija == null) setTimeout(function () { D.addEventListener('pointerdown', salta, true); }, 400);
      ACT = { fin: fin };
      var paso = function () {
        if (hecho) return; var t = reloj();
        if (fija == null && t >= dur - .05) { setTimeout(fin, 0); return; }
        var p = null; for (var i = 0; i < def.planos.length; i++) if (t >= def.planos[i].t0 && t < def.planos[i].t1) { p = def.planos[i]; break; }
        if (!p) p = def.planos[def.planos.length - 1];
        var u = (t - p.t0) / (p.t1 - p.t0);
        if (p !== plano) {
          plano = p; p.entra && p.entra(E, eng, CI);
          if (p.cg) { var S0 = E[p.cg]; eng.override = { __ci: 1, scene: S0.scene, camera: cam, update: function () { } }; eng.extraUpdate = extraPrev; }
          else {      // plano del plató del juego: el motor sigue animando (personajes, luces, público); solo mandamos en la cámara
            if (eng.override && eng.override.__ci) eng.override = null;
            eng.mode = 'cine'; eng.orbit = null;
            eng.extraUpdate = (function (pl) { return function (dt) { extraPrev && extraPrev.call(this, dt); var cc = eng.camera, tt = reloj(); aspecto(cc); cc.up.set(0, 1, 0); pl.cam(cc, (tt - pl.t0) / (pl.t1 - pl.t0), tt, E, CI); cc.updateMatrixWorld(); }; })(p);
          }
        }
        if (p.cg) { var S = E[p.cg]; aspecto(cam); p.cam(cam, u, t, E, CI); S.update && S.update(t, u, cam); }
        // créditos
        (def.creditos || []).forEach(function (k, j) {
          var vis = t >= k[0] && t < k[0] + (k[3] || 1.9);
          if (vis && !credVis[j]) { credVis[j] = 1; cred.innerHTML = '<div class="p"><div class="t"><span class="r">' + k[1] + '</span><span class="n">' + k[2] + '</span></div></div>'; }
          if (!vis && credVis[j] === 1 && t >= k[0]) { credVis[j] = 2; var pp = cred.querySelector('.p'); pp && pp.classList.add('fuera'); }
        });
        var vv = 0; (def.velos || []).forEach(function (v) { if (t >= v[0] && t < v[1]) { var m = (v[0] + v[1]) / 2; vv = Math.max(vv, 1 - Math.abs(t - m) / ((v[1] - v[0]) / 2)); velo.style.background = v[2] || '#fff'; } });
        velo.style.opacity = vv.toFixed(3);
      };
      var iv = setInterval(paso, 16); paso();
      if (fija != null) { CI.paso = paso; CI.fijar = function (v) { fija = v; paso(); }; }
    });
  }
})();
