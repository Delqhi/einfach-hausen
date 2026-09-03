---
name: presentation-quality
description: Use when creating, editing, rendering, reviewing, or handing off presentation decks, slide images, PDF decks, or PPTX artifacts in this repository.
---

# Presentation Quality

## Overview

Treat a deck like a shippable UI artifact: source truth, deterministic render, automated geometry checks, and visual inspection must agree before handoff.

## Required workflow

1. Read the deck source and its render/build instructions before editing.
2. Preserve source-of-truth facts. Never claim deployment identity, health, database readiness, capture date, ratings, or customer facts without current evidence.
3. Keep screenshots inside intentional browser/device frames unless a slide is explicitly a full-bleed image.
4. Run the repository gate before and after edits:
   `npm run test:presentation`
5. Re-render every affected slide from source. Do not approve stale PNG/PDF/PPTX outputs.
6. Build a contact sheet and visually inspect every slide at presentation scale.
7. Regenerate PDF and PPTX from the accepted PNGs, then verify slide/page count and dimensions.

## Visual acceptance bar

- 1280×720 source slides with no content outside the canvas.
- Keep phones clear of the bottom 50 px footer-safe area; normal phone ratio is 1.70–2.35 height/width.
- Avoid dense screenshot mosaics: maximum four primary content images per slide unless the slide is explicitly an index/contact sheet.
- Headline hierarchy must be obvious at a glance; supporting copy should remain concise and readable.
- Browser bars, phone notches, radii, shadows, spacing, brand colors, and footers must be consistent across the deck.
- Never label cropped or compressed screenshots as “Vollseite” or “vollständig”.
- Prefer confident product language over defensive copy such as “nicht Mockup”.
- The final slide should land the product message, not repeat technical evidence already shown elsewhere.

## Evidence rules

- A repository commit shown in the deck must equal the current intended repository revision at render time.
- Health/database claims require a fresh live check; if deployment-to-commit equality is not independently proven, say only what is proven.
- Capture dates describe screenshot capture, not deployment freshness.

## Handoff

Record the source file, generated PNG/PDF/PPTX paths, QA command result, visual-review result, evidence limitations, and current HEAD in the task evidence. A deck is not done merely because the build command succeeded.
