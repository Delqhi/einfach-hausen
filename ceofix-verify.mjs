import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import Database from 'better-sqlite3';
import { chromium } from 'playwright-core';

const WT = '/home/ubuntu/orca/workspaces/eh-ceo-fixes-20260910';
const DB = '/tmp/eh-ceofix-test.db';
try { fs.rmSync(DB); } catch {}
try { fs.rmSync(DB+'-wal'); } catch {}
try { fs.rmSync(DB+'-shm'); } catch {}

async function freePort(){return await new Promise((res,rej)=>{const s=net.createServer();s.unref();s.on('error',rej);s.listen(0,'127.0.0.1',()=>{const a=s.address();s.close(()=>res(a.port));});});}
const port = await freePort();
console.log('PORT', port);
const env = { ...process.env, DATABASE_PATH: DB, AUTH_MODE: 'local', SESSION_COOKIE_NAME: 'mh_session', NODE_ENV: 'development', PORT: String(port) };
// start dev server
const server = spawn('npm', ['run','dev','--','-p', String(port)], { cwd: WT, env, stdio: ['ignore','pipe','pipe'] });
let ready=false;
server.stdout.on('data',d=>{process.stdout.write('[dev] '+d.toString().slice(0,2000));});
server.stderr.on('data',d=>{process.stdout.write('[dev-err] '+d.toString().slice(0,2000));});
const base = `http://127.0.0.1:${port}`;
// wait for /login
for(let i=0;i<90;i++){
  try{
    const r=await fetch(base+'/login',{redirect:'manual'});
    if(r.status===200||r.status===307||r.status===308){ready=true;break;}
  }catch{}
  await new Promise(r=>setTimeout(r,2000));
}
if(!ready){console.error('SERVER NOT READY');server.kill();process.exit(1);}
console.log('SERVER READY');
// touch app route to force DB schema init (imports lib/db)
try{await fetch(base+'/app/profile',{redirect:'manual'});}catch{}
await new Promise(r=>setTimeout(r,2000));
// init throwaway user + session via direct DB (server already created schema)
{
  const db = new Database(DB);
  db.pragma('busy_timeout = 5000');
  const email='ceofix-owner@example.test';
  db.prepare("DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE email=?)").run(email);
  db.prepare("DELETE FROM users WHERE email=?").run(email);
  const info=db.prepare("INSERT INTO users(email,password_hash,role,first_name,last_name,phone) VALUES(?,?,?,?,?,?)").run(email,'local-only','homeowner','Ceo','Fix',null);
  const uid=Number(info.lastInsertRowid);
  db.prepare("INSERT OR REPLACE INTO homeowner_profiles(user_id,postcode,address) VALUES(?,?,?)").run(uid,'10115','Musterstrasse 1');
  const token=randomBytes(32).toString('hex');
  const now=new Date();
  const exp=new Date(Date.now()+30*24*3600*1000);
  db.prepare("INSERT INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)").run(token,uid,exp.toISOString(),now.toISOString());
  db.prepare("INSERT OR REPLACE INTO user_settings(user_id) VALUES(?)").run(uid);
  fs.writeFileSync('/tmp/eh-ceofix-token.txt', token+'\n'+uid);
  console.log('USER',uid,'TOKEN',token.slice(0,8)+'...');
  db.close();
  globalThis.__token=token;
}
const token=fs.readFileSync('/tmp/eh-ceofix-token.txt','utf8').split('\n')[0].trim();
const browser = await chromium.launch({ args:['--no-sandbox'] });
const ctx = await browser.newContext({ viewport:{width:390,height:844} });
await ctx.addCookies([{ name:'mh_session', value: token, domain:'127.0.0.1', path:'/', httpOnly:true, sameSite:'Lax' }]);
const page = await ctx.newPage();
const results={};
// R2: profile logout buttons
await page.goto(base+'/app/profile',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(2000);
const btnProfile = page.getByTestId('owner-logout-profile');
const btnSection = page.getByTestId('owner-logout-section');
results.profileSectionVisible = await btnSection.isVisible().catch(()=>false);
results.profileBtnVisible = await btnProfile.isVisible().catch(()=>false);
results.profileBtnEnabled = await btnProfile.isEnabled().catch(()=>false);
const bbox = await btnProfile.boundingBox().catch(()=>null);
results.profileBtnBox = bbox ? {w:bbox.width,h:bbox.height} : null;
console.log('R2 profile',JSON.stringify(results));
// screenshot before logout
await page.screenshot({path:'/tmp/eh-ceofix-profile.png'});
// click logout (form POST -> redirect to /)
try{
  await Promise.all([
    page.waitForNavigation({waitUntil:'domcontentloaded',timeout:15000}).catch(()=>null),
    btnProfile.click({timeout:10000}),
  ]);
}catch(e){ console.log('click err',String(e).slice(0,500)); }
await page.waitForTimeout(2000);
results.afterLogoutUrl = page.url();
await page.screenshot({path:'/tmp/eh-ceofix-after-logout.png'});
// gate check: /app/home should redirect to /login after logout
await page.goto(base+'/app/home',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(1500);
results.homeAfterLogout = page.url();
results.gateOk = results.homeAfterLogout.includes('/login');
console.log('R2 after',results.afterLogoutUrl,results.homeAfterLogout,results.gateOk);
// re-auth for further checks (new session, old was destroyed)
{
  const db = new Database(DB);
  const row=db.prepare("SELECT id FROM users WHERE email=?").get('ceofix-owner@example.test');
  const uid=row.id;
  db.prepare("DELETE FROM sessions WHERE user_id=?").run(uid);
  const t2=randomBytes(32).toString('hex');
  const now=new Date();const exp=new Date(Date.now()+30*24*3600*1000);
  try{db.prepare("INSERT INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)").run(t2,uid,exp.toISOString(),now.toISOString());}catch{}
  fs.writeFileSync('/tmp/eh-ceofix-token.txt',t2);
  db.close();
  await ctx.clearCookies();
  await ctx.addCookies([{name:'mh_session',value:t2,domain:'127.0.0.1',path:'/',httpOnly:true,sameSite:'Lax'}]);
}
// R6c: hausmeister hints
await page.goto(base+'/app/hausmeister',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(2500);
async function vis(tid){ try{return await page.getByTestId(tid).isVisible();}catch{return false;} }
results.hmQuota = await vis('hausmeister-quota');
results.hm401 = await vis('hausmeister-limit-401');
results.hm402 = await vis('hausmeister-limit-402');
results.hm429 = await vis('hausmeister-limit-429');
results.hmLive = await vis('hausmeister-live-status');
results.hmLiveText = await page.getByTestId('hausmeister-live-status').innerText().catch(()=>null);
console.log('R6c static',JSON.stringify(results));
// stub 401/402/429 for /api/ki
for(const code of [401,402,429]){
  await page.route('**/api/ki', r=>r.fulfill({status:code,contentType:'application/json',body:JSON.stringify({error:'stub'})}), {times:1});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1500);
  const t = await page.getByTestId('hausmeister-live-status').innerText().catch(()=>null);
  results['stub'+code]=t;
  console.log('stub',code,t);
  await page.unroute('**/api/ki').catch(()=>{});
}
await page.screenshot({path:'/tmp/eh-ceofix-hausmeister.png'});
// R7b: ad button
await page.goto(base+'/app/settings',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(2500);
const adBtn = page.getByTestId('watch-ad-button');
results.adVisible = await adBtn.isVisible().catch(()=>false);
results.adDisabled = await adBtn.isDisabled().catch(()=>null);
results.adText = await adBtn.innerText().catch(()=>null);
results.adLabelHas = results.adText ? results.adText.includes('noch nicht verf') : false;
// ensure no POST on attempted click (disabled buttons don't fire)
let putFired=false;
page.on('request',r=>{ if(r.url().includes('/api/ki')&&r.method()==='PUT') putFired=true; });
try{ await adBtn.click({timeout:3000, force:true}).catch(()=>{}); }catch{}
await page.waitForTimeout(1000);
results.adPutFired = putFired;
console.log('R7b',JSON.stringify(results));
await page.screenshot({path:'/tmp/eh-ceofix-ai-settings.png'});
fs.writeFileSync('/tmp/eh-ceofix-verify.json', JSON.stringify({base,results},null,2));
await browser.close();
server.kill('SIGTERM');
console.log('DONE');
