import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import Database from 'better-sqlite3';
import { chromium } from 'playwright-core';
const root=process.cwd();
const kongEnv=(()=>{const raw=execFileSync('docker',['inspect','-f','{{range .Config.Env}}{{println .}}{{end}}','supabase-kong'],{encoding:'utf8',stdio:['ignore','pipe','ignore']});return Object.fromEntries(raw.trim().split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));})();
const supabaseUrl='https://supabase.delqhi.com',anonKey=kongEnv.SUPABASE_ANON_KEY,serviceKey=kongEnv.SUPABASE_SERVICE_KEY;
const tmpDir=fs.mkdtempSync(path.join(os.tmpdir(),'eh-b2-'));
const dbPath=path.join(tmpDir,'app.db');
async function freePort(){return new Promise((res,rej)=>{const s=createServer();s.listen(0,'127.0.0.1',()=>{const a=s.address();s.close(()=>res(a.port));});s.on('error',rej);});}
const port=await freePort();
const child=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:root,env:{...process.env,DATABASE_PATH:dbPath,AUTH_MODE:'supabase',SUPABASE_URL:supabaseUrl,SUPABASE_ANON_KEY:anonKey,SUPABASE_SERVICE_ROLE_KEY:serviceKey,NEXT_PUBLIC_SUPABASE_URL:supabaseUrl,NEXT_PUBLIC_SUPABASE_ANON_KEY:anonKey,NEXT_PUBLIC_APP_URL:`http://127.0.0.1:${port}`,SESSION_COOKIE_NAME:'mh_session_e2e',E2E_INSECURE_COOKIES:'1'},stdio:['ignore','pipe','pipe']});
const base=`http://127.0.0.1:${port}`;
for(let i=0;i<160;i++){try{const r=await fetch(`${base}/api/health`);if(r.status<500)break;}catch{}await new Promise(r=>setTimeout(r,250));}
const email=`b2-${randomUUID()}@e2e.einfachhausen.de`,password='B2shot!'+Math.random().toString(36).slice(2,12);
const mk=await fetch(`${supabaseUrl}/auth/v1/admin/users`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:JSON.stringify({email,password,email_confirm:true})});
const identity=await mk.json();
const db=new Database(dbPath);
db.prepare("INSERT INTO users(email,password_hash,role,first_name,last_name,auth_subject) VALUES(?,?,?,?,?,?)").run(email,'x','provider','Max','Mustermann',identity.id);
const uid=Number(db.prepare('SELECT id FROM users WHERE email=?').get(email).id);
db.prepare("INSERT INTO provider_profiles(user_id,business_name,trades,postcode,radius_km,description,street_address,verified) VALUES(?,?,?,?,?,?,?,1)").run(uid,'Gartenbau Müller','Garten, Heckenschnitt','85609',30,'Garten- und Landschaftsbau','Musterstraße 12');
db.prepare("INSERT INTO partner_contracts(provider_id,status,commission_bps,insurance_verified,qualification_verified,contract_verified,quality_standard_verified,response_target_minutes) VALUES(?,'active',0,1,1,1,1,30)").run(uid);
db.prepare("INSERT INTO provider_members(provider_id,user_id,job_title,can_manage_jobs,active) VALUES(?,?,?,?,1)").run(uid,uid,'GF',1);
db.prepare("INSERT INTO provider_preferences(provider_id,accepts_normal_jobs,accepts_emergencies) VALUES(?,1,1)").run(uid);
db.prepare("INSERT INTO partner_subscriptions(provider_id,plan_slug,status) VALUES(?,'free','active')").run(uid);
// seed 3 demo dispatches (open jobs in region)
const homeowner=db.prepare("INSERT INTO users(email,password_hash,role,first_name,last_name) VALUES(?,?,?,?,?)").run(`ho-${randomUUID()}@e2e.einfachhausen.de`,'x','homeowner','Maria','Test');
const hoId=Number(homeowner.lastInsertRowid);
const jobs=[
  ['Gartenpflege','Rasen mähen, Hecke schneiden, Unkraut entfernen','Garten & Außenbereich','85609',null,12000,'service',null,'sent'],
  ['Garten umgestalten','Neugestaltung Vorgarten, Beete, Bepflanzung','Garten & Außenbereich','81545',null,24000,'consultation',null,'viewed'],
  ['Hecke schneiden','Hecke ist zu hoch, dringender Rückschnitt erforderlich','Garten & Außenbereich','85521','2026-09-02',15000,'service','hecke','sent'],
];
for(const [title,desc,cat,plz,date,budget,kind,etype,status] of jobs){
  const j=db.prepare("INSERT INTO jobs(homeowner_id,title,description,category,postcode,preferred_date,budget_max,request_kind,emergency_type,status) VALUES(?,?,?,?,?,?,?,?,?,'open')").run(hoId,title,desc,cat,plz,date,budget,kind,etype);
  db.prepare("INSERT INTO job_dispatches(job_id,provider_id,status,match_score,sent_at) VALUES(?,?,?,?,datetime('now','-25 minutes'))").run(Number(j.lastInsertRowid),uid,status,0.9);
}
const items=[];
const {createClient}=await import('@supabase/supabase-js');
const c1=createClient(supabaseUrl,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
const signed=await c1.auth.signInWithPassword({email,password});
const {createServerClient}=await import('@supabase/ssr');
const sc=createServerClient(supabaseUrl,anonKey,{cookies:{getAll:()=>[],setAll:(i)=>{items.push(...i.map(x=>({name:x.name,value:x.value})));}}});
await sc.auth.setSession({access_token:signed.data.session.access_token,refresh_token:signed.data.session.refresh_token});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium-browser',args:['--no-sandbox']});
const page=await (await browser.newContext({viewport:{width:390,height:844}})).newPage();
await page.setExtraHTTPHeaders({cookie:items.map(({name,value})=>`${name}=${value}`).join('; ')});
await page.goto(base+'/pro/onboarding',{waitUntil:'networkidle'});
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
await page.screenshot({path:path.join(root,'artifacts','design-audit','b4-wizard-check2.png'),fullPage:true});
console.log(JSON.stringify({overflow}));
await browser.close();
child.kill('SIGKILL');try{fs.rmSync(tmpDir,{recursive:true,force:true});}catch{}
process.exit(0);
