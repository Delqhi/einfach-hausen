import { AppShell } from '@/components/shell';
import { EHAppHeader, EHPanel, EHList, EHEmptyState, EHButton, EHStatus } from '@/design-system';
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
    <EHAppHeader eyebrow="Übersicht" title="Kalender" text="Bestätigte Termine mit deinem persönlichen Ansprechpartner." />
    {rows.length===0&&<EHEmptyState title="Noch keine Termine" text="Wenn du etwas klären oder organisieren möchtest, startest du am schnellsten beim Hausmeister." action={<EHButton href="/app/hausmeister" arrow>Anliegen beschreiben</EHButton>} />}
    {[...groups.entries()].map(([month,list])=><EHPanel key={month} title={month}>
      <EHList label={month} items={list.map((r:any)=>({ id: String(r.id), title: r.title, text: `${weekdayFmt.format(new Date(r.start_at))}, ${dateLabel(r.start_at)} · ${r.business_name}`, meta: <EHStatus>{statusLabel(r.status)}</EHStatus> }))} />
    </EHPanel>)}
    <PastAppointments userId={u.id}/>
  </AppShell>;
}

function PastAppointments({userId}:{userId:number}){
  const past=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.start_at<datetime('now','-1 day') ORDER BY a.start_at DESC LIMIT 8`).all(userId) as any[];
  if(past.length===0)return null;
  return <EHPanel title="Vergangene Termine">
    <EHList label="Vergangene Termine" items={past.map((r:any)=>({ id: 'past-' + r.id, title: r.title, text: `${dateLabel(r.start_at)} · ${r.business_name}` }))} />
  </EHPanel>;
}
