#!/bin/sh
# v1.40 · APK aparte (com.ikeriano.ahoracaigo.gb, versionCode 47, versionName 1.40) a partir del APK 1.39 decodificado con apktool.
# Uso: sh apk_140.sh <carpeta_apktool_decodificada> <www_1.40> <carpeta_keystore> <salida.apk>
# La carpeta del keystore tiene keystore.properties (storeFile, storePassword, keyAlias, keyPassword): las contraseñas se leen
# a variables de entorno solo durante la firma; nunca se escriben ni se imprimen. El keystore NO va al repo.
set -e
DEC="$1"; WWW="$2"; KS="$3"; OUT="$4"; BT="${BT:-$HOME/android-sdk/build-tools/34.0.0}"; APKTOOL="${APKTOOL:-java -jar $(dirname "$DEC")/apktool.jar}"
T="$(dirname "$OUT")/tmp_apk140"; mkdir -p "$T"
rm -rf "$DEC/assets/www"; cp -a "$WWW" "$DEC/assets/www"
python3 - "$DEC/apktool.yml" <<'P'
import sys, re
p = sys.argv[1]; s = open(p).read()
s = re.sub(r'renameManifestPackage: .*', 'renameManifestPackage: com.ikeriano.ahoracaigo.gb', s)
s = re.sub(r'versionCode: .*', 'versionCode: 47', s); s = re.sub(r'versionName: .*', 'versionName: 1.40', s)
open(p, 'w').write(s)
P
$APKTOOL b "$DEC" -o "$T/sin_firmar.apk"
"$BT/zipalign" -p -f 4 "$T/sin_firmar.apk" "$T/alineado.apk"
prop() { sed -n "s/^$1=//p" "$KS/keystore.properties" | tr -d '\r'; }
KS_FILE="$KS/$(prop storeFile)"; KS_ALIAS="$(prop keyAlias)"
KSP="$(prop storePassword)" KYP="$(prop keyPassword)" "$BT/apksigner" sign --ks "$KS_FILE" --ks-key-alias "$KS_ALIAS" --ks-pass env:KSP --key-pass env:KYP --out "$OUT" "$T/alineado.apk"
"$BT/apksigner" verify --print-certs "$OUT"
rm -f "$T/sin_firmar.apk" "$T/alineado.apk"
