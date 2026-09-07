import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { BrainCircuit, HeartHandshake, Home } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { HeroEditorialPhoto } from '@/components/marketing/hero-visuals';
import { EHScope, EHSection, EHPageHero, EHTimeline, EHFeatureRows, EHProse, EHClosing, EHButton, EHEyebrow, EHHeading, EHText } from '@/design-system';

export const metadata: Metadata = { 
  title: 'Über uns', 
  description: 'Mission und Arbeitsweise hinter Einfach Hausen: Eine ruhige Eingangstür für Eigentümer und Partner.', 
  alternates: { canonical: canonical('/ueber-uns') } 
};

export default function Page() {
  const principles = [
    { num: '01', title: 'Nutzen vor Technologie', text: 'Jede Funktion beginnt mit einem konkreten Nutzen für das Haus. KI ist ein leises Werkzeug im Hintergrund, kein lautes Werbeversprechen.' },
    { num: '02', title: 'Entscheidung bleibt beim Menschen', text: 'Einordnen, vorbereiten, prüfen: ja. Aber Beauftragung, Freigabe und Vereinbarungen sind immer bewusste Entscheidungen zwischen Eigentümer und Handwerker.' },
    { num: '03', title: 'Region vor Skalierung', text: 'Wir wachsen mit verifizierten Partnerbetrieben vor Ort. Verlässliche Handwerksqualität und kurze Wege schlagen anonyme Vermittlungsplattformen.' },
    { num: '04', title: 'Hauswissen bleibt erhalten', text: 'Die Immobilie ist der langlebige Datensatz. Technik, Wartungshistorie, Rechnungen und bewährte Kontakte gehören dauerhaft an einen Ort.' },
  ];

  return (
    <MarketingShell>
      <EHScope>
      <EHPageHero
        eyebrow="Über uns"
        title="Die ruhige Eingangstür für dein Eigenheim."
        text="Nicht noch ein unübersichtliches Handwerkerverzeichnis, kein kompliziertes ERP: Eine verlässliche Anlaufstelle, die Anliegen versteht, lokale Meisterbetriebe verbindet und das Wissen deines Hauses bewahrt."
        actions={<EHButton href="/register?role=homeowner" arrow>Hauskonto anlegen</EHButton>}
        media={<HeroEditorialPhoto src="/images/premium/hero-homeowner.jpg" label="Einfach Hausen" detail="Verlässliche Organisation im Hintergrund. Handwerkskunst vor Ort." />}
      />

      <EHSection compact>
        <EHEyebrow>Leitbild</EHEyebrow>
        <EHHeading>Vier Grundsätze, an denen wir jede Zeile Code messen.</EHHeading>
        <EHTimeline items={principles.map((p) => ({ when: p.num, title: p.title, text: p.text }))} />
      </EHSection>

      <EHSection compact>
          <EHProse>
            <p><strong>Unser Versprechen.</strong> Ein Ansprechpartner für alles rund ums Eigenheim.</p>
          </EHProse>
        </EHSection>

      <EHSection compact>
        <EHEyebrow>Transparenz</EHEyebrow>
        <EHHeading>Echte Menschen, regionale Partner und 0 % Provision.</EHHeading>
        <EHText size="lead">Wir verdienen nicht an vermittelten Aufträgen, sondern an stabilen Service-Paketen für Haus und Betrieb.</EHText>
        <EHFeatureRows items={[
          { icon: <HeartHandshake size={20} />, title: 'Keine Lead-Auktionen', text: 'Partner kaufen keine Anfragen im Sekundentakt. Anfragen gehen gezielt an den passenden Betrieb in deiner Nachbarschaft.' },
          { icon: <BrainCircuit size={20} />, title: 'Assistenz statt Show', text: 'Der Hausmeister-Copilot hilft bei der Problembeschreibung und Terminkoordination, nimmt dir aber niemals eigenmächtig das Ruder aus der Hand.' },
          { icon: <Home size={20} />, title: 'Dauerhafter Werterhalt', text: 'Jede Rechnung, jede Wartung und jeder Kontakt fließt in die digitale Hausakte deines Eigenheims.' },
        ]} />
      </EHSection>

      <EHClosing title="Lerne Einfach Hausen für dein Zuhause kennen." text="Erstelle in zwei Minuten dein kostenloses Hauskonto und behalte den Kopf frei." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
    </EHScope>
    </MarketingShell>
  );
}
