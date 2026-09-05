import {
  Bug, Droplets, Hammer, Home, Leaf, Paintbrush, Plug, Shield,
  Snowflake, Sparkles, ThermometerSun, Trees, type LucideIcon,
} from 'lucide-react';

export type ServiceCategory = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  situations: readonly string[];
  steps: ReadonlyArray<{ title: string; text: string }>;
  limits: readonly string[];
  faq: ReadonlyArray<{ q: string; a: string }>;
  related: ReadonlyArray<{ label: string; href: string }>;
  seo: { title: string; description: string };
  cta: string;
};

type ServiceInput = Omit<ServiceCategory, 'steps' | 'limits' | 'faq' | 'seo' | 'cta' | 'related'> & {
  related?: ServiceCategory['related'];
};

function service(input: ServiceInput): ServiceCategory {
  return {
    ...input,
    steps: [
      { title: 'Anliegen beschreiben', text: 'Schreib in eigenen Worten, was du bemerkst oder vorhast. Fotos, Maße oder Unterlagen kannst du ergänzen, wenn sie helfen.' },
      { title: 'Passenden nächsten Schritt einordnen', text: 'Einfach Hausen sortiert Gewerk, Dringlichkeit und nötige Informationen und sucht im aktiven regionalen Partnernetz nach einer passenden Option.' },
      { title: 'Du entscheidest', text: 'Kontakt, Kostenrahmen oder Angebot werden transparent. Ein Auftrag entsteht erst, wenn du ihn ausdrücklich bestätigst.' },
    ],
    limits: [
      'Verfügbarkeit hängt vom aktiven Partnernetz in deiner Region und der aktuellen Kapazität ab.',
      'Kostenangaben sind Orientierung; verbindlich wird es erst mit dem Angebot des ausführenden Betriebs.',
      'Qualifikations- oder zulassungspflichtige Arbeiten werden nur an dafür passende Partner vermittelt.',
    ],
    faq: [
      { q: 'Muss ich das richtige Gewerk kennen?', a: 'Nein. Genau dafür ist die Einordnung da. Beschreib das Problem oder Ziel so, wie du es wahrnimmst.' },
      { q: 'Entsteht sofort ein Auftrag?', a: 'Nein. Anfrage, Beratung und Auftrag sind getrennt. Du bestätigst selbst, ob und wann daraus eine Beauftragung wird.' },
      { q: 'Arbeitet Einfach Hausen selbst vor Ort?', a: 'Nein. Die Ausführung erfolgt durch eigenständige, geprüfte Partnerbetriebe aus dem regionalen Netzwerk.' },
    ],
    related: input.related ?? [],
    seo: {
      title: `${input.title} für dein Eigenheim`,
      description: `${input.title}: Anliegen einfach beschreiben, passenden regionalen Partner finden und den Vorgang in deiner Hausakte behalten.`,
    },
    cta: `${input.shortTitle}: Anliegen beschreiben`,
  };
}
export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  service({ slug: 'haus-technik', title: 'Haus & Technik', shortTitle: 'Haus & Technik', description: 'Kleinere Reparaturen, Montage und technische Anliegen', icon: Home, situations: ['Eine Tür klemmt oder ein Bauteil muss montiert werden.', 'Im Haus gibt es ein technisches Problem, das keinem Gewerk eindeutig zuzuordnen ist.', 'Kleinere Reparaturen sollen gesammelt und sinnvoll koordiniert werden.'] }),
  service({ slug: 'elektro-smart-home', title: 'Elektro & Smart Home', shortTitle: 'Elektro & Smart Home', description: 'Elektroarbeiten, Wallbox, Sicherheit und Gebäudeautomation', icon: Plug, situations: ['Eine Steckdose, Leuchte oder Sicherung macht Probleme.', 'Wallbox, Lastmanagement oder Smart-Home-Komponenten sollen eingeordnet werden.', 'Elektrische Sicherheit oder Modernisierung im Bestand steht an.'] }),
  service({ slug: 'heizung', title: 'Heizung, Klima & Energie', shortTitle: 'Heizung & Energie', description: 'Heizung, Wärmepumpe, Klima, Energieberatung und Wartung', icon: ThermometerSun, situations: ['Die Heizung macht Geräusche, Räume bleiben kalt oder eine Störung wird angezeigt.', 'Eine Wartung oder Optimierung der bestehenden Anlage steht an.', 'Wärmepumpe, Heizungstausch oder energetische Verbesserung soll vorbereitet werden.'], related: [{ label: 'Heizungswartung: Ablauf und Kosten', href: '/blog/heizung-wartung-kosten' }, { label: 'Hydraulischer Abgleich', href: '/lexikon/hydraulischer-abgleich' }, { label: 'Heizungsgesetz (GEG)', href: '/lexikon/heizungsgesetz' }] }),
  service({ slug: 'sanitaer-wasser', title: 'Sanitär & Wasser', shortTitle: 'Sanitär & Wasser', description: 'Sanitärarbeiten, Leitungen, Armaturen und wasserbezogene Probleme', icon: Droplets, situations: ['Armatur, Spülung oder Ablauf funktioniert nicht richtig.', 'Feuchtigkeit oder eine undichte Leitung muss eingeordnet werden.', 'Bad oder Sanitärbereich soll modernisiert werden.'], related: [{ label: 'Bad-Sanierung: Ablauf und Entscheidungen', href: '/blog/bad-sanierung-ablauf' }] }),
  service({ slug: 'dach-fenster-tueren', title: 'Dach, Fenster & Türen', shortTitle: 'Dach & Gebäudehülle', description: 'Dach, Dachrinne, Fenster, Türen, Schlosser und Gebäudehülle', icon: Hammer, situations: ['Nach Sturm oder Wetter sind Dach oder Dachrinne auffällig.', 'Fenster oder Türen schließen nicht sauber oder sollen ersetzt werden.', 'An der Gebäudehülle ist eine Reparatur oder Prüfung nötig.'] }),
  service({ slug: 'innenausbau-sanierung', title: 'Innenausbau & Sanierung', shortTitle: 'Innenausbau', description: 'Maler, Schreiner, Boden, Renovierung und Sanierungsarbeiten', icon: Paintbrush, situations: ['Räume sollen renoviert, gestrichen oder neu aufgebaut werden.', 'Boden, Trockenbau oder Schreinerarbeiten stehen an.', 'Eine Sanierung braucht mehrere Gewerke und eine sinnvolle Reihenfolge.'] }),
  service({ slug: 'garten-aussenbereich', title: 'Garten & Außenbereich', shortTitle: 'Garten & Außen', description: 'Gartenpflege, Heckenschnitt, Baumarbeiten und Pflasterarbeiten', icon: Trees, situations: ['Hecke, Baum oder größere Gartenpflege steht an.', 'Wege, Terrasse oder Außenflächen sollen repariert oder erneuert werden.', 'Ein wiederkehrender Pflegebedarf soll verlässlich organisiert werden.'] }),
  service({ slug: 'reinigung-pflege', title: 'Reinigung & Pflege', shortTitle: 'Reinigung & Pflege', description: 'Hausreinigung, PV-Reinigung, Dachrinne und laufende Pflege', icon: Leaf, situations: ['PV-Module, Dachrinne oder schwer erreichbare Außenflächen sollen gereinigt werden.', 'Regelmäßige Haus- oder Objektpflege wird gesucht.', 'Nach Arbeiten oder besonderen Ereignissen ist eine gründliche Reinigung nötig.'] }),
  service({ slug: 'saisonale-dienste', title: 'Saisonale Dienste', shortTitle: 'Saisonale Dienste', description: 'Winterdienst und wiederkehrende Aufgaben rund ums Grundstück', icon: Snowflake, situations: ['Winterdienst oder saisonale Außenpflege soll geplant werden.', 'Wiederkehrende Aufgaben sollen nicht jedes Jahr neu gesucht werden.', 'Ein saisonaler Termin soll in der Hausakte nachvollziehbar bleiben.'] }),
  service({ slug: 'spezialfaelle', title: 'Spezialfälle', shortTitle: 'Spezialfälle', description: 'Schädlingsbekämpfung und weitere qualifikationsabhängige Dienste', icon: Bug, situations: ['Ein Problem passt nicht sauber in ein klassisches Gewerk.', 'Schädlinge oder ein anderer qualifikationsabhängiger Spezialfall müssen eingeordnet werden.', 'Vor einer Beauftragung ist wichtig zu klären, welche Fachkunde wirklich benötigt wird.'] }),
  service({ slug: 'umzug-entruempelung', title: 'Umzug & Entrümpelung', shortTitle: 'Umzug & Räumen', description: 'Unterstützung beim Räumen, Umzug und objektbezogenen Dienstleistungen', icon: Sparkles, situations: ['Keller, Dachboden oder ganze Bereiche sollen geräumt werden.', 'Ein Umzug braucht praktische Unterstützung rund um das Objekt.', 'Vor Verkauf, Sanierung oder Übergabe muss Platz geschaffen werden.'] }),
  service({ slug: 'beratung-notfall', title: 'Beratung & dringende Fälle', shortTitle: 'Beratung & Notfall', description: 'Passende Ansprechpartner für fachliche Fragen oder dringenden Unterstützungsbedarf', icon: Shield, situations: ['Du brauchst zuerst nur eine fachliche Einschätzung und noch keinen Auftrag.', 'Ein dringender Fall soll priorisiert und an verfügbare Hilfe in der Region gegeben werden.', 'Du bist unsicher, ob sofort gehandelt werden muss oder eine normale Planung reicht.'], related: [{ label: 'Beratung ohne Buchungszwang', href: '/beratung' }, { label: 'Dringende Hilfe und Notfall-Bereitschaft', href: '/notfall' }] }),
] as const;

export const SERVICE_PATHS = SERVICE_CATEGORIES.map((service) => `/leistungen/${service.slug}`);

export function getServiceCategory(slug: string) {
  return SERVICE_CATEGORIES.find((service) => service.slug === slug);
}
