// v1.43 · El Rosco de la Trampilla: tiempo 100 / 500 segundos y respuesta escrita con el teclado del móvil.
(function () {
  var KEY = 'ac_rosco_t';
  var tiempo = function () { return +localStorage.getItem(KEY) === 500 ? 500 : 100; };
  var css = document.createElement('style');
  css.textContent = '#ros143{position:fixed;left:0;right:0;bottom:0;z-index:99;display:flex;gap:6px;padding:6px 8px;background:#06205ce8;border-top:2px solid #8fc4ff;align-items:center}'
    + '#ros143 input{flex:1;min-width:0;height:42px;border-radius:10px;border:2px solid #fff;padding:0 10px;font:800 20px Montserrat,system-ui;text-transform:uppercase;color:#0d2a80}'
    + '#ros143 button{height:42px;border:2px solid #fff;border-radius:10px;font:800 14px Montserrat,system-ui;color:#fff;padding:0 10px}'
    + '#ros143 .r{background:linear-gradient(#2a9a3a,#0c6a1a)}#ros143 .p{background:linear-gradient(#ff9a2a,#d45a00)}'
    + '#ros143t{position:fixed;inset:0;z-index:100;background:#000a;display:flex;align-items:center;justify-content:center}'
    + '#ros143t div{background:#0a2f8a;border:3px solid #ffd23a;border-radius:16px;padding:16px 18px;text-align:center;color:#fff;font:800 18px Montserrat,system-ui;max-width:90vw}'
    + '#ros143t button{margin:10px 6px 0;min-width:120px;height:48px;border-radius:12px;border:2px solid #fff;background:linear-gradient(#3a7af0,#0c2a9a);color:#fff;font:900 18px Montserrat,system-ui}'
    + '#ros143t button.sel{outline:4px solid #ffd23a}';
  document.head.appendChild(css);
  var norm = function (t) {
    return (t || '').toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0001/g, 'Ñ').replace(/[^A-ZÑ]/g, '');
  };
  var ar = function () { var w = window.__ros143; return w && w.__ar && w.__ar.id === 'rosco' ? w.__ar : null; };
  function responder(txt) {
    var a = ar(); if (!a || !a.escribe || !a.q) return;
    var q = a.q, n = q.celdas.filter(function (c) { return !c.fija; }).length;
    for (var i = 0; i < n; i++) a.escribe('⌫');
    var l = norm(txt).split('');
    for (var k = 0; k < n; k++) { var b = ar(); if (!b || !b.escribe) break; b.escribe(l[k] || '·'); }
  }
  function barra(root) {
    if (document.getElementById('ros143')) return;
    var d = document.createElement('div'); d.id = 'ros143';
    d.innerHTML = '<input type="text" inputmode="text" enterkeyhint="send" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" placeholder="Escribe tu respuesta…"><button class="r">Responder</button><button class="p">Pasapalabra</button>';
    var inp = d.querySelector('input');
    var enviar = function () { var v = inp.value; inp.value = ''; if (norm(v)) responder(v); };
    inp.addEventListener('keydown', function (ev) { ev.stopPropagation(); if (ev.key === 'Enter') { ev.preventDefault(); enviar(); } });
    inp.addEventListener('keyup', function (ev) { ev.stopPropagation(); });
    ['click', 'pointerdown', 'touchstart'].forEach(function (t) { d.addEventListener(t, function (ev) { ev.stopPropagation(); }); });
    d.querySelector('.r').onclick = function (ev) { ev.stopPropagation(); enviar(); inp.focus(); };
    d.querySelector('.p').onclick = function (ev) { ev.stopPropagation(); inp.value = ''; var a = ar(); a && a.pasa && a.pasa(); };
    document.body.appendChild(d);
  }
  function elegirTiempo(fila) {
    var r = document.createElement('div'); r.className = 'orow'; r.id = 'rowRoscoT143'; r.style.cssText = 'flex-wrap:wrap;gap:6px';
    var lb = document.createElement('label'); lb.textContent = '⏱️ Tiempo del Rosco de la Trampilla'; lb.style.cssText = 'flex:1 1 100%'; r.appendChild(lb);
    [100, 500].forEach(function (v) {
      var b = document.createElement('button'); b.className = 'tbtn' + (tiempo() === v ? ' sel' : ''); b.textContent = v + ' segundos' + (v === 100 ? ' (normal)' : '');
      b.style.cssText = 'flex:1 1 40%;font-size:13px;padding:6px 4px';
      b.onclick = function (ev) { ev.stopPropagation(); localStorage.setItem(KEY, String(v)); r.querySelectorAll('button').forEach(function (x) { x.classList.toggle('sel', x === b); }); };
      r.appendChild(b);
    });
    fila.parentNode.insertBefore(r, fila.nextSibling);
  }
  new MutationObserver(function () {
    var ros = document.getElementById('rosco132');
    if (ros) barra(ros); else { var b = document.getElementById('ros143'); b && b.remove(); }
    var f = document.getElementById('rowRosco132');
    if (f && !document.getElementById('rowRoscoT143')) elegirTiempo(f);
  }).observe(document.documentElement, { childList: true, subtree: true });
  window.__rosco143 = { tiempo: tiempo, norm: norm, responder: responder };
})();
