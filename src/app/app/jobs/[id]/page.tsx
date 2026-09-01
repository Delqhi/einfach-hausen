import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle,CalendarDays,CheckCircle2,Clock3,MapPin,MessageCircle,MessageSquare,Phone,ShieldCheck,Sparkles,Star,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { JobMedia } from '@/components/job-media';
import { mediaKindFromPath } from '@/lib/intake-media';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { acceptQuoteAction,cancelJobAction,createCheckoutAction,createClaimAction,reviewAction,sendMessageAction,sendSavedContactMessageAction,turnContactIntoServiceAction } from '@/app/actions';
import { dateLabel,euro,statusLabel } from '@/lib/format';
import { getQuoteRecommendations } from '@/lib/orchestrator';
import { SubmitButton } from '@/components/ui/submit-button';

function emergencyAvailability(value?:string|null){
  if(!value)return 'Zeit nach Rückmeldung';
  const timestamp=new Date(value).getTime();
  if(!Number.isFinite(timestamp))return dateLabel(value);
  const minutes=Math.max(0,Math.round((timestamp-Date.now())/60000));
  if(minutes<=5)return 'voraussichtlich sofort verfügbar';
  if(minutes<=180)return `voraussichtlich in ca. ${minutes} Min. verfügbar`;
  return `verfügbar ab ${dateLabel(value)}`;
}

function scopeNotes(message:string|undefined,jobDescription:string){
  const offer=(message||'').toLowerCase(); const job=jobDescription.toLowerCase(); const notes:string[]=[];
  if(!offer.includes('material'))notes.push('Material nicht ausdrücklich genannt');
  if(/hecke|baum|schnitt|abbruch|demont|entrümpel|garten/.test(job)&&!/(entsorg|abtransport|abfuhr)/.test(offer))notes.push('Entsorgung/Abtransport nicht ausdrücklich genannt');
  if(!/(anfahrt|fahrtkosten|fahrkosten)/.test(offer))notes.push('Anfahrt nicht ausdrücklich genannt');
  return notes.slice(0,3);
}

export default async function JobDetail({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const {id}=await params; const sp=await searchParams;
  const job=db.prepare(`SELECT j.*,(SELECT id FROM job_photos p WHERE p.job_id=j.id LIMIT 1) photo_id,(SELECT path FROM job_photos p WHERE p.job_id=j.id LIMIT 1) photo_path FROM jobs j WHERE j.id=? AND j.homeowner_id=?`).get(Number(id),u.id) as any; if(!job)notFound();
  if(job.request_kind==='contact'){
    const contact=db.prepare(`SELECT a.provider_id,a.contact_user_id,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name FROM job_assignments a JOIN users u ON u.id=a.contact_user_id JOIN provider_members m ON m.user_id=a.contact_user_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.job_id=?`).get(job.id) as any;
    const messages=contact?db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(u.id,contact.contact_user_id) as any[]:[];
    const dispatches=db.prepare(`SELECT COUNT(*) total FROM job_dispatches WHERE job_id=?`).get(job.id) as any;
    return <AppShell role="homeowner" active="/app/jobs" title="Ansprechpartner" subtitle={job.category}>
      <div className="detail-head"><span className={`status ${job.status}`}>{contact?'Verbunden':'Ansprechpartner gesucht'}</span><h1>{job.title.replace(/^Ansprechpartner:\s*/,'')}</h1><p>{job.description}</p><div className="meta-line"><span><MapPin/>{job.postcode}</span></div>{job.photo_id&&<JobMedia src={`/api/job-media/${job.photo_id}`} alt="Foto, Video oder Sprachnachricht zum Thema" kind={mediaKindFromPath(job.photo_path)}/>}</div>
      <div className="ai-summary"><Sparkles/><div><strong>Du hast nur einen Ansprechpartner gewählt</strong><p>Es wurde noch kein Auftrag vergeben und kein Preis vereinbart. Der Hausmeisterservice bleibt dabei und verbindet dich nur mit einem passenden Menschen.</p></div></div>
      {!contact?<div className="empty compact"><MessageCircle/><strong>Passender Ansprechpartner wird gesucht</strong><p>{dispatches.total||0} geprüfte regionale Partner wurden angefragt. Sobald ein Betrieb übernimmt, kannst du direkt schreiben oder anrufen.</p></div>:<>
        <SectionTitle>Dein persönlicher Ansprechpartner</SectionTitle>
        <div className="contact-card"><UserRound/><div className="grow"><strong>{contact.first_name} {contact.last_name}</strong><p>{contact.job_title||'Ansprechpartner'} · <Link className="inline-partner-link" href={`/app/partners/${contact.provider_id}?job=${job.id}`}>{contact.business_name}</Link></p><small>Für Fragen direkt erreichbar. Daraus entsteht nicht automatisch ein Auftrag.</small></div></div>
        <div className="direct-contact-actions"><Link className="btn primary" href={`/app/messages?contact=${contact.contact_user_id}`}><MessageSquare size={16}/>Nachricht</Link>{contact.phone&&<a className="btn ghost" href={`tel:${contact.phone}`}><Phone size={16}/>Anrufen</a>}</div>
        <div className="chat">{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':contact.first_name}</small><p>{m.body}</p></div>)}<form action={sendSavedContactMessageAction.bind(null,contact.contact_user_id,u.id)} className="chat-form"><label className="owner-visually-hidden" htmlFor={`contact-job-message-${job.id}`}>Nachricht an {contact.first_name}</label><input id={`contact-job-message-${job.id}`} name="body" aria-label={`Nachricht an ${contact.first_name}`} placeholder={`Nachricht an ${contact.first_name} …`} required/><SubmitButton className="" pendingLabel="…"><span aria-hidden="true">↗</span><span className="owner-visually-hidden">Nachricht senden</span></SubmitButton></form></div>
        <div className="contact-to-service"><div><strong>Soll daraus doch ein Auftrag werden?</strong><p>Du entscheidest erst jetzt. Dann organisiert Einfach Hausen separat Termin und Angebote.</p></div><form action={turnContactIntoServiceAction.bind(null,job.id)}><SubmitButton className="btn primary" pendingLabel="Wird organisiert…">Auftrag organisieren</SubmitButton></form></div>
      </>}
    </AppShell>;
  }
  const quotes=getQuoteRecommendations(job.id); const accepted=quotes.find(q=>q.status==='accepted');
  const paid=db.prepare(`SELECT status FROM payments WHERE job_id=? ORDER BY id DESC LIMIT 1`).get(job.id) as any;
  const review=db.prepare('SELECT * FROM reviews WHERE job_id=?').get(job.id) as any;
  const claim=accepted?db.prepare('SELECT * FROM claims WHERE job_id=?').get(job.id) as any:null;
  const contact=accepted?db.prepare(`SELECT a.provider_id,a.contact_user_id,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name FROM job_assignments a JOIN users u ON u.id=a.contact_user_id JOIN provider_members m ON m.user_id=a.contact_user_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.job_id=?`).get(job.id) as any:null;
  const messages=contact?db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(u.id,contact.contact_user_id) as any[]:[];
  const dispatches=db.prepare(`SELECT COUNT(*) total,SUM(CASE WHEN status='quoted' THEN 1 ELSE 0 END) quoted FROM job_dispatches WHERE job_id=?`).get(job.id) as any;
  const cheapest=quotes.length?Math.min(...quotes.map(q=>q.amount)):null;
  const available=quotes.filter(q=>q.available_at).sort((a,b)=>new Date(a.available_at).getTime()-new Date(b.available_at).getTime()); const fastest=available[0]?.id;

  return <AppShell role="homeowner" active="/app/jobs">
    <div className="detail-head"><span className={`status ${job.status}`}>{statusLabel(job.status)}</span>{job.urgency==='emergency'&&<span className="emergency-inline-badge">NOTFALL</span>}<h1>{job.title}</h1><p>{job.description}</p><div className="meta-line"><span><MapPin/>{job.postcode}</span><span><CalendarDays/>{dateLabel(job.preferred_date)}</span></div>{job.photo_id&&<JobMedia src={`/api/job-media/${job.photo_id}`} alt="Foto, Video oder Sprachnachricht zum Auftrag" kind={mediaKindFromPath(job.photo_path)}/>}</div>
    {sp.error&&<div className="alert error" role="alert">{sp.error}</div>}{sp.cancelled==='1'&&<div className="alert success" role="status" aria-live="polite">Auftrag wurde storniert.</div>}{sp.payment==='processing'&&<div className="alert success" role="status" aria-live="polite">Zahlung eingegangen. Der endgültige Status wird sicher über Stripe bestätigt.</div>}{sp.payment==='unavailable'&&<div className="alert error" role="alert">Onlinezahlung ist derzeit nicht vollständig konfiguriert. Es wurde kein Zahlungsstatus geändert. Stimme die Zahlung direkt mit deinem Ansprechpartner ab oder versuche es später erneut.</div>}{sp.payment==='cancelled'&&<div className="alert error" role="alert">Zahlung wurde abgebrochen. Es wurde nichts belastet.</div>}

    <div className={job.urgency==='emergency'?"ai-summary emergency-summary":"ai-summary"}><Sparkles/><div><strong>{job.urgency==='emergency'?'Wir suchen jetzt verfügbare Hilfe':'Einfach Hausen organisiert'}</strong><p>Richtpreis {job.budget_min&&job.budget_max?`${euro(job.budget_min)}–${euro(job.budget_max)}`:'wird ermittelt'}. {dispatches.total||0} vertragliche Partner wurden angefragt. Qualität und Kundenzufriedenheit haben Vorrang — kein Partner kann sich im Matching nach oben kaufen.</p></div></div>

    <SectionTitle>Vergleich</SectionTitle>
    {quotes.length===0?<div className="empty compact"><Clock3/><strong>Angebote werden eingeholt</strong><p>Einfach Hausen klärt Verfügbarkeit und Angebote mit passenden Partnern.</p></div>:<div className="stack">{quotes.map((q,index)=><article className={q.status==='accepted'?'quote accepted':'quote'} key={q.id}>
      <div className="quote-badges">{index===0&&<span className="recommend">EMPFEHLUNG</span>}{job.urgency==='emergency'&&q.emergency_mode==='24_7'&&<span className="emergency-quote-badge">24/7 NOTDIENST</span>}{job.urgency==='emergency'&&q.emergency_mode!=='24_7'&&<span className="emergency-quote-badge local">LOKAL VERFÜGBAR</span>}{q.amount===cheapest&&<span className="compare-badge">GÜNSTIGST</span>}{q.id===fastest&&<span className="compare-badge fast">SCHNELLSTER TERMIN</span>}</div>
      <div className="quote-top"><div><Link className="quote-partner-link" href={`/app/partners/${q.provider_id}?job=${job.id}`}><strong>{q.business_name}</strong><span>Profil ansehen</span></Link><small>✓ Vertragspartner · {q.rating_count?`⭐ ${q.rating.toFixed(1)} (${q.rating_count})`:'Neu im Netzwerk'}</small></div><b>{euro(q.amount)}</b></div>
      <div className="partner-standards"><span>✓ Gewerbe</span><span>{q.insurance_verified?'✓':'○'} Versicherung</span><span>{q.qualification_verified?'✓':'○'} Qualifikation</span><span>{q.contract_verified?'✓':'○'} Vertrag</span></div>
      <p>{q.message||'Angebot für den beschriebenen Leistungsumfang.'}</p>
      {job.urgency==='emergency'?<div className="emergency-facts"><span><strong>Hilfe:</strong> {emergencyAvailability(q.available_at)}</span>{Number.isFinite(q.distance_km)&&<span><strong>Entfernung:</strong> {q.distance_km.toFixed(1)} km</span>}<span><strong>Zuschlag:</strong> {q.emergency_markup_bps?`bis ${(q.emergency_markup_bps/100).toFixed(0)} %`:'kein hinterlegter Zuschlag'}</span></div>:<small>{q.available_at?`Verfügbar: ${dateLabel(q.available_at)}`:'Termin nach Abstimmung'}{Number.isFinite(q.distance_km)?` · ${q.distance_km.toFixed(1)} km`:''}</small>}
      {job.urgency!=='emergency'&&scopeNotes(q.message,job.description).length>0&&<div className="quote-scope-notes" aria-label="Hinweise zum Leistungsumfang">{scopeNotes(q.message,job.description).map(note=><span key={note}>ℹ {note}</span>)}</div>}
      {index===0&&quotes.length>1&&<div className="recommendation-reason"><Sparkles size={15}/> Bestes Gesamtpaket aus Preis, Qualität, Entfernung, Kapazität, Verfügbarkeit und bestehender Kundenbeziehung.</div>}
      {q.status==='pending'&&<form action={acceptQuoteAction.bind(null,q.id)}><SubmitButton className="btn primary wide" pendingLabel="Buchung läuft…">Diesen Partner buchen</SubmitButton></form>}{q.status==='accepted'&&<div className="accepted-label"><CheckCircle2/> Gebucht</div>}
    </article>)}</div>}

    {accepted&&<>
      <SectionTitle>Dein persönlicher Ansprechpartner</SectionTitle>
      {contact?<div className="contact-card"><UserRound/><div className="grow"><strong>{contact.first_name} {contact.last_name}</strong><p>{contact.job_title||'Ansprechpartner'} · <Link className="inline-partner-link" href={`/app/partners/${accepted.provider_id}?job=${job.id}`}>{contact.business_name}</Link></p><small>Dieser Kontakt bleibt nach dem Auftrag in „Kontakte“ gespeichert.</small></div></div>:<div className="empty compact"><UserRound/><strong>Partner weist Ansprechpartner zu</strong><p>Nach der Buchung bekommst du einen konkreten Menschen beim ausführenden Unternehmen.</p></div>}
      {contact&&<><div className="direct-contact-actions"><Link className="btn primary" href={`/app/messages?contact=${contact.contact_user_id}`}><MessageSquare size={16}/>Nachricht</Link>{contact.phone&&<a className="btn ghost" href={`tel:${contact.phone}`}><Phone size={16}/>Anrufen</a>}<Link className="btn ghost" href={`/app/messages?contact=${contact.contact_user_id}`}><CalendarDays size={16}/>Termin abstimmen</Link></div>
        <div className="chat">{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':contact.first_name}</small><p>{m.body}</p></div>)}<form action={sendMessageAction.bind(null,job.id,contact.contact_user_id)} className="chat-form"><label className="owner-visually-hidden" htmlFor={`service-job-message-${job.id}`}>Nachricht an {contact.first_name}</label><input id={`service-job-message-${job.id}`} name="body" aria-label={`Nachricht an ${contact.first_name}`} placeholder={`Nachricht an ${contact.first_name} …`} required/><SubmitButton pendingLabel="…"><span aria-hidden="true">↗</span><span className="owner-visually-hidden">Nachricht senden</span></SubmitButton></form></div></>}

      <SectionTitle>Abwicklung</SectionTitle><div className="secure-card"><ShieldCheck/><div><strong>Auftragswert bleibt beim Partner</strong><p>{paid?.status==='paid'?'Bezahlt – Beleg liegt in deiner Hausakte.':accepted.stripe_onboarded?'Optional sichere Zahlung über Einfach Hausen. Die Plattform berechnet dem Partner 0 % Provision pro Auftrag.':'Zahlung wird direkt mit dem Partner abgestimmt.'}</p></div>{paid?.status!=='paid'&&accepted.stripe_onboarded&&<form action={createCheckoutAction.bind(null,job.id)}><SubmitButton className="btn dark" pendingLabel="Checkout wird gestartet…">{euro(accepted.amount)} zahlen</SubmitButton></form>}</div>

      {job.status==='accepted'&&paid?.status!=='paid'&&<form action={cancelJobAction.bind(null,job.id)} className="cancel-job-form"><SubmitButton className="btn ghost wide" pendingLabel="Wird storniert…">Auftrag stornieren</SubmitButton></form>}

      <SectionTitle>Wenn etwas nicht klappt</SectionTitle>{claim?<div className="claim-notice"><AlertTriangle/><div><strong>Servicefall · {statusLabel(claim.status)}</strong><p>{claim.description}</p>{claim.admin_note&&<small>Rückmeldung: {claim.admin_note}</small>}</div></div>:<form action={createClaimAction.bind(null,job.id)} className="claim-form"><div><strong>Zusätzliche Unterstützung nötig?</strong><p>Dein direkter Ansprechpartner ist für die Ausführung da. Wenn ein Problem festhängt, kann der Hausmeisterservice die Koordination übernehmen.</p></div><label>Was ist passiert?<textarea name="description" rows={4} minLength={20} placeholder="Beschreibe kurz, wo die Abstimmung festhängt." required/></label><button className="btn ghost"><AlertTriangle size={16}/>Hausmeister einschalten</button></form>}
    </>}

    {job.status==='completed'&&!review&&<><SectionTitle>Bewertung</SectionTitle><form action={reviewAction.bind(null,job.id)} className="review-card"><div className="stars"><Star/><Star/><Star/><Star/><Star/></div><label>Bewertung<select name="rating" defaultValue="5"><option value="5">5 – Sehr gut</option><option value="4">4 – Gut</option><option value="3">3 – Okay</option><option value="2">2 – Schwach</option><option value="1">1 – Schlecht</option></select></label><textarea name="comment" placeholder="Wie war die Ausführung?"/><button className="btn primary">Bewertung senden</button></form></>}
  </AppShell>;
}
