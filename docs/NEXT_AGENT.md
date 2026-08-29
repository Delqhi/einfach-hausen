# Einfach Hausen — Canonical Next-Agent Contract

**Updated:** 2026-08-29 — **ABSCHLUSS: T-0170/T-0004/T-0169/T-0005/T-0171 DONE; main=bdebe9f; Production deployed + Smoke 17/17 PASS**

## 0. Read this first

- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3` in the **canonical OCI worktree**
  `/home/ubuntu/einfach-hausen-oci-handoff` (branch `oci/t0169` at the time of writing).
  Verify with `sin-gpt-web-state --repo . validate && sin-gpt-web-state --repo . summary`.
  The rendered view is `.sin-gpt-web/TASKPLAN.md`. Historical roadmap prose (T-0100..T-0167)
  in older documents is history, not the current plan — the DB taskplan wins.
- Production Supabase gateway (self-hosted OCI OSS): `https://supabase.delqhi.com`.
  Supabase Cloud is NOT the target architecture.
- Production Node on OCI: use `/home/ubuntu/.local/bin` +
  `/home/ubuntu/.local/opt/node-v22.22.1-linux-arm64/bin` (never system node v20).

## 1. Verified architecture facts (2026-08-29, T-0169/T-0004)

- Auth: `AUTH_MODE=supabase` (production) / `local` (dev only; production local auth fails closed).
  Server-side Supabase identity is authoritative (`auth_subject`); `user_metadata.role` never authorizes.
- Login path is CLIENT-side Supabase (`src/app/login/page.tsx` + `@supabase/ssr` browser client).
  **next.config.ts CSP `connect-src` therefore includes the Supabase gateway origin**
  (fix T-0004: previously `connect-src 'self'` broke the real login form in every
  strict-CSP browser — evidence `.sin-gpt-web/evidence/T-0169/oci/csp-defect.txt`).
- App data layer: `src/lib/db.ts` is **better-sqlite3 / `DATABASE_PATH`** (no Postgres
  adapter in the runtime code). Any document claiming "Supabase Postgres primary" for the
  app runtime was aspirational until proven otherwise — T-0171 must reconcile docs↔code.
- `src/lib/storage.ts` does not exist in this tree; docs referencing a Supabase Storage
  adapter are ahead of the implementation (T-0171 audit item).

## 2. Notion visual reference truth (T-0169)

- Authoritative references: `public/notion/notion-originals/` — the 12 ORIGINAL embedded
  images of the owner Notion page "App Design" (recovered 2026-08-29 via authenticated
  session; provenance + SHA256 in that directory).
- Verified absence: NO dedicated full-screen "Haus-Historie" mockup exists on the page;
  Historie is accepted on shared-design-system parity only (docs/T0168_DEEP_RESEARCH.md §7).
- The 12 placeholder files under `public/notion/*.png` are TEXT placeholders — never use
  them as references. `public/notion/recovered-browser-captures/` are historical page-top
  captures (all six pixel-identical) kept for provenance only.
- Fresh 390x844 reference/actual/overlay/diff evidence: `.sin-gpt-web/evidence/T-0169/oci/`
  (`reference-map.json`, `visual-metrics.json`, `overlay-verdict.txt`, `round3/`).
- Harness: `node scripts/t0169-visual-acceptance.mjs` (real Supabase login, throwaway DB,
  ephemeral identity) + `python3 scripts/t0169-visual-diff.py`.

## 3. Taskplan state (2026-08-29, T-0171 running)

- DONE: T-0170 (Supabase auth 15/15), T-0004 (CSP login fix), T-0169 (visual evidence,
  12 original Notion references recovered), T-0005 (Owner screens converged 1:1 to the
  Notion originals: dashboard, drawer, welcome, role, register chrome; no logic changes).
- DONE & DEPLOYED: T-0171 abgeschlossen; main=bdebe9f (GitHub-SHA-Gleichheit bewiesen); Production
  /srv/einfach-hausen @ bdebe9f, Service aktiv, /api/health ready, Smoke 17/17 PASS, Pre-Deploy-Backup erstellt.
- OPEN: **T-0006 e2e modernization** (höchster eligible Task) — full-flow e2e auf die konvergierte UI
  weiterführen (Tech-Persona-Login-Seam dokumentiert; alle übrigen Sektionen grün repariert).
- Verified docs truth (2026-08-29): App DB = SQLite (`DATABASE_PATH`, better-sqlite3);
  `/api/health` checks SQLite; Supabase OSS = Auth authority only; no Storage adapter;
  HA/PITR/Capacitor (T-0166/T-0167) were planning-only and never executed.

## 4. Known pre-existing debt (documented, not introduced by T-0169)

- `npm run lint`: legacy errors were fixed in T-0171 (src pages + stale presentation
  deck-builder scripts removed via documented scope extension). Lint is green again.
- Unrelated OCI worktrees (`/home/ubuntu/dev/einfach-hausen*`, `t0165-premium*`, `t0167`)
  are recovery/history — do not develop or clean them.

## 5. Hard rules (unchanged)

No `git reset --hard`/`clean`/force-push; no direct Mac→OCI file copies for source
(GitHub is the transfer boundary); no production DB/user mutations for tests; never print
`/etc/einfach-hausen.env`, service keys or user secrets; no invented 1:1 visual claims;
no DONE without fresh evidence.

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-29T06:11:34+00:00
actor: local-agent
evidence-sha256: 8a26c7d17a8ec5b52526fb9c2fb1f91e86ba8f1503952d8365e2d2aafe1a1f42
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-29T08:50:05+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-29T18:59:08+00:00
actor: local-agent
evidence-sha256: 626ff1acac221e886d6236648f566609e088d55979546ae44d5287052077e675
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-28T18:44:41+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-29T05:56:51+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->
