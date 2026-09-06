import {chromium} from "playwright-core";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
const out="docs/brand/evidence/system";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.EH_CHROMIUM_PATH??"/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome",headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const result=[];
await page.goto("http://127.0.0.1:4191/design-system",{waitUntil:"networkidle",timeout:90000});
await page.evaluate(()=>document.fonts.ready);
const views=["Auftrag","Termine","Gespräch","Rechnungen","Einstellungen","Anmeldung","Lexikon","Notfall"];
for(const width of [390,736,1440]) {
 await page.setViewportSize({width,height:1000});
 for(const view of views) {
  await page.getByRole("button",{name:view,exact:true}).click();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:out+"/domain-"+view+"-"+width+".png",fullPage:true});
  const metrics=await page.evaluate(()=>{
   const nodes=[...document.querySelectorAll("#design-preview *")].filter(el=>el.getBoundingClientRect().width&&el.getBoundingClientRect().height&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
   return {overflow:document.documentElement.scrollWidth>innerWidth+1,small:nodes.filter(el=>parseFloat(getComputedStyle(el).fontSize)<12).map(el=>({text:el.textContent.slice(0,80),size:getComputedStyle(el).fontSize})),font:getComputedStyle(document.querySelector("#design-preview")).fontFamily};
  });
  await page.addScriptTag({content:readFileSync("node_modules/axe-core/axe.min.js","utf8")});
  const axe=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector("#design-preview"),{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}));});
  result.push({view,width,...metrics,axe});
  console.log(view,width,"overflow",metrics.overflow,"small",metrics.small.length,"axe",axe.length);
 }
}
// Verhalten: Thread-Antwort lokal, Einstellungen-Speichern lokal, Suche/Filter Register.
await page.setViewportSize({width:1440,height:1000});
await page.getByRole("button",{name:"Gespräch",exact:true}).click();
await page.getByLabel("Deine Nachricht").fill("Beispieltext zur Prüfung.");
await page.getByRole("button",{name:"Nachricht senden"}).click();
const receipt=await page.getByText("Vorschau: Nachricht geprüft.",{exact:false}).count();
if(!receipt)throw Error("Thread-Antwort-Quittung fehlt");
await page.getByRole("button",{name:"Einstellungen",exact:true}).click();
await page.getByRole("button",{name:"Änderungen speichern",exact:true}).click();
if(!await page.getByText("Vorschau: Einstellungen geprüft.",{exact:false}).count())throw Error("Einstellungs-Quittung fehlt");
writeFileSync(out+"/domain-browser.json",JSON.stringify({errors,result},null,2));
if(errors.length)throw Error("pageerrors: "+errors.join(" | ").slice(0,400));
console.log("DOMAIN_BROWSER_OK");
await browser.close();
