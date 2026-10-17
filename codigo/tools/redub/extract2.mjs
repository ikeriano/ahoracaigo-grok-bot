import fs from 'fs'; import path from 'path';
const R = '/workspace/ahoracaigo/src-1.22';
const f = a => { let e = 2166136261; const t = a.normalize('NFC').trim(); for (let n = 0; n < t.length; n++) e ^= t.charCodeAt(n), e = Math.imul(e, 16777619) >>> 0; return e.toString(16).padStart(8, '0'); };
const files = []; const walk = d => { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, x.name); if (x.isDirectory()) { if (!/node_modules|^voz$|\.git|piper|sb3|mc3d|online|personas3d|assets/.test(x.name)) walk(p); } else if (/\.(js|mjs|py|json|jsonl|txt|md)$/.test(x.name) && fs.statSync(p).size < 40e6) files.push(p); } };
walk(R + '/src'); walk(R + '/tools'); files.push('/workspace/ahoracaigo-caduta/tools/lineas_st_todas.jsonl');
const S = new Set(); const lit = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
const unesc = s => s.replace(/\\n/g, ' ').replace(/\\(['"`\\])/g, '$1').replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
const T = new Set();
for (const p of files) { const t = fs.readFileSync(p, 'utf8'); let m; while ((m = lit.exec(t))) { const raw = m[1] ?? m[2] ?? m[3]; const s = unesc(raw); if (s.length > 1 && s.length < 700) { S.add(s); for (const part of s.split(/\[\w+\]/)) if (part.trim()) S.add(part.trim()); if (/\{\w+\}|\$\{[^}]*\}/.test(s)) T.add(s); } } }
const rt = JSON.parse(fs.readFileSync('rt_lines.json')); for (const x of rt.L) (Array.isArray(x) ? x : [x]).forEach(y => typeof y === 'string' && S.add(y));
const keys = {}; for (const sub of ['', 'st']) { const ix = JSON.parse(fs.readFileSync(path.join(R, 'voz', sub, 'index.json'))); for (const k in ix) keys[(sub ? sub + '/' : '') + k] = ix[k]; }
const out = JSON.parse(fs.readFileSync('recovered.json'));
const P = [...new Set(Object.values(out).map(x => x[0]))];
const tryS = (s) => { for (const p of P) { const k = f(p ? p + '|' + s : s); for (const sub of ['', 'st/']) if (keys[sub + k] != null && !out[sub + k]) { out[sub + k] = [p, s.normalize('NFC').trim()]; } } };
for (const s of S) tryS(s);
// vocabulario de huecos: cadenas cortas del código
const V = [...S].filter(s => s.length <= 40 && !/[{}$|\\]/.test(s)); for (let i = 0; i <= 20; i++) V.push(String(i));
console.error('S', S.size, 'T', T.size, 'V', V.length, 'P', P.length);
const NOM = ['¡Ahora Caigo! Niños', '¡Ahora Caigo! Campionnisimi', '¡Ahora Caigo! 10 Años', '¡Adivina o te caes!', '¡Ahora Caigo! Campeón Edition', '¡Ahora Caigo! 300 Suscriptores', '¡Ahora Caigo! Especial El Cazador', '¡Ahora Caigo! Campeón Edition by Ikériano & ChatGPT'];
fs.writeFileSync('cands.json', JSON.stringify({ T: [...T], n: S.size }));
let tn = 0;
for (const t of T) { const slots = t.match(/\{\w+\}|\$\{[^}]*\}/g); if (slots.length === 1) { for (const v of V) tryS(t.replace(slots[0], v)); } else if (slots.length <= 3) { const small = V.filter(v => v.length <= 14 && !/\s.*\s/.test(v)); const rec = (s, i) => { if (i === slots.length) return tryS(s); for (const v of (i === 0 ? small : small)) rec(s.replace(slots[i], v), i + 1); }; if (small.length ** slots.length < 3e7) rec(t, 0); } tn++; }
fs.writeFileSync('recovered2.json', JSON.stringify(out));
const by = {}; for (const k in keys) { const d = k.includes('/') ? 'st' : 'root'; by[d] = by[d] || [0, 0]; by[d][0]++; if (out[k]) by[d][1]++; } console.log(by);
