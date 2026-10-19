#!/bin/sh
# v1.41 · monta el www del APK: parte del www del APK 1.40 y pone encima lo nuevo de la 1.41
# (app.js con «Los 2 lados de la moneda suman» y los índices de voz, voces arregladas de Adrián, Luis, Marga, Javi y Manolo).
# Uso: sh montar_www141.sh <www_1.40> <www_destino> <carpeta_out_redub_141>
set -e
SRC="$1"; DST="$2"; OUT="$3"; R="$(cd "$(dirname "$0")/../../.." && pwd)"
rm -rf "$DST"; cp -a "$SRC" "$DST"
cp "$R/codigo/js/app.js" "$DST/js/app.js"; cp "$R/version.json" "$DST/version.json"
for s in "" st/ q/; do cp "$R/voz/${s}index.json" "$DST/voz/${s}index.json"; done
cp "$OUT"/voz/*.mp3 "$DST/voz/"; cp "$OUT"/voz/st/*.mp3 "$DST/voz/st/"; cp "$OUT"/voz/q/*.mp3 "$DST/voz/q/"; cp "$OUT"/ns/voz/*.mp3 "$DST/ns/voz/"
echo "www 1.41 listo en $DST"
