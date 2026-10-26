# 1.59: voces Piper SOLO es_ES (sin es_MX / es_AR) de las frases nuevas. Adrián -> voz/<fnv(txt)>.mp3 ; resto -> voz/st/<fnv(clave|txt)>.mp3
import json, os, subprocess, sys, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
RAIZ = os.environ.get('RAIZ', '/workspace/ac_159/ov')
ORIG = '/workspace/ac_159/www158_orig'
BR = os.environ.get('BR', '40k')
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
# clave -> (modelo es_ES, speaker, length_scale, factor_tono, filtro extra)
V = {
 'adrian':   ('es_ES-davefx-medium', None, 0.86, 1.05, 'acompressor=threshold=-18dB:ratio=3,volume=1.4'),
 'carlfm':   ('es_ES-carlfm-x_low', None, 0.95, 1.0, 'volume=1.2'),
 'sharvard': ('es_ES-sharvard-medium', None, 0.95, 1.0, 'volume=1.2'),
 'v59_lola':  ('es_ES-mls_10246-low', None, 0.93, 1.0, 'volume=1.2'),
 'v59_nuria': ('es_ES-sharvard-medium', 1, 0.95, 1.0, 'volume=1.1'),
 'v59_rober': ('es_ES-carlfm-x_low', None, 1.0, 0.93, 'volume=1.2'),
 'v59_marisa':('es_ES-mls_9972-low', None, 0.98, 0.94, 'volume=1.2'),
 'v59_carmen':('es_ES-mls_9972-low', None, 0.92, 1.04, 'volume=1.2'),
 'v59_nacho': ('es_ES-sharvard-medium', 0, 0.9, 1.1, 'volume=1.2'),
 'v59_segu':  ('es_ES-carlfm-x_low', None, 1.05, 0.82, 'volume=1.3'),
 'v59_jefe':  ('es_ES-sharvard-medium', 0, 1.05, 0.9, 'volume=1.2'),
 'v59_peque': ('es_ES-sharvard-medium', 1, 0.88, 1.32, 'volume=1.1'),
 'v59_vet':   ('es_ES-carlfm-x_low', None, 1.12, 0.95, 'volume=1.2'),
 'v59_abuela':('es_ES-mls_9972-low', None, 1.1, 0.88, 'volume=1.2'),
 'v59_locu':  ('es_ES-davefx-medium', None, 0.95, 0.88, 'acompressor=threshold=-20dB:ratio=3,volume=1.4'),
}
assert all(v[0].startswith('es_ES') for v in V.values())
L = json.load(open('/workspace/ac_159/work/lines159.json'))
pers = L['personajes']
def clave(rol):
    if rol == 'adrian': return 'adrian'
    if rol in pers: return pers[rol][1]
    return {'reg': 'carlfm', 'conc': 'sharvard', 'pub': 'carlfm'}[rol]
trab = []
for k, sid, rol, t in L['lines']:
    c = clave(rol); trab.append((c, t, 'voz', fnv(t)) if c == 'adrian' else (c, t, 'voz/st', fnv(c + '|' + t)))
if os.environ.get('PRUEBAS'):
    for pid, p in L['pr'].items():
        for t in [p['dicho']] + p['qs']: trab.append(('adrian', t, 'voz', fnv(t)))
seen = set(); trab = [x for x in trab if not ((x[2], x[3]) in seen or seen.add((x[2], x[3])))]
idx = {}
for c in ('voz', 'voz/st'):
    os.makedirs(os.path.join(RAIZ, c), exist_ok=True)
    p = os.path.join(RAIZ, c, 'index.json')
    idx[c] = json.load(open(p if os.path.exists(p) else os.path.join(ORIG, c, 'index.json')))
cache = {}; n = 0
for v, t, carp, k in trab:
    dst = os.path.join(RAIZ, carp, k + '.mp3')
    if k in idx[carp] and os.path.exists(dst): continue
    mod, spk, ls, pf, filt = V[v]
    if mod not in cache: cache[mod] = PiperVoice.load('/workspace/piper/%s.onnx' % mod)
    cfg = SynthesisConfig(length_scale=ls, speaker_id=spk) if spk is not None else SynthesisConfig(length_scale=ls)
    with wave.open('/tmp/gv159.wav', 'wb') as w: cache[mod].synthesize_wav(t, w, syn_config=cfg)
    with wave.open('/tmp/gv159.wav') as w: sr = w.getframerate()
    af = ('asetrate=%d,aresample=%d,' % (round(sr * pf), sr) if pf != 1.0 else '') + filt
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/gv159.wav', '-af', af, '-ac', '1', '-b:a', BR, dst], check=True)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    idx[carp][k] = round(dur, 2); n += 1
    if n % 25 == 0:
        for c in idx: json.dump(idx[c], open(os.path.join(RAIZ, c, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
        print(n, '/', len(trab), flush=True)
for c in idx: json.dump(idx[c], open(os.path.join(RAIZ, c, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('nuevas:', n, 'de', len(trab))
