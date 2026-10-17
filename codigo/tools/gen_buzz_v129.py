# v1.29 · voz ORIGINAL de Buzz (Piper es_ES-sharvard-medium, voz 0): cada frase se trocea por sus marcas de entonación
# y cada trozo se sintetiza con su velocidad y tono ([hype] rápido/agudo, [solemne] lento/grave, [pausa] silencio de remate).
# Uso: /workspace/piperenv/bin/python tools/gen_buzz_v129.py [--muestra salida.mp3]
import json, os, re, subprocess, sys, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
ESTILO = {'hype': (0.66, 1.24, 0.9), 'normal': (0.8, 1.15, 0.75), 'solemne': (1.3, 0.97, 0.5), 'risa': (0.7, 1.3, 0.95), 'susurro': (1.5, 0.95, 0.3)}
COLOR = 'equalizer=f=1300:t=q:w=1.2:g=5,equalizer=f=220:t=q:w=1:g=-3,equalizer=f=3200:t=q:w=1:g=3,acompressor=threshold=-22dB:ratio=4:attack=5:release=60,volume=1.6'
V = PiperVoice.load('/workspace/piper/es_ES-sharvard-medium.onnx')
def trozos(t):
    out, est = [], 'normal'
    for m in re.finditer(r'\[(hype|normal|solemne|pausa|risa|susurro)\]|([^\[]+)', t):
        if m.group(1) == 'pausa': out.append(('pausa', ''))
        elif m.group(1): est = m.group(1)
        elif m.group(2).strip(): out.append((est, m.group(2).strip()))
    return out
def render(t, dst):
    partes = []
    for i, (est, txt) in enumerate(trozos(t)):
        f = '/tmp/bz%02d.wav' % i
        if est == 'pausa': subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=22050:cl=mono', '-t', '1.2', f], check=True)
        else:
            ls, pt, ns = ESTILO[est]
            with wave.open('/tmp/bzraw.wav', 'wb') as w: V.synthesize_wav(txt, w, syn_config=SynthesisConfig(speaker_id=0, length_scale=ls, noise_scale=ns, noise_w_scale=0.9))
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/bzraw.wav', '-af', f'asetrate=22050*{pt},aresample=22050,' + ('highpass=f=380,lowpass=f=5200,aecho=0.6:0.5:70:0.3,volume=0.5,' if est == 'susurro' else '') + 'apad=pad_dur=0.12', '-ac', '1', f], check=True)
        partes.append(f)
    ins = sum([['-i', f] for f in partes], [])
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', ''.join(f'[{k}]' for k in range(len(partes))) + f'concat=n={len(partes)}:v=0:a=1,{COLOR}', '-ac', '1', '-ar', '22050', '-b:a', '64k', dst], check=True)
    for f in partes + ['/tmp/bzraw.wav']: os.path.exists(f) and os.remove(f)
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
src = open(os.path.join(RAIZ, 'src/buzz_lineas.js'), encoding='utf8').read()
L = json.loads(subprocess.run(['node', '-e', src + ';process.stdout.write(JSON.stringify(BUZZ_L))'], capture_output=True, text=True, check=True).stdout)
fl = lambda v: [v] if isinstance(v, str) else sum((fl(x) for x in (v.values() if isinstance(v, dict) else v)), [])
limpio = lambda t: re.sub(r'\s+', ' ', re.sub(r'\[(hype|normal|solemne|pausa|risa|susurro)\]', '', t)).strip()
if '--muestra' in sys.argv:
    t = L['hola'][0] + ' [pausa]' + L['mal'][1] + ' ' + L['bien'][0]
    print('muestra', round(render(t, sys.argv[sys.argv.index('--muestra') + 1]), 2)); sys.exit()
idx_p = os.path.join(RAIZ, 'voz/st/index.json'); idx = json.load(open(idx_p)); n = 0
for t in fl(L):
    k = fnv('p_buzz|' + limpio(t))
    if k in idx and os.path.exists(os.path.join(RAIZ, 'voz/st', k + '.mp3')) and '--todo' not in sys.argv: continue
    idx[k] = round(render(t, os.path.join(RAIZ, 'voz/st', k + '.mp3')), 2); n += 1
json.dump(idx, open(idx_p, 'w'), ensure_ascii=False, separators=(',', ':')); print('frases de Buzz:', n)
