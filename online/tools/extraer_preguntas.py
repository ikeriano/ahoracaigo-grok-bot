#!/usr/bin/env python3
"""Extrae los bancos de preguntas del duelo de web/js/app.js a server/preguntas.json.
- Texto: «Pregunta|PA[L]A[B]RA» (banco extra Cy + especiales temáticos Jv).
- Imagen: 80 preguntas del proyecto Scratch (sprite «Pergunta», imagen en web/sb3/img/<hash>.webp,
  respuesta en el array fb y letras que faltan = nombre del disfraz)."""
import re, json, os, sys
base = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(base, '../web/js/app.js'), encoding='utf-8').read()
out = []
for m in re.finditer(r'"([^"|]{8,})\|([^"]+)"', s):
    q, w = m.group(1), m.group(2)
    if not re.fullmatch(r"[A-ZÁÉÍÓÚÑÜ0-9 \[\]'.,·-]+", w) or '[' not in w: continue
    out.append({'tipo': 'texto', 'q': q, 'p': w})
fbi = s.index('fb=['); fb = json.loads(s[fbi+3:s.index(']', fbi)+1])
pi = s.index('Pergunta:{'); pc = re.findall(r'\{n:"([^"]*)",f:"([0-9a-f]{32})"', s[pi:s.index(']', pi)])
import unicodedata
norm = lambda c: unicodedata.normalize('NFD', c.upper())[0]
for i, ans in enumerate(fb[:80]):
    n, f = pc[i]; miss = set(n.upper())
    p = ''.join('[%s]' % c if c != ' ' and norm(c) in miss else c for c in ans)
    out.append({'tipo': 'imagen', 'img': 'web/sb3/img/%s.webp' % f, 'q': '', 'p': p})
seen = set(); res = []
for o in out:
    k = (o['q'], o['p'], o.get('img'))
    if k not in seen: seen.add(k); res.append(o)
json.dump(res, open(os.path.join(base, '../server/preguntas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(res), 'preguntas', sum(o['tipo']=='imagen' for o in res), 'con imagen')
