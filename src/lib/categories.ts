export type SubCategory = { id: string; title: string; sub: string };
export type Category = {
  id: string;
  title: string;
  icon: string;
  subs: SubCategory[];
};

export const categories: Category[] = [
  {
    id: "garten",
    title: "Garten & Landschaft",
    icon: "garten",
    subs: [
      { id: "gartenpflege", title: "Gartenpflege", sub: "Rasenpflege, Beete, Hecken & Strauchschnitt" },
      { id: "gartenneuanlage", title: "Gartenneuanlage", sub: "Planung, Anlage & Bepflanzung" },
      { id: "baumhecke", title: "Baum- & Heckenschnitt", sub: "Rückschnitt, Formschnitt, Entsorgung" },
      { id: "pflaster", title: "Pflasterarbeiten", sub: "Wege, Terrassen, Einfahrten" },
      { id: "bewaesserung", title: "Bewässerungssysteme", sub: "Installation & Wartung" },
    ],
  },
  {
    id: "elektro",
    title: "Elektrotechnik",
    icon: "elektro",
    subs: [
      { id: "installation", title: "Elektroinstallation", sub: "Neubau, Renovierung, Modernisierung" },
      { id: "smart-home", title: "Smart Home", sub: "Vernetzung, Steuerung, Automatisierung" },
      { id: "e-auto", title: "Wallbox & E-Mobilität", sub: "Ladestationen für Zuhause" },
      { id: "pruefung", title: "Prüfung & Wartung", sub: "E-Check, Fehlerbehebung" },
    ],
  },
  {
    id: "sanitaer",
    title: "Sanitär & Heizung",
    icon: "sanitaer",
    subs: [
      { id: "heizung", title: "Heizungsbau", sub: "Gas, Wärmepumpe, Öl" },
      { id: "bad", title: "Badrenovierung", sub: "Komplett- & Teilsanierung" },
      { id: "rohre", title: "Rohr- & Abwasser", sub: "Verlegung, Reinigung, Notdienst" },
    ],
  },
  {
    id: "dach",
    title: "Dach & Fassade",
    icon: "dach",
    subs: [
      { id: "dacheindeckung", title: "Dacheindeckung", sub: "Ziegel, Schiefer, Flachdach" },
      { id: "daemmung", title: "Dämmung", sub: "Aufsparren, Untersparren, Fassade" },
      { id: "rinne", title: "Dachrinnen & Fallrohre", sub: "Montage & Reinigung" },
    ],
  },
  {
    id: "fenster",
    title: "Fenster & Türen",
    icon: "fenster",
    subs: [
      { id: "fenstermontage", title: "Fenstermontage", sub: "Austausch & Neumontage" },
      { id: "tueren", title: "Haustüren", sub: "Sicherheit & Design" },
      { id: "rollaeden", title: "Rollläden & Beschattung", sub: "Manuell & elektrisch" },
    ],
  },
  {
    id: "reinigung",
    title: "Reinigung",
    icon: "reinigung",
    subs: [
      { id: "unterhalt", title: "Unterhaltsreinigung", sub: "Regelmäßig & zuverlässig" },
      { id: "grund", title: "Grundreinigung", sub: "Wohnungen, Häuser, Treppenhäuser" },
      { id: "fensterreinigung", title: "Fensterreinigung", sub: "Streifenfrei innen & außen" },
    ],
  },
  {
    id: "innen",
    title: "Innenausbau",
    icon: "innen",
    subs: [
      { id: "trockenbau", title: "Trockenbau", sub: "Wände, Decken, Vorhänge" },
      { id: "boeden", title: "Böden verlegen", sub: "Parkett, Laminat, Fliesen" },
      { id: "moebel", title: "Einbaumöbel", sub: "Maßanfertigungen" },
    ],
  },
  {
    id: "maler",
    title: "Malerarbeiten",
    icon: "maler",
    subs: [
      { id: "streichen", title: "Streichen & Tapezieren", sub: "Innen & außen" },
      { id: "spachtel", title: "Spachtelarbeiten", sub: "Glättung & Reparatur" },
      { id: "fassade", title: "Fassadenanstrich", sub: "Schutz & Verschönerung" },
    ],
  },
  {
    id: "pool",
    title: "Pool & Pflege",
    icon: "pool",
    subs: [
      { id: "poolbau", title: "Poolbau", sub: "Planung & Montage" },
      { id: "poolwartung", title: "Poolwartung", sub: "Wasserpflege & Technik" },
    ],
  },
  {
    id: "mehr",
    title: "Weitere Kategorien",
    icon: "mehr",
    subs: [{ id: "sonstiges", title: "Sonstige Leistungen", sub: "Beschreibe deine Leistung" }],
  },
];
