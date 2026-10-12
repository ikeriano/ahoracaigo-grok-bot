'use strict';
// Cliente multijugador de ¡Ahora Caigo! — el estado lo decide el servidor.
const $ = (id) => document.getElementById(id);
const SND = {   // sonidos originales del proyecto (web/sb3/snd)
  acierto: '360db421387a1e0fffb00dee0090a57b', fallo: 'dab62773027a935d5ed1776426bbf2e9',
  trampilla: '98e56ac5f7789fcb43a2c19a74561b16', cae: '62cdc6cc25a8c1075f97de51b1af6c9c',
  tic: '02f8910759f7cb5a286856c9258ab9cf', duelo: '166b477a9c352e64ada846b3ec88e54b',
  tecla: '19ac7ce0c8939de4a0d3c21284b90c8e', pasar: '83a9787d4cb6f3b7632b4ddfebf74367', fin: '7a2adf8e473e1c50d9723390bccc1d12',
};
const audios = {};
function sonar(n, vol = 1) {
  try {
    const a = audios[n] || (audios[n] = new Audio(`../web/sb3/snd/${SND[n]}.mp3`));
    a.currentTime = 0; a.volume = vol; a.play().catch(() => {});
  } catch {}
}
function parar(n) { const a = audios[n]; if (a) a.pause(); }

let ws, yo = null, est = null, recibidoEn = 0, ultimoTic = 0;
const wsUrl = () => window.AC_SERVIDOR || `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

function conectar(primerMsg) {
  ws = new WebSocket(wsUrl());
  ws.onopen = () => ws.send(JSON.stringify(primerMsg));
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.t === 'hola') yo = m.id;
    else if (m.t === 'sala') { history.replaceState(null, '', `?sala=${m.codigo}`); }
    else if (m.t === 'estado') { est = m.s; recibidoEn = performance.now(); pintar(); }
    else if (m.t === 'evento') onEvento(m.e);
    else if (m.t === 'error') toast(m.msg);
  };
  ws.onclose = () => { toast('Conexión perdida. Recarga para volver a entrar.'); };
}
const enviar = (m) => ws && ws.readyState === 1 && ws.send(JSON.stringify(m));

function toast(t) { const el = $('toast'); el.textContent = t; el.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.add('hidden'), 2600); }
const nom = (id) => (est?.jugadores.find(j => j.id === id) || {}).nombre || '¿?';
const ver = (v) => document.querySelectorAll('.vista').forEach(s => s.classList.toggle('hidden', s.id !== v));

function onEvento(e) {
  if (e.tipo === 'acierto') { sonar('acierto'); $('casillas').classList.remove('flash-ok'); void $('casillas').offsetWidth; $('casillas').classList.add('flash-ok'); }
  if (e.tipo === 'fallo') { sonar('fallo', .7); $('casillas').classList.remove('flash-ko'); void $('casillas').offsetWidth; $('casillas').classList.add('flash-ko'); }
  if (e.tipo === 'letra') sonar('tecla', .6);
  if (e.tipo === 'pasar') { sonar('pasar'); toast(`${nom(e.id)} pasa${e.comodin ? ' (comodín: la pregunta va al rival)' : ' sin comodines: otra pregunta'}`); }
  if (e.tipo === 'duelo') sonar('duelo', .8);
  if (e.tipo === 'caida') { sonar('trampilla'); setTimeout(() => sonar('cae'), 500); }
  if (e.tipo === 'fin') sonar('fin', .6);
}

function pintar() {
  const s = est; if (!s) return;
  $('salaTag').textContent = s.codigo; $('salaTag').classList.remove('hidden');
  const soyHost = s.host === yo, soyCentral = s.central === yo;
  if (s.fase === 'espera') {
    ver('vEspera');
    $('codGrande').textContent = s.codigo;
    const url = `${location.origin}${location.pathname}?sala=${s.codigo}`;
    $('enlace').textContent = url; $('enlace').href = url;
    $('listaEspera').innerHTML = s.jugadores.map(j => `<li><span>${esc(j.nombre)}${j.id === yo ? ' (tú)' : ''}</span><span>${j.id === s.host ? '⭐ anfitrión' : ''}</span></li>`).join('');
    $('btnEmpezar').classList.toggle('hidden', !soyHost);
    $('btnEmpezar').disabled = s.jugadores.length < 2;
    $('esperaMsg').textContent = soyHost ? (s.jugadores.length < 2 ? 'Esperando a más jugadores…' : 'Pulsa empezar cuando estéis todos.') : 'Esperando a que el anfitrión empiece…';
  } else if (s.fase === 'eleccion') {
    ver('vEleccion');
    $('elTitulo').textContent = soyCentral ? 'Elige huella: ¿contra quién te bates?' : `${nom(s.central)} está eligiendo huella…`;
    const vivos = s.jugadores.filter(j => j.vivo && j.id !== s.central).length;
    $('elMsg').textContent = `Quedan ${vivos} oponente${vivos === 1 ? '' : 's'} en pie.`;
    $('huellas').innerHTML = s.jugadores.map((j, i) => `<button class="huella ${j.vivo ? '' : 'muerto'} ${j.id === s.central ? 'central' : ''}" data-id="${j.id}" ${soyCentral ? '' : 'disabled'}><span class="pie">👣</span><span>${i + 1}. ${esc(j.nombre)}</span><small>${j.id === s.central ? 'Trampilla central' : j.vivo ? '🃏×' + j.comodines : 'Ha caído'}</small></button>`).join('');
    document.querySelectorAll('.huella').forEach(b => b.onclick = () => { sonar('tecla'); enviar({ t: 'elegir', rival: b.dataset.id }); });
  } else if (s.fase === 'duelo' && s.duelo) {
    ver('vDuelo');
    const d = s.duelo, miTurno = d.turno === yo, juego = d.a === yo || d.b === yo;
    [['ladoA', d.a], ['ladoB', d.b]].forEach(([el, id]) => {
      const j = s.jugadores.find(x => x.id === id);
      $(el).querySelector('.n').textContent = (id === s.central ? '⭐ ' : '') + nom(id) + (id === yo ? ' (tú)' : '');
      $(el).querySelector('.c').textContent = `PASAR 🃏×${j ? j.comodines : 0}`;
      $(el).classList.toggle('turno', d.turno === id);
    });
    $('turnoMsg').textContent = miTurno ? '¡Te toca! Escribe las letras que faltan' : juego ? `Turno de ${nom(d.turno)}…` : `Duelo: ${nom(d.a)} contra ${nom(d.b)} (espectador)`;
    const q = d.pregunta;
    $('pImgBox').classList.toggle('hidden', !q.img);
    if (q.img) { const src = '../' + q.img; if ($('pImg').getAttribute('src') !== src) $('pImg').setAttribute('src', src); }
    $('pTexto').textContent = q.q || '';
    $('casillas').innerHTML = q.casillas.map(c => c === ' ' ? '<div class="cas esp"></div>' : `<div class="cas ${c === '_' ? 'hueco' : ''}">${c === '_' ? '' : esc(c)}</div>`).join('');
    $('controles').classList.toggle('bloq', !miTurno);
    $('controles').classList.toggle('hidden', !juego);
    if (miTurno && document.activeElement !== $('kb')) $('kb').focus({ preventScroll: true });
    relojes();
  } else if (s.fase === 'caida' && s.ultimaCaida) {
    ver('vCaida'); parar('tic');
    const c = s.ultimaCaida;
    $('caeNombre').textContent = nom(c.id);
    $('caeMsg').innerHTML = `${c.motivo === 'abandono' ? `${esc(nom(c.id))} ha abandonado.` : `A ${esc(nom(c.id))} se le acabó el tiempo.`} ${c.palabra ? `La respuesta era <b>${esc(c.palabra)}</b>.` : ''}<br>${c.ganador ? `Sigue ${esc(nom(c.ganador))}.` : ''}`;
  } else if (s.fase === 'fin') {
    ver('vFin'); parar('tic');
    $('finMsg').innerHTML = s.ganador ? `${s.ganador === yo ? '¡Has ganado!' : 'Gana'} <b>${esc(nom(s.ganador))}</b>: el último en pie.` : 'No queda nadie en pie.';
    $('historial').innerHTML = '';
    $('btnRevancha').classList.toggle('hidden', !soyHost);
  }
}

function relojes() {
  const s = est; if (!s || s.fase !== 'duelo' || !s.duelo) return;
  const d = s.duelo, pasado = performance.now() - recibidoEn;
  [['ladoA', d.a], ['ladoB', d.b]].forEach(([el, id]) => {
    let ms = d.reloj[id]; if (d.turno === id) ms = Math.max(0, ms - pasado);
    const t = $(el).querySelector('.t'); t.textContent = (ms / 1000).toFixed(1); t.classList.toggle('poco', ms < 10000);
    if (d.turno === id && ms < 10000 && ms > 0 && Date.now() - ultimoTic > 1000) { ultimoTic = Date.now(); sonar('tic', .35); }
  });
}
setInterval(relojes, 100);
// Las imágenes de preguntas del proyecto Scratch llevan la respuesta en las casillas de abajo:
// solo se muestra la parte de arriba (el texto de la pregunta).
function recortar() { const img = $('pImg'); if (img.naturalHeight) $('pImgBox').style.height = (img.clientHeight * 0.46) + 'px'; }
$('pImg').addEventListener('load', recortar); addEventListener('resize', recortar);

function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function mandarTexto() {
  const v = $('kb').value.trim(); $('kb').value = '';
  if (!v) return;
  if (v.length === 1) enviar({ t: 'letra', letra: v }); else enviar({ t: 'palabra', texto: v });
}
$('kb').addEventListener('input', () => {   // en móvil: cada letra se envía al momento
  const v = $('kb').value; if (v.length === 1 && /\S/.test(v)) { enviar({ t: 'letra', letra: v }); $('kb').value = ''; }
});
$('kb').addEventListener('keydown', (e) => { if (e.key === 'Enter') mandarTexto(); });
$('btnEnviar').onclick = mandarTexto;
$('btnPasar').onclick = () => enviar({ t: 'pasar' });
$('btnEmpezar').onclick = () => enviar({ t: 'empezar' });
$('btnRevancha').onclick = () => enviar({ t: 'revancha' });
const nombre = () => { const n = $('nombre').value.trim(); if (!n) { toast('Escribe tu nombre'); return null; } localStorage.setItem('ac_mp_nombre', n); return n; };
$('btnCrear').onclick = () => { const n = nombre(); if (n) conectar({ t: 'crear', nombre: n }); };
$('btnUnir').onclick = () => { const n = nombre(); const c = $('codigo').value.trim().toUpperCase(); if (!n) return; if (c.length !== 4) return toast('El código tiene 4 letras'); conectar({ t: 'unir', codigo: c, nombre: n }); };
$('nombre').value = localStorage.getItem('ac_mp_nombre') || '';
const qs = new URLSearchParams(location.search).get('sala'); if (qs) $('codigo').value = qs.toUpperCase();
