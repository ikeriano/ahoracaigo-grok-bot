// Prueba del relevo IA en la «App clásica» 2D: dejas correr tu reloj, caes, el rival pasa al centro y juega la máquina.
// node test_clasica.mjs URL_BASE carpeta prefijo [saltar]
import puppeteer from 'puppeteer-core';
import fs from 'fs';
const [base, out, pre = '', modo = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 240000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 576 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); Object.assign(window, { __noAviso: true, __noCab3d: true, __noCabVideo: true }); });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 180000 });
const shot = async n => { const f = `${out}/${pre}${n}.png`; await p.screenshot({ path: f }); console.log('SHOT', f); };
const clic = re => p.evaluate(s => { const x = [...document.querySelectorAll('button')].find(b => new RegExp(s).test(b.textContent)); if (x) { x.click(); return 1; } return 0; }, re);
await p.evaluate(() => { AppClasica.abrir(); return 1; }); await W(1500); await clic('JUGAR'); await W(1500);
await p.evaluate(() => { const c = [...document.querySelectorAll('div')].filter(d => d.style.cursor === 'pointer'); c[0] && c[0].click(); return 1; });
const t0 = Date.now(); const h = {}; let ult = '';
while (Date.now() - t0 < 900000) {
  const txt = await p.evaluate(() => { const r = document.querySelector('div[style*="z-index:99980"],div[style*="z-index: 99980"]'); return r ? r.innerText.replace(/\s+/g, ' ').slice(0, 300) : ''; });
  if (txt !== ult) { ult = txt; console.log(((Date.now() - t0) / 1000).toFixed(0) + 's', txt.slice(0, 200)); }
  if (/Elige a tu oponente/.test(txt) && !h.cae && !h.pick) { h.pick = 1; await p.evaluate(() => { const r = AppClasica._st().rivales.find(x => !x.fuera); r.el.click(); return 1; }); }
  if (/¡Caes tú!/.test(txt) && !h.cae) { h.cae = 1; await W(700); await shot('01_cae_el_central'); }
  if (/Ha caído el concursante central/.test(txt) && /🎙️/.test(txt) && !h.rel) { h.rel = 1; await W(4500); await shot('02_relevo_el_ganador_pasa_al_centro'); }
  if (/pasa al centro y elige oponente/.test(txt) && !h.centro) { h.centro = 1; await W(600); await shot('03_nuevo_central_ia');
    if (modo === 'saltar') { await W(800); await clic('Saltar al resultado'); await W(1500); await shot('09_saltar_al_resultado'); break; } }
  if (/🤖 [^:]*: su turno/.test(txt) && !h.duelo) { h.duelo = 1; await W(2500); await shot('04_ia_juega_un_duelo'); }
  if (/escondía/.test(txt) && h.duelo && !h.mon) { h.mon = 1; await W(1500); await shot('05_ia_tira_a_un_oponente'); }
  if (/¿Te plantas o sigues\?/.test(txt) && h.duelo && !h.dec) { h.dec = 1; await W(600); await shot('06_ia_decide'); }
  if (/Jugar otra vez/.test(txt) && h.centro) { await W(800); await shot('08_fin_del_programa'); break; }
  await W(400);
}
console.log('RESUMEN', JSON.stringify({ h, errs, s: ((Date.now() - t0) / 1000).toFixed(0) })); await b.close();
