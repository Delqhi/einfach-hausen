import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { LegalNotice, PageHero, Section } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'Impressum', description: 'Anbieterkennzeichnung von Einfach Hausen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Rechtliches" title="Impressum" text="Die Struktur ist vorbereitet. Rechtliche Identitätsdaten werden erst veröffentlicht, wenn sie verifiziert vorliegen." />
  <Section eyebrow="Anbieterkennzeichnung" title="Vor Veröffentlichung zu vervollständigen.">
    <LegalNotice title="Launch-Blocker: Anbieteridentität nicht verifiziert"><p>Im Repository liegen derzeit keine verifizierten Angaben zur rechtlichen Anbieteridentität von Einfach Hausen vor. Deshalb werden hier bewusst keine Namen, Adressen, Register- oder Steuerdaten erfunden.</p></LegalNotice>
    <dl className={styles.legalGrid}>
      <dt>Anbieter / Rechtsform</dt><dd className={styles.placeholder}>Verifizierte Angabe fehlt</dd>
      <dt>Ladungsfähige Anschrift</dt><dd className={styles.placeholder}>Verifizierte Angabe fehlt</dd>
      <dt>Vertretungsberechtigte Person</dt><dd className={styles.placeholder}>Verifizierte Angabe fehlt</dd>
      <dt>Kontakt</dt><dd className={styles.placeholder}>Verifizierte öffentliche E-Mail / Telefonnummer fehlt</dd>
      <dt>Registerangaben</dt><dd className={styles.placeholder}>Falls einschlägig: Register, Registernummer und Registergericht verifizieren</dd>
      <dt>Umsatzsteuer-ID</dt><dd className={styles.placeholder}>Falls einschlägig: verifizierte USt-IdNr. ergänzen</dd>
      <dt>Weitere Pflichtangaben</dt><dd className={styles.placeholder}>Vor Launch rechtlich anhand des tatsächlichen Anbieters prüfen</dd>
    </dl>
  </Section>
</MarketingShell>}
