import fs from 'fs';
const R = '/workspace/ahoracaigo/src-1.22';
const f = a => { let e = 2166136261; const t = a.normalize('NFC').trim(); for (let n = 0; n < t.length; n++) e ^= t.charCodeAt(n), e = Math.imul(e, 16777619) >>> 0; return e.toString(16).padStart(8, '0'); };
const out = JSON.parse(fs.readFileSync('recovered4.json')); const un = new Set(JSON.parse(fs.readFileSync('unmatched.json')));
const src = fs.readFileSync(R + '/src/buzz_lineas.js', 'utf8'); const L = eval(src.replace(/^const BUZZ_L =/m, '(').replace(/;\s*\n[\s\S]*$/, ')')) ;
