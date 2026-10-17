// cuenta las combinaciones posibles de normas por modo (2 a 4 normas, una por categoría, sin pares excluidos)
global.window = global; global.document = { createElement: () => ({}), head: { appendChild() {} } }; global.localStorage = { getItem: () => null };
require('../ns/ns.js'); require('../ns/cat.js');
const C = NS.cat(), ex = C.excl || [];
const choca = (a, b) => ex.some(x => (x[0] === a && x[1] === b) || (x[1] === a && x[0] === b));
function cuenta(tipos) {
  const p = NS.aplicables(tipos), cats = Object.keys(p); let tot = 0;
  const rec = (i, sel) => { if (sel.length >= C.min && sel.length <= C.max) tot++; if (sel.length === C.max) return;
    for (let j = i; j < cats.length; j++) for (const r of p[cats[j]]) if (!sel.some(s => choca(s, r.id))) rec(j + 1, sel.concat(r.id)); };
  rec(0, []); return [tot, cats.length, Object.values(p).reduce((a, l) => a + l.length, 0)];
}
const out = {};
for (const m of Object.keys(C.modos)) out[m] = cuenta(C.modos[m]);
out['Programa completo (noche con palabra gallina)'] = cuenta(C.modos['Programa completo'].concat(['gallina', 'gallinaDuelo']));
for (const k in out) console.log(k.padEnd(48), 'combinaciones', String(out[k][0]).padStart(7), '· categorías', out[k][1], '· normas', out[k][2]);
const cats = {}; C.reglas.forEach(r => cats[r.c] = (cats[r.c] || 0) + 1); console.log(C.reglas.length, 'normas', JSON.stringify(cats));
