import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro } from '@/lib/format';
import { Logo } from '@/components/logo';

export default async function Receipt({params}:{params:Promise<{jobId:string}>}){
 const u=await requireUser('homeowner'); const {jobId}=await params;
 const p=db.prepare(`SELECT pay.*,j.title,j.description,pr.business_name,x.first_name,x.last_name FROM payments pay JOIN jobs j ON j.id=pay.job_id JOIN provider_profiles pr ON pr.user_id=pay.provider_id JOIN users x ON x.id=pay.homeowner_id WHERE pay.job_id=? AND pay.homeowner_id=? AND pay.status='paid' ORDER BY pay.id DESC LIMIT 1`).get(Number(jobId),u.id) as any; if(!p)notFound();
 return <main className="receipt-page"><article className="receipt"><Logo/><div className="receipt-title"><div><h1>Zahlungsbeleg</h1><p>Einfach Hausen Plattform</p></div><b>#{String(p.id).padStart(6,'0')}</b></div><div className="receipt-grid"><div><small>Kunde</small><strong>{p.first_name} {p.last_name}</strong></div><div><small>Dienstleister</small><strong>{p.business_name}</strong></div><div><small>Auftrag</small><strong>{p.title}</strong></div><div><small>Zahlungsdatum</small><strong>{new Date(p.paid_at).toLocaleDateString('de-DE')}</strong></div></div><div className="receipt-line"><span>Vereinbarter Auftragsbetrag</span><strong>{euro(p.amount)}</strong></div><div className="receipt-total"><span>Bezahlt</span><strong>{euro(p.amount)}</strong></div><p className="receipt-note">Dieser Beleg bestätigt die über die Plattform erfasste Zahlung. Eine steuerliche Rechnung über die Handwerkerleistung stellt der beauftragte Dienstleister aus.</p><p className="print-hint print-hide">Zum Speichern oder Drucken dieses Belegs die Druckfunktion des Browsers verwenden.</p></article></main>;
}
