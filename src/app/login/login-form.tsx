"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BackIcon } from "@/components/icons";

export default function LoginForm({ mode }: { mode: "supabase" | "local" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function login() {
    setErr("");
    setBusy(true);
    if (mode === "local") {
      // Local-mode credential login (development). The server verifies the
      // bcrypt hash and issues the mh_session cookie; role resolution stays
      // server-side exactly like every other authenticated route.
      try {
        const response = await fetch("/api/auth/local-login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password: pw }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) { setErr(payload.error || "Anmeldung fehlgeschlagen."); setBusy(false); return; }
      } catch {
        setErr("Verbindung unterbrochen. Bitte erneut versuchen.");
        setBusy(false);
        return;
      }
      setBusy(false);
      // Never route from client-editable Supabase metadata. /app resolves the
      // server-controlled application identity and redirects providers to /pro.
      router.replace("/app");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setBusy(false);
    if (error) { setErr(error.message === "Invalid login credentials" ? "E-Mail oder Passwort falsch." : error.message); return; }
    router.replace("/app");
  }

  return (
    <div className="safe-top page ob-page" style={{ paddingBottom: 40 }}>
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <div className="auth-head"><h1>Willkommen zurück 👋</h1><p>Melde dich an, um weiterzumachen.</p></div>
      <div className="ob-form">
        {err && <div className="error-box">{err}</div>}
        <div className="if-wrap"><span className="if-label">E-Mail</span><input inputMode="email" autoCapitalize="none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@example.de" /></div>
        <div className="if-wrap"><span className="if-label">Passwort</span><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && login()} /></div>
      </div>
      <div className="ob-actions"><button className="btn-primary btn-full" disabled={!email || !pw || busy} onClick={login}>{busy ? "Anmelden…" : "Anmelden"}</button><p className="auth-links">Noch kein Konto? <a href="/role">Jetzt registrieren</a></p></div>
      <div className="home-indicator" />
    </div>
  );
}
