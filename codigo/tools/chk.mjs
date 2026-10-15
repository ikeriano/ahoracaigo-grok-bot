import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage(); p.on('pageerror',e=>console.log('ERR',e.message)); p.on('console',m=>{if(m.type()==='error')console.log('CON',m.text())});
await p.goto('http://localhost:8823/index.html'); await new Promise(r=>setTimeout(r,15000));
console.log(await p.evaluate(()=>typeof AppClasica+' '+typeof window.__SND_EMB)); await b.close();
