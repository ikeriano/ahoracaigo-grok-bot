/* Cabecera de inicio 2 (cabecera_inicio_2.mp4, 35,7 s, estilo 2014) recreada en 3D.
   0-2 trampilla metálica que se abre · 2-4,3 túnel rojo con bloques plateados y destello · 4,3-8,4 plató virtual: el logo cae y rebota, el centro se abre y caemos
   8,3-9,5 barrido diagonal del logo · 8,9-17 grúa por el plató · 17-18,2 público · 18,2-23,2 concursantes · 23-24,2 barrido
   23,6-28 Adrián baja corriendo la escalera · 28-30 en el centro con los brazos abiertos · 30-33 grúa · 33-35,7 plano general. */
(function () {
  var CI = window.CI, P = CI.p23, K = CI.k23;
  CI.def[2] = {
    dur: 35.7, estiloCred: 'v2',
    creditos: [[18.2, 'Presenta', 'Adrián Vega'], [19.9, 'Dirección', 'Lucía Marín Toledo'], [21.6, 'Realización', 'Óscar Benavides Ruiz'],
      [24.4, 'Producción ejecutiva', 'Nerea Castell Ibáñez'], [26.2, 'Guion', 'Marcos Lledó y Ana Prieto'], [28.2, 'Dirección de fotografía', 'Iván Salcedo'], [30.2, 'Música', 'Estudio Trampilla']],
    velos: [[-.7, .7, '#000'], [3.95, 4.75, '#fff']],
    barridos: [[8.3, 9.5], [23.0, 24.2]],
    prepara: function (T, eng, CI) {
      return { trampilla: K.trampilla(T, CI, { abre: 1.7 }), tunel: K.tunel(T, CI, { t0: 2.0, flash: 1.5 }), estudio: K.estudio(T, CI, { cae: 4.9, abre: 7.7 }) };
    },
    planos: [
      { t0: 0, t1: 2.0, cg: 'trampilla', cam: function (c, u, t, E, CI) { c.fov = 50; c.updateProjectionMatrix(); c.up.set(Math.sin(u * 1.2), 0, -Math.cos(u * 1.2)); c.position.set(0, CI.lerp(10, -.3, Math.pow(u, 2.4)), .001); c.lookAt(0, -1, 0); } },
      { t0: 2.0, t1: 4.3, cg: 'tunel', cam: function (c, u, t) { c.fov = 62; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.position.set(Math.sin(t * 1.3) * .3, Math.cos(t * 1.1) * .25, 3); c.lookAt(0, 0, -20); c.rotateZ(t * .8); } },
      { t0: 4.3, t1: 7.2, cg: 'estudio', cam: function (c, u, t, E, CI) { c.fov = 50; c.updateProjectionMatrix(); c.up.set(0, 1, 0); c.position.set(CI.lerp(.4, -.2, u), CI.lerp(2.2, 2.6, u), CI.lerp(8.6, 7.6, u)); c.lookAt(0, 2.0, 0); } },
      { t0: 7.2, t1: 8.9, cg: 'estudio', cam: function (c, u, t, E, CI) { var k = CI.suave(u / .55), d = CI.suave((u - .45) / .55); c.fov = 52; c.updateProjectionMatrix(); c.up.set(0, 1, 0);
        c.position.set(0, CI.lerp(2.6, 4.2, k) - d * 3.9, CI.lerp(7.6, 1.2, k) - d * 1.15); c.lookAt(0, CI.lerp(2.0, .5, k) - d * 2, CI.lerp(0, 0, k)); } },
      P.grua(8.9, 12.0, -.6, .4, 11, 10, 7, 6, .5),
      P.grua(12.0, 17.0, .4, 2.0, 9, 6.5, 6, 4.5, .8, .15),
      P.publico(17.0, 18.2, 1.0, 1.35, true),
      P.concursante(18.2, 19.9, 0), P.concursante(19.9, 21.6, 2), P.concursante(21.6, 23.6, 7),
      P.bajaHost(23.6, 28.0),
      P.hostCentro(28.0, 30.0, 'arriba'),
      P.grua(30.0, 33.0, 2.3, 3.4, 8.2, 7.4, 3.2, 2.6, 1.4),
      P.general(33.0, 35.8, 'baila')
    ]
  };
})();
