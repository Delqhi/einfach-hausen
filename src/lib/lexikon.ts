/**
 * Lexikon-Wissensmodell — Single Source of Truth für /lexikon, /lexikon/[begriff]
 * und /lexikon/kategorie/[kategorie].
 *
 * Erweitert die SEO-Pilot-Einträge aus `seo-cluster.ts` (bleiben dort für Blog-
 * Querverweise und Sitemap-Kompatibilität) um ein Entscheidungs-Modell:
 * Kategorie, Relevanz, Orientierungsstufen (Kosten/Aufwand/Dringlichkeit),
 * Kennzahlen, Synonyme und Begriffs-Verknüpfungen.
 *
 * Tonregeln (DESIGN.md / PRODUCT_POSITIONING.md): sachlich, keine Superlative,
 * keine erfundenen Statistiken oder Belege. Kostenrahmen = Orientierung aus
 * Anfrageverläufen, kein Angebot. Stufen sind qualitative Einordnung, keine Preise.
 */
import { LEXIKON_TERMS, type LexikonTerm, type RelatedLink } from './seo-cluster';

export type LexikonKategorieSlug =
  | 'heizung-energie'
  | 'feuchte-schimmel'
  | 'dach-gebaeudehuelle'
  | 'elektro-sicherheit'
  | 'sanitaer-wasser'
  | 'recht-pflichten'
  | 'hausakte-organisation';

export type Relevanz = 'pflicht' | 'empfohlen' | 'wissen';
export type Stufe = 1 | 2 | 3 | 4;

export type LexikonKategorie = {
  slug: LexikonKategorieSlug;
  name: string;
  kurz: string;
  beschreibung: string;
  leistung: RelatedLink;
};

export type Kennzahl = { label: string; value: string; hint: string };

export type LexikonEintrag = LexikonTerm & {
  kategorie: LexikonKategorieSlug;
  kurz: string;
  relevanz: Relevanz;
  synonyme: string[];
  wannHandeln: string;
  stufen: { kosten: Stufe; aufwand: Stufe; dringlichkeit: Stufe };
  kennzahlen: Kennzahl[];
  verwandt: string[];
  leistung: RelatedLink;
};

export const RELEVANZ_LABEL: Record<Relevanz, { label: string; hint: string }> = {
  pflicht: { label: 'Pflicht / Vorschrift', hint: 'Gesetzliche oder behördliche Anforderung — Fristen und Zuständigkeit klären.' },
  empfohlen: { label: 'Empfohlen', hint: 'Keine Pflicht, aber in der Praxis der Unterschied zwischen kleinem und großem Schaden.' },
  wissen: { label: 'Grundwissen', hint: 'Hilft, Angebote zu verstehen und mit dem Fachbetrieb auf Augenhöhe zu sprechen.' },
};

export const STUFE_LABEL: Record<Stufe, string> = { 1: 'gering', 2: 'moderat', 3: 'erheblich', 4: 'hoch' };

export const LEXIKON_KATEGORIEN: LexikonKategorie[] = [
  {
    slug: 'heizung-energie',
    name: 'Heizung & Energie',
    kurz: 'Anlage, Effizienz, Gesetz',
    beschreibung: 'Was Wartung, Abgleich, Wärmepumpe und Heizungsgesetz für dein Haus konkret bedeuten — und wann sich welcher Schritt lohnt.',
    leistung: { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
  },
  {
    slug: 'feuchte-schimmel',
    name: 'Feuchte & Schimmel',
    kurz: 'Ursache vor Symptom',
    beschreibung: 'Taupunkt, Lüftung, Schimmelklassen: Begriffe, mit denen du Feuchteprobleme richtig einordnest, statt nur zu überstreichen.',
    leistung: { href: '/leistungen/innenausbau-sanierung', label: 'Sanierung als Leistung' },
  },
  {
    slug: 'dach-gebaeudehuelle',
    name: 'Dach & Gebäudehülle',
    kurz: 'Dicht, gedämmt, geprüft',
    beschreibung: 'Dachinspektion und U-Wert: Wie die Hülle deines Hauses Wert erhält — und woran du merkst, dass etwas nicht mehr stimmt.',
    leistung: { href: '/leistungen/dach-fenster-tueren', label: 'Dach, Fenster & Türen' },
  },
  {
    slug: 'elektro-sicherheit',
    name: 'Elektro & Sicherheit',
    kurz: 'Schutz, Prüfung, Nachweis',
    beschreibung: 'FI-Schutzschalter und E-Check: Elektrosicherheit verständlich, mit klaren Prüfintervallen und Hinweisen für Versicherung und Verkauf.',
    leistung: { href: '/leistungen/elektro-smart-home', label: 'Elektro & Smart Home' },
  },
  {
    slug: 'sanitaer-wasser',
    name: 'Sanitär & Wasser',
    kurz: 'Trinkwasser, Abwasser, Schutz',
    beschreibung: 'Legionellenprüfung und Rückstauklappe: Was in Leitungen passiert, bevor du es siehst — und wie du Schaden vermeidest.',
    leistung: { href: '/leistungen/sanitaer-wasser', label: 'Sanitär & Wasser' },
  },
  {
    slug: 'recht-pflichten',
    name: 'Recht & Pflichten',
    kurz: 'Fristen, Nachweise, Haftung',
    beschreibung: 'Energieausweis, Feuerstättenschau, Verkehrssicherungspflicht: Pflichten von Eigentümern ohne Juristendeutsch.',
    leistung: { href: '/beratung', label: 'Beratung durch Einfach Hausen' },
  },
  {
    slug: 'hausakte-organisation',
    name: 'Hausakte & Organisation',
    kurz: 'Gedächtnis des Hauses',
    beschreibung: 'Hausakte und Instandhaltungsrücklage: Wie du Wissen, Termine und Geld so organisierst, dass dein Haus dich nicht überrascht.',
    leistung: { href: '/hausakte', label: 'Die digitale Hausakte' },
  },
];

type Enrichment = Omit<LexikonEintrag, keyof LexikonTerm>;

/** Anreicherung der vier bestehenden SEO-Pilot-Einträge (Inhalte bleiben in seo-cluster.ts). */
const ENRICHMENT: Record<string, Enrichment> = {
  'hydraulischer-abgleich': {
    kategorie: 'heizung-energie',
    kurz: 'Jeder Heizkörper bekommt genau die Wassermenge, die er braucht — nicht mehr, nicht weniger.',
    relevanz: 'empfohlen',
    synonyme: ['Heizungsabgleich', 'Voreinstellung Thermostatventile'],
    wannHandeln: 'Wenn Räume ungleich warm werden, Heizkörper rauschen oder ein Heizungstausch bzw. eine Förderung ansteht.',
    stufen: { kosten: 2, aufwand: 2, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Zuständig', value: 'Heizungsbauer', hint: 'SHK-Fachbetrieb mit Berechnungsnachweis' },
      { label: 'Termin', value: '½–1 Tag', hint: 'Je nach Anzahl Heizflächen' },
      { label: 'Nachweis', value: 'Protokoll', hint: 'Einstellwerte in die Hausakte' },
    ],
    verwandt: ['heizungsgesetz', 'waermepumpe', 'jahresarbeitszahl'],
    leistung: { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
  },
  heizungsgesetz: {
    kategorie: 'recht-pflichten',
    kurz: 'Das Gebäudeenergiegesetz regelt, welche Heizung wann eingebaut, betrieben oder ersetzt werden darf.',
    relevanz: 'pflicht',
    synonyme: ['GEG', 'Gebäudeenergiegesetz'],
    wannHandeln: 'Wenn deine Heizung älter als 30 Jahre ist, ein Austausch bevorsteht oder eine kommunale Wärmeplanung veröffentlicht wird.',
    stufen: { kosten: 3, aufwand: 3, dringlichkeit: 3 },
    kennzahlen: [
      { label: 'Betrifft', value: 'Bestand & Neubau', hint: 'Übergangsfristen je nach Kommune' },
      { label: 'Zuständig', value: 'Eigentümer', hint: 'Nachweis über Fachbetrieb/Schornsteinfeger' },
      { label: 'Erster Schritt', value: 'Bestand klären', hint: 'Anlage, Alter, Typenschild' },
    ],
    verwandt: ['hydraulischer-abgleich', 'waermepumpe', 'energieausweis'],
    leistung: { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
  },
  lüftungsanlage: {
    kategorie: 'feuchte-schimmel',
    kurz: 'Kontrollierter Luftaustausch, der Feuchte abführt, ohne dass du an Fenster denken musst.',
    relevanz: 'empfohlen',
    synonyme: ['KWL', 'kontrollierte Wohnraumlüftung', 'dezentrale Lüftung'],
    wannHandeln: 'Wenn nach Fenstertausch oder Dämmung Feuchte an Scheiben oder Wandecken auftritt oder Schimmel wiederkehrt.',
    stufen: { kosten: 3, aufwand: 3, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Varianten', value: 'dezentral / zentral', hint: 'Einzelraum oder ganzes Haus' },
      { label: 'Pflege', value: 'Filterwechsel', hint: 'Intervall in der Hausakte hinterlegen' },
      { label: 'Zuständig', value: 'Lüftungsbauer', hint: 'Oft SHK- oder Elektrobetrieb' },
    ],
    verwandt: ['taupunkt', 'schimmelklasse', 'u-wert'],
    leistung: { href: '/leistungen/haus-technik', label: 'Haustechnik als Leistung' },
  },
  schimmelklasse: {
    kategorie: 'feuchte-schimmel',
    kurz: 'Einstufung eines Befalls nach Fläche und Tiefe — sie entscheidet, ob du selbst ran darfst oder der Fachbetrieb muss.',
    relevanz: 'empfohlen',
    synonyme: ['Schimmelkategorie', 'Befallsklasse'],
    wannHandeln: 'Sobald dunkle Flecken größer als eine Handfläche sind, wiederkehren oder muffiger Geruch ohne sichtbaren Befall auftritt.',
    stufen: { kosten: 2, aufwand: 2, dringlichkeit: 4 },
    kennzahlen: [
      { label: 'Erster Schritt', value: 'Fotos, nicht streichen', hint: 'Mit Größenvergleich dokumentieren' },
      { label: 'Zuständig', value: 'Sanierungsbetrieb', hint: 'Bei größeren Flächen mit Messung' },
      { label: 'Ursache', value: 'immer klären', hint: 'Sonst kommt der Befall wieder' },
    ],
    verwandt: ['taupunkt', 'lüftungsanlage'],
    leistung: { href: '/leistungen/innenausbau-sanierung', label: 'Sanierung als Leistung' },
  },
};

const NEUE_EINTRAEGE: LexikonEintrag[] = [
  {
    slug: 'energieausweis',
    begriff: 'Energieausweis',
    title: 'Energieausweis: Arten, Pflicht, Kosten und Ablauf',
    description: 'Bedarfs- oder Verbrauchsausweis? Wann der Energieausweis Pflicht ist, was er kostet und wie du ihn beschaffst.',
    definition: 'Der Energieausweis bewertet die energetische Qualität eines Gebäudes und ist bei Verkauf, Vermietung und Verpachtung vorzulegen. Es gibt den Verbrauchsausweis (aus realen Verbrauchsdaten) und den Bedarfsausweis (aus einer Gebäudeanalyse).',
    kategorie: 'recht-pflichten',
    kurz: 'Das Dokument, das die energetische Qualität deines Hauses bescheinigt — Pflicht bei Verkauf und Vermietung.',
    relevanz: 'pflicht',
    synonyme: ['Energiepass', 'Bedarfsausweis', 'Verbrauchsausweis'],
    wannHandeln: 'Spätestens wenn du inserierst oder besichtigen lässt — der Ausweis muss bei der Besichtigung vorliegen. Auch nach größeren Sanierungen lohnt eine Aktualisierung.',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 3 },
    kennzahlen: [
      { label: 'Gültigkeit', value: '10 Jahre', hint: 'Ab Ausstellungsdatum' },
      { label: 'Arten', value: 'Bedarf / Verbrauch', hint: 'Bedarfsausweis ist aussagekräftiger' },
      { label: 'Pflicht bei', value: 'Verkauf & Vermietung', hint: 'Kennwerte gehören ins Inserat' },
    ],
    kosten: [
      'Ein Verbrauchsausweis bewegt sich meist im niedrigen zweistelligen bis niedrigen dreistelligen Euro-Bereich.',
      'Ein Bedarfsausweis mit Vor-Ort-Aufnahme liegt darüber — der Aufwand hängt von Größe und Unterlagenlage des Gebäudes ab.',
      'Welche Art zulässig ist und was sie kostet, klärt der Partnerbetrieb vorab; die Einordnung durch Einfach Hausen ist kostenlos.',
    ],
    ablauf: [
      { title: 'Art bestimmen', text: 'Baujahr, Wohneinheiten und Sanierungsstand entscheiden, ob ein Verbrauchsausweis reicht oder ein Bedarfsausweis nötig ist.' },
      { title: 'Unterlagen sammeln', text: 'Verbrauchsabrechnungen der letzten drei Jahre, Baupläne, Dämm- und Heizungsdaten — vieles davon liegt idealerweise schon in der Hausakte.' },
      { title: 'Ausstellen lassen', text: 'Ein ausstellungsberechtigter Energieberater oder Fachbetrieb erstellt den Ausweis, beim Bedarfsausweis nach Begehung.' },
      { title: 'Ablegen und nutzen', text: 'Ausweis in die Hausakte, Kennwerte ins Inserat, Modernisierungsempfehlungen als Planungsgrundlage behalten.' },
    ],
    prüfpunkte: [
      'Liegt ein Ausweis vor und ist er noch gültig (10 Jahre)?',
      'Wurde seit der Ausstellung saniert (Dach, Fenster, Heizung)? Dann bildet er den Zustand nicht mehr ab.',
      'Verkauf oder Vermietung geplant? Dann Kennwerte rechtzeitig für das Inserat bereithalten.',
      'Verbrauchsdaten vollständig? Ohne drei Jahre Abrechnungen ist ein Verbrauchsausweis nicht möglich.',
    ],
    faqs: [
      { q: 'Brauche ich einen Energieausweis, wenn ich selbst im Haus wohne?', a: 'Nein. Die Pflicht greift bei Verkauf, Vermietung und Verpachtung. Für die eigene Planung kann ein Bedarfsausweis trotzdem sinnvoll sein, weil er Modernisierungsempfehlungen enthält.' },
      { q: 'Welcher Ausweis ist besser — Bedarf oder Verbrauch?', a: 'Der Bedarfsausweis bewertet das Gebäude unabhängig vom Nutzerverhalten und ist aussagekräftiger. Für bestimmte ältere, kleine Gebäude ist er vorgeschrieben. Der Partnerbetrieb ordnet ein, was für dein Haus gilt.' },
      { q: 'Wie schnell bekomme ich den Ausweis?', a: 'Ein Verbrauchsausweis ist bei vollständigen Unterlagen kurzfristig möglich. Ein Bedarfsausweis benötigt einen Vor-Ort-Termin und etwas Auswertungszeit.' },
    ],
    related: [
      { href: '/immobilienverkauf', label: 'Immobilienverkauf mit Einfach Hausen vorbereiten' },
      { href: '/lexikon/heizungsgesetz', label: 'Lexikon: Heizungsgesetz (GEG)' },
      { href: '/hausakte', label: 'Hausakte: Unterlagen dauerhaft griffbereit' },
    ],
    verwandt: ['heizungsgesetz', 'u-wert', 'hausakte'],
    leistung: { href: '/immobilienverkauf', label: 'Immobilienverkauf vorbereiten' },
  },
  {
    slug: 'waermepumpe',
    begriff: 'Wärmepumpe',
    title: 'Wärmepumpe: Funktionsweise, Voraussetzungen, Kostenrahmen',
    description: 'Wie eine Wärmepumpe arbeitet, wann sie im Bestand funktioniert und welche Schritte vor der Entscheidung stehen.',
    definition: 'Eine Wärmepumpe entzieht Luft, Erdreich oder Grundwasser Umweltwärme und hebt sie mit Strom auf Heiztemperatur. Ihr Wirkungsgrad hängt stark davon ab, wie niedrig die Vorlauftemperatur im Haus sein darf.',
    kategorie: 'heizung-energie',
    kurz: 'Heizt mit Umweltwärme und Strom — funktioniert im Bestand, wenn Heizflächen und Dämmung mitspielen.',
    relevanz: 'wissen',
    synonyme: ['Luft-Wasser-Wärmepumpe', 'Sole-Wasser-Wärmepumpe', 'Erdwärmepumpe'],
    wannHandeln: 'Wenn ein Heizungstausch in den nächsten Jahren ansteht oder die aktuelle Anlage älter als 20 Jahre ist — die Vorbereitung dauert länger als der Einbau.',
    stufen: { kosten: 4, aufwand: 4, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Kernfrage', value: 'Vorlauftemperatur', hint: 'Je niedriger, desto effizienter' },
      { label: 'Vorarbeit', value: 'Heizlast + Abgleich', hint: 'Heizflächen ggf. vergrößern' },
      { label: 'Zuständig', value: 'SHK + Elektro', hint: 'Stromanschluss oft anzupassen' },
    ],
    kosten: [
      'Eine Wärmepumpe im Bestand ist eine Investition im fünfstelligen Euro-Bereich; Förderprogramme können einen erheblichen Anteil abdecken.',
      'Zusätzlich fallen je nach Haus Kosten für Heizflächen, Pufferspeicher, Elektroanschluss und Rückbau der Altanlage an.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Heizlastberechnung — vorher sind Zahlen nur Orientierung.',
    ],
    ablauf: [
      { title: 'Eignung prüfen', text: 'Heizlast, Heizflächen, Dämmstand und Aufstellort klären. Ein Probelauf mit abgesenkter Vorlauftemperatur im Winter zeigt viel.' },
      { title: 'System wählen', text: 'Luft-, Sole- oder Wasserquelle, mit oder ohne Pufferspeicher — der Fachbetrieb ordnet ein, was zu Grundstück und Budget passt.' },
      { title: 'Förderung und Angebot', text: 'Förderantrag vor Beauftragung stellen. Kostenrahmen inklusive Nebengewerke prüfen, bevor du entscheidest.' },
      { title: 'Einbau und Einregulierung', text: 'Installation, hydraulischer Abgleich, Einweisung. Die ersten Betriebsmonate beobachten und nachjustieren lassen.' },
    ],
    prüfpunkte: [
      'Wird das Haus mit 55 °C Vorlauf oder weniger warm? Test im Winter mit gedrosselter Heizkurve.',
      'Gibt es einen geeigneten Aufstellort mit Abstand zu Nachbarn (Schall) bzw. Fläche für Erdkollektor oder Bohrung?',
      'Reicht der Hausanschluss für Wärmepumpe und ggf. Wallbox?',
      'Liegen Heizlastberechnung oder Energieberatung bereits vor?',
    ],
    faqs: [
      { q: 'Funktioniert eine Wärmepumpe im Altbau?', a: 'Oft ja — entscheidend sind Heizflächen und Dämmung, nicht das Baujahr. Große Heizkörper oder Fußbodenheizung helfen; einzelne Räume lassen sich mit größeren Heizkörpern nachrüsten.' },
      { q: 'Wie laut ist eine Luft-Wärmepumpe?', a: 'Moderne Geräte sind leise, der Aufstellort bleibt aber wichtig. Abstand zu Schlafzimmerfenstern und Nachbargrenzen wird im Angebot berücksichtigt.' },
      { q: 'Muss ich vorher dämmen?', a: 'Nicht zwingend. Dämmung senkt die Heizlast und macht die Anlage kleiner und effizienter, ist aber keine Voraussetzung. Der Betrieb rechnet beide Varianten vor.' },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Heizung als Leistung: Einordnung, Partner und Ablauf' },
      { href: '/lexikon/jahresarbeitszahl', label: 'Lexikon: Jahresarbeitszahl (JAZ)' },
      { href: '/lexikon/hydraulischer-abgleich', label: 'Lexikon: hydraulischer Abgleich' },
    ],
    verwandt: ['jahresarbeitszahl', 'hydraulischer-abgleich', 'heizungsgesetz', 'u-wert'],
    leistung: { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
  },
  {
    slug: 'jahresarbeitszahl',
    begriff: 'Jahresarbeitszahl (JAZ)',
    title: 'Jahresarbeitszahl (JAZ): Bedeutung, Einordnung, Verbesserung',
    description: 'Die JAZ zeigt, wie effizient eine Wärmepumpe über ein ganzes Jahr arbeitet. So liest und verbesserst du sie.',
    definition: 'Die Jahresarbeitszahl gibt an, wie viel Wärme eine Wärmepumpe pro eingesetzter Kilowattstunde Strom über ein Jahr liefert. Eine JAZ von 3,5 bedeutet: 1 kWh Strom wird zu 3,5 kWh Wärme.',
    kategorie: 'heizung-energie',
    kurz: 'Die Kennzahl, die entscheidet, ob deine Wärmepumpe wirtschaftlich läuft — gemessen über ein ganzes Jahr.',
    relevanz: 'wissen',
    synonyme: ['JAZ', 'Arbeitszahl', 'SCOP (Planungswert)'],
    wannHandeln: 'Nach dem ersten Betriebsjahr einer Wärmepumpe oder wenn Stromkosten höher ausfallen als im Angebot berechnet.',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 1 },
    kennzahlen: [
      { label: 'Formel', value: 'Wärme ÷ Strom', hint: 'Über zwölf Monate gemessen' },
      { label: 'Größter Hebel', value: 'Vorlauftemperatur', hint: 'Heizkurve so flach wie möglich' },
      { label: 'Ablesen', value: 'Wärmemengenzähler', hint: 'Plus separater Stromzähler' },
    ],
    kosten: [
      'Das Ablesen kostet nichts, wenn Wärmemengen- und Stromzähler vorhanden sind; Nachrüstung liegt im niedrigen dreistelligen Bereich.',
      'Optimierungen wie Heizkurve anpassen oder hydraulischer Abgleich sind vergleichsweise günstige Maßnahmen mit direkter Wirkung.',
      'Verbindliche Zahlen liefert der Partnerbetrieb nach Sichtung der Anlage.',
    ],
    ablauf: [
      { title: 'Zählerstände sichern', text: 'Wärmemenge und Strom der Wärmepumpe am gleichen Stichtag notieren — am besten jährlich in der Hausakte.' },
      { title: 'JAZ berechnen', text: 'Erzeugte Wärme durch verbrauchten Strom teilen. Werte unter der Planungsangabe sind ein Signal, keine Katastrophe.' },
      { title: 'Ursachen eingrenzen', text: 'Heizkurve, Warmwassertemperatur, Taktverhalten und Abgleich prüfen — meist liegt es an Einstellungen, nicht am Gerät.' },
      { title: 'Nachjustieren lassen', text: 'Fachbetrieb passt Regelung an; nach einer Heizperiode erneut ablesen und vergleichen.' },
    ],
    prüfpunkte: [
      'Gibt es einen separaten Stromzähler für die Wärmepumpe?',
      'Wie hoch ist die eingestellte Vorlauftemperatur bei –10 °C Außentemperatur?',
      'Läuft die Anlage oft kurz an und wieder aus (Takten)?',
      'Wurde nach dem Einbau ein hydraulischer Abgleich gemacht?',
    ],
    faqs: [
      { q: 'Welche JAZ ist gut?', a: 'Das hängt vom Gebäude ab. Als grobe Orientierung gilt: je näher an der Planungsangabe des Angebots, desto besser. Der Vergleich mit dem eigenen Planwert ist aussagekräftiger als Durchschnittswerte.' },
      { q: 'Was ist der Unterschied zwischen JAZ und COP?', a: 'Der COP ist ein Laborwert unter festen Bedingungen. Die JAZ misst den realen Betrieb über ein Jahr — inklusive Winter, Warmwasser und Stillstandszeiten.' },
      { q: 'Kann ich die JAZ selbst verbessern?', a: 'Teilweise: Heizkurve absenken, Warmwasser nicht unnötig heiß, Räume nicht einzeln abdrehen. Größere Eingriffe gehören zum Fachbetrieb.' },
    ],
    related: [
      { href: '/lexikon/waermepumpe', label: 'Lexikon: Wärmepumpe' },
      { href: '/lexikon/hydraulischer-abgleich', label: 'Lexikon: hydraulischer Abgleich' },
      { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
    ],
    verwandt: ['waermepumpe', 'hydraulischer-abgleich'],
    leistung: { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
  },
  {
    slug: 'u-wert',
    begriff: 'U-Wert',
    title: 'U-Wert: Bedeutung, typische Werte, Verbesserung',
    description: 'Der U-Wert beschreibt, wie viel Wärme durch ein Bauteil entweicht. So ordnest du Fenster, Dach und Wand richtig ein.',
    definition: 'Der Wärmedurchgangskoeffizient (U-Wert) gibt an, wie viel Wärme pro Quadratmeter und Grad Temperaturunterschied durch ein Bauteil fließt. Je niedriger der Wert, desto besser dämmt Wand, Fenster oder Dach.',
    kategorie: 'dach-gebaeudehuelle',
    kurz: 'Die Zahl hinter jeder Dämm-Entscheidung: Wie viel Wärme entweicht durch Fenster, Wand oder Dach?',
    relevanz: 'wissen',
    synonyme: ['Wärmedurchgangskoeffizient', 'k-Wert (veraltet)'],
    wannHandeln: 'Wenn Fenster, Dach oder Fassade erneuert werden sollen oder Förderung beantragt wird — dort sind U-Werte Bedingung.',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 1 },
    kennzahlen: [
      { label: 'Einheit', value: 'W/(m²·K)', hint: 'Niedriger ist besser' },
      { label: 'Relevanz', value: 'Förderung', hint: 'Grenzwerte je Bauteil' },
      { label: 'Nachweis', value: 'Herstellerangabe', hint: 'Bei Fenstern: Uw für das ganze Fenster' },
    ],
    kosten: [
      'Der U-Wert selbst kostet nichts — er steht im Angebot oder Datenblatt.',
      'Die Kosten entstehen bei der Maßnahme: Fenster, Dachdämmung oder Fassade unterscheiden sich um Größenordnungen.',
      'Der Partnerbetrieb nennt Kostenrahmen je Bauteil, bevor du entscheidest.',
    ],
    ablauf: [
      { title: 'Bauteil bestimmen', text: 'Welches Bauteil ist der Schwachpunkt? Thermografie oder Energieberatung zeigen, wo die Wärme wirklich entweicht.' },
      { title: 'Zielwert festlegen', text: 'Förderfähige Grenzwerte als Untergrenze; darüber hinaus zählt das Verhältnis von Mehrkosten zu Einsparung.' },
      { title: 'Angebote vergleichen', text: 'U-Werte im Angebot prüfen: Bei Fenstern zählt der Uw-Wert des Gesamtelements, nicht nur der Glaswert Ug.' },
      { title: 'Dokumentieren', text: 'Datenblätter und Rechnungen in die Hausakte — für Förderung, Energieausweis und späteren Verkauf.' },
    ],
    prüfpunkte: [
      'Steht im Fensterangebot der Uw-Wert des Gesamtfensters?',
      'Ist das oberste Geschoss bzw. Dach gedämmt? Dort ist der Hebel häufig am größten.',
      'Passt die Maßnahme zur Lüftungssituation (Feuchte nach Fenstertausch)?',
      'Sind Förderbedingungen vor der Beauftragung geprüft?',
    ],
    faqs: [
      { q: 'Was ist ein guter U-Wert für Fenster?', a: 'Moderne Dreifachverglasung liegt deutlich unter 1,0 W/(m²·K) für das Gesamtfenster. Förderprogramme nennen konkrete Grenzwerte, die der Partnerbetrieb kennt.' },
      { q: 'Reicht es, nur den U-Wert zu vergleichen?', a: 'Nein. Einbauqualität, Anschlussdetails und Lüftung entscheiden mit. Ein sehr guter U-Wert mit schlechtem Anschluss bringt Feuchteprobleme.' },
      { q: 'Wie finde ich den U-Wert meiner Wand heraus?', a: 'Über Bauunterlagen, Baujahr-typische Aufbauten oder eine Energieberatung. Ein Bedarfs-Energieausweis enthält diese Einschätzung.' },
    ],
    related: [
      { href: '/leistungen/dach-fenster-tueren', label: 'Dach, Fenster & Türen als Leistung' },
      { href: '/lexikon/energieausweis', label: 'Lexikon: Energieausweis' },
      { href: '/lexikon/taupunkt', label: 'Lexikon: Taupunkt' },
    ],
    verwandt: ['energieausweis', 'taupunkt', 'dachinspektion', 'waermepumpe'],
    leistung: { href: '/leistungen/dach-fenster-tueren', label: 'Dach, Fenster & Türen' },
  },
  {
    slug: 'taupunkt',
    begriff: 'Taupunkt',
    title: 'Taupunkt: warum Wände feucht werden und was hilft',
    description: 'Der Taupunkt erklärt, warum sich Feuchte an kalten Stellen sammelt. Ursache verstehen, statt Symptome zu bekämpfen.',
    definition: 'Der Taupunkt ist die Temperatur, bei der Luft ihre Feuchte nicht mehr halten kann und Wasser kondensiert. Kühlt eine Wandoberfläche unter den Taupunkt der Raumluft, wird sie feucht — der Startpunkt für Schimmel.',
    kategorie: 'feuchte-schimmel',
    kurz: 'Die Temperatur, ab der Luftfeuchte zu Wasser wird — an kalten Wänden, Ecken und Fensterlaibungen.',
    relevanz: 'wissen',
    synonyme: ['Kondensation', 'Tauwasser', 'Wärmebrücke (Ursache)'],
    wannHandeln: 'Bei beschlagenen Fenstern am Morgen, feuchten Außenecken oder Schimmel hinter Möbeln an Außenwänden.',
    stufen: { kosten: 1, aufwand: 2, dringlichkeit: 3 },
    kennzahlen: [
      { label: 'Messen', value: 'Hygrometer', hint: 'Raumfeuchte unter ~60 % halten' },
      { label: 'Kritisch', value: 'kalte Oberflächen', hint: 'Ecken, Laibungen, Rollladenkästen' },
      { label: 'Erste Hilfe', value: 'Stoßlüften + Heizen', hint: 'Möbel von Außenwänden abrücken' },
    ],
    kosten: [
      'Messen und Lüftungsverhalten anpassen kostet nichts bis wenig (Hygrometer im niedrigen zweistelligen Bereich).',
      'Bauliche Ursachen wie Wärmebrücken erfordern Dämmung oder Lüftungstechnik — Kostenrahmen je nach Umfang sehr unterschiedlich.',
      'Die Einordnung, ob Nutzung oder Bauteil die Ursache ist, übernimmt der Partnerbetrieb mit Messung.',
    ],
    ablauf: [
      { title: 'Beobachten und messen', text: 'Wo und wann tritt Feuchte auf? Raumtemperatur und Luftfeuchte über einige Tage protokollieren.' },
      { title: 'Nutzung anpassen', text: 'Mehrmals täglich stoßlüften, Räume nicht auskühlen lassen, Möbel mit Abstand zur Außenwand.' },
      { title: 'Bauteil prüfen lassen', text: 'Bleibt das Problem, misst der Fachbetrieb Oberflächentemperaturen und findet Wärmebrücken.' },
      { title: 'Ursache beheben', text: 'Innendämmung, Laibungsdämmung oder Lüftungsanlage — Maßnahme und Ergebnis in der Hausakte festhalten.' },
    ],
    prüfpunkte: [
      'Liegt die Raumluftfeuchte dauerhaft über 60 %?',
      'Sind Fensterlaibungen oder Außenecken kühler als der Rest der Wand?',
      'Wurden Fenster getauscht, ohne die Lüftung anzupassen?',
      'Stehen Schränke direkt an Außenwänden?',
    ],
    faqs: [
      { q: 'Reicht es, mehr zu lüften?', a: 'Oft hilft es, aber nicht immer. Ist eine Wandstelle baulich zu kalt, kondensiert dort Feuchte trotz gutem Lüften. Dann muss die Wärmebrücke behoben werden.' },
      { q: 'Warum tritt das Problem erst seit dem Fenstertausch auf?', a: 'Neue Fenster sind dichter, der unkontrollierte Luftaustausch fehlt. Die Feuchte bleibt im Raum und kondensiert an der nächstkälteren Stelle.' },
      { q: 'Ist ein Luftentfeuchter die Lösung?', a: 'Als Übergang ja, als Dauerlösung nein. Er behandelt das Symptom; Ursache bleibt die kalte Oberfläche oder fehlende Lüftung.' },
    ],
    related: [
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklasse' },
      { href: '/lexikon/lüftungsanlage', label: 'Lexikon: Lüftungsanlage' },
      { href: '/leistungen/innenausbau-sanierung', label: 'Sanierung als Leistung' },
    ],
    verwandt: ['schimmelklasse', 'lüftungsanlage', 'u-wert'],
    leistung: { href: '/leistungen/innenausbau-sanierung', label: 'Sanierung als Leistung' },
  },
  {
    slug: 'fi-schutzschalter',
    begriff: 'FI-Schutzschalter',
    title: 'FI-Schutzschalter (RCD): Funktion, Pflicht, Nachrüstung',
    description: 'Was der FI-Schalter schützt, wo er vorgeschrieben ist und wie die Nachrüstung im Altbau abläuft.',
    definition: 'Der Fehlerstrom-Schutzschalter (FI, international RCD) vergleicht hin- und zurückfließenden Strom und schaltet in Millisekunden ab, wenn Strom über einen Menschen oder ein defektes Gerät abfließt. Er ist der wichtigste Personenschutz in der Hausinstallation.',
    kategorie: 'elektro-sicherheit',
    kurz: 'Schaltet in Millisekunden ab, wenn Strom den falschen Weg nimmt — der wichtigste Personenschutz im Haus.',
    relevanz: 'pflicht',
    synonyme: ['RCD', 'Fehlerstrom-Schutzschalter', 'FI-Schalter'],
    wannHandeln: 'Wenn im Sicherungskasten kein Schalter mit Prüftaste („T") vorhanden ist oder bei jeder Elektroarbeit in Bad, Küche oder Außenbereich.',
    stufen: { kosten: 2, aufwand: 2, dringlichkeit: 4 },
    kennzahlen: [
      { label: 'Prüfen', value: 'Prüftaste halbjährlich', hint: 'Muss sofort auslösen' },
      { label: 'Pflicht bei', value: 'Steckdosen & Feuchträumen', hint: 'Bei Neubau und Änderung' },
      { label: 'Zuständig', value: 'Elektrofachbetrieb', hint: 'Keine Eigenleistung' },
    ],
    kosten: [
      'Die Nachrüstung einzelner Stromkreise liegt meist im niedrigen bis mittleren dreistelligen Euro-Bereich.',
      'Bei alten Verteilungen ohne Platz oder ohne getrennten Neutralleiter kann eine Erneuerung des Verteilers nötig werden.',
      'Der Elektrofachbetrieb prüft die Installation vorab und nennt einen Kostenrahmen, bevor du entscheidest.',
    ],
    ablauf: [
      { title: 'Verteiler sichten', text: 'Foto vom geöffneten Sicherungskasten: Sind FI-Schalter vorhanden, welche Stromkreise sichern sie ab?' },
      { title: 'Installation prüfen lassen', text: 'Fachbetrieb prüft Leitungsnetz und Schutzleiter — bei klassischer Nullung ist zusätzlicher Aufwand nötig.' },
      { title: 'Nachrüsten', text: 'FI-Schalter für Steckdosen-, Bad- und Außenstromkreise einbauen; bei Bedarf Verteiler erneuern.' },
      { title: 'Prüfprotokoll ablegen', text: 'Messprotokoll in die Hausakte — wichtig für Versicherung, Vermietung und Verkauf.' },
    ],
    prüfpunkte: [
      'Gibt es im Sicherungskasten Schalter mit einer Prüftaste „T"?',
      'Löst der FI beim Drücken der Prüftaste sofort aus?',
      'Sind Bad, Außensteckdosen und Küche abgesichert?',
      'Stammt die Elektroinstallation aus der Zeit vor den 1980er-Jahren und wurde seither nicht geprüft?',
    ],
    faqs: [
      { q: 'Bin ich verpflichtet, im Altbau nachzurüsten?', a: 'Für den Bestand gilt grundsätzlich Bestandsschutz. Sobald aber Stromkreise geändert oder erweitert werden, greifen aktuelle Vorschriften. Unabhängig davon ist der FI der wirksamste Personenschutz.' },
      { q: 'Warum löst der FI-Schalter immer wieder aus?', a: 'Meist ein defektes Gerät oder Feuchtigkeit in einer Leitung. Geräte nacheinander abstecken; bleibt es dabei, muss der Fachbetrieb messen.' },
      { q: 'Ein FI für alles oder mehrere?', a: 'Mehrere sind besser: Löst einer aus, bleibt der Rest des Hauses versorgt. Der Betrieb schlägt eine sinnvolle Aufteilung vor.' },
    ],
    related: [
      { href: '/leistungen/elektro-smart-home', label: 'Elektro & Smart Home als Leistung' },
      { href: '/lexikon/e-check', label: 'Lexikon: E-Check' },
      { href: '/notfall', label: 'Notfall: Was tun bei Stromausfall oder Brandgeruch' },
    ],
    verwandt: ['e-check', 'verkehrssicherungspflicht'],
    leistung: { href: '/leistungen/elektro-smart-home', label: 'Elektro & Smart Home' },
  },
  {
    slug: 'e-check',
    begriff: 'E-Check',
    title: 'E-Check: Prüfung der Elektroinstallation im Eigenheim',
    description: 'Was beim E-Check geprüft wird, wann er sinnvoll ist und was Eigentümer vom Prüfprotokoll haben.',
    definition: 'Der E-Check ist eine normgerechte Prüfung der elektrischen Anlage und angeschlossener Geräte durch einen Elektrofachbetrieb. Ergebnis ist ein Prüfprotokoll, das Mängel benennt und den sicheren Zustand dokumentiert.',
    kategorie: 'elektro-sicherheit',
    kurz: 'Der Sicherheits-TÜV für deine Elektroinstallation — mit Protokoll, das bei Versicherung und Verkauf zählt.',
    relevanz: 'empfohlen',
    synonyme: ['Elektroprüfung', 'Anlagenprüfung', 'Prüfung nach DIN VDE 0105'],
    wannHandeln: 'Beim Hauskauf, nach Wasserschäden, bei Installationen älter als 30 Jahre oder wenn Sicherungen häufig auslösen.',
    stufen: { kosten: 2, aufwand: 1, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Empfehlung', value: 'alle 4 Jahre', hint: 'Bei Vermietung engmaschiger' },
      { label: 'Dauer', value: '1–3 Stunden', hint: 'Je nach Größe des Hauses' },
      { label: 'Ergebnis', value: 'Prüfprotokoll', hint: 'Mit Mängelliste und Prüfplakette' },
    ],
    kosten: [
      'Ein E-Check für ein Einfamilienhaus liegt meist im niedrigen bis mittleren dreistelligen Euro-Bereich.',
      'Festgestellte Mängel werden separat angeboten — nichts wird ohne deine Entscheidung repariert.',
      'Kostenrahmen nennt der Elektrofachbetrieb vorab; die Einordnung durch Einfach Hausen ist kostenlos.',
    ],
    ablauf: [
      { title: 'Termin vorbereiten', text: 'Zugang zu Verteiler, Zähler und allen Räumen sicherstellen; Auffälligkeiten (flackerndes Licht, warme Steckdosen) notieren.' },
      { title: 'Sichtprüfung', text: 'Verteilung, Leitungen, Steckdosen und Schutzmaßnahmen werden auf Zustand und Normkonformität geprüft.' },
      { title: 'Messung', text: 'Schutzleiter, Isolationswiderstand, FI-Auslösung und Schleifenimpedanz werden gemessen.' },
      { title: 'Protokoll und Empfehlung', text: 'Du erhältst Protokoll und Mängelliste mit Priorität — und entscheidest, was wann behoben wird.' },
    ],
    prüfpunkte: [
      'Wann wurde die Elektroinstallation zuletzt geprüft?',
      'Gibt es Steckdosen, die warm werden, oder Sicherungen, die grundlos auslösen?',
      'Wurde das Haus gekauft, ohne dass ein Prüfprotokoll vorlag?',
      'Verlangt die Wohngebäudeversicherung Nachweise zur Elektrosicherheit?',
    ],
    faqs: [
      { q: 'Ist der E-Check Pflicht?', a: 'Für selbstgenutzte Eigenheime nein. Vermieter tragen dagegen Verantwortung für die Anlagensicherheit; auch Versicherungen können Prüfungen verlangen. Empfohlen ist er in jedem Fall.' },
      { q: 'Was passiert, wenn Mängel gefunden werden?', a: 'Sie stehen priorisiert im Protokoll. Sicherheitsrelevante Mängel solltest du zeitnah beheben lassen; bei allem anderen entscheidest du in Ruhe mit Kostenrahmen.' },
      { q: 'Kann ich den E-Check mit anderen Elektroarbeiten kombinieren?', a: 'Ja — etwa mit FI-Nachrüstung oder Wallbox-Installation. So sparst du einen Termin und hast am Ende ein vollständiges Protokoll.' },
    ],
    related: [
      { href: '/leistungen/elektro-smart-home', label: 'Elektro & Smart Home als Leistung' },
      { href: '/lexikon/fi-schutzschalter', label: 'Lexikon: FI-Schutzschalter' },
      { href: '/versicherung', label: 'Versicherung: Nachweise und Schadenfall' },
    ],
    verwandt: ['fi-schutzschalter', 'hausakte', 'verkehrssicherungspflicht'],
    leistung: { href: '/leistungen/elektro-smart-home', label: 'Elektro & Smart Home' },
  },
  {
    slug: 'legionellenpruefung',
    begriff: 'Legionellenprüfung',
    title: 'Legionellenprüfung: Pflicht, Ablauf und Vorbeugung',
    description: 'Wann die Legionellenprüfung Pflicht ist, wie sie abläuft und wie du Trinkwasser im Haus sicher hältst.',
    definition: 'Die Legionellenprüfung ist eine Untersuchung des Warmwassersystems auf Legionellen — Bakterien, die sich in lauwarmem, stehendem Wasser vermehren. Für vermietete Gebäude mit zentraler Warmwasserbereitung ist sie vorgeschrieben.',
    kategorie: 'sanitaer-wasser',
    kurz: 'Untersuchung des Warmwassers auf Bakterien — Pflicht bei Vermietung mit zentralem Speicher, sinnvoll für alle.',
    relevanz: 'pflicht',
    synonyme: ['Trinkwasseruntersuchung', 'Legionellenbeprobung'],
    wannHandeln: 'Bei vermieteten Gebäuden mit Speicher über 400 Litern regelmäßig; im Eigenheim nach längerem Leerstand oder wenn Warmwasser lauwarm eingestellt ist.',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 3 },
    kennzahlen: [
      { label: 'Pflicht-Intervall', value: '3 Jahre', hint: 'Bei Vermietung mit Großanlage' },
      { label: 'Speichertemperatur', value: '≥ 60 °C', hint: 'Vorbeugung gegen Vermehrung' },
      { label: 'Zuständig', value: 'akkreditiertes Labor', hint: 'Probenahme durch SHK-Betrieb' },
    ],
    kosten: [
      'Die Probenahme mit Laboranalyse bewegt sich meist im niedrigen dreistelligen Euro-Bereich.',
      'Bei Befund kommen thermische Desinfektion, Filter oder Umbauten am Leitungsnetz hinzu — abhängig vom Ausmaß.',
      'Kostenrahmen nennt der Partnerbetrieb vorab; verbindlich ist immer sein Angebot.',
    ],
    ablauf: [
      { title: 'Prüfpflicht klären', text: 'Vermietet? Zentraler Speicher über 400 Liter oder mehr als drei Liter Leitungsinhalt bis zur Entnahmestelle? Dann ist die Prüfung Pflicht.' },
      { title: 'Probenahme', text: 'Fachbetrieb entnimmt Proben an definierten Stellen (Speicherausgang, Zirkulation, entfernteste Entnahmestelle).' },
      { title: 'Laborauswertung', text: 'Akkreditiertes Labor analysiert; das Ergebnis liegt nach einigen Tagen vor und wird dokumentiert.' },
      { title: 'Maßnahmen bei Befund', text: 'Je nach Konzentration: Information der Nutzer, thermische Desinfektion, Ursachenanalyse — und Nachprüfung.' },
    ],
    prüfpunkte: [
      'Wie groß ist der Warmwasserspeicher und ist das Gebäude vermietet?',
      'Ist die Speichertemperatur auf mindestens 60 °C eingestellt?',
      'Gibt es selten genutzte Leitungen (Gästebad, Keller, Garten)?',
      'Wann wurde zuletzt geprüft und liegt das Protokoll in der Hausakte?',
    ],
    faqs: [
      { q: 'Gilt die Pflicht auch für mein selbstgenutztes Einfamilienhaus?', a: 'Nein. Die Prüfpflicht betrifft vermietete Gebäude mit Großanlagen. Vorbeugen — Speicher heiß genug, Leitungen regelmäßig spülen — lohnt sich aber überall.' },
      { q: 'Kann ich die Speichertemperatur zum Energiesparen senken?', a: 'Unter 60 °C steigt das Legionellenrisiko. Energie sparst du sicherer über Dämmung der Leitungen und eine bedarfsgerechte Zirkulationssteuerung.' },
      { q: 'Was passiert bei einem positiven Befund?', a: 'Abhängig vom Wert: Ab bestimmten Konzentrationen besteht Informations- und Handlungspflicht. Der Partnerbetrieb begleitet Desinfektion, Ursachensuche und Nachprüfung.' },
    ],
    related: [
      { href: '/leistungen/sanitaer-wasser', label: 'Sanitär & Wasser als Leistung' },
      { href: '/lexikon/rueckstauklappe', label: 'Lexikon: Rückstauklappe' },
      { href: '/hausakte', label: 'Hausakte: Prüfprotokolle dauerhaft ablegen' },
    ],
    verwandt: ['rueckstauklappe', 'hausakte'],
    leistung: { href: '/leistungen/sanitaer-wasser', label: 'Sanitär & Wasser' },
  },
  {
    slug: 'rueckstauklappe',
    begriff: 'Rückstauklappe',
    title: 'Rückstauklappe: Schutz vor Wasser aus dem Kanal',
    description: 'Warum Keller bei Starkregen volllaufen, was eine Rückstausicherung leistet und wie Wartung und Versicherung zusammenhängen.',
    definition: 'Eine Rückstauklappe verhindert, dass Abwasser bei Überlastung des öffentlichen Kanals zurück ins Haus drückt. Alle Abläufe unterhalb der Rückstauebene — meist der Straßenoberkante — müssen gesichert sein.',
    kategorie: 'sanitaer-wasser',
    kurz: 'Verhindert, dass bei Starkregen der Kanal rückwärts in deinen Keller läuft — Pflicht unterhalb der Rückstauebene.',
    relevanz: 'pflicht',
    synonyme: ['Rückstausicherung', 'Rückstauverschluss', 'Hebeanlage (Alternative)'],
    wannHandeln: 'Wenn Keller-Abläufe, Waschmaschine oder WC unterhalb der Straßenoberkante liegen — spätestens vor der nächsten Starkregensaison.',
    stufen: { kosten: 2, aufwand: 2, dringlichkeit: 4 },
    kennzahlen: [
      { label: 'Wartung', value: '2× jährlich', hint: 'Sichtprüfung, 1× durch Fachbetrieb' },
      { label: 'Versicherung', value: 'Nachweis nötig', hint: 'Elementarschutz setzt Sicherung voraus' },
      { label: 'Zuständig', value: 'Eigentümer', hint: 'Kommune haftet nicht für Rückstau' },
    ],
    kosten: [
      'Eine Rückstauklappe inklusive Einbau liegt meist im mittleren dreistelligen bis niedrigen vierstelligen Euro-Bereich.',
      'Eine Hebeanlage ist teurer, aber nötig, wenn Räume unterhalb der Rückstauebene dauerhaft genutzt werden.',
      'Wartung und Prüfprotokoll sind laufende Kosten im niedrigen dreistelligen Bereich pro Jahr.',
    ],
    ablauf: [
      { title: 'Rückstauebene ermitteln', text: 'Welche Abläufe liegen unter der Straßenoberkante? Bodenablauf, Waschküche, Kellerdusche, Gäste-WC.' },
      { title: 'Lösung wählen', text: 'Rückstauklappe für selten genutzte Abläufe, Hebeanlage für dauerhaft genutzte Räume — der Betrieb ordnet ein.' },
      { title: 'Einbauen', text: 'Einbau in die Grundleitung oder als Bodenablauf mit integriertem Verschluss; Zugang für Wartung freihalten.' },
      { title: 'Warten und nachweisen', text: 'Regelmäßig prüfen, jährlich durch Fachbetrieb; Protokolle in die Hausakte für den Versicherungsfall.' },
    ],
    prüfpunkte: [
      'Gibt es Abläufe im Keller oder Souterrain?',
      'Ist eine Rückstausicherung vorhanden und wann wurde sie zuletzt gewartet?',
      'Verlangt die Elementarschadenversicherung einen Nachweis?',
      'Stand nach Starkregen schon einmal Wasser im Keller?',
    ],
    faqs: [
      { q: 'Zahlt die Versicherung bei Rückstau?', a: 'Nur mit Elementarschutz und häufig nur, wenn eine funktionsfähige Rückstausicherung nachgewiesen wird. Ohne Wartungsnachweis kann die Leistung gekürzt werden.' },
      { q: 'Reicht eine Klappe für das ganze Haus?', a: 'Nicht immer. Fäkalienhaltiges Abwasser braucht andere Sicherungen als Regen- oder Grauwasser. Der Fachbetrieb prüft die Leitungsführung.' },
      { q: 'Klappe oder Hebeanlage?', a: 'Klappe für selten genutzte Abläufe ohne dauerhaften Aufenthalt darunter; Hebeanlage, wenn Räume unter der Rückstauebene bewohnt oder regelmäßig genutzt werden.' },
    ],
    related: [
      { href: '/leistungen/sanitaer-wasser', label: 'Sanitär & Wasser als Leistung' },
      { href: '/versicherung', label: 'Versicherung: Elementarschutz und Nachweise' },
      { href: '/notfall', label: 'Notfall: Wasser im Keller' },
    ],
    verwandt: ['legionellenpruefung', 'verkehrssicherungspflicht', 'instandhaltungsruecklage'],
    leistung: { href: '/leistungen/sanitaer-wasser', label: 'Sanitär & Wasser' },
  },
  {
    slug: 'dachinspektion',
    begriff: 'Dachinspektion',
    title: 'Dachinspektion: Intervall, Umfang, Kostenrahmen',
    description: 'Was eine Dachinspektion umfasst, wie oft sie sinnvoll ist und warum sie günstiger ist als der erste Wasserfleck.',
    definition: 'Die Dachinspektion ist eine systematische Sichtprüfung von Eindeckung, Anschlüssen, Rinnen, Durchdringungen und Dämmung durch den Dachdecker. Sie erkennt lose Ziegel, undichte Anschlüsse und verstopfte Entwässerung, bevor Wasser ins Haus gelangt.',
    kategorie: 'dach-gebaeudehuelle',
    kurz: 'Regelmäßiger Blick aufs Dach durch den Fachbetrieb — findet Schäden, bevor sie an der Decke sichtbar werden.',
    relevanz: 'empfohlen',
    synonyme: ['Dachwartung', 'Dachcheck', 'Dachbegehung'],
    wannHandeln: 'Jährlich nach dem Winter, nach Sturmereignissen und immer, wenn du Wasserflecken, lose Ziegel oder Moosbewuchs bemerkst.',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Intervall', value: 'jährlich', hint: 'Zusätzlich nach Sturm' },
      { label: 'Dauer', value: '1–2 Stunden', hint: 'Mit Drohne oder Begehung' },
      { label: 'Versicherung', value: 'Nachweis hilft', hint: 'Bei Sturmschäden relevant' },
    ],
    kosten: [
      'Eine Inspektion liegt meist im niedrigen dreistelligen Euro-Bereich; Wartungsverträge bündeln Inspektion und Kleinreparaturen.',
      'Kleinreparaturen wie einzelne Ziegel oder Rinnenreinigung werden separat angeboten und liegen meist im niedrigen bis mittleren dreistelligen Bereich.',
      'Der Partnerbetrieb nennt den Rahmen vorab; nichts wird ohne deine Entscheidung repariert.',
    ],
    ablauf: [
      { title: 'Vorab prüfen', text: 'Von innen: Dachboden auf Feuchtespuren, Lichteinfall und Verfärbungen kontrollieren. Fotos in die Hausakte.' },
      { title: 'Inspektion', text: 'Dachdecker prüft Eindeckung, First, Kehlen, Kamin- und Fensteranschlüsse, Rinnen und Fallrohre.' },
      { title: 'Befund und Empfehlung', text: 'Du erhältst eine priorisierte Liste: sofort, in dieser Saison, beobachten — mit Kostenrahmen je Punkt.' },
      { title: 'Turnus festlegen', text: 'Termin für das nächste Jahr in der Hausakte hinterlegen; nach Stürmen zusätzlich prüfen lassen.' },
    ],
    prüfpunkte: [
      'Wann war der Dachdecker zuletzt auf dem Dach?',
      'Gibt es Moos, verrutschte Ziegel oder überlaufende Rinnen?',
      'Ist der Dachboden nach Regen trocken und geruchsneutral?',
      'Sind Kamin- und Dachfensteranschlüsse dicht (typische Schwachstellen)?',
    ],
    faqs: [
      { q: 'Wie oft sollte ein Dach geprüft werden?', a: 'Einmal jährlich ist ein guter Rhythmus, dazu nach jedem stärkeren Sturm. Ältere Dächer und Flachdächer profitieren von engeren Intervallen.' },
      { q: 'Kann ich das Dach selbst prüfen?', a: 'Von innen und vom Boden aus ja: Dachboden, Rinnen, Sichtbefund. Das Betreten des Dachs gehört zum Fachbetrieb — aus Sicherheits- und Haftungsgründen.' },
      { q: 'Lohnt sich ein Wartungsvertrag?', a: 'Wenn er Inspektion, Rinnenreinigung und kleine Reparaturen bündelt, häufig ja. Der Nachweis regelmäßiger Wartung stärkt zudem deine Position gegenüber der Versicherung.' },
    ],
    related: [
      { href: '/leistungen/dach-fenster-tueren', label: 'Dach, Fenster & Türen als Leistung' },
      { href: '/lexikon/verkehrssicherungspflicht', label: 'Lexikon: Verkehrssicherungspflicht' },
      { href: '/leistungen/saisonale-dienste', label: 'Saisonale Dienste: Rinnenreinigung & Co.' },
    ],
    verwandt: ['u-wert', 'verkehrssicherungspflicht', 'instandhaltungsruecklage'],
    leistung: { href: '/leistungen/dach-fenster-tueren', label: 'Dach, Fenster & Türen' },
  },
  {
    slug: 'feuerstaettenschau',
    begriff: 'Feuerstättenschau',
    title: 'Feuerstättenschau: Pflicht, Ablauf, Unterschied zur Kehrung',
    description: 'Was der bevollmächtigte Bezirksschornsteinfeger bei der Feuerstättenschau prüft und wie sich Feuerstättenbescheid und Kehrung unterscheiden.',
    definition: 'Die Feuerstättenschau ist die hoheitliche Prüfung aller Feuerstätten, Abgasanlagen und Lüftungsanlagen eines Gebäudes durch den bevollmächtigten Bezirksschornsteinfeger. Sie findet zweimal in sieben Jahren statt und mündet im Feuerstättenbescheid, der die weiteren Pflichttermine festlegt.',
    kategorie: 'recht-pflichten',
    kurz: 'Hoheitliche Prüfung deiner Heizung, Kamine und Abgaswege — zweimal in sieben Jahren, mit Bescheid über alle weiteren Pflichten.',
    relevanz: 'pflicht',
    synonyme: ['Feuerstättenbescheid', 'Schornsteinfegerprüfung', 'Kehr- und Überprüfungsordnung'],
    wannHandeln: 'Wenn der Termin angekündigt wird oder sich an Feuerstätten etwas ändert (neuer Kaminofen, Heizungstausch, Stilllegung).',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 3 },
    kennzahlen: [
      { label: 'Turnus', value: '2× in 7 Jahren', hint: 'Termin wird angekündigt' },
      { label: 'Ergebnis', value: 'Feuerstättenbescheid', hint: 'Listet alle Pflichttermine' },
      { label: 'Zuständig', value: 'Bezirksschornsteinfeger', hint: 'Nicht frei wählbar' },
    ],
    kosten: [
      'Die Gebühren sind bundesweit über die Kehr- und Überprüfungsordnung geregelt und liegen im zweistelligen bis niedrigen dreistelligen Euro-Bereich.',
      'Kehrungen und Abgasmessungen aus dem Feuerstättenbescheid dürfen bei einem frei gewählten Schornsteinfeger beauftragt werden.',
      'Festgestellte Mängel sind fristgebunden zu beheben — hier greift der Partnerbetrieb mit Kostenrahmen.',
    ],
    ablauf: [
      { title: 'Termin annehmen', text: 'Der bevollmächtigte Bezirksschornsteinfeger kündigt den Termin an; Zugang zu Heizraum, Kaminen und Dachboden vorbereiten.' },
      { title: 'Prüfung', text: 'Feuerstätten, Abgasanlagen, Verbrennungsluftversorgung und ggf. Lüftungsanlagen werden auf Betriebs- und Brandsicherheit geprüft.' },
      { title: 'Bescheid', text: 'Der Feuerstättenbescheid legt fest, welche Arbeiten (Kehrung, Messung, Überprüfung) in welchem Intervall fällig sind.' },
      { title: 'Ablegen und terminieren', text: 'Bescheid in die Hausakte, Termine hinterlegen; Mängel fristgerecht durch Fachbetrieb beheben lassen.' },
    ],
    prüfpunkte: [
      'Liegt der aktuelle Feuerstättenbescheid vor und sind die Termine bekannt?',
      'Wurde eine Feuerstätte verändert, neu eingebaut oder stillgelegt, ohne den Schornsteinfeger zu informieren?',
      'Sind Mängel aus dem letzten Bescheid behoben und nachgewiesen?',
      'Ist der Zugang zu Kaminreinigungsöffnungen frei?',
    ],
    faqs: [
      { q: 'Kann ich meinen Schornsteinfeger frei wählen?', a: 'Für die hoheitlichen Aufgaben (Feuerstättenschau, Bescheid, Bauabnahme) nicht — dafür ist der Bezirksschornsteinfeger zuständig. Kehrungen und Messungen kannst du frei vergeben.' },
      { q: 'Was passiert, wenn Mängel festgestellt werden?', a: 'Sie werden mit Frist im Bescheid vermerkt. Bei Gefahr im Verzug kann eine Feuerstätte stillgelegt werden. Beschreib den Mangel als Anliegen — der Partnerbetrieb übernimmt mit Kostenrahmen.' },
      { q: 'Muss ich anwesend sein?', a: 'Jemand muss Zugang gewähren. Du kannst eine Vertrauensperson benennen; der Bescheid geht anschließend an dich als Eigentümer.' },
    ],
    related: [
      { href: '/lexikon/heizungsgesetz', label: 'Lexikon: Heizungsgesetz (GEG)' },
      { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
      { href: '/hausakte', label: 'Hausakte: Bescheide und Fristen im Blick' },
    ],
    verwandt: ['heizungsgesetz', 'hausakte', 'verkehrssicherungspflicht'],
    leistung: { href: '/leistungen/heizung', label: 'Heizung als Leistung' },
  },
  {
    slug: 'verkehrssicherungspflicht',
    begriff: 'Verkehrssicherungspflicht',
    title: 'Verkehrssicherungspflicht: was Eigentümer absichern müssen',
    description: 'Gehweg, Bäume, Dach, Treppen: Welche Gefahren Eigentümer abwenden müssen, wie sie nachweisen und was die Haftpflicht abdeckt.',
    definition: 'Die Verkehrssicherungspflicht verpflichtet Eigentümer, zumutbare Vorkehrungen gegen Gefahren zu treffen, die von ihrem Grundstück ausgehen — Winterdienst, standsichere Bäume, gesicherte Dachziegel, beleuchtete Wege. Wer sie verletzt, haftet für Schäden.',
    kategorie: 'recht-pflichten',
    kurz: 'Deine Pflicht, Gefahren vom Grundstück abzuwenden — vom Glatteis auf dem Gehweg bis zum morschen Ast.',
    relevanz: 'pflicht',
    synonyme: ['Sicherungspflicht', 'Räum- und Streupflicht', 'Baumkontrolle'],
    wannHandeln: 'Saisonal vor dem Winter (Räumdienst), jährlich für Baumkontrolle und nach jedem Sturm für Dach und Zaun.',
    stufen: { kosten: 2, aufwand: 2, dringlichkeit: 3 },
    kennzahlen: [
      { label: 'Winterdienst', value: 'ortsübliche Zeiten', hint: 'Meist ab 7 Uhr werktags' },
      { label: 'Baumkontrolle', value: '1–2× jährlich', hint: 'Belaubt und unbelaubt' },
      { label: 'Nachweis', value: 'Kontrollprotokoll', hint: 'Datum, Umfang, Ergebnis' },
    ],
    kosten: [
      'Räumdienst, Baumkontrolle oder Dachcheck durch Partnerbetriebe bewegen sich je nach Umfang im niedrigen bis mittleren dreistelligen Bereich pro Saison.',
      'Erforderliche Maßnahmen (Baumschnitt, Ziegel sichern, Beleuchtung) werden separat mit Kostenrahmen angeboten.',
      'Deutlich teurer ist ein Haftungsfall ohne Nachweis — die Haus- und Grundbesitzerhaftpflicht deckt, wenn Pflichten dokumentiert sind.',
    ],
    ablauf: [
      { title: 'Gefahrenquellen erfassen', text: 'Gehweg, Zufahrt, Treppen, Bäume, Dach, Zäune, Spielgeräte — einmal systematisch durchs Grundstück gehen.' },
      { title: 'Zuständigkeiten klären', text: 'Was übernimmst du selbst, was ein Dienstleister? Bei Vermietung: Pflichten können übertragen werden, Kontrolle bleibt bei dir.' },
      { title: 'Turnus festlegen', text: 'Winterdienstplan, Baumkontrolle und Dachcheck als wiederkehrende Termine in der Hausakte hinterlegen.' },
      { title: 'Dokumentieren', text: 'Kontrollen mit Datum und Ergebnis festhalten — im Schadensfall ist das Protokoll dein Nachweis.' },
    ],
    prüfpunkte: [
      'Ist der Winterdienst für alle Tage geregelt — auch im Urlaub und bei Krankheit?',
      'Wurden Bäume in den letzten zwölf Monaten auf Standsicherheit geprüft?',
      'Sind Wege und Eingänge ausreichend beleuchtet und trittsicher?',
      'Ist eine Haus- und Grundbesitzerhaftpflicht vorhanden (bei vermieteten Objekten Pflicht-Baustein)?',
    ],
    faqs: [
      { q: 'Kann ich die Pflicht auf Mieter übertragen?', a: 'Teilweise, etwa den Winterdienst per Mietvertrag. Die Kontrollpflicht bleibt jedoch bei dir: Du musst prüfen, ob der Mieter seiner Aufgabe nachkommt.' },
      { q: 'Wie weit reicht die Pflicht bei Bäumen?', a: 'Regelmäßige Sichtkontrolle auf Totholz, Pilzbefall und Schräglage ist zumutbar. Bei Auffälligkeiten ist ein Baumsachverständiger hinzuzuziehen.' },
      { q: 'Was zahlt die Haftpflicht?', a: 'Personen- und Sachschäden Dritter, wenn du deine Pflichten nicht grob fahrlässig verletzt hast. Dokumentierte Kontrollen sind dabei dein wichtigstes Argument.' },
    ],
    related: [
      { href: '/leistungen/saisonale-dienste', label: 'Saisonale Dienste: Winterdienst & Co.' },
      { href: '/leistungen/garten-aussenbereich', label: 'Garten & Außenbereich: Baumpflege' },
      { href: '/lexikon/dachinspektion', label: 'Lexikon: Dachinspektion' },
    ],
    verwandt: ['dachinspektion', 'rueckstauklappe', 'hausakte'],
    leistung: { href: '/leistungen/saisonale-dienste', label: 'Saisonale Dienste' },
  },
  {
    slug: 'hausakte',
    begriff: 'Hausakte',
    title: 'Hausakte: das Gedächtnis deines Hauses',
    description: 'Was in eine Hausakte gehört, warum sie beim Verkauf bares Geld wert ist und wie du sie ohne Aufwand führst.',
    definition: 'Die Hausakte sammelt alle Unterlagen, Termine und Entscheidungen zu einem Gebäude an einem Ort: Pläne, Protokolle, Rechnungen, Wartungsintervalle, Ansprechpartner. Sie macht Wissen unabhängig von Personen und Zufall.',
    kategorie: 'hausakte-organisation',
    kurz: 'Alle Unterlagen, Termine und Entscheidungen zu deinem Haus an einem Ort — nachvollziehbar für dich, Handwerker und Käufer.',
    relevanz: 'empfohlen',
    synonyme: ['Gebäudeakte', 'Hausdokumentation', 'Objektakte'],
    wannHandeln: 'Ab dem Tag des Einzugs — und spätestens, wenn du zum zweiten Mal nach dem letzten Wartungsprotokoll suchst.',
    stufen: { kosten: 1, aufwand: 1, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Inhalt', value: 'Pläne · Protokolle · Fristen', hint: 'Plus Kontakte und Entscheidungen' },
      { label: 'Nutzen', value: 'Verkauf & Versicherung', hint: 'Lückenlose Historie zählt' },
      { label: 'Pflege', value: 'nach jedem Termin', hint: 'Protokoll direkt ablegen' },
    ],
    kosten: [
      'Die digitale Hausakte von Einfach Hausen ist im kostenlosen Hauskonto enthalten.',
      'Der eigentliche Aufwand ist Disziplin: nach jedem Handwerkertermin Protokoll und Rechnung ablegen.',
      'Kosten entstehen nicht durch die Akte, sondern ohne sie — bei Doppelarbeit, verpassten Fristen und Preisabschlägen beim Verkauf.',
    ],
    ablauf: [
      { title: 'Grundstock anlegen', text: 'Kaufvertrag, Pläne, Energieausweis, Feuerstättenbescheid, Versicherungspolicen — was da ist, kommt rein.' },
      { title: 'Anlagen erfassen', text: 'Heizung, Elektro, Dach, Wasser: Baujahr, Hersteller, letzter Service. Ein Typenschild-Foto pro Anlage reicht für den Anfang.' },
      { title: 'Fristen hinterlegen', text: 'Wartung, Prüfung, Versicherung, Schornsteinfeger — die Akte erinnert, bevor etwas fällig wird.' },
      { title: 'Laufend ergänzen', text: 'Jeder Auftrag über Einfach Hausen landet automatisch mit Befund, Angebot und Ergebnis in der Akte.' },
    ],
    prüfpunkte: [
      'Findest du das letzte Heizungs-Wartungsprotokoll in unter einer Minute?',
      'Weißt du, wann der Energieausweis abläuft?',
      'Sind Ansprechpartner für Heizung, Elektro und Dach mit Kontaktdaten hinterlegt?',
      'Würde ein Käufer die Historie des Hauses lückenlos nachvollziehen können?',
    ],
    faqs: [
      { q: 'Reicht ein Ordner im Schrank?', a: 'Besser als nichts. Digital hast du Erinnerungen, Suchfunktion und kannst Unterlagen dem Handwerker vor dem Termin freigeben — ohne Kopieren und Suchen.' },
      { q: 'Wer sieht meine Hausakte?', a: 'Nur du. Freigaben an Partnerbetriebe oder Käufer erfolgen ausschließlich mit deiner Zustimmung und lassen sich jederzeit widerrufen.' },
      { q: 'Was bringt die Akte beim Verkauf?', a: 'Nachvollziehbare Wartung, Sanierungsnachweise und Prüfprotokolle senken die Unsicherheit für Käufer und stützen deinen Preis.' },
    ],
    related: [
      { href: '/hausakte', label: 'Die digitale Hausakte von Einfach Hausen' },
      { href: '/lexikon/instandhaltungsruecklage', label: 'Lexikon: Instandhaltungsrücklage' },
      { href: '/immobilienverkauf', label: 'Immobilienverkauf vorbereiten' },
    ],
    verwandt: ['instandhaltungsruecklage', 'energieausweis', 'e-check', 'feuerstaettenschau'],
    leistung: { href: '/hausakte', label: 'Die digitale Hausakte' },
  },
  {
    slug: 'instandhaltungsruecklage',
    begriff: 'Instandhaltungsrücklage',
    title: 'Instandhaltungsrücklage: wie viel du fürs Haus zurücklegen solltest',
    description: 'Faustregeln, Berechnungsansätze und Prioritäten für die Instandhaltungsrücklage im Eigenheim — ohne böse Überraschungen.',
    definition: 'Die Instandhaltungsrücklage ist Geld, das planmäßig für Reparaturen und Erneuerungen am Haus zurückgelegt wird. Im Wohnungseigentum ist sie Pflicht; im Einfamilienhaus ist sie freiwillig — und genauso nötig.',
    kategorie: 'hausakte-organisation',
    kurz: 'Das Budget, das verhindert, dass eine neue Heizung oder ein undichtes Dach zur Notlage wird.',
    relevanz: 'empfohlen',
    synonyme: ['Erhaltungsrücklage', 'Reparaturrücklage', 'Instandhaltungsbudget'],
    wannHandeln: 'Sofort nach dem Kauf — und immer, wenn eine große Anlage älter als 15 Jahre wird.',
    stufen: { kosten: 3, aufwand: 1, dringlichkeit: 2 },
    kennzahlen: [
      { label: 'Faustregel', value: '~1 % des Gebäudewerts', hint: 'Pro Jahr, je nach Alter mehr' },
      { label: 'Alternativ', value: 'pro m² Wohnfläche', hint: 'Gestaffelt nach Baujahr' },
      { label: 'Basis', value: 'Anlagenliste', hint: 'Restlebensdauer je Bauteil' },
    ],
    kosten: [
      'Die Rücklage selbst ist kein Verbrauch, sondern verschobenes Geld — je nach Alter und Zustand des Hauses einige Tausend Euro pro Jahr.',
      'Ohne Rücklage werden Erneuerungen häufig teurer: Notreparaturen, Finanzierungskosten oder aufgeschobene Schäden.',
      'Einfach Hausen unterstützt mit Kostenrahmen aus realen Anfrageverläufen — verbindlich ist der Rahmen des Partnerbetriebs.',
    ],
    ablauf: [
      { title: 'Anlagen und Alter erfassen', text: 'Heizung, Dach, Fenster, Elektro, Bad, Fassade: Baujahr und Zustand aus der Hausakte übernehmen.' },
      { title: 'Restlebensdauer schätzen', text: 'Typische Lebensdauern als Orientierung ansetzen; Befunde aus Inspektionen präzisieren die Schätzung.' },
      { title: 'Jahresbetrag ableiten', text: 'Erwartete Kosten je Bauteil durch Restjahre teilen und summieren — das ergibt deine realistische Jahresrücklage.' },
      { title: 'Jährlich anpassen', text: 'Nach jeder Inspektion oder Sanierung aktualisieren; erledigte Posten raus, neue Befunde rein.' },
    ],
    prüfpunkte: [
      'Weißt du, welche Anlage im Haus als Nächstes fällig wird?',
      'Gibt es ein separates Konto oder einen festen Sparplan fürs Haus?',
      'Wurde die Rücklage nach der letzten großen Investition neu berechnet?',
      'Sind Inspektionsbefunde (Dach, Heizung, Elektro) in die Planung eingeflossen?',
    ],
    faqs: [
      { q: 'Wie viel ist genug?', a: 'Die 1-%-Regel ist ein Startpunkt. Genauer wird es mit der Anlagenliste: Was kostet die Erneuerung, wann ist sie fällig? Die Hausakte liefert dafür die Basis.' },
      { q: 'Muss ich im Einfamilienhaus eine Rücklage bilden?', a: 'Rechtlich nein. Praktisch entscheidet sie darüber, ob du eine neue Heizung in Ruhe planst oder im Januar unter Druck beauftragst.' },
      { q: 'Was hat die Rücklage mit Einfach Hausen zu tun?', a: 'Wir liefern die Grundlage: Anlagenzustand, Befunde und Kostenrahmen aus echten Anfragen. Die Entscheidung über Geld und Zeitpunkt bleibt bei dir.' },
    ],
    related: [
      { href: '/lexikon/hausakte', label: 'Lexikon: Hausakte' },
      { href: '/hausakte', label: 'Die digitale Hausakte von Einfach Hausen' },
      { href: '/lexikon/dachinspektion', label: 'Lexikon: Dachinspektion' },
    ],
    verwandt: ['hausakte', 'dachinspektion', 'waermepumpe'],
    leistung: { href: '/hausakte', label: 'Die digitale Hausakte' },
  },
];

function enrich(term: LexikonTerm): LexikonEintrag {
  const extra = ENRICHMENT[term.slug];
  if (!extra) throw new Error(`Lexikon: Anreicherung für "${term.slug}" fehlt in lexikon.ts`);
  return { ...term, ...extra };
}

/** Vollständige, sortierte Liste aller Lexikon-Einträge (Pilot + Erweiterung). */
export const LEXIKON_EINTRAEGE: LexikonEintrag[] = [...LEXIKON_TERMS.map(enrich), ...NEUE_EINTRAEGE].sort((a, b) =>
  a.begriff.localeCompare(b.begriff, 'de'),
);

export function getEintrag(slug: string): LexikonEintrag | undefined {
  const decoded = safeDecode(slug);
  return LEXIKON_EINTRAEGE.find((e) => e.slug === decoded || e.slug === slug);
}

export function getKategorie(slug: string): LexikonKategorie | undefined {
  return LEXIKON_KATEGORIEN.find((k) => k.slug === slug);
}

export function eintraegeInKategorie(slug: LexikonKategorieSlug): LexikonEintrag[] {
  return LEXIKON_EINTRAEGE.filter((e) => e.kategorie === slug);
}

export function verwandteEintraege(e: LexikonEintrag): LexikonEintrag[] {
  return e.verwandt.map((s) => LEXIKON_EINTRAEGE.find((x) => x.slug === s)).filter((x): x is LexikonEintrag => Boolean(x));
}

/** Vor/Zurück in alphabetischer Reihenfolge (für den Begriffs-Navigator). */
export function nachbarn(e: LexikonEintrag): { prev: LexikonEintrag; next: LexikonEintrag } {
  const i = LEXIKON_EINTRAEGE.findIndex((x) => x.slug === e.slug);
  const n = LEXIKON_EINTRAEGE.length;
  return { prev: LEXIKON_EINTRAEGE[(i - 1 + n) % n], next: LEXIKON_EINTRAEGE[(i + 1) % n] };
}

/** Lesezeit in Minuten (≈ 200 Wörter/Minute), gerundet, min. 2. */
export function lesezeit(e: LexikonEintrag): number {
  const text = [
    e.definition,
    e.wannHandeln,
    ...e.kosten,
    ...e.ablauf.flatMap((a) => [a.title, a.text]),
    ...e.prüfpunkte,
    ...e.faqs.flatMap((f) => [f.q, f.a]),
  ].join(' ');
  return Math.max(2, Math.round(text.split(/\s+/).length / 200));
}

/** Anfangsbuchstabe für das A–Z-Register (Umlaute auf Grundbuchstaben). */
export function registerBuchstabe(begriff: string): string {
  return begriff
    .charAt(0)
    .toUpperCase()
    .replace('Ä', 'A')
    .replace('Ö', 'O')
    .replace('Ü', 'U');
}

export function alleBuchstaben(): string[] {
  return Array.from(new Set(LEXIKON_EINTRAEGE.map((e) => registerBuchstabe(e.begriff)))).sort();
}

function safeDecode(v: string): string {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/**
 * Build-Zeit-Integritätsprüfung: eindeutige Slugs, gültige Kategorien und
 * auflösbare Begriffs-Verknüpfungen. Wird aus generateStaticParams aufgerufen,
 * damit ein Datenfehler den Build bricht statt still ein 404 zu erzeugen.
 */
export function assertLexikonIntegrity(): void {
  const slugs = new Set<string>();
  const kategorien = new Set(LEXIKON_KATEGORIEN.map((k) => k.slug));
  for (const e of LEXIKON_EINTRAEGE) {
    if (slugs.has(e.slug)) throw new Error(`Lexikon: doppelter Slug "${e.slug}"`);
    slugs.add(e.slug);
    if (!kategorien.has(e.kategorie)) throw new Error(`Lexikon: unbekannte Kategorie "${e.kategorie}" in "${e.slug}"`);
  }
  for (const e of LEXIKON_EINTRAEGE) {
    for (const v of e.verwandt) {
      if (!slugs.has(v)) throw new Error(`Lexikon: "${e.slug}" verweist auf unbekannten Begriff "${v}"`);
    }
  }
}
