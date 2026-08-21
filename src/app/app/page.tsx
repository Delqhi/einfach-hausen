import Link from 'next/link';
import { ArrowRight,CalendarDays,ChevronRight,Flower2,Hammer,House,Mic,Settings2,Sparkles,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel,euro } from '@/lib/format';

const quickActions=[
  {href:'/app/hausmeister?topic=garten',label:'Garten & Außen',Icon:Flower2},
  {href:'/app/hausmeister?topic=reparatur',label:'Reparaturen & Handwerk',Icon:Hammer},
  {href:'/app/hausmeister?topic=pflege',label:'Reinigung & Pflege',Icon:Sparkles},
  {href:'/app/hausmeister?topic=technik',label:'Technik & Installation',Icon:Settings2},
] as const;

export default async function Dashboard(){
  const user=await requireUser('homeowner');
  const nextAppointment=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' AND datetime(a.start_at)>=datetime('now') ORDER BY a.start_at LIMIT 1`).get(user.id) as any;
  const openOffers=db.prepare(`SELECT j.id,j.title,j.status,COUNT(q.id) quote_count,MIN(q.amount) min_amount FROM jobs j LEFT JOIN quotes q ON q.job_id=j.id AND q.status='pending' WHERE j.homeowner_id=? AND j.request_kind='service' AND j.status IN ('open','quoted') GROUP BY j.id HAVING COUNT(q.id)>0 ORDER BY j.updated_at DESC LIMIT 1`).get(user.id) as any;
  const activeJobs=(db.prepare(`SELECT COUNT(*) c FROM jobs WHERE homeowner_id=? AND request_kind='service' AND status IN ('accepted','in_progress')`).get(user.id) as {c:number}).c;
  const contacts=(db.prepare(`SELECT COUNT(*) c FROM homeowner_contacts WHERE homeowner_id=?`).get(user.id) as {c:number}).c;
  const due=(db.prepare(`SELECT COUNT(*) c FROM maintenance_tasks WHERE homeowner_id=? AND status='open' AND due_date<=date('now','+45 day')`).get(user.id) as {c:number}).c;

  return <AppShell role="homeowner" active="/app" title="Start" subtitle="Alles rund um dein Zuhause">
    <section className="mobile-home-head">
      <span className="soft-kicker">Einfach Hausen</span>
      <h1>Hallo {user.first_name},<br/>was können wir heute für dich tun?</h1>
    </section>

    <Link href="/app/hausmeister" className="service-entry-card">
      <div><small>Einfach beschreiben</small><strong>Was ist bei dir zu Hause los?</strong><p>Schreib oder sprich. Wir klären den richtigen nächsten Schritt.</p></div>
      <span className="service-entry-action"><Mic size={19}/></span>
    </Link>

    <div className="quick-section-head"><strong>Schnelle Aktionen</strong><Link href="/app/hausmeister">Alle Möglichkeiten <ChevronRight size={14}/></Link></div>
    <div className="quick-action-grid">{quickActions.map(({href,label,Icon})=><Link href={href} key={label}><span><Icon size={20}/></span><strong>{label}</strong><ChevronRight size={14}/></Link>)}</div>

    <div className="dashboard-facts">
      <Link href="/app/jobs"><span>{activeJobs}</span><small>aktive Aufträge</small></Link>
      <Link href="/app/messages"><span>{contacts}</span><small>Ansprechpartner</small></Link>
      <Link href="/app/year"><span>{due}</span><small>bald fällig</small></Link>
    </div>

    <div className="quick-section-head"><strong>Als Nächstes</strong><Link href="/app/year">Mein Jahr <ChevronRight size={14}/></Link></div>
    {nextAppointment?<Link href={`/app/jobs/${nextAppointment.job_id}`} className="next-card"><span className="next-card-icon"><CalendarDays/></span><div className="grow"><small>Nächster Termin</small><strong>{nextAppointment.title}</strong><p>{dateLabel(nextAppointment.start_at)} · {nextAppointment.business_name}</p></div><ChevronRight/></Link>:<Link href="/app/hausmeister" className="next-card empty-next"><span className="next-card-icon"><CalendarDays/></span><div className="grow"><small>Keine Termine geplant</small><strong>Etwas am Haus erledigen?</strong><p>Beschreib kurz, was du brauchst.</p></div><ArrowRight/></Link>}

    {openOffers&&<Link href={`/app/jobs/${openOffers.id}`} className="offer-summary-card"><div><small>Offene Angebote</small><strong>{openOffers.title}</strong><p>{openOffers.quote_count} {openOffers.quote_count===1?'Angebot wartet':'Angebote warten'} auf deine Entscheidung.</p></div><div className="offer-summary-price"><b>{euro(openOffers.min_amount)}</b><span>ab</span><ChevronRight/></div></Link>}

    <Link href="/app/home" className="home-memory-strip"><House/><div className="grow"><strong>Mein Haus</strong><p>Technik, Dokumente, Wartung und Kontakte an einem Ort.</p></div><Wrench size={17}/></Link>
  </AppShell>;
}
