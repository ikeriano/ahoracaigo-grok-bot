import fs from 'fs'; import path from 'path';
const R = '/workspace/ahoracaigo/src-1.22';
const f = a => { let e = 2166136261; const t = a.normalize('NFC').trim(); for (let n = 0; n < t.length; n++) e ^= t.charCodeAt(n), e = Math.imul(e, 16777619) >>> 0; return e.toString(16).padStart(8, '0'); };
const files = []; const walk = d => { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, x.name); if (x.isDirectory()) { if (!/node_modules|^voz$|\.git|piper|sb3|mc3d|online|personas3d|assets/.test(x.name)) walk(p); } else if (/\.(js|mjs|py|json|jsonl|txt|md)$/.test(x.name) && fs.statSync(p).size < 40e6) files.push(p); } };
walk(R + '/src'); walk(R + '/tools');
const S = new Set(); const lit = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
const unesc = s => s.replace(/\\n/g, ' ').replace(/\\(['"`\\])/g, '$1').replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
for (const p of files) { const t = fs.readFileSync(p, 'utf8'); let m; while ((m = lit.exec(t))) { const s = unesc(m[1] ?? m[2] ?? m[3]); if (s.length > 1 && s.length < 700) S.add(s); } }
const keys = {}; for (const sub of ['', 'st']) { const ix = JSON.parse(fs.readFileSync(path.join(R, 'voz', sub, 'index.json'))); for (const k in ix) keys[(sub ? sub + '/' : '') + k] = ix[k]; }
const out = JSON.parse(fs.readFileSync('recovered3.json'));
const P = [...new Set([...Object.values(out).map(x => x[0]), ...Array.from({ length: 11 }, (_, i) => 'op' + i), ...Array.from({ length: 11 }, (_, i) => 'c' + i), ...Array.from({ length: 11 }, (_, i) => 'a' + i), 'p_buzz', 'buzz', 'adr', 'q', 'tano', 'arturo'])];
const tryS = s => { for (const p of P) { const k = f(p ? p + '|' + s : s); for (const sub of ['', 'st/']) if (keys[sub + k] != null && !out[sub + k]) out[sub + k] = [p, s.normalize('NFC').trim()]; } };
const buzz = s => s.replace(/\[(hype|normal|solemne|pausa|risa|susurro)\]/g, '').replace(/\s+/g, ' ').trim();
for (const s of S) { tryS(s); tryS(buzz(s)); tryS('(Los dos) ' + s); }
const NAMES = ['Paco', 'Lola', 'Ramón', 'Conchi', 'Tomás', 'Marisa', 'Javi', 'Rocío', 'Manolo', 'Pili', 'Iker', 'Tú'];
for (const s of S) if (/\{n\}|\{nombre\}/.test(s)) for (let n = 0; n <= 10; n++) for (const nm of NAMES) tryS(s.replaceAll('{n}', String(n)).replaceAll('{nombre}', nm));
fs.writeFileSync('recovered4.json', JSON.stringify(out));
const by = {}; for (const k in keys) { const d = k.includes('/') ? 'st' : 'root'; by[d] = by[d] || [0, 0]; by[d][0]++; if (out[k]) by[d][1]++; } console.log(by);
const un = Object.keys(keys).filter(k => !out[k]); fs.writeFileSync('unmatched.json', JSON.stringify(un));
