// v1.23: menú AHORA CAIGO ARGENTINA y sus submodos (node tools/test_menu_ar.mjs URL)
import puppeteer from 'puppeteer-core';
const base = process.argv[2]; const espera = ms => new Promise(r => setTimeout(r, ms));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let err = 0; p.on('pageerror', e => { err++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => __ac.menu('main')); await espera(1000); await p.screenshot({ path: 'tmp/ar/menu_main.png' });
await p.evaluate(() => [...document.querySelectorAll('#menu button')].find(x => /AHORA CAIGO ARGENTINA/.test(x.textContent)).click()); await espera(800); await p.screenshot({ path: 'tmp/ar/menu_ar_carga.png' }); await espera(2600); await p.screenshot({ path: 'tmp/ar/menu_ar.png' });
console.log('AR', await p.evaluate(() => [window.__AR, [...document.querySelectorAll('#menu button')].map(x => x.innerText.split('\n')[0])]));
await p.evaluate(() => __ac.menu('artrain')); await espera(800); await p.screenshot({ path: 'tmp/ar/menu_artrain.png' });
console.log('TRAIN', await p.evaluate(() => [...document.querySelectorAll('#menu button')].map(x => x.innerText.split('\n')[0]).join(', ')));
await p.evaluate(() => __ac.menu('main')); await espera(500); console.log('fuera AR', await p.evaluate(() => window.__AR)); console.log('ERRORES', err); await b.close();
