'use strict';
// Prueba de extremo a extremo: arranca el servidor y simula 3 móviles por WebSocket
// jugando una partida completa (2 duelos). Uso: npm test
process.env.PORT = process.env.PORT || '18080';
process.env.TIEMPO_MS = process.env.TIEMPO_MS || '4000';   // relojes cortos para la prueba
process.env.PAUSA_MS = process.env.PAUSA_MS || '300';
const assert = require('assert');
const WebSocket = require('ws');
const server = require('../server');
const { Sala, parsePalabra } = require('../juego');

const LETRAS = 'EAOSNRILDTUCMPBGVYQHFZJÑXKW0123456789';
const log = (...a) => console.log('  ·', ...a);

function cliente(nombre, estrategia) {
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://localhost:${process.env.PORT}/ws`);
    const c = { nombre, ws, id: null, s: null, eventos: [], errores: [], estrategia, enviar: (m) => ws.send(JSON.stringify(m)) };
    ws.on('message', (raw) => {
      const m = JSON.parse(raw);
      if (m.t === 'hola') { c.id = m.id; resolve(c); }
      if (m.t === 'estado') { c.s = m.s; c.onEstado && c.onEstado(m.s); }
      if (m.t === 'evento') c.eventos.push(m.e);
      if (m.t === 'error') c.errores.push(m.msg);
    });
  });
}
const esperar = (c, cond, ms = 20000) => new Promise((res, rej) => {
  const t0 = Date.now();
  const iv = setInterval(() => { if (c.s && cond(c.s)) { clearInterval(iv); res(c.s); } else if (Date.now() - t0 > ms) { clearInterval(iv); rej(new Error('timeout esperando ' + cond)); } }, 20);
});

// Juego automático: si es mi turno y quiero ganar, pruebo letras (fallar no penaliza salvo tiempo)
function autoJugar(c) {
  let ocupado = false, idx = 0, pregAnt = '';
  c.onEstado = (s) => {
    if (s.fase !== 'duelo' || !s.duelo || s.duelo.turno !== c.id || ocupado) return;
    if (c.estrategia === 'dormir') return;               // no contesta: se le acabará el reloj
    const clave = s.duelo.pregunta.casillas.join('');
    if (clave !== pregAnt) { pregAnt = clave; idx = 0; }
    if (c.estrategia === 'pasar1' && !c.yaPaso && c.s.jugadores.find(j => j.id === c.id).comodines > 0) {
      c.yaPaso = true; ocupado = true; setTimeout(() => { ocupado = false; c.enviar({ t: 'pasar' }); }, 30); return;
    }
    ocupado = true;
    setTimeout(() => { ocupado = false; if (idx < LETRAS.length) c.enviar({ t: 'letra', letra: LETRAS[idx++] }); }, 15);
  };
}

async function pruebaUnitaria() {
  console.log('1) Lógica del duelo (sin red)');
  const p = parsePalabra('GU[A]DA[L]QUI[V]IR');
  assert.deepStrictEqual(p.missing, ['A', 'L', 'V']); assert.strictEqual(p.word, 'GUADALQUIVIR');
  const s = new Sala('TEST', { tiempoMs: 30000, pausaMs: 300 }); const ev = []; s.onEvento = (e) => ev.push(e);
  s.unir('h', 'Host'); s.unir('r', 'Rival');
  assert.ok(s.empezar('r').error, 'solo el anfitrión empieza'); s.empezar('h');
  s.elegir('h', 'r'); assert.strictEqual(s.duelo.turno, 'r', 'empieza el oponente');
  assert.ok(s.letra('h', 'A').error, 'no es tu turno');
  const q1 = s.duelo.pregunta; const mal = 'QWXKJZ'.split('').find(l => !q1.missing.includes(l)) || '9';
  s.letra('r', mal); assert.strictEqual(ev.at(-1).tipo, 'fallo'); assert.strictEqual(s.duelo.turno, 'r', 'tras fallo sigue el turno');
  q1.missing.forEach(l => s.letra('r', l)); assert.strictEqual(ev.find(e => e.tipo === 'acierto').id, 'r');
  assert.strictEqual(s.duelo.turno, 'h', 'al acertar pasa el turno'); assert.notStrictEqual(s.duelo.pregunta, q1, 'nueva pregunta');
  const q2 = s.duelo.pregunta; s.pasar('h');
  assert.strictEqual(s.jugador('h').comodines, 1); assert.strictEqual(s.duelo.turno, 'r'); assert.strictEqual(s.duelo.pregunta, q2, 'con comodín la MISMA pregunta va al rival');
  s.palabra('r', q2.word); assert.strictEqual(s.duelo.turno, 'h', 'palabra completa = acierto');
  s.jugador('h').comodines = 0; const q3 = s.duelo.pregunta; s.pasar('h');
  assert.strictEqual(s.duelo.turno, 'h', 'sin comodines sigue su turno'); assert.notStrictEqual(s.duelo.pregunta, q3, 'otra pregunta');
  // agotar reloj
  s.duelo.reloj.h = 1; s.duelo.desde = Date.now(); s._programar(); await new Promise(r => setTimeout(r, 60));
  assert.strictEqual(s.fase, 'caida'); assert.strictEqual(s.jugador('h').vivo, false); assert.strictEqual(s.central, 'r', 'el que gana pasa a la trampilla central');
  await new Promise(r => setTimeout(r, 400)); assert.strictEqual(s.fase, 'fin'); assert.strictEqual(s.ganador, 'r');
  // la vista no filtra la respuesta
  const s2 = new Sala('T2'); s2.unir('a', 'A'); s2.unir('b', 'B'); s2.empezar('a'); s2.elegir('a', 'b');
  const v = JSON.stringify(s2.vista('a')); assert.ok(!v.includes('"missing"') && !v.includes('"word"'), 'no se envía la respuesta'); s2.destruir();
  log('OK: turnos, reloj, fallo/reintento, acierto, PASAR con y sin comodín, caída, nuevo central, fin, sin fugas de respuesta');
}

async function pruebaRed() {
  console.log(`2) Partida completa por WebSocket con 3 clientes (relojes de ${process.env.TIEMPO_MS} ms)`);
  const host = await cliente('Iker', 'jugar');
  const b = await cliente('Bea', 'pasar1');
  const c = await cliente('Carlos', 'dormir');
  host.enviar({ t: 'crear', nombre: 'Iker' });
  await esperar(host, s => s.fase === 'espera'); const codigo = host.s.codigo; log('sala creada', codigo);
  b.enviar({ t: 'unir', codigo, nombre: 'Bea' }); c.enviar({ t: 'unir', codigo: codigo.toLowerCase(), nombre: 'Carlos' });
  await esperar(host, s => s.jugadores.length === 3); log('3 jugadores en la sala');
  b.enviar({ t: 'empezar' }); await new Promise(r => setTimeout(r, 100)); assert.ok(b.errores.length, 'invitado no puede empezar');
  [host, b, c].forEach(autoJugar);
  host.enviar({ t: 'empezar' }); await esperar(c, s => s.fase === 'eleccion'); log('empieza; central =', host.s.central === host.id ? 'Iker' : '?');
  // Duelo 1: Iker vs Carlos (Carlos no contesta -> cae)
  host.enviar({ t: 'elegir', rival: c.id });
  await esperar(b, s => s.fase === 'duelo'); log('duelo 1: Iker vs Carlos, empieza', b.s.duelo.turno === c.id ? 'Carlos (oponente)' : 'Iker');
  assert.strictEqual(b.s.duelo.turno, c.id);
  await esperar(host, s => s.fase === 'caida'); log('cae', host.s.ultimaCaida.id === c.id ? 'Carlos' : '??', 'por', host.s.ultimaCaida.motivo, '· respuesta:', host.s.ultimaCaida.palabra);
  assert.strictEqual(host.s.ultimaCaida.id, c.id);
  await esperar(host, s => s.fase === 'eleccion');
  // Duelo 2: Iker vs Bea. Bea pasa una vez y contesta; Iker contesta. Para acabar, Iker deja de contestar.
  host.enviar({ t: 'elegir', rival: b.id });
  await esperar(host, s => s.fase === 'duelo'); log('duelo 2: Iker vs Bea');
  await esperar(host, () => host.eventos.filter(e => e.tipo === 'acierto').length >= 3, 30000);
  const ac = host.eventos.filter(e => e.tipo === 'acierto'); log('aciertos registrados:', ac.map(e => (e.id === host.id ? 'Iker' : 'Bea') + ':' + e.palabra).join(', '));
  assert.ok(host.eventos.some(e => e.tipo === 'pasar' && e.id === b.id && e.comodin), 'Bea usó PASAR con comodín');
  assert.ok(host.eventos.some(e => e.tipo === 'fallo'), 'hubo fallos (letras incorrectas)');
  host.estrategia = 'dormir';
  await esperar(host, s => s.fase === 'fin', 30000);
  log('fin de partida, gana', host.s.ganador === b.id ? 'Bea' : host.s.ganador === host.id ? 'Iker' : '?');
  assert.strictEqual(host.s.ganador, b.id);
  assert.strictEqual(c.s.fase, 'fin', 'los espectadores (eliminados) también reciben el estado');
  // revancha y desconexión
  host.enviar({ t: 'revancha' }); await esperar(b, s => s.fase === 'espera'); log('revancha: sala vuelve a espera con', b.s.jugadores.length, 'jugadores');
  b.ws.close(); await esperar(host, s => s.jugadores.length === 2); log('desconexión en espera gestionada');
  [host, c].forEach(x => x.ws.close());
  // estáticos
  for (const u of ['/', '/web/index.html', '/multiplayer/', '/web/js/app.js', '/server/juego.js']) {
    const r = await fetch(`http://localhost:${process.env.PORT}${u}`); log('GET', u, r.status);
    assert.strictEqual(r.status, u.startsWith('/server') ? 403 : 200);
  }
  log('OK');
}

(async () => {
  try { await pruebaUnitaria(); await pruebaRed(); console.log('\nTODAS LAS PRUEBAS OK'); process.exit(0); }
  catch (e) { console.error('FALLO:', e); process.exit(1); }
})();
