# Comprueba con Whisper la frase cosida (mismo cosido que df.js) para muchos valores. Uso: asr_df.py <df> [valores...]
import sys, subprocess, re, random, numpy as np, unicodedata, wave
sys.argv += [] ; D = sys.argv[1]
exec(open(D + '/../tools/gen_df_voz.py').read().split('PRE, SUF')[0].split('OUT = ')[0] + open(D + '/../tools/gen_df_voz.py').read().split("NP = int(sys.argv[2]) if len(sys.argv) > 2 else 6\n")[1].split('PRE, SUF')[0])
def pal(n):
    M, m, r = n // 10**6, n % 10**6 // 1000, n % 1000; o = []
    if M: o.append(trozo('M', M))
    if m: o.append(trozo('m', m))
    if r: o.append(m1000(r))
    return ' '.join(o)
def trozos(x):
    if x == 1: return ['p1']
    M, m, n = x // 10**6, x % 10**6 // 1000, x % 1000; t = ['pre']
    if M: t.append('M/%d' % M)
    if m: t.append('m/%d' % m)
    if n: t.append('n/%d' % n)
    return t + ['suf']
def dec(f, sr=48000):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy()
def cose(x, sr=48000):
    F = int(sr * .012); out = np.zeros(0, np.float32)
    for i, t in enumerate(trozos(x)):
        d = dec(f'{D}/voz/{t}.ogg', sr)
        if i: d[:F] *= np.arange(F) / F
        if t != 'suf' and t != 'p1': d[-F:] *= (F - np.arange(F)) / F
        if i: out[-F:] += d[:F]; out = np.concatenate([out, d[F:]])
        else: out = d
    return out
if __name__ == '__main__':
    import os; os.environ.setdefault('HF_HUB_OFFLINE', '1')
    from faster_whisper import WhisperModel
    import scipy.signal as ss
    vals = [int(v) for v in sys.argv[2:]] or [1, 12000, 31001, 25000, 51001, 7500, 150000, 2001, 1500000]
    random.seed(7); vals += [random.choice([1000, 5000, 15000, 25000, 50000]) * random.randint(1, 8) + random.choice([0, 0, 1, 500, 2]) for _ in range(12)]
    m = WhisperModel('small', device='cpu', compute_type='int8'); mal = 0
    for x in vals:
        a = cose(x); a16 = ss.resample_poly(a, 1, 3).astype(np.float32)
        segs, _ = m.transcribe(a16, language='es', initial_prompt='Números escritos con letras, sin cifras: cuatrocientos siete mil tres, ochenta y nueve mil seis.')
        h = ' '.join(s.text for s in segs).strip()
        num = re.sub(r'[.\s]', '', (re.search(r'por ([\d.\s]+)', h) or [None, ''])[1] if re.search(r'por ([\d.\s]+)', h) else '')
        esper = pal(x); hn = unicodedata.normalize('NFD', h.lower()); hn = ''.join(c for c in hn if unicodedata.category(c) != 'Mn')
        en = unicodedata.normalize('NFD', esper); en = ''.join(c for c in en if unicodedata.category(c) != 'Mn')
        ok = (num == str(x)) or (en in hn) or (x == 1 and 'un punto' in hn)
        mal += not ok
        print('%s %9d  %.2fs | %s' % ('OK ' if ok else 'MAL', x, len(a) / 48000, h), flush=True)
        if x in (12000, 31001, 51001):
            with wave.open('/workspace/handoff/ac137_shots/voz_%d.wav' % x, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000); w.writeframes((np.clip(a, -1, 1) * 32767).astype('<i2').tobytes())
    print('fallos', mal, 'de', len(vals))
