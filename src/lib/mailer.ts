import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});

export async function sendMail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({ from: `"einfachhausen" <${process.env.SMTP_USER}>`, to, subject, html });
    return true;
  } catch (e) {
    console.error("Mail-Fehler:", e);
    return false;
  }
}

export const mailTemplates = {
  neuesAngebotFuerOwner: (firma: string, titel: string, preis: number, anfrageId: string) => `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:auto">
      <h2 style="color:#14735c">🎉 Neues Angebot für dich!</h2>
      <p><strong>${firma}</strong> hat ein Angebot zu deinem Auftrag abgegeben:</p>
      <blockquote style="border-left:4px solid #14735c;padding-left:14px;color:#33484f">
        <strong>${titel}</strong><br/>Preisvorschlag: <strong>${preis.toLocaleString("de-DE")} €</strong>
      </blockquote>
      <a href="https://app.deine-domain.de/anfrage/${anfrageId}" style="display:inline-block;background:#14735c;color:#fff;padding:14px 28px;border-radius:14px;text-decoration:none;font-weight:800;margin-top:16px">Angebot ansehen</a>
      <p style="color:#9aa9ad;font-size:12px;margin-top:28px">Diese E-Mail wurde dir von einfachhausen gesendet.</p>
    </div>`,
  neueAnfrageFuerPro: (titel: string, plz: string, ort: string, dringend: boolean, anfrageId: string) => `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:auto">
      <h2 style="color:#14735c">${dringend ? "⚡ Dringende " : ""}Neue Anfrage in deinem Gebiet!</h2>
      <blockquote style="border-left:4px solid #14735c;padding-left:14px;color:#33484f">
        <strong>${titel}</strong><br/>📍 ${plz} ${ort}
      </blockquote>
      <a href="https://app.deine-domain.de/anfrage/${anfrageId}" style="display:inline-block;background:#14735c;color:#fff;padding:14px 28px;border-radius:14px;text-decoration:none;font-weight:800;margin-top:16px">Anfrage ansehen & Angebot senden</a>
      <p style="color:#9aa9ad;font-size:12px;margin-top:28px">Deine Gebiets-Benachrichtigung von einfachhausen.</p>
    </div>`,
};
