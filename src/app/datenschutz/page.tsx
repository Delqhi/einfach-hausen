export const metadata = { title: "Datenschutzerklärung – einfachhausen" };

export default function DatenschutzPage() {
  return (
    <div className="page" style={{ padding: 24, paddingTop: 60, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Datenschutzerklärung</h1>
      <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "#33484f" }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>1. Verantwortlicher</h2>
        <p>Dein Name / Firma, Adresse, E-Mail: datenschutz@deine-domain.de</p>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>2. Datenverarbeitung</h2>
        <p>Wir verarbeiten: Name, E-Mail-Adresse, Telefonnummer, PLZ/Ort, Inhalte deiner Anfragen und Nachrichten sowie hochgeladene Fotos. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>3. Hosting</h2>
        <p>Die App wird auf eigenen Servern (Oracle Cloud Infrastructure, Rechenzentrum EU) betrieben. Daten verlassen die EU nicht.</p>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>4. KI-Assistent</h2>
        <p>Nachrichten an den KI-Assistenten werden zur Beantwortung an OpenAI (USA, EU-Standardvertragsklauseln) übermittelt. Bitte teile dort keine besonders sensiblen personenbezogenen Daten mit.</p>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>5. Deine Rechte</h2>
        <p>Auskunft, Berichtigung, Löschung, Datenübertragbarkeit, Widerspruch: datenschutz@deine-domain.de. Beschwerderecht bei der zuständigen Aufsichtsbehörde.</p>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>6. Speicherdauer</h2>
        <p>Daten werden gelöscht, wenn du dein Konto löschst oder gesetzliche Aufbewahrungsfristen (z. B. 10 Jahre für Rechnungen) abgelaufen sind.</p>
        <p style={{ marginTop: 24, color: "#9aa9ad" }}>Stand: {new Date().toLocaleDateString("de-DE")}</p>
      </div>
    </div>
  );
}
