# einfach-hausen Presentation Brand

## Source of truth

The deck is a presentation translation of the product design contract, not a second marketing identity. Visual precedence is:

1. Notion **App Design** (`3c8b784c-dffc-80a1-a5d1-ed2269dbdd0d`) for visual character and the owner interaction states actually shown there.
2. `DESIGN.md` for semantic tokens, accessibility, responsive derivation, Pro extrapolation and states not shown in Notion.
3. The real repository logo implementation in `src/components/logo.tsx`, `src/app/design-system.css` and `public/brand/einfachhausen-mark.svg`.
4. `presentation/premium/einfach-hausen.brand.json` for slide-specific sizing and export/QA settings.

Screenshot copy is not a product requirement. The Notion reference does not prove exact desktop composition or a separate Pro visual theme.

## Brand translation

The presentation defaults to light, calm, spacious product surfaces:

- Deep green `#123C2A`
- Action/brand green `#176B45`
- Active green `#238454`
- Soft green `#EAF5EE`
- Trust tint `#F4FAF6`
- Canvas `#F7F8F7`
- Surface `#FFFFFF`
- Text `#171A18`
- Secondary text `#66706A`
- Border `#E4E8E5`
- Gold `#F4D27A` only as a sparse presentation accent

Dark green is reserved for isolated cover/section moments. It must not become a default app or deck surface and must not create a separate dark Pro identity.

## Original logo

The presentation reproduces the repository's real logo treatment: house mark from `public/brand/einfachhausen-mark.svg`, wordmark `einfachhausen`, and tagline `Dein Zuhause. Wir kümmern uns.` matching `src/components/logo.tsx` and `src/app/design-system.css`.

Do not redraw, recolor, stretch or replace the house artwork. On dark presentation surfaces, adjust the surrounding treatment rather than altering the original mark.

## Device framing

Phone chrome is subordinate to UI content. einfach-hausen uses a 3px frame in the current premium deck, a 60×14px notch and a restrained green-tinted shadow. The reusable premium template allows these values to be overridden but its QA surface supports a brand-specific maximum frame thickness.

## Readability

Whole screenshots are only useful when readable at presentation distance. Prefer one large crop or a small number of curated views. The presentation must expose semantic content/visual/footer zones and must keep source snapshot, live health, database readiness and capture date as separate evidence claims.
