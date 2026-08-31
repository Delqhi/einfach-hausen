"use client";

import { useEffect, useRef } from "react";

// EH T-0208: animated number count-up for stat cards (premium data feel).
// Renders <span>{value}</span> and counts up on first visibility.
export function CountUp({ value, duration = 900, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = String(value); return; }
    done.current = true;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(eased * value));
        if (p < 1) requestAnimationFrame(tick); else el.textContent = String(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);
  return <span ref={ref} className={className}>{value}</span>;
}
