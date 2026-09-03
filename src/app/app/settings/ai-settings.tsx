"use client";

import { uiToast } from "@/components/ui-toast";
import { useEffect, useState } from "react";

// EH T-0207: AI access settings — BYOK (own OpenAI-compatible key), freemium
// quota display and rewarded-ad credit grant. The key is stored encrypted
// server-side and never rendered back.
type Quota = { byok: boolean; freemiumAllowed: number; freemiumUsed: number; freemiumRemaining: number; credits: number };

export function AiSettings() {
  const [quota, setQuota] = useState<Quota | null>(null);
  const [byok, setByok] = useState<{ enabled: boolean; masked: string | null; baseUrl: string; model: string } | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const q = await fetch("/api/ki").then((r) => (r.ok ? r.json() : null));
      if (q) setQuota(q);
      const b = await fetch("/api/ai/byok").then((r) => (r.ok ? r.json() : null));
      if (b) setByok(b);
    } catch { /* settings load is best-effort */ }
  }
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = await fetch("/api/ki").then((r) => (r.ok ? r.json() : null));
        if (!cancelled && q) setQuota(q);
        const b = await fetch("/api/ai/byok").then((r) => (r.ok ? r.json() : null));
        if (!cancelled && b) setByok(b);
      } catch { /* settings load is best-effort */ }
    })();
    return () => { cancelled = true; };
  }, []);

  async function saveKey() {
    setError(""); setMessage(""); setBusy(true);
    try {
      const res = await fetch("/api/ai/byok", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey, baseUrl, model }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Speichern fehlgeschlagen.");
      uiToast("Key verschlüsselt gespeichert.", { kind: "success" });
      setApiKey("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Fehler."); } finally { setBusy(false); }
  }

  async function disableKey() {
    setBusy(true);
    try { await fetch("/api/ai/byok", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ disable: true }) }); await load(); uiToast("BYOK deaktiviert.", { kind: "info" }); }
    finally { setBusy(false); }
  }

  async function watchAd() {
    setError(""); setMessage(""); setBusy(true);
    try {
      // Until a rewarded-ad SDK is wired, no signed receipt exists: the
      // server verifies receipts fail-closed (production) and only accepts
      // unsigned grants outside production. Wire the SDK completion callback
      // to POST { receipt, signature } here (contract: docs/OPERATIONS.md).
      const res = await fetch("/api/ai/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler.");
      uiToast(`+${data.granted} KI-Aktionen erhalten.`, { kind: "success" });
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Fehler."); } finally { setBusy(false); }
  }

  return (
    <div>
      {quota && (
        <p style={{ fontSize: 14 }}>
          KI-Kontingent: {quota.freemiumRemaining} von {quota.freemiumAllowed} frei · {quota.credits} Bonus-Aktionen
        </p>
      )}
      {message && <p style={{ color: "#2f7650", fontSize: 14 }}>{message}</p>}
      {error && <p style={{ color: "#d64541", fontSize: 14 }}>{error}</p>}

      {byok?.enabled ? (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 14, margin: "6px 0" }}>Eigener Key aktiv ({byok.masked}) — unbegrenzte KI-Nutzung über dein eigenes Kontingent.</p>
          <button className="btn-ghost" onClick={disableKey} disabled={busy}>BYOK deaktivieren</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <p style={{ fontSize: 14, margin: "6px 0" }}>
            Power-User: hinterlege deinen eigenen API-Key (OpenAI-kompatibel, z. B. Google AI Studio oder OpenRouter).
            Die KI läuft dann über dein Kontingent — für uns kostenlos, für dich unbegrenzt. Der Key wird verschlüsselt gespeichert.
          </p>
          <input type="password" placeholder="API-Key (sk-…)" value={apiKey} onChange={(e) => setApiKey(e.target.value)} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" }} autoComplete="off" />
          <input placeholder="Basis-URL (optional, z. B. https://openrouter.ai/api/v1)" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" }} />
          <input placeholder="Modell (optional, z. B. google/gemini-flash-1.5)" value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #ddd" }} />
          <button className="btn-ghost" onClick={saveKey} disabled={busy || apiKey.length < 16}>Key verschlüsselt speichern</button>
        </div>
      )}

      <button className="btn-ghost" onClick={watchAd} disabled={busy}>Werbeclip ansehen: +10 KI-Aktionen</button>
    </div>
  );
}
