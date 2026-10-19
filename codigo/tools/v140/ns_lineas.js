// v1.40 · lista de frases de las normas (ns/voz/<id>.mp3) a partir de ns/cat.js -> tools/v140/ns_lineas.json
global.window = global; global.document = { createElement: () => ({ style: {} }), head: { appendChild() {} }, querySelector: () => null }; global.localStorage = { getItem: () => null };
require('../../ns/ns.js'); require('../../ns/cat.js');
const C = NS.cat(), L = { intro: C.intro, outro: C.outro };
C.reglas.forEach(r => { L[r.id] = NS.textoVoz(r); L['n_' + r.id] = r.n + '.'; });
Object.keys(C.ev).forEach(k => C.ev[k].forEach((t, i) => { L['ev_' + k + '_' + i] = t; }));
Object.keys(C.x).forEach(k => { L['x_' + k] = C.x[k]; });
require('fs').writeFileSync(__dirname + '/ns_lineas.json', JSON.stringify(L, null, 1));
console.log(Object.keys(L).length);
