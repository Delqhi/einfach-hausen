import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { MotionPresentation } from '@/components/marketing/motion-presentation';
import { CtaBand, Facts, Faq, LinkButton, PageHero, Section, Statement, mkt as styles } from '@/components/marketing/ui';
import { MiniCosts } from '@/components/marketing/app-frames';
import { PriceLedger } from './price-ledger';
import type { LedgerView } from './price-ledger';

export const metadata: Metadata = { title: 'Preise', description: 'Das Hauskonto ist kostenlos. Keine Provision auf Aufträge. Optionale Pakete und Partnertarife transparent im Überblick.' , alternates: { canonical: canonical('/preise') } };

// Preise sind eine Rechnung, kein Schaufenster: eine echte Vergleichstabelle
// pro Zielgruppe statt drei bzw. vier schwebender Preiskarten. Die Leitspalte
// wird über eine getönte Fläche hervorgehoben, nicht über eine größere Karte.
const owner: LedgerView = {
  caption: 'Leistungsumfang der Eigentümer-Tarife FREE, PLUS und PREMIUM im Vergleich',
  plans: [
    { name: 'FREE', price: '0 €', note: 'Für immer kostenlos.', lead: true },
    { name: 'PLUS', price: '19,90 €', note: 'Für Häuser, die laufend gepflegt werden wollen.' },
    { name: 'PREMIUM', price: '39,90 €', note: 'Für alle, die sich um nichts mehr kümmern wollen.' },
  ],
  rows: [
    { label: 'Anliegen beschreiben, wir organisieren', values: [true, true, true] },
    { label: 'Geprüfte Partner und Kostenrahmen vorab', values: [true, true, true] },
    { label: 'Konkreter Ansprechpartner pro Vorgang', values: [true, true, true] },
    { label: 'Digitale Hausakte', values: ['ohne Limit', 'erweitert', 'erweitert'] },
    { label: 'Provision auf den Auftragswert', values: ['0 %', '0 %', '0 %'] },
    { label: 'Automatische Wartungsplanung', values: [false, true, true] },
    { label: 'Hausjahresplan und Erinnerungen', values: [false, true, true] },
    { label: 'Dokumentenverwaltung mit Fristen', values: [false, true, true] },
    { label: 'Servicepriorität', values: ['normal', 'Priorität', 'höchste'] },
    { label: 'Persönliche Betreuung', values: [false, false, true] },
    { label: 'Jährlicher Hauscheck', values: [false, false, true] },
  ],
};

const partner: LedgerView = {
  caption: 'Leistungsumfang der Partnertarife FREE, START, PRO und PREMIUM im Vergleich',
  plans: [
    { name: 'FREE', price: '0 €', note: 'Kostenloser Einstieg.' },
    { name: 'START', price: '29 €' },
    { name: 'PRO', price: '79 €', lead: true },
    { name: 'PREMIUM', price: '199 €' },
  ],
  rows: [
    { label: 'Neue Anfragen pro Monat', values: ['begrenzt', 'laufend', 'laufend', 'laufend'] },
    { label: 'Auftragsprovision', values: ['0 %', '0 %', '0 %', '0 %'] },
    { label: 'Kostenlose Testphase', values: [false, '2 Monate', '2 Monate', '2 Monate'] },
    { label: 'Arbeitsbereich mit Terminen und Rechnung', values: [true, true, true, true] },
    { label: 'Mehrere Ansprechpartner im Firmenkonto', values: [false, true, true, true] },
    { label: 'Einfluss auf die Matching-Position', values: ['keiner', 'keiner', 'keiner', 'keiner'] },
  ],
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Preise"
        title="Kostenlos starten. Zahlen nur, wenn du mehr willst."
        text="Das Hauskonto kostet 0 € und bleibt es. Aufträge rechnest du direkt mit dem Partnerbetrieb ab, ohne Provision an uns. Bezahlte Pakete sind eine bewusste Zusatzentscheidung für mehr Komfort."
        actions={<><LinkButton href="/register?role=homeowner">Hauskonto kostenlos anlegen</LinkButton><LinkButton href="/register?role=provider" secondary>Als Partner starten</LinkButton></>}
        aside={<MiniCosts />}
      />
      <MotionPresentation presentationId="preise" title="Kosten sehen, bevor du entscheidest." />

      <Section tone="surface" eyebrow="Tarife" title="Eigentümer oder Betrieb?" text="Alle Beträge pro Monat, jederzeit kündbar. Kein Auftrag entsteht automatisch, und kein Tarif kauft eine bessere Matching-Position.">
        <PriceLedger owner={owner} partner={partner} />
        <p className={styles.note}><strong>Pilotphase:</strong> Die ersten 1.000 Haushalte erhalten 15 % Dauer-Vorteil auf alle bezahlten Pakete, automatisch im Konto angewendet. <a href="/pilotphase">Bedingungen</a></p>
      </Section>

      <Statement kicker="Unser Preisprinzip">Keine versteckten Kosten. <mark>Keine Provision auf dein Handwerk.</mark></Statement>

      <Section tone="soft" eyebrow="Klar gerechnet" title="Was du nie zahlst." tight>
        <Facts items={[
          { value: '0 €', label: 'für das Hauskonto, dauerhaft' },
          { value: '0 €', label: 'für Beschreiben, Einordnen und Vorschlag' },
          { value: '0 %', label: 'Provision auf den Auftragswert' },
          { value: '0', label: 'Verkäufe deiner Anfrage an Dritte' },
        ]} />
      </Section>

      <Section eyebrow="Häufige Fragen" title="Zu den Preisen." center>
        <div className={styles.centerRow}>
          <Faq items={[
            { q: 'Wie verdient Einfach Hausen dann Geld?', a: 'Über optionale Komfort-Pakete für Eigentümer und planbare Monatstarife für Partnerbetriebe. Nicht über Provisionen und nicht über den Verkauf deiner Anfrage. So bleiben unsere Interessen bei deinem Haus, nicht bei möglichst vielen Aufträgen.' },
            { q: 'Was kostet ein Auftrag?', a: 'Das, was der Partnerbetrieb mit dir vereinbart. Du siehst vorher einen Kostenrahmen und gibst erst dann frei. Die Rechnung kommt direkt vom Betrieb.' },
            { q: 'Kann ich PLUS oder PREMIUM jederzeit kündigen?', a: 'Ja, monatlich. Deine Hausakte und alle Vorgänge bleiben dabei vollständig im kostenlosen FREE-Konto erhalten.' },
            { q: 'Bekommen zahlende Partner bessere Aufträge?', a: 'Nein. Beim Matching zählen fachliche Eignung, Region, Verfügbarkeit und Zufriedenheit. Ein Tarif kauft keine Position.' },
          ]} />
        </div>
      </Section>

      <CtaBand title="Kostenlos starten und später entscheiden." text="Das FREE-Hauskonto kostet 0 € pro Monat. Alles Weitere ist optional." />
    </MarketingShell>
  );
}
