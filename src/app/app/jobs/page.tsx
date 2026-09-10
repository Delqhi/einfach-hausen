import { EHAppHeader, EHRequestList, EHRouteTabs, EHEmptyState, EHButton } from '@/design-system';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro,dateLabel,statusLabel } from '@/lib/format';

export default async function Jobs({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const sp=await searchParams; const tab=['planned','completed'].includes(sp.tab)?sp.tab:'active';
  const jobs=db.prepare(`SELECT j.*,COUNT(DISTINCT q.id) quotes,ap.business_name accepted_business FROM jobs j LEFT JOIN quotes q ON q.job_id=j.id LEFT JOIN quotes aq ON aq.id=j.accepted_quote_id LEFT JOIN provider_profiles ap ON ap.user_id=aq.provider_id WHERE j.homeowner_id=? GROUP BY j.id ORDER BY j.updated_at DESC`).all(u.id) as any[];
  const visible=jobs.filter(j=>tab==='completed'?['completed','cancelled'].includes(j.status):tab==='planned'?(j.request_kind==='service'&&j.status==='accepted'):!['completed','cancelled'].includes(j.status)&&!(j.request_kind==='service'&&j.status==='accepted'));
  return <AppShell role="homeowner" active="/app/jobs" title="Meine Aufträge" subtitle="Alles, was geplant oder in Arbeit ist">
    <EHAppHeader eyebrow="Übersicht" title="Meine Aufträge" text="Termine, Angebote und erledigte Arbeiten auf einen Blick." />
    <EHRouteTabs label="Auftragsansicht" items={[{href:'/app/jobs?tab=active',label:'Aktiv',active:tab==='active'},{href:'/app/jobs?tab=planned',label:'Geplant',active:tab==='planned'},{href:'/app/jobs?tab=completed',label:'Abgeschlossen',active:tab==='completed'}]}/>
    <EHRequestList items={visible.map(j=>({id:String(j.id),title:j.title.replace(/^Ansprechpartner:\s*/,''),kind:j.request_kind==='contact'?'Ansprechpartner':statusLabel(j.status),description:j.accepted_business||(j.request_kind==='contact'?'Persönlicher Kontakt':j.quotes?`${j.quotes} Angebote`:'Partner werden angefragt'),location:j.postcode||'Dein Zuhause',time:j.preferred_date?dateLabel(j.preferred_date):'Noch kein Wunschtermin',price:j.request_kind==='service'&&j.budget_max?`Budget bis ${euro(j.budget_max)}`:null,href:`/app/jobs/${j.id}`}))}/>
    {visible.length===0&&<EHEmptyState title={tab==='completed'?'Noch nichts abgeschlossen':tab==='planned'?'Noch nichts geplant':'Keine aktiven Themen'} text={tab==='active'?'Beschreib dein nächstes Anliegen einfach dem Hausmeister. Du entscheidest danach, ob du nur eine Frage klärst, einen Ansprechpartner suchst oder einen Auftrag organisierst.':tab==='planned'?'Bestätigte Aufträge mit Termin erscheinen hier. Bis dahin kannst du deine aktiven Themen prüfen.':'Erledigte oder stornierte Aufträge erscheinen hier. Ein neues Anliegen startest du jederzeit beim Hausmeister.'} action={tab==='active'?<EHButton href="/app/hausmeister" arrow>Anliegen beschreiben</EHButton>:tab==='planned'?<EHButton href="/app/jobs?tab=active">Aktive Themen ansehen</EHButton>:<EHButton href="/app/hausmeister" arrow>Neues Anliegen starten</EHButton>} />}
  </AppShell>;
}
