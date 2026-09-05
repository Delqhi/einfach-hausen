'use client';

/**
 * Client-Bausteine der Lexikon-Detailseite. Alles transform/opacity, alles
 * reduced-motion-fähig (MotionConfig reducedMotion="user"). Die Inhalte sind
 * ohne JavaScript vollständig sichtbar — Motion kommt on top.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { STUFE_LABEL, type Stufe } from '@/lib/lexikon';
import styles from './lexikon.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

export function DetailMotionConfig({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: EASE }}>{children}</MotionConfig>;
}

/** Fixe Fortschrittslinie unter dem Header — Scroll-Position der ganzen Seite. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <div className={styles.progress} aria-hidden="true">
      <motion.i style={{ scaleX }} />
    </div>
  );
}

/** Drei Orientierungsstufen als segmentierte Balken, die beim Eintritt füllen. */
export function Gauges({ stufen }: { stufen: { kosten: Stufe; aufwand: Stufe; dringlichkeit: Stufe } }) {
  const rows: Array<{ label: string; value: Stufe; hot: boolean }> = [
    { label: 'Kosten', value: stufen.kosten, hot: false },
    { label: 'Aufwand', value: stufen.aufwand, hot: false },
    { label: 'Dringlichkeit', value: stufen.dringlichkeit, hot: stufen.dringlichkeit >= 3 },
  ];
  return (
    <div className={styles.gauges}>
      {rows.map((r, ri) => (
        <div key={r.label} className={styles.gauge} role="img" aria-label={`${r.label}: ${STUFE_LABEL[r.value]} (Stufe ${r.value} von 4)`}>
          <small>{r.label}</small>
          <span className={styles.gaugeTrack} aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <i key={n} data-hot={r.hot}>
                {n <= r.value && (
                  <motion.b
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.2 + ri * 0.12 + n * 0.07 }}
                  />
                )}
              </i>
            ))}
          </span>
          <strong>{STUFE_LABEL[r.value]}</strong>
        </div>
      ))}
    </div>
  );
}

/** Sticky-Inhaltsverzeichnis mit Scroll-Spy (IntersectionObserver, kein Scroll-Handler). */
export function Toc({ items }: { items: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((x): x is HTMLElement => Boolean(x));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className={styles.toc} aria-label="Inhalt dieses Eintrags">
      <span className={styles.tocLabel}>Auf dieser Seite</span>
      {items.map((i) => (
        <a key={i.id} href={`#${i.id}`} aria-current={active === i.id ? 'true' : undefined}>{i.label}</a>
      ))}
      <div className={styles.tocCta}>
        <strong>Betrifft dich das?</strong>
        Beschreib dein Anliegen — Einordnung und Kostenrahmen kommen von uns.
        <Link href="/#anliegen" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--eh-teal-700)' }}>Anliegen starten <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
    </nav>
  );
}

/** Vertikale Ablauf-Timeline: Schiene füllt sich mit dem Scroll, Punkte aktivieren sich in der Lesezone. */
export function AblaufTimeline({ items }: { items: Array<{ title: string; text: string }> }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState<number>(-1);
  const step = useTransform(scrollYProgress, (v) => Math.min(items.length - 1, Math.floor(v * items.length + 0.15)));
  // Reduced motion: alle Schritte sofort aktiv, kein Scroll-Abo. Sonst folgt der
  // aktive Punkt dem gescrubbten Fortschritt (Subscription auf externen MotionValue).
  const active = reduce ? items.length - 1 : scrolled;

  useEffect(() => {
    if (reduce) return;
    const unsub = step.on('change', (v) => setScrolled(v));
    return () => unsub();
  }, [step, reduce]);

  return (
    <ol ref={ref} className={styles.timeline} style={{ listStyle: 'none', margin: 0 }}>
      <span className={styles.rail} aria-hidden="true" />
      <motion.span className={styles.railFill} aria-hidden="true" style={{ scaleY: reduce ? 1 : scaleY }} />
      {items.map((it, i) => (
        <motion.li
          key={it.title}
          className={`${styles.tItem} ${i <= active ? 'isActive' : ''}`}
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
        >
          <h3><span>0{i + 1}</span>{it.title}</h3>
          <p>{it.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

/** Prüfpunkte als abhakbare Liste — Fortschritt führt zum konkreten nächsten Schritt. */
export function Checklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  const count = done.filter(Boolean).length;
  const ratio = items.length ? count / items.length : 0;
  const toggle = (i: number) => setDone((d) => d.map((v, j) => (j === i ? !v : v)));

  return (
    <div className={styles.check}>
      {items.map((t, i) => (
        <motion.button
          key={t}
          type="button"
          className={styles.checkItem}
          aria-pressed={done[i]}
          onClick={() => toggle(i)}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
          whileTap={{ scale: 0.985 }}
        >
          <span className={styles.checkBox} aria-hidden="true">
            <motion.span initial={false} animate={{ scale: done[i] ? 1 : 0, opacity: done[i] ? 1 : 0 }} transition={{ duration: 0.25, ease: EASE }} style={{ display: 'inline-flex' }}>
              <Check size={14} strokeWidth={3} />
            </motion.span>
          </span>
          <span>{t}</span>
        </motion.button>
      ))}
      <div className={styles.checkSum} aria-live="polite">
        <strong>{count === 0 ? 'Hak ab, was auf dein Haus zutrifft.' : count === items.length ? 'Alle Punkte treffen zu — das ist ein klares Anliegen.' : `${count} von ${items.length} Punkten treffen zu.`}</strong>
        <span className={styles.checkBarTrack} aria-hidden="true"><i style={{ transform: `scaleX(${ratio})` }} /></span>
        {count > 0 && (
          <Link href="/#anliegen" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--eh-teal-700)' }}>
            Als Anliegen beschreiben <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
