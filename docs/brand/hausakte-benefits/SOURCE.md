# Vollständiger Quelltext

## src/app/hausakte/page.tsx

SHA256 ef6dcb3e98d3271e96d234cadc9a21fe47dddd1d25e38d9911db98d5592e289d

```tsx
import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { EHScope, EHSection, EHPageHero, EHSplitStory, EHFAQ, EHClosing, EHButton, EHText, EHTextLink, EHSectionHeading, EHProductExcerpt, EHProblemNotes, EHProcess, EHCaseStudy, EHPromiseRow } from '@/design-system';

export const metadata: Metadata = {
  title: 'Digitale Hausakte – weniger suchen, besser vorbereitet sein',
  description: 'Technik, Wartungen, Rechnungen zu deinen Aufträgen und Ansprechpartner im Blick. Beginne mit deinem Haus und ergänze die Geschichte Schritt für Schritt.',
  alternates: { canonical: canonical('/hausakte') },
};

export default function Page() {
  return <MarketingShell><EHScope>
    <EHPageHero eyebrow="Deine digitale Hausakte"
      title="Dein Haus im Kopf? Geht auch einfacher."
      text="Welche Heizung ist eingebaut? Wann wurde sie gewartet? Wer kennt sich damit aus? Halte Hausdaten, erledigte Arbeiten und Unterlagen an einem Ort fest – damit du beim nächsten Anliegen nicht wieder von vorn anfangen musst."
      actions={<><EHButton href="/register?role=homeowner" arrow>Meine Hausakte kostenlos starten</EHButton><EHButton href="#hausakte-beispiel" variant="secondary">An einem Beispiel ansehen</EHButton></>}
      media={<EHProductExcerpt label="Technik · Wartung · Unterlagen" title="Alles rund um deine Heizung"
        rows={[
          { title: 'Was ist eingebaut?', text: 'Hersteller, Modell und Installationsjahr deiner Anlage.' },
          { title: 'Was wurde gemacht?', text: 'Erledigte Arbeiten und die dazu vorhandenen Unterlagen.' },
          { title: 'Was steht als Nächstes an?', text: 'Hinterlegte Wartungsaufgaben in deiner Jahresübersicht.' },
        ]} note="Vereinfachte Beispielansicht. Deine Hausakte zeigt die Daten und Vorgänge, die tatsächlich hinterlegt sind." />} />
    <EHSection compact>
      <EHSectionHeading eyebrow="Kommt dir das bekannt vor?" title="Das Haus ist deins. Die Informationen liegen überall." />
      <EHProblemNotes items={[
        { title: '„Die Rechnung müsste in einer Mail sein.“', text: 'Wenn eine Rückfrage kommt, suchst du zwischen Postfach, Papierordner und Downloads.' },
        { title: '„War die Wartung nicht erst letztes Jahr?“', text: 'Ohne nachvollziehbaren Verlauf verlässt du dich auf Erinnerungen – oder fragst wieder nach.' },
        { title: '„Wie hieß noch mal der Betrieb?“', text: 'Bei der nächsten Reparatur beginnt die Suche nach dem passenden Ansprechpartner von vorn.' },
      ]} />
    </EHSection>
    <EHSection tone="white" id="hausakte-beispiel">
      <EHSplitStory eyebrow="Unterlagen wiederfinden" title="Die nächste Rückfrage muss keine Suchaktion werden."
        text="Bei deinen Aufträgen findest du vorhandene Rechnungen, Nachweise und Unterlagen wieder. So kannst du nachsehen, was dokumentiert wurde, und musst nicht alles aus dem Gedächtnis erklären."
        media={<EHProductExcerpt label="Beispiel · abgeschlossener Auftrag" title="Heizungswartung"
          rows={[
            { title: 'Arbeit', text: 'Wartung abgeschlossen und im Verlauf nachvollziehbar.' },
            { title: 'Unterlagen', text: 'Die zum Auftrag hinterlegte Rechnung und weitere Nachweise.' },
            { title: 'Rückfrage', text: 'Der zugehörige Betrieb und vorhandene Kontaktdaten.' },
          ]} note="Unterlagen erscheinen, wenn sie im Vorgang hinterlegt wurden. Ein fehlendes Dokument wird nicht automatisch ersetzt." />}>
        <EHText>Du musst dafür nicht dein ganzes Haus nachträglich erfassen. Beginne mit dem, was du gerade brauchst.</EHText>
      </EHSplitStory>
    </EHSection>
    <EHSection>
      <EHSplitStory reverse eyebrow="Wartungen überblicken" title="Weniger im Kopf behalten. Besser vorbereitet sein."
        text="Erfasse deine Technik und schau in deinen Jahresplan: Welche hinterlegten Wartungen sind offen, welche schon erledigt? So hast du einen Ausgangspunkt für die nächste Planung."
        media={<EHProductExcerpt label="Beispiel · dein Jahresplan" title="Was an deinem Haus ansteht"
          rows={[
            { title: 'Offen', text: 'Anstehende Wartungen mit hinterlegtem Fälligkeitsdatum.' },
            { title: 'Erledigt', text: 'Abgeschlossene Wartungen bleiben in der Historie sichtbar.' },
            { title: 'Nächster Schritt', text: 'Erledigte Wartung bestätigen oder ein Anliegen an den Hausmeister richten.' },
          ]} note="Ein Eintrag ist noch keine Terminbuchung. Was erledigt oder beauftragt wird, entscheidest du." />}>
        <EHTextLink href="/so-funktionierts">So wird aus einem Anliegen ein Vorgang</EHTextLink>
      </EHSplitStory>
    </EHSection>
    <EHCaseStudy eyebrow="Ein typischer Alltag – als Beispiel" title="Die Heizung macht Geräusche. Du weißt, wo du nachsehen kannst."
      text="Mit deiner Hausakte gehst du vorbereitet ins Gespräch: Du kannst Angaben zur Anlage und frühere Arbeiten nachsehen."
      items={[
        { when: 'Nachsehen', title: 'Welche Anlage habe ich?', text: 'Du öffnest die hinterlegte Technik und prüfst Modell und Installationsjahr.' },
        { when: 'Einordnen', title: 'Was wurde zuletzt gemacht?', text: 'Du schaust in die dokumentierten Arbeiten und vorhandenen Unterlagen.' },
        { when: 'Weiterkommen', title: 'Mit Kontext Hilfe anfragen.', text: 'Du beschreibst dein Anliegen. Ob daraus ein Auftrag wird, entscheidest du danach.' },
      ]}
      media={<EHProductExcerpt label="Beispiel · dein Hauswissen" title="Nicht wieder bei null anfangen"
        rows={[
          { title: 'Die Anlage', text: 'Die von dir erfassten technischen Angaben.' },
          { title: 'Die Geschichte', text: 'Die dokumentierten Wartungen und Arbeiten.' },
          { title: 'Die Menschen', text: 'Die zu deinen Vorgängen hinterlegten Ansprechpartner.' },
        ]} note="Illustratives Beispiel, keine echte Kundengeschichte und keine automatische Diagnose." />} />
    <EHSection tone="deep">
      <EHSectionHeading eyebrow="Für dich. Und für später." title="Hauswissen, das nicht mit der letzten Rechnung endet." />
      <EHPromiseRow items={[
        { title: 'Bei einer Reparatur.', text: 'Du kannst vorhandene Angaben und frühere Arbeiten nachsehen, bevor du erneut etwas erklärst.' },
        { title: 'Bei deiner Planung.', text: 'Du behältst hinterlegte Aufgaben und die Entwicklung deines Hauses im Blick.' },
        { title: 'Bei einer Übergabe.', text: 'Eine nachvollziehbare Hausgeschichte kann Fragen beantworten. Prüfe vor jeder Freigabe, welche Daten geteilt werden.' },
      ]} />
    </EHSection>
    <EHSection id="starten">
      <EHSectionHeading eyebrow="Klein anfangen reicht" title="Du brauchst keinen freien Sonntag zum Sortieren."
        text="Deine Hausakte muss am Anfang nicht vollständig sein. Sie wird nützlicher, wenn du sie bei konkreten Anlässen ergänzt." />
      <EHProcess items={[
        { title: 'Hauskonto anlegen.', text: 'Starte kostenlos und erfasse die grundlegenden Angaben zu deinem Haus.' },
        { title: 'Eine Anlage hinzufügen.', text: 'Beginne zum Beispiel mit deiner Heizung. Trage ein, was du weißt; arbeite nicht erst alle alten Ordner durch.' },
        { title: 'Beim nächsten Anlass ergänzen.', text: 'Schau in deinen Jahresplan, dokumentiere eine erledigte Wartung oder organisiere ein Anliegen.' },
      ]} />
    </EHSection>
    <EHSection tone="white">
      <EHSectionHeading eyebrow="Gut zu wissen" title="Eine Hausakte soll entlasten. Nicht neue Fragen aufwerfen." />
      <EHFAQ items={[
        { q: 'Muss ich erst alle alten Unterlagen digitalisieren?', a: 'Nein. Beginne mit deinem Haus und einer Anlage, die dir wichtig ist. Du kannst die Informationen Schritt für Schritt ergänzen. Rechnungen und Nachweise zu deinen Einfachhausen-Aufträgen findest du, sobald sie dort hinterlegt wurden.' },
        { q: 'Was kostet die Hausakte?', a: <>Sie gehört zum kostenlosen Hauskonto. Zusätzliche Betreuung und Handwerkerleistungen sind getrennte Angebote. <a href="/preise">Tarife und Leistungsumfang ansehen</a>.</> },
        { q: 'Ist schon alles über mein Haus vorhanden?', a: 'Nein. Die Hausakte arbeitet mit den Angaben, Vorgängen und Unterlagen, die tatsächlich erfasst wurden. Prüfe wichtige technische Angaben und fehlende Nachweise selbst oder mit dem zuständigen Betrieb.' },
        { q: 'Bucht eine Wartungsaufgabe automatisch einen Handwerker?', a: 'Nein. Eine Aufgabe im Jahresplan ist noch kein Auftrag. Du entscheidest, ob du Hilfe anfragst und welches Angebot du annimmst.' },
        { q: 'Hilft die Hausakte bei Schaden oder Verkauf?', a: <>Vorhandene Hausdaten und Nachweise können die Vorbereitung erleichtern. Eine automatische Versicherungsleistung oder ein höherer Verkaufspreis wird dadurch nicht garantiert. Mehr zu <a href="/versicherung">Versicherungsunterstützung</a> und <a href="/immobilienverkauf">Immobilienverkauf</a>.</> },
        { q: 'Was sollte ich vor einer Datenfreigabe beachten?', a: <>Prüfe Empfänger und Umfang der Freigabe. Eine Hausgeschichte ist nicht dasselbe wie dein gesamtes Konto. Informationen zur Verarbeitung findest du in unserer <a href="/datenschutz">Datenschutzerklärung</a>.</> },
      ]} />
    </EHSection>
    <EHClosing title="Beim nächsten Mal weißt du, wo du nachsiehst."
      text="Beginne mit deinem Haus und einer Anlage. Den Rest ergänzt du, wenn er gebraucht wird."
      href="/register?role=homeowner" label="Meine Hausakte kostenlos starten"
      secondary={<EHButton href="/app/home" variant="secondary">Ich habe schon ein Hauskonto</EHButton>} />
  </EHScope></MarketingShell>;
}
```
