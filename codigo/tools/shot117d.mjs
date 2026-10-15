import puppeteer from 'puppeteer-core';
const S=ms=>new Promise(r=>setTimeout(r,ms)); const O='/workspace/ahoracaigo/shots-new/';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 412, height: 860, deviceScaleFactor: 2, isMobile:true, hasTouch:true });
await p.goto('http://localhost:8824/index.html'); await S(3000);
await p.evaluate(()=>{AppClasica.abrir(); [...document.querySelectorAll('button')].find(b=>b.textContent.includes('JUGAR')).click();}); await S(600); await p.screenshot({path:O+'02-tablero.png'});
await p.evaluate(()=>AppClasica._previa(AppClasica._st().rivales[3])); await S(4600); await S(5500); await p.screenshot({path:O+'04-duelo-letras.png'});
await p.evaluate(()=>{const st=AppClasica._st(); st.salirDuelo(); st.ganados=1; AppClasica._caida(st.rivales[1], false);}); await S(3500); await p.screenshot({path:O+'10-final.png'});
await b.close();
