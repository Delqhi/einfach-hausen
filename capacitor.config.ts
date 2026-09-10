import type { CapacitorConfig } from "@capacitor/cli";

// Einfach Hausen iOS-Geruest (EH-APP-01, Stand 2026-09-10).
// v1-Strategie: GEHOSTETE WebView (kein statischer Export — Server Actions,
// better-sqlite3, Stripe-Routen und Supabase-Server-Auth verhindern
// `output: 'export'`, siehe docs/brand/appstore/TECH-DECISIONS.md A).
// Dazu VOR dem Mac-Build einkommentieren:
//   server: { url: "https://<prod-domain>", cleartext: false, androidScheme: "https", iosScheme: "https" },
//   allowNavigation: ["<prod-domain>"]
// `webDir: "out"` bleibt als Ziel fuer einen spaeteren Export-Pfad erhalten.

const config: CapacitorConfig = {
  appId: "de.einfachhausen.app",
  appName: "Einfach Hausen",
  webDir: "out",
  server: { androidScheme: "https", iosScheme: "https" },
};

export default config;
