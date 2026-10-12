# ¡Ahora caigo! El juego 3D · versión COMPLETA (privada)
Juego creado por Iker. Incluye las músicas, sonidos e imágenes del APK, el logo, la cabecera en vídeo, los audios
de la cabecera 3D y de las promos (extraídos de los vídeos) y el minijuego clásico. **No hacer público** (derechos).
- Jugar: abrir `index.html` (doble clic) o servir la carpeta. También es la fuente del APK Android.
- `codigo/`: código fuente (src/) y herramientas de construcción (tools/build.sh, tools/empaquetar.sh).
- La web pública (sin audios con derechos) está en ikeriano/ahoracaigo-web.

## ¡Ahora caigo! 1.15 (versionCode 21)
- **Cámara libre** (menú principal y Opciones): vuelo libre por el plató con joystick táctil, arrastrar para mirar, pellizco para zoom, botones subir/bajar; WASD/QE, ratón y rueda en PC. Velocidad y FOV, ocultar interfaz, luces/LEDs/logo/público/música, puntos clave con recorrido suave de grúa y GRABAR (vídeo con audio): guardar en el dispositivo, usar como vídeo de la cabecera 3D o guardar para el Creador de promos. Incluye **panel de control de luces** (modo, Pan, Tilt, Velocidad, Color).
- **Creador de promos**: fondo (vídeo propio, toma de Cámara libre, Cabecera 1/2/3 y vídeos propios, o toma del plató 3D), título, líneas, día y hora, logo (actual, título propio o especial), música del juego, transición (fundido, barrido, zoom) y **voz en off con Piper dentro de la app, sin conexión** (sherpa-onnx WebAssembly, es_ES-davefx-medium; si el móvil no puede, se juntan palabras pregrabadas del presentador). Sin voz del navegador. Lista con ver/editar/borrar/exportar a vídeo. Las promos propias salen en PROMOS, en las pausas de publicidad y al azar (menú en reposo y entre secciones).
- **Mis hashtags**: generales y por especial; rotan en una esquina (posición elegible, se puede apagar) durante el Programa completo, en las promos y en una pantalla LED del plató.
- **Guardar logo (PNG transparente)**: 2048 px del logo actual, original, con título propio y de cada especial; o todos a la vez. En Android se guardan en Imágenes (MediaStore); en la web, ZIP.
- **Coreografía de luces como el programa**: cabezas móviles en arco detrás de la grada alta y aro sobre el centro. «Energía» (entrada, cambios de música, caídas, grandes momentos): haces blancos estrechos con barridos rápidos cruzados. «Charla»: se paran al instante y se abren en baño azul/morado con luz cálida al presentador. Modos «Cabecera/Fiesta» (haces anchos neón cruzando colores, haces blancos desde el suelo) y «Presentación» (oscuro, paredes rayadas rosa/azul y un haz morado). Dos aros magenta en el suelo, bordes LED de la escalera, paredes curvas con líneas y puertas LED que se abren al empezar el programa.
- **Voces revisadas** (WER con Whisper): Lola (directora) y Toni (regidor) regrabadas con es_ES-sharvard (±2 st, -16 LUFS).
- Sin cambios en la caída del concursante central (el programa sigue con un bot).


## Novedades v1.13
- **Presentador sorpresa:** al empezar el Programa completo sale un copresentador elegido al azar entre personajes que ya existían en el juego: Toni (regidor), Lola (directora), Rober (sonido), Nuria (maquillaje), Luis (catering), Carmen y Manolo (público) y «El jefe». Acompaña a Adrián Vega durante todo el programa: presentación, cada duelo, cada caída, la moneda, la decisión, el juego final y la despedida. Se activa o desactiva en Opciones › «Presentador sorpresa». El código está en `codigo/src/copro.js`.
- **Más escenas**, en `codigo/src/extras_datos2.js`: Cámara oculta pasa de 6 a 18, Tomas falsas de 9 a 27 y Fuera de cámaras de 6 a 18.
- **Promo «Cabecera de estreno»**, en `codigo/src/promo_cabecera.js`: una cabecera nueva con animación propia, hecha solo con piezas del juego (plató, trampillas, huellas, logo, rótulos y cortinilla Show Time).
  - Hueco de audio: `cabecera/cabecera_nueva.mp3` (o «Cargar músicas» con ese nombre).
  - Si no existe, usa `cabecera/cabecera3d.mp3`; si tampoco existe, la música sintetizada de las promos.
- Las frases nuevas no tienen voz pregrabada: se ven en un bocadillo con el nombre del personaje. Se pueden generar con `tools/gen_voces_showtime.py`.
- Para que `tools/build.sh` dé un `js/app.js` **idéntico byte a byte** hacen falta estas versiones: `esbuild@0.28.2`, `three@0.170.0` y `fflate@0.8.3`. Por ejemplo: `npm i --no-save three@0.170.0 fflate@0.8.3`.
- Pruebas: `node tools/test_v113.mjs URL salida` y `node tools/test_cabnueva.mjs URL salida`.
