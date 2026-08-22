import { chromium } from 'playwright-core';

const base=process.env.E2E_BASE_URL||'http://127.0.0.1:3001';
const adminPassword=process.env.E2E_ADMIN_PASSWORD;
if(!adminPassword)throw new Error('E2E_ADMIN_PASSWORD is required');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const stamp=Date.now(); const password='Hausen!2026';
const brokerEmail=`makler-${stamp}@example.test`; const ownerEmail=`owner-${stamp}@example.test`; const buyerEmail=`buyer-${stamp}@example.test`;
const waitText=(page,text)=>page.waitForFunction(value=>document.body.innerText.includes(value),text,{timeout:15000});
const assertNoOverflow=async(page,label)=>{const x=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);if(x)throw new Error(`${label} has horizontal overflow`);};

// A) One professional account can carry several provider categories, including broker.
const brokerCtx=await browser.newContext({viewport:{width:390,height:844}}); const broker=await brokerCtx.newPage();
await broker.goto(base+'/register?role=provider');
await broker.getByLabel('Vorname').fill('Mara'); await broker.getByLabel('Nachname').fill('Makler'); await broker.getByLabel('E-Mail').fill(brokerEmail); await broker.getByLabel('Passwort').fill(password); await broker.getByLabel('Firmenname').fill('Hauswert Makler GmbH'); await broker.getByLabel('Gewerke').fill('Immobilienvermittlung, Bewertung'); await broker.getByLabel('PLZ').fill('46325');
await broker.getByLabel(/Immobilienmakler/).check();
await Promise.all([broker.waitForURL('**/pro'),broker.getByRole('button',{name:'Konto erstellen'}).click()]);
await broker.goto(base+'/pro/profile'); await waitText(broker,'Ein Konto, beliebig erweiterbar');
if(!(await broker.getByLabel(/Handwerker/).isChecked())||!(await broker.getByLabel(/Immobilienmakler/).isChecked()))throw new Error('Professional account must support multiple provider categories');
await broker.getByLabel('Regionen / PLZ').fill('463, Borken'); await broker.getByLabel('Immobilientypen').fill('Einfamilienhaus, Doppelhaushälfte'); await broker.getByLabel('Kaufpreis ab €').fill('250000'); await broker.getByLabel('Kaufpreis bis €').fill('1200000'); await broker.getByLabel('Wohnfläche ab m²').fill('80'); await broker.getByLabel('Wohnfläche bis m²').fill('300'); await broker.getByLabel('Spezialisierungen').fill('Eigenheime, modernisierte Bestandsimmobilien');
await broker.getByRole('button',{name:'Profil speichern'}).click(); await broker.waitForTimeout(250);
await broker.getByLabel('Nachweis').setInputFiles({name:'makler-nachweis.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n% Test\n')}); await broker.getByLabel('Hinweis').fill('Makler-Gewerbe und Berufshaftpflicht liegen vor.'); await broker.getByRole('button',{name:'Zur Prüfung einreichen'}).click(); await broker.waitForURL(/verification=submitted/);

const adminCtx=await browser.newContext({viewport:{width:1180,height:1000}}); const admin=await adminCtx.newPage(); await admin.goto(base+'/admin/login'); await admin.getByLabel('Admin-Passwort').fill(adminPassword); await Promise.all([admin.waitForURL('**/admin'),admin.getByRole('button',{name:'Admin anmelden'}).click()]); let card=admin.locator('.admin-card').filter({hasText:'Hauswert Makler GmbH'}).first(); await card.getByRole('button',{name:'Unternehmen freigeben'}).click(); await card.locator('.status.approved').waitFor(); card=admin.locator('.admin-card').filter({hasText:'Hauswert Makler GmbH'}).first(); await card.getByLabel('Status').selectOption('active'); for(const name of ['Betriebshaftpflicht geprüft','Qualifikation/Zulassung geprüft','Partnervertrag unterschrieben','Qualitätsstandard akzeptiert'])await card.getByLabel(name).check(); await card.getByRole('button',{name:'Partnervertrag speichern'}).click(); await card.getByText(/Vertrag Aktiv/).waitFor();

// B) Property is the durable central record; valuation and sale matching stay owner-controlled.
const ownerCtx=await browser.newContext({viewport:{width:390,height:844}}); const owner=await ownerCtx.newPage(); await owner.goto(base+'/register?role=homeowner'); await owner.getByLabel('Vorname').fill('Olivia'); await owner.getByLabel('Nachname').fill('Eigentümer'); await owner.getByLabel('E-Mail').fill(ownerEmail); await owner.getByLabel('Passwort').fill(password); await owner.getByLabel('PLZ').fill('46325'); await owner.getByLabel('Adresse').fill('Musterstraße 12, 46325 Borken'); await Promise.all([owner.waitForURL('**/app'),owner.getByRole('button',{name:'Konto erstellen'}).click()]);
await owner.goto(base+'/app/home'); await owner.locator('.house-menu details > summary').click(); await owner.getByLabel('Haustyp').selectOption('Einfamilienhaus'); await owner.getByLabel('Baujahr').fill('2001'); await owner.getByLabel('Wohnfläche m²').fill('160'); await owner.getByLabel('Grundstück m²').fill('650'); await owner.getByRole('button',{name:'Hausprofil speichern'}).click();
await owner.goto(base+'/app/home/history'); await owner.getByLabel('Bereich').selectOption({label:'Dach & Fassade'}); await owner.getByLabel('Datum').fill('2025-06-12'); await owner.getByLabel('Was wurde gemacht?').fill('Dach erneuert 2025'); await owner.getByLabel('Firma').fill('Dachbau Alt GmbH'); await owner.getByLabel('Kosten €').fill('18500'); await owner.getByLabel('Garantie bis').fill('2030-06-12'); await owner.getByRole('button',{name:'In Hausakte speichern'}).click(); await waitText(owner,'Dach erneuert 2025');
await owner.goto(base+'/app/home/sale'); await owner.getByLabel('Von €').fill('700000'); await owner.getByLabel('Bis €').fill('800000'); await owner.getByRole('button',{name:/Bewertung speichern/}).click(); await owner.waitForTimeout(200); await waitText(owner,'700.000'); await owner.getByRole('button',{name:'Makler finden'}).click(); await owner.waitForURL(/lead=/); await waitText(owner,'Hauswert Makler GmbH'); await waitText(owner,'Private Rechnungen, Dokumente und Nachrichten bleiben gesperrt'); await assertNoOverflow(owner,'Mobile sale matching');

// C) Broker cannot see owner contact before explicit release.
await broker.goto(base+'/pro/leads'); await waitText(broker,'Noch keine freigegebenen Immobilienanfragen'); if((await broker.locator('body').innerText()).includes(ownerEmail))throw new Error('Owner contact leaked before explicit release');
await owner.getByRole('button',{name:'Kontakt freigeben'}).click(); await owner.waitForTimeout(200); await broker.reload(); await waitText(broker,'Olivia Eigentümer'); await waitText(broker,ownerEmail); await assertNoOverflow(broker,'Mobile broker lead');
await owner.reload(); await owner.getByRole('button',{name:'Freigabe widerrufen'}).click(); await owner.waitForTimeout(150); await broker.reload(); await waitText(broker,'Noch keine freigegebenen Immobilienanfragen');

// D) The same property and its history can be transferred to a new owner.
const buyerCtx=await browser.newContext({viewport:{width:390,height:844}}); const buyer=await buyerCtx.newPage(); await buyer.goto(base+'/register?role=homeowner'); await buyer.getByLabel('Vorname').fill('Ben'); await buyer.getByLabel('Nachname').fill('Käufer'); await buyer.getByLabel('E-Mail').fill(buyerEmail); await buyer.getByLabel('Passwort').fill(password); await buyer.getByLabel('PLZ').fill('46325'); await Promise.all([buyer.waitForURL('**/app'),buyer.getByRole('button',{name:'Konto erstellen'}).click()]);
await owner.goto(base+'/app/home/history'); await owner.getByLabel('E-Mail des Käufers').fill(buyerEmail); await owner.getByRole('button',{name:'Übergabe vorbereiten'}).click(); await owner.waitForURL(/transfer=/); const token=new URL(owner.url()).searchParams.get('transfer'); if(!token)throw new Error('house transfer token missing');
await buyer.goto(base+`/transfer/${token}`); await waitText(buyer,'Hausakte übernehmen'); await buyer.getByRole('button',{name:'Hausakte jetzt übernehmen'}).click(); await buyer.waitForURL(/\/app\/home\?transfer=accepted/); await buyer.goto(base+'/app/home/history'); await waitText(buyer,'Dach erneuert 2025'); await waitText(buyer,'Olivia Eigentümer'); await waitText(buyer,'Ben Käufer'); await buyer.goto(base+'/app/home/sale'); await waitText(buyer,'700.000'); await assertNoOverflow(buyer,'Transferred property sale page');

console.log(JSON.stringify({ok:true,brokerEmail,ownerEmail,buyerEmail,vision:'one provider account + flexible categories + persistent property ownership history + valuation + permissioned broker matching'},null,2));
await browser.close();
