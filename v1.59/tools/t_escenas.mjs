// Chrome headless: reproduce cada escena nueva (acelerada), registra errores, duración y capturas
import { abrir, wait, shot } from './h.mjs';
import fs from 'fs';
const speed = +(process.env.SPEED || 6), only = process.env.ONLY ? process.env.ONLY.split(',') : null, shots = process.env.SHOTS !== '0';
const { b, p, errs } = await abrir({ speed });
await p.mouse.click(640, 600); await wait(2000);
const info = await p.evaluate(() => { const X = window.__ac159(); return { o: X.so.oculta.length, t: X.so.tomas.length, f: X.so.fuera.length, m: X.so.mejor.length, per: Object.keys(X.so.personajes).length, ids: window.__D159.pruebaIds, hi: window.__D159.pruebaIds.map(i => X.hi[i] && X.hi[i].length) }; });
console.log('INFO', JSON.stringify(info));
const lista = await p.evaluate(() => { const D = window.__D159.escenas, r = []; for (const k of ['oculta', 'tomas', 'fuera', 'mejor']) for (const s of D[k]) r.push([k, s.id, s.pasos.length, s.lugar || '']); return r; });
fs.mkdirSync('shots', { recursive: true }); fs.mkdirSync('logs', { recursive: true });
const res = [];
for (const [k, id, n, lug] of lista) {
  if (only && !only.includes(id)) continue;
  const e0 = errs.length, t0 = Date.now();
  await p.evaluate(() => { if (!window.__fnw) { window.__fnw = 1; const f = window.__fin159; window.__fn = 0; window.__fin159 = function () { window.__fn++; return f.apply(this, arguments); }; } window.__fn = 0; });
  p.evaluate((k, id) => window.__ac159().Rt(k, id).catch(e => console.error('RTERR ' + e)), k, id).catch(() => {});
  const ss = [], tmax = +(process.env.TMAX || 150000); let sn = 0, done = false;
  const marks = n > 6 ? [0.2, 0.55, 0.85] : [0.3, 0.7];
  const est = n * 6000;
  while (Date.now() - t0 < tmax) {
    await wait(900);
    if (await p.evaluate(() => window.__fn)) { done = true; break; }
    if (shots && sn < marks.length && Date.now() - t0 > marks[sn] * est) { const f = `shots/e_${id}_${sn}.jpg`; await shot(p, f, 72).catch(() => {}); ss.push(f); sn++; }
  }
  const r = done ? 'ok' : 'TIMEOUT';
  const st = await p.evaluate(() => ({ badgeEnd: !!document.getElementById('inv159'), btns: [...document.querySelectorAll('button')].filter(b => b.offsetParent).map(b => b.innerText.slice(0, 12)).join(',') }));
  res.push({ k, id, n, lug, r, s: ((Date.now() - t0) / 1000).toFixed(0), err: errs.length - e0, st });
  console.log(k, id, lug, r, ((Date.now() - t0) / 1000).toFixed(0) + 's', 'err+' + (errs.length - e0), JSON.stringify(st));
  
  await wait(600);
}
console.log('ERRS', errs.slice(0, 20));
fs.writeFileSync('logs/t_escenas.json', JSON.stringify({ res, errs }, null, 1));
await b.close();
