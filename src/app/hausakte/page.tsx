import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { EHScope, EHSection, EHProductIntroduction, EHButton, EHProductScreenshot, EHSectionHeading, EHFeatureRows, EHFAQ, EHText, EHActions } from '@/design-system';

export const metadata: Metadata = {
 title: 'Digitale Hausakte – Hausdaten, Technik und Wartungen im Überblick',
 description: 'Dein Hauswissen an einem Ort: Anlagen erfassen, Wartungen überblicken und Unterlagen zu deinen Aufträgen wiederfinden.',
 alternates: { canonical: canonical('/hausakte') },
};
export default function Page() {
 return <MarketingShell><EHScope>
  <EHSection compact>
   <EHProductIntroduction eyebrow="Die digitale Hausakte" title="Dein Hauswissen. An einem Ort."
    text="Technische Angaben, Wartungen und dokumentierte Arbeiten gehören zusammen. Mit deiner Hausakte findest du den Zusammenhang wieder – bei der nächsten Rückfrage, Reparatur oder Planung."
    actions={<><EHButton href="/register?role=homeowner" arrow>Hausakte kostenlos anlegen</EHButton><EHButton href="#arbeitsbereich" variant="secondary">Arbeitsbereich ansehen</EHButton></>} />
  </EHSection>
  <EHSection compact id="arbeitsbereich" tone="white">
   <EHProductScreenshot src="/images/marketing/house-workspace-reference.png" alt="Mein Haus: kompakte Hausdaten, Technik, nächste Wartungen und Bearbeitungsbereiche"
    caption={<>Echte Produktansicht mit eigens angelegten Beispieldaten. <a href="/images/marketing/house-workspace-reference.png" target="_blank" rel="noreferrer">Ansicht in voller Größe öffnen</a>.</>} />
  </EHSection>
  <EHSection compact>
   <EHSectionHeading title="Für die Fragen, die am Haus immer wieder auftauchen." />
   <EHFeatureRows items={[
    { title: 'Welche Anlage ist eingebaut?', text: 'Hersteller, Modell und Installationsjahr erfasst du bei deiner Technik. So kannst du Angaben nachsehen, statt erneut nach Typenschildern zu suchen.' },
    { title: 'Was wurde bereits erledigt?', text: 'Hinterlegte Arbeiten und abgeschlossene Wartungen bleiben nachvollziehbar. Rechnungen und Nachweise findest du bei den zugehörigen Vorgängen.' },
    { title: 'Was steht als Nächstes an?', text: 'Dein Jahresplan zeigt erfasste Wartungsaufgaben. Du kannst Erledigtes bestätigen oder Hilfe für den nächsten Schritt anfragen.' },
   ]} />
  </EHSection>
  <EHSection compact tone="white">
   <EHSectionHeading title="Mit einer Anlage anfangen." text="Du brauchst keine vollständige Bestandsaufnahme. Lege dein Hauskonto an, ergänze deine Hausdaten und erfasse zum Beispiel die Heizung. Weiteres kommt dazu, wenn du es brauchst." />
   <EHActions><EHButton href="/register?role=homeowner">Kostenlos starten</EHButton><EHButton href="/app/home" variant="secondary">Meine Hausakte öffnen</EHButton></EHActions>
  </EHSection>
  <EHSection compact>
   <EHSectionHeading title="Vor dem Start." />
   <EHFAQ items={[
    {q:'Was kostet die Hausakte?',a:<>Sie gehört zum kostenlosen Hauskonto. Zusätzliche Betreuung und Handwerkerleistungen werden separat vereinbart. <a href="/preise">Preise ansehen</a>.</>},
    {q:'Welche Daten sind bereits vorhanden?',a:'Die Hausakte zeigt die tatsächlich erfassten Angaben und Vorgänge. Nicht hinterlegte Informationen und Unterlagen müssen ergänzt werden.'},
    {q:'Wird aus einer Wartung automatisch ein Auftrag?',a:'Nein. Eine Aufgabe im Jahresplan dient der Übersicht. Ob und welchen Betrieb du beauftragst, entscheidest du separat.'},
    {q:'Kann das bei Schaden oder Verkauf helfen?',a:<>Vorhandene Angaben und Nachweise können die Vorbereitung erleichtern. Mehr zur <a href="/versicherung">Versicherungsunterstützung</a> und zum <a href="/immobilienverkauf">Immobilienverkauf</a>. Prüfe vor einer Freigabe Empfänger und Datenumfang.</>},
   ]} />
   <EHText size="meta">Informationen zur Datenverarbeitung findest du in der <a href="/datenschutz">Datenschutzerklärung</a>.</EHText>
  </EHSection>
 </EHScope></MarketingShell>;
}
