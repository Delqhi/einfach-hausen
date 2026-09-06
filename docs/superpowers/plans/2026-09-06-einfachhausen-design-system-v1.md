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
