// v1.30 · VOCES DE LOS CONCURSANTES: cada concursante (los 10 rivales y tú) tiene su propia voz Piper ORIGINAL
// (modelo es_ES, voz, velocidad, tono y ecualización distintos; nada clonado) y frases cortas en los momentos clave:
// saludo, acierto, fallo, caída por la trampilla y victoria. Clips pequeños (64 kbps) y como mucho una frase cada 2,5 s.
const VOZ130 = [ // [clave, nombre por defecto, modelo, voz, velocidad, tono, ecualización]
  ['c0', 'Tú', 'es_ES-davefx-medium', null, 0.9, 1.05, 'equalizer=f=2500:t=q:w=1:g=2'],
  ['c1', 'Paco', 'es_ES-carlfm-x_low', null, 0.95, 0.92, 'equalizer=f=150:t=q:w=1:g=4'],
  ['c2', 'Lola', 'es_ES-sharvard-medium', 1, 0.85, 1.08, 'equalizer=f=3500:t=q:w=1:g=4'],
  ['c3', 'Ramón', 'es_ES-sharvard-medium', 0, 1.0, 0.88, 'equalizer=f=120:t=q:w=1:g=5'],
  ['c4', 'Conchi', 'es_ES-sharvard-medium', 1, 0.95, 1.0, 'equalizer=f=1300:t=q:w=1:g=6'],
  ['c5', 'Tomás', 'es_ES-davefx-medium', null, 0.85, 0.9, 'equalizer=f=200:t=q:w=1:g=3'],
  ['c6', 'Marisa', 'es_ES-sharvard-medium', 1, 0.78, 1.15, 'equalizer=f=2800:t=q:w=1:g=3'],
  ['c7', 'Javi', 'es_ES-sharvard-medium', 0, 0.8, 1.08, 'equalizer=f=3000:t=q:w=1:g=3'],
  ['c8', 'Rocío', 'es_ES-sharvard-medium', 1, 1.05, 0.95, 'lowpass=f=5000'],
  ['c9', 'Manolo', 'es_ES-carlfm-x_low', null, 1.05, 0.85, 'equalizer=f=900:t=q:w=1:g=3'],
  ['c10', 'Pili', 'es_ES-sharvard-medium', 1, 0.9, 1.2, 'equalizer=f=4000:t=q:w=1:g=3'],
];
const FR130 = { // cada concursante usa 2 frases de cada momento (según su número)
  saluda: ['¡Hola a todos!', '¡Buenas noches, España!', '¡Qué nervios, madre mía!', '¡Vengo a por el bote!', '¡Hola, mamá, que salgo en la tele!', '¡A por todas!', '¡Saludos desde mi pueblo!', '¡Que empiece el juego!', '¡Hoy no me caigo, ya veréis!', '¡Encantado de estar aquí!', '¡Vamos allá!'],
  acierta: ['¡Sí, señor!', '¡Toma ya!', '¡Lo sabía!', '¡Esa era fácil!', '¡Bien, bien, bien!', '¡Chúpate esa!', '¡Ni lo he dudado!', '¡Para casa!', '¡Ay, qué alegría!', '¡De cabeza!', '¡Correcto, correcto!'],
  falla: ['¡Ay, no!', '¡Uy, que me la sabía!', '¡Pero si estaba clarísimo!', '¡Qué rabia!', '¡Madre mía!', '¡Me he liado!', '¡Esa no la esperaba!', '¡Vaya por Dios!', '¡Se me ha ido!', '¡Ay, ay, ay!', '¡No puede ser!'],
  cae: ['¡Aaaaah!', '¡Nooooo!', '¡Me caigooo!', '¡Socorrooo!', '¡Adiós a todos!', '¡Ahí va!', '¡Que alguien me coja!', '¡Ay, mi madre!', '¡Hasta luegooo!', '¡Esto no estaba en el contrato!', '¡Uaaaah!'],
  gana: ['¡He ganado! ¡No me lo creo!', '¡Gracias, gracias a todos!', '¡Esto va por mi familia!', '¡Soy el campeón!', '¡Qué felicidad!', '¡Lo he conseguido!', '¡Viva, viva y viva!', '¡Esto hay que celebrarlo!', '¡Me quedo el bote!', '¡Increíble!', '¡Gracias, de verdad!'],
};
const voz130Frases = (k, m) => { const L = FR130[m]; return [L[k % L.length], L[(k + 4) % L.length]]; };
const VOZ130_ON = () => { try { return localStorage.getItem('ac_vozconc') !== '0'; } catch (e) { return true; } };
const V130 = { ult: 0, porFig: new Map(), log: [] };
function voz130Num(fig) { const e = Xe; if (!e || !fig) return -1; if (fig === e.player) return 0; const i = e.opps ? e.opps.indexOf(fig) : -1; return i >= 0 ? 1 + (i % 10) : -1; }
function voz130Rotulo(n, t) { // rótulo pequeño abajo a la izquierda, sin tapar el bocadillo del presentador
  let d = document.getElementById('voz130'); if (!d) { d = document.createElement('div'); d.id = 'voz130'; d.style.cssText = 'position:fixed;left:12px;bottom:64px;z-index:44;max-width:60vw;padding:6px 12px;border-radius:12px;background:#0a1a4aee;border:2px solid #ffd23a;color:#fff;font:800 15px Montserrat,system-ui,sans-serif;pointer-events:none;transition:opacity .3s;opacity:0'; document.body.appendChild(d); }
  d.innerHTML = '🗣️ <b style="color:#ffd23a">' + za(String(n)) + ':</b> ' + za(t); d.style.opacity = '1'; clearTimeout(d._t); d._t = setTimeout(() => d.style.opacity = '0', 2400);
}
async function voz130(fig, m, fuerza) {
  try {
    if (!VOZ130_ON() || !zn.enabled) return; const k = voz130Num(fig); if (k < 0) return;
    const now = performance.now(); if (!fuerza && (now - V130.ult < 2500 || now - (V130.porFig.get(fig) || 0) < 7000)) return;
    const vv = VOZ130[k], t = voz130Frases(k, m)[Math.random() < 0.5 ? 0 : 1], idx = await stIndice(), h = _f(vv[0] + '|' + t); if (idx[h] == null) return;
    V130.ult = now; V130.porFig.set(fig, now); V130.log.push(vv[1] + ': ' + t); voz130Rotulo(k ? me.rival(k) : me.tu, t); F.playUrl(`${Us}voz/st/${h}.mp3`, 0.95, 'conc');
  } catch (e) { }
}
// reacciones cortas de los presentadores nuevos (con su propia voz de la 1.26) cuando un concursante acierta, falla o cae
const PRES130 = {
  p_marga: { acierta: ['¡Bieeen! ¡Así se hace!', '¡Fenomenal, fenomenal!', '¡Qué rapidez, me encanta!'], falla: ['¡Ay, por un pelo!', '¡Uy, uy, casi!', '¡Venga, que no pasa nada!'], cae: ['¡Abajooo! ¡Qué caída!', '¡Y se nos va! ¡Adiós!', '¡Madre mía, qué trampillazo!'] },
  p_bruno: { acierta: ['Impecable.', 'Una respuesta de categoría.', 'Muy bien. Con elegancia.'], falla: ['Lástima. Muy cerca.', 'No era esa, me temo.', 'Un pequeño tropiezo.'], cae: ['Y la gravedad hace su trabajo.', 'Un final digno. Hasta siempre.', 'Abajo. Con estilo, eso sí.'] },
  p_rita: { acierta: ['Vaya. Hasta lo ha acertado.', 'Correcto. No me lo esperaba.', 'Bien. No te acostumbres.'], falla: ['Sorpresa: has fallado.', 'Qué original, fallar.', 'Ya decía yo.'], cae: ['Bueno, era cuestión de tiempo.', 'Adiós. No te echaremos mucho de menos.', 'Y abajo. Qué pena. Más o menos.'] },
  p_quique: { acierta: ['¡Toma, toma y toma!', '¡Eso es, máquina!', '¡Crack, fiera, fenómeno!'], falla: ['¡Jajaja, pero qué dices!', '¡Uy, eso ha dolido!', '¡Error, error, error!'], cae: ['¡Jajaja, ahí va ese!', '¡Hasta el sótano, colega!', '¡Pum! ¡Directo al agujero!'] },
};
function pres130(m) { try { const p = presActivo(); if (!p || !PRES130[p.vk] || !zn.enabled || !VOZ130_ON()) return; const L = PRES130[p.vk][m], t = L[Math.floor(Math.random() * L.length)];
  stIndice().then(idx => { const h = _f(p.vk + '|' + t); if (idx[h] != null) V130.log.push(p.nombre + ': ' + t), setTimeout(() => F.playUrl(`${Us}voz/st/${h}.mp3`, 1, 'conc'), 1400); }); } catch (e) { } }
{ // momentos clave: los gestos de los concursantes y la caída por la trampilla
  const he = He; He = function (a, e, t) { const r = he.call(this, a, e, t); const m = e === 'saluda' ? 'saluda' : e === 'lamenta' ? 'falla' : e === 'arriba' ? (t >= 2.4 ? 'gana' : 'acierta') : null; if (m && Math.random() < (m === 'gana' ? 1 : 0.7)) voz130(a, m, m === 'gana'); if ((m === 'acierta' || m === 'falla') && Math.random() < 0.25) pres130(m); return r; };
  const f0 = y2.prototype.fall; y2.prototype.fall = function (fig, idx) { voz130(fig, 'cae', true); pres130('cae'); return f0.call(this, fig, idx); };
}
function filaVoz130() { const r = document.createElement('div'); r.className = 'orow'; r.id = 'rowVoz130'; const l = document.createElement('label'); l.textContent = '🗣️ Voces de los concursantes (saludo, acierto, fallo, caída y victoria)'; r.appendChild(l);
  for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((VOZ130_ON() ? '1' : '0') === v ? ' sel' : ''); b.textContent = t; b.onclick = ev => { ev.stopPropagation(); F.play('Tecla'); localStorage.setItem('ac_vozconc', v); r.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; r.appendChild(b); }
  return r; }
{ const fc = filaCopro; filaCopro = function () { const d = fc(); const o = d.querySelector('#opt128'); o ? o.appendChild(filaVoz130()) : d.appendChild(filaVoz130()); return d; }; }
window.__voz130 = { V130, VOZ130, FR130, PRES130, voz130Frases, voz130, pres130 };
