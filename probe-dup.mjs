
import fs from 'node:fs'; import net from 'node:net'; import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const repo=path.resolve('/home/ubuntu/einfach-hausen-oci-handoff');
const projectRoot='/tmp/probe-project'; const db='/tmp/probe-app4.sqlite3';
async function freePort(){return await new Promise((res,rej)=>{const s=net.createServer();s.unref();s.on('error',rej);s.listen(0,'127.0.0.1',()=>{const a=s.address();s.close(()=>res(typeof a==='object'?a.port:0))})})}
const port=await freePort(); const base=`http://127.0.0.1:${port}`;
const env={...process.env,DATABASE_PATH:db,ADMIN_PASSWORD:'x',NEXT_PUBLIC_APP_URL:base,NODE_ENV:'production',SESSION_COOKIE_NAME:'probe_s4',E2E_INSECURE_COOKIES:'1'};
const server=spawn(process.execPath,[path.join(repo,'node_modules/next/dist/bin/next'),'start','-H','127.0.0.1','-p',String(port)],{cwd:projectRoot,env,stdio:['ignore','pipe','pipe']});
for(let i=0;i<200;i++){try{const r=await fetch(base+'/',{redirect:'manual'});if(r.status<500)break}catch{}await new Promise(r=>setTimeout(r,250))}
const browser=await chromium.launch({headless:true,executablePath:'/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome'});
const ctx=await browser.newContext({viewport:{width:390,height:844}});
const page=await ctx.newPage();
await page.goto(base+'/register?role=provider');
await page.waitForTimeout(800);
const info=await page.evaluate(()=>({
  firstNameCount: document.querySelectorAll('input[name="firstName"]').length,
  forms: document.querySelectorAll('form').length,
  labels: [...document.querySelectorAll('label')].filter(l=>l.textContent.includes('Vorname')).length,
  dup: [...document.querySelectorAll('input[name="firstName"]')].map(i=>{let el=i; const path=[]; while(el&&el.tagName!=='BODY'){path.push(el.tagName+(el.className?'.'+String(el.className).split(' ')[0]:''));el=el.parentElement;} return path.slice(0,4).join('<')})
}));
console.log(JSON.stringify(info,null,1));
await browser.close(); server.kill('SIGTERM');
