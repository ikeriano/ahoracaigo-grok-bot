// v1.28 · BUZZ, presentador del Modo Fiesta: recortable 2.5D hecho con la imagen de referencia que mandó Iker
// (assets/buzz/buzz.png) + la mandíbula en otra capa para que hable. Siempre mira a cámara, se balancea y presume.
// Dos planos con textura: lo más ligero posible para el Redmi A2.
function buzzFig() {
  const T = _E, root = new T.Group(), H = 2.05, W = H * 285 / 540, L = new T.TextureLoader();
  const tex = L.load(Us + 'assets/buzz/buzz.png'), tj = L.load(Us + 'assets/buzz/mandibula.png');
  for (const t of [tex, tj]) { t.colorSpace = T.SRGBColorSpace; t.anisotropy = 1; }
  const piv = new T.Group(); root.add(piv);
  const cuerpo = new T.Mesh(new T.PlaneGeometry(W, H), new T.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.05, depthWrite: false })); cuerpo.position.y = H / 2; piv.add(cuerpo);
  const px = W / 285, jw = 98 * px, jh = 80 * px; // mandíbula: recorte (92,128)-(190,208) de la imagen
  const jaw = new T.Mesh(new T.PlaneGeometry(jw, jh), new T.MeshBasicMaterial({ map: tj, transparent: true, depthWrite: false })); jaw.position.set(-W / 2 + (92 + 49) * px, H - (128 + 40) * px, 0.005); piv.add(jaw);
  const jy = jaw.position.y, head = new T.Object3D(); head.position.set(-W / 2 + 140 * px, H - 100 * px, 0); piv.add(head);
  const sombra = new T.Mesh(new T.CircleGeometry(0.32, 20), new T.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.35, depthWrite: false })); sombra.rotation.x = -Math.PI / 2; sombra.position.set(-0.05, 0.01, 0.05); sombra.scale.x = 1.4; root.add(sombra);
  cuerpo.renderOrder = 1; jaw.renderOrder = 2;
  let modo = 'senala';
  const anim = (t, cam) => {
    if (cam) { const d = cam.position.clone().sub(root.getWorldPosition(new T.Vector3())); root.rotation.y = Math.atan2(d.x, d.z) - (root.parent ? 0 : 0); }
    const habla = modo === 'habla' || modo === 'risa', ab = habla ? Math.abs(Math.sin(t * (modo === 'risa' ? 18 : 13))) : 0;
    jaw.position.y = jy - ab * 0.035; jaw.scale.y = 1 + ab * 0.12;
    piv.position.y = Math.abs(Math.sin(t * (modo === 'risa' ? 6 : 2.2))) * (modo === 'risa' ? 0.05 : 0.025);
    piv.rotation.z = Math.sin(t * 1.4) * 0.03 + (modo === 'risa' ? Math.sin(t * 9) * 0.04 : 0);
    const s = modo === 'pulsa' ? 1 + Math.abs(Math.sin(t * 10)) * 0.03 : 1; piv.scale.set(s, 2 - s, 1);
  };
  return { root, head, anim, set modo(v) { modo = v; }, get modo() { return modo; }, dispose() { root.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.map && o.material.map.dispose(); o.material.dispose(); } }); } };
}
