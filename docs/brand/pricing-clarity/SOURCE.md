# Vollständige Quellen – aktualisierter PR86-Head

Host OCI sin-supabase. Keine DB-/Stripe-Migration.

## src/app/preise/page.tsx
SHA256 c9ea47cfe80b6526b7d442da9bc95d4a898086a6d97d58fcf0b554419018b2ab
```tsx
import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { db } from '@/lib/db';
import { euroExact } from '@/lib/format';
import { MarketingShell } from '@/components/marketing/site-shell';
import { EHScope, EHSection, EHPageHero, EHFAQ, EHClosing, EHButton, EHText, EHRecordCover, EHPricing, EHSectionHeading, EHPromiseRow, EHComparison, EHActions } from '@/design-system';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Preise – dein Hauskonto und optionale Betreuung',
  description: 'Kostenloses Hauskonto, optionale Mitgliedschaften und transparente Betriebstarife. Handwerkerleistungen werden separat vereinbart.',
  alternates: { canonical: canonical('/preise') },
};

type Plan = { slug: string; title: string; monthly_amount: number };
type PartnerPlan = Plan & { monthly_lead_limit: number | null; trial_days: number };

export default function Page() {
  const owner = db.prepare('SELECT slug,title,monthly_amount FROM membership_plans WHERE active=1 ORDER BY monthly_amount').all() as Plan[];
  const partner = db.prepare('SELECT slug,title,monthly_amount,monthly_lead_limit,trial_days FROM partner_plans WHERE active=1 ORDER BY monthly_amount').all() as PartnerPlan[];
  const ownerCopy: Record<string, { text: string; features: string[] }> = {
    free: { text: 'Dein Einstieg: Hauswissen sammeln und Hilfe organisieren.', features: ['Digitale Hausakte und Dokumente', 'Wartungen und Jahresübersicht', 'Anliegen beschreiben und Angebote prüfen', 'KI-Nutzung im verfügbaren Kontingent'] },
    plus: { text: 'Für zusätzliche Unterstützung bei der Organisation deines Hauses.', features: ['Alles aus dem kostenlosen Hauskonto', 'Zusätzlicher Organisations- und Prioritätsservice', 'Leistungsumfang vor Abschluss gemeinsam klären', 'Handwerkerleistungen separat vereinbaren'] },
    premium: { text: 'Für persönliche Begleitung und einen geplanten Hauscheck.', features: ['Alles aus dem kostenlosen Hauskonto', 'Persönliche Betreuung im vereinbarten Umfang', 'Jährlicher Hauscheck laut Tarif', 'Umfang und Durchführung vor Abschluss klären'] },
  };
  return <MarketingShell><EHScope>
    <EHPageHero eyebrow="Einfachhausen · Preise" title="Dein Haus. Dein Tempo. Dein Tarif."
      text="Beginne mit einem kostenlosen Hauskonto. Wenn du mehr Unterstützung möchtest, wählst du sie bewusst dazu. Die Arbeit am Haus vereinbarst du separat mit dem Betrieb."
      actions={<><EHButton href="#hauskonto" arrow>Tarife für mein Haus</EHButton><EHButton href="#betriebe" variant="secondary">Ich bin Partnerbetrieb</EHButton></>}
      media={<EHRecordCover eyebrow="Der Anfang ist einfach" title="0 € fürs Hauskonto." subtitle="Unterlagen, Wartungen und deine Anliegen an einem Ort." number="01">
        <EHText>Kein kostenpflichtiges Abo für den Einstieg. Keine Auftragsprovision an Einfachhausen.</EHText>
      </EHRecordCover>} />
    <EHSection compact id="hauskonto">
      <EHSectionHeading eyebrow="Für dein Zuhause" title="Erst Überblick. Dann mehr Unterstützung."
        text="Das kostenlose Hauskonto ist ein eigenständiger Einstieg. Ein bezahlter Tarif ergänzt die Betreuung – er ersetzt nicht die Rechnung des Handwerksbetriebs." />
      <EHPricing plans={owner.map(plan => ({
        name: plan.title, price: euroExact(plan.monthly_amount), period: ' / Monat',
        text: ownerCopy[plan.slug]?.text || 'Den konkreten Leistungsumfang besprechen wir vor dem Abschluss.',
        features: ownerCopy[plan.slug]?.features || ['Leistungsumfang vor Abschluss klären'],
        href: plan.monthly_amount === 0 ? '/register?role=homeowner' : '/kontakt',
        action: plan.monthly_amount === 0 ? 'Kostenloses Hauskonto anlegen' : plan.title + ' besprechen',
      }))} note="Bestehende Tarife im Überblick. Persönliche Betreuung und Hauscheck haben einen vereinbarten Umfang; Reparaturen, Material und zusätzliche Arbeiten sind nicht pauschal enthalten." />
      <EHText size="meta">Pilotphase: Für berechtigte Haushalte wird der bestehende 15-%-Vorteil im Konto berücksichtigt. <a href="/pilotphase">Zu den Bedingungen</a>.</EHText>
      <EHActions><EHButton href="/app/plans" variant="secondary">Meine Mitgliedschaft im Konto ansehen</EHButton></EHActions>
    </EHSection>
    <EHSection tone="white">
      <EHSectionHeading eyebrow="Zwei klare Vereinbarungen" title="Hausorganisation und Handwerk. Sauber getrennt."
        text="Du sollst vor deiner Entscheidung wissen, wofür du zahlst." />
      <EHComparison left={{ title: 'Dein Einfachhausen-Tarif', items: [
        'Das Hauskonto beginnt kostenlos.',
        'Zusätzliche Betreuung ist eine eigene, bewusste Entscheidung.',
        'Umfang, Laufzeit und Preis vor dem Abschluss prüfen.',
      ] }} right={{ title: 'Dein Auftrag beim Betrieb', items: [
        'Leistung und Preis vereinbarst du mit dem ausführenden Betrieb.',
        'Arbeit, Material und Anfahrt richten sich nach dem Angebot.',
        'Einfachhausen erhebt keine Provision auf den Auftragswert.',
      ] }} />
    </EHSection>
    <EHSection tone="deep">
      <EHSectionHeading eyebrow="Unser Preisprinzip" title="Du bezahlst für Unterstützung. Nicht für Druck." />
      <EHPromiseRow items={[
        { title: 'Deine Entscheidung zählt.', text: 'Eine Frage ist noch kein Auftrag. Du entscheidest über den nächsten Schritt.' },
        { title: 'Deine Hausakte bleibt der Anfang.', text: 'Du kannst kostenlos starten und später entscheiden, ob zusätzliche Betreuung sinnvoll ist.' },
        { title: 'Eignung vor Tarif.', text: 'Ein zahlender Partner kauft keine bessere Position im Qualitätsmatching.' },
      ]} />
    </EHSection>
    <EHSection id="betriebe">
      <EHSectionHeading eyebrow="Für Partnerbetriebe" title="Ein Arbeitsbereich. Ein planbarer Tarif."
        text="Wähle den Umfang für deinen Betrieb. Die Tarifgrenze für neue Anfragen ist keine Zusage über tatsächlich eingehende Aufträge." />
      <EHPricing plans={partner.map(plan => ({
        name: plan.title, price: euroExact(plan.monthly_amount), period: ' / Monat',
        text: plan.monthly_amount === 0 ? 'Den Partnerbereich kennenlernen.' : 'Für die Zusammenarbeit mit Kunden und deinem Betrieb.',
        features: [
          plan.monthly_lead_limit === null ? 'Keine tarifliche Monatsgrenze für neue Anfragen' : 'Bis zu ' + plan.monthly_lead_limit + ' neue Anfragen pro Monat',
          '0 % Auftragsprovision an Einfachhausen',
          'Tarifneutrales Qualitätsmatching',
          ...(plan.trial_days > 0 ? [plan.trial_days + ' Tage Testphase laut Tarif'] : []),
        ],
        href: plan.monthly_amount === 0 ? '/register?role=provider' : '/kontakt',
        action: plan.monthly_amount === 0 ? 'Als Betrieb starten' : plan.title + ' besprechen',
      }))} note="Betriebstarife getrennt von den Eigentümer-Mitgliedschaften. Konkrete Funktionen, Abrechnung und Bedingungen vor Abschluss prüfen." />
    </EHSection>
    <EHSection tone="white">
      <EHSectionHeading eyebrow="Vor deiner Entscheidung" title="Die wichtigen Fragen. Klar beantwortet." />
      <EHFAQ items={[
        { q: 'Brauche ich ein Abo, um Hilfe anzufragen?', a: 'Nein. Du kannst mit dem kostenlosen Hauskonto beginnen, dein Anliegen beschreiben und passende Angebote prüfen. KI-Funktionen richten sich nach dem verfügbaren Kontingent.' },
        { q: 'Sind Reparaturen im Monatspreis enthalten?', a: 'Nein. Die Mitgliedschaft ist kein Reparatur-Flatrate-Vertrag. Handwerkerleistungen, Material und zusätzliche Arbeiten werden gesondert vereinbart.' },
        { q: 'Welcher Tarif passt zu mir?', a: 'Beginne kostenlos, wenn du Unterlagen sammeln und Anliegen organisieren möchtest. Für zusätzliche Betreuung besprechen wir zunächst deinen Bedarf und den konkreten Leistungsumfang.' },
        { q: 'Bekomme ich als zahlender Betrieb garantiert Aufträge?', a: 'Nein. Tarifgrenzen regeln das mögliche Anfragevolumen. Ob Anfragen passen, hängt unter anderem von Region, Leistung, Verfügbarkeit und Qualität ab.' },
        { q: 'Wie verdient Einfachhausen Geld?', a: 'Über optionale Mitgliedschaften und Betriebstarife. Auf den vereinbarten Handwerker-Auftragswert erheben wir keine Provision.' },
      ]} />
    </EHSection>
    <EHClosing title="Ein gutes Zuhause beginnt mit Überblick." text="Starte mit deiner Hausakte. Zusätzliche Unterstützung entscheidest du später." href="/register?role=homeowner" label="Kostenloses Hauskonto anlegen" secondary={<EHButton href="/kontakt" variant="secondary">Eine Frage zu den Tarifen stellen</EHButton>} />
  </EHScope></MarketingShell>;
}

```

## src/app/app/plans/page.tsx
SHA256 48fff1c4694dcb35782d2a8a01fde0567740af72149c7813fd79a30473b18e9a
```tsx
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

```
