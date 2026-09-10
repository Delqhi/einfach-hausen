import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { EHAppHeader, EHPanel, EHText, EHTextLink, EHWorkflowStack } from '@/design-system';

const sections = [
  {
    title: 'Auftr\u00e4ge & Angebote',
    text: 'Hier l\u00e4uft dein Tagesgesch\u00e4ft: Anfragen pr\u00fcfen, Angebote schreiben und gebuchte Auftr\u00e4ge bis zur Fertigstellung begleiten. Jeder Vorgang zeigt dir den aktuellen Stand und den n\u00e4chsten sinnvollen Schritt.',
    links: [
      { href: '/pro/orders', label: 'Zu Auftr\u00e4ge & Kontakte' },
      { href: '/pro/jobs', label: 'Zu den Auftragsdetails' },
    ],
  },
  {
    title: 'Termine & Kalender',
    text: 'Alle best\u00e4tigten Kundentermine deines Betriebs in einer ruhigen Liste. Du siehst Auftrag, Kunde und Ansprechpartner auf einen Blick und springst direkt zum passenden Vorgang.',
    links: [{ href: '/pro/calendar', label: 'Zum Kalender' }],
  },
  {
    title: 'Nachrichten',
    text: 'Der direkte Draht zu deinen Kunden: Fragen kl\u00e4ren, Details abstimmen und Absprachen festhalten. Alles bleibt am jeweiligen Auftrag h\u00e4ngen, damit nichts verloren geht.',
    links: [{ href: '/pro/messages', label: 'Zu den Nachrichten' }],
  },
  {
    title: 'Team verwalten',
    text: 'Jeder Ansprechpartner bekommt einen eigenen Zugang mit klarer Zust\u00e4ndigkeit. Du legst fest, wer Auftr\u00e4ge verwalten darf und wer zugewiesene Arbeit betreut.',
    links: [{ href: '/pro/team', label: 'Zum Team' }],
  },
  {
    title: 'Rechnungen',
    text: 'Abgeschlossene Arbeit sauber abrechnen: Rechnungen erstellen, \u00fcberblicken und den Zahlungsstand verfolgen. So bleibt der Geldfluss deines Betriebs nachvollziehbar.',
    links: [{ href: '/pro/orders', label: 'Zu Rechnungen in den Aufträgen' }],
  },
  {
    title: 'F\u00e4higkeiten & Profil',
    text: 'Dein Aush\u00e4ngeschild beim Kunden: Leistungen, Arbeitsgebiet und Angaben zum Betrieb pflegen. Ein vollst\u00e4ndiges Profil hilft, passende Anfragen zu erhalten.',
    links: [{ href: '/pro/profile', label: 'Zum Profil' }],
  },
  {
    title: 'Mitgliedschaft',
    text: 'Planbar statt Provision: 100 % des Auftragswerts bleiben beim Betrieb. Hier w\u00e4hlst du den passenden Monatstarif \u2013 ein Tarif kauft niemals eine bessere Platzierung.',
    links: [{ href: '/pro/plans', label: 'Zu den Tarifen' }],
  },
  {
    title: 'Leads & Eingehende Anfragen',
    text: 'Neue Kundenkontakte landen hier: Anfragen prüfen, annehmen oder ablehnen und den Status pflegen. Nur freigegebene Kontakte werden mit allen Details angezeigt.',
    links: [{ href: '/pro/leads', label: 'Zu den Leads' }],
  },
  {
    title: 'Offene Anfragen',
    text: 'Alle passenden offenen Anfragen aus deinem Gebiet in einer Liste. Filtern nach Dringlichkeit und direkt zum Vorgang springen.',
    links: [{ href: '/anfragen-pro', label: 'Zu den offenen Anfragen' }],
  },
  {
    title: 'Onboarding',
    text: 'Neu dabei? In vier Schritten richtest du deinen Betrieb ein: Firmendaten, Leistungen, Arbeitsgebiet und abschlie\u00dfende Angaben. Jeder Schritt wird beim Weitergehen gespeichert.',
    links: [{ href: '/pro/onboarding', label: 'Zur Einrichtung' }],
  },
];

export default async function ProHilfe() {
  await requireUser('provider');
  return (
    <AppShell role="provider" active="/pro/hilfe" title="Hilfe" subtitle="Anleitungen für den Partnerbereich">
      <EHWorkflowStack>
        <EHAppHeader
          eyebrow="Hilfe"
          title="Dein Betrieb. Einfach geregelt."
          text="Kurze Wege zu allen wichtigen Bereichen der Partner-App. Wähle ein Thema, lies in zwei Sätzen, worum es geht, und springe direkt dorthin."
        />
        {sections.map((section) => (
          <EHPanel key={section.title} title={section.title}>
            <EHText>{section.text}</EHText>
            {section.links.map((link) => (
              <p key={link.href}>
                <EHTextLink href={link.href}>{link.label}</EHTextLink>
              </p>
            ))}
          </EHPanel>
        ))}
      </EHWorkflowStack>
    </AppShell>
  );
}
