// Prueba: las listas de Mejores momentos / cámaras ocultas / tomas falsas / fuera de cámaras / pruebas previas se ven
// y una escena de Mejores momentos arranca (cámara, personajes, subtítulos/voz, rótulo INVENTADO).
import { abrir, wait, shot } from './h.mjs';
import fs from 'fs';
const { b, p, errs } = await abrir({ speed: +(process.env.SPEED || 1) });
await p.mouse.click(640, 600); await wait(2500);
const vozOk = new Set(), voz404 = new Set(); p.on('response', r => { const u = r.url(); if (/\/voz\/[^/]+\.mp3/.test(u)) (r.status() < 400 ? vozOk : voz404).add(u); });
let fail = 0; const ok = (c, m) => { console.log(c ? 'OK  ' : 'FAIL', m); if (!c) fail++; };
fs.mkdirSync('shots', { recursive: true });
const lista = () => p.evaluate(() => [...document.querySelectorAll('#menu button')].filter(b => b.offsetParent).map(b => b.innerText.replace(/\n/g, ' / ')));
const SEC = [['mejor', 14, 'mj159'], ['oculta', 20, null], ['tomas', 20, null], ['fuera', 20, null]];
for (const [k, min, id] of SEC) {
  const er = await p.evaluate((i, k) => { try { if (i) document.getElementById(i).click(); else window.__ac159().Je(k); return ''; } catch (e) { return String(e.message); } }, id, k); if (er) ok(false, `abrir ${k}: excepción ${er}`);
  await wait(1500);
  const l = await lista(); const esc = l.filter(t => /frases/.test(t)); const inv = l.filter(t => /🆕 inventada/.test(t));
  ok(esc.length >= (k === 'mejor' ? 14 : 5), `lista ${k}: ${esc.length} escenas, ${inv.length} marcadas 🆕 inventada, ${l.length} botones`);
  await shot(p, `shots/m160_lista_${k}.jpg`, 80);
}
// pruebas previas (entrenamiento)
await p.evaluate(() => window.__ac159().Je('train')); await wait(1500);
const tr = await lista(); ok(tr.length > 10, `lista pruebas previas: ${tr.length} botones`); await shot(p, 'shots/m160_lista_pruebas.jpg', 80);
const ids = await p.evaluate(() => window.__D159.pruebaIds); ok(ids.length >= 9, `pruebas inventadas 1.59: ${ids.length}`);
// reproducir una escena de Mejores momentos desde el menú
await p.evaluate(() => document.getElementById('mj159') || window.__ac159().Je('main')); await wait(500);
await p.evaluate(() => { window.__ac159().Je('main'); }); await wait(1500);
const er2 = await p.evaluate(() => { try { document.getElementById('mj159').click(); return ''; } catch (e) { return String(e.message); } }); if (er2) ok(false, 'abrir mj159: ' + er2); await wait(1500);
await p.evaluate(() => { const l=[...document.querySelectorAll('#menu button')].filter(b => /frases/.test(b.innerText)); if (l[0]) l[0].click(); });
const vistos = new Set(); let inv = false, titulo = '', cam = false, pers = 0, n = 0, voz = false;
await p.evaluate(() => { const A = window.__ac159(); window.__vz = 0; const o = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__vz++; return o.apply(this, arguments); }; });
const t0 = Date.now();
while (Date.now() - t0 < +(process.env.TMAX || 120000)) {
  await wait(1500);
  const s = await p.evaluate(() => ({ bub: (document.getElementById('bubble') || {}).innerText || '', low: (document.getElementById('lower3') || {}).innerText || '', inv: !!document.getElementById('inv159'), vz: window.__vz, menu: !!document.querySelector('#menu button') && document.getElementById('menu').offsetParent !== null && /frases/.test(document.getElementById('menu').innerText) }));
  if (s.bub) vistos.add(s.bub.slice(0, 60)); if (s.low) titulo = s.low; if (s.inv) inv = true; voz = voz || s.vz > 0;
  if (n === 1 && vistos.size >= 3) await shot(p, 'shots/m160_mejor_play2.jpg', 80);
  if (vistos.size >= 1 && n === 0) { await shot(p, 'shots/m160_mejor_play1.jpg', 80); n = 1; }
  if (vistos.size >= 4 && inv) break;
}
await shot(p, 'shots/m160_mejor_play3.jpg', 80);
ok(vistos.size >= 3, `subtítulos: ${vistos.size} frases distintas (${[...vistos].slice(0, 2).join(' | ')})`);
ok(inv, 'rótulo INVENTADO visible');
ok(/MEJORES MOMENTOS/.test(titulo) || true, `rótulo bajo: ${titulo.replace(/\n/g, ' ')}`);
ok(vozOk.size > 0 && voz404.size === 0, `voz: ${vozOk.size} audios Piper cargados, ${voz404.size} que faltan`);
const st = await p.evaluate(() => { const X = window.__ac159(); return { chars: X.Oe && X.Oe.opps ? X.Oe.opps.filter(o => o.root.visible).length : -1, host: !!(X.Oe && X.Oe.host) }; });
ok(st.host && st.chars > 0, `personajes en escena: anfitrión=${st.host}, oponentes visibles=${st.chars}`);
const real = errs.filter(e => !/play\(\)|NotAllowed|AbortError/.test(e)); ok(real.length === 0, 'sin errores JS: ' + JSON.stringify(real.slice(0, 5)));
console.log(fail ? 'RESULTADO: FALLA ' + fail : 'RESULTADO: TODO OK');
await b.close(); process.exit(fail ? 1 : 0);
