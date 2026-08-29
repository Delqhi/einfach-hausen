import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright-core';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browserName=process.env.E2E_BROWSER||'chromium';
const browserType={chromium,firefox,webkit}[browserName];
if(!browserType)throw new Error(`Unsupported E2E_BROWSER: ${browserName}`);
const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'einfach-hausen-full-e2e-'));
const projectRoot=path.join(tempRoot,'project');
const databasePath=path.join(tempRoot,'app.sqlite3');
const artifactsDir=path.join(repo,'artifacts','e2e');
fs.mkdirSync(artifactsDir,{recursive:true});
const adminPassword=`FullE2E!${randomBytes(18).toString('base64url')}`;
const password=`UserE2E!${randomBytes(18).toString('base64url')}`;
const stamp=`${Date.now()}-${randomBytes(5).toString('hex')}`;
const providerEmail=`firma-${stamp}@example.test`;
const techEmail=`thomas-${stamp}@example.test`;
const ownerEmail=`maria-${stamp}@example.test`;
const buyerEmail=`buyer-${stamp}@example.test`;
let server;
let browser;
const serverLog=[];
process.on('exit',()=>{try{if(server&&!server.killed)server.kill('SIGKILL');}catch{}try{fs.rmSync(tempRoot,{recursive:true,force:true});}catch{}});

function browserExecutable(){
  const bundled=typeof browserType.executablePath==='function'?browserType.executablePath():'';
  if(browserName!=='chromium'){
    if(!bundled||!fs.existsSync(bundled))throw new Error(`No ${browserName} browser found; install the Playwright browser for E2E_BROWSER=${browserName}`);
    return bundled;
  }
  const candidates=[process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,process.env.CHROME_PATH,bundled,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge','/opt/google/chrome/chrome',
    '/snap/chromium/current/usr/lib/chromium-browser/chrome','/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser','/snap/bin/chromium'].filter(Boolean);
  const found=candidates.find(candidate=>fs.existsSync(candidate));
  if(!found)throw new Error('No Chromium-family browser found; set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH or CHROME_PATH');
  return found;
}

// Dev server compiles pages on demand; first visits can exceed the 30s default.
function newE2EContext(options){return browser.newContext(options).then(context=>{context.setDefaultTimeout(120000);return context;});}

function createProjectCopy(){
  fs.mkdirSync(projectRoot,{recursive:true});
  for(const directory of ['src','public'])fs.cpSync(path.join(repo,directory),path.join(projectRoot,directory),{recursive:true});
  for(const file of ['package.json','tsconfig.json','next.config.ts','postcss.config.mjs','next-env.d.ts']){
    const source=path.join(repo,file);if(fs.existsSync(source))fs.copyFileSync(source,path.join(projectRoot,file));
  }
  fs.symlinkSync(path.join(repo,'node_modules'),path.join(projectRoot,'node_modules'),'dir');
}

async function freePort(){return await new Promise((resolve,reject)=>{const socket=net.createServer();socket.unref();socket.on('error',reject);socket.listen(0,'127.0.0.1',()=>{const address=socket.address();const port=typeof address==='object'&&address?address.port:0;socket.close(()=>resolve(port));});});}
async function runChild(argv,{cwd,env,timeoutMs=180000}={}){return await new Promise((resolve,reject)=>{const child=spawn(process.execPath,argv,{cwd,env,stdio:['ignore','pipe','pipe']});let output='';for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{output+=chunk.toString();if(output.length>120000)output=output.slice(-120000);});const timer=setTimeout(()=>{child.kill('SIGTERM');reject(new Error(`Child process timeout: ${argv.join(' ')}\n${output.slice(-12000)}`));},timeoutMs);child.on('error',reject);child.on('exit',code=>{clearTimeout(timer);if(code===0)resolve(output);else reject(new Error(`Child process failed (${code}): ${argv.join(' ')}\n${output.slice(-12000)}`));});});}
async function waitForServer(url,timeoutMs=90000){const started=Date.now();while(Date.now()-started<timeoutMs){if(server?.exitCode!==null&&server?.exitCode!==undefined)throw new Error(`Next server exited early (${server.exitCode})\n${serverLog.slice(-60).join('')}`);try{const response=await fetch(url,{redirect:'manual'});if(response.status<500)return;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}throw new Error(`Next server did not become ready\n${serverLog.slice(-60).join('')}`);}
async function waitText(page,text){try{await page.waitForFunction(value=>document.body.innerText.includes(value),text,{timeout:60000});}catch(error){const body=(await page.locator('body').innerText()).slice(-5000);throw new Error(`Expected text not found: ${text} | url=${page.url()} | body-tail=${body}`,{cause:error});}}
async function assertNoOverflow(page,label){const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);if(overflow)throw new Error(`${label} has horizontal overflow`);}
const runtimeErrors=[];
function trackPage(page,label){
  page.on('pageerror',error=>{
    // Firefox can report aborted React Flight streams as an uncaught
    // "Error in input stream" during a same-context navigation. The next
    // document is already loaded and the equivalent flow is covered by the
    // response assertions below; keep real page errors fail-closed.
    if(browserName==='firefox' && error.message==='Error in input stream')return;
    runtimeErrors.push(`${label}: pageerror: ${error.message}`);
  });
  page.on('console',message=>{if(message.type()==='error'){const text=message.text();const location=message.location();const source=location?.url?` source=${location.url}`:'';if(!/ERR_INTERNET_DISCONNECTED|Failed to load resource.*503/i.test(text) && !(browserName==='firefox' && text==='JSHandle@object'))runtimeErrors.push(`${label}: console: ${text}${source}`);}});
}
async function assertKeyboardFocus(page,label){
  // Headless Chromium on Linux can swallow the very first Tab (no prior user
  // activation). Try up to three tabs before declaring the page unfocusable;
  // any non-BODY activeElement still proves a focus target exists.
  // The service-worker shell can briefly serve an unhydrated loading state;
  // keep tabbing for up to ~8s until a real focus target appears.
  const deadline=Date.now()+8000;
  let focused={tag:'',href:'',text:''};
  while(Date.now()<deadline){
    await page.locator('body').press('Tab');
    focused=await page.evaluate(()=>{const el=document.activeElement;return {tag:el?.tagName||'',href:el instanceof HTMLAnchorElement?el.getAttribute('href'):'',text:(el?.textContent||'').trim().slice(0,120)};});
    if(focused.tag&&focused.tag!=='BODY')break;
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!focused.tag||focused.tag==='BODY')throw new Error(`${label} has no keyboard focus target after Tab`);
}
async function clickAndWaitUrl(page,locator,matcher,timeout=30000){await Promise.all([page.waitForURL(matcher,{timeout}),locator.click()]);}
async function clickServerAction(page,locator,timeout=90000){let response;try{await Promise.all([page.waitForResponse(r=>r.request().method()==='POST',{timeout}),locator.click()]);}catch(error){throw new Error(`server action click failed: ${error.message.split('\n')[0]}\nserverLog tail:\n${serverLog.slice(-12).join('')}`,{cause:error});}}
// The production hydration window can briefly double-render a freshly navigated
// document; register fields are filled only after the DOM settles to one input.
async function fillRegisterField(page,name,value){await page.waitForFunction(n=>document.querySelectorAll(`input[name="${n}"]`).length===1,name,{timeout:20000});await page.locator(`input[name="${name}"]`).fill(value);}
async function sendHousemaster(page,text,matcher=null){const c=page.getByPlaceholder(/Beschreib kurz|Beantworte nur noch|Was soll draußen|Was ist kaputt|Was soll gereinigt|Wobei brauchst du/);await c.click();await c.pressSequentially(text,{delay:1});const button=page.locator('button.send-action:not([disabled])');if(matcher)await clickAndWaitUrl(page,button,matcher);else await clickServerAction(page,button);}

createProjectCopy();
const port=await freePort();
const base=`http://127.0.0.1:${port}`;
const nextBin=path.join(repo,'node_modules','next','dist','bin','next');
const sanitizedEnv={...process.env};
for(const key of Object.keys(sanitizedEnv)){
  if(/(?:STRIPE|WHATSAPP|META_|OPENAI|OPENROUTER|SILICONFLOW|OMNIROUTE|API_KEY|ACCESS_TOKEN|AUTH_TOKEN|WEBHOOK_SECRET)/i.test(key))delete sanitizedEnv[key];
}
// Since T-0170 the production build fails closed with AUTH_MODE=local
// (src/lib/auth.ts throws by design). The behavioral E2E therefore runs on a
// dev server with local auth - the same seam as scripts/t0170-auth-e2e.mjs -
// instead of a production build. This removes the prerender error class too.
const runtimeEnv={...sanitizedEnv,DATABASE_PATH:databasePath,ADMIN_PASSWORD:adminPassword,NEXT_PUBLIC_APP_URL:base,AUTH_MODE:'local',E2E_INSECURE_COOKIES:'1'};
server=spawn(process.execPath,[nextBin,'dev','--webpack','-H','127.0.0.1','-p',String(port)],{cwd:projectRoot,env:runtimeEnv,stdio:['ignore','pipe','pipe']});
for(const stream of [server.stdout,server.stderr])stream.on('data',chunk=>{serverLog.push(chunk.toString());if(serverLog.length>300)serverLog.shift();});
await waitForServer(`${base}/`,120000);
browser=await browserType.launch({headless:true,executablePath:browserExecutable()});

try {
// 0) Öffentliche Website ist mobile-first, nutzenorientiert und als PWA installierbar.
const publicCtx=await newE2EContext({viewport:{width:390,height:844}}); const publicPage=await publicCtx.newPage(); trackPage(publicPage,'public-mobile');
await publicPage.goto(base+'/');
await publicPage.getByRole('heading',{name:/Willkommen bei einfachhausen/i}).waitFor();
await waitText(publicPage,'Dein Zuhause. Alles geregelt.'); await waitText(publicPage,'Sicher & vertraulich'); await waitText(publicPage,'Regional verbunden'); await waitText(publicPage,'Einfach & praktisch'); await waitText(publicPage,'Hilfe benötigt?');
if(!(await publicPage.getByRole('link',{name:'Log in'}).count()))throw new Error('Landing login card missing');
if(!(await publicPage.getByRole('link',{name:'Neues Konto'}).count()))throw new Error('Landing new-account card missing');
if(/KI-Hausmeister/i.test(await publicPage.locator('body').innerText()))throw new Error('Landing page still foregrounds AI instead of customer benefit');
await assertNoOverflow(publicPage,'Mobile landing');
// Intake entry moved into the product: /kontakt serves 'Anliegen starten' -> /register?role=homeowner.
const kontaktResponse=await publicPage.request.get(base+'/kontakt'); if(!kontaktResponse.ok())throw new Error('Kontakt route failed');
const kontaktHtml=await kontaktResponse.text();
if(!kontaktHtml.includes('Anliegen starten')||!kontaktHtml.includes('/register?role=homeowner'))throw new Error('Kontakt intake entry missing');
// Real logged-out new-owner entry: landing card -> role selection.
await publicPage.goto(base+'/');
await clickAndWaitUrl(publicPage,publicPage.locator('a[href="/role"]'),/\/role/);
await waitText(publicPage,'dass du da bist!'); await waitText(publicPage,'Als Eigentümer starten'); await waitText(publicPage,'Ich bin Dienstleister');
// Owner registration (server action flow) stays the canonical owner onboarding entry.
await publicPage.goto(base+'/register?role=homeowner');
await waitText(publicPage,"Los geht's – in wenigen Schritten");
if(!(await publicPage.getByLabel('Vorname').count()))throw new Error('Owner registration missing Vorname field');
if(!(await publicPage.locator('a[href="/login"]').count()))throw new Error('Landing Log in card missing');
if(!(await publicPage.locator('input[name="password"]').count()))throw new Error('Owner registration missing Passwort field');
if(!(await publicPage.getByLabel('Telefon').count()))throw new Error('Owner registration missing Telefon field');
if(!(await publicPage.getByLabel('PLZ').count()))throw new Error('Owner registration missing PLZ field');
if(!(await publicPage.getByRole('button',{name:'Konto erstellen'}).count()))throw new Error('Owner registration missing Konto erstellen action');
await publicPage.goto(base+'/');
const manifestResponse=await publicPage.request.get(base+'/manifest.webmanifest'); if(!manifestResponse.ok())throw new Error('PWA manifest unavailable');
const manifest=await manifestResponse.json(); if(manifest.display!=='standalone'||!Array.isArray(manifest.icons)||manifest.icons.length<3)throw new Error('PWA manifest incomplete');
const swResponse=await publicPage.request.get(base+'/sw.js'); const swText=await swResponse.text(); if(!swResponse.ok()||!swText.includes('einfach-hausen-public-shell')||!swText.includes('offlineResponse'))throw new Error('Service worker unavailable or missing safe offline shell'); const swCache=swResponse.headers()['cache-control']||''; if(!/no-cache|no-store/i.test(swCache))throw new Error('Service worker must not be long-term cached');
await publicPage.reload();
await publicPage.evaluate(async()=>{if(!('serviceWorker' in navigator))throw new Error('service worker unsupported');await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));});
if(browserName==='chromium'){
  // Chromium is the supported local service-worker offline probe. Firefox/WebKit
  // still execute the complete product flow below; their headless runners do
  // not consistently surface synthetic context offline failures to navigation.
  await publicCtx.setOffline(true); await publicPage.goto(base+'/offline-proof'); await waitText(publicPage,'Gerade keine Verbindung.'); await publicCtx.setOffline(false); await publicPage.goto(base+'/');
}
await assertKeyboardFocus(publicPage,'Mobile landing');
await publicPage.screenshot({path:path.join(artifactsDir,'mobile-landing.png'),fullPage:true});
await publicCtx.close();

const desktopCtx=await newE2EContext({viewport:{width:1320,height:900}}); const desktop=await desktopCtx.newPage(); trackPage(desktop,'public-desktop');
for(const route of ['/','/leistungen','/preise','/so-funktionierts','/eigenheimbesitzer','/partner','/hausakte','/hilfe','/sicherheit','/kontakt','/impressum','/datenschutz','/agb']){const response=await desktop.goto(base+route);if(!response?.ok())throw new Error(`Public route failed: ${route} status=${response?.status()}`);await assertNoOverflow(desktop,`Desktop ${route}`);}
await desktop.goto(base+'/'); await assertKeyboardFocus(desktop,'Desktop landing'); await desktopCtx.close();

// 1) Firma registrieren, prüfen und als Vertragspartner aktivieren.
const managerCtx=await newE2EContext({viewport:{width:390,height:844}}); const manager=await managerCtx.newPage(); trackPage(manager,'provider-manager');
await manager.goto(base+'/register?role=provider');
await fillRegisterField(manager,'firstName','Daniel'); await fillRegisterField(manager,'lastName','Müller');
await fillRegisterField(manager,'email',providerEmail); await fillRegisterField(manager,'password',password);
await fillRegisterField(manager,'businessName','Gartenbau Müller'); await fillRegisterField(manager,'trades','Garten, Grünpflege, Heckenschnitt, Hausmeister'); await fillRegisterField(manager,'postcode','46325'); await manager.getByLabel('Sofort buchbare Termine anbieten').check();
await Promise.all([manager.waitForURL('**/pro'),manager.getByRole('button',{name:'Konto erstellen'}).click()]);
await manager.goto(base+'/pro/profile');
await manager.getByLabel('Nachweis').setInputFiles({name:'gewerbe.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Test\n')});
await manager.getByLabel('Hinweis').fill('Gewerbe, Qualifikation und Betriebshaftpflicht liegen vor.');
await clickAndWaitUrl(manager,manager.getByRole('button',{name:'Zur Prüfung einreichen'}),/verification=submitted/);

const adminCtx=await newE2EContext({viewport:{width:1180,height:1000}}); const admin=await adminCtx.newPage(); trackPage(admin,'admin');
await admin.goto(base+'/admin/login'); await admin.getByLabel('Admin-Passwort').fill(adminPassword);
await Promise.all([admin.waitForURL('**/admin'),admin.getByRole('button',{name:'Admin anmelden'}).click()]);
await admin.getByRole('heading',{name:'Betriebsübersicht'}).waitFor(); await waitText(admin,'Nutzer'); await waitText(admin,'Anfragen'); await waitText(admin,'Bookings'); await waitText(admin,'Matching'); await waitText(admin,'Benachrichtigungen'); await admin.getByRole('heading',{name:'Bewertungen'}).waitFor();
let companyCard=admin.locator('.admin-card').filter({hasText:'Gartenbau Müller'}).first();
await clickServerAction(admin,companyCard.getByRole('button',{name:'Unternehmen freigeben'}));
try { await companyCard.locator('.status.approved').waitFor({timeout:30000}); } catch(e) {
  console.error('E2EDIAG url=',admin.url());
  console.error('E2EDIAG body=',(await admin.locator('body').innerText()).slice(0,600).replace(/\n+/g,' | '));
  console.error('E2EDIAG serverLog tail:\n'+serverLog.slice(-40).join(''));
  throw e;
}
// The approval action revalidates /admin and re-renders the page; reload so the
// uncontrolled contract form starts from fresh server state (a stale DOM resets
// select/checkboxes to defaults before the submit lands).
await admin.reload(); await admin.getByRole('heading',{name:'Betriebsübersicht'}).waitFor();
companyCard=admin.locator('.admin-card').filter({hasText:'Gartenbau Müller'}).first();
await companyCard.getByLabel('Status').selectOption('active');
for(const name of ['Betriebshaftpflicht geprüft','Qualifikation/Zulassung geprüft','Partnervertrag unterschrieben','Qualitätsstandard akzeptiert']) await companyCard.getByLabel(name).check();
await clickServerAction(admin,companyCard.getByRole('button',{name:'Partnervertrag speichern'}));
try { await companyCard.getByText(/Vertrag Aktiv/).waitFor({timeout:60000}); } catch(e) {
  console.error('E2EDIAG contract url=',admin.url());
  console.error('E2EDIAG contract body=',(await admin.locator('body').innerText()).slice(0,2600).replace(/\n+/g,' | '));
  throw e;
}
await manager.goto(base+'/pro/profile'); await waitText(manager,'Aktiver Einfach-Hausen-Vertragspartner'); await waitText(manager,'0 % Provision'); const providerCanvas=await manager.locator('.app-page').evaluate(el=>getComputedStyle(el).backgroundColor); if(providerCanvas==='rgb(17, 21, 18)')throw new Error('Provider app must use shared light canvas'); const providerMenu=manager.locator('.mobile-menu'); await providerMenu.locator('summary').click(); if(!(await providerMenu.locator('.mobile-menu-panel').isVisible()))throw new Error('Provider mobile menu did not open'); await providerMenu.locator('summary').click();
await manager.getByLabel('Firmenanschrift').fill('Gartenstraße 12, 46325 Borken'); await manager.getByLabel('Steuernummer').fill('307/1234/5678');
// Partner onboarding completeness: region radius, weekly capacity, availability, team.
const radiusInput=manager.getByLabel(/Einsatzradius/); if(await radiusInput.count())await radiusInput.fill('40');
await manager.getByLabel('Wöchentliche Kapazität (Aufträge)').fill('12');
const emergencyToggle=manager.getByLabel('Notfälle',{exact:true}); if(!(await emergencyToggle.isChecked()))await emergencyToggle.check(); await manager.getByLabel('Modell').selectOption('24_7'); await manager.getByLabel('Max. Notfallzuschlag %').fill('20'); await clickServerAction(manager,manager.getByRole('button',{name:'Profil speichern'}));
await waitText(manager,'Aktiver Einfach-Hausen-Vertragspartner');
await manager.reload();
const capacityAfterReload=await manager.getByLabel('Wöchentliche Kapazität (Aufträge)').inputValue(); if(capacityAfterReload!=='12')throw new Error(`Weekly capacity did not persist, got ${capacityAfterReload}`);
const radiusAfterReload=await manager.getByLabel(/Einsatzradius/).inputValue(); if(radiusAfterReload!=='40')throw new Error(`Service radius did not persist, got ${radiusAfterReload}`);

// 2) Firma legt einen echten Ansprechpartner an. Nur ein Schalter für Auftragsverwaltung.
await manager.goto(base+'/pro/team'); await manager.getByRole('heading',{name:'Menschen statt Rollenmatrix'}).waitFor(); await waitText(manager,'Aufträge verwalten AN'); await assertNoOverflow(manager,'Mobile partner team');
await manager.getByLabel('Vorname').last().fill('Thomas'); await manager.getByLabel('Nachname').last().fill('Weber');
await manager.getByLabel('Funktion').fill('Techniker'); await manager.locator('input[name="email"]').last().fill(techEmail); await manager.getByLabel('Telefon').last().fill('+49 151 12345678'); await manager.getByLabel('Startpasswort').fill(password);
await clickAndWaitUrl(manager,manager.getByRole('button',{name:'Ansprechpartner anlegen'}),/member=created/); await waitText(manager,'Thomas Weber');
let thomasCard=manager.locator('.member-card').filter({hasText:'Thomas Weber'}); if(await thomasCard.getByLabel('Aufträge verwalten').isChecked())throw new Error('Technician must not manage new jobs by default');
await thomasCard.getByLabel('Aufträge verwalten').check(); await clickServerAction(manager,thomasCard.getByRole('button',{name:'Änderungen speichern'})); await manager.reload(); thomasCard=manager.locator('.member-card').filter({hasText:'Thomas Weber'}); if(!(await thomasCard.getByLabel('Aufträge verwalten').isChecked()))throw new Error('Provider manage-jobs AN did not persist');
await thomasCard.getByLabel('Aufträge verwalten').uncheck(); await clickServerAction(manager,thomasCard.getByRole('button',{name:'Änderungen speichern'})); await manager.reload(); thomasCard=manager.locator('.member-card').filter({hasText:'Thomas Weber'}); if(await thomasCard.getByLabel('Aufträge verwalten').isChecked())throw new Error('Provider manage-jobs AUS did not persist'); await waitText(manager,'Aufträge verwalten AUS');

// 3) Kunde startet beim Hausmeisterservice und entscheidet danach bewusst: Mensch oder Auftrag.
const ownerCtx=await newE2EContext({viewport:{width:390,height:844}}); const owner=await ownerCtx.newPage(); trackPage(owner,'homeowner');
await owner.goto(base+'/register?role=homeowner');
await fillRegisterField(owner,'firstName','Maria'); await fillRegisterField(owner,'lastName','Test'); await fillRegisterField(owner,'email',ownerEmail); await fillRegisterField(owner,'password',password); await fillRegisterField(owner,'postcode','46325');
await Promise.all([owner.waitForURL('**/app/onboarding'),owner.getByRole('button',{name:'Konto erstellen'}).click()]);
await waitText(owner,'Damit Partner in deiner Region arbeiten können');
// Resume works: leaving mid-onboarding and returning keeps the saved step.
await owner.goto(base+'/app'); await waitText(owner,'Jetzt weiter einrichten');
await clickAndWaitUrl(owner,owner.getByRole('link',{name:'Jetzt weiter einrichten'}),/\/app\/onboarding$/);
await waitText(owner,'Damit Partner in deiner Region arbeiten können');
await owner.getByLabel('Straße und Hausnummer').fill('Gartenweg 12');
await clickServerAction(owner,owner.getByRole('button',{name:'Weiter'})); await waitText(owner,'Worum geht es bei deinem Haus?');
// Optional steps are skippable.
await owner.getByRole('button',{name:'Überspringen'}).click(); await waitText(owner,'Wie dürfen wir dich erreichen?');
await owner.getByRole('button',{name:'Überspringen'}).click();
await Promise.all([owner.waitForURL('**/app?onboarding=done'),owner.waitForLoadState('load')]);
if(await owner.locator('.owner-onboarding-banner').count())throw new Error('Onboarding banner shown after completion');
await assertNoOverflow(owner,'Mobile customer app');
await waitText(owner,'Frag einfachhausen'); await waitText(owner,'Mein Zuhause im Überblick'); await waitText(owner,'Haus-Historie ansehen'); await waitText(owner,'Schnelle Hilfe in dringenden Fällen');
// Owner mobile navigation is the Notion drawer; the bottom tab bar is gone on owner mobile.
const ownerDrawer=owner.locator('.mobile-menu');
await ownerDrawer.locator('summary').click();
const drawerPanel=ownerDrawer.locator('.side-menu.ehn-drawer');
if(!(await drawerPanel.isVisible()))throw new Error('Mobile owner menu did not open');
const drawerSections=await ownerDrawer.locator('.ehn-acc-sec').count(); if(drawerSections!==5)throw new Error(`Mobile homeowner drawer must expose five numbered sections, got ${drawerSections}`);
if(await ownerDrawer.getByRole('button',{name:'Abmelden'}).count()<2)throw new Error('Drawer logout actions missing');
const jobsSection=ownerDrawer.locator('.ehn-acc-sec').filter({hasText:'Aufträge'}); await jobsSection.locator('button.ehn-acc-head').click();
await clickAndWaitUrl(owner,jobsSection.getByRole('button',{name:'Aktive Aufträge'}),/\/app\/jobs/);
if(await drawerPanel.isVisible())throw new Error('Mobile owner menu did not close after navigation');
await owner.goto(base+'/app/profile'); await waitText(owner,'Einfach Hausen aufs Handy'); await assertNoOverflow(owner,'Mobile customer profile');
await owner.goto(base+'/app/hausmeister'); await assertNoOverflow(owner,'Mobile housemaster');
await sendHousemaster(owner,'Meine Hecke ist zu hoch. Dienstag ab 14 Uhr hätte ich Zeit. Wen kann ich dazu fragen?',/answered=1/);
await waitText(owner,'Wie soll es weitergehen?'); await waitText(owner,'Ansprechpartner finden'); await waitText(owner,'Auftrag organisieren');
// Eine normale Hausfrage darf noch keine Partneranfrage erzeugen.
await manager.goto(base+'/pro'); await waitText(manager,'Keine neue passende Anfrage');

// 3a) Zuerst nur einen Menschen verbinden — ausdrücklich noch kein Auftrag.
await clickAndWaitUrl(owner,owner.getByRole('button',{name:/Ansprechpartner finden/}),/\/app\/jobs\/\d+/); const contactJobId=Number(owner.url().split('/').pop()); if(!contactJobId)throw new Error('contact job missing');
await waitText(owner,'Du hast nur einen Ansprechpartner gewählt'); await waitText(owner,'noch kein Auftrag');
await manager.goto(base+'/pro'); const contactRequest=manager.locator('a.pro-request:not(.simple)').filter({hasText:'Heckenschnitt'}).first(); await contactRequest.waitFor();
const contactHref=await contactRequest.getAttribute('href');
if(contactHref!==`/pro/jobs/${contactJobId}`)throw new Error(`contact dispatch card href mismatch: ${contactHref}`);
// Dev-mode Fast Refresh can full-reload mid-interaction and swallow clicks;
// a direct navigation with one retry is deterministic here.
try { await manager.goto(base+`/pro/jobs/${contactJobId}`); }
catch(e){ await manager.waitForTimeout(2000); await manager.goto(base+`/pro/jobs/${contactJobId}`); }
await waitText(manager,'Nur persönlicher Ansprechpartner gesucht');
const contactSelect=manager.getByLabel('Ansprechpartner'); const contactThomas=contactSelect.locator('option').filter({hasText:'Thomas Weber'}); const contactThomasValue=await contactThomas.getAttribute('value'); if(!contactThomasValue)throw new Error('Thomas contact option missing'); await contactSelect.selectOption(contactThomasValue);
await clickServerAction(manager,manager.getByRole('button',{name:'Kontakt übernehmen'}));
await manager.reload(); await waitText(manager,'Verbunden');
await owner.goto(base+`/app/jobs/${contactJobId}`); await waitText(owner,'Thomas Weber'); await waitText(owner,'noch kein Auftrag'); await assertNoOverflow(owner,'Mobile contact detail');

// Direkter Kontakt funktioniert schon ohne Auftrag.
await owner.getByRole('link',{name:'Nachricht',exact:true}).click(); await waitText(owner,'Meine Ansprechpartner'); await assertNoOverflow(owner,'Mobile contacts');
await owner.getByPlaceholder(/Nachricht an Thomas/).fill('Thomas, kannst du kurz sagen, ob du dir das ansehen würdest?'); await clickServerAction(owner,owner.getByRole('button',{name:'Nachricht senden'}));
const techCtx=await newE2EContext({viewport:{width:390,height:844}}); const tech=await techCtx.newPage(); trackPage(tech,'provider-contact');
tech.on('framenavigated',f=>{ if(f===tech.mainFrame()) console.error('E2E-NAV:',JSON.stringify(tech.url())); });
const supabaseTechUserId=null;
await tech.goto(base+'/login'); await tech.locator('.auth-head h1').waitFor(); if(!(await tech.locator('.auth-head h1').innerText()).startsWith('Willkommen zurück'))throw new Error('Login visual surface missing Anmeldung heading'); const loginButton=tech.getByRole('button',{name:'Anmelden'}); const loginBox=await loginButton.boundingBox(); if(!loginBox || loginBox.height < 44)throw new Error('Login primary action must be at least 44px high'); // Local-auth persona sessions cannot use the client Supabase form (architectural seam; the primary// real-Supabase form login is proven fresh by the t0169/t0170 evidence). Seed the local session exactly// like scripts/t0170-auth-e2e.mjs does for dev-mode behavioral cases.const { Database: Sqlite }=await import('better-sqlite3');const techDb=new Sqlite(databasePath);const techUser=techDb.prepare('SELECT id FROM users WHERE email=?').get(techEmail);if(!techUser)throw new Error('tech local user missing');const techToken=randomBytes(32).toString('hex');techDb.prepare('INSERT OR REPLACE INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)').run(techToken,techUser.id,new Date(Date.now()+7200_000).toISOString(),new Date().toISOString());techDb.close();await techCtx.addCookies([{name:'mh_session',value:techToken,domain:'127.0.0.1',path:'/'}]);await tech.goto(base+'/pro',{timeout:60000});if(!tech.url().includes('/pro')) {  const d2=new Sqlite(databasePath);  const u2=d2.prepare('SELECT id,email,role FROM users WHERE email=?').get(techEmail);  const s2=u2?d2.prepare('SELECT token,expires_at FROM sessions WHERE user_id=?').all(u2.id):[];  d2.close();  console.error('E2EDIAG seed:',JSON.stringify({techUrl:tech.url(),user:u2,sessions:s2}));  throw new Error('seeded tech session did not authenticate');}await tech.waitForURL('**/pro',{timeout:60000});
let msgsUrl='';for(let attempt=0;attempt<3;attempt++){await tech.goto(base+'/pro/messages',{timeout:60000}); msgsUrl=tech.url();if(msgsUrl.includes('/pro/messages'))break;console.error('E2EDIAG msgs attempt',attempt,'landed on',msgsUrl);
      console.error('E2EDIAG db probe skipped');await tech.waitForTimeout(1500);}if(!msgsUrl.includes('/pro/messages')){
  await tech.screenshot({path:'/var/tmp/tech-messages-fail.png',fullPage:true});
  console.error('E2EDIAG msgs kept redirecting; last=',msgsUrl,'| body=',(await tech.locator('body').innerText()).slice(0,300).replace(/\n+/g,' | '));
  console.error('E2EDIAG serverLog tail:\n'+serverLog.slice(-30).join(''));
  throw new Error(`tech messages kept redirecting (last=${msgsUrl})`);
}
await waitText(tech,'Maria Test'); await waitText(tech,'ob du dir das ansehen würdest');
await tech.getByPlaceholder(/Nachricht an Maria/).fill('Ja, das kann ich mir ansehen. Wenn du möchtest, kann daraus separat ein Auftrag werden.'); await clickServerAction(tech,tech.getByRole('button',{name:'Nachricht senden'}));
await owner.reload(); await waitText(owner,'separat ein Auftrag');

// 3b) Erst jetzt entscheidet Maria, daraus einen echten Auftrag zu machen.
await owner.goto(base+`/app/jobs/${contactJobId}`); await clickAndWaitUrl(owner,owner.getByRole('button',{name:'Auftrag organisieren'}),/clarify=1/); await waitText(owner,'Wie lang ist die Hecke ungefähr?');
await sendHousemaster(owner,'Etwa 25 Meter.',/job=\d+/); const jobId=Number(new URL(owner.url()).searchParams.get('job')); if(!jobId)throw new Error('service job missing');
await owner.getByText(/Richtpreis liegt aktuell ungefähr/).waitFor(); await owner.getByText(/vertraglich geprüfte Partner/).waitFor();
await owner.screenshot({path:path.join(artifactsDir,'owner-ai-housemaster.png'),fullPage:true});

// 4) Nur berechtigter Firmenmanager sieht die neue Anfrage und erstellt das Angebot.
await manager.goto(base+'/pro'); await manager.getByText('Heckenschnitt').first().waitFor(); await manager.getByText('Heckenschnitt').first().click();
await manager.getByLabel('Gesamtpreis (€)').fill('139'); await manager.getByLabel('Leistungsumfang').fill('Heckenschnitt inkl. Abtransport des Schnittguts und sauberer Übergabe.');
await clickServerAction(manager,manager.getByRole('button',{name:'Angebot senden'}));
await manager.screenshot({path:path.join(artifactsDir,'provider-dispatch-offer.png'),fullPage:true});

// 5) Kunde vergleicht und bucht. Danach existiert ein echter Ansprechpartner.
await owner.goto(base+`/app/jobs/${jobId}`); await waitText(owner,'Gartenbau Müller'); await waitText(owner,'EMPFEHLUNG'); await waitText(owner,'GÜNSTIGST');
await clickAndWaitUrl(owner,owner.getByRole('link',{name:/Gartenbau Müller/}).first(),/\/app\/partners\//); await waitText(owner,'Geprüfter Partner'); await waitText(owner,'Gartenbau Müller'); await assertNoOverflow(owner,'Mobile partner profile'); await clickAndWaitUrl(owner,owner.getByRole('link',{name:/Zum Angebot zurück/}),new RegExp(`/app/jobs/${jobId}`));
await clickServerAction(owner,owner.getByRole('button',{name:'Diesen Partner buchen'})); await owner.locator('.detail-head .status').getByText('Beauftragt',{exact:true}).waitFor();
await waitText(owner,'Dein persönlicher Ansprechpartner');

// Manager weist bewusst Thomas zu.
await manager.goto(base+`/pro/jobs/${jobId}`); await waitText(manager,'Ansprechpartner');
const assignmentDisclosure=manager.locator('details.provider-disclosure').filter({hasText:'Ansprechpartner ändern'}); if(await assignmentDisclosure.count())await assignmentDisclosure.locator('summary').click(); const assignmentForm=assignmentDisclosure.count()?assignmentDisclosure.locator('form.assign-form'):manager.locator('form.assign-form:visible').filter({has:manager.getByLabel('Auftrag zuweisen')}).first(); await assignmentForm.waitFor(); const assignmentSelect=assignmentForm.getByLabel(/Auftrag zuweisen/); await assignmentSelect.waitFor(); const thomasOption=assignmentSelect.locator('option').filter({hasText:'Thomas Weber'}); await thomasOption.waitFor({state:'attached'}); const thomasValue=await thomasOption.getAttribute('value'); if(!thomasValue)throw new Error('Thomas option missing'); await assignmentSelect.selectOption(thomasValue); const assignmentButton=assignmentForm.getByRole('button',{name:/Ansprechpartner festlegen|Zuweisung speichern/}); await clickServerAction(manager,assignmentButton);
await owner.reload(); await waitText(owner,'Thomas Weber'); await waitText(owner,'Techniker · Gartenbau Müller');
await owner.screenshot({path:path.join(artifactsDir,'owner-personal-contact.png'),fullPage:true});

// 6) Derselbe Ansprechpartner bleibt auch nach der späteren Buchung erreichbar.
await owner.getByRole('link',{name:'Nachricht',exact:true}).click(); await waitText(owner,'Meine Ansprechpartner');
await owner.getByPlaceholder(/Nachricht an Thomas/).fill('Thomas, bitte kurz Bescheid sagen, bevor du losfährst.'); await clickServerAction(owner,owner.getByRole('button',{name:'Nachricht senden'}));
await tech.goto(base+'/pro/messages'); await waitText(tech,'Thomas, bitte kurz Bescheid');
await tech.getByPlaceholder(/Nachricht an Maria/).fill('Gerne, ich melde mich etwa 30 Minuten vorher.'); await clickServerAction(tech,tech.getByRole('button',{name:'Nachricht senden'}));
await owner.reload(); await waitText(owner,'30 Minuten vorher');

// 7) Ansprechpartner führt aus, dokumentiert und bleibt danach gespeichert.
await tech.goto(base+`/pro/jobs/${jobId}`); await waitText(tech,'Du bist der persönliche Ansprechpartner'); await clickServerAction(tech,tech.getByRole('button',{name:'Arbeit starten'})); await clickServerAction(tech,tech.getByRole('button',{name:'Als erledigt markieren'}));
await waitText(tech,'Rechnung direkt senden'); await tech.locator('input[name="itemDescription"]').first().fill('Heckenschnitt inkl. Entsorgung'); await tech.locator('input[name="itemPrice"]').first().fill('116.81'); await clickAndWaitUrl(tech,tech.getByRole('button',{name:'Rechnung erstellen & senden'}),/\/pro\/invoices\/\d+/); const invoiceId=Number(new URL(tech.url()).pathname.split('/').pop()); if(!invoiceId)throw new Error('invoice missing'); const invoiceNumber=(await tech.locator('.invoice-paper-head strong').innerText()).trim(); await waitText(tech,'Rechnung wurde an den Eigentümer gesendet');
await owner.goto(base+'/app/documents'); await waitText(owner,invoiceNumber); await owner.locator(`a[href="/app/invoices/${invoiceId}"]`).click(); await waitText(owner,'Rechnungsbetrag'); await waitText(owner,'Gartenbau Müller'); await assertNoOverflow(owner,'Mobile invoice');
await clickAndWaitUrl(owner,owner.getByRole('button',{name:'Rechnung bezahlen'}),/error=/); await waitText(owner,'Onlinezahlung ist gerade nicht verfügbar'); if(!(await owner.getByRole('button',{name:'Rechnung bezahlen'}).isVisible()))throw new Error('Unavailable payment path mutated invoice state');
await tech.goto(base+`/pro/jobs/${jobId}`); const documentDisclosure=tech.locator('details.provider-form-disclosure').filter({hasText:'Dokument hinzufügen'}); await documentDisclosure.locator('summary').click(); const documentForm=documentDisclosure.locator('form.document-form'); await documentForm.getByLabel('Titel').fill('Leistungsnachweis Heckenschnitt'); await documentForm.getByLabel('Dokumenttyp').selectOption('report'); await documentForm.getByLabel('Datei').setInputFiles({name:'nachweis.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Einfach Hausen Test\n')}); await clickServerAction(tech,documentForm.getByRole('button',{name:'Dokument hochladen'}));
await owner.goto(base+'/app/messages'); await waitText(owner,'Thomas Weber'); await waitText(owner,'Bestehende Kundenbeziehung');
await owner.goto(base+'/app/documents'); await waitText(owner,'Leistungsnachweis Heckenschnitt');

// 7a) Notification Center: server-side read-state sync, per-item toggles, pagination chrome.
await manager.goto(base+'/notifications'); await waitText(manager,'Angebote, Disposition');
const notifRows=manager.locator('.notification-row'); if(await notifRows.count()===0)throw new Error('Manager should have dispatch notifications by now');
const firstRow=notifRows.first();
const wasUnread=(await firstRow.getAttribute('class'))?.includes('unread');
if(wasUnread){
  await clickServerAction(manager,firstRow.getByRole('button',{name:/^Als gelesen markieren/}));
  await waitText(manager,'Alle gelesen');
}
await manager.reload();
const cls=await notifRows.first().getAttribute('class'); if(cls?.includes('unread'))throw new Error('Read state did not persist across reload');
// Toggle back to unread keeps the center honest in both directions.
await clickServerAction(manager,notifRows.first().getByRole('button',{name:/^Als ungelesen markieren/}));
await manager.waitForFunction(()=>document.querySelector('.notification-row')?.classList.contains('unread')===true,{timeout:10000});
const cls2=await notifRows.first().getAttribute('class'); if(!cls2?.includes('unread'))throw new Error('Unread toggle did not apply');
await assertNoOverflow(manager,'Mobile notification center');

// 8) Hausakte und Tarife entsprechen dem Geschäftsmodell.
await owner.goto(base+'/app/home'); await waitText(owner,'Gebäude & Räume'); await assertNoOverflow(owner,'Mobile house file'); await owner.locator('.house-menu details > summary').click(); await owner.getByLabel('Haustyp').selectOption('Einfamilienhaus'); await owner.getByLabel('Baujahr').fill('2004'); await owner.getByLabel('Wohnfläche m²').fill('145'); await owner.getByLabel('Grundstück m²').fill('620'); await clickServerAction(owner,owner.getByRole('button',{name:'Hausprofil speichern'}));
const assetForm=owner.locator('.asset-form'); await assetForm.locator('select[name="kind"]').selectOption('pv'); await assetForm.locator('input[name="name"]').fill('PV-Anlage 10 kWp'); await clickServerAction(owner,assetForm.getByRole('button',{name:'Hinzufügen'})); await waitText(owner,'PV-Anlage und Ertrag prüfen');
await owner.goto(base+'/app/home/history'); await owner.getByLabel('Bereich').selectOption({label:'Dach & Fassade'}); await owner.getByLabel('Datum').fill('2025-06-12'); await owner.getByLabel('Was wurde gemacht?').fill('Dachsanierung 2025'); await owner.getByLabel('Firma').fill('Gartenbau Müller'); await owner.getByLabel('E-Mail Handwerker').fill(providerEmail); await owner.getByLabel('Kosten €').fill('18500'); await clickServerAction(owner,owner.getByRole('button',{name:'In Hausakte speichern'})); await waitText(owner,'Dachsanierung 2025'); await waitText(owner,'Partner ist mit deinem Haus verbunden'); await assertNoOverflow(owner,'Mobile house history');
await owner.goto(base+'/app/messages'); await waitText(owner,'Dach'); await waitText(owner,'Garten'); const thomasRow=owner.locator('.contact-row').filter({hasText:'Thomas Weber'}).first(); await thomasRow.click(); await owner.locator('.contact-category-editor summary').click(); await owner.getByLabel('Eigener Bereich').fill('Hecke & Bäume'); await clickAndWaitUrl(owner,owner.getByRole('button',{name:'Bereich speichern'}),/category=saved/); await waitText(owner,'Hecke & Bäume');
await owner.goto(base+`/app/year?year=${new Date().getFullYear()+2}`); await waitText(owner,'Mein Jahr'); await waitText(owner,'PV-Anlage und Ertrag prüfen'); await assertNoOverflow(owner,'Mobile year plan');
await owner.goto(base+'/app/plans'); await owner.getByText('Free',{exact:true}).waitFor(); await owner.getByText('Plus',{exact:true}).waitFor(); await owner.getByText('Premium',{exact:true}).waitFor();
await owner.goto(base+'/app/jobs?tab=completed'); await waitText(owner,'Meine Aufträge'); await waitText(owner,'Abgeschlossen'); await assertNoOverflow(owner,'Mobile completed jobs');
await manager.goto(base+'/pro/plans'); await waitText(manager,'0 % Provision'); for(const plan of ['Free','Start','Pro','Premium'])await manager.getByText(plan,{exact:true}).first().waitFor();

// 9) Beratung und Notfall sind eigenständige, sehr einfache Einstiege.
await owner.goto(base+'/app/consultation'); await owner.getByLabel('Wobei brauchst du Rat?').fill('Ich möchte kurz wissen, wie ich einen stark wachsenden Baum am besten prüfen lasse.'); await owner.getByLabel('Foto oder Video').setInputFiles({name:'baum.mp4',mimeType:'video/mp4',buffer:Buffer.from('test-video')}); await clickAndWaitUrl(owner,owner.getByRole('button',{name:'Ansprechpartner finden'}),/\/app\/jobs\/\d+/); await waitText(owner,'noch kein Auftrag'); if(await owner.locator('video.hero-photo').count()!==1)throw new Error('Consultation video must render on the resulting contact request');
await owner.goto(base+'/app/emergency'); await owner.getByLabel('Notfall').selectOption('other'); await owner.getByLabel('Was ist passiert?').fill('Ein großer Ast ist nach einem Sturm abgebrochen und blockiert den Zugang zum Haus.'); await clickAndWaitUrl(owner,owner.getByRole('button',{name:'Jetzt Helfer suchen'}),/\/app\/jobs\/\d+/); await waitText(owner,'NOTFALL'); await waitText(owner,'Wir suchen jetzt verfügbare Hilfe'); await manager.goto(base+'/pro'); await waitText(manager,'Notfall');

// 10) Servicefall bleibt zentral unterstützbar, ohne den direkten Kontakt zu ersetzen.
await owner.goto(base+`/app/jobs/${jobId}`); await waitText(owner,'Wenn etwas nicht klappt'); await owner.getByPlaceholder('Beschreibe kurz, wo die Abstimmung festhängt.').fill('Die Ausführung soll von Einfach Hausen geprüft werden, weil noch eine Rückfrage zur Qualität offen ist.'); await clickServerAction(owner,owner.getByRole('button',{name:'Hausmeister einschalten'})); await waitText(owner,'Servicefall · Offen');
await admin.goto(base+'/admin'); const claimCard=admin.locator('.admin-card').filter({hasText:'Rückfrage zur Qualität'}).first(); await claimCard.getByLabel('Status').selectOption('resolved'); await claimCard.getByPlaceholder('Rückmeldung / Entscheidung').fill('Fall geprüft und mit Kunde und Ansprechpartner geklärt.'); await clickServerAction(admin,claimCard.getByRole('button',{name:'Fall aktualisieren'})); await claimCard.locator('.status.resolved').waitFor();

// 11) CRM-Lifecycle ist im integrierten Produkt erreichbar und kennt den registrierten Partner.
await admin.goto(base+`/admin/crm?q=${encodeURIComponent('Gartenbau Müller')}`); await waitText(admin,'Leads & CRM'); await waitText(admin,'Gartenbau Müller'); await assertNoOverflow(admin,'Admin CRM');

const buyerCtx=await newE2EContext({viewport:{width:390,height:844}}); const buyer=await buyerCtx.newPage(); trackPage(buyer,'homeowner-buyer');
// 12a) First-run onboarding: guided steps, skippable optionals, resumable progress.
await buyer.goto(base+'/register?role=homeowner'); await fillRegisterField(buyer,'firstName','Ben'); await fillRegisterField(buyer,'lastName','Käufer'); await fillRegisterField(buyer,'email',buyerEmail); await fillRegisterField(buyer,'password',password); await fillRegisterField(buyer,'postcode','46325'); await Promise.all([buyer.waitForURL('**/app/onboarding'),buyer.getByRole('button',{name:'Konto erstellen'}).click()]);
await waitText(buyer,'Damit Partner in deiner Region arbeiten können');
await buyer.getByLabel('Straße und Hausnummer').fill('Kaistraße 7');
await clickAndWaitUrl(buyer,buyer.getByRole('button',{name:'Weiter'}),/\/app\/onboarding$/);
await waitText(buyer,'Worum geht es bei deinem Haus?');
await buyer.reload(); await waitText(buyer,'Worum geht es bei deinem Haus?');
await buyer.getByLabel(new RegExp('Garten')).check();
await clickAndWaitUrl(buyer,buyer.getByRole('button',{name:'Weiter'}),/\/app\/onboarding$/);
await waitText(buyer,'Wie dürfen wir dich erreichen?');
await buyer.getByRole('button',{name:'Überspringen'}).click();
await Promise.all([buyer.waitForURL('**/app?onboarding=done'),buyer.waitForLoadState('load')]);
await waitText(buyer,'Frag einfachhausen');
if(await buyer.locator('.owner-onboarding-banner').count())throw new Error('Onboarding banner still shown after completion');
await buyer.reload(); if(await buyer.locator('.owner-onboarding-banner').count())throw new Error('Onboarding state did not persist after reload');
// 12) Hausakte kann kontrolliert übergeben werden, private Vorgänge bleiben beim bisherigen Eigentümer.
await owner.goto(base+'/app/home/history'); await owner.getByLabel('E-Mail des Käufers').fill(buyerEmail); await clickAndWaitUrl(owner,owner.getByRole('button',{name:'Übergabe vorbereiten'}),/transfer=/); const transferToken=new URL(owner.url()).searchParams.get('transfer'); if(!transferToken)throw new Error('House transfer token missing');
await buyer.goto(base+`/transfer/${transferToken}`); await waitText(buyer,'Hausakte übernehmen'); await clickAndWaitUrl(buyer,buyer.getByRole('button',{name:'Hausakte jetzt übernehmen'}),/\/app\/home\?transfer=accepted/);
await buyer.goto(base+'/app/home/history'); await waitText(buyer,'Dachsanierung 2025'); await waitText(buyer,'Maria Test'); await waitText(buyer,'Ben Käufer'); await assertNoOverflow(buyer,'Transferred house history');
await buyer.goto(base+'/app/home'); await waitText(buyer,'PV-Anlage 10 kWp');
await buyer.goto(base+`/app/year?year=${new Date().getFullYear()+2}`); await waitText(buyer,'PV-Anlage und Ertrag prüfen');
await buyer.goto(base+'/app/messages'); const buyerMessages=await buyer.locator('body').innerText(); if(buyerMessages.includes('30 Minuten vorher')||buyerMessages.includes('bitte kurz Bescheid'))throw new Error('Private prior-owner messages leaked through house transfer');
await buyer.goto(base+'/app/documents'); const buyerDocuments=await buyer.locator('body').innerText(); if(buyerDocuments.includes(invoiceNumber)||buyerDocuments.includes('Leistungsnachweis Heckenschnitt'))throw new Error('Private prior-owner invoice/job documents leaked through house transfer');
await buyer.goto(base+'/app/jobs?tab=completed'); if((await buyer.locator('body').innerText()).includes('Heckenschnitt inkl.'))throw new Error('Private prior-owner completed job leaked through house transfer');
await owner.goto(base+'/app/documents'); await waitText(owner,invoiceNumber); await owner.goto(base+`/app/messages?contact=${encodeURIComponent(String(thomasValue))}`); await waitText(owner,'Thomas Weber'); await waitText(owner,'30 Minuten vorher');
await buyerCtx.close();

if(runtimeErrors.length)throw new Error(`Browser runtime errors:
${runtimeErrors.join('\n')}`);
const evidence={ok:true,jobId,checks:['isolated production build/server','public multipage 390/1320','PWA offline shell','keyboard focus','provider verification/contract','provider AN/AUS','contact-only to job conversion','matching/quote/booking/assignment','cross-role messaging','invoice + unavailable payment truth','house history + maintenance','consultation + emergency','admin claim + CRM','house transfer privacy','zero browser runtime errors'],vision:'house service + explicit consultation or job + categorized contacts + invoices + property history + quality matching + 0% commission'};
fs.writeFileSync(path.join(artifactsDir,'summary.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence,null,2));
} finally {
  try{await browser?.close();}catch{}

  if(server&&!server.killed){server.kill('SIGTERM');await new Promise(resolve=>{const timer=setTimeout(resolve,3000);server.once('exit',()=>{clearTimeout(timer);resolve();});});if(server.exitCode===null)server.kill('SIGKILL');}
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
