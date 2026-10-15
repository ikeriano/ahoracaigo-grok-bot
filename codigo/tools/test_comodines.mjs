// v1.25: prueba automática de los 33 comodines especiales y del contador de 33 huellas
import puppeteer from 'puppeteer-core';
const base = process.argv[2], out = process.argv[3] || 'tmp/cmd';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const espera = ms => new Promise(r => setTimeout(r, ms)); let errs = 0; const res = {};
const PLAN = [
  ['duelo', '', ['mas5', 'mas10', 'prorroga', 'arena', 'lenta', 'reinicio', 'congelar', 'siesta', 'turbo', 'roba1', 'ladron', 'bomba', 'tijera', 'igualador', 'rayo', 'respiro', 'letra', 'dosletras', 'ultima', 'cuantas', 'publico', 'llamada', 'vida', 'lluvia', 'escudo', 'saque', 'cambio', 'trampilla', 'doble', 'salto', 'sabio']],
  ['entretres', '', ['cincuenta', 'espejo', 'publico', 'llamada', 'mas5', 'congelar', 'sabio']],
  ['abc', '1', ['letra', 'ultima', 'cuantas', 'llamada', 'ladron', 'salto', 'sabio']],
  ['entredos', '1', ['cincuenta', 'espejo', 'publico', 'sabio']]
];
for (const [sub, ar, ids] of PLAN.filter(x => !process.env.SOLO || process.env.SOLO.split(',').includes(x[0]))) {
  const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
  p.on('pageerror', e => { errs++; console.log('PAGEERROR', sub, e.message); });
  await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false, lee: false })); Object.assign(window, { __noCabVideo: true, __noMono: true, __noAviso: true, __meFirst: true, __trOpp: 3, __duelClock: 200, __e3Clock: 60, __botForce: 'win' }); });
  await p.goto(base + 'index.html?mode=entrenamiento&sub=' + sub); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
  const okc = await p.waitForFunction('window.__cmdApi.ctx', { timeout: 90000 }).then(() => true).catch(() => false);
  if (!okc) { console.log('SIN DUELO', sub); await p.screenshot({ path: `${out}_${sub}_sinduelo.png` }); await p.close(); continue; }
  for (const id of (process.env.IDS ? process.env.IDS.split(',') : ids)) {
    const ok = await p.waitForFunction(i => { const A = window.__cmdApi; if (A.ctx && ['cambio', 'trampilla', 'doble'].includes(i)) { const tr = A.ctx.t.training; A.ctx.t.training = false; const r = A.puede(i); A.ctx.t.training = tr; return r; } return A.ctx && A.puede(i); }, { timeout: 45000, polling: 100 }, id).then(() => true).catch(() => false);
    if (!ok) { res[sub + ':' + id] = 'NO-DISPONIBLE'; console.log(sub, id, 'NO-DISPONIBLE'); continue; }
    const r = await p.evaluate(async i => {
      const W = window, A = W.__cmdApi, c = A.ctx, snap = () => { const k = (W.__ar && W.__ar.clocks && W.__ar.id !== 'entredos') ? W.__ar.clocks : W.__duel && W.__duel.clocks; const pn = W.__panel; return { me: k ? +k.me.toFixed(2) : null, bot: k ? +k.bot.toFixed(2) : null, vidas: c.a.vidas, inp: pn && pn.active ? pn.input.value.length : null, ar: W.__ar && W.__ar.q ? (W.__ar.q.orden ? W.__ar.q.orden.length : (W.__ar.q.celdas || []).filter(x => x.l && !x.fija).length) : null, off: [...document.querySelectorAll('.e3b,.arO')].filter(x => x.disabled || x.style.boxShadow).length }; };
      const tr = c.t.training; if (['cambio', 'trampilla', 'doble'].includes(i)) c.t.training = false;
      c.mano.push(i); const a0 = snap(); const u = A.usa(i); c.t.training = tr; await new Promise(r => setTimeout(r, 400)); const a1 = snap();
      await new Promise(r => setTimeout(r, 1000)); const a2 = snap();
      return { u, a0, a1, a2, usados: (c.usados || []).includes(i), flags: { escudo: c.escudo, doble: c.doble, cambio: c.a.__cmdCambio, saque: c.a.__cmdSaque } };
    }, id);
    res[sub + ':' + id] = r; console.log(sub, id, JSON.stringify(r));
    if (id === 'cincuenta' || id === 'congelar' && sub === 'duelo') await p.screenshot({ path: `${out}_${sub}_${id}.png` });
  }
  if (sub === 'duelo') { await p.evaluate(() => { const c = window.__cmdApi.ctx; if (!c) return; c.a.vidas = 33; window.__cmdApi.Pn(33); c.mano.push('mas10', 'congelar', 'letra', 'ladron', 'escudo'); }); await espera(900); await p.screenshot({ path: `${out}_33huellas.png` }); await p.evaluate(() => document.getElementById('cmdBtn').click()); await espera(800); await p.screenshot({ path: `${out}_33huellas_bandeja.png` }); }
  await p.close();
}
console.log('ERRORES', errs); await b.close();
