# Einfach Hausen — Production Handover and Continuation Runbook

**Status snapshot:** 2026-08-24, after T-0037 operational hardening. Live production acceptance still requires the explicit checks below.

This document is the canonical continuation point for a new agent. It deliberately records both completed work and the one known external propagation blocker. Do not infer that the public cutover is complete until the verification checklist below passes.

## 0. Latest continuation checkpoint — 2026-08-24

**Canonical next-agent entry:** [`NEXT_AGENT.md`](NEXT_AGENT.md).

### Current code/worktree

- The local tree is an active multi-worker gauntlet and contains substantial intentional uncommitted work from completed/in-progress tasks. Preserve and classify it before any cleanup.
- T-0037 and T-0038 are the current critical in-progress gates at this snapshot; use `sin-gpt-web-state` as the only authority for subsequent task changes.
- Do not infer deployability from this handover alone. T-0040/T-0044/T-0041 still gate independent acceptance, integration/push, and production deployment.

### Deployment contract — not yet production acceptance

A prior OCI deployment attempt failed because its build shell used Node 20.20.2 while `better-sqlite3@13` requires Node 22+. T-0037 hardens this contract: `deploy/update-on-oci.sh` now resolves the configured Node 22 binary directly, aborts unless its major version is 22, and `einfach-hausen.service` starts with the same Node 22 installation. The deployment build uses a disposable `/tmp` SQLite path rather than production data.

**Next exact action:** after the gauntlet-approved tree is committed and pushed, run the production deployment from T-0041, then execute the local service, persistent-storage, tunnel, Kestra, and public smoke checks. Do not downgrade dependencies as a workaround.

### Persistent storage checkpoint

- Database: `/var/lib/einfach-hausen/einfach-hausen.db`
- Private files: `/var/lib/einfach-hausen/private`
- Upload persistence: `/var/lib/einfach-hausen/uploads`
- Pre-deploy SQLite backup: `/var/lib/einfach-hausen/backups/pre-e3a5343.db`

Do not overwrite or delete these paths during deployment.

## 1. Current state in one minute

| Area | State | Evidence / next action |
|---|---|---|
| Repository | Healthy baseline | `main` contains `612ca4b Switch production docs to einfachhausen.de` after security hardening `4628c27` |
| Production runtime | Healthy | OCI service `einfach-hausen.service` and local `http://127.0.0.1:3010/api/health` returned OK in the last verified run |
| Production app URL | Configured | `NEXT_PUBLIC_APP_URL=https://einfachhausen.de` on OCI |
| Cloudflare tunnel | Configured | `einfachhausen.de` and `www.einfachhausen.de` route to `http://127.0.0.1:3010` through `sin-kestra` |
| Cloudflare zone | Prepared | DNS, TLS and security settings prepared; public activation depends on authoritative NS delegation |
| STRATO registrar change | Submitted/saved | STRATO accepted Cloudflare nameservers; registry propagation was still pending at the last check |
| Public DNS at last check | **Not switched yet** | `.de` parent and public resolvers still returned `docks12.rzone.de` and `shades08.rzone.de` |
| Old temporary route | Healthy fallback | `einfach-hausen.delqhi.com/api/health` returned OK; do not remove before new domain is fully verified |
| Mail DNS | Prepared for migration | STRATO MX/DKIM/DMARC/autoconfig/autodiscover values were copied/prepared in Cloudflare; re-check after activation |
| Stripe | New canonical URL documented | `https://einfachhausen.de/api/stripe/webhook`; verify the live Stripe endpoint and signing secret after DNS activation |

## 2. Target architecture

```text
Internet
  -> Cloudflare zone: einfachhausen.de
      -> Cloudflare security/TLS
      -> Cloudflare Tunnel: sin-kestra
      -> 127.0.0.1:3010
      -> systemd: einfach-hausen.service
      -> Next.js application
```

The app must remain loopback-only. Do **not** expose port `3010` directly to the Internet.

### Runtime locations

- Code: `/srv/einfach-hausen`
- Environment: `/etc/einfach-hausen.env` (mode `0600`, never commit)
- Database: `/var/lib/einfach-hausen/einfach-hausen.db`
- Private media: `/var/lib/einfach-hausen/private`, bind-mounted to `/srv/einfach-hausen/data/private`
- Legacy/public upload area: `/var/lib/einfach-hausen/uploads`, bind-mounted to `/srv/einfach-hausen/public/uploads`
- Verified local backups: `/var/backups/einfach-hausen`
- Service: `einfach-hausen.service`
- Tunnel: `sin-kestra`
- Health endpoint: `/api/health`

The existing Kestra health path remains private:

`172.28.50.1:3010 -> systemd-socket-proxyd -> 127.0.0.1:3010`

## 3. Domain cutover status

### Desired Cloudflare nameservers

- `aaron.ns.cloudflare.com`
- `josephine.ns.cloudflare.com`

The STRATO nameserver change was saved/submitted before this handover.

### Last observed authoritative public delegation

The last checks against `a.nic.de`, `1.1.1.1`, and `8.8.8.8` still returned:

- `docks12.rzone.de`
- `shades08.rzone.de`

This means **do not mark the domain live yet** solely because the STRATO UI accepted the change.

### Required Cloudflare records

- `einfachhausen.de` → Cloudflare Tunnel target for `sin-kestra`
- `www.einfachhausen.de` → same tunnel/application, then redirect to apex

At the last local inspection, the tunnel target was:

`818df379-5d51-4f83-9cd9-d0f5d327b438.cfargotunnel.com`

Do not create duplicate A records pointing at the OCI host. The tunnel is the intended public ingress.

## 4. Cloudflare security baseline

Prepared settings:

- SSL/TLS mode: **Full (strict)**
- Always Use HTTPS: enabled
- Minimum TLS: **1.2**
- TLS 1.3: enabled
- HTTP/3: enabled
- Browser Integrity Check: enabled
- Cloudflare security level: Medium
- `www` intended to redirect to the apex domain

After activation, verify these settings through Cloudflare/API instead of relying only on this document. Enable DNSSEC only after the zone is active and follow Cloudflare's exact registrar/DS instructions; do not guess a DS record.

## 5. Mail DNS that must survive the cutover

Before replacing the authoritative DNS, the active STRATO DNS exposed:

- MX: `5 smtpin.rzone.de.`
- DMARC: `v=DMARC1;p=reject;`
- DKIM selector: `strato-dkim-0002._domainkey`
- Autodiscover SRV: `_autodiscover._tcp` → `0 100 443 autoconfigure.strato.de.`
- Autoconfig: `autoconfig` → `autoconfigure.strato.de.`

The exact DKIM public key is intentionally not duplicated here; read it from current DNS/Cloudflare and compare against STRATO before changes.

**Post-cutover requirement:** query the active Cloudflare-authoritative zone and compare MX, DMARC, DKIM and autoconfig/autodiscover with the intended STRATO mail configuration before declaring mail migration complete.

## 6. Production environment contract

```text
NEXT_PUBLIC_APP_URL=https://einfachhausen.de
DATABASE_PATH=/var/lib/einfach-hausen/einfach-hausen.db
STRIPE_SECRET_KEY=<runtime secret>
STRIPE_WEBHOOK_SECRET=<runtime secret>
STRIPE_CURRENCY=eur
ADMIN_PASSWORD=<runtime secret>
```

Secrets are canonical in SIN-Infisical where applicable and must never be copied into Git, screenshots, chat output, evidence files or documentation.

## 7. Stripe cutover

Canonical intended endpoint:

`https://einfachhausen.de/api/stripe/webhook`

Relevant application routes derive their origin from `NEXT_PUBLIC_APP_URL`.

After DNS activation:

```bash
cd /Users/jeremy/dev/wow-my-zsh
shared/skills/sin-stripe/scripts/sin-stripe ready --project einfach-hausen
shared/skills/sin-stripe/scripts/sin-stripe doctor --project einfach-hausen \
  --webhook-url https://einfachhausen.de/api/stripe/webhook
```

Inspect the live Stripe endpoint and ensure its signing secret matches the OCI runtime. Do not create duplicate endpoints unnecessarily. Never charge a real customer merely as a health check.

## 8. Immediate continuation checklist

### A. Check registry propagation

```bash
for r in a.nic.de 1.1.1.1 8.8.8.8; do
  echo "@$r"
  dig +short NS einfachhausen.de @$r
done
```

Success requires the two Cloudflare nameservers consistently.

### B. Confirm Cloudflare zone is active

Verify through the existing Cloudflare account/API. Credentials are outside Git; never print tokens.

### C. Verify public DNS and HTTPS

```bash
dig +short CNAME einfachhausen.de
curl -fsSI https://einfachhausen.de
curl -fsS https://einfachhausen.de/api/health
curl -fsSI https://www.einfachhausen.de
```

Expected: valid certificate, health JSON with `"ok":true`, and `www` ending at the apex domain.

### D. Verify mail records

```bash
dig +short MX einfachhausen.de
dig +short TXT _dmarc.einfachhausen.de
dig +short TXT strato-dkim-0002._domainkey.einfachhausen.de
dig +short SRV _autodiscover._tcp.einfachhausen.de
dig +short CNAME autoconfig.einfachhausen.de
```

### E. Verify Stripe

Run `sin-stripe doctor`, then inspect webhook delivery status and event coverage.

### F. Keep the fallback until acceptance is complete

Do not remove `einfach-hausen.delqhi.com` until the new domain, health endpoint, HTTPS, redirect, mail records and Stripe endpoint all pass.

## 9. Deployment and recovery

Deploy on OCI:

```bash
sudo /srv/einfach-hausen/deploy/update-on-oci.sh
```

Sequence: `verify clean main + Node 22 -> prepare persistent paths -> copy-only legacy media migration -> pre-deploy online backup when DB exists -> git fetch -> fast-forward main -> npm ci -> disposable-DB build -> systemd reload/restart -> local DB-aware health check`. The script does not use `git reset --hard` and does not delete or overwrite production data.

Diagnostics:

```bash
sudo systemctl status einfach-hausen.service --no-pager
sudo journalctl -u einfach-hausen.service -n 120 --no-pager
curl -fsS http://127.0.0.1:3010/api/health
```

A previous restart loop was caused by a missing production `.next` build. A complete build followed by service restart restored health. Inspect the journal first; do not delete persistent data as a first response.

Backups:

- timer: `einfach-hausen-backup.timer`
- local retention: seven days by default
- private bucket: `einfach-hausen-backups`
- canonical helper: `scripts/backup-einfach-hausen.sh`
- method: SQLite online backup + `PRAGMA integrity_check`, private/upload archives, SHA-256 manifest before upload
- recovery proof: `scripts/restore-einfach-hausen.sh BACKUP_DIR --dry-run` validates checksums, SQLite integrity and private/upload file counts in a temporary directory; it has no production-overwrite mode

## 10. Verification baseline already achieved

On the current baseline before this handover:

- `npm run lint` passed
- `npm run build` passed
- focused security suite: **133 passed, 0 failed**
- webhook/private-media suite: **38 passed, 0 failed**
- production local health returned OK after rebuild/restart
- old public fallback health returned OK

## 11. Repository hygiene and in-progress work

At this 2026-08-24 snapshot, the working tree contains substantial intentional multi-task gauntlet changes and local teamwork evidence. **Do not run `git reset --hard` or `git clean -fd` blindly.** Use the canonical taskplan and final integration task to classify every path before cleanup.

Primary continuation documents:

- `docs/PRODUCTION_HANDOVER.md` — this handover
- `docs/OPERATIONS.md` — OCI operations
- `deploy/README.md` — deployment paths
- `docs/ARCHITECTURE.md` — application architecture
- `docs/PRODUCT_VISION.md` — binding product model
- `AGENTS.md` — mandatory workflow

## 12. Completion definition

The migration is complete only when all are true:

- [ ] `.de` delegation returns `aaron.ns.cloudflare.com` and `josephine.ns.cloudflare.com`
- [ ] Cloudflare marks the zone active
- [ ] `https://einfachhausen.de` loads
- [ ] `/api/health` returns OK publicly
- [ ] `www` redirects to apex
- [ ] Cloudflare TLS/security settings are verified live
- [ ] STRATO mail DNS is verified live
- [ ] Stripe webhook endpoint and signing secret are verified
- [ ] old fallback is retained until all checks pass
- [ ] DNSSEC is configured only after Cloudflare provides exact DS instructions

Until then, report the state as **cutover pending DNS propagation**, not “fully live”.
