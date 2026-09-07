import Link from 'next/link';
import { EHAppHeader, EHList, EHEmptyState, EHButton, EHStatus } from '@/design-system';
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
    <div className="segmented-tabs job-tabs" role="navigation" aria-label="Auftragsansicht"><Link aria-current={tab==='active'?'page':undefined} className={tab==='active'?'active':''} href="/app/jobs?tab=active">Aktiv</Link><Link aria-current={tab==='planned'?'page':undefined} className={tab==='planned'?'active':''} href="/app/jobs?tab=planned">Geplant</Link><Link aria-current={tab==='completed'?'page':undefined} className={tab==='completed'?'active':''} href="/app/jobs?tab=completed">Abgeschlossen</Link></div>
    <EHList label="Aufträge" items={visible.map(j=>({ id: String(j.id), title: j.title.replace(/^Ansprechpartner:\s*/,''), text: `${j.request_kind==='contact'?'Ansprechpartner':statusLabel(j.status)} · ${j.postcode}${j.preferred_date?` · ${dateLabel(j.preferred_date)}`:''} · ${j.accepted_business|| (j.request_kind==='contact'?'Persönlicher Kontakt':j.quotes?`${j.quotes} Angebote`:'Partner werden angefragt')}${j.request_kind==='service'&&j.budget_max?` · ${euro(j.budget_max)}`:''}`, href: `/app/jobs/${j.id}`, meta: <EHStatus>{j.request_kind==='contact'?'Ansprechpartner':statusLabel(j.status)}</EHStatus> }))} />
    {visible.length===0&&<EHEmptyState title={tab==='completed'?'Noch nichts abgeschlossen':tab==='planned'?'Noch nichts geplant':'Keine aktiven Themen'} text={tab==='active'?'Beschreib dein nächstes Anliegen einfach dem Hausmeister. Du entscheidest danach, ob du nur eine Frage klärst, einen Ansprechpartner suchst oder einen Auftrag organisierst.':tab==='planned'?'Bestätigte Aufträge mit Termin erscheinen hier. Bis dahin kannst du deine aktiven Themen prüfen.':'Erledigte oder stornierte Aufträge erscheinen hier. Ein neues Anliegen startest du jederzeit beim Hausmeister.'} action={tab==='active'?<EHButton href="/app/hausmeister" arrow>Anliegen beschreiben</EHButton>:tab==='planned'?<EHButton href="/app/jobs?tab=active">Aktive Themen ansehen</EHButton>:<EHButton href="/app/hausmeister" arrow>Neues Anliegen starten</EHButton>} />}
  </AppShell>;
}
