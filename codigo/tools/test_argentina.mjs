// v1.23: partida automática de cada prueba argentina (node tools/test_argentina.mjs URL [carpeta])
import puppeteer from 'puppeteer-core';
const base = process.argv[2], out = process.argv[3] || 'tmp/ar';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const espera = ms => new Promise(r => setTimeout(r, ms)); const res = {}; let errs = 0;
const IDS = (process.env.SOLO || 'abc,queves,cantala,escondida,entredos,asociadas').split(',');
for (const id of IDS) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
  p.on('pageerror', e => { errs++; console.log('PAGEERROR', id, e.message); });
  await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false, lee: false })); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; window.__meFirst = false; window.__trOpp = 3;
    // jugador automático: responde bien en su turno tras 1,2 s
    setInterval(() => { const A = window.__ar; if (!A || A.turno !== 'me') return; if (A.id === 'entredos') { if (A.elige && A.q && !A._h) { A._h = A.q; setTimeout(() => A.elige(A.q.bien), 1200); } if (A._h !== A.q) A._h = null; return; }
      const q = A.q; if (!q || !A.escribe || q._auto) return; q._auto = 1; setTimeout(() => { const st = q.modo === 'huecos' ? q.celdas.filter(c => !c.fija).map(c => c.sol) : null;
        if (st) st.forEach((x, k) => setTimeout(() => A.escribe && A.escribe(x), k * 180));
        else { const sol = q.unidad === 'palabra' ? q.resp.split(' ') : [...q.resp.replace(/[^A-ZÑ]/g, '')]; sol.forEach((x, k) => setTimeout(() => { if (!A.escribe) return; const j = q.resto.indexOf(x); A.escribe({ tap: q.orden.length + j }); }, k * 220)); } }, 1200); }, 200); });
  await p.goto(base + 'index.html?mode=entrenamiento&sub=' + id); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
  // turno del oponente (sin teclado) = captura para comparar con la tele
  await p.waitForFunction('window.__ar && window.__ar.q && document.querySelector("#arP.in")', { timeout: 60000 });
  if (id === 'queves') { await p.waitForFunction('window.__arPlano', { timeout: 60000, polling: 50 }); await espera(1300); await p.screenshot({ path: `${out}_${id}_pantalla.png` }); }
  if (id === 'queves') await espera(2500); else await espera(id === 'entredos' ? 1500 : 3200); await p.screenshot({ path: `${out}_${id}_bot.png` });
  await p.waitForFunction('window.__ar && window.__ar.turno === "me" && document.querySelector("#arP.kb, #arP .arO")', { timeout: 90000 }).catch(() => console.log('sin turno propio', id)); await espera(700);
  await p.screenshot({ path: `${out}_${id}_me.png` });
  await p.waitForFunction('document.querySelectorAll("#actions button").length', { timeout: 240000 }).catch(() => console.log('TIMEOUT', id));
  res[id] = await p.evaluate(() => ({ log: window.__ar && window.__ar.log, score: (document.getElementById('score') || {}).innerText }));
  await p.screenshot({ path: `${out}_${id}_fin.png` }); console.log(id, JSON.stringify(res[id])); await p.close();
}
console.log('ERRORES', errs); await b.close();
