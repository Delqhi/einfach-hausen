import Link from 'next/link';
import { ChevronRight,MapPin,MessageCircle,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro,dateLabel,statusLabel } from '@/lib/format';

export default async function Jobs(){
  const u=await requireUser('homeowner');
  const jobs=db.prepare(`SELECT j.*,COUNT(q.id) quotes FROM jobs j LEFT JOIN quotes q ON q.job_id=j.id WHERE j.homeowner_id=? GROUP BY j.id ORDER BY j.created_at DESC`).all(u.id) as any[];
  return <AppShell role="homeowner" active="/app/jobs" title="Themen & Aufträge" subtitle="Persönliche Kontakte und beauftragte Arbeiten">
    <h1 className="page-title">Meine Themen</h1><p className="page-subtitle">Manches braucht nur den richtigen Ansprechpartner. Anderes wird als Auftrag organisiert.</p>
    <div className="stack">{jobs.map(j=><Link href={`/app/jobs/${j.id}`} className="job-card" key={j.id}><div>{j.request_kind==='contact'?<span className="status active"><MessageCircle size={13}/> Ansprechpartner</span>:<span className={`status ${j.status}`}><Wrench size={13}/> {statusLabel(j.status)}</span>}<h3>{j.title.replace(/^Ansprechpartner:\s*/,'')}</h3><p>{j.description}</p><small><MapPin size={13}/>{j.postcode}{j.request_kind==='service'&&j.preferred_date?` · ${dateLabel(j.preferred_date)}`:''}{j.request_kind==='service'?` · ${j.quotes} Angebote`:''}</small></div><div className="job-card-side"><b>{j.request_kind==='service'&&j.budget_max?euro(j.budget_max):'Kontakt'}</b><ChevronRight/></div></Link>)}</div>
  </AppShell>;
}
