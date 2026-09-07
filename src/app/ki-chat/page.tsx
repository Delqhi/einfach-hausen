"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BackIcon, ArrowRightWhite, CameraIcon, MicIcon } from "@/components/icons";

type Msg = { role: "user" | "ai"; text: string };

export default function KiChatPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "Hi! Ich bin dein einfachhausen-Assistent. Schilder mir dein Problem – ich finde den richtigen Ansprechpartner oder passende Angebote für dich." }]);
  const [input, setInput] = useState(sp.get("prompt") || "");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => {
    const p = sp.get("prompt");
    if (p) queueMicrotask(() => { setInput(""); setMsgs((m) => [...m, { role: "user", text: p }]); sendWith(p, msgs.concat({ role: "user", text: p })); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function sendWith(text: string, history: Msg[]) {
    setLoading(true);
    try {
      const apiMessages = history.map(({ role, text }) => ({
        role: role === "ai" ? "assistant" : "user",
        content: text,
      }));
      const res = await fetch("/api/ki", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMessages }) });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "ai", text: data.reply }]);
    } catch { setMsgs((m) => [...m, { role: "ai", text: "Ups, da ist etwas schiefgelaufen. Versuch es nochmal." }]); }
    setLoading(false);
  }
  async function send() {
    const text = input.trim(); if (!text || loading) return; setInput(""); setMsgs((m) => [...m, { role: "user", text }]); await sendWith(text, msgs.concat({ role: "user", text }));
  }
  return (
    <div className="safe-top safe-bottom page ki-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button><div className="ki-robot ki-robot-centered"><svg width="44" height="44" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="10" r="4" fill="#1c2129" /><path d="M32 14v6" stroke="#1c2129" strokeWidth="3" strokeLinecap="round" /><rect x="14" y="20" width="36" height="28" rx="10" fill="#fff" stroke="#1c2129" strokeWidth="3" /><circle cx="25" cy="33" r="3.2" fill="#1c2129" /><circle cx="39" cy="33" r="3.2" fill="#1c2129" /><path d="M26 40c2 2.5 10 2.5 12 0" stroke="#1c2129" strokeWidth="2.4" strokeLinecap="round" /></svg></div><span className="ki-head-spacer" /></header>
      <div className="ki-messages">{msgs.map((m, i) => (<div key={i} className={`bubble ${m.role}`}>{m.text}</div>))}{loading && <div className="bubble ai">denkt nach…</div>}<div ref={endRef} /></div>
      <div className="ki-composer"><div className="ki-input-row"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Was ist los bei dir?" /><button className="ki-send" onClick={send}><ArrowRightWhite /></button></div><div className="ki-chips"><button className="ki-chip"><CameraIcon /> Foto</button><button className="ki-chip"><MicIcon /> Sprache</button></div></div>
      <div className="home-indicator" />
    </div>
  );
}
