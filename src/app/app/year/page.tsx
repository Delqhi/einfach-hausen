import Link from 'next/link';
import { CalendarCheck,CheckCircle2,ChevronRight,Clock3,Plus } from 'lucide-react';
import { AppShell } from '@/components/shell';
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
    <div className="year-head"><div><span className="soft-kicker">{year}</span><h1>Mein Jahr</h1><p>Alles, was an deinem Zuhause ansteht – übersichtlich über das Jahr.</p></div><Link href="/app/hausmeister" className="round-add" aria-label="Neue Aufgabe planen"><Plus/></Link></div>
    <div className="segmented-tabs" role="navigation" aria-label="Jahresansicht"><Link aria-current={view==='plan'?'page':undefined} className={view==='plan'?'active':''} href={`/app/year?view=plan&year=${year}`}>Plan</Link><Link aria-current={view==='history'?'page':undefined} className={view==='history'?'active':''} href={`/app/year?view=history&year=${year}`}>Historie</Link></div>
    {overdue.length>0&&<section aria-label="Überfällige Wartungen">
      <div className="section-title"><strong>Überfällig</strong><small>{overdue.length} {overdue.length===1?'Aufgabe':'Aufgaben'} – fällig vor heute</small></div>
      <div className="stack">{overdue.slice(0,6).map((t:any)=><article className="maintenance-row" key={`o-${t.id}`}><div className="maintenance-date"><small>Fällig</small><b>{dateLabel(t.due_date)}</b></div><div className="grow"><strong>{t.title}</strong><small>{t.category}</small></div><span className="status cancelled">überfällig</span></article>)}</div>
      {overdue.length>6&&<p className="page-subtitle">+{overdue.length-6} weitere überfällige Aufgaben.</p>}
      <p className="page-subtitle">Plane sie über den <Link href="/app/hausmeister">Hausmeister</Link> oder erledige sie selbst.</p>
    </section>}
    <div className="year-timeline">{items.map(item=>{
      const d=new Date(String(item.date).length===10?`${item.date}T12:00:00`:item.date); const month=monthFmt.format(d).replace('.','').toUpperCase();
      return <div className="year-row" key={item.id}><div className="year-month">{month}</div><span className={`timeline-dot ${item.status==='completed'?'done':''}`}>{item.status==='completed'?<CheckCircle2/>:<Clock3/>}</span>{item.kind==='job'?<Link href={`/app/jobs/${item.jobId!}`} className="year-item"><div><strong>{item.title}</strong><small>{dateLabel(item.date)} · {item.meta}</small></div><ChevronRight/></Link>:<div className="year-item"><div><strong>{item.title}</strong><small>{dateLabel(item.date)} · {item.meta}</small></div><CalendarCheck/></div>}</div>
    })}{items.length===0&&<div className="empty"><CalendarCheck/><strong>{view==='plan'?'Noch nichts geplant':'Noch keine Historie'}</strong><p>{view==='plan'?'Füge Technik in „Mein Haus“ hinzu oder plane etwas über den Hausservice.':'Erledigte Wartungen und Aufträge erscheinen hier.'}</p></div>}</div>
    <Link href="/app/hausmeister" className="btn primary wide year-cta"><Plus size={17}/> Neue Aufgabe planen</Link>
  </AppShell>;
}
