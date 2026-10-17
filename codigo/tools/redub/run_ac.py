import json, sys, time
sys.path.insert(0, '/workspace/redub'); import engine
jobs = json.load(open('jobs.json'))
if len(sys.argv) > 1 and sys.argv[1] == 'test':
    import random; random.seed(5); seen = {}; sel = []
    for j in jobs:
        if seen.get(j['who'], 0) < 1: sel.append(j); seen[j['who']] = 1
    jobs = sel
    for j in jobs: j['dst'] = j['dst'].replace('/out/', '/test/')
t = time.time(); res = engine.run(jobs, 7, sys.stdout)
err = [x for x in res if x[2]]; rs = sorted(x[1] for x in res if x[1])
print('hechas', len(res), 'errores', len(err), err[:5], 'ratio min/med/max', rs[0], rs[len(rs)//2], rs[-1], 'seg', round(time.time() - t))
json.dump(res, open('res_test.json' if 'test' in sys.argv else 'res.json', 'w'))
