// v1.31: voces argentinas de los concursantes y de Tano en el modo AHORA CAIGO ARGENTINA
import puppeteer from 'puppeteer-core';
const [base, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: true })); window.__noAviso = true; });
await p.goto(base + 'index.html'); await p.waitForFunction('window.__eng && window.__voz130 && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
await p.evaluate(() => __v131.arActivar(true)); await W(1500);
await p.evaluate(() => { document.getElementById('menu').classList.add('hidden'); const e = window.__eng, h = e.studio.holes[0]; e.player.root.visible = true; e.player.root.position.copy(h.pos); window.__AR_ = !!window.__AR; });
console.log('AR', await p.evaluate(() => !!window.__AR));
const paso = async (n, js) => { await p.evaluate(js); await W(800); console.log(n, JSON.stringify(await p.evaluate(() => window.__voz130.V130.log.slice(-2)))); if (n.startsWith('v131')) await p.screenshot({ path: `${out}/${n}.png` }); await W(3000); };
await paso('v131_ar_saludo', "(() => { const e = __eng, o = e.opps[2], q = o.root.position, V = e.camera.position.constructor; e.cut(new V(q.x * 0.6, q.y + 1.8, q.z * 0.6 + 1), q.clone().setY(q.y + 1.3)); __voz130.V130.ult = 0; __voz130.voz130(o, 'saluda', true); })()");
await paso('v131_ar_caida', "(() => { const e = __eng, o = e.opps[0], q = o.root.position, V = e.camera.position.constructor; e.cut(new V(q.x * 0.5, q.y + 3, q.z * 0.5 + 2), q.clone()); e.fall(o, 1); })()");
await paso('v131_ar_gana', "(() => { const e = __eng, q = e.player.root.position, V = e.camera.position.constructor; __voz130.V130.ult = 0; e.cut(new V(q.x + 0.9, q.y + 1.7, q.z + 2.6), new V(q.x, q.y + 1.25, q.z)); __voz130.voz130(e.player, 'gana', true); })()");
console.log('ERRORES', errs); await b.close();
