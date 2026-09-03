import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Faq, LinkButton } from '@/components/marketing/ui';
import { Clauses, FaqFrame, Gate, QuietClose, TermsFigure, TermsHero } from '@/components/marketing/archetypes';

// Archetyp D – Terms. Der Partnerbereich verkauft kein Gefühl, er erklärt
// ein Modell. Deshalb ein Vertragsblatt: nüchterner Kopf, numerierte
// Klauseln in zwei Spalten und die Mindestprüfung als Liste mit echten
// Zuständen. Kein Feature-Raster, kein dunkles CTA-Band am Ende.

export const metadata: Metadata = { title: 'Für Betriebe', description: 'Partnernetzwerk für regionale Betriebe: passende Anfragen, direkter Kundenkontakt und 0 % Auftragsprovision.', alternates: { canonical: canonical('/partner') } };

export default function Page() {
  return (
    <MarketingShell>
      <TermsHero
        eyebrow="Für Betriebe"
        title="Passende Anfragen. Persönlicher Kundenkontakt. 0 % Provision."
        lead="Einfach Hausen ist kein offener Lead-Marktplatz. Geprüfte und vertraglich gebundene Unternehmen arbeiten in einem regionalen Qualitätsnetzwerk mit planbaren Monatstarifen. Du bleibst Rechnungssteller, wir sind deine Organisations-Ebene."
        actions={<><LinkButton href="/register?role=provider">Als Partner starten</LinkButton><LinkButton href="/preise" secondary>Partnerpreise</LinkButton></>}
        figure={<TermsFigure src="/images/premium/story-ansprechpartner.jpg" alt="Handwerker im Gespräch mit einer Eigentümerin vor einem Haus" caption="0 % Auftragsprovision: der ausführende Betrieb bleibt Rechnungssteller und behält den vollen Auftragswert." />}
      />

      <Clauses
        id="modell"
        items={[
          {
            title: 'Der Auftragswert bleibt beim Betrieb',
            body: (
              <>
                <p>Einfach Hausen monetarisiert Partner über Monatsabos, nicht über eine Gebühr pro Auftrag. Der ausführende Betrieb bleibt Rechnungssteller und behält 100 % des Auftragswertes.</p>
                <p>Das ist keine Einführungsaktion, sondern das Geschäftsmodell. Ohne Provision haben wir kein Interesse an möglichst vielen oder möglichst teuren Aufträgen, sondern an Vorgängen, die passen.</p>
              </>
            ),
          },
          {
            title: 'Kundenbeziehung statt Lead-Verkauf',
            body: (
              <>
                <p>Eine Anfrage wird nicht an fünf Betriebe verkauft. Nach einer Verbindung kann ein konkreter Ansprechpartner dauerhaft beim Haus des Kunden gespeichert bleiben, mit Namen und Gesicht.</p>
                <p>Beim nächsten Anliegen im selben Bereich ist die Beziehung schon da, statt dass wieder von vorne verglichen wird.</p>
              </>
            ),
          },
          {
            title: 'Ein Arbeitsbereich, der nach Arbeit aussieht',
            body: (
              <>
                <p>Anfragen, Termine, Team, Dokumentation und Rechnung an einem Ort, mit so wenig Verwaltungsballast wie möglich. Bewusst keine Kennzahlenwand: pro Tag zählt der nächste Arbeitsschritt, nicht das Dashboard.</p>
              </>
            ),
          },
          {
            title: 'Ein Firmenkonto, mehrere Menschen, eine Berechtigung',
            body: (
              <>
                <p>Ein Anbieter kann mehrere Tätigkeiten und konkrete Leistungen im selben Firmenkonto führen. Mitarbeitende erhalten eigenen App-Zugang und pflegen ihren zugewiesenen Kundenkontakt.</p>
                <p>Statt einer komplexen Rollenmatrix gibt es genau eine zentrale Berechtigung: <em>Aufträge verwalten</em> an oder aus. Sie steuert, ob jemand neue Anfragen und Zuweisungen verwalten darf oder nur eigene Aufträge sieht.</p>
              </>
            ),
          },
          {
            title: 'Tarife kaufen keine bessere Position',
            body: (
              <>
                <p>FREE startet bei 0 €. START, PRO und PREMIUM sind monatlich planbar und beginnen mit einer zweimonatigen kostenlosen Testphase.</p>
                <p>Beim Matching zählen Entfernung, Fachgebiet, Qualifikation, Verfügbarkeit, Kapazität, Kundenzufriedenheit und bestehende Kundenbeziehungen. Der Tarif steuert den Umfang der Anfragen, nicht die fachliche Rangfolge.</p>
              </>
            ),
          },
        ]}
      />

      <Gate
        id="qualitaet"
        eyebrow="Qualitätsnetzwerk"
        title="Nicht jeder Eintrag wird automatisch Partner."
        text="Vor aktiver Vermittlung sieht das Produktmodell eine Mindestprüfung und einen aktiven Partnervertrag vor. Bis beides vorliegt, bleibt der Zugang bestehen, aber es werden keine Anfragen zugeteilt."
        items={[
          { label: 'Gewerbe oder Unternehmen', note: 'Pflicht' },
          { label: 'Erforderliche Qualifikationen und Zulassungen', note: 'Pflicht' },
          { label: 'Betriebshaftpflicht', note: 'Pflicht' },
          { label: 'Referenzen oder vorhandene Bewertungen', note: 'Prüfung' },
          { label: 'Einsatzregion und Kapazität', note: 'Prüfung' },
          { label: 'Kommunikations- und Qualitätsstandard', note: 'Prüfung' },
          { label: 'Aktiver Partnervertrag', note: 'Vor Vermittlung' },
        ]}
      />

      <FaqFrame
        eyebrow="Häufige Fragen"
        title="Zum Partnermodell."
        text={<>Alle Tarife im direkten Vergleich: <a href="/preise">Partnerpreise ansehen</a>.</>}
      >
        <Faq items={[
          { q: 'Was kostet mich ein Auftrag?', a: 'Nichts an uns. Es gibt keine Auftragsprovision und keine Erfolgsgebühr. Du rechnest direkt mit dem Kunden ab und bleibst Rechnungssteller. Bezahlt wird nur der Monatstarif, und der ist unabhängig vom Auftragsvolumen.' },
          { q: 'Bekomme ich mehr Anfragen, wenn ich einen höheren Tarif wähle?', a: 'Der Tarif steuert, wie viele neue Anfragen du gleichzeitig bearbeiten kannst, nicht deine fachliche Rangfolge. Ob du zu einer Anfrage passt, entscheiden Gewerk, Region, Qualifikation, Kapazität und Zufriedenheit.' },
          { q: 'Wie lange dauert die Prüfung?', a: 'Das hängt davon ab, wie vollständig die Unterlagen sind. Du kannst dein Konto sofort anlegen und den Arbeitsbereich ansehen. Anfragen werden erst zugeteilt, wenn Prüfung und Partnervertrag aktiv sind.' },
          { q: 'Kann mein Team mitarbeiten?', a: 'Ja. Mehrere Ansprechpartner teilen ein Firmenkonto und haben eigenen App-Zugang. Eine zentrale Berechtigung entscheidet, wer neue Anfragen und Zuweisungen verwalten darf.' },
        ]} />
      </FaqFrame>

      <QuietClose
        title="Partner werden, ohne pro Auftrag abzugeben."
        text="Starte die Registrierung für deinen Betrieb. Die aktive Vermittlung setzt Prüfung und Partnerstatus voraus, das Anlegen des Kontos kostet nichts."
        actions={<><LinkButton href="/register?role=provider">Partnerkonto starten</LinkButton><LinkButton href="/preise" secondary>Tarife vergleichen</LinkButton></>}
      />
    </MarketingShell>
  );
}
