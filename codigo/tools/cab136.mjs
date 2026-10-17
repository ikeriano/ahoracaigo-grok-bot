import puppeteer from 'puppeteer-core';
const [base, out, modo, n = '22', paso = '2000'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 473 }); let errs = 0;
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(m => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'media', gradas: true })); localStorage.setItem('ac_theme', 'nochebuena'); if (m) localStorage.setItem('ac_cabecera136', m); window.__noAviso = true; window.__noMono = true; }, modo === 'def' ? '' : modo);
await p.goto(base + 'index.html?mode=programa'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
console.log('modo', await p.evaluate(() => window.__cab136 && __cab136.modo()));
for (let i = 1; i <= +n; i++) { await new Promise(r => setTimeout(r, +paso)); await p.screenshot({ path: `${out}_${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
console.log('ERRORES', errs); await b.close();
