import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome',headless:true,args:['--no-sandbox']});
const out='design/assistant-preview';fs.mkdirSync(out,{recursive:true});const evidence=[];
for(const width of [390,736,1536]) {
 const context=await browser.newContext({viewport:{width,height:900},locale:'de-DE'});const page=await context.newPage();
 let calls=0;let status=401;
 await page.route('**/api/ki',route=>{calls++;return route.fulfill({status,contentType:'application/json',body:JSON.stringify({reply:status===401?'Bitte melde dich an, um den Assistenten zu nutzen.':status===402?'Dein KI-Kontingent ist aufgebraucht.':status===429?'Bitte versuche es später erneut.':'Testantwort: Beschreibe bitte, seit wann das Geräusch auftritt.'})});});
 await page.goto('http://127.0.0.1:4291/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const launcher=page.getByRole('button',{name:/Frag deinen Hausassistenten/});await page.screenshot({path:`${out}/launcher-${width}.png`,fullPage:false});await launcher.click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();assert.equal(calls,0);
 await page.screenshot({path:`${out}/open-${width}.png`,fullPage:false});
 const field=dialog.getByLabel('Deine Frage',{exact:true});await field.fill('Meine Heizung macht Geräusche.');await dialog.getByRole('button',{name:'Frage senden'}).click();
 await dialog.getByRole('link',{name:'Zum Hauskonto anmelden'}).waitFor();assert.equal(await field.inputValue(),'Meine Heizung macht Geräusche.');
 status=402;await dialog.getByRole('button',{name:'Frage senden'}).click();await dialog.getByRole('link',{name:'KI-Kontingent ansehen'}).waitFor();
 status=429;await dialog.getByRole('button',{name:'Frage senden'}).click();await dialog.getByText('Bitte versuche es später erneut.',{exact:true}).waitFor();
 status=200;await dialog.getByRole('button',{name:'Frage senden'}).click();await dialog.getByText(/Testantwort:/).waitFor();assert.equal(await field.inputValue(),'');
 await page.screenshot({path:`${out}/reply-${width}.png`,fullPage:false});
 const geometry=await dialog.evaluate(el=>{const r=el.getBoundingClientRect();return {fits:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,overflow:el.scrollWidth>el.clientWidth,inputFont:getComputedStyle(el.querySelector('textarea')).fontSize}});
 assert.ok(geometry.fits);assert.equal(geometry.overflow,false);assert.equal(geometry.inputFont,'16px');
 await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert.equal(await launcher.evaluate(el=>document.activeElement===el),true);
 evidence.push({width,calls,noAutomaticRequest:true,login:true,quota:true,rateLimit:true,reply:true,escapeAndFocus:true,...geometry});await context.close();
}
await browser.close();fs.writeFileSync(out+'/evidence.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));
