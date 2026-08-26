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

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-26T12:37:50+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-26T12:47:21+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-26T12:57:44+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-26T13:21:53+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-26T13:31:30+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-26T13:41:27+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-26T13:47:37+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-26T14:15:40+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-26T14:27:32+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-26T15:43:26+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-26T15:44:24+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-26T17:58:59+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-26T18:04:35+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-26T18:10:05+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-26T18:18:41+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-26T18:23:00+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-26T18:44:41+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-26T18:58:51+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-26T19:03:51+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-26T19:25:24+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-26T19:25:25+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-26T19:30:34+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-26T19:30:47+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-26T19:30:48+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-26T19:36:09+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-26T19:38:16+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-26T19:38:17+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-26T20:15:45+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->
