# Premium-Deck einfachhausen.de

Product-specific presentation source for T-0165 remediation V2. Reusable rendering, strict QA and export logic is owned by `wow-my-zsh/connectors/slides-generator/`.

## Facts

- `deck.html`: 15 slides at 1280×720.
- `quality.json`: strict deck-specific rules including semantic collision and readability checks.
- `sourceCommit` `3a8aa93054df7ec897c1dc3fec200ecf8526965a` is the historical product/screenshot snapshot used by the deck. It is not automatically the presentation HEAD or deployed SHA.
- Live Health and DB readiness are separate runtime evidence. Deployment identity is only claimed when independently proven.

## Layout contract

Every presentation-facing slide uses intentional semantic regions. `data-zone="content"` and `data-zone="visual"` must never overlap accidentally. The footer is reserved and may not be used as spare layout space. Screenshots must remain readable at presentation scale; miniature walls are not acceptable evidence.

## Portable pipeline

Set the central connector root. Example on macOS:

