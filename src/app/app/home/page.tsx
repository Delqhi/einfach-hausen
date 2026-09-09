import { CalendarDays, FileText, History, House, NotebookPen, TrendingUp, Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import {
  EHAppHeader, EHList, EHEmptyState, EHButton, EHText, EHRecordCover,
  EHWorkspaceGrid, EHWorkSection, EHWorkMetrics, EHWorkflowStack,
  EHServiceDirectory, EHSubmitButton,
} from '@/design-system';
import { HouseProfileForm, HouseAssetForm, HOUSE_ASSET_KINDS } from '@/components/homeowner/house-profile-forms';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { addHouseAssetAction, completeMaintenanceTaskAction, saveHouseProfileAction } from '@/app/actions';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';

export default async function MyHome() {
  const u=await requireUser('homeowner'); const p=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any; const property=primaryProperty(u.id);
  const assets=property?db.prepare('SELECT * FROM house_assets WHERE property_id=? ORDER BY created_at DESC').all(property.id) as any[]:[];
  const tasks=property?db.prepare("SELECT * FROM maintenance_tasks WHERE property_id=? AND status='open' ORDER BY due_date LIMIT 8").all(property.id) as any[]:[];
  const appointments=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' ORDER BY a.start_at LIMIT 3`).all(u.id) as any[];
  const docs=db.prepare(`SELECT COUNT(*) c FROM documents d JOIN jobs j ON j.id=d.job_id WHERE j.homeowner_id=?`).get(u.id) as any;
  const invoiceCount=(db.prepare(`SELECT COUNT(*) c FROM invoices WHERE homeowner_id=?`).get(u.id) as {c:number}).c;
  const historyCount=property?(db.prepare(`SELECT COUNT(*) c FROM house_history_entries WHERE property_id=?`).get(property.id) as {c:number}).c:0;
  return <AppShell role="homeowner" active="/app/home" title="Mein Haus" subtitle="Deine digitale Hausakte">
    <EHWorkflowStack>
      <EHAppHeader eyebrow="Digitale Hausakte" title="Mein Haus" text="Dein Gebäude, deine Technik und die nächsten Schritte im Überblick."
        actions={<EHButton href="#technik-anlegen" arrow>Technik hinzufügen</EHButton>} />
      <EHWorkspaceGrid main={<EHRecordCover eyebrow="Dein Zuhause" title={p?.address || 'Deine Hausakte.'}
        subtitle={[p?.postcode, p?.house_type].filter(Boolean).join(' · ') || 'Ergänze die Grunddaten deines Zuhauses.'}>
        <EHText>{[p?.build_year ? `Baujahr ${p.build_year}` : null, p?.living_area ? `${p.living_area} m² Wohnfläche` : null].filter(Boolean).join(' · ') || 'Gebäude, Ausstattung und Hausgeschichte bleiben hier zusammen.'}</EHText>
        <EHButton href="#hausprofil" variant="on-dark">Hausprofil bearbeiten</EHButton>
      </EHRecordCover>} aside={<EHWorkSection title="Als Nächstes" link={{ href: '/app/year', label: 'Mein Jahr' }}>
        {tasks.length > 0 ? <EHList label="Nächste Wartungen" items={tasks.slice(0, 4).map(t => ({
          id: String(t.id), title: t.title, text: `Fällig ${dateLabel(t.due_date)}`, href: '/app/year',
        }))} /> : <EHEmptyState title="Keine offene Wartung hinterlegt" text="Dein Jahresplan sammelt anstehende Arbeiten und Wartungen."
          action={<EHButton href="/app/year" variant="secondary">Jahresplan öffnen</EHButton>} />}
        {appointments.length > 0 && <EHList label="Bestätigte Termine" items={appointments.map(a => ({
          id: String(a.id), title: a.title, text: `${a.business_name} · ${dateLabel(a.start_at)}`, href: `/app/jobs/${a.job_id}`,
        }))} />}
      </EHWorkSection>} />
      <EHWorkMetrics items={[
        { label: 'Technik & Geräte', value: assets.length, href: '#technik' },
        { label: 'Dokumente & Rechnungen', value: docs.c + invoiceCount, href: '/app/documents' },
        { label: 'Frühere Arbeiten', value: historyCount, href: '/app/home/history' },
      ]} />
      <section id="technik" aria-label="Technik und Ausstattung">
        <EHWorkspaceGrid main={<EHWorkSection title="Technik & Ausstattung">
          {assets.length > 0 ? <EHList label="Hinterlegte Technik" items={assets.map(a => ({
            id: String(a.id), title: a.name,
            text: [HOUSE_ASSET_KINDS[a.kind] || a.kind, a.installed_year ? `Installiert ${a.installed_year}` : null, a.details].filter(Boolean).join(' · '),
          }))} /> : <EHEmptyState title="Deine Ausstattung ist noch nicht erfasst" text="Beginne zum Beispiel mit deiner Heizung oder PV-Anlage. Hersteller und Modell kannst du direkt ergänzen." />}
          {tasks.length > 0 && <EHWorkSection title="Wartungen erledigen">
            <EHList label="Offene Wartungen" items={tasks.slice(0, 4).map(t => ({
              id: String(t.id), title: t.title, text: `Fällig ${dateLabel(t.due_date)}`,
              action: <form action={completeMaintenanceTaskAction.bind(null, t.id)} aria-label={`${t.title} abschließen`}>
                <EHSubmitButton pendingLabel="Wird abgeschlossen …">Erledigt</EHSubmitButton>
              </form>,
            }))} />
          </EHWorkSection>}
        </EHWorkSection>} aside={<div id="technik-anlegen"><HouseAssetForm action={addHouseAssetAction} /></div>} />
      </section>
      <section id="hausprofil" aria-label="Hausprofil bearbeiten">
        <HouseProfileForm action={saveHouseProfileAction} profile={p} />
      </section>
      <EHWorkSection title="Deine Hausakte weiterführen">
          <EHServiceDirectory groups={[{ title: 'Wissen & Unterlagen', items: [
            { href: '/app/home/history', title: 'Hausgeschichte', text: 'Frühere Arbeiten, Kosten und Ansprechpartner dokumentieren.', icon: <History /> },
            { href: '/app/documents', title: 'Dokumente & Rechnungen', text: 'Nachweise und Unterlagen wiederfinden.', icon: <FileText /> },
            { href: '/app/home/passport', title: 'Hauspass', text: 'Deine Hausdaten als druckbare Übersicht ansehen.', icon: <House /> },
          ] }, { title: 'Planen & Vorbereiten', items: [
            { href: '/app/year', title: 'Mein Jahr', text: 'Anstehende Arbeiten und Wartungen im Blick behalten.', icon: <CalendarDays /> },
            { href: '#technik', title: 'Technik & Geräte', text: 'Ausstattung und Modellangaben nachschlagen.', icon: <Wrench /> },
            { href: '/app/home/sale', title: 'Verkauf & Bewertung', text: 'Hauswert festhalten und einen möglichen Verkauf vorbereiten.', icon: <TrendingUp /> },
          ] }]} />
          <EHText muted><NotebookPen aria-hidden="true" size={18} /> Notizen: noch nicht verfügbar. Hinweise zu Geräten kannst du bereits bei der Technik hinterlegen.</EHText>
        </EHWorkSection>
    </EHWorkflowStack>
  </AppShell>;
}
