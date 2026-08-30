"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// GDPR self-service (EH T-0203): JSON export of the own account and real
// deletion. The server derives the identity from the session; no ids travel
// through the client.
export function AccountActions() {
  const router = useRouter();
  const [busy, setBusy] = useState<"export" | "delete" | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  async function exportData() {
    setError("");
    setBusy("export");
    try {
      const res = await fetch("/api/account/export", { method: "GET" });
      if (!res.ok) throw new Error("Export fehlgeschlagen.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `einfach-hausen-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export fehlgeschlagen. Bitte später erneut versuchen.");
    } finally {
      setBusy(null);
    }
  }

  async function deleteAccount() {
    setError("");
    setBusy("delete");
    try {
      const res = await fetch("/api/konto-loeschen", { method: "POST" });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen.");
      try { await supabase.auth.signOut(); } catch {}
      router.replace("/");
    } catch {
      setError("Löschen fehlgeschlagen. Bitte Support kontaktieren.");
      setBusy(null);
    }
  }

  if (confirmOpen) {
    return (
      <div role="alertdialog" aria-label="Konto wirklich löschen?" style={{ border: "1px solid #d64541", borderRadius: 14, padding: 16 }}>
        <strong>Konto wirklich löschen?</strong>
        <p style={{ fontSize: 14, margin: "8px 0" }}>
          Deine persönlichen Inhalte werden dauerhaft gelöscht und dein Login unwiderruflich beendet.
          Belegdaten wie Rechnungen bleiben aus gesetzlichen Gründen erhalten, ohne deine Identität.
        </p>
        {error && <p style={{ color: "#d64541", fontSize: 14 }}>{error}</p>}
        <button className="btn-danger" style={{ marginRight: 8 }} disabled={busy !== null} onClick={deleteAccount}>
          {busy === "delete" ? "Wird gelöscht…" : "Endgültig löschen"}
        </button>
        <button className="btn-ghost" onClick={() => setConfirmOpen(false)} disabled={busy !== null}>Abbrechen</button>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 14 }}>
        Lade deine gespeicherten Daten als JSON-Datei herunter oder lösche dein Konto und alle persönlichen Inhalte.
      </p>
      {error && <p style={{ color: "#d64541", fontSize: 14 }}>{error}</p>}
      <button className="btn-ghost" style={{ marginRight: 8 }} onClick={exportData} disabled={busy !== null}>
        {busy === "export" ? "Wird vorbereitet…" : "Daten exportieren"}
      </button>
      <button className="btn-danger" onClick={() => setConfirmOpen(true)} disabled={busy !== null}>
        Konto löschen
      </button>
    </div>
  );
}
