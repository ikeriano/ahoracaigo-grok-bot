// v1.33: «Hacer mis propias promos» › Vista previa en condiciones de móvil modesto: sin red, CPU lenta, Piper colgado; y Salir
import puppeteer from 'puppeteer-core';
const [base, out, caso = 'offline'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 473 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(c => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; if (c !== 'piperCuelga' && c !== 'sinVoz') window.__forzarModesto = true; if (c === 'piperCuelga' || c === 'sinVoz') { const W0 = window.Worker; window.Worker = function (u) { if (/piper/.test(u)) { return { postMessage() { }, terminate() { }, set onmessage(f) { }, set onerror(f) { } }; } return new W0(u); }; } }, caso);
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
const cdp = await p.target().createCDPSession();
if (caso === 'offline' || caso === 'salir') await cdp.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
if (caso === 'sinVoz') { await p.setRequestInterception(true); p.on('request', r => { if (/voz\/pal\//.test(r.url())) return r.abort(); r.continue(); }); await p.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.getRegistrations().then(L => L.forEach(x => x.unregister()))); }
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const clic = t => p.evaluate(t => { const x = [...document.querySelectorAll('button,.mbtn')].find(x => x.textContent.includes(t) && x.offsetParent); x && x.click(); return !!x; }, t);
await p.evaluate(() => __ac.menu('promos')); await W(1000);
console.log('creador', await clic('Creador de promos')); await W(1500);
console.log('propias', await clic('Hacer mis propias promos')); await W(1000);
await p.evaluate(() => { const z = [...document.querySelectorAll('textarea')].find(x => x.offsetParent); z.value = 'promo divertida del especial de Navidad, el viernes a las 22:00, con Lucía y Marcos, bote de 50.000 euros'; });
console.log('guion', await clic('Escribir el guion')); await W(1500);
const t0 = Date.now(); console.log('vista', await clic('Vista previa'));
if (caso === 'salir') { await W(1500); await p.screenshot({ path: `${out}/salir_prep.png` }); await clic('Salir'); await W(3000); const queda = await p.evaluate(() => !!document.querySelector('.promoPlay')); console.log('tras Salir queda pantalla negra:', queda, 'fase', await p.evaluate(() => window.__promoFase)); }
else {
  await p.waitForFunction(() => window.__promoFase === 'play', { timeout: 60000, polling: 200 }).then(() => console.log('empieza en', ((Date.now() - t0) / 1000).toFixed(1), 's · voz:', 0)).catch(() => console.log('NO EMPIEZA'));
  console.log('voz', await p.evaluate(() => window.__promoVoz));
  await W(2500); await p.screenshot({ path: `${out}/promo_${caso}_1.png` }); await W(4000); await p.screenshot({ path: `${out}/promo_${caso}_2.png` });
  await p.waitForFunction(() => window.__promoFase === 'fin', { timeout: 90000, polling: 300 }).then(() => console.log('termina en', ((Date.now() - t0) / 1000).toFixed(1), 's')).catch(() => console.log('NO TERMINA'));
  console.log('panel visible de nuevo', await p.evaluate(() => [...document.querySelectorAll('button')].some(x => x.textContent.includes('Vista previa') && x.offsetParent)));
}
console.log('ERRORES', errs); await b.close();
