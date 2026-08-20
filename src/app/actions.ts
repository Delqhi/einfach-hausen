'use server';

import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { createSession, destroySession, requireUser } from '@/lib/auth';
import { adminPasswordMatches, createAdminSession, destroyAdminSession, requireAdmin } from '@/lib/admin-auth';
import { parseRequest } from '@/lib/request-ai';
import { createNotification } from '@/lib/notifications';
import { geocodePostcode } from '@/lib/geocode';

function text(fd: FormData, key: string) { return String(fd.get(key) ?? '').trim(); }
function int(fd: FormData, key: string) { const n = Number(fd.get(key)); return Number.isFinite(n) ? n : null; }

export async function registerAction(fd: FormData) {
  const role = text(fd,'role') === 'provider' ? 'provider' : 'homeowner';
  const email = text(fd,'email').toLowerCase();
  const password = text(fd,'password');
  const first = text(fd,'firstName'); const last = text(fd,'lastName');
  if (!email || password.length < 8 || !first || !last) redirect('/register?error=Bitte%20alle%20Pflichtfelder%20ausfüllen');
  if (db.prepare('SELECT id FROM users WHERE email=?').get(email)) redirect('/login?error=Konto%20existiert%20bereits');
  const hash = await bcrypt.hash(password, 12);
  const tx = db.transaction(() => {
    const r = db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name) VALUES(?,?,?,?,?)').run(email,hash,role,first,last);
    const id = Number(r.lastInsertRowid);
    if (role==='homeowner') db.prepare('INSERT INTO homeowner_profiles(user_id,postcode,address) VALUES(?,?,?)').run(id,text(fd,'postcode'),text(fd,'address'));
    else db.prepare('INSERT INTO provider_profiles(user_id,business_name,trades,postcode,radius_km,description) VALUES(?,?,?,?,?,?)').run(id,text(fd,'businessName') || `${first} ${last}`,text(fd,'trades'),text(fd,'postcode'),int(fd,'radius') ?? 25,text(fd,'description'));
    return id;
  });
  const id = tx();
  const postcode=text(fd,'postcode'); const geo=await geocodePostcode(postcode);
  if(geo){const table=role==='provider'?'provider_profiles':'homeowner_profiles';db.prepare(`UPDATE ${table} SET lat=?,lon=? WHERE user_id=?`).run(geo.lat,geo.lon,id);}
  await createSession(id); redirect(role==='provider'?'/pro':'/app');
}

export async function loginAction(fd: FormData) {
  const email=text(fd,'email').toLowerCase(); const password=text(fd,'password');
  const row=db.prepare('SELECT id,password_hash,role FROM users WHERE email=?').get(email) as {id:number,password_hash:string,role:'homeowner'|'provider'}|undefined;
  if (!row || !(await bcrypt.compare(password,row.password_hash))) redirect('/login?error=E-Mail%20oder%20Passwort%20ist%20falsch');
  await createSession(row.id); redirect(row.role==='provider'?'/pro':'/app');
}
export async function logoutAction(){ await destroySession(); redirect('/'); }

async function saveUpload(file: File | null) {
  if (!file || file.size===0) return null;
  if (!file.type.startsWith('image/') || file.size > 8*1024*1024) throw new Error('Ungültiges Bild');
  const ext = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi,'').slice(0,5) || 'jpg';
  const name = `${Date.now()}-${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(),'public','uploads'); await fs.mkdir(dir,{recursive:true});
  await fs.writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function createJobAction(fd: FormData) {
  const user=await requireUser('homeowner'); const description=text(fd,'description');
  if (description.length<8) redirect('/app?error=Bitte%20beschreibe%20den%20Auftrag%20etwas%20genauer');
  const parsed=parseRequest(description);
  const profile=db.prepare('SELECT postcode FROM homeowner_profiles WHERE user_id=?').get(user.id) as {postcode:string}|undefined;
  const postcode=text(fd,'postcode') || parsed.postcode || profile?.postcode || '';
  const bmin=int(fd,'budgetMin'); const bmax=int(fd,'budgetMax');
  const r=db.prepare(`INSERT INTO jobs(homeowner_id,title,description,category,postcode,preferred_date,preferred_time,budget_min,budget_max) VALUES(?,?,?,?,?,?,?,?,?)`).run(
    user.id,text(fd,'title')||parsed.title,description,text(fd,'category')||parsed.category,postcode,text(fd,'preferredDate')||parsed.preferredDate||null,text(fd,'preferredTime')||parsed.preferredTime||null,
    bmin!==null?bmin*100:(parsed.budgetMin?parsed.budgetMin*100:null), bmax!==null?bmax*100:(parsed.budgetMax?parsed.budgetMax*100:null));
  const jobId=Number(r.lastInsertRowid);
  const photo=fd.get('photo'); const saved=await saveUpload(photo instanceof File?photo:null);
  if(saved) db.prepare('INSERT INTO job_photos(job_id,path) VALUES(?,?)').run(jobId,saved);
  const geo=await geocodePostcode(postcode); if(geo) db.prepare('UPDATE jobs SET lat=?,lon=? WHERE id=?').run(geo.lat,geo.lon,jobId);
  redirect(`/app/jobs/${jobId}?created=1`);
}

export async function submitQuoteAction(jobId:number, fd:FormData){
  const user=await requireUser('provider'); const amount=int(fd,'amount'); if(!amount || amount<1) return;
  const profile=db.prepare('SELECT verified FROM provider_profiles WHERE user_id=?').get(user.id) as {verified:number}|undefined;
  if(!profile?.verified) redirect(`/pro/jobs/${jobId}?error=Dein%20Partnerprofil%20muss%20vor%20dem%20ersten%20Angebot%20geprüft%20werden`);
  db.prepare(`INSERT INTO quotes(job_id,provider_id,amount,available_at,message) VALUES(?,?,?,?,?)
    ON CONFLICT(job_id,provider_id) DO UPDATE SET amount=excluded.amount,available_at=excluded.available_at,message=excluded.message,status='pending'`).run(jobId,user.id,amount*100,text(fd,'availableAt')||null,text(fd,'message'));
  db.prepare(`UPDATE jobs SET status=CASE WHEN status='open' THEN 'quoted' ELSE status END,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
  const job=db.prepare('SELECT homeowner_id,title FROM jobs WHERE id=?').get(jobId) as {homeowner_id:number,title:string}|undefined;
  if(job) createNotification(job.homeowner_id,'Neues Angebot',`${user.first_name} hat ein Angebot über ${amount} € für „${job.title}“ abgegeben.`,`/app/jobs/${jobId}`,'quote');
  revalidatePath('/pro'); revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function acceptQuoteAction(quoteId:number){
  const user=await requireUser('homeowner');
  const q=db.prepare(`SELECT q.*,j.homeowner_id,j.preferred_date,j.preferred_time,p.verified FROM quotes q JOIN jobs j ON j.id=q.job_id JOIN provider_profiles p ON p.user_id=q.provider_id WHERE q.id=?`).get(quoteId) as any;
  if(!q || q.homeowner_id!==user.id || !q.verified) return;
  const start=q.available_at || (q.preferred_date ? `${q.preferred_date}T${q.preferred_time||'09:00'}` : new Date(Date.now()+86400000).toISOString());
  const tx=db.transaction(()=>{
    db.prepare(`UPDATE quotes SET status=CASE WHEN id=? THEN 'accepted' ELSE 'rejected' END WHERE job_id=?`).run(quoteId,q.job_id);
    db.prepare(`UPDATE jobs SET status='accepted',accepted_quote_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(quoteId,q.job_id);
    db.prepare(`INSERT INTO appointments(job_id,provider_id,homeowner_id,start_at) VALUES(?,?,?,?)`).run(q.job_id,q.provider_id,user.id,start);
  }); tx();
  const jobTitle=(db.prepare('SELECT title FROM jobs WHERE id=?').get(q.job_id) as {title:string}|undefined)?.title||'Auftrag';
  createNotification(q.provider_id,'Auftrag erhalten',`Dein Angebot für „${jobTitle}“ wurde angenommen.`,`/pro/jobs/${q.job_id}`,'accepted');
  revalidatePath(`/app/jobs/${q.job_id}`); revalidatePath('/app/calendar'); revalidatePath('/pro'); revalidatePath('/notifications');
}

export async function sendMessageAction(jobId:number, recipientId:number, fd:FormData){
  const user=await requireUser(); const body=text(fd,'body'); if(!body) return;
  const allowed=db.prepare(`SELECT 1 FROM jobs j LEFT JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=? AND ((j.homeowner_id=? AND q.provider_id=?) OR (q.provider_id=? AND j.homeowner_id=?))`).get(jobId,user.id,recipientId,user.id,recipientId);
  if(!allowed) return;
  db.prepare('INSERT INTO messages(job_id,sender_id,recipient_id,body) VALUES(?,?,?,?)').run(jobId,user.id,recipientId,body.slice(0,4000));
  createNotification(recipientId,'Neue Nachricht',`${user.first_name}: ${body.slice(0,120)}`,user.role==='provider'?`/app/jobs/${jobId}`:`/pro/jobs/${jobId}`,'message');
  revalidatePath(user.role==='provider'?`/pro/jobs/${jobId}`:`/app/jobs/${jobId}`); revalidatePath('/notifications');
  revalidatePath(user.role==='provider'?'/pro/messages':'/app/messages');
}

export async function markInProgressAction(jobId:number){
  const user=await requireUser('provider');
  const job=db.prepare(`SELECT homeowner_id,title FROM jobs WHERE id=? AND accepted_quote_id IN (SELECT id FROM quotes WHERE provider_id=?)`).get(jobId,user.id) as any; if(!job)return;
  db.prepare(`UPDATE jobs SET status='in_progress',updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
  createNotification(job.homeowner_id,'Arbeit gestartet',`${user.first_name} hat „${job.title}“ als in Arbeit markiert.`,`/app/jobs/${jobId}`,'status');
  revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function markCompleteAction(jobId:number){
  const user=await requireUser('provider');
  const job=db.prepare(`SELECT homeowner_id,title FROM jobs WHERE id=? AND accepted_quote_id IN (SELECT id FROM quotes WHERE provider_id=?)`).get(jobId,user.id) as any; if(!job)return;
  db.prepare(`UPDATE jobs SET status='completed',updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
  db.prepare(`UPDATE appointments SET status='completed' WHERE job_id=?`).run(jobId);
  createNotification(job.homeowner_id,'Auftrag erledigt',`„${job.title}“ wurde als erledigt markiert. Du kannst die Ausführung jetzt bewerten.`,`/app/jobs/${jobId}`,'completed');
  revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function createCheckoutAction(jobId:number){
  const user=await requireUser('homeowner');
  const q=db.prepare(`SELECT q.amount,q.provider_id,j.title,j.homeowner_id,p.stripe_account_id,p.stripe_onboarded,p.verified FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id JOIN provider_profiles p ON p.user_id=q.provider_id WHERE j.id=?`).get(jobId) as any;
  if(!q || q.homeowner_id!==user.id) return;
  if(!process.env.STRIPE_SECRET_KEY) redirect(`/app/jobs/${jobId}?error=Stripe%20ist%20noch%20nicht%20konfiguriert`);
  if(!q.verified) redirect(`/app/jobs/${jobId}?error=Der%20Partner%20ist%20nicht%20mehr%20verifiziert`);
  if(!q.stripe_account_id || !q.stripe_onboarded) redirect(`/app/jobs/${jobId}?error=Der%20Dienstleister%20hat%20seine%20Auszahlung%20noch%20nicht%20vollständig%20eingerichtet`);
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!); const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  const feeBps=Math.max(0,Math.min(5000,Number(process.env.PLATFORM_FEE_BPS||1000))); const fee=Math.round(q.amount*feeBps/10000);
  const session=await stripe.checkout.sessions.create({ mode:'payment', customer_email:user.email, line_items:[{price_data:{currency:process.env.STRIPE_CURRENCY||'eur',product_data:{name:q.title},unit_amount:q.amount},quantity:1}],payment_intent_data:{application_fee_amount:fee,transfer_data:{destination:q.stripe_account_id},metadata:{jobId:String(jobId),homeownerId:String(user.id),providerId:String(q.provider_id)}},success_url:`${origin}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/app/jobs/${jobId}?payment=cancelled`,metadata:{jobId:String(jobId),homeownerId:String(user.id),providerId:String(q.provider_id)}});
  db.prepare('INSERT INTO payments(job_id,homeowner_id,provider_id,amount,currency,status,stripe_session_id) VALUES(?,?,?,?,?,?,?)').run(jobId,user.id,q.provider_id,q.amount,process.env.STRIPE_CURRENCY||'eur','pending',session.id);
  redirect(session.url!);
}

export async function reviewAction(jobId:number, fd:FormData){
  const user=await requireUser('homeowner'); const rating=Math.max(1,Math.min(5,int(fd,'rating')||5));
  const row=db.prepare(`SELECT j.homeowner_id,q.provider_id FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=? AND j.status='completed'`).get(jobId) as any;
  if(!row || row.homeowner_id!==user.id) return;
  db.prepare('INSERT OR REPLACE INTO reviews(job_id,homeowner_id,provider_id,rating,comment) VALUES(?,?,?,?,?)').run(jobId,user.id,row.provider_id,rating,text(fd,'comment'));
  const agg=db.prepare('SELECT AVG(rating) avg,COUNT(*) count FROM reviews WHERE provider_id=?').get(row.provider_id) as any;
  db.prepare('UPDATE provider_profiles SET rating=?,rating_count=? WHERE user_id=?').run(agg.avg||0,agg.count||0,row.provider_id);
  createNotification(row.provider_id,'Neue Bewertung',`Du hast eine ${rating}-Sterne-Bewertung erhalten.`,`/pro/orders`,'review');
  revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function saveProfileAction(fd:FormData){
  const user=await requireUser();
  db.prepare('UPDATE users SET first_name=?,last_name=?,phone=? WHERE id=?').run(text(fd,'firstName'),text(fd,'lastName'),text(fd,'phone')||null,user.id);
  if(user.role==='homeowner') db.prepare('UPDATE homeowner_profiles SET postcode=?,address=? WHERE user_id=?').run(text(fd,'postcode'),text(fd,'address'),user.id);
  else {
    const current=db.prepare('SELECT business_name,trades,verified FROM provider_profiles WHERE user_id=?').get(user.id) as any;
    const businessName=text(fd,'businessName'),trades=text(fd,'trades');
    db.prepare('UPDATE provider_profiles SET business_name=?,trades=?,postcode=?,radius_km=?,description=? WHERE user_id=?').run(businessName,trades,text(fd,'postcode'),int(fd,'radius')||25,text(fd,'description'),user.id);
    if(current?.verified && (current.business_name!==businessName || current.trades!==trades)){
      db.prepare('UPDATE provider_profiles SET verified=0 WHERE user_id=?').run(user.id);
      db.prepare(`UPDATE verification_requests SET status='pending',reviewed_at=NULL,admin_note='',submitted_at=CURRENT_TIMESTAMP WHERE provider_id=?`).run(user.id);
    }
  }
  const postcode=text(fd,'postcode'); const geo=await geocodePostcode(postcode);
  if(geo){const table=user.role==='provider'?'provider_profiles':'homeowner_profiles';db.prepare(`UPDATE ${table} SET lat=?,lon=? WHERE user_id=?`).run(geo.lat,geo.lon,user.id);}
  revalidatePath(user.role==='provider'?'/pro/profile':'/app/profile'); revalidatePath('/pro');
}

export async function uploadDocumentAction(jobId:number, fd:FormData){
  const user=await requireUser('provider');
  const allowed=db.prepare(`SELECT j.homeowner_id,j.title FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=? AND q.provider_id=?`).get(jobId,user.id) as {homeowner_id:number,title:string}|undefined;
  if(!allowed) return;
  const file=fd.get('document'); if(!(file instanceof File) || file.size===0) return;
  const stored=await savePrivateFile(file,'documents');
  const kind=['invoice','offer','report','warranty','other'].includes(text(fd,'kind'))?text(fd,'kind'):'other';
  db.prepare('INSERT INTO documents(job_id,provider_id,kind,title,path) VALUES(?,?,?,?,?)').run(jobId,user.id,kind,text(fd,'title').slice(0,160),stored);
  createNotification(allowed.homeowner_id,'Neues Dokument',`${text(fd,'title').slice(0,160)} wurde zu „${allowed.title}“ hinzugefügt.`,`/app/documents`,'document');
  revalidatePath(`/pro/jobs/${jobId}`); revalidatePath('/app/documents'); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}


export async function adminLoginAction(fd:FormData){
  const password=text(fd,'password');
  if(!adminPasswordMatches(password)) redirect('/admin/login?error=Anmeldung%20fehlgeschlagen');
  await createAdminSession(); redirect('/admin');
}
export async function adminLogoutAction(){await destroyAdminSession();redirect('/admin/login');}

async function savePrivateFile(file:File,subdir:string){
  const ok=file.type==='application/pdf'||file.type.startsWith('image/');
  if(!ok||file.size===0||file.size>12*1024*1024) throw new Error('Ungültige Datei');
  const ext=(file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'').slice(0,6)||'bin';
  const name=`${Date.now()}-${randomUUID()}.${ext}`; const dir=path.join(process.cwd(),'data','private',subdir);
  await fs.mkdir(dir,{recursive:true}); await fs.writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()),{mode:0o600});
  return `${subdir}/${name}`;
}

export async function submitVerificationAction(fd:FormData){
  const user=await requireUser('provider'); const file=fd.get('document');
  if(!(file instanceof File)||file.size===0) redirect('/pro/profile?verification=file');
  const saved=await savePrivateFile(file,'verification');
  db.prepare(`INSERT INTO verification_requests(provider_id,document_path,status,provider_note,submitted_at,reviewed_at,admin_note) VALUES(?,?,'pending',?,CURRENT_TIMESTAMP,NULL,'') ON CONFLICT(provider_id) DO UPDATE SET document_path=excluded.document_path,status='pending',provider_note=excluded.provider_note,submitted_at=CURRENT_TIMESTAMP,reviewed_at=NULL,admin_note=''`).run(user.id,saved,text(fd,'note').slice(0,1000));
  db.prepare('UPDATE provider_profiles SET verified=0 WHERE user_id=?').run(user.id);
  revalidatePath('/pro/profile'); revalidatePath('/admin'); redirect('/pro/profile?verification=submitted');
}

export async function adminReviewVerificationAction(requestId:number,fd:FormData){
  await requireAdmin(); const decision=text(fd,'decision'); if(!['approved','rejected'].includes(decision)) return;
  const row=db.prepare('SELECT provider_id FROM verification_requests WHERE id=?').get(requestId) as {provider_id:number}|undefined; if(!row)return;
  const tx=db.transaction(()=>{db.prepare('UPDATE verification_requests SET status=?,admin_note=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=?').run(decision,text(fd,'adminNote').slice(0,2000),requestId);db.prepare('UPDATE provider_profiles SET verified=? WHERE user_id=?').run(decision==='approved'?1:0,row.provider_id);}); tx();
  createNotification(row.provider_id,decision==='approved'?'Partnerprüfung bestanden':'Partnerprüfung abgelehnt',decision==='approved'?'Dein Betrieb ist freigegeben. Du kannst jetzt Kundenanfragen sehen und Angebote abgeben.':(text(fd,'adminNote')||'Bitte prüfe deine Nachweise und reiche sie erneut ein.'),'/pro/profile','verification');
  revalidatePath('/admin'); revalidatePath('/pro/profile'); revalidatePath('/pro'); revalidatePath('/notifications');
}

export async function createClaimAction(jobId:number,fd:FormData){
  const user=await requireUser('homeowner'); const description=text(fd,'description'); if(description.length<20)return;
  const row=db.prepare(`SELECT j.homeowner_id,j.status,q.provider_id FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=?`).get(jobId) as any;
  if(!row||row.homeowner_id!==user.id||!['accepted','in_progress','completed'].includes(row.status)) return;
  db.prepare(`INSERT INTO claims(job_id,homeowner_id,provider_id,description,status) VALUES(?,?,?,?,'pending') ON CONFLICT(job_id) DO UPDATE SET description=excluded.description,status=CASE WHEN claims.status IN ('resolved','rejected') THEN 'pending' ELSE claims.status END,admin_note=CASE WHEN claims.status IN ('resolved','rejected') THEN '' ELSE claims.admin_note END,updated_at=CURRENT_TIMESTAMP`).run(jobId,user.id,row.provider_id,description.slice(0,4000));
  createNotification(row.provider_id,'Problemfall gemeldet',`Der Kunde hat zu Auftrag #${jobId} einen Problemfall gemeldet.`,`/pro/jobs/${jobId}`,'claim');
  revalidatePath(`/app/jobs/${jobId}`); revalidatePath(`/pro/jobs/${jobId}`); revalidatePath('/admin'); revalidatePath('/notifications');
}

export async function adminUpdateClaimAction(claimId:number,fd:FormData){
  await requireAdmin(); const status=text(fd,'status'); if(!['pending','reviewing','resolved','rejected'].includes(status))return;
  const claim=db.prepare('SELECT job_id,homeowner_id,provider_id FROM claims WHERE id=?').get(claimId) as {job_id:number,homeowner_id:number,provider_id:number}|undefined; if(!claim)return;
  const note=text(fd,'adminNote').slice(0,3000); db.prepare('UPDATE claims SET status=?,admin_note=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status,note,claimId);
  const body=note||`Der Fall wurde auf „${status}“ gesetzt.`; createNotification(claim.homeowner_id,'Problemfall aktualisiert',body,`/app/jobs/${claim.job_id}`,'claim'); createNotification(claim.provider_id,'Problemfall aktualisiert',body,`/pro/jobs/${claim.job_id}`,'claim');
  revalidatePath('/admin'); revalidatePath(`/app/jobs/${claim.job_id}`); revalidatePath(`/pro/jobs/${claim.job_id}`); revalidatePath('/notifications');
}

export async function createStripeOnboardingAction(){
  const user=await requireUser('provider');
  if(!process.env.STRIPE_SECRET_KEY) redirect('/pro/profile?stripe=missing');
  const profile=db.prepare('SELECT stripe_account_id,business_name FROM provider_profiles WHERE user_id=?').get(user.id) as any;
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); let accountId=profile?.stripe_account_id as string|undefined;
  if(!accountId){const account=await stripe.accounts.create({type:'express',country:'DE',email:user.email,business_profile:{name:profile?.business_name||`${user.first_name} ${user.last_name}`},capabilities:{card_payments:{requested:true},transfers:{requested:true}}});accountId=account.id;db.prepare('UPDATE provider_profiles SET stripe_account_id=?,stripe_onboarded=0 WHERE user_id=?').run(accountId,user.id);}
  const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  const link=await stripe.accountLinks.create({account:accountId,refresh_url:`${origin}/api/stripe/connect/refresh`,return_url:`${origin}/api/stripe/connect/return`,type:'account_onboarding'});
  redirect(link.url);
}

export async function markNotificationsReadAction(){const user=await requireUser();db.prepare('UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE user_id=? AND read_at IS NULL').run(user.id);revalidatePath('/notifications');}
