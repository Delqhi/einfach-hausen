/**
 * Einfach Hausen — Canonical Design Tokens
 * 
 * Verbindliche Single Source of Truth für Web, Eigentümer-App (/app),
 * Handwerker-App (/pro) und CRM (/admin).
 * Referenz: DESIGN.md & tokens.css
 */

export const designTokens = {
  color: {
    brand: {
      teal900: '#0a3539', // Kicker, Textanker, deep tone
      teal800: '#0d474d',
      teal700: '#105258', // Primary Signal & Action Brand Teal
      teal600: '#147078',
      teal500: '#1f7a80',
      teal300: '#7fb7ba',
      teal100: '#dcebec', // Soft badge background, active pills
      teal050: '#edf5f5',
    },
    canvas: {
      default: '#faf8f4', // Warmes Off-White Basis-Canvas (kein reines Weiß)
      subtle: '#f4f7f7',  // Sanfter Sekundär-Canvas
      surface: '#ffffff', // Nur für erhabene Karten & Container
      sand100: '#f4ebdd',
      sand200: '#ecdfc9',
      sand400: '#d9b98a',
    },
    ink: {
      primary: '#10222a',   // Maximale Lesbarkeit (Charcoal Ink)
      secondary: '#4b5b60', // Sekundäre Beschriftungen
      mute: '#5f6e75',      // Platzhalter & De-emphasized Text
    },
    line: {
      hairline: '#e4e2dc',  // Subtile Trenner (keine dicken Borders)
      strong: '#cfcbc2',
    },
    accent: {
      terra: '#a84d29',     // Sparsamer warmer Signal-Akzent
      terraSoft: '#f7e4da',
    },
  },
  typography: {
    fontFamily: {
      primary: 'var(--font-marketing), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'var(--font-marketing), Inter, ui-sans-serif, system-ui, sans-serif',
    },
    size: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.25rem',     // 20px
      xl: '1.5rem',      // 24px
      display: 'clamp(2.5rem, 5vw, 4.25rem)',
    },
  },
  shape: {
    radiusSm: '8px',
    radiusMd: '14px',
    radiusLg: '20px',
    radiusCard: '24px',
    radiusPill: '999px',
  },
  shadow: {
    subtle: '0 1px 3px rgba(16, 34, 42, 0.04), 0 8px 24px -12px rgba(16, 34, 42, 0.08)',
    card: '0 2px 4px rgba(16, 34, 42, 0.05), 0 18px 40px -16px rgba(16, 34, 42, 0.22)',
  },
  rules: {
    noSideBorderStripes: true,
    noTextGradients: true,
    noGlassmorphismDefault: true,
    noDarkModeSilos: true, // Kein Dark-Mode im Pro- oder CRM-Bereich
  },
} as const;

export type DesignTokens = typeof designTokens;
