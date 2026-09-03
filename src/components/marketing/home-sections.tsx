import Image from 'next/image';
import { ArrowRight, Check, CircleAlert, ShieldCheck } from 'lucide-react';
import { IntakeForm } from '@/components/home/intake-form';
import { Reveal, Stagger } from './motion';
import { AppFrame, ContactScreen, HomeScreen, MiniContact, MiniCosts, MiniHausakte, MiniReminder, OrderStatusScreen, ReminderScreen } from './app-frames';
import { CATEGORIES, FACTS, HOME_FAQ, PRINCIPLES } from './content';
import { Eyebrow, Facts, Faq, LinkButton, ProofRow, Section, Statement, Steps, TextLink } from './ui';
import styles from './mkt.module.css';

/* 1 · Hero: dark teal stage, intake first, app screen as proof */
export function HomeHero() {
  return (
    <section className={`${styles.homeHero} ${styles.onDark}`} id="anliegen">
      <div className={styles.homeHeroInner}>
        <Stagger className={styles.homeHeroCopy} gap={0.09}>
          <Eyebrow>Dein persönlicher Hausmanager</Eyebrow>
          <h1>Dein Zuhause. <em>Organisiert.</em></h1>
          <p>Tropfender Hahn, Heizungswartung, Dachrinne: Du beschreibst, was ansteht. Wir kümmern uns um alles andere, und ein Mensch aus deiner Region übernimmt.</p>
          <IntakeForm variant="hero" />
        </Stagger>
        <Reveal delay={0.25} y={32} className={styles.homeHeroVisual}>
          <AppFrame label="Die Einfach Hausen App: Startseite mit fälliger Heizungswartung, laufendem Auftrag und Hausakte"><HomeScreen /></AppFrame>
        </Reveal>
      </div>
    </section>
  );
}

/* 2 · Problem mirror: the reader recognizes themselves before we talk product */
const MIRROR = [
  { tag: 'Seit Monaten aufgeschoben', quote: 'Die Dachrinne müsste mal … aber wen ruf ich da eigentlich an?' },
  { tag: 'Verlorenes Wissen', quote: 'Wie hieß der Heizungsmensch von damals nochmal? Und war da nicht noch Garantie drauf?' },
  { tag: 'Zettelwirtschaft', quote: 'Die Rechnung von 2022 liegt irgendwo im Ordner. Oder in einer Mail. Oder gar nicht.' },
] as const;

export function ProblemMirror() {
  return (
    <Section eyebrow="Kennst du das?" title="Ein Haus ist wunderbar. Und ein Job, den niemand dir beigebracht hat." text="Nicht die Reparatur ist anstrengend. Anstrengend ist das Drumherum: wissen, wen man braucht, jemanden erreichen, dranbleiben, und am Ende nichts wiederfinden.">
      <div className={styles.cardGrid} data-cols="3">
        {MIRROR.map((m, i) => (
          <Reveal key={m.tag} delay={i * 0.07} className={styles.mirrorCard}>
            <span className={styles.mirrorTag}>{m.tag}</span>
            <p className={styles.mirrorQuote}>{m.quote}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 3 · The switch: one sentence + before/after */
export function TheSwitch() {
  return (
    <section className={`${styles.statement} ${styles.toneSand}`}>
      <div className={styles.statementInner}>
        <Reveal><Eyebrow terra>Der Unterschied</Eyebrow></Reveal>
        <Reveal delay={0.08}><p className={styles.statementText}>Du musst nicht wissen, welches Gewerk. <mark>Du musst es nur sagen.</mark></p></Reveal>
      </div>
      <div className={`${styles.container} ${styles.beforeAfter}`}>
        <Reveal className={styles.baBefore}>
          <span className={styles.baLabel}>Bisher</span>
          <ul className={styles.baList}>
            <li><CircleAlert size={18} /> Googeln, drei Betriebe anrufen, zwei rufen nie zurück</li>
            <li><CircleAlert size={18} /> Termine per WhatsApp, Angebote per Mail, Rechnung auf Papier</li>
            <li><CircleAlert size={18} /> Nach zwei Jahren weiß niemand mehr, was gemacht wurde</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1} className={styles.baAfter}>
          <span className={styles.baLabel}>Mit Einfach Hausen</span>
          <ul className={styles.baList}>
            <li><Check size={18} /> Ein Satz reicht: „Heizung macht Geräusche“</li>
            <li><Check size={18} /> Ein geprüfter Partner, ein Ansprechpartner, ein Kostenrahmen vorab</li>
            <li><Check size={18} /> Alles landet automatisch in deiner Hausakte</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* 4 · How it works: three steps with real screens */
export function HowItWorks() {
  return (
    <Section tone="surface" eyebrow="So funktioniert's" title="Drei Schritte. Danach kümmert sich ein Mensch." text="Kein Formular-Marathon, kein Vergleichsportal. Du sagst, was los ist. Der Rest ist unsere Arbeit." id="so-funktionierts">
      <Steps
        items={[
          { title: 'Du beschreibst, was ansteht', text: 'In deinen Worten, per Text, Foto oder Sprachnachricht. Wir ordnen ein, was dahintersteckt.', visual: <AppFrame size="sm"><ReminderScreen /></AppFrame> },
          { title: 'Wir organisieren', text: 'Passender Partnerbetrieb aus deiner Region, Kostenrahmen, Terminvorschlag. Du bestätigst oder lehnst ab.', visual: <AppFrame size="sm"><OrderStatusScreen /></AppFrame> },
          { title: 'Ein Mensch übernimmt', text: 'Dein Ansprechpartner hat Namen, Betrieb und Telefonnummer. Er meldet sich, kommt, erledigt. Fertig ist es erst, wenn du zufrieden bist.', visual: <AppFrame size="sm"><ContactScreen /></AppFrame> },
        ]}
      />
      <div className={`${styles.mt} ${styles.center}`} style={{ display: 'flex', justifyContent: 'center' }}>
        <TextLink href="/so-funktionierts">Den ganzen Ablauf ansehen</TextLink>
      </div>
    </Section>
  );
}

/* 5 · Benefits: what you actually get */
const BENEFITS = [
  { title: 'Eine Hausakte, die mitdenkt', text: 'Jede Reparatur, jede Rechnung, jede Garantie an einem Ort. Nicht weil du sie abheftest, sondern weil sie nach jedem Vorgang automatisch dort landet. Beim Verkauf ist das bares Geld.', visual: <MiniHausakte />, href: '/hausakte', label: 'Zur Hausakte' },
  { title: 'Erinnerungen, bevor es teuer wird', text: 'Heizungswartung, Dachrinnen vor dem Winter, Rauchmelder-Pflicht. Du bekommst rechtzeitig Bescheid und kannst mit einem Tipp organisieren lassen.', visual: <MiniReminder />, href: '/so-funktionierts', label: 'Wie das funktioniert' },
  { title: 'Ein Mensch, kein Ticket', text: 'Du sprichst nicht mit einer Hotline, sondern mit Markus, der am Donnerstag kommt. Du kennst seinen Namen, seinen Betrieb, seine Nummer, bevor er klingelt.', visual: <MiniContact />, href: '/so-funktionierts#ansprechpartner', label: 'Dein Ansprechpartner' },
  { title: 'Kostenrahmen vor dem Termin', text: 'Keine Überraschung auf der Rechnung. Du siehst vorher, womit du rechnen musst, und gibst erst dann frei.', visual: <MiniCosts />, href: '/preise', label: 'Zu den Preisen' },
] as const;

export function Benefits() {
  return (
    <Section eyebrow="Was du bekommst" title="Weniger im Kopf. Mehr im Griff." text="Einfach Hausen ist kein Handwerker-Portal. Es ist der Ort, an dem dein Haus verwaltet wird, damit du es nicht tun musst.">
      <div className={styles.benefitList}>
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} className={styles.benefit} {...({ 'data-flip': i % 2 === 1 ? 'true' : 'false' } as Record<string, string>)}>
            <div className={styles.benefitCopy}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              <TextLink href={b.href}>{b.label}</TextLink>
            </div>
            <div className={styles.benefitVisual}>{b.visual}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 6 · Trust: honest facts + principles + a real face */
export function Trust() {
  return (
    <Section tone="soft" eyebrow="Warum du uns vertrauen kannst" title="Keine Marktplatz-Logik. Klare Regeln." text="Wir verdienen nicht daran, deine Anfrage möglichst oft zu verkaufen. Wir verdienen daran, dass dein Haus gut läuft.">
      <Facts items={FACTS} />
      <div className={`${styles.split} ${styles.mt}`} style={{ alignItems: 'center' }}>
        <Reveal className={styles.photo} style={{ aspectRatio: '4 / 3' }}>
          <Image src="/images/marketing/partner-doorstep.jpg" alt="Ein Partnerbetrieb im Gespräch mit Hausbesitzern an der Haustür" width={1024} height={1024} sizes="(min-width: 900px) 560px, 100vw" />
          <span className={styles.photoCaption}><ShieldCheck size={18} aria-hidden="true" /> Persönlich geprüfte Partnerbetriebe aus deiner Region</span>
        </Reveal>
        <div className={styles.stack}>
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className={styles.numberedRow} style={{ padding: '18px 0' }}>
                <span className={styles.numberedNum}><Check size={16} strokeWidth={3} /></span>
                <div className={styles.numberedBody}><h3>{p.title}</h3><p>{p.text}</p></div>
              </div>
            </Reveal>
          ))}
          <TextLink href="/sicherheit">Unsere Sicherheits- und Datenprinzipien</TextLink>
        </div>
      </div>
    </Section>
  );
}

/* 7 · Categories as compact chips */
export function CategoriesCompact() {
  return (
    <Section tone="surface" eyebrow="Wofür du uns fragen kannst" title="Alles, was ein Haus so braucht." text="Du musst dein Anliegen keiner Kategorie zuordnen. Das übernehmen wir. Zur Orientierung: so breit ist das Netz." tight>
      <div className={styles.catGrid}>
        {CATEGORIES.slice(0, 11).map(({ icon: Icon, title }) => (
          <a key={title} className={styles.cat} href="/leistungen"><Icon size={20} aria-hidden="true" /> {title}</a>
        ))}
        <a className={styles.catMore} href="/leistungen">Alle Leistungen <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
    </Section>
  );
}

/* 8 · Pilot: real scarcity from the actual pilot phase */
export function PilotBand() {
  return (
    <section className={styles.sectionTight}>
      <Reveal className={styles.pilotBand}>
        <div className={styles.pilotCopy}>
          <span className={styles.pilotBadge}>Pilotphase</span>
          <h2>Die ersten 1.000 Haushalte zahlen dauerhaft 15 % weniger.</h2>
          <p>Wir bauen Einfach Hausen regional auf und starten mit einer begrenzten Zahl an Haushalten. Wer jetzt sein kostenloses Hauskonto anlegt, bekommt den Pilot-Status automatisch. Das FREE-Konto bleibt dabei immer 0 €.</p>
          <div className={styles.pilotActions}>
            <LinkButton href="/register?role=homeowner" variant="terra">Platz sichern, kostenlos</LinkButton>
            <TextLink href="/pilotphase">Bedingungen ansehen</TextLink>
          </div>
        </div>
        <ul className={`${styles.pilotPerks} ${styles.pilotSide}`}>
          <li><Check size={18} /> 15 % Dauer-Vorteil auf alle bezahlten Pakete, solange dein Konto besteht</li>
          <li><Check size={18} /> Direkter Draht zum Team, dein Feedback prägt das Produkt</li>
          <li><Check size={18} /> Keine Frist, kein Kleingedrucktes, jederzeit kündbar</li>
        </ul>
      </Reveal>
    </section>
  );
}

/* 9 · FAQ */
export function HomeFaq() {
  return (
    <Section eyebrow="Häufige Fragen" title="Was du vorher wissen willst." center>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Faq items={HOME_FAQ} />
      </div>
      <div className={`${styles.mt}`} style={{ display: 'flex', justifyContent: 'center' }}>
        <TextLink href="/hilfe">Alle Fragen und Antworten</TextLink>
      </div>
    </Section>
  );
}

/* 10 · Final CTA */
export function FinalCta() {
  return (
    <section className={styles.finalCta} id="final-cta">
      <div className={styles.finalCtaInner}>
        <Reveal><Eyebrow>Dein nächster Schritt</Eyebrow></Reveal>
        <Reveal delay={0.06}><h2>Sag uns, was ansteht. Den Rest übernehmen wir.</h2></Reveal>
        <Reveal delay={0.1}><p className={styles.lead}>Unverbindlich, kostenlos und in deinen Worten. Ein Satz reicht.</p></Reveal>
        <Reveal delay={0.14} className={styles.container} style={{ padding: 0 }}>
          <IntakeForm variant="band" />
        </Reveal>
        <Reveal delay={0.18} className={styles.finalCtaSecondary}>
          <span>Noch kein konkretes Anliegen?</span>
          <a href="/register?role=homeowner">Hauskonto kostenlos anlegen</a>
          <span aria-hidden="true">·</span>
          <ProofRow items={['kein Auftrag ohne deine Entscheidung']} />
        </Reveal>
      </div>
    </section>
  );
}

export { Statement };
