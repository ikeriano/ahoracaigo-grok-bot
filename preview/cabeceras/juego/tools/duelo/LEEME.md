# ¡Ahora caigo! 1.37 · Cabecera 3D del Duelo Final (basada en la 1.36-normas)

- `df/df.js`: cabecera del Duelo Final en Three.js (low-poly, se pinta con el motor del juego vía `eng.override`), con reloj real
  para ir a la par del audio. Audio: el de la cabecera original (`df/duelo_final.ogg`, reserva `df/duelo_final.m4a`).
- Antes de la cabecera, Adrián Vega dice «Y ahora, jugamos por X puntos, en el Duelo Final» con X = los puntos acumulados en los duelos.
  La frase se cose con trozos pregenerados con Piper (`df/voz`, `tools/gen_df_voz.py`), cada uno sintetizado dentro de la frase completa
  y recortado con las alineaciones de fonemas: cubre de 1 a 999.999.999 (pre + millones + miles + unidades + suf; «1 punto» va entera).
  Reserva: Piper dentro de la app (`piper/piper-worker.js`) y, si tampoco, la voz de reserva del juego.
- `tools/parche_df.py`: inyecciones mínimas en `js/app.js` (juego final, precarga tras la última moneda, entrenamiento del juego final,
  opción «🎬 Cabecera del Duelo Final» Sí/No en Más opciones del programa, por defecto Sí) e `index.html`.
- `tools/asr_df.py`: comprueba con Whisper la frase cosida para varios valores.
- `tools/build_apk.py`: APK 1.37 (versionCode 44) a partir del APK 1.35 + www 1.37.
- `canal/canal.js`: rótulos de emisión como en la tele (Sí por defecto): #AhoraCaigo arriba a la izquierda, autopromoción arriba a la derecha
  (logo de ¡Ahora caigo! + «Muy pronto estreno · Gran regreso · En <cadena>») y logo de cadena abajo a la derecha (Actual por defecto = sin logo;
  Cuatro, Antena 3 HD, Antena 3 blanco/relieve, Telecinco blanco/color, La 2), con las imágenes de Iker tal cual (solo escaladas).
