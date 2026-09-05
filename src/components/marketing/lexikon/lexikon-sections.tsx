import Link from 'next/link';
import { ArrowRight, Droplets, FileCheck2, Flame, FolderKanban, Home, PlugZap, Waves } from 'lucide-react';
import { Reveal } from '../motion';
import {
  LEXIKON_KATEGORIEN,
  eintraegeInKategorie,
  lesezeit,
  registerBuchstabe,
  type LexikonEintrag,
  type LexikonKategorieSlug,
} from '@/lib/lexikon';
import { EntryCard, type EntryCardData } from './entry-card';
import styles from './lexikon.module.css';

export function toCardData(e: LexikonEintrag): EntryCardData {
  const kat = LEXIKON_KATEGORIEN.find((k) => k.slug === e.kategorie);
  return {
    slug: e.slug,
    begriff: e.begriff,
    kurz: e.kurz,
    kategorie: e.kategorie,
    kategorieName: kat?.name ?? e.kategorie,
    relevanz: e.relevanz,
    stufen: e.stufen,
    lesezeit: lesezeit(e),
    synonyme: e.synonyme,
    buchstabe: registerBuchstabe(e.begriff),
  };
}

const ICONS: Record<LexikonKategorieSlug, React.ReactNode> = {
  'heizung-energie': <Flame size={22} />,
  'feuchte-schimmel': <Droplets size={22} />,
  'dach-gebaeudehuelle': <Home size={22} />,
  'elektro-sicherheit': <PlugZap size={22} />,
  'sanitaer-wasser': <Waves size={22} />,
  'recht-pflichten': <FileCheck2 size={22} />,
  'hausakte-organisation': <FolderKanban size={22} />,
};

export function KategorieIcon({ slug }: { slug: LexikonKategorieSlug }) {
  return <>{ICONS[slug]}</>;
}

/** Bento-Raster aller Bereiche; erste Kachel dunkel und doppelt breit. */
export function KategorieBento({ exclude }: { exclude?: LexikonKategorieSlug }) {
  const list = LEXIKON_KATEGORIEN.filter((k) => k.slug !== exclude);
  return (
    <div className={styles.bento}>
      {list.map((k, i) => {
        const entries = eintraegeInKategorie(k.slug);
        const dark = i === 0 && !exclude;
        return (
          <Reveal key={k.slug} delay={i * 0.05} y={20} style={{ minWidth: 0 }}>
            <Link href={`/lexikon/kategorie/${k.slug}`} className={dark ? styles.catDark : styles.cat}>
              <span className={styles.catIcon}>{ICONS[k.slug]}</span>
              <h3>{k.name}</h3>
              <p>{dark ? k.beschreibung : k.kurz}</p>
              <div className={styles.catTerms} aria-hidden="true">
                {entries.slice(0, dark ? 6 : 3).map((e) => <span key={e.slug}>{e.begriff}</span>)}
              </div>
              <div className={styles.catFoot}>
                <span className={styles.catCount}>{entries.length} {entries.length === 1 ? 'Begriff' : 'Begriffe'}</span>
                <span className={styles.entryArrow} aria-hidden="true"><ArrowRight size={16} /></span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Statisches Raster mit Scroll-Reveal — für Kategorieseiten und 404. */
export function EntryGrid({ entries }: { entries: LexikonEintrag[] }) {
  return (
    <div className={styles.grid}>
      {entries.map((e, i) => (
        <Reveal key={e.slug} delay={(i % 3) * 0.06} y={22} style={{ minWidth: 0, display: 'flex' }}>
          <EntryCard e={toCardData(e)} />
        </Reveal>
      ))}
    </div>
  );
}
