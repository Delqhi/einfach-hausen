import Link from 'next/link';
import { ChevronRight, Home, Link2, Mail, UsersRound } from 'lucide-react';
import { EHAppHeader, EHPanel, EHList, EHEmptyState, EHButton, EHStatus, EHField, EHInput, EHSelect, EHTextarea } from '@/design-system';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { addHouseHistoryAction,createHouseTransferAction } from '@/app/actions';
import { euro } from '@/lib/format';
import { HOUSE_TRANSFER_TTL_DAYS,houseTransferExpiresAt,houseTransferLifecycleStatus,primaryProperty } from '@/lib/properties';

export default async function HouseHistory({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const user=await requireUser('homeowner'); const sp=await searchParams; const property=primaryProperty(user.id);
  if(!property)return <AppShell role="homeowner" active="/app/home"><div className="empty owner-empty-action"><Home aria-hidden="true"/><strong>Keine aktive Hausakte</strong><p>Lege zuerst dein Zuhause an. Danach kannst du frühere Arbeiten, Wartungen und Dokumente hier sammeln.</p><Link className="btn primary" href="/app/home">Mein Haus einrichten</Link></div></AppShell>;
  const entries=db.prepare(`SELECT h.*,p.business_name linked_business,(SELECT COUNT(*) FROM house_history_documents d WHERE d.entry_id=h.id) document_count FROM house_history_entries h LEFT JOIN provider_profiles p ON p.user_id=h.provider_id WHERE h.property_id=? ORDER BY h.performed_at DESC,h.id DESC`).all(property.id) as any[];
  const invites=db.prepare(`SELECT * FROM provider_invites WHERE property_id=? AND status='pending' ORDER BY created_at DESC`).all(property.id) as any[];
  const transfers=db.prepare(`SELECT * FROM house_transfers WHERE property_id=? ORDER BY created_at DESC LIMIT 5`).all(property.id) as any[];
  const ownerships=db.prepare(`SELECT o.*,u.first_name,u.last_name FROM property_ownerships o JOIN users u ON u.id=o.homeowner_id WHERE o.property_id=? ORDER BY o.started_at DESC,o.id DESC`).all(property.id) as any[];
  return <AppShell role="homeowner" active="/app/home" title="Haus-Historie" subtitle="Die Geschichte deines Hauses">
    <EHAppHeader eyebrow="Lebenslange Hausakte" title="Was wurde wann am Haus gemacht?" text="Auch Arbeiten aus der Zeit vor Einfach Hausen gehören hier hinein – mit Kosten, Garantie, Dokumenten und Ansprechpartnern." />
    {sp.transfer&&<div className="alert success" role="status" aria-live="polite"><Link2 aria-hidden="true"/>Übergabelink erstellt. Nur die angegebene Käufer-E-Mail kann ihn innerhalb von {HOUSE_TRANSFER_TTL_DAYS} Tagen annehmen.</div>}
    <EHPanel title="Historie">
    <EHList label="Haus-Historie" items={entries.map(e=>({ id: String(e.id), title: `${new Date(e.performed_at+'T12:00:00').getFullYear()} · ${e.title}`, text: `${e.category} · ${e.company_name||'Eigenleistung / unbekannt'}${e.contact_name?` · ${e.contact_name}`:''}${e.cost_amount!=null?` · ${euro(e.cost_amount)}`:''}${e.guarantee_until?` · Garantie bis ${new Date(e.guarantee_until+'T12:00:00').toLocaleDateString('de-DE')}`:''}${e.maintenance_due?` · Wartung ${new Date(e.maintenance_due+'T12:00:00').toLocaleDateString('de-DE')}`:''} · ${e.job_id?'Über Einfach Hausen dokumentiert':'Manuell eingetragen'}${e.notes?` — ${e.notes}`:''}`, meta: e.provider_id?<EHStatus tone="success">Partner verbunden</EHStatus>:e.contact_email?<EHStatus>Einladung vorgemerkt</EHStatus>:null, action: (e.before_photo||e.after_photo||e.document_count>0)?<span>{e.before_photo&&<a href={`/api/house-history-files/${e.id}/before`} target="_blank" rel="noreferrer">Vorher</a>}{e.after_photo&&<span> · </span>}{e.after_photo&&<a href={`/api/house-history-files/${e.id}/after`} target="_blank" rel="noreferrer">Nachher</a>}{e.document_count>0&&(db.prepare(`SELECT id,title FROM house_history_documents WHERE entry_id=?`).all(e.id) as any[]).map(d=><a key={d.id} href={`/api/house-history-documents/${d.id}`} target="_blank" rel="noreferrer"> · {d.title}</a>)}</span>:null }))} />
    {entries.length===0&&<EHEmptyState title="Noch keine Historie" text="Trag frühere Sanierungen, Wartungen, Technik oder Gartenarbeiten ein. Abgeschlossene Aufträge bleiben zusätzlich in deinen Aufträgen und Dokumenten nachvollziehbar." />}
    </EHPanel>

    <EHPanel title="Frühere Arbeit eintragen"><form action={addHouseHistoryAction}>
        <EHField id="hist-category" label="Bereich"><EHSelect id="hist-category" name="category" defaultValue="Haus & Allgemein"><option>Haus & Allgemein</option><option>Garten & Außen</option><option>Dach & Fassade</option><option>Elektro</option><option>Sanitär & Heizung</option><option>Fenster & Türen</option><option>Reinigung & Pflege</option><option>Technik & Energie</option><option>Renovierung & Innenausbau</option><option>Sonstiges</option></EHSelect></EHField>
        <EHField id="hist-date" label="Datum"><EHInput id="hist-date" name="performedAt" type="date" required/></EHField>
        <EHField id="hist-title" label="Was wurde gemacht?"><EHInput id="hist-title" name="title" required placeholder="z. B. Dach komplett saniert"/></EHField>
        <EHField id="hist-company" label="Firma"><EHInput id="hist-company" name="companyName" placeholder="z. B. Müller Dach GmbH"/></EHField>
        <EHField id="hist-cost" label="Kosten €"><EHInput id="hist-cost" name="cost" type="number" min="0" step="0.01"/></EHField>
        <EHField id="hist-cname" label="Ansprechpartner"><EHInput id="hist-cname" name="contactName"/></EHField>
        <EHField id="hist-cemail" label="E-Mail Handwerker" hint="Ist der Betrieb noch nicht dabei, wird die Verknüpfung für eine spätere Registrierung vorgemerkt."><EHInput id="hist-cemail" name="contactEmail" type="email"/></EHField>
        <EHField id="hist-cphone" label="Telefon"><EHInput id="hist-cphone" name="contactPhone" type="tel"/></EHField>
        <EHField id="hist-guar" label="Garantie bis"><EHInput id="hist-guar" name="guaranteeUntil" type="date"/></EHField>
        <EHField id="hist-maint" label="Nächste Wartung"><EHInput id="hist-maint" name="maintenanceDue" type="date"/></EHField>
        <EHField id="hist-notes" label="Notizen"><EHTextarea id="hist-notes" name="notes" rows={4}/></EHField>
        <EHField id="hist-before" label="Foto vorher"><input id="hist-before" name="beforePhoto" type="file" accept="image/*"/></EHField>
        <EHField id="hist-after" label="Foto nachher"><input id="hist-after" name="afterPhoto" type="file" accept="image/*"/></EHField>
        <EHField id="hist-doc" label="Rechnung / Dokument"><input id="hist-doc" name="document" type="file" accept="application/pdf,image/*"/></EHField>
        <EHField id="hist-doctitle" label="Dokumenttitel"><EHInput id="hist-doctitle" name="documentTitle" placeholder="z. B. Rechnung Dachsanierung 2025"/></EHField>
        <button>In Hausakte speichern</button></form>
    </EHPanel>

    {invites.length>0&&<EHPanel title="Vorgemerkte Betriebe"><EHList label="Vorgemerkte Betriebe" items={invites.map(i=>({ id: String(i.id), title: i.company_name||i.email, text: `${i.email} · wird automatisch verbunden, sobald sich der Betrieb registriert.`, href: `/partner-invite/${i.token}` }))} /></EHPanel>}

    <EHPanel title="Eigentümerhistorie"><EHList label="Eigentümerhistorie" items={ownerships.map(o=>({ id: String(o.id), title: `${o.first_name} ${o.last_name}`, text: `${new Date(o.started_at).toLocaleDateString('de-DE')} – ${o.active?'heute':o.ended_at?new Date(o.ended_at).toLocaleDateString('de-DE'):'beendet'}`, meta: o.active?<EHStatus tone="success">Aktuell</EHStatus>:null }))} /></EHPanel>

    <EHPanel title="Bei Hausverkauf übergeben"><strong>Hausakte an Käufer übergeben</strong><p>Es wird dieselbe Immobilie mit ihrer Historie weitergeführt. Hausprofil, Anlagen, offene Wartungen und hausbezogene Ansprechpartner gehen mit. Private alte Nachrichten, Zahlungen und Aufträge bleiben beim bisherigen Eigentümer.</p><p>Der Übergabelink ist {HOUSE_TRANSFER_TTL_DAYS} Tage gültig. Danach wird die Freigabe automatisch ungültig und kann nicht mehr zur Eigentumsübernahme verwendet werden.</p><form action={createHouseTransferAction}><EHField id="hist-targetemail" label="E-Mail des Käufers"><input id="hist-targetemail" name="targetEmail" type="email" required placeholder="käufer@example.de"/></EHField><button className="btn ghost">Übergabe vorbereiten</button></form><Link href="/app/home/passport" className="text-link">Hauspass ansehen <ChevronRight size={14}/></Link></EHPanel>
    {transfers.length>0&&<EHList label="Übergabe-Verlauf" items={transfers.map(t=>{const lifecycle=houseTransferLifecycleStatus(t);const expiresAt=houseTransferExpiresAt(t.created_at);const label=lifecycle==='accepted'?'Übergeben':lifecycle==='expired'?'Abgelaufen':lifecycle==='revoked'?'Widerrufen':'Bereit';return { id: String(t.id), title: t.target_email, text: lifecycle==='active'&&expiresAt?`gültig bis ${expiresAt.toLocaleDateString('de-DE')}`:label, meta: <EHStatus tone={lifecycle==='accepted'?'success':lifecycle==='active'?'info':'neutral'}>{label}</EHStatus> };})} />}
  </AppShell>;
}
