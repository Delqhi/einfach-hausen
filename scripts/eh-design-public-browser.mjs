import {chromium} from "playwright-core";
import {writeFileSync} from "node:fs";
const browser=await chromium.launch({executablePath:process.env.EH_CHROMIUM_PATH??"/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome",headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({reducedMotion:"reduce"});const results=[];const errors=[];
page.on("pageerror",e=>errors.push(e.message));
try {
 for(const width of [390,1440]) {
  await page.setViewportSize({width,height:1000});
  for(const route of ["/","/leistungen/heizung","/hilfe","/hausakte","/kontakt","/lexikon","/login"]) {
   const response=await page.goto("http://127.0.0.1:4190"+route,{waitUntil:"networkidle"});
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:"docs/brand/evidence/system/public-"+(route==="/"?"home":route.slice(1).replaceAll("/","-"))+"-"+width+".png",fullPage:true});
   const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelector("h1")?.textContent,logo:[...document.images].filter(i=>/logo-full/.test(i.src)).map(i=>({loaded:i.complete&&i.naturalWidth>0,width:i.width}))}));
   results.push({route,width,status:response.status(),...metrics});console.log(route,width,response.status(),metrics.overflow);
  }
 }
 for(const route of ["/app","/pro"]) {const response=await page.goto("http://127.0.0.1:4190"+route);results.push({route,unauthenticatedURL:page.url(),status:response.status()});}
 writeFileSync("docs/brand/evidence/system/public-pages.json",JSON.stringify({results,errors},null,2)+"\n");
 if(results.some(r=>r.overflow||r.status>=500)||errors.length)process.exitCode=1;else console.log("EH_PUBLIC_COMPATIBILITY_VALID");
} finally {await browser.close();}
