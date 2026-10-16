// v1.26: Programa completo con presentador nuevo, logo 3D y especial; captura los momentos nuevos
import puppeteer from 'puppeteer-core';
const [base, out, pres = 'marga', logo = 'abismo', theme = 'navidad'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); const errs = [];
p.on('pageerror', e => { errs.push(e.message); console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument((pr, lg) => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: true })); localStorage.setItem('ac_pres', pr); localStorage.setItem('ac_logo_cab', lg); localStorage.setItem('ac_etapa', '2021'); window.__noCabVideo = true; window.__noMono = true; window.__noAviso = true; }, pres, logo);
await p.goto(base + 'index.html?mode=programa&theme=' + theme); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { window.__botForce = 'fail'; window.__pruebaForce = 'clasico'; setInterval(() => { try {
  const sk = document.getElementById('btnSkip'); if (sk && !sk.classList.contains('hidden')) sk.click();
  document.querySelectorAll('#actions button').forEach(x => x.click());
  const pn = window.__panel; if (pn && pn.active && pn.q && !pn.evaluating && pn.input.value === '') { pn.input.value = pn.q.missing.join(''); pn.onInput(); }
  const st = window.__st; for (const [k, el] of st.els) if (el.style.display !== 'none' && el.style.pointerEvents === 'auto' && k !== 'BotãoMenu3') { el.click(); break; }
} catch (e) { } }, 450); });
const vistos = new Set(); const t0 = Date.now(); let n = 0;
while (Date.now() - t0 < 13 * 60e3) {
  await new Promise(r => setTimeout(r, 700));
  const st = await p.evaluate(() => { const r = document.getElementById('rot126'), bu = document.getElementById('bubble'); return { logo: !!(window.__logo3d && window.__logo3d.t > 2.5), rot: r && r.classList.contains('on') ? r.textContent : '', bub: bu && !bu.classList.contains('hidden') ? bu.querySelector('b').textContent + ': ' + bu.querySelector('span').textContent : '', menu: !document.getElementById('menu').classList.contains('hidden'), cab: !!document.getElementById('cab3d') }; }).catch(() => ({}));
  const k = st.logo ? 'logo' : st.rot ? 'rot ' + st.rot.slice(0, 22) : st.bub && /Marga|Bruno|Rita|Quique/.test(st.bub) && vistos.size < 30 ? 'bub' + (n % 4) : '';
  if (k && !vistos.has(k)) { vistos.add(k); n++; const f = `${out}_${String(n).padStart(2, '0')}_${k.replace(/[^\wÁ-ú]+/g, '_')}.png`; await new Promise(r => setTimeout(r, k.startsWith('rot') ? 900 : 0)); await p.screenshot({ path: f }); console.log(Math.round((Date.now() - t0) / 1000) + 's', k, '|', st.bub.slice(0, 90)); }
  if (st.menu && Date.now() - t0 > 60e3) break;
}
console.log('ERRORES', errs.length); await b.close();
