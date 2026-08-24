import { ChevronRight,ClipboardCheck,HelpCircle,MessageCircle,Sparkles,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { startHausmeisterRouteAction } from '@/app/actions';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function Hausmeister({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams;
  const thread=db.prepare(`SELECT * FROM assistant_threads WHERE user_id=? AND channel='app' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as any;
  const messages=thread?db.prepare('SELECT * FROM assistant_messages WHERE thread_id=? ORDER BY created_at DESC,id DESC LIMIT 20').all(thread.id).reverse() as any[]:[];
  const draft=thread?db.prepare('SELECT intent FROM assistant_drafts WHERE thread_id=?').get(thread.id) as {intent:'service'|'contact'}|undefined:undefined;
  const lastAssistant=[...messages].reverse().find(m=>m.role==='assistant');
  let lastMeta:any={}; try{lastMeta=lastAssistant?JSON.parse(lastAssistant.metadata_json||'{}'):{};}catch{}
  const showNextChoice=Boolean(lastMeta.assistantOnly&&!draft);
  const starterHints:Record<string,string>={garten:'Was soll draußen oder im Garten gemacht werden?',reparatur:'Was ist kaputt oder muss repariert werden?',pflege:'Was soll gereinigt oder gepflegt werden?',technik:'Wobei brauchst du Hilfe mit Technik oder Installation?'};
  const starterHint=sp.topic?starterHints[sp.topic]:undefined;

  return <AppShell role="homeowner" active="/app" title="Hausmeister" subtitle="Fragen klären oder etwas organisieren">
    <div className="housemaster-panel">
      <div className="agent-hero housemaster-hero"><div><span className="agent-online">Hausmeister · bereit</span><h1>Hallo {user.first_name}.</h1><p>Beschreib einfach, was los ist. Wir klären zuerst die Frage. Erst danach entscheidest du bewusst zwischen weiter fragen, einem persönlichen Ansprechpartner oder einem echten Auftrag.</p></div></div>
      {sp.error&&<div className="alert error" role="alert">{sp.error}</div>}
      <div className="agent-chat housemaster-chat">
        {messages.length===0&&<div className="agent-message assistant"><div className="message-head"><Sparkles size={14}/> Einfach Hausen</div><p>Beschreib einfach, was los ist. Ich helfe beim Einordnen und du entscheidest danach, ob du nur einen Ansprechpartner möchtest oder einen Auftrag organisieren willst.</p></div>}
        {messages.map(m=><div className={`agent-message ${m.role}`} key={m.id}><div className="message-head">{m.role==='user'?'Du':<><Sparkles size={14}/> Einfach Hausen</>}</div><p>{m.body}</p></div>)}
        {showNextChoice&&<div className="resolution-choice" role="region" aria-live="polite" aria-label="Wie soll der Hausmeister weitermachen?">
          <div className="resolution-copy"><strong>Wie soll es weitergehen?</strong><span>Keine Aktion passiert automatisch.</span></div>
          <div className="resolution-actions owner-resolution-actions">
            <a href="#hausmeister-composer" className="resolution-button question-choice"><HelpCircle/><span><strong>Frage klären</strong><small>Im Gespräch bleiben und erst einmal nichts beauftragen.</small></span><ChevronRight/></a>
            <form action={startHausmeisterRouteAction.bind(null,'contact')}><button className="resolution-button" type="submit"><MessageCircle/><span><strong>Ansprechpartner finden</strong><small>Mit einem passenden geprüften Menschen sprechen, ohne Auftrag.</small></span><ChevronRight/></button></form>
            <form action={startHausmeisterRouteAction.bind(null,'service')}><button className="resolution-button primary-choice" type="submit"><ClipboardCheck/><span><strong>Auftrag organisieren</strong><small>Erst jetzt Angebote, Termin und Ausführung organisieren.</small></span><ChevronRight/></button></form>
          </div>
        </div>}
        {draft&&<div className="route-progress" role="status" aria-live="polite"><span>{draft.intent==='contact'?<MessageCircle/>:<ClipboardCheck/>}</span><div><strong>{draft.intent==='contact'?'Ansprechpartner finden':'Auftrag organisieren'}</strong><small>{draft.intent==='contact'?'Nur noch eine kurze Info, dann suchen wir den passenden Menschen.':'Nur noch eine kurze Info, dann können passende Partner angefragt werden.'}</small></div></div>}
        <div id="hausmeister-composer" className="owner-housemaster-composer"><HomeownerHausmeisterComposer continuingIntent={draft?.intent} starterHint={starterHint}/></div>
      </div>
      <div className="trust-strip housemaster-trust"><span><HelpCircle/> Frage klären</span><span><MessageCircle/> Ansprechpartner auf Wunsch</span><span><Wrench/> Auftrag nur nach Freigabe</span></div>
    </div>
  </AppShell>;
}
