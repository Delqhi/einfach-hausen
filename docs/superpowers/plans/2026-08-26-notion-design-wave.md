# Notion-led App Design Wave Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement T-0167 through T-0177 so the homeowner and provider apps follow the approved Notion visual direction while preserving all product, authorization, routing, and data behavior.

**Architecture:** Keep business pages as Server Components. Introduce only the smallest client boundary needed for the mobile closed/open menu, using the native `<dialog>` element so modal focus containment and background inertness are browser-provided. Consolidate app-facing colors/spacing/radii into one `--eh-*` token family; owner/provider route CSS may keep semantic aliases but must reference the same shared values. Remove legacy dark provider styling instead of relying on specificity overrides. Auth remains route-level UI, but consumes the same visual foundations.

**Tech Stack:** Next.js 16.3.1 App Router, React 19.2.8, TypeScript, CSS Modules/global CSS, Lucide React, Node regression scripts, Playwright Core E2E.

**Spec:** `.sin-gpt-web/reports/T-0164-notion-design-analysis.md`

## Global Constraints

- The four Notion homeowner frames are the binding visual evidence; their text is not product scope.
- No provider or desktop reference frame exists, so provider/desktop are derived from the same system rather than invented as separate themes.
- Preserve existing `/app/**`, `/pro/**`, auth, booking, contact-only, payment, private-media, and permission behavior.
- Preserve the homeowner five-destination mobile navigation and the provider route structure.
- Keep `DESIGN.md` product principles: light canvas, green brand/action color, one dominant action, fewer cards, mobile-first, WCAG AA, 44px+ touch targets.
- Do not reset, clean, force, overwrite unrelated dirty work, or mutate production data.
- Before editing a function/component symbol, run GitNexus impact analysis; before commit, run GitNexus detect-changes.
- Use Graphify/GitNexus architecture evidence when available; if a CLI is unavailable, record the tooling limitation and continue only with direct source evidence.

---

### Task 1: T-0167 Shared shell + closed/open mobile menu

**Files:**
- Modify: `src/components/bottom-nav.tsx`
- Modify: `src/components/shell.tsx` only if required for semantics/props
- Modify: `src/app/design-system.css`
- Modify: `src/app/app/homeowner.module.css`
- Modify: `src/app/pro/provider-workspace.module.css`
- Create: `scripts/t0167-design-regression.mjs`

**Interfaces:**
- Consumes: existing `ownerNav`, `providerNav`, `isNavActive`, `BottomNav({ role, active })`.
- Produces: existing `BottomNav` API unchanged; homeowner `Mehr` keeps fallback `href="/app/more"` while opening an accessible modal menu when JavaScript is available.

- [ ] Write `scripts/t0167-design-regression.mjs` assertions that fail until homeowner mobile navigation contains a native `<dialog>`, the `Mehr` trigger exposes `aria-haspopup="dialog"` + `aria-expanded`, the fallback `/app/more` href remains present, the dialog has an accessible name, and provider nav route strings remain unchanged.
- [ ] Run `node scripts/t0167-design-regression.mjs`; confirm failure is caused by missing dialog/open-state implementation.
- [ ] Run GitNexus impact for `BottomNav`, `isNavActive`, and `AppShell`; stop on HIGH/CRITICAL risk.
- [ ] Convert `bottom-nav.tsx` to the narrow client boundary, add native dialog state for homeowner `Mehr`, close on route selection/cancel, and explicitly return focus to the trigger.
- [ ] Add shared dialog/backdrop/sheet CSS with 44px targets, safe-area bottom padding, open/close visual state, and reduced-motion behavior.
- [ ] Run the focused regression; confirm PASS.

### Task 2: T-0168 Auth / Anmeldung alignment

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`
- Modify: `src/app/design-system.css`
- Extend: `scripts/t0167-design-regression.mjs`

**Interfaces:**
- Consumes: existing `loginAction`, `registerAction`, `Logo`, current form names/autocomplete semantics.
- Produces: same form/action contracts and redirects; only visual hierarchy/classes change.

- [ ] Add failing source assertions for a shared auth visual shell, green primary auth CTA, minimum 46px fields, 16px mobile input text, restrained card radius/shadow, and preserved form field/action names.
- [ ] Run focused regression and verify expected RED.
- [ ] Run GitNexus impact for `Login` and `Register` page symbols if indexed.
- [ ] Implement auth-specific classes using shared `--eh-*` tokens; preserve labels, autocomplete, validation, and server actions.
- [ ] Run focused regression; confirm PASS.

### Task 3: T-0173 Shared tokens + remove dark provider legacy

**Files:**
- Modify: `src/app/design-system.css`
- Modify: `src/app/globals.css`
- Modify: `src/app/app/homeowner.module.css`
- Modify: `src/app/pro/provider-workspace.module.css`
- Modify: `src/components/shell.tsx`
- Extend: `scripts/t0167-design-regression.mjs`

**Interfaces:**
- Consumes: current CSS custom properties and `.pro-theme` class.
- Produces: one canonical light `--eh-green-*`/surface/text/border token family; owner/provider aliases point to those values; `.pro-theme` no longer encodes a dark palette; Pro logo no longer depends on inverse-dark semantics.

- [ ] Add failing assertions that active app CSS contains the canonical palette and that dark `.pro-theme` rules (`#0d110e`, `#111512`, `--navy` provider surfaces, dark bottom-nav) are absent from active portal styling.
- [ ] Run focused regression; confirm RED.
- [ ] Run GitNexus impact for `AppShell` before changing the logo invocation.
- [ ] Consolidate shared tokens and delete/neutralize legacy dark provider selectors rather than layering a later dark-to-light override.
- [ ] Change Pro logo semantics so the light provider shell does not request inverse branding.
- [ ] Run focused regression; confirm PASS.

### Task 4: T-0169 Homeowner homescreen + composer hierarchy

**Files:**
- Modify only if necessary: `src/app/app/page.tsx`
- Modify: `src/app/app/homeowner.module.css`
- Extend: `scripts/t0167-design-regression.mjs`

**Interfaces:**
- Consumes: existing `HomeownerHausmeisterComposer`, dashboard DB queries, existing next-step links.
- Produces: no data-flow changes; stronger reference hierarchy: greeting/house context → composer → next items → house record.

- [ ] Add failing style assertions for body/meta readability (important metadata >=12px), one dominant composer surface, and flat next-step rows.
- [ ] Run focused regression; confirm RED where current 9–11px metadata violates the contract.
- [ ] If JSX changes are needed, run GitNexus impact for `Dashboard`; otherwise make CSS-only edits.
- [ ] Raise critical mobile nav/meta/status sizes to readable values without turning secondary text into competing hierarchy; preserve current dashboard data and CTA ordering.
- [ ] Run focused regression; confirm PASS.

### Task 5: T-0170/T-0171/T-0172 Homeowner secondary flows

**Files:**
- Modify as evidence requires: `src/app/app/homeowner.module.css`
- Modify only when structure is required: `src/app/app/jobs/page.tsx`, `src/app/app/home/page.tsx`, `src/app/app/messages/**`
- Extend: `scripts/t0167-design-regression.mjs`

**Interfaces:**
- Consumes: existing homeowner routes, job/contact/message actions and authorization.
- Produces: same route/data contracts; visual primitives and readable hierarchy only.

- [ ] Add source/style regression assertions for job rows, house-menu rows, message bubbles/composer, status pills, and 12px+ important metadata.
- [ ] Run focused regression; confirm RED for remaining violations.
- [ ] Run GitNexus impact only for page/component symbols that actually need JSX edits.
- [ ] Harmonize lists/cards/status/spacing using shared tokens; keep sale consent, message authorization, quote/payment, and contact-only semantics unchanged.
- [ ] Run focused regression; confirm PASS.

### Task 6: T-0174/T-0175/T-0176 Provider worklist, detail, team/trust

**Files:**
- Modify: `src/app/pro/provider-workspace.module.css`
- Modify only if hierarchy requires: `src/app/pro/page.tsx`, `src/app/pro/jobs/[id]/page.tsx`, `src/app/pro/team/page.tsx`, `src/app/pro/profile/page.tsx`
- Modify only if reusable UI semantics require: `src/components/provider/workspace.tsx`
- Extend: `scripts/t0167-design-regression.mjs`

**Interfaces:**
- Consumes: current `ProviderAccessBoundary`, `ProviderNextStep`, `ProviderPageIntro`, AN/AUS access logic.
- Produces: same permission and action contracts; worklist shows what/where/when/status/next step with one dominant next action; people-first team/trust presentation.

- [ ] Add failing assertions for light provider canvas, readable 12px+ operational metadata, one primary next-step style, and absence of dark-provider dependencies.
- [ ] Run focused regression; confirm RED.
- [ ] Run GitNexus impact for any provider component/page symbol before JSX edits.
- [ ] Tighten provider row and detail hierarchy through CSS first; only change JSX when necessary to make the next action or people-first grouping explicit.
- [ ] Run focused regression plus existing provider-related E2E coverage.

### Task 7: T-0177 Responsive + WCAG acceptance

**Files:**
- Create: `scripts/t0177-design-browser.mjs`
- Modify: `package.json` to expose `test:design` and `test:design:browser`
- Modify CSS/components only for defects reproduced by the new browser test.

**Interfaces:**
- Consumes: isolated E2E fixture patterns from existing scripts, Playwright Core, current auth/session test seams.
- Produces: deterministic design acceptance at 320, 375, 390, 768, 1024, and 1320/1440 widths; explicit menu keyboard/focus checks.

- [ ] Write browser checks before final remediation: auth at 390; homeowner menu closed/open; Escape closes and focus returns; no horizontal overflow at required widths; minimum target sizes for primary nav/buttons; computed font size >=12px for primary nav/status/meta samples; provider canvas is light; critical focus-visible control receives keyboard focus.
- [ ] Run the browser script and confirm any reproduced failures are meaningful.
- [ ] Apply only evidence-driven CSS/semantic fixes, each after a failing assertion.
- [ ] Re-run browser test until PASS.
- [ ] Run `npm run lint`, `npm run build`, `npm run test:security`, `npm run test:e2e`, and `git diff --check`.
- [ ] Run GitNexus `detect_changes` / compare to `main`; verify expected visual/UI blast radius only.

### Task 8: Canonical task state + mandatory handover docs

**Files:**
- Update via canonical state tool: `.sin-gpt-web/taskplan.sqlite3` and rendered `.sin-gpt-web/TASKPLAN.md`
- Update after implementation: `AGENTS.md`, `README.md`, `docs/NEXT_AGENT.md`, `docs/PRODUCTION_HANDOVER.md`, `docs/ARCHITECTURE.md`
- Create/refresh reports under `.sin-gpt-web/reports/`

**Interfaces:**
- Consumes: verified task evidence from Tasks 1–7.
- Produces: T-0167…T-0177 completed only when their acceptance evidence is green; one unambiguous continuation point.

- [ ] Complete design tasks one by one with exact file/test evidence; do not mark failures done.
- [ ] Render and validate canonical taskplan.
- [ ] Update mandatory docs so the design-system state, shared navigation behavior, responsive acceptance and branch/commit evidence are current.
- [ ] Verify documentation changes do not overwrite unrelated concurrent edits; reconcile manually if main changed during the wave.
- [ ] Run final status/diff classification and preserve all unrelated work.
