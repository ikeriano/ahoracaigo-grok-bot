import { abrir, wait, shot } from './h.mjs';
const { b, p, errs } = await abrir({ speed: 1, w: 640, h: 360 });
await p.mouse.click(320, 300); await wait(1500);
await p.evaluate(() => { const f = window.__fx159; const r = f.run; f.run = async function (y, M, x) { console.log('FXRUN ' + y + ':' + M); const t = performance.now(); try { return await r.apply(this, arguments); } finally { console.log('FXEND ' + y + ' ' + Math.round(performance.now() - t)); } }; });
await p.evaluate(()=>{const f=window.__fin159; window.__fn=0; window.__fin159=function(){window.__fn++; return f.apply(this,arguments);};});
p.on('console', m => { const t = m.text(); if (/^FX/.test(t)) console.log(new Date().toISOString().slice(17, 23), t); });
const t0 = Date.now(); let done = false;
p.evaluate((k, id) => window.__ac159().Rt(k, id).then(() => 'ok', e => 'ERR ' + e), process.env.K || 'oculta', process.env.ID || 'n_pato').then(r => { done = true; console.log('FIN', r, Date.now() - t0); });
for (let i = 0; i < 40 && !done; i++) { if (await p.evaluate(()=>window.__fn)) { await wait(2500); await shot(p,'logs/dbg_end.jpg'); console.log('BTNS', await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.innerText.replace(/\n/g,' ').slice(0,40)))); break; } await wait(5000); console.log(i * 5, await p.evaluate(() => { const e = [...document.querySelectorAll('div')].filter(d => d.children.length < 4 && /· (REGIDOR|DIRECT|SONIDO)|^ADRIÁN VEGA|^CONCURSANTE/i.test(d.innerText||'') && d.innerText.length < 200 && getComputedStyle(d).display!=='none'); return e.slice(-1).map(d => d.innerText.replace(/\n/g,' ').slice(0, 90)).join('|'); })); }
console.log(errs); await b.close();
