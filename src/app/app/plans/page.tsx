import { AppShell } from '@/components/shell';
import { EHAppHeader, EHPanel, EHList, EHErrorState, EHFormFeedback, EHSubmitButton, EHWorkSection, EHWorkspaceGrid, EHText, EHButton, EHStatus, EHEmptyState, EHCheckbox } from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { purchasePackageAction, startMembershipCheckoutAction } from '@/app/actions';
import { euroExact, statusLabel } from '@/lib/format';

type Plan = { slug: string; title: string; monthly_amount: number; description: string; annual_house_check: number };
type Package = { slug: string; title: string; price_amount: number; description: string; services_json: string };
type Subscription = { plan_slug: string; title: string; status: string; stripe_subscription_id: string | null };

export default async function Plans({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await requireUser('homeowner');
  const sp = await searchParams;
  const pilot = db.prepare('SELECT discount_bps FROM pilot_cohort WHERE user_id=?').get(user.id) as { discount_bps: number } | undefined;
  const plans = db.prepare('SELECT * FROM membership_plans WHERE active=1 ORDER BY monthly_amount').all() as Plan[];
  const packages = db.prepare('SELECT * FROM service_packages WHERE active=1 ORDER BY price_amount').all() as Package[];
  const current = db.prepare('SELECT s.*,p.title FROM subscriptions s JOIN membership_plans p ON p.slug=s.plan_slug WHERE s.homeowner_id=?').get(user.id) as Subscription | undefined;
  const orders = db.prepare('SELECT o.*,p.title FROM package_orders o JOIN service_packages p ON p.slug=o.package_slug WHERE o.homeowner_id=? ORDER BY o.created_at DESC').all(user.id) as { id: number; title: string; status: string }[];
  const price = (amount: number) => pilot ? Math.max(0, Math.round(amount * (10000 - pilot.discount_bps) / 10000)) : amount;
  const stateText: Record<string, string> = {
    active: 'Deine Mitgliedschaft ist aktiv.',
    pending: 'Die Aktivierung ist noch nicht bestätigt. Bitte starte nicht mehrfach denselben Abschluss.',
    past_due: 'Für deine Mitgliedschaft ist eine Zahlung offen. Kläre den Zahlungsstatus, bevor du einen neuen Tarif abschließt.',
    cancelled: 'Deine Mitgliedschaft ist gekündigt. Du kannst dein Hauskonto weiterhin nutzen.',
  };
  const stateLabel: Record<string, string> = { active: 'Aktiv', pending: 'Bestätigung ausstehend', past_due: 'Zahlung offen', cancelled: 'Gekündigt' };

  return <AppShell role="homeowner" active="/app/plans" title="Tarif & Pakete" subtitle="Mitgliedschaft und einzelne Leistungen">
    <EHAppHeader eyebrow="Dein Hauskonto" title="Tarif & Pakete" text="Sieh deinen aktuellen Status, vergleiche Mitgliedschaften und wähle zusätzliche Leistungen bewusst aus." actions={<EHButton href="/preise" variant="secondary">Öffentliche Tarifübersicht</EHButton>} />
    {sp.error && <EHErrorState text={sp.error} />}
    {(sp.checkout === 'success' || sp.checkout === 'processing') && <EHFormFeedback kind="info">Du bist vom Abschluss zurückgekehrt. Entscheidend ist der bestätigte Status deiner Mitgliedschaft oder Paketbuchung unten; die Rückkehr allein bestätigt keine Zahlung.</EHFormFeedback>}
    {sp.checkout === 'cancelled' && <EHFormFeedback kind="info">Der Bezahlvorgang wurde abgebrochen. Prüfe unten deinen aktuellen Status, bevor du erneut startest.</EHFormFeedback>}
    {sp.checkout === 'unavailable' && <EHErrorState text="Onlinezahlung ist gerade nicht verfügbar. Bitte versuche es später erneut." />}
    {sp.switch === 'done' && <EHFormFeedback kind="success">Deine bezahlte Mitgliedschaft wurde beendet und der Wechsel auf Free bestätigt. Dein Hauskonto bleibt kostenlos nutzbar.</EHFormFeedback>}

    <EHWorkspaceGrid main={<EHPanel title={current ? current.title : 'Dein kostenloses Hauskonto'} label="Aktueller Stand">
      <EHStatus tone={current?.status === 'past_due' ? 'warning' : current?.status === 'active' ? 'success' : 'neutral'}>{current ? stateLabel[current.status] || 'Status prüfen' : 'Ohne bezahlte Mitgliedschaft'}</EHStatus>
      <EHText>{current ? stateText[current.status] || 'Bitte lass den Mitgliedschaftsstatus prüfen.' : 'Du brauchst kein kostenpflichtiges Abo, um mit deinem Hauskonto zu beginnen.'}</EHText>
      {current?.status === 'past_due' && <EHButton href="/kontakt">Zahlungsstatus klären</EHButton>}
    </EHPanel>} aside={<EHPanel title={pilot ? 'Dein Pilot-Vorteil' : 'Vor deiner Entscheidung'}>
      <EHText>{pilot ? `Dein hinterlegter Vorteil von ${(pilot.discount_bps / 100).toLocaleString('de-DE')} % ist in den unten angezeigten Preisen bereits berücksichtigt.` : 'Mitgliedschaften werden monatlich abgerechnet. Einzelpakete haben einen eigenen Preis und Leistungsumfang.'}</EHText>
      <EHText>Arbeit, Material und zusätzliche Handwerkerleistungen sind nicht automatisch enthalten.</EHText>
      <EHButton href="/kontakt" variant="secondary">Leistungsumfang klären</EHButton>
    </EHPanel>} />

    <EHWorkSection title="Monatliche Mitgliedschaften">
      <EHText>Ein Tarifwechsel ist eine bewusste Entscheidung. Prüfe den Leistungsumfang vor dem Abschluss.</EHText>
      {plans.length === 0 && <EHEmptyState title="Gerade keine Tarife auswählbar" text="Dein aktueller Status bleibt oben sichtbar. Bitte versuche es später erneut." />}
      {plans.map(plan => {
        const active = current?.status === 'active' && current.plan_slug === plan.slug;
        const downgrading = plan.monthly_amount === 0 && Boolean(current?.stripe_subscription_id);
        return <EHPanel key={plan.slug} title={plan.title} label={active ? 'Dein aktueller Tarif' : 'Monatliche Mitgliedschaft'}>
          <EHText size="lead"><strong>{euroExact(price(plan.monthly_amount))} / Monat</strong></EHText>
          {pilot && plan.monthly_amount > 0 && <EHText size="meta">Regulär {euroExact(plan.monthly_amount)} / Monat · dein Pilot-Vorteil ist enthalten.</EHText>}
          <EHText>{plan.description}</EHText>
          {Boolean(plan.annual_house_check) && <EHText>Hauscheck: Durchführung und konkreten Umfang vor Abschluss klären.</EHText>}
          <form action={startMembershipCheckoutAction.bind(null, plan.slug)}>
            {downgrading && <EHCheckbox name="confirmFreeSwitch" required label="Ich möchte meine bestehende bezahlte Mitgliedschaft beenden und auf Free wechseln." />}
            <EHSubmitButton disabled={active} pendingLabel="Wird geöffnet …">{active ? 'Aktueller Tarif' : downgrading ? 'Auf Free wechseln' : plan.monthly_amount === 0 ? 'Free aktivieren' : plan.title + ' · zum Abschluss'}</EHSubmitButton>
          </form>
        </EHPanel>;
      })}
    </EHWorkSection>

    <EHWorkSection title="Einzelpakete">
      <EHText>Diese Pakete werden separat gebucht. Der angezeigte Paketpreis ist eine einmalige Zahlung; der Leistungszeitraum richtet sich nach dem Paket.</EHText>
      {packages.length === 0 && <EHEmptyState title="Derzeit keine Einzelpakete" text="Bei einem konkreten Anliegen hilft dir dein Hausmeister weiter." />}
      {packages.map(pkg => {
        let services: string[] = [];
        try { const parsed: unknown = JSON.parse(pkg.services_json); if (Array.isArray(parsed)) services = parsed.filter((item): item is string => typeof item === 'string'); } catch {}
        return <EHPanel key={pkg.slug} title={pkg.title} label="Einmalige Zahlung">
          <EHText size="lead"><strong>{euroExact(price(pkg.price_amount))} einmalig</strong></EHText>
          {pilot && pkg.price_amount > 0 && <EHText size="meta">Regulär {euroExact(pkg.price_amount)} · dein Pilot-Vorteil ist enthalten.</EHText>}
          <EHText>{pkg.description}</EHText>
          {services.length > 0 && <EHList label={pkg.title + ' – Umfang'} items={services.map((title, index) => ({ id: pkg.slug + '-' + index, title }))} />}
          <form action={purchasePackageAction.bind(null, pkg.slug)}><EHSubmitButton pendingLabel="Wird geöffnet …">Paket · zum Abschluss</EHSubmitButton></form>
        </EHPanel>;
      })}
    </EHWorkSection>
    <EHWorkSection title="Deine Paketbuchungen">
      {orders.length > 0 ? <EHList label="Gebuchte Pakete" items={orders.map(order => ({ id: String(order.id), title: order.title, text: statusLabel(order.status) }))} /> : <EHEmptyState title="Noch keine Pakete gebucht" text="Nach einer Buchung siehst du hier den gespeicherten Status." />}
    </EHWorkSection>
  </AppShell>;
}
