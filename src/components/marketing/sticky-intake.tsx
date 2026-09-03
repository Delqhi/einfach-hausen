'use client';

import { useEffect, useState } from 'react';
import { IntakeForm } from '@/components/home/intake-form';
import styles from './mkt.module.css';

/**
 * Appears after the hero intake has scrolled out of view and hides again
 * near the final CTA so the two big forms never compete with it.
 */
export function StickyIntake({ watch = '#anliegen', hideNear = '#final-cta' }: { watch?: string; hideNear?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(watch);
    const end = document.querySelector(hideNear);
    if (!hero) return;
    let heroOut = false;
    let endIn = false;
    const update = () => setVisible(heroOut && !endIn);
    const heroObs = new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { threshold: 0 });
    heroObs.observe(hero);
    let endObs: IntersectionObserver | undefined;
    if (end) {
      endObs = new IntersectionObserver(([e]) => { endIn = e.isIntersecting; update(); }, { rootMargin: '0px 0px -30% 0px' });
      endObs.observe(end);
    }
    return () => { heroObs.disconnect(); endObs?.disconnect(); };
  }, [watch, hideNear]);

  return (
    <div className={styles.stickyBar} data-visible={visible ? 'true' : 'false'} aria-hidden={!visible} inert={!visible}>
      <div className={styles.stickyBarInner}>
        <span className={styles.stickyBarText}>Was steht bei deinem Haus an?</span>
        <IntakeForm variant="compact" />
      </div>
    </div>
  );
}
