import { ArrowRight } from 'lucide-react';
import { Reveal, Stagger } from './motion';
import styles from './marketing.module.css';

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className={styles.eyebrow}>{children}</span>;
}

export function PageHero({ eyebrow, title, text, actions, aside }: { eyebrow: string; title: string; text: string; actions?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className={styles.pageHero}>
      <div className={aside ? styles.pageHeroGrid : `${styles.pageHeroGrid} ${styles.pageHeroGridSingle}`}>
        <Stagger className={styles.pageHeroCopy} gap={0.1}>
          <span className={styles.eyebrow}><span className={styles.eyebrowDot} aria-hidden="true"/> {eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
          {actions && <div className={styles.heroActions}>{actions}</div>}
        </Stagger>
        {aside && <Reveal delay={0.22} y={30} className={styles.pageHeroAside}>{aside}</Reveal>}
      </div>
    </section>
  );
}

export function Section({ eyebrow, title, text, children, tone = 'plain' }: { eyebrow?: string; title?: string; text?: string; children: React.ReactNode; tone?: 'plain' | 'soft' | 'green' | 'dark' }) {
  return (
    <section className={`${styles.section} ${styles[`tone_${tone}`]}`}>
      <div className={styles.sectionInner}>
        {(eyebrow || title || text) && <Reveal className={styles.sectionHead}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {title && <h2>{title}</h2>}
          {text && <p>{text}</p>}
        </Reveal>}
        {children}
      </div>
    </section>
  );
}

export function FeatureGrid({ items }: { items: ReadonlyArray<{ icon: React.ReactNode; title: string; text: string }> }) {
  return <div className={styles.featureGrid}>{items.map((item) => <article className={styles.feature} key={item.title}><div className={styles.featureIcon}>{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>;
}

export function Split({ children }: { children: React.ReactNode }) {
  return <div className={styles.split}>{children}</div>;
}

export function LinkButton({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <a className={secondary ? styles.secondaryButton : styles.primaryButton} href={href}>{children}{!secondary && <ArrowRight size={16} />}</a>;
}

export function BulletList({ items }: { items: readonly string[] }) {
  return <ul className={styles.bulletList}>{items.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>;
}

export function InfoPanel({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div className={styles.infoPanel}>{label && <span className={styles.panelLabel}>{label}</span>}{children}</div>;
}

export function CtaBand({ title, text, href = '/register?role=homeowner', label = 'Kostenlos starten' }: { title: string; text: string; href?: string; label?: string }) {
  return <Reveal><section className={styles.ctaBand}><div><h2>{title}</h2><p>{text}</p></div><LinkButton href={href}>{label}</LinkButton></section></Reveal>;
}

export function LegalNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className={styles.legalNotice}><strong>{title}</strong><div>{children}</div></div>;
}
