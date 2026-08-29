export const metadata = { title: "Impressum – einfachhausen" };

export default function ImpressumPage() {
  return (
    <div className="page" style={{ padding: 24, paddingTop: 60, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Impressum</h1>
      <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "#33484f" }}>
        <p><strong>Anbieterkennzeichnung nach §5 TMG</strong></p>
        <p>Deine Firma / Name<br/>Musterstraße 1<br/>12345 Musterstadt<br/>E-Mail: info@deine-domain.de<br/>Telefon: +49 123 456789</p>
        <p>Vertreten durch: Dein Name, Geschäftsführer</p>
        <p>Registereintrag: Amtsgericht Musterstadt, HRB 12345<br/>USt-IdNr.: DE123456789</p>
        <h2 style={{ fontSize: 17, fontWeight: 800, marginTop: 18 }}>Haftung</h2>
        <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.</p>
        <p style={{ marginTop: 24, color: "#9aa9ad" }}>Stand: {new Date().toLocaleDateString("de-DE")}</p>
      </div>
    </div>
  );
}
