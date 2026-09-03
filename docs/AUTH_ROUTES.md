# Auth-Routen-Entscheid (2026-09-03)

Kein `api/auth/callback|logout|session|me` im Repo — begründet, keine Lücke.

- Login läuft über den Browser-Client (`src/app/login/page.tsx` →
  `signInWithPassword`, Supabase GoTrue `/token`), Registrierung über
  `registerAction` (Admin-API `createUser`, `email_confirm: true`) plus
  `establishSupabaseSession()` (`src/lib/auth.ts`). `loginAction`
  (`src/app/actions.ts`) zieht seit 2026-09-03 ebenfalls
  `establishSupabaseSession()` nach (vorher nur mh-Cookie).
- Es gibt keinen OAuth-/PKCE-/Magic-Link-Flow (`detectSessionInUrl: false`,
  `src/lib/supabase.ts`), also braucht kein Code einen
  Code-Exchange-Callback. Logout = `logoutAction`/`destroySession()` (Server
  Action, inkl. `signOut` + Cookie-Cleanup), Session-Identität = `getCurrentUser()`
  (Server), UI-State = `AuthContext` (keine Security Boundary).
- Falls später OAuth/SSO oder Magic Links kommen: dann
  `src/app/auth/callback/route.ts` mit `createServerClient`-Code-Exchange
  nachziehen. Bis dahin ist "keine Callback-Route" der dokumentierte
  Soll-Zustand, kein TODO.
