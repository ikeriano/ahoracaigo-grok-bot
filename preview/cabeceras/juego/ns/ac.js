/* Normas sorpresa · adaptador de ¡Ahora caigo! 1.36 (ES5). Une el motor ns/ns.js y el catálogo ns/cat.js con el juego.
   js/app.js (el de la 1.35) solo lleva llamadas cortas a window.NSAC, protegidas con «self.NSAC&&…»: si las normas
   están en «No» (lo normal) no hay normas activas y todas estas funciones devuelven el valor de siempre. */
(function () {
  'use strict';
  var A = window.NSAC = {}, D = document;
  NS.base('ns/');
  var est2 = { prev: 0, tiradas: 0, oro: 0, cola: [], ult: 0 };
  function on() { return NS.activas().length > 0; }
  function fx(k, d) { return NS.fx(k, d); }
  A.on = on;
  function opts() { try { return JSON.parse(localStorage.getItem('ac3d_opts') || '{}') || {}; } catch (e) { return {}; } }
  // avisos en cola para que no se pisen
  function av(t) { var n = Date.now(), at = Math.max(n, est2.ult + 1950); est2.ult = at; setTimeout(function () { NS.aviso(t); }, at - n); }
  function euros(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  var MODOS = { duelo: 'Duelo', entretres: 'Prueba', adivina: 'Prueba', dameletra: 'Prueba', sino: 'Prueba', vayalio: '¡Vaya lío!',
    pruebas: 'Pruebas con reloj', gallina: 'Palabra gallina', final: 'Juego final', huellas: 'Huellas y moneda', sintiempo: 'Pruebas sin tiempo' };
  // --- arranque: Programa completo (antes de subir a la trampilla) y Entrenamiento ---
  A.inicio = function (modo, pc, oe) {
    A.fin();
    var o = opts(); NS.mudo = o.voz === false; NS.sonido(o.sfx !== false);
    var nombre, etiqueta;
    if (modo === 'programa') { nombre = 'Programa completo'; etiqueta = 'Programa completo'; }
    else { var sub = String(modo).replace(/^ent:/, ''); if (!MODOS[sub]) return Promise.resolve(); nombre = 'Entrenamiento · ' + MODOS[sub]; etiqueta = nombre; }
    var tipos = NS.tipos(nombre).slice();
    if (pc && pc.plan && pc.plan.indexOf('gallina') >= 0) tipos.push('gallina', 'gallinaDuelo');
    if (!NS.on()) return Promise.resolve();
    try { oe && oe.stopMusic && oe.stopMusic(0.8); } catch (e) { }
    est2 = { prev: 0, tiradas: 0, oro: 1 + Math.floor(Math.random() * 10), cola: [], ult: 0 };
    return NS.empieza(tipos, { modo: etiqueta }).then(function () {
      if (!on() || !pc) return;
      var m = fx('comodMas', 0); if (m) pc.vidas = Math.min(33, (pc.vidas || 0) + m);
      if (fx('dorada') && pc.c && pc.c.eng && pc.c.eng.studio) dorada(pc.c.eng.studio);
    });
  };
  function dorada(st) {
    if (st.__nsDorada) return; st.__nsDorada = 1; var orig = st.setHoleColor;
    st.setHoleColor = function (i, c) { if (i === 0 && on() && fx('dorada') && c !== 16719904 && c !== 16777215 && c !== 2236962) c = 16765466; return orig.apply(this, [i, c].concat([].slice.call(arguments, 2))); };
    try { st.setHoleColor(0, 0); } catch (e) { }
  }
  A.fin = function () {
    var go = D.querySelector('.nsbtns button:not(.s)'); if (go) try { go.click(); } catch (e) { }
    if (on()) NS.termina();
  };
  // --- comodines del Entrenamiento (el duelo de entreno pone 2 comodines al empezar) ---
  A.comodMas = function () { return on() ? fx('comodMas', 0) : 0; };
  // --- relojes ---
  function enGallina() { return window.__pruebaActual === 'gallina'; }
  A.reloj = function (p) { if (!on()) return p; var v = (fx('relojAmbos', 0) || p) + fx('relojMas', 0); if (enGallina()) v += fx('gallinaMas', 0); return Math.max(10, v); };
  A.relojR = function (p) { if (!on()) return p; return Math.max(10, (fx('relojAmbos', 0) || 30) - fx('relojRMenos', 0)); };
  A.t30 = function (tipo) { if (!on()) return 30; var v = NS.tiempo(30); if (tipo === 'gallina') v += fx('gallinaMas', 0); return v; };
  A.final = function (s) { return on() ? s + fx('finalMas', 0) : s; };
  A.meta = function () { return on() ? 10 - fx('metaMenos', 0) : 10; };
  A.finalX = function () { return on() ? (fx('finalX', 0) || 2) : 2; };
  A.planta = function () { return on() ? (fx('planta', 0) || 0.5) : 0.5; };
  // --- nivel de los oponentes (0,05 fácil … 0,85 difícil) ---
  A.skill = function (s, ronda) {
    if (!on()) return s; s = s * fx('rival', 1) + fx('rivalMas', 0);
    if (fx('primerFacil') && ronda <= 1) s *= 0.4;
    if (fx('escalera')) s += ronda <= 3 ? -0.12 : ronda >= 7 ? 0.05 : 0;
    if (fx('gallinaRival') && enGallina()) s -= 0.25;
    return Math.max(0.03, Math.min(0.9, s));
  };
  // --- aciertos y fallos ---
  A.ok = function () {
    if (!on()) return; NS.acierto();
    if (fx('gallinaFiesta') && enGallina() && NS.una('gfiesta')) { NS.confeti(40); NS.aplauso(2); NS.suena('x_gallina', 4000); }
  };
  window.NSOK = function (s) { try { A.ok(); } catch (e) { } return s; };
  window.NSY = function (p) { try { A.ok(); } catch (e) { } return p; };
  A.ko = function () { if (on()) NS.fallo({ sinEscudo: true }); };
  // fallo en una prueba con respuestas: «Fallo gratis» lo perdona sin gastar comodín
  A.salva = function () {
    if (!on()) return false; var e = NS.est();
    if (e.escudos > 0) { e.escudos--; av('🃏 ¡Fallo gratis! No gastas comodín'); NS.suena('ev_escudo_0', 4000); return true; }
    NS.fallo({ sinEscudo: true }); return false;
  };
  // reloj a cero en un duelo: «Prórroga»
  A.prorroga = function (u) {
    var s = on() ? fx('prorroga', 0) : 0; if (!s || !NS.una('prorroga')) { A.ko(); return false; }
    u.me = s; av('⏱️ ¡Prórroga! +' + s + ' s'); NS.suena(s >= 20 ? 'x_prorroga20' : 'x_prorroga10', 4000); return true;
  };
  // duelo perdido: «Trampilla bloqueada»
  A.bloqueo = function () { return on() && !!fx('bloqueo') && NS.una('bloqueo'); };
  A.salvado = function (pc, n, opp) {
    av('🕳️ ¡Trampilla bloqueada! No caes');
    return NS.suena('x_bloqueo', 6000).then(function () {
      try { opp.root.visible = false; pc.c.eng.studio.setHoleColor(n, 2236962); } catch (e) { }
      return 'win';
    });
  };
  // --- la moneda de cada trampilla ---
  A.antes = function (pc) { est2.prev = pc.placar || 0; };
  A.despues = function (pc, opp) {
    if (!on()) return; var d = (pc.placar || 0) - est2.prev, extra = 0;
    if (fx('protegida') && d < 0) { pc.placar = est2.prev; d = 0; av('🛡️ ¡Moneda protegida! No pierdes nada'); }
    est2.tiradas++;
    if (d > 0 && fx('dinero', 1) !== 1) extra += Math.round(d * (fx('dinero', 1) - 1));
    if (d > 0 && fx('huellaOro') && opp === est2.oro) { extra += d * 2; av('🦶 ¡Huella de oro! Paga el triple'); NS.suena('x_huellaoro', 4000); }
    extra += fx('hucha', 0);
    if (fx('rachaD', 0) && est2.tiradas % 3 === 0) extra += fx('rachaD', 0);
    if (fx('arranqueD', 0) && est2.tiradas === 1) extra += fx('arranqueD', 0);
    if (extra > 0) { pc.placar = (pc.placar || 0) + extra; av('💰 +' + euros(extra) + ' € de las normas'); }
    var cada = fx('comodCada', 0);
    if (cada && est2.tiradas % cada === 0 && pc.vidas != null) { pc.vidas = Math.min(33, pc.vidas + 1); av('🃏 ¡Comodín verde de regalo!'); NS.suena('x_comod', 3000); }
  };
  // el distintivo, debajo de la barra de arriba (☰ 👁 💡) para no tapar el panel ni los relojes
  var css = D.createElement('style');
  css.textContent = '.nsbadge{left:auto!important;right:6px!important;bottom:auto!important;top:56px!important}html.vertical .nsbadge{top:62px!important}';
  (D.head || D.documentElement).appendChild(css);
})();
