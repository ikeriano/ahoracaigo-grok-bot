import puppeteer from 'puppeteer-core';
const [base, out, modo] = process.argv.slice(2); // modo: gana | pierde
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 120000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1024, height: 576 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
p.on('console', m => { const t = m.text(); if (/error|Error/.test(t) && !/favicon|404/.test(t)) console.log('CONSOLE', t.slice(0, 200)); });
await p.evaluateOnNewDocument(m => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); Object.assign(window, { __noAviso: true, __noMono: true, __noEleccion: true, __opoK: 3, __opoF: 1, __botForce: m === 'gana' ? 'fail' : 'win', __meFirst: m !== 'gana', __botClock: 3, __duelClock: m === 'gana' ? 30 : 3 }); }, modo);
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
if (modo === 'gana') { await p.evaluate(() => __menu('play')); await W(900); await p.evaluate(() => [...document.querySelectorAll('#menu button')].find(x => x.textContent.includes('Empiezo como oponente')).scrollIntoView({ block: 'center' })); await W(400); await p.screenshot({ path: out + '/opo_01_menu_jugar.png' }); }
await p.evaluate(() => { __startMode('oponente'); });
const L = await p.evaluate(() => window.__OPO_L);
const quiero = modo === 'gana' ? [['intro', 'opo_02_empiezas_en_trampilla'], ['eligeOtro', 'opo_03_central_elige_a_otro'], ['fallaOtro', null], ['eligeTe', 'opo_04_te_elige_a_ti'], ['__duelo', 'opo_05_duelo_tu_contra_el_central'], ['cambio', 'opo_06_cae_el_central_el_centro_es_tuyo'], ['centro', 'opo_07_ya_estas_en_el_centro'], ['__elige', 'opo_08_ahora_eliges_tu']] : [['eligeTe', null], ['__duelo', null], ['pierdes', 'opo_09_pierdes_y_caes']];
const t0 = Date.now(); let i = 0, ultimo = '';
while (i < quiero.length && Date.now() - t0 < 600000) {
  const st = await p.evaluate((L, modo) => {
    // salta la cabecera y lo que tenga botón de saltar
    const sk = [...document.querySelectorAll('button')].find(x => x.offsetParent && /^Saltar/.test(x.textContent.trim())); sk && sk.click();
    const e3 = window.__e3; if (e3 && e3.turn === 'me' && e3.q && document.getElementById('e3')) { if (!e3._h) { e3._h = 1; setTimeout(() => e3.choose(modo === 'gana' ? e3.q[2] : (e3.q[2] + 1) % 3), 1500); } }
    if (e3 && e3.q !== e3._q) { e3._q = e3.q; e3._h = 0; }
    const txt = document.getElementById('hud') ? document.getElementById('hud').innerText : '';
    return { txt: txt.slice(0, 2000), duelo: !!(window.__duel && window.__duel.running), elige: [...document.querySelectorAll('.huella')].some(x => x.offsetParent) };
  }, L, modo);
  const [k, f] = quiero[i];
  const ok = k === '__duelo' ? st.duelo : k === '__elige' ? st.elige : st.txt.includes(L[k].slice(0, 40));
  if (ok) { await W(k === '__duelo' ? 2500 : k === '__elige' ? 1500 : 900); if (f) await p.screenshot({ path: out + '/' + f + '.png' }); console.log('OK', k, ((Date.now() - t0) / 1000).toFixed(1) + 's'); i++; }
  const ln = st.txt.split('\n').filter(Boolean).slice(-2).join(' | '); if (ln !== ultimo) { ultimo = ln; }
  await W(200);
}
console.log('fin', i, '/', quiero.length, 'último:', ultimo.slice(0, 160));
if (modo === 'pierde') { await p.waitForFunction(() => [...document.querySelectorAll('button')].some(x => x.offsetParent && x.textContent.includes('Jugar otra vez')), { timeout: 120000 }).catch(e => console.log('sin botón')); await W(1500); await p.screenshot({ path: out + '/opo_10_fin_jugar_otra_vez.png' }); console.log('acciones', await p.evaluate(() => [...document.querySelectorAll('button')].filter(x => x.offsetParent).map(x => x.textContent.trim()).slice(0, 8).join(' / '))); }
console.log('ERRORES', errs); await b.close();
