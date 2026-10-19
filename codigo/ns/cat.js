/* Normas sorpresa · catálogo de ¡Ahora caigo! (53 normas en 9 categorías). v1.40: 10 normas por partida (hasta 3 por categoría).
   req: rasgos que el modo tiene que ofrecer (a|b = vale cualquiera). Las normas sin req (fiesta y presentador) valen en todos los modos.
   Las aplica ns/ac.js, enganchado al juego en js/app.js con inyecciones mínimas (todas comprueban window.NSAC). */
NS.catalogo({
  juego: '¡Ahora caigo!', presentador: 'Adrián Vega', min: 10, max: 10, maxCat: 3,
  intro: '¡Atención! Esta noche hay normas sorpresa en Ahora caigo. Estas son las normas de hoy.',
  outro: '¡Ya lo sabes todo! Mucha suerte, y a por el bote.',
  cats: [
    { id: 'reloj', n: 'Reloj', ico: '⏱️' }, { id: 'rival', n: 'Oponentes', ico: '🧑‍🤝‍🧑' }, { id: 'comod', n: 'Comodines', ico: '🃏' },
    { id: 'tramp', n: 'Trampillas', ico: '🕳️' }, { id: 'dinero', n: 'Huellas y dinero', ico: '💰' }, { id: 'final', n: 'Juego final', ico: '🏆' },
    { id: 'gallina', n: 'Palabra gallina', ico: '🐔' }, { id: 'fiesta', n: 'Fiesta', ico: '🎉' }, { id: 'voz', n: 'Presentador', ico: '🎤' }],
  reglas: [
    // ⏱️ Reloj de los duelos (30 s cada uno) y de las preguntas sueltas del Entrenamiento (30 s)
    { id: 'r_mas5', c: 'reloj', n: 'Reloj con extra', d: 'En cada duelo tu reloj empieza con treinta y cinco segundos.', req: ['duelo'], fx: { relojMas: 5 } },
    { id: 'r_mas10', c: 'reloj', n: 'Reloj de lujo', d: 'En cada duelo tu reloj empieza con cuarenta segundos.', req: ['duelo'], fx: { relojMas: 10 } },
    { id: 'r_rival25', c: 'reloj', n: 'Rival con prisa', d: 'El reloj de tu oponente empieza con veinticinco segundos.', req: ['duelo'], fx: { relojRMenos: 5 } },
    { id: 'r_rival20', c: 'reloj', n: 'Rival con mucha prisa', d: 'El reloj de tu oponente empieza con solo veinte segundos.', req: ['duelo'], fx: { relojRMenos: 10 } },
    { id: 'r_largo', c: 'reloj', n: 'Duelos largos', d: 'Los dos relojes del duelo empiezan con cuarenta y cinco segundos.', req: ['duelo'], fx: { relojAmbos: 45 } },
    { id: 'r_reto', c: 'reloj', n: 'Reloj justo', d: '¡Reto! En cada duelo tu reloj empieza con veinticinco segundos.', req: ['duelo'], fx: { relojMas: -5 } },
    { id: 'r_preg45', c: 'reloj', n: 'Preguntas con calma', d: 'Cada pregunta con reloj dura cuarenta y cinco segundos.', req: ['pregunta'], fx: { tiempo: 1.5 } },
    { id: 'r_preg40', c: 'reloj', n: 'Preguntas tranquilas', d: 'Cada pregunta con reloj dura cuarenta segundos.', req: ['pregunta'], fx: { tiempo: 1.3334 } },
    // 🧑‍🤝‍🧑 Oponentes (su nivel: cuánto tardan, cuánto se atascan y cuánto fallan)
    { id: 'o_despistados', c: 'rival', n: 'Oponentes despistados', d: 'Esta noche los oponentes se equivocan y se atascan bastante más.', req: ['rival'], fx: { rivalMas: -0.15 } },
    { id: 'o_novatos', c: 'rival', n: 'Oponentes novatos', d: 'Los oponentes son novatos: van más lentos y fallan más.', req: ['rival'], fx: { rival: 0.7 } },
    { id: 'o_lentos', c: 'rival', n: 'Oponentes con sueño', d: 'Los oponentes piensan un poquito más despacio.', req: ['rival'], fx: { rivalMas: -0.08 } },
    { id: 'o_fuertes', c: 'rival', n: 'Oponentes en forma', d: '¡Reto! Los oponentes vienen muy preparados.', req: ['rival'], fx: { rivalMas: 0.1 } },
    { id: 'o_primero', c: 'rival', n: 'Primer duelo facilito', d: 'Tu primer oponente está muy despistado.', req: ['rival', 'caida'], fx: { primerFacil: 1 } },
    { id: 'o_escalera', c: 'rival', n: 'Escalera de rivales', d: 'Los primeros oponentes son más fáciles y los últimos, un poco más duros.', req: ['rival', 'caida'], fx: { escalera: 1 } },
    // 🃏 Comodines verdes
    { id: 'c_mas1', c: 'comod', n: 'Comodín de regalo', d: 'Empiezas con un comodín verde más.', req: ['comod'], fx: { comodMas: 1 } },
    { id: 'c_mas2', c: 'comod', n: 'Doble regalo', d: 'Empiezas con dos comodines verdes más.', req: ['comod'], fx: { comodMas: 2 } },
    { id: 'c_mas3', c: 'comod', n: 'Lluvia de comodines', d: 'Empiezas con tres comodines verdes más.', req: ['comod'], fx: { comodMas: 3 } },
    { id: 'c_mas5', c: 'comod', n: 'Montaña de comodines', d: 'Empiezas con cinco comodines verdes más.', req: ['comod'], fx: { comodMas: 5 } },
    { id: 'c_salva', c: 'comod', n: 'Fallo gratis', d: 'En las pruebas con respuestas, tu primer fallo no gasta comodín.', req: ['fallos'], fx: { escudo: 1 } },
    { id: 'c_salva2', c: 'comod', n: 'Dos fallos gratis', d: 'En las pruebas con respuestas, tus dos primeros fallos no gastan comodín.', req: ['fallos'], fx: { escudo: 2 } },
    { id: 'c_premio', c: 'comod', n: 'Comodín por trampillas', d: 'Cada dos oponentes que tires, ganas un comodín verde.', req: ['comod', 'caida'], fx: { comodCada: 2 } },
    // 🕳️ Trampillas
    { id: 't_bloqueo', c: 'tramp', n: 'Trampilla bloqueada', d: 'Una vez por programa, si pierdes un duelo, tu trampilla no se abre y tu oponente se retira.', req: ['caida'], fx: { bloqueo: 1 } },
    { id: 't_prorroga', c: 'tramp', n: 'Prórroga', d: 'Una vez por partida, cuando tu reloj llega a cero en un duelo, te regalo diez segundos más.', req: ['duelo'], fx: { prorroga: 10 } },
    { id: 't_prorroga20', c: 'tramp', n: 'Prórroga larga', d: 'Una vez por partida, cuando tu reloj llega a cero en un duelo, te regalo veinte segundos más.', req: ['duelo'], fx: { prorroga: 20 } },
    { id: 't_dorada', c: 'tramp', n: 'Trampilla dorada', d: 'Tu trampilla brilla en dorado durante todo el programa.', req: ['caida'], fx: { dorada: true } },
    // 💰 Huellas y dinero (la moneda de cada trampilla)
    { id: 'd_doble', c: 'dinero', n: 'Monedas dobles', d: 'Todo lo que ganas con la moneda vale el doble.', req: ['moneda'], fx: { dinero: 2 } },
    { id: 'd_mitad', c: 'dinero', n: 'Monedas generosas', d: 'Todo lo que ganas con la moneda vale la mitad más.', req: ['moneda'], fx: { dinero: 1.5 } },
    { id: 'd_hucha', c: 'dinero', n: 'Hucha de trampillas', d: 'Cada oponente que tiras mete dos mil euros extra en tu bote.', req: ['moneda'], fx: { hucha: 2000 } },
    { id: 'd_racha', c: 'dinero', n: 'Racha de trampillas', d: 'Cada tres oponentes que tiras, cinco mil euros extra.', req: ['moneda'], fx: { rachaD: 5000 } },
    { id: 'd_protegida', c: 'dinero', n: 'Moneda protegida', d: 'Ninguna moneda en euros te da menos de cinco mil euros.', req: ['moneda'], fx: { protegida: 5000 } },
    { id: 'd_huellaoro', c: 'dinero', n: 'Trampilla del tesoro', d: 'Una trampilla secreta paga el triple con su moneda.', req: ['moneda'], fx: { huellaOro: true } },
    { id: 'd_arranque', c: 'dinero', n: 'Buen arranque', d: 'La primera moneda te regala cinco mil euros extra.', req: ['moneda'], fx: { arranqueD: 5000 } },
    // 🏆 Juego final (120 s y 10 palabras)
    { id: 'f_mas20', c: 'final', n: 'Final con más tiempo', d: 'En el juego final tienes veinte segundos más.', req: ['final'], fx: { finalMas: 20 } },
    { id: 'f_mas30', c: 'final', n: 'Final tranquilo', d: 'En el juego final tienes treinta segundos más.', req: ['final'], fx: { finalMas: 30 } },
    { id: 'f_meta9', c: 'final', n: 'Final de nueve', d: 'En el juego final te basta con nueve aciertos.', req: ['finalMeta'], fx: { metaMenos: 1 } },
    { id: 'f_x3', c: 'final', n: 'Final de oro', d: 'Si ganas el juego final, tu bote se multiplica por tres en vez de por dos.', req: ['finalMeta'], fx: { finalX: 3 } },
    { id: 'f_planta', c: 'final', n: 'Plantarse con premio', d: 'Si te plantas antes del juego final, te llevas tres cuartas partes del bote en vez de la mitad.', req: ['finalMeta'], fx: { planta: 0.75 } },
    // 🐔 Palabra gallina
    { id: 'g_mas10', c: 'gallina', n: 'Gallina generosa', d: 'En la palabra gallina tienes diez segundos más.', req: ['gallina'], fx: { gallinaMas: 10 } },
    { id: 'g_rival', c: 'gallina', n: 'Gallina despistada', d: 'En la palabra gallina tu oponente se atasca mucho más.', req: ['gallinaDuelo'], fx: { gallinaRival: 1 } },
    { id: 'g_fiesta', c: 'gallina', n: 'Gallina de fiesta', d: 'Si aciertas en la palabra gallina, el plató lo celebra por todo lo alto.', req: ['gallinaDuelo'], fx: { gallinaFiesta: 1 } },
    // 🎉 Fiesta (en todos los modos)
    { id: 'e_confeti', c: 'fiesta', n: 'Lluvia de confeti', d: 'Cada acierto se celebra con confeti.', fx: { fiesta: 'confeti' } },
    { id: 'e_aplausos', c: 'fiesta', n: 'Público entregado', d: 'El público aplaude todavía más fuerte cada acierto.', fx: { fiesta: 'aplausos' } },
    { id: 'e_emojis', c: 'fiesta', n: 'Emojis voladores', d: 'Cada acierto hace volar emojis por la pantalla.', fx: { fiesta: 'emojis' } },
    { id: 'e_fanfarria', c: 'fiesta', n: 'Fanfarria', d: 'Suena una fanfarria con cada acierto.', fx: { fiesta: 'fanfarria' } },
    { id: 'e_globos', c: 'fiesta', n: 'Globos de colores', d: 'Suben globos con cada acierto.', fx: { fiesta: 'globos' } },
    { id: 'e_estrellas', c: 'fiesta', n: 'Cazador de estrellas', d: 'Cada acierto te da una estrella. Al final verás cuántas has juntado.', fx: { fiesta: 'estrellas', estrellas: true } },
    { id: 'e_animo', c: 'fiesta', n: 'Mensajes de ánimo', d: 'Si fallas, aparece un mensaje bonito para animarte.', fx: { fiesta: 'animo' } },
    { id: 'e_arcoiris', c: 'fiesta', n: 'Marco arcoíris', d: 'La pantalla se pone un marco de colores del arcoíris.', fx: { fiesta: 'arcoiris' } },
    { id: 'e_vitores', c: 'fiesta', n: 'Ovación', d: 'El público se pone en pie con tus aciertos.', fx: { fiesta: 'vitores' } },
    { id: 'e_chispas', c: 'fiesta', n: 'Chispas', d: 'Cada acierto hace saltar chispas por la pantalla.', fx: { fiesta: 'chispas' } },
    // 🎤 Adrián
    { id: 'v_bien', c: 'voz', n: 'Presentador animado', d: 'Te felicito en voz alta cuando aciertas.', fx: { vozBien: true } },
    { id: 'v_animo', c: 'voz', n: 'Presentador que anima', d: 'Te animo en voz alta cuando fallas.', fx: { vozAnimo: true } },
    { id: 'v_todo', c: 'voz', n: 'Presentador charlatán', d: 'Te felicito cuando aciertas y te animo cuando fallas.', fx: { vozBien: true, vozAnimo: true } }
  ],
  // nunca dos retos juntos
  // v1.40: tampoco normas que se contradicen (relojes con cifras distintas, oponentes más fáciles y más difíciles a la vez)
  excl: [['r_reto', 'o_fuertes'], ['r_largo', 'r_mas5'], ['r_largo', 'r_mas10'], ['r_largo', 'r_reto'], ['r_largo', 'r_rival25'], ['r_largo', 'r_rival20'], ['o_fuertes', 'o_novatos'], ['o_fuertes', 'o_primero'], ['o_fuertes', 'o_escalera'], ['o_novatos', 'o_despistados'], ['o_novatos', 'o_lentos'], ['e_aplausos', 'e_vitores']],
  ev: {
    bien: ['¡Muy bien!', '¡Correcto, sigue así!', '¡Fenomenal!', '¡Eso es, qué crack!'],
    animo: ['¡No pasa nada, lo estás haciendo genial!', '¡Ánimo, que tú puedes!', '¡Casi, casi!', '¡Tranquilo, la próxima es tuya!'],
    escudo: ['¡Fallo gratis! Ese fallo no te cuesta ningún comodín.']
  },
  // frases sueltas (ns/voz/x_*.mp3)
  x: {
    prorroga10: 'Tienes prórroga: diez segundos más para ti.',
    prorroga20: 'Tienes prórroga larga: veinte segundos más para ti.',
    bloqueo: '¡Trampilla bloqueada! Esta vez no caes, y tu oponente se retira.',
    huellaoro: '¡Trampilla del tesoro! Esta moneda paga el triple.',
    protegida: '¡Moneda protegida! Te llevas cinco mil euros.',
    comod: '¡Te regalo un comodín verde!',
    gallina: '¡Palabra gallina acertada! ¡Qué fiesta!'
  },
  // tipos de cada modo; ns/ac.js añade 'gallina' y 'gallinaDuelo' al Programa completo cuando esa noche hay palabra gallina
  modos: {
    'Programa completo': ['duelo', 'rival', 'comod', 'fallos', 'caida', 'moneda', 'final', 'finalMeta'],
    'Entrenamiento · Duelo': ['duelo', 'rival', 'comod'],
    'Entrenamiento · Prueba': ['rival', 'comod', 'fallos'],
    'Entrenamiento · ¡Vaya lío!': ['duelo', 'rival', 'comod'],
    'Entrenamiento · Pruebas con reloj': ['pregunta'],
    'Entrenamiento · Palabra gallina': ['pregunta', 'gallina'],
    'Entrenamiento · Juego final': ['final'],
    'Entrenamiento · Huellas y moneda': ['moneda'],
    'Entrenamiento · Pruebas sin tiempo': []
  }
});
