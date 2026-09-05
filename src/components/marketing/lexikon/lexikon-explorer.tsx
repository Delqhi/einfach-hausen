'use client';

/**
 * Lexikon-Explorer: Hero (Wort-Stagger, Parallax-Kartenstapel), Suche mit
 * Tastatur-Shortcut, Sticky-Register (Kategorie + A–Z) und ein Ergebnisraster,
 * das sich per Layout-Animation umsortiert statt hart neu zu rendern.
 *
 * Motion-Vertrag: transform/opacity only, eine Kurve, kein permanentes Loopen.
 * `MotionConfig reducedMotion="user"` schaltet auf Endzustand ohne Animation.
 */

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, BookMarked, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { EntryCard, RelevanzBadge, type EntryCardData } from './entry-card';
import styles from './lexikon.module.css';

export type ExplorerCategory = { slug: string; name: string; kurz: string; count: number };

type Props = {
  entries: EntryCardData[];
  categories: ExplorerCategory[];
  letters: string[];
  featured: string[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function norm(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').toLowerCase();
}

export function LexikonExplorer({ entries, categories, letters, featured }: Props) {
  const [query, setQuery] = useState('');
  const [kategorie, setKategorie] = useState<string | null>(null);
  const [buchstabe, setBuchstabe] = useState<string | null>(null);
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" fokussiert die Suche, Escape leert sie — wie in einem Werkzeug, nicht wie auf einer Broschüre.
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const target = ev.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (ev.key === '/' && !typing) { ev.preventDefault(); inputRef.current?.focus(); }
      if (ev.key === 'Escape' && document.activeElement === inputRef.current) { setQuery(''); inputRef.current?.blur(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const q = norm(deferred.trim());
  const results = useMemo(() => {
    return entries.filter((e) => {
      if (kategorie && e.kategorie !== kategorie) return false;
      if (buchstabe && e.buchstabe !== buchstabe) return false;
      if (!q) return true;
      const hay = norm([e.begriff, e.kurz, e.kategorieName, ...e.synonyme].join(' '));
      return hay.includes(q);
    });
  }, [entries, kategorie, buchstabe, q]);

  const availableLetters = useMemo(() => {
    const set = new Set(entries.filter((e) => !kategorie || e.kategorie === kategorie).map((e) => e.buchstabe));
    return set;
  }, [entries, kategorie]);

  const reset = useCallback(() => { setQuery(''); setKategorie(null); setBuchstabe(null); }, []);
  const hasFilter = Boolean(q) || Boolean(kategorie) || Boolean(buchstabe);
  const activeCategory = categories.find((c) => c.slug === kategorie);
  const featuredEntries = featured.map((s) => entries.find((e) => e.slug === s)).filter((e): e is EntryCardData => Boolean(e)).slice(0, 3);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: EASE }}>
      <Hero
        query={query}
        onQuery={setQuery}
        inputRef={inputRef}
        total={entries.length}
        categories={categories.length}
        featured={featuredEntries}
        onQuick={(v) => { setQuery(v); inputRef.current?.focus(); }}
      />

      <div className={styles.registerWrap} role="region" aria-label="Lexikon filtern">
        <div className={styles.register}>
          <div className={styles.registerRow}>
            <span className={styles.registerLabel}>Bereich</span>
            <button type="button" className={styles.chip} aria-pressed={kategorie === null} onClick={() => { setKategorie(null); setBuchstabe(null); }}>
              Alle <span className={styles.chipCount}>{entries.length}</span>
            </button>
            {categories.map((c) => (
              <button key={c.slug} type="button" className={styles.chip} aria-pressed={kategorie === c.slug} onClick={() => { setKategorie(kategorie === c.slug ? null : c.slug); setBuchstabe(null); }}>
                {c.name} <span className={styles.chipCount}>{c.count}</span>
              </button>
            ))}
          </div>
          <div className={styles.registerRow}>
            <span className={styles.registerLabel}>A–Z</span>
            {letters.map((l) => (
              <button key={l} type="button" className={styles.letter} aria-pressed={buchstabe === l} disabled={!availableLetters.has(l)} onClick={() => setBuchstabe(buchstabe === l ? null : l)} aria-label={`Begriffe mit ${l}`}>
                {l}
              </button>
            ))}
            <span className={styles.registerCount} aria-live="polite"><strong>{results.length}</strong> von {entries.length} Begriffen</span>
          </div>
        </div>
      </div>

      <section className={styles.explorer} id="begriffe" aria-labelledby="ergebnis-titel">
        <div className={styles.explorerInner}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
            <div>
              <span className={styles.blockNum}>{hasFilter ? 'Gefiltert' : 'Glossar'}</span>
              <h2 id="ergebnis-titel" style={{ fontSize: 'var(--eh-h2)', lineHeight: 1.1, letterSpacing: '-0.03em', fontWeight: 800, color: 'var(--eh-teal-900)', marginTop: 8 }}>
                {q ? <>Treffer für „{deferred.trim()}“</> : activeCategory ? activeCategory.name : buchstabe ? `Begriffe mit ${buchstabe}` : 'Alle Begriffe, alphabetisch'}
              </h2>
            </div>
            {hasFilter && (
              <button type="button" className={styles.chip} onClick={reset}><X size={14} aria-hidden="true" /> Filter zurücksetzen</button>
            )}
          </div>

          <LayoutGroup>
            <motion.div layout className={styles.grid}>
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((e) => (
                  <motion.div
                    key={e.slug}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                    transition={{ layout: { duration: 0.55, ease: EASE }, duration: 0.5, ease: EASE }}
                    style={{ minWidth: 0 }}
                  >
                    <EntryCard e={e} query={q ? deferred.trim() : undefined} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          <AnimatePresence>
            {results.length === 0 && (
              <motion.div className={styles.empty} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h3>Dazu haben wir noch keinen Eintrag.</h3>
                <p>Du musst den Begriff nicht kennen, um Hilfe zu bekommen. Beschreib dein Anliegen in eigenen Worten — Einordnung, Kostenrahmen und Ansprechpartner kommen von uns.</p>
                <div className={styles.quick}>
                  <Link href="/#anliegen">Anliegen beschreiben <ArrowRight size={14} aria-hidden="true" /></Link>
                  <button type="button" onClick={reset}>Alle Begriffe zeigen</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </MotionConfig>
  );
}

/* ---------------- Hero ---------------- */

function Hero({ query, onQuery, inputRef, total, categories, featured, onQuick }: {
  query: string;
  onQuery: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  total: number;
  categories: number;
  featured: EntryCardData[];
  onQuick: (v: string) => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);

  const onMove = (ev: React.MouseEvent<HTMLElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    mx.set((ev.clientX - r.left) / r.width - 0.5);
    my.set((ev.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const words = ['Fachbegriffe,', 'die', 'dir', 'Entscheidungen', 'abnehmen.'];

  return (
    <section className={styles.hero} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--eh-teal-700)' }}
          >
            <BookMarked size={16} aria-hidden="true" /> Lexikon · {total} Begriffe · {categories} Bereiche
          </motion.span>

          <h1 aria-label={words.join(' ')}>
            {words.map((w, i) => (
              <motion.span
                key={w + i}
                className={`${styles.word} ${i >= 3 ? styles.accent : ''}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: '0.6em', rotate: 1.5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.08 + i * 0.07 }}
              >
                {w}{i < words.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </h1>

          <motion.p className={styles.heroLead} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            Jeder Eintrag beantwortet dieselben vier Fragen: Was ist das, was kostet es, wie läuft es ab — und betrifft es mein Haus? Sachlich, mit Prüfpunkten, ohne Fachchinesisch.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label className={styles.search}>
              <Search size={20} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(ev) => onQuery(ev.target.value)}
                placeholder="Begriff, Synonym oder Thema suchen …"
                aria-label="Lexikon durchsuchen"
                autoComplete="off"
                enterKeyHint="search"
              />
              {query ? (
                <button type="button" className={styles.searchClear} onClick={() => onQuery('')} aria-label="Suche leeren"><X size={16} /></button>
              ) : (
                <span className={styles.kbd} aria-hidden="true">/</span>
              )}
            </label>
            <div className={styles.quick}>
              <span>Häufig gesucht:</span>
              {['Wärmepumpe', 'Schimmel', 'Energieausweis', 'Rückstau', 'FI-Schalter'].map((t) => (
                <button key={t} type="button" onClick={() => onQuick(t)}>{t}</button>
              ))}
            </div>
          </motion.div>

          <motion.div className={styles.heroMeta} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
            <span><ShieldCheck size={15} aria-hidden="true" /> Kostenrahmen aus echten Anfrageverläufen</span>
            <span><Sparkles size={15} aria-hidden="true" /> Jeder Begriff führt zu einem konkreten nächsten Schritt</span>
          </motion.div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <motion.div className={styles.stack} style={{ rotateX, rotateY }}>
            {featured.map((e, i) => {
              const depth = featured.length - 1 - i; // 0 = vorderste Karte
              return (
                <motion.a
                  key={e.slug}
                  href={`/lexikon/${e.slug}`}
                  className={styles.stackCard}
                  tabIndex={-1}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={{ opacity: 1 - depth * 0.08, y: -depth * 44, scale: 1 - depth * 0.06, z: -depth * 60 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.3 + depth * 0.1 }}
                  whileHover={{ y: -depth * 44 - 8, scale: 1 - depth * 0.06 + 0.01 }}
                  style={{ zIndex: 10 - depth, transformStyle: 'preserve-3d' }}
                >
                  <div className={styles.entryTop}>
                    <span className={styles.entryCat}>{e.kategorieName}</span>
                    <RelevanzBadge relevanz={e.relevanz} />
                  </div>
                  <h3>{e.begriff}</h3>
                  <p>{e.kurz}</p>
                  <div className={styles.stackFoot}>
                    <span>{e.lesezeit} Min. Lesezeit</span>
                    <strong>Eintrag öffnen <ArrowRight size={14} /></strong>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
