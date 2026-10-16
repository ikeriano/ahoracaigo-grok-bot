// v1.30: prueba directa de las voces de concursantes y presentadores en los momentos clave (saludo, acierto, fallo, caída, victoria)
import puppeteer from 'puppeteer-core';
const [base, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: true })); localStorage.setItem('ac_pres', 'marga'); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && window.__voz130 && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => { document.getElementById('menu').classList.add('hidden'); const e = window.__eng, h = e.studio.holes[0]; e.player.root.visible = true; e.player.root.position.copy(h.pos); });
const paso = async (n, js, cam) => { await p.evaluate(js); await W(700); const L = await p.evaluate(() => window.__voz130.V130.log.slice(-2)); console.log(n, JSON.stringify(L)); if (cam) await p.screenshot({ path: `${out}/${n}.png` }); await W(3000); };
await paso('v130_saludo_rival', "(() => { const e = __eng, o = e.opps[3]; const q = o.root.position; e.cut(new e.camera.position.constructor(q.x * 0.6, q.y + 1.8, q.z * 0.6 + 1), q.clone().setY(q.y + 1.3)); window.__voz130.V130.ult = 0; window.__voz130.voz130(o, 'saluda', true); })()", true);
await paso('acierto', "(() => { window.__voz130.V130.ult = 0; window.__voz130.voz130(__eng.player, 'acierta', true); })()");
await paso('fallo', "(() => { window.__voz130.V130.ult = 0; window.__voz130.voz130(__eng.opps[5], 'falla', true); })()");
await paso('v130_caida_rival', "(() => { const e = __eng, o = e.opps[1], q = o.root.position; e.cut(new e.camera.position.constructor(q.x * 0.5, q.y + 3, q.z * 0.5 + 2), q.clone()); e.fall(o, 2); })()", true);
await paso('v130_victoria', "(() => { const e = __eng; window.__voz130.V130.ult = 0; const q = e.player.root.position, V = e.camera.position.constructor; e.cut(new V(q.x + 0.9, q.y + 1.7, q.z + 2.6), new V(q.x, q.y + 1.25, q.z)); window.__voz130.voz130(e.player, 'gana', true); })()", true);
await p.evaluate(() => __ac.menu('options')); await W(800); await p.evaluate(() => document.getElementById('rowVoz130').scrollIntoView({ block: 'center' })); await p.screenshot({ path: `${out}/v130_opciones.png` });
console.log('ERRORES', errs); await b.close();
