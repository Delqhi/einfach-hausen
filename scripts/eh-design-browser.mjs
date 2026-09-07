import {chromium} from "playwright-core";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
const out="docs/brand/evidence/system";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.EH_CHROMIUM_PATH??"/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome",headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const result=[];
try {
 await page.goto("http://127.0.0.1:4190/design-system",{waitUntil:"networkidle",timeout:90000});
 await page.evaluate(()=>document.fonts.ready);
 const views=["Startseite","Leistung","Ratgeber","Leistungsübersicht","Kontakt","Leistungsumfang","Owner-App","Handwerker-App","Bausteine"];
 for(const width of [390,736,1440]) {
  await page.setViewportSize({width,height:1000});
  for(const [i,view] of views.entries()) {
   await page.getByRole("button",{name:view,exact:true}).click();
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:out+"/view-"+i+"-"+width+".png",fullPage:true});
   const metrics=await page.evaluate(()=>{
    const nodes=[...document.querySelectorAll("#design-preview *")].filter(el=>el.getBoundingClientRect().width&&el.getBoundingClientRect().height&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,small:nodes.filter(el=>parseFloat(getComputedStyle(el).fontSize)<12).map(el=>({text:el.textContent.slice(0,80),size:getComputedStyle(el).fontSize})),font:getComputedStyle(document.querySelector("#design-preview")).fontFamily};
   });
   await page.addScriptTag({content:readFileSync("node_modules/axe-core/axe.min.js","utf8")});
   const axe=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector("#design-preview"),{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
   result.push({view,width,...metrics,axe});
   console.log(view,width,"overflow",metrics.overflow,"small",metrics.small.length,"axe",axe.length);
  }
 }
 // Real keyboard behavior, search filtering, native validation and dialog focus.
 await page.getByRole("button",{name:"Owner-App",exact:true}).click();
 const overview=page.getByRole("tab",{name:"Überblick",exact:true});await overview.focus();await page.keyboard.press("ArrowRight");
 if(await page.getByRole("tab",{name:"Dokumente",exact:true}).getAttribute("aria-selected")!=="true")throw Error("Tabs keyboard selection failed");
 await page.getByLabel("Dokumente suchen",{exact:true}).fill("Dach");
 if(await page.getByRole("link",{name:"Heizungswartung · Musterdatei"}).count())throw Error("Document search did not filter");
 await page.getByRole("button",{name:"Handwerker-App",exact:true}).click();
 await page.getByRole("button",{name:"Anfrage ansehen",exact:true}).first().click();
 if(!(await page.getByRole("dialog").isVisible()))throw Error("Dialog did not open");
 await page.keyboard.press("Escape");
 if(await page.getByRole("dialog").isVisible())throw Error("Dialog did not close on Escape");
 await page.getByRole("button",{name:"Kontakt",exact:true}).click();
 await page.getByRole("button",{name:"Formular prüfen",exact:true}).click();
 if(await page.getByText("Vorschau: Formular geprüft.",{exact:false}).count())throw Error("Invalid form submitted");
 const bad=result.filter(r=>r.overflow||r.small.length||r.axe.length);
 writeFileSync(out+"/browser.json",JSON.stringify({result,errors,interactions:"passed",failedViews:bad.length},null,2)+"\n");
 if(bad.length||errors.length)process.exitCode=1;else console.log("EH_BROWSER_VALID");
} finally {await browser.close();}
