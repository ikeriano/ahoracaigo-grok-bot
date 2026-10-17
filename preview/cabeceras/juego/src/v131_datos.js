// v1.31 · datos: 5 pruebas nuevas, y voces argentinas (originales) de los concursantes y de Tano Ferreyra
const V131 = {
  // EL ROSCO DE LA TRAMPILLA: una definición por letra, de la A a la Z
  rosco: [['A', 'Ave que hace «cua, cua»', 'ANADE'], ['B', 'Vehículo que navega por el mar', 'BARCO'], ['C', 'Animal que da saltos y tiene orejas largas', 'CONEJO'], ['D', 'Lo que tienes en la boca para masticar', 'DIENTE'], ['E', 'Animal grande con trompa', 'ELEFANTE'], ['F', 'Fruta roja y pequeña con semillas por fuera', 'FRESA'], ['G', 'Animal que maúlla', 'GATO'], ['H', 'Agua congelada', 'HIELO'], ['I', 'Tierra rodeada de agua', 'ISLA'], ['J', 'Se usa con agua para lavarse las manos', 'JABON'], ['K', 'Animal de Australia que lleva a su cría en una bolsa', 'KOALA'], ['L', 'Rey de la selva', 'LEON'], ['M', 'Fruta que cayó en la cabeza de Newton', 'MANZANA'], ['N', 'Lo que cae del cielo en invierno y es blanco', 'NIEVE'], ['Ñ', 'Contiene la Ñ: persona de pocos años', 'NIÑO'], ['O', 'Animal grande que hiberna en invierno', 'OSO'], ['P', 'Ave que no vuela y vive en el hielo', 'PINGUINO'], ['Q', 'Se hace con leche y se pone en las pizzas', 'QUESO'], ['R', 'Animal que croa', 'RANA'], ['S', 'Estrella que nos da luz de día', 'SOL'], ['T', 'Animal con caparazón muy lento', 'TORTUGA'], ['U', 'Fruta pequeña que se toma en Nochevieja', 'UVA'], ['V', 'Animal que da leche', 'VACA'], ['X', 'Con la X: instrumento de láminas que se toca con mazas', 'XILOFONO'], ['Y', 'Parte del huevo que es amarilla', 'YEMA'], ['Z', 'Calzado que se pone en los pies', 'ZAPATO']],
  // LA MEMORIA: se ven 4 dibujos un momento y hay que recordar uno
  memoria: [['🐶', 'PERRO'], ['🐱', 'GATO'], ['🍎', 'MANZANA'], ['🚗', 'COCHE'], ['⚽', 'BALON'], ['🌙', 'LUNA'], ['🎸', 'GUITARRA'], ['🐟', 'PEZ'], ['🌳', 'ARBOL'], ['🎈', 'GLOBO'], ['🍌', 'PLATANO'], ['🏠', 'CASA'], ['⭐', 'ESTRELLA'], ['🐸', 'RANA'], ['🚀', 'COHETE'], ['🎩', 'SOMBRERO']],
  // LA INTRUSA: tres palabras, una no pinta nada (la primera es la intrusa)
  intrusa: [['NARANJA', 'PERRO', 'GATO', 'Animales… y una intrusa'], ['MARTES', 'ENERO', 'FEBRERO', 'Meses… y un intruso'], ['ROJO', 'MADRID', 'PARÍS', 'Ciudades… y un intruso'], ['TIGRE', 'MANZANA', 'PERA', 'Frutas… y un intruso'], ['MESA', 'PIANO', 'GUITARRA', 'Instrumentos… y un intruso'], ['LUNES', 'VERANO', 'INVIERNO', 'Estaciones… y un intruso'], ['COCHE', 'MERLUZA', 'SARDINA', 'Peces… y un intruso'], ['ZAPATO', 'NUEVE', 'TRES', 'Números… y un intruso'], ['CUCHARA', 'ÁGUILA', 'GORRIÓN', 'Aves… y una intrusa'], ['LÁPIZ', 'MARTE', 'VENUS', 'Planetas… y un intruso'], ['PELOTA', 'ROSA', 'MARGARITA', 'Flores… y una intrusa'], ['NUBE', 'FÚTBOL', 'TENIS', 'Deportes… y una intrusa']],
  // EL PRECIO DE LA TRAMPILLA: ¿cuesta más o menos de lo que digo? (precios aproximados en euros)
  precio: [['Un café en un bar', 'MENOS DE 5 €', 'MÁS DE 5 €'], ['Un coche nuevo', 'MÁS DE 5.000 €', 'MENOS DE 5.000 €'], ['Una barra de pan', 'MENOS DE 3 €', 'MÁS DE 3 €'], ['Un televisor grande', 'MÁS DE 200 €', 'MENOS DE 200 €'], ['Un chicle', 'MENOS DE 1 €', 'MÁS DE 1 €'], ['Un piso en una gran ciudad', 'MÁS DE 50.000 €', 'MENOS DE 50.000 €'], ['Una entrada de cine', 'MENOS DE 20 €', 'MÁS DE 20 €'], ['Una bicicleta de montaña', 'MÁS DE 100 €', 'MENOS DE 100 €'], ['Un litro de leche', 'MENOS DE 3 €', 'MÁS DE 3 €'], ['Un teléfono móvil nuevo', 'MÁS DE 100 €', 'MENOS DE 100 €'], ['Una pizza grande a domicilio', 'MENOS DE 30 €', 'MÁS DE 30 €'], ['Un billete de avión a Nueva York', 'MÁS DE 200 €', 'MENOS DE 200 €']],
  titulos: { rosco: 'EL ROSCO DE LA TRAMPILLA', memoria: 'LA MEMORIA', intrusa: 'LA INTRUSA', cuentas: 'CUENTAS DE TRAMPILLA', precio: 'EL PRECIO DE LA TRAMPILLA' },
  desc: { rosco: 'Una letra por pregunta, de la A a la Z · cada fallo abre la trampilla', memoria: 'Cuatro dibujos un instante: ¿cuál estaba en tal sitio?', intrusa: 'Tres palabras y una no pinta nada', cuentas: 'Cuentas rápidas: el resultado, en letras', precio: '¿Cuesta más o menos? Precios en euros' },
  dichos: { rosco: '¡El rosco de la trampilla! Una pregunta por cada letra, de la A a la zeta. ¡Y ojo, que cada fallo abre la trampilla!', memoria: '¡La memoria! Mirad bien los cuatro dibujos, porque desaparecen enseguida.', intrusa: '¡La intrusa! Tres palabras, y una no pinta nada. ¡Encontradla!', cuentas: '¡Cuentas de trampilla! Una cuenta rápida, y el resultado se escribe en letras.', precio: '¡El precio de la trampilla! ¿Cuesta más o menos? ¡Que hablamos de euros!' },
};
// voces argentinas ORIGINALES (es_AR-daniela con variaciones; nada clonado) para el modo AHORA CAIGO ARGENTINA
const VOZ131 = [ // [clave, nombre, modelo, voz, velocidad, tono, ecualización]
  ['a0', 'Vos', 'es_AR-daniela-high', null, 0.9, 1.0, 'equalizer=f=2500:t=q:w=1:g=2'],
  ['a1', 'Ceci', 'es_AR-daniela-high', null, 0.85, 1.08, 'equalizer=f=3500:t=q:w=1:g=3'],
  ['a2', 'Nacho', 'es_AR-daniela-high', null, 0.92, 0.8, 'equalizer=f=150:t=q:w=1:g=5'],
  ['a3', 'Flor', 'es_AR-daniela-high', null, 0.8, 1.15, 'equalizer=f=2800:t=q:w=1:g=3'],
  ['a4', 'Lauti', 'es_AR-daniela-high', null, 0.85, 0.84, 'equalizer=f=1200:t=q:w=1:g=3'],
  ['a5', 'Romi', 'es_AR-daniela-high', null, 1.0, 0.97, 'equalizer=f=1300:t=q:w=1:g=5'],
  ['a6', 'Pablito', 'es_AR-daniela-high', null, 0.78, 0.88, 'equalizer=f=3000:t=q:w=1:g=3'],
  ['a7', 'Mili', 'es_AR-daniela-high', null, 0.9, 1.2, 'equalizer=f=4000:t=q:w=1:g=2'],
  ['a8', 'Gonza', 'es_AR-daniela-high', null, 1.0, 0.78, 'equalizer=f=120:t=q:w=1:g=6'],
  ['a9', 'Belu', 'es_AR-daniela-high', null, 1.05, 1.03, 'lowpass=f=5000'],
  ['a10', 'Chino', 'es_AR-daniela-high', null, 0.95, 0.82, 'equalizer=f=900:t=q:w=1:g=4'],
];
const FR131 = {
  saluda: ['¡Hola a todos! ¡Qué emoción!', '¡Che, vengo a ganar!', '¡Un beso a mi vieja que me está mirando!', '¡Buenas noches, Argentina!', '¡Hoy no me caigo, eh!', '¡Vamos todavía!', '¡Saludos a todo el barrio!', '¡Qué nervios, boludo!', '¡Arrancamos!', '¡Estoy re contento de estar acá!', '¡Dale que va!'],
  acierta: ['¡Esa la sabía!', '¡Vamos, carajo!', '¡Tomá!', '¡Re fácil!', '¡Bien ahí!', '¡Ni lo dudé!', '¡Es una masa!', '¡Golazo!', '¡Qué grande!', '¡De una!', '¡Joya!'],
  falla: ['¡No, che!', '¡Uy, la tenía en la punta de la lengua!', '¡Qué bronca!', '¡Me re confundí!', '¡No puede ser!', '¡Ay, qué macana!', '¡Me fui al pasto!', '¡Uh, qué papelón!', '¡Era otra, che!', '¡Mamita!', '¡Qué cagada!'],
  cae: ['¡Che, no me caigo! ¡Aaaah!', '¡Nooo, me caigooo!', '¡Agarrenmé!', '¡Chau a todos!', '¡Socorrooo!', '¡Me voy al sótano!', '¡Pará, pará, pará!', '¡Mamaaaá!', '¡Nos vemos, gente!', '¡Esto no vale!', '¡Uaaaah!'],
  gana: ['¡Gané! ¡No lo puedo creer!', '¡Gracias, gracias a todos!', '¡Esto va para mi familia!', '¡Soy el campeón del mundo!', '¡Qué felicidad, che!', '¡Lo logré!', '¡Vamos, vamos, vamos!', '¡Esto hay que festejarlo!', '¡Me llevo la guita!', '¡Increíble!', '¡Gracias, de verdad!'],
};
// Tano Ferreyra (presentador del modo): voz original es_AR-daniela más grave, con sus reacciones
const TANO131 = { vk: 'tano', cfg: ['es_AR-daniela-high', null, 0.95, 0.8, 'equalizer=f=140:t=q:w=1:g=5,equalizer=f=2500:t=q:w=1:g=2'],
  saluda: ['¡Buenas noches! ¡Bienvenidos a Ahora Caigo Argentina!'], acierta: ['¡Muy bien, eh!', '¡Bárbaro, una masa!', '¡Así se juega, che!'], falla: ['¡Uh, no era esa!', '¡Qué lástima, estaba ahí nomás!', '¡Uy, uy, uy!'], cae: ['¡Y se nos fue! ¡Chau, chau!', '¡Abajo! ¡Qué porrazo!', '¡Se abrió la trampilla, che!'], gana: ['¡Tenemos ganador! ¡Felicitaciones!'], pasa: ['¡Pasapalabra! Después volvés, che.', '¡Pasapalabra! La dejamos para la otra vuelta.'] };
