import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical, leistungenServiceJsonLd } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, Faq, LinkButton, Section, Steps } from '@/components/marketing/ui';
import { FaqFrame, IndexHero, IndexList, VoiceBand } from '@/components/marketing/archetypes';
import { CATEGORIES } from '@/components/marketing/content';

// Archetyp A – Index. Vorher: Hero mit Mockup, danach zwölf gleich große
// Karten, dann Statement, FAQ, CTA. Genau dieses Muster lag auf jeder
// Unterseite. Jetzt trägt Typografie die Seite: ein Index mit führenden
// Nummern auf Haarlinien, und die echten Kundensätze sind ein eigenes Band
// statt ein Chip-Regal am Rand.

export const metadata: Metadata = { title: 'Leistungen', description: 'Alles rund ums Eigenheim: Reparatur, Heizung, Dach, Garten, Sanierung, Wartung. Du beschreibst, wir ordnen zu.', alternates: { canonical: canonical('/leistungen') } };

const EXAMPLES = [
  'Die Heizung macht seit gestern klackernde Geräusche.',
  'Im Bad ist die Silikonfuge schwarz und löst sich.',
  'Wir wollen eine Wallbox, wissen aber nicht, ob der Anschluss reicht.',
  'Die Hecke ist zu hoch, der Nachbar hat sich beschwert.',
  'Nach dem Sturm liegt ein Ziegel im Garten.',
  'Wir ziehen um und brauchen jemanden fürs Ausräumen des Kellers.',
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Leistungen', path: '/leistungen' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(leistungenServiceJsonLd()) }} />

      <IndexHero
        eyebrow="Leistungen"
        title={<>Du musst nicht wissen, welches Gewerk. <em>Du musst nur sagen, was ist.</em></>}
        lead="Einfach Hausen deckt alles ab, was ein Haus so braucht: von der tropfenden Armatur bis zur Sanierung, vom Heckenschnitt bis zur Wärmepumpe. Die Einordnung übernehmen wir. Umfang und Verfügbarkeit hängen vom regional aktiven Partnernetz ab."
        actions={<LinkButton href="/#anliegen">Anliegen starten</LinkButton>}
        meta={[
          { value: '12', label: 'Leistungsbereiche' },
          { value: '1', label: 'Eingang für alles' },
          { value: '0 €', label: 'für Beschreiben und Einordnen' },
        ]}
      />

      <IndexList
        eyebrow="Leistungsbereiche"
        title="Zwölf Bereiche. Ein Eingang."
        note="Zur Orientierung, nicht zum Aussuchen. Du musst nichts anklicken und nichts zuordnen: beschreib dein Anliegen einfach so, wie es ist."
        items={CATEGORIES.map(({ icon: Icon, title, text }) => ({
          icon: <Icon size={18} aria-hidden="true" />,
          title,
          text,
        }))}
      />

      <VoiceBand
        eyebrow="In deinen Worten"
        title="So klingen echte Anliegen."
        text="Jeder dieser Sätze reicht uns, um loszulegen. Tipp einen an, er wird direkt übernommen."
        items={EXAMPLES}
        hrefFor={(sentence) => `/register?role=homeowner&request=${encodeURIComponent(sentence)}`}
        foot="Kein Fachchinesisch nötig. Wenn wir etwas nicht verstehen, fragen wir kurz nach."
      />

      <Section tone="soft" eyebrow="Was danach passiert" title="Aus deinem Satz wird ein Vorgang.">
        <Steps items={[
          { title: 'Wir ordnen ein', text: 'Welches Gewerk, welche Dringlichkeit, was braucht der Betrieb an Informationen. Bei Bedarf eine kurze Rückfrage.' },
          { title: 'Wir finden den passenden Partner', text: 'Geprüft, regional, mit Kapazität. Du bekommst Name, Betrieb und einen Kostenrahmen, bevor du entscheidest.' },
          { title: 'Du entscheidest, dann geht es los', text: 'Termin bestätigen oder ablehnen. Danach übernimmt dein Ansprechpartner, und alles landet in der Hausakte.' },
        ]} />
      </Section>

      <FaqFrame
        eyebrow="Häufige Fragen"
        title="Zu den Leistungen."
        text={<>Was hier nicht steht, beantwortet die <a href="/hilfe">Hilfe</a> oder direkt ein Mensch.</>}
      >
        <Faq items={[
          { q: 'Was, wenn mein Anliegen in keine Kategorie passt?', a: 'Dann schreib es trotzdem. Die Kategorien sind unsere interne Ordnung, nicht deine Aufgabe. Wir finden heraus, wer helfen kann, oder sagen dir ehrlich, wenn wir es nicht können.' },
          { q: 'Macht Einfach Hausen die Arbeiten selbst?', a: 'Nein. Wir organisieren. Ausgeführt wird durch eigenständige, persönlich geprüfte Partnerbetriebe aus deiner Region, mit denen du direkt abrechnest.' },
          { q: 'Auch Notfälle?', a: 'Bei dringenden Fällen wie Wasserschaden oder Heizungsausfall im Winter kennzeichnest du das beim Beschreiben. Wir priorisieren, können aber keinen 24/7-Notdienst garantieren. Im akuten Gefahrenfall wähle immer den Notruf.' },
          { q: 'Gibt es Einfach Hausen in meiner Region?', a: 'Wir starten regional und bauen das Partnernetz Schritt für Schritt aus. Leg dein kostenloses Hauskonto an, dann siehst du, was bei dir schon möglich ist.' },
        ]} />
      </FaqFrame>

      <CtaBand title="Beschreib einfach, was ansteht." text="Kostenlos, unverbindlich, in deinen Worten. Die Zuordnung ist unser Job." />
    </MarketingShell>
  );
}
