#!/usr/bin/env python3
"""Construye AhoraCaigo-1.59.apk = APK 1.58 + overlay ov/ (assets/www) con manifest 66/"1.59".
Firma con keystore via env KSP/KYP (nunca se imprimen). Uso: build_apk.py OUT.apk"""
import zipfile, struct, sys, os, subprocess, hashlib, shutil
BASE='/workspace/ac_lomejor/apk158/AhoraCaigo-1.58.apk'; OV='/workspace/ac_159/ov'
BT=os.path.expanduser('~/android-sdk/build-tools/34.0.0')
KS='/cursor/stores/store-b6a3ca2b-7c3b-4225-8f28-1a7e8cfa3201/keystores'
out=sys.argv[1]; tmp=out+'.tmp'
def props():
    d={}
    for l in open(KS+'/keystore.properties'):
        if '=' in l: k,v=l.strip().split('=',1); d[k]=v
    return d
def patch_manifest(d):
    d=bytearray(d)
    sc,_,fl,sst,_=struct.unpack_from('<IIIII',d,16); off=36
    offs=struct.unpack_from('<%dI'%sc,d,off); base=8+sst
    names=[]
    for o in offs:
        p=base+o; l=struct.unpack_from('<H',d,p)[0]; names.append(d[p+2:p+2+l*2].decode('utf-16-le'))
    iv,inm=names.index('versionCode'),names.index('versionName')
    # versionName string 1.58 -> 1.59 (same length)
    old='1.58'.encode('utf-16-le'); assert d.count(old)==1
    i=d.index(old); d[i:i+8]='1.59'.encode('utf-16-le')
    # attribute versionCode: name idx iv, int type 0x10, data 65
    n=0
    for p in range(0,len(d)-20,4):
        ns,nm,raw,sz,r0,ty,dat=struct.unpack_from('<iiIHBBI',d,p)
        if nm==iv and sz==8 and ty==0x10 and dat==65:
            struct.pack_into('<I',d,p+16,66); n+=1
    assert n==1, n
    return bytes(d)
def patch_pkg(d):
    # applicationId .v2 -> .gb (misma longitud): app aparte con la firma nueva ikeriano-2026
    a='com.ikeriano.ahoracaigo.v2'.encode('utf-16-le'); b='com.ikeriano.ahoracaigo.gb'.encode('utf-16-le')
    assert d.count(a)==1; return d.replace(a,b)
zin=zipfile.ZipFile(BASE)
ov={}
for r,_,fs in os.walk(OV):
    for f in fs:
        p=os.path.join(r,f); ov['assets/www/'+os.path.relpath(p,OV)]=p
done=set(); n_rep=n_new=0
with zipfile.ZipFile(tmp,'w') as zo:
    for it in zin.infolist():
        nm=it.filename
        if nm.startswith('META-INF/') and nm.upper().endswith(('.SF','.RSA','.DSA','.EC','MANIFEST.MF')): continue
        if nm in ov:
            data=open(ov[nm],'rb').read(); done.add(nm); n_rep+=1
        elif nm=='AndroidManifest.xml': data=patch_pkg(patch_manifest(zin.read(nm)))
        elif nm=='resources.arsc': data=patch_pkg(zin.read(nm))
        else: data=zin.read(nm)
        zi=zipfile.ZipInfo(nm,date_time=it.date_time); zi.compress_type=it.compress_type if nm not in ('resources.arsc',) else zipfile.ZIP_STORED
        zi.external_attr=it.external_attr
        if nm.endswith(('.mp3','.mp4','.png','.jpg','.webm','.ogg','.glb')): zi.compress_type=zipfile.ZIP_STORED
        zo.writestr(zi,data)
    for nm,p in sorted(ov.items()):
        if nm in done: continue
        zi=zipfile.ZipInfo(nm,date_time=(2026,10,26,12,0,0))
        zi.compress_type=zipfile.ZIP_STORED if nm.endswith(('.mp3','.mp4','.png','.jpg','.webm')) else zipfile.ZIP_DEFLATED
        zo.writestr(zi,open(p,'rb').read()); n_new+=1
print('reemplazados',n_rep,'nuevos',n_new)
al=out+'.al'
subprocess.check_call([BT+'/zipalign','-p','-f','4',tmp,al]); os.remove(tmp)
pr=props(); env=dict(os.environ,KSP=pr['storePassword'],KYP=pr['keyPassword'])
subprocess.check_call([BT+'/apksigner','sign','--ks',KS+'/ikeriano-2026.jks','--ks-key-alias',pr['keyAlias'],'--ks-pass','env:KSP','--key-pass','env:KYP','--out',out,al],env=env)
os.remove(al)
print(subprocess.run([BT+'/apksigner','verify','--print-certs',out],capture_output=True,text=True).stdout)
print(subprocess.run([BT+'/apksigner','verify','--verbose',out],capture_output=True,text=True).stdout)
h=hashlib.sha256()
with open(out,'rb') as f:
    for c in iter(lambda:f.read(1<<22),b''): h.update(c)
print('sha256',h.hexdigest(),'size',os.path.getsize(out))
