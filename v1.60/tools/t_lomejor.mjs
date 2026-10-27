import { abrir, wait, shot } from './h.mjs';
const { b, p, errs } = await abrir({ speed: 1 });
await p.mouse.click(640, 600); await wait(2500);
await p.evaluate(() => document.getElementById('lm144').click()); await wait(2500);
console.log(await p.evaluate(() => [...document.querySelectorAll('#m144 button, #m144 .tbtn')].map(b => b.innerText.replace(/\n/g,' / ').slice(0,50)).slice(0,40)));
await shot(p, 'shots/m160_lomejor.jpg', 80);
await p.evaluate(() => { const m=document.getElementById('m144'); m.querySelector('#nv159 button').click(); }); await wait(1500);
console.log('tras Más mejores momentos:', await p.evaluate(() => document.getElementById('menu').innerText.slice(0,60).replace(/\n/g,' ')), errs);
await b.close();
