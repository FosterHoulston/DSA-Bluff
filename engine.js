import { randomInt, randomUUID } from 'node:crypto';
import { puzzles } from './puzzles.js';
export const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=randomInt(i+1); [b[i],b[j]]=[b[j],b[i]];} return b; };
export const award = (fooled,total) => Math.ceil(3*fooled/total);
const fail = message => {throw new Error(message)};
export class Game {
 constructor({now=()=>Date.now(),phaseMs=null}={}) {this.rooms=new Map();this.now=now;this.phaseMs=phaseMs;}
 create(name,rotations=2,topic='Mixed') {
  if(![1,2].includes(rotations)) fail('Choose one or two rotations.');
  if(!['Mixed',...new Set(puzzles.map(p=>p.topic))].includes(topic)) fail('Unknown playlist.');
  let code; do {code=Array.from({length:5},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ'[randomInt(24)]).join('');}while(this.rooms.has(code));
  const room={code,players:[],host:null,phase:'lobby',rotations,topic,round:-1,deadline:null,updated:this.now()};
  this.rooms.set(code,room); const player=this.join(code,name);room.host=player.id;return {room,player};
 }
 join(code,name) {
  const room=this.get(code); if(room.phase!=='lobby')fail('This game has started. Reconnect from your original tab.');
  name=String(name??'').trim();if(!name||name.length>20)fail('Use a name between 1 and 20 characters.');
  if(room.players.length>=8)fail('Room is full.');
  if(room.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))fail('That name is already in the room.');
  const p={id:randomUUID(),token:randomUUID(),name,score:0};room.players.push(p);room.updated=this.now();return p;
 }
 get(code){const r=this.rooms.get(String(code).toUpperCase());if(!r)fail('Room not found. Check the code.');return r;}
 auth(room,token){const p=room.players.find(p=>p.token===token);if(!p)fail('Your session is not in this room.');return p;}
 host(room,p){if(room.host!==p.id)fail('Only the host can do that.');}
 start(room,p){this.host(room,p);if(room.phase!=='lobby')fail('Game already started.');if(room.players.length<2)fail('At least two players are needed.');
  room.order=shuffle(room.players.map(p=>p.id));room.totalRounds=room.players.length*room.rotations;
  const pool=puzzles.filter(p=>room.topic==='Mixed'||p.topic===room.topic);room.deck=[];
  while(room.deck.length<room.totalRounds)room.deck.push(...shuffle(pool));room.deck=room.deck.slice(0,room.totalRounds);this.begin(room);
 }
 duration(q){return this.phaseMs??(q.options[0].values.length<=2?30000:45000);}
 options(q,required=[]){const rest=shuffle(q.options.filter(o=>!required.includes(o.id))).slice(0,4-required.length);return shuffle([...required.map(id=>q.options.find(o=>o.id===id)),...rest]).map(o=>o.id);}
 begin(room){room.round++;room.q=structuredClone(room.deck[room.round]);const ids=new Map(room.q.options.map(o=>[o.id,randomUUID()]));room.q.correct=ids.get(room.q.correct);for(const o of room.q.options)o.id=ids.get(o.id);room.bluffer=room.order[room.round%room.order.length];room.phase='bluff';room.bluff=null;room.failed=false;room.votes={};room.delta={};room.bluffOptions=this.options(room.q,[room.q.correct]);room.solverOptions=[];room.deadline=this.now()+this.duration(room.q);room.updated=this.now();}
 choose(room,p,option){this.tick(room);const q=room.q;
  if(room.phase==='bluff'){
   if(p.id!==room.bluffer)fail('Wait for the Bluffer to choose.');if(!room.bluffOptions.includes(option))fail('Invalid choice.');
   room.bluff=option;room.failed=option===q.correct;this.solve(room);
  }else if(room.phase==='solve'){
   if(p.id===room.bluffer)fail('The Bluffer cannot submit a Solver answer.');if(room.votes[p.id])fail('Your answer is already locked.');if(!room.solverOptions.includes(option))fail('Invalid choice.');
   room.votes[p.id]=option;if(Object.keys(room.votes).length===room.players.length-1)this.reveal(room);
  }else fail('This phase has ended.');room.updated=this.now();
 }
 solve(room){room.phase='solve';room.solverOptions=this.options(room.q,room.failed?[room.q.correct]:[room.q.correct,room.bluff]);room.deadline=this.now()+this.duration(room.q);}
 reveal(room){const q=room.q;let fooled=0;room.delta={};for(const p of room.players){if(p.id!==room.bluffer){const v=room.votes[p.id];room.delta[p.id]=v===q.correct?2:-1;if(v===room.bluff&&!room.failed)fooled++;}}
  room.delta[room.bluffer]=room.failed?-1:award(fooled,room.players.length-1);for(const p of room.players)p.score+=room.delta[p.id];room.fooled=fooled;room.phase='reveal';room.deadline=null;room.updated=this.now();
 }
 tick(room){if(room.deadline!==null&&this.now()>=room.deadline){if(room.phase==='bluff'){room.failed=true;this.solve(room);}else if(room.phase==='solve')this.reveal(room);room.updated=this.now();return true;}return false;}
 next(room,p){this.host(room,p);if(room.phase!=='reveal')fail('Wait for the reveal.');if(room.round+1===room.totalRounds){room.phase='finished';room.updated=this.now();}else this.begin(room);}
 replay(room,p){this.host(room,p);if(room.phase!=='finished')fail('Finish the game first.');room.phase='lobby';room.round=-1;room.deadline=null;for(const p of room.players)p.score=0;room.updated=this.now();}
 view(room,p){const isReveal=['reveal','finished'].includes(room.phase);const q=room.q;
  const v={code:room.code,phase:room.phase,host:room.host,you:p.id,players:room.players.map(({id,name,score})=>({id,name,score})),rotations:room.rotations,topic:room.topic,round:room.round+1,totalRounds:room.totalRounds??0,bluffer:room.bluffer,deadline:room.deadline,serverTime:this.now(),submitted:!!room.votes?.[p.id],answered:Object.keys(room.votes??{}).length};
  if(q&&!['lobby','finished'].includes(room.phase)){v.puzzle={title:q.title,statement:q.statement,topic:q.topic,code:q.code,blanks:q.options[0].values.length};
   const ids=isReveal?room.solverOptions:room.phase==='solve'?room.solverOptions:p.id===room.bluffer?room.bluffOptions:[];
   v.options=ids.map(id=>{const o=q.options.find(o=>o.id===id);return {id:o.id,values:o.values,...(isReveal?{why:o.why}: {})};});
   if(isReveal)Object.assign(v,{correct:q.correct,bluff:room.bluff,failed:room.failed,delta:room.delta,votes:room.votes,fooled:room.fooled,explanation:q.explanation});
  }
  return v;
 }
}
