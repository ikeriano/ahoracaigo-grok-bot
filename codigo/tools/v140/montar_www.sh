#!/bin/sh
# v1.40 · monta el www del APK: parte del www del APK 1.39 (decodificado con apktool) y pone encima lo nuevo de la 1.40.
# Uso: sh montar_www.sh <www_1.39> <www_destino>
set -e
SRC="$1"; DST="$2"; R="$(cd "$(dirname "$0")/../../.." && pwd)"   # raíz del repo
rm -rf "$DST"; cp -a "$SRC" "$DST"
cp "$R/codigo/index.html" "$DST/index.html"
cp "$R/codigo/js/app.js" "$DST/js/app.js"
mkdir -p "$DST/ns/voz"; cp "$R/codigo/ns/ns.js" "$R/codigo/ns/cat.js" "$R/codigo/ns/ac.js" "$DST/ns/"; cp "$R"/codigo/ns/voz/*.mp3 "$DST/ns/voz/"
mkdir -p "$DST/assets/pir140"; cp "$R"/codigo/assets/pir140/*.jpg "$DST/assets/pir140/"   # miniaturas de «🔺 Pirámide»
cp "$R/version.json" "$DST/version.json"
cp "$R/voz/index.json" "$DST/voz/index.json"
# imágenes y voces nuevas (las que no estaban en la 1.39)
for f in "$R"/sb3/img/*.webp; do b=$(basename "$f"); [ -f "$DST/sb3/img/$b" ] || cp "$f" "$DST/sb3/img/$b"; done
for f in "$R"/voz/*.mp3; do b=$(basename "$f"); [ -f "$DST/voz/$b" ] || cp "$f" "$DST/voz/$b"; done
echo "www 1.40 listo en $DST"
