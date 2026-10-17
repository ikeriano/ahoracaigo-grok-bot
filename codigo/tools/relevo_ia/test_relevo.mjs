// Prueba del relevo IA: el central (tú) pierde un duelo, el ganador pasa al centro y la máquina juega hasta el final.
// node test_relevo.mjs URL_BASE carpeta_salida modo [prefijo]   · modo: programa | parejas | oponente | ar | saltar
import puppeteer from 'puppeteer-core';
import fs from 'fs';
const [base, out, modo, pre = ''] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 240000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 576 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
p.on('console', m => { const t = m.text(); if (/error|Error/.test(t) && !/favicon|404|net::/.test(t)) console.log('CONSOLE', t.slice(0, 200)); });
await p.evaluateOnNewDocument((m, lg) => {
  localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false }));
  if (lg) localStorage.setItem('ac_lang', lg);
  if (m === 'parejas') localStorage.setItem('ac_parejas128', '1');
  Object.assign(window, { __noAviso: true, __noMono: true, __noEleccion: true, __noCab3d: true, __noCabVideo: true, __meFirst: true, __botForce: 'win', __botClock: 30, __duelClock: 3, __riaDecision: 'final' });
  if (m === 'oponente') Object.assign(window, { __opoK: 3, __opoF: 1, __meFirst: false });
  else window.__testRodadas = 6;
}, modo, process.env.AC_LANG || '');
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 180000 });
await p.evaluate(() => { const e = __eng, of = e.fall.bind(e); e.fall = (f, h) => { window.__caidas = (window.__caidas || []).concat([{ t: Date.now(), h, central: f === e.player, ia: !!window.__iaC }]); return of(f, h); }; });
if (modo === 'ar') { await p.evaluate(() => { __menu('ar'); return 1; }); await W(1500); await p.evaluate(() => { [...document.querySelectorAll('#menu button')].find(x => x.textContent.includes('Programa completo')).click(); return 1; }); }
else await p.evaluate(m => { __startMode(m === 'oponente' ? 'oponente' : 'programa'); return 1; }, modo);
const shot = async n => { const f = `${out}/${pre}${n}.png`; await p.screenshot({ path: f }); console.log('SHOT', f); };
const t0 = Date.now(); let fase = 0, hecho = {}, ultimo = '', fin = false;
while (Date.now() - t0 < 1500000 && !fin) {
  const st = await p.evaluate(() => {
    const vis = x => x && x.offsetParent;
    const sk = [...document.querySelectorAll('button')].find(x => vis(x) && /^(Saltar|Ir al centro|Vai al centro|Ir para o centro)/.test(x.textContent.trim())); sk && sk.click();
    if (!window.__iaC) { const h = [...document.querySelectorAll('.huella')].filter(vis); if (h.length && !window.__hClick) { window.__hClick = 1; setTimeout(() => { h[h.length - 1].click(); window.__hClick = 0; }, 900); } }
    const R = window.__RIA, bub = document.getElementById('bubble'), txt = bub && !bub.classList.contains('hidden') ? bub.innerText : '';
    const fin = [...document.querySelectorAll('button')].some(x => vis(x) && /Jugar otra vez|Gioca ancora|Jogar de novo/.test(x.textContent));
    return { txt, ia: !!window.__iaC, nombre: R && R.nombre, relevos: R && R.relevos, duelo: !!(window.__duel && window.__duel.running), turno: window.__duel && window.__duel.turn, final: !!(R && R.enFinal), caidas: window.__caidas || [], fin, placar: R && R.sv && R.sv.placar, score: (document.getElementById('score') || {}).innerText || '' };
  });
  const L = await p.evaluate(() => window.__AR ? window.__RIA_LAR : window.__RIA_L);
  if (st.txt !== ultimo) { ultimo = st.txt; console.log(((Date.now() - t0) / 1000).toFixed(0) + 's', st.ia ? '[IA ' + st.nombre + ' ' + st.placar + ']' : '', st.txt.replace(/\n/g, ' ').slice(0, 140)); }
  // la máquina pasa a jugar «de verdad»: quitamos los atajos de prueba en cuanto empieza el relevo
  if (st.ia && !hecho.limpia) { hecho.limpia = 1; await p.evaluate(() => { delete window.__botForce; window.__duelClock = 30; window.__botClock = 30; window.__meFirst = false; }); }
  const cc = st.caidas.find(c => c.central && !c.ia);
  if (cc && !hecho.cae) { hecho.cae = 1; await W(Math.max(0, cc.t + 900 - Date.now())); await shot('01_cae_el_central'); }
  if (st.txt && (st.txt.includes(L.relevo.slice(0, 30))) && !hecho.relevo) { hecho.relevo = 1; await W(2600); await shot('02_relevo_el_ganador_pasa_al_centro'); }
  if (st.txt && (st.txt.includes(L.bienvenido.slice(0, 25)) || st.txt.includes(L.opoSigue.slice(0, 25))) && !hecho.centro) { hecho.centro = 1; await W(1200); await shot('03_nuevo_central_ia'); if (modo === 'saltar') { await W(1500); await p.evaluate(() => [...document.querySelectorAll('#riaBarra button')][0].click()); await W(3000); await shot('09_saltar_al_resultado'); fin = true; } }
  if (st.ia && st.duelo && st.turno === 'me' && !hecho.dueloIA) { hecho.dueloIA = 1; await W(3200); await shot('04_ia_juega_un_duelo'); }
  if (st.ia && st.caidas.some(c => c.ia && !c.central) && !hecho.tira) { hecho.tira = 1; await W(300); await shot('05_ia_tira_a_un_oponente'); }
  if (st.final && !hecho.final) { hecho.final = 1; await W(9000); await shot('06_ia_juega_el_final'); }
  if (st.final && hecho.final && !hecho.final2 && Date.now() - t0 > 0) { const n = await p.evaluate(() => window.__jfClock && window.__jfClock.left); if (n != null && n < 75) { hecho.final2 = 1; await shot('07_ia_final_avanzado'); } }
  if (st.fin) { await W(1500); await shot('08_fin_del_programa'); console.log('FIN', st.score.replace(/\n/g, ' | ')); fin = true; }
  await W(250);
}
console.log('RESUMEN', JSON.stringify({ hecho, errs, caidas: (await p.evaluate(() => window.__caidas || [])).length, s: ((Date.now() - t0) / 1000).toFixed(0) }));
await b.close();
