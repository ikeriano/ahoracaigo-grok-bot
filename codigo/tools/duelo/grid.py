import sys, subprocess
from PIL import Image, ImageDraw, ImageFont
bs = [0.35, 1.25, 2.25, 3.15, 3.95, 4.45]; W, H = 640, 360
out = sys.argv[1] if len(sys.argv) > 1 else '/workspace/ac_duelo/comparacion.png'
G = Image.new('RGB', (W * 2 + 30, (H + 30) * len(bs) + 40), (18, 18, 28)); d = ImageDraw.Draw(G)
try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except Exception: f = None
d.text((20, 10), 'Original (vídeo)', fill=(255, 220, 80), font=f); d.text((W + 40, 10), 'Recreación 3D (juego)', fill=(120, 230, 255), font=f)
for i, b in enumerate(bs):
    v = b + 0.65
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '%.2f' % v, '-i', '/workspace/ac_duelo/cabecera_duelo_final.mp4', '-frames:v', '1', '-vf', 'scale=%d:%d' % (W, H), '/tmp/o.png'], check=True)
    y = 40 + i * (H + 30)
    G.paste(Image.open('/tmp/o.png'), (10, y)); G.paste(Image.open('/workspace/ac_duelo/render/r_%s.png' % b).convert('RGB').resize((W, H)), (W + 20, y))
    d.text((14, y + H + 4), 'vídeo %.2f s  ·  cabecera %.2f s' % (v, b), fill=(220, 220, 220), font=f)
G.save(out); print(out)
