# Vollständige Quelldateien der Lieferung

Basiscommit: 77e1e558afbfd27ae4d80cec571a6b2a6c2ad685. Pfade relativ zu diesem Repository. Dateien vollständig, keine Auslassungszeichen. Binärdateien werden im Manifest mit SHA256 referenziert. Dieses Dokument ist ein Nachschlagewerk; implementiert wird aus den versionierten Quelldateien.

## .gitattributes

`````text

# Generated verbatim source packet preserves inherited Markdown/code whitespace.
docs/brand/system/SOURCE.md whitespace=-blank-at-eol

`````

## .github/CODEOWNERS

`````text
# Brand authority. Existing permissions still apply; never treat an agent as a separate owner.
/packages/eh-design/ @Delqhi
/DESIGN.md @Delqhi
/design/design-*.json @Delqhi
/scripts/eh-design-* @Delqhi
/.github/workflows/eh-design.yml @Delqhi
/.github/CODEOWNERS @Delqhi
/src/design-system/ @Delqhi

`````

## .github/workflows/eh-design.yml

`````yaml
name: Einfachhausen design
on:
  pull_request:
  push:
    branches: [main, "design/**"]
permissions:
  contents: read
jobs:
  consistency:
    name: EH design consistency
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Select trusted guard
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
        run: |
          mkdir -p "$RUNNER_TEMP/eh-trusted"
          if [ -n "$BASE_SHA" ] && git cat-file -e "$BASE_SHA:scripts/eh-design-check.mjs" 2>/dev/null; then
            git show "$BASE_SHA:scripts/eh-design-check.mjs" > "$RUNNER_TEMP/eh-trusted/check.mjs"
          else
            cp scripts/eh-design-check.mjs "$RUNNER_TEMP/eh-trusted/check.mjs"
          fi
      - name: Verify design contract
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
          EH_DESIGN_ROOT: ${{ github.workspace }}
        run: |
          if [ -n "$BASE_SHA" ]; then
            node "$RUNNER_TEMP/eh-trusted/check.mjs" --base "$BASE_SHA"
          else
            node "$RUNNER_TEMP/eh-trusted/check.mjs"
          fi
      - name: Verify generated tokens
        run: node scripts/eh-design-generate.mjs --check
      - name: Exercise guard failures
        run: node --test scripts/eh-design-check.test.mjs scripts/eh-design-html.test.mjs

`````

## AGENTS.md

`````markdown
<!-- EH-DESIGN-AUTHORITY-V1:BEGIN -->
## Verbindliche Einfachhausen Gestaltung · 2026-09-06

Jerry hat Atelier 02 ausdrücklich freigegeben. Für ALLES rund um Einfachhausen gilt Designsystem 1.0: Website und Unterseiten, Owner-/Handwerker-App, CRM, Portalhub, Präsentationen.

**Andere Agenten dürfen das Design NICHT eigenständig verändern.** Pflicht: `sin-eh-design` laden, aktuelle `DESIGN.md` lesen, kanonische `packages/eh-design`-Komponenten bzw. versiegelte `vendor/eh-design`-Kopie verwenden. Neue Seiten werden aus vollständigen Recipes und vorhandenen Blöcken inhaltlich passend zusammengesetzt. Keine eigene Farbpalette, Schrift, Logo-Nachbildung, lokale Stilfamilie oder „kreative“ Neuinterpretation. Guard/Baseline/Workflow niemals zum Bestehen eines eigenen Checks abschwächen oder neu versiegeln.

Original-Logo, selbst gehostete Inter, lesbare Typografie, Hauskante und funktionale Registerlinien sind festgelegt. Businesslogik, Navigation, Auth und Daten bleiben erhalten. Eine neue Seite ist keine Autorisierung zur Änderung des Markendesigns. Fehlende Bausteine als konkreten Bedarf an die Designautorität melden; sonst mit vorhandenen Bausteinen weiterarbeiten.

Übergaben müssen sämtliche neuen/geänderten Quelldateien vollständig mit Pfaden, Asset-Hashes, tatsächlichen Befehlen und Ergebnissen enthalten. Keine Platzhalter oder „Rest analog“. Aktuelle Quellkapseln: `docs/brand/system/`. Historische PR40-Studien sind verworfen; alte „Atelier 02 noch nicht freigegeben“-Notizen sind überholt.
<!-- EH-DESIGN-AUTHORITY-V1:END -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Einfach Hausen engineering workflow

### Canonical company identity

- **Gina Schulze = Inhaberin und Geschäftsführerin von Einfach Hausen.**
- **Jeremy Schulze = Developer / technische Entwicklung; nicht Inhaber, Betreiber oder Geschäftsführer.**
- Binding source: `docs/COMPANY_IDENTITY.md`. Public legal copy, docs and generated content must follow it. „Jerry-owned“ in task boards means engineering assignment only, never company ownership.
- Never invent legal form, address, register, VAT-ID or phone data. Use only verified business data.

### Single-goal coordination contract

- **One repository = one goal.** Every agent works toward the same canonical goal from `.sin-gpt-web/taskplan.sqlite3`: finish the complete Einfach Hausen platform to production quality, prove acceptance, then converge the repository. Do not create side-roadmaps, duplicate task lists, speculative redesign waves, or parallel infrastructure goals.
- **Mandatory read order before work:** `docs/NEXT_AGENT.md` → `.sin-gpt-web/TASKPLAN.md` → the exact `sin-gpt-web-state show <TASK>` record → `docs/PRODUCT_VISION.md` and any task-specific docs. Historical reports are evidence, never the current roadmap.
- **Always take the highest-priority eligible canonical task.** Do not work a completed/cancelled task again. Do not invent a new task when an existing canonical task covers the work.
- **Current explicit operator roadmap (2026-08-28 OCI migration):** First complete the verified **Mac-M1 → GitHub → OCI-VM** handoff. After the GitHub release SHA is proven, **OCI-VM is the canonical execution host** for `einfach-hausen`; Mac-M1 is source/release/recovery only. Immediate critical chain: **T-0170 OCI SIN Supabase auth convergence → T-0169 Notion 1:1 visual acceptance → T-0171 final convergence**, then resume the highest-priority eligible product-completion task. **SIN Supabase OSS on OCI is the target production auth/data authority; Supabase Cloud is not part of the target architecture.** SQLite remains explicit local-development fallback only.
- Before ending a wave, update canonical task evidence/state, render+validate the taskplan, and update `docs/NEXT_AGENT.md` only if the continuation point changed. Leave exactly one unambiguous next action for the next agent.
- README, worker reports, GitHub issues, Notion and ad-hoc docs must not become competing engineering roadmaps. They may link to or summarize the canonical taskplan only.

- `docs/PRODUCT_VISION.md` is the binding product definition. Preserve the core model: AI organizes, verified regional partners execute, and a concrete human contact takes over after booking.
- `docs/PRODUCT_POSITIONING.md` is the binding strategic positioning layer. Product and UX choices must reinforce Einfach Hausen as the **personal house manager / operating system for the home**: reduce mental load, increase decision confidence, preserve house memory and value, and reduce fragmented tools/contacts. Do not foreground AI, lead-marketplace or generic portal positioning when a homeowner-facing benefit can express the same capability.
- `DESIGN.md` is the binding visual/UX contract across the public website, homeowner app, and partner app. Read it before touching UI. During parallel surface-specific design waves, treat it and shared business logic as read-only and stay inside the task's allowed paths.

### Public website finish contract (2026-09-05)

- The public website now has a canonical information architecture: existing top-level navigation stays stable, while `Leistungen` exposes the 12 service areas through a desktop megamenu and mobile disclosure. Do not flatten this back into a single generic link list.
- `src/components/marketing/service-catalog.tsx` is the public service source of truth; detail pages use the shared `ServiceDetailPage` archetype. Do not create divergent copy-paste service pages.
- Public product explainers `/beratung`, `/notfall`, `/versicherung` and `/immobilienverkauf` describe existing app capabilities and their limits. Marketing copy must not promise automatic insurer contact, guaranteed 24/7 emergency coverage, or data sharing without explicit approval.
- Website polish must stay inside the accepted design system. No rebrand, no alternate token set, no new visual language. Improvements are hierarchy, composition, spacing, typography, navigation, responsive behavior and accessibility using the existing `--eh-*` tokens/components.
- Public website release evidence now includes `npm run test:public-site`, `npm run test:public-nav`, full `npm run test:e2e` and the 72-shot visual matrix.
- For architecture, dependency flow, blast-radius questions, and unfamiliar code paths, use Graphify first: `graphify query`, `graphify explain`, or `graphify path`. If the graph is absent or stale, run `npm run graph:update`.
- Graphify output is generated local state under `graphify-out/` and is intentionally not committed. Git hooks installed by Graphify refresh the graph after commit/checkout.
- Before shipping application changes run `npm run lint`, `npm run build`, and the relevant E2E flow (`npm run test:e2e` for end-to-end product changes).
- Reuse the existing OCI stack (OmniRoute, **SIN Supabase OSS**, Kestra, Cloudflare) instead of introducing parallel infrastructure unless there is a demonstrated gap. After the migration release, run repository, test, build, GitNexus and Prime-Agent/Luna work for this project on **OCI-VM**, not Mac-M1. GitHub is the only Mac→OCI code-transfer boundary; never copy a dirty Mac working tree directly to OCI.
- **Production/domain continuation:** Before changing production infrastructure, DNS, Cloudflare, STRATO, Stripe or OCI routing, read `docs/PRODUCTION_HANDOVER.md` and `docs/OPERATIONS.md`. Treat handover status as a starting point only; verify live state before mutations.
- Keep the customer and partner products radically simple. Do not add generic ERP-style roles, settings, dashboards, or configuration unless required by the product vision.

## GitHub issue ↔ Notion completion rule

- The canonical business task board is the Notion database **Einfachhausen – Aufgaben**: https://app.notion.com/p/912c28152aa04ada9d22147e44f0f2c3 . GitHub tracks engineering execution; Notion tracks business-visible completion. Do not create a second task database.
- For GitHub work derived from that board, only execute the Jerry-owned checklist items named in the issue. Gina-owned and Gemeinsam-owned items are out of scope unless a separate task explicitly says otherwise.
- When starting a Jerry item, use the configured **SIN Notion** integration to find the matching Notion task and set `Status = In Arbeit`.
- Before closing/completing the GitHub item, use SIN Notion again to set every finished matching task to `Status = Erledigt` and append a short task-page note with: **Ergebnis**, **Nachweis** (files/routes/tests/commit or issue), and any durable **Betriebsinfo** another agent needs.
- If a task is only partially complete or blocked by external authority, keep it `In Arbeit` and document the exact blocker/evidence on the Notion task page. Never mark a task done from assumption or from an issue title alone.
- A GitHub issue is not complete until code/docs verification and the required Notion synchronization both succeed, except when the Notion service itself is unavailable; in that case leave explicit retry evidence in the issue.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **einfach-hausen** (23711 symbols, 52258 relationships, 300 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/einfach-hausen/context` | Codebase overview, check index freshness |
| `gitnexus://repo/einfach-hausen/clusters` | All functional areas |
| `gitnexus://repo/einfach-hausen/processes` | All execution flows |
| `gitnexus://repo/einfach-hausen/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0171`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen — Owner-App/Website auf Produktionsqualität konvergiert (Notion-Original-Referenzen), Auth via self-hosted SIN Supabase, App-Daten SQLite
- Resume rule: read/validate the canonical taskplan (.sin-gpt-web/taskplan.sqlite3) and continue its highest-priority eligible task
- State 2026-08-29: DONE T-0170/T-0004/T-0169/T-0005/T-0171 (main=2307493, production bdebe9f, Smoke 17/17); open: T-0006 e2e modernization
- Taskplan sync: `pass`
- Synchronized at: `2026-08-29T18:59:08+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-31T20:53:01+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-31T20:53:03+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-31T20:52:53+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-31T20:52:54+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

## T-0168 Auth- und Visual-Acceptance-Regel (2026-08-28)

- **Produktions-Auth:** Supabase ist die serverseitige Identity Authority. Lokale SQLite-/`mh_session`-Auth ist nur als expliziter Local-Dev-Fallback zulässig und muss in Produktion fail-closed sein.
- **Client-Grenze:** `AuthContext` ist UI-State, nicht Security Boundary. Geschützte Server Components, Route Handler und Server Actions autorisieren serverseitig.
- **Identity Mapping:** Supabase-Subject und bestehende Application-User-ID dürfen nicht ungeprüft gleichgesetzt werden; Mapping muss explizit belegt sein.
- **Visual Acceptance:** Finale T-0168-Abnahme benötigt frische 390×844 Reference/Actual/Overlay/Diff-Evidence und grüne Auth/Security/Visual/Build/GitNexus-Gates. Vollständiger Vertrag: `docs/T0168_DEEP_RESEARCH.md`.

## Notion 1:1 Regel (2026-08-28) - lokal gespeichert

- **Quelle:** https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d - 12 Bilder lokal unter `public/notion/`.
- **Regel:** Alles was nicht 100% 1:1 wie auf den Bildern aussieht, wird entfernt und neu gemacht. Keine 90% Lösungen. Pixelgenau: Farben, Radien, Shadows, Typo, Icons, Header, Tabbar.
- **Design-Basis:** Notion Bilder > DESIGN.md > Implementation. DESIGN.md wird nach Notion kalibriert.

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-22T16:24:18+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-22T17:06:16+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0200
updated: 2026-08-30T04:10:43+00:00
actor: local-agent
evidence-sha256: 425e861d61478080b23cc52ad6b64973eb901e909bbe35dd7fb24a555e299358
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0201
updated: 2026-08-30T04:29:48+00:00
actor: local-agent
evidence-sha256: c5758386de9a32943594941ee15b2faf7dd48bcd822565e0419448383e33c180
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0202
updated: 2026-08-30T04:39:54+00:00
actor: local-agent
evidence-sha256: 0bc75649da580b92e8c385c0ce01f150f9b48f18b1ac0d2c9ee40525373e504f
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0203
updated: 2026-08-30T04:59:52+00:00
actor: local-agent
evidence-sha256: b734c3298856af57db7cbd01c11010da44ffcc25472c8142ae1011378a1a4699
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0204
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: 26d2c37b44b0e2ecdd412fa38e9987742b09de7fdb3d65324b840eee1997f5d8
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0205
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: f1288185ef3bec19c87d3ccaf8e935f8a33480e8db7f734bae58d6874f3a4d43
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0042
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: b0522c720f2d26ef171afa4f8b0bd77eb82cd987694ae7791144c8df2c9124fd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0043
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: 7690208a2287a2d7d24bc2b266c299ac0cdbdaac3e76839323fb142c4ea23138
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0049
updated: 2026-08-31T20:52:49+00:00
actor: local-agent
evidence-sha256: 0d6781d978ed15bc779a17b686785e5efe3810adb2563c2731c51acc8f2f82c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0157
updated: 2026-08-31T21:16:05+00:00
actor: local-agent
evidence-sha256: 7f99e3ef8bfd11d211e6dbda80fa766914a185971e4f6883515209aba957fb5f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0160
updated: 2026-08-31T22:25:51+00:00
actor: local-agent
evidence-sha256: a0374312071e4a6d50a86e2706a720cb563cff292dd03c20102c6c0ac8b63098
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0161
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: 8347892ea96120456d7b66b9aba1440561a66d689fce427bda41928e3e8003b4
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0162
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: ff5ccd0484ed2266c6ce264e4b9f21b41f1bd97f7e8c73ff4c98e9216edf19cd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0163
updated: 2026-08-31T22:56:47+00:00
actor: local-agent
evidence-sha256: fb1882e2df32385413315728fdb2731a84376c39873250aa2cf0335a2c913c98
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0154
updated: 2026-09-01T00:56:58+00:00
actor: local-agent
evidence-sha256: 83e5ed487aff86dee8b825d9f06d859654d292349ec6538442ac1f725c3dbe1b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0152
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 75fc109f1509113951e589eae987093b5e6ae117d9fd29e758a6c673897685d3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0153
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 08da5c23cd9a4bb84512af6dc432989154d9da35f011f18bf9ef15fb7a650193
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0155
updated: 2026-09-01T01:47:14+00:00
actor: local-agent
evidence-sha256: 02c7cb988ff4f3990fdd17d9a4772d50152245ab2becbbd66f768202ec391bc8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0156
updated: 2026-09-01T03:30:24+00:00
actor: local-agent
evidence-sha256: 994ea2169cfa09d65fa7fa4e2b29c4f8e02de905c613b7d24ebd946ec7c7d4b0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0115
updated: 2026-09-01T03:30:25+00:00
actor: local-agent
evidence-sha256: ef7edcae3cf6bd3ad470c34205fa815916c109e4709b0298ac4f0a4068e48968
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0111
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: 87e072d5e2c574dbf26ce3c530c85fb1d6a5a871034892d6adf8dc40ec8a3ae9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0112
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: f193fa11049f920c888558209118f7b7592a95a4e86ace0c92274995b906db8d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0138
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: 0ab111892a30d55ad46e7f6232b32f64656dee72cc4b9937613c3f2a3d9c925a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0142
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: bceab63e963dd389c859027e3e4221a6a50386a99dfad656912ed9445f0038fe
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0113
updated: 2026-09-01T13:55:36+00:00
actor: local-agent
evidence-sha256: 07b6275707f950b590ed96ec928ab841e01791e4761d591f616d20f0fc5e80cc
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0114
updated: 2026-09-01T13:57:24+00:00
actor: local-agent
evidence-sha256: db6e60f478405d43372683fbf7d760ddb32ef5fb7c5c608ca152e3115cca052b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0116
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: cfbef8fb88b67a309e81fa923357ecfc6f2a6808005e9d697e457401171f9ce5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0117
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: 32b178026b6612aa0bc5ea8813b094a8e7b84293e8c9f8a5706a02435767ed03
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0136
updated: 2026-09-01T18:06:52+00:00
actor: local-agent
evidence-sha256: 766040d87c6e2dbae195442af395ea3b2fddc2c114f4fbe4a7963f3a4d6463ea
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0147
updated: 2026-09-01T19:19:57+00:00
actor: local-agent
evidence-sha256: 4149908d9dda7f1397ce06f9aadccce2ae5c038d469a1adeb8e1e3f02d0a2ff9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0118
updated: 2026-09-01T20:51:22+00:00
actor: local-agent
evidence-sha256: c55fee22cf93a7578d26053014ef8e42b4a7534775e5e1a5d1fd60053eb1d405
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0119
updated: 2026-09-01T22:14:14+00:00
actor: local-agent
evidence-sha256: 0acd76be267c23dd81333e674d9c0eee29d42c3f07154718697fae9f793a26b6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0210
updated: 2026-09-02T23:18:15+00:00
actor: local-agent
evidence-sha256: 80f9aad504a029dbe80faed7a0cf4c152de5bf88a4b1880edf60f754211dea51
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0211
updated: 2026-09-02T23:18:41+00:00
actor: local-agent
evidence-sha256: 60f232b4e4d8bb71c603011e8a96ba47b0b2b4f04b45106ed5ab759dbc9d69a0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0120
updated: 2026-09-02T23:49:07+00:00
actor: local-agent
evidence-sha256: 73903ba5ee89d8c893c1f1fd2a10d42aeeba247966ba2045494555aa353d28e5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0121
updated: 2026-09-02T23:56:26+00:00
actor: local-agent
evidence-sha256: 01f5f6cb64432cac1825787493c591f7d4d2c263eff4860738564f29f1259336
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0122
updated: 2026-09-03T00:15:44+00:00
actor: local-agent
evidence-sha256: dca081a3188c1676492cf6cfd60f6b5d044444af48a818ae6173c43636c209fb
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0131
updated: 2026-09-03T12:19:04+00:00
actor: local-agent
evidence-sha256: 95b14cf53c5f2030d04c08f2b5dd9dfbb343623139fc5ce9e720d09533c6be38
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0123
updated: 2026-09-03T00:23:19+00:00
actor: local-agent
evidence-sha256: d05fdcb413b5af3832a99bb11e2726eab2c7c3682e25b7c74203edb5e4bd3544
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0124
updated: 
actor: local-agent
evidence-sha256: 7b56927949e37e438aa734d75f4b3eed9bd85a667118aa51838decfaccecfcb7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0129
updated: 
actor: local-agent
evidence-sha256: a2028224c451c9d493976891e8e4061d8fbe7cbe6e5155f21be5f251a13b16be
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0130
updated: 
actor: local-agent
evidence-sha256: db4bfd0327fb8cd3dcc011d26631b8b064c1a6b0952880d4fbb8d34877b61b84
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0125
updated: 
actor: local-agent
evidence-sha256: 24ead3c1a5c517e9724996338b7426ad3e8e2c18cd519e08d1f683f72f4d788b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0126
updated: 
actor: local-agent
evidence-sha256: 1acbbc8c9d9ec3b87035c8d0521fa2c3622fa697e6d719310f61795b15fda6e8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0127
updated: 
actor: local-agent
evidence-sha256: 0640af1175d4cd871685513652419379eec835cf543aed5dfc69b0bfcadc4a29
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0128
updated: 
actor: local-agent
evidence-sha256: 52a6748748dfe2d958322ba6584bcd9e8cd8284ed731054bf7f3d48948bf4d4a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-01
updated: 2026-09-05T02:00:41+00:00
actor: chatgpt-web
evidence-sha256: 223ddabf850fcb56047dafd0834c4648fe0356286d14630d790002d451660459
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-02
updated: 2026-09-05T02:19:47+00:00
actor: chatgpt-web
evidence-sha256: d3169b9afa465be4ab22588b73903be33178b28010810633f5fb6546dc51f563
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-03
updated: 2026-09-05T04:33:10+00:00
actor: local-agent
evidence-sha256: b9300da9b1e348fc386da08fda11e75c105f6db589d60a0f190ae0af25041437
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-04
updated: 2026-09-05T06:26:03+00:00
actor: chatgpt-web
evidence-sha256: 0bf6db00102a87441e641b95f92d629df17ac5aa3144da80eeb67f83cab48460
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-05
updated: 2026-09-05T09:09:00+00:00
actor: chatgpt-web
evidence-sha256: e072648f313eb7d38b0daa3a917b5f8b9cfbee90f62754f8cef486aa6b258c03
-->

## EH-BRAND — Operator-Auftrag vom 06.09.2026

Der aktuelle Operator beauftragt die vollständige Markenstudie, Dokumentation und Delegation an Prime Agent bai/glm-5.3-flash auf sinsupabase. Die frühere Kein-Rebrand-Regel begrenzt die bestehenden Produktionsflächen; die neue isolierte Markenstudie ist ausdrücklich angefragt. Kein stiller Wechsel von Modell oder Host. Original-Logo, Produktlogik, Navigation und fremde Agentenarbeiten erhalten. Konkreter Umfang und vollständige Befunde stehen in der unten verlinkten Spezifikation.

- Spezifikation: `docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md`
- Ausführungsplan: `docs/superpowers/plans/2026-09-06-einfachhausen-brand-system.md`
- Handoff: `docs/brand/HANDOFF.md`
- Vollständiger Zielquelltext: `docs/brand/SOURCE_PACKET.md`
- Tasks: EH-BRAND-01 bis EH-BRAND-06; vorhandenes T-0151 und Issue #33 berücksichtigen.
- Ausführung: `/home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906`, Branch `design/einfachhausen-brand-system-20260906`, Node 22.23.0.


## EH-BRAND — Korrektur: Atelier 02 (2026-09-06)

Der Nutzer hat die drei Stilproben aus PR #40 ausdrücklich verworfen. Deren technische 27/27-Prüfung ist keine visuelle Freigabe. Root Codex gestaltet und implementiert die neue Richtung persönlich; keinen weiteren Prime/bai-Dispatch aus alten Abschnitten ableiten. Neuer Arbeitsstand: `design/einfachhausen-brand-atelier-20260906`, Workspace `/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906`. Konzept, vollständige Nutzerkorrektur und Plan: `docs/brand/ATELIER_02.md`; aktuelle Übergabe: `docs/brand/HANDOFF.md`; vollständige Quellen: `docs/brand/ATELIER_02_SOURCE.md`; bedienbare Vollansicht: `design/brand-atelier/preview.html`. EH-BRAND-03 bleibt in Arbeit, die neue Richtung wurde noch nicht vom Nutzer bewertet. Genau nächste Markenaktion: diese neue Vollansicht besprechen und tatsächliches Nutzerfeedback dokumentieren. EH-BRAND-04..06 folgen erst der Richtungsentscheidung; kein Merge/Deploy. Ältere Empfehlungen/Dispatch-Anweisungen sind für diese Markenwelle historisch. Andere laufende Arbeitswellen bleiben erhalten.

`````

## DESIGN.md

`````markdown
# Einfachhausen · Designsystem 1.0

**Verbindlich seit 6. September 2026.** Jerry hat Atelier 02 ausdrücklich angenommen: „omg das ist MEGA!“ Diese Freigabe ersetzt den früheren Status „noch nicht visuell freigegeben“. Die drei alten Stilproben aus PR40 sind verworfen. Der angenommene Entwurf und seine ursprüngliche Begutachtung bleiben unter `design/brand-atelier/` und `docs/brand/ATELIER_02.md` als historische Referenz erhalten.

## 1. Autorität und Geltungsbereich

Dieses Dokument und `packages/eh-design/` definieren die Marke für Website, Unterseiten, Hausakte, Owner-App, Handwerker-App, CRM, Portalhub und Präsentationen. **Andere Agenten dürfen das Design nicht eigenständig verändern.** Der Auftrag, eine neue Seite zu bauen, ist keine Erlaubnis, Farben, Schrift, Logo, Radien, Effekte oder eine eigene Komponentenfamilie zu erfinden. Nur eine ausdrückliche Anweisung von Jerry zum Markendesign autorisiert eine neue Designversion. Ein fehlender Baustein wird als Bedarf dokumentiert; bis zur Entscheidung wird eine bestehende passende Komposition verwendet.

Inhalt, Reihenfolge, Seitenstruktur, echte Bilder, fachliche Daten, erlaubte Komponentenvarianten und bestehende Aktionen dürfen passend zum Thema kombiniert werden. Unterschiedliche Seiten sollen unterschiedlich aufgebaut sein. Einheitlichkeit bedeutet gemeinsame Gestaltungssprache, nicht identische Seiten.

Bei widersprüchlichen alten Dokumenten gilt diese angenommene Version. Historische Freigaben, Screenshots und Aufgaben bleiben nachvollziehbar, dürfen aber nicht als heutige Gestaltungsanweisung wiederverwendet werden.

## 2. Das Eigene an Einfachhausen

**Zuhause, mit Überblick.** Die Marke verbindet ein persönliches Zuhause mit klarer, nachvollziehbarer Ordnung. Die Gestaltung fühlt sich warm und entschieden an. Sie zeigt echte Inhalte und Beziehungen: Menschen, Unterlagen, Arbeiten, Termine und Hausgeschichte.

- **Hauskante:** genau eine bewusst geschnittene 45°-Ecke an großen Bildflächen und Aktenumschlägen. Keine abgeschnittenen Eingabefelder oder Schaltflächen. Wichtige Gesichter und Bildaussagen bleiben sichtbar. Interaktive Elemente liegen nicht im abgeschnittenen Bereich.
- **Hauslinie:** feine, funktionale Linien gliedern Register, Abläufe, Listen, Vergleiche und Chroniken. Nummern geben Orientierung. Keine zufälligen farbigen Streifen als Dekoration.
- **Wortbild:** kräftige, eng gesetzte Inter-Überschriften mit ruhigem Fließtext. Keine zweite Displayschrift. Der handschriftliche Teil des unveränderten Original-Logos bleibt die einzige Schreibschrift.
- **Rhythmus:** helle Arbeitsflächen und Lesestrecken, dunkle Kapitel oder Aktenumschläge. Sand setzt inhaltlich begründete Flächen ab. Keine beliebige Sammlung gleichförmiger Karten.
- **Fotografie:** glaubwürdige Wohnsituationen und persönliche Zusammenarbeit. Keine erfundenen Kunden, Mitarbeiter, Bewertungen oder Erfolgszahlen. Illustrative Bilder werden entsprechend bezeichnet. Bilder nie pauschal so beschneiden, dass Köpfe verschwinden.

Verboten sind neue Verläufe, Glow, Glassmorphism, schwebende Kugeln, dekorative Dauerschleifen, beliebige Pillen, nachgebaute Logos und autonome „Verbesserungen“ der Marke.

## 3. Eine einzige Markenquelle

| Quelle | Aufgabe |
| --- | --- |
| `packages/eh-design/src/tokens.json` | Kanonische, versionierte Werte |
| `packages/eh-design/src/tokens.css` und `tokens.ts` | Daraus generierte CSS- und TypeScript-Ausgaben |
| `packages/eh-design/src/styles.module.css` | Einzige neue Komponentenstilquelle |
| `packages/eh-design/src/primitives.tsx` | Grundlagen |
| `packages/eh-design/src/blocks.tsx` | Inhaltsblöcke |
| `packages/eh-design/src/app.tsx` | Interaktive und funktionale App-Komponenten |
| `packages/eh-design/src/recipes.tsx` | Vollständige, ausführbare Seitenvorlagen |
| `src/design-system/index.ts` | Importstelle der Website |
| `src/app/design-system/` | Browserbibliothek unter /design-system; noindex |
| `src/components/marketing/ui.tsx` | Kompatible Adapter für vorhandene Unterseiten |
| `src/components/marketing/tokens.css` | Alte Namen als Aliase, keine zweite Palette |
| `design/design-lock.json` | Prüfsummen des geschützten Designkerns |

Andere Repositories erhalten eine identische, versionierte Kopie nach `vendor/eh-design/` und eine Prüfsummenliste unter `design/eh-design-vendor.json`. Diese Kopie wird niemals lokal umgestaltet.

### Farben

| Rolle | Wert | Verwendung |
| --- | --- | --- |
| Papier | #faf8f4 | Grundfläche |
| Petrol | #105258 | Primäre Aktion, Orientierung |
| Tiefes Petrol | #0a3539 | Aktenumschlag, Kapitel, Abschluss |
| Tinte | #10222a | Fließtext und Überschriften |
| Sekundärtext | #4b5b60 | Lesbare Metadaten |
| Linie | #e4e2dc | Gliederung auf hellen Flächen |
| Sand | #ecdfc9 | Hinweise und sachliche Hervorhebungen |
| Terra | #a84d29 | Kleine Registersignale und begründete Hinweise |
| Weiß | #ffffff | Eingaben und funktionale Arbeitsflächen |

Statusfarben `error` und `success` gehören ebenfalls zu den kanonischen Tokens. Status braucht immer Text; Farbe alleine ist keine Information. Dunkle Flächen verwenden Papier als Textfarbe und Sand als Sekundärtext.

### Schrift und Lesbarkeit

Inter Variable wird selbst gehostet. Originaldatei: `src/fonts/InterVariable.woff2`; identische Paketkopie: `packages/eh-design/assets/inter-variable.woff2`. Keine externen Google-Font-Anfragen.

| Verwendung | Mindestwert / Skala |
| --- | --- |
| Website-Fließtext | 17–18 px; lesende Artikel 18 px |
| App-Fließtext | 16 px |
| Beschriftungen und Aktionen | 15 px; bestehende Übergangsflächen mindestens 14 px |
| Metadaten und Bildunterschriften | 13 px |
| Kurze, nicht entscheidende Großbuchstabenregister | 12 px |
| Input, Select, Textarea | 16 px, auch mobil |
| Startseiten-Display | 56–112 px, responsive |
| Unterseiten-H1 | 44–68 px |
| App-H1 | 32–44 px |
| Präsentation bei 1920×1080 | Bild-/Fußtexte mindestens 24 px, Inhalt 32–36 px, Titel 56–88 px |

Eine überladene Folie wird inhaltlich aufgeteilt. Text wird nicht bis zur Unlesbarkeit verkleinert oder abgeschnitten. Numerische Schritte bleiben ungebrochen. Absätze haben kurze, sinnvolle Leselängen; lange Fachtexte kommen in `EHProse`.

### Form, Abstand und Bewegung

Eingaben und Schaltflächen: 6 px Radius. Funktionale Panels: 8 px. Fotografien und Aktenumschläge: die kanonische Hauskante. Touch-Ziele mindestens 44×44 px, reguläre Buttons 48 px hoch. Sichtbarer Fokus mit 3-px-Kontur und Abstand, keine Entfernung ohne gleichwertigen Ersatz.

Bewegung unterstützt einen Zustand oder einen Wechsel. Kurze endliche Übergänge; keine Typewriter-Platzhalter, Hintergrunddrifts oder erzwungenen Scroll-Animationen. `prefers-reduced-motion` zeigt den vollständigen Endzustand. Keine Animation darf den Inhalt für Tastatur- oder Screenreader-Nutzer verbergen.

## 4. Komponentenregister

| Familie | Kanonische Komponenten |
| --- | --- |
| Grundlagen | EHScope, EHLogo, EHContainer, EHSection, EHEyebrow, EHHeading, EHText, EHButton, EHTextLink, EHActions, EHImageFrame, EHRecordCover, EHStatus, EHDivider |
| Einstieg und Erzählung | EHPageHero, EHPromiseRow, EHSplitStory, EHMediaStory, EHClosing |
| Leistung und Erklärung | EHFeatureRows, EHSteps, EHTimeline, EHFacts, EHComparison, EHFAQ, EHCallout, EHServiceIndex, EHPricing |
| Lesen und Navigation | EHProse, EHArticleHeader, EHArticleLayout, EHContents, EHRelated |
| Arbeitsflächen | EHAppHeader, EHPanel, EHList, EHDataTable, EHDocumentList |
| Eingaben | EHField, EHInput, EHTextarea, EHSelect, EHCheckbox, EHComposer |
| Interaktion und Zustände | EHTabs, EHDialog, EHEmptyState, EHLoadingState, EHErrorState |

Die vollständigen TypeScript-Props sind die API-Referenz; sie stehen mit dem vollständigen Code in der Quellkapsel. Keine zusätzlichen `style`- oder `className`-Schlupflöcher an den neuen öffentlichen Komponenten. Bestehende Adapter behalten ihre bisherigen Schnittstellen, damit Unterseiten nicht brechen.

`EHField` verknüpft Label und Eingabe über dieselbe ID. Hinweise und Fehler werden mit `aria-describedby` verbunden; Fehlerzustand über `aria-invalid`. `EHTabs` unterstützt Links/Rechts, Home/End und deaktivierte Einträge. `EHDialog` nutzt den nativen modalen Dialog, Fokusbindung und Escape. Datenlisten behalten eindeutige IDs. Tabellen haben Caption und Spaltenköpfe; auf kleinen Bildschirmen ist ausschließlich der Tabellenbereich horizontal scrollbar.

## 5. Seiten individuell zusammensetzen

| Inhalt | Vollständige Vorlage | Schwerpunkt |
| --- | --- | --- |
| Startseite | EHHomePage | Starkes Wortbild, Fotografie, Versprechen, Hausakte, Ablauf |
| Leistungsdetail | EHServicePage | Bedarf, Leistungsumfang, Entscheidung, Fragen |
| Ratgeber / Fachartikel | EHArticlePage | Inhaltsverzeichnis, Lesespalte, Zwischenüberschriften, verwandte Themen |
| Leistungsübersicht | EHServiceIndexPage | Themenregister und konkrete nächste Wege |
| Kontakt | EHContactPage | Persönlicher Kontext, vollständiges Formular, tatsächliche Kontaktdaten |
| Preise / Umfang | EHPricingPage | Klarer Leistungsumfang, gültige Preise, Bedingungen |
| Owner-App | EHOwnerPage | Hausakte, Unterlagen, Menschen, Chronik, Anliegen |
| Handwerker-App | EHProviderPage | Anfragen, Bearbeitungsstatus, Termine |

Die Vorlagen nehmen Inhalte und echte Handler als Props entgegen. Datenzugriff, Authentifizierung, Routing, Speicherung und Beauftragung werden aus dem bestehenden Produkt angebunden. Die Browserbibliothek enthält gekennzeichnete Vorschauhandlungen und Beispieldaten; sie sind keine produktiven Endpunkte. Keine Vorschau-Antwort oder Beispieladresse wird in eine echte App übernommen.

Eine neue Seite beginnt mit der passenden vollständigen Vorlage. Fachlich begründete Umstellungen mit vorhandenen Blöcken sind erlaubt. Eine neue Seitenfarbe, Schrift oder lokale Komponentenfamilie ist es nicht.

## 6. Präsentationen

Kanonischer Verbraucher: `einfachhausen-de/einfachhausen-presentation-generator`.

- Die 13 Schema-Typen bleiben kompatibel: title, section, bullets, cards, comparison, steps, stats, quote, timeline, chart, image, split, closing.
- Die 25 vorhandenen Remotion-Geschichten behalten ihre Inhalte, Aufrufwege und fachlichen Einschränkungen.
- Beide Renderer lesen dieselben vendorten Tokens; Logo und Inter kommen aus den unveränderten Paketassets.
- Karten werden als lesbare Registereinträge gestaltet. Aktenpanels verwenden die Hauskante.
- Der historische API-Name `Phone` bleibt erhalten; sein Inhalt wird als lesbare Hausakte dargestellt.
- Keine zweite Palette, kein nachgebautes Wortzeichen, keine zusätzliche Schrift.
- Diagramme bilden tatsächlich übergebene Zahlen ab. Beispielzahlen sind keine Belege.
- Remotion bleibt im Generator. Die früher entfernten Website-Präsentationsbereiche werden durch diese Arbeit nicht wieder eingeführt.

## 7. Schutz vor unbeabsichtigter Änderung

`node scripts/eh-design-generate.mjs --check` verhindert Abweichungen generierter Tokens.
`node scripts/eh-design-check.mjs` prüft die versiegelten Kerndateien und neue Verstöße.
`node --test scripts/eh-design-check.test.mjs` beweist Positiv- und Negativfälle.
`node scripts/eh-design-browser.mjs` prüft die echte Bibliothek auf responsives Verhalten, WCAG-Meldungen, Lesbarkeit und Bedienung.

Vorhandene Altlasten stehen präzise pro Datei und Fundtyp in `design/design-debt.json`. Sie dürfen abnehmen, aber nicht durch eine neue Baseline versteckt werden. Neue CSS-Dateien und UI-Dateien ohne kanonischen Import scheitern im PR-Check. Ein Umbruch oder Verschieben von Zeilen schafft kein neues Kontingent für Verstöße.

Der GitHub-Check verwendet gewöhnliche, unprivilegierte PR-Jobs mit Leserechten. Er verwendet weder fremden Code mit Produktionsgeheimnissen noch einen Produktionsrunner. Der öffentliche Haupt-Repository kann GitHub-Actions-Prüfungen ohne bezahlten Bot verwenden. Bei privaten Organisations-Repositories hängt verpflichtender Branch-Schutz vom vorhandenen GitHub-Plan ab.

**Technische Grenze:** Prüfungen können definierte Abweichungen blockieren und Review erzwingen; sie beurteilen nicht automatisch jede gestalterische Qualität. Agenten mit denselben Administratorrechten wie der Eigentümer sind keine separat absperrbare Identität. Kein Dokument oder kostenloser CI-Check rechtfertigt das Versprechen, ein Administrator könne das System niemals umgehen. Ein Agent darf deshalb weder Schutzregeln lockern noch den Designkern neu versiegeln, um seinen eigenen fehlgeschlagenen Check grün zu machen.

## 8. Übergabe und Änderung

Pflichtreihenfolge: `AGENTS.md` → `DESIGN.md` → `NEXT_AGENT.md` → konkrete Aufgabe → `sin-eh-design` → passende vollständige Recipe-Datei → tatsächlicher betroffener Code.

Vor Änderungen an geteilten Funktionen: GitNexus-Auswirkung und echte Aufrufer prüfen. UNKNOWN bedeutet nicht unbenutzt. PageHero, LinkButton, MarketingShell und der Präsentationsrenderer haben große Auswirkung; Schnittstellen bleiben stabil.

Jede Übergabe enthält Repository, Branch, Basis-Commit, absolute Workspace-Pfade, vollständigen neuen/geänderten Quelltext, unveränderte Assets mit Hash, exakte Befehle, Prüfergebnisse, tatsächliche Restarbeit und nächste Aufgabe. Keine Ellipsen, „den Rest analog“, TODO-Komponenten oder erfundenen Freigaben.

Die aktuellen vollständigen Quellkapseln und Prüfsummen liegen unter `docs/brand/system/`. Die alte Atelier-Quellkapsel bleibt unverändert historisch erhalten. Neue Freigaben werden mit ihrer tatsächlichen Aussage in Aufgaben, Handoff und den verfügbaren Memory-Systemen fortgeschrieben.

## Native HTML / Worker

CRM verwendet denselben Vertrag ohne React-Umbau: packages/eh-design/src/html.mjs, html.css und html-style.mjs. Der Generator erzeugt diese aus den kanonischen CSS-Modulen und Original-Assets. html-style.mjs enthält Schrift und Logo eingebettet. Vollständige datenabhängige CRM-Komposition: docs/brand/system/CRM_RECIPE.mjs. Ausschließlich dokumentierte HTML-Slots dürfen bereits sicher gerendertes HTML enthalten; Daten werden escaped, URLs validiert. Keine zweite Palette oder lokale Komponenten-Kopie.

`````

## README.md

`````markdown
> **Aktueller Designvertrag · 2026-09-06:** Jerry hat Atelier 02 ausdrücklich freigegeben. Verbindlich sind DESIGN.md, packages/eh-design und der Skill SIN-EH-design. Eigenständige Änderungen am Markenstil sind verboten. Vollständige Übergabe: docs/brand/system/HANDOFF.md; kompletter Quelltext: docs/brand/system/SOURCE.md. Frühere Statusangaben zu noch offenen Stilentscheidungen sind historisch. Restmigration: EH-BRAND-05-WEB, -APPS, -CRM, -HUB. Unternehmensidentität bleibt docs/COMPANY_IDENTITY.md (Gina Inhaberin/Geschäftsführerin, Jeremy Entwickler).

# Einfach Hausen

<p align="left"><img src="public/brand/logo-full.png" alt="einfachhausen Logo" width="220" /></p>

> **Ein Ansprechpartner für alles rund ums Eigenheim.**
>
> **Du sagst, was dein Haus braucht. Wir kümmern uns um den Rest.**

Einfach Hausen ist die zentrale Anlaufstelle für Eigenheimbesitzer. Der Kunde beschreibt ein Problem und entscheidet selbst: **nur einen konkreten menschlichen Ansprechpartner sprechen** oder **einen echten Auftrag organisieren lassen**. Kontakte, Hausdaten, Termine und Dokumente bleiben dauerhaft beim Haus. Die KI arbeitet im Hintergrund als Assistenz- und Organisationsschicht, ist aber nicht das eigentliche Kundenversprechen.

Die verbindliche Produktdefinition steht in [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md). Die strategische Positionierung als **persönlicher Hausmanager / Betriebszentrale für das eigene Zuhause** steht in [`docs/PRODUCT_POSITIONING.md`](docs/PRODUCT_POSITIONING.md). Das langlebige Daten- und Berechtigungsmodell steht in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Unternehmensrollen (kanonisch)

- **Gina Schulze** ist Inhaberin und Geschäftsführerin von Einfach Hausen.
- **Jeremy Schulze** ist Developer / technische Entwicklung und nicht Inhaber oder Geschäftsführer.

Verbindliche Rollenquelle: [`docs/COMPANY_IDENTITY.md`](docs/COMPANY_IDENTITY.md).

## Agenten & kanonischer Arbeitsstand

Alle Agents arbeiten in diesem Repository **am selben Ziel**. Es gibt keinen zweiten Engineering-Taskplan in README, Issues oder Worker-Reports. Der verbindliche Einstieg ist [`docs/NEXT_AGENT.md`](docs/NEXT_AGENT.md); der transaktionale Taskstatus liegt in `.sin-gpt-web/taskplan.sqlite3` und wird nach `.sin-gpt-web/TASKPLAN.md` gerendert.

Aktueller Endpfad: **T-0131 Convergence abgeschlossen (2026-09-03, `3fbe3c9`) → main-HEAD `13496d7 feat(seo): GSC FILE verification token`**. Live verifiziert: UI-Wellen A-E, Supabase-App-Schema + RLS, öffentliche Demo-Logins, GSC-Verifikation sowie Blog/Lexikon-Cluster. Bereits erledigte oder abgelöste Wellen werden nicht erneut begonnen. Neue Implementierungsarbeit entsteht nur aus einem reproduzierbaren Acceptance-Fehler und wird als kanonischer Remediation-Task erfasst.

### Public Website Finish — Stand 2026-09-05

Die öffentliche Website ist zusätzlich auf den freigegebenen Premium-Zielzustand konvergiert, **ohne Rebranding** und weiterhin innerhalb von `DESIGN.md` / `--eh-*`:

- bestehende Top-Level-Navigation beibehalten, aber `Leistungen` als Desktop-Megamenü + Mobile-Disclosure vertieft;
- 12 Leistungsbereiche aus einem zentralen Service-Katalog mit echten Detailrouten;
- öffentliche Erklärseiten `/beratung`, `/notfall`, `/versicherung`, `/immobilienverkauf`;
- stärkere Discovery auf Startseite, Leistungen, Hilfe, Hausakte, Eigenheimbesitzer, Ablauf und Partnerseite;
- Sitemap/Metadata/Structured-Data aus derselben Content-Quelle;
- Release-Gates: Public-Site-Vertrag, echter Chrome-Navigationstest, vollständiges Produkt-E2E und 72 Visual Canonicals (390 / Tablet / 1320).

Implementierungs- und Designentscheidungen: `docs/superpowers/specs/2026-09-05-public-website-finish-design.md` und `docs/superpowers/plans/2026-09-05-public-website-finish.md`.

## Systemübersicht

![Einfach Hausen Plattformarchitektur](docs/diagrams/platform-architecture.svg)

[Interaktive Architektur öffnen](docs/diagrams/platform-architecture.html) · Detailansichten: [Eigentümer-Serviceflow](docs/diagrams/homeowner-service-flow.html), [Partner-/Auftrags-Lifecycle](docs/diagrams/partner-job-lifecycle.html), [Hausakte & Datenschutz](docs/diagrams/property-privacy-dataflow.html), [Zahlungen](docs/diagrams/payment-lifecycle.html), [CRM & Outreach](docs/diagrams/crm-outreach-flow.html), [Production & Recovery](docs/diagrams/production-recovery-flow.html).


## Live Produktion (HA)

- App: `https://einfachhausen.de`
- Runtime: OCI `sin-supabase`
- Cloudflare: `sin-kestra` tunnel
- Process supervisor: systemd (`einfach-hausen.service`)
- **App-Datenbank: SQLite** (`better-sqlite3`, `DATABASE_PATH`) — bewährter Single-Node-Betrieb mit Backup-Pflicht
- **Auth: SIN Supabase OSS (self-hosted, `https://supabase.delqhi.com`)** — serverseitig autoritative Identität (`auth_subject`); Supabase ist **nicht** die App-Datenbank
- **Primärer Storage: Supabase Storage** für `private/` und `uploads/` (Fotos, Dokumente, Rechnungen, Haus-Historie) — `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_STORAGE_BUCKET`
- **Fallback/Local Dev: SQLite + WAL via `better-sqlite3`** (`DATABASE_PATH=./data/einfach-hausen.db`) nur für lokale Entwicklung und als Offline-Fallback, nicht mehr als Produktions-Primary
- **Mobile HA: Capacitor 6** — Next.js App wird als native iOS/Android Hülle ausgeliefert (siehe `Mobile App / Capacitor`)
- Scheduled health checks: Kestra

Produktion ist ein **Multi-User-Betrieb** auf Single-Node-Basis: App-Daten in SQLite (persistenter Pfad + Backup), Auth gegen den self-hosted SIN-Supabase-Stack (Autorität serverseitig verifiziert). Ein Supabase-Storage-Adapter ist **nicht implementiert**; `private/`/`uploads/` laufen über persistente lokale Verzeichnisse. Historische HA-/Postgres-Migrationsplanung (T-0166) wurde nie ausgeführt und ist nicht Teil des aktuellen Taskplans. Siehe `docs/OPERATIONS.md` und `docs/ARCHITECTURE.md`.

## Kernablauf

1. Kunde schreibt, spricht oder lädt ein Foto hoch.
2. Der KI-Hausmeister beantwortet und ordnet das Thema ein; **noch entsteht weder Vermittlung noch Auftrag**.
3. Der Kunde entscheidet: **Ansprechpartner finden** oder **Auftrag organisieren**.
4. Beim Ansprechpartner-Weg wird ein passender geprüfter Betrieb angefragt. Ein konkreter Mensch kann übernehmen, ohne Angebot und ohne Buchung.
5. Beim Auftrags-Weg fragt die KI nur fehlende Auftragsdaten ab, ermittelt eine Preisorientierung und disponiert passende Partner.
6. Angebote werden nach Preis, Termin, Entfernung und Qualität verglichen.
7. Der Kunde bucht bewusst.
8. Ein konkreter Ansprechpartner des Partnerbetriebs wird spätestens jetzt zugewiesen.
9. Kunde und Ansprechpartner können direkt schreiben, anrufen und Termine abstimmen.
10. Der KI-Hausmeister bleibt parallel für Fragen, Hausakte, Organisation, Erinnerungen und Servicefälle verfügbar.
11. Ein bereits verbundener Ansprechpartner bleibt in der Hausakte und kann später ohne neue Suche kontaktiert werden.
12. Aus einer reinen Kontaktanfrage kann der Kunde später separat einen Auftrag machen.

## Visuelles Produktdesign

Die verbindliche UI-Richtung steht in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). Die Kunden-App ist mobile-first und folgt der Referenz: Startseite, Hausservice, Angebotsvergleich, Auftragsdetail, Mein Haus, Mein Jahr, Pakete, Aufträge, Partnerprofil und Einstellungen.

Für T-0165 gilt zusätzlich die Präsentations-Source-of-Truth-Kette: **Notion App Design → `DESIGN.md` → [`docs/PRESENTATION_BRAND.md`](docs/PRESENTATION_BRAND.md) → `presentation/premium/brand.config.json` → `presentation/premium/deck.html`**. Notion liefert visuelle Evidence, nicht automatisch fachliche Produktspezifikation. Änderungen am App-Design müssen deshalb immer auch auf Presentation Brand und Deck geprüft werden.

## Kunden-App

- Startseite mit Schnellaktionen, Terminen, Angeboten und Hausstatus
- fokussierter Hausservice unter `/app/hausmeister`
- Freitext, Foto und Spracheingabe
- echte Hausfragen zuerst beantworten, ohne automatisch einen Auftrag anzulegen
- klare Auswahl **Ansprechpartner finden** oder **Auftrag organisieren**
- mehrstufige Rückfragen nur bei fehlenden Daten des gewählten Wegs
- optionaler OpenAI-kompatibler KI-Gateway, mit deterministischem Fallback
- Richtpreise
- regionales Qualitätsmatching
- Angebotsvergleich: Empfehlung / günstigster Preis / schnellster Termin
- Ein-Klick-Buchung
- persönlicher Ansprechpartner auch ohne Buchungszwang
- Kontaktanfrage ohne Angebot/Preis und spätere Umwandlung in einen Auftrag
- direkter Chat / Telefon / Terminabstimmung
- „Meine Ansprechpartner“ für dauerhafte Kundenbeziehungen
- digitale Hausakte „Mein Haus“
- „Mein Jahr“ als Jahres-, Wartungs- und Aufgabenplan
- geprüfte Partnerprofile direkt aus dem Angebotsvergleich
- Anlagenregister für Heizung, Wärmepumpe, PV, Speicher, Wallbox, Dach, Garten und Smart Home
- wiederkehrender Wartungs- und Hausjahresplan
- private Rechnungen, Nachweise und Belege
- direkte Handwerker-Rechnungen in der App mit Positionen, MwSt., Zahlungsziel und optionaler Stripe-Zahlung
- großer Notfall-Einstieg mit Bereitschafts-/Entfernungs-/Qualitätsmatching
- eigener Beratungsweg ohne automatischen Auftrag
- Ansprechpartner nach Bereichen gruppiert, inklusive eigener Kategorien
- lebenslange Haus-Historie mit früheren Arbeiten, Kosten, Garantien, Fotos und Dokumenten
- digitaler Hauspass und übertragbare Immobilie mit Eigentümerhistorie
- Immobilienbewertung, Verkaufsinteresse und datenschutzgesteuertes Makler-Matching
- Bewertungen
- Service-/Problemfälle
- Benachrichtigungen
- WhatsApp Cloud API mit demselben Modell: KI zuerst, danach `ANSPRECHPARTNER` oder `AUFTRAG`
- PWA-Manifest

## Mobile App / Capacitor (iOS + Android) + PWA

Die Next.js-Anwendung ist die **Produktions-App für Web + iOS + Android**. Auslieferung erfolgt als:

- **Web:** Next.js direkt auf `https://einfachhausen.de` (PWA bleibt für Browser/Installierbarkeit)
- **iOS / Android:** **Capacitor 6** native Hülle (`@capacitor/core`, `@capacitor/ios`, `@capacitor/android`) um dieselbe Next.js-Build — keine zweite Codebase, kein Flutter/React-Native Rewrite

Enthalten (Web + nativ identisch):

- `manifest.webmanifest` mit App-Icons und Shortcuts
- Apple-Touch-Icon und `appleWebApp`-Metadaten
- Service Worker für Installierbarkeit und sichere Offline-Hinweise
- **keine privaten Auftrags-, Nachrichten- oder Hausdaten im Service-Worker-Cache**
- Safe-Area-Unterstützung für iPhone-Notch/Home-Indikator
- mobile Bottom-Navigation: Home, Aufträge, Termine, Ansprechpartner, Mehr
- 44px+-Touch-Ziele und 16px-Formfelder gegen iOS-Auto-Zoom
- `capacitor.config.ts` mit AppId `de.einfachhausen.app`, native Push (`@capacitor/push-notifications`), Camera/Filesystem via Supabase Storage
- App-Store Verteilung: App Store + Play Store sind **ab sofort aktiver Produktionspfad** (kein externer Blocker mehr), siehe `docs/ARCHITECTURE.md`

## Kunden-Tarife

| Tarif | Preis | Kernnutzen |
|---|---:|---|
| FREE | 0 €/Monat | Hausmeisterservice, Aufträge, Angebote, Ansprechpartner, Hausakte |
| PLUS | 19,90 €/Monat | Wartungsplanung, Hausjahresplan, Erinnerungen, Dokumente, Prioritätsservice |
| PREMIUM | 39,90 €/Monat | höchste Servicepriorität, jährlicher Hauscheck, automatische Wartungsorganisation, erweiterte Betreuung |

Jahrespakete sind zusätzlich möglich und erzeugen konkrete Aufgaben im Hausjahresplan.

## CRM & Leadgewinnung

Das dedizierte Akquise-/Outreach-Control-Plane liegt im separaten Repository `einfach-hausen-crm` und wird standalone unter `https://crm.einfachhausen.de` betrieben. Cloudflare Worker + D1 übernehmen dort Dedupe, Queue/Claims, Contact-History, Inbox/Replies und Follow-ups. Generic Research/Outreach bleibt in den gemeinsamen SIN-Fähigkeiten; es wird nicht in diesem Repo dupliziert.

Die Hauptanwendung enthält weiterhin `/admin/crm` und das SQLite-Leadmodell als ursprüngliche plattformintegrierte Operator-/Konvertierungsoberfläche und als Quellbestand für die erste verifizierte D1-Migration. Beide dürfen **nicht als zwei konkurrierende CRMs** weiterentwickelt werden. Recherchierte Betriebe bleiben zunächst Leads und werden **nicht** künstlich als registrierte Partner angelegt.

- Projektneutrale Handwerker-/Hausmeister-Recherche über `SIN-Business-Research`
- Deutschlandweiter Overture-Import mit E-Mail, Telefon, Website, Social-Links
  und Quellen-Provenienz soweit öffentlich vorhanden
- Pipeline von `Gesammelt` bis `Konvertiert`, plus `Nicht kontaktieren`
- Kontaktfreigabe/Einwilligung getrennt vom Vertriebsstatus
- Filter nach Leadtyp, Status, Gewerk, Firma, Ort und PLZ
- öffentliche Bedarfssignale (`public_intent`) aus kostenlosen RSS-/Forum-Quellen
  getrennt von identifizierten Eigentümer-Leads
- nicht-personenbezogene Objektchancen (`property`) aus offenen Geodaten
- manuelle Eigentümer-Leads aus Website, Empfehlung, Facebook-Gruppen, Foren,
  Communities und Kampagnen
- ein idempotenter Research-Sync importiert Betriebe, Intent-Signale und Objektchancen
- keine automatische Social-Profil-Ernte, Deanonymisierung oder Massen-DMs

Betrieb und Datenmodell: [`docs/CRM.md`](docs/CRM.md).

## Partner-App

Ein Unternehmen wird erst nach Unternehmensprüfung und aktivem Partnervertrag disponiert. Professionelle Anbieter verwenden **ein gemeinsames Konto**. Darin können mehrere Tätigkeiten gleichzeitig aktiviert werden, z. B. Handwerk, Dienstleistung, Immobilienmakler, Gutachter, Energieberatung oder Hausverwaltung. Tätigkeiten und konkrete Leistungsprofile sind getrennte Daten und später erweiterbar.

Makler können zusätzlich ein Suchprofil für Regionen, Immobilientypen, Preis- und Flächenbereiche pflegen. Freigegebene Immobilien-Leads erscheinen im selben Partnerzugang unter `/pro/leads`; Eigentümerkontaktdaten werden erst nach ausdrücklicher Freigabe sichtbar.

### Ansprechpartnermodell

Eine Firma hat 1–X Ansprechpartner mit eigenem Login. Es gibt bewusst nur eine fachliche Berechtigung:

**Aufträge verwalten AN/AUS**

AN bedeutet: neue Anfragen sehen, Angebot senden, annehmen/ablehnen und gebuchte Aufträge zuweisen.  
AUS bedeutet: nur eigene zugewiesene Aufträge sehen, Kundenkontakt, Termin, Status, Dokumente und Abschluss.

Keine ERP-Rollenmatrix.

## Partner-Tarife

| Tarif | Preis | Provision |
|---|---:|---:|
| FREE | 0 €/Monat | 0 % |
| START | 29 €/Monat | 0 % |
| PRO | 79 €/Monat | 0 % |
| PREMIUM | 199 €/Monat | 0 % |

START/PRO/PREMIUM haben 60 Tage Testphase. Der Partner-Tarif beeinflusst **nicht** das Qualitätsmatching.

## Matching

Berücksichtigt werden unter anderem:

- Gewerk / Fachgebiet
- Qualifikation und Vertragsstatus
- Entfernung
- Verfügbarkeit
- aktuelle Kapazität
- Bewertungen
- Preis / tatsächliches Angebot
- bestehende Kundenbeziehung
- bereits bekannter Ansprechpartner

## Zahlungen

- Stripe Checkout für Kunden-Mitgliedschaften
- Stripe Checkout für Partner-Tarife
- Stripe Checkout für Jahrespakete
- Stripe Connect für Auftragszahlungen
- **0 % Plattformprovision pro Auftrag**
- signierter Stripe-Webhook

Der konkrete rechtliche, steuerliche und haftungsrechtliche Aufbau muss vor kommerziellem Livebetrieb fachlich geprüft werden.

## KI-Gateway

Optional laufen sowohl die freie Hausfrage als auch die Anfrageextraktion über einen OpenAI-kompatiblen Gateway. Auf der OCI-Installation wird dafür OmniRoute lokal genutzt. Ohne Gateway bleibt die strukturierte Auftrags-/Kontaktlogik deterministisch funktionsfähig; die freie Hausfrage fällt auf eine kurze sichere Orientierung zurück.

```env
AI_BASE_URL=http://127.0.0.1:20128/v1
AI_MODEL=auto/best-fast
AI_API_KEY=
# Alternativ wird OMNIROUTE_MASTER_KEY gelesen.
```

Ohne Gateway bleibt die Kernfunktion über einen deterministischen Parser funktionsfähig.

## Stack (Produktion HA)

- Next.js 16 / React 19 / TypeScript
- **Supabase (Auth, self-hosted OSS)** — `AUTH_MODE=supabase`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`; App-Daten via `DATABASE_PATH` (SQLite)
- **SQLite + WAL via `better-sqlite3` nur Fallback/Local Dev** (`DATABASE_PATH`)
- **Capacitor 6** für iOS + Android (native Hülle um Next.js)
- HttpOnly Sessions + bcrypt
- Stripe / Stripe Connect
- OpenAI-kompatibler KI-Gateway
- serverseitige Actions
- PLZ-Geocoding + Distanzmatching
- Playwright E2E

## Lokal starten

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Authentifizierung: Produktionsgrenze

Die Zielarchitektur für die geschützten Owner-/Provider-Flächen ist **Supabase serverautoritativ**. Lokale SQLite-/`mh_session`-Authentifizierung ist ausschließlich als expliziter Development-Fallback zulässig und darf in Produktion nicht stillschweigend greifen. Details, Testmatrix und T-0168-Visual-Acceptance: [`docs/T0168_DEEP_RESEARCH.md`](docs/T0168_DEEP_RESEARCH.md).

## Qualitätschecks

```bash
npm run lint
npm run build
E2E_ADMIN_PASSWORD='<lokales-testpasswort>' npm run test:e2e
E2E_ADMIN_PASSWORD='<lokales-testpasswort>' npm run test:e2e:architecture
npm run test:crm
```

## Aktueller technischer Vervollständigungsplan

Der kanonische `.sin-gpt-web/taskplan.sqlite3` enthält die aktuelle OCI-Convergence-Kette (T-0170 Auth, T-0169/T-0005 Notion-Visual, T-0171 Final Convergence). Historische Roadmap-Prosa (T-0100..T-0131, T-0166/T-0167) beschreibt frühere Planungsstände, nie ausgeführte Migrations-Tasks sind aus dem Plan gefallen. Der README ist nur ein Wegweiser; Status, Akzeptanz und Abhängigkeiten bleiben ausschließlich im kanonischen Taskplan (`sin-gpt-web-state --repo . summary`).

Nächster kanonischer Task: siehe `sin-gpt-web-state --repo . next`. Externe Blocker: siehe `docs/EXTERNAL-BLOCKERS.md` (nur verifizierte Fakten).

## Produktion (HA)

Die Produktion läuft auf OCI `sin-supabase` hinter Cloudflare Tunnel (Loopback-only, TLS nur via Cloudflare).

- **Supabase Postgres** als primärer DB-Cluster (HA) + **Supabase Storage** für private Dateien — Secrets in Infisical (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `SUPABASE_STORAGE_BUCKET`)
- **Lokaler Fallback** SQLite `/var/lib/einfach-hausen/einfach-hausen.db` nur für Dev/Notfall, nicht mehr Primary
- systemd-Dienst mit automatischem Restart
- Cloudflare Tunnel
- Admin-Passwort außerhalb von Git
- KI-Gateway-Key außerhalb von Git
- Stripe-/WhatsApp-Secrets außerhalb von Git
- Stripe-Betrieb über `wow-my-zsh/shared/skills/sin-stripe`; Secrets in Infisical, injiziert in OCI-Runtime
- **Capacitor iOS/Android Builds** aus selbem Next.js Artefakt (`npx cap sync` + `npx cap open ios/android`)

## Repository

GitHub: `Delqhi/einfach-hausen`

## Repository intelligence

This repository uses the fleet-wide Graphify architecture graph from `wow-my-zsh`. The graph is derived locally and kept out of Git.

```bash
npm run graph:install
npm run graph:update
npm run graph:check
graphify query "where is partner assignment handled?"
```

The local Graphify post-commit and post-checkout hooks keep `graphify-out/graph.json` current for agent architecture queries. Product truth remains `docs/PRODUCT_VISION.md`; Graphify is a technical code/dependency graph, not product or customer data storage.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0171`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen und vor allem App und Website auf Produktionsqualität verbessern
- Resume rule: read/validate the canonical taskplan and continue its highest-priority eligible task; do not create a competing roadmap.
- State 2026-08-29: DONE T-0170/T-0004/T-0169/T-0005/T-0171 (main=2307493, production bdebe9f, Smoke 17/17); open: T-0006 e2e modernization
- Taskplan sync: `pass`
- Synchronized at: `2026-08-29T18:59:08+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-31T20:53:01+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-31T20:53:03+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-31T20:52:53+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-31T20:52:54+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-22T16:24:18+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-22T17:06:16+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0200
updated: 2026-08-30T04:10:43+00:00
actor: local-agent
evidence-sha256: 425e861d61478080b23cc52ad6b64973eb901e909bbe35dd7fb24a555e299358
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0201
updated: 2026-08-30T04:29:48+00:00
actor: local-agent
evidence-sha256: c5758386de9a32943594941ee15b2faf7dd48bcd822565e0419448383e33c180
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0202
updated: 2026-08-30T04:39:54+00:00
actor: local-agent
evidence-sha256: 0bc75649da580b92e8c385c0ce01f150f9b48f18b1ac0d2c9ee40525373e504f
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0203
updated: 2026-08-30T04:59:52+00:00
actor: local-agent
evidence-sha256: b734c3298856af57db7cbd01c11010da44ffcc25472c8142ae1011378a1a4699
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0204
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: 26d2c37b44b0e2ecdd412fa38e9987742b09de7fdb3d65324b840eee1997f5d8
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0205
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: f1288185ef3bec19c87d3ccaf8e935f8a33480e8db7f734bae58d6874f3a4d43
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0042
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: b0522c720f2d26ef171afa4f8b0bd77eb82cd987694ae7791144c8df2c9124fd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0043
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: 7690208a2287a2d7d24bc2b266c299ac0cdbdaac3e76839323fb142c4ea23138
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0049
updated: 2026-08-31T20:52:49+00:00
actor: local-agent
evidence-sha256: 0d6781d978ed15bc779a17b686785e5efe3810adb2563c2731c51acc8f2f82c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0157
updated: 2026-08-31T21:16:05+00:00
actor: local-agent
evidence-sha256: 7f99e3ef8bfd11d211e6dbda80fa766914a185971e4f6883515209aba957fb5f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0160
updated: 2026-08-31T22:25:51+00:00
actor: local-agent
evidence-sha256: a0374312071e4a6d50a86e2706a720cb563cff292dd03c20102c6c0ac8b63098
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0161
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: 8347892ea96120456d7b66b9aba1440561a66d689fce427bda41928e3e8003b4
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0162
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: ff5ccd0484ed2266c6ce264e4b9f21b41f1bd97f7e8c73ff4c98e9216edf19cd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0163
updated: 2026-08-31T22:56:47+00:00
actor: local-agent
evidence-sha256: fb1882e2df32385413315728fdb2731a84376c39873250aa2cf0335a2c913c98
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0154
updated: 2026-09-01T00:56:58+00:00
actor: local-agent
evidence-sha256: 83e5ed487aff86dee8b825d9f06d859654d292349ec6538442ac1f725c3dbe1b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0152
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 75fc109f1509113951e589eae987093b5e6ae117d9fd29e758a6c673897685d3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0153
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 08da5c23cd9a4bb84512af6dc432989154d9da35f011f18bf9ef15fb7a650193
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0155
updated: 2026-09-01T01:47:14+00:00
actor: local-agent
evidence-sha256: 02c7cb988ff4f3990fdd17d9a4772d50152245ab2becbbd66f768202ec391bc8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0156
updated: 2026-09-01T03:30:24+00:00
actor: local-agent
evidence-sha256: 994ea2169cfa09d65fa7fa4e2b29c4f8e02de905c613b7d24ebd946ec7c7d4b0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0115
updated: 2026-09-01T03:30:25+00:00
actor: local-agent
evidence-sha256: ef7edcae3cf6bd3ad470c34205fa815916c109e4709b0298ac4f0a4068e48968
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0111
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: 87e072d5e2c574dbf26ce3c530c85fb1d6a5a871034892d6adf8dc40ec8a3ae9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0112
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: f193fa11049f920c888558209118f7b7592a95a4e86ace0c92274995b906db8d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0138
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: 0ab111892a30d55ad46e7f6232b32f64656dee72cc4b9937613c3f2a3d9c925a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0142
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: bceab63e963dd389c859027e3e4221a6a50386a99dfad656912ed9445f0038fe
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0113
updated: 2026-09-01T13:55:36+00:00
actor: local-agent
evidence-sha256: 07b6275707f950b590ed96ec928ab841e01791e4761d591f616d20f0fc5e80cc
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0114
updated: 2026-09-01T13:57:24+00:00
actor: local-agent
evidence-sha256: db6e60f478405d43372683fbf7d760ddb32ef5fb7c5c608ca152e3115cca052b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0116
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: cfbef8fb88b67a309e81fa923357ecfc6f2a6808005e9d697e457401171f9ce5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0117
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: 32b178026b6612aa0bc5ea8813b094a8e7b84293e8c9f8a5706a02435767ed03
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0136
updated: 2026-09-01T18:06:52+00:00
actor: local-agent
evidence-sha256: 766040d87c6e2dbae195442af395ea3b2fddc2c114f4fbe4a7963f3a4d6463ea
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0147
updated: 2026-09-01T19:19:57+00:00
actor: local-agent
evidence-sha256: 4149908d9dda7f1397ce06f9aadccce2ae5c038d469a1adeb8e1e3f02d0a2ff9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0118
updated: 2026-09-01T20:51:22+00:00
actor: local-agent
evidence-sha256: c55fee22cf93a7578d26053014ef8e42b4a7534775e5e1a5d1fd60053eb1d405
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0119
updated: 2026-09-01T22:14:14+00:00
actor: local-agent
evidence-sha256: 0acd76be267c23dd81333e674d9c0eee29d42c3f07154718697fae9f793a26b6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0210
updated: 2026-09-02T23:18:15+00:00
actor: local-agent
evidence-sha256: 80f9aad504a029dbe80faed7a0cf4c152de5bf88a4b1880edf60f754211dea51
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0211
updated: 2026-09-02T23:18:41+00:00
actor: local-agent
evidence-sha256: 60f232b4e4d8bb71c603011e8a96ba47b0b2b4f04b45106ed5ab759dbc9d69a0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0120
updated: 2026-09-02T23:49:07+00:00
actor: local-agent
evidence-sha256: 73903ba5ee89d8c893c1f1fd2a10d42aeeba247966ba2045494555aa353d28e5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0121
updated: 2026-09-02T23:56:26+00:00
actor: local-agent
evidence-sha256: 01f5f6cb64432cac1825787493c591f7d4d2c263eff4860738564f29f1259336
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0122
updated: 2026-09-03T00:15:44+00:00
actor: local-agent
evidence-sha256: dca081a3188c1676492cf6cfd60f6b5d044444af48a818ae6173c43636c209fb
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0131
updated: 2026-09-03T12:19:04+00:00
actor: local-agent
evidence-sha256: 95b14cf53c5f2030d04c08f2b5dd9dfbb343623139fc5ce9e720d09533c6be38
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0123
updated: 2026-09-03T00:23:19+00:00
actor: local-agent
evidence-sha256: d05fdcb413b5af3832a99bb11e2726eab2c7c3682e25b7c74203edb5e4bd3544
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0124
updated: 
actor: local-agent
evidence-sha256: 7b56927949e37e438aa734d75f4b3eed9bd85a667118aa51838decfaccecfcb7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0129
updated: 
actor: local-agent
evidence-sha256: a2028224c451c9d493976891e8e4061d8fbe7cbe6e5155f21be5f251a13b16be
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0130
updated: 
actor: local-agent
evidence-sha256: db4bfd0327fb8cd3dcc011d26631b8b064c1a6b0952880d4fbb8d34877b61b84
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0125
updated: 
actor: local-agent
evidence-sha256: 24ead3c1a5c517e9724996338b7426ad3e8e2c18cd519e08d1f683f72f4d788b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0126
updated: 
actor: local-agent
evidence-sha256: 1acbbc8c9d9ec3b87035c8d0521fa2c3622fa697e6d719310f61795b15fda6e8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0127
updated: 
actor: local-agent
evidence-sha256: 0640af1175d4cd871685513652419379eec835cf543aed5dfc69b0bfcadc4a29
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0128
updated: 
actor: local-agent
evidence-sha256: 52a6748748dfe2d958322ba6584bcd9e8cd8284ed731054bf7f3d48948bf4d4a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-01
updated: 2026-09-05T02:00:41+00:00
actor: chatgpt-web
evidence-sha256: 223ddabf850fcb56047dafd0834c4648fe0356286d14630d790002d451660459
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-02
updated: 2026-09-05T02:19:47+00:00
actor: chatgpt-web
evidence-sha256: d3169b9afa465be4ab22588b73903be33178b28010810633f5fb6546dc51f563
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-03
updated: 2026-09-05T04:33:10+00:00
actor: local-agent
evidence-sha256: b9300da9b1e348fc386da08fda11e75c105f6db589d60a0f190ae0af25041437
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-04
updated: 2026-09-05T06:26:03+00:00
actor: chatgpt-web
evidence-sha256: 0bf6db00102a87441e641b95f92d629df17ac5aa3144da80eeb67f83cab48460
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-05
updated: 2026-09-05T09:09:00+00:00
actor: chatgpt-web
evidence-sha256: e072648f313eb7d38b0daa3a917b5f8b9cfbee90f62754f8cef486aa6b258c03
-->

## EH-BRAND — Operator-Auftrag vom 06.09.2026

Die eigenständige einfachhausen-Markenstudie wird auf einem isolierten Branch entwickelt. Sie umfasst drei vergleichbare Richtungen, vollständige Quellpakete und visuelle Evidenz. Sie ist keine bereits ausgewählte oder produktiv veröffentlichte neue Marke.

- Spezifikation: `docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md`
- Ausführungsplan: `docs/superpowers/plans/2026-09-06-einfachhausen-brand-system.md`
- Handoff: `docs/brand/HANDOFF.md`
- Vollständiger Zielquelltext: `docs/brand/SOURCE_PACKET.md`
- Tasks: EH-BRAND-01 bis EH-BRAND-06; vorhandenes T-0151 und Issue #33 berücksichtigen.
- Ausführung: `/home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906`, Branch `design/einfachhausen-brand-system-20260906`, Node 22.23.0.


## EH-BRAND — Korrektur: Atelier 02 (2026-09-06)

Der Nutzer hat die drei Stilproben aus PR #40 ausdrücklich verworfen. Deren technische 27/27-Prüfung ist keine visuelle Freigabe. Root Codex gestaltet und implementiert die neue Richtung persönlich; keinen weiteren Prime/bai-Dispatch aus alten Abschnitten ableiten. Neuer Arbeitsstand: `design/einfachhausen-brand-atelier-20260906`, Workspace `/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906`. Konzept, vollständige Nutzerkorrektur und Plan: `docs/brand/ATELIER_02.md`; aktuelle Übergabe: `docs/brand/HANDOFF.md`; vollständige Quellen: `docs/brand/ATELIER_02_SOURCE.md`; bedienbare Vollansicht: `design/brand-atelier/preview.html`. EH-BRAND-03 bleibt in Arbeit, die neue Richtung wurde noch nicht vom Nutzer bewertet. Genau nächste Markenaktion: diese neue Vollansicht besprechen und tatsächliches Nutzerfeedback dokumentieren. EH-BRAND-04..06 folgen erst der Richtungsentscheidung; kein Merge/Deploy. Ältere Empfehlungen/Dispatch-Anweisungen sind für diese Markenwelle historisch. Andere laufende Arbeitswellen bleiben erhalten.

`````

## design/design-debt.json

`````json
{
  "src/app/admin/admin.module.css": {
    "literal-color\u0000#10222a": 5,
    "literal-color\u0000#4b5b60": 3,
    "literal-color\u0000#e4e2dc": 3,
    "literal-color\u0000#ffffff": 3,
    "literal-color\u0000rgba(16, 34, 42, 0.04)": 3,
    "literal-color\u0000rgba(16, 34, 42, 0.07)": 1,
    "literal-color\u0000#5f6e75": 6,
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#edf0ed": 2,
    "literal-color\u0000#eef5f5": 1,
    "small-type\u0000font-size: 11px": 2,
    "small-type\u0000font-size: 12px": 4
  },
  "src/app/admin/crm/page.tsx": {
    "literal-color\u0000#faf8f4": 4,
    "literal-color\u0000#10222a": 16,
    "literal-color\u0000#e4e2dc": 38,
    "literal-color\u0000#105258": 15,
    "literal-color\u0000#0b3a3f": 1,
    "literal-color\u0000#4b5b60": 12,
    "literal-color\u0000#0d474d": 3,
    "literal-color\u0000#5f6e75": 9,
    "literal-color\u0000#eef5f5": 4,
    "literal-color\u0000#dcebec": 1,
    "literal-color\u0000#f3f6f5": 2,
    "literal-color\u0000#edf0ed": 2,
    "literal-color\u0000#eef1ff": 1,
    "literal-color\u0000#45569d": 1,
    "literal-color\u0000#f4ebdd": 1,
    "literal-color\u0000#a84d29": 1,
    "small-type\u0000text-xs": 34,
    "small-type\u0000text-[11px]": 12,
    "small-type\u0000text-[10px]": 2,
    "decorative-effect\u0000rounded-full": 2,
    "visual-utility\u0000border-red-200": 1,
    "visual-utility\u0000bg-red-50": 1,
    "visual-utility\u0000text-red-800": 1,
    "visual-utility\u0000border-emerald-200": 1,
    "visual-utility\u0000bg-emerald-50": 1,
    "visual-utility\u0000text-emerald-800": 1
  },
  "src/app/app/home/sale/sale.module.css": {
    "literal-color\u0000#105258": 7,
    "literal-color\u0000#66706a": 4,
    "literal-color\u0000#e4e8e5": 5,
    "literal-color\u0000#fff": 1,
    "literal-color\u0000#171a18": 1,
    "literal-color\u0000#f2f4f2": 1,
    "literal-color\u0000#eaf5ee": 1,
    "literal-color\u0000#f4faf6": 1,
    "literal-color\u0000#3e4942": 2,
    "literal-color\u0000#7a4a16": 1,
    "small-type\u0000font-size: 12px": 7,
    "small-type\u0000font-size: 10px": 1
  },
  "src/app/app/homeowner.module.css": {
    "literal-color\u0000#fff": 13,
    "literal-color\u0000rgba(255, 255, 255, 0.96)": 1,
    "literal-color\u0000#59635d": 1,
    "literal-color\u0000rgba(247, 248, 247, 0.9)": 1,
    "literal-color\u0000rgba(23, 107, 69, 0.12)": 1,
    "literal-color\u0000#e9ece9": 1,
    "literal-color\u0000rgba(255,255,255,.7)": 1,
    "literal-color\u0000rgba(20, 48, 31, 0.045)": 2,
    "literal-color\u0000#fbfcfb": 1,
    "literal-color\u0000#4f5953": 1,
    "literal-color\u0000rgba(234, 245, 238, 0.55)": 1,
    "literal-color\u0000#9ba39e": 1,
    "literal-color\u0000#768079": 1,
    "literal-color\u0000#dcebe2": 1,
    "literal-color\u0000#d7eadf": 1,
    "literal-color\u0000#7d8780": 1,
    "literal-color\u0000#5f6963": 1,
    "literal-color\u0000#5e6862": 1,
    "literal-color\u0000#dcebec": 2,
    "literal-color\u0000#fafbfa": 2,
    "literal-color\u0000#dce9df": 1,
    "literal-color\u0000#f8fbf9": 1,
    "literal-color\u0000#edf6f0": 1,
    "literal-color\u0000#a33b2b": 1,
    "literal-color\u0000#9b3d2f": 1,
    "literal-color\u0000#9fcfd2": 1,
    "literal-color\u0000rgba(247, 248, 247, 0.96)": 2,
    "literal-color\u0000rgba(255, 255, 255, 0.97)": 2,
    "literal-color\u0000#707a73": 2,
    "literal-color\u0000rgba(18, 60, 42, 0.06)": 1,
    "literal-color\u0000rgba(18, 60, 42, 0.04)": 1,
    "literal-color\u0000rgba(18, 60, 42, 0.08)": 1,
    "literal-color\u0000rgba(18, 60, 42, 0.05)": 1,
    "literal-color\u0000rgba(214, 235, 225, 0.5)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.08)": 4,
    "literal-color\u0000rgba(14, 61, 51, 0.16)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.11)": 1,
    "literal-color\u0000#d3e6dd": 1,
    "literal-color\u0000rgba(255, 255, 255, 0.86)": 1,
    "literal-color\u0000#e7f1ec": 1,
    "literal-color\u0000#edf4f0": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.09)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.07)": 2,
    "literal-color\u0000rgba(16, 82, 88, 0.24)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.12)": 1,
    "literal-color\u0000rgba(237, 245, 241, 0.72)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.06)": 1,
    "decorative-effect\u0000linear-gradient(": 5,
    "decorative-effect\u0000radial-gradient(": 2
  },
  "src/app/app/messages/messages.module.css": {
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#fff": 3,
    "literal-color\u0000#dfe4e0": 1,
    "literal-color\u0000rgba(23,107,69,.14)": 1,
    "literal-color\u0000#66706a": 1,
    "literal-color\u0000#fff2ef": 1,
    "literal-color\u0000#8b2e26": 1,
    "literal-color\u0000#eaf5ee": 1,
    "literal-color\u0000#0e3d33": 1,
    "small-type\u0000font-size:12px": 2
  },
  "src/app/app/settings/account-forms.module.css": {
    "literal-color\u0000#d64541": 2,
    "literal-color\u0000#2f7650": 1,
    "literal-color\u0000#ddd": 1
  },
  "src/app/app/settings/settings.module.css": {
    "literal-color\u0000#66706A": 7,
    "literal-color\u0000#fff": 1,
    "literal-color\u0000#E4E8E5": 4,
    "literal-color\u0000#105258": 2,
    "literal-color\u0000#F2F4F2": 1,
    "small-type\u0000font-size:12px": 1
  },
  "src/app/design-system.css": {
    "literal-color\u0000#ffffff": 22,
    "literal-color\u0000#f7f7f5": 1,
    "literal-color\u0000#f1f2ef": 2,
    "literal-color\u0000#111512": 2,
    "literal-color\u0000#69716b": 1,
    "literal-color\u0000#e4e6e2": 1,
    "literal-color\u0000#1b8569": 15,
    "literal-color\u0000#edf6ed": 1,
    "literal-color\u0000#181d19": 1,
    "literal-color\u0000#2b312c": 1,
    "literal-color\u0000#fff": 83,
    "literal-color\u0000#2b302c": 1,
    "literal-color\u0000#434a45": 1,
    "literal-color\u0000#555d57": 1,
    "literal-color\u0000#303631": 1,
    "literal-color\u0000#d9ddd8": 1,
    "literal-color\u0000rgba(0,0,0,.03)": 2,
    "literal-color\u0000#858c86": 3,
    "literal-color\u0000#262b27": 1,
    "literal-color\u0000#666e68": 3,
    "literal-color\u0000#606862": 1,
    "literal-color\u0000#5f6b63": 15,
    "literal-color\u0000#666d68": 1,
    "literal-color\u0000#202521": 2,
    "literal-color\u0000#626963": 1,
    "literal-color\u0000#8a908b": 6,
    "literal-color\u0000#656c66": 1,
    "literal-color\u0000#cfd3cf": 2,
    "literal-color\u0000#737b75": 4,
    "literal-color\u0000#858b86": 2,
    "literal-color\u0000#5f6761": 1,
    "literal-color\u0000#f6f7f5": 1,
    "literal-color\u0000#8fd0c9": 9,
    "literal-color\u0000#b8bdb9": 1,
    "literal-color\u0000#343a35": 2,
    "literal-color\u0000#aab0ab": 1,
    "literal-color\u0000#5d645f": 1,
    "literal-color\u0000#1f2420": 2,
    "literal-color\u0000#151a16": 2,
    "literal-color\u0000#ecefec": 1,
    "literal-color\u0000#353b36": 1,
    "literal-color\u0000#5e6862": 3,
    "literal-color\u0000#5e6660": 2,
    "literal-color\u0000#242924": 1,
    "literal-color\u0000#687069": 2,
    "literal-color\u0000#8b918c": 1,
    "literal-color\u0000#747c76": 1,
    "literal-color\u0000#d9dcd8": 2,
    "literal-color\u0000#fafafa": 1,
    "literal-color\u0000rgba(255,255,255,.94)": 1,
    "literal-color\u0000rgba(255,255,255,.97)": 2,
    "literal-color\u0000#414843": 1,
    "literal-color\u0000#9ba19c": 1,
    "literal-color\u0000#292f2a": 1,
    "literal-color\u0000#b9c0ba": 1,
    "literal-color\u0000#dce2dd": 1,
    "literal-color\u0000#7d857f": 2,
    "literal-color\u0000#7b827d": 1,
    "literal-color\u0000#727a74": 1,
    "literal-color\u0000#6d756f": 1,
    "literal-color\u0000#6a726c": 1,
    "literal-color\u0000#151b16": 2,
    "literal-color\u0000#202721": 1,
    "literal-color\u0000#9ba49d": 2,
    "literal-color\u0000#abb5ad": 1,
    "literal-color\u0000#0d4448": 15,
    "literal-color\u0000#105258": 34,
    "literal-color\u0000#eef6ed": 1,
    "literal-color\u0000rgba(19,48,30,.06)": 1,
    "literal-color\u0000#dfe6df": 1,
    "literal-color\u0000#7e8881": 1,
    "literal-color\u0000#778078": 1,
    "literal-color\u0000#7fa8a2": 4,
    "literal-color\u0000#7d867f": 3,
    "literal-color\u0000rgba(20,45,30,.035)": 1,
    "literal-color\u0000#a6ada8": 1,
    "literal-color\u0000#818982": 1,
    "literal-color\u0000rgba(20,45,30,.025)": 2,
    "literal-color\u0000#777f79": 1,
    "literal-color\u0000#9ba29d": 1,
    "literal-color\u0000#7e8780": 1,
    "literal-color\u0000#788179": 1,
    "literal-color\u0000#98a09a": 1,
    "literal-color\u0000#a1a8a2": 1,
    "literal-color\u0000#9fcfd2": 5,
    "literal-color\u0000#c9ddd0": 1,
    "literal-color\u0000rgba(255,255,255,.09)": 1,
    "literal-color\u0000#dcebec": 1,
    "literal-color\u0000rgba(0,0,0,.08)": 1,
    "literal-color\u0000rgba(255,255,255,.23)": 1,
    "literal-color\u0000#d0e1d5": 1,
    "literal-color\u0000rgba(255,255,255,.08)": 3,
    "literal-color\u0000rgba(255,255,255,.18)": 2,
    "literal-color\u0000#b6cabc": 1,
    "literal-color\u0000rgba(255,255,255,.22)": 1,
    "literal-color\u0000rgba(255,255,255,.13)": 3,
    "literal-color\u0000#c3d4c8": 1,
    "literal-color\u0000#c9dbcf": 1,
    "literal-color\u0000rgba(255,255,255,.12)": 1,
    "literal-color\u0000#bcd0c2": 1,
    "literal-color\u0000#bed0c4": 1,
    "literal-color\u0000#778079": 1,
    "literal-color\u0000#d7ded6": 1,
    "literal-color\u0000rgba(255,255,255,.92)": 1,
    "literal-color\u0000rgba(0,0,0,.12)": 1,
    "literal-color\u0000rgba(255,255,255,.45)": 1,
    "literal-color\u0000rgba(2,30,17,.73)": 1,
    "literal-color\u0000#f8faf8": 2,
    "literal-color\u0000#a4aba5": 1,
    "literal-color\u0000#f0f2f0": 1,
    "literal-color\u0000#fafbfa": 2,
    "literal-color\u0000#f2f8f0": 1,
    "literal-color\u0000#dce9da": 1,
    "literal-color\u0000#146a58": 1,
    "literal-color\u0000#7b887e": 1,
    "literal-color\u0000#879088": 1,
    "literal-color\u0000#6e7a72": 1,
    "literal-color\u0000#dce4dd": 1,
    "literal-color\u0000#7c857e": 2,
    "literal-color\u0000#97a099": 1,
    "literal-color\u0000#eef2ff": 1,
    "literal-color\u0000#5268a0": 1,
    "literal-color\u0000#79827b": 1,
    "literal-color\u0000#7a837c": 4,
    "literal-color\u0000#99a19a": 1,
    "literal-color\u0000#78817a": 1,
    "literal-color\u0000#174b50": 3,
    "literal-color\u0000#eaf5e8": 1,
    "literal-color\u0000#788079": 1,
    "literal-color\u0000#e6a928": 1,
    "literal-color\u0000#69736b": 2,
    "literal-color\u0000#f3f5f3": 2,
    "literal-color\u0000#647067": 1,
    "literal-color\u0000#858e87": 1,
    "literal-color\u0000#6e7971": 1,
    "literal-color\u0000#f2f8ee": 1,
    "literal-color\u0000#dcebd6": 1,
    "literal-color\u0000#7b6234": 1,
    "literal-color\u0000#fff8e9": 1,
    "literal-color\u0000#eee0bd": 1,
    "literal-color\u0000#5f6962": 1,
    "literal-color\u0000#f4f7f4": 1,
    "literal-color\u0000#273229": 1,
    "literal-color\u0000#e2eee0": 1,
    "literal-color\u0000#5c6660": 1,
    "literal-color\u0000#5d685f": 1,
    "literal-color\u0000#929a94": 1,
    "literal-color\u0000#a3aaa5": 1,
    "literal-color\u0000#f7faf6": 1,
    "literal-color\u0000#768079": 2,
    "literal-color\u0000#dfeedd": 1,
    "literal-color\u0000#737d75": 3,
    "literal-color\u0000#f0f3f0": 1,
    "literal-color\u0000rgba(3,54,29,.97)": 1,
    "literal-color\u0000#102018": 1,
    "literal-color\u0000#667169": 2,
    "literal-color\u0000#eff7f1": 1,
    "literal-color\u0000#faf9f6": 1,
    "literal-color\u0000#e2e8e3": 1,
    "literal-color\u0000#536059": 1,
    "literal-color\u0000rgba(7,84,47,.12)": 1,
    "literal-color\u0000#1c2129": 11,
    "literal-color\u0000#dce7df": 1,
    "literal-color\u0000#f6faf7": 1,
    "literal-color\u0000#46534b": 1,
    "literal-color\u0000#6f7972": 1,
    "literal-color\u0000#dfe6e1": 1,
    "literal-color\u0000rgba(20,50,32,.10)": 1,
    "literal-color\u0000rgba(20,50,32,.04)": 1,
    "literal-color\u0000#dfeee4": 1,
    "literal-color\u0000rgba(223,238,228,0)": 1,
    "literal-color\u0000#8b948e": 1,
    "literal-color\u0000#eaf6ee": 1,
    "literal-color\u0000#f7f9f7": 5,
    "literal-color\u0000#edf0ed": 2,
    "literal-color\u0000#89928c": 1,
    "literal-color\u0000#303a33": 1,
    "literal-color\u0000#f2f5f3": 1,
    "literal-color\u0000#758078": 5,
    "literal-color\u0000#e7f4eb": 1,
    "literal-color\u0000#838c86": 1,
    "literal-color\u0000#dfe5e0": 1,
    "literal-color\u0000#617068": 1,
    "literal-color\u0000#efede8": 2,
    "literal-color\u0000#727970": 1,
    "literal-color\u0000#e7e5df": 1,
    "literal-color\u0000#d8dfd8": 1,
    "literal-color\u0000rgba(27,50,34,.07)": 1,
    "literal-color\u0000#f4f8f4": 2,
    "literal-color\u0000#5d6a61": 1,
    "literal-color\u0000#dae4dc": 1,
    "literal-color\u0000rgba(19,49,31,.06)": 1,
    "literal-color\u0000#909892": 1,
    "literal-color\u0000#edf7ef": 2,
    "literal-color\u0000#e8ece8": 1,
    "literal-color\u0000#0b1811": 2,
    "literal-color\u0000#26362b": 2,
    "literal-color\u0000rgba(20,50,32,.08)": 1,
    "literal-color\u0000#eff8f0": 1,
    "literal-color\u0000#fff7e8": 1,
    "literal-color\u0000#855e14": 1,
    "literal-color\u0000#fff5f3": 3,
    "literal-color\u0000#8f2f25": 3,
    "literal-color\u0000#f1d4cf": 3,
    "literal-color\u0000#f2f8f2": 1,
    "literal-color\u0000#dbe9dc": 1,
    "literal-color\u0000#8a938c": 2,
    "literal-color\u0000#7b847d": 2,
    "literal-color\u0000#a2aaa4": 1,
    "literal-color\u0000#a3332a": 2,
    "literal-color\u0000#737c75": 1,
    "literal-color\u0000#657068": 1,
    "literal-color\u0000#f6f8f6": 1,
    "literal-color\u0000#9e332a": 2,
    "literal-color\u0000#8b938d": 1,
    "literal-color\u0000#fff0ed": 1,
    "literal-color\u0000#9c3128": 1,
    "literal-color\u0000#edf7ee": 1,
    "literal-color\u0000#efd3ce": 1,
    "literal-color\u0000#fff7f5": 1,
    "literal-color\u0000#5e3b32": 1,
    "literal-color\u0000#241815": 1,
    "literal-color\u0000#ffc6bc": 1,
    "literal-color\u0000#cbb8b3": 1,
    "literal-color\u0000#7c4a42": 1,
    "literal-color\u0000#f2f6f2": 1,
    "literal-color\u0000#7f8881": 1,
    "literal-color\u0000#a1a9a3": 1,
    "literal-color\u0000#7c857f": 2,
    "literal-color\u0000#8c948e": 2,
    "literal-color\u0000#f7faf7": 1,
    "literal-color\u0000#f3f6f3": 1,
    "literal-color\u0000#59645c": 1,
    "literal-color\u0000#8b671f": 1,
    "literal-color\u0000rgba(0,0,0,.62)": 1,
    "literal-color\u0000#eef7ef": 1,
    "literal-color\u0000#747e76": 1,
    "literal-color\u0000#f5f8f5": 1,
    "literal-color\u0000#f1f4f1": 1,
    "literal-color\u0000#e0e5e1": 1,
    "literal-color\u0000rgba(20,46,30,.07)": 1,
    "literal-color\u0000#818a83": 1,
    "literal-color\u0000#68736a": 1,
    "literal-color\u0000#cdd4ce": 1,
    "literal-color\u0000#8b948d": 1,
    "literal-color\u0000#1b251f": 1,
    "literal-color\u0000#6b756d": 1,
    "literal-color\u0000#8a928c": 1,
    "literal-color\u0000#939d95": 1,
    "literal-color\u0000#94a097": 1,
    "literal-color\u0000#edf1ed": 1,
    "literal-color\u0000#6f7971": 1,
    "literal-color\u0000#293b2e": 2,
    "literal-color\u0000#7c867e": 1,
    "literal-color\u0000#314435": 1,
    "literal-color\u0000#f4f6f4": 1,
    "literal-color\u0000#112018": 1,
    "literal-color\u0000#657168": 1,
    "literal-color\u0000#edf6ef": 1,
    "literal-color\u0000#f7f6f2": 1,
    "literal-color\u0000#e1e7e2": 1,
    "literal-color\u0000rgba(255,255,255,.96)": 1,
    "literal-color\u0000#58635b": 1,
    "literal-color\u0000#f5faf6": 1,
    "literal-color\u0000#dde9e0": 1,
    "literal-color\u0000#d8e2da": 1,
    "literal-color\u0000rgba(14,51,29,.08)": 1,
    "literal-color\u0000#6e7b72": 1,
    "literal-color\u0000rgba(11,106,58,.14)": 1,
    "literal-color\u0000#778179": 1,
    "literal-color\u0000#909791": 1,
    "literal-color\u0000#59655d": 1,
    "literal-color\u0000#b8cbbd": 1,
    "literal-color\u0000#dce4de": 1,
    "literal-color\u0000rgba(17,50,31,.10)": 1,
    "literal-color\u0000rgba(17,50,31,.04)": 1,
    "literal-color\u0000#dceee2": 1,
    "literal-color\u0000rgba(220,238,226,0)": 1,
    "literal-color\u0000#eaf6ed": 1,
    "literal-color\u0000#344139": 1,
    "literal-color\u0000#6f7a72": 1,
    "literal-color\u0000#718078": 1,
    "literal-color\u0000#9aa49d": 1,
    "literal-color\u0000#818a84": 1,
    "literal-color\u0000#d8e9dc": 1,
    "literal-color\u0000#f1f8f2": 1,
    "literal-color\u0000#838d86": 1,
    "literal-color\u0000#707b73": 2,
    "literal-color\u0000#ece9e3": 2,
    "literal-color\u0000#dfddd7": 2,
    "literal-color\u0000#879087": 1,
    "literal-color\u0000#707971": 1,
    "literal-color\u0000#e5e3de": 1,
    "literal-color\u0000#6c786f": 1,
    "literal-color\u0000#57645b": 1,
    "literal-color\u0000#dbe4dd": 1,
    "literal-color\u0000rgba(16,48,29,.07)": 1,
    "literal-color\u0000#8d9690": 1,
    "literal-color\u0000#88918b": 1,
    "literal-color\u0000#7c867f": 1,
    "literal-color\u0000#0c1b12": 2,
    "literal-color\u0000#f4f8f5": 1,
    "literal-color\u0000#aebdb2": 1,
    "literal-color\u0000#26392c": 2,
    "literal-color\u0000#9fb0a4": 1,
    "literal-color\u0000rgba(17,50,31,.08)": 1,
    "literal-color\u0000#d8e7dc": 1,
    "literal-color\u0000#f3f9f4": 1,
    "literal-color\u0000#728078": 1,
    "literal-color\u0000#122018": 1,
    "literal-color\u0000#647069": 1,
    "literal-color\u0000#136b59": 1,
    "literal-color\u0000rgba(255,255,255,.72)": 1,
    "literal-color\u0000#F7F8F7": 1,
    "literal-color\u0000#FFFFFF": 1,
    "literal-color\u0000#F4FAF6": 1,
    "literal-color\u0000#EAF5EE": 2,
    "literal-color\u0000#171A18": 1,
    "literal-color\u0000#66706A": 1,
    "literal-color\u0000#E4E8E5": 1,
    "literal-color\u0000#D5DCD7": 1,
    "literal-color\u0000#0A3539": 1,
    "literal-color\u0000rgba(18,60,42,.14)": 1,
    "literal-color\u0000rgba(18,60,42,.08)": 1,
    "literal-color\u0000rgba(18,60,42,.07)": 1,
    "literal-color\u0000#fbf9f7": 2,
    "literal-color\u0000#f5f3f1": 2,
    "literal-color\u0000#066a6f": 1,
    "literal-color\u0000#02545a": 1,
    "literal-color\u0000#e8f0ec": 2,
    "literal-color\u0000#eaf4ee": 2,
    "literal-color\u0000#0a3539": 1,
    "literal-color\u0000#5b6d73": 1,
    "literal-color\u0000#e9e2d2": 1,
    "literal-color\u0000rgba(28,33,41,.07)": 3,
    "literal-color\u0000rgba(28,33,41,.12)": 1,
    "literal-color\u0000#33484f": 2,
    "literal-color\u0000rgba(28,33,41,.045)": 1,
    "literal-color\u0000rgba(28,33,41,.05)": 4,
    "literal-color\u0000rgba(2,84,90,.25)": 1,
    "literal-color\u0000rgba(201,32,32,.35)": 1,
    "literal-color\u0000rgba(28,33,41,.04)": 1,
    "literal-color\u0000#f1f5f2": 3,
    "literal-color\u0000#dce8e0": 4,
    "literal-color\u0000#0e2f43": 1,
    "literal-color\u0000#0b5c62": 3,
    "literal-color\u0000rgba(16,82,88,.28)": 1,
    "literal-color\u0000#eef2f0": 1,
    "literal-color\u0000#e3ece8": 1,
    "literal-color\u0000#fdeeee": 1,
    "literal-color\u0000#8f1f1f": 1,
    "literal-color\u0000rgba(255,255,255,.16)": 1,
    "literal-color\u0000#57686b": 3,
    "literal-color\u0000#eef4ef": 1,
    "literal-color\u0000rgba(22,51,61,.12)": 1,
    "literal-color\u0000#eaf3ec": 5,
    "literal-color\u0000#6a7a70": 4,
    "literal-color\u0000#fdeee7": 2,
    "literal-color\u0000#d1622f": 2,
    "literal-color\u0000#edf2e4": 2,
    "literal-color\u0000#22352b": 6,
    "literal-color\u0000#8a948d": 4,
    "literal-color\u0000#9aa79e": 2,
    "literal-color\u0000#e9f2ea": 2,
    "literal-color\u0000#d6e7d8": 2,
    "literal-color\u0000#5c6e60": 2,
    "literal-color\u0000#f2f6f1": 1,
    "literal-color\u0000#7d877f": 3,
    "literal-color\u0000#4c5a51": 1,
    "literal-color\u0000#d7ded8": 1,
    "literal-color\u0000rgba(0,0,0,.18)": 1,
    "literal-color\u0000#f2f7f3": 2,
    "literal-color\u0000#33453b": 1,
    "literal-color\u0000#1c332a": 1,
    "literal-color\u0000rgba(18,60,42,.28)": 1,
    "literal-color\u0000#14523f": 1,
    "literal-color\u0000#8f2f2a": 1,
    "literal-color\u0000#d98a2b": 1,
    "literal-color\u0000#cfe4e0": 1,
    "literal-color\u0000#a12b25": 2,
    "literal-color\u0000#7c5a54": 1,
    "literal-color\u0000#f5fbf3": 1,
    "literal-color\u0000#b9dcd0": 1,
    "literal-color\u0000#8ca0af": 1,
    "literal-color\u0000#77a8ff": 1,
    "small-type\u0000font-size:12px": 48,
    "small-type\u0000font-size:11px": 49,
    "small-type\u0000font-size:9px": 60,
    "small-type\u0000font-size:10px": 41,
    "small-type\u0000font-size:8px": 56,
    "small-type\u0000font-size:7px": 5,
    "small-type\u0000font-size:10.5px": 6,
    "small-type\u0000font-size:9.5px": 3,
    "small-type\u0000font-size:11.5px": 9,
    "small-type\u0000font-size:8.5px": 1,
    "small-type\u0000font-size:12.5px": 8,
    "decorative-effect\u0000linear-gradient(": 5,
    "decorative-effect\u0000radial-gradient(": 2
  },
  "src/app/globals.css": {
    "literal-color\u0000#105258": 26,
    "literal-color\u0000#0d4448": 12,
    "literal-color\u0000#dcebec": 22,
    "literal-color\u0000#0b1623": 1,
    "literal-color\u0000#061522": 1,
    "literal-color\u0000#0d2031": 16,
    "literal-color\u0000#6e7780": 1,
    "literal-color\u0000#e6e9e7": 1,
    "literal-color\u0000#f6f8f6": 2,
    "literal-color\u0000#fff": 70,
    "literal-color\u0000#68726b": 1,
    "literal-color\u0000#102235": 1,
    "literal-color\u0000#55605a": 2,
    "literal-color\u0000#46504a": 1,
    "literal-color\u0000#edf0ee": 1,
    "literal-color\u0000rgba(21,45,31,.05)": 1,
    "literal-color\u0000#68736c": 3,
    "literal-color\u0000#f8faf8": 3,
    "literal-color\u0000#eef5ec": 1,
    "literal-color\u0000rgba(23,49,31,.12)": 1,
    "literal-color\u0000#dfe4e0": 1,
    "literal-color\u0000rgba(16,82,88,.12)": 1,
    "literal-color\u0000#fff0ef": 2,
    "literal-color\u0000#a12b25": 1,
    "literal-color\u0000#eaf8e7": 1,
    "literal-color\u0000#eef3ef": 2,
    "literal-color\u0000rgba(18,39,27,.16)": 1,
    "literal-color\u0000#e7ece8": 1,
    "literal-color\u0000rgba(255,255,255,.96)": 3,
    "literal-color\u0000#9caab4": 1,
    "literal-color\u0000#69736d": 1,
    "literal-color\u0000#535c56": 1,
    "literal-color\u0000#edf1ee": 1,
    "literal-color\u0000#4d574f": 1,
    "literal-color\u0000#65706a": 2,
    "literal-color\u0000#d7dfd9": 1,
    "literal-color\u0000#6c766f": 2,
    "literal-color\u0000#59635d": 1,
    "literal-color\u0000#eef1ef": 1,
    "literal-color\u0000#fff2cf": 3,
    "literal-color\u0000#876000": 3,
    "literal-color\u0000#ffebea": 3,
    "literal-color\u0000#9d2922": 4,
    "literal-color\u0000#535e57": 1,
    "literal-color\u0000#647068": 1,
    "literal-color\u0000#7fa8a2": 3,
    "literal-color\u0000#1b8569": 7,
    "literal-color\u0000#6d776f": 1,
    "literal-color\u0000#dbe9d8": 1,
    "literal-color\u0000#f5fbf3": 2,
    "literal-color\u0000#66716a": 2,
    "literal-color\u0000#d0e8e0": 1,
    "literal-color\u0000#6b766f": 1,
    "literal-color\u0000#e5b41f": 1,
    "literal-color\u0000#6a746d": 1,
    "literal-color\u0000#707a73": 1,
    "literal-color\u0000#5d675f": 1,
    "literal-color\u0000#e9edf0": 1,
    "literal-color\u0000#122638": 1,
    "literal-color\u0000#f7fafc": 1,
    "literal-color\u0000rgba(6,21,34,.96)": 1,
    "literal-color\u0000#13293b": 1,
    "literal-color\u0000rgba(6,21,34,.97)": 1,
    "literal-color\u0000#193044": 1,
    "literal-color\u0000#8ca0af": 1,
    "literal-color\u0000#77a8ff": 2,
    "literal-color\u0000#102435": 3,
    "literal-color\u0000#183043": 1,
    "literal-color\u0000#a6b3be": 1,
    "literal-color\u0000#d8e1e8": 1,
    "literal-color\u0000#86908b": 1,
    "literal-color\u0000#284052": 1,
    "literal-color\u0000#92a3af": 1,
    "literal-color\u0000#c0cbd3": 1,
    "literal-color\u0000#a6b4bf": 1,
    "literal-color\u0000#173044": 2,
    "literal-color\u0000#9faeba": 1,
    "literal-color\u0000#193346": 2,
    "literal-color\u0000#10283a": 4,
    "literal-color\u0000#244258": 5,
    "literal-color\u0000#1e3749": 1,
    "literal-color\u0000#1d384b": 10,
    "literal-color\u0000#9db0bd": 1,
    "literal-color\u0000#20364a": 1,
    "literal-color\u0000#d4dde4": 1,
    "literal-color\u0000#294052": 1,
    "literal-color\u0000#7d8981": 1,
    "literal-color\u0000#eef9e8": 1,
    "literal-color\u0000#f8fcf5": 1,
    "literal-color\u0000#dcebd7": 1,
    "literal-color\u0000#6f7972": 1,
    "literal-color\u0000#6c776f": 2,
    "literal-color\u0000#f1f3f1": 2,
    "literal-color\u0000#9badb9": 1,
    "literal-color\u0000rgba(20,44,28,.12)": 1,
    "literal-color\u0000#eef7ea": 3,
    "literal-color\u0000#7b847f": 1,
    "literal-color\u0000#737d76": 1,
    "literal-color\u0000#68726c": 1,
    "literal-color\u0000#1d3a4e": 1,
    "literal-color\u0000#f2b64d": 2,
    "literal-color\u0000#9fb0bc": 10,
    "literal-color\u0000#d7e0e6": 1,
    "literal-color\u0000#294356": 1,
    "literal-color\u0000#fff8e9": 1,
    "literal-color\u0000#f0d99d": 1,
    "literal-color\u0000#b7791f": 1,
    "literal-color\u0000#665a43": 1,
    "literal-color\u0000#6c604a": 1,
    "literal-color\u0000#fafbfa": 1,
    "literal-color\u0000#12283a": 1,
    "literal-color\u0000#365064": 1,
    "literal-color\u0000#b7c5cf": 1,
    "literal-color\u0000#f3f6f4": 1,
    "literal-color\u0000#69756d": 2,
    "literal-color\u0000rgba(20,45,30,.06)": 1,
    "literal-color\u0000#4f5b53": 1,
    "literal-color\u0000#e53e3e": 1,
    "literal-color\u0000#5f6b63": 6,
    "literal-color\u0000#0e3d33": 4,
    "literal-color\u0000#174b50": 2,
    "literal-color\u0000#f5fbf2": 1,
    "literal-color\u0000#657068": 2,
    "literal-color\u0000#f7f9f7": 2,
    "literal-color\u0000#e5ebe6": 1,
    "literal-color\u0000rgba(21,45,31,.045)": 1,
    "literal-color\u0000#e3e9e4": 1,
    "literal-color\u0000#25322a": 1,
    "literal-color\u0000#17301b": 1,
    "literal-color\u0000#eef7eb": 1,
    "literal-color\u0000#d9ead5": 1,
    "literal-color\u0000#dce4dd": 1,
    "literal-color\u0000#eef1ee": 1,
    "literal-color\u0000#526058": 2,
    "literal-color\u0000#f2c3c0": 1,
    "literal-color\u0000#e2e8e3": 1,
    "literal-color\u0000#829087": 1,
    "literal-color\u0000#617068": 1,
    "literal-color\u0000#d8ead3": 1,
    "literal-color\u0000#f1faed": 1,
    "literal-color\u0000#fbfdf9": 1,
    "literal-color\u0000#edf1ff": 1,
    "literal-color\u0000#3550a3": 1,
    "literal-color\u0000#fff1d8": 1,
    "literal-color\u0000#8b5d00": 1,
    "literal-color\u0000#f1f5f1": 1,
    "literal-color\u0000#56635a": 1,
    "literal-color\u0000#edf8e9": 3,
    "literal-color\u0000#25485e": 1,
    "literal-color\u0000#0d2333": 1,
    "literal-color\u0000#9fb2bf": 1,
    "literal-color\u0000#304b5c": 1,
    "literal-color\u0000#9fcfd2": 2,
    "literal-color\u0000#0f2231": 1,
    "literal-color\u0000#0a1722": 1,
    "literal-color\u0000#8fd0c9": 4,
    "literal-color\u0000#b7c3cb": 1,
    "literal-color\u0000#61705f": 1,
    "literal-color\u0000#e4f5df": 1,
    "literal-color\u0000#738078": 1,
    "literal-color\u0000#647067": 2,
    "literal-color\u0000#68746c": 1,
    "literal-color\u0000#f2f5f2": 1,
    "literal-color\u0000#5d695f": 1,
    "literal-color\u0000#657168": 2,
    "literal-color\u0000#d5ddd6": 1,
    "literal-color\u0000#667269": 1,
    "literal-color\u0000#f2faef": 1,
    "literal-color\u0000#eef9ea": 1,
    "literal-color\u0000#78837c": 1,
    "literal-color\u0000#eaf6e6": 1,
    "literal-color\u0000#768179": 1,
    "literal-color\u0000#5f6a62": 1,
    "literal-color\u0000#67736a": 1,
    "literal-color\u0000#f7faf6": 1,
    "literal-color\u0000#183248": 1,
    "literal-color\u0000#cde0ee": 1,
    "literal-color\u0000#91a5b3": 1,
    "literal-color\u0000#8fa2af": 1,
    "literal-color\u0000#c4d0d8": 1,
    "literal-color\u0000#eff8ec": 1,
    "literal-color\u0000#e8f1ff": 1,
    "literal-color\u0000#315f9e": 1,
    "literal-color\u0000#626d65": 1,
    "literal-color\u0000#1c2129": 10,
    "literal-color\u0000#6b7d82": 3,
    "literal-color\u0000#ffffff": 14,
    "literal-color\u0000#e7f1ec": 1,
    "literal-color\u0000#f5f8f7": 1,
    "literal-color\u0000#fbfdfc": 1,
    "literal-color\u0000#eef4f1": 3,
    "literal-color\u0000#000": 6,
    "literal-color\u0000#eaf3ee": 1,
    "literal-color\u0000#f4f9f6": 1,
    "literal-color\u0000rgba(16,82,88,.08)": 1,
    "literal-color\u0000#e6eeeb": 8,
    "literal-color\u0000rgba(18,51,59,.05)": 8,
    "literal-color\u0000#edf4f0": 2,
    "literal-color\u0000#e3ecea": 1,
    "literal-color\u0000rgba(18,51,59,.08)": 3,
    "literal-color\u0000rgba(255,255,255,.85)": 2,
    "literal-color\u0000rgba(255,255,255,0)": 2,
    "literal-color\u0000rgba(16,82,88,.35)": 3,
    "literal-color\u0000rgba(255,255,255,.16)": 1,
    "literal-color\u0000#f2f6f4": 1,
    "literal-color\u0000rgba(255,255,255,.95)": 1,
    "literal-color\u0000rgba(255,255,255,.4)": 1,
    "literal-color\u0000rgba(255,255,255,1)": 1,
    "literal-color\u0000rgba(18,51,59,.07)": 1,
    "literal-color\u0000#e3ece8": 13,
    "literal-color\u0000#dde8e2": 3,
    "literal-color\u0000rgba(18,51,59,.1)": 1,
    "literal-color\u0000#d3e0da": 1,
    "literal-color\u0000rgba(0,0,0,.2)": 2,
    "literal-color\u0000#f0f7f4": 10,
    "literal-color\u0000#cfdcd7": 2,
    "literal-color\u0000#eef2f0": 7,
    "literal-color\u0000#eaf4ee": 7,
    "literal-color\u0000#fdeeed": 7,
    "literal-color\u0000#d0452e": 5,
    "literal-color\u0000rgba(18,51,59,.06)": 4,
    "literal-color\u0000#f4f7f7": 15,
    "literal-color\u0000#1a3a4a": 7,
    "literal-color\u0000#5b6d73": 5,
    "literal-color\u0000#e8f0ec": 3,
    "literal-color\u0000#33484f": 1,
    "literal-color\u0000rgba(28,33,41,.35)": 1,
    "literal-color\u0000#eee9df": 1,
    "literal-color\u0000#e5ddcf": 2,
    "literal-color\u0000#9aa9ad": 3,
    "literal-color\u0000#dde5e2": 1,
    "literal-color\u0000#f0f2f1": 1,
    "literal-color\u0000#f0f4f2": 2,
    "literal-color\u0000#eceae2": 3,
    "literal-color\u0000rgba(0,0,0,.08)": 1,
    "literal-color\u0000#fdf1e3": 2,
    "literal-color\u0000#d98a2b": 2,
    "literal-color\u0000#eef0f0": 2,
    "literal-color\u0000rgba(208,69,46,.3)": 1,
    "literal-color\u0000rgba(208,69,46,0)": 1,
    "literal-color\u0000#dfe5e2": 2,
    "literal-color\u0000#c8d2ce": 1,
    "literal-color\u0000#f4f1ea": 1,
    "literal-color\u0000#f4faf7": 2,
    "literal-color\u0000rgba(28,33,41,.09)": 1,
    "literal-color\u0000#57686b": 2,
    "literal-color\u0000rgba(28,33,41,.065)": 1,
    "literal-color\u0000rgba(28,33,41,.10)": 1,
    "literal-color\u0000rgba(28,33,41,.12)": 4,
    "literal-color\u0000rgba(28,33,41,.035)": 3,
    "literal-color\u0000rgba(28,33,41,.045)": 1,
    "literal-color\u0000rgba(16,82,88,.28)": 1,
    "literal-color\u0000rgba(255,253,250,.97)": 1,
    "literal-color\u0000rgba(28,33,41,.055)": 1,
    "literal-color\u0000rgba(28,33,41,.07)": 1,
    "literal-color\u0000#efeae1": 1,
    "literal-color\u0000#f3f8f5": 1,
    "literal-color\u0000#0a3539": 1,
    "literal-color\u0000#147078": 1,
    "literal-color\u0000#edf5f5": 1,
    "literal-color\u0000#cfdad9": 1,
    "literal-color\u0000#ecd9ac": 1,
    "literal-color\u0000#fff8e8": 1,
    "literal-color\u0000#674b14": 1,
    "literal-color\u0000#b8d9c5": 1,
    "literal-color\u0000rgba(10,53,57,.55)": 1,
    "literal-color\u0000#d7dfdc": 1,
    "literal-color\u0000rgba(16,82,88,.10)": 1,
    "small-type\u0000font-size:10px": 28,
    "small-type\u0000font-size:11px": 21,
    "small-type\u0000font-size:12px": 25,
    "small-type\u0000font-size:9px": 28,
    "small-type\u0000font-size:8px": 15,
    "small-type\u0000font-size:7px": 4,
    "small-type\u0000font-size: 12.5px": 14,
    "small-type\u0000font-size: 11.5px": 8,
    "small-type\u0000font-size: 10.5px": 3,
    "small-type\u0000font-size: 11px": 5,
    "small-type\u0000font-size: 12px": 4,
    "small-type\u0000font-size: 10px": 2,
    "small-type\u0000font-size: 9.5px": 1,
    "small-type\u0000font-size:11.5px": 3,
    "small-type\u0000font-size:12.5px": 4,
    "small-type\u0000font-size:10.5px": 1,
    "decorative-effect\u0000linear-gradient(": 13,
    "decorative-effect\u0000radial-gradient(": 5,
    "decorative-effect\u0000backdrop-filter:blur": 3
  },
  "src/app/hilfe/faq-explorer.tsx": {
    "unowned-style\u0000style={": 1
  },
  "src/app/ki-chat/page.tsx": {
    "literal-color\u0000#1c2129": 6,
    "literal-color\u0000#fff": 1
  },
  "src/app/layout.tsx": {
    "literal-color\u0000#ffffff": 1
  },
  "src/app/lexikon/[begriff]/page.tsx": {
    "unowned-style\u0000style={": 7
  },
  "src/app/lexikon/kategorie/[kategorie]/page.tsx": {
    "unowned-style\u0000style={": 1
  },
  "src/app/manifest.ts": {
    "literal-color\u0000#F4F7F7": 1,
    "literal-color\u0000#105258": 1
  },
  "src/app/not-found.tsx": {
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#0d4448": 3,
    "literal-color\u0000#1b8569": 1
  },
  "src/app/onboarding/pro/onboarding-pro.module.css": {
    "literal-color\u0000#105258": 1
  },
  "src/app/onboarding/pro/page.tsx": {
    "literal-color\u0000#1c2129": 2,
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#fff": 4
  },
  "src/app/preise/price-ledger.module.css": {
    "small-type\u0000font-size: 11.5px": 1
  },
  "src/app/pro/messages/messages.module.css": {
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#fff": 3,
    "literal-color\u0000#d5dcd7": 1,
    "literal-color\u0000#171a18": 1,
    "literal-color\u0000rgba(23,107,69,.14)": 1,
    "literal-color\u0000#66706a": 1,
    "literal-color\u0000#fff2ef": 1,
    "literal-color\u0000#8b2e26": 1,
    "literal-color\u0000#eaf5ee": 1,
    "literal-color\u0000#0e3d33": 1,
    "small-type\u0000font-size:12px": 2
  },
  "src/app/pro/page.tsx": {
    "small-type\u0000text-xs": 2,
    "decorative-effect\u0000rounded-full": 1
  },
  "src/app/pro/provider-workspace.module.css": {
    "literal-color\u0000rgba(255, 255, 255, 0.97)": 1,
    "literal-color\u0000#66706a": 1,
    "literal-color\u0000rgba(255, 255, 255, 0.94)": 2,
    "literal-color\u0000#59635d": 3,
    "literal-color\u0000rgba(255, 255, 255, 0.98)": 3,
    "literal-color\u0000#4e5751": 1,
    "literal-color\u0000rgba(255, 255, 255, 0.6)": 1,
    "literal-color\u0000#efcfcc": 2,
    "literal-color\u0000#fff8f7": 2,
    "literal-color\u0000#fcebea": 1,
    "literal-color\u0000#a63b34": 1,
    "literal-color\u0000#e9ddbc": 1,
    "literal-color\u0000#fffcf4": 1,
    "literal-color\u0000#f8f0d9": 1,
    "literal-color\u0000#80611b": 1,
    "literal-color\u0000#dcebec": 5,
    "literal-color\u0000#88918b": 1,
    "literal-color\u0000#eef1ef": 1,
    "literal-color\u0000#57615a": 1,
    "literal-color\u0000#f8f1df": 1,
    "literal-color\u0000#775d1e": 1,
    "literal-color\u0000rgba(255, 255, 255, 0.5)": 1,
    "literal-color\u0000rgba(20, 45, 30, 0.05)": 1,
    "literal-color\u0000#9b7625": 1,
    "literal-color\u0000#ead7c0": 1,
    "literal-color\u0000#fffaf4": 1,
    "literal-color\u0000#3f4842": 1,
    "literal-color\u0000#4d5750": 1,
    "literal-color\u0000#bfc8c1": 1,
    "literal-color\u0000#bdc8c0": 1,
    "literal-color\u0000#cfe2d5": 2,
    "literal-color\u0000#d4e5da": 1,
    "literal-color\u0000#fafbfa": 1,
    "literal-color\u0000#9fcfd2": 1,
    "literal-color\u0000#dcece1": 1,
    "literal-color\u0000#8f302a": 1,
    "literal-color\u0000#e9ece9": 1,
    "literal-color\u0000rgba(255,255,255,.72)": 1,
    "literal-color\u0000rgba(23, 107, 69, 0.28)": 1,
    "literal-color\u0000rgba(23, 107, 69, 0.1)": 1,
    "literal-color\u0000#d7e6dc": 1,
    "literal-color\u0000#f5f6f5": 1,
    "literal-color\u0000#e8ebe9": 1,
    "literal-color\u0000rgba(255, 255, 255, 0.9)": 1,
    "literal-color\u0000#3b2f16": 1,
    "literal-color\u0000#ffe9b8": 1,
    "literal-color\u0000#6b5626": 1,
    "literal-color\u0000rgba(214, 235, 225, 0.54)": 1,
    "literal-color\u0000#cfe4da": 1,
    "literal-color\u0000rgba(242, 249, 245, 0.86)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.05)": 3,
    "literal-color\u0000rgba(14, 61, 51, 0.1)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.08)": 1,
    "literal-color\u0000#cfddd6": 1,
    "literal-color\u0000rgba(255, 255, 255, 0.72)": 1,
    "literal-color\u0000rgba(237, 245, 241, 0.76)": 1,
    "literal-color\u0000rgba(14, 61, 51, 0.07)": 1,
    "decorative-effect\u0000linear-gradient(": 2,
    "decorative-effect\u0000radial-gradient(": 1
  },
  "src/app/register-owner/page.tsx": {
    "literal-color\u0000#1c2129": 1,
    "literal-color\u0000#105258": 6
  },
  "src/app/register-pro/page.tsx": {
    "literal-color\u0000#1c2129": 1,
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#e7efeb": 1
  },
  "src/app/role/page.tsx": {
    "literal-color\u0000#105258": 1,
    "literal-color\u0000#e7f0ec": 1
  },
  "src/app/welcome/page.tsx": {
    "literal-color\u0000#105258": 1
  },
  "src/components/KiCard.tsx": {
    "literal-color\u0000#105258": 4,
    "literal-color\u0000#a3d4c3": 1
  },
  "src/components/NativeInit.tsx": {
    "literal-color\u0000#f4f7f7": 1
  },
  "src/components/auth-v2/AuthShell.tsx": {
    "literal-color\u0000#e4e2dc": 8,
    "literal-color\u0000#c8623a": 3,
    "literal-color\u0000#edf5f5": 3,
    "literal-color\u0000#1c2129": 10,
    "literal-color\u0000#dcebec": 5,
    "literal-color\u0000#f2f5f5": 2,
    "literal-color\u0000#105258": 2,
    "small-type\u0000text-xs": 7,
    "small-type\u0000text-[11px]": 1,
    "decorative-effect\u0000rounded-full": 2,
    "visual-utility\u0000text-stone-600": 5,
    "visual-utility\u0000text-stone-400": 2,
    "visual-utility\u0000text-stone-900": 2
  },
  "src/components/auth-v2/ForgotPasswordModal.tsx": {
    "literal-color\u0000#e4e2dc": 1,
    "literal-color\u0000#edf5f5": 1,
    "literal-color\u0000#1c2129": 2,
    "literal-color\u0000#dcebec": 1,
    "literal-color\u0000#105258": 1,
    "small-type\u0000text-xs": 1,
    "decorative-effect\u0000shadow-xl": 1,
    "decorative-effect\u0000rounded-full": 1,
    "visual-utility\u0000bg-stone-900": 1,
    "visual-utility\u0000text-stone-400": 1,
    "visual-utility\u0000text-stone-700": 1,
    "visual-utility\u0000bg-stone-100": 1,
    "visual-utility\u0000text-stone-600": 1
  },
  "src/components/auth-v2/HeroPanel.tsx": {
    "literal-color\u0000#e4e2dc": 3,
    "literal-color\u0000#1c2129": 9,
    "literal-color\u0000#E69E66": 1,
    "literal-color\u0000#f2f5f5": 1,
    "literal-color\u0000#DCD5C9": 1,
    "literal-color\u0000#0a3539": 2,
    "literal-color\u0000#c8623a": 2,
    "literal-color\u0000#105258": 1,
    "small-type\u0000text-xs": 7,
    "decorative-effect\u0000rounded-full": 3,
    "decorative-effect\u0000bg-gradient-": 1,
    "visual-utility\u0000text-stone-600": 5,
    "visual-utility\u0000border-stone-100": 1,
    "visual-utility\u0000bg-emerald-500": 1,
    "visual-utility\u0000border-stone-200": 1
  },
  "src/components/auth-v2/LegalModal.tsx": {
    "literal-color\u0000#e4e2dc": 7,
    "literal-color\u0000#1c2129": 21,
    "literal-color\u0000#c8623a": 2,
    "literal-color\u0000#f2f5f5": 6,
    "literal-color\u0000#0a3539": 1,
    "small-type\u0000text-xs": 8,
    "visual-utility\u0000text-stone-700": 5,
    "visual-utility\u0000text-stone-600": 7,
    "visual-utility\u0000text-stone-800": 1
  },
  "src/components/auth-v2/LoginForm.tsx": {
    "literal-color\u0000#1c2129": 11,
    "literal-color\u0000#E69E66": 1,
    "literal-color\u0000#e4e2dc": 12,
    "literal-color\u0000#f2f5f5": 1,
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#c8623a": 36,
    "literal-color\u0000#0a3539": 2,
    "literal-color\u0000#a84d29": 2,
    "literal-color\u0000#8a3f22": 2,
    "small-type\u0000text-xs": 20,
    "visual-utility\u0000border-stone-100": 2,
    "visual-utility\u0000text-stone-600": 8,
    "visual-utility\u0000text-stone-400": 13,
    "visual-utility\u0000bg-red-50": 1,
    "visual-utility\u0000border-red-200": 1,
    "visual-utility\u0000text-red-700": 1,
    "visual-utility\u0000text-red-600": 1,
    "visual-utility\u0000text-stone-700": 9,
    "visual-utility\u0000bg-stone-50": 8,
    "visual-utility\u0000text-stone-900": 8,
    "visual-utility\u0000border-stone-300": 1
  },
  "src/components/auth-v2/Logo.tsx": {
    "literal-color\u0000#1c2129": 4,
    "literal-color\u0000#c8623a": 2,
    "literal-color\u0000#E69E66": 2,
    "literal-color\u0000rgba(255, 255, 255, 0.45)": 1
  },
  "src/components/auth-v2/auth-shell.css": {
    "literal-color\u0000#faf8f4": 2,
    "literal-color\u0000#1c2129": 1,
    "literal-color\u0000#e4e2dc": 5,
    "literal-color\u0000rgba(16,34,42,.12)": 1,
    "literal-color\u0000#fff": 3,
    "literal-color\u0000#10222a": 1,
    "literal-color\u0000rgba(16,34,42,.14)": 1,
    "literal-color\u0000#edf5f5": 1,
    "literal-color\u0000#105258": 3,
    "literal-color\u0000#0a3539": 3,
    "literal-color\u0000#4b5b60": 4,
    "literal-color\u0000rgba(16,34,42,.56)": 1,
    "literal-color\u0000rgba(16,34,42,.22)": 1,
    "literal-color\u0000#f2f5f5": 1,
    "literal-color\u0000#f7f9f8": 1,
    "small-type\u0000font-size: 10px": 1,
    "small-type\u0000font-size: 12px": 2,
    "small-type\u0000font-size: 12.5px": 2,
    "decorative-effect\u0000backdrop-filter: blur": 1
  },
  "src/components/home/intake-form.tsx": {
    "unowned-style\u0000style={": 1
  },
  "src/components/icons.tsx": {
    "literal-color\u0000#105258": 111,
    "literal-color\u0000#ffffff": 1,
    "literal-color\u0000#1c2129": 26,
    "literal-color\u0000#f5f8f7": 2,
    "literal-color\u0000#8a9aa0": 14,
    "literal-color\u0000#FFC107": 1,
    "literal-color\u0000#FF3D00": 1,
    "literal-color\u0000#1B8569": 1,
    "literal-color\u0000#1976D2": 1,
    "literal-color\u0000#000": 1,
    "literal-color\u0000#fff": 6,
    "literal-color\u0000#e2543e": 4,
    "literal-color\u0000#6b7d82": 3,
    "literal-color\u0000#262626": 1,
    "literal-color\u0000#d02f2f": 1,
    "literal-color\u0000#f5c542": 1,
    "literal-color\u0000#e0311e": 3,
    "literal-color\u0000#f0c25a": 1
  },
  "src/components/logo.tsx": {
    "literal-color\u0000#105258": 3
  },
  "src/components/marketing/FeatureVisualCard.module.css": {
    "literal-color\u0000rgba(16, 82, 88, .12)": 1,
    "literal-color\u0000#fff": 1,
    "literal-color\u0000rgba(18, 35, 38, .055)": 1,
    "literal-color\u0000rgba(18, 35, 38, .12)": 1,
    "literal-color\u0000#1c2129": 1,
    "literal-color\u0000rgba(16, 82, 88, .3)": 1,
    "literal-color\u0000#105258": 2,
    "literal-color\u0000#647174": 1
  },
  "src/components/marketing/app-frames.module.css": {
    "literal-color\u0000#1f3339": 1,
    "literal-color\u0000#0b1a1e": 2,
    "literal-color\u0000rgba(255,255,255,.08)": 1,
    "literal-color\u0000#000": 2,
    "literal-color\u0000#f6f7f7": 1,
    "literal-color\u0000#7a5a2a": 2,
    "literal-color\u0000#e3f1e6": 1,
    "literal-color\u0000#1f6b3a": 1,
    "small-type\u0000font-size: 12px": 3,
    "small-type\u0000font-size: 11px": 3,
    "small-type\u0000font-size: 11.5px": 1,
    "small-type\u0000font-size: 10.5px": 2,
    "small-type\u0000font-size: 12.5px": 2,
    "decorative-effect\u0000linear-gradient(": 3
  },
  "src/components/marketing/app-frames.tsx": {
    "literal-color\u0000#2418": 1
  },
  "src/components/marketing/auth-convergence.module.css": {
    "literal-color\u0000#172326": 1,
    "literal-color\u0000#105258": 6,
    "literal-color\u0000#0d474d": 1,
    "literal-color\u0000#f4f5f1": 1,
    "literal-color\u0000#e7efeb": 1,
    "literal-color\u0000rgba(16, 82, 88, 0.14)": 1,
    "literal-color\u0000rgba(19, 48, 51, 0.10)": 1,
    "literal-color\u0000rgba(146, 190, 186, 0.27)": 1,
    "literal-color\u0000rgba(226, 237, 229, 0.72)": 1,
    "literal-color\u0000rgba(16, 82, 88, 0.18)": 2,
    "literal-color\u0000rgba(16, 82, 88, 0.22)": 1,
    "literal-color\u0000rgba(255,255,255,.94)": 1,
    "literal-color\u0000rgba(27, 55, 58, 0.035)": 1,
    "literal-color\u0000#faf8f4": 3,
    "literal-color\u0000#10222a": 4,
    "literal-color\u0000#e4e2dc": 10,
    "literal-color\u0000#4b5b60": 7,
    "literal-color\u0000rgba(16,34,42,.025)": 1,
    "literal-color\u0000#0a3539": 5,
    "literal-color\u0000#cfdcda": 1,
    "literal-color\u0000#fff": 5,
    "literal-color\u0000rgba(16, 34, 42, .055)": 1,
    "literal-color\u0000#f2f5f5": 2,
    "literal-color\u0000#cfcbc2": 1,
    "literal-color\u0000rgba(16, 82, 88, .12)": 1,
    "literal-color\u0000#456267": 1,
    "literal-color\u0000rgba(16,82,88,.08)": 7,
    "literal-color\u0000rgba(26,54,57,.07)": 4,
    "literal-color\u0000rgba(16,82,88,.10)": 3,
    "literal-color\u0000rgba(220,235,236,.62)": 1,
    "literal-color\u0000rgba(255,255,255,.88)": 2,
    "literal-color\u0000rgba(255,255,255,.55)": 1,
    "literal-color\u0000rgba(231,239,235,.82)": 1,
    "literal-color\u0000rgba(247,249,247,.92)": 1,
    "literal-color\u0000rgba(255,255,255,.76)": 1,
    "literal-color\u0000rgba(26,54,57,.06)": 2,
    "literal-color\u0000#48666a": 1,
    "literal-color\u0000rgba(146, 190, 186, .20)": 1,
    "small-type\u0000font-size: 12.5px": 1,
    "small-type\u0000font-size: 12px": 2,
    "small-type\u0000font-size: 11px": 2,
    "decorative-effect\u0000radial-gradient(": 3
  },
  "src/components/marketing/hero-orchestration.tsx": {
    "literal-color\u0000#142": 1,
    "unowned-style\u0000style={": 1
  },
  "src/components/marketing/hero-visuals.tsx": {
    "literal-color\u0000#142": 1
  },
  "src/components/marketing/home-hero.module.css": {
    "literal-color\u0000rgba(31, 122, 128, 0.55)": 1,
    "literal-color\u0000rgba(31, 122, 128, 0)": 1,
    "literal-color\u0000rgba(217, 185, 138, 0.22)": 1,
    "literal-color\u0000rgba(217, 185, 138, 0)": 1,
    "literal-color\u0000rgba(243, 246, 245, 0.06)": 2,
    "literal-color\u0000#000": 2,
    "literal-color\u0000rgba(243, 246, 245, 0.22)": 1,
    "literal-color\u0000rgba(243, 246, 245, 0.05)": 1,
    "literal-color\u0000rgba(243, 246, 245, 0.08)": 1,
    "literal-color\u0000#fff": 1,
    "small-type\u0000font-size: 12.5px": 7,
    "small-type\u0000font-size: 11px": 3,
    "small-type\u0000font-size: 11.5px": 7,
    "small-type\u0000font-size: 12px": 1,
    "small-type\u0000font-size: 10.5px": 1,
    "decorative-effect\u0000radial-gradient(": 4,
    "decorative-effect\u0000linear-gradient(": 2
  },
  "src/components/marketing/lexikon/entry-card.tsx": {
    "unowned-style\u0000style={": 1
  },
  "src/components/marketing/lexikon/lexikon-detail.tsx": {
    "unowned-style\u0000style={": 7
  },
  "src/components/marketing/lexikon/lexikon-explorer.tsx": {
    "unowned-style\u0000style={": 2
  },
  "src/components/marketing/lexikon/lexikon-not-found.tsx": {
    "unowned-style\u0000style={": 2
  },
  "src/components/marketing/lexikon/lexikon-sections.tsx": {
    "unowned-style\u0000style={": 2
  },
  "src/components/marketing/lexikon/lexikon.module.css": {
    "literal-color\u0000rgba(255,255,255,.14)": 1,
    "literal-color\u0000rgba(255,255,255,.1)": 2,
    "literal-color\u0000rgba(255,255,255,.06)": 2,
    "literal-color\u0000#e9a487": 1,
    "literal-color\u0000rgba(16, 34, 42, .4)": 1,
    "literal-color\u0000rgba(16, 34, 42, .02)": 1,
    "small-type\u0000font-size: 12px": 7,
    "small-type\u0000font-size: 11.5px": 7,
    "small-type\u0000font-size: 12.5px": 5,
    "small-type\u0000font-size: 10.5px": 1,
    "small-type\u0000font-size: 10px": 1,
    "small-type\u0000font-size: 11px": 1
  },
  "src/components/marketing/marketing.module.css": {
    "literal-color\u0000#0a3539": 5,
    "literal-color\u0000#105258": 13,
    "literal-color\u0000#1b8569": 7,
    "literal-color\u0000#eaf5ee": 1,
    "literal-color\u0000#f4faf6": 1,
    "literal-color\u0000#f7f8f7": 4,
    "literal-color\u0000#ffffff": 9,
    "literal-color\u0000#f2f4f2": 1,
    "literal-color\u0000#171a18": 1,
    "literal-color\u0000#66706a": 1,
    "literal-color\u0000#e4e8e5": 1,
    "literal-color\u0000#d5dcd7": 1,
    "literal-color\u0000rgba(247,248,247,.98)": 1,
    "literal-color\u0000rgba(228,232,229,.9)": 1,
    "literal-color\u0000#3f4943": 5,
    "literal-color\u0000#aeb8b1": 1,
    "literal-color\u0000#fbfcfb": 2,
    "literal-color\u0000rgba(16,82,88,.30)": 2,
    "literal-color\u0000rgba(18,60,42,.14)": 2,
    "literal-color\u0000#303a34": 1,
    "literal-color\u0000rgba(234,245,238,.95)": 2,
    "literal-color\u0000#fff": 27,
    "literal-color\u0000rgba(18,60,42,.08)": 2,
    "literal-color\u0000#eef1ef": 1,
    "literal-color\u0000#59635d": 1,
    "literal-color\u0000rgba(24,48,33,.10)": 1,
    "literal-color\u0000#4f5b53": 1,
    "literal-color\u0000#4d5951": 1,
    "literal-color\u0000#b9d8c4": 5,
    "literal-color\u0000#607067": 1,
    "literal-color\u0000#dcebe1": 2,
    "literal-color\u0000#c5d2ca": 1,
    "literal-color\u0000#bfe8ea": 1,
    "literal-color\u0000#dff2e6": 1,
    "literal-color\u0000#174b50": 5,
    "literal-color\u0000#9fcfd2": 3,
    "literal-color\u0000#465149": 1,
    "literal-color\u0000#8fd0c9": 2,
    "literal-color\u0000#e1d7b8": 1,
    "literal-color\u0000#fffcf2": 1,
    "literal-color\u0000#4e4938": 1,
    "literal-color\u0000#7b5f18": 1,
    "literal-color\u0000#c9d7cf": 1,
    "literal-color\u0000#f1f7f3": 1,
    "literal-color\u0000#0c3f45": 1,
    "literal-color\u0000#0a343a": 1,
    "literal-color\u0000#092d33": 1,
    "literal-color\u0000#eaf4f1": 1,
    "literal-color\u0000rgba(222,240,235,.72)": 1,
    "literal-color\u0000rgba(222,240,235,.5)": 2,
    "literal-color\u0000rgba(217,240,237,.55)": 1,
    "literal-color\u0000rgba(234,244,241,.82)": 1,
    "literal-color\u0000rgba(217,240,237,.22)": 1,
    "literal-color\u0000rgba(222,240,235,.85)": 1,
    "literal-color\u0000#8fd4c9": 1,
    "literal-color\u0000rgba(217,240,237,.14)": 1,
    "literal-color\u0000rgba(234,244,241,.85)": 1,
    "literal-color\u0000#f7f9f7": 1,
    "literal-color\u0000rgba(19,45,30,.06)": 1,
    "literal-color\u0000rgba(255,255,255,.8)": 1,
    "literal-color\u0000#edf0ed": 1,
    "literal-color\u0000rgba(18,60,42,.22)": 1,
    "literal-color\u0000rgba(185,216,196,0)": 1,
    "literal-color\u0000rgb(247,248,247)": 1,
    "literal-color\u0000rgba(255,255,255,.94)": 1,
    "literal-color\u0000rgba(234,245,238,.75)": 1,
    "literal-color\u0000rgba(18,60,42,.055)": 1,
    "literal-color\u0000rgba(0,0,0,.6)": 4,
    "literal-color\u0000rgba(16,82,88,.32)": 1,
    "literal-color\u0000rgba(16,82,88,0)": 2,
    "literal-color\u0000rgba(18,60,42,.26)": 1,
    "literal-color\u0000#66756c": 1,
    "literal-color\u0000rgba(18,60,42,.30)": 1,
    "literal-color\u0000rgba(18,60,42,.32)": 1,
    "literal-color\u0000#9cc8ae": 1,
    "literal-color\u0000rgba(23,107,69,.55)": 2,
    "literal-color\u0000rgba(18,60,42,.28)": 1,
    "literal-color\u0000rgba(18,60,42,.5)": 1,
    "literal-color\u0000rgba(255,255,255,.16)": 1,
    "literal-color\u0000#c9decf": 2,
    "literal-color\u0000rgba(0,0,0,.4)": 1,
    "literal-color\u0000#f0f7f2": 1,
    "literal-color\u0000#114b50": 2,
    "literal-color\u0000#e1efe8": 1,
    "literal-color\u0000#f0f7f3": 1,
    "literal-color\u0000#f5f8f7": 1,
    "literal-color\u0000#1c2129": 2,
    "literal-color\u0000#5f7170": 1,
    "literal-color\u0000#e3eae6": 1,
    "literal-color\u0000#d2ddd7": 1,
    "literal-color\u0000rgba(225,239,232,.85)": 1,
    "literal-color\u0000rgba(28,33,41,.038)": 1,
    "literal-color\u0000rgba(15,74,59,.25)": 3,
    "literal-color\u0000rgba(15,74,59,.10)": 1,
    "literal-color\u0000rgba(15,74,59,.22)": 1,
    "literal-color\u0000rgba(15,74,59,.06)": 1,
    "literal-color\u0000rgba(16,82,88,.45)": 2,
    "literal-color\u0000rgba(15,74,59,.45)": 1,
    "literal-color\u0000#dcebe3": 2,
    "literal-color\u0000#1C2129": 1,
    "literal-color\u0000#dcebec": 1,
    "literal-color\u0000#edf5f5": 1,
    "literal-color\u0000#f4f7f7": 1,
    "literal-color\u0000#57686b": 2,
    "literal-color\u0000#e2e8e8": 1,
    "literal-color\u0000#cfdad9": 1,
    "literal-color\u0000rgba(16,82,88,.5)": 1,
    "literal-color\u0000rgba(10,53,57,.45)": 1,
    "literal-color\u0000#0d4448": 1,
    "literal-color\u0000#8fc0c4": 1,
    "literal-color\u0000#a5cccc": 1,
    "literal-color\u0000rgba(10,53,57,.24)": 2,
    "literal-color\u0000rgba(10,53,57,.06)": 1,
    "literal-color\u0000rgba(10,53,57,.10)": 1,
    "literal-color\u0000rgba(10,53,57,.25)": 2,
    "literal-color\u0000rgba(220,235,236,.9)": 1,
    "literal-color\u0000rgba(220,235,236,.85)": 1,
    "literal-color\u0000rgba(220,235,236,.55)": 1,
    "literal-color\u0000rgba(28,33,41,.035)": 1,
    "literal-color\u0000rgba(0,0,0,.55)": 2,
    "literal-color\u0000rgba(16,82,88,.35)": 4,
    "literal-color\u0000rgba(16,82,88,.08)": 2,
    "literal-color\u0000#eef2f2": 1,
    "literal-color\u0000rgba(10,53,57,.55)": 2,
    "literal-color\u0000rgba(16,82,88,.12)": 1,
    "literal-color\u0000rgba(16,82,88,.04)": 2,
    "literal-color\u0000rgba(10,53,57,.32)": 1,
    "literal-color\u0000rgba(16,82,88,.10)": 3,
    "literal-color\u0000rgba(0,0,0,.45)": 1,
    "literal-color\u0000#ecf5f2": 1,
    "literal-color\u0000rgba(255,255,255,.45)": 1,
    "literal-color\u0000rgba(255,255,255,.1)": 1,
    "literal-color\u0000rgba(255,255,255,.75)": 2,
    "literal-color\u0000rgba(10,53,57,.28)": 1,
    "literal-color\u0000rgba(16,82,88,.16)": 1,
    "literal-color\u0000rgba(10,53,57,.35)": 2,
    "literal-color\u0000rgba(10,53,57,.3)": 1,
    "literal-color\u0000rgba(16,82,88,.4)": 2,
    "literal-color\u0000rgba(10,53,57,.38)": 1,
    "literal-color\u0000rgba(255,255,255,.07)": 1,
    "literal-color\u0000rgba(255,255,255,.9)": 1,
    "literal-color\u0000#fafcfb": 1,
    "literal-color\u0000#9aa8a4": 1,
    "literal-color\u0000rgba(10,53,57,.5)": 2,
    "literal-color\u0000#f0f7f4": 1,
    "literal-color\u0000#eaf4f0": 1,
    "literal-color\u0000#dcebe8": 2,
    "literal-color\u0000#f7f6f0": 1,
    "literal-color\u0000#f3f2ea": 1,
    "literal-color\u0000#e8e5d8": 2,
    "literal-color\u0000#eef4f4": 1,
    "literal-color\u0000#e8f0f0": 1,
    "literal-color\u0000#d5e0e0": 2,
    "literal-color\u0000rgba(255,255,255,.08)": 1,
    "literal-color\u0000#7fc9a8": 1,
    "literal-color\u0000rgba(16,82,88,.06)": 1,
    "literal-color\u0000#0f6a72": 1,
    "literal-color\u0000rgba(16,82,88,.07)": 1,
    "literal-color\u0000rgba(16,82,88,.22)": 1,
    "literal-color\u0000rgba(16,82,88,.14)": 1,
    "literal-color\u0000rgba(16,60,64,.13)": 1,
    "small-type\u0000font-size:12px": 9,
    "small-type\u0000font-size:11px": 8,
    "small-type\u0000font-size:10px": 1,
    "small-type\u0000font-size: 11px": 4,
    "small-type\u0000font-size: 12px": 9,
    "small-type\u0000font-size: 12.5px": 6,
    "small-type\u0000font-size: 10.5px": 1,
    "small-type\u0000font-size: 11.5px": 2,
    "decorative-effect\u0000radial-gradient(": 17,
    "decorative-effect\u0000linear-gradient(": 29
  },
  "src/components/marketing/mkt.module.css": {
    "literal-color\u0000#faf8f4": 1,
    "literal-color\u0000rgba(6, 21, 34, .45)": 1,
    "literal-color\u0000rgba(16,34,42,.03)": 1,
    "literal-color\u0000rgba(255,255,255,.72)": 1,
    "literal-color\u0000rgba(16, 82, 88, .6)": 2,
    "literal-color\u0000rgba(255,255,255,.08)": 1,
    "literal-color\u0000rgba(31,122,128,.45)": 1,
    "literal-color\u0000rgba(217,185,138,.18)": 1,
    "literal-color\u0000rgba(255,255,255,.06)": 2,
    "literal-color\u0000rgba(255,255,255,.12)": 1,
    "literal-color\u0000rgba(255,255,255,.3)": 1,
    "literal-color\u0000#f1d4cf": 1,
    "literal-color\u0000#fff5f3": 1,
    "literal-color\u0000#a12b25": 1,
    "literal-color\u0000#7c5a54": 1,
    "literal-color\u0000rgba(31,122,128,.55)": 1,
    "literal-color\u0000#fff": 1,
    "decorative-effect\u0000radial-gradient(": 3,
    "decorative-effect\u0000linear-gradient(": 2
  },
  "src/components/marketing/premium.module.css": {
    "literal-color\u0000rgba(22, 93, 66, 0.08)": 1,
    "literal-color\u0000#fbfaf7": 1,
    "literal-color\u0000#ffffff": 1,
    "literal-color\u0000rgba(23, 42, 33, 0.45)": 1,
    "literal-color\u0000rgba(23, 42, 33, 0.08)": 1,
    "literal-color\u0000#fff": 5,
    "literal-color\u0000rgba(23, 42, 33, 0.18)": 3,
    "literal-color\u0000rgba(23, 42, 33, 0.3)": 1,
    "literal-color\u0000rgba(23, 42, 33, 0.4)": 4,
    "literal-color\u0000rgba(23, 42, 33, 0.16)": 1,
    "literal-color\u0000rgba(23, 42, 33, 0.48)": 1,
    "literal-color\u0000#eaf0ed": 1,
    "literal-color\u0000rgba(8, 34, 31, 0.34)": 1,
    "literal-color\u0000rgba(23, 42, 33, 0.2)": 1,
    "small-type\u0000font-size: 12px": 3,
    "small-type\u0000font-size: 12.5px": 2,
    "small-type\u0000font-size: 11.75px": 1,
    "decorative-effect\u0000radial-gradient(": 1,
    "decorative-effect\u0000linear-gradient(": 2
  },
  "src/components/marketing/security-section.module.css": {
    "literal-color\u0000rgba(255, 255, 255, 0.94)": 1,
    "literal-color\u0000rgba(230, 242, 238, 0.85)": 1,
    "literal-color\u0000rgba(217, 240, 237, 0.22)": 1,
    "literal-color\u0000rgba(217, 240, 237, 0.5)": 1,
    "literal-color\u0000rgba(220, 235, 236, 0.08)": 1,
    "literal-color\u0000#9fe3d9": 1,
    "literal-color\u0000rgba(0, 0, 0, 0.35)": 1
  },
  "src/components/marketing/trust-section.module.css": {
    "literal-color\u0000rgba(16, 60, 64, 0.16)": 1,
    "literal-color\u0000rgba(16, 60, 64, 0.12)": 1,
    "literal-color\u0000rgba(15, 19, 20, 0.55)": 1
  },
  "src/components/onboard-visuals.tsx": {
    "literal-color\u0000#fff": 1,
    "literal-color\u0000#105258": 7,
    "literal-color\u0000#a3d4c3": 2,
    "literal-color\u0000#eaf4ee": 2
  },
  "src/components/owner-menu.tsx": {
    "literal-color\u0000#105258": 1
  },
  "src/components/shell.tsx": {
    "literal-color\u0000#105258": 1
  },
  "src/components/ui/avatar.tsx": {
    "small-type\u0000text-xs": 1,
    "decorative-effect\u0000rounded-full": 6
  },
  "src/components/ui/badge.tsx": {
    "small-type\u0000text-xs": 1
  },
  "src/components/ui/button.tsx": {
    "small-type\u0000text-xs": 1
  },
  "src/components/ui/tooltip.tsx": {
    "small-type\u0000text-xs": 1
  },
  "src/components/visuals/CardVisual.tsx": {
    "unowned-style\u0000style = {": 1,
    "unowned-style\u0000style={": 1
  },
  "src/config/design-tokens.ts": {
    "literal-color\u0000#0a3539": 1,
    "literal-color\u0000#0d474d": 1,
    "literal-color\u0000#105258": 1,
    "literal-color\u0000#147078": 1,
    "literal-color\u0000#1f7a80": 1,
    "literal-color\u0000#7fb7ba": 1,
    "literal-color\u0000#dcebec": 1,
    "literal-color\u0000#edf5f5": 1,
    "literal-color\u0000#faf8f4": 1,
    "literal-color\u0000#f4f7f7": 1,
    "literal-color\u0000#ffffff": 1,
    "literal-color\u0000#f4ebdd": 1,
    "literal-color\u0000#ecdfc9": 1,
    "literal-color\u0000#d9b98a": 1,
    "literal-color\u0000#10222a": 1,
    "literal-color\u0000#4b5b60": 1,
    "literal-color\u0000#5f6e75": 1,
    "literal-color\u0000#e4e2dc": 1,
    "literal-color\u0000#cfcbc2": 1,
    "literal-color\u0000#a84d29": 1,
    "literal-color\u0000#f7e4da": 1,
    "literal-color\u0000rgba(16, 34, 42, 0.04)": 1,
    "literal-color\u0000rgba(16, 34, 42, 0.08)": 1,
    "literal-color\u0000rgba(16, 34, 42, 0.05)": 1,
    "literal-color\u0000rgba(16, 34, 42, 0.22)": 1
  },
  "src/lib/mailer.ts": {
    "literal-color\u0000#105258": 6,
    "literal-color\u0000#33484f": 2,
    "literal-color\u0000#fff": 2,
    "literal-color\u0000#9aa9ad": 2,
    "small-type\u0000font-size:12px": 2
  },
  "src/lib/notifications.ts": {
    "literal-color\u0000#105258": 2,
    "literal-color\u0000#33484f": 1,
    "literal-color\u0000#fff": 1,
    "literal-color\u0000#9aa9ad": 1,
    "small-type\u0000font-size:12px": 1
  }
}

`````

## design/design-lock.json

`````json
{
  "version": "1.0.0",
  "authority": "Jerry explicitly accepted Atelier 02 and commissioned this release on 2026-09-06.",
  "files": {
    ".github/CODEOWNERS": "344048476ff047355aa71baf270bf7ebe41f418ad90195a32009424cc0670e79",
    ".github/workflows/eh-design.yml": "79881db9c76ed3111d37017ea987cb4561d0758d401a1f64a4e2e756183730e1",
    "DESIGN.md": "5adefb3dd1be1ddd0ccd7825a65d78acaa381ca00b60528937c3b6bc149ab8d7",
    "design/design-debt.json": "272c062b8fedf63def95c347adf45242336ff4667955649c4f4c5e3302de093b",
    "design/design-policy.json": "8858aec4e3d565827a8b744fd8591b1aeaa433cd3dc3ce8bac8447e0dae37881",
    "packages/eh-design/assets/inter-variable.woff2": "0de3908cf5ef213ab1404cc5da94a976faaa886c3479a274a7d66ad80b37c64a",
    "packages/eh-design/assets/logo-full.png": "ca128f0ecfcffc93853f5271453f318be28ed4462850b06072c33afbeb1353cd",
    "packages/eh-design/package.json": "46fdcc913d21cca9abdb515caa916494f6568fddd2a66f32e724c59c8fa79b24",
    "packages/eh-design/src/app.tsx": "e0fd056724bfeb4f6244264c2daba68df73709cb7645bfc7ba2db9a531d8376d",
    "packages/eh-design/src/blocks.tsx": "5f2d07e6883c8958410150192631dc03283d05a31fad164796d48a1cba82935d",
    "packages/eh-design/src/html-style.mjs": "888448eea28f1456f818c59b78412f9305d47562850bb06245ca5d2d2767ac91",
    "packages/eh-design/src/html.css": "9978c2ecea8d5b6a9eee7c7366acaeba962320d258799f943ecd49cc92a39c4c",
    "packages/eh-design/src/html.mjs": "7dde2a71e7eccbe9ddd7888bfb7b8d96a0a91c74e6fd07a2501070abf72d6033",
    "packages/eh-design/src/index.ts": "37791a4d9355acfa00dc616adcfc925c308758062f26715d19fae85a3e6cf5c0",
    "packages/eh-design/src/primitives.tsx": "d90af74e98fc45c3af3acb90134621b226902b6aaa0b3d74c9ab558a2fde6edb",
    "packages/eh-design/src/recipes.tsx": "0b56b2c76d10f031aedc5375922495711e61759a57cda1a99a63ecfbc563931f",
    "packages/eh-design/src/styles.module.css": "5f30129c6597980ccbeeb99f8189cfc982ab38294ea8820dc647901b20d4d32a",
    "packages/eh-design/src/tokens.css": "4358aae0a1bcb0de84b2e97415b4c6f0356212dbdf67b901590f9dc90cbfc191",
    "packages/eh-design/src/tokens.json": "b399d3041129b93605a0b0a3541424b7ca251032f1b07dbd2bee59289c417e35",
    "packages/eh-design/src/tokens.ts": "afc13c9121be6bf738635eaad8faa17150d27fb12984de9e964047a7e403a5f0",
    "scripts/eh-design-check.mjs": "2d4920188c4e961087b75543b5165c48d5d46ef2faa8f11dc33a598f2ac4aade",
    "scripts/eh-design-check.test.mjs": "dbfe6716678ecbad9bf3b1466326f21e8083a78a567fe467e3a21ea32a5b4287",
    "scripts/eh-design-generate.mjs": "55fd71312a134e475c25043da10d11f93ad0ae310310261f153750593dc543f3",
    "scripts/eh-design-seal.mjs": "7be13b011f7cf28530e46d65089b514b4158d036471f768400e5b824e5214024",
    "scripts/eh-design-sync.mjs": "b33e7f99b92b7a717dd6a8794a78ac7d4d2e962553888783c9e416daa1674629",
    "src/app/app/homeowner.module.css": "a483bea8f8ae24cd74dddf79da6fd556217559aa659e532961d972c695877d80",
    "src/app/design-system.css": "234971f6eeb51a6f6c96fb4e3b73190e159944d7a7ed9d371a5d38874e45c9bd",
    "src/app/globals.css": "4721b8a3af2685c2fbd629be5b2916d643fd0b09f1907f205df791d51818841a",
    "src/app/pro/provider-workspace.module.css": "7b718c05d6a19d7dcb8bdb5b773267538ca0ca0a34645f8228587329adfb706d",
    "src/components/marketing/home-hero.tsx": "3fc1c92bc3d907906d0d98997f3b161090e760f56e1e71cc09c466dce003cf05",
    "src/components/marketing/mkt.module.css": "58a850da9f437dd328fca9b5780abcbcde574829ee006ff3d4cd261127adcf7c",
    "src/components/marketing/site-shell.tsx": "fa9bf21cc77ba7da421b493ef72c555547317bd40e800c4dce5a12b0bc9aa0b4",
    "src/components/marketing/tokens.css": "7cd827cb75fceabf3222b1420dce2524cf1e22789d799be55eb001d3bb4da88b",
    "src/components/marketing/ui.tsx": "b679a29758603d39af5eaab8138d27b3df46de5ef6f12b97acce6b8fd6876039",
    "src/design-system/index.ts": "c5880f7f92770415c9a60609a9c6bd927e44217893bb16f81469b0231d2f9ab7"
  }
}

`````

## design/design-policy.json

`````json
{
  "version": "1.0.0",
  "protected": [
    "packages/eh-design/",
    "design/design-policy.json",
    "design/design-debt.json",
    "design/design-lock.json",
    "scripts/eh-design-check.mjs",
    "scripts/eh-design-check.test.mjs",
    "scripts/eh-design-seal.mjs",
    "scripts/eh-design-generate.mjs",
    "scripts/eh-design-sync.mjs",
    ".github/workflows/eh-design.yml",
    ".github/CODEOWNERS",
    "DESIGN.md",
    "src/design-system/",
    "src/components/marketing/ui.tsx",
    "src/components/marketing/tokens.css",
    "src/components/marketing/mkt.module.css",
    "src/components/marketing/home-hero.tsx",
    "src/components/marketing/site-shell.tsx",
    "src/app/globals.css",
    "src/app/design-system.css",
    "src/app/app/homeowner.module.css",
    "src/app/pro/provider-workspace.module.css"
  ],
  "ownedStyleFiles": [
    "src/components/marketing/tokens.css",
    "src/components/marketing/mkt.module.css",
    "src/app/app/homeowner.module.css",
    "src/app/pro/provider-workspace.module.css"
  ]
}

`````

## docs/ARCHITECTURE.md

`````markdown
> **Aktueller Designvertrag · 2026-09-06:** Jerry hat Atelier 02 ausdrücklich freigegeben. Verbindlich sind DESIGN.md, packages/eh-design und der Skill SIN-EH-design. Eigenständige Änderungen am Markenstil sind verboten. Vollständige Übergabe: docs/brand/system/HANDOFF.md; kompletter Quelltext: docs/brand/system/SOURCE.md. Frühere Statusangaben zu noch offenen Stilentscheidungen sind historisch. Restmigration: EH-BRAND-05-WEB, -APPS, -CRM, -HUB. Unternehmensidentität bleibt docs/COMPANY_IDENTITY.md (Gina Inhaberin/Geschäftsführerin, Jeremy Entwickler).

# Einfach Hausen — Architektur-Grundsätze

Diese Datei beschreibt die langlebigen Produktbeziehungen hinter der bewusst einfachen Oberfläche.

## Oberstes Prinzip

Komplexität gehört in die Technik, nicht in die Benutzeroberfläche. Ein Eigentümer soll immer in Alltagssprache starten können: **Was möchtest du erledigen?** Ein professioneller Anbieter hat **ein Konto** und erweitert darin seine Tätigkeiten und Leistungen.

## Öffentliche Website-Architektur

Die Marketing-Website ist keine zweite Produktarchitektur. Sie erklärt die vorhandenen Produktpfade und führt anschließend in dieselben Owner-/Provider-Flows. Die Top-Level-Navigation bleibt bewusst kompakt; fachliche Tiefe liegt darunter:

- `Leistungen` → Megamenü / Mobile Disclosure → 12 kanonische Servicebereiche.
- `src/components/marketing/service-catalog.tsx` hält Slugs, Titel, Kurztexte, typische Situationen und SEO-Copy als zentrale Quelle.
- `src/app/leistungen/[slug]/page.tsx` und `ServiceDetailPage` bilden den gemeinsamen Service-Archetyp; `/leistungen/heizung` bleibt als kompatible statische Route im selben Archetyp.
- `/beratung`, `/notfall`, `/versicherung` und `/immobilienverkauf` sind öffentliche Erklärschichten für existierende App-Funktionen, keine separaten Workflows.
- Sitemap, Navigation und Visual Canonicals werden aus bzw. gegen diese öffentliche IA geprüft.

Die visuelle Grenze bleibt `DESIGN.md` + `--eh-*`. Website-Optimierung darf Komposition, Hierarchie, Typografie, Spacing, responsive Verhalten und Accessibility verbessern, aber keine zweite Designsprache oder Rebrand-Tokens einführen.

### Visuelle / Präsentations-Source-of-Truth

Für T-0165 gilt die Kette **Notion App Design → `DESIGN.md` → `docs/PRESENTATION_BRAND.md` → `presentation/premium/brand.config.json` → `presentation/premium/deck.html`**. Notion ist visuelle Evidence, nicht automatisch fachliche Produktspezifikation. Änderungen am App-Design müssen daher auch gegen Presentation Brand und Präsentation geprüft werden; Owner und Pro bleiben auf derselben hellen visuellen Foundation.

## Kernmodell

![Plattformarchitektur](diagrams/platform-architecture.svg)

[Interaktive Architektur öffnen](diagrams/platform-architecture.html)

Die Immobilie ist ein eigener Datensatz. Sie gehört nicht technisch für immer zu einem einzelnen User. `property_ownerships` bildet den zeitlichen Eigentumsverlauf ab.

## Eigentümer-Serviceflow

![Eigentümer-Serviceflow](diagrams/homeowner-service-flow.svg)

[Interaktiven Serviceflow öffnen](diagrams/homeowner-service-flow.html)

## Anbieter: ein Login, flexible Tätigkeiten

Professionelle Nutzer verwenden immer denselben Provider-Zugang. Tätigkeiten sind relationale Kategorien und keine getrennten Login-Typen:

- Handwerker
- Dienstleister
- Immobilienmakler
- Gutachter / Sachverständiger
- Energieberatung
- Hausverwaltung

Ein Unternehmen kann mehrere Kategorien gleichzeitig aktivieren und später ändern. Konkrete Handwerksleistungen liegen separat in `provider_service_offerings` und werden für das Matching verwendet.

## Hausakte und Historie

Hausbezogene Daten hängen nach Möglichkeit an `property_id`:

- Aufträge
- Hausanlagen
- Wartungen
- Haus-Historie
- hausbezogene Ansprechpartner
- Anbieter-Einladungen
- Eigentumsübergaben

Abgeschlossene Plattformaufträge werden automatisch in die Haus-Historie übernommen. Frühere Arbeiten können manuell mit Kosten, Garantie, Wartung, Ansprechpartner, Vorher-/Nachher-Fotos und privaten Dokumenten ergänzt werden.

## Eigentümerwechsel

Eine Übergabe erzeugt **keine neue Kopie des Hauses**. Die bestehende Immobilie bleibt erhalten:

1. bisherige aktive Eigentümerschaft wird beendet,
2. neue `property_ownerships`-Zeile wird angelegt,
3. Haus-Historie bleibt am selben `property_id`,
4. hausbezogene Anlagen, Wartungen und Ansprechpartner gehen mit,
5. private alte Nachrichten, Zahlungen und persönliche Kommunikation werden nicht übertragen.

## Zahlungs-Lifecycle

![Zahlungs-Lifecycle](diagrams/payment-lifecycle.svg)

[Interaktiven Zahlungs-Lifecycle öffnen](diagrams/payment-lifecycle.html)

## Rechnungen

Der ausführende Partner kann direkt am Auftrag eine Rechnung erstellen und senden. Rechnungen enthalten Rechnungsnummer, Leistungs-/Rechnungsdatum, Zahlungsziel, Rechnungssteller/-empfänger, Positionen, Netto, Umsatzsteuer und Brutto. Der Eigentümer erhält die Rechnung in seiner Dokumentenansicht. Bei eingerichtetem Stripe Connect ist direkte Zahlung möglich; Einfach Hausen behält **0 % Auftragsprovision**.

## Beratung und Notfall

Beratung und Auftrag sind getrennte Absichten. Eine Beratung verbindet zunächst nur mit einem passenden Menschen. Notfallanfragen berücksichtigen zusätzlich aktuelle Bereitschaft, Entfernung, Qualifikation, Bewertung und hinterlegten Notfallzuschlag. 24/7-Anbieter und Anbieter mit eigenen Notfallzeiten verwenden dasselbe Partnerkonto.

## Datenschutz-Dataflow

![Hausakte und Datenschutz](diagrams/property-privacy-dataflow.svg)

[Interaktiven Datenschutz-Dataflow öffnen](diagrams/property-privacy-dataflow.html)

## Datenschutz und Freigaben

Anbieter sehen nicht automatisch die Hausakte. Zweckgebundene Freigaben liegen in `property_shares` und enthalten:

- Immobilie
- Eigentümer
- Anbieter
- Zweck
- explizite Berechtigungen
- Freigabezeit
- Widerruf

Beispiel Verkauf: Ein Makler sieht den Eigentümerkontakt und eine begrenzte Objektzusammenfassung erst nach **Kontakt freigeben**. Rechnungen, Versicherungen, private Nachrichten, Zahlungsdaten und vollständige Dokumente bleiben gesperrt.

## Verkauf, Bewertung und Makler-Matching

Immobilienbewertungen sind eigene Datensätze in der Hausakte. Bei Verkaufsinteresse wird ein `sale_lead` erzeugt. Makler hinterlegen Suchprofile für Region, Immobilientyp, Kaufpreis, Wohn-/Grundstücksfläche, Wohnen/Gewerbe und Spezialisierungen. Matching erzeugt nachvollziehbare Passungswerte; Kontaktdaten werden erst nach Eigentümerfreigabe sichtbar.

Leadstatus sind messbar: vorgeschlagen → Kontakt freigegeben → Interesse → Besichtigung → Auftrag → verkauft bzw. abgelehnt/widerrufen.

## CRM- und Outreach-Grenze

Die Plattformanwendung und das Akquise-/Outreach-Control-Plane sind bewusst getrennt, aber arbeiten auf einem gemeinsamen fachlichen Lead-Lifecycle:

- `einfach-hausen` besitzt Nutzer/Provider-Konvertierung, plattforminterne CRM-Referenzen und den ursprünglichen SQLite-Leadbestand.
- `einfach-hausen-crm` besitzt die standalone Operator-/Agent-Oberfläche auf `crm.einfachhausen.de`, Cloudflare-D1-Queue, Dedupe, Lease-Claims, Contact-History, Inbox und Follow-ups.
- Generische Recherche-/Outreach-/Connectorlogik bleibt in den gemeinsamen SIN-Fähigkeiten und wird nicht in einem der beiden Produktrepos kopiert.
- Während der initialen D1-Konvergenz wird der bestehende Haupt-App-Leadbestand idempotent in D1 synchronisiert. Unbekannte Kontaktfreigabe bleibt unbekannt; `do_not_contact` bleibt fail-closed.

Agents dürfen daraus **keine zwei konkurrierenden CRMs** machen. Repository-Ziele und aktuelle Fortsetzung stehen jeweils in `docs/NEXT_AGENT.md` und dem kanonischen `.sin-gpt-web`-Taskplan des Repos.

## Technische Vervollständigung v2 (historischer Planungsstand)

Hinweis (2026-08-29): Dieser Abschnitt beschreibt den historischen v2/HA-Planungsstand (T-0100..T-0131, T-0166 Supabase-Migration, T-0167 Capacitor). Die Migrations-/Release-Tasks wurden nie ausgeführt und sind nicht Teil des aktuellen Taskplans; maßgeblich ist die kanonische `.sin-gpt-web`-Datenbank. Technische Grenzen des damaligen Plans:

- **Onboarding/account lifecycle:** homeowner and partner first-run journeys plus recovery/session revocation remain on the existing identity model.
- **Notification pipeline:** business transactions emit a durable, versioned outbox event; dispatch/retry/channel adapters and user-visible inbox state consume that event idempotently.
- **Matching quality:** the existing matcher gains privacy-safe decision traces, freshness/capacity rules and deterministic benchmark fixtures; monetization remains excluded from ranking quality.
- **Trust/reviews:** reviews are derived only from verified completed service relationships, with moderation/audit and truthful low-sample aggregates.
- **i18n/a11y/performance:** typed locale boundaries, WCAG-critical shared interaction rules and measurable CWV/server budgets become release gates rather than one-off audits.
- **Security/observability:** adversarial regression, supply-chain gates, structured redacted correlation and SLO probes reuse the current OCI/Next.js stack.
- **Feature flags/admin/privacy:** minimal server-authoritative flags, one restrained admin operations console, and authenticated export/request workflows avoid a second control plane.
- **Release proof:** T-0129 production-style browser E2E and T-0130 deterministic visual regression converge into T-0131 final technical completion.

Externe Blocker: siehe `docs/EXTERNAL-BLOCKERS.md` (nur verifizierte Fakten).

## Authentifizierungsarchitektur — Deep-Research-Konvergenz T-0168

Die Zielarchitektur für geschützte Owner-/Provider-Flächen ist serverautoritativ:

- **Supabase ist die einzige Produktions-Identity-Authority.** Browser-Sessionzustand darf UI steuern, aber keine Produktionsberechtigung erteilen.
- `currentUser()`, `requireUser()` und `requirePro()` müssen auf eine konsistente serverseitig verifizierte App-Identity konvergieren.
- `mh_session`/SQLite-Auth ist nur als **expliziter Local-Dev-Fallback** zulässig. Es gibt keinen stillen Fallback von Supabase auf lokal.
- Ein Local-Auth-Modus in Produktion muss **fail closed** enden.
- `AuthContext` ist UI-State und darf weder gültige Server-Autorisierung überschreiben noch geschützten Zugriff gewähren.
- Server Actions autorisieren vor jeder sensiblen Mutation erneut.
- Die Zuordnung zwischen Supabase-Subject und bestehendem Application-User ist explizit zu modellieren; `supabase user.id == app users.id` darf nicht ungeprüft angenommen werden.

```text
Production
  Supabase verified identity
    -> AppIdentity
    -> requireUser()/requirePro()
    -> protected Server Components / Route Handlers / Server Actions

Development
  AUTH_MODE=supabase    -> gleiche Semantik wie Produktion (Supabase Session, serverseitig verifiziert)
  AUTH_MODE=local       -> mh_session/SQLite nur wenn NODE_ENV != production

Production + AUTH_MODE=local -> fail closed
```

Die vollständigen Forschungs-, Test- und visuellen Acceptance-Regeln stehen in [`T0168_DEEP_RESEARCH.md`](T0168_DEEP_RESEARCH.md).

## Produktions-Infrastruktur — OCI + SIN Supabase OSS

Zielproduktion ist **Multi-User auf OCI**. Hochverfügbarkeit wird nur dort als verifiziert bezeichnet, wo Redundanz, Backup/Restore und Failover tatsächlich nachgewiesen sind (aktuell: nicht nachgewiesen):

- OCI-VM als Runtime hinter Cloudflare Tunnel
- **SIN Supabase OSS auf OCI** als Auth-Autorität (`AUTH_MODE=supabase`, serverseitige Session-Verifikation); Supabase Cloud ist nicht Teil der Zielarchitektur
- **App-Datenbank: SQLite + WAL via `better-sqlite3`** (`DATABASE_PATH`) — verifizierter Laufzeitstand in Produktion; ein Postgres-/Storage-Adapter existiert im Code nicht (Stand 2026-08-29)
- `private/`/`uploads/` als persistente lokale Verzeichnisse per Symlink
- Local-Auth in Produktion fail-closed
- Kestra für geplante Checks
- OmniRoute für optionale Assistenzfunktionen
- Stripe/Connect für Abos und Zahlungen

Der Code- und Agentenpfad ist nach dem Übergabe-Release **GitHub → OCI-VM**. Mac-M1 bleibt Source/Release/Recovery und ist nicht mehr der kanonische Worker-Host. Direkte Working-Tree-Kopien vom Mac nach OCI sind verboten.

Eine Migration SQLite → Supabase Postgres wurde geplant (T-0166), aber nie ausgeführt; der laufende Code kennt keinen Postgres-Adapter. Begriffe wie **HA**, **PITR** oder **Failover** gelten erst nach frischem OCI-Evidence für die tatsächlich betriebene Konfiguration.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0043`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen und vor allem App und Website auf Produktionsqualität verbessern
- Resume rule: product-completion v2 is T-0100..T-0131; continue the highest-priority eligible canonical task (currently T-0100) and do not create a competing roadmap.
- Taskplan sync: `pass`
- Synchronized at: `2026-08-26T03:34:55+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-31T20:53:01+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-31T20:53:03+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-31T20:52:53+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-31T20:52:54+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-22T16:24:18+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-22T17:06:16+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0200
updated: 2026-08-30T04:10:43+00:00
actor: local-agent
evidence-sha256: 425e861d61478080b23cc52ad6b64973eb901e909bbe35dd7fb24a555e299358
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0201
updated: 2026-08-30T04:29:48+00:00
actor: local-agent
evidence-sha256: c5758386de9a32943594941ee15b2faf7dd48bcd822565e0419448383e33c180
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0202
updated: 2026-08-30T04:39:54+00:00
actor: local-agent
evidence-sha256: 0bc75649da580b92e8c385c0ce01f150f9b48f18b1ac0d2c9ee40525373e504f
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0203
updated: 2026-08-30T04:59:52+00:00
actor: local-agent
evidence-sha256: b734c3298856af57db7cbd01c11010da44ffcc25472c8142ae1011378a1a4699
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0204
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: 26d2c37b44b0e2ecdd412fa38e9987742b09de7fdb3d65324b840eee1997f5d8
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0205
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: f1288185ef3bec19c87d3ccaf8e935f8a33480e8db7f734bae58d6874f3a4d43
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0042
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: b0522c720f2d26ef171afa4f8b0bd77eb82cd987694ae7791144c8df2c9124fd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0043
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: 7690208a2287a2d7d24bc2b266c299ac0cdbdaac3e76839323fb142c4ea23138
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0049
updated: 2026-08-31T20:52:49+00:00
actor: local-agent
evidence-sha256: 0d6781d978ed15bc779a17b686785e5efe3810adb2563c2731c51acc8f2f82c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0157
updated: 2026-08-31T21:16:05+00:00
actor: local-agent
evidence-sha256: 7f99e3ef8bfd11d211e6dbda80fa766914a185971e4f6883515209aba957fb5f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0160
updated: 2026-08-31T22:25:51+00:00
actor: local-agent
evidence-sha256: a0374312071e4a6d50a86e2706a720cb563cff292dd03c20102c6c0ac8b63098
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0161
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: 8347892ea96120456d7b66b9aba1440561a66d689fce427bda41928e3e8003b4
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0162
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: ff5ccd0484ed2266c6ce264e4b9f21b41f1bd97f7e8c73ff4c98e9216edf19cd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0163
updated: 2026-08-31T22:56:47+00:00
actor: local-agent
evidence-sha256: fb1882e2df32385413315728fdb2731a84376c39873250aa2cf0335a2c913c98
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0154
updated: 2026-09-01T00:56:58+00:00
actor: local-agent
evidence-sha256: 83e5ed487aff86dee8b825d9f06d859654d292349ec6538442ac1f725c3dbe1b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0152
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 75fc109f1509113951e589eae987093b5e6ae117d9fd29e758a6c673897685d3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0153
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 08da5c23cd9a4bb84512af6dc432989154d9da35f011f18bf9ef15fb7a650193
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0155
updated: 2026-09-01T01:47:14+00:00
actor: local-agent
evidence-sha256: 02c7cb988ff4f3990fdd17d9a4772d50152245ab2becbbd66f768202ec391bc8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0156
updated: 2026-09-01T03:30:24+00:00
actor: local-agent
evidence-sha256: 994ea2169cfa09d65fa7fa4e2b29c4f8e02de905c613b7d24ebd946ec7c7d4b0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0115
updated: 2026-09-01T03:30:25+00:00
actor: local-agent
evidence-sha256: ef7edcae3cf6bd3ad470c34205fa815916c109e4709b0298ac4f0a4068e48968
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0111
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: 87e072d5e2c574dbf26ce3c530c85fb1d6a5a871034892d6adf8dc40ec8a3ae9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0112
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: f193fa11049f920c888558209118f7b7592a95a4e86ace0c92274995b906db8d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0138
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: 0ab111892a30d55ad46e7f6232b32f64656dee72cc4b9937613c3f2a3d9c925a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0142
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: bceab63e963dd389c859027e3e4221a6a50386a99dfad656912ed9445f0038fe
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0113
updated: 2026-09-01T13:55:36+00:00
actor: local-agent
evidence-sha256: 07b6275707f950b590ed96ec928ab841e01791e4761d591f616d20f0fc5e80cc
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0114
updated: 2026-09-01T13:57:24+00:00
actor: local-agent
evidence-sha256: db6e60f478405d43372683fbf7d760ddb32ef5fb7c5c608ca152e3115cca052b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0116
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: cfbef8fb88b67a309e81fa923357ecfc6f2a6808005e9d697e457401171f9ce5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0117
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: 32b178026b6612aa0bc5ea8813b094a8e7b84293e8c9f8a5706a02435767ed03
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0136
updated: 2026-09-01T18:06:52+00:00
actor: local-agent
evidence-sha256: 766040d87c6e2dbae195442af395ea3b2fddc2c114f4fbe4a7963f3a4d6463ea
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0147
updated: 2026-09-01T19:19:57+00:00
actor: local-agent
evidence-sha256: 4149908d9dda7f1397ce06f9aadccce2ae5c038d469a1adeb8e1e3f02d0a2ff9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0118
updated: 2026-09-01T20:51:22+00:00
actor: local-agent
evidence-sha256: c55fee22cf93a7578d26053014ef8e42b4a7534775e5e1a5d1fd60053eb1d405
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0119
updated: 2026-09-01T22:14:14+00:00
actor: local-agent
evidence-sha256: 0acd76be267c23dd81333e674d9c0eee29d42c3f07154718697fae9f793a26b6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0210
updated: 2026-09-02T23:18:15+00:00
actor: local-agent
evidence-sha256: 80f9aad504a029dbe80faed7a0cf4c152de5bf88a4b1880edf60f754211dea51
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0211
updated: 2026-09-02T23:18:41+00:00
actor: local-agent
evidence-sha256: 60f232b4e4d8bb71c603011e8a96ba47b0b2b4f04b45106ed5ab759dbc9d69a0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0120
updated: 2026-09-02T23:49:07+00:00
actor: local-agent
evidence-sha256: 73903ba5ee89d8c893c1f1fd2a10d42aeeba247966ba2045494555aa353d28e5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0121
updated: 2026-09-02T23:56:26+00:00
actor: local-agent
evidence-sha256: 01f5f6cb64432cac1825787493c591f7d4d2c263eff4860738564f29f1259336
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0122
updated: 2026-09-03T00:15:44+00:00
actor: local-agent
evidence-sha256: dca081a3188c1676492cf6cfd60f6b5d044444af48a818ae6173c43636c209fb
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0131
updated: 2026-09-03T12:19:04+00:00
actor: local-agent
evidence-sha256: 95b14cf53c5f2030d04c08f2b5dd9dfbb343623139fc5ce9e720d09533c6be38
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0123
updated: 2026-09-03T00:23:19+00:00
actor: local-agent
evidence-sha256: d05fdcb413b5af3832a99bb11e2726eab2c7c3682e25b7c74203edb5e4bd3544
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0124
updated: 
actor: local-agent
evidence-sha256: 7b56927949e37e438aa734d75f4b3eed9bd85a667118aa51838decfaccecfcb7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0129
updated: 
actor: local-agent
evidence-sha256: a2028224c451c9d493976891e8e4061d8fbe7cbe6e5155f21be5f251a13b16be
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0130
updated: 
actor: local-agent
evidence-sha256: db4bfd0327fb8cd3dcc011d26631b8b064c1a6b0952880d4fbb8d34877b61b84
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0125
updated: 
actor: local-agent
evidence-sha256: 24ead3c1a5c517e9724996338b7426ad3e8e2c18cd519e08d1f683f72f4d788b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0126
updated: 
actor: local-agent
evidence-sha256: 1acbbc8c9d9ec3b87035c8d0521fa2c3622fa697e6d719310f61795b15fda6e8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0127
updated: 
actor: local-agent
evidence-sha256: 0640af1175d4cd871685513652419379eec835cf543aed5dfc69b0bfcadc4a29
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0128
updated: 
actor: local-agent
evidence-sha256: 52a6748748dfe2d958322ba6584bcd9e8cd8284ed731054bf7f3d48948bf4d4a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-01
updated: 2026-09-05T02:00:41+00:00
actor: chatgpt-web
evidence-sha256: 223ddabf850fcb56047dafd0834c4648fe0356286d14630d790002d451660459
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-02
updated: 2026-09-05T02:19:47+00:00
actor: chatgpt-web
evidence-sha256: d3169b9afa465be4ab22588b73903be33178b28010810633f5fb6546dc51f563
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-03
updated: 2026-09-05T04:33:10+00:00
actor: local-agent
evidence-sha256: b9300da9b1e348fc386da08fda11e75c105f6db589d60a0f190ae0af25041437
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-04
updated: 2026-09-05T06:26:03+00:00
actor: chatgpt-web
evidence-sha256: 0bf6db00102a87441e641b95f92d629df17ac5aa3144da80eeb67f83cab48460
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-05
updated: 2026-09-05T09:09:00+00:00
actor: chatgpt-web
evidence-sha256: e072648f313eb7d38b0daa3a917b5f8b9cfbee90f62754f8cef486aa6b258c03
-->

## EH-BRAND — Operator-Auftrag vom 06.09.2026

Die Markenstudie liegt unter design/brand-study/ und ist unabhängig von Next-App-Routen, Auth und Backend. Ein Node-Server bindet nur 127.0.0.1 und liefert ausschließlich explizit erlaubte Studien-/Logo-/Font-/Bilddateien. Keine Freigabe des Repository-Verzeichnisses per allgemeinem Dateiserver. Kanonischer Taskplan bleibt die bestehende SIN-Datenbank in /home/ubuntu/dev/einfach-hausen; Dokumente und Issues sind Verweise, keine neuen Statusautoritäten.

- Spezifikation: `docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md`
- Ausführungsplan: `docs/superpowers/plans/2026-09-06-einfachhausen-brand-system.md`
- Handoff: `docs/brand/HANDOFF.md`
- Vollständiger Zielquelltext: `docs/brand/SOURCE_PACKET.md`
- Tasks: EH-BRAND-01 bis EH-BRAND-06; vorhandenes T-0151 und Issue #33 berücksichtigen.
- Ausführung: `/home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906`, Branch `design/einfachhausen-brand-system-20260906`, Node 22.23.0.


## EH-BRAND — Korrektur: Atelier 02 (2026-09-06)

Der Nutzer hat die drei Stilproben aus PR #40 ausdrücklich verworfen. Deren technische 27/27-Prüfung ist keine visuelle Freigabe. Root Codex gestaltet und implementiert die neue Richtung persönlich; keinen weiteren Prime/bai-Dispatch aus alten Abschnitten ableiten. Neuer Arbeitsstand: `design/einfachhausen-brand-atelier-20260906`, Workspace `/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906`. Konzept, vollständige Nutzerkorrektur und Plan: `docs/brand/ATELIER_02.md`; aktuelle Übergabe: `docs/brand/HANDOFF.md`; vollständige Quellen: `docs/brand/ATELIER_02_SOURCE.md`; bedienbare Vollansicht: `design/brand-atelier/preview.html`. EH-BRAND-03 bleibt in Arbeit, die neue Richtung wurde noch nicht vom Nutzer bewertet. Genau nächste Markenaktion: diese neue Vollansicht besprechen und tatsächliches Nutzerfeedback dokumentieren. EH-BRAND-04..06 folgen erst der Richtungsentscheidung; kein Merge/Deploy. Ältere Empfehlungen/Dispatch-Anweisungen sind für diese Markenwelle historisch. Andere laufende Arbeitswellen bleiben erhalten.

`````

## docs/NEXT_AGENT.md

`````markdown
> **Aktueller Designvertrag · 2026-09-06:** Jerry hat Atelier 02 ausdrücklich freigegeben. Verbindlich sind DESIGN.md, packages/eh-design und der Skill SIN-EH-design. Eigenständige Änderungen am Markenstil sind verboten. Vollständige Übergabe: docs/brand/system/HANDOFF.md; kompletter Quelltext: docs/brand/system/SOURCE.md. Frühere Statusangaben zu noch offenen Stilentscheidungen sind historisch. Restmigration: EH-BRAND-05-WEB, -APPS, -CRM, -HUB. Unternehmensidentität bleibt docs/COMPANY_IDENTITY.md (Gina Inhaberin/Geschäftsführerin, Jeremy Entwickler).

# NEXT AGENT — Handoff & Handback

**Stand:** 2026-09-05 (Abend)
**Kanonischer Abschlussstand:** Public Website Finish auf `main`; EH-01..EH-05 abgeschlossen. **Offen: Branch `feat/lexikon-enterprise-redesign` → PR → Merge nach Repo-Verifikation auf OCI-VM.**

## 0. Aktueller Kontinuationspunkt (zuerst lesen)

Operator-Anforderung (2026-09-05): „Lexikon-Seite und Unterseiten wirken nicht enterprise/überzeugend; Pro-Designer-Modus, kräftiges Motion-Design, fehlende Seiten ergänzen, Docs + Handoff.“

Umgesetzt auf Branch **`feat/lexikon-enterprise-redesign`** (Details: `docs/LEXIKON.md`):

- `/lexikon` → Explorer-Archetyp: Hero mit Wort-Stagger + Parallax-Kartenstapel, Suche (`/`-Shortcut, Synonyme), Sticky-Register (7 Bereiche + A–Z), Layout-animiertes Raster, Bereichs-Bento, „So nutzt du das Lexikon“.
- `/lexikon/[begriff]` → Entscheidungs-Archetyp: Lesefortschritt, Breadcrumb inkl. Kategorie, Relevanz-Badge, sticky „Auf einen Blick“-Panel (Kennzahlen + Gauges + Wann handeln), Scroll-Spy-TOC, nummerierte Blöcke, gescrubbte Ablauf-Timeline, abhakbare Prüfpunkte mit Anliegen-CTA, verwandte Begriffe, Vor/Zurück-Navigator.
- **Neue Seiten:** `/lexikon/kategorie/[kategorie]` (7 Stück) und `src/app/lexikon/not-found.tsx`.
- **Inhalt:** 4 → 18 Einträge, 7 Kategorien, neues Modell `src/lib/lexikon.ts` (Relevanz, Stufen, Kennzahlen, Synonyme, Verknüpfungen) mit Build-Zeit-Integritätsprüfung.
- Sitemap erweitert; JSON-LD `DefinedTermSet` / `DefinedTerm` / `ItemList` ergänzt.
- Design-System unangetastet: nur `--eh-*`-Tokens, CSS-Module, kein neuer Token-Satz, keine Gradients/Glas/Stripes. `motion/react` (bereits Dependency) ergänzt die GSAP-Schicht für Zustands-/Layout-Motion.

**Verifiziert (Sandbox/Klon):** `tsc` PASS, `eslint` PASS (inkl. `react-hooks/set-state-in-effect`), `next build` PASS (18 Begriffs- + 7 Kategorieseiten SSG), SSR-Smoke 200/404 inkl. Umlaut-Slug `lüftungsanlage`.

**Noch NICHT ausgeführt (fehlende Native-Deps in der Sandbox):** `npm run build` im Repo-Kontext, `test:public-site`, `test:visual`, `test:a11y`, `test:responsive`, `test:e2e`.

### Nächste Aktion (genau eine)

Auf OCI-VM: Branch auschecken → `npm ci && npm run lint && npm run build` → `npm run test:public-site && npm run test:public-nav` → `npm run test:visual:update` (Lexikon-Baselines bewusst neu) → `npm run test:visual && npm run test:a11y && npm run test:responsive` → PR mergen. Bei einem Fehler: Evidenz in den PR schreiben, nicht neu designen.

Danach gilt wieder: keinen weiteren Website-Redesign-Track ohne reproduzierbaren Acceptance-Fehler oder explizite Operator-Anforderung starten.

## 1. Was ist fertig und frisch verifiziert? (Stand main, 2026-09-05)

- Public Website: bestehendes Design-System beibehalten, kein Rebranding.
- Desktop-Megamenü + mobile Leistungs-Disclosure mit allen 12 Leistungsbereichen.
- 12 Service-Detailrouten aus `service-catalog.tsx` + gemeinsamem `ServiceDetailPage`-Archetyp.
- Produkt-Erklärseiten: `/beratung`, `/notfall`, `/versicherung`, `/immobilienverkauf`.
- Discovery-Finish auf Startseite, Hilfe, Hausakte, Eigenheimbesitzer, So funktioniert's und Partner.
- Sitemap/Metadata/Structured Data für die neuen öffentlichen Flächen.
- `npm run build`: PASS, 115/115 statische Seiten (main). Mit Lexikon-Branch: +14 Begriffe, +7 Kategorien.
- `npm run test:public-site`: PASS (main).
- `npm run test:public-nav`: PASS (main).
- `npm run test:e2e`: PASS mit zero browser runtime errors (main).
- `npm run test:visual`: 72/72 PASS (main) — **Lexikon-Baselines werden durch den Branch absichtlich ungültig.**
- `npm run lint`: 0 Fehler (24 bestehende Warnungen).

## 2. Source of truth

- Unternehmensrollen: `docs/COMPANY_IDENTITY.md` — Gina Schulze ist Inhaberin/Geschäftsführerin; Jeremy Schulze ist ausschließlich Developer/technische Entwicklung.
- Design: `DESIGN.md` + `src/components/marketing/tokens.css`.
- **Lexikon:** `docs/LEXIKON.md` + `src/lib/lexikon.ts` (Inhalt) + `src/components/marketing/lexikon/` (UI).
- Website-Spec: `docs/superpowers/specs/2026-09-05-public-website-finish-design.md`.
- Implementierungsplan: `docs/superpowers/plans/2026-09-05-public-website-finish.md`.
- Service-Katalog: `src/components/marketing/service-catalog.tsx`.
- Kanonischer Taskstatus: `.sin-gpt-web/taskplan.sqlite3` / `.sin-gpt-web/TASKPLAN.md`.

## 3. Nächster Schritt

Siehe Abschnitt 0. Erst `sin-gpt-web-state --repo . next` prüfen; den Lexikon-Branch als kanonischen Task erfassen, falls noch nicht geschehen (Operator-Anforderung vom 2026-09-05). Produktion/Deploy nur nach `docs/PRODUCTION_HANDOVER.md` und frischer Live-Verifikation.

<!-- SIN-GPT-WEB-HANDOVER
task: EH-01
updated: 2026-09-05T02:00:41+00:00
actor: chatgpt-web
evidence-sha256: 223ddabf850fcb56047dafd0834c4648fe0356286d14630d790002d451660459
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-02
updated: 2026-09-05T02:19:47+00:00
actor: chatgpt-web
evidence-sha256: d3169b9afa465be4ab22588b73903be33178b28010810633f5fb6546dc51f563
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-03
updated: 2026-09-05T04:33:10+00:00
actor: local-agent
evidence-sha256: b9300da9b1e348fc386da08fda11e75c105f6db589d60a0f190ae0af25041437
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-04
updated: 2026-09-05T06:26:03+00:00
actor: chatgpt-web
evidence-sha256: 0bf6db00102a87441e641b95f92d629df17ac5aa3144da80eeb67f83cab48460
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-05
updated: 2026-09-05T09:09:00+00:00
actor: chatgpt-web
evidence-sha256: e072648f313eb7d38b0daa3a917b5f8b9cfbee90f62754f8cef486aa6b258c03
-->
<!-- SIN-GPT-WEB-HANDOVER
task: EH-06 (Lexikon Enterprise Redesign, Branch feat/lexikon-enterprise-redesign)
updated: 2026-09-05T18:00:00+00:00
actor: claude-sandbox-agent
evidence: docs/LEXIKON.md §6 · PR-Beschreibung · tsc/eslint/build PASS in Sandbox
-->

## EH-BRAND — Operator-Auftrag vom 06.09.2026

Zusätzlicher paralleler Operator-Auftrag: vollständige Markenbefunde und Delegation. Der bestehende Handoff oben bleibt als historische/andere Arbeitswelle erhalten; seinen Stand vor Wiederaufnahme live verifizieren. Für EH-BRAND ist die nächste Aktion exakt: Handoff lesen und die aktuelle Studie mit Prime Agent bai/glm-5.3-flash auf sinsupabase ausführen bzw. anhand des Worker-Reports fortsetzen. Keine abgeschlossenen Lexikon- oder Präsentationsaufgaben ungeprüft wiederholen.

- Spezifikation: `docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md`
- Ausführungsplan: `docs/superpowers/plans/2026-09-06-einfachhausen-brand-system.md`
- Handoff: `docs/brand/HANDOFF.md`
- Vollständiger Zielquelltext: `docs/brand/SOURCE_PACKET.md`
- Tasks: EH-BRAND-01 bis EH-BRAND-06; vorhandenes T-0151 und Issue #33 berücksichtigen.
- Ausführung: `/home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906`, Branch `design/einfachhausen-brand-system-20260906`, Node 22.23.0.
- Stand 2026-09-06 (prime-agent, sinsupabase): EH-BRAND-01/02 done — verify pass 27/27, Commit 4a33e4cc, Draft-PR #40, Issue #39 kommentiert. Nächste Aktion: sichtbare Richtungsentscheidung an den drei Studien (EH-BRAND-03, Design-Lead/User), kein Merge/Deploy vorher. Operator 2026-09-06: bai-Pfad tot — dispatch_prime.py nie mehr nutzen, alles in der Operator-Session selbst ausführen.


## EH-BRAND — Korrektur: Atelier 02 (2026-09-06)

Der Nutzer hat die drei Stilproben aus PR #40 ausdrücklich verworfen. Deren technische 27/27-Prüfung ist keine visuelle Freigabe. Root Codex gestaltet und implementiert die neue Richtung persönlich; keinen weiteren Prime/bai-Dispatch aus alten Abschnitten ableiten. Neuer Arbeitsstand: `design/einfachhausen-brand-atelier-20260906`, Workspace `/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906`. Konzept, vollständige Nutzerkorrektur und Plan: `docs/brand/ATELIER_02.md`; aktuelle Übergabe: `docs/brand/HANDOFF.md`; vollständige Quellen: `docs/brand/ATELIER_02_SOURCE.md`; bedienbare Vollansicht: `design/brand-atelier/preview.html`. EH-BRAND-03 bleibt in Arbeit, die neue Richtung wurde noch nicht vom Nutzer bewertet. Genau nächste Markenaktion: diese neue Vollansicht besprechen und tatsächliches Nutzerfeedback dokumentieren. EH-BRAND-04..06 folgen erst der Richtungsentscheidung; kein Merge/Deploy. Ältere Empfehlungen/Dispatch-Anweisungen sind für diese Markenwelle historisch. Andere laufende Arbeitswellen bleiben erhalten.

`````

## docs/PRODUCTION_HANDOVER.md

`````markdown
> **Aktueller Designvertrag · 2026-09-06:** Jerry hat Atelier 02 ausdrücklich freigegeben. Verbindlich sind DESIGN.md, packages/eh-design und der Skill SIN-EH-design. Eigenständige Änderungen am Markenstil sind verboten. Vollständige Übergabe: docs/brand/system/HANDOFF.md; kompletter Quelltext: docs/brand/system/SOURCE.md. Frühere Statusangaben zu noch offenen Stilentscheidungen sind historisch. Restmigration: EH-BRAND-05-WEB, -APPS, -CRM, -HUB. Unternehmensidentität bleibt docs/COMPANY_IDENTITY.md (Gina Inhaberin/Geschäftsführerin, Jeremy Entwickler).

# Einfach Hausen — Production Handover and Continuation Runbook

**Canonical company identity:** `docs/COMPANY_IDENTITY.md` — **Gina Schulze** ist Inhaberin und Geschäftsführerin. **Jeremy Schulze** ist ausschließlich Developer / technische Entwicklung. Diese Rollen gelten für Impressum, Legal-Modals, Dokumentation und generierte Inhalte. Keine unbestätigten Rechts-/Registerdaten erfinden.

## Repository checkpoint — Public Website Finish (2026-09-05)

Der lokale `main` enthält den operator-freigegebenen Public-Website-Finish. Er ändert **nicht** die Produktionsinfrastruktur und **nicht** die App-Informationsarchitektur; er vertieft die öffentliche Website innerhalb des bestehenden Design-Systems. Enthalten sind das Leistungen-Megamenü, 12 echte Service-Unterseiten, `/beratung`, `/notfall`, `/versicherung`, `/immobilienverkauf`, Discovery-/SEO-Finish und erweiterte Browser-/Visual-Gates.

Lokale Release-Evidence vor Push/Deploy: Next.js Production Build **115/115**, `test:public-site` PASS, `test:public-nav` PASS, Full E2E PASS, Visual **72/72**, Lint 0 Fehler und `git diff --check` PASS. Diese Evidence ersetzt **keine** OCI-Live-Verifikation. Vor Deployment weiterhin den kanonischen OCI-Deploypfad und anschließend Public Smoke/Health ausführen; niemals lokale `.next`-Artefakte auf Produktion kopieren.

**Status snapshot:** 2026-08-31 — **Production runs `b74876a` on OCI (`/srv/einfach-hausen`), deployed through the mandatory unified release gate (T-0157, 10/10 green) with live smoke 200 on `/`, `/preise`, `/login`, `/admin/login`, `/api/health`. Product Final Acceptance Website/Homeowner/Partner (T-0160/T-0161/T-0162) passed with evidence on 2026-08-31 (evidence dir `.sin-gpt-web/evidence/acceptance-20260831/`). SIN Supabase OSS on OCI remains the production auth/data authority. Self-hosted HA/PITR/failover must be re-proven on the actual OCI stack before being described as active.**

**Execution boundary:** complete the one-time verified Mac-M1 → GitHub handoff, then run `einfach-hausen` engineering and Prime Agent Luna on **OCI-VM**. GitHub is the only transfer boundary; do not copy a dirty Mac working tree directly to OCI. Supabase Cloud is not part of the target architecture.

This document is the canonical **production operations** continuation point. Repository/agent continuation starts at [`NEXT_AGENT.md`](NEXT_AGENT.md). All agents share one engineering goal and one transactional taskplan; remaining release-wide work is strictly T-0042 Final Acceptance followed by T-0043 Final Convergence/Handover unless acceptance creates a canonical remediation task.

### T-0165 visual/presentation contract

Presentation work follows **Notion App Design → `DESIGN.md` → `docs/PRESENTATION_BRAND.md` → `presentation/premium/brand.config.json` → `presentation/premium/deck.html`**. Notion is a visual reference, not automatic product truth. The presentation uses the repository's real logo asset unchanged, keeps Owner and Pro on the same light visual foundation, uses a 3px phone frame (5px maximum), and treats dark slides as targeted accents. Any future app-design change must be checked through this chain before a new deck export.

## 0. Latest continuation checkpoint — 2026-08-25

**Canonical next-agent entry:** [`NEXT_AGENT.md`](NEXT_AGENT.md).

### Current code/worktree

- Production release remains `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557` from T-0041.
- Local Mac `main` at the 2026-08-25 coordination checkpoint is `16fad400812c5fe4299e163396809a45fbf17714`, one local commit ahead of `origin/main` (`dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`). Final T-0043 convergence must fetch and re-verify all three states instead of assuming equality.
- The local worktree currently contains documentation/Archify coordination changes plus generated runtime/cache paths. Preserve and classify them; do not blindly reset/clean.
- Production intentionally retains only the two runtime media links `data/private -> /var/lib/einfach-hausen/private` and `public/uploads -> /var/lib/einfach-hausen/uploads` as untracked paths. `deploy/update-on-oci.sh` permits only these verified paths and still fails closed on every other tracked/untracked change.
- T-0040 independent gauntlet, T-0044 integration/push and T-0041 production deployment are complete. **T-0042 is the sole current execution target, followed by T-0043.** Use `sin-gpt-web-state` as the only authority for task changes.

### Deployment contract — production verified

Two deployment edge cases were found and fixed before acceptance. Commit `cf56a824` permits only the canonical persistent runtime symlinks during the clean-tree gate. Commit `dcd53ca1` prepends the validated Node 22 directory to `PATH`, because npm uses `#!/usr/bin/env node`; this prevents npm lifecycle/Next.js workers from silently falling back to `/usr/bin/node` 20.20.2. The successful production build and runtime both used Node `v22.23.0` and the build used a disposable `/tmp` SQLite path rather than production data.

### Persistent storage checkpoint

- Database: `/var/lib/einfach-hausen/einfach-hausen.db`
- Private files: `/var/lib/einfach-hausen/private`
- Upload persistence: `/var/lib/einfach-hausen/uploads`
- Verified pre-deploy backup: `/var/backups/einfach-hausen/einfach-hausen-20260824T220100Z` (manifest + SQLite + private/upload archives; restore dry-run PASS)

Do not overwrite or delete these paths during deployment.

## 1. Current state in one minute

| Area | State | Evidence / next action |
|---|---|---|
| Repository | Release deployed | `main`, `origin/main`, and OCI all matched `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557` |
| Production runtime | Healthy | `einfach-hausen.service`, Kestra proxy socket and backup timer active; local and Kestra-path health returned `ok=true`, `database=ready` |
| Production app URL | Live | `https://einfachhausen.de` serves the new release; `/sicherheit`, `/app/settings`, `/app/insurance`, `/partner`, `/impressum`, `/datenschutz` all returned HTTP 200 |
| Cloudflare tunnel | Healthy | `cloudflared` active; DNS, QUIC, HTTP/2 and Cloudflare API prechecks PASS |
| Cloudflare zone / DNS | Active publicly | 1.1.1.1 and 8.8.8.8 returned `aaron.ns.cloudflare.com` + `josephine.ns.cloudflare.com`; canonical HTTPS works through Cloudflare |
| `www` | Healthy | `https://www.einfachhausen.de/` resolves to final `https://einfachhausen.de/` with HTTP 200 |
| Old temporary route | Healthy fallback | `einfach-hausen.delqhi.com/api/health` still returned HTTP 200 during acceptance; retain until final release handover decides removal |
| Mail DNS | Verified live | MX, DMARC, DKIM selector, autodiscover SRV and autoconfig CNAME all match the intended STRATO configuration |
| Stripe | Verified live | `sin-stripe ready` PASS; doctor reports charges/payouts enabled and canonical live webhook present, enabled and subscribed to required events |

## 2. Target architecture

```text
GitHub verified release SHA
  -> OCI-VM canonical engineering/runtime host
      -> Next.js application
      -> SIN Supabase OSS on OCI
          -> Auth
          -> Postgres
          -> Storage
          -> Pooler/Supavisor as deployed

Internet
  -> Cloudflare zone: einfachhausen.de
      -> Cloudflare security/TLS
      -> Cloudflare Tunnel: sin-kestra
      -> 127.0.0.1:3010
      -> systemd: einfach-hausen.service
      -> Next.js application
```

Mac-M1 is source/release/recovery only after this handoff. OCI work starts from a Git commit, never from a copied Mac working tree.

The app must remain loopback-only. Do **not** expose port `3010` directly to the Internet.

### Runtime locations

- Code: `/srv/einfach-hausen`
- Environment: `/etc/einfach-hausen.env` (mode `0600`, never commit)
- Database: `/var/lib/einfach-hausen/einfach-hausen.db`
- Private media: `/var/lib/einfach-hausen/private`, bind-mounted to `/srv/einfach-hausen/data/private`
- Legacy/public upload area: `/var/lib/einfach-hausen/uploads`, bind-mounted to `/srv/einfach-hausen/public/uploads`
- Verified local backups: `/var/backups/einfach-hausen`
- Service: `einfach-hausen.service`
- Tunnel: `sin-kestra`
- Health endpoint: `/api/health`

The existing Kestra health path remains private:

`172.28.50.1:3010 -> systemd-socket-proxyd -> 127.0.0.1:3010`

## 3. Domain cutover status

### Desired Cloudflare nameservers

- `aaron.ns.cloudflare.com`
- `josephine.ns.cloudflare.com`

The STRATO nameserver change has propagated publicly. During T-0041, both 1.1.1.1 and 8.8.8.8 returned the two Cloudflare nameservers above, and the canonical HTTPS routes were served successfully through the active Cloudflare tunnel. A direct `a.nic.de` short query returned no lines in that specific probe, so public resolver + working HTTPS/tunnel evidence is retained rather than inventing registrar output.

### Required Cloudflare records

- `einfachhausen.de` → Cloudflare Tunnel target for `sin-kestra`
- `www.einfachhausen.de` → same tunnel/application, then redirect to apex

At the last local inspection, the tunnel target was:

`818df379-5d51-4f83-9cd9-d0f5d327b438.cfargotunnel.com`

Do not create duplicate A records pointing at the OCI host. The tunnel is the intended public ingress.

## 4. Cloudflare security baseline

Prepared settings:

- SSL/TLS mode: **Full (strict)**
- Always Use HTTPS: enabled
- Minimum TLS: **1.2**
- TLS 1.3: enabled
- HTTP/3: enabled
- Browser Integrity Check: enabled
- Cloudflare security level: Medium
- `www` intended to redirect to the apex domain

After activation, verify these settings through Cloudflare/API instead of relying only on this document. Enable DNSSEC only after the zone is active and follow Cloudflare's exact registrar/DS instructions; do not guess a DS record.

## 5. Mail DNS that must survive the cutover

Before replacing the authoritative DNS, the active STRATO DNS exposed:

- MX: `5 smtpin.rzone.de.`
- DMARC: `v=DMARC1;p=reject;`
- DKIM selector: `strato-dkim-0002._domainkey`
- Autodiscover SRV: `_autodiscover._tcp` → `0 100 443 autoconfigure.strato.de.`
- Autoconfig: `autoconfig` → `autoconfigure.strato.de.`

The exact DKIM public key is intentionally not duplicated here; read it from current DNS/Cloudflare and compare against STRATO before changes.

**Post-cutover requirement:** query the active Cloudflare-authoritative zone and compare MX, DMARC, DKIM and autoconfig/autodiscover with the intended STRATO mail configuration before declaring mail migration complete.

## 6. Production environment contract

```text
NEXT_PUBLIC_APP_URL=https://einfachhausen.de
DATABASE_PATH=/var/lib/einfach-hausen/einfach-hausen.db
STRIPE_SECRET_KEY=<runtime secret>
STRIPE_WEBHOOK_SECRET=<runtime secret>
STRIPE_CURRENCY=eur
ADMIN_PASSWORD=<runtime secret>
```

Secrets are canonical in SIN-Infisical where applicable and must never be copied into Git, screenshots, chat output, evidence files or documentation.

## 6a. Produktions-Auth-Grenze — T-0168 Deep Research

Für die nächste Produktionskonvergenz gilt zusätzlich:

- Supabase ist die serverseitige Identity Authority für geschützte Owner-/Provider-Flächen.
- `mh_session`/SQLite darf nur in einem expliziten Local-Dev-Modus verwendet werden; ein solcher Modus muss in Produktion fail-closed sein.
- Es gibt keinen stillen Fallback von Supabase auf lokale Auth.
- `AuthContext` ist keine Sicherheitsgrenze; geschützte Server Components, Route Handler und Server Actions autorisieren serverseitig.
- Die Zuordnung von Supabase-Subject zu bestehender App-User-ID muss vor Migration oder Schemaänderung explizit nachgewiesen werden.
- Finale T-0168-Acceptance benötigt frische authentifizierte Round-3-Evidence unter `.sin-gpt-web/evidence/T-0168/round3/` sowie grüne Security/Auth/Visual/TypeScript/Build/Diff/GitNexus-Gates.

Vollständiger Entscheidungsstand: [`T0168_DEEP_RESEARCH.md`](T0168_DEEP_RESEARCH.md).

## 7. Stripe cutover

Canonical intended endpoint:

`https://einfachhausen.de/api/stripe/webhook`

Relevant application routes derive their origin from `NEXT_PUBLIC_APP_URL`.

After DNS activation:

```bash
cd /Users/jeremy/dev/wow-my-zsh
shared/skills/sin-stripe/scripts/sin-stripe ready --project einfach-hausen
shared/skills/sin-stripe/scripts/sin-stripe doctor --project einfach-hausen \
  --webhook-url https://einfachhausen.de/api/stripe/webhook
```

Inspect the live Stripe endpoint and ensure its signing secret matches the OCI runtime. Do not create duplicate endpoints unnecessarily. Never charge a real customer merely as a health check.

## 8. Immediate continuation checklist

### A. Check registry propagation

```bash
for r in a.nic.de 1.1.1.1 8.8.8.8; do
  echo "@$r"
  dig +short NS einfachhausen.de @$r
done
```

Success requires the two Cloudflare nameservers consistently.

### B. Confirm Cloudflare zone is active

Verify through the existing Cloudflare account/API. Credentials are outside Git; never print tokens.

### C. Verify public DNS and HTTPS

```bash
dig +short CNAME einfachhausen.de
curl -fsSI https://einfachhausen.de
curl -fsS https://einfachhausen.de/api/health
curl -fsSI https://www.einfachhausen.de
```

Expected: valid certificate, health JSON with `"ok":true`, and `www` ending at the apex domain.

### D. Verify mail records

```bash
dig +short MX einfachhausen.de
dig +short TXT _dmarc.einfachhausen.de
dig +short TXT strato-dkim-0002._domainkey.einfachhausen.de
dig +short SRV _autodiscover._tcp.einfachhausen.de
dig +short CNAME autoconfig.einfachhausen.de
```

### E. Verify Stripe

Run `sin-stripe doctor`, then inspect webhook delivery status and event coverage.

### F. Keep the fallback until acceptance is complete

Do not remove `einfach-hausen.delqhi.com` until the new domain, health endpoint, HTTPS, redirect, mail records and Stripe endpoint all pass.

## 9. Deployment and recovery

Deploy on OCI as the `ubuntu` application owner (the script elevates only the privileged filesystem/systemd steps itself):

```bash
/srv/einfach-hausen/deploy/update-on-oci.sh
```

Sequence: `verify clean main + Node 22 -> prepare persistent paths -> copy-only legacy media migration -> pre-deploy online backup when DB exists -> git fetch -> fast-forward main -> npm ci -> disposable-DB build -> systemd reload/restart -> local DB-aware health check`. The script does not use `git reset --hard` and does not delete or overwrite production data.

Diagnostics:

```bash
sudo systemctl status einfach-hausen.service --no-pager
sudo journalctl -u einfach-hausen.service -n 120 --no-pager
curl -fsS http://127.0.0.1:3010/api/health
```

A previous restart loop was caused by a missing production `.next` build. A complete build followed by service restart restored health. Inspect the journal first; do not delete persistent data as a first response.

Backups:

- timer: `einfach-hausen-backup.timer`
- local retention: seven days by default
- private bucket: `einfach-hausen-backups`
- canonical helper: `scripts/backup-einfach-hausen.sh`
- method: SQLite online backup + `PRAGMA integrity_check`, private/upload archives, SHA-256 manifest before upload
- recovery proof: `scripts/restore-einfach-hausen.sh BACKUP_DIR --dry-run` validates checksums, SQLite integrity and private/upload file counts in a temporary directory; it has no production-overwrite mode

## 10. Verification baseline already achieved

Release verification retained from the independent convergence gauntlet and refreshed in production:

- `npm run lint` passed on the accepted application tree
- production `npm ci` reported 0 vulnerabilities
- production `npm run build` passed on Node `v22.23.0` and generated all 60 pages
- focused security suite: **133 passed, 0 failed**
- T-0003 webhook/private-media suite: **43 passed, 0 failed**
- pre-deploy backup `einfach-hausen-20260824T220100Z` passed non-destructive restore dry-run
- pre-/post-deploy SQLite `PRAGMA integrity_check`: `ok`; table count 59 -> 59, users 4 -> 4, jobs 0 -> 0
- local and Kestra-path health both returned `ok=true` with `database=ready`
- public canonical routes and `www` redirect passed; old fallback health remained HTTP 200
- Stripe readiness/doctor passed for the canonical live webhook without issuing a real charge

## 10a. Technical product-completion v2 + HA (2026-08-27) — historischer Planungsstand

Baseline `dcd53ca1` bleibt Rollback-Punkt. Die 2026-08-27 geplante **HA-Produktion** (T-0100..T-0131 + T-0166 Supabase HA-Migration + T-0167 Capacitor Release) wurde **nie ausgeführt**: Der laufende Production-Code (Stand 2026-08-29, oci/t0169) nutzt SQLite (`DATABASE_PATH`) als App-Datenbank, SIN Supabase OSS ausschließlich als Auth-Autorität, und es existiert kein Storage-Adapter. Verifizierter Runtime-/Deploy-Pfad: `deploy/update-on-oci.sh` (rsync persistenter Symlinks, Node 22, Build, Backup, systemd-Restart, Health-Check). Externe Blocker: siehe `docs/EXTERNAL-BLOCKERS.md`.

## 11. Repository hygiene and in-progress work

After T-0041, tracked release work is committed. The Mac controller still has local generated coordination/cache directories (`.sin-gpt-teamwork/`, `scripts/__pycache__/`) to classify in final convergence. Production intentionally has only the two canonical untracked runtime symlinks described above. **Do not run `git reset --hard` or `git clean -fd` blindly.**

Primary continuation documents:

- `docs/PRODUCTION_HANDOVER.md` — this handover
- `docs/OPERATIONS.md` — OCI operations
- `deploy/README.md` — deployment paths
- `docs/ARCHITECTURE.md` — application architecture
- `docs/PRODUCT_VISION.md` — binding product model
- `AGENTS.md` — mandatory workflow

## 12. Completion definition

The migration is complete only when all are true:

- [x] public resolvers return `aaron.ns.cloudflare.com` and `josephine.ns.cloudflare.com`
- [x] Cloudflare-backed canonical HTTPS is active and tunnel prechecks pass
- [x] `https://einfachhausen.de` loads
- [x] `/api/health` returns OK publicly with `database=ready`
- [x] `www` redirects to apex
- [x] active Cloudflare tunnel transport checks pass
- [x] STRATO mail DNS is verified live
- [x] canonical Stripe live webhook is present/enabled and Stripe readiness/doctor pass
- [x] old fallback remained available through production acceptance
- [x] DNSSEC was not guessed or changed without an exact Cloudflare/registrar DS workflow

T-0041 production cutover is complete. Any optional DNSSEC enablement or fallback retirement is an explicit post-release operator hardening action, not an unreported application deployment gap.

<!-- SIN-GPT-WEB-HANDOVER:BEGIN -->
## SIN GPT Web completion / handover sync

- Last synchronized task: `T-0167`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen vollständig fertigstellen — Owner-App/Website auf Produktionsqualität konvergiert (Notion-Original-Referenzen), Auth via self-hosted SIN Supabase, App-Daten SQLite
- Resume rule: read/validate the canonical taskplan (.sin-gpt-web/taskplan.sqlite3) and continue its highest-priority eligible task
- Taskplan sync: `pass`
- Synchronized at: `2026-08-27T00:00:00+00:00`
- Contract: `sin-gpt-web-completion-handover-v1`
<!-- SIN-GPT-WEB-HANDOVER:END -->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0100
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: f42a70c09249785cee78d453593730b02e462563c2ea52dd3f96ff13d447e5a6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0101
updated: 2026-08-31T20:52:50+00:00
actor: local-agent
evidence-sha256: ad159f2cc950ebf498af6d9f88b455def41b635fe25d5b965a5a13b3ca89b222
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0102
updated: 2026-08-31T20:52:51+00:00
actor: local-agent
evidence-sha256: 2e7357efbd529ac1f58e185753fb74a4020585d1823d89156e4b2506b6f36dc2
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0103
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 9f513f7079d3261f78b90b6bd9147004c81eee2c312db6be84f3df048cbcd64a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0104
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: baeb3b5cc21ca5732de76caf6600b1e9e796a5df3a459eb6ee6aa3c10927d7e1
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0105
updated: 2026-08-31T20:53:01+00:00
actor: local-agent
evidence-sha256: 8f8c2cb7dbb63a32f95b7554a3432704679483f51eb02ca0a1876028014cadc5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0106
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: 28e3a69bfc9528cee8757764023da67b82126fb41f50201e9db1a69ef64db976
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0107
updated: 2026-08-31T20:53:02+00:00
actor: local-agent
evidence-sha256: a4d0746af463ce97c8c6bfd1c870936634047e723fc48a76bca188862de4567d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0108
updated: 2026-08-31T20:52:52+00:00
actor: local-agent
evidence-sha256: 8b95638cc3257cbeb6b6c700584c9d1c131e195a1a2cdb0831b6d5633cfb338f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0109
updated: 2026-08-31T20:53:03+00:00
actor: local-agent
evidence-sha256: b7ba6dde2f1cca415fa54b2d0c4f96699805deca3a08c09163dee092774c63f6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0110
updated: 2026-08-31T20:52:53+00:00
actor: local-agent
evidence-sha256: a73593c023c7d82fc6306ea2fce3f45eaac6fe94ff94c60589a048581736f648
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0164
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 6e808dd8296359a6ed71a9bc0233622843628ce933fabc8f2bd6be9c18a06087
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0165
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 35e2db2bb0dd5858f605cfd6057a51bd5a2cc1733437cbe03b37f501140d5259
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0167
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: fbb81df390757352fa4b5eef8a9d588c872e51e967bf063af55523cd0790203a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0168
updated: 2026-08-31T20:53:05+00:00
actor: local-agent
evidence-sha256: cddef743ddcbea9daa1ac14e2f401c5e68470280862077bedb48542798d521e3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0169
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 9e54c89cf783fdec3bfac2b296c5cf87812231375dc96e2f9f25c4b4aa627210
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0173
updated: 2026-08-31T20:53:06+00:00
actor: local-agent
evidence-sha256: 3b42e8e7560437f09e36c1c1afc42223cc10fc5140880d68b9edab0e386d9c4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0170
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: 3301600a2ffff136c37ca355c7a51268296d9f2959e02ab5de8480a77935685f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0171
updated: 2026-08-31T20:53:08+00:00
actor: local-agent
evidence-sha256: fd8973c6f65fbc9de171997c767818934e0bcd1b2dd47cb00d312955bb498efa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0140
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: 9a98b49675963b2ea908a68a789931a1ce3a120c18862d3fba049bda0fb087c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0141
updated: 2026-08-31T20:52:55+00:00
actor: local-agent
evidence-sha256: d2ac93b376b977a7e8c1e97fa78f2e3cc4a6fa132413259427293fa43456d185
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0172
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: dcd867da25695f1168a7f176d082ca52bdc934dcb9e40f949e46251cbed16821
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0174
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: e1e1520308294faa680b6bcbe176f96dc1d6131f95d218cc19ab176a39d3e9e9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0175
updated: 2026-08-31T20:53:07+00:00
actor: local-agent
evidence-sha256: da531fc298590aed92dd381b806c51d629170dc0414b589bddcdb3ac7a92d208
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0176
updated: 2026-08-31T20:53:09+00:00
actor: local-agent
evidence-sha256: 48a6469d9986ed404e1e7aeabe1156491db410f54682f13015cd57bb8a212e48
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0177
updated: 2026-08-31T20:52:59+00:00
actor: local-agent
evidence-sha256: 9b8b11fb86f4f29f8111ff8159cfd63f0d8147ad9c9fe8172abe609087578c9e
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0148
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: 4ef622af886af3eec0fcee15e0c9b6f3701562e2b54c557679f7865d0015c705
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0149
updated: 2026-08-31T20:52:56+00:00
actor: local-agent
evidence-sha256: ee7dd33a827a4186797e2e9fd11b46d1d34b100736afd7c3edb1ecccd9661465
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0150
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 8408674ed32c856ac5fa4c249f081c989efe634068d4e1c18a36080b76426a4d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0158
updated: 2026-08-31T20:52:57+00:00
actor: local-agent
evidence-sha256: 1334808461c1eefcd702dde2d78c41249acef0f3a9ad16fb200938bea3b44d16
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0159
updated: 2026-08-31T20:52:58+00:00
actor: local-agent
evidence-sha256: 4f805b7450d7a6291c49d70fbd741f091ce1c5cbd8e5e3de65e85b8daa1590aa
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0135
updated: 2026-08-31T20:52:54+00:00
actor: local-agent
evidence-sha256: 8cc3663b0397c2fbcef390d333845930ad753ab448184830a67735e6b2b43ac0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0004
updated: 2026-08-22T16:24:18+00:00
actor: local-agent
evidence-sha256: 4aaa04f685e833bd81528668f15ce9ca3bd1e3e37227af5d8e2fb1df720a513a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0005
updated: 2026-08-22T17:06:16+00:00
actor: local-agent
evidence-sha256: fa183425e21f31b54cdc90edc511fb1218cf517590a404b9fb51fd05e56fb6da
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0200
updated: 2026-08-30T04:10:43+00:00
actor: local-agent
evidence-sha256: 425e861d61478080b23cc52ad6b64973eb901e909bbe35dd7fb24a555e299358
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0201
updated: 2026-08-30T04:29:48+00:00
actor: local-agent
evidence-sha256: c5758386de9a32943594941ee15b2faf7dd48bcd822565e0419448383e33c180
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0202
updated: 2026-08-30T04:39:54+00:00
actor: local-agent
evidence-sha256: 0bc75649da580b92e8c385c0ce01f150f9b48f18b1ac0d2c9ee40525373e504f
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0203
updated: 2026-08-30T04:59:52+00:00
actor: local-agent
evidence-sha256: b734c3298856af57db7cbd01c11010da44ffcc25472c8142ae1011378a1a4699
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0204
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: 26d2c37b44b0e2ecdd412fa38e9987742b09de7fdb3d65324b840eee1997f5d8
-->
<!-- SIN-GPT-WEB-HANDOVER
task: T-0205
updated: 2026-08-30T12:37:24+00:00
actor: local-agent
evidence-sha256: f1288185ef3bec19c87d3ccaf8e935f8a33480e8db7f734bae58d6874f3a4d43
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0042
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: b0522c720f2d26ef171afa4f8b0bd77eb82cd987694ae7791144c8df2c9124fd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0043
updated: 2026-08-31T20:52:48+00:00
actor: local-agent
evidence-sha256: 7690208a2287a2d7d24bc2b266c299ac0cdbdaac3e76839323fb142c4ea23138
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0049
updated: 2026-08-31T20:52:49+00:00
actor: local-agent
evidence-sha256: 0d6781d978ed15bc779a17b686785e5efe3810adb2563c2731c51acc8f2f82c7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0157
updated: 2026-08-31T21:16:05+00:00
actor: local-agent
evidence-sha256: 7f99e3ef8bfd11d211e6dbda80fa766914a185971e4f6883515209aba957fb5f
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0160
updated: 2026-08-31T22:25:51+00:00
actor: local-agent
evidence-sha256: a0374312071e4a6d50a86e2706a720cb563cff292dd03c20102c6c0ac8b63098
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0161
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: 8347892ea96120456d7b66b9aba1440561a66d689fce427bda41928e3e8003b4
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0162
updated: 2026-08-31T22:54:54+00:00
actor: local-agent
evidence-sha256: ff5ccd0484ed2266c6ce264e4b9f21b41f1bd97f7e8c73ff4c98e9216edf19cd
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0163
updated: 2026-08-31T22:56:47+00:00
actor: local-agent
evidence-sha256: fb1882e2df32385413315728fdb2731a84376c39873250aa2cf0335a2c913c98
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0154
updated: 2026-09-01T00:56:58+00:00
actor: local-agent
evidence-sha256: 83e5ed487aff86dee8b825d9f06d859654d292349ec6538442ac1f725c3dbe1b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0152
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 75fc109f1509113951e589eae987093b5e6ae117d9fd29e758a6c673897685d3
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0153
updated: 2026-09-01T01:03:10+00:00
actor: local-agent
evidence-sha256: 08da5c23cd9a4bb84512af6dc432989154d9da35f011f18bf9ef15fb7a650193
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0155
updated: 2026-09-01T01:47:14+00:00
actor: local-agent
evidence-sha256: 02c7cb988ff4f3990fdd17d9a4772d50152245ab2becbbd66f768202ec391bc8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0156
updated: 2026-09-01T03:30:24+00:00
actor: local-agent
evidence-sha256: 994ea2169cfa09d65fa7fa4e2b29c4f8e02de905c613b7d24ebd946ec7c7d4b0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0115
updated: 2026-09-01T03:30:25+00:00
actor: local-agent
evidence-sha256: ef7edcae3cf6bd3ad470c34205fa815916c109e4709b0298ac4f0a4068e48968
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0111
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: 87e072d5e2c574dbf26ce3c530c85fb1d6a5a871034892d6adf8dc40ec8a3ae9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0112
updated: 2026-09-01T12:44:55+00:00
actor: local-agent
evidence-sha256: f193fa11049f920c888558209118f7b7592a95a4e86ace0c92274995b906db8d
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0138
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: 0ab111892a30d55ad46e7f6232b32f64656dee72cc4b9937613c3f2a3d9c925a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0142
updated: 2026-09-01T13:24:20+00:00
actor: local-agent
evidence-sha256: bceab63e963dd389c859027e3e4221a6a50386a99dfad656912ed9445f0038fe
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0113
updated: 2026-09-01T13:55:36+00:00
actor: local-agent
evidence-sha256: 07b6275707f950b590ed96ec928ab841e01791e4761d591f616d20f0fc5e80cc
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0114
updated: 2026-09-01T13:57:24+00:00
actor: local-agent
evidence-sha256: db6e60f478405d43372683fbf7d760ddb32ef5fb7c5c608ca152e3115cca052b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0116
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: cfbef8fb88b67a309e81fa923357ecfc6f2a6808005e9d697e457401171f9ce5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0117
updated: 2026-09-01T17:55:42+00:00
actor: local-agent
evidence-sha256: 32b178026b6612aa0bc5ea8813b094a8e7b84293e8c9f8a5706a02435767ed03
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0136
updated: 2026-09-01T18:06:52+00:00
actor: local-agent
evidence-sha256: 766040d87c6e2dbae195442af395ea3b2fddc2c114f4fbe4a7963f3a4d6463ea
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0147
updated: 2026-09-01T19:19:57+00:00
actor: local-agent
evidence-sha256: 4149908d9dda7f1397ce06f9aadccce2ae5c038d469a1adeb8e1e3f02d0a2ff9
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0118
updated: 2026-09-01T20:51:22+00:00
actor: local-agent
evidence-sha256: c55fee22cf93a7578d26053014ef8e42b4a7534775e5e1a5d1fd60053eb1d405
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0119
updated: 2026-09-01T22:14:14+00:00
actor: local-agent
evidence-sha256: 0acd76be267c23dd81333e674d9c0eee29d42c3f07154718697fae9f793a26b6
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0210
updated: 2026-09-02T23:18:15+00:00
actor: local-agent
evidence-sha256: 80f9aad504a029dbe80faed7a0cf4c152de5bf88a4b1880edf60f754211dea51
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0211
updated: 2026-09-02T23:18:41+00:00
actor: local-agent
evidence-sha256: 60f232b4e4d8bb71c603011e8a96ba47b0b2b4f04b45106ed5ab759dbc9d69a0
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0120
updated: 2026-09-02T23:49:07+00:00
actor: local-agent
evidence-sha256: 73903ba5ee89d8c893c1f1fd2a10d42aeeba247966ba2045494555aa353d28e5
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0121
updated: 2026-09-02T23:56:26+00:00
actor: local-agent
evidence-sha256: 01f5f6cb64432cac1825787493c591f7d4d2c263eff4860738564f29f1259336
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0122
updated: 2026-09-03T00:15:44+00:00
actor: local-agent
evidence-sha256: dca081a3188c1676492cf6cfd60f6b5d044444af48a818ae6173c43636c209fb
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0131
updated: 2026-09-03T12:19:04+00:00
actor: local-agent
evidence-sha256: 95b14cf53c5f2030d04c08f2b5dd9dfbb343623139fc5ce9e720d09533c6be38
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0123
updated: 2026-09-03T00:23:19+00:00
actor: local-agent
evidence-sha256: d05fdcb413b5af3832a99bb11e2726eab2c7c3682e25b7c74203edb5e4bd3544
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0124
updated: 
actor: local-agent
evidence-sha256: 7b56927949e37e438aa734d75f4b3eed9bd85a667118aa51838decfaccecfcb7
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0129
updated: 
actor: local-agent
evidence-sha256: a2028224c451c9d493976891e8e4061d8fbe7cbe6e5155f21be5f251a13b16be
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0130
updated: 
actor: local-agent
evidence-sha256: db4bfd0327fb8cd3dcc011d26631b8b064c1a6b0952880d4fbb8d34877b61b84
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0125
updated: 
actor: local-agent
evidence-sha256: 24ead3c1a5c517e9724996338b7426ad3e8e2c18cd519e08d1f683f72f4d788b
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0126
updated: 
actor: local-agent
evidence-sha256: 1acbbc8c9d9ec3b87035c8d0521fa2c3622fa697e6d719310f61795b15fda6e8
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0127
updated: 
actor: local-agent
evidence-sha256: 0640af1175d4cd871685513652419379eec835cf543aed5dfc69b0bfcadc4a29
-->

<!-- SIN-GPT-WEB-HANDOVER
task: T-0128
updated: 
actor: local-agent
evidence-sha256: 52a6748748dfe2d958322ba6584bcd9e8cd8284ed731054bf7f3d48948bf4d4a
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-01
updated: 2026-09-05T02:00:41+00:00
actor: chatgpt-web
evidence-sha256: 223ddabf850fcb56047dafd0834c4648fe0356286d14630d790002d451660459
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-02
updated: 2026-09-05T02:19:47+00:00
actor: chatgpt-web
evidence-sha256: d3169b9afa465be4ab22588b73903be33178b28010810633f5fb6546dc51f563
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-03
updated: 2026-09-05T04:33:10+00:00
actor: local-agent
evidence-sha256: b9300da9b1e348fc386da08fda11e75c105f6db589d60a0f190ae0af25041437
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-04
updated: 2026-09-05T06:26:03+00:00
actor: chatgpt-web
evidence-sha256: 0bf6db00102a87441e641b95f92d629df17ac5aa3144da80eeb67f83cab48460
-->

<!-- SIN-GPT-WEB-HANDOVER
task: EH-05
updated: 2026-09-05T09:09:00+00:00
actor: chatgpt-web
evidence-sha256: e072648f313eb7d38b0daa3a917b5f8b9cfbee90f62754f8cef486aa6b258c03
-->

## EH-BRAND — Operator-Auftrag vom 06.09.2026

EH-BRAND ist eine isolierte Markenstudie. Der Produktionsstand 3d7d84e ist der geprüfte Ausgangspunkt; neue Produktionsstände vor jeder Integration erneut lesen. Diese Dokumentation behauptet keinen neuen Deploy. Die visuelle Richtung und die betroffenen produktiven Dateien müssen vor der Folge-Migration konkret dokumentiert sein. Entfernte Präsentationssektionen bleiben entfernt.

- Spezifikation: `docs/superpowers/specs/2026-09-06-einfachhausen-brand-system-design.md`
- Ausführungsplan: `docs/superpowers/plans/2026-09-06-einfachhausen-brand-system.md`
- Handoff: `docs/brand/HANDOFF.md`
- Vollständiger Zielquelltext: `docs/brand/SOURCE_PACKET.md`
- Tasks: EH-BRAND-01 bis EH-BRAND-06; vorhandenes T-0151 und Issue #33 berücksichtigen.
- Ausführung: `/home/ubuntu/orca/workspaces/einfach-hausen-brand-system-20260906`, Branch `design/einfachhausen-brand-system-20260906`, Node 22.23.0.


## EH-BRAND — Korrektur: Atelier 02 (2026-09-06)

Der Nutzer hat die drei Stilproben aus PR #40 ausdrücklich verworfen. Deren technische 27/27-Prüfung ist keine visuelle Freigabe. Root Codex gestaltet und implementiert die neue Richtung persönlich; keinen weiteren Prime/bai-Dispatch aus alten Abschnitten ableiten. Neuer Arbeitsstand: `design/einfachhausen-brand-atelier-20260906`, Workspace `/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906`. Konzept, vollständige Nutzerkorrektur und Plan: `docs/brand/ATELIER_02.md`; aktuelle Übergabe: `docs/brand/HANDOFF.md`; vollständige Quellen: `docs/brand/ATELIER_02_SOURCE.md`; bedienbare Vollansicht: `design/brand-atelier/preview.html`. EH-BRAND-03 bleibt in Arbeit, die neue Richtung wurde noch nicht vom Nutzer bewertet. Genau nächste Markenaktion: diese neue Vollansicht besprechen und tatsächliches Nutzerfeedback dokumentieren. EH-BRAND-04..06 folgen erst der Richtungsentscheidung; kein Merge/Deploy. Ältere Empfehlungen/Dispatch-Anweisungen sind für diese Markenwelle historisch. Andere laufende Arbeitswellen bleiben erhalten.

`````

## docs/brand/BRAND_CONTRACT.md

`````markdown
# Einfachhausen · kanonischer Einstieg

[Verbindliche Quelle](../../DESIGN.md). Atelier 02 ist freigegeben. Keine autonome Neugestaltung. [Konsolidierung mit PR #42](system/PR42_RECONCILIATION.md). Vollständiger Code: [Source-Paket](system/SOURCE.md).

`````

## docs/brand/COMPONENTS.md

`````markdown
# Einfachhausen · kanonischer Einstieg

[Verbindliche Quelle](../../packages/eh-design/src/recipes.tsx). Atelier 02 ist freigegeben. Keine autonome Neugestaltung. [Konsolidierung mit PR #42](system/PR42_RECONCILIATION.md). Vollständiger Code: [Source-Paket](system/SOURCE.md).

`````

## docs/brand/HANDOFF.md

`````markdown
# Aktuelle Markenübergabe

Atelier 02 ist freigegeben. Siehe [vollständige Übergabe](system/HANDOFF.md), [Designvertrag](../../DESIGN.md) und [vollständigen Quelltext](system/SOURCE.md). Frühere Stilproben sind ausschließlich historische Evidenz. Keine autonome Neugestaltung.

`````

## docs/brand/NEXT_AGENT_BRAND.md

`````markdown
# Einfachhausen · kanonischer Einstieg

[Verbindliche Quelle](system/HANDOFF.md). Atelier 02 ist freigegeben. Keine autonome Neugestaltung. [Konsolidierung mit PR #42](system/PR42_RECONCILIATION.md). Vollständiger Code: [Source-Paket](system/SOURCE.md).

`````

## docs/brand/SIN-EH-DESIGN-SKILL.md

`````markdown
# Einfachhausen · kanonischer Einstieg

[Verbindliche Quelle](https://github.com/OpenSIN-Code/wow-my-zsh/tree/design/eh-brand-skills-v1-20260906/shared/skills/sin-eh-design). Atelier 02 ist freigegeben. Keine autonome Neugestaltung. [Konsolidierung mit PR #42](system/PR42_RECONCILIATION.md). Vollständiger Code: [Source-Paket](system/SOURCE.md).

`````

## docs/brand/evidence/gitnexus-final.txt

`````text

  GitNexus Analyzer

[2K  Skipped 3 large files (>512KB, likely generated/vendored)
[2K  - design/brand-atelier/preview.html
[2K  - docs/brand/ATELIER_02_SOURCE.md
[2K  - docs/brand/source/BASE_SNAPSHOT.md
[2K  Set GITNEXUS_MAX_FILE_SIZE=<KB> to include files above the default cap.
{"level":40,"time":1788686263752,"name":"gitnexus","msg":"[scope-resolution] 709 property read/write site(s) name a field that IS defined in this workspace, but only in another language, so per-language inference declined to link them. Queries for these fields return an empty result that does NOT mean \"unused\" — it means the definition anchor is in a different language. Affected: ADMIN_PASSWORD (javascript), AI_BASE_URL (javascript), AI_MODEL (javascript), AUTH_MODE (javascript), DATABASE_PATH (javascript), E2E_INSECURE_COOKIES (javascript), NEXT_PUBLIC_APP_URL (javascript), NEXT_PUBLIC_SUPABASE_ANON_KEY (javascript), NEXT_PUBLIC_SUPABASE_URL (javascript), NODE_ENV (javascript), …"}
{"level":40,"time":1788686263993,"name":"gitnexus","truncation":{"truncated":true,"entryPointCandidatesDropped":466,"entryPointsUnexplored":46,"walksCutByBudget":44,"tracesDepthCapped":0,"calleesDropped":765,"processesDropped":256},"msg":"[processes] 588 flows reported, but whole flows are MISSING: 466 of 666 candidate entry point(s) never ranked in, 46 ranked entry point(s) never traced, 256 deduplicated flow(s) dropped at maxProcesses, 0 trace(s) cut at maxTraceDepth, 765 callee(s) skipped at maxBranching, 44 walk(s) cut by the per-entry trace budget. An absent flow does NOT mean the code path does not exist."}
[2KIncremental: changed=21, added=53, deleted=0 (skipping wipe + 534 unchanged file rows preserved)
[2KIncremental: +35 importer(s) added to writable set (BFS depth ≤ 4)
[2KParse cache: pruned 1 stale chunk entries

  Repository indexed successfully (51.7s)

  7,079 nodes | 16,895 edges | 279 clusters | 588 flows
  /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906

EXIT 0
Changes: 16 files, 48 symbols
Affected processes: 149
Risk level: critical

Changed symbols:
  Section Verbindliche Einfachhausen Gestaltung · 2026-09-06 → AGENTS.md
  Section Einfachhausen · Designsystem 1.0 → DESIGN.md
  Section 1. Autorität und Geltungsbereich → DESIGN.md
  Section 2. Das Eigene an Einfachhausen → DESIGN.md
  Section 3. Eine einzige Markenquelle → DESIGN.md
  Section Farben → DESIGN.md
  Section Schrift und Lesbarkeit → DESIGN.md
  Section Form, Abstand und Bewegung → DESIGN.md
  Section 4. Komponentenregister → DESIGN.md
  Section 5. Seiten individuell zusammensetzen → DESIGN.md
  Section 6. Präsentationen → DESIGN.md
  Section 7. Schutz vor unbeabsichtigter Änderung → DESIGN.md
  Section 8. Übergabe und Änderung → DESIGN.md
  Section Native HTML / Worker → DESIGN.md
  Section OCI deployment → deploy/README.md
... and 33 more

Affected execution flows:
  • Page → EHContainer (5 steps) — changed: PageHero
  • Page → Update (4 steps) — changed: MarketingShell
  • Page → EHHeading (4 steps) — changed: LegalNotice
  • Page → EHEyebrow (4 steps) — changed: PageHero
  • Page → EHText (4 steps) — changed: PageHero
  • TrustSection → EHTextLink (4 steps) — changed: InfoPanel
  • Page → IntakeForm (3 steps) — changed: MarketingShell
  • Page → SmoothScroll (3 steps) — changed: MarketingShell
  • Page → EHButton (3 steps) — changed: LinkButton
  • Page → EHContainer (5 steps) — changed: PageHero
... and 139 more
EXIT 0

`````

## docs/brand/evidence/system/approval-memory-readback.json

`````json
{"ok":true,"result":{"latest_archive_overview":"# Working Memory\n\n## Session Title\nAtelier 02 Approved; Einfachhausen Design Guidelines & Handoff Requirements\n\n## Current State\nJerry has explicitly approved Atelier 02 as of 2026-09-06, superseding previous pending review. EH-BRAND-03 is complete, and EH-BRAND-04 is currently in progress. Strict design guidelines are established for Einfachhausen, prohibiting redesigns and mandating specific components and branding elements across all related platforms.\n\n## Task & Goals\nThe primary task is to durably store the verified statement regarding the approval of Atelier 02 and the detailed design constraints for Einfachhausen. The goal is to ensure all future work adheres to these approved guidelines and user-specified handoff requirements.\n\n## Key Facts & Decisions\n*   **Atelier 02 Approval**: Jerry explicitly approved Atelier 02 on 2026-09-06 with the comment \"omg das ist MEGA!\".\n*   **Project Status**: EH-BRAND-03 is complete; EH-BRAND-04 is in progress.\n*   **Memory Supersession**: This approval supersedes a prior pending review (record ID `mem-b823c53eeb3ad68261bc`).\n*   **Einfachhausen Design Mandate**: Other agents MUST NOT redesign Einfachhausen.\n*   **Einfachhausen Design Components**: Must use canonical packages/eh-design components, Inter font, original logo, approved palette, Hauskante, and register lines.\n*   **Scope of Design Mandate**: Applies to website/subpages, owner/provider apps, CRM/portalhub, and presentation generator.\n*   **User Requirements for Design Handoff**:\n    *   Readable type.\n    *   Complete `DESIGN.md` documentation.\n    *   Full-code recipes/handoffs.\n    *   Corrected `sin-frontend-design`.\n    *   New `sin-eh-design`.\n    *   Free merge checks.\n    *   Exact migration tasks.\n\n## Files & Context\n*   `record_id`: `mem-148dd732ec01dbd79d82` - The unique identifier for this stored memory record.\n*   `supersedes`: `mem-b823c53eeb3ad68261bc` - The ID of the previous memory record that this new statement replaces.\n*   `evidence_sha256`: `df71395ac0338b2bbc1d9c64996b0813b6f194efc6e686231e0928083b18eaed` - SHA256 hash of the evidence for this statement.\n*   `source`: `src-eb98e2c98a0b8d7614f8b323` - Source identifier for the statement.\n\n## Errors & Corrections\nNone.\n\n## Open Issues\n*   Completion of EH-BRAND-04.\n*   Ensuring all specified user requirements for design handoff (readable type, complete DESIGN.md, full-code recipes, corrected `sin-frontend-design`, new `sin-eh-design`, free merge checks, exact migration tasks) are met for Einfachhausen design implementation.","pre_archive_abstracts":[],"messages":[],"estimatedTokens":635,"stats":{"totalArchives":1,"includedArchives":0,"droppedArchives":1,"failedArchives":0,"activeTokens":0,"archiveTokens":635}}}

`````

## docs/brand/evidence/system/brand-brain-readback.txt

`````text
[core] 6564dc0e-2c74-4867-99d8-992fda0cbc66 Einfachhausen design authority: Jerry approved Atelier 02 and prohibited autonomous redesign. Canonical executable syste

`````

## docs/brand/evidence/system/brand-brain-receipt.txt

`````text
6564dc0e-2c74-4867-99d8-992fda0cbc66

`````

## docs/brand/evidence/system/brand-task-completion.json

`````json
completed EH-BRAND-04

`````

## docs/brand/evidence/system/browser.json

`````json
{
  "result": [
    {
      "view": "Startseite",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistung",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Ratgeber",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistungsübersicht",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Kontakt",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistungsumfang",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Owner-App",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Handwerker-App",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Bausteine",
      "width": 390,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Startseite",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistung",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Ratgeber",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistungsübersicht",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Kontakt",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistungsumfang",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Owner-App",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Handwerker-App",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Bausteine",
      "width": 736,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Startseite",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistung",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Ratgeber",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistungsübersicht",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Kontakt",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Leistungsumfang",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Owner-App",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Handwerker-App",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    },
    {
      "view": "Bausteine",
      "width": 1440,
      "overflow": false,
      "small": [],
      "font": "Inter, interVariable, \"interVariable Fallback\", ui-sans-serif, system-ui, sans-serif, sans-serif",
      "axe": []
    }
  ],
  "errors": [],
  "interactions": "passed",
  "failedViews": 0
}

`````

## docs/brand/evidence/system/final-task-records.json

`````json
[
  {
    "id": "EH-BRAND-03",
    "sequence": 131,
    "title": "Visuelle Markenentscheidung und Refinements dokumentieren",
    "description": "2026-09-06: Nutzer hat die drei PR-40-Studien verworfen. Root Codex gestaltet Atelier 02 selbst, kein weiterer Prime/bai-Dispatch. Workspace /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906; Branch design/einfachhausen-brand-atelier-20260906. Konzept/R01-R08/vollständiges Feedback in docs/brand/ATELIER_02.md. Neue Vollansicht design/brand-atelier/preview.html. 12 Responsive-Ansichten und 6 axe-Prüfungen bestanden. Neue Richtung noch nicht vom Nutzer bewertet; kein Merge/Deploy.",
    "kind": "review",
    "status": "done",
    "priority": 3,
    "owner": "chatgpt-web",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-05T23:16:15+00:00",
    "updated_at": "2026-09-06T08:05:25+00:00",
    "started_at": "2026-09-06T03:02:09+00:00",
    "completed_at": "2026-09-06T08:05:25+00:00",
    "evidence": "Operator explicit acceptance 2026-09-06: omg das ist MEGA! Requested legibility improvement and binding system, components, SIN-EH-design, corrected sin-frontend-design, merge consistency checks and presentation-generator adoption. Accepted Atelier 02 from PR41 at 77e1e558afbfd27ae4d80cec571a6b2a6c2ad685; previous PR40 remains rejected.",
    "completion_report": "Atelier 02 accepted by operator. Next authorized task EH-BRAND-04: binding shared system with readability refinements and reusable components.",
    "blocked_reason": "",
    "revision": 4,
    "completion_contract_version": 1,
    "handover_json": "{\"contract\": \"v1\", \"docs\": {\"AGENTS.md\": {\"marker_sha256\": \"0c668d0b1a9edd7750a85a04912abde0b752a5bf8ff2fb34ea384f188d76844f\", \"bound_task\": \"EH-BRAND-03\"}, \"README.md\": {\"marker_sha256\": \"0c668d0b1a9edd7750a85a04912abde0b752a5bf8ff2fb34ea384f188d76844f\", \"bound_task\": \"EH-BRAND-03\"}, \"docs/NEXT_AGENT.md\": {\"marker_sha256\": \"0c668d0b1a9edd7750a85a04912abde0b752a5bf8ff2fb34ea384f188d76844f\", \"bound_task\": \"EH-BRAND-03\"}, \"docs/PRODUCTION_HANDOVER.md\": {\"marker_sha256\": \"0c668d0b1a9edd7750a85a04912abde0b752a5bf8ff2fb34ea384f188d76844f\", \"bound_task\": \"EH-BRAND-03\"}, \"docs/ARCHITECTURE.md\": {\"marker_sha256\": \"0c668d0b1a9edd7750a85a04912abde0b752a5bf8ff2fb34ea384f188d76844f\", \"bound_task\": \"EH-BRAND-03\"}}}",
    "priority_name": "high",
    "acceptance": [
      "Tatsächliche Entscheidung nach sichtbaren Alternativen dokumentiert; Empfehlung nicht als Nutzerfreigabe ausgeben."
    ],
    "allowed_paths": [],
    "depends_on": [
      "EH-BRAND-02"
    ],
    "dependency_blockers": []
  },
  {
    "id": "EH-BRAND-04",
    "sequence": 132,
    "title": "Zentraler Marken- und Komponentenvertrag aus gewählter Richtung",
    "description": "Operator approved Atelier 02 (PR41) and explicitly requests complete shared design system, larger small text, reusable content/app components and page recipes, DESIGN.md, no autonomous redesign by other agents, corrected sin-frontend-design and new SIN-EH-design skills, repo guards/CI and presentation-generator alignment. Root Codex owns design decisions. Full original steering to be captured in accepted-system spec.",
    "kind": "implement",
    "status": "done",
    "priority": 3,
    "owner": "chatgpt-web",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-05T23:16:16+00:00",
    "updated_at": "2026-09-06T20:09:19+00:00",
    "started_at": "2026-09-06T08:05:26+00:00",
    "completed_at": "2026-09-06T20:09:19+00:00",
    "evidence": "Design and skills delivery: mainPR41 foundation80fbbb2, 49components/8recipes/fullsource; skillsPR101 commit8ffb067 installed with hash receipts on OCI and Mac i9; generatorPR1 d1313a9; CRMPR3 a13fb5c; HubPR1 c2b69d7. PR42 reconciled without deleting work. Further migration/tests/merge gates explicitly assigned to local agents via EH-BRAND-05 children and06 (#43/#44/CRM#4/Hub#2/#45). No merge or deployment.",
    "completion_report": "Design and skills delivery: mainPR41 foundation80fbbb2, 49components/8recipes/fullsource; skillsPR101 commit8ffb067 installed with hash receipts on OCI and Mac i9; generatorPR1 d1313a9; CRMPR3 a13fb5c; HubPR1 c2b69d7. PR42 reconciled without deleting work. Further migration/tests/merge gates explicitly assigned to local agents via EH-BRAND-05 children and06 (#43/#44/CRM#4/Hub#2/#45). No merge or deployment.",
    "blocked_reason": "",
    "revision": 4,
    "completion_contract_version": 1,
    "handover_json": "{\"contract\": \"v1\", \"docs\": {\"AGENTS.md\": {\"marker_sha256\": \"b229edef0936ab22bf0ee20e4ff536318b2982738ad5f569a3361998fa0a24a6\", \"bound_task\": \"EH-BRAND-04\"}, \"README.md\": {\"marker_sha256\": \"b229edef0936ab22bf0ee20e4ff536318b2982738ad5f569a3361998fa0a24a6\", \"bound_task\": \"EH-BRAND-04\"}, \"docs/NEXT_AGENT.md\": {\"marker_sha256\": \"b229edef0936ab22bf0ee20e4ff536318b2982738ad5f569a3361998fa0a24a6\", \"bound_task\": \"EH-BRAND-04\"}, \"docs/PRODUCTION_HANDOVER.md\": {\"marker_sha256\": \"b229edef0936ab22bf0ee20e4ff536318b2982738ad5f569a3361998fa0a24a6\", \"bound_task\": \"EH-BRAND-04\"}, \"docs/ARCHITECTURE.md\": {\"marker_sha256\": \"b229edef0936ab22bf0ee20e4ff536318b2982738ad5f569a3361998fa0a24a6\", \"bound_task\": \"EH-BRAND-04\"}}}",
    "priority_name": "high",
    "acceptance": [
      "Logonutzung, Tokens, Typo, Bilder, Motion, Zustände, Agentenregeln; vollständige aktuelle Quellpakete und Impact-Evidenz vor produktiven Änderungen."
    ],
    "allowed_paths": [],
    "depends_on": [
      "EH-BRAND-03"
    ],
    "dependency_blockers": []
  },
  {
    "id": "EH-BRAND-05",
    "sequence": 133,
    "title": "Website und Apps schrittweise auf ausgewählte Marke konvergieren",
    "description": "Atelier 02 accepted by Jerry on 2026-09-06. Root Codex built canonical system v1, reusable React/native HTML recipes and generator brand adaptation. Remaining product migrations are the explicit child tasks EH-BRAND-05-WEB/APPS/CRM/HUB; they compose the frozen library and MUST NOT redesign. Canonical handoff docs/brand/system/HANDOFF.md. Earlier rejected-study delegation is historical, not the current design authority.",
    "kind": "implement",
    "status": "backlog",
    "priority": 3,
    "owner": "unassigned",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-05T23:16:16+00:00",
    "updated_at": "2026-09-06T09:06:27+00:00",
    "started_at": null,
    "completed_at": null,
    "evidence": "",
    "completion_report": "",
    "blocked_reason": "",
    "revision": 2,
    "completion_contract_version": 0,
    "handover_json": "{}",
    "priority_name": "high",
    "acceptance": [
      "Hero/Lexikon/Kontakt/Footer-Parallel-Arbeit und alle Produktflüsse/Navigation/Auth/Daten erhalten; pro Oberfläche visuelle Abnahme."
    ],
    "allowed_paths": [],
    "depends_on": [
      "EH-BRAND-04",
      "EH-BRAND-05-APPS",
      "EH-BRAND-05-CRM",
      "EH-BRAND-05-HUB",
      "EH-BRAND-05-WEB"
    ],
    "dependency_blockers": [
      "EH-BRAND-05-APPS",
      "EH-BRAND-05-CRM",
      "EH-BRAND-05-HUB",
      "EH-BRAND-05-WEB"
    ]
  },
  {
    "id": "EH-BRAND-05-WEB",
    "sequence": 135,
    "title": "Unterseiten mit Atelier-02-Komponenten vollständig konvergieren",
    "description": "Latest explicit user steering: design library and skills are delivered; local agents own further migration/verification. Exact issue: https://github.com/Delqhi/einfach-hausen/issues/43. Main PR41 foundation80fbbb2; skills PR101 installed OCI/Mac i9. Read DESIGN.md, SIN-EH-design and full per-repo docs/brand/system/SOURCE.md before changes. No autonomous design, no weakening guard/seal/baseline. Preserve backend/auth/routes and other agent work.",
    "kind": "implement",
    "status": "backlog",
    "priority": 3,
    "owner": "local-agent",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-06T09:06:25+00:00",
    "updated_at": "2026-09-06T20:09:17+00:00",
    "started_at": null,
    "completed_at": null,
    "evidence": "",
    "completion_report": "",
    "blocked_reason": "",
    "revision": 2,
    "completion_contract_version": 0,
    "handover_json": "{}",
    "priority_name": "high",
    "acceptance": [
      "Jede migrierte Route verwendet kanonische Bausteine; 390/736/1440 Screens persönlich geprüft; keine neuen Designverstöße; Navigation, Intake und SEO unverändert; vollständiger Code-Handoff."
    ],
    "allowed_paths": [
      "src/app/",
      "src/components/marketing/",
      "src/lib/lexikon.ts",
      "docs/brand/"
    ],
    "depends_on": [
      "EH-BRAND-04"
    ],
    "dependency_blockers": []
  },
  {
    "id": "EH-BRAND-05-APPS",
    "sequence": 136,
    "title": "Owner- und Handwerker-Screens auf verbindliche UI-Bibliothek migrieren",
    "description": "Latest explicit user steering: design library and skills are delivered; local agents own further migration/verification. Exact issue: https://github.com/Delqhi/einfach-hausen/issues/44. Main PR41 foundation80fbbb2; skills PR101 installed OCI/Mac i9. Read DESIGN.md, SIN-EH-design and full per-repo docs/brand/system/SOURCE.md before changes. No autonomous design, no weakening guard/seal/baseline. Preserve backend/auth/routes and other agent work.",
    "kind": "implement",
    "status": "backlog",
    "priority": 3,
    "owner": "local-agent",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-06T09:06:26+00:00",
    "updated_at": "2026-09-06T20:09:17+00:00",
    "started_at": null,
    "completed_at": null,
    "evidence": "",
    "completion_report": "",
    "blocked_reason": "",
    "revision": 2,
    "completion_contract_version": 0,
    "handover_json": "{}",
    "priority_name": "high",
    "acceptance": [
      "Reale Owner/Provider-Testkonten und Rollenisolierung geprüft; bestehende Navigation bleibt; kanonische Komponenten für migrierte Flächen; mobile Eingaben >=16px; keine kleinen Metadaten; vollständige Quelldateien und Prüfevidence."
    ],
    "allowed_paths": [
      "src/app/app/",
      "src/app/pro/",
      "src/components/homeowner/",
      "src/components/provider/",
      "docs/brand/"
    ],
    "depends_on": [
      "EH-BRAND-04"
    ],
    "dependency_blockers": []
  },
  {
    "id": "EH-BRAND-05-CRM",
    "sequence": 137,
    "title": "Standalone CRM mit dem kanonischen HTML-Adapter ausstatten",
    "description": "Latest explicit user steering: design library and skills are delivered; local agents own further migration/verification. Exact issue: https://github.com/einfachhausen-de/einfach-hausen-crm/issues/4. Main PR41 foundation80fbbb2; skills PR101 installed OCI/Mac i9. Read DESIGN.md, SIN-EH-design and full per-repo docs/brand/system/SOURCE.md before changes. No autonomous design, no weakening guard/seal/baseline. Preserve backend/auth/routes and other agent work.",
    "kind": "implement",
    "status": "backlog",
    "priority": 3,
    "owner": "local-agent",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-06T09:06:26+00:00",
    "updated_at": "2026-09-06T20:09:18+00:00",
    "started_at": null,
    "completed_at": null,
    "evidence": "",
    "completion_report": "",
    "blocked_reason": "",
    "revision": 2,
    "completion_contract_version": 0,
    "handover_json": "{}",
    "priority_name": "high",
    "acceptance": [
      "Identische Hashes zum kanonischen Paket; native UI verwendet Original-Logo/Inter/Marken-CSS; npm test, npm run check, npm run cf:dry-run und Browserprüfung; keine Outreach-/Datenänderung; voller Code im Handoff."
    ],
    "allowed_paths": [
      "src/ui.js",
      "src/eh-brand-adapter.mjs",
      "docs/brand/",
      "docs/NEXT_AGENT.md"
    ],
    "depends_on": [
      "EH-BRAND-04"
    ],
    "dependency_blockers": []
  },
  {
    "id": "EH-BRAND-05-HUB",
    "sequence": 138,
    "title": "Portalhub mit derselben Einfachhausen-Bibliothek migrieren",
    "description": "Latest explicit user steering: design library and skills are delivered; local agents own further migration/verification. Exact issue: https://github.com/einfachhausen-de/portalhub/issues/2. Main PR41 foundation80fbbb2; skills PR101 installed OCI/Mac i9. Read DESIGN.md, SIN-EH-design and full per-repo docs/brand/system/SOURCE.md before changes. No autonomous design, no weakening guard/seal/baseline. Preserve backend/auth/routes and other agent work.",
    "kind": "implement",
    "status": "backlog",
    "priority": 3,
    "owner": "local-agent",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-06T09:06:27+00:00",
    "updated_at": "2026-09-06T20:09:18+00:00",
    "started_at": null,
    "completed_at": null,
    "evidence": "",
    "completion_report": "",
    "blocked_reason": "",
    "revision": 2,
    "completion_contract_version": 0,
    "handover_json": "{}",
    "priority_name": "high",
    "acceptance": [
      "Projektverzeichnis, Detail, Formular, Aktivität und Einstellungen nutzen dieselbe Marke; echte Handler bleiben; npm run typecheck/lint/build plus responsive Screens; vollständiger Quellcode und Hashprüfung."
    ],
    "allowed_paths": [
      "src/app/",
      "src/components/",
      "src/design-system.ts",
      "docs/brand/",
      "NEXT_AGENT.md"
    ],
    "depends_on": [
      "EH-BRAND-04"
    ],
    "dependency_blockers": []
  },
  {
    "id": "EH-BRAND-06",
    "sequence": 134,
    "title": "Markenregression und belastbare Release-Evidenz",
    "description": "Latest explicit user steering: design library and skills are delivered; local agents own further migration/verification. Exact issue: https://github.com/Delqhi/einfach-hausen/issues/45. Main PR41 foundation80fbbb2; skills PR101 installed OCI/Mac i9. Read DESIGN.md, SIN-EH-design and full per-repo docs/brand/system/SOURCE.md before changes. No autonomous design, no weakening guard/seal/baseline. Preserve backend/auth/routes and other agent work. Activate public main required design status only after workflow integration; verify and consolidate PR42, inspect historic presentation/premium, complete current regression. Private Free-org403 is a real protection limitation. No new tests by root after user redirection. No merge/deployment claimed. GitNexus CRM alias was not registered; register exact checkout before graph checks.",
    "kind": "test",
    "status": "backlog",
    "priority": 3,
    "owner": "local-agent",
    "created_by": "chatgpt-web",
    "created_at": "2026-09-05T23:16:17+00:00",
    "updated_at": "2026-09-06T20:09:19+00:00",
    "started_at": null,
    "completed_at": null,
    "evidence": "",
    "completion_report": "",
    "blocked_reason": "",
    "revision": 2,
    "completion_contract_version": 0,
    "handover_json": "{}",
    "priority_name": "high",
    "acceptance": [
      "Aktuelle funktionale/visuelle/A11y/Responsive-Gates, T-0151 und Issue #33 verknüpft, keine unbewiesenen Baseline- oder Deploy-Erfolgsaussagen."
    ],
    "allowed_paths": [],
    "depends_on": [
      "EH-BRAND-05"
    ],
    "dependency_blockers": [
      "EH-BRAND-05"
    ]
  }
]

`````

## docs/brand/evidence/system/impact-HomeHero.txt

`````text
{
  "target": {
    "id": "Function:src/components/marketing/home-hero.tsx:HomeHero",
    "name": "HomeHero",
    "type": "Function",
    "filePath": "src/components/marketing/home-hero.tsx"
  },
  "direction": "upstream",
  "impactedCount": 1,
  "risk": "LOW",
  "epistemic": "exact",
  "summary": {
    "direct": 1,
    "processes_affected": 1,
    "modules_affected": 1
  },
  "byDepthCounts": {
    "1": 1
  },
  "affected_processes": [
    {
      "name": "HomePage",
      "type": "Function",
      "filePath": "src/app/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    }
  ],
  "affected_modules": [
    {
      "name": "Marketing",
      "hits": 1,
      "impact": "direct"
    }
  ],
  "byDepth": {
    "1": [
      {
        "depth": 1,
        "id": "Function:src/app/page.tsx:HomePage",
        "name": "HomePage",
        "filePath": "src/app/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_40_homepage",
            "label": "HomePage → S",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_373_homepage",
            "label": "HomePage → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_374_homepage",
            "label": "HomePage → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_41_homepage",
            "label": "HomePage → SetRail",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_370_homepage",
            "label": "HomePage → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      }
    ]
  },
  "staleness": {
    "commitsBehind": 2,
    "hint": "⚠️ Index is 2 commits behind HEAD. Run analyze tool to update."
  }
}

`````

## docs/brand/evidence/system/impact-MarketingShell.txt

`````text
{
  "target": {
    "id": "Function:src/components/marketing/site-shell.tsx:MarketingShell",
    "name": "MarketingShell",
    "type": "Function",
    "filePath": "src/components/marketing/site-shell.tsx"
  },
  "direction": "upstream",
  "impactedCount": 32,
  "risk": "CRITICAL",
  "epistemic": "exact",
  "summary": {
    "direct": 24,
    "processes_affected": 21,
    "modules_affected": 3
  },
  "byDepthCounts": {
    "1": 24,
    "2": 8
  },
  "affected_processes": [
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/blog/[slug]/page.tsx",
      "affected_process_count": 6,
      "total_hits": 6,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/blog/page.tsx",
      "affected_process_count": 6,
      "total_hits": 6,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/leistungen/page.tsx",
      "affected_process_count": 6,
      "total_hits": 6,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/agb/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/barrierefreiheit/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/datenschutz/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/eigenheimbesitzer/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/hausakte/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/hilfe/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/impressum/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/kontakt/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "HomePage",
      "type": "Function",
      "filePath": "src/app/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/partner/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "PilotphasePage",
      "type": "Function",
      "filePath": "src/app/pilotphase/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/preise/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/sicherheit/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/so-funktionierts/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/ueber-uns/page.tsx",
      "affected_process_count": 5,
      "total_hits": 5,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/lexikon/page.tsx",
      "affected_process_count": 4,
      "total_hits": 4,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/lexikon/kategorie/[kategorie]/page.tsx",
      "affected_process_count": 3,
      "total_hits": 3,
      "earliest_broken_step": 1
    },
    {
      "name": "Page",
      "type": "Function",
      "filePath": "src/app/lexikon/[begriff]/page.tsx",
      "affected_process_count": 1,
      "total_hits": 1,
      "earliest_broken_step": 1
    }
  ],
  "affected_modules": [
    {
      "name": "Marketing",
      "hits": 24,
      "impact": "direct"
    },
    {
      "name": "[slug]",
      "hits": 7,
      "impact": "direct"
    },
    {
      "name": "Lexikon",
      "hits": 1,
      "impact": "direct"
    }
  ],
  "byDepth": {
    "1": [
      {
        "depth": 1,
        "id": "Function:src/app/agb/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/agb/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_52_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_53_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_37_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_36_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_51_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/barrierefreiheit/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/barrierefreiheit/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_98_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_106_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_108_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_107_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_97_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/blog/[slug]/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/blog/[slug]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_136_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_129_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_138_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_68_page",
            "label": "Page → Canonical",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_130_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_137_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/blog/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/blog/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_162_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_156_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_161_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_157_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_113_page",
            "label": "Page → Canonical",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_163_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/datenschutz/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/datenschutz/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_187_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_181_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_180_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_185_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_186_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/eigenheimbesitzer/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/eigenheimbesitzer/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_204_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_205_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_209_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_210_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_211_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/hausakte/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/hausakte/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_228_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_233_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_227_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_231_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_232_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/hilfe/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/hilfe/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_249_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_250_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_254_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_253_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_255_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/impressum/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/impressum/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_271_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_274_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_275_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_276_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_270_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/kontakt/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/kontakt/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_295_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_297_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_291_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_292_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_296_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/leistungen/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/leistungen/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_313_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_318_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_142_page",
            "label": "Page → Canonical",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_312_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_316_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_317_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/lexikon/[begriff]/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/lexikon/[begriff]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_70_page",
            "label": "Page → SafeDecode",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/lexikon/kategorie/[kategorie]/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/lexikon/kategorie/[kategorie]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_333_page",
            "label": "Page → Update",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_337_page",
            "label": "Page → SmoothScroll",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_336_page",
            "label": "Page → IntakeForm",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/lexikon/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/lexikon/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_71_page",
            "label": "Page → RegisterBuchstabe",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_356_page",
            "label": "Page → IntakeForm",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_353_page",
            "label": "Page → Update",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_357_page",
            "label": "Page → SmoothScroll",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/page.tsx:HomePage",
        "name": "HomePage",
        "filePath": "src/app/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_373_homepage",
            "label": "HomePage → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_374_homepage",
            "label": "HomePage → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_40_homepage",
            "label": "HomePage → S",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_41_homepage",
            "label": "HomePage → SetRail",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_370_homepage",
            "label": "HomePage → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/partner/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/partner/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_391_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_338_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_387_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_334_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_390_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/pilotphase/page.tsx:PilotphasePage",
        "name": "PilotphasePage",
        "filePath": "src/app/pilotphase/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_404_pilotphasepage",
            "label": "PilotphasePage → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_407_pilotphasepage",
            "label": "PilotphasePage → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_408_pilotphasepage",
            "label": "PilotphasePage → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_354_pilotphasepage",
            "label": "PilotphasePage → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_358_pilotphasepage",
            "label": "PilotphasePage → Eyebrow",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/preise/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/preise/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_419_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_371_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_423_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_375_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_422_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/sicherheit/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/sicherheit/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_392_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_388_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_438_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_434_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_437_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/so-funktionierts/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/so-funktionierts/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_449_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_451_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_452_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_405_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_409_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/app/ueber-uns/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/ueber-uns/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_420_page",
            "label": "Page → AnimateIn",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_462_page",
            "label": "Page → IntakeForm",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_424_page",
            "label": "Page → Eyebrow",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_463_page",
            "label": "Page → SmoothScroll",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_460_page",
            "label": "Page → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/components/marketing/lexikon/lexikon-not-found.tsx:LexikonNotFound",
        "name": "LexikonNotFound",
        "filePath": "src/components/marketing/lexikon/lexikon-not-found.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 1,
        "id": "Function:src/components/marketing/product-story-page.tsx:ProductStoryPage",
        "name": "ProductStoryPage",
        "filePath": "src/components/marketing/product-story-page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 1,
        "id": "Function:src/components/marketing/service-detail-page.tsx:ServiceDetailPage",
        "name": "ServiceDetailPage",
        "filePath": "src/components/marketing/service-detail-page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      }
    ],
    "2": [
      {
        "depth": 2,
        "id": "Function:src/app/beratung/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/beratung/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/immobilienverkauf/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/immobilienverkauf/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/leistungen/[slug]/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/leistungen/[slug]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/leistungen/heizung/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/leistungen/heizung/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/lexikon/not-found.tsx:NotFound",
        "name": "NotFound",
        "filePath": "src/app/lexikon/not-found.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/not-found.tsx:NotFound",
        "name": "NotFound",
        "filePath": "src/app/not-found.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/notfall/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/notfall/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 2,
        "id": "Function:src/app/versicherung/page.tsx:Page",
        "name": "Page",
        "filePath": "src/app/versicherung/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      }
    ]
  },
  "staleness": {
    "commitsBehind": 2,
    "hint": "⚠️ Index is 2 commits behind HEAD. Run analyze tool to update."
  }
}

`````

## docs/brand/evidence/system/impact-generator-Phone.txt

`````text
{
  "target": {
    "id": "Function:src/components/slides/SlideRenderer.tsx:Phone",
    "name": "Phone",
    "type": "Function",
    "filePath": "src/components/slides/SlideRenderer.tsx"
  },
  "direction": "upstream",
  "impactedCount": 5,
  "risk": "CRITICAL",
  "epistemic": "exact",
  "summary": {
    "direct": 2,
    "processes_affected": 7,
    "modules_affected": 2
  },
  "byDepthCounts": {
    "1": 2,
    "2": 1,
    "3": 2
  },
  "affected_processes": [
    {
      "name": "EditorPage",
      "type": "Function",
      "filePath": "src/app/editor/[id]/page.tsx",
      "affected_process_count": 4,
      "total_hits": 10,
      "earliest_broken_step": 3
    },
    {
      "name": "PresentPage",
      "type": "Function",
      "filePath": "src/app/present/[id]/page.tsx",
      "affected_process_count": 4,
      "total_hits": 9,
      "earliest_broken_step": 3
    },
    {
      "name": "PrintPage",
      "type": "Function",
      "filePath": "src/app/print/[id]/page.tsx",
      "affected_process_count": 4,
      "total_hits": 9,
      "earliest_broken_step": 1
    },
    {
      "name": "Editor",
      "type": "Function",
      "filePath": "src/components/Editor.tsx",
      "affected_process_count": 2,
      "total_hits": 4,
      "earliest_broken_step": 2
    },
    {
      "name": "DeckPlayer",
      "type": "Function",
      "filePath": "src/components/slides/DeckPlayer.tsx",
      "affected_process_count": 1,
      "total_hits": 2,
      "earliest_broken_step": 2
    },
    {
      "name": "SplitLayout",
      "type": "Function",
      "filePath": "src/components/slides/SlideRenderer.tsx",
      "affected_process_count": 2,
      "total_hits": 2,
      "earliest_broken_step": 1
    },
    {
      "name": "SlideRenderer",
      "type": "Function",
      "filePath": "src/components/slides/SlideRenderer.tsx",
      "affected_process_count": 1,
      "total_hits": 1,
      "earliest_broken_step": 1
    }
  ],
  "affected_modules": [
    {
      "name": "Slides",
      "hits": 4,
      "impact": "direct"
    },
    {
      "name": "[id]",
      "hits": 1,
      "impact": "indirect"
    }
  ],
  "byDepth": {
    "1": [
      {
        "depth": 1,
        "id": "Function:src/components/slides/SlideRenderer.tsx:SplitLayout",
        "name": "SplitLayout",
        "filePath": "src/components/slides/SlideRenderer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_68_splitlayout",
            "label": "SplitLayout → Rv",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_61_splitlayout",
            "label": "SplitLayout → Cls",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/components/slides/SlideRenderer.tsx:TitleLayout",
        "name": "TitleLayout",
        "filePath": "src/components/slides/SlideRenderer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 5
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 5
          },
          {
            "id": "proc_36_printpage",
            "label": "PrintPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 5
          }
        ]
      }
    ],
    "2": [
      {
        "depth": 2,
        "id": "Function:src/components/slides/SlideRenderer.tsx:SlideRenderer",
        "name": "SlideRenderer",
        "filePath": "src/components/slides/SlideRenderer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_38_printpage",
            "label": "PrintPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_36_printpage",
            "label": "PrintPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_55_sliderenderer",
            "label": "SlideRenderer → Rv",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_44_printpage",
            "label": "PrintPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_49_printpage",
            "label": "PrintPage → Rv",
            "processType": "cross_community",
            "step": 2
          }
        ]
      }
    ],
    "3": [
      {
        "depth": 3,
        "id": "Function:src/app/print/[id]/page.tsx:PrintPage",
        "name": "PrintPage",
        "filePath": "src/app/print/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_44_printpage",
            "label": "PrintPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_49_printpage",
            "label": "PrintPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_36_printpage",
            "label": "PrintPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_38_printpage",
            "label": "PrintPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 3,
        "id": "Function:src/components/slides/AnimatedSlide.tsx:AnimatedSlide",
        "name": "AnimatedSlide",
        "filePath": "src/components/slides/AnimatedSlide.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 2
          }
        ]
      }
    ]
  }
}

`````

## docs/brand/evidence/system/impact-generator-RootLayout.txt

`````text
{
  "target": {
    "id": "Function:src/app/layout.tsx:RootLayout",
    "name": "RootLayout",
    "type": "Function",
    "filePath": "src/app/layout.tsx"
  },
  "direction": "upstream",
  "impactedCount": 0,
  "risk": "UNKNOWN",
  "riskNote": "No callers resolved. Absence of edges is not evidence the symbol is unused: a caller reaching it through a reference class this index does not record — plain-object property access, a bare-identifier read of a module-scope const — produces no edge to find. Confirm with a text search before treating the change as safe.",
  "epistemic": "exact",
  "summary": {
    "direct": 0,
    "processes_affected": 0,
    "modules_affected": 0
  },
  "byDepthCounts": {},
  "affected_processes": [],
  "affected_modules": [],
  "byDepth": {}
}

`````

## docs/brand/evidence/system/impact-generator-RoutePresentation.txt

`````text
{
  "target": {
    "id": "Function:src/remotion/RoutePresentation.tsx:RoutePresentation",
    "name": "RoutePresentation",
    "type": "Function",
    "filePath": "src/remotion/RoutePresentation.tsx"
  },
  "direction": "upstream",
  "impactedCount": 0,
  "risk": "UNKNOWN",
  "riskNote": "No callers resolved. Absence of edges is not evidence the symbol is unused: a caller reaching it through a reference class this index does not record — plain-object property access, a bare-identifier read of a module-scope const — produces no edge to find. Confirm with a text search before treating the change as safe.",
  "epistemic": "exact",
  "summary": {
    "direct": 0,
    "processes_affected": 0,
    "modules_affected": 0
  },
  "byDepthCounts": {},
  "affected_processes": [],
  "affected_modules": [],
  "byDepth": {}
}

`````

## docs/brand/evidence/system/impact-generator-SlideFrame.txt

`````text
{
  "target": {
    "id": "Function:src/components/slides/SlideFrame.tsx:SlideFrame",
    "name": "SlideFrame",
    "type": "Function",
    "filePath": "src/components/slides/SlideFrame.tsx"
  },
  "direction": "upstream",
  "impactedCount": 4,
  "risk": "HIGH",
  "epistemic": "exact",
  "summary": {
    "direct": 2,
    "processes_affected": 4,
    "modules_affected": 2
  },
  "byDepthCounts": {
    "1": 2,
    "2": 2
  },
  "affected_processes": [
    {
      "name": "EditorPage",
      "type": "Function",
      "filePath": "src/app/editor/[id]/page.tsx",
      "affected_process_count": 7,
      "total_hits": 14,
      "earliest_broken_step": 1
    },
    {
      "name": "PresentPage",
      "type": "Function",
      "filePath": "src/app/present/[id]/page.tsx",
      "affected_process_count": 6,
      "total_hits": 12,
      "earliest_broken_step": 1
    },
    {
      "name": "Editor",
      "type": "Function",
      "filePath": "src/components/Editor.tsx",
      "affected_process_count": 2,
      "total_hits": 2,
      "earliest_broken_step": 1
    },
    {
      "name": "DeckPlayer",
      "type": "Function",
      "filePath": "src/components/slides/DeckPlayer.tsx",
      "affected_process_count": 1,
      "total_hits": 1,
      "earliest_broken_step": 1
    }
  ],
  "affected_modules": [
    {
      "name": "Components",
      "hits": 2,
      "impact": "direct"
    },
    {
      "name": "Slides",
      "hits": 2,
      "impact": "direct"
    }
  ],
  "byDepth": {
    "1": [
      {
        "depth": 1,
        "id": "Function:src/components/Editor.tsx:Editor",
        "name": "Editor",
        "filePath": "src/components/Editor.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_33_editorpage",
            "label": "EditorPage → Logo",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_21_editorpage",
            "label": "EditorPage → SlideToJson",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_13_editorpage",
            "label": "EditorPage → Update",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/components/slides/DeckPlayer.tsx:DeckPlayer",
        "name": "DeckPlayer",
        "filePath": "src/components/slides/DeckPlayer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_29_presentpage",
            "label": "PresentPage → Update",
            "processType": "intra_community",
            "step": 2
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_22_presentpage",
            "label": "PresentPage → Go",
            "processType": "intra_community",
            "step": 2
          }
        ]
      }
    ],
    "2": [
      {
        "depth": 2,
        "id": "Function:src/app/editor/[id]/page.tsx:EditorPage",
        "name": "EditorPage",
        "filePath": "src/app/editor/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_13_editorpage",
            "label": "EditorPage → Update",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_21_editorpage",
            "label": "EditorPage → SlideToJson",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_33_editorpage",
            "label": "EditorPage → Logo",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 2,
        "id": "Function:src/app/present/[id]/page.tsx:PresentPage",
        "name": "PresentPage",
        "filePath": "src/app/present/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_22_presentpage",
            "label": "PresentPage → Go",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_29_presentpage",
            "label": "PresentPage → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      }
    ]
  }
}

`````

## docs/brand/evidence/system/impact-generator-SlideRenderer.txt

`````text
{
  "target": {
    "id": "Function:src/components/slides/SlideRenderer.tsx:SlideRenderer",
    "name": "SlideRenderer",
    "type": "Function",
    "filePath": "src/components/slides/SlideRenderer.tsx"
  },
  "direction": "upstream",
  "impactedCount": 6,
  "risk": "CRITICAL",
  "epistemic": "exact",
  "summary": {
    "direct": 2,
    "processes_affected": 5,
    "modules_affected": 3
  },
  "byDepthCounts": {
    "1": 2,
    "2": 2,
    "3": 2
  },
  "affected_processes": [
    {
      "name": "EditorPage",
      "type": "Function",
      "filePath": "src/app/editor/[id]/page.tsx",
      "affected_process_count": 7,
      "total_hits": 18,
      "earliest_broken_step": 1
    },
    {
      "name": "PresentPage",
      "type": "Function",
      "filePath": "src/app/present/[id]/page.tsx",
      "affected_process_count": 6,
      "total_hits": 16,
      "earliest_broken_step": 1
    },
    {
      "name": "PrintPage",
      "type": "Function",
      "filePath": "src/app/print/[id]/page.tsx",
      "affected_process_count": 4,
      "total_hits": 4,
      "earliest_broken_step": 1
    },
    {
      "name": "Editor",
      "type": "Function",
      "filePath": "src/components/Editor.tsx",
      "affected_process_count": 2,
      "total_hits": 4,
      "earliest_broken_step": 1
    },
    {
      "name": "DeckPlayer",
      "type": "Function",
      "filePath": "src/components/slides/DeckPlayer.tsx",
      "affected_process_count": 1,
      "total_hits": 2,
      "earliest_broken_step": 1
    }
  ],
  "affected_modules": [
    {
      "name": "Slides",
      "hits": 3,
      "impact": "direct"
    },
    {
      "name": "Components",
      "hits": 2,
      "impact": "indirect"
    },
    {
      "name": "[id]",
      "hits": 1,
      "impact": "direct"
    }
  ],
  "byDepth": {
    "1": [
      {
        "depth": 1,
        "id": "Function:src/app/print/[id]/page.tsx:PrintPage",
        "name": "PrintPage",
        "filePath": "src/app/print/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_44_printpage",
            "label": "PrintPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_49_printpage",
            "label": "PrintPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_36_printpage",
            "label": "PrintPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_38_printpage",
            "label": "PrintPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/components/slides/AnimatedSlide.tsx:AnimatedSlide",
        "name": "AnimatedSlide",
        "filePath": "src/components/slides/AnimatedSlide.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 2
          }
        ]
      }
    ],
    "2": [
      {
        "depth": 2,
        "id": "Function:src/components/Editor.tsx:Editor",
        "name": "Editor",
        "filePath": "src/components/Editor.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_33_editorpage",
            "label": "EditorPage → Logo",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_21_editorpage",
            "label": "EditorPage → SlideToJson",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_13_editorpage",
            "label": "EditorPage → Update",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 2,
        "id": "Function:src/components/slides/DeckPlayer.tsx:DeckPlayer",
        "name": "DeckPlayer",
        "filePath": "src/components/slides/DeckPlayer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_29_presentpage",
            "label": "PresentPage → Update",
            "processType": "intra_community",
            "step": 2
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_22_presentpage",
            "label": "PresentPage → Go",
            "processType": "intra_community",
            "step": 2
          }
        ]
      }
    ],
    "3": [
      {
        "depth": 3,
        "id": "Function:src/app/editor/[id]/page.tsx:EditorPage",
        "name": "EditorPage",
        "filePath": "src/app/editor/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_13_editorpage",
            "label": "EditorPage → Update",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_21_editorpage",
            "label": "EditorPage → SlideToJson",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_33_editorpage",
            "label": "EditorPage → Logo",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 3,
        "id": "Function:src/app/present/[id]/page.tsx:PresentPage",
        "name": "PresentPage",
        "filePath": "src/app/present/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_22_presentpage",
            "label": "PresentPage → Go",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_29_presentpage",
            "label": "PresentPage → Update",
            "processType": "intra_community",
            "step": 1
          }
        ]
      }
    ]
  }
}

`````

## docs/brand/evidence/system/impact-generator-surfaceStyle.txt

`````text
{
  "target": {
    "id": "Function:src/lib/slides/theme.ts:surfaceStyle",
    "name": "surfaceStyle",
    "type": "Function",
    "filePath": "src/lib/slides/theme.ts"
  },
  "direction": "upstream",
  "impactedCount": 7,
  "risk": "CRITICAL",
  "epistemic": "exact",
  "summary": {
    "direct": 3,
    "processes_affected": 7,
    "modules_affected": 3
  },
  "byDepthCounts": {
    "1": 3,
    "2": 2,
    "3": 2
  },
  "affected_processes": [
    {
      "name": "EditorPage",
      "type": "Function",
      "filePath": "src/app/editor/[id]/page.tsx",
      "affected_process_count": 7,
      "total_hits": 15,
      "earliest_broken_step": 2
    },
    {
      "name": "PresentPage",
      "type": "Function",
      "filePath": "src/app/present/[id]/page.tsx",
      "affected_process_count": 6,
      "total_hits": 14,
      "earliest_broken_step": 2
    },
    {
      "name": "PrintPage",
      "type": "Function",
      "filePath": "src/app/print/[id]/page.tsx",
      "affected_process_count": 4,
      "total_hits": 8,
      "earliest_broken_step": 1
    },
    {
      "name": "Editor",
      "type": "Function",
      "filePath": "src/components/Editor.tsx",
      "affected_process_count": 2,
      "total_hits": 6,
      "earliest_broken_step": 1
    },
    {
      "name": "DeckPlayer",
      "type": "Function",
      "filePath": "src/components/slides/DeckPlayer.tsx",
      "affected_process_count": 1,
      "total_hits": 3,
      "earliest_broken_step": 1
    },
    {
      "name": "ComparisonLayout",
      "type": "Function",
      "filePath": "src/components/slides/SlideRenderer.tsx",
      "affected_process_count": 2,
      "total_hits": 2,
      "earliest_broken_step": 1
    },
    {
      "name": "SlideRenderer",
      "type": "Function",
      "filePath": "src/components/slides/SlideRenderer.tsx",
      "affected_process_count": 1,
      "total_hits": 1,
      "earliest_broken_step": 1
    }
  ],
  "affected_modules": [
    {
      "name": "Slides",
      "hits": 5,
      "impact": "direct"
    },
    {
      "name": "Components",
      "hits": 1,
      "impact": "indirect"
    },
    {
      "name": "[id]",
      "hits": 1,
      "impact": "indirect"
    }
  ],
  "byDepth": {
    "1": [
      {
        "depth": 1,
        "id": "Function:src/components/slides/SlideRenderer.tsx:ComparisonLayout",
        "name": "ComparisonLayout",
        "filePath": "src/components/slides/SlideRenderer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_56_comparisonlayout",
            "label": "ComparisonLayout → Cls",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_64_comparisonlayout",
            "label": "ComparisonLayout → Rv",
            "processType": "intra_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 1,
        "id": "Function:src/components/slides/SlideRenderer.tsx:ImageLayout",
        "name": "ImageLayout",
        "filePath": "src/components/slides/SlideRenderer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": []
      },
      {
        "depth": 1,
        "id": "Function:src/components/slides/SlideRenderer.tsx:SlideRenderer",
        "name": "SlideRenderer",
        "filePath": "src/components/slides/SlideRenderer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_38_printpage",
            "label": "PrintPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_36_printpage",
            "label": "PrintPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_55_sliderenderer",
            "label": "SlideRenderer → Rv",
            "processType": "intra_community",
            "step": 1
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 4
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_44_printpage",
            "label": "PrintPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_49_printpage",
            "label": "PrintPage → Rv",
            "processType": "cross_community",
            "step": 2
          }
        ]
      }
    ],
    "2": [
      {
        "depth": 2,
        "id": "Function:src/app/print/[id]/page.tsx:PrintPage",
        "name": "PrintPage",
        "filePath": "src/app/print/[id]/page.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_44_printpage",
            "label": "PrintPage → Cls",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_49_printpage",
            "label": "PrintPage → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_36_printpage",
            "label": "PrintPage → CheckIcon",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_38_printpage",
            "label": "PrintPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 2,
        "id": "Function:src/components/slides/AnimatedSlide.tsx:AnimatedSlide",
        "name": "AnimatedSlide",
        "filePath": "src/components/slides/AnimatedSlide.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 3
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 2
          }
        ]
      }
    ],
    "3": [
      {
        "depth": 3,
        "id": "Function:src/components/Editor.tsx:Editor",
        "name": "Editor",
        "filePath": "src/components/Editor.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_2_editorpage",
            "label": "EditorPage → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_3_editorpage",
            "label": "EditorPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_33_editorpage",
            "label": "EditorPage → Logo",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_4_editorpage",
            "label": "EditorPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_21_editorpage",
            "label": "EditorPage → SlideToJson",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_34_editor",
            "label": "Editor → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_10_editorpage",
            "label": "EditorPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_13_editorpage",
            "label": "EditorPage → Update",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_35_editor",
            "label": "Editor → Cls",
            "processType": "cross_community",
            "step": 1
          }
        ]
      },
      {
        "depth": 3,
        "id": "Function:src/components/slides/DeckPlayer.tsx:DeckPlayer",
        "name": "DeckPlayer",
        "filePath": "src/components/slides/DeckPlayer.tsx",
        "relationType": "CALLS",
        "confidence": 0.85,
        "processes": [
          {
            "id": "proc_25_presentpage",
            "label": "PresentPage → Cls",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_26_presentpage",
            "label": "PresentPage → CheckIcon",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_29_presentpage",
            "label": "PresentPage → Update",
            "processType": "intra_community",
            "step": 2
          },
          {
            "id": "proc_43_deckplayer",
            "label": "DeckPlayer → Rv",
            "processType": "cross_community",
            "step": 1
          },
          {
            "id": "proc_24_presentpage",
            "label": "PresentPage → Rv",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_28_presentpage",
            "label": "PresentPage → SurfaceStyle",
            "processType": "cross_community",
            "step": 2
          },
          {
            "id": "proc_22_presentpage",
            "label": "PresentPage → Go",
            "processType": "intra_community",
            "step": 2
          }
        ]
      }
    ]
  }
}

`````

## docs/brand/evidence/system/mac-skill-install.json

`````json
{
  "status": "EH_SKILLS_INSTALLED",
  "commit": "8ffb067167c72c22a42dbb4fb1e7270956fdb1db",
  "backup": "/Users/jeremyschulze/.local/share/eh-design-backups/20260906T200623Z",
  "paths": [
    "/Users/jeremyschulze/.codex/skills/sin-eh-design",
    "/Users/jeremyschulze/.codex/skills/sin-frontend-design",
    "/Users/jeremyschulze/.config/opencode/skills/sin-eh-design",
    "/Users/jeremyschulze/.config/opencode/skills/sin-frontend-design"
  ],
  "rules": {
    "/Users/jeremyschulze/.codex/AGENTS.md": "c08d2d06b09ca16c7c38953483aeaaba374cb893fb854633e09e4d39838182e1",
    "/Users/jeremyschulze/.config/opencode/AGENTS.md": "aeb3fcf3a55b53d04e7e31cf8f55bfec1bf51733fb71841ada31338b296cd8ca"
  }
}

`````

## docs/brand/evidence/system/migration-tasks.json

`````json
[
  {
    "id": "EH-BRAND-05-WEB",
    "exit": 0,
    "output": "EH-BRAND-05-WEB\n",
    "error": ""
  },
  {
    "id": "EH-BRAND-05-APPS",
    "exit": 0,
    "output": "EH-BRAND-05-APPS\n",
    "error": ""
  },
  {
    "id": "EH-BRAND-05-CRM",
    "exit": 0,
    "output": "EH-BRAND-05-CRM\n",
    "error": ""
  },
  {
    "id": "EH-BRAND-05-HUB",
    "exit": 0,
    "output": "EH-BRAND-05-HUB\n",
    "error": ""
  }
]

`````

## docs/brand/evidence/system/oci-skill-install.json

`````json
{
  "status": "EH_SKILLS_INSTALLED",
  "commit": "8ffb067167c72c22a42dbb4fb1e7270956fdb1db",
  "backup": "/home/ubuntu/.local/share/eh-design-backups/20260906T200459Z",
  "paths": [
    "/home/ubuntu/.codex/skills/sin-eh-design",
    "/home/ubuntu/.codex/skills/sin-frontend-design",
    "/home/ubuntu/.config/opencode/skills/sin-eh-design",
    "/home/ubuntu/.config/opencode/skills/sin-frontend-design"
  ],
  "rules": {
    "/home/ubuntu/.codex/AGENTS.md": "c97a015193565dea73e181180c2275de3341c1bd5fd2dcec14d24f0a8cd63060",
    "/home/ubuntu/.config/opencode/AGENTS.md": "aeb3fcf3a55b53d04e7e31cf8f55bfec1bf51733fb71841ada31338b296cd8ca"
  }
}

`````

## docs/brand/evidence/system/public-pages.json

`````json
{
  "results": [
    {
      "route": "/",
      "width": 390,
      "status": 200,
      "overflow": false,
      "h1": "Dein Haus.Einfachgeregelt.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/leistungen/heizung",
      "width": 390,
      "status": 200,
      "overflow": false,
      "h1": "Heizung, Klima & Energie: einfach anfangen, ohne das Gewerk kennen zu müssen.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/hilfe",
      "width": 390,
      "status": 200,
      "overflow": false,
      "h1": "Klare Antworten, bevor du irgendetwas beauftragst.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/hausakte",
      "width": 390,
      "status": 200,
      "overflow": false,
      "h1": "Dein Haus bekommt ein Gedächtnis.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/kontakt",
      "width": 390,
      "status": 200,
      "overflow": false,
      "h1": "Sag uns, worum es geht. Wir leiten dich direkt an die richtige Stelle.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/lexikon",
      "width": 390,
      "status": 200,
      "overflow": false,
      "h1": "Fachbegriffe, die dir Entscheidungen abnehmen.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/login",
      "width": 390,
      "status": 200,
      "overflow": false,
      "logo": []
    },
    {
      "route": "/",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Dein Haus.Einfachgeregelt.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/leistungen/heizung",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Heizung, Klima & Energie: einfach anfangen, ohne das Gewerk kennen zu müssen.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/hilfe",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Klare Antworten, bevor du irgendetwas beauftragst.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/hausakte",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Dein Haus bekommt ein Gedächtnis.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/kontakt",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Sag uns, worum es geht. Wir leiten dich direkt an die richtige Stelle.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/lexikon",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Fachbegriffe, die dir Entscheidungen abnehmen.",
      "logo": [
        {
          "loaded": true,
          "width": 114
        },
        {
          "loaded": false,
          "width": 140
        }
      ]
    },
    {
      "route": "/login",
      "width": 1440,
      "status": 200,
      "overflow": false,
      "h1": "Keine Marktplatz-Logik. Klare Regeln.",
      "logo": []
    },
    {
      "route": "/app",
      "unauthenticatedURL": "http://127.0.0.1:4190/login?next=%2Fapp",
      "status": 200
    },
    {
      "route": "/pro",
      "unauthenticatedURL": "http://127.0.0.1:4190/login?next=%2Fpro",
      "status": 200
    }
  ],
  "errors": []
}

`````

## docs/brand/evidence/system/release-gates.txt

`````text

> einfach-hausen@0.1.0 lint
> eslint


/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/a11y-matrix.mjs
  103:107  warning  'e' is defined but never used  @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/design-audit-shots.mjs
  44:7  warning  'identities' is assigned a value but never used  @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/dispatch-notifications.mjs
  28:11  warning  'db' is assigned a value but never used  @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/e2e.mjs
   88:16   warning  'runChild' is defined but never used                     @typescript-eslint/no-unused-vars
  165:66   warning  'response' is defined but never used                     @typescript-eslint/no-unused-vars
  459:7    warning  'e' is defined but never used                            @typescript-eslint/no-unused-vars
  481:232  warning  'supabaseTechUserId' is assigned a value but never used  @typescript-eslint/no-unused-vars
  493:78   warning  'e' is defined but never used                            @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/pro-audit.mjs
  6:8  warning  'fs' is defined but never used  @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/release-gate.mjs
  228:9  warning  'perfFailures' is assigned a value but never used  @typescript-eslint/no-unused-vars
  277:7  warning  'staticOk' is assigned a value but never used      @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/responsive-matrix.mjs
  12:17  warning  'execFileSync' is defined but never used  @typescript-eslint/no-unused-vars

/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906/scripts/t0203-gdpr-regression.mjs
  79:9  warning  'dbPath' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 13 problems (0 errors, 13 warnings)


> einfach-hausen@0.1.0 typecheck
> tsc --noEmit


> einfach-hausen@0.1.0 build
> next build

▲ Next.js 16.3.1 (Turbopack)
✓ Running next.config.ts took 44ms
- Experiments (use with caution):
  · cpus: 1
  · serverActions

  Creating an optimized production build ...
✓ Compiled successfully in 19.3s
  Running TypeScript ...
  Finished TypeScript in 5.0s ...
  Collecting page data using 1 worker ...
  Generating static pages using 1 worker (0/137) ...
  Generating static pages using 1 worker (34/137) 
  Generating static pages using 1 worker (68/137) 
  Generating static pages using 1 worker (102/137) 
✓ Generating static pages using 1 worker (137/137) in 4.5s
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /admin
├ ƒ /admin/crm
├ ƒ /admin/login
├ ƒ /admin/ops
├ ƒ /agb
├ ƒ /anfrage/[id]
├ ƒ /anfrage/neu
├ ƒ /anfragen-pro
├ ƒ /ansprechpartner
├ ƒ /api/account/export
├ ƒ /api/admin/verification-file/[id]
├ ƒ /api/ai/byok
├ ƒ /api/ai/credits
├ ƒ /api/auth/local-login
├ ƒ /api/documents/[id]
├ ƒ /api/errors
├ ƒ /api/health
├ ƒ /api/hooks/neue-anfrage
├ ƒ /api/hooks/neues-angebot
├ ƒ /api/house-history-documents/[id]
├ ƒ /api/house-history-files/[id]/[kind]
├ ƒ /api/job-media/[id]
├ ƒ /api/ki
├ ƒ /api/konto-loeschen
├ ƒ /api/live
├ ƒ /api/memberships/success
├ ƒ /api/owner/messages/[contactUserId]
├ ƒ /api/packages/success
├ ƒ /api/partner-memberships/success
├ ƒ /api/payments/success
├ ƒ /api/stripe/connect/refresh
├ ƒ /api/stripe/connect/return
├ ƒ /api/stripe/webhook
├ ƒ /api/support/messages/[homeownerId]
├ ƒ /api/telemetry
├ ƒ /api/whatsapp/webhook
├ ƒ /app
├ ƒ /app/calendar
├ ƒ /app/consultation
├ ƒ /app/documents
├ ƒ /app/documents/[jobId]/receipt
├ ƒ /app/emergency
├ ƒ /app/hausmeister
├ ƒ /app/home
├ ƒ /app/home/history
├ ƒ /app/home/passport
├ ƒ /app/home/sale
├ ƒ /app/insurance
├ ƒ /app/invoices/[id]
├ ƒ /app/jobs
├ ƒ /app/jobs/[id]
├ ƒ /app/messages
├ ƒ /app/more
├ ƒ /app/onboarding
├ ƒ /app/partners
├ ƒ /app/partners/[id]
├ ƒ /app/plans
├ ƒ /app/profile
├ ƒ /app/settings
├ ƒ /app/year
├ ƒ /barrierefreiheit
├ ƒ /beratung
├ ƒ /blog
├ ƒ /blog/[slug]
├ ƒ /chat/[anfrageId]
├ ƒ /check-email
├ ƒ /datenschutz
├ ƒ /design-system
├ ƒ /eigenheimbesitzer
├ ƒ /hausakte
├ ƒ /hilfe
├ ƒ /immobilienverkauf
├ ƒ /impressum
├ ƒ /ki-chat
├ ƒ /kontakt
├ ƒ /leistungen
├ ƒ /leistungen/[slug]
├ ƒ /leistungen/heizung
├ ƒ /lexikon
├   /lexikon/[begriff]
│ ├ ● /lexikon/dachinspektion
│ ├ ● /lexikon/e-check
│ ├ ● /lexikon/energieausweis
│ └ ● [+15 more paths]
├   /lexikon/kategorie/[kategorie]
│ ├ ● /lexikon/kategorie/heizung-energie
│ ├ ● /lexikon/kategorie/feuchte-schimmel
│ ├ ● /lexikon/kategorie/dach-gebaeudehuelle
│ └ ● [+4 more paths]
├ ƒ /login
├ ○ /manifest.webmanifest
├ ƒ /mein-haus
├ ƒ /notfall
├ ƒ /notifications
├ ƒ /onboarding/pro
├ ƒ /onboarding/pro/[schritt]
├ ƒ /onboarding/pro/gebiet
├ ƒ /partner
├ ƒ /partner-invite/[token]
├ ƒ /pilotphase
├ ƒ /preise
├ ƒ /pro
├ ƒ /pro/calendar
├ ƒ /pro/invoices/[id]
├ ƒ /pro/jobs/[id]
├ ƒ /pro/leads
├ ƒ /pro/messages
├ ƒ /pro/onboarding
├ ƒ /pro/orders
├ ƒ /pro/plans
├ ƒ /pro/profile
├ ƒ /pro/team
├ ƒ /register
├ ƒ /register-owner
├ ƒ /register-pro
├ ○ /robots.txt
├ ƒ /role
├ ƒ /sicherheit
├ ○ /sitemap.xml
├ ƒ /so-funktionierts
├ ƒ /transfer/[token]
├ ƒ /ueber-uns
├ ƒ /versicherung
└ ƒ /welcome


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand

EH_RELEASE_GATES [0, 0, 0]

`````

## docs/brand/evidence/system/token-drift-negative.json

`````json
{
  "exit": 1,
  "restored": true,
  "expected": "reject generated-token drift"
}

`````

## docs/brand/system/CRM_RECIPE.mjs

`````js
/** Complete native composition. Import from vendor/eh-design/src/html.mjs in the CRM.
 * searchForm is trusted application markup retaining actual filter names and handlers.
 * Every lead value is escaped by the canonical table. No auth/data/outreach logic is replaced.
 */
import {EHHtmlPage,EHHtmlLogo,EHHtmlHeader,EHHtmlTable,EHHtmlPanel,EHHtmlEmpty,EHHtmlButton} from "../../../packages/eh-design/src/html.mjs";
export function renderCRMOverview({leads,searchForm,primaryAction}) {
 const content=EHHtmlLogo()+EHHtmlHeader({eyebrow:"Einfachhausen CRM",title:"Dein Überblick.",text:"Kontakte, nächste Schritte und nachvollziehbare Vorgänge.",actions:primaryAction?EHHtmlButton(primaryAction):""})+
 EHHtmlPanel({title:"Kontakte finden",content:searchForm})+
 (leads.length?EHHtmlTable({caption:"Leads und nächste Schritte",columns:[{key:"name",label:"Kontakt"},{key:"status",label:"Status"},{key:"nextStep",label:"Nächster Schritt"}],rows:leads.map(lead=>({name:lead.name,status:lead.status,nextStep:lead.nextStep}))}):EHHtmlEmpty({title:"Keine passenden Kontakte",text:"Ändere deine Suche oder prüfe die aktiven Filter."}));
 return EHHtmlPage({title:"Einfachhausen CRM",content});
}

`````

## docs/brand/system/HANDOFF.md

`````markdown
# Einfachhausen · verbindliche Übergabe · Designsystem 1.0.0

Jerry hat Atelier 02 ausdrücklich freigegeben und diese Umsetzung beauftragt. Keine weitere Stilwahl. SIN-EH-design ist Pflicht. Agenten dürfen Inhalte, Reihenfolge, Datenbindungen und dokumentierte Varianten komponieren; eigene Farben, Schriften, Effekte, Rundungen, Logos, CSS-Systeme oder Neugestaltung sind verboten. Fehlende Primitive als konkrete Lücke melden; den Markenkern nicht ändern oder das Prüfsiegel erneuern.

## Quellen und Maschinen

- Kanonisches Repo: https://github.com/Delqhi/einfach-hausen, Branch design/einfachhausen-brand-atelier-20260906, PR https://github.com/Delqhi/einfach-hausen/pull/41.
- OCI: /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906.
- Mac i9: /Users/jeremyschulze/orca/workspaces/einfach-hausen-brand-atelier-20260906. Der gemeinsame Entwicklungscheckout bleibt unberührt.
- Normativ: DESIGN.md, packages/eh-design/src/*, packages/eh-design/assets/*. Vollständiger Quelltext aller geänderten Textdateien: SOURCE.md; Binärdateien und Hashes: source-manifest.json. Keine ellipsierten Codeauszüge als Implementierung verwenden.
- Verbindliche Komponenten: 49 Exporte in primitives.tsx, blocks.tsx, app.tsx. Acht vollständige Seitenrezepte in recipes.tsx. Browserbibliothek /design-system mit neun Ansichten.
- Native Worker-HTML: packages/eh-design/src/html.mjs + html-style.mjs. Vollständige CRM-Komposition CRM_RECIPE.mjs. Kein React-Umbau des Workers.
- Originales vollständiges Logo und selbst gehostetes Inter sind Pflicht. Schriftgrößen: Web 17–18, App 16, Label 15, Metadaten mindestens 13, Eingaben 16 px. 12 px nur nicht notwendige Eyebrows.

## Verifikation

```bash
export PATH=/home/ubuntu/.nvm/versions/node/v22.23.0/bin:/home/ubuntu/.local/bin:/usr/local/bin:/usr/bin:/bin
cd /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906
node scripts/eh-design-check.mjs
node scripts/eh-design-generate.mjs --check
node --test scripts/eh-design-check.test.mjs scripts/eh-design-html.test.mjs
node scripts/public-website-contract.mjs
npm run typecheck
npm run lint
npm run build
```

Erhoben: Build, Typprüfung, bestehender öffentlicher Website-Vertrag; 27 Bibliotheksansichten (9 × 390/736/1440), keine Überläufe, keine Axe-Verstöße, Interaktionen geprüft. 14 echte öffentliche Routenansichten ohne Überlauf/JS-Fehler. Screenshots und JSON in docs/brand/evidence/system. GitNexus lieferte teilweise gekürzte Ablaufgraphen; diese sind keine Vollständigkeitsgarantie. Direkte Aufrufer, Build und Browser wurden zusätzlich geprüft. Authentifizierte Live-Datenflüsse wurden nicht durch künstliche Anmeldungen behauptet.

## Nächste Agenten: strikt begrenzte Migration

| Task | Umfang | Pflicht |
|---|---|---|
| EH-BRAND-05-WEB | Bestehende Themen-/Leistungs-/Hilfe-/Artikel-/Rechtsseiten | Vorhandene Texte, SEO, Routen, Aussagen erhalten; acht Rezepte je Inhalt komponieren; keine identische Onepage-Kopie. |
| EH-BRAND-05-APPS | Owner /app und Handwerker /pro | Auth, Datenzugriff, Berechtigungen und Navigation erhalten; EHAppHeader, EHPanel, EHField, EHTabs, EHDataTable, EHDocumentList, EHComposer verwenden. |
| EH-BRAND-05-CRM | einfachhausen-de/einfach-hausen-crm | Worker-HTML-Adapter; src/ui.js schrittweise migrieren; Sessions/AuthZ/D1/contact_history/Outreach erhalten; keine Nachrichten senden. |
| EH-BRAND-05-HUB | einfachhausen-de/portalhub | Shell, Projekte, Listen, Formulare, Aktivität, Einstellungen mit kanonischen Komponenten; Drizzle/Auth/API erhalten. |

Aufgabenquelle ist sin-gpt-web-state im kanonischen Taskrepo /home/ubuntu/dev/einfach-hausen. EH-BRAND-03 ist abgeschlossen, EH-BRAND-04 enthält diese Lieferung. Restmigration bleibt offen, bis reale Seiten geprüft sind. Keine behauptete Komplettmigration aller historischen Screens.

Jeder Folgeagent muss vor Beginn die aktuellen Commits, AGENTS.md, DESIGN.md und diesen Handoff lesen, Git-Status prüfen und isoliert arbeiten. Keine fremden Änderungen überschreiben, kein reset --hard/clean/force-push. Umsetzung komplett pro Datei liefern, vorhandene APIs bewahren, tatsächliche Screenshots bei 390/736/1440 und 200% Zoom prüfen, Tastatur-/Formularzustände prüfen, diff/check/build dokumentieren. Neue Seiten importieren die Bibliothek. Keine lokale Nachbildung der Komponenten.

## Präsentationsgenerator

Repo einfachhausen-de/einfachhausen-presentation-generator, OCI /home/ubuntu/orca/workspaces/einfachhausen-presentation-brand-20260906, Branch design/atelier-02-brand-system-20260906.
13 SlideRenderer-Layouts und 25 Remotion-Kompositionen nutzen dieselben Token und Original-Assets. Der eigenständige HTML-Export bettet Inter und Logo ein. Bestehende Inhalte und Disclaimer bleiben erhalten. Build/Test/Typprüfung/Lint erfolgreich; 13 Layouts auf Überlauf/Schrift geprüft; alle 25 Kompositionen gelistet, drei repräsentative Frames gerendert und visuell geprüft. Build mit unerreichbarer lokaler Dummy-DATABASE_URL ist kein Live-Datenbanktest. Keine alten Website-Videos erneut einbauen.

## Schutz und Grenzen

EH design consistency ist der kostenlose GitHub-Actions-Check. Er prüft neue Designabweichungen, Token-Generierung, gesiegelten Kern und den vertrauenswürdigen PR-Basisvertrag. Eigenes Neusiegeln erlaubt keine Kernänderung gegen den Basisvertrag. Bestehende lokale Designaltlasten sind exakt begrenzt und dürfen nur sinken. Schutzregeln dürfen nicht durch Agenten abgeschwächt werden.
Öffentliches Hauptrepo unterstützt Branchschutz. Die privaten Repos der Organisation liegen auf GitHub Free; GitHub verweigert dort verpflichtenden Branchschutz (403). CI bleibt möglich, aber nicht technisch merge-verpflichtend. Kein kostenpflichtiger Plan wurde gebucht. Ein Administrator mit denselben Zugangsdaten kann grundsätzlich Regeln ändern; Texte allein können das nicht unmöglich machen. Visuelle Qualität braucht zusätzlich Screenshot-Review.
Separat versionierte Consumer-Manifeste pinnen den Quellcommit und SHA256 jedes Vendor-Files. Nur scripts/eh-design-sync.mjs darf eine bestätigte saubere kanonische Version übertragen. Kein eigenständiges Kopieren/Abändern.

## Dokumentationspflicht

Alle Folgeänderungen müssen Taskstatus, NEXT_AGENT, Handoff, Prüfnachweise, vollständige Source-Blöcke und Hashmanifest aktualisieren. Designentscheidungen in Brain/Memory mit Quellen und Versionsstand festhalten. Alte Stilproben bleiben historische Evidenz. Keine Behauptung einer Installation, eines Merge, Deployments oder Pflichtchecks ohne tatsächlichen Nachweis.


## Lieferstand und letzte Nutzersteuerung

Designsystem und Skills sind versioniert geliefert; EH-BRAND-04 ist abgeschlossen. Beide Skills sind auf OCI und Mac i9 in Codex/OpenCode installiert und lokale AGENTS.md ergänzt. Verbindliche Commit-/PR-/Issue-/Installationspfade: docs/brand/system/delivery.json. PR42 ist als durch PR41 ersetzt geschlossen; sein Branch bleibt erhalten. Weitere Tests und Restmigration sind auf ausdrückliche Nutzeranweisung an lokale Agenten übergeben (EH-BRAND-05-WEB/APPS/CRM/HUB und06). Kein Merge/Deployment/Pflichtstatus wurde als erfolgt behauptet.


### Direkte Übernahme

- Hauptbibliothek: https://github.com/Delqhi/einfach-hausen/pull/41
- Skills (bereits lokal installiert): https://github.com/OpenSIN-Code/wow-my-zsh/pull/101
- Präsentationsgenerator: https://github.com/einfachhausen-de/einfachhausen-presentation-generator/pull/1
- CRM-Vertrag: https://github.com/einfachhausen-de/einfach-hausen-crm/pull/3
- Hub-Vertrag: https://github.com/einfachhausen-de/portalhub/pull/1
- Lokale Folgeaufgaben: Website #43, Apps #44, CRM #4, Hub #2, Regression/Pflichtstatus #45 in den jeweiligen Repos.

`````

## docs/brand/system/PR42_RECONCILIATION.md

`````markdown
# Abgleich PR #42 / verbindliche Konsolidierung

Quelle: feat/eh-brand-04-contract, Commit 4af71494965356655d755885226486d02c0d6d92, Draft PR https://github.com/Delqhi/einfach-hausen/pull/42. Der Branch bleibt erhalten; nichts wurde überschrieben oder zurückgesetzt.

Übernommen als belegte Randbedingungen: Atelier-02-Freigabe, volle Originallogos, Inter, keine Menü-/Backend-/Auth-Neugestaltung, keine erfundenen Geschäftszusagen, keine Wiedereinfügung abgelehnter Website-Videos, öffentliches ungeschütztes main zum Prüfzeitpunkt.

Verbindliche Weiterentwicklung ist PR #41: DESIGN.md, packages/eh-design, 49 ausführbare Komponenten, acht vollständige React-Seitenrezepte, Native-HTML-Adapter für das separate Worker-CRM, installierbarer Skill sin-eh-design und korrigierter sin-frontend-design. src/components/marketing/tokens.css bleibt als kompatible Alias-Schicht erhalten; die einzige Wertquelle ist packages/eh-design/src/tokens.json.

Die R1–R8 in #42 sind Textbeschreibungen, keine acht ausführbaren Komponenten. Der dortige Guard erlaubt zahlreiche Altfarben global und schützt Kerndateien nur durch Existenzchecks. Der neue Guard verwendet begrenzte Altlasten pro Datei, SHA256-Siegel und den vertrauenswürdigen PR-Basisvertrag. Deshalb keine zweite brand-guard.yml / kein zweiter Normtext importieren.

Korrekte CRM-Unterscheidung: /admin/crm im Hauptrepo ist React Server Component. einfachhausen-de/einfach-hausen-crm ist ein separates Cloudflare-Worker-HTML-Projekt. Der native Adapter ist für dieses echte Consumer-Repo, nicht für einen erfundenen HTML-Umbau von /admin/crm.

Die Änderungen an presentation/premium in #42 verbessern einige Farben, enthalten aber weiterhin alte Akzente/Verläufe und einen historischen SVG-Mark-Pfad. Sie wurden nicht als fertige Markenmigration übernommen. Dieses historische Deck gehört in die Folgeprüfung EH-BRAND-06; der tatsächlich aktive separate Präsentationsgenerator wurde vollständig am Renderer-/Token-/Exportkern angepasst.

Letzte Nutzersteuerung: Designbibliothek und Skills fertigstellen; weitere Test-/Regressionsläufe an lokale Agenten übergeben. Bereits erhobene Nachweise bleiben Evidenz, keine Behauptung zusätzlicher Läufe. Pflicht-Check-Aktivierung/Branchschutz und endgültige Merge-Regression sind EH-BRAND-06. Kein Merge und kein Deployment durch diese Lieferung.

`````

## docs/brand/system/delivery.json

`````json
{
  "date": "2026-09-06",
  "status": "design-system-and-skills-delivered; migration-and-further-tests-delegated",
  "canonicalPackageCommit": "80fbbb2edbbea6bdf26ff1a9594ad7c7076d4676",
  "mainPR": "https://github.com/Delqhi/einfach-hausen/pull/41",
  "skillsInstalledCommit": "8ffb067167c72c22a42dbb4fb1e7270956fdb1db",
  "pullRequests": {
    "OpenSIN-Code/wow-my-zsh": {
      "code": 0,
      "url": "https://github.com/OpenSIN-Code/wow-my-zsh/pull/101",
      "branch": "design/eh-brand-skills-v1-20260906",
      "commit": "8ffb067167c72c22a42dbb4fb1e7270956fdb1db"
    },
    "einfachhausen-de/einfachhausen-presentation-generator": {
      "code": 0,
      "url": "https://github.com/einfachhausen-de/einfachhausen-presentation-generator/pull/1",
      "branch": "design/atelier-02-brand-system-20260906",
      "commit": "d1313a943a41b2ab84416c6a69adf13b363e1106"
    },
    "einfachhausen-de/einfach-hausen-crm": {
      "code": 0,
      "url": "https://github.com/einfachhausen-de/einfach-hausen-crm/pull/3",
      "branch": "design/eh-brand-contract-20260906",
      "commit": "a13fb5ce71d9d48c548baa6b37cfc2e0ec48a591"
    },
    "einfachhausen-de/portalhub": {
      "code": 0,
      "url": "https://github.com/einfachhausen-de/portalhub/pull/1",
      "branch": "design/eh-brand-contract-20260906",
      "commit": "c2b69d716539f7a3c70c52c640eface8e7d0897c"
    }
  },
  "issues": {
    "EH-BRAND-05-WEB": "https://github.com/Delqhi/einfach-hausen/issues/43",
    "EH-BRAND-05-APPS": "https://github.com/Delqhi/einfach-hausen/issues/44",
    "EH-BRAND-05-CRM": "https://github.com/einfachhausen-de/einfach-hausen-crm/issues/4",
    "EH-BRAND-05-HUB": "https://github.com/einfachhausen-de/portalhub/issues/2",
    "EH-BRAND-06": "https://github.com/Delqhi/einfach-hausen/issues/45"
  },
  "supersededPR": {
    "url": "https://github.com/Delqhi/einfach-hausen/pull/42",
    "state": "closed",
    "branchPreserved": true
  },
  "machines": {
    "OCI": "/home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906",
    "Mac-i9": "/Users/jeremyschulze/orca/workspaces/einfach-hausen-brand-atelier-20260906"
  },
  "skillBackupReceipts": {
    "OCI": "/home/ubuntu/.local/share/eh-design-backups/20260906T200459Z/receipt.json",
    "Mac-i9": "/Users/jeremyschulze/.local/share/eh-design-backups/20260906T200623Z/receipt.json"
  },
  "brainID": "6564dc0e-2c74-4867-99d8-992fda0cbc66",
  "merged": false,
  "deployed": false,
  "requiredCheckActivated": false,
  "remainingGateTask": "EH-BRAND-06",
  "limitations": [
    "Historical screens are not all migrated.",
    "Public mandatory status activation remains local-agent task06.",
    "Private Free-org mandatory branch protection is unavailable403.",
    "GitNexus graph outputs truncated; CRM checkout alias unresolved; no full graph success claimed.",
    "Latest typography label wording, vendor sync and final CSS integration receive further local-agent regression."
  ]
}

`````

## docs/superpowers/plans/2026-09-06-einfachhausen-design-system-v1.md

`````markdown
# Einfachhausen Designsystem 1.0 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for task-by-task execution. This session is inline execution by Root Codex; do not dispatch independent design work. Code must come from the complete source capsule and the canonical package, never from improvisation.

**Goal:** Turn the explicitly accepted Atelier 02 into one legible, reusable, enforceable brand system across Einfachhausen surfaces and presentations.

**Architecture:** The public main repository owns packages/eh-design, the canonical token data, CSS/React components, assets and complete page recipes. Existing website component APIs adapt to this package; app consumers use the same tokens and UI primitives while retaining navigation and backend behavior. Other repositories receive a versioned, hash-verified vendor copy through a deterministic sync command rather than inventing parallel palettes or components.

**Tech Stack:** React 19, TypeScript, Next.js 16 (installed local docs before framework edits), CSS Modules, existing Playwright/axe, dependency-free Node design guard, existing Remotion renderer, Python/Node skill validation.

**Spec:** docs/superpowers/specs/2026-09-06-einfachhausen-design-system-v1.md

## Global Constraints
- Atelier 02 is accepted. Earlier PR40 studies are rejected and stay historical.
- Root owns design changes. Other agents compose supported blocks and content only; no autonomous redesign.
- Website/app text: body 16–18px; labels/actions 14–16px; metadata 13px; short nonessential eyebrow minimum 12px; inputs 16px minimum.
- Slide text at 1920×1080: caption 24px minimum; body 32–36px; heading 56–88px.
- Inter self-hosted only; original logo bytes unchanged.
- Preserve user-authorized current work and all other agents' branches; no reset/clean/force.
- Preserve business logic, auth, content boundaries, actual links and existing navigation.
- No Remotion runtime or removed presentation sections reintroduced into the production website.
- No paid bot, model API or billing change. GitHub checks use minimal permissions and unprivileged PR execution.
- Complete exact code blocks, paths, hashes, commands and handoff for every changed source.

## Ownership and concrete files
Main workspace: /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906, branch design/einfachhausen-brand-atelier-20260906.
Generator workspace: /home/ubuntu/orca/workspaces/einfachhausen-presentation-brand-20260906, branch design/atelier-02-brand-system-20260906.
Skills workspace: /home/ubuntu/orca/workspaces/wow-my-zsh-eh-design-20260906, branch design/eh-brand-skills-v1-20260906.

### EH-BRAND-04 / A: canonical design foundation
Create packages/eh-design/package.json, src/tokens.json, src/tokens.css, src/tokens.ts, src/primitives.tsx, src/blocks.tsx, src/app.tsx, src/index.ts, src/styles.module.css, assets/logo-full.png, assets/inter-variable.woff2.
Create scripts/eh-design-generate.mjs and scripts/eh-design-sync.mjs.
Replace DESIGN.md with the accepted contract, component registry, text/shape/motion/state rules and consumption boundaries.
Token generator must support --check and fail on drift. Sync must allow only its declared vendored files, verify hashes and refuse unexpected local edits; it must never copy a dirty repository or credentials.

Interfaces: EHTokens (JSON/TS), EHLogo, EHContainer, EHSection, EHEyebrow, EHHeading, EHText, EHButton, EHTextLink, EHImageFrame, EHRecordCover, EHStatus. Components expose approved variants and semantic/data/event props; no arbitrary style overrides in the public API.

- [ ] Write complete foundation code and token-generation verification.
- [ ] Exercise drift with one deliberately changed token output, prove failure, restore exact original.
- [ ] Build and typecheck the package through the actual consuming app.

### EH-BRAND-04 / B: content and app component families
Create cohesive blocks: EHPageHero, EHPromiseRow, EHFeatureRows, EHSplitStory, EHSteps, EHTimeline, EHFacts, EHComparison, EHFAQ, EHCallout, EHClosing, EHProse, EHArticleHeader, EHContents, EHRelated, EHServiceIndex, EHPricing.
Create app primitives: EHAppHeader, EHField, EHInput, EHTextarea, EHSelect, EHCheckbox, EHTabs, EHDialog, EHEmptyState, EHLoadingState, EHErrorState, EHDataTable, EHList, EHComposer, EHDocumentList.
These are real reusable blocks with typed props and accessible states, not screenshot-only components.
Create packages/eh-design/src/recipes.tsx with complete service-detail, article, service-index, contact, pricing, owner and provider compositions. Preserve data/actions through typed inputs; show a theme-specific composition, not the same page with different headings.
Create src/app/design-system/page.tsx + component gallery for real browser inspection, noindex.
- [ ] Implement all blocks, meaningful keyboard/validation interactions and complete page recipes.
- [ ] Render distinct website/detail/article/owner/provider examples at 390/736/1440.
- [ ] Inspect actual images; run axe and computed font/overflow checks.

### EH-BRAND-04 / C: compatibility and legibility
Modify src/components/marketing/tokens.css to map legacy names to the single canonical source.
Modify src/components/marketing/ui.tsx through compatible adapters; preserve exported names/props and consumer semantics.
Modify root stylesheet integration only after framework docs and impact confirmation.
Add package-backed src/design-system/index.ts consumption entry.
Inspect and connect existing homeowner/provider scope styles to the same aliases without replacing auth, actions, data or navigation.
The current impact graph marks PageHero and LinkButton CRITICAL because they are shared by many pages. Preserve API signatures and run actual representative page checks and existing required app gates.
- [ ] Capture fresh impact and textual caller confirmation for framework entrypoints.
- [ ] Apply adapters; retain all existing public content and app logic.
- [ ] Run lint, typecheck, build and affected public/app flows.

### EH-BRAND-06 / D: deterministic design guard and GitHub enforcement
Create scripts/eh-design-check.mjs, scripts/eh-design-check.test.mjs, design/design-policy.json and a precise pre-existing-debt baseline.
Create .github/workflows/eh-design.yml, .github/CODEOWNERS and PR checklist changes.
Check canonical outputs, original asset hashes, package version/imports, disallowed new color/font/style literals and small type. Existing debt may only stay or shrink; line movements may not hide new violations. Include positive and negative fixtures proving failure, including attempts to edit the baseline/guard or copied vendor files.
Run always on PRs so non-design PRs receive a successful no-op/result rather than a permanently skipped required status.
No privileged PR-code execution; no production-host self-hosted runner.
Once the check exists and is proven, configure main's required status while preserving any newly added existing protection. Capture before/after. Main is public; private-org protection availability must be verified and accurately documented.
- [ ] Implement guard and adversarial/legitimate fixtures.
- [ ] Run locally and in GitHub if service available; report actual run state.
- [ ] Enable supported free protection, no paid service; leave exact evidence for genuine plan limits.

### EH-BRAND-04 / E: corrected skills and agent routing
In wow-my-zsh: replace shared/skills/sin-frontend-design/SKILL.md and conflicting references; create shared/skills/sin-eh-design/SKILL.md, references/component-recipes.md, references/contract-and-paths.md and relevant metadata.
Update applicable routing/AGENTS/docs to force the specific Einfachhausen skill for Einfachhausen work only.
Use installed canonical package/docs and the source capsule as authority; distinguish layout composition from forbidden redesign. Every recipe must contain complete usable source, not instructions to invent the missing component.
Write GATES.md before implementation, validate with the repository's unlazy checker, keep skill changes synced with git. Install updated copies on the active OCI/Mac-i9 harness locations only after preserving differing local files.
- [ ] Validate skill format/references and compile its actual examples.
- [ ] Verify no stale old-style instructions remain in active entrypoints/references.
- [ ] Git sync, install, and read back exact hashes on target machines.

### EH-BRAND-05 / F: presentation generator adoption
Vendor the same package/assets and manifest.
Update src/lib/slides/theme.ts, src/components/slides/SlideRenderer.tsx, SlideFrame.tsx, src/remotion/brand.ts, RoutePresentation.tsx, globals.css and root font setup.
Retain 13 schema slide types, 25 route stories, authoring APIs and real content/disclaimers. Remove homemade wordmarks, Manrope/Google Font requests, gradient/glow backgrounds and arbitrary pill/card visual defaults.
Provide coherent title, section, bullets, cards-as-editorial-records, comparison, steps, stats, quote, timeline, chart, image, split and closing layouts from the same brand.
- [ ] Inspect full schema/renderer and impact before edits.
- [ ] Implement both renderer paths, use original logo and self-hosted font.
- [ ] Run npm test/typecheck/lint/build and remotion:compositions.
- [ ] Render representative full-size slides from both paths, inspect personally, ensure no overflow or clipped content.

### EH-BRAND-05 / G: other repositories and next agents
Inspect CRM and portalhub; add current DESIGN.md authority, AGENTS/NEXT_AGENT constraints, pinned package consumption and exact scoped migration tasks. Create/link GitHub engineering issues; retain the single canonical taskplan.
Provide each continuation package with owning paths, dependency version/hash, full component/recipe code, real build/test commands and acceptance. Do not imply all historical screens are migrated before these tasks run.
- [ ] Register explicit child migration tasks under the existing EH-BRAND-05 scope.
- [ ] Persist repo-local handoffs and issue links.
- [ ] Confirm other agents can begin with imports and complete recipes without designing a new system.

### Closure
- [ ] Record user approval, all findings and strict reuse rule in SIN-Brain/OpenViking with positive receipt/readback; retain Honcho unavailable status if still unavailable.
- [ ] Update canonical task evidence through sin-gpt-web-state, render and validate.
- [ ] Regenerate a complete source capsule and per-repo manifest for every changed primary source; originals/rejected prototype remain historical.
- [ ] Push isolated branches/PRs and synchronize Mac-i9 review. Never claim merge/deploy unless actually performed and authorized.


## Lieferstand und letzte Nutzersteuerung

Designsystem und Skills sind versioniert geliefert; EH-BRAND-04 ist abgeschlossen. Beide Skills sind auf OCI und Mac i9 in Codex/OpenCode installiert und lokale AGENTS.md ergänzt. Verbindliche Commit-/PR-/Issue-/Installationspfade: docs/brand/system/delivery.json. PR42 ist als durch PR41 ersetzt geschlossen; sein Branch bleibt erhalten. Weitere Tests und Restmigration sind auf ausdrückliche Nutzeranweisung an lokale Agenten übergeben (EH-BRAND-05-WEB/APPS/CRM/HUB und06). Kein Merge/Deployment/Pflichtstatus wurde als erfolgt behauptet.

`````

## docs/superpowers/specs/2026-09-06-einfachhausen-design-system-v1.md

`````markdown
# Einfachhausen Designsystem 1.0 — verbindliche Freigabe und Auftrag
Stand: 2026-09-06. Kanonische Tasks: EH-BRAND-03 accepted/done; EH-BRAND-04 in progress.
Angenommene Referenz: Atelier 02, PR https://github.com/Delqhi/einfach-hausen/pull/41, Design-Code baea585e9de24c6d6bada491ac61c4537f2a5e4d, Dokumentationsstand 77e1e558afbfd27ae4d80cec571a6b2a6c2ad685.

## Nutzerfreigabe und Folgeauftrag — vollständig wörtlich
> omg das ist MEGA! aber wir haben ja nicht nur onepage seite sondern auch unterseiten usw. und die schrift ist manchmal etwas zu klein oder? und bitte direkt design sytem design.md design vorlagen von komponenten usw erstellen und fertigstellen. ich will dass es niemals wieder pasieren kann das andere agenten wieder eigenständig das design verändern! auch den skill sin-frontend-design der extrem hässliches design baut massiv korrigieren und verbessern. und erstelle einen skill SIN-EH-design (der skill soll agenten alles erläutern wo wie was und alle infromationen bzgl einfachhausen design) . alle die von dir erstellten design komponenten müssen ovn agenten beim bauen von anderen seiten wie unterseiten wiederverwendet werden und damit unterseiten individuell  gestalten je nach thema/content/inhalt. baue also ausreichend blöcke , sektionen und so weiter komponenten für alles was agenten benötigen werden. .. aktualisiere auch lokale agents.md und brains und memories usw dass agenten in einfachhausen repos nie wieder design selber erstellen und damit dein neues festgelegtes design verändern. das ist strikt verboten für andere agenten ab jetzt. das neue design soll auch für owner/handwerker apps gelten. alles was mit einfach hausen zutun hat. am besten bauen wir auch ein github bot wenn free der vor mergen immer auf design konsistens prüft oder so . und erstelle direkt tasks inkl heftigen anweisungen und next_agent für nächste agenten die sollen nächmlich auch andere einfach hausen projekt mit neuen design ausstatten. und auch die einfachhausen presentationsgenerator unbedingt an neues design anpassen damit präsentationen wirklich konstistente marken design besitzen. füge für agenten immer vollständig code in blöcken für alles hinzu - weil subagenten ncihtt so die klügsten mitdenker und nicht die besten entwickler sind leider daher immer bestmöglich vorgeben alles !

## Beschluss
Atelier 02 ist angenommen. Nur die drei früheren PR-40-Studien sind verworfen. Die neue Linie ist keine offene Richtungswahl mehr. Root Codex besitzt die gestalterische Verantwortung; ausführende Agenten verwenden die festgelegten Bausteine und ordnen sie nach Inhalt. Sie ändern nicht eigenständig Marke, Typo, Tokens, Formen, Motion oder Komponentenstile. Eine vom Nutzer ausdrücklich beauftragte Systemänderung bleibt möglich; bestehende Autorisierung dieses Auftrags umfasst Systemausarbeitung, Lesbarkeitskorrektur, Skill- und Regeländerung sowie technische Schutzmaßnahmen.

## Marken-Grammatik
- Claim: Dein Haus. Einfach geregelt.
- Leitidee: Ein Zuhause mit Gedächtnis.
- Hauskante: definierte 45-Grad-Ecke an Bild/Record-Cover, nicht an jedem Eingabeelement.
- Hauslinie: chronologische Einträge, funktionale Trennlinien und Register.
- Wortbild: kräftige Inter-Überschriften, ruhige Lesetexte, tatsächliche Hierarchie.
- Farben: vorhandenes Papier #faf8f4, Petrol #105258, tiefes Petrol #0a3539, Ink #10222a, Textsekundär #4b5b60, Linie #e4e2dc, Sand #ecdfc9, Terra #a84d29.
- Original-Logo byte-identisch. Keine nachgebaute Wortmarke, kein Ersatzzeichen, keine ungeprüften Filter.
- Owner, Handwerker, CRM und Hub bleiben helle Arbeitsflächen. Dunkles Petrol ist für narrative Kapitel, Cover und Abschlüsse vorgesehen.
- Motion nur als kurze, endliche Orientierung. Reduced Motion vollständig; keine ständig bewegten Deko-Elemente.

## Lesbarkeit
Die Kritik ist berechtigt: der Prototyp enthält 7–11px Metadaten. Im produktiven Vertrag: Body 16px (App) bzw. 17–18px (Website), Labels/Buttons 14–16px, Metadaten 13px, ausschließlich kurze nicht wesentliche Eyebrows mindestens 12px. Eingaben mindestens 16px. Kleine Schrift darf nicht dazu benutzt werden, ein Layout passend zu machen. Zoom 200%, 320/390/736/1440px und Kontrast werden geprüft.
Slides besitzen eine separate, aus derselben Skala abgeleitete Größe für 1920×1080: lesbare Caption mindestens 24px, Fließtext 32–36px, Überschriften 56–88px. Keine Web-Mikroschrift in Video/PDF.

## Implementierungsgrenzen
1. Ein kanonisches wiederverwendbares Paket packages/eh-design im Hauptrepo. Tokens in maschinenlesbarer Quelle; Styles, React-Komponenten, Assets und Seitenrezepte daraus.
2. Öffentliche Archetypen: Start/Hero, Leistung/Detail, Lexikon/Artikel, Kategorien/Index, Kontakt, Preise/Vergleich, Ablauf, Beratung und rechtliche Inhalte.
3. App-Bausteine: Seitenkopf, bestehende Navigation als übergebene Daten, Composer, Feld/Input/Textarea/Select, Tabs, Dialog, Liste/Tabelle, Status/Loading/Empty/Error, Historie und Dokumentregister. Bestehende Geschäfts-, Auth-, Daten- und Navigationslogik erhalten.
4. Präsentationsgenerator: beide Ausgabepfade (Editor/SlideRenderer und Remotion), Logo/Font/Palette, Layout- und Motion-Regeln an dieselbe Paketversion binden. Frühere Website-Video-Integration bleibt entfernt; keine ungefragte Wiedereinführung.
5. Andere Einfachhausen-Repos bekommen die Paketkopplung, Regeln und ausführbare Handback-Pakete. Konkrete Migrationsaufträge für nachfolgende Agenten sind ausdrücklich Teil des Auftrags. Nicht behaupten, unberührte Seiten seien schon migriert.
6. Vollständige aktuelle Codeblöcke, konkrete Pfade, Eingabe-/Ausgabeverträge, Prüfkommandos und Aufgabenstatus pro ausführendem Agenten. Kanonische Task-DB bleibt /home/ubuntu/dev/einfach-hausen/.sin-gpt-web/taskplan.sqlite3.

## Schutzmodell
Deterministische CI ohne kostenpflichtiges Vision-Modell: kanonische Tokens/Asset-Hashes, verbotene neue Literalfarben/Fonts/Inline-Designs, unzulässige neue Designvarianten, Mindestschrift, Import-/Versionskonsistenz und Browserreferenzen. Bestehende Designschuld wird exakt inventarisiert; eine Baseline darf nur bereits bestehende Verstöße zulassen, niemals neue.
CI- und Schutzdateien selbst als geschützte Designinfrastruktur behandeln. Keine PR-Code-Ausführung mit privilegiertem pull_request_target, keine produktive OCI-VM als unsandboxed Runner für fremden PR-Code. Prüferkomponenten brauchen echte positive/negative Tests.
GitHub Hauptrepo ist öffentlich, Adminrechte vorhanden, main bisher ungeschützt. Kostenlose erforderliche Statusprüfungen sind dort möglich. Privat-Repos der Org können für erzwungenen Schutz einen bezahlten Plan benötigen; kein Upgrade und keine Kostenbuchung durch diesen Auftrag.
Automatisierung kann Regelbrüche blockieren, aber weder menschlichen Geschmack beweisen noch einen Repo-Administrator mit denselben Zugangsdaten unüberwindbar aussperren. Diese Grenze wird ehrlich dokumentiert; kein falsches "niemals möglich".

## Verifizierte Orte
- Hauptrepo /home/ubuntu/orca/workspaces/einfach-hausen-brand-atelier-20260906, Branch design/einfachhausen-brand-atelier-20260906.
- Generator /home/ubuntu/orca/workspaces/einfachhausen-presentation-brand-20260906, Branch design/atelier-02-brand-system-20260906, GitHub einfachhausen-de/einfachhausen-presentation-generator.
- Skills /home/ubuntu/orca/workspaces/wow-my-zsh-eh-design-20260906, Branch design/eh-brand-skills-v1-20260906, GitHub OpenSIN-Code/wow-my-zsh. Ausgang origin/main nach frischem Sync; der frühere be03467-Runtime-Stand war 38 Commits zurück und 8 voraus. Er wurde unverändert erhalten; eine neue saubere Branch von origin/main wird verwendet.
- Installierte OCI-Skills: /home/ubuntu/.codex/skills/sin-frontend-design und /home/ubuntu/.config/opencode/skills/sin-frontend-design. Vor lokaler Aktualisierung Unterschiede sichern; kanonische Quellen müssen gepusht sein.
- Weitere Org-Repos: einfachhausen-de/einfach-hausen-crm und einfachhausen-de/portalhub (beide privat).
- Mac-i9-Review: /Users/jeremyschulze/orca/workspaces/einfach-hausen-brand-atelier-20260906, via GitHub synchronisieren.

## Plan und Abnahme
Ausführungsplan: docs/superpowers/plans/2026-09-06-einfachhausen-design-system-v1.md.
Die Freigabe ist erteilt; keine erneute A/B/C-Wahl und keine weitere Design-Delegation nötig. Nächste reale Abnahme betrifft die Ausführung dieses Vertrags, nicht die bereits angenommene Markenrichtung.

`````

## packages/eh-design/package.json

`````json
{
  "name": "@einfachhausen/design",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./tokens": "./src/tokens.ts",
    "./tokens.css": "./src/tokens.css",
    "./recipes": "./src/recipes.tsx",
    "./html": "./src/html.mjs"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}

`````

## packages/eh-design/src/app.tsx

`````tsx
"use client";
import {useEffect, useId, useRef, useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type FormEvent} from "react";
import {EHHeading, EHText, EHButton, EHActions, EHEyebrow, EHStatus} from "./primitives";
import s from "./styles.module.css";
type Native<T> = Omit<T, "style" | "className">;
export function EHAppHeader({eyebrow, title, text, actions}: {eyebrow?: string; title: string; text?: string; actions?: ReactNode}) {
  return <header className={s.appHeader}><div>{eyebrow && <EHEyebrow>{eyebrow}</EHEyebrow>}<EHHeading as="h1" scale="app">{title}</EHHeading>{text && <EHText>{text}</EHText>}</div>{actions && <EHActions>{actions}</EHActions>}</header>;
}
export function EHField({id, label, hint, error, required, children}: {id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactNode}) {
  return <div className={s.field}><label htmlFor={id}>{label}{required && <span> (erforderlich)</span>}</label>{hint && <p id={id+"-hint"} className={s.fieldHint}>{hint}</p>}{children}{error && <p id={id+"-error"} className={s.fieldError} role="alert">{error}</p>}</div>;
}
export function EHInput(props: Native<InputHTMLAttributes<HTMLInputElement>>) {return <input {...props} className={s.input}/>;}
export function EHTextarea(props: Native<TextareaHTMLAttributes<HTMLTextAreaElement>>) {return <textarea rows={5} {...props} className={s.textarea}/>;}
export function EHSelect(props: Native<SelectHTMLAttributes<HTMLSelectElement>>) {return <select {...props} className={s.select}/>;}
export function EHCheckbox({label, ...props}: Native<InputHTMLAttributes<HTMLInputElement>> & {label: ReactNode}) {
  const generated=useId();
  return <label className={s.checkbox} htmlFor={props.id ?? generated}><input {...props} id={props.id ?? generated} type="checkbox"/><span>{label}</span></label>;
}
export function EHTabs({label, tabs, defaultValue, value, onValueChange}: {label: string; tabs: {id: string; label: string; content: ReactNode; disabled?: boolean}[]; defaultValue?: string; value?: string; onValueChange?: (id:string)=>void}) {
  const uid=useId(); const [internal,setInternal]=useState(defaultValue ?? tabs.find(t=>!t.disabled)?.id);
  const selected=value ?? internal; const refs=useRef<(HTMLButtonElement|null)[]>([]);
  const activate=(id:string)=>{setInternal(id);onValueChange?.(id);};
  return <div className={s.tabs}><div role="tablist" aria-label={label} className={s.tabList}>{tabs.map((tab,i)=><button type="button" key={tab.id} ref={node=>{refs.current[i]=node;}} id={uid+"-tab-"+tab.id} role="tab" aria-selected={selected===tab.id} aria-controls={uid+"-panel-"+tab.id} tabIndex={selected===tab.id ? 0 : -1} disabled={tab.disabled} onClick={()=>activate(tab.id)} onKeyDown={event=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault(); const enabled=tabs.map((t,n)=>t.disabled ? -1:n).filter(n=>n>=0); const index=enabled.indexOf(i);
    const next=event.key==="Home" ? enabled[0] : event.key==="End" ? enabled.at(-1) : enabled[(index+(event.key==="ArrowRight" ? 1:-1)+enabled.length)%enabled.length];
    if(next!==undefined) {refs.current[next]?.focus(); activate(tabs[next].id);}
  }}>{tab.label}</button>)}</div>{tabs.map(tab=><div key={tab.id} id={uid+"-panel-"+tab.id} role="tabpanel" aria-labelledby={uid+"-tab-"+tab.id} hidden={selected!==tab.id} tabIndex={0} className={s.tabPanel}>{tab.content}</div>)}</div>;
}
export function EHDialog({open, onClose, title, children, actions}: {open: boolean; onClose: ()=>void; title: string; children: ReactNode; actions?: ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null); const uid=useId();
  useEffect(()=>{const dialog=ref.current; if(!dialog) return; if(open && !dialog.open) dialog.showModal(); else if(!open && dialog.open) dialog.close();},[open]);
  return <dialog ref={ref} className={s.dialog} aria-labelledby={uid} onCancel={event=>{event.preventDefault();onClose();}} onClose={onClose}><div className={s.dialogHead}><h2 id={uid}>{title}</h2><button type="button" aria-label="Dialog schließen" onClick={onClose}>×</button></div><div className={s.dialogBody}>{children}</div>{actions && <EHActions>{actions}</EHActions>}</dialog>;
}
export function EHEmptyState({title, text, action}: {title: string; text: string; action?: ReactNode}) {
  return <div className={s.emptyState}><EHEyebrow number="—">Hier ist Platz</EHEyebrow><EHHeading as="h2" scale="item">{title}</EHHeading><EHText>{text}</EHText>{action && <EHActions>{action}</EHActions>}</div>;
}
export function EHLoadingState({label = "Wird geladen …"}: {label?: string}) {return <div className={s.loading} role="status"><span aria-hidden="true"/>{label}</div>;}
export function EHErrorState({title = "Das hat noch nicht geklappt.", text, onRetry}: {title?: string; text: string; onRetry?: ()=>void}) {
  return <div className={s.errorState} role="alert"><EHHeading as="h2" scale="item">{title}</EHHeading><EHText>{text}</EHText>{onRetry && <EHButton onClick={onRetry} variant="secondary">Erneut versuchen</EHButton>}</div>;
}
export function EHDataTable({caption, columns, rows}: {caption: string; columns: {key: string; label: string; numeric?: boolean}[]; rows: {id: string; cells: Record<string,ReactNode>}[]}) {
  return <div className={s.tableScroll} role="region" aria-label={caption} tabIndex={0}><table className={s.table}><caption>{caption}</caption><thead><tr>{columns.map(c=><th scope="col" key={c.key} data-numeric={c.numeric || undefined}>{c.label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.id}>{columns.map((c,i)=>i===0 ? <th key={c.key} scope="row">{row.cells[c.key]}</th> : <td key={c.key} data-numeric={c.numeric || undefined}>{row.cells[c.key]}</td>)}</tr>)}</tbody></table>{!rows.length && <EHText>Keine Einträge vorhanden.</EHText>}</div>;
}
export function EHList({items, label}: {label: string; items: {id: string; title: string; text?: string; href?: string; meta?: ReactNode; action?: ReactNode}[]}) {
  return <ul className={s.list} aria-label={label}>{items.map(item=><li key={item.id}><div>{item.href ? <a href={item.href} className={s.listTitle}>{item.title}</a> : <span className={s.listTitle}>{item.title}</span>}{item.text && <EHText>{item.text}</EHText>}</div><div className={s.listMeta}>{item.meta}{item.action}</div></li>)}</ul>;
}
export function EHComposer({onSubmit, pending = false, error, label = "Was steht bei deinem Haus an?", hint = "Beschreibe dein Anliegen. Du entscheidest anschließend über den nächsten Schritt.", submitLabel = "Anliegen weitergeben"}: {onSubmit: (text:string)=>void | Promise<void>; pending?: boolean; error?: string; label?: string; hint?: string; submitLabel?: string}) {
  const id=useId(); const [value,setValue]=useState(""); const [localError,setLocalError]=useState(""); const [submitting,setSubmitting]=useState(false); const busy=pending||submitting;
  async function submit(event:FormEvent<HTMLFormElement>) {event.preventDefault();if(!value.trim()) {setLocalError("Bitte beschreibe dein Anliegen.");return;}setLocalError(""); if(busy)return; setSubmitting(true); try {await onSubmit(value.trim());} catch {setLocalError("Dein Anliegen konnte noch nicht übermittelt werden. Bitte versuche es erneut.");} finally {setSubmitting(false);}}
  const issue=error || localError;
  return <form className={s.composer} onSubmit={submit}><EHField id={id} label={label} hint={hint} error={issue} required><EHTextarea id={id} name="anliegen" value={value} onChange={e=>setValue(e.target.value)} required disabled={busy} maxLength={5000} aria-invalid={Boolean(issue)} aria-describedby={[id+"-hint",issue ? id+"-error" : ""].filter(Boolean).join(" ")}/></EHField><EHActions><EHButton type="submit" disabled={busy} arrow>{busy ? "Wird übermittelt …" : submitLabel}</EHButton></EHActions></form>;
}
export type EHDocument = {id: string; title: string; category: string; date: string; href: string};
export function EHDocumentList({documents}: {documents: EHDocument[]}) {
  const id=useId(); const [query,setQuery]=useState("");const needle=query.trim().toLocaleLowerCase("de");
  const found=documents.filter(d=>(d.title+" "+d.category).toLocaleLowerCase("de").includes(needle));
  return <div className={s.documentList}><EHField id={id} label="Dokumente suchen"><EHInput id={id} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Titel oder Kategorie"/></EHField><p className={s.fieldHint} role="status">{found.length} {found.length===1 ? "Dokument" : "Dokumente"}</p>{found.length ? <EHList label="Dokumente" items={found.map(d=>({...d,text:d.category,meta:<EHStatus>{d.date}</EHStatus>}))}/> : <EHEmptyState title="Keine passenden Dokumente" text="Versuche einen anderen Suchbegriff."/>}</div>;
}

`````

## packages/eh-design/src/blocks.tsx

`````tsx
import type { ReactNode } from "react";
import {EHSection, EHHeading, EHText, EHEyebrow, EHButton, EHTextLink, EHActions, EHImageFrame, type EHTone} from "./primitives";
import s from "./styles.module.css";
export type EHItem = {title: string; text?: ReactNode; icon?: ReactNode};
export type EHLink = {title: string; href: string; text?: string; label?: string};
export function EHPageHero({eyebrow, number, title, text, actions, media, display = false, tone = "paper"}: {eyebrow?: string; number?: string; title: ReactNode; text?: ReactNode; actions?: ReactNode; media?: ReactNode; display?: boolean; tone?: EHTone}) {
  return <EHSection tone={tone}><div className={s.hero} data-has-media={Boolean(media)}><div className={s.heroCopy}>{eyebrow && <EHEyebrow number={number}>{eyebrow}</EHEyebrow>}<EHHeading as="h1" scale={display ? "display" : "page"}>{title}</EHHeading>{text && <EHText size="lead">{text}</EHText>}{actions && <EHActions>{actions}</EHActions>}</div>{media && <div className={s.heroMedia}>{media}</div>}</div></EHSection>;
}
export function EHPromiseRow({items}: {items: EHItem[]}) {
  return <ol className={s.promiseRow}>{items.map((item,i)=><li key={item.title}><EHEyebrow number={String(i+1).padStart(2,"0")}>Einfachhausen</EHEyebrow><EHHeading as="h3" scale="item">{item.title}</EHHeading>{item.text && <div className={s.text}>{item.text}</div>}</li>)}</ol>;
}
export function EHFeatureRows({items}: {items: EHItem[]}) {
  return <ul className={s.featureRows}>{items.map((item,i)=><li key={item.title}><span className={s.rowNumber} aria-hidden="true">{String(i+1).padStart(2,"0")}</span><div><EHHeading as="h3" scale="item">{item.title}</EHHeading>{item.text && <div className={s.text}>{item.text}</div>}</div>{item.icon && <span className={s.featureIcon} aria-hidden="true">{item.icon}</span>}</li>)}</ul>;
}
export function EHSplitStory({eyebrow, title, text, media, children, reverse = false}: {eyebrow?: string; title: ReactNode; text?: ReactNode; media: ReactNode; children?: ReactNode; reverse?: boolean}) {
  return <div className={s.split} data-reverse={reverse || undefined}><div className={s.storyCopy}>{eyebrow && <EHEyebrow>{eyebrow}</EHEyebrow>}<EHHeading>{title}</EHHeading>{text && <EHText size="lead">{text}</EHText>}{children}</div><div className={s.storyMedia}>{media}</div></div>;
}
export function EHSteps({items}: {items: EHItem[]}) {
  return <ol className={s.steps}>{items.map((item,i)=><li key={item.title}><span className={s.stepNumber}>{String(i+1).padStart(2,"0")}</span><div><EHHeading as="h3" scale="item">{item.title}</EHHeading>{item.text && <div className={s.text}>{item.text}</div>}</div></li>)}</ol>;
}
export function EHTimeline({items}: {items: {when: string; title: string; text?: ReactNode; current?: boolean}[]}) {
  return <ol className={s.timeline}>{items.map((item,i)=><li key={i} aria-current={item.current ? "step" : undefined}><span className={s.timelineDate}>{item.when}</span><div><EHHeading as="h3" scale="item">{item.title}</EHHeading>{item.text && <div className={s.text}>{item.text}</div>}</div></li>)}</ol>;
}
export function EHFacts({items}: {items: {value: ReactNode; label: string; source?: string}[]}) {
  return <dl className={s.facts}>{items.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd>{item.source && <dd className={s.factSource}>{item.source}</dd>}</div>)}</dl>;
}
export function EHComparison({left, right}: {left: {title: string; items: string[]}; right: {title: string; items: string[]}}) {
  return <div className={s.comparison}>{[left,right].map((part,i)=><div key={part.title} data-emphasis={i===1}><EHEyebrow number={String(i+1).padStart(2,"0")}>Im Vergleich</EHEyebrow><EHHeading as="h3" scale="item">{part.title}</EHHeading><ul>{part.items.map(item=><li key={item}>{item}</li>)}</ul></div>)}</div>;
}
export function EHFAQ({items}: {items: {q: string; a: ReactNode}[]}) {
  return <div className={s.faq}>{items.map(item=><details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><div>{item.a}</div></details>)}</div>;
}
export function EHCallout({title, children, tone = "sand"}: {title: string; children: ReactNode; tone?: "sand" | "paper" | "deep"}) {
  return <aside className={s.callout} data-tone={tone}><EHHeading as="h3" scale="item">{title}</EHHeading><div className={s.calloutBody}>{children}</div></aside>;
}
export function EHClosing({title, text, href, label = "Anliegen besprechen", secondary}: {title: ReactNode; text?: string; href?: string; label?: string; secondary?: ReactNode}) {
  return <EHSection tone="deep"><div className={s.closing}><EHEyebrow number="EH">Dein Haus. Einfach geregelt.</EHEyebrow><EHHeading>{title}</EHHeading>{text && <EHText size="lead">{text}</EHText>}<EHActions>{href && <EHButton href={href} variant="on-dark" arrow>{label}</EHButton>}{secondary}</EHActions></div></EHSection>;
}
export function EHProse({children}: {children: ReactNode}) {return <div className={s.prose}>{children}</div>;}
export function EHArticleHeader({category, title, description, author, date, readingTime}: {category: string; title: string; description?: string; author?: string; date?: string; readingTime?: string}) {
  return <header className={s.articleHeader}><EHEyebrow>{category}</EHEyebrow><EHHeading as="h1" scale="page">{title}</EHHeading>{description && <EHText size="lead">{description}</EHText>}<div className={s.articleMeta}>{[author,date,readingTime].filter(Boolean).map(item=><span key={item}>{item}</span>)}</div></header>;
}
export function EHContents({items, title = "Auf dieser Seite"}: {items: {id: string; title: string}[]; title?: string}) {
  return <nav className={s.contents} aria-label={title}><EHEyebrow>{title}</EHEyebrow><ol>{items.map((item,i)=><li key={item.id}><a href={"#"+item.id}><span>{String(i+1).padStart(2,"0")}</span>{item.title}</a></li>)}</ol></nav>;
}
export function EHRelated({items, title = "Das könnte dich auch interessieren"}: {items: EHLink[]; title?: string}) {
  return <div className={s.related}><EHHeading>{title}</EHHeading><EHServiceIndex items={items}/></div>;
}
export function EHServiceIndex({items}: {items: EHLink[]}) {
  return <ul className={s.serviceIndex}>{items.map((item,i)=><li key={item.href}><a href={item.href}><span className={s.rowNumber}>{String(i+1).padStart(2,"0")}</span><div>{item.label && <EHEyebrow>{item.label}</EHEyebrow>}<EHHeading as="h3" scale="item">{item.title}</EHHeading>{item.text && <div className={s.text}>{item.text}</div>}</div><span aria-hidden="true">↗</span></a></li>)}</ul>;
}
export function EHPricing({plans, note}: {plans: {name: string; price: string; period?: string; text: string; features: string[]; href: string; action: string; recommended?: boolean}[]; note?: string}) {
  return <div><div className={s.pricing}>{plans.map(plan=><section key={plan.name} className={s.pricePlan} data-recommended={plan.recommended || undefined}><EHEyebrow>{plan.recommended ? "Unsere Empfehlung" : "Dein Umfang"}</EHEyebrow><EHHeading as="h3" scale="item">{plan.name}</EHHeading><p className={s.price}>{plan.price}<span>{plan.period}</span></p><EHText>{plan.text}</EHText><ul>{plan.features.map(f=><li key={f}>{f}</li>)}</ul><EHButton href={plan.href} arrow>{plan.action}</EHButton></section>)}</div>{note && <EHText size="meta">{note}</EHText>}</div>;
}
export function EHMediaStory({src, alt, caption, title, text}: {src: string; alt: string; caption?: string; title: string; text: string}) {
  return <EHSplitStory title={title} text={text} media={<EHImageFrame src={src} alt={alt} caption={caption}/>}/>;
}
export function EHArticleLayout({contents, children}: {contents: {id: string; title: string}[]; children: ReactNode}) {
  return <div className={s.articleLayout}><EHContents items={contents}/><EHProse>{children}</EHProse></div>;
}
export function EHPanel({title, label, children, footer}: {title?: string; label?: string; children: ReactNode; footer?: {href: string; text: string}}) {
  return <section className={s.panel}>{label && <EHEyebrow>{label}</EHEyebrow>}{title && <EHHeading as="h2" scale="item">{title}</EHHeading>}<div className={s.panelBody}>{children}</div>{footer && <EHTextLink href={footer.href}>{footer.text}</EHTextLink>}</section>;
}

`````

## packages/eh-design/src/html-style.mjs

`````js
// Generated canonical HTML adapter assets. Do not edit.
export const EHHtmlStyles="@font-face{font-family:Inter;src:url(\"data:font/woff2;base64,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\") format(\"woff2\");font-weight:100 900}html,body{margin:0}/* Generated from tokens.json. Run node scripts/eh-design-generate.mjs. */\n:root {\n  --eh-color-paper: #faf8f4;\n  --eh-color-petrol: #105258;\n  --eh-color-deep: #0a3539;\n  --eh-color-ink: #10222a;\n  --eh-color-secondary: #4b5b60;\n  --eh-color-line: #e4e2dc;\n  --eh-color-sand: #ecdfc9;\n  --eh-color-terra: #a84d29;\n  --eh-color-white: #ffffff;\n  --eh-color-error: #a13232;\n  --eh-color-success: #236344;\n  --eh-color-focus: #a84d29;\n  --eh-font-family: Inter, var(--font-marketing, Arial), sans-serif;\n  --eh-font-body: 1.0625rem;\n  --eh-font-app: 1rem;\n  --eh-font-label: 0.9375rem;\n  --eh-font-meta: 0.8125rem;\n  --eh-font-eyebrow: 0.75rem;\n  --eh-font-input: 1rem;\n  --eh-font-display: clamp(3.5rem, 7.8vw, 7rem);\n  --eh-font-page: clamp(2.75rem, 5vw, 4.25rem);\n  --eh-font-section: clamp(2rem, 3.6vw, 3.25rem);\n  --eh-font-app-title: clamp(2rem, 3vw, 2.75rem);\n  --eh-space-xs: 0.5rem;\n  --eh-space-sm: 1rem;\n  --eh-space-md: 1.5rem;\n  --eh-space-lg: 2rem;\n  --eh-space-xl: 3rem;\n  --eh-space-section: clamp(3.5rem, 7vw, 7rem);\n  --eh-space-gutter: clamp(1.25rem, 4vw, 4.5rem);\n  --eh-shape-control: 0.375rem;\n  --eh-shape-panel: 0.5rem;\n  --eh-shape-cut: clamp(1.5rem, 3vw, 3rem);\n  --eh-motion-duration: 180ms;\n  --eh-motion-ease: cubic-bezier(0.2, 0.7, 0.2, 1);\n}\n/* Einfachhausen 1.0 · accepted Atelier 02. Change only with explicit brand-owner instruction. */\n.eh-scope {\n  --eh-fg: var(--eh-color-ink); --eh-muted: var(--eh-color-secondary);\n  --eh-rule: var(--eh-color-line); --eh-bg: var(--eh-color-paper);\n  color: var(--eh-fg); background: var(--eh-bg);\n  font-family: var(--eh-font-family); font-size: var(--eh-font-body); line-height: 1.65;\n  -webkit-font-smoothing: antialiased; overflow-wrap: break-word;\n}\n.eh-scope[data-eh-app] { font-size: var(--eh-font-app); }\n.eh-scope *, .eh-dialog * { box-sizing: border-box; }\n.eh-scope :where(a, button, input, textarea, select, summary, [tabindex]):focus-visible,\n.eh-dialog :where(a, button, input, textarea, select, [tabindex]):focus-visible {\n  outline: 3px solid var(--eh-color-focus); outline-offset: 4px;\n}\n.eh-scope :where(h1,h2,h3,h4,p,ul,ol,figure,blockquote,dl) { margin: 0; }\n.eh-scope :where(a) { color: inherit; }\n.eh-container, .eh-narrow { width: min(100% - var(--eh-space-gutter) * 2, 1296px); margin-inline: auto; }\n.eh-narrow { max-width: 760px; }\n.eh-section { padding-block: var(--eh-space-section); color: var(--eh-fg); background: var(--eh-bg); }\n.eh-section[data-compact] { padding-block: var(--eh-space-xl); }\n.eh-section[data-tone=\"paper\"], .eh-callout[data-tone=\"paper\"] { --eh-bg: var(--eh-color-paper); }\n.eh-section[data-tone=\"white\"] { --eh-bg: var(--eh-color-white); }\n.eh-section[data-tone=\"sand\"], .eh-callout[data-tone=\"sand\"] { --eh-bg: var(--eh-color-sand); }\n.eh-section[data-tone=\"deep\"], .eh-callout[data-tone=\"deep\"], .eh-recordCover {\n  --eh-bg: var(--eh-color-deep); --eh-fg: var(--eh-color-paper);\n  --eh-muted: var(--eh-color-sand); --eh-rule: var(--eh-color-secondary);\n  color: var(--eh-fg); background: var(--eh-bg);\n}\n.eh-logoLink { display: inline-flex; align-items: center; padding: 8px; background: var(--eh-color-paper); }\n.eh-logo { display: block; width: 126px; height: auto; object-fit: contain; }\n.eh-eyebrow { display: flex; gap: 12px; align-items: baseline; font-size: var(--eh-font-eyebrow); font-weight: 750; line-height: 1.5; letter-spacing: .09em; text-transform: uppercase; }\n.eh-register { color: var(--eh-color-terra); font-variant-numeric: tabular-nums; }\n[data-tone=\"deep\"] .eh-register, .eh-recordCover .eh-register { color: var(--eh-color-sand); }\n.eh-heading { color: inherit; font-family: inherit; font-weight: 760; line-height: 1.05; letter-spacing: -.045em; text-wrap: balance; }\n.eh-heading[data-scale=\"display\"] { font-size: var(--eh-font-display); line-height: .99; letter-spacing: -.052em; }\n.eh-heading[data-scale=\"page\"] { font-size: var(--eh-font-page); }\n.eh-heading[data-scale=\"section\"] { font-size: var(--eh-font-section); }\n.eh-heading[data-scale=\"app\"] { font-size: var(--eh-font-app-title); }\n.eh-heading[data-scale=\"item\"] { font-size: clamp(1.25rem, 1.6vw, 1.5rem); line-height: 1.2; letter-spacing: -.025em; }\n.eh-text { font-size: var(--eh-font-body); line-height: 1.65; max-width: 66ch; color: inherit; }\n.eh-text[data-size=\"lead\"] { font-size: clamp(1.0625rem, 1.45vw, 1.25rem); line-height: 1.65; max-width: 51ch; }\n.eh-text[data-size=\"meta\"] { font-size: var(--eh-font-meta); line-height: 1.55; }\n.eh-text[data-muted] { color: var(--eh-muted); }\n.eh-actions { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; }\n.eh-button {\n  display: inline-flex; align-items: center; justify-content: space-between; gap: 24px;\n  min-height: 48px; max-width: 100%; padding: 12px 22px; border: 1px solid transparent;\n  border-radius: var(--eh-shape-control); background: var(--eh-color-petrol); color: var(--eh-color-white);\n  font: 650 var(--eh-font-label)/1.4 var(--eh-font-family); text-align: center; text-decoration: none;\n  cursor: pointer; transition: background var(--eh-motion-duration) var(--eh-motion-ease), border-color var(--eh-motion-duration) var(--eh-motion-ease);\n}\n.eh-button:hover { background: var(--eh-color-deep); }\n.eh-button[data-size=\"small\"] { padding: 10px 16px; min-height: 44px; }\n.eh-button[data-variant=\"secondary\"] { background: transparent; color: var(--eh-fg); border-color: var(--eh-fg); }\n.eh-button[data-variant=\"secondary\"]:hover { background: var(--eh-color-sand); color: var(--eh-color-ink); }\n.eh-button[data-variant=\"quiet\"] { background: transparent; color: var(--eh-fg); text-decoration: underline; text-underline-offset: 5px; }\n.eh-button[data-variant=\"on-dark\"] { background: var(--eh-color-paper); color: var(--eh-color-deep); }\n.eh-button[data-variant=\"on-dark\"]:hover { background: var(--eh-color-sand); }\n.eh-button[data-variant=\"danger\"] { background: var(--eh-color-error); color: var(--eh-color-white); }\n.eh-button:disabled { opacity: .55; cursor: not-allowed; }\n.eh-textLink { display: inline-flex; align-items: center; min-height: 44px; font-size: var(--eh-font-label); font-weight: 650; gap: 12px; text-decoration: underline; text-underline-offset: 5px; }\n.eh-figure { min-width: 0; }\n.eh-imageCut { clip-path: polygon(0 0, calc(100% - var(--eh-shape-cut)) 0, 100% var(--eh-shape-cut), 100% 100%, 0 100%); overflow: hidden; aspect-ratio: 1.15; background: var(--eh-color-sand); }\n.eh-imageCut img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center; }\n.eh-imageCut[data-portrait] { aspect-ratio: .85; }\n.eh-figure figcaption { margin-top: 12px; color: var(--eh-muted); font-size: var(--eh-font-meta); line-height: 1.55; }\n.eh-recordCover { position: relative; display: flex; flex-direction: column; gap: 26px; padding: clamp(26px,4vw,52px); min-height: 360px; clip-path: polygon(0 0,calc(100% - var(--eh-shape-cut)) 0,100% var(--eh-shape-cut),100% 100%,0 100%); }\n.eh-recordCover .eh-heading { max-width: 10ch; }\n.eh-coverBody { border-top: 1px solid var(--eh-rule); padding-top: 22px; }\n.eh-coverFoot { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; border-top: 1px solid var(--eh-rule); padding-top: 18px; margin-top: auto; font-size: var(--eh-font-meta); }\n.eh-status { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 5px 9px; border: 1px solid var(--eh-color-line); border-radius: var(--eh-shape-control); color: var(--eh-color-secondary); background: var(--eh-color-paper); font-size: var(--eh-font-meta); font-weight: 600; line-height: 1.4; }\n.eh-status::before { content: \"\"; width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: 0 0 auto; }\n.eh-status[data-status=\"info\"] { color: var(--eh-color-petrol); }\n.eh-status[data-status=\"success\"] { color: var(--eh-color-success); }\n.eh-status[data-status=\"warning\"] { color: var(--eh-color-terra); }\n.eh-status[data-status=\"error\"] { color: var(--eh-color-error); }\n.eh-divider { border: 0; border-top: 1px solid var(--eh-rule); margin-block: 32px; }\n.eh-hero { display: grid; gap: clamp(36px,6vw,96px); align-items: center; }\n.eh-hero[data-has-media=\"true\"] { grid-template-columns: minmax(0,1.08fr) minmax(0,1fr); }\n.eh-heroCopy { display: flex; flex-direction: column; gap: 28px; align-items: flex-start; }\n.eh-heroCopy .eh-heading { max-width: 16ch; }\n.eh-heroCopy .eh-heading[data-scale=\"display\"] { max-width: 10ch; }\n.eh-heroCopy .eh-actions { margin-top: 8px; }\n.eh-heroMedia { min-width: 0; }\n.eh-promiseRow { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,220px),1fr)); padding: 0; list-style: none; border-top: 1px solid var(--eh-rule); }\n.eh-promiseRow li { padding: 28px 30px 12px 0; display: flex; flex-direction: column; gap: 15px; }\n.eh-promiseRow li + li { padding-left: 30px; border-left: 1px solid var(--eh-rule); }\n.eh-featureRows, .eh-steps, .eh-timeline, .eh-serviceIndex, .eh-list { list-style: none; padding: 0; }\n.eh-featureRows li { display: grid; grid-template-columns: 40px minmax(0,1fr) auto; gap: 24px; padding: 26px 0; border-top: 1px solid var(--eh-rule); align-items: start; }\n.eh-featureRows li > div { display: grid; gap: 10px; }\n.eh-rowNumber { font-size: var(--eh-font-meta); font-weight: 650; font-variant-numeric: tabular-nums; color: var(--eh-muted); padding-top: 4px; }\n.eh-featureIcon { color: var(--eh-color-petrol); }\n.eh-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,6vw,96px); align-items: center; }\n.eh-storyCopy { display: flex; flex-direction: column; gap: 24px; }\n.eh-storyMedia { min-width: 0; }\n.eh-split[data-reverse] .eh-storyCopy { order: 2; }\n.eh-steps { display: grid; gap: 0; counter-reset: steps; }\n.eh-steps li { display: grid; grid-template-columns: 88px minmax(0,1fr); gap: 32px; padding: 30px 0; border-top: 1px solid var(--eh-rule); }\n.eh-steps li > div { display: grid; gap: 12px; }\n.eh-stepNumber { white-space: nowrap; font-size: clamp(2.5rem,4vw,3.5rem); line-height: 1; letter-spacing: -.05em; font-weight: 720; color: var(--eh-color-petrol); font-variant-numeric: tabular-nums; }\n[data-tone=\"deep\"] .eh-stepNumber { white-space: nowrap; color: var(--eh-color-sand); }\n.eh-timeline li { display: grid; grid-template-columns: 130px minmax(0,1fr); gap: 28px; position: relative; padding: 8px 0 32px 30px; border-left: 1px solid var(--eh-rule); }\n.eh-timeline li::before { content: \"\"; position: absolute; left: -5px; top: 16px; width: 9px; height: 9px; border: 2px solid var(--eh-color-petrol); background: var(--eh-bg); }\n.eh-timeline li[aria-current]::before { background: var(--eh-color-petrol); }\n.eh-timeline li > div { display: grid; gap: 10px; }\n.eh-timelineDate { color: var(--eh-muted); font-size: var(--eh-font-meta); padding-top: 3px; }\n.eh-facts { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,190px),1fr)); border-top: 1px solid var(--eh-rule); gap: 32px; }\n.eh-facts > div { padding-top: 26px; display: flex; flex-direction: column; gap: 12px; }\n.eh-facts dt { font-size: var(--eh-font-label); }\n.eh-facts dd { order: -1; margin: 0; font-size: clamp(2.5rem,5vw,4rem); font-weight: 740; letter-spacing: -.045em; line-height: 1.1; }\n.eh-facts dd.eh-factSource { order: 1; font-size: var(--eh-font-meta); font-weight: 400; letter-spacing: normal; line-height: 1.5; color: var(--eh-muted); }\n.eh-comparison { display: grid; grid-template-columns: 1fr 1fr; border-block: 1px solid var(--eh-rule); }\n.eh-comparison > div { padding: 32px; display: flex; flex-direction: column; gap: 22px; }\n.eh-comparison > div[data-emphasis=\"true\"] { background: var(--eh-color-sand); color: var(--eh-color-ink); }\n.eh-comparison ul, .eh-pricePlan ul { padding-left: 20px; display: grid; gap: 14px; }\n.eh-faq { border-top: 1px solid var(--eh-rule); }\n.eh-faq details { border-bottom: 1px solid var(--eh-rule); }\n.eh-faq summary { cursor: pointer; list-style: none; min-height: 64px; padding: 24px 0; display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 1.125rem; font-weight: 650; line-height: 1.45; }\n.eh-faq summary::-webkit-details-marker { display: none; }\n.eh-faq summary span { font-size: 1.5rem; font-weight: 400; }\n.eh-faq details[open] summary span { transform: rotate(45deg); }\n.eh-faq details > div { max-width: 72ch; padding: 0 36px 28px 0; font-size: var(--eh-font-body); }\n.eh-callout { background: var(--eh-bg); padding: clamp(24px,4vw,40px); display: grid; gap: 18px; border-left: 2px solid var(--eh-color-terra); }\n.eh-calloutBody { font-size: var(--eh-font-body); line-height: 1.65; }\n.eh-closing { display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }\n.eh-closing .eh-heading { font-size: clamp(2.75rem,6.5vw,6rem); max-width: 15ch; }\n.eh-prose { max-width: 70ch; font-size: 1.125rem; line-height: 1.8; }\n.eh-prose > * + * { margin-top: 1.5em; }\n.eh-prose :where(h2,h3,h4) { font-weight: 720; line-height: 1.2; letter-spacing: -.03em; margin-top: 2em; scroll-margin-top: 100px; }\n.eh-prose h2 { font-size: clamp(1.75rem,3vw,2.5rem); }\n.eh-prose h3 { font-size: 1.5rem; }\n.eh-prose :where(ul,ol) { padding-left: 24px; }\n.eh-prose li + li { margin-top: .5em; }\n.eh-prose a { text-decoration: underline; text-underline-offset: 4px; }\n.eh-prose blockquote { border-left: 2px solid var(--eh-color-terra); padding-left: 24px; }\n.eh-articleHeader { max-width: 1000px; display: grid; gap: 28px; padding-bottom: 40px; }\n.eh-articleMeta { display: flex; flex-wrap: wrap; gap: 12px 28px; font-size: var(--eh-font-meta); color: var(--eh-muted); }\n.eh-articleLayout { display: grid; grid-template-columns: 240px minmax(0,1fr); gap: clamp(32px,6vw,96px); align-items: start; }\n.eh-contents { border-top: 1px solid var(--eh-rule); padding-top: 20px; }\n.eh-contents ol { list-style: none; padding: 12px 0 0; }\n.eh-contents a { display: flex; gap: 14px; min-height: 44px; padding: 10px 0; font-size: var(--eh-font-label); line-height: 1.5; text-decoration: none; }\n.eh-contents a:hover { text-decoration: underline; }\n.eh-contents a span { color: var(--eh-muted); font-size: var(--eh-font-meta); padding-top: 1px; }\n.eh-related { display: grid; gap: 30px; }\n.eh-serviceIndex { border-top: 1px solid var(--eh-rule); }\n.eh-serviceIndex li { border-bottom: 1px solid var(--eh-rule); }\n.eh-serviceIndex a { display: grid; grid-template-columns: 44px minmax(0,1fr) 24px; gap: 24px; align-items: start; padding: 30px 0; text-decoration: none; }\n.eh-serviceIndex a > div { display: grid; gap: 12px; }\n.eh-serviceIndex a:hover .eh-heading { text-decoration: underline; text-underline-offset: 5px; }\n.eh-pricing { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,260px),1fr)); gap: 24px; margin-bottom: 24px; }\n.eh-pricePlan { padding: 32px; border: 1px solid var(--eh-rule); display: flex; flex-direction: column; gap: 22px; background: var(--eh-color-white); color: var(--eh-color-ink); }\n.eh-pricePlan[data-recommended] { background: var(--eh-color-sand); border-color: var(--eh-color-petrol); }\n.eh-price { font-size: 2.75rem; line-height: 1.2; letter-spacing: -.04em; font-weight: 740; display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; }\n.eh-price span { font-size: var(--eh-font-meta); font-weight: 400; letter-spacing: normal; }\n.eh-pricePlan .eh-button { margin-top: auto; align-self: flex-start; }\n.eh-panel { background: var(--eh-color-white); border: 1px solid var(--eh-rule); border-radius: var(--eh-shape-panel); padding: clamp(22px,3vw,32px); display: grid; gap: 20px; min-width: 0; }\n.eh-panelBody { min-width: 0; }\n.eh-appHeader { display: flex; gap: 28px; justify-content: space-between; align-items: flex-end; padding-bottom: 32px; border-bottom: 1px solid var(--eh-rule); margin-bottom: 32px; }\n.eh-appHeader > div:first-child { display: grid; gap: 14px; }\n.eh-field { display: grid; gap: 9px; min-width: 0; }\n.eh-field label { font-size: var(--eh-font-label); line-height: 1.5; font-weight: 650; }\n.eh-field label span { font-size: var(--eh-font-meta); font-weight: 400; color: var(--eh-muted); }\n.eh-fieldHint { font-size: var(--eh-font-meta); color: var(--eh-muted); line-height: 1.55; }\n.eh-fieldError { font-size: var(--eh-font-label); color: var(--eh-color-error); line-height: 1.5; }\n.eh-input, .eh-textarea, .eh-select { appearance: auto; display: block; width: 100%; min-height: 48px; padding: 12px 14px; border: 1px solid var(--eh-color-secondary); border-radius: var(--eh-shape-control); color: var(--eh-color-ink); background: var(--eh-color-white); font: 400 var(--eh-font-input)/1.5 var(--eh-font-family); }\n.eh-textarea { resize: vertical; min-height: 140px; }\n.eh-input::placeholder, .eh-textarea::placeholder { color: var(--eh-color-secondary); opacity: 1; }\n:is(.eh-input,.eh-textarea,.eh-select)[aria-invalid=\"true\"] { border-color: var(--eh-color-error); }\n:is(.eh-input,.eh-textarea,.eh-select):disabled { background: var(--eh-color-paper); opacity: .7; cursor: not-allowed; }\n.eh-checkbox { display: flex; align-items: flex-start; gap: 12px; min-height: 44px; padding: 8px 0; font-size: var(--eh-font-label); line-height: 1.6; cursor: pointer; }\n.eh-checkbox input { width: 20px; height: 20px; margin-top: 2px; accent-color: var(--eh-color-petrol); flex: 0 0 auto; }\n.eh-tabList { display: flex; border-bottom: 1px solid var(--eh-rule); overflow-x: auto; gap: 6px; padding: 4px; }\n.eh-tabList button { flex: 0 0 auto; background: transparent; border: 0; border-bottom: 2px solid transparent; border-radius: 0; color: var(--eh-color-secondary); padding: 14px 18px; min-height: 48px; font: 600 var(--eh-font-label)/1.4 var(--eh-font-family); cursor: pointer; }\n.eh-tabList button[aria-selected=\"true\"] { border-color: var(--eh-color-petrol); color: var(--eh-color-petrol); }\n.eh-tabList button:disabled { opacity: .5; cursor: not-allowed; }\n.eh-tabPanel { padding-top: 28px; }\n.eh-tabPanel[hidden] { display: none; }\n.eh-dialog { width: min(600px,calc(100vw - 40px)); max-height: calc(100dvh - 40px); margin: auto; padding: 28px; border: 1px solid var(--eh-color-line); border-radius: var(--eh-shape-panel); background: var(--eh-color-paper); color: var(--eh-color-ink); font: 400 var(--eh-font-app)/1.65 var(--eh-font-family); }\n.eh-dialog::backdrop { background: var(--eh-color-deep); opacity: .7; }\n.eh-dialogHead { display: flex; align-items: start; justify-content: space-between; gap: 24px; }\n.eh-dialogHead h2 { font-size: 1.5rem; line-height: 1.25; letter-spacing: -.03em; margin: 0; }\n.eh-dialogHead > button { min-width: 44px; min-height: 44px; border: 1px solid var(--eh-color-line); background: transparent; color: inherit; border-radius: var(--eh-shape-control); font-size: 1.5rem; cursor: pointer; }\n.eh-dialogBody { padding-block: 24px; }\n.eh-emptyState { border: 1px solid var(--eh-rule); padding: 36px; display: grid; gap: 18px; }\n.eh-loading { display: flex; align-items: center; gap: 14px; padding: 28px 0; font-size: var(--eh-font-label); }\n.eh-loading span { width: 20px; height: 20px; border: 2px solid var(--eh-color-line); border-top-color: var(--eh-color-petrol); border-radius: 50%; }\n.eh-errorState { border-left: 3px solid var(--eh-color-error); padding: 24px; background: var(--eh-color-white); display: grid; gap: 18px; }\n.eh-errorState .eh-button { justify-self: start; }\n.eh-tableScroll { max-width: 100%; overflow-x: auto; }\n.eh-table { border-collapse: collapse; min-width: 540px; width: 100%; text-align: left; font-size: var(--eh-font-app); }\n.eh-table caption { text-align: left; font-size: 1.125rem; font-weight: 650; padding-bottom: 20px; }\n.eh-table :is(th,td) { padding: 18px 16px; border-bottom: 1px solid var(--eh-rule); vertical-align: top; }\n.eh-table thead th { font-size: var(--eh-font-label); color: var(--eh-muted); font-weight: 600; }\n.eh-table tbody th { font-weight: 600; }\n.eh-table [data-numeric] { text-align: right; font-variant-numeric: tabular-nums; }\n.eh-list li { display: flex; gap: 24px; align-items: center; justify-content: space-between; padding: 22px 0; border-bottom: 1px solid var(--eh-rule); }\n.eh-list li:first-child { border-top: 1px solid var(--eh-rule); }\n.eh-list li > div:first-child { display: grid; gap: 5px; min-width: 0; }\n.eh-listTitle { font-size: var(--eh-font-app); font-weight: 650; line-height: 1.4; }\n.eh-listMeta { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; align-items: center; }\n.eh-composer { display: grid; gap: 20px; }\n.eh-documentList { display: grid; gap: 20px; }\n@media (max-width: 850px) {\n  .eh-hero[data-has-media=\"true\"], .eh-split { grid-template-columns: 1fr; gap: 36px; }\n  .eh-heroCopy .eh-heading { max-width: 19ch; }\n  .eh-heroCopy .eh-heading[data-scale=\"display\"] { max-width: 11ch; }\n  .eh-heroMedia { max-width: 640px; }\n  .eh-heroMedia .eh-imageCut { aspect-ratio: 1.45; }\n  .eh-split[data-reverse] .eh-storyCopy { order: initial; }\n  .eh-articleLayout { grid-template-columns: 1fr; }\n  .eh-contents { max-width: 70ch; }\n  .eh-appHeader { align-items: flex-start; flex-direction: column; }\n}\n@media (max-width: 580px) {\n  .eh-promiseRow { grid-template-columns: 1fr; }\n  .eh-promiseRow li, .eh-promiseRow li + li { padding: 26px 0; border-left: 0; border-bottom: 1px solid var(--eh-rule); }\n  .eh-comparison { grid-template-columns: 1fr; }\n  .eh-comparison > div { padding: 26px 20px; }\n  .eh-steps li { grid-template-columns: 60px minmax(0,1fr); gap: 20px; }\n  .eh-timeline li { grid-template-columns: 1fr; gap: 10px; padding-left: 24px; }\n  .eh-featureRows li { grid-template-columns: 28px minmax(0,1fr); gap: 16px; }\n  .eh-featureIcon { display: none; }\n  .eh-serviceIndex a { grid-template-columns: 28px minmax(0,1fr) 20px; gap: 16px; }\n  .eh-list li { align-items: flex-start; flex-direction: column; gap: 12px; }\n  .eh-listMeta { justify-content: flex-start; }\n  .eh-recordCover { min-height: 320px; }\n  .eh-pricePlan, .eh-emptyState { padding: 24px; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .eh-scope *, .eh-dialog * { animation: none; transition: none; scroll-behavior: auto; }\n}\n";
export const EHLogoData="data:image/png;base64,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maknImKAT0REx8U9f1gwjMYm3FU+MFefiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiOJuFLQERERERERERERERERERERERERASW2xERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERPRsIXwIiIiIiIgb3RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE9Gzx/wH8EnO3h6kq9QAAAABJRU5ErkJggg==";

`````

## packages/eh-design/src/html.css

`````css
/* Einfachhausen 1.0 · accepted Atelier 02. Change only with explicit brand-owner instruction. */
.eh-scope {
  --eh-fg: var(--eh-color-ink); --eh-muted: var(--eh-color-secondary);
  --eh-rule: var(--eh-color-line); --eh-bg: var(--eh-color-paper);
  color: var(--eh-fg); background: var(--eh-bg);
  font-family: var(--eh-font-family); font-size: var(--eh-font-body); line-height: 1.65;
  -webkit-font-smoothing: antialiased; overflow-wrap: break-word;
}
.eh-scope[data-eh-app] { font-size: var(--eh-font-app); }
.eh-scope *, .eh-dialog * { box-sizing: border-box; }
.eh-scope :where(a, button, input, textarea, select, summary, [tabindex]):focus-visible,
.eh-dialog :where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 3px solid var(--eh-color-focus); outline-offset: 4px;
}
.eh-scope :where(h1,h2,h3,h4,p,ul,ol,figure,blockquote,dl) { margin: 0; }
.eh-scope :where(a) { color: inherit; }
.eh-container, .eh-narrow { width: min(100% - var(--eh-space-gutter) * 2, 1296px); margin-inline: auto; }
.eh-narrow { max-width: 760px; }
.eh-section { padding-block: var(--eh-space-section); color: var(--eh-fg); background: var(--eh-bg); }
.eh-section[data-compact] { padding-block: var(--eh-space-xl); }
.eh-section[data-tone="paper"], .eh-callout[data-tone="paper"] { --eh-bg: var(--eh-color-paper); }
.eh-section[data-tone="white"] { --eh-bg: var(--eh-color-white); }
.eh-section[data-tone="sand"], .eh-callout[data-tone="sand"] { --eh-bg: var(--eh-color-sand); }
.eh-section[data-tone="deep"], .eh-callout[data-tone="deep"], .eh-recordCover {
  --eh-bg: var(--eh-color-deep); --eh-fg: var(--eh-color-paper);
  --eh-muted: var(--eh-color-sand); --eh-rule: var(--eh-color-secondary);
  color: var(--eh-fg); background: var(--eh-bg);
}
.eh-logoLink { display: inline-flex; align-items: center; padding: 8px; background: var(--eh-color-paper); }
.eh-logo { display: block; width: 126px; height: auto; object-fit: contain; }
.eh-eyebrow { display: flex; gap: 12px; align-items: baseline; font-size: var(--eh-font-eyebrow); font-weight: 750; line-height: 1.5; letter-spacing: .09em; text-transform: uppercase; }
.eh-register { color: var(--eh-color-terra); font-variant-numeric: tabular-nums; }
[data-tone="deep"] .eh-register, .eh-recordCover .eh-register { color: var(--eh-color-sand); }
.eh-heading { color: inherit; font-family: inherit; font-weight: 760; line-height: 1.05; letter-spacing: -.045em; text-wrap: balance; }
.eh-heading[data-scale="display"] { font-size: var(--eh-font-display); line-height: .99; letter-spacing: -.052em; }
.eh-heading[data-scale="page"] { font-size: var(--eh-font-page); }
.eh-heading[data-scale="section"] { font-size: var(--eh-font-section); }
.eh-heading[data-scale="app"] { font-size: var(--eh-font-app-title); }
.eh-heading[data-scale="item"] { font-size: clamp(1.25rem, 1.6vw, 1.5rem); line-height: 1.2; letter-spacing: -.025em; }
.eh-text { font-size: var(--eh-font-body); line-height: 1.65; max-width: 66ch; color: inherit; }
.eh-text[data-size="lead"] { font-size: clamp(1.0625rem, 1.45vw, 1.25rem); line-height: 1.65; max-width: 51ch; }
.eh-text[data-size="meta"] { font-size: var(--eh-font-meta); line-height: 1.55; }
.eh-text[data-muted] { color: var(--eh-muted); }
.eh-actions { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; }
.eh-button {
  display: inline-flex; align-items: center; justify-content: space-between; gap: 24px;
  min-height: 48px; max-width: 100%; padding: 12px 22px; border: 1px solid transparent;
  border-radius: var(--eh-shape-control); background: var(--eh-color-petrol); color: var(--eh-color-white);
  font: 650 var(--eh-font-label)/1.4 var(--eh-font-family); text-align: center; text-decoration: none;
  cursor: pointer; transition: background var(--eh-motion-duration) var(--eh-motion-ease), border-color var(--eh-motion-duration) var(--eh-motion-ease);
}
.eh-button:hover { background: var(--eh-color-deep); }
.eh-button[data-size="small"] { padding: 10px 16px; min-height: 44px; }
.eh-button[data-variant="secondary"] { background: transparent; color: var(--eh-fg); border-color: var(--eh-fg); }
.eh-button[data-variant="secondary"]:hover { background: var(--eh-color-sand); color: var(--eh-color-ink); }
.eh-button[data-variant="quiet"] { background: transparent; color: var(--eh-fg); text-decoration: underline; text-underline-offset: 5px; }
.eh-button[data-variant="on-dark"] { background: var(--eh-color-paper); color: var(--eh-color-deep); }
.eh-button[data-variant="on-dark"]:hover { background: var(--eh-color-sand); }
.eh-button[data-variant="danger"] { background: var(--eh-color-error); color: var(--eh-color-white); }
.eh-button:disabled { opacity: .55; cursor: not-allowed; }
.eh-textLink { display: inline-flex; align-items: center; min-height: 44px; font-size: var(--eh-font-label); font-weight: 650; gap: 12px; text-decoration: underline; text-underline-offset: 5px; }
.eh-figure { min-width: 0; }
.eh-imageCut { clip-path: polygon(0 0, calc(100% - var(--eh-shape-cut)) 0, 100% var(--eh-shape-cut), 100% 100%, 0 100%); overflow: hidden; aspect-ratio: 1.15; background: var(--eh-color-sand); }
.eh-imageCut img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center; }
.eh-imageCut[data-portrait] { aspect-ratio: .85; }
.eh-figure figcaption { margin-top: 12px; color: var(--eh-muted); font-size: var(--eh-font-meta); line-height: 1.55; }
.eh-recordCover { position: relative; display: flex; flex-direction: column; gap: 26px; padding: clamp(26px,4vw,52px); min-height: 360px; clip-path: polygon(0 0,calc(100% - var(--eh-shape-cut)) 0,100% var(--eh-shape-cut),100% 100%,0 100%); }
.eh-recordCover .eh-heading { max-width: 10ch; }
.eh-coverBody { border-top: 1px solid var(--eh-rule); padding-top: 22px; }
.eh-coverFoot { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; border-top: 1px solid var(--eh-rule); padding-top: 18px; margin-top: auto; font-size: var(--eh-font-meta); }
.eh-status { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 5px 9px; border: 1px solid var(--eh-color-line); border-radius: var(--eh-shape-control); color: var(--eh-color-secondary); background: var(--eh-color-paper); font-size: var(--eh-font-meta); font-weight: 600; line-height: 1.4; }
.eh-status::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: 0 0 auto; }
.eh-status[data-status="info"] { color: var(--eh-color-petrol); }
.eh-status[data-status="success"] { color: var(--eh-color-success); }
.eh-status[data-status="warning"] { color: var(--eh-color-terra); }
.eh-status[data-status="error"] { color: var(--eh-color-error); }
.eh-divider { border: 0; border-top: 1px solid var(--eh-rule); margin-block: 32px; }
.eh-hero { display: grid; gap: clamp(36px,6vw,96px); align-items: center; }
.eh-hero[data-has-media="true"] { grid-template-columns: minmax(0,1.08fr) minmax(0,1fr); }
.eh-heroCopy { display: flex; flex-direction: column; gap: 28px; align-items: flex-start; }
.eh-heroCopy .eh-heading { max-width: 16ch; }
.eh-heroCopy .eh-heading[data-scale="display"] { max-width: 10ch; }
.eh-heroCopy .eh-actions { margin-top: 8px; }
.eh-heroMedia { min-width: 0; }
.eh-promiseRow { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,220px),1fr)); padding: 0; list-style: none; border-top: 1px solid var(--eh-rule); }
.eh-promiseRow li { padding: 28px 30px 12px 0; display: flex; flex-direction: column; gap: 15px; }
.eh-promiseRow li + li { padding-left: 30px; border-left: 1px solid var(--eh-rule); }
.eh-featureRows, .eh-steps, .eh-timeline, .eh-serviceIndex, .eh-list { list-style: none; padding: 0; }
.eh-featureRows li { display: grid; grid-template-columns: 40px minmax(0,1fr) auto; gap: 24px; padding: 26px 0; border-top: 1px solid var(--eh-rule); align-items: start; }
.eh-featureRows li > div { display: grid; gap: 10px; }
.eh-rowNumber { font-size: var(--eh-font-meta); font-weight: 650; font-variant-numeric: tabular-nums; color: var(--eh-muted); padding-top: 4px; }
.eh-featureIcon { color: var(--eh-color-petrol); }
.eh-split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,6vw,96px); align-items: center; }
.eh-storyCopy { display: flex; flex-direction: column; gap: 24px; }
.eh-storyMedia { min-width: 0; }
.eh-split[data-reverse] .eh-storyCopy { order: 2; }
.eh-steps { display: grid; gap: 0; counter-reset: steps; }
.eh-steps li { display: grid; grid-template-columns: 88px minmax(0,1fr); gap: 32px; padding: 30px 0; border-top: 1px solid var(--eh-rule); }
.eh-steps li > div { display: grid; gap: 12px; }
.eh-stepNumber { white-space: nowrap; font-size: clamp(2.5rem,4vw,3.5rem); line-height: 1; letter-spacing: -.05em; font-weight: 720; color: var(--eh-color-petrol); font-variant-numeric: tabular-nums; }
[data-tone="deep"] .eh-stepNumber { white-space: nowrap; color: var(--eh-color-sand); }
.eh-timeline li { display: grid; grid-template-columns: 130px minmax(0,1fr); gap: 28px; position: relative; padding: 8px 0 32px 30px; border-left: 1px solid var(--eh-rule); }
.eh-timeline li::before { content: ""; position: absolute; left: -5px; top: 16px; width: 9px; height: 9px; border: 2px solid var(--eh-color-petrol); background: var(--eh-bg); }
.eh-timeline li[aria-current]::before { background: var(--eh-color-petrol); }
.eh-timeline li > div { display: grid; gap: 10px; }
.eh-timelineDate { color: var(--eh-muted); font-size: var(--eh-font-meta); padding-top: 3px; }
.eh-facts { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,190px),1fr)); border-top: 1px solid var(--eh-rule); gap: 32px; }
.eh-facts > div { padding-top: 26px; display: flex; flex-direction: column; gap: 12px; }
.eh-facts dt { font-size: var(--eh-font-label); }
.eh-facts dd { order: -1; margin: 0; font-size: clamp(2.5rem,5vw,4rem); font-weight: 740; letter-spacing: -.045em; line-height: 1.1; }
.eh-facts dd.eh-factSource { order: 1; font-size: var(--eh-font-meta); font-weight: 400; letter-spacing: normal; line-height: 1.5; color: var(--eh-muted); }
.eh-comparison { display: grid; grid-template-columns: 1fr 1fr; border-block: 1px solid var(--eh-rule); }
.eh-comparison > div { padding: 32px; display: flex; flex-direction: column; gap: 22px; }
.eh-comparison > div[data-emphasis="true"] { background: var(--eh-color-sand); color: var(--eh-color-ink); }
.eh-comparison ul, .eh-pricePlan ul { padding-left: 20px; display: grid; gap: 14px; }
.eh-faq { border-top: 1px solid var(--eh-rule); }
.eh-faq details { border-bottom: 1px solid var(--eh-rule); }
.eh-faq summary { cursor: pointer; list-style: none; min-height: 64px; padding: 24px 0; display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 1.125rem; font-weight: 650; line-height: 1.45; }
.eh-faq summary::-webkit-details-marker { display: none; }
.eh-faq summary span { font-size: 1.5rem; font-weight: 400; }
.eh-faq details[open] summary span { transform: rotate(45deg); }
.eh-faq details > div { max-width: 72ch; padding: 0 36px 28px 0; font-size: var(--eh-font-body); }
.eh-callout { background: var(--eh-bg); padding: clamp(24px,4vw,40px); display: grid; gap: 18px; border-left: 2px solid var(--eh-color-terra); }
.eh-calloutBody { font-size: var(--eh-font-body); line-height: 1.65; }
.eh-closing { display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }
.eh-closing .eh-heading { font-size: clamp(2.75rem,6.5vw,6rem); max-width: 15ch; }
.eh-prose { max-width: 70ch; font-size: 1.125rem; line-height: 1.8; }
.eh-prose > * + * { margin-top: 1.5em; }
.eh-prose :where(h2,h3,h4) { font-weight: 720; line-height: 1.2; letter-spacing: -.03em; margin-top: 2em; scroll-margin-top: 100px; }
.eh-prose h2 { font-size: clamp(1.75rem,3vw,2.5rem); }
.eh-prose h3 { font-size: 1.5rem; }
.eh-prose :where(ul,ol) { padding-left: 24px; }
.eh-prose li + li { margin-top: .5em; }
.eh-prose a { text-decoration: underline; text-underline-offset: 4px; }
.eh-prose blockquote { border-left: 2px solid var(--eh-color-terra); padding-left: 24px; }
.eh-articleHeader { max-width: 1000px; display: grid; gap: 28px; padding-bottom: 40px; }
.eh-articleMeta { display: flex; flex-wrap: wrap; gap: 12px 28px; font-size: var(--eh-font-meta); color: var(--eh-muted); }
.eh-articleLayout { display: grid; grid-template-columns: 240px minmax(0,1fr); gap: clamp(32px,6vw,96px); align-items: start; }
.eh-contents { border-top: 1px solid var(--eh-rule); padding-top: 20px; }
.eh-contents ol { list-style: none; padding: 12px 0 0; }
.eh-contents a { display: flex; gap: 14px; min-height: 44px; padding: 10px 0; font-size: var(--eh-font-label); line-height: 1.5; text-decoration: none; }
.eh-contents a:hover { text-decoration: underline; }
.eh-contents a span { color: var(--eh-muted); font-size: var(--eh-font-meta); padding-top: 1px; }
.eh-related { display: grid; gap: 30px; }
.eh-serviceIndex { border-top: 1px solid var(--eh-rule); }
.eh-serviceIndex li { border-bottom: 1px solid var(--eh-rule); }
.eh-serviceIndex a { display: grid; grid-template-columns: 44px minmax(0,1fr) 24px; gap: 24px; align-items: start; padding: 30px 0; text-decoration: none; }
.eh-serviceIndex a > div { display: grid; gap: 12px; }
.eh-serviceIndex a:hover .eh-heading { text-decoration: underline; text-underline-offset: 5px; }
.eh-pricing { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,260px),1fr)); gap: 24px; margin-bottom: 24px; }
.eh-pricePlan { padding: 32px; border: 1px solid var(--eh-rule); display: flex; flex-direction: column; gap: 22px; background: var(--eh-color-white); color: var(--eh-color-ink); }
.eh-pricePlan[data-recommended] { background: var(--eh-color-sand); border-color: var(--eh-color-petrol); }
.eh-price { font-size: 2.75rem; line-height: 1.2; letter-spacing: -.04em; font-weight: 740; display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; }
.eh-price span { font-size: var(--eh-font-meta); font-weight: 400; letter-spacing: normal; }
.eh-pricePlan .eh-button { margin-top: auto; align-self: flex-start; }
.eh-panel { background: var(--eh-color-white); border: 1px solid var(--eh-rule); border-radius: var(--eh-shape-panel); padding: clamp(22px,3vw,32px); display: grid; gap: 20px; min-width: 0; }
.eh-panelBody { min-width: 0; }
.eh-appHeader { display: flex; gap: 28px; justify-content: space-between; align-items: flex-end; padding-bottom: 32px; border-bottom: 1px solid var(--eh-rule); margin-bottom: 32px; }
.eh-appHeader > div:first-child { display: grid; gap: 14px; }
.eh-field { display: grid; gap: 9px; min-width: 0; }
.eh-field label { font-size: var(--eh-font-label); line-height: 1.5; font-weight: 650; }
.eh-field label span { font-size: var(--eh-font-meta); font-weight: 400; color: var(--eh-muted); }
.eh-fieldHint { font-size: var(--eh-font-meta); color: var(--eh-muted); line-height: 1.55; }
.eh-fieldError { font-size: var(--eh-font-label); color: var(--eh-color-error); line-height: 1.5; }
.eh-input, .eh-textarea, .eh-select { appearance: auto; display: block; width: 100%; min-height: 48px; padding: 12px 14px; border: 1px solid var(--eh-color-secondary); border-radius: var(--eh-shape-control); color: var(--eh-color-ink); background: var(--eh-color-white); font: 400 var(--eh-font-input)/1.5 var(--eh-font-family); }
.eh-textarea { resize: vertical; min-height: 140px; }
.eh-input::placeholder, .eh-textarea::placeholder { color: var(--eh-color-secondary); opacity: 1; }
:is(.eh-input,.eh-textarea,.eh-select)[aria-invalid="true"] { border-color: var(--eh-color-error); }
:is(.eh-input,.eh-textarea,.eh-select):disabled { background: var(--eh-color-paper); opacity: .7; cursor: not-allowed; }
.eh-checkbox { display: flex; align-items: flex-start; gap: 12px; min-height: 44px; padding: 8px 0; font-size: var(--eh-font-label); line-height: 1.6; cursor: pointer; }
.eh-checkbox input { width: 20px; height: 20px; margin-top: 2px; accent-color: var(--eh-color-petrol); flex: 0 0 auto; }
.eh-tabList { display: flex; border-bottom: 1px solid var(--eh-rule); overflow-x: auto; gap: 6px; padding: 4px; }
.eh-tabList button { flex: 0 0 auto; background: transparent; border: 0; border-bottom: 2px solid transparent; border-radius: 0; color: var(--eh-color-secondary); padding: 14px 18px; min-height: 48px; font: 600 var(--eh-font-label)/1.4 var(--eh-font-family); cursor: pointer; }
.eh-tabList button[aria-selected="true"] { border-color: var(--eh-color-petrol); color: var(--eh-color-petrol); }
.eh-tabList button:disabled { opacity: .5; cursor: not-allowed; }
.eh-tabPanel { padding-top: 28px; }
.eh-tabPanel[hidden] { display: none; }
.eh-dialog { width: min(600px,calc(100vw - 40px)); max-height: calc(100dvh - 40px); margin: auto; padding: 28px; border: 1px solid var(--eh-color-line); border-radius: var(--eh-shape-panel); background: var(--eh-color-paper); color: var(--eh-color-ink); font: 400 var(--eh-font-app)/1.65 var(--eh-font-family); }
.eh-dialog::backdrop { background: var(--eh-color-deep); opacity: .7; }
.eh-dialogHead { display: flex; align-items: start; justify-content: space-between; gap: 24px; }
.eh-dialogHead h2 { font-size: 1.5rem; line-height: 1.25; letter-spacing: -.03em; margin: 0; }
.eh-dialogHead > button { min-width: 44px; min-height: 44px; border: 1px solid var(--eh-color-line); background: transparent; color: inherit; border-radius: var(--eh-shape-control); font-size: 1.5rem; cursor: pointer; }
.eh-dialogBody { padding-block: 24px; }
.eh-emptyState { border: 1px solid var(--eh-rule); padding: 36px; display: grid; gap: 18px; }
.eh-loading { display: flex; align-items: center; gap: 14px; padding: 28px 0; font-size: var(--eh-font-label); }
.eh-loading span { width: 20px; height: 20px; border: 2px solid var(--eh-color-line); border-top-color: var(--eh-color-petrol); border-radius: 50%; }
.eh-errorState { border-left: 3px solid var(--eh-color-error); padding: 24px; background: var(--eh-color-white); display: grid; gap: 18px; }
.eh-errorState .eh-button { justify-self: start; }
.eh-tableScroll { max-width: 100%; overflow-x: auto; }
.eh-table { border-collapse: collapse; min-width: 540px; width: 100%; text-align: left; font-size: var(--eh-font-app); }
.eh-table caption { text-align: left; font-size: 1.125rem; font-weight: 650; padding-bottom: 20px; }
.eh-table :is(th,td) { padding: 18px 16px; border-bottom: 1px solid var(--eh-rule); vertical-align: top; }
.eh-table thead th { font-size: var(--eh-font-label); color: var(--eh-muted); font-weight: 600; }
.eh-table tbody th { font-weight: 600; }
.eh-table [data-numeric] { text-align: right; font-variant-numeric: tabular-nums; }
.eh-list li { display: flex; gap: 24px; align-items: center; justify-content: space-between; padding: 22px 0; border-bottom: 1px solid var(--eh-rule); }
.eh-list li:first-child { border-top: 1px solid var(--eh-rule); }
.eh-list li > div:first-child { display: grid; gap: 5px; min-width: 0; }
.eh-listTitle { font-size: var(--eh-font-app); font-weight: 650; line-height: 1.4; }
.eh-listMeta { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; align-items: center; }
.eh-composer { display: grid; gap: 20px; }
.eh-documentList { display: grid; gap: 20px; }
@media (max-width: 850px) {
  .eh-hero[data-has-media="true"], .eh-split { grid-template-columns: 1fr; gap: 36px; }
  .eh-heroCopy .eh-heading { max-width: 19ch; }
  .eh-heroCopy .eh-heading[data-scale="display"] { max-width: 11ch; }
  .eh-heroMedia { max-width: 640px; }
  .eh-heroMedia .eh-imageCut { aspect-ratio: 1.45; }
  .eh-split[data-reverse] .eh-storyCopy { order: initial; }
  .eh-articleLayout { grid-template-columns: 1fr; }
  .eh-contents { max-width: 70ch; }
  .eh-appHeader { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 580px) {
  .eh-promiseRow { grid-template-columns: 1fr; }
  .eh-promiseRow li, .eh-promiseRow li + li { padding: 26px 0; border-left: 0; border-bottom: 1px solid var(--eh-rule); }
  .eh-comparison { grid-template-columns: 1fr; }
  .eh-comparison > div { padding: 26px 20px; }
  .eh-steps li { grid-template-columns: 60px minmax(0,1fr); gap: 20px; }
  .eh-timeline li { grid-template-columns: 1fr; gap: 10px; padding-left: 24px; }
  .eh-featureRows li { grid-template-columns: 28px minmax(0,1fr); gap: 16px; }
  .eh-featureIcon { display: none; }
  .eh-serviceIndex a { grid-template-columns: 28px minmax(0,1fr) 20px; gap: 16px; }
  .eh-list li { align-items: flex-start; flex-direction: column; gap: 12px; }
  .eh-listMeta { justify-content: flex-start; }
  .eh-recordCover { min-height: 320px; }
  .eh-pricePlan, .eh-emptyState { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .eh-scope *, .eh-dialog * { animation: none; transition: none; scroll-behavior: auto; }
}

`````

## packages/eh-design/src/html.mjs

`````js
/** Canonical HTML adapter for the Cloudflare CRM. User values are escaped; content slots accept trusted component output only. */
import {EHHtmlStyles,EHLogoData} from "./html-style.mjs";
export const escapeEH=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function hrefEH(value){const s=String(value);if(!/^(?:\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(s))throw Error("Unsupported link scheme");return escapeEH(s);}
export function EHHtmlLogo({href="/"}={}) {return '<a class="eh-logoLink" href="'+hrefEH(href)+'" aria-label="einfachhausen – Startseite"><img class="eh-logo" src="'+EHLogoData+'" alt="einfachhausen" width="126"></a>';}
export function EHHtmlButton({label,href,type="button",name,value,variant="primary"}) {
 if(!["primary","secondary","quiet","on-dark","danger"].includes(variant))throw Error("Unsupported button variant");
 const attrs=' class="eh-button" data-variant="'+variant+'"';
 if(href)return '<a'+attrs+' href="'+hrefEH(href)+'">'+escapeEH(label)+'</a>';
 if(!["button","submit","reset"].includes(type))throw Error("Unsupported button type");
 return '<button'+attrs+' type="'+type+'"'+(name?' name="'+escapeEH(name)+'"':'')+(value!==undefined?' value="'+escapeEH(value)+'"':'')+'>'+escapeEH(label)+'</button>';
}
export function EHHtmlStatus({label,tone="neutral"}) {if(!["neutral","info","success","warning","error"].includes(tone))throw Error("Unsupported status");return '<span class="eh-status" data-status="'+tone+'">'+escapeEH(label)+'</span>';}
export function EHHtmlHeader({eyebrow,title,text,actions=""}) {return '<header class="eh-appHeader"><div>'+(eyebrow?'<p class="eh-eyebrow">'+escapeEH(eyebrow)+'</p>':'')+'<h1 class="eh-heading" data-scale="app">'+escapeEH(title)+'</h1>'+(text?'<p class="eh-text">'+escapeEH(text)+'</p>':'')+'</div><div class="eh-actions">'+actions+'</div></header>';}
export function EHHtmlField({id,label,name=id,value="",type="text",hint,error,required=false}) {
 if(!["text","search","email","tel","url","number","date","password"].includes(type))throw Error("Unsupported field type");
 const key=escapeEH(id);const described=[hint?key+"-hint":"",error?key+"-error":""].filter(Boolean).join(" ");
 return '<div class="eh-field"><label for="'+key+'">'+escapeEH(label)+(required?' <span>(erforderlich)</span>':'')+'</label>'+(hint?'<p class="eh-fieldHint" id="'+key+'-hint">'+escapeEH(hint)+'</p>':'')+'<input class="eh-input" id="'+key+'" name="'+escapeEH(name)+'" type="'+type+'" value="'+escapeEH(value)+'"'+(required?' required':'')+(described?' aria-describedby="'+described+'"':'')+(error?' aria-invalid="true"':'')+'>'+(error?'<p class="eh-fieldError" id="'+key+'-error" role="alert">'+escapeEH(error)+'</p>':'')+'</div>';
}
export function EHHtmlTable({caption,columns,rows}) {
 return '<div class="eh-tableScroll" role="region" aria-label="'+escapeEH(caption)+'" tabindex="0"><table class="eh-table"><caption>'+escapeEH(caption)+'</caption><thead><tr>'+columns.map(c=>'<th scope="col">'+escapeEH(c.label)+'</th>').join("")+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+columns.map((c,i)=>'<'+(i?'td':'th scope="row"')+'>'+escapeEH(row[c.key])+'</'+(i?'td':'th')+'>').join("")+'</tr>').join("")+'</tbody></table></div>';
}
export function EHHtmlList({label,items}) {
 return '<ul class="eh-list" aria-label="'+escapeEH(label)+'">'+items.map(item=>'<li><div>'+(item.href?'<a class="eh-listTitle" href="'+hrefEH(item.href)+'">'+escapeEH(item.title)+'</a>':'<span class="eh-listTitle">'+escapeEH(item.title)+'</span>')+(item.text?'<p class="eh-text">'+escapeEH(item.text)+'</p>':'')+'</div>'+(item.status?EHHtmlStatus(item.status):'')+'</li>').join("")+'</ul>';
}
export function EHHtmlPanel({title,content}) {return '<section class="eh-panel">'+(title?'<h2 class="eh-heading" data-scale="item">'+escapeEH(title)+'</h2>':'')+'<div class="eh-panelBody">'+content+'</div></section>';}
export function EHHtmlEmpty({title,text}) {return '<div class="eh-emptyState"><h2 class="eh-heading" data-scale="item">'+escapeEH(title)+'</h2><p class="eh-text">'+escapeEH(text)+'</p></div>';}
export function EHHtmlPage({title,content,lang="de"}) {
 if(!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(lang))throw Error("Invalid language");
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeEH(title)+'</title><style>'+EHHtmlStyles+'</style></head><body class="eh-scope" data-eh-app="true"><main><section class="eh-section" data-compact="true"><div class="eh-container">'+content+'</div></section></main></body></html>';
}

`````

## packages/eh-design/src/index.ts

`````ts
export * from "./tokens";
export * from "./primitives";
export * from "./blocks";
export * from "./app";

`````

## packages/eh-design/src/primitives.tsx

`````tsx
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import s from "./styles.module.css";

export type EHTone = "paper" | "white" | "sand" | "deep";
type Children = { children: ReactNode };
export function EHScope({children, app = false}: Children & {app?: boolean}) {
  return <div className={s.scope} data-eh-app={app || undefined}>{children}</div>;
}
export function EHLogo({src = "/brand/logo-full.png", href = "/", label = "einfachhausen – Startseite"}: {src?: string; href?: string; label?: string}) {
  const logo = <img src={src} alt="einfachhausen" width={150} height={95} className={s.logo} />;
  return <a className={s.logoLink} href={href} aria-label={label}>{logo}</a>;
}
export function EHContainer({children, narrow = false}: Children & {narrow?: boolean}) {
  return <div className={narrow ? s.narrow : s.container}>{children}</div>;
}
export function EHSection({children, tone = "paper", id, compact = false}: Children & {tone?: EHTone; id?: string; compact?: boolean}) {
  return <section id={id} className={s.section} data-tone={tone} data-compact={compact || undefined}><EHContainer>{children}</EHContainer></section>;
}
export function EHEyebrow({children, number}: Children & {number?: string}) {
  return <p className={s.eyebrow}>{number && <span className={s.register}>{number}</span>}{children}</p>;
}
export function EHHeading({children, as: Tag = "h2", scale = "section"}: Children & {as?: "h1" | "h2" | "h3" | "h4"; scale?: "display" | "page" | "section" | "app" | "item"}) {
  return <Tag className={s.heading} data-scale={scale}>{children}</Tag>;
}
export function EHText({children, size = "body", muted = false}: Children & {size?: "body" | "lead" | "meta"; muted?: boolean}) {
  return <p className={s.text} data-size={size} data-muted={muted || undefined}>{children}</p>;
}
type ButtonVisual = {children: ReactNode; variant?: "primary" | "secondary" | "quiet" | "on-dark" | "danger"; size?: "regular" | "small"; arrow?: boolean};
type ButtonNative = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "className" | "children">;
type AnchorNative = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "style" | "className" | "children" | "href">;
export type EHButtonProps = ButtonVisual & ((ButtonNative & {href?: never}) | (AnchorNative & {href: string}));
export function EHButton(props: EHButtonProps) {
  const {children, variant = "primary", size = "regular", arrow = false, ...native} = props;
  const content = <>{children}{arrow && <span aria-hidden="true">↗</span>}</>;
  const shared = {className: s.button, "data-variant": variant, "data-size": size};
  return typeof native.href === "string"
    ? <a {...native as AnchorNative & {href: string}} {...shared}>{content}</a>
    : <button type="button" {...native as ButtonNative} {...shared}>{content}</button>;
}
export function EHTextLink({href, children}: Children & {href: string}) {
  return <a href={href} className={s.textLink}>{children}<span aria-hidden="true"> ↗</span></a>;
}
export function EHActions({children}: Children) {return <div className={s.actions}>{children}</div>;}
export function EHImageFrame({src, alt, caption, portrait = false, priority = false}: {src: string; alt: string; caption?: ReactNode; portrait?: boolean; priority?: boolean}) {
  return <figure className={s.figure}><div className={s.imageCut} data-portrait={portrait || undefined}><img src={src} alt={alt} loading={priority ? "eager" : "lazy"} /></div>{caption && <figcaption>{caption}</figcaption>}</figure>;
}
export function EHRecordCover({eyebrow = "Deine Hausakte", title, subtitle, number = "01", children}: {eyebrow?: string; title: ReactNode; subtitle?: string; number?: string; children?: ReactNode}) {
  return <div className={s.recordCover}><EHEyebrow number={number}>{eyebrow}</EHEyebrow><EHHeading as="h2" scale="section">{title}</EHHeading>{subtitle && <EHText>{subtitle}</EHText>}{children && <div className={s.coverBody}>{children}</div>}<div className={s.coverFoot}><span>einfachhausen</span><span>Alles an seinem Platz.</span></div></div>;
}
export function EHStatus({children, tone = "neutral"}: Children & {tone?: "neutral" | "info" | "success" | "warning" | "error"}) {
  return <span className={s.status} data-status={tone}>{children}</span>;
}
export function EHDivider() {return <hr className={s.divider} />;}

`````

## packages/eh-design/src/recipes.tsx

`````tsx
import type {ReactNode, ComponentProps} from "react";
import {EHScope, EHSection, EHEyebrow, EHHeading, EHButton, EHImageFrame, EHRecordCover, EHStatus, EHActions} from "./primitives";
import {EHPageHero, EHPromiseRow, EHFeatureRows, EHSplitStory, EHSteps, EHTimeline, EHFAQ, EHClosing, EHArticleHeader, EHArticleLayout, EHRelated, EHServiceIndex, EHPricing, EHPanel, type EHItem, type EHLink} from "./blocks";
import {EHAppHeader, EHTabs, EHComposer, EHDocumentList, EHList, EHDataTable, type EHDocument} from "./app";

/** Complete recipes: supply verified content and existing application handlers. No demo backend. */
export function EHServicePage({title, description, image, benefits, scope, steps, faq, contactHref}: {title: string; description: string; image: {src:string;alt:string;caption?:string}; benefits: EHItem[]; scope: EHItem[]; steps: EHItem[]; faq: {q:string;a:ReactNode}[]; contactHref: string}) {
  return <EHScope><EHPageHero eyebrow="Für dein Zuhause" number="01" title={title} text={description} actions={<EHButton href={contactHref} arrow>Anliegen besprechen</EHButton>} media={<EHImageFrame {...image} priority/>}/><EHSection compact><EHPromiseRow items={benefits}/></EHSection><EHSection tone="white"><EHSplitStory eyebrow="Was dazugehört" title="Alles Wichtige. Klar vereinbart." text="Der konkrete Umfang wird vor einer Beauftragung gemeinsam geklärt." media={<EHFeatureRows items={scope}/>}/></EHSection><EHSection tone="deep"><EHSplitStory eyebrow="Der nächste Schritt" title="Du entscheidest. Wir helfen beim Sortieren." media={<EHSteps items={steps}/>}/></EHSection><EHSection><EHEyebrow>Gut zu wissen</EHEyebrow><EHFAQ items={faq}/></EHSection><EHClosing title="Was steht bei dir an?" href={contactHref}/></EHScope>;
}
export function EHArticlePage({category,title,description,author,date,readingTime,contents,children,related}: {category:string;title:string;description?:string;author?:string;date?:string;readingTime?:string;contents:{id:string;title:string}[];children:ReactNode;related:EHLink[]}) {
  return <EHScope><EHSection><EHArticleHeader {...{category,title,description,author,date,readingTime}}/><EHArticleLayout contents={contents}>{children}</EHArticleLayout></EHSection><EHSection tone="white"><EHRelated items={related}/></EHSection></EHScope>;
}
export function EHServiceIndexPage({title,text,items,contactHref}: {title:string;text:string;items:EHLink[];contactHref:string}) {
  return <EHScope><EHPageHero eyebrow="Rund ums Haus" title={title} text={text}/><EHSection compact><EHServiceIndex items={items}/></EHSection><EHClosing title="Noch nicht sicher, was du brauchst?" text="Beschreibe uns, was dich beschäftigt. Gemeinsam finden wir den nächsten Schritt." href={contactHref}/></EHScope>;
}
export function EHContactPage({title = "Dein Anliegen. Ein offenes Ohr.", text, image, form, contactDetails}: {title?:string;text:string;image:{src:string;alt:string;caption?:string};form:ReactNode;contactDetails:ReactNode}) {
  return <EHScope><EHPageHero eyebrow="Lass uns sprechen" title={title} text={text}/><EHSection compact><EHSplitStory title="Wir hören erst einmal zu." media={<EHPanel title="Was können wir für dich tun?">{form}</EHPanel>}><EHImageFrame {...image}/>{contactDetails}</EHSplitStory></EHSection></EHScope>;
}
export function EHPricingPage({title,text,plans,note,faq}: {title:string;text:string;plans:ComponentProps<typeof EHPricing>["plans"];note:string;faq:{q:string;a:ReactNode}[]}) {
  return <EHScope><EHPageHero eyebrow="Leistungen & Umfang" title={title} text={text}/><EHSection compact><EHPricing plans={plans} note={note}/></EHSection><EHSection tone="white"><EHHeading>Deine Fragen. Klare Antworten.</EHHeading><EHFAQ items={faq}/></EHSection></EHScope>;
}
export function EHOwnerPage({houseName,address,documents,history,people,onRequest,pending,error}: {houseName:string;address:string;documents:EHDocument[];history:ComponentProps<typeof EHTimeline>["items"];people:ComponentProps<typeof EHList>["items"];onRequest:(text:string)=>void|Promise<void>;pending?:boolean;error?:string}) {
  return <EHScope app><EHSection compact><EHAppHeader eyebrow="Dein Zuhause" title={houseName} text={address}/><EHTabs label="Hausakte" tabs={[
    {id:"overview",label:"Überblick",content:<EHSplitStory title="Alles an seinem Platz." text="Deine Unterlagen, Menschen und nächsten Schritte gehören zusammen." media={<EHRecordCover title="Ein Zuhause. Eine Geschichte." subtitle={address}/>}><EHComposer onSubmit={onRequest} pending={pending} error={error}/></EHSplitStory>},
    {id:"documents",label:"Dokumente",content:<EHDocumentList documents={documents}/>},
    {id:"people",label:"Menschen",content:<EHList label="Menschen rund ums Haus" items={people}/>},
    {id:"history",label:"Chronik",content:<EHTimeline items={history}/>}
  ]}/></EHSection></EHScope>;
}
export function EHProviderPage({name,summary,requests,appointments,onOpenRequest}: {name:string;summary:string;requests:{id:string;title:string;location:string;status:string}[];appointments:{id:string;time:string;title:string;address:string}[];onOpenRequest:(id:string)=>void}) {
  return <EHScope app><EHSection compact><EHAppHeader eyebrow="Dein Arbeitstag" title={name} text={summary}/><EHTabs label="Aufträge und Termine" tabs={[
    {id:"requests",label:"Anfragen",content:<EHList label="Offene Anfragen" items={requests.map(r=>({id:r.id,title:r.title,text:r.location,meta:<EHStatus tone="info">{r.status}</EHStatus>,action:<EHButton variant="secondary" size="small" onClick={()=>onOpenRequest(r.id)}>Anfrage ansehen</EHButton>}))}/>},
    {id:"appointments",label:"Termine",content:<EHDataTable caption="Deine Termine" columns={[{key:"time",label:"Zeit"},{key:"title",label:"Auftrag"},{key:"address",label:"Adresse"}]} rows={appointments.map(a=>({id:a.id,cells:{time:a.time,title:a.title,address:a.address}}))}/>}
  ]}/></EHSection></EHScope>;
}
export function EHHomePage({image,contactHref,accountHref}: {image:{src:string;alt:string;caption?:string};contactHref:string;accountHref:string}) {
  return <EHScope><EHPageHero display eyebrow="Zuhause, mit Überblick." number="01" title={<>Dein Haus.<br/>Einfach<br/>geregelt.</>} text="Weniger Kümmern. Mehr Zuhause sein. Behalte im Blick, was ansteht, und finde die passenden Menschen für dein Haus." actions={<EHButton href={accountHref} arrow>Deine Hausakte entdecken</EHButton>} media={<EHImageFrame {...image} priority/>}/><EHSection compact><EHPromiseRow items={[{title:"Alles wissen.",text:"Dokumente und die Geschichte deines Hauses."},{title:"Nichts vergessen.",text:"Anstehende Wartungen und wichtige Termine."},{title:"Nicht alles selbst machen.",text:"Passende Ansprechpartner, wenn es Hilfe braucht."}]}/></EHSection><EHSection tone="deep"><EHSplitStory eyebrow="Deine Hausakte" title="Ein Zuhause. Eine Geschichte." text="Was heute erledigt wird, hilft dir morgen weiter. So bleibt Wissen beim Haus." media={<EHRecordCover title="Gut aufgehoben." subtitle="Unterlagen. Termine. Menschen."/>}><EHActions><EHButton href={accountHref} variant="on-dark" arrow>Hausakte kennenlernen</EHButton></EHActions></EHSplitStory></EHSection><EHSection><EHSplitStory eyebrow="So geht einfach" title="Ein Anliegen. Ein klarer nächster Schritt." media={<EHSteps items={[{title:"Beschreiben",text:"Sag in deinen Worten, was bei deinem Haus ansteht."},{title:"Gemeinsam einordnen",text:"Wir helfen dir, den Bedarf und passende Möglichkeiten zu klären."},{title:"Bewusst entscheiden",text:"Eine Beauftragung erfolgt erst nach deiner Entscheidung."}]}/>}/></EHSection><EHClosing title="Mehr Zuhause. Weniger auf dem Zettel." href={contactHref}/></EHScope>;
}

`````

## packages/eh-design/src/styles.module.css

`````css
/* Einfachhausen 1.0 · accepted Atelier 02. Change only with explicit brand-owner instruction. */
.scope {
  --eh-fg: var(--eh-color-ink); --eh-muted: var(--eh-color-secondary);
  --eh-rule: var(--eh-color-line); --eh-bg: var(--eh-color-paper);
  color: var(--eh-fg); background: var(--eh-bg);
  font-family: var(--eh-font-family); font-size: var(--eh-font-body); line-height: 1.65;
  -webkit-font-smoothing: antialiased; overflow-wrap: break-word;
}
.scope[data-eh-app] { font-size: var(--eh-font-app); }
.scope *, .dialog * { box-sizing: border-box; }
.scope :where(a, button, input, textarea, select, summary, [tabindex]):focus-visible,
.dialog :where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 3px solid var(--eh-color-focus); outline-offset: 4px;
}
.scope :where(h1,h2,h3,h4,p,ul,ol,figure,blockquote,dl) { margin: 0; }
.scope :where(a) { color: inherit; }
.container, .narrow { width: min(100% - var(--eh-space-gutter) * 2, 1296px); margin-inline: auto; }
.narrow { max-width: 760px; }
.section { padding-block: var(--eh-space-section); color: var(--eh-fg); background: var(--eh-bg); }
.section[data-compact] { padding-block: var(--eh-space-xl); }
.section[data-tone="paper"], .callout[data-tone="paper"] { --eh-bg: var(--eh-color-paper); }
.section[data-tone="white"] { --eh-bg: var(--eh-color-white); }
.section[data-tone="sand"], .callout[data-tone="sand"] { --eh-bg: var(--eh-color-sand); }
.section[data-tone="deep"], .callout[data-tone="deep"], .recordCover {
  --eh-bg: var(--eh-color-deep); --eh-fg: var(--eh-color-paper);
  --eh-muted: var(--eh-color-sand); --eh-rule: var(--eh-color-secondary);
  color: var(--eh-fg); background: var(--eh-bg);
}
.logoLink { display: inline-flex; align-items: center; padding: 8px; background: var(--eh-color-paper); }
.logo { display: block; width: 126px; height: auto; object-fit: contain; }
.eyebrow { display: flex; gap: 12px; align-items: baseline; font-size: var(--eh-font-eyebrow); font-weight: 750; line-height: 1.5; letter-spacing: .09em; text-transform: uppercase; }
.register { color: var(--eh-color-terra); font-variant-numeric: tabular-nums; }
[data-tone="deep"] .register, .recordCover .register { color: var(--eh-color-sand); }
.heading { color: inherit; font-family: inherit; font-weight: 760; line-height: 1.05; letter-spacing: -.045em; text-wrap: balance; }
.heading[data-scale="display"] { font-size: var(--eh-font-display); line-height: .99; letter-spacing: -.052em; }
.heading[data-scale="page"] { font-size: var(--eh-font-page); }
.heading[data-scale="section"] { font-size: var(--eh-font-section); }
.heading[data-scale="app"] { font-size: var(--eh-font-app-title); }
.heading[data-scale="item"] { font-size: clamp(1.25rem, 1.6vw, 1.5rem); line-height: 1.2; letter-spacing: -.025em; }
.text { font-size: var(--eh-font-body); line-height: 1.65; max-width: 66ch; color: inherit; }
.text[data-size="lead"] { font-size: clamp(1.0625rem, 1.45vw, 1.25rem); line-height: 1.65; max-width: 51ch; }
.text[data-size="meta"] { font-size: var(--eh-font-meta); line-height: 1.55; }
.text[data-muted] { color: var(--eh-muted); }
.actions { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; }
.button {
  display: inline-flex; align-items: center; justify-content: space-between; gap: 24px;
  min-height: 48px; max-width: 100%; padding: 12px 22px; border: 1px solid transparent;
  border-radius: var(--eh-shape-control); background: var(--eh-color-petrol); color: var(--eh-color-white);
  font: 650 var(--eh-font-label)/1.4 var(--eh-font-family); text-align: center; text-decoration: none;
  cursor: pointer; transition: background var(--eh-motion-duration) var(--eh-motion-ease), border-color var(--eh-motion-duration) var(--eh-motion-ease);
}
.button:hover { background: var(--eh-color-deep); }
.button[data-size="small"] { padding: 10px 16px; min-height: 44px; }
.button[data-variant="secondary"] { background: transparent; color: var(--eh-fg); border-color: var(--eh-fg); }
.button[data-variant="secondary"]:hover { background: var(--eh-color-sand); color: var(--eh-color-ink); }
.button[data-variant="quiet"] { background: transparent; color: var(--eh-fg); text-decoration: underline; text-underline-offset: 5px; }
.button[data-variant="on-dark"] { background: var(--eh-color-paper); color: var(--eh-color-deep); }
.button[data-variant="on-dark"]:hover { background: var(--eh-color-sand); }
.button[data-variant="danger"] { background: var(--eh-color-error); color: var(--eh-color-white); }
.button:disabled { opacity: .55; cursor: not-allowed; }
.textLink { display: inline-flex; align-items: center; min-height: 44px; font-size: var(--eh-font-label); font-weight: 650; gap: 12px; text-decoration: underline; text-underline-offset: 5px; }
.figure { min-width: 0; }
.imageCut { clip-path: polygon(0 0, calc(100% - var(--eh-shape-cut)) 0, 100% var(--eh-shape-cut), 100% 100%, 0 100%); overflow: hidden; aspect-ratio: 1.15; background: var(--eh-color-sand); }
.imageCut img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center; }
.imageCut[data-portrait] { aspect-ratio: .85; }
.figure figcaption { margin-top: 12px; color: var(--eh-muted); font-size: var(--eh-font-meta); line-height: 1.55; }
.recordCover { position: relative; display: flex; flex-direction: column; gap: 26px; padding: clamp(26px,4vw,52px); min-height: 360px; clip-path: polygon(0 0,calc(100% - var(--eh-shape-cut)) 0,100% var(--eh-shape-cut),100% 100%,0 100%); }
.recordCover .heading { max-width: 10ch; }
.coverBody { border-top: 1px solid var(--eh-rule); padding-top: 22px; }
.coverFoot { display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; border-top: 1px solid var(--eh-rule); padding-top: 18px; margin-top: auto; font-size: var(--eh-font-meta); }
.status { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 5px 9px; border: 1px solid var(--eh-color-line); border-radius: var(--eh-shape-control); color: var(--eh-color-secondary); background: var(--eh-color-paper); font-size: var(--eh-font-meta); font-weight: 600; line-height: 1.4; }
.status::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: 0 0 auto; }
.status[data-status="info"] { color: var(--eh-color-petrol); }
.status[data-status="success"] { color: var(--eh-color-success); }
.status[data-status="warning"] { color: var(--eh-color-terra); }
.status[data-status="error"] { color: var(--eh-color-error); }
.divider { border: 0; border-top: 1px solid var(--eh-rule); margin-block: 32px; }
.hero { display: grid; gap: clamp(36px,6vw,96px); align-items: center; }
.hero[data-has-media="true"] { grid-template-columns: minmax(0,1.08fr) minmax(0,1fr); }
.heroCopy { display: flex; flex-direction: column; gap: 28px; align-items: flex-start; }
.heroCopy .heading { max-width: 16ch; }
.heroCopy .heading[data-scale="display"] { max-width: 10ch; }
.heroCopy .actions { margin-top: 8px; }
.heroMedia { min-width: 0; }
.promiseRow { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,220px),1fr)); padding: 0; list-style: none; border-top: 1px solid var(--eh-rule); }
.promiseRow li { padding: 28px 30px 12px 0; display: flex; flex-direction: column; gap: 15px; }
.promiseRow li + li { padding-left: 30px; border-left: 1px solid var(--eh-rule); }
.featureRows, .steps, .timeline, .serviceIndex, .list { list-style: none; padding: 0; }
.featureRows li { display: grid; grid-template-columns: 40px minmax(0,1fr) auto; gap: 24px; padding: 26px 0; border-top: 1px solid var(--eh-rule); align-items: start; }
.featureRows li > div { display: grid; gap: 10px; }
.rowNumber { font-size: var(--eh-font-meta); font-weight: 650; font-variant-numeric: tabular-nums; color: var(--eh-muted); padding-top: 4px; }
.featureIcon { color: var(--eh-color-petrol); }
.split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(32px,6vw,96px); align-items: center; }
.storyCopy { display: flex; flex-direction: column; gap: 24px; }
.storyMedia { min-width: 0; }
.split[data-reverse] .storyCopy { order: 2; }
.steps { display: grid; gap: 0; counter-reset: steps; }
.steps li { display: grid; grid-template-columns: 88px minmax(0,1fr); gap: 32px; padding: 30px 0; border-top: 1px solid var(--eh-rule); }
.steps li > div { display: grid; gap: 12px; }
.stepNumber { white-space: nowrap; font-size: clamp(2.5rem,4vw,3.5rem); line-height: 1; letter-spacing: -.05em; font-weight: 720; color: var(--eh-color-petrol); font-variant-numeric: tabular-nums; }
[data-tone="deep"] .stepNumber { white-space: nowrap; color: var(--eh-color-sand); }
.timeline li { display: grid; grid-template-columns: 130px minmax(0,1fr); gap: 28px; position: relative; padding: 8px 0 32px 30px; border-left: 1px solid var(--eh-rule); }
.timeline li::before { content: ""; position: absolute; left: -5px; top: 16px; width: 9px; height: 9px; border: 2px solid var(--eh-color-petrol); background: var(--eh-bg); }
.timeline li[aria-current]::before { background: var(--eh-color-petrol); }
.timeline li > div { display: grid; gap: 10px; }
.timelineDate { color: var(--eh-muted); font-size: var(--eh-font-meta); padding-top: 3px; }
.facts { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,190px),1fr)); border-top: 1px solid var(--eh-rule); gap: 32px; }
.facts > div { padding-top: 26px; display: flex; flex-direction: column; gap: 12px; }
.facts dt { font-size: var(--eh-font-label); }
.facts dd { order: -1; margin: 0; font-size: clamp(2.5rem,5vw,4rem); font-weight: 740; letter-spacing: -.045em; line-height: 1.1; }
.facts dd.factSource { order: 1; font-size: var(--eh-font-meta); font-weight: 400; letter-spacing: normal; line-height: 1.5; color: var(--eh-muted); }
.comparison { display: grid; grid-template-columns: 1fr 1fr; border-block: 1px solid var(--eh-rule); }
.comparison > div { padding: 32px; display: flex; flex-direction: column; gap: 22px; }
.comparison > div[data-emphasis="true"] { background: var(--eh-color-sand); color: var(--eh-color-ink); }
.comparison ul, .pricePlan ul { padding-left: 20px; display: grid; gap: 14px; }
.faq { border-top: 1px solid var(--eh-rule); }
.faq details { border-bottom: 1px solid var(--eh-rule); }
.faq summary { cursor: pointer; list-style: none; min-height: 64px; padding: 24px 0; display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 1.125rem; font-weight: 650; line-height: 1.45; }
.faq summary::-webkit-details-marker { display: none; }
.faq summary span { font-size: 1.5rem; font-weight: 400; }
.faq details[open] summary span { transform: rotate(45deg); }
.faq details > div { max-width: 72ch; padding: 0 36px 28px 0; font-size: var(--eh-font-body); }
.callout { background: var(--eh-bg); padding: clamp(24px,4vw,40px); display: grid; gap: 18px; border-left: 2px solid var(--eh-color-terra); }
.calloutBody { font-size: var(--eh-font-body); line-height: 1.65; }
.closing { display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }
.closing .heading { font-size: clamp(2.75rem,6.5vw,6rem); max-width: 15ch; }
.prose { max-width: 70ch; font-size: 1.125rem; line-height: 1.8; }
.prose > * + * { margin-top: 1.5em; }
.prose :where(h2,h3,h4) { font-weight: 720; line-height: 1.2; letter-spacing: -.03em; margin-top: 2em; scroll-margin-top: 100px; }
.prose h2 { font-size: clamp(1.75rem,3vw,2.5rem); }
.prose h3 { font-size: 1.5rem; }
.prose :where(ul,ol) { padding-left: 24px; }
.prose li + li { margin-top: .5em; }
.prose a { text-decoration: underline; text-underline-offset: 4px; }
.prose blockquote { border-left: 2px solid var(--eh-color-terra); padding-left: 24px; }
.articleHeader { max-width: 1000px; display: grid; gap: 28px; padding-bottom: 40px; }
.articleMeta { display: flex; flex-wrap: wrap; gap: 12px 28px; font-size: var(--eh-font-meta); color: var(--eh-muted); }
.articleLayout { display: grid; grid-template-columns: 240px minmax(0,1fr); gap: clamp(32px,6vw,96px); align-items: start; }
.contents { border-top: 1px solid var(--eh-rule); padding-top: 20px; }
.contents ol { list-style: none; padding: 12px 0 0; }
.contents a { display: flex; gap: 14px; min-height: 44px; padding: 10px 0; font-size: var(--eh-font-label); line-height: 1.5; text-decoration: none; }
.contents a:hover { text-decoration: underline; }
.contents a span { color: var(--eh-muted); font-size: var(--eh-font-meta); padding-top: 1px; }
.related { display: grid; gap: 30px; }
.serviceIndex { border-top: 1px solid var(--eh-rule); }
.serviceIndex li { border-bottom: 1px solid var(--eh-rule); }
.serviceIndex a { display: grid; grid-template-columns: 44px minmax(0,1fr) 24px; gap: 24px; align-items: start; padding: 30px 0; text-decoration: none; }
.serviceIndex a > div { display: grid; gap: 12px; }
.serviceIndex a:hover .heading { text-decoration: underline; text-underline-offset: 5px; }
.pricing { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,260px),1fr)); gap: 24px; margin-bottom: 24px; }
.pricePlan { padding: 32px; border: 1px solid var(--eh-rule); display: flex; flex-direction: column; gap: 22px; background: var(--eh-color-white); color: var(--eh-color-ink); }
.pricePlan[data-recommended] { background: var(--eh-color-sand); border-color: var(--eh-color-petrol); }
.price { font-size: 2.75rem; line-height: 1.2; letter-spacing: -.04em; font-weight: 740; display: flex; flex-wrap: wrap; gap: 10px; align-items: baseline; }
.price span { font-size: var(--eh-font-meta); font-weight: 400; letter-spacing: normal; }
.pricePlan .button { margin-top: auto; align-self: flex-start; }
.panel { background: var(--eh-color-white); border: 1px solid var(--eh-rule); border-radius: var(--eh-shape-panel); padding: clamp(22px,3vw,32px); display: grid; gap: 20px; min-width: 0; }
.panelBody { min-width: 0; }
.appHeader { display: flex; gap: 28px; justify-content: space-between; align-items: flex-end; padding-bottom: 32px; border-bottom: 1px solid var(--eh-rule); margin-bottom: 32px; }
.appHeader > div:first-child { display: grid; gap: 14px; }
.field { display: grid; gap: 9px; min-width: 0; }
.field label { font-size: var(--eh-font-label); line-height: 1.5; font-weight: 650; }
.field label span { font-size: var(--eh-font-meta); font-weight: 400; color: var(--eh-muted); }
.fieldHint { font-size: var(--eh-font-meta); color: var(--eh-muted); line-height: 1.55; }
.fieldError { font-size: var(--eh-font-label); color: var(--eh-color-error); line-height: 1.5; }
.input, .textarea, .select { appearance: auto; display: block; width: 100%; min-height: 48px; padding: 12px 14px; border: 1px solid var(--eh-color-secondary); border-radius: var(--eh-shape-control); color: var(--eh-color-ink); background: var(--eh-color-white); font: 400 var(--eh-font-input)/1.5 var(--eh-font-family); }
.textarea { resize: vertical; min-height: 140px; }
.input::placeholder, .textarea::placeholder { color: var(--eh-color-secondary); opacity: 1; }
:is(.input,.textarea,.select)[aria-invalid="true"] { border-color: var(--eh-color-error); }
:is(.input,.textarea,.select):disabled { background: var(--eh-color-paper); opacity: .7; cursor: not-allowed; }
.checkbox { display: flex; align-items: flex-start; gap: 12px; min-height: 44px; padding: 8px 0; font-size: var(--eh-font-label); line-height: 1.6; cursor: pointer; }
.checkbox input { width: 20px; height: 20px; margin-top: 2px; accent-color: var(--eh-color-petrol); flex: 0 0 auto; }
.tabList { display: flex; border-bottom: 1px solid var(--eh-rule); overflow-x: auto; gap: 6px; padding: 4px; }
.tabList button { flex: 0 0 auto; background: transparent; border: 0; border-bottom: 2px solid transparent; border-radius: 0; color: var(--eh-color-secondary); padding: 14px 18px; min-height: 48px; font: 600 var(--eh-font-label)/1.4 var(--eh-font-family); cursor: pointer; }
.tabList button[aria-selected="true"] { border-color: var(--eh-color-petrol); color: var(--eh-color-petrol); }
.tabList button:disabled { opacity: .5; cursor: not-allowed; }
.tabPanel { padding-top: 28px; }
.tabPanel[hidden] { display: none; }
.dialog { width: min(600px,calc(100vw - 40px)); max-height: calc(100dvh - 40px); margin: auto; padding: 28px; border: 1px solid var(--eh-color-line); border-radius: var(--eh-shape-panel); background: var(--eh-color-paper); color: var(--eh-color-ink); font: 400 var(--eh-font-app)/1.65 var(--eh-font-family); }
.dialog::backdrop { background: var(--eh-color-deep); opacity: .7; }
.dialogHead { display: flex; align-items: start; justify-content: space-between; gap: 24px; }
.dialogHead h2 { font-size: 1.5rem; line-height: 1.25; letter-spacing: -.03em; margin: 0; }
.dialogHead > button { min-width: 44px; min-height: 44px; border: 1px solid var(--eh-color-line); background: transparent; color: inherit; border-radius: var(--eh-shape-control); font-size: 1.5rem; cursor: pointer; }
.dialogBody { padding-block: 24px; }
.emptyState { border: 1px solid var(--eh-rule); padding: 36px; display: grid; gap: 18px; }
.loading { display: flex; align-items: center; gap: 14px; padding: 28px 0; font-size: var(--eh-font-label); }
.loading span { width: 20px; height: 20px; border: 2px solid var(--eh-color-line); border-top-color: var(--eh-color-petrol); border-radius: 50%; }
.errorState { border-left: 3px solid var(--eh-color-error); padding: 24px; background: var(--eh-color-white); display: grid; gap: 18px; }
.errorState .button { justify-self: start; }
.tableScroll { max-width: 100%; overflow-x: auto; }
.table { border-collapse: collapse; min-width: 540px; width: 100%; text-align: left; font-size: var(--eh-font-app); }
.table caption { text-align: left; font-size: 1.125rem; font-weight: 650; padding-bottom: 20px; }
.table :is(th,td) { padding: 18px 16px; border-bottom: 1px solid var(--eh-rule); vertical-align: top; }
.table thead th { font-size: var(--eh-font-label); color: var(--eh-muted); font-weight: 600; }
.table tbody th { font-weight: 600; }
.table [data-numeric] { text-align: right; font-variant-numeric: tabular-nums; }
.list li { display: flex; gap: 24px; align-items: center; justify-content: space-between; padding: 22px 0; border-bottom: 1px solid var(--eh-rule); }
.list li:first-child { border-top: 1px solid var(--eh-rule); }
.list li > div:first-child { display: grid; gap: 5px; min-width: 0; }
.listTitle { font-size: var(--eh-font-app); font-weight: 650; line-height: 1.4; }
.listMeta { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; align-items: center; }
.composer { display: grid; gap: 20px; }
.documentList { display: grid; gap: 20px; }
@media (max-width: 850px) {
  .hero[data-has-media="true"], .split { grid-template-columns: 1fr; gap: 36px; }
  .heroCopy .heading { max-width: 19ch; }
  .heroCopy .heading[data-scale="display"] { max-width: 11ch; }
  .heroMedia { max-width: 640px; }
  .heroMedia .imageCut { aspect-ratio: 1.45; }
  .split[data-reverse] .storyCopy { order: initial; }
  .articleLayout { grid-template-columns: 1fr; }
  .contents { max-width: 70ch; }
  .appHeader { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 580px) {
  .promiseRow { grid-template-columns: 1fr; }
  .promiseRow li, .promiseRow li + li { padding: 26px 0; border-left: 0; border-bottom: 1px solid var(--eh-rule); }
  .comparison { grid-template-columns: 1fr; }
  .comparison > div { padding: 26px 20px; }
  .steps li { grid-template-columns: 60px minmax(0,1fr); gap: 20px; }
  .timeline li { grid-template-columns: 1fr; gap: 10px; padding-left: 24px; }
  .featureRows li { grid-template-columns: 28px minmax(0,1fr); gap: 16px; }
  .featureIcon { display: none; }
  .serviceIndex a { grid-template-columns: 28px minmax(0,1fr) 20px; gap: 16px; }
  .list li { align-items: flex-start; flex-direction: column; gap: 12px; }
  .listMeta { justify-content: flex-start; }
  .recordCover { min-height: 320px; }
  .pricePlan, .emptyState { padding: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .scope *, .dialog * { animation: none; transition: none; scroll-behavior: auto; }
}

`````

## packages/eh-design/src/tokens.css

`````css
/* Generated from tokens.json. Run node scripts/eh-design-generate.mjs. */
:root {
  --eh-color-paper: #faf8f4;
  --eh-color-petrol: #105258;
  --eh-color-deep: #0a3539;
  --eh-color-ink: #10222a;
  --eh-color-secondary: #4b5b60;
  --eh-color-line: #e4e2dc;
  --eh-color-sand: #ecdfc9;
  --eh-color-terra: #a84d29;
  --eh-color-white: #ffffff;
  --eh-color-error: #a13232;
  --eh-color-success: #236344;
  --eh-color-focus: #a84d29;
  --eh-font-family: Inter, var(--font-marketing, Arial), sans-serif;
  --eh-font-body: 1.0625rem;
  --eh-font-app: 1rem;
  --eh-font-label: 0.9375rem;
  --eh-font-meta: 0.8125rem;
  --eh-font-eyebrow: 0.75rem;
  --eh-font-input: 1rem;
  --eh-font-display: clamp(3.5rem, 7.8vw, 7rem);
  --eh-font-page: clamp(2.75rem, 5vw, 4.25rem);
  --eh-font-section: clamp(2rem, 3.6vw, 3.25rem);
  --eh-font-app-title: clamp(2rem, 3vw, 2.75rem);
  --eh-space-xs: 0.5rem;
  --eh-space-sm: 1rem;
  --eh-space-md: 1.5rem;
  --eh-space-lg: 2rem;
  --eh-space-xl: 3rem;
  --eh-space-section: clamp(3.5rem, 7vw, 7rem);
  --eh-space-gutter: clamp(1.25rem, 4vw, 4.5rem);
  --eh-shape-control: 0.375rem;
  --eh-shape-panel: 0.5rem;
  --eh-shape-cut: clamp(1.5rem, 3vw, 3rem);
  --eh-motion-duration: 180ms;
  --eh-motion-ease: cubic-bezier(0.2, 0.7, 0.2, 1);
}

`````

## packages/eh-design/src/tokens.json

`````json
{
  "version": "1.0.0",
  "color": {
    "paper": "#faf8f4",
    "petrol": "#105258",
    "deep": "#0a3539",
    "ink": "#10222a",
    "secondary": "#4b5b60",
    "line": "#e4e2dc",
    "sand": "#ecdfc9",
    "terra": "#a84d29",
    "white": "#ffffff",
    "error": "#a13232",
    "success": "#236344",
    "focus": "#a84d29"
  },
  "font": {
    "family": "Inter, var(--font-marketing, Arial), sans-serif",
    "body": "1.0625rem",
    "app": "1rem",
    "label": "0.9375rem",
    "meta": "0.8125rem",
    "eyebrow": "0.75rem",
    "input": "1rem",
    "display": "clamp(3.5rem, 7.8vw, 7rem)",
    "page": "clamp(2.75rem, 5vw, 4.25rem)",
    "section": "clamp(2rem, 3.6vw, 3.25rem)",
    "appTitle": "clamp(2rem, 3vw, 2.75rem)"
  },
  "space": {
    "xs": "0.5rem",
    "sm": "1rem",
    "md": "1.5rem",
    "lg": "2rem",
    "xl": "3rem",
    "section": "clamp(3.5rem, 7vw, 7rem)",
    "gutter": "clamp(1.25rem, 4vw, 4.5rem)"
  },
  "shape": {
    "control": "0.375rem",
    "panel": "0.5rem",
    "cut": "clamp(1.5rem, 3vw, 3rem)"
  },
  "motion": {
    "duration": "180ms",
    "ease": "cubic-bezier(0.2, 0.7, 0.2, 1)"
  },
  "slide": {
    "width": 1920,
    "height": 1080,
    "margin": 96,
    "caption": 24,
    "body": 34,
    "heading": 80
  }
}

`````

## packages/eh-design/src/tokens.ts

`````ts
// Generated from tokens.json. Do not edit.
export const EHTokens = {
  "version": "1.0.0",
  "color": {
    "paper": "#faf8f4",
    "petrol": "#105258",
    "deep": "#0a3539",
    "ink": "#10222a",
    "secondary": "#4b5b60",
    "line": "#e4e2dc",
    "sand": "#ecdfc9",
    "terra": "#a84d29",
    "white": "#ffffff",
    "error": "#a13232",
    "success": "#236344",
    "focus": "#a84d29"
  },
  "font": {
    "family": "Inter, var(--font-marketing, Arial), sans-serif",
    "body": "1.0625rem",
    "app": "1rem",
    "label": "0.9375rem",
    "meta": "0.8125rem",
    "eyebrow": "0.75rem",
    "input": "1rem",
    "display": "clamp(3.5rem, 7.8vw, 7rem)",
    "page": "clamp(2.75rem, 5vw, 4.25rem)",
    "section": "clamp(2rem, 3.6vw, 3.25rem)",
    "appTitle": "clamp(2rem, 3vw, 2.75rem)"
  },
  "space": {
    "xs": "0.5rem",
    "sm": "1rem",
    "md": "1.5rem",
    "lg": "2rem",
    "xl": "3rem",
    "section": "clamp(3.5rem, 7vw, 7rem)",
    "gutter": "clamp(1.25rem, 4vw, 4.5rem)"
  },
  "shape": {
    "control": "0.375rem",
    "panel": "0.5rem",
    "cut": "clamp(1.5rem, 3vw, 3rem)"
  },
  "motion": {
    "duration": "180ms",
    "ease": "cubic-bezier(0.2, 0.7, 0.2, 1)"
  },
  "slide": {
    "width": 1920,
    "height": 1080,
    "margin": 96,
    "caption": 24,
    "body": 34,
    "heading": 80
  }
} as const;

`````

## scripts/eh-design-browser.mjs

`````js
import {chromium} from "playwright-core";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
const out="docs/brand/evidence/system";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.EH_CHROMIUM_PATH??"/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome",headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const result=[];
try {
 await page.goto("http://127.0.0.1:4190/design-system",{waitUntil:"networkidle",timeout:90000});
 await page.evaluate(()=>document.fonts.ready);
 const views=["Startseite","Leistung","Ratgeber","Leistungsübersicht","Kontakt","Leistungsumfang","Owner-App","Handwerker-App","Bausteine"];
 for(const width of [390,736,1440]) {
  await page.setViewportSize({width,height:1000});
  for(const [i,view] of views.entries()) {
   await page.getByRole("button",{name:view,exact:true}).click();
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:out+"/view-"+i+"-"+width+".png",fullPage:true});
   const metrics=await page.evaluate(()=>{
    const nodes=[...document.querySelectorAll("#design-preview *")].filter(el=>el.getBoundingClientRect().width&&el.getBoundingClientRect().height&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,small:nodes.filter(el=>parseFloat(getComputedStyle(el).fontSize)<12).map(el=>({text:el.textContent.slice(0,80),size:getComputedStyle(el).fontSize})),font:getComputedStyle(document.querySelector("#design-preview")).fontFamily};
   });
   await page.addScriptTag({content:readFileSync("node_modules/axe-core/axe.min.js","utf8")});
   const axe=await page.evaluate(async()=>{const r=await window.axe.run(document.querySelector("#design-preview"),{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
   result.push({view,width,...metrics,axe});
   console.log(view,width,"overflow",metrics.overflow,"small",metrics.small.length,"axe",axe.length);
  }
 }
 // Real keyboard behavior, search filtering, native validation and dialog focus.
 await page.getByRole("button",{name:"Owner-App",exact:true}).click();
 const overview=page.getByRole("tab",{name:"Überblick",exact:true});await overview.focus();await page.keyboard.press("ArrowRight");
 if(await page.getByRole("tab",{name:"Dokumente",exact:true}).getAttribute("aria-selected")!=="true")throw Error("Tabs keyboard selection failed");
 await page.getByLabel("Dokumente suchen",{exact:true}).fill("Dach");
 if(await page.getByRole("link",{name:"Heizungswartung · Musterdatei"}).count())throw Error("Document search did not filter");
 await page.getByRole("button",{name:"Handwerker-App",exact:true}).click();
 await page.getByRole("button",{name:"Anfrage ansehen",exact:true}).first().click();
 if(!(await page.getByRole("dialog").isVisible()))throw Error("Dialog did not open");
 await page.keyboard.press("Escape");
 if(await page.getByRole("dialog").isVisible())throw Error("Dialog did not close on Escape");
 await page.getByRole("button",{name:"Kontakt",exact:true}).click();
 await page.getByRole("button",{name:"Formular prüfen",exact:true}).click();
 if(await page.getByText("Vorschau: Formular geprüft.",{exact:false}).count())throw Error("Invalid form submitted");
 const bad=result.filter(r=>r.overflow||r.small.length||r.axe.length);
 writeFileSync(out+"/browser.json",JSON.stringify({result,errors,interactions:"passed",failedViews:bad.length},null,2)+"\n");
 if(bad.length||errors.length)process.exitCode=1;else console.log("EH_BROWSER_VALID");
} finally {await browser.close();}

`````

## scripts/eh-design-check.mjs

`````js
import {readFileSync,existsSync,readdirSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
export const hash=data=>createHash("sha256").update(data).digest("hex");
export function violations(path,source) {
  const results=[];
  const rules=[
    ["literal-color", /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/g],
    ["foreign-font", /\b(?:Manrope|Poppins|Geist|Roboto|Montserrat|Playfair|DM Sans)\b/g],
    ["small-type", /font-size\s*:\s*(?:[0-9]|1[0-2])(?:\.\d+)?px\b|fontSize\s*:\s*(?:[0-9]|1[0-2])\b|text-(?:xs|\[(?:[0-9]|1[0-2])px\])/g],
    ["unowned-style", /\bstyle\s*=\s*\{/g],
    ["decorative-effect", /(?:linear|radial|conic)-gradient\s*\(|backdrop-filter\s*:\s*blur|\b(?:shadow-(?:xl|2xl)|rounded-full|backdrop-blur|bg-gradient-)\b/g],
    ["visual-utility", /\b(?:bg|text|border|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g],
  ];
  for(const [rule,pattern] of rules) for(const match of source.matchAll(pattern)) results.push({rule,token:match[0],key:rule+"\u0000"+match[0]});
  return results;
}
function walk(root,path="src") {
  const dir=resolve(root,path);if(!existsSync(dir))return [];
  return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(root,path+"/"+e.name):/\.(?:css|tsx?|jsx?)$/.test(e.name)?[path+"/"+e.name]:[]);
}
export function scan(root) {
  const baseline={};
  for(const path of walk(root)) {
    const counts={};for(const v of violations(path,readFileSync(resolve(root,path),"utf8")))counts[v.key]=(counts[v.key]??0)+1;
    if(Object.keys(counts).length)baseline[path]=counts;
  }
  return baseline;
}
export function check(root,{base,checkSeal=true}={}) {
  const errors=[];const policy=JSON.parse(readFileSync(resolve(root,"design/design-policy.json"),"utf8"));
  const baseline=JSON.parse(readFileSync(resolve(root,"design/design-debt.json"),"utf8"));
  const current=scan(root);
  for(const [path,counts] of Object.entries(current))for(const [key,count] of Object.entries(counts))if(count>(baseline[path]?.[key]??0))errors.push(path+": new "+key.split("\u0000")[0]+" ("+count+" > "+(baseline[path]?.[key]??0)+")");
  if(checkSeal) {
    const lock=JSON.parse(readFileSync(resolve(root,"design/design-lock.json"),"utf8"));
    for(const [path,expected] of Object.entries(lock.files)) {
      const file=resolve(root,path);if(!existsSync(file)||hash(readFileSync(file))!==expected)errors.push("Protected design file changed: "+path);
    }
  }
  if(base) {
    // Base is an exact commit from the PR event. Never run PR-controlled shell text.
    if(!/^[0-9a-f]{40}$/.test(base))throw new Error("Expected full base commit SHA");
    const show=path=>{try{return execFileSync("git",["show",base+":"+path],{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]});}catch{return null;}};
    const previous=show("design/design-policy.json");
    if(previous) {
      const trusted=JSON.parse(previous);
      const changed=execFileSync("git",["diff","--name-only",base,"--"],{cwd:root,encoding:"utf8"}).trim().split("\n").filter(Boolean);
      for(const path of changed) if(trusted.protected.some(p=>p.endsWith("/")?path.startsWith(p):path===p))errors.push("Brand authority required; protected path differs from trusted base: "+path);
      const oldDebt=show("design/design-debt.json");if(oldDebt && readFileSync(resolve(root,"design/design-debt.json"),"utf8")!==oldDebt)errors.push("Debt baseline is immutable in ordinary PRs");
    }
    const added=execFileSync("git",["diff","--name-only","--diff-filter=A",base,"--","src"],{cwd:root,encoding:"utf8"}).trim().split("\n").filter(Boolean);
    for(const path of added) {
      if(path.endsWith(".css") && !policy.ownedStyleFiles.includes(path))errors.push("New page styling forbidden; compose canonical components: "+path);
      if(path.endsWith(".tsx") && !path.startsWith("src/app/api/") && !path.startsWith("src/design-system/")) {
        const source=readFileSync(resolve(root,path),"utf8");
        if(/<[A-Za-z]/.test(source) && !/from\s+["'][^"']*(?:design-system|eh-design|components\/marketing\/ui)(?:\/[^"']*)?["']/.test(source))errors.push("New UI must consume the canonical library: "+path);
      }
    }
  }
  return errors;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const root=resolve(process.env.EH_DESIGN_ROOT??dirname(fileURLToPath(import.meta.url))+"/..");
  const arg=process.argv.indexOf("--base");const errors=check(root,{base:arg>=0?process.argv[arg+1]:undefined});
  if(errors.length){console.error(errors.join("\n"));process.exitCode=1;}else console.log("EH_DESIGN_CONSISTENT");
}

`````

## scripts/eh-design-check.test.mjs

`````js
import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
import {check,scan,hash} from "./eh-design-check.mjs";
function fixture(fn) {
 const root=mkdtempSync(join(tmpdir(),"eh-design-guard-"));const put=(p,s)=>{mkdirSync(join(root,p,".."),{recursive:true});writeFileSync(join(root,p),s);};
 const git=(...args)=>execFileSync("git",args,{cwd:root,encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim();
 put("src/existing.tsx",'export const x=<p style={{color:"#123456"}}>Existing debt</p>;\n');
 put("packages/eh-design/core.ts","export const approved=true;\n");
 put("design/design-policy.json",JSON.stringify({protected:["packages/eh-design/","design/","scripts/eh-design-check.mjs",".github/workflows/eh-design.yml"],ownedStyleFiles:[]}));
 put("scripts/eh-design-check.mjs","trusted guard");put(".github/workflows/eh-design.yml","trusted workflow");
 put("design/design-debt.json",JSON.stringify(scan(root)));
 put("design/design-lock.json",JSON.stringify({files:{"packages/eh-design/core.ts":hash("export const approved=true;\n")}}));
 git("init","-q");git("add",".");git("-c","user.name=Guard Test","-c","user.email=guard@example.invalid","commit","-qm","fixture");const base=git("rev-parse","HEAD");
 try{fn({root,put,base,git});}finally{rmSync(root,{recursive:true,force:true});}
}
test("unchanged debt and semantic canonical composition pass",()=>fixture(({root,put,base,git})=>{
 put("src/page.tsx",'import {EHHeading} from "@/design-system"; export default function Page(){return <EHHeading>Content</EHHeading>;}');
 git("add","src/page.tsx");assert.deepEqual(check(root,{base}),[]);
}));
test("new literal, too-small type and foreign font fail",()=>fixture(({root,put})=>{
 put("src/new.css",'.x { color:#ff0011;font-size:11px;font-family:Manrope; }');
 const errors=check(root);assert(errors.some(e=>e.includes("literal-color")));assert(errors.some(e=>e.includes("small-type")));assert(errors.some(e=>e.includes("foreign-font")));
}));
test("moving lines cannot increase a debt allowance",()=>fixture(({root,put})=>{
 put("src/existing.tsx",'\n\nexport const x=<p style={{color:"#123456",background:"#123456"}}>More debt</p>;');
 assert(check(root).some(e=>e.includes("literal-color")));
}));
test("debt removal passes without rebaselining",()=>fixture(({root,put})=>{
 put("src/existing.tsx",'export const x=<p>Less debt</p>;');assert.deepEqual(check(root),[]);
}));
test("editing core and resealing still fails trusted-base comparison",()=>fixture(({root,put,base})=>{
 const s="export const approved=false;\n";put("packages/eh-design/core.ts",s);put("design/design-lock.json",JSON.stringify({files:{"packages/eh-design/core.ts":hash(s)}}));
 assert(check(root,{base}).some(e=>e.includes("Brand authority required")));
}));
test("weakening guard, workflow or baseline fails",()=>fixture(({root,put,base})=>{
 put("scripts/eh-design-check.mjs","bypass");put(".github/workflows/eh-design.yml","skip all");put("design/design-debt.json","{}");
 const errors=check(root,{base});for(const path of ["scripts/eh-design-check.mjs",".github/workflows/eh-design.yml","design/design-debt.json"])assert(errors.some(e=>e.includes(path)));
}));
test("new CSS and disconnected UI fail even without suspicious literals",()=>fixture(({root,put,base,git})=>{
 put("src/rogue.css",".rogue { display:grid; }");put("src/rogue.tsx","export const Rogue=()=> <button>Invented component</button>;");
 git("add","src");const errors=check(root,{base});assert(errors.some(e=>e.includes("New page styling forbidden")));assert(errors.some(e=>e.includes("New UI must consume")));
}));

`````

## scripts/eh-design-generate.mjs

`````js
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = resolve(root, "packages/eh-design/src");
const raw = readFileSync(resolve(dir, "tokens.json"), "utf8");
const data = JSON.parse(raw);
const css = "/* Generated from tokens.json. Run node scripts/eh-design-generate.mjs. */\n:root {\n" +
 Object.entries(data).filter(([,v]) => typeof v === "object").flatMap(([group, values]) =>
 Object.entries(values).filter(([,value])=>typeof value==="string").map(([key,value]) =>
 "  --eh-" + group + "-" + key.replace(/[A-Z]/g,m=>"-"+m.toLowerCase()) + ": " + value + ";")).join("\n") + "\n}\n";
const moduleCss = readFileSync(resolve(dir, "styles.module.css"), "utf8");
const htmlCss = moduleCss.replace(/\.([A-Za-z_][A-Za-z0-9_-]*)/g, ".eh-$1");
const font = readFileSync(resolve(root,"packages/eh-design/assets/inter-variable.woff2")).toString("base64");
const logo = readFileSync(resolve(root,"packages/eh-design/assets/logo-full.png")).toString("base64");
const htmlStyle = "// Generated canonical HTML adapter assets. Do not edit.\nexport const EHHtmlStyles=" + JSON.stringify('@font-face{font-family:Inter;src:url("data:font/woff2;base64,'+font+'") format("woff2");font-weight:100 900}html,body{margin:0}'+css+htmlCss) + ";\nexport const EHLogoData="+JSON.stringify("data:image/png;base64,"+logo)+";\n";
const ts = "// Generated from tokens.json. Do not edit.\nexport const EHTokens = " + JSON.stringify(data,null,2) + " as const;\n";
for (const [name, expected] of [["tokens.css",css],["tokens.ts",ts],["html.css",htmlCss],["html-style.mjs",htmlStyle]]) {
 const file=resolve(dir,name);
 if(process.argv.includes("--check")) {
  if(readFileSync(file,"utf8")!==expected) throw new Error("Token drift: "+name);
 } else writeFileSync(file,expected);
}
console.log("EH_TOKENS_VALID");

`````

## scripts/eh-design-html.test.mjs

`````js
import test from "node:test";
import assert from "node:assert/strict";
import {EHHtmlPage,EHHtmlHeader,EHHtmlField,EHHtmlTable,EHHtmlButton,EHHtmlStatus} from "../packages/eh-design/src/html.mjs";
test("HTML adapter escapes user content in text and attributes",()=>{
 const bad='<img src=x onerror="alert(1)">';
 const html=EHHtmlPage({title:bad,content:EHHtmlHeader({title:bad})+EHHtmlField({id:"query",label:bad,value:bad})+EHHtmlTable({caption:bad,columns:[{key:"name",label:bad}],rows:[{name:bad}]})});
 assert(!html.includes(bad));assert(html.includes("&lt;img"));assert(html.includes("&quot;alert(1)&quot;"));assert(html.includes("data:font/woff2;base64,"));
});
test("untrusted URL schemes and visual variants fail closed",()=>{
 assert.throws(()=>EHHtmlButton({label:"Open",href:"javascript:alert(1)"}));
 assert.throws(()=>EHHtmlButton({label:"Open",variant:"invented"}));
 assert.throws(()=>EHHtmlStatus({label:"Open",tone:"neon"}));
 assert(EHHtmlButton({label:"Lead",href:"/leads?id=1&tab=history"}).includes("&amp;"));
});

`````

## scripts/eh-design-public-browser.mjs

`````js
import {chromium} from "playwright-core";
import {writeFileSync} from "node:fs";
const browser=await chromium.launch({executablePath:process.env.EH_CHROMIUM_PATH??"/home/ubuntu/.local/share/eh-brand-browser/chromium-1234/chrome-linux/chrome",headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({reducedMotion:"reduce"});const results=[];const errors=[];
page.on("pageerror",e=>errors.push(e.message));
try {
 for(const width of [390,1440]) {
  await page.setViewportSize({width,height:1000});
  for(const route of ["/","/leistungen/heizung","/hilfe","/hausakte","/kontakt","/lexikon","/login"]) {
   const response=await page.goto("http://127.0.0.1:4190"+route,{waitUntil:"networkidle"});
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:"docs/brand/evidence/system/public-"+(route==="/"?"home":route.slice(1).replaceAll("/","-"))+"-"+width+".png",fullPage:true});
   const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelector("h1")?.textContent,logo:[...document.images].filter(i=>/logo-full/.test(i.src)).map(i=>({loaded:i.complete&&i.naturalWidth>0,width:i.width}))}));
   results.push({route,width,status:response.status(),...metrics});console.log(route,width,response.status(),metrics.overflow);
  }
 }
 for(const route of ["/app","/pro"]) {const response=await page.goto("http://127.0.0.1:4190"+route);results.push({route,unauthenticatedURL:page.url(),status:response.status()});}
 writeFileSync("docs/brand/evidence/system/public-pages.json",JSON.stringify({results,errors},null,2)+"\n");
 if(results.some(r=>r.overflow||r.status>=500)||errors.length)process.exitCode=1;else console.log("EH_PUBLIC_COMPATIBILITY_VALID");
} finally {await browser.close();}

`````

## scripts/eh-design-seal.mjs

`````js
/** Brand-authority release tool. Ordinary agents MUST NOT run this to bypass a failed guard. */
import {readFileSync,writeFileSync,readdirSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {hash,scan} from "./eh-design-check.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const policy=JSON.parse(readFileSync(resolve(root,"design/design-policy.json"),"utf8"));
function tree(path){if(!existsSync(resolve(root,path)))return [];return readdirSync(resolve(root,path),{withFileTypes:true}).flatMap(e=>e.isDirectory()?tree(path+e.name+"/"):[path+e.name]);}
if(process.argv.includes("--initial-debt"))writeFileSync(resolve(root,"design/design-debt.json"),JSON.stringify(scan(root),null,2)+"\n");
const paths=policy.protected.flatMap(p=>p.endsWith("/")?tree(p):existsSync(resolve(root,p))?[p]:[]).filter(p=>p!=="design/design-lock.json");
writeFileSync(resolve(root,"design/design-lock.json"),JSON.stringify({version:"1.0.0",authority:"Jerry explicitly accepted Atelier 02 and commissioned this release on 2026-09-06.",files:Object.fromEntries(paths.sort().map(p=>[p,hash(readFileSync(resolve(root,p)))]))},null,2)+"\n");
console.log("EH_DESIGN_SEALED");

`````

## scripts/eh-design-source.py

`````python
"""Export complete changed text files and SHA256 assets; no omitted code or recursive capsules."""
from pathlib import Path
import argparse, subprocess, hashlib, json
parser=argparse.ArgumentParser()
parser.add_argument('--root',required=True)
parser.add_argument('--base',required=True)
parser.add_argument('--out',default='docs/brand/system')
a=parser.parse_args(); root=Path(a.root).resolve(); out=root/a.out
subprocess.run(['git','cat-file','-e',a.base+'^{commit}'],cwd=root,check=True)
def names(args): return subprocess.check_output(['git',*args],cwd=root).decode().splitlines()
paths=sorted(set(names(['diff','--name-only',a.base,'--'])+names(['ls-files','--others','--exclude-standard'])))
exclude={str((out/f).relative_to(root)) for f in ['SOURCE.md','source-manifest.json']}
fence=chr(96)*5
body=['# Vollständige Quelldateien der Lieferung','',f'Basiscommit: {a.base}. Pfade relativ zu diesem Repository. Dateien vollständig, keine Auslassungszeichen. Binärdateien werden im Manifest mit SHA256 referenziert. Dieses Dokument ist ein Nachschlagewerk; implementiert wird aus den versionierten Quelldateien.','']
manifest={'base':a.base,'files':{},'deleted':[]}
for rel in paths:
 if rel in exclude: continue
 p=root/rel
 if not p.exists(): manifest['deleted'].append(rel); continue
 if not p.is_file() or p.is_symlink(): continue
 data=p.read_bytes(); item={'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
 try: text=data.decode('utf-8'); is_text='\0' not in text
 except UnicodeDecodeError: is_text=False
 item['kind']='text' if is_text else 'binary';manifest['files'][rel]=item
 if is_text:
  lang={'.tsx':'tsx','.ts':'ts','.mjs':'js','.js':'js','.css':'css','.json':'json','.py':'python','.yml':'yaml','.md':'markdown'}.get(p.suffix,'text')
  body.extend(['## '+rel,'',fence+lang,text,fence,''])
out.mkdir(parents=True,exist_ok=True)
(out/'SOURCE.md').write_text('\n'.join(body))
(out/'source-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
print('EH_SOURCE_COMPLETE',len(manifest['files']))

`````

## scripts/eh-design-sync.mjs

`````js
/** Deterministic, allowlisted vendor transfer. Only clean committed canonical releases. */
import {readFileSync,writeFileSync,readdirSync,mkdirSync,existsSync,copyFileSync,realpathSync} from "node:fs";
import {resolve,dirname,relative} from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
import {hash} from "./eh-design-check.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const arg=process.argv.indexOf("--target");if(arg<0||!process.argv[arg+1])throw new Error("Usage: node scripts/eh-design-sync.mjs --target /absolute/consumer-repository [--check]");
const target=realpathSync(process.argv[arg+1]);if(target===root||target.startsWith(root+"/"))throw new Error("Target must be another repository");
const source=resolve(root,"packages/eh-design");const dest=resolve(target,"vendor/eh-design");const manifestPath=resolve(target,"design/eh-design-vendor.json");
const status=execFileSync("git",["status","--porcelain","--","packages/eh-design"],{cwd:root,encoding:"utf8"});if(status.trim())throw new Error("Canonical package must be committed before synchronization");
const commit=execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim();
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);}
const files=walk(source).map(p=>relative(source,p)).sort();
if(files.some(p=>!/^((src\/[a-z-]+(?:\.module)?\.(tsx?|mjs|css|json))|(assets\/(logo-full\.png|inter-variable\.woff2))|package\.json)$/.test(p)))throw new Error("Undeclared canonical package file");
const prior=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,"utf8")):null;
if(existsSync(dest))for(const file of walk(dest)) {
 const p=relative(dest,file);const bytes=hash(readFileSync(file));const old=prior?.files[p];
 if(!files.includes(p))throw new Error("Unexpected vendor file; refusing overwrite: "+p);
 if(old && bytes!==old && bytes!==hash(readFileSync(resolve(source,p))))throw new Error("Local vendor edit: "+p);
 if(!old && bytes!==hash(readFileSync(resolve(source,p))))throw new Error("Untracked differing vendor file: "+p);
}
const hashes=Object.fromEntries(files.map(p=>[p,hash(readFileSync(resolve(source,p)))]));
if(process.argv.includes("--check")) {
 if(!prior||JSON.stringify(prior.files)!==JSON.stringify(hashes))throw new Error("Vendor manifest drift");
 for(const p of files)if(!existsSync(resolve(dest,p))||hash(readFileSync(resolve(dest,p)))!==hashes[p])throw new Error("Vendor drift: "+p);
}else{
 for(const p of files){mkdirSync(dirname(resolve(dest,p)),{recursive:true});copyFileSync(resolve(source,p),resolve(dest,p));}
 mkdirSync(dirname(manifestPath),{recursive:true});
 writeFileSync(manifestPath,JSON.stringify({version:"1.0.0",repository:"https://github.com/Delqhi/einfach-hausen",commit,files:hashes},null,2)+"\n");
}
console.log("EH_VENDOR_VALID");

`````

## scripts/public-website-contract.mjs

`````js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const expectedSlugs = [
  'haus-technik',
  'elektro-smart-home',
  'heizung',
  'sanitaer-wasser',
  'dach-fenster-tueren',
  'innenausbau-sanierung',
  'garten-aussenbereich',
  'reinigung-pflege',
  'saisonale-dienste',
  'spezialfaelle',
  'umzug-entruempelung',
  'beratung-notfall',
];

assert.ok(exists('src/components/marketing/service-catalog.tsx'), 'service catalog must exist');
const catalog = read('src/components/marketing/service-catalog.tsx');
for (const slug of expectedSlugs) assert.match(catalog, new RegExp(`slug:\\s*['\"]${slug}['\"]`));
assert.match(catalog, /SERVICE_PATHS/);
assert.match(catalog, /getServiceCategory/);

const shell = read('src/components/marketing/site-shell.tsx');
assert.match(shell, /megaMenu/);
assert.match(shell, /Alle Leistungen/);
assert.match(shell, /Beratung/);
assert.match(shell, /Notfall/);
assert.match(shell, /Blog/);
assert.match(shell, /Lexikon/);
assert.match(shell, /Sicherheit/);
assert.match(shell, /Was steht bei dir an\?/);
assert.match(shell, /Noch nicht sicher, was du brauchst\?/);
assert.ok(shell.includes('href="\/#anliegen"'), 'megamenu must expose the homeowner intake CTA');


assert.ok(exists('src/components/marketing/service-detail-page.tsx'), 'shared service detail page must exist');
assert.ok(exists('src/app/leistungen/[slug]/page.tsx'), 'dynamic service route must exist');
const dynamicServicePage = read('src/app/leistungen/[slug]/page.tsx');
assert.match(dynamicServicePage, /generateStaticParams/);
assert.match(dynamicServicePage, /generateMetadata/);
const sitemap = read('src/app/sitemap.ts');
assert.match(sitemap, /SERVICE_PATHS/);
const serviceIndex = read('src/app/leistungen/page.tsx');
assert.match(serviceIndex, /SERVICE_CATEGORIES/);
assert.ok(serviceIndex.includes('href={`/leistungen/${slug}`}'));
const heatingPage = read('src/app/leistungen/heizung/page.tsx');
assert.match(heatingPage, /ServiceDetailPage/);


const productRoutes = [
  ['beratung', /kein Auftrag/i],
  ['notfall', /Bereitschaft|24\/7/],
  ['versicherung', /nicht automatisch/i],
  ['immobilienverkauf', /Freigabe|Makler/],
];
for (const [slug, pattern] of productRoutes) {
  const rel = `src/app/${slug}/page.tsx`;
  assert.ok(exists(rel), `public product page /${slug} must exist`);
  assert.match(read(rel), pattern);
  assert.ok(sitemap.includes(`/${slug}`), `sitemap must include /${slug}`);
}


assert.ok(exists('src/components/marketing/home-hero.tsx'), 'canonical homepage hero v2 must exist');
const homeHero = read('src/components/marketing/home-hero.tsx');
assert.match(homeHero, /EHPageHero/);
assert.match(homeHero, /EHImageFrame/);
assert.match(homeHero, /Dein Haus/);
assert.doesNotMatch(homeHero, /HeroOrchestration|gsap/);
assert.match(homeHero, /IntakeForm/);
assert.doesNotMatch(homeHero, /Nichts wird ohne dich beauftragt/, 'homepage hero must not repeat the removed no-order proof line');
const intakeForm = read('src/components/home/intake-form.tsx');
assert.match(intakeForm, /variant !== \"hero\" && \(/, 'hero intake must hide the visible heading, badge, and meta row');
assert.match(intakeForm, /aria-label=\{variant === \"hero\" \? \"Anliegen beschreiben\"/, 'hero intake must use an aria-label instead of the removed visible prompt');

const homeSections = read('src/components/marketing/home-sections.tsx');
assert.ok(homeSections.includes("export { HomeHero } from './home-hero';"), 'homepage sections must export canonical hero v2');
assert.match(homeSections, /SERVICE_CATEGORIES/);
assert.ok(homeSections.includes('href={`/leistungen/${slug}`}'));
const helpPage = read('src/app/hilfe/page.tsx');
for (const href of ['/sicherheit','/blog','/lexikon','/kontakt']) assert.ok(helpPage.includes(href), `help hub must link ${href}`);
const houseFilePage = read('src/app/hausakte/page.tsx');
assert.ok(houseFilePage.includes('/versicherung'));
assert.ok(houseFilePage.includes('/immobilienverkauf'));
const ownerPage = read('src/app/eigenheimbesitzer/page.tsx');
for (const href of ['/beratung','/notfall','/immobilienverkauf']) assert.ok(ownerPage.includes(href), `owner page must discover ${href}`);
const howPage = read('src/app/so-funktionierts/page.tsx');
assert.ok(howPage.includes('/beratung'));
assert.ok(howPage.includes('/notfall'));
const partnerPage = read('src/app/partner/page.tsx');
assert.match(partnerPage, /0 % Auftragsprovision/);
assert.match(partnerPage, /Aufträge verwalten AN \/ AUS/);

const imprint = read('src/app/impressum/page.tsx');
assert.match(imprint, /Gina Schulze/, 'public imprint must name Gina Schulze');
assert.match(imprint, /Inhaberin/, 'public imprint must identify Gina as owner');
assert.match(imprint, /Geschäftsführerin/, 'public imprint must identify Gina as managing director');
assert.doesNotMatch(imprint, /(?:Betreiber|Inhaber|Geschäftsführ)[^\n<]*Jeremy Schulze/i, 'Jeremy must not be presented as platform owner/operator');

const authLegalModal = read('src/components/auth-v2/LegalModal.tsx');
assert.match(authLegalModal, /Gina Schulze/, 'auth imprint modal must name Gina Schulze');
assert.doesNotMatch(authLegalModal, /M\. Schmidt|T\. Weber|HRB 189234|DE 349 812 765|einfachhausen GmbH/, 'auth imprint modal must not contain placeholder legal identity');

assert.ok(exists('docs/COMPANY_IDENTITY.md'), 'canonical company identity doc must exist');
const companyIdentity = read('docs/COMPANY_IDENTITY.md');
assert.match(companyIdentity, /Gina Schulze/);
assert.match(companyIdentity, /Inhaberin/);
assert.match(companyIdentity, /Geschäftsführerin/);
assert.match(companyIdentity, /Jeremy Schulze/);
assert.match(companyIdentity, /Developer|Entwickler/);
assert.ok(read('README.md').includes('docs/COMPANY_IDENTITY.md'), 'README must link canonical company identity');
assert.ok(read('AGENTS.md').includes('docs/COMPANY_IDENTITY.md'), 'AGENTS must link canonical company identity');

console.log(JSON.stringify({ ok: true, services: expectedSlugs.length, productRoutes: productRoutes.length, checks: ['catalog','megamenu','help-discovery','service-routes','sitemap','product-pages','core-discovery','company-identity'] }, null, 2));

`````

## src/app/app/homeowner.module.css

`````css
.ownerScope {
  --owner-green-900: var(--eh-green-900);
  --owner-green-700: var(--eh-green-700);
  --owner-green-600: var(--eh-green-600);
  --owner-green-100: var(--eh-green-100);
  --owner-green-50: var(--eh-green-50);
  --owner-bg: var(--eh-bg);
  --owner-surface: var(--eh-surface);
  --owner-surface-subtle: var(--eh-surface-subtle);
  --owner-text: var(--eh-text);
  --owner-muted: var(--eh-text-secondary);
  --owner-border: var(--eh-border);
  --owner-border-strong: var(--eh-border-strong);
  --owner-focus: var(--eh-green-700);
  min-height: 100vh;
  background: var(--owner-bg);
  color: var(--owner-text);
}

.skipLink {
  position: fixed;
  left: 16px;
  top: 12px;
  z-index: 1000;
  transform: translateY(-160%);
  padding: 10px 14px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-900);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  transition: transform 160ms ease-out;
}

.skipLink:focus {
  transform: translateY(0);
}

.mainAnchor:focus {
  outline: none;
}

.ownerScope :global(.app-page) {
  background: var(--owner-bg);
  color: var(--owner-text);
}

.ownerScope :global(.app-shell-v3 .workspace-shell),
.ownerScope :global(.app-shell-v3 .workspace-main) {
  background: var(--owner-bg);
}

.ownerScope :global(.app-shell-v3 .workspace-shell) {
  grid-template-columns: 236px minmax(0, 1fr);
}

.ownerScope :global(.app-shell-v3 .desktop-sidebar) {
  background: rgba(255, 255, 255, 0.96);
  border-color: var(--owner-border);
  padding: 24px 14px;
}

.ownerScope :global(.app-shell-v3 .sidebar-nav) {
  gap: 4px;
}

.ownerScope :global(.app-shell-v3 .sidebar-nav a) {
  min-height: 44px;
  border-radius: var(--eh-shape-panel);
  padding: 9px 11px;
  color: #59635d;
  font-size: 13px;
}

.ownerScope :global(.app-shell-v3 .sidebar-nav a.active) {
  background: var(--owner-green-50);
  color: var(--owner-green-900);
}

.ownerScope :global(.app-shell-v3 .sidebar-nav a:hover) {
  background: var(--owner-surface-subtle);
  color: var(--owner-text);
}

.ownerScope :global(.app-shell-v3 .topbar-v3) {
  height: 68px;
  padding: 0 32px;
  border-color: var(--owner-border);
  background: rgba(247, 248, 247, 0.9);
  backdrop-filter: none;
}

.ownerScope :global(.app-shell-v3 .page-context strong) {
  font-size: 13px;
  font-weight: 650;
}

.ownerScope :global(.app-shell-v3 .page-context small) {
  margin-top: 3px;
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
}

.ownerScope :global(.app-shell-v3 .top-actions > a),
.ownerScope :global(.app-shell-v3 .top-user-avatar) {
  min-width: 44px;
  min-height: 44px;
}

.ownerScope :global(.app-shell-v3 .screen-v3) {
  width: min(100%, 960px);
  max-width: 960px;
  padding: 52px 42px 112px;
}

.ownerScope :global(.app-shell-v3 .btn.primary),
.ownerScope :global(.app-shell-v3 .send-action) {
  background: var(--owner-green-700);
  color: #fff;
}

.ownerScope :global(.app-shell-v3 .btn.primary:hover),
.ownerScope :global(.app-shell-v3 .send-action:hover) {
  background: var(--owner-green-600);
}

.ownerScope :global(.app-shell-v3 .btn),
.ownerScope :global(.app-shell-v3 button),
.ownerScope :global(.app-shell-v3 a),
.ownerScope :global(.owner-state-action) {
  -webkit-tap-highlight-color: transparent;
}

.ownerScope :global(.app-shell-v3 .btn),
.ownerScope :global(.app-shell-v3 input),
.ownerScope :global(.app-shell-v3 select) {
  min-height: 46px;
}

.ownerScope :global(.app-shell-v3 textarea) {
  min-height: 112px;
}

.ownerScope :global(.app-shell-v3 input),
.ownerScope :global(.app-shell-v3 textarea),
.ownerScope :global(.app-shell-v3 select) {
  border: 1px solid var(--owner-border-strong);
  border-radius: var(--eh-shape-panel);
  background: var(--owner-surface);
  color: var(--owner-text);
}

.ownerScope :global(.app-shell-v3 :focus-visible),
.ownerScope :global(.owner-state-action:focus-visible) {
  outline: 3px solid color-mix(in srgb, var(--owner-focus) 28%, transparent);
  outline-offset: 3px;
}

.ownerScope :global(.app-shell-v3 input:focus),
.ownerScope :global(.app-shell-v3 textarea:focus),
.ownerScope :global(.app-shell-v3 select:focus) {
  border-color: var(--owner-green-700);
  box-shadow: 0 0 0 3px rgba(23, 107, 69, 0.12);
}

.ownerScope :global(.owner-offline-banner) {
  position: sticky;
  top: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--eh-warn-border);
  background: var(--eh-warn-bg);
  color: var(--eh-warn-text);
  font-size: 13px;
  line-height: 1.4;
}

.ownerScope :global(.owner-offline-banner svg) {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

.ownerScope :global(.owner-route-state) {
  width: min(100% - 32px, 720px);
  min-height: 70vh;
  margin: 0 auto;
  padding: 88px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.ownerScope :global(.owner-route-state h1) {
  max-width: 620px;
  margin: 10px 0 12px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 560;
}

.ownerScope :global(.owner-route-state p) {
  max-width: 580px;
  margin: 0 0 24px;
  color: var(--owner-muted);
  font-size: 16px;
  line-height: 1.65;
}

.ownerScope :global(.owner-state-kicker) {
  color: var(--owner-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 750;
  letter-spacing: 0.04em;
}

.ownerScope :global(.owner-state-icon) {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  border-radius: 14px;
  background: var(--owner-green-100);
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-state-action) {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border: 0;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-700);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.ownerScope :global(.owner-passport-empty) {
  min-height: 60vh;
}

.ownerScope :global(.owner-passport-empty > svg) {
  width: 42px;
  height: 42px;
  margin-bottom: 12px;
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-loading-state) {
  gap: 14px;
}

.ownerScope :global(.owner-skeleton) {
  position: relative;
  overflow: hidden;
  border-radius: var(--eh-shape-panel);
  background: #e9ece9;
}

.ownerScope :global(.owner-skeleton::after) {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
  animation: ownerShimmer 1.4s ease-in-out infinite;
}

.ownerScope :global(.owner-skeleton-title) {
  width: min(420px, 84%);
  height: 44px;
}

.ownerScope :global(.owner-skeleton-copy) {
  width: min(560px, 96%);
  height: 24px;
}

.ownerScope :global(.owner-skeleton-composer) {
  width: 100%;
  height: 160px;
  margin-top: 18px;
  border-radius: 22px;
}

.ownerScope :global(.owner-visually-hidden) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dashboard: house context + one dominant conversational action */
.ownerScope :global(.owner-dashboard) {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.ownerScope :global(.owner-dashboard-intro) {
  max-width: 760px;
}

.ownerScope :global(.owner-dashboard-intro h1) {
  margin: 0;
  font-size: clamp(38px, 5.4vw, 58px);
  line-height: 1.02;
  letter-spacing: -0.052em;
  font-weight: 540;
}

.ownerScope :global(.owner-dashboard-intro p) {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 12px 0 0;
  color: var(--owner-muted);
  font-size: 14px;
}

.ownerScope :global(.owner-dashboard-intro p svg) {
  width: 16px;
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-copilot) {
  padding: 24px;
  border: 1px solid var(--owner-border-strong);
  border-radius: 22px;
  background: var(--owner-surface);
  box-shadow: 0 8px 28px rgba(20, 48, 31, 0.045);
}

.ownerScope :global(.owner-copilot-copy) {
  max-width: 720px;
}

.ownerScope :global(.owner-copilot-copy > span),
.ownerScope :global(.owner-section-heading > div > span) {
  color: var(--owner-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ownerScope :global(.owner-copilot-copy h2) {
  margin: 7px 0 9px;
  font-size: clamp(25px, 3.5vw, 34px);
  line-height: 1.12;
  letter-spacing: -0.035em;
  font-weight: 560;
}

.ownerScope :global(.owner-copilot-copy p) {
  margin: 0;
  color: var(--owner-muted);
  font-size: 14px;
  line-height: 1.6;
}

.ownerScope :global(.owner-dashboard-composer) {
  margin-top: 20px;
}

.ownerScope :global(.owner-dashboard-composer .agent-composer) {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--owner-border-strong);
  border-radius: var(--eh-shape-panel);
  background: #fbfcfb;
  box-shadow: none;
}

.ownerScope :global(.owner-dashboard-composer .agent-composer textarea) {
  min-height: 92px;
  padding: 10px 8px 12px;
  background: transparent;
  font-size: 16px;
  line-height: 1.55;
}

.ownerScope :global(.owner-dashboard-composer .agent-actions) {
  padding-top: 10px;
  border-top: 1px solid var(--owner-border);
}

.ownerScope :global(.agent-composer .icon-action),
.ownerScope :global(.agent-composer .send-action) {
  min-height: 44px;
  min-width: 44px;
}

.ownerScope :global(.agent-composer .icon-action) {
  padding: 9px 11px;
  border-radius: var(--eh-shape-panel);
}

.ownerScope :global(.agent-composer .send-action) {
  border-radius: var(--eh-shape-panel);
  padding: 10px 14px;
}

.ownerScope :global(.owner-copilot-meta) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
}

.ownerScope :global(.owner-copilot-meta > span),
.ownerScope :global(.owner-copilot-meta a) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ownerScope :global(.owner-copilot-meta > span svg) {
  width: 15px;
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-copilot-meta > div) {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.ownerScope :global(.owner-copilot-meta a) {
  min-height: 44px;
  color: #4f5953;
  font-weight: 650;
}

.ownerScope :global(.owner-copilot-meta a svg) {
  width: 15px;
}

.ownerScope :global(.owner-next-section) {
  padding-top: 4px;
}

.ownerScope :global(.owner-section-heading) {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}

.ownerScope :global(.owner-section-heading h2) {
  margin: 5px 0 0;
  font-size: 23px;
  line-height: 1.2;
  letter-spacing: -0.025em;
  font-weight: 570;
}

.ownerScope :global(.owner-section-heading > a) {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: var(--owner-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 700;
}

.ownerScope :global(.owner-next-list) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.owner-next-row) {
  min-height: 82px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 22px;
  align-items: center;
  gap: 14px;
  padding: 16px 2px;
  border-bottom: 1px solid var(--owner-border);
}

.ownerScope :global(.owner-next-row:hover) {
  background: linear-gradient(90deg, transparent, rgba(234, 245, 238, 0.55), transparent);
}

.ownerScope :global(.owner-next-icon) {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-50);
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-next-icon svg) {
  width: 18px;
}

.ownerScope :global(.owner-next-copy) {
  min-width: 0;
}

.ownerScope :global(.owner-next-copy small),
.ownerScope :global(.owner-next-copy strong),
.ownerScope :global(.owner-next-copy > span) {
  display: block;
}

.ownerScope :global(.owner-next-copy small) {
  color: var(--owner-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 700;
}

.ownerScope :global(.owner-next-copy strong) {
  margin-top: 3px;
  font-size: 14px;
  font-weight: 650;
}

.ownerScope :global(.owner-next-copy > span) {
  margin-top: 3px;
  overflow: hidden;
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ownerScope :global(.owner-next-row > svg) {
  width: 18px;
  color: #9ba39e;
}

.ownerScope :global(.owner-calm-state) {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 0;
  border-top: 1px solid var(--owner-border-strong);
  border-bottom: 1px solid var(--owner-border);
}

.ownerScope :global(.owner-calm-state > svg) {
  width: 20px;
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-calm-state strong) {
  font-size: 14px;
  font-weight: 650;
}

.ownerScope :global(.owner-calm-state p) {
  margin: 4px 0 0;
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.5;
}

.ownerScope :global(.owner-house-link) {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 20px 0;
  border-top: 1px solid var(--owner-border);
}

.ownerScope :global(.owner-house-link > svg) {
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-house-link strong) {
  font-size: 14px;
}

.ownerScope :global(.owner-house-link p) {
  margin: 4px 0 0;
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.45;
}

.ownerScope :global(.owner-house-link > a) {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--owner-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 700;
}

.ownerScope :global(.owner-house-link > a svg) {
  width: 15px;
}

/* Hausmeister: light conversation canvas, explicit three-way choice */
.ownerScope :global(.housemaster-panel) {
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--owner-text);
}

.ownerScope :global(.housemaster-panel .housemaster-hero) {
  max-width: 740px;
  padding: 0 0 28px;
}

.ownerScope :global(.housemaster-panel .agent-online) {
  color: var(--owner-green-700);
}

.ownerScope :global(.housemaster-panel .agent-hero h1) {
  color: var(--owner-text);
  font-size: clamp(36px, 5vw, 52px);
}

.ownerScope :global(.housemaster-panel .agent-hero p) {
  color: var(--owner-muted);
  font-size: 15px;
  line-height: 1.65;
}

.ownerScope :global(.housemaster-panel .agent-chat) {
  min-height: 0;
  gap: 14px;
}

.ownerScope :global(.housemaster-panel .agent-message.assistant),
.ownerScope :global(.housemaster-panel .agent-message.event) {
  max-width: 78%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--owner-text);
}

.ownerScope :global(.housemaster-panel .agent-message.user) {
  max-width: 76%;
  padding: 11px 14px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-surface-subtle);
  color: var(--owner-text);
}

.ownerScope :global(.housemaster-panel .message-head),
.ownerScope :global(.housemaster-panel .agent-message.user .message-head) {
  color: #768079;
}

.ownerScope :global(.housemaster-panel .resolution-choice) {
  margin-top: 8px;
  padding-top: 22px;
  border-color: var(--owner-border);
}

.ownerScope :global(.housemaster-panel .resolution-copy span) {
  color: var(--owner-muted);
}

.ownerScope :global(.owner-resolution-actions) {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ownerScope :global(.housemaster-panel .resolution-button) {
  min-height: 112px;
  border-color: var(--owner-border-strong);
  border-radius: var(--eh-shape-panel);
  background: var(--owner-surface);
  color: var(--owner-text);
}

.ownerScope :global(.housemaster-panel .resolution-button:hover) {
  background: var(--owner-green-50);
}

.ownerScope :global(.housemaster-panel .resolution-button span small),
.ownerScope :global(.housemaster-panel .resolution-button > svg) {
  color: var(--owner-muted);
}

.ownerScope :global(.housemaster-panel .resolution-button.question-choice) {
  text-decoration: none;
}

.ownerScope :global(.housemaster-panel .resolution-button.primary-choice) {
  border-color: var(--owner-green-700);
  background: var(--owner-green-700);
  color: #fff;
}

.ownerScope :global(.housemaster-panel .resolution-button.primary-choice:hover) {
  background: var(--owner-green-600);
}

.ownerScope :global(.housemaster-panel .resolution-button.primary-choice span small),
.ownerScope :global(.housemaster-panel .resolution-button.primary-choice > svg) {
  color: #dcebe2;
}

.ownerScope :global(.housemaster-panel .route-progress) {
  background: var(--owner-green-50);
  border-color: #d7eadf;
}

.ownerScope :global(.housemaster-panel .route-progress > span) {
  background: #fff;
  color: var(--owner-green-700);
}

.ownerScope :global(.housemaster-panel .route-progress small) {
  color: var(--owner-muted);
}

.ownerScope :global(.owner-housemaster-composer) {
  margin-top: 4px;
  scroll-margin-top: 90px;
}

.ownerScope :global(.housemaster-panel .agent-composer) {
  margin-top: 8px;
  border: 1px solid var(--owner-border-strong);
  border-radius: 19px;
  background: var(--owner-surface);
  box-shadow: 0 5px 22px rgba(20, 48, 31, 0.045);
}

.ownerScope :global(.housemaster-panel .agent-composer textarea) {
  background: #fff;
  color: var(--owner-text);
}

.ownerScope :global(.housemaster-panel .agent-composer textarea::placeholder) {
  color: #7d8780;
}

.ownerScope :global(.housemaster-panel .icon-action) {
  color: #5f6963;
}

.ownerScope :global(.housemaster-panel .icon-action:hover) {
  background: var(--owner-surface-subtle);
}

.ownerScope :global(.housemaster-panel .send-action) {
  background: var(--owner-green-700);
  color: #fff;
}

.ownerScope :global(.housemaster-panel .trust-strip span) {
  color: var(--owner-muted);
}

.ownerScope :global(.housemaster-panel .trust-strip svg) {
  color: var(--owner-green-700);
}

/* Flat, readable entity lists across jobs, calendar, contacts and documents */
.ownerScope :global(.jobs-head h1),
.ownerScope :global(.house-screen-head h1),
.ownerScope :global(.year-head h1),
.ownerScope :global(.page-title),
.ownerScope :global(.plans-hero h1) {
  font-size: clamp(30px, 4vw, 40px);
  letter-spacing: -0.038em;
  font-weight: 560;
}

.ownerScope :global(.jobs-head p),
.ownerScope :global(.house-screen-head p),
.ownerScope :global(.year-head p),
.ownerScope :global(.page-subtitle),
.ownerScope :global(.plans-hero p) {
  color: var(--owner-muted);
  font-size: 14px;
  line-height: 1.55;
}

.ownerScope :global(.segmented-tabs) {
  gap: 20px;
  margin-bottom: 24px;
  border-color: var(--owner-border);
}

.ownerScope :global(.segmented-tabs a) {
  min-height: 44px;
  padding: 11px 2px 12px;
  color: #5e6862;
  font-size: var(--eh-font-meta);
}

.ownerScope :global(.segmented-tabs a.active) {
  color: var(--owner-green-700);
}

.ownerScope :global(.segmented-tabs a.active::after) {
  background: var(--owner-green-700);
}

.ownerScope :global(.mobile-job-list),
.ownerScope :global(.stack),
.ownerScope :global(.contact-list),
.ownerScope :global(.review-list) {
  gap: 0;
}

.ownerScope :global(.mobile-job-list) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.mobile-job-card) {
  padding: 18px 2px;
  border: 0;
  border-bottom: 1px solid var(--owner-border);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.ownerScope :global(.mobile-job-card > strong) {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 650;
}

.ownerScope :global(.mobile-job-meta span),
.ownerScope :global(.mobile-job-foot small) {
  font-size: var(--eh-font-meta);
}

.ownerScope :global(.mobile-job-foot) {
  margin-top: 12px;
  padding-top: 12px;
}

.ownerScope :global(.job-type-icon) {
  width: 40px;
  height: 40px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-50);
  color: var(--owner-green-700);
}

.ownerScope :global(.status) {
  padding: 5px 8px;
  font-size: var(--eh-font-meta);
  font-weight: 700;
}

.ownerScope :global(.detail-head) {
  padding-bottom: 22px;
  border-bottom: 1px solid var(--owner-border);
}

.ownerScope :global(.detail-head h1) {
  margin: 12px 0 8px;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 560;
}

.ownerScope :global(.detail-head > p) {
  max-width: 720px;
  color: var(--owner-muted);
  font-size: 14px;
  line-height: 1.65;
}

.ownerScope :global(.ai-summary),
.ownerScope :global(.secure-card),
.ownerScope :global(.relationship-note),
.ownerScope :global(.contact-request-note),
.ownerScope :global(.contact-to-service) {
  border-color: var(--owner-border);
  border-radius: 14px;
  background: var(--owner-green-50);
}

.ownerScope :global(.quote) {
  margin: 0;
  padding: 18px 0;
  border: 0;
  border-bottom: 1px solid var(--owner-border);
  border-radius: 0;
  background: transparent;
}

.ownerScope :global(.quote:first-child) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.quote.accepted) {
  padding-inline: 16px;
  border: 1px solid var(--eh-success-border);
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-50);
  box-shadow: none;
}

.ownerScope :global(.quote-top strong) {
  font-size: 15px;
}

.ownerScope :global(.quote-top b) {
  color: var(--owner-green-700);
  font-size: 20px;
}

.ownerScope :global(.quote > p) {
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.55;
}

.ownerScope :global(.recommend) {
  border-color: #dcebec;
  background: var(--owner-green-50);
  color: var(--owner-green-700);
}

.ownerScope :global(.appointment),
.ownerScope :global(.document-row),
.ownerScope :global(.contact-row) {
  min-height: 70px;
  padding: 15px 2px;
  border: 0;
  border-bottom: 1px solid var(--owner-border);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.ownerScope :global(.stack > .appointment:first-child),
.ownerScope :global(.stack > .document-row:first-child),
.ownerScope :global(.contact-list > .contact-row:first-child) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.appointment strong),
.ownerScope :global(.document-row strong),
.ownerScope :global(.contact-row strong) {
  font-size: 13px;
}

.ownerScope :global(.appointment p),
.ownerScope :global(.appointment small),
.ownerScope :global(.document-row small),
.ownerScope :global(.contact-row small),
.ownerScope :global(.contact-row p) {
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
}

.ownerScope :global(.contact-row.selected) {
  margin-inline: -10px;
  padding-inline: 10px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-50);
  box-shadow: none;
}

.ownerScope :global(.contact-category-groups) {
  display: grid;
  gap: 28px;
}

.ownerScope :global(.contact-category-group) {
  min-width: 0;
}

.ownerScope :global(.chat) {
  padding: 16px;
  border: 1px solid var(--owner-border);
  border-radius: 17px;
  background: #fafbfa;
}

.ownerScope :global(.msg) {
  padding: 10px 12px;
  border: 1px solid var(--owner-border);
  background: #fff;
}

.ownerScope :global(.msg.mine) {
  border-color: #dcebec;
  background: var(--owner-green-100);
}

.ownerScope :global(.chat-form input) {
  min-height: 48px;
}

.ownerScope :global(.chat-form button) {
  width: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-700);
}

/* Hausakte and year: durable record, not dashboard tiles */
.ownerScope :global(.house-cover-card) {
  min-height: 168px;
  display: flex;
  align-items: flex-end;
  padding: 22px;
  border: 1px solid #dce9df;
  border-radius: var(--eh-shape-panel);
  background: linear-gradient(135deg, #f8fbf9, #edf6f0);
  color: var(--owner-text);
}

.ownerScope :global(.house-cover-card::after),
.ownerScope :global(.house-roof-line) {
  display: none;
}

.ownerScope :global(.house-cover-art) {
  position: static;
  width: 56px;
  height: 56px;
  flex: 0 0 auto;
  margin-right: 14px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: #fff;
}

.ownerScope :global(.house-cover-art > svg) {
  width: 28px;
  height: 28px;
  color: var(--owner-green-700);
  filter: none;
}

.ownerScope :global(.house-cover-copy) {
  position: static;
  z-index: 1;
  color: var(--owner-text);
}

.ownerScope :global(.house-cover-copy small) {
  color: var(--owner-green-700);
  opacity: 1;
}

.ownerScope :global(.house-cover-copy strong) {
  font-size: 19px;
}

.ownerScope :global(.house-cover-copy span) {
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  opacity: 1;
}

.ownerScope :global(.house-menu),
.ownerScope :global(.settings-list),
.ownerScope :global(.more-menu) {
  overflow: visible;
  border: 0;
  border-top: 1px solid var(--owner-border-strong);
  border-radius: 0;
  background: transparent;
}

.ownerScope :global(.house-menu > a),
.ownerScope :global(.house-menu > details > summary),
.ownerScope :global(.house-menu-disabled),
.ownerScope :global(.settings-list > a),
.ownerScope :global(.settings-list > div),
.ownerScope :global(.settings-list > details > summary),
.ownerScope :global(.more-menu > a) {
  min-height: 68px;
  padding: 13px 2px;
  border-bottom: 1px solid var(--owner-border);
}

.ownerScope :global(.house-menu > a + a),
.ownerScope :global(.house-menu > details + *),
.ownerScope :global(.house-menu-disabled),
.ownerScope :global(.settings-list > a + *),
.ownerScope :global(.settings-list > div + *),
.ownerScope :global(.settings-list > details + *) {
  border-top: 0;
}

.ownerScope :global(.house-menu-icon),
.ownerScope :global(.settings-list span:first-child),
.ownerScope :global(.more-icon) {
  width: 38px;
  height: 38px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-50);
  color: var(--owner-green-700);
}

.ownerScope :global(.house-menu strong),
.ownerScope :global(.settings-list strong),
.ownerScope :global(.more-menu strong) {
  font-size: 13px;
}

.ownerScope :global(.house-menu small),
.ownerScope :global(.settings-list small),
.ownerScope :global(.more-menu small) {
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.4;
}

.ownerScope :global(.house-inline-form),
.ownerScope :global(.settings-form) {
  margin: 10px 0 20px;
  padding: 18px;
  border: 1px solid var(--owner-border);
  border-radius: 14px;
  background: #fff;
}

.ownerScope :global(.year-preview-card) {
  margin-top: 22px;
  padding: 17px 0;
  border: 0;
  border-top: 1px solid var(--owner-border);
  border-bottom: 1px solid var(--owner-border);
  border-radius: 0;
  background: transparent;
}

.ownerScope :global(.year-timeline) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.year-row) {
  min-height: 82px;
}

.ownerScope :global(.year-item) {
  min-height: 74px;
}

.ownerScope :global(.year-item strong) {
  font-size: 13px;
}

.ownerScope :global(.year-item small) {
  font-size: var(--eh-font-meta);
}

.ownerScope :global(.asset-grid article),
.ownerScope :global(.maintenance-row) {
  padding: 15px 0;
  border: 0;
  border-bottom: 1px solid var(--owner-border);
  border-radius: 0;
  background: transparent;
}

.ownerScope :global(.asset-grid article:first-child),
.ownerScope :global(.maintenance-row:first-child) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.asset-form),
.ownerScope :global(.history-form),
.ownerScope :global(.valuation-form),
.ownerScope :global(.consultation-form),
.ownerScope :global(.emergency-form),
.ownerScope :global(.claim-form),
.ownerScope :global(.review-card) {
  gap: 14px;
  padding: 20px;
  border: 1px solid var(--owner-border);
  border-radius: var(--eh-shape-panel);
  background: #fff;
}

.ownerScope :global(.asset-form) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ownerScope :global(.asset-form label) {
  min-width: 0;
  display: grid;
  gap: 7px;
  color: var(--owner-text);
  font-size: var(--eh-font-meta);
  font-weight: 650;
}

.ownerScope :global(.asset-form label > span) {
  padding-inline: 2px;
}

.ownerScope :global(.asset-form label small) {
  color: var(--owner-muted);
  font-weight: 500;
}

.ownerScope :global(.asset-form .btn) {
  align-self: end;
}

.ownerScope :global(.house-history-list) {
  border-top: 1px solid var(--owner-border-strong);
}

.ownerScope :global(.house-history-list > article) {
  padding: 22px 0;
  border-bottom: 1px solid var(--owner-border);
}

/* Consultation and emergency: clear utility states, no alarmist visual wall */
.ownerScope :global(.consultation-hero),
.ownerScope :global(.emergency-hero),
.ownerScope :global(.history-hero),
.ownerScope :global(.sale-hero),
.ownerScope :global(.plans-hero) {
  padding: 0 0 26px;
  border: 0;
  border-bottom: 1px solid var(--owner-border);
  border-radius: 0;
  background: transparent;
  color: var(--owner-text);
}

.ownerScope :global(.consultation-hero > svg),
.ownerScope :global(.history-hero > svg),
.ownerScope :global(.sale-hero > svg) {
  color: var(--owner-green-700);
}

.ownerScope :global(.emergency-hero > svg) {
  color: #a33b2b;
}

.ownerScope :global(.consultation-hero h1),
.ownerScope :global(.emergency-hero h1),
.ownerScope :global(.history-hero h1),
.ownerScope :global(.sale-hero h1) {
  margin: 4px 0 8px;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  font-weight: 560;
}

.ownerScope :global(.consultation-hero p),
.ownerScope :global(.emergency-hero p),
.ownerScope :global(.history-hero p),
.ownerScope :global(.sale-hero p) {
  max-width: 720px;
  color: var(--owner-muted);
  font-size: 14px;
  line-height: 1.6;
}

.ownerScope :global(.consultation-points),
.ownerScope :global(.emergency-trust) {
  margin: 18px 0 24px;
  border-top: 1px solid var(--owner-border);
  border-bottom: 1px solid var(--owner-border);
}

.ownerScope :global(.consultation-points > span),
.ownerScope :global(.emergency-trust > span) {
  min-height: 54px;
  border: 0;
  background: transparent;
}

.ownerScope :global(.emergency-button) {
  min-height: 48px;
  border: 0;
  border-radius: var(--eh-shape-panel);
  background: #9b3d2f;
  color: #fff;
}

.ownerScope :global(.emergency-disclaimer) {
  color: var(--owner-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.55;
}

/* Plans and profile: calm comparisons and settings */
.ownerScope :global(.plan-grid) {
  gap: 10px;
}

.ownerScope :global(.plan-card),
.ownerScope :global(.package-card) {
  border-color: var(--owner-border);
  border-radius: var(--eh-shape-panel);
  box-shadow: none;
}

.ownerScope :global(.plan-card.featured) {
  border-color: #9fcfd2;
  box-shadow: none;
}

.ownerScope :global(.plan-price) {
  color: var(--owner-green-700);
}

.ownerScope :global(.profile-identity) {
  padding-bottom: 26px;
  border-color: var(--owner-border);
}

.ownerScope :global(.profile-avatar-large) {
  background: var(--owner-green-100);
  color: var(--owner-green-900);
}

.ownerScope :global(.profile-trust),
.ownerScope :global(.whatsapp-card),
.ownerScope :global(.more-support),
.ownerScope :global(.privacy-banner),
.ownerScope :global(.privacy-rules) {
  border-color: var(--owner-border);
  border-radius: 14px;
  background: var(--owner-green-50);
}

/* Invoice, receipt and passport remain printable but feel part of the same product */
.ownerScope :global(.invoice-page),
.ownerScope :global(.receipt-page),
.ownerScope :global(.passport-page) {
  min-height: 100vh;
  padding: 36px 20px 72px;
  background: var(--owner-bg);
}

.ownerScope :global(.invoice-page-tools) {
  width: min(100%, 820px);
  margin: 0 auto 18px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ownerScope :global(.receipt),
.ownerScope :global(.house-passport) {
  max-width: 820px;
  border: 1px solid var(--owner-border);
  border-radius: var(--eh-shape-panel);
  background: #fff;
  box-shadow: none;
}

.ownerScope :global(.empty) {
  min-height: 150px;
  justify-content: center;
  padding: 30px 22px;
  border: 1px dashed var(--owner-border-strong);
  border-radius: var(--eh-shape-panel);
  background: #fafbfa;
  color: var(--owner-muted);
}

.ownerScope :global(.empty strong) {
  color: var(--owner-text);
  font-size: 14px;
}

.ownerScope :global(.empty p) {
  max-width: 520px;
  margin-top: 6px;
  font-size: var(--eh-font-meta);
  line-height: 1.5;
}

.ownerScope :global(.empty svg) {
  color: var(--owner-green-700);
}

.ownerScope :global(.owner-empty-action) {
  align-items: flex-start;
}

.ownerScope :global(.owner-empty-action .btn) {
  width: auto;
  min-height: 44px;
  margin-top: 8px;
}

.ownerScope :global(.chat-form) {
  min-width: 0;
}

.ownerScope :global(.chat-form input) {
  min-width: 0;
}

.ownerScope :global(.claim-form label) {
  display: grid;
  gap: 7px;
  color: var(--owner-text);
  font-size: 13px;
  font-weight: 650;
}

.ownerScope :global(.alert) {
  min-height: 46px;
  border-radius: var(--eh-shape-panel);
  font-size: 13px;
}

@keyframes ownerShimmer {
  to { transform: translateX(100%); }
}

@media (max-width: 920px) {
  .ownerScope :global(.app-shell-v3 .workspace-shell) {
    grid-template-columns: 196px minmax(0, 1fr);
  }

  .ownerScope :global(.app-shell-v3 .screen-v3) {
    padding-inline: 28px;
  }

  .ownerScope :global(.owner-resolution-actions) {
    grid-template-columns: 1fr;
  }

  .ownerScope :global(.housemaster-panel .resolution-button) {
    min-height: 82px;
  }
}

@media (max-width: 720px) {
  .ownerScope :global(.app-shell-v3 .workspace-shell) {
    display: block;
  }

  .ownerScope :global(.app-shell-v3 .topbar-v3) {
    height: calc(58px + env(safe-area-inset-top));
    padding: env(safe-area-inset-top) 14px 0;
    border-bottom: 1px solid var(--owner-border);
    background: rgba(247, 248, 247, 0.96);
  }

  .ownerScope :global(.app-shell-v3 .screen-v3) {
    width: 100%;
    max-width: none;
    min-height: calc(100dvh - 58px);
    padding: 30px 18px calc(94px + env(safe-area-inset-bottom));
  }

  .ownerScope :global(.app-shell-v3 .bottom-nav) {
    height: calc(68px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    border-color: var(--owner-border);
    background: rgba(255, 255, 255, 0.97);
  }

  .ownerScope :global(.app-shell-v3 .bottom-nav a) {
    min-height: 60px;
    padding: 6px 2px 3px;
    color: #707a73;
    font-size: var(--eh-font-meta);
  }

  .ownerScope :global(.app-shell-v3 .bottom-nav a.active) {
    color: var(--owner-green-700);
  }

  .ownerScope :global(main:has(.housemaster-panel) .screen-v3) {
    min-height: calc(100dvh - 58px);
    padding: 28px 18px calc(94px + env(safe-area-inset-bottom));
    background: var(--owner-bg);
  }

  .ownerScope :global(main:has(.housemaster-panel) .topbar-v3) {
    border-bottom: 1px solid var(--owner-border);
    background: rgba(247, 248, 247, 0.96);
    color: var(--owner-text);
  }

  .ownerScope :global(main:has(.housemaster-panel) .top-actions > a),
  .ownerScope :global(main:has(.housemaster-panel) .mobile-brand .brand) {
    color: var(--owner-text);
  }

  .ownerScope :global(main:has(.housemaster-panel) .top-user-avatar) {
    background: var(--owner-surface-subtle);
    color: var(--owner-text);
  }

  .ownerScope :global(main:has(.housemaster-panel) .bottom-nav) {
    border-color: var(--owner-border);
    background: rgba(255, 255, 255, 0.97);
  }

  .ownerScope :global(main:has(.housemaster-panel) .bottom-nav a) {
    color: #707a73;
  }

  .ownerScope :global(main:has(.housemaster-panel) .bottom-nav a.active) {
    color: var(--owner-green-700);
  }

  .ownerScope :global(.housemaster-panel) {
    min-height: 0;
    padding: 0;
  }

  .ownerScope :global(.housemaster-panel .agent-chat) {
    min-height: 0;
  }

  .ownerScope :global(.housemaster-panel .agent-message.assistant),
  .ownerScope :global(.housemaster-panel .agent-message.event),
  .ownerScope :global(.housemaster-panel .agent-message.user) {
    max-width: 92%;
  }

  .ownerScope :global(.owner-dashboard) {
    gap: 32px;
  }

  .ownerScope :global(.owner-dashboard-intro h1) {
    font-size: 38px;
  }

  .ownerScope :global(.owner-copilot) {
    padding: 18px;
    border-radius: var(--eh-shape-panel);
  }

  .ownerScope :global(.owner-copilot-copy h2) {
    font-size: 27px;
  }

  .ownerScope :global(.owner-copilot-meta) {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .ownerScope :global(.owner-copilot-meta > div) {
    width: 100%;
    gap: 2px;
    flex-direction: column;
  }

  .ownerScope :global(.owner-copilot-meta a) {
    width: 100%;
  }

  .ownerScope :global(.owner-house-link) {
    grid-template-columns: 32px minmax(0, 1fr);
  }

  .ownerScope :global(.owner-house-link > a) {
    grid-column: 2;
    justify-self: start;
  }

  .ownerScope :global(.owner-empty-action .btn) {
    width: 100%;
    justify-content: center;
  }

  .ownerScope :global(.asset-form) {
    grid-template-columns: 1fr;
  }

  .ownerScope :global(.asset-form .btn) {
    width: 100%;
    justify-content: center;
  }

  .ownerScope :global(.consultation-points),
  .ownerScope :global(.emergency-trust) {
    display: flex;
    flex-direction: column;
  }

  .ownerScope :global(.plan-grid) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .ownerScope :global(.app-shell-v3 .screen-v3) {
    padding-inline: 16px;
  }

  .ownerScope :global(.owner-copilot) {
    margin-inline: -2px;
    padding: 16px;
  }

  .ownerScope :global(.owner-dashboard-composer .agent-actions),
  .ownerScope :global(.housemaster-panel .agent-actions) {
    gap: 4px;
  }

  .ownerScope :global(.agent-composer .icon-action) {
    padding-inline: 9px;
  }

  .ownerScope :global(.agent-composer .icon-action span) {
    display: none;
  }

  .ownerScope :global(.agent-composer .send-action span) {
    display: inline;
  }

  .ownerScope :global(.owner-next-row) {
    grid-template-columns: 40px minmax(0, 1fr) 18px;
    gap: 11px;
  }

  .ownerScope :global(.owner-next-copy > span) {
    white-space: normal;
  }

  .ownerScope :global(.house-cover-card) {
    min-height: 150px;
    padding: 18px;
  }

  .ownerScope :global(.house-cover-art) {
    width: 48px;
    height: 48px;
  }

  .ownerScope :global(.invoice-page),
  .ownerScope :global(.receipt-page),
  .ownerScope :global(.passport-page) {
    padding-inline: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skipLink,
  .ownerScope :global(*) {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media print {
  .skipLink,
  .ownerScope :global(.owner-offline-banner) {
    display: none !important;
  }
}


/* Notion-aligned owner shell: menu state is explicit, compact when closed. */
.ownerScope :global(.app-shell-v3 .workspace-shell) {
  grid-template-columns: 72px minmax(0, 1fr);
}
.ownerScope :global(.app-shell-v3 .workspace-shell:has(.app-menu[open])) {
  grid-template-columns: 236px minmax(0, 1fr);
}
.ownerScope :global(.app-shell-v3 .desktop-sidebar) {
  padding: 14px 10px;
}
.ownerScope :global(.app-shell-v3 .app-menu summary) {
  min-height: 44px;
  border-radius: var(--eh-shape-panel);
}
.ownerScope :global(.app-shell-v3 .app-menu[open] .sidebar-nav a) {
  min-height: 44px;
}
.ownerScope :global(.app-shell-v3 .app-menu:not([open]) .sidebar-nav a) {
  justify-content: center;
  padding-inline: 4px;
}
.ownerScope :global(.app-shell-v3 .app-menu:not([open]) .sidebar-nav a > span:not(.sidebar-icon)) {
  display: none;
}
.ownerScope :global(.app-shell-v3 .app-menu:not([open]) .sidebar-brand),
.ownerScope :global(.app-shell-v3 .app-menu:not([open]) .sidebar-footer) {
  display: none;
}
.ownerScope :global(.app-shell-v3 .owner-dashboard) {
  gap: 44px;
}
.ownerScope :global(.app-shell-v3 .owner-copilot) {
  border-radius: var(--eh-shape-panel);
  box-shadow: 0 12px 36px rgba(18, 60, 42, 0.06);
}
.ownerScope :global(.app-shell-v3 .owner-dashboard-composer .agent-composer textarea) {
  min-height: 96px;
}
@media (max-width: 720px) {
  .ownerScope :global(.app-shell-v3 .workspace-shell) {
    grid-template-columns: 1fr;
  }
  .ownerScope :global(.app-shell-v3 .topbar-v3) {
    padding-inline: 12px;
  }
}

/* Jobs: quiet comparison surfaces and an easy-to-scan status journey. */
.ownerScope :global(.mobile-job-list) {
  display: grid;
  gap: 12px;
  border-top: 0;
}
.ownerScope :global(.mobile-job-card) {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--owner-border);
  border-radius: var(--eh-shape-panel);
  background: var(--owner-surface);
  box-shadow: 0 8px 24px rgba(18, 60, 42, 0.04);
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}
.ownerScope :global(.mobile-job-card:hover) {
  border-color: var(--eh-success-border);
  box-shadow: 0 12px 30px rgba(18, 60, 42, 0.08);
  transform: translateY(-1px);
}
.ownerScope :global(.detail-head) {
  padding: 24px;
  border: 1px solid var(--owner-border);
  border-radius: var(--eh-shape-panel);
  background: var(--owner-surface);
}
.ownerScope :global(.detail-head + .ai-summary) {
  margin-top: 16px;
}
@media (max-width: 520px) {
  .ownerScope :global(.mobile-job-card) { padding: 16px; border-radius: var(--eh-shape-panel); }
  .ownerScope :global(.detail-head) { padding: 20px 16px; border-radius: var(--eh-shape-panel); }
}

/* Mein Haus: a durable house record, grouped by human concepts. */
.ownerScope :global(.house-cover-card) {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px;
  border: 1px solid var(--owner-border);
  border-radius: 22px;
  background: var(--owner-surface);
  box-shadow: 0 10px 30px rgba(18, 60, 42, 0.05);
}
.ownerScope :global(.house-cover-art) {
  flex: 0 0 auto;
  width: 58px;
  height: 58px;
  border-radius: var(--eh-shape-panel);
  background: var(--owner-green-100);
  color: var(--owner-green-700);
}
.ownerScope :global(.house-cover-copy) { min-width: 0; display: grid; gap: 4px; }
.ownerScope :global(.house-cover-copy small) { color: var(--owner-green-700); font-size: var(--eh-font-meta); font-weight: 750; text-transform: uppercase; letter-spacing: .05em; }
.ownerScope :global(.house-cover-copy strong) { overflow: hidden; font-size: 16px; text-overflow: ellipsis; white-space: nowrap; }
.ownerScope :global(.house-menu > a:hover),
.ownerScope :global(.house-menu > details > summary:hover) { background: var(--owner-green-50); border-radius: var(--eh-shape-panel); }
.ownerScope :global(.year-preview-card) { border-radius: var(--eh-shape-panel); padding-inline: 16px; background: var(--owner-green-50); border: 1px solid var(--owner-border); }
.ownerScope :global(.asset-grid article),
.ownerScope :global(.maintenance-row) { min-height: 70px; }
@media (max-width: 520px) {
  .ownerScope :global(.house-cover-card) { padding: 18px; border-radius: var(--eh-shape-panel); }
  .ownerScope :global(.house-cover-art) { width: 50px; height: 50px; border-radius: 14px; }
}

/* Dashboard-Begrüßung (DESIGN.md §6): aligning mit qa-row-Raster. */
.ownerScope :global(.own-dash .owner-dashboard-intro) {
  padding: 22px 18px 0;
}
@media (max-width: 390px) {
  .ownerScope :global(.own-dash .owner-dashboard-intro) {
    padding: 18px 14px 0;
  }
}

/* T-0210 premium app convergence: same structure, richer surface hierarchy. */
.ownerScope :global(.app-shell-v3 .screen-v3:has(.own-dash)) {
  background:
    radial-gradient(circle at 84% 6%, rgba(214, 235, 225, 0.5), transparent 28%),
    var(--owner-bg);
}
.ownerScope :global(.own-dash .qa-card) {
  border: 1px solid rgba(14, 61, 51, 0.08);
  box-shadow: 0 16px 42px rgba(14, 61, 51, 0.08);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
.ownerScope :global(.own-dash .qa-card:first-child) {
  border-color: rgba(14, 61, 51, 0.16);
  box-shadow: 0 20px 48px rgba(14, 61, 51, 0.11);
}
.ownerScope :global(.own-dash .ki-card) {
  border: 1px solid #d3e6dd;
  background:
    radial-gradient(circle at 90% 0%, rgba(255, 255, 255, 0.86), transparent 34%),
    linear-gradient(135deg, #e7f1ec 0%, #edf4f0 100%);
  box-shadow: 0 22px 56px rgba(14, 61, 51, 0.09);
}
.ownerScope :global(.own-dash .ov-card) {
  border: 1px solid rgba(14, 61, 51, 0.08);
  box-shadow: 0 12px 34px rgba(14, 61, 51, 0.07);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}
.ownerScope :global(.own-dash .own-section-title) {
  letter-spacing: -0.025em;
}
@media (hover: hover) {
  .ownerScope :global(.own-dash .qa-card:hover),
  .ownerScope :global(.own-dash .ov-card:hover) {
    border-color: rgba(16, 82, 88, 0.24);
    box-shadow: 0 24px 54px rgba(14, 61, 51, 0.12);
    transform: translateY(-3px);
  }
}
@media (max-width: 720px) {
  .ownerScope :global(.app-shell-v3 .screen-v3:has(.own-dash)) {
    background:
      linear-gradient(180deg, rgba(237, 245, 241, 0.72) 0, transparent 190px),
      var(--owner-bg);
  }
  .ownerScope :global(.own-dash .qa-card) {
    box-shadow: 0 10px 26px rgba(14, 61, 51, 0.07);
  }
  .ownerScope :global(.own-dash .ki-card) {
    box-shadow: 0 16px 38px rgba(14, 61, 51, 0.08);
  }
  .ownerScope :global(.own-dash .ov-card) {
    box-shadow: 0 8px 24px rgba(14, 61, 51, 0.06);
  }
}
@media (prefers-reduced-motion: reduce) {
  .ownerScope :global(.own-dash .qa-card),
  .ownerScope :global(.own-dash .ov-card) {
    transition: none;
  }
}

/* Accepted Atelier 02: shared, readable functional controls. */
.ownerScope :global(input), .ownerScope :global(textarea), .ownerScope :global(select) { font-size: var(--eh-font-input); border-radius: var(--eh-shape-control); }

`````

## src/app/design-system/page.tsx

`````tsx
import type {Metadata} from "next";
import {EHScope} from "@/design-system";
import {DesignShowcase} from "./showcase";
export const metadata: Metadata = {title: "Einfachhausen · Designsystem 1.0", robots: {index:false,follow:false}};
export default function DesignSystemPage() {return <EHScope><DesignShowcase/></EHScope>;}

`````

## src/app/design-system/showcase.tsx

`````tsx
"use client";
import {useState} from "react";
import {EHScope,EHSection,EHLogo,EHHeading,EHText,EHButton,EHActions,EHTabs,EHField,EHInput,EHTextarea,EHSelect,EHCheckbox,EHDialog,EHStatus,EHLoadingState,EHErrorState,EHEmptyState,EHFAQ,EHComparison,EHFacts,EHCallout,EHPanel} from "@/design-system";
import {EHHomePage,EHServicePage,EHArticlePage,EHServiceIndexPage,EHContactPage,EHPricingPage,EHOwnerPage,EHProviderPage} from "../../../packages/eh-design/src/recipes";
const image={src:"/images/marketing/family-home.jpg",alt:"Ein Paar vor einem Haus im Garten",caption:"Illustrative Bildwelt – kein Kundenbeispiel."};
const faq=[{q:"Wird durch meine Anfrage bereits etwas beauftragt?",a:"Nein. Eine Beauftragung erfolgt erst nach deiner ausdrücklichen Entscheidung."},{q:"Kann ich bestehende Unterlagen weiter nutzen?",a:"Deine Dokumente bleiben die Grundlage. Die Hausakte hilft, sie gemeinsam zu ordnen."}];
const services=[{title:"Heizung & Wärme",href:"#service",text:"Wartung, Reparatur und die richtigen Fragen für dein Zuhause."},{title:"Dach & Fassade",href:"#service",text:"Die Gebäudehülle im Blick behalten."},{title:"Garten & Außenbereich",href:"#service",text:"Anstehende Arbeiten verständlich einordnen."}];
export function DesignShowcase() {
  const [view,setView]=useState("home");const [receipt,setReceipt]=useState("");const [dialog,setDialog]=useState(false);
  const views=[["home","Startseite"],["service","Leistung"],["article","Ratgeber"],["index","Leistungsübersicht"],["contact","Kontakt"],["pricing","Leistungsumfang"],["owner","Owner-App"],["provider","Handwerker-App"],["components","Bausteine"]];
  const go=(id:string)=>{setView(id);window.scrollTo({top:0});};
  const form=<form onSubmit={e=>{e.preventDefault();setReceipt("Vorschau: Formular geprüft. Es wurde nichts versendet.");}}><EHField id="contact-name" label="Dein Name" required><EHInput id="contact-name" name="name" autoComplete="name" required/></EHField><EHField id="contact-email" label="Deine E-Mail-Adresse" required><EHInput id="contact-email" name="email" type="email" autoComplete="email" required/></EHField><EHField id="contact-message" label="Dein Anliegen" required><EHTextarea id="contact-message" name="message" required/></EHField><EHCheckbox label="Ich habe den Vorschauhinweis gelesen." required/><EHButton type="submit" arrow>Formular prüfen</EHButton>{receipt && <EHText>{receipt}</EHText>}</form>;
  return <EHScope><EHSection compact><EHActions><EHLogo/><div><EHHeading as="h2" scale="item">Die Einfachhausen Bibliothek.</EHHeading><EHText size="meta">Verbindlicher Stil · Atelier 02 · Version 1.0 · Inhalte dieser Ansicht sind gekennzeichnete Beispiele.</EHText></div></EHActions><EHActions>{views.map(([id,label])=><EHButton key={id} variant={view===id ? "primary":"secondary"} size="small" onClick={()=>go(id)}>{label}</EHButton>)}</EHActions></EHSection><main id="design-preview">
  {view==="home" && <EHHomePage image={image} accountHref="/hausakte" contactHref="/kontakt"/>}
  {view==="service" && <EHServicePage title="Damit Wärme einfach bleibt." description="Wenn die Heizung Fragen aufwirft, hilft ein klarer Überblick: Was ist bekannt, was steht an und wer kann weiterhelfen?" image={image} benefits={[{title:"Verständlich.",text:"Dein Anliegen in deinen Worten."},{title:"Nachvollziehbar.",text:"Unterlagen und Vereinbarungen zusammenhalten."},{title:"Mit Entscheidung.",text:"Du bestimmst, was beauftragt wird."}]} scope={[{title:"Wartung vorbereiten",text:"Vorhandene Unterlagen und den aktuellen Zustand zusammenstellen."},{title:"Fragen klären",text:"Bedarf und Zuständigkeit mit einem passenden Ansprechpartner besprechen."},{title:"Wissen bewahren",text:"Erledigte Arbeiten in der Hausakte dokumentieren."}]} steps={[{title:"Anliegen beschreiben",text:"Was fällt dir auf? Was möchtest du klären?"},{title:"Nächsten Schritt abstimmen",text:"Umfang und Ansprechpartner gemeinsam einordnen."},{title:"Selbst entscheiden",text:"Vereinbarungen prüfen, bevor etwas beauftragt wird."}]} faq={faq} contactHref="/kontakt"/>}
  {view==="article" && <EHArticlePage category="Hauswissen · Musterartikel" title="Ein guter Überblick beginnt mit drei Unterlagen." description="Wie du die Geschichte deines Hauses Stück für Stück zusammenbringst." readingTime="3 Minuten Lesezeit" contents={[{id:"documents",title:"Vorhandenes sammeln"},{id:"order",title:"Zusammenhänge erhalten"},{id:"next",title:"Den nächsten Schritt festhalten"}]} related={services}><h2 id="documents">Vorhandenes sammeln.</h2><p>Beginne mit dem, was du schon hast: Rechnungen, Bedienungsanleitungen und Dokumentation zu ausgeführten Arbeiten. Vollständigkeit entsteht mit der Zeit.</p><h2 id="order">Zusammenhänge erhalten.</h2><p>Ein Datum, der betroffene Bereich und die beteiligten Menschen machen aus einzelnen Dateien eine nachvollziehbare Geschichte.</p><EHCallout title="Ein hilfreicher Anfang">Ordne eine Rechnung direkt der Arbeit zu, für die sie ausgestellt wurde. So bleibt der Zusammenhang später verständlich.</EHCallout><h2 id="next">Den nächsten Schritt festhalten.</h2><p>Notiere offene Fragen und anstehende Termine. Du musst nicht jede Antwort sofort kennen, um einen guten Überblick zu gewinnen.</p></EHArticlePage>}
  {view==="index" && <EHServiceIndexPage title="Was steht bei deinem Haus an?" text="Jedes Haus hat seine Themen. Hier beginnt der passende nächste Schritt." items={services} contactHref="/kontakt"/>}
  {view==="contact" && <EHContactPage text="Beschreibe, was dich beschäftigt. Gemeinsam wird der nächste Schritt klar." image={{src:"/images/marketing/partner-doorstep.jpg",alt:"Zwei Menschen im Gespräch an einer Haustür",caption:"Illustrative Bildwelt – keine Mitarbeitervorstellung."}} form={form} contactDetails={<EHText size="meta">Dies ist eine Formularvorschau. Es wird keine Nachricht versendet.</EHText>}/>}
  {view==="pricing" && <EHPricingPage title="Der passende Umfang für dein Haus." text="Gestaltungsbeispiel für Leistungsmodelle. Diese Ansicht veröffentlicht keine Tarife." plans={[{name:"Hausakte",price:"Nach aktuellem Angebot",text:"Der Ort für Unterlagen und die Geschichte deines Hauses.",features:["Dokumente zusammenhalten","Wichtige Informationen wiederfinden"],href:"/kontakt",action:"Umfang erfragen"},{name:"Persönliche Begleitung",price:"Individuell vereinbart",text:"Wenn du Unterstützung beim nächsten Schritt brauchst.",features:["Anliegen gemeinsam einordnen","Leistungsumfang vorab besprechen"],href:"/kontakt",action:"Bedarf besprechen"}]} note="Beispiel für die Komponente. Verbindliche Preise müssen aus dem freigegebenen Produktangebot stammen." faq={faq}/>}
  {view==="owner" && <EHOwnerPage houseName="Mein Haus" address="Musterhaus · unverbindliche Vorschau" documents={[{id:"d1",title:"Heizungswartung · Musterdatei",category:"Heizung",date:"Juli 2026",href:"#documents"},{id:"d2",title:"Dachinspektion · Musterdatei",category:"Dach",date:"Mai 2026",href:"#documents"}]} history={[{when:"Juli 2026",title:"Wartung dokumentiert",text:"Beispieleintrag in der Hauschronik."},{when:"Als Nächstes",title:"Unterlagen ergänzen",current:true}]} people={[{id:"p1",title:"Ansprechpartner ergänzen",text:"Hier stehen später deine tatsächlichen Kontakte."}]} onRequest={()=>{setReceipt("Vorschau: Dein Anliegen wurde nicht versendet.");setDialog(true);}}/>}
  {view==="provider" && <EHProviderPage name="Dein Überblick." summary="Beispieldaten für Anfragen, Aufträge und Termine." requests={[{id:"r1",title:"Heizungswartung abstimmen",location:"Musteranfrage · kein echter Auftrag",status:"Rückfrage offen"},{id:"r2",title:"Dachrinne prüfen",location:"Musteranfrage · kein echter Auftrag",status:"Neu"}]} appointments={[{id:"a1",time:"09:00 Uhr",title:"Mustertermin",address:"Beispieladresse"}]} onOpenRequest={()=>{setReceipt("Beispielanfrage. Hier wird die bestehende Auftragsansicht angebunden.");setDialog(true);}}/>}
  {view==="components" && <EHSection><EHHeading>Für die echten Details.</EHHeading><EHText>Formulare, Zustände, Register, Vergleich und Dialog – mit derselben visuellen Grundlage.</EHText><EHTabs label="Komponentenfamilien" tabs={[{id:"forms",label:"Formulare",content:<EHPanel title="Eingaben">{form}<EHField id="topic" label="Thema"><EHSelect id="topic"><option>Heizung</option><option>Dach</option></EHSelect></EHField></EHPanel>},{id:"states",label:"Zustände",content:<><EHActions><EHStatus>Offen</EHStatus><EHStatus tone="success">Erledigt</EHStatus><EHStatus tone="warning">Rückfrage</EHStatus><EHStatus tone="error">Fehler</EHStatus></EHActions><EHLoadingState/><EHErrorState text="Beispiel für einen fehlgeschlagenen Abruf." onRetry={()=>setReceipt("Erneut geprüft.")}/><EHEmptyState title="Noch keine Unterlagen" text="Deine Dokumente finden hier ihren Platz." action={<EHButton onClick={()=>setDialog(true)}>Dialog öffnen</EHButton>}/></>},{id:"content",label:"Inhalte",content:<><EHComparison left={{title:"Einzelne Unterlagen",items:["Verteilt abgelegt","Zusammenhänge suchen"]}} right={{title:"Eine Hausgeschichte",items:["Gemeinsam auffindbar","Vorgänge nachvollziehen"]}}/><EHFacts items={[{value:"01",label:"Unterlagen"},{value:"02",label:"Termine"},{value:"03",label:"Menschen"}]}/><EHFAQ items={faq}/></>}]} /></EHSection>}
  </main><EHDialog open={dialog} onClose={()=>setDialog(false)} title="Komponente im Einsatz" actions={<EHButton onClick={()=>setDialog(false)}>Verstanden</EHButton>}><EHText>{receipt || "Ein nativer Dialog mit Tastaturfokus und Escape-Unterstützung."}</EHText></EHDialog></EHScope>;
}

`````

## src/app/layout.tsx

`````tsx
import type { Metadata,Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '../../packages/eh-design/src/tokens.css';
import './design-system.css';
import '@/components/marketing/tokens.css';
import { PwaRegister } from '@/components/pwa-register';
import { AuthProvider } from '@/components/AuthContext';
import NativeInit from '@/components/NativeInit';
import { CwvTelemetry } from '@/components/telemetry/cwv-telemetry';
import { SITE_URL, orgWebsiteJsonLd } from '@/lib/seo';

// Brand typography: self-hosted Inter Variable for ALL surfaces (site, funnel, app).
const interVariable = localFont({
  src: '../fonts/InterVariable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-marketing',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase:new URL(SITE_URL),
  alternates:{canonical:'/'},
  applicationName:'Einfach Hausen',
  title:{default:'Einfach Hausen · Alles rund ums Eigenheim',template:'%s · Einfach Hausen'},
  description:'Ein Ansprechpartner für alles rund ums Eigenheim. Fragen klären, passende Menschen finden, Aufträge organisieren und Hauswissen an einem Ort behalten.',
  openGraph:{type:'website',locale:'de_DE',siteName:'Einfach Hausen',url:'/'},
  twitter:{card:'summary_large_image'},
  manifest:'/manifest.webmanifest',
  appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'Einfach Hausen'},
  formatDetection:{telephone:false},
  icons:{icon:[{url:'/icons/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/icons/icon-192.png',sizes:'192x192',type:'image/png'}],apple:[{url:'/icons/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]},
};

export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#ffffff'};

export default async function RootLayout({children}:{children:React.ReactNode}){
  // T-0132: the proxy-generated correlation id is exposed to the client error
  // reporter so boundary errors join with server logs. headers() makes this
  // layout dynamic; the attribute is empty when no id exists.
  let correlationId = '';
  try {
    const { headers } = await import('next/headers');
    correlationId = (await headers()).get('x-correlation-id') ?? '';
  } catch { /* static render: no correlation id */ }
  return <html lang="de" data-scroll-behavior="smooth" data-correlation-id={correlationId} className={interVariable.variable}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(orgWebsiteJsonLd())}} /><NativeInit><AuthProvider><PwaRegister/><CwvTelemetry/>{children}</AuthProvider></NativeInit></body></html>;
}

`````

## src/app/pro/provider-workspace.module.css

`````css
.providerScope {
  --provider-green-900: var(--eh-green-900);
  --provider-green-700: var(--eh-green-700);
  --provider-green-600: var(--eh-green-600);
  --provider-green-100: var(--eh-green-100);
  --provider-green-50: var(--eh-green-50);
  --provider-canvas: var(--eh-bg);
  --provider-surface: var(--eh-surface);
  --provider-subtle: var(--eh-surface-subtle);
  --provider-text: var(--eh-text);
  --provider-muted: var(--eh-text-secondary);
  --provider-border: var(--eh-border);
  --provider-border-strong: var(--eh-border-strong);
  min-height: 100vh;
  background: var(--provider-canvas);
}

.skipLink {
  position: fixed;
  left: 16px;
  top: 12px;
  z-index: 1000;
  transform: translateY(-160%);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-900);
  color: white;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 11px 14px;
  font-size: 14px;
  font-weight: 700;
  transition: transform 160ms ease-out;
}

.skipLink:focus {
  transform: translateY(0);
}

.providerScope :global(.app-shell-v3.pro-theme) {
  min-height: 100vh;
  padding: 0;
  background: var(--provider-canvas);
  color: var(--provider-text);
}

.providerScope :global(.app-shell-v3.pro-theme .workspace-shell) {
  background: var(--provider-canvas);
  color: var(--provider-text);
}

.providerScope :global(.app-shell-v3.pro-theme .desktop-sidebar) {
  background: rgba(255, 255, 255, 0.97);
  border-color: var(--provider-border);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-brand .brand[data-inverse='true']),
.providerScope :global(.app-shell-v3.pro-theme .mobile-brand .brand[data-inverse='true']) {
  color: var(--provider-green-900);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-brand .brand small),
.providerScope :global(.app-shell-v3.pro-theme .mobile-brand .brand small) {
  color: var(--provider-muted);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-nav a) {
  min-height: 44px;
  color: #66706a;
  font-size: 13px;
  font-weight: 600;
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-nav a:hover) {
  background: var(--provider-subtle);
  color: var(--provider-text);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-nav a.active) {
  background: var(--provider-green-100);
  color: var(--provider-green-900);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-nav a.active .sidebar-icon) {
  color: var(--provider-green-700);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-footer) {
  border-color: var(--provider-border);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-user),
.providerScope :global(.app-shell-v3.pro-theme .sidebar-help) {
  color: var(--provider-muted);
}

.providerScope :global(.app-shell-v3.pro-theme .sidebar-user strong) {
  color: var(--provider-text);
}

.providerScope :global(.app-shell-v3.pro-theme .user-avatar),
.providerScope :global(.app-shell-v3.pro-theme .top-user-avatar) {
  background: var(--provider-green-100);
  color: var(--provider-green-900);
}

.providerScope :global(.app-shell-v3.pro-theme .topbar-v3) {
  background: rgba(255, 255, 255, 0.94);
  border-color: var(--provider-border);
  color: var(--provider-text);
}

.providerScope :global(.app-shell-v3.pro-theme .page-context small) {
  color: var(--provider-muted);
}

.providerScope :global(.app-shell-v3.pro-theme .top-actions > a) {
  width: 44px;
  height: 44px;
  color: #59635d;
}

.providerScope :global(.app-shell-v3.pro-theme .top-actions > a:hover) {
  background: var(--provider-subtle);
}

.providerScope :global(.app-shell-v3.pro-theme .screen-v3) {
  width: min(100%, 1120px);
  max-width: 1120px;
  padding: 48px 48px 112px;
  color: var(--provider-text);
}

.providerScope :global(.app-shell-v3.pro-theme .bottom-nav) {
  background: rgba(255, 255, 255, 0.98);
  border-color: var(--provider-border);
}

.providerScope :global(.app-shell-v3.pro-theme .bottom-nav a) {
  min-height: 56px;
  color: #4e5751;
}

.providerScope :global(.app-shell-v3.pro-theme .bottom-nav a.active) {
  color: var(--provider-green-700);
}

.providerScope :global(.provider-page-intro) {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 34px;
}

.providerScope :global(.provider-page-intro > div) {
  min-width: 0;
  max-width: 720px;
}

.providerScope :global(.provider-eyebrow) {
  display: block;
  margin-bottom: 8px;
  color: var(--provider-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 750;
  letter-spacing: 0.02em;
}

.providerScope :global(.provider-page-intro h1) {
  margin: 0;
  color: var(--provider-text);
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 650;
}

.providerScope :global(.provider-page-intro p) {
  max-width: 650px;
  margin: 12px 0 0;
  color: var(--provider-muted);
  font-size: 16px;
  line-height: 1.6;
}

.providerScope :global(.provider-primary-action),
.providerScope :global(.provider-state-action) {
  min-height: 46px;
  border-radius: var(--eh-shape-panel);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--provider-green-700);
  color: white;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.providerScope :global(.provider-section-head) {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin: 36px 0 12px;
  padding-top: 4px;
}

.providerScope :global(.provider-section-head h2) {
  margin: 0;
  color: var(--provider-text);
  font-size: 19px;
  line-height: 1.25;
  letter-spacing: -0.015em;
  font-weight: 650;
}

.providerScope :global(.provider-section-head p) {
  margin: 5px 0 0;
  color: var(--provider-muted);
  font-size: 13px;
  line-height: 1.5;
}

.providerScope :global(.provider-section-head > a) {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: var(--provider-green-700);
  font-size: 13px;
  font-weight: 700;
}

.providerScope :global(.provider-state) {
  min-height: 150px;
  border: 1px dashed var(--provider-border-strong);
  border-radius: var(--eh-shape-panel);
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 26px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--provider-text);
}

.providerScope :global(.provider-state-icon) {
  width: 42px;
  height: 42px;
  border-radius: var(--eh-shape-panel);
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  background: var(--provider-green-100);
  color: var(--provider-green-700);
}

.providerScope :global(.provider-state strong) {
  display: block;
  font-size: 16px;
}

.providerScope :global(.provider-state p) {
  max-width: 620px;
  margin: 6px 0 0;
  color: var(--provider-muted);
  font-size: 14px;
  line-height: 1.55;
}

.providerScope :global(.provider-state-action) {
  min-height: 44px;
  margin-top: 16px;
  font-size: 13px;
}

.providerScope :global(.provider-state-error) {
  border-style: solid;
  border-color: #efcfcc;
  background: #fff8f7;
}

.providerScope :global(.provider-state-error .provider-state-icon) {
  background: #fcebea;
  color: #a63b34;
}

.providerScope :global(.provider-state-unavailable) {
  border-style: solid;
  border-color: #e9ddbc;
  background: #fffcf4;
}

.providerScope :global(.provider-state-unavailable .provider-state-icon) {
  background: #f8f0d9;
  color: #80611b;
}

.providerScope :global(.provider-state-success) {
  border-style: solid;
  border-color: #dcebec;
  background: var(--provider-green-50);
}

.providerScope :global(.provider-status-line) {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 18px;
  border-top: 1px solid var(--provider-border);
  border-bottom: 1px solid var(--provider-border);
  color: var(--provider-muted);
  font-size: 13px;
}

.providerScope :global(.provider-status-line > span),
.providerScope :global(.provider-status-line > a) {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.providerScope :global(.provider-status-line b) {
  color: var(--provider-text);
}

.providerScope :global(.provider-summary) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0 0 8px;
  border-top: 1px solid var(--provider-border);
  border-bottom: 1px solid var(--provider-border);
}

.providerScope :global(.provider-summary > div) {
  min-width: 0;
  padding: 18px 18px 18px 0;
}

.providerScope :global(.provider-summary > div + div) {
  border-left: 1px solid var(--provider-border);
  padding-left: 18px;
}

.providerScope :global(.provider-summary small) {
  display: block;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.provider-summary strong) {
  display: block;
  margin-top: 5px;
  color: var(--provider-text);
  font-size: 21px;
  font-weight: 620;
}

.providerScope :global(.provider-quick-links) {
  display: flex;
  gap: 4px;
  margin: 22px 0 2px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.providerScope :global(.provider-quick-links::-webkit-scrollbar) {
  display: none;
}

.providerScope :global(.provider-quick-links a) {
  min-height: 44px;
  border-radius: 999px;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  padding: 0 13px;
  color: #59635d;
  font-size: 13px;
  font-weight: 650;
}

.providerScope :global(.provider-quick-links a:hover) {
  background: var(--provider-surface);
  color: var(--provider-text);
}

.providerScope :global(.partner-standard-banner) {
  border: 0;
  border-radius: 0;
  background: transparent;
  margin: 0 0 22px;
  padding: 0;
  color: var(--provider-text);
}

.providerScope :global(.partner-standard-banner > svg) {
  color: var(--provider-green-700);
}

.providerScope :global(.partner-standard-banner strong) {
  font-size: 13px;
  font-weight: 650;
}

.providerScope :global(.partner-standard-banner small) {
  margin-top: 3px;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.metrics) {
  display: none;
}

.providerScope :global(.section-title) {
  margin: 34px 0 12px;
}

.providerScope :global(.section-title strong) {
  color: var(--provider-text);
  font-size: 18px;
  font-weight: 650;
}

.providerScope :global(.section-title a) {
  color: var(--provider-green-700);
  font-size: 13px;
}

.providerScope :global(.stack) {
  gap: 0;
}

.providerScope :global(.pro-request) {
  min-height: 96px;
  border: 0;
  border-top: 1px solid var(--provider-border);
  border-radius: 0;
  background: transparent;
  color: var(--provider-text);
  padding: 17px 4px;
  transition: background 160ms ease-out, padding 160ms ease-out;
}

.providerScope :global(.stack .pro-request:last-child) {
  border-bottom: 1px solid var(--provider-border);
}

.providerScope :global(.pro-request:hover) {
  margin-inline: -12px;
  padding-inline: 16px;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
}

.providerScope :global(.pro-request strong) {
  color: var(--provider-text);
  font-size: 15px;
  font-weight: 650;
}

.providerScope :global(.pro-request small) {
  margin-top: 6px;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.4;
}

.providerScope :global(.pro-request .request-main > span:not(.new)) {
  margin-top: 11px;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
  font-weight: 600;
}

.providerScope :global(.pro-request .request-main > b) {
  color: var(--provider-text);
  font-size: 14px;
  font-weight: 650;
}

.providerScope :global(.pro-request > svg) {
  color: #88918b;
}

.providerScope :global(.pro-request img) {
  width: 86px;
  height: 70px;
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
}

.providerScope :global(.new) {
  margin-bottom: 7px;
  border-radius: 999px;
  background: var(--provider-green-100);
  color: var(--provider-green-700);
  padding: 4px 7px;
  font-size: var(--eh-font-meta);
  letter-spacing: 0;
}

.providerScope :global(.quoted-badge) {
  position: static;
  align-self: center;
  border-radius: 999px;
  background: var(--provider-green-100);
  color: var(--provider-green-700);
  padding: 6px 9px;
  font-size: var(--eh-font-meta);
}

.providerScope :global(.provider-next-action) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 9px;
  color: var(--provider-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 750;
}

.providerScope :global(.provider-row-meta) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 7px;
}

.providerScope :global(.provider-row-meta span) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.provider-row-meta svg) {
  width: 14px;
  height: 14px;
}

.providerScope :global(.provider-row-side) {
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.providerScope :global(.provider-row-side > strong) {
  font-size: 14px;
}

.providerScope :global(.status) {
  border-radius: 999px;
  background: #eef1ef;
  color: #57615a;
  padding: 5px 8px;
  font-size: var(--eh-font-meta);
  line-height: 1;
  letter-spacing: 0.02em;
}

.providerScope :global(.status.accepted),
.providerScope :global(.status.completed),
.providerScope :global(.status.active),
.providerScope :global(.status.approved),
.providerScope :global(.status.resolved) {
  background: var(--provider-green-100);
  color: var(--provider-green-700);
}

.providerScope :global(.status.in_progress),
.providerScope :global(.status.pending),
.providerScope :global(.status.trialing) {
  background: #f8f1df;
  color: #775d1e;
}

.providerScope :global(.empty),
.providerScope :global(.dark-empty) {
  min-height: 150px;
  border-color: var(--provider-border-strong);
  border-radius: var(--eh-shape-panel);
  background: rgba(255, 255, 255, 0.5);
  color: var(--provider-muted);
  padding: 28px;
}

.providerScope :global(.dark-empty strong),
.providerScope :global(.empty strong) {
  color: var(--provider-text);
  font-size: 15px;
}

.providerScope :global(.dark-empty p),
.providerScope :global(.empty p) {
  max-width: 560px;
  color: var(--provider-muted);
  font-size: 13px;
  line-height: 1.55;
}

.providerScope :global(.empty svg),
.providerScope :global(.dark-empty svg) {
  color: var(--provider-green-700);
}

.providerScope :global(.verification-gate) {
  max-width: 660px;
  margin: 50px auto;
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
  color: var(--provider-text);
  padding: 38px 30px;
  box-shadow: 0 16px 50px rgba(20, 45, 30, 0.05);
}

.providerScope :global(.verification-gate > svg) {
  color: #9b7625;
}

.providerScope :global(.verification-gate p) {
  color: var(--provider-muted);
  font-size: 14px;
}

.providerScope :global(.detail-head.pro-detail) {
  margin-bottom: 8px;
}

.providerScope :global(.pro-detail h1) {
  margin: 12px 0 8px;
  color: var(--provider-text);
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 650;
}

.providerScope :global(.pro-detail > p) {
  max-width: 760px;
  color: var(--provider-muted);
  font-size: 15px;
  line-height: 1.65;
}

.providerScope :global(.pro-detail .meta-line) {
  gap: 10px 18px;
  margin-top: 15px;
}

.providerScope :global(.pro-detail .meta-line span) {
  color: var(--provider-muted);
  font-size: 13px;
}

.providerScope :global(.budget-line) {
  max-width: 420px;
  margin-top: 18px;
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
  color: var(--provider-text);
  padding: 13px 15px;
}

.providerScope :global(.budget-line small) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.budget-line strong) {
  font-size: 15px;
}

.providerScope :global(.contact-request-note),
.providerScope :global(.pro-emergency-note),
.providerScope :global(.partner-job-note),
.providerScope :global(.simple-role-principle),
.providerScope :global(.partner-plan-hero),
.providerScope :global(.verification-card),
.providerScope :global(.pro-current-plan),
.providerScope :global(.pro-claim) {
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
  color: var(--provider-text);
  box-shadow: none;
}

.providerScope :global(.contact-request-note),
.providerScope :global(.simple-role-principle),
.providerScope :global(.partner-plan-hero) {
  padding: 16px;
}

.providerScope :global(.contact-request-note p),
.providerScope :global(.pro-emergency-note p),
.providerScope :global(.partner-job-note p),
.providerScope :global(.simple-role-principle p),
.providerScope :global(.partner-plan-hero p),
.providerScope :global(.verification-card p),
.providerScope :global(.pro-current-plan p),
.providerScope :global(.pro-claim p),
.providerScope :global(.pro-claim small) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.55;
}

.providerScope :global(.contact-request-note > svg),
.providerScope :global(.simple-role-principle > svg),
.providerScope :global(.partner-plan-hero > svg),
.providerScope :global(.verification-card > svg) {
  color: var(--provider-green-700);
}

.providerScope :global(.pro-emergency-note) {
  border-color: #ead7c0;
  background: #fffaf4;
  padding: 16px;
}

.providerScope :global(.quote-form),
.providerScope :global(.pro-form),
.providerScope :global(.document-form),
.providerScope :global(.invoice-form),
.providerScope :global(.team-add-form),
.providerScope :global(.member-card),
.providerScope :global(.broker-lead-status),
.providerScope :global(.app-shell-v3.pro-theme .quote-form),
.providerScope :global(.app-shell-v3.pro-theme .pro-form),
.providerScope :global(.app-shell-v3.pro-theme .document-form) {
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
  color: var(--provider-text);
  box-shadow: none;
}

.providerScope :global(.quote-form),
.providerScope :global(.document-form),
.providerScope :global(.invoice-form),
.providerScope :global(.team-add-form),
.providerScope :global(.broker-lead-status) {
  padding: 18px;
}

.providerScope :global(.member-card) {
  padding: 18px 2px;
  border-width: 1px 0 0;
  border-radius: 0;
  background: transparent;
}

.providerScope :global(.stack .member-card:last-child) {
  border-bottom-width: 1px;
}

.providerScope :global(.member-card input),
.providerScope :global(.team-add-form input),
.providerScope :global(.quote-form input),
.providerScope :global(.quote-form textarea),
.providerScope :global(.quote-form select),
.providerScope :global(.pro-form input),
.providerScope :global(.pro-form textarea),
.providerScope :global(.pro-form select),
.providerScope :global(.document-form input),
.providerScope :global(.document-form select),
.providerScope :global(.app-shell-v3.pro-theme .quote-form input),
.providerScope :global(.app-shell-v3.pro-theme .quote-form textarea),
.providerScope :global(.app-shell-v3.pro-theme .pro-form input),
.providerScope :global(.app-shell-v3.pro-theme .pro-form textarea),
.providerScope :global(.app-shell-v3.pro-theme .document-form input),
.providerScope :global(.app-shell-v3.pro-theme .document-form select),
.providerScope :global(.invoice-form input),
.providerScope :global(.invoice-form textarea),
.providerScope :global(.invoice-form select),
.providerScope :global(.broker-lead-status select) {
  min-height: 46px;
  border: 1px solid var(--provider-border-strong);
  border-radius: var(--eh-shape-panel);
  background: white;
  color: var(--provider-text);
}

.providerScope :global(.quote-form textarea),
.providerScope :global(.pro-form textarea),
.providerScope :global(.invoice-form textarea) {
  min-height: 112px;
}

.providerScope :global(label) {
  color: #3f4842;
  font-size: 13px;
  font-weight: 650;
}

.providerScope :global(label small) {
  color: var(--provider-muted);
}

.providerScope :global(.btn) {
  min-height: 46px;
  border-radius: var(--eh-shape-panel);
  padding-inline: 16px;
  transform: none;
  transition: background 160ms ease-out, border-color 160ms ease-out, color 160ms ease-out;
}

.providerScope :global(.btn.light) {
  background: var(--provider-green-700);
  color: white;
}

.providerScope :global(.btn.light:hover) {
  background: var(--provider-green-600);
}

.providerScope :global(.btn.ghost),
.providerScope :global(.pro-ghost) {
  border: 1px solid var(--provider-border-strong);
  background: white;
  color: #4d5750;
}

.providerScope :global(.btn.ghost:hover),
.providerScope :global(.pro-ghost:hover) {
  border-color: #bfc8c1;
  background: var(--provider-subtle);
  color: var(--provider-text);
}

.providerScope :global(.direct-contact-actions .btn.light) {
  border: 1px solid var(--provider-border-strong);
  background: white;
  color: var(--provider-text);
}

.providerScope :global(.direct-contact-actions .btn.light:hover) {
  border-color: #bdc8c0;
  background: var(--provider-subtle);
}

.providerScope :global(.assign-form) {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.providerScope :global(.assign-form label) {
  flex: 1;
}

.providerScope :global(.assign-form select) {
  min-height: 46px;
  border-color: var(--provider-border-strong);
  border-radius: var(--eh-shape-panel);
  background: white;
  color: var(--provider-text);
}

.providerScope :global(.decline-form) {
  max-width: 330px;
  margin-top: 10px;
}

.providerScope :global(.pro-contact-card),
.providerScope :global(.pro-contact-list .contact-row) {
  border: 1px solid var(--provider-border);
  background: var(--provider-surface);
  color: var(--provider-text);
}

.providerScope :global(.pro-contact-list .contact-row) {
  min-height: 72px;
  border-width: 1px 0 0;
  border-radius: 0;
  padding: 13px 2px;
}

.providerScope :global(.pro-contact-list .contact-row:last-child) {
  border-bottom-width: 1px;
}

.providerScope :global(.pro-contact-list .contact-row.selected) {
  margin-inline: -10px;
  border: 1px solid #cfe2d5;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-50);
  box-shadow: none;
  padding-inline: 12px;
}

.providerScope :global(.pro-contact-list .contact-row small),
.providerScope :global(.pro-contact-list .contact-row p),
.providerScope :global(.pro-contact-card p),
.providerScope :global(.pro-contact-card small) {
  color: var(--provider-muted);
}

.providerScope :global(.contact-avatar) {
  background: var(--provider-green-100);
  color: var(--provider-green-700);
}

.providerScope :global(.icon-contact) {
  width: 44px;
  height: 44px;
  border-color: var(--provider-border);
  color: var(--provider-green-700);
}

.providerScope :global(.pro-chat) {
  min-height: 260px;
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-subtle);
  padding: 14px;
}

.providerScope :global(.pro-chat .msg) {
  max-width: min(82%, 600px);
  border: 1px solid var(--provider-border);
  background: white;
  color: var(--provider-text);
}

.providerScope :global(.pro-chat .msg.mine) {
  border-color: #dcebec;
  background: var(--provider-green-100);
}

.providerScope :global(.pro-chat .chat-form input) {
  min-height: 48px;
  border-color: var(--provider-border-strong);
  background: white;
  color: var(--provider-text);
}

.providerScope :global(.pro-chat .chat-form button) {
  width: 48px;
  height: 48px;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-700);
}

.providerScope :global(.pro-appointment) {
  min-height: 78px;
  border: 0;
  border-top: 1px solid var(--provider-border);
  border-radius: 0;
  background: transparent;
  color: var(--provider-text);
  padding: 16px 2px;
}

.providerScope :global(.stack .pro-appointment:last-child) {
  border-bottom: 1px solid var(--provider-border);
}

.providerScope :global(.pro-appointment > svg) {
  color: var(--provider-green-700);
}

.providerScope :global(.pro-appointment p),
.providerScope :global(.pro-appointment small) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.member-head strong) {
  color: var(--provider-text);
  font-size: 14px;
}

.providerScope :global(.member-head small),
.providerScope :global(.member-explain) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.member-switches) {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.providerScope :global(.member-switches label),
.providerScope :global(.team-manage-toggle) {
  min-height: 48px;
  border-color: var(--provider-border);
  background: var(--provider-surface);
  color: var(--provider-text);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.member-switches input),
.providerScope :global(.team-manage-toggle input) {
  width: 18px;
  height: 18px;
  min-height: auto;
  accent-color: var(--provider-green-700);
}

.providerScope :global(.verification-card) {
  min-height: 88px;
  padding: 17px;
}

.providerScope :global(.verification-card.verified) {
  border-color: #d4e5da;
  background: var(--provider-green-50);
}

.providerScope :global(.verification-card strong) {
  color: var(--provider-text);
  font-size: 14px;
}

.providerScope :global(.verification-card small) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.contract-checks span) {
  border-color: var(--provider-border);
  background: var(--provider-subtle);
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.contract-checks span.ok) {
  border-color: #dcebec;
  background: var(--provider-green-100);
  color: var(--provider-green-700);
}

.providerScope :global(.provider-category-picker),
.providerScope :global(.service-offering-picker),
.providerScope :global(.service-preferences),
.providerScope :global(.emergency-settings),
.providerScope :global(.broker-profile-settings),
.providerScope :global(.privacy-strip) {
  border-color: var(--provider-border) !important;
  background: #fafbfa !important;
  color: var(--provider-text) !important;
}

.providerScope :global(.partner-plan-grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.providerScope :global(.partner-plan-card) {
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
  color: var(--provider-text);
  padding: 20px;
}

.providerScope :global(.partner-plan-card.featured) {
  border-color: #9fcfd2;
  box-shadow: 0 0 0 1px #dcece1 inset;
}

.providerScope :global(.partner-plan-card .plan-price) {
  color: var(--provider-green-900);
}

.providerScope :global(.partner-plan-card .plan-price small),
.providerScope :global(.partner-plan-card > p),
.providerScope :global(.partner-plan-card li) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.partner-plan-card li::before) {
  color: var(--provider-green-700);
}

.providerScope :global(.pro-doc-list a) {
  min-height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: 1px solid var(--provider-border);
  padding: 12px 2px;
}

.providerScope :global(.pro-doc-list a:last-child) {
  border-bottom: 1px solid var(--provider-border);
}

.providerScope :global(.pro-doc-list a small) {
  margin-top: 4px;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
}

.providerScope :global(.alert) {
  min-height: 48px;
  border-radius: var(--eh-shape-panel);
  font-size: 13px;
  line-height: 1.45;
}

.providerScope :global(.alert.success) {
  border: 1px solid #dcebec;
  background: var(--provider-green-50);
  color: var(--provider-green-900);
}

.providerScope :global(.alert.error) {
  border: 1px solid #efcfcc;
  background: #fff8f7;
  color: #8f302a;
}

.providerScope :global(.broker-leads) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.providerScope :global(.broker-leads article) {
  border: 1px solid var(--provider-border);
  border-radius: var(--eh-shape-panel);
  background: var(--provider-surface);
  color: var(--provider-text);
}

.providerScope :global(.pro-invoice-page) {
  min-height: 100vh;
  background: var(--provider-canvas);
  color: var(--provider-text);
}

.providerScope :global(.pro-invoice-page .invoice-page-tools) {
  max-width: 980px;
  margin: 0 auto 22px;
  padding: 24px 20px 0;
}

.providerScope :global(.provider-loading) {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.providerScope :global(.provider-loading-bar),
.providerScope :global(.provider-loading-row) {
  overflow: hidden;
  position: relative;
  border-radius: var(--eh-shape-panel);
  background: #e9ece9;
}

.providerScope :global(.provider-loading-bar::after),
.providerScope :global(.provider-loading-row::after) {
  position: absolute;
  inset: 0;
  content: '';
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.72), transparent);
  animation: providerShimmer 1.35s infinite;
}

.providerScope :global(.provider-loading-bar) {
  width: min(470px, 86%);
  height: 38px;
  margin-bottom: 18px;
}

.providerScope :global(.provider-loading-row) {
  height: 92px;
  border-radius: 14px;
}

.providerScope :global(.provider-error-page) {
  width: min(680px, calc(100% - 32px));
  margin: 60px auto;
}

.providerScope :global(.provider-error-page button) {
  min-height: 46px;
  border: 0;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-700);
  color: white;
  padding: 0 16px;
  font: inherit;
  font-weight: 700;
}

.providerScope :global(a:focus-visible),
.providerScope :global(button:focus-visible),
.providerScope :global(input:focus-visible),
.providerScope :global(textarea:focus-visible),
.providerScope :global(select:focus-visible),
.providerScope :global(summary:focus-visible) {
  outline: 3px solid rgba(23, 107, 69, 0.28);
  outline-offset: 3px;
}

.providerScope :global(input:focus),
.providerScope :global(textarea:focus),
.providerScope :global(select:focus) {
  border-color: var(--provider-green-700);
  box-shadow: 0 0 0 3px rgba(23, 107, 69, 0.1);
}

@keyframes providerShimmer {
  100% { transform: translateX(100%); }
}

.providerScope :global(.sr-only) {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.providerScope :global(.provider-messages-layout) {
  display: grid;
  grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
  gap: 34px;
  align-items: start;
}

.providerScope :global(.provider-messages-layout .provider-section-head) {
  margin-top: 0;
}

.providerScope :global(.provider-message-list-pane),
.providerScope :global(.provider-message-thread) {
  min-width: 0;
}

.providerScope :global(.provider-message-thread .pro-chat) {
  margin-top: 12px;
}

.providerScope :global(.simple-role-principle) {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px 24px;
  align-items: start;
}

.providerScope :global(.simple-role-principle strong) {
  color: var(--provider-text);
  font-size: 13px;
}

.providerScope :global(.privacy-banner.pro-privacy) {
  border: 1px solid #d7e6dc;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-50);
  color: var(--provider-text);
  padding: 16px;
}

.providerScope :global(.privacy-banner.pro-privacy > svg) {
  color: var(--provider-green-700);
}

.providerScope :global(.privacy-banner.pro-privacy p) {
  color: var(--provider-muted);
}

.providerScope :global(.provider-leads-card) {
  margin-top: 24px;
}

.providerScope :global(.invoice-form-head p),
.providerScope :global(.invoice-items-head small),
.providerScope :global(.invoice-preview-total span) {
  color: var(--provider-muted);
}

.providerScope :global(.invoice-form-head strong),
.providerScope :global(.invoice-items-head strong),
.providerScope :global(.invoice-preview-total strong) {
  color: var(--provider-text);
}


.providerScope :global(.provider-access-boundary) {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: -12px 0 24px;
  border: 1px solid var(--provider-border);
  border-radius: 14px;
  background: var(--provider-surface);
  padding: 13px 15px;
}

.providerScope :global(.provider-access-boundary.is-on) {
  border-color: #cfe2d5;
  background: var(--provider-green-50);
}

.providerScope :global(.provider-access-boundary.is-off) {
  background: #f5f6f5;
}

.providerScope :global(.provider-access-icon) {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-100);
  color: var(--provider-green-700);
}

.providerScope :global(.provider-access-boundary.is-off .provider-access-icon) {
  background: #e8ebe9;
  color: #59635d;
}

.providerScope :global(.provider-access-boundary strong) {
  display: block;
  color: var(--provider-text);
  font-size: 13px;
  line-height: 1.35;
}

.providerScope :global(.provider-access-boundary p) {
  margin: 3px 0 0;
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.5;
}

.providerScope :global(.provider-next-step) {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 1.15fr);
  align-items: start;
  gap: 20px;
  margin: 22px 0;
  border: 1px solid #dcebec;
  border-radius: var(--eh-shape-panel);
  background: var(--provider-green-50);
  padding: 20px;
}

.providerScope :global(.provider-next-step-single) {
  grid-template-columns: 1fr;
}

.providerScope :global(.provider-next-step > div:first-child > span) {
  display: block;
  margin-bottom: 5px;
  color: var(--provider-green-700);
  font-size: var(--eh-font-meta);
  font-weight: 750;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.providerScope :global(.provider-next-step > div:first-child > strong) {
  display: block;
  max-width: 520px;
  color: var(--provider-text);
  font-size: 17px;
  line-height: 1.45;
  font-weight: 650;
}

.providerScope :global(.provider-next-step-action) {
  min-width: 0;
}

.providerScope :global(.provider-next-step-action > form),
.providerScope :global(.provider-next-step-action > a) {
  margin: 0;
}

.providerScope :global(.provider-next-step-action .provider-primary-form) {
  border: 0;
  background: transparent;
  padding: 0;
}

.providerScope :global(.provider-next-step-action .quote-form) {
  display: grid;
  gap: 12px;
}

.providerScope :global(.provider-next-step-action .quote-form label),
.providerScope :global(.provider-next-step-action .assign-form label) {
  min-width: 0;
}

.providerScope :global(.provider-state-compact) {
  min-height: 0;
  align-items: center;
  border-style: solid;
  padding: 15px 16px;
}

.providerScope :global(.provider-state-compact .provider-state-icon) {
  width: 36px;
  height: 36px;
  border-radius: var(--eh-shape-panel);
}

.providerScope :global(.provider-state-compact strong) {
  font-size: 14px;
}

.providerScope :global(.provider-state-compact p) {
  margin-top: 3px;
  font-size: var(--eh-font-meta);
}

.providerScope :global(.provider-disclosure) {
  margin: 12px 0 20px;
  border: 1px solid var(--provider-border);
  border-radius: 14px;
  background: var(--provider-surface);
}

.providerScope :global(.provider-disclosure > summary) {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  list-style: none;
  padding: 12px 14px;
  color: var(--provider-text);
  font-size: 13px;
  font-weight: 700;
}

.providerScope :global(.provider-disclosure > summary::-webkit-details-marker) {
  display: none;
}

.providerScope :global(.provider-disclosure > summary::after) {
  content: '+';
  margin-left: auto;
  color: var(--provider-muted);
  font-size: 20px;
  line-height: 1;
  font-weight: 400;
}

.providerScope :global(.provider-disclosure[open] > summary::after) {
  content: '−';
}

.providerScope :global(.provider-disclosure > .assign-form),
.providerScope :global(.provider-form-disclosure > form) {
  margin: 0;
  border-width: 1px 0 0;
  border-radius: 0 0 14px 14px;
}

.providerScope :global(.provider-disclosure-icon) {
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--provider-green-100);
  color: var(--provider-green-700);
}

.providerScope :global(.provider-form-disclosure > summary > span:last-child) {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.providerScope :global(.provider-form-disclosure > summary strong) {
  color: var(--provider-text);
  font-size: 13px;
}

.providerScope :global(.provider-form-disclosure > summary small) {
  color: var(--provider-muted);
  font-size: var(--eh-font-meta);
  line-height: 1.4;
  font-weight: 500;
}

.providerScope :global(.member-head),
.providerScope :global(.contact-row),
.providerScope :global(.pro-contact-card),
.providerScope :global(.pro-request),
.providerScope :global(.pro-appointment) {
  min-width: 0;
}

.providerScope :global(.member-head small),
.providerScope :global(.contact-row strong),
.providerScope :global(.contact-row small),
.providerScope :global(.contact-row p),
.providerScope :global(.pro-contact-card strong),
.providerScope :global(.pro-contact-card p),
.providerScope :global(.pro-request strong),
.providerScope :global(.pro-request small),
.providerScope :global(.pro-appointment strong),
.providerScope :global(.pro-appointment p) {
  overflow-wrap: anywhere;
}

.providerScope :global(.document-form input[type='file']) {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.providerScope :global(.direct-contact-actions) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 900px) {
  .providerScope :global(.app-shell-v3.pro-theme .screen-v3) {
    padding-inline: 28px;
  }

  .providerScope :global(.partner-plan-grid) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .providerScope :global(.provider-next-step) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 17px;
  }

  .providerScope :global(.provider-next-step-action .btn),
  .providerScope :global(.provider-next-step-action .provider-primary-action),
  .providerScope :global(.provider-next-step-action form) {
    width: 100%;
  }

  .providerScope :global(.provider-access-boundary) {
    margin-top: -8px;
  }

  .providerScope :global(.provider-form-disclosure > summary) {
    align-items: flex-start;
  }

  .providerScope :global(.provider-disclosure > .assign-form) {
    padding: 14px;
  }

  .providerScope :global(.provider-messages-layout) {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .providerScope :global(.simple-role-principle) {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px 14px;
  }

  .providerScope :global(.simple-role-principle > div) {
    grid-column: 2;
  }

  .providerScope :global(.app-shell-v3.pro-theme .topbar-v3) {
    background: rgba(255, 255, 255, 0.98);
    border-bottom: 1px solid var(--provider-border);
  }

  .providerScope :global(.app-shell-v3.pro-theme .screen-v3) {
    padding: 30px 18px calc(96px + env(safe-area-inset-bottom));
  }

  .providerScope :global(.provider-page-intro) {
    align-items: stretch;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 26px;
  }

  .providerScope :global(.provider-page-intro h1) {
    font-size: 32px;
  }

  .providerScope :global(.provider-page-intro p) {
    font-size: 15px;
  }

  .providerScope :global(.provider-primary-action) {
    width: 100%;
  }

  .providerScope :global(.provider-summary) {
    grid-template-columns: 1fr;
  }

  .providerScope :global(.provider-summary > div),
  .providerScope :global(.provider-summary > div + div) {
    min-height: 62px;
    border-left: 0;
    border-bottom: 1px solid var(--provider-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 2px;
  }

  .providerScope :global(.provider-summary > div:last-child) {
    border-bottom: 0;
  }

  .providerScope :global(.provider-summary strong) {
    margin: 0;
    font-size: 18px;
  }

  .providerScope :global(.provider-section-head) {
    align-items: flex-start;
    margin-top: 30px;
  }

  .providerScope :global(.pro-request) {
    align-items: flex-start;
    min-height: 100px;
  }

  .providerScope :global(.pro-request:hover) {
    margin-inline: 0;
    padding-inline: 4px;
    border-radius: 0;
    background: transparent;
  }

  .providerScope :global(.pro-request img) {
    width: 70px;
    height: 62px;
  }

  .providerScope :global(.provider-row-side) {
    min-width: 0;
  }

  .providerScope :global(.assign-form),
  .providerScope :global(.direct-contact-actions) {
    align-items: stretch;
    flex-direction: column;
  }

  .providerScope :global(.assign-form .btn),
  .providerScope :global(.direct-contact-actions .btn) {
    width: 100%;
  }

  .providerScope :global(.decline-form) {
    max-width: none;
  }

  .providerScope :global(.two),
  .providerScope :global(.three),
  .providerScope :global(.invoice-line),
  .providerScope :global(.member-switches),
  .providerScope :global(.broker-lead-grid) {
    grid-template-columns: 1fr !important;
  }

  .providerScope :global(.invoice-line) {
    display: grid;
  }

  .providerScope :global(.pro-chat .msg) {
    max-width: 90%;
  }

  .providerScope :global(.verification-card) {
    padding: 15px;
  }

  .providerScope :global(.pro-invoice-page .invoice-page-tools) {
    align-items: stretch;
    flex-direction: column;
  }

  .providerScope :global(.pro-invoice-page .invoice-page-tools .btn),
  .providerScope :global(.pro-invoice-page .invoice-page-tools form),
  .providerScope :global(.pro-invoice-page .invoice-page-tools form button) {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .providerScope :global(.app-shell-v3.pro-theme .screen-v3) {
    padding-inline: 16px;
  }

  .providerScope :global(.provider-page-intro h1) {
    font-size: 30px;
  }

  .providerScope :global(.provider-section-head) {
    gap: 10px;
  }

  .providerScope :global(.provider-section-head h2) {
    font-size: 18px;
  }

  .providerScope :global(.pro-request) {
    gap: 9px;
  }

  .providerScope :global(.pro-request img) {
    display: none;
  }

  .providerScope :global(.pro-request > svg) {
    align-self: center;
  }

  .providerScope :global(.provider-row-side) {
    display: none;
  }

  .providerScope :global(.provider-status-line) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0;
    padding-block: 4px;
  }

  .providerScope :global(.provider-state) {
    padding: 20px;
  }

  .providerScope :global(.partner-plan-card) {
    padding: 17px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skipLink,
  .providerScope :global(.pro-request),
  .providerScope :global(.btn),
  .providerScope :global(.provider-loading-bar::after),
  .providerScope :global(.provider-loading-row::after) {
    animation: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }
}

/* Provider uses the shared light product language; only data density differs. */
.providerScope :global(.app-shell-v3.pro-theme),
.providerScope :global(.app-shell-v3.pro-theme .workspace-shell),
.providerScope :global(.app-shell-v3.pro-theme .workspace-main),
.providerScope :global(.app-shell-v3.pro-theme .screen-v3) {
  background: var(--provider-canvas);
  color: var(--provider-text);
}
.providerScope :global(.app-shell-v3.pro-theme .desktop-sidebar) {
  background: var(--provider-surface);
  border-color: var(--provider-border);
  padding: 14px 10px;
}
.providerScope :global(.app-shell-v3.pro-theme .topbar-v3) {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--provider-border);
  color: var(--provider-text);
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu summary) {
  min-height: 44px;
  border-radius: var(--eh-shape-panel);
  color: var(--provider-green-900);
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu summary:hover),
.providerScope :global(.app-shell-v3.pro-theme .app-menu[open] .app-menu-summary) {
  background: var(--provider-green-50);
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu[open] .sidebar-nav a.active) {
  background: var(--provider-green-100);
  color: var(--provider-green-900);
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu[open] .sidebar-nav a:hover) {
  background: var(--provider-subtle);
}
.providerScope :global(.app-shell-v3.pro-theme .workspace-shell) {
  grid-template-columns: 72px minmax(0, 1fr);
}
.providerScope :global(.app-shell-v3.pro-theme .workspace-shell:has(.app-menu[open])) {
  grid-template-columns: 236px minmax(0, 1fr);
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu:not([open]) .app-menu-content),
.providerScope :global(.app-shell-v3.pro-theme .app-menu:not([open]) .sidebar-brand),
.providerScope :global(.app-shell-v3.pro-theme .app-menu:not([open]) .sidebar-footer) {
  display: none;
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu:not([open]) .sidebar-nav a) {
  justify-content: center;
  padding-inline: 4px;
}
.providerScope :global(.app-shell-v3.pro-theme .app-menu:not([open]) .sidebar-nav a > span:not(.sidebar-icon)) {
  display: none;
}
.providerScope :global(.app-shell-v3.pro-theme .metrics),
.providerScope :global(.app-shell-v3.pro-theme .pro-request),
.providerScope :global(.app-shell-v3.pro-theme .quote-form),
.providerScope :global(.app-shell-v3.pro-theme .pro-form),
.providerScope :global(.app-shell-v3.pro-theme .document-form),
.providerScope :global(.app-shell-v3.pro-theme .contact-request-note) {
  background: var(--provider-surface);
  color: var(--provider-text);
  border-color: var(--provider-border);
}
.providerScope :global(.app-shell-v3.pro-theme .pro-request) {
  border-top-color: var(--provider-border);
}
.providerScope :global(.app-shell-v3.pro-theme .bottom-nav) {
  background: rgba(255, 255, 255, 0.98);
  border-color: var(--provider-border);
}
@media (max-width: 720px) {
  .providerScope :global(.app-shell-v3.pro-theme .workspace-shell) {
    grid-template-columns: 1fr;
  }
}

/* T-0154 provider offline banner (mirror of owner offline contract, dark theme) */
.providerScope :global(.provider-offline-banner) {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #3b2f16;
  color: #ffe9b8;
  border-bottom: 1px solid #6b5626;
  font-size: var(--eh-font-meta);
  line-height: 1.4;
  position: sticky;
  top: 0;
  z-index: 45;
}
.providerScope :global(.provider-offline-banner svg) { flex-shrink: 0; }
.providerScope :global(.provider-visually-hidden) {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* T-0210 premium app convergence: established workflow, clearer depth and trust. */
.providerScope :global(.app-shell-v3.pro-theme .screen-v3:has(.pdx-hero)) {
  background:
    radial-gradient(circle at 92% 4%, rgba(214, 235, 225, 0.54), transparent 30%),
    var(--provider-canvas);
}
.providerScope :global(.pdx-hero h1) {
  font-size: clamp(28px, 3vw, 38px);
  letter-spacing: -0.04em;
}
.providerScope :global(.partner-standard-banner) {
  border: 1px solid #cfe4da;
  border-radius: var(--eh-shape-panel);
  padding: 15px 18px;
  background: rgba(242, 249, 245, 0.86);
  box-shadow: 0 10px 30px rgba(14, 61, 51, 0.05);
}
.providerScope :global(.pdx-stats) {
  overflow: hidden;
  border: 1px solid rgba(14, 61, 51, 0.1);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 46px rgba(14, 61, 51, 0.08);
}
.providerScope :global(.pdx-stat) {
  min-height: 116px;
  padding-block: 18px;
  transition: background 180ms ease;
}
.providerScope :global(.pdx-stat-icon) {
  box-shadow: inset 0 0 0 1px rgba(14, 61, 51, 0.05);
}
.providerScope :global(.pdx-requests .provider-state) {
  border-color: #cfddd6;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 14px 38px rgba(14, 61, 51, 0.05);
}
.providerScope :global(.pdx-section-head a) {
  border-radius: 999px;
  padding: 8px 10px;
  transition: background 180ms ease, color 180ms ease;
}
@media (hover: hover) {
  .providerScope :global(.pdx-stat:hover) {
    background: var(--provider-green-50);
  }
  .providerScope :global(.pdx-section-head a:hover) {
    background: var(--provider-green-100);
    color: var(--provider-green-900);
  }
}
@media (max-width: 720px) {
  .providerScope :global(.app-shell-v3.pro-theme .screen-v3:has(.pdx-hero)) {
    background:
      linear-gradient(180deg, rgba(237, 245, 241, 0.76) 0, transparent 250px),
      var(--provider-canvas);
  }
  .providerScope :global(.partner-standard-banner) {
    border-radius: 15px;
    box-shadow: none;
  }
  .providerScope :global(.pdx-stats) {
    border-radius: var(--eh-shape-panel);
    box-shadow: 0 12px 32px rgba(14, 61, 51, 0.07);
  }
  .providerScope :global(.pdx-stat) {
    min-height: 108px;
    padding-block: 14px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .providerScope :global(.pdx-stat),
  .providerScope :global(.pdx-section-head a) {
    transition: none;
  }
}

/* Accepted Atelier 02: shared, readable functional controls. */
.providerScope :global(input), .providerScope :global(textarea), .providerScope :global(select) { font-size: var(--eh-font-input); border-radius: var(--eh-shape-control); }

`````

## src/components/marketing/home-hero.tsx

`````tsx
import {IntakeForm} from "@/components/home/intake-form";
import {EHPageHero, EHImageFrame, EHButton, EHSection, EHPromiseRow, EHSplitStory, EHPanel, EHFacts} from "@/design-system";

/** Accepted Atelier 02. Existing intake behavior and product facts remain connected. */
export function HomeHero() {
  return <>
    <EHPageHero display eyebrow="Zuhause, mit Überblick." number="01"
      title={<>Dein Haus.<br/>Einfach<br/>geregelt.</>}
      text="Weniger Kümmern. Mehr Zuhause sein. Behalte im Blick, was ansteht, und finde die passenden Menschen für dein Haus."
      actions={<><EHButton href="/hausakte" arrow>Deine Hausakte entdecken</EHButton><EHButton href="#anliegen" variant="quiet">Anliegen starten</EHButton></>}
      media={<EHImageFrame src="/images/marketing/family-home.jpg" alt="Ein Paar vor einem Haus im Garten" caption="Ein Zuhause. Viele Geschichten. · Illustrative Bildwelt" priority/>}
    />
    <EHSection compact><EHPromiseRow items={[{title:"Alles wissen.",text:"Dokumente und die Geschichte deines Hauses."},{title:"Nichts vergessen.",text:"Anstehende Wartungen und wichtige Termine."},{title:"Nicht alles selbst machen.",text:"Passende Ansprechpartner, wenn es Hilfe braucht."}]}/></EHSection>
    <EHSection id="anliegen" tone="white"><EHSplitStory eyebrow="Ein klarer nächster Schritt" title="Was steht bei deinem Haus an?" text="Heizung, Dach, Garten oder Unterlagen: Beschreibe dein Anliegen in deinen Worten. Du entscheidest, wie es weitergeht." media={<EHPanel title="Dein Anliegen"><IntakeForm variant="hero"/></EHPanel>}/></EHSection>
    <EHSection compact><EHFacts items={[{value:"12",label:"Leistungsbereiche mit geprüften Betrieben"},{value:"1",label:"Ansprechpartner mit Name, Betrieb und Nummer"},{value:"0 %",label:"Provision pro Auftrag – Partner bleiben Rechnungssteller"},{value:"15 %",label:"Dauer-Vorteil für die ersten 1.000 Pilot-Haushalte"}]}/></EHSection>
  </>;
}

`````

## src/components/marketing/mkt.module.css

`````css
/* ============================================================
   Einfach Hausen – Public website design system
   Uses the scoped tokens from tokens.css (.mkt root).
   Layout: flex first, grid only for card rasters.
   ============================================================ */

/* ---------- Shell ---------- */
.site {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
/* Button anchors define their own colors via .btn* rules; the :not(.btn) form
   stops this (0,1,1) inherit rule from overriding their color declarations. */
:where(.site a:not(.btn)) { color: inherit; text-decoration: none; }
.site a.btn { text-decoration: none; }
.site h1, .site h2, .site h3, .site p { margin: 0; }
.site h1, .site h2, .site h3 { text-wrap: balance; }
.site p { text-wrap: pretty; }
.site button { font: inherit; }
.site img { display: block; max-width: 100%; }

.skipLink {
  position: absolute; top: -100px; left: 16px; z-index: 1000;
  padding: 10px 14px; border-radius: var(--eh-r-btn);
  background: var(--eh-teal-700); color: var(--eh-on-dark); font-weight: 600;
}
.skipLink:focus { top: 16px; }

.container {
  width: 100%; max-width: var(--eh-container);
  margin: 0 auto; padding: 0 var(--eh-gutter);
}

/* ---------- Header ---------- */
.header {
  position: sticky; top: 0; z-index: 60;
  /* Solid canvas, no glass (DESIGN.md §2). Value literal instead of
     color-mix(...): Chromium renders the latter fully transparent and lets
     dark sections bleed through the sticky nav. */
  background: #faf8f4; /* --eh-canvas */
  border-bottom: 1px solid transparent;
  transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;
}
/* Scrolled: near-opaque so dark sections/headlines no longer bleed through the nav. */
.header[data-scrolled='true'] {
  /* Solid on scroll: Chromium skips semi-transparent sticky backgrounds above
     transformed (GSAP) layers, so alpha here would let dark bands bleed through. */
  background: var(--eh-canvas);
  border-bottom-color: var(--eh-line);
  box-shadow: 0 10px 30px -22px rgba(6, 21, 34, .45);
}
.headerInner {
  composes: container;
  position: relative;
  height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px;
}
.logoLink { display: inline-flex; align-items: center; gap: 10px; }
.logoImg { height: auto; }
.logoWord { font-size: 19px; letter-spacing: -0.02em; line-height: 1; color: var(--eh-teal-900); }
.logoWord b { font-weight: 800; }
.logoWord span { font-weight: 500; }

.desktopNav { display: none; align-items: center; gap: 4px; }
.desktopNav a {
  padding: 10px 14px; border-radius: var(--eh-r-pill);
  font-size: 15px; font-weight: 500; color: var(--eh-ink-soft);
  transition: background .18s ease, color .18s ease;
}
.desktopNav a:hover { background: var(--eh-teal-050); color: var(--eh-teal-900); }

.headerActions { display: none; align-items: center; gap: 10px; }
.navDisclosure { position: static; }
.navDisclosure > summary {
  list-style: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
  padding: 10px 14px; border-radius: var(--eh-r-pill); font-size: 15px; font-weight: 500;
  color: var(--eh-ink-soft); transition: background .18s ease, color .18s ease;
}
.navDisclosure > summary::-webkit-details-marker { display: none; }
.navDisclosure > summary:hover, .navDisclosure[open] > summary { background: var(--eh-teal-050); color: var(--eh-teal-900); }
.navDisclosure[open] > summary svg { transform: rotate(180deg); }
.navDisclosure > summary svg { transition: transform .18s ease; }
.megaMenu {
  position: absolute; left: 50%; top: calc(100% + 8px); transform: translateX(-50%); z-index: 30;
  width: min(1160px, calc(100vw - 32px)); overflow: hidden;
  background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: var(--eh-r-card-lg); box-shadow: var(--eh-shadow-lg);
}
.megaTop {
  display: flex; align-items: flex-end; justify-content: space-between; gap: 28px;
  padding: 24px 26px 20px; border-bottom: 1px solid var(--eh-line); background: var(--eh-surface);
}
.megaIntro { display: grid; gap: 4px; max-width: 620px; }
.megaIntro > span, .megaQuickEyebrow {
  font-size: var(--eh-font-meta); font-weight: 750; letter-spacing: .09em; text-transform: uppercase; color: var(--eh-teal-700);
}
.megaIntro h2 { margin: 0; font-size: 24px; line-height: 1.08; letter-spacing: -.025em; font-weight: 750; color: var(--eh-teal-900); }
.megaIntro p { margin: 3px 0 0; font-size: 13.5px; line-height: 1.45; color: var(--eh-ink-soft); }
.desktopNav .megaAllLink {
  display: inline-flex; align-items: center; gap: 8px; flex: none; padding: 9px 12px;
  border-radius: var(--eh-r-pill); background: var(--eh-teal-050); color: var(--eh-teal-900); font-size: 13px; font-weight: 700;
}
.desktopNav .megaAllLink:hover { background: var(--eh-teal-100); color: var(--eh-teal-900); }
.megaBody { display: grid; grid-template-columns: minmax(0,1fr) 286px; }
.megaServices { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 22px; padding: 22px 24px 24px; }
.megaGroup { min-width: 0; }
.megaGroup h3 {
  margin: 0 0 8px 7px; font-size: var(--eh-font-meta); line-height: 1.2; font-weight: 750; letter-spacing: .075em;
  text-transform: uppercase; color: var(--eh-ink-mute);
}
.megaGroupList { display: grid; gap: 2px; }
.desktopNav .megaService {
  display: grid; grid-template-columns: 34px minmax(0,1fr) 14px; align-items: start; gap: 9px;
  min-width: 0; padding: 9px 8px; border-radius: 14px; color: var(--eh-ink); transition: background var(--eh-dur-fast) var(--eh-ease), color var(--eh-dur-fast) var(--eh-ease);
}
.desktopNav .megaService:hover { background: var(--eh-teal-050); color: var(--eh-teal-900); }
.megaServiceIcon {
  width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--eh-line); border-radius: 10px; background: var(--eh-surface); color: var(--eh-teal-700); box-shadow: 0 1px 0 rgba(16,34,42,.03);
}
.megaServiceCopy { min-width: 0; display: grid; gap: 2px; }
.megaServiceCopy strong { font-size: 13px; line-height: 1.22; font-weight: 700; color: var(--eh-ink); }
.megaServiceCopy small {
  display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  color: var(--eh-ink-mute); font-size: var(--eh-font-meta); line-height: 1.35;
}
.megaServiceArrow { margin-top: 3px; color: var(--eh-teal-500); opacity: 0; transform: translateX(-3px); transition: opacity var(--eh-dur-fast) var(--eh-ease), transform var(--eh-dur-fast) var(--eh-ease); }
.megaService:hover .megaServiceArrow, .megaService:focus-visible .megaServiceArrow { opacity: 1; transform: translateX(0); }
.megaQuick {
  display: flex; flex-direction: column; min-width: 0; padding: 22px 20px 18px;
  border-left: 1px solid var(--eh-line); background: var(--eh-teal-050);
}
.megaQuickIntro { display: grid; gap: 7px; padding: 1px 1px 15px; }
.megaQuickIntro > strong { font-size: 18px; line-height: 1.18; letter-spacing: -.015em; color: var(--eh-teal-900); }
.megaQuickIntro > p { margin: 0; color: var(--eh-ink-soft); font-size: var(--eh-font-meta); line-height: 1.45; }
.desktopNav a.megaPrimaryAction {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 5px; padding: 11px 12px;
  border-radius: var(--eh-r-btn); background: var(--eh-teal-700); color: var(--eh-on-dark); font-size: var(--eh-font-meta); font-weight: 700; box-shadow: var(--eh-shadow-sm);
}
.desktopNav a.megaPrimaryAction:hover { background: var(--eh-teal-800); color: var(--eh-on-dark); }
.megaQuickLinks { display: grid; gap: 1px; padding-top: 9px; border-top: 1px solid var(--eh-line); }
.desktopNav .megaQuickLinks a {
  display: grid; grid-template-columns: minmax(0,1fr) 14px; align-items: center; gap: 10px; padding: 9px 5px;
  border-radius: 10px; color: var(--eh-ink); background: transparent;
}
.desktopNav .megaQuickLinks a:hover { background: rgba(255,255,255,.72); color: var(--eh-teal-900); }
.megaQuickLinks a > span { min-width: 0; display: grid; gap: 1px; }
.megaQuickLinks strong { font-size: var(--eh-font-meta); line-height: 1.25; font-weight: 700; }
.megaQuickLinks small { color: var(--eh-ink-mute); font-size: var(--eh-font-meta); line-height: 1.3; }
.megaQuickLinks svg { color: var(--eh-teal-500); }
.megaTrust { margin-top: auto; padding: 12px 3px 0; color: var(--eh-ink-mute); font-size: var(--eh-font-meta); line-height: 1.35; }
.helpDisclosure { position: relative; }
.helpMenu {
  position: absolute; right: 0; top: calc(100% + 10px); width: 220px; padding: 10px; z-index: 31;
  display: flex; flex-direction: column; background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: 18px; box-shadow: var(--eh-shadow-md);
}
.desktopNav .helpMenu a { border-radius: 10px; }

/* Mobile menu (native <details>, hydration-free) */
.mobileMenu { position: relative; }
.mobileMenu summary {
  list-style: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--eh-line); background: var(--eh-surface);
  color: var(--eh-teal-900);
}
.mobileMenu summary::-webkit-details-marker { display: none; }
.mobileMenu .closeIcon { display: none; }
.mobileMenu[open] .closeIcon { display: block; }
.mobileMenu[open] .menuIcon { display: none; }
.mobileMenu nav {
  position: absolute; right: 0; top: calc(100% + 10px); width: min(92vw, 360px);
  display: flex; flex-direction: column; gap: 2px; padding: 12px;
  background: var(--eh-surface); border: 1px solid var(--eh-line);
  border-radius: 20px; box-shadow: var(--eh-shadow-md);
}
.mobileMenu nav a { padding: 12px 14px; border-radius: 12px; font-weight: 500; color: var(--eh-ink); }
.mobileMenu nav a:hover { background: var(--eh-teal-050); }
.mobileMenuActions { display: flex; flex-direction: column; gap: 8px; padding-top: 10px; margin-top: 8px; border-top: 1px solid var(--eh-line); }
.mobileMenuActions a { text-align: center; }
.mobileDisclosure { border-top: 1px solid var(--eh-line); border-bottom: 1px solid var(--eh-line); }
.mobileDisclosure + .mobileDisclosure { border-top: 0; }
.mobileMenu .mobileDisclosure > summary {
  width: 100%; height: auto; min-height: 44px; padding: 10px 14px; border: 0; border-radius: 12px;
  justify-content: space-between; background: transparent; color: var(--eh-ink); font-weight: 650;
}
.mobileDisclosure[open] > summary { color: var(--eh-teal-900); background: var(--eh-teal-050); }
.mobileDisclosure[open] > summary svg { transform: rotate(180deg); }
.mobileDisclosure > div { display: grid; padding: 4px 0 8px 10px; }
.mobileMenu .mobileDisclosure > div a { padding: 9px 12px; font-size: 14px; color: var(--eh-ink-soft); }
.mobileMenu .mobileAllLink { margin: 0 10px 8px; padding: 9px 12px; color: var(--eh-teal-700); font-weight: 650; }

@media (min-width: 960px) {
  .desktopNav, .headerActions { display: flex; }
  .mobileMenu { display: none; }
}

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 22px; border-radius: var(--eh-r-btn);
  font-weight: 600; font-size: 16px; line-height: 1; letter-spacing: -0.005em;
  border: 1px solid transparent; cursor: pointer; white-space: nowrap;
  transition: transform .18s ease, background .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.btn:active { transform: translateY(1px); }
.btnPrimary { composes: btn; background: var(--eh-teal-700); color: var(--eh-on-dark); box-shadow: 0 8px 20px -10px rgba(16, 82, 88, .6); }
.btnPrimary:hover { background: var(--eh-teal-800); }
.btnTerra { composes: btn; background: var(--eh-terra); color: var(--eh-on-dark); }
.btnTerra:hover { background: var(--eh-terra-deep); }
.btnGhost { composes: btn; background: transparent; color: var(--eh-teal-900); border-color: var(--eh-line-strong); }
.btnGhost:hover { background: var(--eh-surface); border-color: var(--eh-teal-300); }
.btnOnDark { composes: btn; background: var(--eh-on-dark); color: var(--eh-teal-900); }
.btnOnDark:hover { background: var(--eh-surface); }
.btnGhostOnDark { composes: btn; background: transparent; color: var(--eh-on-dark); border-color: var(--eh-on-dark-line); }
.btnGhostOnDark:hover { background: rgba(255,255,255,.08); }
.btnSm { min-height: 40px; padding: 0 16px; font-size: 14px; }
.btnLg { min-height: 56px; padding: 0 28px; font-size: 17px; }
.textLink { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--eh-teal-700); }
.textLink:hover { color: var(--eh-teal-900); text-decoration: underline; text-underline-offset: 3px; }

/* ---------- Type helpers ---------- */
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: var(--eh-font-meta); font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--eh-teal-500);
}
.eyebrow::before { content: ''; width: 18px; height: 2px; border-radius: 2px; background: currentColor; }
.eyebrowTerra { composes: eyebrow; color: var(--eh-terra); }
.onDark .eyebrow { color: var(--eh-teal-300); }
.lead { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-ink-soft); }
.onDark .lead { color: var(--eh-on-dark-soft); }

/* ---------- Sections ---------- */
.section { padding: var(--eh-section-y) 0; }
.sectionTight { padding: var(--eh-section-y-tight) 0; }
.toneCanvas { background: var(--eh-canvas); }
.toneSurface { background: var(--eh-surface); }
.toneSoft { background: var(--eh-teal-050); }
.toneSand { background: var(--eh-sand-100); }
.toneDark { background: var(--eh-teal-900); color: var(--eh-on-dark); }
.onDark { color: var(--eh-on-dark); }

.sectionHead { display: flex; flex-direction: column; gap: 16px; max-width: 720px; margin-bottom: clamp(36px, 5vw, 56px); }
.sectionHeadCenter { composes: sectionHead; align-items: center; text-align: center; margin-left: auto; margin-right: auto; }
.sectionHead h2 { font-size: var(--eh-h2); line-height: 1.08; letter-spacing: -0.03em; font-weight: 700; }
.sectionHead p { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-muted); }
.onDark .sectionHead p { color: var(--eh-on-dark-soft); }

.sectionInner { composes: container; }

/* ---------- Page hero (subpages) ---------- */
.pageHero { padding: clamp(48px, 7vw, 96px) 0 clamp(40px, 6vw, 72px); background: var(--eh-canvas); }
.pageHeroGrid { composes: container; display: flex; flex-direction: column; gap: 40px; }
.pageHeroCopy { display: flex; flex-direction: column; gap: 22px; max-width: 640px; }
.pageHeroCopy h1 { font-size: var(--eh-h1); line-height: 1.04; letter-spacing: -0.035em; font-weight: 800; color: var(--eh-teal-900); }
.pageHeroCopy p { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-ink-soft); }
.heroActions { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 6px; }
.pageHeroAside { display: flex; justify-content: center; }
@media (min-width: 960px) {
  .pageHeroGrid { flex-direction: row; align-items: center; justify-content: space-between; }
  .pageHeroCopy { flex: 1 1 52%; }
  .pageHeroAside { flex: 0 1 44%; justify-content: flex-end; }
}

/* ---------- Home hero (dark stage) ---------- */
.homeHero {
  position: relative; overflow: hidden;
  background:
    radial-gradient(1200px 600px at 85% -10%, rgba(31,122,128,.45), transparent 60%),
    radial-gradient(800px 500px at -10% 110%, rgba(217,185,138,.18), transparent 60%),
    var(--eh-teal-900);
  color: var(--eh-on-dark);
  padding: clamp(40px, 6vw, 80px) 0 clamp(56px, 8vw, 104px);
}
.homeHeroInner { composes: container; display: flex; flex-direction: column; gap: 44px; }
.homeHeroCopy { display: flex; flex-direction: column; gap: 24px; max-width: 640px; }
.homeHeroCopy h1 { font-size: var(--eh-display); line-height: 1.0; letter-spacing: -0.04em; font-weight: 800; }
.homeHeroCopy h1 em { font-style: normal; color: var(--eh-sand-400); }
.homeHeroCopy > p { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-on-dark-soft); max-width: 560px; }
.homeHeroVisual { display: flex; justify-content: center; }
@media (min-width: 1000px) {
  .homeHeroInner { flex-direction: row; align-items: center; justify-content: space-between; gap: 48px; }
  .homeHeroCopy { flex: 1 1 56%; }
  .homeHeroVisual { flex: 0 0 40%; justify-content: flex-end; }
}

/* ---------- Proof row ---------- */
.proofRow { display: flex; flex-wrap: wrap; gap: 10px 22px; font-size: 15px; font-weight: 500; color: var(--eh-muted); }
.proofRow span { display: inline-flex; align-items: center; gap: 7px; }
.proofRow svg { color: var(--eh-teal-500); flex: none; }
.onDark .proofRow { color: var(--eh-on-dark-soft); }
.onDark .proofRow svg { color: var(--eh-sand-400); }

/* ---------- Intake form ---------- */
.intake { display: flex; flex-direction: column; gap: 14px; width: 100%; }
.intake label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.intakeHead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.intakeLabel { font-size: 14px; font-weight: 600; color: var(--eh-ink-soft); }
.onDark .intakeLabel { color: var(--eh-on-dark-soft); }
.intakeBadge {
  font-size: var(--eh-font-meta); font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  padding: 6px 10px; border-radius: var(--eh-r-pill); background: var(--eh-sand-100); color: var(--eh-terra-deep);
}
.intakeRow {
  display: flex; flex-direction: column; gap: 10px; padding: 8px;
  background: var(--eh-surface); border: 1px solid var(--eh-line);
  border-radius: 20px; box-shadow: var(--eh-shadow-md);
}
.intakeField { position: relative; flex: 1 1 auto; display: flex; }
.intakeField input {
  width: 100%; min-height: 56px; padding: 0 18px; border: 0; border-radius: 14px;
  background: transparent; color: var(--eh-ink); font-size: 17px; outline: none;
}
.intakeField input::placeholder { color: transparent; }
.intakeField input:focus::placeholder { color: var(--eh-ink-mute); }
.intakeGhost {
  position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
  pointer-events: none; color: var(--eh-ink-mute); font-size: 17px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: calc(100% - 36px);
  transition: opacity var(--fade, .38s) ease;
}
.intakeRow:focus-within .intakeGhost[data-visible='true'] { opacity: 0 !important; }
.intakeRow button {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; flex: none;
  min-height: 56px; padding: 0 24px; border-radius: 14px; border: 0; cursor: pointer;
  font-weight: 600; font-size: 16px; line-height: 1; white-space: nowrap;
  background: var(--eh-teal-700); color: var(--eh-on-dark); box-shadow: 0 8px 20px -10px rgba(16, 82, 88, .6);
  transition: background .18s ease, transform .18s ease;
}
.intakeRow button:hover { background: var(--eh-teal-800); }
.intakeRow button:active { transform: translateY(1px); }
@media (min-width: 640px) {
  .intakeRow { flex-direction: row; align-items: center; }
}
.chipRow { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  border: 1px solid var(--eh-line); background: var(--eh-surface); color: var(--eh-ink-soft);
  padding: 8px 14px; border-radius: var(--eh-r-pill); font-size: 14px; font-weight: 500; cursor: pointer;
  transition: border-color .18s ease, color .18s ease, background .18s ease;
}
.chip:hover { border-color: var(--eh-teal-300); color: var(--eh-teal-900); background: var(--eh-teal-050); }
.onDark .chip { background: rgba(255,255,255,.06); border-color: var(--eh-on-dark-line); color: var(--eh-on-dark-soft); }
.onDark .chip:hover { background: rgba(255,255,255,.12); color: var(--eh-on-dark); border-color: rgba(255,255,255,.3); }
.intakeMeta { composes: proofRow; font-size: 14px; }

/* Compact/sticky variant */
.intakeCompact .intakeHead, .intakeCompact .chipRow, .intakeCompact .intakeMeta { display: none; }
.intakeCompact .intakeRow { box-shadow: var(--eh-shadow-sm); padding: 6px; border-radius: 16px; }
.intakeCompact .intakeField input, .intakeCompact .intakeRow button { min-height: 48px; font-size: 15px; }
.intakeCompact .intakeGhost { font-size: 15px; }

.stickyBar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 55;
  padding: 10px var(--eh-gutter) calc(10px + env(safe-area-inset-bottom));
  background: var(--eh-surface); /* solid, no glass (DESIGN.md §2) */
  border-top: 1px solid var(--eh-line);
  transform: translateY(110%); transition: transform .3s ease;
}
.stickyBar[data-visible='true'] { transform: translateY(0); }
.stickyBarInner { composes: container; display: flex; align-items: center; gap: 16px; padding: 0; }
.stickyBarText { display: none; flex: none; font-weight: 600; color: var(--eh-teal-900); }
.stickyBarInner form { flex: 1 1 auto; }
@media (min-width: 900px) {
  .stickyBar { bottom: auto; top: 72px; border-top: 0; border-bottom: 1px solid var(--eh-line); transform: translateY(calc(-100% - 80px)); padding: 8px var(--eh-gutter); }
  .stickyBarText { display: block; }
  .stickyBarInner form { max-width: 720px; }
}

/* ---------- Cards / grids ---------- */
.cardGrid { display: grid; gap: 16px; grid-template-columns: 1fr; }
.cardGrid[data-cols='2'] { grid-template-columns: 1fr; }
@media (min-width: 720px) {
  .cardGrid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .cardGrid[data-cols='2'] { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .cardGrid[data-cols='3'] { grid-template-columns: repeat(3, 1fr); }
  .cardGrid[data-cols='4'] { grid-template-columns: repeat(4, 1fr); }
}
.card {
  display: flex; flex-direction: column; gap: 12px; padding: 28px;
  background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: var(--eh-r-card);
}
.card h3 { font-size: var(--eh-h3); line-height: 1.25; letter-spacing: -0.015em; font-weight: 700; color: var(--eh-teal-900); }
.card p { color: var(--eh-ink-soft); font-size: 16px; }
.cardIcon {
  width: 44px; height: 44px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center;
  background: var(--eh-teal-050); color: var(--eh-teal-700);
}
.cardSand { composes: card; background: var(--eh-sand-100); border-color: transparent; }
.cardSoft { composes: card; background: var(--eh-teal-050); border-color: transparent; }
.cardDark { composes: card; background: var(--eh-teal-900); border-color: transparent; color: var(--eh-on-dark); }
.cardDark h3 { color: var(--eh-on-dark); }
.cardDark p { color: var(--eh-on-dark-soft); }

/* Content pages (blog, lexikon, kontakt, legal): token-based cards & panels.
   Added 2026-09-04 — replaces inline styles on those pages (DESIGN.md §2). */
.stackLg { display: grid; gap: 24px; max-width: 800px; margin: 0 auto; }
.linkRow { display: flex; gap: 12px; flex-wrap: wrap; }
.centerRow { display: flex; justify-content: center; }
.cardKicker { display: flex; align-items: center; gap: 8px; color: var(--eh-teal-700); font-size: var(--eh-font-meta); font-weight: 700; }
.cardFoot { margin-top: auto; }
.cardFoot .textLink { font-size: 14px; font-weight: 700; }
.cardTitle { font-size: 18px; font-weight: 700; color: var(--eh-ink); letter-spacing: -0.02em; }
.cardText { font-size: 15px; line-height: 1.65; color: var(--eh-ink-soft); }
.onDarkSoft { color: var(--eh-on-dark-soft); }

/* Emergency / warning panels (functional red, matches app danger tones). */
.panel { display: flex; flex-direction: column; gap: 8px; padding: 22px; border-radius: 18px; border: 1px solid var(--eh-line); background: var(--eh-surface); }
.panelWarn { composes: panel; border-color: #f1d4cf; background: #fff5f3; }
.panelTitle { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: var(--eh-ink); }
.panelTitleWarn { composes: panelTitle; color: #a12b25; }
.panelTitleAccent { composes: panelTitle; color: var(--eh-teal-700); }
.panelText { font-size: 13px; line-height: 1.5; color: var(--eh-ink-mute); }
.panelWarn .panelText { color: #7c5a54; }

/* Numbered manifest rows (ueber-uns principles). */
.principleList { display: grid; gap: 32px; margin-top: 36px; }
.principleRow { display: grid; grid-template-columns: minmax(52px, 80px) minmax(0, 1fr); gap: 24px; padding-bottom: 32px; border-bottom: 1px solid var(--eh-line); }
.principleNum { font-size: 20px; font-weight: 700; color: var(--eh-teal-700); font-variant-numeric: tabular-nums; }
.principleBody h3 { font-size: 20px; font-weight: 700; color: var(--eh-teal-900); letter-spacing: -0.02em; }
.principleBody p { font-size: 15px; line-height: 1.6; color: var(--eh-ink-soft); max-width: 680px; }

/* Problem mirror quote cards */
.mirrorCard {
  composes: card; gap: 18px; padding: 30px 28px;
  background: var(--eh-surface);
}
.mirrorQuote { font-size: 21px; line-height: 1.35; font-weight: 600; letter-spacing: -0.015em; color: var(--eh-teal-900); }
.mirrorQuote::before { content: '„'; color: var(--eh-terra); }
.mirrorQuote::after { content: '“'; color: var(--eh-terra); }
.mirrorTag { display: inline-flex; align-self: flex-start; padding: 5px 10px; border-radius: var(--eh-r-pill); background: var(--eh-sand-100); font-size: 13px; font-weight: 600; color: var(--eh-ink-soft); }

/* Statement */
.statement { padding: var(--eh-section-y) 0; }
.statementInner { composes: container; display: flex; flex-direction: column; gap: 20px; max-width: 900px; text-align: center; align-items: center; }
.statementText { font-size: clamp(26px, 3.2vw, 40px); line-height: 1.18; letter-spacing: -0.03em; font-weight: 700; color: var(--eh-teal-900); }
.statementText mark { background: linear-gradient(transparent 60%, var(--eh-sand-400) 60%); color: inherit; padding: 0 2px; }
.toneDark .statementText { color: var(--eh-on-dark); }

/* Before/after */
.beforeAfter { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
@media (min-width: 900px) { .beforeAfter { flex-direction: row; align-items: stretch; } .beforeAfter > * { flex: 1 1 0; } }
.baPanel { display: flex; flex-direction: column; gap: 14px; padding: 26px 28px; border-radius: var(--eh-r-card); }
.baBefore { composes: baPanel; background: var(--eh-surface); border: 1px dashed var(--eh-line-strong); }
.baAfter { composes: baPanel; background: var(--eh-teal-900); color: var(--eh-on-dark); }
.baLabel { font-size: var(--eh-font-meta); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-ink-mute); }
.baAfter .baLabel { color: var(--eh-teal-300); }
.baList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.baList li { display: flex; align-items: flex-start; gap: 10px; font-size: 16px; line-height: 1.45; }
.baBefore li { color: var(--eh-ink-soft); text-decoration-color: var(--eh-line-strong); }
.baBefore li svg { color: var(--eh-terra); flex: none; margin-top: 3px; }
.baAfter li svg { color: var(--eh-sand-400); flex: none; margin-top: 3px; }

/* Steps */
.steps { display: flex; flex-direction: column; gap: 20px; counter-reset: step; }
@media (min-width: 960px) { .steps { flex-direction: row; align-items: stretch; } .steps > * { flex: 1 1 0; } }
.step { composes: card; padding: 26px; gap: 18px; position: relative; }
.stepNum {
  display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 12px;
  background: var(--eh-teal-700); color: var(--eh-on-dark); font-weight: 700; font-size: 15px;
}
.stepBody { display: flex; flex-direction: column; gap: 8px; }
.stepVisual { margin-top: auto; display: flex; justify-content: center; padding-top: 8px; }

/* Benefits (alternating) */
.benefit { display: flex; flex-direction: column; gap: 32px; padding: clamp(28px, 4vw, 48px); border-radius: var(--eh-r-card-lg); background: var(--eh-surface); border: 1px solid var(--eh-line); }
.benefitCopy { display: flex; flex-direction: column; gap: 14px; max-width: 480px; }
.benefitCopy h3 { font-size: clamp(24px, 2.6vw, 32px); line-height: 1.12; letter-spacing: -0.025em; font-weight: 700; color: var(--eh-teal-900); }
.benefitCopy p { color: var(--eh-ink-soft); }
.benefitVisual { display: flex; justify-content: center; align-items: center; }
@media (min-width: 900px) {
  .benefit { flex-direction: row; align-items: center; justify-content: space-between; gap: 48px; }
  .benefit[data-flip='true'] { flex-direction: row-reverse; }
  .benefitCopy { flex: 1 1 48%; }
  .benefitVisual { flex: 0 1 44%; }
}
.benefitList { display: flex; flex-direction: column; gap: 24px; }

/* Facts */
.facts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (min-width: 900px) { .facts { grid-template-columns: repeat(4, 1fr); } }
.fact { display: flex; flex-direction: column; gap: 6px; padding: 22px 24px; border-radius: 20px; background: var(--eh-surface); border: 1px solid var(--eh-line); }
.factValue { font-size: clamp(28px, 3vw, 38px); line-height: 1; letter-spacing: -0.03em; font-weight: 800; color: var(--eh-teal-700); }
.factLabel { font-size: 15px; color: var(--eh-ink-soft); }
.onDark .fact { background: rgba(255,255,255,.06); border-color: var(--eh-on-dark-line); }
.onDark .factValue { color: var(--eh-sand-400); }
.onDark .factLabel { color: var(--eh-on-dark-soft); }

/* Testimonials */
.testimonial { composes: card; gap: 18px; justify-content: space-between; }
.testimonialText { font-size: 18px; line-height: 1.5; color: var(--eh-ink); }
.testimonialWho { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--eh-ink-soft); }
.avatar {
  width: 40px; height: 40px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center;
  background: var(--eh-teal-100); color: var(--eh-teal-900); font-weight: 700; font-size: 14px;
}
.testimonialWho strong { display: block; color: var(--eh-ink); font-weight: 600; }

/* Category chips */
.catGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (min-width: 720px) { .catGrid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .catGrid { grid-template-columns: repeat(4, 1fr); } }
.cat {
  display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-radius: 16px;
  background: var(--eh-surface); border: 1px solid var(--eh-line); font-weight: 600; color: var(--eh-teal-900); font-size: 15px;
  transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease;
}
.cat:hover { border-color: var(--eh-teal-300); transform: translateY(-2px); box-shadow: var(--eh-shadow-sm); }
.cat svg { color: var(--eh-teal-500); flex: none; }
.catMore { composes: cat; background: var(--eh-teal-050); border-color: transparent; justify-content: space-between; }

/* Pilot band */
.pilotBand {
  composes: container;
  display: flex; flex-direction: column; gap: 28px; padding: clamp(28px, 4vw, 48px);
  border-radius: var(--eh-r-card-lg); background: var(--eh-sand-100); border: 1px solid var(--eh-sand-200);
}
.pilotCopy { display: flex; flex-direction: column; gap: 14px; }
.pilotCopy h2 { font-size: clamp(28px, 3vw, 40px); line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; color: var(--eh-teal-900); }
.pilotCopy p { color: var(--eh-ink-soft); font-size: 17px; }
.pilotPerks { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.pilotPerks li { display: flex; gap: 10px; align-items: flex-start; font-size: 16px; }
.pilotPerks svg { color: var(--eh-terra); flex: none; margin-top: 3px; }
.pilotActions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
@media (min-width: 900px) {
  .pilotBand { flex-direction: row; align-items: center; justify-content: space-between; gap: 48px; }
  .pilotCopy { flex: 1 1 58%; }
  .pilotSide { flex: 0 1 36%; }
}
.pilotBadge {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: var(--eh-r-pill);
  background: var(--eh-terra); color: var(--eh-on-dark); font-size: var(--eh-font-meta); font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
}
.pilotBadge::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--eh-on-dark); }

/* FAQ */
.faq { display: flex; flex-direction: column; gap: 10px; max-width: 820px; }
.faqItem { border: 1px solid var(--eh-line); border-radius: 18px; background: var(--eh-surface); overflow: hidden; }
.faqItem summary {
  list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 20px 24px; font-weight: 600; font-size: 17px; color: var(--eh-teal-900);
}
.faqItem summary::-webkit-details-marker { display: none; }
.faqItem summary svg { flex: none; color: var(--eh-teal-500); transition: transform .2s ease; }
.faqItem[open] summary svg { transform: rotate(45deg); }
.faqItem > div { padding: 0 24px 22px; color: var(--eh-ink-soft); font-size: 16px; line-height: 1.6; }
.faqItem > div p + p { margin-top: 10px; }

/* Final CTA */
.finalCta { composes: toneDark; position: relative; overflow: hidden; padding: var(--eh-section-y) 0; }
.finalCta::after {
  content: ''; position: absolute; inset: auto -10% -60% auto; width: 60%; aspect-ratio: 1; border-radius: 50%;
  background: radial-gradient(circle, rgba(31,122,128,.55), transparent 65%); pointer-events: none;
}
.finalCtaInner { composes: container; position: relative; display: flex; flex-direction: column; gap: 32px; max-width: 860px; align-items: center; text-align: center; }
.finalCtaInner h2 { font-size: var(--eh-h2); line-height: 1.08; letter-spacing: -0.03em; font-weight: 800; }
.finalCtaInner > p { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-on-dark-soft); max-width: 620px; }
.finalCtaInner form { text-align: left; max-width: 760px; }
.finalCtaSecondary { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 20px; align-items: center; color: var(--eh-on-dark-soft); font-size: 15px; }
.finalCtaSecondary a { color: var(--eh-on-dark); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--eh-teal-300); }

/* CTA band (subpages) */
.ctaBand {
  composes: container; display: flex; flex-direction: column; gap: 28px; padding: clamp(32px, 4vw, 52px);
  border-radius: var(--eh-r-card-lg); background: var(--eh-teal-900); color: var(--eh-on-dark);
  margin-top: var(--eh-section-y-tight); margin-bottom: var(--eh-section-y);
}
.ctaBand h2 { font-size: clamp(26px, 3vw, 38px); line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; }
.ctaBand p { color: var(--eh-on-dark-soft); font-size: 17px; }
.ctaBandCopy { display: flex; flex-direction: column; gap: 14px; }
.ctaBandActions { display: flex; flex-wrap: wrap; gap: 12px; }
@media (min-width: 900px) { .ctaBand { flex-direction: row; align-items: center; justify-content: space-between; gap: 40px; } .ctaBandCopy { flex: 1 1 60%; } }

/* Feature grid (legacy API) */
.featureGrid { composes: cardGrid; }
.feature { composes: card; }
.feature h3 { font-size: 19px; }

/* Numbered (legacy API) */
.numberedList { display: flex; flex-direction: column; gap: 4px; }
.numberedRow { display: flex; gap: 20px; padding: 22px 0; border-top: 1px solid var(--eh-line); }
.numberedNum { flex: none; width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; background: var(--eh-teal-700); color: var(--eh-on-dark); font-weight: 700; font-size: 14px; }
.numberedBody { display: flex; flex-direction: column; gap: 6px; }
.numberedBody h3 { font-size: 20px; letter-spacing: -0.015em; font-weight: 700; color: var(--eh-teal-900); }
.numberedBody p { color: var(--eh-ink-soft); }

/* Split / panels / lists */
.split { display: flex; flex-direction: column; gap: 32px; }
@media (min-width: 900px) { .split { flex-direction: row; align-items: flex-start; gap: 48px; } .split > * { flex: 1 1 0; } }
.bulletList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.bulletList li { display: flex; gap: 12px; align-items: flex-start; font-size: 16px; line-height: 1.5; }
.bulletList li span { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--eh-teal-100); color: var(--eh-teal-900); font-size: var(--eh-font-meta); font-weight: 700; margin-top: 1px; }
.infoPanel { display: flex; flex-direction: column; gap: 12px; padding: 26px 28px; border-radius: var(--eh-r-card); background: var(--eh-sand-100); }
.infoPanel h3 { font-size: 22px; font-weight: 700; color: var(--eh-teal-900); letter-spacing: -0.02em; }
.panelLabel { font-size: var(--eh-font-meta); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-terra-deep); }
.infoPanel p { color: var(--eh-ink-soft); }
.legalNotice { display: flex; flex-direction: column; gap: 10px; padding: 22px 24px; border-radius: 18px; background: var(--eh-surface); border: 1px solid var(--eh-line); font-size: 15px; color: var(--eh-ink-soft); }
.legalNotice strong { color: var(--eh-ink); }
.prose { display: flex; flex-direction: column; gap: 14px; max-width: 720px; color: var(--eh-ink-soft); font-size: 17px; }
.prose h2 { font-size: 26px; letter-spacing: -0.02em; color: var(--eh-teal-900); padding-top: 14px; }
.prose h3 { font-size: 20px; color: var(--eh-teal-900); padding-top: 8px; }
.prose ul { margin: 0; padding-left: 20px; }

/* Photo */
.photo { position: relative; border-radius: var(--eh-r-card-lg); overflow: hidden; box-shadow: var(--eh-shadow-lg); }
.photo[data-ratio='4:3'] { aspect-ratio: 4 / 3; }
.photo img { width: 100%; height: 100%; object-fit: cover; }
.photoCaption {
  position: absolute; left: 16px; right: 16px; bottom: 16px; display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 14px; background: #fff; color: var(--eh-ink); font-size: 14px; font-weight: 500; /* solid, no glass */
}

/* Contact routing cards */
.routeCard { composes: card; gap: 14px; }
.routeCard a { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--eh-teal-700); margin-top: auto; }
.routeCard a:hover { color: var(--eh-teal-900); text-decoration: underline; text-underline-offset: 3px; }

/* Pricing */
.note { font-size: 15px; color: var(--eh-ink-soft); max-width: 760px; margin-top: 24px; }
.note a { color: var(--eh-teal-700); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }

/* Footer */
.footer { margin-top: auto; background: var(--eh-teal-900); color: var(--eh-on-dark); }
.footerIntake { border-bottom: 1px solid var(--eh-on-dark-line); }
.footerIntakeInner { composes: container; display: flex; flex-direction: column; gap: 20px; padding-top: 44px; padding-bottom: 44px; }
.footerIntakeInner h2 { font-size: clamp(22px, 2.4vw, 30px); letter-spacing: -0.025em; font-weight: 700; }
.footerIntakeInner form { max-width: 720px; }
@media (min-width: 960px) { .footerIntakeInner { flex-direction: row; align-items: center; justify-content: space-between; gap: 40px; } .footerIntakeInner h2 { flex: 0 0 34%; } .footerIntakeInner form { flex: 1 1 auto; } }
.footerInner { composes: container; display: flex; flex-direction: column; gap: 40px; padding-top: 56px; padding-bottom: 40px; }
.footerBrand { display: flex; flex-direction: column; gap: 16px; max-width: 320px; color: var(--eh-on-dark-soft); font-size: 15px; }
.footerBrand span { font-size: 13px; }
.footerClaim { font-size: 18px; font-weight: 600; color: var(--eh-on-dark); letter-spacing: -0.01em; }
.footerGrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; flex: 1 1 auto; }
@media (min-width: 720px) { .footerGrid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 960px) { .footerInner { flex-direction: row; gap: 64px; } }
.footerGrid h2 { font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-teal-300); margin-bottom: 14px; }
.footerGrid nav { display: flex; flex-direction: column; gap: 10px; }
.footerGrid a { font-size: 15px; color: var(--eh-on-dark-soft); }
.footerGrid a:hover { color: var(--eh-on-dark); }
.footerBottom { composes: container; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding-top: 20px; padding-bottom: 28px; border-top: 1px solid var(--eh-on-dark-line); font-size: 14px; color: var(--eh-on-dark-soft); }
.footerBottom a { color: var(--eh-on-dark); font-weight: 500; }

/* Timeline (so-funktionierts) */
.timeline { display: flex; flex-direction: column; gap: 0; max-width: 760px; }
.tlItem { display: flex; gap: 20px; padding: 18px 0; }
.tlRail { display: flex; flex-direction: column; align-items: center; flex: none; width: 28px; }
.tlDot { width: 14px; height: 14px; border-radius: 50%; background: var(--eh-teal-700); border: 3px solid var(--eh-teal-100); flex: none; margin-top: 5px; }
.tlLine { flex: 1 1 auto; width: 2px; background: var(--eh-line); margin-top: 6px; }
.tlItem:last-child .tlLine { display: none; }
.tlBody { display: flex; flex-direction: column; gap: 4px; }
.tlWhen { font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--eh-terra-deep); }
.tlBody h3 { font-size: 18px; font-weight: 700; color: var(--eh-teal-900); }
.tlBody p { color: var(--eh-ink-soft); font-size: 16px; }

/* Public state screens (root loading / error boundaries) */
.statePage {
  min-height: 100dvh; display: flex; align-items: center; justify-content: center;
  padding: var(--eh-gutter); background: var(--eh-canvas); color: var(--eh-ink); font-family: var(--eh-font);
}
.stateCard {
  display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  width: 100%; max-width: 520px; padding: clamp(28px, 4vw, 40px);
  background: var(--eh-surface); border: 1px solid var(--eh-line); border-radius: var(--eh-r-card-lg); box-shadow: var(--eh-shadow-md);
}
.stateCard h1 { font-size: clamp(24px, 3vw, 30px); line-height: 1.15; letter-spacing: -0.02em; color: var(--eh-teal-900); margin: 0; }
.stateCard p { color: var(--eh-ink-soft); margin: 0; }
.stateMark { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: var(--eh-teal-050); color: var(--eh-teal-700); }
.stateActions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
.stateSkeleton { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 8px; }
.stateSkeleton span {
  display: block; height: 12px; border-radius: 6px;
  background: linear-gradient(90deg, var(--eh-teal-050) 0%, var(--eh-teal-100) 50%, var(--eh-teal-050) 100%);
  background-size: 200% 100%; animation: shimmer 1.4s ease-in-out infinite;
}
.stateSkeleton span:nth-child(1) { width: 78%; }
.stateSkeleton span:nth-child(2) { width: 92%; }
.stateSkeleton span:nth-child(3) { width: 60%; }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .stateSkeleton span { animation: none; } }

/* Utility */
.stack { display: flex; flex-direction: column; gap: 24px; }
.center { text-align: center; align-items: center; }
.mt { margin-top: 40px; }
.srOnly { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .site *, .site *::before, .site *::after { transition-duration: 0.01ms !important; }
}

.footer .logoImg { filter: brightness(0) invert(1); opacity: .92; }
.timeline { list-style: none; margin: 0; padding: 0; }
.photo[data-ratio='4:5'] { aspect-ratio: 4 / 5; }
.photo[data-mw='440'] { max-width: 440px; align-self: center; }
.photo[data-mw='420'] { max-width: 420px; }
.numberedRow[data-pad='m'] { padding: 18px 0; }
.container[data-pad='none'] { padding: 0; }
.chipRow[data-density='airy'] { gap: 12px; }
.chip[data-size='lg'] { font-size: 16px; padding: 12px 18px; }

.faq[data-wide='true'] { max-width: none; }

/* Original logo requires its paper ground on the deep footer. */
.footerBrand > a { display: inline-flex; align-self: flex-start; padding: 8px; background: var(--eh-color-paper); }

`````

## src/components/marketing/site-shell.tsx

`````tsx
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { IntakeForm } from '@/components/home/intake-form';
import { ScrollShadow, SmoothScroll } from './motion';
import { SERVICE_CATEGORIES } from './service-catalog';
import './tokens.css';
import styles from './mkt.module.css';
import logoFull from './assets/logo-full.png';

// Self-hosted Inter Variable (DESIGN.md: "System-/Inter-nahe Sans"), scoped to
// the marketing shell so the accepted app screens stay untouched.
const interVariable = localFont({
  src: '../../fonts/InterVariable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-marketing',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

const helpLinks = [
  ['Hilfe & FAQ', '/hilfe'],
  ['Sicherheit & Daten', '/sicherheit'],
  ['Blog', '/blog'],
  ['Lexikon', '/lexikon'],
  ['Kontakt', '/kontakt'],
] as const;

const mobileMore = [
  ['Für Eigenheimbesitzer', '/eigenheimbesitzer'],
  ['Pilotphase', '/pilotphase'],
  ['Für Betriebe', '/partner'],
  ['Über uns', '/ueber-uns'],
  ['Kontakt', '/kontakt'],
] as const;

const megaServiceGroups = [
  { title: 'Technik & Versorgung', items: SERVICE_CATEGORIES.slice(0, 4) },
  { title: 'Gebäude & Grundstück', items: SERVICE_CATEGORIES.slice(4, 8) },
  { title: 'Service & Sonderfälle', items: SERVICE_CATEGORIES.slice(8, 12) },
] as const;

const footerGroups = [
  {
    title: 'Produkt',
    links: [
      ["So funktioniert's", '/so-funktionierts'],
      ['Leistungen', '/leistungen'],
      ['Digitale Hausakte', '/hausakte'],
      ['Dein Ansprechpartner', '/so-funktionierts#ansprechpartner'],
      ['Preise', '/preise'],
    ],
  },
  {
    title: 'Für Eigentümer',
    links: [
      ['Für Eigenheimbesitzer', '/eigenheimbesitzer'],
      ['Pilotphase', '/pilotphase'],
      ['Sicherheit & Daten', '/sicherheit'],
      ['Beratung', '/beratung'],
      ['Notfall', '/notfall'],
      ['Versicherung', '/versicherung'],
      ['Immobilienverkauf', '/immobilienverkauf'],
      ['Hilfe & FAQ', '/hilfe'],
      ['Anmelden', '/login'],
    ],
  },
  {
    title: 'Für Betriebe',
    links: [
      ['Partner werden', '/partner'],
      ['Partner-App', '/partner#partner-app'],
      ['Qualitätsmodell', '/partner#qualitaet'],
      ['Partner-Modelle', '/preise'],
      ['Partner-Login', '/login'],
    ],
  },
  {
    title: 'Einfach Hausen',
    links: [
      ['Über uns', '/ueber-uns'],
      ['Kontakt', '/kontakt'],
      ['Impressum', '/impressum'],
      ['Datenschutz', '/datenschutz'],
      ['AGB', '/agb'],
      ['Barrierefreiheit', '/barrierefreiheit'],
    ],
  },
] as const;

export function MarketingShell({ children, footerIntake = true }: { children: React.ReactNode; footerIntake?: boolean }) {
  return (
    <div className={`mkt ${styles.site} ${interVariable.variable}`}>
      <SmoothScroll />
      <a className={styles.skipLink} href="#main-content">Zum Inhalt springen</a>
      <ScrollShadow>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            {/* Native navigation keeps the public shell hydration-free. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className={styles.logoLink} href="/" aria-label="einfachhausen Startseite">
              <Image src={logoFull} alt="einfachhausen" width={114} height={72} priority className={styles.logoImg} />
            </a>
            <nav className={styles.desktopNav} aria-label="Hauptnavigation">
              <a href="/so-funktionierts">So funktioniert&apos;s</a>
              <details className={styles.navDisclosure}>
                <summary>Leistungen <ChevronDown size={14} aria-hidden="true" /></summary>
                <div className={styles.megaMenu}>
                  <div className={styles.megaTop}>
                    <div className={styles.megaIntro}>
                      <span>Alles rund ums Eigenheim</span>
                      <h2>Was steht bei dir an?</h2>
                      <p>Finde den passenden Bereich direkt — oder beschreib einfach dein Anliegen.</p>
                    </div>
                    <Link className={styles.megaAllLink} href="/leistungen">
                      Alle Leistungen <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                  <div className={styles.megaBody}>
                    <div className={styles.megaServices} aria-label="Leistungsbereiche">
                      {megaServiceGroups.map((group) => (
                        <section className={styles.megaGroup} key={group.title}>
                          <h3>{group.title}</h3>
                          <div className={styles.megaGroupList}>
                            {group.items.map(({ slug, shortTitle, description, icon: Icon }) => (
                              <a key={slug} href={`/leistungen/${slug}`} className={styles.megaService}>
                                <span className={styles.megaServiceIcon}><Icon size={18} aria-hidden="true" /></span>
                                <span className={styles.megaServiceCopy}>
                                  <strong>{shortTitle}</strong>
                                  <small>{description}</small>
                                </span>
                                <ArrowRight className={styles.megaServiceArrow} size={14} aria-hidden="true" />
                              </a>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                    <aside className={styles.megaQuick} aria-label="Schnelle Wege">
                      <div className={styles.megaQuickIntro}>
                        <span className={styles.megaQuickEyebrow}>Einfach anfangen</span>
                        <strong>Noch nicht sicher, was du brauchst?</strong>
                        <p>Beschreib kurz, was ansteht. Wir helfen beim Einordnen — ohne Buchungszwang.</p>
                        <Link className={styles.megaPrimaryAction} href="/#anliegen">
                          Anliegen beschreiben <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      </div>
                      <div className={styles.megaQuickLinks}>
                        <a href="/beratung"><span><strong>Beratung</strong><small>Erst fachlich einordnen</small></span><ArrowRight size={13} aria-hidden="true" /></a>
                        <a href="/notfall"><span><strong>Notfall</strong><small>Dringenden Fall richtig starten</small></span><ArrowRight size={13} aria-hidden="true" /></a>
                        <a href="/so-funktionierts#ansprechpartner"><span><strong>Ansprechpartner</strong><small>Persönlichen Kontakt finden</small></span><ArrowRight size={13} aria-hidden="true" /></a>
                      </div>
                      <small className={styles.megaTrust}>Kein Auftrag ohne deine Entscheidung.</small>
                    </aside>
                  </div>
                </div>
              </details>
              <a href="/hausakte">Hausakte</a>
              <a href="/preise">Preise</a>
              <details className={`${styles.navDisclosure} ${styles.helpDisclosure}`}>
                <summary>Hilfe <ChevronDown size={14} aria-hidden="true" /></summary>
                <div className={styles.helpMenu}>
                  {helpLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
                </div>
              </details>
            </nav>
            <div className={styles.headerActions}>
              <a className={`${styles.btnGhost} ${styles.btnSm}`} href="/login">Anmelden</a>
              <a className={`${styles.btnPrimary} ${styles.btnSm}`} href="/register?role=homeowner">Kostenlos starten <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
            <details className={styles.mobileMenu}>
              <summary aria-label="Menü öffnen"><Menu className={styles.menuIcon} size={22} /><X className={styles.closeIcon} size={22} /></summary>
              <nav aria-label="Mobile Navigation">
                <a href="/so-funktionierts">So funktioniert&apos;s</a>
                <details className={styles.mobileDisclosure}>
                  <summary>Leistungen <ChevronDown size={16} aria-hidden="true" /></summary>
                  <div>{SERVICE_CATEGORIES.map(({ slug, shortTitle }) => <a key={slug} href={`/leistungen/${slug}`}>{shortTitle}</a>)}</div>
                  <Link className={styles.mobileAllLink} href="/leistungen">Alle Leistungen</Link>
                </details>
                <a href="/hausakte">Hausakte</a>
                <a href="/preise">Preise</a>
                <details className={styles.mobileDisclosure}>
                  <summary>Hilfe <ChevronDown size={16} aria-hidden="true" /></summary>
                  <div>{helpLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>
                </details>
                {mobileMore.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
                <a href="/impressum">Impressum</a>
                <a href="/datenschutz">Datenschutz</a>
                <a href="/agb">AGB</a>
                <div className={styles.mobileMenuActions}>
                  <a className={styles.btnGhost} href="/login">Anmelden</a>
                  <a className={styles.btnPrimary} href="/register?role=homeowner">Kostenlos starten</a>
                </div>
              </nav>
            </details>
          </div>
        </header>
      </ScrollShadow>
      <main id="main-content">{children}</main>
      <footer className={`${styles.footer} ${styles.onDark}`}>
        {footerIntake && (
          <div className={styles.footerIntake}>
            <div className={styles.footerIntakeInner}>
              <h2>Noch nicht gestartet? Sag uns einfach, was ansteht.</h2>
              <IntakeForm variant="band" />
            </div>
          </div>
        )}
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" aria-label="einfachhausen Startseite"><Image src={logoFull} alt="einfachhausen" width={140} height={97} className={styles.logoImg} /></a>
            <p className={styles.footerClaim}>Regional. Menschlich. Organisiert.</p>
            <p>Dein persönlicher Hausmanager: Anliegen beschreiben, geprüfte Partner aus deiner Region übernehmen, alles bleibt in deiner Hausakte.</p>
            <span>© 2026 Einfach Hausen</span>
          </div>
          <div className={styles.footerGrid}>
            {footerGroups.map((group) => (
              <section key={group.title}>
                <h2>{group.title}</h2>
                <nav aria-label={group.title}>
                  {group.links.map(([label, href]) => <a key={`${group.title}-${href}-${label}`} href={href}>{label}</a>)}
                </nav>
              </section>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>Einfach Hausen organisiert digital. Ausgeführt wird durch eigenständige, geprüfte Partnerbetriebe. Kein Auftrag ohne deine Entscheidung.</p>
          <a href="/kontakt">Kontakt</a>
        </div>
      </footer>
    </div>
  );
}

`````

## src/components/marketing/tokens.css

`````css
/* Legacy aliases only. Canonical values: packages/eh-design/src/tokens.json. */
:root {
  --eh-fg: var(--eh-color-ink);
  --eh-rule: var(--eh-color-line);

  --eh-green-900: var(--eh-color-deep);
  --eh-green-700: var(--eh-color-petrol);
  --eh-green-600: var(--eh-color-petrol);
  --eh-green-100: var(--eh-color-sand);
  --eh-green-50: var(--eh-color-paper);
  --eh-bg: var(--eh-color-paper);
  --eh-surface: var(--eh-color-white);
  --eh-surface-subtle: var(--eh-color-paper);
  --eh-text: var(--eh-color-ink);
  --eh-text-secondary: var(--eh-color-secondary);
  --eh-border: var(--eh-color-line);
  --eh-border-strong: var(--eh-color-secondary);
  --eh-terra: var(--eh-color-terra);
  --eh-terra-deep: var(--eh-color-terra);
  --eh-terra-soft: var(--eh-color-sand);
  --eh-on-dark: var(--eh-color-paper);
  --eh-soft: var(--eh-surface-subtle);
  --eh-soft-2: var(--eh-green-50);
  --eh-muted: var(--eh-text-secondary);
  --eh-accent: var(--eh-green-700);
  --eh-accent-hover: var(--eh-green-900);
  --eh-accent-soft: var(--eh-green-50);
  --eh-dark: var(--eh-green-900);
  --eh-dark-2: var(--eh-text);
  --eh-dark-border: var(--eh-border-strong);
  --eh-brand: var(--eh-green-900);
  --eh-brand-2: var(--eh-green-700);
  --green: var(--eh-green-700);
  --green-dark: var(--eh-green-900);
  --green-soft: var(--eh-green-100);
  --ink: var(--eh-text);
  --muted: var(--eh-text-secondary);
  --line: var(--eh-border);
  --bg: var(--eh-bg);
  --white: var(--eh-surface);
}

.mkt {

  --eh-teal-900: var(--eh-color-deep);
  --eh-teal-800: var(--eh-color-deep);
  --eh-teal-700: var(--eh-color-petrol);
  --eh-teal-500: var(--eh-color-petrol);
  --eh-teal-300: var(--eh-color-sand);
  --eh-teal-100: var(--eh-color-sand);
  --eh-teal-050: var(--eh-color-paper);

  --eh-canvas: var(--eh-color-paper);
  --eh-surface: var(--eh-color-white);
  --eh-sand-100: var(--eh-color-paper);
  --eh-sand-200: var(--eh-color-sand);
  --eh-sand-400: var(--eh-color-sand);

  --eh-terra: var(--eh-color-terra);
  --eh-terra-deep: var(--eh-color-terra);
  --eh-terra-soft: var(--eh-color-sand);

  --eh-ink: var(--eh-color-ink);
  --eh-ink-soft: var(--eh-color-secondary);
  --eh-ink-mute: var(--eh-color-secondary);
  --eh-line: var(--eh-color-line);
  --eh-line-strong: var(--eh-color-secondary);

  --eh-on-dark: var(--eh-color-paper);
  --eh-on-dark-soft: var(--eh-color-sand);
  --eh-on-dark-line: var(--eh-color-secondary);

  --eh-r-xs: var(--eh-shape-control);
  --eh-r-chip: var(--eh-shape-control);
  --eh-r-card: var(--eh-shape-panel);
  --eh-r-card-lg: var(--eh-shape-panel);
  --eh-r-btn: var(--eh-shape-control);
  --eh-r-input: var(--eh-shape-control);
  --eh-r-media: 0;
  --eh-r-pill: var(--eh-shape-control);

  --eh-shadow-sm: none;
  --eh-shadow-md: none;
  --eh-shadow-lg: none;
  --eh-ring: 0 0 0 1px var(--eh-line);

  --eh-container: 1296px;
  --eh-container-narrow: 760px;
  --eh-gutter: clamp(20px, 4vw, 32px);
  --eh-section-y: clamp(64px, 9vw, 120px);
  --eh-section-y-tight: clamp(48px, 6vw, 80px);

  --eh-space-1: 4px;
  --eh-space-2: 8px;
  --eh-space-3: 14px;
  --eh-space-4: 22px;
  --eh-space-5: 34px;
  --eh-space-6: 52px;
  --eh-space-7: 76px;

  --eh-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --eh-dur-fast: 140ms;
  --eh-dur: 240ms;
  --eh-dur-slow: 420ms;

  --eh-green-900: var(--eh-color-deep);
  --eh-green-700: var(--eh-color-petrol);
  --eh-green-600: var(--eh-color-petrol);
  --eh-green-100: var(--eh-color-sand);
  --eh-green-50: var(--eh-color-paper);
  --eh-bg: var(--eh-color-paper);
  --eh-surface: var(--eh-color-white);
  --eh-surface-subtle: var(--eh-color-paper);
  --eh-text: var(--eh-color-ink);
  --eh-text-secondary: var(--eh-color-secondary);
  --eh-border: var(--eh-color-line);
  --eh-border-strong: var(--eh-color-secondary);
  --eh-on-dark: var(--eh-color-paper);

  --eh-font: var(--font-marketing, ui-sans-serif, system-ui, sans-serif);
  --eh-display: var(--eh-font-display);
  --eh-h1: var(--eh-font-page);
  --eh-h2: var(--eh-font-section);
  --eh-h3: 22px;
  --eh-lead: clamp(17px, 1.4vw, 20px);
  --eh-body: 17px;
  --eh-small: 14px;
  --eh-micro: var(--eh-font-meta);

  color: var(--eh-ink);
  background: var(--eh-canvas);
  font-family: var(--eh-font);
  font-size: var(--eh-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'cv11', 'ss01', 'calt';
}

.mkt ::selection {
  background: var(--eh-teal-100);
  color: var(--eh-teal-900);
}

.mkt :focus-visible {
  outline: 3px solid var(--eh-teal-500);
  outline-offset: 3px;
  border-radius: 6px;
}

@media (prefers-reduced-motion: reduce) {
  .mkt {
    --eh-dur-fast: 1ms;
    --eh-dur: 1ms;
    --eh-dur-slow: 1ms;
  }
}

`````

## src/components/marketing/ui.tsx

`````tsx
/** Compatibility adapters. Public signatures stay stable; styling belongs to @einfachhausen/design. */
import {Check, CircleCheck} from "lucide-react";
import {EHPageHero, EHSection, EHEyebrow, EHHeading, EHText, EHButton, EHTextLink, EHFeatureRows, EHSteps, EHFAQ, EHTimeline, EHFacts, EHPanel, EHProse, EHCallout, EHActions} from "@/design-system";
import styles from "./mkt.module.css";
export {styles as mkt};
type Tone = "plain" | "canvas" | "surface" | "soft" | "sand" | "dark" | "green";
const tones = {plain:"paper",canvas:"paper",surface:"white",soft:"paper",sand:"sand",dark:"deep",green:"deep"} as const;
export function Eyebrow({children}: {children: React.ReactNode; terra?:boolean}) {return <EHEyebrow>{children}</EHEyebrow>;}
export function Container({children,className=""}: {children:React.ReactNode;className?:string}) {return <div className={`${styles.container} ${className}`}>{children}</div>;}
export function PageHero({eyebrow,title,text,actions,aside}: {eyebrow:string;title:string;text:string;actions?:React.ReactNode;aside?:React.ReactNode;terra?:boolean}) {
  return <EHPageHero {...{eyebrow,title,text,actions}} media={aside}/>;
}
export function Section({eyebrow,title,text,children,tone="plain",tight=false,center=false,id}: {eyebrow?:string;title?:string;text?:string;children:React.ReactNode;tone?:Tone;tight?:boolean;center?:boolean;id?:string}) {
  return <EHSection id={id} tone={tones[tone]} compact={tight}>{(eyebrow || title || text) && <div className={center ? styles.sectionHeadCenter:styles.sectionHead}>{eyebrow && <EHEyebrow>{eyebrow}</EHEyebrow>}{title && <EHHeading>{title}</EHHeading>}{text && <EHText size="lead">{text}</EHText>}</div>}{children}</EHSection>;
}
export function CardGrid({children,cols=3}: {children:React.ReactNode;cols?:2|3|4}) {return <div className={styles.cardGrid} data-cols={cols}>{children}</div>;}
export function Card({icon,title,text,tone="surface",children}: {icon?:React.ReactNode;title:string;text?:string;tone?:"surface"|"sand"|"soft"|"dark";children?:React.ReactNode}) {
  const body=<>{icon && <span className={styles.cardIcon} aria-hidden="true">{icon}</span>}{text && <EHText>{text}</EHText>}{children}</>;
  return tone==="dark" || tone==="sand" ? <EHCallout title={title} tone={tone==="dark"?"deep":"sand"}>{body}</EHCallout> : <EHPanel title={title}>{body}</EHPanel>;
}
export function FeatureGrid({items}: {items:ReadonlyArray<{icon:React.ReactNode;title:string;text:string}>;cols?:2|3|4}) {return <EHFeatureRows items={[...items]}/>;}
export function Statement({kicker,tone="sand",children}: {kicker:string;tone?:Tone;children:React.ReactNode}) {return <EHSection tone={tones[tone]}><div className={styles.sectionHead}><EHEyebrow>{kicker}</EHEyebrow><EHHeading>{children}</EHHeading></div></EHSection>;}
export function Numbered({items}: {items:ReadonlyArray<{title:string;text:string}>;tone?:Tone}) {return <EHFeatureRows items={[...items]}/>;}
export function Steps({items}: {items:ReadonlyArray<{title:string;text:string;visual?:React.ReactNode}>}) {return <EHSteps items={items.map(item=>({title:item.title,text:<><EHText>{item.text}</EHText>{item.visual}</>}))}/>;}
export function Split({children}: {children:React.ReactNode}) {return <div className={styles.split}>{children}</div>;}
type ButtonVariant = "primary" | "ghost" | "terra" | "onDark" | "ghostOnDark";
const buttonVariants = {primary:"primary",ghost:"secondary",terra:"primary",onDark:"on-dark",ghostOnDark:"quiet"} as const;
export function LinkButton({href,children,secondary=false,variant,size,arrow}: {href:string;children:React.ReactNode;secondary?:boolean;variant?:ButtonVariant;size?:"sm"|"lg";arrow?:boolean}) {
  const v=variant ?? (secondary ? "ghost":"primary");
  return <EHButton href={href} variant={buttonVariants[v]} size={size==="sm"?"small":"regular"} arrow={arrow ?? ["primary","onDark","terra"].includes(v)}>{children}</EHButton>;
}
export function TextLink({href,children}: {href:string;children:React.ReactNode}) {return <EHTextLink href={href}>{children}</EHTextLink>;}
export function BulletList({items}: {items:readonly string[]}) {return <ul className={styles.bulletList}>{items.map(item=><li key={item}><span aria-hidden="true"><Check size={16}/></span>{item}</li>)}</ul>;}
export function InfoPanel({children,label}: {children:React.ReactNode;label?:string}) {return <EHPanel label={label}>{children}</EHPanel>;}
export function ProofRow({items,className=""}: {items?:readonly string[];className?:string}) {
  const list=items ?? ["Hauskonto kostenlos","kein Auftrag ohne deine Entscheidung","geprüfte Partner aus deiner Region"];
  return <div className={`${styles.proofRow} ${className}`}>{list.map(item=><span key={item}><CircleCheck size={16} aria-hidden="true"/>{item}</span>)}</div>;
}
export function Facts({items}: {items:ReadonlyArray<{value:string;label:string}>}) {return <EHFacts items={[...items]}/>;}
export function Testimonials({items}: {items:ReadonlyArray<{quote:string;name:string;meta:string}>}) {
  return <div className={styles.cardGrid} data-cols={items.length>=3?3:2}>{items.map(t=><blockquote className={styles.testimonial} key={t.name}><EHText size="lead">„{t.quote}“</EHText><footer><strong>{t.name}</strong><EHText size="meta">{t.meta}</EHText></footer></blockquote>)}</div>;
}
export function Faq({items}: {items:ReadonlyArray<{q:string;a:React.ReactNode}>}) {return <EHFAQ items={[...items]}/>;}
export function Timeline({items}: {items:ReadonlyArray<{when:string;title:string;text:string}>}) {return <EHTimeline items={[...items]}/>;}
export function CtaBand({title,text,href="/register?role=homeowner",label="Hauskonto kostenlos anlegen",secondaryHref="/#anliegen",secondaryLabel="Anliegen starten"}: {title:string;text:string;href?:string;label?:string;secondaryHref?:string;secondaryLabel?:string}) {
  return <EHSection tone="deep"><div className={styles.sectionHead}><EHEyebrow>Dein Haus. Einfach geregelt.</EHEyebrow><EHHeading>{title}</EHHeading><EHText size="lead">{text}</EHText><ProofRow/><EHActions><LinkButton href={href} variant="onDark">{label}</LinkButton><LinkButton href={secondaryHref} variant="ghostOnDark">{secondaryLabel}</LinkButton></EHActions></div></EHSection>;
}
export function LegalNotice({title,children}: {title:string;children:React.ReactNode}) {return <EHCallout title={title}>{children}</EHCallout>;}
export function Prose({children}: {children:React.ReactNode}) {return <EHProse>{children}</EHProse>;}

`````

## src/design-system/index.ts

`````ts
/** Canonical Einfachhausen UI. Never create a parallel design family. */
export * from "../../packages/eh-design/src";

`````
