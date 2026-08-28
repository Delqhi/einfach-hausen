import { spawn, spawnSync } from "node:child_process";
import { request } from "node:http";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
const root=process.cwd();
const db=path.join(fs.mkdtempSync(path.join(os.tmpdir(),"eh-auth-e2e-")),"test.db");
const port=await new Promise((resolve,reject)=>{const s=createServer();s.listen(0,"127.0.0.1",()=>{const p=s.address().port;s.close(()=>resolve(p));});s.on("error",reject);});
const env={...process.env,NODE_ENV:"production",DATABASE_PATH:db,NEXT_PUBLIC_APP_URL:`http://127.0.0.1:${port}`};
for(const k of Object.keys(env))if(/SUPABASE|STRIPE|API_KEY|TOKEN/i.test(k))delete env[k];
const child=spawn(process.execPath,[path.join(root,"node_modules/next/dist/bin/next"),"start","-H","127.0.0.1","-p",String(port)],{cwd:root,env,stdio:["ignore","pipe","pipe"]});
const get=(url,headers={})=>new Promise((resolve,reject)=>{const r=request(`http://127.0.0.1:${port}${url}`,{headers},res=>{res.resume();resolve(res);});r.on("error",reject);r.end();});
try{for(let i=0;i<80;i++){try{const r=await get("/api/health");if(r.statusCode<500)break;}catch{}await new Promise(r=>setTimeout(r,250));}
for(const route of ["/app","/pro"]){const r=await get(route);if(r.statusCode!==307&&r.statusCode!==308)throw Error(`${route} expected redirect, got ${r.statusCode}`);if(!String(r.headers.location).startsWith("/login"))throw Error(`${route} redirected to ${r.headers.location}`);}
const authSource=fs.readFileSync(path.join(root,"src/lib/auth.ts"),"utf8");if(!authSource.includes("mode === 'local' && process.env.NODE_ENV === 'production'"))throw Error("production local mode guard missing");console.log("PASS T-0170 production unauthenticated routes + local fail-closed");}finally{child.kill("SIGTERM");}
