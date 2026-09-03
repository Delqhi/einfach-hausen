/**
 * SEO-Fundament (P0) — zentrale Konstanten + JSON-LD-Bausteine.
 * Quelle: /tmp/seo-research.md Abschnitt 7.2 P0. Keine visuellen Effekte,
 * nur Head-/Metadata-/JSON-LD-Bausteine. Keine erfundenen Claims:
 * areaServed bleibt ehrlich (regionale Pilotphase, kein Bundesweit-Versprechen),
 * keine Bewertungen (keine verifizierten Reviews im Code), keine Preise im Schema.
 */
export const SITE_URL = 'https://einfachhausen.de';

/** Absolute Canonical-URL fuer einen App-Router-Pfad. */
export function canonical(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Globaler Graph: Organization + WebSite (ohne sameAs — keine Social-Profile im Code belegt). */
export function orgWebsiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organisation`,
        name: 'Einfach Hausen',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icons/icon-192.png`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Einfach Hausen',
        url: `${SITE_URL}/`,
        inLanguage: 'de',
        publisher: { '@id': `${SITE_URL}/#organisation` },
      },
    ],
  };
}

/** BreadcrumbList fuer Content-Seiten. items: [Anzeigename, Pfad]. */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}

/**
 * HomeAndConstructionBusiness + Service fuer /leistungen.
 * Leistungsnamen = CATEGORIES aus src/components/marketing/content.tsx (1:1).
 * areaServed ehrlich als Text: regionale Pilotphase, Verfügbarkeit hängt
 * vom Partnernetz vor Ort ab (vgl. /leistungen-FAQ "Wir starten regional").
 */
export function leistungenServiceJsonLd(): Record<string, unknown> {
  const services = [
    'Haus & Technik',
    'Elektro & Smart Home',
    'Heizung, Klima & Energie',
    'Sanitär & Wasser',
    'Dach, Fenster & Türen',
    'Innenausbau & Sanierung',
    'Garten & Außenbereich',
    'Reinigung & Pflege',
    'Saisonale Dienste',
    'Spezialfälle',
    'Umzug & Entrümpelung',
    'Beratung & dringende Fälle',
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/leistungen#anbieter`,
    name: 'Einfach Hausen',
    url: `${SITE_URL}/leistungen`,
    description:
      'Einfach Hausen organisiert alles rund ums Eigenheim: Anliegen beschreiben, geprüfte regionale Partner finden, Vorgänge in der Hausakte behalten.',
    areaServed:
      'Regionale Pilotgebiete in Deutschland — konkrete Verfügbarkeit hängt vom aktiven Partnernetz vor Ort ab',
    makesOffer: services.map((serviceType) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: serviceType,
        provider: { '@id': `${SITE_URL}/leistungen#anbieter` },
        url: `${SITE_URL}/leistungen`,
      },
    })),
  };
}
