import { ArrowRight, Check, CircleCheck, Plus } from 'lucide-react';
import { Reveal, Stagger } from './motion';
import styles from './mkt.module.css';

export { styles as mkt };

type Tone = 'plain' | 'canvas' | 'surface' | 'soft' | 'sand' | 'dark' | 'green';
const toneClass: Record<Tone, string> = {
  plain: styles.toneCanvas,
  canvas: styles.toneCanvas,
  surface: styles.toneSurface,
  soft: styles.toneSoft,
  sand: styles.toneSand,
  dark: `${styles.toneDark} ${styles.onDark}`,
  green: `${styles.toneDark} ${styles.onDark}`,
};

export function Eyebrow({ children, terra = false }: { children: React.ReactNode; terra?: boolean }) {
  return <span className={terra ? styles.eyebrowTerra : styles.eyebrow}>{children}</span>;
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}

export function PageHero({ eyebrow, title, text, actions, aside, terra = false }: { eyebrow: string; title: string; text: string; actions?: React.ReactNode; aside?: React.ReactNode; terra?: boolean }) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.pageHeroGrid}>
        <Stagger className={styles.pageHeroCopy} gap={0.1}>
          <Eyebrow terra={terra}>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{text}</p>
          {actions && <div className={styles.heroActions}>{actions}</div>}
        </Stagger>
        {aside && <Reveal delay={0.2} y={24} className={styles.pageHeroAside}>{aside}</Reveal>}
      </div>
    </section>
  );
}

export function Section({ eyebrow, title, text, children, tone = 'plain', tight = false, center = false, id }: { eyebrow?: string; title?: string; text?: string; children: React.ReactNode; tone?: Tone; tight?: boolean; center?: boolean; id?: string }) {
  return (
    <section id={id} className={`${tight ? styles.sectionTight : styles.section} ${toneClass[tone]}`}>
      <div className={styles.sectionInner}>
        {(eyebrow || title || text) && (
          <Reveal className={center ? styles.sectionHeadCenter : styles.sectionHead}>
            {eyebrow && <Eyebrow terra={tone === 'sand'}>{eyebrow}</Eyebrow>}
            {title && <h2>{title}</h2>}
            {text && <p>{text}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export function CardGrid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  return <div className={styles.cardGrid} data-cols={cols}>{children}</div>;
}

export function Card({ icon, title, text, tone = 'surface', children }: { icon?: React.ReactNode; title: string; text?: string; tone?: 'surface' | 'sand' | 'soft' | 'dark'; children?: React.ReactNode }) {
  const cls = tone === 'sand' ? styles.cardSand : tone === 'soft' ? styles.cardSoft : tone === 'dark' ? styles.cardDark : styles.card;
  return (
    <article className={cls}>
      {icon && <span className={styles.cardIcon}>{icon}</span>}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </article>
  );
}

export function FeatureGrid({ items, cols }: { items: ReadonlyArray<{ icon: React.ReactNode; title: string; text: string }>; cols?: 2 | 3 | 4 }) {
  const c = cols ?? (items.length % 4 === 0 ? 4 : items.length % 3 === 0 ? 3 : 2);
  return (
    <div className={styles.featureGrid} data-cols={c}>
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.05}>
          <article className={styles.feature}><span className={styles.cardIcon}>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>
        </Reveal>
      ))}
    </div>
  );
}

export function Statement({ kicker, tone = 'sand', children }: { kicker: string; tone?: Tone; children: React.ReactNode }) {
  return (
    <section className={`${styles.statement} ${toneClass[tone]}`}>
      <div className={styles.statementInner}>
        <Reveal><Eyebrow terra={tone === 'sand'}>{kicker}</Eyebrow></Reveal>
        <Reveal delay={0.08}><p className={styles.statementText}>{children}</p></Reveal>
      </div>
    </section>
  );
}

export function Numbered({ items }: { items: ReadonlyArray<{ title: string; text: string }>; tone?: Tone }) {
  return (
    <div className={styles.numberedList}>
      {items.map((item, index) => (
        <Reveal key={item.title} delay={index * 0.05}>
          <div className={styles.numberedRow}>
            <span className={styles.numberedNum}>{index + 1}</span>
            <div className={styles.numberedBody}><h3>{item.title}</h3><p>{item.text}</p></div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: ReadonlyArray<{ title: string; text: string; visual?: React.ReactNode }> }) {
  return (
    <div className={styles.steps}>
      {items.map((item, index) => (
        <Reveal key={item.title} delay={index * 0.08} className={styles.step}>
          <span className={styles.stepNum} aria-hidden="true">{index + 1}</span>
          <div className={styles.stepBody}><h3>{item.title}</h3><p>{item.text}</p></div>
          {item.visual && <div className={styles.stepVisual}>{item.visual}</div>}
        </Reveal>
      ))}
    </div>
  );
}

export function Split({ children }: { children: React.ReactNode }) {
  return <div className={styles.split}>{children}</div>;
}

type ButtonVariant = 'primary' | 'ghost' | 'terra' | 'onDark' | 'ghostOnDark';
const variantClass: Record<ButtonVariant, string> = {
  primary: styles.btnPrimary,
  ghost: styles.btnGhost,
  terra: styles.btnTerra,
  onDark: styles.btnOnDark,
  ghostOnDark: styles.btnGhostOnDark,
};

export function LinkButton({ href, children, secondary = false, variant, size, arrow }: { href: string; children: React.ReactNode; secondary?: boolean; variant?: ButtonVariant; size?: 'sm' | 'lg'; arrow?: boolean }) {
  const v = variant ?? (secondary ? 'ghost' : 'primary');
  const showArrow = arrow ?? (v === 'primary' || v === 'onDark' || v === 'terra');
  return (
    <a className={`${variantClass[v]} ${size === 'sm' ? styles.btnSm : size === 'lg' ? styles.btnLg : ''}`} href={href}>
      {children}{showArrow && <ArrowRight size={16} aria-hidden="true" />}
    </a>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={styles.textLink} href={href}>{children} <ArrowRight size={15} aria-hidden="true" /></a>;
}

export function BulletList({ items }: { items: readonly string[] }) {
  return <ul className={styles.bulletList}>{items.map((item) => <li key={item}><span aria-hidden="true"><Check size={12} strokeWidth={3} /></span>{item}</li>)}</ul>;
}

export function InfoPanel({ children, label }: { children: React.ReactNode; label?: string }) {
  return <div className={styles.infoPanel}>{label && <span className={styles.panelLabel}>{label}</span>}{children}</div>;
}

export function ProofRow({ items, className = '' }: { items?: readonly string[]; className?: string }) {
  const list = items ?? ['Hauskonto kostenlos', 'kein Auftrag ohne deine Entscheidung', 'geprüfte Partner aus deiner Region'];
  return (
    <div className={`${styles.proofRow} ${className}`}>
      {list.map((item) => <span key={item}><CircleCheck size={16} aria-hidden="true" /> {item}</span>)}
    </div>
  );
}

export function Facts({ items }: { items: ReadonlyArray<{ value: string; label: string }> }) {
  return (
    <div className={styles.facts}>
      {items.map((f, i) => (
        <Reveal key={f.label} delay={i * 0.05} className={styles.fact}>
          <span className={styles.factValue}>{f.value}</span>
          <span className={styles.factLabel}>{f.label}</span>
        </Reveal>
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: ReadonlyArray<{ quote: string; name: string; meta: string }> }) {
  return (
    <div className={styles.cardGrid} data-cols={items.length >= 3 ? 3 : 2}>
      {items.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.06} className={styles.testimonial}>
          <p className={styles.testimonialText}>„{t.quote}“</p>
          <div className={styles.testimonialWho}>
            <span className={styles.avatar} aria-hidden="true">{t.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
            <div><strong>{t.name}</strong>{t.meta}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function Faq({ items }: { items: ReadonlyArray<{ q: string; a: React.ReactNode }> }) {
  return (
    <div className={styles.faq}>
      {items.map((item) => (
        <details className={styles.faqItem} key={item.q}>
          <summary>{item.q}<Plus size={20} aria-hidden="true" /></summary>
          <div>{typeof item.a === 'string' ? <p>{item.a}</p> : item.a}</div>
        </details>
      ))}
    </div>
  );
}

export function Timeline({ items }: { items: ReadonlyArray<{ when: string; title: string; text: string }> }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={item.title} className={styles.tlItem}>
          <div className={styles.tlRail} aria-hidden="true"><span className={styles.tlDot} /><span className={styles.tlLine} /></div>
          <div className={styles.tlBody}><span className={styles.tlWhen}>{item.when}</span><h3>{item.title}</h3><p>{item.text}</p></div>
        </li>
      ))}
    </ol>
  );
}

export function CtaBand({ title, text, href = '/register?role=homeowner', label = 'Hauskonto kostenlos anlegen', secondaryHref = '/#anliegen', secondaryLabel = 'Anliegen starten' }: { title: string; text: string; href?: string; label?: string; secondaryHref?: string; secondaryLabel?: string }) {
  return (
    <Reveal>
      <section className={`${styles.ctaBand} ${styles.onDark}`}>
        <div className={styles.ctaBandCopy}>
          <h2>{title}</h2>
          <p>{text}</p>
          <ProofRow />
        </div>
        <div className={styles.ctaBandActions}>
          <LinkButton href={href} variant="onDark">{label}</LinkButton>
          <LinkButton href={secondaryHref} variant="ghostOnDark">{secondaryLabel}</LinkButton>
        </div>
      </section>
    </Reveal>
  );
}

export function LegalNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className={styles.legalNotice}><strong>{title}</strong><div>{children}</div></div>;
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}
