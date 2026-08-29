# Einfach Hausen — Final Repository Handover

**Date:** 2026-08-29 (OCI Abschluss-Welle: T-0170 → T-0169 → T-0004 → T-0005 → T-0171)
**Execution host:** OCI-VM (sinsupabase) · canonical worktree `/home/ubuntu/einfach-hausen-oci-handoff`
**Taskplan:** `.sin-gpt-web/taskplan.sqlite3` — done: T-0170, T-0169, T-0004, T-0005, T-0171; open: T-0006 (e2e modernization)

## FINAL RESULT: ACCEPT / CONVERGED / DEPLOYED

| Item | State |
|---|---|
| GitHub main | `2ad165f0366b0db8cd651383f1e52b575972ad95` (fast-forward, SHA-Gleichheit LOCAL==REMOTE bewiesen) |
| Branch history | oci/t0170 → oci/t0169 (+ T-0004 CSP-Fix, T-0005 1:1-Konvergenz) → oci/t0171, alle gepusht |
| Production | /srv/einfach-hausen @ `2ad165f`, Service `einfach-hausen.service` active, Deploy via `deploy/update-on-oci.sh` |
| Health | `{"ok":true,"database":"ready"}` auf 127.0.0.1:3010 (nicht öffentlich) |
| Smoke | 17/17 Routes PASS @ https://einfachhausen.de |
| Backup | `/var/backups/einfach-hausen/einfach-hausen-20260829T190352Z` (+ ältere) |
| Auth | Supabase OSS self-hosted (`supabase.delqhi.com`) = Auth-Autorität; CSP connect-src enthält den Gateway-Origin (T-0004) |
| App-Daten | SQLite (`DATABASE_PATH`, better-sqlite3) — KEIN Postgres/Storage-Adapter im Code (T-0166/T-0167 waren nie ausgeführte Planung) |
| Visual | Owner-Screens 1:1 zu den 12 Original-Notion-Referenzen konvergiert (`public/notion/notion-originals/` + Evidence `T-0169/oci/round3/`); Historie: keine Referenz existent → Paritätsbasis |
| Gates frisch | auth 15/15, t0168 PASS, security 43/43, tsc PASS, lint 0 errors, build PASS, diff-check PASS, 8 Logik-Regressionen PASS, e2e:architecture PASS |
| Offen | T-0006: full-flow e2e modernisieren (Tech-Persona-Login-Naht; vor dieser Welle war der e2e komplett veraltet) |

## Externe Blocker (nicht technisch)
STRATO-DNSSEC (#16), Rechtstexte-Freigabe (#11), Stripe/SEPA-Live (#14) — Details `docs/EXTERNAL-BLOCKERS.md`.

## Canonical next action
`sin-gpt-web-state --repo . next` → T-0006. Keine konkurrierenden Roadmaps erfinden.

---

# Historisch: Abschluss T-0043 (2026-08-25)

## Verdict

**FINAL TECHNICAL VERDICT: ACCEPT / CONVERGED.**

The public website, homeowner application and partner application are accepted at production quality. The current final-convergence work contains no runtime application change after the proven production release; it consolidates acceptance evidence, architecture/operations documentation, Archify diagrams, mandatory GitNexus agent workflow and generated-state hygiene.

## Release and repository lineage

- Proven production application release: `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`.
- Final acceptance commit: `a6d8e21` (`docs: add final product acceptance matrix`).
- Generated-state hygiene: `ff2968a` (`chore: ignore generated agent state`).
- GitNexus agent workflow: `50bb5f3` (`chore: enforce gitnexus agent workflow`).
- Architecture/production handover + Archify: `8f9e5c6` (`docs: consolidate architecture and production handover`).

A direct comparison from production release `dcd53ca1` through the convergence commits shows no modifications under `src/**`, `deploy/**`, `package.json`, `package-lock.json`, Next configuration or middleware. Production runtime behavior is therefore unchanged by this repository-only convergence.

## Final verification evidence

Fresh T-0043/T-0049 verification on Mac-M1 using Node 22.22.1:

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| Security | 133/133 PASS |
| Security/Webhooks | 43/43 PASS |
| Intake | 23/23 PASS |
| Matching | 23/23 + 18/18 PASS |
| CRM regression | 20/20 PASS |
| Architecture E2E | PASS |
| Full production-style E2E | PASS |
| Browser runtime errors | 0 |
| Archify tooling | 2/2 PASS |
| Seven Archify diagram triplets | PASS |
| GitNexus detect-changes | LOW risk / 0 affected flows |
| `git diff --check` | PASS |
| Taskplan validate | PASS |

T-0042 independently records GitHub issues #1-#6 at 6/6 PASS and zero unresolved Critical/Major product gaps in `docs/FINAL_ACCEPTANCE.md`.

## Production proof retained from T-0041

- live release `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`;
- pre-deploy backup `/var/backups/einfach-hausen/einfach-hausen-20260824T220100Z`;
- restore dry-run PASS;
- production Node v22.23.0 build PASS;
- SQLite `PRAGMA integrity_check = ok` before/after;
- 59 tables before/after, 4 users before/after, 0 jobs before/after;
- `/api/health` database ready;
- public canonical routes HTTP 200 and `www` redirects to apex;
- Cloudflare tunnel/DNS QUIC + HTTP/2/API checks PASS;
- STRATO mail DNS verified;
- Stripe readiness/doctor PASS and canonical live webhook enabled.

## Worktree / lost-work audit

No dirty historical work was destroyed.

Preserved rescue branches:

- `rescue/multichannel-crm-wip-20260825` at `00e7cde`;
- `rescue/simple-crm-outreach-wip-20260825` at `edf21d5`.

Clean detached historical worktrees remain at `93ca584`. They are retained for audit/recovery, not merged into current app code because the functionality is superseded by the separately deployed standalone `einfach-hausen-crm` control plane.

Pre-final safety material:

`/Users/jeremy/dev/.safety-snapshots/einfach-hausen-pre-final-20260825T2255/`

Safety ref:

`refs/heads/safety/einfach-main-pre-final-20260825T2255`

No force push, hard reset, `git clean -fd`, destructive worktree removal or blind branch deletion was used.

## Generated/local state classification

The following are generated local state and are intentionally preserved but excluded from Git source status/lint:

- `/.gitnexus/`
- `/.sin-gpt-teamwork/`
- Python `__pycache__/` and `*.py[cod]`
- Graphify generated output already covered by the repository's existing ignore contract.

T-0049 fixed the specific conflict where a mandatory GitNexus rebuild created `.gitnexus/run.cjs` and plain ESLint then tried to lint that generated CommonJS runner.

## External-owner separation

`docs/EXTERNAL-BLOCKERS.md` remains the source of truth for legal/operator/privacy/AGB facts that require external authority. Those values were not fabricated. Optional social/marketing connector credentials remain connector-specific dependencies and are not presented as configured without live proof.

## Completion condition

T-0043 is the review/handover gate and may be completed after the canonical taskplan validates, the final verification evidence is recorded, and the handover documents are ready. The controller then commits/pushes the reviewed convergence without force and performs a final fetch proving:

```text
main == origin/main
main...origin/main = 0 0
working tree = clean
backlog = 0
in_progress = 0
blocked = 0
```

Once those conditions are proven, the repository has no remaining executable technical task. Future engineering work must start from a new reproducible defect, requirement change or explicit user request rather than reopening completed waves.
