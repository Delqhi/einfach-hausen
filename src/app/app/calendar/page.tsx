import Link from 'next/link';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel,statusLabel } from '@/lib/format';

const monthFmt=new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric',timeZone:'Europe/Berlin'});
const weekdayFmt=new Intl.DateTimeFormat('de-DE',{weekday:'long',timeZone:'Europe/Berlin'});

export default async function Calendar(){
  const u=await requireUser('homeowner');
  const rows=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.start_at>=datetime('now','-1 day') ORDER BY a.start_at`).all(u.id) as any[];
  const groups=new Map<string,any[]>();
  for(const r of rows){const key=monthFmt.format(new Date(r.start_at));const list=groups.get(key);if(list)list.push(r);else groups.set(key,[r]);}
  return <AppShell role="homeowner" active="/app/calendar" title="Kalender" subtitle="Termine rund um dein Zuhause">
    <h1 className="page-title">Kalender</h1>
    <p className="page-subtitle">Bestätigte Termine mit deinem persönlichen Ansprechpartner.</p>
    {rows.length===0&&<div className="empty owner-empty-action"><CalendarDays aria-hidden="true"/><strong>Noch keine Termine</strong><p>Wenn du etwas klären oder organisieren möchtest, startest du am schnellsten beim Hausmeister.</p><Link className="btn primary" href="/app/hausmeister"><MessageCircle size={16} aria-hidden="true"/> Anliegen beschreiben</Link></div>}
    {[...groups.entries()].map(([month,list])=><section key={month}>
      <SectionTitle>{month}</SectionTitle>
      <div className="stack">{list.map((r:any)=><article className="appointment" key={r.id}><CalendarDays aria-hidden="true"/><div><strong>{r.title}</strong><p>{weekdayFmt.format(new Date(r.start_at))}, {dateLabel(r.start_at)} · {r.business_name}</p></div><span className="status accepted" aria-label={`Status: ${statusLabel(r.status)}`}>{statusLabel(r.status)}</span></article>)}</div>
    </section>)}
    <PastAppointments userId={u.id}/>
  </AppShell>;
}

function PastAppointments({userId}:{userId:number}){
  const past=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.start_at<datetime('now','-1 day') ORDER BY a.start_at DESC LIMIT 8`).all(userId) as any[];
  if(past.length===0)return null;
  return <section>
    <SectionTitle>Vergangene Termine</SectionTitle>
    <div className="stack">{past.map((r:any)=><article className="appointment" key={r.id}><CalendarDays aria-hidden="true"/><div><strong>{r.title}</strong><p>{dateLabel(r.start_at)} · {r.business_name}</p></div></article>)}</div>
  </section>;
}
