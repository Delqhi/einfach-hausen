import { AppShell } from '@/components/shell';
import { EHAppHeader, EHList, EHEmptyState, EHButton, EHStatus } from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro } from '@/lib/format';
import { invoiceStatusLabel } from '@/lib/invoices';

export default async function Documents(){
  const u=await requireUser('homeowner');
  const uploaded=db.prepare(`SELECT d.id,d.kind,d.path,d.created_at,d.title document_title,j.title job_title,p.business_name FROM documents d JOIN jobs j ON j.id=d.job_id LEFT JOIN provider_profiles p ON p.user_id=d.provider_id WHERE j.homeowner_id=? ORDER BY d.created_at DESC`).all(u.id) as any[];
  const invoices=db.prepare(`SELECT i.*,j.title,p.business_name FROM invoices i JOIN jobs j ON j.id=i.job_id JOIN provider_profiles p ON p.user_id=i.provider_id WHERE i.homeowner_id=? ORDER BY i.created_at DESC`).all(u.id) as any[];
  const payments=db.prepare(`SELECT pay.*,j.title,p.business_name FROM payments pay JOIN jobs j ON j.id=pay.job_id JOIN provider_profiles p ON p.user_id=pay.provider_id WHERE pay.homeowner_id=? AND pay.status='paid' ORDER BY pay.paid_at DESC`).all(u.id) as any[];
  const empty = invoices.length===0&&uploaded.length===0&&payments.length===0;
  return <AppShell role="homeowner" active="/app/documents">
    <EHAppHeader eyebrow="Übersicht" title="Dokumente & Rechnungen" text="Rechnungen deiner Partnerbetriebe, Leistungsnachweise und Zahlungsbelege an einem Ort." />
    {!empty && <EHList label="Rechnungen" items={invoices.map(i=>({ id: `i-${i.id}`, title: `Rechnung ${i.invoice_number}`, text: `${i.business_name} · ${i.title} · ${euro(i.total_gross)}`, href: `/app/invoices/${i.id}`, meta: <EHStatus>{invoiceStatusLabel(i.status)}</EHStatus> }))} />}
    {!empty && <EHList label="Hochgeladene Dokumente" items={uploaded.map(d=>({ id: `d-${d.id}`, title: d.document_title, text: `${d.business_name||'Einfach Hausen'} · ${d.job_title}`, href: `/api/documents/${d.id}`, meta: <EHStatus>{d.kind}</EHStatus> }))} />}
    {!empty && <EHList label="Zahlungsbelege" items={payments.map(p=>({ id: `p-${p.id}`, title: `Zahlungsbeleg · ${p.title}`, text: `${p.business_name} · ${euro(p.amount)}`, href: `/app/documents/${p.job_id}/receipt` }))} />}
    {empty && <EHEmptyState title="Noch keine Dokumente" text="Rechnungen, Belege und Leistungsnachweise landen hier nach einer Abwicklung. Für ein neues Anliegen startest du beim Hausmeister." action={<EHButton href="/app/hausmeister" arrow>Anliegen beschreiben</EHButton>} />}
  </AppShell>;
}
