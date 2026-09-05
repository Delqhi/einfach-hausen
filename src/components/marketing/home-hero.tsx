'use client';

/**
 * HomeHero v2 – "Betriebszentrale für dein Zuhause".
 *
 * Motion contract (DESIGN.md §2/§11/§12, extended for the hero – see
 * docs/HERO_MOTION.md):
 * - Hidden states are set by GSAP at runtime only. No CSS pre-hiding.
 * - transform/opacity only (plus SVG dashoffset for the line draw).
 * - One master timeline: stage → blueprint → headline → intake → panel →
 *   facts → orchestration loop. Everything shares one clock.
 * - prefers-reduced-motion: final state only, orchestration shows one frame.
 * - Ambient motion (glow drift, loop) pauses when the hero leaves the viewport.
 *
 * Port note: in the repo, replace `<IntakeForm variant="hero" />` with
 * `<IntakeForm variant="hero" />` and `<a>` with `next/link`. The typewriter
 * finds any `input|textarea` inside `[data-h="intake"]`.
 */

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Check } from 'lucide-react';
import { IntakeForm } from '@/components/home/intake-form';
import styles from './home-hero.module.css';
import { HeroOrchestration, buildOrchestration, setOrchestrationStatic } from './hero-orchestration';

gsap.registerPlugin(ScrollTrigger, useGSAP);


const PHRASES = [
  'Heizung macht seit gestern Geräusche …',
  'Dachrinne läuft bei Regen über',
  'Wer wartet eigentlich unsere Wärmepumpe?',
  'Steckdose im Bad funkt – ist das gefährlich?',
  'Wo ist die Rechnung vom Dachdecker 2022?',
  'Garten soll vor dem Winter fertig sein',
];

const FACTS = [
  { value: 12, suffix: '', label: 'Leistungsbereiche mit geprüften Betrieben' },
  { value: 1, suffix: '', label: 'Ansprechpartner mit Name, Betrieb und Nummer' },
  { value: 0, suffix: '%', label: 'Provision pro Auftrag – Partner bleiben Rechnungssteller' },
  { value: 15, suffix: '%', label: 'Dauer-Vorteil für die ersten 1.000 Pilot-Haushalte' },
] as const;

const HEADLINE = ['Die Betriebszentrale', 'für dein Zuhause.'] as const;

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      const lines = q('[data-h="line"]');
      const eyebrow = q('[data-h="eyebrow"]');
      const lead = q('[data-h="lead"]');
      const intake = q('[data-h="intake"]');
      const proof = q('[data-h="proof"] li');
      const secondary = q('[data-h="secondary"]');
      const visual = q('[data-h="visual"]');
      const glows = q('[data-h="glow"]');
      const grid = q('[data-h="grid"]');
      const facts = q('[data-h="fact"]');
      const bpPaths = q<SVGGeometryElement>('[data-h="blueprint"] path, [data-h="blueprint"] rect, [data-h="blueprint"] circle');
      const stroke = q<SVGPathElement>('[data-h="stroke"] path')[0];
      const orchestrationRoot = q<HTMLElement>('[data-o="tilt"]')[0];
      const tilt = q('[data-o="tilt"]');
      const floatA = q('[data-o="float-a"]');
      const floatB = q('[data-o="float-b"]');
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('[data-h="intake"] input, [data-h="intake"] textarea');

      const mm = gsap.matchMedia();

      /* ---------------- Full motion ---------------- */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Initial states – JS only.
        gsap.set(lines, { yPercent: 112 });
        gsap.set([eyebrow, lead, intake, proof, secondary], { y: 22 });
        gsap.set(visual, { y: 64, rotateX: 9, transformPerspective: 1400, transformOrigin: '50% 100%' });
        gsap.set([glows, grid], { autoAlpha: 0 });
        gsap.set(facts, { y: 18 });
        bpPaths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        if (stroke) {
          const len = stroke.getTotalLength();
          gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len });
        }

        const loop = buildOrchestration(orchestrationRoot);

        /* Count-up for the facts rail (de-DE formatting). */
        const countUp = () => {
          q<HTMLElement>('[data-count]').forEach((el) => {
            const target = Number(el.dataset.count);
            const o = { v: 0 };
            gsap.to(o, {
              v: target,
              duration: 1.4,
              ease: 'power3.out',
              onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('de-DE'); },
            });
          });
        };

        const master = gsap.timeline({ defaults: { ease: 'power4.out' } });
        master
          .to(glows, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, 0)
          .to(grid, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0.2)
          .to(bpPaths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.04 }, 0.1)
          .to(eyebrow, { y: 0, duration: 0.7 }, 0.3)
          .to(lines, { yPercent: 0, duration: 1.05, stagger: 0.12 }, 0.42)
          .to(stroke, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' }, 1.15)
          .to(lead, { y: 0, duration: 0.85 }, 0.85)
          .to(intake, { y: 0, duration: 0.95 }, 1.0)
          .to(proof, { y: 0, duration: 0.6, stagger: 0.07 }, 1.2)
          .to(secondary, { y: 0, duration: 0.6 }, 1.4)
          .to(visual, { y: 0, rotateX: 0, duration: 1.3 }, 0.95)
          .to(facts, { y: 0, duration: 0.7, stagger: 0.08 }, 1.45)
          .call(countUp, [], 1.5)
          .call(() => loop.play(0), [], 1.75);

        /* Ambient glow drift – slow, transform only. */
        const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
        drift
          .to(glows[0], { x: -60, y: 50, duration: 14 }, 0)
          .to(glows[1], { x: 70, y: -40, duration: 17 }, 0);

        /* Pause ambient/loop when the hero is out of view. */
        const visibility = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (self.isActive) { drift.play(); if (master.progress() === 1) loop.play(); }
            else { drift.pause(); loop.pause(); }
          },
        });

        /* Scroll parallax – subtle depth, scrubbed. */
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
          defaults: { ease: 'none' },
        });
        // Note: `visual` owns the intro y-tween; parallax lives on `tilt`
        // (rotate-only elsewhere) so both tweens never fight over one property.
        scrollTl
          .to(q('[data-h="copy"]'), { y: -50 }, 0)
          .to(tilt, { y: -110 }, 0)
          .to(q('[data-h="blueprint"]'), { y: 60 }, 0)
          .to(q('[data-h="facts"]'), { y: -20 }, 0);

        /* Typewriter in the intake placeholder. Pauses on focus / value. */
        let typer: gsap.core.Timeline | undefined;
        let onFocus: (() => void) | undefined;
        let onBlur: (() => void) | undefined;
        if (input) {
          const staticPlaceholder = input.placeholder;
          typer = gsap.timeline({ repeat: -1, paused: true, delay: 0 });
          PHRASES.forEach((phrase) => {
            const o = { n: 0 };
            typer!
              .to(o, {
                n: phrase.length,
                duration: phrase.length * 0.042,
                ease: 'none',
                onUpdate: () => { input.placeholder = phrase.slice(0, Math.round(o.n)) + '|'; },
              })
              .to({}, { duration: 1.5 })
              .to(o, {
                n: 0,
                duration: phrase.length * 0.016,
                ease: 'none',
                onUpdate: () => { input.placeholder = phrase.slice(0, Math.round(o.n)) + '|'; },
              })
              .to({}, { duration: 0.35 });
          });
          master.call(() => typer!.play(0), [], 1.9);
          onFocus = () => { typer!.pause(); input.placeholder = staticPlaceholder; };
          onBlur = () => { if (!input.value) typer!.play(); };
          input.addEventListener('focus', onFocus);
          input.addEventListener('blur', onBlur);
        }

        /* Pointer tilt – fine pointers only. */
        let onMove: ((e: PointerEvent) => void) | undefined;
        let onLeave: (() => void) | undefined;
        const visualEl = visual[0] as HTMLElement | undefined;
        if (visualEl && window.matchMedia('(pointer: fine)').matches) {
          const rx = gsap.quickTo(tilt, 'rotateX', { duration: 0.6, ease: 'power3.out' });
          const ry = gsap.quickTo(tilt, 'rotateY', { duration: 0.6, ease: 'power3.out' });
          const ax = gsap.quickTo(floatA, 'x', { duration: 0.8, ease: 'power3.out' });
          const ay = gsap.quickTo(floatA, 'y', { duration: 0.8, ease: 'power3.out' });
          const bx = gsap.quickTo(floatB, 'x', { duration: 0.8, ease: 'power3.out' });
          const by = gsap.quickTo(floatB, 'y', { duration: 0.8, ease: 'power3.out' });
          onMove = (e: PointerEvent) => {
            const r = visualEl.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * 6);
            ry(px * 8);
            ax(px * 18); ay(py * 14);
            bx(px * -14); by(py * -10);
          };
          onLeave = () => { rx(0); ry(0); ax(0); ay(0); bx(0); by(0); };
          visualEl.addEventListener('pointermove', onMove);
          visualEl.addEventListener('pointerleave', onLeave);
        }

        return () => {
          master.kill();
          loop.kill();
          drift.kill();
          typer?.kill();
          visibility.kill();
          scrollTl.scrollTrigger?.kill();
          scrollTl.kill();
          if (input && onFocus && onBlur) {
            input.removeEventListener('focus', onFocus);
            input.removeEventListener('blur', onBlur);
          }
          if (visualEl && onMove && onLeave) {
            visualEl.removeEventListener('pointermove', onMove);
            visualEl.removeEventListener('pointerleave', onLeave);
          }
        };
      });

      /* ---------------- Reduced motion: final state only ---------------- */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([lines], { yPercent: 0 });
        gsap.set([eyebrow, lead, intake, proof, secondary, visual, glows, grid, facts], { autoAlpha: 1, y: 0, rotateX: 0 });
        gsap.set([...bpPaths, ...(stroke ? [stroke] : [])], { strokeDasharray: 'none', strokeDashoffset: 0 });
        q<HTMLElement>('[data-count]').forEach((el) => {
          el.textContent = Number(el.dataset.count).toLocaleString('de-DE');
        });
        setOrchestrationStatic(orchestrationRoot);
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className={styles.hero} id="anliegen" ref={ref}>
      <Stage />

      <div className={styles.inner}>
        <div className={styles.copy} data-h="copy">
          <span className={styles.eyebrow} data-h="eyebrow">
            <i className={styles.eyebrowDot} aria-hidden="true" />
            Persönlicher Hausmanager
            <i className={styles.eyebrowSep} aria-hidden="true" />
            Pilotphase · regional
          </span>

          <h1 className={styles.title}>
            {HEADLINE.map((line, i) => (
              <span className={styles.lineMask} key={line}>
                <span className={styles.line} data-h="line">
                  {i === HEADLINE.length - 1 ? (
                    <>
                      für dein{' '}
                      <em className={styles.emph}>
                        Zuhause.
                        <svg className={styles.emphStroke} data-h="stroke" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M3 10 C 40 4, 110 3, 197 8" />
                        </svg>
                      </em>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className={styles.lead} data-h="lead">
            Heizung, Dach, Garten, Rechnungen: Du sagst in <strong>einem Satz</strong>, was ansteht. Wir ordnen ein, holen geprüfte Betriebe aus deiner Region, <strong>ein Mensch übernimmt</strong> – und alles bleibt dauerhaft in deiner Hausakte.
          </p>

          <div className={styles.intake} data-h="intake">
            <IntakeForm variant="hero" />
            <ul className={styles.proof} data-h="proof">
              <li><Check size={15} strokeWidth={2.5} aria-hidden="true" />Kostenlos starten</li>
              <li><Check size={15} strokeWidth={2.5} aria-hidden="true" />Ein Mensch aus deiner Region</li>
            </ul>
          </div>

          <Link className={styles.secondary} href="/so-funktionierts" data-h="secondary">
            So funktioniert&apos;s <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.visual} data-h="visual">
          <HeroOrchestration />
        </div>
      </div>

      <div className={styles.facts} data-h="facts">
        {FACTS.map((f) => (
          <div className={styles.fact} data-h="fact" key={f.label}>
            <span className={styles.factValue}>
              <span data-count={f.value}>0</span>
              {f.suffix && <span className={styles.factSuffix}>{f.suffix}</span>}
            </span>
            <span className={styles.factLabel}>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Background stage: glows, fine grid, blueprint line-draw. Decorative. */
function Stage() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <span className={`${styles.glow} ${styles.glowA}`} data-h="glow" />
      <span className={`${styles.glow} ${styles.glowB}`} data-h="glow" />
      <span className={styles.grid} data-h="grid" />
      <svg className={styles.blueprint} data-h="blueprint" viewBox="0 0 800 520" fill="none">
        {/* ground + house shell */}
        <path d="M0 500 H800" />
        <path d="M110 500 V262 L400 72 L690 262 V500" />
        <path d="M82 280 L400 44 L718 280" />
        {/* chimney */}
        <path d="M560 178 V104 H612 V212" />
        {/* floors */}
        <path d="M110 372 H690" />
        {/* door */}
        <rect x="372" y="404" width="56" height="96" rx="2" />
        <circle cx="416" cy="452" r="2.5" />
        {/* windows ground */}
        <rect x="170" y="404" width="72" height="56" rx="2" />
        <path d="M206 404 V460 M170 432 H242" />
        <rect x="558" y="404" width="72" height="56" rx="2" />
        <path d="M594 404 V460 M558 432 H630" />
        {/* windows upper */}
        <rect x="170" y="296" width="72" height="56" rx="2" />
        <path d="M206 296 V352 M170 324 H242" />
        <rect x="364" y="296" width="72" height="56" rx="2" />
        <path d="M400 296 V352 M364 324 H436" />
        <rect x="558" y="296" width="72" height="56" rx="2" />
        <path d="M594 296 V352 M558 324 H630" />
        {/* heating unit + solar */}
        <rect x="128" y="440" width="26" height="60" rx="3" />
        <path d="M140 440 V420 M134 420 H146" />
        <path d="M232 178 L292 138 M256 194 L316 154 M280 210 L340 170" />
        <path d="M222 172 L344 92 L378 114 L256 194 Z" />
        {/* dimension ticks */}
        <path d="M110 516 V508 M690 516 V508 M110 512 H690" />
        <path d="M740 262 H748 M740 500 H748 M744 262 V500" />
        {/* nodes */}
        <circle cx="141" cy="470" r="9" />
        <circle cx="586" cy="118" r="9" />
        <circle cx="300" cy="150" r="9" />
        <circle cx="400" cy="72" r="9" />
      </svg>
    </div>
  );
}
