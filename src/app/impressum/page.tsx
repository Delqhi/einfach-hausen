import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { InfoPanel, LegalNotice, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Anbieterkennzeichnung und Veröffentlichungsstatus von Einfach Hausen.',
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Rechtliches"
        title="Impressum"
        text="Die Anbieterkennzeichnung ist vollständig strukturiert, aber noch nicht veröffentlichungsfertig: operatorbezogene Pflichtangaben werden erst eingetragen, wenn sie dokumentarisch verifiziert und freigegeben sind."
      />

      <Section eyebrow="Veröffentlichungsstatus" title="Keine erfundenen Unternehmensdaten.">
        <LegalNotice title="Launch-Blocker: Anbieteridentität und Pflichtangaben sind noch nicht freigegeben">
          <p>
            Das Repository enthält derzeit keine verifizierte Betreiberidentität, ladungsfähige Anschrift oder offizielle Veröffentlichungs-E-Mail von Einfach Hausen. Diese Seite ist deshalb bewusst kein fertiges Impressum und behauptet keine abgeschlossene Rechtsprüfung.
          </p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Anbieterkennzeichnung" title="Angaben zum Diensteanbieter" tone="soft">
        <dl className={styles.legalGrid}>
          <dt>Name / Firma</dt>
          <dd className={styles.placeholder}>Verifizierte Betreiberangabe ausstehend</dd>
          <dt>Rechtsform</dt>
          <dd className={styles.placeholder}>Verifizierte Angabe oder dokumentiertes „nicht anwendbar“ ausstehend</dd>
          <dt>Vertretungsberechtigte Person</dt>
          <dd className={styles.placeholder}>Falls einschlägig: verifizierte Angabe ausstehend</dd>
          <dt>Niederlassungs- / ladungsfähige Anschrift</dt>
          <dd className={styles.placeholder}>Verifizierte veröffentlichungsfähige Anschrift ausstehend</dd>
          <dt>Elektronische Kontaktaufnahme</dt>
          <dd className={styles.placeholder}>Offizielle Veröffentlichungs-E-Mail und freigegebener direkter Kommunikationsweg ausstehend</dd>
        </dl>
      </Section>

      <Section eyebrow="Weitere Pflichtangaben" title="Nur soweit sie auf den tatsächlichen Betreiber zutreffen.">
        <dl className={styles.legalGrid}>
          <dt>Register / Registernummer / Registergericht</dt>
          <dd className={styles.placeholder}>Anwendbarkeit und gegebenenfalls exakte Werte rechtlich verifizieren</dd>
          <dt>Aufsichtsbehörde / Kammer / Berufsrecht</dt>
          <dd className={styles.placeholder}>Anwendbarkeit für Betreiber und Tätigkeit rechtlich verifizieren</dd>
          <dt>USt-IdNr. / Wirtschafts-Identifikationsnummer</dt>
          <dd className={styles.placeholder}>Anwendbarkeit und gegebenenfalls exakten Betreiberwert steuerlich verifizieren</dd>
          <dt>Weitere operatorbezogene Pflichtangaben</dt>
          <dd className={styles.placeholder}>Medien-, berufs- oder tätigkeitsbezogene Zusatzpflichten vor Launch prüfen</dd>
        </dl>
      </Section>

      <Section eyebrow="Verbraucherstreitbeilegung" title="Teilnahmestatus noch nicht autorisiert." tone="soft">
        <InfoPanel label="VSBG-Prüfung offen">
          <p>
            Ob der Betreiber an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilnimmt, teilnehmen muss oder von einer Informationspflicht ausgenommen ist, hängt vom tatsächlichen Betreiber und Geschäftsmodell ab. Eine konkrete Schlichtungsstelle wird deshalb erst nach rechtlicher Prüfung genannt.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Weitere Informationen" title="Datenschutz, Sicherheit und Kontakt im Zusammenhang lesen.">
        <div className={styles.heroActions}>
          <LinkButton href="/datenschutz">Datenschutz</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt</LinkButton>
          <LinkButton href="/sicherheit" secondary>Sicherheit</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
