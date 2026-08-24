# Einfach Hausen — OCI operations

## Production contract

The pilot remains one loopback-only Next.js service behind the existing Cloudflare tunnel:

`Internet -> Cloudflare -> sin-kestra tunnel -> 127.0.0.1:3010 -> einfach-hausen.service`

Canonical runtime paths:

- code: `/srv/einfach-hausen`
- environment: `/etc/einfach-hausen.env` (`0600`, never committed)
- SQLite: `/var/lib/einfach-hausen/einfach-hausen.db`
- private media: `/var/lib/einfach-hausen/private`
- persistent legacy/public uploads: `/var/lib/einfach-hausen/uploads`
- local verified backups: `/var/backups/einfach-hausen`
- service: `einfach-hausen.service`
- public health: `/api/health`

The application code still addresses private media as `data/private` and legacy uploads as `public/uploads`. `deploy/einfach-hausen.service` bind-mounts the persistent `/var/lib/einfach-hausen` directories onto those two runtime paths, so a Git update cannot replace customer files. `DATABASE_PATH` is forced to the persistent SQLite path at service start.

## Node 22 requirement

Production build and runtime require Node **22.x**. The systemd unit and `deploy/update-on-oci.sh` use `/home/ubuntu/.nvm/versions/node/v22.23.0/bin`; the deployment script aborts unless the detected major version is exactly 22. Do not work around native-module failures by downgrading `better-sqlite3` or building with Node 20.

Safe probes:

```bash
/home/ubuntu/.nvm/versions/node/v22.23.0/bin/node --version
systemctl cat einfach-hausen.service | grep '/node/v22\|/npm\|DATABASE_PATH\|BindPaths'
```

## Health contract

`GET /api/health` performs a bounded read against SQLite's schema and requires the core `users` table to be available. It returns HTTP 200 only when SQLite is ready, otherwise HTTP 503. The JSON exposes only service name, overall state, the categorical database state, and a timestamp; it never returns database paths, environment values, exception text, credentials, or connection details. Responses are `no-store`.

Local service probe:

```bash
curl -fsS http://127.0.0.1:3010/api/health
```

Expected shape includes `"ok":true` and `"database":"ready"`.

## Persistent storage bootstrap

Before installing/restarting the updated service:

```bash
sudo install -d -o ubuntu -g ubuntu -m 0750 \
  /var/lib/einfach-hausen \
  /var/lib/einfach-hausen/private \
  /var/lib/einfach-hausen/uploads \
  /var/backups/einfach-hausen
```

`deploy/update-on-oci.sh` performs copy-only migration from the historical repo-relative private/upload directories using `rsync --ignore-existing`; it never deletes or overwrites files already present under `/var/lib/einfach-hausen`. Inspect conflicts before the first production restart if both old and persistent locations contain data.

## Backup

Canonical local backup:

```bash
sudo DATABASE_PATH=/var/lib/einfach-hausen/einfach-hausen.db \
  PRIVATE_ROOT=/var/lib/einfach-hausen/private \
  UPLOAD_ROOT=/var/lib/einfach-hausen/uploads \
  BACKUP_ROOT=/var/backups/einfach-hausen \
  /srv/einfach-hausen/scripts/backup-einfach-hausen.sh
```

Each backup is a new timestamped directory containing:

- `einfach-hausen.db` created with SQLite's online backup API
- `private.tar`
- `uploads.tar`
- `manifest.json` with SHA-256 hashes, byte sizes, and expected file counts

The script runs `PRAGMA integrity_check` on the copied database before publishing the backup directory. It refuses to overwrite an existing backup.

Nightly `einfach-hausen-backup.timer` calls `deploy/backup-to-supabase.sh`, which uses the same canonical backup first, bundles that verified directory, and uploads it to the private `einfach-hausen-backups` bucket. Supabase credentials are read from the existing protected runtime environment and are never printed.

## Non-destructive restore proof

Never test recovery by replacing the production database. Validate a backup in a temporary directory:

```bash
/srv/einfach-hausen/scripts/restore-einfach-hausen.sh \
  /var/backups/einfach-hausen/einfach-hausen-YYYYMMDDTHHMMSSZ \
  --dry-run
```

The dry-run verifies all manifest hashes/sizes, extracts database/private/uploads into a temporary directory, runs SQLite `PRAGMA integrity_check`, verifies private/upload file counts, then removes the temporary directory. Production paths are not touched.

For an operator-inspectable recovery candidate, stage into a new empty directory:

```bash
/srv/einfach-hausen/scripts/restore-einfach-hausen.sh BACKUP_DIR --stage /var/tmp/eh-restore-review
```

The restore helper intentionally has no production overwrite mode. After human inspection and a fresh pre-change backup, production replacement is a separate maintenance action while the app is stopped.

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

```bash
sudo /srv/einfach-hausen/deploy/update-on-oci.sh
```

The deployment script requires a clean `main`, verifies Node 22, prepares persistent directories, performs copy-only legacy-media migration, creates a pre-deploy online backup when the persistent DB already exists, fast-forwards to `origin/main`, builds against a disposable `/tmp` SQLite path, reloads systemd, restarts the service, and requires local health success. It does not use `git reset --hard` and does not delete production data.

## Failure handling

If health fails, inspect service logs before changing data:

```bash
sudo systemctl status einfach-hausen.service --no-pager
sudo journalctl -u einfach-hausen.service -n 120 --no-pager
```

Do not delete SQLite, WAL/SHM files, private media, or uploads as a troubleshooting step. Do not remove the old public fallback until the canonical domain/tunnel/Stripe/mail acceptance in `PRODUCTION_HANDOVER.md` is complete.
