import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// T-0122: every request gets a correlation id. Incoming ids are honored so
// upstream proxies can join traces; otherwise one is generated. The id flows
// to the app via the x-correlation-id request header and back to the client
// on the response for support lookups.
//
// Only a conservative token shape is accepted from the outside: the value is
// echoed into JSON log lines, response headers and a DOM attribute, so an
// unbounded/free-form header would be a log-injection and header-smuggling
// vector. Anything else is replaced by a fresh UUID.
const CORRELATION_ID_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

function resolveCorrelationId(req: NextRequest): string {
  const incoming = req.headers.get("x-correlation-id")?.trim() ?? "";
  return CORRELATION_ID_PATTERN.test(incoming) ? incoming : crypto.randomUUID();
}

export function proxy(req: NextRequest) {
  const correlationId = resolveCorrelationId(req);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-correlation-id", correlationId);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-correlation-id", correlationId);
  if (process.env.NODE_ENV !== "production") return response;
  const hasSupabaseSession = req.cookies.getAll().some(({ name }) => name.startsWith("sb-") && name.includes("-auth-token"));
  if (!hasSupabaseSession) {
    // Preserve the full deep-link (path + query) so /login can return the
    // user to exactly where they were heading; /login re-validates the value.
    const target = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    const login = new URL("/login", req.url);
    login.searchParams.set("next", target);
    const redirect = NextResponse.redirect(login);
    redirect.headers.set("x-correlation-id", correlationId);
    return redirect;
  }
  return response;
}
export const config = { matcher: ["/app/:path*", "/pro/:path*"] };
