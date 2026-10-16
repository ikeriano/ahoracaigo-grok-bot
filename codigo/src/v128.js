// ===================================================================================================
// v1.28 · TARTAZO + TRAMPILLAZO · CAÍDAS MEJORADAS · PRUEBAS NUEVAS · DUELO POR PAREJAS · ESPECIAL FIN DE AÑO
// Pruebas nuevas (mismo HUD que las pruebas del programa): ORDENA LA RESPUESTA (quien falla: tartazo y luego
// trampilla), VERDADERO O TRAMPILLA, LA FOTO BORROSA (se aclara con cada letra) y CADENA RÁPIDA.
// Se mezclan en el Programa completo (Opciones › «Pruebas nuevas») y se pueden probar sueltas.
// ===================================================================================================
const P128 = ['ordena', 'vot', 'borrosa', 'cadena', 'bomba', 'realidad'];
const op128 = (k, def = true) => { try { const v = localStorage.getItem(k); return v == null ? def : v === '1'; } catch (e) { return def; } };
// ---------------- sonidos sintetizados (sin grabaciones) ----------------
function sfx128(tipo) {
  try {
    const c = F.ctx, t0 = c.currentTime + 0.01, out = F.sfx;
    if (tipo === 'splat' || tipo === 'boom' || tipo === 'polvo') {
      const dur = tipo === 'boom' ? 1.2 : tipo === 'polvo' ? 0.6 : 0.35, b = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
      for (let k = 0; k < d.length; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / d.length, tipo === 'boom' ? 2 : 3);
      const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = tipo === 'splat' ? 900 : tipo === 'boom' ? 500 : 1800; const g = c.createGain(); g.gain.value = tipo === 'boom' ? 1 : 0.7;
      s.connect(f); f.connect(g); g.connect(out); s.start(t0);
      if (tipo === 'splat') { const o = c.createOscillator(), og = c.createGain(); o.frequency.setValueAtTime(320, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.18); og.gain.setValueAtTime(0.35, t0); og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2); o.connect(og); og.connect(out); o.start(t0); o.stop(t0 + 0.22); }
      return;
    }
    const notas = { silbido: [[1400, 500, 0.5]], campana: [[523, 523, 2.2], [1046, 1046, 1.6], [1570, 1570, 1]], cuarto: [[1318, 1318, 0.7], [988, 988, 0.6]], tic: [[1800, 1800, 0.05]], ding: [[1568, 1568, 0.35]], buzzer: [[880, 1320, 0.12], [1320, 990, 0.18]] }[tipo] || [];
    for (const [a, z, dur] of notas) { const o = c.createOscillator(), g = c.createGain(); o.type = tipo === 'silbido' ? 'triangle' : tipo === 'buzzer' ? 'square' : 'sine'; o.frequency.setValueAtTime(a, t0); o.frequency.exponentialRampToValueAtTime(z, t0 + dur * 0.9); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(tipo === 'tic' ? 0.25 : 0.3, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dur + 0.05); }
  } catch (e) { }
}
// ---------------- TARTAZO: pastel de dibujos animados en toda la cara ----------------
function cabezaPos(fig) { const w = new P(); if (fig.head && fig.head.getWorldPosition) fig.head.getWorldPosition(w); else w.copy(fig.root.position).setY(fig.root.position.y + 1.62); if (w.y - fig.root.position.y < 0.8) w.y = fig.root.position.y + 1.62; return w; }
function frente128(fig) { const d = new P(); fig.root.getWorldDirection(d); d.y = 0; return d.lengthSq() > 0.01 ? d.normalize().negate() : $t(0, 0, 1); } // los muñecos miran hacia su -Z local
function splatPon(fig, sp, hp, fr) { const w = hp.clone().addScaledVector(fr, 0.17); fig.root.add(sp); fig.root.updateMatrixWorld(true); sp.position.copy(fig.root.worldToLocal(w)); const look = w.clone().add(fr); sp.lookAt(look); }
function tartaMesh() {
  const T = _E, g = new T.Group();
  const lata = new T.Mesh(new T.CylinderGeometry(0.17, 0.13, 0.06, 18), new T.MeshLambertMaterial({ color: 0xd8a040, emissive: 0x3a2000 }));
  const nata = new T.Mesh(new T.SphereGeometry(0.17, 14, 8), new T.MeshLambertMaterial({ color: 0xfffaf0, emissive: 0x404038 })); nata.scale.set(1, 0.45, 1); nata.position.y = 0.05;
  const fresa = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), new T.MeshLambertMaterial({ color: 0xff2a3a, emissive: 0x400000 })); fresa.position.y = 0.12;
  g.add(lata, nata, fresa); return g;
}
function nataSplat(hollin) {
  const T = _E, g = new T.Group(), m = new T.MeshLambertMaterial(hollin ? { color: 0x1a1a1a, emissive: 0x050505 } : { color: 0xffffff, emissive: 0x9a9a92 });
  const disco = new T.Mesh(new T.SphereGeometry(0.14, 12, 8), m); disco.scale.set(1.15, 1.05, 0.35); g.add(disco);
  for (let k = 0; k < 7; k++) { const b = new T.Mesh(new T.SphereGeometry(0.03 + Math.random() * 0.04, 8, 6), m), a = k / 7 * Math.PI * 2; b.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.14 - (k % 3 === 0 ? 0.06 : 0), 0.02); g.add(b); }
  for (let k = 0; k < 3; k++) { const gota = new T.Mesh(new T.CylinderGeometry(0.018, 0.012, 0.12, 6), m); gota.position.set(-0.08 + k * 0.08, -0.2 - k % 2 * 0.04, 0.02); g.add(gota); }
  return g;
}
/** lanza un pastel a la cara de fig (desde quien lanza o desde un lado) · devuelve el pegote de nata */
async function tartazo(c, fig, opts = {}) {
  const { eng: e, hud: h, s } = c; mec('tartazo'); const T = _E;
  const hp = cabezaPos(fig), frente = frente128(fig);
  const lado = $t(frente.z, 0, -frente.x), desde = opts.desde ? cabezaPos(opts.desde) : hp.clone().addScaledVector(frente, 2.6).addScaledVector(lado, 1.4).setY(hp.y + 0.3);
  const camF = () => e.cut(hp.clone().addScaledVector(frente, 1.9).addScaledVector(lado, 0.9).setY(hp.y + 0.15), hp.clone().setY(hp.y - 0.1)); camF(); const camIv = setInterval(camF, 40); setTimeout(() => clearInterval(camIv), 2600);
  const pie = tartaMesh(); pie.position.copy(desde); e.scene.add(pie); sfx128('silbido');
  if (opts.desde) He(opts.desde, 'senala', 1.2);
  const fin = hp.clone().addScaledVector(frente, 0.16), t0 = performance.now(), DUR = 620;
  await s.until(() => { const k = Math.min(1, (performance.now() - t0) / DUR); pie.position.lerpVectors(desde, fin, k); pie.position.y += Math.sin(k * Math.PI) * 0.6; pie.rotation.set(Math.PI / 2 * k, 0, k * 6); pie.lookAt(hp); pie.rotateX(Math.PI / 2); return k >= 1; });
  e.scene.remove(pie); pie.traverse(o => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); });
  const sp = nataSplat(); splatPon(fig, sp, hp, frente); window.__est128 = 'tartazo'; sfx128('splat');
  try { ea(e.studio, fin, [16775408, 16777215, 16767700]); } catch (x) { } try { e.shake = Math.max(e.shake || 0, 0.25); } catch (x) { }
  He(fig, 'lamenta', 2); ze.risas(); setTimeout(() => ze.aplauso(1.6, 0.5), 500); if (h.toast) h.toast('🥧 ¡TARTAZO!', 1300);
  if (opts.frase !== false) { let ok = false; h.say(opts.frase || V128.tartazo[Math.floor(Math.random() * V128.tartazo.length)], 2400).then(() => ok = true); await s.until(() => ok); } else await s.w(1200);
  setTimeout(() => { try { fig.root.remove(sp); sp.traverse(o => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); }); } catch (x) { } }, opts.dura || 9000);
  return sp;
}
// ---------------- CAÍDAS MEJORADAS: temblor de cámara, polvo, destello y cámara lenta opcional ----------------
const SLOW = { k: 1, hasta: 0 };
{
  const f0 = y2.prototype.fall;
  y2.prototype.fall = function (fig, idx) {
    const r = f0.call(this, fig, idx);
    if (op128('ac_caidas128')) try {
      const hole = this.studio.holes[idx], pos = hole ? hole.pos.clone() : fig.root.position.clone(); this.shake = Math.max(this.shake || 0, 0.9);
      ea(this.studio, pos.clone().setY(pos.y + 0.2), [13684912, 16777215, 11577488, 16765498]); sfx128('polvo');
      const fl = document.createElement('div'); fl.style.cssText = 'position:fixed;inset:0;z-index:38;pointer-events:none;background:radial-gradient(circle at 50% 60%,#fff 0%,#fff8 30%,#fff0 70%);opacity:.85;transition:opacity .5s'; document.body.appendChild(fl); requestAnimationFrame(() => requestAnimationFrame(() => fl.style.opacity = '0')); setTimeout(() => fl.remove(), 650);
      if (op128('ac_lenta128', false)) { SLOW.k = 0.35; SLOW.hasta = performance.now() + 1400; }
      window.__est128 = 'caida'; if (PAR.fig && fig === this.player) parCae();
    } catch (x) { console.warn('caida128', x); }
    return r;
  };
  const t0 = y2.prototype.tick;
  y2.prototype.tick = function () {
    if (!this.__slow128) { this.__slow128 = 1; const g = this.clock.getDelta.bind(this.clock); this.clock.getDelta = () => { const d = g(); if (SLOW.k !== 1 && performance.now() > SLOW.hasta) SLOW.k = 1; return d * SLOW.k; }; }
    return t0.call(this);
  };
}
// ---------------- PRUEBAS NUEVAS (motor de duelo de las pruebas del programa) ----------------
const C128 = { ult: '' };
AR_GEN.ordena = () => { const p = arSaca(V128.ordena, 'ord128'); return { texto: p[0], etiqueta: 'ORDENA LA RESPUESTA', fichas: arMezcla([...arLetras(p[1])]), resp: p[1], modo: 'orden', unidad: 'letra' }; };
AR_GEN.borrosa = () => { const p = arSaca(V128.borrosa, 'bor128'); return { texto: '', etiqueta: 'LA FOTO BORROSA', img: { ...p, blur: 26 }, celdas: arHuecos(p.r, 1), resp: p.r, modo: 'huecos', lee: 'La foto borrosa. Pista: ' + p.l }; };
AR_GEN.cadena = () => {
  const L = V128.cadena, u = C128.ult; let cand = L.filter(x => u && arLetras(x[1])[0] === u && x[1] !== C128.prev); if (!cand.length) cand = L.filter(x => x[1] !== C128.prev);
  const p = cand[Math.floor(Math.random() * cand.length)]; C128.prev = p[1]; const w = arLetras(p[1]); C128.ult = w[w.length - 1];
  const c = arHuecos(p[1], 2); c[0] = { l: w[0], fija: true, sol: w[0], y: true };
  return { texto: p[0], etiqueta: u ? 'CADENA RÁPIDA · EMPIEZA POR ' + w[0] : 'CADENA RÁPIDA', celdas: c, resp: p[1], modo: 'huecos' };
};
{ const d0 = arDibujaImagen; arDibujaImagen = function (it, w, h) { const c = d0(it, w, h); if (!it.blur) return c; const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; const g = o.getContext('2d'); g.filter = `blur(${it.blur}px)`; g.drawImage(c, 0, 0); it.blur = Math.max(0, it.blur - 4); return o; }; }
{ const c0 = arCss; arCss = function () { c0(); if (document.getElementById('arCss128')) return; const src = document.getElementById('arCss').textContent, st = document.createElement('style'); st.id = 'arCss128'; st.textContent = src.split('}').filter(r => r.includes('#arP.ves')).map(r => r.replace(/#arP\.ves/g, '#arP.borrosa') + '}').join('\n'); document.head.appendChild(st); }; }
Object.assign(cu, {
  ordena: { ar: true, titulo: V128.titulos.ordena, lista: true, dicho: V128.dichos.ordena, jugar: async (a, e, t = {}) => {
    const r = await arDuelo(a, e, t, 'ordena');
    try { if (r === 'lose' || r === 'win') { const n = a.c, fig = r === 'lose' ? n.eng.player : n.eng.opps[e - 1]; await tartazo(n, fig, { dura: 7000 }); } } catch (x) { if (x === _o) throw x; console.warn('tartazo', x); }
    return r; } },
  vot: { ar: true, titulo: V128.titulos.vot, lista: true, dicho: V128.dichos.vot, jugar: async (a, e, t = {}) => {
    const bak = AR_DATOS.entredos; AR_DATOS.entredos = V128.vot.map(([q, v]) => ({ q, o: v ? ['VERDADERO', 'FALSO'] : ['FALSO', 'VERDADERO'], c: 'VERDADERO O TRAMPILLA' })); arUsadas.e2 = new Set();
    try { return await arEntreDos(a, e, t); } finally { AR_DATOS.entredos = bak; arUsadas.e2 = new Set(); } } },
  borrosa: { ar: true, titulo: V128.titulos.borrosa, lista: true, dicho: V128.dichos.borrosa, jugar: (a, e, t) => arDuelo(a, e, t, 'borrosa') },
  cadena: { ar: true, titulo: V128.titulos.cadena, lista: true, dicho: V128.dichos.cadena, jugar: (a, e, t) => { C128.ult = ''; return arDuelo(a, e, t, 'cadena'); } },
});
{ const pt = planTodas; planTodas = function (g, N) { const n = pt(g, N), on = mA(P128.filter(x => op128('ac_p128_' + x))); if (!on.length) return n; // 2 huecos intermedios pasan a ser pruebas nuevas
  const huecos = mA(n.map((x, k) => k).filter(k => k > 0 && k < n.length - 1 && x !== 'gallina')).slice(0, Math.min(2, on.length)); huecos.forEach((k, j) => n[k] = on[j]); return n; }; }

// PASA LA BOMBA: duelo con mecha encendida; al que pierde le explota (cara de carbón) y luego trampilla
AR_GEN.bomba = () => { const L = Math.random() < 0.5 ? V128.ordena : V128.cadena, p = L[Math.floor(Math.random() * L.length)]; return { texto: p[0], etiqueta: '💣 PASA LA BOMBA', celdas: arHuecos(p[1], Math.random() < 0.5 ? 0 : 1), resp: p[1], modo: 'huecos' }; };
async function bombaBoom(c, fig) {
  const { eng: e, hud: h, s } = c, hp = cabezaPos(fig), fr = frente128(fig); mec('bomba explota');
  const camF = () => e.cut(hp.clone().addScaledVector(fr, 2.2).setY(hp.y + 0.2), hp.clone().setY(hp.y - 0.2)); camF(); const camIv = setInterval(camF, 40); setTimeout(() => clearInterval(camIv), 2200); await s.w(300);
  sfx128('boom'); e.shake = Math.max(e.shake || 0, 0.8); try { ea(e.studio, hp, [16737792, 16776960, 3355443, 16777215]); } catch (x) { }
  const fl = document.createElement('div'); fl.style.cssText = 'position:fixed;inset:0;z-index:38;pointer-events:none;background:radial-gradient(circle,#fff 0%,#ffb030 35%,#ff400000 75%);opacity:1;transition:opacity .7s'; document.body.appendChild(fl); requestAnimationFrame(() => requestAnimationFrame(() => fl.style.opacity = '0')); setTimeout(() => fl.remove(), 800);
  const sp = nataSplat(true); splatPon(fig, sp, hp, fr); window.__est128 = 'bomba'; He(fig, 'lamenta', 2); ze.risas(); h.toast && h.toast('💥 ¡BOOM!', 1300);
  let ok = false; h.say(V128.bomba.lineas[Math.floor(Math.random() * V128.bomba.lineas.length)], 2400).then(() => ok = true); await s.until(() => ok);
  setTimeout(() => { try { fig.root.remove(sp); } catch (x) { } }, 7000);
}
function bombaMecha() { const d = document.createElement('div'); d.id = 'bomba128'; d.innerHTML = '💣<i></i>'; d.style.cssText = 'position:fixed;left:12px;top:30%;z-index:44;font-size:56px;pointer-events:none;filter:drop-shadow(0 0 10px #f80);animation:bomba128 .5s infinite alternate'; const st = document.createElement('style'); st.textContent = '@keyframes bomba128{from{transform:scale(1) rotate(-8deg)}to{transform:scale(1.15) rotate(8deg)}}'; d.appendChild(st); document.body.appendChild(d); const iv = setInterval(() => sfx128('tic'), 1000); return () => { clearInterval(iv); d.remove(); }; }
Object.assign(cu, {
  bomba: { ar: true, titulo: V128.titulos.bomba, lista: true, dicho: V128.dichos.bomba, jugar: async (a, e, t = {}) => {
    const quita = bombaMecha(); let r; try { r = await arDuelo(a, e, t, 'bomba'); } finally { quita(); }
    try { if (r === 'lose' || r === 'win') { const n = a.c; await bombaBoom(n, r === 'lose' ? n.eng.player : n.eng.opps[e - 1]); } } catch (x) { if (x === _o) throw x; console.warn('bomba', x); }
    return r; } },
  realidad: { ar: true, titulo: V128.titulos.realidad, lista: true, dicho: V128.dichos.realidad, jugar: async (a, e, t = {}) => {
    const bak = AR_DATOS.entredos; AR_DATOS.entredos = V128.realidad.map(([q, v]) => ({ q, o: v ? ['REALIDAD', 'FICCIÓN'] : ['FICCIÓN', 'REALIDAD'], c: 'REALIDAD O FICCIÓN' })); arUsadas.e2 = new Set();
    try { return await arEntreDos(a, e, t); } finally { AR_DATOS.entredos = bak; arUsadas.e2 = new Set(); } } },
});
AR_IDS.push(...P128); cmdEnvuelve();
// Entrenamiento: las pruebas nuevas, seleccionables para practicar (debajo de las de siempre)
{ const lt = Lt; Lt = function (a = 'main', ...r) { const x = lt.call(this, a, ...r); try { if (a === 'train' && !Ke.__AR) { const m = document.getElementById('menu'), back = m && m.querySelector('.tbtn.back'); if (m && back && !m.querySelector('#train128')) { const h = Pa('🆕 Pruebas nuevas'); h.id = 'train128'; const D = { ordena: 'Letras mezcladas · quien falla: tartazo', vot: '¿Verdadero o falso? Cinco segundos', borrosa: 'La foto se aclara con cada letra', cadena: 'Cada respuesta empieza por la última letra', bomba: 'Responde y pasa la bomba antes de que explote', realidad: 'Curiosidades: ¿realidad o ficción?' }; (back.closest('.mrow') || back).before(h, ...P128.map(id => ei(V128.titulos[id].charAt(0) + V128.titulos[id].slice(1).toLowerCase(), D[id], id === 'ordena' ? 'gold' : '', () => ii('entrenamiento', id)))); } } } catch (e) { console.warn('train128', e); } return x; }; }
// ---------------- DUELO POR PAREJAS ----------------
const PAR = { fig: null, iv: null, d: null, usada: false, btn: null };
function parQuita() { clearInterval(PAR.iv); PAR.iv = null; try { PAR.fig && Xe.scene.remove(PAR.fig.root); } catch (x) { } PAR.fig = null; PAR.btn && PAR.btn.remove(); PAR.btn = null; }
async function parHabla(c, k) { if (!PAR.fig) return; const t = PAR.d[4][k]; He(PAR.fig, k === 3 ? 'lamenta' : 'habla', 2); c.hud.say(t, 1e5, PAR.fig.head, PAR.d[0] + ' · tu pareja', { voice: false }); try { await stHabla(PAR.d[2], t, c.s); } finally { c.hud.hideBubble(); } }
function parCae() { const f = PAR.fig; if (!f) return; const y0 = f.root.position.y, t0 = performance.now(); clearInterval(PAR.iv); PAR.iv = null; const iv = setInterval(() => { const k = (performance.now() - t0) / 900; f.root.position.y = y0 - k * k * 4; if (k >= 1) { clearInterval(iv); f.root.visible = false; } }, 30); }
async function parEntra(c) {
  parQuita(); const { eng: e, hud: h, s } = c; PAR.d = PAREJAS[Math.floor(Math.random() * PAREJAS.length)]; mec('pareja ' + PAR.d[0]);
  const fig = Rm({ shirt: PAR.d[3], p3d: { seed: 'pareja-' + PAR.d[0], g: PAR.d[1] } }); e.scene.add(fig.root); PAR.fig = fig;
  const off = $t(0.75, 0, 0.1); PAR.iv = setInterval(() => { if (!s.alive || !PAR.fig) return parQuita(); const p = e.player.root.position; fig.root.visible = e.player.root.visible; fig.root.position.set(p.x + off.x, p.y, p.z + off.z); fig.root.rotation.y = e.player.root.rotation.y; }, 120);
  const btn = PAR.btn = document.createElement('button'); btn.id = 'par128'; btn.className = 'tbtn gold'; btn.textContent = '🤝 Pista de ' + PAR.d[0]; btn.style.cssText = 'position:fixed;right:12px;top:30%;z-index:45;display:none;font-weight:800';
  btn.onclick = async ev => { ev.stopPropagation(); const A = window.__cmdApi, x = A && A.ctx; if (!x || PAR.usada) return; x.mano.includes('letra') || x.mano.push('letra'); if (A.usa('letra')) { PAR.usada = true; btn.style.display = 'none'; F.play('Tecla'); parHabla(c, 1).catch(() => { }); } else h.toast('Ahora no se puede: espera a tu turno', 1500); };
  document.body.appendChild(btn);
  const viga = setInterval(() => { if (!PAR.btn) return clearInterval(viga); const x = window.__cmdApi && window.__cmdApi.ctx; PAR.btn.style.display = x && !PAR.usada && !x.t.training ? '' : 'none'; }, 300);
  Ot.wide(e, 1); let ok = false; h.say(V128.parejas.intro, 4000).then(() => ok = true); await s.until(() => ok); h.toast('🤝 Duelo por parejas: juegas con ' + PAR.d[0], 2600); await parHabla(c, 0);
}
// ---------------- ESPECIAL FIN DE AÑO: cuartos, 12 campanadas con sus uvas y cuenta atrás con confeti ----------------
async function finDeAno(c) {
  const { eng: e, hud: h, s } = c; mec('fin de año campanadas');
  const d = document.createElement('div'); d.id = 'fda128'; d.innerHTML = '<div class="rel">23:59:45</div><div class="num"></div><div class="uvas">' + '<i>🍇</i>'.repeat(12) + '</div><div class="msg"></div>';
  const st = document.createElement('style'); st.textContent = `#fda128{position:fixed;inset:0;z-index:41;pointer-events:none;font-family:Montserrat,'Arial Black',system-ui,sans-serif;text-align:center}
#fda128 .rel{position:absolute;top:6%;left:50%;transform:translateX(-50%);padding:.2em .8em;border-radius:.4em;background:linear-gradient(180deg,#ffe28a,#c9a227);color:#2a1a00;font-weight:900;font-size:min(7vw,46px);box-shadow:0 6px 18px #000a}
#fda128 .num{position:absolute;top:22%;left:0;right:0;color:#fff;font-weight:900;font-size:min(30vw,190px);text-shadow:0 0 30px #ffd23a,0 6px 0 #a07000}
#fda128 .num.pum{animation:fdaPum .5s ease-out}@keyframes fdaPum{from{transform:scale(1.6);opacity:.2}to{transform:scale(1);opacity:1}}
#fda128 .uvas{position:absolute;bottom:6%;left:0;right:0;font-size:min(6vw,40px);letter-spacing:.1em}#fda128 .uvas i{font-style:normal;display:inline-block;transition:transform .3s,opacity .3s}#fda128 .uvas i.comida{transform:scale(0);opacity:0}
#fda128 .msg{position:absolute;top:38%;left:0;right:0;color:#ffe28a;font-weight:900;font-size:min(9vw,64px);text-shadow:0 4px 0 #6a4a00,0 0 30px #fff8;opacity:0;transition:opacity .4s}#fda128 .msg.on{opacity:1;animation:fdaPum .6s}`;
  d.appendChild(st); document.body.appendChild(d);
  try {
    const sf = e.studio.screenFocus; if (sf) { e.cut($t(0, sf.y - 0.4, sf.z + 9), $t(0, sf.y, sf.z)); e.glide($t(0, sf.y - 0.2, sf.z + 6.5), $t(0, sf.y, sf.z), 6); }
    let ok = false; h.say(V128.findeano.intro, 4500).then(() => ok = true); await s.until(() => ok);
    const rel = d.querySelector('.rel'), num = d.querySelector('.num'), uvas = d.querySelectorAll('.uvas i'), msg = d.querySelector('.msg');
    for (let k = 0; k < 4; k++) { rel.textContent = '23:59:' + (48 + k * 3); sfx128('cuarto'); await s.w(700); }
    rel.textContent = '23:59:59'; await s.w(500);
    for (let k = 1; k <= 12; k++) {
      sfx128('campana'); num.textContent = String(13 - k); num.classList.remove('pum'); void num.offsetWidth; num.classList.add('pum'); uvas[k - 1].classList.add('comida');
      try { e.lights && e.lights.event(k % 2 ? 'intro' : 'caida'); } catch (x) { } if (k === 12) rel.textContent = '00:00:00';
      await s.w(950);
    }
    num.textContent = ''; msg.textContent = '¡FELIZ AÑO NUEVO!'; msg.classList.add('on'); ze.ovacion(6); ze.vitores(4);
    try { e.lights && e.lights.event('ganador'); } catch (x) { } e.startOrbit($t(0, Ae, 0), 8, 3.4, 0, 0.3, 1.4);
    const cols = [16769162, 16777215, 16724016, 3787007, 16732120];
    for (let k = 0; k < 5; k++) { ea(e.studio, $t((Math.random() - 0.5) * 7, Ae + 2 + Math.random() * 2, (Math.random() - 0.5) * 5), cols); await s.w(400); }
    ok = false; h.say(V128.findeano.feliz, 4000).then(() => ok = true); await s.until(() => ok);
  } finally { d.remove(); Ot.wide(e, 0.8); }
}
{ // enganches al empezar el programa
  const ce = coproEntra;
  coproEntra = async function (c) {
    const th = c.eng.theme && c.eng.theme.id;
    if (th === 'findeano' && op128('ac_fda128') && !window.__noFda) try { await finDeAno(c); } catch (x) { if (x === _o) throw x; console.warn('fda', x); }
    const r = await ce(c);
    if (op128('ac_parejas128', false) && !Ke.__AR) try { await parEntra(c); } catch (x) { if (x === _o) throw x; console.warn('parejas', x); }
    return r;
  };
  const cm = coproMomento; coproMomento = async function (c, k, ...r) { if (k === 'duelo' && PAR.fig) { PAR.usada = false; if (Math.random() < 0.4) { let ok = false; c.hud.say(V128.parejas.duelo[Math.floor(Math.random() * 2)], 2600).then(() => ok = true); await c.s.until(() => ok); } } return cm.call(this, c, k, ...r); };
  const cd = coproDespide; coproDespide = async function (c, res) { try { if (PAR.fig && res !== 'perdido') await parHabla(c, 2); } catch (x) { if (x === _o) throw x; } parQuita(); return cd.call(this, c, res); };
}
// ---------------- Opciones ----------------
function filaV128() {
  const box = document.createElement('div'); box.className = 'ocustom'; box.id = 'opt128';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🆕 Pruebas nuevas en el Programa completo'; box.appendChild(lb);
  const fila = (k, txt, def, extra) => { const r = document.createElement('div'); r.className = 'orow'; const l = document.createElement('label'); l.textContent = txt; r.appendChild(l);
    for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((op128(k, def) ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem(k, v); r.querySelectorAll('button[data-v]').forEach(x => x.classList.toggle('sel', x === b)); }; b.dataset.v = v; r.appendChild(b); }
    if (extra) r.appendChild(extra); box.appendChild(r); };
  for (const id of P128) { const pr = document.createElement('button'); pr.className = 'tbtn'; pr.textContent = '▶ Probar'; pr.dataset.probar = id; pr.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); ii('entrenamiento', id); }; fila('ac_p128_' + id, ({ ordena: '🥧 ', vot: '✅ ', borrosa: '🌫️ ', cadena: '⛓️ ', bomba: '💣 ', realidad: '🔮 ' }[id]) + V128.titulos[id], true, pr); }
  const l2 = document.createElement('div'); l2.className = 'olabel'; l2.textContent = '🎬 Más opciones del programa'; box.appendChild(l2);
  fila('ac_parejas128', '🤝 Duelo por parejas (juegas con un compañero en la trampilla)', false);
  fila('ac_caidas128', '💥 Caídas espectaculares (temblor, polvo y destello)', true);
  fila('ac_lenta128', '🐢 Cámara lenta en las caídas', false);
  fila('ac_fda128', '🥂 Campanadas y uvas en el Especial Fin de Año', true);
  const n = document.createElement('p'); n.className = 'onote small'; n.textContent = 'En «Ordena la respuesta» quien falla se lleva un tartazo… y luego trampillazo. Las pruebas nuevas usan el mismo panel que las del programa.'; box.appendChild(n);
  return box;
}
{ const fc = filaCopro; filaCopro = function () { const d = fc(); d.prepend(filaV128()); return d; }; }
window.__v128 = { tartazo, finDeAno, parEntra, P128 };
window.__q128 = { V128, PAREJAS, Ao, vc };
