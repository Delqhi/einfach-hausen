# Einfach Hausen — Production Handover and Continuation Runbook

**Status snapshot:** 2026-08-28 — **Execution migration to OCI-VM; SIN Supabase OSS on OCI is the target production auth/data authority.** The previous cutover `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557` remains the known production baseline. Self-hosted HA/PITR/failover must be re-proven on the actual OCI stack before being described as active.

**Execution boundary:** complete the one-time verified Mac-M1 → GitHub handoff, then run `einfach-hausen` engineering and Prime Agent Luna on **OCI-VM**. GitHub is the only transfer boundary; do not copy a dirty Mac working tree directly to OCI. Supabase Cloud is not part of the target architecture.

This document is the canonical **production operations** continuation point. Repository/agent continuation starts at [`NEXT_AGENT.md`](NEXT_AGENT.md). All agents share one engineering goal and one transactional taskplan; remaining release-wide work is strictly T-0042 Final Acceptance followed by T-0043 Final Convergence/Handover unless acceptance creates a canonical remediation task.

## 0. Latest continuation checkpoint — 2026-08-25

**Canonical next-agent entry:** [`NEXT_AGENT.md`](NEXT_AGENT.md).

### Current code/worktree

- Production release remains `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557` from T-0041.
- Local Mac `main` at the 2026-08-25 coordination checkpoint is `16fad400812c5fe4299e163396809a45fbf17714`, one local commit ahead of `origin/main` (`dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`). Final T-0043 convergence must fetch and re-verify all three states instead of assuming equality.
- The local worktree currently contains documentation/Archify coordination changes plus generated runtime/cache paths. Preserve and classify them; do not blindly reset/clean.
- Production intentionally retains only the two runtime media links `data/private -> /var/lib/einfach-hausen/private` and `public/uploads -> /var/lib/einfach-hausen/uploads` as untracked paths. `deploy/update-on-oci.sh` permits only these verified paths and still fails closed on every other tracked/untracked change.
- T-0040 independent gauntlet, T-0044 integration/push and T-0041 production deployment are complete. **T-0042 is the sole current execution target, followed by T-0043.** Use `sin-gpt-web-state` as the only authority for task changes.

### Deployment contract — production verified

Two deployment edge cases were found and fixed before acceptance. Commit `cf56a824` permits only the canonical persistent runtime symlinks during the clean-tree gate. Commit `dcd53ca1` prepends the validated Node 22 directory to `PATH`, because npm uses `#!/usr/bin/env node`; this prevents npm lifecycle/Next.js workers from silently falling back to `/usr/bin/node` 20.20.2. The successful production build and runtime both used Node `v22.23.0` and the build used a disposable `/tmp` SQLite path rather than production data.

### Persistent storage checkpoint

- Database: `/var/lib/einfach-hausen/einfach-hausen.db`
- Private files: `/var/lib/einfach-hausen/private`
- Upload persistence: `/var/lib/einfach-hausen/uploads`
- Verified pre-deploy backup: `/var/backups/einfach-hausen/einfach-hausen-20260824T220100Z` (manifest + SQLite + private/upload archives; restore dry-run PASS)

Do not overwrite or delete these paths during deployment.

## 1. Current state in one minute

| Area | State | Evidence / next action |
|---|---|---|
| Repository | Release deployed | `main`, `origin/main`, and OCI all matched `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557` |
| Production runtime | Healthy | `einfach-hausen.service`, Kestra proxy socket and backup timer active; local and Kestra-path health returned `ok=true`, `database=ready` |
| Production app URL | Live | `https://einfachhausen.de` serves the new release; `/sicherheit`, `/app/settings`, `/app/insurance`, `/partner`, `/impressum`, `/datenschutz` all returned HTTP 200 |
| Cloudflare tunnel | Healthy | `cloudflared` active; DNS, QUIC, HTTP/2 and Cloudflare API prechecks PASS |
| Cloudflare zone / DNS | Active publicly | 1.1.1.1 and 8.8.8.8 returned `aaron.ns.cloudflare.com` + `josephine.ns.cloudflare.com`; canonical HTTPS works through Cloudflare |
| `www` | Healthy | `https://www.einfachhausen.de/` resolves to final `https://einfachhausen.de/` with HTTP 200 |
| Old temporary route | Healthy fallback | `einfach-hausen.delqhi.com/api/health` still returned HTTP 200 during acceptance; retain until final release handover decides removal |
| Mail DNS | Verified live | MX, DMARC, DKIM selector, autodiscover SRV and autoconfig CNAME all match the intended STRATO configuration |
| Stripe | Verified live | `sin-stripe ready` PASS; doctor reports charges/payouts enabled and canonical live webhook present, enabled and subscribed to required events |

## 2. Target architecture

```text
GitHub verified release SHA
  -> OCI-VM canonical engineering/runtime host
      -> Next.js application
      -> SIN Supabase OSS on OCI
          -> Auth
          -> Postgres
          -> Storage
          -> Pooler/Supavisor as deployed

Internet
  -> Cloudflare zone: einfachhausen.de
      -> Cloudflare security/TLS
      -> Cloudflare Tunnel: sin-kestra
      -> 127.0.0.1:3010
      -> systemd: einfach-hausen.service
      -> Next.js application
```

Mac-M1 is source/release/recovery only after this handoff. OCI work starts from a Git commit, never from a copied Mac working tree.

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

The STRATO nameserver change has propagated publicly. During T-0041, both 1.1.1.1 and 8.8.8.8 returned the two Cloudflare nameservers above, and the canonical HTTPS routes were served successfully through the active Cloudflare tunnel. A direct `a.nic.de` short query returned no lines in that specific probe, so public resolver + working HTTPS/tunnel evidence is retained rather than inventing registrar output.

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

## 6a. Produktions-Auth-Grenze — T-0168 Deep Research

Für die nächste Produktionskonvergenz gilt zusätzlich:

- Supabase ist die serverseitige Identity Authority für geschützte Owner-/Provider-Flächen.
- `mh_session`/SQLite darf nur in einem expliziten Local-Dev-Modus verwendet werden; ein solcher Modus muss in Produktion fail-closed sein.
- Es gibt keinen stillen Fallback von Supabase auf lokale Auth.
- `AuthContext` ist keine Sicherheitsgrenze; geschützte Server Components, Route Handler und Server Actions autorisieren serverseitig.
- Die Zuordnung von Supabase-Subject zu bestehender App-User-ID muss vor Migration oder Schemaänderung explizit nachgewiesen werden.
- Finale T-0168-Acceptance benötigt frische authentifizierte Round-3-Evidence unter `.sin-gpt-web/evidence/T-0168/round3/` sowie grüne Security/Auth/Visual/TypeScript/Build/Diff/GitNexus-Gates.

Vollständiger Entscheidungsstand: [`T0168_DEEP_RESEARCH.md`](T0168_DEEP_RESEARCH.md).

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

Deploy on OCI as the `ubuntu` application owner (the script elevates only the privileged filesystem/systemd steps itself):

```bash
/srv/einfach-hausen/deploy/update-on-oci.sh
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

Release verification retained from the independent convergence gauntlet and refreshed in production:

- `npm run lint` passed on the accepted application tree
- production `npm ci` reported 0 vulnerabilities
- production `npm run build` passed on Node `v22.23.0` and generated all 60 pages
- focused security suite: **133 passed, 0 failed**
- T-0003 webhook/private-media suite: **43 passed, 0 failed**
- pre-deploy backup `einfach-hausen-20260824T220100Z` passed non-destructive restore dry-run
- pre-/post-deploy SQLite `PRAGMA integrity_check`: `ok`; table count 59 -> 59, users 4 -> 4, jobs 0 -> 0
- local and Kestra-path health both returned `ok=true` with `database=ready`
- public canonical routes and `www` redirect passed; old fallback health remained HTTP 200
- Stripe readiness/doctor passed for the canonical live webhook without issuing a real charge

## 10a. Technical product-completion v2 + HA (2026-08-27)

Baseline `dcd53ca1` bleibt Rollback-Punkt. Operator-Entscheidung 2026-08-27 hebt auf **HA-Produktion**: **T-0100..T-0131 + T-0166 Supabase HA-Migration + T-0167 Capacitor Release**. Jede Welle muss `T-0129/T-0130/T-0131` Gates passieren, dann **Zero-Downtime Supabase Cutover (T-0166)** und **Capacitor App Store Release (T-0167)**.

Externe Blocker reduziert auf **#16 STRATO-DNSSEC, #11 Rechtstexte, #14 SEPA/Stripe-live** — **#12 App Stores kein Blocker mehr** (Capacitor ist aktiver Produktionspfad).

## 11. Repository hygiene and in-progress work

After T-0041, tracked release work is committed. The Mac controller still has local generated coordination/cache directories (`.sin-gpt-teamwork/`, `scripts/__pycache__/`) to classify in final convergence. Production intentionally has only the two canonical untracked runtime symlinks described above. **Do not run `git reset --hard` or `git clean -fd` blindly.**

Primary continuation documents:

- `docs/PRODUCTION_HANDOVER.md` — this handover
- `docs/OPERATIONS.md` — OCI operations
- `deploy/README.md` — deployment paths
- `docs/ARCHITECTURE.md` — application architecture
- `docs/PRODUCT_VISION.md` — binding product model
- `AGENTS.md` — mandatory workflow

## 12. Completion definition

The migration is complete only when all are true:

- [x] public resolvers return `aaron.ns.cloudflare.com` and `josephine.ns.cloudflare.com`
- [x] Cloudflare-backed canonical HTTPS is active and tunnel prechecks pass
- [x] `https://einfachhausen.de` loads
- [x] `/api/health` returns OK publicly with `database=ready`
- [x] `www` redirects to apex
- [x] active Cloudflare tunnel transport checks pass
- [x] STRATO mail DNS is verified live
- [x] canonical Stripe live webhook is present/enabled and Stripe readiness/doctor pass
- [x] old fallback remained available through production acceptance
- [x] DNSSEC was not guessed or changed without an exact Cloudflare/registrar DS workflow

T-0041 production cutover is complete. Any optional DNSSEC enablement or fallback retirement is an explicit post-release operator hardening action, not an unreported application deployment gap.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0167`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen HA-Produktion — Supabase Postgres+Storage Primary, Capacitor iOS/Android, SQLite nur Fallback
- Resume rule: product-completion HA is T-0100..T-0167; continue highest-priority eligible task, #12 App Stores kein Blocker
- Taskplan sync: `pass`
- Synchronized at: `2026-08-27T00:00:00+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-26T11:54:15+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-26T12:26:25+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-26T12:37:50+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-26T12:47:21+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-26T12:57:44+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-26T13:21:53+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-26T13:31:30+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-26T13:41:27+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-26T13:47:37+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-26T14:15:40+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-26T14:27:32+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-26T15:43:26+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-26T15:44:24+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-26T17:58:59+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-26T18:04:35+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-29T06:11:34+00:00
actor: local-agent
evidence-sha256: 8a26c7d17a8ec5b52526fb9c2fb1f91e86ba8f1503952d8365e2d2aafe1a1f42
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-26T18:18:41+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-29T02:26:36+00:00
actor: chatgpt-web
evidence-sha256: e97a4ac3b49ccf5e227b288e7278583c520cb229869f36648ec75419c8a7b884
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-26T18:44:41+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-26T18:58:51+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-26T19:03:51+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-26T19:25:25+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-26T19:30:34+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-26T19:30:47+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-26T19:30:48+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-26T19:36:09+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-26T19:38:16+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-26T19:38:17+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-26T20:15:45+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-29T05:56:51+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->
