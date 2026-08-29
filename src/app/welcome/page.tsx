"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function WelcomePage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      // Canonical role resolution happens server-side from the application
      // identity. Providers entering /app are redirected to /pro by requireUser.
      router.replace("/app");
    }
  }, [session, loading, router]);

  return (
    <div className="center-page page" style={{ justifyContent: "space-between", padding: "70px 32px 60px" }}>
      <div className="welcome-logo">
        <svg width="150" height="110" viewBox="0 0 120 88" fill="none" aria-hidden="true">
          <path d="M30 42 L66 14 L92 30 V82 H44" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M55 82 V62 a8 8 0 0116 0 V82" stroke="#14735c" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <div className="welcome-logo-text">
          <span className="wl-1">einfach</span>
          <span className="wl-2">hausen</span>
        </div>
        <p className="welcome-tag">Zuhause easy.</p>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn-primary btn-full" onClick={() => router.push("/role")}>Los geht&apos;s</button>
        <button className="btn-ghost btn-full" onClick={() => router.push("/login")}>Ich habe schon ein Konto</button>
      </div>
      <div className="home-indicator" />
    </div>
  );
}
