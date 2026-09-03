import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

// T-0118 bundle remediation: the @supabase/ssr browser client (with realtime,
// ~250 KB raw) must not sit in the synchronous first-load graph of every route.
// The client is created lazily via dynamic import; `getSupabase()` resolves it.
// All consumers are async (effects/handlers), so they await the promise.
let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      // Fail-soft without configuration: previews and local runs without
      // Supabase env vars must not crash the page (createBrowserClient throws
      // on empty url/key). Callers handle the rejection; public marketing
      // pages never touch this path. Production always configures both vars.
      if (!url || !anon) {
        throw new Error(
          "Supabase ist nicht konfiguriert: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY fehlen. Öffentliche Seiten funktionieren ohne Login nicht-interactive; App-Bereiche benötigen die Supabase-Umgebungsvariablen."
        );
      }
      const { createBrowserClient } = await import("@supabase/ssr");
      return createBrowserClient(url, anon, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      }) as unknown as SupabaseClient;
    })();
  }
  return clientPromise;
}

// Fail-soft legacy export: in HA mode Supabase should be configured. The proxy
// rejects any access with an explanatory error so accidental eager usage fails
// loudly at runtime instead of silently pulling the vendor graph back in.
export const supabase = new Proxy({} as SupabaseClient, {
  get() {
    throw new Error(
      "T-0118: the browser Supabase client is lazy now — use `await getSupabase()` from @/lib/supabase instead of the eager `supabase` export."
    );
  },
});
