#!/usr/bin/env python3
# Engancha el relevo IA en src/app.js (+ oponente137.js si existe) y tools/build.sh · idempotente
import sys, os, re, shutil
W = sys.argv[1]; S = os.path.join(W, 'src'); A = os.path.join(S, 'app.js'); s = open(A, encoding='utf8').read(); o = s
def rep(a, b, n=1):
    global s
    if b in s: return
    c = s.count(a)
    if c != n: sys.exit(f'PATRÓN {c}x (esperado {n}): {a[:90]}')
    s = s.replace(a, b)
LOSE = 'if (this.used.add(c), await this.duelo(c) === "lose") return ET.relevo && (mec("relevo"), He(e.opps[c - 1], "arriba", 2), await t.say(`${me.rival(c)} ocupa tu sitio en el centro y se queda con tu dinero${this.vidas > 0 ? " y tu comodín" : ""}.`, 3500)), this.fin("perdido");'
rep(LOSE, LOSE.replace('=== "lose") return ', '=== "lose") { if (await riaRelevo(this, c)) { if (this.rodadas >= ND) break; continue; } return ').rstrip(';') + '; }')
if 'opoFase(this) === "lose") return this.fin("perdido");' in s or 'riaOpo(this)' in s:
    rep('if (this.opo && await opoFase(this) === "lose") return this.fin("perdido");', 'if (this.opo && await opoFase(this) === "lose" && !(await riaOpo(this))) return this.fin("perdido");')
rep('const o = e === "ganado" ? `¡Has ganado ${Uo(this.placar)} puntos!`', 'const o = riaLinea(e, this) || (e === "ganado" ? `¡Has ganado ${Uo(this.placar)} puntos!`')
rep(': "Esta vez has caído… ¡a la próxima!";', ': "Esta vez has caído… ¡a la próxima!");')
rep('(t.querySelector("i").textContent = o === "me" ? "TU TURNO" : "")', '(t.querySelector("i").textContent = o === "me" ? (window.__iaC ? RIA_T.suTurno : "TU TURNO") : "")')
m = re.search(r'yn\.score\(`\$\{i\.line\}<br><small>Duelos ganados: (.*?)</small>`, true\)', s)
if m and 'i.ria' not in s:
    s = s.replace(m.group(0), 'yn.score(i.ria ? i.line + i.ria : `${i.line}<br><small>Duelos ganados: ' + m.group(1) + '</small>`, true)', 1)
elif 'i.ria' not in s: sys.exit('sin marcador de duelos ganados')
if s != o: open(A, 'w', encoding='utf8').write(s); print('app.js parcheado')
O = os.path.join(S, 'oponente137.js')
if os.path.exists(O):
    t = open(O, encoding='utf8').read()
    if 'sv._plAntes = sv.placar; sv.placar = 0; return' not in t:
        a = "await opoTalk(sv, 'pierdes', 5000); sv.placar = 0; return 'lose';"
        assert t.count(a) == 1, 'oponente137'
        open(O, 'w', encoding='utf8').write(t.replace(a, "await opoTalk(sv, 'pierdes', 5000); sv._plAntes = sv.placar; sv.placar = 0; return 'lose';")); print('oponente137 parcheado')
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'relevo138.js'), os.path.join(S, 'relevo138.js'))
B = os.path.join(W, 'tools', 'build.sh'); b = open(B).read()
if 'relevo138.js' not in b:
    b2 = re.sub(r'(cat src/app\.js [^\n>]*?)( >> tmp/all\.js)', r'\1 src/relevo138.js\2', b, count=1)
    assert b2 != b, 'build.sh'; open(B, 'w').write(b2); print('build.sh parcheado')
