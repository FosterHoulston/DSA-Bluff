import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,award} from '../engine.js';
import {puzzles} from '../puzzles.js';
function setup(n=3){let now=0;const g=new Game({now:()=>now,phaseMs:100});const {room:r,player:h}=g.create('Host',1);for(let i=1;i<n;i++)g.join(r.code,'Player '+i);g.start(r,h);now+=30000;g.tick(r);return {g,r,h,advance:n=>now+=n};}
const bluffer=r=>r.players.find(p=>p.id===r.bluffer);
const solvers=r=>r.players.filter(p=>p.id!==r.bluffer);
const wrong=r=>r.bluffOptions.find(id=>id!==r.q.correct);
test('2–8 players complete equal rotations with exact scores',()=>{for(let n=2;n<=8;n++){const {g,r,h,advance}=setup(n),turns={};for(let round=0;round<n;round++){if(r.phase==='read'){advance(30000);g.tick(r);}const b=bluffer(r);turns[b.id]=(turns[b.id]??0)+1;const trap=wrong(r);g.choose(r,b,trap);assert.equal(new Set(r.solverOptions).size,4);assert.ok(r.solverOptions.includes(trap));assert.ok(r.solverOptions.includes(r.q.correct));const ss=solvers(r);for(let i=0;i<ss.length;i++)g.choose(r,ss[i],i===0?trap:r.q.correct);assert.equal(r.phase,'reveal');assert.equal(r.delta[b.id],award(1,n-1));assert.equal(r.delta[ss[0].id],-1);for(const p of ss.slice(1))assert.equal(r.delta[p.id],2);g.next(r,h);}assert.equal(r.phase,'finished');assert.deepEqual(Object.values(turns),Array(n).fill(1));for(const p of r.players)g.replay(r,p);assert.equal(r.phase,'lobby');g.start(r,h);assert.ok(r.players.every(p=>p.score===0));}});
test('correct Bluffer selection costs exactly one and never earns',()=>{const {g,r}=setup();const b=bluffer(r);g.choose(r,b,r.q.correct);for(const s of solvers(r))g.choose(r,s,r.q.correct);assert.equal(r.delta[b.id],-1);assert.equal(r.fooled,0);});
test('timeouts advance both phases and score missing answers once',()=>{const {g,r,advance}=setup();advance(101);g.tick(r);assert.equal(r.phase,'solve');advance(101);g.tick(r);assert.equal(r.phase,'reveal');assert.ok(Object.values(r.delta).every(n=>n===-1));const scores=r.players.map(p=>p.score);g.tick(r);assert.deepEqual(r.players.map(p=>p.score),scores);});
test('other wrong choices do not earn bluff points',()=>{const {g,r}=setup();const b=bluffer(r);g.choose(r,b,wrong(r));const other=r.solverOptions.find(id=>id!==r.bluff&&id!==r.q.correct);for(const s of solvers(r))g.choose(r,s,other);assert.equal(r.delta[b.id],0);});
test('answers, bluff selection and opponent votes stay hidden until reveal',()=>{const {g,r}=setup();const b=bluffer(r),s=solvers(r)[0];const before=g.view(r,s);assert.deepEqual(before.options,[]);assert.equal(before.puzzle.correct,undefined);g.choose(r,b,wrong(r));g.choose(r,s,r.q.correct);const hidden=g.view(r,solvers(r)[1]);for(const k of ['correct','bluff','failed','votes','delta','explanation'])assert.equal(hidden[k],undefined);assert.ok(hidden.options.every(o=>!('why' in o)));assert.equal(hidden.submitted,false);});
test('role restrictions, answer locking, authentication and room limits',()=>{const {g,r}=setup();assert.throws(()=>g.join(r.code,'Late'));assert.throws(()=>g.choose(r,solvers(r)[0],r.bluffOptions[0]));g.choose(r,bluffer(r),wrong(r));assert.throws(()=>g.choose(r,bluffer(r),r.solverOptions[0]));const s=solvers(r)[0];g.choose(r,s,r.q.correct);assert.throws(()=>g.choose(r,s,r.q.correct));assert.throws(()=>g.auth(r,'wrong-token'));const game=new Game();const {room}=game.create('A');for(let i=1;i<8;i++)game.join(room.code,''+i);assert.throws(()=>game.join(room.code,'9'));});
test('eight-player rounded rewards match the rules',()=>{assert.deepEqual(Array.from({length:8},(_,i)=>award(i,7)),[0,1,1,2,2,3,3,3]);});
test('all puzzles contain distinct complete bundles for 1–4 blanks',()=>{assert.equal(puzzles.length,16);for(const p of puzzles){const n=p.options[0].values.length;assert.ok(n>=1&&n<=4);assert.equal(new Set(p.options.map(o=>o.id)).size,p.options.length);assert.equal(new Set(p.options.map(o=>JSON.stringify(o.values))).size,p.options.length);for(const o of p.options)assert.equal(o.values.length,n);for(let j=1;j<=n;j++)assert.ok(p.code.includes('{{'+j+'}}'));assert.equal(p.options.filter(o=>o.id===p.correct).length,1);}});

test('shared reading hides code and choices from both roles and lasts 30 seconds',()=>{
 let now=0;const g=new Game({now:()=>now});const {room:r,player:h}=g.create('Host');g.join(r.code,'Other');g.start(r,h);
 assert.equal(r.rotations,1);assert.equal(r.totalRounds,2);assert.equal(r.phase,'read');assert.equal(r.deadline,30000);
 for(const p of r.players){const v=g.view(r,p);assert.equal(v.puzzle.code,undefined);assert.deepEqual(v.options,[]);assert.throws(()=>g.choose(r,p,r.bluffOptions[0]));}
 now=29999;g.tick(r);assert.equal(r.phase,'read');now=30000;g.tick(r);assert.equal(r.phase,'bluff');
 const duration=r.q.options[0].values.length<=2?90000:120000;assert.equal(r.deadline,now+duration);
 for(const p of r.players)assert.ok(g.view(r,p).puzzle.code);
 assert.equal(g.view(r,solvers(r)[0]).options.length,0);
 now+=1000;g.choose(r,bluffer(r),wrong(r));assert.equal(r.deadline,now+duration);
});
test('both decision durations and untimed practice transitions',()=>{
 const g=new Game();for(const q of puzzles)assert.equal(g.duration(q),q.options[0].values.length<=2?90000:120000);
 const {room:r,player:h}=g.create('Host',2,'Mixed',true);g.join(r.code,'Other');g.start(r,h);assert.equal(r.totalRounds,4);assert.equal(r.deadline,null);
 assert.throws(()=>g.next(r,r.players[1]));g.next(r,h);assert.equal(r.phase,'bluff');assert.equal(r.deadline,null);
 g.choose(r,bluffer(r),wrong(r));assert.equal(r.phase,'solve');assert.equal(r.deadline,null);assert.equal(g.tick(r),false);
 g.choose(r,solvers(r)[0],r.q.correct);assert.equal(r.phase,'reveal');g.next(r,h);assert.equal(r.phase,'read');assert.equal(r.deadline,null);
});

function finishGame(n=3){const x=setup(n);const {g,r,h,advance}=x;while(r.phase!=='finished'){if(r.phase==='read'){advance(30000);g.tick(r);}g.choose(r,bluffer(r),wrong(r));for(const p of solvers(r))g.choose(r,p,r.q.correct);g.next(r,h);}return x;}
test('players return individually, results remain immutable, restart waits for everyone',()=>{
 const {g,r,h}=finishGame();const other=r.players.find(p=>p.id!==h.id),snapshot=structuredClone(r.lastResults);
 g.replay(r,other);assert.equal(g.view(r,other).phase,'lobby');assert.equal(g.view(r,h).phase,'finished');assert.equal(g.view(r,other).canStart,false);
 g.replay(r,h);assert.throws(()=>g.start(r,h));assert.throws(()=>g.start(r,other));
 g.replay(r,r.players.find(p=>!p.returned));assert.equal(g.view(r,h).canStart,true);g.start(r,h);assert.equal(r.round,0);assert.equal(r.phase,'read');assert.ok(r.players.every(p=>p.score===0));assert.deepEqual(r.lastResults,snapshot);
});
test('leaving results transfers host, retains historical scores and releases restart gate',()=>{
 const {g,r,h}=finishGame(2),other=r.players.find(p=>p.id!==h.id),snapshot=structuredClone(r.lastResults);
 g.replay(r,other);g.leave(r,h);assert.equal(r.host,other.id);assert.equal(r.phase,'lobby');assert.equal(g.view(r,other).canStart,false);assert.deepEqual(r.lastResults,snapshot);assert.throws(()=>g.auth(r,h.token));
 g.join(r.code,'New player');assert.equal(g.view(r,other).canStart,true);g.leave(r,other);g.leave(r,r.players[0]);assert.throws(()=>g.get(r.code));
});
test('returning early is forbidden and joining a finished room does not erase results',()=>{
 const active=setup();assert.throws(()=>active.g.replay(active.r,active.h));assert.throws(()=>active.g.leave(active.r,active.h));
 const {g,r}=finishGame(2);const p=g.join(r.code,'New player');assert.equal(g.view(r,p).phase,'lobby');assert.equal(g.view(r,p).canStart,false);assert.equal(r.lastResults.length,2);
});

test('lobby kicks require the host, reject self/missing targets, and revoke old sessions',()=>{
 const g=new Game(),{room:r,player:h}=g.create('Host'),p=g.join(r.code,'Guest');
 assert.throws(()=>g.kick(r,p,h.id),/Only the host/);
 assert.throws(()=>g.kick(r,h,h.id),/Leave room/);
 assert.throws(()=>g.kick(r,h,'missing'),/no longer/);
 assert.equal(r.players.length,2);assert.equal(g.kick(r,h,p.id),p);
 assert.equal(r.players.length,1);assert.equal(r.host,h.id);assert.equal(g.view(r,h).canStart,false);
 assert.throws(()=>g.auth(r,p.token),e=>e.code==='PLAYER_REMOVED');
 assert.throws(()=>g.kick(r,h,p.id),/no longer/);
 const again=g.join(r.code,'Guest');assert.notEqual(again.token,p.token);assert.equal(g.auth(r,again.token),again);
});
test('kicking is blocked in every active phase, including final-round reveal',()=>{
 const {g,r,h,advance}=setup(2),p=r.players.find(p=>p.id!==h.id);
 const reject=()=>{const before=structuredClone(r);assert.throws(()=>g.kick(r,h,p.id),/before or after/);assert.deepEqual(r,before);};
 reject();g.choose(r,bluffer(r),wrong(r));reject();for(const s of solvers(r))g.choose(r,s,r.q.correct);reject();
 g.next(r,h);reject();advance(30000);g.tick(r);g.choose(r,bluffer(r),wrong(r));for(const s of solvers(r))g.choose(r,s,r.q.correct);reject();
 g.next(r,h);g.kick(r,h,p.id);assert.equal(r.players.length,1);
});
test('post-game kicks preserve standings and unblock a returned host',()=>{
 const {g,r,h}=finishGame(3),others=r.players.filter(p=>p.id!==h.id),results=structuredClone(r.lastResults);
 g.replay(r,h);g.replay(r,others[0]);assert.equal(g.view(r,h).phase,'lobby');assert.equal(g.view(r,h).canStart,false);
 g.kick(r,h,others[1].id);assert.equal(r.phase,'lobby');assert.equal(g.view(r,h).canStart,true);assert.deepEqual(r.lastResults,results);
 g.kick(r,h,others[0].id);assert.equal(g.view(r,h).canStart,false);assert.deepEqual(r.lastResults,results);
});
