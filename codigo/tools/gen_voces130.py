# v1.30 · voces ORIGINALES de los concursantes (VOZ130/FR130) y reacciones de los presentadores nuevos (PRES130) → voz/st
# Uso: /workspace/piperenv/bin/python tools/gen_voces130.py [--muestras carpeta]
import json, os, re, subprocess, sys, wave, unicodedata
from piper import PiperVoice, SynthesisConfig
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def fnv(t):
    t = unicodedata.normalize('NFC', t).strip(); h = 2166136261
    for ch in t:
        for cu in ([ord(ch)] if ord(ch) < 0x10000 else [0xD800 + ((ord(ch) - 0x10000) >> 10), 0xDC00 + ((ord(ch) - 0x10000) & 0x3FF)]):
            h ^= cu; h = (h * 16777619) & 0xFFFFFFFF
    return '%08x' % h
src = open(os.path.join(RAIZ, 'src/voces130.js'), encoding='utf8').read().split('const VOZ130_ON')[0]
pres_src = re.search(r'const PRES130 = \{.*?\n\};', open(os.path.join(RAIZ, 'src/voces130.js'), encoding='utf8').read(), re.S).group(0)
src131 = open(os.path.join(RAIZ, 'src/v131_datos.js'), encoding='utf8').read()
D = json.loads(subprocess.run(['node', '-e', src131 + src + pres_src + ';process.stdout.write(JSON.stringify({V:VOZ130,F:FR130,P:PRES130,V2:VOZ131,F2:FR131,T:TANO131}))'], capture_output=True, text=True, check=True).stdout)
ps = open(os.path.join(RAIZ, 'src/presentadores_datos.js'), encoding='utf8').read()
PV = json.loads(re.sub(r'(\w+):', r'"\1":', re.search(r'const PRES_VOCES = (\{.*?\});', ps).group(1).replace("'", '"')))
cache = {}
def voz(m): 
    if m not in cache: cache[m] = PiperVoice.load('/workspace/piper/%s.onnx' % m)
    return cache[m]
def sint(mod, spk, ls, ns, nw, filt, t, dst):
    v = voz(mod); cfg = SynthesisConfig(speaker_id=spk, length_scale=ls, noise_scale=ns, noise_w_scale=nw)
    with wave.open('/tmp/v130.wav', 'wb') as w: v.synthesize_wav(t, w, syn_config=cfg)
    sr = v.config.sample_rate
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', '/tmp/v130.wav', '-af', filt, '-ac', '1', '-ar', '22050', '-b:a', '64k', dst], check=True)
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout)
def conc_filt(pt, eq, sr): return f'asetrate={sr}*{pt},aresample=22050,{eq},silenceremove=start_periods=1:start_threshold=-45dB,volume=1.3'
trab = []
for k, (ck, nom, mod, spk, ls, pt, eq) in enumerate(D['V']):
    for m in D['F']:
        L = D['F'][m]
        for t in {L[k % len(L)], L[(k + 4) % len(L)]}: trab.append((ck, t, (mod, spk, ls, 0.75, 0.8, ('CONC', pt, eq))))
for k, (ck, nom, mod, spk, ls, pt, eq) in enumerate(D['V2']):
    for m in D['F2']:
        L = D['F2'][m]
        for t in {L[k % len(L)], L[(k + 4) % len(L)]}: trab.append((ck, t, (mod, spk, ls, 0.75, 0.8, ('CONC', pt, eq))))
T = D['T']; tm, tspk, tls, tpt, teq = T['cfg']
for m in ('saluda', 'acierta', 'falla', 'cae', 'gana'):
    for t in T[m]: trab.append(('tano', t, (tm, tspk, tls, 0.7, 0.8, ('CONC', tpt, teq))))
for vk, M in D['P'].items():
    mod, spk, ls, ns, nw, filt = PV[vk]
    for m, L in M.items():
        for t in L: trab.append((vk, t, (mod, spk, ls, ns, nw, filt)))
def hace(ck, t, cfg, dst):
    mod, spk, ls, ns, nw, f = cfg
    if isinstance(f, tuple): f = conc_filt(f[1], f[2], voz(mod).config.sample_rate)
    return sint(mod, spk, ls, ns, nw, f, t, dst)
if '--muestras' in sys.argv:
    out = sys.argv[sys.argv.index('--muestras') + 1]; os.makedirs(out, exist_ok=True)
    grupos = {'argentina': [x for x in trab if (x[0].startswith('a') and x[0][1:].isdigit() and int(x[0][1:]) in (1, 2, 3, 8) and x[1] in [D['F2'][m][int(x[0][1:]) % 11] for m in ('saluda', 'cae')]) or (x[0] == 'tano' and x[1] in (T['saluda'][0], T['cae'][0]))],
              'concursantes_rivales': [x for x in trab if x[0] in ('c1', 'c2', 'c3', 'c4', 'c6', 'c9') and x[1] in sum([[D['F'][m][int(x[0][1:]) % 11]] for m in ('saluda', 'cae')], [])],
              'concursante_tu': [x for x in trab if x[0] == 'c0'][:4],
              'presentadores_nuevos': [x for x in trab if x[0].startswith('p_') and x[1] in [D['P'][x[0]][m][0] for m in ('acierta', 'cae')]]}
    for g, L in grupos.items():
        fs = []
        for i, (ck, t, cfg) in enumerate(L): f = '/tmp/m130_%02d.mp3' % i; hace(ck, t, cfg, f); fs.append(f)
        ins = sum([['-i', f] for f in fs], []); n = len(fs)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', ''.join(f'[{k}]apad=pad_dur=0.35[a{k}];' for k in range(n)) + ''.join(f'[a{k}]' for k in range(n)) + f'concat=n={n}:v=0:a=1', '-ac', '1', '-b:a', '96k', os.path.join(out, f'muestra_{g}.mp3')], check=True)
        for f in fs: os.remove(f)
        print(g, n)
    sys.exit()
idx_p = os.path.join(RAIZ, 'voz/st/index.json'); idx = json.load(open(idx_p)); n = 0
for ck, t, cfg in trab:
    k = fnv(ck + '|' + t); dst = os.path.join(RAIZ, 'voz/st', k + '.mp3')
    if k in idx and os.path.exists(dst): continue
    idx[k] = round(hace(ck, t, cfg, dst), 2); n += 1
json.dump(idx, open(idx_p, 'w'), ensure_ascii=False, separators=(',', ':')); print('nuevas', n, 'de', len(trab))
os.path.exists('/tmp/v130.wav') and os.remove('/tmp/v130.wav')
