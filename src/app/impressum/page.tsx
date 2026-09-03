import { MarketingShell } from '@/components/marketing/site-shell';

import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { title: 'Impressum', description: 'Anbieterkennzeichnung von Einfach Hausen nach § 5 TMG.', alternates: { canonical: canonical('/impressum') } };

export default function ImpressumPage() {
  return (
    <MarketingShell>
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "72px 20px 96px" }}>
      <span style={{ display: "inline-flex", fontSize: 11.5, fontWeight: 750, letterSpacing: ".09em", textTransform: "uppercase", color: "#105258", background: "#edf5f5", borderRadius: 999, padding: "5px 12px" }}>Rechtliches</span>
      <h1 style={{ fontSize: "clamp(30px,4vw,42px)", fontWeight: 700, letterSpacing: "-.03em", margin: "16px 0 28px", color: "#1c2129" }}>Impressum</h1>

      <div style={{ background: "#fffbe8", border: "1px solid #f0e3b8", borderRadius: 14, padding: "16px 18px", marginBottom: 32 }}>
        <strong style={{ fontSize: 13, color: "#6b5a1f" }}>Platzhalter - Freigabe ausstehend</strong>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "#6b5a1f" }}>
          Die folgenden Angaben sind Platzhalter. Verbindliche Betreiberdaten werden erst nach rechtlicher Freigabe veröffentlicht (externer Launch-Blocker, siehe docs/EXTERNAL-BLOCKERS.md).
        </p>
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 12, color: "#1c2129" }}>Anbieterkennzeichnung nach § 5 TMG</h2>
        <div style={{ fontSize: 15, lineHeight: 1.75, color: "#33484f" }}>
          <p style={{ margin: "0 0 12px" }}>Deine Firma / Name<br/>Musterstraße 1<br/>12345 Musterstadt<br/>E-Mail: info@deine-domain.de<br/>Telefon: +49 123 456789</p>
          <p style={{ margin: "0 0 12px" }}>Vertreten durch: Dein Name, Geschäftsführer</p>
          <p style={{ margin: 0 }}>Registereintrag: Amtsgericht Musterstadt, HRB 12345<br/>USt-IdNr.: DE123456789</p>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 12, color: "#1c2129" }}>Haftung für externe Links</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "#33484f" }}>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.</p>
      </section>

      <p style={{ marginTop: 32, fontSize: 12.5, color: "#8a9793" }}>Stand: {new Date().toLocaleDateString("de-DE")}</p>
    </main>
    </MarketingShell>
  );
}
