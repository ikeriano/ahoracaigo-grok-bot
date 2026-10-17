import puppeteer from 'puppeteer-core';
const [base, out, host = 'buzz'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 720, height: 1280 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); }); p.on('console', m => m.type() === 'warning' || m.type() === 'error' ? console.log('C', m.text().slice(0, 200)) : 0);
await p.evaluateOnNewDocument(h => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja' })); localStorage.setItem('ac_fiestaHost', h); window.__noAviso = true; }, host);
await p.goto(base + 'index.html'); await p.waitForFunction('window.__fiesta && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
p.evaluate(() => window.__fiesta.modoFiesta({ auto: 'fail', nq: 2, rondas: (window.__SOLO || undefined) })).catch(() => {});
const est = e => p.waitForFunction(e => window.__fiestaEst && window.__fiestaEst.e === e, { timeout: 200000, polling: 50 }, e);
await W(1500); await p.screenshot({ path: `${out}/buzz_v2_plato.png` });
await W(2500); await p.screenshot({ path: `${out}/buzz_v2_saludo.png` });
for (const id of (process.env.SOLO || 'ordena,vot,borrosa,cadena').split(',')) {
  await est('preg_' + id); await W(1200); await p.screenshot({ path: `${out}/buzz_v2_${id}.png` }); console.log('shot', id);
  if (id === 'ordena') { await est('tartazo'); await W(700); await p.screenshot({ path: `${out}/buzz_v2_tartazo.png` }); await est('trampilla'); await W(450); await p.screenshot({ path: `${out}/buzz_v2_trampillazo.png` }); }
}
await est('fin').catch(() => 0); console.log('ERRORES', errs); await b.close();
