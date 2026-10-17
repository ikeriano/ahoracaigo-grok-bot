#!/usr/bin/env python3
"""Ahora Caigo 1.37: cabecera 3D del Duelo Final + logo de cadena, sobre la web 1.36 (inyecciones mínimas en el bundle)."""
import json, sys, os
W = sys.argv[1] if len(sys.argv) > 1 else '/workspace/handoff/ac137/www'
X = "this.placar"
def rep(path, pares):
    s = open(path, encoding='utf-8').read()
    for a, b in pares:
        n = s.count(a); assert n == 1, (path, a[:70], n); s = s.replace(a, b)
    open(path, 'w', encoding='utf-8').write(s)
app = os.path.join(W, 'js/app.js')
rep(app, [
  # 1) Juego final: frase del presentador con la cifra real + cabecera 3D (si la opción está en Sí)
  ('await my(this.c,"GcDueloFinal",2500)',
   '(self.DF&&DF.on()?await DF.juega(this.c,{puntos:' + X + ',pres:Oe.presentador,cabeza:o.host.head,'
   'host:()=>{let d=o.host.root.position;o.cut(yt(d.x+.9,Ge+1.7,d.z+3.2),yt(d.x,Ge+1.3,d.z)),o.face(o.host,yt(d.x+1.2,0,d.z+6)),He(o.host,"habla",3)},'
   'wide:()=>xt.wide(o)}):await my(this.c,"GcDueloFinal",2500)),self.DF&&DF.pantalla(this.placar)'),
  # 1b) la pantalla central vuelve a lo de siempre al acabar el Duelo Final
  ('let c=await this.juegoFinal();', 'let c=await this.juegoFinal();self.DF&&DF.quitaPantalla();'),
  # 2) Precalentar la voz (Piper) y el audio de la cabecera tras la última moneda
  ('this.rodadas===s)break',
   '(self.DF&&DF.on()&&this.rodadas===s&&r.final!=="bote"&&(DF.cargaCab(),DF.prepara(' + X + '))),this.rodadas===s)break'),
  # 3) Entrenamiento del juego final: cabecera (sin frase)
  ('n.say(ea.trFinal,3500),await i.w(3e3)',
   '(self.DF&&DF.on()&&await DF.juega(a,{solo:!0,wide:()=>xt.wide(o)})),n.say(ea.trFinal,3500),await i.w(3e3)'),
  # 4) Opción en "Más opciones del programa"
  ('t("ac_fda128","🥂 Campanadas y uvas en el Especial Fin de Año",!0)',
   't("ac_fda128","🥂 Campanadas y uvas en el Especial Fin de Año",!0),t("ac_dfcab137","🎬 Cabecera del Duelo Final",!0),self.CANAL&&a.appendChild(CANAL.fila())'),
  ('iy="1.36"', 'iy="1.37"'),
])
rep(os.path.join(W, 'index.html'), [('<script src="js/app.js"', '<script src="df/df.js"></script><script src="canal/canal.js"></script>\n<script src="js/app.js"')])
rep(os.path.join(W, 'sw.js'), [("ahoracaigo3d-v43", "ahoracaigo3d-v44")])
v = json.load(open(os.path.join(W, 'version.json'))); v.update(version='1.37', versionCode=44)
json.dump(v, open(os.path.join(W, 'version.json'), 'w'), ensure_ascii=False, indent=2)
print('ok', v)
