# Comprueba que la web pública de ¡Ahora caigo! (ikeriano/ahoracaigo-web) no lleva recursos oficiales:
# APK original, capturas de referencia (España y Argentina/eltrece), músicas y sonidos del APK, logo, cabeceras, minijuego Scratch.
import hashlib,os,sys
OUT=sys.argv[1] if len(sys.argv)>1 else '/workspace/ahoracaigo/ghrepo'
A='/workspace/ahoracaigo'; W=A+'/rebuild-1.22/app/src/main/assets/www'
def h(f): return hashlib.sha256(open(f,'rb').read()).hexdigest()
ofi={}
for d in [A+'/extracted',A+'/argentina_ref',A+'/apk/assets/www/sb3',A+'/apk/assets/www/cabecera',A+'/apk/assets/www/clasico',W+'/sb3',W+'/cabecera',W+'/clasico',W+'/apertura']:
  for r,_,fs in os.walk(d):
    for f in fs:
      p=os.path.join(r,f)
      if os.path.getsize(p)>200: ofi[h(p)]=p
for f in [W+'/logo.png',A+'/apk/assets/www/logo.png']:
  if os.path.exists(f): ofi[h(f)]='logo oficial'
bad=[]
for r,_,fs in os.walk(OUT):
  if '.git' in r: continue
  for f in fs:
    p=os.path.join(r,f)
    if f.endswith('.ttf'): continue
    if h(p) in ofi: bad.append((p,ofi[h(p)]))
    if f.endswith(('.jpg','.jpeg')) and 'argentina' in p.lower(): bad.append((p,'captura de referencia'))
for d in ['sb3','cabecera','clasico','apertura']:
  if os.path.isdir(os.path.join(OUT,d)): bad.append((OUT+'/'+d,'carpeta con recursos oficiales'))
if os.path.exists(OUT+'/logo.png'): bad.append((OUT+'/logo.png','logo oficial'))
print('oficiales en la web:',len(bad)); [print(' ',a,'<=',b) for a,b in bad[:20]]; sys.exit(1 if bad else 0)
