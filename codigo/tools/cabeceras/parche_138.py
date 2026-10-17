#!/usr/bin/env python3
"""Ahora Caigo 1.38 sobre la web 1.37: cabeceras de inicio 3D (ci/) y especial «Lo mejor de» (lm/). Inyecciones mínimas."""
import json, sys, os
W = sys.argv[1] if len(sys.argv) > 1 else '/workspace/handoff/ac138/www'
def rep(path, pares):
    s = open(path, encoding='utf-8').read()
    for a, b in pares:
        n = s.count(a); assert n == 1, (path, a[:70], n); s = s.replace(a, b)
    open(path, 'w', encoding='utf-8').write(s)
app = os.path.join(W, 'js/app.js')
pares = [
  # cabecera de inicio 3D al empezar el programa (tras las entradas propias de los especiales)
  ('||await gg(n,i,o.theme)||(it.cabecera==="cab3d"', '||await gg(n,i,o.theme)||self.CI&&await CI.juega({eng:o,hud:n})||(it.cabecera==="cab3d"'),
  # opción Aleatoria / 1 / 2 / 3 / La de siempre
  ('self.CANAL&&a.appendChild(CANAL.fila())', 'self.CANAL&&a.appendChild(CANAL.fila()),self.CI&&a.appendChild(CI.fila())'),
  ('iy="1.37"', 'iy="1.38"'),
]
extra = os.path.join(os.path.dirname(__file__), 'parche_lm.json')
if os.path.exists(extra): pares += [tuple(p) for p in json.load(open(extra, encoding='utf-8'))]
rep(app, pares)
idx = '<script src="ci/ci.js"></script>' + ('<script src="lm/lm.js"></script>' if os.path.exists(os.path.join(W, 'lm/lm.js')) else '')
rep(os.path.join(W, 'index.html'), [('<script src="canal/canal.js"></script>', '<script src="canal/canal.js"></script>' + idx)])
rep(os.path.join(W, 'sw.js'), [("ahoracaigo3d-v44", "ahoracaigo3d-v45")])
v = json.load(open(os.path.join(W, 'version.json'))); v.update(version='1.38', versionCode=45)
json.dump(v, open(os.path.join(W, 'version.json'), 'w'), ensure_ascii=False, indent=2)
print('ok', v)
