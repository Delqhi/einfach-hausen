# Einfach Hausen — Next-Agent Continuation Contract

**Updated:** 2026-08-23 (post-gauntlet reconciliation; see `.sin-after-work/handoff.md`)

This is the operational entry point for the next agent. Read this file before changing code, tasks, production, or GitHub issues.

## 1. Exact repository state

- Repository: `Delqhi/einfach-hausen`
- Branch: `main`
- HEAD: `3e7b1228` — `fix: serialize Next build workers on OCI` (11 commits since the 2026-08-21 baseline `3f2bd8ac`).
- The local worktree contains **uncommitted T-0019 / T-0020 / T-0021 polish** alongside the now-committed T-0004 intake work. **Preserve it. Do not run `git reset --hard` or `git clean -fd`.**
- Dirty surfaces (working tree, uncommitted):
  - T-0019 (website): `src/app/page.tsx`, `src/components/marketing/{site-shell.tsx,ui.tsx,marketing.module.css}`
  - T-0020 (homeowner): `src/app/app/**` (+ new untracked `src/components/homeowner/homeowner-hausmeister-composer.tsx`, `src/components/homeowner/state.tsx`)
  - T-0021 (partner): `src/app/pro/**` (`jobs/[id]/page.tsx` modified; `src/components/provider/workspace.tsx` is committed)
- `unrelated .sin-after-work/ evidence must remain untouched unless explicitly reviewed.`

## 2. Canonical task state

Use the task system, not memory:

```bash
cd /Users/jeremy/dev/einfach-hausen
sin-gpt-web-state --repo . summary
sin-gpt-web-state --repo . next
sin-gpt-web-state --repo . show TASK-ID
```

Current coordination state (canonical, from `.sin-gpt-web/taskplan.sqlite3`):

- `T-0001` done — binding product spec and implementation DAG
- `T-0002` done — security baseline; 133/133 regression checks
- `T-0003` done — webhook/payment/private-media boundaries; 38/38 focused checks
- `T-0004` done — text/photo/voice intake + WhatsApp media + catalog parity (committed; `test:intake` 23/23)
- `T-0005` done — maintenance, regional matching, emergency fidelity
- `T-0016`, `T-0017`, `T-0018` done — website/homeowner/partner rebuilds
- `T-0019`, `T-0020`, `T-0021` done (per worker reports) but their **uncommitted dirty work is preserved in the tree** — see §3A before claiming done.
- `T-0006`–`T-0015` **cancelled** — superseded by the 2026-08-23 CEO-audit decomposition `T-0022`–`T-0043`. Do not re-open the legacy tasks.
- Next eligible (backlog, unclaimed): `T-0022` website trust/IA/performance, `T-0023` homeowner first-task flows, `T-0024` partner operations (then `T-0025`–`T-0028`, each depending on 22–24).

The authoritative sources are:

- `.sin-gpt-web/taskplan.sqlite3`
- generated `.sin-gpt-web/TASKPLAN.md`
- `.sin-gpt-web/COMPLETION_REPORT.md`
- `.sin-gpt-web/reports/`

After any task-state change run:

```bash
sin-gpt-web-state --repo . render
sin-gpt-web-state --repo . validate
```

## 3. Immediate next technical actions

### A. Green and commit the uncommitted T-0019/T-0020/T-0021 dirty work BEFORE any new dispatch

The dirty tree is **not** green. Reconcile it first (do not reset/clean — the work must be preserved):

```bash
git diff -- src scripts package.json
npm run test:intake      # 23/23 on committed T-0004 work
npm run test:security    # 133/133
npm run lint             # FAILS on dirty tree — see below
npm run build            # FAILS on dirty tree — see below
git diff --check
```

Known dirty-tree gate failures (verified 2026-08-23, NOT committed):

1. **Build fails:** `src/app/pro/jobs/[id]/page.tsx` (dirty T-0021) imports `ProviderAccessBoundary` and `ProviderNextStep` from `@/components/provider/workspace`, but the committed `workspace.tsx` only exports `ProviderSectionHeader` / `ProviderState`. Add the two missing exports to `workspace.tsx` (or align the import), then re-run `npm run build` until green.
2. **Lint fails:** untracked `src/components/homeowner/homeowner-hausmeister-composer.tsx:27` triggers `react-hooks/set-state-in-effect` (`setSpeechSupported` inside a `useEffect`). Fix the effect, then `npx eslint src/app/app src/components/homeowner` until clean.

The T-0020 and T-0021 worker reports claim lint/build pass; that is not reproducible on the current working tree. Treat the reports as the worker's intended end state, not proof — green the tree yourself, then commit.

Then land the three surfaces as **separate commits** (the gauntlet's disjoint-path rule):

- commit 1 — T-0019: `src/app/page.tsx src/components/marketing/**`
- commit 2 — T-0020: `src/app/app/** src/components/homeowner/**`
- commit 3 — T-0021: `src/app/pro/** src/components/provider/**`

Do **not** bundle `.sin-after-work/` evidence or `.sin-gpt-teamwork/` runtime state into product commits.

### B. Resume the DAG

After Wave 1 (T-0019/0020/0021) is committed green, the next dispatchable tasks are `T-0022`, `T-0023`, `T-0024` (T-0025+ depend on them). Claim only one per wave and keep paths disjoint:

```bash
sin-gpt-web-state --repo . next
sin-gpt-web-state --repo . show TASK-ID
sin-gpt-web-state --repo . claim TASK-ID --owner chatgpt-web --actor chatgpt-web
```

Record reproducible evidence and complete tasks only when acceptance is actually met and independently reproduced on the current tree.

## 4. Production / OCI state

Production architecture remains:

```text
Cloudflare -> sin-kestra Tunnel -> 127.0.0.1:3010 -> einfach-hausen.service
```

Persistent paths:

- database: `/var/lib/einfach-hausen/einfach-hausen.db`
- private files: `/var/lib/einfach-hausen/private`
- public/job upload persistence: `/var/lib/einfach-hausen/uploads` (bind/symlink path must be preserved during deployment)
- pre-cutover SQLite backup created before the last deployment attempt: `/var/lib/einfach-hausen/backups/pre-e3a5343.db`

### Known deployment blocker — exact cause

The OCI deployment script/build was invoked with **Node 20.20.2**, while `better-sqlite3@13` requires Node 22+. The production systemd service already references Node `22.23.0`.

Do not change dependencies or downgrade `better-sqlite3` as a workaround. Fix the deployment script environment so the **build and runtime both use the same Node 22 binary**.

Before retrying:

```bash
source /home/ubuntu/.nvm/nvm.sh
nvm use 22
node -v
cd /srv/einfach-hausen
npm run build
sudo systemctl restart einfach-hausen.service
curl -fsS http://127.0.0.1:3010/api/health
```

Then verify public routes according to `docs/PRODUCTION_HANDOVER.md`.

Never expose port `3010` publicly and never print `/etc/einfach-hausen.env`.

## 5. Domain / Cloudflare status

Read `docs/PRODUCTION_HANDOVER.md` before touching DNS. The old fallback route must remain until the canonical domain, HTTPS, health, mail DNS, redirect and Stripe endpoint are verified.

Do not report the new domain as fully live until the checklist in that document passes.

## 6. Validation matrix

Baseline already verified in prior waves:

- security regression: 133/133
- T-0003 focused security/webhook/media: 38/38
- lint
- build
- product E2E/architecture/CRM flows reported green in the previous wave

For any new completion, rerun the affected suite and then at minimum:

```bash
npm run lint
npm run build
git diff --check
```

Relevant scripts:

```bash
npm run test:intake
npm run test:security
npm run test:e2e
npm run test:e2e:architecture
npm run test:crm
npm run graph:update
```

Do not claim full production readiness until browser/accessibility/review/convergence tasks (`T-0011`–`T-0015`) have their required evidence or an exact external blocker.

## 7. GitHub issue policy

Open issues at this checkpoint: #1–#6.

They have been commented with implementation status/evidence mapping. Do not close an issue merely because code exists locally. Close only after its acceptance is committed, pushed, tested, and—where applicable—production-verified.

When closing an issue, include:

- commit(s),
- test evidence,
- production/public verification if relevant,
- remaining limitations or external blockers.

## 8. Product invariants — do not regress

- Public promise: **Ein Ansprechpartner für alles rund ums Eigenheim.**
- Do not make AI the dominant public marketing message; the housekeeper/assistant can remain inside the product.
- Customer explicitly chooses **Ansprechpartner finden** or **Auftrag organisieren**; normal questions must not silently create a job.
- A customer can get a human contact without booking.
- Partner ranking prioritizes suitability/quality, not who pays most.
- 0% commission on partner jobs.
- Partner accounts remain intentionally simple: 1–X contacts, with the central permission `Aufträge verwalten`.
- House history belongs to the property and can be transferred with explicit controls.
- Private invoices, documents, messages and payment data are never automatically shared.

## 9. Required handover hygiene

At the end of every work wave:

1. update task state through `sin-gpt-web-state`;
2. regenerate and validate `TASKPLAN.md`;
3. update this file and/or `docs/PRODUCTION_HANDOVER.md` when the continuation state changes;
4. update Graphify for code changes;
5. commit documentation with the related work where appropriate;
6. comment GitHub issues with evidence before closing;
7. never invent a successful deploy, public check, payment, email, or external API result.
