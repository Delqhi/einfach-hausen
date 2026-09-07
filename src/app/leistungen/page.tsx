import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical, leistungenServiceJsonLd } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, ReminderScreen } from '@/components/marketing/app-frames';
import { EHScope, EHSection, EHPageHero, EHServiceIndex, EHProse, EHSplitStory, EHSteps, EHFAQ, EHClosing, EHButton, EHEyebrow, EHHeading, EHText } from '@/design-system';
import { mkt as styles } from '@/components/marketing/ui';
import { SERVICE_CATEGORIES } from '@/components/marketing/service-catalog';

export const metadata: Metadata = { title: 'Leistungen', description: 'Alles rund ums Eigenheim: Reparatur, Heizung, Dach, Garten, Sanierung, Wartung. Du beschreibst, wir ordnen zu.' , alternates: { canonical: canonical('/leistungen') } };

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
      <EHScope>
        <EHPageHero
          eyebrow="Leistungen"
          title="Du musst nicht wissen, welches Gewerk. Du musst nur sagen, was ist."
          text="Einfach Hausen deckt alles ab, was ein Haus so braucht: von der tropfenden Armatur bis zur Sanierung, vom Heckenschnitt bis zur Wärmepumpe. Die Einordnung übernehmen wir. Umfang und Verfügbarkeit hängen vom regional aktiven Partnernetz ab."
          actions={<><EHButton href="/#anliegen" arrow>Anliegen starten</EHButton><EHButton href="/so-funktionierts" variant="secondary">So funktioniert&apos;s</EHButton></>}
          media={<AppFrame label="Erinnerungsansicht der App mit Heizungswartung, Dachrinnen und Rauchmelder"><ReminderScreen /></AppFrame>}
        />
        <EHSection compact>
          <EHEyebrow>Leistungsbereiche</EHEyebrow>
          <EHHeading>Zwölf Bereiche. Ein Eingang.</EHHeading>
          <EHText size="lead">Zur Orientierung, nicht zum Aussuchen. Beschreib dein Anliegen einfach so, wie es ist.</EHText>
          <EHServiceIndex items={SERVICE_CATEGORIES.map(({ title, description, slug }) => ({ title, text: description, href: `/leistungen/${slug}` }))} />
        </EHSection>
        <EHSection compact>
          <EHProse>
            <p><strong>Beispiele.</strong> So klingen echte Anliegen. <mark>Genau so darfst du schreiben.</mark></p>
          </EHProse>
          {/* Ausnahme 05-WEB-02: Beispiel-Chips mit Request-Prefill haben kein Rezept; Interaktion unverändert erhalten. */}
          <div className={styles.chipRow} data-density="airy">
            {EXAMPLES.map((e) => (
              <a key={e} className={styles.chip} data-size="lg" href={`/register?role=homeowner&request=${encodeURIComponent(e)}`}>{e}</a>
            ))}
          </div>
        </EHSection>
        <EHSection compact>
          <EHSplitStory eyebrow="Was danach passiert" title="Aus deinem Satz wird ein Vorgang." media={<EHSteps items={[
            { title: 'Wir ordnen ein', text: 'Welches Gewerk, welche Dringlichkeit, was braucht der Betrieb an Informationen. Bei Bedarf eine kurze Rückfrage.' },
            { title: 'Wir finden den passenden Partner', text: 'Geprüft, regional, mit Kapazität. Du bekommst Name, Betrieb und einen Kostenrahmen, bevor du entscheidest.' },
            { title: 'Du entscheidest, dann geht es los', text: 'Termin bestätigen oder ablehnen. Danach übernimmt dein Ansprechpartner, und alles landet in der Hausakte.' },
          ]} />} />
        </EHSection>
        <EHSection compact>
          <EHFAQ items={[
            { q: 'Was, wenn mein Anliegen in keine Kategorie passt?', a: 'Dann schreib es trotzdem. Die Kategorien sind unsere interne Ordnung, nicht deine Aufgabe. Wir finden heraus, wer helfen kann, oder sagen dir ehrlich, wenn wir es nicht können.' },
            { q: 'Macht Einfach Hausen die Arbeiten selbst?', a: 'Nein. Wir organisieren. Ausgeführt wird durch eigenständige, persönlich geprüfte Partnerbetriebe aus deiner Region, mit denen du direkt abrechnest.' },
            { q: 'Auch Notfälle?', a: 'Bei dringenden Fällen wie Wasserschaden oder Heizungsausfall im Winter kennzeichnest du das beim Beschreiben. Wir priorisieren, können aber keinen 24/7-Notdienst garantieren. Im akuten Gefahrenfall wähle immer den Notruf.' },
            { q: 'Gibt es Einfach Hausen in meiner Region?', a: 'Wir starten regional und bauen das Partnernetz Schritt für Schritt aus. Leg dein kostenloses Hauskonto an, dann siehst du, was bei dir schon möglich ist.' },
          ]} />
        </EHSection>
        <EHClosing title="Beschreib einfach, was ansteht." text="Kostenlos, unverbindlich, in deinen Worten. Die Zuordnung ist unser Job." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
      </EHScope>
    </MarketingShell>
  );
}
