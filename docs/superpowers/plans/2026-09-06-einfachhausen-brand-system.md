# Einfachhausen Brand System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans task-by-task. User-specific execution override: one Prime Agent worker, provider bai, model glm-5.3-flash, on sinsupabase; no additional model seats.

**Goal:** Preserve the complete design consultation and evidence, run three comparable working brand studies, and leave one verifiable continuation path toward the chosen production brand.

**Architecture:** Isolated linked worktree from 3d7d84ed100c21ecfe6a27074d7a22aa7ff92c04. A self-contained static study uses only existing original logo/font/photo assets and a loopback allowlist server. Existing production source remains the baseline; documentation receives additive handoff sections.

**Tech Stack:** Node 22.23.0, HTML/CSS/JavaScript, Python 3, existing playwright-core. Existing product: Next 16.3.1, React 19.2.8, CSS Modules, Inter Variable, --eh-* tokens.

**Spec:** docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md

## Global Constraints
- Execution host: sinsupabase; exact model bai/glm-5.3-flash. Never silently substitute.
- Workspace: /home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906
- Canonical task CLI target: /home/ubuntu/dev/einfach-hausen (existing valid DB, same Git common directory).
- Original logo immutable; preserve backend, auth, navigation, data, all parallel agents' work.
- No reset, clean, force-push, speculative global stylesheet replacement, or automatic re-addition of removed presentations.
- Do not mark the recommended direction as a user's accepted visual decision.
- No secrets in records; no fake memory success; no new competing task database.
- Read the full source package as needed. All primary new/modified files have complete content in SOURCE_PACKET.md; binary assets have exact paths and SHA256.
- Every test claim must name command, exit code and actual result. Existing Issue #33 is historical context; recheck current gates.

## File map
Create five executable study files, exact full code in docs/brand/source/STUDY_CODE.md and implementation.json:
- design/brand-study/index.html: identical content across three directions and three views.
- design/brand-study/study.css: three distinct brand compositions, responsive layout, product-scoped palette.
- design/brand-study/study.js: local direction/view/register controls and local-only form state.
- design/brand-study/server.mjs: exact static asset allowlist on 127.0.0.1; never expose the repository root.
- design/brand-study/verify.mjs: 27 screenshots, asset load, overflow, keyboard, registers, local-only form, error and exposure checks.
Create source/recipe files and evidence under docs/brand/; spec/plan under docs/superpowers/.
Modify AGENTS.md, README.md, docs/NEXT_AGENT.md, docs/PRODUCTION_HANDOVER.md and docs/ARCHITECTURE.md additively using exact full target text assembled from the base. Do not remove other handoff sections.

## EH-BRAND-01 — Complete brief, sources, tasks and durable context
**Files:** spec, this plan, docs/brand/HANDOFF.md, SOURCE_PACKET.md, source/BASE_SNAPSHOT.md, source/implementation.json, source/apply_package.py, source/export_packet.py, evidence/persistence.json, five additive governance docs.
**Consumes:** immutable base commit, original user instructions, findings F01–F19, original logo and current active worktree inventory.
**Produces:** exact complete source package and manifest; GitHub issue; canonical task IDs; evidence-grounded memory receipts.
- [ ] Read AGENTS.md, docs/NEXT_AGENT.md, taskplan via the canonical CLI, PRODUCT_VISION and PRODUCT_POSITIONING, full spec and source capsule.
- [ ] Apply the complete source package:
```bash
python3 docs/brand/source/apply_package.py
```
The script verifies baseline identity and refuses conflicting existing study files; complete source is in the packet.
- [ ] Export the exact canonical primary text files with complete code blocks and hashes:
```bash
python3 docs/brand/source/export_packet.py
```
- [ ] Store project facts through /home/ubuntu/.local/bin/sin-memory-write with source=the spec, its SHA256, actor=prime-agent, scope=repo:Delqhi/einfach-hausen. Store only verified facts/constraints; recommendations stay tagged as recommendations.
- [ ] Store technical design conventions through the existing SIN-Brain interface and configured store. Inspect existing configuration to locate the store; never create an arbitrary competing database. Record the returned IDs and read back each inserted convention.
- [ ] Store the exact delegation preference through the existing Honcho behavioral interface if available. Stub/no-op is not success. Record unavailability precisely and keep the unresolved persistence item open.
- [ ] Update the existing canonical taskplan through its CLI; render and validate. No direct SQLite or hand-edited generated TASKPLAN.md.
- [ ] Create/update the unique GitHub engineering issue using existing authenticated gh and a literal body file if the connector's integration cannot write.
- [ ] Commit only the own allowlisted changed paths and push the working branch; record hashes/URLs.

## EH-BRAND-02 — Build and verify three complete visual alternatives
**Files:** the five study files; docs/brand/evidence/study/*; evidence/WORKER_REPORT.md.
**Consumes:** full implementation.json, original existing assets, spec direction/content rules.
**Produces:** working local study, 27 screenshots, machine-readable verification, design-lead review package.
- [ ] Run syntax checks:
```bash
node --check design/brand-study/study.js
node --check design/brand-study/server.mjs
node --check design/brand-study/verify.mjs
python3 -m py_compile docs/brand/source/apply_package.py docs/brand/source/export_packet.py
```
- [ ] Locate existing Chromium and playwright-core without modifying a global installation or sharing mutable node_modules with a live build. The verifier accepts EH_VERIFY_DEPENDENCIES as a read-only dependency root and EH_CHROMIUM_PATH as an exact installed executable.
- [ ] Run:
```bash
node design/brand-study/verify.mjs
```
Expected: status=pass, screenshots=27; each direction/view at 390, 736, 1320px; no horizontal overflow, page errors or missing original logo; tab/detail controls and local-only form work; source exposure guard 404.
- [ ] Inspect at least architecture-home-1320.png, companion-home-1320.png, journal-home-1320.png, architecture-file-390.png and all three contact/mobile compositions. Fix actual clipped/overlapped content, not assertions.
- [ ] If a fix is needed, update actual source and corresponding implementation.json, regenerate complete code blocks and packet. Preserve original design intent; report exact changed files and reason.
- [ ] Run git diff --check; use GitNexus detect_changes before commit when available. For an absent index record exact limitation and the additive standalone scope; do not claim an executed analysis.
- [ ] Write a short worker report listing session/provider/model, base/head, files, commands/exits, screenshots, task IDs, issue URL, memory receipt/readback IDs, blockers and exactly one next action. Report success only for completed gates.
- [ ] Push own branch and prepare draft PR with why/what/evidence. No merge or deployment of an unselected brand study.

## EH-BRAND-03 — Visible brand decision
**Consumes:** three verified alternatives with identical content, evidence and review.
**Produces:** explicit decision record identifying selected direction, refinements and accepted references.
- [ ] Design lead reviews the concrete visual evidence; user can compare all three directions.
- [ ] Record the actual decision without inventing approval from implementation delegation.
- [ ] Carry forward well-received contact/hero/lexikon/footer work and unchanged product navigation.
This is an explicit decision task, not a missing implementation placeholder.

## EH-BRAND-04 — Central brand/component contract after decision
**Planned target surfaces:** DESIGN.md, docs/DESIGN_SYSTEM.md, src/components/marketing/tokens.css, src/components/Logo.tsx, src/components/logo.module.css, site-shell.tsx, a shared component catalog and agent reference rules.
- [ ] Read the then-current files, verify callers/impact using GitNexus and freeze exact target source for that selected decision.
- [ ] Standardize original-logo assets and applications, scoped design tokens, type, forms, focus/error/loading/empty/success states, imagery rules and functional motion.
- [ ] Consolidate historical documentation references and migration mapping. Deprecate specific CSS generations only after affected views pass.
- [ ] Deliver a complete source capsule for every actual target file before worker application.
No provisional full-file production replacement is provided before the visual decision and current caller analysis; inventing one would endanger parallel work.

## EH-BRAND-05 — Surface migration
**Consumes:** accepted contract and complete implementation capsules; current parallel changes.
- [ ] Website sections migrate one surface at a time; keep the twelve service areas, navigation, content and backend.
- [ ] Owner and partner apps retain their workflows and share a light product language. CRM/admin follow when explicitly included in the surface plan.
- [ ] Preview each affected surface desktop/mobile and its non-happy states. Existing roles, auth and data authority stay intact.

## EH-BRAND-06 — Regression and release evidence
**Related existing task:** T-0151. **Related issue:** #33.
- [ ] Reverify current Actions status; do not assume the historical billing block persists.
- [ ] Run repo-required gates for production code: npm run lint, npm run build, test:public-site, test:public-nav, relevant E2E and visual/responsive/a11y gates.
- [ ] Any baseline update must reference an accepted visual difference; never hide an unexpected regression by bulk regeneration.
- [ ] Update tasks/handoffs/issues/memories with actual final behavior and evidence, preserving the single canonical task source.
- [ ] Release only the exact reviewed commit under the current production handover instructions and actual user authorization.

## Self-review and completion limits
All consultation findings map to EH-BRAND-01, visual hypothesis to 02–03, components/governance to 04, incremental product application to 05, regressions to 06.
The code package is complete for the current executable wave (01–02). Later production replacement code is explicitly decision-dependent, not falsely asserted to exist.
The worker must finish the current authorized wave and make the next decision reviewable; it must not mark phases 03–06 complete from plans alone.
