#!/usr/bin/env python3
"""Construye AhoraCaigo-1.60.apk = APK 1.59 (etiqueta ya corregida) + overlay ov/ (app.js, version.json) con manifest vc 67 / "1.60"
y etiqueta «Ahora Caigo 1.60». Firma con ikeriano-2026 via env (KSP/KYP, nunca se imprimen). Uso: build_apk160.py BASE.apk OUT.apk"""
import zipfile, struct, sys, os, subprocess, hashlib
BASE, out = sys.argv[1:3]; OV = '/workspace/ac_159/ov'
BT = os.path.expanduser('~/android-sdk/build-tools/34.0.0')
KS = '/cursor/stores/store-b6a3ca2b-7c3b-4225-8f28-1a7e8cfa3201/keystores'
REPL = {'assets/www/js/app.js': OV + '/js/app.js', 'assets/www/version.json': OV + '/version.json'}
def props():
    d = {}
    for l in open(KS + '/keystore.properties'):
        if '=' in l: k, v = l.strip().split('=', 1); d[k] = v
    return d
def patch_manifest(d):
    d = bytearray(d)
    sc, _, fl, sst, _ = struct.unpack_from('<IIIII', d, 16); off = 36
    offs = struct.unpack_from('<%dI' % sc, d, off); base = 8 + sst; names = []
    for o in offs:
        p = base + o; l = struct.unpack_from('<H', d, p)[0]; names.append(d[p + 2:p + 2 + l * 2].decode('utf-16-le'))
    iv = names.index('versionCode')
    old = '1.59'.encode('utf-16-le'); assert d.count(old) == 1
    i = d.index(old); d[i:i + 8] = '1.60'.encode('utf-16-le')
    n = 0
    for p in range(0, len(d) - 20, 4):
        ns, nm, raw, sz, r0, ty, dat = struct.unpack_from('<iiIHBBI', d, p)
        if nm == iv and sz == 8 and ty == 0x10 and dat == 66: struct.pack_into('<I', d, p + 16, 67); n += 1
    assert n == 1, n
    return bytes(d)
def patch_label(d):
    old = b'\x10\x10Ahora Caigo 1.59\x00'; assert d.count(old) == 1, d.count(old)
    return d.replace(old, b'\x10\x10Ahora Caigo 1.60\x00')
zin = zipfile.ZipFile(BASE); tmp = out + '.tmp'; n_rep = 0
first = ['AndroidManifest.xml', 'resources.arsc', 'classes.dex']
items = zin.infolist(); order = [i for n in first for i in items if i.filename == n] + [i for i in items if i.filename not in first]
with zipfile.ZipFile(tmp, 'w') as zo:
    for it in order:
        nm = it.filename
        if nm.startswith('META-INF/'): continue
        if nm in REPL: data = open(REPL[nm], 'rb').read(); n_rep += 1
        else: data = zin.read(nm)
        if nm == 'AndroidManifest.xml': data = patch_manifest(data)
        if nm == 'resources.arsc': data = patch_label(data)
        zi = zipfile.ZipInfo(nm, date_time=it.date_time); zi.external_attr = it.external_attr
        zi.compress_type = zipfile.ZIP_STORED if nm == 'resources.arsc' else it.compress_type
        zo.writestr(zi, data)
assert n_rep == len(REPL), n_rep
al = out + '.al'
subprocess.check_call([BT + '/zipalign', '-p', '-f', '4', tmp, al]); os.remove(tmp)
pr = props(); env = dict(os.environ, KSP=pr['storePassword'], KYP=pr['keyPassword'])
subprocess.check_call([BT + '/apksigner', 'sign', '--ks', KS + '/ikeriano-2026.jks', '--ks-key-alias', pr['keyAlias'], '--ks-pass', 'env:KSP', '--key-pass', 'env:KYP', '--out', out, al], env=env)
os.remove(al)
if os.path.exists(out + '.idsig'): os.remove(out + '.idsig')
print(subprocess.run([BT + '/apksigner', 'verify', '--print-certs', '--min-sdk-version', '21', '-v', out], capture_output=True, text=True).stdout)
h = hashlib.sha256()
with open(out, 'rb') as f:
    for c in iter(lambda: f.read(1 << 22), b''): h.update(c)
print('sha256', h.hexdigest(), 'size', os.path.getsize(out))
