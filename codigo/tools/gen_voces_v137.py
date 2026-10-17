# v1.36 · Mi programa «Especial Niños»: frases de Adrián con el nombre del programa (misma voz Piper davefx del APK)
import json, re, subprocess, wave, os, sys
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import unicodedata
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
def cambia(t, N):
    full = N if N[-1] in '!?' else N + '!'
    bare = re.sub(r'[¡!]', '', N).strip()
    return re.sub(r'¡\s*ahora\s+ca[ií]go\s*!|\bahora\s+ca[ií]go\b', lambda m: full if m.group(0).startswith('¡') else bare, t, flags=re.I)
NOMBRES = ['¡Ahora Caigo! Niños', '¡Ahora Caigo! Campionnisimi', '¡Ahora Caigo! 10 Años', '¡Adivina o te caes!', '¡Ahora Caigo! Campeón Edition', '¡Ahora Caigo! 300 Suscriptores', '¡Ahora Caigo! Especial El Cazador', '¡Ahora Caigo! Campeón Edition by Ikériano & ChatGPT', '¡Ahora Caigo! Nuevo']
L = json.load(open("/tmp/opo_l.json"))
idx_path = os.path.join(RAIZ, 'voz/index.json'); idx = json.load(open(idx_path))
voz = PiperVoice.load('/workspace/piper/es_ES-davefx-medium.onnx'); cfg = SynthesisConfig(length_scale=0.985); n = 0
for t0, N in [(a, None) for a in L]:
    t = t0; k = fnv(t)
    if k in idx and os.path.exists(os.path.join(RAIZ, 'voz', k + '.mp3')): continue
    with wave.open('/tmp/gv.wav', 'wb') as w: voz.synthesize_wav(t.replace('&', ' y ').replace('ChatGPT', 'Chat G P T'), w, syn_config=cfg)
    with wave.open('/tmp/gv.wav') as w: dur = w.getnframes() / w.getframerate()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gv.wav', '-ac', '1', '-ar', '22050', '-b:a', '32k', os.path.join(RAIZ, 'voz', k + '.mp3')], check=True)
    idx[k] = round(dur, 2); n += 1; print(k, round(dur, 2), t[:70])
json.dump(idx, open(idx_path, 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevas:', n)
