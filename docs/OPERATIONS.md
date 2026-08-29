# Einfach Hausen — OCI operations

## Visueller Deploy- und Recovery-Flow

![Production, Backup und Recovery](diagrams/production-recovery-flow.svg)

[Interaktiven Deploy-/Recovery-Flow öffnen](diagrams/production-recovery-flow.html)

## Production contract — OCI + SIN Supabase OSS

Produktion läuft als Next.js Service hinter Cloudflare Tunnel auf OCI. **SIN Supabase OSS auf OCI** ist die Auth-Autorität (`AUTH_MODE=supabase`); die App-Datenbank ist SQLite (`DATABASE_PATH`). Supabase Cloud ist nicht Teil der Zielarchitektur. Aussagen wie HA/PITR/Failover gelten nur nach frischem Betriebsnachweis für die tatsächlich betriebene Konfiguration (aktuell nicht nachgewiesen):

`Internet -> Cloudflare -> sin-kestra tunnel -> 127.0.0.1:3010 -> einfach-hausen.service -> SQLite (persistenter Pfad) + SIN Supabase OSS (Auth)`

Nach dem verifizierten Mac→GitHub-Release ist **OCI-VM der kanonische Engineering-/Prime-Agent-Host**. GitHub ist die einzige Code-Transfergrenze; ein Dirty-Working-Tree wird niemals direkt vom Mac nach OCI kopiert.

Canonical runtime paths:

- code: `/srv/einfach-hausen`
- environment: `/etc/einfach-hausen.env` (`0600`, never committed) — enthält `AUTH_MODE=supabase`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_PATH`
- **App-Datenbank (Produktion): SQLite** `/var/lib/einfach-hausen/einfach-hausen.db` (`DATABASE_PATH`, `better-sqlite3`) — Single Node mit Backup-Pflicht
- **Auth-Autorität: SIN Supabase OSS (self-hosted)** `https://supabase.delqhi.com` — serverseitige Session-Verifikation (`@supabase/ssr`); Supabase ist nicht die App-Datenbank
- **Storage: kein Supabase-Storage-Adapter implementiert** (`src/lib/storage.ts` existiert nicht); `private/`/`uploads/` sind persistente lokale Verzeichnisse per Symlink (`/var/lib/einfach-hausen/...`)
- local verified backups: `/var/backups/einfach-hausen`
- service: `einfach-hausen.service`
- public health: `/api/health` (prüft die SQLite-Datenbank; 200 nur wenn `users`-Schema ready)

Die App adressiert `private/`/`uploads/` über das lokale Dateisystem (persistente Verzeichnisse + Symlinks, siehe `deploy/update-on-oci.sh`). Ein Supabase-Storage-Adapter ist nicht Teil des laufenden Codes.

## Node 22 requirement

Production build and runtime require Node **22.x**. The systemd unit and `deploy/update-on-oci.sh` use `/home/ubuntu/.nvm/versions/node/v22.23.0/bin`; the deployment script aborts unless the detected major version is exactly 22. Because npm itself uses `#!/usr/bin/env node`, the deploy script also prepends this validated Node 22 directory to `PATH` before `npm ci`/build so lifecycle workers cannot fall back to `/usr/bin/node` 20. Do not work around native-module failures by downgrading `better-sqlite3` or building with Node 20.

Safe probes:

```bash
/home/ubuntu/.nvm/versions/node/v22.23.0/bin/node --version
systemctl cat einfach-hausen.service | grep '/node/v22\|/npm\|DATABASE_PATH\|BindPaths'
```

## Health contract (HA)

`GET /api/health` performs a bounded read against the **SQLite** app database (`users` table via `sqlite_schema`). HTTP 200 nur wenn die Datenbank bereit ist, sonst 503. JSON enthält nur service, state, database category, timestamp — keine Pfade/Secrets. `no-store`.

Local service probe:

```bash
curl -fsS http://127.0.0.1:3010/api/health
```

Expected shape includes `"ok":true` and `"database":"ready"`.

## Persistent storage bootstrap

Vor Installation/Restart:

```bash
sudo install -d -o ubuntu -g ubuntu -m 0750 \
  /var/lib/einfach-hausen \
  /var/lib/einfach-hausen/private \
  /var/lib/einfach-hausen/uploads \
  /var/backups/einfach-hausen
```

Produktion schreibt `private/`/`uploads/` in die persistenten lokalen Verzeichnisse; die Symlinks `data/private -> /var/lib/einfach-hausen/private` und `public/uploads -> /var/lib/einfach-hausen/uploads` sind der verifizierte Runtime-Mechanismus (siehe `deploy/update-on-oci.sh`). Ein Supabase-Storage-Cutover ist nicht implementiert.

## Backup (HA)

Primär: SQLite-Online-Backup vor jedem Deploy (`deploy/update-on-oci.sh`) nach `/var/backups/einfach-hausen` + `scripts/backup-einfach-hausen.sh`; `private`/`uploads` via tar. Ein Supabase-PITR-Pfad ist nicht Teil des betriebenen Stacks (historische HA-Planung, nie ausgeführt). Notfall-Dump:

```bash
sudo SUPABASE_DB_URL="$DATABASE_URL" \
  PRIVATE_ROOT=/var/lib/einfach-hausen/private \
  UPLOAD_ROOT=/var/lib/einfach-hausen/uploads \
  BACKUP_ROOT=/var/backups/einfach-hausen \
  /srv/einfach-hausen/scripts/backup-einfach-hausen.sh
```

Backup-Pfad: `/var/backups/einfach-hausen` (+ `scripts/backup-einfach-hausen.sh`). Die SQLite-Datenbank wird vor jedem Deploy online gesichert; `private.tar`/`uploads.tar` sichern Medien. Restore-Proof erfolgt gegen eine Kopie, nie gegen die Produktions-DB.

## Non-destructive restore proof (HA)

Nie Prod-DB direkt ersetzen. Dry-run gegen Staging-DB:

```bash
/srv/einfach-hausen/scripts/restore-einfach-hausen.sh \
  /var/backups/einfach-hausen/einfach-hausen-YYYYMMDDTHHMMSSZ \
  --dry-run --target staging
```

Historischer HA-Restore-Proof (Supabase PITR/`pg_dump`) ist nie implementiert worden und beschreibt nicht den betriebenen Stack. Geltender Restore-Pfad: Backup aus `/var/backups/einfach-hausen` gegen eine Kopie der SQLite-DB einspielen und verifizieren, nie direkt gegen die Produktions-DB.

## Reproducible service, tunnel, and Kestra probes

Run these without printing `/etc/einfach-hausen.env`:

```bash
systemctl is-active einfach-hausen.service
systemctl is-active einfach-hausen-kestra-proxy.socket
systemctl is-active einfach-hausen-backup.timer
curl -fsS http://127.0.0.1:3010/api/health
curl -fsS http://172.28.50.1:3010/api/health
systemctl status cloudflared --no-pager
cloudflared tunnel info sin-kestra
```

The first curl proves the app/service path. The second proves the private systemd socket proxy used by Kestra. `cloudflared tunnel info sin-kestra` proves the named tunnel connector state without exposing credentials.

Kestra flow: `einfach.hausen/einfach_hausen_health` (`deploy/kestra/einfach-hausen-health.yml`) requests `http://172.28.50.1:3010/api/health` every ten minutes. Inspect recent executions in the existing Kestra UI/API and require successful `app_health` executions; do not expose Kestra tokens in shell output or evidence.

## Deployment

Run the deployment as the `ubuntu` application owner; the script elevates only its filesystem/systemd operations:

```bash
/srv/einfach-hausen/deploy/update-on-oci.sh
```

The deployment script requires `main` with no changes except the two verified runtime media links, verifies and activates Node 22 for npm and child processes, prepares persistent directories, performs copy-only legacy-media migration, creates a pre-deploy online backup when the persistent DB already exists, fast-forwards to `origin/main`, builds against a disposable `/tmp` SQLite path, reloads systemd, restarts the service, and requires local health success. It does not use `git reset --hard` and does not delete production data.

## Failure handling

If health fails, inspect service logs before changing data:

```bash
sudo systemctl status einfach-hausen.service --no-pager
sudo journalctl -u einfach-hausen.service -n 120 --no-pager
```

Do not delete SQLite, WAL/SHM files, private media, or uploads as a troubleshooting step. Do not remove the old public fallback until the canonical domain/tunnel/Stripe/mail acceptance in `PRODUCTION_HANDOVER.md` is complete.

Do not delete SQLite, WAL/SHM files, private media, or uploads as a troubleshooting step. Do not remove the old public fallback until the canonical domain/tunnel/Stripe/mail acceptance in `PRODUCTION_HANDOVER.md` is complete.

## Post-convergence production live check (2026-08-25, task T-0003)

Verified live state after repository convergence to `f0198ee`:

- `/api/health` returned HTTP 200 with `ok=true`, `database=ready` (public via Cloudflare and loopback on OCI).
- All documented public routes returned HTTP 200: `/`, `/leistungen`, `/preise`, `/so-funktionierts`, `/sicherheit`, `/eigenheimbesitzer`, `/partner`, `/impressum`, `/datenschutz`, `/agb`, `/barrierefreiheit`, `/kontakt`, `/ueber-uns`, `/hilfe`, `/login`, `/register`.
- Deployed commit on OCI (`/srv/einfach-hausen` `git rev-parse HEAD`) is `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`, exactly the verified release. Runtime process runs Node `v22.23.0` from the validated nvm path; service `active`.
- No redeploy required for convergence commit `f0198ee`: `git diff --name-only dcd53ca1..f0198ee` contains no paths under `src/`, `deploy/`, package manifests, `next.config.ts` or middleware — the diff is docs/tooling only.
- Login page reachable; the platform has no fixed demo accounts by design (E2E creates random credentials), so no demo login check applies.
- Access path used: SSH relayed through the trusted fleet Mac; direct non-interactive SSH from this agent host to sin-supabase is not provisioned.
