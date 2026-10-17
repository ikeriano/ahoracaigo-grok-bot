// v1.28: Duelo por parejas, caída mejorada (temblor/polvo/destello/cámara lenta) y Especial Fin de Año
import puppeteer from 'puppeteer-core';
const [base, out] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 600000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); let errs = 0; const W = ms => new Promise(r => setTimeout(r, ms));
p.on('pageerror', e => { errs++; console.log('PAGEERROR', e.message); }); p.on('console', m => m.type() === 'error' || m.type() === 'warning' ? console.log('C', m.text().slice(0, 160)) : 0);
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: true })); localStorage.setItem('ac_lenta128', '1'); window.__noAviso = true; });
const prep = async th => { await p.goto(base + 'index.html?theme=' + th); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
  await p.evaluate(() => { document.getElementById('menu').classList.add('hidden'); window.__S = { alive: true, w: ms => new Promise(r => setTimeout(r, ms)), until(f) { return new Promise(r => { const q = () => f() ? r() : setTimeout(q, 50); q(); }); } }; window.__C = window.__pres.ctx(window.__S); window.__C.a = { placar: 25000 }; }); };
await prep('clasico'); await p.evaluate(() => { const e = window.__eng, h = e.studio.holes[0]; e.player.root.visible = true; e.player.root.position.copy(h.pos); e.player.root.position.y = h.pos.y; });
p.evaluate(() => window.__v128.parEntra(window.__C)).catch(e => console.log('par', e.message));
await W(2500); await p.screenshot({ path: `${out}/parejas_entrada.png` }); await W(6000); await p.screenshot({ path: `${out}/parejas_companero.png` });
p.evaluate(() => { const e = window.__eng; e.cut(new e.camera.position.constructor(2.5, 3.2, 4.5), new e.camera.position.constructor(0, 0.6, 0)); return e.fall(e.player, 0); }).catch(e => console.log('fall', e.message));
await W(120); await p.screenshot({ path: `${out}/caida_destello.png` }); await W(500); await p.screenshot({ path: `${out}/caida_polvo_lenta.png` }); await W(1200); await p.screenshot({ path: `${out}/caida_pareja.png` });
console.log('ERR1', errs); process.exit(0);
await prep('findeano');
p.evaluate(() => window.__v128.finDeAno(window.__C)).catch(e => console.log('fda', e.message));
await W(9500); await p.screenshot({ path: `${out}/findeano_cuartos.png` }); await W(5200); await p.screenshot({ path: `${out}/findeano_campanadas_uvas.png` }); await W(8200); await p.screenshot({ path: `${out}/findeano_feliz_confeti.png` });
console.log('ERRORES', errs); await b.close();
