import { chromium } from 'playwright-core';

const base=process.env.E2E_BASE_URL||'http://127.0.0.1:3001';
const adminPassword=process.env.E2E_ADMIN_PASSWORD;
if(!adminPassword)throw new Error('E2E_ADMIN_PASSWORD is required');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(base+'/admin/login');
  await page.getByLabel('Admin-Passwort').fill(adminPassword);
  await Promise.all([page.waitForURL('**/admin'),page.getByRole('button',{name:'Admin anmelden'}).click()]);
  await page.getByRole('link',{name:'Leads & CRM'}).click();
  await page.getByRole('heading',{name:'Leads & CRM'}).waitFor();
  await page.getByRole('button',{name:/Alle Research-Daten synchronisieren/}).click();
  await page.waitForURL(/\/admin\/crm\?sync=\d+&updated=\d+/,{timeout:120000});
  await page.getByText(/Leads$/).first().waitFor();

  const stamp=Date.now();
  const name=`CRM Eigentümer ${stamp}`;
  const add=page.locator('form').filter({has:page.getByRole('button',{name:'Lead speichern'})});
  await add.locator('select[name="leadType"]').selectOption('homeowner');
  await add.locator('select[name="sourceType"]').selectOption('community');
  await add.locator('input[name="name"]').fill(name);
  await add.locator('input[name="postcode"]').fill('10115');
  await add.locator('input[name="locality"]').fill('Berlin');
  await add.locator('input[name="profileUrl"]').fill(`https://community.example/profiles/${stamp}`);
  await add.locator('input[name="sourceDetail"]').fill('E2E Community Opt-in');
  await add.locator('select[name="permission"]').selectOption('consented');
  await add.locator('textarea[name="notes"]').fill('Testlead mit dokumentierter Einwilligung');
  await Promise.all([page.waitForURL(/created=1/),add.getByRole('button',{name:'Lead speichern'}).click()]);
  const card=page.locator('article').filter({hasText:name}).first();
  await card.waitFor();
  await card.locator('select[name="status"]').selectOption('qualified');
  await card.locator('select[name="permission"]').selectOption('consented');
  await card.locator('select[name="channel"]').selectOption('social');
  await card.locator('input[name="notes"]').fill('Qualifiziert im CRM-E2E; kein Versand ausgeführt');
  await card.getByRole('button',{name:'Speichern'}).click();
  await page.waitForTimeout(300);
  await page.screenshot({path:'artifacts/admin-crm.png',fullPage:true});
  console.log(JSON.stringify({ok:true,name,url:page.url()},null,2));
}finally{await browser.close();}
