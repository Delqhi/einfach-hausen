import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';
import { HeroHelp } from '@/components/marketing/hero-visuals';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'Hilfe & FAQ', description: 'Antworten zu Anliegen, Ansprechpartnern, Aufträgen, Hausakte, Preisen und Partnern.' };
const faq=[
 ['Löst eine normale Frage automatisch einen Auftrag aus?','Nein. Eine Frage bleibt zunächst eine Frage. Du entscheidest separat, ob du einen Ansprechpartner möchtest oder einen echten Auftrag organisieren lassen willst.'],
 ['Kann ich erst mit einem Menschen sprechen?','Ja. Das Produktmodell sieht ausdrücklich vor, dass ein passender geprüfter Ansprechpartner für Fragen verbunden werden kann, ohne dass daraus automatisch eine Buchung entsteht.'],
 ['Wie werden Partner ausgewählt?','Das Matching soll fachliche Eignung, Region, Qualifikation, Verfügbarkeit, Kapazität, Kundenzufriedenheit und bestehende Beziehungen berücksichtigen. Ein Partner-Tarif darf keine bessere fachliche Platzierung kaufen.'],
 ['Was kostet das Hauskonto?','FREE kostet 0 € pro Monat. PLUS ist mit 19,90 € pro Monat und PREMIUM mit 39,90 € pro Monat definiert.'],
 ['Was ist die digitale Hausakte?','Sie bündelt hausbezogene Daten wie Anlagen, Arbeiten, Dokumente, Wartungen, Termine und Ansprechpartner langfristig an der Immobilie.'],
 ['Was passiert bei einem Eigentümerwechsel?','Hausbezogene Geschichte kann kontrolliert weitergegeben werden. Private alte Nachrichten, Zahlungen und nicht freigegebene Daten sollen nicht automatisch übertragen werden.'],
 ['Nimmt Einfach Hausen Provision vom Partner?','Das definierte Partnermodell sieht 0 % Auftragsprovision vor. Partnerumsatz entsteht über planbare Monatsabos.'],
 ['Sind alle Leistungen überall verfügbar?','Nein. Verfügbarkeit hängt vom regional aktiven, passenden Partnernetzwerk und der jeweiligen Kapazität ab.'],
] as const;
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Hilfe & FAQ" title="Klare Antworten, bevor du etwas beauftragst." text="Hier findest du die wichtigsten Grundlagen zum Ablauf, zur Hausakte und zum Partnernetzwerk." aside={<HeroHelp />} actions={<LinkButton href="/kontakt" secondary>Kontakt aufnehmen</LinkButton>} />
  <Statement kicker="Unser Anspruch" tone="soft">Verständlich bleiben – bei jeder Frage, in jedem Schritt.</Statement>
  <Section eyebrow="Häufige Fragen" title="Was du über Einfach Hausen wissen solltest.">
    <div className={`${styles.faqList} ${styles.faqTwoCol}`}>{faq.map(([q,a])=>(
      <details className={styles.faq} key={q}>
        <summary className={styles.faqSummary}><span>{q}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
        <div className={styles.faqBody}><p>{a}</p></div>
      </details>
    ))}</div>
  </Section>
  <CtaBand title="Deine konkrete Frage ist ein guter Startpunkt." text="Lege kostenlos ein Hauskonto an und beschreibe dein Anliegen in normalen Worten." />
</MarketingShell>}
