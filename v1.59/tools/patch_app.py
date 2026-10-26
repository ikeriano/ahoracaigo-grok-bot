#!/usr/bin/env python3
# Parche mínimo de app.js (1.58 minificado) para la 1.59. Cada ancla debe aparecer EXACTAMENTE una vez.
import sys
src = '/workspace/ac_159/www158_orig/js/app.js'
dst = '/workspace/ac_159/ov/js/app.js'
s = open(src, encoding='utf8').read()
P = []
def rep(a, b):
    global s
    n = s.count(a)
    if n != 1: sys.exit('ANCLA %d veces: %s' % (n, a[:80]))
    s = s.replace(a, b)
# 1) expone internos
rep('window.__extras={copresentador:D0,paseoAltura:Dx,datos:so};',
    'window.__extras={copresentador:D0,paseoAltura:Dx,datos:so};window.__ac159=()=>({T:Et,so,zx,K,ze,ke,ct,Gi,V:te,Je,setJe:f=>{Je=f},Rt,St,Oe,Mt,m0,u2,Zn,D0,_t,Wa,Lo,Od,ss,Kc,hi,wo,Kl,Pe,kt});')
# 2) pruebas nuevas dentro de hi
rep('Kc=Object.keys(hi.titulos)', 'Kc=(window.__P159&&window.__P159(hi),Object.keys(hi.titulos))')
rep('e==="relojloco"?3:0', '(window.__clk159&&window.__clk159[e])||(e==="relojloco"?3:0)')
# 3) modo "mejor" (mejores momentos) en el reproductor de escenas
rep('a==="oculta"||a==="tomas"||a==="fuera"||a==="paseo")await oP(a,e,o,t)', 'a==="oculta"||a==="tomas"||a==="fuera"||a==="mejor"||a==="paseo")await oP(a,e,o,t)')
rep('else if(a==="oculta"||a==="tomas"||a==="fuera")aP(a,l)', 'else if(a==="oculta"||a==="tomas"||a==="fuera"||a==="mejor")aP(a,l)')
rep('oculta:"main",tomas:"main",fuera:"main"', 'oculta:"main",tomas:"main",fuera:"main",mejor:"main"')
rep('oculta:"CÁMARA OCULTA",tomas:"TOMAS FALSAS",fuera:"FUERA DE CÁMARAS"}[a]+" · "+l.titulo',
    'oculta:"CÁMARA OCULTA",tomas:"TOMAS FALSAS",fuera:"FUERA DE CÁMARAS",mejor:"MEJORES MOMENTOS"}[a]+" · "+l.titulo+(l.inv159?" · INVENTADO":"")')
rep('d.fillText("FUERA DE CÁMARAS"', 'd.fillText(a==="mejor"?"MEJORES MOMENTOS · RECREACIÓN":"FUERA DE CÁMARAS"')
# 4) ganchos del reproductor
rep('Mt(a+" "+l.id),n.resetPositions(),n.opps.forEach(u=>u.root.visible=!0);let c=YR(a);',
    'Mt(a+" "+l.id),n.resetPositions(),n.opps.forEach(u=>u.root.visible=!0);let c=YR(a);window.__ini159&&window.__ini159(a,l,n,c);')
rep('p=a==="fuera"&&d&&d!=="plato"?XR(n,d):null',
    'p=d&&d!=="plato"&&window.__lug159&&window.__lug159.has(d)?window.__lug159.build(n,d):a==="fuera"&&d&&d!=="plato"?XR(n,d):null')
rep('if(m==="wide"?ct.wide(n):v&&v[1]==="opp"', 'if(window.__cam159&&window.__cam159.has(m)?window.__cam159.run(m,n,r,p):m==="wide"?ct.wide(n):v&&v[1]==="opp"')
rep('if(y==="claqueta")c.claqueta', 'if(window.__fx159&&window.__fx159.has(y))await window.__fx159.run(y,M,{c,n,i,u,r,l,p,a});else if(y==="claqueta")c.claqueta')
rep('(f==="maq"||f==="dir")&&p&&p.extra?await u2(i,u,f,h,p.extra.head)',
    ' p&&p.who&&p.who[f]?await u2(i,u,f,h,p.who[f].head):(f==="maq"||f==="dir")&&p&&p.extra?await u2(i,u,f,h,p.extra.head)')
rep('finally{c.fin(),p&&p.quitar();', 'finally{c.fin(),window.__fin159&&window.__fin159(),p&&p.quitar();')
rep('r.pasos.length+" frases"', 'r.pasos.length+" frases"+(r.inv159?" · 🆕 inventada":"")')
open(dst, 'w', encoding='utf8').write(s)
print('ok', len(s))
