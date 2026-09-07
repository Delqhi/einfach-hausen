import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import {startAtelierServer} from './server.mjs';
const repository=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dependencies=process.env.EH_VERIFY_DEPENDENCIES||'/home/ubuntu/dev/einfach-hausen';
const {chromium}=await import(pathToFileURL(path.join(dependencies,'node_modules/playwright-core/index.mjs')).href);
const axeSource=await readFile(path.join(dependencies,'node_modules/axe-core/axe.min.js'),'utf8');
const evidence=path.join(repository,'docs/brand/evidence/atelier');
await mkdir(evidence,{recursive:true});
const server=await startAtelierServer();
const base='http://127.0.0.1:'+server.address().port;
let browser;
const report={status:'running',screenshots:[],accessibility:[],functional:[],errors:[],visualApproval:false};
try{
 for(const route of ['/.env','/.git/config','/.sin-gpt-web/taskplan.sqlite3','/../AGENTS.md']) assert.equal((await fetch(base+route)).status,404);
 assert.equal((await fetch(base,{method:'POST'})).status,405);
 report.functional.push('Explicit route allowlist; private paths 404; POST 405');
 browser=await chromium.launch({headless:true,...(process.env.EH_CHROMIUM_PATH?{executablePath:process.env.EH_CHROMIUM_PATH}:{})});
 for(const width of [320,390,736,1440]){
  const page=await browser.newPage({viewport:{width,height:width<600?844:1000},reducedMotion:'reduce'});
  page.on('pageerror',error=>report.errors.push(error.message));
  for(const view of ['home','hausakte','kontakt']){
   await page.goto(base+'/?view='+view,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('[data-screen]:visible').count(),1);
   assert.equal(await page.locator('h1:visible').count(),1);
   assert.equal(await page.locator('.brand img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Overflow '+view+' '+width);
   assert.equal(await page.evaluate(()=>document.fonts.check('700 16px Inter')),true);
   assert.equal(await page.locator('[data-screen]:visible img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0)),true);
   const file=view+'-'+width+'.png';
   await page.screenshot({path:path.join(evidence,file),fullPage:true});
   report.screenshots.push({view,width,file});
   if(view==='home'&&[390,1440].includes(width))await page.screenshot({path:path.join(evidence,'opening-'+width+'.png')});
   if([390,1440].includes(width)){
    await page.evaluate(axeSource);
    const a11y=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
    report.accessibility.push({view,width,violations:a11y});
   }
  }
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('[data-system=roof]').click();
  assert.equal(await page.locator('#record-title').textContent(),'Ein gutes Dach darüber.');
  assert.equal(await page.locator('[data-system=roof]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-system=garden]').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#record-title').textContent(),'Platz zum Aufblühen.');
  if(width<600){await page.locator('.menu-button').click();assert.equal(await page.locator('#mobile-nav').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-nav').isVisible(),false);}
  await page.goto(base+'/?view=hausakte',{waitUntil:'networkidle'});
  await page.locator('[data-register=documents]').click();
  await page.locator('#document-search').fill('heizung');
  assert.equal(await page.locator('[data-document]:visible').count(),2);
  await page.locator('[data-document]:visible summary').first().click();
  assert.equal(await page.locator('details[open]').count(),1);
  await page.locator('#document-search').fill('nicht vorhanden');
  assert.equal(await page.locator('[data-document]:visible').count(),0);
  assert.match(await page.locator('#document-results').textContent(),/Keine passende/);
  await page.locator('[data-register=people]').click();
  assert.equal(await page.locator('[data-register-panel=people]').isVisible(),true);
  await page.locator('[data-register=overview]').click();
  await page.locator('#plan-maintenance').click();
  assert.match(await page.locator('#house-message').inputValue(),/Heizungswartung/);
  await page.locator('#house-composer button').click();
  assert.equal(await page.locator('#composer-answer').isVisible(),true);
  await page.locator('[data-intent=contact]').click();
  assert.match(await page.locator('#intent-status').textContent(),/niemand kontaktiert/);
  await page.locator('[data-intent=order]').click();
  assert.match(await page.locator('#intent-status').textContent(),/kein Auftrag erstellt/);
  await page.goto(base+'/?view=kontakt',{waitUntil:'networkidle'});
  const requests=[];
  page.on('request',request=>{if(request.method()!=='GET')requests.push(request.method()+' '+request.url());});
  await page.locator('#contact-name').fill('Beispiel');
  await page.locator('#contact-email').fill('falsch');
  await page.locator('#contact-message').fill('Meine Frage zum Haus');
  await page.locator('#contact-form button').click();
  assert.equal(await page.locator('#contact-email').evaluate(el=>el.validity.typeMismatch),true);
  assert.equal(await page.locator('#contact-status').textContent(),'');
  await page.locator('#contact-email').fill('beispiel@example.invalid');
  await page.locator('#contact-form button').click();
  assert.match(await page.locator('#contact-status').textContent(),/nichts versendet/);
  assert.deepEqual(requests,[]);
  report.functional.push('width '+width+': house areas, keyboard, registers/search/empty, local composer choice, contact validation, zero submit requests');
  await page.close();
 }
 const portable=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await portable.goto(pathToFileURL(path.join(repository,'design/brand-atelier/preview.html')).href,{waitUntil:'networkidle'});
 assert.equal(await portable.locator('.brand img').evaluate(img=>img.naturalWidth>0),true);
 await portable.locator('.hero-actions a').first().click();
 await portable.locator('[data-screen=hausakte]').waitFor({state:'visible'});
 report.functional.push('Portable file:// preview loads local assets and navigates between screens');
 await portable.close();
 assert.deepEqual(report.errors,[]);
 const violations=report.accessibility.flatMap(x=>x.violations);
 report.status=violations.length?'a11y-fail':'pass';
 await writeFile(path.join(evidence,'verification.json'),JSON.stringify(report,null,2)+'\n');
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
 assert.deepEqual(violations,[],'Accessibility violations');
}catch(error){
 report.status='fail';report.failure=String(error);await writeFile(path.join(evidence,'verification.json'),JSON.stringify(report,null,2)+'\n');throw error;
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
