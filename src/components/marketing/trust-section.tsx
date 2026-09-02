import { CardVisual } from '@/components/visuals/CardVisual';
import { Section, Split, InfoPanel, BulletList } from './ui';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import styles from './trust-section.module.css';

/**
 * TrustSection — Spec §4.2 Section 5: Vertrauen / Proof.
 * shadcn/ui Primitives (Badge, Separator) auf Markenbildwelt (CardVisual).
 */
export function TrustSection() {
  return (
    <Section eyebrow="Vertrauen" title="Warum Eigenheimbesitzer uns vertrauen." tone="soft">
      <Split>
        <div className={styles.visualStack} aria-hidden="true">
          <CardVisual kind="verifiedPartners" size="lg" decorative className={styles.trustVisualMain} />
          <CardVisual kind="keyHandover" size="md" decorative className={styles.trustVisualFloat} />
        </div>
        <div className={styles.trustPanels}>
          <InfoPanel label="Geprüfte Vertragspartner">
            <h3>Menschen, die wir kennen.</h3>
            <BulletList items={[
              'Persönliche Prüfung vor der Aufnahme',
              'Fachliche Eignung und Qualität zählen – nicht der höchste Tarif',
              'Konkrete Ansprechpartner statt anonymer Firmen',
            ]} />
            <div className={styles.badgeRow}>
              <Badge variant="outline" className={styles.badge}>Persönliche Prüfung</Badge>
              <Badge variant="outline" className={styles.badge}>Qualität vor Tarif</Badge>
            </div>
          </InfoPanel>
          <InfoPanel label="Strukturierte Organisation">
            <h3>Nichts geht verloren.</h3>
            <BulletList items={[
              'Alle Anliegen, Angebote und Termine an einem Ort',
              'Digitale Hausakte mit Rechnungen, Garantien und Historie',
              'Kein Lead-Handel: kein Verkauf deiner Anfrage',
            ]} />
            <Separator className={styles.separator} />
            <p className={styles.microProof}>Über 50 Servicebereiche · 0 % Auftragsprovision für Partner</p>
          </InfoPanel>
        </div>
      </Split>
    </Section>
  );
}
