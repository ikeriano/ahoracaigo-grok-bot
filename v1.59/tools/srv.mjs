// Servidor de prueba: overlay (ov/) sobre el www 1.58 original. Uso: node srv.mjs [puerto]
import http from 'http'; import fs from 'fs'; import path from 'path';
const port = +(process.argv[2] || 8159);
const bases = ['/workspace/ac_159/ov', '/workspace/ac_159/www158_orig'];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.webp': 'image/webp' };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html';
  for (const b of bases) {
    const f = path.join(b, u); if (!f.startsWith(b)) continue;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) {
      const st = fs.statSync(f); const h = { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' };
      const r = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
      if (r) { const a = r[1] ? +r[1] : 0, z = r[2] ? +r[2] : st.size - 1; res.writeHead(206, { ...h, 'Content-Range': `bytes ${a}-${z}/${st.size}`, 'Content-Length': z - a + 1 }); fs.createReadStream(f, { start: a, end: z }).pipe(res); }
      else { res.writeHead(200, { ...h, 'Content-Length': st.size }); fs.createReadStream(f).pipe(res); }
      return;
    }
  }
  res.writeHead(404); res.end('no');
}).listen(port, '127.0.0.1', () => console.log('srv', port));
