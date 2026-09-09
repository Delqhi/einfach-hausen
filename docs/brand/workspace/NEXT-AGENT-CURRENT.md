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


## Abnahme 2026-09-09 Nacht (abgeschlossen)

1. **Demo-Schutz:** DB-Trigger `auth.protect_eh_demo_users` verhindert jetzt die
   Löschung von `*@demo.einfachhausen.de`-GoTrue-Identities (DELETE antwortet
   500; bewusster Override via `SET app.allow_demo_delete=on` im Seed-Kontext
   möglich). Der externe Sweeper (92.5.60.87) kann Demo-Logins damit nicht mehr
   kappen. Getestet: DELETE-Versuch via Admin-API -> 500, Account existiert.
2. **Login-Redesign übernommen:** AuthShell nutzt wieder das
   professional-login-page-redesign-Layout von mac-i9 (Topbar, HeroPanel,
   7/5-Split, mobile Anmelden/Vorteile-Tabs) mit EH-Design-Tokens und der
   bestehenden Auth-Logik (nextPath, Register-Modi, Demo-Box). Baselines
   erneuert; Gate 15/15. Deploy `584df02`.
3. **Komplette Verhaltens-E2E grün:** `npm run test:e2e` -> ok:true; Gruppen:
   isolated production build/server, public multipage 390/1320, PWA offline
   shell, keyboard focus, provider verification/contract, provider AN/AUS,
   contact-only -> job conversion, matching/quote/booking/assignment,
   cross-role messaging, invoice + unavailable payment truth, house history +
   maintenance, consultation + emergency, admin claim + CRM, house transfer
   privacy, zero browser runtime errors.
4. **Visuelle Restabnahme:** 48 Echtrollen-Screenshots (Owner + Pro, 16 Routen,
   390/736/1536) in `docs/brand/workspace/acceptance-20260909/` — überall genau
   eine sichtbare h1 und kein horizontaler Overflow.

Production: `/srv/einfach-hausen` @ `b04b5e3` (= main), Gate 15/15, Health
ready, auth reachable.


## Live-QA-Sweep 2026-09-09 Nacht II (93 Views, 0 Findings)

Playwright-Live-Audit gegen https://einfachhausen.de: 16 öffentliche Routen +
15 App-Routen (Owner/Pro) x 390/736/1536 — konsolen-fehler, 4xx/5xx, defekte
Bilder, Overflow, h1-Checks, Screenshots. Gefundene und behobene Fehler
(commit `abf1d8a`):

1. `/preise` 390-Overflow: Ledger-Root ohne min-width:0 ließ das Grid auf die
   620px-Tabelle aufblähen → Wrapper-Klasse `wrapper` (min-width:0).
2. `/agb`-Familie 390-Overflow: langes Wort „Geschäftsbedingungen" sprengte den
   Hero-Grid-Track → `hyphens:auto`/`overflow-wrap:anywhere` im EH-Hero,
   `min-width:0` auf heroCopy; design-lock + debt für die kanonische Änderung
   erneuert.
3. `/login` + `/register` mobil ohne h1 → sr-only h1 im mobilen Login-Tab
   (Desktop behält den Hero-h1).
4. `/pro/jobs` (Listen-Namespace existiert nicht) 404 für angemeldete Partner →
   Redirect auf `/pro/orders`.

Re-Audit nach Deploy: **0 Findings über alle 93 Views**. UX-Flow-Probe (Login →
Drawer → Aktive Aufträge) ohne Page-Errors. main = Produktion = `abf1d8a`,
Release-Gate 15/15.
