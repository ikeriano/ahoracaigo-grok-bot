// v1.32: Rosco en Entrenamiento con cada diseño (1..5): capturas con letras verdes, rojas y azules (pasadas)
import puppeteer from 'puppeteer-core';
const [base, out, dis = '1,2,3,4,5'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 576 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load/.test(m.text())) { errs++; console.log('ERR', m.text()); } });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; window.__meFirst = true; window.__duelClock = 300; window.__botClock = 4; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); } catch (e) { } }, 500));
for (const d of dis.split(',')) {
  await p.evaluate(d => localStorage.setItem('ac_rosco', d), d);
  await p.evaluate(() => __ac.menu('train')).catch(() => 0); await W(800);
  await p.evaluate(() => { const x = [...document.querySelectorAll('#menu .mbtn')].find(x => x.textContent.toLowerCase().startsWith('el rosco')); x && x.click(); });
  await p.waitForFunction(() => window.__ar && window.__ar.id === 'rosco' && window.__ar.escribe, { timeout: 90000, polling: 100 });
  // jugada: acierto, acierto, pasapalabra, fallo, acierto, pasapalabra, acierto...
  const plan = ['ok', 'ok', 'pasa', 'ok', 'mal', 'ok', 'pasa', 'ok', 'ok', 'pasa', 'ok'];
  for (const j of plan) {
    await p.waitForFunction(() => window.__ar.escribe && window.__ar.turno === 'me', { timeout: 60000, polling: 100 });
    await p.evaluate(j => { const A = window.__ar, q = A.q; if (j === 'pasa') return A.pasa(); q.celdas.filter(c => !c.fija).forEach((c, k) => A.escribe(j === 'mal' && k === 0 ? (c.sol === 'A' ? 'E' : 'A') : c.sol)); }, j);
    await W(j === 'ok' ? 1100 : 2600);
  }
  await p.waitForFunction(() => window.__ar.escribe && window.__ar.turno === 'me', { timeout: 60000, polling: 100 });
  await p.evaluate(() => { const A = window.__ar; A.escribe(A.q.celdas.find(c => !c.fija).sol); }); await W(500);
  await p.screenshot({ path: `${out}/rosco_d${d}.png` }); console.log('shot', d);
  await p.evaluate(() => { const A = window.__ar; A.P.me.clk = 0.2; A.P.bot.clk = 0.2; }); 
  await p.waitForFunction(() => [...document.querySelectorAll('#actions button')].some(x => x.textContent === 'Entrenamiento'), { timeout: 120000, polling: 300 }).catch(() => console.log('sin fin'));
  await p.evaluate(() => { const x = [...document.querySelectorAll('#actions button')].find(x => x.textContent === 'Entrenamiento'); x && x.click(); }); await W(1200);
}
await p.evaluate(() => localStorage.removeItem('ac_rosco')); await p.evaluate(() => localStorage.removeItem('ac_rosco')); await p.evaluate(() => __ac.menu('options')).catch(() => 0); await W(800);
await p.evaluate(() => { const r = document.getElementById('rowRosco132'); r && r.scrollIntoView({ block: 'center' }); }); await W(400);
await p.screenshot({ path: `${out}/rosco_opciones.png` });
console.log('ERRORES', errs); await b.close();
