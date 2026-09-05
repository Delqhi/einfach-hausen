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
  type LucideIcon,
} from 'lucide-react';

export type ServiceCategory = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
};

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  { slug: 'haus-technik', title: 'Haus & Technik', shortTitle: 'Haus & Technik', description: 'Kleinere Reparaturen, Montage und technische Anliegen', icon: Home },
  { slug: 'elektro-smart-home', title: 'Elektro & Smart Home', shortTitle: 'Elektro & Smart Home', description: 'Elektroarbeiten, Wallbox, Sicherheit und Gebäudeautomation', icon: Plug },
  { slug: 'heizung', title: 'Heizung, Klima & Energie', shortTitle: 'Heizung & Energie', description: 'Heizung, Wärmepumpe, Klima, Energieberatung und Wartung', icon: ThermometerSun },
  { slug: 'sanitaer-wasser', title: 'Sanitär & Wasser', shortTitle: 'Sanitär & Wasser', description: 'Sanitärarbeiten, Leitungen, Armaturen und wasserbezogene Probleme', icon: Droplets },
  { slug: 'dach-fenster-tueren', title: 'Dach, Fenster & Türen', shortTitle: 'Dach & Gebäudehülle', description: 'Dach, Dachrinne, Fenster, Türen, Schlosser und Gebäudehülle', icon: Hammer },
  { slug: 'innenausbau-sanierung', title: 'Innenausbau & Sanierung', shortTitle: 'Innenausbau', description: 'Maler, Schreiner, Boden, Renovierung und Sanierungsarbeiten', icon: Paintbrush },
  { slug: 'garten-aussenbereich', title: 'Garten & Außenbereich', shortTitle: 'Garten & Außen', description: 'Gartenpflege, Heckenschnitt, Baumarbeiten und Pflasterarbeiten', icon: Trees },
  { slug: 'reinigung-pflege', title: 'Reinigung & Pflege', shortTitle: 'Reinigung & Pflege', description: 'Hausreinigung, PV-Reinigung, Dachrinne und laufende Pflege', icon: Leaf },
  { slug: 'saisonale-dienste', title: 'Saisonale Dienste', shortTitle: 'Saisonale Dienste', description: 'Winterdienst und wiederkehrende Aufgaben rund ums Grundstück', icon: Snowflake },
  { slug: 'spezialfaelle', title: 'Spezialfälle', shortTitle: 'Spezialfälle', description: 'Schädlingsbekämpfung und weitere qualifikationsabhängige Dienste', icon: Bug },
  { slug: 'umzug-entruempelung', title: 'Umzug & Entrümpelung', shortTitle: 'Umzug & Räumen', description: 'Unterstützung beim Räumen, Umzug und objektbezogenen Dienstleistungen', icon: Sparkles },
  { slug: 'beratung-notfall', title: 'Beratung & dringende Fälle', shortTitle: 'Beratung & Notfall', description: 'Passende Ansprechpartner für fachliche Fragen oder dringenden Unterstützungsbedarf', icon: Shield },
] as const;

export const SERVICE_PATHS = SERVICE_CATEGORIES.map((service) => `/leistungen/${service.slug}`);

export function getServiceCategory(slug: string) {
  return SERVICE_CATEGORIES.find((service) => service.slug === slug);
}
