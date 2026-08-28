"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackIcon, HomeOutlineIcon, BriefcaseIcon } from "@/components/icons";

const rollen = [
  { id: "owner", icon: <HomeOutlineIcon />, title: "Ich bin Eigentümer", text: "Ich suche Handwerker und verwalte mein Zuhause." },
  { id: "pro", icon: <BriefcaseIcon />, title: "Ich bin Dienstleister", text: "Ich biete Handwerksleistungen an und suche Aufträge." },
];

export default function RolePage() {
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div className="safe-top page ob-page" style={{ paddingBottom: 40 }}>
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <div className="role-hero"><h1>Wer bist du?</h1><p style={{ marginTop: 8 }}>Damit wir dir die App richtig einrichten.</p></div>
      <div className="role-cards">
        {rollen.map((r) => (
          <button key={r.id} className={`role-card ${sel === r.id ? "sel" : ""}`} onClick={() => setSel(r.id)}>
            <div className="role-icon">{r.icon}</div>
            <div className="role-text"><strong>{r.title}</strong><span>{r.text}</span></div>
            <span className={`checkbox-square ${sel === r.id ? "on" : ""}`} />
          </button>
        ))}
      </div>
      <div className="ob-actions"><button className="btn-primary btn-full" disabled={!sel} onClick={() => router.push(sel === "pro" ? "/register-pro" : "/register-owner")}>Weiter</button></div>
      <div className="home-indicator" />
    </div>
  );
}
