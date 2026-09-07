import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Numbered } from '@/components/marketing/ui';
import { EHScope, EHSection, EHPageHero, EHFacts, EHFAQ, EHClosing, EHButton, EHEyebrow, EHHeading, EHText, EHProse } from '@/design-system';

export const metadata: Metadata = {
  title: 'Pilotphase',
  description: 'Die ersten 1.000 Haushalte sichern sich 15 % Dauer-Vorteil auf alle Pakete von Einfach Hausen. Kostenlos starten, Vorteil automatisch.', alternates: { canonical: canonical('/pilotphase') },
};

export default function PilotphasePage() {
  return (
    <MarketingShell>
      <EHScope>
      <EHPageHero
        eyebrow="Pilotphase"
        title="Die ersten 1.000 Haushalte bauen Einfach Hausen mit uns auf."
        text="Wir starten regional und mit einer begrenzten Zahl an Haushalten. Als Dank für dein Vertrauen bekommst du als früher Nutzer 15 % Dauer-Vorteil auf alle bezahlten Pakete. Dauerhaft, nicht nur im ersten Jahr."
        actions={<><EHButton href="/register?role=homeowner" arrow>Platz sichern, kostenlos</EHButton><EHButton href="/preise" variant="secondary">Preise ansehen</EHButton></>}
        media={<><Image src="/images/marketing/family-home.jpg" alt="Familie vor ihrem Haus" width={1024} height={1024} sizes="(min-width: 900px) 420px, 100vw" priority /><span><Check size={18} aria-hidden="true" /> 15 % Dauer-Vorteil für Pilot-Haushalte</span></>}
      />

      <EHSection compact>
          <EHProse>
            <p><strong>Was das bedeutet.</strong> Einmal Pilot sein, <mark>dauerhaft weniger zahlen.</mark></p>
          </EHProse>
        </EHSection>

      <EHSection compact>
        <EHEyebrow>So sicherst du dir den Vorteil</EHEyebrow>
        <EHHeading>Drei Schritte, kein Kleingedrucktes.</EHHeading>
        <Numbered items={[
          { title: 'Hauskonto anlegen', text: 'Kostenlos, in zwei Minuten. Die ersten 1.000 Haushalte bekommen den Pilot-Status automatisch im Konto.' },
          { title: 'Normal nutzen', text: 'Anliegen beschreiben, Hausakte aufbauen, Erinnerungen bekommen. Und uns sagen, was gut läuft und was nicht.' },
          { title: '15 % dauerhaft', text: 'Sobald du irgendwann ein bezahltes Paket wählst, wird der Vorteil automatisch auf jede Rechnung angewendet. Solange dein Konto besteht.' },
        ]} />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Konditionen</EHEyebrow>
        <EHHeading>Transparent statt versteckt.</EHHeading>
        <EHFacts items={[
          { value: '1.000', label: 'Haushalte, dann schließt sich der Vorteil' },
          { value: '15 %', label: 'auf alle bezahlten Pakete, dauerhaft' },
          { value: '0 €', label: 'FREE bleibt immer kostenlos' },
          { value: '0', label: 'Fristen, Mindestlaufzeit, Kleingedrucktes' },
        ]} />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Warum eine Pilotphase</EHEyebrow>
        <EHHeading>Wir bauen das lieber mit dir als über dich.</EHHeading>
        <EHText size="lead">Ein Hausmanager muss zu echten Häusern passen, nicht zu Annahmen. Deshalb starten wir klein, regional und mit Menschen, die uns sagen, was fehlt.</EHText>
        <Numbered items={[
          { title: 'Direkter Draht zum Team', text: 'Pilot-Haushalte erreichen uns direkt. Dein Feedback landet nicht in einem Ticket, sondern in der nächsten Version.' },
          { title: 'Gleiche Standards für alle', text: 'Sicherheit, Partnerprüfung und Entscheidungsregeln sind für Piloten identisch. Du bekommst den Vorteil, keine Abstriche.' },
          { title: 'Regional zuerst', text: 'Wir bauen das Partnernetz Region für Region auf. Als Pilot siehst du zuerst, was bei dir schon möglich ist.' },
        ]} />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Häufige Fragen</EHEyebrow>
        <EHHeading>Zur Pilotphase.</EHHeading>
        <EHFAQ items={[
            { q: 'Muss ich ein bezahltes Paket nehmen?', a: 'Nein. Der Pilot-Status ist kostenlos und verpflichtet zu nichts. Der 15 %-Vorteil greift nur, falls du dich irgendwann für PLUS oder PREMIUM entscheidest.' },
            { q: 'Was, wenn die 1.000 voll sind?', a: 'Dann kannst du Einfach Hausen weiterhin kostenlos nutzen, nur ohne den Dauer-Vorteil. Wir zeigen im Konto an, ob du Pilot bist.' },
            { q: 'Gilt der Vorteil auch nach der Pilotphase?', a: 'Ja. Dauerhaft heißt dauerhaft, solange dein Konto besteht.' },
          ]} />
      </EHSection>

      <EHClosing title="Sichere dir deinen Pilot-Vorteil." text="Kostenlos registrieren, Hauskonto anlegen, 15 % Dauer-Vorteil automatisch erhalten." href="/register?role=homeowner" label="Platz sichern, kostenlos" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
      </EHScope>
    </MarketingShell>
  );
}
