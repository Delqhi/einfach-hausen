import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { RELEVANZ_LABEL, type Relevanz, type Stufe } from '@/lib/lexikon';
import styles from './lexikon.module.css';

/** Serialisierbare Kartendaten — was Explorer (Client) und Server-Seiten teilen. */
export type EntryCardData = {
  slug: string;
  begriff: string;
  kurz: string;
  kategorie: string;
  kategorieName: string;
  relevanz: Relevanz;
  stufen: { kosten: Stufe; aufwand: Stufe; dringlichkeit: Stufe };
  lesezeit: number;
  synonyme: string[];
  buchstabe: string;
};

export function RelevanzBadge({ relevanz }: { relevanz: Relevanz }) {
  return <span className={styles.badge} data-tone={relevanz} title={RELEVANZ_LABEL[relevanz].hint}>{RELEVANZ_LABEL[relevanz].label}</span>;
}

export function MiniLevels({ stufen }: { stufen: EntryCardData['stufen'] }) {
  const rows: Array<[string, Stufe, boolean]> = [
    ['Kosten', stufen.kosten, false],
    ['Aufwand', stufen.aufwand, false],
    ['Dringlich', stufen.dringlichkeit, true],
  ];
  return (
    <div className={styles.levels} aria-label="Orientierungsstufen">
      {rows.map(([label, value, hot]) => (
        <span key={label} className={styles.level} title={`${label}: Stufe ${value} von 4`}>
          {label}
          <span className={styles.levelBar} aria-hidden="true">
            {[1, 2, 3, 4].map((n) => <i key={n} data-on={n <= value} data-hot={hot && value >= 3} />)}
          </span>
        </span>
      ))}
    </div>
  );
}

function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
}

export function EntryCard({ e, query, className }: { e: EntryCardData; query?: string; className?: string }) {
  return (
    <Link href={`/lexikon/${e.slug}`} className={`${styles.entry} ${className ?? ''}`} data-slug={e.slug}>
      <div className={styles.entryTop}>
        <span className={styles.entryCat}>{e.kategorieName}</span>
        <RelevanzBadge relevanz={e.relevanz} />
      </div>
      <h3><Highlight text={e.begriff} query={query} /></h3>
      <p>{e.kurz}</p>
      <div className={styles.entryFoot}>
        <MiniLevels stufen={e.stufen} />
        <span className={styles.entryMeta}>
          <span><Clock size={13} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />{e.lesezeit} Min.</span>
          <span className={styles.entryArrow} aria-hidden="true"><ArrowUpRight size={16} /></span>
        </span>
      </div>
    </Link>
  );
}
