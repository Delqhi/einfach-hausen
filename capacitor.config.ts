import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.einfachhausen.app",
  appName: "einfachhausen",
  webDir: "out",
  server: { androidScheme: "https", iosScheme: "https" },
};

export default config;
