"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightThin, ArrowRightWhite } from "@/components/icons";

const quickChips = ["Heizung", "Badezimmer", "Garten", "Dach", "Elektro"];

import styles from "./ki-card.module.css";
export default function KiCard() {
  const router = useRouter();
  const [frage, setFrage] = useState("");
  function send() { if (!frage.trim()) return; router.push(`/ki-chat?q=${encodeURIComponent(frage.trim())}`); }
  return (
    <div className="ki-card">
      <div className="ki-head" onClick={() => router.push("/ki-chat")}>
        <div className="ki-avatar">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="8" width="14" height="11" rx="4" stroke="#105258" strokeWidth="1.7" />
            <circle cx="9.5" cy="13" r="1.4" fill="#105258" />
            <circle cx="14.5" cy="13" r="1.4" fill="#105258" />
            <path d="M12 8V5M12 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" stroke="#105258" strokeWidth="1.5" />
            <path d="M9 16.5h6" stroke="#a3d4c3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="ki-head-text"><span className="ki-badge">KI</span><strong>Frag einfachhausen</strong><p>Dein Assistent rund ums Haus.</p></div>
        <div className="ki-arrow"><ArrowRightThin /></div>
      </div>
      <div className={`ki-input-row ${styles.inputRow}`}>
        <input value={frage} onChange={(e) => setFrage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Frag mich etwas…" />
        <button className="ki-send" onClick={send}><ArrowRightWhite /></button>
      </div>
      <div className={`chips ${styles.chipRow}`}>
        {quickChips.map((c) => (<button key={c} className="chip" onClick={() => router.push(`/ki-chat?q=${c}`)}>{c}</button>))}
      </div>
    </div>
  );
}
