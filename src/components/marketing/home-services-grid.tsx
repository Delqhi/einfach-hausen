import Image from 'next/image';
import { ArrowRight, FileText, Hammer, Home, PaintRoller, ShieldCheck } from 'lucide-react';
import styles from './home-services-grid.module.css';

const ArrowButton = () => (
  <span className={styles.arrow} aria-hidden="true">
    <ArrowRight size={28} strokeWidth={1.9} />
  </span>
);

export function HomeServicesGrid() {
  return (
    <section id="home-services" className={styles.section} aria-labelledby="home-services-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.eyebrow}><Home size={17} strokeWidth={1.8} aria-hidden="true" /> FÜR EIGENTÜMER</span>
          <h2 id="home-services-title" className={styles.title}>
            <span>Neu bei einfach-hausen:</span>
            <strong>Alles rund ums Zuhause</strong>
          </h2>
        </header>

        <div className={styles.mosaic}>
          <a href="/hausakte" className={`${styles.card} ${styles.featureCard}`} aria-label="Hausakte und Dokumente entdecken">
            <Image
              src="/images/haus.jpg"
              alt="Modernes Eigenheim als Mittelpunkt der digitalen Hausakte"
              fill
              sizes="(max-width: 760px) 100vw, 38vw"
              className={styles.coverImage}
            />
            <span className={styles.featureShade} aria-hidden="true" />
            <span className={styles.featureTitle}>Hausakte &amp; Dokumente</span>
            <ArrowButton />
          </a>

          <div className={styles.rightGrid}>
            <a href="/leistungen" className={`${styles.card} ${styles.wideCard}`} aria-label="Versicherungsservices entdecken">
              <Image
                src="/images/premium/category-dach.jpg"
                alt="Gepflegtes Eigenheim"
                fill
                sizes="(max-width: 760px) 100vw, 30vw"
                className={styles.cardImage}
              />
              <span className={styles.icon}><ShieldCheck size={26} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.cardLabel}>Versicherung</span>
              <ArrowButton />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.wideCard}`} aria-label="Modernisieren und Sanieren entdecken">
              <Image
                src="/images/premium/category-heizung.jpg"
                alt="Materialien und Arbeiten rund um die Modernisierung"
                fill
                sizes="(max-width: 760px) 100vw, 30vw"
                className={styles.cardImage}
              />
              <span className={styles.icon}><PaintRoller size={25} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.cardLabel}>Modernisieren &amp; Sanieren</span>
              <ArrowButton />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.smallCard}`} aria-label="Verkaufen und Bewertung entdecken">
              <Image
                src="/images/welcome-house.png"
                alt="Haus als Symbol für Verkauf und Bewertung"
                fill
                sizes="(max-width: 760px) 100vw, 20vw"
                className={styles.cardImage}
              />
              <span className={styles.icon}><Home size={25} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.cardLabel}>Verkaufen &amp; Bewertung</span>
              <ArrowButton />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.smallCard}`} aria-label="Handwerker finden">
              <Image
                src="/images/handwerker.jpg"
                alt="Handwerker bei der Arbeit"
                fill
                sizes="(max-width: 760px) 100vw, 20vw"
                className={styles.cardImage}
              />
              <span className={styles.icon}><Hammer size={25} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className={styles.cardLabel}>Handwerker finden</span>
              <ArrowButton />
            </a>

            <a href="/leistungen" className={`${styles.card} ${styles.moreCard}`} aria-label="Weitere Services entdecken">
              <span className={styles.icon}><FileText size={25} strokeWidth={1.8} aria-hidden="true" /></span>
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
