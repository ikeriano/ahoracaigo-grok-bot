# v1.38 relevo IA en la «App clásica» 2D · uso: patch_clasica.py src/app_clasica.js (idempotente)
import sys
p = sys.argv[1]; s = open(p, encoding='utf8').read()
if '/*RIA2*/' in s: print('ya'); sys.exit(0)
def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c == n, (a[:60], c)
    s = s.replace(a, b)
rep("raiz.appendChild(p); return p; }", "raiz.appendChild(p); if (st) { st.pant = (st.pant || 0) + 1; if (st.ia && !st.fin) ia2Barra(); } return p; }")
rep("st.rivales.forEach((r, k) => { const a =", "st.rivales.forEach((r, k) => { if (r.centro) return; const a =")
s = s.replace("avatar(st.nombre, 0,", "avatar(st.nombre, st.ci || 0,")
rep("if (st.ganados && st.ganados < 10) p.appendChild(boton('✋ Plantarme con '", "if (st.ia) { ia2Elige(); return; } if (st.ganados && st.ganados < 10) p.appendChild(boton('✋ Plantarme con '")
rep("${10 - st.ganados}</b> para el bote", "${st.ia ? quedan2().length : 10 - st.ganados}</b> para el bote")
rep("const n = st.ganados + 1; const p = pantalla();", "const n = st.ganados + 1 + (st.relevos || 0); const p = pantalla();")
rep("estado.textContent = 'Tu turno'; entrada.disabled = false; bP.style.opacity = st.pasar ? 1 : .4; setTimeout(() => entrada.focus(), 50); }",
    "if (st.ia) { estado.textContent = riaF('suTurno2', { n: st.nombre }); entrada.disabled = true; iaTurno(); return; } estado.textContent = 'Tu turno'; entrada.disabled = false; bP.style.opacity = st.pasar ? 1 : .4; setTimeout(() => entrada.focus(), 50); }")
rep("    function responde() {", """    function iaTurno() { /*RIA2*/ clearTimeout(tmB); tmB = setTimeout(() => { if (!vivo || turno !== 0) return; const tot = Math.max(1, q.slots.filter(s => s !== ' ' && s.oc).length), pct = 1 - ocultas().length / tot;
        if (Math.random() < .3 + pct * .65) { entrada.value = q.sol; setTimeout(responde, 450); } else if (st.pasar && Math.random() < .3) pasar(); else { malSnd(); estado.textContent = riaF('falla2', { n: st.nombre }); iaTurno(); } }, 1800 + Math.random() * 3500); }
    function responde() {""")
rep("setTimeout(() => caida(r, ganas), 1100);", "const tkD = st.pant; setTimeout(() => { if (st.pant === tkD) caida(r, ganas); }, 1100);")
rep("setTimeout(() => { st.bloqueo = false; if (ganas) { r.fuera = true; st.ganados++; st.banco += r.cifra; moneda(r); } else final(false, false, r); }, 1900);",
    "const tkC = st.pant; setTimeout(() => { if (st.pant !== tkC) return; st.bloqueo = false; if (ganas) { r.fuera = true; st.ganados++; st.banco += r.cifra; moneda(r); } else if (!relevo2d(r)) final(false, false, r); }, 1900);")
rep("setTimeout(() => { if (!raiz) return; if (st.ganados >= 10) return final(false, true); decision(); }, 2600); }",
    "const tkM = st.pant; setTimeout(() => { if (!raiz || st.pant !== tkM) return; if (st.ganados >= 10 || quedan2().length === 0) return final(false, true); decision(); }, 2600); }")
rep("boton('✋ Me planto con ' + eur(st.banco), () => final(true), false, 'font-size:18px')); }",
    "boton('✋ Me planto con ' + eur(st.banco), () => final(true), false, 'font-size:18px')); if (st.ia) { const tk = st.pant; setTimeout(() => { if (st.pant !== tk || !raiz) return; if (Math.random() < (st.banco < 60000 ? .85 : .6)) { paraMus(); tablero(riaF('sigue2', { n: st.nombre })); } else final(true); }, 2800); } }")
rep("function final(plantado, bote, r) { paraMus();", "function final(plantado, bote, r) { if (st) st.fin = true; paraMus();")
rep("p.appendChild($('div', 'font:800 22px system-ui;color:#fff;text-align:center;margin:18px 20px;text-shadow:0 2px 4px #000', t));",
    "p.appendChild($('div', 'font:800 22px system-ui;color:#fff;text-align:center;margin:18px 20px;text-shadow:0 2px 4px #000', st.ia ? ia2Final(plantado, bote, r) : t));")
rep("  function inicio() {", r"""  // v1.38 · RELEVO IA: si caes, el oponente que te ha ganado pasa al centro con todo tu banco y juega la máquina; tú lo ves (Saltar / Menú)
  function quedan2() { return st.rivales.filter(x => !x.fuera && !x.centro); }
  function voz2(t) { try { if (typeof yn !== 'undefined' && yn && yn.say) yn.say([t]); } catch (_) {} }
  function relevo2d(r, mudo) {
    try { if (localStorage.getItem('ac_relevoIA') === '0') return false; } catch (_) {}
    if (!quedan2().filter(x => x !== r).length) return false;
    if (!st.ia) { st.ia = true; st.hNombre = st.nombre; st.hGanados = st.ganados; }
    st.relevos = (st.relevos || 0) + 1; r.centro = true; st.nombre = r.n; st.ci = r.i;
    if (mudo) return true;
    const L = (typeof RIA_L !== 'undefined' ? RIA_L : {}), p = pantalla(); cabecera(p);
    p.appendChild($('div', `font:900 clamp(24px,7vw,40px) Arial Black,system-ui;color:#fff;text-shadow:0 3px 0 #a00,0 6px 12px #000;margin-top:16px;text-align:center`, riaF('titulo2')));
    const vs = $('div', 'display:flex;align-items:center;gap:18px;margin-top:14px;font:800 18px system-ui;color:#fff;text-align:center');
    const b = $('div'); b.append(avatar(r.n, r.i, 120, true), $('div', '', '🤖 ' + esc0(r.n))); vs.append(b); p.appendChild(vs);
    p.insertAdjacentHTML('beforeend', barraBanco(eur(st.banco)));
    const sub = $('div', `font:700 18px system-ui;color:${ORO};margin:12px 22px;text-align:center;min-height:52px;text-shadow:0 2px 3px #000`); p.appendChild(sub);
    const fr = st.relevos > 1 ? [L.caeOtra, L.relevo, L.bienvenido] : [L.cae, L.relevo, L.mira, L.bienvenido]; const tk = st.pant; let i = 0;
    const sig = () => { if (st.pant !== tk || !raiz) return; const f = fr.filter(Boolean)[i++]; if (!f) { tablero(riaF('elige2', { n: st.nombre })); return; } sub.textContent = '🎙️ ' + f; voz2(f); setTimeout(sig, 1200 + f.length * 55); };
    p.appendChild(boton('▶ ' + riaF('continuar2'), () => { if (st.pant === tk) tablero(riaF('elige2', { n: st.nombre })); }, true));
    sig(); return true;
  }
  function ia2Elige() { const tk = st.pant; setTimeout(() => { if (st.pant !== tk || !raiz || st.bloqueo || st.enDuelo) return; const L = quedan2(); if (!L.length) return final(false, true); previa(L[Math.floor(Math.random() * L.length)]); }, 1600 + Math.random() * 1600); }
  function ia2Barra() { if (!raiz) return; let b = raiz.querySelector('.ria2'); if (b) b.remove(); b = $('div', `position:absolute;left:8px;top:8px;z-index:5;background:#000c;border:2px solid ${ORO};border-radius:14px;padding:6px 8px;font:700 13px system-ui;color:#fff;text-align:center;max-width:46vw`);
    b.className = 'ria2'; b.innerHTML = `<div>${riaF('barra')}</div><div>🤖 ${esc0(st.nombre)} · 💰 ${eur(st.banco)}</div>`;
    const bs = (t, fn) => { const x = $('button', `margin:4px 2px 0;padding:6px 10px;border-radius:16px;border:2px solid ${ORO};background:#1b2a5a;color:#fff;font:700 12px system-ui;cursor:pointer`, t); x.onclick = fn; return x; };
    b.append(bs(riaF('saltar'), () => ia2Salta()), bs(riaF('menu'), () => cerrar())); raiz.appendChild(b); }
  function ia2Salta() { if (st.salirDuelo) st.salirDuelo(); clearTimeout(st.tmPrevia); st.bloqueo = false; st.enDuelo = false;
    for (let g = 0; g < 40; g++) { const L = quedan2(); if (!L.length) return final(false, true); const r = L[Math.floor(Math.random() * L.length)];
      if (Math.random() < .7) { r.fuera = true; st.ganados++; st.banco += r.cifra; if (!quedan2().length) return final(false, true); if (Math.random() < (st.banco < 60000 ? .1 : .3)) return final(true); }
      else if (!relevo2d(r, true)) return final(false, false, r); }
    final(true); }
  function ia2Final(plantado, bote, r) { const t = bote ? riaF('bote2', { n: st.nombre, a: eur(st.banco + (E.bote || 100000)) }) : plantado ? riaF('planta2', { n: st.nombre, a: eur(st.banco) }) : riaF('cae2', { n: st.nombre, r: r ? r.n : '' });
    return t + ' ' + riaF('resumen2', { k: st.hGanados || 0, g: st.relevos || 0 }); }
  function inicio() {""")
open(p, 'w', encoding='utf8').write(s); print('ok')
