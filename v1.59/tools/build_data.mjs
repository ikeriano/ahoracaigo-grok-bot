import fs from 'fs';
const src = fs.readFileSync('src/escenas.js','utf8') + '\n' + fs.readFileSync('src/pruebas.js','utf8');
const f = new Function(src + '\nreturn {PERSONAJES,LUGARES,OCULTA,TOMAS,FUERA,MEJOR,PRUEBAS};');
const d = f();
const out = { personajes: d.PERSONAJES, lugares: d.LUGARES, escenas: { oculta: d.OCULTA, tomas: d.TOMAS, fuera: d.FUERA, mejor: d.MEJOR }, pruebaIds: Object.keys(d.PRUEBAS) };
const pr = {};
for (const [k, v] of Object.entries(d.PRUEBAS)) pr[k] = { titulo: v.titulo, emoji: '🆕' + v.emoji, desc: v.desc + ' · 🆕 inventada', dicho: v.dicho, lista: v.lista };
const js = '/* ¡Ahora Caigo! 1.59 · datos nuevos (TODO INVENTADO / recreación con personajes ficticios) */\n(function(){\nwindow.__D159=' + JSON.stringify(out) + ';\nwindow.__clk159={};\nconst PR=' + JSON.stringify(pr) + ';\nwindow.__P159=function(hi){for(const id in PR){const p=PR[id];hi.titulos[id]=p.titulo;hi.desc[id]=p.desc;hi.dichos[id]=p.dicho;hi.emoji[id]=p.emoji;hi[id]=p.lista;}};\n})();\n';
fs.writeFileSync('ov/js/data159.js', js);
// estadisticas + frases para voces
const lines = [];
for (const k of ['oculta','tomas','fuera','mejor']) for (const s of out.escenas[k]) for (const p of s.pasos) lines.push([k,s.id,p[0],p[1]]);
fs.writeFileSync('work/lines159.json', JSON.stringify({ lines, pr: Object.fromEntries(Object.entries(pr).map(([k,v])=>[k,{dicho:v.dicho,qs:v.lista.map(x=>x[0])}])), personajes: out.personajes }));
console.log('escenas', Object.fromEntries(Object.entries(out.escenas).map(([k,v])=>[k,v.length])), 'frases', lines.length, 'preguntas', Object.values(pr).reduce((a,v)=>a+v.lista.length,0), (js.length/1024).toFixed(0)+'KB');
