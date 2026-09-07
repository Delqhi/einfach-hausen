import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Image from 'next/image';
import { MessageCircle, Phone, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, ContactScreen, OrderStatusScreen, ReminderScreen } from '@/components/marketing/app-frames';
import { Steps, Timeline } from '@/components/marketing/ui';
import { EHScope, EHSection, EHPageHero, EHSplitStory, EHFeatureRows, EHList, EHFAQ, EHClosing, EHButton, EHActions, EHEyebrow, EHHeading, EHText, EHProse } from '@/design-system';

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
      <EHScope>
      <EHPageHero
        eyebrow="So funktioniert's"
        title="Du sagst, was los ist. Wir kümmern uns um alles dazwischen."
        text="Einfach Hausen beginnt nicht mit einer Kategorienwand und endet nicht in einer Warteschleife. Du beschreibst in normalen Worten, wir organisieren, und am Ende steht ein Mensch aus deiner Region vor deiner Tür."
        actions={<><EHButton href="/#anliegen" arrow>Anliegen starten</EHButton><EHButton href="/register?role=homeowner" variant="secondary">Hauskonto kostenlos anlegen</EHButton></>}
        media={<AppFrame label="Vorgangsansicht in der App: Dachrinne reinigen, Schritt 3 von 4, Termin bestätigt"><OrderStatusScreen /></AppFrame>}
      />

      <EHSection compact>
        <EHEyebrow>Der Ablauf</EHEyebrow>
        <EHHeading>Drei Schritte. Für dich fühlt es sich an wie einer.</EHHeading>
        <EHText size="lead">Die Organisation im Hintergrund darf komplex sein. Für dich bleibt der Weg kurz.</EHText>
        <Steps
          items={[
            { title: 'Beschreiben', text: 'Text, Foto oder Sprachnachricht. So, wie du es einem Nachbarn erklären würdest. Fehlt etwas Wichtiges, fragen wir gezielt nach, statt dir ein Formular vorzusetzen.', visual: <AppFrame size="sm"><ReminderScreen /></AppFrame> },
            { title: 'Wir organisieren', text: 'Wir ordnen ein, was dahintersteckt, finden einen geprüften Partner aus deiner Region und holen einen Kostenrahmen und Terminvorschlag ein. Du siehst alles, bevor du entscheidest.', visual: <AppFrame size="sm"><OrderStatusScreen /></AppFrame> },
            { title: 'Ein Mensch übernimmt', text: 'Dein Ansprechpartner hat Namen, Betrieb und Telefonnummer. Er meldet sich, kommt, erledigt. Rechnung und Dokumente landen in deiner Hausakte.', visual: <AppFrame size="sm"><ContactScreen /></AppFrame> },
          ]}
        />
      </EHSection>

      <EHSection compact>
          <EHProse>
            <p><strong>Das Prinzip.</strong> Eine Frage ist noch kein Auftrag. <mark>Du entscheidest, wann daraus einer wird.</mark></p>
          </EHProse>
        </EHSection>

      <EHSection compact>
        <EHEyebrow>Ein echter Vorgang</EHEyebrow>
        <EHHeading>So sieht das in einer Woche aus.</EHHeading>
        <EHText size="lead">Vom ersten Satz bis zur Rechnung in der Hausakte. Keine Warteschleife, keine fünf Rückrufe.</EHText>
        <EHSplitStory title="So sieht das in einer Woche aus." text="Vom ersten Satz bis zur Rechnung in der Hausakte. Keine Warteschleife, keine fünf Rückrufe." media={<><Image src="/images/marketing/owner-kitchen.jpg" alt="Hausbesitzerin am Küchentisch schaut entspannt auf ihr Handy" width={1024} height={1024} sizes="(min-width: 900px) 440px, 100vw" /><span><Phone size={18} aria-hidden="true" /> Du musst niemanden hinterhertelefonieren</span></>}>
          <Timeline items={CASE} />
        </EHSplitStory>
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Drei Wege</EHEyebrow>
        <EHHeading>Rat, Kontakt oder Auftrag. Getrennte Entscheidungen.</EHHeading>
        <EHText size="lead">Du gehst jeden Weg nur, wenn du es willst. Nichts passiert automatisch.</EHText>
        <EHFeatureRows items={[
          { icon: <MessageCircle size={20} />, title: 'Nur eine Frage klären', text: 'Zuerst verstehen, was wahrscheinlich sinnvoll ist. Dabei entsteht kein Auftrag und niemand ruft dich ungefragt an.' },
          { icon: <UserRound size={20} />, title: 'Einen Menschen sprechen', text: 'Ein passender geprüfter Partner wird als konkreter Ansprechpartner verbunden, auch ohne Buchung. Zum Beispiel, um eine Einschätzung zu bekommen.' },
          { icon: <Wrench size={20} />, title: 'Erledigen lassen', text: 'Wenn du willst, dass es gemacht wird, vervollständigen wir die Auftragsdaten, holen Kostenrahmen und Termin ein und du gibst frei.' },
        ]} />
        <EHActions>
          <EHButton href="/beratung">Beratung ansehen</EHButton>
          <EHButton href="/notfall" variant="secondary">Dringender Fall</EHButton>
        </EHActions>
      </EHSection>

      <EHSection compact id="ansprechpartner">
        <EHEyebrow>Dein Ansprechpartner</EHEyebrow>
        <EHHeading>Ein Mensch, kein Ticket.</EHHeading>
        <EHText size="lead">Bei Einfach Hausen sprichst du nicht mit einer Hotline. Nach der Vermittlung hast du einen konkreten Menschen mit Namen, Betrieb und Nummer, und der bleibt in deiner Hausakte, auch für das nächste Mal.</EHText>
        <EHSplitStory title="Ein Mensch, kein Ticket." text="Nach der Vermittlung hast du einen konkreten Menschen mit Namen, Betrieb und Nummer." media={<AppFrame label="Ansprechpartner-Ansicht in der App mit Name, Betrieb und Chat"><ContactScreen /></AppFrame>}>
          <EHList label="Ansprechpartner" items={[
              'Du siehst vorher, wer kommt: Name, Betrieb, Entfernung, Bewertung',
              'Direkter Draht per Anruf oder Nachricht, ohne Umweg über uns',
              'Der Kontakt bleibt am Haus gespeichert und ist beim nächsten Anliegen wieder da',
              'Persönlich geprüfte Partnerbetriebe aus deiner Region, kein offenes Firmenverzeichnis',
            ].map((b, k) => ({ id: 'sof-kontakt-' + k, title: b }))} />
          <EHActions>
            <EHButton href="/#anliegen" arrow>Anliegen starten</EHButton>
            <EHButton href="/sicherheit" variant="secondary">Wie wir Partner prüfen</EHButton>
          </EHActions>
        </EHSplitStory>
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Matching</EHEyebrow>
        <EHHeading>Passend schlägt laut.</EHHeading>
        <EHText size="lead">Bei der Auswahl zählen fachliche Eignung, Region, Verfügbarkeit, Kapazität und Kundenzufriedenheit. Ein Partner-Tarif kann die Reihenfolge nicht kaufen.</EHText>
        <EHFeatureRows items={[
          { icon: <ShieldCheck size={20} />, title: 'Geprüft und vertraglich gebunden', text: 'Partner werden vor der ersten Vermittlung persönlich geprüft und verpflichten sich auf unsere Regeln.' },
          { icon: <UserRound size={20} />, title: 'Beziehungen zählen', text: 'Hat ein Partner schon bei dir gearbeitet und es lief gut, bevorzugen wir ihn beim nächsten passenden Anliegen.' },
          { icon: <Wrench size={20} />, title: 'Ein Vorgang, alles drin', text: 'Angebot, Termin, Nachrichten, Dokumente, Rechnung und Status gehören zusammen, nicht in fünf Chats und drei Postfächer.' },
        ]} />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Häufige Fragen</EHEyebrow>
        <EHHeading>Was oft gefragt wird.</EHHeading>
        <EHFAQ items={[
            { q: 'Wie schnell meldet sich jemand?', a: 'In der Pilotphase bekommst du in der Regel innerhalb eines Werktags einen Vorschlag mit Partner und Kostenrahmen. Bei dringenden Fällen kennzeichnest du das beim Beschreiben.' },
            { q: 'Kann ich einen Partner ablehnen?', a: 'Ja, jederzeit und ohne Begründung. Dann schlagen wir einen anderen vor, sofern in deiner Region verfügbar.' },
            { q: 'Wer stellt die Rechnung?', a: 'Der Partnerbetrieb rechnet direkt mit dir ab, zu dem Kostenrahmen, den du vorher bestätigt hast. Einfach Hausen nimmt keine Provision auf den Auftrag.' },
            { q: 'Was, wenn etwas nicht gut läuft?', a: 'Dann sagst du es im Vorgang. Wir haben den kompletten Verlauf und kümmern uns um Klärung mit dem Partner. Fertig ist ein Vorgang erst, wenn du ihn abschließt.' },
          ]} />
      </EHSection>

      <EHClosing title="Starte mit dem Problem, nicht mit dem Gewerk." text="Ein Satz reicht. Das Hauskonto ist kostenlos, ein Anliegen löst nichts automatisch aus." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
      </EHScope>
    </MarketingShell>
  );
}
