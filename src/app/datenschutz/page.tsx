import { MarketingShell } from '@/components/marketing/site-shell';

export const metadata = { title: "Datenschutzerklärung - einfachhausen" };

const sections: ReadonlyArray<[string, string]> = [
  ["1. Verantwortlicher", "Dein Name / Firma, Adresse, E-Mail: datenschutz@deine-domain.de"],
  ["2. Datenverarbeitung", "Wir verarbeiten: Name, E-Mail-Adresse, Telefonnummer, PLZ/Ort, Inhalte deiner Anfragen und Nachrichten sowie hochgeladene Fotos. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)."],
  ["3. Hosting", "Die App wird auf eigenen Servern (Oracle Cloud Infrastructure, Rechenzentrum EU) betrieben. Daten verlassen die EU nicht."],
  ["4. KI-Assistent", "Nachrichten an den KI-Assistenten werden zur Beantwortung an OpenAI (USA, EU-Standardvertragsklauseln) übermittelt. Bitte teile dort keine besonders sensiblen personenbezogenen Daten mit."],
  ["5. Deine Rechte", "Auskunft, Berichtigung, Loeschung, Datenuebertragbarkeit, Widerspruch: datenschutz@deine-domain.de. Beschwerderecht bei der zuständigen Aufsichtsbehörde."],
  ["6. Speicherdauer", "Daten werden gelöscht, wenn du dein Konto löschst oder gesetzliche Aufbewahrungsfristen (z. B. 10 Jahre fuer Rechnungen) abgelaufen sind."],
];

export default function DatenschutzPage() {
  return (
    <MarketingShell>
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "72px 20px 96px" }}>
      <span style={{ display: "inline-flex", fontSize: 11.5, fontWeight: 750, letterSpacing: ".09em", textTransform: "uppercase", color: "#105258", background: "#edf5f5", borderRadius: 999, padding: "5px 12px" }}>Rechtliches</span>
      <h1 style={{ fontSize: "clamp(30px,4vw,42px)", fontWeight: 700, letterSpacing: "-.03em", margin: "16px 0 28px", color: "#1c2129" }}>Datenschutzerklärung</h1>

      <div style={{ background: "#fffbe8", border: "1px solid #f0e3b8", borderRadius: 14, padding: "16px 18px", marginBottom: 32 }}>
        <strong style={{ fontSize: 13, color: "#6b5a1f" }}>Platzhalter - Freigabe ausstehend</strong>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "#6b5a1f" }}>
          Diese Erklärung ist ein Platzhalter. Die finale, rechtlich freigegebene Datenschutzerklaerung wird nach Verifizierung veröffentlicht (externer Launch-Blocker).
        </p>
      </div>

      {sections.map(([title, text]) => (
        <section key={title} style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 8, color: "#1c2129" }}>{title}</h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "#33484f" }}>{text}</p>
        </section>
      ))}

      <p style={{ marginTop: 32, fontSize: 12.5, color: "#8a9793" }}>Stand: {new Date().toLocaleDateString("de-DE")}</p>
    </main>
    </MarketingShell>
  );
}
