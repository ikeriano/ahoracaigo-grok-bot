// Chrome headless: lanza cada prueba nueva del entrenamiento, captura y registra errores
import { abrir, wait, shot } from './h.mjs';
import fs from 'fs';
const ids = (process.env.ONLY || 'n_refran,n_capital,n_mito,n_intruso,n_cuantos,n_oficio,n_mezcla,n_sinonimo,n_crias').split(',');
for (const id of ids) {
  const { b, p, errs } = await abrir({ speed: 1 });
  await p.mouse.click(640, 600); await wait(2000);
  p.evaluate((id) => window.__ac159().Rt('entrenamiento', id).catch(e => console.error('RTERR ' + e)), id).catch(() => {});
  await wait(14000); await shot(p, `shots/p_${id}_0.jpg`, 75);
  const info = await p.evaluate(() => ({ txt: document.body.innerText.replace(/\s+/g, ' ').slice(0, 300) }));
  // intenta responder la primera opción visible
  const clicked = await p.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(b => b.offsetParent && /^[A-ZÁÉÍÓÚÑ ]{3,}$/.test(b.innerText.trim())); if (bs[0]) { bs[0].click(); return bs[0].innerText; } return null; });
  await wait(5000); await shot(p, `shots/p_${id}_1.jpg`, 75);
  console.log(id, 'clic:', clicked, 'err', errs.length, JSON.stringify(errs.slice(0, 3)), '|', info.txt.slice(0, 160));
  await b.close();
}
