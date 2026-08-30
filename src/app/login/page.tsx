"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BackIcon } from "@/components/icons";
import logoMark from "@/components/marketing/assets/logo-mark.png";
import authStyles from "@/components/marketing/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function login() {
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) { setErr(error.message === "Invalid login credentials" ? "E-Mail oder Passwort falsch." : error.message); return; }
    // Never route from client-editable Supabase metadata. /app resolves the
    // server-controlled application identity and redirects providers to /pro.
    router.replace("/app");
  }

  return (
    <main className={authStyles.authShell}>
      <div className={authStyles.authPanel}>
        <div className={authStyles.authAside}>
          <div className={authStyles.authAsideBrand}>
            <Image src={logoMark} alt="" width={38} height={29} priority className={authStyles.authAsideMarkImg} />
            <span><b>einfach</b>hausen</span>
          </div>
          <h2>Dein Zuhause.<br /><em>Alles geregelt.</em></h2>
          <ul className={authStyles.authAsideList}>
            <li><CircleCheck size={17} aria-hidden="true" /> Hausanliegen beschreiben und klären</li>
            <li><CircleCheck size={17} aria-hidden="true" /> Geprüfte Partner aus deiner Region</li>
            <li><CircleCheck size={17} aria-hidden="true" /> Hausakte: Technik, Dokumente, Kontakte</li>
          </ul>
          <p className={authStyles.authAsideFoot}>Kein Auftrag ohne deine Entscheidung.</p>
        </div>
        <div className={authStyles.authMain}>
          <div className={authStyles.authCard}>
            <header className={authStyles.authTopbar}>
              <button className={authStyles.authBack} onClick={() => router.back()} aria-label="Zurück"><BackIcon /></button>
              <Link href="/" className={authStyles.authHome} aria-label="Zur Startseite"><Home size={17} aria-hidden="true" /></Link>
            </header>
            <div className={authStyles.authIntro}>
              <span className={authStyles.authEyebrow}>Anmelden</span>
              <h1>Willkommen zurück.</h1>
              <p>Melde dich an, um weiterzumachen.</p>
            </div>
            {err && <div className={authStyles.authError} role="alert">{err}</div>}
            <form className={authStyles.authForm} onSubmit={(e) => { e.preventDefault(); login(); }}>
              <label className={authStyles.authField}>
                <span>E-Mail</span>
                <input type="email" inputMode="email" autoCapitalize="none" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@example.de" />
              </label>
              <label className={authStyles.authField}>
                <span>Passwort</span>
                <input type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && login()} />
              </label>
              <button type="submit" className={authStyles.authSubmit} disabled={!email || !pw || busy}>{busy ? "Anmelden …" : "Anmelden"}<ArrowRight size={17} aria-hidden="true" /></button>
            </form>
            <p className={authStyles.authSwitch}>Noch kein Konto? <Link href="/role">Jetzt registrieren</Link></p>
            <p className={authStyles.authLegal}>Mit der Anmeldung akzeptierst du unsere <Link href="/agb">AGB</Link> und <Link href="/datenschutz">Datenschutzerklärung</Link>.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
