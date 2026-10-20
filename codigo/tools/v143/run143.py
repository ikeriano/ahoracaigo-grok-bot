import json,sys,time
sys.path.insert(0,'/workspace/ac_143/redub'); import engine
jobs=json.load(open('jobs143.json'))
t=time.time(); res=engine.run(jobs,3,sys.stdout)
err=[x for x in res if x[2]]; print('hechas',len(res),'errores',len(err),err[:5],'seg',round(time.time()-t),flush=True)
json.dump(res,open('res143.json','w'))
