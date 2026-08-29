
import fs from 'node:fs'; import net from 'node:net'; import path from 'node:path';
import { spawn } from 'node:child_process';
const repo=path.resolve('/home/ubuntu/einfach-hausen-oci-handoff');
const projectRoot='/tmp/probe-project'; const db='/tmp/probe-app3.sqlite3';
async function freePort(){return await new Promise((res,rej)=>{const s=net.createServer();s.unref();s.on('error',rej);s.listen(0,'127.0.0.1',()=>{const a=s.address();s.close(()=>res(typeof a==='object'?a.port:0))})})}
const port=await freePort(); const base=`http://127.0.0.1:${port}`;
const env={...process.env,DATABASE_PATH:db,ADMIN_PASSWORD:'x',NEXT_PUBLIC_APP_URL:base,NODE_ENV:'production',SESSION_COOKIE_NAME:'probe_s3',E2E_INSECURE_COOKIES:'1'};
const server=spawn(process.execPath,[path.join(repo,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:projectRoot,env,stdio:['ignore','pipe','pipe']});
for(let i=0;i<200;i++){try{const r=await fetch(base+'/',{redirect:'manual'});if(r.status<500)break}catch{}await new Promise(r=>setTimeout(r,250))}
for(const target of ['/register?role=homeowner','/register','/register?role=provider']){
  const r=await fetch(base+target,{redirect:'manual'});
  console.log(target, '->', r.status, r.headers.get('location')||'(no location)');
}
const k=await fetch(base+'/kontakt'); const html=await k.text();
const m=[...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([^<]{0,40})/g)].filter(x=>x[1].startsWith('/')).slice(0,14);
for(const x of m)console.log('A:', x[1], '|', x[2].trim().slice(0,30));
server.kill('SIGTERM');
