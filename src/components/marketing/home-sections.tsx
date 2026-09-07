import Image from 'next/image';
import { Check, ShieldCheck } from 'lucide-react';
import { IntakeForm } from '@/components/home/intake-form';
import { AppFrame, ContactScreen, MiniContact, MiniCosts, MiniHausakte, MiniReminder, OrderStatusScreen, ReminderScreen } from './app-frames';
import { FACTS, HOME_FAQ, PRINCIPLES } from './content';
import { SERVICE_CATEGORIES } from './service-catalog';
import { ProofRow, Steps, Statement } from './ui';
import { EHSection, EHSplitStory, EHServiceIndex, EHPanel, EHList, EHFacts, EHFAQ, EHButton, EHActions, EHEyebrow, EHHeading, EHText, EHProse, EHCallout, EHTextLink } from '@/design-system';

export { HomeHero } from './home-hero';

/* 2 · Problem mirror: the reader recognizes themselves before we talk product */
const MIRROR = [
  { tag: 'Seit Monaten aufgeschoben', quote: 'Die Dachrinne müsste mal … aber wen ruf ich da eigentlich an?' },
  { tag: 'Verlorenes Wissen', quote: 'Wie hieß der Heizungsmensch von damals nochmal? Und war da nicht noch Garantie drauf?' },
  { tag: 'Zettelwirtschaft', quote: 'Die Rechnung von 2022 liegt irgendwo im Ordner. Oder in einer Mail. Oder gar nicht.' },
] as const;

export function ProblemMirror() {
  return (
    <EHSection compact>
      <EHEyebrow>Kennst du das?</EHEyebrow>
      <EHHeading>Ein Haus ist wunderbar. Und ein Job, den niemand dir beigebracht hat.</EHHeading>
      <EHText size="lead">Nicht die Reparatur ist anstrengend. Anstrengend ist das Drumherum: wissen, wen man braucht, jemanden erreichen, dranbleiben, und am Ende nichts wiederfinden.</EHText>
      {MIRROR.map((m) => (
        <EHCallout key={m.tag} title={m.tag}>
          <EHText>{m.quote}</EHText>
        </EHCallout>
      ))}
    </EHSection>
  );
}

/* 3 · The switch: one sentence + before/after */
export function TheSwitch() {
  return (
    <EHSection compact>
      <EHProse>
        <p><strong>Der Unterschied.</strong> Du musst nicht wissen, welches Gewerk. <mark>Du musst es nur sagen.</mark></p>
      </EHProse>
      <EHPanel title="Bisher">
        <EHList label="Bisher" items={[
          { id: 'vorher-0', title: 'Googeln, drei Betriebe anrufen, zwei rufen nie zurück' },
          { id: 'vorher-1', title: 'Termine per WhatsApp, Angebote per Mail, Rechnung auf Papier' },
          { id: 'vorher-2', title: 'Nach zwei Jahren weiß niemand mehr, was gemacht wurde' },
        ]} />
      </EHPanel>
      <EHPanel title="Mit Einfach Hausen">
        <EHList label="Mit Einfach Hausen" items={[
          { id: 'nachher-0', title: 'Ein Satz reicht: „Heizung macht Geräusche“' },
          { id: 'nachher-1', title: 'Ein geprüfter Partner, ein Ansprechpartner, ein Kostenrahmen vorab' },
          { id: 'nachher-2', title: 'Alles landet automatisch in deiner Hausakte' },
        ]} />
      </EHPanel>
    </EHSection>
  );
}

/* 4 · How it works: three steps with real screens */
export function HowItWorks() {
  return (
    <EHSection compact id="so-funktionierts">
      <EHEyebrow>So funktioniert&apos;s</EHEyebrow>
      <EHHeading>Drei Schritte. Danach kümmert sich ein Mensch.</EHHeading>
      <EHText size="lead">Kein Formular-Marathon, kein Vergleichsportal. Du sagst, was los ist. Der Rest ist unsere Arbeit.</EHText>
      <Steps
        items={[
          { title: 'Du beschreibst, was ansteht', text: 'In deinen Worten, per Text, Foto oder Sprachnachricht. Wir ordnen ein, was dahintersteckt.', visual: <AppFrame size="sm"><ReminderScreen /></AppFrame> },
          { title: 'Wir organisieren', text: 'Passender Partnerbetrieb aus deiner Region, Kostenrahmen, Terminvorschlag. Du bestätigst oder lehnst ab.', visual: <AppFrame size="sm"><OrderStatusScreen /></AppFrame> },
          { title: 'Ein Mensch übernimmt', text: 'Dein Ansprechpartner hat Namen, Betrieb und Telefonnummer. Er meldet sich, kommt, erledigt. Fertig ist es erst, wenn du zufrieden bist.', visual: <AppFrame size="sm"><ContactScreen /></AppFrame> },
        ]}
      />
      <EHActions>
        <EHTextLink href="/so-funktionierts">Den ganzen Ablauf ansehen</EHTextLink>
      </EHActions>
    </EHSection>
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
    <EHSection compact>
      <EHEyebrow>Was du bekommst</EHEyebrow>
      <EHHeading>Weniger im Kopf. Mehr im Griff.</EHHeading>
      <EHText size="lead">Einfach Hausen ist kein Handwerker-Portal. Es ist der Ort, an dem dein Haus verwaltet wird, damit du es nicht tun musst.</EHText>
      {BENEFITS.map((b, i) => (
        <EHSplitStory key={b.title} title={b.title} text={b.text} media={b.visual} reverse={i % 2 === 1}>
          <EHTextLink href={b.href}>{b.label}</EHTextLink>
        </EHSplitStory>
      ))}
    </EHSection>
  );
}

/* 6 · Trust: honest facts + principles + a real face */
export function Trust() {
  return (
    <EHSection compact>
      <EHEyebrow>Warum du uns vertrauen kannst</EHEyebrow>
      <EHHeading>Keine Marktplatz-Logik. Klare Regeln.</EHHeading>
      <EHText size="lead">Wir verdienen nicht daran, deine Anfrage möglichst oft zu verkaufen. Wir verdienen daran, dass dein Haus gut läuft.</EHText>
      <EHFacts items={FACTS.map((f) => ({ value: f.value, label: f.label }))} />
      <EHSplitStory eyebrow="Vertrauen" title="Persönlich geprüfte Partnerbetriebe aus deiner Region." text="Wir verdienen nicht daran, deine Anfrage möglichst oft zu verkaufen. Wir verdienen daran, dass dein Haus gut läuft." media={<><Image src="/images/marketing/partner-doorstep.jpg" alt="Ein Partnerbetrieb im Gespräch mit Hausbesitzern an der Haustür" width={1024} height={1024} sizes="(min-width: 900px) 560px, 100vw" /><span><ShieldCheck size={18} aria-hidden="true" /> Persönlich geprüfte Partnerbetriebe aus deiner Region</span></>}>
        <EHList label="Prinzipien" items={PRINCIPLES.map((p, i) => ({ id: 'trust-' + i, title: p.title, text: p.text, meta: <Check size={16} strokeWidth={3} aria-hidden="true" /> }))} />
        <EHTextLink href="/partner">Für Betriebe: Partner werden</EHTextLink>
        <EHTextLink href="/sicherheit">Unsere Sicherheits- und Datenprinzipien</EHTextLink>
      </EHSplitStory>
    </EHSection>
  );
}

/* 7 · Categories as compact chips */
export function CategoriesCompact() {
  return (
    <EHSection compact>
      <EHEyebrow>Wofür du uns fragen kannst</EHEyebrow>
      <EHHeading>Alles, was ein Haus so braucht.</EHHeading>
      <EHText size="lead">Du musst dein Anliegen keiner Kategorie zuordnen. Das übernehmen wir. Zur Orientierung: so breit ist das Netz.</EHText>
      <EHServiceIndex items={SERVICE_CATEGORIES.slice(0, 11).map(({ title, slug }) => ({ title, href: `/leistungen/${slug}` }))} />
      <EHActions>
        <EHTextLink href="/leistungen">Alle Leistungen</EHTextLink>
      </EHActions>
    </EHSection>
  );
}

/* 8 · Pilot: real scarcity from the actual pilot phase */
export function PilotBand() {
  return (
    <EHSection compact>
      <EHEyebrow>Pilotphase</EHEyebrow>
      <EHHeading>Die ersten 1.000 Haushalte zahlen dauerhaft 15 % weniger.</EHHeading>
      <EHText size="lead">Wir bauen Einfach Hausen regional auf und starten mit einer begrenzten Zahl an Haushalten. Wer jetzt sein kostenloses Hauskonto anlegt, bekommt den Pilot-Status automatisch. Das FREE-Konto bleibt dabei immer 0 €.</EHText>
      <EHActions>
        <EHButton href="/register?role=homeowner" arrow>Platz sichern, kostenlos</EHButton>
        <EHTextLink href="/preise">Preise ansehen</EHTextLink>
        <EHTextLink href="/pilotphase">Bedingungen ansehen</EHTextLink>
      </EHActions>
      <EHList label="Pilot-Vorteile" items={[
        { id: 'pilot-0', title: '15 % Dauer-Vorteil auf alle bezahlten Pakete, solange dein Konto besteht' },
        { id: 'pilot-1', title: 'Direkter Draht zum Team, dein Feedback prägt das Produkt' },
        { id: 'pilot-2', title: 'Keine Frist, kein Kleingedrucktes, jederzeit kündbar' },
      ]} />
    </EHSection>
  );
}

/* 9 · FAQ */
export function HomeFaq() {
  return (
    <EHSection compact>
      <EHEyebrow>Häufige Fragen</EHEyebrow>
      <EHHeading>Was du vorher wissen willst.</EHHeading>
      <EHFAQ items={HOME_FAQ.map((f) => ({ q: f.q, a: f.a }))} />
      <EHActions>
        <EHTextLink href="/hilfe">Alle Fragen und Antworten</EHTextLink>
      </EHActions>
    </EHSection>
  );
}

/* 10 · Final CTA */
export function FinalCta() {
  return (
    <EHSection compact>
      <EHEyebrow>Dein nächster Schritt</EHEyebrow>
      <EHHeading>Sag uns, was ansteht. Den Rest übernehmen wir.</EHHeading>
      <EHText size="lead">Unverbindlich, kostenlos und in deinen Worten. Ein Satz reicht.</EHText>
      <IntakeForm variant="band" />
      <EHText size="meta">Noch kein konkretes Anliegen? <EHTextLink href="/register?role=homeowner">Hauskonto kostenlos anlegen</EHTextLink></EHText>
      <ProofRow items={['kein Auftrag ohne deine Entscheidung']} />
    </EHSection>
  );
}

export { Statement };
