import type { ReactNode } from 'react';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { Reveal } from './motion';
import './tokens.css';
import styles from './archetypes.module.css';

export { styles as arch };

/**
 * Seiten-Archetypen (UI-Convergence Welle 2).
 *
 * Vorher folgte fast jede öffentliche Unterseite demselben Ablauf: Hero,
 * Mockup, Kartenraster, Statement, FAQ, CTA-Band. Sauber, aber monoton.
 * Diese Datei liefert vier klar unterschiedliche Dramaturgien, die alle aus
 * demselben Token-System kommen:
 *
 *   A  Index   → /leistungen   typografischer Index, keine Karten
 *   B  Ledger  → /preise       Vergleichstabelle, keine Preiskarten
 *   C  Dossier → /hausakte     Aktenlayout mit Rail und Jahresmarken
 *   D  Terms   → /partner      Vertragsblatt mit Paragraphen
 *
 * Bewusst selbsttragend: kein Import aus mkt.module.css oder
 * marketing.module.css, damit die Alt-Ebenen nicht dagegen arbeiten.
 */

export function Kicker({ children, terra = false }: { children: ReactNode; terra?: boolean }) {
  return <span className={terra ? styles.kickerTerra : styles.kicker}>{children}</span>;
}

/** Gemeinsamer Abschnittskopf: schmale Spalte, links ausgerichtet. */
function Head({ eyebrow, title, text, terra = false }: { eyebrow?: string; title?: string; text?: ReactNode; terra?: boolean }) {
  if (!eyebrow && !title && !text) return null;
  return (
    <div className={styles.spineHead}>
      {eyebrow && <Kicker terra={terra}>{eyebrow}</Kicker>}
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
    </div>
  );
}

/* ------------------------------------------------------------ A  Index */

export function IndexHero({ eyebrow, title, lead, meta, actions }: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  meta?: ReadonlyArray<{ value: string; label: string }>;
  actions?: ReactNode;
}) {
  return (
    <section className={styles.indexHero}>
      <div className={styles.wrap}>
        <Kicker>{eyebrow}</Kicker>
        <h1 className={styles.indexHeroTitle}>{title}</h1>
        <p className={styles.indexHeroLead}>{lead}</p>
        {(meta || actions) && (
          <div className={styles.indexHeroFoot}>
            {actions}
            {meta?.map((m) => (
              <span className={styles.indexHeroMeta} key={m.label}><b>{m.value}</b> {m.label}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function IndexList({ eyebrow, title, note, items }: {
  eyebrow: string;
  title: string;
  note?: string;
  items: ReadonlyArray<{ icon: ReactNode; title: string; text: string }>;
}) {
  return (
    <section className={styles.indexSection}>
      <div className={styles.wrap}>
        <div className={styles.indexHead}>
          <div>
            <Kicker>{eyebrow}</Kicker>
            <h2>{title}</h2>
          </div>
          {note && <p className={styles.indexHeadNote}>{note}</p>}
        </div>
        <ol className={styles.indexList}>
          {items.map((item, i) => (
            <li className={styles.indexRow} key={item.title}>
              <span className={styles.indexNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.indexIcon} aria-hidden="true">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function VoiceBand({ eyebrow, title, text, items, foot, hrefFor }: {
  eyebrow: string;
  title: string;
  text: string;
  items: readonly string[];
  foot?: ReactNode;
  hrefFor: (sentence: string) => string;
}) {
  return (
    <section className={styles.voiceBand}>
      <div className={styles.wrap}>
        <div className={styles.voiceHead}>
          <Kicker terra>{eyebrow}</Kicker>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <ul className={styles.voiceList}>
          {items.map((sentence, i) => (
            <li key={sentence}>
              <Reveal delay={i * 0.04}>
                <a className={styles.voiceItem} href={hrefFor(sentence)}>
                  {sentence}
                  <span aria-hidden="true"><ArrowRight size={18} /></span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
        {foot && <p className={styles.voiceFoot}>{foot}</p>}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- B  Ledger */

export function LedgerHero({ eyebrow, title, lead, actions }: {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: ReactNode;
}) {
  return (
    <section className={styles.ledgerHero}>
      <div className={styles.wrap}>
        <Kicker>{eyebrow}</Kicker>
        <h1 className={styles.ledgerHeroTitle}>{title}</h1>
        <p className={styles.ledgerHeroLead}>{lead}</p>
        {actions && <div className={styles.ledgerHeroActions}>{actions}</div>}
      </div>
    </section>
  );
}

export type LedgerPlan = { name: string; price: string; unit?: string; note?: string; lead?: boolean };
export type LedgerRow = { label: string; values: ReadonlyArray<boolean | string> };

/** Reine Tabelle, damit Screenreader und Auge dieselbe Struktur sehen. */
export function LedgerTable({ caption, plans, rows }: {
  caption: string;
  plans: ReadonlyArray<LedgerPlan>;
  rows: ReadonlyArray<LedgerRow>;
}) {
  return (
    <div className={styles.tableScroll}>
      <table className={styles.ledgerTable}>
        <caption className={styles.srOnly}>{caption}</caption>
        <thead>
          <tr>
            <td />
            {plans.map((plan) => (
              <th scope="col" className={plan.lead ? styles.colLead : undefined} key={plan.name}>
                <span className={styles.planName}>{plan.name}</span>
                <span className={styles.planPrice}>
                  {plan.price}
                  {plan.unit !== '' && <span className={styles.planUnit}>{plan.unit ?? '/ Monat'}</span>}
                </span>
                {plan.note && <span className={styles.planNote}>{plan.note}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={styles.rowLabel}>{row.label}</th>
              {row.values.map((value, i) => (
                <td className={plans[i]?.lead ? styles.colLead : undefined} key={`${row.label}-${plans[i]?.name ?? i}`}>
                  {value === true && <span className={styles.cellYes}><Check size={17} strokeWidth={2.4} aria-label="enthalten" /></span>}
                  {value === false && <span className={styles.cellNo}><Minus size={16} aria-label="nicht enthalten" /></span>}
                  {typeof value === 'string' && <span className={styles.cellText}>{value}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ZeroBand({ eyebrow, title, items }: {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<{ value: string; label: string }>;
}) {
  return (
    <section className={styles.zeroBand}>
      <div className={styles.wrap}>
        <div className={styles.zeroHead}>
          <Kicker>{eyebrow}</Kicker>
          <h2>{title}</h2>
        </div>
        <dl className={styles.zeroList}>
          {items.map((item) => (
            <div className={styles.zeroRow} key={item.label}>
              <dt className={styles.zeroValue}>{item.value}</dt>
              <dd className={styles.zeroLabel} style={{ margin: 0 }}>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- C  Dossier */

export function DossierHero({ eyebrow, title, lead, meta, actions, aside }: {
  eyebrow: string;
  title: string;
  lead: string;
  meta: ReadonlyArray<{ key: string; value: string }>;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className={styles.dossierHero}>
      <div className={`${styles.wrap} ${styles.dossierGrid}`}>
        <div>
          <Kicker>{eyebrow}</Kicker>
          <h1 className={styles.dossierTitle}>{title}</h1>
          <p className={styles.dossierLead}>{lead}</p>
          <dl className={styles.fileMeta}>
            {meta.map((row) => (
              <div className={styles.fileMetaRow} key={row.key}>
                <dt className={styles.fileMetaKey}>{row.key}</dt>
                <dd className={styles.fileMetaValue} style={{ margin: 0 }}>{row.value}</dd>
              </div>
            ))}
          </dl>
          {actions && <div className={styles.dossierActions}>{actions}</div>}
        </div>
        {aside && <Reveal delay={0.15} className={styles.dossierAside}>{aside}</Reveal>}
      </div>
    </section>
  );
}

export function Spine({ eyebrow, title, text, records }: {
  eyebrow: string;
  title: string;
  text?: string;
  records: ReadonlyArray<{ when: string; title: string; text: string; tags?: readonly string[] }>;
}) {
  return (
    <section className={styles.spineSection}>
      <div className={styles.wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <ol className={styles.spine}>
          {records.map((record, i) => (
            <li className={styles.record} key={record.title}>
              <div className={styles.recordRail} aria-hidden="true">
                <span className={styles.recordDot} />
                <span className={styles.recordLine} />
              </div>
              <Reveal delay={i * 0.05} className={styles.recordBody}>
                <span className={styles.recordWhen}>{record.when}</span>
                <h3>{record.title}</h3>
                <p>{record.text}</p>
                {record.tags && (
                  <ul className={styles.recordTags}>
                    {record.tags.map((tag) => <li className={styles.recordTag} key={tag}>{tag}</li>)}
                  </ul>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Handover({ eyebrow, title, text, columns }: {
  eyebrow: string;
  title: string;
  text: string;
  columns: ReadonlyArray<{ label: string; title: string; items: readonly string[] }>;
}) {
  return (
    <section className={styles.handoverSection}>
      <div className={styles.wrap}>
        <div className={styles.handoverHead}>
          <Kicker terra>{eyebrow}</Kicker>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className={styles.handover}>
          {columns.map((col) => (
            <div className={styles.handoverCol} key={col.label}>
              <h3>{col.title}<small>{col.label}</small></h3>
              <ul className={styles.handoverList}>
                {col.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ D  Terms */

export function TermsHero({ eyebrow, title, lead, actions, figure }: {
  eyebrow: string;
  title: string;
  lead: string;
  actions?: ReactNode;
  figure?: ReactNode;
}) {
  return (
    <section className={styles.termsHero}>
      <div className={`${styles.wrap} ${styles.termsGrid}`}>
        <div>
          <Kicker>{eyebrow}</Kicker>
          <h1 className={styles.termsTitle}>{title}</h1>
          <p className={styles.termsLead}>{lead}</p>
          {actions && <div className={styles.termsActions}>{actions}</div>}
        </div>
        {figure}
      </div>
    </section>
  );
}

export function TermsFigure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className={styles.termsFigure}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" width={880} height={660} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function Clauses({ items, id, eyebrow, title, text }: {
  id?: string;
  eyebrow?: string;
  title?: string;
  text?: ReactNode;
  items: ReadonlyArray<{ title: string; body: ReactNode }>;
}) {
  return (
    <section className={styles.clauseSection} id={id}>
      <div className={styles.wrap}>
        <Head eyebrow={eyebrow} title={title} text={text} />
        <ol className={styles.clauseList}>
          {items.map((item, i) => (
            <li className={styles.clause} key={item.title}>
              <div className={styles.clauseHead}>
                <span className={styles.clauseNum} aria-hidden="true">&sect;&thinsp;{i + 1}</span>
                <h3>{item.title}</h3>
              </div>
              <div className={styles.clauseBody}>{item.body}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Gate({ eyebrow, title, text, items, id }: {
  id?: string;
  eyebrow: string;
  title: string;
  text: string;
  items: ReadonlyArray<{ label: string; note: string }>;
}) {
  return (
    <section className={styles.gateSection} id={id}>
      <div className={styles.wrap}>
        <div className={styles.gateHead}>
          <Kicker>{eyebrow}</Kicker>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <ul className={styles.gateList}>
          {items.map((item) => (
            <li className={styles.gateRow} key={item.label}>
              <span className={styles.gateIcon} aria-hidden="true"><Check size={17} strokeWidth={2.4} /></span>
              <span className={styles.gateLabel}>{item.label}</span>
              <span className={styles.gateNote}>{item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ gemeinsam */

/** FAQ-Rahmen: links ausgerichtet statt zentriert unter einer Überschrift. */
export function FaqFrame({ eyebrow, title, text, children }: {
  eyebrow: string;
  title: string;
  text?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.faqSection}>
      <div className={`${styles.wrap} ${styles.faqGrid}`}>
        <div className={styles.faqAside}>
          <Kicker>{eyebrow}</Kicker>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

/** Leiser Abschluss für Seiten, die nicht noch ein dunkles CTA-Band brauchen. */
export function QuietClose({ title, text, actions }: { title: string; text: string; actions: ReactNode }) {
  return (
    <section className={styles.closer}>
      <div className={`${styles.wrap} ${styles.closerInner}`}>
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className={styles.closerActions}>{actions}</div>
      </div>
    </section>
  );
}
