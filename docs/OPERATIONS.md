# Einfach Hausen — OCI operations

## Visueller Deploy- und Recovery-Flow

![Production, Backup und Recovery](diagrams/production-recovery-flow.svg)

[Interaktiven Deploy-/Recovery-Flow öffnen](diagrams/production-recovery-flow.html)

## Production contract (HA)

Produktion ist ein HA Next.js Service hinter Cloudflare Tunnel:

`Internet -> Cloudflare -> sin-kestra tunnel -> 127.0.0.1:3010 -> einfach-hausen.service -> Supabase Postgres + Supabase Storage`

Canonical runtime paths:

- code: `/srv/einfach-hausen`
- environment: `/etc/einfach-hausen.env` (`0600`, never committed) — enthält `DATABASE_URL`/`SUPABASE_DB_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- **Primary DB: Supabase Postgres** (HA, managed) — via `DATABASE_URL`
- **Fallback DB (dev/notfall): SQLite** `/var/lib/einfach-hausen/einfach-hausen.db` (`DATABASE_PATH`)
- **Primary Storage: Supabase Storage** (`private/` + `uploads/` Buckets)
- Legacy local mirrors: `/var/lib/einfach-hausen/private`, `/var/lib/einfach-hausen/uploads` (nur Fallback/Migration)
- local verified backups: `/var/backups/einfach-hausen`
- service: `einfach-hausen.service`
- public health: `/api/health` (prüft Supabase Postgres Erreichbarkeit, fallback SQLite)

Die App adressiert `private/`/`uploads/` primär über Supabase Storage Adapter (`src/lib/storage.ts` → `SUPABASE_STORAGE_BUCKET`). Lokale `data/private`/`public/uploads` Bind-Mounts bleiben nur für Migration/Fallback. Produktion ist kein Single-Node SQLite mehr.

## Node 22 requirement

Production build and runtime require Node **22.x**. The systemd unit and `deploy/update-on-oci.sh` use `/home/ubuntu/.nvm/versions/node/v22.23.0/bin`; the deployment script aborts unless the detected major version is exactly 22. Because npm itself uses `#!/usr/bin/env node`, the deploy script also prepends this validated Node 22 directory to `PATH` before `npm ci`/build so lifecycle workers cannot fall back to `/usr/bin/node` 20. Do not work around native-module failures by downgrading `better-sqlite3` or building with Node 20.

Safe probes:

```bash
/home/ubuntu/.nvm/versions/node/v22.23.0/bin/node --version
systemctl cat einfach-hausen.service | grep '/node/v22\|/npm\|DATABASE_PATH\|BindPaths'
```

## Health contract (HA)

`GET /api/health` performs a bounded read against **Supabase Postgres** (primary) und prüft `users` Tabelle; bei Nichtverfügbarkeit fallback auf SQLite-Check. HTTP 200 nur wenn Primary DB ready, sonst 503. JSON enthält nur service, state, database category, timestamp — keine Pfade/Secrets. `no-store`.

Local service probe:

```bash
curl -fsS http://127.0.0.1:3010/api/health
```

Expected shape includes `"ok":true` and `"database":"ready"`.

## Persistent storage bootstrap (HA: Supabase Primary)

Vor Installation/Restart:

```bash
sudo install -d -o ubuntu -g ubuntu -m 0750 \
  /var/lib/einfach-hausen \
  /var/lib/einfach-hausen/private \
  /var/lib/einfach-hausen/uploads \
  /var/backups/einfach-hausen
# Supabase Storage Buckets anlegen (einmalig):
# supabase storage create private --public false
# supabase storage create uploads --public false
```

Produktion schreibt **primär nach Supabase Storage**. `deploy/update-on-oci.sh` migriert bestehende lokale Files idempotent nach Supabase (`--ignore-existing`) und behält lokale Mirrors nur als Fallback. `data/private -> /var/lib/einfach-hausen/private` Links sind nur Migrations-Fallback, nicht Primary. Health prüft Supabase Erreichbarkeit.

## Backup (HA)

Primär: Supabase **Point-in-Time Recovery (PITR)** + Storage-Bucket Versionierung für `private`/`uploads`. Zusätzlich kanonischer lokaler Dump für Notfall:

```bash
sudo SUPABASE_DB_URL="$DATABASE_URL" \
  PRIVATE_ROOT=/var/lib/einfach-hausen/private \
  UPLOAD_ROOT=/var/lib/einfach-hausen/uploads \
  BACKUP_ROOT=/var/backups/einfach-hausen \
  /srv/einfach-hausen/scripts/backup-einfach-hausen.sh
```

Lokaler Dump erzeugt timestamped Verzeichnis mit `supabase-dump.sql` (pg_dump) + `private.tar`/`uploads.tar` + `manifest.json` (SHA-256). Nightly `einfach-hausen-backup.timer` sichert nach PITR zusätzlich lokalen Dump nach `einfach-hausen-backups` Bucket. SQLite `PRAGMA integrity_check` entfällt für Postgres — ersetze durch `pg_checksums`/`pg_dump --verbose`.

## Non-destructive restore proof (HA)

Nie Prod-DB direkt ersetzen. Dry-run gegen Staging-DB:

```bash
/srv/einfach-hausen/scripts/restore-einfach-hausen.sh \
  /var/backups/einfach-hausen/einfach-hausen-YYYYMMDDTHHMMSSZ \
  --dry-run --target staging
```

Dry-run prüft Manifest-Hashes, spielt `pg_dump` in temporäre Staging-DB, verifiziert Storage-Bucket Hashes, dann Cleanup. Für manuelle Inspektion `--stage /var/tmp/eh-restore-review`. Kein direkter Prod-Overwrite — nach PITR-Restore separate Wartungsaktion bei gestoppter App.

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
