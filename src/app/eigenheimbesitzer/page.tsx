import type { Metadata } from 'next';
import { FileText, Home, MessageCircle, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, FeatureGrid, InfoPanel, LinkButton, PageHero, Section, Split, Statement } from '@/components/marketing/ui';
import { HeroChoices } from '@/components/marketing/hero-visuals';

export const metadata: Metadata = { title: 'Für Eigenheimbesitzer', description: 'Eine zentrale Anlaufstelle für Fragen, Aufträge, Ansprechpartner und Hauswissen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Für Eigenheimbesitzer" title="Dein Haus hat viele Themen. Du brauchst trotzdem nur eine Eingangstür." text="Von der ersten Frage bis zur Rechnung: Einfach Hausen hält den Vorgang verständlich zusammen und bewahrt das Wissen danach in deiner Hausakte." aside={<HeroChoices />} actions={<LinkButton href="/register?role=homeowner">Kostenlos starten</LinkButton>} />
  <Section eyebrow="Der Nutzen" title="Weniger Organisationsarbeit rund ums Eigenheim." text="Du musst nicht jedes Mal recherchieren, neu erklären und Informationen zusammensuchen.">
    <FeatureGrid items={[{icon:<MessageCircle size={20}/>,title:'Normal beschreiben',text:'Du musst weder Gewerk noch Fachbegriff kennen. Beschreibe einfach, was du siehst oder brauchst.'},{icon:<UserRound size={20}/>,title:'Menschen behalten',text:'Ein verbundener Ansprechpartner bleibt beim Haus gespeichert und kann später wieder direkt angesprochen werden.'},{icon:<FileText size={20}/>,title:'Hauswissen sichern',text:'Historie, Anlagen, Dokumente, Termine und Wartungshinweise wachsen an einem Ort zusammen.'}]}/>
  </Section>
  <Section eyebrow="Ein Thema, drei Entscheidungen" title="Erst verstehen. Dann bewusst entscheiden." tone="soft" text="Die Plattform soll dir helfen, ohne aus jeder Frage sofort einen Auftrag zu machen.">
    <Split><InfoPanel label="Wenn du nur Rat brauchst"><h3>Frage klären oder Ansprechpartner finden.</h3><p>Du kannst eine fachliche Einschätzung vorbereiten lassen und auf Wunsch einen passenden Menschen sprechen. Ein Auftrag entsteht dadurch nicht automatisch.</p><BulletList items={['Kein Auftrag durch eine normale Frage','Persönlicher Kontakt kann vor einer Buchung entstehen','Spätere Beauftragung bleibt eine eigene Entscheidung']} /></InfoPanel><InfoPanel label="Wenn etwas erledigt werden soll"><h3>Auftrag organisiert statt selbst koordiniert.</h3><p>Dann werden die nötigen Auftragsdaten vervollständigt, passende aktive Partner gesucht und Angebote oder Termine nachvollziehbar zusammengeführt.</p><BulletList items={['Passende Partner statt offene Firmenliste','Angebote übersichtlich vergleichen','Konkreter Ansprechpartner beim ausführenden Betrieb']} /></InfoPanel></Split>
  </Section>
  <Statement kicker="Der Kern" tone="soft">Dein Haus hat ein Gedächtnis. Du behältst die Kontrolle.</Statement>
  <Section eyebrow="Langfristig" title="Mein Haus ist mehr als ein Auftragsarchiv." text="Die Immobilie ist der langlebige Datensatz. Dadurch entsteht über Jahre ein nutzbares Gedächtnis rund um Technik, Arbeiten und Kontakte." tone="green">
    <FeatureGrid items={[{icon:<Home size={20}/>,title:'Technik & Ausstattung',text:'Heizung, PV, Speicher, Wallbox, Dach, Fenster, Garten und weitere Anlagen können strukturiert am Haus geführt werden.'},{icon:<Wrench size={20}/>,title:'Arbeiten & Wartung',text:'Erledigte Arbeiten, Kosten, Hinweise, Garantien und zukünftige Aufgaben lassen sich in einer Historie zusammenhalten.'},{icon:<UserRound size={20}/>,title:'Beziehungen',text:'Bevorzugte Dienstleister und konkrete Ansprechpartner bleiben als Teil des Hauswissens erhalten.'}]}/>
  </Section>
  <CtaBand title="Dein Hauskonto startet bei 0 € im Monat." text="Beschreibe dein erstes Anliegen oder beginne damit, die digitale Hausakte aufzubauen." />
</MarketingShell>}
