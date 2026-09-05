import { SERVICE_CATEGORIES } from './service-catalog';

/** Single source of truth for public-website content that repeats across pages. */

export const CATEGORIES = SERVICE_CATEGORIES.map(({ icon, title, description }) => ({
  icon,
  title,
  text: description,
}));

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
