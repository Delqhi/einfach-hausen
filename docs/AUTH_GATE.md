# Auth-Gate-Nachweis (Stand 2026-09-05)

Der Schutz ist **zweistufig**: ein zentrales, leichtgewichtiges Gate in
`src/proxy.ts` (Next 16 „Proxy“, Nachfolger von `middleware.ts`) plus die
dezentrale, autoritative Prüfung in jeder Server Component / jedem Route Handler.

## Stufe 1 – `src/proxy.ts` (zentral, nur Vorfilter)

- Matcher: `/app/:path*` und `/pro/:path*`.
- Vergibt bzw. übernimmt die `x-correlation-id`. **Eingehende Werte werden
  validiert** (`^[A-Za-z0-9._:-]{8,128}$`); alles andere wird durch eine frische
  UUID ersetzt, damit der Wert gefahrlos in JSON-Logs, Response-Header und das
  `data-correlation-id`-Attribut wandern kann (keine Log-Injection).
- In Production: ohne `sb-*-auth-token`-Cookie → Redirect nach
  `/login?next=<pfad+query>`. Der Deep-Link wird vollständig (inkl. Query)
  mitgegeben; `/login` validiert ihn erneut über `safeNextPath()`
  (`src/lib/safe-redirect.ts`) und navigiert nach erfolgreichem Login dorthin.
  Nur same-origin-Pfade sind erlaubt (`//evil`, Schemes, Backslashes,
  Steuerzeichen und Auth-Seiten selbst fallen auf `/app` zurück).
- Das Proxy-Gate prüft nur die **Existenz** eines Cookies, nie dessen Gültigkeit.
  Es ist kein Ersatz für Stufe 2.

## Stufe 2 – `requireUser()` / `getCurrentUser()` (autoritativ)

- Jede geschützte Server Component / jeder geschützte Route Handler ruft
  `requireUser()` bzw. `getCurrentUser()` serverseitig auf (`src/lib/auth.ts`:
  Supabase-JWT via `@supabase/ssr`, Rollen nur aus der App-DB, `authMode()`
  fail-closed — `AUTH_MODE=local` wirft in Production).
- Verifikation: `grep -rln 'requireUser\|getCurrentUser' src/app/app src/app/pro src/app/api | wc -l`
- `local-login`-Route (`/api/auth/local-login`) ist per `authMode()` gegated
  (403 außer `local`), nutzt dasselbe `login`-Rate-Limit wie die Server-Actions
  und stellt die Session ausschließlich über `createSession()` aus — damit sind
  Cookie-Name (`SESSION_COOKIE_NAME`-Override inklusive), Cookie-Policy und die
  Ein-Session-pro-User-Rotation identisch zu allen anderen Login-Pfaden.
  `getLocalUser()` liest denselben Cookie-Namen (`cookieName()`).
- Legacy-`mh_session`-Cookies werden in Production nicht akzeptiert.
