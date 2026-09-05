import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { MotionPresentation } from '@/components/marketing/motion-presentation';
import { Reveal } from '@/components/marketing/motion';
import { CtaBand, Facts, Faq, LinkButton, Numbered, PageHero, Section, Statement, mkt as styles } from '@/components/marketing/ui';

export const metadata: Metadata = {
  title: 'Pilotphase',
  description: 'Die ersten 1.000 Haushalte sichern sich 15 % Dauer-Vorteil auf alle Pakete von Einfach Hausen. Kostenlos starten, Vorteil automatisch.', alternates: { canonical: canonical('/pilotphase') },
};

export default function PilotphasePage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pilotphase"
        terra
        title="Die ersten 1.000 Haushalte bauen Einfach Hausen mit uns auf."
        text="Wir starten regional und mit einer begrenzten Zahl an Haushalten. Als Dank für dein Vertrauen bekommst du als früher Nutzer 15 % Dauer-Vorteil auf alle bezahlten Pakete. Dauerhaft, nicht nur im ersten Jahr."
        actions={<><LinkButton href="/register?role=homeowner" variant="terra">Platz sichern, kostenlos</LinkButton><LinkButton href="/preise" secondary>Preise ansehen</LinkButton></>}
        aside={
          <Reveal className={styles.photo} data-ratio="4:5" data-mw="420">
            <Image src="/images/marketing/family-home.jpg" alt="Familie vor ihrem Haus" width={1024} height={1024} sizes="(min-width: 900px) 420px, 100vw" priority />
            <span className={styles.photoCaption}><Check size={18} aria-hidden="true" /> 15 % Dauer-Vorteil für Pilot-Haushalte</span>
          </Reveal>
        }
      />
      <MotionPresentation presentationId="pilotphase" title="Früh starten. Einfach Hausen mitprägen." />

      <Statement kicker="Was das bedeutet">Einmal Pilot sein, <mark>dauerhaft weniger zahlen.</mark></Statement>

      <Section tone="surface" eyebrow="So sicherst du dir den Vorteil" title="Drei Schritte, kein Kleingedrucktes.">
        <Numbered items={[
          { title: 'Hauskonto anlegen', text: 'Kostenlos, in zwei Minuten. Die ersten 1.000 Haushalte bekommen den Pilot-Status automatisch im Konto.' },
          { title: 'Normal nutzen', text: 'Anliegen beschreiben, Hausakte aufbauen, Erinnerungen bekommen. Und uns sagen, was gut läuft und was nicht.' },
          { title: '15 % dauerhaft', text: 'Sobald du irgendwann ein bezahltes Paket wählst, wird der Vorteil automatisch auf jede Rechnung angewendet. Solange dein Konto besteht.' },
        ]} />
      </Section>

      <Section tone="soft" eyebrow="Konditionen" title="Transparent statt versteckt." tight>
        <Facts items={[
          { value: '1.000', label: 'Haushalte, dann schließt sich der Vorteil' },
          { value: '15 %', label: 'auf alle bezahlten Pakete, dauerhaft' },
          { value: '0 €', label: 'FREE bleibt immer kostenlos' },
          { value: '0', label: 'Fristen, Mindestlaufzeit, Kleingedrucktes' },
        ]} />
      </Section>

      <Section eyebrow="Warum eine Pilotphase" title="Wir bauen das lieber mit dir als über dich." text="Ein Hausmanager muss zu echten Häusern passen, nicht zu Annahmen. Deshalb starten wir klein, regional und mit Menschen, die uns sagen, was fehlt.">
        <Numbered items={[
          { title: 'Direkter Draht zum Team', text: 'Pilot-Haushalte erreichen uns direkt. Dein Feedback landet nicht in einem Ticket, sondern in der nächsten Version.' },
          { title: 'Gleiche Standards für alle', text: 'Sicherheit, Partnerprüfung und Entscheidungsregeln sind für Piloten identisch. Du bekommst den Vorteil, keine Abstriche.' },
          { title: 'Regional zuerst', text: 'Wir bauen das Partnernetz Region für Region auf. Als Pilot siehst du zuerst, was bei dir schon möglich ist.' },
        ]} />
      </Section>

      <Section tone="soft" eyebrow="Häufige Fragen" title="Zur Pilotphase." center>
        <div className={styles.centerRow}>
          <Faq items={[
            { q: 'Muss ich ein bezahltes Paket nehmen?', a: 'Nein. Der Pilot-Status ist kostenlos und verpflichtet zu nichts. Der 15 %-Vorteil greift nur, falls du dich irgendwann für PLUS oder PREMIUM entscheidest.' },
            { q: 'Was, wenn die 1.000 voll sind?', a: 'Dann kannst du Einfach Hausen weiterhin kostenlos nutzen, nur ohne den Dauer-Vorteil. Wir zeigen im Konto an, ob du Pilot bist.' },
            { q: 'Gilt der Vorteil auch nach der Pilotphase?', a: 'Ja. Dauerhaft heißt dauerhaft, solange dein Konto besteht.' },
          ]} />
        </div>
      </Section>

      <CtaBand title="Sichere dir deinen Pilot-Vorteil." text="Kostenlos registrieren, Hauskonto anlegen, 15 % Dauer-Vorteil automatisch erhalten." label="Platz sichern, kostenlos" />
    </MarketingShell>
  );
}
