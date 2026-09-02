import { CardVisual } from '@/components/visuals/CardVisual';
import { Section } from './ui';
import { Badge } from '@/components/ui/badge';
import styles from './security-section.module.css';

/**
 * SecuritySection — Spec §4.2 Section 8: Security / Privacy.
 * Dunkler Premium-Vertrauensabschluss mit shadcn Badges.
 */
export function SecuritySection() {
  return (
    <Section eyebrow="Sicherheit & Datenschutz" title="Dein Zuhause bleibt deine Sache." tone="dark">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.lead}>
            Private App-Inhalte werden nicht als Offline-Kopie gespeichert.
            Zugriffe bleiben kontrolliert, deine Anfragen werden nicht verkauft.
          </p>
          <ul className={styles.points}>
            <li><strong>Kontrollierte Zugriffe.</strong> Nur du entscheidest, wer dein Haus sieht.</li>
            <li><strong>Kein Lead-Handel.</strong> Deine Anfrage wird nicht an Dritte verkauft.</li>
            <li><strong>Server in der EU.</strong> Deutsche Datenschutz-Standards.</li>
            <li><strong>Immer löschbar.</strong> Du bleibst Herr über deine Daten.</li>
          </ul>
          <div className={styles.badgeRow}>
            <Badge className={styles.badge} variant="outline">DSGVO-konform</Badge>
            <Badge className={styles.badge} variant="outline">EU-Server</Badge>
            <Badge className={styles.badge} variant="outline">0 % Datenverkauf</Badge>
          </div>
          <a href="/sicherheit" className={styles.link}>Sicherheitsprinzipien ansehen →</a>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <CardVisual kind="verifiedPartners" size="xl" decorative />
        </div>
      </div>
    </Section>
  );
}
