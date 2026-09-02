/**
 * NewsletterAppPromo — App-Download-Promo-Sektion (letzte Sektion ueber dem Footer).
 *
 * Aufbau (Operator-Referenz): hellgrauer Seitenhintergrund → riesige weisse 34px-Card
 * → viel Whitespace → linke Typografie → schwarze Store-Buttons → rechts angeschnittenes
 * iPhone, das unten bewusst aus der Card herauslaeuft.
 *
 * Kontrakt T-0211: Diese Datei ist VORGEBAUT (local-agent, 2026-09-02). Der Einbau in
 * die Startseite (direkt ueber dem Footer) erfolgt durch chatgpt-web NACH dem
 * T-0210-Merge. Nicht auf design/premium-consumer-v1 verschieben.
 *
 * Pure-React + CSS-Module Port der ChatGPT-Web-Referenz (NewsletterAppPromo.jsx/.css):
 * - globales `* { box-sizing }` ersetzt durch lokale Klassen (kein Seiten-Reset)
 * - <img> → next/image mit fill, damit das Projekt-Lint (no-img-element) greift
 * - button ohne type-fallback, aria-labels gesetzt
 */
import Image from 'next/image';
import styles from './newsletter-app-promo.module.css';

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
  description = 'Willst du als Erster wissen, wenn neue Funktionen, Komponenten oder Updates kommen? Melde dich für den Newsletter und bleib auf dem Laufenden — dein Hauskonto und deine Hausakte, auch unterwegs.',
  appStoreHref = '#',
  googlePlayHref = '#',
  phoneImageSrc,
}: NewsletterAppPromoProps) {
  return (
    <section className={styles.newsletterSection} aria-label="Einfach Hausen App und Newsletter">
      <div className={styles.newsletterCard}>
        {/* LEFT */}
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterEyebrow}>{eyebrow}</div>
          <h2 className={styles.newsletterTitle}>{title}</h2>
          <p className={styles.newsletterDescription}>{description}</p>
          <div className={styles.newsletterStoreButtons}>
            <a href={appStoreHref} className={styles.storeButton} aria-label="Im App Store laden">
              <AppleLogo />
              <div className={styles.storeButtonText}>
                <span className={styles.storeButtonSmall}>Laden im</span>
                <span className={styles.storeButtonLarge}>App Store</span>
              </div>
            </a>
            <a href={googlePlayHref} className={styles.storeButton} aria-label="Bei Google Play laden">
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

function PhoneMockup({ imageSrc }: { imageSrc?: string }) {
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
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Vorschau der Einfach-Hausen-App"
              fill
              sizes="410px"
              className={styles.phoneScreenshot}
            />
          ) : (
            <AppPreview />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         FALLBACK PHONE UI MOCK                             */
/* -------------------------------------------------------------------------- */

function AppPreview() {
  return (
    <div className={styles.appPreview}>
      <div className={styles.statusBar}>
        <span>9:41</span>
        <div className={styles.statusIcons}>
          <span className={styles.signalBars}>
            <i />
            <i />
            <i />
            <i />
          </span>
          <WifiIcon />
          <span className={styles.battery}>
            <span />
          </span>
        </div>
      </div>
      <div className={styles.appDarkHeader}>
        <div className={styles.appUserRow}>
          <div className={styles.appUser}>
            <div className={styles.avatar}>
              <span>A</span>
            </div>
            <span>Alexey</span>
          </div>
          <button className={styles.settingsButton} type="button" aria-label="Einstellungen">
            <SettingsIcon />
          </button>
        </div>
        <div className={styles.balanceArea}>
          <div className={styles.balanceBadge}>TOTAL BALANCE</div>
          <div className={styles.balanceValue}>$ 13 528,31</div>
        </div>
      </div>
      <div className={styles.appMain}>
        <div className={styles.goalCard}>
          <div className={styles.goalTop}>
            <span>Goal of the month</span>
            <strong>42%</strong>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressValue} />
          </div>
        </div>
        <div className={styles.budgetTitleRow}>
          <h3>Budget</h3>
          <div className={styles.filterIcon}>
            <span />
            <span />
          </div>
        </div>
        <div className={styles.budgetGrid}>
          <BudgetCard icon="🍔" title="Rest" percent="16%" amount="$ 828 left" variant="orange" />
          <BudgetCard icon="👜" title="Stores" percent="37%" amount="$ 828 left" variant="blue" />
          <BudgetCard icon="🏠" title="Home" percent="22%" amount="$ 640 left" variant="green" />
          <BudgetCard icon="🚗" title="Auto" percent="18%" amount="$ 510 left" variant="red" />
        </div>
      </div>
    </div>
  );
}

function BudgetCard({
  icon,
  title,
  percent,
  amount,
  variant,
}: {
  icon: string;
  title: string;
  percent: string;
  amount: string;
  variant: 'orange' | 'blue' | 'green' | 'red';
}) {
  const iconClass =
    variant === 'orange'
      ? styles.budgetIconOrange
      : variant === 'blue'
        ? styles.budgetIconBlue
        : variant === 'green'
          ? styles.budgetIconGreen
          : styles.budgetIconRed;
  return (
    <div className={styles.budgetCard}>
      <div className={styles.budgetCardTop}>
        <div className={`${styles.budgetIcon} ${iconClass}`}>{icon}</div>
        <strong>{percent}</strong>
      </div>
      <div className={styles.budgetCardBottom}>
        <div>
          <div className={styles.budgetCardTitle}>{title}</div>
          <div className={styles.budgetCardAmount}>{amount}</div>
        </div>
        <div className={styles.budgetArrow}>›</div>
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

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.wifiIcon} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true">
      <path d="M4 9.5a12.2 12.2 0 0 1 16 0" />
      <path d="M7 13a7.7 7.7 0 0 1 10 0" />
      <path d="M10.2 16.4a2.8 2.8 0 0 1 3.6 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06-2.12 2.12-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.46V20h-3v-.09a1.6 1.6 0 0 0-.97-1.46 1.6 1.6 0 0 0-1.77.32l-.06.06-2.12-2.12.06-.06A1.6 1.6 0 0 0 7.4 15a1.6 1.6 0 0 0-1.46-.97H6v-3h.09A1.6 1.6 0 0 0 7.55 10a1.6 1.6 0 0 0-.32-1.77l-.06-.06 2.12-2.12.06.06a1.6 1.6 0 0 0 1.77.32A1.6 1.6 0 0 0 12.09 5V5h3v.09a1.6 1.6 0 0 0 .97 1.46 1.6 1.6 0 0 0 1.77-.32l.06-.06L20 8.29l-.06.06a1.6 1.6 0 0 0-.32 1.77 1.6 1.6 0 0 0 1.46.97H21v3h-.09A1.6 1.6 0 0 0 19.4 15Z" />
    </svg>
  );
}

export default NewsletterAppPromo;
