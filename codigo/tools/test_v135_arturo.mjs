// v1.35: el sketch de Don Arturo suena (clips Piper) aunque el navegador no tenga speechSynthesis (como el WebView de Android)
import puppeteer from 'puppeteer-core';
const [base, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 576 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; try { delete window.speechSynthesis; Object.defineProperty(window, 'speechSynthesis', { value: undefined }); } catch (e) { } });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
console.log('speechSynthesis', await p.evaluate(() => typeof window.speechSynthesis), 'frases', await p.evaluate(() => window.__arturoGuion.length), 'con clip', await p.evaluate(() => window.__arturoGuion.filter(l => l.clip).length), 'dur', await p.evaluate(() => window.__arturoGuion.at(-1).t1.toFixed(1)));
await p.evaluate(() => { window.__promoArturo(); }); await W(14000); await p.screenshot({ path: `${out}/sketch_arturo_voz_1.png` });
await W(14000); await p.screenshot({ path: `${out}/sketch_arturo_voz_2.png` });
console.log('clips que han sonado', await p.evaluate(() => window.__arturoVoz.length), JSON.stringify(await p.evaluate(() => window.__arturoVoz.slice(0, 6))));
// Apertura del programa (Promos): Adrián con clips
await p.evaluate(() => document.querySelector('#promo3d') && document.querySelector('#promo3d').click()); await W(2000);
await p.evaluate(() => __ac.menu('promos')); await W(800);
await p.evaluate(() => { const x = [...document.querySelectorAll('#menu .mbtn')].find(x => x.textContent.includes('Apertura del programa')); x && x.click(); });
await W(24000); await p.screenshot({ path: `${out}/apertura_voz.png` });
console.log('apertura clips', await p.evaluate(() => (window.__aperturaVoz || []).length));
console.log('ERRORES', errs); await b.close();
