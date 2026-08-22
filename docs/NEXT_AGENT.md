# Einfach Hausen — Next-Agent Continuation Contract

**Updated:** 2026-08-22

This is the operational entry point for the next agent. Read this file before changing code, tasks, production, or GitHub issues.

## 1. Exact repository state

- Repository: `Delqhi/einfach-hausen`
- Branch: `main`
- The local tree currently contains **uncommitted T-0004 intake/media work**. Preserve it. Do not run `git reset --hard` or `git clean -fd`.
- Known current files include:
  - `scripts/t0004-intake-regression.mjs`
  - `src/lib/intake-media.ts`
  - `src/lib/whatsapp-media.ts`
  - changes to intake actions, WhatsApp webhook, job-media route/UI, DB/orchestrator and composer
  - unrelated `.sin-after-work/` evidence must remain untouched unless explicitly reviewed.

## 2. Canonical task state

Use the task system, not memory:

```bash
cd /Users/jeremy/dev/einfach-hausen
sin-gpt-web-state --repo . summary
sin-gpt-web-state --repo . next
sin-gpt-web-state --repo . show T-0004
```

Current coordination state at this checkpoint:

- `T-0001` done — binding product spec and implementation DAG
- `T-0002` done — security baseline; 133/133 regression checks
- `T-0003` done — webhook/payment/private-media boundaries; 38/38 focused checks
- `T-0004` **in progress** — text/photo/voice intake + WhatsApp media + catalog parity
- `T-0005` onward remain in the DAG; do not skip validation/review tasks simply because individual features look implemented.

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

### A. Finish T-0004 without discarding current work

Review the diff first:

```bash
git diff -- src scripts package.json
npm run test:intake
npm run test:security
npm run lint
npm run build
git diff --check
```

Then inspect the implementation against T-0004 acceptance:

1. text intake works;
2. photo/video/audio behavior is explicit and reaches request context where supported;
3. voice has an accessible fallback;
4. WhatsApp supported media is never silently dropped;
5. unsupported media gets a clear response;
6. service aliases/catalog cover the binding product vision.

Only then commit and push. Do not bundle unrelated `.sin-after-work/` evidence into the product commit.

### B. Resume the DAG

Next eligible tasks include `T-0006`, `T-0007`, and `T-0010`; dependencies and acceptance criteria are already in `TASKPLAN.md`. Follow the DAG rather than inventing a parallel plan.

Before claiming a task:

```bash
sin-gpt-web-state --repo . next
sin-gpt-web-state --repo . show TASK-ID
sin-gpt-web-state --repo . claim TASK-ID --owner chatgpt-web --actor chatgpt-web
```

Record reproducible evidence and complete tasks only when acceptance is actually met.

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
