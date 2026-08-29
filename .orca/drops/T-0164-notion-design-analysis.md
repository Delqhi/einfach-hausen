# T-0164 — Notion Design Analysis (einfach-hausen)

## Scope and evidence standard

Reference opened exactly: `https://app.notion.com/p/App-Design-3c8b784cdffc80a1a5d1ed2269dbdd0d` (Notion page title: **App Design**).

This report treats the screenshots as the binding visual direction and deliberately ignores their copy as product requirements. It does **not** evaluate any live deployment and does **not** prescribe product-code changes beyond an implementation plan.

Evidence labels used below:

- **CONFIRMED — Notion page/image:** directly present in the reference page or visibly established from the reference screenshots.
- **PRIOR-OBSERVED — repo/design:** observed in an earlier inspection of the same product/design material in this conversation, but the current execution environment does not expose the requested OCI checkout for re-verification.
- **PROPOSED:** implementation recommendation, not claimed as a screenshot fact.

### Important execution limitation

The current session does not expose the requested machine/filesystem connector for `/home/ubuntu/dev/einfach-hausen`. The path visible in this model container is not the actual project checkout, so an exact current-tree audit of `DESIGN.md`, `src/app/app`, and `src/app/pro` cannot be honestly re-run here, and this report cannot be placed into the requested repository path from this session. A fallback copy is therefore produced outside the repo. No product source files were changed.

---

## 1. Confirmed visual facts vs assumptions

### 1.1 Confirmed facts from the Notion reference

**Reference coverage**

The `Eigenheimbesitzer` section contains four equal Notion columns (25% each), each with a mobile-oriented image reference:

1. `Anmeldung` — `Anmeldung_login.png`
2. `Homescreen` — `08d1c842-8e2d-43a1-af5a-e10c8a77295b.png`
3. `Menüleiste` — `Menupunkte_01.png`
4. `Geöffnete Menüleiste` — `menupunkte_offen.png`

The `Dienstleister` section currently contains only the text `Anmeldung` and **no image block**. Therefore there is no authoritative Dienstleister/Handwerker screenshot in the supplied reference at this time.

**Visual direction established from the supplied owner screenshots**

- Light, warm overall surface rather than a dark product shell.
- Green is the dominant brand/action accent.
- Strong whitespace and breathing room; the interface does not feel data-dense.
- Rounded, card-driven grouping rather than hard table/chrome-heavy grouping.
- Clear hierarchy with one primary action or focal block at a time.
- Navigation has at least two explicitly designed states: compact/closed and opened.
- Mobile portrait is the only confirmed viewport family in this reference.
- The designs emphasize approachable consumer UI, not a technical/admin-dashboard aesthetic.

### 1.2 Prior-observed repo/design comparison

The earlier inspection of the same product material established the following direction:

- `DESIGN.md` contains an older, darker/more technical visual direction that conflicts with the light, warm Notion screenshots.
- The existing portal UI in the app routes was already closer to the Notion direction than that older dark design description, but not consistently enough to treat it as a finished system.
- The correct precedence should therefore be: **Notion screenshots → shared portal design system → implementation**, while `DESIGN.md` should be aligned afterward so it no longer contradicts the screenshot source of truth.

Because the current OCI checkout cannot be re-opened, no claim is made here about exact present-day class names, component names, CSS values, or line-level differences.

### 1.3 Assumptions that must NOT be confused with screenshot facts

- Exact typeface is not confirmed.
- Exact hex colors are not confirmed.
- Exact spacing, radius, shadow and breakpoint values are not pixel-measured facts.
- Desktop navigation behavior is not shown.
- Tablet layout is not shown.
- Handwerker-specific information architecture is not shown in images.
- Empty, loading, error, success and destructive states are not shown comprehensively.
- Modal/sheet behavior is not confirmed beyond the existence of open/closed navigation states.

---

## 2. Proposed design tokens and component system

The following values are **implementation seeds**. They should be calibrated visually against the screenshots during implementation rather than treated as extracted pixel measurements.

### 2.1 Color tokens

```css
--eh-bg-app: #F7F8F5;          /* warm off-white */
--eh-surface: #FFFFFF;
--eh-surface-soft: #EEF4EC;
--eh-text: #1E2A21;
--eh-text-muted: #69736B;
--eh-border: #DCE5DA;
--eh-brand: #2F7D32;
--eh-brand-hover: #27692A;
--eh-brand-soft: #E5F1E3;
--eh-focus: #1457D9;
--eh-success: #2F7D32;
--eh-warning: #9A6700;
--eh-danger: #B42318;
```

Rule: semantic status colors must never replace text/icon status labels.

### 2.2 Typography tokens

Use the existing product sans-serif if it is already deliberate and suitable; otherwise choose one neutral humanist/system sans and use it across Owner and Pro.

```text
caption:       12 / 16, 500
label:         14 / 20, 500–600
body:          16 / 24, 400
body-strong:   16 / 24, 600
section-title: 20 / 28, 600–700
page-title:    28 / 34, 700
hero-title:    32–36 / 40–44, 700
```

Avoid oversized marketing typography inside the app shell. The screenshots read as calm product UI, not landing-page typography.

### 2.3 Spacing and geometry

Proposed spacing scale:

```text
4, 8, 12, 16, 20, 24, 32, 40, 48 px
```

Proposed geometry:

```text
control radius: 10–12 px
card radius:    16–20 px
large sheet:    22–24 px
mobile gutter:  16–20 px
card gap:       12–16 px
section gap:    24–32 px
```

Shadows should be shallow and low-contrast. Prefer surface/border separation over deep elevation.

### 2.4 Shared component inventory

Owner and Pro should use one visual primitive layer:

- `AppShell`
- `TopBar`
- `BrandMark`
- `PortalNav`
- `MenuTrigger`
- `MenuDrawer` / `MenuSheet`
- `SectionHeader`
- `Card`
- `ListRow`
- `PrimaryButton`
- `SecondaryButton`
- `TertiaryButton`
- `IconButton`
- `TextField`
- `TextArea`
- `Select`
- `Checkbox` / `Radio`
- `StatusChip`
- `Alert`
- `EmptyState`
- `LoadingSkeleton`
- `InlineError`
- `CTAGroup`
- `Modal` / `Sheet`
- `Avatar/ProfileSummary`
- domain cards such as `PropertyCard`, `RequestCard`, `OfferCard`, `JobCard` built on the shared `Card`

Every interactive primitive requires normal, hover, focus-visible, pressed, disabled, loading, validation-error and success states where applicable.

---

## 3. Screen and flow plan

### 3.1 Eigentümer / `src/app/app`

The owner experience is the only side with direct screenshot authority. Implement it first and use it to stabilize the shared visual grammar.

#### A. Anmeldung

Target character:

- simple, centered or clearly focused authentication composition;
- calm light background;
- strong brand anchor;
- minimal competing UI;
- one dominant submit CTA;
- secondary recovery/registration actions visually subordinate.

Acceptance intent: the screen should be immediately recognizable as the same design family as `Anmeldung_login.png`, without copying its placeholder text verbatim.

#### B. Homescreen

Target hierarchy:

1. contextual greeting / page identity;
2. primary homeowner task or status;
3. a small number of large cards;
4. secondary information below the fold;
5. navigation kept visually quieter than the content.

Do not turn this into a dense KPI dashboard.

#### C. Navigation — closed

Match the compactness and hierarchy of `Menupunkte_01.png`:

- clear current location;
- iconography secondary to labels;
- sufficient touch targets;
- no visually heavy admin sidebar on narrow screens.

#### D. Navigation — open

Match the explicit alternate state from `menupunkte_offen.png`:

- unmistakable open state;
- clear grouping and selected item;
- predictable close affordance;
- body content visually subordinated while navigation is active;
- keyboard/focus behavior defined, not merely animated.

#### E. Remaining owner flows

Once the shell is stable, map current owner capabilities into the same visual language:

- property/home overview and detail;
- create/request-help flow;
- request/job status;
- offers and decisions;
- messages/contact;
- documents or ancillary owner services where they already exist;
- profile/settings.

Do not infer new product features from screenshot copy.

### 3.2 Handwerker / `src/app/pro`

There is **no direct Handwerker screenshot authority** in the supplied Notion page. Therefore Pro must not invent a second brand/theme. It should inherit the owner visual foundation and differ only where task structure requires it.

#### A. Pro Anmeldung

Derive the shell, form styling, spacing, logo treatment and CTA hierarchy from the owner login. Different copy/fields are allowed; a different visual language is not.

#### B. Pro Home / work queue

Use the same cards, color tokens and typography, but prioritize operational information:

1. actionable new opportunities/jobs;
2. accepted/active work;
3. messages or required responses;
4. profile/completeness/service-area issues;
5. secondary account information.

Keep the density moderate. A professional workflow can carry more metadata than Owner, but should still feel like the same product.

#### C. Request/job detail

- prominent service/request summary;
- location/time/status facts grouped clearly;
- one primary next action;
- secondary actions separated;
- status history/progress below primary context.

#### D. Offer / response flow

- progressive disclosure rather than one long dense form;
- persistent understanding of what job the response belongs to;
- confirmation state after submission;
- validation errors adjacent to fields and summarized when needed.

#### E. Active jobs / progress

- reusable `JobCard` and `StatusChip`;
- current state readable without color;
- next action explicit;
- timeline only if it improves comprehension and already maps to product data.

#### F. Pro profile/settings

- company identity;
- services/trades;
- service radius/area;
- availability/contact configuration where supported;
- account/billing areas only where they already exist in the product.

---

## 4. Responsive and accessibility requirements

### 4.1 Responsive behavior

The reference is mobile-first. Do not scale it mechanically to desktop.

**320–479 px**

- 16–20 px gutters;
- one-column cards;
- no horizontal scrolling;
- minimum 44 × 44 px interactive targets;
- full-width or near-full-width primary actions where appropriate;
- navigation uses compact trigger + drawer/sheet behavior;
- support safe-area insets.

**480–767 px**

- same hierarchy, slightly more breathing room;
- avoid premature multi-column compression.

**768–1023 px**

- allow 2-column cards only when source reading order remains logical;
- content max-width around 900–1000 px;
- navigation may become more persistent only if the open/closed model remains understandable.

**1024+ px**

- max content width roughly 1120–1200 px;
- 12-column layout grid is acceptable internally;
- a persistent side rail may replace a drawer, but it must preserve the same labels, grouping, selected-state treatment and visual restraint;
- do not create a separate “desktop admin” aesthetic.

### 4.2 Accessibility

Target WCAG 2.2 AA.

- Normal text contrast >= 4.5:1.
- Large text / meaningful graphical objects >= 3:1 where applicable.
- Visible `:focus-visible` treatment on every interactive element.
- Keyboard path covers every action.
- Drawer/sheet: focus enters it, stays contained while modal, Escape closes it, focus returns to trigger.
- Semantic heading order without skipping levels for visual convenience.
- Inputs have persistent labels, not placeholder-only labels.
- Error text is associated programmatically with the field.
- Error summary for multi-field forms where helpful.
- Status meaning is never conveyed by color alone.
- Icon-only buttons have accessible names and sufficiently large hit areas.
- Respect `prefers-reduced-motion`.
- No loss of information or functionality at 200% browser zoom.
- No horizontal scrolling at 320 CSS px for normal page content.
- Touch target baseline: 44 × 44 px.

---

## 5. Dependency-ordered implementation task plan with acceptance tests

### T1 — Lock the evidence baseline

**Depends on:** none

- Store/reference the four authoritative owner images in the implementation ticket or design QA artifact.
- Mark Handwerker and desktop states as unconfirmed.
- Document that screenshot copy is non-binding.

**Acceptance**

- Every later visual decision can be tagged either screenshot-derived or implementation-derived.
- No Pro-specific styling is justified by nonexistent mockups.

### T2 — Resolve design-source precedence

**Depends on:** T1

- Declare Notion screenshots the visual source of truth for portal UI.
- Reconcile conflicting legacy dark direction in `DESIGN.md`.
- Keep non-visual product/business rules from existing docs unless separately changed.

**Acceptance**

- `DESIGN.md` no longer instructs portal developers toward a visual system that conflicts with the screenshots.
- Owner and Pro reference one shared token system.

### T3 — Establish shared tokens

**Depends on:** T2

- Introduce semantic color, typography, spacing, radius, border, focus and motion tokens.
- Remove route-specific visual constants where equivalent semantic tokens exist.

**Acceptance**

- Owner and Pro can be restyled without duplicating theme values.
- No dark app-shell background remains merely because of legacy theme inheritance.
- Focus colors satisfy contrast.

### T4 — Build shared primitives

**Depends on:** T3

- Buttons, fields, cards, chips, alerts, empty/loading/error states.

**Acceptance**

- All documented states render consistently.
- Buttons/inputs meet 44 px target height or hit area.
- Keyboard focus is always visible.

### T5 — Implement responsive AppShell + navigation states

**Depends on:** T3, T4

- Owner mobile shell first.
- Closed and open nav modeled after the two Notion menu screenshots.
- Define tablet/desktop adaptations without creating a new visual language.

**Acceptance**

- Visual QA at 390 × 844 closely matches the screenshot family in spacing, weight and hierarchy.
- Open menu is keyboard-operable, Escape-closeable and focus-managed.
- 320 px viewport has no horizontal scroll.
- Desktop remains recognizably the same app.

### T6 — Owner Anmeldung

**Depends on:** T4, T5

- Restyle only the visual composition; preserve correct authentication behavior.

**Acceptance**

- Dominant CTA, field hierarchy and light/green visual direction match the reference family.
- Error/loading/disabled states work without layout jump.
- Labels and validation are accessible.

### T7 — Owner Homescreen

**Depends on:** T4, T5

- Recompose existing home content into restrained card hierarchy.

**Acceptance**

- No dense dashboard/table look.
- Primary task/status is identifiable within ~2 seconds.
- Cards use shared primitives/tokens only.
- Mobile screenshot review passes against the reference character.

### T8 — Remaining Owner screens

**Depends on:** T6, T7

- Apply the same shell/primitives to property, request/job, offers, messaging and settings routes that already exist.

**Acceptance**

- No route introduces a second spacing/radius/button system.
- Empty/loading/error/success states exist for each data-driven screen.
- Navigation labels and route state remain consistent.

### T9 — Pro Anmeldung + shell reuse

**Depends on:** T5, T6

- Reuse Owner visual grammar for Pro entry and navigation.

**Acceptance**

- Side-by-side Owner/Pro screenshots clearly read as one brand/system.
- Differences are information architecture, not color/theme divergence.

### T10 — Pro work screens

**Depends on:** T4, T5, T9

- Work queue/opportunities, request detail, offer/response, active jobs, messages, profile/settings.

**Acceptance**

- One primary next action per work context.
- Status is textual/icon-supported, not color-only.
- Metadata density remains scan-friendly at 390 px.
- Shared card/button/input primitives are reused.

### T11 — Responsive expansion

**Depends on:** T8, T10

Validate at minimum:

- 320 × 568
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1440 × 900

**Acceptance**

- No clipped controls or accidental overflow.
- Content reading order remains correct when grids reflow.
- Desktop does not become visually denser merely because space exists.

### T12 — Accessibility hardening

**Depends on:** T8, T10, T11

**Acceptance**

- Automated axe/Playwright accessibility smoke checks: no serious/critical violations on core screens.
- Full keyboard journeys for login, nav open/close, primary Owner action and primary Pro job action.
- 200% zoom passes without lost functionality.
- Reduced-motion preference respected.

### T13 — Visual regression and design acceptance

**Depends on:** T6–T12

- Add visual baselines for representative Owner/Pro screens at mobile/tablet/desktop.
- Human design review compares Owner login/home/nav directly with the four Notion references.

**Acceptance**

- Owner reference states approved by visual review.
- Any intentional deviation is documented with reason.
- Pro screens are approved as a faithful extrapolation, not falsely represented as Notion-matched.

---

## 6. Risks if implementation diverges

### R1 — Legacy dark-theme precedence

**Risk:** treating old `DESIGN.md` dark/technical styling as visually canonical.

**Impact:** the product looks like two brands and directly contradicts the supplied design direction.

**Mitigation:** screenshot precedence is explicit; documentation follows the validated implementation.

### R2 — Inventing a separate Pro identity

**Risk:** no Pro screenshots exist, so designers/developers fill the gap with a separate theme.

**Impact:** brand fragmentation and duplicated component work.

**Mitigation:** same tokens/shell/primitives; vary only workflow hierarchy and data density.

### R3 — Overfitting mobile screenshots

**Risk:** copying absolute positions or fixed heights from portrait mockups.

**Impact:** broken content with real data, localization, zoom and desktop widths.

**Mitigation:** preserve visual relationships using flexible layout constraints and content-driven height.

### R4 — Treating mockup copy as requirements

**Risk:** implementing features or navigation labels because text appeared in the design image.

**Impact:** accidental product-scope changes.

**Mitigation:** screenshot copy remains non-binding; use current product routes/data as content truth.

### R5 — Token drift between `/app` and `/pro`

**Risk:** route-local CSS values grow independently.

**Impact:** subtle mismatches in green, radius, spacing, focus and controls.

**Mitigation:** one semantic token layer and one primitive component layer.

### R6 — Desktop becomes an admin dashboard

**Risk:** extra width encourages dense tables, permanent chrome and technical styling.

**Impact:** visual character no longer matches the approachable mobile reference.

**Mitigation:** increase layout efficiency without changing tone, surfaces or hierarchy.

### R7 — Navigation visuals implemented without navigation semantics

**Risk:** menu screenshots are copied cosmetically but drawer focus, Escape and current-route state are omitted.

**Impact:** accessibility and usability defects.

**Mitigation:** make interaction-state acceptance criteria part of the component contract.

### R8 — Approximate color sampling treated as exact

**Risk:** exported screenshots, display profiles and compression can alter perceived values.

**Impact:** false precision and unnecessary pixel chasing.

**Mitigation:** use semantic seed tokens, then visually calibrate in a controlled screenshot comparison.

---

## Recommended implementation sequence in one sentence

**Owner screenshot evidence → source-of-truth reconciliation → shared tokens → shared primitives → mobile shell/navigation → Owner login/home → remaining Owner flows → Pro reuse/extrapolation → responsive adaptation → accessibility → visual-regression approval.**

## Final design verdict

The Notion reference should pull the portal decisively toward a **light, warm, green-accented, spacious, card-led consumer product UI**. The strongest implementation mistake would be to preserve or reintroduce a dark technical portal aesthetic, or to invent a separate Handwerker visual system despite the absence of Handwerker screenshot evidence. The correct product-design strategy is one shared visual system, proven first against the four Owner reference states and then carefully extrapolated to Pro workflows.
