# Aktuelle Übernahme · 2026-09-09 (Abend, Prime-Agent)

## Erledigt diese Session (alles live verifiziert)

1. **Auth-/Cloudflare-Blocker gelöst (nicht via Cloudflare-Konfiguration):**
   `supabase.delqhi.com` antwortete 530/1033 (Argo-Tunnel ohne Connector). Der
   Haupttunnel `simone-api` (`/home/ubuntu/.cloudflared/config.yml`) lief seit
   11:07Z nicht (Unit `cloudflared.service` disabled; alle anderen Tunnels laufen
   als nackte Ubuntu-Prozesse). Tunnel als User-Prozess neu gestartet und
   dauerhaft als User-Systemd-Unit gesichert:
   `~/.config/systemd/user/cloudflared-main.service` (enabled, Restart=always,
   Linger=yes). Kein sudo, kein Schutz-Regel-Eingriff nötig. Die berichtete
   403/1010-Diagnose war veraltet; echte Ursache war der tote Tunnel.
   - `GET /auth/v1/health` (anon key): 200 (GoTrue v2.184.0)
   - `/api/health`: `state:ready`, `auth_authority: reachable`

2. **Produktion deployt:** `/srv/einfach-hausen` `f554939` -> `e45812e`
   (enthält PR #71/#72/#73 + #74 + mein Fix-Commit `3c0cab3`).
   Weg: Backup (tar unter /var/backups/einfach-hausen) -> ff-merge -> `npm ci`
   -> Release-Gate **15/15** (mit `/etc/einfach-hausen-build.env`) ->
   MainPID-Kill-Restart (kein sudo, `Restart=always`).
   - HEAD: `e45812e29a786d233727d89599e46bacac7afdf4`
   - Public: `/` 200, `/api/health` 200, `/leistungen` 200, `/login` 200

3. **Fix im Deploy (`3c0cab3`, auf GitHub main):**
   - `src/app/design-system.css`: im Atelier-02-Workspace war der mobile
     Drawer (Hamburger) für Owner UND Pro unsichtbar (legacy
     `.mobile-menu{display:none}`); reaktiviert innerhalb des Frames
     (<=999px), >=1000px weiter versteckt. Live bei 390px verifiziert.
   - `scripts/e2e.mjs`: Verhaltens-E2E an die approbierte Atelier-02-Wirklichkeit
     angeglichen (Hero-H1, Composer-Label, Register-Felder, EHStatus-Texte,
     stabile Layout-Anker `#provider-content`/`#owner-main-content`, Team-Page-
     Heading, `firma-` -> `ehprov-` Präfix).

4. **Demo-Identitäten:** kunde/handwerker@demo.einfachhausen.de wurden von einem
   externen Prozess gelöscht und per `scripts/seed-demo-users.mjs` wiederholt
   neu angelegt; aktuelle Logins landen auf `/app` bzw. `/pro`.

## AKUTER EXTERNER BLOCKER (behindert nur noch die Verhaltens-E2E)

Ein externer Prozess löscht GoTrue-User **während der Läufe**:

- Quelle: `remote_addr 92.5.60.87` (extern, nicht dieser Host), referer
  `https://shopsin.delqhi.com`, `user-agent: node`, gültiger
  `service_role`-Key (Auditeintrag `actor_username=service_role`).
- Muster: löscht laufend min. `firma-*`, `ehprov-*`, `maria-*` (inzwischen offenbar
  ALLE User inkl. der öffentlichen Demo-Accounts) — 6 Zyklen allein heute Abend.
- Folge: die Verhaltens-E2E kann identities nicht zuverlässig überleben lassen
  (Register -> ~2 min später gelöscht); Demo-Logins kippen zwischendurch auf
  „E-Mail oder Passwort falsch“.
- **Benötigt:** auf der Maschine hinter 92.5.60.87 (Jerry-Mac? ehem. Worker via
  shopsin) diesen Cleanup-Job stoppen/pausieren ODER dessen service_role-Key
  rotieren. Danach: `node scripts/seed-demo-users.mjs` einmal ausführen und
  `npm run test:e2e` mit Supabase-Env starten (siehe unten).

## So läuft die Verhaltens-E2E (wenn der Sweeper aus ist)

```bash
cd /srv/einfach-hausen
export PATH="/home/ubuntu/.nvm/versions/node/v22.23.0/bin:$PATH"
export SUPABASE_URL=https://supabase.delqhi.com
export SUPABASE_ANON_KEY=<aus Produktions-Env oder Infisical — ACHTUNG: der
  Infisical-Stand SUPABASE_SERVICE_ROLE_KEY ist STALE (401)>
export SUPABASE_SERVICE_KEY=<autoritativer Key aus der laufenden Produktion>
npm run test:e2e
```

Hinweis: `scripts/release-gate.mjs` läuft NIE `scripts/e2e.mjs`; deshalb blieb der
E2E-Drift (alte Hero-Copy etc.) unentdeckt. Gate 15/15 deckt nur lint/types/
security/fixtures/build/a11y/visual/perf ab.

## Offen nach dem Sweeper-Stopp

- Verhaltens-E2E komplett grün (Start-Step-0 + Register/Admin/Team-Flows sind
  schon an die neue Shell angeglichen; Rest der Journey ungetestet).
- Visuelle Abnahme Owner/Pro 390/736/1536 + mehrseitiger Druck.
- Taskplan: EH-BRAND-07-WORKSPACE (aktuell `blocked` mit Verweis auf dieses Dok).
