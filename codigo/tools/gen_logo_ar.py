# NOTA: logo_ar.png actual = recorte limpio (sin marca de agua, reescalado) de argentina_ref/logo_ar.jpg; este script queda como alternativa sintetica.
# Recrea el logo de ¡AHORA CAIGO! Argentina (dibujado desde cero, sin píxeles de la captura): fondo celeste,
# esfera azul oscura con dos suelas amarillas y texto 3D cromado «¡AHORA! ¡CAIGO!». Uso: python3 gen_logo_ar.py salida.png [ancho]
import sys, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
OUT = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 1920; H = W * 9 // 16; S = W / 1920
F = '/usr/share/fonts/truetype/sand-box/google/Archivo Black/ArchivoBlack-Regular.ttf'
def lin(c0, c1, t): return tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))
im = Image.new('RGB', (W, H)); px = im.load()
cx, cy = W * 0.5, H * 0.44
# fondo celeste con remolino suave
bg = Image.new('RGB', (W, H)); d = ImageDraw.Draw(bg)
for y in range(H):
    d.line([(0, y), (W, y)], fill=lin((40, 150, 245), (25, 120, 235), y / H))
sw = Image.new('L', (W, H), 0); ds = ImageDraw.Draw(sw)
for k in range(9):
    r = (300 + k * 120) * S; ds.arc([cx - r * 1.3, cy - r, cx + r * 1.3, cy + r], 200 + k * 7, 320 + k * 5, fill=60, width=int(40 * S))
sw = sw.filter(ImageFilter.GaussianBlur(30 * S)); bg = Image.composite(Image.new('RGB', (W, H), (110, 200, 255)), bg, sw)
im = bg
# esfera azul oscura con borde
R = 400 * S; sph = Image.new('RGBA', (W, H)); g = ImageDraw.Draw(sph)
for k in range(60, 0, -1):
    t = k / 60; r = R * t; c = lin((10, 40, 190), (45, 50, 175), 1 - t)
    g.ellipse([cx - r - (1 - t) * 30 * S, cy - r - (1 - t) * 40 * S, cx + r - (1 - t) * 30 * S, cy + r - (1 - t) * 40 * S], fill=c + (255,))
ring = Image.new('L', (W, H), 0); ImageDraw.Draw(ring).ellipse([cx - R, cy - R, cx + R, cy + R], outline=255, width=int(34 * S))
sph.paste((30, 30, 150, 255), mask=ring)
sh = Image.new('L', (W, H), 0); ImageDraw.Draw(sh).ellipse([cx - R * 1.05, cy - R * 1.02, cx + R * 1.05, cy + R * 1.08], fill=150)
im.paste((5, 30, 110), mask=sh.filter(ImageFilter.GaussianBlur(40 * S)))
mask = Image.new('L', (W, H), 0); ImageDraw.Draw(mask).ellipse([cx - R, cy - R, cx + R, cy + R], fill=255)
im.paste(sph.convert('RGB'), mask=mask)
# dos suelas amarillas (huellas) arriba
def suela(x, y, esp):
    L = Image.new('L', (W, H), 0); q = ImageDraw.Draw(L); w = 70 * S; h = 190 * S
    q.ellipse([x - w / 2, y - h / 2, x + w / 2, y + h * 0.18], fill=255)          # planta
    q.ellipse([x - w * 0.42, y + h * 0.22, x + w * 0.42, y + h / 2], fill=255)  # talón
    q.rectangle([x - w, y + h * 0.12, x + w, y + h * 0.24], fill=0)             # hueco entre planta y talón
    if esp: L = L.transpose(Image.FLIP_LEFT_RIGHT)
    return L
fy = cy - R * 0.42
for x, e in [(cx - 72 * S, False), (W - (cx + 72 * S), True)]:
    m = suela(x, fy, e); im.paste((150, 110, 0), mask=m.filter(ImageFilter.GaussianBlur(3 * S)).point(lambda v: v * 0.8))
    yel = Image.new('RGB', (W, H)); yd = ImageDraw.Draw(yel)
    for yy in range(int(fy - 100 * S), int(fy + 100 * S)): yd.line([(0, yy), (W, yy)], fill=lin((255, 230, 60), (230, 170, 0), (yy - fy + 100 * S) / (200 * S)))
    im.paste(yel, mask=ImageChops.offset(m, int(-3 * S), int(-3 * S)))
# texto cromado 3D
def glifo(txt, size, alto=None, ancho=None):
    fnt = ImageFont.truetype(F, int(size * S)); T = Image.new('L', (W, H), 0); ImageDraw.Draw(T).text((0, 0), txt, font=fnt, fill=255); T = T.crop(T.getbbox())
    return T.resize((int(ancho * S) if ancho else T.width, int(alto * S) if alto else int(T.height * 1.38)), Image.BICUBIC)
def coloca(T, x, y, rot):
    L = Image.new('L', (W, H), 0); L.paste(T, (int(x), int(y))); return L.rotate(rot, center=(W / 2, H / 2), resample=Image.BICUBIC)
# dos líneas SIN signos y solo dos signos altos que abarcan las dos líneas (¡ a la izquierda, ! a la derecha)
A1 = glifo('AHORA', 228); A2 = glifo('CAIGO', 238)
y1 = 375 * S; y2 = 625 * S; xa = W / 2 - A1.width / 2; xc = W / 2 - A2.width / 2 + 12 * S
alto = (y2 + A2.height - y1) / S
ab = glifo('¡', 190, alto=alto, ancho=88); ce = glifo('!', 190, alto=alto, ancho=88)
izq = min(xa, xc) - ab.width - 18 * S; der = max(xa + A1.width, xc + A2.width) + 18 * S
capas = [coloca(A1, xa, y1, 2.5), coloca(A2, xc, y2, 1.2), coloca(ab, izq, y1, 1.8), coloca(ce, der, y1, 1.8)]
for L in capas:
    # sombra
    im.paste((5, 20, 70), mask=ImageChops.offset(L, int(10 * S), int(22 * S)).filter(ImageFilter.GaussianBlur(14 * S)).point(lambda v: v * 0.7))
    # extrusión (gris oscuro → medio)
    for k in range(int(26 * S), 0, -1):
        c = lin((60, 62, 70), (140, 142, 150), 1 - k / (26 * S)); im.paste(c, mask=ImageChops.offset(L, int(k * 0.45), int(k)))
    # cara cromada: degradado vertical metálico con línea de horizonte
    cr = Image.new('RGB', (W, H)); cd = ImageDraw.Draw(cr)
    bb = L.getbbox(); y0, y1 = bb[1], bb[3]
    for yy in range(y0, y1 + 1):
        t = (yy - y0) / max(1, y1 - y0)
        c = lin((250, 252, 255), (190, 195, 205), t / 0.45) if t < 0.45 else lin((120, 125, 135), (235, 238, 245), (t - 0.45) / 0.55)
        cd.line([(0, yy), (W, yy)], fill=c)
    im.paste(cr, mask=L)
    # bisel: borde claro arriba-izquierda, oscuro abajo-derecha
    ed = ImageChops.subtract(L, ImageChops.offset(L, int(3 * S), int(4 * S))); im.paste((255, 255, 255), mask=ed.point(lambda v: v * 0.8))
    ed2 = ImageChops.subtract(L, ImageChops.offset(L, int(-3 * S), int(-4 * S))); im.paste((70, 72, 80), mask=ed2.point(lambda v: v * 0.6))
im.save(OUT); print(OUT, im.size)
