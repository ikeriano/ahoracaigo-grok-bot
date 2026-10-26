// utilidades de prueba compartidas
import puppeteer from 'puppeteer-core';
export const wait = ms => new Promise(r => setTimeout(r, ms));
export async function abrir({ port = 8159, speed = 1, w = 1280, h = 720, extra } = {}) {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 900000, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
  const p = await b.newPage(); await p.setViewport({ width: w, height: h });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource|Manifest|bad HTTP|favicon/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
  await p.evaluateOnNewDocument((speed) => {
    localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); localStorage.setItem('ac_estreno_visto', '1');
    window.__noCabVideo = true; window.__noAviso = true; window.__noEstreno = true; window.__copreForce = false;
    if (speed > 1) { const st = window.setTimeout.bind(window), pn = performance.now.bind(performance), t0 = pn();
      window.setTimeout = (f, ms, ...a) => st(f, (ms || 0) / speed, ...a); performance.now = () => t0 + (pn() - t0) * speed; }
  }, speed);
  await p.goto(`http://127.0.0.1:${port}/index.html`);
  await p.waitForFunction('document.getElementById("loading") && document.getElementById("loading").classList.contains("hidden")', { timeout: 300000 });
  await wait(2500);
  return { b, p, errs };
}
export const shot = (p, f, q = 82) => p.screenshot({ path: f, type: 'jpeg', quality: q });
