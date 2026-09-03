/**
 * SEO-Pilot-Cluster (P1) — zentrale Content-Daten fuer /blog, /lexikon, /leistungen/heizung.
 * Quelle: /tmp/seo-research.md 7.1-7.3. Ton nach DESIGN.md: sachlich, ohne Superlative.
 * Kostenrahmen = Orientierung aus Anfrageverlaeufen, kein Angebot; verbindlich ist
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
  pruefpunkte: string[];
  entscheidung: string[];
  faqs: Array<{ q: string; a: string }>;
  related: RelatedLink[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'heizung-wartung-kosten',
    title: 'Heizungswartung: was sie bringt und was sie kostet',
    description:
      'Wartung der Heizung einordnen: Ablauf, Kostenrahmen und Entscheidungshilfe — mit Pruefpunkten aus der Einfach-Hausen-Einordnung.',
    problem: [
      'Die Heizung laeuft, aber niemand hat in letzter Zeit hingeschaut: Geräusche, ungleiche Wärme oder steigender Verbrauch fallen oft erst auf, wenn es kalt wird.',
      'Eine Wartung klaert frueh, ob Einstellungen, Verschleiss oder kleine Defekte den Betrieb beeintraechtigen — bevor daraus ein Ausfall im Winter wird.',
    ],
    optionen: [
      {
        title: 'Regelmaessige Wartung durch den Fachbetrieb',
        text: 'Reinigung, Pruefung sicherheitsrelevanter Teile, Einstellung von Regelung und Brenner bzw. Waermepumpe. Eignet sich als wiederkehrender Termin, der in der Hausakte landet.',
      },
      {
        title: 'Wartung mit hydraulischem Abgleich kombinieren',
        text: 'Wenn einzelne Raeume ungleich warm werden, lohnt die Kombination: erst abgleichen lassen, was hydraulischer Abgleich bedeutet, dann warten. Spart einen zweiten Termin.',
      },
      {
        title: 'Nur gezielt pruefen lassen',
        text: 'Wenn die Anlage jung ist und laeuft, reicht manchmal eine Einordnung per Beschreibung und Foto. Einfach Hausen sagt ehrlich, wenn kein Termin noetig ist.',
      },
    ],
    kosten: [
      'Ein einzelner Wartungstermin bewegt sich je nach Anlage und Aufwand meist im niedrigen dreistelligen Euro-Bereich.',
      'Ersatzteile, Zusatzarbeiten und Anfahrt kommen hinzu und stehen im Kostenrahmen des Partnerbetriebs, bevor du entscheidest.',
      'Die Einordnung durch Einfach Hausen — Beschreiben, Zuordnen, Vorschlag mit Kostenrahmen — kostet dich nichts.',
    ],
    pruefpunkte: [
      'Baujahr, Hersteller und Typ der Anlage notieren (Foto vom Typenschild hilft).',
      'Auffaelligkeiten sammeln: Geräusche, Fehlermeldungen, kalte Heizkoerper, Verbrauchsanstieg.',
      'Letztes Wartungsprotokoll heraussuchen — landet danach in der Hausakte.',
      'Zugang zum Heizraum und Absperrungen freihalten, damit der Termin kurz bleibt.',
    ],
    entscheidung: [
      'Wenn die letzte Wartung laenger als ein Jahr her ist oder Auffaelligkeiten bestehen: Termin als Anliegen beschreiben.',
      'Wenn alles laeuft und die Anlage jung gewartet ist: Erinnerung in der Hausakte setzen statt sofort zu beauftragen.',
      'In beiden Faellen siehst du vorher Partner, Kostenrahmen und Ansprechpartner — erst dann entscheidest du.',
    ],
    faqs: [
      {
        q: 'Wie oft sollte die Heizung gewartet werden?',
        a: 'Als Richtwert einmal im Jahr, vor der Heizperiode. Massgeblich sind Herstellerangabe und Zustand der Anlage — der Partnerbetrieb ordnet das beim Termin ein.',
      },
      {
        q: 'Was muss ich fuer den Wartungstermin vorbereiten?',
        a: 'Typenschild fotografieren, Auffaelligkeiten notieren, letztes Protokoll bereitlegen, Zugang freihalten. Der Rest passiert vor Ort.',
      },
      {
        q: 'Loest die Anfrage automatisch einen Auftrag aus?',
        a: 'Nein. Du beschreibst, wir ordnen zu und nennen Partner plus Kostenrahmen. Ein Auftrag entsteht nur mit deiner Bestaetigung.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Heizung als Leistung: Einordnung, Partner und Ablauf' },
      { href: '/lexikon/hydraulischer-abgleich', label: 'Lexikon: hydraulischer Abgleich erklaert' },
      { href: '/lexikon/heizungsgesetz', label: 'Lexikon: Heizungsgesetz (GEG) im Ueberblick' },
    ],
  },
  {
    slug: 'bad-sanierung-ablauf',
    title: 'Bad-Sanierung: Ablauf in Schritten, Kostenrahmen, Entscheidungen',
    description:
      'Eine Bad-Sanierung Schritt fuer Schritt: von der Bestandsaufnahme ueber Optionen und Kostenrahmen bis zur Entscheidung mit Partnerbetrieb.',
    problem: [
      'Fugen werden schwarz, Armaturen tropfen, der Grundriss passt nicht mehr: Ein Bad wird selten auf einmal kaputt, sondern in kleinen Stellen.',
      'Die Sanierung scheitert meist nicht am Handwerk, sondern an unklarer Reihenfolge — was zuerst, was zusammen, was spaeter.',
    ],
    optionen: [
      {
        title: 'Teilsanierung: Oberflaechen und Armaturen',
        text: 'Fugen erneuern, Silikon tauschen, Armaturen und Keramik ersetzen. Passt, wenn Leitungen und Abdichtung in Ordnung sind und der Grundriss bleibt.',
      },
      {
        title: 'Komplettsanierung: Grundriss und Leitungen neu',
        text: 'Rückbau bis auf Rohbau, Leitungen, Abdichtung, Fliesen und Ausstattung neu. Noetig bei alten Leitungen, Feuchteschaeden oder neuem Grundriss.',
      },
      {
        title: 'Schrittweise vorgehen',
        text: 'Erst Schaden und Substanz klaeren, dann entscheiden: Was muss jetzt, was kann warten. Die Hausakte haelt fest, was schon geprueft wurde.',
      },
    ],
    kosten: [
      'Die Spanne ist gross, weil jedes Bad anders ist: Oberflaechen und Armaturen liegen deutlich unter einer Komplettsanierung mit neuen Leitungen.',
      'Verbindlich wird es erst mit Aufmass vor Ort — der Partnerbetrieb nennt einen Kostenrahmen, bevor du entscheidest.',
      'Halte Materialwünsche und Grundriss beim Beschreiben fest: Beides treibt den Rahmen am staerksten.',
    ],
    pruefpunkte: [
      'Fotos von Schadenstellen, Armaturen und dem gesamten Raum mitschicken.',
      'Alter von Leitungen, Fliesen und Abdichtung notieren, soweit bekannt.',
      'Wuensche sortieren: Muss (Schaden), Soll (Komfort), Kann (Optik).',
      'Klaeren, ob das Bad waehrend der Arbeiten nutzbar bleiben muss.',
    ],
    entscheidung: [
      'Wenn Feuchte, Schimmel oder alte Leitungen im Spiel sind: Substanz zuerst klaeren lassen, dann Umfang festlegen.',
      'Wenn es um Optik und Komfort geht: Teilsanierung anfragen und bewusst gegen Komplettsanierung abwaegen.',
      'Erst bei Partner, Kostenrahmen und Termin zustimmen — nicht vorher.',
    ],
    faqs: [
      {
        q: 'Wie lange dauert eine Bad-Sanierung?',
        a: 'Das haengt von Umfang, Materialverfuegbarkeit und Trocknungszeiten ab. Der Partnerbetrieb nennt dir Dauer und Reihenfolge im Angebot — frage gezielt nach Trocknungs- und Lieferzeiten.',
      },
      {
        q: 'Kann ich das Bad waehrenddessen nutzen?',
        a: 'Bei Teilsanierungen oft eingeschraenkt, bei Komplettsanierungen meist nicht. Halte das beim Beschreiben fest, damit Planung und Kostenrahmen passen.',
      },
      {
        q: 'Was gehoert in die erste Beschreibung?',
        a: 'Fotos, Alter soweit bekannt, deine Muss-Soll-Kann-Liste und ob das Bad nutzbar bleiben muss. Das reicht fuer die Einordnung.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: so laeuft die Organisation ab' },
      { href: '/lexikon/lueftungsanlage', label: 'Lexikon: Lueftungsanlage gegen Feuchte im Bad' },
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklassen und was sie bedeuten' },
    ],
  },
  {
    slug: 'schimmel-vorgehen',
    title: 'Schimmel in der Wohnung: ruhig vorgehen in vier Schritten',
    description:
      'Schimmel einordnen statt raten: Befall einschaetzen, Ursache suchen, beseitigen lassen und vorbeugen — mit Partnerbetrieb und Hausakte.',
    problem: [
      'Schwarze Flecken an Fuge, Fenster oder Wand sorgen schnell fuer Unruhe — und fuer Aktionismus: Ueberstreichen hilft nicht, wenn Feuchte die Ursache ist.',
      'Sinnvoll ist eine feste Reihenfolge: Befall einschaetzen, Ursache suchen, dann erst beseitigen und vorbeugen.',
    ],
    optionen: [
      {
        title: 'Kleine oberflaechliche Stellen selbst behandeln',
        text: 'Glatte, kleine Flaechen lassen sich oft reinigen und trocken halten. Voraussetzung: Die Ursache (Lueften, Heizen, Waermebruecke) ist verstanden und abgestellt.',
      },
      {
        title: 'Fachbetrieb reinigen und Ursache klaeren lassen',
        text: 'Bei groesseren Flaechen, wiederkehrendem Befall oder porösen Untergruenden: Fachbetrieb dokumentiert Befall, misst Feuchte und beseitigt fachgerecht.',
      },
      {
        title: 'Bauliche Ursache angehen',
        text: 'Wenn Lueften und Heizen nicht reichen — etwa bei Waermebruecken oder Baumängeln — gehoert die Ursache in einen eigenen Vorgang mit Befund.',
      },
    ],
    kosten: [
      'Kleine Reinigungen sind ueberschaubar; mit Befund, Feuchtemessung und baulichen Massnahmen steigt der Rahmen.',
      'Der Partnerbetrieb nennt Kostenrahmen erst nach Einordnung von Fotos, Flaeche und Untergrund — vorher gibt es keine Zahl von uns.',
      'Wiederkehrender Befall ohne Ursachenklärung wird teurer als eine einmal gruendliche Klaerung.',
    ],
    pruefpunkte: [
      'Fotos mit Groessenvergleich (z. B. Muenze oder Zollstock) mitschicken.',
      'Raum, Wandseite, Lueftungs- und Heizgewohnheiten notieren.',
      'Festhalten, seit wann und ob der Befall wiederkehrt.',
      'Nichts ueberstreichen, bevor der Befund dokumentiert ist.',
    ],
    entscheidung: [
      'Klein, glatt, einmalig, Ursache klar: reinigen, trocken halten, beobachten.',
      'Gross, poroes, wiederkehrend oder Ursache unklar: als Anliegen beschreiben und Fachbetrieb einordnen lassen.',
      'Bei Gesundheitsfragen zusaetzlich aerztlichen Rat einholen — wir organisieren Handwerk, keine Diagnosen.',
    ],
    faqs: [
      {
        q: 'Kann ich Schimmel einfach ueberstreichen?',
        a: 'Nein. Farbe verdeckt den Befall, beseitigt aber weder Ursache noch Befall im Untergrund. Erst Befund sichern, dann fachgerecht beseitigen.',
      },
      {
        q: 'Welche Fotos helfen bei der Einordnung?',
        a: 'Uebersicht des Raums, Nahaufnahme mit Groessenvergleich und die betroffene Wandseite. Dazu Raum, Heiz- und Lueftungsverhalten notieren.',
      },
      {
        q: 'Wann ist ein Fachbetrieb noetig?',
        a: 'Bei grossen oder wiederkehrenden Flaechen, poroesen Untergruenden und unklarer Ursache. Dann gehoeren Feuchtemessung und Befund dazu.',
      },
      {
        q: 'Hilft eine Lueftungsanlage gegen Schimmel?',
        a: 'Sie kann helfen, wenn falsches oder zu seltenes Lueften die Ursache ist. Was eine Anlage leistet, steht im Lexikon unter Lueftungsanlage.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: richtig heizen und lueften' },
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklassen im Ueberblick' },
      { href: '/lexikon/lueftungsanlage', label: 'Lexikon: Lueftungsanlage erklaert' },
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
  pruefpunkte: string[];
  faqs: Array<{ q: string; a: string }>;
  related: RelatedLink[];
};

export const LEXIKON_TERMS: LexikonTerm[] = [
  {
    slug: 'hydraulischer-abgleich',
    begriff: 'Hydraulischer Abgleich',
    title: 'Hydraulischer Abgleich: Definition, Kosten, Ablauf',
    description:
      'Hydraulischer Abgleich einfach erklaert: Definition, Kostenrahmen, Ablauf in Schritten und haeufige Fragen.',
    definition:
      'Der hydraulische Abgleich stellt ein, dass jede Heizflaeche die passende Wassermenge bekommt. Nahe Heizkoerper werden gedrosselt, entfernte besser versorgt. Ergebnis: gleichmaessige Waerme, weniger Stroemungsgeraeusche, oft geringerer Energieverbrauch. Ein Fachbetrieb stellt ein und dokumentiert die Werte.',
    kosten: [
      'Orientierung: meist niedriger bis mittlerer dreistelliger Euro-Bereich je nach Anlagengroesse und Aufwand.',
      'Thermostatventile, Pumpe oder Zusatzarbeiten kommen ggf. hinzu.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Einordnung deiner Anlage.',
    ],
    ablauf: [
      { title: 'Anlage aufnehmen', text: 'Heizflaechen, Rohre, Pumpe und Regelung erfassen — Typenschild-Foto hilft.' },
      { title: 'Berechnen und einstellen', text: 'Fachbetrieb berechnet Durchflussmengen und stellt Ventile sowie Pumpe ein.' },
      { title: 'Dokumentieren', text: 'Einstellwerte kommen ins Protokoll — und auf Wunsch in deine Hausakte.' },
      { title: 'Heizverhalten pruefen', text: 'Nach einigen Tagen: Werden alle Raeume gleichmaessig warm? Sonst nachjustieren lassen.' },
    ],
    pruefpunkte: [
      'Manche Raeume nie richtig warm, andere ueberheizt.',
      'Stroemungs- oder Pfeifgeraeusche an Heizkoerpern.',
      'Alte Pumpe ohne Regelung oder unbekannte Einstellwerte.',
      'Anstehende Wartung — Kombination spart einen Termin.',
    ],
    faqs: [
      {
        q: 'Woran merke ich, dass ein Abgleich fehlt?',
        a: 'Typisch sind ungleich warme Raeume und Stroemungsgeraeusche, obwohl die Anlage laeuft. Sicher klaert es die Aufnahme durch den Fachbetrieb.',
      },
      {
        q: 'Wie lange dauert der Termin?',
        a: 'Das haengt von der Zahl der Heizflaechen und dem Anlagenzustand ab. Der Partner nennt Aufwand und Dauer im Kostenrahmen vorab.',
      },
      {
        q: 'Was sollte ich vorbereiten?',
        a: 'Typenschild fotografieren, Zahl der Heizkoerper zaehlen, Auffaelligkeiten notieren. Das reicht fuer die Einordnung.',
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
      'Heizungsgesetz (GEG) sachlich eingeordnet: Definition, was es fuer dein Haus bedeutet, Ablauf und haeufige Fragen.',
    definition:
      'Das Heizungsgesetz ist der umgangssprachliche Name fuer das Gebaeudeenergiegesetz (GEG). Es regelt, welche Anforderungen Heizungen in Gebaeuden erfuellen muessen, etwa bei Einbau, Austausch und Effizienz. Details haengen von Gebaeude, Anlage und Stichtagen ab. Dein Ansprechpartner ordnet ein, was fuer dein Haus gilt.',
    kosten: [
      'Das Gesetz selbst kostet nichts; Kosten entstehen erst durch Massnahmen wie Beratung, Wartung oder Anlagentausch.',
      'Welche Massnahme sinnvoll ist, haengt von deiner Anlage ab — der Kostenrahmen kommt vom Partnerbetrieb nach Einordnung.',
      'Frage gezielt nach foerderfaehigen Anteilen, damit der Betrieb sie im Rahmen ausweist.',
    ],
    ablauf: [
      { title: 'Bestand klaeren', text: 'Anlage, Alter und Gebaeude grob erfassen — Typenschild und letzte Protokolle helfen.' },
      { title: 'Einordnung einholen', text: 'Als Anliegen beschreiben; Ansprechpartner und Partnerbetrieb ordnen ein, was fuer dein Haus gilt.' },
      { title: 'Optionen vergleichen', text: 'Weiterbetrieb mit Wartung, Optimierung oder Austausch — mit Kostenrahmen je Option.' },
      { title: 'Entscheiden und dokumentieren', text: 'Du entscheidest; Befund und Entscheidung landen in der Hausakte.' },
    ],
    pruefpunkte: [
      'Baujahr und Typ der aktuellen Heizung.',
      'Anstehender Defekt oder geplanter Tausch als Anlass.',
      'Foerderfragen frueh stellen, nicht erst nach Beauftragung.',
      'Keine Panikentscheidung bei kalter Anlage — erst Einordnung, dann Auftrag.',
    ],
    faqs: [
      {
        q: 'Muss ich meine Heizung jetzt sofort tauschen?',
        a: 'Nicht automatisch. Was gilt, haengt von Anlage, Gebaeude und Stichtagen ab. Lass den Bestand erst einordnen, bevor du etwas beauftragst.',
      },
      {
        q: 'Was brauche ich fuer die Einordnung?',
        a: 'Typ, Alter und Fotos der Anlage plus kurze Beschreibung reichen. Der Rest wird gezielt nachgefragt.',
      },
      {
        q: 'Gibt es Foerderung?',
        a: 'Foerderbedingungen aendern sich; frage gezielt danach, damit der Partnerbetrieb foerderfaehige Anteile im Kostenrahmen ausweist.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Einordnung und naechste Schritte' },
      { href: '/blog/heizung-wartung-kosten', label: 'Ratgeber: Heizungswartung als erster sinnvoller Schritt' },
    ],
  },
  {
    slug: 'lueftungsanlage',
    begriff: 'Lueftungsanlage',
    title: 'Lueftungsanlage: Arten, Kostenrahmen, Ablauf',
    description:
      'Lueftungsanlage sachlich erklaert: Definition, zentrale und dezentrale Arten, Kostenrahmen, Ablauf und FAQ.',
    definition:
      'Eine Lueftungsanlage tauscht verbrauchte Raumluft kontrolliert gegen frische Aussenluft. Zentrale Anlagen versorgen das ganze Haus ueber Kanaele, dezentrale einzelne Raeume. Mit Waermerueckgewinnung bleibt ein Teil der Waerme im Haus. Filter werden regelmaessig gewechselt.',
    kosten: [
      'Orientierung: dezentrale Geraete liegen je Raum deutlich unter einer zentralen Anlage mit Kanalnetz.',
      'Einbauaufwand, Elektroanschluss und Filterwechsel bestimmen den Rahmen mit.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Besichtigung oder Grundriss.',
    ],
    ablauf: [
      { title: 'Bedarf klaeren', text: 'Welche Raeume sind betroffen — Bad, Schlafzimmer, ganze Etage? Feuchte- oder Schimmelthema dazu notieren.' },
      { title: 'Art waehlen', text: 'Dezentral fuer einzelne Raeume, zentral bei Sanierung oder Neubau. Der Betrieb ordnet ein, was baulich passt.' },
      { title: 'Einbauen lassen', text: 'Kernbohrung oder Kanalweg, Elektroanschluss, Inbetriebnahme mit Einweisung.' },
      { title: 'Filter pflegen', text: 'Wechselintervalle in der Hausakte hinterlegen, damit nichts vergessen wird.' },
    ],
    pruefpunkte: [
      'Beschlagene Fenster und muffige Luft trotz Lueften.',
      'Feuchte im Bad ohne Fenster oder wiederkehrender Schimmel.',
      'Laerm oder Allergien sprechen gegen Dauer-Kipplueftung.',
      'Bei Sanierung: Lueftung gleich mitdenken statt nachruesten.',
    ],
    faqs: [
      {
        q: 'Zentral oder dezentral — was passt zu mir?',
        a: 'Einzelne Problemraeume sprechen fuer dezentral, Sanierung oder Neubau fuer zentral. Bauliche Gegebenheiten entscheiden — der Betrieb ordnet das ein.',
      },
      {
        q: 'Ersetzt die Anlage das Fensterlueften?',
        a: 'Sie reduziert die Notwendigkeit deutlich, ersetzt aber nicht in jeder Situation das Stosslueften. Lass dir Einweisung und Intervalle geben.',
      },
      {
        q: 'Was muss ich laufend tun?',
        a: 'Vor allem Filter wechseln und Geraet gelegentlich pruefen. Intervalle gehoeren in die Hausakte mit Erinnerung.',
      },
      {
        q: 'Hilft sie gegen Schimmel?',
        a: 'Wenn falsches Lueften die Ursache ist, oft ja. Bei baulichen Ursachen gehoert zusaetzlich ein Befund dazu.',
      },
    ],
    related: [
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Heizen und Lueften zusammen denken' },
      { href: '/blog/schimmel-vorgehen', label: 'Ratgeber: Schimmel ruhig und richtig angehen' },
      { href: '/lexikon/schimmelklasse', label: 'Lexikon: Schimmelklassen und ihre Bedeutung' },
    ],
  },
  {
    slug: 'schimmelklasse',
    begriff: 'Schimmelklasse',
    title: 'Schimmelklassen: Einstufung, Vorgehen, Kostenrahmen',
    description:
      'Schimmelklassen sachlich erklaert: Definition, Einstufung, Kostenrahmen, Ablauf und haeufige Fragen.',
    definition:
      'Schimmelklassen beschreiben, wie stark ein Befall ist — von kleinen oberflaechlichen Stellen bis zu grossflaechigem oder wiederkehrendem Befall. Die Einstufung hilft zu entscheiden: selbst behandeln, Fachbetrieb reinigen lassen oder Ursache baulich klaeren. Feuchtemessung gehoert zur Einordnung dazu.',
    kosten: [
      'Orientierung: Reinigung kleiner Stellen ist ueberschaubar; Befund mit Feuchtemessung und bauliche Ursachenklärung liegen hoeher.',
      'Flaeche, Untergrund und Ursache bestimmen den Rahmen — Fotos helfen der Einschaetzung.',
      'Verbindlich ist der Kostenrahmen des Partnerbetriebs nach Einordnung.',
    ],
    ablauf: [
      { title: 'Befall dokumentieren', text: 'Fotos mit Groessenvergleich, Raum und Wandseite festhalten — nichts ueberstreichen.' },
      { title: 'Einstufen lassen', text: 'Als Anliegen beschreiben; Ansprechpartner und Betrieb stufen Flaeche, Untergrund und Ursache ein.' },
      { title: 'Beseitigen', text: 'Reinigung oder Sanierung je nach Klasse — mit Feuchtemessung, wo sie noetig ist.' },
      { title: 'Ursache abstellen', text: 'Lueften, Heizen oder bauliche Massnahme; Ergebnis landet in der Hausakte.' },
    ],
    pruefpunkte: [
      'Wie gross ist die Flaeche, und waechst sie?',
      'Glatter oder poroeser Untergrund (Fliese, Putz, Holz, Textil)?',
      'Erster Befall oder Wiederkehr nach Reinigung?',
      'Lueftungs- und Heizverhalten sowie betroffene Wandseite.',
    ],
    faqs: [
      {
        q: 'Was bedeutet die Klasse konkret fuer mich?',
        a: 'Sie sagt, ob Reinigen reicht oder Befund und Ursachenklärung noetig sind. Die Einstufung trifft der Betrieb nach deinen Fotos und Angaben.',
      },
      {
        q: 'Reicht ein Foto fuer die Ersteinschaetzung?',
        a: 'Oft ja: Uebersicht, Nahaufnahme mit Groessenvergleich und Wandseite plus kurze Angaben zu Raum und Verlauf.',
      },
      {
        q: 'Wann wird es ein eigener Sanierungsvorgang?',
        a: 'Bei grossen Flaechen, poroesen Untergruenden oder baulicher Ursache. Dann gibt es Befund, Kostenrahmen und Entscheidung wie bei jedem Auftrag.',
      },
    ],
    related: [
      { href: '/blog/schimmel-vorgehen', label: 'Ratgeber: Schimmel in vier Schritten angehen' },
      { href: '/lexikon/lueftungsanlage', label: 'Lexikon: Lueftungsanlage gegen Feuchte' },
      { href: '/leistungen/heizung', label: 'Pillar-Seite Heizung: Heizen, Lueften, Feuchte' },
    ],
  },
];
