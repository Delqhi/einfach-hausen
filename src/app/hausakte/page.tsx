import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, HausakteScreen, MiniHausakte, MiniReminder } from '@/components/marketing/app-frames';
import { Reveal } from '@/components/marketing/motion';
import { CtaBand, Faq, LinkButton, Section, TextLink, mkt as styles } from '@/components/marketing/ui';
import { DossierHero, FaqFrame, Handover, Spine } from '@/components/marketing/archetypes';

// Archetyp C – Dossier. Die Seite sieht jetzt aus wie das Produkt, das sie
// beschreibt: Aktenkopf mit Label-Wert-Zeilen, danach eine Rail mit
// Einträgen entlang des Lebenszyklus der Akte statt eines Sechser-Rasters
// aus gleich großen Karten.

export const metadata: Metadata = { title: 'Digitale Hausakte', description: 'Technik, Arbeiten, Dokumente, Garantien, Wartungen und Ansprechpartner: die Geschichte deines Hauses an einem Ort, automatisch gepflegt.', alternates: { canonical: canonical('/hausakte') } };

export default function Page() {
  return (
    <MarketingShell>
      <DossierHero
        eyebrow="Digitale Hausakte"
        title="Dein Haus bekommt ein Gedächtnis."
        lead="Wer hat 2019 das Dach gemacht? Ist auf der Wärmepumpe noch Garantie? Wann war die letzte Wartung? Fragen, die heute in Ordnern, Mails und Köpfen verstreut sind, beantwortet deine Hausakte in einer Sekunde."
        meta={[
          { key: 'Enthalten in', value: 'Hauskonto FREE, 0 € pro Monat' },
          { key: 'Umfang', value: 'Anlagen, Historie, Dokumente, Wartung, Ansprechpartner' },
          { key: 'Pflege', value: 'Füllt sich automatisch aus jedem Vorgang' },
          { key: 'Eigentum', value: 'Deine Daten, jederzeit exportierbar' },
        ]}
        actions={<><LinkButton href="/register?role=homeowner">Hausakte kostenlos anlegen</LinkButton><LinkButton href="/#anliegen" secondary>Anliegen starten</LinkButton></>}
        aside={<AppFrame label="Hausakte in der App: Wärmepumpe mit aktiver Garantie, Verlauf und Dokumenten"><HausakteScreen /></AppFrame>}
      />

      <Spine
        eyebrow="Was zusammenkommt"
        title="Eine Akte, die mit dem Haus wächst."
        text="Nicht sechs Funktionen nebeneinander, sondern eine Reihenfolge: was beim Anlegen entsteht, was nach jedem Auftrag dazukommt und was am Ende übergeben wird."
        records={[
          { when: 'Beim Anlegen', title: 'Haus und Anlagen', text: 'Adresse, Haustyp, Baujahr und Flächen, dazu Technik und Ausstattung: Heizung, PV, Wallbox, Dach, Fenster. Das ist das Gerüst, an dem später alles hängt.', tags: ['Stammdaten', 'Technik'] },
          { when: 'Nach jedem Auftrag', title: 'Historie', text: 'Erledigte Arbeiten, Kosten, Garantien, Fotos und Hinweise bleiben zeitlich nachvollziehbar. Du musst nichts abheften, der Vorgang legt sich selbst ab.', tags: ['Arbeiten', 'Kosten', 'Garantien'] },
          { when: 'Automatisch abgelegt', title: 'Dokumente', text: 'Rechnungen, Belege und Unterlagen liegen am passenden Vorgang und Bauteil, nicht in einem Sammelordner. Was du schon hast, lädst du einmal hoch.', tags: ['Rechnungen', 'Belege'] },
          { when: 'Vorausschauend', title: 'Wartung und Zukunft', text: 'Weil die Akte weiß, wann die letzte Wartung war und wie lange die Garantie läuft, erinnert sie rechtzeitig. Aus einem Hinweis wird ein organisierter Termin.', tags: ['Erinnerungen', 'Hausjahresplan'] },
          { when: 'Dauerhaft', title: 'Ansprechpartner', text: 'Bewährte Betriebe und konkrete Menschen bleiben nach Bereichen mit dem Haus verbunden. Beim nächsten Mal musst du nicht wieder von vorne suchen.', tags: ['Betriebe', 'Menschen'] },
          { when: 'Beim Verkauf', title: 'Kontrollierte Übergabe', text: 'Beim Eigentümerwechsel wird nur freigegebene Hausgeschichte weitergegeben, keine privaten Nachrichten und keine Zahlungsdaten.', tags: ['Freigabe', 'Hauswert'] },
        ]}
      />

      <Section eyebrow="Der Unterschied" title="Kein Ordner, den du führen musst." text="Die Hausakte füllt sich von selbst. Jeder Vorgang über Einfach Hausen legt Rechnung, Protokoll, Fotos und Ansprechpartner am richtigen Bauteil ab.">
        <div className={styles.benefitList}>
          <Reveal className={styles.benefit}>
            <div className={styles.benefitCopy}>
              <h3>Automatisch statt abgeheftet</h3>
              <p>Nach jedem erledigten Auftrag landen Rechnung, Garantie und Protokoll dort, wo sie hingehören: bei der Heizung, beim Dach, bei der Elektrik. Ohne dass du daran denkst.</p>
              <TextLink href="/so-funktionierts">So läuft ein Vorgang ab</TextLink>
            </div>
            <div className={styles.benefitVisual}><MiniHausakte /></div>
          </Reveal>
          <Reveal className={styles.benefit} data-flip="true">
            <div className={styles.benefitCopy}>
              <h3>Aus Historie wird Vorsorge</h3>
              <p>Weil die Akte weiß, wann die letzte Wartung war und wie lange die Garantie läuft, erinnert sie dich rechtzeitig. Aus einem Tipp wird ein organisierter Termin.</p>
            </div>
            <div className={styles.benefitVisual}><MiniReminder /></div>
          </Reveal>
        </div>
      </Section>

      <Handover
        eyebrow="Eigentümerwechsel"
        title="Die Immobilie bleibt. Private Kommunikation bleibt privat."
        text="Hausbezogene Historie ist getrennt von deinen persönlichen Daten. Du entscheidest, was ein Käufer sieht. Eine lückenlose Hausakte ist beim Verkauf bares Geld."
        columns={[
          {
            label: 'Kann weitergegeben werden',
            title: 'Freigegebene Hausgeschichte',
            items: ['Technik und Anlagen des Hauses', 'Dokumentierte Arbeiten und Wartungen', 'Freigegebene Garantien und Unterlagen', 'Hausbezogene Ansprechpartner, soweit freigegeben'],
          },
          {
            label: 'Bleibt bei dir',
            title: 'Private Inhalte',
            items: ['Nachrichten mit Partnern', 'Zahlungsdaten', 'Nicht freigegebene Unterlagen', 'Deine komplette Kontohistorie'],
          },
        ]}
      />

      <FaqFrame
        eyebrow="Häufige Fragen"
        title="Zur Hausakte."
        text={<>Wie ein Vorgang in der Akte landet, zeigt <a href="/so-funktionierts">So funktioniert es</a>.</>}
      >
        <Faq items={[
          { q: 'Ist die Hausakte kostenlos?', a: 'Ja. Die digitale Hausakte ist Teil des kostenlosen Hauskontos, ohne Limit bei Dokumenten oder Vorgängen. Erweiterte Wartungs- und Servicefunktionen sind optional.' },
          { q: 'Kann ich alte Rechnungen nachtragen?', a: 'Ja. Fotografiere oder lade Dokumente hoch und ordne sie einem Bauteil zu. Ab dann pflegt sich die Akte über Vorgänge selbst weiter.' },
          { q: 'Wem gehören die Daten?', a: 'Dir. Du kannst die Hausakte jederzeit exportieren und dein Konto löschen. Wir verkaufen keine Daten und geben nichts ohne deine Freigabe weiter.' },
          { q: 'Was passiert, wenn ich das Haus verkaufe?', a: 'Du gibst frei, welche Teile der Hausgeschichte an den neuen Eigentümer übergehen. Private Inhalte bleiben bei dir.' },
        ]} />
      </FaqFrame>

      <CtaBand title="Beginne heute mit der Geschichte deines Hauses." text="Das kostenlose Hauskonto enthält die digitale Hausakte. Erstes Anliegen oder erstes Dokument, du entscheidest, wie du startest." />
    </MarketingShell>
  );
}
