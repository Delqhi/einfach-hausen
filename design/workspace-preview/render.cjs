/* Static design review only. No application routes, credentials or backend calls. */
const fs=require("fs"),path=require("path"),ts=require("typescript"),R=require("react"),e=R.createElement;
const root=path.resolve(__dirname,"../..");process.chdir(root);
require.extensions[".tsx"]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,"utf8"),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
require.extensions[".css"]=m=>{m.exports={__esModule:true,default:new Proxy({},{get:(_,key)=>String(key)})};};
const W=require(root+"/packages/eh-design/src/workspace.tsx"),P=require(root+"/packages/eh-design/src/primitives.tsx"),D=require(root+"/packages/eh-design/src/workspace-detail.tsx");
const I=require("lucide-react");
const samples=[{id:"1",name:"Dachrinne · Hauseingang.jpg",kind:"JPG",detail:"Foto · 2,4 MB · Beispieldatei"},{id:"2",name:"Leistungsumfang.pdf",kind:"PDF",detail:"Dokument · 184 KB · Beispieldatei"},{id:"3",name:"Materialnachweis.pdf",kind:"PDF",detail:"Nachweis · 92 KB · Beispieldatei"}];
const attachment=()=>e(D.EHAttachmentPanel,{files:samples,preview:true});
const scenes={
detail:e(D.EHJobDetail,{title:"Dachrinne reinigen & Ablauf prüfen",reference:"VORGANG EH-2048 · BEISPIEL",status:"Termin vereinbart",location:"Beispielhaus · Berlin",description:"Bei starkem Regen läuft die Dachrinne am Hauseingang über. Die Rinne soll gereinigt und der Anschluss zum Fallrohr kontrolliert werden. Bitte den Zustand nach der Arbeit mit Fotos dokumentieren.",contact:{name:"Alex Beispiel",company:"Beispielbetrieb · Dach & Fassade"},appointment:"Dienstag, 15. September · 09:00 Uhr",events:[{title:"Anliegen beschrieben",detail:"Foto und Beschreibung liegen zum Vorgang vor."},{title:"Leistungsumfang abgestimmt",detail:"Reinigung und Kontrolle des Ablaufs."},{title:"Termin vereinbart",detail:"Die Ausführung ist für Dienstag vorgesehen."}],actions:e(P.EHButton,{type:"button",variant:"on-dark",disabled:true},"Termin ansehen · Vorschau"),attachments:attachment()}),
attachments:e(R.Fragment,null,e("header",{className:"detailHeading"},e("div",null,e("p",null,"HAUSAKTE · BEISPIEL"),e("h1",null,"Gut dokumentiert. Schnell gefunden."),e("p",null,"Dachrinne reinigen & Ablauf prüfen"))),attachment()),
invoice:e(D.EHInvoiceEditor,{buyer:"Robin Beispiel · Beispielhaus Berlin",job:"Dachrinne reinigen & Ablauf prüfen · EH-2048",preview:true,initialLines:[{id:"labor",description:"Dachrinne reinigen und Ablauf kontrollieren",quantity:"2",unit:"Std.",price:"75.00",tax:"19"},{id:"material",description:"Kleinmaterial und Entsorgung",quantity:"1",unit:"pauschal",price:"28.00",tax:"19"}]})
};
const tokens=JSON.parse(fs.readFileSync("packages/eh-design/src/tokens.json"));let vars="";
for(const[group,entries]of Object.entries(tokens))if(entries&&typeof entries==="object")for(const[key,value]of Object.entries(entries))if(typeof value==="string")vars+="--eh-"+group+"-"+key.replace(/[A-Z]/g,c=>"-"+c.toLowerCase())+":"+value+";";
const font=fs.readFileSync("src/fonts/InterVariable.woff2").toString("base64");
const logo=fs.readFileSync("public/brand/logo-full.png").toString("base64");
const css=fs.readFileSync("packages/eh-design/src/styles.module.css","utf8");
const out=path.join(root,"design/workspace-preview");fs.mkdirSync(out,{recursive:true});
async function run(){const{chromium}=require("playwright-core");const b=await chromium.launch({executablePath:process.env.EH_PREVIEW_CHROME||"/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome",headless:true,args:["--no-sandbox"]});const p=await b.newPage();const evidence=[];
for(const[name,scene]of Object.entries(scenes)){
 const icons=[I.Home,I.ClipboardList,I.MessageSquare,I.Users,I.UserRound];
 const content=e(P.EHScope,{app:true},e(W.EHWorkspaceFrame,{homeHref:"#",context:"Partnerbereich · Gestaltungsvorschau",navigation:["Übersicht","Aufträge","Nachrichten","Team","Profil"].map((label,i)=>e(W.EHWorkspaceNavItem,{key:label,href:"#"+i,active:i===1,icon:e(icons[i],{size:22})},label)),account:e("span",null,"Beispielkonto"),mobileMenu:e(I.Menu,{size:24}),notifications:e(I.Bell,{size:22}),bottomNav:e("p",{style:{padding:16,textAlign:"center"}},"Gestaltungsvorschau · keine Live-App")},e("p",{style:{fontSize:13,color:"#4b5b60"}},"DESIGNVORSCHAU · Beispieldaten · Keine Speicherung oder Übermittlung"),scene));
 const markup=require("react-dom/server").renderToStaticMarkup(content).replaceAll("/brand/logo-full.png","data:image/png;base64,"+logo);
 const html='<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Einfachhausen – '+name+' Vorschau</title><style>@font-face{font-family:Inter;src:url(data:font/woff2;base64,'+font+') format("woff2");font-weight:100 900}body{margin:0}:root{'+vars+'}'+css+'</style><body>'+markup+'</body></html>';
 fs.writeFileSync(path.join(out,name+".html"),html);
 for(const width of [1536,390]){await p.setViewportSize({width,height:1000});await p.setContent(html);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(out,name+"-"+width+".png"),fullPage:true});evidence.push({scene:name,width,...await p.evaluate(()=>({h1:document.querySelectorAll("h1").length,overflow:document.documentElement.scrollWidth>innerWidth,font:getComputedStyle(document.querySelector("h1")).fontFamily}))});}
}
fs.writeFileSync(path.join(out,"render-evidence.json"),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));await b.close();}
run().catch(error=>{console.error(error);process.exitCode=1});
