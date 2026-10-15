// v1.23: modo AHORA CAIGO ARGENTINA desde el menú (node tools/test_modo_ar.mjs URL)
import puppeteer from 'puppeteer-core';
const base = process.argv[2]; const espera = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let err = 0; p.on('pageerror', e => { err++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; window.__botForce = 'fail'; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => __ac.menu('play')); await espera(800); await p.screenshot({ path: 'tmp/ar/modo_menu.png' });
await p.evaluate(() => [...document.querySelectorAll('#menu button')].find(x => /AHORA CAIGO ARGENTINA/.test(x.textContent)).click());
const bur = []; for (let k = 0; k < 400; k++) { await espera(1000); await p.evaluate(() => { const b = [...document.querySelectorAll('#actions button, #hud button, .ui button')].find(x => x.offsetParent && /Ir al centro|Continuar|Empezar|¡Ya!|Elegir|^\s*\d+\s*$/.test(x.textContent)); b && b.click(); }); const t = await p.evaluate(() => [...document.querySelectorAll('.bubble, #bubble, .say, .bname')].map(x => x.innerText).join(' | ')); if (t && !bur.includes(t)) bur.push(t); if (k === 25) await p.screenshot({ path: 'tmp/ar/modo_intro.png' }); if (await p.evaluate(() => !!(window.__ar && document.querySelector('#arP.in')))) break; }
await espera(2500); await p.screenshot({ path: 'tmp/ar/modo_duelo1.png' });
console.log('BOCADILLOS', JSON.stringify(bur.slice(0, 30)));
console.log('prueba1', await p.evaluate(() => JSON.stringify([window.__prueba, window.__ar && window.__ar.id, window.__AR])));
await p.evaluate(() => __ac.menu('main')); await espera(800); console.log('tras menú __AR=', await p.evaluate(() => window.__AR)); console.log('ERRORES', err); await b.close();
