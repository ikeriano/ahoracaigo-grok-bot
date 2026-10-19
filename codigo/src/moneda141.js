// ===================================================================================================
// v1.41 · «🪙 Los 2 lados de la moneda suman» en Opciones (Sí por defecto, lo pidió Iker):
//  · Sí: el concursante gana el lado que elige + el del otro lado. Primero, si el lado ELEGIDO es «LO PIERDES TODO» o
//    «÷2», se aplica (el del otro lado nunca resta); luego se suman las cifras, vidas/comodines, +15 s y Huella de oro
//    de los dos lados; al final los multiplicadores (×5, ×2) de cualquiera de los dos lados. Huella de oro pendiente: la
//    moneda entera paga el triple. Funciona con la pirámide clásica y con la nueva (las épocas antiguas tienen una sola cifra).
//  · No: exactamente como la 1.40 (solo cuenta el lado elegido).
// Se guarda en localStorage 'ac_moneda2lados' ('1' | '0'; sin valor = Sí).
// ===================================================================================================
const monedaDosLados = () => { try { return localStorage.getItem('ac_moneda2lados') !== '0'; } catch (e) { return true; } };
function TA2lados(h, d, e) {
  const DESTR = x => x === 'cero' || x === 'mitad', MULT = x => x === 'x5' || x === 'doble';
  const pend = !!e.huellaOro; e.huellaOro = 0;
  if (DESTR(h)) TA(h, e);                                   // el lado elegido malo sí cuenta (pero no se lleva lo del otro lado)
  const lados = [h, d].filter(x => x && !DESTR(x));
  const p1 = e.placar;
  for (const x of lados) if (!MULT(x)) for (let k = 0; k < (pend && x !== 'oro' ? 3 : 1); k++) TA(x, e); // cifras, vidas, +15 s, huella
  const p2 = e.placar;
  for (const x of lados) if (MULT(x)) TA(x, e);             // ×5 / ×2 después de sumar
  if (pend) { const g = e.placar - p2; g > 0 && (e.placar += 2 * g); return (e.placar - p1) > 0 ? 1 : 2; }
  return 0;
}
function filaMoneda141() {
  const row = document.createElement('div'); row.className = 'orow'; row.id = 'optMoneda141';
  const lb = document.createElement('label'); lb.textContent = '🪙 Los 2 lados de la moneda suman'; row.appendChild(lb);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) {
    const b = document.createElement('button'); b.className = 'tbtn' + ((monedaDosLados() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.dataset.v = v;
    b.title = v === '1' ? 'Ganas el lado que eliges + el del otro lado (por defecto)' : 'Solo cuenta el lado que eliges (como en la 1.40)';
    b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } localStorage.setItem('ac_moneda2lados', v); row.querySelectorAll('.tbtn').forEach(x => x.classList.toggle('sel', x === b)); };
    row.appendChild(b); }
  const box = document.createElement('div'); box.appendChild(row);
  const n = document.createElement('p'); n.className = 'mtext'; n.textContent = '🪙 Sí (por defecto): ganas el lado que eliges y también el del otro lado. No: solo cuenta el lado que eliges.'; box.appendChild(n);
  box.id = 'optMoneda141box'; return box; }
function monedaMover141() { const m = document.getElementById('menu'); if (!m || !m.querySelector('h2') || m.querySelector('#optMoneda141box')) return;
  const ref = m.querySelector('#optPiramide140') || m.querySelector('#optCabecera136'); const w = filaMoneda141();
  if (ref && ref.parentNode) ref.parentNode.insertBefore(w, ref.nextSibling); else { const h = m.querySelector('h2'); h.parentNode.insertBefore(w, h.nextSibling); } }
{ const lt0 = Lt; Lt = function (a, ...r) { const x = lt0.call(this, a, ...r); if (a === 'options') try { monedaMover141(); } catch (e) { console.warn('moneda141', e); } return x; }; }
window.__moneda141 = { on: monedaDosLados, set: v => localStorage.setItem('ac_moneda2lados', v ? '1' : '0') };
