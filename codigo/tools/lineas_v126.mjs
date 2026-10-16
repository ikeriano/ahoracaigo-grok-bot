// v1.26: saca del juego las frases nuevas que necesitan voz → /tmp/lineas126.json
import puppeteer from 'puppeteer-core'; import fs from 'fs';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.goto(process.argv[2] + 'index.html'); await p.waitForFunction('window.__pres && window.__eng', { timeout: 120000 });
const r = await p.evaluate(async () => {
  const P = [], fl = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(fl) : v && typeof v === 'object' ? Object.values(v).flatMap(fl) : [];
  for (const d of window.__pres.datos) for (const k of ['saludo', 'intro', 'nt', 'duelo', 'moneda', 'decision', 'final', 'gana', 'pierde', 'planta', 'adios']) for (const t of fl(d[k])) P.push([d.vk, t]);
  const q = await (await fetch('voz/q/index.json')).json();
  return { pres: P, q: window.__pres.qlist().filter(x => q[x.h] == null) };
});
fs.writeFileSync('/tmp/lineas126.json', JSON.stringify(r)); console.log(r.pres.length, r.q.length); await b.close();
