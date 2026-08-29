const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'OpenSIN / ChatGPT';
pptx.subject = 'Einfachhausen Live-Präsentation';
pptx.title = 'Einfachhausen Live-Produktdemo';
pptx.company = 'einfachhausen';
pptx.lang = 'de-DE';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'de-DE'
};
pptx.defineLayout({ name:'LAYOUT_WIDE', width:13.333, height:7.5 });
pptx.layout='LAYOUT_WIDE';
const W=13.333,H=7.5;
const C={green:'166B45',mint:'9BC6B3',dark:'14221B',text:'1B211E',muted:'62706A',line:'DCE7E0',cream:'F8F5EA',bg:'F5F7F4',white:'FFFFFF',gold:'D8B65D'};
const asset = (n)=>path.join('presentation','edited',n+'.png');
const raw = (n)=>path.join('presentation',n+'.png');

function bg(slide, section=''){
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect,{x:0,y:0,w:W,h:H,fill:{color:C.bg},line:{color:C.bg}});
  slide.addText('einfachhausen',{x:0.58,y:0.34,w:2.1,h:0.25,fontSize:15,bold:true,color:C.dark,margin:0});
  slide.addText('Live-Produktdemo · 26.08.2026',{x:10.0,y:0.36,w:2.75,h:0.20,fontSize:8.5,color:C.muted,align:'right',margin:0});
  if(section) slide.addText(section.toUpperCase(),{x:0.62,y:0.78,w:2.8,h:0.18,fontSize:7.6,bold:true,color:C.green,charSpace:1.2,margin:0});
}
function title(slide, t, sub){
  slide.addText(t,{x:0.62,y:0.98,w:5.6,h:0.75,fontSize:31,bold:true,color:C.text,breakLine:false,fit:'shrink',margin:0});
  if(sub) slide.addText(sub,{x:0.64,y:1.78,w:5.6,h:0.45,fontSize:13,color:C.muted,breakLine:false,fit:'shrink',margin:0.02});
}
function pill(slide,t,x,y,w,c=C.green){slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h:0.32,rectRadius:0.06,fill:{color:c},line:{color:c}});slide.addText(t,{x:x+0.12,y:y+0.085,w:w-0.24,h:0.12,fontSize:8.5,bold:true,color:C.white,margin:0,align:'center'});}
function note(slide,t,x,y,w,h){slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:C.white,transparency:4},line:{color:C.line,transparency:0}});slide.addText(t,{x:x+0.22,y:y+0.22,w:w-0.44,h:h-0.44,fontSize:13,color:C.text,fit:'shrink',breakLine:false,margin:0});}
function addImg(slide,src,x,y,w,h,shadow=true){
  if(shadow) slide.addShape(pptx.ShapeType.roundRect,{x:x+0.05,y:y+0.08,w,h,rectRadius:0.12,fill:{color:'000000',transparency:88},line:{color:'000000',transparency:100}});
  slide.addImage({path:src,x,y,w,h,sizing:{type:'crop',x,y,w,h}});
}
function addContained(slide,src,x,y,w,h,shadow=true){
  if(shadow) slide.addShape(pptx.ShapeType.roundRect,{x:x+0.05,y:y+0.08,w,h,rectRadius:0.12,fill:{color:'000000',transparency:88},line:{color:'000000',transparency:100}});
  slide.addImage({path:src,x,y,w,h,sizing:{type:'contain',x,y,w,h}});
}
function phone(slide,src,x,y,h){
  const im = require('image-size').imageSize(src); const ratio=im.width/im.height; const w=h*ratio;
  slide.addImage({path:src,x,y,w,h,sizing:{type:'contain',x,y,w,h}}); return {w,h};
}
function bullets(slide,items,x,y,w){
  let yy=y; for(const [head,body] of items){slide.addText(head,{x,y:yy,w,h:0.22,fontSize:14,bold:true,color:C.text,margin:0}); slide.addText(body,{x,y:yy+0.28,w,h:0.42,fontSize:10.5,color:C.muted,fit:'shrink',margin:0}); yy+=0.88;}
}

// 1 cover
{ const s=pptx.addSlide(); bg(s); s.addText('Einfachhausen',{x:0.65,y:1.45,w:6.1,h:0.75,fontSize:42,bold:true,color:C.dark,margin:0}); s.addText('Live-Produktdemo für Website, Eigentümer-App und Handwerker-App',{x:0.68,y:2.25,w:5.8,h:0.55,fontSize:18,color:C.muted,margin:0}); pill(s,'LIVE · production einf achhausen.de'.replace('einf ach','einfach'),0.7,3.08,2.85,C.green); s.addText('Drei Oberflächen. Ein System: Anfrage, Freigabe, Ausführung, Dokumentation.',{x:0.72,y:4.78,w:5.4,h:0.58,fontSize:18,bold:true,color:C.text,fit:'shrink',margin:0}); addContained(s,asset('owner_home_phone'),6.55,0.95,2.05,5.85); addContained(s,asset('pro_start_phone'),8.6,1.18,1.9,5.35); addImg(s,asset('web_hero'),9.8,1.0,2.85,5.32); }
// 2 live check
{ const s=pptx.addSlide(); bg(s,'Live-Stand'); title(s,'Aktueller Produktionsstand','Screenshots direkt aus der Live-Umgebung, nach Abgleich mit GitHub main.'); note(s,'GitHub main und Produktion laufen auf demselben Commit: 3a8aa93. Healthcheck: ok=true, database=ready.',0.7,2.25,4.9,1.1); bullets(s,[['Keine Mockups','Alle Bilder wurden gegen https://einfachhausen.de aufgenommen.'],['Präsentationsschnitt','Lange Seiten wurden bewusst in aussagekräftige Abschnitte geschnitten.'],['Teamfähig','Jede Folie zeigt eine klare Produktaussage statt Roh-Screenshots.']],0.75,3.75,4.75); addImg(s,asset('web_hero'),6.25,1.05,6.35,5.82); }
// 3 website hero
{ const s=pptx.addSlide(); bg(s,'Website'); title(s,'Startseite: sofort verständlich','Die Website positioniert einfachhausen als kuratierte Hausmeister- und Service-Plattform.'); addImg(s,asset('web_hero'),5.95,0.95,6.65,5.95); bullets(s,[['Klares Versprechen','„Dein Zuhause. Wir kümmern uns.“ ist sichtbar und wiederholbar.'],['Direkter Einstieg','Primäre CTAs führen sofort Richtung Bedarf und Kontakt.'],['Vertrauensanker','Design wirkt ruhig, regional und serviceorientiert.']],0.75,2.45,4.6); }
// 4 website value/process
{ const s=pptx.addSlide(); bg(s,'Website'); title(s,'Vom Interesse zur Anfrage','Der Funnel erklärt Nutzen, Leistungen und Ablauf ohne den Nutzer zu überfordern.'); addImg(s,asset('web_services'),0.75,2.25,3.7,3.45); addImg(s,asset('web_process'),4.85,2.25,3.7,3.45); addImg(s,asset('web_value'),8.95,2.25,3.7,3.45); s.addText('Leistungen',{x:0.85,y:5.95,w:3.4,h:0.25,fontSize:12,bold:true,color:C.green,align:'center',margin:0}); s.addText('Ablauf',{x:4.95,y:5.95,w:3.4,h:0.25,fontSize:12,bold:true,color:C.green,align:'center',margin:0}); s.addText('Vertrauen',{x:9.05,y:5.95,w:3.4,h:0.25,fontSize:12,bold:true,color:C.green,align:'center',margin:0}); }
// 5 owner app overview
{ const s=pptx.addSlide(); bg(s,'Eigentümer-App'); title(s,'Eigentümer-App: Alltag zuerst','Die App startet nicht mit Verwaltung, sondern mit dem akuten Anliegen des Bewohners.'); addContained(s,asset('owner_home_phone'),5.05,1.1,2.15,5.7,false); addContained(s,asset('owner_assistant_phone'),7.45,1.43,1.9,4.95,false); addContained(s,asset('owner_house_phone'),9.55,1.25,2.05,5.35,false); bullets(s,[['Startpunkt Hausmeister','Beschreiben, sprechen oder Foto senden. Keine komplizierte Auswahl.'],['Freigabeprinzip','„Kein Auftrag ohne deine Freigabe“ schafft Kontrolle.'],['Hausakte','Dokumente, Technik und Ansprechpartner bleiben dauerhaft auffindbar.']],0.75,2.38,3.9); }
// 6 owner flows
{ const s=pptx.addSlide(); bg(s,'Eigentümer-App'); title(s,'Vom Problem zur Entscheidung','Die wichtigsten Eigentümer-Flows sind präsentationsreif zugeschnitten.'); addContained(s,asset('owner_assistant_phone'),0.85,1.75,2.25,5.0,false); addContained(s,asset('owner_tariffs_phone'),3.65,1.35,2.4,5.8,false); addContained(s,asset('owner_home_mid_phone'),6.55,1.95,2.35,4.9,false); note(s,'Diese Ansicht verkauft nicht nur eine App, sondern das Betriebsmodell: Anliegen aufnehmen, Orientierung geben, Angebot/Partner sauber freigeben.',9.35,2.25,3.1,2.35); }
// 7 craftsman app start
{ const s=pptx.addSlide(); bg(s,'Handwerker-App'); title(s,'Partner-App: Qualität vor Nachfrage','Der Partnerzugang zeigt bewusst erst den Prüfstatus, bevor Aufträge sichtbar werden.'); addContained(s,asset('pro_start_phone'),6.95,1.05,2.55,5.95,false); bullets(s,[['Kontrollierter Marktplatz','Neue Anfragen gehen nur an geprüfte, vertraglich gebundene Unternehmen.'],['Klare Erwartung','Der aktuelle Status „Unternehmensprüfung ausstehend“ ist kein Fehler, sondern ein Qualitätsgate.'],['Professionelle Wirkung','Das Partner-Onboarding fühlt sich verbindlich und seriös an.']],0.8,2.25,5.1); }
// 8 craftsman operations
{ const s=pptx.addSlide(); bg(s,'Handwerker-App'); title(s,'Operatives Cockpit für Partner','Nach der Freischaltung sind Aufträge, Team und Profil als Arbeitsbereiche vorbereitet.'); addContained(s,asset('pro_jobs_phone'),0.88,1.45,2.25,5.5,false); addContained(s,asset('pro_team_phone'),3.75,1.2,2.25,5.95,false); addContained(s,asset('pro_profile_top_phone'),6.65,1.35,2.3,5.65,false); addContained(s,asset('pro_profile_docs_phone'),9.55,1.32,2.35,5.65,false); }
// 9 system view
{ const s=pptx.addSlide(); bg(s,'Produktlogik'); title(s,'Ein System, drei Rollen','Die Live-Oberflächen erzählen jetzt dieselbe Produktgeschichte aus verschiedenen Perspektiven.'); addContained(s,asset('web_hero'),0.8,2.15,3.35,3.0); addContained(s,asset('owner_home_phone'),5.15,1.25,1.65,4.65,false); addContained(s,asset('pro_start_phone'),7.05,1.25,1.65,4.65,false); bullets(s,[['Website','Akquise und Erklärung des Modells.'],['Eigentümer-App','Anliegen, Freigabe, Hausakte und Tarife.'],['Handwerker-App','Prüfung, Aufträge, Team und Unternehmensprofil.']],9.45,2.25,3.0); }
// 10 CEO notes
{ const s=pptx.addSlide(); bg(s,'CEO-Readout'); title(s,'Was im Team entschieden werden sollte','Die Präsentation ist jetzt auf Review, Priorisierung und Go-to-Market ausgerichtet.'); note(s,'1 · Website-Message finalisieren: Ist der Claim klar genug für Eigentümer und WEGs?',0.85,2.0,5.65,0.72); note(s,'2 · Eigentümer-App testen: Versteht jeder Nutzer, dass erst nach Freigabe ein Auftrag entsteht?',0.85,3.05,5.65,0.72); note(s,'3 · Partner-Onboarding definieren: Welche Dokumente und Prüfungen sind Pflicht?',0.85,4.10,5.65,0.72); note(s,'4 · Demo-Daten ergänzen: Für Sales-Termine brauchen wir ggf. einen geprüften Partner-Testaccount.',0.85,5.15,5.65,0.72); addContained(s,asset('owner_home_phone'),7.1,1.2,2.0,5.4,false); addContained(s,asset('pro_jobs_phone'),9.55,1.42,2.0,4.95,false); }

pptx.writeFile({ fileName: 'presentation/einfachhausen-live-professional-2026-08-26.pptx' });
