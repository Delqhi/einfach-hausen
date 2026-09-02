import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, CalendarCheck2, CircleCheck, FileText, Home, MessageCircle, ReceiptText, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import styles from './marketing.module.css';
import premium from './premium.module.css';

const OWNER_HREF = '/register?role=homeowner';
const PARTNER_HREF = '/register?role=provider';

/**
 * Premium photo hero: visual category gallery for /leistungen (spec §10.2).
 * Real service photography instead of an abstract UI mockup.
 */
export function HeroCategoryGallery() {
  const cats = [
    { img: '/images/premium/category-heizung.jpg', label: 'Heizung & Sanitär' },
    { img: '/images/premium/category-elektro.jpg', label: 'Elektro & Energie' },
    { img: '/images/premium/category-dach.jpg', label: 'Dach & Gebäudehülle' },
    { img: '/images/premium/category-garten.jpg', label: 'Garten & Außen' },
  ] as const;
  return (
    <div className={premium.gallery} aria-hidden="true">
      <span className={`${premium.galleryCell} ${premium.galleryMain}`}>
        <Image src={cats[0].img} alt="" fill sizes="380px" />
        <span className={premium.galleryLabel}>{cats[0].label}</span>
      </span>
      {cats.slice(1).map((c) => (
        <span className={premium.galleryCell} key={c.img}>
          <Image src={c.img} alt="" fill sizes="200px" />
          <span className={premium.galleryLabel}>{c.label}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Premium photo hero: Hausakte composite for /hausakte (spec §10.2 —
 * strongest product/lifestyle composite page).
 */
export function HeroHausaktePhoto() {
  return (
    <div className={premium.akteHero} aria-hidden="true">
      <span className={premium.akteHeroImg}>
        <Image src="/images/premium/hausakte.jpg" alt="" fill sizes="460px" priority />
      </span>
      <span className={`${premium.akteFloatCard} ${premium.akteFloatTop}`}>
        <FileText size={16} aria-hidden="true" />
        <span><strong>Rechnung abgelegt</strong><small>Heizung · Vorgang #142</small></span>
      </span>
      <span className={`${premium.akteFloatCard} ${premium.akteFloatBottom}`}>
        <CircleCheck size={16} aria-hidden="true" />
        <span><strong>Wartung geplant</strong><small>Nächster Termin automatisch vorgeschlagen</small></span>
      </span>
    </div>
  );
}

/**
 * Shared editorial hero for public marketing routes that need a strong
 * consumer/lifestyle anchor without inventing a new page-specific visual
 * system. The image is decorative because the adjacent hero copy carries the
 * page meaning; the overlay provides a short, truthful product proof.
 */
export function HeroEditorialPhoto({ src, label, detail }: { src: string; label: string; detail: string }) {
  return (
    <div className={premium.editorialHeroPhoto} aria-hidden="true">
      <Image className={premium.editorialHeroPhotoImg} src={src} alt="" fill sizes="(max-width: 980px) 520px, 460px" priority />
      <span className={premium.editorialHeroProof}>
        <CircleCheck size={17} aria-hidden="true" />
        <span><strong>{label}</strong><small>{detail}</small></span>
      </span>
    </div>
  );
}

/**
 * Clickable hero mockup: the whole card links into the product funnel
 * (register/login). Structure: Link > stage (positioning context) >
 * card (clipped) + floating badges + hover hint pill.
 */
function MockLink({ href, label, floats, children }: {
  href: string;
  label: string;
  floats?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={styles.heroMockLink} aria-label={label}>
      <span className={styles.heroMockStage}>
        <span className={styles.productPreview}>{children}</span>
        {floats}
        <span className={styles.heroMockHint}>App öffnen <ArrowRight size={14} aria-hidden="true" /></span>
      </span>
    </Link>
  );
}

export function HeroChoices() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: kostenloses Hauskonto erstellen"
    floats={<span className={`${styles.floatCard} ${styles.floatCardA}`}><CalendarCheck2 size={17} aria-hidden="true" /><span><strong>Termin bestätigt</strong><small>Dachrinne · Di 9:00</small></span></span>}>
    <div className={styles.previewHead}><div className={styles.previewMark}><Home size={17} aria-hidden="true" /></div><div><small>Hausmeisterservice</small><strong>Was brauchst du gerade?</strong></div><span className={styles.livePill}>bereit</span></div>
    <div className={styles.previewBody}>
      <div className={styles.userBubble}>Meine Heizung macht seit gestern komische Geräusche.</div>
      <div className={styles.assistantBox}><p>Danach entscheidest du, wie es weitergeht.</p>
        <div className={styles.choice}><span className={styles.choiceIcon}><MessageCircle size={15} aria-hidden="true" /></span><span><strong>Frage klären</strong></span></div>
        <div className={styles.choice}><span className={styles.choiceIcon}><UserRound size={15} aria-hidden="true" /></span><span><strong>Ansprechpartner finden</strong></span></div>
        <div className={`${styles.choice} ${styles.choiceFeatured}`}><span className={styles.choiceIcon}><Wrench size={15} aria-hidden="true" /></span><span><strong>Auftrag organisieren</strong></span></div>
      </div>
    </div>
    <div className={styles.previewFoot}>Nichts wird automatisch beauftragt.</div>
  </MockLink>;
}

export function HeroTimeline() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: die digitale Hausakte öffnen"
    floats={<span className={`${styles.floatCard} ${styles.floatCardB}`}><FileText size={17} aria-hidden="true" /><span><strong>Rechnung abgelegt</strong><small>Hausakte · Energie</small></span></span>}>
    <div className={styles.previewCard}>
      <div className={styles.previewCardHead}><strong>Mein Haus · Hausakte</strong><span>geordnet</span></div>
      <div className={styles.timeline}>
        <div className={styles.timelineRow}><time>2026</time><span className={styles.timelineDot} /><div className={styles.timelineContent}><strong>Gartenpflege</strong><small>Ansprechpartner und Rechnung abgelegt</small></div></div>
        <div className={styles.timelineRow}><time>2025</time><span className={styles.timelineDot} /><div className={styles.timelineContent}><strong>Dacharbeiten</strong><small>Garantiehinweis gespeichert</small></div></div>
        <div className={styles.timelineRow}><time>2024</time><span className={styles.timelineDot} /><div className={styles.timelineContent}><strong>Heizung</strong><small>Anlage erfasst · Wartung planbar</small></div></div>
      </div>
    </div>
  </MockLink>;
}

const SERVICES: ReadonlyArray<[string]> = [
  ['Reparatur'], ['Elektro'], ['Heizung'], ['Dach'], ['Ausbau'], ['Garten'], ['Pflege'], ['Spezial'],
];

export function HeroServices() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: Leistungsbereiche im Hauskonto">
    <div className={styles.previewHead}><div className={styles.previewMark}><Wrench size={17} aria-hidden="true" /></div><div><small>Leistungsbereiche</small><strong>Vom Defekt bis zur Pflege</strong></div></div>
    <div className={styles.previewBody}>
      <div className={styles.heroServiceGrid}>
        {SERVICES.map(([label]) => <span className={styles.heroServiceChip} key={label}>{label}</span>)}
      </div>
      <p className={styles.heroMockNote}>Dein Einstieg bleibt das konkrete Anliegen – nicht die Kategorie.</p>
    </div>
  </MockLink>;
}

export function HeroPartner() {
  return <MockLink href={PARTNER_HREF} label="Produktvorschau: als Partner registrieren">
    <div className={styles.previewHead}><div className={styles.previewMark}><BadgeCheck size={17} aria-hidden="true" /></div><div><small>Partnernetzwerk</small><strong>Qualitätsmodell</strong></div></div>
    <div className={styles.previewBody}>
      <div className={styles.heroStatRow}><strong>0 %</strong><span>Auftragsprovision – du bleibst Rechnungssteller.</span></div>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Matching nach Eignung statt Tarif</div>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Konkrete Kundenbeziehungen bleiben sichtbar</div>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Planbare Monatstarife statt Vermittlungsgebühren</div>
    </div>
    <div className={styles.previewFoot}>Regional aktives Netzwerk geprüfter Betriebe.</div>
  </MockLink>;
}

export function HeroPlans() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: kostenloses Hauskonto starten">
    <div className={styles.previewBody}>
      <div className={styles.heroPlanGrid}>
        <div className={`${styles.heroPlan} ${styles.heroPlanFeatured}`}><small>Eigenheimbesitzer</small><strong>0 €</strong><span>FREE · Hauskonto</span></div>
        <div className={styles.heroPlan}><small>Betriebe</small><strong>0 %</strong><span>keine Provision</span></div>
      </div>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Bezahlte Tarife klar getrennt vom kostenlosen Einstieg</div>
    </div>
    <div className={styles.previewFoot}>Transparent getrennte Kunden- und Partnermodelle.</div>
  </MockLink>;
}

export function HeroContact() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: Kontaktwege im Hauskonto">
    <div className={styles.previewHead}><div className={styles.previewMark}><MessageCircle size={17} aria-hidden="true" /></div><div><small>Kontaktwege</small><strong>Wo dein Anliegen hingehört</strong></div></div>
    <div className={styles.previewBody}>
      <div className={styles.heroContactRow}><span className={styles.choiceIcon}><Wrench size={15} aria-hidden="true" /></span><span><strong>Hausanliegen</strong><small>Im Hauskonto beschreiben – mit Kontext</small></span></div>
      <div className={styles.heroContactRow}><span className={styles.choiceIcon}><CalendarCheck2 size={15} aria-hidden="true" /></span><span><strong>Bestehender Auftrag</strong><small>Im Vorgang chatten, nicht per E-Mail</small></span></div>
      <div className={styles.heroContactRow}><span className={styles.choiceIcon}><ReceiptText size={15} aria-hidden="true" /></span><span><strong>Partnerfragen</strong><small>Über das Partnernetzwerk</small></span></div>
    </div>
    <div className={styles.previewFoot}>Akute Gefahr: immer zuerst die öffentlichen Notrufstellen.</div>
  </MockLink>;
}

export function HeroShield() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: Sicherheitsprinzipien im Konto">
    <div className={styles.previewHead}><div className={styles.previewMark}><ShieldCheck size={17} aria-hidden="true" /></div><div><small>Sicherheitsprinzipien</small><strong>Kontrolle bleibt bei dir</strong></div></div>
    <div className={styles.previewBody}>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Kein Auftrag ohne deine bewusste Entscheidung</div>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Private App-Inhalte werden nicht offline gespeichert</div>
      <div className={styles.heroFactRow}><CircleCheck size={15} aria-hidden="true" /> Zugriffe bleiben kontrolliert und nachvollziehbar</div>
    </div>
    <div className={styles.previewFoot}>Überprüfbare Produktprinzipien statt Siegel-Versprechen.</div>
  </MockLink>;
}

export function HeroHelp() {
  return <MockLink href={OWNER_HREF} label="Produktvorschau: Hilfe im Hauskonto">
    <div className={styles.previewHead}><div className={styles.previewMark}><FileText size={17} aria-hidden="true" /></div><div><small>Schnell einsteigen</small><strong>Beliebte Themen</strong></div></div>
    <div className={styles.previewBody}>
      <div className={styles.heroContactRow}><span className={styles.choiceIcon}><Wrench size={15} aria-hidden="true" /></span><span><strong>Wie läuft ein Auftrag ab?</strong></span></div>
      <div className={styles.heroContactRow}><span className={styles.choiceIcon}><ReceiptText size={15} aria-hidden="true" /></span><span><strong>Was kostet Einfach Hausen?</strong></span></div>
      <div className={styles.heroContactRow}><span className={styles.choiceIcon}><UserRound size={15} aria-hidden="true" /></span><span><strong>Wer arbeitet an meinem Haus?</strong></span></div>
    </div>
    <div className={styles.previewFoot}>Antworten ohne Kleingedrucktes.</div>
  </MockLink>;
}
