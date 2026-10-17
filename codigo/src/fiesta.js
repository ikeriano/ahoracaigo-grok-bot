// v1.28 · MODO FIESTA: concurso de rondas con EUROS, presentado por BUZZ (o por Adrián). Tú contra 3 rivales.
// Rondas: Ordena la respuesta (tartazo + trampillazo al que falla), Verdadero o Trampilla, La foto borrosa y Cadena rápida.
const FIESTA = {
  buzz: BUZZ_L, // frases con marcas de entonación (src/buzz_lineas.js),
};
FIESTA.adrian = { hola: ['¡Bienvenidos al Modo Fiesta de Ahora Caigo! Hoy jugamos por euros.'], ronda: { ordena: '¡Ordena la respuesta! Quien falle, tartazo y trampilla.', vot: '¡Verdadero o Trampilla!', borrosa: '¡La foto borrosa! Se aclara poco a poco.', cadena: '¡Cadena rápida! Cada respuesta empieza por la última letra.' }, bien: ['¡Correcto!', '¡Muy bien!'], mal: ['¡Oh, no! Respuesta incorrecta.', '¡Fallo!'], tarta: ['¡Tartazo! ¡Y ahora… trampillazo!'], lento: '¡Se acabó el tiempo!', ultimo: 'Quien tiene menos euros… ¡se cae!', gana: ['¡Enhorabuena! ¡Ganas el Modo Fiesta!'], adios: '¡Gracias por jugar al Modo Fiesta! ¡Hasta la próxima!' };
const FIESTA_VOZ = { buzz: 'p_buzz', adrian: 'davefx' } /* Buzz: voz Piper propia (sharvard, voz 0, rápida y aguda) + bocadillos */, FI_COL = ['#2a7aff', '#ff8a1a', '#2ac040', '#ffd21a'], FI_NOM = ['TÚ', 'Rosa', 'Pepe', 'Lola'];
const fiHost = () => { try { return localStorage.getItem('ac_fiestaHost') || 'buzz'; } catch (e) { return 'buzz'; } };
const fiRnd = a => a[Math.floor(Math.random() * a.length)];
function fiPreg(id) { // 4 preguntas de opciones (o 2 en Verdadero o Trampilla)
  const L = V128[id], qs = mA(L.map((_, k) => k)).slice(0, 4).map(k => L[k]);
  return qs.map(p => {
    if (id === 'vot') return { q: p[0], ops: ['VERDADERO', 'FALSO'], ok: p[1] ? 0 : 1 };
    const r = id === 'borrosa' ? p.r : p[1], otros = mA(L.map(x => id === 'borrosa' ? x.r : x[1]).filter(x => x !== r)).slice(0, 3);
    if (id === 'ordena') { const cerca = new Set(); let g = 0; while (cerca.size < 3 && g++ < 60) { const a = [...r], i = Math.floor(Math.random() * (a.length - 1)), j = i + 1 + Math.floor(Math.random() * (a.length - i - 1)); [a[i], a[j]] = [a[j], a[i]]; const w = a.join(''); w !== r && cerca.add(w); } otros.splice(0, 3, ...[...cerca, ...otros].slice(0, 3)); }
    const ops = mA([r, ...otros]); return { q: id === 'borrosa' ? '¿Qué es? (' + p.l + ')' : p[0], ops, ok: ops.indexOf(r), mezcla: id === 'ordena' ? mA([...r]).join(' ') : '', emoji: id === 'borrosa' ? p.e.join('') : '' };
  });
}
async function modoFiesta(opts = {}) {
  if (document.getElementById('fiesta')) return; mec('modo fiesta');
  const T = _E, host = opts.host || fiHost(), D = FIESTA[host] || FIESTA.buzz, vk = FIESTA_VOZ[host] || 'p_buzz';
  const EST = window.__fiestaEst = { e: 'inicio' }; const ses = { alive: true, w: ms => new Promise((r, j) => setTimeout(() => ses.alive ? r() : j(_o), ms)), until: f => new Promise((r, j) => { const p = () => { if (!ses.alive) return j(_o); f() ? r() : setTimeout(p, 40); }; p(); }) };
  const div = document.createElement('div'); div.id = 'fiesta';
  div.innerHTML = `<canvas></canvas><div class="fhud"></div><div class="fban"></div><div class="fbur"></div><div class="fq"><div class="fmez"></div><div class="ftx"></div><div class="fops"></div><div class="freloj"><i></i></div></div><button class="fx tbtn">✕</button>`;
  const st = document.createElement('style'); st.textContent = `#fiesta{position:fixed;inset:0;z-index:60;background:#0a0420;font-family:Montserrat,'Arial Black',system-ui,sans-serif;color:#fff;overflow:hidden}
#fiesta canvas{position:absolute;inset:0;width:100%;height:100%}
#fiesta .fhud{position:absolute;top:8px;left:0;right:0;display:flex;justify-content:center;gap:6px}#fiesta .fhud div{min-width:20%;padding:4px 6px;border-radius:10px;text-align:center;font-weight:900;font-size:min(3.6vw,18px);border:2px solid #fff6;box-shadow:0 4px 0 #0006}
#fiesta .fban{position:absolute;top:13%;left:0;right:0;text-align:center;font-weight:900;font-size:min(7vw,40px);color:#ffe28a;text-shadow:0 4px 0 #6a3a00,0 0 20px #f80;opacity:0;transition:opacity .4s}#fiesta .fban.on{opacity:1}
#fiesta .fbur{position:absolute;left:4%;right:4%;top:22%;padding:.5em .8em;border-radius:14px;background:#fff;color:#2a0a30;font-weight:800;font-size:min(4vw,19px);box-shadow:0 6px 0 #0008;display:none}#fiesta .fbur b{color:#a0102a}
#fiesta .fq{position:absolute;left:3%;right:3%;bottom:3%;display:none;padding:10px;border-radius:16px;background:linear-gradient(180deg,#1c3a8acc,#0a1240ee);border:3px solid #ffd23a;box-shadow:0 0 22px #ffd23a88}
#fiesta .ftx{font-weight:900;font-size:min(4.6vw,22px);text-align:center;margin:4px 0 8px}#fiesta .fmez{text-align:center;font-weight:900;font-size:min(7vw,34px);letter-spacing:.15em;color:#ffe28a}
#fiesta .fmez .emo{display:inline-block;font-size:min(22vw,110px);line-height:1.1;transition:filter .3s}
#fiesta .fops{display:grid;grid-template-columns:1fr 1fr;gap:8px}#fiesta .fops button{padding:12px 6px;border-radius:12px;border:0;font-weight:900;font-size:min(4.2vw,20px);color:#111;box-shadow:0 5px 0 #0008}#fiesta .fops button.ok{outline:4px solid #fff;filter:brightness(1.25)}#fiesta .fops button.no{opacity:.35}
#fiesta .freloj{height:8px;border-radius:4px;background:#0006;margin-top:8px;overflow:hidden}#fiesta .freloj i{display:block;height:100%;background:linear-gradient(90deg,#ff3a3a,#ffd23a);width:100%}
#fiesta .fx{position:absolute;top:8px;right:8px;padding:4px 10px}#fiesta .fhud div.cae{opacity:.35}`;
  div.appendChild(st); document.body.appendChild(div);
  const cv = div.querySelector('canvas'), R = new T.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: 'low-power' }); R.setPixelRatio(Math.min(1.25, devicePixelRatio || 1));
  const sc = new T.Scene(); sc.background = new T.Color(0x12062a); sc.fog = new T.Fog(0x12062a, 10, 22);
  const cam = new T.PerspectiveCamera(45, 1, 0.1, 50); sc.add(new T.HemisphereLight(0xffeedd, 0x3a2050, 1.1)); const dl = new T.DirectionalLight(0xffffff, 1.1); dl.position.set(2, 5, 6); sc.add(dl);
  // plató de fiesta: suelo de discoteca, arco de bombillas y 4 atriles con los colores del pulsador
  const suelo = new T.Mesh(new T.CircleGeometry(7, 32), new T.MeshLambertMaterial({ color: 0x2a1060, emissive: 0x100430 })); suelo.rotation.x = -Math.PI / 2; sc.add(suelo);
  const baldosas = []; for (let k = 0; k < 16; k++) { const b = new T.Mesh(new T.CircleGeometry(0.45, 6), new T.MeshBasicMaterial({ color: new T.Color(FI_COL[k % 4]) })); b.rotation.x = -Math.PI / 2; const a = k / 16 * Math.PI * 2; b.position.set(Math.cos(a) * 5.2, 0.01, Math.sin(a) * 5.2 - 1); sc.add(b); baldosas.push(b); }
  const bombillas = []; for (let k = 0; k < 22; k++) { const a = Math.PI * k / 21, b = new T.Mesh(new T.SphereGeometry(0.08, 6, 4), new T.MeshBasicMaterial({ color: 0xffe28a })); b.position.set(Math.cos(a) * 4.6, 0.3 + Math.sin(a) * 4, -3.5); sc.add(b); bombillas.push(b); }
  const at = [], jug = [];
  for (let k = 0; k < 4; k++) {
    const x = -2.4 + k * 1.6, g = new T.Group(); g.position.set(x, 0, 0.6); sc.add(g);
    const pod = new T.Mesh(new T.CylinderGeometry(0.42, 0.48, 0.8, 16), new T.MeshLambertMaterial({ color: new T.Color(FI_COL[k]), emissive: new T.Color(FI_COL[k]).multiplyScalar(0.25) })); pod.position.y = 0.4; g.add(pod);
    const p = new T.Group(); p.position.y = 0.8; g.add(p);
    const cu = new T.Mesh(new T.CylinderGeometry(0.17, 0.2, 0.6, 12), new T.MeshLambertMaterial({ color: new T.Color(FI_COL[k]).offsetHSL(0, 0, -0.15) })); cu.position.y = 0.3; p.add(cu);
    const ca = new T.Mesh(new T.SphereGeometry(0.16, 14, 10), new T.MeshLambertMaterial({ color: [0xf3c79a, 0xd9a07a, 0xf0c0a0, 0xb07850][k], emissive: 0x201008 })); ca.position.y = 0.78; p.add(ca);
    const pe = new T.Mesh(new T.SphereGeometry(0.165, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: [0x3a2a1a, 0xa0401a, 0x111111, 0xd0b060][k] })); pe.position.y = 0.8; p.add(pe);
    for (const s of [-1, 1]) { const o = new T.Mesh(new T.SphereGeometry(0.025, 6, 4), new T.MeshBasicMaterial({ color: 0x111111 })); o.position.set(s * 0.055, 0.8, 0.14); p.add(o); }
    at.push(g); jug.push({ n: FI_NOM[k], eur: 0, fig: p, cab: ca, cae: false, nata: null });
  }
  const buzz = host === 'buzz' ? buzzFig() : null; let hostRoot;
  if (buzz) { hostRoot = buzz.root; } else { hostRoot = new T.Group(); const f = Rm({ shirt: 0xffffff, suit: 0x1a2a5a, tie: 0xc9a227, p3d: { seed: 'adrian-fiesta', g: 'm' } }); hostRoot.add(f.root); }
  hostRoot.position.set(0, 0, -1.6); hostRoot.scale.setScalar(buzz ? 1.05 : 1.15); sc.add(hostRoot);
  const hud = div.querySelector('.fhud'), ban = div.querySelector('.fban'), bur = div.querySelector('.fbur'), fq = div.querySelector('.fq');
  const pinta = () => { hud.innerHTML = jug.map((j, k) => `<div class="${j.cae ? 'cae' : ''}" style="background:${FI_COL[k]}cc">${j.n}<br>${j.eur.toLocaleString('es-ES')} €</div>`).join(''); };
  pinta();
  let camObj = { p: new T.Vector3(0, 2.2, 7.5), m: new T.Vector3(0, 1.3, -0.6) }; const camP = camObj.p.clone(), camM = camObj.m.clone();
  const plano = (p, m, cut) => { camObj = { p, m }; if (cut) { camP.copy(p); camM.copy(m); } };
  const resize = () => { const w = innerWidth, h = innerHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; resize(); addEventListener('resize', resize);
  const t0 = performance.now(); let raf = 0, temblor = 0;
  const loop = () => { if (!ses.alive) return; raf = requestAnimationFrame(loop); const t = (performance.now() - t0) / 1000;
    buzz && buzz.anim(t, cam); bombillas.forEach((b, k) => b.material.color.setHex((k + Math.floor(t * 6)) % 3 ? 0xffe28a : 0xff4a8a)); baldosas.forEach((b, k) => b.visible = (k + Math.floor(t * 2)) % 2 === 0);
    camP.lerp(camObj.p, 0.06); camM.lerp(camObj.m, 0.08); cam.position.copy(camP); if (temblor > 0) { temblor *= 0.92; cam.position.x += (Math.random() - 0.5) * temblor; cam.position.y += (Math.random() - 0.5) * temblor; } cam.lookAt(camM); R.render(sc, cam); };
  loop();
  const cierra = () => { ses.alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); buzz && buzz.dispose(); sc.traverse(o => { if (o.isMesh && o.geometry) { o.geometry.dispose(); o.material.dispose && o.material.dispose(); } }); R.dispose(); div.remove(); F.stopTag && F.stopTag('voz'); };
  div.querySelector('.fx').onclick = ev => { ev.stopPropagation(); cierra(); };
  const di = async (txt, modo = 'habla', mom = null) => { txt = buzzTexto(txt); const pjF = host === 'buzz' ? 'buzz' : 'adrian', momF = host === 'buzz' ? (mom || 'cualquiera') : maMomento('adrian', txt); { const el = maElige(pjF, momF); const sb = (el && el.sub) || maSubDe(pjF, momF); if (sb) txt = sb; } bur.innerHTML = `<b>${host === 'buzz' ? 'Buzz' : 'Adrián'}:</b> ${txt}`; bur.style.display = 'block'; if (buzz) buzz.modo = modo; try { if (buzz) { sfx128('buzzer'); modo === 'risa' && ze.risas && ze.risas(); } if (!(await buzzAudToca(momF, ses, pjF))) await stHabla(vk, txt, ses); } finally { if (buzz) buzz.modo = 'senala'; bur.style.display = 'none'; } };
  const banner = async (t, ms = 1600) => { ban.textContent = t; ban.classList.add('on'); await ses.w(ms); ban.classList.remove('on'); };
  const planoBuzz = () => plano(new T.Vector3(0.25, 1.55, 1.3), new T.Vector3(0, 1.25, -1.6), true), planoGeneral = () => plano(new T.Vector3(0, 2.2, 7.5), new T.Vector3(0, 1.3, -0.6));
  const planoJug = k => { const x = at[k].position.x; plano(new T.Vector3(x * 0.85, 1.8, 3.3), new T.Vector3(x, 1.45, 0.6), true); };
  async function tarta(k) { const j = jug[k], hp = new T.Vector3(); j.cab.getWorldPosition(hp); planoJug(k); await ses.w(400);
    const pie = tartaMesh(), desde = hostRoot.position.clone().add(new T.Vector3(0.5, 1.6, 0.3)); pie.position.copy(desde); sc.add(pie); sfx128('silbido'); if (buzz) buzz.modo = 'pulsa';
    const fin = hp.clone().add(new T.Vector3(0, 0, 0.15)), a = performance.now(); await ses.until(() => { const u = Math.min(1, (performance.now() - a) / 600); pie.position.lerpVectors(desde, fin, u); pie.position.y += Math.sin(u * Math.PI) * 0.7; pie.rotation.x = u * 7; return u >= 1; });
    EST.e = 'tartazo'; sc.remove(pie); const sp = nataSplat(); sp.position.set(0, 0.78, 0.13); sp.scale.setScalar(1.05); j.fig.add(sp); j.nata = sp; sfx128('splat'); temblor = 0.15; ze.risas(); if (buzz) buzz.modo = 'risa';
    await di(fiRnd(D.tarta), 'risa', 'tartazo'); await trampilla(k, true); }
  async function trampilla(k, vuelve) { const j = jug[k], y0 = 0.8, a = performance.now(); EST.e = 'trampilla'; sfx128('boom'); if (host === 'buzz') buzzAudSuelto('trampillazo', bur, '¡Trampillazo!'); const ag = new T.Mesh(new T.CircleGeometry(0.36, 20), new T.MeshBasicMaterial({ color: 0x000000 })); ag.rotation.x = -Math.PI / 2; ag.position.y = 0.81; at[k].add(ag); const fl = new T.Mesh(new T.RingGeometry(0.3, 0.5, 24), new T.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, side: 2 })); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.85; at[k].add(fl); temblor = 0.4;
    await ses.until(() => { const u = (performance.now() - a) / 800; j.fig.position.y = y0 - u * u * 3; fl.scale.setScalar(1 + u * 3); fl.material.opacity = Math.max(0, 1 - u); return u >= 1; }); at[k].remove(fl); j.fig.visible = false;
    if (vuelve) { await ses.w(500); j.nata && j.fig.remove(j.nata); j.nata = null; j.fig.position.y = y0; j.fig.visible = true; at[k].remove(ag); } }
  async function pregunta(id, p, nq) {
    fq.style.display = 'block'; const mez = fq.querySelector('.fmez'), tx = fq.querySelector('.ftx'), ops = fq.querySelector('.fops'), rel = fq.querySelector('.freloj i');
    mez.innerHTML = p.emoji ? `<span class="emo" style="filter:blur(18px)">${p.emoji}</span>` : (p.mezcla || ''); tx.textContent = p.q;
    ops.style.gridTemplateColumns = p.ops.length === 2 ? '1fr 1fr' : '1fr 1fr';
    ops.innerHTML = p.ops.map((o, k) => `<button style="background:${p.ops.length === 2 ? (k ? '#ff6a3a' : '#2ac040') : FI_COL[k]}">${o}</button>`).join('');
    EST.e = 'preg_' + id; const MS = 10000, a = performance.now(); let elige = -1, tEl = 0;
    const bs = [...ops.children]; bs.forEach((b, k) => b.onclick = ev => { ev.stopPropagation(); if (elige < 0) { elige = k; tEl = performance.now() - a; F.play('Tecla'); b.style.outline = '4px solid #fff'; } });
    const bots = [1, 2, 3].map(k => ({ k, t: 1500 + Math.random() * 6500, ok: Math.random() < 0.62 }));
    if (opts.auto) setTimeout(() => { if (elige < 0) { elige = opts.auto === 'fail' ? (p.ok + 1) % p.ops.length : p.ok; tEl = 2500; } }, 2500);
    await ses.until(() => { const u = (performance.now() - a) / MS; rel.style.width = Math.max(0, 100 - u * 100) + '%'; if (p.emoji) mez.firstChild.style.filter = `blur(${Math.max(0, 18 - u * 26)}px)`; return elige >= 0 && u > 0.3 || u >= 1; });
    if (p.emoji) mez.firstChild.style.filter = 'none';
    bs.forEach((b, k) => b.classList.add(k === p.ok ? 'ok' : 'no')); sfx128(elige === p.ok ? 'ding' : 'tic');
    const res = [{ k: 0, ok: elige === p.ok, t: elige < 0 ? MS : tEl, nada: elige < 0 }, ...bots];
    for (const r of res) if (!jug[r.k].cae && r.ok) jug[r.k].eur += 100 * (1 + Math.round(4 * (1 - Math.min(r.t, MS) / MS)));
    pinta(); await ses.w(1300); fq.style.display = 'none';
    if (res[0].ok) { planoJug(0); ze.aplauso(1.5, 0.6); await di(fiRnd(D.bien), 'habla', 'acierto'); }
    else { if (id === 'ordena') { await di(res[0].nada ? D.lento : fiRnd(D.mal), 'risa', 'fallo'); await tarta(0); } else { planoBuzz(); await di(res[0].nada ? D.lento : fiRnd(D.mal), 'risa', 'fallo'); } }
    if (id === 'ordena') { const malBot = bots.find(b => !b.ok); if (malBot && nq % 2) await tarta(malBot.k); }
    planoGeneral();
  }
  try {
    planoGeneral(); await ses.w(600); planoBuzz(); ze.aplauso && ze.aplauso(2, 0.7); for (const [i, t] of D.hola.entries()) await di(t, 'habla', i === 0 ? 'saludo' : null);
    const rondas = opts.rondas || ['ordena', 'vot', 'borrosa', 'cadena'];
    for (const [i, id] of rondas.entries()) {
      planoGeneral(); await banner('RONDA ' + (i + 1) + ' · ' + V128.titulos[id]); planoBuzz(); await di(D.ronda[id]);
      const P = fiPreg(id).slice(0, opts.nq || 4); for (const [nq, p] of P.entries()) await pregunta(id, p, nq);
    }
    planoBuzz(); await di(D.ultimo); const orden = jug.map((j, k) => k).sort((a, b) => jug[a].eur - jug[b].eur), peor = orden[0], mejor = orden[3];
    planoJug(peor); await trampilla(peor, false); jug[peor].cae = true; pinta(); ze.risas();
    planoJug(mejor); await banner('🏆 ' + (mejor ? jug[mejor].n + ' GANA' : '¡HAS GANADO!') + ' · ' + jug[mejor].eur.toLocaleString('es-ES') + ' €', 2000); ze.ovacion && ze.ovacion(4);
    planoBuzz(); await di(mejor === 0 ? fiRnd(D.gana) : '¡Esta vez gana ' + jug[mejor].n + '! ¡Tú vuelve a intentarlo, que la práctica hace al maestro!', 'habla', mejor === 0 ? 'victoria' : null); await di(D.adios, 'habla', 'despedida');
  } catch (e) { if (e !== _o) console.warn('fiesta', e); } finally { EST.e = 'fin'; if (ses.alive) cierra(); }
}
function filaFiesta() {
  const box = document.createElement('div'); box.className = 'ocustom'; box.id = 'optFiesta';
  const lb = document.createElement('div'); lb.className = 'olabel'; lb.textContent = '🎉 Modo Fiesta (rondas por EUROS)'; box.appendChild(lb);
  const r = document.createElement('div'); r.className = 'orow'; const l = document.createElement('label'); l.textContent = 'Presentador de la fiesta'; r.appendChild(l);
  for (const [v, t] of [['buzz', '🕺 Buzz'], ['adrian', 'Adrián']]) { const b = document.createElement('button'); b.className = 'tbtn' + (fiHost() === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem('ac_fiestaHost', v); r.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; r.appendChild(b); }
  box.appendChild(r);
  const j = document.createElement('button'); j.className = 'tbtn gold'; j.id = 'jugarFiesta'; j.textContent = '🎉 ¡Jugar al Modo Fiesta!'; j.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); modoFiesta(); }; box.appendChild(j);
  return box;
}
{ const fc = filaCopro; filaCopro = function () { const d = fc(); d.prepend(filaFiesta()); return d; }; }
window.__fiesta = { modoFiesta, buzzFig, FIESTA };
