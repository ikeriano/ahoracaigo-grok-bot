// Recupera (voz, texto) de cada clip por fuerza bruta: hash FNV de todas las cadenas del código × prefijos de voz.
import fs from 'fs'; import path from 'path';
const R = process.argv[2]; // raíz www (src-1.22)
const f = a => { let e = 2166136261; const t = a.normalize('NFC').trim(); for (let n = 0; n < t.length; n++) e ^= t.charCodeAt(n), e = Math.imul(e, 16777619) >>> 0; return e.toString(16).padStart(8, '0'); };
const files = []; const walk = d => { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, x.name); if (x.isDirectory()) { if (!/node_modules|voz|\.git|piper|sb3|mc3d|online|personas3d|assets/.test(x.name)) walk(p); } else if (/\.(js|mjs|py|json|jsonl|txt|md)$/.test(x.name) && fs.statSync(p).size < 40e6) files.push(p); } };
walk(path.join(R, 'src')); walk(path.join(R, 'tools'));
for (const x of (process.argv[3] || '').split(',').filter(Boolean)) files.push(x);
const S = new Set();
const lit = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
const unesc = s => { try { return JSON.parse('"' + s.replace(/\\'/g, "'").replace(/\\`/g, '`').replace(/"/g, '\\"').replace(/\\\\"/g, '\\"') + '"'); } catch (e) { return s; } };
for (const p of files) { const t = fs.readFileSync(p, 'utf8'); let m; lit.lastIndex = 0; while ((m = lit.exec(t))) { const s = unesc(m[1] ?? m[2] ?? m[3]); if (s.length > 1 && s.length < 600) { S.add(s); for (const part of s.split(/\[\w+\]/)) if (part.trim()) S.add(part); } } }
const P = new Set(['']); for (const s of S) { const m = s.match(/^([A-Za-z_0-9]{1,20})\|$/); if (m) P.add(m[1]); if (/^[a-z][a-z_0-9]{0,15}$/.test(s)) P.add(s); }
const keys = {}; for (const sub of ['', 'st', 'q']) { const ix = JSON.parse(fs.readFileSync(path.join(R, 'voz', sub, 'index.json'))); for (const k in ix) keys[(sub ? sub + '/' : '') + k] = ix[k]; }
const out = {}; const hits = new Map();
const Sarr = [...S]; console.error('cadenas', Sarr.length, 'prefijos', P.size);
for (const s of Sarr) for (const p of P) { const k = f(p ? p + '|' + s : s); for (const sub of ['', 'st/']) { if (keys[sub + k] != null && !out[sub + k]) out[sub + k] = [p, s.normalize('NFC').trim()]; } }
fs.writeFileSync('recovered.json', JSON.stringify(out, null, 0));
const tot = Object.keys(keys); const by = {}; for (const k of tot) { const d = k.includes('/') ? k.split('/')[0] : 'root'; by[d] = by[d] || [0, 0]; by[d][0]++; if (out[k]) by[d][1]++; }
console.log(by); const pc = {}; for (const k in out) pc[out[k][0]] = (pc[out[k][0]] || 0) + 1; console.log(pc);
