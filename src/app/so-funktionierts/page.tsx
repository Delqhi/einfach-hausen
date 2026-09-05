import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Image from 'next/image';
import { MessageCircle, Phone, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { MotionPresentation } from '@/components/marketing/motion-presentation';
import { AppFrame, ContactScreen, OrderStatusScreen, ReminderScreen } from '@/components/marketing/app-frames';
import { Reveal } from '@/components/marketing/motion';
import { BulletList, CtaBand, Faq, FeatureGrid, LinkButton, PageHero, Section, Statement, Steps, Timeline, mkt as styles } from '@/components/marketing/ui';

export const metadata: Metadata = { title: "So funktioniert's", description: 'Anliegen beschreiben, wir organisieren, ein Mensch aus deiner Region übernimmt. Kein Auftrag ohne deine Entscheidung.' , alternates: { canonical: canonical('/so-funktionierts') } };

const CASE = [
  { when: 'Montag, 09:12', title: 'Du schreibst: „Die Dachrinne läuft über.“', text: 'Ein Satz und ein Foto vom Handy. Kein Formular, keine Kategorie.' },
  { when: 'Montag, 09:20', title: 'Wir ordnen ein', text: 'Dachrinne reinigen, eventuell Laubschutz. Eine kurze Rückfrage: einstöckig oder zweistöckig?' },
  { when: 'Montag, 11:40', title: 'Passender Partner gefunden', text: 'Dachdeckerei Kessler, 6 km entfernt, geprüft, Kapazität diese Woche. Kostenrahmen 160 bis 200 €.' },
  { when: 'Dienstag, 08:05', title: 'Du bestätigst den Termin', text: 'Donnerstag 14 Uhr. Erst jetzt entsteht ein Auftrag, weil du es so willst.' },
  { when: 'Donnerstag, 14:00', title: 'Markus Kessler klingelt', text: 'Du kennst Namen, Betrieb und Nummer seit Montag. Er bringt die Leiter mit.' },
  { when: 'Donnerstag, 15:10', title: 'Erledigt. Rechnung 180 € in der Hausakte.', text: 'Nächstes Jahr im Oktober erinnern wir dich automatisch.' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="So funktioniert's"
        title="Du sagst, was los ist. Wir kümmern uns um alles dazwischen."
        text="Einfach Hausen beginnt nicht mit einer Kategorienwand und endet nicht in einer Warteschleife. Du beschreibst in normalen Worten, wir organisieren, und am Ende steht ein Mensch aus deiner Region vor deiner Tür."
        actions={<><LinkButton href="/#anliegen">Anliegen starten</LinkButton><LinkButton href="/register?role=homeowner" secondary>Hauskonto kostenlos anlegen</LinkButton></>}
        aside={<AppFrame label="Vorgangsansicht in der App: Dachrinne reinigen, Schritt 3 von 4, Termin bestätigt"><OrderStatusScreen /></AppFrame>}
      />
      <MotionPresentation presentationId="so-funktionierts" title="Vom ersten Satz zum nächsten Schritt." />

      <Section tone="surface" eyebrow="Der Ablauf" title="Drei Schritte. Für dich fühlt es sich an wie einer." text="Die Organisation im Hintergrund darf komplex sein. Für dich bleibt der Weg kurz.">
        <Steps
          items={[
            { title: 'Beschreiben', text: 'Text, Foto oder Sprachnachricht. So, wie du es einem Nachbarn erklären würdest. Fehlt etwas Wichtiges, fragen wir gezielt nach, statt dir ein Formular vorzusetzen.', visual: <AppFrame size="sm"><ReminderScreen /></AppFrame> },
            { title: 'Wir organisieren', text: 'Wir ordnen ein, was dahintersteckt, finden einen geprüften Partner aus deiner Region und holen einen Kostenrahmen und Terminvorschlag ein. Du siehst alles, bevor du entscheidest.', visual: <AppFrame size="sm"><OrderStatusScreen /></AppFrame> },
            { title: 'Ein Mensch übernimmt', text: 'Dein Ansprechpartner hat Namen, Betrieb und Telefonnummer. Er meldet sich, kommt, erledigt. Rechnung und Dokumente landen in deiner Hausakte.', visual: <AppFrame size="sm"><ContactScreen /></AppFrame> },
          ]}
        />
      </Section>

      <Statement kicker="Das Prinzip">Eine Frage ist noch kein Auftrag. <mark>Du entscheidest, wann daraus einer wird.</mark></Statement>

      <Section eyebrow="Ein echter Vorgang" title="So sieht das in einer Woche aus." text="Vom ersten Satz bis zur Rechnung in der Hausakte. Keine Warteschleife, keine fünf Rückrufe.">
        <div className={styles.split}>
          <Timeline items={CASE} />
          <Reveal delay={0.1} className={styles.photo} data-ratio="4:5" data-mw="440">
            <Image src="/images/marketing/owner-kitchen.jpg" alt="Hausbesitzerin am Küchentisch schaut entspannt auf ihr Handy" width={1024} height={1024} sizes="(min-width: 900px) 440px, 100vw" />
            <span className={styles.photoCaption}><Phone size={18} aria-hidden="true" /> Du musst niemanden hinterhertelefonieren</span>
          </Reveal>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Drei Wege" title="Rat, Kontakt oder Auftrag. Getrennte Entscheidungen." text="Du gehst jeden Weg nur, wenn du es willst. Nichts passiert automatisch.">
        <FeatureGrid items={[
          { icon: <MessageCircle size={20} />, title: 'Nur eine Frage klären', text: 'Zuerst verstehen, was wahrscheinlich sinnvoll ist. Dabei entsteht kein Auftrag und niemand ruft dich ungefragt an.' },
          { icon: <UserRound size={20} />, title: 'Einen Menschen sprechen', text: 'Ein passender geprüfter Partner wird als konkreter Ansprechpartner verbunden, auch ohne Buchung. Zum Beispiel, um eine Einschätzung zu bekommen.' },
          { icon: <Wrench size={20} />, title: 'Erledigen lassen', text: 'Wenn du willst, dass es gemacht wird, vervollständigen wir die Auftragsdaten, holen Kostenrahmen und Termin ein und du gibst frei.' },
        ]} />
        <div className={styles.heroActions}>
          <LinkButton href="/beratung">Beratung ansehen</LinkButton>
          <LinkButton href="/notfall" secondary>Dringender Fall</LinkButton>
        </div>
      </Section>

      <Section id="ansprechpartner" tone="surface" eyebrow="Dein Ansprechpartner" title="Ein Mensch, kein Ticket." text="Bei Einfach Hausen sprichst du nicht mit einer Hotline. Nach der Vermittlung hast du einen konkreten Menschen mit Namen, Betrieb und Nummer, und der bleibt in deiner Hausakte, auch für das nächste Mal.">
        <div className={styles.split}>
          <div className={styles.stack}>
            <BulletList items={[
              'Du siehst vorher, wer kommt: Name, Betrieb, Entfernung, Bewertung',
              'Direkter Draht per Anruf oder Nachricht, ohne Umweg über uns',
              'Der Kontakt bleibt am Haus gespeichert und ist beim nächsten Anliegen wieder da',
              'Persönlich geprüfte Partnerbetriebe aus deiner Region, kein offenes Firmenverzeichnis',
            ]} />
            <div className={styles.heroActions}><LinkButton href="/#anliegen">Anliegen starten</LinkButton><LinkButton href="/sicherheit" secondary>Wie wir Partner prüfen</LinkButton></div>
          </div>
          <div className={styles.centerRow}><AppFrame label="Ansprechpartner-Ansicht in der App mit Name, Betrieb und Chat"><ContactScreen /></AppFrame></div>
        </div>
      </Section>

      <Section eyebrow="Matching" title="Passend schlägt laut." text="Bei der Auswahl zählen fachliche Eignung, Region, Verfügbarkeit, Kapazität und Kundenzufriedenheit. Ein Partner-Tarif kann die Reihenfolge nicht kaufen.">
        <FeatureGrid items={[
          { icon: <ShieldCheck size={20} />, title: 'Geprüft und vertraglich gebunden', text: 'Partner werden vor der ersten Vermittlung persönlich geprüft und verpflichten sich auf unsere Regeln.' },
          { icon: <UserRound size={20} />, title: 'Beziehungen zählen', text: 'Hat ein Partner schon bei dir gearbeitet und es lief gut, bevorzugen wir ihn beim nächsten passenden Anliegen.' },
          { icon: <Wrench size={20} />, title: 'Ein Vorgang, alles drin', text: 'Angebot, Termin, Nachrichten, Dokumente, Rechnung und Status gehören zusammen, nicht in fünf Chats und drei Postfächer.' },
        ]} />
      </Section>

      <Section tone="soft" eyebrow="Häufige Fragen" title="Was oft gefragt wird." center>
        <div className={styles.centerRow}>
          <Faq items={[
            { q: 'Wie schnell meldet sich jemand?', a: 'In der Pilotphase bekommst du in der Regel innerhalb eines Werktags einen Vorschlag mit Partner und Kostenrahmen. Bei dringenden Fällen kennzeichnest du das beim Beschreiben.' },
            { q: 'Kann ich einen Partner ablehnen?', a: 'Ja, jederzeit und ohne Begründung. Dann schlagen wir einen anderen vor, sofern in deiner Region verfügbar.' },
            { q: 'Wer stellt die Rechnung?', a: 'Der Partnerbetrieb rechnet direkt mit dir ab, zu dem Kostenrahmen, den du vorher bestätigt hast. Einfach Hausen nimmt keine Provision auf den Auftrag.' },
            { q: 'Was, wenn etwas nicht gut läuft?', a: 'Dann sagst du es im Vorgang. Wir haben den kompletten Verlauf und kümmern uns um Klärung mit dem Partner. Fertig ist ein Vorgang erst, wenn du ihn abschließt.' },
          ]} />
        </div>
      </Section>

      <CtaBand title="Starte mit dem Problem, nicht mit dem Gewerk." text="Ein Satz reicht. Das Hauskonto ist kostenlos, ein Anliegen löst nichts automatisch aus." />
    </MarketingShell>
  );
}
