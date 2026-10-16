// v1.26: capturas de los logos 3D y del panel de Opciones
import puppeteer from 'puppeteer-core';
const base = process.argv[2], out = process.argv[3];
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0;
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'media', gradas: false })); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
for (const id of (process.env.IDS || 'abismo,ninos,plato,s300,s300plato,azul').split(',')) {
  p.evaluate(i => window.__logo3dApi.card(i, 60000), id).catch(() => {});
  await p.waitForFunction('window.__logo3d && window.__logo3d.t > 3.2', { timeout: 60000 });
  await p.screenshot({ path: `${out}/logo3d_${id}.png` }); console.log('ok', id);
  await p.evaluate(() => document.getElementById('logo3d').click()); await new Promise(r => setTimeout(r, 500));
}
console.log('ERRORES', errs); await b.close();
