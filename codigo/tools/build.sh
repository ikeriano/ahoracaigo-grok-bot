#!/bin/sh
# Construye js/app.js (IIFE: funciona en GitHub Pages y abriendo index.html con doble clic)
set -e
cd "$(dirname "$0")/.."
mkdir -p tmp
node -e "
const fs=require('fs');
const m=JSON.parse(fs.readFileSync('tools/manifest.json'));
const p=JSON.parse(fs.readFileSync('voz/index.json')), q=JSON.parse(fs.readFileSync('voz/q/index.json'));
fs.writeFileSync('tmp/gen.js','const __MANIFEST='+JSON.stringify(m)+';\nconst __VOZ_P='+JSON.stringify(p)+';\nconst __VOZ_Q='+JSON.stringify(q)+';\n');"
# los import tienen que ir arriba del todo
grep '^import ' src/pre.js > tmp/all.js
cat tmp/gen.js >> tmp/all.js
grep -v '^import ' src/pre.js >> tmp/all.js
cat src/app.js src/preguntas_extra.js src/post.js src/cabecera3d.js src/promos.js >> tmp/all.js
node_modules/.bin/esbuild tmp/all.js --bundle --minify --charset=utf8 --format=iife --outfile=js/app.js --log-level=warning
