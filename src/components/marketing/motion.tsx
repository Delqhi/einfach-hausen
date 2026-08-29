'use client';

/**
 * Motion layer for the public marketing website.
 *
 * Contract rules (DESIGN.md §2, §11, §12):
 * - Initial hidden state is ONLY set via GSAP at runtime. Without JavaScript
 *   nothing is ever hidden (no CSS-side pre-hiding).
 * - Animations use transform/opacity only -> no layout shift.
 * - prefers-reduced-motion: duration 0 / final state only.
 * - No bounce/elastic easing, no permanent motion, no scroll theatrics.
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REVEAL_DURATION = 0.7;
const EASE = 'power3.out';
const START = 'top 85%';

function animateIn(
  targets: gsap.TweenTarget,
  trigger: Element,
  opts: { y: number; delay?: number; stagger?: number; once?: boolean }
) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(targets, { autoAlpha: 0, y: opts.y }, {
      autoAlpha: 1,
      y: 0,
      duration: REVEAL_DURATION,
      delay: opts.delay ?? 0,
      stagger: opts.stagger ?? 0,
      ease: EASE,
      scrollTrigger: { trigger, start: START, once: opts.once ?? true },
    });
  });

  // Reduced motion: no animation, only guarantee the final state.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
  });

  return () => mm.revert();
}

export function Reveal({ children, delay = 0, y = 28, className, once = true }: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    return animateIn(el, el, { y, delay, once });
  }, { scope: ref, dependencies: [delay, y, once] });

  return <div ref={ref} className={className}>{children}</div>;
}

export function Stagger({ children, className, gap = 0.08, y = 24 }: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || el.children.length === 0) return;
    return animateIn(Array.from(el.children), el, { y, stagger: gap, once: true });
  }, { scope: ref, dependencies: [gap, y] });

  return <div ref={ref} className={className}>{children}</div>;
}

/**
 * Client wrapper that tracks window scroll and marks the contained <header>
 * with data-scrolled="true" once the page is scrolled more than 8px.
 *
 * Rendered with display:contents so the <header> stays a direct layout child
 * of the site root and position:sticky keeps working (the wrapper creates no
 * box, so it cannot become the sticky containing block).
 */
export function ScrollShadow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    const header = root?.querySelector('header');
    if (!header) return;

    const update = () => {
      if (window.scrollY > 8) header.setAttribute('data-scrolled', 'true');
      else header.removeAttribute('data-scrolled');
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => window.removeEventListener('scroll', update);
  }, { scope: ref });

  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
}

/**
 * Alternative integration: render this as a child INSIDE the <header>.
 * It has no visible output; it toggles data-scrolled on the enclosing header.
 */
export function HeaderState() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const header = ref.current?.closest('header');
    if (!header) return;

    const update = () => {
      if (window.scrollY > 8) header.setAttribute('data-scrolled', 'true');
      else header.removeAttribute('data-scrolled');
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => window.removeEventListener('scroll', update);
  });

  return <span ref={ref} aria-hidden="true" style={{ display: 'none' }} />;
}
