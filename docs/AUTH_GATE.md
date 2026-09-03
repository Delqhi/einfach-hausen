# Auth-Gate-Nachweis (2026-09-03)

Kein `middleware.ts` im Repo — begründet, keine Lücke. Schutz liegt dezentral:

- Jede geschützte Server Component / jeder geschützte Route Handler ruft
  `requireUser()` bzw. `getCurrentUser()` serverseitig auf (`src/lib/auth.ts`:
  Supabase-JWT via `@supabase/ssr`, Rollen nur aus der App-DB, `authMode()`
  fail-closed — `AUTH_MODE=local` wirft in Production).
- Nachweis: `53` Dateien unter `src/app/app`, `src/app/pro` und
  `src/app/api` referenzieren `requireUser`/`getCurrentUser` (Stand 2026-09-03).
  Verifikation: `grep -rln 'requireUser\|getCurrentUser' src/app/app src/app/pro src/app/api | wc -l`
- `local-login`-Route ist per `authMode()` gegated (403 außer `local`).
  Legacy-`mh_session`-Cookies werden in Production nicht akzeptiert.
- Falls je ein zentrales Gate nötig wird (z.B. globale Redirect-Policy), dann
  `src/middleware.ts` mit `createServerClient`-Session-Refresh nachziehen.
  Bis dahin ist "kein Middleware" der dokumentierte Soll-Zustand.
