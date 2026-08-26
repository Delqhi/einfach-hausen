# Einfach Hausen — Canonical Next-Agent Contract

**Updated:** 2026-08-25

## 1. Canonical state

The product/technical convergence is complete once the transactional taskplan reports no executable tasks. Always verify that state first:

```bash
cd /Users/jeremy/dev/einfach-hausen
sin-gpt-web-state --repo . validate
sin-gpt-web-state --repo . summary
git fetch origin --prune
git status --short --branch
git rev-list --left-right --count main...origin/main
```

Do not create a new roadmap or reopen completed/cancelled waves without a fresh reproducible defect. Product truth remains `docs/PRODUCT_VISION.md`; final acceptance is `docs/FINAL_ACCEPTANCE.md`; final repository/recovery handover is `docs/FINAL_HANDOVER.md`.

## 2. Accepted product state

T-0042 concluded **ACCEPT** with GitHub issues #1-#6 at **6/6 PASS**, all major binding PRODUCT_VISION capabilities accepted, and zero unresolved Critical/Major technical findings.

The final verification wave for T-0043/T-0049 established:

- `npm run lint` PASS under Node 22.22.1;
- `npm run build` PASS under Node 22.22.1;
- security suites **133/133 + 43/43 PASS**;
- intake **23/23 PASS**;
- matching **23/23 + 18/18 PASS**;
- CRM **20/20 PASS**;
- architecture E2E PASS;
- full isolated production-style E2E PASS, including 390/1320 layouts, PWA/offline, provider lifecycle, contact-only/service conversion, matching/booking, messaging, invoice, house record, consultation/emergency, ownership-transfer privacy and **0 browser runtime errors**;
- Archify tooling **2/2 PASS** and all seven diagram triplets verified;
- GitNexus final dirty-scope analysis: LOW risk, **0 affected execution flows**;
- `git diff --check` PASS.

## 3. Production state

The proven live application release remains:

`dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`

T-0041 verified backup/restore, SQLite integrity, Node 22 production build, systemd health, Cloudflare transport/canonical HTTPS, mail DNS and Stripe live-webhook readiness. The verified pre-deploy backup is:

`/var/backups/einfach-hausen/einfach-hausen-20260824T220100Z`

Every repository commit after `dcd53ca1` through the final convergence is documentation, acceptance, Agent/GitNexus/Archify tooling or lint-ignore hygiene. A direct Git diff found **no post-release changes under `src/**`, `deploy/**`, package manifests, Next config or middleware**. Therefore no application-runtime redeploy is required solely for this repository convergence.

Persistent production data remains:

- `/var/lib/einfach-hausen/einfach-hausen.db`
- `/var/lib/einfach-hausen/private`
- `/var/lib/einfach-hausen/uploads`
- `/var/backups/einfach-hausen`

Never expose port 3010 publicly and never print production/Infisical/Stripe/WhatsApp secrets.

## 4. Preserved historical worktrees

No historical work was discarded. Earlier dirty CRM experiments were committed onto explicit rescue branches before final convergence:

- `rescue/multichannel-crm-wip-20260825` → `00e7cde` (`chore(rescue): preserve multichannel CRM WIP`)
- `rescue/simple-crm-outreach-wip-20260825` → `edf21d5` (`chore(rescue): preserve simple CRM outreach WIP`)

Two additional detached historical worktrees are clean at `93ca584` (`fix(crm): preserve executable sync scripts`). These old embedded-CRM experiments are superseded by the production standalone `einfach-hausen-crm` control plane and are intentionally not mixed back into current application code.

Do not delete rescue branches/worktrees merely for cosmetic cleanup. Cleanup is a separate audit action only after their historical value is no longer needed.

## 5. Safety/recovery material

Final-convergence safety snapshot created before staging:

`/Users/jeremy/dev/.safety-snapshots/einfach-hausen-pre-final-20260825T2255/`

It contains the complete tracked dirty patch, archived untracked intended files and SHA-256 checksums. Safety ref:

`refs/heads/safety/einfach-main-pre-final-20260825T2255`

Earlier recovery snapshots for detached CRM WIP are also retained under `/Users/jeremy/dev/.safety-snapshots/`.

No `git reset --hard`, `git clean -fd`, force push or destructive worktree removal was used.

## 6. External-authority items

Technical completion does not authorize invention of legal/business facts. `docs/EXTERNAL-BLOCKERS.md` remains authoritative for operator identity, legal/privacy/AGB approval and similar external-owner decisions. Connector-specific social credentials remain optional runtime dependencies and must not be reported healthy unless configured and verified.

These external-owner items do not constitute an unfinished technical engineering task.

## 6a. Finisher wave checkpoint — 2026-08-25

Canonical tasks T-0003, T-0006, T-0007 and T-0008 are resolved by `einfach-hausen-finisher`: production live-check PASS at release `dcd53ca1` (no redeploy needed for `f0198ee`), Domain-Cutover issue [#16](https://github.com/Delqhi/einfach-hausen/issues/16) created, STRATO mailbox recorded as external blocker `EH-O01`, and the Archify sync design classified as adopted/implemented. Details: `.sin-gpt-web/reports/COMPLETION-FINAL.md`. Taskplan: backlog=0.

## 7. Resume rule

If canonical taskplan validation shows `backlog=0`, `in_progress=0`, `blocked=0`, **stop**. Do not manufacture follow-up implementation. A new engineering task requires a newly reproduced defect, changed product requirement or explicit user instruction.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0043`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen und vor allem App und Website auf Produktionsqualität verbessern
- Resume rule: read/validate the canonical taskplan and continue its highest-priority eligible task; do not create a competing roadmap.
- Taskplan sync: `pass`
- Synchronized at: `2026-08-25T20:59:52+00:00`
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
