import gsap from 'gsap';
import {
  BellRing,
  CalendarCheck2,
  Camera,
  Check,
  Clock3,
  Euro,
  FileText,
  Flame,
  Home,
  MapPin,
  MessageCircle,
  Mic,
  Star,
  UserRound,
  Wrench,
} from 'lucide-react';
import styles from './home-hero.module.css';

/**
 * "Betriebszentrale" – the hero visual. Pure markup; all motion is driven by
 * `buildOrchestration()` from the parent timeline so intro and loop share one
 * clock. Selectors are data attributes (module-class independent).
 *
 * Content is truthful to PRODUCT_VISION.md: the customer decides
 * (Frage klären / Ansprechpartner / Auftrag), nothing is auto-booked, a real
 * person takes over, everything lands in the Hausakte.
 */

const RAIL = [
  { title: 'Anliegen', sub: 'Text, Foto, Sprache' },
  { title: 'Zuordnung', sub: 'Gewerk & Region' },
  { title: 'Partner', sub: 'geprüft & bewertet' },
  { title: 'Hausakte', sub: 'bleibt beim Haus' },
] as const;

const PARTNERS = [
  { initials: 'MB', name: 'Markus Bauer', firm: 'Heizungsbau Bauer GmbH', km: 6, rating: '4,9', slot: 'Di frei', match: 96, top: true },
  { initials: 'SK', name: 'Sanitär Kessler', firm: 'Meisterbetrieb', km: 11, rating: '4,8', slot: 'Do frei', match: 91, top: false },
  { initials: 'TW', name: 'Thermo Wagner', firm: 'Heizung · Klima', km: 18, rating: '4,7', slot: 'Fr frei', match: 84, top: false },
] as const;

export function HeroOrchestration() {
  return (
    <div className={styles.tilt} data-o="tilt">
      <div className={styles.panel} aria-label="Produktvorschau: So organisiert Einfach Hausen ein Anliegen – vom ersten Satz bis zur Hausakte" role="img">
        <div className={styles.panelBar}>
          <span className={styles.panelMark}><Home size={18} aria-hidden="true" /></span>
          <span>
            <small>Betriebszentrale · Musterstraße 12</small>
            <strong>Vorgang #142 · Heizung</strong>
          </span>
          <span className={styles.livePill}><i aria-hidden="true" />läuft</span>
        </div>

        <div className={styles.panelBody}>
          {/* Progress rail */}
          <div className={styles.rail}>
            <span className={styles.railTrack} aria-hidden="true"><span className={styles.railFill} data-o="rail-fill" /></span>
            {RAIL.map((step, i) => (
              <div className={styles.railStep} data-o="rail" data-index={i} data-state={i === 0 ? 'active' : 'idle'} key={step.title}>
                <span className={styles.railDot}><Check strokeWidth={3} aria-hidden="true" /></span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.sub}</small>
                </span>
              </div>
            ))}
          </div>

          {/* Scenes */}
          <div className={styles.scenes}>
            <span className={styles.scan} data-o="scan" aria-hidden="true" />

            {/* 1 · Anliegen */}
            <div className={styles.scene} data-scene="1">
              <span className={styles.sceneLabel}>Anliegen · gerade eben</span>
              <div className={styles.userBubble} data-s1="bubble">Heizung macht seit gestern Geräusche und der Druck fällt ab.</div>
              <div className={styles.attach} data-s1="attach">
                <span><Camera size={12} aria-hidden="true" />Foto</span>
                <span><Mic size={12} aria-hidden="true" />Sprachnotiz 0:12</span>
              </div>
              <div className={styles.assistant} data-s1="assistant">
                <p>Klingt nach Luft im System oder der Umwälzpumpe. Wie soll es weitergehen?</p>
                <div className={styles.choice} data-s1="choice"><MessageCircle size={14} aria-hidden="true" />Nur Frage klären</div>
                <div className={styles.choice} data-s1="choice"><UserRound size={14} aria-hidden="true" />Ansprechpartner finden</div>
                <div className={`${styles.choice} ${styles.choiceFeatured}`} data-s1="choice" data-featured>
                  <Wrench size={14} aria-hidden="true" />Auftrag organisieren
                  <em data-s1="selected">ausgewählt</em>
                </div>
              </div>
            </div>

            {/* 2 · Zuordnung */}
            <div className={styles.scene} data-scene="2">
              <span className={styles.sceneLabel}>Zuordnung · automatisch, du bestätigst</span>
              <div className={styles.chips}>
                <div className={styles.chip} data-s2="chip">
                  <Flame size={16} aria-hidden="true" />
                  <span><small>Gewerk</small><strong>Heizung &amp; Sanitär</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
                <div className={styles.chip} data-s2="chip">
                  <MapPin size={16} aria-hidden="true" />
                  <span><small>Region</small><strong>25 km um 71083 Herrenberg</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
                <div className={styles.chip} data-s2="chip">
                  <Clock3 size={16} aria-hidden="true" />
                  <span><small>Zeitfenster</small><strong>Diese Woche, vormittags</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
                <div className={styles.chip} data-s2="chip">
                  <Euro size={16} aria-hidden="true" />
                  <span><small>Kostenrahmen</small><strong>120 – 260 € Richtpreis</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
              </div>
            </div>

            {/* 3 · Partner */}
            <div className={styles.scene} data-scene="3">
              <span className={styles.sceneLabel}>Partner · geprüft, aus deiner Region</span>
              {PARTNERS.map((p) => (
                <div className={styles.partnerWrap} data-s3="partner" key={p.initials}>
                  <div className={`${styles.partner} ${p.top ? styles.partnerTop : ''}`}>
                    <span className={styles.avatar}>{p.initials}</span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.firm} · {p.km} km · <Star size={10} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-1px' }} /> {p.rating} · {p.slot}</small>
                    </span>
                    <span className={styles.match}>
                      <b><span data-s3="pct" data-value={p.match}>0</span> %</b>
                      <span className={styles.bar}><span className={styles.barFill} data-s3="bar" data-value={p.match} /></span>
                    </span>
                  </div>
                  {p.top && <span className={styles.tag} data-s3="tag">Empfohlen</span>}
                </div>
              ))}
              <div className={styles.appointment} data-s3="appointment">
                <CalendarCheck2 size={16} aria-hidden="true" />
                <span><strong>Du bestätigst:</strong> Di, 9:00 · Markus Bauer kommt persönlich</span>
              </div>
            </div>

            {/* 4 · Hausakte */}
            <div className={styles.scene} data-scene="4">
              <span className={styles.sceneLabel}>Hausakte · Musterstraße 12</span>
              <div className={styles.akte}>
                <div className={styles.akteHead}><strong>Mein Haus · Heizung</strong><span>3 Einträge</span></div>
                <div className={`${styles.akteRow} ${styles.akteRowNew}`} data-s4="row">
                  <time>2026</time><span className={styles.akteDot} />
                  <span><strong>Wartung &amp; Entlüftung</strong><small>Rechnung 184 € · Garantie bis 2028 · Markus Bauer</small></span>
                </div>
                <div className={styles.akteRow} data-s4="row">
                  <time>2025</time><span className={styles.akteDot} />
                  <span><strong>Dacharbeiten</strong><small>Garantiehinweis gespeichert</small></span>
                </div>
                <div className={styles.akteRow} data-s4="row">
                  <time>2024</time><span className={styles.akteDot} />
                  <span><strong>Anlage erfasst</strong><small>Heizung · Wartung planbar</small></span>
                </div>
              </div>
              <div className={styles.akteFoot} data-s4="foot">
                <BellRing size={15} aria-hidden="true" />
                <span>Nächste Wartung: wir erinnern dich automatisch in 12 Monaten.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating proof cards */}
      <span className={`${styles.float} ${styles.floatA}`} data-o="float-a" aria-hidden="true">
        <span className={styles.floatIcon}><CalendarCheck2 size={15} /></span>
        <span><strong>Termin bestätigt</strong><small>Di 9:00 · Markus Bauer</small></span>
      </span>
      <span className={`${styles.float} ${styles.floatB}`} data-o="float-b" aria-hidden="true">
        <span className={styles.floatIcon}><FileText size={15} /></span>
        <span><strong>Rechnung abgelegt</strong><small>Hausakte · Heizung</small></span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const SCENE_IN = { autoAlpha: 1, y: 0, duration: 0.45 } as const;
const SCENE_OUT = { autoAlpha: 0, y: -14, duration: 0.38, ease: 'power2.in' } as const;

function setRail(rail: HTMLElement[], active: number) {
  rail.forEach((el, i) => {
    el.dataset.state = i < active ? 'done' : i === active ? 'active' : 'idle';
  });
}

/**
 * Builds the looping "Vorgang" choreography. Returns a paused timeline the
 * parent adds to its master. transform/opacity only; no bounce/elastic.
 */
export function buildOrchestration(root: HTMLElement): gsap.core.Timeline {
  const q = gsap.utils.selector(root);
  const rail = q<HTMLElement>('[data-o="rail"]');
  const railFill = q('[data-o="rail-fill"]');
  const scan = q('[data-o="scan"]');
  const floatA = q('[data-o="float-a"]');
  const floatB = q('[data-o="float-b"]');
  const s = (n: number) => q(`[data-scene="${n}"]`);
  const pctEls = q<HTMLElement>('[data-s3="pct"]');

  const tl = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay: 1.4,
    defaults: { ease: 'power3.out' },
    onRepeat: () => setRail(rail, 0),
  });

  // Base states (JS only – nothing is hidden without JavaScript).
  tl.set([s(1), s(2), s(3), s(4)], { autoAlpha: 0, y: 16 })
    .set(railFill, { scaleY: 0 })
    .set(scan, { autoAlpha: 0, y: 0 })
    .set([floatA, floatB], { autoAlpha: 0, y: 10, scale: 0.96 })
    .call(() => setRail(rail, 0), [], 0.01);

  /* 1 · Anliegen */
  tl.to(s(1), SCENE_IN, 0.05)
    .from(q('[data-s1="bubble"]'), { autoAlpha: 0, y: 12, scale: 0.97, duration: 0.45 }, '<0.1')
    .from(q('[data-s1="attach"] span'), { autoAlpha: 0, y: 8, stagger: 0.08, duration: 0.35 }, '>-0.1')
    .from(q('[data-s1="assistant"]'), { autoAlpha: 0, y: 12, duration: 0.45 }, '>0.2')
    .from(q('[data-s1="choice"]'), { autoAlpha: 0, x: -10, stagger: 0.09, duration: 0.35 }, '>-0.15')
    .from(q('[data-s1="selected"]'), { autoAlpha: 0, duration: 0.3 }, '>0.45')
    .to(q('[data-featured]'), { scale: 1.02, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '<');

  /* 1 → 2 · Zuordnung */
  tl.to(s(1), SCENE_OUT, '+=0.75')
    .call(() => setRail(rail, 1))
    .to(railFill, { scaleY: 1 / 3, duration: 0.5, ease: 'power2.inOut' }, '<')
    .to(s(2), SCENE_IN, '<0.1')
    .fromTo(scan, { y: 0, autoAlpha: 0 }, { y: 320, autoAlpha: 0.6, duration: 1.3, ease: 'none' }, '<')
    .from(q('[data-s2="chip"]'), { autoAlpha: 0, y: 10, stagger: 0.24, duration: 0.4 }, '<0.05')
    .from(q('[data-s2="check"]'), { scale: 0, stagger: 0.24, duration: 0.35 }, '<0.28')
    .to(scan, { autoAlpha: 0, duration: 0.2 }, '>-0.2');

  /* 2 → 3 · Partner */
  const counters = pctEls.map((el) => ({ el, v: 0, target: Number(el.dataset.value) }));
  tl.to(s(2), SCENE_OUT, '+=0.65')
    .call(() => setRail(rail, 2))
    .to(railFill, { scaleY: 2 / 3, duration: 0.5, ease: 'power2.inOut' }, '<')
    .to(s(3), SCENE_IN, '<0.1')
    .from(q('[data-s3="partner"]'), { autoAlpha: 0, y: 14, stagger: 0.14, duration: 0.45 }, '<0.1')
    .to(q('[data-s3="bar"]'), { scaleX: (_i, el) => Number((el as HTMLElement).dataset.value) / 100, stagger: 0.14, duration: 0.8, ease: 'power2.out' }, '<0.2')
    .to(counters, {
      v: (i: number) => counters[i].target,
      stagger: 0.14,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate() {
        counters.forEach((c) => { c.el.textContent = String(Math.round(c.v)); });
      },
    }, '<')
    .from(q('[data-s3="tag"]'), { autoAlpha: 0, scale: 0.85, duration: 0.35 }, '>-0.25')
    .from(q('[data-s3="appointment"]'), { autoAlpha: 0, y: 10, duration: 0.4 }, '>0.25')
    .to(floatA, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, '<0.15');

  /* 3 → 4 · Hausakte */
  tl.to(s(3), SCENE_OUT, '+=0.95')
    .call(() => setRail(rail, 3))
    .to(railFill, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, '<')
    .to(s(4), SCENE_IN, '<0.1')
    .from(q('[data-s4="row"]'), { autoAlpha: 0, x: -10, stagger: 0.12, duration: 0.4 }, '<0.1')
    .from(q('[data-s4="foot"]'), { autoAlpha: 0, y: 10, duration: 0.4 }, '>0.1')
    .to(floatB, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, '<')
    .call(() => setRail(rail, 4), [], '>0.2');

  /* Hold, then clear for the next loop */
  tl.to(s(4), SCENE_OUT, '+=1.6')
    .to([floatA, floatB], { autoAlpha: 0, y: 8, scale: 0.96, duration: 0.35 }, '<')
    .to(railFill, { scaleY: 0, duration: 0.3, ease: 'power2.inOut' }, '<')
    .set(counters, { v: 0, onComplete: () => counters.forEach((c) => { c.el.textContent = '0'; }) });

  return tl;
}

/** Reduced motion: one truthful, complete frame – no animation. */
export function setOrchestrationStatic(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const rail = q<HTMLElement>('[data-o="rail"]');
  gsap.set(q('[data-scene]'), { autoAlpha: 0 });
  gsap.set(q('[data-scene="3"]'), { autoAlpha: 1, y: 0 });
  gsap.set(q('[data-s3="bar"]'), { scaleX: (_i, el) => Number((el as HTMLElement).dataset.value) / 100 });
  q<HTMLElement>('[data-s3="pct"]').forEach((el) => { el.textContent = el.dataset.value ?? '0'; });
  gsap.set(q('[data-o="rail-fill"]'), { scaleY: 2 / 3 });
  gsap.set(q('[data-o="scan"]'), { autoAlpha: 0 });
  gsap.set([q('[data-o="float-a"]'), q('[data-o="float-b"]')], { autoAlpha: 1, y: 0, scale: 1 });
  setRail(rail, 2);
}
