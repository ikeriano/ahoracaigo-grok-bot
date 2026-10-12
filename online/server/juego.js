'use strict';
// Lógica autoritativa del juego (sin red): salas, duelos, relojes, trampillas y PASAR.
const fs = require('fs');
const path = require('path');

const TIEMPO_DUELO_MS = 30000;     // reloj de cada jugador en un duelo (como el original)
const COMODINES = 2;               // comodines PASAR por jugador
const PAUSA_CAIDA_MS = 4000;       // tiempo para ver la caída antes de seguir

const PREGUNTAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'preguntas.json'), 'utf8'));

const norm = (c) => c.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// «PA[L]A[B]RA» -> { word, hidden[], missing[] (letras normalizadas distintas) }
function parsePalabra(p) {
  let word = '', hidden = [], dentro = false;
  for (const ch of p) {
    if (ch === '[') { dentro = true; continue; }
    if (ch === ']') { dentro = false; continue; }
    word += ch; hidden.push(dentro && ch !== ' ');
  }
  const missing = [];
  [...word].forEach((ch, i) => { if (hidden[i]) { const n = norm(ch); if (!missing.includes(n)) missing.push(n); } });
  return { word, hidden, missing };
}

function genCodigo(existentes) {
  const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let c;
  do { c = Array.from({ length: 4 }, () => L[Math.floor(Math.random() * L.length)]).join(''); } while (existentes.has(c));
  return c;
}

class Sala {
  constructor(codigo, opts = {}) {
    this.codigo = codigo;
    this.jugadores = [];          // {id, nombre, vivo, comodines, conectado}
    this.hostId = null;
    this.fase = 'espera';         // espera | eleccion | duelo | caida | fin
    this.central = null;          // id del concursante de la trampilla central
    this.duelo = null;
    this.usadas = new Set();
    this.tiempoMs = opts.tiempoMs || TIEMPO_DUELO_MS;
    this.pausaMs = opts.pausaMs ?? PAUSA_CAIDA_MS;
    this.onCambio = () => {};
    this.onEvento = () => {};
    this._timer = null;
    this.ganador = null;
    this.historial = [];
  }

  jugador(id) { return this.jugadores.find(j => j.id === id); }

  unir(id, nombre) {
    if (this.fase !== 'espera') return { error: 'La partida ya ha empezado' };
    if (this.jugadores.length >= 11) return { error: 'Sala llena (máx. 11: 1 central + 10 oponentes)' };
    nombre = String(nombre || '').trim().slice(0, 16) || 'Jugador';
    if (this.jugadores.some(j => j.nombre.toLowerCase() === nombre.toLowerCase())) nombre += ' ' + (this.jugadores.length + 1);
    this.jugadores.push({ id, nombre, vivo: true, comodines: COMODINES, conectado: true });
    if (!this.hostId) this.hostId = id;
    this.onCambio();
    return { ok: true };
  }

  salir(id) {
    const j = this.jugador(id);
    if (!j) return;
    j.conectado = false;
    if (this.fase === 'espera') {
      this.jugadores = this.jugadores.filter(x => x.id !== id);
      if (this.hostId === id) this.hostId = this.jugadores[0]?.id || null;
    } else if (j.vivo) {
      // abandono = cae por la trampilla
      if (this.fase === 'duelo' && this.duelo && (this.duelo.a === id || this.duelo.b === id)) {
        this._caer(id, 'abandono');
      } else {
        j.vivo = false;
        if (this.central === id) this._nuevoCentral();
        this._comprobarFin();
      }
    }
    if (this.hostId === id) this.hostId = (this.jugadores.find(x => x.conectado) || {}).id || null;
    this.onCambio();
  }

  empezar(id) {
    if (id !== this.hostId) return { error: 'Solo el anfitrión puede empezar' };
    if (this.fase !== 'espera') return { error: 'Ya empezada' };
    if (this.jugadores.length < 2) return { error: 'Hacen falta al menos 2 jugadores' };
    // El anfitrión es el concursante central; los demás son oponentes en sus huellas.
    this.central = this.hostId;
    this.fase = 'eleccion';
    this.onEvento({ tipo: 'inicio' });
    this.onCambio();
    return { ok: true };
  }

  // El central elige huella (oponente)
  elegir(id, rivalId) {
    if (this.fase !== 'eleccion') return { error: 'No toca elegir' };
    if (id !== this.central) return { error: 'Elige el concursante central' };
    const r = this.jugador(rivalId);
    if (!r || !r.vivo || r.id === id) return { error: 'Oponente no válido' };
    this._iniciarDuelo(id, r.id);
    return { ok: true };
  }

  _pregunta() {
    let libres = PREGUNTAS.map((_, i) => i).filter(i => !this.usadas.has(i));
    if (!libres.length) { this.usadas.clear(); libres = PREGUNTAS.map((_, i) => i); }
    const idx = libres[Math.floor(Math.random() * libres.length)];
    this.usadas.add(idx);
    const q = PREGUNTAS[idx];
    const pp = parsePalabra(q.p);
    return { idx, tipo: q.tipo, q: q.q, img: q.img || null, ...pp, reveladas: [] };
  }

  _iniciarDuelo(central, rival) {
    // Como en el programa: empieza el oponente.
    this.duelo = {
      a: central, b: rival,
      turno: rival,
      reloj: { [central]: this.tiempoMs, [rival]: this.tiempoMs },
      desde: Date.now(),
      pregunta: this._pregunta(),
      ultimoFallo: null,
    };
    this.fase = 'duelo';
    this.onEvento({ tipo: 'duelo', central, rival });
    this._programar();
    this.onCambio();
  }

  _consumir() {
    const d = this.duelo; const now = Date.now();
    d.reloj[d.turno] = Math.max(0, d.reloj[d.turno] - (now - d.desde));
    d.desde = now;
  }

  _programar() {
    clearTimeout(this._timer);
    const d = this.duelo; if (!d) return;
    this._timer = setTimeout(() => this.tick(), Math.max(5, d.reloj[d.turno]) + 5);
  }

  tick() {
    if (this.fase !== 'duelo' || !this.duelo) return;
    this._consumir();
    if (this.duelo.reloj[this.duelo.turno] <= 0) this._caer(this.duelo.turno, 'tiempo');
    else this._programar();
  }

  _pasarTurno(nuevaPregunta = true) {
    const d = this.duelo;
    this._consumir();
    d.turno = d.turno === d.a ? d.b : d.a;
    d.desde = Date.now();
    if (nuevaPregunta) d.pregunta = this._pregunta();
    this._programar();
  }

  letra(id, letra) {
    if (this.fase !== 'duelo') return { error: 'No hay duelo' };
    const d = this.duelo;
    if (id !== d.turno) return { error: 'No es tu turno' };
    this._consumir();
    if (d.reloj[id] <= 0) { this._caer(id, 'tiempo'); return { ok: true }; }
    const L = norm(String(letra || '').slice(0, 1));
    if (!/^[A-ZÑ0-9]$/.test(L)) return { error: 'Letra no válida' };
    const q = d.pregunta;
    if (q.missing.includes(L) && !q.reveladas.includes(L)) {
      q.reveladas.push(L);
      if (q.missing.every(m => q.reveladas.includes(m))) {
        this.onEvento({ tipo: 'acierto', id, palabra: q.word });
        this._pasarTurno(true);
      } else this.onEvento({ tipo: 'letra', id, letra: L });
    } else {
      d.ultimoFallo = L;
      this.onEvento({ tipo: 'fallo', id, letra: L });
    }
    this.onCambio();
    return { ok: true };
  }

  // Responder la palabra entera (equivale a escribir todas las letras)
  palabra(id, texto) {
    if (this.fase !== 'duelo') return { error: 'No hay duelo' };
    const d = this.duelo;
    if (id !== d.turno) return { error: 'No es tu turno' };
    const t = [...norm(String(texto || ''))].filter(c => c !== ' ').join('');
    const w = [...norm(d.pregunta.word)].filter(c => c !== ' ').join('');
    if (t === w) {
      d.pregunta.reveladas = [...d.pregunta.missing];
      this._consumir();
      if (d.reloj[id] <= 0) { this._caer(id, 'tiempo'); return { ok: true }; }
      this.onEvento({ tipo: 'acierto', id, palabra: d.pregunta.word });
      this._pasarTurno(true);
      this.onCambio();
      return { ok: true };
    }
    // Si no es la palabra completa, se prueban sus letras una a una
    for (const c of t) { if (this.fase !== 'duelo' || this.duelo !== d || d.turno !== id) break; this.letra(id, c); }
    return { ok: true };
  }

  pasar(id) {
    if (this.fase !== 'duelo') return { error: 'No hay duelo' };
    const d = this.duelo; const j = this.jugador(id);
    if (id !== d.turno) return { error: 'No es tu turno' };
    if (j.comodines > 0) {
      // Con comodín: la misma pregunta pasa al oponente
      j.comodines--;
      this.onEvento({ tipo: 'pasar', id, comodin: true });
      const q = d.pregunta;
      this._pasarTurno(false);
      d.pregunta = q;
    } else {
      // Sin comodines: otra pregunta, el reloj sigue corriendo
      this._consumir();
      d.pregunta = this._pregunta();
      this.onEvento({ tipo: 'pasar', id, comodin: false });
    }
    this.onCambio();
    return { ok: true };
  }

  _caer(id, motivo) {
    clearTimeout(this._timer);
    const d = this.duelo;
    const j = this.jugador(id); j.vivo = false;
    const ganador = d ? (d.a === id ? d.b : d.a) : null;
    this.historial.push({ cae: id, gana: ganador, motivo });
    this.fase = 'caida';
    this.ultimaCaida = { id, ganador, motivo, palabra: d?.pregunta?.word };
    this.onEvento({ tipo: 'caida', id, ganador, motivo, palabra: d?.pregunta?.word });
    if (id === this.central) this.central = ganador;   // si cae el central, el rival ocupa su sitio
    this.duelo = null;
    this.onCambio();
    setTimeout(() => this._despuesCaida(), this.pausaMs);
  }

  _nuevoCentral() {
    const v = this.jugadores.filter(j => j.vivo);
    this.central = v.length ? v[0].id : null;
  }

  _comprobarFin() {
    const vivos = this.jugadores.filter(j => j.vivo);
    if (vivos.length <= 1) {
      this.fase = 'fin';
      this.ganador = vivos[0]?.id || null;
      clearTimeout(this._timer);
      this.onEvento({ tipo: 'fin', ganador: this.ganador });
      return true;
    }
    return false;
  }

  _despuesCaida() {
    if (this.fase !== 'caida') return;
    if (!this._comprobarFin()) {
      if (!this.jugador(this.central)?.vivo) this._nuevoCentral();
      this.fase = 'eleccion';
    }
    this.onCambio();
  }

  revancha(id) {
    if (id !== this.hostId || this.fase !== 'fin') return { error: 'Solo el anfitrión, al final' };
    this.jugadores = this.jugadores.filter(j => j.conectado);
    this.jugadores.forEach(j => { j.vivo = true; j.comodines = COMODINES; });
    this.fase = 'espera'; this.ganador = null; this.central = null; this.historial = [];
    this.onCambio();
    return { ok: true };
  }

  // Estado visible para un jugador (no se envía la respuesta oculta)
  vista(paraId) {
    const d = this.duelo;
    let duelo = null;
    if (d) {
      const now = Date.now();
      const reloj = { ...d.reloj };
      reloj[d.turno] = Math.max(0, reloj[d.turno] - (now - d.desde));
      const q = d.pregunta;
      duelo = {
        a: d.a, b: d.b, turno: d.turno, reloj,
        pregunta: {
          tipo: q.tipo, q: q.q, img: q.img,
          casillas: [...q.word].map((ch, i) => ch === ' ' ? ' ' : (!q.hidden[i] || q.reveladas.includes(norm(ch)) ? ch : '_')),
          faltan: q.missing.length - q.reveladas.length,
        },
      };
    }
    return {
      codigo: this.codigo, fase: this.fase, yo: paraId, host: this.hostId, central: this.central,
      jugadores: this.jugadores.map(j => ({ id: j.id, nombre: j.nombre, vivo: j.vivo, comodines: j.comodines, conectado: j.conectado })),
      duelo, ultimaCaida: this.fase === 'caida' ? this.ultimaCaida : null, ganador: this.ganador,
      tiempoMs: this.tiempoMs,
    };
  }

  destruir() { clearTimeout(this._timer); }
}

module.exports = { Sala, genCodigo, parsePalabra, PREGUNTAS, TIEMPO_DUELO_MS };
