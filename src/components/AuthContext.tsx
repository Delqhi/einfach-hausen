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

const PUBLIC_ROUTES = ["/", "/welcome", "/role", "/login", "/register-owner", "/register-pro", "/check-email", "/datenschutz", "/impressum"];
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
    const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/register") || pathname.startsWith("/onboarding");
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
