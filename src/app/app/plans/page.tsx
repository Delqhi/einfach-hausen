import { CheckCircle2,Crown,Leaf,ShieldCheck,Sparkles,Wrench } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { purchasePackageAction,startMembershipCheckoutAction } from '@/app/actions';
import { euro } from '@/lib/format';

export default async function Plans({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const sp=await searchParams;
  const plans=db.prepare('SELECT * FROM membership_plans WHERE active=1 ORDER BY monthly_amount').all() as any[];
  const packages=db.prepare('SELECT * FROM service_packages WHERE active=1 ORDER BY price_amount').all() as any[];
  const current=db.prepare(`SELECT s.*,p.title FROM subscriptions s JOIN membership_plans p ON p.slug=s.plan_slug WHERE s.homeowner_id=?`).get(u.id) as any;
  const orders=db.prepare(`SELECT o.*,p.title FROM package_orders o JOIN service_packages p ON p.slug=o.package_slug WHERE o.homeowner_id=? ORDER BY o.created_at DESC`).all(u.id) as any[];
  return <AppShell role="homeowner" active="/app/plans">
    <div className="plans-hero"><Crown/><div><h1>Unsere Pakete</h1><p>Mehr Unterstützung für dein Zuhause – von Erinnerungen bis zur kompletten Jahresorganisation.</p></div></div>
    {sp.error&&<div className="alert error">{sp.error}</div>}{sp.checkout==='success'&&<div className="alert success">Buchung erfolgreich.</div>}{sp.checkout==='processing'&&<div className="alert success">Zahlung eingegangen. Aktivierung folgt erst nach bestätigtem Stripe-Webhook.</div>}{sp.checkout==='unavailable'&&<div className="alert error">Onlinezahlung ist derzeit nicht vollständig konfiguriert. Es wurde kein Zahlungs- oder Tarifstatus geändert.</div>}
    {current?.status==='active'&&<div className="current-plan"><CheckCircle2/><div><strong>{current.title} aktiv</strong><p>Deine Mitgliedschaft ist aktiv. Vorteile werden bei der Organisation berücksichtigt.</p></div></div>}
    <SectionTitle>Mitgliedschaften</SectionTitle><div className="plan-grid">{plans.map((p,i)=><article className={p.slug==='plus'?'plan-card featured':'plan-card'} key={p.slug}>{p.slug==='plus'&&<span className="plan-popular">EMPFOHLEN</span>}<div className="plan-icon">{i===0?<Sparkles/>:i===1?<ShieldCheck/>:<Crown/>}</div><h2>{p.title}</h2><div className="plan-price">{euro(p.monthly_amount)}<small>/Monat</small></div><p>{p.description}</p><ul><li>Zentrale Hausorganisation & Hilfe</li><li>Geprüfte Vertragspartner</li><li>Angebots- und Preisvergleich</li><li>Digitale Hausakte</li>{p.annual_house_check?<li>Jährlicher Haus-Check</li>:null}{p.partner_discount_bps?<li>Bis zu {(p.partner_discount_bps/100).toFixed(0)} % vertraglicher Kundenvorteil</li>:null}</ul><form action={startMembershipCheckoutAction.bind(null,p.slug)}><button className={p.slug==='plus'?'btn primary wide':'btn ghost wide'} disabled={current?.status==='active'&&current.plan_slug===p.slug}>{current?.status==='active'&&current.plan_slug===p.slug?'Aktiv':`${p.title} wählen`}</button></form></article>)}</div>
    <SectionTitle>Jahres- & Premiumpakete</SectionTitle><div className="package-grid">{packages.map((p:any)=><article className="package-card" key={p.slug}><div className="package-icon">{p.slug.includes('garten')?<Leaf/>:<Wrench/>}</div><div className="grow"><h3>{p.title}</h3><p>{p.description}</p><div className="package-services">{JSON.parse(p.services_json).map((x:string)=><span key={x}>✓ {x}</span>)}</div></div><div className="package-buy"><b>{euro(p.price_amount)}</b><form action={purchasePackageAction.bind(null,p.slug)}><button className="btn dark">Paket buchen</button></form></div></article>)}</div>
    {orders.length>0&&<><SectionTitle>Meine Pakete</SectionTitle><div className="stack">{orders.map(o=><div className="package-order" key={o.id}><strong>{o.title}</strong><span className={`status ${o.status}`}>{o.status}</span></div>)}</div></>}
  </AppShell>;
}
