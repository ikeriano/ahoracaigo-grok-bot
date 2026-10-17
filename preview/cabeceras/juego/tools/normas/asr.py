from faster_whisper import WhisperModel
import json,subprocess,numpy as np,re,unicodedata
def load(f):
    b=subprocess.run(['ffmpeg','-v','error','-i',f,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout
    return np.frombuffer(b,np.int16).astype(np.float32)/32768
def norm(t): t=unicodedata.normalize('NFD',t.lower()); t=''.join(c for c in t if unicodedata.category(c)!='Mn'); return re.sub(r'[^a-z0-9ñ ]+',' ',t).split()
def wer(a,b):
    d=list(range(len(b)+1))
    for i in range(1,len(a)+1):
        p=d[:]; d[0]=i
        for j in range(1,len(b)+1): d[j]=min(p[j]+1,d[j-1]+1,p[j-1]+(a[i-1]!=b[j-1]))
    return d[len(b)]/max(1,len(a))
m=WhisperModel('small',device='cpu',compute_type='int8'); tot=[]
for id_,t in json.load(open('/workspace/handoff/ac136/tools/voces.json')):
    segs,_=m.transcribe(load('/workspace/handoff/ac136/ns/voz/%s.mp3'%id_),language='es')
    h=' '.join(s.text for s in segs); w=wer(norm(t),norm(h)); tot.append(w)
    if w>0.15: print('%-16s %.2f | %s || %s'%(id_,w,t,h))
print('WER medio %.3f en %d clips'%(sum(tot)/len(tot),len(tot)))
