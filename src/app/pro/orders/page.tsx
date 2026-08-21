import Link from 'next/link';
import { ClipboardList,MessageCircle,UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro,statusLabel } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';

export default async function Orders(){
  const u=await requireUser('provider'); const ctx=getProviderContext(u.id); if(!ctx)return null;
  const rows=ctx.canManageJobs
    ? db.prepare(`SELECT j.*,q.amount,q.status quote_status,a.contact_user_id,cu.first_name contact_first,cu.last_name contact_last
        FROM jobs j
        JOIN job_dispatches d ON d.job_id=j.id AND d.provider_id=?
        LEFT JOIN quotes q ON q.job_id=j.id AND q.provider_id=?
        LEFT JOIN job_assignments a ON a.job_id=j.id LEFT JOIN users cu ON cu.id=a.contact_user_id
        WHERE (j.request_kind='contact' AND d.status='accepted') OR q.id IS NOT NULL
        ORDER BY j.updated_at DESC`).all(ctx.providerId,ctx.providerId) as any[]
    : db.prepare(`SELECT j.*,q.amount,q.status quote_status,a.contact_user_id,cu.first_name contact_first,cu.last_name contact_last
        FROM job_assignments a JOIN jobs j ON j.id=a.job_id LEFT JOIN quotes q ON q.id=j.accepted_quote_id JOIN users cu ON cu.id=a.contact_user_id
        WHERE a.provider_id=? AND a.contact_user_id=? ORDER BY j.updated_at DESC`).all(ctx.providerId,u.id) as any[];
  return <AppShell role="provider" active="/pro/orders" title="Aufträge & Kontakte" subtitle={ctx.canManageJobs?'Firma · Angebote, Kontakte und laufende Arbeiten':'Nur deine zugewiesenen Themen'}>
    <div className="stack">{rows.map(r=><Link href={`/pro/jobs/${r.id}`} className="pro-request simple" key={r.id}>{r.request_kind==='contact'?<MessageCircle/>:<ClipboardList/>}<div className="grow"><strong>{r.title.replace(/^Ansprechpartner:\s*/,'')}</strong><small>{r.request_kind==='contact'?'Persönlicher Ansprechpartner':`${statusLabel(r.quote_status)} · Auftrag ${statusLabel(r.status)}`}</small>{r.contact_first&&<small><UserRound/>{r.contact_first} {r.contact_last}</small>}</div><b>{r.request_kind==='contact'?'Kontakt':euro(r.amount)}</b></Link>)}{rows.length===0&&<div className="empty dark-empty"><ClipboardList/><strong>Noch keine Aufträge oder Kontakte</strong></div>}</div>
  </AppShell>;
}
