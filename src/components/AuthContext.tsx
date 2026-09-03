"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

type Ctx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx>({
  user: null, session: null, loading: true, signOut: async () => {},
});

// The browser guard is convenience-only: server components and actions remain
// the authorization authority. It therefore protects ONLY the known private
// app surfaces (client-side UX bounce to /login) and never touches unknown
// routes (404s must render, not redirect) or public marketing pages.
const PRIVATE_PREFIXES = [
  "/auftraege", "/meine-angebote", "/mein-haus", "/historie", "/ki-chat",
  "/profil", "/einstellungen", "/benachrichtigungen", "/notifications",
  "/notfall", "/ansprechpartner", "/dashboard", "/anfragen-pro",
];
// Canonical app/pro pages resolve Supabase identity and application role on
// the server. The browser guard must never replace that authority with metadata.
const SERVER_AUTH_PREFIXES = ["/app", "/pro", "/admin"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    // T-0118: the browser Supabase client is lazy (async chunk) — await it.
    getSupabase().then((supabase) => {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data }: any) => {
        if (cancelled) return;
        setSession(data.session);
        setLoading(false);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_e: any, s: any) => {
        if (cancelled) return;
        setSession(s);
      });
      if (cancelled) sub.subscription.unsubscribe();
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading) return;
    const usesServerAuth = SERVER_AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (usesServerAuth) return;
    const isPrivate = PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (!session && isPrivate) {
      router.replace("/login");
    } else if (session && (pathname === "/welcome" || pathname === "/role")) {
      // Enter through the canonical server-authorized owner route. A provider
      // is redirected to /pro by requireUser using the application DB role.
      router.replace("/app");
    }
  }, [session, loading, pathname, router]);

  async function signOut() {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    setSession(null);
  }

  return <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
