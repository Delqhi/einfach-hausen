"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { BackIcon, ArrowRightWhite } from "@/components/icons";
import styles from "./chat.module.css";

type Msg = { id: string; sender_id: string; text: string; created_at: string };

export default function ChatPage() {
  const { anfrageId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [partnerName, setPartnerName] = useState("Chat");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    let cleanup: (() => void) | undefined;
    // T-0118: browser Supabase client is lazy (async chunk) — the realtime
    // channel lives inside this effect scope so cleanup stays correct.
    getSupabase().then((supabase) => {
      supabase
        .from("anfragen")
        .select("user_id, titel")
        .eq("id", anfrageId as string)
        .single()
        .then(async ({ data: anfrage }: any) => {
          if (!anfrage) return;
          const isOwner = anfrage.user_id === user.id;
          let otherId = anfrage.user_id;
          if (isOwner) {
            const { data: ag }: any = await supabase.from("angebote").select("pro_id, firma").eq("anfrage_id", anfrageId as string).limit(1).single();
            if (ag) {
              otherId = ag.pro_id;
              setPartnerName(ag.firma);
            }
          } else {
            setPartnerName("Eigentümer");
          }
          setPartnerId(otherId);
        });
      supabase.from("anfrage_messages").select("*").eq("anfrage_id", anfrageId as string).order("created_at").then(({ data }: any) => setMsgs((data as any) ?? []));
      const channel = supabase
        .channel(`chat-${anfrageId}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "anfrage_messages", filter: `anfrage_id=eq.${anfrageId}` }, (payload: any) => setMsgs((m) => [...m, payload.new as Msg]))
        .subscribe();
      cleanup = () => {
        supabase.removeChannel(channel);
      };
    }).catch(() => {
      // No Supabase client (preview without env vars) — chat stays empty.
      // Tabellen + RLS: db/supabase-tables.sql (docs/SUPABASE_TABLES.md).
    });
    return () => { cleanup?.(); };
  }, [user, anfrageId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  async function send() {
    const text = input.trim();
    if (!text || !partnerId || !user) return;
    setInput("");
    const supabase = await getSupabase();
    await supabase.from("anfrage_messages").insert({ anfrage_id: anfrageId as string, sender_id: user.id, empfaenger_id: partnerId, text } as any);
  }

  return (
    <div className="safe-top safe-bottom page ki-page">
      <header className="ob-header">
        <button className="back-btn" onClick={() => router.back()}>
          <BackIcon />
        </button>
        <strong className={styles.partnerName}>{partnerName}</strong>
        <span className={styles.headerSpacer} />
      </header>
      <div className="ki-messages">
        {msgs.map((m) => (
          <div key={m.id} className={`bubble ${m.sender_id === user?.id ? "user" : "ai"}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="ki-composer">
        <div className="ki-input-row">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Nachricht schreiben…" />
          <button className="ki-send" onClick={send}>
            <ArrowRightWhite />
          </button>
        </div>
      </div>
      <div className="home-indicator" />
    </div>
  );
}
