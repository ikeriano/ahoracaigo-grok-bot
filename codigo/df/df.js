/* ¡Ahora caigo! 1.37 · Cabecera 3D del Duelo Final (recreación en Three.js de la cabecera de TV, plano a plano).
   Usa el THREE y el motor del juego (window.THREE / window.__eng: eng.override = {scene, camera, update}).
   Audio: la pista original de la cabecera (df/duelo_final.ogg, m4a de reserva). La frase de Adrián
   «Y ahora, jugamos por X puntos, en el Duelo Final» se genera con su Piper (es_ES-davefx-medium) dentro de la app.
   Opción: Más opciones del programa › «Cabecera del Duelo Final» (localStorage ac_dfcab137, Sí por defecto). */
(function () {
  'use strict';
  var DF = window.DF = {};
  var D = document, T = null;
  var DUR = 4.9;                       // segundos de cabecera (vídeo original 0,65 s → 5,55 s)
  DF.DUR = DUR;
  DF.on = function () { try { return localStorage.getItem('ac_dfcab137') !== '0'; } catch (e) { return true; } };
  // ---------------- números en palabras (para que Piper lea bien la cifra) ----------------
  var U = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  var DEC = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  var CEN = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  function m100(n) { return n < 30 ? U[n] : DEC[Math.floor(n / 10)] + (n % 10 ? ' y ' + U[n % 10] : ''); }
  function m1000(n) { if (n === 100) return 'cien'; var c = Math.floor(n / 100), r = n % 100; return (c ? CEN[c] + (r ? ' ' : '') : '') + (r ? m100(r) : ''); }
  function apoc(s) { return s.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un'); }
  function palabras(n) {
    n = Math.max(0, Math.floor(n)); if (n === 0) return 'cero';
    var mill = Math.floor(n / 1e6), mil = Math.floor(n % 1e6 / 1000), r = n % 1000, out = [];
    if (mill) out.push(mill === 1 ? 'un millón' : apoc(m1000(mill)) + ' millones');
    if (mil) out.push(mil === 1 ? 'mil' : apoc(m1000(mil)) + ' mil');
    if (r) out.push(m1000(r));
    return out.join(' ');
  }
  DF.palabras = palabras;
  function puntos(n) { return String(Math.max(0, Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  DF.frase = function (x) { return 'Y ahora, jugamos por ' + puntos(x) + (Math.round(x) === 1 ? ' punto' : ' puntos') + ', en el Duelo Final'; };
  DF.fraseVoz = function (x) { return 'Y ahora, jugamos por ' + palabras(x) + (x === 1 ? ' punto' : ' puntos') + ', en el Duelo Final.'; };
  // ---------------- voz de Adrián: trozos pregenerados con Piper (df/voz) ----------------
  // Cada trozo se generó dentro de la frase completa (tools/gen_df_voz.py) y aquí se cosen con fundidos cortos:
  // pre «Y ahora, jugamos por» + [M/k «… millones»] + [m/k «… mil»] + [n/k «…»] + suf «puntos, en el Duelo Final.»
  DF.trozos = function (x) {
    x = Math.floor(x); if (x === 1) return ['p1']; if (x < 1 || x > 999999999) return null;
    var M = Math.floor(x / 1e6), m = Math.floor(x % 1e6 / 1000), n = x % 1000, t = ['pre'];
    if (M) t.push('M/' + M); if (m) t.push('m/' + m); if (n) t.push('n/' + n); t.push('suf'); return t;
  };
  var cacheTrozo = {};
  function trozoBuf(nombre) {
    var a = audio(); if (!a || !a.ctx) return Promise.reject(0);
    return cacheTrozo[nombre] || (cacheTrozo[nombre] = fetch('df/voz/' + nombre + '.ogg').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (res, rej) { a.ctx.decodeAudioData(ab, res, rej); }); }));
  }
  function cose(bufs, ctx) {
    var sr = bufs[0].sampleRate, F = Math.round(sr * .012), len = 0;
    bufs.forEach(function (b, i) { len += b.length - (i ? F : 0); });
    var out = ctx.createBuffer(1, len, sr), o = out.getChannelData(0), p = 0;
    bufs.forEach(function (b, i) {
      var d = b.getChannelData(0), ini = i ? p - F : 0;
      for (var k = 0; k < d.length; k++) {
        var v = d[k];
        if (i && k < F) v *= k / F;                                   // entrada del trozo
        if (i < bufs.length - 1 && k >= d.length - F) v *= (d.length - k) / F;   // salida hacia el siguiente
        o[ini + k] += v;
      }
      p = ini + d.length;
    });
    return out;
  }
  DF.vozTrozos = function (x) {
    var t = DF.trozos(x), a = audio(); if (!t || !a || !a.ctx) return Promise.resolve(null);
    return Promise.all(t.map(trozoBuf)).then(function (bs) { return cose(bs, a.ctx); }).catch(function () { return null; });
  };
  // ---------------- reserva: Piper dentro de la app (por si faltara algún trozo) ----------------
  var prep = null;
  DF.prepara = function (x) {
    if (prep && prep.x === x) return prep.p;
    var p0 = DF.vozTrozos(x).then(function (buf) { return buf ? { buf: buf } : piper(x); });
    prep = { x: x, p: p0 }; return p0;
  };
  function piper(x) {
    var w = null, p = new Promise(function (res) {
      var fin = function (v) { try { w && w.terminate(); } catch (e) { } w = null; res(v); };
      var to = setTimeout(function () { fin(null); }, 40000);
      try { w = new Worker('piper/piper-worker.js'); } catch (e) { clearTimeout(to); return res(null); }
      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === 'listo') w.postMessage({ id: 1, texto: DF.fraseVoz(x), velocidad: 1 / 0.985 });   // length_scale 0,985 como gen_voces130.py
        else if (d.type === 'audio') { clearTimeout(to); fin({ samples: d.samples, sr: d.sampleRate }); }
        else if (d.type === 'error') { clearTimeout(to); fin(null); }
      };
      w.onerror = function () { clearTimeout(to); fin(null); };
    });
    return p;
  }
  function audio() { return window.__audio; }
  function suenaBuf(buf, gain, canal) {
    var a = audio(); if (!a || !a.ctx || !buf) return null;
    try {
      if (a.ctx.state === 'suspended') a.ctx.resume();
      var s = a.ctx.createBufferSource(); s.buffer = buf; var g = a.ctx.createGain(); g.gain.value = gain;
      s.connect(g); g.connect(canal || a.sfx || a.master); s.start();
      a.playing && a.playing.add(s); s.onended = function () { a.playing && a.playing.delete(s); };
      return s;
    } catch (e) { return null; }
  }
  var bufCab = null;
  function cargaCab() {
    if (bufCab) return bufCab; var a = audio();
    bufCab = (function intenta(urls) {
      if (!urls.length || !a) return Promise.resolve(null);
      return fetch(urls[0]).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(function (ab) { return new Promise(function (res, rej) { a.ctx.decodeAudioData(ab, res, rej); }); })
        .catch(function () { return intenta(urls.slice(1)); });
    })(['df/duelo_final.ogg', 'df/duelo_final.m4a']);
    return bufCab;
  }
  DF.cargaCab = cargaCab;
  // ---------------- texturas ----------------
  function lienzo(w, h, f) { var c = D.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 2; return t; }
  function huella(g, x, y, s, rot, col) {
    g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col;
    g.beginPath(); g.ellipse(0, -s * .25, s * .34, s * .5, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(0, s * .55, s * .26, s * .3, 0, 0, Math.PI * 2); g.fill(); g.restore();
  }
  function texturas() {
    var X = {};
    // pared del fondo: paneles curvos de amarillo a naranja con lamas oscuras y columnas crema
    X.pared = lienzo(2048, 512, function (g, w, h) {
      g.fillStyle = '#2a1830'; g.fillRect(0, 0, w, h);
      var gr = g.createLinearGradient(0, h * .18, 0, h * .78); gr.addColorStop(0, '#ffcc00'); gr.addColorStop(.55, '#ff8a00'); gr.addColorStop(1, '#ff6600');
      for (var i = 0; i < 16; i++) {
        var x0 = i * w / 16;
        g.fillStyle = gr; g.fillRect(x0 + 10, h * .18, w / 16 - 20, h * .6);
        g.fillStyle = 'rgba(90,30,0,.55)'; for (var k = 0; k < 9; k++) g.fillRect(x0 + 10, h * .2 + k * h * .066, w / 16 - 20, 7);
        g.fillStyle = '#d9c3a8'; g.fillRect(x0, h * .1, 12, h * .8);
        g.fillStyle = '#5b4a5e'; for (var k2 = 0; k2 < 4; k2++) g.fillRect(x0 + 18, 8 + k2 * 14, w / 16 - 36, 8);
      }
      g.fillStyle = '#1a1030'; g.fillRect(0, h * .8, w, h * .2);
      g.fillStyle = '#ffd04a'; g.fillRect(0, h * .78, w, 6);
    });
    // pantalla central: barras horizontales cian como una persiana iluminada
    X.persiana = lienzo(256, 512, function (g, w, h) {
      g.fillStyle = '#0b2a4a'; g.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 16) { var gr = g.createLinearGradient(0, y, 0, y + 11); gr.addColorStop(0, '#e9fdff'); gr.addColorStop(1, '#3fd6ff'); g.fillStyle = gr; g.fillRect(0, y, w, 11); }
    });
    // suelo: índigo con rayas radiales azules (lo hace el UV del anillo)
    X.rayas = lienzo(1024, 64, function (g, w, h) {
      g.fillStyle = '#2b1b54'; g.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 16) { g.fillStyle = '#5a54ff'; g.fillRect(x, 0, 5, h); g.fillStyle = '#9fa6ff'; g.fillRect(x + 1, 0, 2, h); }
    });
    // anillo de puntitos dorados
    X.puntos = lienzo(1024, 16, function (g, w, h) { g.clearRect(0, 0, w, h); g.fillStyle = '#ffc23a'; for (var x = 4; x < w; x += 16) { g.beginPath(); g.arc(x, h / 2, 4, 0, Math.PI * 2); g.fill(); } });
    // trampilla con las dos huellas
    X.huellas = lienzo(256, 256, function (g, w, h) {
      var gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, '#2c2226'); gr.addColorStop(1, '#100a0e');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      huella(g, w * .4, h * .5, 54, -.15, '#e8d6bf'); huella(g, w * .6, h * .5, 54, .15, '#e8d6bf');
    });
    // halo para fingir el brillo (bloom barato)
    X.halo = lienzo(128, 128, function (g, w, h) { var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    X.aro = lienzo(256, 32, function (g, w, h) { var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    X.chispa = lienzo(128, 16, function (g, w, h) { var gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,215,0,0)'); gr.addColorStop(.7, 'rgba(255,225,120,.9)'); gr.addColorStop(1, 'rgba(255,255,230,1)'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, 2); g.lineTo(w, h - 2); g.closePath(); g.fill(); });
    X.rayo = lienzo(256, 8, function (g, w, h) { var gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,170,40,1)'); gr.addColorStop(1, 'rgba(255,120,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    return X;
  }
  // letra «extruida» barata: capas de un mismo recorte, la de delante blanca y las de detrás plateadas
  function letra(ch, X) {
    var fuente = '900 200px "Arial Black","Roboto Black",Roboto,Arial,sans-serif';
    var c0 = D.createElement('canvas').getContext('2d'); c0.font = fuente; var wpx = Math.ceil(c0.measureText(ch).width) + 24;
    function tex(cara, lado) {
      return lienzo(wpx, 220, function (g, w, h) {
        g.font = fuente; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
        if (cara) { var gr = g.createLinearGradient(0, 30, 0, 200); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#ece6dc'); g.fillStyle = gr; g.fillText(ch, w / 2, 192); g.lineWidth = 3; g.strokeStyle = 'rgba(150,150,150,.6)'; g.strokeText(ch, w / 2, 192); }
        else { g.fillStyle = lado; g.fillText(ch, w / 2, 192); }
      });
    }
    var grp = new T.Group(), alto = 1.45, ancho = alto * wpx / 220, N = 9;
    var geo = new T.PlaneGeometry(ancho, alto);
    var tLado = tex(false, '#b0b0b0'), tFondo = tex(false, '#4a4a4f');
    for (var i = N; i >= 1; i--) {
      var k = i / N, m = new T.MeshBasicMaterial({ map: i === N ? tFondo : tLado, transparent: true, alphaTest: .4, depthWrite: true, side: T.DoubleSide, color: new T.Color().setScalar(.8 - k * .5) });
      var q = new T.Mesh(geo, m); q.position.set(k * .09, -k * .1, -k * .2); grp.add(q);
    }
    var fr = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tex(true), transparent: true, alphaTest: .4, side: T.DoubleSide })); fr.position.z = .005; grp.add(fr);
    // bloque crema que se ve mientras la letra da vueltas (en el vídeo son bloques macizos)
    var blo = new T.Mesh(new T.BoxGeometry(ancho * .9, alto * .95, .32), new T.MeshLambertMaterial({ color: 0xf2dcc4 })); blo.position.set(.03, -.03, -.08); grp.add(blo);
    grp.userData = { ancho: ancho, bloque: blo };
    return grp;
  }
  // ---------------- la escena ----------------
  function escena() {
    T = window.THREE; var X = texturas(), S = new T.Scene(), Z = {};
    S.background = new T.Color(0x1a1030);
    S.add(new T.HemisphereLight(0x8f86ff, 0x3a2a70, 1.25));
    var key = new T.DirectionalLight(0xfff1dc, 2.1); key.position.set(1, 10, 6); S.add(key);
    var basic = function (c, o) { o = o || {}; o.color = c; return new T.MeshBasicMaterial(o); };
    var lam = function (c) { return new T.MeshLambertMaterial({ color: c }); };
    var aditivo = function (map, c, op) { return new T.MeshBasicMaterial({ map: map, color: c, transparent: true, opacity: op == null ? 1 : op, blending: T.AdditiveBlending, depthWrite: false }); };
    // fondo
    var pared = new T.Mesh(new T.CylinderGeometry(19, 19, 15, 48, 1, true), new T.MeshBasicMaterial({ map: X.pared, side: T.BackSide }));
    X.pared.wrapS = T.RepeatWrapping; X.pared.repeat.x = 1; pared.position.y = 5.5; S.add(pared);
    var pers = new T.Mesh(new T.PlaneGeometry(7.5, 10), basic(0xffffff, { map: X.persiana })); pers.position.set(0, 6.3, -17.8); S.add(pers);
    [-4.3, 4.3].forEach(function (x) { var col = new T.Mesh(new T.BoxGeometry(1.1, 13, 1), lam(0xd8c2a6)); col.position.set(x, 5.5, -17.4); S.add(col); });
    // suelo índigo
    var suelo = new T.Mesh(new T.CircleGeometry(19, 48), lam(0x22174a)); suelo.rotation.x = -Math.PI / 2; suelo.position.y = -.6; S.add(suelo);
    // falda de rayas radiales alrededor de la tarima central
    var falda = new T.Mesh(new T.CylinderGeometry(2.75, 4.6, .7, 64, 1, true), new T.MeshBasicMaterial({ map: X.rayas, side: T.DoubleSide }));
    X.rayas.wrapS = T.RepeatWrapping; X.rayas.repeat.set(3, 1); falda.position.y = .1; S.add(falda);
    var fondoFalda = new T.Mesh(new T.RingGeometry(4.5, 4.75, 64), basic(0x2b1b54)); fondoFalda.rotation.x = -Math.PI / 2; fondoFalda.position.y = -.24; S.add(fondoFalda);
    // anillos de puntos dorados y cian en el suelo
    var anilloTex = function (r, w, map, c, y) { var m = new T.Mesh(new T.RingGeometry(r, r + w, 96, 1), new T.MeshBasicMaterial({ map: map, color: c, transparent: !!map, side: T.DoubleSide, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = y; S.add(m); return m; };
    X.puntos.wrapS = T.RepeatWrapping; X.puntos.repeat.set(6, 1);
    // anillo exterior crema con las trampillas
    var aro = new T.Mesh(new T.CylinderGeometry(7.2, 7.4, .9, 64), lam(0xe6d3c6)); aro.position.y = -.25; S.add(aro);
    var hueco = new T.Mesh(new T.CircleGeometry(4.75, 64), lam(0x2b1b54)); hueco.rotation.x = -Math.PI / 2; hueco.position.y = .205; S.add(hueco);
    var rayasIn = new T.Mesh(new T.RingGeometry(2.7, 4.75, 128, 1), new T.MeshBasicMaterial({ map: X.rayas })); rayasIn.rotation.x = -Math.PI / 2; rayasIn.position.y = .21; S.add(rayasIn);
    anilloTex(4.75, .12, null, 0xffb000, .215); anilloTex(4.4, .06, null, 0x00e5ff, .22); anilloTex(3.95, .07, X.puntos, 0xffffff, .22);
    var bordeAro = new T.Mesh(new T.TorusGeometry(7.3, .05, 6, 96), basic(0xffb000)); bordeAro.rotation.x = Math.PI / 2; bordeAro.position.y = .2; S.add(bordeAro);
    // barandilla
    var bar = new T.Mesh(new T.TorusGeometry(7.9, .04, 6, 96), lam(0xc9c9d6)); bar.rotation.x = Math.PI / 2; bar.position.y = 1.3; S.add(bar);
    for (var b = 0; b < 24; b++) { var poste = new T.Mesh(new T.CylinderGeometry(.03, .03, 1.5, 5), lam(0xc9c9d6)); var a0 = b / 24 * Math.PI * 2; poste.position.set(Math.cos(a0) * 7.9, .55, Math.sin(a0) * 7.9); S.add(poste); }
    // trampillas de los oponentes (10, como en el juego), sobre el aro crema
    var gHuella = new T.CircleGeometry(.84, 32), gRim = new T.TorusGeometry(.93, .09, 8, 40), gCian = new T.TorusGeometry(1.06, .03, 6, 40), gHalo = new T.PlaneGeometry(3.1, 3.1);
    var halos = [];
    for (var i = 0; i < 10; i++) {
      var ang = Math.PI / 2 + (i + .5) / 10 * Math.PI * 2, R = 6.0, tr = new T.Group();
      tr.position.set(Math.cos(ang) * R, .21, Math.sin(ang) * R);
      var base = new T.Mesh(new T.CylinderGeometry(1.12, 1.16, .16, 32), lam(0xeadbd0)); base.position.y = .02; tr.add(base);
      var hu = new T.Mesh(gHuella, new T.MeshBasicMaterial({ map: X.huellas })); hu.rotation.x = -Math.PI / 2; hu.rotation.z = -ang - Math.PI / 2; hu.position.y = .11; tr.add(hu);
      var rim = new T.Mesh(gRim, basic(0xffaa00)); rim.rotation.x = Math.PI / 2; rim.position.y = .12; tr.add(rim);
      var ci = new T.Mesh(gCian, basic(0x00e5ff)); ci.rotation.x = Math.PI / 2; ci.position.y = .04; tr.add(ci);
      var h = new T.Mesh(gHalo, aditivo(X.halo, 0xff9a20, .32)); h.rotation.x = -Math.PI / 2; h.position.y = .14; tr.add(h); halos.push(h);
      S.add(tr);
    }
    // tarima central blanca con borde dorado y cian
    var tar = new T.Mesh(new T.CylinderGeometry(2.7, 2.8, .75, 64), lam(0xeedfd8)); tar.position.y = .45; S.add(tar);
    var t1 = new T.Mesh(new T.TorusGeometry(2.72, .07, 8, 96), basic(0xffaa00)); t1.rotation.x = Math.PI / 2; t1.position.y = .83; S.add(t1);
    var t2 = new T.Mesh(new T.TorusGeometry(2.78, .045, 6, 96), basic(0x00e5ff)); t2.rotation.x = Math.PI / 2; t2.position.y = .55; S.add(t2);
    var t3 = new T.Mesh(new T.TorusGeometry(2.8, .03, 6, 96), basic(0x2a1d4a)); t3.rotation.x = Math.PI / 2; t3.position.y = .12; S.add(t3);
    var haloT = new T.Mesh(new T.RingGeometry(2.45, 3.15, 96), aditivo(X.aro, 0xffb020, .55)); haloT.rotation.x = -Math.PI / 2; haloT.position.y = .85; S.add(haloT);
    // la trampilla central: aro crema elevado con brillo dorado arriba y cian abajo, y agujero oscuro
    var cAro = new T.Mesh(new T.CylinderGeometry(1.15, 1.2, .26, 48, 1, true), lam(0xe9d8cf)); cAro.position.y = .96; S.add(cAro);
    var cTapa = new T.Mesh(new T.RingGeometry(.92, 1.15, 48), lam(0xeedfd8)); cTapa.rotation.x = -Math.PI / 2; cTapa.position.y = 1.09; S.add(cTapa);
    var cAg = new T.Mesh(new T.CircleGeometry(.95, 48), basic(0x0c0710)); cAg.rotation.x = -Math.PI / 2; cAg.position.y = .99; S.add(cAg);
    var cOro = new T.Mesh(new T.TorusGeometry(1.03, .05, 8, 64), basic(0xffb21a)); cOro.rotation.x = Math.PI / 2; cOro.position.y = 1.1; S.add(cOro);
    var cCian = new T.Mesh(new T.TorusGeometry(1.2, .05, 8, 64), basic(0x00e5ff)); cCian.rotation.x = Math.PI / 2; cCian.position.y = .86; S.add(cCian);
    var cHalo = new T.Mesh(new T.RingGeometry(.8, 1.7, 64), aditivo(X.aro, 0x30e8ff, .7)); cHalo.rotation.x = -Math.PI / 2; cHalo.position.y = .87; S.add(cHalo);
    var cHalo2 = new T.Mesh(new T.RingGeometry(.85, 1.35, 64), aditivo(X.aro, 0xffb020, .8)); cHalo2.rotation.x = -Math.PI / 2; cHalo2.position.y = 1.12; S.add(cHalo2);
    // letras «DUELO» sobre «FINAL»
    var letras = [], filas = [['DUELO', 3.05], ['FINAL', 1.62]], ultimo = { 'DUELO': 4, 'FINAL': 4 };
    filas.forEach(function (f) {
      var gs = f[0].split('').map(function (ch) { return letra(ch, X); }), tot = 0, esp = -.02;
      gs.forEach(function (g) { tot += g.userData.ancho + esp; }); tot -= esp;
      var x = -tot / 2;
      gs.forEach(function (g, i) {
        var tx = x + g.userData.ancho / 2; x += g.userData.ancho + esp;
        g.userData.dest = new T.Vector3(tx, f[1], .4);
        g.userData.t0 = 1.05 + (i === ultimo[f[0]] ? .55 : i * .09 + (f[0] === 'FINAL' ? .05 : 0));
        var r = new T.Vector3((Math.random() - .5) * 6, (Math.random() - .3) * 3, 6 + Math.random() * 4);
        g.userData.ori = r; g.userData.rot = new T.Vector3((Math.random() - .5) * 9, (Math.random() - .5) * 9, (Math.random() - .5) * 6);
        S.add(g); letras.push(g);
      });
    });
    // chispas doradas en V detrás del texto y rayos naranjas desde dos destellos
    var chispas = [], gCh = new T.PlaneGeometry(1, .07), origen = new T.Vector3(0, 1.9, -.3);
    for (var c = 0; c < 70; c++) {
      var lado = c % 2 ? 1 : -1, an = (Math.PI / 2) + lado * (.35 + Math.random() * .9) + (Math.random() - .5) * .3;
      if (c % 7 === 0) an = Math.random() * Math.PI * 2;
      var m = new T.Mesh(gCh, aditivo(X.chispa, 0xffd700, 1)); m.userData = { an: an, v: 4 + Math.random() * 6, len: .6 + Math.random() * 1.1, del: Math.random() * .12 };
      m.visible = false; S.add(m); chispas.push(m);
    }
    var destellos = [], rayos = [], gRayo = new T.PlaneGeometry(16, .09);
    [[-4.2, 1.5, -3.6], [4.6, 1.2, -3.0]].forEach(function (p) {
      var fl = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), aditivo(X.halo, 0xffe6a0, 1)); fl.position.set(p[0], p[1], p[2]); S.add(fl); destellos.push(fl);
      for (var k = 0; k < 22; k++) { var ry = new T.Mesh(gRayo, aditivo(X.rayo, 0xff9a1a, .8)); ry.position.set(p[0], p[1], p[2]); ry.rotation.z = Math.random() * Math.PI * 2; ry.rotation.y = (Math.random() - .5) * .8; ry.geometry = gRayo; ry.userData = { w: (Math.random() - .5) * .6 }; S.add(ry); rayos.push(ry); }
    });
    Z.letras = letras; Z.chispas = chispas; Z.origen = origen; Z.destellos = destellos; Z.rayos = rayos; Z.halos = halos;
    return { S: S, Z: Z };
  }
  // ---------------- cortinilla en espiral (anillos crema y cian, como la de TV) ----------------
  function cortinilla(cam) {
    var mat = new T.ShaderMaterial({
      uniforms: { tex: { value: null }, p: { value: 0 }, asp: { value: 1.78 }, giro: { value: 0 }, sal: { value: 0 } },
      transparent: true, depthTest: false, depthWrite: false,
      vertexShader: 'varying vec2 vU; void main(){ vU=uv; gl_Position=vec4(position.xy*2.0,0.0,1.0); }',
      fragmentShader: [
        'uniform sampler2D tex; uniform float p; uniform float asp; uniform float giro; uniform float sal; varying vec2 vU;',
        'void main(){ vec2 q=(vU-.5)*vec2(asp,1.0); float r=length(q); float a=atan(q.y,q.x)/6.2831853;',
        ' float s=fract(r*2.6 - a + giro);',              // dos vueltas de espiral en pantalla
        ' float R=sal>0.5 ? .25+p*1.5 : p*1.7; float g=1.0-smoothstep(R-.12, R, r);', // radio de la espiral: crece desde el centro (entrada) o se cierra hacia él (salida)
        ' float arm=step(s, p*1.05)*g;',                     // dentro del brazo se ve la escena nueva (la de debajo)
        ' float e=abs(s-p*1.05);',
        ' vec3 col=texture2D(tex,vU).rgb; float alpha=1.0-arm;',
        ' if(arm>0.5 && e<.05 && p>0.01 && p<0.99){ col = e<.022 ? vec3(.93,.86,.78) : vec3(.0,.85,1.0); alpha=1.0; }',
        ' gl_FragColor=vec4(col,alpha);', ' #include <colorspace_fragment>', '}'].join('\n')
    });
    var q = new T.Mesh(new T.PlaneGeometry(1, 1), mat); q.frustumCulled = false; q.renderOrder = 9999;
    return q;
  }
  // ---------------- cámara ----------------
  var KF = [ // [t, cámara x,y,z, mira x,y,z]
    [0.00, 0, 1.45, 2.70, 0, .95, -.7],
    [0.85, 0, 1.48, 2.85, 0, .95, -.7],
    [1.25, 0, 1.62, 3.30, 0, 1.0, -.6],
    [1.80, 0, 2.55, 4.90, 0, 1.25, -.3],
    [2.25, 0, 3.20, 6.10, 0, 1.30, 0],
    [3.15, 0, 4.70, 8.10, 0, 1.05, 0],
    [4.90, 0, 5.10, 8.80, 0, 1.0, 0]];
  function suave(x) { return x * x * (3 - 2 * x); }
  function camara(cam, t) {
    var i = 0; while (i < KF.length - 2 && t > KF[i + 1][0]) i++;
    var a = KF[i], b = KF[i + 1], u = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
    u = i >= 3 ? 1 - Math.pow(1 - u, 2) : suave(u);
    var L = function (k) { return a[k] + (b[k] - a[k]) * u; };
    cam.position.set(L(1), L(2), L(3)); cam.lookAt(L(4), L(5), L(6));
  }
  function backOut(x) { var c1 = 1.70158 * 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  // ---------------- animación en el instante t ----------------
  function pinta(E, t, cam) {
    camara(cam, t);
    var Z = E.Z;
    Z.letras.forEach(function (g) {
      var d = g.userData, u = (t - d.t0) / .62;
      if (u <= 0) { g.visible = false; return; }
      g.visible = true; var k = Math.min(1, u), e = backOut(k);
      // sale desde detrás de la cámara (en coordenadas del mundo, delante del objetivo) dando vueltas en todos los ejes
      var o = d.ori.clone().add(cam.position).sub(new T.Vector3(0, 0, 2));
      g.position.lerpVectors(o, d.dest, Math.min(1.15, e));
      var rr = 1 - Math.min(1, e); g.rotation.set(d.rot.x * rr, d.rot.y * rr, d.rot.z * rr);
      var bl = d.bloque; bl.visible = k < .8; bl.scale.setScalar(1 - Math.max(0, (k - .55) / .25) * .6);
      g.scale.setScalar(.75 + .25 * Math.min(1, e));
    });
    // chispazo al encajar las letras (2,35 s) y rayos desde los destellos hasta 3,7 s
    var tc = t - 2.3;
    Z.chispas.forEach(function (m) {
      var d = m.userData, s = tc - d.del;
      if (s < 0 || s > 1.2) { m.visible = false; return; }
      m.visible = true; var dist = d.v * (1 - Math.exp(-s * 2.2)) / 2.2 * 1.6, dir = new T.Vector3(Math.cos(d.an), Math.sin(d.an), 0);
      m.position.copy(Z.origen).addScaledVector(dir, dist + d.len / 2); m.rotation.set(0, 0, d.an);
      m.scale.set(d.len * (1.2 - s * .6), 1, 1); m.material.opacity = Math.max(0, 1 - s / 1.2);
    });
    var tr = t - 2.45, vis = tr > 0 && tr < 1.6, fr = vis ? Math.min(1, tr / .2) * Math.max(0, Math.min(1, (1.6 - tr) / .7)) : 0;
    Z.destellos.forEach(function (f) { f.visible = vis; f.material.opacity = fr; f.lookAt(cam.position); f.scale.setScalar(.8 + Math.sin(t * 40) * .1 + fr); });
    Z.rayos.forEach(function (r) { r.visible = vis; r.material.opacity = .95 * fr; r.rotation.z += r.userData.w * .02; });
  }
  // ---------------- reproducción ----------------
  var EST = null;
  function prepara() { if (!EST) EST = escena(); return EST; }
  DF.escena = prepara;
  function fijaAspecto(cam) { var c = window.__eng && window.__eng.renderer && window.__eng.renderer.domElement; var a = c ? c.clientWidth / Math.max(1, c.clientHeight) : innerWidth / innerHeight; if (Math.abs(cam.aspect - a) > .001) { cam.aspect = a; cam.updateProjectionMatrix(); } return a; }
  // reproduce la cabecera con el motor del juego. op: {fija: t} (para pruebas, congela el instante t)
  DF.cabecera = function (op) {
    op = op || {}; var eng = window.__eng; T = window.THREE;
    if (!eng || !T) return Promise.resolve();
    var E = prepara(), cam = new T.PerspectiveCamera(46, 1.78, .1, 120), q = cortinilla(cam);
    var sz = new T.Vector2(); eng.renderer.getDrawingBufferSize(sz);
    var rt = new T.WebGLRenderTarget(Math.max(2, sz.x >> 1), Math.max(2, sz.y >> 1)); rt.texture.colorSpace = T.SRGBColorSpace;
    q.material.uniforms.tex.value = rt.texture; E.S.add(q);
    var camW = eng.camera, ojoW = null;
    var t = op.fija != null ? op.fija : 0, t0 = null, hecho = false, salida = false;
    var ocultos = ['hashtag', 'bubble'].map(function (id) { var el = D.getElementById(id); if (!el) return null; var v = el.style.visibility; el.style.visibility = 'hidden'; return [el, v]; });
    return new Promise(function (res) {
      var fin = function () { if (hecho) return; hecho = true; if (eng.override === ov) eng.override = null; E.S.remove(q); rt.dispose(); q.material.dispose(); ocultos.forEach(function (o) { o && (o[0].style.visibility = o[1]); }); res(); };
      var ov = {
        scene: E.S, camera: cam,
        update: function (dt) {
          if (hecho) return;
          if (op.fija == null) { if (t0 == null) t0 = performance.now() - 16; t = (performance.now() - t0) / 1000; }   // reloj real: va a la par del audio aunque el móvil pierda fotogramas
          var asp = fijaAspecto(cam); q.material.uniforms.asp.value = asp;
          // cortinilla de entrada (0 → 0,85 s): espiral que abre la cabecera; de salida (3,75 → 4,9 s): espiral que devuelve al plató
          var p = -1;
          if (t < .7) p = Math.min(1, Math.max(0, (t - .05) / .6));
          else if (t > 3.8) { if (!salida) { salida = true; op.alPlato && op.alPlato(); } p = Math.max(0, 1 - (t - 3.8) / 1.1); }
          if (p >= 0 && p < 1) {
            q.visible = true; q.material.uniforms.p.value = t < 1 ? p * p * (3 - 2 * p) * .9 + p * .1 : suave(p); q.material.uniforms.sal.value = t > 1 ? 1 : 0; q.material.uniforms.giro.value = t * .9;
            var cw = eng.camera; cw.aspect = asp; cw.updateProjectionMatrix();
            eng.renderer.setRenderTarget(rt); eng.renderer.render(eng.scene, cw); eng.renderer.setRenderTarget(null);
          } else q.visible = false;
          pinta(E, Math.min(t, DUR), cam);
          if (op.fija == null && t >= DUR) setTimeout(fin, 0);   // fuera del tick: el motor aún pinta este fotograma con override
        }
      };
      eng.override = ov;
      if (op.fija == null) setTimeout(fin, DUR * 1000 + 1500);   // por si la pestaña se queda sin fotogramas
      DF.parar = fin;
    });
  };
  // ---------------- pantalla central durante el Duelo Final: la cantidad en juego ----------------
  // Como en el programa: placa dorada con remates negros y la cifra («19.000 €») sobre un túnel azul en remolino.
  function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  var tunel = null;
  function haceTunel(W, H) {   // remolino pregenerado (una vez); luego solo se gira al pintar
    var c = D.createElement('canvas'), R = Math.ceil(Math.hypot(W, H) * .62) * 2; c.width = c.height = R; var g = c.getContext('2d'), m = R / 2;
    var bg = g.createRadialGradient(m, m, 0, m, m, m); bg.addColorStop(0, '#0b2e5c'); bg.addColorStop(.18, '#1356a8'); bg.addColorStop(.5, '#1f78e6'); bg.addColorStop(1, '#2a8cff');
    g.fillStyle = bg; g.fillRect(0, 0, R, R);
    try { g.filter = 'blur(' + Math.round(R / 150) + 'px)'; } catch (e) { }
    for (var k = 0; k < 4; k++) {   // brazos oscuros que se enroscan hacia el centro
      var a0 = k * Math.PI * 2 / 4; g.beginPath();
      for (var i = 0; i <= 40; i++) { var r = m * 1.05 * (1 - i / 40), a = a0 + (1 - r / m) * 2.1; g.lineTo(m + Math.cos(a) * r, m + Math.sin(a) * r); }
      for (var j = 40; j >= 0; j--) { var r2 = m * 1.05 * (1 - j / 40), a2 = a0 + .95 * (r2 / m + .12) + (1 - r2 / m) * 2.1; g.lineTo(m + Math.cos(a2) * r2, m + Math.sin(a2) * r2); }
      g.closePath(); var gr = g.createRadialGradient(m, m, 0, m, m, m); gr.addColorStop(0, 'rgba(4,22,44,.95)'); gr.addColorStop(.4, 'rgba(10,72,104,.9)'); gr.addColorStop(1, 'rgba(16,96,130,.8)');
      g.fillStyle = gr; g.fill();
    }
    g.filter = 'none';
    var cv = g.createRadialGradient(m, m, 0, m, m, m * .3); cv.addColorStop(0, 'rgba(2,10,24,.9)'); cv.addColorStop(1, 'rgba(2,10,24,0)'); g.fillStyle = cv; g.fillRect(0, 0, R, R);
    return c;
  }
  DF.pintaCantidad = function (g, W, H, txt, ang) {
    if (!tunel || tunel.width < Math.hypot(W, H)) tunel = haceTunel(W, H);
    g.save(); g.translate(W / 2, H / 2); g.rotate(ang || 0); g.drawImage(tunel, -tunel.width / 2, -tunel.height / 2); g.restore();
    var cyP = H * (DF.altoPlaca || .42), pw = W * .54, ph = H * .19, px = (W - pw) / 2, py = cyP - ph / 2;
    // placa dorada
    g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = H * .03; g.shadowOffsetY = H * .01;
    rr(g, px, py, pw, ph, ph * .14); var oro = g.createLinearGradient(0, py, 0, py + ph);
    oro.addColorStop(0, '#7a560f'); oro.addColorStop(.2, '#c0922a'); oro.addColorStop(.55, '#e2c862'); oro.addColorStop(.82, '#f4f0a6'); oro.addColorStop(1, '#b38b28');
    g.fillStyle = oro; g.fill(); g.restore();
    var brillo = g.createLinearGradient(px, 0, px + pw, 0); brillo.addColorStop(0, 'rgba(255,255,255,0)'); brillo.addColorStop(.35, 'rgba(255,250,210,.35)'); brillo.addColorStop(.5, 'rgba(255,255,255,0)'); brillo.addColorStop(.8, 'rgba(255,240,180,.22)'); brillo.addColorStop(1, 'rgba(255,255,255,0)');
    rr(g, px, py, pw, ph, ph * .14); g.fillStyle = brillo; g.fill();
    g.lineWidth = Math.max(2, H * .006); g.strokeStyle = '#3b2a06'; g.stroke();
    // remates negros redondeados a cada lado
    var cw = ph * .92, chh = ph * 1.3;
    [px - cw * .62, px + pw - cw * .38].forEach(function (cx, lado) {
      var cy = cyP - chh / 2; g.save();
      rr(g, cx, cy, cw, chh, cw * .48); var neg = g.createLinearGradient(0, cy, 0, cy + chh);
      neg.addColorStop(0, '#5a5f66'); neg.addColorStop(.12, '#1b1d21'); neg.addColorStop(.55, '#050607'); neg.addColorStop(.9, '#24272b'); neg.addColorStop(1, '#6c7076');
      g.fillStyle = neg; g.fill(); g.lineWidth = Math.max(2, H * .008); g.strokeStyle = '#9aa0a6'; g.stroke();
      rr(g, cx + cw * .18, cy + chh * .1, cw * .64, chh * .22, chh * .1); g.fillStyle = 'rgba(255,255,255,.16)'; g.fill();   // reflejo
      g.fillStyle = '#c9cdd2'; var nx = lado ? cx + cw * .28 : cx + cw * .62; g.fillRect(nx, cyP - chh * .07, cw * .1, chh * .14);   // muesca
      g.restore();
    });
    // cifra
    var fs = ph * .84; g.font = '900 ' + fs + 'px "Arial Black", "Arial", Roboto, sans-serif';
    var tw = g.measureText(txt).width, sx = Math.min(1, pw * .78 / tw);
    g.save(); g.translate(W / 2, cyP + fs * .05); g.scale(sx * .8, 1); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(255,240,170,.55)'; g.fillText(txt, 0, fs * .04);
    g.fillStyle = '#1e1503'; g.fillText(txt, 0, 0); g.restore();
  };
  DF.euros = function (x) { return puntos(x) + ' €'; };
  var pant = null;
  DF.pantalla = function (x) {
    var eng = window.__eng, st = eng && eng.studio, mats = st && st.screenMats; T = window.THREE;
    if (!mats || !mats.length || !T) return;
    DF.quitaPantalla();
    var W = 768, H = 516, c = D.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
    var txt = DF.euros(x), tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    var ang = 0, pinta = function () { DF.pintaCantidad(g, W, H, txt, ang); tex.needsUpdate = true; };
    pinta();
    var orig = mats.map(function (m) { return m.map; });
    mats.forEach(function (m) { m.map = tex; m.needsUpdate = true; });
    var menu = D.getElementById('menu');
    var iv = setInterval(function () {   // el túnel gira despacio (10 fps, textura pequeña: va fino en el Redmi A2)
      if (!eng.studio || eng.studio !== st || (menu && !menu.classList.contains('hidden'))) { DF.quitaPantalla(); return; }
      ang -= .028; pinta();
    }, 100);
    pant = { st: st, mats: mats, orig: orig, tex: tex, iv: iv, x: x };
  };
  DF.quitaPantalla = function () {
    if (!pant) return; var p = pant; pant = null; clearInterval(p.iv);
    p.mats.forEach(function (m, i) { if (m.map === p.tex) { m.map = p.orig[i]; m.needsUpdate = true; } });
    p.tex.dispose();
  };
  // ---------------- integración con el programa ----------------
  // c: contexto del juego; op: {puntos, host(), wide(), habla, solo}
  DF.juega = function (c, op) {
    op = op || {}; var a = audio(), hud = c && c.hud, pres = op.pres || '';
    var cab = cargaCab();
    var linea = Promise.resolve();
    if (!op.solo) {
      var x = Math.max(0, Math.round(op.puntos || 0)), txt = DF.frase(x);
      try { op.host && op.host(); } catch (e) { }
      if (pres && !/Adri/.test(pres)) {   // otro presentador: lo dice con su voz de siempre
        linea = hud ? hud.say(txt, 3200) : Promise.resolve();
      } else {
        var esperaVoz = Promise.race([Promise.resolve().then(function () { return DF.prepara(x); }).catch(function () { return null; }), new Promise(function (r) { setTimeout(function () { r(null); }, 6000); })]);
        linea = esperaVoz.then(function (v) {
          if (v && a && a.ctx) {
            var b = v.buf; if (!b) { b = a.ctx.createBuffer(1, v.samples.length, v.sr); b.getChannelData(0).set(v.samples); }
            DF.ultimaVoz = { x: x, seg: b.duration, trozos: v.buf ? DF.trozos(x) : 'piper' };
            var src = suenaBuf(b, 1, a.voice);
            var ms = b.duration * 1000 + 350;
            hud && hud.say(txt, ms, op.cabeza, pres || 'Adrián Vega', { voice: false });
            return new Promise(function (r) { setTimeout(r, ms); });
          }
          // sin Piper (equipo muy lento o sin WebAssembly): la misma frase con la voz de reserva del juego
          return hud ? hud.say(txt, 3200) : null;
        });
      }
    }
    return linea.catch(function () { }).then(function () { return Promise.resolve(cab).catch(function () { return null; }); }).then(function (buf) {
      try { hud && hud.hideBubble && hud.hideBubble(); } catch (e) { }
      if (buf) suenaBuf(buf, 1, a && (a.sfx || a.master));
      return DF.cabecera({ alPlato: op.wide });
    });
  };
})();
