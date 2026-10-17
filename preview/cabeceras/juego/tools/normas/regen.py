# Regenera los clips con peor reconocimiento (hasta 6 intentos, se queda el mejor). Misma configuración de Adrián.
from faster_whisper import WhisperModel
import json, subprocess, numpy as np, re, unicodedata, wave, shutil, os
from piper import PiperVoice, SynthesisConfig
NUM = {'2':'dos','3':'tres','5':'cinco','9':'nueve','10':'diez','20':'veinte','25':'veinticinco','30':'treinta','35':'treinta y cinco','40':'cuarenta','45':'cuarenta y cinco','2.000':'dos mil','5.000':'cinco mil','2000':'dos mil','5000':'cinco mil'}
def load(f):
    b = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout
    return np.frombuffer(b,np.int16).astype(np.float32)/32768
def norm(t):
    t = re.sub(r'\d+(?:\.\d+)?', lambda m: NUM.get(m.group(0), m.group(0)), t)
    t = unicodedata.normalize('NFD', t.lower()); t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9ñ ]+', ' ', t).split()
def wer(a, b):
    d = list(range(len(b)+1))
    for i in range(1, len(a)+1):
        p = d[:]; d[0] = i
        for j in range(1, len(b)+1): d[j] = min(p[j]+1, d[j-1]+1, p[j-1]+(a[i-1] != b[j-1]))
    return d[len(b)]/max(1, len(a))
m = WhisperModel('small', device='cpu', compute_type='int8')
v = PiperVoice.load('/workspace/tts/es_ES-davefx-medium.onnx'); cfg = SynthesisConfig(length_scale=0.985, noise_scale=0.667, noise_w_scale=0.8)
def mide(f, t): segs, _ = m.transcribe(load(f), language='es'); h = ' '.join(s.text for s in segs); return wer(norm(t), norm(h)), h
def gen(t, dst):
    with wave.open('/tmp/nsr.wav', 'wb') as w: v.synthesize_wav(t, w, syn_config=cfg)
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i','/tmp/nsr.wav','-af','volume=1.0','-ac','1','-ar','22050','-b:a','64k',dst], check=True)
tot = []
for id_, t in json.load(open('tools/voces.json')):
    f = 'ns/voz/%s.mp3' % id_; w, h = mide(f, t)
    k = 0
    while w > 0.12 and k < 6:
        k += 1; gen(t, '/tmp/cand.mp3'); w2, h2 = mide('/tmp/cand.mp3', t)
        if w2 < w: shutil.copy('/tmp/cand.mp3', f); w, h = w2, h2
    tot.append(w)
    if w > 0.12: print('%-14s %.2f | %s || %s' % (id_, w, t, h))
print('WER medio %.3f en %d clips' % (sum(tot)/len(tot), len(tot)))
