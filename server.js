import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Game} from './engine.js';
const game=new Game();const streams=new Map();
const publish=room=>{for(const c of streams.get(room.code)??[])c.res.write(`data: ${JSON.stringify(game.view(room,c.player))}\n\n`);};
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
async function body(req){let text='';for await(const c of req){text+=c;if(text.length>4096)throw Error('Request too large.');}return JSON.parse(text||'{}');}
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');const path=url.pathname;
 if(req.method==='GET'&&path==='/api/events'){
  const r=game.get(url.searchParams.get('code')),p=game.auth(r,url.searchParams.get('token'));game.tick(r);
  res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write(`data: ${JSON.stringify(game.view(r,p))}\n\n`);
  const client={player:p,res};if(!streams.has(r.code))streams.set(r.code,new Set());streams.get(r.code).add(client);
  req.on('close',()=>streams.get(r.code)?.delete(client));return;
 }
 if(req.method==='POST'&&path.startsWith('/api/')){
  if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==`https://${req.headers.host}`)return json(res,403,{error:'Cross-origin requests are not allowed.'});
  const b=await body(req);let r,p;
  if(path==='/api/create'){({room:r,player:p}=game.create(b.name,b.rotations,b.topic));}
  else if(path==='/api/join'){r=game.get(b.code);p=game.join(r.code,b.name);}
  else {r=game.get(b.code);p=game.auth(r,b.token);if(game.tick(r))publish(r);
   if(path==='/api/state'){}else if(path==='/api/start')game.start(r,p);else if(path==='/api/choose')game.choose(r,p,b.option);else if(path==='/api/next')game.next(r,p);else if(path==='/api/replay')game.replay(r,p);else throw Error('Unknown action.');
  }
  publish(r);return json(res,200,{code:r.code,token:p.token,state:game.view(r,p)});
 }
 if(req.method==='GET'&&path==='/api/health')return json(res,200,{ok:true});
 const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/rules':'rules.md'};
 if(req.method!=='GET'||!files[path])return json(res,404,{error:'Not found.'});
 const data=await readFile(new URL('./public/'+files[path],import.meta.url));
 res.writeHead(200,{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path==='/rules'?'text/plain; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(data);
 }catch(e){if(!res.headersSent)json(res,400,{error:e.message});else res.end();}});
setInterval(()=>{for(const r of game.rooms.values())if(game.tick(r))publish(r);},200).unref();
setInterval(()=>{for(const clients of streams.values())for(const c of clients)c.res.write(': heartbeat\n\n');},15000).unref();
// Rooms are intentionally ephemeral in this local prototype.
setInterval(()=>{for(const [code,r] of game.rooms)if(Date.now()-r.updated>24*3600*1000){for(const c of streams.get(code)??[])c.res.end();streams.delete(code);game.rooms.delete(code);}},3600000).unref();
const portArg=process.argv.indexOf('--port');const port=Number(portArg>=0?process.argv[portArg+1]:process.env.PORT||3000);server.listen(port,'0.0.0.0',()=>console.log(`DSA Bluff ready: http://localhost:${port}`));
