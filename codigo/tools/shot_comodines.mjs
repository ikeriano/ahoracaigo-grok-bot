// v1.25: capturas de la selección (es y AR) y del catálogo de comodines en Opciones
import puppeteer from 'puppeteer-core';
const base = process.argv[2], out = process.argv[3] || 'tmp/cmd/s';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
let errs = 0; const espera = ms => new Promise(r => setTimeout(r, ms));
for (const ar of [false, true]) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
  await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false, lee: false })); window.__noCabVideo = true; window.__noAviso = true; });
  await p.goto(base + 'index.html' + (ar ? '?mode=argentina' : '')); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
  await espera(1500); await p.evaluate(() => { const A = window.__cmdApi; A.elige(A.azar(6)); }); await espera(900);
  await p.screenshot({ path: `${out}_seleccion${ar ? '_ar' : ''}.png` });
  if (!ar) { await p.evaluate(() => { document.getElementById('cmdSel').remove(); window.__menu('options'); }); await espera(1200);
    await p.evaluate(() => { const o = document.getElementById('optComodines'); o && o.scrollIntoView(); }); await espera(600); await p.screenshot({ path: `${out}_catalogo.png` });
    await p.evaluate(() => { document.getElementById('cmdCat').scrollIntoView({ block: 'end' }); }); await espera(500); await p.screenshot({ path: `${out}_catalogo2.png` }); }
  await p.close();
}
console.log('ERRORES', errs); await b.close();
