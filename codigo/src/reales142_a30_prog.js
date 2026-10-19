R142_DATOS.push({
  id: 'a3_30anos', titulo: '¡Ahora Caigo! Especial 30 años de Antena 3', fecha: '24/01/2020', presentador: 'Arturo Valls',
  dir: R142_D + 'a3_30anos', cabecera: 'cabecera.mp4', creditos: 'despedida.mp4',
  fotos: ['arturo_1.jpg', 'arturo_2.jpg', 'arturo_3.jpg', 'arturo_4.jpg'],
  saludo: [
    { t: 'Buenas tardes, compañeros, pero si sois siempre los mismos, esto parece un internado. Y yo contento, porque lo que necesito es amor y lo vuestro es amarme para siempre.', img: 'arturo_1.jpg', audio: 'f_buenas.mp3' },
    { t: 'Lo que vais a ver esta tarde aquí no lo podéis encontrar en ninguna farmacia, ni siquiera la de guardia. Pues sorpresa, sorpresa.', img: 'arturo_2.jpg', audio: 'f_farmacia.mp3' },
    { t: 'Porque entre los concursantes de hoy hay mucha química y física. ¡No me hagas zapping! ¡Que empieza el especial Antena 3, 30 años aniversario, amigos!', img: 'arturo_4.jpg', audio: 'f_empieza.mp3' } ],
  despedida: [ { t: 'Pues para ellos es, y nosotros nos vamos. Les espero, espero veros dentro de 30 años aquí en esta casa. Un abrazo. Felicidades, Antena 3.', img: 'arturo_3.jpg', audio: 'f_despedida.mp3' } ],
  oponentes: ['Irma', 'Jandro', 'Jordi', 'Pablo', 'Pepón', 'Poty', 'Roberto', 'Silvia'].map((n, i) => ({ n, premio: [20000,10000,5000,5000,2000,2000,1000,1000][i] })),
  rondas: [
    { nombre: 'Duelo 1', tipo: 'letras', rival: 'Pepón', preguntas: [
      { q: "Emilio, el portero de 'Aquí no hay quien viva', siempre pedía 'un poquito de...'", r: 'POR FAVOR', pista: '_O_ __V_R' },
      { q: "¿Con qué presentador de televisión se asocia la expresión 'Permítame que insista'?", r: 'MATÍAS PRATS' },
      { q: '¿Qué serie transcurría en las aulas del colegio Azcona?', r: 'COMPAÑEROS' } ] },
    { nombre: 'Duelo 2', tipo: 'letras', rival: 'Poty', preguntas: [
      { q: '¿Qué aves rapaces se convirtieron en serie de Antena 3?', r: 'GAVILANES' },
      { q: '¿Qué personaje de la familia Simpson tiene el pelo azul?', r: 'MARGE' },
      { q: "Acaba la famosa frase de 'Farmacia de Guardia': 'Para dentro...'", r: 'ROMERALES', pista: 'R___R___S' },
      { q: '¿Qué programa presentó Patricia Gaztañaga durante 7 años en Antena 3?', r: 'EL DIARIO DE PATRICIA', pista: 'E_ D_A_I_ __ P_T_I_I_' },
      { q: "El programa infantil más famoso de la historia de Antena 3 fue el 'Club...'", r: 'MEGATRIX', pista: '_EG_T_I_' } ] },
    { nombre: 'Duelo 3', tipo: 'letras', preguntas: [
      { q: "¿Qué eurovisivo exconcursante de 'Tu cara me suena' presentó el 'Club Megatrix'?", r: 'DANIEL DIGES', pista: '_A_I__ _I__S' },
      { q: "¿Qué actor popularizó en 'La casa de los líos' las palabras 'chatín' y 'chatina'?", r: 'ARTURO FERNÁNDEZ', pista: '_R__R_ ___N__D__' },
      { q: "¿De qué joven artista es la canción 'De la Tierra hasta Marte'?", r: 'ALFRED GARCÍA', pista: '___RE_ _A___A' },
      { q: '¿Qué escritora estadounidense creó a un vampiro llamado Louis de Pointe du Lac?', r: 'ANNE RICE', pista: '__N_ _IC_' } ] },
    { nombre: 'Duelo: Treinta, Años o Éxito', tipo: 'opciones', opciones: ['TREINTA', 'AÑOS', 'ÉXITO'], preguntas: [
      { q: 'Número que llevaba Messi cuando debutó en partido oficial en el primer equipo del Barça.', ok: 0 },
      { q: "¿Qué 'cumples' si Parchís te canta una de sus canciones más famosas?", ok: 1 },
      { q: "'Tirante' es anagrama de...", ok: 0, quien: 'rival', falloRival: true } ] },
    { nombre: 'Duelo 4', tipo: 'letras', preguntas: [
      { q: "¿Qué presentaba Susanna Griso en Antena 3 antes de 'Espejo público'?", r: 'NOTICIAS', pista: '_O__CI_S' },
      { q: '¿Quién era el presidente de España cuando se exhumó a Francisco Franco?', r: 'PEDRO SÁNCHEZ' },
      { q: "¿Quién presentó el programa 'Queremos saber' en los años 90?", r: 'MERCEDES MILÁ', pista: 'M_RC___S M__Á' },
      { q: "¿Qué grupo surgido de la serie 'Un paso adelante' cantaba temas como 'Sámbame' o 'Morenita'?", r: 'UPA DANCE', pista: 'U__ D_N__' },
      { q: '¿De qué grupo madrileño es vocalista Juancho?', r: 'SIDECARS', pista: '_ID__A_S' },
      { q: '¿Sobre qué libro de María Dueñas se emitió una serie de televisión en 2013?', r: 'EL TIEMPO ENTRE COSTURAS' },
      { q: "¿En qué antiguo concurso de Antena 3 'todo va bien, nada va mal'?", r: 'LA PARODIA NACIONAL' },
      { q: 'Cuando se construyó, el nombre original de este edificio de Nueva York con forma de plancha era Fuller.', r: 'FLATIRON', pista: '_L__I_O_' } ] },
    { nombre: 'Canciones con huecos', tipo: 'letras', preguntas: [
      { q: 'Acompáñame una noche más que sorpresas, sorpresas, sorpresas, sorpresas, __ ______', r: 'TE LLEVARÉ', pista: 'T_ LL_V_R_' },
      { q: 'Mete en una coctelera un trueno, un terremoto y un volcán y tendrás ___ _______. Aquí, aquí, aquí no hay quien viva, aquí no, aquí no.', r: 'ESTA ESCALERA', pista: '_ST_ _SC_L__A' } ] },
    { nombre: 'Letras desordenadas', tipo: 'anagrama', preguntas: [
      { q: "El 'de San Miguel' es en septiembre y el 'de San Martín' en noviembre.", letras: 'LLOVERÍAN', r: 'VERANILLO' } ] },
    { nombre: 'Duelo 5', tipo: 'letras', rival: 'Roberto', preguntas: [
      { q: "Presentó junto a Lydia Bosch 'El gran juego de la oca' en Antena 3.", r: 'EMILIO ARAGÓN', pista: '_M_L__ AR_G__' },
      { q: '¿En qué programa de Antena 3 debutó Chiquito de la Calzada con sus chistes?', r: 'GENIO Y FIGURA', pista: '_E__O _ _I__RA' },
      { q: '¿Dónde iban los ladrones según una serie de Antena 3?', r: 'A LA OFICINA', pista: 'A L_ _F_C_N_' },
      { q: '¿Qué jugador del Athletic Club lleva el dorsal número 20?', r: 'ARITZ ADURIZ' },
      { q: "¿Qué actor interpreta a Ulises en 'El barco' de Antena 3?", r: 'MARIO CASAS' },
      { q: '¿Para qué dinastía rusa creó Fabergé sus famosos huevos?', r: 'ROMANOV', pista: '__MA_O_' },
      { q: '¿Cómo se llama la tetralogía más famosa de Elena Ferrante?', r: 'DOS AMIGAS', pista: '__S _M__AS' } ] },
    { nombre: 'Juego final', tipo: 'letras', tiempo: 30, elige: false, final: true, preguntas: [
      { q: "Según la revista 'Time', ¿quién es la única diseñadora que está entre las personas más influyentes del siglo XX?", r: 'COCO CHANEL', quien: 'iker' },
      { q: '¿Cuál es el nombre real de la famosa youtuber Soy una pringada?', r: 'ESTY QUESADA', pista: 'E___ _UE__D_', quien: 'iker' } ] },
  ]
});
