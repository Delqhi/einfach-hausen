"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/components/icons";
import auth from "@/components/marketing/auth-convergence.module.css";

export default function CheckEmailPage() {
  const router = useRouter();
  return (
    <div className={['safe-top page ob-page', auth.authConverged, auth.checkEmail, auth.bottomPad].join(' ')}>
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <div className={`center-page ${auth.topPad}`}>
        <div className="success-circle">📬</div>
        <h1>Fast fertig!</h1>
        <p className={auth.leadCenter}>Wir haben dir einen Bestätigungslink geschickt.<br />Öffne deine E-Mails und bestätige dein Konto.</p>
        <button className={`btn-primary btn-full ${auth.btnNarrow}`} onClick={() => router.replace("/login")}>Zur Anmeldung</button>
      </div>
      <div className="home-indicator" />
    </div>
  );
}
