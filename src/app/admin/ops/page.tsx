import { Star, Search } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { toggleFeatureFlagAction } from '@/app/actions';
import { requireAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';

export default async function AdminOps({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
  await requireAdmin();
  const sp=await searchParams;
  const q=String(sp.q||'').trim();
  let matches: any[] = [];
  if (q) {
    matches = db.prepare(`SELECT u.id,u.email,u.role,u.first_name,u.last_name,u.created_at,u.auth_subject,
      (SELECT COUNT(*) FROM jobs WHERE homeowner_id=u.id) jobs,
      (SELECT COUNT(*) FROM jobs WHERE id IN (SELECT job_id FROM quotes WHERE provider_id=u.id)) quotes
      FROM users u WHERE u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? ORDER BY u.created_at DESC LIMIT 25`).all(`%${q}%`,`%${q}%`,`%${q}%`) as any[];
  }
  const outbox=db.prepare(`SELECT status,COUNT(*) c FROM notifications GROUP BY status`).all() as any[];
  const dead=db.prepare(`SELECT id,kind,title,created_at FROM notifications WHERE status='dead' ORDER BY created_at DESC LIMIT 10`).all() as any[];
  const trace=db.prepare(`SELECT d.job_id,d.decision,d.reason_key,d.detail,d.created_at,p.business_name
    FROM match_decision_trace d JOIN users pr ON pr.id=d.provider_id
    LEFT JOIN provider_profiles p ON p.user_id=d.provider_id
    ORDER BY d.created_at DESC LIMIT 15`).all() as any[];
  return <main className="admin-page"><header className="admin-header"><h1>Operations</h1><p>Lookup, Zustellstatus, Matching-Trace, Flags.</p></header>
    <section className="admin-panel"><h2>Feature-Flags</h2>
      <div className="stack">{['ki_chat','pilot_cohort_open'].map(flag=>{
        const enabled=isFeatureEnabled(flag);
        return <article className="admin-card" key={flag}><div className="admin-card-head"><div><strong>{flag}</strong><small>{enabled?'aktiv':'inaktiv'}</small></div>
          <form action={toggleFeatureFlagAction.bind(null, flag)}><button className="btn ghost">{enabled?'Deaktivieren':'Aktivieren'}</button></form>
        </div></article>;})}
      </div>
    </section>
    <section className="admin-panel"><h2>Lookup</h2>
      <form className="admin-form" action="/admin/ops"><input name="q" defaultValue={q} placeholder="E-Mail oder Name" aria-label="Suche"/><button className="btn primary">Suchen</button></form>
      {q&&<div className="stack">{matches.length===0&&<p className="muted">Keine Treffer.</p>}
        {matches.map(u=><article className="admin-card" key={u.id}><div className="admin-card-head"><div><strong>{u.first_name} {u.last_name}</strong><small>{u.email} · {u.role} · id={u.id} · registriert {new Date(u.created_at).toLocaleDateString('de-DE')} · {u.jobs} Aufträge / {u.quotes} Angebote {u.auth_subject?'· Supabase gebunden':'· KEINE Identity gebunden'}</small></div></div></article>)}</div>}
    </section>
    <section className="admin-panel"><h2>Zustellstatus (Outbox)</h2>
      <div className="stack">{outbox.map(o=><div className="admin-card" key={o.status}><strong>{o.status}</strong><span> {o.c}</span></div>)}</div>
      {dead.length>0&&<><h3>Tote Briefe (letzte 10)</h3><div className="stack">{dead.map(d=><article className="admin-card" key={d.id}><small>{d.kind} · {new Date(d.created_at).toLocaleString('de-DE')}</small></article>)}</div></>}
    </section>
    <section className="admin-panel"><h2>Matching-Trace</h2>
      <div className="stack">{trace.map((t,i)=><article className="admin-card" key={i}><small>{new Date(t.created_at).toLocaleString('de-DE')} · Job {t.job_id} · {t.business_name||t.reason_key}</small><strong>{t.decision}</strong><p>{t.detail}</p></article>)}</div>
    </section>
  </main>;
}
