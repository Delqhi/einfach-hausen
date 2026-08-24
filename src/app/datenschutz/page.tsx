import type { Metadata } from 'next';
import { Cookie, Eye, FileLock2, Hand, ShieldCheck, UserRound } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, FeatureGrid, InfoPanel, LegalNotice, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzprinzipien, Datenkategorien und Veröffentlichungsstatus von Einfach Hausen.',
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Rechtliches"
        title="Datenschutz"
        text="Hier erklären wir bereits nachvollziehbar, welche Arten von Daten die Plattform verarbeitet und welche Schutzprinzipien gelten. Die rechtsverbindliche Datenschutzerklärung folgt erst nach Verifizierung des tatsächlichen Betreibers und der finalen Produktionsdatenflüsse."
      />

      <Section eyebrow="Stand" title="Transparente Struktur statt vorgetäuschter Rechtsvollständigkeit.">
        <LegalNotice title="Launch-Blocker: finale Datenschutzerklärung ist noch nicht rechtlich freigegeben">
          <p>
            Betreiber- und Datenschutzkontakt, endgültige Rechtsgrundlagen, produktive Empfänger und Auftragsverarbeiter, Drittlandtransfers, Speicherfristen sowie der konkrete Prozess für Betroffenenanfragen müssen vor öffentlichem Launch anhand der realen Produktion bestätigt werden. Diese Seite ersetzt diese Freigabe nicht.
          </p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Datenkategorien" title="Welche Informationen im Produkt vorkommen können" tone="soft">
        <FeatureGrid items={[
          { icon: <UserRound size={20} />, title: 'Konto & Kontakt', text: 'Anmelde-, Profil- und Kontaktdaten, die für Konto, Erreichbarkeit und Rollen benötigt werden.' },
          { icon: <FileLock2 size={20} />, title: 'Haus & Vorgänge', text: 'Hausakte, Anlagen, Wartungen, Anliegen, Aufträge, Termine, Dokumente und freiwillig hochgeladene Medien.' },
          { icon: <Hand size={20} />, title: 'Kommunikation & Freigaben', text: 'Nachrichten, Kontaktwünsche, ausdrückliche Freigaben und Widerrufe für bestimmte Empfänger und Zwecke.' },
          { icon: <ShieldCheck size={20} />, title: 'Abrechnung & Sicherheit', text: 'Rechnungs- und Zahlungsmetadaten sowie technische Sicherheits-, Sitzungs- und Auditinformationen.' },
        ]} />
      </Section>

      <Section eyebrow="Zwecke" title="Wofür die Plattform Daten technisch nutzt">
        <BulletList items={[
          'Konto bereitstellen, Anmeldung absichern und gewählte Einstellungen speichern.',
          'Hausanliegen verstehen, Rückfragen stellen und auf bewusste Entscheidung hin Kontakt oder Auftrag organisieren.',
          'Passende Anbieter nach Leistung, Region und Verfügbarkeit auswählen und einen Vorgang koordinieren.',
          'Nachrichten, Termine, Hausakte, Dokumente, Rechnungen und zugehörige Statusinformationen bereitstellen.',
          'Missbrauch, unberechtigte Zugriffe und technische Fehler erkennen und nachvollziehen.',
        ]} />
        <InfoPanel label="Rechtliche Einordnung noch offen">
          <p>
            Diese technischen Zwecke sind keine Festlegung der datenschutzrechtlichen Rechtsgrundlage. Welche Rechtsgrundlage je Verarbeitung gilt und welche berechtigten Interessen gegebenenfalls herangezogen werden, wird mit der finalen Produktionsinventur rechtlich freigegeben.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Freigaben & Empfänger" title="Privates bleibt nicht automatisch für jeden sichtbar." tone="green">
        <FeatureGrid items={[
          { icon: <Hand size={20} />, title: 'Bewusste Freigaben', text: 'Kontaktdaten und hausbezogene Informationen sollen nur im für den jeweiligen Vorgang vorgesehenen Umfang geteilt werden.' },
          { icon: <Eye size={20} />, title: 'Keine pauschale Offenlegung', text: 'Ein Partner erhält nicht allein durch seine Plattformrolle automatisch Zugriff auf private Nachrichten, Zahlungen oder vollständige Hausdokumente.' },
          { icon: <FileLock2 size={20} />, title: 'Eigentümerwechsel mit Grenzen', text: 'Hausbezogene Historie kann am Objekt fortgeführt werden, ohne private Inhalte eines früheren Eigentümers automatisch zu übertragen.' },
        ]} />
        <InfoPanel label="Produktionsanbieter verifizieren">
          <p>
            Der Code enthält Integrationspunkte unter anderem für Zahlungsabwicklung, WhatsApp-Kommunikation und einen KI-Gateway. Welche Anbieter davon in Produktion tatsächlich aktiv sind, in welcher Rolle sie handeln und welche Übermittlungen oder Drittlandmechanismen gelten, wird vor der finalen Datenschutzerklärung aus dem Live-Betrieb inventarisiert.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Cookies & Endgerät" title="Technisch notwendige Sitzung, Tracking erst nach Inventur." tone="soft">
        <FeatureGrid items={[
          { icon: <Cookie size={20} />, title: 'Anmeldesitzung', text: 'Die aktuelle Anwendung verwendet für angemeldete Sitzungen ein technisch notwendiges Session-Cookie.' },
          { icon: <ShieldCheck size={20} />, title: 'Keine pauschale Tracking-Behauptung', text: 'Vor Launch wird die produktive Website auf Cookies, Local Storage, Tags und sonstige Endgerätezugriffe geprüft.' },
        ]} />
        <p>
          Erst nach dieser Prüfung kann belastbar festgelegt werden, ob neben unbedingt erforderlichen Funktionen ein Consent-Mechanismus benötigt wird und welche Laufzeiten und Anbieter genannt werden müssen.
        </p>
      </Section>

      <Section eyebrow="Betroffenenrechte" title="Rechte gelten nach den gesetzlichen Voraussetzungen.">
        <BulletList items={[
          'Auskunft über verarbeitete personenbezogene Daten.',
          'Berichtigung unrichtiger Daten.',
          'Löschung oder Einschränkung der Verarbeitung, soweit die gesetzlichen Voraussetzungen vorliegen.',
          'Datenübertragbarkeit in den gesetzlich vorgesehenen Fällen.',
          'Widerspruch gegen bestimmte Verarbeitungen und Widerruf einer Einwilligung für die Zukunft.',
          'Beschwerde bei einer zuständigen Datenschutzaufsichtsbehörde.',
        ]} />
        <LegalNotice title="Kontaktweg und Speicherfristen noch nicht final">
          <p>
            Der verifizierte Verantwortliche, ein gegebenenfalls erforderlicher Datenschutzbeauftragter, der konkrete Anfragekanal und die verbindlichen Speicher-/Löschfristen werden erst nach externer Datenschutz- und Betreiberfreigabe veröffentlicht.
          </p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Mehr dazu" title="Sicherheit und Anbieterangaben getrennt nachvollziehen.">
        <div className={styles.heroActions}>
          <LinkButton href="/sicherheit">Sicherheit</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
