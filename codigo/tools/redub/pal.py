# Piezas de palabras de la voz en off (Creador de promos) con la voz en off NUEVA. Mismos nombres de archivo que voz/pal.
import json, os, sys, subprocess, multiprocessing as mp
sys.path.insert(0, '/workspace/redub'); import engine; from voices import AC
SRC = sys.argv[1]; OUT = '/workspace/redub/pal'; os.makedirs(OUT, exist_ok=True)
idx = json.load(open(SRC + '/index.json')); v = AC['off']
def one(item):
    w, f = item; dst = f'{OUT}/{f}'
    if os.path.exists(dst): return 0
    raw = f'/tmp/pal_{os.getpid()}.wav'; engine._synth(v['model'], v['spk'], w, v['ls'], v['ns'], v['nw'], raw)
    fr = 2 ** (v['semi'] / 12)
    af = f"aresample=22050,asetrate={22050*fr:.1f},aresample=22050,atempo={1/fr:.5f},{v['fx']},silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5"
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ac', '1', '-ar', '22050', '-b:a', '32k', dst], check=True); return 1
with mp.Pool(7) as p: n = sum(p.imap_unordered(one, list(idx.items()), chunksize=16))
json.dump(idx, open(OUT + '/index.json', 'w'), ensure_ascii=False, separators=(',', ':')); print('piezas', n, len(idx))
