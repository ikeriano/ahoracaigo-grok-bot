R142_DATOS.push({
  id: 'ninos2019', titulo: '¡Ahora Caigo! Especial niños', fecha: '24/12/2019', presentador: 'Arturo Valls',
  dir: R142_D + 'ninos2019', cabecera: 'cabecera.mp4', creditos: 'despedida.mp4',
  fotos: ['arturo_1.jpg', 'arturo_2.jpg'],
  saludo: [
    { t: '¡Feliz Navidad a todos! ¡Qué bonita la Nochebuena! Es Navidad, es momento de disfrutarla. Pero no os voy a pedir que os olvidéis de los problemas, porque no podemos, ni debemos hacerlo.', img: 'arturo_1.jpg', audio: 'f_navidad.mp3' },
    { t: 'Esta tarde os quiero proponer un pequeño juego: vamos a volver a ser niños y niñas durante un ratito... Abajo las barreras, solo por hoy, juguemos y riamos hasta caer rendidos como niños. ¡Que pasen los niños, nuestros adultos del mañana!', img: 'arturo_2.jpg', audio: 'f_juego.mp3' } ],
  despedida: [ { t: 'Feliz Navidad a todos, feliz Nochebuena, mucho amor para todos. Pasadlo muy bien esta noche. ¡Nos vemos! ¡Adiós!', img: 'arturo_1.jpg', audio: 'f_despedida.mp3' } ],
  oponentes: [1,2,3,4,5,6,7,8,9,10].map((n, i) => ({ n: 'Oponente ' + n, premio: [20000,10000,5000,5000,2000,2000,1000,1000,500,500][i] })),
  rondas: [
    { nombre: 'Duelo 1', tipo: 'letras', preguntas: [
      { q: '¿Cuál es el planeta del Sistema Solar con más satélites conocidos?', r: 'SATURNO', pista: 'S_T_R_O' },
      { q: '¿Qué oficio tuvo la irlandesa Anne Bonny durante el siglo XVIII?', r: 'PIRATA', pista: 'P_R_TA' },
      { q: "¿Qué deporte se conocía originalmente como 'ping-pong'?", r: 'TENIS DE MESA', pista: 'T_N__ D_ M_S_' },
      { q: '¿Qué personaje de los cómics de Marvel es conocido como el Gigante Verde?', r: 'HULK', pista: '_UL_' },
      { q: '¿Qué satélite natural de la Tierra refleja la luz del sol?', r: 'LUNA', pista: 'L_N_' },
      { q: '¿En qué extremidad del cuerpo humano suelen pincharnos para extraernos sangre?', r: 'BRAZO', pista: 'B__Z_' },
      { q: "La familia Balbuena viaja a través de un agujero negro en la colección de libros de 'Los forasteros del...'", r: 'TIEMPO', pista: 'T___PO' },
      { q: '¿Cuál es el principal gas atmosférico que absorben las plantas a través de sus hojas como parte de la fotosíntesis?', r: 'DIÓXIDO DE CARBONO', pista: '_I_X_D_ D_ C__B__O' },
      { q: 'Capa de la Tierra en la que se desarrollan los seres vivos.', r: 'BIOSFERA', pista: '__O_F_RA' } ] },
    { nombre: 'Duelo: Cosas, De o Niños', tipo: 'opciones', opciones: ['COSAS', 'DE', 'NIÑOS'], preguntas: [
      { q: "Sinónimo de 'objetos'.", ok: 0 },
      { q: "Están 'perdidos' en el país de Nunca Jamás.", ok: 2 },
      { q: "Según el refrán, cuando son 'de palacio' van despacio.", ok: 0, quien: 'rival', falloRival: true } ] },
    { nombre: 'Canciones con huecos', tipo: 'letras', preguntas: [
      { q: 'La venda ya cayó avivando fantasías. La venda __ ____ y serás como querías.', r: 'YA CAYÓ', pista: 'Y_ C_Y_' } ] },
    { nombre: 'Duelo 2', tipo: 'letras', preguntas: [
      { q: '¿Qué superheroína de la Liga de la Justicia tiene unos brazaletes mágicos que le permiten desviar proyectiles?', r: 'WONDER WOMAN', pista: 'W__D_R W__AN' },
      { q: 'El petróleo y el carbón son fuentes de energía no...', r: 'RENOVABLES', pista: 'R__O__B__S' },
      { q: '¿Qué se suele usar en el parchís para lanzar los dados?', r: 'CUBILETES', pista: '_UB_L__ES' },
      { q: 'En España, ¿en qué noche del año es tradición comer doce uvas?', r: 'NOCHEVIEJA', pista: '__C_E_I_JA' },
      { q: '¿En qué saga literaria aparecen los Mortífagos?', r: 'HARRY POTTER', pista: 'H_R__ P__T_R' } ] },
    { nombre: 'Letras desordenadas', tipo: 'anagrama', preguntas: [
      { q: 'Accesorio en forma de medio aro que sujeta el pelo hacia atrás.', letras: 'MEDIADA', r: 'DIADEMA' },
      { q: 'Es una de las palabras preferidas de los Minions.', letras: 'ABANAN', r: 'BANANA' },
      { q: 'Nombre de reina que significa excremento.', letras: 'ALICATAN', r: 'CATALINA' } ] },
    { nombre: 'Duelo 3', tipo: 'letras', preguntas: [
      { q: "En los cómics de 'Los 4 fantásticos', ¿qué parentesco une a la Mujer Invisible y la Antorcha Humana?", r: 'HERMANOS', pista: 'H_RM___S' },
      { q: '¿Qué parte de nuestro cuerpo solemos apoyar en una almohada cuando dormimos?', r: 'CABEZA', pista: 'C__EZ_' },
      { q: '¿Qué le falta en la cabeza a alguien que padece calvicie?', r: 'PELO', pista: 'P__O' },
      { q: 'El cráter, la caldera o la chimenea pueden ser partes de un...', r: 'VOLCÁN', pista: 'V__CÁN' },
      { q: "En la saga de libros 'Diario de Greg', su protagonista empezó siendo 'Un pringao...'", r: 'TOTAL', pista: 'T_T__' },
      { q: 'Los ecosistemas naturales acuáticos pueden ser de agua dulce o de agua...', r: 'SALADA', pista: 'S_L_D_' },
      { q: "De una persona que está angustiada se dice que tiene 'el corazón en un...'", r: 'PUÑO', pista: 'P__O' } ] },
    { nombre: 'Duelo: Leche, Galleta o Chocolate', tipo: 'opciones', opciones: ['LECHE', 'GALLETA', 'CHOCOLATE'], preguntas: [
      { q: "Puede ser 'merengada' o 'condensada'.", ok: 0, quien: 'rival', falloRival: true } ] },
    { nombre: 'Canciones con huecos 2', tipo: 'letras', preguntas: [
      { q: 'Hoy voy a hablarte de mis héroes que me vieron crecer. Desde el león que se hizo rey hasta __ ________ que rompió la ley.', r: 'LA PRINCESA', pista: 'L_ PR__C_SA' },
      { q: 'Es una asesina cuando _____ quiere que to el mundo la vea. I like your poom-poom, girl. Con calma.', r: 'BAILA', pista: 'B__LA' },
      { q: 'Esa mami me tiene ____. Ya casi no cojo playa contando lunares.', r: 'LOCA', pista: 'L_C_' },
      { q: 'Un plato hondo, un plato _____, un cuchillito y un tenedor.', r: 'LLANO', pista: 'LL__O' },
      { q: 'Mira cómo bailo, mira cómo ando, mires donde mires siempre estoy __ _____', r: 'AL MANDO', pista: 'A_ M_N_O' },
      { q: 'Cómo te atreves a volver _ _ ___ _______ convertir en fuego.', r: 'Y A TUS CENIZAS', pista: 'Y A T_S CE____S' } ] },
    { nombre: 'Letras desordenadas 2', tipo: 'anagrama', preguntas: [
      { q: 'Uno de los personajes mágicos de la Navidad es Papá...', letras: 'LEÓN', r: 'NOEL' },
      { q: 'En Navidad, los más pequeños pueden sacar chocolate del calendario de...', letras: 'EVITANDO', r: 'ADVIENTO' },
      { q: 'Vehículos con esquíes en lugar de ruedas que sirven para deslizarse sobre el hielo y la nieve.', letras: 'TIRONES', r: 'TRINEOS' },
      { q: 'Coches que forman un tren.', letras: 'VEGANOS', r: 'VAGONES' } ] },
    { nombre: 'Duelo 4', tipo: 'letras', preguntas: [
      { q: "De alguien con mal humor decimos que tiene 'malas...'", r: 'PULGAS', pista: 'PUL__S' },
      { q: 'En verano de 2019 fue noticia el nacimiento de un lince en esta cordillera de la Península Ibérica.', r: 'PIRINEOS', pista: 'PIR__E_S' },
      { q: 'Es la fuerza responsable de que los planetas sean redondos.', r: 'GRAVEDAD', pista: '_RA__DA_' },
      { q: "¿Cómo es la palabra 'bombón' según su acentuación?", r: 'AGUDA', pista: '_GU_A' },
      { q: 'En la Edad Media, ¿a qué señor rendían vasallaje los campesinos a cambio de su protección?', r: 'SEÑOR FEUDAL', pista: '__ÑO_ _E_D_L' },
      { q: "En castellano, ¿qué clase de palabras, que determinan a un sustantivo, son 'el', 'la', 'los', 'las'?", r: 'ARTÍCULOS', pista: '_RTÍ__LOS' },
      { q: 'Como mínimo, ¿cuántos años tiene alguien que es nonagenario?', r: '90', pista: '__' },
      { q: "En 'Peter Pan', ¿qué deben hacer los niños que creen en las hadas para que Campanilla no muera?", r: 'APLAUDIR', pista: '__L_U__R' } ] },
    { nombre: 'Juego final', tipo: 'letras', tiempo: 30, elige: false, final: true, preguntas: [
      { q: '¿Cuál es el único planeta del Sistema Solar que gira de lado sobre su eje?', r: 'URANO', pista: '_R_N_', quien: 'iker' },
      { q: 'En matemáticas, el cociente es el resultado de esta operación.', r: 'DIVISIÓN', pista: 'D_V___ÓN', quien: 'iker' },
      { q: '¿Qué tipo de determinantes son los que indican posesión o pertenencia?', r: 'POSESIVOS', pista: '__S_S_V_S', quien: 'iker' },
      { q: '¿Qué valioso tejido da nombre a los gusanos que se alimentan de hojas de morera?', r: 'SEDA', pista: 'S_D_', quien: 'iker' },
      { q: 'Se dice de una persona que se enfada fácilmente.', r: 'CASCARRABIAS', pista: '_A_C_R__B__S', quien: 'iker' } ] },
  ]
});
