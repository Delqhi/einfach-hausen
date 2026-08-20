import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { AppShell, SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { markCompleteAction, markInProgressAction, sendMessageAction, submitQuoteAction } from '@/app/actions';
import { dateLabel, euro, statusLabel } from '@/lib/format';
import { DocumentForm } from './document-form';

export default async function ProJob({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string,string>> }) {
  const u = await requireUser('provider');
  const { id } = await params; const sp=await searchParams;
  const job = db.prepare(`SELECT j.*,u.first_name,u.last_name,(SELECT path FROM job_photos p WHERE p.job_id=j.id LIMIT 1) photo FROM jobs j JOIN users u ON u.id=j.homeowner_id WHERE j.id=?`).get(Number(id)) as any;
  if (!job) notFound();
  const quote = db.prepare('SELECT * FROM quotes WHERE job_id=? AND provider_id=?').get(job.id, u.id) as any;
  const isAccepted = quote?.status === 'accepted';
  const msgs = isAccepted ? db.prepare(`SELECT m.*,u.first_name FROM messages m JOIN users u ON u.id=m.sender_id WHERE m.job_id=? ORDER BY m.created_at`).all(job.id) as any[] : [];
  const docs = isAccepted ? db.prepare('SELECT * FROM documents WHERE job_id=? AND provider_id=? ORDER BY created_at DESC').all(job.id, u.id) as any[] : [];
  const claim = isAccepted ? db.prepare('SELECT * FROM claims WHERE job_id=?').get(job.id) as any : null;

  return <AppShell role="provider" active="/pro" title="Anfrage" subtitle={job.category}>
    {sp.error&&<div className="alert error">{sp.error}</div>}
    <div className="detail-head pro-detail">
      <span className={`status ${job.status}`}>{statusLabel(job.status)}</span>
      <h1>{job.title}</h1><p>{job.description}</p>
      <div className="meta-line"><span><MapPin />{job.postcode}</span><span><CalendarDays />{dateLabel(job.preferred_date)}</span></div>
      {job.photo && <img className="hero-photo" src={job.photo} alt="Auftragsfoto" />}
      <div className="budget-line"><small>geschätztes Budget</small><strong>{job.budget_min && job.budget_max ? `${euro(job.budget_min)} – ${euro(job.budget_max)}` : euro(job.budget_max)}</strong></div>
    </div>

    {!isAccepted && job.status !== 'completed' && <>
      <SectionTitle>{quote ? 'Angebot aktualisieren' : 'Angebot abgeben'}</SectionTitle>
      <form action={submitQuoteAction.bind(null, job.id)} className="quote-form">
        <label>Preis (€)<input name="amount" type="number" min="1" required defaultValue={quote ? quote.amount / 100 : ''} /></label>
        <label>Verfügbar ab<input name="availableAt" type="datetime-local" defaultValue={quote?.available_at?.slice(0, 16) || ''} /></label>
        <label>Nachricht<textarea name="message" rows={4} defaultValue={quote?.message || ''} placeholder="Leistungsumfang, Material, Dauer …" /></label>
        <button className="btn light wide">{quote ? 'Angebot aktualisieren' : 'Angebot senden'}</button>
      </form>
    </>}

    {isAccepted && <>
      <div className="alert success"><ShieldCheck /> Auftrag wurde dir verbindlich erteilt.</div>
      <div className="action-row">
        {job.status === 'accepted' && <form action={markInProgressAction.bind(null, job.id)}><button className="btn light">Arbeit starten</button></form>}
        {job.status === 'in_progress' && <form action={markCompleteAction.bind(null, job.id)}><button className="btn light">Als erledigt markieren</button></form>}
      </div>
      {claim&&<div className="claim-notice pro-claim"><strong>Problemfall gemeldet · {statusLabel(claim.status)}</strong><p>{claim.description}</p>{claim.admin_note&&<small>Plattform: {claim.admin_note}</small>}</div>}
      <SectionTitle>Kommunikation mit {job.first_name}</SectionTitle>
      <div className="chat pro-chat">
        {msgs.map(m => <div key={m.id} className={m.sender_id === u.id ? 'msg mine' : 'msg'}><small>{m.first_name}</small><p>{m.body}</p></div>)}
        <form action={sendMessageAction.bind(null, job.id, job.homeowner_id)} className="chat-form"><input name="body" placeholder="Nachricht schreiben …" required /><button><MessageSquare /></button></form>
      </div>
      <SectionTitle>Dokumente</SectionTitle>
      {docs.length > 0 && <div className="stack pro-doc-list">{docs.map(d => <a key={d.id} href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer"><strong>{d.title}</strong><small>{d.kind}</small></a>)}</div>}
      <DocumentForm jobId={job.id} />
    </>}
  </AppShell>;
}
