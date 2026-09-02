/**
 * NewsletterAppPromo — App-Download-Promo-Sektion (letzte Sektion ueber dem Footer).
 *
 * Operator-Referenz: hellgrauer Seitenhintergrund → riesige weisse 34px-Card
 * → viel Whitespace → linke Typografie → schwarze Store-Buttons → rechts
 * angeschnittenes iPhone, das unten bewusst aus der Card herauslaeuft.
 *
 * Operator-Anforderungen (T-0211, Korrektur 2026-09-02):
 * - Bewirbt die EINFACH-HAUSEN-APP (nicht Newsletter).
 * - Das Handy-Mockup zeigt einen echten App-Screenshot (Default:
 *   /images/premium/app-preview-home.png (echter Auth-Screenshot der Owner-App-Homescreens)).
 * - Scroll-Motion: das Handy schiebt sich beim Scrollen von unten in die Card
 *   (GSAP ScrollTrigger, wie Reveal in motion.tsx — nur transform/opacity,
 *   prefers-reduced-motion setzt den Endzustand direkt, kein JS = sichtbar).
 *
 * Kontrakt T-0211: Vorgebaut durch local-agent (fc8ed40, Update: app-src + scroll-motion).
 * Einbau in die Startseite (direkt ueber dem Footer) durch chatgpt-web NACH dem
 * T-0210-Merge. Nicht auf design/premium-consumer-v1 verschieben.
 */
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Badge } from '@/components/ui/badge';
import styles from './newsletter-app-promo.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type NewsletterAppPromoProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  appStoreHref?: string;
  googlePlayHref?: string;
  phoneImageSrc?: string;
};

export function NewsletterAppPromo({
  eyebrow = 'Einfach Hausen App',
  title = 'Dein Zuhause. Immer dabei.',
  description = 'Hausanliegen beschreiben, Angebote vergleichen, Aufträge verfolgen und deine Hausakte dabei haben — mit der Einfach-Hausen-App hast du dein Zuhause auch unterwegs im Blick.',
  appStoreHref = '#',
  googlePlayHref = '#',
  phoneImageSrc = '/images/premium/app-preview-home.png',
}: NewsletterAppPromoProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-Motion: Phone schiebt sich von unten in die Card (wie Reveal:
  // nur transform/opacity, initial hidden NUR per GSAP zur Laufzeit, kein
  // CSS-Pre-Hiding; prefers-reduced-motion springt direkt in den Endzustand).
  useGSAP(() => {
    const section = sectionRef.current;
    const phone = section?.querySelector<HTMLElement>(`.${styles.phoneWrap}`);
    if (!section || !phone) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 72%', once: true },
      });
      // Phone: tief von unten hochgleiten, mit kleiner Rotation einpendeln
      tl.fromTo(
        phone,
        { y: 260, autoAlpha: 0, rotate: 6 },
        { y: 0, autoAlpha: 1, rotate: 0, duration: 1.1, ease: 'power3.out' },
      );
      // Copy-Seite folgt leicht versetzt
      tl.fromTo(
        `.${styles.newsletterContent}`,
        { y: 34, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.7',
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([phone, `.${styles.newsletterContent}`], { y: 0, autoAlpha: 1, rotate: 0 });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.newsletterSection} aria-label="Einfach Hausen App">
      <div className={styles.newsletterCard}>
        {/* LEFT */}
        <div className={styles.newsletterContent}>
          <Badge variant="outline" className={styles.newsletterEyebrow}>{eyebrow}</Badge>
          <h2 className={styles.newsletterTitle}>{title}</h2>
          <p className={styles.newsletterDescription}>{description}</p>
          <div className={styles.newsletterStoreButtons}>
            <a href={appStoreHref} className={styles.storeButton} aria-label="Einfach Hausen im App Store laden">
              <AppleLogo />
              <div className={styles.storeButtonText}>
                <span className={styles.storeButtonSmall}>Laden im</span>
                <span className={styles.storeButtonLarge}>App Store</span>
              </div>
            </a>
            <a href={googlePlayHref} className={styles.storeButton} aria-label="Einfach Hausen bei Google Play laden">
              <GooglePlayLogo />
              <div className={styles.storeButtonText}>
                <span className={styles.storeButtonSmall}>Jetzt bei</span>
                <span className={styles.storeButtonLarge}>Google Play</span>
              </div>
            </a>
          </div>
        </div>
        {/* RIGHT */}
        <div className={styles.newsletterPhoneArea}>
          <PhoneMockup imageSrc={phoneImageSrc} />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  PHONE                                     */
/* -------------------------------------------------------------------------- */

function PhoneMockup({ imageSrc }: { imageSrc: string }) {
  return (
    <div className={styles.phoneWrap}>
      <div className={styles.phone}>
        <div className={`${styles.phoneSideButton} ${styles.phoneSideButton1}`} />
        <div className={`${styles.phoneSideButton} ${styles.phoneSideButton2}`} />
        <div className={`${styles.phoneSideButton} ${styles.phoneSideButton3}`} />
        <div className={styles.phoneInner}>
          <div className={styles.phoneNotch}>
            <div className={styles.phoneSpeaker} />
            <div className={styles.phoneCamera} />
          </div>
          <Image
            src={imageSrc}
            alt="Vorschau der Einfach-Hausen-App"
            fill
            sizes="410px"
            className={styles.phoneScreenshot}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  ICONS                                     */
/* -------------------------------------------------------------------------- */

function AppleLogo() {
  return (
    <svg className={styles.appleLogo} viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M36.77 27.66c.04-4.43 3.63-6.56 3.79-6.66-2.07-3.03-5.29-3.44-6.43-3.47-2.7-.29-5.32 1.62-6.7 1.62-1.41 0-3.54-1.59-5.82-1.54-2.94.05-5.69 1.75-7.2 4.38-3.11 5.39-.79 13.3 2.19 17.66 1.49 2.13 3.23 4.51 5.51 4.43 2.23-.09 3.07-1.42 5.77-1.42 2.67 0 3.47 1.42 5.8 1.37 2.4-.04 3.91-2.14 5.35-4.29 1.72-2.45 2.41-4.86 2.44-4.99-.06-.02-4.64-1.77-4.7-7.09Z"
      />
      <path
        fill="currentColor"
        d="M32.37 14.67c1.2-1.5 2.02-3.54 1.79-5.61-1.73.08-3.89 1.2-5.14 2.67-1.1 1.28-2.09 3.4-1.83 5.39 1.95.15 3.96-.99 5.18-2.45Z"
      />
    </svg>
  );
}

function GooglePlayLogo() {
  return (
    <svg className={styles.googlePlayLogo} viewBox="0 0 48 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#00D6FF" d="M5 4.3c-.72.82-1.13 2.08-1.13 3.63v36.14c0 1.55.41 2.81 1.13 3.63l.16.15L25.4 27.62v-.48L5.16 4.15 5 4.3Z" />
      <path fill="#00F076" d="M32.16 34.4 25.4 27.62v-.48l6.77-6.78.16.09 8.02 4.56c2.29 1.3 2.29 3.44 0 4.75l-8.02 4.56-.17.08Z" />
      <path fill="#FFD13B" d="m32.33 34.32-6.93-6.94L5 47.7c1.15 1.21 3.05 1.35 5.19.14l22.14-13.52Z" />
      <path fill="#FF3A44" d="M32.33 20.44 10.19 6.92C8.05 5.71 6.15 5.85 5 7.06L25.4 27.38l6.93-6.94Z" />
    </svg>
  );
}

export default NewsletterAppPromo;
