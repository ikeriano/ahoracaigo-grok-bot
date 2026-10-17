// v1.34: «Poner voz a Buzz (mis audios)» (importar, asignar, recortar, probar, quitar), Modo Fiesta con audio propio y Promo de Buzz
import puppeteer from 'puppeteer-core';
const [base, out, dir] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 576 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load/.test(m.text())) { errs++; console.log('ERR', m.text()); } });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
// 1) Promo de Buzz (sin audio propio): fotogramas de cada bloque
await p.evaluate(() => __ac.menu('promos')); await W(800); await p.screenshot({ path: `${out}/promos_menu.png` });
await p.evaluate(() => { window.__promoT = 0; document.getElementById('promoBuzzBtn').click(); }); await p.waitForFunction(() => window.__promoBuzzFase === 'play', { timeout: 30000 });
for (const [t, n] of [[8.6, 'silla'], [12.6, 'titulo'], [19.1, 'bomba'], [21.9, 'tartazo'], [28.1, 'eliminado'], [32.6, 'pruebas'], [40, 'fantastico'], [46.5, 'final']]) { await p.evaluate(t => window.__promoT = t, t); await W(900); await p.screenshot({ path: `${out}/promo_buzz_${n}.png` }); }
await p.evaluate(() => { delete window.__promoT; document.querySelector('#promoBuzz button').click(); }); await W(800);
console.log('promo cerrada', await p.evaluate(() => !document.getElementById('promoBuzz')));
// 2) Opciones › Poner voz a Buzz
await p.evaluate(() => __ac.menu('options')); await W(800);
await p.evaluate(() => document.getElementById('rowBza').scrollIntoView({ block: 'center' })); await W(300); await p.screenshot({ path: `${out}/opciones_voz_buzz.png` });
await p.evaluate(() => document.querySelector('#rowBza button').click()); await W(500);
const [fc] = await Promise.all([p.waitForFileChooser(), p.evaluate(() => [...document.querySelectorAll('#bzaPanel button')].find(x => x.textContent.includes('Añadir audios')).click())]);
console.log('multiple', fc.isMultiple()); await fc.accept([`${dir}/mi_grito.mp3`, `${dir}/mi_risa.m4a`, `${dir}/mi_banda_sonora.mp4`]);
await p.waitForFunction(() => window.__bza.bzaLista().length === 3, { timeout: 20000 }); await W(800);
console.log('lista', JSON.stringify(await p.evaluate(() => window.__bza.bzaLista().map(x => [x.nombre, x.dur]))));
const elige = (mom, nombre) => p.evaluate((mom, nombre) => { const d = document.querySelector(`#bzaPanel .sl[data-mom="${mom}"]`), se = d.querySelector('select'); se.value = nombre === 'rnd' ? 'rnd' : [...se.options].find(o => o.textContent === nombre).value; se.onchange(); }, mom, nombre);
await elige('saludo', 'mi_grito.mp3'); await elige('tartazo', 'rnd'); await elige('victoria', 'mi_risa.m4a'); await elige('victoria', 'mi_grito.mp3'); await elige('promo', 'mi_banda_sonora.mp4');
await p.evaluate(() => { const d = document.querySelector('#bzaPanel .sl[data-mom="victoria"]'); const [a, b] = d.querySelectorAll('input[type=number]'); a.value = '1'; b.value = '3.5'; a.onchange(); }); await W(400);
await p.screenshot({ path: `${out}/voz_buzz_panel_arriba.png` });
await p.evaluate(() => document.querySelector('#bzaPanel .sl[data-mom="tartazo"]').scrollIntoView({ block: 'start' })); await W(300); await p.screenshot({ path: `${out}/voz_buzz_panel_momentos.png` });
// Probar (victoria, recorte 1–3,5 s) y Quitar
await p.evaluate(() => [...document.querySelectorAll('#bzaPanel .sl[data-mom="victoria"] button')].find(x => x.textContent.includes('Probar')).click()); await W(900);
console.log('probar suena', await p.evaluate(() => { const a = window.__bza.BZA.el; return a ? [!a.paused, a.currentTime.toFixed(1)] : null; }));
await W(3000); console.log('tras recorte parado', await p.evaluate(() => !window.__bza.BZA.el));
await p.evaluate(() => [...document.querySelectorAll('#bzaPanel .sl[data-mom="despedida"] button')].find(x => x.textContent.includes('Quitar')).click()); await W(200);
console.log('slots', JSON.stringify(await p.evaluate(() => window.__bza.bzaSlots())));
// persistencia: recarga y siguen
await p.reload(); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
console.log('tras recargar', await p.evaluate(async () => { const r = await window.__bza.bzaPlay('saludo'); const ok = !!r; r && r.stop(); return [window.__bza.bzaLista().length, ok]; }));
// 3) Modo Fiesta: el saludo de Buzz suena con el audio del jugador y el bocadillo se ve
await p.evaluate(() => { localStorage.setItem('ac_fiestaHost', 'buzz'); window.__fiesta.modoFiesta(); });
await p.waitForFunction(() => { const a = window.__bza.BZA.el; return a && !a.paused; }, { timeout: 60000, polling: 100 }).then(() => console.log('fiesta: suena audio propio')).catch(() => console.log('fiesta: NO suena audio propio'));
await W(800); await p.screenshot({ path: `${out}/fiesta_saludo_audio_propio.png` });
// 4) promo con banda sonora propia
await p.evaluate(() => { document.querySelectorAll('button').forEach(x => /Salir|✕/.test(x.textContent) && x.offsetParent && x.click()); }); await W(1500);
await p.evaluate(() => { window.__promoBuzz.promoBuzz(); }); await W(2500);
console.log('promo con mi audio', await p.evaluate(() => { const a = window.__bza.BZA.el; return a ? [!a.paused, a.src.slice(0, 5)] : null; }));
await p.screenshot({ path: `${out}/promo_buzz_con_mi_audio.png` });
console.log('ERRORES', errs); await b.close();
