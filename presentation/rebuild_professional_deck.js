const pptxgen = require('./node_modules/pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'einfachhausen.de';
pptx.subject = 'Live screenshots: Website, Eigentümer-App, Handwerker-App';
pptx.title = 'einfachhausen.de Live Produktpräsentation';
pptx.company = 'einfachhausen.de';
pptx.lang = 'de-DE';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'de-DE'
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;
pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: 'F6F8F6' },
  objects: [],
  slideNumber: { x: 12.35, y: 7.08, fontFace: 'Aptos', fontSize: 8, color: '6E7B72' }
});

const A = 'presentation/professional-assets';
const GREEN = '0B6B43';
const DARK = '17211B';
const MUTED = '5C6A62';
const LIGHT = 'F6F8F6';
const MINT = 'DDEDE4';
const GOLD = 'F4D27A';
const WHITE = 'FFFFFF';

function img(name){ return path.join(A,name); }
function addBg(slide, color=LIGHT){ slide.background = { color }; }
function addBrand(slide, dark=false){
  slide.addText('⌂', {x:0.45,y:0.25,w:0.22,h:0.24,fontSize:17,bold:true,color:dark?'AEE0C8':GREEN,margin:0});
  slide.addText('einfachhausen', {x:0.75,y:0.26,w:2.0,h:0.25,fontSize:14,bold:true,color:dark?WHITE:DARK,margin:0});
}
function title(slide, t, sub, opt={}){
  slide.addText(t,{x:0.58,y:0.65,w:opt.w||6.9,h:0.55,fontSize:opt.size||26,bold:true,color:opt.color||DARK,breakLine:false,fit:'shrink',margin:0});
  if(sub) slide.addText(sub,{x:0.60,y:1.24,w:opt.sw||5.7,h:0.42,fontSize:11.5,color:opt.scolor||MUTED,fit:'shrink',margin:0.02,breakLine:false});
}
function tag(slide, text, x, y, w, color=GREEN, fill='E8F4EE'){
  slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h:0.28,rectRadius:0.06,fill:{color:fill},line:{color:fill,transparency:100}});
  slide.addText(text,{x:x+0.12,y:y+0.065,w:w-0.24,h:0.12,fontSize:8,bold:true,color,margin:0,breakLine:false,fit:'shrink'});
}
function addImg(slide, file, x,y,w,h, opts={}){
  slide.addImage({path:file,x,y,w,h,shadow: opts.shadow ? {type:'outer',color:'000000',opacity:0.14,blur:2,angle:45,distance:1.2}: undefined});
}
function addPanel(slide,x,y,w,h,fill='FFFFFF',line='DCE4DE'){
  slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:fill},line:{color:fill, transparency:100}});
  slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:fill,transparency:100},line:{color:line,width:1}});
}
function addCover(slide, file, x,y,w,h){
  // place with crop like object-fit cover using native sizingCrop is unreliable in older builds; pre-cropped assets are already focused.
  addImg(slide,file,x,y,w,h,{shadow:true});
}
function phone(slide, name, x, y, h){
  const w = h * 434/888; // mockup output is 434x888
  addImg(slide,img(name),x,y,w,h,{shadow:true});
  return w;
}
function bullet(slide, txt, x, y, w){
  slide.addText('✓',{x,y,w:0.22,h:0.18,fontSize:10,bold:true,color:GREEN,margin:0});
  slide.addText(txt,{x:x+0.28,y:y-0.01,w,h:0.25,fontSize:10.5,color:DARK,bold:false,fit:'shrink',margin:0});
}
function splitLine(slide, x=0.58,y=6.85){
  slide.addShape(pptx.ShapeType.line,{x,y,w:12.15,h:0,line:{color:'DDE5E0',width:1}});
}

// 1
{
 const s=pptx.addSlide('MASTER'); addBg(s,'0B3D2A'); addBrand(s,true);
 s.addText('Live-Produktstand',{x:0.75,y:1.06,w:4.5,h:0.36,fontSize:13,bold:true,color:'AEE0C8',margin:0});
 s.addText('einfachhausen.de',{x:0.72,y:1.45,w:5.8,h:0.76,fontSize:36,bold:true,color:WHITE,margin:0,fit:'shrink'});
 s.addText('Website · Eigentümer-App · Handwerker-App',{x:0.75,y:2.28,w:4.6,h:0.35,fontSize:15,color:'DCEFE5',margin:0});
 s.addText('Aktuelle Live-Screenshots vom Produktionssystem, professionell zugeschnitten für Team-Review und Vorstellung.',{x:0.75,y:3.0,w:4.35,h:0.65,fontSize:13,color:'DCEFE5',margin:0.01,fit:'shrink'});
 tag(s,'LIVE DEPLOYMENT VERIFIED',0.75,4.06,2.18,'0B3D2A','B9E8CC');
 s.addText('Commit main/production: 3a8aa93 · Healthcheck: ok / database ready',{x:0.75,y:4.48,w:4.5,h:0.25,fontSize:9.5,color:'DCEFE5',margin:0});
 addImg(s,img('web_hero.png'),6.05,0.7,6.55,3.0,{shadow:true});
 phone(s,'owner_home_top_phone.png',7.0,3.75,3.25);
 phone(s,'pro_start_phone.png',9.15,3.75,3.25);
 phone(s,'owner_hausmeister_phone.png',11.3,3.75,3.25);
}
// 2
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Drei Oberflächen, ein Ablauf','Vom ersten Eindruck bis zur operativen Ausführung: alles im gleichen visuellen System.');
 addPanel(s,0.7,1.95,3.65,4.35,'FFFFFF'); addCover(s,img('web_services_top.png'),0.95,2.22,3.15,1.9); tag(s,'WEBSITE',1.0,4.42,1.0); s.addText('Vertrauen aufbauen, Wert erklären, Besucher in konkrete Anfrage führen.',{x:1.0,y:4.82,w:2.85,h:0.62,fontSize:13,bold:true,color:DARK,fit:'shrink',margin:0}); bullet(s,'Klarer Nutzen',1.0,5.65,2.4); bullet(s,'Service-Versprechen',1.0,5.98,2.4);
 addPanel(s,4.83,1.95,3.65,4.35,'FFFFFF'); phone(s,'owner_home_top_phone.png',5.4,2.15,2.95); tag(s,'EIGENTÜMER-APP',5.08,4.42,1.55); s.addText('Alles rund ums Haus: Anliegen, Hausakte, Ansprechpartner und Tarife.',{x:5.08,y:4.82,w:2.85,h:0.62,fontSize:13,bold:true,color:DARK,fit:'shrink',margin:0}); bullet(s,'Schneller Hausmeister-Kontakt',5.08,5.65,2.7); bullet(s,'Dokumente & Verlauf',5.08,5.98,2.7);
 addPanel(s,8.96,1.95,3.65,4.35,'FFFFFF'); phone(s,'pro_start_phone.png',9.55,2.15,2.95); tag(s,'HANDWERKER-APP',9.2,4.42,1.55); s.addText('Partnerzugang mit Aufträgen, Teamverwaltung und Profilprüfung.',{x:9.2,y:4.82,w:2.85,h:0.62,fontSize:13,bold:true,color:DARK,fit:'shrink',margin:0}); bullet(s,'Prüfung vor Auftragsfreigabe',9.2,5.65,2.9); bullet(s,'Operative Partnerdaten',9.2,5.98,2.9);
 splitLine(s);
}
// 3
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Website: erster Eindruck sitzt','Hero, Nutzenversprechen und visuelle Führung wurden als breite Desktop-Flächen zugeschnitten.');
 addCover(s,img('web_hero.png'),0.68,1.74,7.0,3.55);
 addPanel(s,8.05,1.75,4.55,3.56,'FFFFFF'); s.addText('Warum dieser Schnitt funktioniert',{x:8.38,y:2.05,w:3.6,h:0.35,fontSize:18,bold:true,color:DARK,margin:0});
 bullet(s,'Header, Claim und primäre CTA bleiben komplett sichtbar.',8.38,2.75,3.6); bullet(s,'Keine langen Scroll-Screenshots mehr, sondern präsentierbare Bühne.',8.38,3.22,3.6); bullet(s,'Genug Weißraum für Diskussion im Team.',8.38,3.69,3.6);
 tag(s,'Team-Review: Above-the-fold',8.38,4.42,2.25);
 addCover(s,img('web_value.png'),0.68,5.62,5.2,1.16);
 addCover(s,img('web_cta.png'),6.10,5.62,6.5,1.16);
}
// 4
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Website: Angebot und Ablauf','Service-Seite und “So funktioniert’s” als zwei klare Argumentationsflächen.');
 addCover(s,img('web_services_cards.png'),0.72,1.82,5.95,4.85);
 addCover(s,img('web_how_steps.png'),6.92,1.82,5.68,4.85);
 tag(s,'Leistungen',0.95,6.28,1.15); tag(s,'Prozess',7.15,6.28,1.0);
}
// 5
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Eigentümer-App: Anliegen sofort erfassen','Der Hausmeister-Einstieg steht als wichtigste Nutzungs-Situation im Fokus.');
 phone(s,'owner_home_top_phone.png',0.92,1.42,5.55); phone(s,'owner_hausmeister_phone.png',3.70,1.42,5.55);
 addPanel(s,7.1,1.7,4.95,4.35,'FFFFFF'); s.addText('Story für die Vorstellung',{x:7.45,y:2.05,w:3.8,h:0.35,fontSize:20,bold:true,color:DARK,margin:0});
 bullet(s,'Bewohner startet nicht mit Formularwüste, sondern mit einer konkreten Frage.',7.45,2.75,4.1); bullet(s,'Foto, Sprache und kurzer Text sind direkt vorbereitet.',7.45,3.34,4.1); bullet(s,'Freigabe-Hinweis schützt vor ungeplanten Aufträgen.',7.45,3.93,4.1);
 tag(s,'Kernbotschaft: schnell, sicher, niedrigschwellig',7.45,4.82,3.35);
}
// 6
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Eigentümer-App: Hausakte und Tarife','Nicht nur Meldung, sondern dauerhafte digitale Hausbetreuung.');
 phone(s,'owner_house_top_phone.png',0.9,1.42,5.35); phone(s,'owner_tariffs_top_phone.png',3.50,1.42,5.35);
 addCover(s,img('owner_house_docs.png'),6.35,1.74,2.25,4.65); addCover(s,img('owner_tariffs_details.png'),8.95,1.74,2.25,4.65);
 s.addText('Für Team-Review',{x:11.55,y:2.02,w:1.0,h:0.25,fontSize:9,bold:true,color:GREEN,margin:0,rotate:90});
 bullet(s,'Hausakte: Technik, Dokumente, Historie.',11.1,2.6,1.5); bullet(s,'Tarife: Upsell-Fläche mit dauerhaftem Nutzen.',11.1,3.25,1.5); bullet(s,'Passende nächste Frage: Welche Inhalte müssen MVP sein?',11.1,3.9,1.55);
}
// 7
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Handwerker-App: Zugang kontrolliert','Der echte Live-Zustand zeigt bewusst die Partnerprüfung vor Auftragsfreigabe.');
 phone(s,'pro_start_phone.png',0.95,1.42,5.55); phone(s,'pro_jobs_phone.png',3.73,1.42,5.55);
 addPanel(s,7.1,1.7,4.95,4.35,'FFFFFF'); s.addText('Wichtig für Betrieb & Qualität',{x:7.45,y:2.05,w:3.8,h:0.35,fontSize:20,bold:true,color:DARK,margin:0});
 bullet(s,'Keine ungeprüften Partner sehen produktive Aufträge.',7.45,2.75,4.1); bullet(s,'Der Status erklärt, warum noch keine Anfragen sichtbar sind.',7.45,3.34,4.1); bullet(s,'Aufträge bleiben als eigener Arbeitsbereich sichtbar.',7.45,3.93,4.1);
 tag(s,'Live-Status: Unternehmensprüfung ausstehend',7.45,4.82,3.2,'7A5B05','FFF3CC');
}
// 8
{
 const s=pptx.addSlide('MASTER'); addBg(s); addBrand(s); title(s,'Handwerker-App: Team und Profil','Die Partnerseite braucht Vertrauen: Wer arbeitet, welche Daten sind geprüft, was fehlt noch?');
 phone(s,'pro_team_top_phone.png',0.85,1.35,5.42); phone(s,'pro_profile_top_phone.png',3.45,1.35,5.42);
 addCover(s,img('pro_team_details.png'),6.25,1.76,2.13,4.45); addCover(s,img('pro_profile_company.png'),8.62,1.76,2.13,4.45); addCover(s,img('pro_profile_checks.png'),10.98,1.76,1.52,4.45);
 tag(s,'Team',0.98,6.42,0.76); tag(s,'Profil',3.58,6.42,0.82); tag(s,'Details',6.38,6.42,0.9);
}
// 9
{
 const s=pptx.addSlide('MASTER'); addBg(s,'F1F6F2'); addBrand(s); title(s,'Team-Story: vom Interesse zum erledigten Auftrag','So lässt sich das Produkt in fünf Minuten erklären.');
 const xs=[0.95,3.25,5.55,7.85,10.15]; const labels=['Website','Eigentümer-App','Prüfung','Auftrag','Partner-App']; const txt=['Vertrauen & Anfrage','Anliegen erfassen','Kontrolle & Freigabe','operative Zuordnung','Ausführung & Profil'];
 for(let i=0;i<5;i++){ addPanel(s,xs[i],2.05,1.72,2.15, i===0?'FFFFFF':(i===2?'FFF8E2':'FFFFFF')); s.addText(String(i+1),{x:xs[i]+0.16,y:2.25,w:0.3,h:0.2,fontSize:10,bold:true,color:GREEN,margin:0}); s.addText(labels[i],{x:xs[i]+0.16,y:2.68,w:1.35,h:0.28,fontSize:15,bold:true,color:DARK,margin:0,fit:'shrink'}); s.addText(txt[i],{x:xs[i]+0.16,y:3.08,w:1.35,h:0.55,fontSize:10.5,color:MUTED,margin:0.01,fit:'shrink'}); if(i<4) s.addShape(pptx.ShapeType.rightArrow,{x:xs[i]+1.83,y:2.85,w:0.82,h:0.44,fill:{color:'CFE4D6'},line:{color:'CFE4D6'}}); }
 s.addText('Diskussionspunkt für CEO/Team',{x:1.0,y:5.05,w:3.2,h:0.32,fontSize:17,bold:true,color:DARK,margin:0});
 bullet(s,'Welche Screens sind release-kritisch, welche Demo/Marketing?',1.0,5.62,4.5); bullet(s,'Welche Daten brauchen wir als echte Demo-Datensätze?',1.0,6.02,4.5); bullet(s,'Welche Freigabe- und Prüftexte müssen juristisch sauber sein?',1.0,6.42,4.9);
 addCover(s,img('web_how_top.png'),7.0,4.85,5.2,1.7);
}
// 10
{
 const s=pptx.addSlide('MASTER'); addBg(s,'0B3D2A'); addBrand(s,true);
 s.addText('Nächste professionelle Schritte',{x:0.75,y:0.92,w:5.2,h:0.55,fontSize:28,bold:true,color:WHITE,margin:0,fit:'shrink'});
 s.addText('Für die Team-Vorstellung ist jetzt eine saubere visuelle Basis da. Danach sollte das Team nicht über “Screenshots” sprechen, sondern über Conversion, Betrieb und Freigaben.',{x:0.78,y:1.62,w:5.1,h:0.82,fontSize:13,color:'DCEFE5',margin:0.01,fit:'shrink'});
 addPanel(s,0.82,2.86,3.4,2.45,'124D36','3C785E'); s.addText('1 · Präsentieren',{x:1.08,y:3.15,w:2.75,h:0.25,fontSize:12,bold:true,color:'AEE0C8',margin:0}); s.addText('Einmal durch die Story gehen: Website → Eigentümer → Handwerker.',{x:1.08,y:3.62,w:2.65,h:0.62,fontSize:15,bold:true,color:WHITE,margin:0.01,fit:'shrink'});
 addPanel(s,4.88,2.86,3.4,2.45,'124D36','3C785E'); s.addText('2 · Entscheiden',{x:5.14,y:3.15,w:2.75,h:0.25,fontSize:12,bold:true,color:'AEE0C8',margin:0}); s.addText('MVP-Freigaben, Demo-Daten, kritische Texte und Partnerprüfung festlegen.',{x:5.14,y:3.62,w:2.65,h:0.62,fontSize:15,bold:true,color:WHITE,margin:0.01,fit:'shrink'});
 addPanel(s,8.94,2.86,3.4,2.45,'124D36','3C785E'); s.addText('3 · Umsetzen',{x:9.20,y:3.15,w:2.75,h:0.25,fontSize:12,bold:true,color:'AEE0C8',margin:0}); s.addText('Screens für Vertrieb, Demo und Produktreview getrennt weiterentwickeln.',{x:9.20,y:3.62,w:2.65,h:0.62,fontSize:15,bold:true,color:WHITE,margin:0.01,fit:'shrink'});
 s.addText('Datei: presentation/einfachhausen-live-professional-2026-08-26.pptx',{x:0.84,y:6.67,w:8.5,h:0.22,fontSize:9,color:'DCEFE5',margin:0});
}

// lightweight sanity: element bounds are hand-set; keep slide count stable.
pptx.writeFile({ fileName: 'presentation/einfachhausen-live-professional-2026-08-26.pptx' });
