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
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

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
  const pathname = usePathname();

  useGSAP(() => {
    const root = ref.current;
    const header = root?.querySelector('header');
    if (!header) return;

    let ticking = false;
    const update = () => {
      if (window.scrollY > 8) header.setAttribute('data-scrolled', 'true');
      else header.removeAttribute('data-scrolled');
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.style.setProperty('--scroll-progress', max > 0 ? String(Math.min(1, window.scrollY / max)) : '0');
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, { scope: ref });

  // Mark the current page in the desktop nav (aria-current drives the style).
  useGSAP(() => {
    const root = ref.current;
    const links = root?.querySelectorAll<HTMLAnchorElement>('header nav a');
    if (!links) return;
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const active = href === pathname || (href !== '/' && pathname.startsWith(`${href}/`));
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, { dependencies: [pathname] });

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

/**
 * Scroll-scrubbed draw-in line. The element itself is the line (position and
 * size come from CSS); its scale is driven 0 -> 1 by scroll progress of the
 * enclosing section (parent element). transform-only, scrub -> ease:none,
 * reduced-motion renders the final state immediately.
 */
export function ScrubLine({ axis = 'y', className }: { axis?: 'x' | 'y'; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    const trigger = el?.parentElement;
    if (!el || !trigger) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const prop = axis === 'x' ? 'scaleX' : 'scaleY';
      gsap.fromTo(el, { [prop]: 0 }, {
        [prop]: 1,
        ease: 'none',
        scrollTrigger: { trigger, start: 'top 72%', end: 'bottom 55%', scrub: true },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { scaleX: 1, scaleY: 1 });
    });

    return () => mm.revert();
  }, { dependencies: [axis] });

  return <span ref={ref} className={className} aria-hidden="true" />;
}

/**
 * Toggles `activeClassName` on the wrapped element while it is in the reading
 * zone (used for step activation states). Class-only, no animation here.
 */
export function Activate({ children, className, activeClassName = 'isActive', start = 'top 72%' }: {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        end: 'bottom top',
        toggleClass: { targets: el, className: activeClassName },
      });
      return () => st.kill();
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      el.classList.add(activeClassName);
    });

    return () => mm.revert();
  }, { dependencies: [activeClassName, start] });

  return <div ref={ref} className={className}>{children}</div>;
}

/**
 * Draws an SVG path (stroke) once it enters the viewport. The path element
 * must carry its full length via CSS (stroke-dasharray/dashoffset start are
 * set here from getTotalLength). Reduced-motion: final state immediately.
 */
export function DrawPath({ children, className, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = ref.current;
    const path = root?.querySelector('path');
    if (!path) return;
    const length = path.getTotalLength();
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.1,
        delay,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 92%', once: true },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 });
    });

    return () => mm.revert();
  }, { dependencies: [delay] });

  return <span ref={ref} className={className} aria-hidden="true">{children}</span>;
}

/**
 * Inertial smooth scrolling for the marketing site (Lenis), driven by the
 * GSAP ticker so ScrollTrigger and Lenis share one clock (official recipe).
 * Respects prefers-reduced-motion: with reduce, native scrolling stays.
 */
export function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => mm.revert();
  });
  return null;
}

/**
 * Premium line reveal: splits the heading into lines (Intl.Segmenter-based,
 * umlaut-safe) and lets each line rise in after fonts are ready. Without JS
 * or with reduced motion the plain heading stays fully visible.
 */
export function SplitLines({ children, className, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let split: SplitText | undefined;
      let killed = false;
      document.fonts.ready.then(() => {
        if (killed) return;
        split = SplitText.create(el, { type: 'lines' });
        gsap.from(split.lines, {
          yPercent: 130,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.1,
          delay,
        });
      });
      return () => { killed = true; split?.revert(); };
    });

    return () => mm.revert();
  }, { dependencies: [delay] });

  return <h1 ref={ref} className={className}>{children}</h1>;
}

/**
 * Animiert alle path-Elemente im Gateway-Linien-SVG (DrawSVG-Ersatz via
 * dashoffset, scroll-gescrubbt). Reduced motion: Linien sofort sichtbar.
 */
export function GatewayLinesAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const paths = root.querySelectorAll('path');
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      paths.forEach((path) => {
        const len = (path as SVGPathElement).getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'none',
        stagger: 0.15,
        scrollTrigger: { trigger: root, start: 'top 65%', end: 'center 45%', scrub: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });
  return <div ref={ref}>{children}</div>;
}
