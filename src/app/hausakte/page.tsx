import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { FileText, History, Home, LockKeyhole, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, HausakteScreen, MiniHausakte, MiniReminder } from '@/components/marketing/app-frames';
import { EHScope, EHSection, EHPageHero, EHSplitStory, EHFeatureRows, EHPanel, EHList, EHFAQ, EHClosing, EHButton, EHActions, EHEyebrow, EHHeading, EHText, EHProse, EHTextLink } from '@/design-system';

export const metadata: Metadata = { title: 'Digitale Hausakte', description: 'Technik, Arbeiten, Dokumente, Garantien, Wartungen und Ansprechpartner: die Geschichte deines Hauses an einem Ort, automatisch gepflegt.' , alternates: { canonical: canonical('/hausakte') } };

export default function Page() {
  return (
    <MarketingShell>
      <EHScope>
      <EHPageHero
        eyebrow="Digitale Hausakte"
        title="Dein Haus bekommt ein Gedächtnis."
        text="Wer hat 2019 das Dach gemacht? Ist auf der Wärmepumpe noch Garantie? Wann war die letzte Wartung? Fragen, die heute in Ordnern, Mails und Köpfen verstreut sind, beantwortet deine Hausakte in einer Sekunde."
        actions={<><EHButton href="/register?role=homeowner" arrow>Hausakte kostenlos anlegen</EHButton><EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton></>}
        media={<AppFrame label="Hausakte in der App: Wärmepumpe mit aktiver Garantie, Verlauf und Dokumenten"><HausakteScreen /></AppFrame>}
      />

      <EHSection compact>
        <EHEyebrow>Der Unterschied</EHEyebrow>
        <EHHeading>Kein Ordner, den du führen musst.</EHHeading>
        <EHText size="lead">Die Hausakte füllt sich von selbst. Jeder Vorgang über Einfach Hausen legt Rechnung, Protokoll, Fotos und Ansprechpartner am richtigen Bauteil ab. Was du schon hast, lädst du einmal hoch.</EHText>
        <EHSplitStory title="Automatisch statt abgeheftet." text="Nach jedem erledigten Auftrag landen Rechnung, Garantie und Protokoll dort, wo sie hingehören: bei der Heizung, beim Dach, bei der Elektrik. Ohne dass du daran denkst." media={<MiniHausakte />}>
          <EHTextLink href="/so-funktionierts">So läuft ein Vorgang ab</EHTextLink>
        </EHSplitStory>
        <EHSplitStory title="Aus Historie wird Vorsorge." text="Weil die Akte weiß, wann die letzte Wartung war und wie lange die Garantie läuft, erinnert sie dich rechtzeitig. Aus einem Tipp wird ein organisierter Termin." media={<MiniReminder />} reverse />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Was zusammenkommt</EHEyebrow>
        <EHHeading>Eine Akte, die mit dem Haus wächst.</EHHeading>
        <EHFeatureRows items={[
          { icon: <Home size={20} />, title: 'Haus & Anlagen', text: 'Adresse, Haustyp, Baujahr, Flächen sowie Technik und Ausstattung: Heizung, PV, Wallbox, Dach, Fenster.' },
          { icon: <History size={20} />, title: 'Historie', text: 'Erledigte Arbeiten, Kosten, Garantien, Fotos und Hinweise bleiben zeitlich nachvollziehbar.' },
          { icon: <FileText size={20} />, title: 'Dokumente', text: 'Rechnungen, Belege und Unterlagen liegen am passenden Vorgang und Bauteil, nicht in einem Sammelordner.' },
          { icon: <Wrench size={20} />, title: 'Wartung & Zukunft', text: 'Aus Anlagen und erledigten Arbeiten entstehen Erinnerungen und zukünftige Aufgaben.' },
          { icon: <UserRound size={20} />, title: 'Ansprechpartner', text: 'Bewährte Betriebe und konkrete Menschen bleiben nach Bereichen mit dem Haus verbunden.' },
          { icon: <LockKeyhole size={20} />, title: 'Kontrollierte Übergabe', text: 'Beim Eigentümerwechsel wird nur freigegebene Hausgeschichte weitergegeben, keine privaten Nachrichten oder Zahlungen.' },
        ]} />
      </EHSection>

      <EHSection compact>
          <EHProse>
            <p><strong>Hauswert.</strong> Eine lückenlose Hausakte ist beim Verkauf <mark>bares Geld.</mark></p>
          </EHProse>
        </EHSection>

      <EHSection compact>
        <EHEyebrow>Eigentümerwechsel</EHEyebrow>
        <EHHeading>Die Immobilie bleibt. Private Kommunikation bleibt privat.</EHHeading>
        <EHText size="lead">Hausbezogene Historie ist getrennt von deinen persönlichen Daten. Du entscheidest, was ein Käufer sieht.</EHText>
        <EHPanel title="Kann weitergegeben werden">
          <EHHeading as="h3" scale="item">Freigegebene Hausgeschichte</EHHeading>
          <EHList label="Freigegebene Hausgeschichte" items={['Technik und Anlagen des Hauses', 'Dokumentierte Arbeiten und Wartungen', 'Freigegebene Garantien und Unterlagen', 'Hausbezogene Ansprechpartner, soweit freigegeben'].map((b, k) => ({ id: 'akte-share-' + k, title: b }))} />
        </EHPanel>
        <EHPanel title="Bleibt bei dir">
          <EHHeading as="h3" scale="item">Private Inhalte</EHHeading>
          <EHList label="Private Inhalte" items={['Nachrichten mit Partnern', 'Zahlungsdaten', 'Nicht freigegebene Unterlagen', 'Deine komplette Kontohistorie'].map((b, k) => ({ id: 'akte-privat-' + k, title: b }))} />
        </EHPanel>
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Wenn mehr daraus wird</EHEyebrow>
        <EHHeading>Hauswissen hilft auch bei Schaden und Verkauf.</EHHeading>
        <EHText size="lead">Die Akte ist nicht nur Archiv. Sie schafft Kontext für spätere Entscheidungen, ohne private Inhalte automatisch weiterzugeben.</EHText>
        <EHPanel title="Schadenfall">
          <EHHeading as="h3" scale="item">Auftrag und Dokumentation zusammenhalten.</EHHeading>
          <EHText>Ein interner Servicefall kann an einen bestehenden Auftrag gekoppelt werden. Eine Versicherung wird dadurch nicht automatisch angeschrieben.</EHText>
          <EHTextLink href="/versicherung">Versicherungsunterstützung verstehen</EHTextLink>
        </EHPanel>
        <EHPanel title="Verkauf">
          <EHHeading as="h3" scale="item">Hausgeschichte zeigen, Privates schützen.</EHHeading>
          <EHText>Bewertung und Makler-Matching können auf Hausdaten aufbauen. Welche Kontakt- und Objektdaten geteilt werden, bleibt eine ausdrückliche Freigabe.</EHText>
          <EHTextLink href="/immobilienverkauf">Immobilienverkauf organisieren</EHTextLink>
        </EHPanel>
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Häufige Fragen</EHEyebrow>
        <EHHeading>Zur Hausakte.</EHHeading>
<EHFAQ items={[
            { q: 'Ist die Hausakte kostenlos?', a: 'Ja. Die digitale Hausakte ist Teil des kostenlosen Hauskontos, ohne Limit bei Dokumenten oder Vorgängen. Erweiterte Wartungs- und Servicefunktionen sind optional.' },
            { q: 'Kann ich alte Rechnungen nachtragen?', a: 'Ja. Fotografiere oder lade Dokumente hoch und ordne sie einem Bauteil zu. Ab dann pflegt sich die Akte über Vorgänge selbst weiter.' },
            { q: 'Wem gehören die Daten?', a: 'Dir. Du kannst die Hausakte jederzeit exportieren und dein Konto löschen. Wir verkaufen keine Daten und geben nichts ohne deine Freigabe weiter.' },
            { q: 'Was passiert, wenn ich das Haus verkaufe?', a: 'Du gibst frei, welche Teile der Hausgeschichte an den neuen Eigentümer übergehen. Private Inhalte bleiben bei dir.' },
          ]} />
      </EHSection>

      <EHClosing title="Beginne heute mit der Geschichte deines Hauses." text="Das kostenlose Hauskonto enthält die digitale Hausakte. Erstes Anliegen oder erstes Dokument, du entscheidest, wie du startest." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
      </EHScope>
    </MarketingShell>
  );
}
