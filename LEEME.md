# ¡Ahora caigo! El juego 3D · versión COMPLETA (privada)
Juego creado por Iker. Incluye las músicas, sonidos e imágenes del APK, el logo, la cabecera en vídeo, los audios
de la cabecera 3D y de las promos (extraídos de los vídeos) y el minijuego clásico. **No hacer público** (derechos).
- Jugar: abrir `index.html` (doble clic) o servir la carpeta. También es la fuente del APK Android.
- `codigo/`: código fuente (src/) y herramientas de construcción (tools/build.sh, tools/empaquetar.sh).
- La web pública (sin audios con derechos) está en ikeriano/ahoracaigo-web.

## Novedades v1.13
- **Presentador sorpresa:** al empezar el Programa completo sale un copresentador elegido al azar entre personajes que ya existían en el juego: Toni (regidor), Lola (directora), Rober (sonido), Nuria (maquillaje), Luis (catering), Carmen y Manolo (público) y «El jefe». Acompaña a Adrián Vega durante todo el programa: presentación, cada duelo, cada caída, la moneda, la decisión, el juego final y la despedida. Se activa o desactiva en Opciones › «Presentador sorpresa». El código está en `codigo/src/copro.js`.
- **Más escenas**, en `codigo/src/extras_datos2.js`: Cámara oculta pasa de 6 a 18, Tomas falsas de 9 a 27 y Fuera de cámaras de 6 a 18.
- **Promo «Cabecera de estreno»**, en `codigo/src/promo_cabecera.js`: una cabecera nueva con animación propia, hecha solo con piezas del juego (plató, trampillas, huellas, logo, rótulos y cortinilla Show Time).
  - Hueco de audio: `cabecera/cabecera_nueva.mp3` (o «Cargar músicas» con ese nombre).
  - Si no existe, usa `cabecera/cabecera3d.mp3`; si tampoco existe, la música sintetizada de las promos.
- Las frases nuevas no tienen voz pregrabada: se ven en un bocadillo con el nombre del personaje. Se pueden generar con `tools/gen_voces_showtime.py`.
- Para que `tools/build.sh` dé un `js/app.js` **idéntico byte a byte** hacen falta estas versiones: `esbuild@0.28.2`, `three@0.170.0` y `fflate@0.8.3`. Por ejemplo: `npm i --no-save three@0.170.0 fflate@0.8.3`.
- Pruebas: `node tools/test_v113.mjs URL salida` y `node tools/test_cabnueva.mjs URL salida`.
