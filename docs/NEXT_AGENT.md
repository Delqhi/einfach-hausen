# Einfach Hausen — Canonical Next-Agent Contract

**Updated:** 2026-08-27 — **HA Produktion, kein Pilot mehr**

## 1. Canonical state

Operator-Entscheidung 2026-08-27: sofortiger HA-Produktionsbetrieb mit **Supabase Postgres+Storage als Primary** und **Capacitor 6 für iOS/Android**. Kanonischer Plan erweitert auf **T-0100..T-0167** (32 v2 + 2 HA-Migrationen). The previous production acceptance remains the baseline, not the end of engineering. Always verify the transactional taskplan first:

```bash
cd /Users/jeremy/dev/einfach-hausen
sin-gpt-web-state --repo . validate
sin-gpt-web-state --repo . summary
git fetch origin --prune
git status --short --branch
git rev-list --left-right --count main...origin/main
```

Do not create a competing roadmap. The explicit v2 roadmap already exists transactionally: current counts are `backlog=32`, `in_progress=0`, `blocked=0`, and the first eligible task is **T-0100 — Homeowner onboarding: first-session to first useful outcome**. Product truth remains `docs/PRODUCT_VISION.md`; prior acceptance is `docs/FINAL_ACCEPTANCE.md`; final repository/recovery handover remains `docs/FINAL_HANDOVER.md` until T-0131 replaces the technical completion checkpoint.

## 2. Accepted production baseline before completion-v2

T-0042 concluded **ACCEPT** with GitHub issues #1-#6 at **6/6 PASS**, all major binding PRODUCT_VISION capabilities accepted, and zero unresolved Critical/Major technical findings.

That acceptance is retained as the known-good production baseline. It does **not** cancel the new operator-requested T-0100..T-0131 technical completion backlog.

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

Canonical tasks T-0003, T-0006, T-0007 and T-0008 are resolved by `einfach-hausen-finisher`: production live-check PASS at release `dcd53ca1` (no redeploy needed for `f0198ee`), Domain-Cutover issue [#16](https://github.com/Delqhi/einfach-hausen/issues/16) created, STRATO mailbox recorded as external blocker `EH-O01`, and the Archify sync design classified as adopted/implemented. Details: `.sin-gpt-web/reports/COMPLETION-FINAL.md`. That historical checkpoint had backlog=0.

## 6b. Product-completion v2 + HA checkpoint — 2026-08-27

Der kanonische Taskplan enthält jetzt **T-0100..T-0131 plus T-0166 Supabase Postgres+Storage HA-Migration und T-0167 Capacitor iOS/Android Release**. Abdeckung: Onboarding E2E, Outbox/Dispatcher, Matching-Qualität, Reviews/Trust, i18n, WCAG, CWV, Security, Observability, Restore-Drills, Feature Flags, Admin, Privacy, Browser E2E, Visual Regression sowie **Supabase-Cutover (Zero-Downtime, Postgres+Storage) und Capacitor native Auslieferung**.

Produktion ist ab sofort **HA**: **Supabase Postgres = Primary DB**, **Supabase Storage = Primary Blob-Store** (`private`/`uploads`), **SQLite nur Local-Dev Fallback**. **Capacitor 6** ist aktiver Produktionspfad für iOS+Android. Externe Blocker reduziert auf **#16 STRATO-DNSSEC, #11 Rechtstexte, #14 SEPA/Stripe-live** — **#12 App Stores kein Blocker mehr**.

Updated: **2026-08-27** — kein Pilot mehr.

## 6c. T-0168 Deep-Research convergence checkpoint — 2026-08-28

T-0168 war als UI-Abnahme bereits `done`, wurde durch Deep Research jedoch um harte Produktions-Auth- und visuelle Evidence-Gates erweitert. Die vollständige Analyse steht in [`T0168_DEEP_RESEARCH.md`](T0168_DEEP_RESEARCH.md).

Unmittelbare Fortsetzung:

1. aktuellen HEAD/Dirty-State sichern und fremde Arbeit bewahren;
2. GitNexus Context/Impact für die Auth-Konvergenz nutzen;
3. den Produktions-Dual-Auth-Split test-first beseitigen: Supabase serverautoritativ, SQLite/`mh_session` nur explizit Local Dev und in Produktion fail-closed;
4. Auth-/Security-E2E grün machen;
5. echte authentifizierte 390×844-Captures erstellen;
6. für die Notion-Referenzen Reference/Actual/Overlay/Diff erzeugen;
7. nur messbare UI-Abweichungen korrigieren;
8. TypeScript, `npm run build`, `git diff --check`, GitNexus detect_changes und Taskplan-Validierung erneut ausführen;
9. Evidence und Pflichtdokumente synchronisieren.

Der kanonische Taskplan enthält hierfür eigene Folge-Tasks; deren Status und Abhängigkeiten sind maßgeblich. T-0100 bleibt Produkt-Roadmap-Fortsetzung **nach** dem T-0168-Konvergenzpaket.

## 7. Resume rule

If canonical taskplan validation shows `backlog=0`, `in_progress=0`, `blocked=0`, **stop**. The current state is intentionally not zero because an explicit user instruction created T-0100..T-0131. Continue the highest-priority eligible canonical task; do not manufacture a second roadmap.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0167`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen HA-Produktion — Supabase Postgres+Storage als Primary, Capacitor iOS/Android, SQLite nur Fallback
- Resume rule: product-completion HA is T-0100..T-0167; continue highest-priority eligible task (T-0100 + T-0166/T-0167), no pilot wording
- Taskplan sync: `pass`
- Synchronized at: `2026-08-27T00:00:00+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-27T18:40:34+00:00
actor: local-agent
evidence-sha256: de1ac5bafab8293536d80337218610d962b3b1fcc8baef17a9aa555ecf98ab4e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-28T00:13:59+00:00
actor: chatgpt-web
evidence-sha256: 7b95d7194762ef3fe8831d35665f826d7c08738a8ccfb0862391b464590a7dd9
-->
