// ===================================================================================================
// DATOS DE CADA ETAPA DE ¡AHORA CAIGO!  ·  ARCHIVO FÁCIL DE CAMBIAR
// Aquí están la mecánica y las cifras de las monedas de cada etapa. Para cambiar una cifra, edita la lista
// «cifras» de su etapa y vuelve a construir (tools/build.sh). Valores: número (euros), o 'doble', 'mitad', 'cero', 'vida' (y desde la 1.40: 'x5', 'vida2', 'oro', 'final15').
//  · 2011-2021: 10 cifras (una por trampilla; se reparten al azar entre las 10 trampillas en cada programa).
//  · 2021-actual: 20 cifras (huella blanca = las 10 primeras, huella negra = las 10 últimas).
// 2011-2021: las 10 cifras de la pantalla de premios del programa (desde la 1.40: 20.000, 10.000, y dos de 5.000, 2.000, 1.000 y 500 €).
// Los COMODINES (círculos verdes con huellas a la izquierda de la tabla de premios) son «comodines».
// ===================================================================================================
// v1.40 · «🔺 Pirámide» (Opciones, solo etapa 2021+): 'clasica' (POR DEFECTO, la de siempre) o 'nueva'.
const PIR_CLASICA_2021 = ['+1000', '+25000', '+15000', '+1000', '+1', '+5000', '+1000', 'vida', '+5000', '+50000', '+25000', '+1000', '+1000', '+15000', '+15000', 'mitad', '+5000', '+5000', 'doble', 'cero'];
const PIR_NUEVA_2021 = ['+1000', '+25000', '+15000', '+1000', '+1', '+5000', 'final15', 'vida', '+5000', '+50000', '+25000', 'oro', 'vida2', '+15000', '+15000', 'x5', '+5000', '+5000', 'doble', '+100000'];
function pirNueva() { try { return localStorage.getItem('ac_piramide') === 'nueva'; } catch (e) { return false; } }
const ETAPAS_DATOS = {
  '2011': {
    duelos: 10,                 // rivales a los que hay que tirar
    pruebas: ['clasico'],       // solo duelos clásicos
    eleccion: true,             // el central se elige con la tableta
    moneda: 'fija',             // cada trampilla esconde una cifra (no se elige lado)
    plantarse: true,            // tras cada duelo ganado: plantarse con lo ganado o seguir
    final: 'bote',              // si tiras a los 10, te llevas el bote
    bote: 100000,
    comodines: 2,               // PASAR que tiene el central en todo el programa
    relevo: false,              // si pierdes, el oponente NO ocupa tu sitio
    dobladora: false,
    cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 10000, 20000], // v1.40: los dos «1 €» pasan a 10.000 € y 20.000 €
  },
  '2015': {
    duelos: 10,
    pruebas: ['clasico', 'entretres', 'adivina', 'gallina', 'vayalio'],
    eleccion: true, moneda: 'fija', plantarse: true, final: 'bote', bote: 100000,
    comodines: 2,
    relevo: true,               // desde 2015: el oponente que te gana ocupa tu sitio y se queda tu dinero y tu comodín
    dobladora: false,
    cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 10000, 20000], // v1.40: los dos «1 €» pasan a 10.000 € y 20.000 €
  },
  '2017': {
    duelos: 10,
    pruebas: ['clasico', 'entretres', 'adivina', 'gallina', 'vayalio'],
    eleccion: true, moneda: 'fija', plantarse: true, final: 'bote', bote: 100000,
    comodines: 2, relevo: true,
    dobladora: true,            // una trampilla esconde la Gallina Triplicadora (v1.40): triplica tu bote
    cifras: [5000, 5000, 2000, 2000, 1000, 1000, 500, 500, 10000, 20000], // v1.40: los dos «1 €» pasan a 10.000 € y 20.000 €
  },
  '2021': {
    duelos: 8,
    pruebas: null,              // todas las pruebas del APK
    eleccion: true,
    moneda: 'huella',           // al ganar eliges huella blanca o negra
    plantarse: false,           // la decisión llega tras los 8 duelos
    final: 'duelo10',           // Duelo final: 10 preguntas en 2 minutos (dobla o lo pierdes todo)
    comodines: 2, relevo: false, dobladora: false,
    // v1.40: ÷2 → ×5 ('x5'), LO PIERDES TODO → 100.000, y nuevas: 'oro' (Huella de oro: la próxima moneda paga el triple),
    // 'vida2' (doble comodín) y 'final15' (+15 s en el Duelo Final); sustituyen a tres 1.000.
    // La pirámide se elige en Opciones («🔺 Pirámide»): por defecto la CLÁSICA (la de la 1.39); «La nueva» es la de la 1.40.
    get cifras() { return (pirNueva() ? PIR_NUEVA_2021 : PIR_CLASICA_2021).slice(); },
  },
};
