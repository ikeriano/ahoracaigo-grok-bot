// ===================================================================================================
// v1.13 · MÁS ESCENAS para Cámara oculta, Tomas falsas y Fuera de cámaras (mismo formato que extras_datos.js):
// [quién, texto, cámara (host|wide|oppN|holeN|cerca), gesto, efecto (claqueta:N|cae:N|abreVacia:N|trampillaNo:N|tablaFalsa|inocente|corten|tomafalsa|risas|aplauso|ooh|silencio)]
// ===================================================================================================
EX_DATOS.oculta.push(
{ id: "gemelos", titulo: "El concursante con gemelo", pasos: [
 ["adrian", "Recibimos al número dos. ¡Buenas tardes! ¿Qué tal estás?", "opp2", "saluda", ""],
 ["conc", "Muy bien, Adrián. Aunque hace un momento estaba en la trampilla nueve.", "opp2", "", "ooh"],
 ["adrian", "¿Cómo que en la nueve? Si te acabo de ver ahí... y ahí... ¡Sois dos!", "opp9", "lamenta", "risas"],
 ["conc", "¿Dos? Yo solo veo a uno. Bueno, a uno repetido.", "opp9", "", "risas"],
 ["reg", "Adrián, no te preocupes, el número nueve es su hermano gemelo. Se llaman igual.", "wide", "", ""],
 ["adrian", "¿Y cómo sé a quién le hago las preguntas? ¡Me voy a liar con los marcadores!", "host", "encoge", "risas"],
 ["dir", "¡Inocente, inocente! ¡Los hemos vestido iguales para despistarte!", "wide", "", "inocente"],
 ["adrian", "¡Pues lo habéis conseguido! Ya no sé ni cuál es mi trampilla.", "host", "aplaude", "risas"]]},
{ id: "aplausometro", titulo: "El aplausómetro roto", pasos: [
 ["adrian", "¡Vamos a medir el aplauso del público! ¡Fuerte!", "wide", "arriba", "aplauso"],
 ["tec", "Adrián, el aplausómetro marca... cero. Cero coma uno.", "wide", "", "ooh"],
 ["adrian", "¿Cero? ¡Pero si me han dejado sordo! ¡Otra vez, más fuerte!", "host", "senala", "aplauso"],
 ["tec", "Ahora marca menos tres. Creo que el público está aplaudiendo hacia dentro.", "wide", "", "risas"],
 ["adrian", "Aplaudir hacia dentro... Rober, ¿eso se puede hacer?", "host", "encoge", ""],
 ["reg", "¡Inocente, inocente! ¡El aplausómetro lo maneja Rober con un mando!", "wide", "", "inocente"],
 ["adrian", "¡Rober, eres un artista! Pero la próxima vez ponme un diez, por favor.", "host", "aplaude", "risas"]]},
{ id: "presentador_doble", titulo: "El doble de Adrián", pasos: [
 ["adrian", "¡Buenas tardes! Vamos a... Un momento. ¿Quién es ese señor vestido como yo?", "host", "senala", "ooh"],
 ["reg", "Es el presentador de repuesto, Adrián. Por si te caes por una trampilla.", "wide", "", "risas"],
 ["adrian", "¿Presentador de repuesto? ¡Pero si yo nunca me caigo!", "host", "lamenta", ""],
 ["dir", "Por si acaso. Él ya se sabe tus chistes. Bueno, los entiende mejor que tú.", "wide", "", "risas"],
 ["adrian", "¡Eso sí que no! Mis chistes no los entiende nadie. Es parte del encanto.", "host", "habla", "risas"],
 ["dir", "¡Inocente, inocente! ¡Es un actor con peluca! ¡Cámara oculta!", "wide", "", "inocente"],
 ["adrian", "Ya me parecía a mí que yo era más guapo.", "host", "aplaude", "risas"]]},
{ id: "bocadillos", titulo: "Los bocadillos parlantes", pasos: [
 ["adrian", "Antes de empezar, vamos a por un bocadillo del catering.", "host", "habla", ""],
 ["adrian", "¿Qué es este ruido? ¡El bocadillo me ha dicho «hola»!", "host", "lamenta", "ooh"],
 ["tec", "Será el hambre, Adrián. A mí el chorizo me canta jotas todas las tardes.", "wide", "", "risas"],
 ["adrian", "¡Que no, que no! ¡Que ha dicho «hola, Adrián»! ¡Y sabe mi nombre!", "host", "senala", "risas"],
 ["reg", "¡Inocente, inocente! ¡Le habíamos puesto un altavoz dentro del pan!", "wide", "", "inocente"],
 ["adrian", "¡Pues me lo voy a comer igual! Con altavoz y todo.", "host", "aplaude", "risas"]]},
{ id: "huellas_bailan", titulo: "Las huellas que se mueven", pasos: [
 ["adrian", "¡Elige huella! ¿Cuál será? ¿Esta? ¿Esa? ¡Un momento! ¡La huella se ha movido!", "wide", "senala", "ooh"],
 ["conc", "A mí también me ha pasado, Adrián. La mía se ha ido a la trampilla de al lado.", "opp4", "", "risas"],
 ["adrian", "¿Quién ha puesto ruedas a las huellas? ¡Esto no está en el reglamento!", "host", "lamenta", ""],
 ["tec", "Es una huella nueva, Adrián. Modelo deportivo. Corre que se las pela.", "wide", "", "risas"],
 ["dir", "¡Inocente, inocente! ¡Las mueve Toni desde abajo con un imán!", "wide", "", "inocente"],
 ["adrian", "¡Toni, sal de debajo del plató ahora mismo!", "host", "aplaude", "risas"]]},
{ id: "pregunta_imposible", titulo: "La pregunta imposible", pasos: [
 ["adrian", "Pregunta para el número seis: ¿cuántos granos de arena hay en la playa de la Concha?", "opp6", "senala", "ooh"],
 ["conc", "¿Contando los que se lleva la gente en las chanclas?", "opp6", "", "risas"],
 ["adrian", "Eso pone aquí, contando las chanclas. ¿Quién escribe estas preguntas?", "host", "encoge", ""],
 ["reg", "Las ha escrito el jefe. Dice que hoy no quiere que gane nadie.", "wide", "", "risas"],
 ["adrian", "¡Pues que venga él a contar arena! ¡Yo me niego!", "host", "lamenta", ""],
 ["dir", "¡Inocente, inocente! ¡Esa tarjeta era de broma!", "wide", "", "inocente"],
 ["adrian", "Menos mal. Ya me veía yo con un cubo y una pala hasta Navidad.", "host", "aplaude", "risas"]]},
{ id: "lluvia", titulo: "Llueve en el plató", pasos: [
 ["adrian", "¡Bienvenidos a ¡Ahora caigo!... ¿Me ha caído una gota en la cabeza?", "host", "saluda", ""],
 ["tec", "Será el aire acondicionado, Adrián. Hoy está muy emocionado.", "wide", "", "risas"],
 ["adrian", "¡Otra! ¡Y otra! ¡Está lloviendo dentro del plató!", "host", "lamenta", "ooh"],
 ["reg", "¿Quieres un paraguas? Tengo uno con el logo del programa.", "wide", "", "risas"],
 ["adrian", "¡Quiero que deje de llover! ¡Que los concursantes se van a resbalar de la trampilla!", "host", "senala", ""],
 ["dir", "¡Inocente, inocente! ¡Es una regadera colgada del techo!", "wide", "", "inocente"],
 ["adrian", "¡Qué malos sois! Por lo menos me habéis regado el peinado.", "host", "aplaude", "risas"]]},
{ id: "concursante_dormido", titulo: "El concursante dormido", pasos: [
 ["adrian", "Pregunta para el número ocho... ¿Número ocho? ¡Se ha quedado dormido!", "opp8", "senala", "ooh"],
 ["conc", "Zzz... cinco minutitos más, mamá...", "opp8", "", "risas"],
 ["adrian", "¡Que estamos en directo! ¡Despierte, que le abro la trampilla!", "host", "lamenta", "trampillaNo:8"],
 ["conc", "Zzz... ¿ya es la hora del bocadillo?", "opp8", "", "risas"],
 ["reg", "Adrián, dice que ha venido directamente del turno de noche.", "wide", "", ""],
 ["dir", "¡Inocente, inocente! ¡Es un actor y estaba despierto todo el rato!", "wide", "", "inocente"],
 ["adrian", "¡Pues ronca de maravilla! ¡Que le den un premio!", "host", "aplaude", "risas"]]},
{ id: "idioma", titulo: "El concursante que solo habla en inglés", pasos: [
 ["adrian", "¡Buenas tardes, número uno! ¿De dónde nos visitas?", "opp1", "saluda", ""],
 ["conc", "Good afternoon, Adrian! I am very happy to be here!", "opp1", "", "ooh"],
 ["adrian", "Ah... Welcome. Mi inglés es de la academia del barrio. ¿Me entiende?", "host", "encoge", "risas"],
 ["conc", "Of course! Y también hablo español, pero me hacía ilusión verte sufrir.", "opp1", "", "risas"],
 ["reg", "¡Inocente, inocente! ¡Es de Valladolid de toda la vida!", "wide", "", "inocente"],
 ["adrian", "¡Pues tiene un acento de Londres que ya quisiera yo!", "host", "aplaude", "risas"]]},
{ id: "boton_rojo", titulo: "El botón rojo misterioso", pasos: [
 ["adrian", "Rober, ¿para qué sirve este botón rojo tan grande del atril?", "host", "senala", ""],
 ["tec", "¡No lo toques, Adrián! Ese botón abre todas las trampillas a la vez.", "wide", "", "ooh"],
 ["adrian", "¿Todas? ¿Incluida la mía?", "host", "lamenta", "risas"],
 ["tec", "Incluida la tuya. Y la del cámara. Y la de la máquina de café.", "wide", "", "risas"],
 ["adrian", "Pues lo tapo con un pañuelo y aquí no ha pasado nada.", "host", "habla", ""],
 ["dir", "¡Inocente, inocente! ¡El botón solo hace «piii»!", "wide", "", "inocente"],
 ["adrian", "¡Piii! ¡Qué susto me habéis dado! Me quedo el botón de recuerdo.", "host", "aplaude", "risas"]]},
{ id: "jefe_canta", titulo: "El jefe quiere cantar", pasos: [
 ["jefe", "Adrián, he decidido que hoy abro yo el programa. ¡Cantando!", "wide", "", "ooh"],
 ["adrian", "¿Cantando? Jefe, con todo el respeto, el programa es de preguntas.", "host", "encoge", ""],
 ["jefe", "¡La la laaa! ¡Ahora caigooo, ahora caigooo!", "wide", "", "risas"],
 ["adrian", "Muy bonito... Muy... alto. ¿Alguien puede bajar el volumen?", "host", "lamenta", "risas"],
 ["dir", "¡Inocente, inocente! ¡El jefe no ha cantado en su vida!", "wide", "", "inocente"],
 ["jefe", "Y no pienso volver a hacerlo. Pero la cara que has puesto, Adrián, no tiene precio.", "wide", "", "risas"],
 ["adrian", "¡Pues tiene usted futuro en el karaoke, jefe!", "host", "aplaude", "risas"]]},
{ id: "trampilla_parlante", titulo: "La trampilla que habla", pasos: [
 ["adrian", "¡Y el número cinco... ahora cae!", "hole5", "senala", "trampillaNo:5"],
 ["tec", "(voz grave) No pienso abrirme. Hoy estoy de mal humor.", "hole5", "", "ooh"],
 ["adrian", "¿La trampilla... habla? ¡Trampilla, ábrete, por favor!", "host", "lamenta", "risas"],
 ["tec", "(voz grave) Solo me abro si me dices algo bonito.", "hole5", "", "risas"],
 ["adrian", "Eres la trampilla más bonita de todo el plató. Y la más redonda.", "host", "habla", "risas"],
 ["reg", "¡Inocente, inocente! ¡Era Rober con el micrófono escondido!", "wide", "", "inocente"],
 ["adrian", "¡Rober! ¡Ya me había enamorado de la trampilla!", "host", "aplaude", "risas"]]}
);
EX_DATOS.tomas.push(
{ id: "bote_comido", titulo: "El bote de caramelos", pasos: [
 ["adrian", "¡Hoy el bote es de cien mil caramelos! Digo... euros. ¡Euros!", "host", "habla", "claqueta:2"],
 ["adrian", "Es que he desayunado poco. ¿Repetimos?", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Que alguien le traiga una magdalena a Adrián.", "wide", "", "corten"]]},
{ id: "camara_equivocada", titulo: "La cámara equivocada", pasos: [
 ["adrian", "¡Buenas tardes a todos los que nos veis desde casa!", "wide", "saluda", "claqueta:1"],
 ["reg", "Adrián, esa es la cámara de la cafetería. La buena es la otra.", "wide", "", "tomafalsa"],
 ["adrian", "¡Buenas tardes a la cafetería también! ¡Que aproveche!", "host", "aplaude", "risas"],
 ["dir", "¡Corten! Mira a la cámara uno, Adrián. La que tiene la lucecita roja.", "wide", "", "corten"]]},
{ id: "trampilla_eco", titulo: "La trampilla con eco", pasos: [
 ["adrian", "¡Ahora... cae!", "hole3", "senala", "claqueta:3"],
 ["adrian", "Un momento, que la trampilla ha hecho eco: «cae, cae, cae...».", "host", "encoge", "tomafalsa"],
 ["tec", "Es que dentro está el micrófono de repuesto. Perdón.", "wide", "", "risas"],
 ["dir", "¡Corten! Sacad el micro de la trampilla, que se nos cae el sonido.", "wide", "", "corten"]]},
{ id: "risa_contagiosa", titulo: "La risa contagiosa", pasos: [
 ["conc", "Adrián, perdona, es que me da la risa cuando me pongo nervioso. ¡Ji ji ji!", "opp6", "", "claqueta:4"],
 ["adrian", "No pasa nada, no pasa... ¡Ja, ja, ja! ¡Ya me la ha pegado!", "host", "encoge", "risas"],
 ["adrian", "¡Que no puedo parar! ¡Que alguien abra la trampilla, que me caigo de risa!", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Diez minutos de descanso hasta que se os pase.", "wide", "", "corten"]]},
{ id: "telefono", titulo: "El móvil sonando", pasos: [
 ["adrian", "Silencio en el plató... Momento de máxima tensión...", "host", "habla", "claqueta:2"],
 ["adrian", "¿De quién es ese móvil con la canción del verano?", "wide", "senala", "ooh"],
 ["adrian", "¡Uy, es el mío! Es mi madre. Dice que me ha visto mal peinado.", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Adrián, los móviles se dejan en el camerino. Y saluda a tu madre.", "wide", "", "corten"]]},
{ id: "nombres_cambiados", titulo: "Los nombres cambiados", pasos: [
 ["adrian", "¡Vamos con el duelo contra Manolo!", "opp4", "senala", "claqueta:3"],
 ["conc", "Adrián, que yo soy Conchi. Manolo es el del bigote.", "opp4", "", "risas"],
 ["adrian", "Perdona, Conchi. Es que el cartel pone Manolo. ¿Quién ha puesto los carteles?", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Toni, cambia los carteles, que nos los has puesto al revés.", "wide", "", "corten"]]},
{ id: "pregunta_al_reves", titulo: "La tarjeta al revés", pasos: [
 ["adrian", "Pregunta: ¿ojerep lebrá ed sepat sanauc?", "host", "habla", "claqueta:5"],
 ["adrian", "¡Ah, que tengo la tarjeta del revés! Ya decía yo que sonaba a idioma raro.", "host", "encoge", "tomafalsa"],
 ["dir", "¡Corten! Dale la vuelta a la tarjeta. Y a la cabeza, de paso.", "wide", "", "corten"]]},
{ id: "caida_adelantada", titulo: "La trampilla impaciente", pasos: [
 ["adrian", "Recordad: la trampilla solo se abre cuando yo digo...", "host", "habla", "claqueta:1"],
 ["adrian", "¡Pero si todavía no he dicho nada! ¡Se ha caído el número uno él solito!", "hole1", "lamenta", "cae:1"],
 ["tec", "Perdón, Adrián. Se me ha escapado el dedo.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Subid al número uno y le damos una toalla.", "wide", "", "corten"]]},
{ id: "hipo", titulo: "El hipo", pasos: [
 ["adrian", "¡Bienvenidos a... ¡hip!... ¡Ahora... ¡hip!... caigo!", "host", "saluda", "claqueta:3"],
 ["adrian", "¡Hip! Creo que no me voy a... ¡hip!... caer de esta.", "host", "encoge", "tomafalsa"],
 ["reg", "Te traigo un vaso de agua, Adrián. Bebe al revés.", "wide", "", "risas"],
 ["dir", "¡Corten! Toma seis. Y nada de bebidas con gas antes de grabar.", "wide", "", "corten"]]},
{ id: "silla", titulo: "La silla fantasma", pasos: [
 ["adrian", "Me siento un momento mientras pensáis... ¡Aaay!", "host", "lamenta", "claqueta:2"],
 ["adrian", "¡Que no había silla! ¡Que me la habéis quitado!", "host", "encoge", "ooh"],
 ["reg", "En este plató no hay sillas, Adrián. Hay trampillas.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! ¿Estás bien? Pues otra vez, pero sin sentarte.", "wide", "", "corten"]]},
{ id: "despedida_temprana", titulo: "La despedida a destiempo", pasos: [
 ["adrian", "¡Muchas gracias por acompañarnos y hasta mañana!", "host", "saluda", "claqueta:1"],
 ["reg", "Adrián, que el programa acaba de empezar. Ni hemos hecho el primer duelo.", "wide", "", "tomafalsa"],
 ["adrian", "¿Ya? ¡Pues se me ha pasado volando!", "host", "encoge", "risas"],
 ["dir", "¡Corten! Guarda la despedida para el final, por favor.", "wide", "", "corten"]]},
{ id: "moneda_rodando", titulo: "La moneda que se escapa", pasos: [
 ["adrian", "¡Lanzamos la moneda! ¿Cara o cruz?", "host", "arriba", "claqueta:4"],
 ["adrian", "¡Se ha ido rodando por el plató! ¡Que alguien la pare!", "wide", "senala", "ooh"],
 ["reg", "¡Se ha metido por la trampilla siete! Voy a por ella.", "hole7", "", "abreVacia:7"],
 ["dir", "¡Corten! La próxima la lanzas más flojito, Adrián.", "wide", "", "corten"]]},
{ id: "estornudo_publico", titulo: "El estornudo del público", pasos: [
 ["adrian", "Silencio absoluto... la respuesta es...", "host", "habla", "claqueta:2"],
 ["adrian", "¡Jesús! Qué estornudo más grande. ¿Ha sido en la grada?", "wide", "senala", "risas"],
 ["reg", "Ha sido el señor de la tercera fila. Dice que es alérgico a la tensión.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Pañuelos para la grada, por favor.", "wide", "", "corten"]]},
{ id: "guion_mojado", titulo: "El guion mojado", pasos: [
 ["adrian", "Y nuestro siguiente concursante es... ¿«Pepe Agua»? Aquí pone «Pepe Agua».", "host", "habla", "claqueta:3"],
 ["adrian", "¡Ah, no! Que se me ha caído el vaso en el guion. Esto está todo borroso.", "host", "lamenta", "tomafalsa"],
 ["dir", "¡Corten! Que alguien imprima otro guion. Y un vaso con tapa para Adrián.", "wide", "", "corten"]]},
{ id: "baile", titulo: "El baile improvisado", pasos: [
 ["adrian", "¡Música, maestro! ¡Vamos a celebrarlo!", "host", "arriba", "claqueta:5"],
 ["adrian", "Un pasito para aquí, un pasito para allá... ¡Ay, que me he pisado yo solo!", "host", "lamenta", "risas"],
 ["conc", "Adrián, si quieres te doy clases. Soy monitora de zumba.", "opp4", "", "tomafalsa"],
 ["dir", "¡Corten! Aquí se pregunta, no se baila. Bueno... baila un poquito más, que ha quedado gracioso.", "wide", "", "corten"]]},
{ id: "luces", titulo: "Apagón en el plató", pasos: [
 ["adrian", "¡Momento de máxima emoción! ¡Que se apaguen las luces!", "host", "arriba", "claqueta:1"],
 ["adrian", "Hombre, tanto como apagarlas TODAS... ¡No veo ni mi trampilla!", "wide", "lamenta", "ooh"],
 ["tec", "Perdón, he tocado el interruptor general. Enciendo, enciendo.", "wide", "", "tomafalsa"],
 ["dir", "¡Corten! Rober, el general no se toca. Toma dos.", "wide", "", "corten"]]},
{ id: "chiste_malo", titulo: "El chiste que no acaba", pasos: [
 ["adrian", "¿Sabéis aquel que dice que entra una trampilla en un bar? Y le dice el camarero...", "host", "habla", "claqueta:6"],
 ["adrian", "¿Qué le decía el camarero? ¡Se me ha olvidado el final!", "host", "encoge", "tomafalsa"],
 ["reg", "Le decía: «¿Te pongo algo?». Y la trampilla: «No, que luego me caigo».", "wide", "", "risas"],
 ["dir", "¡Corten! El chiste es de Toni. Que lo cuente él la próxima vez.", "wide", "", "corten"]]},
{ id: "puntos_locos", titulo: "El marcador loco", pasos: [
 ["adrian", "¡Has ganado... un millón trescientos mil puntos! Uy, eso es mucho.", "host", "aplaude", "claqueta:2"],
 ["tec", "Perdón, se me ha ido el dedo. Eran mil trescientos.", "wide", "", "tomafalsa"],
 ["conc", "¡No, no! ¡Yo me quedo con el millón!", "opp3", "", "risas"],
 ["dir", "¡Corten! Rober, revisa el marcador. Y quitadle el millón al concursante.", "wide", "", "corten"]]}
);
EX_DATOS.fuera.push(
{ id: "catering", titulo: "La mesa del catering", lugar: "plato", pasos: [
 ["reg", "¡Han llegado los bocadillos! De tortilla, de jamón y de calamares.", "wide", "", ""],
 ["adrian", "Yo quiero uno de cada. Para presentar hay que estar bien alimentado.", "host", "aplaude", ""],
 ["tec", "Adrián, que luego te ríes y se te ve el perejil entre los dientes.", "wide", "", ""],
 ["adrian", "Pues sonrío con la boca cerrada. Como los presentadores serios.", "host", "encoge", ""]]},
{ id: "calentamiento", titulo: "Calentando la voz", lugar: "maquillaje", pasos: [
 ["adrian", "Mi-mi-mi-mi... Ahora caaaigo... Ahoooora caigo...", "cerca", "habla", ""],
 ["maq", "Adrián, cantas peor que el secador de pelo.", "cerca", "", ""],
 ["adrian", "Es mi calentamiento secreto, Nuria. Así la voz sale potente.", "cerca", "encoge", ""],
 ["maq", "Pues cierra los ojos, que te pongo la sombra. Y calla un poquito.", "cerca", "", ""]]},
{ id: "repaso_preguntas", titulo: "Repasando las preguntas", lugar: "control", pasos: [
 ["dir", "Adrián, repasa las preguntas de hoy. Hay una de geografía muy difícil.", "cerca", "", ""],
 ["adrian", "¿Cuál es el río más largo de España? Fácil: el Tajo.", "cerca", "habla", ""],
 ["dir", "Muy bien. ¿Y cómo se pronuncia «Mississippi»?", "cerca", "", ""],
 ["adrian", "Mi-si-si... Lola, pon otra pregunta, que esta me la como.", "cerca", "lamenta", ""],
 ["dir", "Ya está cambiada. Ahora es de comida. Esa sí que te la sabes.", "cerca", "", ""]]},
{ id: "publico_entra", titulo: "Entra el público", lugar: "plato", pasos: [
 ["reg", "¡Atención, que entra el público! Sentaos por filas, sin correr.", "wide", "", ""],
 ["pub", "¡Adrián! ¡Adrián! ¡Una foto!", "wide", "", ""],
 ["adrian", "¡Hola, hola! Fotos al final, que ahora me tienen que poner el micro.", "host", "saluda", ""],
 ["reg", "Y recordad: cuando levante el cartel, aplausos. Cuando lo baje, silencio.", "wide", "", ""],
 ["pub", "¿Y si nos da la risa?", "wide", "", ""],
 ["reg", "Entonces os reís. Pero con ganas, que se oiga en casa.", "wide", "", ""]]},
{ id: "prueba_trampillas", titulo: "La revisión de las trampillas", lugar: "plato", pasos: [
 ["tec", "Revisión diaria de trampillas. Empezamos por la número tres.", "hole3", "", "abreVacia:3"],
 ["reg", "La tres funciona. ¿Y los colchones de abajo?", "wide", "", ""],
 ["tec", "Recién mullidos. Están tan blanditos que el otro día me quedé dormido ahí abajo.", "wide", "", ""],
 ["tec", "Ahora la ocho. Tres, dos, uno...", "hole8", "", "abreVacia:8"],
 ["reg", "Perfecta. Todo listo para que hoy caigan muchos.", "wide", "", ""]]},
{ id: "camerino", titulo: "En el camerino de Adrián", lugar: "maquillaje", pasos: [
 ["maq", "Adrián, ¿cuántas chaquetas iguales tienes en el camerino?", "cerca", "", ""],
 ["adrian", "Catorce. Una para cada día de la semana, y siete de repuesto.", "cerca", "encoge", ""],
 ["maq", "¿De repuesto para qué?", "cerca", "", ""],
 ["adrian", "Por si me caigo por una trampilla. Uno nunca sabe.", "cerca", "habla", ""]]},
{ id: "ensayo_moneda", titulo: "Ensayando la moneda", lugar: "plato", pasos: [
 ["reg", "Ensayamos la moneda. Adrián, la lanzas y miras a la cámara dos.", "wide", "", ""],
 ["adrian", "Lanzo... miro a la dos... ¿Dónde ha caído la moneda?", "host", "arriba", ""],
 ["reg", "Encima de la cámara dos. Bueno, por lo menos has mirado al sitio correcto.", "wide", "", ""],
 ["adrian", "Pues en directo la lanzo más bajito. Prometido.", "host", "encoge", ""]]},
{ id: "jefe_visita", titulo: "Visita del jefe", lugar: "control", pasos: [
 ["jefe", "Lola, ¿qué tal la audiencia de ayer?", "cerca", "", ""],
 ["dir", "Muy bien, jefe. Subimos dos puntos cuando Adrián se tropezó.", "cerca", "", ""],
 ["jefe", "Pues que se tropiece más. Pero sin hacerse daño, ¿eh?", "cerca", "", ""],
 ["adrian", "¡Que os estoy oyendo! Yo no me tropiezo a propósito.", "cerca", "lamenta", ""],
 ["jefe", "Lo sabemos, Adrián. Por eso funciona.", "cerca", "", ""]]},
{ id: "concursantes_nervios", titulo: "Los nervios de los concursantes", lugar: "plato", pasos: [
 ["conc", "Adrián, ¿de verdad abajo hay colchones? ¿Lo has probado tú?", "opp3", "", ""],
 ["adrian", "Yo no, pero Rober duerme ahí la siesta. Dice que es lo más cómodo del edificio.", "host", "habla", ""],
 ["conc", "Me quedo más tranquila. ¿Y si me sé todas las respuestas?", "opp3", "", ""],
 ["adrian", "Entonces el que se pone nervioso soy yo. ¡Suerte!", "host", "aplaude", ""]]},
{ id: "minuto_final", titulo: "Un minuto para el directo", lugar: "control", pasos: [
 ["dir", "¡Un minuto para el directo! Todo el mundo a sus puestos.", "cerca", "", ""],
 ["adrian", "Lola, ¿estoy bien de pelo? ¿Y la corbata?", "cerca", "encoge", ""],
 ["dir", "Estás perfecto. Treinta segundos. ¿Has ido al baño?", "cerca", "", ""],
 ["adrian", "¡Ay, no! ¿Me da tiempo?", "cerca", "lamenta", ""],
 ["dir", "No. Diez, nueve, ocho... ¡A sonreír!", "cerca", "", ""]]},
{ id: "despues", titulo: "Después del programa", lugar: "plato", pasos: [
 ["reg", "¡Y estamos fuera! Buen programa, equipo.", "wide", "", ""],
 ["adrian", "¡Gracias a todos! Hoy han caído un montón. Los colchones van a pedir vacaciones.", "host", "aplaude", ""],
 ["tec", "Yo apago las luces. ¿Alguien se ha dejado algo en el plató?", "wide", "", ""],
 ["adrian", "Mi dignidad, en la trampilla cuatro. Pero ya la recojo mañana.", "host", "encoge", ""]]},
{ id: "sonido", titulo: "La cabina de sonido", lugar: "control", pasos: [
 ["tec", "Adrián, di algo para probar el micro.", "cerca", "", ""],
 ["adrian", "Algo. Algo, algo. ¿Ya?", "cerca", "habla", ""],
 ["tec", "Perfecto. Y ahora el efecto de la trampilla: ¡fiuuu!", "cerca", "", ""],
 ["adrian", "¿Ese ruido lo haces tú con la boca?", "cerca", "encoge", ""],
 ["tec", "Las tardes que falla el ordenador, sí. Nadie lo ha notado nunca.", "cerca", "", ""]]}
);
