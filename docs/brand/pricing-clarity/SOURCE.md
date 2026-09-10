# Vollständige Quellen

Basis 1005fb5; Host OCI sin-supabase. Keine DB-/Stripe-Migration.

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
SHA256 d82702bf0e3052bcde983e73f7ffcecda7c471975a27c18278ae5227259ca5c1
```tsx
import { CheckCircle2 } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { EHAppHeader, EHPanel, EHList, EHErrorState, EHFormFeedback, EHSubmitButton } from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { purchasePackageAction,startMembershipCheckoutAction } from '@/app/actions';
import { euroExact } from '@/lib/format';

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
    <SectionTitle>Mitgliedschaften</SectionTitle>{plans.map((p)=><EHPanel key={p.slug} title={`${p.title}${p.slug==='plus'?' (empfohlen)':''} — ${euroExact(p.monthly_amount)}/Monat`}><p>{p.description}</p><EHList label={p.title} items={[{ id: p.slug + '-base', title: 'Zentrale Hausorganisation & Hilfe' },{ id: p.slug + '-partner', title: 'Geprüfte Vertragspartner' },{ id: p.slug + '-vergleich', title: 'Angebots- und Preisvergleich' },{ id: p.slug + '-akte', title: 'Digitale Hausakte' },...(p.annual_house_check?[{ id: p.slug + '-check', title: 'Jährlicher Haus-Check' }]:[]),...(p.partner_discount_bps?[{ id: p.slug + '-rabatt', title: `Bis zu ${(p.partner_discount_bps/100).toFixed(0)} % vertraglicher Kundenvorteil` }]:[])]} /><form action={startMembershipCheckoutAction.bind(null,p.slug)}><EHSubmitButton disabled={current?.status==='active'&&current.plan_slug===p.slug}>{current?.status==='active'&&current.plan_slug===p.slug?'Aktiv':`${p.title} wählen`}</EHSubmitButton></form></EHPanel>)}
    <SectionTitle>Jahres- & Premiumpakete</SectionTitle>{packages.map((p:any)=><EHPanel key={p.slug} title={`${p.title} — ${euroExact(p.price_amount)}`}><p>{p.description}</p><EHList label={p.title} items={JSON.parse(p.services_json).map((x:string)=>({ id: p.slug + '-' + x.slice(0, 12), title: x }))} /><form action={purchasePackageAction.bind(null,p.slug)}><EHSubmitButton>Paket buchen</EHSubmitButton></form></EHPanel>)}
    {orders.length>0&&<><SectionTitle>Meine Pakete</SectionTitle><EHList label="Meine Pakete" items={orders.map(o=>({ id: String(o.id), title: o.title, text: o.status }))} /></>}
  </AppShell>;
}

```
