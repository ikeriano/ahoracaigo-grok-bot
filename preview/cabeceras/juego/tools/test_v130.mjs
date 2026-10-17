// v1.30: Programa completo con bots; registra las frases de los concursantes y presentadores y hace capturas
import puppeteer from 'puppeteer-core';
const [base, out, pres = 'quique'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(pr => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: true })); localStorage.setItem('ac_pres', pr); localStorage.setItem('ac_etapa', '2021'); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; }, pres);
await p.goto(base + 'index.html?mode=programa&theme=clasico'); await p.waitForFunction('window.__eng && window.__voz130 && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { window.__botForce = 'fail'; window.__pruebaForce = 'clasico'; setInterval(() => { try { const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click(); document.querySelectorAll('#actions button').forEach(x => x.click());
  const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); }
  const st = window.__st; for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; } } catch (e) { } }, 450); }).catch(e => console.log('inj', e.message));
let n = 0, vistos = 0; const t0 = Date.now();
while (Date.now() - t0 < 6 * 60e3 && n < 4) { await W(300); const L = await p.evaluate(() => window.__voz130.V130.log.length); if (L > vistos) { vistos = L; await W(250); await p.screenshot({ path: `${out}/v130_momento_${++n}.png` }); console.log(Math.round((Date.now() - t0) / 1000) + 's', await p.evaluate(() => window.__voz130.V130.log.slice(-1)[0])); await W(6000); } }
console.log('frases', await p.evaluate(() => window.__voz130.V130.log.join(' | ')), 'ERRORES', errs); await b.close();
