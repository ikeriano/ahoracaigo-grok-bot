// v1.28: cada prueba nueva en Entrenamiento (3D, presentador normal) · capturas del panel y del tartazo/bomba
import puppeteer from 'puppeteer-core';
const [base, out, ids = 'ordena,vot,borrosa,cadena,bomba,realidad'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(Q => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: Q, gradas: true })); window.__noAviso = true; window.__duelClock = 7; window.__botClock = 30; }, process.env.Q || 'baja');
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); } catch (e) { } }, 500));
await p.evaluate(() => __ac.menu('train')).catch(() => 0); await W(800); await p.screenshot({ path: `${out}/entrenamiento_menu.png` });
for (const id of ids.split(',')) {
  await p.evaluate(id => { window.__est128 = ''; window.__fin128 = false; Promise.resolve(window.__ac && __ac.ii ? __ac.ii('entrenamiento', id) : null); }, id).catch(() => 0);
  const ok = await p.evaluate(id => { const btn = [...document.querySelectorAll('#menu .mbtn')].find(x => x.textContent.toLowerCase().startsWith(({ ordena: 'ordena', vot: 'verdadero', borrosa: 'la foto', cadena: 'cadena', bomba: 'pasa', realidad: 'realidad' })[id])); btn && btn.click(); return !!btn; }, id);
  console.log(id, 'boton', ok);
  await p.waitForFunction(() => { const e = document.getElementById('arP'); return e && e.offsetParent && getComputedStyle(e).opacity > 0.5; }, { timeout: 60000, polling: 100 }).catch(() => console.log('sin panel'));
  await W(2500); await p.screenshot({ path: `${out}/prueba_${id}.png` }); console.log('shot', id);
  if (id === 'ordena' || id === 'bomba') { await p.waitForFunction(() => window.__est128 === 'tartazo' || window.__est128 === 'bomba', { timeout: 90000, polling: 50 }).then(async () => { await W(350); await p.screenshot({ path: `${out}/prueba_${id}_${id === 'ordena' ? 'tartazo' : 'explota'}.png` }); console.log('golpe', id); }).catch(() => console.log('sin golpe')); }
  await p.waitForFunction(() => [...document.querySelectorAll('#actions button')].some(x => x.textContent === 'Entrenamiento'), { timeout: 240000, polling: 300 }).catch(() => console.log('sin fin'));
  await p.evaluate(() => { const x = [...document.querySelectorAll('#actions button')].find(x => x.textContent === 'Entrenamiento'); x && x.click(); }); await W(1500);
}
console.log('ERRORES', errs); await b.close();
