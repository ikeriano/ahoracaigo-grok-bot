# v1.40 · Frases nuevas de Adrián Vega con la MISMA voz que la 1.38 (tools/redub/mapping.md):
#   Piper es_MX-ald-medium · length 0.9 / noise 0.7 / noise_w 0.85 · tono +0,5 semitonos ·
#   equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=-18dB:ratio=3 · loudnorm · MP3 mono 22050 Hz.
# Voz sintética original (no es una clonación de ninguna persona).
# Uso: /workspace/piperenv/bin/python voz_adrian.py voz   -> frases del juego en voz/<fnv>.mp3 + voz/index.json
#      /workspace/piperenv/bin/python voz_adrian.py ns    -> clips de normas en ns/voz/<id>.mp3 (lista en tools/v140/ns_lineas.json)
import json, os, sys, subprocess, wave, unicodedata
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # codigo/
MODEL = '/workspace/piper/es_MX-ald-medium.onnx'
LS, NS, NW, SEMI = 0.9, 0.7, 0.85, 0.5
FX = 'equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=-18dB:ratio=3'
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
_v = None
def voz():
    global _v
    if _v is None:
        from piper import PiperVoice
        _v = PiperVoice.load(MODEL)
    return _v
def habla(txt, dst):
    from piper import SynthesisConfig
    raw, t = '/tmp/v140_raw.wav', '/tmp/v140_t.wav'
    with wave.open(raw, 'wb') as w: voz().synthesize_wav(txt.replace('&', ' y '), w, syn_config=SynthesisConfig(length_scale=LS, noise_scale=NS, noise_w_scale=NW))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse', t], check=True)
    fr = 2 ** (SEMI / 12)
    af = f'aresample=22050,asetrate={22050*fr:.1f},aresample=22050,atempo={1/fr:.5f},{FX},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=22050,adelay=60,apad=pad_dur=0.12'
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', t, '-af', af, '-ac', '1', '-ar', '22050', '-b:a', '40k', dst], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
    return round(d, 2)
FRASES = [
    '¡Ha salido la Gallina triplicadora! ¡Tu bote se multiplica por tres!',
    '¡Arrancamos! Tienes 10 oponentes por delante.', '¡Arrancamos! Tienes 9 oponentes por delante.',
    '¡Seguimos! Quedan 10 oponentes.', '¡Seguimos! Quedan 9 oponentes.',
]
if __name__ == '__main__':
    modo = sys.argv[1] if len(sys.argv) > 1 else 'voz'
    if modo == 'voz':
        ip = os.path.join(RAIZ, '..', 'voz', 'index.json') if not os.path.exists(os.path.join(RAIZ, 'voz', 'index.json')) else os.path.join(RAIZ, 'voz', 'index.json')
        idx = json.load(open(ip)); base = os.path.dirname(ip)
        for f in FRASES:
            k = fnv(f); idx[k] = habla(f, os.path.join(base, k + '.mp3')); print(k, idx[k], f)
        json.dump(idx, open(ip, 'w'), ensure_ascii=False, separators=(',', ':'))
    else:
        L = json.load(open(os.path.join(RAIZ, 'tools', 'v140', 'ns_lineas.json')))
        out = os.path.join(RAIZ, 'ns', 'voz'); dur = {}
        solo = set(sys.argv[2:])
        for k, txt in L.items():
            if solo and k not in solo: continue
            dst = os.path.join(out, k + '.mp3')
            if os.path.exists(dst) and not solo and k not in ('_force',): 
                continue
            dur[k] = habla(txt, dst); print(k, dur[k], txt[:60])
