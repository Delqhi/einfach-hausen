import { BadgeCheck,Crown,Handshake,ShieldCheck } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro } from '@/lib/format';
import { startPartnerPlanCheckoutAction } from '@/app/actions';
import { getProviderContext } from '@/lib/provider';

export default async function PartnerPlans({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('provider'); const ctx=getProviderContext(u.id); if(!ctx)return null; const sp=await searchParams;
  const plans=db.prepare('SELECT * FROM partner_plans WHERE active=1 ORDER BY monthly_amount').all() as any[];
  const current=db.prepare(`SELECT s.*,p.title FROM partner_subscriptions s JOIN partner_plans p ON p.slug=s.plan_slug WHERE s.provider_id=?`).get(ctx.providerId) as any;
  return <AppShell role="provider" active="/pro/profile" title="Partner-Tarife" subtitle="0 % Provision · keine Gebühr pro Auftrag">
    {sp.error&&<div className="alert error">{sp.error}</div>}{sp.checkout==='success'&&<div className="alert success"><BadgeCheck/>Tarif wurde aktiviert.</div>}
    <div className="partner-plan-hero"><Handshake/><div><strong>100 % des Auftragswerts bleiben beim Betrieb.</strong><p>Einfach Hausen monetarisiert Partner über planbare Monatsgebühren — nicht über Provision. Bezahlte Tarife kaufen keine bessere Position im Qualitätsmatching.</p></div></div>
    {current&&<div className="current-plan pro-current-plan"><ShieldCheck/><div><strong>{current.title} · {current.status}</strong><p>{current.trial_end?`Testphase bis ${new Date(current.trial_end).toLocaleDateString('de-DE')}`:'Aktueller Unternehmenstarif'}</p></div></div>}
    <SectionTitle>Tarife</SectionTitle><div className="partner-plan-grid">{plans.map(p=><article className={p.slug==='pro'?'partner-plan-card featured':'partner-plan-card'} key={p.slug}>{p.slug==='pro'&&<span className="plan-popular">BELIEBT</span>}<div className="plan-icon">{p.slug==='premium'?<Crown/>:<Handshake/>}</div><h2>{p.title}</h2><div className="plan-price">{euro(p.monthly_amount)}<small>/Monat</small></div><p>{p.description}</p><ul><li>0 % Provision</li><li>Keine Gebühr pro Auftrag</li>{p.monthly_lead_limit?<li>Bis zu {p.monthly_lead_limit} neue Anfragen/Monat</li>:<li>Unbegrenztes Anfragevolumen gemäß Qualitäts- und Kapazitätsmatching</li>}{p.trial_days?<li>Erste {Math.round(p.trial_days/30)} Monate kostenlos</li>:<li>Dauerhaft kostenlos</li>}</ul>{ctx.isOwner?<form action={startPartnerPlanCheckoutAction.bind(null,p.slug)}><button className="btn light wide" disabled={current?.plan_slug===p.slug&&(current.status==='active'||current.status==='trialing')}>{current?.plan_slug===p.slug&&(current.status==='active'||current.status==='trialing')?'Aktiv':`${p.title} wählen`}</button></form>:<small>Nur das Firmenkonto kann den Tarif ändern.</small>}</article>)}</div>
  </AppShell>;
}
