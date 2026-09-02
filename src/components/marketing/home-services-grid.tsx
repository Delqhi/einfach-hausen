import { ArrowRight, FileText } from 'lucide-react';
import { CardVisual } from '@/components/visuals/CardVisual';
import styles from './home-services-grid.module.css';

const ArrowButton = () => (
  <span className={styles.arrow} aria-hidden="true">
    <ArrowRight size={26} strokeWidth={1.9} />
  </span>
);

/**
 * HomeServicesGrid — „Neu bei einfach-hausen" (T-0210 Spec §4.2 Section 2).
 *
 * Design-Contract: konsistente Markenbildwelt statt Zufallsfotos. Alle Karten
 * nutzen die CardVisual-Library (1254px RGBA, Markenpalette Petrol/Mint/Warm,
 * Line-Art) auf ruhigen Mint-Tinted-Flächen. Keine Stockfotos, keine
 * Icon-Kacheln, keine Fremd-Farbpatienten.
 */
export function HomeServicesGrid() {
  return (
    <section id="home-services" className={styles.section} aria-labelledby="home-services-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Für Eigentümer</span>
          <h2 id="home-services-title" className={styles.title}>
            <span>Neu bei einfach-hausen:</span>
            <strong>Alles rund ums Zuhause</strong>
          </h2>
        </header>

        <div className={styles.mosaic}>
          <a href="/hausakte" className={`${styles.card} ${styles.featureCard}`} aria-label="Hausakte und Dokumente entdecken">
            <span className={styles.featureBody}>
              <span className={styles.featureTitle}>Hausakte &amp; Dokumente</span>
              <span className={styles.featureCopy}>
                Rechnungen, Garantien und Wartungen – geordnet an einem Ort.
              </span>
              <ArrowButton />
            </span>
            <CardVisual kind="digitalHomeFile" size="lg" decorative className={styles.featureVisual} />
          </a>

          <div className={styles.rightGrid}>
            <a href="/leistungen" className={`${styles.card} ${styles.tileCard}`} aria-label="Handwerker-Service entdecken">
              <span className={styles.tileBody}>
                <span className={styles.cardLabel}>Handwerker finden</span>
                <span className={styles.tileCopy}>Vom Ventil bis zur Wärmepumpe.</span>
                <ArrowButton />
              </span>
              <CardVisual kind="craftsmenService" size="md" decorative className={styles.tileVisual} />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.tileCard}`} aria-label="Modernisieren und Sanieren entdecken">
              <span className={styles.tileBody}>
                <span className={styles.cardLabel}>Modernisieren &amp; Sanieren</span>
                <span className={styles.tileCopy}>Mehr Effizienz, weniger Aufwand.</span>
                <ArrowButton />
              </span>
              <CardVisual kind="solarEnergy" size="md" decorative className={styles.tileVisual} />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.tileCard}`} aria-label="Verkauf und Bewertung entdecken">
              <span className={styles.tileBody}>
                <span className={styles.cardLabel}>Verkaufen &amp; Bewertung</span>
                <span className={styles.tileCopy}>Dein Haus realistisch einordnen.</span>
                <ArrowButton />
              </span>
              <CardVisual kind="propertyValuation" size="md" decorative className={styles.tileVisual} />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.tileCard}`} aria-label="Geprüfte Partner entdecken">
              <span className={styles.tileBody}>
                <span className={styles.cardLabel}>Geprüfte Partner</span>
                <span className={styles.tileCopy}>Menschen aus deiner Region.</span>
                <ArrowButton />
              </span>
              <CardVisual kind="verifiedPartners" size="md" decorative className={styles.tileVisual} />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.moreCard}`} aria-label="Weitere Services entdecken">
              <span className={styles.moreIcon}><FileText size={24} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.moreTitle}>Weitere Services entdecken</span>
              <span className={styles.moreCount}>50+</span>
              <ArrowButton />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
