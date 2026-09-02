export const CARD_VISUALS = {
  digitalHomeFile: {
    src: '/images/card-visuals/digital-home-file.png',
    alt: 'Digitale Hausakte mit Unterlagen und Prüfstatus',
  },
  verifiedPartners: {
    src: '/images/card-visuals/verified-partners.png',
    alt: 'Geprüfte Partner mit Verifizierungszeichen',
  },
  propertyValuation: {
    src: '/images/card-visuals/property-valuation.png',
    alt: 'Immobilienbewertung mit Analyse und Wertentwicklung',
  },
  solarEnergy: {
    src: '/images/card-visuals/solar-energy.png',
    alt: 'Solarenergie mit Photovoltaik und Energiefluss',
  },
  craftsmenService: {
    src: '/images/card-visuals/craftsmen-service.png',
    alt: 'Handwerker-Service mit Werkzeug und Bauplan',
  },
  heatPump: {
    src: '/images/card-visuals/heat-pump.png',
    alt: 'Wärmepumpe mit Luftstrom und Effizienz',
  },
  keyHandover: {
    src: '/images/card-visuals/key-handover.png',
    alt: 'Schlüsselübergabe für ein Zuhause',
  },
  propertyMatching: {
    src: '/images/card-visuals/property-matching.png',
    alt: 'Immobiliensuche mit Standort und Matching',
  },
} as const;

export type CardVisualKind = keyof typeof CARD_VISUALS;
