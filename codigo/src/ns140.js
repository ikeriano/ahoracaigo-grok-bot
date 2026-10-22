// ===================================================================================================
// v1.40 · Normas sorpresa (motor ns/ns.js + catálogo ns/cat.js + adaptador ns/ac.js, cargados en index.html)
// Enganches del código fuente: aquí la moneda y la fila de Opciones; el resto, en src/app.js (buscar «NSAC»).
// Con «🎲 Normas sorpresa: No» no se activa ninguna norma y el juego es el de siempre.
// ===================================================================================================
async function nsMoneda(a, e, t, n) {
  self.NSAC && NSAC.antes(t);
  const r = await ay(a, e, t, n);
  try { self.NSAC && NSAC.despues(t, e, r); } catch (x) { }
  return r;
}
function nsFilaOpc() {
  if (!self.NS || !self.NS.fila) return [];
  const f = self.NS.fila('orow', 'tbtn'), p = document.createElement('p');
  p.className = 'mtext'; p.textContent = '🎲 Normas sorpresa: si dices «Sí», Adrián sortea 10 normas al empezar cada partida (nunca dos iguales ni que se contradigan) y te las anuncia; puedes saltar el anuncio. Durante la partida, el botón «🎲 10 normas» te las recuerda.';
  return [f, p];
}
