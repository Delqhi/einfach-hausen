"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Ctx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx>({
  user: null, session: null, loading: true, signOut: async () => {},
});

// Public surfaces: app entry points plus the complete public platform website
// (DESIGN.md §5.1 — every primary navigation item must be reachable without a
// session). Authorization authority stays on the server; this list only decides
// whether the browser may bounce an anonymous visitor to /login.
const PUBLIC_ROUTES = new Set([
  "/", "/welcome", "/role", "/login", "/register-owner", "/register-pro", "/check-email",
  "/so-funktionierts", "/eigenheimbesitzer", "/leistungen", "/hausakte", "/partner",
  "/preise", "/ueber-uns", "/hilfe", "/kontakt", "/sicherheit",
  "/impressum", "/datenschutz", "/agb", "/barrierefreiheit",
]);
const PUBLIC_PREFIXES = ["/register", "/onboarding", "/partner-invite"];
// Canonical app/pro pages resolve Supabase identity and application role on
// the server. The browser guard must never replace that authority with metadata.
const SERVER_AUTH_PREFIXES = ["/app", "/pro", "/admin"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, s: any) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_ROUTES.has(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const usesServerAuth = SERVER_AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (usesServerAuth) return;
    if (!session && !isPublic) {
      router.replace("/login");
    } else if (session && (pathname === "/welcome" || pathname === "/role")) {
      // Enter through the canonical server-authorized owner route. A provider
      // is redirected to /pro by requireUser using the application DB role.
      router.replace("/app");
    }
  }, [session, loading, pathname, router]);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
