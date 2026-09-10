import { CheckCircle2 } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { EHAppHeader, EHPanel, EHList, EHErrorState, EHFormFeedback, EHSubmitButton } from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { purchasePackageAction,startMembershipCheckoutAction } from '@/app/actions';
import { euro } from '@/lib/format';

export default async function Plans({searchParams}:{searchParams:Promise<Record<string,string>>}){
  const u=await requireUser('homeowner'); const sp=await searchParams;
  const isPilot=!!db.prepare('SELECT user_id FROM pilot_cohort WHERE user_id=?').get(u.id);
  const plans=db.prepare('SELECT * FROM membership_plans WHERE active=1 ORDER BY monthly_amount').all() as any[];
  const packages=db.prepare('SELECT * FROM service_packages WHERE active=1 ORDER BY price_amount').all() as any[];
  const current=db.prepare(`SELECT s.*,p.title FROM subscriptions s JOIN membership_plans p ON p.slug=s.plan_slug WHERE s.homeowner_id=?`).get(u.id) as any;
  const orders=db.prepare(`SELECT o.*,p.title FROM package_orders o JOIN service_packages p ON p.slug=o.package_slug WHERE o.homeowner_id=? ORDER BY o.created_at DESC`).all(u.id) as any[];
  return <AppShell role="homeowner" active="/app/plans">
    <EHAppHeader eyebrow="Tarife" title="Unsere Pakete" text="Mehr Unterstützung für dein Zuhause – von Erinnerungen bis zur kompletten Jahresorganisation." />
    {sp.error&&<EHErrorState text={sp.error} />}{sp.checkout==='success'&&<EHFormFeedback kind="success">Buchung erfolgreich.</EHFormFeedback>}{sp.checkout==='processing'&&<EHFormFeedback kind="success">Zahlung eingegangen. Aktivierung folgt erst nach bestätigtem Stripe-Webhook.</EHFormFeedback>}{sp.checkout==='unavailable'&&<EHErrorState text="Onlinezahlung ist derzeit nicht vollständig konfiguriert. Es wurde kein Zahlungs- oder Tarifstatus geändert. Du kannst den Tarif später erneut wählen." />}
    {current?.status==='active'&&<div className="current-plan" role="status"><CheckCircle2 aria-hidden="true"/><div><strong>{current.title} aktiv</strong><p>Deine Mitgliedschaft ist aktiv. Vorteile werden bei der Organisation berücksichtigt.</p></div></div>}
    {isPilot && <EHFormFeedback kind="success">Pilot-Vorteil aktiv: 15% Dauer-Vorteil auf Pakete und Mitgliedschaften — wird beim Checkout automatisch angewendet.</EHFormFeedback>}
    <SectionTitle>Mitgliedschaften</SectionTitle>{plans.map((p)=><EHPanel key={p.slug} title={`${p.title}${p.slug==='plus'?' (empfohlen)':''} — ${euro(p.monthly_amount)}/Monat`}><p>{p.description}</p><EHList label={p.title} items={[{ id: p.slug + '-base', title: 'Zentrale Hausorganisation & Hilfe' },{ id: p.slug + '-partner', title: 'Geprüfte Vertragspartner' },{ id: p.slug + '-vergleich', title: 'Angebots- und Preisvergleich' },{ id: p.slug + '-akte', title: 'Digitale Hausakte' },...(p.annual_house_check?[{ id: p.slug + '-check', title: 'Jährlicher Haus-Check' }]:[]),...(p.partner_discount_bps?[{ id: p.slug + '-rabatt', title: `Bis zu ${(p.partner_discount_bps/100).toFixed(0)} % vertraglicher Kundenvorteil` }]:[])]} /><form action={startMembershipCheckoutAction.bind(null,p.slug)}><EHSubmitButton disabled={current?.status==='active'&&current.plan_slug===p.slug}>{current?.status==='active'&&current.plan_slug===p.slug?'Aktiv':`${p.title} wählen`}</EHSubmitButton></form></EHPanel>)}
    <SectionTitle>Jahres- & Premiumpakete</SectionTitle>{packages.map((p:any)=><EHPanel key={p.slug} title={`${p.title} — ${euro(p.price_amount)}`}><p>{p.description}</p><EHList label={p.title} items={JSON.parse(p.services_json).map((x:string)=>({ id: p.slug + '-' + x.slice(0, 12), title: x }))} /><form action={purchasePackageAction.bind(null,p.slug)}><EHSubmitButton>Paket buchen</EHSubmitButton></form></EHPanel>)}
    {orders.length>0&&<><SectionTitle>Meine Pakete</SectionTitle><EHList label="Meine Pakete" items={orders.map(o=>({ id: String(o.id), title: o.title, text: o.status }))} /></>}
  </AppShell>;
}
