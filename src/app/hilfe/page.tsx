import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';
import { MiniContact } from '@/components/marketing/app-frames';
import { FaqExplorer } from './faq-explorer';

export const metadata: Metadata = { title: 'Hilfe & FAQ', description: 'Antworten zu Ablauf, Kosten, Ansprechpartnern, Hausakte und Partnern. Ehrlich und ohne Kleingedrucktes.' , alternates: { canonical: canonical('/hilfe') } };

const faq = [
  { q: 'Löst eine normale Frage automatisch einen Auftrag aus?', a: 'Nein. Eine Frage bleibt eine Frage. Du entscheidest separat, ob du einen Ansprechpartner sprechen oder einen Auftrag organisieren lassen willst.', cat: 'Ablauf' },
  { q: 'Kann ich erst mit einem Menschen sprechen?', a: 'Ja. Ein passender geprüfter Ansprechpartner kann für Fragen verbunden werden, ohne dass daraus eine Buchung entsteht.', cat: 'Ablauf' },
  { q: 'Wie schnell meldet sich jemand?', a: 'In der Pilotphase bekommst du in der Regel innerhalb eines Werktags einen Vorschlag mit Partner und Kostenrahmen. Dringende Fälle kennzeichnest du beim Beschreiben.', cat: 'Ablauf' },
  { q: 'Sind alle Leistungen überall verfügbar?', a: 'Nein. Verfügbarkeit hängt vom regional aktiven Partnernetz und dessen Kapazität ab. Nach der Registrierung siehst du, was in deiner Region möglich ist.', cat: 'Ablauf' },
  { q: 'Was kostet das Hauskonto?', a: 'FREE kostet 0 € pro Monat, dauerhaft. PLUS kostet 19,90 € und PREMIUM 39,90 € pro Monat, beide monatlich kündbar und optional.', cat: 'Kosten' },
  { q: 'Was kostet ein Auftrag?', a: 'Das, was du mit dem Partnerbetrieb vereinbarst. Du siehst vorher einen Kostenrahmen und gibst erst dann frei. Einfach Hausen nimmt keine Provision.', cat: 'Kosten' },
  { q: 'Was ist der Pilot-Vorteil?', a: 'Die ersten 1.000 Haushalte erhalten 15 % Dauer-Vorteil auf alle bezahlten Pakete, solange ihr Konto besteht. Das FREE-Konto bleibt davon unberührt kostenlos.', cat: 'Kosten' },
  { q: 'Wie werden Partner ausgewählt?', a: 'Nach fachlicher Eignung, Region, Qualifikation, Verfügbarkeit, Kapazität, Kundenzufriedenheit und bestehenden Beziehungen. Ein Partner-Tarif kauft keine bessere Platzierung.', cat: 'Partner' },
  { q: 'Nimmt Einfach Hausen Provision vom Partner?', a: 'Nein. 0 % Auftragsprovision. Partnerumsatz entsteht über planbare Monatstarife.', cat: 'Partner' },
  { q: 'Kann ich einen vorgeschlagenen Partner ablehnen?', a: 'Ja, jederzeit und ohne Begründung. Dann schlagen wir einen anderen vor, sofern in deiner Region verfügbar.', cat: 'Partner' },
  { q: 'Was ist die digitale Hausakte?', a: 'Sie bündelt Anlagen, Arbeiten, Dokumente, Garantien, Wartungen und Ansprechpartner langfristig an deinem Haus. Nach jedem Vorgang füllt sie sich automatisch.', cat: 'Hausakte' },
  { q: 'Was passiert bei einem Eigentümerwechsel?', a: 'Hausbezogene Geschichte kann kontrolliert weitergegeben werden. Private Nachrichten, Zahlungen und nicht freigegebene Daten werden nicht übertragen.', cat: 'Hausakte' },
  { q: 'Wem gehören meine Daten?', a: 'Dir. Du kannst die Hausakte exportieren und dein Konto jederzeit löschen. Wir verkaufen keine Daten und geben nichts ohne deine Freigabe weiter.', cat: 'Hausakte' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Hilfe & FAQ"
        title="Klare Antworten, bevor du irgendetwas beauftragst."
        text="Ablauf, Kosten, Partner, Hausakte. Wenn deine Frage fehlt, beschreib sie einfach als Anliegen. Auch eine Frage ist ein guter Start."
        actions={<><LinkButton href="/#anliegen">Frage als Anliegen stellen</LinkButton><LinkButton href="/kontakt" secondary>Kontaktwege</LinkButton></>}
        aside={<MiniContact />}
      />
      <Section tone="surface" eyebrow="Häufige Fragen" title="Was du über Einfach Hausen wissen solltest.">
        <FaqExplorer entries={faq} />
      </Section>
      <Statement kicker="Unser Anspruch">Verständlich bleiben. <mark>Bei jeder Frage, in jedem Schritt.</mark></Statement>
      <CtaBand title="Deine konkrete Frage ist ein guter Startpunkt." text="Leg kostenlos ein Hauskonto an und beschreib dein Anliegen in normalen Worten. Ein Auftrag entsteht daraus nur, wenn du es willst." />
    </MarketingShell>
  );
}
