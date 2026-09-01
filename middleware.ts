import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// T-0122: every request gets a correlation id. Incoming ids are honored so
// upstream proxies can join traces; otherwise one is generated. The id flows
// to the app via the x-correlation-id request header and back to the client
// on the response for support lookups.
export function middleware(req: NextRequest) {
  const correlationId = req.headers.get("x-correlation-id") ?? crypto.randomUUID();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-correlation-id", correlationId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-correlation-id", correlationId);
  if (process.env.NODE_ENV !== "production") return response;
  const hasSupabaseSession = req.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"));
  if (!hasSupabaseSession) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(req.nextUrl.pathname)}`, req.url));
  return response;
}
export const config = { matcher: ["/app/:path*", "/pro/:path*"] };
