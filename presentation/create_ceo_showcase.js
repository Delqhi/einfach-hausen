const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'OpenSIN / einfachhausen';
pptx.company = 'einfachhausen';
pptx.subject = 'Live Product Showcase';
pptx.title = 'einfachhausen Live Product Showcase';
pptx.lang = 'de-DE';
pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos' };
pptx.defineLayout({ name:'LAYOUT_WIDE', width:13.333, height:7.5 });
pptx.layout = 'LAYOUT_WIDE';
const W=13.333, H=7.5;
const C={bg:'F7F5EF', ink:'151A17', muted:'627069', green:'087548', light:'E6F1EA', line:'D9DED8', dark:'071B13', gold:'D7B35E', white:'FFFFFF'};
let warnings=[];
function rectsIntersect(a,b){return !(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y)}
function isBenign(a,b){
  if(a.kind==='bg'||b.kind==='bg')return true;
  if(a.intentional||b.intentional)return true;
  if(a.kind==='label'||b.kind==='label') return true;
  if((a.kind==='frame'&&b.kind==='image')||(a.kind==='image'&&b.kind==='frame')) return true;
  if((a.kind==='shape'&&b.kind==='text')||(a.kind==='text'&&b.kind==='shape')) return true;
  return false;
}
function warnIfSlideHasOverlaps(slide, elems, name){
  for(let i=0;i<elems.length;i++)for(let j=i+1;j<elems.length;j++){
    if(rectsIntersect(elems[i], elems[j])&&!isBenign(elems[i], elems[j])) warnings.push(`overlap ${name}: ${elems[i].id} / ${elems[j].id}`);
  }
}
function warnIfSlideElementsOutOfBounds(slide, elems, name){
  for(const e of elems){
    if(e.x<-0.02||e.y<-0.02||e.x+e.w>W+0.02||e.y+e.h>H+0.02) warnings.push(`bounds ${name}: ${e.id} ${JSON.stringify(e)}`);
  }
}
function add(slide, elems, id, x,y,w,h,kind='shape',intentional=false){ elems.push({id,x,y,w,h,kind,intentional}); return {x,y,w,h}; }
function bg(slide, elems, color=C.bg){ slide.background={color}; add(slide,elems,'bg',0,0,W,H,'bg'); }
function txt(slide, elems, text, x,y,w,h, opt={}){ slide.addText(text,{x,y,w,h, margin:0, breakLine:false, fontFace: opt.fontFace||'Aptos', fontSize:opt.size||22, bold:!!opt.bold, color:opt.color||C.ink, fit:'shrink', valign: opt.valign||'mid', align:opt.align||'left'}); add(slide, elems, text.slice(0,16), x,y,w,h,'text'); }
function pill(slide, elems, text, x,y,w,h, color=C.green){ slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:0.09,line:{color,transparency:100},fill:{color}}); add(slide,elems,'pill '+text,x,y,w,h,'shape'); slide.addText(text,{x:x+0.12,y:y+0.06,w:w-0.24,h:h-0.12,margin:0,fontSize:12,bold:true,color:C.white,fit:'shrink',align:'center',valign:'mid'}); add(slide,elems,'pilltxt '+text,x+0.12,y+0.06,w-0.24,h-0.12,'label',true); }
function imgSize(p){ const m=fs.readFileSync(p); // simple png size
  if(m[0]===0x89&&m.toString('ascii',1,4)==='PNG'){return {w:m.readUInt32BE(16),h:m.readUInt32BE(20)}}
  return {w:1000,h:1000}; }
function addImageFit(slide, elems, p, x,y,w,h, id, opts={}){
  slide.addShape(pptx.ShapeType.roundRect,{x:x-0.02,y:y-0.02,w:w+0.04,h:h+0.04,rectRadius:opts.radius||0.12,line:{color:opts.line||C.line,transparency:10,width:1},fill:{color:opts.fill||C.white}});
  add(slide,elems,'frame '+id,x-0.02,y-0.02,w+0.04,h+0.04,'frame');
  const s=imgSize(p); const ar=s.w/s.h, box=w/h; let iw=w, ih=h, ix=x, iy=y;
  if(ar>box){ iw=w; ih=w/ar; iy=y+(h-ih)/2; } else { ih=h; iw=h*ar; ix=x+(w-iw)/2; }
  slide.addImage({path:p,x:ix,y:iy,w:iw,h:ih});
  add(slide,elems,id,ix,iy,iw,ih,'image');
}
function addImageCrop(slide, elems, p, x,y,w,h, id){
  slide.addImage({path:p,x,y,w,h,sizing:{type:'crop',x,y,w,h}});
  add(slide,elems,id,x,y,w,h,'image');
}
function section(slide, elems, label){ txt(slide,elems,label,0.55,0.34,5.2,0.25,{size:10,bold:true,color:C.green}); }
function title(slide, elems, t, sub){ txt(slide,elems,t,0.55,0.65,6.9,0.55,{size:30,bold:true}); if(sub)txt(slide,elems,sub,0.56,1.25,6.9,0.34,{size:13,color:C.muted}); }
function finish(slide, elems, name){ warnIfSlideHasOverlaps(slide,elems,name); warnIfSlideElementsOutOfBounds(slide,elems,name); }
const D='presentation/crops_ceo/';
const raw='presentation/';
// 1 cover
{ const s=pptx.addSlide(), e=[]; bg(s,e,C.dark); txt(s,e,'einfachhausen',0.55,0.42,3.4,0.35,{size:18,bold:true,color:C.white}); txt(s,e,'Live Product Showcase',0.55,1.12,5.35,0.62,{size:38,bold:true,color:C.white}); txt(s,e,'Website · Eigentümer-App · Handwerker-App',0.58,1.88,5.2,0.3,{size:15,color:'C7D6CE'}); pill(s,e,'PRODUCTION CAPTURE',0.58,2.42,1.9,0.34,C.green); txt(s,e,'GitHub & Produktion: 3a8aa93 · Health: ok · DB: ready',0.58,2.9,5.8,0.28,{size:11,color:'C7D6CE'});
  addImageFit(s,e,D+'web_hero.png',6.2,0.72,6.3,2.05,'web hero'); addImageFit(s,e,D+'owner_home_top.png',7.1,3.25,2.0,3.55,'owner phone'); addImageFit(s,e,D+'craft_start.png',9.65,3.25,2.0,3.55,'craft phone'); finish(s,e,'cover'); }
// 2 live status
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'LIVE-STATUS'); title(s,e,'Stand ist live verifiziert.','Das Team sieht hier keine Figma-Mockups, sondern den Produktionsstand nach Deployment.');
  const facts=[['Commit','3a8aa93'],['Quelle','https://einfachhausen.de'],['Healthcheck','ok=true'],['Datenbank','ready']];
  let x=0.72; facts.forEach((f,i)=>{s.addShape(pptx.ShapeType.roundRect,{x,y:2.05,w:2.55,h:1.25,rectRadius:0.12,line:{color:C.line},fill:{color:C.white}}); add(s,e,'fact'+i,x,2.05,2.55,1.25,'shape'); txt(s,e,f[0],x+0.22,2.28,1.8,0.22,{size:11,bold:true,color:C.green}); txt(s,e,f[1],x+0.22,2.62,2.0,0.32,{size:18,bold:true}); x+=3.0;});
  addImageFit(s,e,D+'web_value.png',0.75,4.05,5.8,2.2,'web value'); addImageFit(s,e,D+'owner_hausmeister.png',7.15,3.75,2.15,2.95,'owner compact'); addImageFit(s,e,D+'craft_start.png',9.95,3.75,2.15,2.95,'craft compact'); finish(s,e,'live'); }
// 3 website hero
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'WEBSITE'); title(s,e,'Der erste Eindruck ist jetzt präsentierbar.','Hero, Nutzenversprechen und Markenhaltung werden als breite Ausschnitte gezeigt – nicht als unlesbare Vollseiten.'); addImageFit(s,e,D+'web_hero.png',0.65,1.85,7.15,3.95,'web hero large'); addImageFit(s,e,D+'web_services.png',8.35,1.55,4.25,2.35,'services'); addImageFit(s,e,D+'web_process.png',8.35,4.2,4.25,2.35,'process'); finish(s,e,'website hero'); }
// 4 website flow
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'WEBSITE-FLOW'); title(s,e,'Vom Versprechen zur Entscheidung.','Startseite, Leistungen und Ablauf ergeben eine klare Verkaufsstrecke.'); addImageFit(s,e,D+'web_value.png',0.72,1.75,3.8,4.4,'value'); addImageFit(s,e,D+'web_services.png',4.85,1.75,3.8,4.4,'services2'); addImageFit(s,e,D+'web_process.png',8.98,1.75,3.8,4.4,'process2'); txt(s,e,'01  Vertrauen',1.0,6.45,2.6,0.28,{size:12,bold:true,color:C.green}); txt(s,e,'02  Leistung',5.15,6.45,2.6,0.28,{size:12,bold:true,color:C.green}); txt(s,e,'03  Ablauf',9.28,6.45,2.6,0.28,{size:12,bold:true,color:C.green}); finish(s,e,'website flow'); }
// 5 owner app
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'EIGENTÜMER-APP'); title(s,e,'Die App wirkt wie ein persönlicher Hausmanager.','Home, Hausmeister-Eingabe und nächste Schritte sind als konkrete Nutzungssituation geschnitten.'); addImageFit(s,e,D+'owner_home_top.png',0.78,1.65,2.35,4.75,'owner home'); addImageFit(s,e,D+'owner_hausmeister.png',3.85,1.65,3.0,5.08,'hausmeister'); addImageFit(s,e,D+'owner_home_next.png',7.55,1.65,2.25,4.75,'next'); addImageFit(s,e,D+'owner_house.png',10.35,1.65,2.25,4.75,'house'); finish(s,e,'owner'); }
// 6 owner depth
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'EIGENTÜMER-TIEFE'); title(s,e,'Nicht nur Formular – Produkt mit Struktur.','Hausakte, Tarife und Freigabe-Logik geben dem Konzept Substanz für Betrieb und Monetarisierung.'); addImageFit(s,e,D+'owner_house.png',0.8,1.75,3.1,5.15,'house large'); addImageFit(s,e,D+'owner_tariffs.png',4.4,1.75,3.1,5.15,'tariffs large'); addImageFit(s,e,D+'owner_hausmeister.png',8.0,1.75,3.1,5.15,'request large'); txt(s,e,'Hausakte',1.1,6.95,2.0,0.25,{size:12,bold:true,color:C.green}); txt(s,e,'Tarife',4.7,6.95,2.0,0.25,{size:12,bold:true,color:C.green}); txt(s,e,'Hausmeister',8.3,6.95,2.0,0.25,{size:12,bold:true,color:C.green}); finish(s,e,'owner depth'); }
// 7 craft access
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'HANDWERKER-APP'); title(s,e,'Partnerzugang mit kontrolliertem Onboarding.','Der Live-Stand zeigt bewusst den echten Prüfstatus statt eines schöngefälschten Demo-Zustands.'); addImageFit(s,e,D+'craft_start.png',0.9,1.65,3.0,5.25,'craft start big'); txt(s,e,'Echter Produktionszustand',4.55,2.1,4.8,0.45,{size:28,bold:true}); txt(s,e,'Neue Partner sehen erst nach Unternehmens- und Vertragsprüfung relevante Anfragen. Das ist genau die richtige Gatekeeping-Logik für Qualität, Haftung und Vertrauen.',4.58,2.78,4.75,1.15,{size:16,color:C.muted}); pill(s,e,'QUALITÄT VOR VOLUMEN',4.6,4.25,2.35,0.38,C.green); addImageFit(s,e,D+'craft_orders.png',9.7,1.82,2.2,2.25,'orders small'); addImageFit(s,e,D+'craft_team.png',9.7,4.45,2.2,2.25,'team small'); finish(s,e,'craft access'); }
// 8 craft operations
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'HANDWERKER-BETRIEB'); title(s,e,'Die operative Oberfläche ist vorbereitet.','Aufträge, Team und Profil sind als separate, teamtaugliche Ausschnitte dargestellt.'); addImageFit(s,e,D+'craft_orders.png',0.85,1.75,3.1,5.1,'orders'); addImageFit(s,e,D+'craft_team.png',4.45,1.75,3.1,5.1,'team'); addImageFit(s,e,D+'craft_profile.png',8.05,1.75,3.1,5.1,'profile'); finish(s,e,'craft ops'); }
// 9 product loop
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'END-TO-END'); title(s,e,'Ein Produkt, drei Rollen, ein Flow.','Website erzeugt Nachfrage, Eigentümer-App qualifiziert Anliegen, Handwerker-App steuert geprüfte Ausführung.');
  const steps=[['Website','Vertrauen & Nachfrage',D+'web_hero.png'],['Eigentümer','Anliegen & Freigabe',D+'owner_hausmeister.png'],['Handwerker','Prüfung & Ausführung',D+'craft_start.png']];
  steps.forEach((st,i)=>{const x=0.8+i*4.15; addImageFit(s,e,st[2],x,1.9,2.5,3.6,'flow'+i); txt(s,e,st[0],x,5.75,2.5,0.35,{size:19,bold:true}); txt(s,e,st[1],x,6.18,2.8,0.25,{size:11,color:C.muted}); if(i<2){ s.addShape(pptx.ShapeType.rightArrow,{x:x+2.92,y:3.35,w:0.58,h:0.34,line:{color:C.green,transparency:100},fill:{color:C.green}}); add(s,e,'arrow'+i,x+2.92,3.35,0.58,0.34,'label',true); }}); finish(s,e,'loop'); }
// 10 screenshot overview all
{ const s=pptx.addSlide(), e=[]; bg(s,e); section(s,e,'ALLE LIVE-SCREENS'); title(s,e,'Alle aufgenommenen Screens auf einen Blick.','Die Originale bleiben im Ordner; hier sind sie sauber als Übersicht für Diskussion und QA angeordnet.'); const imgs=['01-website-startseite.png','02-website-leistungen.png','03-website-so-funktionierts.png','04-eigentuemer-app-start.png','05-eigentuemer-app-hausmeister.png','06-eigentuemer-app-mein-haus.png','07-eigentuemer-app-tarife.png','08-handwerker-app-start.png','09-handwerker-app-auftraege.png','10-handwerker-app-team.png','11-handwerker-app-profil.png']; let idx=0; for(let r=0;r<2;r++){for(let c=0;c<6;c++){if(idx>=imgs.length)break; const x=0.55+c*2.08, y=1.75+r*2.55; addImageFit(s,e,raw+imgs[idx],x,y,1.55,2.15,'raw'+idx,{radius:0.08}); idx++;}} finish(s,e,'overview'); }
// 11 close
{ const s=pptx.addSlide(), e=[]; bg(s,e,C.dark); txt(s,e,'CEO Readout',0.75,0.85,4.5,0.42,{size:18,bold:true,color:C.green}); txt(s,e,'Das ist jetzt präsentationsfähig.',0.75,1.45,6.25,0.64,{size:38,bold:true,color:C.white}); txt(s,e,'Die Screenshots wurden bewusst kuratiert: breite Website-Ausschnitte, fokussierte App-Screens, klare Trennung der drei Rollen und ein Ende-zu-Ende-Narrativ für das Team.',0.8,2.34,6.5,1.1,{size:18,color:'D9E5DE'}); addImageFit(s,e,D+'web_process.png',7.4,1.2,4.8,2.0,'close web',{fill:'0D2A1E',line:'245B42'}); addImageFit(s,e,D+'owner_tariffs.png',7.7,3.65,1.75,2.7,'close owner',{fill:'0D2A1E',line:'245B42'}); addImageFit(s,e,D+'craft_team.png',10.05,3.65,1.75,2.7,'close craft',{fill:'0D2A1E',line:'245B42'}); finish(s,e,'close'); }
if(warnings.length){ console.error('LAYOUT_WARNINGS\n'+warnings.join('\n')); process.exitCode=2; }
pptx.writeFile({ fileName: 'presentation/einfachhausen-live-professional-2026-08-26.pptx' });
