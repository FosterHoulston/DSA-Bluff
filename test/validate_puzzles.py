"""Execute every curated completion against independent reference functions.
Uses Python 3; no third-party packages. A trace budget detects infinite loops.
"""
import itertools, json, pathlib, sys
puzzles=json.loads((pathlib.Path(__file__).resolve().parents[1]/'puzzles.js').read_text().removeprefix('export const puzzles = ').rstrip().removesuffix(';'))
def arrays(values, length):
 return [list(a) for n in range(length+1) for a in itertools.product(values,repeat=n)]
small=arrays([-1,0,1,2],4)
positive=arrays([0,1,2,3],4)
sorted_arrays=[a for a in small if a==sorted(a)]
refs=[]
def add(params,cases,ref): refs.append((params,cases,ref))
add('nums,target',[(a,t) for a in sorted_arrays if len(set(a))==len(a) for t in range(-2,4)],lambda a,t:a.index(t) if t in a else -1)
add('nums,target',[(a,t) for a in sorted_arrays for t in range(-2,4)],lambda a,t:next((i for i,x in enumerate(a) if x>=t),len(a)))
def pair(a,t):
 return next(([j,i] for i in range(len(a)) for j in range(i) if a[i]+a[j]==t),[])
add('nums,target',[(a,t) for a in small for t in range(-2,5)],pair)
add('nums',[(a,) for a in small],lambda a:len(a)!=len(set(a)))
add('nums,k',[(a,k) for a in small for k in range(-2,4)],lambda a,k:sum(sum(a[i:j])==k for i in range(len(a)) for j in range(i+1,len(a)+1)))
def balanced(s):
 n=0
 for c in s:
  n+=1 if c=='(' else -1
  if n<0:return False
 return n==0
add('text', [(''.join(s),) for n in range(8) for s in itertools.product('()',repeat=n)],balanced)
add('temps',[(a,) for a in positive],lambda a:[next((j-i for j in range(i+1,len(a)) if a[j]>a[i]),0) for i in range(len(a))])
add('nums,target',[(a,t) for a in sorted_arrays for t in range(-2,5)],lambda a,t:bool(pair(a,t)))
add('nums',[(a,) for a in small],lambda a:a[::-1])
add('nums,k',[(a,k) for a in small if a for k in range(1,len(a)+1)],lambda a,k:max(sum(a[i:i+k]) for i in range(len(a)-k+1)))
add('text',[(''.join(s),) for n in range(7) for s in itertools.product('abc',repeat=n)],lambda s:max([0]+[j-i for i in range(len(s)) for j in range(i+1,len(s)+1) if len(set(s[i:j]))==j-i]))
def climb(n):
 return 1 if n<=1 else climb(n-1)+climb(n-2)
add('n',[(n,) for n in range(1,15)],climb)
add('nums',[(a,) for a in small if a],lambda a:max(sum(a[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1)))
def nonadj(a):
 return max(sum(a[i] for i in range(len(a)) if mask>>i&1) for mask in range(1<<len(a)) if not (mask&(mask<<1)))
add('nums',[(a,) for a in positive],nonadj)
add('nums,target',[(a,t) for a in sorted_arrays for t in range(-2,4)],lambda a,t:a.index(t) if t in a else -1)
add('nums',[(a,) for a in arrays([0,1],7)],lambda a:max([0]+[j-i for i in range(len(a)) for j in range(i+1,len(a)+1) if all(a[i:j])]))
count=0
for q,(params,cases,ref) in zip(puzzles,refs):
 for o in q['options']:
  code=q['code']
  for i,v in enumerate(o['values'],1):code=code.replace('{{'+str(i)+'}}',v)
  ns={};exec('def f('+params+'):\n'+'\n'.join('    '+l for l in code.splitlines()),ns)
  mismatch=False
  for args in cases:
   expected=ref(*args);budget=[500]
   def trace(frame,event,arg):
    budget[0]-=1
    if budget[0]<0:raise TimeoutError('loop budget')
    return trace
   try:
    sys.settrace(trace);got=ns['f'](*[x.copy() if isinstance(x,list) else x for x in args])
   except Exception:got=object()
   finally:sys.settrace(None)
   count+=1
   valid=(got==expected)
   if q['title']=='A pair with a target sum' and isinstance(got,list) and len(got)==2:
    a,t=args
    valid=all(isinstance(i,int) and 0<=i<len(a) for i in got) and got[0]!=got[1] and a[got[0]]+a[got[1]]==t
   if not valid:
    mismatch=True
    if o['id']==q['correct']:raise AssertionError((q['title'],args,expected,got))
    break
  if o['id']!=q['correct'] and not mismatch:raise AssertionError('No counterexample: '+q['title']+' '+o['id'])
 print('PASS',q['title'])
print('All 16 official solutions verified; all 64 distractors have counterexamples.',count,'executions')
