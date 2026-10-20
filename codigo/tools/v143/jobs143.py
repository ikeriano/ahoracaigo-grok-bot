import json,re,sys,os,collections,difflib,unicodedata
sys.path.insert(0,'/workspace/ac_143/redub'); from voices143 import AC
sys.path.insert(0,'/workspace/ac_141/redub'); from voices import AC as OLD
X='/workspace/ac_143/dl/x/assets/www/voz/'; O='/workspace/ac_143/out/voz/'
r=json.load(open('/workspace/ac_141/diag/rec3.json')); j141=json.load(open('/workspace/ac_141/redub/jobs141.json'))
qt=json.load(open('/workspace/ac_143/q_txt.json')); asr=json.load(open('/workspace/ac_143/asr_unk.json'))
junk=lambda t: bool(re.search(r'[<>=_{}]|n2px|\dpx|system-ui|concat|vai |tudo', t))
REJ={'33efa9ba','fcb18c78','b368a3c3'}
speak=lambda t: t.replace('&',' y ').replace('ChatGPT','Chat G P T')
OLDST={'carlfm':'toni','mls_10246':'rober','sharvard_f':'nuria','ald':'luis','mls_9972':'carmen','claude':'manolo_pub','sharvard_m':'jefe','sharvard':'anuncios','davefx':'fiesta_dave'}
def who(p,t):
    if p in ('','adr','q'): return 'adrian'
    if p.startswith('p_'): return p[2:]
    if p in ('tano','arturo'): return p
    m=re.fullmatch(r'(c|a|op)(\d+)',p)
    if m: n=int(m.group(2)); return 'central' if n==0 else 'o%d'%n
    if p=='daniela': return 'off' if re.match(r'(Publicidad|Volvemos|Tres anuncios|Un anuncio)',t) else 'lola_dir'
    return OLDST.get(p)
items={}  # key -> (who,text)
for k,(p,t) in r.items():
    if p in ('neon','diez','panel') or junk(t) or k.split('/')[-1] in REJ: continue
    w=who(p,t)
    if w: items[k]=(w,t)
for x in j141: items[x['key']]=(x['who'],x['text'])
for k,t in qt.items(): items[k]=('adrian',t)
qa=json.load(open('/workspace/ac_143/q_txt_all.json'))
# desconocidos: preguntas -> buscar el literal más parecido del código; resto -> se informa
s=open('/workspace/ac_143/dl/x/assets/www/js/app.js').read()
lits=list({m.group(2) for m in re.finditer(r'"((?:\\.|[^"\\]){0,0})?([^"\\]{8,300})"',s)})
low=[l.lower() for l in lits]
otros={}; asr_only=[]
for k,a in asr.items():
    if k in qa: items[k]=('adrian',qa[k]); continue
    if k.startswith('q/'):
        m=difflib.get_close_matches(a.lower(),low,n=1,cutoff=0.75)
        items[k]=('adrian', lits[low.index(m[0])].split('|')[0] if m else a); (None if m else asr_only.append(k))
    else: otros[k]=a
json.dump(otros,open('/workspace/ac_143/otros_unk.json','w'),ensure_ascii=False,indent=0)
jobs=[]
for k,(w,t) in items.items():
    if not os.path.exists(X+k+'.mp3'): continue
    if OLD[w]['model'].startswith('es_ES') and w!='luis': continue
    jobs.append({'dst':O+k+'.mp3','src':X+k+'.mp3','text':t,'say':speak(t),'who':w,'key':k,'v':AC[w],'force':False})
print('solo_asr',len(asr_only),asr_only[:5]);print(len(jobs),collections.Counter(j['who'] for j in jobs)); json.dump(jobs,open('jobs143.json','w'),ensure_ascii=False)
