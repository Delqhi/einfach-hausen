# Owner Visual Repair — 2026-09-12 (isolated worktree)

Base: `/srv/einfach-hausen` main @ `77139e6`, detached worktree
`/home/ubuntu/orca/workspaces/eh-dashboard-support-20260912`.
Owner: parent agent (frontend). This agent owned ONLY setup/graph/test tooling.

## Change scope (4 tracked + 1 new, no shell edits)

- `packages/eh-design/src/workspace.tsx` (+8/-4): composer header+input grouped as own card, examples separate sibling.
- `packages/eh-design/src/styles.module.css` (+131): desktop hero 130px, overview/status/composer/utility padding reductions, composer `.agent-composer` padding 0, status/overview/utility/orders icon 50% tint, mobile positioning/object-position consolidation (superseded rules removed; computed output intended unchanged).
- `src/app/app/page.tsx` (+4/-2): hero `imageSrc` -> `/images/marketing/owner-facade-reference.png`, decorative empty alt.
- `src/app/app/jobs/page.tsx` (+4/-2): same hero swap.
- `public/images/marketing/owner-facade-reference.png` (NEW, 712x141):
  sha256 `adac292b49e5cf3b3ab41a2dfda222072a9105e61739b699bfeabde78855a152`
  PROVENANCE: cropped CLEAN facade from user-provided desired-dashboard screenshot (no UI, no persons) — reference crop, NOT an original high-res photograph. Empty alt is intentional (decorative motif, not the user's actual property); do NOT restore a descriptive alt.

## Gates (final sources, worktree-local)

- ESLint: 0 errors, 38 pre-existing warnings (none in patched files) — `/tmp/eh-dash-lint.log`.
- `next typegen + tsc --noEmit`: PASS, 0 errors — `/tmp/eh-dash-tsc.log`.
- `npm run build` post-cleanup: EXIT 0 — `/tmp/eh-dash-build3.done` 2026-09-12T09:45:54Z (source mtime styles.module.css 09:38:45Z; build is final).
- `sin verify` / design-guard reseal: NOT run — `sin` CLI absent on OCI, no Orca review command. Independent reviewer spawned by parent; this agent never self-accepts.

## Browser evidence (dev :3100, AUTH_MODE=local, disposable DB; local copies under /tmp/eh-dashboard-source/shots/)

- `app-1672-v3.png`: /app 1672x941, scrollHeight==clientHeight (zero scroll), all 3 utility cards full (bottom 924/941).
- `jobs-1661-v3.png`: EXACT 1661x947 (asserted innerW/H), scrollTo(0,0), 4 current rows, stats 3/1/1, facade hero.
- `app-mobile-390-v3.png` + `app-mobile-390-bottom.png`: authenticated dashboard (URL+heading asserted), all utilities reachable above bottom nav (Mein Jahr bottom 744/844).
- `jobs-390-v1.png`: authenticated jobs mobile, 4 rows, no login.
- `jobs-completed.png`: `?view=completed` shows Dachrinne/Erledigt. Search `?q=Heizung` -> 1 row (Enter submits; typing alone does not filter).
- `job-detail-v2.png`: /app/jobs/1 renders (H1 Heizung pruefen), 200, no 4xx/5xx; client nav needs ~30s-bounded wait; one benign AbortError (transition skipped).
- Example chips are LINKS to /app/hausmeister (hrefs asserted); /app/hausmeister renders 200 with real composer content.
- Jobs top-bar "Mein Zuhause" is the workspace context label (`shell.tsx:29`), identical on all owner routes — not a nav race (jobs passes title="Aufträge").
- "N" overlay bottom-left is the Next.js dev indicator — do NOT alter app code for it.
- Negative evidence: `prod-app-1672.png` is a LOGIN page — `next start` (production) fail-closes local auth by design (`authMode()` throws for AUTH_MODE=local in production), so indicator-free production preview is infeasible without Supabase; dev shots are the acceptance medium.

## Fixture (disposable /tmp/eh-dash-preview/app.sqlite3, seed*.sql in /tmp)

Owner Shot Owner + done profile; property + ownership; heating asset; 1 open maintenance (+14d); jobs: quoted(2 pending quotes)/open x2/in_progress/completed; session token `shotsessiontoken...000001` (mh_session cookie).

## Known infrastructure defect (open, evidence-backed)

Preview `sessions` rows vanish within minutes with no login/logout traffic (issuance only via local-login/register per grep). Workaround: re-seed session immediately before each capture and assert URL+heading on every shot (one earlier mobile capture was a login page and was discarded, never passed off). Root cause unfound; production sessions unaffected (separate host/DB).

## Limits

- No canonical taskplan: `.sin-gpt-web/taskplan.sqlite3` is 4KB/0 tables on /srv and git-ignored (absent in worktree); `sin-gpt-web-state` not installed. No history fabricated.
- GitNexus worktree index: 8,435 nodes / 19,693 edges. Fresh impact: Dashboard/Jobs leaf UNKNOWN; EHOwnerDashboardHeader/Composer -> Dashboard LOW; EHOwnerOrdersHero -> Jobs LOW; AppShell CRITICAL/31 (do not touch).
- graphify binary absent on OCI (GitNexus is the working graph).
- No commit, no merge, no deploy performed. Production runs /srv/einfach-hausen (service active) untouched.
