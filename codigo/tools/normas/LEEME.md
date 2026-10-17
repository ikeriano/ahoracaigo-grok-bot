# ¡Ahora caigo! 1.36 · Normas sorpresa

Es la 1.35 con una opción nueva: **Opciones › 🎲 Normas sorpresa** (No por defecto). Con «Sí», Adrián Vega anuncia de 2 a 4 normas al empezar el Programa completo (y los especiales) o una prueba del Entrenamiento. Nada más cambia.

- `codigo/ns/ns.js`: el motor común de las normas sorpresa (el mismo que en El Cazador y Millonario).
- `codigo/ns/cat.js`: las 51 normas de ¡Ahora caigo!, en 9 categorías (ver `CATALOGO.md`).
- `codigo/ns/ac.js`: el adaptador que aplica las normas al juego.
- `codigo/ns/voz/`: 68 clips nuevos con la voz de Adrián (Piper es_ES-davefx-medium, length_scale 0.985, igual que gen_voces130.py). Las voces de `voz/` no se tocan.
- `codigo/js/app.js` es el de la 1.35 con inyecciones mínimas. Todas comprueban `self.NSAC` y, con la opción en «No», devuelven lo de siempre. Se generan con `parche_ns.py`.
- `build_apk.py`: rehace el APK a partir del de la 1.35. Cambia solo esos archivos de www y el manifest (versionCode 43, versionName 1.36).
- La firma usa una clave nueva solo para ¡Ahora caigo!, así que hay que desinstalar la app antigua antes de instalar esta.
