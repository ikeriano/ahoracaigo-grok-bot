R142_DATOS.push({
  id: 'tcms2020', titulo: '¡Ahora Caigo! Especial Tu cara me suena', fecha: '24/01/2020', presentador: 'Arturo Valls',
  dir: R142_D + 'tcms2020', cabecera: 'cabecera.mp4', creditos: 'despedida.mp4',
  fotos: ['arturo_1.jpg', 'arturo_2.jpg', 'arturo_3.jpg', 'arturo_4.jpg'],
  saludo: [
    { t: 'Bienvenidos a Ahora Caigo, una tarde más. ¿Os gustan las tradiciones? Me gusta celebrar los cumpleaños, el patrón de las Fallas... Y algo que se ha convertido ya en tradición y me encanta celebrar es el especial... ¡Tu cara me suena!', img: 'arturo_1.jpg', audio: 'f_bienvenidos.mp3' } ],
  despedida: [ { t: 'Y a vosotros deciros que no os perdáis la próxima temporada, la número 8 de Tu cara me suena, programón en Antena 3. ¡Adiós!', img: 'arturo_2.jpg', audio: 'f_despedida.mp3' } ],
  oponentes: ['Nerea Rodríguez', 'Monaguillo', 'Daniel Diges', 'Mario Vaquerizo', 'Belinda Washington', 'Oponente 6', 'Oponente 7', 'Oponente 8', 'Oponente 9', 'Oponente 10'].map((n, i) => ({ n, premio: [20000,10000,5000,5000,2000,2000,1000,1000,500,500][i] })),
  rondas: [
    { nombre: 'Canción con hueco', tipo: 'letras', preguntas: [
      { q: "Sigue la canción: 'Soy un salero, azucarero, la batidora y una...'", r: 'OLLA EXPRÉS', pista: '_LL_ _X_RÉ_' } ] },
    { nombre: 'Duelo 1', tipo: 'letras', preguntas: [
      { q: '¿A qué continente tienes que viajar para visitar el reino de Eswatini?', r: 'ÁFRICA', pista: '_FR_C_' },
      { q: '¿Sobre qué extremidades se incorporaron los primeros homínidos que caminaron erguidos?', r: 'TRASERAS', pista: '_R_SE__S' },
      { q: "¿Para qué fiesta valenciana se compuso el pasodoble 'Paquito el Chocolatero'?", r: 'MOROS Y CRISTIANOS', pista: 'M_R__ _ CR_ST__NO_' },
      { q: 'Según el Instituto Nacional de Estadística, ¿qué comunidad autónoma tiene la población más envejecida de España?', r: 'ASTURIAS', pista: '__T__I_S' },
      { q: '¿Qué mítica actriz de Hollywood ganó el Globo de Oro a la Mejor Actriz de Comedia en 1960?', r: 'MARILYN MONROE', pista: 'M_R__YN M_NR__' },
      { q: "¿En qué película de Georges Méliès está inspirado el famoso videoclip 'Tonight, tonight' de los Smashing Pumpkins?", r: 'VIAJE A LA LUNA', pista: 'V__J_ _ _A L_N_' },
      { q: '¿Qué antiguo estado comunista se disolvió oficialmente en diciembre de 1991?', r: 'UNIÓN SOVIÉTICA', pista: 'U_IÓ_ S_V__T_C_' } ] },
    { nombre: 'Duelo: Arroz, Con o Bacalao', tipo: 'opciones', opciones: ['ARROZ', 'CON', 'BACALAO'], preguntas: [
      { q: "Se cocina 'a la cubana' con tomate, huevo y plátano frito.", ok: 0 },
      { q: "En una de sus canciones, Julio Iglesias dice que le gusta 'con papas'.", ok: 2, quien: 'rival', falloRival: true } ] },
    { nombre: 'Letras desordenadas', tipo: 'anagrama', preguntas: [
      { q: 'Así llamas a la mujer de tu hijo cuando se convierte en familia política.', letras: 'NEURA', r: 'NUERA' },
      { q: 'Anglicismo con el que llamamos a quien muestra continuamente una actitud negativa ante cualquier asunto en las redes sociales.', letras: 'HARTÉ', r: 'HATER' },
      { q: "Capital europea que da nombre a un personaje de la serie 'La casa de papel'.", letras: 'LIBREN', r: 'BERLÍN' },
      { q: 'Fue uno de los grandes éxitos de Tino Casal.', letras: 'ELÍSEO', r: 'ELOÍSE' } ] },
    { nombre: 'Duelo 2', tipo: 'letras', preguntas: [
      { q: 'La estatua de este famoso navegante, situada al final de las Ramblas de Barcelona, dicen que señala a las Indias.', r: 'CRISTÓBAL COLÓN', pista: 'C____Ó_A_ C_LÓ_' },
      { q: "¿Qué cantante de soul ganó cinco Grammys por su disco 'Back to Black'?", r: 'AMY WINEHOUSE', pista: '_M_ W___H__SE' },
      { q: "Viento del oeste que comparte nombre con un continente de 'Juego de tronos'.", r: 'PONIENTE', pista: '_O__E_T_' },
      { q: "La palabra alemana usada para referirse al 'jefe de Gobierno' se adaptó al femenino con la llegada al poder de esta política.", r: 'ANGELA MERKEL', pista: '_NG__A __RK_L' },
      { q: '¿De qué estado fue gobernador Jimmy Carter antes de convertirse en presidente de los EEUU?', r: 'GEORGIA', pista: '_E_R_I_' } ] },
    { nombre: 'Canciones con huecos', tipo: 'letras', preguntas: [
      { q: 'El pintalabios, toque de rímel, moldeador como una artista de cine. Peluquería, _____ _________ y maquillaje, ¡qué belleza al instante!', r: 'CREMA HIDRATANTE', pista: 'CR_M_ H_DR__A_T_' },
      { q: 'Duele tanto verte, duele no tenerte. Duele y se me cae __ _____ cuando te veo.', r: 'EL MUNDO', pista: 'E_ M_ND_' },
      { q: "Una, na, na, dos ya no son 'too much'. Sola, la, la, _______ si no estás. Las chicas buenas se prestan la ropa.", r: 'BAILARÉ', pista: '_A_L_R_' } ] },
    { nombre: 'Juego final', tipo: 'letras', tiempo: 30, elige: false, final: true, preguntas: [
      { q: '¿Qué embutido lleva la receta tradicional de las migas extremeñas?', r: 'CHORIZO', pista: '_H__IZ_', quien: 'iker' },
      { q: "'Mano cerrada' que da nombre a una parte de un calcetín.", r: 'PUÑO', pista: 'P_Ñ_', quien: 'iker' },
      { q: '¿Con qué nombre conocemos al jugador de baloncesto Rodolfo Fernández?', r: 'RUDY', pista: 'R___', quien: 'iker' },
      { q: '¿Cómo qué construcción fortificada se llama el edificio que albergó la primera sede del servicio meteorológico español?', r: 'EL CASTILLO', pista: '_L _A_T_LL_', quien: 'iker' } ] },
  ]
});
