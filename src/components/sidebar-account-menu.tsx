"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CircleHelp, LogOut, Settings, UserRound } from "lucide-react";
import { logoutAction } from "@/app/actions";
import s from "./sidebar-account-menu.module.css";

export function SidebarAccountMenu({
  name,
  initials,
  accountLabel,
  profileHref,
  settingsHref,
  helpHref,
}: {
  name: string;
  initials: string;
  accountLabel: string;
  profileHref: string;
  settingsHref: string;
  helpHref: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open ]);

  return (
    <div className={s.accountMenu} ref={rootRef}>
      <button
        type="button"
        className={s.accountButton}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Kontomenü öffnen"
      >
        <span className={s.accountAvatar} aria-hidden="true">
          {initials}
        </span>
        <span className={s.accountText}>
          <strong>{name}</strong>
          <small>{accountLabel} · Profil öffnen</small>
        </span>
      </button>
      {open && (
        <div className={s.accountPopover} role="menu" aria-label="Kontomenü">
          <Link role="menuitem" href={profileHref}>
            <UserRound size={18} aria-hidden="true" />
            <span>Profil</span>
            <span aria-hidden="true">›</span>
          </Link>
          <Link role="menuitem" href={settingsHref}>
            <Settings size={18} aria-hidden="true" />
            <span>Einstellungen</span>
            <span aria-hidden="true">›</span>
          </Link>
          <Link role="menuitem" href={helpHref}>
            <CircleHelp size={18} aria-hidden="true" />
            <span>Hilfe</span>
            <span aria-hidden="true">›</span>
          </Link>
          <form action={logoutAction}>
            <button role="menuitem" type="submit">
              <LogOut size={18} aria-hidden="true" />
              <span>Abmelden</span>
              <span aria-hidden="true">›</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
