import Link from 'next/link';
import { Bot,ChevronRight,ClipboardCheck,Home,MapPin,MessageCircle,Sparkles,Wrench } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { HausmeisterComposer } from '@/components/hausmeister-composer';
import { startHausmeisterRouteAction } from '@/app/actions';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel,euro,statusLabel } from '@/lib/format';

export default async function HomePage({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams;
  const thread=db.prepare(`SELECT * FROM assistant_threads WHERE user_id=? AND channel='app' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as any;
  const messages=thread?db.prepare('SELECT * FROM assistant_messages WHERE thread_id=? ORDER BY created_at DESC,id DESC LIMIT 16').all(thread.id).reverse() as any[]:[];
  const draft=thread?db.prepare('SELECT intent FROM assistant_drafts WHERE thread_id=?').get(thread.id) as {intent:'service'|'contact'}|undefined:undefined;
  const lastAssistant=[...messages].reverse().find(m=>m.role==='assistant');
  let lastMeta:any={}; try{lastMeta=lastAssistant?JSON.parse(lastAssistant.metadata_json||'{}'):{};}catch{}
  const showNextChoice=Boolean(lastMeta.assistantOnly&&!draft);
  const jobs=db.prepare(`SELECT j.*,(SELECT COUNT(*) FROM quotes q WHERE q.job_id=j.id AND q.status='pending') quote_count,(SELECT COUNT(*) FROM job_dispatches d WHERE d.job_id=j.id) dispatch_count FROM jobs j WHERE homeowner_id=? ORDER BY j.created_at DESC LIMIT 5`).all(user.id) as any[];
  const subscription=db.prepare(`SELECT s.status,p.title,p.priority_level FROM subscriptions s JOIN membership_plans p ON p.slug=s.plan_slug WHERE s.homeowner_id=?`).get(user.id) as any;
  const due=db.prepare(`SELECT COUNT(*) c FROM maintenance_tasks WHERE homeowner_id=? AND status='open' AND due_date<=date('now','+45 day')`).get(user.id) as any;

  return <AppShell role="homeowner" active="/app" title="KI-Hausmeister" subtitle="Fragen, Ansprechpartner oder Auftrag">
    <div className="agent-hero">
      <div className="agent-avatar"><Bot/></div>
      <div><span className="agent-online">● Dein KI-Hausmeister</span><h1>Hallo {user.first_name}. Was ist los?</h1><p>Frag mich zuerst ganz normal. Danach entscheidest du selbst: nur einen passenden Menschen sprechen oder direkt einen Auftrag organisieren.</p></div>
    </div>
    {sp.error&&<div className="alert error">{sp.error}</div>}
    <div className="agent-chat">
      {messages.length===0&&<div className="agent-message assistant"><div className="message-head"><Sparkles size={14}/> Einfach Hausen</div><p>Du kannst mich alles rund um dein Eigenheim fragen. Wenn du danach persönliche Hilfe möchtest, finde ich einen passenden Ansprechpartner. Wenn etwas erledigt werden soll, organisiere ich den Auftrag.</p></div>}
      {messages.map(m=><div className={`agent-message ${m.role}`} key={m.id}><div className="message-head">{m.role==='user'?'Du':<><Sparkles size={14}/> Einfach Hausen</>}</div><p>{m.body}</p></div>)}

      {showNextChoice&&<div className="resolution-choice" aria-label="Wie soll der Hausmeister weitermachen?">
        <div className="resolution-copy"><strong>Wie soll ich weitermachen?</strong><span>Dein KI-Hausmeister bleibt in beiden Fällen dabei.</span></div>
        <div className="resolution-actions">
          <form action={startHausmeisterRouteAction.bind(null,'contact')}><button className="resolution-button" type="submit"><MessageCircle/><span><strong>Ansprechpartner finden</strong><small>Nur mit einem passenden Menschen sprechen. Noch kein Auftrag.</small></span><ChevronRight/></button></form>
          <form action={startHausmeisterRouteAction.bind(null,'service')}><button className="resolution-button primary-choice" type="submit"><ClipboardCheck/><span><strong>Auftrag organisieren</strong><small>Angebote, Termin und Ausführung organisieren lassen.</small></span><ChevronRight/></button></form>
        </div>
      </div>}

      {draft&&<div className="route-progress"><span>{draft.intent==='contact'?<MessageCircle/>:<ClipboardCheck/>}</span><div><strong>{draft.intent==='contact'?'Ansprechpartner finden':'Auftrag organisieren'}</strong><small>{draft.intent==='contact'?'Ich brauche nur noch eine kurze Info, dann suche ich einen passenden Menschen.':'Ich brauche nur noch eine kurze Info, dann kann ich passende Partner anfragen.'}</small></div></div>}
      <HausmeisterComposer continuingIntent={draft?.intent}/>
    </div>

    <div className="trust-strip"><span><Sparkles/> KI-Hausmeister inklusive</span><span><MessageCircle/> Mensch, wenn du ihn willst</span><span><Wrench/> Auftrag nur auf deinen Wunsch</span></div>

    <div className="home-insights">
      <Link href="/app/plans"><small>Mitgliedschaft</small><strong>{subscription?.status==='active'?subscription.title:'Free'}</strong><span>{subscription?.status==='active'?`Priorität ${subscription.priority_level}`:'Free, Plus oder Premium ansehen'} <ChevronRight size={14}/></span></Link>
      <Link href="/app/home"><small>Hausplan</small><strong>{due?.c||0} Punkte</strong><span>demnächst fällig <ChevronRight size={14}/></span></Link>
    </div>

    <SectionTitle href="/app/jobs">Aktuelle Themen</SectionTitle>
    <div className="stack">{jobs.map(j=><Link className="job-row agent-job" href={`/app/jobs/${j.id}`} key={j.id}><div className="thumb-placeholder">{j.request_kind==='contact'?<MessageCircle/>:<Home/>}</div><div className="grow"><strong>{j.title.replace(/^Ansprechpartner:\s*/,'')}</strong><small><MapPin size={13}/>{j.postcode||'Dein Zuhause'}{j.preferred_date?` · ${dateLabel(j.preferred_date)}`:''}</small><span>{j.request_kind==='contact'?(j.status==='accepted'?'Ansprechpartner verbunden':`${j.dispatch_count||0} passende Partner angefragt`):j.quote_count?`${j.quote_count} Angebote werden verglichen`:j.dispatch_count?`${j.dispatch_count} Partner angefragt`:statusLabel(j.status)}</span></div><div className="right"><b>{j.request_kind==='service'&&j.budget_max?euro(j.budget_max):''}</b><ChevronRight size={18}/></div></Link>)}{jobs.length===0&&<div className="empty compact"><Bot/><strong>Noch kein Thema offen</strong><p>Frag oben einfach deinen KI-Hausmeister.</p></div>}</div>
  </AppShell>;
}
