import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, InfoPanel, LegalNotice, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Vertragsmodell, Verbraucherinformationen und AGB-Veröffentlichungsstatus von Einfach Hausen.', alternates: { canonical: canonical('/agb') },
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Rechtliches"
        title="Allgemeine Geschäftsbedingungen"
        text="Diese Seite macht das Produkt- und Vertragsmodell nachvollziehbar, veröffentlicht aber noch keine ungeprüften rechtsverbindlichen Vertragsbedingungen. Die finalen AGB müssen Betreiber, Rollen und reale Zahlungs- und Leistungsabläufe verbindlich abbilden."
      />

      <Section eyebrow="Stand" title="Noch keine rechtsverbindlichen finalen AGB.">
        <LegalNotice title="Launch-Blocker: Vertrags- und Verbraucherbedingungen benötigen externe Freigabe">
          <p>
            Vertragspartner, Plattformrolle, Vertragsschluss, Entgelte, Abonnements, Kündigung, Widerruf, Haftung, Gewährleistung, Partnerbedingungen und Streitbeilegung sind noch nicht als Gesamtwerk rechtlich freigegeben. Produktcode oder Marketingtexte ersetzen diese Prüfung nicht.
          </p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Produktwahrheiten" title="Was im Produkt bereits bewusst getrennt ist" tone="green">
        <BulletList items={[
          'Eine normale Frage erzeugt nicht automatisch einen Auftrag.',
          '„Ansprechpartner finden“ und „Auftrag organisieren“ sind getrennte, bewusste Entscheidungen.',
          'Ausführende Partnerbetriebe sind eigenständige Unternehmen und keine anonymen internen Einsatzkräfte.',
          'Das definierte Geschäftsmodell sieht keine Auftragsprovision auf den Auftragswert vor.',
          'Ein bezahlter Partnertarif darf die fachliche Matching-Position nicht verbessern.',
        ]} />
        <p>
          Diese Produktregeln sind wichtige Eingaben für die finalen Vertragsbedingungen, aber allein noch keine vollständigen AGB.
        </p>
      </Section>

      <Section eyebrow="Kundenverhältnis" title="Diese Punkte müssen die finalen AGB eindeutig regeln.">
        <BulletList items={[
          'Wer Betreiber und Vertragspartner für die Plattformnutzung ist und welche Rolle Einfach Hausen bei Kontaktvermittlung und Auftragsorganisation übernimmt.',
          'Wann aus Anfrage, Kontaktwunsch, Angebot, Buchung oder Tarifwahl ein verbindlicher Vertrag entsteht.',
          'Welche Leistungen kostenlos sind, welche Preise oder Abonnements gelten und wie Zahlungen abgewickelt werden.',
          'Wie Änderungen, Laufzeiten, Kündigungen, Stornierungen und Rückerstattungen funktionieren.',
          'Welche gesetzlichen Verbraucherinformationen einschließlich Widerrufsrechten im jeweiligen Fall erforderlich sind.',
          'Wie Haftung, Gewährleistung und Verantwortungsabgrenzung zwischen Plattform und ausführendem Partner rechtlich ausgestaltet sind.',
        ]} />
      </Section>

      <Section eyebrow="Partnerverhältnis" title="Partnerbedingungen müssen zum realen Betriebsmodell passen." tone="soft">
        <BulletList items={[
          'Voraussetzungen für Verifizierung, Vertrag und aktiven Zugang zum Partnernetzwerk.',
          'Leistungskategorien, Einsatzgebiet, Kapazität und Pflichten bei Annahme oder Bearbeitung von Anfragen.',
          'Tarif-, Zahlungs-, Kündigungs- und Sperrregeln einschließlich einer klaren Trennung von Tarif und Matching-Qualität.',
          'Verantwortung für Angebote, Termine, Leistungsausführung, Rechnungen, Steuern, Versicherungen und erforderliche Zulassungen.',
          'Umgang mit Beschwerden, Qualitätsfällen, Dokumentation und Beendigung der Partnerschaft.',
        ]} />
        <InfoPanel label="Operative Verifizierung separat prüfen">
          <p>
            Die öffentliche Beschreibung eines Prüfstandards ist keine Zertifizierung und kein Nachweis, dass ein bestimmter Betrieb jeden Punkt bereits erfolgreich durchlaufen hat. Der operative Partnerstatus muss aus den tatsächlichen Verifizierungs- und Vertragsdaten stammen.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Garantie & Qualität" title="Keine Garantie ohne genehmigte Bedingungen.">
        <InfoPanel label="Derzeit kein veröffentlichter Garantieanspruch">
          <p>
            Einfach Hausen veröffentlicht auf dieser Seite weder einen Geldbetrag noch eine Laufzeit oder einen Leistungsumfang für eine Garantie. Eine solche Zusage darf erst erscheinen, wenn Umfang, Dauer, Ausschlüsse, Anspruchsprozess und Streitbehandlung geschäftlich sowie rechtlich freigegeben und operativ umsetzbar sind.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Streitbeilegung" title="Teilnahmeinformation wird operatorbezogen ergänzt." tone="soft">
        <p>
          Die Information nach dem Verbraucherstreitbeilegungsrecht hängt von Betreiber, Mitarbeiterzahl, Verpflichtungen und einer möglichen freiwilligen Teilnahme ab. Deshalb wird hier noch keine Bereitschaft, Verpflichtung oder konkrete Schlichtungsstelle behauptet.
        </p>
      </Section>

      <Section eyebrow="Rechtliche Navigation" title="Die zugehörigen Informationen sind getrennt erreichbar.">
        <div className={styles.heroActions}>
          <LinkButton href="/impressum">Impressum</LinkButton>
          <LinkButton href="/datenschutz" secondary>Datenschutz</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
