import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { CircleAlert, ShieldCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { MiniContact } from '@/components/marketing/app-frames';
import { mkt as styles } from '@/components/marketing/ui';
import { EHScope, EHSection, EHPageHero, EHServiceIndex, EHProse, EHPanel, EHCallout, EHClosing, EHActions, EHButton, EHText, EHTextLink } from '@/design-system';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Der richtige Weg für dein Anliegen: Hausanliegen starten, bestehenden Vorgang öffnen, Partnerfragen, Datenschutz.',
  alternates: { canonical: canonical('/kontakt') },
};

const ROUTES = [
  { title: 'Neues Anliegen starten', text: 'Beschreibe kurz, was ansteht. Wir finden die passenden Partner vor Ort.', href: '/register?role=homeowner', label: 'Anliegen starten' },
  { title: 'Bestehender Vorgang', text: 'Ansprechpartner, Angebote, Termine und Dokumente im Hauskonto einsehen.', href: '/login', label: 'Zum Login' },
  { title: 'Fragen & Antworten', text: 'Kosten, Hausakte und Sicherheit detailliert im Hilfebereich nachlesen.', href: '/hilfe', label: 'Hilfe & FAQ öffnen' },
  { title: 'Für Handwerksbetriebe', text: 'Informationen für Partnerbetriebe, Konditionen und Partner-Registrierung.', href: '/partner', label: 'Partnerbereich' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <EHScope>
        <EHPageHero
          eyebrow="Kontakt & Support"
          title="Sag uns, worum es geht. Wir leiten dich direkt an die richtige Stelle."
          text="Hausanliegen, laufende Reparaturen und Partneranfragen bleiben dort gebündelt, wo der Kontext liegt. Kein Anliegen verliert den Faden."
          media={<MiniContact />}
        />

        <EHSection compact>
          <EHServiceIndex items={ROUTES.map(({ title, text, href, label }) => ({ title, text, href, label }))} />
        </EHSection>

        <EHSection compact>
          <EHProse>
            <p><strong>Unser Grundsatz.</strong> Kein Anliegen verliert seinen Kontext. <mark>Kein Kontakt läuft ins Leere.</mark></p>
          </EHProse>
        </EHSection>

        <EHSection compact>
          <EHPanel title="Offizieller Kontakt für rechtliche und vertrauliche Anliegen.">
            <EHText>Für Datenschutzanfragen, rechtliche Mitteilungen oder Sicherheitsmeldungen stehen verifizierte Kanäle im Impressum und in der Datenschutzerklärung zur Verfügung. Plattformanfragen werden strukturiert über dein verifiziertes Nutzerkonto abgewickelt.</EHText>
            <EHActions>
              <EHButton href="/datenschutz" variant="secondary">Datenschutzerklärung</EHButton>
              <EHButton href="/sicherheit" variant="secondary">Sicherheitsprinzipien</EHButton>
              <EHButton href="/impressum" variant="secondary">Impressum</EHButton>
            </EHActions>
            <EHText size="meta">Weiterführend: <EHTextLink href="/datenschutz">Datenschutz</EHTextLink>, <EHTextLink href="/hilfe">Hilfe & FAQ</EHTextLink>.</EHText>
          </EHPanel>
        </EHSection>

        <EHSection compact>
          <EHCallout title="Einfach Hausen ersetzt keinen behördlichen Notruf.">
            <EHText>Bei Rohrbruch oder Heizungsausfall im Winter steht dir in deinem Hauskonto der direkte Notfall-Modus zur Verfügung.</EHText>
          </EHCallout>
          {/* Ausnahme 05-WEB-01: 112-Warnpanel bleibt im Bestand (panelWarn), kein Rezept vorhanden. Inhalt unverändert. */}
          <div className={styles.cardGrid} data-cols="2">
            <div className={styles.panelWarn}>
              <strong className={styles.panelTitleWarn}><CircleAlert size={20} /> Akute Gefahr für Leib &amp; Leben</strong>
              <p className={styles.panelText}>Bei Feuer, Gasgeruch, Einbruch oder akuter Einsturzgefahr wähle immer umgehend die 112 bzw. 110.</p>
            </div>
            <div className={styles.panel}>
              <strong className={styles.panelTitleAccent}><ShieldCheck size={20} /> Dringende Hausschäden</strong>
              <p className={styles.panelText}>Bei Rohrbruch oder Heizungsausfall im Winter steht dir in deinem Hauskonto der direkte Notfall-Modus zur Verfügung.</p>
            </div>
          </div>
        </EHSection>

        <EHClosing title="Brauchst du Hilfe bei deinem Eigenheim?" text="Kostenlos anmelden und direkt mit dem Hausmeister-Assistenten starten." href="/register?role=homeowner" label="Anliegen starten" />
      </EHScope>
    </MarketingShell>
  );
}
