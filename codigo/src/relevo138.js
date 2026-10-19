// ===================================================================================================
// RELEVO IA · si cae el concursante central (tú, o tú y tu pareja) el programa NO se acaba:
// el oponente que ha ganado el duelo pasa al centro (lo lleva la máquina), se queda con el dinero acumulado
// (formato normal), sigue con los duelos que quedan y juega el juego final. Tú lo ves desde casa:
// «⏭ Saltar al resultado» o «🏠 Menú». Si también cae el nuevo central, el siguiente ganador ocupa su sitio.
// Vale para todos los modos del plató 3D: Programa completo, especiales, Mi programa, Argentina,
// duelo por parejas y «Empiezo como oponente» (si pierdes como oponente, el central de la máquina sigue).
// ===================================================================================================
const RIA_L = {
  cae: '¡Ha caído el concursante central! Pero el programa no se acaba aquí.',
  caeOtra: '¡También ha caído este concursante central! Y otra vez, el ganador del duelo ocupa su sitio.',
  relevo: 'El oponente que ha ganado el duelo pasa al centro y se queda con todo el dinero acumulado.',
  mira: 'A partir de ahora juega la máquina. Tú puedes seguir el programa desde aquí.',
  opoSigue: 'Pero el programa sigue: el concursante central continúa con sus duelos y tú lo ves desde aquí.',
  bienvenido: '¡Bienvenido al centro! Sigues con los duelos que quedan y, si llegas, juegas el juego final.',
  decideFinal: '¡El concursante central se la juega! ¡Vamos al juego final!',
  decidePlanta: 'El concursante central prefiere plantarse y llevarse la mitad.'
};
const RIA_LAR = {
  cae: '¡Se cayó el concursante central! Pero el programa no termina acá.',
  caeOtra: '¡También se cayó este concursante central! Y otra vez, el ganador del duelo ocupa su lugar.',
  relevo: 'El oponente que ganó el duelo pasa al centro y se queda con toda la plata acumulada.',
  mira: 'Desde ahora juega la máquina. Vos podés seguir el programa desde acá.',
  opoSigue: 'Pero el programa sigue: el concursante central continúa con sus duelos y vos lo mirás desde acá.',
  bienvenido: '¡Bienvenido al centro! Seguís con los duelos que quedan y, si llegás, jugás el juego final.',
  decideFinal: '¡El concursante central va por todo! ¡Vamos al juego final!',
  decidePlanta: 'El concursante central prefiere plantarse y llevarse la mitad de la plata.'
};
const RIA_T = {
  barra: '👀 Juega la máquina', saltar: '⏭ Saltar al resultado', menu: '🏠 Menú', nuevo: '🤖 Nuevo concursante central',
  gana: '🤖 ¡{n} ha ganado {p} puntos!', planta: '🤖 {n} se ha plantado con {p} puntos', cae: '🤖 {n} también ha caído… ¡fin del programa!',
  resumen: 'Duelos que ganaste tú: {g} · Relevos de la máquina: {r} 🤖',
  dueloG: '⚔️ Duelo {k}: {a} gana a {b} ✔', dueloP: '⚔️ Duelo {k}: {b} gana a {a} y pasa al centro',
  aFinal: '🏁 {n} va al juego final', finalG: '🏆 {n} gana el juego final y dobla el marcador', finalP: '💥 {n} cae en el juego final', plantaR: '🛑 {n} se planta y se lleva la mitad',
  bote: '🏆 {n} ha tirado a todos y se lleva el bote', cero: '😬 {n} llega al final con el marcador a cero', decideF: '🤖 {n} decide: ¡al juego final!', decideP: '🤖 {n} decide: plantarse',
  suTurno2: '🤖 {n}: su turno', falla2: '🤖 {n} falla… sigue pensando', sigue2: '🤖 {n} sigue jugando: elige oponente', titulo2: '¡Ha caído el concursante central!',
  continuar2: 'Continuar', elige2: '🤖 {n} pasa al centro y elige oponente', bote2: '🤖 ¡{n} ha tirado a todos! Se lleva el bote: {a}.', planta2: '🤖 {n} se planta con {a}.',
  cae2: '🤖 {n} cae ante {r}. ¡Fin del programa!', resumen2: 'Tú ganaste {k} duelos · Después jugó la máquina ({g} relevos).',
  suTurno: 'SU TURNO', resumenT: '⏭ Resultado del programa', jugar: 'Jugar otra vez', menuB: 'Menú'
};
const riaF = (k, o) => (RIA_T[k] || k).replace(/\{(\w)\}/g, (m, x) => o && o[x] != null ? o[x] : m);
window.__RIA_L = RIA_L; window.__RIA_LAR = RIA_LAR;
const RIA = { sv: null, humano: null, fig: null, nombre: '', relevos: 0, ganadosHumano: 0, enDuelo: false, rival: 0, enFinal: false, forma: 1, barra: null, iv: null, pf0: undefined, ok: false };
window.__RIA = RIA;
const riaOn = () => { try { return localStorage.getItem('ac_relevoIA') !== '0'; } catch (x) { return true; } };
const riaL = k => (Ke.__AR ? RIA_LAR : RIA_L)[k];
const riaZz = ms => new Promise(r => setTimeout(r, ms));
async function riaTalk(sv, k, ms) { await sv.talk(riaL(k), ms || 3400); }
// ---------------- la máquina contesta en el panel (duelo y juego final) ----------------
function riaTeclea(p) {
  const tok = p._riaTok = {}, q = p.q; if (!q) return;
  const fin = RIA.enFinal, pk = Math.max(0.35, Math.min(0.95, (fin ? 0.68 : 0.8) * RIA.forma)), sabe = Math.random() < pk;
  const vivo = () => window.__iaC && p._riaTok === tok && p.active && !!p.resolve && p.q === q;
  try { p.input.blur(); typeof rc !== 'undefined' && rc && rc.hide(); } catch (x) { }
  (async () => {
    const t0 = performance.now();
    while (vivo() && ((window.__lect && window.__lect.leyendo) || (window.__duel && window.__duel.running === false && window.__duel.leyendo)) && performance.now() - t0 < 12000) await riaZz(120);
    if (!vivo()) return;
    if (!sabe) {
      await riaZz(Ui(2400, 5200)); if (!vivo()) return;
      if (p.pasaCb && Math.random() < 0.85) { const cb = p.pasaCb; F.play('Tecla'); cb(); }
      return; // si no pasa, se le acaba el tiempo
    }
    await riaZz(Ui(fin ? 2600 : 2000, fin ? 6200 : 5600) / RIA.forma);
    const res = q.exact || (q.missing || []).join('');
    if (Math.random() < 0.12 && res.length) { // a veces se equivoca primero
      const mal = res.slice(0, -1) + (res.slice(-1) === 'A' ? 'E' : 'A');
      for (let i = 1; i <= mal.length; i++) { if (!vivo()) return; await riaZz(Ui(260, 520)); if (!vivo()) return; F.play('saltar', 0.5); p.renderSlots(mal.slice(0, i)); }
      p.renderSlots(mal, 'bad'); F.play('Erro'); ze.oohSuave(); await riaZz(700); if (!vivo()) return; p.renderSlots('');
    }
    for (let i = 1; i <= res.length; i++) { if (!vivo()) return; await riaZz(Ui(280, 560)); if (!vivo()) return; F.play('saltar', 0.5); p.renderSlots(res.slice(0, i)); }
    if (!vivo()) return; p.renderSlots(res, 'ok'); const r = p.resolve; p.active = false; r && r(true);
  })().catch(() => { });
}
function riaInstala() {
  if (RIA.ok) return; RIA.ok = true;
  // panel: cuando juega la máquina, contesta ella (y no se abre el teclado)
  const oAsk = hu.ask; hu.ask = function () { const pr = oAsk.apply(this, arguments); if (window.__iaC) { try { this.input.readOnly = true; } catch (x) { } riaTeclea(this); } else try { this.input.readOnly = false; } catch (x) { } return pr; };
  const oAP = hu.addPasar; hu.addPasar = function () { if (window.__iaC) return; return oAP.apply(this, arguments); };
  const oFocus = hu.focus; hu.focus = function () { if (window.__iaC) return; return oFocus.apply(this, arguments); };
  // escenario 2D: la máquina elige huella, lado de la moneda y la decisión final
  const oShow = du.show; du.show = function (nm, v, o) {
    const r = oShow.apply(this, arguments);
    if (window.__iaC && o && typeof o.click === 'function') {
      const c = o.click;
      if (/^MenuEscolhaop\d+$/.test(nm)) setTimeout(() => window.__iaC && c(), Ui(1600, 4200));
      else if (/^Moeda[12]$/.test(nm)) setTimeout(() => window.__iaC && c(), Ui(1200, 2600));
      else if (nm === 'BotãoMenu4' && RIA.decFinal === true) setTimeout(() => window.__iaC && c(), 3200);
      else if (nm === 'BotãoMenu3' && RIA.decFinal === false) setTimeout(() => window.__iaC && c(), 3200);
    }
    return r;
  };
}
// ---------------- barra del espectador ----------------
function riaBarra() {
  if (RIA.barra) return;
  const b = document.createElement('div'); b.id = 'riaBarra';
  b.style.cssText = 'position:fixed;right:max(4px, env(safe-area-inset-right));bottom:max(6px, env(safe-area-inset-bottom));z-index:44;display:flex;flex-direction:column;gap:5px;align-items:stretch;width:104px;background:rgba(6,16,60,.82);border:2px solid #ffd23a;border-radius:12px;padding:5px;color:#fff;font:700 11px/1.25 system-ui,sans-serif;pointer-events:auto;text-align:center';
  const t = document.createElement('span'); t.id = 'riaTxt'; t.style.cssText = 'overflow-wrap:anywhere';
  const mk = (txt, fn, gold) => { const x = document.createElement('button'); x.className = 'tbtn' + (gold ? ' gold' : ''); x.style.cssText = 'padding:5px 4px;font-size:12px;margin:0;width:100%;min-width:0;line-height:1.15'; x.textContent = txt; x.addEventListener('pointerdown', e => e.stopPropagation()); x.onclick = e => { e.stopPropagation(); F.play('Tecla'); fn(); }; return x; };
  b.append(t, mk(RIA_T.saltar, riaSaltar, true), mk(RIA_T.menu, () => { riaRestaura(); Cf(); }));
  document.body.appendChild(b); RIA.barra = b;
  const upd = () => { const s = RIA.sv; if (!s) return; t.innerHTML = `${RIA_T.barra}<br>🤖 <b>${za(RIA.nombre)}</b><br>💰 ${Uo(s.placar)}`; };
  upd(); RIA.iv = setInterval(upd, 500);
}
function riaQuitaBarra() { clearInterval(RIA.iv); RIA.iv = null; RIA.barra && RIA.barra.remove(); RIA.barra = null; }
// ---------------- activar / restaurar ----------------
function riaActiva(sv, fig, nombre) {
  riaInstala();
  if (!RIA.humano) { RIA.humano = Xe.player; RIA.pf0 = window.__pruebaForce; RIA.forma = Ui(0.88, 1.12); }
  Xe.player = fig; RIA.fig = fig; RIA.nombre = nombre; RIA.sv = sv; window.__iaC = RIA;
  window.__pruebaForce = 'clasico'; // la máquina juega duelos clásicos (panel de letras con los dos relojes)
  riaBarra(); mec && mec('relevo IA · central ' + nombre);
}
function riaRestaura() {
  if (!RIA.humano && !RIA.sv) return;
  if (RIA.humano) { try { Xe.player = RIA.humano; RIA.humano.root.visible = true; } catch (x) { } }
  window.__pruebaForce = RIA.pf0; RIA.pf0 = undefined; window.__iaC = null;
  try { hu.input.readOnly = false; } catch (x) { }
  RIA.humano = null; RIA.fig = null; RIA.sv = null; RIA.relevos = 0; RIA.enFinal = false; RIA.enDuelo = false; RIA.decFinal = undefined; RIA.saltando = false; riaQuitaBarra();
}
// el oponente que ha ganado el duelo pasa al centro · devuelve true si el programa sigue
async function riaRelevo(sv, c) {
  if (!riaOn()) return false;
  const { eng: e, hud: t, s: n } = sv.c, r = e.opps[c - 1]; if (!r) return false;
  const primera = !RIA.humano;
  if (primera) RIA.ganadosHumano = Math.max(0, sv.rodadas - 1);
  try { typeof PAR !== 'undefined' && PAR.fig && parQuita(); } catch (x) { }
  sv.placar = sv._plAntes != null ? sv._plAntes : sv.placar; sv._plAntes = null; if (sv._vAntes != null) sv.vidas = sv._vAntes, sv._vAntes = null;
  RIA.relevos++; mec && mec('relevo ' + RIA.relevos + ' · gana ' + me.rival(c));
  F.stopAll(); t.hideBubble(); Ot.wide(e, 1); He(e.host, 'lamenta', 2); ze.ooh(0.6);
  await n.w(600); He(e.host, 'habla', 3); await riaTalk(sv, primera ? 'cae' : 'caeOtra', 4200);
  e.studio.setHoleColor(c, e.theme.accent); Ot.opp(e, c, 1); He(r, 'arriba', 2); ze.aplauso(2.6, 0.6); await riaTalk(sv, 'relevo', 4600);
  F.playMusic('TrilhaCurta@Stage');
  e.walkMode(false); r.root.visible = true; await n.race(e.walkTo(r, $t(0, Ae, 0), 2.4)); r.root.position.set(0, Ae, 0); e.face(r, $t(0, 0, 10));
  e.studio.setHoleColor(c, 2236962); e.studio.setHoleColor(0, e.theme.accent); F.play('fairydust'); ze.vitores(3);
  riaActiva(sv, r, me.rival(c));
  Ot.player(e, 1.2); He(e.host, 'aplaude', 2); He(r, 'saluda', 1.6);
  t.toast(`${RIA_T.nuevo}: <b>${RIA.nombre}</b><br>💰 ${Uo(sv.placar)}`, 3600);
  if (primera) { He(e.host, 'habla', 3); await riaTalk(sv, 'mira', 4400); }
  He(e.host, 'senala', 2); await riaTalk(sv, 'bienvenido', 4600); await n.w(500);
  return true;
}
// «Empiezo como oponente»: si pierdes tu duelo, el central de la máquina sigue con el programa
async function riaOpo(sv) {
  if (!riaOn()) return false;
  const { eng: e, hud: t, s: n } = sv.c, k = sv.opoK, ia = e.opps[k - 1]; if (!ia) return false;
  RIA.ganadosHumano = 0; sv.placar = sv._plAntes != null ? sv._plAntes : sv.placar; sv._plAntes = null;
  ia.root.visible = true; ia.root.position.set(0, Ae, 0); e.face(ia, $t(0, 0, 10));
  riaActiva(sv, ia, me.rival(k)); RIA.relevos = 0;
  Ot.player(e, 1.2); He(e.host, 'habla', 3); await riaTalk(sv, 'opoSigue', 5200);
  t.toast(`🤖 ${RIA.nombre} · 💰 ${Uo(sv.placar)}`, 3000); await n.w(400);
  return true;
}
// ---------------- saltar al resultado (simulación rápida de lo que queda) ----------------
function riaSimula(sv) {
  const ET = etapa(), ND = ET.duelos || 8, used = new Set(sv.used), L = []; let nom = RIA.nombre, pl = sv.placar, k0 = sv.rodadas;
  const libres = () => { const a = []; for (let j = 1; j <= 10; j++) used.has(j) || a.push(j); return a; };
  const moneda = () => (pirNueva() ? [1000, 1000, 5000, 5000, 15000, 25000, 50000, 100000] : [1000, 1000, 5000, 5000, 15000, 25000, 50000])[Math.floor(Math.random() * (pirNueva() ? 8 : 7))]; // v1.40: hasta 100.000 con la pirámide nueva
  let desde = k0 + 1; if (RIA.enDuelo && RIA.rival) { const j = RIA.rival; if (Math.random() < 0.68) { L.push(riaF('dueloG', { k: k0, a: nom, b: me.rival(j) })); pl += moneda(); } else { L.push(riaF('dueloP', { k: k0, a: nom, b: me.rival(j) })); nom = me.rival(j); } }
  if (RIA.enFinal) desde = ND + 1;
  for (let k = desde; k <= ND; k++) { const lb = libres(); if (!lb.length) break; const j = lb[Math.floor(Math.random() * lb.length)]; used.add(j); if (Math.random() < 0.68) { L.push(riaF('dueloG', { k, a: nom, b: me.rival(j) })); pl += moneda(); } else { L.push(riaF('dueloP', { k, a: nom, b: me.rival(j) })); nom = me.rival(j); } }
  let res;
  if (ET.final === 'bote') { pl += ET.bote || 0; L.push(riaF('bote', { n: nom })); res = 'ganado'; }
  else if (pl <= 0) { L.push(riaF('cero', { n: nom })); res = 'perdido'; }
  else if (RIA.enFinal || Math.random() < 0.8) { L.push(riaF('aFinal', { n: nom })); if (Math.random() < 0.5) { pl *= 2; L.push(riaF('finalG', { n: nom })); res = 'ganado'; } else { pl = 0; L.push(riaF('finalP', { n: nom })); res = 'perdido'; } }
  else { pl = Math.floor(pl / 2); L.push(riaF('plantaR', { n: nom })); res = 'plantado'; }
  return { L, res, pl, nom };
}
async function riaSaltar() {
  const sv = RIA.sv; if (!sv || RIA.saltando) return; RIA.saltando = true;
  const S = riaSimula(sv), modo = sv.opo ? 'oponente' : 'programa', g = RIA.ganadosHumano, rel = RIA.relevos;
  jt && (jt.alive = false); jt = null; try { Zt.stop(); zn.stop(); } catch (x) { }
  await riaZz(120); riaRestaura();
  try { PANT.mostrar(null); } catch (x) { } try { regidorQuita(); } catch (x) { }
  ly(); const s = new bv(); jt = s; en('menu').classList.add('hidden'); en('topbar').classList.remove('hidden');
  const linea = S.res === 'ganado' ? riaF('gana', { n: S.nom, p: Uo(S.pl) }) : S.res === 'plantado' ? riaF('planta', { n: S.nom, p: Uo(S.pl) }) : riaF('cae', { n: S.nom });
  Xe.lookEvent('outro'); Xe.startOrbit(new P(0, 0, 0), 10.8, 5, 0, 0.08, 1); F.playMusic('Trilha', true, 0.5);
  yn.score(`<b>${RIA_T.resumenT}</b><br>${linea}<br><small>${S.L.join('<br>')}<br>${riaF('resumen', { g, r: rel })}</small>`, true);
  yn.actions([{ label: RIA_T.jugar, cls: 'gold', fn: () => ii(modo) }, { label: RIA_T.menuB, fn: () => Cf() }]);
  try { await s.until(() => false); } catch (x) { }
}
// ---------------- enganches en el programa ----------------
{
  const P_ = sy.prototype;
  const oPerder = P_.perder; P_.perder = async function () { this._plAntes = this.placar; this._vAntes = this.vidas; return oPerder.apply(this, arguments); };
  const oDuelo = P_.duelo; P_.duelo = async function (c) { if (RIA.sv === this) { RIA.enDuelo = true; RIA.rival = c; } try { return await oDuelo.apply(this, arguments); } finally { RIA.enDuelo = false; } };
  const oFinal = P_.juegoFinal; P_.juegoFinal = async function () { if (RIA.sv === this) RIA.enFinal = true; try { return await oFinal.apply(this, arguments); } finally { RIA.enFinal = false; } };
  const oDec = P_.decision; P_.decision = async function () {
    if (RIA.sv !== this) return oDec.apply(this, arguments);
    RIA.decFinal = window.__riaDecision ? window.__riaDecision === 'final' : this.placar < 60000 ? Math.random() < 0.85 : Math.random() < 0.6;
    setTimeout(() => window.__iaC && this.c.hud.toast(riaF(RIA.decFinal ? 'decideF' : 'decideP', { n: RIA.nombre }), 2600), 2600);
    try { const d = await oDec.apply(this, arguments); He(this.c.eng.host, 'habla', 2); await riaTalk(this, d === 'final' ? 'decideFinal' : 'decidePlanta', 3000); return d; } finally { RIA.decFinal = undefined; }
  };
  const oPos = P_.plantarseOSeguir; P_.plantarseOSeguir = async function () {
    if (RIA.sv !== this) return oPos.apply(this, arguments);
    const g = window.__decisionAuto; window.__decisionAuto = Math.random() < 0.1 ? 'plantarse' : 'seguir';
    try { return await oPos.apply(this, arguments); } finally { window.__decisionAuto = g; }
  };
  const oRun = P_.run; P_.run = async function () { riaRestaura(); return oRun.apply(this, arguments); };
  const oFin = P_.fin; P_.fin = async function (e) {
    const R = RIA.sv === this ? { g: RIA.ganadosHumano, r: RIA.relevos, n: RIA.nombre } : null;
    if (R) riaQuitaBarra();
    const o = await oFin.apply(this, arguments);
    if (R && o) o.ria = `<br><small>${riaF('resumen', { g: R.g, r: R.r })}</small>`;
    return o;
  };
}
function riaLinea(e, sv) {
  if (RIA.sv !== sv || !RIA.sv) return null;
  return e === 'ganado' ? riaF('gana', { n: RIA.nombre, p: Uo(sv.placar) }) : e === 'plantado' ? riaF('planta', { n: RIA.nombre, p: Uo(sv.placar) }) : riaF('cae', { n: RIA.nombre });
}
{ const d = Object.getOwnPropertyDescriptor(me, 'tu'); d && d.get && Object.defineProperty(me, 'tu', { configurable: true, enumerable: true, get() { return window.__iaC ? '🤖 ' + window.__iaC.nombre : d.get.call(me); } }); }
// al salir al menú o empezar otro modo, el jugador vuelve a ser el de siempre
Lt = (o => function () { riaRestaura(); return o.apply(this, arguments); })(Lt);
ii = (o => async function () { riaRestaura(); return o.apply(this, arguments); })(ii);
