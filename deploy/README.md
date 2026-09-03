# OCI deployment

Runtime target: OCI VM `sin-supabase`, loopback port `3010`, published only through the existing Cloudflare tunnel.

Persistent production state:

- SQLite: `/var/lib/einfach-hausen/einfach-hausen.db`
- private media: `/var/lib/einfach-hausen/private`
- legacy/public uploads: `/var/lib/einfach-hausen/uploads`
- verified local backups: `/var/backups/einfach-hausen`

The application still addresses media through repo-relative `data/private` and `public/uploads`; `einfach-hausen.service` bind-mounts the persistent directories onto those paths. The service forces the SQLite runtime path to `/var/lib/einfach-hausen/einfach-hausen.db`.

Production environment file: `/etc/einfach-hausen.env` mode `0600`.

Node contract: build and runtime use Node 22 from `/home/ubuntu/.nvm/versions/node/v22.23.0/bin`. `update-on-oci.sh` aborts on any other major version.

Public route: `https://einfachhausen.de` → Cloudflare tunnel `sin-kestra` → `http://127.0.0.1:3010`.

Health endpoint: `/api/health`; it includes a SQLite readiness/quick-check without returning paths, errors, or secrets.

Backup/recovery:

- `scripts/backup-einfach-hausen.sh` creates an integrity-checked SQLite online backup plus private/upload archives and SHA-256 manifest.
- `deploy/backup-to-supabase.sh` uploads that verified bundle to the existing private Supabase bucket.
- `scripts/restore-einfach-hausen.sh BACKUP_DIR --dry-run` verifies recovery in a temporary directory and never overwrites production.

See `docs/OPERATIONS.md` before any production mutation.
