import type { Metadata } from 'next';
import { BrainCircuit, HeartHandshake, Home, MapPinned, UserRound } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, FeatureGrid, LinkButton, Numbered, PageHero, Section, Statement } from '@/components/marketing/ui';

export const metadata: Metadata = { title: 'Über uns', description: 'Mission und Arbeitsweise hinter Einfach Hausen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Über uns" title="Einfach Hausen soll die digitale Eingangstür für das Eigenheim werden." text="Nicht noch ein Firmenverzeichnis, nicht noch ein kompliziertes Verwaltungsprogramm: eine ruhige Anlaufstelle, die Probleme versteht, passende Menschen verbindet und Hauswissen langfristig erhält." actions={<LinkButton href="/register?role=homeowner">Kostenlos starten</LinkButton>} />
  <Section eyebrow="Unsere Produktidee" title="Der Nutzen steht vor der Technologie." text="Die Technik darf im Hintergrund viel organisieren. Vorn soll vor allem klar sein, was für den Eigentümer als Nächstes sinnvoll ist.">
    <FeatureGrid items={[{icon:<Home size={20}/>,title:'Eine Eingangstür',text:'Menschen starten mit ihrem Problem statt mit einer langen Kategorien- oder Formularstrecke.'},{icon:<UserRound size={20}/>,title:'Ein echter Mensch auf Wunsch',text:'Persönlicher Kontakt ist ein eigener Weg und muss nicht erst durch eine Buchung verdient werden.'},{icon:<HeartHandshake size={20}/>,title:'Beziehungen statt Wegwerf-Leads',text:'Ein guter Ansprechpartner kann beim Haus gespeichert bleiben und bei späteren Themen wieder genutzt werden.'}]}/>
  </Section>
  <Section eyebrow="Technologie im Hintergrund" title="KI organisiert. Menschen entscheiden und führen aus." text="Die Assistenzschicht kann einordnen, vorbereiten, erinnern und vergleichen. Auftragserteilung und Freigaben bleiben bewusste Entscheidungen; die Ausführung übernimmt ein eigenständiger Partnerbetrieb." tone="green">
    <FeatureGrid items={[{icon:<BrainCircuit size={20}/>,title:'Assistenz statt Show',text:'KI ist Werkzeug für Einordnung und Organisation, nicht das eigentliche Marketingversprechen.'},{icon:<MapPinned size={20}/>,title:'Region für Region',text:'Die Geschäftsstrategie setzt auf ein dichtes, hochwertiges Netzwerk in einer Region, bevor weiter skaliert wird.'},{icon:<Home size={20}/>,title:'Die Immobilie als Gedächtnis',text:'Der langfristige Wert entsteht auch durch Hausdaten, Wartungshistorie, Dokumente und Ansprechpartner.'}]}/>
  </Section>
  <Statement kicker="Unser Versprechen" tone="green">Ein Ansprechpartner für alles rund ums Eigenheim.</Statement>
  <Section eyebrow="Woran wir uns messen" title="Vier Prinzipien entscheiden, ob etwas in Einfach Hausen gehört.">
    <Numbered items={[
      { title: 'Nutzen vor Technologie', text: 'Jede Funktion beginnt mit einem konkreten Eigentümer-Nutzen. KI ist Werkzeug im Hintergrund, kein Marketing-Versprechen.' },
      { title: 'Entscheidung bleibt beim Menschen', text: 'Einordnen, vorbereiten, erinnern – ja. Aber Auftragserteilung und Freigaben sind bewusste Entscheidungen des Eigentümers.' },
      { title: 'Region vor Skalierung', text: 'Ein dichtes, hochwertiges Partnernetzwerk in einer Region entsteht, bevor die nächste startet. Qualität ist nicht skalierbar auf Knopfdruck.' },
      { title: 'Hauswissen bleibt erhalten', text: 'Die Immobilie ist der langlebige Datensatz. Technik, Historie, Dokumente und Ansprechpartner gehören dauerhaft zusammen.' },
    ]} />
  </Section>
  <CtaBand title="Ein Ansprechpartner für alles rund ums Eigenheim." text="Das ist das Produktversprechen, an dem jede Funktion gemessen wird." />
</MarketingShell>}
