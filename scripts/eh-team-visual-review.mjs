import {chromium} from 'playwright-core';
import fs from 'node:fs';
if (!process.env.EH_REVIEW_FIXTURE) throw new Error('EH_REVIEW_FIXTURE must point to an isolated local fixture JSON; never use production sessions.');
const fixture=JSON.parse(fs.readFileSync(process.env.EH_REVIEW_FIXTURE,'utf8'));
const out='design/workspace-preview/team';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome',headless:true,args:['--no-sandbox']});
const evidence=[];
for(const route of ['team']) for(const width of [390,736,1536]) {
 const context=await browser.newContext({viewport:{width,height:1000},locale:'de-DE'});
 await context.addCookies([{name:'mh_session',value:fixture.sessions.pro,url:'http://127.0.0.1:4199',httpOnly:true,sameSite:'Lax'}]);
 const page=await context.newPage();await page.goto('http://127.0.0.1:4199/pro/'+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const check=await page.evaluate(()=>({url:location.pathname,h1:document.querySelectorAll('h1').length,checkboxDirections:[...document.querySelectorAll('main input[type=checkbox]')].map(e=>getComputedStyle(e.closest('label')).flexDirection),overflow:document.documentElement.scrollWidth>innerWidth,offenders:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1}).slice(0,8).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,80),right:e.getBoundingClientRect().right})),inputs:[...document.querySelectorAll('main input:not([type=hidden]), main select, main textarea')].map(e=>({name:e.name,font:getComputedStyle(e).fontSize,label:!!e.labels?.length}))}));
 await page.screenshot({path:`${out}/${route.replaceAll('/','-')}-${width}.png`,fullPage:true});evidence.push({route,width,...check});await context.close();
}
fs.writeFileSync(out+'/evidence.json',JSON.stringify(evidence,null,2));await browser.close();console.log(JSON.stringify(evidence.map(({route,width,h1,overflow})=>({route,width,h1,overflow}))));
if (evidence.some(e=>e.url!=='/pro/'+e.route || e.h1!==1 || e.checkboxDirections.some(d=>d!=='row') || e.overflow || e.inputs.some(i=>!i.label || parseFloat(i.font)<16))) process.exitCode=1;
