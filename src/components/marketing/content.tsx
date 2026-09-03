import {
  Bug,
  Droplets,
  Hammer,
  Home,
  Leaf,
  Paintbrush,
  Plug,
  Shield,
  Snowflake,
  Sparkles,
  ThermometerSun,
  Trees,
} from 'lucide-react';

/** Single source of truth for public-website content that repeats across pages. */

export const CATEGORIES = [
  { icon: Home, title: 'Haus & Technik', text: 'Kleinere Reparaturen, Montage und technische Anliegen' },
  { icon: Plug, title: 'Elektro & Smart Home', text: 'Elektroarbeiten, Wallbox, Sicherheit und Gebäudeautomation' },
  { icon: ThermometerSun, title: 'Heizung, Klima & Energie', text: 'Heizung, Wärmepumpe, Klima, Energieberatung und Wartung' },
  { icon: Droplets, title: 'Sanitär & Wasser', text: 'Sanitärarbeiten, Leitungen, Armaturen und wasserbezogene Probleme' },
  { icon: Hammer, title: 'Dach, Fenster & Türen', text: 'Dach, Dachrinne, Fenster, Türen, Schlosser und Gebäudehülle' },
  { icon: Paintbrush, title: 'Innenausbau & Sanierung', text: 'Maler, Schreiner, Boden, Renovierung und Sanierungsarbeiten' },
  { icon: Trees, title: 'Garten & Außenbereich', text: 'Gartenpflege, Heckenschnitt, Baumarbeiten und Pflasterarbeiten' },
  { icon: Leaf, title: 'Reinigung & Pflege', text: 'Hausreinigung, PV-Reinigung, Dachrinne und laufende Pflege' },
  { icon: Snowflake, title: 'Saisonale Dienste', text: 'Winterdienst und wiederkehrende Aufgaben rund ums Grundstück' },
  { icon: Bug, title: 'Spezialfälle', text: 'Schädlingsbekämpfung und weitere qualifikationsabhängige Dienste' },
  { icon: Sparkles, title: 'Umzug & Entrümpelung', text: 'Unterstützung beim Räumen, Umzug und objektbezogenen Dienstleistungen' },
  { icon: Shield, title: 'Beratung & dringende Fälle', text: 'Passende Ansprechpartner für fachliche Fragen oder dringenden Unterstützungsbedarf' },
] as const;

export const FACTS = [
  { value: '0 €', label: 'Das Hauskonto bleibt kostenlos' },
  { value: '0 %', label: 'Provision für Partnerbetriebe' },
  { value: '1', label: 'Fester Ansprechpartner pro Vorgang' },
  { value: '100 %', label: 'Deine Entscheidung vor jedem Auftrag' },
] as const;

export const PRINCIPLES = [
  { title: 'Kein Auftrag ohne dich', text: 'Wir bereiten vor, du entscheidest. Kein Termin, kein Angebot, keine Kosten ohne deine Bestätigung.' },
  { title: 'Kein Lead-Handel', text: 'Dein Anliegen wird nicht an fünf Betriebe verkauft. Ein passender Partner, ein Mensch, ein Vorgang.' },
  { title: 'Partner mit Gesicht', text: 'Jeder Betrieb wird persönlich geprüft. Du siehst, wer kommt, bevor jemand kommt.' },
  { title: 'Alles bleibt bei dir', text: 'Rechnungen, Garantien, Protokolle: alles landet in deiner Hausakte und gehört dir.' },
] as const;

export const HOME_FAQ = [
  { q: 'Kostet mich das etwas?', a: 'Das Hauskonto ist kostenlos und bleibt es. Du zahlst nur, wenn du einen Partner tatsächlich beauftragst, und zwar den Betrieb direkt, zu dem vorher genannten Kostenrahmen.' },
  { q: 'Muss ich etwas beauftragen, wenn ich ein Anliegen beschreibe?', a: 'Nein. Beschreiben ist unverbindlich. Wir sortieren, schlagen vor und holen einen Kostenrahmen ein. Ob daraus ein Auftrag wird, entscheidest nur du.' },
  { q: 'Wer kommt dann zu mir nach Hause?', a: 'Ein geprüfter Partnerbetrieb aus deiner Region. Du siehst vorher Namen, Betrieb und Kontakt deines Ansprechpartners und kannst direkt mit ihm sprechen.' },
  { q: 'Was passiert mit meinen Daten?', a: 'Sie bleiben bei dir. Wir verkaufen keine Anfragen, hosten in der EU und geben Daten nur an den Partner weiter, den du für einen Vorgang bestätigst.' },
  { q: 'Gibt es Einfach Hausen schon in meiner Region?', a: 'Wir starten regional in der Pilotphase und bauen das Partnernetz Schritt für Schritt aus. Leg dein Hauskonto an, dann siehst du direkt, was bei dir schon möglich ist.' },
] as const;
