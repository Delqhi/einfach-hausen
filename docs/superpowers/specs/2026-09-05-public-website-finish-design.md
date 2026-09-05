# Public Website Finish — Premium IA, Megamenu & Service Depth

**Date:** 2026-09-05
**Repo:** `/Users/jeremyschulze/dev/einfachhausen-landing-page`
**Target:** public marketing website only; Owner/Pro app information architecture remains protected.

## 1. Goal

Finish the public Einfach Hausen website so it presents the already-built product as a complete, premium homeowner platform rather than a thin landing page collection.

The work must close three visible gaps:

1. the public navigation has no real information hierarchy or megamenu;
2. `/leistungen` promises twelve service areas while only `/leistungen/heizung` has a real detail page;
3. several core product capabilities exist in the product vision and app but are weakly represented or absent on the public website.

Success means a visitor can understand what Einfach Hausen does, browse by need, discover deeper service and product pages, and always find a clear next action without learning internal product terminology.

## 2. Non-negotiable constraints

- Preserve backend, auth, matching, billing, emergency, consultation and app business logic.
- Preserve Owner/Pro navigation meaning and route structure unless separately approved.
- Keep the existing top-level marketing navigation labels unless this spec explicitly deepens them.
- Do not turn the website into an SEO content farm or a generic card wall.
- Public claims must remain supportable by `PRODUCT_VISION.md`, existing routes and tested behavior.
- Reuse the canonical `--eh-*` visual token contract and current premium marketing shell.
- The existing design system is the visual source of truth. No rebrand, no wholesale visual redesign, no replacement design language, and no arbitrary component restyling are allowed.
- Visual work must be limited to demonstrable improvements inside the accepted system: composition, hierarchy, spacing, typography, imagery/product-state usage, responsive behavior, navigation clarity, interaction quality and accessibility.

## 3. Information architecture

The top-level public navigation remains conceptually stable:

- So funktioniert's
- Leistungen
- Hausakte
- Preise
- Hilfe

The depth changes underneath it.

### 3.1 Leistungen megamenu

`Leistungen` becomes the primary desktop megamenu and the main discovery surface for the public site. Prefer semantic `<details>/<summary>` disclosure so the shell can stay hydration-light and keyboard-accessible; add client state only if a verified interaction requirement cannot be met natively. It must expose:

- the twelve service areas from `CATEGORIES`;
- quick product entries for Beratung, Notfall and Ansprechpartner;
- a prominent route to the complete `/leistungen` overview;
- a restrained owner CTA such as “Anliegen beschreiben”.

The megamenu should be editorial and scan-friendly: grouped columns, short descriptions, icons used sparingly, no dense tile wall.

### 3.2 Hilfe discovery menu

`Hilfe` gains a smaller structured menu linking to FAQ/Hilfe, Sicherheit, Blog, Lexikon and Kontakt. It should reduce dead-end browsing without becoming a second megamenu of equal visual weight.

### 3.3 Mobile navigation

Mobile mirrors the same information hierarchy using native-accessible disclosure/accordion patterns. Links remain crawlable and usable without JavaScript-only hover behavior.

## 4. Service-page depth

`/leistungen` remains the canonical service index, but every visible service area must resolve to a substantial detail page.

Required routes:

- `/leistungen/haus-technik`
- `/leistungen/elektro-smart-home`
- `/leistungen/heizung` (existing, refined rather than replaced)
- `/leistungen/sanitaer-wasser`
- `/leistungen/dach-fenster-tueren`
- `/leistungen/innenausbau-sanierung`
- `/leistungen/garten-aussenbereich`
- `/leistungen/reinigung-pflege`
- `/leistungen/saisonale-dienste`
- `/leistungen/spezialfaelle`
- `/leistungen/umzug-entruempelung`
- `/leistungen/beratung-notfall`

Each page uses one shared service-page archetype plus structured content data. Required content fields include title, positioning text, common situations, process steps, realistic scope/limitations, related guides/lexicon when available, FAQs, CTA copy and SEO metadata.

The pages must not invent guaranteed availability, fixed pricing, certifications or response times. Regional availability and partner qualification remain conditional where that is the product truth.

## 5. Product explanation pages

Create dedicated public marketing explanations only for product capabilities already supported by the implementation:

- `/beratung` — Beratung / fachlicher Ansprechpartner without automatic order creation;
- `/notfall` — urgent-help flow, readiness logic and honest limitations;
- `/versicherung` — homeowner insurance organization and documentation flow;
- `/immobilienverkauf` — valuation/sale journey, broker matching and explicit data-release boundaries.

These pages explain and route into existing product flows; they do not duplicate private app state or business logic. Existing non-marketing routes such as `/ansprechpartner` and `/app/home/sale` must not be repurposed as public landing pages. Where relevant, the new public pages link into the canonical authenticated flow after sign-in/registration.

## 6. Page-specific premium finish

This is an optimization pass inside the existing design system, not a new visual redesign. A before/after comparison must still unmistakably look like the same Einfach Hausen design language, only more resolved. Each major page may improve composition while preserving the accepted typography, color logic, component character, spacing language and token rules.

- `/`: stronger route discovery after the hero, clearer bridge from homeowner problem to product depth, and better navigation into services and the Hausakte.
- `/leistungen`: editorial category index with every category clickable; remove the feeling of twelve inert cards.
- `/so-funktionierts`: narrative service journey with concrete product states and human handoff moments.
- `/hausakte`: strongest product/lifestyle composition; make long-term house memory tangible.
- `/preise`: calm comparison clarity; preserve truthful product economics and avoid promotional clutter.
- `/partner`: expand business proof, partner workflow, quality model, team model and 0% commission explanation.
- `/sicherheit`: structured trust chapter covering data boundaries, partner checks and user control.
- `/eigenheimbesitzer`: sharpen homeowner value proposition and lifecycle, not a duplicate home page.
- `/pilotphase`: clarify availability, scarcity and expectations without fake urgency.
- `/ueber-uns`: human mission and product philosophy instead of generic corporate filler.
- `/hilfe`: useful support/discovery hub with strong paths into FAQ, guides, lexicon and contact.

Auth/register routes remain intentionally focused and are not expanded with marketing-heavy navigation.

## 7. Visual language

The finish pass must follow the accepted premium redesign doctrine:

- macro-composition and art direction before decorative polish;
- warm off-white canvas, petrol/teal hierarchy, charcoal text and restrained hairlines;
- generous whitespace and editorial type hierarchy;
- fewer but larger meaningful visual moments;
- no glassmorphism default, text gradients, random accent stripes or dashboard-like card carpets;
- motion only when it improves hierarchy or orientation;
- product UI mockups and real product states preferred over generic decorative illustrations.

## 8. Technical architecture

Introduce a single typed public content model for service categories and their detail-page content. The model should drive:

- the `/leistungen` index;
- the Leistungen megamenu;
- service detail pages;
- related-links blocks;
- metadata and structured-data inputs where appropriate.

Do not duplicate the same labels/descriptions separately in shell, index and detail pages.

Use reusable marketing primitives for page archetypes, but allow page-specific composition so the site does not become templated and repetitive.

The megamenu belongs in the marketing shell and must remain isolated from authenticated app shells. CSS stays in scoped modules or the accepted marketing token layer.

## 9. Accessibility and interaction

- Desktop megamenu must work with keyboard focus, pointer and touch-capable desktop devices.
- Opening one disclosure must not trap focus or make the rest of the page inaccessible.
- Escape closes transient menu state when JavaScript state is used.
- Focus indicators remain visible against every menu surface.
- Mobile navigation uses semantic disclosure controls and remains usable at 390px.
- No hover-only links.
- New pages retain skip-link and heading hierarchy contracts.

## 10. SEO and discoverability

Every new public page must provide unique metadata, canonical URL and breadcrumb structured data. Service detail pages also expose truthful Service structured data using the existing SEO utilities or a consolidated equivalent.

The sitemap must discover the new canonical routes. Internal links from `/leistungen`, megamenu and relevant content pages must ensure no orphan pages.

## 11. Verification and acceptance

Implementation is complete only when all of the following are freshly green on Mac-i9:

1. `npm run lint` with zero errors;
2. production `npm run build` with required Supabase build environment;
3. `npm run test:e2e` exit 0;
4. `npm run test:visual` with the complete canonical matrix green after intentional baseline review;
5. focused navigation tests covering desktop megamenu, keyboard/focus behavior and mobile disclosure behavior;
6. route/SEO smoke checks for every new public page;
7. `git diff --check`;
8. GitNexus change detection and impact review for shared shell/content primitives.

Visual baselines must never be bulk-refreshed to hide regressions. Only confirmed intended changes may update affected canonicals.

A design-review acceptance check must also confirm that the work is recognizably the same established Einfach Hausen design system. Any change that reads as a rebrand, replacement visual language or wholesale redesign is a regression even if automated tests pass.

## 12. Rollout order

Implementation should be split into reviewable waves:

1. content model + navigation architecture + megamenu;
2. service detail-page system + all missing service routes;
3. product explanation pages and integration into discovery paths;
4. page-specific premium polish of existing core marketing routes;
5. accessibility, SEO, visual-regression expansion and final convergence.

Each wave must preserve a working production build and avoid deleting unrelated dirty work.

## 13. Out of scope

- redesigning authenticated Owner/Pro information architecture;
- changing pricing/business rules merely for marketing convenience;
- inventing provider availability or service guarantees;
- replacing the existing backend or auth stack;
- mass-producing low-value SEO pages that do not map to a real user need or product capability.
