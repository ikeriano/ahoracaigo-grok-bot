# v1.26: voces Piper (es_ES, TTS genérico) de los presentadores nuevos, del «detrás de las cámaras» y de las preguntas sin voz.
# Uso: node tools/lineas_v126.mjs URL && /workspace/piperenv/bin/python tools/gen_voces_v126.py
import json, os, re, subprocess, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
src = open(os.path.join(RAIZ, 'src/presentadores_datos.js'), encoding='utf8').read()
PV = json.loads(re.sub(r'(\w+):', r'"\1":', re.search(r'const PRES_VOCES = (\{.*?\});', src).group(1).replace("'", '"')))
VOCES = {k: (v[0], v[1], v[2], v[3], v[4], v[5]) for k, v in PV.items()}
VOCES.update({'carlfm': ('es_ES-carlfm-x_low', None, 0.95, None, None, 'volume=1.2'), 'mls_10246': ('es_ES-mls_10246-low', None, 0.95, None, None, 'volume=1.2'),
  'mls_9972': ('es_ES-mls_9972-low', None, 0.95, None, None, 'volume=1.2'), 'sharvard_f': ('es_ES-sharvard-medium', 1, 0.95, None, None, 'volume=1.1'),
  'q': ('es_ES-davefx-medium', None, 1.0, None, None, 'volume=1.1')})
L = json.load(open('/tmp/lineas126.json'))
trab = [(v, t, 'voz', fnv(v + '|' + t)) for v, t in L['pres']] + [('q', x['t'], 'voz/q', x['h']) for x in L['q']]
for m in re.finditer(r"\['(carlfm|mls_10246|mls_9972|sharvard_f)', '[^']*', '([^']*)'\]", src): trab.append((m.group(1), m.group(2), 'voz/st', fnv(m.group(1) + '|' + m.group(2))))
idx = {c: json.load(open(os.path.join(RAIZ, c, 'index.json'))) for c in ('voz', 'voz/st', 'voz/q')}
cache = {}; n = 0
for v, t, carp, k in trab:
    dst = os.path.join(RAIZ, carp, k + '.mp3')
    if k in idx[carp] and os.path.exists(dst): continue
    mod, spk, ls, ns, nw, filt = VOCES[v]
    if mod not in cache: cache[mod] = PiperVoice.load('/workspace/piper/%s.onnx' % mod)
    cfg = SynthesisConfig(speaker_id=spk, length_scale=ls, noise_scale=ns, noise_w_scale=nw)
    with wave.open('/tmp/gv126.wav', 'wb') as w: cache[mod].synthesize_wav(t.replace('¡Ahora caigo!', 'Ahora caigo'), w, syn_config=cfg)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gv126.wav', '-af', filt, '-ac', '1', '-ar', '22050', '-b:a', '64k', dst], check=True)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    idx[carp][k] = round(dur, 2); n += 1
for c in idx: json.dump(idx[c], open(os.path.join(RAIZ, c, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
os.remove('/tmp/gv126.wav') if os.path.exists('/tmp/gv126.wav') else None
print('nuevas:', n, 'de', len(trab))
