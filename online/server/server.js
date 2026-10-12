'use strict';
// Servidor de ¡Ahora Caigo! online: HTTP estático (carpeta online/) + WebSocket en /ws
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');
const { Sala, genCodigo } = require('./juego');

const PORT = process.env.PORT || 8080;
const RAIZ = path.resolve(__dirname, '..');   // sirve online/ (index.html, web/, multiplayer/)
const TIEMPO_MS = +process.env.TIEMPO_MS || undefined;
const PAUSA_MS = process.env.PAUSA_MS != null ? +process.env.PAUSA_MS : undefined;

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/salud') { res.writeHead(200); return res.end('ok'); }
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(RAIZ, path.normalize(p));
  if (!f.startsWith(RAIZ) || f.includes(`${path.sep}server${path.sep}`) || f.includes(`${path.sep}.git`)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (err, st) => {
    if (err || !st.isFile()) {
      if (!err && st.isDirectory()) { res.writeHead(301, { Location: p + '/' }); return res.end(); }
      res.writeHead(404); return res.end('No encontrado');
    }
    const type = MIME[path.extname(f).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
    if (range) {
      let start = range[1] ? +range[1] : st.size - +range[2];
      let end = range[1] && range[2] ? Math.min(+range[2], st.size - 1) : st.size - 1;
      if (start >= st.size || start > end) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end(); }
      res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1 });
      return fs.createReadStream(f, { start, end }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(f).pipe(res);
  });
});

const salas = new Map();          // codigo -> Sala
const conexiones = new Map();     // sala codigo -> Map(id -> ws)

function emitir(codigo) {
  const sala = salas.get(codigo); const cs = conexiones.get(codigo);
  if (!sala || !cs) return;
  for (const [id, ws] of cs) if (ws.readyState === 1) ws.send(JSON.stringify({ t: 'estado', s: sala.vista(id) }));
}
function evento(codigo, ev) {
  const cs = conexiones.get(codigo); if (!cs) return;
  for (const ws of cs.values()) if (ws.readyState === 1) ws.send(JSON.stringify({ t: 'evento', e: ev }));
}

function crearSala() {
  const codigo = genCodigo(new Set(salas.keys()));
  const sala = new Sala(codigo, { tiempoMs: TIEMPO_MS, pausaMs: PAUSA_MS });
  sala.onCambio = () => emitir(codigo);
  sala.onEvento = (e) => evento(codigo, e);
  salas.set(codigo, sala); conexiones.set(codigo, new Map());
  return sala;
}

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 4096 });
wss.on('connection', (ws) => {
  const id = crypto.randomBytes(6).toString('hex');
  let codigo = null;
  const enviar = (m) => ws.readyState === 1 && ws.send(JSON.stringify(m));
  enviar({ t: 'hola', id });
  ws.on('message', (raw) => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    let r = { ok: true };
    if (m.t === 'crear' || m.t === 'unir') {
      if (codigo) return enviar({ t: 'error', msg: 'Ya estás en una sala' });
      const sala = m.t === 'crear' ? crearSala() : salas.get(String(m.codigo || '').toUpperCase().trim());
      if (!sala) return enviar({ t: 'error', msg: 'No existe esa sala' });
      conexiones.get(sala.codigo).set(id, ws);
      r = sala.unir(id, m.nombre);
      if (r.error) { conexiones.get(sala.codigo).delete(id); return enviar({ t: 'error', msg: r.error }); }
      codigo = sala.codigo;
      enviar({ t: 'sala', codigo });
      emitir(codigo);
      return;
    }
    const sala = codigo && salas.get(codigo);
    if (!sala) return enviar({ t: 'error', msg: 'No estás en una sala' });
    switch (m.t) {
      case 'empezar': r = sala.empezar(id); break;
      case 'elegir': r = sala.elegir(id, m.rival); break;
      case 'letra': r = sala.letra(id, m.letra); break;
      case 'palabra': r = sala.palabra(id, m.texto); break;
      case 'pasar': r = sala.pasar(id); break;
      case 'revancha': r = sala.revancha(id); break;
      case 'ping': return enviar({ t: 'pong', ts: m.ts, srv: Date.now() });
      default: r = { error: 'Mensaje desconocido' };
    }
    if (r && r.error) enviar({ t: 'error', msg: r.error });
  });
  ws.on('close', () => {
    if (!codigo) return;
    const sala = salas.get(codigo); const cs = conexiones.get(codigo);
    cs?.delete(id);
    sala?.salir(id);
    if (cs && cs.size === 0) { sala?.destruir(); salas.delete(codigo); conexiones.delete(codigo); }
  });
});

// keep-alive (algunos hostings cortan conexiones inactivas)
setInterval(() => wss.clients.forEach(ws => ws.readyState === 1 && ws.ping()), 25000).unref();

server.listen(PORT, () => console.log(`¡Ahora Caigo! online en http://localhost:${PORT}/  (WebSocket en /ws)`));
module.exports = server;
