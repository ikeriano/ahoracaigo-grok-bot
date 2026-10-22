// ===================================================================================================
// v1.40 · «🔺 Pirámide» en Opciones (solo afecta a la etapa 2021+):
//  · «La clásica» (POR DEFECTO): pirámide y monedas originales de la 1.39 (÷2 y LO PIERDES TODO), imágenes y tablas intactas.
//  · «La nueva»: 100.000, ×5, Huella de oro, Doble comodín y +15 s en el Duelo Final (imágenes redibujadas, abajo).
// Se guarda en localStorage 'ac_piramide' ('clasica' | 'nueva'); pirNueva() está en src/etapas_datos.js.
// Las imágenes originales siguen en tools/manifest.json; con «La nueva» bf() devuelve estos disfraces redibujados.
// ===================================================================================================
const PIR140_IMG = {"Valores:2": {"n": "2", "f": "592f3fa88a0f90bdc3cd36c23b561433", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "Valores:3": {"n": "3", "f": "f1ee522b08f6fde8a2af0a47f242d737", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "Valores:6": {"n": "6", "f": "5aa1a5ce2ee8a58298c0b2c80ed360c3", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "Valores:7": {"n": "7", "f": "057f003e65ac1adedfdf8e618468fe88", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "Valores:10": {"n": "10", "f": "98aea26dbacfb4f71003de7c7f0b8c6f", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "Valores:11": {"n": "11", "f": "bbfc1eb68bbd7b98c6531f6651ef62b7", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "Painel:Placar1T": {"n": "Placar1T", "f": "e66b9dc8880fda11d88b81c7260eea81", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI1:1": {"n": "1", "f": "83233a244bbb4f3a9743a80ec1cf7bd0", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI2:1": {"n": "1", "f": "0374d05e94f84aec873630478275e1de", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI3:1": {"n": "1", "f": "561d29392dc8e89d88d8ab783265ee03", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI4:1": {"n": "1", "f": "0f138fcd7ea35ab7e88ab43e1f103ed2", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI5:1": {"n": "1", "f": "489da39ce91d72a3d298ce636ec83b68", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI6:1": {"n": "1", "f": "c8341518596b3281e95a9d9fd0de4986", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI7:1": {"n": "1", "f": "82abe1b31551381559ec33dfbf2b2e9e", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI8:1": {"n": "1", "f": "ae35cce925de909b67147736ac350919", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI9:1": {"n": "1", "f": "5ccf5de0e63ab832ddef227e6334b003", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}, "PlacarI10:1": {"n": "1", "f": "04c6d5761bae6ba1ce1624b1e1e99a42", "w": 960, "h": 720, "cx": 480.0, "cy": 360.0}};
{ const bf0 = bf; bf = function (a, e) { const o = bf0(a, e); return (o && pirNueva() && PIR140_IMG[a + ':' + o.n]) || o; }; }
function filaPiramide140() {
  const w = document.createElement('div'); w.className = 'ocustom'; w.id = 'optPiramide140';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🔺 Pirámide'; w.appendChild(lb);
  const st = document.createElement('style'); st.textContent = `#optPiramide140 .cab2{display:flex;gap:12px;flex-wrap:nowrap;margin:6px 0}#optPiramide140 .cabc{flex:1 1 0;min-width:0;border:3px solid #ffffff44;border-radius:16px;background:#0b1f70;color:#fff;padding:8px;cursor:pointer;text-align:center;font:800 15px system-ui}
#optPiramide140 .cabc img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:10px;margin-bottom:6px;background:#000}#optPiramide140 .cabc small{display:block;font:500 13px system-ui;opacity:.8;margin-top:2px}
#optPiramide140 .cabc.sel{border-color:#ffc21a;box-shadow:0 0 0 3px #ffc21a66;background:#1a3aa8}#optPiramide140 .cabc.sel:before{content:'✔ ';color:#ffc21a}#optPiramide140 .pnota{font:500 13px system-ui;opacity:.8;margin:2px 4px}`; w.appendChild(st);
  const g = document.createElement('div'); g.className = 'cab2';
  for (const [v, t, s, img] of [['clasica', 'La clásica', 'La pirámide de siempre: hasta 50.000, ×2, ÷2, comodín y LO PIERDES TODO', 'assets/pir140/pir_clasica.jpg'], ['nueva', 'La nueva', 'Hasta 100.000, ×5, Huella de oro, Doble comodín y +15 s en el Duelo Final', 'assets/pir140/pir_nueva.jpg']]) {
    const b = document.createElement('button'); b.className = 'cabc' + ((pirNueva() ? 'nueva' : 'clasica') === v ? ' sel' : ''); b.dataset.pir = v;
    b.innerHTML = `<img src="${img}" alt="">${t}${v === 'nueva' ? ' <span style="color:#ffc21a">(por defecto)</span>' : ''}<small>${s}</small>`;
    b.onclick = ev => { ev.stopPropagation(); try { F.play('Tecla'); } catch (e) { } localStorage.setItem('ac_piramide', v); g.querySelectorAll('.cabc').forEach(x => x.classList.toggle('sel', x === b)); try { Xe.setTheme(xf(Ms)); } catch (e) { } };
    g.appendChild(b); }
  w.appendChild(g);
  const n = document.createElement('div'); n.className = 'pnota'; n.textContent = 'Solo cambia la moneda de la etapa 2021-actual (y el entrenamiento de huellas). Las etapas clásicas no cambian.'; w.appendChild(n);
  return w; }
function pirMover140() { const m = document.getElementById('menu'); if (!m || !m.querySelector('h2') || m.querySelector('#optPiramide140')) return;
  const ref = m.querySelector('#optCabecera136'); const w = filaPiramide140();
  if (ref && ref.parentNode) ref.parentNode.insertBefore(w, ref.nextSibling); else { const h = m.querySelector('h2'); h.parentNode.insertBefore(w, h.nextSibling); } }
{ const lt0 = Lt; Lt = function (a, ...r) { const x = lt0.call(this, a, ...r); if (a === 'options') try { pirMover140(); } catch (e) { console.warn('pir140', e); } return x; }; }
window.__pir140 = { nueva: pirNueva, set: v => localStorage.setItem('ac_piramide', v) };
