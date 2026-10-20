# v1.43: TODAS las voces con modelos Piper de España (es_ES). Nada de es_MX / es_AR.
# Voces sintéticas originales de Piper (no son clonaciones de nadie). Cada personaje: modelo + tono + velocidad + ecualización propios.
import sys; sys.path.insert(0, '/workspace/ac_141/redub'); from voices import AC as OLD
D, S, CF = 'es_ES-davefx-medium', 'es_ES-sharvard-medium', 'es_ES-carlfm-x_low'  # (mls_9972/mls_10246 probadas: se entienden mal, descartadas)
EQ = lambda f, g: f'equalizer=f={f}:t=q:w=1:g={g}'
def V(model, spk, ls, ns, nw, semi, fx=''): return {'model': model, 'spk': spk, 'ls': ls, 'ns': ns, 'nw': nw, 'semi': semi, 'fx': fx}
AC = {k: v for k, v in OLD.items() if k != 'adrian140'}
AC.update({
 'adrian': V(D, None, 0.92, 0.6, 0.75, 0.0, EQ(3000, 2) + ',acompressor=threshold=-18dB:ratio=3'),  # Adrián: davefx (Castilla), voz clara de presentador
 'marga': V(S, 1, 0.92, 0.62, 0.8, 1.5, EQ(2500, 2)),          # Marga: sharvard mujer, algo más aguda
 'luis': V(CF, None, 0.95, 0.6, 0.75, 0.0, EQ(200, 3)),        # Luis: carlfm (otro hombre de España)
 'rita': V(S, 1, 0.98, 0.62, 0.78, -1.0, EQ(1800, 3)),      # Rita: mls_9972 mujer
 'tano': V(CF, None, 1.0, 0.6, 0.75, -2.5, EQ(200, 3)),       # Tano: mls_10246 hombre grave
 'o2': V(S, 1, 0.9, 0.66, 0.8, 2.0, EQ(3000, 3)),         # Lola (oponente)
 'o3': V(CF, None, 1.02, 0.6, 0.7, -1.5, EQ(300, 3)),          # Ramón
 'o8': V(S, 1, 1.0, 0.6, 0.7, -0.5, EQ(250, 2) + ',lowpass=f=6000'),            # Rocío
 'o10': V(S, 1, 0.9, 0.7, 0.8, 3.0, EQ(4000, 2)),              # Pili
 'toni': V(CF, None, 0.9, 0.65, 0.8, 1.0, EQ(1500, 3)),        # Toni regidor
 'manolo_pub': V(D, None, 0.92, 0.7, 0.8, 2.5, EQ(2500, 3)), # Manolo público
 'jefe': V(D, None, 1.1, 0.5, 0.6, -4.5, EQ(120, 5)),          # «El jefe»
 'nuria': V(S, 1, 0.88, 0.7, 0.8, 4.0, EQ(3500, 2)),       # Nuria maquillaje
})
for k, v in AC.items():
    if isinstance(v, dict) and 'model' in v: assert v['model'].startswith('es_ES'), (k, v['model'])
