import Link from 'next/link';
import { FileText, ReceiptText, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro } from '@/lib/format';
import { invoiceStatusLabel } from '@/lib/invoices';

export default async function Documents(){
  const u=await requireUser('homeowner');
  const uploaded=db.prepare(`SELECT d.id,d.kind,d.path,d.created_at,d.title document_title,j.title job_title,p.business_name FROM documents d JOIN jobs j ON j.id=d.job_id LEFT JOIN provider_profiles p ON p.user_id=d.provider_id WHERE j.homeowner_id=? ORDER BY d.created_at DESC`).all(u.id) as any[];
  const invoices=db.prepare(`SELECT i.*,j.title,p.business_name FROM invoices i JOIN jobs j ON j.id=i.job_id JOIN provider_profiles p ON p.user_id=i.provider_id WHERE i.homeowner_id=? ORDER BY i.created_at DESC`).all(u.id) as any[];
  const payments=db.prepare(`SELECT pay.*,j.title,p.business_name FROM payments pay JOIN jobs j ON j.id=pay.job_id JOIN provider_profiles p ON p.user_id=pay.provider_id WHERE pay.homeowner_id=? AND pay.status='paid' ORDER BY pay.paid_at DESC`).all(u.id) as any[];
  return <AppShell role="homeowner" active="/app/documents"><h1 className="page-title">Dokumente & Rechnungen</h1><p className="page-subtitle">Rechnungen deiner Partnerbetriebe, Leistungsnachweise und Zahlungsbelege an einem Ort.</p><div className="stack">{invoices.map(i=><Link className="document-row invoice-document-row" href={`/app/invoices/${i.id}`} key={`i-${i.id}`}><ReceiptText/><div><strong>Rechnung {i.invoice_number}</strong><small>{i.business_name} · {i.title} · {euro(i.total_gross)}</small></div><span>{invoiceStatusLabel(i.status)}</span></Link>)}{uploaded.map(d=><a className="document-row" href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer" key={`d-${d.id}`}><FileText/><div><strong>{d.document_title}</strong><small>{d.business_name||'Einfach Hausen'} · {d.job_title}</small></div><span>{d.kind}</span></a>)}{payments.map(p=><Link className="document-row" href={`/app/documents/${p.job_id}/receipt`} key={`p-${p.id}`}><ReceiptText/><div><strong>Zahlungsbeleg · {p.title}</strong><small>{p.business_name} · {euro(p.amount)}</small></div><ShieldCheck/></Link>)}{invoices.length===0&&uploaded.length===0&&payments.length===0&&<div className="empty"><FileText/><strong>Noch keine Dokumente</strong><p>Rechnungen und Belege erscheinen automatisch nach der Abwicklung.</p></div>}</div></AppShell>;
}
