import puppeteer from 'puppeteer-core';
const [base, out, logo = 'plato', times = '0.8,1.6,2.6,4,5.8,7,9.5,12.5,15.5,18.5,22,25'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 473 }); let errs = 0;
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument((l, mp) => { if (mp) localStorage.setItem('ac_miprog', JSON.stringify({ act: mp, propios: [], cab: {} })); localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'media', gradas: true })); localStorage.setItem('ac_theme', 'nochebuena'); window.__cab136Logo = l; window.__cabT = 0; if (window.name !== 'x') {}  window.__noAviso = true; window.__noMono = true; }, logo, process.env.MP || '');
await p.goto(base + 'index.html?mode=programa'); await p.waitForFunction('window.__cabSiempre', { timeout: 120000, polling: 20 });
let i = 0;
for (const t of times.split(',').map(Number)) { await p.evaluate(t => window.__cabT = t, t); await new Promise(r => setTimeout(r, t > 6.3 ? 2200 : 700)); const info = await p.evaluate(() => window.__cabSiempre && JSON.stringify(window.__cabSiempre));
  await p.screenshot({ path: `${out}_${String(++i).padStart(2, '0')}.png` }); console.log(i, t, info); }
await p.evaluate(() => window.__cabT = 99); await new Promise(r => setTimeout(r, 3000)); await p.screenshot({ path: `${out}_${String(++i).padStart(2, '0')}.png` });
console.log('ERRORES', errs); await b.close();
