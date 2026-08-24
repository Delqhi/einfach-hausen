import Link from 'next/link';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel,statusLabel } from '@/lib/format';

export default async function Calendar(){
  const u=await requireUser('homeowner');
  const rows=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? ORDER BY a.start_at`).all(u.id) as any[];
  return <AppShell role="homeowner" active="/app/calendar" title="Kalender" subtitle="Termine rund um dein Zuhause">
    <h1 className="page-title">Kalender</h1>
    <p className="page-subtitle">Bestätigte Termine mit deinem persönlichen Ansprechpartner.</p>
    <div className="stack">{rows.map(r=><article className="appointment" key={r.id}><CalendarDays aria-hidden="true"/><div><strong>{r.title}</strong><p>{r.business_name}</p><small>{dateLabel(r.start_at)}</small></div><span className="status accepted" aria-label={`Status: ${statusLabel(r.status)}`}>{statusLabel(r.status)}</span></article>)}{rows.length===0&&<div className="empty owner-empty-action"><CalendarDays aria-hidden="true"/><strong>Noch keine Termine</strong><p>Wenn du etwas klären oder organisieren möchtest, startest du am schnellsten beim Hausmeister.</p><Link className="btn primary" href="/app/hausmeister"><MessageCircle size={16} aria-hidden="true"/> Anliegen beschreiben</Link></div>}</div>
  </AppShell>;
}
