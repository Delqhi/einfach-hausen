import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

// Fail-soft: in HA mode Supabase should be configured; locally fallback to dummy client that explains missing config
export const supabase =
  url && anon
    ? createBrowserClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } })
    : (new Proxy(
        {},
        {
          get(_t, prop) {
            if (prop === "auth") {
              return {
                signUp: async () => ({ data: null, error: { message: "Supabase nicht konfiguriert (.env: SUPABASE_URL/ANON_KEY)" } }),
                signInWithPassword: async () => ({ data: null, error: { message: "Supabase nicht konfiguriert" } }),
                getUser: async () => ({ data: { user: null } }),
                getSession: async () => ({ data: { session: null } }),
                updateUser: async () => ({ data: null, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
                signOut: async () => ({ error: null }),
              };
            }
            return async () => ({ data: null, error: { message: "Supabase nicht konfiguriert" } });
          },
        },
      ) as any);
