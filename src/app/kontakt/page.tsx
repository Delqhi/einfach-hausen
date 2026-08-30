import type { Metadata } from 'next';
import { Building2, CircleAlert, HelpCircle, LogIn, MessageCircle, ShieldCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, FeatureGrid, InfoPanel, LegalNotice, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import { HeroContact } from '@/components/marketing/hero-visuals';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontakt- und Supportwege für Eigentümer, Partner und rechtliche Anliegen bei Einfach Hausen.',
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Kontakt"
        title="Der richtige Kontaktweg hängt von deinem Anliegen ab."
        text="Hausanliegen, bestehende Vorgänge und Partnerfragen bleiben dort, wo ihr Kontext bereits vorhanden ist. Öffentliche Betreiber- und Rechtskontaktdaten werden erst nach dokumentierter Freigabe veröffentlicht."
        aside={<HeroContact />}
      />

      <Section eyebrow="Eigentümer" title="Hausanliegen direkt im passenden Kontext starten.">
        <FeatureGrid items={[
          { icon: <MessageCircle size={20} />, title: 'Neues Hausanliegen', text: 'Konto anlegen, Anliegen beschreiben und anschließend bewusst entscheiden, ob nur eine Antwort, ein Ansprechpartner oder ein Auftrag gewünscht ist.' },
          { icon: <LogIn size={20} />, title: 'Bestehender Vorgang', text: 'Einloggen und beim vorhandenen Auftrag, Termin, Dokument oder Ansprechpartner weitermachen.' },
          { icon: <HelpCircle size={20} />, title: 'Allgemeine Fragen', text: 'Die Hilfe erklärt Ablauf, Hausakte, Preise und das Partnernetzwerk ohne einen Auftrag auszulösen.' },
        ]} />
        <div className={styles.heroActions}>
          <LinkButton href="/register?role=homeowner">Anliegen starten</LinkButton>
          <LinkButton href="/login" secondary>Einloggen</LinkButton>
          <LinkButton href="/hilfe" secondary>Hilfe öffnen</LinkButton>
        </div>
      </Section>

      <Section eyebrow="Betriebe & Partner" title="Partnerfragen über den Partnerbereich einordnen." tone="soft">
        <FeatureGrid items={[
          { icon: <Building2 size={20} />, title: 'Partner werden', text: 'Informationen zu Partnernetzwerk, Arbeitsweise und Einstieg stehen im öffentlichen Partnerbereich.' },
          { icon: <LogIn size={20} />, title: 'Bestehender Partnerzugang', text: 'Aktive Betriebe und Teammitglieder bearbeiten Profil, Anfragen und Aufträge im Partnerkonto.' },
        ]} />
        <div className={styles.heroActions}>
          <LinkButton href="/partner">Partnerbereich</LinkButton>
          <LinkButton href="/login" secondary>Partner-Login</LinkButton>
        </div>
      </Section>

      <Section eyebrow="Datenschutz & Sicherheit" title="Sensible Anliegen brauchen einen verifizierten Betreiberkontakt.">
        <InfoPanel label="Noch kein erfundener Rechtskontakt">
          <p>
            Für Datenschutzanfragen, rechtliche Mitteilungen, Beschwerden oder Sicherheitsmeldungen wird keine private, ungeprüfte oder provisorische Adresse als offizieller Unternehmenskanal ausgegeben. Der freigegebene Betreiberkontakt wird nach Verifizierung zugleich im Impressum und in der finalen Datenschutzerklärung veröffentlicht.
          </p>
        </InfoPanel>
        <div className={styles.heroActions}>
          <LinkButton href="/datenschutz">Datenschutz</LinkButton>
          <LinkButton href="/sicherheit" secondary>Sicherheit</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
        </div>
      </Section>

      <Section eyebrow="Öffentliche Kontaktdaten" title="Veröffentlichung erst nach Betreiberfreigabe." tone="soft">
        <LegalNotice title="Launch-Blocker: offizielle Anschrift und elektronische Kontaktangaben fehlen">
          <p>
            Im Repository sind derzeit keine verifizierte veröffentlichungsfähige Geschäftsanschrift und keine offizielle öffentliche E-Mail-Adresse des Plattformbetreibers dokumentiert. Eine Telefonnummer wird ebenfalls nur genannt, wenn sie ausdrücklich als offizieller Kanal freigegeben ist.
          </p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Akute Gefahr" title="Einfach Hausen ersetzt keinen öffentlichen Notruf.">
        <FeatureGrid items={[
          { icon: <CircleAlert size={20} />, title: 'Unmittelbare Gefahr', text: 'Bei akuter Gefahr für Menschen, Feuer, Gas, Einbruch oder vergleichbaren Notfällen die jeweils zuständigen öffentlichen Notruf- und Gefahrenabwehrstellen nutzen.' },
          { icon: <ShieldCheck size={20} />, title: 'Dringende Hausprobleme', text: 'Für dringende, aber nicht lebensbedrohliche Hausprobleme kann der Notfallbereich im angemeldeten Eigentümerkonto genutzt werden.' },
        ]} />
      </Section>

      <CtaBand title="Beschreib einfach, was bei deinem Haus ansteht." text="Dein Hauskonto ist kostenlos – und ein Anliegen löst niemals automatisch einen Auftrag aus." />
    </MarketingShell>
  );
}
