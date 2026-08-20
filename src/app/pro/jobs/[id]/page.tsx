import { notFound } from 'next/navigation';
import { CalendarDays,MapPin,MessageSquare,Phone,ShieldCheck,UserRound,XCircle } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { assignJobContactAction,declineDispatchAction,markCompleteAction,markInProgressAction,sendMessageAction,submitQuoteAction } from '@/app/actions';
import { dateLabel,euro,statusLabel } from '@/lib/format';
import { canAccessProviderJob,getProviderMembers } from '@/lib/provider';
import { DocumentForm } from './document-form';

export default async function ProJob({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('provider'); const {id}=await params; const sp=await searchParams; const jobId=Number(id);
  const ctx=canAccessProviderJob(u.id,jobId); if(!ctx)notFound();
  const access=db.prepare(`SELECT d.status dispatch_status,d.distance_km,d.match_score,j.*,h.address,h.postcode homeowner_postcode,hu.first_name homeowner_first,hu.last_name homeowner_last,hu.phone homeowner_phone,(SELECT path FROM job_photos x WHERE x.job_id=j.id LIMIT 1) photo
    FROM job_dispatches d JOIN jobs j ON j.id=d.job_id JOIN homeowner_profiles h ON h.user_id=j.homeowner_id JOIN users hu ON hu.id=j.homeowner_id
    WHERE d.job_id=? AND d.provider_id=?`).get(jobId,ctx.providerId) as any; if(!access)notFound();
  const quote=db.prepare('SELECT * FROM quotes WHERE job_id=? AND provider_id=?').get(access.id,ctx.providerId) as any;
  const isAccepted=quote?.status==='accepted'||access.dispatch_status==='accepted';
  if(!ctx.canManageJobs&&!isAccepted)notFound();
  const assignment=isAccepted?db.prepare(`SELECT a.*,u.first_name,u.last_name,u.phone,u.email,m.job_title FROM job_assignments a JOIN users u ON u.id=a.contact_user_id JOIN provider_members m ON m.user_id=a.contact_user_id WHERE a.job_id=?`).get(access.id) as any:null;
  if(!ctx.canManageJobs&&assignment?.contact_user_id!==u.id)notFound();
  const members=ctx.canManageJobs&&isAccepted?getProviderMembers(ctx.providerId):[];
  const docs=isAccepted?db.prepare('SELECT * FROM documents WHERE job_id=? AND provider_id=? ORDER BY created_at DESC').all(access.id,ctx.providerId) as any[]:[];
  const claim=isAccepted?db.prepare('SELECT * FROM claims WHERE job_id=?').get(access.id) as any:null;
  const messages=assignment?.contact_user_id===u.id?db.prepare('SELECT * FROM messages WHERE job_id=? ORDER BY created_at').all(access.id) as any[]:[];
  const mine=assignment?.contact_user_id===u.id;

  return <AppShell role="provider" active={isAccepted?'/pro/orders':'/pro'} title={isAccepted?'Auftrag':'Anfrage'} subtitle={access.category}>
    {sp.error&&<div className="alert error">{sp.error}</div>}
    <div className="detail-head pro-detail"><span className={`status ${access.status}`}>{statusLabel(access.status)}</span><h1>{access.title}</h1><p>{access.description}</p><div className="meta-line"><span><MapPin/>{isAccepted&&access.address?access.address:access.postcode}</span><span><CalendarDays/>{dateLabel(access.preferred_date)}</span></div>{access.photo&&<img className="hero-photo" src={access.photo} alt="Auftragsfoto"/>}<div className="budget-line"><small>KI-Richtpreis</small><strong>{access.budget_min&&access.budget_max?`${euro(access.budget_min)} – ${euro(access.budget_max)}`:euro(access.budget_max)}</strong></div></div>

    {!isAccepted&&ctx.canManageJobs&&access.status!=='completed'&&<><SectionTitle>Anfrage beantworten</SectionTitle><form action={submitQuoteAction.bind(null,access.id)} className="quote-form"><label>Gesamtpreis (€)<input name="amount" type="number" min="1" required defaultValue={quote?quote.amount/100:''}/></label><label>Verfügbar ab<input name="availableAt" type="datetime-local" defaultValue={quote?.available_at?.slice(0,16)||''}/></label><label>Leistungsumfang<textarea name="message" rows={4} defaultValue={quote?.message||''} placeholder="Leistung, Material, Entsorgung, Gewährleistung/Ausschlüsse …" required/></label><button className="btn light wide">{quote?'Angebot aktualisieren':'Angebot senden'}</button></form>{!quote&&<form action={declineDispatchAction.bind(null,access.id)} className="decline-form"><button className="btn ghost pro-ghost wide"><XCircle size={16}/>Anfrage ablehnen</button></form>}</>}

    {isAccepted&&<>
      <div className="alert success"><ShieldCheck/> Kunde hat den Auftrag bei {ctx.businessName} gebucht.</div>
      <SectionTitle>Ansprechpartner</SectionTitle>
      <div className="contact-card pro-contact-card"><UserRound/><div className="grow"><strong>{assignment?`${assignment.first_name} ${assignment.last_name}`:'Noch nicht zugewiesen'}</strong><p>{assignment?.job_title||'Bitte Ansprechpartner auswählen'}</p>{assignment&&<small>Dieser Kontakt ist für den Kunden sichtbar und bleibt nach Abschluss gespeichert.</small>}</div>{mine&&<span className="status active">Du</span>}</div>
      {ctx.canManageJobs&&<form action={assignJobContactAction.bind(null,access.id)} className="assign-form"><label>Auftrag zuweisen<select name="contactUserId" defaultValue={assignment?.contact_user_id||u.id}>{members.map(m=><option key={m.user_id} value={m.user_id}>{m.first_name} {m.last_name}{m.user_id===u.id?' · Ich':''} · {m.job_title||'Ansprechpartner'}</option>)}</select></label><button className="btn light">Ansprechpartner festlegen</button></form>}

      {mine&&<><SectionTitle>Kundenkontakt</SectionTitle><div className="direct-contact-actions"><a className="btn light" href={`/pro/messages?homeowner=${access.homeowner_id}`}><MessageSquare size={16}/>Direkt schreiben</a>{access.homeowner_phone&&<a className="btn light" href={`tel:${access.homeowner_phone}`}><Phone size={16}/>Anrufen</a>}</div><div className="partner-job-note"><strong>{access.homeowner_first} {access.homeowner_last}</strong><p>Du bist der persönliche Ansprechpartner. Stimme Termin und Rückfragen direkt mit dem Kunden ab. Einfach Hausen bleibt für Vermittlung, Hausakte und Servicefälle im Hintergrund verfügbar.</p></div>
        <div className="chat pro-chat">{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':access.homeowner_first}</small><p>{m.body}</p></div>)}<form action={sendMessageAction.bind(null,access.id,access.homeowner_id)} className="chat-form"><input name="body" placeholder="Nachricht an Kunden …" required/><button aria-label="Nachricht senden">↗</button></form></div>
        <div className="action-row">{access.status==='accepted'&&<form action={markInProgressAction.bind(null,access.id)}><button className="btn light">Arbeit starten</button></form>}{access.status==='in_progress'&&<form action={markCompleteAction.bind(null,access.id)}><button className="btn light">Als erledigt markieren</button></form>}</div>
      </>}

      {claim&&<div className="claim-notice pro-claim"><div><strong>Servicefall · {statusLabel(claim.status)}</strong><p>{claim.description}</p>{claim.admin_note&&<small>Plattform-Rückmeldung: {claim.admin_note}</small>}</div></div>}
      {mine&&<><SectionTitle>Dokumente & Rechnung</SectionTitle>{docs.length>0&&<div className="stack pro-doc-list">{docs.map(d=><a key={d.id} href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer"><strong>{d.title}</strong><small>{d.kind}</small></a>)}</div>}<DocumentForm jobId={access.id}/></>}
    </>}
  </AppShell>;
}
