import puppeteer from 'puppeteer-core';
const S=ms=>new Promise(r=>setTimeout(r,ms)); const O='/workspace/ahoracaigo/shots-new/';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox','--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage(); await p.setViewport({ width: 412, height: 860, deviceScaleFactor: 2, isMobile:true, hasTouch:true });
await p.goto('http://localhost:8824/index.html'); await S(3000);
await p.evaluate(()=>{AppClasica.abrir(); [...document.querySelectorAll('button')].find(b=>b.textContent.includes('JUGAR')).click(); const st=AppClasica._st(); st.ganados=4; st.banco=7000; const r=st.rivales[0]; r.cifra=2000; st.banco+=2000; r.fuera=true; AppClasica._moneda(r);}); await S(1500);
await p.screenshot({path:O+'06-moneda.png'}); await S(2500); await p.screenshot({path:O+'07-decision.png'});
await p.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Sigo')).click()); await S(500); await p.screenshot({path:O+'08-tablero-tras-duelo.png'});
await b.close();
