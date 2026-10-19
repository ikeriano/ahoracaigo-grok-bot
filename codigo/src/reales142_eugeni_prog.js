R142_DATOS.push({
  id: 'eugeni2021', titulo: '¡Ahora Caigo! con Eugeni Alemany', fecha: '14/06/2021', presentador: 'Eugeni Alemany',
  dir: R142_D + 'eugeni2021', cabecera: 'cabecera.mp4', creditos: 'despedida.mp4',
  fotos: ['pres_1.jpg', 'pres_2.jpg', 'pres_3.jpg', 'pres_4.jpg'],
  oponentes: ['Guille', 'Agustín', 'Oponente 3', 'Oponente 4', 'Oponente 5', 'Oponente 6', 'Oponente 7', 'Oponente 8', 'Oponente 9', 'Oponente 10'].map((n, i) => ({ n, premio: [20000,10000,5000,5000,2000,2000,1000,1000,500,500][i] })),
  rondas: [
    { nombre: 'Duelo 1', tipo: 'letras', rival: 'Guille', preguntas: [
      { q: "¿De qué idioma proviene la palabra 'cerbatana'?", r: 'ÁRABE', pista: '_R_B_' },
      { q: "¿En qué partes del cuerpo se ponen unas 'flip flop'?", r: 'PIES', pista: 'P__S' },
      { q: '¿Qué tipo de producto cárnico es el blanquet, muy típico de la Comunidad Valenciana?', r: 'EMBUTIDO', pista: '_MB_T__O' },
      { q: 'Además de estar considerada la precursora del wifi, Hedy Lamarr fue la primera actriz que simuló este momento de clímax sexual en el cine.', r: 'ORGASMO', pista: '__G_S_O' },
      { q: "'Hurto con engaño' que nombra a un futbolista alemán apellidado Werner.", r: 'TIMO', pista: 'T__O' },
      { q: "¿Quién escribió 'El conde de Montecristo'?", r: 'ALEJANDRO DUMAS', pista: '_L_J_N__O DU__S' },
      { q: '¿Cuál es el ordinal del número 40?', r: 'CUADRAGÉSIMO', pista: 'C_A__A__S__O' },
      { q: 'Además del mar del Norte, ¿qué otro mar baña las costas de Dinamarca?', r: 'BÁLTICO', pista: '____I__' },
      { q: 'Serie de televisión en la que la oscarizada Olivia Colman interpreta a la reina de Inglaterra.', r: 'THE CROWN', pista: '__E _RO__' } ] },
    { nombre: 'Duelo 2', tipo: 'letras', preguntas: [
      { q: "¿Qué animal es Darius, el más grande del mundo según el libro 'Guinness de los récords'?", r: 'CONEJO', pista: 'C_N_J_' },
      { q: 'En una nómina, es el salario que aún no ha experimentado retenciones.', r: 'BRUTO', pista: '_R__O' },
      { q: "¿Qué escritora es la autora de la novela 'Sira'?", r: 'MARÍA DUEÑAS', pista: 'M_R__ D__Ñ__' },
      { q: "¿A qué género pictórico pertenece el cuadro 'Cesta con frutas', de Caravaggio?", r: 'BODEGÓN', pista: '_O__G_N' } ] },
    { nombre: 'Duelo: Pienso, Luego o Existo', tipo: 'opciones', opciones: ['PIENSO', 'LUEGO', 'EXISTO'], preguntas: [
      { q: "Cuando te despides, pero sabes que te verás pronto dices: 'Hasta...'", ok: 1 },
      { q: "A Picasso se le atribuye la frase 'Pinto los objetos como los...'", ok: 0 },
      { q: "Pimpinela canta: 'Vete. Olvida que...'", ok: 2 } ] },
    { nombre: 'Letras desordenadas', tipo: 'anagrama', preguntas: [
      { q: 'Son los que más dominan la bandeja en un bar.', letras: 'CREÁRAMOS', r: 'CAMAREROS' },
      { q: 'Es un tipo de escote que deja los hombros al descubierto.', letras: 'REBAÑA', r: 'BAÑERA' },
      { q: 'Apellido de la Reina de las Rancheras en España.', letras: 'LUCRAD', r: 'DÚRCAL' },
      { q: "En la Capilla Sixtina, Miguel Ángel pintó 'La... de Adán'.", letras: 'COCERÍAN', r: 'CREACIÓN' } ] },
    { nombre: 'Duelo 3', tipo: 'letras', preguntas: [
      { q: '¿Cuál es el último equipo de fútbol español que ha ganado una Champions League?', r: 'REAL MADRID', pista: '_E_L MA__I_' },
      { q: '¿Qué isla canaria es conocida como la Isla Mágica?', r: 'LA GOMERA', pista: 'L_ G_M__A' },
      { q: 'Durante uno de sus viajes a América, este famoso conquistador llegó a la conclusión de que la Tierra tenía forma de pera.', r: 'CRISTÓBAL COLÓN', pista: '_R_S____L _OL__' },
      { q: "¿Cómo era 'el sulfato' de la famosa aventura de Mortadelo y Filemón?", r: 'ATÓMICO', pista: 'A__M__O' },
      { q: "¿En la figura de qué presidente de los EEUU se centra 'Rabia', libro escrito por el periodista Bob Woodward?", r: 'DONALD TRUMP', pista: 'D__A_D T__M_' },
      { q: '¿Qué catalán, campeón mundial de carreras de montaña, corría algunos días hasta 25 kilómetros para ir al instituto?', r: 'KILIAN JORNET', pista: '__L__N _O_N_T' } ] },
    { nombre: 'Canciones con huecos', tipo: 'letras', rival: 'Agustín', preguntas: [
      { q: 'Cómo fue que de papel cambié, eras mi amiga y ahora eres mi mujer. Debes ser perfectamente, ________, lo que yo siempre soñé.', r: 'EXCELENTE', pista: '_XC__E_TE' } ] },
    { nombre: 'Duelo 4', tipo: 'letras', preguntas: [
      { q: '¿Qué órgano de nuestro cuerpo actúa como barrera entre el organismo y el entorno?', r: 'PIEL', pista: '_IE_' },
      { q: 'En 2021, ¿cuántos años se celebran de la primera vez que el ser humano fue al espacio?', r: '60', pista: '_0' },
      { q: '¿En qué región británica son populares los Juegos de las Highlands?', r: 'ESCOCIA', pista: '_SC_CI_' },
      { q: '¿Qué miembro del grupo Camela tiene nombre de dios griego?', r: 'DIONI', pista: '_I__I' },
      { q: '¿Con qué nombre propio llamamos a la versión pequeña del pastel cordobés?', r: 'MANOLETE', pista: '_A_O_ET_' },
      { q: "¿En qué película de Chaplin se incluyó la canción 'La violetera', popularizada por Raquel Meller y Sara Montiel?", r: 'LUCES DE LA CIUDAD', pista: '_U__S __ L_ _IU___' },
      { q: "¿Qué artista estadounidense debutó como cantante en 'The Supremes' antes de triunfar en solitario?", r: 'DIANA ROSS', pista: '__A_A _O_S' } ] },
    { nombre: 'Juego final', tipo: 'letras', tiempo: 30, elige: false, final: true, preguntas: [
      { q: 'Es el único felino que no puede retraer las uñas.', r: 'GUEPARDO', pista: 'G_E____O', quien: 'iker' },
      { q: '¿En qué lengua se canta el Réquiem de Mozart?', r: 'LATÍN', pista: 'L__ÍN', quien: 'iker' },
      { q: '¿Qué tipo de calzado son unas katiuskas?', r: 'BOTAS DE AGUA', pista: '_OT_S D_ _GU_', quien: 'iker' },
      { q: 'Así llaman los italianos a la pimienta.', r: 'PEPE', pista: '__PE', quien: 'iker' },
      { q: '¿Qué queso asturiano tiene una variedad con frutos secos en su interior?', r: 'TARAMUNDI', pista: '__R__UN__', quien: 'iker' },
      { q: 'Juguete de origen australiano que en sus orígenes se usaba para cazar.', r: 'BOOMERANG', pista: 'B__M__A_G', quien: 'iker' },
      { q: '¿De quién recibe Harry Potter la habilidad de hablar con serpientes?', r: 'LORD VOLDEMORT', pista: 'L_R_ _O_D_M__T', quien: 'iker' },
      { q: "Compuso la banda sonora de 'La misión'.", r: 'ENNIO MORRICONE', pista: '__N_O __RR___NE', quien: 'iker' },
      { q: "En el Museo del Prado se exhibe una pintura de Zurbarán titulada 'Bodegón con...'", r: 'CACHARROS', pista: '__C___R_S', quien: 'iker' },
      { q: '¿En qué ciudad se firmó la Declaración de Independencia de EEUU?', r: 'FILADELFIA', pista: 'F_L______A', quien: 'iker' } ] },
  ]
});
