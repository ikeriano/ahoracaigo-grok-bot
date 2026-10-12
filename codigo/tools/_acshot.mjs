import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 720 });
await p.goto('http://localhost:8811/index.html'); await new Promise(r=>setTimeout(r,12000));
await p.mouse.click(640,400); await new Promise(r=>setTimeout(r,6000));
await p.screenshot({ path: '/tmp/ac_menu.png' });
console.log(await p.evaluate(()=>document.getElementById('menu').innerText));
console.log('====');const bs = await p.$$('#menu button, #menu div'); for (const x of bs){ const s=await x.evaluate(e=>e.innerText); if(/^\W*Opciones/i.test(s)){ await x.click(); break; } }
await new Promise(r=>setTimeout(r,1500)); await p.screenshot({ path: '/tmp/ac_opc.png' });
console.log('----'); await p.evaluate(()=>document.getElementById('menu').scrollTop=0); await p.screenshot({path:'/tmp/ac_opc.png'}); console.log(await p.evaluate(()=>document.getElementById('menu').innerText));
await b.close();
