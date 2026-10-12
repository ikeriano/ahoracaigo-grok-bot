# ¡Ahora Caigo! online (v1.12)

Esta carpeta tiene dos cosas:

| Carpeta | Qué es |
|---|---|
| `web/` | El juego 3D en solitario v1.12, **sin cambios** (es el `assets/www` del APK). Se abre en `web/index.html`. |
| `multiplayer/` | Cliente multijugador para el móvil (HTML/CSS/JS, sin librerías). |
| `server/` | Servidor Node.js + WebSocket (`ws`). Lleva el estado de la partida (es *autoritativo*) y además sirve todas las páginas. |
| `tools/extraer_preguntas.py` | Vuelve a generar `server/preguntas.json` a partir de `web/js/app.js`. |
| `index.html` | Portada: «Jugar en solitario» o «Multijugador». |

## Cómo se juega en multijugador
1. Uno pulsa **Crear sala** y le sale un **código de 4 letras** (y un enlace `?sala=CODIGO`). Ese jugador es el **anfitrión** y empieza en la **trampilla central**.
2. Los demás (de 1 a 10) abren la web en su móvil, ponen su nombre y el código, y pulsan **Unirme**.
3. El anfitrión pulsa **¡Empezar!**.
4. **Elige huella:** el concursante central elige a un oponente.
5. **Duelo**, con las reglas del programa:
   - Juegan por turnos y **empieza el oponente**.
   - Cada uno tiene un **reloj de 30 s** que solo corre en su turno.
   - Hay que escribir **las letras que faltan**. Si fallas, puedes seguir probando mientras te quede tiempo. Al acertar, el turno pasa al otro con otra pregunta.
   - **PASAR:** cada jugador tiene **2 comodines**. Con un comodín, la **misma pregunta** pasa al rival. Sin comodines, te sale otra pregunta pero **tu reloj sigue corriendo**.
   - Al que se le acaba el tiempo **cae por la trampilla**. Si cae el central, el ganador pasa a ocupar la trampilla central.
6. Se repite hasta que solo queda uno en pie, que es el ganador. El anfitrión puede pedir **Revancha**.

Las preguntas salen de los bancos de `app.js` (312 en total):
- Las del formato `Pregunta|PA[L]A[B]RA`: el banco extra y los especiales de Halloween, Navidad, etc.
- Las 80 preguntas con imagen del proyecto Scratch. De esas imágenes solo se enseña la parte de arriba, porque en la de abajo se ve la respuesta.

Los sonidos son los originales de `web/sb3/snd`.

## Ejecutar en local
Hace falta Node.js 18 o superior.
```bash
cd online/server
npm install
npm start            # http://localhost:8080/
```
- Para jugar desde los móviles de casa, abre `http://IP-DE-TU-PC:8080/` con todos en la misma wifi.
- Variables opcionales: `PORT`, `TIEMPO_MS` (reloj de cada jugador, por defecto 30000) y `PAUSA_MS` (pausa tras una caída).
- Pruebas automáticas: `npm test`. Simulan 3 móviles jugando una partida completa con relojes cortos.

## Publicar el servidor gratis
El servidor sirve también la web, así que basta con desplegar **solo esto**. La raíz del servicio es la carpeta `online/server`, pero necesita las carpetas hermanas `web/` y `multiplayer/`, así que hay que desplegar el repo entero.

**Render (recomendado, plan gratis):**
1. En render.com, crea un *New → Web Service* y conecta este repositorio. Al ser privado, tienes que dar permiso a Render en GitHub.
2. Configúralo así:
   - Branch: `online` (o `main` después de fusionar)
   - Root Directory: `online/server`
   - Build: `npm install`
   - Start: `npm start`
   - Instance: Free
3. Render pone `PORT` solo y admite WebSocket. La URL será `https://<nombre>.onrender.com/`.
4. En el plan gratis el servidor **se duerme** tras unos 15 minutos sin uso. La primera visita tarda unos 30–60 s en despertarlo.

**Fly.io:** `fly launch` dentro de `online/server`, con un Dockerfile `node:20-alpine` que copie la carpeta `online/` entera. Ahora pide tarjeta, aunque el uso pequeño sale gratis o casi.

**Glitch:** ya no ofrece alojamiento gratis de proyectos desde 2025, así que no se recomienda.

**Nota sobre GitHub Pages:** este repositorio es **privado**. GitHub Pages **no publica repos privados en el plan gratis** (hace falta Pro/Team). Además, Pages solo sirve archivos estáticos: valdría para el juego en solitario (`web/`), pero **no para el multijugador**, que necesita el servidor Node. Si sirves `multiplayer/` desde otro sitio, define antes de `mp.js` la línea `window.AC_SERVIDOR = 'wss://tu-servidor/ws'`.

## Límites conocidos
- Las salas viven en la memoria del servidor: si se reinicia, se pierden las partidas. Tampoco se puede volver a entrar a una partida empezada; quien se desconecta durante su duelo cae por la trampilla.
- No están implementados en el multijugador la moneda, los puntos y el bote, el juego final ni las pruebas especiales (gallina, entre tres…). Solo hay duelos con eliminación. El juego en solitario los tiene todos.
- Contiene audios e imágenes originales con derechos (por eso el repo es privado). No lo publiques en abierto.
