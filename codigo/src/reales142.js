// ===================================================================================================
// v1.42 · PROGRAMAS REALES (Opciones › «📼 Programas reales», los 5 en «No» por defecto).
// Cada uno es una recreación JUGABLE del programa real de Antena 3 que bajó Iker: Iker es el CONCURSANTE CENTRAL.
// Mismas pruebas en el mismo orden, mismas preguntas y respuestas (sacadas del vídeo, rótulo a rótulo), mismos
// premios de las trampillas, mismo presentador con sus frases reales y su cara real (fotos y clips del programa).
// Iker elige a qué oponente reta; si el oponente falla o se planta, ¡cae por la trampilla! Si falla Iker, cae Iker.
// Datos en reales142_datos.js (R142). localStorage 'ac_real142_<id>' = '1' | '0' (sin valor = No).
// ===================================================================================================
const R142 = { css: false };
const r142On = id => { try { return localStorage.getItem('ac_real142_' + id) === '1'; } catch (e) { return false; } };
const r142Norm = s => (s || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-ZÑ0-9]/g, '');
function r142Snd(n) { try { F.play(n); } catch (e) { } }
function r142Css() { if (R142.css) return; R142.css = true; const s = document.createElement('style'); s.textContent = `
#r142{position:fixed;inset:0;z-index:9999;background:#000 center/cover no-repeat;color:#fff;font-family:Arial,Helvetica,sans-serif;overflow:hidden;user-select:none}
#r142 .top{position:absolute;top:6px;left:8px;right:8px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;text-shadow:0 2px 4px #000}
#r142 .logoR{height:46px}
#r142 .pres{position:absolute;bottom:30%;left:2%;height:58%;max-width:38%;object-fit:cover;border-radius:14px;box-shadow:0 0 22px #000}
#r142 .bocad{position:absolute;bottom:31%;left:40%;right:3%;background:#fffe;color:#012;padding:10px 14px;border-radius:16px;font-size:clamp(14px,2.6vw,22px)}
#r142 .bocad b{color:#0a3a9a}
#r142 .band{position:absolute;left:0;right:0;bottom:0;min-height:30%;background:linear-gradient(#0a2a9acc,#04126ef0);border-top:3px solid #6cf;padding:8px 3% 10px;text-align:center}
#r142 .q{font-size:clamp(15px,3vw,26px);margin:4px 0 8px;text-shadow:0 2px 3px #000}
#r142 .ops{display:flex;gap:2%;justify-content:center}
#r142 .op{flex:1;max-width:30%;padding:10px 4px;font-weight:bold;font-size:clamp(13px,2.4vw,20px);color:#fff;background:linear-gradient(#3b8cff,#0b3fc4);border:2px solid #9cf;border-radius:4px;transform:skewX(-8deg)}
#r142 .op.v{background:linear-gradient(#8ef03a,#2f9a0c)} #r142 .op.r{background:linear-gradient(#ff5a4a,#b00d0d)}
#r142 .tiles{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:6px 0}
#r142 .tile{width:clamp(20px,4.2vw,36px);height:clamp(26px,5.4vw,46px);background:linear-gradient(#fff,#cfd8e6);color:#0a1a5a;font-weight:bold;font-size:clamp(16px,3.4vw,30px);display:flex;align-items:center;justify-content:center;border-radius:3px}
#r142 .tile.sp{background:none;width:12px}
#r142 input{font-size:20px;padding:8px 12px;border-radius:10px;border:2px solid #6cf;width:60%;text-transform:uppercase}
#r142 .btn{display:inline-block;margin:6px;padding:10px 18px;border-radius:12px;border:2px solid #ffd54a;background:#1a3fb8;color:#fff;font-weight:bold;font-size:18px}
#r142 .clk{display:inline-block;background:#111;color:#ffd54a;border:2px solid #f90;border-radius:8px;padding:2px 10px;font:bold 22px monospace;margin:0 8px}
#r142 .ring{position:absolute;top:12%;left:3%;right:3%;bottom:34%;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-content:center}
#r142 .opo{width:17%;min-width:96px;padding:8px;background:#0b1a5acc;border:2px solid #6cf;border-radius:50%/30%;text-align:center;font-weight:bold}
#r142 .opo .pz{color:#ffd54a;font-size:13px} #r142 .opo.out{opacity:.25;border-color:#555} #r142 .opo.real{box-shadow:0 0 14px #ffd54a}
#r142 video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}
#r142 .skip{position:absolute;top:8px;right:8px;z-index:3}
#r142 .cae{animation:r142cae 1.2s ease-in forwards}@keyframes r142cae{to{transform:translateY(120%) scale(.6);opacity:0}}
`; document.head.appendChild(s); }
function r142El(h) { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; }
function r142Wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function r142Click(el) { return new Promise(r => el.addEventListener('click', e => { e.stopPropagation(); r(e); }, { once: true })); }
class R142Juego {
  constructor(p) { this.p = p; this.bote = 0; r142Css(); this.root = r142El('<div id="r142"></div>'); document.body.appendChild(this.root); this.root.style.backgroundImage = `url(${p.dir}/plato.jpg)`; }
  limpiar() { this.root.innerHTML = ''; }
  top() { this.root.appendChild(r142El(`<div class="top"><span>📼 ${this.p.titulo} · ${this.p.fecha}</span><span>💰 ${this.bote.toLocaleString('es-ES')} €</span><button class="btn" id="r142x">✖ Salir</button></div>`)).querySelector('#r142x').onclick = e => { e.stopPropagation(); this.salir(); }; }
  salir() { this.fuera = true; try { this.root.remove(); } catch (e) { } try { Lt('play'); } catch (e) { } }
  async video(src, txt) { if (this.fuera) return; this.limpiar(); const v = document.createElement('video'); v.src = src; v.playsInline = true; v.autoplay = true; this.root.appendChild(v);
    const s = r142El(`<button class="btn skip">Saltar ⏭</button>`); this.root.appendChild(s);
    await new Promise(r => { v.onended = r; v.onerror = r; s.onclick = e => { e.stopPropagation(); r(); }; v.play().catch(() => { }); }); v.pause(); }
  async habla(frase, img, audio, ms, quien) { if (this.fuera) return; this.limpiar(); this.top();
    this.root.appendChild(r142El(`<img class="pres" src="${this.p.dir}/${img || this.p.fotos[0]}">`));
    const b = this.root.appendChild(r142El(`<div class="bocad">${quien === false ? '' : '<b>' + (typeof quien === 'string' ? quien : this.p.presentador) + ':</b> '}${frase}<br><button class="btn">Seguir ▶</button></div>`));
    let au = null; if (audio) { au = new Audio(`${this.p.dir}/${audio}`); au.play().catch(() => { }); }
    await Promise.race([r142Click(b.querySelector('.btn')), ...(ms ? [r142Wait(ms)] : [])]); if (au) au.pause(); }
  foto(i) { const f = this.p.fotos; return f[i % f.length]; }
  async elegir(ronda) { // Iker elige a qué oponente reta
    this.limpiar(); this.top();
    const ring = this.root.appendChild(r142El('<div class="ring"></div>'));
    this.root.appendChild(r142El(`<div class="band"><div class="q">${ronda.nombre}: elige a qué oponente quieres retar (el dorado es el que eligió el concursante en el programa)</div></div>`));
    return new Promise(res => this.opos.forEach((o, i) => { const d = r142El(`<div class="opo${o.fuera ? ' out' : ''}${ronda.rival === o.n ? ' real' : ''}">${o.n}<div class="pz">${typeof o.premio === 'number' ? o.premio.toLocaleString('es-ES') + ' €' : o.premio}</div></div>`);
      if (!o.fuera) d.onclick = e => { e.stopPropagation(); r142Snd('Tecla'); res(o); }; ring.appendChild(d); }));
  }
  pintaPregunta(q, ronda, quien, reloj) {
    this.limpiar(); this.top();
    this.root.appendChild(r142El(`<img class="pres" src="${this.p.dir}/${this.foto(q.i || 0)}">`));
    const band = this.root.appendChild(r142El(`<div class="band"><div><span>${quien}</span><span class="clk" id="clk">${reloj.toFixed(2).replace('.', ':')}</span></div><div class="q">${q.q}</div></div>`));
    return band;
  }
  // devuelve true si acierta quien juega
  async pregunta(q, ronda, quien, esIker) {
    const T = ronda.tiempo || 5; let t = T; const band = this.pintaPregunta(q, ronda, quien, t);
    let fin, done = new Promise(r => fin = r), tick;
    const empieza = () => { const t0 = performance.now(); tick = setInterval(() => { t = Math.max(0, T - (performance.now() - t0) / 1000); const c = band.querySelector('#clk'); if (c) c.textContent = t.toFixed(2).replace('.', ':'); if (t <= 0) fin(null); }, 50); };
    if (ronda.tipo === 'opciones') {
      const ops = band.appendChild(r142El('<div class="ops"></div>'));
      const bs = (q.ops || ronda.opciones).map((o, k) => { const b = r142El(`<div class="op">${o}</div>`); ops.appendChild(b); if (esIker) b.onclick = e => { e.stopPropagation(); fin(k); }; return b; });
      empieza(); let r = esIker ? await done : (await r142Wait(1200 + Math.random() * 1500), q.falloRival ? (q.ok + 1) % bs.length : q.ok);
      clearInterval(tick); const ok = r === q.ok; if (r !== null && !ok) bs[r].classList.add('r'); bs[q.ok].classList.add('v');
      r142Snd(ok ? 'QuemFicaEmPé-Acerto' : 'Erro'); await r142Wait(1400); return ok;
    }
    // letras (rótulo con huecos) o anagrama (letras desordenadas)
    const sol = q.r, pista = ronda.tipo === 'anagrama' ? q.letras : (q.pista || sol.replace(/[^ ]/g, '_'));
    const tiles = band.appendChild(r142El('<div class="tiles"></div>'));
    const pinta = s => { tiles.innerHTML = ''; for (const ch of s) tiles.appendChild(r142El(ch === ' ' ? '<div class="tile sp"></div>' : `<div class="tile">${ch === '_' ? '' : ch}</div>`)); };
    pinta(pista);
    let res;
    if (esIker) { const f = band.appendChild(r142El('<div><input id="r142in" autocomplete="off" placeholder="Escribe tu respuesta"><button class="btn" id="r142ok">OK</button></div>'));
      const inp = f.querySelector('#r142in'); inp.focus(); inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') fin(inp.value); };
      f.querySelector('#r142ok').onclick = e => { e.stopPropagation(); fin(inp.value); }; f.onclick = e => e.stopPropagation(); empieza(); res = await done;
    } else { empieza(); await r142Wait(1500 + Math.random() * 1500); res = q.falloRival ? '' : sol; }
    clearInterval(tick); const ok = res !== null && r142Norm(res) === r142Norm(sol); pinta(sol);
    r142Snd(ok ? 'QuemFicaEmPé-Acerto' : 'Erro'); await r142Wait(1600); return ok;
  }
  async duelo(ronda, rival) {
    r142Snd('AhoraCaigo - ComeceDuelo.mp3');
    if (ronda.frase) await this.habla(ronda.frase, this.foto(1), ronda.audio, 0, ronda.fraseQuien);
    const qs = ronda.preguntas; let turno = 0;
    for (let k = 0; k < qs.length && !this.fuera; k++) {
      const q = { ...qs[k], i: k }; const iker = q.quien ? q.quien === 'iker' : (turno++ % 2) === 0;
      const ok = await this.pregunta(q, ronda, iker ? '🧑 Iker' : '🎯 ' + rival.n, iker);
      if (!iker && (!ok || q.planta)) return 'gana';
      if (iker && !ok) return 'pierde';
    }
    return 'gana'; // si se acaban las preguntas del programa sin fallo, el rival se planta
  }
  async cae(nombre) { if (this.fuera) return; this.limpiar(); this.top(); const d = this.root.appendChild(r142El(`<div class="ring"><div class="opo cae" style="width:40%;font-size:26px">${nombre}<div class="pz">¡Ahora caigo!</div></div></div>`)); r142Snd('DropM.mp3'); await r142Wait(1500); }
  async jugar() {
    const p = this.p; this.opos = p.oponentes.map(o => ({ ...o }));
    if (p.cabecera) await this.video(`${p.dir}/${p.cabecera}`);
    for (const f of p.saludo || []) { if (this.fuera) return; await this.habla(f.t, f.img, f.audio, 0, f.quien); }
    for (const ronda of p.rondas) {
      if (this.fuera) return;
      if (ronda.cortinilla) await this.video(`${p.dir}/${ronda.cortinilla}`);
      let rival = this.opos.find(o => o.n === ronda.rival && !o.fuera);
      if (ronda.elige !== false) rival = await this.elegir(ronda);
      rival = rival || this.opos.find(o => !o.fuera) || { n: 'Oponente', premio: 0 };
      if (ronda.final && typeof pe144 === 'function') { const w = await pe144(p.id, { premio: 'si aciertas, +1.000 € para el bote' }); if (w) this.bote += 1000; }
      const r = await this.duelo(ronda, rival); if (this.fuera) return;
      if (r === 'gana' && ronda.final) { this.bote += ronda.premio || 0; continue; }
      if (r === 'gana') { rival.fuera = true; await this.cae(rival.n); if (typeof rival.premio === 'number') this.bote += rival.premio; else if (rival.premio === 'doble') this.bote *= 2; else if (rival.premio === 'mitad') this.bote = Math.round(this.bote / 2);
        await this.habla((ronda.fraseGana || '🎉 ¡{r} cae por la trampilla! Ganas su premio.').replace('{n}', 'Iker').replace('{r}', rival.n), this.foto(2), null, 0, ronda.fraseGana ? undefined : false);
      } else { await this.cae('Iker'); await this.habla(p.frasePierde || '😮 ¡Has caído por la trampilla!', this.foto(3), null, 0, p.frasePierde ? undefined : false); return this.fin(false); }
    }
    return this.fin(true);
  }
  async fin(gana) { if (this.fuera) return;
    await this.habla(gana ? `🏆 ¡Has superado el programa! Te llevas ${this.bote.toLocaleString('es-ES')} €.` : `Te vas con 0 €.`, this.foto(0), null, 0, false);
    for (const f of this.p.despedida || []) await this.habla(f.t, f.img, f.audio, 0, f.quien);
    if (this.p.creditos) await this.video(`${this.p.dir}/${this.p.creditos}`);
    this.salir(); }
}
function r142Abrir(id) { const p = R142_DATOS.find(x => x.id === id); if (!p) return; try { F.play('Tecla'); } catch (e) { } const g = new R142Juego(p); window.__r142juego = g; g.jugar(); }
function filaReales142() {
  const box = document.createElement('div'); box.id = 'optReales142box';
  const h = document.createElement('p'); h.className = 'mtext'; h.textContent = '📼 Programas reales (Iker es el concursante central; mismas pruebas, preguntas y premios que el programa de verdad). Todos en No por defecto.'; box.appendChild(h);
  for (const p of R142_DATOS) {
    const row = document.createElement('div'); row.className = 'orow'; row.id = 'optReal142_' + p.id;
    const lb = document.createElement('label'); lb.textContent = '📼 ' + p.titulo + ' (' + p.fecha + ')'; row.appendChild(lb);
    for (const [v, t] of [['1', 'Sí'], ['0', 'No']]) { const b = document.createElement('button'); b.className = 'tbtn' + ((r142On(p.id) ? '1' : '0') === v ? ' sel' : ''); b.textContent = t;
      b.onclick = ev => { ev.stopPropagation(); r142Snd('Tecla'); localStorage.setItem('ac_real142_' + p.id, v); row.querySelectorAll('.tbtn').forEach(x => x.classList.toggle('sel', x === b)); }; row.appendChild(b); }
    box.appendChild(row); }
  return box; }
{ const lt0 = Lt; Lt = function (a, ...r) { const x = lt0.call(this, a, ...r);
  try { const m = document.getElementById('menu');
    if (a === 'options' && m && !m.querySelector('#optReales142box')) { const ref = m.querySelector('#optMoneda141box') || m.querySelector('h2'); const w = filaReales142(); if (ref && ref.parentNode) ref.parentNode.insertBefore(w, ref.nextSibling); else m.appendChild(w); }
    if (a === 'play' && m) { const col = m.querySelector('.col'); for (const p of R142_DATOS) if (r142On(p.id) && col) col.insertBefore(ei('📼 ' + p.titulo, 'Programa real del ' + p.fecha + ' con ' + p.presentador + ': juegas tú en el centro', 'gold', () => r142Abrir(p.id)), col.children[1] || null); }
  } catch (e) { console.warn('reales142', e); } return x; }; }
window.__r142 = { abrir: r142Abrir, menu: a => Lt(a), datos: () => R142_DATOS, set: (id, v) => localStorage.setItem('ac_real142_' + id, v ? '1' : '0') };
