// v1.27: capturas a mitad de animación de los 6 logos originales, rotación por programa y Opciones
import puppeteer from 'puppeteer-core';
const [base, out] = process.argv.slice(2), W = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { window.__noAviso = true; localStorage.setItem('ac_logo_cab', 'orig_rota'); localStorage.removeItem('ac_logo_rota'); });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
for (const [id] of await p.evaluate(() => window.__logoOrigApi.lista)) {
  p.evaluate(i => window.__logoOrigApi.card('orig_' + i, 9000), id).catch(() => {});
  for (const t of [0.35, 1.0, 2.2]) { await p.waitForFunction(t => window.__logoOrig && window.__logoOrig.t > t, { timeout: 30000, polling: 50 }, t); await p.screenshot({ path: `${out}/original_animado_${id}_t${t}.png` }); }
  await p.evaluate(() => { const d = document.getElementById('logoOrig'); d && d.click(); }); await W(300); console.log('ok', id);
}
const rot = []; for (let k = 0; k < 7; k++) { p.evaluate(() => window.__logoOrigApi.card('orig_rota', 800)).catch(() => {}); await p.waitForFunction(() => window.__logoOrig, { timeout: 20000, polling: 50 }); rot.push(await p.evaluate(() => window.__logoOrig.id)); await W(1000); }
console.log('rotacion', rot.join(','));
await p.evaluate(() => __ac.menu('options')); await W(800); await p.evaluate(() => document.getElementById('optLogo126').scrollIntoView()); await W(700); await p.screenshot({ path: `${out}/opciones_logo_v127.png` });
await p.evaluate(() => document.getElementById('optLogo126').scrollIntoView({ block: 'end' })); await W(500); await p.screenshot({ path: `${out}/opciones_logo_v127_b.png` });
console.log('ERRORES', errs); await b.close();
