// v1.28: frases nuevas que necesitan voz → /tmp/lineas128.json (preguntas de las pruebas nuevas, presentadores y Modo Fiesta con Adrián)
import puppeteer from 'puppeteer-core'; import fs from 'fs';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.goto(process.argv[2] + 'index.html'); await p.waitForFunction('window.__fiesta && window.__pres && window.__q128', { timeout: 120000 });
const r = await p.evaluate(async () => {
  const Q = window.__q128, V = Q.V128, fl = v => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(fl) : v && typeof v === 'object' ? Object.values(v).flatMap(fl) : [];
  const tq = new Set();
  for (const x of [...V.ordena, ...V.cadena]) tq.add(x[0]);
  for (const x of V.borrosa) tq.add('La foto borrosa. Pista: ' + x.l);
  for (const [q] of V.vot) { tq.add(q + '. VERDADERO, o FALSO.'); tq.add(q + '. FALSO, o VERDADERO.'); }
  for (const [q] of V.realidad) { tq.add(q + '. REALIDAD, o FICCIÓN.'); tq.add(q + '. FICCIÓN, o REALIDAD.'); }
  const qi = await (await fetch('voz/q/index.json')).json();
  const q = [...tq].map(t => ({ t: Q.Ao(t), h: Q.vc(Q.Ao(t)) })).filter(x => qi[x.h] == null);
  const host = [...Object.values(V.dichos), ...V.tartazo, ...fl(V.parejas), ...fl(V.findeano), ...V.bomba.lineas];
  const pres = []; for (const t of host) { pres.push(['adr', t]); for (const d of window.__pres.datos) pres.push([d.vk, t]); }
  const st = [...fl(window.__fiesta.FIESTA.adrian).map(t => ['davefx', t]), ...fl(window.__fiesta.FIESTA.buzz).map(t => ['p_buzz', t])];
  for (const d of Q.PAREJAS) for (const t of d[4]) st.push([d[2], t]);
  return { pres, q, st };
});
fs.writeFileSync('/tmp/lineas128.json', JSON.stringify(r)); console.log(r.pres.length, r.q.length, r.st.length); await b.close();
