// v1.29 · frases de BUZZ (originales) con marcas de entonación para su voz Piper:
// [hype] rápido y agudo · [normal] presentador · [solemne] lento y grave · [pausa] silencio de remate · [risa] risita chulesca
// En el bocadillo y en la clave de la voz se quitan las marcas (buzzTexto).
const BUZZ_L = {
  hola: ['[hype]¡Hola, hola, holaaaa! ¡Bienvenidos al Modo Fiesta! [normal]Soy Buzz, el presentador más guapo de la tele. [risa]¡Ah, jaja, sí!',
    '[normal]Hoy repartimos euros… [solemne]y también, [pausa]alguna que otra humillación. [hype]¡Empezamos!'],
  ronda: {
    ordena: '[hype]¡Primera ronda: Ordena la respuesta! [normal]Las letras están revueltas, como vuestro peinado. [solemne]Y el que falle… [pausa][hype]¡tartazo!',
    vot: '[hype]¡Verdadero o Trampilla! [normal]Es muy fácil: si dudáis, [solemne]os caéis. [risa]¡Ah, jaja!',
    borrosa: '[hype]¡La foto borrosa! [normal]Tranquilos, Buzz tampoco ve nada sin gafas. [solemne]Por suerte, [pausa]Buzz lleva gafas.',
    cadena: '[hype]¡Cadena rápida, rapidísima, superrápida! [normal]Cada respuesta empieza por la última letra de la anterior. [hype]¡Que se os ve el humo!',
  },
  bien: ['[hype]¡Correcto! ¡Es faaaantáaaastico! [normal]Casi tan listo como Buzz. [solemne]Casi.',
    '[normal]¡Acierto! [solemne]Y en verdad os digo que esa respuesta ha sido… [pausa][hype]¡bastante decente!',
    '[hype]¡Toma ya, toma ya! ¡Eso son euros, campeón! [risa]¡Ah, jaja, sí!',
    '[normal]¡Bien! [solemne]Hasta un reloj parado acierta dos veces al día.'],
  mal: ['[hype]¡Uy, uy, uy! [normal]Eso ha sido más torpe que un pato en patines. [risa]¡Ah, jaja!',
    '[solemne]Queridos amigos… [pausa]eso ha sido… [pausa][hype]¡horrible!',
    '[normal]¿Has pulsado con el codo? [risa]¡Ah, jaja, sí! [normal]No pasa nada, Buzz te quiere igual. [solemne]Un poquito menos.',
    '[normal]Los rivales no son más que concursantes [solemne]a los que todavía [pausa]no habéis dado pena. [hype]¡Ánimo!'],
  tarta: ['[hype]¡Tartazo! ¡Tartaaaazo! [normal]Te queda mejor que ese peinado. [risa]¡Ah, jaja!',
    '[solemne]Recuerda este momento… [pausa][hype]¡pastel en toda la cara! ¡Y ahora, trampillazo!'],
  lento: '[normal]¿Hola? ¿Hay alguien ahí? [solemne]Se acabó el tiempo… [pausa][hype]¡que esto es una fiesta, despierta!',
  ultimo: '[solemne]Y ahora, el momento más triste de la noche. [pausa]El que menos euros tiene… [pausa][hype]¡se va por la trampilla! ¡Adiós, adiós!',
  gana: ['[hype]¡Tenemos ganador! ¡Es faaaantáaaastico! [normal]Casi te pareces a Buzz… [solemne]en lo de ganar.',
    '[hype]¡Ganador del Modo Fiesta! [solemne]Y en verdad os digo que eres… [pausa][hype]¡un auténtico genio! [risa]¡Ah, jaja, sí!'],
  adios: '[normal]Esto ha sido el Modo Fiesta. [hype]¡Soy Buzz, el mejor presentador del universo! [solemne]Y vosotros… [pausa]bueno, vosotros también habéis venido. [risa]¡Ah, jaja! [hype]¡Hasta la próxima!',
};
const buzzTexto = t => t.replace(/\[(hype|normal|solemne|pausa|risa)\]/g, '').replace(/\s+/g, ' ').trim();
