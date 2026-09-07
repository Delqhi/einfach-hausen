/**
 * SEO-Pilot-Cluster (P1) — zentrale Content-Daten für /blog, /lexikon, /leistungen/heizung.
 * Qülle: /tmp/seo-research.md 7.1-7.3. Ton nach DESIGN.md: sachlich, ohne Superlative.
 * Kostenrahmen = Orientierung aus Anfrageverläufen, kein Angebot; verbindlich ist
 * immer der Rahmen des Partnerbetriebs vor der Entscheidung. Keine Personen,
 * keine Reviews, keine Statistiken — keine erfundenen Belege.
 */
export const CLUSTER_DATE_PUBLISHED = '2026-09-03';
export const CLUSTER_DATE_MODIFIED = '2026-09-03';

export type RelatedLink = { href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  problem: string[];
  optionen: Array<{ title: string; text: string }>;
  kosten: string[];
  prüfpunkte: string[];
  entscheidung: string[];
  faqs: Array<{ q: string; a: string }>;
  related: RelatedLink[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'heizung-wartung-kosten',
    title: 'Heizungswartung: was sie bringt und was sie kostet',
    description:
      'Wartung der Heizung einordnen: Ablauf, Kostenrahmen und Entscheidungshilfe — mit Prüfpunkten aus der Einfach-Hausen-Einordnung.',
    problem: [
      'Die Heizung läuft, aber niemand hat in letzter Zeit hingeschaut: Geräusche, ungleiche Wärme oder steigender Verbrauch fallen oft erst auf, wenn es kalt wird.',
      'Eine Wartung klärt früh, ob Einstellungen, Verschleiß oder kleine Defekte den Betrieb beeinträchtigen — bevor daraus ein Ausfall im Winter wird.',
    ],
    optionen: [
      {
        title: 'Regelmässige Wartung durch den Fachbetrieb',
        text: 'Reinigung, Prüfung sicherheitsrelevanter Teile, Einstellung von Regelung und Brenner bzw. Wärmepumpe. Eignet sich als wiederkehrender Termin, der in der Hausakte landet.',
      },
      {
        title: 'Wartung mit hydraulischem Abgleich kombinieren',
        text: 'Wenn einzelne Räume ungleich warm werden, lohnt die Kombination: erst abgleichen lassen, was hydraulischer Abgleich bedeutet, dann warten. Spart einen zweiten Termin.',
      },
      {
        title: 'Nur gezielt prüfen lassen',
        text: 'Wenn die Anlage jung ist und läuft, reicht manchmal eine Einordnung per Beschreibung und Foto. Einfach Hausen sagt ehrlich, wenn kein Termin nötig ist.',
      },
    ],
    kosten: [
      'Ein einzelner Wartungstermin bewegt sich je nach Anlage und Aufwand meist im niedrigen dreistelligen Euro-Bereich.',
      'Ersatzteile, Zusatzarbeiten und Anfahrt kommen hinzu und stehen im Kostenrahmen des Partnerbetriebs, bevor du entscheidest.',
      'Die Einordnung durch Einfach Hausen — Beschreiben, Zuordnen, Vorschlag mit Kostenrahmen — kostet dich nichts.',
    ],
    prüfpunkte: [
      'Baujahr, Hersteller und Typ der Anlage notieren (Foto vom Typenschild hilft).',
      'Auffälligkeiten sammeln: Geräusche, Fehlermeldungen, kalte Heizkörper, Verbrauchsanstieg.',
      'Letztes Wartungsprotokoll heraussuchen — landet danach in der Hausakte.',
      'Zugang zum Heizraum und Absperrungen freihalten, damit der Termin kurz bleibt.',
    ],
    entscheidung: [
      'Wenn die letzte Wartung länger als ein Jahr her ist oder Auffälligkeiten bestehen: Termin als Anliegen beschreiben.',
      'Wenn alles läuft und die Anlage jung gewartet ist: Erinnerung in der Hausakte setzen statt sofort zu beauftragen.',
      'In beiden Fällen siehst du vorher Partner, Kostenrahmen und Ansprechpartner — erst dann entscheidest du.',
    ],
    faqs: [
      {
        q: 'Wie oft sollte die Heizung gewartet werden?',
        a: 'Als Richtwert einmal im Jahr, vor der Heizperiode. Massgeblich sind Herstellerangabe und Zustand der Anlage — der Partnerbetrieb ordnet das beim Termin ein.',
      },
      {
        q: 'Was muss ich für den Wartungstermin vorbereiten?',
        a: 'Typenschild fotografieren, Auffälligkeiten notieren, letztes Protokoll bereitlegen, Zugang freihalten. Der Rest passiert vor Ort.',
      },
      {
        q: 'Löst die Anfrage automatisch einen Auftrag aus?',
        a: 'Nein. Du beschreibst, wir ordnen zu und nennen Partner plus Kostenrahmen. Ein Auftrag entsteht nur mit deiner Bestätigung.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Heizung als Leistung: Einordnung, Partner und Ablauf' },
      { href: '/lexikon/hydraulischer-abgleich', label: 'Lexikon: hydraulischer Abgleich erklärt' },
      { href: '/lexikon/heizungsgesetz', label: 'Lexikon: Heizungsgesetz (GEG) im Überblick' },
    ],
  },
  {
    slug: 'bad-sanierung-ablauf',
    title: 'Bad-Sanierung: Ablauf in Schritten, Kostenrahmen, Entscheidungen',
    description:
      'Eine Bad-Sanierung Schritt für Schritt: von der Bestandsaufnahme über Optionen und Kostenrahmen bis zur Entscheidung mit Partnerbetrieb.',
    problem: [
      'Fugen werden schwarz, Armaturen tropfen, der Grundriss passt nicht mehr: Ein Bad wird selten auf einmal kaputt, sondern in kleinen Stellen.',
      'Die Sanierung scheitert meist nicht am Handwerk, sondern an unklarer Reihenfolge — was zürst, was zusammen, was später.',
    ],
    optionen: [
      {
        title: 'Teilsanierung: Oberflächen und Armaturen',
        text: 'Fugen erneuern, Silikon tauschen, Armaturen und Keramik ersetzen. Passt, wenn Leitungen und Abdichtung in Ordnung sind und der Grundriss bleibt.',
      },
      {
        title: 'Komplettsanierung: Grundriss und Leitungen neu',
        text: 'Rückbau bis auf Rohbau, Leitungen, Abdichtung, Fliesen und Ausstattung neu. Nötig bei alten Leitungen, Feuchteschäden oder neuem Grundriss.',
      },
      {
        title: 'Schrittweise vorgehen',
        text: 'Erst Schaden und Substanz klären, dann entscheiden: Was muss jetzt, was kann warten. Die Hausakte hält fest, was schon geprüft wurde.',
      },
    ],
    kosten: [
      'Die Spanne ist groß, weil jedes Bad anders ist: Oberflächen und Armaturen liegen deutlich unter einer Komplettsanierung mit neuen Leitungen.',
      'Verbindlich wird es erst mit Aufmass vor Ort — der Partnerbetrieb nennt einen Kostenrahmen, bevor du entscheidest.',
      'Halte Materialwünsche und Grundriss beim Beschreiben fest: Beides treibt den Rahmen am stärksten.',
    ],
    prüfpunkte: [
      'Fotos von Schadenstellen, Armaturen und dem gesamten Raum mitschicken.',
      'Alter von Leitungen, Fliesen und Abdichtung notieren, soweit bekannt.',
      'Wünsche sortieren: Muss (Schaden), Soll (Komfort), Kann (Optik).',
      'Klären, ob das Bad während der Arbeiten nutzbar bleiben muss.',
    ],
    entscheidung: [
      'Wenn Feuchte, Schimmel oder alte Leitungen im Spiel sind: Substanz zürst klären lassen, dann Umfang festlegen.',
      'Wenn es um Optik und Komfort geht: Teilsanierung anfragen und bewusst gegen Komplettsanierung abwägen.',
      'Erst bei Partner, Kostenrahmen und Termin zustimmen — nicht vorher.',
    ],
    faqs: [
      {
        q: 'Wie lange daürt eine Bad-Sanierung?',
        a: 'Das hängt von Umfang, Materialverfügbarkeit und Trocknungszeiten ab. Der Partnerbetrieb nennt dir Daür und Reihenfolge im Angebot — frage gezielt nach Trocknungs- und Lieferzeiten.',
      },
      {
        q: 'Kann ich das Bad währenddessen nutzen?',
        a: 'Bei Teilsanierungen oft eingeschränkt, bei Komplettsanierungen meist nicht. Halte das beim Beschreiben fest, damit Planung und Kostenrahmen passen.',
      },
      {
        q: 'Was gehört in die erste Beschreibung?',
        a: 'Fotos, Alter soweit bekannt, deine Muss-Soll-Kann-Liste und ob das Bad nutzbar bleiben muss. Das reicht für die Einordnung.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: so läuft die Organisation ab' },
      { href: '/lexikon/lüftungsanlage', label: 'Lexikon: Lüftungsanlage gegen Feuchte im Bad' },
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklassen und was sie bedeuten' },
    ],
  },
  {
    slug: 'schimmel-vorgehen',
    title: 'Schimmel in der Wohnung: ruhig vorgehen in vier Schritten',
    description:
      'Schimmel einordnen statt raten: Befall einschätzen, Ursache suchen, beseitigen lassen und vorbeugen — mit Partnerbetrieb und Hausakte.',
    problem: [
      'Schwarze Flecken an Fuge, Fenster oder Wand sorgen schnell für Unruhe — und für Aktionismus: Überstreichen hilft nicht, wenn Feuchte die Ursache ist.',
      'Sinnvoll ist eine feste Reihenfolge: Befall einschätzen, Ursache suchen, dann erst beseitigen und vorbeugen.',
    ],
    optionen: [
      {
        title: 'Kleine oberflächliche Stellen selbst behandeln',
        text: 'Glatte, kleine Flächen lassen sich oft reinigen und trocken halten. Voraussetzung: Die Ursache (Lüften, Heizen, Wärmebrücke) ist verstanden und abgestellt.',
      },
      {
        title: 'Fachbetrieb reinigen und Ursache klären lassen',
        text: 'Bei grösseren Flächen, wiederkehrendem Befall oder porösen Untergründen: Fachbetrieb dokumentiert Befall, misst Feuchte und beseitigt fachgerecht.',
      },
      {
        title: 'Bauliche Ursache angehen',
        text: 'Wenn Lüften und Heizen nicht reichen — etwa bei Wärmebrücken oder Baumängeln — gehört die Ursache in einen eigenen Vorgang mit Befund.',
      },
    ],
    kosten: [
      'Kleine Reinigungen sind überschaubar; mit Befund, Feuchtemessung und baulichen Maßnahmen steigt der Rahmen.',
      'Der Partnerbetrieb nennt Kostenrahmen erst nach Einordnung von Fotos, Fläche und Untergrund — vorher gibt es keine Zahl von uns.',
      'Wiederkehrender Befall ohne Ursachenklärung wird teurer als eine einmal gründliche Klärung.',
    ],
    prüfpunkte: [
      'Fotos mit Grössenvergleich (z. B. Münze oder Zollstock) mitschicken.',
      'Raum, Wandseite, Lüftungs- und Heizgewohnheiten notieren.',
      'Festhalten, seit wann und ob der Befall wiederkehrt.',
      'Nichts überstreichen, bevor der Befund dokumentiert ist.',
    ],
    entscheidung: [
      'Klein, glatt, einmalig, Ursache klar: reinigen, trocken halten, beobachten.',
      'Groß, porös, wiederkehrend oder Ursache unklar: als Anliegen beschreiben und Fachbetrieb einordnen lassen.',
      'Bei Gesundheitsfragen zusätzlich ärztlichen Rat einholen — wir organisieren Handwerk, keine Diagnosen.',
    ],
    faqs: [
      {
        q: 'Kann ich Schimmel einfach überstreichen?',
        a: 'Nein. Farbe verdeckt den Befall, beseitigt aber weder Ursache noch Befall im Untergrund. Erst Befund sichern, dann fachgerecht beseitigen.',
      },
      {
        q: 'Welche Fotos helfen bei der Einordnung?',
        a: 'Übersicht des Raums, Nahaufnahme mit Grössenvergleich und die betroffene Wandseite. Dazu Raum, Heiz- und Lüftungsverhalten notieren.',
      },
      {
        q: 'Wann ist ein Fachbetrieb nötig?',
        a: 'Bei großen oder wiederkehrenden Flächen, porösen Untergründen und unklarer Ursache. Dann gehören Feuchtemessung und Befund dazu.',
      },
      {
        q: 'Hilft eine Lüftungsanlage gegen Schimmel?',
        a: 'Sie kann helfen, wenn falsches oder zu seltenes Lüften die Ursache ist. Was eine Anlage leistet, steht im Lexikon unter Lüftungsanlage.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: richtig heizen und lüften' },
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklassen im Überblick' },
      { href: '/lexikon/lüftungsanlage', label: 'Lexikon: Lüftungsanlage erklärt' },
    ],
  },
];

export type LexikonTerm = {
  slug: string;
  begriff: string;
  title: string;
  description: string;
  definition: string;
  kosten: string[];
  ablauf: Array<{ title: string; text: string }>;
  prüfpunkte: string[];
  faqs: Array<{ q: string; a: string }>;
  related: RelatedLink[];
};

export const LEXIKON_TERMS: LexikonTerm[] = [
  {
    slug: 'hydraulischer-abgleich',
    begriff: 'Hydraulischer Abgleich',
    title: 'Hydraulischer Abgleich: Definition, Kosten, Ablauf',
    description:
      'Hydraulischer Abgleich einfach erklärt: Definition, Kostenrahmen, Ablauf in Schritten und häufige Fragen.',
    definition:
      'Der hydraulische Abgleich stellt ein, dass jede Heizfläche die passende Wassermenge bekommt. Nahe Heizkörper werden gedrosselt, entfernte besser versorgt. Ergebnis: gleichmässige Wärme, weniger Strömungsgeräusche, oft geringerer Energieverbrauch. Ein Fachbetrieb stellt ein und dokumentiert die Werte.',
    kosten: [
      'Orientierung: meist niedriger bis mittlerer dreistelliger Euro-Bereich je nach Anlagengrösse und Aufwand.',
      'Thermostatventile, Pumpe oder Zusatzarbeiten kommen ggf. hinzu.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Einordnung deiner Anlage.',
    ],
    ablauf: [
      { title: 'Anlage aufnehmen', text: 'Heizflächen, Rohre, Pumpe und Regelung erfassen — Typenschild-Foto hilft.' },
      { title: 'Berechnen und einstellen', text: 'Fachbetrieb berechnet Durchflussmengen und stellt Ventile sowie Pumpe ein.' },
      { title: 'Dokumentieren', text: 'Einstellwerte kommen ins Protokoll — und auf Wunsch in deine Hausakte.' },
      { title: 'Heizverhalten prüfen', text: 'Nach einigen Tagen: Werden alle Räume gleichmässig warm? Sonst nachjustieren lassen.' },
    ],
    prüfpunkte: [
      'Manche Räume nie richtig warm, andere überheizt.',
      'Strömungs- oder Pfeifgeräusche an Heizkörpern.',
      'Alte Pumpe ohne Regelung oder unbekannte Einstellwerte.',
      'Anstehende Wartung — Kombination spart einen Termin.',
    ],
    faqs: [
      {
        q: 'Woran merke ich, dass ein Abgleich fehlt?',
        a: 'Typisch sind ungleich warme Räume und Strömungsgeräusche, obwohl die Anlage läuft. Sicher klärt es die Aufnahme durch den Fachbetrieb.',
      },
      {
        q: 'Wie lange daürt der Termin?',
        a: 'Das hängt von der Zahl der Heizflächen und dem Anlagenzustand ab. Der Partner nennt Aufwand und Daür im Kostenrahmen vorab.',
      },
      {
        q: 'Was sollte ich vorbereiten?',
        a: 'Typenschild fotografieren, Zahl der Heizkörper zählen, Auffälligkeiten notieren. Das reicht für die Einordnung.',
      },
      {
        q: 'Kann ich den Abgleich mit einer Wartung verbinden?',
        a: 'Ja, das ist oft sinnvoll und spart einen Termin. Schreib beides in ein Anliegen, wir ordnen es gemeinsam zu.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Abgleich als Teil der Heizungsbetreuung' },
      { href: '/blog/heizung-wartung-kosten', label: 'Ratgeber: Heizungswartung, Kosten und Entscheidung' },
    ],
  },
  {
    slug: 'heizungsgesetz',
    begriff: 'Heizungsgesetz (GEG)',
    title: 'Heizungsgesetz (GEG): was es regelt und was zu tun ist',
    description:
      'Heizungsgesetz (GEG) sachlich eingeordnet: Definition, was es für dein Haus bedeutet, Ablauf und häufige Fragen.',
    definition:
      'Das Heizungsgesetz ist der umgangssprachliche Name für das Gebäudeenergiegesetz (GEG). Es regelt, welche Anforderungen Heizungen in Gebäuden erfüllen müssen, etwa bei Einbau, Austausch und Effizienz. Details hängen von Gebäude, Anlage und Stichtagen ab. Dein Ansprechpartner ordnet ein, was für dein Haus gilt.',
    kosten: [
      'Das Gesetz selbst kostet nichts; Kosten entstehen erst durch Maßnahmen wie Beratung, Wartung oder Anlagentausch.',
      'Welche Maßnahme sinnvoll ist, hängt von deiner Anlage ab — der Kostenrahmen kommt vom Partnerbetrieb nach Einordnung.',
      'Frage gezielt nach förderfähigen Anteilen, damit der Betrieb sie im Rahmen ausweist.',
    ],
    ablauf: [
      { title: 'Bestand klären', text: 'Anlage, Alter und Gebäude grob erfassen — Typenschild und letzte Protokolle helfen.' },
      { title: 'Einordnung einholen', text: 'Als Anliegen beschreiben; Ansprechpartner und Partnerbetrieb ordnen ein, was für dein Haus gilt.' },
      { title: 'Optionen vergleichen', text: 'Weiterbetrieb mit Wartung, Optimierung oder Austausch — mit Kostenrahmen je Option.' },
      { title: 'Entscheiden und dokumentieren', text: 'Du entscheidest; Befund und Entscheidung landen in der Hausakte.' },
    ],
    prüfpunkte: [
      'Baujahr und Typ der aktüllen Heizung.',
      'Anstehender Defekt oder geplanter Tausch als Anlass.',
      'Förderfragen früh stellen, nicht erst nach Beauftragung.',
      'Keine Panikentscheidung bei kalter Anlage — erst Einordnung, dann Auftrag.',
    ],
    faqs: [
      {
        q: 'Muss ich meine Heizung jetzt sofort tauschen?',
        a: 'Nicht automatisch. Was gilt, hängt von Anlage, Gebäude und Stichtagen ab. Lass den Bestand erst einordnen, bevor du etwas beauftragst.',
      },
      {
        q: 'Was brauche ich für die Einordnung?',
        a: 'Typ, Alter und Fotos der Anlage plus kurze Beschreibung reichen. Der Rest wird gezielt nachgefragt.',
      },
      {
        q: 'Gibt es Förderung?',
        a: 'Förderbedingungen ändern sich; frage gezielt danach, damit der Partnerbetrieb förderfähige Anteile im Kostenrahmen ausweist.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Einordnung und nächste Schritte' },
      { href: '/blog/heizung-wartung-kosten', label: 'Ratgeber: Heizungswartung als erster sinnvoller Schritt' },
    ],
  },
  {
    slug: 'lüftungsanlage',
    begriff: 'Lüftungsanlage',
    title: 'Lüftungsanlage: Arten, Kostenrahmen, Ablauf',
    description:
      'Lüftungsanlage sachlich erklärt: Definition, zentrale und dezentrale Arten, Kostenrahmen, Ablauf und FAQ.',
    definition:
      'Eine Lüftungsanlage tauscht verbrauchte Raumluft kontrolliert gegen frische Aussenluft. Zentrale Anlagen versorgen das ganze Haus über Kanäle, dezentrale einzelne Räume. Mit Wärmerückgewinnung bleibt ein Teil der Wärme im Haus. Filter werden regelmässig gewechselt.',
    kosten: [
      'Orientierung: dezentrale Geräte liegen je Raum deutlich unter einer zentralen Anlage mit Kanalnetz.',
      'Einbauaufwand, Elektroanschluss und Filterwechsel bestimmen den Rahmen mit.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Besichtigung oder Grundriss.',
    ],
    ablauf: [
      { title: 'Bedarf klären', text: 'Welche Räume sind betroffen — Bad, Schlafzimmer, ganze Etage? Feuchte- oder Schimmelthema dazu notieren.' },
      { title: 'Art wählen', text: 'Dezentral für einzelne Räume, zentral bei Sanierung oder Neubau. Der Betrieb ordnet ein, was baulich passt.' },
      { title: 'Einbaün lassen', text: 'Kernbohrung oder Kanalweg, Elektroanschluss, Inbetriebnahme mit Einweisung.' },
      { title: 'Filter pflegen', text: 'Wechselintervalle in der Hausakte hinterlegen, damit nichts vergessen wird.' },
    ],
    prüfpunkte: [
      'Beschlagene Fenster und muffige Luft trotz Lüften.',
      'Feuchte im Bad ohne Fenster oder wiederkehrender Schimmel.',
      'Lärm oder Allergien sprechen gegen Daür-Kipplüftung.',
      'Bei Sanierung: Lüftung gleich mitdenken statt nachrüsten.',
    ],
    faqs: [
      {
        q: 'Zentral oder dezentral — was passt zu mir?',
        a: 'Einzelne Problemräume sprechen für dezentral, Sanierung oder Neubau für zentral. Bauliche Gegebenheiten entscheiden — der Betrieb ordnet das ein.',
      },
      {
        q: 'Ersetzt die Anlage das Fensterlüften?',
        a: 'Sie reduziert die Notwendigkeit deutlich, ersetzt aber nicht in jeder Situation das Stosslüften. Lass dir Einweisung und Intervalle geben.',
      },
      {
        q: 'Was muss ich laufend tun?',
        a: 'Vor allem Filter wechseln und Gerät gelegentlich prüfen. Intervalle gehören in die Hausakte mit Erinnerung.',
      },
      {
        q: 'Hilft sie gegen Schimmel?',
        a: 'Wenn falsches Lüften die Ursache ist, oft ja. Bei baulichen Ursachen gehört zusätzlich ein Befund dazu.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Heizen und Lüften zusammen denken' },
      { href: '/blog/schimmel-vorgehen', label: 'Ratgeber: Schimmel ruhig und richtig angehen' },
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklassen und ihre Bedeutung' },
    ],
  },
  {
    slug: 'schimmelklasse',
    begriff: 'Schimmelklasse',
    title: 'Schimmelklassen: Einstufung, Vorgehen, Kostenrahmen',
    description:
      'Schimmelklassen sachlich erklärt: Definition, Einstufung, Kostenrahmen, Ablauf und häufige Fragen.',
    definition:
      'Schimmelklassen beschreiben, wie stark ein Befall ist — von kleinen oberflächlichen Stellen bis zu großflächigem oder wiederkehrendem Befall. Die Einstufung hilft zu entscheiden: selbst behandeln, Fachbetrieb reinigen lassen oder Ursache baulich klären. Feuchtemessung gehört zur Einordnung dazu.',
    kosten: [
      'Orientierung: Reinigung kleiner Stellen ist überschaubar; Befund mit Feuchtemessung und bauliche Ursachenklärung liegen höher.',
      'Fläche, Untergrund und Ursache bestimmen den Rahmen — Fotos helfen der Einschätzung.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Einordnung.',
    ],
    ablauf: [
      { title: 'Befall dokumentieren', text: 'Fotos mit Grössenvergleich, Raum und Wandseite festhalten — nichts überstreichen.' },
      { title: 'Einstufen lassen', text: 'Als Anliegen beschreiben; Ansprechpartner und Betrieb stufen Fläche, Untergrund und Ursache ein.' },
      { title: 'Beseitigen', text: 'Reinigung oder Sanierung je nach Klasse — mit Feuchtemessung, wo sie nötig ist.' },
      { title: 'Ursache abstellen', text: 'Lüften, Heizen oder bauliche Maßnahme; Ergebnis landet in der Hausakte.' },
    ],
    prüfpunkte: [
      'Wie groß ist die Fläche, und wächst sie?',
      'Glatter oder poröser Untergrund (Fliese, Putz, Holz, Textil)?',
      'Erster Befall oder Wiederkehr nach Reinigung?',
      'Lüftungs- und Heizverhalten sowie betroffene Wandseite.',
    ],
    faqs: [
      {
        q: 'Was bedeutet die Klasse konkret für mich?',
        a: 'Sie sagt, ob Reinigen reicht oder Befund und Ursachenklärung nötig sind. Die Einstufung trifft der Betrieb nach deinen Fotos und Angaben.',
      },
      {
        q: 'Reicht ein Foto für die Ersteinschätzung?',
        a: 'Oft ja: Übersicht, Nahaufnahme mit Grössenvergleich und Wandseite plus kurze Angaben zu Raum und Verlauf.',
      },
      {
        q: 'Wann wird es ein eigener Sanierungsvorgang?',
        a: 'Bei großen Flächen, porösen Untergründen oder baulicher Ursache. Dann gibt es Befund, Kostenrahmen und Entscheidung wie bei jedem Auftrag.',
      },
    ],
    related: [
      { href: '/blog/schimmel-vorgehen', label: 'Ratgeber: Schimmel in vier Schritten angehen' },
      { href: '/lexikon/lüftungsanlage', label: 'Lexikon: Lüftungsanlage gegen Feuchte' },
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Heizen, Lüften, Feuchte' },
    ],
  },
];
