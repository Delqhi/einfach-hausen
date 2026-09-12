"use client";
import { useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { EHLogo } from "./primitives";
import s from "./styles.module.css";

const STORAGE_KEY = "eh-sidebar-collapsed";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {collapsed ? (
        <>
          <path d="m11 17 2-2a1 1 0 1 0-3-3" />
          <path d="m18 17 2-2a1 1 0 1 0-3-3" />
        </>
      ) : (
        <>
          <path d="m7 17-2-2a1 1 0 1 1 3-3" />
          <path d="m13 17-2-2a1 1 0 1 1 3-3" />
        </>
      )}
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}

export function EHSidebar({
  homeHref,
  navigation,
  account,
}: {
  homeHref: string;
  navigation: ReactNode;
  account: ReactNode;
}) {
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const collapsed = toggled ?? stored === "1";

  function onToggle() {
    const next = !collapsed;
    setToggled(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      return;
    }
  }

  return (
    <aside
      className={s.workspaceSidebar}
      data-collapsed={collapsed ? "true" : "false"}
    >
      <div className={s.workspaceBrand}>
        <EHLogo href={homeHref} />
        <button
          type="button"
          className={s.workspaceCollapse}
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Seitenleiste einblenden" : "Seitenleiste ausblenden"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>
      <nav aria-label="Hauptnavigation" className={s.workspaceNav}>
        {navigation}
      </nav>
      <div className={s.workspaceAccount}>{account}</div>
    </aside>
  );
}
