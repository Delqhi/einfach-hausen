import { CalendarCheck2, Hammer, HardHat, House, Leaf, Paintbrush, ThumbsUp, Wrench } from 'lucide-react';
import { Reveal } from './motion';
import styles from './marketing.module.css';

const TRADES = [
  { icon: <Hammer size={19} aria-hidden="true" />, title: 'Handwerker', sub: 'Reparatur & Montage' },
  { icon: <Wrench size={19} aria-hidden="true" />, title: 'Hausmeister', sub: 'Kleine Arbeiten & Pflege' },
  { icon: <Paintbrush size={19} aria-hidden="true" />, title: 'Maler', sub: 'Anstrich & Renovierung' },
  { icon: <Leaf size={19} aria-hidden="true" />, title: 'Garten & Aussenbereich', sub: 'Pflege & Pflaster' },
] as const;

const OWNERS = [
  { icon: <House size={19} aria-hidden="true" />, title: 'Eigenheimbesitzer', sub: 'Haus & Wohnung' },
  { icon: <CalendarCheck2 size={19} aria-hidden="true" />, title: 'Vermieter', sub: 'Wartung im Blick behalten' },
  { icon: <ThumbsUp size={19} aria-hidden="true" />, title: 'WEG-Eigentümer', sub: 'Gemeinsame Projekte' },
] as const;

export function GatewaySection() {
  return (
    <section className={styles.gateway} aria-label="So verbindet Einfach Hausen">
      <div className={styles.gatewayInner}>
        <div className={styles.gatewayHead}>
          <Reveal><span className={styles.eyebrow}>So funktioniert Einfach Hausen</span></Reveal>
          <Reveal delay={0.08}>
            <h2>Ein Tor zwischen deinem <mark>Haus</mark> und den <mark>richtigen Menschen</mark>.</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p>Handwerker und Eigentümer treffen sich an einem Ort — ohne Lead-Handel, ohne anonyme Formulare.</p>
          </Reveal>
        </div>
        <svg className={styles.gatewayLines} viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 340 60 C 430 100, 470 150, 560 190" />
          <path d="M 340 160 C 430 180, 470 200, 560 210" />
          <path d="M 340 260 C 430 260, 470 260, 560 230" />
          <path d="M 640 190 C 730 160, 770 100, 860 60" />
          <path d="M 640 210 C 730 200, 770 180, 860 160" />
          <path d="M 640 230 C 730 260, 770 260, 860 260" />
        </svg>
        <div className={styles.gatewayCols}>
          <div className={styles.gatewayCol}>
            {TRADES.map((trade, index) => (
              <Reveal key={trade.title} delay={0.1 + index * 0.07}>
                <div className={styles.gatewayCard}>
                  <span className={styles.gatewayIcon}>{trade.icon}</span>
                  <span><strong>{trade.title}</strong><small>{trade.sub}</small></span>
                  <span className={styles.gatewayDot} aria-hidden="true" />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className={styles.gatewayHub}>
              <div className={styles.gatewayHubLogo} aria-hidden="true">
                {/* Brand contract (DESIGN.md LOGO_03): the real house mark, not a redrawn SVG. */}
                <svg viewBox="0 0 120 88" fill="none">
                  <path d="M38 34 L74 12 L96 26 V82 H52" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={styles.gatewayHubLabel}>einfachhausen</span>
            </div>
          </Reveal>
          <div className={styles.gatewayCol}>
            {[<House size={19} aria-hidden="true" key="h" />, <CalendarCheck2 size={19} aria-hidden="true" key="c" />, <ThumbsUp size={19} aria-hidden="true" key="t" />].map((icon, index) => (
              <Reveal key={index} delay={0.1 + index * 0.07}>
                <div className={styles.gatewayCard}>
                  <span className={styles.gatewayIcon}>{icon}</span>
                  <span><strong>{OWNERS[index].title}</strong><small>{OWNERS[index].sub}</small></span>
                  <span className={styles.gatewayDot} aria-hidden="true" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
