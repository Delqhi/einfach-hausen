import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle,CalendarDays,CheckCircle2,Clock3,MapPin,MessageSquare,Phone,ShieldCheck,Sparkles,Star,UserRound } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { acceptQuoteAction,createCheckoutAction,createClaimAction,reviewAction,sendMessageAction } from '@/app/actions';
import { dateLabel,euro,statusLabel } from '@/lib/format';
import { getQuoteRecommendations } from '@/lib/orchestrator';

export default async function JobDetail({params,searchParams}:{params:Promise<{id:string}>,searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const {id}=await params; const sp=await searchParams;
  const job=db.prepare(`SELECT j.*,(SELECT path FROM job_photos p WHERE p.job_id=j.id LIMIT 1) photo FROM jobs j WHERE j.id=? AND j.homeowner_id=?`).get(Number(id),u.id) as any; if(!job)notFound();
  const quotes=getQuoteRecommendations(job.id); const accepted=quotes.find(q=>q.status==='accepted');
  const paid=db.prepare(`SELECT status FROM payments WHERE job_id=? ORDER BY id DESC LIMIT 1`).get(job.id) as any;
  const review=db.prepare('SELECT * FROM reviews WHERE job_id=?').get(job.id) as any;
  const claim=accepted?db.prepare('SELECT * FROM claims WHERE job_id=?').get(job.id) as any:null;
  const contact=accepted?db.prepare(`SELECT a.contact_user_id,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name FROM job_assignments a JOIN users u ON u.id=a.contact_user_id JOIN provider_members m ON m.user_id=a.contact_user_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.job_id=?`).get(job.id) as any:null;
  const messages=contact?db.prepare('SELECT * FROM messages WHERE job_id=? ORDER BY created_at').all(job.id) as any[]:[];
  const dispatches=db.prepare(`SELECT COUNT(*) total,SUM(CASE WHEN status='quoted' THEN 1 ELSE 0 END) quoted FROM job_dispatches WHERE job_id=?`).get(job.id) as any;
  const cheapest=quotes.length?Math.min(...quotes.map(q=>q.amount)):null;
  const available=quotes.filter(q=>q.available_at).sort((a,b)=>new Date(a.available_at).getTime()-new Date(b.available_at).getTime()); const fastest=available[0]?.id;

  return <AppShell role="homeowner" active="/app/jobs">
    <div className="detail-head"><span className={`status ${job.status}`}>{statusLabel(job.status)}</span><h1>{job.title}</h1><p>{job.description}</p><div className="meta-line"><span><MapPin/>{job.postcode}</span><span><CalendarDays/>{dateLabel(job.preferred_date)}</span></div>{job.photo&&<img className="hero-photo" src={job.photo} alt="Auftragsfoto"/>}</div>
    {sp.error&&<div className="alert error">{sp.error}</div>}{sp.payment==='success'&&<div className="alert success">Zahlung erfolgreich verbucht.</div>}{sp.payment==='cancelled'&&<div className="alert error">Zahlung wurde abgebrochen. Es wurde nichts belastet.</div>}

    <div className="ai-summary"><Sparkles/><div><strong>Dein digitaler Hausmeister organisiert</strong><p>Richtpreis {job.budget_min&&job.budget_max?`${euro(job.budget_min)}–${euro(job.budget_max)}`:'wird ermittelt'}. {dispatches.total||0} vertragliche Partner wurden angefragt. Qualität und Kundenzufriedenheit haben Vorrang — kein Partner kann sich im Matching nach oben kaufen.</p></div></div>

    <SectionTitle>Vergleich</SectionTitle>
    {quotes.length===0?<div className="empty compact"><Clock3/><strong>Angebote werden eingeholt</strong><p>Dein KI-Hausmeister klärt Verfügbarkeit und Angebote mit passenden Partnern.</p></div>:<div className="stack">{quotes.map((q,index)=><article className={q.status==='accepted'?'quote accepted':'quote'} key={q.id}>
      <div className="quote-badges">{index===0&&<span className="recommend">MEINE EMPFEHLUNG</span>}{q.amount===cheapest&&<span className="compare-badge">GÜNSTIGST</span>}{q.id===fastest&&<span className="compare-badge fast">SCHNELLSTER TERMIN</span>}</div>
      <div className="quote-top"><div><strong>{q.business_name}</strong><small>✓ Vertragspartner · {q.rating_count?`⭐ ${q.rating.toFixed(1)} (${q.rating_count})`:'Neu im Netzwerk'}</small></div><b>{euro(q.amount)}</b></div>
      <div className="partner-standards"><span>✓ Gewerbe</span><span>{q.insurance_verified?'✓':'○'} Versicherung</span><span>{q.qualification_verified?'✓':'○'} Qualifikation</span><span>{q.contract_verified?'✓':'○'} Vertrag</span></div>
      <p>{q.message||'Angebot für den beschriebenen Leistungsumfang.'}</p><small>{q.available_at?`Verfügbar: ${dateLabel(q.available_at)}`:'Termin nach Abstimmung'}{Number.isFinite(q.distance_km)?` · ${q.distance_km.toFixed(1)} km`:''}</small>
      {index===0&&quotes.length>1&&<div className="recommendation-reason"><Sparkles size={15}/> Bestes Gesamtpaket aus Preis, Qualität, Entfernung, Kapazität, Verfügbarkeit und bestehender Kundenbeziehung.</div>}
      {q.status==='pending'&&<form action={acceptQuoteAction.bind(null,q.id)}><button className="btn primary wide">Diesen Partner buchen</button></form>}{q.status==='accepted'&&<div className="accepted-label"><CheckCircle2/> Gebucht</div>}
    </article>)}</div>}

    {accepted&&<>
      <SectionTitle>Dein persönlicher Ansprechpartner</SectionTitle>
      {contact?<div className="contact-card"><UserRound/><div className="grow"><strong>{contact.first_name} {contact.last_name}</strong><p>{contact.job_title||'Ansprechpartner'} · {contact.business_name}</p><small>Dieser Kontakt bleibt nach dem Auftrag in „Kontakte“ gespeichert.</small></div></div>:<div className="empty compact"><UserRound/><strong>Partner weist Ansprechpartner zu</strong><p>Nach der Buchung bekommst du einen konkreten Menschen beim ausführenden Unternehmen.</p></div>}
      {contact&&<><div className="direct-contact-actions"><Link className="btn primary" href={`/app/messages?contact=${contact.contact_user_id}`}><MessageSquare size={16}/>Nachricht</Link>{contact.phone&&<a className="btn ghost" href={`tel:${contact.phone}`}><Phone size={16}/>Anrufen</a>}<Link className="btn ghost" href={`/app/messages?contact=${contact.contact_user_id}`}><CalendarDays size={16}/>Termin abstimmen</Link></div>
        <div className="chat">{messages.map((m:any)=><div className={m.sender_id===u.id?'msg mine':'msg'} key={m.id}><small>{m.sender_id===u.id?'Du':contact.first_name}</small><p>{m.body}</p></div>)}<form action={sendMessageAction.bind(null,job.id,contact.contact_user_id)} className="chat-form"><input name="body" placeholder={`Nachricht an ${contact.first_name} …`} required/><button aria-label="Nachricht senden">↗</button></form></div></>}

      <SectionTitle>Abwicklung</SectionTitle><div className="secure-card"><ShieldCheck/><div><strong>Auftragswert bleibt beim Partner</strong><p>{paid?.status==='paid'?'Bezahlt – Beleg liegt in deiner Hausakte.':accepted.stripe_onboarded?'Optional sichere Zahlung über Einfach Hausen. Die Plattform berechnet dem Partner 0 % Provision pro Auftrag.':'Zahlung wird direkt mit dem Partner abgestimmt.'}</p></div>{paid?.status!=='paid'&&accepted.stripe_onboarded&&<form action={createCheckoutAction.bind(null,job.id)}><button className="btn dark">{euro(accepted.amount)} zahlen</button></form>}</div>

      <SectionTitle>Wenn etwas nicht klappt</SectionTitle>{claim?<div className="claim-notice"><AlertTriangle/><div><strong>Servicefall · {statusLabel(claim.status)}</strong><p>{claim.description}</p>{claim.admin_note&&<small>Rückmeldung: {claim.admin_note}</small>}</div></div>:<form action={createClaimAction.bind(null,job.id)} className="claim-form"><div><strong>Zusätzliche Unterstützung nötig?</strong><p>Dein direkter Ansprechpartner ist für die Ausführung da. Wenn ein Problem festhängt, kann dein digitaler Hausmeister die Koordination übernehmen.</p></div><textarea name="description" rows={4} minLength={20} placeholder="Was ist passiert?" required/><button className="btn ghost"><AlertTriangle size={16}/>Hausmeister einschalten</button></form>}
    </>}

    {job.status==='completed'&&!review&&<><SectionTitle>Bewertung</SectionTitle><form action={reviewAction.bind(null,job.id)} className="review-card"><div className="stars"><Star/><Star/><Star/><Star/><Star/></div><label>Bewertung<select name="rating" defaultValue="5"><option value="5">5 – Sehr gut</option><option value="4">4 – Gut</option><option value="3">3 – Okay</option><option value="2">2 – Schwach</option><option value="1">1 – Schlecht</option></select></label><textarea name="comment" placeholder="Wie war die Ausführung?"/><button className="btn primary">Bewertung senden</button></form></>}
  </AppShell>;
}
