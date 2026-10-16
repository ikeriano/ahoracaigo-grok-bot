// ===================================================================================================
// v1.26 · PRESENTADORES NUEVOS + MOMENTOS DE CÁMARA + EFECTOS DE ESPECIALES
// · Opciones › «🎤 Presentador del programa»: Adrián Vega (de siempre) o Marga Solano, Bruno Velarde, Rita Montes,
//   Quique Robledo (personas inventadas, voces Piper es_ES con ajustes distintos). El modo Argentina sigue con Tano.
// · Opciones › «🎬 Momentos de cámara»: entrada del concursante, reacción del público, detrás de las cámaras
//   y celebración del bote.  · «❄️ Efectos de especiales»: nieve en Navidad/Nochebuena, fantasmas en Halloween.
// ===================================================================================================
const PRES = { act: null, ntBase: null };
const presId = () => { try { return localStorage.getItem('ac_pres') || 'adrian'; } catch (e) { return 'adrian'; } };
const momOn = () => { try { return localStorage.getItem('ac_momentos') !== '0'; } catch (e) { return true; } };
const efxOn = () => { try { return localStorage.getItem('ac_efx_esp') !== '0'; } catch (e) { return true; } };
const presActivo = () => (!Ke.__AR && PRES.act) || null;
function presAplicar() {
  const g = PRES_DATOS.find(x => x.id === presId()) || null;
  if (Ke.__AR) { PRES.act = g; return; } // en el modo Argentina manda Tano: se aplica al salir
  if (!PRES.ntBase) { PRES.ntBase = {}; for (const k in PRES_DATOS[0].nt) PRES.ntBase[k] = Nt[k]; }
  for (const k in PRES.ntBase) Nt[k] = g ? g.nt[k] : PRES.ntBase[k];
  PRES.act = g;
}
{ // nombre en bocadillos, rótulos y créditos (salvo nombre propio escrito por Iker o modo Argentina)
  const dp = Object.getOwnPropertyDescriptor(me, 'presentador');
  Object.defineProperty(me, 'presentador', { configurable: true, enumerable: true, get() { const p = presActivo(); return p && !me.presentadorPropio ? p.nombre : dp.get.call(me); } });
}
{ // la voz: las frases del presentador nuevo suenan con SU voz Piper; si una frase no tiene audio, solo bocadillo
  const sy0 = S2.prototype.say;
  S2.prototype.say = function (e, t, n, i, s = {}) {
    const p = presActivo();
    if (p && (i === undefined || i === me.presentador) && s.voice !== false && !s.voz) {
      const th = (Xe && Xe.theme) || {}; if (e === th.saludo) e = presSaludo(p, th);
      s = { ...s, voz: p.vk, audio: [e], tts: false };
    }
    return sy0.call(this, e, t, n, i, s);
  };
}
function presSaludo(p, th) { const id = th.id || 'normal'; return id === 'halloween' ? p.saludo.halloween : /navidad|nochebuena/.test(id) ? p.saludo.navidad : id === 'normal' ? p.saludo.normal : p.saludo.especial; }
{ // aspecto: otra persona en el atril (personaje inventado), con su ropa
  const e20 = e2;
  e2 = function (a) {
    const p = presActivo(); if (!p) return e20(a);
    if (p3dOn() && typeof p3dRB === 'function') { try { return p3dRBapi().persona({ seed: 'pres-' + p.id, g: p.g, mic: true }); } catch (x) { } }
    if (p3dOn()) { try { return p3dApi().persona({ seed: 'pres-' + p.id, g: p.g, prenda: 'americana', traje: p.look.suit, camisa: p.look.shirt, corbata: p.look.bowtie ? null : p.look.tie, gafas: !!p.look.glasses, mic: true }); } catch (x) { } }
    return e20({ ...a, ...p.look });
  };
}
async function presDice(c, txt, gesto = 'habla', ms = 3000) { if (!txt) return; const { eng: e, hud: h, s } = c; He(e.host, gesto, 2.2); let fin = false; h.say(txt, ms).then(() => fin = true); await s.until(() => fin); }
const presLinea = (p, k) => { const L = p[k]; if (!L || !L.length) return null; PRES.i = (PRES.i || 0) + 1; return L[(PRES.i + Math.floor(Math.random() * L.length)) % L.length]; };
// ---------------- momentos de cámara ----------------
function rotuloTV(txt, sub = '', cls = '') {
  let d = document.getElementById('rot126'); if (!d) { d = document.createElement('div'); d.id = 'rot126'; document.body.appendChild(d);
    const st = document.createElement('style'); st.textContent = `#rot126{position:fixed;left:0;right:0;top:9%;z-index:40;text-align:center;pointer-events:none;opacity:0;transition:opacity .35s;font-family:Montserrat,'Arial Black',system-ui,sans-serif}
#rot126.on{opacity:1}#rot126 b{display:inline-block;padding:.3em .9em;border-radius:.5em;background:linear-gradient(180deg,#ffe25a,#f0a010);color:#2a1200;font-weight:900;font-size:min(6vw,44px);box-shadow:0 6px 18px #0008;text-shadow:0 1px 0 #fff8}
#rot126 i{display:block;margin-top:.4em;color:#fff;font-style:normal;font-weight:700;font-size:min(3.4vw,22px);text-shadow:0 2px 6px #000}
#rot126.rec b{background:#000a;color:#fff;font-size:min(4vw,28px);letter-spacing:.08em}#rot126.rec b:before{content:'● ';color:#ff2a2a}
#bs126{position:fixed;inset:0;z-index:39;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 3px,#0002 3px 4px);box-shadow:inset 0 0 18vmin #000c;filter:none}`; document.head.appendChild(st); }
  d.className = cls; d.innerHTML = `<b></b>${sub ? '<i></i>' : ''}`; d.querySelector('b').textContent = txt; sub && (d.querySelector('i').textContent = sub);
  requestAnimationFrame(() => d.classList.add('on'));
  return () => d.classList.remove('on');
}
async function momEntrada(c) { // entrada del concursante: grúa desde arriba hasta su cara, foco y aplausos
  const { eng: e, s } = c, p = e.player.root.position; mec('momento entrada');
  const quita = rotuloTV('¡Entra el concursante!', me.central || '');
  e.cut($t(p.x + 3.5, p.y + 4.2, p.z + 5.5), $t(p.x, p.y + 1, p.z)); await s.w(60); e.glide($t(p.x + 0.9, p.y + 1.7, p.z + 2.6), $t(p.x, p.y + 1.25, p.z), 2.4);
  He(e.player, 'saluda', 2.5); ze.aplauso(3.5, 0.8); ze.vitores(2.5); try { e.lights && e.lights.event('intro'); } catch (x) { }
  await s.w(2700); He(e.player, 'arriba', 1.6); await s.w(900); quita(); Ot.wide(e, 0.8);
}
async function momPublico(c) { // la grada reacciona: plano de las gradas desde el centro del plató
  const { eng: e, s } = c; if (!e.audience) return; mec('momento publico');
  const bx = new _E.Box3().setFromObject(e.audience.root); if (bx.isEmpty()) return; const ce = bx.getCenter(new P());
  const lado = Math.random() < 0.5 ? -1 : 1, obj = $t(ce.x + lado * Math.min(6, (bx.max.x - bx.min.x) * 0.25), Math.max(Ae + 1.5, ce.y), ce.z);
  const quita = rotuloTV('¡El público opina!', ESC126.publico[Math.floor(Math.random() * ESC126.publico.length)]);
  e.cut($t(lado * -1.5, Ae + 2.2, 2), obj); e.glide($t(lado * 0.5, Ae + 2.6, 3), obj.clone().add($t(lado * 4, 0, 0)), 2.4);
  ze.ooh(); ze.aplauso(2.4, 0.7); await s.w(2500); quita(); Ot.wide(e, 0.8);
}
async function momBackstage(c) { // detrás de las cámaras: plano de vídeo «making-of» con el equipo antes del juego final
  const { eng: e, hud: h, s } = c; mec('momento backstage');
  const lin = ESC126.backstage[Math.floor(Math.random() * ESC126.backstage.length)];
  const veil = document.createElement('div'); veil.id = 'bs126'; document.body.appendChild(veil);
  const quita = rotuloTV('DETRÁS DE LAS CÁMARAS', lin[1], 'rec');
  const hp = e.host.root.position;
  e.cut($t(hp.x + 4.2, Ae + 0.9, hp.z + 3.8), $t(hp.x, Ae + 1.2, hp.z)); e.glide($t(hp.x + 2.6, Ae + 1.3, hp.z + 3.2), $t(hp.x - 1, Ae + 1.1, hp.z - 0.5), 3.2);
  try { h.say(lin[2], 1e5, null, lin[1], { voice: false }); await stHabla(lin[0], lin[2], s); } finally { h.hideBubble(); quita(); veil.remove(); } Ot.wide(e, 0.6);
}
async function momBote(c) { // celebración del bote: confeti a tandas, órbita de cámara, rótulo y ovación
  const { eng: e, s } = c; mec('momento bote');
  const th = (e.theme && e.theme.id) || '', cols = th === 'halloween' ? [16742936, 10173695, 3866624] : /navidad|nochebuena/.test(th) ? [16724016, 3129162, 16777215] : undefined;
  const quita = rotuloTV('¡BOTE CONSEGUIDO!', `${Uo(c.a ? c.a.placar : 0)} puntos`);
  try { e.lights && e.lights.event('ganador'); } catch (x) { }
  e.startOrbit($t(0, Ae, 0), 7.5, 3.2, 0, 0.35, 1.2); ze.ovacion(6); He(e.player, 'arriba', 4); He(e.host, 'aplaude', 4);
  for (let k = 0; k < 4; k++) { ea(e.studio, $t((Math.random() - 0.5) * 6, Ae + 2 + Math.random() * 2, (Math.random() - 0.5) * 4), cols); await s.w(650); }
  await s.w(1200); quita();
}
// ---------------- enganches en el Programa completo ----------------
{
  const ce = coproEntra, cm = coproMomento, cd = coproDespide;
  coproEntra = async function (c) {
    if (momOn() && !window.__noMomentos) try { await momEntrada(c); } catch (x) { if (x === _o) throw x; console.warn('entrada', x); }
    const p = presActivo(); if (!p) return ce(c);
    coproQuita(); mec('presentador ' + p.id); PRES.i = 0;
    Ot.wide(c.eng, 1); for (const t of p.intro) await presDice(c, t, 'saluda'); ze.aplauso(2.2, 0.6); return false;
  };
  coproMomento = async function (c, clave, vars = {}, prob = 1) {
    try {
      if (momOn() && !window.__noMomentos) { if (clave === 'final') await momBackstage(c); else if ((clave === 'duelo' || clave === 'decision') && Math.random() < 0.35) await momPublico(c); }
    } catch (x) { if (x === _o) throw x; console.warn('momento', x); }
    const p = presActivo(); if (!p) return cm(c, clave, vars, prob);
    if (Math.random() > Math.max(0.55, prob * 0.7)) return; await presDice(c, presLinea(p, clave), clave === 'final' ? 'arriba' : 'senala');
  };
  coproDespide = async function (c, res) {
    if (res === 'ganado' && momOn() && !window.__noMomentos) try { await momBote(c); } catch (x) { if (x === _o) throw x; console.warn('bote', x); }
    const p = presActivo(); if (!p) return cd(c, res);
    Ot.wide(c.eng, 1); await presDice(c, presLinea(p, res === 'ganado' ? 'gana' : res === 'plantado' ? 'planta' : 'pierde'), res === 'ganado' ? 'arriba' : 'habla'); await presDice(c, presLinea(p, 'adios'), 'saluda'); ze.aplauso(3, 0.7);
  };
}
// el programa guarda el marcador en la instancia del juego (sy): lo dejamos a mano para el rótulo del bote
{ const r0 = sy.prototype.run; sy.prototype.run = function (...a) { this.c.a = this; return r0.apply(this, a); }; }
// el modo Argentina restaura las frases al salir: volvemos a poner las del presentador elegido
{ const a0 = arActivar; arActivar = function (on) { const r = a0(on); if (!on) presAplicar(); return r; }; }
// ---------------- efectos de especiales: nieve (Navidad/Nochebuena) y fantasmas (Halloween) ----------------
const EFX = { obj: null, iv: null };
function efxQuita() { clearInterval(EFX.iv); EFX.iv = null; if (EFX.obj) { try { EFX.obj.parent && EFX.obj.parent.remove(EFX.obj); EFX.obj.geometry.dispose(); EFX.obj.material.map && EFX.obj.material.map.dispose(); EFX.obj.material.dispose(); } catch (x) { } EFX.obj = null; } }
function efxPon(eng) {
  efxQuita(); const id = eng.theme && eng.theme.id; if (!efxOn() || !id) return;
  const nieve = /navidad|nochebuena/.test(id), fant = id === 'halloween'; if (!nieve && !fant) return;
  const T = _E, N = nieve ? (it.quality === 'baja' ? 160 : 320) : 14, pos = new Float32Array(N * 3), vel = new Float32Array(N);
  for (let k = 0; k < N; k++) { pos.set([(Math.random() - 0.5) * 26, Math.random() * 12, (Math.random() - 0.5) * 22], k * 3); vel[k] = nieve ? 0.6 + Math.random() * 0.8 : 0.3 + Math.random() * 0.4; }
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d');
  if (nieve) { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#fff0'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }
  else { g.fillStyle = '#f4f0ffd0'; g.beginPath(); g.arc(32, 26, 18, Math.PI, 0); g.lineTo(50, 56); for (let k = 0; k < 4; k++) g.lineTo(50 - k * 9 - 4.5, 50 + (k % 2) * 6); g.lineTo(14, 56); g.closePath(); g.fill(); g.fillStyle = '#1a0a2a'; g.beginPath(); g.arc(25, 26, 3.5, 0, 7); g.arc(39, 26, 3.5, 0, 7); g.fill(); }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  const mat = new T.PointsMaterial({ size: nieve ? 0.24 : 1.1, map: new T.CanvasTexture(cv), transparent: true, depthWrite: false, opacity: nieve ? 0.9 : 0.75 });
  const pts = new T.Points(geo, mat); pts.frustumCulled = false; eng.scene.add(pts); EFX.obj = pts; let t = 0;
  EFX.iv = setInterval(() => {
    if (!EFX.obj || document.hidden) return; t += 0.05;
    for (let k = 0; k < N; k++) { const j = k * 3; if (nieve) { pos[j + 1] -= vel[k] * 0.05; pos[j] += Math.sin(t + k) * 0.004; if (pos[j + 1] < 0) pos[j + 1] = 12; } else { pos[j] += Math.sin(t * vel[k] + k) * 0.03; pos[j + 1] = 5 + Math.sin(t * 0.7 + k * 1.3) * 1.5 + (k % 3); } }
    geo.attributes.position.needsUpdate = true;
  }, 50);
}
{ const st0 = y2.prototype.setTheme; y2.prototype.setTheme = function (e) { const r = st0.call(this, e); try { efxPon(this); } catch (x) { console.warn('efx', x); } return r; }; }
// ---------------- Opciones ----------------
function filaPresentador() {
  const box = document.createElement('div'); box.className = 'ocustom'; box.id = 'optPres126';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🎤 Presentador del programa'; box.appendChild(lb);
  const row = document.createElement('div'); row.className = 'orow obtns'; row.style.flexWrap = 'wrap';
  const nota = document.createElement('p'); nota.className = 'onote small';
  const pinta = () => { const p = PRES_DATOS.find(x => x.id === presId()); nota.textContent = p ? `${p.nombre} · ${p.estilo}. Persona inventada, voz sintética Piper. En el modo Argentina presenta Tano Ferreyra.` : 'Adrián Vega, el presentador de siempre (voz Piper davefx).'; };
  for (const [id, nom] of [['adrian', 'Adrián Vega'], ...PRES_DATOS.map(x => [x.id, x.nombre])]) {
    const b = document.createElement('button'); b.className = 'tbtn' + (presId() === id ? ' sel' : ''); b.textContent = nom; b.dataset.pres = id;
    b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem('ac_pres', id); presAplicar(); row.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); pinta(); try { Xe.setTheme(Xe.theme); } catch (x) { } };
    row.appendChild(b);
  }
  pinta(); box.append(row, nota);
  for (const [k, txt, f] of [['ac_momentos', '🎬 Momentos de cámara (entrada, público, detrás de las cámaras, bote)', momOn], ['ac_efx_esp', '❄️ Efectos de especiales (nieve en Navidad, fantasmas en Halloween)', efxOn]]) {
    const r = document.createElement('div'); r.className = 'orow'; const l = document.createElement('label'); l.textContent = txt; r.appendChild(l);
    for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((f() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem(k, v); r.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); k === 'ac_efx_esp' && Xe && efxPon(Xe); }; r.appendChild(b); }
    box.appendChild(r);
  }
  return box;
}
{ const fc = filaCopro; filaCopro = function () { const d = document.createElement('div'); d.append(filaPresentador(), filaLogoCab(), fc()); return d; }; }
presAplicar();
window.__pres = { datos: PRES_DATOS, aplicar: presAplicar, activo: () => presActivo() && presActivo().id, momentos: { entrada: momEntrada, publico: momPublico, backstage: momBackstage, bote: momBote }, qlist: () => $m(), ctx: (s) => ({ eng: Xe, hud: yn, s }) };
