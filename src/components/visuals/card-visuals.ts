export const CARD_VISUALS = {
  digitalHomeFile: {
    src: '/images/card-visuals/digital-home-file-v4.png',
    alt: 'Digitale Hausakte mit Unterlagen und Prüfstatus',
  },
  verifiedPartners: {
    src: '/images/card-visuals/verified-partners-v4.png',
    alt: 'Geprüfte Partner mit Verifizierungszeichen',
  },
  propertyValuation: {
    src: '/images/card-visuals/property-valuation-v4.png',
    alt: 'Immobilienbewertung mit Analyse und Wertentwicklung',
  },
  solarEnergy: {
    src: '/images/card-visuals/solar-energy-v4.png',
    alt: 'Solarenergie mit Photovoltaik und Energiefluss',
  },
  craftsmenService: {
    src: '/images/card-visuals/craftsmen-service-v4.png',
    alt: 'Handwerker-Service mit Werkzeug und Bauplan',
  },
  heatPump: {
    src: '/images/card-visuals/heat-pump-v4.png',
    alt: 'Wärmepumpe mit Luftstrom und Effizienz',
  },
  keyHandover: {
    src: '/images/card-visuals/key-handover-v4.png',
    alt: 'Schlüsselübergabe für ein Zuhause',
  },
  propertyMatching: {
    src: '/images/card-visuals/property-matching-v4.png',
    alt: 'Immobiliensuche mit Standort und Matching',
  },
} as const;

export type CardVisualKind = keyof typeof CARD_VISUALS;
