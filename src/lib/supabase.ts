import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

// Remember-me session policy (single shared browser client).
// - Checked (default, "Angemeldet bleiben"): Supabase persists the session
//   with long-lived cookies (default maxAge, readable by server components).
// - Unchecked: session cookies without Max-Age/Expires — the login ends with
//   the browser session. Reload + refresh keep working in both modes because
//   the policy is applied at cookie-write time on the shared singleton.
// A second isolated client is intentionally NOT created: @supabase/ssr returns
// the cached singleton when `isSingleton` is unset in a browser, so a second
// createBrowserClient call would silently ignore the new cookie options
// (REVIEW-20260910 Befund 1). One client + one write-time policy instead.
let rememberMe = true;

let clientPromise: Promise<SupabaseClient> | null = null;

// Loose option bag: @supabase/ssr passes cookie SerializeOptions
// (sameSite: boolean | "lax" | "strict" | "none"). `any` keeps the serializer
// structurally compatible without re-declaring the vendor type.
type CookieOptionBag = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: any;
  sameSite?: any;
  secure?: any;
  [key: string]: any;
};

type CookieEntry = { name: string; value: string; options?: CookieOptionBag };

function parseDocumentCookies(): { name: string; value: string }[] {
  if (typeof document === "undefined") return [];
  const raw = document.cookie;
  if (!raw) return [];
  return raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf("=");
      if (i < 0) return { name: pair, value: "" };
      const name = pair.slice(0, i).trim();
      const encoded = pair.slice(i + 1);
      try {
        return { name, value: decodeURIComponent(encoded) };
      } catch {
        return { name, value: encoded };
      }
    });
}

function serializeBrowserCookie(name: string, value: string, options?: CookieOptionBag): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options?.path ?? "/"}`);
  if (typeof options?.domain === "string" && options.domain) {
    parts.push(`Domain=${options.domain}`);
  }
  const isDeletion = value === "" || options?.maxAge === 0;
  if (isDeletion) {
    // Deletions MUST keep Max-Age=0 with the original scope, otherwise stale
    // chunks survive sign-out (REVIEW-20260910 Befund 2). Never strip this.
    parts.push("Max-Age=0");
  } else if (rememberMe) {
    // Remember checked: forward the long-lived lifetime Supabase requested.
    if (typeof options?.maxAge === "number") {
      parts.push(`Max-Age=${Math.trunc(options.maxAge)}`);
    }
    if (options?.expires !== undefined) {
      const date =
        options.expires instanceof Date ? options.expires : new Date(options.expires as string);
      if (!Number.isNaN(date.getTime())) parts.push(`Expires=${date.toUTCString()}`);
    }
  }
  // Else remember unchecked: session cookie — intentionally no Max-Age/Expires.
  const sameSiteRaw = typeof options?.sameSite === "string" ? options.sameSite : "lax";
  const sameSite = sameSiteRaw.charAt(0).toUpperCase() + sameSiteRaw.slice(1).toLowerCase();
  parts.push(`SameSite=${sameSite}`);
  const secure =
    typeof options?.secure === "boolean"
      ? options.secure
      : typeof location !== "undefined" && location.protocol === "https:";
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function browserGetAll(): { name: string; value: string }[] {
  return parseDocumentCookies();
}

function browserSetAll(list: CookieEntry[]): void {
  for (const { name, value, options } of list) {
    document.cookie = serializeBrowserCookie(name, value, options);
  }
}

// T-0118 bundle remediation: the @supabase/ssr browser client (with realtime,
// ~250 KB raw) must not sit in the synchronous first-load graph of every route.
// The client is created lazily via dynamic import; `getSupabase()` resolves it.
// All consumers are async (effects/handlers), so they await the promise.
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
        isSingleton: true,
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
        cookies: { getAll: browserGetAll, setAll: browserSetAll },
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

// Remember-me login entry point ("Angemeldet bleiben" on the login page).
// Sets the shared write-time policy, then returns the singleton — no second
// client, so the policy can never be ignored by the SSR singleton cache.
export async function getLoginSupabase(remember: boolean): Promise<SupabaseClient> {
  rememberMe = remember;
  return getSupabase();
}
