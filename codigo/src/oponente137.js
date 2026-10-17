// v1.37 · Modo «Empiezo como oponente»: el jugador empieza en una trampilla y la IA es el concursante central.
// Si la IA le elige y el jugador gana el duelo, la IA cae y el jugador pasa al centro y sigue el programa normal.
const OPO_L = {
  intro: '¡Hoy empiezas como oponente! Estás en una de las diez trampillas. Si el concursante central te elige y le ganas el duelo, pasarás tú al centro.',
  equipo: '¡Aquí están nuestros oponentes! Y uno de ellos eres tú.',
  eligeOtro: 'El concursante central ya ha elegido rival… ¡y no eres tú!',
  fallaOtro: '¡No ha acertado! Atención a la trampilla…',
  eligeTe: '¡Atención! El concursante central te ha elegido a ti. ¡Empieza el duelo!',
  cambio: '¡Ha caído el concursante central! ¡Ahora el centro es tuyo!',
  centro: 'Te quedas con su sitio y con su dinero. ¡A partir de ahora eliges tú a los oponentes!',
  pierdes: '¡Oh, no! Has perdido el duelo y caes por tu trampilla. ¡Inténtalo otra vez!'
};
window.__OPO_L = OPO_L;
function opoTalk(sv, k, ms) { return sv.talk(OPO_L[k], ms || 3200); }
// coloca al jugador en una trampilla y al rival de esa trampilla en el centro
async function opoColoca(sv) {
  const { eng: e, hud: t, s: n } = sv.c;
  const k = window.__opoK || 1 + Math.floor(Math.random() * 10), ia = e.opps[k - 1];
  sv.opoK = k; mec && mec('oponente · trampilla ' + k + ' · central ' + me.rival(k));
  e.walkMode(false);
  e.player.root.visible = true; e.player.root.position.copy(e.studio.holes[k].pos); e.face(e.player, $t(0, 0, 0));
  ia.root.visible = true; ia.root.position.set(0, Ae, 0); e.face(ia, $t(0, 0, 10));
  e.studio.setHoleColor(0, e.theme.accent); e.studio.setHoleColor(k, 16765498); F.play('fairydust');
  try { const h = e.studio.holes[k]; h.label && h.label.visible !== undefined && (sv.opoLbl = h.label.visible, h.label.visible = false); } catch (x) { }
  Ot.opp(e, k, 1.2); He(e.host, 'habla', 3); await opoTalk(sv, 'intro', 8300);
  t.toast('🎯 Tú: trampilla ' + k + ' · En el centro: ' + me.rival(k), 3000);
  Ot.hole(e, 0); He(ia, 'saluda', 1.6); await n.w(1600);
}
// la IA juega sus duelos; devuelve 'win' (el jugador pasa al centro) o 'lose'
async function opoFase(sv) {
  const { eng: e, hud: t, s: n } = sv.c, k = sv.opoK, ia = e.opps[k - 1];
  const nPrev = window.__opoF != null ? window.__opoF : Math.floor(Math.random() * 3);
  sv.used.add(k); sv.placar = 0;
  for (let i = 0; i < nPrev; i++) {
    const libres = []; for (let j = 1; j <= 10; j++) if (!sv.used.has(j)) libres.push(j);
    const j = libres[Math.floor(Math.random() * libres.length)], r = e.opps[j - 1]; sv.used.add(j);
    Ot.hole(e, 0); He(e.host, 'senala', 1.8); He(ia, 'senala', 1.6); await opoTalk(sv, 'eligeOtro', 3600);
    e.studio.setHoleColor(j, e.theme.accent); Ot.opp(e, j, 1); He(r, 'saluda', 1.4); F.playMusic('SuspenseDuelo', true); await n.w(2200);
    t.toast('⚔️ ' + me.rival(k) + ' contra ' + me.rival(j), 2200); await n.w(1400);
    F.stopMusic(); He(e.host, 'habla', 2); await opoTalk(sv, 'fallaOtro', 2600);
    await sv.caida(j, r); sv.placar += [1000, 5000, 15000, 25000][Math.floor(Math.random() * 4)];
    ze.aplauso(2, 0.5); He(ia, 'arriba', 1.6); Ot.hole(e, 0); await n.w(1200);
  }
  // ahora te elige a ti
  F.stopAll(); Ot.hole(e, 0); He(ia, 'senala', 2); He(e.host, 'senala', 2); F.play('SomPalavra@MenuEscolha2'); await n.w(900);
  e.studio.setHoleColor(k, e.theme.accent); Ot.opp(e, k); He(e.player, 'saluda', 1.4); await opoTalk(sv, 'eligeTe', 4900);
  sv.rodadas = 1; await n.w(600);
  F.playMusic('TrilhaCurta@MenuEscolha2'); F.play('AhoraCaigo - ComeceDuelo.mp3'); t.subs('AhoraCaigo - ComeceDuelo.mp3', false);
  e.lights && e.lights.event('duelo'); await n.w(2500); F.playMusic('SuspenseDuelo', true); await n.w(800);
  window.__pruebaActual = 'clasico'; window.__opoDuelo = true; window.__opoDueloK = k; Ot.duel(e, k, 1.2);
  let res; try { res = await Kv(sv, k, 'clasico'); } finally { window.__opoDuelo = false; }
  sv.c.panel.hideAll(500); Pn(-1, false); await n.w(500);
  if (res === 'win') {
    e.lights && e.lights.event('acierto'); F.stopMusic(); F.play('AcerteOuCaia SuspEdit', 1, 'susp'); Ot.hole(e, 0); await n.w(1500);
    await sv.caida(0, ia); F.stopTag('susp'); ia.root.visible = false;
    F.playMusic('TrilhaCurta@Stage'); ze.vitores(3.5); He(e.host, 'aplaude', 2); Ot.opp(e, k); He(e.player, 'arriba', 2); await opoTalk(sv, 'cambio', 4100);
    await n.race(e.walkTo(e.player, $t(0, Ae, 0), 2.4)); e.player.root.position.set(0, Ae, 0); e.face(e.player, $t(0, 0, 10));
    e.studio.setHoleColor(k, 2236962); e.studio.setHoleColor(0, e.theme.accent); F.play('fairydust');
    try { const h = e.studio.holes[k]; h.label && (h.label.visible = false); } catch (x) { }
    sv.placar = Math.max(sv.placar, 1000); Ot.player(e, 1.2); He(e.host, 'habla', 3); await opoTalk(sv, 'centro', 5000);
    t.toast('💰 Te quedas con ' + Uo(sv.placar) + ' €', 2600); await n.w(800);
    return 'win';
  }
  F.stopMusic(); He(e.host, 'lamenta', 2.5); e.lights && e.lights.event('fallo'); await sv.caida(k, e.player);
  await opoTalk(sv, 'pierdes', 5000); sv._plAntes = sv.placar; sv.placar = 0; return 'lose';
}
// durante el duelo del modo oponente el rival (la IA) está en el centro y tú en su trampilla: las cámaras del duelo miran a cada uno en su sitio
{
  const oOpp = Ot.opp, oDuel = Ot.duel;
  Ot.opp = function (a, e, t = 0) {
    if (!window.__opoDuelo || e !== window.__opoDueloK) return oOpp.call(this, a, e, t);
    const n = a.opps[e - 1].root.position.clone(), i = $t(0, 0, 1), o = n.clone().addScaledVector(i, 3.4).add($t(0.8, 0, 0)).setY(n.y + 2.2), r = n.clone().setY(n.y + 0.9);
    t ? a.glide(o, r, t) : a.cut(o, r);
  };
  Ot.duel = function (a, e, t = 0) {
    if (!window.__opoDuelo || e !== window.__opoDueloK) return oDuel.call(this, a, e, t);
    const n = a.player.root.position.clone(), i = a.opps[e - 1].root.position.clone(), s = n.clone().add(i).multiplyScalar(0.5), o = i.clone().sub(n);
    let r = $t(o.z, 0, -o.x).normalize(); r.z < 0 && r.negate();
    const l = Math.max(5.5, o.length() * 1.05), c = s.clone().addScaledVector(r, l).setY(Ae + 3), u = s.clone().setY(Ae + 0.55);
    t ? a.glide(c, u, t) : a.cut(c, u);
  };
}
