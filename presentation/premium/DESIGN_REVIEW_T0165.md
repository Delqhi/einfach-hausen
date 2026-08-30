# T-0165 · Premium presentation remediation V2

This document supersedes the earlier acceptance. User-provided photos proved that the earlier review was too permissive: slides 6 and 8 contained real semantic text/phone collisions even though canvas-overflow QA passed. The remediation therefore changes both the deck layout model and the reusable QA gate.

## Root causes

1. Major slide regions were positioned independently with inline absolute coordinates and no semantic collision contract.
2. QA checked canvas overflow, phone ratio and footer safe area but not content↔visual overlap or presentation-distance readability.
3. Too many slides used complete screens shrunk into small boxes instead of large relevant crops.
4. Footer branding and bottom tags consumed too much attention and space.
5. Runtime health evidence and product snapshot evidence were visually close enough to imply stronger deployment identity than was actually proven.

## Required V2 acceptance by slide

01 — Cover: small consistent footer logo; evidence chips are secondary; no claim that snapshot SHA equals deployment SHA.

02 — Overview: three roles are readable without zooming; explanatory copy is at presentation size; no tiny three-column miniature wall.

03 — Website start: one large hero browser and clear supporting points.

04 — Website flow: two large curated crops with explicit Step 1/Step 2 narrative; no unreadable full-page thumbnails.

05 — Owner request: one large phone plus three explanatory callouts; remove redundant overlapping phone.

06 — Owner house file: hard split between visual left and content right; zero phone/headline/body/bullet overlap.

07 — Tariffs: one large readable phone and one concise model explanation; no floating bottom badge over footer.

08 — Partner access: hard split between text and phone; no overlay box over the phone/headline; replace internal phrase “läuft zuerst durch Prüfung” with clear external language.

09 — Operations: one large representative work screen plus four readable functional callouts.

10 — Profile: headline becomes “Das Profil macht Qualität sichtbar.”; one large screen; no tiny UI catalogue.

11 — Flow: three clear process cards with stronger arrows and readable supporting copy.

12 — Evidence: snapshot, live health, DB readiness and screenshot date are separated. Explicitly state that without a deployment SHA no Git↔production identity is claimed.

13 — Website appendix: one dominant website view plus two readable supporting crops; no three full-page miniatures.

14 — App appendix: two representative large phones, one per role; no four-phone miniature catalogue.

15 — Close: product message only; no redundant technical evidence claims.

## Global V2 acceptance

- No content↔visual semantic collisions.
- No content/visual zone may enter the footer safe area.
- Footer logo is small and consistent.
- Presentation-facing text obeys the configured minimum font threshold.
- Primary screenshots obey minimum rendered dimensions and remain meaningful at presentation scale.
- Normal slides contain no more than three primary images.
- Phone ratios remain realistic.
- No absolute Mac/OCI asset path exists in deck source.
- All 15 final PNGs are visually inspected individually.
- PDF contains 15 pages; PPTX contains 15 slides; both come from accepted PNGs.
- Connector smoke test proves a valid deck passes and a synthetic semantic collision/undersized-text deck fails.

## Evidence semantics

Product snapshot: `3a8aa93054df7ec897c1dc3fec200ecf8526965a`.

Meaning: historical product/screenshot snapshot used to support what is shown. It is not automatically the presentation HEAD or production deployment SHA. Health `ok=true` and DB `ready` may be shown only as runtime health evidence. A deployment-SHA equality statement is intentionally omitted unless independently proven.

## Completion evidence

Fill this section only after execution:

- strict HTML QA: PASS (15 slides, 1280×720; source snapshot ancestor verified)
- connector positive smoke: PASS
- connector negative collision/readability fixture: PASS (semantic collision + undersized text rejected)
- render: PASS (15 PNGs at 1280×720)
- individual slide review 01–15: PASS (100% visual inspection)
- PDF page count: 15
- PPTX slide count: 15
- product branch/SHA: pending until commit
- wow-my-zsh branch/SHA: pending until commit
- remaining blocker: none
