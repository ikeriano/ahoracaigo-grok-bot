import json, re, sys, os
sys.path.insert(0, '/workspace/redub'); from voices import AC
R = '/workspace/ahoracaigo/src-1.22/voz/'
r = json.load(open('recovered5.json')); q = json.load(open('q_rec.json'))
v = {**json.load(open('val_0.json')), **json.load(open('val_1.json'))}
junk = lambda t: bool(re.search(r'[<>=_{}]|n2px|\dpx|system-ui|concat|vai |tudo', t))
REJ = {'33efa9ba', 'fcb18c78', 'b368a3c3'}
src = open('/workspace/ahoracaigo/src-1.22/src/buzz_lineas.js').read()
import subprocess
BZ = json.loads(subprocess.run(['node', '-e', src.replace('const BUZZ_L', 'var BUZZ_L') + ';const fl=v=>typeof v==="string"?[v]:Array.isArray(v)?v.flatMap(fl):Object.values(v).flatMap(fl);process.stdout.write(JSON.stringify(fl(BUZZ_L)))'], capture_output=True, text=True).stdout)
lim = lambda t: re.sub(r'\s+', ' ', re.sub(r'\[(hype|normal|solemne|pausa|risa|susurro)\]', '', t)).strip()
BZT = {lim(t): t for t in BZ}
OLDST = {'carlfm': 'toni', 'mls_10246': 'rober', 'sharvard_f': 'nuria', 'ald': 'luis', 'mls_9972': 'carmen', 'claude': 'manolo_pub', 'sharvard_m': 'jefe', 'sharvard': 'anuncios', 'davefx': 'fiesta_dave'}
def who(pref, text, st):
    if pref in ('', 'adr', 'q'): return 'adrian'
    if pref.startswith('p_'): return pref[2:]
    if pref in ('tano', 'arturo'): return pref
    m = re.fullmatch(r'(c|a|op)(\d+)', pref)
    if m: n = int(m.group(2)); return 'central' if n == 0 else 'o%d' % n
    if pref == 'daniela': return 'off' if re.match(r'(Publicidad|Volvemos|Tres anuncios|Un anuncio)', text) else 'lola_dir'
    return OLDST.get(pref)
def speak(t): return t.replace('&', ' y ').replace('ChatGPT', 'Chat G P T')
jobs, skip = [], []
for k, (p, t) in r.items():
    base = k.split('/')[-1]
    if p in ('neon', 'diez', 'panel') or junk(t) or base in REJ: skip.append(k); continue
    w = who(p, t, k.startswith('st/'))
    if not w: skip.append(k); continue
    j = {'dst': '/workspace/redub/ac/out/voz/' + k + '.mp3', 'src': R + k + '.mp3', 'text': t, 'who': w, 'key': (p + '|' if p else '') + t, 'v': AC[w]}
    if w == 'buzz': j['say'] = BZT.get(t, t)
    else: j['say'] = speak(t)
    jobs.append(j)
for h, t in q.items():
    jobs.append({'dst': '/workspace/redub/ac/out/voz/q/' + h + '.mp3', 'src': R + 'q/' + h + '.mp3', 'text': t, 'who': 'adrian', 'key': 'q|' + t, 'v': AC['adrian'], 'say': speak(t)})
json.dump(jobs, open('jobs.json', 'w'), ensure_ascii=False)
import collections; print(len(jobs), 'skip', len(skip), collections.Counter(j['who'] for j in jobs))
