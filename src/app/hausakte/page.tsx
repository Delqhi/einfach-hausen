import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { FileText, History, Home, LockKeyhole, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, HausakteScreen, MiniHausakte, MiniReminder } from '@/components/marketing/app-frames';
import { Reveal } from '@/components/marketing/motion';
import { BulletList, CtaBand, Faq, FeatureGrid, InfoPanel, LinkButton, PageHero, Section, Split, Statement, TextLink, mkt as styles } from '@/components/marketing/ui';

export const metadata: Metadata = { title: 'Digitale Hausakte', description: 'Technik, Arbeiten, Dokumente, Garantien, Wartungen und Ansprechpartner: die Geschichte deines Hauses an einem Ort, automatisch gepflegt.' , alternates: { canonical: canonical('/hausakte') } };

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Digitale Hausakte"
        title="Dein Haus bekommt ein Gedächtnis."
        text="Wer hat 2019 das Dach gemacht? Ist auf der Wärmepumpe noch Garantie? Wann war die letzte Wartung? Fragen, die heute in Ordnern, Mails und Köpfen verstreut sind, beantwortet deine Hausakte in einer Sekunde."
        actions={<><LinkButton href="/register?role=homeowner">Hausakte kostenlos anlegen</LinkButton><LinkButton href="/#anliegen" secondary>Anliegen starten</LinkButton></>}
        aside={<AppFrame label="Hausakte in der App: Wärmepumpe mit aktiver Garantie, Verlauf und Dokumenten"><HausakteScreen /></AppFrame>}
      />

      <Section tone="surface" eyebrow="Der Unterschied" title="Kein Ordner, den du führen musst." text="Die Hausakte füllt sich von selbst. Jeder Vorgang über Einfach Hausen legt Rechnung, Protokoll, Fotos und Ansprechpartner am richtigen Bauteil ab. Was du schon hast, lädst du einmal hoch.">
        <div className={styles.benefitList}>
          <Reveal className={styles.benefit}>
            <div className={styles.benefitCopy}><h3>Automatisch statt abgeheftet</h3><p>Nach jedem erledigten Auftrag landen Rechnung, Garantie und Protokoll dort, wo sie hingehören: bei der Heizung, beim Dach, bei der Elektrik. Ohne dass du daran denkst.</p><TextLink href="/so-funktionierts">So läuft ein Vorgang ab</TextLink></div>
            <div className={styles.benefitVisual}><MiniHausakte /></div>
          </Reveal>
          <Reveal className={styles.benefit} data-flip="true">
            <div className={styles.benefitCopy}><h3>Aus Historie wird Vorsorge</h3><p>Weil die Akte weiß, wann die letzte Wartung war und wie lange die Garantie läuft, erinnert sie dich rechtzeitig. Aus einem Tipp wird ein organisierter Termin.</p></div>
            <div className={styles.benefitVisual}><MiniReminder /></div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Was zusammenkommt" title="Eine Akte, die mit dem Haus wächst.">
        <FeatureGrid cols={3} items={[
          { icon: <Home size={20} />, title: 'Haus & Anlagen', text: 'Adresse, Haustyp, Baujahr, Flächen sowie Technik und Ausstattung: Heizung, PV, Wallbox, Dach, Fenster.' },
          { icon: <History size={20} />, title: 'Historie', text: 'Erledigte Arbeiten, Kosten, Garantien, Fotos und Hinweise bleiben zeitlich nachvollziehbar.' },
          { icon: <FileText size={20} />, title: 'Dokumente', text: 'Rechnungen, Belege und Unterlagen liegen am passenden Vorgang und Bauteil, nicht in einem Sammelordner.' },
          { icon: <Wrench size={20} />, title: 'Wartung & Zukunft', text: 'Aus Anlagen und erledigten Arbeiten entstehen Erinnerungen und zukünftige Aufgaben.' },
          { icon: <UserRound size={20} />, title: 'Ansprechpartner', text: 'Bewährte Betriebe und konkrete Menschen bleiben nach Bereichen mit dem Haus verbunden.' },
          { icon: <LockKeyhole size={20} />, title: 'Kontrollierte Übergabe', text: 'Beim Eigentümerwechsel wird nur freigegebene Hausgeschichte weitergegeben, keine privaten Nachrichten oder Zahlungen.' },
        ]} />
      </Section>

      <Statement kicker="Hauswert">Eine lückenlose Hausakte ist beim Verkauf <mark>bares Geld.</mark></Statement>

      <Section tone="soft" eyebrow="Eigentümerwechsel" title="Die Immobilie bleibt. Private Kommunikation bleibt privat." text="Hausbezogene Historie ist getrennt von deinen persönlichen Daten. Du entscheidest, was ein Käufer sieht.">
        <Split>
          <InfoPanel label="Kann weitergegeben werden">
            <h3 style={{ fontSize: 22, color: 'var(--eh-teal-900)' }}>Freigegebene Hausgeschichte</h3>
            <BulletList items={['Technik und Anlagen des Hauses', 'Dokumentierte Arbeiten und Wartungen', 'Freigegebene Garantien und Unterlagen', 'Hausbezogene Ansprechpartner, soweit freigegeben']} />
          </InfoPanel>
          <InfoPanel label="Bleibt bei dir">
            <h3 style={{ fontSize: 22, color: 'var(--eh-teal-900)' }}>Private Inhalte</h3>
            <BulletList items={['Nachrichten mit Partnern', 'Zahlungsdaten', 'Nicht freigegebene Unterlagen', 'Deine komplette Kontohistorie']} />
          </InfoPanel>
        </Split>
      </Section>

      <Section eyebrow="Häufige Fragen" title="Zur Hausakte." center>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Faq items={[
            { q: 'Ist die Hausakte kostenlos?', a: 'Ja. Die digitale Hausakte ist Teil des kostenlosen Hauskontos, ohne Limit bei Dokumenten oder Vorgängen. Erweiterte Wartungs- und Servicefunktionen sind optional.' },
            { q: 'Kann ich alte Rechnungen nachtragen?', a: 'Ja. Fotografiere oder lade Dokumente hoch und ordne sie einem Bauteil zu. Ab dann pflegt sich die Akte über Vorgänge selbst weiter.' },
            { q: 'Wem gehören die Daten?', a: 'Dir. Du kannst die Hausakte jederzeit exportieren und dein Konto löschen. Wir verkaufen keine Daten und geben nichts ohne deine Freigabe weiter.' },
            { q: 'Was passiert, wenn ich das Haus verkaufe?', a: 'Du gibst frei, welche Teile der Hausgeschichte an den neuen Eigentümer übergehen. Private Inhalte bleiben bei dir.' },
          ]} />
        </div>
      </Section>

      <CtaBand title="Beginne heute mit der Geschichte deines Hauses." text="Das kostenlose Hauskonto enthält die digitale Hausakte. Erstes Anliegen oder erstes Dokument, du entscheidest, wie du startest." />
    </MarketingShell>
  );
}
