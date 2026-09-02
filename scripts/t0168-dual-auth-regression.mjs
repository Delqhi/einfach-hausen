import fs from "node:fs";
const browserAuthSource = fs.readFileSync(new URL("../src/lib/supabase.ts", import.meta.url), "utf8");
const proxySource = fs.readFileSync(new URL("../src/proxy.ts", import.meta.url), "utf8");
const authSource = fs.readFileSync(new URL("../src/lib/auth.ts", import.meta.url), "utf8");
const source = fs.readFileSync(new URL("../src/components/AuthContext.tsx", import.meta.url), "utf8");
const protectedPaths = ["/app", "/pro"];
const hasServerAuthBoundary = source.includes("SERVER_AUTH_PREFIXES") && source.includes("pathname === prefix") && source.includes("pathname.startsWith(`${prefix}/`)");
if (!hasServerAuthBoundary) {
  console.error("FAIL dual-auth: AuthProvider must defer /app and /pro to server session auth");
  process.exit(1);
}
for (const path of protectedPaths) {
  if (!source.includes(`"${path}"`)) process.exit(1);
}
if (!browserAuthSource.includes("createBrowserClient")) throw new Error("browser auth must sync SSR cookies");
if (!authSource.includes("your-project.supabase.co")) throw new Error("placeholder Supabase config must fail closed");
if (!proxySource.includes("export function proxy")) throw new Error("Next 16 proxy handler missing");
if (!proxySource.includes("/app/:path*") || !proxySource.includes("/pro/:path*")) throw new Error("production protected route matcher missing");
if (!authSource.includes("process.env.AUTH_MODE || 'supabase'")) throw new Error('default auth mode must be Supabase');
if (!authSource.includes("mode === 'local' && process.env.NODE_ENV === 'production'")) throw new Error('local auth must fail closed in production');
if (!authSource.includes('createServerClient') || !authSource.includes('client.auth.getUser') || !authSource.includes('store.getAll')) throw new Error('server auth must verify Supabase user');
if (!authSource.includes('auth_subject')) throw new Error('identity mapping must bind Supabase subject explicitly');
if (authSource.includes('identity.user_metadata?.role') || authSource.includes('identity.user_metadata?.role ===')) throw new Error('Supabase metadata role must not authorize server access');
if (authSource.includes('INSERT INTO users(email,password_hash,role,first_name,last_name,auth_subject)')) throw new Error('unmapped Supabase identities must fail closed, not self-provision role');
if (!authSource.includes('matches.length !== 1') || !authSource.includes('auth_subject IS NULL')) throw new Error('email migration must be unique and one-time');
console.log("PASS Supabase server-authoritative auth regression");
