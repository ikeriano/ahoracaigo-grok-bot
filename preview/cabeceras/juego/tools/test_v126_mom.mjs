// v1.26: prueba directa de los momentos de cámara, los efectos de especiales y el panel de Opciones
import puppeteer from 'puppeteer-core';
const [base, out, theme = 'navidad', pres = 'bruno'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(pr => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: true })); localStorage.setItem('ac_pres', pr); window.__noAviso = true; }, pres);
await p.goto(base + 'index.html?theme=' + theme); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { document.getElementById('menu').classList.add('hidden'); window.__S = { alive: true, w: ms => new Promise(r => setTimeout(r, ms)), until(f) { return new Promise(r => { const q = () => f() ? r() : setTimeout(q, 50); q(); }); } }; window.__C = window.__pres.ctx(window.__S); window.__C.a = { placar: 25000 }; });
for (const [m, at] of [['entrada', 2300], ['publico', 1600], ['backstage', 1800], ['bote', 2600]]) {
  p.evaluate(m => window.__pres.momentos[m](window.__C).catch(e => console.error(e)), m).catch(() => {});
  await W(at); await p.screenshot({ path: `${out}/momento_${m}.png` }); await W(4500); console.log('ok', m);
}
console.log('ERRORES', errs); await b.close();
