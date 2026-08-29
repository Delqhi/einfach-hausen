"use client";

import { useRouter } from "next/navigation";
import { CloseIcon, ChatRoundIcon, ChatFaceIcon, NotfallSirenIcon } from "@/components/icons";

const items = [
  { icon: <ChatRoundIcon variant="dark" />, label: "Neuer Auftrag", sub: "Handwerker beauftragen", href: "/anfrage/neu", dark: true },
  { icon: <ChatFaceIcon />, label: "Beratung", sub: "KI-Assistent fragen", href: "/ki-chat", dark: false },
  { icon: <NotfallSirenIcon />, label: "Notfall", sub: "Sofort Hilfe rufen", href: "/notfall", dark: false, alert: true },
];

export default function ActionSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  if (!open) return null;
  return (
    <>
      <div className="menu-overlay open" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-head"><h3>Was möchtest du tun?</h3><button onClick={onClose}><CloseIcon /></button></div>
        {items.map((it) => (
          <button key={it.label} className="sheet-item" onClick={() => { onClose(); router.push(it.href); }}>
            <span className={`sheet-icon ${it.dark ? "dark" : ""} ${it.alert ? "alert" : ""}`}>{it.icon}</span>
            <span><strong>{it.label}</strong><span>{it.sub}</span></span>
          </button>
        ))}
        <div style={{ height: 6 }} />
      </div>
    </>
  );
}
