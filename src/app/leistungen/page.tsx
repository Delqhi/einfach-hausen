import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, ReminderScreen } from '@/components/marketing/app-frames';
import { Reveal } from '@/components/marketing/motion';
import { CtaBand, Faq, LinkButton, PageHero, Section, Statement, Steps, mkt as styles } from '@/components/marketing/ui';
import { CATEGORIES } from '@/components/marketing/content';

export const metadata: Metadata = { title: 'Leistungen', description: 'Alles rund ums Eigenheim: Reparatur, Heizung, Dach, Garten, Sanierung, Wartung. Du beschreibst, wir ordnen zu.' };

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
      <PageHero
        eyebrow="Leistungen"
        title="Du musst nicht wissen, welches Gewerk. Du musst nur sagen, was ist."
        text="Einfach Hausen deckt alles ab, was ein Haus so braucht: von der tropfenden Armatur bis zur Sanierung, vom Heckenschnitt bis zur Wärmepumpe. Die Einordnung übernehmen wir. Umfang und Verfügbarkeit hängen vom regional aktiven Partnernetz ab."
        actions={<><LinkButton href="/#anliegen">Anliegen starten</LinkButton><LinkButton href="/so-funktionierts" secondary>So funktioniert&apos;s</LinkButton></>}
        aside={<AppFrame label="Erinnerungsansicht der App mit Heizungswartung, Dachrinnen und Rauchmelder"><ReminderScreen /></AppFrame>}
      />

      <Section tone="surface" eyebrow="Leistungsbereiche" title="Zwölf Bereiche. Ein Eingang." text="Zur Orientierung, nicht zum Aussuchen. Beschreib dein Anliegen einfach so, wie es ist.">
        <div className={styles.cardGrid} data-cols="3">
          {CATEGORIES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.05}>
              <article className={styles.card}>
                <span className={styles.cardIcon}><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Statement kicker="Beispiele">So klingen echte Anliegen. <mark>Genau so darfst du schreiben.</mark></Statement>

      <Section eyebrow="In deinen Worten" title="Kein Fachchinesisch nötig." text="Jeder dieser Sätze reicht uns, um loszulegen. Tipp einen an, er wird direkt übernommen." tight>
        <div className={styles.chipRow} style={{ gap: 12 }}>
          {EXAMPLES.map((e) => (
            <a key={e} className={styles.chip} href={`/register?role=homeowner&request=${encodeURIComponent(e)}`} style={{ fontSize: 16, padding: '12px 18px' }}>{e}</a>
          ))}
        </div>
      </Section>

      <Section tone="soft" eyebrow="Was danach passiert" title="Aus deinem Satz wird ein Vorgang.">
        <Steps items={[
          { title: 'Wir ordnen ein', text: 'Welches Gewerk, welche Dringlichkeit, was braucht der Betrieb an Informationen. Bei Bedarf eine kurze Rückfrage.' },
          { title: 'Wir finden den passenden Partner', text: 'Geprüft, regional, mit Kapazität. Du bekommst Name, Betrieb und einen Kostenrahmen, bevor du entscheidest.' },
          { title: 'Du entscheidest, dann geht es los', text: 'Termin bestätigen oder ablehnen. Danach übernimmt dein Ansprechpartner, und alles landet in der Hausakte.' },
        ]} />
      </Section>

      <Section eyebrow="Häufige Fragen" title="Zu den Leistungen." center>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Faq items={[
            { q: 'Was, wenn mein Anliegen in keine Kategorie passt?', a: 'Dann schreib es trotzdem. Die Kategorien sind unsere interne Ordnung, nicht deine Aufgabe. Wir finden heraus, wer helfen kann, oder sagen dir ehrlich, wenn wir es nicht können.' },
            { q: 'Macht Einfach Hausen die Arbeiten selbst?', a: 'Nein. Wir organisieren. Ausgeführt wird durch eigenständige, persönlich geprüfte Partnerbetriebe aus deiner Region, mit denen du direkt abrechnest.' },
            { q: 'Auch Notfälle?', a: 'Bei dringenden Fällen wie Wasserschaden oder Heizungsausfall im Winter kennzeichnest du das beim Beschreiben. Wir priorisieren, können aber keinen 24/7-Notdienst garantieren. Im akuten Gefahrenfall wähle immer den Notruf.' },
            { q: 'Gibt es Einfach Hausen in meiner Region?', a: 'Wir starten regional und bauen das Partnernetz Schritt für Schritt aus. Leg dein kostenloses Hauskonto an, dann siehst du, was bei dir schon möglich ist.' },
          ]} />
        </div>
      </Section>

      <CtaBand title="Beschreib einfach, was ansteht." text="Kostenlos, unverbindlich, in deinen Worten. Die Zuordnung ist unser Job." />
    </MarketingShell>
  );
}
