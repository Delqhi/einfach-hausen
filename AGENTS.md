<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Einfach Hausen engineering workflow

### Single-goal coordination contract

- **One repository = one goal.** Every agent works toward the same canonical goal from `.sin-gpt-web/taskplan.sqlite3`: finish the complete Einfach Hausen platform to production quality, prove acceptance, then converge the repository. Do not create side-roadmaps, duplicate task lists, speculative redesign waves, or parallel infrastructure goals.
- **Mandatory read order before work:** `docs/NEXT_AGENT.md` → `.sin-gpt-web/TASKPLAN.md` → the exact `sin-gpt-web-state show <TASK>` record → `docs/PRODUCT_VISION.md` and any task-specific docs. Historical reports are evidence, never the current roadmap.
- **Always take the highest-priority eligible canonical task.** Do not work a completed/cancelled task again. Do not invent a new task when an existing canonical task covers the work.
- **Current explicit operator roadmap (2026-08-27 HA):** **T-0100..T-0167** — v2 plus **T-0166 Supabase Postgres+Storage HA-Migration** + **T-0167 Capacitor iOS/Android**. First eligible: **T-0100** + parallel **T-0166/T-0167**. Final gates: **T-0129/T-0130 → T-0131 → T-0166/T-0167 → HA Release**. SQLite nur Fallback, Supabase Primary. External-authority nur **#16, #11, #14** — **#12 App Stores kein Blocker mehr** (Capacitor produktiv).
- Before ending a wave, update canonical task evidence/state, render+validate the taskplan, and update `docs/NEXT_AGENT.md` only if the continuation point changed. Leave exactly one unambiguous next action for the next agent.
- README, worker reports, GitHub issues, Notion and ad-hoc docs must not become competing engineering roadmaps. They may link to or summarize the canonical taskplan only.

- `docs/PRODUCT_VISION.md` is the binding product definition. Preserve the core model: AI organizes, verified regional partners execute, and a concrete human contact takes over after booking.
- `docs/PRODUCT_POSITIONING.md` is the binding strategic positioning layer. Product and UX choices must reinforce Einfach Hausen as the **personal house manager / operating system for the home**: reduce mental load, increase decision confidence, preserve house memory and value, and reduce fragmented tools/contacts. Do not foreground AI, lead-marketplace or generic portal positioning when a homeowner-facing benefit can express the same capability.
- `DESIGN.md` is the binding visual/UX contract across the public website, homeowner app, and partner app. Read it before touching UI. During parallel surface-specific design waves, treat it and shared business logic as read-only and stay inside the task's allowed paths.
- For architecture, dependency flow, blast-radius questions, and unfamiliar code paths, use Graphify first: `graphify query`, `graphify explain`, or `graphify path`. If the graph is absent or stale, run `npm run graph:update`.
- Graphify output is generated local state under `graphify-out/` and is intentionally not committed. Git hooks installed by Graphify refresh the graph after commit/checkout.
- Before shipping application changes run `npm run lint`, `npm run build`, and the relevant E2E flow (`npm run test:e2e` for end-to-end product changes).
- Reuse the existing OCI stack (OmniRoute, Supabase, Kestra, Cloudflare) instead of introducing parallel infrastructure unless there is a demonstrated gap.
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

- Last synchronized task: `T-0167`
- Canonical taskplan: `.sin-gpt-web/taskplan.sqlite3`
- Canonical repo goal: Einfach Hausen HA-Produktion — Supabase Postgres+Storage Primary, Capacitor iOS/Android, SQLite nur Fallback
- Resume rule: product-completion HA is T-0100..T-0167; continue highest-priority eligible task, #12 App Stores kein Blocker
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

## T-0168 Auth- und Visual-Acceptance-Regel (2026-08-28)

- **Produktions-Auth:** Supabase ist die serverseitige Identity Authority. Lokale SQLite-/`mh_session`-Auth ist nur als expliziter Local-Dev-Fallback zulässig und muss in Produktion fail-closed sein.
- **Client-Grenze:** `AuthContext` ist UI-State, nicht Security Boundary. Geschützte Server Components, Route Handler und Server Actions autorisieren serverseitig.
- **Identity Mapping:** Supabase-Subject und bestehende Application-User-ID dürfen nicht ungeprüft gleichgesetzt werden; Mapping muss explizit belegt sein.
- **Visual Acceptance:** Finale T-0168-Abnahme benötigt frische 390×844 Reference/Actual/Overlay/Diff-Evidence und grüne Auth/Security/Visual/Build/GitNexus-Gates. Vollständiger Vertrag: `docs/T0168_DEEP_RESEARCH.md`.

## Notion 1:1 Regel (2026-08-28) - lokal gespeichert

- **Quelle:** https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d - 12 Bilder lokal unter public/notion/ (LogIn oder Neu.png, first action.png, eigentümer.login.png, kontoerstellung.eigentümer.png, Homesceen_EH_02.png, Menüpunkte_01.png, menüpunkte offen.png, Dienstleister.login.png, Homesceen.dienstleister.png, menüleiste_dienstleister.png, geöffnetes menü_dienstleister.png, firmendaten und leistungen handwerker.png)
- **Regel:** Alles was nicht 100% 1:1 wie auf den Bildern aussieht, wird entfernt und neu gemacht. Keine 90% Lösungen. Pixelgenau: Farben, Radien, Shadows, Typo, Icons, Header, Tabbar.
- **Design-Basis:** Notion Bilder > DESIGN.md > Implementation. DESIGN.md wird nach Notion kalibriert.
