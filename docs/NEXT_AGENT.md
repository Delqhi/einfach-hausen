# Einfach Hausen — Canonical Next-Agent Contract

**Updated:** 2026-08-29 — **OCI convergence wave (T-0170/T-0004/T-0169 → T-0171)**

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

## 3. Taskplan state (2026-08-29)

- DONE: T-0170 (Supabase auth convergence, 15/15), T-0004 (CSP login fix, security 43/43).
- COMPLETING: T-0169 (Notion visual convergence evidence on OCI; gates green; structural
  deltas to the 2024 mockups documented, no design wave performed per handoff §30).
- NEXT: **T-0171 Final OCI convergence and acceptance** — fresh gate battery (auth,
  security, visual, tsc, lint, build, diff, GitNexus incl. `gitnexus analyze --index-only`),
  full regression suite, docs↔code reconciliation (AUTH_BACKEND→AUTH_MODE remnants,
  Postgres/Storage claims, roadmap prose, EXTERNAL-BLOCKERS.md), then main integration.

## 4. Known pre-existing debt (documented, not introduced by T-0169)

- `npm run lint`: 17 errors in legacy `presentation/*.js` + old src pages
  (`anfrage/[id]`, `benachrichtigungen`, `ki-chat`, `profil`, `dashboard*`). T-0171 owns
  the cleanup decision (src fixes allowed; presentation/ needs an explicit scope call).
- Unrelated OCI worktrees (`/home/ubuntu/dev/einfach-hausen*`, `t0165-premium*`, `t0167`)
  are recovery/history — do not develop or clean them.

## 5. Hard rules (unchanged)

No `git reset --hard`/`clean`/force-push; no direct Mac→OCI file copies for source
(GitHub is the transfer boundary); no production DB/user mutations for tests; never print
`/etc/einfach-hausen.env`, service keys or user secrets; no invented 1:1 visual claims;
no DONE without fresh evidence.
