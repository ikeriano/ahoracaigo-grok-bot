// v1.31 · CINCO PRUEBAS NUEVAS con el panel de las pruebas del programa y las trampillas de siempre:
// EL ROSCO DE LA TRAMPILLA (rueda A-Z; cada fallo abre la trampilla un instante), LA MEMORIA, LA INTRUSA,
// CUENTAS DE TRAMPILLA y EL PRECIO DE LA TRAMPILLA (euros). Entran en el Programa completo, Entrenamiento y Opciones.
const P131 = ['rosco', 'memoria', 'intrusa', 'cuentas', 'precio'];
Object.assign(V128.titulos, V131.titulos); Object.assign(V128.dichos, V131.dichos);
// ---- EL ROSCO: rueda de letras a la derecha; verde acierto, rojo fallo (y la trampilla central se pone roja)
const ROS = { i: 0, el: null, iv: null, n: 0 };
function roscoPon() {
  roscoQuita(); const d = document.createElement('div'); d.id = 'rosco131'; const L = V131.rosco, R = 74;
  d.style.cssText = 'position:fixed;left:10px;top:20%;width:180px;height:180px;z-index:43;pointer-events:none';
  d.innerHTML = L.map(([l], k) => { const a = k / L.length * Math.PI * 2 - Math.PI / 2; return `<b data-k="${k}" style="position:absolute;left:${90 + Math.cos(a) * R - 12}px;top:${90 + Math.sin(a) * R - 12}px;width:24px;height:24px;border-radius:50%;background:#1c4ad0;border:2px solid #fff;color:#fff;font:900 13px/20px Montserrat,system-ui;text-align:center;transition:background .3s,transform .3s">${l}</b>`; }).join('') + '<i style="position:absolute;inset:58px;border-radius:50%;background:radial-gradient(#ffd23a,#c08a00);box-shadow:0 0 14px #ffd23a;display:flex;align-items:center;justify-content:center;font:900 12px Montserrat,system-ui;color:#2a1a00">€</i>';
  document.body.appendChild(d); ROS.el = d; ROS.n = 0;
  ROS.iv = setInterval(() => { const W = window.__ar; if (!W || !W.log || !ROS.el) return; while (ROS.n < W.log.length) { const ev = W.log[ROS.n++], b = ROS.el.querySelector(`[data-k="${(ROS.i - 1 + V131.rosco.length) % V131.rosco.length}"]`); if (!b) continue;
    if (/-ok$/.test(ev)) { b.style.background = '#2ac040'; sfx128('ding'); } else if (/error/.test(ev)) { b.style.background = '#e8343a'; roscoTrampilla(); } else if (/pasa/.test(ev)) b.style.background = '#f0a020'; } }, 150);
}
function roscoQuita() { clearInterval(ROS.iv); ROS.iv = null; ROS.el && ROS.el.remove(); ROS.el = null; }
function roscoTrampilla() { try { const st = Xe.studio; st.setHoleColor(0, 16719904); sfx128('boom'); Xe.shake = Math.max(Xe.shake || 0, 0.3); setTimeout(() => st.setHoleColor(0, 16777215), 650); } catch (e) { } }
AR_GEN.rosco = () => { const L = V131.rosco, p = L[ROS.i % L.length]; ROS.i++;
  if (ROS.el) ROS.el.querySelectorAll('b').forEach((b, k) => b.style.transform = k === (ROS.i - 1) % L.length ? 'scale(1.5)' : '');
  const c = arHuecos(p[2], 1); const w = arLetras(p[2]); c[0] = { l: w[0], fija: true, sol: w[0], y: true };
  return { texto: p[1], etiqueta: (p[0] === 'Ñ' || p[0] === 'X' ? 'CONTIENE LA ' : 'EMPIEZA POR LA ') + p[0], celdas: c, resp: p[2], modo: 'huecos' }; };
// ---- LA MEMORIA: 4 dibujos se ven 2,5 s en grande y luego se pregunta por uno
function memoriaMuestra(items, pos) { const d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;right:0;top:18%;z-index:46;text-align:center;pointer-events:none;transition:opacity .4s';
  d.innerHTML = '<div style="display:inline-flex;gap:14px;padding:12px 18px;border-radius:18px;background:#0a1a4aee;border:3px solid #ffd23a;box-shadow:0 0 24px #ffd23a88">' + items.map((x, k) => `<div style="font-size:min(14vw,72px);line-height:1.1">${x[0]}<div style="font:900 18px Montserrat,system-ui;color:#ffd23a">${k + 1}</div></div>`).join('') + '</div>';
  document.body.appendChild(d); sfx128('ding'); setTimeout(() => d.style.opacity = '0', 2500); setTimeout(() => d.remove(), 3000); }
AR_GEN.memoria = () => { const it = mA(V131.memoria.slice()).slice(0, 4), pos = Math.floor(Math.random() * 4), p = it[pos]; memoriaMuestra(it, pos);
  return { texto: '¿Qué dibujo estaba en la posición ' + (pos + 1) + '?', etiqueta: 'LA MEMORIA · MIRA BIEN', celdas: arHuecos(p[1], Math.random() < 0.5 ? 0 : 1), resp: p[1], modo: 'huecos', lee: 'Memoria. ¿Qué dibujo estaba en la posición ' + (pos + 1) + '?' }; };
// ---- CUENTAS DE TRAMPILLA: cuenta aleatoria; el resultado se escribe en letras
const NUM131 = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE'];
const DEC131 = { 30: 'TREINTA', 40: 'CUARENTA', 50: 'CINCUENTA', 60: 'SESENTA', 70: 'SETENTA', 80: 'OCHENTA', 90: 'NOVENTA' };
const numLetras = n => n <= 20 ? NUM131[n] : n < 30 ? 'VEINTI' + NUM131[n - 20].replace('DOS', 'DOS').replace('TRES', 'TRES').replace('SEIS', 'SEIS') : DEC131[n - n % 10] + (n % 10 ? ' Y ' + NUM131[n % 10] : '');
AR_GEN.cuentas = () => { let a, b, op, r; do { const t = Math.floor(Math.random() * 3); if (t === 0) { a = 2 + Math.floor(Math.random() * 8); b = 2 + Math.floor(Math.random() * 8); op = '×'; r = a * b; } else if (t === 1) { a = 10 + Math.floor(Math.random() * 50); b = 5 + Math.floor(Math.random() * 30); op = '+'; r = a + b; } else { a = 30 + Math.floor(Math.random() * 60); b = 5 + Math.floor(Math.random() * 25); op = '−'; r = a - b; } } while (r > 99 || r < 0);
  const w = numLetras(r); return { texto: `${a} ${op} ${b} = ?`, etiqueta: 'CUENTAS DE TRAMPILLA · EN LETRAS', celdas: arHuecos(w, 0), resp: w, modo: 'huecos', lee: `${a} ${op === '×' ? 'por' : op === '+' ? 'más' : 'menos'} ${b}` }; };
// ---- LA INTRUSA y EL PRECIO: motor de «Entre dos» con sus propias listas (3 y 2 opciones)
function e2Con(lista) { return async (a, e, t = {}) => { const bak = AR_DATOS.entredos; AR_DATOS.entredos = lista; arUsadas.e2 = new Set(); try { return await arEntreDos(a, e, t); } finally { AR_DATOS.entredos = bak; arUsadas.e2 = new Set(); } }; }
const LISTA_INTRUSA = V131.intrusa.map(([x, y, z, c]) => ({ q: '¿Cuál es la intrusa?', o: [x, y, z], c: 'LA INTRUSA · ' + c.toUpperCase() }));
const LISTA_PRECIO = V131.precio.map(([q, si, no]) => ({ q: q + ': ¿cuánto cuesta?', o: [si, no], c: 'EL PRECIO DE LA TRAMPILLA' }));
Object.assign(cu, {
  rosco: { ar: true, titulo: V131.titulos.rosco, lista: true, dicho: V131.dichos.rosco, jugar: async (a, e, t) => { roscoPon(); try { return await arDuelo(a, e, t, 'rosco'); } finally { setTimeout(roscoQuita, 1500); } } },
  memoria: { ar: true, titulo: V131.titulos.memoria, lista: true, dicho: V131.dichos.memoria, jugar: (a, e, t) => arDuelo(a, e, t, 'memoria') },
  cuentas: { ar: true, titulo: V131.titulos.cuentas, lista: true, dicho: V131.dichos.cuentas, jugar: (a, e, t) => arDuelo(a, e, t, 'cuentas') },
  intrusa: { ar: true, titulo: V131.titulos.intrusa, lista: true, dicho: V131.dichos.intrusa, jugar: e2Con(LISTA_INTRUSA) },
  precio: { ar: true, titulo: V131.titulos.precio, lista: true, dicho: V131.dichos.precio, jugar: e2Con(LISTA_PRECIO) },
});
AR_IDS.push(...P131); P128.push(...P131); cmdEnvuelve();
window.__v131 = { P131, roscoPon, roscoQuita, numLetras, arActivar: on => arActivar(on) };
