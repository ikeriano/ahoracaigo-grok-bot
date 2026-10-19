R142_DATOS.push({
  id: 'nochevieja2020', titulo: '¡Ahora Caigo! Nochevieja · Lo mejor del 2020', fecha: '31/12/2020', presentador: 'Arturo Valls',
  dir: R142_D + 'nochevieja2020', cabecera: 'cabecera.mp4', creditos: 'despedida.mp4',
  fotos: ['arturo_saludo.jpg', 'arturo_gesto.jpg', 'arturo_manos.jpg', 'arturo_frente.jpg'],
  oponentes: [1,2,3,4,5,6,7,8,9,10].map(n => ({ n: 'Oponente ' + n, premio: [20000,10000,5000,5000,2000,2000,1000,1000,500,500][n-1] })),
  rondas: [
    { nombre: 'Canciones con huecos', tipo: 'letras', preguntas: [
      { q: 'Y poco a poco olvidar el tiempo ___. Frenar el ritmo, ir muy lento, más lento.', r: 'Y SU VELOCIDAD' },
      { q: '¿Qué rumiante africano de cuello largo suele dormir de pie?', r: 'JIRAFA' } ] },
    { nombre: 'Lo mejor del 2020 (I)', tipo: 'letras', preguntas: [
      { q: 'Después de estar al borde de la extinción, la población de este felino de la Península Ibérica se ha multiplicado por nueve en los últimos años.', r: 'LINCE IBÉRICO', pista: 'L_NC_ _B_R_C_' },
      { q: 'En 2020 se ha certificado que la enfermedad de la polio salvaje ha sido erradicada de este continente.', r: 'ÁFRICA', pista: '_F__CA' },
      { q: '¿En qué categoría dos mujeres han compartido por primera vez de manera exclusiva un premio Nobel?', r: 'QUÍMICA', pista: 'Q__M_CA' },
      { q: 'En la Antigua Grecia, ¿qué fruta se arrojaba para declararle el amor a alguien?', r: 'MANZANA', pista: 'M__Z_N_' },
      { q: '¿Cuál es la primera nación del mundo que ha aprobado que los productos de higiene femenina sean gratis?', r: 'ESCOCIA', pista: '_SC_C__' },
      { q: '¿En qué ciudad se disputó la final en la que Nadal ganó su decimotercer Roland Garros?', r: 'PARÍS', pista: 'P_R_S' },
      { q: '¿Qué programa de Antena 3, presentado por Arturo Valls, consiguió el mejor estreno de entretenimiento desde 2012?', r: 'MASK SINGER', pista: 'M__K S__G__' },
      { q: 'En 2020, se ha hecho el mayor descubrimiento arqueológico del Antiguo Egipto con más de un centenar de...', r: 'SARCÓFAGOS', pista: 'SA__ÓF__OS' } ] },
    { nombre: 'Duelo: Feliz, Noche o Vieja', tipo: 'opciones', opciones: ['FELIZ', 'NOCHE', 'VIEJA'], preguntas: [
      { q: "En 'El rey león' cantan: 'Hakuna matata, qué bonito es vivir. Hakuna matata, vive y sé...'", ok: 0 },
      { q: "Sigue a Raphael: '¿Qué pasará? ¿Qué misterio habrá? Puede ser mi gran...'", ok: 1 },
      { q: "¿Cómo es 'la sirena' que titula una novela de José Luis Sampedro?", ok: 2, quien: 'iker' },
      { q: 'Según el refrán, ¿cómo es la gallina que hace buen caldo?', ok: 2 },
      { q: "Peret representó a España en el Festival de Eurovisión con la canción 'Canta y sé...'", ok: 0 },
      { q: "Hay una planta, de flores blancas muy olorosas, que se conoce como 'dama de...'", ok: 1 },
      { q: "El tiempo durante el cual los bares sirven bebidas a un precio inferior se conoce como 'hora...'", ok: 0 },
      { q: '¿Cuál da nombre a un pez muy preciado en la gastronomía canaria?', ok: 2, quien: 'rival', falloRival: true },
      { q: "En 2019, Mariana Enríquez publicó la novela 'Nuestra parte de...'", ok: 1 },
      { q: 'Aparece en el título de un cuadro en el que Van Gogh pintó la terraza de un café de Arlés.', ok: 1 } ] },
    { nombre: 'Letras desordenadas', tipo: 'anagrama', preguntas: [
      { q: '¿A dónde salíamos a aplaudir para reconocer el trabajo de los sanitarios durante el confinamiento?', letras: 'BLANCO', r: 'BALCÓN' },
      { q: 'La Agencia Espacial Europea ha puesto en marcha un proyecto para eliminar basura del...', letras: 'ACOPIES', r: 'ESPACIO' },
      { q: 'Isla de Italia conocida por su vidrio.', letras: 'RUMANO', r: 'MURANO' } ] },
    { nombre: 'Duelo: Roca, Torres o Adrià', tipo: 'opciones', opciones: ['ROCA', 'TORRES', 'ADRIÀ'], preguntas: [
      { q: 'Joan, Josep y Jordi son los restauradores hermanos...', ok: 0 },
      { q: 'Piedra muy dura.', ok: 0 },
      { q: "Aparece en el título de la segunda parte de 'El Señor de los Anillos'.", ok: 1 },
      { q: 'Apellido del exjugador de fútbol apodado el Niño.', ok: 1 },
      { q: "¿Qué hermanos cocineros nacieron en L'Hospitalet de Llobregat?", ok: 2, quien: 'rival', falloRival: true } ] },
    { nombre: 'Lo mejor del 2020 (II)', tipo: 'letras', preguntas: [
      { q: '¿Qué programa de Antena 3, presentado por Arturo Valls, celebró 2.000 programas de emisión en 2020?', r: 'AHORA CAIGO', pista: '__O_A __I_O' },
      { q: 'Es el primer país de Centroamérica en legalizar el matrimonio homosexual.', r: 'COSTA RICA', pista: 'C_S_A R_C_' },
      { q: 'En mayo de 2020, el Consejo de Ministros aprobó una prestación económica para los hogares más vulnerables llamada Ingreso...', r: 'MÍNIMO VITAL', pista: '_Í_I_O __T_L' },
      { q: '¿Qué película de Pixar celebró los 25 años de su estreno en 2020?', r: 'TOY STORY', pista: '__Y ST__Y' },
      { q: 'Según la RAE, ¿cómo se llama el objeto que se usa para atraer a las aves?', r: 'SEÑUELO', pista: '_E_U__O' } ] },
    { nombre: 'Duelo: Elefante, Hipopótamo o Rinoceronte', tipo: 'opciones', opciones: ['ELEFANTE', 'HIPOPÓTAMO', 'RINOCERONTE'], preguntas: [
      { q: 'El africano tiene las orejas más grandes que el asiático.', ok: 0 },
      { q: '¿Cuál es el símbolo del Partido Republicano de EEUU?', ok: 0 },
      { q: '¿Qué animal inspiró a uno de los primeros enemigos de Spiderman?', ok: 2 } ] },
    { nombre: 'Duelo con letras', tipo: 'letras', preguntas: [
      { q: "El protagonista de 'Las brujas', de Roald Dahl, se enfrenta a estos seres perversos con la ayuda de este familiar.", r: 'ABUELA', pista: '_B__L_' },
      { q: "¿De qué cantante británica es el tema 'Someone Like You'?", r: 'ADELE', pista: '__EL_' },
      { q: '¡Ay! del chiquirritín, chiquirriquitín metidito entre ___. ¡Ay! del chiquirritín, chiquirriquitín. \'Queridí\', queridito del alma.', r: 'PAJAS', pista: 'P_JA_' } ] },
    { nombre: 'Juego final', tipo: 'letras', tiempo: 30, elige: false, final: true, preguntas: [
      { q: '¿En qué gran selva de América del Sur se ha descubierto una de las colecciones de arte rupestre prehistórico más grandes del mundo?', r: 'SELVA AMAZÓNICA', pista: '__LV_ _M_Z_N__A', quien: 'iker' },
      { q: 'En marzo de 2020, la primera ministra de este país nórdico hizo una rueda de prensa dirigida exclusivamente a los niños.', r: 'NORUEGA', pista: 'N_R__G_', quien: 'iker' },
      { q: 'Louise Glück se ha convertido este año en la primera mujer poeta en ganar este prestigioso premio desde 1996.', r: 'NOBEL', pista: 'N_B__', quien: 'iker' },
      { q: '¿En qué agencia espacial han hecho historia las astronautas Christina Koch y Jessica Meir?', r: 'NASA', pista: 'N_S_', quien: 'iker' },
      { q: '¿Cómo se llaman los músculos que mueven una parte del cuerpo separándola de otra o de la línea media corporal?', r: 'ABDUCTORES', pista: 'A__U___RES', quien: 'iker' } ] },
  ]
});
