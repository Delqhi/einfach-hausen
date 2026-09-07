import Link from 'next/link';
import { AppShell } from '@/components/shell';
import { EHAppHeader, EHPanel, EHList, EHEmptyState, EHButton, EHActions, EHStatus } from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';

const monthFmt=new Intl.DateTimeFormat('de-DE',{month:'short'});
const today=new Date().toISOString().slice(0,10);

export default async function YearPage({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const property=primaryProperty(user.id); const sp=await searchParams; const view=sp.view==='history'?'history':'plan';
  const year=Number(sp.year)||new Date().getFullYear();
  const openTasks=property?db.prepare(`SELECT * FROM maintenance_tasks WHERE property_id=? AND status='open' ORDER BY due_date`).all(property.id) as any[]:[];
  const overdue=view==='plan'?openTasks.filter((t:any)=>t.due_date&&String(t.due_date).slice(0,10)<today):[];
  const tasks=view==='plan'?openTasks.filter((t:any)=>t.due_date&&String(t.due_date).slice(0,10).startsWith(String(year))):[] as any[];
  const jobs=view==='plan'
    ? db.prepare(`SELECT id,title,preferred_date,status FROM jobs WHERE homeowner_id=? AND request_kind='service' AND status IN ('accepted','in_progress') AND preferred_date IS NOT NULL ORDER BY preferred_date`).all(user.id) as any[]
    : db.prepare(`SELECT id,title,updated_at preferred_date,status FROM jobs WHERE homeowner_id=? AND request_kind='service' AND status='completed' ORDER BY updated_at DESC LIMIT 40`).all(user.id) as any[];
  type YearItem={kind:'task'|'job';id:string;jobId?:number;date:string;title:string;meta:string;status:string};
  const items:YearItem[]=[...tasks.map((t:any):YearItem=>({kind:'task',id:`t-${t.id}`,date:t.due_date,title:t.title,meta:t.category,status:t.status})),...jobs.map((j:any):YearItem=>({kind:'job',id:`j-${j.id}`,jobId:j.id,date:j.preferred_date,title:j.title,meta:'Auftrag',status:j.status}))].filter(x=>Boolean(x.date)).sort((a,b)=>view==='plan'?String(a.date).localeCompare(String(b.date)):String(b.date).localeCompare(String(a.date)));

  return <AppShell role="homeowner" active="/app/home" title="Mein Jahr" subtitle="Wartung, Termine und Hausaufgaben">
    <EHAppHeader eyebrow={String(year)} title="Mein Jahr" text="Alles, was an deinem Zuhause ansteht – übersichtlich über das Jahr." actions={<EHButton href="/app/hausmeister" arrow>Neue Aufgabe planen</EHButton>} />
    <div className="segmented-tabs" role="navigation" aria-label="Jahresansicht"><Link aria-current={view==='plan'?'page':undefined} className={view==='plan'?'active':''} href={`/app/year?view=plan&year=${year}`}>Plan</Link><Link aria-current={view==='history'?'page':undefined} className={view==='history'?'active':''} href={`/app/year?view=history&year=${year}`}>Historie</Link></div>
    {overdue.length>0&&<EHPanel title={`Überfällig · ${overdue.length} ${overdue.length===1?'Aufgabe':'Aufgaben'} – fällig vor heute`}>
      <EHList label="Überfällige Wartungen" items={overdue.slice(0,6).map((t:any)=>({ id: 'od-' + t.id, title: `${t.title} — fällig ${dateLabel(t.due_date)}`, text: t.category, meta: <EHStatus tone="error">überfällig</EHStatus> }))} />
      {overdue.length>6&&<p>+{overdue.length-6} weitere überfällige Aufgaben.</p>}
      <p>Plane sie über den <Link href="/app/hausmeister">Hausmeister</Link> oder erledige sie selbst.</p>
    </EHPanel>}
    {items.length===0?<EHEmptyState title={view==='plan'?'Noch nichts geplant':'Noch keine Historie'} text={view==='plan'?'Füge Technik in „Mein Haus“ hinzu oder plane etwas über den Hausservice.':'Erledigte Wartungen und Aufträge erscheinen hier.'} />:<EHList label={view==='plan'?'Jahresplan':'Jahreshistorie'} items={items.map(item=>{
      const d=new Date(String(item.date).length===10?`${item.date}T12:00:00`:item.date); const month=monthFmt.format(d).replace('.','').toUpperCase();
      return { id: item.id, title: `${month} · ${item.title}${item.status==='completed'?' · erledigt':''}`, text: `${dateLabel(item.date)} · ${item.meta}`, ...(item.kind==='job'?{ href: `/app/jobs/${item.jobId!}` }:{}), meta: item.status==='completed'?<EHStatus tone="success">erledigt</EHStatus>:null };
    })} />}
    <EHActions><EHButton href="/app/hausmeister" arrow>Neue Aufgabe planen</EHButton></EHActions>
  </AppShell>;
}
