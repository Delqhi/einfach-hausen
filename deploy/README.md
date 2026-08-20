# OCI deployment

Initial runtime target: OCI VM `sin-supabase`, loopback port `3010`, published only through the existing Cloudflare tunnel.

Persistent state:

- `/var/lib/einfach-hausen/einfach-hausen.db`
- `/srv/einfach-hausen/data/private` (kept across syncs)
- `/srv/einfach-hausen/public/uploads` (kept across syncs)

Production environment file: `/etc/einfach-hausen.env` mode `0600`.

Public route: `https://einfach-hausen.delqhi.com` → Cloudflare tunnel `simone-api` → `http://127.0.0.1:3010`.

Health endpoint: `/api/health`.
