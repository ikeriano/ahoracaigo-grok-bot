# Voces Piper (sin conexión) para las frases del relevo IA · añade SOLO claves nuevas a <voz>/index.json (no toca las demás)
# Uso: piperenv/bin/python gen_voces_relevo.py <carpeta voz> <voz> <frases.json> [--prefijo X]
#   <voz>: clave de /workspace/redub/voices.py (AC) p. ej. adrian | tano, o un modelo Piper (es_ES-davefx-medium[:ls]) 
import json, os, sys, subprocess, unicodedata, wave
sys.path.insert(0, '/workspace/redub')
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
VOZ, QUIEN, FR = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
pre = sys.argv[sys.argv.index('--prefijo') + 1] + '|' if '--prefijo' in sys.argv else ''
if ':' in QUIEN or QUIEN.count('-') >= 2:
    m, _, ls = QUIEN.partition(':'); v = {'model': m, 'spk': None, 'ls': float(ls or 0.985), 'ns': 0.667, 'nw': 0.8, 'semi': 0, 'fx': ''}
else:
    from voices import AC; v = AC[QUIEN]
from piper import PiperVoice, SynthesisConfig
pv = PiperVoice.load(f"/workspace/piper/{v['model']}.onnx")
idx_p = os.path.join(VOZ, 'index.json'); idx = json.load(open(idx_p)); n = 0
for t in FR:
    k = fnv(pre + t); dst = os.path.join(VOZ, k + '.mp3')
    if k in idx and os.path.exists(dst): continue
    raw = '/tmp/ria_v.wav'
    with wave.open(raw, 'wb') as w: pv.synthesize_wav(t.replace('…', '...'), w, syn_config=SynthesisConfig(speaker_id=v['spk'], length_scale=v['ls'], noise_scale=v['ns'], noise_w_scale=v['nw']))
    fr = 2 ** (v['semi'] / 12); af = ['aresample=22050'] + ([f'asetrate={22050*fr:.1f}', 'aresample=22050', f'atempo={1/fr:.5f}'] if v['semi'] else [])
    if v['fx']: af.append(v['fx'])
    af += ['silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', 'loudnorm=I=-16:TP=-1.5']
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', ','.join(af), '-ac', '1', '-ar', '22050', '-b:a', '32k', dst], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    idx[k] = round(d, 2); n += 1; print(k, round(d, 2), t[:70])
# volver a leer justo antes de escribir por si otro trabajo ha tocado el índice mientras tanto
cur = json.load(open(idx_p)); add = {k: idx[k] for k in idx if k not in cur}; cur.update(add)
json.dump(cur, open(idx_p, 'w'), ensure_ascii=False, separators=(',', ':')); print('nuevas', n, 'añadidas al índice', len(add))
