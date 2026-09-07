# Full unchanged source snapshot

Base: 3d7d84ed100c21ecfe6a27074d7a22aa7ff92c04


## AGENTS.md
SHA256: 410aad009e2d8ec3dadda5fe28b80faf340c4da309bfa90d66d939544e3255e8

````text
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

````


## README.md
SHA256: 6d4b8f4491c23595e5aad512e9e89667ec736337b1a764d20bb3a814c3149cb7

````text
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

````


## DESIGN.md
SHA256: 31acaf905fdd05371fd68b99726c7fe9813eb87d353378cfa73fbcde920f8f53

````text
# Einfach Hausen — Design Contract

**Status:** verbindliche visuelle und UX-Leitlinie für Website, Eigentümer-App, Handwerker-/Partner-App und CRM (Stand: 2026-09-03).

Diese Datei ist die gemeinsame Design-Quelle für alle Produktflächen. Bestehende Funktionalität, Produktlogik und Sicherheitsregeln bleiben bestehen. Die Oberflächen dürfen sich in Informationsarchitektur und Nutzungskontext unterscheiden, fühlen sich aber wie **ein einziges, konvergentes Premium-Produkt** an.

## 0. Visuelle Source of Truth · Notion App Design & Canonical Tokens

Für Portal-UI (`/app`, `/pro`, Admin `/admin`, Auth und responsive Shells) ist das einheitliche Token-System verbindlich:

- Kanonische Token-Quelle: `src/components/marketing/tokens.css` (`--eh-*`).
- Farbkonsistenz: Warmes Off-White/Canvas (`#faf8f4` / `#f4f7f7`), Brand-Teal (`#105258`), dunkles Petrol (`#0a3539`), Charcoal-Ink (`#10222a` / `#1c2129`) und dezente Haarlinien (`#e4e2dc`).
- Kein ERP-Cockpit, kein Dark-Mode im Pro-Bereich: Handwerker und Eigentümer nutzen dieselbe helle, ruhige Basisfarbe.

## 1. Produktflächen im Überblick

1. **Öffentliche Website & Content (`/`, `/leistungen`, `/preise`, `/hausakte`, `/partner`, `/blog`, `/lexikon`):**
   - Reduktion von redundanten Kartenrastern zu spezifischen Seiten-Archetypen (Index, Akte, Vergleichstabelle, Vertragsblatt).
   - Kein störendes Lade-Overlay („Wir bereiten die Inhalte vor“), sondern subtile Indikatoren.
2. **Eigentümer-App (`/app`):**
   - **Hausmeister-Composer an 1. Stelle:** Das KI-Eingabefeld steht dominant oben.
   - **Als Nächstes an 2. Stelle:** Termine, offene Angebote und anstehende Wartungen.
   - **Schnellaktionen & Archiv:** Dezent untergeordnet, kein Floating Action Button (FAB).
3. **Handwerker-/Partner-App (`/pro`):**
   - Keine 4 isolierten KPI-Kacheln, sondern eine schlanke Statuszeile.
   - Ein primärer Call-to-Action („Nächster Schritt: Angebot erstellen“), gefolgt von einer klaren Auftragsliste.
4. **Admin & CRM (`/admin`, `/admin/crm`):**
   - Vollständige visuelle Angleichung an den warmen Canvas und saubere Typo-Hierarchie ohne harte Brüche.

## 2. CSS-Architektur & Konsolidierungs-Regeln

- Neue Stile werden ausschließlich über CSS-Module (`*.module.css`) oder Scoped Tokens implementiert.
- Veraltete Überschreibungen (`.premium-*`, `.conversion-*`, inkonsistente Utility-Layers) werden schrittweise neutralisiert.
- Keine `border-left`/`border-right`-Accent-Stripes, keine Text-Gradients, kein Glassmorphism als Standard.

````


## docs/DESIGN_SYSTEM.md
SHA256: d75a2e4f2b3c07b2c9b1fc3444acdf440d1177c431cc182f4101fdae057812e7

````text
# Einfach Hausen — visuelle Produktlinie

Diese Datei beschreibt die verbindliche visuelle Richtung der Kunden-App. Referenz ist das von der Familie gelieferte Mobile-App-Board vom 21.08.2026.

## Leitidee

Einfach Hausen soll wie ein hochwertiges, ruhiges Consumer-Produkt für Eigenheimbesitzer wirken — nicht wie ein KI-Demo-Tool und nicht wie ein ERP.

Priorität der Oberfläche:

1. Kundennutzen und nächster sinnvoller Schritt
2. persönlicher Ansprechpartner und Vertrauen
3. Angebote, Termine, Aufträge und Hauswissen
4. technische Assistenz im Hintergrund

## Primäre Kunden-Screens

- `/app` — Startseite mit Schnellaktionen, nächstem Termin und offenen Angeboten
- `/app/hausmeister` — fokussierter Hausservice-Chat
- `/app/jobs/[id]` — Angebotsvergleich bzw. Auftragsdetail
- `/app/home` — Mein Haus / digitale Hausakte
- `/app/year` — Mein Jahr / Wartungs- und Aufgabenplan
- `/app/plans` — Mitgliedschaften und Premium-/Jahrespakete
- `/app/jobs` — aktive, geplante und abgeschlossene Aufträge
- `/app/partners/[id]` — öffentliches Profil eines geprüften Partnerbetriebs
- `/app/profile` — Profil und Einstellungen

## Mobile Navigation

Kunden sehen bewusst nur vier feste Primärziele:

- Start
- Mein Haus
- Aufträge
- Profil

Hausservice, Kontakte, Jahr, Pakete und Partnerprofile sind kontextuelle Unterseiten. Dadurch bleibt die Navigation ruhig und eindeutig.

## Farben

> **Brand-Konvergenz (2026-08-30):** Die Markenidentität ist mit dem neuen Logo auf Petrol-Teal `#105258` kalibriert (siehe `DESIGN.md` §3). Die App-Oberflächen nutzen die gleiche Palette — die unten dokumentierten Grüns sind die historische Referenz und nicht mehr aktiv.

- Dunkelgrün: `#075531`
- Primärgrün: `#0A6A3C`
- Helles Grün/Mint: `#EEF6ED`
- Weiß: `#FFFFFF`
- Text: `#111512`
- Sekundärtext: `#69716B`
- Linien: `#E4E6E2`

## Stil

- viel Weißraum
- kleine, leichte Schatten statt "SaaS-Glow"
- Karten mit 14–18 px Radius
- klare Hierarchie und große, ruhige Headlines
- grüne Akzente nur für Aktion, Status und Vertrauen
- keine unnötigen Gradients oder dekorative KI-Elemente
- 44 px+ Touch-Ziele
- mobile-first, aber auf Desktop ohne Phone-Frame

## Produktprinzip in der UI

Eine normale Frage erzeugt keinen Auftrag. Nach der Einordnung entscheidet der Kunde bewusst zwischen:

- **Ansprechpartner finden** — persönlicher Kontakt, noch kein Auftrag
- **Auftrag organisieren** — Angebote, Termin und Ausführung

Der persönliche Ansprechpartner bleibt dauerhaft in der Hausakte.

````


## docs/PRODUCT_VISION.md
SHA256: bea238867c9f1eb516644f593ff387dbdca1eefeb68135542cbb347e5702b01f

````text
# Einfach Hausen — verbindliche Produktvision

## Strategischer Produktkern

Die verbindliche Positionierung und psychologische Differenzierung steht in [`PRODUCT_POSITIONING.md`](PRODUCT_POSITIONING.md). Kurzform: **Einfach Hausen ist der persönliche Hausmanager und die Betriebszentrale für das eigene Zuhause.** Das Produkt verkauft nicht primär KI oder Vermittlung, sondern mentale Entlastung, Entscheidungssicherheit, Kontinuität und Werterhalt. Jede neue Produktentscheidung muss mit diesem Kern vereinbar sein.

## Produktversprechen

**Ein Ansprechpartner für alles rund ums Eigenheim.**

Der Eigentümer muss nicht wissen, welchen Handwerker er braucht und nicht selbst nach Gärtnern, Elektrikern, SHK-Betrieben, Reinigungsfirmen, Dachdeckern oder anderen Dienstleistern suchen.

Er schreibt in der App oder über WhatsApp ganz normal, zum Beispiel:

> Meine Hecke muss geschnitten werden. Dienstag ab 14 Uhr hätte ich Zeit.

Der digitale Hausmeister ist für alle Kunden dauerhaft verfügbar. Er kann Fragen beantworten, Hausdaten einordnen, an frühere Vorgänge erinnern und das weitere Vorgehen vorbereiten.

**Erst danach entscheidet der Kunde ausdrücklich, was er möchte:**

1. **Nur einen passenden menschlichen Ansprechpartner** für Fragen oder eine fachliche Einschätzung. Dabei entsteht noch kein Auftrag und kein Preis.
2. **Einen echten Auftrag organisieren lassen.** Dann klärt die KI die nötigen Auftragsdaten, bildet einen Richtpreis, fragt passende geprüfte regionale Partner an und holt – wenn sinnvoll – Angebote ein.

In beiden Fällen bleibt der Hausmeisterservice parallel verfügbar. Ein menschlicher Ansprechpartner kann also schon vor einer Buchung entstehen; eine Buchung ist keine Voraussetzung für persönlichen Kontakt.

## Außenkommunikation

Die öffentliche Website verkauft **nicht KI als Selbstzweck**. Die Reihenfolge der Botschaft ist:

1. **Kundennutzen:** eine Anlaufstelle, weniger Suche, klarer nächster Schritt.
2. **Persönlichkeit:** ein konkreter Ansprechpartner, wenn der Kunde einen Menschen braucht.
3. **Organisation:** Aufträge, Termine, Unterlagen und Hauswissen an einem Ort.
4. **Technologie:** KI ist die unsichtbare Assistenzschicht, die versteht, vorbereitet, erinnert und vergleicht.

Die Startseite soll daher eher sagen **„Ein Ansprechpartner für alles rund ums Eigenheim“** als „KI-Hausmeister“. Innerhalb der App darf der Hausmeister-Assistent sichtbar sein, weil dort die Interaktion selbst der Nutzen ist.

## Produktprinzipien

1. **Eine digitale Eingangstür.** Freitext, Foto und Sprache statt Kategorienwand und langer Formulare.
2. **KI-Hausmeister immer, Mensch oder Auftrag auf Wunsch.** Die KI versteht, erklärt, plant, vergleicht, erinnert und dokumentiert. Der Kunde entscheidet separat, ob er nur einen Menschen sprechen oder eine Leistung beauftragen möchte.
3. **Nur geprüfte Vertragspartner.** Kein offener Lead-Marktplatz.
4. **Qualität vor Monetarisierung.** Matching priorisiert Qualität, Kundenzufriedenheit, Eignung, Entfernung, Verfügbarkeit, Kapazität und bestehende Beziehungen — niemals den gebuchten Partner-Tarif.
5. **Direkter persönlicher Kontakt ohne Buchungszwang.** Für Fragen kann ein geprüfter Partner bereits als Ansprechpartner verbunden werden. Ein Auftrag entsteht erst durch eine separate bewusste Entscheidung des Kunden.
6. **Beziehungen bleiben erhalten.** Ein verbundener Ansprechpartner bleibt in der Hausakte gespeichert – unabhängig davon, ob sofort ein Auftrag entsteht. Spätere Fragen oder Folgeaufträge können direkt mit ihm abgestimmt werden.
7. **Mein Haus ist das Gedächtnis.** Hausdaten, Anlagen, Aufträge, Rechnungen, Termine, Dokumente, Wartungen, Ansprechpartner und Zukunftsaufgaben wachsen dauerhaft zu einer digitalen Hausakte.
8. **So wenig Partner-Software wie möglich.** Keine komplexen Rollen und Rechte. Pro Ansprechpartner gibt es nur App-Zugang und den Schalter „Aufträge verwalten“.
9. **0 % Auftragsprovision.** Partner behalten 100 % ihres Auftragswertes. Partnerumsatz entsteht über planbare Monatsabos, nicht über eine Gebühr pro Auftrag.
10. **Region für Region.** Erst ein dichtes hochwertiges Netzwerk in einer Region, dann Expansion.

## Visueller Kernablauf

![Eigentümer-Serviceflow](diagrams/homeowner-service-flow.svg)

[Interaktiven Serviceflow öffnen](diagrams/homeowner-service-flow.html)

![Partner- und Auftrags-Lifecycle](diagrams/partner-job-lifecycle.svg)

[Interaktiven Partner-Lifecycle öffnen](diagrams/partner-job-lifecycle.html)

## Kundenerlebnis

### 1. Hausmeisterservice

Der Kunde schreibt, spricht oder fotografiert. Zunächst ist das einfach ein Gespräch mit dem Hausmeisterservice – **noch keine Vermittlung und kein Auftrag**. Die KI beantwortet die Frage soweit sinnvoll und nutzt relevante Informationen aus der Hausakte.

Wenn der Kunde anschließend einen Auftrag möchte, extrahiert der digitale Hausmeister unter anderem:

- Leistung / Gewerk
- Ort / Haus
- gewünschter Zeitraum
- Größen / Umfang, soweit notwendig
- Budget, falls genannt
- relevante Hausdaten aus „Mein Haus“

Fehlt etwas Entscheidendes, kommt **genau eine sinnvolle Rückfrage nach der anderen** statt eines Formulars.

Beispiel Heckenschnitt:

1. „Wie lang ist die Hecke ungefähr?“
2. „Wann soll es gemacht werden?“
3. Foto optional, wenn es die Kalkulation verbessert.

### 2. Entscheidung: Ansprechpartner oder Auftrag

Nach der Einordnung zeigt das Produkt zwei klare Wege:

- **Ansprechpartner finden:** passender geprüfter Betrieb übernimmt die Kontaktanfrage; kein Angebot und keine Buchung nötig.
- **Auftrag organisieren:** Auftragsdaten werden vervollständigt, Partner angefragt und Angebote verglichen.

Der Kunde kann auch erst einen Ansprechpartner sprechen und **später aus demselben Thema einen Auftrag machen**.

In WhatsApp gilt dasselbe Produktmodell. Nach der KI-Antwort kann der Kunde einfach **ANSPRECHPARTNER** oder **AUFTRAG** schreiben; eine normale Frage löst nicht automatisch eine Vermittlung aus.

### 3. Richtpreis und Matching

Das System erstellt eine Preisorientierung und sucht passende aktive Vertragspartner.

Matching berücksichtigt:

- Entfernung
- Fachgebiet
- Qualifikation
- Verfügbarkeit
- aktuelle Kapazität
- Bewertung
- bisherige Kundenzufriedenheit
- Preisniveau / tatsächliches Angebot
- bestehende Kundenbeziehung
- bereits bekannter Ansprechpartner
- Vertrags- und Qualitätsstatus

Partner-Tarife beeinflussen **nicht** den Qualitäts-Score.

### 4. Angebotsvergleich

Der Kunde sieht einen übersichtlichen Vergleich, zum Beispiel:

| Partner | Preis | Termin | Bewertung |
|---|---:|---|---:|
| Garten Weber | 280 € | Dienstag | 4,9 |
| Grün GmbH | 310 € | Mittwoch | 4,8 |
| Gartenservice Müller | 350 € | Freitag | 4,9 |

Zusätzlich markiert das System mindestens:

- **Meine Empfehlung**
- **Günstigstes Angebot**
- **Schnellster Termin**

### 5. Buchung und persönlicher Ansprechpartner

Bei einem Auftrag wird spätestens nach der Buchung ein konkreter Ansprechpartner zugewiesen. Bei einer reinen Kontaktanfrage kann derselbe persönliche Kontakt bereits vorher entstehen.

Beispiel:

**Thomas Weber**  
Techniker · Gartenbau Müller

Der Kunde kann:

- Nachricht senden
- anrufen
- Termin abstimmen

Der KI-Hausmeister bleibt parallel für Organisation, Hausakte, Erinnerungen und Servicefälle erreichbar.

### 6. Dauerhafte Beziehung

Nach Abschluss bleibt der Ansprechpartner gespeichert:

**Meine Ansprechpartner**

- Garten · Thomas Weber
- Elektro · Daniel Müller
- Heizung · Julia Schneider

Ein späterer Satz wie „Thomas, kannst du dieses Jahr wieder die Hecke schneiden?“ geht direkt an Thomas. Keine neue Vermittlung ist erforderlich.

## Mein Haus — digitale Hausakte

Langfristig gespeichert werden:

- Adresse
- Grundstück
- Haustyp / Baujahr / Wohnfläche
- Geräte und Anlagen
- PV-Anlage
- Batteriespeicher
- Heizung / Wärmepumpe
- Wallbox
- Dach / Dachrinne
- Fenster / Türen
- Garten
- Smart Home / Sicherheit
- bisherige Aufträge
- Rechnungen / Belege
- Wartungen
- Termine
- Ansprechpartner
- bevorzugte Dienstleister
- Fotos / Dokumente
- Empfehlungen
- zukünftige Aufgaben

Aus Anlagen und erledigten Arbeiten entsteht automatisch ein Hausjahres- und Wartungsplan.

## Beratung und Notfall

Neben dem normalen Hausmeisterservice gibt es zwei besonders schnelle Einstiege:

- **Beratung:** Ein passender geprüfter Ansprechpartner kann fachlich helfen, ohne dass automatisch ein Auftrag oder Preis entsteht.
- **Notfall:** Der Kunde beschreibt einen dringenden Fall und Einfach Hausen sucht zuerst nach qualifizierten verfügbaren Helfern in der Nähe. Berücksichtigt werden Entfernung, Bereitschaft, Qualifikation, Bewertung, Reaktionsgeschwindigkeit und hinterlegter Notfallzuschlag. 24/7-Notdienste und lokale Betriebe mit eigenen Bereitschaftszeiten laufen im selben Partnernetzwerk.

Der Kunde soll nicht automatisch beim teuersten Notdienst landen. Mehrere passende Optionen und transparente Gesamtpreise bleiben das Ziel.

## Rechnungen direkt über Einfach Hausen

Der ausführende Partner kann aus einem gebuchten Auftrag direkt eine Rechnung an den Eigentümer senden. Die Rechnung bleibt Teil der Hausakte und enthält mindestens Rechnungsnummer, Rechnungs-/Leistungsdatum, Zahlungsziel, Rechnungssteller/-empfänger, Positionen, Netto, Umsatzsteuer und Brutto.

Ist Stripe Connect eingerichtet, kann die Rechnung direkt in der App bezahlt werden. Einfach Hausen erhebt weiterhin **0 % Auftragsprovision**. Der Partner bleibt Rechnungssteller der Handwerkerleistung.

## Die Immobilie ist der langlebige Datensatz

Einfach Hausen wird nicht als Sammlung von User-Aufträgen modelliert. Die Immobilie besitzt eine eigene Identität und eine Eigentümerhistorie. Haus-Historie, Technik, Wartungen, Garantien, Ansprechpartner und spätere Bewertungen hängen an der Immobilie und können bei einem Eigentümerwechsel weitergeführt werden.

Eine Übergabe überträgt nicht private alte Nachrichten oder Zahlungen. Der neue Eigentümer übernimmt die freigegebene Hausgeschichte und die hausbezogenen Daten.

## Professionelle Anbieter: ein Konto, mehrere Tätigkeiten

Es gibt keinen separaten Login für Handwerker, Makler oder Gutachter. Ein professioneller Anbieter hat ein Konto und kann mehrere Tätigkeiten aktivieren, z. B. Handwerk, Dienstleistung, Immobilienmakler, Gutachter, Energieberatung oder Hausverwaltung. Konkrete Leistungen werden separat gepflegt und für das Matching verwendet.

Makler können zusätzlich Suchprofile für Regionen, Immobilientypen, Preis- und Flächenbereiche hinterlegen. Bei Verkaufsinteresse vergleicht Einfach Hausen diese Suchprofile mit der Immobilie. Eigentümerkontaktdaten werden erst nach ausdrücklicher Freigabe sichtbar. Freigaben sind zweckgebunden und widerrufbar.

## Immobilienbewertung und Verkauf

Bewertungen sind eigene Vorgänge und bleiben in der Hausakte. Aus einem Verkaufsinteresse kann ein nachvollziehbarer Maklerprozess entstehen:

**Verkaufsinteresse → passende Makler → Eigentümerfreigabe → Kontakt → Besichtigung → Maklerauftrag → verkauft**

Private Rechnungen, Versicherungen, Nachrichten, Zahlungsdaten und vollständige Hausdokumente werden einem Anbieter niemals automatisch offengelegt.

## Partnernetzwerk

Nur geprüfte und vertraglich gebundene Unternehmen erhalten Anfragen.

Mindestprüfung:

- Gewerbe / Unternehmen
- Qualifikation / notwendige Zulassungen
- Betriebshaftpflicht
- Bewertungen / Referenzen
- Einsatzregion
- Kapazität
- Kommunikationsqualität
- Qualitätsstandard
- Partnervertrag

Leistungskategorien umfassen unter anderem Haus & Technik, Elektro, Sanitär, Heizung, Klima, Dach, Fenster, Schlosser, Maler, Schreiner, Boden, Garten, Heckenschnitt, Baumarbeiten, Pflaster, Winterdienst, Reinigung, Dachrinne, PV-Reinigung, Entrümpelung, Umzug, Schädlingsbekämpfung, kleinere Reparaturen sowie später PV, Wärmepumpe, Wallbox, Energieberatung, Smart Home und Sanierung.

## Firmenkonto und Ansprechpartner

Eine Firma besitzt **1–X Ansprechpartner mit eigenem App-Zugang**.

Es gibt keine komplexe Rollenverwaltung. Die einzige wichtige Berechtigung lautet:

> **Aufträge verwalten: AN / AUS**

### Aufträge verwalten = AN

- neue passende Anfragen sehen
- Anfrage annehmen oder ablehnen
- Angebot abgeben
- gebuchten Auftrag sich selbst oder einem Ansprechpartner zuweisen
- Ansprechpartner ändern

### Aufträge verwalten = AUS

- nur eigene zugewiesene Aufträge sehen
- Kunden für diese Aufträge kontaktieren
- Termin abstimmen
- Status ändern
- Dokumente / Rechnung hochladen
- Auftrag abschließen

Ziel: Ein Handwerksbetrieb soll das Produkt in fünf Minuten verstehen — **WhatsApp + Auftragsverwaltung**, kein ERP.

## Monetarisierung

### Kunden

**FREE — 0 €/Monat**

- KI-Hausmeister
- Aufträge
- Angebote und Vergleich
- Vermittlung
- persönlicher Ansprechpartner nach Buchung
- digitale Hausakte

**PLUS — 19,90 €/Monat**

- automatische Wartungsplanung
- Hausjahresplan
- Erinnerungen
- Dokumentenverwaltung
- bevorzugte Vermittlung im Serviceprozess
- erweiterte Hausakte
- Prioritätsservice

**PREMIUM — 39,90 €/Monat**

- persönliche Betreuung
- höchste Servicepriorität
- jährlicher Hauscheck
- automatische Wartungsorganisation
- Premium-Service
- umfangreichere Hausverwaltung

Zusätzlich können definierte Jahrespakete wie HausCare, GartenCare und Energie-/Technik-Checks angeboten werden.

### Partner

**0 % Provision · keine Gebühr pro Auftrag**

- FREE — 0 €/Monat, begrenzte Anzahl neuer Anfragen
- START — 29 €/Monat
- PRO — 79 €/Monat
- PREMIUM — 199 €/Monat

START, PRO und PREMIUM starten mit einer zweimonatigen kostenlosen Testphase. Der Partner-Tarif darf die fachliche Reihenfolge im Matching nicht kaufen.

## Technische Zielarchitektur (Produktion HA)

- mobile-first Kunden-Web-App (Next.js) + **Capacitor 6 native iOS/Android Apps** (gleiche Codebase, App Store + Play Store)
- Partner-Web-App (Next.js) + Capacitor Hülle
- PWA bleibt für Web/Offline-Hinweise, primäre mobile Auslieferung ist **Capacitor**
- **Supabase Postgres (HA, Primary DB)** + **Supabase Storage (private/uploads für Fotos/Dokumente/Rechnungen)** — SQLite nur Local-Dev Fallback
- WhatsApp Cloud API als zusätzlicher Kundeneingang
- KI-Orchestrierung mit OpenAI-kompatiblem Gateway; deterministischer Fallback bleibt verfügbar
- strukturierter Service-/Preis-Katalog
- regionales Qualitätsmatching
- Angebotsvergleich
- digitale Hausakte und Wartungsplanung
- Firmenkonto mit einfachen Ansprechpartner-Logins
- direkte Kunde↔Ansprechpartner-Kommunikation nach Buchung
- Stripe Checkout für Kunden- und Partnerabos / Jahrespakete
- Stripe Connect für zentrale Auftragszahlungen mit 0 % Plattformprovision
- private Dokumentablage via Supabase Storage
- Admin-Konsole für Prüfung, Verträge, Qualität und Servicefälle
- Benachrichtigungen und Auditierbarkeit (Push via Capacitor)

## Geschäftsstrategie

Der Burggraben ist nicht allein die KI. Er entsteht durch:

**regionales Partnernetzwerk + Partnerqualität + persönliche Ansprechpartner + Hausdaten + Wartungshistorie + Vertrauen.**

Expansion erfolgt Region für Region: erst dichtes Netzwerk und perfekte Abläufe, dann skalieren.

## Vision

> Wir wollen der digitale Hausmeister für jedes Eigenheim werden.
>
> Der Eigentümer muss nicht wissen, welchen Handwerker er braucht. Er sagt einfach, was an seinem Haus gemacht werden muss. Unsere KI organisiert den Vorgang. Unser geprüftes Partnernetzwerk erledigt die Arbeit. Und der Kunde hat immer einen echten Menschen als direkten Ansprechpartner.

## Design principle

Einfach Hausen must feel calmer and simpler than the work happening behind it. The interface is content-first, editorial and minimal: generous whitespace, strong typography, very few surfaces, one restrained accent color and no decorative dashboard/card wall. The customer should primarily see one clear conversation with the digital housemaster, followed by decisions only when they are needed. Partner tooling follows the same rule: requests, assignments and customer contact are shown as simple operational lists, not an ERP.

Visual inspiration may come from best-in-class contemporary software such as OpenAI products, but Einfach Hausen keeps its own identity and does not copy proprietary branding, typography or component designs.

````


## docs/PRODUCT_POSITIONING.md
SHA256: 231337525b218c6b24658563aae468f163d084dd5d2ab1c7c75ddce110ae5305

````text
# Einfach Hausen — Produktkern, Positionierung und psychologische Differenzierung

## Kategorie

Einfach Hausen ist nicht primär ein Handwerkerportal, Immobilienportal, eine Hausakten-App oder ein KI-Chatbot. Die stärkste Kategorie ist:

> **Der persönliche Hausmanager — die Betriebszentrale für das eigene Zuhause.**

Strategisch kann das Produkt als **Homeowner Operating System** verstanden werden.

## Kernproblem

Ein Eigenheim erzeugt dauerhaft organisatorische und mentale Last: Wartung, Reparaturen, Anbieterwahl, Termine, Rechnungen, Garantien, Dokumente, Schäden, Versicherungen, Bewertung und später möglicherweise Verkauf. Heute verteilt sich diese Verantwortung auf Google, WhatsApp, E-Mail, Aktenordner, Kalender, einzelne Handwerkerportale, Versicherer, Makler und die eigene Erinnerung.

Einfach Hausen bündelt diese fragmentierte Verantwortung in einem dauerhaften System.

## Zentrales Nutzenversprechen

> **Du hast ein Haus. Wir kümmern uns um den Rest.**

Das Produkt verkauft nicht primär Features. Es verkauft:

- mentale Entlastung,
- Sicherheit,
- Kontrolle,
- Vertrauen,
- Werterhalt,
- Kontinuität.

## Fünf psychologische Grundkerne

### 1. Entlastung

Nutzerbedürfnis: „Ich möchte mich nicht ständig um alles selbst kümmern müssen.“

Leitbotschaft:

> **Weniger kümmern. Mehr zuhause sein.**

### 2. Vertrauen und Entscheidungssicherheit

Nutzerbedürfnis: „Ich weiß nicht, wem ich vertrauen kann und ob eine Empfehlung fair ist.“

Leitbotschaft:

> **Nicht irgendeine Lösung. Die richtige für dein Haus.**

### 3. Nichts Wichtiges vergessen

Nutzerbedürfnis: „Ich möchte keine Wartung, Frist oder kleine Ursache übersehen, die später teuer wird.“

Leitbotschaft:

> **Dein Haus vergisst nichts.**

### 4. Werterhalt

Nutzerbedürfnis: „Mein Haus ist eines meiner größten Vermögenswerte.“

Leitbotschaft:

> **Damit dein Zuhause langfristig gut dasteht.**

### 5. Ein Ansprechpartner

Nutzerbedürfnis: „Ich will nicht für jedes Problem eine neue Plattform, Firma oder Nummer suchen.“

Leitbotschaft:

> **Egal was mit deinem Haus ist: Du weißt, wo du hingehst.**

## Fundamentale Differenzierung

Klassischer Marktplatz:

```text
Problem → Anfrage → Leads → Anbieter → Abschluss → Ende
```

Einfach Hausen:

```text
Haus → verstehen → erinnern → Bedarf erkennen → beraten → organisieren → durchführen → dokumentieren → daraus lernen
```

Der Unterschied ist eine dauerhafte Beziehung statt einer transaktionalen Vermittlung.

## Daten-Flywheel

Mit jeder Nutzung kennt Einfach Hausen mehr über das konkrete Haus:

- Gewerke und Bauteile,
- historische Arbeiten,
- Dienstleister und Ansprechpartner,
- Kosten,
- Rechnungen und Garantien,
- Wartungsintervalle,
- Fotos und Dokumente,
- Schäden,
- Präferenzen und wiederkehrende Aufgaben.

Dadurch steigt der Produktwert mit der Nutzungsdauer. Das Hausgedächtnis wird zum Bindungs- und Qualitätsvorteil.

Beispiel:

> „Deine Wärmepumpe wurde im Oktober 2026 von Firma X gewartet. Die nächste Wartung ist fällig. Beim letzten Termin kostete sie 189 €. Soll ich sie wieder organisieren?“

## Drei Säulen für Marketing und UX

### Alles wissen.
Alle wichtigen Informationen, Dokumente und die Geschichte des Hauses.

### Nichts vergessen.
Wartung, Reparaturen, Termine und wichtige Aufgaben rechtzeitig im Blick.

### Nicht alles selbst machen.
Beratung, Organisation und passende Ansprechpartner, wenn etwas erledigt werden muss.

## Sprachregelung

Bevorzugt:

- persönlicher Hausmanager,
- dein Haus an einem Ort,
- dein Haus vergisst nichts,
- einfach geregelt,
- weniger kümmern,
- passende Ansprechpartner,
- Werterhalt,
- Sicherheit,
- Übersicht.

Nicht als Hauptpositionierung:

- Handwerker-App,
- Lead-Plattform,
- KI-Plattform,
- Immobilienportal,
- Marketplace.

KI ist ein Mittel, nicht die Produktkategorie.

## Kernbotschaften

Primär:

> **Dein Haus. Einfach geregelt.**

Emotional:

> **Weniger kümmern. Mehr zuhause sein.**

Produktvision:

> **Ein Haus besitzen sollte nicht bedeuten, Hausverwaltung spielen zu müssen.**

Kategorie:

> **Dein persönlicher Hausmanager.**

## Produktentscheidungsregel

Jedes neue Feature muss mindestens eine dieser Fragen positiv beantworten:

1. Reduziert es mentale Last?
2. Erhöht es Entscheidungssicherheit?
3. Verhindert es Vergessen oder Informationsverlust?
4. Unterstützt es Werterhalt?
5. Reduziert es die Zahl der Ansprechpartner oder Systeme?
6. Macht es das Hausgedächtnis wertvoller?
7. Macht es eine zukünftige Aktion leichter oder automatischer?

Wenn keine Antwort „ja“ ist, gehört das Feature wahrscheinlich nicht in den Kern.

## UX-Regel

Das Produktversprechen „einfach“ muss sichtbar sein:

- wenige klare Hauptaktionen,
- konkrete nächste Schritte,
- keine unnötigen Entscheidungen,
- progressive Offenlegung,
- pro Screen eine dominante Aufgabe,
- Sprache aus Sicht des Eigentümers statt interner Prozesse.

## Strategischer Moat

Der langfristige Burggraben entsteht aus der Kombination von:

- dauerhaftem Hauskontext,
- historischer Hausakte,
- wiederkehrenden Wartungsbeziehungen,
- geprüften und erprobten Ansprechpartnern,
- Transaktionshistorie,
- Entscheidungshilfe,
- Automatisierung,
- Lebenszyklusabdeckung vom Besitz bis zum Verkauf.

Kein einzelnes Feature ist der Moat. Der Moat ist die **kontinuierliche Beziehung zwischen Eigentümer, Hausdaten und ausführendem Netzwerk**.

````


## docs/COMPANY_IDENTITY.md
SHA256: c6ad47b657c28ff266288a15b69229f7467dc5d5030c0f199fa88cda46deb3a1

````text
# Einfach Hausen — kanonische Unternehmensrollen

Stand: 2026-09-05

Diese Datei ist die verbindliche Rollenquelle für öffentliche Anbieterangaben, Impressum, Auth-/Legal-Modals und Repository-Dokumentation.

- **Gina Schulze** — Inhaberin und Geschäftsführerin von Einfach Hausen.
- **Jeremy Schulze** — Developer / technische Entwicklung. Jeremy ist weder Inhaber noch Geschäftsführer und darf nicht als Betreiber, Inhaber oder Geschäftsführer dargestellt werden.

## Umsetzungsregel

Öffentliche und interne Texte müssen diese Rollen konsistent wiedergeben. Notion-/GitHub-Bezeichnungen wie „Jerry-owned“ beschreiben ausschließlich die Zuständigkeit für Engineering-Aufgaben und keine Eigentums- oder Geschäftsführungsrolle am Unternehmen.

Keine Rechtsform, Anschrift, Handelsregisterangabe, USt-IdNr. oder Telefonnummer erfinden. Solche Angaben dürfen erst ergänzt werden, wenn sie aus einer verifizierten Unternehmensquelle vorliegen.

````


## docs/NEXT_AGENT.md
SHA256: ed9ba9bf3348e14fd0f31f87b127327d81bc15887f49c78d9848e2af7aa38374

````text
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

````


## docs/PRODUCTION_HANDOVER.md
SHA256: d6851ae30e30afbe004ba9978cec530e7b8f60f6e1614595cd9a867dc453a74e

````text
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

````


## docs/ARCHITECTURE.md
SHA256: 127dd59e5c016f1c70bed7341dae6edddd28a7e473f432640ce1c01792efa308

````text
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

````


## docs/OPERATIONS.md
SHA256: 3c40933aeb03ba0926880c7f65e616953b1454cdd74dfe3d93337b35c18ca4ac

````text
# Einfach Hausen — OCI operations

## Visueller Deploy- und Recovery-Flow

![Production, Backup und Recovery](diagrams/production-recovery-flow.svg)

[Interaktiven Deploy-/Recovery-Flow öffnen](diagrams/production-recovery-flow.html)

## Production contract — OCI + SIN Supabase OSS

Produktion läuft als Next.js Service hinter Cloudflare Tunnel auf OCI. **SIN Supabase OSS auf OCI** ist die Auth-Autorität (`AUTH_MODE=supabase`); die App-Datenbank ist SQLite (`DATABASE_PATH`). Supabase Cloud ist nicht Teil der Zielarchitektur. Aussagen wie HA/PITR/Failover gelten nur nach frischem Betriebsnachweis für die tatsächlich betriebene Konfiguration (aktuell nicht nachgewiesen):

`Internet -> Cloudflare -> sin-kestra tunnel -> 127.0.0.1:3010 -> einfach-hausen.service -> SQLite (persistenter Pfad) + SIN Supabase OSS (Auth)`

Nach dem verifizierten Mac→GitHub-Release ist **OCI-VM der kanonische Engineering-/Prime-Agent-Host**. GitHub ist die einzige Code-Transfergrenze; ein Dirty-Working-Tree wird niemals direkt vom Mac nach OCI kopiert.

Canonical runtime paths:

- code: `/srv/einfach-hausen`
- environment: `/etc/einfach-hausen.env` (`0600`, never committed) — enthält `AUTH_MODE=supabase`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_PATH`
- **App-Datenbank (Produktion): SQLite** `/var/lib/einfach-hausen/einfach-hausen.db` (`DATABASE_PATH`, `better-sqlite3`) — Single Node mit Backup-Pflicht
- **Auth-Autorität: SIN Supabase OSS (self-hosted)** `https://supabase.delqhi.com` — serverseitige Session-Verifikation (`@supabase/ssr`); Supabase ist nicht die App-Datenbank
- **Storage: kein Supabase-Storage-Adapter implementiert** (`src/lib/storage.ts` existiert nicht); `private/`/`uploads/` sind persistente lokale Verzeichnisse per Symlink (`/var/lib/einfach-hausen/...`)
- local verified backups: `/var/backups/einfach-hausen`
- service: `einfach-hausen.service`
- public health: `/api/health` (prüft die SQLite-Datenbank; 200 nur wenn `users`-Schema ready)

Die App adressiert `private/`/`uploads/` über das lokale Dateisystem (persistente Verzeichnisse + Symlinks, siehe `deploy/update-on-oci.sh`). Ein Supabase-Storage-Adapter ist nicht Teil des laufenden Codes.

## Node 22 requirement

Production build and runtime require Node **22.x**. The systemd unit and `deploy/update-on-oci.sh` use `/home/ubuntu/.nvm/versions/node/v22.23.0/bin`; the deployment script aborts unless the detected major version is exactly 22. Because npm itself uses `#!/usr/bin/env node`, the deploy script also prepends this validated Node 22 directory to `PATH` before `npm ci`/build so lifecycle workers cannot fall back to `/usr/bin/node` 20. Do not work around native-module failures by downgrading `better-sqlite3` or building with Node 20.

Safe probes:

```bash
/home/ubuntu/.nvm/versions/node/v22.23.0/bin/node --version
systemctl cat einfach-hausen.service | grep '/node/v22\|/npm\|DATABASE_PATH\|BindPaths'
```

## Health contract (HA)

`GET /api/health` performs a bounded read against the **SQLite** app database (`users` table via `sqlite_schema`). HTTP 200 nur wenn die Datenbank bereit ist, sonst 503. JSON enthält nur service, state, database category, timestamp — keine Pfade/Secrets. `no-store`.

Local service probe:

```bash
curl -fsS http://127.0.0.1:3010/api/health
```

Expected shape includes `"ok":true` and `"database":"ready"`.

## Persistent storage bootstrap

Vor Installation/Restart:

```bash
sudo install -d -o ubuntu -g ubuntu -m 0750 \
  /var/lib/einfach-hausen \
  /var/lib/einfach-hausen/private \
  /var/lib/einfach-hausen/uploads \
  /var/backups/einfach-hausen
```

Produktion schreibt `private/`/`uploads/` in die persistenten lokalen Verzeichnisse; die Symlinks `data/private -> /var/lib/einfach-hausen/private` und `public/uploads -> /var/lib/einfach-hausen/uploads` sind der verifizierte Runtime-Mechanismus (siehe `deploy/update-on-oci.sh`). Ein Supabase-Storage-Cutover ist nicht implementiert.

## Backup (HA)

Primär: SQLite-Online-Backup vor jedem Deploy (`deploy/update-on-oci.sh`) nach `/var/backups/einfach-hausen` + `scripts/backup-einfach-hausen.sh`; `private`/`uploads` via tar. Ein Supabase-PITR-Pfad ist nicht Teil des betriebenen Stacks (historische HA-Planung, nie ausgeführt). Notfall-Dump:

```bash
sudo SUPABASE_DB_URL="$DATABASE_URL" \
  PRIVATE_ROOT=/var/lib/einfach-hausen/private \
  UPLOAD_ROOT=/var/lib/einfach-hausen/uploads \
  BACKUP_ROOT=/var/backups/einfach-hausen \
  /srv/einfach-hausen/scripts/backup-einfach-hausen.sh
```

Backup-Pfad: `/var/backups/einfach-hausen` (+ `scripts/backup-einfach-hausen.sh`). Die SQLite-Datenbank wird vor jedem Deploy online gesichert; `private.tar`/`uploads.tar` sichern Medien. Restore-Proof erfolgt gegen eine Kopie, nie gegen die Produktions-DB.

Nightly-Sicherung: `einfach-hausen-backup.timer` (03:25 UTC) bündelt SQLite+private+uploads und lädt das Bundle in den Supabase-Bucket `einfach-hausen-backups` (`deploy/backup-to-supabase.sh`). Zweitkopie außerhalb der VM: siehe `docs/EXTERNAL-BLOCKERS.md`.

Restore-Drill (verifiziert 2026-08-30): `scripts/restore-einfach-hausen.sh BACKUP_DIR --dry-run` prüft Checksummen, SQLite-`integrity_check` und Archive; `--stage DIR` extrahiert ohne Produktionskontakt. Beweis inkl. RPO/RTO: `docs/evidence/T-0204-restore-drill-20260830.md`.

Notification-Dispatcher: `einfach-hausen-dispatch.timer` (alle 5 Min) liefert fällige Outbox-Einträge über die Channel-Adapter (in_app, E-Mail via SMTP/Resend) mit Retry/Dead-Letter (`scripts/dispatch-notifications.mjs`).

Environment-Dateien (T-0200/T-0201): `/etc/einfach-hausen.env` enthält zusätzlich `AUTH_MODE`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SMTP_*`, `MAIL_FROM`. Build-Zeit-Variablen (`NEXT_PUBLIC_*`) liegen in `/etc/einfach-hausen-build.env` (ubuntu-lesbar) und werden von `deploy/update-on-oci.sh` vor `npm run build` gesourcet - ohne sie verliert der Client-Bundle die Supabase-Gateway-Origin und die CSP bricht den Login.

## KI-Ad-Credits (T-0207, gehärtet 2026-09-03)

`POST /api/ai/credits` und `PUT /api/ki` vergeben Bonus-KI-Aktionen nur noch
gegen signierten Werbenachweis (`src/lib/ad-receipt.ts`): Body
`{ receipt, signature }`, wobei `receipt` JSON `{ provider, nonce, ts }` ist
und `signature` HMAC-SHA256 darüber (hex, optional `sha256=`-Präfix).
Secret: `AD_RECEIPT_SECRET` (Fallback `WEBHOOK_SECRET`), 10-Minuten-Skew,
Single-Use via `grantAdCreditsOnce()` (exakte `rewarded-ad:<provider>:<nonce>`-
Quelle, Replay → 409). Ohne konfiguriertes Secret: Production fail-closed
(503), außerhalb Production Dev-Bypass (`ALLOW_UNSIGNED_AD_CREDITS=1` oder
Nicht-Production). Bis ein Rewarded-Ad-SDK verdrahtet ist, sendet die
Einstellungs-UI nur `{}` — der Server lehnt in Produktion ehrlich ab.

Legacy-Supabase-Hooks `POST /api/hooks/neue-anfrage` und
`POST /api/hooks/neues-angebot` sind stillgelegt (410, Details in
`docs/JOBS_VS_ANFRAGEN.md`); falsches `x-webhook-secret` antwortet weiter 401.

## Non-destructive restore proof (HA)

Nie Prod-DB direkt ersetzen. Dry-run gegen Staging-DB:

```bash
/srv/einfach-hausen/scripts/restore-einfach-hausen.sh \
  /var/backups/einfach-hausen/einfach-hausen-YYYYMMDDTHHMMSSZ \
  --dry-run --target staging
```

Historischer HA-Restore-Proof (Supabase PITR/`pg_dump`) ist nie implementiert worden und beschreibt nicht den betriebenen Stack. Geltender Restore-Pfad: Backup aus `/var/backups/einfach-hausen` gegen eine Kopie der SQLite-DB einspielen und verifizieren, nie direkt gegen die Produktions-DB.

## Reproducible service, tunnel, and Kestra probes

Run these without printing `/etc/einfach-hausen.env`:

```bash
systemctl is-active einfach-hausen.service
systemctl is-active einfach-hausen-kestra-proxy.socket
systemctl is-active einfach-hausen-backup.timer
curl -fsS http://127.0.0.1:3010/api/health
curl -fsS http://172.28.50.1:3010/api/health
systemctl status cloudflared --no-pager
cloudflared tunnel info sin-kestra
```

The first curl proves the app/service path. The second proves the private systemd socket proxy used by Kestra. `cloudflared tunnel info sin-kestra` proves the named tunnel connector state without exposing credentials.

Kestra flow: `einfach.hausen/einfach_hausen_health` (`deploy/kestra/einfach-hausen-health.yml`) requests `http://172.28.50.1:3010/api/health` every ten minutes. Inspect recent executions in the existing Kestra UI/API and require successful `app_health` executions; do not expose Kestra tokens in shell output or evidence.

## Deployment

Run the deployment as the `ubuntu` application owner; the script elevates only its filesystem/systemd operations:

```bash
/srv/einfach-hausen/deploy/update-on-oci.sh
```

The deployment script requires `main` with no changes except the two verified runtime media links, verifies and activates Node 22 for npm and child processes, prepares persistent directories, performs copy-only legacy-media migration, creates a pre-deploy online backup when the persistent DB already exists, fast-forwards to `origin/main`, builds against a disposable `/tmp` SQLite path, reloads systemd, restarts the service, and requires local health success. It does not use `git reset --hard` and does not delete production data.

## Failure handling

If health fails, inspect service logs before changing data:

```bash
sudo systemctl status einfach-hausen.service --no-pager
sudo journalctl -u einfach-hausen.service -n 120 --no-pager
```

Do not delete SQLite, WAL/SHM files, private media, or uploads as a troubleshooting step. Do not remove the old public fallback until the canonical domain/tunnel/Stripe/mail acceptance in `PRODUCTION_HANDOVER.md` is complete.

## Post-convergence production live check (2026-08-25, task T-0003)

Verified live state after repository convergence to `f0198ee`:

- `/api/health` returned HTTP 200 with `ok=true`, `database=ready` (public via Cloudflare and loopback on OCI).
- All documented public routes returned HTTP 200: `/`, `/leistungen`, `/preise`, `/so-funktionierts`, `/sicherheit`, `/eigenheimbesitzer`, `/partner`, `/impressum`, `/datenschutz`, `/agb`, `/barrierefreiheit`, `/kontakt`, `/ueber-uns`, `/hilfe`, `/login`, `/register`.
- Deployed commit on OCI (`/srv/einfach-hausen` `git rev-parse HEAD`) is `dcd53ca1f463e9d64ee3fc6838d1cdb3fb2bb557`, exactly the verified release. Runtime process runs Node `v22.23.0` from the validated nvm path; service `active`.
- No redeploy required for convergence commit `f0198ee`: `git diff --name-only dcd53ca1..f0198ee` contains no paths under `src/`, `deploy/`, package manifests, `next.config.ts` or middleware — the diff is docs/tooling only.
- Login page reachable; the platform has no fixed demo accounts by design (E2E creates random credentials), so no demo login check applies.
- Access path used: SSH relayed through the trusted fleet Mac; direct non-interactive SSH from this agent host to sin-supabase is not provisioned.

## SSH-Zugang OCI (dauerhaft, kein Tailscale-Check)

Tailscale SSH wurde auf sin-supabase deaktiviert (2026-09-01) weil der
Check-Mode periodisch eine Browser-Auth erzwang und Deployments blockierte.

- Port 22: normaler sshd (openssh), keine Tailscale SSH-Interception mehr
- Port 2222: zweiter sshd als Fallback
- SSH-Config-Alias: `sin-supabase` (Port 22) + `sin-supabase-direct` (Port 2222)
- Auth: SSH-Key (id_ed25519) - kein Tailscale Browser-Login mehr nötig
- Wenn Tailscale SSH wieder aktiviert werden soll: `sudo tailscale set --ssh=true`
  (ACHTUNG: nur über Port 2222 verbinden, sonst Session-Abbruch)

## SLO probes and alerting (T-0123)

`scripts/t0123-slo-probes.mjs` (`npm run test:slo`) runs five component-local probes and emits one JSON line per probe plus a summary line, each carrying a `correlation_id` for joining with app logs:

| Probe | Component | Target |
|---|---|---|
| `web_health` | App + SQLite | `/api/health` 200 `ok:true` with `database=ready` within 3s |
| `web_homepage` | Landing render | `/` returns 200 within 5s |
| `auth_authority` | SIN Supabase OSS | GoTrue answers (<500) within 3s |
| `dispatch_fresh` | Notification outbox dispatcher | run evidence within 15 min (journald) or timer active |
| `backup_fresh` | Backup pipeline | newest backup evidence within 48h |

Exit code is non-zero when any probe breaches. `SLO_BASE_URL` retargets the run (default `http://127.0.0.1:3010`).

Alert path without a new platform: `deploy/kestra/einfach-hausen-slo*.yml` schedules the probes every 15 minutes through the existing Kestra instance; a breach fails the Kestra execution (visible in execution history/API) and the probe JSON lines land in the Kestra task logs with the failing component name and correlation id. On the host, the same evidence is in journald, so `journalctl -u einfach-hausen-dispatch` and probe lines share correlation ids.

## Backup/restore drill (T-0124)

`scripts/t0124-backup-drill.sh` (`npm run test:backup-drill`, wöchentlich via `deploy/einfach-hausen-drill.{service,timer}`, So 03:00) führt die nicht-destruktive Übung aus: neuestes Backup unter `/var/backups/einfach-hausen` wählen, RPO (Backup-Alter) berechnen, `restore-einfach-hausen.sh BACKUP --stage TMPDIR` (Checksums, SQLite-Integrität, Archive), `PRAGMA integrity_check` auf der wiederhergestellten DB, Nachweis der `private/`-Wiederherstellung, RTO messen. Eine JSON-Evidence-Zeile je Lauf geht an `/var/lib/einfach-hausen/drill-evidence.jsonl`. Fehlende Archive/DB, SQLite-Korruption oder fehlgeschlagene Verifikation brechen laut mit Exit 1.

Einrichtung (einmalig): `sudo cp deploy/einfach-hausen-drill.{service,timer} /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now einfach-hausen-drill.timer`. Der Service ruft das Skript per sudo auf (Backups sind root:0700 aus Datenschutzgründen); dafür ist eine sudoers-Regel nötig: `ubuntu ALL=(root) NOPASSWD: /srv/einfach-hausen/scripts/t0124-backup-drill.sh` in `/etc/sudoers.d/eh-backup-drill`. Solange die Regel fehlt, läuft der Drill manuell per `sudo npm run test:backup-drill`.

### Cloudflare 1033 (Tunnel offline) — Diagnose

Der Cloudflare-Fehler 1033 bedeutet: die Cloudflare-Edge findet keinen verbundenen Tunnel-Connector für den Hostnamen. Auf dieser Host zwei getrennte Tunnel beachten:

- **Produktion** (`einfachhausen.de`): Tunnel `sin-kestra` (`cloudflared-sin-kestra.service`). Probe: `curl -s -o /dev/null -w '%{http_code}' https://einfachhausen.de/api/health` → 200 heißt gesund. Bei 1033: `systemctl status cloudflared-sin-kestra` + `cloudflared tunnel info sin-kestra`.
- **Preview/Test-Hosts** (`einfach-hausen-preview.delqhi.com`, `napp.delqhi.com`): Tunnel `d81a6644` (`cloudflared-eh-preview.service`), seit 2026-09-02 absichtlich deaktiviert (T-0210-Abschluss). Diese Hostnames liefern dauerhaft 1033/530, bis der Tunnel wieder aktiviert wird — kein Incident.

Einzelner 1033 im Log bei sonst 200-Antworten ist ein transienter Edge-Event (z. B. Connector-Rotation während eines Deploys) und kein Handlungsanlass; andauernde 1033 auf der Produktionsdomain erst.

## Disaster Recovery (T-0137)

Reproduzierbare Wiederherstellungsabläufe für DB-Verlust, korrupte Releases und fehlerhafte Migrationen: **docs/DISASTER_RECOVERY_RUNBOOK.md**. Verifiziert gegen T-0136/T-0124 (gleicher Restore-Kern: Checksummen → integrity_check → Stage). Recovery-Ziele (Betriebsnachweis): RPO = Backup-Alter (stündliche Backups), RTO < 15 min produktiv (Drill misst 5s für Verify+Stage).

## Infrastruktur-Kostenbasis & Forecast (2026-09)

Einfache, transparente monatliche Kostenbasis ohne FinOps-Overhead (Stand: September 2026, Anforderung aus Issue #10):

| Dienst / Komponente | Typ | Kosten / Monat | Anmerkung |
|---|---|---|---|
| **Oracle Cloud (OCI)** | VM (Always Free / Ampere A1) | 0,00 € | 4 OCPU, 24 GB RAM, persistent block storage |
| **Cloudflare** | DNS & Argo Tunnel Ingress | 0,00 € | Free Tier / Standard Tunnel ausreichend |
| **STRATO** | Domain & Mail-Routing (MX/SPF/DKIM) | ~4,00 € | Jährliche Abrechnung umgelegt |
| **Stripe** | Zahlungsabwicklung / Connect | Variabel (~1,5 % + 0,25 €) | Nur bei Transaktionen; 0 % Plattformprovision |
| **Gesamte Fixkosten** | | **~4,00 € / Monat** | Extrem schlanke, wartungsarme Kostenstruktur |

**Forecast & Skalierungspfad:**
- Bis 1.000 aktive Nutzer/Monat verbleiben die Infrastrukturkosten stabil unter 10,00 €/Monat.
- Bei Überschreiten der OCI Free-Tier-Grenzen (z. B. Backup-Speicher > 100 GB) skaliert Block-Storage mit ~0,025 €/GB/Monat.
- Transaktionskosten tragen sich über die gebuchten Partner-Tarife und Mitgliedschaften selbst.

````


## docs/LEXIKON.md
SHA256: ab0c3e2a45a1e18bb6cf21b8fe397cdef775c3edb3aec71a21a0974ab6839a67

````text
# Lexikon — Wissens-Archetyp der öffentlichen Website

**Stand:** 2026-09-05 · **Branch:** `feat/lexikon-enterprise-redesign` · **Routen:** `/lexikon`, `/lexikon/[begriff]`, `/lexikon/kategorie/[kategorie]`

Das Lexikon ist kein Glossar mit Kartenraster mehr, sondern ein **Entscheidungswerkzeug für Eigentümer**: Jeder Begriff beantwortet dieselben vier Fragen (Was ist das? Was kostet es? Wie läuft es ab? Betrifft es mein Haus?) und führt zu einem konkreten nächsten Schritt — *Anliegen beschreiben*. Das entspricht `docs/PRODUCT_POSITIONING.md` („Entscheidungssicherheit erhöhen, mentale Last reduzieren“).

## 1. Architektur

| Datei | Rolle |
| --- | --- |
| `src/lib/seo-cluster.ts` | Unverändert. Hält die vier SEO-Pilot-Einträge (`LEXIKON_TERMS`) und bleibt Ziel bestehender Blog-Querverweise. |
| `src/lib/lexikon.ts` | **Single Source of Truth.** Reichert die Pilot-Einträge an (`ENRICHMENT`), ergänzt 14 neue Einträge, definiert 7 Kategorien und liefert Helper (`getEintrag`, `eintraegeInKategorie`, `verwandteEintraege`, `nachbarn`, `lesezeit`, `assertLexikonIntegrity`). |
| `src/components/marketing/lexikon/lexikon.module.css` | Alle Lexikon-Stile. Ausschließlich `--eh-*`-Tokens, `composes: container from '../mkt.module.css'`. |
| `src/components/marketing/lexikon/entry-card.tsx` | Server-taugliche Eintragskarte, `RelevanzBadge`, `MiniLevels`, `EntryCardData` (serialisierbarer DTO). |
| `src/components/marketing/lexikon/lexikon-sections.tsx` | Server-Sektionen: `toCardData`, `KategorieBento`, `EntryGrid`, `KategorieIcon`. |
| `src/components/marketing/lexikon/lexikon-explorer.tsx` | Client: Hero, Suche, Sticky-Register, Layout-animiertes Raster. |
| `src/components/marketing/lexikon/lexikon-detail.tsx` | Client: `ReadingProgress`, `Gauges`, `Toc` (Scroll-Spy), `AblaufTimeline`, `Checklist`. |
| `src/app/lexikon/page.tsx` | Index (Explorer + Bento + „So nutzt du das Lexikon“ + CTA). JSON-LD `DefinedTermSet`. |
| `src/app/lexikon/[begriff]/page.tsx` | Detail. JSON-LD `Article` (+ `about: DefinedTerm`), `FAQPage`, `BreadcrumbList`. |
| `src/app/lexikon/kategorie/[kategorie]/page.tsx` | **Neu.** Kategorieseite mit `ItemList`-JSON-LD. |
| `src/app/lexikon/not-found.tsx` | **Neu.** Lexikon-eigene 404 mit Suche-Einstieg und den drei dringlichsten Begriffen. |
| `src/app/sitemap.ts` | Nutzt jetzt `LEXIKON_EINTRAEGE` + `LEXIKON_KATEGORIEN`. |

Die alte `LexikonTerm`-Struktur bleibt vollständig kompatibel; `LexikonEintrag` ist eine strikte Obermenge.

## 2. Content-Modell (`LexikonEintrag`)

```ts
{
  slug, begriff, title, description, definition,      // wie bisher (seo-cluster)
  kosten[], ablauf[{title,text}], prüfpunkte[], faqs[], related[],
  kategorie: LexikonKategorieSlug,                      // 1 von 7
  kurz: string,                                         // Ein-Satz-Nutzen für Karten (≤ 120 Zeichen)
  relevanz: 'pflicht' | 'empfohlen' | 'wissen',        // Badge + Filter
  synonyme: string[],                                   // Suchtreffer + „Auch bekannt als“
  wannHandeln: string,                                  // konkreter Trigger („Wann handeln“)
  stufen: { kosten, aufwand, dringlichkeit },           // je 1–4, qualitativ, KEINE Preise
  kennzahlen: [{label, value, hint}] × 3,               // Zuständigkeit, Intervall, Nachweis, …
  verwandt: string[],                                   // Slugs anderer Einträge (werden geprüft)
  leistung: { href, label },                            // Sekundär-CTA → Leistungsseite
}
```

### Redaktionsregeln (verbindlich)

- **Keine erfundenen Statistiken, Studien, Personen oder Reviews.** Kennzahlen sind Intervalle, Zuständigkeiten, Nachweise, gesetzliche Rahmen — keine Marktzahlen.
- **Kostenrahmen bleiben Orientierung** („niedriger dreistelliger Bereich“), nie Preise. Der Hinweis „verbindlich ist der Partnerbetrieb“ steht auf jeder Detailseite (`InfoPanel`).
- **Stufen** sind qualitative Einordnung (gering/moderat/erheblich/hoch). Dringlichkeit ≥ 3 wird terra-farbig markiert — der einzige warme Akzent.
- **Ton:** sachlich, Du-Ansprache, keine Superlative, kein KI-Foregrounding. Jeder Eintrag endet in „Anliegen beschreiben“, nicht in „KI fragen“.
- **Slugs:** neue Einträge ASCII (`waermepumpe`), bestehende Umlaut-Slugs (`lüftungsanlage`) bleiben aus Kompatibilitätsgründen; `getEintrag` dekodiert URL-encodete Slugs.

### Neuen Begriff anlegen

1. Objekt in `NEUE_EINTRAEGE` (`src/lib/lexikon.ts`) ergänzen — alle Felder, 3 Kennzahlen, 4 Prüfpunkte, 3 FAQs, 3 Related-Links, 2–4 `verwandt`-Slugs.
2. `npm run build` — `assertLexikonIntegrity()` bricht den Build bei doppelten Slugs, unbekannten Kategorien oder nicht auflösbaren `verwandt`-Slugs.
3. Sitemap, Kategorieseite, A–Z-Register, Vor/Zurück-Navigator und JSON-LD aktualisieren sich automatisch.
4. Optional: Slug in `FEATURED` (`src/app/lexikon/page.tsx`) für den Hero-Stapel.

### Neue Kategorie anlegen

`LEXIKON_KATEGORIEN` ergänzen, Union `LexikonKategorieSlug` erweitern, Icon in `ICONS` (`lexikon-sections.tsx`) hinterlegen. Die Kategorieseite entsteht automatisch über `generateStaticParams`.

## 3. Motion-Design (innerhalb DESIGN.md)

Motion nutzt **`motion/react`** (bereits Dependency) für Zustands-/Layout-Animationen und die bestehende GSAP-Schicht (`Reveal`, `Stagger`) für Scroll-Reveals. Regeln:

- Nur `transform`/`opacity`; eine Kurve `cubic-bezier(0.22, 1, 0.36, 1)`; kein Bounce/Elastic; kein permanentes Loopen.
- `MotionConfig reducedMotion="user"` auf Index und Detail → bei `prefers-reduced-motion` nur Endzustände. CSS-Transitions kollabieren über die `--eh-dur-*`-Tokens.
- Ohne JavaScript ist nichts versteckt (Server-Markup vollständig, Motion additiv).

| Fläche | Element | Verhalten |
| --- | --- | --- |
| Index-Hero | Headline | Wort-für-Wort-Rise (y + 1,5° Rotation), Akzentwörter in Teal-700 |
| Index-Hero | Kartenstapel | 3 Einträge, Tiefenstaffelung (`z`, `scale`, `opacity`), Mouse-Parallax über `useSpring` (±9° / ±7°), Hover-Lift |
| Index-Hero | Suche | Fokus-Ring wächst weich, `/` fokussiert, `Esc` leert, Clear-Button |
| Register | Chips / A–Z | Sticky unter Header (`top: 72px`), `aria-pressed`, Buchstaben ohne Treffer `disabled`, Live-Zähler |
| Raster | Karten | `LayoutGroup` + `AnimatePresence mode="popLayout"`: Karten gleiten beim Filtern an ihre neue Position, Treffer werden per `<mark>` hervorgehoben |
| Karte | Hover | Lift −5px, Shadow-md, Bottom-Line `scaleX 0→1`, Pfeil-Kreis füllt Teal |
| Detail | Lesefortschritt | Fixe 3px-Linie unter dem Header, `useScroll` + `useSpring` |
| Detail | „Auf einen Blick“ | Sticky Dark-Panel (Teal-900) mit 3 Kennzahlen + 3 segmentierten Gauges, die `whileInView` sequenziell füllen |
| Detail | TOC | Scroll-Spy via `IntersectionObserver`, aktive Zeile rückt 3px vor |
| Detail | Ablauf | Vertikale Timeline; Schiene füllt sich gescrubbt (`scaleY`), Punkte springen in der Lesezone auf aktiv |
| Detail | Prüfpunkte | Abhakbare Checkliste, Fortschrittsbalken, ab 1 Treffer erscheint „Als Anliegen beschreiben“ |
| Detail | Navigator | Vor/Zurück-Karten (alphabetisch, zyklisch) |

## 4. SEO / Structured Data

- `/lexikon`: `BreadcrumbList` + `DefinedTermSet` mit allen `DefinedTerm`s.
- `/lexikon/[begriff]`: `BreadcrumbList` (4 Ebenen inkl. Kategorie), `Article` mit `about: DefinedTerm`, `FAQPage`.
- `/lexikon/kategorie/[kategorie]`: `BreadcrumbList` + `ItemList`.
- Sitemap: 18 Begriffe + 7 Kategorien + Index.

## 5. Accessibility

- Filter-Chips und Buchstaben sind echte `<button aria-pressed>`; Trefferzahl ist `aria-live="polite"`.
- Gauges tragen `role="img"` mit Textalternative („Kosten: moderat (Stufe 2 von 4)“).
- Checkliste: `<button aria-pressed>`, Zusammenfassung `aria-live`.
- Hero-Headline: dekorative Wort-Spans `aria-hidden`, vollständiger Text per `aria-label` auf `<h1>`.
- Kartenstapel im Hero ist `aria-hidden` und `tabIndex={-1}` (reine Visualisierung; alle Einträge sind im Raster erreichbar).
- Fokus: bestehende `.mkt :focus-visible`-Regel; Sticky-Register überlappt keine Fokusziele (`scroll-margin-top` auf Blöcken).

## 6. Verifikation & offene Punkte

Lokal verifiziert (Sandbox, Next 16): `tsc` grün, `eslint` grün (inkl. React-Compiler-Regeln), `next build` mit 18 Begriffs- + 7 Kategorieseiten SSG, SSR-Smoke (200/404, Umlaut-Slug).

Im Repo noch auszuführen (OCI-VM, siehe `AGENTS.md`):

1. `npm run lint && npm run build`
2. `npm run test:public-site` — erwartet unverändert `/lexikon`-Link im Hilfe-Hub.
3. `npm run test:visual:update` — **Baselines für `/lexikon` bewusst neu setzen** (Redesign), danach `npm run test:visual`.
4. `npm run test:a11y` und `npm run test:responsive` (390 / Tablet / 1320) — Sticky-Register auf 390 px auf Overflow prüfen (horizontaler Scrollbalken ist per Design ausgeblendet, Inhalt bleibt wischbar).
5. `npm run test:public-nav` — unverändert.

````


## package.json
SHA256: dd4695e7ce397a7e7e77e15f22ab9495f8ccbee1a63edf88b03e4dc613a92a0e

````text
{
  "name": "einfach-hausen",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test:e2e": "node scripts/e2e.mjs",
    "test:api-contract": "node scripts/eh02-api-contract-regression.mjs",
    "test:security": "node scripts/security-regression.mjs && node scripts/t0003-security-regression.mjs && node scripts/t0120-security-fuzz.mjs",
    "test:supply-chain": "node scripts/t0121-supply-chain.mjs",
    "graph:update": "graphify update .",
    "graph:check": "graphify check-update .",
    "graph:install": "graphify hook install && graphify update .",
    "crm:import": "python3 scripts/import-business-research.py",
    "test:crm": "node scripts/crm-e2e.mjs",
    "test:fixtures": "rm -f /tmp/einfach-hausen-fixtures.db /tmp/einfach-hausen-fixtures.db-wal /tmp/einfach-hausen-fixtures.db-shm; DATABASE_PATH=/tmp/einfach-hausen-fixtures.db node --experimental-strip-types scripts/test-fixtures.mjs",
    "test:smoke": "node scripts/production-smoke.mjs",
    "test:e2e:architecture": "node scripts/e2e-architecture.mjs",
    "test:intake": "node scripts/t0004-intake-regression.mjs",
    "test:matching": "node scripts/t0005-regression.mjs && node scripts/t0005-plus-regression.mjs",
    "test:t0005": "node scripts/t0005-plus-regression.mjs",
    "test:onboarding": "node scripts/t0103-onboarding-regression.mjs",
    "test:notifications": "node scripts/t0104-notification-regression.mjs",
    "test:matching:t0107": "node scripts/t0107-matching-regression.mjs",
    "test:matching:benchmark": "node scripts/t0108-matching-benchmark.mjs",
    "test:review": "node scripts/t0110-review-regression.mjs",
    "test:t0168-auth": "node scripts/t0168-dual-auth-regression.mjs",
    "test:t0170-auth": "node scripts/t0170-auth-e2e.mjs",
    "release-gate": "node scripts/release-gate.mjs",
    "test:a11y": "node scripts/release-gate.mjs --only=static,build,a11y",
    "test:visual": "node scripts/visual-regression.mjs",
    "test:visual:update": "GATE_UPDATE_BASELINES=1 node scripts/visual-regression.mjs --update-baselines",
    "test:card-visuals": "node scripts/card-visuals-contract.mjs",
    "test:perf": "node scripts/release-gate.mjs --only=build,perf",
    "test:website-matrix": "node scripts/website-acceptance-matrix.mjs",
    "test:visual:apps": "node scripts/app-visual-regression.mjs",
    "test:visual:apps:update": "node scripts/app-visual-regression.mjs --update-baselines",
    "test:responsive": "node scripts/responsive-matrix.mjs",
    "test:a11y:apps": "node scripts/a11y-apps.mjs",
    "test:a11y:matrix": "node scripts/a11y-matrix.mjs",
    "test:i18n": "node scripts/i18n-regression.mjs",
    "test:public-site": "node scripts/public-website-contract.mjs",
    "test:public-nav": "node scripts/public-navigation-e2e.mjs",
    "test:auth-design": "node scripts/auth-design-system-e2e.mjs",
    "test:observability": "node scripts/observability-regression.mjs",
    "test:slo": "node scripts/t0123-slo-probes.mjs",
    "test:backup-drill": "bash scripts/t0124-backup-drill.sh",
    "test:error-tracking": "node scripts/t0132-error-tracking-regression.mjs",
    "test:health-regression": "node scripts/t0134-health-regression.mjs",
    "test:export-regression": "node scripts/t0143-export-regression.mjs",
    "test:deletion-regression": "node scripts/t0144-deletion-regression.mjs",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@capacitor/keyboard": "^8.0.5",
    "@capacitor/status-bar": "^8.0.3",
    "@gsap/react": "^2.1.2",
    "@supabase/ssr": "^0.12.5",
    "@supabase/supabase-js": "^2.112.4",
    "bcryptjs": "^3.0.3",
    "better-sqlite3": "^13.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.4.0",
    "gsap": "^3.15.0",
    "lenis": "^1.3.26",
    "lucide-react": "^1.39.0",
    "motion": "^13.1.1",
    "next": "16.3.1",
    "nodemailer": "^9.0.6",
    "radix-ui": "^1.6.7",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "shadcn": "^4.19.1",
    "stripe": "^22.5.0",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "unlazy": "^2.0.1",
    "web-vitals": "^6.2.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@capacitor/cli": "^8.5.0",
    "@tailwindcss/postcss": "^4",
    "@types/better-sqlite3": "^9.6.0",
    "@types/node": "^20",
    "@types/nodemailer": "^8.0.1",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "axe-core": "^4.13.0",
    "eslint": "^9",
    "eslint-config-next": "16.3.1",
    "pixelmatch": "^7.2.0",
    "playwright-core": "^1.62.1",
    "pngjs": "^7.0.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "overrides": {
    "uuid": "npm:uuid@11.1.1"
  }
}

````


## src/app/layout.tsx
SHA256: f54944f22ee23a43e40d1d2ba3b4d8f10e65c7f44f0397a986a79cb780c0b99b

````text
import type { Metadata,Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
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

````


## src/app/globals.css
SHA256: 4721b8a3af2685c2fbd629be5b2916d643fd0b09f1907f205df791d51818841a

````text
@import 'tailwindcss';
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* shadcn font-sans mapped to the brand Inter Variable (DESIGN.md contract). */
@theme inline {
  --font-sans: var(--font-marketing), Inter, ui-sans-serif, system-ui, sans-serif;
}

:root{--green:#105258;--green-dark:#0d4448;--green-soft:#dcebec;--ink:#0b1623;--navy:#061522;--navy2:#0d2031;--muted:#6e7780;--muted-shadcn:oklch(0.97 0 0);--line:#e6e9e7;--bg:#f6f8f6;--white:#fff;--background:oklch(1 0 0);--foreground:oklch(0.145 0 0);--card:oklch(1 0 0);--card-foreground:oklch(0.145 0 0);--popover:oklch(1 0 0);--popover-foreground:oklch(0.145 0 0);--primary:oklch(0.205 0 0);--primary-foreground:oklch(0.985 0 0);--secondary:oklch(0.97 0 0);--secondary-foreground:oklch(0.205 0 0);--muted-foreground:oklch(0.556 0 0);--accent:oklch(0.97 0 0);--accent-foreground:oklch(0.205 0 0);--destructive:oklch(0.577 0.245 27.325);--border:oklch(0.922 0 0);--input:oklch(0.922 0 0);--ring:oklch(0.708 0 0);--chart-1:oklch(0.87 0 0);--chart-2:oklch(0.556 0 0);--chart-3:oklch(0.439 0 0);--chart-4:oklch(0.371 0 0);--chart-5:oklch(0.269 0 0);--radius:0.625rem;--sidebar:oklch(0.985 0 0);--sidebar-foreground:oklch(0.145 0 0);--sidebar-primary:oklch(0.205 0 0);--sidebar-primary-foreground:oklch(0.985 0 0);--sidebar-accent:oklch(0.97 0 0);--sidebar-accent-foreground:oklch(0.205 0 0);--sidebar-border:oklch(0.922 0 0);--sidebar-ring:oklch(0.708 0 0)}*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:var(--font-marketing),Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--ink);background:var(--bg)}/* Legacy anchor resets must sit in @layer base: un-layered, they override
   Tailwind utilities (e.g. text-white on dark CTAs) and break axe contrast. */
@layer base { a { text-decoration:none; color:inherit; } }button,input,textarea,select{font:inherit}button{cursor:pointer}.brand{display:flex;align-items:center;gap:10px;color:#0d4448}.brand[data-inverse=true]{color:white}.brand-icon{width:42px;height:38px;border:2px solid currentColor;border-radius:8px;display:grid;place-items:center;position:relative}.brand-icon b{font-size:10px;position:absolute;bottom:2px}.brand>span:last-child{display:flex;flex-direction:column}.brand strong{font-size:15px}.brand small{font-size:11px;color:#68726b}.btn{border:0;border-radius:9px;padding:12px 16px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:.15s}.btn:hover{transform:translateY(-1px)}.btn.primary{background:var(--green);color:white}.btn.dark{background:#102235;color:white}.btn.light{background:white;color:#0d2031}.btn.ghost{background:transparent;border:1px solid var(--line)}.wide{width:100%}.landing{min-height:100vh;display:grid;grid-template-columns:1.05fr .95fr;max-width:1180px;margin:auto;gap:80px;padding:80px 32px;align-items:center}.landing-copy .brand{margin-bottom:45px}.eyebrow{color:var(--green-dark);font-weight:800}.landing h1{font-size:clamp(42px,6vw,72px);line-height:1.03;letter-spacing:-.04em;margin:10px 0 22px}.landing h1 span{color:var(--green-dark)}.landing-copy>p:not(.eyebrow){font-size:19px;line-height:1.65;color:#55605a;max-width:650px}.landing-actions{display:flex;gap:12px;margin:28px 0 16px;flex-wrap:wrap}.login-link{font-weight:650;color:#46504a}.feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.feature-grid article{background:white;border:1px solid #edf0ee;border-radius:18px;padding:22px;display:flex;gap:15px;box-shadow:0 14px 45px rgba(21,45,31,.05)}.feature-grid svg{color:var(--green);flex:0 0 auto}.feature-grid strong{display:block;margin-bottom:5px}.feature-grid p{margin:0;color:#68736c;line-height:1.45;font-size:14px}.auth-page{min-height:100vh;display:grid;place-items:center;padding:30px;background:linear-gradient(160deg,#f8faf8,#eef5ec)}.auth-card{width:min(430px,100%);background:white;border-radius:24px;padding:30px;box-shadow:0 28px 80px rgba(23,49,31,.12);display:flex;flex-direction:column;gap:16px}.wide-card{width:min(560px,100%)}.auth-card h1{margin:12px 0 0;font-size:28px}.auth-card>p{margin:0;color:var(--muted)}label{display:flex;flex-direction:column;gap:7px;font-size:13px;font-weight:700}label small{font-weight:400;color:var(--muted)}input,textarea,select{border:1px solid #dfe4e0;border-radius:9px;background:white;padding:12px 13px;outline:none;min-width:0}input:focus,textarea:focus,select:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(16,82,88,.12)}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.alert{padding:12px 14px;border-radius:9px;font-size:13px;font-weight:650;display:flex;align-items:center;gap:8px}.alert.error{background:#fff0ef;color:#a12b25}.alert.success{background:#eaf8e7;color:#0d4448}.app-page{min-height:100vh;background:radial-gradient(circle at top,#fff,#eef3ef 70%);padding:22px}.phone-shell{width:min(480px,100%);margin:0 auto;background:white;min-height:calc(100vh - 44px);border-radius:36px;box-shadow:0 24px 80px rgba(18,39,27,.16);overflow:hidden;display:flex;flex-direction:column;border:1px solid #e7ece8}.topbar{padding:22px 22px 16px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);z-index:10}.topbar>div:first-child{display:flex;flex-direction:column}.topbar>div:first-child strong{font-size:16px}.topbar>div:first-child small{font-size:12px;color:#9caab4}.top-actions{display:flex;gap:16px}.screen{padding:8px 20px 92px;flex:1}.bottom-nav{height:72px;position:fixed;left:50%;bottom:22px;transform:translateX(-50%);width:min(478px,calc(100% - 46px));display:grid;grid-template-columns:repeat(5,1fr);align-items:center;border-top:1px solid var(--line);background:rgba(255,255,255,.96);backdrop-filter:blur(18px);z-index:15;border-radius:0 0 35px 35px}.bottom-nav a{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10px;color:#69736d}.bottom-nav a.active{color:var(--green);font-weight:800}.hello h1,.page-title{margin:8px 0 2px;font-size:23px}.hello p{margin:0 0 18px;color:#535c56}.request-card{background:#f8faf8;border:1px solid #edf1ee;border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:11px}.request-bubble{display:flex;gap:10px;align-items:flex-start}.request-bubble svg{color:var(--green)}.request-bubble strong{font-size:13px}.request-bubble p{font-size:12px;color:var(--muted);margin:2px 0}.request-card textarea{background:#dcebec;border:0}.request-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.file-label{font-weight:600;color:#4d574f}.file-label input{padding:8px;font-size:12px}.section-title{display:flex;justify-content:space-between;align-items:center;margin:22px 0 10px}.section-title strong{font-size:14px}.section-title a{font-size:12px;color:var(--green-dark)}.stack{display:flex;flex-direction:column;gap:10px}.job-row{display:flex;gap:10px;align-items:center;padding:9px;background:white;border:1px solid var(--line);border-radius:13px}.job-row img,.thumb-placeholder{width:60px;height:54px;border-radius:10px;object-fit:cover;background:#dcebec;display:grid;place-items:center;color:var(--green)}.grow{flex:1;min-width:0}.job-row strong{display:block;font-size:13px}.job-row small,.job-card small,.pro-request small{display:flex;align-items:center;gap:4px;color:#65706a;font-size:10px;margin-top:4px}.job-row span{font-size:10px;color:var(--green-dark);font-weight:700}.job-row .right{display:flex;align-items:center;gap:4px}.job-row .right b{color:var(--green-dark);font-size:13px}.empty{border:1px dashed #d7dfd9;border-radius:16px;padding:28px;display:flex;flex-direction:column;align-items:center;text-align:center;color:#6c766f}.empty svg{color:var(--green);margin-bottom:8px}.empty strong{color:var(--ink)}.empty p{margin:5px 0 0;font-size:12px}.empty.compact{padding:16px}.job-card{border:1px solid var(--line);border-radius:15px;padding:15px;display:flex;justify-content:space-between;gap:12px}.job-card h3{margin:7px 0 5px}.job-card p{font-size:12px;line-height:1.45;color:#59635d;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.job-card-side{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between}.status{display:inline-flex;padding:4px 7px;border-radius:999px;background:#eef1ef;font-size:9px;text-transform:uppercase;font-weight:800;letter-spacing:.04em}.status.accepted,.status.completed{background:#dcebec;color:#0d4448}.status.in_progress{background:#fff2cf;color:#876000}.status.cancelled{background:#ffebea;color:#9d2922}.detail-head h1{font-size:24px;margin:10px 0 7px}.detail-head>p{font-size:13px;line-height:1.55;color:#535e57}.meta-line{display:flex;gap:14px;flex-wrap:wrap}.meta-line span{display:flex;align-items:center;gap:5px;font-size:11px;color:#647068}.meta-line svg{width:14px;height:14px}.hero-photo{width:100%;height:200px;object-fit:cover;border-radius:15px;margin-top:14px}.quote{position:relative;border:1px solid var(--line);border-radius:15px;padding:14px;background:white}.quote.accepted{border-color:#7fa8a2;box-shadow:0 0 0 2px #dcebec inset}.recommend,.new{display:inline-block;background:#1b8569;color:white;font-size:8px;padding:3px 6px;border-radius:4px;font-weight:900;margin-bottom:7px}.quote-top{display:flex;justify-content:space-between;gap:15px}.quote-top strong{font-size:13px}.quote-top small{display:block;color:#6c766f;font-size:10px;margin-top:3px}.quote-top b{color:var(--green-dark)}.quote p{font-size:11px;color:#55605a}.quote>small{font-size:10px;color:#6d776f}.quote form{margin-top:11px}.accepted-label{margin-top:10px;display:flex;align-items:center;gap:6px;color:var(--green-dark);font-size:12px;font-weight:800}.accepted-label svg{width:17px}.secure-card{display:flex;align-items:center;gap:10px;border:1px solid #dbe9d8;background:#f5fbf3;padding:13px;border-radius:14px}.secure-card>svg{color:var(--green)}.secure-card>div{flex:1}.secure-card strong{font-size:12px}.secure-card p{margin:2px 0;font-size:10px;color:#66716a}.secure-card .btn{font-size:11px;padding:9px}.chat{border:1px solid var(--line);border-radius:16px;background:#f8faf8;padding:10px;display:flex;flex-direction:column;gap:8px}.msg{max-width:82%;background:white;border-radius:12px;padding:8px 10px}.msg.mine{align-self:flex-end;background:#d0e8e0}.msg small{font-size:8px;color:#6b766f}.msg p{font-size:12px;margin:2px 0}.chat-form{display:flex;gap:7px;margin-top:5px}.chat-form input{flex:1}.chat-form button{width:44px;border:0;border-radius:9px;background:var(--green);color:white}.review-card{display:flex;flex-direction:column;gap:10px;border:1px solid var(--line);padding:14px;border-radius:14px}.stars{color:#e5b41f;display:flex;gap:3px}.stars svg{width:18px}.appointment{border:1px solid var(--line);padding:13px;border-radius:14px;display:flex;gap:11px;align-items:center}.appointment>svg{color:var(--green)}.appointment>div{flex:1}.appointment strong{font-size:13px}.appointment p,.appointment small{margin:2px 0;font-size:10px;color:#6a746d}.conversation{display:flex;gap:11px;padding:13px;border:1px solid var(--line);border-radius:14px}.conversation>svg{color:var(--green)}.conversation div{min-width:0}.conversation strong,.conversation small{display:block}.conversation small{font-size:10px;color:#707a73}.conversation p{font-size:11px;color:#5d675f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:5px 0 0}.profile-form{display:flex;flex-direction:column;gap:12px;margin:15px 0 22px}.pro-theme{background:#e9edf0}.pro-theme .phone-shell{background:var(--navy);border-color:#122638;color:#f7fafc}.pro-theme .topbar{background:rgba(6,21,34,.96);border-bottom:1px solid #13293b}.pro-theme .bottom-nav{background:rgba(6,21,34,.97);border-color:#193044}.pro-theme .bottom-nav a{color:#8ca0af}.pro-theme .bottom-nav a.active{color:#77a8ff}.pro-theme .screen{background:var(--navy)}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:5px 0 18px}.metrics div{background:#102435;border:1px solid #183043;border-radius:10px;padding:11px}.metrics small{font-size:9px;color:#a6b3be;display:block;min-height:25px}.metrics b{display:block;margin-top:4px;font-size:17px}.pro-theme .section-title a{color:#d8e1e8}.pro-request{position:relative;background:white;color:var(--ink);border-radius:14px;padding:13px;display:flex;gap:10px;align-items:center}.pro-request .request-main{flex:1;min-width:0}.pro-request strong{display:block;font-size:13px}.pro-request small svg{width:13px;height:13px}.pro-request .request-main>span:not(.new){display:block;color:#86908b;font-size:8px;margin-top:10px}.pro-request .request-main>b{display:block;font-size:13px;margin-top:3px}.pro-request img{width:92px;height:70px;object-fit:cover;border-radius:10px}.pro-request>svg{width:16px}.quoted-badge{position:absolute;right:12px;bottom:9px;background:#dcebec;color:#0d4448;padding:4px 7px;border-radius:6px;font-size:9px;font-weight:800}.dark-empty{border-color:#284052;color:#92a3af}.dark-empty strong{color:white}.pro-detail>p{color:#c0cbd3}.pro-detail .meta-line span{color:#a6b4bf}.budget-line{margin-top:15px;background:#102435;border:1px solid #173044;padding:12px;border-radius:11px;display:flex;justify-content:space-between}.budget-line small{color:#9faeba}.quote-form,.pro-form{background:#0d2031;border:1px solid #193346;padding:14px;border-radius:14px;display:flex;flex-direction:column;gap:11px}.quote-form input,.quote-form textarea,.pro-form input,.pro-form textarea{background:#10283a;border-color:#244258;color:white}.pro-chat{background:#0d2031;border-color:#1e3749}.pro-chat .msg{background:#173044;color:white}.pro-chat .msg.mine{background:#0d4448}.pro-chat .chat-form input{background:#10283a;border-color:#244258;color:white}.pro-appointment,.pro-conversation{background:#0d2031;border-color:#1d384b;color:white}.pro-appointment>svg,.pro-conversation>svg{color:#77a8ff}.pro-conversation small,.pro-conversation p,.pro-appointment p,.pro-appointment small{color:#9db0bd}.pro-request.simple{padding:14px}.pro-request.simple>svg{color:#20364a}.action-row{display:flex;gap:10px;margin-top:12px}.pro-ghost{color:#d4dde4;border-color:#294052}.muted{color:#7d8981;font-size:11px}@media(max-width:720px){.landing{grid-template-columns:1fr;padding:38px 22px;gap:35px}.feature-grid{grid-template-columns:1fr}.landing h1{font-size:45px}.app-page{padding:0}.phone-shell{border-radius:0;min-height:100vh;border:0;box-shadow:none}.bottom-nav{bottom:0;width:100%;border-radius:0}.topbar{padding-top:max(18px,env(safe-area-inset-top))}.screen{padding-bottom:95px}.two,.request-grid{grid-template-columns:1fr 1fr}.hero-photo{height:180px}}@media(max-width:390px){.two{grid-template-columns:1fr}.request-grid{grid-template-columns:1fr 1fr}.metrics div{padding:9px}.metrics small{font-size:8px}}

.page-subtitle{margin:4px 0 18px;color:var(--muted);font-size:12px}.home-hero{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#eef9e8,#f8fcf5);border:1px solid #dcebd7;border-radius:16px;padding:16px}.home-hero>svg{color:var(--green);width:31px;height:31px}.home-hero h1{font-size:22px;margin:0}.home-hero p{font-size:11px;margin:4px 0 0;color:#66716a}.home-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.home-stats a{border:1px solid var(--line);border-radius:12px;padding:11px;display:flex;flex-direction:column;gap:5px}.home-stats svg{width:17px;color:var(--green)}.home-stats b{font-size:18px}.home-stats span{font-size:9px;color:#6f7972}.house-job{border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;gap:10px;align-items:center}.house-job>svg{color:var(--green)}.house-job strong{display:block;font-size:12px}.house-job small{font-size:10px;color:#68736c}.document-row{border:1px solid var(--line);border-radius:13px;padding:13px;display:flex;gap:11px;align-items:center}.document-row>svg:first-child{color:var(--green)}.document-row>div{flex:1;min-width:0}.document-row strong{font-size:12px;display:block}.document-row small{font-size:9px;color:#6c776f}.document-row>span{font-size:8px;text-transform:uppercase;font-weight:800;color:#65706a;background:#f1f3f1;padding:4px 6px;border-radius:5px}.document-form{background:#0d2031;border:1px solid #193346;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px}.document-form input,.document-form select{background:#10283a;border-color:#244258;color:white}.pro-doc-list a{background:#0d2031;border:1px solid #1d384b;border-radius:10px;padding:10px}.pro-doc-list strong,.pro-doc-list small{display:block}.pro-doc-list small{color:#9badb9;font-size:9px;margin-top:3px}.receipt-page{min-height:100vh;background:#eef3ef;padding:40px 20px}.receipt{max-width:760px;margin:auto;background:white;padding:42px;border-radius:20px;box-shadow:0 20px 60px rgba(20,44,28,.12)}.receipt-title{display:flex;justify-content:space-between;align-items:flex-start;margin:48px 0 28px}.receipt-title h1{font-size:34px;margin:0}.receipt-title p{color:#6c776f}.receipt-title>b{background:#eef7ea;color:#0d4448;padding:8px 10px;border-radius:8px}.receipt-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.receipt-grid small,.receipt-grid strong{display:block}.receipt-grid small{font-size:10px;color:#7b847f;text-transform:uppercase;letter-spacing:.06em}.receipt-grid strong{margin-top:5px}.receipt-line,.receipt-total{display:flex;justify-content:space-between;padding:18px 0}.receipt-total{font-size:22px;border-top:2px solid var(--ink)}.receipt-note{font-size:11px;line-height:1.6;color:#737d76}.print-hint{margin-top:24px;background:#f6f8f6;border-radius:10px;padding:12px;font-size:11px;color:#68726c}@media print{.receipt-page{padding:0;background:white}.receipt{box-shadow:none;max-width:none;padding:20px}.print-hide{display:none}}

.verification-card,.claim-notice,.claim-form{border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:flex-start}.verification-card{background:#102435;border-color:#1d3a4e;color:white}.verification-card>svg{flex:0 0 auto;color:#f2b64d}.verification-card.verified>svg{color:#1b8569}.verification-card>div{flex:1}.verification-card strong,.claim-notice strong,.claim-form strong{display:block;font-size:13px}.verification-card p,.claim-notice p,.claim-form p{font-size:11px;line-height:1.5;margin:4px 0;color:#9fb0bc}.verification-card small{font-size:10px;color:#d7e0e6}.verification-card form{margin-top:10px}.verification-gate{border:1px solid #294356;background:#0d2031;border-radius:18px;padding:28px 22px;text-align:center}.verification-gate>svg{width:42px;height:42px;color:#f2b64d;margin:auto}.verification-gate h2{font-size:20px;margin:14px 0 6px}.verification-gate p{font-size:12px;line-height:1.6;color:#9fb0bc;margin:0 0 18px}.claim-notice{background:#fff8e9;border-color:#f0d99d}.claim-notice>svg{color:#b7791f;flex:0 0 auto}.claim-notice>div{flex:1}.claim-notice p{color:#665a43}.claim-notice small{font-size:10px;color:#6c604a}.claim-form{flex-direction:column;background:#fafbfa}.claim-form>div p{color:#68736c}.claim-form textarea{width:100%}.pro-claim{background:#12283a;border-color:#365064;color:white;margin-top:16px}.pro-claim p,.pro-claim small{color:#b7c5cf}.admin-page{min-height:100vh;background:#f3f6f4;padding:34px}.admin-header{max-width:1200px;margin:0 auto 24px;display:flex;justify-content:space-between;align-items:center;gap:20px}.admin-header h1{margin:0;font-size:28px}.admin-header p{margin:5px 0 0;color:#69756d}.admin-grid{max-width:1200px;margin:auto;display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}.admin-panel{background:white;border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:0 14px 44px rgba(20,45,30,.06)}.admin-panel h2{margin:0 0 15px;display:flex;align-items:center;gap:9px;font-size:18px}.admin-panel h2 svg{color:var(--green)}.admin-card{border:1px solid var(--line);border-radius:14px;padding:14px}.admin-card-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.admin-card-head strong{display:block}.admin-card-head small{display:block;margin-top:5px;color:#69756d;line-height:1.5}.admin-card>p{font-size:12px;line-height:1.55;color:#4f5b53}.admin-file{display:inline-flex;margin-top:12px;color:var(--green-dark);font-size:12px;font-weight:800}.admin-form{display:flex;flex-direction:column;gap:9px;margin-top:12px}.admin-form textarea,.admin-form select{width:100%}.status.approved,.status.resolved{background:#dcebec;color:#0d4448}.status.reviewing{background:#fff2cf;color:#876000}.status.rejected{background:#ffebea;color:#9d2922}@media(max-width:850px){.admin-page{padding:18px}.admin-grid{grid-template-columns:1fr}.admin-header{align-items:flex-start;flex-direction:column}}

.notification-link{position:relative;display:inline-flex}.notification-link>span{position:absolute;right:-8px;top:-8px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#e53e3e;color:white;font-size:9px;font-weight:800;display:grid;place-items:center}.notifications-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}.notifications-head .btn{font-size:10px;padding:8px 10px}.notification-row{display:flex;gap:11px;border:1px solid var(--line);border-radius:13px;padding:13px;background:white}.notification-row.unread{border-color:#7fa8a2;background:#f5fbf3}.notification-row>svg{width:18px;flex:0 0 auto;color:var(--green)}.notification-row>div{min-width:0}.notification-row strong{display:block;font-size:12px}.notification-row p{font-size:10px;line-height:1.45;color:#5f6b63;margin:4px 0}.notification-row small{font-size:9px;color:#5f6b63}.pro-theme .notification-row{background:#0d2031;border-color:#1d384b;color:white}.pro-theme .notification-row.unread{background:#0e3d33;border-color:#174b50}.pro-theme .notification-row p,.pro-theme .notification-row small{color:#9fb0bc}

/* Einfach Hausen · AI-first product layer */
.agent-hero{display:flex;gap:13px;align-items:flex-start;padding:8px 0 16px}.agent-avatar{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(145deg,#dcebec,#f5fbf2);border:1px solid #dcebec;color:var(--green-dark);flex:0 0 auto}.agent-avatar svg{width:23px}.agent-hero h1{font-size:23px;line-height:1.15;letter-spacing:-.025em;margin:4px 0 7px}.agent-hero p{font-size:11px;line-height:1.55;color:#657068;margin:0}.agent-online{font-size:9px;font-weight:850;color:var(--green-dark);letter-spacing:.035em;text-transform:uppercase}.agent-chat{background:#f7f9f7;border:1px solid #e5ebe6;border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:9px;box-shadow:0 10px 34px rgba(21,45,31,.045)}.agent-message{max-width:91%;border-radius:14px;padding:10px 12px;font-size:12px;line-height:1.5}.agent-message p{margin:3px 0 0;white-space:pre-wrap}.agent-message.assistant,.agent-message.event{align-self:flex-start;background:white;border:1px solid #e3e9e4;color:#25322a}.agent-message.user{align-self:flex-end;background:#dcebec;color:#17301b}.agent-message.event{background:#eef7eb;border-color:#d9ead5}.message-head{display:flex;align-items:center;gap:5px;font-size:9px;font-weight:850;color:var(--green-dark);text-transform:uppercase;letter-spacing:.04em}.agent-message.user .message-head{color:#0d4448}.agent-composer{margin-top:2px;background:white;border:1px solid #dce4dd;border-radius:15px;padding:9px}.agent-composer textarea{width:100%;resize:none;border:0;padding:7px 8px 10px;box-shadow:none;background:white;line-height:1.5}.agent-composer textarea:focus{box-shadow:none}.agent-actions{display:flex;gap:7px;align-items:center;border-top:1px solid #eef1ee;padding-top:8px}.icon-action{position:relative;border:1px solid var(--line);background:#f7f9f7;border-radius:9px;padding:8px 9px;display:flex;flex-direction:row;align-items:center;gap:5px;font-weight:700;font-size:10px;color:#526058;cursor:pointer}.icon-action input{position:absolute;width:1px;height:1px;opacity:0}.icon-action.recording{background:#fff0ef;border-color:#f2c3c0;color:#9d2922}.send-action{margin-left:auto;border:0;background:var(--green);color:white;border-radius:9px;padding:9px 11px;font-size:10px;font-weight:850;display:flex;align-items:center;gap:6px}.send-action:disabled{opacity:.45;cursor:not-allowed}.trust-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:12px}.trust-strip span{border:1px solid #e2e8e3;background:white;border-radius:10px;padding:8px 6px;font-size:8px;font-weight:750;color:#5f6b63;display:flex;align-items:center;justify-content:center;gap:4px;text-align:center}.trust-strip svg{width:14px;color:var(--green)}.home-insights{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.home-insights a{border-radius:13px;border:1px solid var(--line);padding:12px;background:white}.home-insights small,.home-insights strong,.home-insights span{display:block}.home-insights small{font-size:8px;text-transform:uppercase;letter-spacing:.05em;color:#829087;font-weight:850}.home-insights strong{font-size:14px;margin:5px 0}.home-insights span{font-size:9px;color:#617068}.home-insights span svg{display:inline;vertical-align:middle}.agent-job .thumb-placeholder{border-radius:12px}.ai-summary{margin-top:14px;border:1px solid #d8ead3;background:linear-gradient(145deg,#f1faed,#fbfdf9);border-radius:15px;padding:13px;display:flex;gap:10px;align-items:flex-start}.ai-summary>svg{color:var(--green);flex:0 0 auto}.ai-summary strong{font-size:12px}.ai-summary p{font-size:10px;line-height:1.55;color:#657068;margin:3px 0 0}.quote-badges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:7px}.compare-badge{display:inline-block;background:#edf1ff;color:#3550a3;font-size:7px;padding:3px 6px;border-radius:4px;font-weight:900;letter-spacing:.03em}.compare-badge.fast{background:#fff1d8;color:#8b5d00}.partner-standards{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0}.partner-standards span{font-size:8px;padding:4px 6px;border-radius:5px;background:#f1f5f1;color:#56635a}.recommendation-reason{display:flex;gap:6px;align-items:flex-start;background:#edf8e9;border-radius:9px;padding:8px;margin-top:9px;color:#0d4448;font-size:9px;line-height:1.4}.partner-standard-banner{display:flex;align-items:center;gap:10px;border:1px solid #25485e;background:#0d2333;border-radius:12px;padding:12px;margin-bottom:12px}.partner-standard-banner>svg{color:#1b8569}.partner-standard-banner strong,.partner-standard-banner small{display:block}.partner-standard-banner strong{font-size:12px}.partner-standard-banner small{font-size:9px;color:#9fb2bf;margin-top:3px}.partner-job-note{background:#0d2031;border:1px solid #1d384b;padding:12px;border-radius:12px;margin-top:12px}.partner-job-note strong{font-size:12px}.partner-job-note p{font-size:10px;line-height:1.5;color:#9fb0bc;margin:4px 0}.decline-form{margin-top:9px}.contract-checks{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}.contract-checks span{font-size:8px;border:1px solid #304b5c;border-radius:5px;padding:4px 6px;color:#9fb0bc}.contract-checks span.ok{background:#0e3d33;border-color:#174b50;color:#9fcfd2}.plans-hero{display:flex;gap:12px;align-items:flex-start;background:linear-gradient(145deg,#0f2231,#0a1722);color:white;border-radius:18px;padding:17px;margin-bottom:14px}.plans-hero>svg{color:#8fd0c9}.plans-hero h1{font-size:20px;line-height:1.15;margin:0 0 5px}.plans-hero p{font-size:10px;color:#b7c3cb;line-height:1.5;margin:0}.current-plan{display:flex;gap:9px;align-items:flex-start;background:#edf8e9;border:1px solid #dcebec;border-radius:12px;padding:12px}.current-plan>svg{color:var(--green)}.current-plan strong{font-size:12px}.current-plan p{font-size:9px;color:#61705f;margin:3px 0}.plan-grid{display:grid;grid-template-columns:1fr;gap:10px}.plan-card{position:relative;border:1px solid var(--line);border-radius:16px;padding:15px;background:white}.plan-card.featured{border-color:#1b8569;box-shadow:0 0 0 2px #e4f5df inset}.plan-popular{position:absolute;right:11px;top:11px;background:#105258;color:white;border-radius:5px;padding:4px 6px;font-size:7px;font-weight:900}.plan-icon{width:34px;height:34px;display:grid;place-items:center;background:#eef7ea;color:var(--green-dark);border-radius:10px}.plan-card h2{font-size:16px;margin:9px 0 3px}.plan-price{font-size:23px;font-weight:900;color:var(--green-dark)}.plan-price small{font-size:9px;font-weight:600;color:#738078;margin-left:3px}.plan-card>p{font-size:10px;line-height:1.5;color:#647067}.plan-card ul{padding:0;margin:10px 0 13px;list-style:none;display:flex;flex-direction:column;gap:5px}.plan-card li{font-size:9px;color:#526058}.plan-card li:before{content:'✓';color:var(--green);font-weight:900;margin-right:6px}.package-grid{display:flex;flex-direction:column;gap:9px}.package-card{border:1px solid var(--line);border-radius:15px;padding:13px;display:flex;gap:10px;align-items:flex-start;background:white}.package-icon{width:35px;height:35px;background:#eef7ea;color:var(--green);border-radius:10px;display:grid;place-items:center;flex:0 0 auto}.package-card h3{font-size:13px;margin:0 0 4px}.package-card p{font-size:9px;line-height:1.5;color:#68746c;margin:0}.package-services{display:flex;gap:4px;flex-wrap:wrap;margin-top:7px}.package-services span{font-size:7px;padding:3px 5px;background:#f2f5f2;border-radius:4px;color:#5d695f}.package-buy{display:flex;flex-direction:column;gap:8px;align-items:flex-end;flex:0 0 auto}.package-buy b{font-size:14px;color:var(--green-dark)}.package-buy .btn{font-size:9px;padding:8px 9px}.package-order{border:1px solid var(--line);border-radius:11px;padding:10px;display:flex;justify-content:space-between;align-items:center}.house-profile-form{display:flex;flex-direction:column;gap:10px;border:1px solid var(--line);border-radius:14px;padding:13px}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.asset-grid{display:flex;flex-direction:column;gap:8px}.asset-grid article{display:flex;gap:9px;align-items:flex-start;border:1px solid var(--line);border-radius:12px;padding:11px}.asset-grid article>svg{color:var(--green)}.asset-grid strong,.asset-grid small{display:block}.asset-grid strong{font-size:11px}.asset-grid small{font-size:8px;color:#5f6b63}.asset-grid p{font-size:9px;color:#657168;margin:3px 0 0}.asset-form{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px;border:1px dashed #d5ddd6;border-radius:12px;padding:10px}.asset-form .btn{grid-column:1/-1}.maintenance-row{display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:12px;padding:10px}.maintenance-date{min-width:67px}.maintenance-date small,.maintenance-date b{display:block}.maintenance-date small{font-size:7px;color:#5f6b63;text-transform:uppercase}.maintenance-date b{font-size:9px;margin-top:3px}.maintenance-row strong{font-size:11px}.maintenance-row .grow small{display:block;font-size:8px;color:#5f6b63;margin-top:3px}.icon-check{border:0;background:transparent;color:var(--green);padding:4px}.documents-cta{border:1px solid var(--line);border-radius:13px;padding:12px;display:flex;gap:10px;align-items:flex-start}.documents-cta>svg{color:var(--green)}.documents-cta strong{font-size:11px}.documents-cta p{font-size:9px;line-height:1.45;color:#667269;margin:3px 0}.whatsapp-card{display:flex;gap:10px;border:1px solid #dcebec;background:#f2faef;border-radius:13px;padding:12px;margin-bottom:16px}.whatsapp-card>svg{color:#105258}.whatsapp-card strong{font-size:11px}.whatsapp-card p{font-size:9px;line-height:1.5;color:#657168;margin:3px 0}.profile-links{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:12px;margin-bottom:14px}.profile-links a{padding:11px 12px;font-size:11px;font-weight:700}.profile-links a+a{border-top:1px solid var(--line)}.admin-status-stack{display:flex;flex-direction:column;align-items:flex-end;gap:4px}.admin-contract{border-top:1px solid var(--line);margin-top:14px;padding-top:13px}.admin-contract h3{display:flex;gap:7px;align-items:center;font-size:13px;margin:0}.contract-checkboxes{display:grid;grid-template-columns:1fr 1fr;gap:7px}.contract-checkboxes label{display:flex;flex-direction:row;align-items:center;gap:7px;border:1px solid var(--line);border-radius:8px;padding:8px;font-size:10px}.contract-checkboxes input{width:auto;margin:0}.status.active{background:#dcebec;color:#0d4448}.status.suspended,.status.past_due{background:#fff2cf;color:#876000}.status.ended,.status.declined,.status.expired{background:#ffebea;color:#9d2922}
@media(min-width:721px){.plan-grid{grid-template-columns:repeat(3,1fr)}.phone-shell:has(.plan-grid){width:min(980px,100%)}.phone-shell:has(.plan-grid) .bottom-nav{width:min(978px,calc(100% - 46px))}}
@media(max-width:390px){.agent-actions{flex-wrap:wrap}.send-action{width:100%;margin-left:0;justify-content:center}.three{grid-template-columns:1fr}.asset-form{grid-template-columns:1fr}.contract-checkboxes{grid-template-columns:1fr}.package-card{flex-wrap:wrap}.package-buy{width:100%;flex-direction:row;justify-content:space-between;align-items:center}}

/* Einfach Hausen · personal-contact + simple partner operations */
.personal-contact-card,.contact-card,.relationship-note,.simple-role-principle,.partner-plan-hero,.admin-zero-commission{border:1px solid var(--line);border-radius:14px;padding:13px;background:white}.personal-contact-card{display:flex;gap:11px;align-items:flex-start;background:linear-gradient(145deg,#eef9ea,#fff)}.personal-contact-card>svg,.contact-card>svg,.simple-role-principle>svg{color:var(--green);flex:0 0 auto}.personal-contact-card strong,.contact-card strong{display:block;font-size:13px}.personal-contact-card p,.contact-card p,.relationship-note p{font-size:10px;line-height:1.5;color:#647067;margin:3px 0}.personal-contact-card small,.contact-card small{font-size:9px;color:#78837c}.direct-contact-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.direct-contact-actions .btn{font-size:10px;padding:9px 10px}.contact-list{display:flex;flex-direction:column;gap:7px}.contact-row{display:flex;gap:10px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:10px;background:white}.contact-row.selected{border-color:#7fa8a2;box-shadow:0 0 0 2px #edf8e9 inset}.contact-avatar{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#eaf6e6;color:#105258;font-weight:900;font-size:11px;flex:0 0 auto}.contact-row strong{font-size:11px;display:block}.contact-row small{font-size:8px;color:#768179;display:block;margin-top:2px}.contact-row p{font-size:9px;color:#5f6a62;margin:3px 0 0}.contact-card{display:flex;gap:10px;align-items:center}.icon-contact{width:38px;height:38px;border:1px solid var(--line);border-radius:10px;display:grid;place-items:center;color:var(--green-dark)}.icon-contact svg{width:17px}.contact-chat{margin-top:9px}.contact-chat-intro{display:flex;gap:8px;align-items:flex-start;padding:8px;color:#67736a;font-size:10px}.contact-chat-intro svg{width:16px;flex:0 0 auto}.contact-chat-intro p{margin:0}.relationship-note{margin-top:9px;background:#f7faf6}.relationship-note strong{font-size:10px}.pro-theme .pro-contact-list .contact-row,.pro-theme .pro-contact-card{background:#0d2031;border-color:#1d384b;color:white}.pro-theme .pro-contact-list .contact-row.selected{background:#0e3d33;border-color:#105258;box-shadow:none}.pro-theme .pro-contact-list .contact-row small,.pro-theme .pro-contact-list .contact-row p,.pro-theme .pro-contact-card p,.pro-theme .pro-contact-card small{color:#9fb0bc}.pro-theme .contact-avatar{background:#183248;color:#cde0ee}.simple-role-principle{display:flex;gap:11px;background:#0d2031;border-color:#1d384b;color:white}.simple-role-principle strong{font-size:12px}.simple-role-principle p{font-size:10px;line-height:1.55;color:#9fb0bc;margin:4px 0}.member-card{border:1px solid #1d384b;border-radius:14px;padding:12px;background:#0d2031;display:flex;flex-direction:column;gap:9px}.member-head{display:flex;align-items:center;gap:9px}.member-head strong{font-size:11px}.member-head small{font-size:8px;color:#9fb0bc}.member-card input,.team-add-form input{background:#10283a;border-color:#244258;color:white}.member-switches{display:grid;grid-template-columns:1fr 1fr;gap:7px}.member-switches label,.team-manage-toggle{display:flex;flex-direction:row;gap:7px;align-items:center;border:1px solid #244258;border-radius:9px;padding:9px;font-size:9px}.member-switches input,.team-manage-toggle input{width:auto}.member-explain{font-size:8px;color:#91a5b3;line-height:1.5}.team-add-form{background:#0d2031;border:1px solid #1d384b;border-radius:14px;padding:13px;display:flex;flex-direction:column;gap:9px}.partner-plan-hero{display:flex;gap:10px;background:#0d2031;border-color:#1d384b;color:white}.partner-plan-hero>svg{color:#8fd0c9}.partner-plan-hero strong{font-size:12px}.partner-plan-hero p{font-size:9px;line-height:1.5;color:#9fb0bc;margin:4px 0}.partner-plan-grid{display:grid;grid-template-columns:1fr;gap:9px}.partner-plan-card{position:relative;background:#0d2031;border:1px solid #1d384b;border-radius:15px;padding:14px;color:white}.partner-plan-card.featured{border-color:#1b8569}.partner-plan-card h2{font-size:15px;margin:9px 0 3px}.partner-plan-card .plan-price{color:#9fcfd2}.partner-plan-card .plan-price small{color:#8fa2af}.partner-plan-card>p{font-size:9px;line-height:1.5;color:#9fb0bc}.partner-plan-card ul{list-style:none;padding:0;margin:10px 0;display:flex;flex-direction:column;gap:5px}.partner-plan-card li{font-size:8px;color:#c4d0d8}.partner-plan-card li:before{content:'✓';color:#8fd0c9;margin-right:5px;font-weight:900}.pro-current-plan{margin-top:9px;background:#0e3d33;border-color:#105258;color:white}.pro-current-plan p{color:#8fd0c9}.admin-zero-commission{background:#eff8ec;border-color:#dcebec;display:flex;flex-direction:column;gap:3px}.admin-zero-commission strong{font-size:11px;color:#105258}.admin-zero-commission span{font-size:9px;color:#1b8569}.status.trialing{background:#e8f1ff;color:#315f9e}.status.pending{background:#f1f3f1;color:#626d65}
@media(min-width:760px){.partner-plan-grid{grid-template-columns:repeat(4,1fr)}.phone-shell:has(.partner-plan-grid){width:min(1050px,100%)}.phone-shell:has(.partner-plan-grid) .bottom-nav{width:min(1048px,calc(100% - 46px))}}
@media(max-width:390px){.member-switches{grid-template-columns:1fr}.direct-contact-actions .btn{flex:1}}

/* ---------- Einfach Hausen — Welcome + Rolle pixelgenau v2 ---------- */
:root {
  --green: #105258;
  --green-dark: #0d4448;
  --ink: #1c2129;
  --muted: #6b7d82;
  --card: #ffffff;
  --mint: #e7f1ec;
  --bg: #f5f8f7;
}
html, body {
  background: linear-gradient(180deg, #fbfdfc 0%, #eef4f1 100%);
}
.page {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.safe-top { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.logo-wrap { display: flex; align-items: center; justify-content: center; margin-top: 22px; }
.logo-word { font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 1.05; }
.green-word { color: var(--green); }
.ink-word { color: var(--ink); }
.tagline { text-align: center; margin-top: 6px; font-size: 16px; color: var(--ink); }
.green { color: var(--green); font-weight: 600; }
.header { text-align: center; padding: 18px 0 0; }
.hero-text { text-align: center; padding: 30px 24px 0; }
.hero-text h1 { font-size: 27px; font-weight: 800; color: var(--ink); line-height: 1.2; }
.hero-text p { margin-top: 12px; font-size: 15px; line-height: 1.55; color: var(--ink); }
.hero-image {
  margin-top: 4px;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 84%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 84%, transparent 100%);
}
.hero-image img { display: block; width: 100%; height: auto; mix-blend-mode: multiply; }
.cards { display: flex; flex-direction: column; gap: 18px; padding: 10px 20px 0; margin-top: -14px; position: relative; }
.action-card {
  display: flex; align-items: center; gap: 20px;
  border-radius: 26px;
  padding: 28px 22px;
  text-decoration: none;
  transition: transform .12s;
}
.action-card:active { transform: scale(.98); }
.action-card.tint { background: linear-gradient(160deg, #eaf3ee 0%, #f4f9f6 100%); box-shadow: 0 10px 30px rgba(16,82,88,.08); }
.action-card.bordered { background: var(--card); border: 1px solid #e6eeeb; box-shadow: 0 6px 20px rgba(18,51,59,.05); }
.action-icon { width: 76px; height: 76px; flex-shrink: 0; border-radius: 50%; background: #edf4f0; display: grid; place-items: center; }
.action-text { flex: 1; display: flex; flex-direction: column; gap: 5px; white-space: pre-line; }
.action-title { font-size: 22px; font-weight: 800; color: var(--ink); }
.action-sub { font-size: 14px; color: var(--muted); line-height: 1.45; }
.features { display: flex; padding: 26px 12px 4px; text-align: center; }
.feature { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 0 8px; }
.feature + .feature { border-left: 1px solid #e3ecea; }
.feature strong { font-size: 12.5px; color: var(--ink); }
.feature span { font-size: 11.5px; color: var(--muted); line-height: 1.4; }
.support-card {
  margin: 24px 20px 8px;
  background: #eef4f1;
  border-radius: 20px;
  padding: 18px 22px;
  display: flex; align-items: center; justify-content: space-between;
  text-decoration: none;
}
.support-card strong { display: block; font-size: 15px; color: var(--ink); }
.support-card span { font-size: 13px; color: var(--muted); }
.home-indicator { margin: 16px auto 8px; width: 134px; height: 5px; border-radius: 3px; background: var(--ink); }

/* Rolle */
.role-page { background: var(--bg); }
.role-headline { text-align: center; padding: 34px 24px 22px; }
.role-headline h1 { font-size: 34px; font-weight: 800; color: var(--ink); line-height: 1.15; letter-spacing: -0.5px; }
.role-headline p { margin-top: 14px; font-size: 16px; line-height: 1.5; color: var(--muted); }
.owner-card {
  margin: 0 18px;
  background: var(--card);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(18,51,59,.08);
}
.owner-image { position: relative; height: 380px; }
.owner-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.owner-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(100deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.85) 38%, rgba(255,255,255,0) 68%);
}
.owner-content { position: absolute; top: 0; left: 0; padding: 30px 26px; width: 62%; }
.owner-content h2 { font-size: 32px; font-weight: 800; color: var(--green); line-height: 1.12; letter-spacing: -0.5px; }
.owner-line { width: 34px; height: 2.5px; background: var(--green); margin: 14px 0 16px; border-radius: 2px; }
.owner-content p { font-size: 13.5px; line-height: 1.55; color: var(--ink); }
.owner-cta {
  margin-top: 20px;
  display: flex; align-items: center; gap: 12px;
  background: var(--green);
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 13px 22px 13px 14px;
  font-size: 14.5px; font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 6px 16px rgba(16,82,88,.35);
  transition: transform .12s;
}
.owner-cta:active { transform: scale(.97); }
.owner-cta-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,.16);
  display: grid; place-items: center;
}
.owner-features { display: flex; padding: 20px 14px 22px; }
.ofeat {
  flex: 1;
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; text-align: center; padding: 0 5px;
}
.ofeat-icon {
  width: 52px; height: 52px; border-radius: 50%;
  background: #edf4f0;
  display: grid; place-items: center;
  margin-bottom: 2px;
}
.ofeat strong { font-size: 11.5px; color: var(--ink); line-height: 1.25; }
.ofeat span { font-size: 10.5px; color: var(--muted); line-height: 1.35; }
.pro-card {
  margin: 20px 18px 0;
  background: #f2f6f4;
  border: 1px solid #e6eeeb;
  border-radius: 24px;
  padding: 22px 22px;
  display: flex; align-items: center; gap: 18px;
  cursor: pointer; text-align: left; font-family: inherit;
  transition: transform .12s;
  width: calc(100% - 36px);
}
.pro-card:active { transform: scale(.98); }
.pro-icon {
  width: 74px; height: 74px; flex-shrink: 0;
  border-radius: 50%;
  background: #dcebec;
  display: grid; place-items: center;
}
.pro-text { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.pro-text strong { font-size: 17px; font-weight: 800; color: var(--ink); }
.pro-text span { font-size: 13.5px; color: var(--muted); line-height: 1.45; }
.trust-row {
  margin: 26px auto 0;
  display: flex; align-items: center; gap: 14px;
  padding: 0 28px;
  max-width: 340px;
}
.trust-icon {
  width: 52px; height: 52px; flex-shrink: 0;
  border-radius: 50%;
  background: #dcebec;
  display: grid; place-items: center;
}
.trust-row strong { display: block; font-size: 14px; color: var(--ink); }
.trust-row span { font-size: 12.5px; color: var(--muted); }
.wave { margin-top: 26px; }

/* ---------- Register-Pro ---------- */
.pro-page { position: relative; }
.pro-hero { position: relative; }
.pro-hero-bg { position: absolute; top: 0; right: 0; width: 78%; height: 420px; }
.pro-hero-bg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pro-hero-fade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,.95) 0%, rgba(255,255,255,.4) 30%, rgba(255,255,255,.85) 78%, var(--bg) 100%), linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 45%); }
.back-btn-float { position: absolute; left: 16px; top: 20px; z-index: 5; background: none; border: none; padding: 6px; cursor:pointer; }
.pro-logo { position: relative; display: flex; align-items: center; justify-content: center; margin-top: 18px; }
.pro-tagline { text-align: center; font-size: 13px; color: var(--ink); margin-top: 2px; position: relative; }
.pro-headline { position: relative; padding: 40px 22px 0; }
.pro-headline h1 { font-size: 32px; font-weight: 800; color: var(--ink); line-height: 1.12; letter-spacing: -.5px; }
.pro-headline p { margin-top: 14px; font-size: 15px; color: var(--ink); line-height: 1.5; max-width: 250px; }
.benefit-card { position: relative; margin: 26px 18px 0; background: #fff; border-radius: 22px; display: flex; padding: 24px 10px; box-shadow: 0 8px 24px rgba(18,51,59,.07); }
.benefit { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; padding: 0 8px; position: relative; }
.benefit-divider { position: absolute; left: 0; top: 6px; bottom: 6px; width: 1px; background: #e6eeeb; }
.benefit strong { font-size: 12.5px; color: var(--ink); }
.benefit span { font-size: 11px; color: var(--muted); line-height: 1.4; }
.pro-form-section { padding: 34px 20px 0; }
.pro-form-section h2 { text-align: center; font-size: 22px; font-weight: 800; color: var(--ink); }
.pro-form-sub { text-align: center; font-size: 14px; color: var(--ink); margin-top: 8px; }
.pro-form { display: flex; flex-direction: column; gap: 14px; margin-top: 22px; }
.pill-field { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #e3ece8; border-radius: 14px; padding: 16px 16px; }
.pill-field input { border: none; outline: none; flex: 1; font-size: 15px; background: transparent; color: var(--ink); font-family: inherit; }
.eye-btn { background: none; border: none; cursor: pointer; display: grid; place-items: center; }
.divider-or { position: relative; text-align: center; margin: 8px 0; }
.divider-or::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: #e3ece8; }
.divider-or span { position: relative; background: var(--bg); padding: 0 12px; color: var(--muted); font-size: 13.5px; }
.btn-social { display: flex; align-items: center; justify-content: center; gap: 10px; background: #fff; border: 1px solid #e3ece8; border-radius: 14px; padding: 15px; font-size: 15px; font-weight: 700; color: var(--ink); cursor: pointer; font-family: inherit; }
.btn-full { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-primary { background: var(--green); color: #fff; border: none; border-radius: 14px; padding: 15px 18px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-primary:disabled { opacity: .6; }
.trust-grid { display: flex; padding: 28px 20px 10px; gap: 8px; }
.trust-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
.trust-item strong { font-size: 12px; color: var(--ink); }
.trust-item span { font-size: 11px; color: var(--muted); line-height: 1.35; }
/* Onboarding */
.ob-page { background: var(--bg); }
.ob-header { display: flex; align-items: center; padding: 14px 16px 0; }
.ob-logo { flex: 1; display: flex; align-items: center; justify-content: center; gap: 2px; }
.stepper { display: flex; padding: 26px 30px 0; }
.step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.step-line { position: absolute; top: 16px; right: 50%; width: 100%; height: 2px; background: #dde8e2; }
.step-line.filled { background: var(--green); }
.step-circle { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-size: 13.5px; font-weight: 700; background: #fff; border: 1.5px solid #dde8e2; color: var(--muted); position: relative; z-index: 1; }
.step-circle.active { background: var(--green); border-color: var(--green); color: #fff; }
.step-circle.done { background: var(--green); border-color: var(--green); color: #fff; }
.step-label { margin-top: 8px; font-size: 11.5px; color: var(--muted); }
.step-label.active { color: var(--green); font-weight: 700; }
.step-label.done { color: var(--green); font-weight: 600; }
.ob-head { padding: 30px 22px 0; }
.ob-head h1 { font-size: 26px; font-weight: 800; color: var(--ink); }
.ob-head p { margin-top: 6px; font-size: 14.5px; color: var(--muted); }
.ob-form { display: flex; flex-direction: column; gap: 16px; padding: 22px 20px 0; }
.icon-field { display: flex; gap: 14px; align-items: flex-start; position: relative; }
.icon-field.half { flex: 1; }
.icon-field.no-icon .if-wrap { border: 1px solid #e3ece8; border-radius: 12px; padding: 10px 14px 8px; background: #fff; }
.icon-bubble { width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%; background: #fff; border: 1px solid #e6eeeb; display: grid; place-items: center; }
.if-wrap { flex: 1; position: relative; }
.if-wrap > input, .if-select { width: 100%; border: 1px solid #e3ece8; border-radius: 12px; background: #fff; padding: 10px 14px; font-size: 15px; color: var(--ink); outline: none; font-family: inherit; }
.if-label { position: absolute; top: -8px; left: 12px; z-index: 2; background: #fff; padding: 0 6px; font-size: 11.5px; color: var(--muted); }
.icon-field.half:first-child .if-label { background: var(--bg); }
.icon-field.no-icon .if-label { background: var(--bg); }
.icon-row { display: flex; gap: 14px; }
.if-select { display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-family: inherit; }
.select-pop { position: absolute; top: 100%; left: 0; right: 0; z-index: 10; background: #fff; border: 1px solid #e3ece8; border-radius: 12px; margin-top: 4px; overflow: hidden; box-shadow: 0 8px 20px rgba(18,51,59,.1); }
.select-pop > div { padding: 12px 16px; font-size: 15px; color: var(--ink); cursor: pointer; }
.select-pop > div:hover { background: var(--mint); }
.textarea-wrap { position: relative; margin-top: 16px; }
.textarea-wrap textarea { width: 100%; border: 1px solid #e3ece8; border-radius: 14px; background: #fff; padding: 18px 14px 26px; font-size: 15px; color: var(--ink); outline: none; resize: none; font-family: inherit; }
.textarea-wrap .if-label { top: 10px; left: 14px; }
.char-count { position: absolute; right: 12px; bottom: 8px; font-size: 11.5px; color: var(--muted); }
.toggle-card { margin-top: 18px; background: #fff; border: 1px solid #e6eeeb; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 14px; }
.toggle-icon { width: 46px; height: 46px; border-radius: 50%; background: var(--mint); display: grid; place-items: center; flex-shrink: 0; }
.toggle-text { flex: 1; }
.toggle-text strong { display: block; font-size: 15px; color: var(--ink); }
.toggle-text span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.switch { width: 50px; height: 30px; border-radius: 15px; background: #d3e0da; border: none; position: relative; cursor: pointer; transition: background .2s; flex-shrink: 0; }
.switch .knob { position: absolute; left: 3px; top: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
.switch.on { background: var(--green); }
.switch.on .knob { transform: translateX(20px); }
.ob-about { padding: 10px 20px 0; }
.ob-about h3 { font-size: 17px; font-weight: 800; color: var(--ink); }
.ob-actions { padding: 26px 20px 8px; display: flex; flex-direction: column; gap: 14px; }
.save-later { background: none; border: none; font-size: 14px; font-weight: 600; color: var(--muted); cursor: pointer; font-family: inherit; }
.cat-panel { margin: 20px 18px 0; background: #fff; border: 1px solid #e6eeeb; border-radius: 20px; padding: 20px 16px; }
.cat-panel h3 { font-size: 16px; font-weight: 800; color: var(--ink); }
.cat-sub { font-size: 12.5px; color: var(--muted); margin: 4px 0 14px; }
.cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cat-tile { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e3ece8; border-radius: 14px; padding: 12px 12px; background: #fff; cursor: pointer; font-family: inherit; text-align: left; transition: border-color .15s, background .15s; }
.cat-tile.sel { border-color: var(--green); background: #f0f7f4; }
.cat-tile-left { display: flex; align-items: center; gap: 8px; }
.cat-tile-title { font-size: 12.5px; font-weight: 600; color: var(--ink); line-height: 1.2; }
.cat-check { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid #cfdcd7; flex-shrink: 0; display: grid; place-items: center; }
.cat-check.on { background: var(--green); border-color: var(--green); }
.subcat-section { padding: 10px 20px 0; }
.subcat-section h3 { font-size: 16px; font-weight: 800; color: var(--ink); }
.subcat-group { margin-top: 12px; }
.subcat-head { width: 100%; display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid #e3ece8; border-radius: 12px; padding: 13px 16px; cursor: pointer; font-family: inherit; font-size: 14.5px; font-weight: 700; color: var(--ink); }
.subcat-head-left { display: flex; align-items: center; gap: 8px; }
.subcat-list { display: flex; flex-direction: column; gap: 8px; padding: 10px 0 4px; }
.subcat-item { display: flex; align-items: flex-start; gap: 12px; background: #fff; border: 1px solid #e3ece8; border-radius: 12px; padding: 12px 14px; cursor: pointer; text-align: left; font-family: inherit; }
.subcat-item.sel { border-color: var(--green); background: #f0f7f4; }
.checkbox-square { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid #cfdcd7; flex-shrink: 0; margin-top: 2px; display: grid; place-items: center; }
.checkbox-square.on { background: var(--green); border-color: var(--green); }
.subcat-text { display: flex; flex-direction: column; gap: 2px; }
.subcat-text strong { font-size: 14px; color: var(--ink); }
.subcat-text span { font-size: 12px; color: var(--muted); }
.weitere { margin-top: 22px; }
.weitere > span { font-size: 14px; font-weight: 700; color: var(--ink); }
.weitere-row { display: flex; gap: 10px; margin-top: 10px; }
.weitere-row input { flex: 1; border: 1px solid #e3ece8; border-radius: 12px; padding: 12px 14px; font-size: 15px; outline: none; background: #fff; color: var(--ink); font-family: inherit; }
.plus-btn { width: 46px; border-radius: 12px; border: 1px solid #e3ece8; background: #fff; cursor: pointer; display: grid; place-items: center; font-size: 18px; color: var(--ink); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.chip { background: var(--mint); color: var(--green); border-radius: 20px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.mode-card { width: 100%; text-align: left; cursor: pointer; font-family: inherit; border: 1.5px solid #e3ece8; border-radius: 16px; padding: 16px 18px; background: #fff; display: flex; flex-direction: column; gap: 4px; }
.mode-card.sel { border-color: var(--green); background: #f0f7f4; }
.mode-title { font-size: 16px; font-weight: 800; color: var(--ink); }
.mode-sub { font-size: 13px; color: var(--muted); }
.radius-box { display: flex; flex-direction: column; gap: 18px; }
.slider { width: 100%; accent-color: var(--green); }
.back-btn { background: none; border: none; cursor: pointer; padding: 4px; }
.center-page { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; min-height: 100dvh; }
.mail-circle { width: 84px; height: 84px; border-radius: 50%; background: #f0f7f4; display: grid; place-items: center; }
.center-page h1 { font-size: 24px; font-weight: 800; color: var(--ink); }
/* Dashboard Handwerker */
.dash-page { background: #fff; }
.dash-top { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px 10px; }
.top-btn { background: none; border: none; cursor: pointer; position: relative; padding: 4px; }
.bell-dot { position: absolute; top: 4px; right: 4px; width: 9px; height: 9px; border-radius: 50%; background: #105258; }
.dash-logo { display: flex; align-items: center; gap: 4px; }
.top-line { height: 1px; background: #eef2f0; }
.greet { display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 20px 0; }
.greet h1 { font-size: 27px; font-weight: 800; color: var(--ink); letter-spacing: -.4px; }
.greet-name { margin-top: 6px; font-size: 15.5px; color: var(--ink); }
.greet-firma { font-size: 15.5px; color: var(--ink); }
.greet-gebiet { margin-top: 8px; font-size: 13.5px; color: var(--green); display: flex; align-items: center; gap: 5px; }
.avatar-wrap { position: relative; width: 88px; height: 88px; flex-shrink: 0; }
.avatar { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; }
.online-dot { position: absolute; right: 4px; bottom: 6px; width: 16px; height: 16px; border-radius: 50%; background: #105258; border: 2.5px solid #fff; }
.stat { flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 4px; text-align: center; }
.stat-divider { position: absolute; left: 0; top: 12px; bottom: 12px; width: 1px; background: #eef2f0; }
.stat-icon { width: 54px; height: 54px; border-radius: 50%; background: #f0f7f4; display: grid; place-items: center; margin-bottom: 4px; }
.stat strong { font-size: 26px; font-weight: 800; color: var(--ink); line-height: 1; }
.stat span { font-size: 12.5px; color: var(--muted); white-space: pre-line; line-height: 1.3; }
.dash-page .stat-card, .dash-page .req-card, .dash-page .term-card { margin: 18px 18px 0; background: #fff; border: 1px solid #eef2f0; border-radius: 18px; box-shadow: 0 4px 16px rgba(18,51,59,.05); }
.dash-page .stat-card { display: flex; padding: 20px 6px; }
.section-head { display: flex; justify-content: space-between; align-items: center; padding: 28px 20px 0; }
.section-head h2 { font-size: 18px; font-weight: 800; color: var(--ink); }
.see-all { background: none; border: none; font-size: 13.5px; color: var(--muted); cursor: pointer; font-family: inherit; }
.req-item { display: flex; align-items: flex-start; gap: 12px; padding: 18px 16px; position: relative; }
.req-divider { position: absolute; left: 16px; right: 16px; top: 0; height: 1px; background: #eef2f0; }
.req-icon { width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; background: #f0f7f4; display: grid; place-items: center; }
.req-body { flex: 1; }
.req-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.badge { border-radius: 6px; padding: 3px 8px; font-size: 11.5px; font-weight: 700; }
.badge-green { background: #eaf4ee; color: #105258; }
.badge-red { background: #fdeeed; color: #d0452e; }
.req-title { font-size: 15.5px; font-weight: 800; color: var(--ink); }
.req-text { margin-top: 4px; font-size: 13px; color: var(--ink); line-height: 1.4; white-space: pre-line; }
.req-plz { margin-top: 6px; font-size: 12.5px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
.req-plz svg { width: 13px; height: 13px; }
.req-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.req-time { font-size: 11.5px; color: var(--muted); }
.req-price { background: #f0f7f4; color: var(--green); font-size: 12.5px; font-weight: 700; border-radius: 8px; padding: 4px 8px; }
.req-item > svg { margin-top: 16px; flex-shrink: 0; }
.req-all { width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; background: none; border: none; border-top: 1px solid #eef2f0; padding: 16px; font-size: 13.5px; font-weight: 700; color: var(--green); cursor: pointer; font-family: inherit; border-radius: 0 0 18px 18px; }
.quote-card { margin: 18px 18px 0; background: #f0f7f4; border-radius: 18px; padding: 18px; display: flex; align-items: center; gap: 14px; }
.quote-icon { width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; background: #fff; display: grid; place-items: center; }
.quote-text { flex: 1; }
.quote-text strong { display: block; font-size: 15px; color: var(--ink); }
.quote-text span { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.quote-btn { background: var(--green); color: #fff; border: none; border-radius: 20px; padding: 10px 16px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; white-space: nowrap; }
.term-card { display: flex; align-items: center; gap: 14px; padding: 16px; }
.term-date { width: 56px; height: 60px; flex-shrink: 0; background: #f0f7f4; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.term-date strong { font-size: 22px; font-weight: 800; color: var(--ink); line-height: 1; }
.term-date span { font-size: 11px; font-weight: 700; color: var(--muted); margin-top: 2px; }
.term-body { flex: 1; }
.term-body strong { display: block; font-size: 15.5px; font-weight: 800; color: var(--ink); }
.term-body span { display: block; font-size: 12.5px; color: var(--muted); }
.term-body .term-addr { margin-top: 3px; }
.term-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.term-today { background: #eaf4ee; color: #105258; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 3px 8px; }
.term-time { font-size: 13px; font-weight: 700; color: var(--ink); }
.tabbar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-top: 1px solid #eef2f0; display: flex; padding: 10px 4px calc(10px + 8px); z-index: 20; }
.tab { flex: 1; background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 10.5px; color: var(--muted); cursor: pointer; font-family: inherit; position: relative; }
.tab.active { color: var(--green); font-weight: 700; }
.tab-count { position: absolute; top: -4px; right: calc(50% - 18px); background: var(--green); color: #fff; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 6px; }
.owner-reg-page { background: var(--bg); }
.oreg-hero { position: relative; min-height: 300px; }
.oreg-logo { display: flex; align-items: center; justify-content: center; margin-top: 14px; position: relative; z-index: 2; }
.oreg-tagline { text-align: center; font-size: 13px; color: var(--ink); margin-top: 2px; position: relative; z-index: 2; }
.oreg-house { position: absolute; right: -20px; top: 60px; width: 320px; z-index: 0; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 60% 45%, #000 40%, transparent 78%); mask-image: radial-gradient(ellipse 70% 60% at 60% 45%, #000 40%, transparent 78%); }
.oreg-house img { width: 100%; height: auto; mix-blend-mode: multiply; }
.oreg-headline { position: relative; z-index: 2; padding: 36px 22px 0; }
.oreg-headline h1 { font-size: 32px; font-weight: 800; color: var(--ink); line-height: 1.12; letter-spacing: -.5px; }
.oreg-headline p { margin-top: 14px; font-size: 14.5px; line-height: 1.55; color: var(--ink); }
.oreg-benefits { position: relative; z-index: 2; margin: 24px 14px 0; background: #fff; border-radius: 20px; display: flex; padding: 20px 8px; box-shadow: 0 6px 20px rgba(18,51,59,.06); }
.oreg-benefit { flex: 1; position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 0 5px; }
.oreg-benefit-icon { width: 46px; height: 46px; border-radius: 50%; background: #f0f7f4; display: grid; place-items: center; margin-bottom: 2px; }
.oreg-benefit strong { font-size: 10.5px; color: var(--ink); line-height: 1.25; }
.oreg-benefit span { font-size: 9.5px; color: var(--muted); line-height: 1.35; }
.oreg-form-section { padding: 32px 20px 0; }
.oreg-form-section h2 { text-align: center; font-size: 21px; font-weight: 800; color: var(--ink); }
.oreg-form-sub { text-align: center; font-size: 13.5px; color: var(--muted); margin-top: 6px; }
.oreg-form { display: flex; flex-direction: column; gap: 13px; margin-top: 22px; }
.form-error { background: #fdeeed; color: #d0452e; border-radius: 12px; padding: 12px 14px; font-size: 13.5px; font-weight: 600; }
.auth-footer { text-align: center; margin-top: 22px; font-size: 14px; color: var(--ink); }
.link-strong { color: var(--green); font-weight: 700; text-decoration: none; }
.oreg-trust { margin: 28px 14px 10px; background: #eef4f1; border-radius: 20px; padding: 22px 14px 18px; }
.oreg-trust-row { display: flex; }
.oreg-trust-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; padding: 0 6px; }
.oreg-trust-icon { width: 44px; height: 44px; border-radius: 50%; background: #fff; display: grid; place-items: center; margin-bottom: 2px; }
.oreg-trust-item strong { font-size: 11px; color: var(--ink); line-height: 1.25; }
.oreg-trust-item span { font-size: 10px; color: var(--muted); line-height: 1.35; }
.oreg-made { margin-top: 18px; padding-top: 16px; border-top: 1px solid #dde8e2; display: flex; align-items: center; justify-content: center; gap: 12px; }
.oreg-made-icon { width: 40px; height: 40px; border-radius: 50%; background: #fff; display: grid; place-items: center; }
.oreg-made strong { display: block; font-size: 13px; color: var(--ink); }
.oreg-made span { font-size: 11.5px; color: var(--muted); display: flex; align-items: center; gap: 5px; }
.login-page { background: var(--bg); }
.login-logo { display: flex; align-items: center; justify-content: center; margin-top: 30px; }
.login-tagline { text-align: center; font-size: 14px; color: var(--ink); margin-top: 4px; }
.login-head { text-align: center; padding: 42px 24px 0; }
.login-head h1 { font-size: 27px; font-weight: 800; color: var(--ink); }
.login-head p { margin-top: 10px; font-size: 14.5px; color: var(--muted); line-height: 1.5; }
.login-form { padding: 0 20px; }
.login-row { display: flex; justify-content: flex-end; }
.forgot-link { font-size: 13.5px; color: var(--muted); text-decoration: none; }
/* ---------- Eigentümer Dashboard neu + SideMenu + ActionSheet ---------- */
.own-dash { background: #f4f7f7; position: relative; min-height: 100dvh; }
.own-top { display: flex; align-items: center; justify-content: space-between; padding: 10px 18px 6px; }
.own-burger { background: none; border: none; cursor: pointer; padding: 4px; }
.own-bell { position: relative; width: 52px; height: 52px; background: #fff; border: none; border-radius: 16px; display: grid; place-items: center; cursor: pointer; box-shadow: 0 2px 8px rgba(18,51,59,.06); }
.own-logo { position: relative; width: 150px; height: 92px; }
.own-logo-svg { position: absolute; left: 0; top: 0; }
.own-logo-text { position: absolute; left: 0; bottom: 8px; display: flex; flex-direction: column; align-items: flex-start; }
.own-logo-line1 { font-size: 27px; font-weight: 800; color: #1c2129; letter-spacing: -.5px; line-height: .95; }
.own-logo-line2 { font-family: "Snell Roundhand", "Brush Script MT", cursive; font-size: 26px; color: #105258; line-height: .9; margin-left: 26px; }
.qa-row { display: flex; gap: 12px; padding: 18px 18px 0; }
.qa-card { flex: 1; background: #fff; border: none; border-radius: 18px; padding: 18px 14px 14px; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 8px; font-family: inherit; box-shadow: 0 2px 10px rgba(18,51,59,.05); min-height: 210px; position: relative; }
.qa-icon { width: 52px; height: 52px; border-radius: 50%; background: #eaf4ee; display: grid; place-items: center; margin-bottom: 2px; }
.qa-icon.qa-dark { background: #105258; }
.qa-card strong { font-size: 17px; font-weight: 800; color: #1a3a4a; }
.qa-card span { font-size: 13px; color: #5b6d73; line-height: 1.4; }
.qa-arrow { margin-top: auto; align-self: flex-end; }
.ki-card { margin: 18px 18px 0; background: #e8f0ec; border-radius: 24px; padding: 22px 18px 20px; }
.ki-head { display: flex; align-items: flex-start; gap: 14px; }
.ki-robot { flex-shrink: 0; margin-top: -4px; }
.ki-title-row { flex: 1; display: flex; align-items: center; gap: 10px; }
.ki-title-row h2 { font-size: 21px; font-weight: 800; color: #1a3a4a; }
.ki-badge { background: #105258; color: #fff; font-size: 12px; font-weight: 800; border-radius: 7px; padding: 3px 8px; }
.ki-text { margin: 8px 0 0 70px; font-size: 14.5px; color: #33484f; line-height: 1.5; }
.ki-input-row { margin-top: 16px; position: relative; display: flex; align-items: center; }
.ki-input-row input { flex: 1; border: none; outline: none; background: #fff; border-radius: 30px; padding: 18px 62px 18px 22px; font-size: 15.5px; color: var(--ink); font-family: inherit; }
.ki-send { position: absolute; right: 6px; width: 48px; height: 48px; border-radius: 50%; background: #105258; border: none; cursor: pointer; display: grid; place-items: center; }
.ki-chips { display: flex; gap: 12px; margin-top: 16px; }
.ki-chip { display: flex; align-items: center; gap: 8px; background: #fff; border: none; border-radius: 24px; padding: 11px 20px; font-size: 14.5px; font-weight: 600; color: #1a3a4a; cursor: pointer; font-family: inherit; }
.overview-grid { display: flex; gap: 12px; padding: 16px 18px 0; }
.ov-card { flex: 1; display: flex; align-items: center; gap: 12px; background: #fff; border: none; border-radius: 18px; padding: 16px; cursor: pointer; text-align: left; font-family: inherit; box-shadow: 0 2px 10px rgba(18,51,59,.05); }
.ov-icon { width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0; background: #eaf4ee; display: grid; place-items: center; }
.ov-icon-lg { width: 68px; height: 68px; }
.ov-text { flex: 1; }
.ov-text strong { display: block; font-size: 15.5px; font-weight: 800; color: #1a3a4a; }
.ov-text span { display: block; font-size: 13px; color: #5b6d73; margin-top: 3px; line-height: 1.4; }
.ov-wide { width: calc(100% - 36px); margin: 12px 18px 0; padding: 20px 16px; }
.fab-plus { position: fixed; bottom: 44px; left: 50%; transform: translateX(-50%); width: 76px; height: 76px; border-radius: 50%; background: #105258; border: 6px solid #f4f7f7; display: grid; place-items: center; cursor: pointer; z-index: 15; box-shadow: 0 6px 18px rgba(16,82,88,.35); }
.menu-overlay { position: fixed; inset: 0; background: rgba(28,33,41,.35); opacity: 0; pointer-events: none; transition: opacity .25s; z-index: 40; }
.menu-overlay.open { opacity: 1; pointer-events: auto; }
.side-menu { position: fixed; top: 0; bottom: 0; left: 0; width: 88%; max-width: 380px; background: #f4f7f7; z-index: 41; transform: translateX(-105%); transition: transform .3s ease; border-radius: 0 24px 24px 0; padding: 24px 22px 20px; display: flex; flex-direction: column; overflow-y: auto; }
.side-menu.open { transform: translateX(0); }
.sm-head { display: flex; align-items: flex-start; justify-content: space-between; }
.sm-logo { position: relative; width: 140px; height: 78px; }
.sm-close { width: 48px; height: 48px; border-radius: 14px; background: #fff; border: none; cursor: pointer; display: grid; place-items: center; box-shadow: 0 2px 8px rgba(18,51,59,.06); }
.sm-nav { display: flex; flex-direction: column; gap: 6px; margin-top: 34px; }
.sm-item { display: flex; align-items: center; gap: 18px; background: none; border: none; cursor: pointer; padding: 16px 4px; font-family: inherit; text-align: left; width: 100%; }
.sm-icon { width: 56px; height: 56px; border-radius: 16px; background: #eee9df; display: grid; place-items: center; flex-shrink: 0; }
.sm-label { flex: 1; font-size: 19px; font-weight: 800; color: #1a3a4a; }
.sm-divider { height: 1px; background: #e5ddcf; margin: 22px 0; }
.sm-pro-card { display: flex; align-items: center; gap: 14px; background: #e8f0ec; border: none; border-radius: 18px; padding: 18px 16px; cursor: pointer; text-align: left; font-family: inherit; width: 100%; }
.sm-pro-icon { width: 56px; height: 56px; border-radius: 50%; background: #105258; display: grid; place-items: center; flex-shrink: 0; }
.sm-pro-text { flex: 1; }
.sm-pro-text strong { display: block; font-size: 15.5px; font-weight: 800; color: #1a3a4a; }
.sm-pro-text span { display: block; font-size: 12.5px; color: #5b6d73; margin-top: 3px; line-height: 1.35; }
.sm-logout { margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; background: none; border: 1.5px solid #1c2129; border-radius: 14px; padding: 16px; font-size: 16px; font-weight: 700; color: #1c2129; cursor: pointer; font-family: inherit; }
.sm-footer { margin-top: auto; padding-top: 24px; text-align: center; font-size: 12.5px; color: #9aa9ad; }
.own-section-title { padding: 30px 20px 0; font-size: 22px; font-weight: 800; color: #1a3a4a; }
/* ActionSheet */
.sheet { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: #fff; border-radius: 24px 24px 0 0; padding: 12px 20px calc(24px + 10px); z-index: 42; animation: sheet-up .25s ease; }
@keyframes sheet-up { from { transform: translate(-50%, 100%); } to { transform: translate(-50%, 0); } }
.sheet-handle { width: 40px; height: 4px; border-radius: 2px; background: #dde5e2; margin: 0 auto 14px; }
.sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.sheet-head h3 { font-size: 20px; font-weight: 800; color: var(--ink); }
.sheet-head button { background: #f0f2f1; border: none; border-radius: 50%; width: 38px; height: 38px; display: grid; place-items: center; cursor: pointer; }
.sheet-item { width: 100%; display: flex; align-items: center; gap: 14px; background: #f4f7f7; border: none; border-radius: 16px; padding: 14px; margin-bottom: 10px; cursor: pointer; text-align: left; font-family: inherit; }
.sheet-icon { width: 50px; height: 50px; border-radius: 50%; flex-shrink: 0; background: #eaf4ee; display: grid; place-items: center; }
.sheet-icon.dark { background: #105258; }
.sheet-icon.alert { background: #fdeeed; }
.sheet-item strong { display: block; font-size: 15px; font-weight: 800; color: var(--ink); }
.sheet-item span span { display: block; font-size: 12.5px; color: var(--muted); margin-top: 2px; }
/* Anfrage */
.btn-danger { background: #d0452e; color: #fff; border: none; border-radius: 16px; padding: 17px; font-size: 16px; font-weight: 800; cursor: pointer; font-family: inherit; width: 100%; }
.btn-danger:disabled { opacity: .4; }
.anf-titel input { height: 58px; }
.anf-plz-row { display: flex; gap: 10px; }
.anf-plz-row input:first-child { width: 110px; }
.summary-card { margin: 18px 18px 0; background: #fff; border: 1px solid #e6eeeb; border-radius: 18px; padding: 6px 18px; }
.sum-row { display: flex; justify-content: space-between; gap: 18px; padding: 13px 0; border-bottom: 1px solid #f0f4f2; }
.sum-row:last-child { border-bottom: none; }
.sum-row span { font-size: 13px; color: var(--muted); flex-shrink: 0; }
.sum-row strong { font-size: 14px; color: var(--ink); text-align: right; font-weight: 600; }
.seg-tabs { display: flex; gap: 8px; margin: 16px 18px 0; background: #eceae2; border-radius: 14px; padding: 4px; }
.seg-tabs button { flex: 1; background: none; border: none; border-radius: 11px; padding: 11px; font-size: 14.5px; font-weight: 700; color: var(--muted); cursor: pointer; font-family: inherit; }
.seg-tabs button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.empty-box { margin: 40px 18px; text-align: center; display: flex; flex-direction: column; gap: 16px; align-items: center; }
.empty-box p { color: var(--muted); font-size: 14.5px; }
.as-btn { width: 100%; background: none; border: none; font-family: inherit; cursor: pointer; }
.badge-orange { background: #fdf1e3; color: #d98a2b; }
.badge-gray { background: #eef0f0; color: #6b7d82; }
.timeline { padding: 20px 22px 0; position: relative; }
.timeline::before { content: ""; position: absolute; left: 43px; top: 30px; bottom: 20px; width: 2px; background: #e5ddcf; }
.tl-item { display: flex; gap: 16px; margin-bottom: 22px; position: relative; }
.tl-dot { width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; background: #fff; display: grid; place-items: center; font-size: 18px; box-shadow: 0 2px 8px rgba(18,51,59,.08); z-index: 1; }
.tl-body { flex: 1; }
.tl-date { font-size: 12px; color: var(--muted); }
.tl-body strong { display: block; font-size: 15.5px; font-weight: 800; color: var(--ink); margin-top: 2px; }
.tl-body p { font-size: 13px; color: var(--muted); margin-top: 3px; line-height: 1.4; }
.notfall-page { background: #fdeeed; }
.nf-hero { text-align: center; padding: 10px 24px 0; }
.nf-icon { width: 84px; height: 84px; border-radius: 50%; background: #fff; display: grid; place-items: center; margin: 0 auto 14px; animation: pulse 1.6s infinite; }
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(208,69,46,.3); } 50% { box-shadow: 0 0 0 16px rgba(208,69,46,0); } }
.nf-hero h1 { font-size: 26px; font-weight: 800; color: #d0452e; }
.nf-hero p { margin-top: 8px; font-size: 14px; color: #5b6d73; line-height: 1.5; }
.success-circle { width: 84px; height: 84px; border-radius: 50%; background: #eaf4ee; display: grid; place-items: center; font-size: 34px; }
.success-circle.alert { background: #fdeeed; }
.ki-page { display: flex; flex-direction: column; background: var(--bg); min-height: 100dvh; }
.ki-messages { flex: 1; overflow-y: auto; padding: 20px 18px; display: flex; flex-direction: column; gap: 12px; }
.bubble { max-width: 82%; padding: 14px 16px; border-radius: 18px; font-size: 15px; line-height: 1.5; }
.bubble.ai { background: #fff; color: var(--ink); border-bottom-left-radius: 6px; align-self: flex-start; }
.bubble.user { background: var(--green); color: #fff; border-bottom-right-radius: 6px; align-self: flex-end; }
.ki-composer { padding: 10px 18px 16px; background: #fff; border-top: 1px solid #eef2f0; }

/* =====================================================   einfachhausen – Design-System FINAL 100% (Bonus-Paket)
   Ueberschreibt vorherige Variablen mit finalen Werten
   ============================================================ */
:root { --bg:#f4f7f7; --ink:#1c2129; --green:#105258; --green-soft:#eaf4ee; --muted:#5b6d73; --card:#ffffff; --line:#e6eeeb; --danger:#d0452e; --radius:18px; }
* { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
html, body { height:100%; background:var(--bg); color:var(--ink); font-family:-apple-system,"SF Pro Text","Avenir Next",Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; overscroll-behavior:none; }
/* Legacy anchor color must sit in @layer base: un-layered, it would override
   Tailwind utilities (e.g. text-white on dark CTAs) and break axe contrast. */
@layer base { a { color:var(--green); } }
button { -webkit-appearance:none; }
.page { min-height:100dvh; padding-bottom:110px; }
.center-page { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:32px; gap:10px; min-height:100dvh; }
.safe-top { padding-top:max(env(safe-area-inset-top),14px); }
.safe-bottom { padding-bottom:calc(env(safe-area-inset-bottom) + 96px); }
.home-indicator { position:fixed; bottom:8px; left:50%; transform:translateX(-50%); width:134px; height:5px; border-radius:3px; background:var(--ink); opacity:.85; z-index:60; pointer-events:none; }
/* h1/h2/p element resets moved into .page/.center-page scope above */
.page h1, .center-page h1 { font-size:28px; font-weight:800; letter-spacing:-.4px; color:var(--ink); }
.page h2, .center-page h2 { font-size:21px; font-weight:800; color:var(--ink); }
.page p, .center-page p { font-size:14.5px; line-height:1.5; color:var(--muted); }
.btn-primary { display:inline-flex; align-items:center; justify-content:center; gap:8px; background:var(--green); color:#fff; border:none; border-radius:16px; padding:17px 24px; font-size:16px; font-weight:800; font-family:inherit; cursor:pointer; transition:transform .12s ease, opacity .12s ease; }
.btn-primary:active { transform:scale(.97); }
.btn-primary:disabled { opacity:.4; cursor:default; }
.btn-full { width:100%; }
.btn-ghost { display:inline-flex; align-items:center; justify-content:center; background:none; border:1.5px solid var(--ink); border-radius:16px; padding:16px; font-size:15.5px; font-weight:700; color:var(--ink); cursor:pointer; font-family:inherit; }
.btn-danger { background:var(--danger); color:#fff; border:none; border-radius:16px; padding:17px; font-size:16px; font-weight:800; cursor:pointer; font-family:inherit; width:100%; }
.btn-danger:disabled { opacity:.4; }
.if-wrap { position:relative; margin-bottom:14px; }
.if-wrap input, .if-wrap textarea { width:100%; border:1.5px solid #dfe5e2; outline:none; background:#fff; border-radius:14px; padding:26px 16px 10px; font-size:15.5px; color:var(--ink); font-family:inherit; transition:border-color .15s; }
.if-wrap input:focus, .if-wrap textarea:focus { border-color:var(--green); }
.if-label { position:absolute; top:8px; left:16px; font-size:11.5px; font-weight:700; color:var(--muted); letter-spacing:.3px; text-transform:uppercase; }
.icon-field { display:flex; gap:12px; align-items:center; margin-bottom:14px; }
.icon-bubble { width:58px; height:58px; border-radius:50%; flex-shrink:0; background:var(--green-soft); display:grid; place-items:center; }
.icon-field .if-wrap { flex:1; margin-bottom:0; }
.textarea-wrap { position:relative; margin-bottom:14px; }
.char-count { position:absolute; right:14px; bottom:10px; font-size:11px; color:#9aa9ad; }
.toggle-card { display:flex; align-items:center; gap:14px; background:#fff; border-radius:var(--radius); padding:16px; margin-bottom:14px; box-shadow:0 2px 10px rgba(18,51,59,.05); }
.toggle-icon { width:50px; height:50px; border-radius:50%; background:var(--green-soft); display:grid; place-items:center; font-size:20px; flex-shrink:0; }
.toggle-text { flex:1; }
.toggle-text strong { display:block; font-size:15px; font-weight:800; color:var(--ink); }
.toggle-text span { display:block; font-size:12.5px; color:var(--muted); margin-top:2px; }
.switch { width:52px; height:31px; border-radius:16px; flex-shrink:0; background:#dfe5e2; border:none; position:relative; cursor:pointer; transition:background .2s; }
.switch .knob { position:absolute; top:2.5px; left:2.5px; width:26px; height:26px; border-radius:50%; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,.2); transition:left .2s; }
.switch.on { background:var(--green); }
.switch.on .knob { left:23.5px; }
.checkbox-square { width:24px; height:24px; border-radius:7px; flex-shrink:0; border:1.8px solid #c8d2ce; display:grid; place-items:center; transition:all .15s; }
.checkbox-square.on { background:var(--green); border-color:var(--green); }
.tabbar { position:fixed; bottom:0; left:0; right:0; z-index:30; max-width:430px; margin:0 auto; background:#fff; border-radius:26px 26px 0 0; padding:12px 22px calc(env(safe-area-inset-bottom) + 14px); display:flex; align-items:flex-end; justify-content:space-between; box-shadow:0 -4px 20px rgba(18,51,59,.08); }
.tab { background:none; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:3px; color:#9aa9ad; font-family:inherit; position:relative; width:64px; }
.tab span:last-child { font-size:10.5px; font-weight:700; }
.tab.active { color:var(--green); }
.tab-count { position:absolute; top:-4px; right:8px; min-width:18px; height:18px; border-radius:9px; background:var(--danger); color:#fff; font-size:10px; font-weight:800; display:grid; place-items:center; padding:0 4px; }
.fab-tab { width:58px; height:58px; border-radius:50%; flex-shrink:0; background:var(--green); color:#fff; border:none; font-size:30px; font-weight:300; cursor:pointer; margin-top:-32px; box-shadow:0 4px 14px rgba(16,82,88,.35); line-height:1; }
.badge { display:inline-block; font-size:11.5px; font-weight:800; border-radius:8px; padding:4px 9px; }
.badge-green { background:var(--green-soft); color:var(--green); }
.badge-orange { background:#fdf1e3; color:#d98a2b; }
.badge-gray { background:#eef0f0; color:#6b7d82; }
.chips { display:flex; gap:10px; flex-wrap:wrap; margin:14px 0; }
.chip { background:#fff; border:1.5px solid var(--line); border-radius:20px; padding:9px 16px; font-size:13.5px; font-weight:600; color:var(--ink); cursor:pointer; font-family:inherit; }
.chip.sel { background:var(--green); color:#fff; border-color:var(--green); }
.ob-page { background:var(--bg); }
.ob-header { display:flex; align-items:center; justify-content:space-between; padding:8px 18px 4px; }
.back-btn { width:46px; height:46px; border-radius:15px; background:#fff; border:none; cursor:pointer; display:grid; place-items:center; box-shadow:0 2px 8px rgba(18,51,59,.06); }
.ob-head { padding:18px 22px 6px; }
.ob-head h1 { margin-bottom:8px; }
.ob-head p { max-width:300px; }
.ob-form { padding:20px 22px 0; }
.ob-actions { padding:24px 22px 0; display:flex; flex-direction:column; gap:12px; }
.stepper { display:flex; align-items:center; justify-content:center; padding:8px 40px 0; }
.step-dot { width:34px; height:34px; border-radius:50%; flex-shrink:0; background:#eceae2; color:var(--muted); display:grid; place-items:center; font-size:14px; font-weight:800; transition:all .2s; }
.step-dot.on { background:var(--green); color:#fff; }
.step-line { flex:1; height:2px; background:#eceae2; margin:0 6px; }
.step-line.on { background:var(--green); }
.cat-panel { margin:0 18px; background:#fff; border-radius:22px; padding:20px 16px; box-shadow:0 2px 12px rgba(18,51,59,.05); }
.cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.cat-tile { position:relative; background:#f4f1ea; border:2px solid transparent; border-radius:16px; padding:18px 8px 14px; display:flex; flex-direction:column; align-items:center; gap:8px; cursor:pointer; font-family:inherit; transition:all .15s; }
.cat-tile.sel { background:var(--green-soft); border-color:var(--green); }
.cat-tile-title { font-size:12.5px; font-weight:800; color:var(--ink); text-align:center; line-height:1.25; }
.cat-check { position:absolute; top:8px; right:8px; width:20px; height:20px; border-radius:50%; background:var(--green); display:grid; place-items:center; }
.subcat-section { padding:24px 18px 0; }
.subcat-section h3 { font-size:18px; font-weight:800; color:var(--ink); }
.subcat-list { display:flex; flex-direction:column; gap:10px; margin-top:12px; }
.subcat-item { display:flex; align-items:center; gap:14px; background:#fff; border:2px solid transparent; border-radius:16px; padding:16px; cursor:pointer; text-align:left; font-family:inherit; transition:all .15s; width:100%; }
.subcat-item.sel { border-color:var(--green); background:#f4faf7; }
.subcat-text { flex:1; }
.subcat-text strong { display:block; font-size:15px; font-weight:800; color:var(--ink); }
.subcat-text span { display:block; font-size:12.5px; color:var(--muted); margin-top:2px; }
.req-card { margin:18px 18px 0; background:#fff; border-radius:20px; padding:4px 18px; box-shadow:0 2px 12px rgba(18,51,59,.05); }
.req-item { display:flex; align-items:center; gap:14px; padding:16px 0; position:relative; }
.req-divider { position:absolute; left:-18px; right:-18px; top:0; height:1px; background:#f0f4f2; }
.req-icon { width:54px; height:54px; border-radius:50%; flex-shrink:0; background:var(--green-soft); display:grid; place-items:center; }
.req-body { flex:1; min-width:0; }
.req-title { font-size:15.5px; font-weight:800; color:var(--ink); }
.req-text { font-size:13px; color:var(--muted); margin-top:3px; line-height:1.4; }
.req-plz { display:flex; align-items:center; gap:5px; font-size:12.5px; color:var(--muted); margin-top:5px; }
.req-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
.req-price { font-size:16px; font-weight:800; color:var(--green); }
.quote-btn { background:var(--green); color:#fff; border:none; border-radius:12px; padding:10px 18px; font-size:13.5px; font-weight:800; cursor:pointer; font-family:inherit; }
.quote-card { width:calc(100% - 36px); margin:12px 18px 0; display:flex; align-items:center; gap:14px; background:#fff; border:none; border-radius:var(--radius); padding:18px 16px; cursor:pointer; text-align:left; font-family:inherit; box-shadow:0 2px 10px rgba(18,51,59,.05); }
.quote-icon { width:56px; height:56px; border-radius:50%; background:var(--green-soft); display:grid; place-items:center; flex-shrink:0; }
.quote-text { flex:1; }
.quote-text strong { display:block; font-size:15.5px; font-weight:800; color:var(--ink); }
.quote-text span { display:block; font-size:13px; color:var(--muted); margin-top:3px; line-height:1.4; }
.error-box { margin:0 22px 12px; background:#fdeeed; border-radius:12px; padding:12px 16px; font-size:13.5px; color:var(--danger); font-weight:600; }
.spinner { width:34px; height:34px; border-radius:50%; border:3px solid var(--line); border-top-color:var(--green); animation:spin .8s linear infinite; margin:0 auto; }
@keyframes spin { to { transform:rotate(360deg); } }
.ob-visual { display:flex; justify-content:center; padding:16px 0 4px; }
.ob-visual svg { width:190px; height:auto; }
.ob-visual-svg { display:block; margin:0 auto; }
.success-circle { width:84px; height:84px; border-radius:50%; background:var(--green-soft); display:grid; place-items:center; font-size:34px; }
.success-circle.alert { background:#fdeeed; }

.welcome-logo { display:flex; flex-direction:column; align-items:center; margin-top:40px; }
.welcome-logo-text { display:flex; flex-direction:column; align-items:center; margin-top:-8px; }
.wl-1 { font-size:44px; font-weight:800; color:var(--ink); letter-spacing:-1px; }
.wl-2 { font-family:"Snell Roundhand", cursive; font-size:46px; color:var(--green); margin-top:-14px; }
.welcome-tag { margin-top:14px; font-size:15px; color:var(--muted); }
.role-hero { text-align:center; padding:30px 32px 0; }
.role-cards { display:flex; flex-direction:column; gap:14px; padding:28px 22px 0; }
.role-card { display:flex; align-items:center; gap:16px; background:#fff; border:2px solid transparent; border-radius:20px; padding:20px; cursor:pointer; text-align:left; font-family:inherit; transition:all .15s; }
.role-card.sel { border-color:var(--green); background:#f4faf7; }
.role-icon { width:62px; height:62px; border-radius:50%; background:var(--green-soft); display:grid; place-items:center; flex-shrink:0; }
.role-text { flex:1; }
.role-text strong { display:block; font-size:17px; font-weight:800; color:var(--ink); }
.role-text span { display:block; font-size:13px; color:var(--muted); margin-top:3px; }
.auth-head { text-align:center; padding:8px 32px 0; }
.auth-head h1 { font-size:26px; }
.auth-head p { margin-top:8px; }
.auth-links { text-align:center; margin-top:18px; font-size:14px; }
.auth-links a { font-weight:700; }
/* FIX: page centering for mobile 390px - override final */
.page { max-width:430px; margin:0 auto; display:flex; flex-direction:column; }
.center-page { max-width:430px; margin:0 auto; }

/* =====================================================   T-0168 — Notion App-Design fidelity layer
   Verbindliche visuelle Tokens aus der App-Design-Referenz.
   ============================================================ */
:root {
  --bg:#f4f7f7;
  --ink:#1c2129;
  --green:#105258;
  --green-soft:#dcebec;
  --card:#ffffff;
  --line:rgba(28,33,41,.09);
  --muted:#57686b;
  --radius:24px;
  --shadow-soft:0 10px 32px rgba(28,33,41,.065);
  --shadow-float:0 14px 38px rgba(28,33,41,.10);
}
html,body { background:#f4f7f7; color:#1c2129; }
.page { width:100%; background:#f4f7f7; overflow-x:hidden; }
.home-indicator { width:132px; height:5px; bottom:7px; border-radius:999px; background:#1c2129; opacity:.9; }

/* Karten, Felder und Controls: weich, ruhig, keine harten Rahmen. */
.role-card,.qa-card,.ov-card,.req-card,.toggle-card,.cat-panel,.quote-card,.oreg-benefits,.oreg-trust,.sm-pro-card {
  border-radius:24px;
  box-shadow:var(--shadow-soft);
}
.if-wrap input,.if-wrap textarea,.chip,.seg-tabs,.subcat-item { border-radius:18px; }
.if-wrap input,.if-wrap textarea { border:1px solid rgba(28,33,41,.12); background:#ffffff; }
.btn-primary,.btn-ghost,.btn-danger { border-radius:18px; min-height:54px; }
.back-btn,.sm-close { border-radius:18px; box-shadow:var(--shadow-soft); }

/* Zentrale Header-Geometrie wie in den mobilen Notion-Mockups. */
.own-top { position:relative; min-height:86px; padding:16px 20px 8px; }
.own-burger { width:48px; height:48px; display:grid; place-items:center; transform:translateY(5px); z-index:2; }
.own-bell { width:48px; height:48px; border-radius:18px; background:#ffffff; box-shadow:var(--shadow-soft); z-index:2; }
.own-logo { position:absolute; left:50%; top:2px; transform:translateX(-50%); width:146px; height:80px; }
.own-logo-svg { opacity:.98; }
.own-logo-line1 { font-size:25px; letter-spacing:-.7px; }
.own-logo-line2 { font-size:25px; margin-left:24px; }
.dash-top { background:#f4f7f7; }
.top-btn { box-shadow:none; }

/* Start/Dashboard: kompakte, luftige 3er-Aktionen und organische KI-Fläche. */
.qa-row { gap:10px; padding:12px 16px 0; }
.qa-card { min-height:184px; padding:16px 12px 13px; background:#ffffff; border:1px solid rgba(28,33,41,.035); }
.qa-icon { width:48px; height:48px; }
.qa-card strong { font-size:15px; }
.qa-card span { font-size:12px; line-height:1.38; }
.ki-card { margin:16px 16px 0; border-radius:26px; background:#e8f0ec; box-shadow:none; padding:20px 16px 18px; }
.ki-input-row input { background:#ffffff; box-shadow:0 5px 18px rgba(28,33,41,.045); }
.overview-grid { gap:10px; padding:14px 16px 0; }
.ov-card { background:#ffffff; border:1px solid rgba(28,33,41,.035); padding:15px; }
.ov-wide { width:calc(100% - 32px); margin:10px 16px 0; }
.own-section-title { padding:27px 18px 0; font-size:20px; }
.fab-plus { width:66px; height:66px; bottom:54px; border:5px solid #f4f7f7; box-shadow:0 9px 25px rgba(16,82,88,.28); }

/* Tabbar + SideMenu + Bottom Sheet. */
.tabbar { max-width:430px; background:rgba(255,253,250,.97); border:1px solid rgba(28,33,41,.055); border-bottom:0; border-radius:26px 26px 0 0; padding:11px 16px calc(env(safe-area-inset-bottom) + 18px); box-shadow:0 -10px 32px rgba(28,33,41,.07); backdrop-filter:blur(18px); }
.tab { width:auto; min-width:54px; }
.side-menu { width:min(88%,360px); background:#f4f7f7; border-radius:0 26px 26px 0; box-shadow:16px 0 50px rgba(28,33,41,.12); }
.sm-icon { border-radius:18px; background:#efeae1; }
.sheet { max-width:430px; background:#ffffff; border-radius:26px 26px 0 0; box-shadow:0 -18px 48px rgba(28,33,41,.12); }
.sheet-item { background:#f4f7f7; border-radius:20px; }

/* Rollen-, Onboarding- und Listen-Screens. */
.role-hero { padding-top:38px; }
.role-cards { gap:16px; padding:30px 20px 0; }
.role-card { background:#ffffff; padding:20px 18px; border:1.3px solid transparent; }
.role-card.sel { border-color:#105258; background:#f3f8f5; }
.role-icon { width:60px; height:60px; background:#dcebec; }
.role-icon svg { width:30px; height:30px; }
.req-card { margin:16px 16px 0; background:#ffffff; padding:4px 16px; }
.timeline { padding:20px 20px 0; }
.timeline::before { left:41px; width:1px; background:rgba(28,33,41,.12); }
.tl-dot { width:44px; height:44px; background:#ffffff; box-shadow:var(--shadow-soft); }
.tl-dot svg { width:23px; height:23px; }
.history-head { display:flex; align-items:center; gap:14px; }
.history-title-icon { width:54px; height:54px; border-radius:18px; background:#dcebec; display:grid; place-items:center; flex:0 0 auto; }

/* Login/Register: exakt dieselbe Creme/Petrol/Tinte-Hierarchie. */
.login-page,.owner-reg-page { background:#f4f7f7; }
.login-head h1,.oreg-headline h1,.auth-head h1 { color:#1c2129; letter-spacing:-.5px; }
.login-form,.oreg-form-section { position:relative; z-index:2; }
.oreg-benefits { background:#ffffff; border:1px solid rgba(28,33,41,.035); }
.oreg-trust { background:#dcebec; box-shadow:none; }

@media (max-width:390px) {
  .page { max-width:390px; }
  .qa-row { padding-left:14px; padding-right:14px; gap:8px; }
  .qa-card { padding-left:10px; padding-right:10px; }
  .qa-card strong { font-size:14.5px; }
  .qa-card span { font-size:11.5px; }
  .overview-grid { padding-left:14px; padding-right:14px; }
  .ov-wide { width:calc(100% - 28px); margin-left:14px; margin-right:14px; }
}

/* DESIGN.md §3 Kanon-Tokens global (404 läuft außerhalb der .mkt-Scope) */
:root {
  --eh-green-900: #0a3539;
  --eh-green-700: #105258;
  --eh-green-600: #147078;
  --eh-green-100: #dcebec;
  --eh-green-50: #edf5f5;
  --eh-bg: #f4f7f7;
  --eh-surface: #ffffff;
  --eh-text: #1c2129;
  --eh-text-secondary: #57686b;
  --eh-border-strong: #cfdad9;
  --eh-warn-border: #ecd9ac;
  --eh-warn-bg: #fff8e8;
  --eh-warn-text: #674b14;
  --eh-success-border: #b8d9c5;
}

/* 404 im Brand-Layout (Inter/Teal, wash + dot grid) */
.nf-shell { min-height:100dvh; display:grid; place-content:center; justify-items:center; text-align:center; padding:40px 24px; gap:0;
  background:radial-gradient(800px 400px at 80% -10%, var(--eh-green-100), transparent 60%), var(--eh-bg); font-family:var(--font-marketing),ui-sans-serif,system-ui,sans-serif; }
.nf-mark { margin-bottom:26px; }
.nf-eyebrow { display:inline-flex; font-size:12px; font-weight:750; letter-spacing:.09em; color:var(--eh-green-700); background:var(--eh-green-50); border-radius:999px; padding:6px 13px; }
.nf-shell h1 { margin:16px 0 0; font-size:clamp(30px,4vw,44px); font-weight:700; letter-spacing:-.03em; color:var(--eh-text); }
.nf-shell p { margin:12px 0 0; max-width:440px; color:var(--eh-text-secondary); font-size:15px; line-height:1.6; }
.nf-actions { display:flex; gap:10px; margin-top:26px; flex-wrap:wrap; justify-content:center; }
.nf-primary, .nf-ghost { min-height:50px; display:inline-flex; align-items:center; justify-content:center; border-radius:13px; padding:0 20px; font-size:15px; font-weight:680; font-family:inherit; cursor:pointer; text-decoration:none; }
.nf-primary { background:var(--eh-green-700); color:var(--eh-surface); box-shadow:0 14px 30px -14px rgba(10,53,57,.55); }
.nf-ghost { background:var(--eh-surface); color:var(--eh-text); border:1px solid var(--eh-border-strong); }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior:smooth; } }
/* Global interactions moved out of marketing.module.css (CSS-module purity, T-0006) */
::selection { background: var(--eh-green-100); }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

/* ============================================================
   Funnel-Retheme (2026-08-30): Register/Role auf Website-Brand
   Scope: nur die öffentlichen Funnel-Seiten (ehn-reg-page/role2-page),
   NICHT die abgenommenen App-Screens.
   ============================================================ */
.ehn-reg-page, .role2-page {
  background:
    radial-gradient(800px 400px at 80% -10%, #dcebec, transparent 60%),
    #f4f7f7;
  font-family: var(--font-marketing), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.ehn-reg-page h1, .ehn-reg-page h2, .role2-page h1, .role2-page h2 {
  font-weight: 700; letter-spacing: -.03em;
}
.ehn-reg-page .ehn-reg-submit, .ehn-reg-page .btn-primary, .role2-page .btn-primary {
  background: #105258; font-weight: 680; letter-spacing: -.01em;
}
.ehn-reg-page .ehn-reg-submit:hover, .ehn-reg-page .btn-primary:hover, .role2-page .btn-primary:hover {
  background: #1b8569;
}
.ehn-reg-page .if-wrap input, .role2-page .if-wrap input {
  border-color: #d7dfdc;
}
.ehn-reg-page .if-wrap input:focus, .role2-page .if-wrap input:focus {
  border-color: #105258; box-shadow: 0 0 0 4px rgba(16,82,88,.10);
}
.oreg-logo svg path, .oreg-logo svg { stroke: #105258; }

/* 404 Illustration */
.nf-scene { margin-bottom: 10px; }
.nf-house { width: 220px; height: auto; }

/* T-0155 submit pending feedback */
.submit-spinner { width: 14px; height: 14px; border-radius: 999px; border: 2px solid currentColor; border-top-color: transparent; display: inline-block; animation: eh-spin .7s linear infinite; }
@keyframes eh-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .submit-spinner { animation-duration: 1.6s; } }

@theme inline {--font-heading:var(--font-sans);--font-sans:var(--font-sans);--color-sidebar-ring:var(--sidebar-ring);--color-sidebar-border:var(--sidebar-border);--color-sidebar-accent-foreground:var(--sidebar-accent-foreground);--color-sidebar-accent:var(--sidebar-accent);--color-sidebar-primary-foreground:var(--sidebar-primary-foreground);--color-sidebar-primary:var(--sidebar-primary);--color-sidebar-foreground:var(--sidebar-foreground);--color-sidebar:var(--sidebar);--color-chart-5:var(--chart-5);--color-chart-4:var(--chart-4);--color-chart-3:var(--chart-3);--color-chart-2:var(--chart-2);--color-chart-1:var(--chart-1);--color-ring:var(--ring);--color-input:var(--input);--color-border:var(--border);--color-destructive:var(--destructive);--color-accent-foreground:var(--accent-foreground);--color-accent:var(--accent);--color-muted-foreground:var(--muted-foreground);--color-muted:var(--muted);--color-secondary-foreground:var(--secondary-foreground);--color-secondary:var(--secondary);--color-primary-foreground:var(--primary-foreground);--color-primary:var(--primary);--color-popover-foreground:var(--popover-foreground);--color-popover:var(--popover);--color-card-foreground:var(--card-foreground);--color-card:var(--card);--color-foreground:var(--foreground);--color-background:var(--background);--radius-sm:calc(var(--radius) * 0.6);--radius-md:calc(var(--radius) * 0.8);--radius-lg:var(--radius);--radius-xl:calc(var(--radius) * 1.4);--radius-2xl:calc(var(--radius) * 1.8);--radius-3xl:calc(var(--radius) * 2.2);--radius-4xl:calc(var(--radius) * 2.6);}

.dark {--background:oklch(0.145 0 0);--foreground:oklch(0.985 0 0);--card:oklch(0.205 0 0);--card-foreground:oklch(0.985 0 0);--popover:oklch(0.205 0 0);--popover-foreground:oklch(0.985 0 0);--primary:oklch(0.922 0 0);--primary-foreground:oklch(0.205 0 0);--secondary:oklch(0.269 0 0);--secondary-foreground:oklch(0.985 0 0);--muted:oklch(0.269 0 0);--muted-foreground:oklch(0.708 0 0);--accent:oklch(0.269 0 0);--accent-foreground:oklch(0.985 0 0);--destructive:oklch(0.704 0.191 22.216);--border:oklch(1 0 0 / 10%);--input:oklch(1 0 0 / 15%);--ring:oklch(0.556 0 0);--chart-1:oklch(0.87 0 0);--chart-2:oklch(0.556 0 0);--chart-3:oklch(0.439 0 0);--chart-4:oklch(0.371 0 0);--chart-5:oklch(0.269 0 0);--sidebar:oklch(0.205 0 0);--sidebar-foreground:oklch(0.985 0 0);--sidebar-primary:oklch(0.488 0.243 264.376);--sidebar-primary-foreground:oklch(0.985 0 0);--sidebar-accent:oklch(0.269 0 0);--sidebar-accent-foreground:oklch(0.985 0 0);--sidebar-border:oklch(1 0 0 / 10%);--sidebar-ring:oklch(0.556 0 0);}

@layer base {
  * {
    @apply border-border outline-ring/50;}
  body {
    @apply bg-background text-foreground;}
  html {
    @apply font-sans;}}

/* Workflow-Demo: Zentrierung robust (CSS-Module-Hash greift hier nicht). */
.workflow-demo-inner { margin-inline: auto !important; width: min(1180px, 100%); }

````


## src/app/design-system.css
SHA256: 234971f6eeb51a6f6c96fb4e3b73190e159944d7a7ed9d371a5d38874e45c9bd

````text
/* Einfach Hausen — minimal production system v3
   Editorial, calm, high-signal. One accent, very little chrome. */
:root{
  --eh-bg:#ffffff;
  --eh-soft:#f7f7f5;
  --eh-soft-2:#f1f2ef;
  --eh-text:#111512;
  --eh-muted:#69716b;
  --eh-border:#e4e6e2;
  --eh-accent:#1b8569;
  --eh-accent-soft:#edf6ed;
  --eh-dark:#111512;
  --eh-dark-2:#181d19;
  --eh-dark-border:#2b312c;
}

html{scroll-behavior:smooth;background:var(--eh-bg)}
body{background:var(--eh-bg);color:var(--eh-text);letter-spacing:-.006em}
.btn{border-radius:999px;box-shadow:none;min-height:42px;padding:10px 17px;font-size:13px;font-weight:650;transition:background .15s ease,color .15s ease,border-color .15s ease,transform .15s ease}
.btn:hover{transform:none}.btn.primary{background:var(--eh-dark);color:#fff}.btn.primary:hover{background:#2b302c}.btn.dark{background:var(--eh-dark);color:#fff}.btn.light{background:#fff;color:var(--eh-dark);border:1px solid var(--eh-border)}.btn.ghost{background:transparent;border:1px solid var(--eh-border)}

/* MARKETING */
.marketing-v3{min-height:100vh;background:#fff;color:var(--eh-text)}
.marketing-v3-header{height:68px;display:flex;align-items:center;max-width:1440px;margin:0 auto;padding:0 28px;border-bottom:1px solid var(--eh-border);gap:32px}
.marketing-v3-header .brand{margin-right:auto}.marketing-v3-header nav{display:flex;gap:26px;align-items:center}.marketing-v3-header nav a,.marketing-v3-login{font-size:13px;color:#434a45}.marketing-v3-actions{display:flex;align-items:center;gap:16px;margin-left:18px}.marketing-v3-header .btn{min-height:38px;padding:8px 15px}

.hero-v3{max-width:1220px;margin:0 auto;padding:118px 28px 88px}
.hero-v3-copy{max-width:900px}.hero-v3-kicker{font-size:13px;color:var(--eh-accent);font-weight:700;margin-bottom:22px}.hero-v3 h1{font-size:clamp(54px,7.2vw,96px);line-height:.99;letter-spacing:-.062em;font-weight:520;margin:0;max-width:1040px}.hero-v3-lead{font-size:clamp(18px,2vw,22px);line-height:1.55;color:#555d57;max-width:760px;margin:30px 0 0}.hero-v3-actions{display:flex;align-items:center;gap:16px;margin-top:34px}.hero-v3-actions .btn{min-height:48px;padding:13px 21px}.text-link{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:620;color:#303631}

.prompt-stage{max-width:960px;margin:72px 0 0}.prompt-card{border:1px solid #d9ddd8;border-radius:24px;background:#fff;padding:18px;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.prompt-label{font-size:12px;color:#858c86;margin-bottom:10px}.prompt-row{display:flex;align-items:flex-end;gap:12px}.prompt-copy{font-size:18px;line-height:1.5;flex:1;min-height:54px;padding:10px 6px;color:#262b27}.prompt-tools{display:flex;align-items:center;gap:8px}.prompt-tool{width:38px;height:38px;border-radius:999px;border:1px solid var(--eh-border);display:grid;place-items:center;color:#666e68}.prompt-send{width:40px;height:40px;border-radius:999px;border:0;background:var(--eh-dark);color:white;display:grid;place-items:center}.prompt-answer{display:grid;grid-template-columns:38px minmax(0,1fr);gap:12px;margin:22px 8px 2px;padding-top:22px;border-top:1px solid var(--eh-border)}.prompt-ai{width:32px;height:32px;border-radius:10px;background:var(--eh-accent-soft);display:grid;place-items:center;color:var(--eh-accent)}.prompt-answer strong{font-size:14px;font-weight:650}.prompt-answer p{margin:5px 0 0;color:#606862;font-size:14px;line-height:1.55}.prompt-meta{display:flex;gap:18px;flex-wrap:wrap;margin-top:12px;color:#5f6b63;font-size:11px}.prompt-meta span{display:inline-flex;align-items:center;gap:5px}

.statement-strip{border-top:1px solid var(--eh-border);border-bottom:1px solid var(--eh-border)}.statement-strip-inner{max-width:1220px;margin:0 auto;padding:28px;display:flex;gap:30px;justify-content:space-between;color:#666d68;font-size:12px}.statement-strip strong{color:#202521;font-weight:650}

.editorial-section{max-width:1220px;margin:0 auto;padding:112px 28px}.editorial-eyebrow{display:block;color:var(--eh-accent);font-size:11px;font-weight:750;letter-spacing:.08em;text-transform:uppercase;margin-bottom:20px}.editorial-section h2{font-size:clamp(38px,5vw,66px);line-height:1.03;letter-spacing:-.045em;font-weight:520;margin:0;max-width:900px}.editorial-intro{font-size:17px;line-height:1.6;color:#626963;max-width:680px;margin:22px 0 0}
.process-list{margin-top:62px;border-top:1px solid var(--eh-border)}.process-row{display:grid;grid-template-columns:64px 190px minmax(0,1fr);gap:24px;padding:26px 0;border-bottom:1px solid var(--eh-border);align-items:start}.process-index{font-size:12px;color:#8a908b}.process-row h3{margin:0;font-size:18px;font-weight:600}.process-row p{margin:0;color:#656c66;line-height:1.6;font-size:14px;max-width:650px}

.house-v3{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:88px;align-items:start}.house-v3-copy{position:sticky;top:100px}.house-v3-copy .text-link{margin-top:24px;color:var(--eh-accent)}.house-record{border-top:1px solid #cfd3cf}.record-row{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center;padding:20px 0;border-bottom:1px solid var(--eh-border)}.record-row svg{color:#737b75}.record-row strong{font-size:14px;font-weight:600}.record-row small{display:block;margin-top:3px;color:#858b86;font-size:11px}.record-row span{font-size:11px;color:#5f6761}.record-row .record-status{color:var(--eh-accent)}

.partner-v3-wrap{background:var(--eh-dark);color:#f6f7f5}.partner-v3{max-width:1220px;margin:0 auto;padding:112px 28px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.8fr);gap:100px}.partner-v3 .editorial-eyebrow{color:#8fd0c9}.partner-v3 h2{font-size:clamp(40px,5vw,68px);line-height:1.02;letter-spacing:-.045em;font-weight:500;margin:0}.partner-v3 p{font-size:16px;line-height:1.65;color:#b8bdb9;max-width:680px}.partner-v3 .btn{margin-top:20px}.partner-facts{border-top:1px solid #343a35;align-self:end}.partner-fact{display:grid;grid-template-columns:1fr auto;gap:20px;padding:23px 0;border-bottom:1px solid #343a35}.partner-fact strong{font-size:14px;font-weight:580}.partner-fact span{color:#aab0ab;font-size:13px}

.final-v3{max-width:1220px;margin:0 auto;padding:110px 28px 120px;display:flex;align-items:flex-end;justify-content:space-between;gap:44px}.final-v3 h2{font-size:clamp(42px,5.5vw,72px);line-height:1.02;letter-spacing:-.05em;font-weight:520;margin:0;max-width:760px}.final-v3 .btn{flex:0 0 auto;min-height:50px;padding:13px 22px}.marketing-v3-footer{border-top:1px solid var(--eh-border);max-width:1440px;margin:0 auto;padding:24px 28px 34px;display:flex;align-items:center;gap:22px}.marketing-v3-footer p{margin-left:auto;font-size:11px;color:#858b86}.marketing-v3-footer nav{display:flex;gap:18px}.marketing-v3-footer nav a{font-size:11px;color:#5d645f}

/* APP SHELL */
.app-shell-v3{background:#fff;min-height:100vh;padding:0}.app-shell-v3 .workspace-shell{display:grid;grid-template-columns:220px minmax(0,1fr);min-height:100vh;background:#fff}.app-shell-v3 .desktop-sidebar{position:sticky;top:0;height:100vh;background:#fff;border-right:1px solid var(--eh-border);padding:20px 12px;display:flex;flex-direction:column;z-index:30}.app-shell-v3 .sidebar-brand{padding:4px 8px 26px}.app-shell-v3 .sidebar-nav{display:flex;flex-direction:column;gap:2px}.app-shell-v3 .sidebar-nav a{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;color:#666e68;font-size:12px;font-weight:560}.app-shell-v3 .sidebar-nav a:hover{background:var(--eh-soft);color:#1f2420}.app-shell-v3 .sidebar-nav a.active{background:var(--eh-soft-2);color:#151a16}.app-shell-v3 .sidebar-icon{width:26px;height:26px;display:grid;place-items:center}.app-shell-v3 .sidebar-chevron{display:none}.app-shell-v3 .sidebar-footer{margin-top:auto;border-top:1px solid var(--eh-border);padding-top:12px}.app-shell-v3 .sidebar-user{display:flex;align-items:center;gap:9px;padding:8px;border-radius:8px}.app-shell-v3 .user-avatar,.app-shell-v3 .top-user-avatar{width:30px;height:30px;border-radius:999px;background:#ecefec;color:#353b36;display:grid;place-items:center;font-size:9px;font-weight:700}.app-shell-v3 .sidebar-user strong,.app-shell-v3 .sidebar-user small{display:block}.app-shell-v3 .sidebar-user strong{font-size:10px;font-weight:600}.app-shell-v3 .sidebar-user small{font-size:8px;color:#5e6862;margin-top:2px}.app-shell-v3 .sidebar-help{display:flex;gap:8px;align-items:center;padding:8px;color:#5e6862;font-size:9px}
.app-shell-v3 .workspace-main{min-width:0}.app-shell-v3 .topbar-v3{height:64px;padding:0 28px;border-bottom:1px solid var(--eh-border);background:var(--eh-surface);position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;z-index:20}.app-shell-v3 .page-context strong,.app-shell-v3 .page-context small{display:block}.app-shell-v3 .page-context strong{font-size:12px;font-weight:620}.app-shell-v3 .page-context small{font-size:9px;color:#8a908b;margin-top:2px}.app-shell-v3 .top-actions{display:flex;align-items:center;gap:8px}.app-shell-v3 .top-actions>a{width:44px;height:44px;border-radius:999px;border:0;background:transparent;display:grid;place-items:center;color:#5e6660}.app-shell-v3 .top-actions>a:hover{background:var(--eh-soft)}.app-shell-v3 .screen-v3{max-width:980px;margin:0 auto;padding:54px 42px 100px}.app-shell-v3 .bottom-nav{display:none}

/* Homeowner home: prompt first, everything else secondary */
.app-shell-v3 .agent-hero{display:block;padding:0 0 26px}.app-shell-v3 .agent-avatar{display:none}.app-shell-v3 .agent-online{font-size:10px;color:var(--eh-accent);font-weight:680;letter-spacing:.02em;text-transform:none}.app-shell-v3 .agent-hero h1{font-size:clamp(34px,4vw,48px);line-height:1.08;letter-spacing:-.04em;font-weight:520;margin:9px 0 10px}.app-shell-v3 .agent-hero p{font-size:14px;line-height:1.6;color:#5f6b63;max-width:690px;margin:0}.app-shell-v3 .agent-chat{background:transparent;border:0;border-radius:0;padding:0;box-shadow:none;gap:12px}.app-shell-v3 .agent-message{max-width:82%;font-size:13px;line-height:1.55;padding:10px 0;border-radius:0;background:transparent;border:0}.app-shell-v3 .agent-message.assistant,.app-shell-v3 .agent-message.event{background:transparent;border:0;color:#242924}.app-shell-v3 .agent-message.user{align-self:flex-end;background:#f1f2ef;border-radius:16px;padding:10px 13px}.app-shell-v3 .message-head{font-size:9px;color:#8a908b;text-transform:none;letter-spacing:0;font-weight:600}.app-shell-v3 .agent-composer{margin-top:8px;border:1px solid #cfd3cf;border-radius:22px;padding:11px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)}.app-shell-v3 .agent-composer textarea{font-size:15px;min-height:72px;padding:8px;border:0}.app-shell-v3 .agent-actions{border-top:0;padding-top:4px}.app-shell-v3 .icon-action{border:0;background:transparent;padding:7px 9px;border-radius:999px;color:#687069}.app-shell-v3 .icon-action:hover{background:var(--eh-soft)}.app-shell-v3 .send-action{background:var(--eh-dark);border-radius:999px;padding:9px 13px}.app-shell-v3 .trust-strip{display:flex;gap:16px;flex-wrap:wrap;margin:14px 0 0}.app-shell-v3 .trust-strip span{border:0;background:transparent;padding:0;font-size:9px;color:#8b918c}.app-shell-v3 .trust-strip svg{width:12px;color:#737b75}.app-shell-v3 .home-insights{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--eh-border);border-bottom:1px solid var(--eh-border);margin-top:42px;gap:0}.app-shell-v3 .home-insights a{border:0;border-radius:0;background:transparent;padding:18px 18px 18px 0}.app-shell-v3 .home-insights a+a{border-left:1px solid var(--eh-border);padding-left:18px}.app-shell-v3 .home-insights small{font-size:9px;color:#8a908b}.app-shell-v3 .home-insights strong{font-size:18px;font-weight:570;margin:4px 0}.app-shell-v3 .home-insights span{font-size:9px;color:#747c76}.app-shell-v3 .section-title{margin:34px 0 10px}.app-shell-v3 .section-title strong{font-size:12px;font-weight:650}.app-shell-v3 .section-title a{font-size:10px;color:#5f6b63}.app-shell-v3 .job-row{border:0;border-top:1px solid var(--eh-border);border-radius:0;padding:15px 0;background:transparent}.app-shell-v3 .stack .job-row:last-child{border-bottom:1px solid var(--eh-border)}.app-shell-v3 .job-row img,.app-shell-v3 .thumb-placeholder{width:44px;height:44px;border-radius:10px;background:var(--eh-soft);color:#5f6b63}.app-shell-v3 .job-row strong{font-size:13px;font-weight:600}.app-shell-v3 .job-row small,.app-shell-v3 .job-row span{font-size:9px}.app-shell-v3 .empty{border:1px dashed #d9dcd8;background:#fafafa;border-radius:12px}

/* General in-app surfaces */
.app-shell-v3 .page-title{font-size:32px;letter-spacing:-.035em;font-weight:540}.app-shell-v3 .page-subtitle{font-size:13px;line-height:1.55}.app-shell-v3 input,.app-shell-v3 textarea,.app-shell-v3 select{border-radius:10px;border-color:#d9dcd8;box-shadow:none}.app-shell-v3 .job-card,.app-shell-v3 .quote,.app-shell-v3 .appointment,.app-shell-v3 .conversation,.app-shell-v3 .document-row,.app-shell-v3 .contact-card,.app-shell-v3 .member-card,.app-shell-v3 .package-card,.app-shell-v3 .plan-card,.app-shell-v3 .house-profile-form,.app-shell-v3 .asset-grid article,.app-shell-v3 .maintenance-row{box-shadow:none;border-color:var(--eh-border);border-radius:12px}.app-shell-v3 .status{border-radius:999px;text-transform:none;letter-spacing:0}.app-shell-v3 .ai-summary{background:var(--eh-soft);border-color:var(--eh-border);border-radius:12px}.app-shell-v3 .secure-card{background:var(--eh-soft);border-color:var(--eh-border);border-radius:12px}

/* Provider: same restraint, light canvas (DESIGN.md §7 — kein Dark-Theme) */
.app-shell-v3.pro-theme{background:#fff}.app-shell-v3.pro-theme .workspace-shell{background:#fff;color:var(--eh-text)}.app-shell-v3.pro-theme .desktop-sidebar{background:#fff;border-color:var(--eh-border)}.app-shell-v3.pro-theme .sidebar-nav a{color:#666e68}.app-shell-v3.pro-theme .sidebar-nav a:hover{background:var(--eh-soft);color:#1f2420}.app-shell-v3.pro-theme .sidebar-nav a.active{background:var(--eh-soft-2);color:#151a16}.app-shell-v3.pro-theme .sidebar-footer{border-color:var(--eh-border)}.app-shell-v3.pro-theme .sidebar-user strong{color:var(--eh-text)}.app-shell-v3.pro-theme .topbar-v3{background:rgba(255,255,255,.94);border-color:var(--eh-border);color:var(--eh-text)}.app-shell-v3.pro-theme .top-actions>a{color:#5e6660}.app-shell-v3.pro-theme .top-actions>a:hover{background:var(--eh-soft)}.app-shell-v3.pro-theme .screen-v3{color:var(--eh-text)}.app-shell-v3.pro-theme .partner-standard-banner{background:transparent;border:0;border-bottom:1px solid var(--eh-border);border-radius:0;padding:0 0 20px}.app-shell-v3.pro-theme .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--eh-border);border-bottom:1px solid var(--eh-border);margin:24px 0 36px}.app-shell-v3.pro-theme .metrics div{background:transparent;border:0;border-radius:0;padding:18px 18px 18px 0}.app-shell-v3.pro-theme .metrics div+div{border-left:1px solid var(--eh-border);padding-left:18px}.app-shell-v3.pro-theme .metrics small{min-height:0;color:var(--eh-muted)}.app-shell-v3.pro-theme .metrics b{font-size:22px;font-weight:540}.app-shell-v3.pro-theme .pro-request{background:transparent;color:var(--eh-text);border-radius:0;border-top:1px solid var(--eh-border);padding:16px 0}.app-shell-v3.pro-theme .stack .pro-request:last-child{border-bottom:1px solid var(--eh-border)}.app-shell-v3.pro-theme .pro-request small{color:var(--eh-muted)}.app-shell-v3.pro-theme .pro-request>svg{color:#737b75}.app-shell-v3.pro-theme .quote-form,.app-shell-v3.pro-theme .pro-form,.app-shell-v3.pro-theme .document-form{background:#fff;border-color:var(--eh-border);border-radius:12px}

@media(max-width:920px){
  .marketing-v3-header nav{display:none}.hero-v3{padding-top:88px}.house-v3,.partner-v3{grid-template-columns:1fr;gap:58px}.house-v3-copy{position:static}.final-v3{align-items:flex-start;flex-direction:column}.app-shell-v3 .workspace-shell{grid-template-columns:190px minmax(0,1fr)}.app-shell-v3 .screen-v3{padding-inline:28px}
}
@media(max-width:720px){
  .marketing-v3-header{height:62px;padding:0 16px}.marketing-v3-login{display:none}.marketing-v3-header .brand small{display:none}.hero-v3{padding:70px 18px 56px}.hero-v3 h1{font-size:50px}.hero-v3-lead{font-size:16px}.hero-v3-actions{align-items:flex-start;flex-direction:column}.prompt-stage{margin-top:48px}.prompt-card{border-radius:18px;padding:14px}.prompt-copy{font-size:15px}.prompt-answer{grid-template-columns:30px 1fr}.statement-strip-inner{padding:22px 18px;overflow:auto;justify-content:flex-start;white-space:nowrap}.editorial-section{padding:78px 18px}.process-row{grid-template-columns:40px 1fr;gap:12px}.process-row p{grid-column:2}.partner-v3{padding:78px 18px}.final-v3{padding:78px 18px}.marketing-v3-footer{padding:22px 18px;flex-wrap:wrap}.marketing-v3-footer p{order:3;width:100%;margin-left:0}

  .app-shell-v3 .workspace-shell{display:block}.app-shell-v3 .desktop-sidebar{display:none}.app-shell-v3 .topbar-v3{height:60px;padding:0 14px}.app-shell-v3 .mobile-brand{display:block}.app-shell-v3 .page-context{display:none}.app-shell-v3 .screen-v3{padding:34px 16px 92px;max-width:none}.app-shell-v3 .bottom-nav{display:grid;position:fixed;bottom:0;left:0;transform:none;width:100%;height:66px;border-radius:0;background:rgba(255,255,255,.97);border-top:1px solid var(--eh-border);z-index:40}.app-shell-v3.pro-theme .bottom-nav{background:rgba(255,255,255,.97);border-color:var(--eh-border)}.app-shell-v3 .agent-hero h1{font-size:34px}.app-shell-v3 .agent-message{max-width:92%}.app-shell-v3 .home-insights{grid-template-columns:1fr}.app-shell-v3 .home-insights a+a{border-left:0;border-top:1px solid var(--eh-border);padding-left:0}.app-shell-v3.pro-theme .metrics{grid-template-columns:1fr 1fr 1fr}.app-shell-v3.pro-theme .metrics div{padding:14px 10px}.app-shell-v3.pro-theme .metrics div+div{padding-left:10px}
}
@media(max-width:420px){.hero-v3 h1{font-size:43px}.prompt-tools .prompt-tool:first-child{display:none}.editorial-section h2,.partner-v3 h2,.final-v3 h2{font-size:40px}.app-shell-v3 .send-action span{display:none}}

/* Intent model: Hausmeisterservice first, then explicitly choose human contact or real job. */
.prompt-options{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}.prompt-options>span{display:grid;grid-template-columns:24px 1fr;column-gap:8px;align-items:center;border:1px solid var(--eh-border);border-radius:12px;padding:10px 12px;color:#414843}.prompt-options svg{grid-row:1 / span 2;color:var(--eh-accent)}.prompt-options b{font-size:11px;font-weight:650}.prompt-options small{font-size:9px;color:#8a908b;margin-top:1px}
.resolution-choice{margin:6px 0 8px;padding-top:16px;border-top:1px solid var(--eh-border)}.resolution-copy{display:flex;justify-content:space-between;gap:16px;align-items:baseline;margin-bottom:10px}.resolution-copy strong{font-size:12px;font-weight:650}.resolution-copy span{font-size:9px;color:#858c86}.resolution-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.resolution-actions form{margin:0}.resolution-button{width:100%;min-height:72px;border:1px solid var(--eh-border);border-radius:14px;background:#fff;color:var(--eh-text);display:grid;grid-template-columns:28px 1fr 18px;gap:9px;align-items:center;text-align:left;padding:12px;cursor:pointer}.resolution-button:hover{background:var(--eh-soft)}.resolution-button>svg:first-child{color:#687069}.resolution-button>svg:last-child{color:#9ba19c}.resolution-button span strong,.resolution-button span small{display:block}.resolution-button span strong{font-size:12px;font-weight:640}.resolution-button span small{font-size:9px;line-height:1.35;color:#858c86;margin-top:3px}.resolution-button.primary-choice{background:var(--eh-dark);border-color:var(--eh-dark);color:#fff}.resolution-button.primary-choice:hover{background:#292f2a}.resolution-button.primary-choice span small,.resolution-button.primary-choice>svg:last-child{color:#b9c0ba}.resolution-button.primary-choice>svg:first-child{color:#dce2dd}
.route-progress{display:flex;align-items:center;gap:10px;margin:4px 0 8px;padding:10px 12px;border-radius:12px;background:var(--eh-soft);border:1px solid var(--eh-border)}.route-progress>span{width:30px;height:30px;border-radius:9px;background:#fff;display:grid;place-items:center;color:var(--eh-accent)}.route-progress strong,.route-progress small{display:block}.route-progress strong{font-size:11px;font-weight:650}.route-progress small{font-size:9px;color:#7d857f;margin-top:2px;line-height:1.4}
.contact-request-note,.contact-to-service{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--eh-border);border-radius:12px;padding:14px 16px;background:var(--eh-soft)}.contact-request-note>svg{flex:0 0 auto;color:var(--eh-accent)}.contact-request-note strong,.contact-to-service strong{font-size:12px;font-weight:650}.contact-request-note p,.contact-to-service p{font-size:10px;line-height:1.5;color:#5f6b63;margin:4px 0 0}.contact-to-service{margin-top:22px;align-items:center;justify-content:space-between}.contact-to-service>div{max-width:580px}.contact-to-service form{margin:0;flex:0 0 auto}
.app-shell-v3.pro-theme .contact-request-note{background:var(--eh-soft);border-color:var(--eh-border)}.app-shell-v3.pro-theme .contact-request-note p{color:#5f6b63}.app-shell-v3.pro-theme .contact-request-note>svg{color:var(--eh-accent)}
@media(max-width:720px){.resolution-copy{display:block}.resolution-copy span{display:block;margin-top:3px}.resolution-actions,.prompt-options{grid-template-columns:1fr}.contact-to-service{align-items:flex-start;flex-direction:column}.contact-to-service form,.contact-to-service .btn{width:100%}}


/* Mobile app + customer-benefit marketing v4 */
html{-webkit-text-size-adjust:100%}
button,a,input,textarea,select{touch-action:manipulation}
.customer-first .customer-hero{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(340px,.72fr);gap:88px;align-items:end}
.customer-first .customer-hero .hero-v3-copy{max-width:820px}
.customer-first .customer-hero h1{font-size:clamp(54px,6.6vw,92px);max-width:900px}
.customer-first .hero-v3-lead{max-width:720px}
.benefit-preview{border-top:1px solid var(--eh-border);border-bottom:1px solid var(--eh-border);padding:22px 0 10px;margin-bottom:8px}
.benefit-preview-head small,.benefit-preview-head strong{display:block}.benefit-preview-head small{font-size:10px;color:#8a908b;text-transform:uppercase;letter-spacing:.07em;font-weight:700}.benefit-preview-head strong{font-size:20px;line-height:1.3;font-weight:570;margin-top:7px}
.benefit-preview-path{margin-top:20px;display:flex;flex-direction:column}.benefit-preview-path>span{display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;padding:14px 0;border-top:1px solid var(--eh-border);align-items:start}.benefit-preview-path svg{width:18px;color:var(--eh-accent);margin-top:1px}.benefit-preview-path b,.benefit-preview-path small{display:block}.benefit-preview-path b{font-size:12px;font-weight:650}.benefit-preview-path small{font-size:10px;color:#7b827d;line-height:1.45;margin-top:3px}.benefit-preview-foot{font-size:10px;color:#727a74;padding:8px 0 2px}
.customer-outcome{max-width:1220px;margin:0 auto;padding:30px 28px 112px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:90px}.customer-outcome h2{font-size:clamp(36px,4.7vw,62px);line-height:1.04;letter-spacing:-.045em;font-weight:520;margin:0}.outcome-list{border-top:1px solid var(--eh-border)}.outcome-list p{margin:0;padding:20px 0;border-bottom:1px solid var(--eh-border);display:grid;grid-template-columns:210px minmax(0,1fr);gap:26px}.outcome-list strong{font-size:13px;font-weight:630}.outcome-list span{font-size:12px;line-height:1.55;color:#6d756f}
.pwa-install-card{display:flex;align-items:center;gap:12px;border:1px solid var(--eh-border);background:var(--eh-soft);border-radius:12px;padding:12px 13px;margin:12px 0 20px}.pwa-install-icon{width:36px;height:36px;border-radius:10px;background:white;display:grid;place-items:center;color:var(--eh-accent);flex:0 0 auto}.pwa-install-icon svg{width:18px}.pwa-install-card strong{display:block;font-size:11px;font-weight:650}.pwa-install-card p{font-size:9px;line-height:1.45;color:#5f6b63;margin:3px 0 0}.pwa-install-card .btn{font-size:9px;min-height:36px;padding:8px 10px}.pwa-install-hint{width:34px;height:34px;border:1px solid var(--eh-border);border-radius:10px;display:grid;place-items:center;color:#6a726c}.pwa-install-card.dark{background:#151b16;border-color:var(--eh-dark-border);color:white}.pwa-install-card.dark .pwa-install-icon{background:#202721;color:#8fd0c9}.pwa-install-card.dark p{color:#9ba49d}.pwa-install-card.dark .pwa-install-hint{border-color:var(--eh-dark-border);color:#abb5ad}.pwa-install-card.dark .btn{color:white;border-color:var(--eh-dark-border)}
@media(display-mode:standalone){body{overscroll-behavior-y:none}.app-shell-v3 .topbar-v3{user-select:none}}
@media(max-width:920px){.customer-first .customer-hero{grid-template-columns:1fr;gap:54px;align-items:start}.benefit-preview{max-width:680px}.customer-outcome{grid-template-columns:1fr;gap:42px}}
@media(max-width:720px){
  body{overscroll-behavior-y:contain}
  .customer-first .hero-v3{padding-top:56px}.customer-first .customer-hero{gap:44px}.customer-first .customer-hero h1{font-size:47px;line-height:1.01}.customer-first .hero-v3-lead{font-size:16px;line-height:1.55}.benefit-preview-head strong{font-size:18px}.statement-strip-inner{scrollbar-width:none}.statement-strip-inner::-webkit-scrollbar{display:none}.customer-outcome{padding:20px 18px 78px}.customer-outcome h2{font-size:39px}.outcome-list p{grid-template-columns:1fr;gap:5px;padding:17px 0}
  .auth-page{padding:calc(22px + env(safe-area-inset-top)) 16px calc(22px + env(safe-area-inset-bottom));min-height:100dvh}.auth-card{border-radius:18px;padding:22px;box-shadow:none;border:1px solid var(--eh-border)}
  .app-shell-v3 .topbar-v3{height:calc(56px + env(safe-area-inset-top));padding:env(safe-area-inset-top) 14px 0}
  .app-shell-v3 .screen-v3{padding:26px 14px calc(96px + env(safe-area-inset-bottom));min-height:calc(100dvh - 56px)}
  .app-shell-v3 .bottom-nav{height:calc(64px + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);grid-template-columns:repeat(5,1fr)}
  .app-shell-v3 .bottom-nav a{min-height:58px;justify-content:center;gap:3px;font-size:9px;padding-top:5px;color:#5e6862}
  .app-shell-v3 .bottom-nav a svg{width:19px;height:19px}
  .app-shell-v3 input,.app-shell-v3 textarea,.app-shell-v3 select,.auth-card input,.auth-card textarea,.auth-card select{font-size:16px}
  .app-shell-v3 .btn{min-height:44px}.app-shell-v3 .icon-action{min-height:44px}.app-shell-v3 .send-action{min-height:44px}
  .app-shell-v3 .agent-hero{padding-bottom:20px}.app-shell-v3 .agent-hero h1{font-size:31px}.app-shell-v3 .agent-hero p{font-size:13px}
  .app-shell-v3 .agent-chat{gap:10px}.app-shell-v3 .agent-message{font-size:13px;max-width:94%}.app-shell-v3 .agent-composer{border-radius:18px;padding:9px;margin-top:6px}.app-shell-v3 .agent-composer textarea{min-height:76px}
  .app-shell-v3 .page-title{font-size:29px}.app-shell-v3 .page-subtitle{font-size:12px}
  .pwa-install-card{align-items:flex-start}.pwa-install-card .btn{flex:0 0 auto}
}
@media(max-width:420px){.customer-first .customer-hero h1{font-size:43px}.benefit-preview{margin-inline:0}.marketing-v3-actions .btn{padding-inline:13px}.pwa-install-card{flex-wrap:wrap}.pwa-install-card .btn{width:100%}}


/* Einfach Hausen — visual board v5: customer-first mobile product */
:root{--eh-brand:#0d4448;--eh-brand-2:#105258;--eh-lime:#8fd0c9;--eh-mint:#eef6ed;--eh-card:#ffffff;--eh-shadow:0 8px 26px rgba(19,48,30,.06)}
.app-shell-v3:not(.pro-theme) .screen-v3{max-width:860px}
.soft-kicker{display:block;font-size:10px;color:var(--eh-brand-2);font-weight:750;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.round-add{width:38px;height:38px;border-radius:999px;border:1px solid var(--eh-border);display:grid;place-items:center;color:var(--eh-brand);background:#fff;flex:0 0 auto}.round-add svg{width:18px}

/* Customer start */
.mobile-home-head{margin:2px 0 26px}.mobile-home-head h1{font-size:clamp(36px,4.5vw,50px);line-height:1.08;letter-spacing:-.045em;font-weight:540;margin:0;max-width:650px}.service-entry-card{display:flex;gap:14px;align-items:center;padding:18px;border:1px solid #dfe6df;background:#fff;border-radius:18px;box-shadow:var(--eh-shadow)}.service-entry-card>div{flex:1;min-width:0}.service-entry-card small,.service-entry-card strong,.service-entry-card p{display:block}.service-entry-card small{font-size:9px;color:#7e8881;text-transform:uppercase;letter-spacing:.06em;font-weight:700}.service-entry-card strong{font-size:17px;font-weight:590;margin-top:5px}.service-entry-card p{font-size:11px;line-height:1.45;color:#778078;margin:5px 0 0}.service-entry-action{width:46px;height:46px;border-radius:14px;background:#7fa8a2;color:white;display:grid;place-items:center;flex:0 0 auto}.quick-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:28px 0 12px}.quick-section-head strong{font-size:12px;font-weight:680}.quick-section-head a,.quick-section-head>span{font-size:9px;color:#7d867f;display:flex;align-items:center}.quick-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.quick-action-grid a{position:relative;min-height:118px;border:1px solid var(--eh-border);border-radius:17px;background:#fff;padding:16px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 18px rgba(20,45,30,.035)}.quick-action-grid a>span{width:36px;height:36px;border-radius:11px;background:var(--eh-mint);display:grid;place-items:center;color:var(--eh-brand)}.quick-action-grid strong{font-size:12px;line-height:1.25;max-width:110px}.quick-action-grid a>svg{position:absolute;right:13px;bottom:15px;color:#a6ada8;width:14px}.dashboard-facts{display:grid;grid-template-columns:repeat(3,1fr);margin:22px 0 4px;border-top:1px solid var(--eh-border);border-bottom:1px solid var(--eh-border)}.dashboard-facts a{padding:15px 12px 15px 0}.dashboard-facts a+a{border-left:1px solid var(--eh-border);padding-left:12px}.dashboard-facts span,.dashboard-facts small{display:block}.dashboard-facts span{font-size:22px;font-weight:570;letter-spacing:-.04em}.dashboard-facts small{font-size:8px;color:#818982;margin-top:3px}.next-card,.offer-summary-card,.home-memory-strip{border:1px solid var(--eh-border);border-radius:16px;background:#fff;display:flex;align-items:center;gap:12px;padding:14px;box-shadow:0 4px 18px rgba(20,45,30,.025)}.next-card-icon{width:48px;height:48px;border-radius:12px;background:var(--eh-mint);display:grid;place-items:center;color:var(--eh-brand);flex:0 0 auto}.next-card small,.next-card strong,.next-card p{display:block}.next-card small{font-size:8px;color:#7d867f;text-transform:uppercase;font-weight:700;letter-spacing:.05em}.next-card strong{font-size:12px;margin-top:3px}.next-card p{font-size:9px;color:#777f79;margin:3px 0 0}.next-card>svg{width:16px;color:#9ba29d}.offer-summary-card{margin-top:10px}.offer-summary-card>div:first-child{flex:1}.offer-summary-card small,.offer-summary-card strong,.offer-summary-card p{display:block}.offer-summary-card small{font-size:8px;color:#7e8780;text-transform:uppercase;font-weight:700}.offer-summary-card strong{font-size:12px;margin-top:4px}.offer-summary-card p{font-size:9px;color:#788179;margin:4px 0 0}.offer-summary-price{display:grid;grid-template-columns:auto auto;align-items:end;column-gap:4px;color:var(--eh-brand)}.offer-summary-price b{font-size:16px}.offer-summary-price span{font-size:8px;color:#7d867f}.offer-summary-price svg{grid-column:1/-1;justify-self:end;width:15px;color:#98a09a;margin-top:4px}.home-memory-strip{margin-top:12px}.home-memory-strip>svg:first-child{color:var(--eh-brand)}.home-memory-strip strong{font-size:11px}.home-memory-strip p{font-size:9px;color:#5f6b63;margin:3px 0 0}.home-memory-strip>svg:last-child{color:#a1a8a2}

/* Dedicated housemaster chat */
.housemaster-panel{background:linear-gradient(160deg,#0d4448 0%,#0d4448 100%);color:#fff;border-radius:24px;padding:28px;min-height:680px}.housemaster-panel .housemaster-hero{padding-bottom:24px}.housemaster-panel .agent-online{color:#9fcfd2}.housemaster-panel .agent-hero h1{color:#fff;font-size:34px}.housemaster-panel .agent-hero p{color:#c9ddd0}.housemaster-panel .agent-chat{display:flex;flex-direction:column;min-height:500px}.housemaster-panel .agent-message.assistant,.housemaster-panel .agent-message.event{color:#fff;background:rgba(255,255,255,.09);padding:11px 13px;border-radius:14px;max-width:76%}.housemaster-panel .agent-message.user{background:#7fa8a2;color:#fff;border-radius:14px;padding:11px 13px}.housemaster-panel .message-head{color:#9fcfd2}.housemaster-panel .agent-message.user .message-head{color:#dcebec}.housemaster-panel .agent-composer{margin-top:auto;background:rgba(0,0,0,.08);border:1px solid rgba(255,255,255,.23);box-shadow:none}.housemaster-panel .agent-composer textarea{background:transparent;color:#fff}.housemaster-panel .agent-composer textarea::placeholder{color:#8fd0c9}.housemaster-panel .icon-action{color:#d0e1d5}.housemaster-panel .icon-action:hover{background:rgba(255,255,255,.08)}.housemaster-panel .send-action{background:#fff;color:var(--eh-brand)}.housemaster-panel .resolution-choice{border-color:rgba(255,255,255,.18)}.housemaster-panel .resolution-copy span{color:#b6cabc}.housemaster-panel .resolution-button{border-color:rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff}.housemaster-panel .resolution-button:hover{background:rgba(255,255,255,.13)}.housemaster-panel .resolution-button span small{color:#c3d4c8}.housemaster-panel .resolution-button>svg{color:#c9dbcf}.housemaster-panel .resolution-button.primary-choice{background:#fff;color:var(--eh-brand);border-color:#fff}.housemaster-panel .resolution-button.primary-choice span small{color:#1b8569}.housemaster-panel .resolution-button.primary-choice>svg{color:#1b8569}.housemaster-panel .route-progress{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.18)}.housemaster-panel .route-progress>span{background:rgba(255,255,255,.12);color:#fff}.housemaster-panel .route-progress small{color:#bcd0c2}.housemaster-panel .trust-strip span{color:#bed0c4}.housemaster-panel .trust-strip svg{color:#8fd0c9}

/* My home board */
.house-screen-head,.year-head,.jobs-head{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:18px}.house-screen-head h1,.year-head h1,.jobs-head h1{font-size:32px;letter-spacing:-.04em;font-weight:560;margin:0}.house-screen-head p,.year-head p,.jobs-head p{font-size:11px;color:#778079;margin:5px 0 0}.house-cover-card{position:relative;overflow:hidden;min-height:220px;border-radius:20px;background:linear-gradient(140deg,#7fa8a2,#d7ded6 55%,#1b8569);margin-bottom:14px}.house-cover-art{position:absolute;inset:0;display:grid;place-items:center}.house-cover-art>svg{width:112px;height:112px;color:rgba(255,255,255,.92);filter:drop-shadow(0 8px 12px rgba(0,0,0,.12))}.house-roof-line{position:absolute;width:180px;height:3px;background:rgba(255,255,255,.45);transform:rotate(-18deg);top:76px}.house-cover-card:after{content:'';position:absolute;inset:45% 0 0;background:linear-gradient(transparent,rgba(2,30,17,.73))}.house-cover-copy{position:absolute;z-index:2;left:18px;right:18px;bottom:16px;color:#fff}.house-cover-copy small,.house-cover-copy strong,.house-cover-copy span{display:block}.house-cover-copy small{font-size:9px;opacity:.8}.house-cover-copy strong{font-size:16px;margin-top:3px}.house-cover-copy span{font-size:9px;margin-top:3px;opacity:.9}.house-menu{border:1px solid var(--eh-border);border-radius:16px;background:#fff;overflow:hidden}.house-menu>a,.house-menu>details>summary,.house-menu-disabled{display:flex;align-items:center;gap:11px;padding:14px 15px;list-style:none}.house-menu>a+a,.house-menu>details+*,.house-menu-disabled{border-top:1px solid var(--eh-border)}.house-menu details summary::-webkit-details-marker{display:none}.house-menu details[open] summary{background:#f8faf8}.house-menu-icon{width:32px;height:32px;border-radius:9px;background:var(--eh-mint);display:grid;place-items:center;color:var(--eh-brand);flex:0 0 auto}.house-menu-icon svg{width:17px}.house-menu strong,.house-menu small{display:block}.house-menu strong{font-size:11px}.house-menu small{font-size:8px;color:#5f6b63;margin-top:2px}.house-menu>a>svg,.house-menu summary>svg{width:15px;color:#a4aba5}.soon-pill{font-size:7px;border-radius:999px;padding:3px 6px;background:#f0f2f0;color:#5f6b63}.house-inline-form{margin:0 14px 14px;background:#fafbfa}.year-preview-card{display:flex;align-items:center;gap:10px;margin-top:14px;padding:15px;border-radius:16px;background:#f2f8f0;border:1px solid #dce9da}.year-preview-card>div{flex:1}.year-preview-card small,.year-preview-card strong,.year-preview-card p{display:block}.year-preview-card small{font-size:8px;color:#146a58;text-transform:uppercase;font-weight:750}.year-preview-card strong{font-size:12px;margin-top:4px}.year-preview-card p{font-size:9px;color:#5f6b63;margin:4px 0 0}.year-preview-card>svg{width:16px;color:#7b887e}

/* Year timeline */
.segmented-tabs{display:flex;border-bottom:1px solid var(--eh-border);margin-bottom:20px}.segmented-tabs a{position:relative;padding:10px 18px 11px;font-size:11px;color:#879088;font-weight:600}.segmented-tabs a.active{color:var(--eh-brand)}.segmented-tabs a.active:after{content:'';position:absolute;height:2px;left:0;right:0;bottom:-1px;background:var(--eh-brand);border-radius:3px}.year-timeline{display:flex;flex-direction:column}.year-row{display:grid;grid-template-columns:42px 28px minmax(0,1fr);gap:8px;align-items:stretch;min-height:72px}.year-month{font-size:8px;font-weight:750;color:#6e7a72;text-transform:uppercase;padding-top:16px}.timeline-dot{position:relative;width:24px;height:24px;margin-top:11px;border-radius:999px;border:1px solid #9fcfd2;background:#fff;color:var(--eh-brand);display:grid;place-items:center;z-index:1}.timeline-dot svg{width:12px}.timeline-dot:after{content:'';position:absolute;width:1px;background:#dce4dd;top:23px;height:62px;left:11px;z-index:-1}.year-row:last-child .timeline-dot:after{display:none}.timeline-dot.done{background:var(--eh-brand);color:white;border-color:var(--eh-brand)}.year-item{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--eh-border);padding:12px 0}.year-item strong,.year-item small{display:block}.year-item strong{font-size:11px}.year-item small{font-size:8px;color:#7c857e;margin-top:4px}.year-item>svg{width:15px;color:#97a099}.year-cta{margin-top:22px}

/* Jobs */
.job-tabs{margin-top:12px}.mobile-job-list{display:flex;flex-direction:column;gap:10px}.mobile-job-card{border:1px solid var(--eh-border);border-radius:16px;background:#fff;padding:14px;box-shadow:0 3px 14px rgba(20,45,30,.025)}.mobile-job-top{display:flex;justify-content:space-between;align-items:center}.job-type-icon{width:32px;height:32px;border-radius:10px;background:var(--eh-mint);display:grid;place-items:center;color:var(--eh-brand)}.job-type-icon.contact{background:#eef2ff;color:#5268a0}.job-type-icon svg{width:16px}.mobile-job-card>strong{display:block;font-size:13px;margin-top:10px}.mobile-job-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:7px}.mobile-job-meta span{display:flex;align-items:center;gap:4px;font-size:8px;color:#79827b}.mobile-job-meta svg{width:12px}.mobile-job-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--eh-border);margin-top:11px;padding-top:10px}.mobile-job-foot small,.mobile-job-foot b{display:block}.mobile-job-foot small{font-size:8px;color:#7a837c}.mobile-job-foot b{font-size:11px;color:var(--eh-brand);margin-top:2px}.mobile-job-foot>svg{width:16px;color:#99a19a}

/* Partner profile & quote comparison */
.inline-back{display:inline-flex;align-items:center;gap:6px;font-size:10px;color:#78817a;margin-bottom:14px}.inline-back svg{width:15px}.partner-profile-hero{border:1px solid var(--eh-border);border-radius:18px;overflow:hidden;background:#fff}.partner-profile-cover{height:150px;background:linear-gradient(140deg,#1b8569,#174b50);display:grid;place-items:center;position:relative;color:#fff}.partner-profile-cover>span{font-size:54px;font-weight:650;letter-spacing:-.06em;opacity:.9}.partner-profile-cover>svg{position:absolute;right:14px;top:14px}.partner-profile-main{padding:16px}.verified-partner{display:inline-flex;align-items:center;gap:5px;font-size:8px;background:#eaf5e8;color:#1b8569;border-radius:999px;padding:5px 8px;font-weight:700}.verified-partner svg{width:13px}.partner-profile-main h1{font-size:23px;letter-spacing:-.035em;margin:10px 0 4px}.partner-rating{display:flex;align-items:center;gap:5px;font-size:10px;color:#788079}.partner-rating svg{width:14px;color:#e6a928}.partner-rating b{color:#202521}.partner-profile-main>p{font-size:11px;line-height:1.55;color:#69736b}.partner-tags{display:flex;flex-wrap:wrap;gap:5px}.partner-tags span{font-size:8px;background:#f3f5f3;border-radius:999px;padding:5px 8px;color:#647067}.profile-facts{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--eh-border);border-radius:15px;margin:12px 0;overflow:hidden}.profile-facts>div{display:flex;gap:7px;align-items:center;padding:12px}.profile-facts>div+div{border-left:1px solid var(--eh-border)}.profile-facts svg{width:16px;color:var(--eh-brand)}.profile-facts small,.profile-facts strong{display:block}.profile-facts small{font-size:7px;color:#858e87}.profile-facts strong{font-size:9px;margin-top:2px}.partner-quality-list{border-top:1px solid var(--eh-border)}.partner-quality-list>div{display:flex;justify-content:space-between;gap:20px;padding:11px 0;border-bottom:1px solid var(--eh-border);font-size:10px}.partner-quality-list b{color:var(--eh-brand);font-weight:650}.review-list{display:flex;flex-direction:column;gap:8px}.review-list article{border:1px solid var(--eh-border);border-radius:12px;padding:11px}.review-list article>div{display:flex;justify-content:space-between;font-size:9px}.review-list article p{font-size:9px;color:#6e7971;margin:5px 0 0}.partner-return{margin-top:16px}.quote-partner-link{display:flex;align-items:center;gap:7px}.quote-partner-link span{font-size:8px;color:var(--eh-brand);font-weight:650}.inline-partner-link{color:var(--eh-brand);font-weight:650}.app-shell-v3 .quote{padding:16px;border-radius:16px}.app-shell-v3 .quote-top b{font-size:18px;color:var(--eh-brand)}.app-shell-v3 .quote>p{font-size:10px;line-height:1.55}.app-shell-v3 .partner-standards{margin:10px 0}.app-shell-v3 .partner-standards span{border-radius:999px;padding:5px 8px}.app-shell-v3 .recommend{background:#f2f8ee;color:#1b8569;border:1px solid #dcebd6;border-radius:999px}.app-shell-v3 .compare-badge{border-radius:999px}
.quote-scope-notes{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.quote-scope-notes span{font-size:8px;color:#7b6234;background:#fff8e9;border:1px solid #eee0bd;border-radius:999px;padding:5px 7px}.emergency-facts{display:flex;flex-wrap:wrap;gap:6px;margin:9px 0}.emergency-facts span{font-size:8px;color:#5f6962;background:#f4f7f4;border-radius:999px;padding:5px 8px}.emergency-facts strong{font-weight:700;color:#273229}

/* Profile/settings */
.profile-identity{display:flex;gap:13px;align-items:center;padding-bottom:22px;border-bottom:1px solid var(--eh-border)}.profile-avatar-large{width:58px;height:58px;border-radius:999px;background:linear-gradient(145deg,#e2eee0,#9fcfd2);color:var(--eh-brand);display:grid;place-items:center;font-size:17px;font-weight:750}.profile-identity h1{font-size:21px;margin:0;letter-spacing:-.03em}.profile-identity p{font-size:10px;color:#5c6660;margin:4px 0 0}.settings-list{border:1px solid var(--eh-border);border-radius:16px;overflow:hidden;margin:18px 0}.settings-list>a,.settings-list>div,.settings-list>details>summary{display:flex;align-items:center;gap:11px;padding:14px 15px;list-style:none}.settings-list>a+*,.settings-list>div+*,.settings-list>details+*{border-top:1px solid var(--eh-border)}.settings-list details summary::-webkit-details-marker{display:none}.settings-list>details[open]>summary{background:#fafbfa}.settings-list span:first-child{width:28px;height:28px;border-radius:8px;background:#f3f5f3;display:grid;place-items:center;color:#5d685f}.settings-list span svg{width:15px}.settings-list strong{font-size:10px;font-weight:620;flex:1}.settings-list small{font-size:8px;color:#929a94}.settings-list>a>svg,.settings-list summary>svg{width:15px;color:#a3aaa5}.settings-form{margin:0 14px 14px;padding-top:12px;border-top:1px solid var(--eh-border)}.profile-trust{display:flex;gap:10px;align-items:flex-start;background:#f7faf6;border:1px solid var(--eh-border);border-radius:12px;padding:12px;margin:12px 0}.profile-trust>svg{color:var(--eh-brand);width:17px}.profile-trust strong,.profile-trust small{display:block}.profile-trust strong{font-size:9px}.profile-trust small{font-size:8px;line-height:1.45;color:#5f6b63;margin-top:3px}

/* Package screen closer to visual board */
.app-shell-v3 .plans-hero{background:transparent;color:var(--eh-text);border:0;border-radius:0;padding:0;margin-bottom:20px}.app-shell-v3 .plans-hero>svg{display:none}.app-shell-v3 .plans-hero h1{font-size:31px;color:var(--eh-text);font-weight:560;letter-spacing:-.04em}.app-shell-v3 .plans-hero p{font-size:11px;color:#768079;max-width:520px}.app-shell-v3 .plan-grid{gap:12px}.app-shell-v3 .plan-card{padding:17px;border-radius:17px}.app-shell-v3 .plan-card.featured{border-color:#8fd0c9;box-shadow:0 0 0 1px #dfeedd inset}.app-shell-v3 .plan-price{color:var(--eh-brand)}.app-shell-v3 .package-card{border-radius:16px;padding:15px}

@media(max-width:720px){
  .app-shell-v3:not(.pro-theme) .bottom-nav{grid-template-columns:repeat(5,1fr)}
  .app-shell-v3:not(.pro-theme) .bottom-nav a{font-size:9px;color:#737d75}.app-shell-v3:not(.pro-theme) .bottom-nav a.active{color:var(--eh-brand);font-weight:700}
  .app-shell-v3:not(.pro-theme) .topbar-v3{border-bottom:0}.app-shell-v3:not(.pro-theme) .topbar-v3 .brand small{display:none}.app-shell-v3:not(.pro-theme) .top-user-avatar{background:#f0f3f0}
  .mobile-home-head{margin-top:6px}.mobile-home-head h1{font-size:29px;line-height:1.13}.service-entry-card{padding:14px;border-radius:15px}.service-entry-card strong{font-size:14px}.quick-action-grid a{min-height:104px;padding:13px}.dashboard-facts span{font-size:19px}
  main:has(.housemaster-panel) .screen-v3{padding:0 0 calc(64px + env(safe-area-inset-bottom));background:var(--eh-brand)}main:has(.housemaster-panel) .topbar-v3{background:var(--eh-brand);color:white;border:0}main:has(.housemaster-panel) .top-actions>a{color:white}main:has(.housemaster-panel) .top-user-avatar{background:rgba(255,255,255,.13);color:white}main:has(.housemaster-panel) .mobile-brand .brand{color:white}main:has(.housemaster-panel) .bottom-nav{background:rgba(3,54,29,.97);border-color:rgba(255,255,255,.13)}main:has(.housemaster-panel) .bottom-nav a{color:#8fd0c9}main:has(.housemaster-panel) .bottom-nav a.active{color:#fff}.housemaster-panel{border-radius:0;min-height:calc(100dvh - 56px);padding:20px 14px 90px}.housemaster-panel .agent-hero h1{font-size:26px}.housemaster-panel .agent-message.assistant{max-width:88%}.housemaster-panel .resolution-actions{grid-template-columns:1fr}.housemaster-panel .agent-chat{min-height:calc(100dvh - 245px)}
  .house-screen-head h1,.year-head h1,.jobs-head h1{font-size:27px}.house-cover-card{min-height:190px;border-radius:17px}.house-menu{border-radius:14px}.profile-facts{grid-template-columns:1fr}.profile-facts>div+div{border-left:0;border-top:1px solid var(--eh-border)}
  .year-row{grid-template-columns:38px 26px minmax(0,1fr)}.segmented-tabs a{flex:1;text-align:center;padding-inline:8px}.mobile-job-card{border-radius:14px}
  .app-shell-v3 .plan-grid{grid-template-columns:1fr}.app-shell-v3 .plans-hero h1{font-size:28px}.app-shell-v3 .package-card{flex-wrap:wrap}.app-shell-v3 .package-buy{width:100%;flex-direction:row;align-items:center;justify-content:space-between}
}

/* Einfach Hausen — premium customer marketing v6 */
.premium-marketing{
  --premium-ink:#102018;
  --premium-muted:#667169;
  --premium-green:#105258;
  --premium-green-deep:#105258;
  --premium-mint:#eff7f1;
  --premium-warm:#faf9f6;
  --premium-line:#e2e8e3;
  overflow:hidden;
}
.premium-header{max-width:1320px;border-bottom:0;position:relative}
.premium-header:after{content:'';position:absolute;left:28px;right:28px;bottom:0;height:1px;background:var(--premium-line)}
.premium-header .brand strong{font-size:14px;letter-spacing:-.02em}
.premium-header nav a{font-weight:560;color:#536059;transition:color .15s ease}.premium-header nav a:hover{color:var(--premium-ink)}
.premium-header .btn.primary,.premium-primary{background:var(--premium-green-deep);box-shadow:0 8px 18px rgba(7,84,47,.12)}
.premium-header .btn.primary:hover,.premium-primary:hover{background:#1c2129}
.premium-hero{max-width:1320px;padding:92px 28px 96px;grid-template-columns:minmax(0,1.05fr) minmax(390px,.72fr)!important;gap:82px!important;align-items:center!important}
.hero-badge{display:inline-flex;align-items:center;gap:7px;border:1px solid #dce7df;background:#f6faf7;color:var(--premium-green-deep);border-radius:999px;padding:7px 10px;font-size:11px;font-weight:650;margin-bottom:24px}
.premium-hero h1{font-size:clamp(52px,6.15vw,86px)!important;line-height:.99!important;letter-spacing:-.058em!important;font-weight:535!important;color:var(--premium-ink);max-width:860px!important}
.premium-hero h1 span{color:var(--premium-green)}
.premium-hero .hero-v3-lead{font-size:clamp(17px,1.7vw,20px);line-height:1.58;color:var(--premium-muted);max-width:760px}
.premium-hero .hero-v3-actions{margin-top:30px;gap:20px}
.premium-primary{min-height:50px!important;padding:13px 20px!important}
.secondary-cta{display:inline-flex;align-items:center;gap:5px;color:#46534b;font-size:13px;font-weight:620;padding:10px 0}
.hero-trust{display:flex;flex-wrap:wrap;gap:18px;margin-top:24px;color:#6f7972}.hero-trust span{display:inline-flex;align-items:center;gap:6px;font-size:10px}.hero-trust svg{color:var(--premium-green)}
.service-demo{background:#fff;border:1px solid #dfe6e1;border-radius:26px;padding:22px;box-shadow:0 30px 80px rgba(20,50,32,.10),0 2px 6px rgba(20,50,32,.04);position:relative}
.service-demo:before{content:'';position:absolute;inset:-28px -36px auto auto;width:170px;height:170px;background:radial-gradient(circle,#dfeee4 0,rgba(223,238,228,0) 68%);z-index:-1}
.service-demo-top{display:flex;align-items:center;gap:10px;padding-bottom:17px;border-bottom:1px solid var(--premium-line)}
.demo-house-icon{width:40px;height:40px;border-radius:12px;background:var(--premium-mint);color:var(--premium-green-deep);display:grid;place-items:center}.service-demo-top>div:nth-child(2){flex:1}.service-demo-top small,.service-demo-top strong{display:block}.service-demo-top small{font-size:8px;letter-spacing:.06em;text-transform:uppercase;color:#8b948e;font-weight:750}.service-demo-top strong{font-size:12px;margin-top:3px}.demo-status{font-size:8px;font-weight:700;color:var(--premium-green-deep);background:#eaf6ee;border-radius:999px;padding:5px 8px}
.demo-question{margin:18px 0;background:#f7f9f7;border:1px solid #edf0ed;border-radius:15px;padding:13px 14px}.demo-question small{display:block;font-size:8px;color:#89928c;text-transform:uppercase;letter-spacing:.05em;font-weight:750}.demo-question p{font-size:13px;line-height:1.5;margin:5px 0 0;color:#303a33}
.demo-route{padding:3px 3px 2px}.demo-route-item{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center}.demo-route-item>span{width:34px;height:34px;border-radius:11px;background:#f2f5f3;color:#758078;display:grid;place-items:center}.demo-route-item.active>span{background:#e7f4eb;color:var(--premium-green)}.demo-route-item b,.demo-route-item small{display:block}.demo-route-item b{font-size:11px}.demo-route-item small{font-size:8px;color:#838c86;margin-top:2px;line-height:1.45}.demo-route-line{height:16px;width:1px;background:#dfe5e0;margin:3px 0 3px 16px}.demo-note{display:flex;align-items:center;gap:6px;border-top:1px solid var(--premium-line);margin-top:16px;padding-top:15px;color:#617068;font-size:9px}.demo-note svg{color:var(--premium-green)}
.service-ways-wrap{background:var(--premium-warm);border-top:1px solid #efede8;border-bottom:1px solid #efede8}.service-ways{max-width:1320px;margin:0 auto;padding:96px 28px}.section-heading-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.52fr);gap:80px;align-items:end}.section-heading-row h2{font-size:clamp(38px,4.6vw,62px);line-height:1.03;letter-spacing:-.045em;font-weight:530;margin:0;max-width:800px}.section-heading-row>p{font-size:13px;line-height:1.65;color:#727970;margin:0;max-width:430px}
.service-way-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:48px}.service-way-card{min-height:300px;background:white;border:1px solid #e7e5df;border-radius:20px;padding:24px;display:flex;flex-direction:column;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}.service-way-card:hover{transform:translateY(-3px);border-color:#d8dfd8;box-shadow:0 18px 50px rgba(27,50,34,.07)}.service-way-icon{width:44px;height:44px;border-radius:13px;background:var(--premium-mint);display:grid;place-items:center;color:var(--premium-green-deep)}.service-way-card h3{font-size:20px;letter-spacing:-.025em;font-weight:600;margin:34px 0 10px}.service-way-card p{font-size:12px;line-height:1.6;color:#737b75;margin:0;max-width:310px}.service-way-card a{display:inline-flex;align-items:center;gap:5px;margin-top:auto;padding-top:24px;font-size:11px;font-weight:650;color:var(--premium-green-deep)}
.process-section{max-width:1320px;padding-top:108px;padding-bottom:108px}.process-section h2{max-width:780px}.process-section .process-list{margin-top:54px}.process-section .process-row{grid-template-columns:70px minmax(180px,.5fr) minmax(0,1fr);padding:25px 0}.process-section .process-row h3{font-size:17px}.process-section .process-row p{font-size:13px}
.premium-house{max-width:1320px;background:#f4f8f4;border-radius:32px;padding:76px!important;margin-top:12px!important;margin-bottom:108px!important;gap:90px!important}.premium-house .house-v3-copy{top:90px}.house-benefits{display:flex;flex-direction:column;gap:8px;margin:24px 0 0}.house-benefits span{display:flex;align-items:center;gap:7px;font-size:11px;color:#5d6a61}.house-benefits svg{color:var(--premium-green)}
.premium-record{background:white;border:1px solid #dae4dc!important;border-radius:20px;overflow:hidden;box-shadow:0 16px 45px rgba(19,49,31,.06)}.premium-record .record-title{padding:18px 19px;border-bottom:1px solid var(--premium-line);display:flex;align-items:center;justify-content:space-between;gap:20px}.record-title small,.record-title strong{display:block}.record-title small{font-size:8px;letter-spacing:.07em;color:#909892;font-weight:750}.record-title strong{font-size:15px;margin-top:3px}.record-title>span{font-size:8px;color:var(--premium-green-deep);background:#edf7ef;border-radius:999px;padding:5px 8px}.premium-record .record-row{padding:18px 19px;border-color:#e8ece8}.premium-record .record-row svg{color:var(--premium-green)}
.premium-outcome{max-width:1320px;padding-bottom:108px}.premium-outcome .outcome-list strong{display:flex;align-items:center;gap:8px}.premium-outcome .outcome-list strong svg{color:var(--premium-green);flex:0 0 auto}
.premium-marketing .partner-v3-wrap{background:#0b1811}.premium-marketing .partner-v3{max-width:1320px;padding:104px 28px}.premium-marketing .partner-v3 h2{font-size:clamp(38px,4.7vw,64px)}.premium-marketing .partner-v3 .btn.light{border:0;color:#0b1811}.premium-marketing .partner-fact{border-color:#26362b}.premium-marketing .partner-facts{border-color:#26362b}
.premium-final{max-width:1320px;padding-top:100px;padding-bottom:108px;align-items:center}.premium-final>div{max-width:840px}.premium-final .editorial-eyebrow{margin-bottom:15px}.premium-final h2{font-size:clamp(40px,5.1vw,68px);max-width:820px}
.premium-marketing .marketing-v3-footer{max-width:1320px}

@media(max-width:1100px){
  .premium-hero{grid-template-columns:minmax(0,1fr) minmax(350px,.75fr)!important;gap:52px!important}.premium-hero h1{font-size:64px!important}.premium-house{margin-inline:20px!important;padding:58px!important}.service-way-card{min-height:285px}
}
@media(max-width:920px){
  .premium-hero{grid-template-columns:1fr!important;gap:56px!important;padding-top:72px}.premium-hero .hero-v3-copy{max-width:760px}.service-demo{max-width:640px}.section-heading-row{grid-template-columns:1fr;gap:22px}.section-heading-row>p{max-width:620px}.service-way-grid{grid-template-columns:1fr 1fr}.service-way-card:last-child{grid-column:1/-1;min-height:245px}.premium-house{grid-template-columns:1fr!important;padding:46px!important}.premium-record{max-width:680px}.premium-outcome{grid-template-columns:1fr;gap:40px}
}
@media(max-width:720px){
  .premium-header:after{left:16px;right:16px}.premium-header .marketing-v3-actions{margin-left:8px}.premium-header .btn.primary{font-size:11px;padding-inline:12px}
  .premium-hero{padding:48px 18px 66px!important;gap:42px!important}.hero-badge{margin-bottom:20px}.premium-hero h1{font-size:46px!important;line-height:1.01!important}.premium-hero .hero-v3-lead{font-size:15px}.premium-hero .hero-v3-actions{align-items:stretch!important;gap:6px}.premium-hero .premium-primary{width:100%}.premium-hero .secondary-cta{justify-content:center}.hero-trust{gap:10px 14px;margin-top:19px}.hero-trust span{font-size:9px}
  .service-demo{border-radius:20px;padding:17px;box-shadow:0 18px 48px rgba(20,50,32,.08)}.demo-question p{font-size:12px}
  .service-ways{padding:68px 18px}.section-heading-row h2{font-size:38px}.service-way-grid{grid-template-columns:1fr;margin-top:30px}.service-way-card,.service-way-card:last-child{grid-column:auto;min-height:auto;padding:20px}.service-way-card h3{margin-top:24px}.service-way-card a{margin-top:26px}
  .process-section{padding:72px 18px}.process-section .process-list{margin-top:40px}.process-section .process-row{grid-template-columns:34px 1fr;gap:11px}.process-section .process-row p{grid-column:2;font-size:12px}.process-section .process-row h3{font-size:15px}
  .premium-house{margin:0 12px 74px!important;padding:34px 20px!important;border-radius:24px!important;gap:40px!important}.premium-house h2{font-size:39px}.premium-record .record-row{grid-template-columns:30px minmax(0,1fr);gap:8px;padding:15px}.premium-record .record-row>span{grid-column:2;margin-top:2px}.premium-record .record-title{padding:15px}.premium-house .editorial-intro{font-size:14px}
  .premium-outcome{padding:0 18px 74px}.premium-outcome h2{font-size:38px}.premium-outcome .outcome-list p{grid-template-columns:1fr;padding:16px 0}.premium-outcome .outcome-list strong{font-size:12px}
  .premium-marketing .partner-v3{padding:74px 18px}.premium-marketing .partner-v3 h2{font-size:40px}.premium-marketing .partner-v3 p{font-size:14px}.premium-final{padding:72px 18px;align-items:stretch}.premium-final h2{font-size:39px}.premium-final .btn{width:100%}
}
@media(max-width:420px){
  .premium-hero h1{font-size:41px!important}.hero-trust{display:grid;grid-template-columns:1fr}.service-demo-top{align-items:flex-start}.demo-status{margin-left:auto}.section-heading-row h2,.premium-house h2,.premium-outcome h2,.premium-marketing .partner-v3 h2,.premium-final h2{font-size:36px}.record-title>span{display:none}
}


/* Issues #2–#7: calm home, emergency, consultation, contact areas, house history and invoices */
.home-overview{padding-bottom:18px;border-bottom:1px solid var(--eh-border)}.home-overview>span{font-size:10px;color:var(--eh-brand);font-weight:720;text-transform:uppercase;letter-spacing:.07em}.home-overview h1{font-size:clamp(32px,4.4vw,46px);letter-spacing:-.045em;line-height:1.06;font-weight:540;margin:8px 0}.home-overview>p{display:flex;align-items:center;gap:6px;font-size:11px;color:#758078;margin:0}.home-state{display:flex;align-items:flex-start;gap:10px;margin-top:17px;padding:13px 14px;border-radius:14px}.home-state svg{width:18px;flex:0 0 auto}.home-state strong,.home-state small{display:block}.home-state strong{font-size:11px}.home-state small{font-size:9px;line-height:1.5;margin-top:3px}.home-state.ok{background:#eff8f0;color:#105258}.home-state.attention{background:#fff7e8;color:#855e14}
.home-primary-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.home-primary-actions>a{display:grid;grid-template-columns:38px minmax(0,1fr) 18px;gap:10px;align-items:center;padding:14px;border-radius:16px;border:1px solid var(--eh-border);min-height:78px}.home-primary-actions>a>svg:first-child{width:20px}.home-primary-actions strong,.home-primary-actions small{display:block}.home-primary-actions strong{font-size:12px;letter-spacing:.02em}.home-primary-actions small{font-size:9px;margin-top:3px;opacity:.72}.home-primary-actions>a>svg:last-child{width:16px}.emergency-home-button{background:#fff5f3;color:#8f2f25;border-color:#f1d4cf!important}.consultation-home-button{background:#f2f8f2;color:var(--eh-brand);border-color:#dbe9dc!important}.service-entry-card.calm{box-shadow:none;background:#fff;padding:15px}.service-entry-card.calm>svg{color:#8a938c;width:17px}.home-contact-categories{display:flex;flex-direction:column;border-top:1px solid var(--eh-border)}.home-contact-categories>a{display:grid;grid-template-columns:minmax(92px,.65fr) 36px minmax(0,1fr) 16px;gap:10px;align-items:center;padding:13px 0;border-bottom:1px solid var(--eh-border)}.home-contact-category{font-size:9px;color:var(--eh-brand);font-weight:650}.home-contact-categories .contact-avatar{width:34px;height:34px}.home-contact-categories strong,.home-contact-categories small{display:block}.home-contact-categories strong{font-size:11px}.home-contact-categories small{font-size:8px;color:#7b847d;margin-top:2px}.home-contact-categories>a>svg{width:15px;color:#a2aaa4}.empty-contact-home{grid-template-columns:32px minmax(0,1fr) 16px!important}

.emergency-hero,.consultation-hero,.history-hero{display:flex;align-items:flex-start;gap:15px;padding:20px 0 24px;border-bottom:1px solid var(--eh-border)}.emergency-hero>svg,.consultation-hero>svg,.history-hero>svg{width:36px;height:36px;flex:0 0 auto}.emergency-hero>svg{color:#a3332a}.consultation-hero>svg,.history-hero>svg{color:var(--eh-brand)}.emergency-hero span,.consultation-hero span,.history-hero span{font-size:9px;font-weight:760;letter-spacing:.08em}.emergency-hero span{color:#a3332a}.consultation-hero span,.history-hero span{color:var(--eh-brand)}.emergency-hero h1,.consultation-hero h1,.history-hero h1{font-size:30px;letter-spacing:-.04em;font-weight:550;margin:4px 0 7px}.emergency-hero p,.consultation-hero p,.history-hero p{font-size:11px;line-height:1.55;color:#737c75;margin:0;max-width:680px}.emergency-trust,.consultation-points{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}.emergency-trust span,.consultation-points>span{border:1px solid var(--eh-border);border-radius:12px;background:#fff;padding:11px;font-size:9px;color:#657068}.emergency-trust span{display:flex;align-items:center;gap:6px}.emergency-trust svg,.consultation-points svg{width:16px;color:var(--eh-brand)}.consultation-points b,.consultation-points small{display:block}.consultation-points b{font-size:10px;margin-top:7px}.consultation-points small{font-size:8px;line-height:1.4;color:#7d857f;margin-top:3px}.emergency-form,.consultation-form,.history-form{display:flex;flex-direction:column;gap:12px;border:1px solid var(--eh-border);border-radius:16px;padding:16px;background:#fff}.emergency-location{padding:11px;border-radius:10px;background:#f6f8f6}.emergency-location small,.emergency-location strong{display:block}.emergency-location small{font-size:8px;color:#7c857e}.emergency-location strong{font-size:10px;margin-top:3px}.emergency-button{background:#9e332a!important;color:#fff!important;border-color:#9e332a!important}.emergency-disclaimer{font-size:8px;line-height:1.55;color:#8b938d;margin:12px 4px}.emergency-inline-badge,.emergency-quote-badge{display:inline-flex;width:max-content;border-radius:999px;font-size:8px;font-weight:780;padding:5px 8px;background:#fff0ed;color:#9c3128}.emergency-quote-badge.local{background:#edf7ee;color:#1b8569}.emergency-summary{border-color:#efd3ce!important;background:#fff7f5!important}.pro-emergency-note{border:1px solid #5e3b32;background:#241815;border-radius:12px;padding:13px;margin-bottom:14px}.pro-emergency-note strong{color:#ffc6bc;font-size:11px}.pro-emergency-note p{font-size:9px;line-height:1.5;color:#cbb8b3;margin:4px 0 0}
.alert.emergency-112{display:flex;flex-direction:column;gap:4px;margin:2px 0 18px;border:1px solid #f1d4cf;background:#fff5f3;border-radius:14px;padding:14px 16px}
.alert.emergency-112 strong{font-size:13px;font-weight:760;color:#8f2f25}
.alert.emergency-112 span{font-size:11px;line-height:1.55;color:#7c4a42}
.alert.emergency-112 a{font-weight:780;color:#8f2f25;text-decoration:underline;text-underline-offset:2px}

.more-menu{border:1px solid var(--eh-border);border-radius:16px;overflow:hidden;background:#fff}.more-menu>a{display:grid;grid-template-columns:34px minmax(0,1fr) 16px;gap:11px;align-items:center;padding:14px}.more-menu>a+a{border-top:1px solid var(--eh-border)}.more-icon{width:34px;height:34px;border-radius:10px;background:#f2f6f2;color:var(--eh-brand);display:grid;place-items:center}.more-icon svg{width:16px}.more-menu strong,.more-menu small{display:block}.more-menu strong{font-size:11px}.more-menu small{font-size:8px;color:#7f8881;margin-top:2px}.more-menu>a>svg{width:15px;color:#a1a9a3}.more-support{display:flex;gap:10px;align-items:flex-start;margin-top:16px;padding:13px;border-radius:12px;background:#f7f9f7}.more-support>svg{width:17px;color:#758078}.more-support strong{font-size:10px}.more-support p{font-size:8px;line-height:1.45;color:#7c857f;margin:3px 0 0}

.contact-category-groups{display:flex;flex-direction:column;gap:18px}.contact-category-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:7px}.contact-category-title>span{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700;color:var(--eh-brand)}.contact-category-title small{font-size:8px;color:#8c948e}.contact-category-group .contact-list{border-top:1px solid var(--eh-border)}.contact-category-group .contact-row{border-radius:0;border:0;border-bottom:1px solid var(--eh-border);padding:12px 0}.contact-category-group .contact-row.selected{background:#f7faf7;margin-inline:-10px;padding-inline:10px;border-radius:10px}.contact-category-editor{margin:10px 0 18px;border:1px solid var(--eh-border);border-radius:12px;background:#fff}.contact-category-editor>summary{display:flex;align-items:center;justify-content:space-between;list-style:none;padding:11px 13px;font-size:9px;font-weight:650;cursor:pointer}.contact-category-editor>summary::-webkit-details-marker{display:none}.contact-category-editor form{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;padding:12px;border-top:1px solid var(--eh-border);align-items:end}.contact-category-editor .btn{margin-bottom:1px}

.history-hero{margin-bottom:8px}.house-history-list{display:flex;flex-direction:column;border-top:1px solid var(--eh-border)}.house-history-list>article{display:grid;grid-template-columns:62px minmax(0,1fr);gap:14px;padding:18px 0;border-bottom:1px solid var(--eh-border)}.history-year{font-size:17px;color:#7c857f;font-weight:560}.house-history-list article small,.house-history-list article strong{display:block}.house-history-list article>div:last-child>small{font-size:8px;color:var(--eh-brand);text-transform:uppercase;font-weight:700}.house-history-list article strong{font-size:13px;margin-top:3px}.house-history-list article p{font-size:9px;color:#737d75;margin:4px 0}.history-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.history-meta span{font-size:8px;background:#f3f6f3;color:#667169;padding:4px 7px;border-radius:999px}.history-notes{line-height:1.55!important;color:#59645c!important}.history-linked,.history-pending{display:inline-flex;align-items:center;gap:5px;margin-top:8px;font-size:8px;font-weight:650}.history-linked{color:#1b8569}.history-pending{color:#8b671f}.history-linked svg,.history-pending svg{width:13px}.history-photos{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.history-photos figure{margin:0;position:relative}.history-photos img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:10px}.history-photos figcaption{position:absolute;left:6px;bottom:6px;background:rgba(0,0,0,.62);color:#fff;border-radius:999px;padding:3px 6px;font-size:7px}.history-documents{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.history-documents a{font-size:8px;color:var(--eh-brand);background:#eef7ef;border-radius:7px;padding:5px 7px}.history-form{margin-top:2px}.history-invite{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--eh-border);border-radius:12px;padding:12px}.history-invite>svg{width:17px;color:var(--eh-brand);flex:0 0 auto}.history-invite strong,.history-invite small{display:block}.history-invite strong{font-size:10px}.history-invite small{font-size:8px;color:#7b847d;margin-top:3px}.invite-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.invite-actions a{font-size:8px;color:var(--eh-brand);font-weight:650}.house-transfer-card{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--eh-border);border-radius:15px;padding:14px}.house-transfer-card>svg{color:var(--eh-brand);width:20px}.house-transfer-card strong{font-size:11px}.house-transfer-card p{font-size:9px;line-height:1.5;color:#747e76}.house-transfer-card form{display:flex;gap:8px;align-items:end;margin:10px 0}.house-transfer-card form label{flex:1}.transfer-history{margin-top:10px;border-top:1px solid var(--eh-border)}.transfer-history>div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--eh-border)}.transfer-history small{font-size:9px}.transfer-info{display:flex;gap:9px;align-items:flex-start;background:#f5f8f5;border:1px solid var(--eh-border);border-radius:12px;padding:12px;margin:12px 0}.transfer-info>svg{color:var(--eh-brand);width:17px;flex:0 0 auto}.transfer-info p{font-size:9px;line-height:1.5;margin:0;color:#69736b}

.invoice-page,.passport-page{min-height:100vh;background:#f1f4f1;padding:28px 16px 60px}.invoice-page-tools{max-width:920px;margin:0 auto 12px;display:flex;align-items:center;gap:8px;justify-content:flex-end}.invoice-page-tools form{margin:0}.invoice-paper,.house-passport{max-width:920px;margin:0 auto;background:#fff;border:1px solid #e0e5e1;border-radius:18px;padding:42px;box-shadow:0 18px 55px rgba(20,46,30,.07)}.invoice-paper-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding-bottom:26px;border-bottom:1px solid var(--eh-border)}.invoice-paper-head>div:last-child{text-align:right}.invoice-paper-head strong{display:block;font-size:13px;margin-top:7px}.invoice-wordmark{font-size:18px;font-weight:760;letter-spacing:-.035em;color:var(--eh-brand)}.invoice-paper-head small{display:block;font-size:8px;color:#818a83;margin-top:3px}.invoice-parties{display:grid;grid-template-columns:1fr 1fr;gap:50px;padding:30px 0}.invoice-parties small{display:block;font-size:8px;text-transform:uppercase;letter-spacing:.07em;color:#8c948e}.invoice-parties strong{display:block;font-size:12px;margin:6px 0}.invoice-parties p{font-size:9px;line-height:1.45;color:#68736a;margin:2px 0;white-space:pre-line}.invoice-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--eh-border);border-bottom:1px solid var(--eh-border)}.invoice-meta>div{padding:13px}.invoice-meta>div+div{border-left:1px solid var(--eh-border)}.invoice-meta small,.invoice-meta strong{display:block}.invoice-meta small{font-size:7px;color:#8a938c}.invoice-meta strong{font-size:9px;margin-top:4px}.invoice-table{margin-top:30px}.invoice-table-head,.invoice-table-row{display:grid;grid-template-columns:minmax(0,2.2fr) .55fr .75fr .55fr .8fr;gap:10px;align-items:center}.invoice-table-head{padding:8px 0;border-bottom:1px solid #cdd4ce;font-size:8px;color:#7a837c}.invoice-table-row{padding:12px 0;border-bottom:1px solid var(--eh-border);font-size:9px}.invoice-table-row strong,.invoice-table-row small{display:block}.invoice-table-row strong{font-size:9px}.invoice-table-row small{font-size:7px;color:#8b948d;margin-top:2px}.invoice-totals{margin:24px 0 0 auto;max-width:330px}.invoice-totals>div{display:flex;justify-content:space-between;padding:8px 0;font-size:10px}.invoice-grand{border-top:2px solid #1b251f;margin-top:4px;padding-top:12px!important;font-size:14px!important}.invoice-notes{margin-top:30px;padding:14px;background:#f7f9f7;border-radius:10px}.invoice-notes strong{font-size:9px}.invoice-notes p{font-size:9px;line-height:1.55;color:#6b756d}.invoice-paper-foot{margin-top:34px;border-top:1px solid var(--eh-border);padding-top:15px}.invoice-paper-foot p{font-size:8px;line-height:1.5;color:#8a928c}.invoice-form{display:flex;flex-direction:column;gap:11px;background:#151b16;border:1px solid var(--eh-dark-border);border-radius:14px;padding:14px}.invoice-form-head strong{font-size:12px}.invoice-form-head p{font-size:9px;line-height:1.45;color:#9ba49d;margin:3px 0}.invoice-items-head{display:flex;justify-content:space-between;gap:10px}.invoice-items-head strong{font-size:10px}.invoice-items-head small{font-size:8px;color:#939d95}.invoice-line{display:grid;grid-template-columns:minmax(150px,2fr) .55fr .65fr .75fr .6fr;gap:7px}.invoice-preview-total{display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--eh-dark-border);padding-top:10px}.invoice-preview-total span{font-size:8px;color:#94a097}.invoice-preview-total strong{font-size:12px}.passport-page{background:#edf1ed}.house-passport header{padding:36px 0 26px;border-bottom:1px solid var(--eh-border)}.house-passport header>span{font-size:9px;color:var(--eh-brand);font-weight:750;text-transform:uppercase}.house-passport h1{font-size:34px;letter-spacing:-.045em;margin:6px 0}.house-passport header p{font-size:10px;color:#6f7971}.house-passport section{padding:25px 0;border-bottom:1px solid var(--eh-border)}.house-passport h2{font-size:13px}.passport-row{display:flex;justify-content:space-between;gap:16px;padding:9px 0;font-size:9px}.passport-history{display:grid;grid-template-columns:85px minmax(0,1fr) auto;gap:12px;padding:12px 0;border-top:1px solid var(--eh-border);align-items:start}.passport-history time,.passport-history p,.passport-history small{font-size:8px;color:#7a837c}.passport-history strong{font-size:10px}.passport-history p{margin:3px 0}.passport-history small{grid-column:2}.house-passport footer{padding-top:24px;font-size:9px;color:#758078}

.service-preferences,.register-options,.emergency-settings{display:flex;flex-direction:column;gap:7px;border:1px solid #293b2e;border-radius:10px;padding:11px}.register-options{border-color:var(--eh-border);background:#f8faf8}.service-preferences>strong,.register-options>strong,.emergency-settings>strong{font-size:10px}.service-preferences label,.register-options label,.emergency-settings>label{display:flex;align-items:center;gap:7px;font-size:9px}.service-preferences input[type=checkbox],.register-options input[type=checkbox],.emergency-settings input[type=checkbox]{width:auto}.emergency-day-picker{border:1px solid var(--eh-border);border-radius:10px;padding:10px}.emergency-settings .emergency-day-picker{border-color:#293b2e}.emergency-day-picker>strong{display:block;font-size:9px;margin-bottom:8px}.emergency-day-picker>strong small{font-weight:500;color:#7c867e}.emergency-day-picker>div{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}.emergency-day-picker label{display:grid;place-items:center;gap:4px;border:1px solid var(--eh-border);border-radius:8px;padding:7px 3px;font-size:8px;cursor:pointer}.emergency-settings .emergency-day-picker label{border-color:#314435}.emergency-day-picker input{width:auto!important}.partner-profile-cover.has-logo{background:#f4f6f4}.partner-profile-cover.has-logo>img{width:100%;height:100%;object-fit:contain;padding:24px}.partner-profile-cover.has-logo>svg{color:var(--eh-brand)}

@media(max-width:720px){
  .home-primary-actions{grid-template-columns:1fr 1fr}.home-primary-actions>a{grid-template-columns:32px minmax(0,1fr) 15px;padding:12px;min-height:72px}.home-contact-categories>a{grid-template-columns:82px 32px minmax(0,1fr) 14px}.home-contact-categories .contact-avatar{width:32px;height:32px}.contact-category-editor form{grid-template-columns:1fr}.emergency-trust,.consultation-points{grid-template-columns:1fr}.emergency-hero h1,.consultation-hero h1,.history-hero h1{font-size:26px}.house-history-list>article{grid-template-columns:48px minmax(0,1fr)}.history-year{font-size:14px}.house-transfer-card form{flex-direction:column;align-items:stretch}.invoice-page{padding:12px 8px 90px}.invoice-page-tools{overflow:auto;justify-content:flex-start;padding:0 2px}.invoice-page-tools .btn{white-space:nowrap}.invoice-paper,.house-passport{padding:22px 16px;border-radius:14px}.invoice-parties{grid-template-columns:1fr;gap:18px}.invoice-meta{grid-template-columns:1fr 1fr}.invoice-meta>div:nth-child(3){border-left:0;border-top:1px solid var(--eh-border)}.invoice-meta>div:nth-child(4){border-top:1px solid var(--eh-border)}.invoice-table{overflow-x:auto}.invoice-table-head,.invoice-table-row{min-width:590px}.invoice-line{grid-template-columns:1fr 1fr}.invoice-line label:first-child{grid-column:1/-1}.invoice-form .three{grid-template-columns:1fr}.passport-history{grid-template-columns:70px minmax(0,1fr)}.passport-history>span{grid-column:2}.home-overview h1{font-size:30px}
}
@media print{.invoice-page,.passport-page{padding:0;background:#fff}.invoice-paper,.house-passport{box-shadow:none;border:0;border-radius:0;max-width:none;padding:18mm}.print-hide{display:none!important}}

/* Keep native file controls inside narrow mobile cards. */
.app-shell-v3 label,.history-form .two>*{min-width:0}
.app-shell-v3 input[type="file"],.auth-card input[type="file"]{width:100%;max-width:100%;min-width:0;overflow:hidden}


/* Einfach Hausen — conversion-led public website v7 */
.conversion-site{
  --cv-ink:#112018;
  --cv-muted:#657168;
  --cv-green:#105258;
  --cv-green-dark:#174b50;
  --cv-mint:#edf6ef;
  --cv-warm:#f7f6f2;
  --cv-line:#e1e7e2;
  --cv-card:#fff;
  background:#fff;
  color:var(--cv-ink);
  overflow-x:clip;
}
.conversion-header{max-width:1360px;height:72px;border:0;position:relative;background:rgba(255,255,255,.96);z-index:50}
.conversion-header:after{content:'';position:absolute;left:28px;right:28px;bottom:0;height:1px;background:var(--cv-line)}
.conversion-header nav a{font-size:12px;font-weight:590;color:#58635b}
.conversion-header nav a:hover{color:var(--cv-ink)}
.conversion-header-cta{background:var(--cv-green-dark)!important;border-radius:10px!important;box-shadow:none!important}

.conversion-hero{max-width:1360px;margin:0 auto;padding:84px 28px 92px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(410px,.72fr);gap:84px;align-items:center}
.conversion-hero-copy{min-width:0}
.conversion-kicker{display:inline-flex;align-items:center;gap:7px;color:var(--cv-green-dark);font-size:11px;font-weight:700;background:#f5faf6;border:1px solid #dde9e0;padding:7px 10px;border-radius:999px;margin-bottom:22px}
.conversion-hero h1{font-size:clamp(54px,6.4vw,88px);line-height:.98;letter-spacing:-.06em;font-weight:535;margin:0;max-width:910px}
.conversion-hero h1 span{color:var(--cv-green)}
.conversion-hero-copy>p{font-size:18px;line-height:1.62;color:var(--cv-muted);max-width:790px;margin:26px 0 0}
.public-intake{margin-top:34px;max-width:790px;border:1px solid #d8e2da;border-radius:18px;padding:9px 9px 10px;background:#fff;box-shadow:0 18px 50px rgba(14,51,29,.08)}
.public-intake>label{font-size:10px;color:#6e7b72;font-weight:720;padding:4px 7px 8px;text-transform:uppercase;letter-spacing:.06em}
.public-intake-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
.public-intake-row input{height:54px;border:0;background:#f7f9f7;border-radius:11px;padding:0 15px;font-size:15px;box-shadow:none}
.public-intake-row input:focus{box-shadow:0 0 0 2px rgba(11,106,58,.14)}
.public-intake-row button{height:54px;border:0;border-radius:11px;background:var(--cv-green-dark);color:white;padding:0 18px;font-size:12px;font-weight:720;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap}
.public-intake-meta{display:flex;flex-wrap:wrap;gap:13px;padding:9px 7px 0;color:#778179}
.public-intake-meta span{display:inline-flex;align-items:center;gap:5px;font-size:9px}
.public-intake-meta svg{width:12px;color:var(--cv-green)}
.example-prompts{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin-top:14px}
.example-prompts>span{font-size:9px;color:#909791;margin-right:2px}
.example-prompts a{font-size:9px;color:#59655d;border:1px solid var(--cv-line);border-radius:999px;padding:6px 9px;background:#fff}
.example-prompts a:hover{border-color:#b8cbbd;color:var(--cv-green-dark)}

.conversion-hero-product{position:relative;border:1px solid #dce4de;background:#fff;border-radius:24px;padding:19px;box-shadow:0 28px 80px rgba(17,50,31,.10),0 2px 6px rgba(17,50,31,.04)}
.conversion-hero-product:before{content:'';position:absolute;width:240px;height:240px;right:-55px;top:-60px;background:radial-gradient(circle,#dceee2 0,rgba(220,238,226,0) 70%);z-index:-1}
.product-window-head{display:flex;align-items:center;gap:10px;padding:2px 2px 16px;border-bottom:1px solid var(--cv-line)}
.product-home-mark{width:40px;height:40px;border-radius:12px;background:var(--cv-mint);color:var(--cv-green-dark);display:grid;place-items:center}
.product-window-head>div:nth-child(2){flex:1}.product-window-head small,.product-window-head strong{display:block}.product-window-head small{font-size:8px;color:#5f6b63;text-transform:uppercase;letter-spacing:.06em;font-weight:740}.product-window-head strong{font-size:12px;margin-top:3px}.product-window-head>span{font-size:8px;color:var(--cv-green-dark);font-weight:700;background:#eaf6ed;padding:5px 8px;border-radius:999px}
.product-question{font-size:13px;line-height:1.5;color:#344139;background:#f7f9f7;border:1px solid #edf0ed;border-radius:14px;padding:13px;margin:17px 0}
.product-response>p{font-size:10px;line-height:1.5;color:#6f7a72;margin:0 2px 10px}
.product-choice{display:grid;grid-template-columns:34px minmax(0,1fr) 15px;gap:9px;align-items:center;padding:11px 10px;border-top:1px solid var(--cv-line)}
.product-choice>svg:first-child{width:17px;color:#718078}.product-choice>svg:last-child{width:14px;color:#9aa49d}.product-choice strong,.product-choice small{display:block}.product-choice strong{font-size:11px}.product-choice small{font-size:8px;color:#818a84;margin-top:2px}.product-choice.featured{margin-top:4px;border:1px solid #d8e9dc;border-radius:12px;background:#f1f8f2}.product-choice.featured>svg:first-child{color:var(--cv-green)}
.product-assurance{display:flex;align-items:center;gap:6px;color:#758078;font-size:8px;margin-top:13px;padding:0 3px}

.credibility-strip{max-width:1360px;margin:0 auto;border-top:1px solid var(--cv-line);border-bottom:1px solid var(--cv-line);display:grid;grid-template-columns:repeat(4,1fr)}
.credibility-strip>div{display:flex;align-items:center;gap:10px;padding:19px 20px}.credibility-strip>div+div{border-left:1px solid var(--cv-line)}.credibility-strip svg{width:18px;color:var(--cv-green);flex:0 0 auto}.credibility-strip strong,.credibility-strip small{display:block}.credibility-strip strong{font-size:10px}.credibility-strip small{font-size:8px;color:#838d86;margin-top:2px}

.conversion-section{max-width:1360px;margin:0 auto;padding:108px 28px}
.conversion-section-head{max-width:940px}.conversion-section-head>span,.house-story-copy>span,.free-section>div>span,.conversion-final>div>span{display:block;font-size:10px;color:var(--cv-green-dark);text-transform:uppercase;letter-spacing:.08em;font-weight:760;margin-bottom:12px}
.conversion-section-head h2,.house-story-copy h2,.free-section h2,.conversion-final h2{font-size:clamp(40px,4.8vw,66px);line-height:1.04;letter-spacing:-.048em;font-weight:535;margin:0}
.conversion-section-head>p{font-size:14px;line-height:1.65;color:#707b73;max-width:700px;margin:18px 0 0}.conversion-section-head.compact h2{max-width:760px}.conversion-section-head.compact>p{max-width:760px}
.outcome-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:52px}.outcome-grid article{border-top:1px solid var(--cv-line);padding:24px 4px 6px;min-height:215px}.outcome-grid svg{width:24px;color:var(--cv-green)}.outcome-grid h3{font-size:19px;letter-spacing:-.025em;font-weight:610;margin:26px 0 10px}.outcome-grid p{font-size:12px;line-height:1.65;color:#737d75;margin:0;max-width:340px}

.conversion-process-wrap{background:var(--cv-warm);border-top:1px solid #ece9e3;border-bottom:1px solid #ece9e3}
.conversion-process{padding-top:96px;padding-bottom:96px}.conversion-step-list{margin-top:44px;border-top:1px solid #dfddd7}.conversion-step-list article{display:grid;grid-template-columns:70px minmax(190px,.42fr) minmax(0,1fr);gap:18px;padding:25px 0;border-bottom:1px solid #dfddd7;align-items:start}.conversion-step-list b{font-size:10px;color:#879087;font-weight:700}.conversion-step-list h3{font-size:18px;margin:0;letter-spacing:-.02em}.conversion-step-list p{font-size:12px;line-height:1.6;color:#707971;margin:2px 0 0;max-width:620px}
.conversion-paths{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:34px}.conversion-paths>div{background:#fff;border:1px solid #e5e3de;border-radius:14px;padding:16px}.conversion-paths svg{width:18px;color:var(--cv-green)}.conversion-paths strong,.conversion-paths span{display:block}.conversion-paths strong{font-size:11px;margin-top:13px}.conversion-paths span{font-size:9px;color:#7a837c;line-height:1.5;margin-top:4px}

.house-story{display:grid;grid-template-columns:minmax(0,.85fr) minmax(400px,.7fr);gap:90px;align-items:center}.house-story-copy>p{font-size:14px;line-height:1.65;color:#6c786f;max-width:650px;margin:19px 0 0}.house-story-copy ul{list-style:none;padding:0;margin:25px 0 28px;display:grid;gap:9px}.house-story-copy li{display:flex;align-items:center;gap:8px;font-size:11px;color:#57645b}.house-story-copy li svg{width:15px;color:var(--cv-green)}.strong-link{font-size:11px;font-weight:680}
.house-story-card{border:1px solid #dbe4dd;border-radius:20px;background:#fff;box-shadow:0 20px 55px rgba(16,48,29,.07);overflow:hidden}.house-story-title{display:flex;justify-content:space-between;align-items:center;padding:18px 19px;border-bottom:1px solid var(--cv-line)}.house-story-title small,.house-story-title strong{display:block}.house-story-title small{font-size:8px;color:#8d9690;letter-spacing:.07em}.house-story-title strong{font-size:15px;margin-top:3px}.house-story-title>span{font-size:8px;color:var(--cv-green-dark);background:#edf7ef;padding:5px 8px;border-radius:999px;display:flex;align-items:center;gap:4px}.house-story-title svg{width:12px}.house-story-timeline{padding:12px 18px}.house-story-timeline>div{display:grid;grid-template-columns:42px 12px minmax(0,1fr);gap:9px;align-items:start;position:relative;padding:12px 0}.house-story-timeline>div+div{border-top:1px solid var(--cv-line)}.house-story-timeline>div>span{font-size:9px;color:#88918b;padding-top:2px}.house-story-timeline i{width:8px;height:8px;border-radius:50%;background:var(--cv-green);margin-top:3px}.house-story-timeline strong,.house-story-timeline small{display:block}.house-story-timeline strong{font-size:11px}.house-story-timeline small{font-size:8px;color:#7c867f;margin-top:3px}.house-story-footer{display:flex;align-items:center;gap:9px;background:#f4f8f4;padding:14px 18px}.house-story-footer>svg{width:17px;color:var(--cv-green)}.house-story-footer strong,.house-story-footer small{display:block}.house-story-footer strong{font-size:10px}.house-story-footer small{font-size:8px;color:#5f6b63;margin-top:2px}

.trust-section{background:#0c1b12;color:#f4f8f5}.trust-inner{display:grid;grid-template-columns:minmax(0,.8fr) minmax(420px,.75fr);gap:90px;align-items:start}.light-head>span{color:#8fd0c9}.light-head h2{color:#fff}.light-head>p{color:#aebdb2}.trust-check-grid{border-top:1px solid #26392c}.trust-check-grid>div{display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:17px 0;border-bottom:1px solid #26392c}.trust-check-grid svg{width:19px;color:#8fd0c9}.trust-check-grid strong,.trust-check-grid small{display:block}.trust-check-grid strong{font-size:11px;color:#fff}.trust-check-grid small{font-size:9px;color:#9fb0a4;margin-top:3px;line-height:1.45}

.free-section{display:flex;align-items:end;justify-content:space-between;gap:50px;padding-top:88px;padding-bottom:88px}.free-section>div{max-width:850px}.free-section h2{font-size:clamp(42px,5vw,68px)}.free-section p{font-size:13px;line-height:1.6;color:#707b73;max-width:720px}.big-cta{min-height:52px!important;padding:13px 20px!important;border-radius:10px!important;background:var(--cv-green-dark)!important;white-space:nowrap}

.conversion-partner{background:#0c1b12}.conversion-partner .partner-v3{max-width:1360px;padding-top:100px;padding-bottom:100px}.conversion-partner .partner-v3 h2{font-size:clamp(40px,4.8vw,64px);max-width:760px}.conversion-partner .partner-v3 p{max-width:690px}.conversion-final{max-width:1360px;align-items:center;padding-top:100px;padding-bottom:108px}.conversion-final>div{max-width:850px}.conversion-final p{font-size:12px;color:#768079;margin:13px 0 0}.conversion-footer{max-width:1360px}

@media(max-width:1080px){
  .conversion-hero{grid-template-columns:minmax(0,1fr) minmax(360px,.78fr);gap:50px}.conversion-hero h1{font-size:64px}.house-story{gap:54px}.trust-inner{gap:54px}
}
@media(max-width:900px){
  .conversion-header nav{display:none}.conversion-hero{grid-template-columns:1fr;padding-top:65px;gap:52px}.conversion-hero-copy{max-width:800px}.conversion-hero-product{max-width:650px}.credibility-strip{grid-template-columns:1fr 1fr}.credibility-strip>div:nth-child(3){border-left:0;border-top:1px solid var(--cv-line)}.credibility-strip>div:nth-child(4){border-top:1px solid var(--cv-line)}.house-story{grid-template-columns:1fr}.house-story-card{max-width:680px}.trust-inner{grid-template-columns:1fr}.free-section{align-items:flex-start;flex-direction:column}.outcome-grid{grid-template-columns:1fr 1fr}.outcome-grid article:last-child{grid-column:1/-1}.conversion-paths{grid-template-columns:1fr 1fr}.conversion-paths>div:last-child{grid-column:1/-1}
}
@media(max-width:720px){
  .conversion-header{height:calc(62px + env(safe-area-inset-top));padding:env(safe-area-inset-top) 16px 0;position:sticky;top:0}.conversion-header:after{left:16px;right:16px}.conversion-header .marketing-v3-login{display:none}.conversion-header .brand small{display:none}.conversion-header-cta{font-size:10px!important;padding:8px 11px!important}
  .conversion-hero{padding:46px 18px 62px;gap:40px}.conversion-kicker{margin-bottom:17px}.conversion-hero h1{font-size:45px;line-height:1.01}.conversion-hero-copy>p{font-size:15px;line-height:1.58;margin-top:20px}.public-intake{margin-top:26px;border-radius:15px;padding:8px}.public-intake-row{grid-template-columns:1fr}.public-intake-row input,.public-intake-row button{height:50px}.public-intake-row button{width:100%}.public-intake-meta{gap:7px 12px}.example-prompts{align-items:flex-start}.example-prompts>span{width:100%}
  .conversion-hero-product{border-radius:18px;padding:15px;box-shadow:0 15px 45px rgba(17,50,31,.08)}.conversion-hero-product:before{right:-14px;top:-36px;width:170px;height:170px}.product-question{font-size:12px}
  .credibility-strip{margin-inline:18px;border:1px solid var(--cv-line);border-radius:14px;overflow:hidden;grid-template-columns:1fr}.credibility-strip>div{padding:14px}.credibility-strip>div+div,.credibility-strip>div:nth-child(3),.credibility-strip>div:nth-child(4){border-left:0;border-top:1px solid var(--cv-line)}
  .conversion-section{padding:72px 18px}.conversion-section-head h2,.house-story-copy h2,.free-section h2,.conversion-final h2{font-size:37px}.conversion-section-head>p{font-size:12px}.outcome-grid{grid-template-columns:1fr;margin-top:35px}.outcome-grid article,.outcome-grid article:last-child{grid-column:auto;min-height:auto;padding:20px 0}.outcome-grid h3{font-size:17px;margin-top:18px}
  .conversion-step-list{margin-top:32px}.conversion-step-list article{grid-template-columns:34px minmax(0,1fr);gap:10px;padding:20px 0}.conversion-step-list article p{grid-column:2}.conversion-step-list h3{font-size:15px}.conversion-step-list p{font-size:11px}.conversion-paths{grid-template-columns:1fr}.conversion-paths>div:last-child{grid-column:auto}
  .house-story{gap:38px}.house-story-copy>p{font-size:12px}.house-story-card{border-radius:16px}.trust-inner{gap:40px}.trust-check-grid>div{padding:15px 0}.free-section{gap:26px;padding-top:68px;padding-bottom:68px}.free-section .big-cta{width:100%}
  .conversion-partner .partner-v3{padding:74px 18px}.conversion-partner .partner-v3 h2{font-size:38px}.conversion-final{padding:72px 18px;align-items:stretch}.conversion-final .big-cta{width:100%}.conversion-footer{padding-inline:18px}
}
@media(max-width:420px){
  .conversion-hero h1{font-size:40px}.conversion-section-head h2,.house-story-copy h2,.free-section h2,.conversion-final h2{font-size:34px}.product-window-head>span{display:none}
}

.register-intent-preview{border:1px solid #d8e7dc;background:#f3f9f4;border-radius:13px;padding:13px 14px}.register-intent-preview small,.register-intent-preview strong,.register-intent-preview span{display:block}.register-intent-preview small{font-size:8px;color:#1b8569;text-transform:uppercase;letter-spacing:.06em;font-weight:760}.register-intent-preview strong{font-size:12px;line-height:1.45;margin-top:5px;color:#1c2129}.register-intent-preview span{font-size:9px;color:#728078;margin-top:5px}

/* Brand lock-up — based on the approved issue #9 direction. */
.brand.brand-issue-nine{display:inline-flex;align-items:center;gap:11px;color:#122018;min-width:0}
.brand.brand-issue-nine[data-inverse=true]{color:#fff}
.brand-house{width:36px;height:36px;display:grid;place-items:center;flex:0 0 36px}
.brand-house img{display:block;width:100%;height:100%;object-fit:contain}
.brand-copy{display:flex;flex-direction:column;min-width:0;line-height:1}
.brand-copy strong{font-size:18px;line-height:1;letter-spacing:-.045em;font-weight:790;white-space:nowrap;text-transform:lowercase}
.brand-copy small{margin-top:5px;font-size:10.5px;line-height:1.15;color:#647069;white-space:nowrap;font-weight:520}
.brand-copy small b{color:#136b59;font-weight:720}
.brand[data-inverse=true] .brand-copy small{color:rgba(255,255,255,.72)}
.brand[data-inverse=true] .brand-copy small b{color:#9fcfd2}
.brand[data-compact=true] .brand-house{width:40px;height:40px;flex-basis:40px}
@media(max-width:420px){.mobile-brand .brand-copy strong{font-size:16px}.mobile-brand .brand-copy small{font-size:9.5px}}

/* Shared app navigation v4: calm, light, collapsible menu for both roles. */
:root{
  --eh-bg:#F7F8F7;--eh-surface:#FFFFFF;--eh-soft:#F4FAF6;--eh-soft-2:#EAF5EE;
  --eh-text:#171A18;--eh-muted:#66706A;--eh-border:#E4E8E5;--eh-border-strong:#D5DCD7;
  --eh-accent:#105258;--eh-accent-hover:#1b8569;--eh-accent-soft:#EAF5EE;
  --eh-brand:#0A3539;--eh-brand-2:#105258;
}
.app-shell-v3{background:var(--eh-bg)}
.app-shell-v3 .workspace-shell{background:var(--eh-bg);grid-template-columns:72px minmax(0,1fr)}
.app-shell-v3 .desktop-sidebar{background:var(--eh-surface);border-right:1px solid var(--eh-border);padding:14px 10px}
.app-shell-v3 .app-menu{width:100%}
.app-shell-v3 .app-menu summary{list-style:none;cursor:pointer;min-height:44px;border-radius:12px;display:flex;align-items:center;gap:10px;padding:8px 11px;color:var(--eh-brand);font-size:12px;font-weight:650;user-select:none}
.app-shell-v3 .app-menu summary::-webkit-details-marker{display:none}
.app-shell-v3 .app-menu summary:hover{background:var(--eh-soft)}
.app-shell-v3 .app-menu summary:focus-visible,.app-shell-v3 .mobile-menu summary:focus-visible{outline:3px solid color-mix(in srgb,var(--eh-accent) 35%,transparent);outline-offset:2px}
.app-shell-v3 .app-menu-mark{display:grid;place-items:center;flex:0 0 30px;width:30px;height:30px;border:1px solid var(--eh-border);border-radius:9px;color:var(--eh-accent)}
.app-shell-v3 .app-menu-summary-label{display:none}
.app-shell-v3 .app-menu-content{padding-top:10px}
.app-shell-v3 .app-menu:not([open]) .app-menu-content{display:none}
.app-shell-v3 .app-menu[open] .app-menu-summary{background:var(--eh-soft);margin-bottom:4px}
.app-shell-v3 .workspace-shell:has(.app-menu[open]){grid-template-columns:220px minmax(0,1fr)}
.app-shell-v3 .app-menu[open] .app-menu-summary-label{display:inline}
.app-shell-v3 .app-menu:not([open]) .sidebar-brand,.app-shell-v3 .app-menu:not([open]) .sidebar-footer{display:none}
.app-shell-v3 .app-menu:not([open]) .sidebar-nav a{justify-content:center;padding-inline:4px}
.app-shell-v3 .app-menu:not([open]) .sidebar-nav a>span:not(.sidebar-icon){display:none}
.app-shell-v3 .app-menu[open] .sidebar-nav a{min-height:44px}
.app-shell-v3 .app-menu[open] .sidebar-nav a.active{background:var(--eh-soft-2);color:var(--eh-brand)}
.app-shell-v3 .app-menu[open] .sidebar-nav a:hover{background:var(--eh-soft)}
.app-shell-v3 .app-menu[open] .sidebar-brand{padding-bottom:22px}
.app-shell-v3 .app-menu[open] .sidebar-footer{border-color:var(--eh-border)}
.app-shell-v3 .topbar-v3{background:var(--eh-surface);border-color:var(--eh-border);-webkit-backdrop-filter:none;backdrop-filter:none}
.app-shell-v3 .bottom-nav{-webkit-backdrop-filter:none;backdrop-filter:none}
.app-shell-v3 .top-actions>a:hover{background:var(--eh-soft)}
.app-shell-v3 .screen-v3{background:var(--eh-bg)}
.app-shell-v3 .btn.primary,.app-shell-v3 .send-action{background:var(--eh-accent);border-color:var(--eh-accent);color:#fff}
.app-shell-v3 .btn.primary:hover,.app-shell-v3 .send-action:hover{background:var(--eh-accent-hover)}
.mobile-menu{display:none}
@media(max-width:720px){
  .app-shell-v3 .workspace-shell{grid-template-columns:1fr}
  .app-shell-v3 .topbar-v3{gap:10px;justify-content:flex-start}
  .app-shell-v3 .mobile-brand{order:2;min-width:0}
  .app-shell-v3 .mobile-menu{display:block;order:1;position:relative}
  .app-shell-v3 .mobile-menu summary{list-style:none;display:flex;align-items:center;justify-content:center;gap:5px;min-width:44px;min-height:44px;padding:8px;border-radius:12px;color:var(--eh-brand);cursor:pointer}
  .app-shell-v3 .mobile-menu summary::-webkit-details-marker{display:none}
  .app-shell-v3 .mobile-menu summary span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .app-shell-v3 .mobile-menu-panel{position:absolute;top:52px;left:-4px;width:min(270px,calc(100vw - 28px));padding:8px;background:var(--eh-surface);border:1px solid var(--eh-border);border-radius:16px;box-shadow:0 14px 34px rgba(18,60,42,.14);z-index:60}
  .app-shell-v3 .mobile-menu-panel a{display:flex;align-items:center;gap:11px;min-height:44px;padding:10px 12px;border-radius:10px;color:var(--eh-text);font-size:14px;font-weight:560}
  .app-shell-v3 .mobile-menu-panel a:hover,.app-shell-v3 .mobile-menu-panel a.active{background:var(--eh-soft-2);color:var(--eh-brand)}
  .app-shell-v3 .mobile-menu-panel a svg{color:var(--eh-accent)}
  .app-shell-v3 .page-context{order:3;margin-right:auto}
  .app-shell-v3 .top-actions{order:4}
}
@media(min-width:721px) and (max-width:920px){.app-shell-v3 .workspace-shell:has(.app-menu[open]){grid-template-columns:190px minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.app-shell-v3 *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}}

/* Auth surfaces: the Anmeldung draft is quiet, warm and action-led. */
.auth-page{min-height:100dvh;display:grid;place-items:center;background:var(--eh-bg);padding:32px 20px}
.auth-card{width:min(460px,100%);background:var(--eh-surface);border:1px solid var(--eh-border);border-radius:24px;padding:clamp(24px,5vw,40px);box-shadow:0 18px 60px rgba(18,60,42,.08);gap:18px}
.auth-card .brand{margin-bottom:8px;color:var(--eh-brand)}
.auth-card h1{margin:0;font-size:clamp(30px,5vw,38px);line-height:1.08;letter-spacing:-.04em;color:var(--eh-brand);font-weight:650}
.auth-card>p{font-size:16px;line-height:1.55;color:var(--eh-muted);margin:0 0 4px}
.auth-card label{font-size:13px;font-weight:650;color:var(--eh-text);gap:8px}
.auth-card input,.auth-card textarea,.auth-card select{min-height:48px;border:1px solid var(--eh-border-strong);border-radius:12px;background:#fff;color:var(--eh-text);padding:12px 14px}
.auth-card input:focus,.auth-card textarea:focus,.auth-card select:focus{border-color:var(--eh-accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--eh-accent) 16%,transparent);outline:none}
.auth-card .btn.primary{min-height:50px;border-radius:12px;background:var(--eh-accent);font-size:14px;font-weight:700}
.auth-card .btn.primary:hover{background:var(--eh-accent-hover)}
.auth-card>small{font-size:13px;line-height:1.5;color:var(--eh-muted);text-align:center}
.auth-card>small a{color:var(--eh-accent);font-weight:700;text-decoration:underline;text-underline-offset:3px}
.auth-card .alert{border-radius:12px;line-height:1.45}
@media(max-width:520px){.auth-page{align-items:start;padding:calc(24px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom))}.auth-card{border-radius:20px;padding:24px 20px;box-shadow:0 12px 36px rgba(18,60,42,.07)}}

/* =========================================================================
   T-0005 · Notion-1:1 owner convergence (dashboard, drawer, welcome, role,
   register). Reference: public/notion/notion-originals (390px first).
   Palette measured from the originals:
   cream #fbf9f7 · drawer #f5f3f1 · ink #1c2129 · teal #066a6f (actions)
   deep teal #02545a (FAB/send/crown) · mint surface #e8f0ec · mint icon #eaf4ee
   ========================================================================= */
:root{
  --ehn-cream:#fbf9f7;
  --ehn-cream-2:#f5f3f1;
  --ehn-ink:#1c2129;
  --ehn-teal:#105258;
  --ehn-teal-deep:#0a3539;
  --ehn-mint:#e8f0ec;
  --ehn-mint-soft:#eaf4ee;
  --ehn-muted:#5b6d73;
}

/* ---------- owner app shell (mobile-first) ---------- */
.app-shell-v3.ehn-owner{background:var(--ehn-cream);min-height:100dvh}
.ehn-owner .side-menu{background:var(--ehn-cream-2)}
.ehn-owner .ehn-center-logo{display:none}
.app-shell-v3.ehn-owner .top-user-avatar{background:#e9e2d2;color:var(--ehn-ink);font-weight:800;font-size:13px}

@media(max-width:920px){
  .app-shell-v3.ehn-owner{background:var(--ehn-cream)}
  .app-shell-v3.ehn-owner .mobile-brand{display:none}
  .app-shell-v3.ehn-owner .topbar-v3{background:var(--ehn-cream);border-bottom:0;backdrop-filter:none;height:64px;padding:8px 12px 4px;position:relative;justify-content:space-between;gap:8px}
  .app-shell-v3.ehn-owner .ehn-center-logo{display:flex;position:absolute;left:50%;top:6px;transform:translateX(-50%);align-items:center;gap:2px;text-decoration:none}
  .app-shell-v3.ehn-owner .bottom-nav{display:none}
  .app-shell-v3.ehn-owner .screen-v3{padding:6px 14px 110px;max-width:none}
  .app-shell-v3.ehn-owner .screen-v3.ehn-dash-screen{padding:0 0 132px}
  .ehn-center-logo-text{display:flex;flex-direction:column;line-height:.95}
  .ehn-center-logo .own-logo-line1{font-size:17px;font-weight:800;color:var(--ehn-ink);letter-spacing:-.4px}
  .ehn-center-logo .own-logo-line2{font-family:"Snell Roundhand","Brush Script MT",cursive;font-size:16px;color:#105258;margin-left:14px}
  .app-shell-v3 .ehn-owner-top .top-actions{gap:8px;order:4}
  .app-shell-v3 .ehn-owner-top .notification-link{position:relative;width:42px;height:42px;border-radius:15px;background:#ffffff;box-shadow:0 2px 8px rgba(28,33,41,.07);display:grid;place-items:center;color:var(--ehn-ink)}
  .app-shell-v3 .ehn-owner-top .notification-link:hover{background:#ffffff}
  .app-shell-v3 .ehn-owner-top .notification-link .ehn-bell-dot{position:absolute;top:7px;right:8px;width:8px;height:8px;border-radius:50%;background:#1b8569}
  .app-shell-v3 .ehn-owner-top .top-user-avatar{width:38px;height:38px}
}

/* ---------- burger + drawer (Menuepunkte_01 / menuepunkte_offen) ---------- */
/* T-0206 W1: the topbar brand lockups overflowed their 64px bar at 390px
   (house SVG at natural size + wrapped wordmark). Keep them compact and
   single-line like the Notion topbar reference. */
@media(max-width:920px){
  .app-shell-v3 .mobile-brand .brand{flex-wrap:nowrap}
  .app-shell-v3 .mobile-brand .brand-house{width:28px;height:28px;flex:0 0 28px}
  .app-shell-v3 .mobile-brand .brand-copy{gap:0}
  .app-shell-v3 .mobile-brand .brand-copy strong{font-size:14px}
  .app-shell-v3 .mobile-brand .brand-copy small{display:none}
  .app-shell-v3 .ehn-center-logo{top:2px;flex-direction:column;align-items:center;gap:0;height:60px;overflow:visible}
  .app-shell-v3 .ehn-center-logo .ehn-center-logo-house{width:34px;height:22px}
  .app-shell-v3 .ehn-center-logo .ehn-center-logo-text{position:static;margin-top:-4px}
  .app-shell-v3 .ehn-center-logo .ehn-center-logo-house{position:static}
  .app-shell-v3 .ehn-center-logo .own-logo-line1{font-size:14px;line-height:1}
  .app-shell-v3 .ehn-center-logo .own-logo-line2{font-size:12px;line-height:1;margin-left:8px;margin-top:1px}
}
.ehn-menu{display:none}
@media(max-width:920px){
  .app-shell-v3.ehn-owner .ehn-menu{display:block;order:0;position:static}
  .app-shell-v3 .ehn-menu summary{list-style:none;display:grid;place-items:center;width:44px;height:44px;border-radius:12px;color:var(--ehn-ink);cursor:pointer;padding:0;background:transparent;position:relative;z-index:70}
  .ehn-menu[open] summary svg{opacity:0}
  .ehn-menu summary::-webkit-details-marker{display:none}
  .ehn-menu summary span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .ehn-drawer{transform:none;width:min(88%,360px);background:var(--ehn-cream-2);border-radius:0 26px 26px 0;box-shadow:16px 0 50px rgba(28,33,41,.12);padding:26px 20px 18px;z-index:60}
}
.ehn-acc{display:flex;flex-direction:column;gap:2px;margin-top:22px}
.ehn-acc-sec>summary{list-style:none;cursor:pointer}
.ehn-acc-sec>summary::-webkit-details-marker{display:none}
.ehn-acc-chevron{display:grid;place-items:center;width:28px;height:28px}
.ehn-acc-chevron svg{transition:transform .18s ease;transform:rotate(90deg)}
.ehn-acc-sec.ehn-acc-open .ehn-acc-head .ehn-acc-chevron svg{transform:rotate(-90deg)}
.ehn-acc-head{padding:12px 2px}
.ehn-acc-body{display:flex;flex-direction:column;padding:2px 0 12px 8px}
.ehn-acc-row{margin:0;padding:0;border:0}
.ehn-acc-link{display:flex;align-items:center;gap:12px;width:100%;background:none;border:0;padding:8px 6px;font-family:inherit;font-size:14.5px;font-weight:600;color:#33484f;text-align:left;cursor:pointer;border-radius:10px}
.ehn-acc-link:hover{background:rgba(28,33,41,.045)}
.ehn-acc-link.ehn-acc-active{color:var(--ehn-teal);font-weight:800}
.ehn-acc-ico{display:grid;place-items:center;width:20px;flex:0 0 20px;color:#33484f}
.ehn-acc-ico svg{display:block}

/* ---------- owner dashboard (Homesceen_EH_02) ---------- */
.ehn-dash{padding-bottom:8px}
.ehn-onboard-banner{margin:10px 16px 0;background:var(--ehn-mint);border:0;border-radius:16px;padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}
.ehn-onboard-banner p{margin:0;font-size:13px;font-weight:600;color:var(--ehn-ink)}
.ehn-onboard-banner a{color:var(--ehn-teal);font-weight:800;font-size:13px}
.qa-card,.ov-card,.ki-card,.fab-plus{color:inherit}
.fab-plus{background:var(--ehn-teal-deep);border:5px solid var(--ehn-cream)}
.ki-send,.ehn-composer .send-action{background:var(--ehn-teal-deep)}
.app-shell-v3 .screen-v3 .qa-card{text-decoration:none}
.app-shell-v3 .screen-v3 .ov-card{text-decoration:none}

/* composer inside the KI card: white pill input + round send + Foto/Sprache chips */
.ehn-composer{margin-top:14px}
.ehn-owner .ehn-composer .agent-composer{position:relative;display:block;background:transparent;border:0;padding:0;margin:0;box-shadow:none}
.ehn-owner .ehn-composer .agent-composer textarea{width:100%;height:54px;min-height:54px;border:0;border-radius:30px;background:#ffffff;box-shadow:0 5px 18px rgba(28,33,41,.05);padding:17px 64px 0 22px;font-size:15px;line-height:1.3;color:var(--ehn-ink);resize:none;margin:0}
.ehn-owner .ehn-composer .agent-composer textarea:focus{outline:none;box-shadow:0 5px 18px rgba(28,33,41,.05),0 0 0 2px rgba(2,84,90,.25)}
.ehn-owner .ehn-composer .agent-composer .agent-actions{display:flex;align-items:center;gap:10px;margin-top:12px}
.ehn-owner .ehn-composer .agent-composer .icon-action{display:inline-flex;align-items:center;gap:8px;background:#ffffff;border:0;border-radius:24px;padding:11px 18px;font-size:13.5px;font-weight:600;color:var(--ehn-ink);cursor:pointer;box-shadow:0 2px 8px rgba(28,33,41,.05)}
.ehn-owner .ehn-composer .agent-composer .icon-action input{position:absolute;width:1px;height:1px;opacity:0}
.ehn-owner .ehn-composer .agent-composer .icon-action.recording{box-shadow:0 0 0 2px rgba(201,32,32,.35)}
.ehn-owner .ehn-composer .agent-composer .send-action{position:absolute;top:3px;right:5px;width:48px;height:48px;border-radius:50%;border:0;background:var(--ehn-teal-deep);color:#fff;display:grid;place-items:center;cursor:pointer}
.ehn-owner .ehn-composer .agent-composer .send-action:disabled{opacity:.55;cursor:default}
.ehn-owner .ehn-composer .agent-composer .send-action span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ehn-owner .ehn-composer .agent-composer .owner-composer-status{margin:8px 4px 0;font-size:11.5px;color:var(--ehn-muted)}
.ki-more{display:grid;place-items:center;width:34px;height:34px;border-radius:50%}

/* ---------- welcome (LogIn_oder_Neu) ---------- */
.wl-page{min-height:100dvh;background:var(--ehn-cream);display:flex;flex-direction:column;align-items:center;padding:26px 20px 30px;text-align:center}
.wl-logo{display:flex;flex-direction:column;align-items:center;gap:0}
.wl-logo-text{display:flex;flex-direction:column;line-height:.9;margin-top:-4px}
.wl-logo-text .wl-1{font-size:31px;font-weight:800;letter-spacing:-.6px;color:var(--ehn-ink)}
.wl-logo-text .wl-2{font-family:"Snell Roundhand","Brush Script MT",cursive;font-size:29px;color:#105258;margin-left:26px}
.wl-tagline{font-size:13.5px;color:var(--ehn-ink);margin:6px 0 0;font-weight:600}
.wl-tagline span{color:#105258;font-weight:700}
.wl-title{font-size:25px;font-weight:800;color:var(--ehn-ink);margin:26px 0 0;letter-spacing:-.3px}
.wl-sub{font-size:14.5px;line-height:1.5;color:#105258;margin:10px 0 0;max-width:330px}
.wl-hero{width:calc(100% + 40px);max-width:none;margin:14px -20px 0;display:block}
.wl-cards{width:100%;display:flex;flex-direction:column;gap:14px;margin-top:18px}
.wl-card{display:flex;align-items:center;gap:14px;background:#fff;border:1px solid rgba(28,33,41,.04);border-radius:20px;padding:18px 16px;text-align:left;box-shadow:0 6px 18px rgba(28,33,41,.05)}
.wl-card-mint{background:#f1f5f2;border-color:transparent}
.wl-card-icon{width:54px;height:54px;border-radius:50%;background:#dce8e0;display:grid;place-items:center;flex:0 0 54px}
.wl-card-text{flex:1;display:flex;flex-direction:column;gap:3px}
.wl-card-text strong{font-size:16.5px;font-weight:800;color:var(--ehn-ink)}
.wl-card-text span{font-size:13px;color:var(--ehn-muted);line-height:1.4}
.wl-card-arrow{display:grid;place-items:center}
.wl-benefits{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px}
.wl-benefit{display:flex;flex-direction:column;align-items:center;gap:4px}
.wl-benefit svg{margin-bottom:2px}
.wl-benefit strong{font-size:11.5px;font-weight:800;color:var(--ehn-ink)}
.wl-benefit span{font-size:10.5px;color:var(--ehn-muted);line-height:1.35;max-width:104px}
.wl-support{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#f1f5f2;border-radius:20px;padding:16px 18px;margin-top:24px;text-align:left}
.wl-support-icon{width:44px;height:44px;border-radius:50%;background:#dce8e0;display:grid;place-items:center}

/* ---------- role (first_action) ---------- */
.role2-page{min-height:100dvh;background:var(--ehn-cream);display:flex;flex-direction:column;padding:26px 18px 30px;align-items:center}
.role2-logo{display:flex;align-items:center;gap:4px}
.role2-logo-word{display:flex;align-items:baseline;line-height:1}
.role2-logo-green{font-size:24px;font-weight:800;letter-spacing:-.5px;color:#105258}
.role2-logo-ink{font-size:24px;font-weight:800;letter-spacing:-.5px;color:var(--ehn-ink)}
.role2-title{font-size:31px;font-weight:800;color:#0e2f43;text-align:center;line-height:1.12;letter-spacing:-.5px;margin:26px 0 0}
.role2-sub{font-size:14.5px;line-height:1.5;color:#105258;text-align:center;margin:12px 0 0}
.role2-owner-card{position:relative;width:100%;background:#fff;border-radius:24px;margin-top:22px;overflow:hidden;box-shadow:0 10px 30px rgba(28,33,41,.07);display:flex;flex-direction:column}
.role2-owner-photo{position:absolute;top:0;right:0;bottom:38%;width:56%;pointer-events:none}
.role2-owner-photo img{width:100%;height:100%;object-fit:cover;object-position:center}
.role2-owner-copy{position:relative;z-index:1;padding:24px 20px 18px;max-width:62%}
.role2-owner-copy h2{font-size:26px;line-height:1.1;font-weight:800;color:#0b5c62;letter-spacing:-.4px;margin:0}
.role2-owner-copy h2::after{content:"";display:block;width:26px;height:3px;border-radius:2px;background:#0b5c62;margin-top:10px;opacity:.55}
.role2-owner-copy p{font-size:13px;line-height:1.5;color:#105258;margin:12px 0 0}
.role2-owner-cta{display:inline-flex;align-items:center;gap:9px;margin-top:16px;background:var(--ehn-teal);color:#fff;border:0;border-radius:999px;padding:12px 18px;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 8px 20px rgba(16,82,88,.28)}
.role2-owner-cta:active{transform:scale(.98)}
.role2-owner-cta-house{display:grid;place-items:center}
.role2-owner-cta-arrow{margin-left:2px}
.role2-owner-benefits{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:14px 12px 18px;border-top:1px solid #eef2f0}
.role2-benefit{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center}
.role2-benefit strong{font-size:10px;font-weight:800;color:var(--ehn-ink);line-height:1.25}
.role2-benefit span{font-size:8.5px;color:var(--ehn-muted);line-height:1.3}
.role2-pro-row{width:100%;display:flex;align-items:center;gap:14px;background:#f1f5f2;border:0;border-radius:20px;padding:18px 16px;margin-top:16px;text-align:left;cursor:pointer;font-family:inherit}
.role2-pro-icon{width:52px;height:52px;border-radius:50%;background:#dce8e0;display:grid;place-items:center;flex:0 0 52px}
.role2-pro-arrow{display:grid;place-items:center}
.role2-trust{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;margin-top:22px}
.role2-trust-icon{width:42px;height:42px;border-radius:50%;background:#dce8e0;display:grid;place-items:center;flex:0 0 42px}

/* ---------- register (eigentumer.login) ---------- */
.ehn-reg-page{min-height:100dvh;background:var(--ehn-cream);display:flex;flex-direction:column;align-items:center;padding:24px 16px 30px}
.ehn-reg-head{position:relative;width:100%;display:flex;flex-direction:column;align-items:center}
.ehn-reg-back{position:absolute;left:2px;top:12px;display:grid;place-items:center;width:40px;height:40px;border-radius:14px;background:#fff;box-shadow:0 2px 8px rgba(28,33,41,.07)}
.ehn-reg-hero{width:100%;max-width:430px;margin-top:18px}
.ehn-reg-hero h1{font-size:30px;font-weight:800;color:var(--ehn-ink);line-height:1.12;letter-spacing:-.5px;margin:0}
.ehn-reg-hero p{margin:12px 0 0;font-size:14px;line-height:1.55;color:#105258}
.ehn-reg-page .green{color:#0b5c62;font-weight:800}
.ehn-reg-form-section{width:100%;max-width:430px;margin-top:26px}
.ehn-reg-form-section h2{text-align:center;font-size:20px;font-weight:800;color:var(--ehn-ink)}
.ehn-reg-form{display:flex;flex-direction:column;gap:12px;margin-top:18px}
.ehn-two{gap:10px}
.ehn-field{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid #e3ece8;border-radius:14px;padding:14px 16px}
.ehn-field input{border:0;outline:0;flex:1;font-size:14.5px;background:transparent;color:var(--ehn-ink);min-width:0;padding:0}
.ehn-field input:focus{box-shadow:none}
.ehn-field textarea{border:0;outline:0;flex:1;font-size:14px;background:transparent;color:var(--ehn-ink);min-width:0;resize:vertical;padding:0}
.ehn-field-area{align-items:flex-start}
.ehn-field-area svg{margin-top:2px}
.ehn-field-hint{font-size:11px;color:var(--ehn-muted);white-space:nowrap}
.ehn-field-file input[type="file"]{font-size:12px}
.ehn-file-label{font-size:14px;font-weight:600;color:var(--ehn-ink);white-space:nowrap}
.ehn-reg-form .btn.primary{background:var(--ehn-teal);border-radius:14px;min-height:54px;font-size:15.5px;font-weight:800;margin-top:6px}
.ehn-reg-form .btn.primary:hover{background:#105258}
.ehn-reg-form .alert.error{background:#fdeeee;color:#8f1f1f;border-radius:12px;border:0;font-size:13px}
.ehn-reg-page .auth-footer{font-size:14px}
.sr-only-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* =========================================================================
   T-0005 calibration pass 2 — order-proof overrides + reference geometry
   (reference-measured @390: margins 20px, card gaps 8px, KI input h44,
   overview cards h~85, drawer icon tiles ~46px)
   ========================================================================= */

/* ---------- register fields: row layout must win over global label rule ---------- */
.ehn-field{flex-direction:row}

/* ---------- order-proof owner shell overrides (homeowner.module.css loads last) ---------- */
@media(max-width:920px){
  main.app-page.ehn-owner header.topbar-v3{
    height:62px;padding:8px 12px 4px;position:relative;justify-content:space-between;gap:8px;
    background:var(--ehn-cream);border-bottom:0;
    -webkit-backdrop-filter:none!important;backdrop-filter:none!important;
  }
  main.app-page.ehn-owner .screen-v3.ehn-dash-screen{padding:0 0 128px!important;width:100%;max-width:none}
  main.app-page.ehn-owner .bottom-nav{display:none!important}
}
main.app-page.ehn-owner{--owner-bg:var(--ehn-cream)}
.app-shell-v3.ehn-owner .workspace-shell{background:var(--ehn-cream)}

/* ---------- centered header logo (house right, wordmark overlapping) ---------- */
@media(max-width:920px){
  main.app-page.ehn-owner .ehn-center-logo{
    display:block;position:absolute;left:50%;top:5px;transform:translateX(-50%);
    width:152px;height:54px;
  }
  .ehn-center-logo-house{position:absolute;right:2px;top:0}
  .ehn-center-logo-text{position:absolute;left:2px;bottom:1px;display:flex;flex-direction:column;line-height:1}
  .ehn-center-logo .own-logo-line1{font-size:20px;font-weight:800;color:var(--ehn-ink);letter-spacing:-.4px;line-height:1}
  .ehn-center-logo .own-logo-line2{font-family:"Snell Roundhand","Brush Script MT",cursive;font-size:19px;color:#105258;margin-left:24px;line-height:1;margin-top:1px}
}

/* ---------- dashboard geometry (Homesceen_EH_02 @390) ---------- */
@media(max-width:920px){
  .qa-row{padding:12px 20px 0;gap:8px}
  .qa-card{min-height:138px;padding:12px 8px 9px;border-radius:16px;gap:4px}
  .qa-icon{width:42px;height:42px}
  .qa-icon.qa-dark{background:var(--ehn-ink)}
  .qa-card strong{font-size:14.5px}
  .qa-card span{font-size:11px;line-height:1.32}
  .qa-arrow{margin-top:auto}
  .qa-arrow svg{width:13px;height:13px}
  .ki-card{margin:10px 20px 0;padding:14px 12px 12px;border-radius:22px}
  .ki-robot svg{width:48px;height:48px}
  .ki-title-row h2{font-size:18px;white-space:nowrap}
  .ki-badge{font-size:10px;padding:2px 7px;border-radius:6px}
  .ki-text{margin:6px 0 0 62px;font-size:12px;line-height:1.42}
  .ki-more{width:30px;height:30px}
  .ki-more svg{width:14px;height:14px}
  .ehn-composer{margin-top:10px}
  .ehn-owner .ehn-composer .agent-composer textarea{height:46px;min-height:46px;border-radius:26px;padding:13px 54px 0 18px;font-size:13px}
  .ehn-owner .ehn-composer .agent-composer .send-action{width:40px;height:40px;top:3px;right:3px}
  .ehn-owner .ehn-composer .agent-composer .send-action svg{width:15px;height:15px}
  .ehn-owner .ehn-composer .agent-composer .agent-actions{gap:8px;margin-top:8px}
  .ehn-owner .ehn-composer .agent-composer .icon-action{padding:8px 13px;font-size:11.5px;gap:6px}
  .ehn-owner .ehn-composer .agent-composer .icon-action svg{width:14px;height:14px}
  .own-section-title{padding:18px 20px 0;font-size:17px}
  .overview-grid{padding:10px 20px 0;gap:8px}
  .ov-card{padding:12px 10px;gap:8px;border-radius:16px}
  .ov-icon{width:46px;height:46px;flex-basis:46px}
  .ov-icon svg{width:24px;height:24px}
  .ov-icon-lg{width:54px;height:54px;flex-basis:54px}
  .ov-text strong{font-size:13.5px}
  .ov-text span{font-size:11px;margin-top:2px}
  .ov-wide{width:calc(100% - 40px);margin:10px 20px 0;padding:14px 10px}
  .ov-card svg:last-child{width:13px;height:13px;flex:0 0 13px}
  .fab-plus{width:58px;height:58px;bottom:20px;border:5px solid var(--ehn-cream)}
  .fab-plus svg{width:26px;height:26px}
  .ehn-onboard-banner{margin:8px 20px 0}
}

/* ---------- drawer sizing (Menuepunkte @390) ---------- */
@media(max-width:920px){
  .ehn-drawer{padding:20px 18px 16px}
  .ehn-drawer .sm-logo{width:128px;height:64px}
  .ehn-drawer .sm-logo svg{width:66px;height:48px}
  .ehn-drawer .sm-close{width:42px;height:42px;border-radius:12px}
  .ehn-acc{margin-top:14px;gap:0}
  .ehn-acc-head{padding:10px 2px;gap:14px}
  .ehn-drawer .sm-icon{width:46px;height:46px;border-radius:14px}
  .ehn-drawer .sm-label{font-size:16px;letter-spacing:-.2px}
  .ehn-acc-body{padding:0 0 10px 6px}
  .ehn-acc-link{padding:7px 6px;font-size:13px;gap:10px}
  .ehn-drawer .sm-divider{margin:14px 0}
  .ehn-drawer .sm-pro-card{padding:14px;border-radius:16px;gap:12px}
  .ehn-drawer .sm-pro-icon{width:46px;height:46px}
  .ehn-drawer .sm-pro-text strong{font-size:14px}
  .ehn-drawer .sm-pro-text span{font-size:11.5px}
  .ehn-drawer .sm-logout{padding:14px;font-size:15px;border-radius:12px;border-width:1.5px;margin-top:14px}
  .ehn-drawer .sm-footer{font-size:11px;padding-top:16px}
}

/* ---------- welcome compression (fit 844 like LogIn_oder_Neu) ---------- */
.wl-page{padding:22px 20px 24px}
.wl-logo-text{line-height:1;margin-top:0;gap:1px}
.wl-title{margin-top:18px;font-size:24px}
.wl-sub{margin-top:8px;font-size:13.5px}
.wl-hero{margin-top:10px}
.wl-cards{gap:12px;margin-top:14px}
.wl-card{padding:14px;border-radius:18px}
.wl-card-icon{width:50px;height:50px;flex-basis:50px}
.wl-card-text strong{font-size:15.5px}
.wl-card-text span{font-size:12px}
.wl-benefits{margin-top:16px;gap:8px}
.wl-support{margin-top:16px;padding:13px 16px;border-radius:18px}

/* ---------- role compression + owner card overlap fix ---------- */
.role2-page{padding:22px 18px 24px}
.role2-title{margin-top:18px;font-size:29px}
.role2-sub{margin-top:10px;font-size:13.5px}
.role2-owner-card{margin-top:16px;border-radius:22px}
.role2-owner-photo{width:47%;bottom:34%}
.role2-owner-copy{max-width:55%;padding:20px 4px 14px 18px}
.role2-owner-copy h2{font-size:23px}
.role2-owner-copy p{font-size:12px;margin-top:10px}
.role2-owner-cta{margin-top:12px;padding:10px 14px;font-size:12.5px;gap:7px;white-space:nowrap}
.role2-owner-benefits{padding:12px 10px 14px;gap:6px}
.role2-pro-row{margin-top:12px;padding:15px 14px}
.role2-pro-icon{width:48px;height:48px;flex-basis:48px}
.role2-trust{margin-top:14px}

/* =========================================================================
   T-0005 calibration pass 3 — drawer full-bleed, header height 96,
   chip labels, overview overflow, logo stacking fixes
   ========================================================================= */

/* ---------- KI chips keep their labels (module hides spans at <=420px) ---------- */
main.app-page.ehn-owner .ehn-composer .agent-composer .icon-action span{display:inline}

/* ---------- overview cards must not overflow the 2-col row ---------- */
.ehn-owner .ov-card{min-width:0}
.ehn-owner .ov-text{min-width:0}
.ehn-owner .ov-text strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:920px){
  .ehn-owner .ov-text strong{font-size:12.5px}
}

/* ---------- taller reference-style header (96px, items top-aligned) ---------- */
@media(max-width:920px){
  main.app-page.ehn-owner header.topbar-v3{height:96px;padding:12px 12px 0;align-items:flex-start}
  main.app-page.ehn-owner .ehn-menu summary{margin-top:8px}
  main.app-page.ehn-owner .ehn-owner-top .top-actions{margin-top:4px}
  main.app-page.ehn-owner .ehn-center-logo{top:2px;width:172px;height:88px}
  .ehn-center-logo-house{right:2px;top:0;width:118px;height:80px}
  .ehn-center-logo-text{left:4px;bottom:4px}
  .ehn-center-logo .own-logo-line1{font-size:26px}
  .ehn-center-logo .own-logo-line2{font-size:24px;margin-left:34px;margin-top:2px}
  main.app-page.ehn-owner .screen-v3.ehn-dash-screen{padding:0 0 128px}
  main.app-page.ehn-owner .workspace-main{padding-top:max(44px, env(safe-area-inset-top));background:var(--ehn-cream)}
  .qa-row{padding-top:14px}
}

/* ---------- drawer: full-bleed panel + wordmark stacking fix ---------- */
@media(max-width:920px){
  .ehn-drawer{width:100%;max-width:none;border-radius:0;box-shadow:none}
  .ehn-drawer .own-logo-text{bottom:6px}
  .ehn-drawer .own-logo-line1{font-size:22px;line-height:1.05;letter-spacing:-.4px}
  .ehn-drawer .own-logo-line2{font-size:21px;line-height:1.05;margin-left:26px;margin-top:1px}
  .ehn-drawer .sm-icon{width:48px;height:48px}
  .ehn-drawer .sm-label{font-size:17px}
  .ehn-acc-head{padding:11px 2px;gap:14px}
  .ehn-acc-link{font-size:13px;padding:6px}
}

/* =========================================================================
   T-0005 calibration pass 4 — overview fit, text metrics per reference
   ========================================================================= */
@media(max-width:920px){
  .qa-card span{font-size:10px;line-height:1.25}
  .ki-text{font-size:10.5px;line-height:1.4;margin-left:78px;margin-top:4px}
  .ki-robot svg{width:40px;height:40px}
  .overview-grid{padding:10px 20px 0;gap:8px}
  .ehn-owner .ov-card{padding:10px 8px;gap:6px}
  .ehn-owner .ov-icon{width:38px;height:38px;flex-basis:38px}
  .ehn-owner .ov-icon svg{width:20px;height:20px}
  .ehn-owner .ov-icon-lg{width:48px;height:48px;flex-basis:48px}
  .ehn-owner .ov-text strong{font-size:11px}
  .ehn-owner .ov-text span{font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ehn-owner .ov-card > svg:last-child{width:12px;height:12px;flex-basis:12px}
  .own-section-title{font-size:16.5px;padding-top:16px}
}

/* =========================================================================
   T-0005 calibration pass 5 — welcome + role rhythm per reference rows
   ========================================================================= */
.wl-page{padding:44px 20px 28px}
.wl-title{margin-top:38px}
.wl-sub{margin-top:10px}
.wl-hero{margin-top:14px}
.wl-cards{margin-top:18px}
.wl-card{padding:15px 16px;border-radius:20px}
.wl-card-icon{width:50px;height:50px;flex-basis:50px}
.wl-benefits{margin-top:22px}
.wl-support{margin-top:22px;padding:15px 18px}

.role2-page{padding:40px 18px 24px}
.role2-title{margin-top:40px;font-size:30px}
.role2-sub{margin-top:16px;font-size:14px}
.role2-owner-card{margin-top:28px}
.role2-owner-photo{width:45%;bottom:32%}
.role2-owner-copy{max-width:52%;padding:22px 2px 14px 20px}
.role2-pro-row{margin-top:26px}
.role2-trust{margin-top:38px}

/* =========================================================================
   T-0005 calibration pass 6 — welcome typography, role card height
   ========================================================================= */
.wl-title{font-size:22.5px;margin-top:40px}
.wl-sub{font-size:13px;max-width:320px}
.wl-logo-text .wl-2{margin-top:2px}
.role2-owner-copy{padding-top:30px}
.role2-owner-cta{margin-top:18px}
.role2-owner-benefits{padding:16px 10px 20px}
.role2-owner-photo{bottom:30%}

/* =========================================================================
   T-0005 calibration pass 7 — welcome/role row alignment (measured)
   ========================================================================= */
.wl-title{margin-top:48px;font-size:22.5px}
.wl-sub{margin-top:18px;font-size:13px}
.wl-hero{margin-top:21px}
.wl-cards{margin-top:18px}
.wl-card{padding:18px 16px}
.wl-benefits{margin-top:20px}
.wl-support{margin-top:23px}

.role2-page{display:flex}
.role2-title{margin-top:52px;font-size:28px}
.role2-sub{margin-top:18px;font-size:13.5px}
.role2-owner-card{margin-top:12px}
.role2-owner-copy{padding-top:22px}
.role2-owner-cta{margin-top:14px}
.role2-owner-benefits{padding:12px 10px 16px}
.role2-pro-row{margin-top:22px}
.role2-trust{margin-top:auto;padding-bottom:10px}

/* =========================================================================
   T-0005 calibration pass 8 — final polish
   ========================================================================= */
.wl-title{font-size:21px}
.role2-owner-photo{bottom:37%}
.role2-owner-cta-house{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.16);display:grid;place-items:center;flex:0 0 26px}
.role2-owner-cta-house svg{width:15px;height:15px}

/* ============ T-0206 B2: provider home (Notion Homesceen.dienstleister) ============ */
.pdx-hero{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:2px 0 16px}
.pdx-hero h1{margin:0 0 6px;font-size:24px;letter-spacing:-.02em;color:#1c2129}
.pdx-person{margin:0;font-size:14px;color:#57686b;line-height:1.45}
.pdx-person strong{color:#174b50;font-weight:700}
.pdx-region{margin:7px 0 0;display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:#105258;font-weight:600}
.pdx-avatar{position:relative;flex:0 0 auto}
.pdx-avatar-circle{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#eef4ef;color:#105258;font-weight:800;font-size:18px;border:2px solid #fff;box-shadow:0 3px 10px rgba(22,51,61,.12)}
.pdx-avatar-dot{position:absolute;right:2px;bottom:3px;width:14px;height:14px;border-radius:50%;background:#1b8569;border:2.5px solid #fff}
.pdx-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:#fff;border:1px solid var(--eh-border);border-radius:16px;padding:14px 4px;margin:0 0 22px}
.pdx-stat{display:grid;justify-items:center;gap:4px;text-align:center;padding:0 4px}
.pdx-stat + .pdx-stat{border-left:1px solid var(--eh-border)}
.pdx-stat-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#eaf3ec;color:#105258}
.pdx-stat strong{font-size:19px;color:#1c2129}
.pdx-stat small{font-size:10.5px;color:#6a7a70}
.pdx-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0 0 10px}
.pdx-section-head h2{margin:0;font-size:16.5px;letter-spacing:-.01em;color:#1c2129}
.pdx-section-head a{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#105258;font-weight:650;text-decoration:none}
.pdx-section-head-tight{margin-top:24px}
.pdx-requests{display:grid;gap:10px}
.pdx-request{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;background:#fff;border:1px solid var(--eh-border);border-radius:16px;padding:13px 14px;text-decoration:none;color:inherit}
.pdx-request-icon{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#eaf3ec;color:#105258}
.pdx-request-icon.emergency{background:#fdeee7;color:#d1622f}
.pdx-request-icon.consultation{background:#edf2e4;color:#1b8569}
.pdx-request-title{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.pdx-request-title strong{font-size:14.5px;color:#22352b}
.pdx-request-title small{font-size:11px;color:#8a948d}
.pdx-badge{font-size:10px;font-weight:750;padding:3px 9px;border-radius:999px}
.pdx-badge.order{background:#eaf3ec;color:#105258}
.pdx-badge.consultation{background:#edf2e4;color:#1b8569}
.pdx-badge.emergency{background:#fdeee7;color:#d1622f}
.pdx-request p{margin:5px 0 6px;font-size:12.5px;color:#57686b;line-height:1.45}
.pdx-request-meta{display:flex;align-items:center;justify-content:space-between;gap:8px}
.pdx-request-meta > span:first-child{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:#6a7a70}
.pdx-price-chip{font-size:11px;font-weight:700;color:#105258;background:#eaf3ec;border-radius:999px;padding:3px 9px}
.pdx-chevron{color:#9aa79e}
.pdx-show-all{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:10px;padding:11px;border-radius:12px;border:1px dashed var(--eh-border);font-size:12.5px;font-weight:650;color:#105258;text-decoration:none}
.pdx-quote-cta{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;background:#e9f2ea;border:1px solid #d6e7d8;border-radius:16px;padding:14px;margin:16px 0 4px;text-decoration:none;color:inherit}
.pdx-quote-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#fff;color:#105258}
.pdx-quote-cta strong{display:block;font-size:14px;color:#1c2129}
.pdx-quote-cta small{font-size:11.5px;color:#5c6e60}
.pdx-quote-button{background:#0d4448;color:#fff;font-size:12px;font-weight:750;padding:9px 14px;border-radius:999px;white-space:nowrap}
.pdx-appointments{display:grid;gap:10px}
.pdx-appointment{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;background:#fff;border:1px solid var(--eh-border);border-radius:16px;padding:12px 14px;text-decoration:none;color:inherit}
.pdx-date-tile{display:grid;justify-items:center;line-height:1;background:#f2f6f1;border-radius:12px;padding:8px 10px}
.pdx-date-tile strong{font-size:18px;color:#22352b}
.pdx-date-tile small{font-size:10px;color:#6a7a70;margin-top:3px}
.pdx-appointment .grow{min-width:0}
.pdx-appointment .grow strong{display:block;font-size:14px;color:#22352b}
.pdx-appointment .grow small{font-size:11.5px;color:#8a948d}
.pdx-appointment-time{text-align:right}
.pdx-appointment-time b{display:block;font-size:12.5px;color:#105258}
.pdx-appointment-time small{font-size:11.5px;color:#6a7a70}
.pdx-empty-line{margin:4px 2px;font-size:12.5px;color:#5f6b63}
@media(max-width:420px){.pdx-stats{padding:12px 2px}.pdx-stat-icon{width:30px;height:30px}.pdx-stat strong{font-size:17px}.pdx-stat small{font-size:9.5px}.pdx-quote-button{padding:8px 11px}}
@media(min-width:721px){.pdx-hero{padding-top:8px}.pdx-requests,.pdx-appointments{grid-template-columns:1fr 1fr}}

/* ============ T-0206 B4: provider onboarding wizard ============ */
.wz-wrap{max-width:640px;margin:0 auto}
.wz-stepper{display:flex;align-items:flex-start;justify-content:space-between;margin:4px 2px 26px;padding:0;list-style:none}
.wz-step{display:grid;justify-items:center;gap:6px;position:relative;flex:1}
.wz-step + .wz-step::before{content:"";position:absolute;top:11px;right:50%;width:100%;height:2px;background:var(--eh-border);z-index:0}
.wz-step.done + .wz-step::before,.wz-step.current + .wz-step::before{background:#105258}
.wz-step-dot{display:grid;place-items:center;width:23px;height:23px;border-radius:50%;background:#fff;border:1.6px solid var(--eh-border);font-size:11px;font-weight:750;color:#7d877f;z-index:1}
.wz-step.current .wz-step-dot{background:#0d4448;border-color:#0d4448;color:#fff}
.wz-step.done .wz-step-dot{background:#eaf3ec;border-color:#105258;color:#105258}
.wz-step small{font-size:10px;color:#7d877f;font-weight:600}
.wz-step.current small{color:#0d4448}
.wz-title{margin:0 0 4px;font-size:21px;letter-spacing:-.02em;color:#1c2129}
.wz-lead{margin:0 0 18px;font-size:13.5px;color:#57686b}
.wz-form{display:grid;gap:12px}
.wz-field{position:relative;display:grid;gap:5px}
.wz-field > svg{position:absolute;left:13px;top:31px;color:#9aa79e}
.wz-field span{font-size:11px;font-weight:650;color:#4c5a51}
.wz-field input,.wz-field select,.wz-field textarea{min-height:46px;padding:11px 12px 11px 38px;border:1px solid var(--eh-border);border-radius:12px;background:#fff;font:inherit;font-size:14px;color:#22352b;width:100%}
.wz-field.wz-plain > svg{display:none}
.wz-field.wz-plain input{padding-left:12px}
.wz-field.wz-area textarea{padding-left:12px;min-height:96px;resize:vertical}
.wz-field textarea{font-family:inherit}
.wz-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.wz-invisible{visibility:hidden}
.wz-char{font-size:10.5px;color:#8a948d}
.wz-toggle{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--eh-border);border-radius:14px;padding:13px 14px}
.wz-toggle input{position:absolute;opacity:0;pointer-events:none}
.wz-toggle-track{width:42px;height:24px;border-radius:999px;background:#d7ded8;position:relative;transition:background .18s;flex:0 0 42px}
.wz-toggle-track::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.18);transition:left .18s}
.wz-toggle input:checked + .wz-toggle-track{background:#0d4448}
.wz-toggle input:checked + .wz-toggle-track::after{left:21px}
.wz-toggle-copy{display:grid;line-height:1.3}
.wz-toggle-copy strong{font-size:13.5px;color:#22352b}
.wz-toggle-copy small{font-size:11.5px;color:#7d877f}
.wz-submit{display:flex;align-items:center;justify-content:center;gap:8px;min-height:50px;border:0;border-radius:999px;background:#0d4448;color:#fff;font:inherit;font-size:14.5px;font-weight:750;cursor:pointer;margin-top:6px}
.wz-save-later{display:block;text-align:center;font-size:12.5px;color:#105258;font-weight:650;text-decoration:none;padding:6px 0 2px}
.wz-group-label{margin:8px 0 -2px;font-size:13px;font-weight:750;color:#1c2129}
.wz-categories{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.wz-category{position:relative;display:grid;justify-items:center;gap:2px;background:#fff;border:1.5px solid var(--eh-border);border-radius:14px;padding:13px 8px 11px;cursor:pointer;text-align:center}
.wz-category strong{font-size:12px;color:#22352b}
.wz-category small{font-size:10px;color:#8a948d}
.wz-category input{position:absolute;opacity:0;pointer-events:none}
.wz-category-active{border-color:#0d4448;background:#f2f7f3}
.wz-cat-check{position:absolute;top:6px;right:8px;width:16px;height:16px;border-radius:5px;border:1.4px solid var(--eh-border);display:grid;place-items:center;font-size:10px;color:transparent}
.wz-category-active .wz-cat-check{background:#0d4448;border-color:#0d4448;color:#fff}
.wz-category-active .wz-cat-check::before{content:"✓"}
.wz-services{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.wz-service{position:relative;display:flex;align-items:center;gap:7px;background:#fff;border:1px solid var(--eh-border);border-radius:11px;padding:9px 11px;font-size:12px;color:#33453b;cursor:pointer}
.wz-service input{position:absolute;opacity:0;pointer-events:none}
.wz-service-check{display:grid;place-items:center;width:15px;height:15px;border-radius:5px;border:1.4px solid var(--eh-border);color:transparent;font-size:9.5px;flex:0 0 15px}
.wz-service-active{border-color:#0d4448;background:#f2f7f3}
.wz-service-active .wz-service-check{background:#0d4448;border-color:#0d4448;color:#fff}
.wz-summary{display:flex;gap:12px;align-items:flex-start;background:#e9f2ea;border:1px solid #d6e7d8;border-radius:16px;padding:16px;margin-bottom:14px}
.wz-summary svg{color:#105258;flex:0 0 auto;margin-top:2px}
.wz-summary strong{display:block;font-size:15px;color:#1c2129}
.wz-summary small{display:block;font-size:12px;color:#5c6e60;margin-top:2px}
@media(max-width:420px){.wz-categories{grid-template-columns:1fr 1fr;gap:7px}.wz-field > svg{top:29px}}
@media(min-width:721px){.wz-wrap{max-width:720px}}

/* T-0206 B6: bottom wave decoration on /role (Notion first_action) */
.role2-page{position:relative;padding-bottom:74px}
.role2-wave{position:absolute;left:0;right:0;bottom:14px;width:100%;height:42px;pointer-events:none}

/* ============ T-0208 premium feel: view transitions + native micro-interactions ============ */
/* Cross-document view transitions (Chrome 126+): app navigations morph instead of flash. */
@view-transition{navigation:auto}
@view-transition{navigation:auto;type:slide-up}

/* Logo + Topbar survive navigation as morphing elements (premium anchor). */
.ehn-center-logo,.mobile-brand .brand{view-transition-name:app-logo}
.bottom-nav{view-transition-name:app-bottom-nav}

::view-transition-old(app-logo),::view-transition-new(app-logo){animation:none;mix-blend-mode:normal;height:100%}
::view-transition-old(app-bottom-nav),::view-transition-new(app-bottom-nav){animation:none}

/* iOS/Android feel: no tap flash, no text selection on chrome, instant touch. */
.app-page{-webkit-tap-highlight-color:transparent}
.app-page .topbar-v3,.app-page .bottom-nav,.app-page .mobile-menu,.app-page .ehn-menu{user-select:none;-webkit-user-select:none}
.app-page a,.app-page button,.app-page summary,.app-page label{touch-action:manipulation}
.app-page{overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch}

/* Press feedback on every tappable surface: the #1 "feels app-like" lever. */
@media(hover:hover){
  .app-page a:active,.app-page button:not(:disabled):active{opacity:.85}
}
.app-page .pro-request,.app-page .pdx-request,.app-page .pdx-appointment,.app-page .pdx-quote-cta,
.app-page .pdx-appointment-time,.app-page .house-menu,.app-page .ov-card,.app-page .role2-owner-card,
.app-page .role2-pro-row,.app-page .verification-card,.app-page .wz-category,.app-page .wz-service,
.app-page .pdx-stat,.app-page .metrics div,.app-page .provider-leads-card,.app-page .sm-pro-card{
  transition:transform .14s cubic-bezier(.2,.7,.3,1),box-shadow .14s ease,opacity .14s ease;
}
.app-page .pro-request:active,.app-page .pdx-request:active,.app-page .pdx-appointment:active,
.app-page .pdx-quote-cta:active,.app-page .ov-card:active,.app-page .house-menu:active,
.app-page .verification-card:active,.app-page .role2-owner-card:active,.app-page .role2-pro-row:active,
.app-page .wz-category:active,.app-page .wz-service:active,.app-page .pdx-stat:active{
  transform:scale(.982)
}
.app-page button:not(:disabled):active,.app-page .btn-primary:active,.app-page .btn-ghost:active,
.app-page .btn-danger:active,.app-page .wz-submit:active,.app-page .role2-owner-cta:active{
  transform:scale(.975)
}
@media(prefers-reduced-motion:reduce){
  .app-page *,::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){transition-duration:.01ms !important;animation-duration:.01ms !important}
}

/* ============ T-0208 C: toasts (sonner-style, zero deps) ============ */
.eh-toast-host{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(84px + env(safe-area-inset-bottom));z-index:120;display:grid;gap:8px;width:min(92vw,420px);pointer-events:none}
.eh-toast{background:#1c332a;color:#fff;font-size:13.5px;line-height:1.45;padding:12px 16px;border-radius:14px;box-shadow:0 10px 30px rgba(18,60,42,.28);opacity:0;transform:translateY(12px) scale(.98);transition:opacity .22s ease,transform .22s cubic-bezier(.2,.7,.3,1)}
.eh-toast-in{opacity:1;transform:translateY(0) scale(1)}
.eh-toast-out{opacity:0;transform:translateY(8px) scale(.98)}
.eh-toast-success{background:#14523f}
.eh-toast-error{background:#8f2f2a}
@media(prefers-reduced-motion:reduce){.eh-toast{transition-duration:.01ms}}

/* ---------- Desktop workspace layout (T-goal wave 1) ----------
   Mobile (<=720px) keeps the Notion-1:1 design untouched. From 721px the app
   becomes a real desktop workspace: expanded sidebar, wider content column,
   desktop-proportioned cards, no mobile-only floating FAB. */

@media (min-width: 721px) {
  .app-shell-v3 .desktop-sidebar .fab-plus { display: none; }
  .app-shell-v3 .fab-plus { display: none; }
  .app-shell-v3 .screen-v3 { max-width: 1120px; padding: 44px 48px 80px; }
  .app-shell-v3 .workspace-shell { grid-template-columns: 248px minmax(0, 1fr); }
  .app-shell-v3 .sidebar-nav a { padding: 10px 12px; font-size: 13px; }
  .app-shell-v3 .sidebar-brand { padding: 4px 8px 20px; }
}

@media (min-width: 921px) {
  /* Dashboard (owner home) in desktop proportions */
  .app-shell-v3 .qa-row { gap: 16px; padding: 26px 0 0; }
  .app-shell-v3 .qa-card { min-height: 168px; padding: 22px 20px 16px; border-radius: 20px; }
  .app-shell-v3 .ki-card { margin: 22px 0 0; padding: 26px 28px 24px; }
  .app-shell-v3 .ki-input-row input { padding: 16px 62px 16px 24px; }
  .app-shell-v3 .overview-grid { gap: 16px; padding: 28px 0 0; }
  .app-shell-v3 .ov-wide { width: 100%; margin: 16px 0 0; }
  .app-shell-v3 .own-section-title { padding: 36px 0 0; font-size: 24px; }

  /* Generic screens: page headers and stacked sections use the wider column */
  .app-shell-v3 .stack { gap: 14px; }

  /* Partner workspace (pro) uses the same desktop proportions */
  .app-shell-v3.pro-theme .qa-row { gap: 16px; padding: 26px 0 0; }
  .app-shell-v3.pro-theme .ki-card { margin: 22px 0 0; padding: 26px 28px 24px; }
}

/* T-0111 trust: review report control */
.review-report{margin-top:8px}
.review-report summary{cursor:pointer;font-size:11px;color:var(--eh-brand,#105258);list-style:none}
.review-report summary::-webkit-details-marker{display:none}
.review-report form{display:flex;gap:8px;margin-top:6px}
.review-report input{flex:1;font-size:12px;padding:9px 11px}

/* =========================================================================
   DESIGN.md §0 (Stand 2026-09-03): Kein Dark-Mode im Pro-Bereich — der
   Partnerbereich nutzt dieselbe helle, ruhige Basisfarbe wie die
   Eigentümer-App. Neutralisiert die verbliebenen dunklen Navy-Blöcke
   (`.pro-theme` aus globals.css, ERP-Cockpit-Ära) auf Token-Farben.
   ========================================================================= */
.app-shell-v3.pro-theme .pro-chat{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-chat .msg{background:#ffffff;border:1px solid var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-chat .msg.mine{background:var(--eh-soft-2)}
.app-shell-v3.pro-theme .pro-chat .chat-form input{background:#ffffff;border-color:var(--eh-border-strong);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-appointment,.app-shell-v3.pro-theme .pro-conversation{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-appointment>svg,.app-shell-v3.pro-theme .pro-conversation>svg{color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .pro-appointment p,.app-shell-v3.pro-theme .pro-appointment small,.app-shell-v3.pro-theme .pro-conversation p,.app-shell-v3.pro-theme .pro-conversation small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .member-card{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .member-head small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .member-card input,.app-shell-v3.pro-theme .team-add-form input{background:#ffffff;border-color:var(--eh-border-strong);color:var(--eh-text)}
.app-shell-v3.pro-theme .member-switches label,.app-shell-v3.pro-theme .team-manage-toggle{border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .member-explain{color:var(--eh-muted)}
.app-shell-v3.pro-theme .team-add-form{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .verification-card{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .verification-card>svg{color:#d98a2b}
.app-shell-v3.pro-theme .verification-card.verified>svg{color:var(--eh-accent-hover)}
.app-shell-v3.pro-theme .verification-card p,.app-shell-v3.pro-theme .verification-card small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .verification-gate{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .verification-gate p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .partner-plan-hero{background:var(--eh-soft);border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .partner-plan-hero>svg{color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .partner-plan-hero p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .partner-plan-card{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .partner-plan-card.featured{border-color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .partner-plan-card .plan-price{color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .partner-plan-card .plan-price small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .partner-plan-card>p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .partner-plan-card li{color:var(--eh-text)}
.app-shell-v3.pro-theme .partner-plan-card li:before{color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .pro-current-plan{background:var(--eh-soft);border-color:#cfe4e0;color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-current-plan p{color:var(--eh-accent)}
.app-shell-v3.pro-theme .budget-line{background:var(--eh-soft);border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .budget-line small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .invoice-form{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .invoice-form-head p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .invoice-items-head small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .invoice-preview-total{border-top-color:var(--eh-border)}
.app-shell-v3.pro-theme .invoice-preview-total span{color:var(--eh-muted)}
.app-shell-v3.pro-theme .invoice-preview-total strong{color:var(--eh-text)}
.app-shell-v3.pro-theme .quote-form input,.app-shell-v3.pro-theme .quote-form textarea,.app-shell-v3.pro-theme .pro-form input,.app-shell-v3.pro-theme .pro-form textarea,.app-shell-v3.pro-theme .document-form input,.app-shell-v3.pro-theme .document-form select{background:#ffffff;border-color:var(--eh-border-strong);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-emergency-note{background:#fff5f3;border-color:#f1d4cf;color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-emergency-note strong{color:#a12b25}
.app-shell-v3.pro-theme .pro-emergency-note p{color:#7c5a54}
.app-shell-v3.pro-theme .notification-row{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .notification-row.unread{background:#f5fbf3;border-color:#7fa8a2}
.app-shell-v3.pro-theme .notification-row p,.app-shell-v3.pro-theme .notification-row small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .pro-contact-list .contact-row,.app-shell-v3.pro-theme .pro-contact-card{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-contact-list .contact-row.selected{background:var(--eh-soft);border-color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .pro-contact-list .contact-row small,.app-shell-v3.pro-theme .pro-contact-list .contact-row p,.app-shell-v3.pro-theme .pro-contact-card p,.app-shell-v3.pro-theme .pro-contact-card small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .contact-avatar{background:var(--eh-accent-soft);color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .simple-role-principle{background:var(--eh-soft);border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .simple-role-principle>svg{color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .simple-role-principle p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .partner-job-note{background:var(--eh-soft);border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .partner-job-note p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .contract-checks span{border-color:var(--eh-border-strong);color:var(--eh-muted)}
.app-shell-v3.pro-theme .contract-checks span.ok{background:var(--eh-soft-2);border-color:#b9dcd0;color:var(--eh-accent)}
.app-shell-v3.pro-theme .pro-claim{background:#ffffff;border-color:var(--eh-border);color:var(--eh-text)}
.app-shell-v3.pro-theme .pro-claim p,.app-shell-v3.pro-theme .pro-claim small{color:var(--eh-muted)}
.app-shell-v3.pro-theme .pro-detail>p{color:var(--eh-muted)}
.app-shell-v3.pro-theme .pro-detail .meta-line span{color:var(--eh-muted)}
.app-shell-v3.pro-theme .dark-empty{border-color:var(--eh-border-strong);color:var(--eh-muted)}
.app-shell-v3.pro-theme .dark-empty strong{color:var(--eh-text)}
.app-shell-v3.pro-theme .section-title a{color:var(--eh-accent)}
.app-shell-v3.pro-theme .pro-request.simple>svg{color:var(--eh-brand-2)}
.app-shell-v3.pro-theme .pro-ghost{color:var(--eh-text);border-color:var(--eh-border-strong)}
.app-shell-v3.pro-theme .pro-ghost:hover{border-color:var(--eh-text)}
/* Mobile bottom nav (pro): hell, aktiver Zustand in Brand-Teal statt
   Cockpit-Grau/Blau (#8ca0af/#77a8ff). */
.app-shell-v3.pro-theme .bottom-nav a{color:var(--eh-muted)}
.app-shell-v3.pro-theme .bottom-nav a.active{color:var(--eh-brand-2)}

/* Mobile bottom nav: solide Fläche statt Glas (DESIGN.md §2). */
.app-shell-v3 .bottom-nav{background:#ffffff;-webkit-backdrop-filter:none;backdrop-filter:none}

/* =========================================================================
   DESIGN.md §1.2: kein Floating Action Button in der Eigentümer-App. Der FAB
   ist im Markup entfernt; diese Guard neutralisiert die toten CSS-Regeln
   (.fab-plus/.fab-tab), falls ein Klassenname je wieder auftaucht.
   ========================================================================= */
.fab-plus,.fab-tab{display:none!important}

/* =========================================================================
   docs/DESIGN_SYSTEM.md: 44 px+ Touch-Ziele.
   ========================================================================= */
.app-shell-v3 .top-actions>a{width:44px;height:44px}
.app-shell-v3 .ehn-owner-top .notification-link{width:44px;height:44px}
.app-shell-v3 .icon-action{min-height:44px}
.round-add{width:44px;height:44px}
.prompt-tool{width:44px;height:44px}
.app-shell-v3 .ki-more{width:44px;height:44px}
.pwa-install-hint{width:44px;height:44px}
@media(max-width:920px){
  .ehn-owner .ehn-composer .agent-composer textarea{height:52px;min-height:52px;padding:16px 58px 0 18px}
  .ehn-owner .ehn-composer .agent-composer .send-action{width:44px;height:44px}
}

/* Composer inline error: scoped token color instead of inline style (DESIGN.md §2). */
.owner-composer-status[data-tone='error']{color:#a12b25}

/* ki-chat header: replaces inline centering/spacer styles (DESIGN.md §2). */
.ki-page .ki-robot-centered{margin:0 auto}
.ki-head-spacer{width:20px}

````


## src/app/page.tsx
SHA256: de2a142c0570d247d22d07ddf57e8a2729c20e603c45683f0ca567a63c949000

````text
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canonical } from '@/lib/seo';

export const metadata: Metadata = { alternates: { canonical: canonical('/') } };
import { getCurrentUser } from '@/lib/auth';
import { MarketingShell } from '@/components/marketing/site-shell';
import { StickyIntake } from '@/components/marketing/sticky-intake';
import {
  Benefits,
  CategoriesCompact,
  FinalCta,
  HomeFaq,
  HomeHero,
  HowItWorks,
  PilotBand,
  ProblemMirror,
  TheSwitch,
  Trust,
} from '@/components/marketing/home-sections';

/**
 * Public landing page. Dramaturgy (see docs/PRODUCT_POSITIONING.md):
 * hook (intake) → mirror the pain → the switch → how it works → what you get
 * → trust → breadth → pilot scarcity → objections → final intake.
 */
export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'provider' ? '/pro' : '/app');

  return (
    <MarketingShell footerIntake={false}>
      <HomeHero />
      <ProblemMirror />
      <TheSwitch />
      <HowItWorks />
      <Benefits />
      <Trust />
      <CategoriesCompact />
      <PilotBand />
      <HomeFaq />
      <FinalCta />
      <StickyIntake />
    </MarketingShell>
  );
}

````


## src/components/logo.module.css
SHA256: faf57824a90dfafde0ae8341cd6753a4b7a56c43f7e0955b662a364a9a40b2e7

````text
/* Compact wordmark styles for components/logo.tsx — module-per-contract (DESIGN.md §2). */
.compactWrap { position: relative; display: inline-block; padding-top: 6px; }
.compactMark { position: absolute; left: -56px; top: -4px; }
.wordRow { display: flex; align-items: baseline; gap: 2px; }
.wordA { font-size: 34px; font-weight: 700; letter-spacing: -1px; color: var(--green); }
.wordB { font-size: 34px; font-weight: 700; letter-spacing: -1px; color: var(--ink); }

````


## src/components/marketing/site-shell.tsx
SHA256: d7687e0c0acf4fcaaecf274ffa96a2a2a41ef9d115b462b882b32d6aedea1f6a

````text
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { IntakeForm } from '@/components/home/intake-form';
import { ScrollShadow, SmoothScroll } from './motion';
import { SERVICE_CATEGORIES } from './service-catalog';
import './tokens.css';
import styles from './mkt.module.css';
import logoMark from './assets/logo-mark.png';
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
              <Image src={logoMark} alt="" width={34} height={26} priority className={styles.logoImg} />
              <span className={styles.logoWord}><b>einfach</b><span>hausen</span></span>
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

````


## src/components/marketing/tokens.css
SHA256: 823a56f5047ef4a9a9d105de50ad8d0a53f8578f90d307610f18d704891c7e65

````text
/*
 * Einfach Hausen – public website design tokens.
 * Global `:root` exposes the DESIGN.md contract to site, owner, provider and admin.
 * `.mkt` extends that contract with website-only palette/layout primitives.
 * Reference: DESIGN.md §3 (kanonische --eh-* Namen) + §"Public Website – erweiterte Palette".
 */
:root {
  /* DESIGN.md portal aliases: one palette for site, owner, provider and admin. */
  --eh-green-900: #0a3539;
  --eh-green-700: #105258;
  --eh-green-600: #147078;
  --eh-green-100: #dcebec;
  --eh-green-50: #edf5f5;
  --eh-bg: #faf8f4;
  --eh-surface: #ffffff;
  --eh-surface-subtle: #f2f5f5;
  --eh-text: #10222a;
  --eh-text-secondary: #4b5b60;
  --eh-border: #e4e2dc;
  --eh-border-strong: #cfcbc2;
  --eh-terra: #a84d29;
  --eh-terra-deep: #a84d29;
  --eh-terra-soft: #f7e4da;
  --eh-on-dark: #f3f6f5;
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
  /* Brand teal scale (logo teal = 700) */
  --eh-teal-900: #0b3a3f;
  --eh-teal-800: #0d474d;
  --eh-teal-700: #105258;
  --eh-teal-500: #1f7a80;
  --eh-teal-300: #7fb7ba;
  --eh-teal-100: #dcebec;
  --eh-teal-050: #eef5f5;

  /* Warm canvas + sand */
  --eh-canvas: #faf8f4;
  --eh-surface: #ffffff;
  --eh-sand-100: #f4ebdd;
  --eh-sand-200: #ecdfc9;
  --eh-sand-400: #d9b98a;

  /* Single warm signal accent (sparingly) */
  --eh-terra: #a84d29;
  --eh-terra-deep: #a84d29;
  --eh-terra-soft: #f7e4da;

  /* Ink */
  --eh-ink: #10222a;
  --eh-ink-soft: #4b5b60;
  --eh-ink-mute: #5f6e75;
  --eh-line: #e4e2dc;
  --eh-line-strong: #cfcbc2;

  /* On-dark */
  --eh-on-dark: #f3f6f5;
  --eh-on-dark-soft: rgba(243, 246, 245, 0.72);
  --eh-on-dark-line: rgba(243, 246, 245, 0.16);

  /*
   * Shape: eine Skala. Die Aliase (xs, chip, input, media) ersetzen
   * verstreute Einzelwerte in den Modulen. Bestehende Werte bleiben
   * unverändert (Kanon, DESIGN.md §3) — es kommt nur dazu, nichts um.
   */
  --eh-r-xs: 8px;
  --eh-r-chip: 10px;
  --eh-r-card: 24px;
  --eh-r-card-lg: 28px;
  --eh-r-btn: 12px;
  --eh-r-input: 12px;
  --eh-r-media: 28px;
  --eh-r-pill: 999px;

  /* Depth: drei Stufen auf derselben Ink-Hue, dazu ein Hairline-Ring. */
  --eh-shadow-sm: 0 1px 2px rgba(16, 34, 42, 0.05), 0 6px 18px -8px rgba(16, 34, 42, 0.12);
  --eh-shadow-md: 0 2px 4px rgba(16, 34, 42, 0.05), 0 18px 40px -16px rgba(16, 34, 42, 0.22);
  --eh-shadow-lg: 0 4px 10px rgba(16, 34, 42, 0.06), 0 40px 80px -30px rgba(11, 58, 63, 0.35);
  --eh-ring: 0 0 0 1px var(--eh-line);

  /* Layout */
  --eh-container: 1180px;
  --eh-container-narrow: 760px;
  --eh-gutter: clamp(20px, 4vw, 32px);
  --eh-section-y: clamp(64px, 9vw, 120px);
  --eh-section-y-tight: clamp(48px, 6vw, 80px);

  /*
   * Vertikaler Rhythmus innerhalb einer Section. Bewusst ungleichmäßig,
   * damit Blöcke atmen, statt überall gleich zu sitzen.
   */
  --eh-space-1: 4px;
  --eh-space-2: 8px;
  --eh-space-3: 14px;
  --eh-space-4: 22px;
  --eh-space-5: 34px;
  --eh-space-6: 52px;
  --eh-space-7: 76px;

  /* Motion: eine Kurve, drei Dauern. Kein bounce, kein elastic. */
  --eh-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --eh-dur-fast: 140ms;
  --eh-dur: 240ms;
  --eh-dur-slow: 420ms;

  /* DESIGN.md §3 Kanon-Aliase (gleiche Werte, Vertragsname) */
  --eh-green-900: #0a3539;
  --eh-green-700: #105258;
  --eh-green-600: #147078;
  --eh-green-100: #dcebec;
  --eh-green-50: #edf5f5;
  --eh-bg: #faf8f4;
  --eh-surface: #ffffff;
  --eh-surface-subtle: #f2f5f5;
  --eh-text: #10222a;
  --eh-text-secondary: #4b5b60;
  --eh-border: #e4e2dc;
  --eh-border-strong: #cfcbc2;
  --eh-on-dark: #f3f6f5;

  /* Type scale */
  --eh-font: var(--font-marketing, ui-sans-serif, system-ui, sans-serif);
  --eh-display: clamp(40px, 5.2vw, 68px);
  --eh-h1: clamp(36px, 4.4vw, 56px);
  --eh-h2: clamp(30px, 3.4vw, 44px);
  --eh-h3: 22px;
  --eh-lead: clamp(17px, 1.4vw, 20px);
  --eh-body: 17px;
  --eh-small: 14px;
  --eh-micro: 12.5px;

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

/*
 * A11y: Motion-Tokens kollabieren, wenn das Betriebssystem Animationen
 * reduziert. Module müssen nur die Tokens nutzen, nicht selbst abfragen.
 */
@media (prefers-reduced-motion: reduce) {
  .mkt {
    --eh-dur-fast: 1ms;
    --eh-dur: 1ms;
    --eh-dur-slow: 1ms;
  }
}

````


## src/components/marketing/mkt.module.css
SHA256: 968d67ed6f24509c22e92b17d57a3b2e2405750d9c00d8b071464f856afeb2a0

````text
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
.site a:not(.btn) { color: inherit; text-decoration: none; }
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
  font-size: 11px; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; color: var(--eh-teal-700);
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
  margin: 0 0 8px 7px; font-size: 10.5px; line-height: 1.2; font-weight: 750; letter-spacing: .075em;
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
  color: var(--eh-ink-mute); font-size: 10.75px; line-height: 1.35;
}
.megaServiceArrow { margin-top: 3px; color: var(--eh-teal-500); opacity: 0; transform: translateX(-3px); transition: opacity var(--eh-dur-fast) var(--eh-ease), transform var(--eh-dur-fast) var(--eh-ease); }
.megaService:hover .megaServiceArrow, .megaService:focus-visible .megaServiceArrow { opacity: 1; transform: translateX(0); }
.megaQuick {
  display: flex; flex-direction: column; min-width: 0; padding: 22px 20px 18px;
  border-left: 1px solid var(--eh-line); background: var(--eh-teal-050);
}
.megaQuickIntro { display: grid; gap: 7px; padding: 1px 1px 15px; }
.megaQuickIntro > strong { font-size: 18px; line-height: 1.18; letter-spacing: -.015em; color: var(--eh-teal-900); }
.megaQuickIntro > p { margin: 0; color: var(--eh-ink-soft); font-size: 12px; line-height: 1.45; }
.desktopNav a.megaPrimaryAction {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 5px; padding: 11px 12px;
  border-radius: var(--eh-r-btn); background: var(--eh-teal-700); color: var(--eh-on-dark); font-size: 12.5px; font-weight: 700; box-shadow: var(--eh-shadow-sm);
}
.desktopNav a.megaPrimaryAction:hover { background: var(--eh-teal-800); color: var(--eh-on-dark); }
.megaQuickLinks { display: grid; gap: 1px; padding-top: 9px; border-top: 1px solid var(--eh-line); }
.desktopNav .megaQuickLinks a {
  display: grid; grid-template-columns: minmax(0,1fr) 14px; align-items: center; gap: 10px; padding: 9px 5px;
  border-radius: 10px; color: var(--eh-ink); background: transparent;
}
.desktopNav .megaQuickLinks a:hover { background: rgba(255,255,255,.72); color: var(--eh-teal-900); }
.megaQuickLinks a > span { min-width: 0; display: grid; gap: 1px; }
.megaQuickLinks strong { font-size: 12.25px; line-height: 1.25; font-weight: 700; }
.megaQuickLinks small { color: var(--eh-ink-mute); font-size: 10.5px; line-height: 1.3; }
.megaQuickLinks svg { color: var(--eh-teal-500); }
.megaTrust { margin-top: auto; padding: 12px 3px 0; color: var(--eh-ink-mute); font-size: 10.5px; line-height: 1.35; }
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
  font-size: 12px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--eh-teal-500);
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
.sectionHead p { font-size: var(--eh-lead); line-height: 1.55; color: var(--eh-ink-soft); }
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
.proofRow { display: flex; flex-wrap: wrap; gap: 10px 22px; font-size: 15px; font-weight: 500; color: var(--eh-ink-soft); }
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
  font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
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
.cardKicker { display: flex; align-items: center; gap: 8px; color: var(--eh-teal-700); font-size: 12px; font-weight: 700; }
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
.baLabel { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-ink-mute); }
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
  background: var(--eh-terra); color: var(--eh-on-dark); font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
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
.bulletList li span { flex: none; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--eh-teal-100); color: var(--eh-teal-900); font-size: 12px; font-weight: 700; margin-top: 1px; }
.infoPanel { display: flex; flex-direction: column; gap: 12px; padding: 26px 28px; border-radius: var(--eh-r-card); background: var(--eh-sand-100); }
.infoPanel h3 { font-size: 22px; font-weight: 700; color: var(--eh-teal-900); letter-spacing: -0.02em; }
.panelLabel { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--eh-terra-deep); }
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

````


## src/components/marketing/home-hero.tsx
SHA256: b096015c0fc662c8244090992cf778c3c025bfcacc497d68faa1a722e14860be

````text
'use client';

/**
 * HomeHero v2 – "Betriebszentrale für dein Zuhause".
 *
 * Motion contract (DESIGN.md §2/§11/§12, extended for the hero – see
 * docs/HERO_MOTION.md):
 * - Hidden states are set by GSAP at runtime only. No CSS pre-hiding.
 * - transform/opacity only (plus SVG dashoffset for the line draw).
 * - One master timeline: stage → blueprint → headline → intake → panel →
 *   facts → orchestration loop. Everything shares one clock.
 * - prefers-reduced-motion: final state only, orchestration shows one frame.
 * - Ambient motion (glow drift, loop) pauses when the hero leaves the viewport.
 *
 * Port note: in the repo, replace `<IntakeForm variant="hero" />` with
 * `<IntakeForm variant="hero" />` and `<a>` with `next/link`. The typewriter
 * finds any `input|textarea` inside `[data-h="intake"]`.
 */

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Check } from 'lucide-react';
import { IntakeForm } from '@/components/home/intake-form';
import styles from './home-hero.module.css';
import { HeroOrchestration, buildOrchestration, setOrchestrationStatic } from './hero-orchestration';

gsap.registerPlugin(ScrollTrigger, useGSAP);


const PHRASES = [
  'Heizung macht seit gestern Geräusche …',
  'Dachrinne läuft bei Regen über',
  'Wer wartet eigentlich unsere Wärmepumpe?',
  'Steckdose im Bad funkt – ist das gefährlich?',
  'Wo ist die Rechnung vom Dachdecker 2022?',
  'Garten soll vor dem Winter fertig sein',
];

const FACTS = [
  { value: 12, suffix: '', label: 'Leistungsbereiche mit geprüften Betrieben' },
  { value: 1, suffix: '', label: 'Ansprechpartner mit Name, Betrieb und Nummer' },
  { value: 0, suffix: '%', label: 'Provision pro Auftrag – Partner bleiben Rechnungssteller' },
  { value: 15, suffix: '%', label: 'Dauer-Vorteil für die ersten 1.000 Pilot-Haushalte' },
] as const;

const HEADLINE = ['Die Betriebszentrale', 'für dein Zuhause.'] as const;

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      const lines = q('[data-h="line"]');
      const eyebrow = q('[data-h="eyebrow"]');
      const lead = q('[data-h="lead"]');
      const intake = q('[data-h="intake"]');
      const proof = q('[data-h="proof"] li');
      const secondary = q('[data-h="secondary"]');
      const visual = q('[data-h="visual"]');
      const glows = q('[data-h="glow"]');
      const grid = q('[data-h="grid"]');
      const facts = q('[data-h="fact"]');
      const bpPaths = q<SVGGeometryElement>('[data-h="blueprint"] path, [data-h="blueprint"] rect, [data-h="blueprint"] circle');
      const stroke = q<SVGPathElement>('[data-h="stroke"] path')[0];
      const orchestrationRoot = q<HTMLElement>('[data-o="tilt"]')[0];
      const tilt = q('[data-o="tilt"]');
      const floatA = q('[data-o="float-a"]');
      const floatB = q('[data-o="float-b"]');
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('[data-h="intake"] input, [data-h="intake"] textarea');

      const mm = gsap.matchMedia();

      /* ---------------- Full motion ---------------- */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Initial states – JS only.
        gsap.set(lines, { yPercent: 112 });
        gsap.set([eyebrow, lead, intake, proof, secondary], { y: 22 });
        gsap.set(visual, { y: 64, rotateX: 9, transformPerspective: 1400, transformOrigin: '50% 100%' });
        gsap.set([glows, grid], { autoAlpha: 0 });
        gsap.set(facts, { y: 18 });
        bpPaths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        if (stroke) {
          const len = stroke.getTotalLength();
          gsap.set(stroke, { strokeDasharray: len, strokeDashoffset: len });
        }

        const loop = buildOrchestration(orchestrationRoot);

        /* Count-up for the facts rail (de-DE formatting). */
        const countUp = () => {
          q<HTMLElement>('[data-count]').forEach((el) => {
            const target = Number(el.dataset.count);
            const o = { v: 0 };
            gsap.to(o, {
              v: target,
              duration: 1.4,
              ease: 'power3.out',
              onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('de-DE'); },
            });
          });
        };

        const master = gsap.timeline({ defaults: { ease: 'power4.out' } });
        master
          .to(glows, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, 0)
          .to(grid, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' }, 0.2)
          .to(bpPaths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.04 }, 0.1)
          .to(eyebrow, { y: 0, duration: 0.7 }, 0.3)
          .to(lines, { yPercent: 0, duration: 1.05, stagger: 0.12 }, 0.42)
          .to(stroke, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' }, 1.15)
          .to(lead, { y: 0, duration: 0.85 }, 0.85)
          .to(intake, { y: 0, duration: 0.95 }, 1.0)
          .to(proof, { y: 0, duration: 0.6, stagger: 0.07 }, 1.2)
          .to(secondary, { y: 0, duration: 0.6 }, 1.4)
          .to(visual, { y: 0, rotateX: 0, duration: 1.3 }, 0.95)
          .to(facts, { y: 0, duration: 0.7, stagger: 0.08 }, 1.45)
          .call(countUp, [], 1.5)
          .call(() => loop.play(0), [], 1.75);

        /* Ambient glow drift – slow, transform only. */
        const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
        drift
          .to(glows[0], { x: -60, y: 50, duration: 14 }, 0)
          .to(glows[1], { x: 70, y: -40, duration: 17 }, 0);

        /* Pause ambient/loop when the hero is out of view. */
        const visibility = ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (self.isActive) { drift.play(); if (master.progress() === 1) loop.play(); }
            else { drift.pause(); loop.pause(); }
          },
        });

        /* Scroll parallax – subtle depth, scrubbed. */
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
          defaults: { ease: 'none' },
        });
        // Note: `visual` owns the intro y-tween; parallax lives on `tilt`
        // (rotate-only elsewhere) so both tweens never fight over one property.
        scrollTl
          .to(q('[data-h="copy"]'), { y: -50 }, 0)
          .to(tilt, { y: -110 }, 0)
          .to(q('[data-h="blueprint"]'), { y: 60 }, 0)
          .to(q('[data-h="facts"]'), { y: -20 }, 0);

        /* Typewriter in the intake placeholder. Pauses on focus / value. */
        let typer: gsap.core.Timeline | undefined;
        let onFocus: (() => void) | undefined;
        let onBlur: (() => void) | undefined;
        if (input) {
          const staticPlaceholder = input.placeholder;
          typer = gsap.timeline({ repeat: -1, paused: true, delay: 0 });
          PHRASES.forEach((phrase) => {
            const o = { n: 0 };
            typer!
              .to(o, {
                n: phrase.length,
                duration: phrase.length * 0.042,
                ease: 'none',
                onUpdate: () => { input.placeholder = phrase.slice(0, Math.round(o.n)) + '|'; },
              })
              .to({}, { duration: 1.5 })
              .to(o, {
                n: 0,
                duration: phrase.length * 0.016,
                ease: 'none',
                onUpdate: () => { input.placeholder = phrase.slice(0, Math.round(o.n)) + '|'; },
              })
              .to({}, { duration: 0.35 });
          });
          master.call(() => typer!.play(0), [], 1.9);
          onFocus = () => { typer!.pause(); input.placeholder = staticPlaceholder; };
          onBlur = () => { if (!input.value) typer!.play(); };
          input.addEventListener('focus', onFocus);
          input.addEventListener('blur', onBlur);
        }

        /* Pointer tilt – fine pointers only. */
        let onMove: ((e: PointerEvent) => void) | undefined;
        let onLeave: (() => void) | undefined;
        const visualEl = visual[0] as HTMLElement | undefined;
        if (visualEl && window.matchMedia('(pointer: fine)').matches) {
          const rx = gsap.quickTo(tilt, 'rotateX', { duration: 0.6, ease: 'power3.out' });
          const ry = gsap.quickTo(tilt, 'rotateY', { duration: 0.6, ease: 'power3.out' });
          const ax = gsap.quickTo(floatA, 'x', { duration: 0.8, ease: 'power3.out' });
          const ay = gsap.quickTo(floatA, 'y', { duration: 0.8, ease: 'power3.out' });
          const bx = gsap.quickTo(floatB, 'x', { duration: 0.8, ease: 'power3.out' });
          const by = gsap.quickTo(floatB, 'y', { duration: 0.8, ease: 'power3.out' });
          onMove = (e: PointerEvent) => {
            const r = visualEl.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * 6);
            ry(px * 8);
            ax(px * 18); ay(py * 14);
            bx(px * -14); by(py * -10);
          };
          onLeave = () => { rx(0); ry(0); ax(0); ay(0); bx(0); by(0); };
          visualEl.addEventListener('pointermove', onMove);
          visualEl.addEventListener('pointerleave', onLeave);
        }

        return () => {
          master.kill();
          loop.kill();
          drift.kill();
          typer?.kill();
          visibility.kill();
          scrollTl.scrollTrigger?.kill();
          scrollTl.kill();
          if (input && onFocus && onBlur) {
            input.removeEventListener('focus', onFocus);
            input.removeEventListener('blur', onBlur);
          }
          if (visualEl && onMove && onLeave) {
            visualEl.removeEventListener('pointermove', onMove);
            visualEl.removeEventListener('pointerleave', onLeave);
          }
        };
      });

      /* ---------------- Reduced motion: final state only ---------------- */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([lines], { yPercent: 0 });
        gsap.set([eyebrow, lead, intake, proof, secondary, visual, glows, grid, facts], { autoAlpha: 1, y: 0, rotateX: 0 });
        gsap.set([...bpPaths, ...(stroke ? [stroke] : [])], { strokeDasharray: 'none', strokeDashoffset: 0 });
        q<HTMLElement>('[data-count]').forEach((el) => {
          el.textContent = Number(el.dataset.count).toLocaleString('de-DE');
        });
        setOrchestrationStatic(orchestrationRoot);
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section className={styles.hero} id="anliegen" ref={ref}>
      <Stage />

      <div className={styles.inner}>
        <div className={styles.copy} data-h="copy">
          <span className={styles.eyebrow} data-h="eyebrow">
            <i className={styles.eyebrowDot} aria-hidden="true" />
            Persönlicher Hausmanager
            <i className={styles.eyebrowSep} aria-hidden="true" />
            Pilotphase · regional
          </span>

          <h1 className={styles.title}>
            {HEADLINE.map((line, i) => (
              <span className={styles.lineMask} key={line}>
                <span className={styles.line} data-h="line">
                  {i === HEADLINE.length - 1 ? (
                    <>
                      für dein{' '}
                      <em className={styles.emph}>
                        Zuhause.
                        <svg className={styles.emphStroke} data-h="stroke" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M3 10 C 40 4, 110 3, 197 8" />
                        </svg>
                      </em>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p className={styles.lead} data-h="lead">
            Heizung, Dach, Garten, Rechnungen: Du sagst in <strong>einem Satz</strong>, was ansteht. Wir ordnen ein, holen geprüfte Betriebe aus deiner Region, <strong>ein Mensch übernimmt</strong> – und alles bleibt dauerhaft in deiner Hausakte.
          </p>

          <div className={styles.intake} data-h="intake">
            <IntakeForm variant="hero" />
            <ul className={styles.proof} data-h="proof">
              <li><Check size={15} strokeWidth={2.5} aria-hidden="true" />Kostenlos starten</li>
              <li><Check size={15} strokeWidth={2.5} aria-hidden="true" />Ein Mensch aus deiner Region</li>
            </ul>
          </div>

          <Link className={styles.secondary} href="/so-funktionierts" data-h="secondary">
            So funktioniert&apos;s <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.visual} data-h="visual">
          <HeroOrchestration />
        </div>
      </div>

      <div className={styles.facts} data-h="facts">
        {FACTS.map((f) => (
          <div className={styles.fact} data-h="fact" key={f.label}>
            <span className={styles.factValue}>
              <span data-count={f.value}>0</span>
              {f.suffix && <span className={styles.factSuffix}>{f.suffix}</span>}
            </span>
            <span className={styles.factLabel}>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Background stage: glows, fine grid, blueprint line-draw. Decorative. */
function Stage() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <span className={`${styles.glow} ${styles.glowA}`} data-h="glow" />
      <span className={`${styles.glow} ${styles.glowB}`} data-h="glow" />
      <span className={styles.grid} data-h="grid" />
      <svg className={styles.blueprint} data-h="blueprint" viewBox="0 0 800 520" fill="none">
        {/* ground + house shell */}
        <path d="M0 500 H800" />
        <path d="M110 500 V262 L400 72 L690 262 V500" />
        <path d="M82 280 L400 44 L718 280" />
        {/* chimney */}
        <path d="M560 178 V104 H612 V212" />
        {/* floors */}
        <path d="M110 372 H690" />
        {/* door */}
        <rect x="372" y="404" width="56" height="96" rx="2" />
        <circle cx="416" cy="452" r="2.5" />
        {/* windows ground */}
        <rect x="170" y="404" width="72" height="56" rx="2" />
        <path d="M206 404 V460 M170 432 H242" />
        <rect x="558" y="404" width="72" height="56" rx="2" />
        <path d="M594 404 V460 M558 432 H630" />
        {/* windows upper */}
        <rect x="170" y="296" width="72" height="56" rx="2" />
        <path d="M206 296 V352 M170 324 H242" />
        <rect x="364" y="296" width="72" height="56" rx="2" />
        <path d="M400 296 V352 M364 324 H436" />
        <rect x="558" y="296" width="72" height="56" rx="2" />
        <path d="M594 296 V352 M558 324 H630" />
        {/* heating unit + solar */}
        <rect x="128" y="440" width="26" height="60" rx="3" />
        <path d="M140 440 V420 M134 420 H146" />
        <path d="M232 178 L292 138 M256 194 L316 154 M280 210 L340 170" />
        <path d="M222 172 L344 92 L378 114 L256 194 Z" />
        {/* dimension ticks */}
        <path d="M110 516 V508 M690 516 V508 M110 512 H690" />
        <path d="M740 262 H748 M740 500 H748 M744 262 V500" />
        {/* nodes */}
        <circle cx="141" cy="470" r="9" />
        <circle cx="586" cy="118" r="9" />
        <circle cx="300" cy="150" r="9" />
        <circle cx="400" cy="72" r="9" />
      </svg>
    </div>
  );
}

````


## src/components/marketing/home-hero.module.css
SHA256: 26483e8266e070d955a8455af391b7920d6cc79392714253da1ce241e06373b9

````text
/*
 * HomeHero v2 – "Betriebszentrale" motion hero.
 * DESIGN.md: --eh-* tokens only, CSS-module scoped, transform/opacity motion,
 * no text gradients, no glassmorphism, no accent stripes.
 * Initial hidden states are set by GSAP at runtime (never in CSS).
 */

.hero {
  position: relative;
  isolation: isolate;
  overflow: clip;
  background: var(--eh-teal-900);
  color: var(--eh-on-dark);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ---------- Stage (background layers) ---------- */
.stage {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  will-change: transform;
}

.glowA {
  width: 62vw;
  height: 62vw;
  max-width: 900px;
  max-height: 900px;
  right: -14vw;
  top: -22vw;
  background: radial-gradient(closest-side, rgba(31, 122, 128, 0.55), rgba(31, 122, 128, 0));
}

.glowB {
  width: 48vw;
  height: 48vw;
  max-width: 700px;
  max-height: 700px;
  left: -16vw;
  bottom: -22vw;
  background: radial-gradient(closest-side, rgba(217, 185, 138, 0.22), rgba(217, 185, 138, 0));
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(243, 246, 245, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(243, 246, 245, 0.06) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 60% 40%, #000 30%, transparent 100%);
  mask-image: radial-gradient(ellipse 70% 70% at 60% 40%, #000 30%, transparent 100%);
}

.blueprint {
  position: absolute;
  right: -4%;
  top: 50%;
  width: min(62vw, 880px);
  height: auto;
  transform: translateY(-50%);
  opacity: 0.55;
}

.blueprint path,
.blueprint rect,
.blueprint circle {
  fill: none;
  stroke: rgba(243, 246, 245, 0.22);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

/* ---------- Layout ---------- */
.inner {
  width: min(var(--eh-container), 100% - 2 * var(--eh-gutter));
  margin: 0 auto;
  padding: calc(var(--eh-section-y) + 56px) 0 var(--eh-space-6);
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}

/* ---------- Copy ---------- */
.copy {
  display: flex;
  flex-direction: column;
  gap: var(--eh-space-4);
  max-width: 600px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  padding: 7px 14px 7px 10px;
  border-radius: var(--eh-r-pill);
  border: 1px solid var(--eh-on-dark-line);
  background: rgba(243, 246, 245, 0.05);
  font-size: var(--eh-micro);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--eh-on-dark-soft);
}

.eyebrowDot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--eh-teal-300);
}

.eyebrowDot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid var(--eh-teal-300);
  opacity: 0;
  animation: ping 2.4s var(--eh-ease) infinite;
}

@keyframes ping {
  0% { transform: scale(0.5); opacity: 0.8; }
  70%, 100% { transform: scale(1.6); opacity: 0; }
}

.eyebrowSep {
  width: 1px;
  height: 12px;
  background: var(--eh-on-dark-line);
}

.title {
  margin: 0;
  font-size: var(--eh-display);
  line-height: 1.02;
  letter-spacing: -0.032em;
  font-weight: 640;
  color: var(--eh-on-dark);
  text-wrap: balance;
}

.lineMask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
}

.line {
  display: block;
  will-change: transform;
}

.emph {
  position: relative;
  font-style: normal;
  color: var(--eh-on-dark);
  white-space: nowrap;
}

.emphStroke {
  position: absolute;
  left: -2%;
  right: -2%;
  bottom: -0.06em;
  width: 104%;
  height: 0.28em;
  overflow: visible;
  pointer-events: none;
}

.emphStroke path {
  fill: none;
  stroke: var(--eh-sand-400);
  stroke-width: 6;
  stroke-linecap: round;
}

.lead {
  margin: 0;
  font-size: var(--eh-lead);
  line-height: 1.55;
  color: var(--eh-on-dark-soft);
  max-width: 54ch;
}

.lead strong {
  color: var(--eh-on-dark);
  font-weight: 600;
}

/* ---------- Intake ---------- */
.intake {
  margin-top: var(--eh-space-2);
  display: flex;
  flex-direction: column;
  gap: var(--eh-space-3);
}

.intakeForm {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 6px 6px 16px;
  background: var(--eh-surface);
  color: var(--eh-ink);
  border-radius: 18px;
  box-shadow: var(--eh-shadow-lg), var(--eh-ring);
  transition: box-shadow var(--eh-dur) var(--eh-ease), transform var(--eh-dur) var(--eh-ease);
}

.intakeForm:focus-within {
  box-shadow: var(--eh-shadow-lg), 0 0 0 3px var(--eh-teal-300);
}

.intakeIcon {
  flex: none;
  color: var(--eh-teal-700);
  display: grid;
  place-items: center;
}

.intakeInput {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 17px;
  padding: 14px 6px;
  color: var(--eh-ink);
}

.intakeInput::placeholder {
  color: var(--eh-ink-mute);
}

.intakeGhost {
  flex: none;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--eh-ink-soft);
  cursor: pointer;
  transition: background var(--eh-dur-fast) var(--eh-ease), color var(--eh-dur-fast) var(--eh-ease);
}

.intakeGhost:hover {
  background: var(--eh-teal-050);
  color: var(--eh-teal-700);
}

.intakeSubmit {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 18px 0 20px;
  border: 0;
  border-radius: 13px;
  background: var(--eh-teal-700);
  color: var(--eh-on-dark);
  font: inherit;
  font-size: 15.5px;
  font-weight: 600;
  cursor: pointer;
  will-change: transform;
  transition: background var(--eh-dur) var(--eh-ease);
}

.intakeSubmit:hover {
  background: var(--eh-teal-800);
}

.intakeSubmit svg {
  transition: transform var(--eh-dur) var(--eh-ease);
}

.intakeSubmit:hover svg {
  transform: translateX(3px);
}

.proof {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--eh-small);
  color: var(--eh-on-dark-soft);
}

.proof li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.proof svg {
  color: var(--eh-teal-300);
}

.secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  color: var(--eh-on-dark);
  font-size: var(--eh-small);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--eh-on-dark-line);
  padding-bottom: 2px;
  transition: border-color var(--eh-dur) var(--eh-ease);
}

.secondary:hover {
  border-color: var(--eh-on-dark);
}

/* ---------- Visual: Betriebszentrale ---------- */
.visual {
  position: relative;
  perspective: 1400px;
  justify-self: end;
  width: 100%;
  max-width: 520px;
}

.tilt {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}

.panel {
  position: relative;
  background: var(--eh-surface);
  color: var(--eh-ink);
  border-radius: var(--eh-r-card);
  box-shadow: var(--eh-shadow-lg), 0 0 0 1px rgba(243, 246, 245, 0.08);
  overflow: hidden;
  font-size: var(--eh-small);
  line-height: 1.45;
}

.panelBar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--eh-line);
  background: var(--eh-canvas);
}

.panelMark {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--eh-teal-100);
  color: var(--eh-teal-800);
}

.panelBar small {
  display: block;
  font-size: var(--eh-micro);
  color: var(--eh-ink-mute);
  letter-spacing: 0.02em;
}

.panelBar strong {
  display: block;
  font-size: 14.5px;
  font-weight: 620;
  color: var(--eh-ink);
}

.livePill {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border-radius: var(--eh-r-pill);
  background: var(--eh-teal-050);
  color: var(--eh-teal-800);
  font-size: var(--eh-micro);
  font-weight: 600;
}

.livePill i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--eh-teal-500);
}

.panelBody {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  min-height: 392px;
}

/* Rail */
.rail {
  position: relative;
  padding: 18px 12px 18px 18px;
  border-right: 1px solid var(--eh-line);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.railTrack {
  position: absolute;
  left: 26px;
  top: 34px;
  bottom: 34px;
  width: 2px;
  background: var(--eh-line);
  border-radius: 2px;
  overflow: hidden;
}

.railFill {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--eh-teal-700);
  transform-origin: top;
  transform: scaleY(0);
}

.railStep {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: var(--eh-ink-mute);
}

.railDot {
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--eh-line-strong);
  background: var(--eh-surface);
  display: grid;
  place-items: center;
  color: transparent;
  transition: border-color var(--eh-dur) var(--eh-ease), background var(--eh-dur) var(--eh-ease), color var(--eh-dur) var(--eh-ease);
}

.railDot svg {
  width: 11px;
  height: 11px;
}

.railStep strong {
  display: block;
  font-size: 12.5px;
  font-weight: 620;
  color: var(--eh-ink-soft);
  line-height: 1.2;
  transition: color var(--eh-dur) var(--eh-ease);
}

.railStep small {
  display: block;
  font-size: 11px;
  color: var(--eh-ink-mute);
  margin-top: 2px;
}

.railStep[data-state='active'] .railDot {
  border-color: var(--eh-teal-700);
  box-shadow: 0 0 0 4px var(--eh-teal-100);
}

.railStep[data-state='active'] strong {
  color: var(--eh-teal-800);
}

.railStep[data-state='done'] .railDot {
  border-color: var(--eh-teal-700);
  background: var(--eh-teal-700);
  color: var(--eh-on-dark);
}

.railStep[data-state='done'] strong {
  color: var(--eh-ink);
}

/* Scenes */
.scenes {
  position: relative;
  padding: 18px;
  overflow: hidden;
}

.scene {
  position: absolute;
  inset: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  will-change: transform, opacity;
}

.sceneLabel {
  font-size: 11px;
  font-weight: 640;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--eh-ink-mute);
}

/* Scene 1: Anliegen */
.userBubble {
  align-self: flex-end;
  max-width: 92%;
  padding: 10px 13px;
  border-radius: 14px 14px 4px 14px;
  background: var(--eh-teal-700);
  color: var(--eh-on-dark);
  font-size: 13.5px;
  line-height: 1.4;
}

.attach {
  align-self: flex-end;
  display: flex;
  gap: 6px;
}

.attach span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border-radius: var(--eh-r-pill);
  border: 1px solid var(--eh-line);
  background: var(--eh-surface);
  font-size: 11.5px;
  color: var(--eh-ink-soft);
}

.assistant {
  padding: 12px 13px;
  border-radius: 4px 14px 14px 14px;
  background: var(--eh-surface-subtle);
  font-size: 13px;
  line-height: 1.45;
  color: var(--eh-ink);
}

.assistant p {
  margin: 0 0 10px;
}

.choice {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 11px;
  margin-top: 6px;
  border-radius: 11px;
  border: 1px solid var(--eh-line);
  background: var(--eh-surface);
  font-weight: 600;
  font-size: 12.5px;
}

.choice svg {
  color: var(--eh-teal-700);
}

.choiceFeatured {
  border-color: var(--eh-teal-700);
  box-shadow: 0 0 0 3px var(--eh-teal-100);
}

.choiceFeatured em {
  margin-left: auto;
  font-style: normal;
  font-size: 11px;
  font-weight: 600;
  color: var(--eh-teal-700);
}

/* Scene 2: Zuordnung */
.chips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--eh-line);
  background: var(--eh-surface);
  font-size: 13px;
}

.chip small {
  color: var(--eh-ink-mute);
  font-size: 11.5px;
  display: block;
}

.chip strong {
  display: block;
  font-weight: 620;
  color: var(--eh-ink);
}

.chipCheck {
  margin-left: auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--eh-teal-100);
  color: var(--eh-teal-800);
}

.chipCheck svg {
  width: 13px;
  height: 13px;
}

.scan {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: var(--eh-teal-500);
  opacity: 0.55;
  pointer-events: none;
}

/* Scene 3: Partner */
.partner {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--eh-line);
  background: var(--eh-surface);
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--eh-teal-800);
  background: var(--eh-teal-100);
}

.partner strong {
  display: block;
  font-size: 13px;
  font-weight: 620;
}

.partner small {
  display: block;
  font-size: 11.5px;
  color: var(--eh-ink-mute);
}

.match {
  text-align: right;
}

.match b {
  display: block;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--eh-teal-800);
}

.bar {
  width: 56px;
  height: 4px;
  margin-top: 4px;
  border-radius: 4px;
  background: var(--eh-line);
  overflow: hidden;
}

.barFill {
  height: 100%;
  width: 100%;
  background: var(--eh-teal-700);
  transform-origin: left;
  transform: scaleX(0);
}

.partnerTop {
  border-color: var(--eh-teal-700);
  box-shadow: 0 0 0 3px var(--eh-teal-100);
}

.tag {
  position: absolute;
  top: -9px;
  right: 10px;
  padding: 2px 8px;
  border-radius: var(--eh-r-pill);
  background: var(--eh-terra);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.partnerWrap {
  position: relative;
}

.appointment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--eh-teal-050);
  color: var(--eh-teal-900);
  font-size: 12.5px;
}

.appointment strong {
  font-weight: 620;
}

.appointment svg {
  color: var(--eh-teal-700);
}

/* Scene 4: Hausakte */
.akte {
  border: 1px solid var(--eh-line);
  border-radius: 14px;
  overflow: hidden;
  background: var(--eh-surface);
}

.akteHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--eh-line);
  background: var(--eh-canvas);
  font-size: 12.5px;
}

.akteHead strong {
  font-weight: 620;
}

.akteHead span {
  color: var(--eh-ink-mute);
  font-size: 11.5px;
}

.akteRow {
  display: grid;
  grid-template-columns: 38px 12px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 9px 12px;
  border-bottom: 1px solid var(--eh-line);
  font-size: 12.5px;
}

.akteRow:last-child {
  border-bottom: 0;
}

.akteRow time {
  color: var(--eh-ink-mute);
  font-variant-numeric: tabular-nums;
  font-size: 11.5px;
  padding-top: 2px;
}

.akteDot {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--eh-line-strong);
}

.akteRowNew .akteDot {
  background: var(--eh-teal-700);
  box-shadow: 0 0 0 3px var(--eh-teal-100);
}

.akteRow strong {
  display: block;
  font-weight: 620;
}

.akteRow small {
  display: block;
  color: var(--eh-ink-mute);
  font-size: 11.5px;
}

.akteFoot {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--eh-sand-100);
  color: var(--eh-ink);
  font-size: 12.5px;
}

.akteFoot svg {
  color: var(--eh-terra);
}

/* Floating proof cards */
.float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px 10px 10px;
  border-radius: 14px;
  background: var(--eh-surface);
  color: var(--eh-ink);
  box-shadow: var(--eh-shadow-md), var(--eh-ring);
  font-size: 12.5px;
  line-height: 1.25;
  white-space: nowrap;
  will-change: transform;
  z-index: 2;
}

.float strong {
  display: block;
  font-weight: 620;
}

.float small {
  display: block;
  color: var(--eh-ink-mute);
  font-size: 11.5px;
}

.floatIcon {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: var(--eh-teal-100);
  color: var(--eh-teal-800);
}

.floatA {
  top: 64px;
  right: -28px;
}

.floatB {
  bottom: 48px;
  left: -36px;
}

.floatB .floatIcon {
  background: var(--eh-terra-soft);
  color: var(--eh-terra);
}

/* ---------- Facts rail ---------- */
.facts {
  width: min(var(--eh-container), 100% - 2 * var(--eh-gutter));
  margin: var(--eh-space-5) auto 0;
  padding: var(--eh-space-4) 0 var(--eh-space-5);
  border-top: 1px solid var(--eh-on-dark-line);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--eh-space-4);
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.factValue {
  font-size: clamp(26px, 2.6vw, 34px);
  font-weight: 640;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--eh-on-dark);
  font-variant-numeric: tabular-nums;
}

.factSuffix {
  font-size: 0.6em;
  margin-left: 2px;
  color: var(--eh-on-dark-soft);
}

.factLabel {
  font-size: var(--eh-small);
  color: var(--eh-on-dark-soft);
}

/* ---------- Responsive ---------- */
@media (max-width: 980px) {
  .inner {
    grid-template-columns: 1fr;
    padding-top: calc(var(--eh-section-y-tight) + 64px);
  }

  .visual {
    justify-self: stretch;
    max-width: 100%;
    margin-top: var(--eh-space-3);
  }

  .floatA {
    right: 8px;
    top: 52px;
  }

  .floatB {
    left: 8px;
    bottom: 36px;
  }

  .blueprint {
    right: -30%;
    width: 120vw;
    opacity: 0.35;
  }

  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .intakeForm {
    flex-wrap: wrap;
    padding: 10px;
  }

  .intakeInput {
    flex-basis: 100%;
    order: -1;
    padding: 8px 4px 10px;
  }

  .intakeSubmit {
    margin-left: auto;
  }

  .panelBody {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .rail {
    flex-direction: row;
    gap: 10px;
    padding: 12px 14px;
    border-right: 0;
    border-bottom: 1px solid var(--eh-line);
    overflow-x: auto;
  }

  .railTrack {
    display: none;
  }

  .railStep small {
    display: none;
  }

  .scenes {
    min-height: 372px;
  }

  .intakeIcon {
    display: none;
  }

  .float {
    display: none;
  }
}

/* Reduced motion: eyebrow ping off, everything else is handled by GSAP matchMedia. */
@media (prefers-reduced-motion: reduce) {
  .eyebrowDot::after {
    animation: none;
  }
}

````


## src/components/marketing/hero-orchestration.tsx
SHA256: ebcde7ee80f00c7f54792ad95066515d2a7a2ebe01ef8764fdf1d1ad6b33f21e

````text
import gsap from 'gsap';
import {
  BellRing,
  CalendarCheck2,
  Camera,
  Check,
  Clock3,
  Euro,
  FileText,
  Flame,
  Home,
  MapPin,
  MessageCircle,
  Mic,
  Star,
  UserRound,
  Wrench,
} from 'lucide-react';
import styles from './home-hero.module.css';

/**
 * "Betriebszentrale" – the hero visual. Pure markup; all motion is driven by
 * `buildOrchestration()` from the parent timeline so intro and loop share one
 * clock. Selectors are data attributes (module-class independent).
 *
 * Content is truthful to PRODUCT_VISION.md: the customer decides
 * (Frage klären / Ansprechpartner / Auftrag), nothing is auto-booked, a real
 * person takes over, everything lands in the Hausakte.
 */

const RAIL = [
  { title: 'Anliegen', sub: 'Text, Foto, Sprache' },
  { title: 'Zuordnung', sub: 'Gewerk & Region' },
  { title: 'Partner', sub: 'geprüft & bewertet' },
  { title: 'Hausakte', sub: 'bleibt beim Haus' },
] as const;

const PARTNERS = [
  { initials: 'MB', name: 'Markus Bauer', firm: 'Heizungsbau Bauer GmbH', km: 6, rating: '4,9', slot: 'Di frei', match: 96, top: true },
  { initials: 'SK', name: 'Sanitär Kessler', firm: 'Meisterbetrieb', km: 11, rating: '4,8', slot: 'Do frei', match: 91, top: false },
  { initials: 'TW', name: 'Thermo Wagner', firm: 'Heizung · Klima', km: 18, rating: '4,7', slot: 'Fr frei', match: 84, top: false },
] as const;

export function HeroOrchestration() {
  return (
    <div className={styles.tilt} data-o="tilt">
      <div className={styles.panel} aria-label="Produktvorschau: So organisiert Einfach Hausen ein Anliegen – vom ersten Satz bis zur Hausakte" role="img">
        <div className={styles.panelBar}>
          <span className={styles.panelMark}><Home size={18} aria-hidden="true" /></span>
          <span>
            <small>Betriebszentrale · Musterstraße 12</small>
            <strong>Vorgang #142 · Heizung</strong>
          </span>
          <span className={styles.livePill}><i aria-hidden="true" />läuft</span>
        </div>

        <div className={styles.panelBody}>
          {/* Progress rail */}
          <div className={styles.rail} tabIndex={0} aria-label="Vorgangsfortschritt: Anliegen, Zuordnung, Partner, Hausakte">
            <span className={styles.railTrack} aria-hidden="true"><span className={styles.railFill} data-o="rail-fill" /></span>
            {RAIL.map((step, i) => (
              <div className={styles.railStep} data-o="rail" data-index={i} data-state={i === 0 ? 'active' : 'idle'} key={step.title}>
                <span className={styles.railDot}><Check strokeWidth={3} aria-hidden="true" /></span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.sub}</small>
                </span>
              </div>
            ))}
          </div>

          {/* Scenes */}
          <div className={styles.scenes}>
            <span className={styles.scan} data-o="scan" aria-hidden="true" />

            {/* 1 · Anliegen */}
            <div className={styles.scene} data-scene="1">
              <span className={styles.sceneLabel}>Anliegen · gerade eben</span>
              <div className={styles.userBubble} data-s1="bubble">Heizung macht seit gestern Geräusche und der Druck fällt ab.</div>
              <div className={styles.attach} data-s1="attach">
                <span><Camera size={12} aria-hidden="true" />Foto</span>
                <span><Mic size={12} aria-hidden="true" />Sprachnotiz 0:12</span>
              </div>
              <div className={styles.assistant} data-s1="assistant">
                <p>Klingt nach Luft im System oder der Umwälzpumpe. Wie soll es weitergehen?</p>
                <div className={styles.choice} data-s1="choice"><MessageCircle size={14} aria-hidden="true" />Nur Frage klären</div>
                <div className={styles.choice} data-s1="choice"><UserRound size={14} aria-hidden="true" />Ansprechpartner finden</div>
                <div className={`${styles.choice} ${styles.choiceFeatured}`} data-s1="choice" data-featured>
                  <Wrench size={14} aria-hidden="true" />Auftrag organisieren
                  <em data-s1="selected">ausgewählt</em>
                </div>
              </div>
            </div>

            {/* 2 · Zuordnung */}
            <div className={styles.scene} data-scene="2">
              <span className={styles.sceneLabel}>Zuordnung · automatisch, du bestätigst</span>
              <div className={styles.chips}>
                <div className={styles.chip} data-s2="chip">
                  <Flame size={16} aria-hidden="true" />
                  <span><small>Gewerk</small><strong>Heizung &amp; Sanitär</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
                <div className={styles.chip} data-s2="chip">
                  <MapPin size={16} aria-hidden="true" />
                  <span><small>Region</small><strong>25 km um 71083 Herrenberg</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
                <div className={styles.chip} data-s2="chip">
                  <Clock3 size={16} aria-hidden="true" />
                  <span><small>Zeitfenster</small><strong>Diese Woche, vormittags</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
                <div className={styles.chip} data-s2="chip">
                  <Euro size={16} aria-hidden="true" />
                  <span><small>Kostenrahmen</small><strong>120 – 260 € Richtpreis</strong></span>
                  <span className={styles.chipCheck} data-s2="check"><Check strokeWidth={3} aria-hidden="true" /></span>
                </div>
              </div>
            </div>

            {/* 3 · Partner */}
            <div className={styles.scene} data-scene="3">
              <span className={styles.sceneLabel}>Partner · geprüft, aus deiner Region</span>
              {PARTNERS.map((p) => (
                <div className={styles.partnerWrap} data-s3="partner" key={p.initials}>
                  <div className={`${styles.partner} ${p.top ? styles.partnerTop : ''}`}>
                    <span className={styles.avatar}>{p.initials}</span>
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.firm} · {p.km} km · <Star size={10} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-1px' }} /> {p.rating} · {p.slot}</small>
                    </span>
                    <span className={styles.match}>
                      <b><span data-s3="pct" data-value={p.match}>0</span> %</b>
                      <span className={styles.bar}><span className={styles.barFill} data-s3="bar" data-value={p.match} /></span>
                    </span>
                  </div>
                  {p.top && <span className={styles.tag} data-s3="tag">Empfohlen</span>}
                </div>
              ))}
              <div className={styles.appointment} data-s3="appointment">
                <CalendarCheck2 size={16} aria-hidden="true" />
                <span><strong>Du bestätigst:</strong> Di, 9:00 · Markus Bauer kommt persönlich</span>
              </div>
            </div>

            {/* 4 · Hausakte */}
            <div className={styles.scene} data-scene="4">
              <span className={styles.sceneLabel}>Hausakte · Musterstraße 12</span>
              <div className={styles.akte}>
                <div className={styles.akteHead}><strong>Mein Haus · Heizung</strong><span>3 Einträge</span></div>
                <div className={`${styles.akteRow} ${styles.akteRowNew}`} data-s4="row">
                  <time>2026</time><span className={styles.akteDot} />
                  <span><strong>Wartung &amp; Entlüftung</strong><small>Rechnung 184 € · Garantie bis 2028 · Markus Bauer</small></span>
                </div>
                <div className={styles.akteRow} data-s4="row">
                  <time>2025</time><span className={styles.akteDot} />
                  <span><strong>Dacharbeiten</strong><small>Garantiehinweis gespeichert</small></span>
                </div>
                <div className={styles.akteRow} data-s4="row">
                  <time>2024</time><span className={styles.akteDot} />
                  <span><strong>Anlage erfasst</strong><small>Heizung · Wartung planbar</small></span>
                </div>
              </div>
              <div className={styles.akteFoot} data-s4="foot">
                <BellRing size={15} aria-hidden="true" />
                <span>Nächste Wartung: wir erinnern dich automatisch in 12 Monaten.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating proof cards */}
      <span className={`${styles.float} ${styles.floatA}`} data-o="float-a" aria-hidden="true">
        <span className={styles.floatIcon}><CalendarCheck2 size={15} /></span>
        <span><strong>Termin bestätigt</strong><small>Di 9:00 · Markus Bauer</small></span>
      </span>
      <span className={`${styles.float} ${styles.floatB}`} data-o="float-b" aria-hidden="true">
        <span className={styles.floatIcon}><FileText size={15} /></span>
        <span><strong>Rechnung abgelegt</strong><small>Hausakte · Heizung</small></span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const SCENE_IN = { y: 0, duration: 0.45 } as const;
const SCENE_OUT = { y: -14, duration: 0.38, ease: 'power2.in' } as const;

function setRail(rail: HTMLElement[], active: number) {
  rail.forEach((el, i) => {
    el.dataset.state = i < active ? 'done' : i === active ? 'active' : 'idle';
  });
}

/**
 * Builds the looping "Vorgang" choreography. Returns a paused timeline the
 * parent adds to its master. Readable content uses transform-only motion; visibility swaps are atomic.
 */
export function buildOrchestration(root: HTMLElement): gsap.core.Timeline {
  const q = gsap.utils.selector(root);
  const rail = q<HTMLElement>('[data-o="rail"]');
  const railFill = q('[data-o="rail-fill"]');
  const scan = q('[data-o="scan"]');
  const floatA = q('[data-o="float-a"]');
  const floatB = q('[data-o="float-b"]');
  const s = (n: number) => q(`[data-scene="${n}"]`);
  const pctEls = q<HTMLElement>('[data-s3="pct"]');

  const tl = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay: 1.4,
    defaults: { ease: 'power3.out' },
    onRepeat: () => setRail(rail, 0),
  });

  // Base states (JS only – nothing is hidden without JavaScript).
  tl.set([s(1), s(2), s(3), s(4)], { autoAlpha: 0, y: 16 })
    .set(railFill, { scaleY: 0 })
    .set(scan, { autoAlpha: 0, y: 0 })
    .set([floatA, floatB], { autoAlpha: 0, y: 10, scale: 0.96 })
    .call(() => setRail(rail, 0), [], 0.01);

  /* 1 · Anliegen */
  tl.set(s(1), { autoAlpha: 1 }, 0.04)
    .to(s(1), SCENE_IN, 0.05)
    .from(q('[data-s1="bubble"]'), { y: 12, scale: 0.97, duration: 0.45 }, '<0.1')
    .from(q('[data-s1="attach"] span'), { y: 8, stagger: 0.08, duration: 0.35 }, '>-0.1')
    .from(q('[data-s1="assistant"]'), { y: 12, duration: 0.45 }, '>0.2')
    .from(q('[data-s1="choice"]'), { x: -10, stagger: 0.09, duration: 0.35 }, '>-0.15')
    .from(q('[data-s1="selected"]'), { scale: 0.96, duration: 0.3 }, '>0.45')
    .to(q('[data-featured]'), { scale: 1.02, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '<');

  /* 1 → 2 · Zuordnung */
  tl.to(s(1), SCENE_OUT, '+=0.75')
    .set(s(1), { autoAlpha: 0 })
    .set(s(2), { autoAlpha: 1, y: 16 })
    .call(() => setRail(rail, 1))
    .to(railFill, { scaleY: 1 / 3, duration: 0.5, ease: 'power2.inOut' }, '<')
    .to(s(2), SCENE_IN, '<0.1')
    .fromTo(scan, { y: 0, autoAlpha: 0 }, { y: 320, autoAlpha: 0.6, duration: 1.3, ease: 'none' }, '<')
    .from(q('[data-s2="chip"]'), { y: 10, stagger: 0.24, duration: 0.4 }, '<0.05')
    .from(q('[data-s2="check"]'), { scale: 0, stagger: 0.24, duration: 0.35 }, '<0.28')
    .to(scan, { autoAlpha: 0, duration: 0.2 }, '>-0.2');

  /* 2 → 3 · Partner */
  const counters = pctEls.map((el) => ({ el, v: 0, target: Number(el.dataset.value) }));
  tl.to(s(2), SCENE_OUT, '+=0.65')
    .set(s(2), { autoAlpha: 0 })
    .set(s(3), { autoAlpha: 1, y: 16 })
    .call(() => setRail(rail, 2))
    .to(railFill, { scaleY: 2 / 3, duration: 0.5, ease: 'power2.inOut' }, '<')
    .to(s(3), SCENE_IN, '<0.1')
    .from(q('[data-s3="partner"]'), { y: 14, stagger: 0.14, duration: 0.45 }, '<0.1')
    .to(q('[data-s3="bar"]'), { scaleX: (_i, el) => Number((el as HTMLElement).dataset.value) / 100, stagger: 0.14, duration: 0.8, ease: 'power2.out' }, '<0.2')
    .to(counters, {
      v: (i: number) => counters[i].target,
      stagger: 0.14,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate() {
        counters.forEach((c) => { c.el.textContent = String(Math.round(c.v)); });
      },
    }, '<')
    .from(q('[data-s3="tag"]'), { scale: 0.85, duration: 0.35 }, '>-0.25')
    .from(q('[data-s3="appointment"]'), { y: 10, duration: 0.4 }, '>0.25')
    .set(floatA, { autoAlpha: 1 }, '<0.15')
    .to(floatA, { y: 0, scale: 1, duration: 0.5 }, '<');

  /* 3 → 4 · Hausakte */
  tl.to(s(3), SCENE_OUT, '+=0.95')
    .set(s(3), { autoAlpha: 0 })
    .set(s(4), { autoAlpha: 1, y: 16 })
    .call(() => setRail(rail, 3))
    .to(railFill, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, '<')
    .to(s(4), SCENE_IN, '<0.1')
    .from(q('[data-s4="row"]'), { x: -10, stagger: 0.12, duration: 0.4 }, '<0.1')
    .from(q('[data-s4="foot"]'), { y: 10, duration: 0.4 }, '>0.1')
    .set(floatB, { autoAlpha: 1 }, '<')
    .to(floatB, { y: 0, scale: 1, duration: 0.5 }, '<')
    .call(() => setRail(rail, 4), [], '>0.2');

  /* Hold, then clear for the next loop */
  tl.to(s(4), SCENE_OUT, '+=1.6')
    .set(s(4), { autoAlpha: 0 })
    .to([floatA, floatB], { y: 8, scale: 0.96, duration: 0.35 }, '<')
    .set([floatA, floatB], { autoAlpha: 0 })
    .to(railFill, { scaleY: 0, duration: 0.3, ease: 'power2.inOut' }, '<')
    .set(counters, { v: 0, onComplete: () => counters.forEach((c) => { c.el.textContent = '0'; }) });

  return tl;
}

/** Reduced motion: one truthful, complete frame – no animation. */
export function setOrchestrationStatic(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const rail = q<HTMLElement>('[data-o="rail"]');
  gsap.set(q('[data-scene]'), { autoAlpha: 0 });
  gsap.set(q('[data-scene="3"]'), { autoAlpha: 1, y: 0 });
  gsap.set(q('[data-s3="bar"]'), { scaleX: (_i, el) => Number((el as HTMLElement).dataset.value) / 100 });
  q<HTMLElement>('[data-s3="pct"]').forEach((el) => { el.textContent = el.dataset.value ?? '0'; });
  gsap.set(q('[data-o="rail-fill"]'), { scaleY: 2 / 3 });
  gsap.set(q('[data-o="scan"]'), { autoAlpha: 0 });
  gsap.set([q('[data-o="float-a"]'), q('[data-o="float-b"]')], { autoAlpha: 1, y: 0, scale: 1 });
  setRail(rail, 2);
}

````


## src/components/marketing/service-catalog.tsx
SHA256: cbdebdf254000a3fab61413a2c361d2ca0b6f3b2a6e5e35f3b1516c19d2ddcb5

````text
import {
  Bug, Droplets, Hammer, Home, Leaf, Paintbrush, Plug, Shield,
  Snowflake, Sparkles, ThermometerSun, Trees, type LucideIcon,
} from 'lucide-react';

export type ServiceCategory = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  situations: readonly string[];
  steps: ReadonlyArray<{ title: string; text: string }>;
  limits: readonly string[];
  faq: ReadonlyArray<{ q: string; a: string }>;
  related: ReadonlyArray<{ label: string; href: string }>;
  seo: { title: string; description: string };
  cta: string;
};

type ServiceInput = Omit<ServiceCategory, 'steps' | 'limits' | 'faq' | 'seo' | 'cta' | 'related'> & {
  related?: ServiceCategory['related'];
};

function service(input: ServiceInput): ServiceCategory {
  return {
    ...input,
    steps: [
      { title: 'Anliegen beschreiben', text: 'Schreib in eigenen Worten, was du bemerkst oder vorhast. Fotos, Maße oder Unterlagen kannst du ergänzen, wenn sie helfen.' },
      { title: 'Passenden nächsten Schritt einordnen', text: 'Einfach Hausen sortiert Gewerk, Dringlichkeit und nötige Informationen und sucht im aktiven regionalen Partnernetz nach einer passenden Option.' },
      { title: 'Du entscheidest', text: 'Kontakt, Kostenrahmen oder Angebot werden transparent. Ein Auftrag entsteht erst, wenn du ihn ausdrücklich bestätigst.' },
    ],
    limits: [
      'Verfügbarkeit hängt vom aktiven Partnernetz in deiner Region und der aktuellen Kapazität ab.',
      'Kostenangaben sind Orientierung; verbindlich wird es erst mit dem Angebot des ausführenden Betriebs.',
      'Qualifikations- oder zulassungspflichtige Arbeiten werden nur an dafür passende Partner vermittelt.',
    ],
    faq: [
      { q: 'Muss ich das richtige Gewerk kennen?', a: 'Nein. Genau dafür ist die Einordnung da. Beschreib das Problem oder Ziel so, wie du es wahrnimmst.' },
      { q: 'Entsteht sofort ein Auftrag?', a: 'Nein. Anfrage, Beratung und Auftrag sind getrennt. Du bestätigst selbst, ob und wann daraus eine Beauftragung wird.' },
      { q: 'Arbeitet Einfach Hausen selbst vor Ort?', a: 'Nein. Die Ausführung erfolgt durch eigenständige, geprüfte Partnerbetriebe aus dem regionalen Netzwerk.' },
    ],
    related: input.related ?? [],
    seo: {
      title: `${input.title} für dein Eigenheim`,
      description: `${input.title}: Anliegen einfach beschreiben, passenden regionalen Partner finden und den Vorgang in deiner Hausakte behalten.`,
    },
    cta: `${input.shortTitle}: Anliegen beschreiben`,
  };
}
export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  service({ slug: 'haus-technik', title: 'Haus & Technik', shortTitle: 'Haus & Technik', description: 'Kleinere Reparaturen, Montage und technische Anliegen', icon: Home, situations: ['Eine Tür klemmt oder ein Bauteil muss montiert werden.', 'Im Haus gibt es ein technisches Problem, das keinem Gewerk eindeutig zuzuordnen ist.', 'Kleinere Reparaturen sollen gesammelt und sinnvoll koordiniert werden.'] }),
  service({ slug: 'elektro-smart-home', title: 'Elektro & Smart Home', shortTitle: 'Elektro & Smart Home', description: 'Elektroarbeiten, Wallbox, Sicherheit und Gebäudeautomation', icon: Plug, situations: ['Eine Steckdose, Leuchte oder Sicherung macht Probleme.', 'Wallbox, Lastmanagement oder Smart-Home-Komponenten sollen eingeordnet werden.', 'Elektrische Sicherheit oder Modernisierung im Bestand steht an.'] }),
  service({ slug: 'heizung', title: 'Heizung, Klima & Energie', shortTitle: 'Heizung & Energie', description: 'Heizung, Wärmepumpe, Klima, Energieberatung und Wartung', icon: ThermometerSun, situations: ['Die Heizung macht Geräusche, Räume bleiben kalt oder eine Störung wird angezeigt.', 'Eine Wartung oder Optimierung der bestehenden Anlage steht an.', 'Wärmepumpe, Heizungstausch oder energetische Verbesserung soll vorbereitet werden.'], related: [{ label: 'Heizungswartung: Ablauf und Kosten', href: '/blog/heizung-wartung-kosten' }, { label: 'Hydraulischer Abgleich', href: '/lexikon/hydraulischer-abgleich' }, { label: 'Heizungsgesetz (GEG)', href: '/lexikon/heizungsgesetz' }] }),
  service({ slug: 'sanitaer-wasser', title: 'Sanitär & Wasser', shortTitle: 'Sanitär & Wasser', description: 'Sanitärarbeiten, Leitungen, Armaturen und wasserbezogene Probleme', icon: Droplets, situations: ['Armatur, Spülung oder Ablauf funktioniert nicht richtig.', 'Feuchtigkeit oder eine undichte Leitung muss eingeordnet werden.', 'Bad oder Sanitärbereich soll modernisiert werden.'], related: [{ label: 'Bad-Sanierung: Ablauf und Entscheidungen', href: '/blog/bad-sanierung-ablauf' }] }),
  service({ slug: 'dach-fenster-tueren', title: 'Dach, Fenster & Türen', shortTitle: 'Dach & Gebäudehülle', description: 'Dach, Dachrinne, Fenster, Türen, Schlosser und Gebäudehülle', icon: Hammer, situations: ['Nach Sturm oder Wetter sind Dach oder Dachrinne auffällig.', 'Fenster oder Türen schließen nicht sauber oder sollen ersetzt werden.', 'An der Gebäudehülle ist eine Reparatur oder Prüfung nötig.'] }),
  service({ slug: 'innenausbau-sanierung', title: 'Innenausbau & Sanierung', shortTitle: 'Innenausbau', description: 'Maler, Schreiner, Boden, Renovierung und Sanierungsarbeiten', icon: Paintbrush, situations: ['Räume sollen renoviert, gestrichen oder neu aufgebaut werden.', 'Boden, Trockenbau oder Schreinerarbeiten stehen an.', 'Eine Sanierung braucht mehrere Gewerke und eine sinnvolle Reihenfolge.'] }),
  service({ slug: 'garten-aussenbereich', title: 'Garten & Außenbereich', shortTitle: 'Garten & Außen', description: 'Gartenpflege, Heckenschnitt, Baumarbeiten und Pflasterarbeiten', icon: Trees, situations: ['Hecke, Baum oder größere Gartenpflege steht an.', 'Wege, Terrasse oder Außenflächen sollen repariert oder erneuert werden.', 'Ein wiederkehrender Pflegebedarf soll verlässlich organisiert werden.'] }),
  service({ slug: 'reinigung-pflege', title: 'Reinigung & Pflege', shortTitle: 'Reinigung & Pflege', description: 'Hausreinigung, PV-Reinigung, Dachrinne und laufende Pflege', icon: Leaf, situations: ['PV-Module, Dachrinne oder schwer erreichbare Außenflächen sollen gereinigt werden.', 'Regelmäßige Haus- oder Objektpflege wird gesucht.', 'Nach Arbeiten oder besonderen Ereignissen ist eine gründliche Reinigung nötig.'] }),
  service({ slug: 'saisonale-dienste', title: 'Saisonale Dienste', shortTitle: 'Saisonale Dienste', description: 'Winterdienst und wiederkehrende Aufgaben rund ums Grundstück', icon: Snowflake, situations: ['Winterdienst oder saisonale Außenpflege soll geplant werden.', 'Wiederkehrende Aufgaben sollen nicht jedes Jahr neu gesucht werden.', 'Ein saisonaler Termin soll in der Hausakte nachvollziehbar bleiben.'] }),
  service({ slug: 'spezialfaelle', title: 'Spezialfälle', shortTitle: 'Spezialfälle', description: 'Schädlingsbekämpfung und weitere qualifikationsabhängige Dienste', icon: Bug, situations: ['Ein Problem passt nicht sauber in ein klassisches Gewerk.', 'Schädlinge oder ein anderer qualifikationsabhängiger Spezialfall müssen eingeordnet werden.', 'Vor einer Beauftragung ist wichtig zu klären, welche Fachkunde wirklich benötigt wird.'] }),
  service({ slug: 'umzug-entruempelung', title: 'Umzug & Entrümpelung', shortTitle: 'Umzug & Räumen', description: 'Unterstützung beim Räumen, Umzug und objektbezogenen Dienstleistungen', icon: Sparkles, situations: ['Keller, Dachboden oder ganze Bereiche sollen geräumt werden.', 'Ein Umzug braucht praktische Unterstützung rund um das Objekt.', 'Vor Verkauf, Sanierung oder Übergabe muss Platz geschaffen werden.'] }),
  service({ slug: 'beratung-notfall', title: 'Beratung & dringende Fälle', shortTitle: 'Beratung & Notfall', description: 'Passende Ansprechpartner für fachliche Fragen oder dringenden Unterstützungsbedarf', icon: Shield, situations: ['Du brauchst zuerst nur eine fachliche Einschätzung und noch keinen Auftrag.', 'Ein dringender Fall soll priorisiert und an verfügbare Hilfe in der Region gegeben werden.', 'Du bist unsicher, ob sofort gehandelt werden muss oder eine normale Planung reicht.'], related: [{ label: 'Beratung ohne Buchungszwang', href: '/beratung' }, { label: 'Dringende Hilfe und Notfall-Bereitschaft', href: '/notfall' }] }),
] as const;

export const SERVICE_PATHS = SERVICE_CATEGORIES.map((service) => `/leistungen/${service.slug}`);

export function getServiceCategory(slug: string) {
  return SERVICE_CATEGORIES.find((service) => service.slug === slug);
}

````


## src/components/marketing/home-sections.tsx
SHA256: 987ab679fc7562ccfc0953749c63e3a73daab77bc63703edfe7df1bf47317015

````text
import Image from 'next/image';
import { ArrowRight, Check, CircleAlert, ShieldCheck } from 'lucide-react';
import { IntakeForm } from '@/components/home/intake-form';
import { Reveal } from './motion';
import { AppFrame, ContactScreen, MiniContact, MiniCosts, MiniHausakte, MiniReminder, OrderStatusScreen, ReminderScreen } from './app-frames';
import { FACTS, HOME_FAQ, PRINCIPLES } from './content';
import { SERVICE_CATEGORIES } from './service-catalog';
import { Eyebrow, Facts, Faq, LinkButton, ProofRow, Section, Statement, Steps, TextLink } from './ui';
import styles from './mkt.module.css';
import Link from 'next/link';

export { HomeHero } from './home-hero';

/* 2 · Problem mirror: the reader recognizes themselves before we talk product */
const MIRROR = [
  { tag: 'Seit Monaten aufgeschoben', quote: 'Die Dachrinne müsste mal … aber wen ruf ich da eigentlich an?' },
  { tag: 'Verlorenes Wissen', quote: 'Wie hieß der Heizungsmensch von damals nochmal? Und war da nicht noch Garantie drauf?' },
  { tag: 'Zettelwirtschaft', quote: 'Die Rechnung von 2022 liegt irgendwo im Ordner. Oder in einer Mail. Oder gar nicht.' },
] as const;

export function ProblemMirror() {
  return (
    <Section eyebrow="Kennst du das?" title="Ein Haus ist wunderbar. Und ein Job, den niemand dir beigebracht hat." text="Nicht die Reparatur ist anstrengend. Anstrengend ist das Drumherum: wissen, wen man braucht, jemanden erreichen, dranbleiben, und am Ende nichts wiederfinden.">
      <div className={styles.cardGrid} data-cols="3">
        {MIRROR.map((m, i) => (
          <Reveal key={m.tag} delay={i * 0.07} className={styles.mirrorCard}>
            <span className={styles.mirrorTag}>{m.tag}</span>
            <p className={styles.mirrorQuote}>{m.quote}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 3 · The switch: one sentence + before/after */
export function TheSwitch() {
  return (
    <section className={`${styles.statement} ${styles.toneSand}`}>
      <div className={styles.statementInner}>
        <Reveal><Eyebrow terra>Der Unterschied</Eyebrow></Reveal>
        <Reveal delay={0.08}><p className={styles.statementText}>Du musst nicht wissen, welches Gewerk. <mark>Du musst es nur sagen.</mark></p></Reveal>
      </div>
      <div className={`${styles.container} ${styles.beforeAfter}`}>
        <Reveal className={styles.baBefore}>
          <span className={styles.baLabel}>Bisher</span>
          <ul className={styles.baList}>
            <li><CircleAlert size={18} /> Googeln, drei Betriebe anrufen, zwei rufen nie zurück</li>
            <li><CircleAlert size={18} /> Termine per WhatsApp, Angebote per Mail, Rechnung auf Papier</li>
            <li><CircleAlert size={18} /> Nach zwei Jahren weiß niemand mehr, was gemacht wurde</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1} className={styles.baAfter}>
          <span className={styles.baLabel}>Mit Einfach Hausen</span>
          <ul className={styles.baList}>
            <li><Check size={18} /> Ein Satz reicht: „Heizung macht Geräusche“</li>
            <li><Check size={18} /> Ein geprüfter Partner, ein Ansprechpartner, ein Kostenrahmen vorab</li>
            <li><Check size={18} /> Alles landet automatisch in deiner Hausakte</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* 4 · How it works: three steps with real screens */
export function HowItWorks() {
  return (
    <Section tone="surface" eyebrow="So funktioniert's" title="Drei Schritte. Danach kümmert sich ein Mensch." text="Kein Formular-Marathon, kein Vergleichsportal. Du sagst, was los ist. Der Rest ist unsere Arbeit." id="so-funktionierts">
      <Steps
        items={[
          { title: 'Du beschreibst, was ansteht', text: 'In deinen Worten, per Text, Foto oder Sprachnachricht. Wir ordnen ein, was dahintersteckt.', visual: <AppFrame size="sm"><ReminderScreen /></AppFrame> },
          { title: 'Wir organisieren', text: 'Passender Partnerbetrieb aus deiner Region, Kostenrahmen, Terminvorschlag. Du bestätigst oder lehnst ab.', visual: <AppFrame size="sm"><OrderStatusScreen /></AppFrame> },
          { title: 'Ein Mensch übernimmt', text: 'Dein Ansprechpartner hat Namen, Betrieb und Telefonnummer. Er meldet sich, kommt, erledigt. Fertig ist es erst, wenn du zufrieden bist.', visual: <AppFrame size="sm"><ContactScreen /></AppFrame> },
        ]}
      />
      <div className={`${styles.mt} ${styles.center} ${styles.centerRow}`}>
        <TextLink href="/so-funktionierts">Den ganzen Ablauf ansehen</TextLink>
      </div>
    </Section>
  );
}

/* 5 · Benefits: what you actually get */
const BENEFITS = [
  { title: 'Eine Hausakte, die mitdenkt', text: 'Jede Reparatur, jede Rechnung, jede Garantie an einem Ort. Nicht weil du sie abheftest, sondern weil sie nach jedem Vorgang automatisch dort landet. Beim Verkauf ist das bares Geld.', visual: <MiniHausakte />, href: '/hausakte', label: 'Zur Hausakte' },
  { title: 'Erinnerungen, bevor es teuer wird', text: 'Heizungswartung, Dachrinnen vor dem Winter, Rauchmelder-Pflicht. Du bekommst rechtzeitig Bescheid und kannst mit einem Tipp organisieren lassen.', visual: <MiniReminder />, href: '/so-funktionierts', label: 'Wie das funktioniert' },
  { title: 'Ein Mensch, kein Ticket', text: 'Du sprichst nicht mit einer Hotline, sondern mit Markus, der am Donnerstag kommt. Du kennst seinen Namen, seinen Betrieb, seine Nummer, bevor er klingelt.', visual: <MiniContact />, href: '/so-funktionierts#ansprechpartner', label: 'Dein Ansprechpartner' },
  { title: 'Kostenrahmen vor dem Termin', text: 'Keine Überraschung auf der Rechnung. Du siehst vorher, womit du rechnen musst, und gibst erst dann frei.', visual: <MiniCosts />, href: '/preise', label: 'Zu den Preisen' },
] as const;

export function Benefits() {
  return (
    <Section eyebrow="Was du bekommst" title="Weniger im Kopf. Mehr im Griff." text="Einfach Hausen ist kein Handwerker-Portal. Es ist der Ort, an dem dein Haus verwaltet wird, damit du es nicht tun musst.">
      <div className={styles.benefitList}>
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} className={styles.benefit} {...({ 'data-flip': i % 2 === 1 ? 'true' : 'false' } as Record<string, string>)}>
            <div className={styles.benefitCopy}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              <TextLink href={b.href}>{b.label}</TextLink>
            </div>
            <div className={styles.benefitVisual}>{b.visual}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 6 · Trust: honest facts + principles + a real face */
export function Trust() {
  return (
    <Section tone="soft" eyebrow="Warum du uns vertrauen kannst" title="Keine Marktplatz-Logik. Klare Regeln." text="Wir verdienen nicht daran, deine Anfrage möglichst oft zu verkaufen. Wir verdienen daran, dass dein Haus gut läuft.">
      <Facts items={FACTS} />
      <div className={`${styles.split} ${styles.mt}`}>
        <Reveal className={styles.photo} data-ratio="4:3">
          <Image src="/images/marketing/partner-doorstep.jpg" alt="Ein Partnerbetrieb im Gespräch mit Hausbesitzern an der Haustür" width={1024} height={1024} sizes="(min-width: 900px) 560px, 100vw" />
          <span className={styles.photoCaption}><ShieldCheck size={18} aria-hidden="true" /> Persönlich geprüfte Partnerbetriebe aus deiner Region</span>
        </Reveal>
        <div className={styles.stack}>
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className={styles.numberedRow} data-pad="m">
                <span className={styles.numberedNum}><Check size={16} strokeWidth={3} /></span>
                <div className={styles.numberedBody}><h3>{p.title}</h3><p>{p.text}</p></div>
              </div>
            </Reveal>
          ))}
          <TextLink href="/partner">Für Betriebe: Partner werden</TextLink>
          <TextLink href="/sicherheit">Unsere Sicherheits- und Datenprinzipien</TextLink>
        </div>
      </div>
    </Section>
  );
}

/* 7 · Categories as compact chips */
export function CategoriesCompact() {
  return (
    <Section tone="surface" eyebrow="Wofür du uns fragen kannst" title="Alles, was ein Haus so braucht." text="Du musst dein Anliegen keiner Kategorie zuordnen. Das übernehmen wir. Zur Orientierung: so breit ist das Netz." tight>
      <div className={styles.catGrid}>
        {SERVICE_CATEGORIES.slice(0, 11).map(({ icon: Icon, title, slug }) => (
          <Link key={slug} className={styles.cat} href={`/leistungen/${slug}`}><Icon size={20} aria-hidden="true" /> {title}</Link>
        ))}
        <Link className={styles.catMore} href="/leistungen">Alle Leistungen <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </Section>
  );
}

/* 8 · Pilot: real scarcity from the actual pilot phase */
export function PilotBand() {
  return (
    <section className={styles.sectionTight}>
      <Reveal className={styles.pilotBand}>
        <div className={styles.pilotCopy}>
          <span className={styles.pilotBadge}>Pilotphase</span>
          <h2>Die ersten 1.000 Haushalte zahlen dauerhaft 15 % weniger.</h2>
          <p>Wir bauen Einfach Hausen regional auf und starten mit einer begrenzten Zahl an Haushalten. Wer jetzt sein kostenloses Hauskonto anlegt, bekommt den Pilot-Status automatisch. Das FREE-Konto bleibt dabei immer 0 €.</p>
          <div className={styles.pilotActions}>
            <LinkButton href="/register?role=homeowner" variant="terra">Platz sichern, kostenlos</LinkButton>
            <TextLink href="/preise">Preise ansehen</TextLink>
            <TextLink href="/pilotphase">Bedingungen ansehen</TextLink>
          </div>
        </div>
        <ul className={`${styles.pilotPerks} ${styles.pilotSide}`}>
          <li><Check size={18} /> 15 % Dauer-Vorteil auf alle bezahlten Pakete, solange dein Konto besteht</li>
          <li><Check size={18} /> Direkter Draht zum Team, dein Feedback prägt das Produkt</li>
          <li><Check size={18} /> Keine Frist, kein Kleingedrucktes, jederzeit kündbar</li>
        </ul>
      </Reveal>
    </section>
  );
}

/* 9 · FAQ */
export function HomeFaq() {
  return (
    <Section eyebrow="Häufige Fragen" title="Was du vorher wissen willst." center>
      <div className={styles.centerRow}>
        <Faq items={HOME_FAQ} />
      </div>
      <div className={`${styles.mt} ${styles.centerRow}`}>
        <TextLink href="/hilfe">Alle Fragen und Antworten</TextLink>
      </div>
    </Section>
  );
}

/* 10 · Final CTA */
export function FinalCta() {
  return (
    <section className={styles.finalCta} id="final-cta">
      <div className={styles.finalCtaInner}>
        <Reveal><Eyebrow>Dein nächster Schritt</Eyebrow></Reveal>
        <Reveal delay={0.06}><h2>Sag uns, was ansteht. Den Rest übernehmen wir.</h2></Reveal>
        <Reveal delay={0.1}><p className={styles.lead}>Unverbindlich, kostenlos und in deinen Worten. Ein Satz reicht.</p></Reveal>
        <Reveal delay={0.14} className={styles.container} data-pad="none">
          <IntakeForm variant="band" />
        </Reveal>
        <Reveal delay={0.18} className={styles.finalCtaSecondary}>
          <span>Noch kein konkretes Anliegen?</span>
          <a href="/register?role=homeowner">Hauskonto kostenlos anlegen</a>
          <span aria-hidden="true">·</span>
          <ProofRow items={['kein Auftrag ohne deine Entscheidung']} />
        </Reveal>
      </div>
    </section>
  );
}

export { Statement };

````


## Exact source and asset manifest

```json
[
  {
    "path": "AGENTS.md",
    "sha256": "410aad009e2d8ec3dadda5fe28b80faf340c4da309bfa90d66d939544e3255e8",
    "bytes": 28241
  },
  {
    "path": "README.md",
    "sha256": "6d4b8f4491c23595e5aad512e9e89667ec736337b1a764d20bb3a814c3149cb7",
    "bytes": 34483
  },
  {
    "path": "DESIGN.md",
    "sha256": "31acaf905fdd05371fd68b99726c7fe9813eb87d353378cfa73fbcde920f8f53",
    "bytes": 2534
  },
  {
    "path": "docs/DESIGN_SYSTEM.md",
    "sha256": "d75a2e4f2b3c07b2c9b1fc3444acdf440d1177c431cc182f4101fdae057812e7",
    "bytes": 2544
  },
  {
    "path": "docs/PRODUCT_VISION.md",
    "sha256": "bea238867c9f1eb516644f593ff387dbdca1eefeb68135542cbb347e5702b01f",
    "bytes": 16472
  },
  {
    "path": "docs/PRODUCT_POSITIONING.md",
    "sha256": "231337525b218c6b24658563aae468f163d084dd5d2ab1c7c75ddce110ae5305",
    "bytes": 5463
  },
  {
    "path": "docs/COMPANY_IDENTITY.md",
    "sha256": "c6ad47b657c28ff266288a15b69229f7467dc5d5030c0f199fa88cda46deb3a1",
    "bytes": 968
  },
  {
    "path": "docs/NEXT_AGENT.md",
    "sha256": "ed9ba9bf3348e14fd0f31f87b127327d81bc15887f49c78d9848e2af7aa38374",
    "bytes": 5830
  },
  {
    "path": "docs/PRODUCTION_HANDOVER.md",
    "sha256": "d6851ae30e30afbe004ba9978cec530e7b8f60f6e1614595cd9a867dc453a74e",
    "bytes": 34291
  },
  {
    "path": "docs/ARCHITECTURE.md",
    "sha256": "127dd59e5c016f1c70bed7341dae6edddd28a7e473f432640ce1c01792efa308",
    "bytes": 27740
  },
  {
    "path": "docs/OPERATIONS.md",
    "sha256": "3c40933aeb03ba0926880c7f65e616953b1454cdd74dfe3d93337b35c18ca4ac",
    "bytes": 16599
  },
  {
    "path": "docs/LEXIKON.md",
    "sha256": "ab0c3e2a45a1e18bb6cf21b8fe397cdef775c3edb3aec71a21a0974ab6839a67",
    "bytes": 8956
  },
  {
    "path": "package.json",
    "sha256": "dd4695e7ce397a7e7e77e15f22ab9495f8ccbee1a63edf88b03e4dc613a92a0e",
    "bytes": 4740
  },
  {
    "path": "src/app/layout.tsx",
    "sha256": "f54944f22ee23a43e40d1d2ba3b4d8f10e65c7f44f0397a986a79cb780c0b99b",
    "bytes": 2665
  },
  {
    "path": "src/app/globals.css",
    "sha256": "4721b8a3af2685c2fbd629be5b2916d643fd0b09f1907f205df791d51818841a",
    "bytes": 104534
  },
  {
    "path": "src/app/design-system.css",
    "sha256": "234971f6eeb51a6f6c96fb4e3b73190e159944d7a7ed9d371a5d38874e45c9bd",
    "bytes": 155085
  },
  {
    "path": "src/app/page.tsx",
    "sha256": "de2a142c0570d247d22d07ddf57e8a2729c20e603c45683f0ca567a63c949000",
    "bytes": 1275
  },
  {
    "path": "src/components/Logo.tsx",
    "exists_at_base": false
  },
  {
    "path": "src/components/logo.module.css",
    "sha256": "faf57824a90dfafde0ae8341cd6753a4b7a56c43f7e0955b662a364a9a40b2e7",
    "bytes": 471
  },
  {
    "path": "src/components/marketing/site-shell.tsx",
    "sha256": "d7687e0c0acf4fcaaecf274ffa96a2a2a41ef9d115b462b882b32d6aedea1f6a",
    "bytes": 11642
  },
  {
    "path": "src/components/marketing/tokens.css",
    "sha256": "823a56f5047ef4a9a9d105de50ad8d0a53f8578f90d307610f18d704891c7e65",
    "bytes": 5201
  },
  {
    "path": "src/components/marketing/mkt.module.css",
    "sha256": "968d67ed6f24509c22e92b17d57a3b2e2405750d9c00d8b071464f856afeb2a0",
    "bytes": 43787
  },
  {
    "path": "src/components/marketing/home-hero.tsx",
    "sha256": "b096015c0fc662c8244090992cf778c3c025bfcacc497d68faa1a722e14860be",
    "bytes": 16037
  },
  {
    "path": "src/components/marketing/home-hero.module.css",
    "sha256": "26483e8266e070d955a8455af391b7920d6cc79392714253da1ce241e06373b9",
    "bytes": 18818
  },
  {
    "path": "src/components/marketing/hero-orchestration.tsx",
    "sha256": "ebcde7ee80f00c7f54792ad95066515d2a7a2ebe01ef8764fdf1d1ad6b33f21e",
    "bytes": 15291
  },
  {
    "path": "src/components/marketing/service-catalog.tsx",
    "sha256": "cbdebdf254000a3fab61413a2c361d2ca0b6f3b2a6e5e35f3b1516c19d2ddcb5",
    "bytes": 8507
  },
  {
    "path": "src/components/marketing/home-sections.tsx",
    "sha256": "987ab679fc7562ccfc0953749c63e3a73daab77bc63703edfe7df1bf47317015",
    "bytes": 11573
  },
  {
    "path": "public/brand/logo-full.png",
    "sha256": "ca128f0ecfcffc93853f5271453f318be28ed4462850b06072c33afbeb1353cd",
    "bytes": 121939,
    "unchanged_asset": true
  },
  {
    "path": "public/brand/logo-mark.png",
    "sha256": "34f78c64e1274419de7471385a24a630773c57ecd22efcbaad9eba6f74f8638e",
    "bytes": 24327,
    "unchanged_asset": true
  },
  {
    "path": "public/brand/LOGO_white.png",
    "sha256": "4665059d6e56f7727279a1624efa77c7673280161957595307cf174f6a0ce304",
    "bytes": 1090488,
    "unchanged_asset": true
  },
  {
    "path": "public/brand/LOGO_black.png",
    "sha256": "e46525ff78b1633d7249c251bf7d883baa6b2fe74433fce5cb70e87f74e1ee97",
    "bytes": 1059386,
    "unchanged_asset": true
  },
  {
    "path": "public/brand/einfachhausen-mark.svg",
    "sha256": "c0c3ed17f1eec1344d43fc199c8c50fa41aed14b72ac81bfd08a0776881fb0bf",
    "bytes": 303,
    "unchanged_asset": true
  },
  {
    "path": "public/brand/einfachhausen-app-icon.svg",
    "sha256": "70582ea54baae53361872a8cf1dcb7d08b03aa0f3ce7d431269200db981a7344",
    "bytes": 363,
    "unchanged_asset": true
  },
  {
    "path": "src/components/marketing/assets/logo-full.png",
    "sha256": "ca128f0ecfcffc93853f5271453f318be28ed4462850b06072c33afbeb1353cd",
    "bytes": 121939,
    "unchanged_asset": true
  },
  {
    "path": "src/components/marketing/assets/logo-mark.png",
    "sha256": "34f78c64e1274419de7471385a24a630773c57ecd22efcbaad9eba6f74f8638e",
    "bytes": 24327,
    "unchanged_asset": true
  },
  {
    "path": "src/fonts/InterVariable.woff2",
    "sha256": "0de3908cf5ef213ab1404cc5da94a976faaa886c3479a274a7d66ad80b37c64a",
    "bytes": 61284,
    "unchanged_asset": true
  },
  {
    "path": "public/images/marketing/family-home.jpg",
    "sha256": "13b908f621d705d9adc6a9b30fc4f750265463d450d225dc2ab459215aa0b845",
    "bytes": 202707,
    "unchanged_asset": true
  },
  {
    "path": "public/images/marketing/partner-doorstep.jpg",
    "sha256": "fa67a64c89d44f716d5fb3b047dbfaed955391bd2e76e902eb9ef729028e9905",
    "bytes": 155538,
    "unchanged_asset": true
  },
  {
    "path": "tests/visual-baselines/home@desktop.png",
    "sha256": "156135cd781ea4355444f9c7037560c6004cd9733108014fc50064cc59fd5e6b",
    "bytes": 230323,
    "unchanged_asset": true
  },
  {
    "path": "tests/visual-baselines/app/owner_app_home__mobile.png",
    "sha256": "70d970fe5d757e90e8da63d2b5e74c631a19209e3c4b17cbeb02364509d3f318",
    "bytes": 50069,
    "unchanged_asset": true
  }
]
```
