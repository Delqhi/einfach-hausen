import Link from 'next/link';
import { Bot,ChevronRight,Home,MapPin,ShieldCheck,Sparkles,Wrench } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { HausmeisterComposer } from '@/components/hausmeister-composer';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel,euro,statusLabel } from '@/lib/format';

export default async function HomePage({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams;
  const thread=db.prepare(`SELECT * FROM assistant_threads WHERE user_id=? AND channel='app' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as any;
  const messages=thread?db.prepare('SELECT * FROM assistant_messages WHERE thread_id=? ORDER BY created_at DESC LIMIT 12').all(thread.id).reverse() as any[]:[];
  const jobs=db.prepare(`SELECT j.*,(SELECT COUNT(*) FROM quotes q WHERE q.job_id=j.id AND q.status='pending') quote_count,(SELECT COUNT(*) FROM job_dispatches d WHERE d.job_id=j.id) dispatch_count FROM jobs j WHERE homeowner_id=? ORDER BY j.created_at DESC LIMIT 4`).all(user.id) as any[];
  const subscription=db.prepare(`SELECT s.status,p.title,p.priority_level FROM subscriptions s JOIN membership_plans p ON p.slug=s.plan_slug WHERE s.homeowner_id=?`).get(user.id) as any;
  const due=db.prepare(`SELECT COUNT(*) c FROM maintenance_tasks WHERE homeowner_id=? AND status='open' AND due_date<=date('now','+45 day')`).get(user.id) as any;

  return <AppShell role="homeowner" active="/app">
    <div className="agent-hero">
      <div className="agent-avatar"><Bot/></div>
      <div><span className="agent-online">● Dein KI-Hausmeister</span><h1>Hallo {user.first_name}. Was braucht dein Haus?</h1><p>Schreiben, Foto oder Sprache. Ich verstehe den Auftrag, kalkuliere, frage geprüfte Vertragspartner an und organisiere den Rest.</p></div>
    </div>
    {sp.error&&<div className="alert error">{sp.error}</div>}
    <div className="agent-chat">
      {messages.length===0&&<div className="agent-message assistant"><div className="message-head"><Sparkles size={14}/> Einfach Hausen</div><p>Du musst keine Kategorie kennen und keinen Handwerker suchen. Sag mir einfach, was erledigt werden soll. Ich frage nur nach, wenn mir wirklich etwas fehlt.</p></div>}
      {messages.map(m=><div className={`agent-message ${m.role}`} key={m.id}><div className="message-head">{m.role==='user'?'Du':<><Sparkles size={14}/> Einfach Hausen</>}</div><p>{m.body}</p></div>)}
      <HausmeisterComposer/>
    </div>

    <div className="trust-strip"><span><ShieldCheck/> Vertragspartner</span><span><Sparkles/> KI-Vergleich</span><span><Wrench/> Eine Anlaufstelle</span></div>

    <div className="home-insights">
      <Link href="/app/plans"><small>Mitgliedschaft</small><strong>{subscription?.status==='active'?subscription.title:'Free'}</strong><span>{subscription?.status==='active'?`Priorität ${subscription.priority_level}`:'Free, Plus oder Premium ansehen'} <ChevronRight size={14}/></span></Link>
      <Link href="/app/home"><small>Hausplan</small><strong>{due?.c||0} Punkte</strong><span>demnächst fällig <ChevronRight size={14}/></span></Link>
    </div>

    <SectionTitle href="/app/jobs">Laufende Organisation</SectionTitle>
    <div className="stack">{jobs.map(j=><Link className="job-row agent-job" href={`/app/jobs/${j.id}`} key={j.id}><div className="thumb-placeholder"><Home/></div><div className="grow"><strong>{j.title}</strong><small><MapPin size={13}/>{j.postcode||'Dein Zuhause'} · {dateLabel(j.preferred_date)}</small><span>{j.quote_count?`${j.quote_count} Angebote werden verglichen`:j.dispatch_count?`${j.dispatch_count} Partner angefragt`:`${statusLabel(j.status)}`}</span></div><div className="right"><b>{j.budget_max?euro(j.budget_max):''}</b><ChevronRight size={18}/></div></Link>)}{jobs.length===0&&<div className="empty compact"><Bot/><strong>Noch nichts zu organisieren</strong><p>Dein erster Auftrag beginnt oben mit einem Satz.</p></div>}</div>
  </AppShell>;
}
