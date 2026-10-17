# Construye ¡Ahora caigo! 1.38 a partir del APK 1.35: mismo contenido, salvo los archivos de www cambiados/añadidos
# y el AndroidManifest binario con versionCode 45 / versionName 1.38 (parche en sitio, nada más cambia).
# Uso: python3 build_apk.py <apk_1.35> <www_1.38> <salida_sin_firmar.apk>
import sys, zipfile, struct, os
src, www, out = sys.argv[1:4]
VC_ID, VN_ID = 0x0101021b, 0x0101021c
def patch_manifest(b):
    b = bytearray(b)
    assert struct.unpack_from('<HHI', b, 0)[0] == 0x0003
    off = struct.unpack_from('<H', b, 2)[0]; strings = None; resmap = []; vc = vn = None
    while off < len(b):
        typ, hsz, sz = struct.unpack_from('<HHI', b, off)
        if typ == 0x0001:
            cnt, scnt, flags, sstart, _ = struct.unpack_from('<IIIII', b, off + 8)
            utf8 = bool(flags & 0x100); offs = struct.unpack_from('<%dI' % cnt, b, off + hsz)
            strings = (off, sstart, offs, utf8)
        elif typ == 0x0180:
            resmap = list(struct.unpack_from('<%dI' % ((sz - hsz) // 4), b, off + hsz))
        elif typ == 0x0102:
            name = struct.unpack_from('<I', b, off + 20)[0]
            astart, asize, acnt = struct.unpack_from('<HHH', b, off + 24)
            for k in range(acnt):
                a = off + 16 + astart + k * asize
                an = struct.unpack_from('<I', b, a + 4)[0]; rid = resmap[an] if an < len(resmap) else None
                if rid == VC_ID: vc = a
                if rid == VN_ID: vn = a
            if vc and vn: break
        off += sz
    # versionCode: tipo entero (0x10)
    assert b[vc + 15] in (0x10, 0x11) and struct.unpack_from('<I', b, vc + 16)[0] == 42
    struct.pack_into('<I', b, vc + 16, 45)
    # versionName: cadena "1.35" del string pool -> "1.36" (misma longitud)
    idx = struct.unpack_from('<I', b, vn + 8)[0]; po, sstart, offs, utf8 = strings
    p = po + sstart + offs[idx]
    if utf8:
        assert b[p] == 4 and b[p + 1] == 4 and bytes(b[p + 2:p + 6]) == b'1.35'; b[p + 2:p + 6] = b'1.38'
    else:
        assert struct.unpack_from('<H', b, p)[0] == 4 and bytes(b[p + 2:p + 10]) == '1.35'.encode('utf-16le'); b[p + 2:p + 10] = '1.38'.encode('utf-16le')
    return bytes(b)
zi = zipfile.ZipFile(src); names = set(zi.namelist())
# archivos de www que cambian o se añaden
nuevos = {}
for raiz, _, fs in os.walk(www):
    for f in fs:
        full = os.path.join(raiz, f); rel = 'assets/www/' + os.path.relpath(full, www).replace(os.sep, '/')
        data = open(full, 'rb').read()
        if rel not in names: nuevos[rel] = data
        elif zi.read(rel) != data: nuevos[rel] = data
print('cambiados/añadidos:', len(nuevos)); [print('  ', k) for k in sorted(nuevos) if '/ns/voz/' not in k and '/df/voz/' not in k]
zo = zipfile.ZipFile(out, 'w')
for info in zi.infolist():
    n = info.filename
    if n.startswith('META-INF/') and n.upper().endswith(('.SF', '.RSA', '.DSA', '.EC', 'MANIFEST.MF')): continue
    data = zi.read(n)
    if n == 'AndroidManifest.xml': data = patch_manifest(data)
    elif n in nuevos: data = nuevos.pop(n)
    ni = zipfile.ZipInfo(n, date_time=info.date_time); ni.compress_type = info.compress_type; ni.external_attr = info.external_attr
    zo.writestr(ni, data)
for n in sorted(nuevos):
    ni = zipfile.ZipInfo(n, date_time=(2026, 10, 18, 0, 0, 0)); ni.compress_type = zipfile.ZIP_STORED if n.endswith(('.mp3', '.ogg', '.m4a')) else zipfile.ZIP_DEFLATED
    zo.writestr(ni, nuevos[n])
zo.close(); print('ok', out)
