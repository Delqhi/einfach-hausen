# Demo-Accounts (BEFRISTET — Demo-Phase)

| Zugang | Benutzername | Passwort | Wohin |
| --- | --- | --- | --- |
| Kunden-App | `kunde` | `admin` | `/login` → `/app` |
| Handwerker-App | `handwerker` | `admin` | `/login` → `/pro` |
| CRM/Admin | — (nur Passwortfeld) | `admin` | `/admin/login` |

Die Login-Seite zeigt die Demo-Box mit Ein-Klick-Buttons; Benutzernamen gehen auch per Hand (ohne `@` → Demo-Mapping).

## Technik
- Supabase-User `kunde@demo.einfachhausen.de` + `handwerker@demo.einfachhausen.de` (Passwort `admin`, confirmed). Anlegen: `node scripts/seed-demo-users.mjs` (braucht Service-Key).
- App-Zeilen entstehen beim ersten Login automatisch (`ensureDemoAppRow`, feste Rollen).
- CRM: Ausnahme in `adminPasswordMatches` (nur wenn Demo an).

## Demo-Inhalte (Produktions-DB, OCI)
Gesetzt per `/tmp/demo-seed.sql`-Muster direkt in `/var/lib/einfach-hausen/einfach-hausen.db`:
- Kunde (id 7): Adresse Ahornweg 12, 86150; Jobs 9001-9003 (2 offen, 1 quoted mit Demo-Angebot 180 €); Wartung 9001 (+6 Tage).
- Handwerker (id 8): Demo-Betrieb (verifiziert, aktiver Vertrag); Dispatches auf 9001-9003.
Ids 9001+ sind Demo-reserviert (INSERT OR IGNORE, Re-Run sicher).

## Kill-Switch
`DEMO_LOGIN_ENABLED=0` → Box/Mapping/Admin-Ausnahme aus. Für Produktion in der Build-Env setzen.

## Entfernung nach der Demo-Phase
1. `DEMO_LOGIN_ENABLED=0` setzen (sofort wirksam nach Deploy).
2. Supabase-Demo-User deaktivieren/löschen.
3. Löschen: `src/lib/demo-accounts.ts`, Login-Box in `src/app/login/page.tsx`, Ausnahme in `src/lib/admin-auth.ts`, `scripts/seed-demo-users.mjs`, diese Datei.
