import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

test('HTTP kick authorization, live eviction, reconnect rejection and new-session rejoin',{timeout:15000},async t=>{
 const child=spawn(process.execPath,['server.js','--port','0'],{cwd:new URL('../',import.meta.url),stdio:['ignore','pipe','pipe']});
 t.after(async()=>{const exited=once(child,'exit');child.kill();await exited;});
 const ready=await new Promise((resolve,reject)=>{let output='';child.once('error',reject);child.once('exit',code=>reject(Error('Server exited: '+code)));child.stdout.on('data',b=>{output+=b;const match=output.match(/http:\/\/localhost:(\d+)/);if(match)resolve('http://127.0.0.1:'+match[1]);});});
 const post=async(action,data)=>{const res=await fetch(ready+'/api/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(3000)});return {status:res.status,body:await res.json()};};
 const host=(await post('create',{name:'Host'})).body;
 const guest=(await post('join',{code:host.code,name:'Guest'})).body;
 const hostSession={code:host.code,token:host.token},guestSession={code:guest.code,token:guest.token};
 const stream=await fetch(ready+'/api/events?'+new URLSearchParams(guestSession),{signal:AbortSignal.timeout(10000)}),reader=stream.body.getReader();
 assert.match(new TextDecoder().decode((await reader.read()).value),/data:/);
 assert.equal((await post('kick',{...guestSession,playerId:host.state.you})).status,400);
 assert.equal((await post('kick',{...hostSession,playerId:host.state.you})).status,400);
 const kicked=await post('kick',{...hostSession,playerId:guest.state.you});assert.equal(kicked.status,200);assert.equal(kicked.body.state.players.length,1);
 let remaining='';for(;;){const {done,value}=await reader.read();if(done)break;remaining+=new TextDecoder().decode(value);}assert.match(remaining,/event: kicked/);
 for(const action of ['state','start','choose','replay','kick']){const denied=await post(action,guestSession);assert.equal(denied.status,403);assert.equal(denied.body.code,'PLAYER_REMOVED');}
 const reconnect=await fetch(ready+'/api/events?'+new URLSearchParams(guestSession),{signal:AbortSignal.timeout(3000)});assert.match(await reconnect.text(),/event: kicked/);
 const again=(await post('join',{code:host.code,name:'Guest'})).body;assert.notEqual(again.token,guest.token);
 await post('start',hostSession);const active=await post('kick',{...hostSession,playerId:again.state.you});assert.equal(active.status,400);assert.match(active.body.error,/before or after/);
});
