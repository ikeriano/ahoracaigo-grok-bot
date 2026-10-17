#!/usr/bin/env python3
"""Ahora Caigo 1.37 · voz de Adrián Vega para «Y ahora, jugamos por X puntos, en el Duelo Final».
Misma configuración que la 1.35 (gen_voces130.py 'adr'): Piper es_ES-davefx-medium, length_scale 0.985,
noise_scale 0.667, noise_w 0.8, volume 1.0. Cada trozo se sintetiza DENTRO de la frase completa
(«Y ahora, jugamos por <trozo> puntos, en el Duelo Final.») y se recorta con las alineaciones de fonemas
de Piper, para que la entonación y las uniones sean las de una frase dicha de corrido.
Salida (carpeta nueva df/voz; las voces existentes no se tocan):
  pre.ogg  «Y ahora, jugamos por»       suf.ogg  «puntos, en el Duelo Final.»   p1.ogg  frase entera para 1 punto
  n/<k>.ogg  1..999 («doce», «treinta y uno»)
  m/<k>.ogg  1..999 + mil («mil», «treinta y un mil»)
  M/<k>.ogg  1..999 + millones («un millón», «doce millones»)
Uso: python3 gen_df_voz.py <df> [procesos]"""
import os, sys, subprocess, wave, numpy as np
from multiprocessing import Pool
OUT = os.path.join(sys.argv[1], 'voz'); NP = int(sys.argv[2]) if len(sys.argv) > 2 else 6
U = 'cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve'.split()
DEC = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
CEN = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos']
def m100(n): return U[n] if n < 30 else DEC[n // 10] + (' y ' + U[n % 10] if n % 10 else '')
def m1000(n):
    if n == 100: return 'cien'
    c, r = divmod(n, 100); return (CEN[c] + (' ' if r else '') if c else '') + (m100(r) if r else '')
def apoc(s):
    if s.endswith('veintiuno'): return s[:-9] + 'veintiún'
    return s[:-3] + 'un' if s.endswith('uno') else s
def trozo(tipo, k):
    if tipo == 'n': return m1000(k)
    if tipo == 'm': return 'mil' if k == 1 else apoc(m1000(k)) + ' mil'
    return 'un millón' if k == 1 else apoc(m1000(k)) + ' millones'
PRE, SUF = 'Y ahora, jugamos por ', ' puntos, en el Duelo Final.'
V = None
def voz():
    global V
    if V is None:
        from piper import PiperVoice
        V = PiperVoice.load('/workspace/tts/es_ES-davefx-medium.onnx', include_alignments=True)
    return V
def sintetiza(texto):
    from piper import SynthesisConfig
    cfg = SynthesisConfig(length_scale=0.985, noise_scale=0.667, noise_w_scale=0.8, volume=1.0)
    c = list(voz().synthesize(texto, syn_config=cfg, include_alignments=True))
    assert len(c) == 1, texto
    c = c[0]; al = c.phoneme_alignments; a = c.audio_float_array
    assert al, texto
    tot = sum(x.num_samples for x in al); f = len(a) / tot   # por si acaso el audio y la alineación difieren
    pos, cur = [], 0
    for x in al: pos.append((x.phoneme, int(cur * f), int((cur + x.num_samples) * f))); cur += x.num_samples
    return a, pos, c.sample_rate
def cortes(pos):
    esp = [(s + e) // 2 for (ph, s, e) in pos if ph == ' ']
    return esp[3], esp[-5]          # tras «Y ahora, jugamos por» · antes de «puntos, en el Duelo Final.»
def guarda(a, sr, ruta):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    w16 = (np.clip(a, -1, 1) * 32767).astype('<i2'); tmp = ruta + '.wav'
    with wave.open(tmp, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(w16.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-af', 'volume=1.0', '-ac', '1', '-c:a', 'libopus', '-b:a', '40k', '-application', 'voip', ruta], check=True)
    os.remove(tmp)
def tarea(t):
    tipo, k = t; ruta = f'{OUT}/{tipo}/{k}.ogg'
    if os.path.exists(ruta): return
    a, pos, sr = sintetiza(PRE + trozo(tipo, k) + SUF); i, j = cortes(pos)
    guarda(a[i:j], sr, ruta)
if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    a, pos, sr = sintetiza(PRE + 'doce mil' + SUF); i, j = cortes(pos)
    guarda(a[:i], sr, OUT + '/pre.ogg'); guarda(a[j:], sr, OUT + '/suf.ogg')
    a, pos, sr = sintetiza('Y ahora, jugamos por un punto, en el Duelo Final.'); guarda(a, sr, OUT + '/p1.ogg')
    trabajos = [(t, k) for t in 'nmM' for k in range(1, 1000)]
    with Pool(NP) as p:
        for n, _ in enumerate(p.imap_unordered(tarea, trabajos, chunksize=20)):
            if n % 300 == 0: print(n, flush=True)
    print('ok', len(trabajos))
