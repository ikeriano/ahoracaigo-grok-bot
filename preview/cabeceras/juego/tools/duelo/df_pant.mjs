// node df_pant.mjs <outprefix> v1,v2,...  [tema]  → pantalla central con la cantidad del Duelo Final
import puppeteer from 'puppeteer-core';
const [out, vs, th] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 }); const errs = [];
p.on('pageerror', e => { errs.push(e.message); console.log('PE', e.message); });
await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'alta', gradas: false })); localStorage.setItem('ac_emision137', '0'); });
await p.goto('http://localhost:8767/index.html?screen=main&nosw' + (th ? '&theme=' + th : '')); await p.waitForFunction('document.getElementById("loading").classList.contains("hidden")', { timeout: 180000 });
await p.evaluate(() => { document.getElementById('menu').classList.add('hidden'); document.getElementById('menu').style.display = 'none'; });
for (const x of vs.split(',').map(Number)) {
  await p.evaluate(x => { DF.pantalla(x); const e = __eng, f = e.studio.screenFocus; e.orbit = null; e.cut(new THREE.Vector3(0, f.y + .15, f.z + 4.4), new THREE.Vector3(0, f.y + .05, f.z)); }, x);
  await new Promise(r => setTimeout(r, 1500)); await p.screenshot({ path: `${out}_${x}.png` }); { const d = await p.evaluate(x => { const c = document.createElement('canvas'); c.width = 768; c.height = 516; DF.pintaCantidad(c.getContext('2d'), 768, 516, DF.euros(x), 0); return c.toDataURL('image/png'); }, x); (await import('fs')).writeFileSync(`${out}_${x}_textura.png`, Buffer.from(d.split(',')[1], 'base64')); }
  await p.evaluate(() => { const e = __eng; e.cut(new THREE.Vector3(0, 6.2, 14.2), new THREE.Vector3(0, 1, -1.5)); });
  await new Promise(r => setTimeout(r, 900)); await p.screenshot({ path: `${out}_${x}_plano.png` });
}
await p.evaluate(() => DF.quitaPantalla()); await new Promise(r => setTimeout(r, 500)); await p.screenshot({ path: `${out}_restaurada.png` });
console.log('ERRORES', errs.length); await b.close();
