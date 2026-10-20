import json,re
F=[(r'Falsó','Falso'),(r'cinguinos','pingüinos'),(r'poro norte','polo norte'),(r'[cv]e[rn][lr]?adero|cerladero|venladero','verdadero'),(r'¡Salsa o verdadero!','Falso o verdadero.'),(r'El Aguaier ve','El agua hierve'),(r'punpo','pulpo'),(r'muy cien labos','murciélagos'),(r'man[ií]ceros|mam[ií]ceros','mamíferos'),(r'murciélavos','murciélagos'),(r'arcoidis|arcoiris','arcoíris'),(r'El héroe pasa','El Ebro pasa'),(r'Un exálogo no tiene','Un hexágono tiene'),(r'para falso','par. Falso'),(r'^el agua','El agua'),(r'^A ver qué sé, guau, guau\.','¿A ver qué es? ¡Guau, guau!'),(r'^La foto borrosa\. Vista, transporte\.','La foto borrosa. Pista: transporte.')]
j=json.load(open('jobs143.json')); a=json.load(open('../asr_unk.json')); n=0
for x in j:
    if x['key'].startswith('q/') and x['text']==a.get(x['key']):
        t=x['text']
        for p,r in F: t=re.sub(p,r,t)
        if t!=x['text']: n+=1
        x['text']=x['say']=t; x['asr_src']=True
json.dump(j,open('jobs143.json','w'),ensure_ascii=False); print('corregidas',n)
