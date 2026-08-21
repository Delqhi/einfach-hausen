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
import { createNotification } from '@/lib/notifications';
import { geocodePostcode } from '@/lib/geocode';
import { answerHausmeisterQuestion, appendJobEvent, createHausmeisterRequest, redispatchOpenJobs, type HausmeisterIntent } from '@/lib/orchestrator';
import { canAccessProviderJob, getProviderContext, getProviderManagerIds } from '@/lib/provider';

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
    else {
      db.prepare('INSERT INTO provider_profiles(user_id,business_name,trades,postcode,radius_km,description) VALUES(?,?,?,?,?,?)').run(id,text(fd,'businessName') || `${first} ${last}`,text(fd,'trades'),text(fd,'postcode'),int(fd,'radius') ?? 25,text(fd,'description'));
      db.prepare("INSERT INTO partner_contracts(provider_id,status,commission_bps) VALUES(?,'pending',0)").run(id);
      db.prepare("INSERT INTO provider_members(provider_id,user_id,job_title,can_manage_jobs,active) VALUES(?,?,'Geschäftsführung',1,1)").run(id,id);
    }
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

export async function sendHausmeisterAction(fd:FormData){
  const user=await requireUser('homeowner');
  const description=text(fd,'description');
  if(description.length<4) redirect('/app?error=Schreib%20mir%20kurz,%20worum%20es%20bei%20deinem%20Haus%20geht');
  const photo=fd.get('photo'); const saved=await saveUpload(photo instanceof File?photo:null);
  const thread=db.prepare(`SELECT id FROM assistant_threads WHERE user_id=? AND channel='app' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as {id:number}|undefined;
  const draft=thread?db.prepare('SELECT intent FROM assistant_drafts WHERE thread_id=?').get(thread.id) as {intent:HausmeisterIntent}|undefined:undefined;
  if(draft){
    const result=await createHausmeisterRequest(user.id,description,'app',saved,draft.intent,true);
    revalidatePath('/app'); revalidatePath('/pro'); revalidatePath('/notifications');
    redirect(result.jobId?`/app?job=${result.jobId}`:'/app?clarify=1');
  }
  await answerHausmeisterQuestion(user.id,description,'app',saved);
  revalidatePath('/app');
  redirect('/app?answered=1');
}

export async function startHausmeisterRouteAction(intent:HausmeisterIntent){
  const user=await requireUser('homeowner');
  const thread=db.prepare(`SELECT id FROM assistant_threads WHERE user_id=? AND channel='app' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as {id:number}|undefined;
  if(!thread)redirect('/app?error=Beschreib%20dein%20Thema%20zuerst%20kurz%20dem%20KI-Hausmeister');
  const latest=db.prepare(`SELECT body,metadata_json FROM assistant_messages WHERE thread_id=? AND role='user' ORDER BY created_at DESC,id DESC LIMIT 1`).get(thread.id) as {body:string;metadata_json:string}|undefined;
  if(!latest)redirect('/app?error=Beschreib%20dein%20Thema%20zuerst%20kurz%20dem%20KI-Hausmeister');
  let photo:string|null=null; try{const metadata=JSON.parse(latest.metadata_json||'{}');if(typeof metadata.photo==='string')photo=metadata.photo;}catch{}
  const result=await createHausmeisterRequest(user.id,latest.body,'app',photo,intent,false);
  revalidatePath('/app'); revalidatePath('/pro'); revalidatePath('/notifications');
  redirect(result.jobId?`/app/jobs/${result.jobId}`:'/app?clarify=1');
}

// Compatibility endpoint for older forms/bookmarks. Treat explicit legacy job forms as real service requests.
export async function createJobAction(fd: FormData) {
  const user=await requireUser('homeowner'); const description=text(fd,'description'); if(description.length<4)return;
  const photo=fd.get('photo'); const saved=await saveUpload(photo instanceof File?photo:null);
  const result=await createHausmeisterRequest(user.id,description,'app',saved,'service',true);
  redirect(result.jobId?`/app/jobs/${result.jobId}`:'/app?clarify=1');
}


export async function turnContactIntoServiceAction(jobId:number){
  const user=await requireUser('homeowner');
  const job=db.prepare(`SELECT j.*,(SELECT path FROM job_photos p WHERE p.job_id=j.id ORDER BY p.id ASC LIMIT 1) photo FROM jobs j WHERE j.id=? AND j.homeowner_id=? AND j.request_kind='contact'`).get(jobId,user.id) as any;
  if(!job)return;
  const sourceThread=db.prepare(`SELECT id FROM assistant_threads WHERE user_id=? AND active_job_id=? ORDER BY updated_at DESC LIMIT 1`).get(user.id,jobId) as {id:number}|undefined;
  const result=await createHausmeisterRequest(user.id,job.description,'app',job.photo||null,'service',false,sourceThread?.id);
  revalidatePath('/app'); revalidatePath('/pro'); revalidatePath('/notifications');
  redirect(result.jobId?`/app/jobs/${result.jobId}`:'/app?clarify=1');
}

export async function acceptContactRequestAction(jobId:number,fd:FormData){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.canManageJobs)return;
  const contactUserId=int(fd,'contactUserId')||user.id;
  const contact=db.prepare(`SELECT m.user_id,u.first_name,u.last_name,m.job_title FROM provider_members m JOIN users u ON u.id=m.user_id WHERE m.provider_id=? AND m.user_id=? AND m.active=1`).get(ctx.providerId,contactUserId) as any;
  if(!contact)return;
  const job=db.prepare(`SELECT j.* FROM jobs j JOIN job_dispatches d ON d.job_id=j.id WHERE j.id=? AND j.request_kind='contact' AND d.provider_id=? AND d.status IN ('sent','viewed') AND j.status='open'`).get(jobId,ctx.providerId) as any;
  if(!job)return;
  const tx=db.transaction(()=>{
    db.prepare(`UPDATE jobs SET status='accepted',updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
    db.prepare(`UPDATE job_dispatches SET status=CASE WHEN provider_id=? THEN 'accepted' ELSE 'closed' END,responded_at=COALESCE(responded_at,CURRENT_TIMESTAMP) WHERE job_id=?`).run(ctx.providerId,jobId);
    db.prepare(`INSERT INTO job_assignments(job_id,provider_id,contact_user_id,assigned_by_user_id) VALUES(?,?,?,?) ON CONFLICT(job_id) DO UPDATE SET provider_id=excluded.provider_id,contact_user_id=excluded.contact_user_id,assigned_by_user_id=excluded.assigned_by_user_id,assigned_at=CURRENT_TIMESTAMP`).run(jobId,ctx.providerId,contactUserId,user.id);
    db.prepare(`INSERT INTO homeowner_contacts(homeowner_id,provider_id,contact_user_id,category,last_job_id,updated_at) VALUES(?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(homeowner_id,contact_user_id) DO UPDATE SET provider_id=excluded.provider_id,category=excluded.category,last_job_id=excluded.last_job_id,updated_at=CURRENT_TIMESTAMP`).run(job.homeowner_id,ctx.providerId,contactUserId,job.category||'',jobId);
  }); tx();
  createNotification(job.homeowner_id,'Dein Ansprechpartner ist da',`${contact.first_name} ${contact.last_name} von ${ctx.businessName} ist jetzt dein persönlicher Ansprechpartner für dein Thema.`,`/app/jobs/${jobId}`,'contact');
  if(contactUserId!==user.id)createNotification(contactUserId,'Neue Kontaktanfrage zugewiesen',`Du bist jetzt Ansprechpartner für „${job.title.replace(/^Ansprechpartner:\s*/,'')}“.`,`/pro/jobs/${jobId}`,'assigned');
  appendJobEvent(jobId,`${contact.first_name} ${contact.last_name} von ${ctx.businessName} ist jetzt dein persönlicher Ansprechpartner. Es wurde noch kein Auftrag vergeben; du kannst direkt schreiben oder anrufen.`,{contactUserId,providerId:ctx.providerId,requestKind:'contact'});
  revalidatePath('/pro'); revalidatePath('/pro/orders'); revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/app/messages'); revalidatePath('/notifications');
  redirect(`/pro/jobs/${jobId}`);
}

export async function submitQuoteAction(jobId:number, fd:FormData){
  const user=await requireUser('provider'); const amount=int(fd,'amount'); if(!amount || amount<1) return;
  const ctx=getProviderContext(user.id); if(!ctx?.active||!ctx.canManageJobs) redirect(`/pro/jobs/${jobId}?error=Du%20darfst%20für%20diesen%20Betrieb%20keine%20neuen%20Aufträge%20verwalten`);
  const profile=db.prepare(`SELECT p.verified,c.status contract_status FROM provider_profiles p LEFT JOIN partner_contracts c ON c.provider_id=p.user_id WHERE p.user_id=?`).get(ctx.providerId) as {verified:number,contract_status:string|null}|undefined;
  if(!profile?.verified || profile.contract_status!=='active') redirect(`/pro/jobs/${jobId}?error=Dein%20Betrieb%20muss%20geprüft%20und%20vertraglich%20freigeschaltet%20sein`);
  const dispatch=db.prepare(`SELECT id FROM job_dispatches WHERE job_id=? AND provider_id=? AND status IN ('sent','viewed','quoted')`).get(jobId,ctx.providerId) as {id:number}|undefined;
  if(!dispatch) return;
  db.prepare(`INSERT INTO quotes(job_id,provider_id,amount,available_at,message,submitted_by_user_id) VALUES(?,?,?,?,?,?)
    ON CONFLICT(job_id,provider_id) DO UPDATE SET amount=excluded.amount,available_at=excluded.available_at,message=excluded.message,submitted_by_user_id=excluded.submitted_by_user_id,status='pending'`).run(jobId,ctx.providerId,amount*100,text(fd,'availableAt')||null,text(fd,'message'),user.id);
  db.prepare(`UPDATE jobs SET status=CASE WHEN status='open' THEN 'quoted' ELSE status END,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
  db.prepare(`UPDATE job_dispatches SET status='quoted',responded_at=CURRENT_TIMESTAMP WHERE job_id=? AND provider_id=?`).run(jobId,ctx.providerId);
  const job=db.prepare('SELECT homeowner_id,title FROM jobs WHERE id=?').get(jobId) as {homeowner_id:number,title:string}|undefined;
  if(job){
    createNotification(job.homeowner_id,'Neues Vergleichsangebot',`Für „${job.title}“ ist ein weiteres geprüftes Angebot eingetroffen. Dein Hausmeister hat den Vergleich aktualisiert.`,`/app/jobs/${jobId}`,'quote');
    appendJobEvent(jobId,`Ein neues Angebot für „${job.title}“ ist eingetroffen. Ich habe den Vergleich aktualisiert und bewerte Preis, Termin, Entfernung und Partnerqualität.`,{amount:amount*100,providerId:ctx.providerId});
  }
  revalidatePath('/pro'); revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function acceptQuoteAction(quoteId:number){
  const user=await requireUser('homeowner');
  const q=db.prepare(`SELECT q.*,j.homeowner_id,j.preferred_date,j.preferred_time,j.category,p.verified FROM quotes q JOIN jobs j ON j.id=q.job_id JOIN provider_profiles p ON p.user_id=q.provider_id WHERE q.id=?`).get(quoteId) as any;
  if(!q || q.homeowner_id!==user.id || !q.verified) return;
  const preferredContact=(db.prepare(`SELECT m.user_id FROM provider_members m WHERE m.provider_id=? AND m.active=1 AND m.user_id=?`).get(q.provider_id,q.submitted_by_user_id||q.provider_id) as {user_id:number}|undefined)?.user_id
    ||(db.prepare(`SELECT user_id FROM provider_members WHERE provider_id=? AND active=1 ORDER BY can_manage_jobs DESC,id ASC LIMIT 1`).get(q.provider_id) as {user_id:number}|undefined)?.user_id
    ||q.provider_id;
  const start=q.available_at || (q.preferred_date ? `${q.preferred_date}T${q.preferred_time||'09:00'}` : new Date(Date.now()+86400000).toISOString());
  const tx=db.transaction(()=>{
    db.prepare(`UPDATE quotes SET status=CASE WHEN id=? THEN 'accepted' ELSE 'rejected' END WHERE job_id=?`).run(quoteId,q.job_id);
    db.prepare(`UPDATE jobs SET status='accepted',accepted_quote_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(quoteId,q.job_id);
    db.prepare(`INSERT INTO appointments(job_id,provider_id,homeowner_id,start_at,contact_user_id) VALUES(?,?,?,?,?)`).run(q.job_id,q.provider_id,user.id,start,preferredContact);
    db.prepare(`UPDATE job_dispatches SET status=CASE WHEN provider_id=? THEN 'accepted' ELSE 'closed' END,responded_at=COALESCE(responded_at,CURRENT_TIMESTAMP) WHERE job_id=?`).run(q.provider_id,q.job_id);
    db.prepare(`INSERT INTO job_assignments(job_id,provider_id,contact_user_id,assigned_by_user_id) VALUES(?,?,?,?)
      ON CONFLICT(job_id) DO UPDATE SET provider_id=excluded.provider_id,contact_user_id=excluded.contact_user_id,assigned_by_user_id=excluded.assigned_by_user_id,assigned_at=CURRENT_TIMESTAMP`).run(q.job_id,q.provider_id,preferredContact,preferredContact);
    db.prepare(`INSERT INTO homeowner_contacts(homeowner_id,provider_id,contact_user_id,category,last_job_id,updated_at) VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(homeowner_id,contact_user_id) DO UPDATE SET provider_id=excluded.provider_id,category=excluded.category,last_job_id=excluded.last_job_id,updated_at=CURRENT_TIMESTAMP`).run(user.id,q.provider_id,preferredContact,q.category||'',q.job_id);
  }); tx();
  const jobTitle=(db.prepare('SELECT title FROM jobs WHERE id=?').get(q.job_id) as {title:string}|undefined)?.title||'Auftrag';
  for(const managerId of getProviderManagerIds(q.provider_id))createNotification(managerId,'Auftrag erhalten',`Das Angebot für „${jobTitle}“ wurde angenommen. Ansprechpartner kann jetzt bestätigt oder geändert werden.`,`/pro/jobs/${q.job_id}`,'accepted');
  if(!getProviderManagerIds(q.provider_id).includes(preferredContact))createNotification(preferredContact,'Neuer Auftrag für dich',`Du bist Ansprechpartner für „${jobTitle}“.`,`/pro/jobs/${q.job_id}`,'accepted');
  const contact=db.prepare('SELECT first_name,last_name FROM users WHERE id=?').get(preferredContact) as {first_name:string,last_name:string}|undefined;
  appendJobEvent(q.job_id,`Gebucht. ${contact?`${contact.first_name} ${contact.last_name} ist ab jetzt dein persönlicher Ansprechpartner beim ausführenden Unternehmen.`:'Der Partner weist dir jetzt einen persönlichen Ansprechpartner zu.'} Dein KI-Hausmeister bleibt für Organisation, Hausakte und Unterstützung erreichbar.`,{providerId:q.provider_id,quoteId,contactUserId:preferredContact});
  revalidatePath(`/app/jobs/${q.job_id}`); revalidatePath('/app/calendar'); revalidatePath('/app/messages'); revalidatePath('/pro'); revalidatePath('/pro/orders'); revalidatePath('/notifications');
}

export async function sendMessageAction(jobId:number, recipientId:number, fd:FormData){
  const user=await requireUser(); const body=text(fd,'body'); if(!body) return;
  const row=db.prepare(`SELECT j.homeowner_id,a.contact_user_id FROM jobs j JOIN job_assignments a ON a.job_id=j.id WHERE j.id=?`).get(jobId) as {homeowner_id:number,contact_user_id:number}|undefined;
  if(!row)return;
  const allowed=(user.role==='homeowner'&&user.id===row.homeowner_id&&recipientId===row.contact_user_id)||(user.role==='provider'&&user.id===row.contact_user_id&&recipientId===row.homeowner_id);
  if(!allowed)return;
  db.prepare('INSERT INTO messages(job_id,sender_id,recipient_id,body) VALUES(?,?,?,?)').run(jobId,user.id,recipientId,body.slice(0,4000));
  createNotification(recipientId,'Neue Nachricht',`${user.first_name}: ${body.slice(0,120)}`,user.role==='provider'?`/app/jobs/${jobId}`:`/pro/jobs/${jobId}`,'message');
  revalidatePath(user.role==='provider'?`/pro/jobs/${jobId}`:`/app/jobs/${jobId}`); revalidatePath('/notifications');
  revalidatePath(user.role==='provider'?'/pro/messages':'/app/messages');
}

export async function markInProgressAction(jobId:number){
  const user=await requireUser('provider'); const ctx=canAccessProviderJob(user.id,jobId); if(!ctx)return;
  const job=db.prepare(`SELECT j.homeowner_id,j.title FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=? AND q.provider_id=?`).get(jobId,ctx.providerId) as any; if(!job)return;
  db.prepare(`UPDATE jobs SET status='in_progress',updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
  createNotification(job.homeowner_id,'Auftrag gestartet',`${user.first_name} hat „${job.title}“ als in Arbeit markiert. Dein Hausmeister behält den Status im Blick.`,`/app/jobs/${jobId}`,'status');
  appendJobEvent(jobId,`${user.first_name} hat mit „${job.title}“ begonnen. Bei Fragen kannst du deinen Ansprechpartner direkt kontaktieren; dein KI-Hausmeister bleibt parallel für Organisation und Hilfe da.`,{status:'in_progress',contactUserId:user.id});
  revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function markCompleteAction(jobId:number){
  const user=await requireUser('provider'); const ctx=canAccessProviderJob(user.id,jobId); if(!ctx)return;
  const job=db.prepare(`SELECT j.homeowner_id,j.title,j.category FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=? AND q.provider_id=?`).get(jobId,ctx.providerId) as any; if(!job)return;
  db.prepare(`UPDATE jobs SET status='completed',updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(jobId);
  db.prepare(`UPDATE appointments SET status='completed' WHERE job_id=?`).run(jobId);
  const assigned=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=?').get(jobId) as {contact_user_id:number}|undefined;
  if(assigned)db.prepare(`INSERT INTO homeowner_contacts(homeowner_id,provider_id,contact_user_id,category,last_job_id,updated_at) VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(homeowner_id,contact_user_id) DO UPDATE SET provider_id=excluded.provider_id,category=excluded.category,last_job_id=excluded.last_job_id,updated_at=CURRENT_TIMESTAMP`).run(job.homeowner_id,ctx.providerId,assigned.contact_user_id,job.category||'',jobId);
  createNotification(job.homeowner_id,'Auftrag erledigt',`„${job.title}“ wurde als erledigt markiert. Dein Ansprechpartner bleibt für künftige Aufträge in „Kontakte“ gespeichert.`,`/app/jobs/${jobId}`,'completed');
  appendJobEvent(jobId,`„${job.title}“ wurde als erledigt gemeldet. Dein Ansprechpartner bleibt in deiner Hausakte gespeichert, damit du ihn später direkt wieder kontaktieren kannst.`,{status:'completed'});
  revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/app/messages'); revalidatePath('/notifications');
}

export async function createCheckoutAction(jobId:number){
  const user=await requireUser('homeowner');
  const q=db.prepare(`SELECT q.amount,q.provider_id,j.title,j.homeowner_id,p.stripe_account_id,p.stripe_onboarded,p.verified FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id JOIN provider_profiles p ON p.user_id=q.provider_id WHERE j.id=?`).get(jobId) as any;
  if(!q || q.homeowner_id!==user.id) return;
  if(!process.env.STRIPE_SECRET_KEY) redirect(`/app/jobs/${jobId}?error=Stripe%20ist%20noch%20nicht%20konfiguriert`);
  if(!q.verified) redirect(`/app/jobs/${jobId}?error=Der%20Partner%20ist%20nicht%20mehr%20verifiziert`);
  if(!q.stripe_account_id || !q.stripe_onboarded) redirect(`/app/jobs/${jobId}?error=Der%20Dienstleister%20hat%20seine%20Auszahlung%20noch%20nicht%20vollständig%20eingerichtet`);
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!); const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  const session=await stripe.checkout.sessions.create({ mode:'payment', customer_email:user.email, line_items:[{price_data:{currency:process.env.STRIPE_CURRENCY||'eur',product_data:{name:q.title},unit_amount:q.amount},quantity:1}],payment_intent_data:{transfer_data:{destination:q.stripe_account_id},metadata:{jobId:String(jobId),homeownerId:String(user.id),providerId:String(q.provider_id),platformCommissionBps:'0'}},success_url:`${origin}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/app/jobs/${jobId}?payment=cancelled`,metadata:{jobId:String(jobId),homeownerId:String(user.id),providerId:String(q.provider_id),platformCommissionBps:'0'}});
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
  const assigned=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=?').get(jobId) as {contact_user_id:number}|undefined; const recipients=new Set<number>([...getProviderManagerIds(row.provider_id),...(assigned?[assigned.contact_user_id]:[])]); for(const recipient of recipients)createNotification(recipient,'Neue Bewertung',`Der Auftrag hat eine ${rating}-Sterne-Bewertung erhalten.`,`/pro/orders`,'review');
  revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/notifications');
}

export async function saveProfileAction(fd:FormData){
  const user=await requireUser();
  db.prepare('UPDATE users SET first_name=?,last_name=?,phone=? WHERE id=?').run(text(fd,'firstName'),text(fd,'lastName'),text(fd,'phone')||null,user.id);
  if(user.role==='homeowner'){
    db.prepare('UPDATE homeowner_profiles SET postcode=?,address=? WHERE user_id=?').run(text(fd,'postcode'),text(fd,'address'),user.id);
    const postcode=text(fd,'postcode'); const geo=await geocodePostcode(postcode); if(geo)db.prepare('UPDATE homeowner_profiles SET lat=?,lon=? WHERE user_id=?').run(geo.lat,geo.lon,user.id);
  } else {
    const ctx=getProviderContext(user.id); if(!ctx)return;
    if(ctx.isOwner||ctx.canManageJobs){
      const current=db.prepare('SELECT business_name,trades,verified FROM provider_profiles WHERE user_id=?').get(ctx.providerId) as any;
      const businessName=text(fd,'businessName')||current?.business_name||ctx.businessName; const trades=text(fd,'trades')||current?.trades||'';
      db.prepare('UPDATE provider_profiles SET business_name=?,trades=?,postcode=?,radius_km=?,description=? WHERE user_id=?').run(businessName,trades,text(fd,'postcode'),int(fd,'radius')||25,text(fd,'description'),ctx.providerId);
      if(current?.verified && (current.business_name!==businessName || current.trades!==trades)){
        db.prepare('UPDATE provider_profiles SET verified=0 WHERE user_id=?').run(ctx.providerId);
        db.prepare(`UPDATE verification_requests SET status='pending',reviewed_at=NULL,admin_note='',submitted_at=CURRENT_TIMESTAMP WHERE provider_id=?`).run(ctx.providerId);
      }
      const postcode=text(fd,'postcode'); const geo=await geocodePostcode(postcode); if(geo)db.prepare('UPDATE provider_profiles SET lat=?,lon=? WHERE user_id=?').run(geo.lat,geo.lon,ctx.providerId);
    }
  }
  revalidatePath(user.role==='provider'?'/pro/profile':'/app/profile'); revalidatePath('/pro'); revalidatePath('/pro/team');
}

export async function uploadDocumentAction(jobId:number, fd:FormData){
  const user=await requireUser('provider'); const ctx=canAccessProviderJob(user.id,jobId); if(!ctx)return;
  const allowed=db.prepare(`SELECT j.homeowner_id,j.title FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=? AND q.provider_id=?`).get(jobId,ctx.providerId) as {homeowner_id:number,title:string}|undefined;
  if(!allowed) return;
  const file=fd.get('document'); if(!(file instanceof File) || file.size===0) return;
  const stored=await savePrivateFile(file,'documents');
  const kind=['invoice','offer','report','warranty','other'].includes(text(fd,'kind'))?text(fd,'kind'):'other';
  db.prepare('INSERT INTO documents(job_id,provider_id,kind,title,path) VALUES(?,?,?,?,?)').run(jobId,ctx.providerId,kind,text(fd,'title').slice(0,160),stored);
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
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.isOwner)redirect('/pro/profile?verification=owner'); const file=fd.get('document');
  if(!(file instanceof File)||file.size===0) redirect('/pro/profile?verification=file');
  const saved=await savePrivateFile(file,'verification');
  db.prepare(`INSERT INTO verification_requests(provider_id,document_path,status,provider_note,submitted_at,reviewed_at,admin_note) VALUES(?,?,'pending',?,CURRENT_TIMESTAMP,NULL,'') ON CONFLICT(provider_id) DO UPDATE SET document_path=excluded.document_path,status='pending',provider_note=excluded.provider_note,submitted_at=CURRENT_TIMESTAMP,reviewed_at=NULL,admin_note=''`).run(ctx.providerId,saved,text(fd,'note').slice(0,1000));
  db.prepare('UPDATE provider_profiles SET verified=0 WHERE user_id=?').run(ctx.providerId);
  revalidatePath('/pro/profile'); revalidatePath('/admin'); redirect('/pro/profile?verification=submitted');
}

export async function adminReviewVerificationAction(requestId:number,fd:FormData){
  await requireAdmin(); const decision=text(fd,'decision'); if(!['approved','rejected'].includes(decision)) return;
  const row=db.prepare('SELECT provider_id FROM verification_requests WHERE id=?').get(requestId) as {provider_id:number}|undefined; if(!row)return;
  const tx=db.transaction(()=>{db.prepare('UPDATE verification_requests SET status=?,admin_note=?,reviewed_at=CURRENT_TIMESTAMP WHERE id=?').run(decision,text(fd,'adminNote').slice(0,2000),requestId);db.prepare('UPDATE provider_profiles SET verified=? WHERE user_id=?').run(decision==='approved'?1:0,row.provider_id);}); tx();
  createNotification(row.provider_id,decision==='approved'?'Unternehmensprüfung bestanden':'Unternehmensprüfung abgelehnt',decision==='approved'?'Deine Unternehmensnachweise sind geprüft. Für Kundenanfragen muss zusätzlich der Einfach-Hausen-Partnervertrag aktiv sein.':(text(fd,'adminNote')||'Bitte prüfe deine Nachweise und reiche sie erneut ein.'),'/pro/profile','verification');
  revalidatePath('/admin'); revalidatePath('/pro/profile'); revalidatePath('/pro'); revalidatePath('/notifications');
}

export async function createClaimAction(jobId:number,fd:FormData){
  const user=await requireUser('homeowner'); const description=text(fd,'description'); if(description.length<20)return;
  const row=db.prepare(`SELECT j.homeowner_id,j.status,q.provider_id FROM jobs j JOIN quotes q ON q.id=j.accepted_quote_id WHERE j.id=?`).get(jobId) as any;
  if(!row||row.homeowner_id!==user.id||!['accepted','in_progress','completed'].includes(row.status)) return;
  db.prepare(`INSERT INTO claims(job_id,homeowner_id,provider_id,description,status) VALUES(?,?,?,?,'pending') ON CONFLICT(job_id) DO UPDATE SET description=excluded.description,status=CASE WHEN claims.status IN ('resolved','rejected') THEN 'pending' ELSE claims.status END,admin_note=CASE WHEN claims.status IN ('resolved','rejected') THEN '' ELSE claims.admin_note END,updated_at=CURRENT_TIMESTAMP`).run(jobId,user.id,row.provider_id,description.slice(0,4000));
  const assigned=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=?').get(jobId) as {contact_user_id:number}|undefined;
  const recipients=new Set<number>([...getProviderManagerIds(row.provider_id),...(assigned?[assigned.contact_user_id]:[])]); for(const recipient of recipients)createNotification(recipient,'Problemfall gemeldet',`Der Kunde hat zu Auftrag #${jobId} einen Problemfall gemeldet.`,`/pro/jobs/${jobId}`,'claim');
  revalidatePath(`/app/jobs/${jobId}`); revalidatePath(`/pro/jobs/${jobId}`); revalidatePath('/admin'); revalidatePath('/notifications');
}

export async function adminUpdateClaimAction(claimId:number,fd:FormData){
  await requireAdmin(); const status=text(fd,'status'); if(!['pending','reviewing','resolved','rejected'].includes(status))return;
  const claim=db.prepare('SELECT job_id,homeowner_id,provider_id FROM claims WHERE id=?').get(claimId) as {job_id:number,homeowner_id:number,provider_id:number}|undefined; if(!claim)return;
  const note=text(fd,'adminNote').slice(0,3000); db.prepare('UPDATE claims SET status=?,admin_note=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status,note,claimId);
  const body=note||`Der Fall wurde auf „${status}“ gesetzt.`; createNotification(claim.homeowner_id,'Problemfall aktualisiert',body,`/app/jobs/${claim.job_id}`,'claim');
  const assigned=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=?').get(claim.job_id) as {contact_user_id:number}|undefined; const recipients=new Set<number>([...getProviderManagerIds(claim.provider_id),...(assigned?[assigned.contact_user_id]:[])]); for(const recipient of recipients)createNotification(recipient,'Problemfall aktualisiert',body,`/pro/jobs/${claim.job_id}`,'claim');
  revalidatePath('/admin'); revalidatePath(`/app/jobs/${claim.job_id}`); revalidatePath(`/pro/jobs/${claim.job_id}`); revalidatePath('/notifications');
}

export async function createStripeOnboardingAction(){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.isOwner)redirect('/pro/profile?stripe=owner');
  if(!process.env.STRIPE_SECRET_KEY) redirect('/pro/profile?stripe=missing');
  const profile=db.prepare('SELECT stripe_account_id,business_name FROM provider_profiles WHERE user_id=?').get(ctx.providerId) as any;
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); let accountId=profile?.stripe_account_id as string|undefined;
  if(!accountId){const account=await stripe.accounts.create({type:'express',country:'DE',email:user.email,business_profile:{name:profile?.business_name||`${user.first_name} ${user.last_name}`},capabilities:{card_payments:{requested:true},transfers:{requested:true}}});accountId=account.id;db.prepare('UPDATE provider_profiles SET stripe_account_id=?,stripe_onboarded=0 WHERE user_id=?').run(accountId,ctx.providerId);}
  const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  const link=await stripe.accountLinks.create({account:accountId,refresh_url:`${origin}/api/stripe/connect/refresh`,return_url:`${origin}/api/stripe/connect/return`,type:'account_onboarding'});
  redirect(link.url);
}

export async function markNotificationsReadAction(){const user=await requireUser();db.prepare('UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE user_id=? AND read_at IS NULL').run(user.id);revalidatePath('/notifications');}

export async function declineDispatchAction(jobId:number){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.canManageJobs)return;
  db.prepare(`UPDATE job_dispatches SET status='declined',responded_at=CURRENT_TIMESTAMP WHERE job_id=? AND provider_id=? AND status IN ('sent','viewed')`).run(jobId,ctx.providerId);
  revalidatePath('/pro'); revalidatePath(`/pro/jobs/${jobId}`);
}

export async function adminUpdatePartnerContractAction(providerId:number,fd:FormData){
  await requireAdmin();
  const status=text(fd,'status'); if(!['pending','active','suspended','ended'].includes(status))return;
  const commission=0;
  const discount=Math.max(0,Math.min(3000,int(fd,'discountBps')??0));
  const response=Math.max(5,Math.min(240,int(fd,'responseTarget')??30));
  db.prepare(`INSERT INTO partner_contracts(provider_id,status,commission_bps,customer_discount_bps,insurance_verified,qualification_verified,contract_verified,quality_standard_verified,response_target_minutes,starts_at,notes,updated_at)
    VALUES(?,?,?,?,?,?,?,?,?,CASE WHEN ?='active' THEN COALESCE((SELECT starts_at FROM partner_contracts WHERE provider_id=?),CURRENT_TIMESTAMP) ELSE (SELECT starts_at FROM partner_contracts WHERE provider_id=?) END,?,CURRENT_TIMESTAMP)
    ON CONFLICT(provider_id) DO UPDATE SET status=excluded.status,commission_bps=excluded.commission_bps,customer_discount_bps=excluded.customer_discount_bps,insurance_verified=excluded.insurance_verified,qualification_verified=excluded.qualification_verified,contract_verified=excluded.contract_verified,quality_standard_verified=excluded.quality_standard_verified,response_target_minutes=excluded.response_target_minutes,starts_at=excluded.starts_at,notes=excluded.notes,updated_at=CURRENT_TIMESTAMP`).run(
      providerId,status,commission,discount,fd.get('insurance')?1:0,fd.get('qualification')?1:0,fd.get('contract')?1:0,fd.get('quality')?1:0,response,status,providerId,providerId,text(fd,'contractNotes').slice(0,3000));
  createNotification(providerId,status==='active'?'Partnervertrag aktiv':'Partnerstatus aktualisiert',status==='active'?'Dein Einfach-Hausen-Partnervertrag ist aktiv. Passende regionale Kundenanfragen werden ab jetzt automatisch an dich disponiert.':`Dein Partnerstatus wurde auf ${status} gesetzt.`,'/pro/profile','contract');
  if(status==='active')await redispatchOpenJobs();
  revalidatePath('/admin'); revalidatePath('/pro'); revalidatePath('/pro/profile'); revalidatePath('/notifications');
}

export async function addProviderMemberAction(fd:FormData){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.canManageJobs)redirect('/pro/team?error=Keine%20Berechtigung');
  const email=text(fd,'email').toLowerCase(); const password=text(fd,'password'); const first=text(fd,'firstName'); const last=text(fd,'lastName');
  if(!email||!first||!last||password.length<8)redirect('/pro/team?error=Bitte%20alle%20Pflichtfelder%20ausfüllen');
  if(db.prepare('SELECT id FROM users WHERE email=?').get(email))redirect('/pro/team?error=E-Mail%20ist%20bereits%20registriert');
  const hash=await bcrypt.hash(password,12);
  const tx=db.transaction(()=>{
    const r=db.prepare(`INSERT INTO users(email,password_hash,role,first_name,last_name,phone) VALUES(?,?,'provider',?,?,?)`).run(email,hash,first,last,text(fd,'phone')||null);
    const memberId=Number(r.lastInsertRowid);
    db.prepare('INSERT INTO provider_members(provider_id,user_id,job_title,can_manage_jobs,active) VALUES(?,?,?,?,1)').run(ctx.providerId,memberId,text(fd,'jobTitle'),fd.get('canManageJobs')?1:0);
    return memberId;
  });
  const memberId=tx(); createNotification(memberId,'Willkommen im Partnerteam',`Du hast jetzt App-Zugang für ${ctx.businessName}.`,'/pro','team');
  revalidatePath('/pro/team'); redirect('/pro/team?member=created');
}

export async function updateProviderMemberAction(memberUserId:number,fd:FormData){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.canManageJobs)return;
  const member=db.prepare('SELECT * FROM provider_members WHERE provider_id=? AND user_id=?').get(ctx.providerId,memberUserId) as any; if(!member)return;
  let nextManage=fd.get('canManageJobs')?1:0; let nextActive=fd.get('active')?1:0;
  if(memberUserId===ctx.providerId){nextManage=1;nextActive=1;}
  if(member.active&&member.can_manage_jobs&&(!nextManage||!nextActive)){const managers=(db.prepare('SELECT COUNT(*) c FROM provider_members WHERE provider_id=? AND active=1 AND can_manage_jobs=1').get(ctx.providerId) as {c:number}).c;if(managers<=1)redirect('/pro/team?error=Mindestens%20eine%20Person%20muss%20Aufträge%20verwalten');}
  db.prepare('UPDATE provider_members SET job_title=?,can_manage_jobs=?,active=? WHERE provider_id=? AND user_id=?').run(text(fd,'jobTitle'),nextManage,nextActive,ctx.providerId,memberUserId);
  revalidatePath('/pro/team'); revalidatePath('/pro');
}

export async function assignJobContactAction(jobId:number,fd:FormData){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.canManageJobs)return;
  const contactUserId=int(fd,'contactUserId'); if(!contactUserId)return;
  const contact=db.prepare(`SELECT m.user_id,u.first_name,u.last_name FROM provider_members m JOIN users u ON u.id=m.user_id WHERE m.provider_id=? AND m.user_id=? AND m.active=1`).get(ctx.providerId,contactUserId) as any; if(!contact)return;
  const job=db.prepare(`SELECT j.id,j.homeowner_id,j.title,j.category,j.request_kind FROM jobs j WHERE j.id=? AND j.status IN ('accepted','in_progress') AND ((j.request_kind='contact' AND EXISTS(SELECT 1 FROM job_dispatches d WHERE d.job_id=j.id AND d.provider_id=? AND d.status='accepted')) OR EXISTS(SELECT 1 FROM quotes q WHERE q.id=j.accepted_quote_id AND q.provider_id=?))`).get(jobId,ctx.providerId,ctx.providerId) as any; if(!job)return;
  const previous=db.prepare('SELECT contact_user_id FROM job_assignments WHERE job_id=?').get(jobId) as {contact_user_id:number}|undefined;
  const tx=db.transaction(()=>{
    db.prepare(`INSERT INTO job_assignments(job_id,provider_id,contact_user_id,assigned_by_user_id) VALUES(?,?,?,?) ON CONFLICT(job_id) DO UPDATE SET contact_user_id=excluded.contact_user_id,assigned_by_user_id=excluded.assigned_by_user_id,assigned_at=CURRENT_TIMESTAMP`).run(jobId,ctx.providerId,contactUserId,user.id);
    if(job.request_kind!=='contact')db.prepare('UPDATE appointments SET contact_user_id=? WHERE job_id=?').run(contactUserId,jobId);
    if(previous&&previous.contact_user_id!==contactUserId)db.prepare('DELETE FROM homeowner_contacts WHERE homeowner_id=? AND contact_user_id=? AND last_job_id=?').run(job.homeowner_id,previous.contact_user_id,jobId);
    db.prepare(`INSERT INTO homeowner_contacts(homeowner_id,provider_id,contact_user_id,category,last_job_id,updated_at) VALUES(?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(homeowner_id,contact_user_id) DO UPDATE SET provider_id=excluded.provider_id,category=excluded.category,last_job_id=excluded.last_job_id,updated_at=CURRENT_TIMESTAMP`).run(job.homeowner_id,ctx.providerId,contactUserId,job.category||'',jobId);
  }); tx();
  createNotification(job.homeowner_id,'Dein Ansprechpartner steht fest',`${contact.first_name} ${contact.last_name} von ${ctx.businessName} kümmert sich um „${job.title}“.`,`/app/jobs/${jobId}`,'contact');
  if(contactUserId!==user.id)createNotification(contactUserId,job.request_kind==='contact'?'Kontaktanfrage zugewiesen':'Auftrag zugewiesen',`Du bist jetzt Ansprechpartner für „${job.title.replace(/^Ansprechpartner:\s*/,'')}“.`,`/pro/jobs/${jobId}`,'assigned');
  appendJobEvent(jobId,job.request_kind==='contact'?`${contact.first_name} ${contact.last_name} von ${ctx.businessName} ist dein direkter Ansprechpartner. Du kannst jetzt schreiben oder anrufen; es ist weiterhin kein Auftrag vergeben.`:`${contact.first_name} ${contact.last_name} von ${ctx.businessName} ist dein direkter Ansprechpartner für diesen Auftrag. Du kannst jetzt direkt schreiben, anrufen oder den Termin abstimmen.`,{contactUserId,providerId:ctx.providerId,requestKind:job.request_kind});
  revalidatePath(`/pro/jobs/${jobId}`); revalidatePath(`/app/jobs/${jobId}`); revalidatePath('/app/messages'); revalidatePath('/pro/orders'); revalidatePath('/notifications');
}

export async function sendSavedContactMessageAction(contactUserId:number,homeownerId:number,fd:FormData){
  const user=await requireUser(); const body=text(fd,'body'); if(!body)return;
  const relation=db.prepare('SELECT * FROM homeowner_contacts WHERE homeowner_id=? AND contact_user_id=?').get(homeownerId,contactUserId) as any; if(!relation)return;
  let recipientId:number;
  if(user.role==='homeowner'){
    if(user.id!==homeownerId)return; recipientId=contactUserId;
  }else{
    if(user.id!==contactUserId)return; const ctx=getProviderContext(user.id); if(!ctx||ctx.providerId!==relation.provider_id)return; recipientId=homeownerId;
  }
  db.prepare('INSERT INTO contact_messages(homeowner_id,provider_id,contact_user_id,sender_id,body) VALUES(?,?,?,?,?)').run(homeownerId,relation.provider_id,contactUserId,user.id,body.slice(0,4000));
  createNotification(recipientId,'Neue direkte Nachricht',`${user.first_name}: ${body.slice(0,120)}`,user.role==='homeowner'?`/pro/messages?homeowner=${homeownerId}`:`/app/messages?contact=${contactUserId}`,'message');
  revalidatePath('/app/messages'); revalidatePath('/pro/messages'); revalidatePath('/notifications');
}

export async function startPartnerPlanCheckoutAction(planSlug:string){
  const user=await requireUser('provider'); const ctx=getProviderContext(user.id); if(!ctx?.isOwner)redirect('/pro/plans?error=Nur%20der%20Firmeninhaber%20kann%20den%20Tarif%20ändern');
  const plan=db.prepare('SELECT * FROM partner_plans WHERE slug=? AND active=1').get(planSlug) as any; if(!plan)return;
  if(plan.monthly_amount===0){const current=db.prepare('SELECT stripe_subscription_id FROM partner_subscriptions WHERE provider_id=?').get(ctx.providerId) as {stripe_subscription_id:string|null}|undefined;if(current?.stripe_subscription_id&&process.env.STRIPE_SECRET_KEY){const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);try{await stripe.subscriptions.cancel(current.stripe_subscription_id);}catch{}}db.prepare(`INSERT INTO partner_subscriptions(provider_id,plan_slug,status,updated_at) VALUES(?,?,'active',CURRENT_TIMESTAMP) ON CONFLICT(provider_id) DO UPDATE SET plan_slug=excluded.plan_slug,status='active',stripe_subscription_id=NULL,current_period_end=NULL,trial_end=NULL,updated_at=CURRENT_TIMESTAMP`).run(ctx.providerId,plan.slug);revalidatePath('/pro/plans');redirect('/pro/plans?checkout=success');}
  if(!process.env.STRIPE_SECRET_KEY)redirect('/pro/plans?error=Stripe%20ist%20noch%20nicht%20konfiguriert');
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  db.prepare(`INSERT INTO partner_subscriptions(provider_id,plan_slug,status,updated_at) VALUES(?,?,'pending',CURRENT_TIMESTAMP) ON CONFLICT(provider_id) DO UPDATE SET plan_slug=excluded.plan_slug,status='pending',updated_at=CURRENT_TIMESTAMP`).run(ctx.providerId,plan.slug);
  const session=await stripe.checkout.sessions.create({mode:'subscription',customer_email:user.email,line_items:[{price_data:{currency:'eur',product_data:{name:`Einfach Hausen Partner ${plan.title}`},unit_amount:plan.monthly_amount,recurring:{interval:'month'}},quantity:1}],subscription_data:{trial_period_days:plan.trial_days||60},success_url:`${origin}/api/partner-memberships/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/pro/plans?checkout=cancelled`,metadata:{kind:'partner_membership',providerId:String(ctx.providerId),planSlug:plan.slug}});
  redirect(session.url!);
}

export async function saveHouseProfileAction(fd:FormData){
  const user=await requireUser('homeowner');
  const postcode=text(fd,'postcode');
  db.prepare(`UPDATE homeowner_profiles SET address=?,postcode=?,house_type=?,build_year=?,living_area=?,plot_area=? WHERE user_id=?`).run(text(fd,'address'),postcode,text(fd,'houseType'),int(fd,'buildYear'),Number(fd.get('livingArea'))||null,Number(fd.get('plotArea'))||null,user.id);
  const geo=await geocodePostcode(postcode); if(geo)db.prepare('UPDATE homeowner_profiles SET lat=?,lon=? WHERE user_id=?').run(geo.lat,geo.lon,user.id);
  revalidatePath('/app/home'); revalidatePath('/app/profile');
}

export async function addHouseAssetAction(fd:FormData){
  const user=await requireUser('homeowner'); const kind=text(fd,'kind'); const name=text(fd,'name'); if(!kind||!name)return;
  const r=db.prepare('INSERT INTO house_assets(homeowner_id,kind,name,details,installed_year) VALUES(?,?,?,?,?)').run(user.id,kind,name,text(fd,'details').slice(0,1000),int(fd,'installedYear'));
  const assetId=Number(r.lastInsertRowid); const today=new Date(); const due=new Date(today); due.setMonth(due.getMonth()+12);
  const defaults:Record<string,string>={heating:'Heizung / Wärmepumpe prüfen lassen',pv:'PV-Anlage und Ertrag prüfen',storage:'Speicher-Check vormerken',wallbox:'Wallbox / Elektroprüfung vormerken',roof:'Dach und Dachrinne prüfen',windows:'Fenster und Türen prüfen',garden:'Saisonale Gartenpflege planen',smarthome:'Smart-Home- und Sicherheitscheck'};
  db.prepare('INSERT INTO maintenance_tasks(homeowner_id,asset_id,title,category,due_date,recurrence_months) VALUES(?,?,?,?,?,12)').run(user.id,assetId,defaults[kind]||`${name} prüfen`,kind,due.toISOString().slice(0,10));
  revalidatePath('/app/home');
}

export async function completeMaintenanceTaskAction(taskId:number){
  const user=await requireUser('homeowner'); const task=db.prepare('SELECT * FROM maintenance_tasks WHERE id=? AND homeowner_id=?').get(taskId,user.id) as any; if(!task)return;
  db.prepare("UPDATE maintenance_tasks SET status='completed' WHERE id=?").run(taskId);
  if(task.recurrence_months){const d=new Date(task.due_date);d.setMonth(d.getMonth()+task.recurrence_months);db.prepare('INSERT INTO maintenance_tasks(homeowner_id,asset_id,title,category,due_date,recurrence_months) VALUES(?,?,?,?,?,?)').run(user.id,task.asset_id,task.title,task.category,d.toISOString().slice(0,10),task.recurrence_months);}
  revalidatePath('/app/home');
}

export async function startMembershipCheckoutAction(planSlug:string){
  const user=await requireUser('homeowner');
  const plan=db.prepare('SELECT * FROM membership_plans WHERE slug=? AND active=1').get(planSlug) as any; if(!plan)return;
  const current=db.prepare('SELECT stripe_subscription_id FROM subscriptions WHERE homeowner_id=?').get(user.id) as {stripe_subscription_id:string|null}|undefined;
  if(plan.monthly_amount===0){
    if(current?.stripe_subscription_id&&process.env.STRIPE_SECRET_KEY){const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);try{await stripe.subscriptions.cancel(current.stripe_subscription_id);}catch{}}
    db.prepare(`INSERT INTO subscriptions(homeowner_id,plan_slug,status,stripe_subscription_id,current_period_end,updated_at) VALUES(?,?,'active',NULL,NULL,CURRENT_TIMESTAMP) ON CONFLICT(homeowner_id) DO UPDATE SET plan_slug=excluded.plan_slug,status='active',stripe_subscription_id=NULL,current_period_end=NULL,updated_at=CURRENT_TIMESTAMP`).run(user.id,plan.slug);
    revalidatePath('/app/plans'); revalidatePath('/app'); redirect('/app/plans?checkout=success');
  }
  if(!process.env.STRIPE_SECRET_KEY) redirect('/app/plans?error=Stripe%20ist%20noch%20nicht%20konfiguriert');
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  db.prepare(`INSERT INTO subscriptions(homeowner_id,plan_slug,status,updated_at) VALUES(?,?,'pending',CURRENT_TIMESTAMP) ON CONFLICT(homeowner_id) DO UPDATE SET plan_slug=excluded.plan_slug,status='pending',updated_at=CURRENT_TIMESTAMP`).run(user.id,plan.slug);
  const session=await stripe.checkout.sessions.create({mode:'subscription',customer_email:user.email,line_items:[{price_data:{currency:'eur',product_data:{name:`Einfach Hausen ${plan.title}`},unit_amount:plan.monthly_amount,recurring:{interval:'month'}},quantity:1}],success_url:`${origin}/api/memberships/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/app/plans?checkout=cancelled`,metadata:{kind:'membership',homeownerId:String(user.id),planSlug:plan.slug,previousSubscriptionId:current?.stripe_subscription_id||''}});
  redirect(session.url!);
}

export async function purchasePackageAction(packageSlug:string){
  const user=await requireUser('homeowner'); const pkg=db.prepare('SELECT * FROM service_packages WHERE slug=? AND active=1').get(packageSlug) as any; if(!pkg)return;
  if(!process.env.STRIPE_SECRET_KEY) redirect('/app/plans?error=Stripe%20ist%20noch%20nicht%20konfiguriert');
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const origin=process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000';
  const order=db.prepare(`INSERT INTO package_orders(homeowner_id,package_slug,status) VALUES(?,?,'pending')`).run(user.id,pkg.slug); const orderId=Number(order.lastInsertRowid);
  const session=await stripe.checkout.sessions.create({mode:'payment',customer_email:user.email,line_items:[{price_data:{currency:'eur',product_data:{name:`Einfach Hausen · ${pkg.title}`},unit_amount:pkg.price_amount},quantity:1}],success_url:`${origin}/api/packages/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/app/plans?checkout=cancelled`,metadata:{kind:'package',homeownerId:String(user.id),packageSlug:pkg.slug,packageOrderId:String(orderId)}});
  db.prepare('UPDATE package_orders SET stripe_session_id=? WHERE id=?').run(session.id,orderId); redirect(session.url!);
}
