// node df_prev.mjs <out_dir> t1,t2,...   (fotogramas fijos de la cabecera a 1280x720)
import puppeteer from 'puppeteer-core';
const [out, ts, W = '1280', H = '720'] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: +W, height: +H });
p.on('pageerror', e => console.log('PE', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'alta', gradas: false })); });
await p.goto('http://localhost:8767/index.html?screen=main&nosw'); await p.waitForFunction('document.getElementById("loading").classList.contains("hidden")', { timeout: 180000 });
if (!(await p.evaluate(() => !!window.DF))) await p.addScriptTag({ url: 'http://localhost:8767/df/df.js?' + Date.now() });
await p.evaluate(() => { document.getElementById('menu').style.display = 'none'; const e = __eng; const d = e.host.root.position; e.orbit = null; e.cut(new THREE.Vector3(d.x + .9, 2.6, d.z + 3.2), new THREE.Vector3(d.x, 2.2, d.z)); });
for (const t of ts.split(',')) {
  await p.evaluate(t => { DF.parar && DF.parar(); DF.cabecera({ fija: +t, alPlato: () => __eng.cut(new THREE.Vector3(0, 6.2, 14.2), new THREE.Vector3(0, 1, -1.5)) }); }, t);
  await new Promise(r => setTimeout(r, 900));
  await p.screenshot({ path: `${out}/r_${t}.png` });
}
await b.close();
