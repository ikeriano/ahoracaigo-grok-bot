// genera tools/voces.json a partir de ns/cat.js (id, texto)
global.window = global; global.document = { createElement: () => ({}), head: { appendChild() {} } }; global.localStorage = { getItem: () => null };
require('../ns/ns.js'); require('../ns/cat.js');
const C = NS.cat(), L = [['intro', C.intro], ['outro', C.outro]];
C.reglas.forEach(r => L.push([r.id, NS.textoVoz(r)]));
Object.keys(C.ev).forEach(k => C.ev[k].forEach((t, i) => L.push(['ev_' + k + '_' + i, t])));
Object.keys(C.x).forEach(k => L.push(['x_' + k, C.x[k]]));
require('fs').writeFileSync(__dirname + '/voces.json', JSON.stringify(L, null, 0));
console.log(L.length);
