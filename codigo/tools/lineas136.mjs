import puppeteer from 'puppeteer-core'; import fs from 'fs';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'] });
const p = await b.newPage(); await p.evaluateOnNewDocument(() => { localStorage.setItem('ac3d_opts', JSON.stringify({ quality: 'baja', gradas: false })); window.__noAviso = true; });
await p.goto('http://localhost:8136/index.html'); await p.waitForFunction('window.__eng && document.getElementById("loading").classList.contains("hidden")', { timeout: 120000 });
const r = await p.evaluate(() => { const L = typeof __allLines === 'function' ? __allLines() : __allLines; const arr = [...(L || [])].map(x => typeof x === 'string' ? x : Array.isArray(x) ? x : JSON.stringify(x)); return { tipo: typeof __allLines, n: arr.length, ej: arr.slice(0, 3), ac: arr.filter(x => /ahora ca[ií]go/i.test(String(x))) }; });
console.log(r.tipo, r.n, JSON.stringify(r.ej), r.ac.length); fs.writeFileSync('/tmp/lineas_ac.json', JSON.stringify(r.ac, null, 1)); await b.close();
