// v1.24: Programa completo de AHORA CAIGO ARGENTINA de principio a fin: node tools/test_programa_ar.mjs URLBASE [salida]
import puppeteer from 'puppeteer-core';
const [base, out = 'tmp/ar/prog'] = process.argv.slice(2); const plato = 'clasico', etapa = '2021', prueba = 'plan'; import fs from 'fs';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
const errs = [];
p.on('pageerror', e => { errs.push('PAGEERROR ' + e.message); console.log('PAGEERROR', e.message); });
p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource|Manifest|bad HTTP/.test(m.text())) { errs.push(m.text()); console.log('ERR', m.text()); } });
await p.evaluateOnNewDocument((pl, et) => { localStorage.setItem('ac3d_opts', JSON.stringify({ plato: pl, quality: 'baja', gradas: false })); localStorage.setItem('ac_etapa', et); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; }, plato, etapa);
await p.goto(base + 'index.html?mode=argentina'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate((prueba) => {
  window.__botForce = 'fail'; window.__planReal = true; if (prueba !== 'plan') window.__pruebaForce = prueba; window.__log = []; window.__boc = [];
  setInterval(() => {
    try {
      const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click();
      document.querySelectorAll('#actions button').forEach(x => x.click());
      const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); }
      const st = window.__st; for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); window.__log.push('click ' + k); break; }
      if (window.__e3 && window.__e3.turn === 'me' && window.__e3.q) window.__e3.choose(window.__e3.q[2] ?? 0);
      const A = window.__ar; if (A && A.turno === 'me') { if (A.id === 'entredos') { A.elige && A.q && A.elige(A.q.bien); } else { const q = A.q; if (q && A.escribe && !q._auto) { q._auto = 1; const st = q.modo === 'huecos' ? q.celdas.filter(c => !c.fija).map(c => c.sol) : null; if (st) st.forEach((x, k) => setTimeout(() => A.escribe && A.escribe(x), 400 + k * 150)); else { const sol = q.unidad === 'palabra' ? q.resp.split(' ') : [...q.resp.replace(/[^A-ZÑ]/g, '')]; sol.forEach((x, k) => setTimeout(() => { if (!A.escribe) return; A.escribe({ tap: q.orden.length + q.resto.indexOf(x) }); }, 400 + k * 180)); } } } }
      document.querySelectorAll('#bubble:not(.hidden)').forEach(bb => { const t = bb.innerText.replace(/\s+/g, ' ').trim(); t && !window.__boc.includes(t) && window.__boc.push(t); });
      const ic = [...document.querySelectorAll('button')].find(x => x.offsetParent && /Ir al centro/.test(x.textContent)); ic && ic.click();
    } catch (e) { window.__log.push('drv ' + e.message); }
  }, 450);
}, prueba);
const t0 = Date.now(); let n = 0;
while (Date.now() - t0 < 50 * 60e3) {
  await new Promise(r => setTimeout(r, 20000));
  let st = {}; try { st = await p.evaluate(() => ({ menu: !document.getElementById('menu').classList.contains('hidden'), fin: !!document.getElementById('finCard'), score: (document.getElementById('hashtag') || {}).textContent, mec: (window.__mec || []).slice(-4) })); } catch (e) { console.log('eval', e.message); continue; }
  await p.screenshot({ path: `${out}_${String(++n).padStart(2, '0')}.png` });
  const ex = await p.evaluate(() => ({ ar: window.__AR, prueba: window.__ar && window.__ar.id, log: window.__ar && window.__ar.log.slice(-3) })); console.log(Math.round((Date.now() - t0) / 1000) + 's', JSON.stringify(st), JSON.stringify(ex));
  fs.writeFileSync(out + '_bocadillos.json', JSON.stringify(await p.evaluate(() => window.__boc), null, 1));
  if (st.menu && n > 2) break;
}
console.log('ERRORES:', errs.length); errs.slice(0, 20).forEach(e => console.log(' -', e)); await b.close();
