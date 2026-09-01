import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section, Numbered, Statement } from '@/components/marketing/ui';

export const metadata: Metadata = {
  title: 'Pilotphase - einfachhausen',
  description: 'Die ersten 1.000 Haushalte sichern sich 15% Dauer-Vorteil auf alle Pakete von Einfach Hausen.',
};

export default function PilotphasePage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pilotphase"
        title="Die ersten 1.000 Haushalte bauen Einfach Hausen mit uns auf."
        text="Wir starten in der Pilotphase mit einer begrenzten Zahl an Haushalten. Als Dank für dein Vertrauen bekommst du als früher Nutzer 15% Dauer-Vorteil auf alle Pakete - dauerhaft, nicht nur im ersten Jahr."
        actions={<LinkButton href="/register?role=homeowner">Platz sichern</LinkButton>}
      />
      <Statement kicker="Was das bedeutet" tone="soft">Einmal Pilot sein - dauerhaft weniger zahlen.</Statement>
      <Section eyebrow="Dein Vorteil" title="15% Dauer-Vorteil. Transparent gerechnet." text="Der Vorteil gilt auf alle bezahlten Pakete, solange dein Konto besteht. Keine Frist, kein Kleingedrucktes.">
        <Numbered items={[
          { title: 'Platz sichern', text: 'Registriere dein Hauskonto kostenlos in der Pilotphase. Die ersten 1.000 Haushalte bekommen den Status automatisch.' },
          { title: 'Pilot werden', text: 'Nutze die App normal und erzähl uns, was gut funktioniert und was wir besser machen können.' },
          { title: '15% dauerhaft', text: 'Sobald du ein bezahltes Paket wählst, gilt dein Dauer-Vorteil automatisch auf jede Rechnung.' },
        ]} />
      </Section>
      <Section eyebrow="Konditionen" title="Transparent statt versteckt." tone="soft">
        <Numbered items={[
          { title: 'Kostenlos bleibt kostenlos', text: 'Das FREE-Hauskonto bleibt 0 € - der 15%-Vorteil greift auf bezahlte Pakete.' },
          { title: 'Begrenzte Plätze', text: 'Die Pilotphase ist auf 1.000 Haushalte begrenzt. Danach schließt sich der Vorteil.' },
          { title: 'Basis bleibt gleich', text: 'Sicherheit, Prüfstandards und Entscheidungsregeln sind für alle identisch - Piloten bekommen den Vorteil, nicht Abstriche.' },
        ]} />
      </Section>
      <CtaBand title="Sichere dir deinen Piloten-Vorteil." text="Kostenlos registrieren, Hauskonto anlegen, 15% Dauer-Vorteil automatisch erhalten." />
    </MarketingShell>
  );
}
