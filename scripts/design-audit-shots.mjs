import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import Database from 'better-sqlite3';
import { chromium } from 'playwright-core';

const root = process.cwd();
const kongEnv = (() => { const raw = execFileSync('docker', ['inspect','-f','{{range .Config.Env}}{{println .}}{{end}}','supabase-kong'], {encoding:'utf8',stdio:['ignore','pipe','ignore']}); return Object.fromEntries(raw.trim().split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];})); })();
const supabaseUrl='https://supabase.delqhi.com', anonKey=kongEnv.SUPABASE_ANON_KEY, serviceKey=kongEnv.SUPABASE_SERVICE_KEY;
const tmpDir=fs.mkdtempSync(path.join(os.tmpdir(),'eh-appshot-'));
const dbPath=path.join(tmpDir,'app.db');
async function freePort(){return new Promise((res,rej)=>{const s=createServer();s.listen(0,'127.0.0.1',()=>{const a=s.address();s.close(()=>res(a.port));});s.on('error',rej);});}
const port=await freePort();
const child=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:root,env:{...process.env,DATABASE_PATH:dbPath,AUTH_MODE:'supabase',SUPABASE_URL:supabaseUrl,SUPABASE_ANON_KEY:anonKey,SUPABASE_SERVICE_ROLE_KEY:serviceKey,NEXT_PUBLIC_SUPABASE_URL:supabaseUrl,NEXT_PUBLIC_SUPABASE_ANON_KEY:anonKey,NEXT_PUBLIC_APP_URL:`http://127.0.0.1:${port}`,SESSION_COOKIE_NAME:'mh_session_e2e',E2E_INSECURE_COOKIES:'1'},stdio:['ignore','pipe','pipe']});
const base=`http://127.0.0.1:${port}`;
for(let i=0;i<160;i++){try{const r=await fetch(`${base}/api/health`);if(r.status<500)break;}catch{}await new Promise(r=>setTimeout(r,250));}

const email=`design-${randomUUID()}@e2e.einfachhausen.de`;
const password='Design!'+Math.random().toString(36).slice(2,12);
const mk=await fetch(`${supabaseUrl}/auth/v1/admin/users`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:JSON.stringify({email,password,email_confirm:true})});
const identity=await mk.json();
const db=new Database(dbPath);
db.prepare("INSERT INTO users(email,password_hash,role,first_name,last_name,auth_subject) VALUES(?,?,?,?,?,?)").run(email,'x','homeowner','Design','Audit',identity.id);
const { createClient }=await import('@supabase/supabase-js');
const c1=createClient(supabaseUrl,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
const signed=await c1.auth.signInWithPassword({email,password});
const items=[];
const { createServerClient }=await import('@supabase/ssr');
const sc=createServerClient(supabaseUrl,anonKey,{cookies:{getAll:()=>[],setAll:(i)=>{items.push(...i.map(x=>({name:x.name,value:x.value})));}}});
await sc.auth.setSession({access_token:signed.data.session.access_token,refresh_token:signed.data.session.refresh_token});
const cookie=items.map(({name,value})=>`${name}=${value}`).join('; ');

fs.mkdirSync(path.join(root,'artifacts','design-audit'),{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium-browser',args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:390,height:844}});
const page=await ctx.newPage();
const routes=['/app','/app/home','/app/jobs','/app/messages','/app/documents','/app/plans','/app/profile','/app/settings'];
for(const route of routes){
  try{
    await page.goto(base+route,{waitUntil:'networkidle',timeout:30000});
    await page.waitForTimeout(600);
    const name=route.replace(/\//g,'-')||'-root';
    await page.screenshot({path:path.join(root,'artifacts','design-audit',`owner390${name}.png`),fullPage:false});
    console.log('shot',route);
  }catch(e){console.log('skip',route,String(e).slice(0,80));}
}
await browser.close();
await fetch(`${supabaseUrl}/auth/v1/admin/users/${identity.id}`,{method:'DELETE',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`}});
child.kill('SIGKILL');
try{fs.rmSync(tmpDir,{recursive:true,force:true});}catch{}
process.exit(0);
