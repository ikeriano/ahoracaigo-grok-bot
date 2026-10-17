# Normas sorpresa en ¡Ahora caigo! 1.36: parchea el www de la 1.35 con inyecciones mínimas (cada una debe aparecer UNA vez).
# Uso: python3 parche_ns.py <www_origen_1.35> <www_destino>   (el destino ya es una copia del origen)
import sys, re, os, shutil
src, dst = sys.argv[1], sys.argv[2]
js = open(os.path.join(src, 'js/app.js'), encoding='utf-8').read()
N = 'self.NSAC'
# OJO: «NS» ya existe como nombre minificado dentro del bundle; desde app.js solo se usa self.NS / self.NSAC / NSAC / self.NSOK / self.NSY
def rep(a, b, n=1):
    global js
    c = js.count(a)
    assert c == n, (a, c)
    js = js.replace(a, b)
# 1) versión
rep('iy="1.35"', 'iy="1.36"')
# 2) opciones: fila «🎲 Normas sorpresa» (No por defecto) justo antes de «✨ Calidad gráfica»
rep('l.append(g,x,S,So("main"))', 'l.append(...self.NS&&self.NS.fila?[self.NS.fila("orow","tbtn")]:[],g,x,S,So("main"))')
# 3) fin de partida al volver a un menú o lanzar otro modo
rep('function rt(a="main"){', 'function rt(a="main"){%s&&NSAC.fin();' % N)
rep('async function Vt(a,e){', 'async function Vt(a,e){%s&&NSAC.fin();' % N)
# 4) Programa completo: Adrián anuncia las normas antes de subir a la trampilla central
rep('await this.subirAlCentro()', '(%s&&await NSAC.inicio("programa",this,oe)),await this.subirAlCentro()' % N)
# 5) Entrenamiento
rep('await N9(a),n.hashtag("#AhoraCaigoEntrena");', 'await N9(a),n.hashtag("#AhoraCaigoEntrena"),%s&&await NSAC.inicio("ent:"+e,null,oe);' % N)
rep('e.noVidas=!1,e.vidas=Dx(2),', 'e.noVidas=!1,e.vidas=Dx(2)+(%s?NSAC.comodMas():0),' % N)
# 6) nivel de los oponentes
rep('function Qr(a,e){return ly(.1+(ly(e,1,8)-1)/7*.62+(b9[(a-1)%10]||0),.05,.85)}',
    'function Qr(a,e){return(%s?NSAC.skill:Number)(ly(.1+(ly(e,1,8)-1)/7*.62+(b9[(a-1)%%10]||0),.05,.85),e)}' % N)
# 7) relojes del duelo y prórroga
rep('p=c.__duelClock||30', 'p=c.__duelClock||(%s?NSAC.reloj(30):30)' % N)
rep('bot:c.__botClock||p', 'bot:c.__botClock||(%s?NSAC.relojR(p):p)' % N)
rep('if(D==="tiempo")return b.out("me"),x("me-tiempo"),"lose"', 'if(D==="tiempo"){if(%s&&NSAC.prorroga(u))continue;return b.out("me"),x("me-tiempo"),"lose"}' % N)
# 8) fallo en pruebas con respuestas (antes de gastar comodín)
rep('function cf(a,e,t){return ', 'function cf(a,e,t){if(%s&&NSAC.salva())return!0;return ' % N)
# 9) trampilla bloqueada
rep(':this.perder()}', ':%s&&NSAC.bloqueo()?(da(-1,!1),this.c.panel.hideAll(500),NSAC.salvado(this,e,c)):this.perder()}' % N)
# 10) moneda de la trampilla (Programa y Entrenamiento de huellas)
rep('await K4(this.c,d,this)', '(%s&&NSAC.antes(this)),await K4(this.c,d,this),(%s&&NSAC.despues(this,d))' % (N, N))
rep('await K4(a,s,n,!0)', '(%s&&NSAC.antes(n)),await K4(a,s,n,!0),(%s&&NSAC.despues(n,s))' % (N, N))
# 11) plantarse antes del final y juego final (Programa)
rep('this.placar=Math.floor(this.placar/2)', 'this.placar=Math.floor(this.placar*(%s?NSAC.planta():.5))' % N)
rep('let c={left:120},d=!1,p=0;window.__jfClock=c,r.showBg(!0),r.showClock(!0),r.setTime(120);',
    'let nsJ=%s?NSAC.final(120):120,c={left:nsJ},d=!1,p=0;window.__jfClock=c,r.showBg(!0),r.showClock(!0),r.setTime(nsJ);' % N)
rep('f=Math.max(0,120-Math.floor(h))', 'f=Math.max(0,nsJ-Math.floor(h))')
rep('for(;this.acertos<10;)', 'for(;this.acertos<(%s?NSAC.meta():10);)' % N)
rep('this.placar*=2', 'this.placar*=%s?NSAC.finalX():2' % N)
# juego final del Entrenamiento
rep('let h={left:120},f=performance.now()+2300;window.__jfClock=h,r.showBg(!0),r.showClock(!0),r.setTime(120);',
    'let nsJ=%s?NSAC.final(120):120,h={left:nsJ},f=performance.now()+2300;window.__jfClock=h,r.showBg(!0),r.showClock(!0),r.setTime(nsJ);' % N)
rep('x=b<0?120:Math.max(0,120-Math.floor(b))', 'x=b<0?nsJ:Math.max(0,nsJ-Math.floor(b))')
# 12) preguntas sueltas con reloj de 30 s (Entrenamiento)
i = js.index('async pregunta(e,t,o,n,i){'); j = js.index('async caida(e,t){', i)
p = js[i:j]; p0 = p
p = p.replace('let{panel:r,s,hud:l}=this.c;', 'let{panel:r,s,hud:l}=this.c,nsT=%s?NSAC.t30(e):30;' % N, 1)
p = p.replace('r.setTime(30)', 'r.setTime(nsT)', 1).replace('let u=30,', 'let u=nsT,', 1).replace('r.setTime(30,0)', 'r.setTime(nsT,0)', 1)
p = p.replace('b=g<0?30:Math.max(0,30-Math.floor(g)-1)', 'b=g<0?nsT:Math.max(0,nsT-Math.floor(g)-1)', 1)
p = p.replace('c==="tiempo"?(r.stopInput(),', 'c==="tiempo"?(%s&&NSAC.ko(),r.stopInput(),' % N, 1)
assert p.count('nsT') == 6 and all(x not in p for x in ('setTime(30', 'u=30,', '?30:', '0,30-')) and 'NSAC.ko()' in p, p
js = js[:i] + p + js[j:]
# 13) aciertos del jugador (para la fiesta y la voz de Adrián)
rep('"¡CORRECTO!"', '(self.NSOK||String)("¡CORRECTO!")', 4)
rep('"¡CORRECTO! Era: "', '(self.NSOK||String)("¡CORRECTO! Era: ")')
rep('He(u==="me"?n.player:s,"arriba",1.2)', 'He(u==="me"?(self.NSY||Object)(n.player):s,"arriba",1.2)', 2)
rep('He(F==="me"?n.player:s,"arriba",1.4)', 'He(F==="me"?(self.NSY||Object)(n.player):s,"arriba",1.4)')
rep('He(f==="me"?n.player:s,"arriba",1.1)', 'He(f==="me"?(self.NSY||Object)(n.player):s,"arriba",1.1)')
open(os.path.join(dst, 'js/app.js'), 'w', encoding='utf-8').write(js)
# index.html: los tres scripts de las normas, antes del juego
h = open(os.path.join(src, 'index.html'), encoding='utf-8').read()
a = '<script src="js/app.js">'; assert h.count(a) == 1
h = h.replace(a, '<script src="ns/ns.js"></script><script src="ns/cat.js"></script><script src="ns/ac.js"></script>' + a)
open(os.path.join(dst, 'index.html'), 'w', encoding='utf-8').write(h)
# versión y caché del PWA
open(os.path.join(dst, 'version.json'), 'w').write('{"version": "1.36", "versionCode": 43}')
s = open(os.path.join(src, 'sw.js'), encoding='utf-8').read(); assert s.count("'ahoracaigo3d-v42'") == 1
open(os.path.join(dst, 'sw.js'), 'w', encoding='utf-8').write(s.replace("'ahoracaigo3d-v42'", "'ahoracaigo3d-v43'"))
print('parches OK', len(js))
