"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/components/icons";

export default function CheckEmailPage() {
  const router = useRouter();
  return (
    <div className="safe-top page ob-page" style={{ paddingBottom: 40 }}>
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <div className="center-page" style={{ paddingTop: 60 }}>
        <div className="success-circle">📬</div>
        <h1>Fast fertig!</h1>
        <p style={{ maxWidth: 280, textAlign: "center" }}>Wir haben dir einen Bestätigungslink geschickt.<br />Öffne deine E-Mails und bestätige dein Konto.</p>
        <button className="btn-primary btn-full" style={{ marginTop: 20, maxWidth: 320 }} onClick={() => router.replace("/login")}>Zur Anmeldung</button>
      </div>
      <div className="home-indicator" />
    </div>
  );
}
