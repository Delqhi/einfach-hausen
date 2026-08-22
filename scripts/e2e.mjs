import { chromium } from 'playwright-core';

const base=process.env.E2E_BASE_URL||'http://127.0.0.1:3001';
const adminPassword=process.env.E2E_ADMIN_PASSWORD;
if(!adminPassword) throw new Error('E2E_ADMIN_PASSWORD is required');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const stamp=Date.now();
const providerEmail=`firma-${stamp}@example.test`;
const techEmail=`thomas-${stamp}@example.test`;
const ownerEmail=`maria-${stamp}@example.test`;
const password='Hausen!2026';

async function waitText(page,text){await page.waitForFunction(value=>document.body.innerText.includes(value),text,{timeout:15000});}
async function assertNoOverflow(page,label){const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);if(overflow)throw new Error(`${label} has horizontal overflow`);}
async function sendHousemaster(page,text){const c=page.getByPlaceholder(/Beschreib kurz|Beantworte nur noch|Was soll draußen|Was ist kaputt|Was soll gereinigt|Wobei brauchst du/);await c.click();await c.pressSequentially(text,{delay:1});await page.locator('button.send-action:not([disabled])').click();}

// 0) Öffentliche Website ist mobile-first, nutzenorientiert und als PWA installierbar.
const publicCtx=await browser.newContext({viewport:{width:390,height:844}}); const publicPage=await publicCtx.newPage();
await publicPage.goto(base+'/');
await publicPage.getByRole('heading',{name:/Ein Ansprechpartner für.*Eigenheim/i}).waitFor();
await waitText(publicPage,'Was steht bei deinem Haus an?'); await waitText(publicPage,'Geprüfte Vertragspartner'); await waitText(publicPage,'Konkrete Ansprechpartner');
if(/KI-Hausmeister/i.test(await publicPage.locator('body').innerText()))throw new Error('Landing page still foregrounds AI instead of customer benefit');
await assertNoOverflow(publicPage,'Mobile landing');
await publicPage.getByLabel('Was steht bei deinem Haus an?').fill('Meine Haustür klemmt seit gestern.'); await publicPage.getByRole('button',{name:/Anliegen starten/}).click(); await publicPage.waitForURL(/\/register\?role=homeowner&request=/); await waitText(publicPage,'DEIN ANLIEGEN'); await waitText(publicPage,'Meine Haustür klemmt seit gestern.'); await publicPage.goto(base+'/');
const manifestResponse=await publicPage.request.get(base+'/manifest.webmanifest'); if(!manifestResponse.ok())throw new Error('PWA manifest unavailable');
const manifest=await manifestResponse.json(); if(manifest.display!=='standalone'||!Array.isArray(manifest.icons)||manifest.icons.length<3)throw new Error('PWA manifest incomplete');
const swResponse=await publicPage.request.get(base+'/sw.js'); if(!swResponse.ok()||!(await swResponse.text()).includes('einfach-hausen-shell'))throw new Error('Service worker unavailable'); const swCache=swResponse.headers()['cache-control']||''; if(!/no-cache|no-store/i.test(swCache))throw new Error('Service worker must not be long-term cached');
await publicPage.screenshot({path:'artifacts/mobile-landing.png',fullPage:true});
await publicCtx.close();

// 1) Firma registrieren, prüfen und als Vertragspartner aktivieren.
const managerCtx=await browser.newContext({viewport:{width:390,height:844}}); const manager=await managerCtx.newPage();
await manager.goto(base+'/register?role=provider');
await manager.getByLabel('Vorname').fill('Daniel'); await manager.getByLabel('Nachname').fill('Müller');
await manager.getByLabel('E-Mail').fill(providerEmail); await manager.getByLabel('Passwort').fill(password);
await manager.getByLabel('Firmenname').fill('Gartenbau Müller'); await manager.getByLabel('Gewerke').fill('Garten, Grünpflege, Heckenschnitt, Hausmeister'); await manager.getByLabel('PLZ').fill('46325'); await manager.getByLabel('Sofort buchbare Termine anbieten').check();
await Promise.all([manager.waitForURL('**/pro'),manager.getByRole('button',{name:'Konto erstellen'}).click()]);
await manager.goto(base+'/pro/profile');
await manager.getByLabel('Nachweis').setInputFiles({name:'gewerbe.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Test\n')});
await manager.getByLabel('Hinweis').fill('Gewerbe, Qualifikation und Betriebshaftpflicht liegen vor.');
await manager.getByRole('button',{name:'Zur Prüfung einreichen'}).click(); await manager.waitForURL(/verification=submitted/);

const adminCtx=await browser.newContext({viewport:{width:1180,height:1000}}); const admin=await adminCtx.newPage();
await admin.goto(base+'/admin/login'); await admin.getByLabel('Admin-Passwort').fill(adminPassword);
await Promise.all([admin.waitForURL('**/admin'),admin.getByRole('button',{name:'Admin anmelden'}).click()]);
let companyCard=admin.locator('.admin-card').filter({hasText:'Gartenbau Müller'}).first();
await companyCard.getByRole('button',{name:'Unternehmen freigeben'}).click(); await companyCard.locator('.status.approved').waitFor();
companyCard=admin.locator('.admin-card').filter({hasText:'Gartenbau Müller'}).first();
await companyCard.getByLabel('Status').selectOption('active');
for(const name of ['Betriebshaftpflicht geprüft','Qualifikation/Zulassung geprüft','Partnervertrag unterschrieben','Qualitätsstandard akzeptiert']) await companyCard.getByLabel(name).check();
await companyCard.getByRole('button',{name:'Partnervertrag speichern'}).click(); await companyCard.getByText(/Vertrag Aktiv/).waitFor();
await manager.goto(base+'/pro/profile'); await waitText(manager,'Aktiver Einfach-Hausen-Vertragspartner'); await waitText(manager,'0 % Provision');
await manager.getByLabel('Firmenanschrift').fill('Gartenstraße 12, 46325 Borken'); await manager.getByLabel('Steuernummer').fill('307/1234/5678');
const emergencyToggle=manager.getByLabel('Notfälle',{exact:true}); if(!(await emergencyToggle.isChecked()))await emergencyToggle.check(); await manager.getByLabel('Modell').selectOption('24_7'); await manager.getByLabel('Max. Notfallzuschlag %').fill('20'); await manager.getByRole('button',{name:'Profil speichern'}).click(); await manager.waitForTimeout(350);

// 2) Firma legt einen echten Ansprechpartner an. Nur ein Schalter für Auftragsverwaltung.
await manager.goto(base+'/pro/team'); await manager.getByRole('heading',{name:'Menschen statt Rollenmatrix'}).waitFor(); await waitText(manager,'Aufträge verwalten AN'); await assertNoOverflow(manager,'Mobile partner team');
await manager.getByLabel('Vorname').last().fill('Thomas'); await manager.getByLabel('Nachname').last().fill('Weber');
await manager.getByLabel('Funktion').fill('Techniker'); await manager.getByLabel('E-Mail').last().fill(techEmail); await manager.getByLabel('Telefon').last().fill('+49 151 12345678'); await manager.getByLabel('Startpasswort').fill(password);
await manager.getByRole('button',{name:'Ansprechpartner anlegen'}).click(); await manager.waitForURL(/member=created/); await waitText(manager,'Thomas Weber');
const thomasCard=manager.locator('.member-card').filter({hasText:'Thomas Weber'}); if(await thomasCard.getByLabel('Aufträge verwalten').isChecked())throw new Error('Technician must not manage new jobs by default');

// 3) Kunde startet beim Hausmeisterservice und entscheidet danach bewusst: Mensch oder Auftrag.
const ownerCtx=await browser.newContext({viewport:{width:390,height:844}}); const owner=await ownerCtx.newPage();
await owner.goto(base+'/register?role=homeowner');
await owner.getByLabel('Vorname').fill('Maria'); await owner.getByLabel('Nachname').fill('Test'); await owner.getByLabel('E-Mail').fill(ownerEmail); await owner.getByLabel('Passwort').fill(password); await owner.getByLabel('PLZ').fill('46325');
await Promise.all([owner.waitForURL('**/app'),owner.getByRole('button',{name:'Konto erstellen'}).click()]);
await assertNoOverflow(owner,'Mobile customer app');
await owner.locator('.bottom-nav a').first().waitFor(); const ownerNavCount=await owner.locator('.bottom-nav a').count(); if(ownerNavCount!==5)throw new Error(`Mobile homeowner navigation must expose five primary destinations, got ${ownerNavCount}`);
await waitText(owner,'Dringender Notfall'); await waitText(owner,'Direkt einen Menschen fragen'); await owner.locator('.bottom-nav').getByText('Ansprechpartner',{exact:true}).waitFor();
await owner.goto(base+'/app/profile'); await waitText(owner,'Einfach Hausen aufs Handy'); await assertNoOverflow(owner,'Mobile customer profile');
await owner.goto(base+'/app/hausmeister'); await assertNoOverflow(owner,'Mobile housemaster');
await sendHousemaster(owner,'Meine Hecke ist zu hoch. Dienstag ab 14 Uhr hätte ich Zeit. Wen kann ich dazu fragen?'); await owner.waitForURL(/answered=1/);
await waitText(owner,'Wie soll es weitergehen?'); await waitText(owner,'Ansprechpartner finden'); await waitText(owner,'Auftrag organisieren');
// Eine normale Hausfrage darf noch keine Partneranfrage erzeugen.
await manager.goto(base+'/pro'); await waitText(manager,'Keine neue passende Anfrage');

// 3a) Zuerst nur einen Menschen verbinden — ausdrücklich noch kein Auftrag.
await owner.getByRole('button',{name:/Ansprechpartner finden/}).click(); await owner.waitForURL(/\/app\/jobs\/\d+/); const contactJobId=Number(owner.url().split('/').pop()); if(!contactJobId)throw new Error('contact job missing');
await waitText(owner,'Du hast nur einen Ansprechpartner gewählt'); await waitText(owner,'noch kein Auftrag');
await manager.goto(base+'/pro'); const contactRequest=manager.locator('a.pro-request').filter({hasText:'Heckenschnitt'}).first(); await contactRequest.waitFor(); await contactRequest.focus(); await Promise.all([manager.waitForURL(new RegExp(`/pro/jobs/${contactJobId}$`)),manager.keyboard.press('Enter')]);
await waitText(manager,'Nur persönlicher Ansprechpartner gesucht');
const contactSelect=manager.getByLabel('Ansprechpartner'); const contactThomas=contactSelect.locator('option').filter({hasText:'Thomas Weber'}); const contactThomasValue=await contactThomas.getAttribute('value'); if(!contactThomasValue)throw new Error('Thomas contact option missing'); await contactSelect.selectOption(contactThomasValue);
await manager.getByRole('button',{name:'Kontakt übernehmen'}).click(); await manager.waitForURL(new RegExp(`/pro/jobs/${contactJobId}`));
await owner.goto(base+`/app/jobs/${contactJobId}`); await waitText(owner,'Thomas Weber'); await waitText(owner,'noch kein Auftrag'); await assertNoOverflow(owner,'Mobile contact detail');

// Direkter Kontakt funktioniert schon ohne Auftrag.
await owner.getByRole('link',{name:'Nachricht',exact:true}).click(); await waitText(owner,'Meine Ansprechpartner'); await assertNoOverflow(owner,'Mobile contacts');
await owner.getByPlaceholder(/Nachricht an Thomas/).fill('Thomas, kannst du kurz sagen, ob du dir das ansehen würdest?'); await owner.getByRole('button',{name:'Nachricht senden'}).click();
const techCtx=await browser.newContext({viewport:{width:390,height:844}}); const tech=await techCtx.newPage();
await tech.goto(base+'/login'); await tech.getByLabel('E-Mail').fill(techEmail); await tech.getByLabel('Passwort').fill(password); await Promise.all([tech.waitForURL('**/pro'),tech.getByRole('button',{name:'Einloggen'}).click()]);
await tech.goto(base+'/pro/messages'); await waitText(tech,'Maria Test'); await waitText(tech,'ob du dir das ansehen würdest');
await tech.getByPlaceholder(/Nachricht an Maria/).fill('Ja, das kann ich mir ansehen. Wenn du möchtest, kann daraus separat ein Auftrag werden.'); await tech.getByRole('button',{name:'Nachricht senden'}).click();
await owner.reload(); await waitText(owner,'separat ein Auftrag');

// 3b) Erst jetzt entscheidet Maria, daraus einen echten Auftrag zu machen.
await owner.goto(base+`/app/jobs/${contactJobId}`); await owner.getByRole('button',{name:'Auftrag organisieren'}).click(); await owner.waitForURL(/clarify=1/); await waitText(owner,'Wie lang ist die Hecke ungefähr?');
await sendHousemaster(owner,'Etwa 25 Meter.'); await owner.waitForURL(/job=\d+/); const jobId=Number(new URL(owner.url()).searchParams.get('job')); if(!jobId)throw new Error('service job missing');
await owner.getByText(/Richtpreis liegt aktuell ungefähr/).waitFor(); await owner.getByText(/vertraglich geprüfte Partner/).waitFor();
await owner.screenshot({path:'artifacts/owner-ai-housemaster.png',fullPage:true});

// 4) Nur berechtigter Firmenmanager sieht die neue Anfrage und erstellt das Angebot.
await manager.goto(base+'/pro'); await manager.getByText('Heckenschnitt').first().waitFor(); await manager.getByText('Heckenschnitt').first().click();
await manager.getByLabel('Gesamtpreis (€)').fill('139'); await manager.getByLabel('Leistungsumfang').fill('Heckenschnitt inkl. Abtransport des Schnittguts und sauberer Übergabe.');
await manager.getByRole('button',{name:'Angebot senden'}).click(); await manager.waitForTimeout(250);
await manager.screenshot({path:'artifacts/provider-dispatch-offer.png',fullPage:true});

// 5) Kunde vergleicht und bucht. Danach existiert ein echter Ansprechpartner.
await owner.goto(base+`/app/jobs/${jobId}`); await waitText(owner,'Gartenbau Müller'); await waitText(owner,'EMPFEHLUNG'); await waitText(owner,'GÜNSTIGST');
await owner.getByRole('link',{name:/Gartenbau Müller/}).first().click(); await owner.waitForURL(/\/app\/partners\//); await waitText(owner,'Geprüfter Partner'); await waitText(owner,'Gartenbau Müller'); await assertNoOverflow(owner,'Mobile partner profile'); await owner.getByRole('link',{name:/Zum Angebot zurück/}).click(); await owner.waitForURL(new RegExp(`/app/jobs/${jobId}`));
await owner.getByRole('button',{name:'Diesen Partner buchen'}).click(); await owner.waitForTimeout(300); await owner.locator('.detail-head .status').getByText('Beauftragt',{exact:true}).waitFor();
await waitText(owner,'Dein persönlicher Ansprechpartner');

// Manager weist bewusst Thomas zu.
await manager.goto(base+`/pro/jobs/${jobId}`); await waitText(manager,'Ansprechpartner');
const thomasOption=manager.getByLabel('Auftrag zuweisen').locator('option').filter({hasText:'Thomas Weber'}); const thomasValue=await thomasOption.getAttribute('value'); if(!thomasValue)throw new Error('Thomas option missing'); await manager.getByLabel('Auftrag zuweisen').selectOption(thomasValue); await manager.getByRole('button',{name:'Ansprechpartner festlegen'}).click(); await manager.waitForTimeout(250);
await owner.reload(); await waitText(owner,'Thomas Weber'); await waitText(owner,'Techniker · Gartenbau Müller');
await owner.screenshot({path:'artifacts/owner-personal-contact.png',fullPage:true});

// 6) Derselbe Ansprechpartner bleibt auch nach der späteren Buchung erreichbar.
await owner.getByRole('link',{name:'Nachricht',exact:true}).click(); await waitText(owner,'Meine Ansprechpartner');
await owner.getByPlaceholder(/Nachricht an Thomas/).fill('Thomas, bitte kurz Bescheid sagen, bevor du losfährst.'); await owner.getByRole('button',{name:'Nachricht senden'}).click(); await owner.waitForTimeout(200);
await tech.goto(base+'/pro/messages'); await waitText(tech,'Thomas, bitte kurz Bescheid');
await tech.getByPlaceholder(/Nachricht an Maria/).fill('Gerne, ich melde mich etwa 30 Minuten vorher.'); await tech.getByRole('button',{name:'Nachricht senden'}).click();
await owner.reload(); await waitText(owner,'30 Minuten vorher');

// 7) Ansprechpartner führt aus, dokumentiert und bleibt danach gespeichert.
await tech.goto(base+`/pro/jobs/${jobId}`); await waitText(tech,'Du bist der persönliche Ansprechpartner'); await tech.getByRole('button',{name:'Arbeit starten'}).click(); await tech.waitForTimeout(150); await tech.getByRole('button',{name:'Als erledigt markieren'}).click(); await tech.waitForTimeout(150);
await waitText(tech,'Rechnung direkt senden'); await tech.locator('input[name="itemDescription"]').first().fill('Heckenschnitt inkl. Entsorgung'); await tech.locator('input[name="itemPrice"]').first().fill('116.81'); await tech.getByRole('button',{name:'Rechnung erstellen & senden'}).click(); await tech.waitForURL(/\/pro\/invoices\/\d+/); const invoiceId=Number(new URL(tech.url()).pathname.split('/').pop()); if(!invoiceId)throw new Error('invoice missing'); const invoiceNumber=(await tech.locator('.invoice-paper-head strong').innerText()).trim(); await waitText(tech,'Rechnung wurde an den Eigentümer gesendet');
await owner.goto(base+'/app/documents'); await waitText(owner,invoiceNumber); await owner.locator(`a[href="/app/invoices/${invoiceId}"]`).click(); await waitText(owner,'Rechnungsbetrag'); await waitText(owner,'Gartenbau Müller'); await assertNoOverflow(owner,'Mobile invoice');
await tech.goto(base+`/pro/jobs/${jobId}`); await tech.getByLabel('Titel').fill('Leistungsnachweis Heckenschnitt'); await tech.getByLabel('Dokumenttyp').selectOption('report'); await tech.getByLabel('Datei').setInputFiles({name:'nachweis.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Einfach Hausen Test\n')}); await tech.getByRole('button',{name:'Dokument hochladen'}).click();
await owner.goto(base+'/app/messages'); await waitText(owner,'Thomas Weber'); await waitText(owner,'Bestehende Kundenbeziehung');
await owner.goto(base+'/app/documents'); await waitText(owner,'Leistungsnachweis Heckenschnitt');

// 8) Hausakte und Tarife entsprechen dem Geschäftsmodell.
await owner.goto(base+'/app/home'); await waitText(owner,'Gebäude & Räume'); await assertNoOverflow(owner,'Mobile house file'); await owner.locator('.house-menu details > summary').click(); await owner.getByLabel('Haustyp').selectOption('Einfamilienhaus'); await owner.getByLabel('Baujahr').fill('2004'); await owner.getByLabel('Wohnfläche m²').fill('145'); await owner.getByLabel('Grundstück m²').fill('620'); await owner.getByRole('button',{name:'Hausprofil speichern'}).click();
const assetForm=owner.locator('.asset-form'); await assetForm.locator('select[name="kind"]').selectOption('pv'); await assetForm.locator('input[name="name"]').fill('PV-Anlage 10 kWp'); await assetForm.getByRole('button',{name:'Hinzufügen'}).click(); await waitText(owner,'PV-Anlage und Ertrag prüfen');
await owner.goto(base+'/app/home/history'); await owner.getByLabel('Bereich').selectOption({label:'Dach & Fassade'}); await owner.getByLabel('Datum').fill('2025-06-12'); await owner.getByLabel('Was wurde gemacht?').fill('Dachsanierung 2025'); await owner.getByLabel('Firma').fill('Gartenbau Müller'); await owner.getByLabel('E-Mail Handwerker').fill(providerEmail); await owner.getByLabel('Kosten €').fill('18500'); await owner.getByRole('button',{name:'In Hausakte speichern'}).click(); await waitText(owner,'Dachsanierung 2025'); await waitText(owner,'Partner ist mit deinem Haus verbunden'); await assertNoOverflow(owner,'Mobile house history');
await owner.goto(base+'/app/messages'); await waitText(owner,'Dach'); await waitText(owner,'Garten'); const thomasRow=owner.locator('.contact-row').filter({hasText:'Thomas Weber'}).first(); await thomasRow.click(); await owner.locator('.contact-category-editor summary').click(); await owner.getByLabel('Eigener Bereich').fill('Hecke & Bäume'); await owner.getByRole('button',{name:'Bereich speichern'}).click(); await owner.waitForURL(/category=saved/); await waitText(owner,'Hecke & Bäume');
await owner.goto(base+`/app/year?year=${new Date().getFullYear()+2}`); await waitText(owner,'Mein Jahr'); await waitText(owner,'PV-Anlage und Ertrag prüfen'); await assertNoOverflow(owner,'Mobile year plan');
await owner.goto(base+'/app/plans'); await owner.getByText('Free',{exact:true}).waitFor(); await owner.getByText('Plus',{exact:true}).waitFor(); await owner.getByText('Premium',{exact:true}).waitFor();
await owner.goto(base+'/app/jobs?tab=completed'); await waitText(owner,'Meine Aufträge'); await waitText(owner,'Abgeschlossen'); await assertNoOverflow(owner,'Mobile completed jobs');
await manager.goto(base+'/pro/plans'); await waitText(manager,'0 % Provision'); for(const plan of ['Free','Start','Pro','Premium'])await manager.getByText(plan,{exact:true}).first().waitFor();

// 9) Beratung und Notfall sind eigenständige, sehr einfache Einstiege.
await owner.goto(base+'/app/consultation'); await owner.getByLabel('Wobei brauchst du Rat?').fill('Ich möchte kurz wissen, wie ich einen stark wachsenden Baum am besten prüfen lasse.'); await owner.getByLabel('Foto oder Video').setInputFiles({name:'baum.mp4',mimeType:'video/mp4',buffer:Buffer.from('test-video')}); await owner.getByRole('button',{name:'Ansprechpartner finden'}).click(); await owner.waitForURL(/\/app\/jobs\/\d+/); await waitText(owner,'noch kein Auftrag'); if(await owner.locator('video.hero-photo').count()!==1)throw new Error('Consultation video must render on the resulting contact request');
await owner.goto(base+'/app/emergency'); await owner.getByLabel('Notfall').selectOption('other'); await owner.getByLabel('Was ist passiert?').fill('Ein großer Ast ist nach einem Sturm abgebrochen und blockiert den Zugang zum Haus.'); await owner.getByRole('button',{name:'Jetzt Helfer suchen'}).click(); await owner.waitForURL(/\/app\/jobs\/\d+/); await waitText(owner,'NOTFALL'); await waitText(owner,'Wir suchen jetzt verfügbare Hilfe'); await manager.goto(base+'/pro'); await waitText(manager,'Notfall');

// 10) Servicefall bleibt zentral unterstützbar, ohne den direkten Kontakt zu ersetzen.
await owner.goto(base+`/app/jobs/${jobId}`); await owner.getByPlaceholder('Was ist passiert?').fill('Die Ausführung soll von Einfach Hausen geprüft werden, weil noch eine Rückfrage zur Qualität offen ist.'); await owner.getByRole('button',{name:'Hausmeister einschalten'}).click(); await waitText(owner,'Servicefall · Offen');
await admin.goto(base+'/admin'); const claimCard=admin.locator('.admin-card').filter({hasText:'Rückfrage zur Qualität'}).first(); await claimCard.getByLabel('Status').selectOption('resolved'); await claimCard.getByPlaceholder('Rückmeldung / Entscheidung').fill('Fall geprüft und mit Kunde und Ansprechpartner geklärt.'); await claimCard.getByRole('button',{name:'Fall aktualisieren'}).click(); await claimCard.locator('.status.resolved').waitFor();

console.log(JSON.stringify({ok:true,jobId,ownerEmail,providerEmail,techEmail,vision:'house service + explicit consultation or job + categorized contacts + invoices + property history + quality matching + 0% commission'},null,2));
await browser.close();
