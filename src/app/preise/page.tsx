import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, Facts, Faq, LinkButton, PageHero, Section, Statement, mkt as styles } from '@/components/marketing/ui';
import { MiniCosts } from '@/components/marketing/app-frames';
import { PriceToggle } from './price-toggle';

export const metadata: Metadata = { title: 'Preise', description: 'Das Hauskonto ist kostenlos. Keine Provision auf Aufträge. Optionale Pakete und Partnertarife transparent im Überblick.' , alternates: { canonical: canonical('/preise') } };

const customer = [
  { name: 'FREE', price: '0 €', tag: 'Für immer kostenlos', text: 'Alles, was du brauchst, um dein Haus zu organisieren.', items: ['Anliegen beschreiben, wir organisieren', 'Geprüfte Partner und Kostenrahmen vorab', 'Konkreter Ansprechpartner pro Vorgang', 'Digitale Hausakte ohne Limit'] },
  { name: 'PLUS', price: '19,90 €', text: 'Für Häuser, die laufend gepflegt werden wollen.', items: ['Automatische Wartungsplanung', 'Hausjahresplan und Erinnerungen', 'Dokumentenverwaltung mit Fristen', 'Erweiterte Hausakte', 'Prioritätsservice'] },
  { name: 'PREMIUM', price: '39,90 €', text: 'Für alle, die sich um nichts mehr kümmern wollen.', items: ['Persönliche Betreuung', 'Höchste Servicepriorität', 'Jährlicher Hauscheck', 'Automatische Wartungsorganisation', 'Erweiterter Premium-Service'] },
] as const;

const partner = [
  { name: 'FREE', price: '0 €', text: 'Kostenloser Einstieg mit begrenzter Anzahl neuer Anfragen.' },
  { name: 'START', price: '29 €', text: 'Planbarer Monatstarif für aktive Partner.' },
  { name: 'PRO', price: '79 €', text: 'Erweiterter Monatstarif für aktive Partner.' },
  { name: 'PREMIUM', price: '199 €', text: 'Höchster definierter Partner-Monatstarif.' },
] as const;

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

      <Section tone="surface" eyebrow="Tarife" title="Eigentümer oder Betrieb?" text="Alle Beträge pro Monat, jederzeit kündbar. Kein Auftrag entsteht automatisch, und kein Tarif kauft eine bessere Matching-Position.">
        <PriceToggle customer={customer} partner={partner} />
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
