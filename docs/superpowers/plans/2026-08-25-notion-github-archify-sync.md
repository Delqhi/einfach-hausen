# Notion GitHub Archify Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile Jerry's Notion tasks with verified repository/issue evidence, create only the remaining useful engineering issues, and add validated Archify visual documentation to both Einfach Hausen repositories and relevant Notion tasks.

**Architecture:** Notion stays the business source of truth; GitHub issues represent grouped engineering execution; the SIN taskplan and its completion reports provide implementation/test evidence; Archify diagrams are generated artifacts from committed JSON IR and embedded selectively in README/docs. Existing issues and completed SIN work are reused rather than duplicated.

**Tech Stack:** Notion database, GitHub CLI (`gh`), SIN taskplan, GitNexus, Archify v2.11, Markdown, Next.js repository documentation.

**Spec:** `docs/superpowers/specs/2026-08-25-notion-github-archify-sync-design.md`

## Global Constraints

- Only Jerry-owned Notion tasks may be synchronized by this execution pass.
- Gina and Gemeinsam rows must not be mutated.
- Do not add Notion management fields; use only Aufgabe, Zuständig, Bereich, Status and page body notes.
- `Erledigt` requires repository/test/issue evidence; external legal/production/store gates remain `In Arbeit` or `Offen`.
- Reuse existing GitHub issues #1–#9 and SIN T-0001..T-0048 evidence before creating a new issue.
- Archify only: no Mermaid, PlantUML, ASCII diagrams or hand-written SVG.
- Preserve unrelated dirty work in `docs/OPERATIONS.md`, `docs/PRODUCTION_HANDOVER.md`, `.sin-gpt-teamwork/` and generated caches.

---

### Task 1: Build the evidence map and grouped remaining issue set

**Files:**
- Read: `.sin-gpt-web/TASKPLAN.md`
- Read: `.sin-gpt-web/reports/T-*.md`
- Read: `docs/EXTERNAL-BLOCKERS.md`
- Read: `docs/PRODUCT_VISION.md`
- Read: `docs/ARCHITECTURE.md`
- Read: `einfach-hausen-crm/docs/taskplan.md`

**Interfaces:**
- Consumes: Jerry Notion rows (`Aufgabe`, `Bereich`, `Status`, URL), GitHub issues #1–#9, SIN task evidence.
- Produces: deterministic mapping `task -> status -> evidence -> issue family` used by Tasks 4 and 5.

- [ ] Query all Jerry rows area-by-area from the Notion data source.
- [ ] Fetch GitHub issues #1–#9 including comments and current state with `gh issue view`.
- [ ] Map implementation-heavy rows to completed SIN tasks: T-0002/3/4/5, T-0016..T-0040 and remediation T-0045..T-0048.
- [ ] Map production rows to T-0041 and keep them `In Arbeit` until production smoke is complete.
- [ ] Map legal/privacy rows against `docs/EXTERNAL-BLOCKERS.md`; keep final legal approval items `In Arbeit`/`Offen` even where engineering structure is done.
- [ ] Map CRM production/outreach rows against `einfach-hausen-crm/docs/taskplan.md`; keep unfinished recovery/connectors/inbox work open.
- [ ] Reduce genuine remaining Jerry engineering work to a small grouped issue set: production, legal/privacy approval, store/push, CRM production/SIN outreach, and analytics/privacy classification.

### Task 2: Generate the Archify diagram set

**Files:**
- Create: `docs/diagrams/platform-architecture.architecture.json`
- Create: `docs/diagrams/homeowner-service-flow.workflow.json`
- Create: `docs/diagrams/partner-job-lifecycle.lifecycle.json`
- Create: `docs/diagrams/property-privacy-dataflow.dataflow.json`
- Create: `docs/diagrams/payment-lifecycle.lifecycle.json`
- Create: `docs/diagrams/crm-outreach-flow.workflow.json`
- Create: `docs/diagrams/production-recovery-flow.workflow.json`
- Generate matching `.html` and `.svg` files.
- Create: `docs/archify-manifest.json`
- Create: `scripts/verify-archify-diagrams.mjs`

**Interfaces:**
- Consumes: current product/architecture/operations/CRM truth.
- Produces: seven validated visual artifacts suitable for README/docs and Notion linking.

- [ ] Create seven concise JSON IR files, each with one readable primary story and no architecture diagram over 12 components.
- [ ] Render every IR with Node 22 and `/Users/jeremy/.claude/skills/archify/bin/archify.mjs`.
- [ ] Run `validate <type> <json> --json` and `check <html>` for every diagram; fix JSON until all pass.
- [ ] Export SVG through Archify's own export path/tooling; do not reconstruct SVG manually.
- [ ] Register every JSON/HTML/SVG trio in `docs/archify-manifest.json`.
- [ ] Add a verification script that validates manifest existence, runs Archify validation/check and rejects missing/stale artifact triplets.
- [ ] Run `node scripts/verify-archify-diagrams.mjs` successfully.

### Task 3: Integrate visuals into repo documentation without clutter

**Files:**
- Modify: `README.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/PRODUCT_VISION.md`
- Modify: `docs/OPERATIONS.md` only by applying a minimal additive edit on top of existing dirty content.
- Modify: `docs/CRM.md`
- Modify: `../einfach-hausen-crm/README.md`
- Copy/create: `../einfach-hausen-crm/docs/diagrams/crm-outreach-flow.{workflow.json,html,svg}` or link safely to the canonical asset if repository-relative GitHub rendering permits.

**Interfaces:**
- Consumes: Task 2 artifacts.
- Produces: visual navigation from documentation while keeping each page focused.

- [ ] Add the platform architecture image/link near the top of root README.
- [ ] Add platform + service + privacy visuals to `docs/ARCHITECTURE.md`.
- [ ] Add service + partner lifecycle visuals to `docs/PRODUCT_VISION.md`.
- [ ] Add production/recovery visual to the current `docs/OPERATIONS.md` without overwriting concurrent T-0041 changes.
- [ ] Add CRM/outreach visual to `docs/CRM.md` and the CRM repository README.
- [ ] Verify every referenced relative path exists.

### Task 4: Create/update GitHub issues for genuine remaining Jerry work

**Files:**
- GitHub issues in `Delqhi/einfach-hausen`.
- GitHub issues in `einfachhausen-de/einfach-hausen-crm` only for work that belongs to the separate CRM repository.

**Interfaces:**
- Consumes: Task 1 grouped remaining issue set.
- Produces: small actionable issue backlog with Notion synchronization Definition of Done.

- [ ] Close existing issues #1–#6 only if current production/acceptance evidence now satisfies their actual scope; otherwise leave them open with current evidence.
- [ ] Keep #7–#9 closed and reuse their closing comments as Notion evidence.
- [ ] Create only missing grouped issues, each listing the exact mapped Jerry Notion tasks and the mandatory SIN Notion completion rule.
- [ ] For each created issue add links to the relevant Archify diagram/documentation where useful.
- [ ] Re-read the open issue list and confirm no Gina/Gemeinsam-only issue was created.

### Task 5: Reconcile Jerry Notion rows and attach completion evidence

**Files:**
- Notion data source `collection://8eb1666a-1886-4510-b8e5-b286b5c73c87`.

**Interfaces:**
- Consumes: Task 1 evidence map, Task 2 visual URLs/paths, Task 4 issue URLs/comments.
- Produces: truthful Jerry task board with short durable completion/blocker notes.

- [ ] Fetch current schema immediately before updates.
- [ ] For each verified-complete Jerry row set `Status = Erledigt`.
- [ ] For each partial/external-gate row set `Status = In Arbeit`; leave genuinely untouched work `Offen`.
- [ ] Add a short page body block to completed tasks: `Ergebnis`, `Nachweis`, optional `Betriebsinfo`.
- [ ] Where a closed GitHub issue exists, include the issue URL plus its success/closing comment or concise verified completion equivalent.
- [ ] Add only the relevant Archify diagram reference to architecture/flow-heavy tasks; do not paste all diagrams everywhere.
- [ ] Query Jerry rows again and record final counts by Status.
- [ ] Query Gina and Gemeinsam counts/statuses before/after and confirm this pass did not mutate them.

### Task 6: Final verification and repository hygiene

**Files:**
- Both repositories and all generated artifacts.

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: evidence-backed completion report.

- [ ] Run `git diff --check` in both repositories.
- [ ] Run Archify verification again on the final files.
- [ ] Run Markdown/link existence checks for diagram references.
- [ ] Run `npm run lint` and `npm run build` in `einfach-hausen` if application/config files changed; documentation-only changes do not require a redundant application rebuild, but existing fresh taskplan evidence must be referenced.
- [ ] Inspect `git status --short` in both repositories and classify every change; preserve concurrent unrelated changes.
- [ ] Re-fetch GitHub issue states/comments and Notion Jerry status counts.
- [ ] Report exact completed/in-progress/open counts, issue URLs, diagrams created, verification commands, and any remaining genuine external blocker.
