/* ¡Ahora caigo! 1.37 · Rótulos de emisión (como en la tele) + logo de cadena.
   - #AhoraCaigo pequeño y blanco arriba a la izquierda.
   - Autopromoción arriba a la derecha: logo de ¡Ahora caigo! + «Muy pronto estreno / Gran regreso / En <cadena>».
   - Logo de la cadena elegida abajo a la derecha: los archivos de Iker tal cual (solo se escalan).
   Se ve durante todo el programa, desde la cabecera. Por defecto: rótulos Sí; logo de cadena «Actual» (como hasta ahora, sin logo). */
(function () {
  'use strict';
  var C = window.CANAL = {}, KEY = 'ac_canal137';
  C.lista = [ // id, nombre en el selector, archivo, cadena en la autopromoción
    ['actual', 'Actual', null, null],
    ['cuatro', 'Cuatro', 'canal/cuatro.png', 'Cuatro'],
    ['antena3_hd', 'Antena 3 HD', 'canal/antena3_hd.jpg', 'Antena 3'],
    ['antena3_blanco', 'Antena 3 (blanco)', 'canal/antena3_blanco.png', 'Antena 3'],
    ['antena3_relieve', 'Antena 3 (relieve)', 'canal/antena3_relieve.png', 'Antena 3'],
    ['telecinco_blanco', 'Telecinco (blanco)', 'canal/telecinco_blanco_contorno.png', 'Telecinco'],
    ['telecinco_color', 'Telecinco (color)', 'canal/telecinco_color.png', 'Telecinco'],
    ['la2', 'La 2', 'canal/la2_blanco.png', 'La 2']];
  function lee(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function si(k) { return lee(k, '1') !== '0'; }
  C.actual = function () { var v = lee(KEY, 'actual'); return C.lista.some(function (l) { return l[0] === v; }) ? v : 'actual'; };
  function item(id) { for (var i = 0; i < C.lista.length; i++) if (C.lista[i][0] === id) return C.lista[i]; return C.lista[0]; }
  C.cadena = function () { return item(C.actual())[3] || 'Show Time TV'; };   // «Actual»: la cadena inventada del juego
  function tecla() { try { window.__audio && __audio.play('Tecla'); } catch (x) { } }
  function filaSiNo(k, txt) {
    var c = document.createElement('div'); c.className = 'orow';
    var l = document.createElement('label'); l.textContent = txt; c.appendChild(l);
    [['1', 'Sí'], ['0', 'No']].forEach(function (o) {
      var b = document.createElement('button'); b.className = 'tbtn' + ((si(k) ? '1' : '0') === o[0] ? ' sel' : ''); b.textContent = o[1]; b.dataset.v = o[0];
      b.onclick = function (e) { e.stopPropagation(); tecla(); try { localStorage.setItem(k, o[0]); } catch (x) { } c.querySelectorAll('button').forEach(function (m) { m.classList.toggle('sel', m === b); }); pon(); };
      c.appendChild(b);
    });
    return c;
  }
  C.fila = function () {
    var f = document.createElement('div'); f.id = 'canal137';
    f.appendChild(filaSiNo('ac_emision137', '📡 Rótulos de emisión (como en la tele)'));
    f.appendChild(filaSiNo('ac_emhash137', '#️⃣ #AhoraCaigo arriba a la izquierda'));
    f.appendChild(filaSiNo('ac_empromo137', '📣 Autopromoción arriba a la derecha'));
    var c = document.createElement('div'); c.className = 'orow';
    var l = document.createElement('label'); l.textContent = '📺 Logo de cadena (abajo a la derecha)'; c.appendChild(l);
    var w = document.createElement('div'); w.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;max-width:62%';
    C.lista.forEach(function (it) {
      var b = document.createElement('button'); b.className = 'tbtn' + (C.actual() === it[0] ? ' sel' : ''); b.dataset.canal = it[0];
      b.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;padding:4px 7px';
      if (it[2]) { var im = document.createElement('img'); im.src = it[2]; im.alt = it[1]; im.style.cssText = 'height:26px;width:auto;max-width:76px;object-fit:contain;background:#3a3a52;border-radius:3px'; b.appendChild(im); }
      b.appendChild(document.createTextNode(it[1]));
      b.onclick = function (e) { e.stopPropagation(); tecla(); try { localStorage.setItem(KEY, it[0]); } catch (x) { } w.querySelectorAll('button').forEach(function (o) { o.classList.toggle('sel', o === b); }); pon(); };
      w.appendChild(b);
    });
    c.appendChild(w); f.appendChild(c); return f;
  };
  // ---------------- capa de emisión ----------------
  var capa = null, hash, promo, pcad, logo, src = null, hashJuego = null;
  function crea() {
    var st = document.createElement('style'); st.textContent =
      '#emision137{position:fixed;inset:0;pointer-events:none;z-index:65;font-family:Arial,Roboto,sans-serif;color:#fff}' +
      '#emision137 .eh{position:absolute;left:max(12px,env(safe-area-inset-left));top:max(8px,env(safe-area-inset-top));font:700 clamp(10px,2.6vh,17px) Arial,Roboto,sans-serif;text-shadow:0 1px 2px #000a;opacity:.92}' +
      '#emision137 .ep{position:absolute;right:max(12px,env(safe-area-inset-right));top:calc(max(8px,env(safe-area-inset-top)) + 44px);display:flex;flex-direction:column;align-items:center;text-align:center;font:700 clamp(8px,2.1vh,14px)/1.25 Arial,Roboto,sans-serif;text-shadow:0 1px 2px #000c}' +
      '#emision137 .ep img{height:clamp(30px,11vh,80px);width:auto;margin-bottom:2px;filter:drop-shadow(0 1px 2px #0008)}' +
      '#emision137 .el{position:absolute;right:max(16px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));height:clamp(26px,8vh,64px);width:auto;max-width:22vw;object-fit:contain}' +
      'html.vertical #emision137 .ep{top:calc(max(8px,env(safe-area-inset-top)) + 6px)}';
    document.head.appendChild(st);
    capa = document.createElement('div'); capa.id = 'emision137';
    hash = document.createElement('div'); hash.className = 'eh';
    promo = document.createElement('div'); promo.className = 'ep';
    var pl = document.createElement('img'); pl.src = 'logo.png'; pl.alt = '';
    var t1 = document.createElement('div'); t1.textContent = 'Muy pronto estreno';
    var t2 = document.createElement('div'); t2.textContent = 'Gran regreso';
    pcad = document.createElement('div');
    promo.append(pl, t1, t2, pcad);
    logo = document.createElement('img'); logo.className = 'el'; logo.alt = '';
    capa.append(hash, promo, logo);
    document.body.appendChild(capa);   // fuera de #app: así queda por encima de la cabecera 3D de apertura (#promo3d)
  }
  function pon() {
    var menu = document.getElementById('menu'), enJuego = !!(menu && menu.classList.contains('hidden'));
    var on = si('ac_emision137') && enJuego, it = item(C.actual());
    if (!capa) { if (!on) return; crea(); }
    capa.style.display = on ? 'block' : 'none';
    if (on && capa.nextElementSibling) document.body.appendChild(capa);   // siempre la última: por encima de la cabecera de apertura y de las capas WebGL
    var hj = document.getElementById('hashtag');
    var conHash = on && si('ac_emhash137');
    if (hj) {   // el #AhoraCaigo del juego deja sitio al de emisión (y vuelve tal cual si se quita)
      if (conHash) { if (hashJuego == null) hashJuego = hj.style.opacity; hj.style.opacity = '0'; }
      else if (hashJuego != null) { hj.style.opacity = hashJuego; hashJuego = null; }
    }
    if (!on) return;
    hash.style.display = conHash ? 'block' : 'none';
    var ht = hj && hj.textContent && hj.textContent.trim(); hash.textContent = ht && ht[0] === '#' ? ht : '#AhoraCaigo';
    promo.style.display = si('ac_empromo137') ? 'flex' : 'none';
    pcad.textContent = 'En ' + C.cadena();
    if (it[2]) { if (src !== it[2]) { logo.src = it[2]; src = it[2]; } logo.style.display = 'block'; } else logo.style.display = 'none';
  }
  C.pon = pon;
  setInterval(pon, 400);
})();
