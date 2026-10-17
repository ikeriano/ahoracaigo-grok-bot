# Normas sorpresa · voz de Adrián Vega con su configuración exacta de la 1.35 (codigo/tools/gen_voces130.py, 'adr'):
# Piper es_ES-davefx-medium, length_scale 0.985, noise_scale 0.667, noise_w 0.8, filtro volume=1.0, mono 22050 Hz, MP3 64k.
# Salida: <www>/ns/voz/<id>.mp3 (carpeta nueva; las voces de voz/ no se tocan). Uso: python3 gen_ns_voz.py <www/ns> [ids...]
import json, os, subprocess, wave, sys
from piper import PiperVoice, SynthesisConfig
OUT = sys.argv[1]; solo = set(sys.argv[2:]); os.makedirs(OUT + '/voz', exist_ok=True)
v = PiperVoice.load('/workspace/tts/es_ES-davefx-medium.onnx')
cfg = SynthesisConfig(length_scale=0.985, noise_scale=0.667, noise_w_scale=0.8)
for id_, t in json.load(open(os.path.join(os.path.dirname(__file__), 'voces.json'))):
    if solo and id_ not in solo: continue
    with wave.open('/tmp/nsac.wav', 'wb') as w: v.synthesize_wav(t, w, syn_config=cfg)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/nsac.wav', '-af', 'volume=1.0', '-ac', '1', '-ar', '22050', '-b:a', '64k', f'{OUT}/voz/{id_}.mp3'], check=True)
print('ok')
