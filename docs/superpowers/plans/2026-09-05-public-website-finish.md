# Public Website Finish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the public Einfach Hausen website with a premium megamenu, complete service depth, truthful product explanation pages and targeted visual refinement without changing the accepted design language.

**Architecture:** Keep `MarketingShell` and the canonical `--eh-*` tokens as the visual foundation. Add one typed service catalog that drives the service index, megamenu, dynamic detail routes and sitemap; add focused public product-story routes; refine existing pages by composing existing marketing primitives rather than introducing a replacement design system.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, lucide-react, Playwright-based repo regression scripts, existing SEO helpers and visual-regression harness.

**Spec:** `docs/superpowers/specs/2026-09-05-public-website-finish-design.md`

## Global Constraints

- Existing Einfach Hausen design system is the visual source of truth; no rebrand or replacement visual language.
- Preserve backend, auth, matching, billing, consultation, emergency and authenticated app information architecture.
- Keep top-level public navigation labels stable; deepen them with structured discovery only.
- All new public claims must be supported by `PRODUCT_VISION.md` and current tested behavior.
- CSS changes stay scoped to modules or the existing marketing token layer.
- Every implementation task follows RED → GREEN → refactor and ends in a focused commit.

---### Task 1: Typed Service Catalog + Public Navigation Depth

**Files:**
- Create: `src/components/marketing/service-catalog.tsx`
- Modify: `src/components/marketing/content.tsx`
- Modify: `src/components/marketing/site-shell.tsx`
- Modify: `src/components/marketing/mkt.module.css`
- Create: `scripts/public-website-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `SERVICE_CATEGORIES`, `ServiceCategory`, `getServiceCategory(slug)`, `SERVICE_PATHS`.
- Consumed by: `/leistungen`, the megamenu, service detail routes and sitemap.

- [ ] **Step 1: Write failing public-site contract tests**

```js
assert.equal(serviceSlugs.length, 12);
assert.match(shellSource, /megaMenu/);
assert.match(shellSource, /Beratung/);
assert.match(shellSource, /Notfall/);
assert.match(shellSource, /Alle Leistungen/);
```

- [ ] **Step 2: Run RED**

Run: `npm run test:public-site`
Expected: FAIL because the catalog and megamenu do not exist yet.

- [ ] **Step 3: Implement catalog and semantic megamenu**

Use a typed catalog with `slug`, `title`, `shortTitle`, `description`, `icon`, `situations`, `steps`, `limits`, `faq`, `related`, `seo` and `cta`. `MarketingShell` uses semantic `<details>/<summary>` discovery for Leistungen and Hilfe, preserving the existing top-level labels and CTAs.

- [ ] **Step 4: Run GREEN and lint**

Run: `npm run test:public-site && npm run lint`
Expected: contract PASS; lint 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/service-catalog.tsx src/components/marketing/content.tsx src/components/marketing/site-shell.tsx src/components/marketing/mkt.module.css scripts/public-website-contract.mjs package.json
git commit -m "feat(website): add service catalog and megamenu"
```
### Task 2: Complete Service Detail Routes + SEO

**Files:**
- Create: `src/components/marketing/service-detail-page.tsx`
- Create: `src/app/leistungen/[slug]/page.tsx`
- Modify: `src/app/leistungen/heizung/page.tsx`
- Modify: `src/app/leistungen/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/public-website-contract.mjs`

**Interfaces:**
- Consumes: `SERVICE_CATEGORIES`, `getServiceCategory`, `SERVICE_PATHS` from Task 1.
- Produces: all twelve canonical service routes and shared service-detail rendering.

- [ ] **Step 1: Extend the contract with route and sitemap assertions**

```js
for (const path of expectedServicePaths) {
  assert.ok(catalogSource.includes(path.split('/').pop()));
}
assert.match(sitemapSource, /SERVICE_PATHS/);
assert.match(dynamicPageSource, /generateStaticParams/);
```

- [ ] **Step 2: Run RED**

Run: `npm run test:public-site`
Expected: FAIL because the dynamic service page and sitemap integration are missing.

- [ ] **Step 3: Implement shared service archetype and dynamic routes**

`ServiceDetailPage` renders existing `PageHero`, `Section`, `Steps`, `InfoPanel`, `Faq`, `TextLink` and `CtaBand` primitives. The dynamic route uses `generateStaticParams`, `generateMetadata`, `notFound`, breadcrumb JSON-LD and truthful Service JSON-LD. `/leistungen/heizung` delegates to the same archetype so it remains canonical but visually consistent.

- [ ] **Step 4: Make `/leistungen` cards real links**

Replace inert category cards with accessible linked category articles using the existing card visual language; preserve the current hierarchy and spacing tokens.

- [ ] **Step 5: Run GREEN, lint and build smoke**

Run: `npm run test:public-site && npm run lint`
Expected: PASS with 12 service routes represented and no lint errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/service-detail-page.tsx src/app/leistungen src/app/sitemap.ts scripts/public-website-contract.mjs
git commit -m "feat(website): add complete service detail routes"
```
### Task 3: Public Product Story Pages

**Files:**
- Create: `src/app/beratung/page.tsx`
- Create: `src/app/notfall/page.tsx`
- Create: `src/app/versicherung/page.tsx`
- Create: `src/app/immobilienverkauf/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/marketing/site-shell.tsx`
- Modify: `scripts/public-website-contract.mjs`

**Interfaces:**
- Consumes: existing marketing primitives and canonical product flows `/app/consultation`, `/app/emergency`, `/app/insurance`, `/app/home/sale`.
- Produces: four public explanatory routes that hand off to registration/login without duplicating private state.

- [ ] **Step 1: Add failing product-route assertions**

```js
for (const route of ['/beratung','/notfall','/versicherung','/immobilienverkauf']) {
  assert.ok(sitemapSource.includes(route));
}
assert.match(beratungSource, /kein Auftrag/i);
assert.match(notfallSource, /24\/7|Bereitschaft/);
```

- [ ] **Step 2: Run RED**

Run: `npm run test:public-site`
Expected: FAIL because the public product pages do not exist.

- [ ] **Step 3: Implement four truthful story pages**

Each page uses the accepted visual primitives, unique metadata/canonical/breadcrumb data, one strong hero, one narrative proof section, one limitations/trust section and one CTA into the canonical authenticated flow. Do not promise automatic insurance coverage, emergency availability, valuation accuracy or broker acceptance.

- [ ] **Step 4: Integrate discovery links**

Add Beratung and Notfall to the Leistungen megamenu and Versicherung/Immobilienverkauf to appropriate help/owner discovery paths without changing the five top-level navigation labels.

- [ ] **Step 5: Run GREEN and lint**

Run: `npm run test:public-site && npm run lint`
Expected: PASS with four product routes and zero lint errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/beratung src/app/notfall src/app/versicherung src/app/immobilienverkauf src/app/sitemap.ts src/components/marketing/site-shell.tsx scripts/public-website-contract.mjs
git commit -m "feat(website): add public product story pages"
```
### Task 4: Premium Finish of Existing Core Marketing Pages

**Files:**
- Modify: `src/components/marketing/home-sections.tsx`
- Modify: `src/app/so-funktionierts/page.tsx`
- Modify: `src/app/hausakte/page.tsx`
- Modify: `src/app/partner/page.tsx`
- Modify: `src/app/hilfe/page.tsx`
- Modify: `src/app/eigenheimbesitzer/page.tsx`
- Modify: `src/app/pilotphase/page.tsx`
- Modify: `src/app/ueber-uns/page.tsx`
- Modify only when needed: existing marketing CSS modules
- Modify: `scripts/public-website-contract.mjs`

**Interfaces:**
- Consumes: existing design primitives, service catalog and product routes.
- Produces: clearer route discovery and stronger macro-composition while preserving accepted visual identity.

- [ ] **Step 1: Add failing discovery/content assertions**

Require the home page to expose links into service depth and Hausakte; require Hilfe to expose FAQ, Sicherheit, Blog, Lexikon and Kontakt; require Partner to retain 0% commission and explain quality/team workflow.

- [ ] **Step 2: Run RED**

Run: `npm run test:public-site`
Expected: FAIL on at least the new discovery assertions.

- [ ] **Step 3: Refine pages without redesigning the system**

Use the existing `Section`, `Split`, `FeatureGrid`, `Statement`, `AppFrame`, editorial photo and CTA primitives. Prefer fewer, more meaningful sections over extra card grids. Keep the existing warm canvas, petrol/teal palette, border language, typography and CTA styles unchanged.

- [ ] **Step 4: Run GREEN + lint**

Run: `npm run test:public-site && npm run lint`
Expected: contract PASS and zero lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/home-sections.tsx src/app/so-funktionierts src/app/hausakte src/app/partner src/app/hilfe src/app/eigenheimbesitzer src/app/pilotphase src/app/ueber-uns scripts/public-website-contract.mjs
git commit -m "feat(website): refine premium marketing journeys"
```
### Task 5: Navigation E2E, Visual Expansion & Final Convergence

**Files:**
- Create: `scripts/public-navigation-e2e.mjs`
- Modify: `scripts/lib/visual-canonicals.mjs`
- Modify: `package.json`
- Modify only after review: affected files in `tests/visual-baselines/`
- Modify: `docs/NEXT_AGENT.md`, `docs/PRODUCTION_HANDOVER.md`, `docs/ARCHITECTURE.md`, `README.md`, `AGENTS.md`

**Interfaces:**
- Consumes: all website routes and shared shell behavior from Tasks 1–4.
- Produces: final browser evidence, canonical visual coverage and handover documentation.

- [ ] **Step 1: Write failing browser navigation test**

The test boots the production server and verifies desktop Leistungen disclosure, keyboard focus into a service link, mobile disclosure access, navigation to one dynamic service page and one product-story page, and absence of horizontal overflow at 390px.

- [ ] **Step 2: Run RED before adding any missing interaction fixes**

Run: `npm run test:public-nav`
Expected: FAIL until package script/browser contract and any missing interaction details exist.

- [ ] **Step 3: Make navigation GREEN and expand visual canonicals**

Add representative canonicals for at least one new service route and one product-story route in all three viewports. Never bulk-refresh baselines; review only failing intended pages and copy/update those exact baselines.

- [ ] **Step 4: Run full acceptance**

Run, in order: `npm run test:public-site`, `npm run lint`, secure production `npm run build`, `npm run test:public-nav`, `npm run test:e2e`, `npm run test:visual`, `git diff --check`, and GitNexus detect-changes/impact review.
Expected: all exit 0; visual matrix fully green; design remains recognizably the same Einfach Hausen system.

- [ ] **Step 5: Update handover docs and commit**

Document new public routes, shared catalog, megamenu behavior, verification evidence and rollback/branch information without overwriting unrelated work.

```bash
git add scripts/public-navigation-e2e.mjs scripts/lib/visual-canonicals.mjs package.json tests/visual-baselines docs README.md AGENTS.md
git commit -m "test(website): converge public website acceptance"
```

## Plan Self-Review

- Spec coverage: IA, megamenu, 12 services, four product pages, core-page polish, accessibility, SEO, sitemap, visual expansion and final gates all map to Tasks 1–5.
- Placeholder scan: no TBD/TODO/“implement later” steps.
- Type consistency: Tasks 2–4 consume only the `SERVICE_CATEGORIES`, `getServiceCategory` and `SERVICE_PATHS` exports defined in Task 1.
- Design protection: every task explicitly preserves the existing token/component language; visual regression includes an identity-preservation review.
